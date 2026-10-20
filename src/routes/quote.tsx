import { createFileRoute } from "@tanstack/react-router";
import { QuoteScreen } from "@/screens/QuoteScreen";

export const Route = createFileRoute("/quote")({
  head: () => ({ meta: [{ title: "Request a quote · Pro Stripe Markings" }] }),
  component: QuoteScreen,
});
