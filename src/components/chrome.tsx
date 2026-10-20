import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, CalendarPlus, ChevronLeft, ClipboardList, Home, LayoutGrid, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: LayoutGrid },
  { to: "/book", label: "Book", icon: CalendarPlus, center: true },
  { to: "/appointments", label: "Appointments", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function BottomTabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-line bg-[#00121C]/95 backdrop-blur"
      aria-label="Primary"
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="grid grid-cols-5 items-end px-1 pt-1">
        {tabs.map((tab) => {
          const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`);
          const Icon = tab.icon;
          if ("center" in tab && tab.center) {
            return (
              <li key={tab.to} className="flex justify-center">
                <Link
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  className="-mt-6 flex size-16 flex-col items-center justify-center rounded-full bg-accent text-ink shadow-[0_8px_24px_rgba(255,206,8,0.35)] active:scale-95"
                >
                  <Icon strokeWidth={1.75} className="size-6" aria-hidden />
                  <span className="sr-only">{tab.label}</span>
                </Link>
              </li>
            );
          }
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon strokeWidth={1.75} className="size-5" aria-hidden />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopAppBar({
  title,
  onBack,
  right,
  home = false,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  home?: boolean;
}) {
  const { unreadCount, user } = useApp();
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 bg-[#00121C]/92 px-3 py-2 backdrop-blur"
      style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
    >
      {home ? (
        <img src={images.logo} alt="Pro Stripe Markings" className="h-10 w-auto" />
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-full text-white"
          aria-label="Go back"
        >
          <ChevronLeft strokeWidth={1.75} />
        </button>
      )}
      {title ? (
        <h1 className="min-w-0 flex-1 truncate font-display text-lg uppercase leading-6">{title}</h1>
      ) : (
        <span className="flex-1" />
      )}
      {home ? (
        <div className="flex items-center">
          <Link to="/notifications" className="relative flex size-11 items-center justify-center" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}>
            <Bell strokeWidth={1.75} />
            {unreadCount > 0 ? <span className="absolute right-2 top-2 size-2.5 rounded-full bg-accent" /> : null}
          </Link>
          <Link
            to="/profile"
            className="flex size-11 items-center justify-center"
            aria-label="Profile"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-ink">
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : <UserRound className="size-4" />}
            </span>
          </Link>
        </div>
      ) : (
        right
      )}
    </header>
  );
}

export function ScreenFrame({
  children,
  tabs = false,
  className,
}: {
  children: ReactNode;
  tabs?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("asphalt min-h-dvh text-foreground", tabs && "pb-1", className)}>
      {children}
      {tabs ? <BottomTabBar /> : null}
    </div>
  );
}
