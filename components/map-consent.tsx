"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

export function MapConsent({ title, buttonLabel }: { title: string; buttonLabel: string }) {
  const [allowed, setAllowed] = useState(false);
  if (allowed) {
    return (
      <iframe
        className="map-frame"
        title={title}
        src="https://www.google.com/maps?q=Fr%C3%BCchtstra%C3%9Fe%201%2C%2055130%20Mainz&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  return (
    <div className="map-consent">
      <MapPin size={34} aria-hidden="true" />
      <p>{title}</p>
      <button type="button" className="button button-secondary" onClick={() => setAllowed(true)}>{buttonLabel}</button>
    </div>
  );
}
