import { createFileRoute } from "@tanstack/react-router";
import { ServicesScreen } from "@/screens/ServicesScreens";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [{ title: "Services · Pro Stripe Markings" }] }),
  component: ServicesScreen,
});
