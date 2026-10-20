import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoAccount } from "@/data/content";
import { readJson, writeStorage } from "./storage";

export type Role = "owner" | "paving";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  address: string;
};

export type AppointmentStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  code: string;
  userId: string;
  serviceIds: string[];
  propertyName: string;
  address: string;
  propertyType: string;
  stallCount: number;
  notes: string;
  photos: { name: string; url: string }[];
  date: string | null;
  time: string | null;
  flexible: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
};

export type SavedProperty = {
  id: string;
  userId: string;
  name: string;
  address: string;
  type: string;
};

export type NotifPrefs = {
  bookingUpdates: boolean;
  reminders: boolean;
  statusChanges: boolean;
  quotes: boolean;
};

export type BookingDraft = {
  serviceIds: string[];
  propertyName: string;
  address: string;
  propertyType: string;
  stallCount: number;
  notes: string;
  photos: { id: string; name: string; url: string }[];
  date: string | null;
  time: string | null;
  flexible: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

export type Toast = { id: number; title: string; body?: string };

const KEYS = {
  users: "psm.users",
  session: "psm.session",
  onboarded: "psm.onboarded",
  appointments: "psm.appointments",
  notifications: "psm.notifications",
  properties: "psm.properties",
  prefs: "psm.prefs",
};

const demoUser: User = {
  id: "u-demo",
  firstName: "Jordan",
  lastName: "Ellis",
  company: "Harbor Retail Group",
  email: demoAccount.email,
  phone: "(908) 555-0142",
  password: demoAccount.password,
  role: "owner",
  address: "120 Market Street, Cranford, NJ 07016",
};

const seedAppointments: Appointment[] = [
  {
    id: "apt-1",
    code: "PSM-10428",
    userId: demoUser.id,
    serviceIds: ["line-striping", "wheel-stops"],
    propertyName: "Harbor Retail — Cranford",
    address: "120 Market Street, Cranford, NJ 07016",
    propertyType: "Retail",
    stallCount: 140,
    notes: "Restrooms side of the lot needs new stall lines before the holiday weekend.",
    photos: [],
    date: "2026-10-21",
    time: "8:00–10:00 AM",
    flexible: false,
    contactName: "Jordan Ellis",
    contactPhone: "(908) 555-0142",
    contactEmail: demoAccount.email,
    status: "confirmed",
    createdAt: "2026-10-12T14:00:00.000Z",
  },
  {
    id: "apt-2",
    code: "PSM-10441",
    userId: demoUser.id,
    serviceIds: ["traffic-signs"],
    propertyName: "Harbor Annex",
    address: "88 Commerce Drive, Union, NJ 07083",
    propertyType: "Office",
    stallCount: 60,
    notes: "Replace faded stop and one-way signs at the south driveway.",
    photos: [],
    date: "2026-10-28",
    time: "10:00 AM–12:00 PM",
    flexible: false,
    contactName: "Jordan Ellis",
    contactPhone: "(908) 555-0142",
    contactEmail: demoAccount.email,
    status: "pending",
    createdAt: "2026-10-15T16:30:00.000Z",
  },
  {
    id: "apt-3",
    code: "PSM-10302",
    userId: demoUser.id,
    serviceIds: ["seal-coating", "pothole-repair"],
    propertyName: "Harbor Retail — Cranford",
    address: "120 Market Street, Cranford, NJ 07016",
    propertyType: "Retail",
    stallCount: 140,
    notes: "Seal coat after the spring pothole repairs.",
    photos: [],
    date: "2026-09-12",
    time: "8:00–10:00 AM",
    flexible: false,
    contactName: "Jordan Ellis",
    contactPhone: "(908) 555-0142",
    contactEmail: demoAccount.email,
    status: "completed",
    createdAt: "2026-08-20T13:00:00.000Z",
  },
  {
    id: "apt-4",
    code: "PSM-10288",
    userId: demoUser.id,
    serviceIds: ["bollards"],
    propertyName: "Harbor Annex",
    address: "88 Commerce Drive, Union, NJ 07083",
    propertyType: "Office",
    stallCount: 40,
    notes: "Cancelled — tenant postponed the entrance work.",
    photos: [],
    date: "2026-08-03",
    time: "12:00–2:00 PM",
    flexible: false,
    contactName: "Jordan Ellis",
    contactPhone: "(908) 555-0142",
    contactEmail: demoAccount.email,
    status: "cancelled",
    createdAt: "2026-07-18T15:00:00.000Z",
  },
];

const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Booking confirmed",
    body: "PSM-10428 is confirmed for Wed, Oct 21, 8:00–10:00 AM at Harbor Retail — Cranford.",
    time: "2h ago",
    read: false,
    href: "/appointments/apt-1",
  },
  {
    id: "n2",
    title: "Visit reminder",
    body: "Your line striping crew is scheduled this Wednesday. Keep the fire lane clear.",
    time: "Yesterday",
    read: false,
    href: "/appointments/apt-1",
  },
  {
    id: "n3",
    title: "Status updated",
    body: "Seal coating and pothole repair at Cranford is marked completed.",
    time: "Sep 12",
    read: true,
    href: "/appointments/apt-3",
  },
];

