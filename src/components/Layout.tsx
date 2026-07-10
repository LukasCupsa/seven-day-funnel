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

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
      <footer className="mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-4">
          <img src="/dti-logo.png" alt="DTI Media" className="h-14 w-auto opacity-90" />
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
