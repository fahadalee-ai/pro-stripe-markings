import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { Chip, PrimaryButton, SuccessMark, TextArea, TextField } from "@/components/primitives";
import { services } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";
import { quoteSchema } from "@/lib/schemas";
import { useApp } from "@/lib/store";

export function QuoteScreen() {
  const { user } = useRequireUser();
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceIds: [] as string[],
      address: user?.address ?? "",
      details: "",
      contactMethod: "either" as const,
      name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    },
    mode: "onTouched",
  });
  const selected = form.watch("serviceIds");
  const method = form.watch("contactMethod");

  useEffect(() => {
    if (!user) return;
    const current = form.getValues();
    form.reset({
      ...current,
      address: current.address || user.address,
      name: current.name || `${user.firstName} ${user.lastName}`.trim(),
      phone: current.phone || user.phone,
      email: current.email || user.email,
    });
  }, [user, form]);

  return (
    <ScreenFrame>
      <TopAppBar title="Request a Quote" onBack={() => navigate({ to: "/home" })} />
      <div className="px-4 pb-8">
        {done ? (
          <div className="mt-8 text-center">
            <SuccessMark label="Quote request sent" />
            <h2 className="mt-4 font-display text-[2rem] uppercase leading-9">Request received</h2>
            <p className="mt-2 text-[15px] leading-[22px] text-muted">
              The crew will follow up using your preferred contact method. This preview stores the request on this device only.
            </p>
            <PrimaryButton className="mt-6" onClick={() => navigate({ to: "/home" })}>
              Back to Home
            </PrimaryButton>
          </div>
        ) : (
          <form
            className="space-y-4"
            noValidate
            onSubmit={form.handleSubmit(async () => {
              await new Promise((resolve) => setTimeout(resolve, 700));
              pushToast("Quote requested", "We’ll be in touch.");
              setDone(true);
            })}
          >
            <p className="text-[15px] leading-[22px] text-muted">Tell us what the property needs. Estimates are free.</p>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => {
                const active = selected.includes(service.id);
                return (
                  <Chip
                    key={service.id}
                    active={active}
                    onClick={() =>
                      form.setValue(
                        "serviceIds",
                        active ? selected.filter((id) => id !== service.id) : [...selected, service.id],
                        { shouldValidate: true },
                      )
                    }
                  >
                    {service.name}
                  </Chip>
                );
              })}
            </div>
            {form.formState.errors.serviceIds ? <p className="text-xs text-danger">{form.formState.errors.serviceIds.message}</p> : null}
            <TextField label="Property address" error={form.formState.errors.address?.message} {...form.register("address")} />
            <TextArea label="Project details" error={form.formState.errors.details?.message} {...form.register("details")} />
            <label className="flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-dashed border-sky/40 text-sm font-semibold text-sky">
              <ImagePlus className="size-5" strokeWidth={1.75} />
              Photos ({photos.length}/5)
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const next = [...photos];
                  for (const file of Array.from(event.target.files ?? [])) {
                    if (next.length >= 5 || !file.type.startsWith("image/")) continue;
                    next.push({ name: file.name, url: URL.createObjectURL(file) });
                  }
                  setPhotos(next);
                }}
              />
            </label>
            <p className="text-xs uppercase tracking-wide text-sky">Preferred contact</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["phone", "Phone"],
                  ["email", "Email"],
                  ["either", "Either"],
                ] as const
              ).map(([value, label]) => (
                <Chip key={value} active={method === value} onClick={() => form.setValue("contactMethod", value)}>
                  {label}
                </Chip>
              ))}
            </div>
            <TextField label="Contact name" error={form.formState.errors.name?.message} {...form.register("name")} />
            <TextField label="Phone" type="tel" error={form.formState.errors.phone?.message} {...form.register("phone")} />
            <TextField label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
            <PrimaryButton type="submit" loading={form.formState.isSubmitting}>
              Submit request
            </PrimaryButton>
          </form>
        )}
      </div>
    </ScreenFrame>
  );
}
