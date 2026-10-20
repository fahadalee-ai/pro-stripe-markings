import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettingsScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/profile/settings")({
  head: () => ({ meta: [{ title: "Notification settings · Pro Stripe Markings" }] }),
  component: NotificationSettingsScreen,
});