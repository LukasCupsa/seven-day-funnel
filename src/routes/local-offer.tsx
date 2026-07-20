import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, WistiaEmbed, usePixel, trackEvent } from "@/components/Layout";

export const Route = createFileRoute("/local-offer")({
  component: LocalOffer,
});

const ZAPIER = "https://hooks.zapier.com/hooks/catch/25849437/43chkoo/";

// Landing page VSL (Wistia). Using the "Post booking" welcome video as the primary VSL.
const VSL_MEDIA_ID = "vaewr1pvdm";

const YEARS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

function LocalOffer() {
  usePixel();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    website: "",
    years_in_business: "",
    challenge: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Fire Meta Lead event (pixel + CAPI, deduped). Await so CAPI is in flight before nav.
    await trackEvent({
      event_name: "Lead",
      email: form.email,
      phone: form.phone,
      first_name: form.first_name,
      last_name: form.last_name,
      custom_data: {
        website: form.website,
        years_in_business: form.years_in_business,
      },
    });

    try {
      await fetch(ZAPIER, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          qualified: true,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch {
      /* ignore */
    }
    navigate({ to: "/book-your-call" });
  };

  const inputCls =
    "w-full bg-input border border-border rounded-md px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 pt-8 md:pt-10 pb-2 text-center">
        <p className="display text-xl md:text-2xl text-accent tracking-wide">
          Attention: <span className="text-white">⚡ Local Service Business Owners ⚡</span>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-4 pb-6 text-center">
        <h1 className="display text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
          We Film{" "}
          <span className="text-accent">3 Months Of Content</span>
          <br />
          For Your Business In{" "}
          <span className="text-accent">1 Day</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          So you can stop relying on word of mouth and start building predictable, scalable leads.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-6">
        <WistiaEmbed mediaId={VSL_MEDIA_ID} title="VSL" />
      </section>

      <section className="max-w-4xl mx-auto px-6 pt-4 pb-2 text-center">
        <p className="display text-accent text-2xl md:text-3xl">
          👇 Fill Out The Application Below 👇
        </p>
        <p className="mt-3 display text-white text-lg md:text-xl tracking-wide">
          Only For Local Service Businesses Ready To Grow
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16">
        <form onSubmit={onSubmit} className="space-y-4 bg-card p-6 md:p-8 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="First Name *" className={inputCls} value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            <input required placeholder="Last Name *" className={inputCls} value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
          </div>
          <input required type="email" placeholder="Email *" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input type="tel" placeholder="Phone" className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} />

          <input
            required
            type="text"
            inputMode="url"
            placeholder="Website (e.g. yourbusiness.com) *"
            className={inputCls}
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />

          <select required className={inputCls} value={form.years_in_business} onChange={(e) => update("years_in_business", e.target.value)}>
            <option value="">How long have you been in business? *</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <textarea
            required
            rows={4}
            placeholder="Tell us what you've tried and what's not working... *"
            className={inputCls}
            value={form.challenge}
            onChange={(e) => update("challenge", e.target.value)}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full display text-2xl md:text-3xl font-extrabold bg-accent text-black py-4 rounded-md hover:brightness-110 transition disabled:opacity-60"
            style={{ fontWeight: 800 }}
          >
            {submitting ? "Submitting..." : "See If I Qualify →"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
