import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { z } from "zod";

import {
  CONTACT_SETTINGS_ID,
  getDateKeyInTimeZone,
  isContactFormPaused,
  type ContactFormStatus,
} from "@/lib/contact-settings";
import { buildContactInquiryEmail } from "@/lib/contact-email";
import type { Database } from "@/lib/supabase/types";
import { BUDGETS, SERVICES } from "@/app/_landing/contact/contact-form-model";

// Simple in-memory rate limit: { [ip]: timestamp }
const rateLimit: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const CONTACT_EMAIL_SCHEMA = z.string().trim().email().max(120);
const CONTACT_PHONE_E164_PATTERN = /^\+[1-9]\d{6,14}$/;
const CONTACT_DEADLINE_PATTERN = /^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/;
const CONTACT_REQUEST_SCHEMA = z.object({
  name: z.string().trim().min(1).max(60),
  email: CONTACT_EMAIL_SCHEMA,
  telephone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || CONTACT_PHONE_E164_PATTERN.test(value),
      "Please enter a valid international phone number.",
    )
    .optional(),
  referral: z.string().trim().max(80).optional(),
  service: z.enum(SERVICES),
  budget: z.enum(BUDGETS),
  deadline: z.string().trim().regex(CONTACT_DEADLINE_PATTERN),
  region: z.enum(["local", "international"]),
  description: z.string().trim().min(1).max(1600),
});

function createServerSupabase(accessToken?: string) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      ...(accessToken
        ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        : {}),
    },
  );
}

async function readContactFormStatus(): Promise<ContactFormStatus> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("contact_settings")
    .select("paused, pause_until")
    .eq("id", CONTACT_SETTINGS_ID)
    .maybeSingle();

  if (error) throw error;

  const pauseUntil = data?.pause_until ?? null;
  const paused = isContactFormPaused(data?.paused ?? false, pauseUntil);
  return {
    paused,
    pauseUntil: paused ? pauseUntil : null,
  };
}

function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export async function GET() {
  try {
    const status = await readContactFormStatus();
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to read contact form settings:", error);
    return NextResponse.json(
      { error: "Could not load contact form availability." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function PUT(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const supabase = createServerSupabase(accessToken);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid or expired session." },
      { status: 401 },
    );
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    _user_id: user.id,
  });

  if (adminError || !isAdmin) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("paused" in body) ||
    typeof body.paused !== "boolean"
  ) {
    return NextResponse.json(
      { error: "A valid paused state is required." },
      { status: 400 },
    );
  }

  const pauseUntil = "pauseUntil" in body ? body.pauseUntil : null;
  if (
    pauseUntil !== null &&
    (typeof pauseUntil !== "string" || !isValidDateKey(pauseUntil))
  ) {
    return NextResponse.json(
      { error: "The pause end date is invalid." },
      { status: 400 },
    );
  }

  if (body.paused && pauseUntil && pauseUntil < getDateKeyInTimeZone()) {
    return NextResponse.json(
      { error: "The pause end date cannot be in the past." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("contact_settings")
    .upsert(
      {
        id: CONTACT_SETTINGS_ID,
        paused: body.paused,
        pause_until: body.paused ? pauseUntil : null,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      },
      { onConflict: "id" },
    )
    .select("paused, pause_until")
    .single();

  if (error) {
    console.error("Failed to update contact form settings:", error);
    return NextResponse.json(
      { error: "Could not save contact form settings." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    paused: isContactFormPaused(data.paused, data.pause_until),
    pauseUntil: data.pause_until,
  } satisfies ContactFormStatus);
}

export async function POST(req: NextRequest) {
  try {
    const status = await readContactFormStatus();
    if (status.paused) {
      return NextResponse.json(
        {
          error: status.pauseUntil
            ? `Commissions are currently paused until ${status.pauseUntil}.`
            : "Commissions are currently paused.",
          paused: true,
          pauseUntil: status.pauseUntil,
        },
        { status: 423 },
      );
    }
  } catch (error) {
    console.error("Failed to verify contact form availability:", error);
    return NextResponse.json(
      { error: "Contact requests are temporarily unavailable." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < RATE_LIMIT_WINDOW) {
    return NextResponse.json(
      { error: "Please wait before sending another message." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = CONTACT_REQUEST_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const inquiry = parsed.data;
  const [deadlineFrom, deadlineTo] = inquiry.deadline.split(" - ");
  if (
    !deadlineFrom ||
    !deadlineTo ||
    !isValidDateKey(deadlineFrom) ||
    !isValidDateKey(deadlineTo) ||
    deadlineFrom < getDateKeyInTimeZone() ||
    deadlineTo < deadlineFrom
  ) {
    return NextResponse.json(
      { error: "Please select a valid project date range." },
      { status: 400 },
    );
  }

  rateLimit[ip] = now;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = buildContactInquiryEmail({
    name: inquiry.name,
    email: inquiry.email,
    telephone: inquiry.telephone ?? null,
    referral: inquiry.referral ?? null,
    service: inquiry.service,
    budget: inquiry.budget,
    deadline: inquiry.deadline,
    region: inquiry.region,
    description: inquiry.description,
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
      to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
      replyTo: inquiry.email,
      ...emailContent,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 },
    );
  }
}
