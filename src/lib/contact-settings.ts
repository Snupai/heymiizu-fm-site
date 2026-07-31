export interface ContactFormStatus {
  paused: boolean;
  pauseUntil: string | null;
}

export const CONTACT_SETTINGS_ID = "contact_form";
export const CONTACT_TIME_ZONE = "Europe/Berlin";

export function getDateKeyInTimeZone(
  date = new Date(),
  timeZone = CONTACT_TIME_ZONE,
): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function isContactFormPaused(
  paused: boolean,
  pauseUntil: string | null,
  date = new Date(),
): boolean {
  if (!paused) return false;
  if (!pauseUntil) return true;

  // An end date keeps the form paused through that entire calendar day.
  return getDateKeyInTimeZone(date) <= pauseUntil;
}

export function formatPauseUntilDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) return dateKey;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}
