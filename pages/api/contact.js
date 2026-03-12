import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyTurnstile(token) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, turnstileToken, honeypot } = req.body;

  // Honeypot check — bots fill hidden fields
  if (honeypot) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message || !turnstileToken) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Verify Turnstile token
  const turnstileValid = await verifyTurnstile(turnstileToken);
  if (!turnstileValid) {
    return res.status(400).json({ error: "Bot verification failed" });
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
