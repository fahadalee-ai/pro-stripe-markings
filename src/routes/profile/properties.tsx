import { createFileRoute } from "@tanstack/react-router";
import { PropertiesScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/profile/properties")({
  head: () => ({ meta: [{ title: "Saved properties · Pro Stripe Markings" }] }),
  component: PropertiesScreen,
});
