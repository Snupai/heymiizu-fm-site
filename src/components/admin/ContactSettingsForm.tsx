"use client";

import { useEffect, useState } from "react";
import { CalendarDays, PauseCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import type { ContactFormStatus } from "@/lib/contact-settings";
import { getDateKeyInTimeZone } from "@/lib/contact-settings";

const defaultStatus: ContactFormStatus = {
  paused: false,
  pauseUntil: null,
};

export function ContactSettingsForm() {
  const [settings, setSettings] = useState<ContactFormStatus>(defaultStatus);
  const [savedSettings, setSavedSettings] =
    useState<ContactFormStatus>(defaultStatus);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty =
    settings.paused !== savedSettings.paused ||
    settings.pauseUntil !== savedSettings.pauseUntil;

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings() {
      try {
        const response = await fetch("/api/contact", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Could not load contact settings.");

        const status = (await response.json()) as ContactFormStatus;
        setSettings(status);
        setSavedSettings(status);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        toast.error("Could not load the contact form settings.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadSettings();
    return () => controller.abort();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session)
        throw new Error("Your session has expired. Please sign in again.");

      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = (await response.json()) as ContactFormStatus & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(result.error ?? "Could not save contact settings.");

      const next = { paused: result.paused, pauseUntil: result.pauseUntil };
      setSettings(next);
      setSavedSettings(next);
      toast.success(
        result.paused ? "Contact form paused." : "Contact form reopened.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save contact settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <PauseCircle className="h-5 w-5" />
          Contact form availability
        </CardTitle>
        <CardDescription>
          Pause new commission requests on both the website and the contact API.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p className="text-muted-foreground text-sm">
            Loading contact settings...
          </p>
        ) : (
          <>
            <div className="flex flex-col items-stretch gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <p className="font-medium">Pause contact form</p>
                <p className="text-muted-foreground text-sm">
                  Visitors will see that commissions are paused and cannot
                  submit the form.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.paused}
                aria-label="Pause contact form"
                onClick={() =>
                  setSettings((current) => ({
                    paused: !current.paused,
                    pauseUntil: current.paused ? null : current.pauseUntil,
                  }))
                }
                className="relative flex h-11 w-[3.25rem] shrink-0 items-center justify-center self-end rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:self-auto"
              >
                <span
                  aria-hidden="true"
                  className={`relative h-7 w-12 rounded-full border transition-colors ${
                    settings.paused
                      ? "border-brand-dark bg-brand"
                      : "border-gray-400 bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full border border-gray-200 bg-white shadow-md transition-transform ${
                      settings.paused ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>

            {settings.paused && (
              <div className="space-y-2">
                <Label
                  htmlFor="contact-pause-until"
                  className="flex items-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Pause end date (optional)
                </Label>
                <Input
                  id="contact-pause-until"
                  type="date"
                  min={getDateKeyInTimeZone()}
                  value={settings.pauseUntil ?? ""}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      pauseUntil: event.target.value || null,
                    }))
                  }
                  className="w-full max-w-xs"
                />
                <p className="text-muted-foreground text-sm">
                  Leave blank to pause indefinitely. With a date, the form
                  reopens the following day.
                </p>
              </div>
            )}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button
                className="w-full sm:w-auto"
                onClick={handleSave}
                disabled={saving || !isDirty}
              >
                {saving ? "Saving..." : "Save availability"}
              </Button>
              <span
                className="text-muted-foreground min-w-0 break-words text-sm"
                aria-live="polite"
              >
                {savedSettings.paused
                  ? savedSettings.pauseUntil
                    ? `Saved: paused until ${savedSettings.pauseUntil}`
                    : "Saved: paused"
                  : "Saved: accepting requests"}
                {isDirty ? " · unsaved changes" : ""}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
