import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailScreen } from "@/screens/ServicesScreens";

export const Route = createFileRoute("/services/$id")({
  head: () => ({ meta: [{ title: "Service · Pro Stripe Markings" }] }),
  component: ServiceRoute,
});

function ServiceRoute() {
  const { id } = Route.useParams();
  return <ServiceDetailScreen id={id} />;
}
