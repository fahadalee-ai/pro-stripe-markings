import { createFileRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/screens/SplashScreen";

export const Route = createFileRoute("/splash")({
  head: () => ({ meta: [{ title: "Pro Stripe Markings" }] }),
  component: SplashScreen,
});
