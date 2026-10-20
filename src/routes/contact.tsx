import { createFileRoute } from "@tanstack/react-router";
import { ContactScreen } from "@/screens/ContactScreen";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "About · Pro Stripe Markings" }] }),
  component: ContactScreen,
});
