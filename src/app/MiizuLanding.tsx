"use client";

import {
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import IntlTelInput from "@intl-tel-input/react";
import type { ValidationError } from "intl-tel-input";
import { ArrowUpRight, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent, PointerEvent } from "react";
import type { DateRange } from "react-day-picker";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  formatPauseUntilDate,
  type ContactFormStatus,
} from "@/lib/contact-settings";

import styles from "./miizu-landing.module.css";

const CONTACT_HEADLINES = [
  <>
    You&rsquo;re launching&hellip;
    <br />
    <span>without me?</span>
  </>,
  <>
    Got a fresh product&hellip;
    <br />
    <span>and you need to make it MOVE</span>
  </>,
  <>
    Building something wild
    <br />
    <span>and need visuals to match?</span>
  </>,
  <>
    Got a CRAZY idea
    <br />
    <span>and need people to see it?</span>
  </>,
  <>
    Got something BIIIG
    <br />
    <span>and you just need to advertise it?</span>
  </>,
];

const CLIENTS = [
  "Duolingo",
  "Finanzguru",
  "Revolut",
  "Anyfin",
  "Shoop",
  "Carvertical",
  "Adobe",
  "Formelskin",
  "HOLY",
  "Airalo",
];
const CLIENT_MARQUEE_ROWS = 7;

const SERVICES = [
  "Launch campaign",
  "Trailer",
  "Keynote visuals",
  "Brand placement",
  "Social media content",
  "Something else",
];

const BUDGETS = ["5 - 10k", "10 - 25k", "25 - 50k", "50 - 100k", "100k+"];
const SERVICE_ITEMS = [
  { label: "Choose a service", value: null },
  ...SERVICES.map((service) => ({ label: service, value: service })),
];
const BUDGET_ITEMS = [
  { label: "Choose a range", value: null },
  ...BUDGETS.map((budget) => ({ label: budget, value: budget })),
];
const NUVIA_TOOLTIP_HOVER_DELAY_MS = 2_000;
const NUVIA_POST_TOUCH_SUPPRESSION_MS = 900;
const CONTACT_EMAIL_SCHEMA = z.string().trim().email().max(120);

const loadPhoneUtils = () => import("intl-tel-input/utils");

type ContactData = {
  name: string;
  email: string;
  telephone: string;
  referral: string;
  service: string;
  budget: string;
  deadline: string;
  description: string;
};

type ValidatedContactField = Exclude<keyof ContactData, "referral">;

const INITIAL_CONTACT_DATA: ContactData = {
  name: "",
  email: "",
  telephone: "",
  referral: "",
  service: "",
  budget: "",
  deadline: "",
  description: "",
};

const INITIAL_TOUCHED_FIELDS: Record<ValidatedContactField, boolean> = {
  name: false,
  email: false,
  telephone: false,
  service: false,
  budget: false,
  deadline: false,
  description: false,
};

const ALL_CONTACT_FIELDS_TOUCHED: Record<ValidatedContactField, boolean> = {
  name: true,
  email: true,
  telephone: true,
  service: true,
  budget: true,
  deadline: true,
  description: true,
};

function formatContactDate(date: Date | undefined) {
  if (!date) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatContactDateRange(range: DateRange | undefined) {
  if (!range?.from) return "";
  if (!range.to) return formatContactDate(range.from);

  return `${formatContactDate(range.from)} – ${formatContactDate(range.to)}`;
}

function getContactDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isAvailableContactDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate >= today;
}

function getEmailValidationMessage(email: string) {
  if (!email.trim()) return "Please enter your email address.";
  if (!CONTACT_EMAIL_SCHEMA.safeParse(email).success) {
    return "Please enter a valid email address.";
  }
  return null;
}

function getPhoneValidationMessage(
  phone: string,
  isValid: boolean,
  errorCode: ValidationError | null,
) {
  if (!phone || isValid) return null;

  switch (errorCode) {
    case "INVALID_COUNTRY_CODE":
      return "Please choose a valid country code.";
    case "TOO_SHORT":
      return "This phone number is too short.";
    case "TOO_LONG":
      return "This phone number is too long.";
    case "IS_POSSIBLE_LOCAL_ONLY":
      return "Please include the area or country code.";
    default:
      return "Please enter a valid phone number.";
  }
}

