import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/screens/HomeScreen";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home · Pro Stripe Markings" }] }),
  component: HomeScreen,
});
