import { NextResponse } from "next/server";

import { budgetOptions, serviceOptions } from "@/data/contact";
import { site } from "@/data/site";
import { contactSchema } from "@/lib/contact-schema";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const labelFor = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;

/*
 * Submissions are relayed to Web3Forms server-side rather than posted straight
 * from the browser. Web3Forms' own examples put the access key in client markup;
 * proxying it through here keeps the key out of the bundle, so it can live in
 * `.env` instead of needing a `NEXT_PUBLIC_` prefix.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { name, email, company, service, budget, message, website } =
    parsed.data;

  /* Honeypot tripped — accept silently so the bot learns nothing. */
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.error(
      "Contact form is not configured: set WEB3FORMS_ACCESS_KEY in .env",
    );
    return NextResponse.json(
      {
        error: `Email delivery isn’t configured yet. Please write to ${site.email}.`,
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        /*
         * Required. Web3Forms sits behind a Cloudflare managed challenge that
         * answers requests without a User-Agent with a 403 HTML challenge page
         * instead of JSON — which looks exactly like a bad access key.
         */
        "User-Agent": `${site.name}-portfolio/1.0 (+${site.url})`,
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New project enquiry — ${name}`,
        from_name: site.name,
        replyto: email,
        name,
        email,
        company: company || "—",
        service: labelFor(serviceOptions, service),
        budget: labelFor(budgetOptions, budget),
        message,
      }),
    });

    /*
     * Read as text first: a non-JSON body is itself the useful signal (see the
     * Cloudflare note above), and `.json().catch(() => null)` would discard it.
     */
    const raw = await response.text();
    let result: unknown = null;
    try {
      result = JSON.parse(raw);
    } catch {
      /* Left null; `raw` is logged below. */
    }

    const succeeded =
      response.ok &&
      typeof result === "object" &&
      result !== null &&
      (result as { success?: unknown }).success === true;

    if (!succeeded) {
      console.error(
        "Web3Forms rejected the message:",
        response.status,
        raw.slice(0, 300),
      );
      return NextResponse.json(
        {
          error: `Your message could not be sent. Please write to ${site.email}.`,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      {
        error: `Your message could not be sent. Please write to ${site.email}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