function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function supportsFineHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function ContactForm({
  compact,
  region,
}: {
  compact: boolean;
  region: "local" | "international";
}) {
  const [data, setData] = useState<ContactData>(INITIAL_CONTACT_DATA);
  const [status, setStatus] = useState<ContactFormStatus>({
    paused: false,
    pauseUntil: null,
  });
  const [statusLoading, setStatusLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deadlineRange, setDeadlineRange] = useState<DateRange | undefined>();
  const [deadlineMonth, setDeadlineMonth] = useState<Date | undefined>();
  const [touchedFields, setTouchedFields] = useState(INITIAL_TOUCHED_FIELDS);
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [phoneErrorCode, setPhoneErrorCode] = useState<ValidationError | null>(
    null,
  );
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("example.supabase.co")) {
        setStatusLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        setStatus((await response.json()) as ContactFormStatus);
      } catch {
        // Submission still checks the server-side pause state.
      } finally {
        if (!controller.signal.aborted) setStatusLoading(false);
      }
    }

    void loadStatus();
    return () => controller.abort();
  }, []);

  const updateField = (field: keyof ContactData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setResult(null);
  };

  const markFieldTouched = (field: ValidatedContactField) => {
    setTouchedFields((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  };

  const updatePhone = (phone: string) => {
    setData((current) =>
      current.telephone === phone ? current : { ...current, telephone: phone },
    );
    setResult((current) =>
      phone === "" && current?.type === "success" ? current : null,
    );
    if (phone) markFieldTouched("telephone");
  };

  const updateDeadlineRange = (range: DateRange | undefined) => {
    const from =
      range?.from && isAvailableContactDate(range.from)
        ? range.from
        : undefined;
    const to =
      range?.to && isAvailableContactDate(range.to) ? range.to : undefined;
    const availableRange = from ? { from, to } : undefined;

    setDeadlineRange(availableRange);
    if (from) setDeadlineMonth(from);
    updateField(
      "deadline",
      from && to ? `${getContactDateKey(from)} - ${getContactDateKey(to)}` : "",
    );
  };

  const nameValidationMessage = data.name.trim()
    ? null
    : "Please enter your name.";
  const emailValidationMessage = getEmailValidationMessage(data.email);
  const phoneValidationMessage = getPhoneValidationMessage(
    data.telephone,
    phoneIsValid,
    phoneErrorCode,
  );
  const serviceValidationMessage = data.service
    ? null
    : "Please choose a service.";
  const budgetValidationMessage = data.budget
    ? null
    : "Please choose a budget range.";
  const deadlineValidationMessage = !deadlineRange?.from
    ? "Please select a project date range."
    : !deadlineRange.to || !data.deadline
      ? "Please select an end date."
      : null;
  const descriptionValidationMessage = data.description.trim()
    ? null
    : "Please tell me a little about your project.";

  const nameError = touchedFields.name ? nameValidationMessage : null;
  const emailError = touchedFields.email ? emailValidationMessage : null;
  const phoneError = touchedFields.telephone ? phoneValidationMessage : null;
  const serviceError = touchedFields.service ? serviceValidationMessage : null;
  const budgetError = touchedFields.budget ? budgetValidationMessage : null;
  const deadlineError = touchedFields.deadline
    ? deadlineValidationMessage
    : null;
  const descriptionError = touchedFields.description
    ? descriptionValidationMessage
    : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || status.paused || statusLoading) return;

    setTouchedFields(ALL_CONTACT_FIELDS_TOUCHED);

    if (
      nameValidationMessage ||
      emailValidationMessage ||
      phoneValidationMessage ||
      serviceValidationMessage ||
      budgetValidationMessage ||
      deadlineValidationMessage ||
      descriptionValidationMessage
    ) {
      setResult(null);
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email.trim(),
          telephone: data.telephone,
          company: data.referral
            ? `Found via: ${data.referral}`
            : "Not specified",
          projectType: data.service,
          sequenceLength: data.budget,
          deadline: data.deadline,
          assets: "To be discussed",
          cooperation: region === "local" ? "Local (Germany)" : "International",
          description: data.description,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        paused?: boolean;
        pauseUntil?: string | null;
      };

      if (!response.ok) {
        if (payload.paused) {
          setStatus({ paused: true, pauseUntil: payload.pauseUntil ?? null });
        }
        throw new Error(payload.error ?? "Your request could not be sent.");
      }

      setData(INITIAL_CONTACT_DATA);
      setDeadlineRange(undefined);
      setDeadlineMonth(undefined);
      setTouchedFields(INITIAL_TOUCHED_FIELDS);
      setPhoneIsValid(false);
      setPhoneErrorCode(null);
      setResult({
        type: "success",
        message: "Request sent. I’ll be in touch soon.",
      });
    } catch (error) {
      setResult({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your request could not be sent.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = status.paused || statusLoading || submitting;

  return (
    <div className={styles.formShell} id="contact-form">
      {status.paused && (
        <div className={styles.pausedNotice} role="status">
          <span>Commissions paused</span>
          <strong>I&rsquo;m currently booked out.</strong>
          <p>
            New requests will reopen
            {status.pauseUntil
              ? ` on ${formatPauseUntilDate(status.pauseUntil)}`
              : " soon"}
            .
          </p>
        </div>
      )}

      <form
        className={`${styles.contactForm} ${status.paused ? styles.formPaused : ""}`}
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset disabled={disabled}>
          <label htmlFor="contact-name">
            <span>what should i call you?</span>
            <input
              id="contact-name"
              aria-describedby={nameError ? "contact-name-error" : undefined}
              aria-invalid={Boolean(nameError)}
              autoComplete="name"
              maxLength={60}
              onBlur={() => markFieldTouched("name")}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Type your Name"
              required
              value={data.name}
            />
            <div className={styles.fieldFeedback}>
              {nameError && (
                <small
                  className={styles.fieldError}
                  id="contact-name-error"
                  role="alert"
                >
                  {nameError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="contact-email">
            <span>where do i reach you?</span>
            <input
              id="contact-email"
              aria-describedby={emailError ? "contact-email-error" : undefined}
              aria-invalid={Boolean(emailError)}
              autoComplete="email"
              maxLength={120}
              onBlur={() => markFieldTouched("email")}
              onChange={(event) => updateField("email", event.target.value)}
              onInvalid={(event) => {
                event.preventDefault();
                markFieldTouched("email");
              }}
              placeholder="Type your Email"
              required
              type="email"
              value={data.email}
            />
            <div className={styles.fieldFeedback}>
              {emailError && (
                <small
                  className={styles.fieldError}
                  id="contact-email-error"
                  role="alert"
                >
                  {emailError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="contact-phone">
            <span>what&rsquo;s the best number to reach you?</span>
            <IntlTelInput
              containerClass={styles.phoneInput}
              countryOrder={["de", "gb", "us"]}
              disabled={disabled}
              initialCountry="de"
              inputProps={{
                id: "contact-phone",
                "aria-describedby": phoneError
                  ? "contact-phone-error"
                  : undefined,
                "aria-invalid": Boolean(phoneError),
                autoComplete: "tel",
                onBlur: () => markFieldTouched("telephone"),
                placeholder: "Phone number (optional)",
              }}
              loadUtils={loadPhoneUtils}
              onChangeErrorCode={setPhoneErrorCode}
              onChangeNumber={updatePhone}
              onChangeValidity={setPhoneIsValid}
              value={data.telephone}
            />
            <div className={styles.fieldFeedback}>
              {phoneError && (
                <small
                  className={styles.fieldError}
                  id="contact-phone-error"
                  role="alert"
                >
                  {phoneError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="contact-referral">
            <span>how did you find me?</span>
            <input
              id="contact-referral"
              maxLength={80}
              onChange={(event) => updateField("referral", event.target.value)}
              placeholder="Instagram, LinkedIn, X ..."
              value={data.referral}
            />
            <div aria-hidden="true" className={styles.fieldFeedback} />
          </label>

          <label htmlFor="service">
            <span>what service do you need?</span>
            <Select
              disabled={disabled}
              items={SERVICE_ITEMS}
              name="service"
              onValueChange={(value) => {
                updateField("service", value ?? "");
                markFieldTouched("service");
              }}
              required
              value={data.service || null}
            >
              <SelectTrigger
                id="service"
                aria-describedby={
                  serviceError ? "contact-service-error" : undefined
                }
                aria-invalid={Boolean(serviceError)}
                aria-label="What service do you need?"
                data-contact-select
                onBlur={() => markFieldTouched("service")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className={styles.contactSelectContent}
              >
                <SelectGroup>
                  {SERVICE_ITEMS.map((item) => (
                    <SelectItem
                      className={styles.contactSelectItem}
                      key={item.value ?? "service-placeholder"}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className={styles.fieldFeedback}>
              {serviceError && (
                <small
                  className={styles.fieldError}
                  id="contact-service-error"
                  role="alert"
                >
                  {serviceError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="budget">
            <span>what&rsquo;s your budget?</span>
            <Select
              disabled={disabled}
              items={BUDGET_ITEMS}
              name="budget"
              onValueChange={(value) => {
                updateField("budget", value ?? "");
                markFieldTouched("budget");
              }}
              required
              value={data.budget || null}
            >
              <SelectTrigger
                id="budget"
                aria-describedby={
                  budgetError ? "contact-budget-error" : undefined
                }
                aria-invalid={Boolean(budgetError)}
                aria-label="What is your budget?"
                data-contact-select
                onBlur={() => markFieldTouched("budget")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className={styles.contactSelectContent}
              >
                <SelectGroup>
                  {BUDGET_ITEMS.map((item) => (
                    <SelectItem
                      className={styles.contactSelectItem}
                      key={item.value ?? "budget-placeholder"}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className={styles.fieldFeedback}>
              {budgetError && (
                <small
                  className={styles.fieldError}
                  id="contact-budget-error"
                  role="alert"
                >
                  {budgetError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="deadline-picker">
            <span>project date range</span>
            <Popover
              onOpenChange={(open) => {
                if (!open) markFieldTouched("deadline");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  id="deadline-picker"
                  aria-describedby={
                    deadlineError ? "deadline-error" : undefined
                  }
                  aria-invalid={Boolean(deadlineError)}
                  className={styles.dateRangePickerButton}
                  data-date-range-picker
                  data-empty={!deadlineRange?.from}
                  type="button"
                  variant="outline"
                >
                  <span>
                    {deadlineRange?.from
                      ? formatContactDateRange(deadlineRange)
                      : "Pick a date range"}
                  </span>
                  <CalendarIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className={`w-auto ${styles.contactDatePopover}`}
              >
                <Calendar
                  className={styles.contactCalendar}
                  mode="range"
                  captionLayout="dropdown"
                  disabled={(date) => !isAvailableContactDate(date)}
                  min={1}
                  month={deadlineMonth}
                  numberOfMonths={compact ? 1 : 2}
                  onMonthChange={setDeadlineMonth}
                  onSelect={updateDeadlineRange}
                  selected={deadlineRange}
                />
              </PopoverContent>
            </Popover>
            <div className={styles.fieldFeedback}>
              {deadlineError && (
                <small
                  className={styles.fieldError}
                  id="deadline-error"
                  role="alert"
                >
                  {deadlineError}
                </small>
              )}
            </div>
          </label>

          <label htmlFor="project-description">
            <span>what are you up to?</span>
            <Textarea
              id="project-description"
              aria-describedby={
                descriptionError ? "project-description-error" : undefined
              }
              aria-invalid={Boolean(descriptionError)}
              maxLength={1600}
              onBlur={() => markFieldTouched("description")}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="What are you launching?"
              required
              rows={3}
              value={data.description}
            />
            <div className={styles.fieldFeedback}>
              {descriptionError && (
                <small
                  className={styles.fieldError}
                  id="project-description-error"
                  role="alert"
                >
                  {descriptionError}
                </small>
              )}
            </div>
          </label>

          <button
            className={styles.submitButton}
            disabled={disabled}
            type="submit"
          >
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </fieldset>

        {result && (
          <p
            className={
              result.type === "success" ? styles.formSuccess : styles.formError
            }
            role="status"
          >
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}

type CanvasWithLetterSpacing = CanvasRenderingContext2D & {
  letterSpacing?: string;
};

function applyNvaCanvasFont(
  context: CanvasRenderingContext2D,
  computed: CSSStyleDeclaration,
  letterSpacing: number,
) {
  context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
  context.fontKerning = "normal";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  const typed = context as CanvasWithLetterSpacing;
  if (typeof typed.letterSpacing === "string") {
    typed.letterSpacing = `${letterSpacing}px`;
  }
}

function measureNvaInk(computed: CSSStyleDeclaration, fontSize: number) {
  const text = "NVA";
  const letterSpacing = Number.parseFloat(computed.letterSpacing) || 0;
  const sampleScale = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return null;

  applyNvaCanvasFont(context, computed, letterSpacing);
  const metrics = context.measureText(text);
  const hasCanvasTracking =
    typeof (context as CanvasWithLetterSpacing).letterSpacing === "string";
  const padding = Math.ceil(fontSize * 0.5);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize * 0.9);
  const descent = Math.ceil(
    metrics.actualBoundingBoxDescent || fontSize * 0.25,
  );
  const trackedWidth =
    metrics.width +
    (hasCanvasTracking ? 0 : Math.abs(letterSpacing) * text.length);

  canvas.width = Math.ceil((trackedWidth + padding * 2) * sampleScale);
  canvas.height = Math.ceil((ascent + descent + padding * 2) * sampleScale);
  context.setTransform(sampleScale, 0, 0, sampleScale, 0, 0);
  applyNvaCanvasFont(context, computed, letterSpacing);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";

  if (hasCanvasTracking) {
    context.fillText(text, padding, padding + ascent);
  } else {
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (!character) continue;

      const prefix = text.slice(0, index + 1);
      const characterWidth = context.measureText(character).width;
      const characterX =
        padding +
        context.measureText(prefix).width -
        characterWidth +
        letterSpacing * index;

      context.fillText(character, characterX, padding + ascent);
    }
  }

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const alphaThreshold = 128;
  let firstInkPixel = canvas.width;
  let lastInkPixel = -1;

  for (let index = 3; index < pixels.length; index += 4) {
    const alpha = pixels[index];
    if (alpha === undefined || alpha < alphaThreshold) continue;
    const pixelX = ((index - 3) / 4) % canvas.width;
    firstInkPixel = Math.min(firstInkPixel, pixelX);
    lastInkPixel = Math.max(lastInkPixel, pixelX);
  }

  if (lastInkPixel < firstInkPixel) return null;

  const pixelInkLeft = firstInkPixel / sampleScale - padding;
  const pixelInkRight = (lastInkPixel + 1) / sampleScale - padding;
  const metricsInkLeft = Number.isFinite(metrics.actualBoundingBoxLeft)
    ? -metrics.actualBoundingBoxLeft
    : pixelInkLeft;
  const metricsInkRight = Number.isFinite(metrics.actualBoundingBoxRight)
    ? metrics.actualBoundingBoxRight
    : pixelInkRight;
  const inkLeft = Math.max(pixelInkLeft, metricsInkLeft);
  const inkRight = Math.max(pixelInkRight, metricsInkRight);
  const inkWidth = inkRight - inkLeft;

  if (!Number.isFinite(inkWidth) || inkWidth <= 0) return null;

  return { inkLeft, inkWidth };
}

function anchorRepresentedBy(word: HTMLElement, label: HTMLElement) {
  const panel = word.parentElement?.parentElement;
  const textNode = word.firstChild;

  if (!panel || textNode?.nodeType !== Node.TEXT_NODE) return;

  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, 1);
  const nRect = range.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  range.detach();

  if (nRect.width < 2 || nRect.height < 2 || panelRect.height < 2) return;

  const computed = window.getComputedStyle(word);
  const letterSpacing = Number.parseFloat(computed.letterSpacing);
  const scaleX = new DOMMatrix(computed.transform).a || 1;
  const visualTracking = Number.isFinite(letterSpacing)
    ? Math.abs(letterSpacing * scaleX)
    : 0;
  const inkWidth = Math.max(1, nRect.width - visualTracking);
  const yAbs = panelRect.top + panelRect.height * 0.28;
  const alongGlyph = (yAbs - nRect.top) / nRect.height;
  const xAbs = nRect.left + inkWidth * alongGlyph;

  label.style.setProperty("--n-x", `${xAbs - panelRect.left}px`);
  label.style.setProperty("--n-y", `${yAbs - panelRect.top}px`);
  label.style.setProperty(
    "--n-angle",
    `${(Math.atan2(nRect.height, inkWidth) * 180) / Math.PI}deg`,
  );
  label.style.fontSize = `${Math.min(16, Math.max(11, panelRect.height * 0.048))}px`;
}

export default function MiizuLanding() {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const clientMarqueesRef = useRef<HTMLDivElement>(null);
  const nuviaWordmarkRef = useRef<HTMLDivElement>(null);
  const representedByRef = useRef<HTMLSpanElement>(null);
  const nuviaTooltipReady = useRef(false);
  const nuviaTooltipHoverTimer = useRef<number | null>(null);
  const lastNuviaTouchAt = useRef(-Infinity);
  const nuviaTooltipX = useMotionValue(0);
  const nuviaTooltipY = useMotionValue(0);
  const nuviaTooltipFollowX = useSpring(nuviaTooltipX, {
    stiffness: 420,
    damping: 32,
    mass: 0.35,
  });
  const nuviaTooltipFollowY = useSpring(nuviaTooltipY, {
    stiffness: 420,
    damping: 32,
    mass: 0.35,
  });
  const [nuviaTooltipVisible, setNuviaTooltipVisible] = useState(false);
  const [nuviaTooltipTouch, setNuviaTooltipTouch] = useState(false);
  const [nuviaTooltipMounted, setNuviaTooltipMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [region, setRegion] = useState<"local" | "international">(
    "international",
  );
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    const layoutFrame = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      window.removeEventListener("pageshow", resetScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setNuviaTooltipMounted(true);

    return () => {
      if (nuviaTooltipHoverTimer.current !== null) {
        window.clearTimeout(nuviaTooltipHoverTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    setHeadlineIndex(Math.floor(Math.random() * CONTACT_HEADLINES.length));
  }, []);

  useEffect(() => {
    const tracks = clientMarqueesRef.current;

    if (!tracks || reduceMotion) return;

    let animations: Animation[] = [];
    let lastScrollY = window.scrollY;
    let lastScrollAt = window.performance.now();
    let decelerationFrame = 0;
    let idleTimer = 0;

    const getAnimations = () => {
      if (animations.length === 0) {
        animations = tracks.getAnimations({ subtree: true });
      }

      return animations;
    };

    const updateRate = (rate: number) => {
      for (const animation of getAnimations()) {
        animation.updatePlaybackRate(rate);
      }
    };

    const decelerate = () => {
      const currentAnimations = getAnimations();

      if (currentAnimations.length === 0) return;

      const currentRate = Math.max(
        ...currentAnimations.map((animation) => animation.playbackRate),
      );
      const nextRate = 1 + (currentRate - 1) * 0.82;

      if (nextRate - 1 < 0.02) {
        updateRate(1);
        decelerationFrame = 0;
        return;
      }

      updateRate(nextRate);
      decelerationFrame = window.requestAnimationFrame(decelerate);
    };

    const accelerateMarquee = () => {
      const currentAnimations = getAnimations();

      if (currentAnimations.length === 0) return;

      const now = window.performance.now();
      const distance = Math.abs(window.scrollY - lastScrollY);
      const elapsed = Math.max(16, Math.min(64, now - lastScrollAt));
      const velocity = distance / elapsed;
      const boostedRate = Math.min(6, 1 + velocity * 1.4);

      lastScrollY = window.scrollY;
      lastScrollAt = now;

      window.cancelAnimationFrame(decelerationFrame);
      window.clearTimeout(idleTimer);
      updateRate(
        Math.max(
          boostedRate,
          ...currentAnimations.map((animation) => animation.playbackRate),
        ),
      );

      idleTimer = window.setTimeout(() => {
        decelerationFrame = window.requestAnimationFrame(decelerate);
      }, 90);
    };

    window.addEventListener("scroll", accelerateMarquee, { passive: true });

    return () => {
      window.removeEventListener("scroll", accelerateMarquee);
      window.cancelAnimationFrame(decelerationFrame);
      window.clearTimeout(idleTimer);
      for (const animation of animations) {
        animation.updatePlaybackRate(1);
      }
    };
  }, [reduceMotion]);

  useEffect(() => {
    const wordmark = nuviaWordmarkRef.current;

    if (!wordmark) return;

    const fitWordmark = () => {
      const words = [
        ...wordmark.querySelectorAll<HTMLElement>(`.${styles.nuviaWord}`),
      ];
      const word =
        words.find((el) => window.getComputedStyle(el).display !== "none") ??
        words[0];

      if (!word) return;

      const computed = window.getComputedStyle(word);
      const fontSize = Number.parseFloat(computed.fontSize);

      if (!Number.isFinite(fontSize) || fontSize <= 0) return;

      const ink = measureNvaInk(computed, fontSize);
      if (!ink) return;

      const bleed = 1;
      const shift = -ink.inkLeft - bleed;
      wordmark.style.width = `${Math.ceil(ink.inkWidth)}px`;
      wordmark.style.setProperty("--nva-shift", `${shift}px`);

      const label = representedByRef.current;
      if (label) anchorRepresentedBy(word, label);
    };

    const resizeObserver = new ResizeObserver(fitWordmark);
    resizeObserver.observe(wordmark);
    window.addEventListener("resize", fitWordmark);
    void document.fonts.ready.then(fitWordmark);
    fitWordmark();
    let layoutFrame = window.requestAnimationFrame(() => {
      layoutFrame = window.requestAnimationFrame(fitWordmark);
    });

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitWordmark);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: clientsProgress } = useScroll({
    target: clientsRef,
    offset: ["start end", "end start"],
  });

  const panelX = useTransform(
    scrollYProgress,
    [0, 0.29, 0.54, 1],
    compact ? ["-5vw", "-5vw", "0vw", "0vw"] : ["-3vw", "-3vw", "0vw", "0vw"],
  );
  const panelY = useTransform(
    scrollYProgress,
    [0, 0.29, 0.54, 1],
    compact
      ? ["43svh", "43svh", "0svh", "0svh"]
      : ["9svh", "9svh", "0svh", "0svh"],
  );
  const panelScaleX = useTransform(
    scrollYProgress,
    [0, 0.29, 0.54, 1],
    compact ? [0.9, 0.9, 1, 1] : [0.31, 0.31, 1, 1],
  );
  const panelScaleY = useTransform(
    scrollYProgress,
    [0, 0.29, 0.54, 1],
    compact ? [0.51, 0.51, 1, 1] : [0.82, 0.82, 1, 1],
  );
  const cardScaleX = useTransform(panelScaleX, (value) => 1 / value);
  const cardScaleY = useTransform(panelScaleY, (value) => 1 / value);
  const visualRadius = useTransform(
    scrollYProgress,
    [0, 0.35, 0.54],
    [2.6, 2.6, 0],
  );
  const panelRadius = useTransform(() => {
    const radius = visualRadius.get();
    const scaleX = Math.max(panelScaleX.get(), 0.001);
    const scaleY = Math.max(panelScaleY.get(), 0.001);
    return `${radius / scaleX}rem / ${radius / scaleY}rem`;
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25, 0.39], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.39], ["0vh", "-6vh"]);
  const cardLabelOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.8],
    [1, 1, 0],
  );
  const workShadeX = useTransform(
    scrollYProgress,
    [0.7, 0.95],
    ["-100%", "0%"],
  );
  const workOpacity = useTransform(scrollYProgress, [0, 0.75, 0.94], [0, 0, 1]);
  const workX = useTransform(scrollYProgress, [0.7, 0.96], ["-18vw", "0vw"]);
  const railOpacity = useTransform(
    clientsProgress,
    compact ? [0, 0.025, 0.075, 1] : [0, 0.03, 0.12, 1],
    [0, 0.35, 1, 1],
  );
  const headline = CONTACT_HEADLINES[headlineIndex];
  const bookingUrl =
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "mailto:hey@miizumelon.com?subject=Let%27s%20book%20a%20call";

  const openWork = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    const travel = Math.max(0, scene.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: scene.offsetTop + travel * 0.56,
      behavior: "smooth",
    });
  };

  const placeNuviaTooltip = (
    event: PointerEvent<HTMLElement>,
    instant = false,
  ) => {
    const x = event.clientX;
    const y = event.clientY;

    if (instant || !nuviaTooltipReady.current) {
      nuviaTooltipX.jump(x);
      nuviaTooltipY.jump(y);
      nuviaTooltipReady.current = true;
      return;
    }

    nuviaTooltipX.set(x);
    nuviaTooltipY.set(y);
  };

  const showNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      !supportsFineHover() ||
      window.performance.now() - lastNuviaTouchAt.current <
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      return;

    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
    }

    setNuviaTooltipTouch(false);
    placeNuviaTooltip(event, true);
    nuviaTooltipHoverTimer.current = window.setTimeout(() => {
      nuviaTooltipHoverTimer.current = null;
      setNuviaTooltipVisible(true);
    }, NUVIA_TOOLTIP_HOVER_DELAY_MS);
  };

  const hideNuviaTooltip = () => {
    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
      nuviaTooltipHoverTimer.current = null;
    }

    nuviaTooltipReady.current = false;
    setNuviaTooltipTouch(false);
    setNuviaTooltipVisible(false);
  };

  const moveNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      placeNuviaTooltip(event);
  };

  const leaveNuviaTooltip = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "touch" &&
      supportsFineHover() &&
      window.performance.now() - lastNuviaTouchAt.current >=
        NUVIA_POST_TOUCH_SUPPRESSION_MS
    )
      hideNuviaTooltip();
  };

  const toggleNuviaTouchTooltip = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") return;

    if (nuviaTooltipHoverTimer.current !== null) {
      window.clearTimeout(nuviaTooltipHoverTimer.current);
      nuviaTooltipHoverTimer.current = null;
    }

    lastNuviaTouchAt.current = window.performance.now();
    event.preventDefault();

    if (nuviaTooltipTouch && nuviaTooltipVisible) {
      hideNuviaTooltip();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerY = Math.min(
      window.innerHeight - 48,
      Math.max(48, rect.top + rect.height / 2),
    );

    nuviaTooltipX.jump(window.innerWidth / 2);
    nuviaTooltipY.jump(centerY);
    nuviaTooltipReady.current = true;
    setNuviaTooltipTouch(true);
    setNuviaTooltipVisible(true);
  };

  useEffect(() => {
    if (!nuviaTooltipTouch || !nuviaTooltipVisible) return;

    const dismissTouchTooltip = () => {
      nuviaTooltipReady.current = false;
      setNuviaTooltipTouch(false);
      setNuviaTooltipVisible(false);
    };
    const dismissOutside = (event: globalThis.PointerEvent) => {
      const panel = nuviaWordmarkRef.current?.parentElement;
      if (panel?.contains(event.target as Node)) return;
      dismissTouchTooltip();
    };

    document.addEventListener("pointerdown", dismissOutside);
    window.addEventListener("scroll", dismissTouchTooltip, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      window.removeEventListener("scroll", dismissTouchTooltip);
    };
  }, [nuviaTooltipTouch, nuviaTooltipVisible]);

  return (
    <main className={styles.site}>
      <div className={styles.heroWorkScene} id="hero" ref={sceneRef}>
        <div className={styles.stickyStage}>
          <motion.header
            className={styles.header}
            style={{ opacity: heroOpacity }}
          >
            <button onClick={openWork} type="button">
              look at me
            </button>
            <Link href="#hero" aria-label="Back to the top">
              miizumelon
            </Link>
            <button onClick={() => scrollToId("contact")} type="button">
              Contact
            </button>
          </motion.header>

          <motion.div
            className={styles.heroCopy}
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <h1>
              <span className={styles.printHey}>Hey</span>
              <span>I&rsquo;m Miizu</span>
            </h1>
            <span aria-hidden="true" className={styles.handwrittenHey}>
              Hey
            </span>
          </motion.div>

          <motion.button
            aria-label="Open the work section"
            className={styles.scrollHint}
            onClick={openWork}
            style={{ opacity: heroOpacity }}
            type="button"
          >
            scroll
          </motion.button>

          <motion.section
            aria-label="Showreel and selected work"
            className={styles.showreelPanel}
            id="work"
            style={{
              borderRadius: panelRadius,
              scaleX: panelScaleX,
              scaleY: panelScaleY,
              x: panelX,
              y: panelY,
            }}
          >
            <motion.div
              aria-hidden="true"
              className={styles.workShade}
              style={{ x: workShadeX }}
            />

            <motion.button
              className={styles.cardLabel}
              onClick={openWork}
              style={{
                opacity: cardLabelOpacity,
                scaleX: cardScaleX,
                scaleY: cardScaleY,
              }}
              type="button"
            >
              Showreel video
            </motion.button>

            <motion.div
              className={styles.workContent}
              style={{ opacity: workOpacity, x: workX }}
            >
              <div className={styles.workList}>
                <p>I&rsquo;ve directed</p>
                <strong>
                  Launches
                  <br />
                  Trailers
                  <br />
                  Keynotes
                  <br />
                  Placements
                </strong>
                <p>
                  for brands
                  <br />
                  and creators
                </p>
              </div>
              <h2>
                Showreel video
                <br />
                <span>(customized for web)</span>
              </h2>
            </motion.div>
          </motion.section>
        </div>
      </div>

      <section
        className={styles.clientsScene}
        id="clients"
        ref={clientsRef}
        aria-label="Selected clients"
      >
        <div className={styles.clientsBridge}>
          <motion.div
            className={styles.clientsRail}
            style={{ opacity: railOpacity }}
          >
            <span className={styles.clientsLabel}>selected clients</span>
            <div className={styles.clientMarquees} ref={clientMarqueesRef}>
              {Array.from({ length: CLIENT_MARQUEE_ROWS }, (_, row) => (
                <div
                  aria-hidden={row > 0}
                  className={styles.clientMarquee}
                  key={row}
                >
                  <div className={styles.clientNames}>
                    {[0, 1].map((copy) => (
                      <div
                        aria-hidden={copy === 1}
                        className={styles.clientGroup}
                        key={`${row}-${copy}`}
                      >
                        {CLIENTS.map((client) => (
                          <span key={`${row}-${copy}-${client}`}>{client}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.contactScene} id="contact">
        <div className={styles.contactSection}>
          <div className={styles.contactPitch}>
            <div>
              <h2>{headline}</h2>
              <LayoutGroup id="region-toggle">
                <div
                  className={styles.regionToggle}
                  role="group"
                  aria-label="Project location"
                >
                  <button
                    aria-pressed={region === "local"}
                    className={region === "local" ? styles.regionActive : ""}
                    onClick={() => setRegion("local")}
                    type="button"
                  >
                    {region === "local" ? (
                      <motion.span
                        aria-hidden="true"
                        className={styles.regionPill}
                        layoutId="region-pill"
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 28,
                          mass: 0.6,
                        }}
                      />
                    ) : null}
                    <span className={styles.regionToggleLabel}>
                      Local <small>(Germany)</small>
                    </span>
                  </button>
                  <button
                    aria-pressed={region === "international"}
                    className={
                      region === "international" ? styles.regionActive : ""
                    }
                    onClick={() => setRegion("international")}
                    type="button"
                  >
                    {region === "international" ? (
                      <motion.span
                        aria-hidden="true"
                        className={styles.regionPill}
                        layoutId="region-pill"
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 28,
                          mass: 0.6,
                        }}
                      />
                    ) : null}
                    <span className={styles.regionToggleLabel}>
                      International
                    </span>
                  </button>
                </div>
              </LayoutGroup>
            </div>

            <div className={styles.directContact}>
              <a
                className={styles.bookCall}
                href={bookingUrl}
                rel={bookingUrl.startsWith("http") ? "noreferrer" : undefined}
                target={bookingUrl.startsWith("http") ? "_blank" : undefined}
              >
                <span className={styles.bookCallText}>book a call</span>
                <span aria-hidden="true" className={styles.callIcon}>
                  <ArrowUpRight />
                </span>
              </a>
              <p>or just say hello</p>
              <a className={styles.emailLink} href="mailto:hey@miizumelon.com">
                hey@miizumelon.com
              </a>
            </div>
          </div>

          <div className={styles.formPanel}>
            <ContactForm compact={compact} region={region} />
          </div>
        </div>
      </section>

      <footer className={styles.footer} id="footer">
        <div
          className={styles.nuviaPanel}
          onPointerDown={toggleNuviaTouchTooltip}
          onPointerEnter={showNuviaTooltip}
          onPointerLeave={leaveNuviaTooltip}
          onPointerMove={moveNuviaTooltip}
        >
          <span className={styles.representedBy} ref={representedByRef}>
            represented by
          </span>
          <div
            aria-label="NVA, represented by Nuvia"
            className={styles.nuviaWordmark}
            onBlur={hideNuviaTooltip}
            onFocus={() => {
              if (
                window.performance.now() - lastNuviaTouchAt.current <
                NUVIA_POST_TOUCH_SUPPRESSION_MS
              )
                return;

              if (nuviaTooltipHoverTimer.current !== null) {
                window.clearTimeout(nuviaTooltipHoverTimer.current);
                nuviaTooltipHoverTimer.current = null;
              }

              setNuviaTooltipTouch(false);
              const panel = nuviaWordmarkRef.current?.parentElement;
              if (panel) {
                const rect = panel.getBoundingClientRect();
                nuviaTooltipX.jump(rect.left + rect.width * 0.2);
                nuviaTooltipY.jump(rect.top + rect.height * 0.42);
                nuviaTooltipReady.current = true;
              }
              setNuviaTooltipVisible(true);
            }}
            ref={nuviaWordmarkRef}
            tabIndex={0}
          >
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordDark}`}
            >
              {"NVA"}
            </span>
            <span
              aria-hidden="true"
              className={`${styles.nuviaWord} ${styles.nuviaWordLight}`}
            >
              {"NVA"}
            </span>
          </div>
        </div>
        <nav className={styles.footerLinks} aria-label="Legal and about links">
          <Link href="/imprint">Imprint</Link>
          <Link href="/imprint">Privacy</Link>
          <Link href="#hero">who is miizu?</Link>
        </nav>
      </footer>
      {nuviaTooltipMounted
        ? createPortal(
            <motion.span
              aria-hidden="true"
              className={`${styles.nuviaTooltip}${nuviaTooltipVisible ? ` ${styles.nuviaTooltipVisible}` : ""}${nuviaTooltipTouch ? ` ${styles.nuviaTooltipTouch}` : ""}`}
              style={{
                x: nuviaTooltipTouch ? nuviaTooltipX : nuviaTooltipFollowX,
                y: nuviaTooltipTouch ? nuviaTooltipY : nuviaTooltipFollowY,
              }}
              transformTemplate={({ x, y }) =>
                nuviaTooltipTouch
                  ? `translate(${x}, ${y}) translate(-50%, -50%)`
                  : `translate(${x}, ${y}) translate(14px, -50%)`
              }
            >
              Nuvia is literally my Brand
            </motion.span>,
            document.body,
          )
        : null}
    </main>
  );
}