const seedProperties: SavedProperty[] = [
  {
    id: "p1",
    userId: demoUser.id,
    name: "Harbor Retail — Cranford",
    address: "120 Market Street, Cranford, NJ 07016",
    type: "Retail",
  },
  {
    id: "p2",
    userId: demoUser.id,
    name: "Harbor Annex",
    address: "88 Commerce Drive, Union, NJ 07083",
    type: "Office",
  },
];

const defaultPrefs: NotifPrefs = {
  bookingUpdates: true,
  reminders: true,
  statusChanges: true,
  quotes: true,
};

export const emptyDraft = (): BookingDraft => ({
  serviceIds: [],
  propertyName: "",
  address: "",
  propertyType: "",
  stallCount: 50,
  notes: "",
  photos: [],
  date: null,
  time: null,
  flexible: false,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
});

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

type Store = {
  ready: boolean;
  user: User | null;
  onboarded: boolean;
  appointments: Appointment[];
  notifications: AppNotification[];
  properties: SavedProperty[];
  prefs: NotifPrefs;
  draft: BookingDraft;
  toasts: Toast[];
  unreadCount: number;
  markOnboarded: () => void;
  login: (email: string, password: string) => { ok: true } | { ok: false };
  loginDemo: (provider: "Google" | "Apple") => void;
  register: (input: {
    fullName: string;
    company: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    address?: string;
  }) => { ok: true } | { ok: false; reason: "exists" };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  addAppointment: (input: Omit<Appointment, "id" | "code" | "userId" | "createdAt" | "status">) => Appointment | null;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addProperty: (input: Omit<SavedProperty, "id" | "userId">) => void;
  removeProperty: (id: string) => void;
  togglePref: (key: keyof NotifPrefs) => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function persistAppointments(list: Appointment[]) {
  writeStorage(
    KEYS.appointments,
    JSON.stringify(list.map((item) => ({ ...item, photos: [] }))),
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>([demoUser]);
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [properties, setProperties] = useState<SavedProperty[]>(seedProperties);
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const storedUsers = readJson<User[]>(KEYS.users, [demoUser]);
    const withDemo = storedUsers.some((item) => item.id === demoUser.id)
      ? storedUsers
      : [demoUser, ...storedUsers];
    const session = readJson<string | null>(KEYS.session, null);
    const storedAppointments = readJson<Appointment[] | null>(KEYS.appointments, null);
    setUsers(withDemo);
    setUser(withDemo.find((item) => item.id === session) ?? null);
    setOnboarded(readJson(KEYS.onboarded, false));
    setAppointments(storedAppointments ?? seedAppointments);
    setNotifications(readJson(KEYS.notifications, seedNotifications));
    setProperties(readJson(KEYS.properties, seedProperties));
    setPrefs(readJson(KEYS.prefs, defaultPrefs));
    setReady(true);
  }, []);

  const value = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, title, body }]);
      window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3200);
    };

    return {
      ready,
      user,
      onboarded,
      appointments,
      notifications,
      properties,
      prefs,
      draft,
      toasts,
      unreadCount: notifications.filter((item) => !item.read).length,
      markOnboarded: () => {
        setOnboarded(true);
        writeStorage(KEYS.onboarded, JSON.stringify(true));
      },
      login: (email, _password) => {
        const trimmed = email.trim().toLowerCase();
        const found = trimmed ? users.find((item) => item.email.toLowerCase() === trimmed) : undefined;
        const next = found ?? demoUser;
        setUser(next);
        writeStorage(KEYS.session, JSON.stringify(next.id));
        writeStorage(KEYS.onboarded, JSON.stringify(true));
        setOnboarded(true);
        return { ok: true };
      },
      loginDemo: (provider) => {
        setUser(demoUser);
        writeStorage(KEYS.session, JSON.stringify(demoUser.id));
        writeStorage(KEYS.onboarded, JSON.stringify(true));
        setOnboarded(true);
        pushToast(`Signed in with ${provider}`, "Preview session for Jordan Ellis.");
      },
      register: (input) => {
        const email = input.email.trim().toLowerCase();
        const existing = email ? users.find((item) => item.email.toLowerCase() === email) : undefined;
        if (existing) {
          setUser(existing);
          writeStorage(KEYS.session, JSON.stringify(existing.id));
          writeStorage(KEYS.onboarded, JSON.stringify(true));
          setOnboarded(true);
          return { ok: true };
        }
        const names = splitName(input.fullName || "Guest");
        const created: User = {
          id: `u-${Date.now()}`,
          firstName: names.firstName || "Guest",
          lastName: names.lastName,
          company: input.company.trim() || "My Company",
          email: email || `guest-${Date.now()}@local`,
          phone: input.phone.trim(),
          password: input.password,
          role: input.role,
          address: input.address?.trim() ?? "",
        };
        const next = [...users, created];
        setUsers(next);
        writeStorage(KEYS.users, JSON.stringify(next));
        setUser(created);
        writeStorage(KEYS.session, JSON.stringify(created.id));
        writeStorage(KEYS.onboarded, JSON.stringify(true));
        setOnboarded(true);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        writeStorage(KEYS.session, JSON.stringify(null));
      },
      updateUser: (patch) => {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        setUsers((list) => {
          const updated = list.map((item) => (item.id === next.id ? next : item));
          writeStorage(KEYS.users, JSON.stringify(updated));
          return updated;
        });
      },
      updateDraft: (patch) => setDraft((current) => ({ ...current, ...patch })),
      resetDraft: () => setDraft(emptyDraft()),
      addAppointment: (input) => {
        if (!user) return null;
        const created: Appointment = {
          ...input,
          id: `apt-${Date.now()}`,
          code: `PSM-${Math.floor(10000 + Math.random() * 90000)}`,
          userId: user.id,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        setAppointments((list) => {
          const next = [created, ...list];
          persistAppointments(next);
          return next;
        });
        setNotifications((list) => {
          const next = [
            {
              id: `n-${Date.now()}`,
              title: "Booking requested",
              body: `${created.code} is pending confirmation.`,
              time: "Just now",
              read: false,
              href: `/appointments/${created.id}`,
            },
            ...list,
          ];
          writeStorage(KEYS.notifications, JSON.stringify(next));
          return next;
        });
        return created;
      },
      updateAppointment: (id, patch) => {
        setAppointments((list) => {
          const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
          persistAppointments(next);
          return next;
        });
      },
      markNotificationRead: (id) => {
        setNotifications((list) => {
          const next = list.map((item) => (item.id === id ? { ...item, read: true } : item));
          writeStorage(KEYS.notifications, JSON.stringify(next));
          return next;
        });
      },
      markAllRead: () => {
        setNotifications((list) => {
          const next = list.map((item) => ({ ...item, read: true }));
          writeStorage(KEYS.notifications, JSON.stringify(next));
          return next;
        });
      },
      addProperty: (input) => {
        if (!user) return;
        setProperties((list) => {
          const next = [{ ...input, id: `p-${Date.now()}`, userId: user.id }, ...list];
          writeStorage(KEYS.properties, JSON.stringify(next));
          return next;
        });
      },
      removeProperty: (id) => {
        setProperties((list) => {
          const next = list.filter((item) => item.id !== id);
          writeStorage(KEYS.properties, JSON.stringify(next));
          return next;
        });
      },
      togglePref: (key) => {
        setPrefs((current) => {
          const next = { ...current, [key]: !current[key] };
          writeStorage(KEYS.prefs, JSON.stringify(next));
          return next;
        });
      },
      pushToast,
      dismissToast: (id) => setToasts((list) => list.filter((item) => item.id !== id)),
    };
  }, [ready, user, onboarded, appointments, notifications, properties, prefs, draft, toasts, users]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
