"use client";

import type { ValidationError } from "intl-tel-input";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { DateRange } from "react-day-picker";

import type { ContactFormStatus } from "@/lib/contact-settings";

import {
  ALL_CONTACT_FIELDS_TOUCHED,
  getContactDateKey,
  getEmailValidationMessage,
  getPhoneValidationMessage,
  INITIAL_CONTACT_DATA,
  INITIAL_TOUCHED_FIELDS,
  isAvailableContactDate,
} from "./contact-form-model";
import type {
  ContactData,
  ContactRegion,
  ValidatedContactField,
} from "./contact-form-model";

const SUCCESS_DISMISS_MS = 6000;
const CONTACT_SCROLL_CONTAINER_SELECTOR = "[data-contact-scroll-container]";

function scrollFieldIntoContactContainer(field: HTMLElement) {
  let candidate = field.parentElement;

  while (candidate) {
    if (candidate.matches(CONTACT_SCROLL_CONTAINER_SELECTOR)) {
      const { overflowY } = window.getComputedStyle(candidate);
      const canScroll =
        (overflowY === "auto" || overflowY === "scroll") &&
        candidate.scrollHeight > candidate.clientHeight + 1;

      if (canScroll) {
        const containerBox = candidate.getBoundingClientRect();
        const fieldBox = field.getBoundingClientRect();
        const desiredTop =
          candidate.scrollTop +
          fieldBox.top -
          containerBox.top -
          (candidate.clientHeight - fieldBox.height) / 2;
        const maxTop = candidate.scrollHeight - candidate.clientHeight;

        candidate.scrollTo({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          top: Math.min(maxTop, Math.max(0, desiredTop)),
        });
        return;
      }
    }

    candidate = candidate.parentElement;
  }
}

export function useContactForm(region: ContactRegion) {
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
  const [validationSummary, setValidationSummary] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    if (result?.type !== "success") return;

    const timeout = window.setTimeout(() => {
      setResult(null);
    }, SUCCESS_DISMISS_MS);

    return () => window.clearTimeout(timeout);
  }, [result]);

  const updateField = (field: keyof ContactData, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setResult(null);
    setValidationSummary(null);
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
    setValidationSummary(null);
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

    const form = event.currentTarget;
    const invalidFieldId = nameValidationMessage
      ? "contact-name"
      : emailValidationMessage
        ? "contact-email"
        : phoneValidationMessage
          ? "contact-phone"
          : serviceValidationMessage
            ? "service"
            : budgetValidationMessage
              ? "budget"
              : deadlineValidationMessage
                ? "deadline-picker"
                : descriptionValidationMessage
                  ? "project-description"
                  : null;

    setTouchedFields(ALL_CONTACT_FIELDS_TOUCHED);

    if (invalidFieldId) {
      setResult(null);
      setValidationSummary(
        "Please review the highlighted fields before sending your request.",
      );
      window.requestAnimationFrame(() => {
        const field = form.querySelector<HTMLElement>(`#${invalidFieldId}`);
        if (!field) return;

        field.focus({ preventScroll: true });
        scrollFieldIntoContactContainer(field);
      });
      return;
    }

    setSubmitting(true);
    setResult(null);
    setValidationSummary(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email.trim(),
          telephone: data.telephone,
          referral: data.referral.trim(),
          service: data.service,
          budget: data.budget,
          deadline: data.deadline,
          region,
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

  const succeeded = result?.type === "success";
  const disabled = status.paused || statusLoading || submitting || succeeded;
  const dismissResult = () => setResult(null);

  return {
    budgetError,
    data,
    deadlineError,
    deadlineMonth,
    deadlineRange,
    descriptionError,
    disabled,
    dismissResult,
    emailError,
    handleSubmit,
    markFieldTouched,
    nameError,
    phoneError,
    result,
    serviceError,
    setDeadlineMonth,
    setPhoneErrorCode,
    setPhoneIsValid,
    status,
    submitting,
    updateDeadlineRange,
    updateField,
    updatePhone,
    validationSummary,
  };
}
