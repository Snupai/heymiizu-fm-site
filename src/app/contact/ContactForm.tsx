import React, { useEffect, useState } from "react";
import { ChevronsUpDown, ArrowUpCircle } from "lucide-react";
import { Combobox } from "../../components/ui/combobox";
import { DatePicker } from "../../components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../components/ui/command";
import {
  formatPauseUntilDate,
  type ContactFormStatus,
} from "../../lib/contact-settings";

const PROJECT_TYPES = [
  { value: "Commercial Spot", label: "Commercial Spot" },
  { value: "Intro/Preintro", label: "Intro/Preintro" },
  { value: "Overlay", label: "Overlay" },
  { value: "Social Media Content", label: "Social Media Content" },
];

const SEQUENCE_LENGTHS = [
  { value: "<45s", label: "<45s" },
  { value: "1-2min", label: "1-2min" },
  { value: ">2min", label: ">2min" },
  { value: "custom", label: "Custom..." },
];

const ASSETS_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const COOPERATION_OPTIONS = [
  { value: "Long-term cooperation", label: "Long-term coop" },
  { value: "One-off assignment", label: "One-off assignment" },
];

const DEADLINE_PRESETS = [
  { value: "none", label: "No deadline" },
  { value: "2weeks", label: "In 2 weeks" },
  { value: "1month", label: "In 1 month" },
];

