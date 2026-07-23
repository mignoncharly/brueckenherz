"use client";

import { FormEvent, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

function csrf() {
  return document.cookie.split("; ").find((row) => row.startsWith("csrf_token="))?.split("=")[1] || "";
}

async function sendJson(endpoint: string, data: Record<string, unknown>) {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-requested-with": "brueckenherz-form" },
    body: JSON.stringify({ ...data, csrf: csrf() }),
  });
}

function StatusMessage({ status, success, error }: { status: Status; success: string; error: string }) {
  if (status === "idle" || status === "sending") return null;
  return <p className={`form-status ${status}`} role="status">{status === "success" ? success : error}</p>;
}

export function ContactForm({ locale, d }: { locale: Locale; d: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await sendJson("/api/contact", { ...values, locale, privacy: values.privacy === "on" }).catch(() => null);
    const ok = response?.ok || false;
    setStatus(ok ? "success" : "error");
    if (ok) form.reset();
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>{d.contact.formTitle}</h2>
      <div className="form-grid">
        <Field label={d.contact.name} name="name" required autoComplete="name" />
        <Field label={d.contact.email} name="email" type="email" required autoComplete="email" />
        <Field label={d.contact.phone} name="phone" type="tel" autoComplete="tel" />
        <label className="field"><span>{d.contact.subject} *</span><select name="subject" required defaultValue=""><option value="" disabled>—</option>{d.contact.subjectOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label className="field field-full"><span>{d.contact.message} *</span><textarea name="message" required minLength={10} maxLength={3000} rows={6} /><small>{d.contact.messageHint}</small></label>
      </div>
      <Honeypot />
      <Privacy d={d} />
      <button className="button button-primary" disabled={status === "sending"}>{status === "sending" ? d.common.sending : d.common.send}</button>
      <StatusMessage status={status} success={d.common.success} error={d.common.error} />
    </form>
  );
}

export function BookingForm({ locale, d }: { locale: Locale; d: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const response = await sendJson("/api/booking", { ...values, locale, privacy: values.privacy === "on" }).catch(() => null);
    const ok = response?.ok || false;
    setStatus(ok ? "success" : "error");
    if (ok) form.reset();
  }
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className="form-card form-card-dark" id="termin" onSubmit={submit}>
      <h2>{d.contact.bookTitle}</h2>
      <p>{d.contact.bookText}</p>
      <div className="form-grid">
        <Field label={d.contact.name} name="name" required autoComplete="name" />
        <Field label={d.contact.email} name="email" type="email" required autoComplete="email" />
        <Field label={d.contact.phone} name="phone" type="tel" required autoComplete="tel" />
        <Field label={d.contact.date} name="date" type="date" min={today} required />
        <Field label={d.contact.time} name="time" type="time" required />
        <label className="field"><span>{d.contact.service} *</span><select name="service" required defaultValue=""><option value="" disabled>—</option>{d.services.items.map((item) => <option key={item.id}>{item.title}</option>)}</select></label>
      </div>
      <Honeypot />
      <Privacy d={d} />
      <button className="button button-gold" disabled={status === "sending"}>{status === "sending" ? d.common.sending : d.common.send}</button>
      <StatusMessage status={status} success={d.contact.bookingSuccess} error={d.common.error} />
    </form>
  );
}

export function ApplicationForm({ locale, d }: { locale: Locale; d: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("csrf", csrf());
    data.set("locale", locale);
    data.set("privacy", data.get("privacy") === "on" ? "true" : "false");
    const response = await fetch("/api/application", { method: "POST", headers: { "x-requested-with": "brueckenherz-form" }, body: data }).catch(() => null);
    const ok = response?.ok || false;
    setStatus(ok ? "success" : "error");
    if (ok) form.reset();
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>{d.career.formTitle}</h2>
      <div className="form-grid">
        <Field label={d.contact.name} name="name" required autoComplete="name" />
        <Field label={d.contact.email} name="email" type="email" required autoComplete="email" />
        <Field label={d.contact.phone} name="phone" type="tel" autoComplete="tel" />
        <label className="field"><span>{d.career.position} *</span><select name="position" required defaultValue=""><option value="" disabled>—</option>{d.career.jobs.map((job) => <option key={job.title}>{job.title}</option>)}</select></label>
        <label className="field field-full"><span>{d.career.motivation} *</span><textarea name="motivation" required minLength={10} maxLength={2000} rows={5} /></label>
        <label className="field field-full"><span>{d.career.file} *</span><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required /><small>{d.career.fileHint}</small></label>
      </div>
      <Honeypot />
      <Privacy d={d} />
      <button className="button button-primary" disabled={status === "sending"}>{status === "sending" ? d.common.sending : d.common.send}</button>
      <StatusMessage status={status} success={d.career.applicationSuccess} error={d.common.error} />
    </form>
  );
}

function Field({ label, name, type = "text", required, ...props }: { label: string; name: string; type?: string; required?: boolean; [key: string]: string | boolean | undefined }) {
  return <label className="field"><span>{label}{required ? " *" : ""}</span><input name={name} type={type} required={required} {...props} /></label>;
}

function Privacy({ d }: { d: Dictionary }) {
  return <label className="checkbox"><input name="privacy" type="checkbox" required /><span>{d.common.privacy}</span></label>;
}

function Honeypot() {
  return <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>;
}
