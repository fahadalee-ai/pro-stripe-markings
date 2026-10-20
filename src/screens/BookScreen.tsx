import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Check, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MonthCalendar } from "@/components/calendar";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { Chip, PrimaryButton, SecondaryButton, StepProgress, SuccessMark, TextArea, TextField } from "@/components/primitives";
import { addressSuggestions, propertyTypes, serviceById, services, timeSlots } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";
import { contactStepSchema, propertyStepSchema, scheduleStepSchema } from "@/lib/schemas";
import { useApp } from "@/lib/store";
import type { Appointment } from "@/lib/store";

export function BookScreen({ presetService }: { presetService?: string }) {
  const { user } = useRequireUser();
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { draft, updateDraft, resetDraft, addAppointment, pushToast } = useApp();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Appointment | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);

  useEffect(() => {
    if (presetService && serviceById(presetService) && draft.serviceIds.length === 0) {
      updateDraft({ serviceIds: [presetService] });
    }
  }, [presetService, draft.serviceIds.length, updateDraft]);

  useEffect(() => {
    if (!user) return;
    updateDraft({
      contactName: draft.contactName || `${user.firstName} ${user.lastName}`.trim(),
      contactPhone: draft.contactPhone || user.phone,
      contactEmail: draft.contactEmail || user.email,
      propertyName: draft.propertyName || user.company,
      address: draft.address || user.address,
    });
    // Prefill once when the signed-in user is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const goBack = () => {
    if (step > 0 && step < 4) {
      setErrors({});
      setStep((value) => value - 1);
      return;
    }
    if (canGoBack) router.history.back();
    else navigate({ to: "/home" });
  };

  const toggleService = (id: string) => {
    const selected = draft.serviceIds.includes(id);
    updateDraft({ serviceIds: selected ? draft.serviceIds.filter((item) => item !== id) : [...draft.serviceIds, id] });
  };

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const next = [...draft.photos];
    for (const file of Array.from(files)) {
      if (next.length >= 5) break;
      if (!file.type.startsWith("image/")) continue;
      next.push({ id: `${Date.now()}-${file.name}`, name: file.name, url: URL.createObjectURL(file) });
    }
    updateDraft({ photos: next });
  };

  const continueStep = async () => {
    setErrors({});
    if (step === 0) {
      if (!draft.serviceIds.length) {
        setErrors({ services: "Select at least one service." });
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      const parsed = propertyStepSchema.safeParse(draft);
      if (!parsed.success) {
        const next: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          next[String(issue.path[0])] = issue.message;
        });
        setErrors(next);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const parsed = scheduleStepSchema.safeParse(draft);
      if (!parsed.success) {
        const next: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          next[String(issue.path[0] ?? "date")] = issue.message;
        });
        setErrors(next);
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      const parsed = contactStepSchema.safeParse(draft);
      if (!parsed.success) {
        const next: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          next[String(issue.path[0])] = issue.message;
        });
        setErrors(next);
        return;
      }
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      const appointment = addAppointment({
        serviceIds: draft.serviceIds,
        propertyName: draft.propertyName,
        address: draft.address,
        propertyType: draft.propertyType,
        stallCount: draft.stallCount,
        notes: draft.notes,
        photos: draft.photos.map(({ name, url }) => ({ name, url })),
        date: draft.flexible ? null : draft.date,
        time: draft.flexible ? null : draft.time,
        flexible: draft.flexible,
        contactName: draft.contactName,
        contactPhone: draft.contactPhone,
        contactEmail: draft.contactEmail,
      });
      setSaving(false);
      if (appointment) {
        setCreated(appointment);
        resetDraft();
        pushToast("Appointment requested", appointment.code);
        setStep(4);
      }
    }
  };

  const suggestions = draft.address.length < 2
    ? []
    : addressSuggestions.filter((item) => item.toLowerCase().includes(draft.address.toLowerCase()));

  const summaryServices = draft.serviceIds.map((id) => serviceById(id)?.name ?? id).join(", ");
  const createdServices = created?.serviceIds.map((id) => serviceById(id)?.name ?? id).join(", ");

  const addToCalendar = () => {
    if (!created) return;
    const start = (created.date ?? format(new Date(), "yyyy-MM-dd")).replace(/-/g, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pro Stripe Markings//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${created.id}@prostripemarkings`,
      `DTSTAMP:${start}T120000Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `SUMMARY:Pro Stripe Markings — ${createdServices}`,
      `LOCATION:${created.address}`,
      `DESCRIPTION:${created.code} ${created.time ?? "Flexible date"}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${created.code}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ScreenFrame>
      <TopAppBar title="Book" onBack={step === 4 ? () => navigate({ to: "/home" }) : goBack} />
      <div className="px-4 pb-8">
        <StepProgress step={step + 1} />
        {step === 0 ? (
          <section className="mt-5">
            <h2 className="font-display text-2xl uppercase leading-[30px]">Select services</h2>
            <p className="mt-1 text-sm text-muted">Choose everything you want handled on this visit.</p>
            <div className="mt-4 space-y-2">
              {services.map((service) => {
                const active = draft.serviceIds.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleService(service.id)}
                    className={active ? "flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-accent bg-accent/10 px-3 text-left" : "flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-line bg-surface px-3 text-left"}
                  >
                    <span className={active ? "flex size-6 items-center justify-center rounded-full bg-accent text-ink" : "size-6 rounded-full border border-line"}>
                      {active ? <Check className="size-4" /> : null}
                    </span>
                    <span>
                      <span className="block font-display text-lg uppercase leading-6">{service.name}</span>
                      <span className="block text-xs text-muted">{service.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.services ? <p className="mt-2 text-xs text-danger">{errors.services}</p> : null}
          </section>
        ) : null}

        {step === 1 ? (
          <section className="mt-5 space-y-3">
            <h2 className="font-display text-2xl uppercase leading-[30px]">Property details</h2>
            <TextField label="Property name" value={draft.propertyName} error={errors.propertyName} onChange={(event) => updateDraft({ propertyName: event.target.value })} />
            <div className="relative">
              <TextField
                label="Address"
                value={draft.address}
                autoComplete="street-address"
                error={errors.address}
                onChange={(event) => {
                  updateDraft({ address: event.target.value });
                  setSuggestOpen(true);
                }}
                onFocus={() => setSuggestOpen(true)}
              />
              {suggestOpen && suggestions.length ? (
                <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-[14px] border border-line bg-surface-2" role="listbox">
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="min-h-11 w-full px-3 text-left text-sm"
                        onClick={() => {
                          updateDraft({ address: item });
                          setSuggestOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <p className="text-xs uppercase tracking-wide text-sky">Property type</p>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <Chip key={type} active={draft.propertyType === type} onClick={() => updateDraft({ propertyType: type })}>
                  {type}
                </Chip>
              ))}
            </div>
            {errors.propertyType ? <p className="text-xs text-danger">{errors.propertyType}</p> : null}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted">Approx. stall count</p>
                <p className="font-display text-2xl text-accent">{draft.stallCount}</p>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={draft.stallCount}
                aria-label="Approximate stall count"
                onChange={(event) => updateDraft({ stallCount: Number(event.target.value) })}
                className="w-full accent-[#FFCE08]"
              />
              <div className="mt-2 flex gap-2">
                <button type="button" className="min-h-11 flex-1 rounded-[14px] bg-surface-2" onClick={() => updateDraft({ stallCount: Math.max(10, draft.stallCount - 10) })}>
                  −10
                </button>
                <button type="button" className="min-h-11 flex-1 rounded-[14px] bg-surface-2" onClick={() => updateDraft({ stallCount: Math.min(500, draft.stallCount + 10) })}>
                  +10
                </button>
              </div>
            </div>
            <TextArea label="Notes" value={draft.notes} error={errors.notes} onChange={(event) => updateDraft({ notes: event.target.value })} />
            <div>
              <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-dashed border-sky/40 text-sm font-semibold text-sky">
                <ImagePlus strokeWidth={1.75} className="size-5" />
                Add photos ({draft.photos.length}/5)
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => onPhotos(event.target.files)} />
              </label>
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {draft.photos.map((photo) => (
                  <div key={photo.id} className="relative h-16 w-16 shrink-0">
                    <img src={photo.url} alt={photo.name} className="h-full w-full rounded-[12px] object-cover" />
                    <button
                      type="button"
                      aria-label={`Remove ${photo.name}`}
                      className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-danger text-white"
                      onClick={() => updateDraft({ photos: draft.photos.filter((item) => item.id !== photo.id) })}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="mt-5 space-y-3">
            <h2 className="font-display text-2xl uppercase leading-[30px]">Date & time</h2>
            <MonthCalendar value={draft.date} onChange={(date) => updateDraft({ date, flexible: false })} />
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <Chip key={slot} active={draft.time === slot} onClick={() => updateDraft({ time: slot })}>
                  {slot}
                </Chip>
              ))}
            </div>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="size-5 accent-[#FFCE08]"
                checked={draft.flexible}
                onChange={(event) => updateDraft({ flexible: event.target.checked })}
              />
              Flexible on date
            </label>
            {errors.date || errors.time ? <p className="text-xs text-danger">{errors.date || errors.time}</p> : null}
          </section>
        ) : null}

        {step === 3 ? (
          <section className="mt-5 space-y-3">
            <h2 className="font-display text-2xl uppercase leading-[30px]">Contact & review</h2>
            <TextField label="Contact name" value={draft.contactName} error={errors.contactName} onChange={(event) => updateDraft({ contactName: event.target.value })} />
            <TextField label="Phone" type="tel" value={draft.contactPhone} error={errors.contactPhone} onChange={(event) => updateDraft({ contactPhone: event.target.value })} />
            <TextField label="Email" type="email" value={draft.contactEmail} error={errors.contactEmail} onChange={(event) => updateDraft({ contactEmail: event.target.value })} />
            <article className="rounded-2xl border border-line bg-surface p-4">
              <SummaryRow label="Services" value={summaryServices || "—"} onEdit={() => setStep(0)} />
              <SummaryRow label="Property" value={`${draft.propertyName} · ${draft.address}`} onEdit={() => setStep(1)} />
              <SummaryRow label="Type" value={`${draft.propertyType || "—"} · ${draft.stallCount} stalls`} onEdit={() => setStep(1)} />
              <SummaryRow
                label="When"
                value={draft.flexible ? "Flexible" : draft.date ? `${format(parseISO(draft.date), "EEE, MMM d")} · ${draft.time ?? ""}` : "—"}
                onEdit={() => setStep(2)}
              />
              {draft.notes ? <SummaryRow label="Notes" value={draft.notes} onEdit={() => setStep(1)} /> : null}
            </article>
          </section>
        ) : null}

        {step === 4 && created ? (
          <section className="mt-8 text-center">
            <SuccessMark label="Appointment requested" />
            <h2 className="mt-4 font-display text-[2rem] uppercase leading-9">You’re booked</h2>
            <p className="mt-2 text-[15px] text-muted">We’ll confirm this visit shortly.</p>
            <p className="mt-4 font-display text-2xl text-accent">{created.code}</p>
            <article className="mt-4 rounded-2xl border border-line bg-surface p-4 text-left text-sm leading-6">
              <p>{createdServices}</p>
              <p className="text-muted">{created.propertyName}</p>
              <p className="text-muted">{created.address}</p>
              <p>{created.flexible ? "Flexible date" : created.date ? `${format(parseISO(created.date), "EEE, MMM d, yyyy")} · ${created.time}` : "Date to confirm"}</p>
            </article>
            <div className="mt-4 space-y-2">
              <SecondaryButton onClick={addToCalendar}>Add to Calendar</SecondaryButton>
              <PrimaryButton onClick={() => navigate({ to: "/appointments/$id", params: { id: created.id } })}>View Appointment</PrimaryButton>
              <SecondaryButton onClick={() => navigate({ to: "/home" })}>Back to Home</SecondaryButton>
            </div>
          </section>
        ) : null}

        {step < 4 ? (
          <PrimaryButton className="mt-6" loading={saving} onClick={continueStep}>
            {step === 3 ? "Confirm booking" : "Continue"}
          </PrimaryButton>
        ) : null}
      </div>
    </ScreenFrame>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-3 last:border-0">
      <div>
        <p className="text-xs uppercase tracking-wide text-sky">{label}</p>
        <p className="text-[15px] leading-[22px]">{value}</p>
      </div>
      <button type="button" className="min-h-11 text-sm font-semibold text-sky" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}
