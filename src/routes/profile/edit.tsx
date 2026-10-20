import { createFileRoute } from "@tanstack/react-router";
import { EditProfileScreen } from "@/screens/ProfileScreens";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({ meta: [{ title: "Edit profile · Pro Stripe Markings" }] }),
  component: EditProfileScreen,
});
