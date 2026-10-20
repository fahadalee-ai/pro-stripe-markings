import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · Pro Stripe Markings" }] }),
  component: RegisterScreen,
});
