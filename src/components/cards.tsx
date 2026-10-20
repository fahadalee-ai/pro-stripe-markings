import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { serviceById, type Service } from "@/data/content";
import type { Appointment } from "@/lib/store";
import { CoverImage, PrimaryButton, StatusChip } from "./primitives";

export function ServiceCard({ service, layout = "portrait" }: { service: Service; layout?: "portrait" | "row" }) {
  if (layout === "row") {
    return (
      <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.18)] active:scale-[0.99]">
        <Link to="/services/$id" params={{ id: service.id }} className="flex gap-3 p-3">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[14px]">
            <CoverImage src={service.image} alt={service.imageAlt} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg uppercase leading-6 text-white">{service.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{service.short}</p>
          </div>
        </Link>
        <div className="px-3 pb-3">
          <PrimaryButton to="/book" search={{ service: service.id }} full={false} className="min-h-11 px-5">
            Book
          </PrimaryButton>
        </div>
      </article>
    );
  }

  return (
    <article className="w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface active:scale-[0.99]">
      <Link to="/services/$id" params={{ id: service.id }} className="block">
        <div className="relative h-[120px]">
          <CoverImage src={service.image} alt={service.imageAlt} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00121C] via-transparent to-transparent" />
        </div>
        <div className="px-3 pt-2">
          <h3 className="font-display text-lg uppercase leading-6">{service.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-4 text-muted">{service.short}</p>
        </div>
      </Link>
      <div className="p-3">
        <PrimaryButton to="/book" search={{ service: service.id }} className="min-h-11">
          Book
        </PrimaryButton>
      </div>
    </article>
  );
}

export function AppointmentCard({
  appointment,
  onReschedule,
  onCancel,
}: {
  appointment: Appointment;
  onReschedule?: () => void;
  onCancel?: () => void;
}) {
  const names = appointment.serviceIds.map((id) => serviceById(id)?.name ?? id).join(", ");
  const when = appointment.flexible
    ? "Flexible date"
    : appointment.date
      ? `${format(parseISO(appointment.date), "EEE, MMM d")} · ${appointment.time ?? "Time TBD"}`
      : "Date TBD";

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">{appointment.code}</p>
          <h3 className="mt-1 font-display text-lg uppercase leading-6">{names}</h3>
        </div>
        <StatusChip status={appointment.status} />
      </div>
      <p className="mt-2 text-[15px] text-white">{when}</p>
      <p className="text-sm leading-5 text-muted">{appointment.address}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to="/appointments/$id"
          params={{ id: appointment.id }}
          className="inline-flex min-h-11 items-center rounded-[14px] bg-surface-2 px-4 text-sm font-semibold text-sky"
        >
          View
        </Link>
        {onReschedule ? (
          <button type="button" onClick={onReschedule} className="inline-flex min-h-11 items-center rounded-[14px] bg-surface-2 px-4 text-sm font-semibold text-white">
            Reschedule
          </button>
        ) : null}
        {onCancel ? (
          <button type="button" onClick={onCancel} className="inline-flex min-h-11 items-center rounded-[14px] px-4 text-sm font-semibold text-danger">
            Cancel
          </button>
        ) : null}
      </div>
    </article>
  );
}
