import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, usePixel } from "@/components/Layout";

export const Route = createFileRoute("/not-a-fit")({
  component: NotAFit,
});

function NotAFit() {
  usePixel();
  return (
    <Layout>
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="display text-4xl md:text-6xl">
          Thanks — But We're <span className="text-accent">Not a Fit</span> Right Now
        </h1>
        <div className="mx-auto mt-6 h-[3px] w-32 bg-accent" />
        <p className="mt-8 text-lg text-muted-foreground font-light">
          Based on your answers, our One Day Content System isn't the right match for your business at this stage. We only work with established Ottawa and Kingston service businesses that are ready to scale.
        </p>
        <p className="mt-4 text-lg text-muted-foreground font-light">
          Keep building — and when the timing is right, we'll be here.
        </p>
        <Link
          to="/local-offer"
          className="inline-block mt-10 display text-lg bg-accent text-black px-6 py-3 rounded-md font-extrabold hover:brightness-110 transition"
        >
          ← Back to Home
        </Link>
      </section>
    </Layout>
  );
}