interface FormState {
  name: string;
  email: string;
  telephone: string;
  company: string;
  projectType: string;
  sequenceLength: string;
  deadline: string;
  assets: string;
  cooperation: string;
  description: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

const initialState: FormState = {
  name: "",
  email: "",
  telephone: "",
  company: "",
  projectType: "",
  sequenceLength: "",
  deadline: "",
  assets: "",
  cooperation: "",
  description: "",
};

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [flashFields, setFlashFields] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [customSequenceLength, setCustomSequenceLength] = useState("");
  const [showCustomSequenceInput, setShowCustomSequenceInput] = useState(false);
  const [customDropdownOpen, setCustomDropdownOpen] = useState(false);
  const [deadlinePreset, setDeadlinePreset] = useState<string>("custom");
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactFormStatus>({
    paused: false,
    pauseUntil: null,
  });
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContactStatus() {
      try {
        const response = await fetch("/api/contact", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const status = (await response.json()) as ContactFormStatus;
        setContactStatus(status);
      } catch {
        // The POST endpoint still enforces the setting if this status request fails.
      } finally {
        if (!controller.signal.aborted) setStatusLoading(false);
      }
    }

    void loadContactStatus();
    return () => controller.abort();
  }, []);

  const formatDateEU = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const stringValue = String(value || "");

    // Special validation for telephone field
    if (name === "telephone") {
      // Only allow numbers, +, -, and /
      const phoneRegex = /^[0-9+\-/]*$/;
      if (stringValue === "" || phoneRegex.test(stringValue)) {
        setForm({ ...form, [name]: stringValue });
      }
    } else {
      setForm({ ...form, [name]: stringValue });
    }
    setMissingFields((prev) => prev.filter((f) => f !== name));
    setFlashFields((prev) => prev.filter((f) => f !== name));
  };

  const handleComboboxChange = (name: string, value: string) => {
    if (name === "sequenceLength" && value === "custom") {
      setShowCustomSequenceInput(true);
      // Restore previous custom value if any
      setForm({ ...form, [name]: customSequenceLength });
    } else {
      setForm({ ...form, [name]: value });
      if (name === "sequenceLength") {
        setShowCustomSequenceInput(false);
        // Only clear customSequenceLength if a non-custom option is chosen
        if (value !== "custom") setCustomSequenceLength("");
      }
    }
    setMissingFields((prev) => prev.filter((f) => f !== name));
    setFlashFields((prev) => prev.filter((f) => f !== name));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateString = date.toISOString().split("T")[0] ?? "";
      setForm({ ...form, deadline: dateString });
    } else {
      setForm({ ...form, deadline: "" });
    }
    setMissingFields((prev) => prev.filter((f) => f !== "deadline"));
    setFlashFields((prev) => prev.filter((f) => f !== "deadline"));
  };

  const computePresetDate = (preset: string): Date | undefined => {
    const now = new Date();
    switch (preset) {
      case "2weeks": {
        const d = new Date(now);
        d.setDate(d.getDate() + 14);
        return d;
      }
      case "1month": {
        const d = new Date(now);
        d.setMonth(d.getMonth() + 1);
        return d;
      }
      case "3months": {
        const d = new Date(now);
        d.setMonth(d.getMonth() + 3);
        return d;
      }
      case "none":
        return undefined;
      default:
        return undefined;
    }
  };

  const handleDeadlinePresetChange = (value: string) => {
    setDeadlinePreset(value);
    if (value === "custom") {
      // keep current selectedDate as-is; require user to pick if empty
      return;
    }
    const d = computePresetDate(value);
    setSelectedDate(d);
    if (d) {
      const dateString = d.toISOString().split("T")[0] ?? "";
      setForm({ ...form, deadline: dateString });
    } else {
      setForm({ ...form, deadline: "" });
    }
    setMissingFields((prev) => prev.filter((f) => f !== "deadline"));
    setFlashFields((prev) => prev.filter((f) => f !== "deadline"));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (form.email && !validateEmail(form.email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleCustomSequenceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCustomSequenceLength(value);
    setForm({ ...form, sequenceLength: value });
    setMissingFields((prev) => prev.filter((f) => f !== "sequenceLength"));
    setFlashFields((prev) => prev.filter((f) => f !== "sequenceLength"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus.paused || statusLoading) return;
    // Validate required fields
    const missingFields = [];
    if (!form.name) missingFields.push("name");
    if (!form.email) missingFields.push("email");
    if (!form.projectType) missingFields.push("projectType");
    if (!form.sequenceLength) missingFields.push("sequenceLength");
    if (deadlinePreset === "custom" && !form.deadline)
      missingFields.push("deadline");
    if (!form.assets) missingFields.push("assets");
    if (!form.description) missingFields.push("description");
    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setFlashFields(missingFields);
      setTimeout(() => setFlashFields([]), 5000);
      return;
    }

    // Validate email format
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      setEmailError("Please enter a valid email address.");
      setFlashFields(["email"]);
      setTimeout(() => setFlashFields([]), 15000);
      return;
    }

    // Clear any email-specific errors
    setEmailError("");
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm(initialState);
        setSelectedDate(undefined);
        setDeadlinePreset("custom");
        // Trigger parent overlay/video flow immediately on success
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = (await res.json()) as {
          error?: string;
          paused?: boolean;
          pauseUntil?: string | null;
        };
        if (data.paused) {
          setContactStatus({
            paused: true,
            pauseUntil: data.pauseUntil ?? null,
          });
        }
        setError(data.error ?? "Failed to send.");
      }
    } catch {
      setError("Failed to send.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setFlashFields([]), 15000);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center px-4 pb-8 md:px-8 lg:px-0">
      <div className="relative mx-auto w-full max-w-5xl">
        {contactStatus.paused && (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 z-20 flex -translate-y-[14%] items-center justify-center p-4 md:p-8"
          >
            <div className="paused-card relative w-full max-w-xl overflow-hidden rounded-[28px] bg-white/65 px-8 py-11 text-center shadow-[0_32px_80px_-24px_rgba(11,12,15,0.35)] ring-1 ring-black/[0.06] backdrop-blur-2xl backdrop-saturate-150 md:rounded-[34px] md:px-14 md:py-14">
              <div
                aria-hidden="true"
                className="paused-halo pointer-events-none absolute -top-28 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />

              <div className="relative flex flex-col items-center gap-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-ink/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted ring-1 ring-inset ring-black/[0.06]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="paused-ping absolute inline-flex h-full w-full rounded-full bg-brand" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                  </span>
                  Paused
                </span>

                <h2 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink md:text-[42px]">
                  Commissions are currently paused
                </h2>

                <p className="max-w-sm text-balance text-[15px] leading-relaxed text-ink-muted md:text-base">
                  I&rsquo;m not taking on new projects at the moment. Do check
                  back soon.
                </p>

                {contactStatus.pauseUntil && (
                  <div className="flex flex-col items-center gap-4 pt-1">
                    <span
                      aria-hidden="true"
                      className="h-px w-20 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                    />
                    <p className="text-[13px] tracking-[-0.01em] text-ink-muted md:text-sm">
                      Reopening{" "}
                      <span className="font-semibold text-ink">
                        {formatPauseUntilDate(contactStatus.pauseUntil)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={statusLoading}
          className={`grid w-full grid-cols-1 gap-x-12 gap-y-10 px-4 transition-all duration-300 md:grid-cols-2 md:px-8 lg:px-0 ${
            contactStatus.paused
              ? "pointer-events-none select-none opacity-30 blur-[3px] saturate-50"
              : ""
          }`}
        >
          <fieldset
            disabled={contactStatus.paused || statusLoading}
            className="contents"
          >
            {/* Name */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">Name</label>
              <div className="relative">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() =>
                    setFlashFields((prev) => prev.filter((f) => f !== "name"))
                  }
                  required
                  maxLength={50}
                  className={`w-full rounded-2xl border-4 px-3 py-2 text-base placeholder-gray-400 transition-all focus:outline-none sm:px-4 sm:py-3 sm:text-lg ${
                    flashFields.includes("name")
                      ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]"
                      : "[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]"
                  }`}
                  placeholder="Name"
                />
                {form.name.length >= 40 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {form.name.length}/50
                  </div>
                )}
                {missingFields.includes("name") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                E-Mail
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => {
                    handleEmailBlur();
                    setFlashFields((prev) => prev.filter((f) => f !== "email"));
                  }}
                  required
                  maxLength={100}
                  className={`w-full rounded-2xl border-4 px-3 py-2 text-base placeholder-gray-400 transition-all focus:outline-none sm:px-4 sm:py-3 sm:text-lg ${
                    flashFields.includes("email")
                      ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]"
                      : "[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]"
                  }`}
                  placeholder="Email"
                />
                {emailError && (
                  <div className="mt-1 text-sm text-red-500">{emailError}</div>
                )}
                {form.email.length >= 80 && !emailError && (
                  <div className="mt-1 text-sm text-gray-500">
                    {form.email.length}/100
                  </div>
                )}
                {missingFields.includes("email") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Telephone (optional) */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                Telephone
              </label>
              <div className="relative">
                <input
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full rounded-2xl border-4 px-3 py-2 text-base placeholder-gray-400 transition-all [border-color:#a3a3a3] focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] sm:px-4 sm:py-3 sm:text-lg"
                  placeholder="Phone (optional)"
                />
                {form.telephone.length >= 16 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {form.telephone.length}/20
                  </div>
                )}
                {missingFields.includes("telephone") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Company (optional) */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                Company
              </label>
              <div className="relative">
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full rounded-2xl border-4 px-3 py-2 text-base placeholder-gray-400 transition-all [border-color:#a3a3a3] focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] sm:px-4 sm:py-3 sm:text-lg"
                  placeholder="Company (optional)"
                />
                {form.company.length >= 80 && (
                  <div className="mt-1 text-sm text-gray-500">
                    {form.company.length}/100
                  </div>
                )}
                {missingFields.includes("company") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Project Type */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                Project Type
              </label>
              <div className="relative w-full">
                <Combobox
                  options={PROJECT_TYPES}
                  value={form.projectType}
                  onValueChange={(value) =>
                    handleComboboxChange("projectType", value)
                  }
                  placeholder="Project type"
                  error={flashFields.includes("projectType")}
                />
                {missingFields.includes("projectType") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Sequence Length */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                Sequence length
              </label>
              <div className="relative w-full">
                {!showCustomSequenceInput ? (
                  <Combobox
                    options={SEQUENCE_LENGTHS}
                    value={form.sequenceLength}
                    onValueChange={(value) =>
                      handleComboboxChange("sequenceLength", value)
                    }
                    placeholder="Sequence length"
                    error={flashFields.includes("sequenceLength")}
                  />
                ) : (
                  <div className="w-full">
                    <Popover
                      open={customDropdownOpen}
                      onOpenChange={setCustomDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <input
                            name="customSequenceLength"
                            value={customSequenceLength}
                            onChange={handleCustomSequenceChange}
                            onBlur={() =>
                              setFlashFields((prev) =>
                                prev.filter((f) => f !== "sequenceLength"),
                              )
                            }
                            required
                            maxLength={10}
                            className={`w-full rounded-2xl border-4 px-3 py-2 pr-12 text-base placeholder-gray-400 transition-all focus:outline-none sm:px-4 sm:py-3 sm:text-lg ${
                              flashFields.includes("sequenceLength")
                                ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]"
                                : "[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]"
                            }`}
                            placeholder="Custom length"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {customSequenceLength.length >= 7 && (
                            <div
                              className={`mt-1 pl-2 text-sm ${customSequenceLength.length === 10 ? "text-red-500" : "text-gray-500"}`}
                            >
                              {customSequenceLength.length}/10
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute right-6 top-1/2 z-10 h-4 w-4 shrink-0 -translate-y-1/2 transform"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomDropdownOpen((v) => !v);
                            }}
                          >
                            <ChevronsUpDown
                              className={`h-4 w-4 ${customSequenceLength.length > 0 ? "opacity-50" : "opacity-20"}`}
                            />
                          </button>
                          {/* Overlay a transparent div over the icon area to act as PopoverTrigger, but only the icon click toggles */}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="z-50 w-full rounded-2xl border-4 border-gray-200 bg-white p-0 shadow-lg"
                        align="start"
                      >
                        <Command>
                          <CommandList>
                            <CommandEmpty>No option found.</CommandEmpty>
                            <CommandGroup>
                              {SEQUENCE_LENGTHS.map((option) => {
                                const isCustomOption =
                                  option.value === "custom";
                                const isSelected = isCustomOption
                                  ? showCustomSequenceInput
                                  : form.sequenceLength === option.value;
                                return (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                      setCustomDropdownOpen(false);
                                      handleComboboxChange(
                                        "sequenceLength",
                                        currentValue,
                                      );
                                    }}
                                    className={`cursor-pointer transition-colors hover:bg-gray-50${isSelected ? "bg-brand-light text-brand-dark" : ""}`}
                                  >
                                    {option.label}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                {missingFields.includes("sequenceLength") && (
                  <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                    This field is required.
                  </div>
                )}
              </div>
            </div>
            {/* Deadline */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <label className="mb-1 block pl-4 text-lg font-bold">
                Deadline
              </label>
              <div className="relative w-full">
                <Popover open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-2xl border-4 px-4 py-3 text-left text-lg transition-all focus:outline-none ${
                        flashFields.includes("deadline")
                          ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]"
                          : "[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]"
                      }`}
                    >
                      <span
                        className={`truncate ${!form.deadline && deadlinePreset !== "none" ? "text-gray-400" : ""}`}
                      >
                        {deadlinePreset === "none" && "No deadline"}
                        {deadlinePreset !== "none" &&
                          selectedDate &&
                          formatDateEU(selectedDate)}
                        {deadlinePreset === "custom" &&
                          !selectedDate &&
                          "Deadline"}
                        {deadlinePreset !== "custom" &&
                          deadlinePreset !== "none" &&
                          !selectedDate &&
                          "Deadline"}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="z-50 w-full rounded-2xl border-4 border-gray-200 bg-white p-0 shadow-lg"
                    align="start"
                  >
                    <div className="p-2">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No option found.</CommandEmpty>
                          <CommandGroup>
                            {DEADLINE_PRESETS.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                  if (currentValue === "custom") {
                                    setDeadlinePreset("custom");
                                    // Don't close; let user pick a date below
                                    return;
                                  }
                                  handleDeadlinePresetChange(currentValue);
                                  setDeadlineOpen(false);
                                }}
                                className={`cursor-pointer transition-colors hover:bg-gray-50${deadlinePreset === option.value ? "bg-brand-light text-brand-dark" : ""}`}
                              >
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <div className="px-2 pb-3 pt-2">
                        <div className="mb-2 pl-1 text-xs text-gray-500">
                          Or pick a custom date
                        </div>
                        <DatePicker
                          date={selectedDate}
                          onDateChange={(d) => {
                            setDeadlinePreset("custom");
                            handleDateChange(d);
                            // Close if a date is chosen
                            if (d) setDeadlineOpen(false);
                          }}
                          placeholder="Deadline"
                          error={flashFields.includes("deadline")}
                          minDate={(function () {
                            const minDate = new Date();
                            minDate.setDate(minDate.getDate() + 12);
                            return minDate;
                          })()}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {deadlinePreset === "custom" &&
                  missingFields.includes("deadline") && (
                    <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                      This field is required.
                    </div>
                  )}
              </div>
            </div>
            {/* Any Assets / Commission type */}
            <div className="col-span-1 flex flex-col md:col-span-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="mb-1 block pl-4 text-lg font-bold">
                    Assets?
                  </label>
                  <div className="relative w-full">
                    <Combobox
                      options={ASSETS_OPTIONS}
                      value={form.assets}
                      onValueChange={(value) =>
                        handleComboboxChange("assets", value)
                      }
                      placeholder="Yes/No"
                      error={flashFields.includes("assets")}
                    />
                    {missingFields.includes("assets") && (
                      <div className="absolute -bottom-5 right-2 text-xs font-bold text-red-600">
                        This field is required.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 block pl-4 text-lg font-bold">
                    Commission type
                  </label>
                  <div className="relative w-full">
                    <Combobox
                      options={COOPERATION_OPTIONS}
                      value={form.cooperation}
                      onValueChange={(value) =>
                        handleComboboxChange("cooperation", value)
                      }
                      placeholder="Type"
                      error={flashFields.includes("cooperation")}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Project Description */}
            <div className="col-span-1 flex flex-col items-center md:col-span-2">
              <div className="relative w-full max-w-md">
                <label className="mb-1 block pl-4 text-lg font-bold">
                  Project description
                </label>
                <div className="relative w-full">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onBlur={() =>
                      setFlashFields((prev) =>
                        prev.filter((f) => f !== "description"),
                      )
                    }
                    required
                    maxLength={2000}
                    className={`min-h-[120px] w-full resize-y rounded-2xl border-4 bg-transparent px-3 py-2 text-base placeholder-transparent transition-all focus:outline-none focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff] sm:px-4 sm:py-3 sm:text-lg ${
                      flashFields.includes("description")
                        ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]"
                        : "[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]"
                    }`}
                    placeholder="Project description"
                    id="project-description-textarea"
                  />
                  {form.description === "" && (
                    <span className="pointer-events-none absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 transform select-none whitespace-pre-line text-center text-base text-gray-400 sm:text-lg">
                      Project description
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {form.description.length}/2000
                  </div>
                  {missingFields.includes("description") && (
                    <div className="ml-2 text-xs font-bold text-red-600">
                      This field is required.
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Submit Button & Confirmation */}
            <div className="col-span-1 mt-0 flex flex-col items-center md:col-span-2">
              <p className="mb-0 text-2xl font-black leading-tight">All set?</p>
              <p className="-mt-2 mb-0.5 text-2xl font-black leading-tight">
                Let´s bring your project to life
              </p>
              <div className="mt-2 text-sm text-gray-500">Send it off!</div>
              <button
                type="submit"
                aria-label="Send message"
                disabled={submitting}
                className="mb-2 flex h-20 w-20 items-center justify-center rounded-full border-none bg-transparent p-0 shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowUpCircle
                  size={56}
                  strokeWidth={2.5}
                  className="text-brand hover:text-brand-dark"
                />
              </button>
              {success && (
                <div className="mt-4 text-xl font-bold text-green-600">
                  Email sent successfully!
                </div>
              )}
              {error && (
                <div className="mt-4 text-xl font-bold text-red-600">
                  {error}
                </div>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
