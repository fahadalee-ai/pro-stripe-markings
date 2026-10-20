import { useNavigate } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { EmptyState } from "@/components/primitives";
import { useRequireUser } from "@/hooks/useRequireUser";
import { useApp } from "@/lib/store";

export function NotificationsScreen() {
  useRequireUser();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllRead } = useApp();

  return (
    <ScreenFrame>
      <TopAppBar
        title="Notifications"
        onBack={() => navigate({ to: "/home" })}
        right={
          <button type="button" className="min-h-11 px-2 text-sm font-semibold text-sky" onClick={markAllRead}>
            Mark read
          </button>
        }
      />
      <div className="px-4 pb-8">
        {notifications.length ? (
          <ul className="space-y-2">
            {notifications.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full min-h-16 items-start gap-3 rounded-2xl border border-line bg-surface px-3 py-3 text-left"
                  onClick={() => {
                    markNotificationRead(item.id);
                    if (item.href.startsWith("/appointments/")) {
                      const id = item.href.split("/").pop() ?? "";
                      navigate({ to: "/appointments/$id", params: { id } });
                    } else navigate({ to: "/home" });
                  }}
                >
                  <span className={item.read ? "mt-1.5 size-2 rounded-full bg-transparent" : "mt-1.5 size-2 rounded-full bg-accent"} />
                  <span>
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted">{item.body}</span>
                    <span className="mt-1 block text-xs text-sky">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Bell strokeWidth={1.75} />} title="You’re caught up" body="Booking confirmations, reminders, and status updates will show here." />
        )}
      </div>
    </ScreenFrame>
  );
}
