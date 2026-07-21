"use client";

import { useId, useState } from "react";
import { LuArrowRight, LuCircleCheck, LuTriangleAlert } from "react-icons/lu";

import { buttonClass } from "@/components/ui/Button";
import { budgetOptions, serviceOptions } from "@/data/contact";
import { contactSchema } from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "border-ink/15 bg-bg text-ink placeholder:text-muted/70 focus-visible:border-ink focus-visible:outline-accent w-full rounded-lg border px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

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

    const formData = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse(Object.fromEntries(formData));

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
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "Something went wrong. Please email me directly instead.";
        setFormError(message);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setFormError(
        "Your message could not be sent. Please email me directly instead.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-ink/10 bg-cream flex h-full flex-col items-start justify-center border p-8 md:p-10"
      >
        <LuCircleCheck className="text-accent size-8" aria-hidden="true" />
        <h3 className="font-heading text-ink mt-5 text-2xl tracking-tight">
          Thanks — your details are on their way.
        </h3>
        <p className="text-muted mt-3 max-w-prose leading-relaxed">
          I read every enquiry personally and usually reply within one business
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-ink/10 bg-cream border p-8 md:p-10"
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

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="text-ink border-ink/10 bg-peach mt-6 flex items-start gap-2.5 border p-4 text-sm"
        >
          <LuTriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={buttonClass({
          tone: "ink",
          size: "lg",
          className: "mt-8 disabled:cursor-not-allowed disabled:opacity-60",
        })}
      >
        {status === "submitting" ? "Sending…" : "Send Project Details"}
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
          <span className="text-muted font-normal"> (optional)</span>
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
