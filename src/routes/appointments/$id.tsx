import { createFileRoute } from "@tanstack/react-router";
import { AppointmentDetailScreen } from "@/screens/AppointmentScreens";

export const Route = createFileRoute("/appointments/$id")({
  head: () => ({ meta: [{ title: "Appointment · Pro Stripe Markings" }] }),
  component: AppointmentRoute,
});

function AppointmentRoute() {
  const { id } = Route.useParams();
  return <AppointmentDetailScreen id={id} />;
}
