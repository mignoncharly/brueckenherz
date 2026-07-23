import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, cleanText, clientIp, rateLimited, verifyRequest } from "@/lib/security";

export const runtime = "nodejs";

const fields = z.strictObject({
  csrf: z.string().uuid(),
  locale: z.enum(["de", "fr", "en", "tr", "ar"]),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().max(40),
  position: z.string().trim().min(2).max(120),
  motivation: z.string().trim().min(10).max(2000),
  privacy: z.literal("true"),
  website: z.literal("").optional().default(""),
});

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (rateLimited(`application:${clientIp(request)}`, 3, 30 * 60 * 1000)) return apiError("Too many requests", 429);
  const form = await request.formData().catch(() => null);
  if (!form) return apiError("Invalid request", 400);
  const raw = Object.fromEntries([...form.entries()].filter(([key]) => key !== "file")) as Record<string, string>;
  const parsed = fields.safeParse(raw);
  if (!parsed.success || !verifyRequest(request, parsed.data?.csrf)) return apiError("Invalid request", 400);

  const file = form.get("file");
  if (!(file instanceof File) || file.size < 1 || file.size > maxBytes || !allowedTypes.has(file.type)) {
    return apiError("Invalid file", 400);
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return apiError("Email service not configured", 503);

  const attachment = Buffer.from(await file.arrayBuffer()).toString("base64");
  const data = parsed.data;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || "website@brueckenherz.de",
      to: [process.env.TO_EMAIL || "Brueckenherzteam@gmail.com"],
      subject: `Bewerbung: ${cleanText(data.position)}`,
      html: `<h2>Neue Bewerbung</h2>
        <p><strong>Name:</strong> ${cleanText(data.name)}</p>
        <p><strong>E-Mail:</strong> ${cleanText(data.email)}</p>
        <p><strong>Telefon:</strong> ${cleanText(data.phone)}</p>
        <p><strong>Position:</strong> ${cleanText(data.position)}</p>
        <p>${cleanText(data.motivation)}</p>`,
      attachments: [{ filename: cleanText(file.name), content: attachment }],
    }),
  });
  if (!response.ok) return apiError("Delivery failed", 502);
  return NextResponse.json({ ok: true });
}
