import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="de">
      <body>
        <main className="not-found">
          <p>404</p>
          <h1>Diese Seite wurde nicht gefunden.</h1>
          <Link href="/de">Zur Startseite</Link>
        </main>
      </body>
    </html>
  );
}
