import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, cleanText, clientIp, deliverEmail, rateLimited, verifyRequest } from "@/lib/security";

const schema = z.strictObject({
  csrf: z.string().uuid(),
  locale: z.enum(["de", "fr", "en", "tr", "ar"]),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(3000),
  privacy: z.literal(true),
  website: z.literal("").optional().default(""),
});

export async function POST(request: NextRequest) {
  if (rateLimited(`contact:${clientIp(request)}`)) return apiError("Too many requests", 429);
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);
  if (!result.success || !verifyRequest(request, result.data?.csrf)) return apiError("Invalid request", 400);

  const data = result.data;
  const html = `<h2>Neue Kontaktanfrage</h2>
    <p><strong>Name:</strong> ${cleanText(data.name)}</p>
    <p><strong>E-Mail:</strong> ${cleanText(data.email)}</p>
    <p><strong>Telefon:</strong> ${cleanText(data.phone)}</p>
    <p><strong>Thema:</strong> ${cleanText(data.subject)}</p>
    <p><strong>Sprache:</strong> ${data.locale}</p>
    <p>${cleanText(data.message)}</p>`;
  const sent = await deliverEmail(`Website-Anfrage: ${cleanText(data.subject)}`, html);
  if (!sent.configured) return apiError("Email service not configured", 503);
  if (!sent.ok) return apiError("Delivery failed", 502);
  return NextResponse.json({ ok: true });
}
