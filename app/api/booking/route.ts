import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, cleanText, clientIp, deliverEmail, rateLimited, verifyRequest } from "@/lib/security";

const schema = z.strictObject({
  csrf: z.string().uuid(),
  locale: z.enum(["de", "fr", "en", "tr", "ar"]),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().min(5).max(40),
  date: z.iso.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  service: z.string().trim().min(2).max(100),
  privacy: z.literal(true),
  website: z.literal("").optional().default(""),
});

export async function POST(request: NextRequest) {
  if (rateLimited(`booking:${clientIp(request)}`, 4)) return apiError("Too many requests", 429);
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);
  if (!result.success || !verifyRequest(request, result.data?.csrf)) return apiError("Invalid request", 400);
  const data = result.data;
  if (new Date(`${data.date}T${data.time}:00`).getTime() < Date.now() - 60_000) return apiError("Invalid date", 400);

  const html = `<h2>Neue Terminanfrage</h2>
    <p><strong>Name:</strong> ${cleanText(data.name)}</p>
    <p><strong>E-Mail:</strong> ${cleanText(data.email)}</p>
    <p><strong>Telefon:</strong> ${cleanText(data.phone)}</p>
    <p><strong>Wunsch:</strong> ${cleanText(data.date)} um ${cleanText(data.time)}</p>
    <p><strong>Thema:</strong> ${cleanText(data.service)}</p>`;
  const sent = await deliverEmail(`Terminanfrage für ${cleanText(data.date)}`, html);
  if (!sent.configured) return apiError("Email service not configured", 503);
  if (!sent.ok) return apiError("Delivery failed", 502);
  return NextResponse.json({ ok: true });
}
