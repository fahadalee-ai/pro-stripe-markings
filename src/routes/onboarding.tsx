import { createFileRoute } from "@tanstack/react-router";
import { OnboardingScreen } from "@/screens/OnboardingScreen";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome · Pro Stripe Markings" }] }),
  component: OnboardingScreen,
});
