import { Link } from "@tanstack/react-router";
import { CalendarPlus, ClipboardList, Mail, MapPin, Phone, Quote, Ruler, Shield, Timer, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { AppointmentCard, ServiceCard } from "@/components/cards";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { Lightbox } from "@/components/lightbox";
import { CoverImage, EmptyState, PrimaryButton, RoadRule, SectionHeader, Skeleton } from "@/components/primitives";
import { useAppointmentActions } from "@/components/appointment-actions";
import { business, gallery, services, testimonials, whyUs } from "@/data/content";
import { images } from "@/data/images";
import { useRequireUser } from "@/hooks/useRequireUser";
import { useApp } from "@/lib/store";

const whyIcons = [Ruler, Shield, Timer, MapPin];

export function HomeScreen() {
  const { user } = useRequireUser();
  const { appointments } = useApp();
  const actions = useAppointmentActions();
  const [viewer, setViewer] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const upcoming = appointments
    .filter((item) => item.userId === user?.id && (item.status === "pending" || item.status === "confirmed" || item.status === "in_progress"))
    .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  const next = upcoming[0];

  return (
    <ScreenFrame tabs>
      <TopAppBar home />
      <div className="px-4 pb-6">
        {!loaded || !user ? (
          <div className="space-y-3" aria-hidden>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-52 w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <h1 className="font-display text-[2rem] uppercase leading-9">Hello, {user.firstName}</h1>
            <section className="relative mt-4 overflow-hidden rounded-2xl">
              <CoverImage src={images.homeHero} alt="Wide view of a striped retail parking lot at dusk" priority className="h-56" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00121C] via-[#00121C]/70 to-[#00121C]/25" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h2 className="font-display text-[2rem] uppercase leading-9">
                  Need Your Lot <span className="text-accent">Striped?</span>
                </h2>
                <PrimaryButton to="/book" className="mt-3">
                  Book an Appointment
                </PrimaryButton>
              </div>
            </section>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { label: "Book Now", to: "/book" as const, icon: CalendarPlus },
                { label: "Request Quote", to: "/quote" as const, icon: ClipboardList },
                { label: "My Appointments", to: "/appointments" as const, icon: Wrench },
                { label: "Call Us", href: `tel:${business.phoneTel}`, icon: Phone },
              ].map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <Icon strokeWidth={1.75} className="size-5 text-accent" />
                    <span className="text-center text-[11px] font-medium leading-tight">{item.label}</span>
                  </>
                );
                const cls = "flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface px-1 active:scale-[0.98]";
                return "href" in item ? (
                  <a key={item.label} href={item.href} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={item.label} to={item.to} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>

            <RoadRule />
            <SectionHeader title="Our Services" action="See all" to="/services" />
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <RoadRule />
            <SectionHeader title="Upcoming Appointment" action="All" to="/appointments" />
            {next ? (
              <AppointmentCard
                appointment={next}
                onReschedule={() => actions.requestReschedule(next.id)}
                onCancel={() => actions.requestCancel(next.id)}
              />
            ) : (
              <EmptyState
                icon={<CalendarPlus strokeWidth={1.75} />}
                title="No upcoming visits"
                body="Book line striping, signs, wheel stops, or pavement repair and it will show up here."
                action={<PrimaryButton to="/book">Book an Appointment</PrimaryButton>}
              />
            )}

            <RoadRule />
            <SectionHeader title="Why Choose Us" />
            <div className="grid grid-cols-2 gap-2">
              {whyUs.map((item, index) => {
                const Icon = whyIcons[index] ?? Shield;
                return (
                  <article key={item.title} className="rounded-2xl border border-line bg-surface p-3">
                    <Icon className="size-5 text-accent" strokeWidth={1.75} />
                    <h3 className="mt-2 font-display text-lg uppercase leading-6">{item.title}</h3>
                    <p className="mt-1 text-xs leading-4 text-muted">{item.body}</p>
                  </article>
                );
              })}
            </div>

            <RoadRule />
            <SectionHeader title="Recent Work" action="Gallery" to="/gallery" />
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
              {gallery.map((item, index) => (
                <button key={item.id} type="button" className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl" onClick={() => setViewer(index)}>
                  <CoverImage src={item.src} alt={item.alt} />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#00121C] to-transparent px-2 pb-2 pt-6 text-left text-xs font-medium">
                    {item.caption}
                  </span>
                </button>
              ))}
            </div>

            <RoadRule />
            <SectionHeader title="What Clients Say" />
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4">
              {testimonials.map((item) => (
                <figure key={item.quote} className="w-[85%] shrink-0 snap-start rounded-2xl border border-line bg-surface p-4">
                  <Quote className="size-5 text-accent" strokeWidth={1.75} />
                  <blockquote className="mt-2 text-[15px] leading-[22px]">“{item.quote}”</blockquote>
                  <figcaption className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky">{item.role}</figcaption>
                </figure>
              ))}
            </div>

            <RoadRule />
            <SectionHeader title="Contact & Location" action="About" to="/contact" />
            <article className="rounded-2xl border border-line bg-surface p-4">
              <div className="relative mb-3 h-36 overflow-hidden rounded-[14px] bg-[#071c2a]">
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(106,189,223,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(106,189,223,0.18) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-accent">
                  <MapPin strokeWidth={1.75} className="size-8" />
                </div>
                <p className="absolute inset-x-0 bottom-2 text-center text-[11px] text-muted">Map preview</p>
              </div>
              <p className="text-[15px] leading-[22px]">{business.address}</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href={`tel:${business.phoneTel}`} className="inline-flex min-h-11 items-center gap-2 text-sky">
                  <Phone className="size-4" strokeWidth={1.75} /> {business.phoneDisplay}
                </a>
                <a href={`mailto:${business.email}`} className="inline-flex min-h-11 items-center gap-2 text-sky">
                  <Mail className="size-4" strokeWidth={1.75} /> {business.email}
                </a>
              </div>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-accent font-semibold text-ink"
              >
                Get Directions
              </a>
            </article>
          </>
        )}
      </div>
      {actions.sheets}
      {viewer !== null ? (
        <Lightbox
          images={gallery.map((item) => ({ src: item.src, alt: item.alt, caption: item.caption }))}
          index={viewer}
          onIndex={setViewer}
          onClose={() => setViewer(null)}
        />
      ) : null}
    </ScreenFrame>
  );
}
