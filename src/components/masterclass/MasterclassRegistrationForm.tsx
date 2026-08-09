"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";

import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/masterclass/TurnstileWidget";
import { legalPageLinks } from "@/data/legal-content";
import { registration, registrationForm } from "@/data/masterclass-content";
import {
  attributionInputSchema,
  normalizeBangladeshPhone,
  registrationInputSchema,
} from "@/lib/masterclass/validation";

/*
 * Mirrors the server schema's caps (src/lib/masterclass/validation.ts) — not
 * importable as constants from there today, so duplicated here as two plain
 * numbers, not validation *logic*. The server remains authoritative; this
 * only avoids sending an oversized field the server would reject anyway.
 */
const MAX_ATTRIBUTION_FIELD_LENGTH = 512;
const MAX_URL_FIELD_LENGTH = 2048;

const fieldClass =
  "border-hairline bg-canvas text-ink placeholder:text-ink-muted/70 focus-visible:border-ink focus-visible:outline-action w-full rounded-lg border px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "text-ink font-bengali block text-sm font-medium";
const legalLinkClass =
  "text-ink decoration-action hover:text-action focus-visible:outline-action rounded-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
const checkboxClass =
  "border-hairline text-action focus-visible:outline-action mt-0.5 size-4 shrink-0 rounded disabled:cursor-not-allowed disabled:opacity-60";
const errorTextClass = "text-ink font-bengali mt-1.5 text-xs font-medium";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  policyAccepted: boolean;
  marketingConsent: boolean;
}

const EMPTY_FIELDS: FormFields = {
  name: "",
  email: "",
  phone: "",
  policyAccepted: false,
  marketingConsent: false,
};

type Status = "idle" | "submitting" | "success" | "error";

interface RegistrationApiSuccess {
  publicRegistrationRef: string;
  publicOrderRef: string;
  status: string;
}

interface RegistrationApiError {
  error: string;
  fields?: { field: string; message: string }[];
}

function captureAttribution() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const raw: Record<string, string> = {};

  const utmMap: Record<string, string> = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
    utm_term: "utmTerm",
  };
  for (const [param, key] of Object.entries(utmMap)) {
    const value = params.get(param);
    if (value) raw[key] = value.slice(0, MAX_ATTRIBUTION_FIELD_LENGTH);
  }

  /*
   * A URL click-id parameter, not a Meta Pixel/fbq call — no pixel script is
   * loaded on this site. `fbp`/`fbc` are deliberately not captured: those
   * are normally read from cookies the Meta Pixel itself sets, and since no
   * pixel exists here yet, there is nothing legitimate to read.
   */
  const fbclid = params.get("fbclid");
  if (fbclid) raw.fbclid = fbclid.slice(0, MAX_ATTRIBUTION_FIELD_LENGTH);

  if (window.location.href) {
    raw.landingPage = window.location.href.slice(0, MAX_URL_FIELD_LENGTH);
  }
  if (document.referrer) {
    raw.referrer = document.referrer.slice(0, MAX_URL_FIELD_LENGTH);
  }

  if (Object.keys(raw).length === 0) return undefined;

  const parsed = attributionInputSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

function fieldsSnapshot(fields: FormFields): string {
  return JSON.stringify(fields);
}

interface MasterclassRegistrationFormProps {
  siteKey: string;
}

/**
 * Interactive registration form. Only ever mounted by `Registration.tsx`
 * when `formEnabled` is true (checkoutEnabled AND
 * MASTERCLASS_REGISTRATION_ENABLED AND a public Turnstile site key all
 * present) — under the current configuration this component never renders
 * at all, so none of its script loading, fetch calls, or Turnstile widget
 * exist in the page.
 */
