/**
 * Simply Enak — Cloudflare Worker: Form Handler
 *
 * Receives contact, inquiry, and newsletter submissions from the website.
 * - Validates Cloudflare Turnstile token on every request
 * - Sends email notifications via Resend
 * - Returns JSON responses for AJAX form submissions
 *
 * Routes:
 *   POST /api/contact    — General contact form
 *   POST /api/inquiry    — Tour booking inquiry (sidebar + mobile drawer)
 *   POST /api/newsletter — Newsletter signup
 */

// ── CORS ──────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://simplyenak.com",
  "https://staging.simplyenak.com",
  "https://www.simplyenak.com",
];

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

// ── Turnstile Verification ───────────────────────────────────────────────────

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
}

async function verifyTurnstile(
  token: string | null,
  secret: string,
  remoteip?: string
): Promise<boolean> {
  if (!token) return false;

  const body: Record<string, string> = {
    secret,
    response: token,
  };
  if (remoteip) body["remoteip"] = remoteip;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as TurnstileVerifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}

// ── Resend Email ─────────────────────────────────────────────────────────────

async function sendEmail(
  apiKey: string,
  to: string,
  toName: string,
  subject: string,
  html: string
): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Simply Enak <${to}>`,
      to: [{ email: to, name: toName }],
      subject,
      html,
    }),
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 2000); // basic length cap
}

function sanitizeEmail(str: unknown): string {
  const s = sanitize(str).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : "";
}

function sanitizePhone(str: unknown): string {
  const s = sanitize(str);
  return s.replace(/[^+\d\s\-()]/g, "");
}

// ── Request Handlers ─────────────────────────────────────────────────────────

interface ContactPayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  country?: string;
  inquiryType?: string;
  message: string;
  honeypot_website?: string;
  submittedAt?: string;
  source?: string;
}

async function handleContact(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as ContactPayload;

  // Honeypot check
  if (body.honeypot_website) {
    return jsonResponse({ success: true, message: "OK" }); // silently accept spam
  }

  // Validate required fields
  const name = sanitize(body.fullName);
  const email = sanitizeEmail(body.email);
  const message = sanitize(body.message);
  if (!name || !email || !message) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // Verify Turnstile
  const cfResponse = request.headers.get("CF-Connecting-IP") ?? "";
  const token = body.honeypot_website // Turnstile token sent in honeypot_website field won't work
    ? null
    : (body as any).cfTurnstileResponse || null;

  // Accept Turnstile from header or body
  const turnstileToken =
    request.headers.get("X-Turnstile-Token") ||
    (body as any).cfTurnstileResponse ||
    null;

  if (env.TURNSTILE_SECRET !== "local-skip" && env.TURNSTILE_SECRET) {
    const valid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, cfResponse);
    if (!valid) {
      return jsonResponse({ error: "Spam verification failed. Please try again." }, 403);
    }
  }

  // Send email notification
  const inquiryType = sanitize(body.inquiryType) || "General";
  const phone = sanitizePhone(body.phoneNumber || "");
  const company = sanitize(body.company || "");
  const country = sanitize(body.country || "");

  const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2d5016;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone || "—"}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${company || "—"}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Inquiry Type</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${inquiryType}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Country</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${country || "—"}</td></tr>
  </table>
  <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 4px; font-size: 14px; white-space: pre-wrap;">${message}</div>
  <p style="color: #888; font-size: 12px; margin-top: 20px;">Submitted at: ${body.submittedAt || new Date().toISOString()}<br>Source: ${body.source || "website"}</p>
</body>
</html>`;

  const emailRes = await sendEmail(
    env.RESEND_API_KEY,
    env.NOTIFICATION_EMAIL,
    "Simply Enak Team",
    `📩 New Contact Inquiry — ${name}`,
    emailHtml
  );

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error("Resend email error:", emailRes.status, errText);
    return jsonResponse({ error: "Failed to send message. Please try again." }, 502);
  }

  return jsonResponse({ success: true, message: "Thank you! We'll be in touch." });
}

interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  tourName: string;
  tourPrice?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: string;
  children?: string;
  specialRequests?: string;
  honeypot_website?: string;
  source?: string;
  submittedAt?: string;
}

