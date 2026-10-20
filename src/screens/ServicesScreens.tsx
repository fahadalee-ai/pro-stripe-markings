import { useNavigate } from "@tanstack/react-router";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceCard } from "@/components/cards";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { Chip, CoverImage, EmptyState, PrimaryButton } from "@/components/primitives";
import { serviceById, serviceFilters, services, type ServiceCategory } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";

export function ServicesScreen() {
  useRequireUser();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ServiceCategory>("all");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesFilter = filter === "all" || service.category === filter;
      const matchesQuery = !needle || `${service.name} ${service.short} ${service.description}`.toLowerCase().includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <ScreenFrame tabs>
      <TopAppBar home />
      <div className="px-4 pb-8">
        <h1 className="font-display text-[2rem] uppercase leading-9">Services</h1>
        <p className="mt-1 text-[15px] leading-[22px] text-muted">Parking lots, warehouses, signs, and pavement care across New Jersey.</p>
        <label className="mt-4 flex h-12 items-center gap-2 rounded-[14px] border border-line bg-surface-2 px-3">
          <Search className="size-5 text-muted" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            aria-label="Search services"
          />
        </label>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {serviceFilters.map((item) => (
            <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {results.length ? (
            results.map((service) => <ServiceCard key={service.id} service={service} layout="row" />)
          ) : (
            <EmptyState
              icon={<Search strokeWidth={1.75} />}
              title="No matching services"
              body="Try another name, or clear the filter to see line striping, signs, wheel stops, and pavement repair."
              action={
                <PrimaryButton
                  full={false}
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Clear search
                </PrimaryButton>
              }
            />
          )}
        </div>
      </div>
    </ScreenFrame>
  );
}

export function ServiceDetailScreen({ id }: { id: string }) {
  useRequireUser();
  const navigate = useNavigate();
  const service = serviceById(id);

  if (!service) {
    return (
      <ScreenFrame>
        <TopAppBar title="Service" onBack={() => navigate({ to: "/services" })} />
        <div className="px-4">
          <EmptyState
            icon={<Search strokeWidth={1.75} />}
            title="Service not found"
            body="That service is not on the current list."
            action={<PrimaryButton to="/services">Browse services</PrimaryButton>}
          />
        </div>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame>
      <div className="relative h-64">
        <CoverImage src={service.image} alt={service.imageAlt} priority className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00121C] via-[#00121C]/45 to-[#00121C]/20" />
        <div className="absolute left-1 top-[max(0.25rem,env(safe-area-inset-top))]">
          <TopAppBar title="" onBack={() => navigate({ to: "/services" })} />
        </div>
      </div>
      <div className="px-4 pb-28">
        <h1 className="font-display text-[2rem] uppercase leading-9">{service.name}</h1>
        <p className="mt-3 text-[15px] leading-[22px] text-muted">{service.description}</p>
        <h2 className="mt-6 font-display text-2xl uppercase leading-[30px]">What’s Included</h2>
        <ul className="mt-3 space-y-2">
          {service.included.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15px] leading-[22px]">
              <Check className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
              {item}
            </li>
          ))}
        </ul>
        <h2 className="mt-6 font-display text-2xl uppercase leading-[30px]">Ideal For</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {service.idealFor.map((item) => (
            <span key={item} className="inline-flex min-h-11 items-center rounded-full bg-sky/15 px-4 text-sm font-medium text-sky">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-line bg-[#00121C]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <PrimaryButton to="/book" search={{ service: service.id }}>
          Book This Service
        </PrimaryButton>
      </div>
    </ScreenFrame>
  );
}
