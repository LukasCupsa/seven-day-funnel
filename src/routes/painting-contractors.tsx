import { createFileRoute } from "@tanstack/react-router";
import { NichePage } from "@/components/NichePage";
import { NICHES, nicheHead } from "@/lib/niches";

const config = NICHES["painting-contractors"];

export const Route = createFileRoute("/painting-contractors")({
  head: () => nicheHead(config),
  component: PaintingContractorsPage,
});

function PaintingContractorsPage() {
  return <NichePage config={config} />;
}