async function handleInquiry(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as InquiryPayload;

  // Honeypot check
  if (body.honeypot_website) {
    return jsonResponse({ success: true, message: "OK" });
  }

  const name = sanitize(body.name);
  const email = sanitizeEmail(body.email);
  if (!name || !email) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  // Verify Turnstile
  const cfResponse = request.headers.get("CF-Connecting-IP") ?? "";
  const turnstileToken =
    request.headers.get("X-Turnstile-Token") ||
    (body as any).cfTurnstileResponse ||
    null;

  if (env.TURNSTILE_SECRET !== "local-skip" && env.TURNSTILE_SECRET) {
    const valid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, cfResponse);
    if (!valid) {
      return jsonResponse({ error: "Spam verification failed. Please try again." }, 403);
    }
  }

  // Build email
  const tourName = sanitize(body.tourName) || "Unknown Tour";
  const tourPrice = sanitize(body.tourPrice) || "";
  const dateFrom = sanitize(body.dateFrom) || "Flexible";
  const dateTo = sanitize(body.dateTo) || "Flexible";
  const adults = sanitize(body.adults) || "2";
  const children = sanitize(body.children) || "0";
  const specialRequests = sanitize(body.specialRequests || "");
  const phone = sanitizePhone(body.phone || "");

  const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2d5016;">🔔 New Tour Inquiry</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Tour</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${tourName}${tourPrice ? ` (RM ${tourPrice}/pax)` : ""}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Phone / WhatsApp</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${phone || "—"}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Dates</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${dateFrom} → ${dateTo}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Adults</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${adults}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Children</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${children}</td></tr>
  </table>
  ${specialRequests ? `<div style="margin-top: 12px; padding: 10px; background: #f9f9f9; border-radius: 4px;"><strong>Special Requests:</strong><br>${specialRequests}</div>` : ""}
  <p style="color: #888; font-size: 12px; margin-top: 16px;">Submitted: ${body.submittedAt || new Date().toISOString()}<br>Source: ${body.source || "website"}</p>
</body>
</html>`;

  const emailRes = await sendEmail(
    env.RESEND_API_KEY,
    env.NOTIFICATION_EMAIL,
    "Simply Enak Team",
    `📋 New Tour Inquiry — ${name} (${tourName})`,
    emailHtml
  );

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error("Resend email error:", emailRes.status, errText);
    return jsonResponse({ error: "Failed to send inquiry. Please try again." }, 502);
  }

  return jsonResponse({ success: true, message: "Thank you! We'll confirm within 24 hours." });
}

interface NewsletterPayload {
  email: string;
  honeypot_website?: string;
  submittedAt?: string;
  source?: string;
}

async function handleNewsletter(
  request: Request,
  env: Env
): Promise<Response> {
  const body = (await request.json()) as NewsletterPayload;

  // Honeypot check
  if (body.honeypot_website) {
    return jsonResponse({ success: true, message: "OK" });
  }

  const email = sanitizeEmail(body.email);
  if (!email) {
    return jsonResponse({ error: "Please provide a valid email address" }, 400);
  }

  // Verify Turnstile
  const cfResponse = request.headers.get("CF-Connecting-IP") ?? "";
  const turnstileToken =
    request.headers.get("X-Turnstile-Token") ||
    (body as any).cfTurnstileResponse ||
    null;

  if (env.TURNSTILE_SECRET !== "local-skip" && env.TURNSTILE_SECRET) {
    const valid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, cfResponse);
    if (!valid) {
      return jsonResponse({ error: "Spam verification failed. Please try again." }, 403);
    }
  }

  // Send confirmation email + notification
  // 1. Add to Resend audience (if audience ID configured)
  if (env.RESEND_AUDIENCE_ID) {
    try {
      await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          data: { subscribed_at: body.submittedAt || new Date().toISOString() },
        }),
      });
    } catch (err) {
      console.error("Resend audience add error:", err);
      // Non-fatal — continue with notification email
    }
  }

  // 2. Send notification to team
  const emailHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2d5016;">📰 New Newsletter Subscriber</h2>
  <p style="font-size: 14px;">A new subscriber signed up:</p>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
    <tr><td style="padding: 6px 0; border-bottom: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 6px 0; border-bottom: 1px solid #eee;">${body.source || "website"}</td></tr>
  </table>
  <p style="color: #888; font-size: 12px; margin-top: 16px;">Submitted: ${body.submittedAt || new Date().toISOString()}</p>
</body>
</html>`;

  const emailRes = await sendEmail(
    env.RESEND_API_KEY,
    env.NOTIFICATION_EMAIL,
    "Simply Enak Team",
    `📰 New Newsletter Subscriber — ${email}`,
    emailHtml
  );

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    console.error("Resend email error:", emailRes.status, errText);
    return jsonResponse({ error: "Failed to subscribe. Please try again." }, 502);
  }

  return jsonResponse({ success: true, message: "Thanks for subscribing!" });
}

// ── Router ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // Add CORS headers to all responses
    const cors = corsHeaders(request);

    switch (url.pathname) {
      case "/api/contact":
        return addCors(await handleContact(request, env), cors);
      case "/api/inquiry":
        return addCors(await handleInquiry(request, env), cors);
      case "/api/newsletter":
        return addCors(await handleNewsletter(request, env), cors);
      default:
        return addCors(jsonResponse({ error: "Not found" }, 404), cors);
    }
  },
};

function addCors(response: Response, cors: Record<string, string>): Response {
  const newResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(cors)) {
    newResponse.headers.set(key, value);
  }
  return newResponse;
}