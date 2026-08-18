import "server-only";

import { Resend } from "resend";

import { formatBDT } from "@/lib/masterclass/format";

/**
 * Server-only transactional email. `RESEND_API_KEY` is read lazily (not at
 * module load) so importing this file never throws in an environment where
 * it isn't configured yet — `sendConfirmationEmail()` simply reports
 * `EMAIL_NOT_CONFIGURED` instead. This project previously had zero
 * transactional-email capability (the contact form posts client-side
 * straight to Web3Forms); this is the first server-side sender.
 */

export type SendEmailResult = { ok: true } | { ok: false; errorCode: string };

export interface ConfirmationEmailInput {
  toEmail: string;
  studentName: string;
  registrationRef: string;
  amountBDT: number;
  method: "BKASH" | "NAGAD" | "ROCKET";
  classDateLabel: string;
}

const SENDER_DISPLAY_NAME = "Masum";
const METHOD_LABEL: Record<ConfirmationEmailInput["method"], string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
};

function buildEmailBody(input: ConfirmationEmailInput): { subject: string; html: string } {
  const subject = `রেজিস্ট্রেশন কনফার্ম হয়েছে — ${input.registrationRef}`;

  /*
   * Deliberately excludes sender number and transaction ID — the student
   * already knows both, and there's no reason to re-broadcast payment
   * evidence over email. Only what the student needs going forward.
   */
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1815;">
      <p>প্রিয় ${input.studentName},</p>
      <p>আপনার পেমেন্ট যাচাই সম্পন্ন হয়েছে এবং <strong>Lead Generation ও Cold Email Outreach মাস্টারক্লাস</strong>-এ আপনার রেজিস্ট্রেশন নিশ্চিত হয়েছে।</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 6px 0; color: #57534e;">রেজিস্ট্রেশন আইডি</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${input.registrationRef}</td></tr>
        <tr><td style="padding: 6px 0; color: #57534e;">পরিমাণ</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatBDT(input.amountBDT)}</td></tr>
        <tr><td style="padding: 6px 0; color: #57534e;">পেমেন্ট মাধ্যম</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${METHOD_LABEL[input.method]}</td></tr>
        <tr><td style="padding: 6px 0; color: #57534e;">ক্লাসের ধরন</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">২ দিনের LIVE মাস্টারক্লাস</td></tr>
        <tr><td style="padding: 6px 0; color: #57534e;">ক্লাসের তারিখ</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${input.classDateLabel}</td></tr>
      </table>
      <p>ক্লাসে যোগ দেওয়ার জন্য প্রয়োজনীয় live link ক্লাস শুরুর আগে এই ইমেইলেই আলাদাভাবে পাঠানো হবে।</p>
      <p>কোনো প্রশ্ন থাকলে সরাসরি এই ইমেইলে reply করুন অথবা masum@masumdev.com-এ যোগাযোগ করুন।</p>
      <p>ধন্যবাদ,<br />MasumDev</p>
    </div>
  `.trim();

  return { subject, html };
}

/**
 * `RESEND_FROM_EMAIL` is meant to hold just the raw address (e.g.
 * `masum@masumdev.com`) — but a pre-formatted `"Name <email>"` value is a
 * one-character typo away (and was literally shown as the "preferred"
 * example in the spec this was built against), so this accepts either
 * shape rather than silently constructing a broken, double-wrapped
 * `Masum <Masum <email>>` header if someone sets the formatted form. If the
 * value contains `<...>`, the email is extracted from inside the angle
 * brackets; otherwise the whole (trimmed) value is used as the email.
 * Returns `null` — never a fallback address — if unset, so a
 * missing/misconfigured sender can never silently send from some other
 * mailbox.
 */
function getSenderEmail(): string | null {
  const raw = process.env.RESEND_FROM_EMAIL;
  if (!raw || raw.trim().length === 0) return null;

  const trimmed = raw.trim();
  const bracketed = /<([^<>]+)>/.exec(trimmed);
  const email = (bracketed ? bracketed[1] : trimmed).trim();
  return email.length > 0 ? email : null;
}

/**
 * `RESEND_REPLY_TO_EMAIL` is optional — when unset, Reply-To falls back to
 * the same address as the sender (both are `masum@masumdev.com` in
 * production, so this is the common case). Reading it explicitly, rather
 * than silently ignoring it, means an operator who sets it in `.env.local`
 * gets what they configured instead of an orphaned variable nothing reads.
 * Accepts either a raw email or a `"Name <email>"` value, same as
 * `getSenderEmail()` — Reply-To headers take a bare address either way, so
 * a formatted value's display name is discarded, not an error.
 */
function getReplyToEmail(senderEmail: string): string {
  const raw = process.env.RESEND_REPLY_TO_EMAIL;
  if (!raw || raw.trim().length === 0) return senderEmail;

  const trimmed = raw.trim();
  const bracketed = /<([^<>]+)>/.exec(trimmed);
  const email = (bracketed ? bracketed[1] : trimmed).trim();
  return email.length > 0 ? email : senderEmail;
}

/**
 * Fails soft — every caller treats a non-`ok` result as "recorded, retry
 * later," never as a reason to undo the `PAID` transition that triggered
 * it. See `confirmationEmail: DeliveryState` on `PaymentOrderDocument`.
 *
 * Two required configuration values gate every send: `RESEND_API_KEY` and
 * `RESEND_FROM_EMAIL`. Missing either one fails clearly with a distinct
 * error code recorded on the order (visible in the admin UI's Retry
 * button) — it never falls back to some other address or attempts a send
 * with a blank/wrong `From`. `RESEND_REPLY_TO_EMAIL` is optional and only
 * overrides Reply-To if explicitly set — see `getReplyToEmail()`.
 */
export async function sendConfirmationEmail(input: ConfirmationEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, errorCode: "EMAIL_NOT_CONFIGURED" };
  }

  const senderEmail = getSenderEmail();
  if (!senderEmail) {
    return { ok: false, errorCode: "SENDER_NOT_CONFIGURED" };
  }

  const { subject, html } = buildEmailBody(input);
  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send(
      {
        from: `${SENDER_DISPLAY_NAME} <${senderEmail}>`,
        replyTo: getReplyToEmail(senderEmail),
        to: input.toEmail,
        subject,
        html,
      },
      /*
       * Deterministic per registration — if a manual "Retry" is clicked
       * after a send that actually succeeded but whose response our app
       * lost (a network blip, a timeout), Resend recognizes the repeated
       * `Idempotency-Key` and returns the original result instead of
       * delivering a second email. One student only ever gets one
       * confirmation email for one registration, regardless of how many
       * times this function is called for it.
       */
      { idempotencyKey: `masterclass-confirmation-${input.registrationRef}` },
    );

    if (result.error) {
      return { ok: false, errorCode: "PROVIDER_ERROR" };
    }
    return { ok: true };
  } catch {
    return { ok: false, errorCode: "NETWORK_ERROR" };
  }
}
