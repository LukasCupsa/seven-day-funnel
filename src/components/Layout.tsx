import { type ReactNode, useEffect } from "react";

const PIXEL_ID = "4363238667073952";

function loadPixel() {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.fbq) return;
  /* eslint-disable */
  (function(f: any,b: any,e: any,v: any){if(f.fbq)return;const n:any=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];const t=b.createElement(e);t.async=!0;t.src=v;const s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  w.fbq("init", PIXEL_ID);
}

export function usePixel(events: Array<[string, string?]> = [["PageView"]]) {
  useEffect(() => {
    loadPixel();
    const fbq = (window as any).fbq;
    if (!fbq) return;
    events.forEach(([ev, extra]) => {
      if (extra) fbq("track", ev, extra);
      else fbq("track", ev);
    });
  }, []);
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type TrackPayload = {
  event_name: "Lead" | "Schedule" | "CompleteRegistration" | "ViewContent";
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  custom_data?: Record<string, unknown>;
};

// Fires an event through the browser Pixel AND our server-side CAPI proxy,
// deduped via a shared event_id.
export async function trackEvent(p: TrackPayload) {
  if (typeof window === "undefined") return;
  loadPixel();
  const event_id = uuid();
  const fbq = (window as any).fbq;
  if (fbq) fbq("track", p.event_name, p.custom_data || {}, { eventID: event_id });
  try {
    await fetch("/api/public/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: p.event_name,
        event_id,
        event_source_url: window.location.href,
        email: p.email,
        phone: p.phone,
        first_name: p.first_name,
        last_name: p.last_name,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        client_user_agent: navigator.userAgent,
        custom_data: p.custom_data,
      }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
      <footer className="mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-4">
          <img src="/dti-logo.png" alt="DTI Media" className="h-32 w-auto opacity-90" />
          <div className="text-center text-sm text-muted-foreground tracking-wide">
            © DTI Media 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

export function VideoEmbed({
  youtubeId,
  title,
  autoplay = false,
}: {
  youtubeId?: string;
  title?: string;
  autoplay?: boolean;
}) {
  const params = autoplay ? "?autoplay=1&mute=1&playsinline=1&rel=0" : "?rel=0";
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden gold-border bg-black">
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}${params}`}
          title={title || "video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-accent ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Loads Wistia player.js once
let wistiaLoaded = false;
function loadWistia() {
  if (typeof window === "undefined" || wistiaLoaded) return;
  wistiaLoaded = true;
  const s1 = document.createElement("script");
  s1.src = "https://fast.wistia.com/player.js";
  s1.async = true;
  document.head.appendChild(s1);
}

export function WistiaEmbed({ mediaId, title }: { mediaId: string; title?: string }) {
  useEffect(() => {
    loadWistia();
    const id = `wistia-loader-${mediaId}`;
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = `https://fast.wistia.com/embed/${mediaId}.js`;
      s.async = true;
      s.type = "module";
      document.head.appendChild(s);
    }
  }, [mediaId]);

  const swatch = `https://fast.wistia.com/embed/medias/${mediaId}/swatch`;
  return (
    <div className="relative w-full rounded-lg overflow-hidden gold-border bg-black">
      <div style={{ paddingTop: "56.25%" }} />
      <div className="absolute inset-0">
        {/* @ts-expect-error - custom element */}
        <wistia-player
          media-id={mediaId}
          aspect="1.7777777777777777"
          title={title}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: `center / contain no-repeat url('${swatch}')`,
          }}
        />
      </div>
    </div>
  );
}
