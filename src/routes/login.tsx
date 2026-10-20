import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · Pro Stripe Markings" }] }),
  component: LoginScreen,
});
