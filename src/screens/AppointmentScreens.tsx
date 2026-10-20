import { Link, useNavigate } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { CalendarX, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppointmentActions } from "@/components/appointment-actions";
import { AppointmentCard } from "@/components/cards";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { EmptyState, PrimaryButton, Skeleton, StatusChip } from "@/components/primitives";
import { business, serviceById } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";
import { useApp, type AppointmentStatus } from "@/lib/store";

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

function matches(status: AppointmentStatus, tab: (typeof tabs)[number]["id"]) {
  if (tab === "completed") return status === "completed";
  if (tab === "cancelled") return status === "cancelled";
  return status === "pending" || status === "confirmed" || status === "in_progress";
}

export function AppointmentsScreen() {
  const { user } = useRequireUser();
  const { appointments } = useApp();
  const actions = useAppointmentActions();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("upcoming");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 350);
    return () => window.clearTimeout(timer);
  }, []);
  const list = appointments.filter((item) => item.userId === user?.id && matches(item.status, tab));

  return (
    <ScreenFrame tabs>
      <TopAppBar home />
      <div className="px-4 pb-8">
        <h1 className="font-display text-[2rem] uppercase leading-9">Appointments</h1>
        <div className="mt-4 grid grid-cols-3 rounded-[14px] bg-surface-2 p-1" role="tablist">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={tab === item.id ? "min-h-11 rounded-[12px] bg-accent text-sm font-semibold text-ink" : "min-h-11 text-sm font-semibold text-muted"}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {!loaded ? (
            <>
              <Skeleton className="h-36" />
              <Skeleton className="h-36" />
            </>
          ) : list.length ? (
            list.map((item) => (
              <AppointmentCard
                key={item.id}
                appointment={item}
                onReschedule={tab === "upcoming" ? () => actions.requestReschedule(item.id) : undefined}
                onCancel={tab === "upcoming" ? () => actions.requestCancel(item.id) : undefined}
              />
            ))
          ) : (
            <EmptyState
              icon={<CalendarX strokeWidth={1.75} />}
              title={`No ${tab} visits`}
              body={tab === "upcoming" ? "When you book a visit, it will land here with a status you can track." : "Nothing in this list yet."}
              action={tab === "upcoming" ? <PrimaryButton to="/book">Book an Appointment</PrimaryButton> : undefined}
            />
          )}
        </div>
      </div>
      {actions.sheets}
    </ScreenFrame>
  );
}

const timeline = ["Requested", "Confirmed", "In Progress", "Completed"] as const;

export function AppointmentDetailScreen({ id }: { id: string }) {
  const { user, ready } = useRequireUser();
  const navigate = useNavigate();
  const { appointments } = useApp();
  const actions = useAppointmentActions();
  const appointment = appointments.find((item) => item.id === id && item.userId === user?.id);

  if (!ready) {
    return (
      <ScreenFrame>
        <TopAppBar title="Appointment" onBack={() => navigate({ to: "/appointments" })} />
        <div className="space-y-3 px-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-40" />
        </div>
      </ScreenFrame>
    );
  }

  if (!appointment) {
    return (
      <ScreenFrame>
        <TopAppBar title="Appointment" onBack={() => navigate({ to: "/appointments" })} />
        <div className="px-4">
          <EmptyState icon={<CalendarX strokeWidth={1.75} />} title="Appointment not found" body="It may have been removed from this device." action={<PrimaryButton to="/appointments">My appointments</PrimaryButton>} />
        </div>
      </ScreenFrame>
    );
  }

  const activeIndex = { pending: 0, confirmed: 1, in_progress: 2, completed: 3, cancelled: -1 }[appointment.status];
  const names = appointment.serviceIds.map((serviceId) => serviceById(serviceId)?.name ?? serviceId);

  return (
    <ScreenFrame>
      <TopAppBar title={appointment.code} onBack={() => navigate({ to: "/appointments" })} />
      <div className="space-y-4 px-4 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl uppercase leading-[30px]">{names.join(", ")}</h1>
          <StatusChip status={appointment.status} />
        </div>
        {appointment.status === "cancelled" ? (
          <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">This appointment was cancelled.</p>
        ) : (
          <ol className="space-y-3">
            {timeline.map((label, index) => {
              const done = index <= activeIndex;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span className={done ? "size-3 rounded-full bg-accent" : "size-3 rounded-full bg-white/20"} />
                  <span className={done ? "text-white" : "text-muted"}>{label}</span>
                </li>
              );
            })}
          </ol>
        )}
        <article className="rounded-2xl border border-line bg-surface p-4 text-[15px] leading-[22px]">
          <p>{appointment.flexible ? "Flexible date" : appointment.date ? `${format(parseISO(appointment.date), "EEEE, MMM d, yyyy")} · ${appointment.time}` : "Date to confirm"}</p>
          <p className="mt-2">{appointment.propertyName}</p>
          <p className="text-muted">{appointment.address}</p>
          <p className="mt-2 text-sm text-muted">{appointment.propertyType} · about {appointment.stallCount} stalls</p>
          {appointment.notes ? <p className="mt-3 text-sm text-muted">{appointment.notes}</p> : null}
        </article>
        <div>
          <h2 className="font-display text-lg uppercase leading-6">Photos</h2>
          {appointment.photos.length ? (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {appointment.photos.map((photo) => (
                <img key={photo.url} src={photo.url} alt={photo.name} className="h-24 w-24 rounded-2xl object-cover" />
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted">No photos were attached.</p>
          )}
        </div>
        <div className="space-y-2">
          {appointment.status === "pending" || appointment.status === "confirmed" || appointment.status === "in_progress" ? (
            <>
              <PrimaryButton onClick={() => actions.requestReschedule(appointment.id)}>Reschedule</PrimaryButton>
              <button type="button" className="min-h-12 w-full rounded-[14px] text-sm font-semibold text-danger" onClick={() => actions.requestCancel(appointment.id)}>
                Cancel appointment
              </button>
            </>
          ) : null}
          <a href={`tel:${business.phoneTel}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-sky/40 text-sky">
            <Phone className="size-4" strokeWidth={1.75} /> Call Business
          </a>
          <Link to="/contact" className="inline-flex min-h-11 w-full items-center justify-center text-sm text-sky">
            Contact & hours
          </Link>
        </div>
      </div>
      {actions.sheets}
    </ScreenFrame>
  );
}
