"use client";

import IntlTelInput from "@intl-tel-input/react";
import { CalendarIcon } from "lucide-react";

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
import { formatPauseUntilDate } from "@/lib/contact-settings";

import { BUDGET_ITEMS, SERVICE_ITEMS } from "./content";
import styles from "../../miizu-landing.module.css";
import { ContactFieldFeedback } from "./ContactFieldFeedback";
import {
  formatContactDateRange,
  isAvailableContactDate,
} from "./contact-form-model";
import type { ContactRegion } from "./contact-form-model";
import { useContactForm } from "./useContactForm";

const loadPhoneUtils = () => import("intl-tel-input/utils");

export function ContactForm({
  compact,
  region,
}: {
  compact: boolean;
  region: ContactRegion;
}) {
  const {
    budgetError,
    data,
    deadlineError,
    deadlineMonth,
    deadlineRange,
    descriptionError,
    disabled,
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
  } = useContactForm(region);

  return (
    <div className={styles.formShell} id="contact-form">
      {status.paused && (
        <div className={styles.pausedNotice} role="status">
          <div className={styles.pausedNoticeCopy}>
            <span className={styles.pausedKicker}>paused</span>
            <strong className={styles.pausedHeadline}>
              I&rsquo;m booked out
            </strong>
            <p className={styles.pausedBody}>
              New requests reopen{" "}
              {status.pauseUntil ? (
                <>
                  on <span>{formatPauseUntilDate(status.pauseUntil)}</span>
                </>
              ) : (
                <span>soon</span>
              )}
              .
            </p>
          </div>
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
            <ContactFieldFeedback error={nameError} id="contact-name-error" />
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
            <ContactFieldFeedback error={emailError} id="contact-email-error" />
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
            <ContactFieldFeedback error={phoneError} id="contact-phone-error" />
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
            <ContactFieldFeedback
              error={serviceError}
              id="contact-service-error"
            />
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
            <ContactFieldFeedback
              error={budgetError}
              id="contact-budget-error"
            />
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
            <ContactFieldFeedback error={deadlineError} id="deadline-error" />
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
            <ContactFieldFeedback
              error={descriptionError}
              id="project-description-error"
            />
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
