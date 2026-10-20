import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordScreen } from "@/screens/AuthScreens";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password · Pro Stripe Markings" }] }),
  component: ForgotPasswordScreen,
});