export function MasterclassRegistrationForm({ siteKey }: MasterclassRegistrationFormProps) {
  const formId = useId();
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  /* Component-instance memory only — never localStorage, never displayed, lost on reload by design. */
  const idempotencyKeyRef = useRef<string | null>(null);
  const idempotencyKeySnapshotRef = useRef<string | null>(null);

  /* Individual hooks rather than an object of refs — the React Compiler can't safely track refs held inside a plain object literal. */
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const policyAcceptedRef = useRef<HTMLInputElement>(null);

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function resetTurnstileForRetry() {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }

  function focusFirstInvalid(errors: Record<string, string>) {
    if (errors.name) {
      nameRef.current?.focus();
    } else if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.phone) {
      phoneRef.current?.focus();
    } else if (errors.policyAccepted) {
      policyAcceptedRef.current?.focus();
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // prevent double submission

    setFormError(null);

    const phoneE164 = normalizeBangladeshPhone(fields.phone);
    const parsed = registrationInputSchema.safeParse({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      termsAccepted: fields.policyAccepted ? true : undefined,
      marketingConsent: fields.marketingConsent,
      turnstileToken: turnstileToken ?? "",
      attribution: captureAttribution(),
    });

    if (!parsed.success || !phoneE164) {
      const nextErrors: Record<string, string> = {};
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0]);
          nextErrors[key] ??= issue.message;
        }
      }
      /* Bengali overrides for the fields the server schema itself validates in English. */
      if (nextErrors.name) nextErrors.name = registrationForm.nameError;
      if (nextErrors.email) nextErrors.email = registrationForm.emailError;
      if (nextErrors.phone || !phoneE164) nextErrors.phone = registrationForm.phoneError;
      if (nextErrors.termsAccepted) nextErrors.policyAccepted = registrationForm.consentError;
      if (nextErrors.turnstileToken) nextErrors.turnstileToken = registrationForm.turnstileMissingError;

      setFieldErrors(nextErrors);
      setFormError(registrationForm.errorSummaryHeading);
      setStatus("error");
      focusFirstInvalid(nextErrors);
      return;
    }

    setFieldErrors({});

    /*
     * One key per logical submission. Reused across a network retry of an
     * unchanged submission (the snapshot below matches); regenerated the
     * moment any of these five fields differs from what the key was issued
     * for, so an edited resubmission is never mistaken for a replay.
     */
    const snapshot = fieldsSnapshot(fields);
    if (idempotencyKeyRef.current === null || idempotencyKeySnapshotRef.current !== snapshot) {
      idempotencyKeyRef.current = crypto.randomUUID();
      idempotencyKeySnapshotRef.current = snapshot;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/masterclass/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(parsed.data),
      });

      let body: RegistrationApiSuccess | RegistrationApiError | null = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (response.status === 201 && body && "publicRegistrationRef" in body) {
        /*
         * Draft registration/order created — not a payment or enrollment
         * success. No gateway exists yet, so there is nothing to redirect
         * to; the refs are kept only in memory for a future payment step,
         * never rendered or logged.
         */
        setStatus("success");
        resetTurnstileForRetry();
        return;
      }

      /*
       * Response JSON is never trusted structurally beyond this shape check,
       * and `errorCode` is only ever used in `===` comparisons against the
       * known literal strings below — never interpolated into UI text,
       * never used to look up anything dynamically.
       */
      const errorBody = body as RegistrationApiError | null;
      const errorCode: string = errorBody?.error ?? "UNKNOWN";

      if (errorCode === "VALIDATION_ERROR" && errorBody?.fields) {
        const nextErrors: Record<string, string> = {};
        for (const f of errorBody.fields) {
          nextErrors[f.field] ??= registrationForm.genericError;
        }
        setFieldErrors(nextErrors);
        setFormError(registrationForm.errorSummaryHeading);
      } else if (errorCode === "IDEMPOTENCY_CONFLICT") {
        /*
         * The previous key no longer maps to a safe replay (it collided
         * with a different registration/request server-side). Clearing
         * both refs forces a brand-new UUID on the very next submit, even
         * if the visible form fields are unchanged.
         */
        idempotencyKeyRef.current = null;
        idempotencyKeySnapshotRef.current = null;
        setFormError(registrationForm.idempotencyConflictError);
      } else if (errorCode === "REGISTRATION_CONFLICT") {
        /*
         * A data-level conflict (this email is already registered under a
         * different phone), not a request-key problem — rotating the
         * idempotency key would not change the outcome, so it's left alone
         * and the message asks for a correction or direct contact instead.
         * Private registration details are never revealed here.
         */
        setFormError(registrationForm.registrationConflictError);
      } else if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const seconds = Number.parseInt(retryAfterHeader ?? "", 10);
        const secondsLabel = Number.isFinite(seconds) && seconds > 0 ? String(seconds) : "কিছুক্ষণ";
        setFormError(
          `${registrationForm.rateLimitedPrefix} ${secondsLabel} ${registrationForm.rateLimitedSuffix}`,
        );
      } else if (response.status === 503) {
        setFormError(registrationForm.unavailableError);
      } else {
        setFormError(registrationForm.genericError);
      }

      setStatus("error");
      /* Every non-success response requires a fresh token before the next attempt — Turnstile tokens are single-use. */
      resetTurnstileForRetry();
    } catch {
      /* Network failure — request likely never reached the server, so the idempotency key is kept for the retry; Turnstile is still reset since the token may have expired by the time the user tries again. */
      setFormError(registrationForm.networkError);
      setStatus("error");
      resetTurnstileForRetry();
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-hairline bg-surface flex h-full flex-col items-start justify-center border p-6 md:p-8"
      >
        <LuCircleCheck className="text-action size-8" aria-hidden="true" />
        <h3 className="font-heading text-ink font-bengali mt-5 text-xl tracking-tight">
          {registrationForm.successHeading}
        </h3>
        <p className="text-ink-muted font-bengali mt-3 leading-relaxed">
          {registrationForm.successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={status === "submitting"}
      className="border-hairline bg-surface border p-6 md:p-8"
    >
      <div role="status" aria-live="polite" className="sr-only">
        {status === "submitting" ? registrationForm.loadingLabel : ""}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={fieldId("name")} className={labelClass}>
            {registration.fields.name}
          </label>
          <input
            ref={nameRef}
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={registration.fields.namePlaceholder}
            disabled={status === "submitting"}
            value={fields.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? errorId("name") : undefined}
            className={`${fieldClass} mt-2`}
          />
          {fieldErrors.name ? (
            <p id={errorId("name")} className={errorTextClass}>
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("email")} className={labelClass}>
            {registration.fields.email}
          </label>
          <input
            ref={emailRef}
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={registration.fields.emailPlaceholder}
            disabled={status === "submitting"}
            value={fields.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? errorId("email") : undefined}
            className={`${fieldClass} mt-2`}
          />
          {fieldErrors.email ? (
            <p id={errorId("email")} className={errorTextClass}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("phone")} className={labelClass}>
            {registration.fields.phone}
          </label>
          <input
            ref={phoneRef}
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={registration.fields.phonePlaceholder}
            disabled={status === "submitting"}
            value={fields.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? errorId("phone") : undefined}
            className={`${fieldClass} mt-2`}
          />
          {fieldErrors.phone ? (
            <p id={errorId("phone")} className={errorTextClass}>
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex min-h-11 items-start gap-3 py-1">
          <input
            ref={policyAcceptedRef}
            id={fieldId("policy-accepted")}
            name="policyAccepted"
            type="checkbox"
            required
            disabled={status === "submitting"}
            checked={fields.policyAccepted}
            onChange={(e) => updateField("policyAccepted", e.target.checked)}
            aria-invalid={Boolean(fieldErrors.policyAccepted)}
            aria-describedby={fieldErrors.policyAccepted ? errorId("policy-accepted") : undefined}
            className={checkboxClass}
          />
          <label
            htmlFor={fieldId("policy-accepted")}
            className="text-ink font-bengali text-sm leading-relaxed"
          >
            {registration.consentPrefix}{" "}
            <Link href={legalPageLinks[1].href} className={legalLinkClass}>
              {legalPageLinks[1].label}
            </Link>
            ,{" "}
            <Link href={legalPageLinks[0].href} className={legalLinkClass}>
              {legalPageLinks[0].label}
            </Link>{" "}
            {registration.consentJoiner}{" "}
            <Link href={legalPageLinks[2].href} className={legalLinkClass}>
              {legalPageLinks[2].label}
            </Link>{" "}
            {registration.consentSuffix}
          </label>
        </div>
        {fieldErrors.policyAccepted ? (
          <p id={errorId("policy-accepted")} className={errorTextClass}>
            {fieldErrors.policyAccepted}
          </p>
        ) : null}

        {/* Separate and independently optional — never bundled with the required checkbox above. */}
        <div className="flex min-h-11 items-start gap-3 py-1">
          <input
            id={fieldId("marketing-consent")}
            name="marketingConsent"
            type="checkbox"
            disabled={status === "submitting"}
            checked={fields.marketingConsent}
            onChange={(e) => updateField("marketingConsent", e.target.checked)}
            className={checkboxClass}
          />
          <label
            htmlFor={fieldId("marketing-consent")}
            className="text-ink-muted font-bengali text-sm leading-relaxed"
          >
            {registration.marketingConsentLabel}
          </label>
        </div>
      </div>

      {/* Honeypot — same convention as the contact form's `botcheck`. */}
      <label htmlFor={fieldId("botcheck")} className="absolute left-[-9999px]" aria-hidden="true">
        Leave this field empty
        <input id={fieldId("botcheck")} type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="mt-5">
        <TurnstileWidget
          ref={turnstileRef}
          siteKey={siteKey}
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => {
            setTurnstileToken(null);
            setFormError(registrationForm.turnstileWidgetError);
          }}
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="text-ink border-hairline bg-canvas font-bengali mt-6 flex items-start gap-2.5 border p-4 text-sm"
        >
          <LuCircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-disabled={status === "submitting"}
        className="bg-action hover:bg-action-hover focus-visible:outline-action font-bengali mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-7 text-[0.95rem] font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-ink/40 disabled:hover:bg-ink/40"
      >
        {status === "submitting" ? registrationForm.loadingLabel : registration.submitEnabledLabel}
      </button>
    </form>
  );
}
