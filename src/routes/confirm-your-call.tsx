import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, WistiaEmbed, usePixel, trackEvent } from "@/components/Layout";

export const Route = createFileRoute("/confirm-your-call")({
  component: ConfirmYourCall,
});

const WELCOME_MEDIA_ID = "ho7751j1zf"; // Post booking / welcome

const QUESTIONS: { question: string; mediaId: string }[] = [
  { question: "What kind of businesses do you work with?", mediaId: "cibos1nlpb" },
  { question: "What's the investment to get started?", mediaId: "e1gys31dsh" },
  { question: "How much of my time does this take?", mediaId: "his3bz1ecu" },
  { question: "How are you different from other agencies?", mediaId: "bparxu26o6" },
  { question: "What exactly do I get each month?", mediaId: "4daqn6lada" },
  { question: "How fast can I see results?", mediaId: "47637a2gtn" },
];

const FAQ = [
  {
    q: "Do I have to sign a long-term contract?",
    a: "We work in 3-month engagements. That's the minimum time needed to see real results. We don't do one-month trials because results require consistency.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes — monthly payments available. Paid in full options available at a discount.",
  },
  {
    q: "How does the shoot day actually work?",
    a: "We come to your location with everything we need. We film all your content in one day — talking heads, before/afters, process clips, b-roll. Usually 4–6 hours and we walk away with a full month of content.",
  },
  {
    q: "Do I own the content you create?",
    a: "Yes — everything we create is yours. Videos, edits, ad creatives. You keep it all.",
  },
  {
    q: "I already have some content — can you use what I've got?",
    a: "Absolutely. We'll review it and incorporate strong existing content into the strategy where it makes sense.",
  },
];

function ConfirmYourCall() {
  usePixel();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-6 pt-12 text-center">
        <h1 className="display text-4xl md:text-6xl">
          Wait! Your Call Hasn't Been <span className="text-accent">Confirmed</span> Yet.
        </h1>
        <div className="mx-auto mt-8 h-[3px] w-40 bg-accent" />
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="display text-2xl md:text-3xl text-center mb-6">
          👇 Step 1: Watch This 1 Minute Video Below
        </h2>
        <WistiaEmbed mediaId={WELCOME_MEDIA_ID} title="Welcome video" />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="display text-2xl md:text-3xl text-center mb-10">
          👇 Step 2: Get Your Questions Answered
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUESTIONS.map((q) => (
            <div key={q.question} className="space-y-3">
              <p className="display text-lg text-accent min-h-[3rem]">{q.question}</p>
              <WistiaEmbed mediaId={q.mediaId} title={q.question} />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="display text-3xl md:text-5xl text-center mb-10">
          Frequently Asked <span className="text-accent">Questions</span>
        </h2>
        <div className="divide-y divide-border border border-border rounded-lg bg-card">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-5 py-4 gap-4 hover:bg-muted/40 transition"
                >
                  <span className="display text-lg md:text-xl">{item.q}</span>
                  <span className={`text-accent text-2xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-muted-foreground font-light leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
