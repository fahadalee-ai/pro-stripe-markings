import { createFileRoute } from "@tanstack/react-router";
import { PrivacyScreen } from "@/screens/ContactScreen";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy · Pro Stripe Markings" }] }),
  component: PrivacyScreen,
});