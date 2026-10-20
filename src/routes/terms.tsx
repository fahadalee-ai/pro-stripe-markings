import { createFileRoute } from "@tanstack/react-router";
import { TermsScreen } from "@/screens/ContactScreen";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms · Pro Stripe Markings" }] }),
  component: TermsScreen,
});
