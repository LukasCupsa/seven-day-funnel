import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { CalendarCheck, ChevronDown, ChevronRight, Clapperboard, Megaphone, Send, X } from "lucide-react";
import { WistiaEmbed, trackEvent, usePixel } from "@/components/Layout";
import { GhlForm } from "@/components/GhlForm";
import { captureAttribution } from "@/lib/attribution";
import {
  HOW_IT_WORKS,
  NICHE_PROOF_LINE,
  NICHE_VSL_MEDIA_ID,
  splitHeadline,
  type NicheConfig,
} from "@/lib/niches";

const STEP_ICONS = [Clapperboard, Send, Megaphone, CalendarCheck];
const FORM_ANCHOR = "apply";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToForm() {
  document
    .getElementById(FORM_ANCHOR)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function CtaButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={scrollToForm}
      className="display w-full sm:w-auto min-h-14 px-6 sm:px-10 py-4 rounded-md bg-accent text-accent-foreground text-xl md:text-2xl tracking-wide hover:brightness-110 active:brightness-95 transition motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {label} <span aria-hidden="true">→</span>
    </button>
  );
}

function Headline({ text }: { text: string }) {
  return (
    <h1 className="display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-foreground">
      {splitHeadline(text).map((p, i) =>
        p.gold ? (
          <span key={i} className="text-accent">
            {p.text}
          </span>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </h1>
  );
}

function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h2 id="how-it-works" className="display text-3xl md:text-4xl text-center text-foreground mb-8">
        How It <span className="text-accent">Works</span>
      </h2>
      <ol className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-3">
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const last = i === HOW_IT_WORKS.length - 1;
          return (
            <Fragment key={step.title}>
              <li className="flex-1 rounded-lg border border-accent/50 bg-card p-5 flex lg:flex-col items-start gap-4">
                <span className="shrink-0 h-12 w-12 rounded-full border-2 border-accent flex items-center justify-center text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="display text-2xl text-foreground">{step.title}</h3>
                  <p className="mt-2 text-base text-secondary-foreground leading-snug">{step.body}</p>
                </div>
              </li>
              {!last && (
                <li aria-hidden="true" className="flex items-center justify-center text-accent">
                  <ChevronDown className="h-6 w-6 lg:hidden" />
                  <ChevronRight className="h-7 w-7 hidden lg:block" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}

export function NichePage({ config }: { config: NicheConfig }) {
  usePixel(); // PageView (Pixel loads once)
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const [heroPassed, setHeroPassed] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    captureAttribution();
    sessionStorage.setItem("dti_niche_slug", config.slug);
    trackEvent({ event_name: "ViewContent", custom_data: { content_name: config.slug } });
  }, [config.slug]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const hero = heroRef.current;
    const form = formRef.current;
    const heroIo = new IntersectionObserver(([e]) => {
      setHeroPassed(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    const formIo = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    if (hero) heroIo.observe(hero);
    if (form) formIo.observe(form);
    return () => {
      heroIo.disconnect();
      formIo.disconnect();
    };
  }, []);

  const showSticky = heroPassed && !formVisible;
  const onSticky = useCallback(() => scrollToForm(), []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main>
        {/* a + b: Qualifier + headline */}
        <header ref={heroRef} className="max-w-5xl mx-auto px-5 pt-8 md:pt-14 text-center">
          <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] leading-relaxed">
            {config.qualifier}
          </p>
          <div className="mt-5 md:mt-7">
            <Headline text={config.headline} />
          </div>
        </header>

        {/* c: How it works */}
        <HowItWorks />

        {/* d: VSL */}
        <section aria-labelledby="step-1" className="max-w-4xl mx-auto px-5 pb-8">
          <h2 id="step-1" className="display text-2xl md:text-4xl text-center text-foreground mb-5">
            <span className="text-accent">Step 1:</span> Watch This Short Video
          </h2>
          <WistiaEmbed mediaId={NICHE_VSL_MEDIA_ID} title="VSL" />
        </section>

        {/* e: Primary CTA */}
        <div className="max-w-4xl mx-auto px-5 pb-12 text-center">
          <CtaButton label={config.ctaButton} />
        </div>

        {/* f: Form */}
        <section
          id={FORM_ANCHOR}
          ref={formRef}
          aria-labelledby="step-2"
          className="max-w-2xl mx-auto px-5 pb-14 scroll-mt-4"
        >
          <h2 id="step-2" className="display text-2xl md:text-4xl text-center text-foreground">
            <span className="text-accent">Step 2:</span> Fill Out The Application Below
          </h2>
          <p className="mt-3 mb-6 text-center text-accent text-xs sm:text-sm font-semibold uppercase tracking-[0.16em]">
            {config.formBanner}
          </p>
          <GhlForm niche={config.niche} pageSlug={config.slug} />
        </section>

        {/* g: Pains */}
        <section aria-labelledby="pains" className="max-w-5xl mx-auto px-5 pb-14">
          <h2 id="pains" className="display text-3xl md:text-4xl text-center text-foreground mb-8">
            Sound <span className="text-accent">Familiar?</span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.pains.map((pain) => (
              <li key={pain} className="rounded-lg border border-accent/40 bg-card p-5 flex gap-4 items-start">
                <span className="shrink-0 mt-0.5 h-8 w-8 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                  <X className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-base md:text-lg text-secondary-foreground leading-snug">{pain}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* h: Proof — single approved line only */}
        <section aria-label="Client result" className="max-w-3xl mx-auto px-5 pb-14">
          <figure className="rounded-lg gold-border bg-card px-6 py-8 md:px-10 md:py-10 text-center">
            <blockquote className="display text-2xl md:text-3xl leading-tight text-foreground normal-case">
              {NICHE_PROOF_LINE}
            </blockquote>
          </figure>
        </section>

        {/* i: Repeat CTA */}
        <section className="max-w-4xl mx-auto px-5 pb-14 text-center">
          <h2 className="display text-3xl md:text-5xl text-foreground mb-6">
            Ready To See If You <span className="text-accent">Qualify?</span>
          </h2>
          <CtaButton label={config.ctaButton} />
        </section>
      </main>

      <footer className="border-t border-border pb-28 md:pb-10">
        <div className="max-w-5xl mx-auto px-5 pt-10 flex flex-col items-center gap-4 text-sm text-secondary-foreground/70">
          <img
            src="/dti-logo.png"
            alt="DTI Media"
            loading="lazy"
            decoding="async"
            width={128}
            height={128}
            className="h-24 w-auto opacity-90"
          />
          <p>© DTI Media 2026</p>
          <div className="flex gap-6">
            {/* Placeholders until real Privacy / Terms pages exist */}
            <span className="inline-flex min-h-12 items-center">Privacy</span>
            <span className="inline-flex min-h-12 items-center">Terms</span>
          </div>
        </div>
      </footer>

      {/* Sticky mobile Apply bar */}
      <div
        aria-hidden={!showSticky}
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-accent/40 bg-background/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 motion-reduce:transition-none ${
          showSticky ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <button
          type="button"
          tabIndex={showSticky ? 0 : -1}
          onClick={onSticky}
          className="display w-full min-h-12 rounded-md bg-accent text-accent-foreground text-xl tracking-wide"
        >
          Apply Now <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
