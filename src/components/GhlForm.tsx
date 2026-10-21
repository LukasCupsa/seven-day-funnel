import { useEffect, useRef, useState } from "react";
import { buildUrlWithParams, captureAttribution } from "@/lib/attribution";
import { GHL_FORM_ID, GHL_FORM_URL, loadGhlEmbedScript } from "@/lib/ghl";

export function GhlForm({ niche, pageSlug }: { niche: string; pageSlug: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // Build the src lazily, right before the form scrolls into view, so the
    // Pixel has had time to set _fbp/_fbc cookies.
    const start = () => {
      const url = buildUrlWithParams(GHL_FORM_URL, captureAttribution(), {
        niche,
        page_slug: pageSlug,
      });
      setSrc(url);
      loadGhlEmbedScript();
    };
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [niche, pageSlug]);

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-lg gold-border bg-card overflow-hidden min-h-[520px] md:min-h-[600px]"
      >
        {!loaded && (
          <div
            className="absolute inset-0 p-5 md:p-8 space-y-5 animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          >
            <div className="h-6 w-2/3 rounded bg-muted" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-12 w-full rounded bg-muted" />
              </div>
            ))}
            <div className="h-14 w-full rounded bg-accent/20" />
          </div>
        )}
        {src && (
          <iframe
            src={src}
            style={{ border: "none", width: "100%", height: 520 }}
            scrolling="no"
            id={GHL_FORM_ID}
            title="survey"
            data-cookie-consent="true"
            data-cookie-consent-provider="auto"
            onLoad={() => setLoaded(true)}
            className="relative block"
          />
        )}
        <span className="sr-only" role="status">
          {loaded ? "Application form loaded" : "Loading application form"}
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-secondary-foreground/80">
        Having trouble?{" "}
        <a
          href={src ?? GHL_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
        >
          Open the form in a new tab
        </a>
      </p>
    </div>
  );
}
