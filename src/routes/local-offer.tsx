import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, VideoEmbed, usePixel } from "@/components/Layout";

export const Route = createFileRoute("/local-offer")({
  component: LocalOffer,
});

const ZAPIER = "https://hooks.zapier.com/hooks/catch/25849437/43chkoo/";

const BUSINESS_TYPES = [
  "Med Spa / Aesthetic Clinic",
  "Real Estate Agent or Team",
  "Home Builder / Contractor",
  "Landscaping / Outdoor Living",
  "Pool / Sauna / Hot Tub Company",
  "Interior Design",
  "Dental Practice",
  "Auto Detailing",
  "Painting Company",
  "Home Staging",
  "Other Local Service Business",
];

const REVENUE = [
  { label: "Under $5K/month", value: "under_5k", disqualify: true },
  { label: "$5K–$10K/month", value: "5_10k" },
  { label: "$10K–$25K/month", value: "10_25k" },
  { label: "$25K–$50K/month", value: "25_50k" },
  { label: "$50K+/month", value: "50k_plus" },
];

const ON_CAMERA = [
  { label: "Yes — comfortable", value: "yes_comfortable" },
  { label: "Yes — not experienced but willing", value: "yes_willing" },
  { label: "No", value: "no", disqualify: true },
];

const LOCATION = [
  { label: "Ottawa, Ontario", value: "ottawa" },
  { label: "Kingston, Ontario", value: "kingston" },
  { label: "Within 1hr of Ottawa or Kingston", value: "within_1hr" },
  { label: "Outside area", value: "outside", disqualify: true },
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
    business_type: "",
    revenue: "",
    challenge: "",
    on_camera: "",
    location: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const rev = REVENUE.find((r) => r.value === form.revenue);
    const cam = ON_CAMERA.find((r) => r.value === form.on_camera);
    const loc = LOCATION.find((r) => r.value === form.location);
    const disqualified = !!(rev?.disqualify || cam?.disqualify || loc?.disqualify);
    try {
      await fetch(ZAPIER, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          qualified: !disqualified,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch {
      /* ignore */
    }
    navigate({ to: disqualified ? "/not-a-fit" : "/book-your-call" });
  };

  const inputCls =
    "w-full bg-input border border-border rounded-md px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 pt-8 md:pt-10 pb-2 text-center">
        <p className="display text-xl md:text-2xl text-accent tracking-wide">
          Attention: <span className="text-white">⚡ Ottawa &amp; Kingston Service Business Owners ⚡</span>
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-4 pb-6 text-center">
        <h1 className="display text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
          We'll Install Our
          <br />
          <span className="text-accent">Content Conversion Framework</span>
          <br />
          In Your Business In Just
          <br />
          <span className="text-accent">7 Days</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          So you can stop relying on word of mouth and start building predictable, scalable leads.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-6">
        <VideoEmbed youtubeId="J5VJcsS8pL0" title="VSL" autoplay />
      </section>

      <section className="max-w-4xl mx-auto px-6 pt-4 pb-2 text-center">
        <p className="display text-accent text-2xl md:text-3xl">
          👇 Fill Out The Application Below 👇
        </p>
        <p className="mt-3 display text-white text-lg md:text-xl tracking-wide">
          Only For Service Businesses Who Can Handle More Clients
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

          <select required className={inputCls} value={form.business_type} onChange={(e) => update("business_type", e.target.value)}>
            <option value="">Business Type *</option>
            {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select required className={inputCls} value={form.revenue} onChange={(e) => update("revenue", e.target.value)}>
            <option value="">Monthly Revenue *</option>
            {REVENUE.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <textarea required rows={4} placeholder="Tell us what's not working right now..." className={inputCls} value={form.challenge} onChange={(e) => update("challenge", e.target.value)} />

          <select required className={inputCls} value={form.on_camera} onChange={(e) => update("on_camera", e.target.value)}>
            <option value="">Willing to be on camera? *</option>
            {ON_CAMERA.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <select required className={inputCls} value={form.location} onChange={(e) => update("location", e.target.value)}>
            <option value="">Location *</option>
            {LOCATION.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

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
