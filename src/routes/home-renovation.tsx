import { createFileRoute } from "@tanstack/react-router";
import { NichePage } from "@/components/NichePage";
import { NICHES, nicheHead } from "@/lib/niches";

const config = NICHES["home-renovation"];

export const Route = createFileRoute("/home-renovation")({
  head: () => nicheHead(config),
  component: HomeRenovationPage,
});

function HomeRenovationPage() {
  return <NichePage config={config} />;
}
