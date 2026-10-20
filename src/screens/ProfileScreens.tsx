import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Building2, ChevronRight, FileText, Info, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { BottomSheet, Chip, EmptyState, PrimaryButton, Skeleton, TextField } from "@/components/primitives";
import { propertyTypes } from "@/data/content";
import { useRequireUser } from "@/hooks/useRequireUser";
import { profileSchema, savedPropertySchema } from "@/lib/schemas";
import { useApp } from "@/lib/store";

const menu = [
  { to: "/profile/edit" as const, label: "Edit Profile", icon: UserRound },
  { to: "/profile/properties" as const, label: "Saved Properties", icon: Building2 },
  { to: "/profile/settings" as const, label: "Notification Settings", icon: Bell },
  { to: "/contact" as const, label: "Contact Us", icon: Info },
  { to: "/contact" as const, label: "About Pro Stripe Markings", icon: Info },
  { to: "/terms" as const, label: "Terms & Privacy", icon: FileText },
];

export function ProfileScreen() {
  const { user, ready } = useRequireUser();
  const { logout } = useApp();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  if (!ready || !user) {
    return (
      <ScreenFrame tabs>
        <TopAppBar home />
        <div className="space-y-3 px-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-64" />
        </div>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame tabs>
      <TopAppBar home />
      <div className="px-4 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent font-display text-2xl text-ink">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </span>
          <div>
            <h1 className="font-display text-2xl uppercase leading-[30px]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted">{user.company}</p>
            <p className="text-xs uppercase tracking-wide text-sky">{user.role === "owner" ? "Property Owner" : "Paving Company"}</p>
          </div>
        </div>
        <ul className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="border-b border-line last:border-0">
                <Link to={item.to} className="flex min-h-14 items-center gap-3 px-3">
                  <Icon className="size-5 text-accent" strokeWidth={1.75} />
                  <span className="flex-1 text-[15px]">{item.label}</span>
                  <ChevronRight className="size-4 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
        <button type="button" className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] text-danger" onClick={() => setConfirm(true)}>
          <LogOut className="size-5" strokeWidth={1.75} /> Log Out
        </button>
      </div>
      <BottomSheet open={confirm} title="Log out" onClose={() => setConfirm(false)}>
        <p className="text-[15px] leading-[22px] text-muted">You’ll need to sign in again to manage appointments on this device.</p>
        <PrimaryButton
          className="mt-4"
          onClick={() => {
            logout();
            setConfirm(false);
            navigate({ to: "/login" });
          }}
        >
          Log out
        </PrimaryButton>
      </BottomSheet>
    </ScreenFrame>
  );
}

export function EditProfileScreen() {
  const { user } = useRequireUser();
  const { updateUser, pushToast } = useApp();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      company: user?.company ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
    mode: "onTouched",
  });

  return (
    <ScreenFrame>
      <TopAppBar title="Edit Profile" onBack={() => navigate({ to: "/profile" })} />
      <form
        className="space-y-3 px-4 pb-8"
        onSubmit={form.handleSubmit((values) => {
          const parts = values.fullName.trim().split(/\s+/);
          updateUser({
            firstName: parts[0] ?? "",
            lastName: parts.slice(1).join(" "),
            company: values.company,
            phone: values.phone,
            address: values.address ?? "",
          });
          pushToast("Profile updated");
          navigate({ to: "/profile" });
        })}
      >
        <TextField label="Full name" error={form.formState.errors.fullName?.message} {...form.register("fullName")} />
        <TextField label="Company" error={form.formState.errors.company?.message} {...form.register("company")} />
        <TextField label="Phone" error={form.formState.errors.phone?.message} {...form.register("phone")} />
        <TextField label="Address" error={form.formState.errors.address?.message} {...form.register("address")} />
        <p className="text-sm text-muted">Email: {user?.email}. It stays tied to this sign-in.</p>
        <PrimaryButton type="submit">Save profile</PrimaryButton>
      </form>
    </ScreenFrame>
  );
}

export function PropertiesScreen() {
  const { user } = useRequireUser();
  const { properties, addProperty, removeProperty, pushToast } = useApp();
  const navigate = useNavigate();
  const mine = properties.filter((item) => item.userId === user?.id);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>(propertyTypes[0]);
  const form = useForm({ resolver: zodResolver(savedPropertySchema), defaultValues: { name: "", address: "", type: propertyTypes[0] } });

  return (
    <ScreenFrame>
      <TopAppBar title="Saved Properties" onBack={() => navigate({ to: "/profile" })} />
      <div className="space-y-3 px-4 pb-8">
        {mine.length ? (
          mine.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-surface p-4">
              <h2 className="font-display text-lg uppercase leading-6">{item.name}</h2>
              <p className="text-sm text-muted">{item.address}</p>
              <p className="mt-1 text-xs text-sky">{item.type}</p>
              <button type="button" className="mt-2 min-h-11 text-sm font-semibold text-danger" onClick={() => { removeProperty(item.id); pushToast("Property removed"); }}>
                Remove
              </button>
            </article>
          ))
        ) : (
          <EmptyState icon={<Building2 strokeWidth={1.75} />} title="No saved properties" body="Add the lots you book most often." />
        )}
        <PrimaryButton onClick={() => setOpen(true)}>Add property</PrimaryButton>
      </div>
      <BottomSheet open={open} title="Add property" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => {
            addProperty({ name: values.name, address: values.address, type });
            pushToast("Property saved");
            form.reset();
            setOpen(false);
          })}
        >
          <TextField label="Property name" error={form.formState.errors.name?.message} {...form.register("name")} />
          <TextField label="Address" error={form.formState.errors.address?.message} {...form.register("address")} />
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((item) => (
              <Chip key={item} active={type === item} onClick={() => { setType(item); form.setValue("type", item); }}>
                {item}
              </Chip>
            ))}
          </div>
          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </BottomSheet>
    </ScreenFrame>
  );
}

export function NotificationSettingsScreen() {
  useRequireUser();
  const { prefs, togglePref } = useApp();
  const navigate = useNavigate();
  const rows: { key: keyof typeof prefs; label: string; body: string }[] = [
    { key: "bookingUpdates", label: "Booking updates", body: "Confirmation when a visit is requested or accepted." },
    { key: "reminders", label: "Reminders", body: "A nudge before the crew is scheduled to arrive." },
    { key: "statusChanges", label: "Status changes", body: "When a visit moves to in progress or completed." },
    { key: "quotes", label: "Quote replies", body: "Follow-ups on estimate requests." },
  ];

  return (
    <ScreenFrame>
      <TopAppBar title="Notifications" onBack={() => navigate({ to: "/profile" })} />
      <ul className="px-4 pb-8">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-3 border-b border-line py-3">
            <div className="flex-1">
              <p className="text-[15px] font-semibold">{row.label}</p>
              <p className="text-sm text-muted">{row.body}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[row.key]}
              aria-label={row.label}
              onClick={() => togglePref(row.key)}
              className={prefs[row.key] ? "relative h-8 w-14 rounded-full bg-accent" : "relative h-8 w-14 rounded-full bg-white/15"}
            >
              <span className={prefs[row.key] ? "absolute left-7 top-1 size-6 rounded-full bg-ink" : "absolute left-1 top-1 size-6 rounded-full bg-white"} />
            </button>
          </li>
        ))}
      </ul>
    </ScreenFrame>
  );
}
