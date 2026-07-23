import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/lib/i18n";

function preferredLocale(request: NextRequest) {
  const accepted = request.headers.get("accept-language")?.toLowerCase() || "";
  return locales.find((locale) => accepted.includes(locale)) || "de";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response =
    pathname === "/"
      ? NextResponse.redirect(new URL(`/${preferredLocale(request)}`, request.url))
      : NextResponse.next();

  if (!request.cookies.has("csrf_token")) {
    response.cookies.set("csrf_token", crypto.randomUUID(), {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.jpeg|robots.txt|sitemap.xml).*)"],
};
