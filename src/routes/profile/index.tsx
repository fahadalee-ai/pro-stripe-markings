import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/profile/")({
  head: () => ({ meta: [{ title: "Profile · Pro Stripe Markings" }] }),
  component: ProfileScreen,
});
