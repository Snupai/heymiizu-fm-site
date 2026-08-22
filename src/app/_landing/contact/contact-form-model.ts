import type { ValidationError } from "intl-tel-input";
import type { DateRange } from "react-day-picker";
import { z } from "zod";

const CONTACT_EMAIL_SCHEMA = z.string().trim().email().max(120);

export type ContactRegion = "local" | "international";

export type ContactData = {
  name: string;
  email: string;
  telephone: string;
  referral: string;
  service: string;
  budget: string;
  deadline: string;
  description: string;
};

export type ValidatedContactField = Exclude<keyof ContactData, "referral">;

export const INITIAL_CONTACT_DATA: ContactData = {
  name: "",
  email: "",
  telephone: "",
  referral: "",
  service: "",
  budget: "",
  deadline: "",
  description: "",
};

export const INITIAL_TOUCHED_FIELDS: Record<ValidatedContactField, boolean> = {
  name: false,
  email: false,
  telephone: false,
  service: false,
  budget: false,
  deadline: false,
  description: false,
};

export const ALL_CONTACT_FIELDS_TOUCHED: Record<
  ValidatedContactField,
  boolean
> = {
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

export function formatContactDateRange(range: DateRange | undefined) {
  if (!range?.from) return "";
  if (!range.to) return formatContactDate(range.from);

  return `${formatContactDate(range.from)} – ${formatContactDate(range.to)}`;
}

export function getContactDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isAvailableContactDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate >= today;
}

export function getEmailValidationMessage(email: string) {
  if (!email.trim()) return "Please enter your email address.";
  if (!CONTACT_EMAIL_SCHEMA.safeParse(email).success) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function getPhoneValidationMessage(
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
