// Captures ad attribution (UTMs, fbclid, Meta cookies) and appends it to the
// GoHighLevel form URL so GHL hidden fields fill automatically.

export const URL_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type AttributionKey = (typeof URL_ATTRIBUTION_KEYS)[number] | "fbp" | "fbc";
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "dti_attribution";

/** Pure: pulls only the allowed attribution keys out of a query string. */
export function parseUrlAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  const out: Attribution = {};
  for (const key of URL_ATTRIBUTION_KEYS) {
    const v = params.get(key)?.trim();
    if (v) out[key] = v;
  }
  return out;
}

/** Pure: newer non-empty values win over stored ones. */
export function mergeAttribution(stored: Attribution, incoming: Attribution): Attribution {
  const out: Attribution = { ...stored };
  (Object.keys(incoming) as AttributionKey[]).forEach((k) => {
    if (incoming[k]) out[k] = incoming[k];
  });
  return out;
}

/** Pure: appends attribution + extra params to a base URL. Empty values are skipped. */
export function buildUrlWithParams(
  base: string,
  attribution: Attribution,
  extra: Record<string, string | undefined> = {},
): string {
  const url = new URL(base);
  const all: Record<string, string | undefined> = { ...attribution, ...extra };
  Object.entries(all).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

/**
 * Browser only. Reads URL params + _fbp/_fbc cookies, merges with what's
 * already stored this session, persists, and returns the result.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let merged = mergeAttribution(readStoredAttribution(), parseUrlAttribution(window.location.search));

  const fbp = readCookie("_fbp");
  const fbcCookie = readCookie("_fbc");
  if (fbp) merged.fbp = fbp;
  if (fbcCookie) merged.fbc = fbcCookie;
  // Meta's documented fbc format when the Pixel hasn't set the cookie yet.
  if (!merged.fbc && merged.fbclid) merged.fbc = `fb.1.${Date.now()}.${merged.fbclid}`;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable */
  }
  return merged;
}
