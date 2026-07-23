import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function clientIp(request: NextRequest) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function rateLimited(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

export function verifyRequest(request: NextRequest, token: unknown) {
  const cookie = request.cookies.get("csrf_token")?.value;
  const requestedWith = request.headers.get("x-requested-with");
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!cookie || typeof token !== "string" || cookie !== token || requestedWith !== "brueckenherz-form") return false;
  if (origin && host && new URL(origin).host !== host) return false;
  return true;
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function cleanText(value: string) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export async function deliverEmail(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { configured: false, ok: false };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || "website@brueckenherz.de",
      to: [process.env.TO_EMAIL || "Brueckenherzteam@gmail.com"],
      subject,
      html,
    }),
  });
  return { configured: true, ok: response.ok };
}
