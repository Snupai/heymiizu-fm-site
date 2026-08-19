import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

import {
  CONTACT_SETTINGS_ID,
  getDateKeyInTimeZone,
  isContactFormPaused,
  type ContactFormStatus,
} from "@/lib/contact-settings";
import type { Database } from "@/lib/supabase/types";

// Simple in-memory rate limit: { [ip]: timestamp }
const rateLimit: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

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

// Escape HTML to avoid injection in email template
function esc(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  rateLimit[ip] = now;

  const data = (await req.json()) as {
    name: string;
    email: string;
    telephone?: string;
    company?: string;
    projectType: string;
    sequenceLength: string;
    deadline?: string;
    assets: string;
    cooperation?: string;
    description: string;
  };
  const {
    name,
    email,
    telephone,
    company,
    projectType,
    sequenceLength,
    deadline,
    assets,
    cooperation,
    description,
  } = data;

  if (
    !name ||
    !email ||
    !projectType ||
    !sequenceLength ||
    !assets ||
    !description
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const deadlineDisplay =
    deadline && deadline.trim().length > 0 ? deadline : "No deadline";

  const mailOptions = {
    from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
    to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
    subject: `New Project Request from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nTelephone: ${telephone ?? "N/A"}\nCompany: ${company ?? "N/A"}\nProject Type: ${projectType}\nCommission Type: ${cooperation ?? "N/A"}\nSequence Length: ${sequenceLength}\nDeadline: ${deadlineDisplay}\nAny Assets: ${assets}\n\nDescription:\n${description}`,
    html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Project Request</title>
    <style>
      /* Prefer simple, inline-friendly styles for better client support */
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      /* Surface/backgrounds from style-guide */
      body { margin:0; padding:0; background:#e6f3ff; }
      .wrapper { width:100%; background:#e6f3ff; padding:24px 0; }
      .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08); }
      /* Brand header */
      .header { padding:20px 24px; background:linear-gradient(135deg,#0189ff,#006fd1); color:#ffffff; }
      .title { margin:0; font-size:20px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; }
      .content { padding:24px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; color:#0b0c0f; line-height:1.6; }
      .label { color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:.06em; margin:0 0 4px; }
      .value { margin:0 0 16px; font-size:14px; color:#0b0c0f; }
      .divider { height:1px; background:#e6e6e6; margin:8px 0 20px; }
      .badge { display:inline-block; padding:6px 12px; border-radius:999px; background:#e6f3ff; color:#0189ff; font-size:14px; font-weight:700; }
      .muted { color:#6b7280; font-size:12px; }
      .cta { display:inline-block; margin-top:12px; background:#0189ff; color:#ffffff !important; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:600; }
      @media (prefers-color-scheme: dark) {
        body, .wrapper { background:#0b0c0f !important; }
        .container { background:#0f172a !important; box-shadow:none; }
        .content { color:#e5e7eb !important; }
        .value { color:#e5e7eb !important; }
        .divider { background:#1f2937 !important; }
        .badge { background:rgba(1,137,255,0.12) !important; color:#9ccfff !important; }
        .cta { background:#0189ff !important; color:#ffffff !important; }
      }
    </style>
  </head>
  <body>
    <!-- Preheader text -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New project request from ${esc(name)}</div>
    <div class="wrapper">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="header">
                  <h1 class="title">New Project Request</h1>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p class="muted" style="margin:0 0 12px">You received a new inquiry via the contact form.</p>
                  <span class="badge">${esc(projectType)}</span>
                  <div class="divider"></div>

                  <p class="label">Name</p>
                  <p class="value">${esc(name)}</p>

                  <p class="label">Email</p>
                  <p class="value"><a href="mailto:${esc(email)}" style="color:#0189ff; text-decoration:underline;">${esc(email)}</a></p>

                  <p class="label">Telephone</p>
                  <p class="value">${esc(telephone ?? "N/A")}</p>

                  <p class="label">Company</p>
                  <p class="value">${esc(company ?? "N/A")}</p>

                  <p class="label">Commission Type</p>
                  <p class="value">${esc(cooperation ?? "N/A")}</p>

                  <p class="label">Sequence Length</p>
                  <p class="value">${esc(sequenceLength)}</p>

                  <p class="label">Deadline</p>
                  <p class="value">${esc(deadlineDisplay)}</p>

                  <p class="label">Any Assets</p>
                  <p class="value">${esc(assets)}</p>

                  <div class="divider"></div>
                  <p class="label">Description</p>
                  <p class="value">${esc(description).replace(/\n/g, "<br>")}</p>
                  <p class="muted" style="margin-top:16px;">This message was generated from your website contact form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
    `,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 },
    );
  }
}
