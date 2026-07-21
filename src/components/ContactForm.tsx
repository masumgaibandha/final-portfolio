"use client";

import { useId, useState } from "react";
import { LuArrowRight, LuCircleCheck, LuTriangleAlert } from "react-icons/lu";

import { buttonClass } from "@/components/ui/Button";
import { budgetOptions, serviceOptions } from "@/data/contact";
import { site } from "@/data/site";
import { contactSchema } from "@/lib/contact-schema";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "success" | "error";

const labelFor = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;

const fieldClass =
  "border-hairline bg-canvas text-ink placeholder:text-ink-muted/70 focus-visible:border-ink focus-visible:outline-action w-full rounded-lg border px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const labelClass = "text-ink block text-sm font-medium";

export function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    /*
     * Captured synchronously: React nulls `event.currentTarget` once the
     * handler yields, so reaching for it after the first `await` would fail.
     */
    const form = event.currentTarget;
    const formData = new FormData(form);

    const entries = Object.fromEntries(formData);
    const parsed = contactSchema.safeParse({
      ...entries,
      /*
       * A <select> whose placeholder option is disabled counts as having no
       * selection, so the browser leaves it out of FormData altogether.
       * Without this, zod sees `undefined` and reports "expected string,
       * received undefined" to the visitor instead of "Please pick a service."
       */
      service: entries.service ?? "",
      budget: entries.budget ?? "",
      /*
       * An unchecked checkbox is likewise absent — which is exactly how
       * Web3Forms expects `botcheck` to behave, so the FormData entry is left
       * untouched and only normalised to a boolean for zod.
       */
      botcheck: formData.get("botcheck") === "on",
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setErrors({});

    /*
     * Read from `process.env` at the point of use rather than module scope, so
     * the value is never held in a named module constant. Public by design:
     * Web3Forms' free plan expects the browser to post directly, and the key
     * only grants "send a message to the owner's inbox".
     */
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error(
        "[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is missing at build time.",
      );
      setFormError(
        `The form isn’t configured yet. Please email me directly at ${site.email}.`,
      );
      setStatus("error");
      return;
    }

    setStatus("sending");

    formData.append("access_key", accessKey);

    /*
     * The selects submit machine values (`full-stack`, `3k-5k`). Swapping in
     * the human labels keeps the notification email readable; `subject` and
     * `from_name` are Web3Forms' own routing fields and have no visible input.
     */
    formData.set("service", labelFor(serviceOptions, parsed.data.service));
    formData.set("budget", labelFor(budgetOptions, parsed.data.budget));
    formData.set("company", parsed.data.company || "—");
    formData.set("subject", `New project enquiry — ${parsed.data.name}`);
    formData.set("from_name", site.name);

    try {
      /*
       * No explicit Content-Type: the browser must set `multipart/form-data`
       * itself, because only it knows the boundary token. Setting the header
       * by hand omits the boundary and the request body becomes unparseable.
       */
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      /*
       * Read as text first: Web3Forms can answer with a non-JSON body (e.g. a
       * Cloudflare challenge page), and `.json()` would throw away the only
       * useful evidence of what actually happened.
       */
      const bodyText = await response.text();
      let data: unknown = null;
      try {
        data = JSON.parse(bodyText);
      } catch {
        /* Left null; the raw text is logged below instead. */
      }

      const reportedSuccess =
        typeof data === "object" &&
        data !== null &&
        (data as { success?: unknown }).success === true;

      /* Both signals must agree before anything is called a success. */
      if (!response.ok || !reportedSuccess) {
        const detail =
          typeof data === "object" &&
          data !== null &&
          typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : bodyText.slice(0, 200);

        /* Safe to log: status and Web3Forms' own message. Never the key. */
        console.error(
          "[contact] Web3Forms did not confirm the submission.",
          "status:",
          response.status,
          "detail:",
          detail,
        );

        setFormError(
          `Your message could not be sent (${response.status}). Please email me directly at ${site.email}.`,
        );
        setStatus("error");
        return;
      }

      /* Only ever cleared once Web3Forms has confirmed success. */
      form.reset();
      setStatus("success");
    } catch (error) {
      console.error("[contact] Network error reaching Web3Forms:", error);
      setFormError(
        `Your message could not be sent. Please email me directly at ${site.email}.`,
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-hairline bg-surface flex h-full flex-col items-start justify-center border p-8 md:p-10"
      >
        <LuCircleCheck className="text-action size-8" aria-hidden="true" />
        <h3 className="font-heading text-ink mt-5 text-2xl tracking-tight">
          Thanks — your details are on their way.
        </h3>
        <p className="text-ink-muted mt-3 max-w-prose leading-relaxed">
          I read every enquiry personally and usually reply within one business
          day. If you don’t hear back, email me directly at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink decoration-action font-medium underline decoration-2 underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-hairline bg-surface border p-8 md:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          label="Name"
          error={errors.name}
        >
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={fieldClass}
          />
        </Field>

        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          label="Work email"
          error={errors.email}
        >
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={fieldClass}
          />
        </Field>

        <Field
          id={fieldId("company")}
          errorId={errorId("company")}
          label="Company"
          optional
          error={errors.company}
        >
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company name (optional)"
            className={fieldClass}
          />
        </Field>

        <Field
          id={fieldId("service")}
          errorId={errorId("service")}
          label="Service needed"
          error={errors.service}
        >
          <select
            id={fieldId("service")}
            name="service"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? errorId("service") : undefined}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={fieldId("budget")}
          errorId={errorId("budget")}
          label="Estimated budget"
          error={errors.budget}
          className="sm:col-span-2"
        >
          <select
            id={fieldId("budget")}
            name="budget"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? errorId("budget") : undefined}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a range
            </option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={fieldId("message")}
          errorId={errorId("message")}
          label="Project details"
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={6}
            required
            placeholder="Tell me what you’re building, who it is for, and what outcome you need."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? errorId("message") : undefined}
            className={`${fieldClass} resize-y`}
          />
        </Field>
      </div>

      {/* Web3Forms' honeypot. Hidden from people, tempting to bots. */}
      <label
        htmlFor={fieldId("botcheck")}
        className="absolute left-[-9999px]"
        aria-hidden="true"
      >
        Leave this field empty
        <input
          id={fieldId("botcheck")}
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      {formError ? (
        <p
          role="alert"
          className="text-ink border-hairline bg-accent mt-6 flex items-start gap-2.5 border p-4 text-sm"
        >
          <LuTriangleAlert
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          {formError}
        </p>
      ) : null}

      {/* Disabled while in flight so a double click cannot send twice. */}
      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className={buttonClass({
          tone: "ink",
          size: "lg",
          className: "mt-8 disabled:cursor-not-allowed disabled:opacity-60",
        })}
      >
        {status === "sending" ? "Sending…" : "Send Project Details"}
        <LuArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  errorId: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Field({
  id,
  errorId,
  label,
  error,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional ? (
          <span className="text-ink-muted font-normal"> (optional)</span>
        ) : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={errorId} className="text-ink mt-2 text-sm font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
