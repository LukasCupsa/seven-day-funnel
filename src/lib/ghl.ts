// GoHighLevel embed helpers (form + calendar).

export const GHL_FORM_ID = "eqOxQBD6j0s7RYB29dcl";
export const GHL_FORM_URL = `https://api.leadconnectorhq.com/widget/survey/${GHL_FORM_ID}`;
const GHL_EMBED_SCRIPT = "https://link.msgsndr.com/js/form_embed.js";

export const BOOKING_IDENTITY_KEYS = ["first_name", "last_name", "email", "phone"] as const;
export type BookingIdentity = Partial<Record<(typeof BOOKING_IDENTITY_KEYS)[number], string>>;

/** Loads GHL's form_embed.js once per page (handles iframe auto-resize). */
export function loadGhlEmbedScript() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${GHL_EMBED_SCRIPT}"]`)) return;
  const s = document.createElement("script");
  s.src = GHL_EMBED_SCRIPT;
  s.async = true;
  document.body.appendChild(s);
}

/** Pure: pulls first_name/last_name/email/phone out of a query string. */
export function parseBookingIdentity(search: string): BookingIdentity {
  const params = new URLSearchParams(search);
  const out: BookingIdentity = {};
  for (const k of BOOKING_IDENTITY_KEYS) {
    const v = params.get(k)?.trim();
    if (v) out[k] = v;
  }
  return out;
}

/** Pure: returns the query string with identity params removed (keeps leading "?" when non-empty). */
export function stripBookingIdentity(search: string): string {
  const params = new URLSearchParams(search);
  BOOKING_IDENTITY_KEYS.forEach((k) => params.delete(k));
  const s = params.toString();
  return s ? `?${s}` : "";
}
