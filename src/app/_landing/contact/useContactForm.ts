"use client";

import type { ValidationError } from "intl-tel-input";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { DateRange } from "react-day-picker";

const SUCCESS_DISMISS_MS = 6000;

import type { ContactFormStatus } from "@/lib/contact-settings";

import {
  ALL_CONTACT_FIELDS_TOUCHED,
  getBudgetValidationMessage,
  getContactDateKey,
  getDeadlineValidationMessage,
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

export function useContactForm(
  region: ContactRegion,
  { requireProjectDetails = true }: { requireProjectDetails?: boolean } = {},
) {
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
  const budgetValidationMessage = getBudgetValidationMessage(
    data.budget,
    requireProjectDetails,
  );
  const deadlineValidationMessage = getDeadlineValidationMessage(
    deadlineRange,
    data.deadline,
    requireProjectDetails,
  );
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

    setTouchedFields({
      ...ALL_CONTACT_FIELDS_TOUCHED,
      budget: requireProjectDetails || Boolean(data.budget),
      deadline: requireProjectDetails || Boolean(deadlineRange?.from),
    });

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
  };
}
