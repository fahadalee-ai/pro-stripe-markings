import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Pro Stripe Markings" }],
  }),
  component: () => <Navigate to="/splash" />,
});
