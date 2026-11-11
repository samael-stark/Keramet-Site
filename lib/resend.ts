import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(apiKey);

// 🔐 Production-safe config
export const resendConfig = {
  from: process.env.RESEND_FROM_EMAIL!,
  adminEmail: process.env.RESEND_ADMIN_EMAIL || "",
};

type SendPayload = Parameters<typeof resend.emails.send>[0];

// Send an email and THROW if Resend rejects it.
// resend.emails.send() does not throw on failure (e.g. 403 "domain not
// verified"); it returns { data, error }. Without this check failed emails
// looked successful and orders were marked as "email sent".
export async function sendEmail(payload: SendPayload) {
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    throw new Error(
      `Resend error ${error.statusCode ?? ""} ${error.name}: ${error.message}`.trim()
    );
  }

  return data;
}
