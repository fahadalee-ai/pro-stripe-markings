import { createFileRoute } from "@tanstack/react-router";
import { BookScreen } from "@/screens/BookScreen";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({ meta: [{ title: "Book · Pro Stripe Markings" }] }),
  component: BookRoute,
});

function BookRoute() {
  const { service } = Route.useSearch();
  return <BookScreen presetService={service} />;
}
