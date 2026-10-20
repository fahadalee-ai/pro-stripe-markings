import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsScreen } from "@/screens/AppointmentScreens";

export const Route = createFileRoute("/appointments/")({
  head: () => ({ meta: [{ title: "Appointments · Pro Stripe Markings" }] }),
  component: AppointmentsScreen,
});
