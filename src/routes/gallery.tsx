import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "@/screens/GalleryScreen";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery · Pro Stripe Markings" }] }),
  component: GalleryScreen,
});
