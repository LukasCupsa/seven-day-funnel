import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout, VideoEmbed, usePixel } from "@/components/Layout";

export const Route = createFileRoute("/book-your-call")({
  component: BookYourCall,
});

const BULLETS = [
  "Where your current marketing is breaking trust or stalling momentum — even if things seem fine on the surface",
  "Which lever matters most right now — content, positioning, or paid ads — and where focusing creates the fastest impact",
  "How to build visibility and consistent leads without chaos, burnout, or random posting — using a repeatable system",
  "Whether we're the right partner to build this for you — and if we're not, we'll tell you and point you somewhere better",
];

function BookYourCall() {
  usePixel([["PageView"], ["Lead"]]);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
  }, []);

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-6 pt-10 md:pt-14 text-center">
        <h1 className="display text-4xl md:text-6xl text-accent">
          ⚡️ Final Step — Secure Your Spot Now ⚡️
        </h1>
        <p className="mt-8 text-lg md:text-xl font-semibold text-white">
          Your application is only considered complete once you book your call.
        </p>
        <p className="mt-4 text-base md:text-lg text-muted-foreground font-light">
          Exiting this page will erase your answers, and your application will not be reviewed. This is a one-time submission — protect the work you just put in.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pt-10 pb-4 text-center">
        <h2 className="display text-3xl md:text-5xl text-accent">
          ⬇️ Book Your Call Here ⬇️
        </h2>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="rounded-lg overflow-hidden gold-border bg-card">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/lukas-dti-media/1-on-1-call?background_color=0a0a0a&text_color=ffffff&primary_color=c9a84c"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="display text-3xl md:text-5xl text-center mb-8">
          Hear From <span className="text-accent">Jared</span>
        </h2>
        <VideoEmbed youtubeId="GtsUQxhHp_k" title="Jared testimonial" />
      </section>

      <section className="max-w-3xl mx-auto px-6 pt-12 text-center">
        <h2 className="display text-4xl md:text-6xl text-accent">⚡ Why Book a Call? ⚡</h2>
        <p className="mt-6 text-xl md:text-2xl text-white">This isn't a sales call.</p>
        <p className="mt-6 text-lg md:text-xl font-semibold text-white">
          It's a private strategy session designed to uncover exactly why your Ottawa business isn't generating consistent leads online — and what it's quietly costing you every month.
        </p>
        <p className="mt-6 text-base md:text-lg text-muted-foreground">
          If you qualify, we'll map out exactly how the DTI Media Content Conversion Framework would be installed inside your business — using the same system we use to help local service businesses move away from referrals and into predictable inbound demand.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h3 className="display text-2xl md:text-3xl text-center mb-8">On this private call, you'll discover:</h3>
        <ul className="space-y-5">
          {BULLETS.map((b, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="text-accent text-2xl leading-none shrink-0 mt-1">✓</span>
              <span className="text-base md:text-lg text-white/90 font-light">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-lg md:text-xl font-semibold text-white">
          This conversation is reserved for established local service businesses in Ottawa and Kingston that already have real operations, real clients, and real standards — and want to become the obvious choice in their local market.
        </p>
      </section>
    </Layout>
  );
}
