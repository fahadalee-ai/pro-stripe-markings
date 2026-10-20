import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { useEffect, useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useApp, type Toast as ToastItem } from "@/lib/store";

const primaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-4 text-[15px] font-semibold leading-5 text-ink shadow-[0_8px_24px_rgba(255,206,8,0.28)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none";

const secondaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-sky/40 bg-surface-2 px-4 text-[15px] font-semibold leading-5 text-sky transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

type NavTarget =
  | "/home"
  | "/book"
  | "/services"
  | "/appointments"
  | "/quote"
  | "/login"
  | "/register"
  | "/contact"
  | "/gallery"
  | "/profile"
  | "/notifications"
  | "/onboarding"
  | "/forgot-password";

function Spinner() {
  return <Loader2 className="size-5 animate-spin" aria-hidden />;
}

export function PrimaryButton({
  children,
  className,
  loading,
  to,
  search,
  full = true,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  to?: NavTarget;
  search?: { service?: string };
  full?: boolean;
}) {
  const cls = cn(primaryClass, full && "w-full", className);
  if (to === "/book" && search?.service) {
    return (
      <Link to="/book" search={{ service: search.service }} className={cls}>
        {children}
      </Link>
    );
  }
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  loading,
  to,
  full = true,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; to?: NavTarget; full?: boolean }) {
  const cls = cn(secondaryClass, full && "w-full", className);
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function TextField({
  label,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "peer h-14 w-full rounded-[14px] border bg-surface-2 px-4 pb-2 pt-5 text-[15px] text-white outline-none transition placeholder:text-transparent",
            error ? "border-danger" : "border-line focus:border-accent",
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted transition-all peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs leading-4 text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          id={id}
          placeholder=" "
          aria-invalid={Boolean(error)}
          className={cn(
            "peer min-h-28 w-full resize-none rounded-[14px] border bg-surface-2 px-4 pb-3 pt-6 text-[15px] text-white outline-none",
            error ? "border-danger" : "border-line focus:border-accent",
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-4 text-[15px] text-muted transition-all peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs leading-4 text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField({
  label,
  error,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; error?: string }) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          placeholder=" "
          type={show ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn(
            "peer h-14 w-full rounded-[14px] border bg-surface-2 px-4 pb-2 pr-14 pt-5 text-[15px] text-white outline-none",
            error ? "border-danger" : "border-line focus:border-accent",
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted transition-all peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
        <button
          type="button"
          className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-muted"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((value) => !value)}
        >
          {show ? <EyeOff strokeWidth={1.75} className="size-5" /> : <Eye strokeWidth={1.75} className="size-5" />}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs leading-4 text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function StrengthMeter({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const label = ["Too short", "Weak", "Fair", "Strong", "Excellent"][score] ?? "Too short";
  return (
    <div className="mt-2">
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full",
              index < score ? (score > 2 ? "bg-success" : "bg-accent") : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Password strength: {password ? label : "—"}</p>
    </div>
  );
}

export function Chip({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium transition active:scale-[0.98]",
        active ? "bg-accent text-ink" : "bg-surface-2 text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: NavTarget;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-2xl uppercase leading-[30px] text-white">{title}</h2>
      {action && to ? (
        <Link to={to} className="mb-1 min-h-11 text-sm font-semibold text-sky">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function RoadRule({ className }: { className?: string }) {
  return <div className={cn("road-rule my-5", className)} aria-hidden />;
}

export function StepProgress({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div aria-label={`Step ${step} of ${total}`}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-sky">
        Step {step} of {total}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn("h-1.5 flex-1 rounded-full", index < step ? "bg-accent" : "bg-white/12")}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-sky/30 bg-surface px-5 py-8 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-surface-2 text-accent">
        {icon}
      </div>
      <h3 className="font-display text-lg uppercase leading-6 text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-[15px] leading-[22px] text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger/10 px-5 py-6 text-center" role="alert">
      <h3 className="font-display text-lg uppercase leading-6 text-white">{title}</h3>
      <p className="mt-2 text-[15px] leading-[22px] text-muted">{body}</p>
      {onRetry ? (
        <SecondaryButton className="mt-4" onClick={onRetry} full={false}>
          Try again
        </SecondaryButton>
      ) : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-surface-2", className)} />;
}

export function StatusChip({ status }: { status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" }) {
  const map = {
    pending: { label: "Pending", cls: "bg-sky/15 text-sky" },
    confirmed: { label: "Confirmed", cls: "bg-success/15 text-success" },
    in_progress: { label: "In Progress", cls: "bg-sky/15 text-sky" },
    completed: { label: "Completed", cls: "bg-white/10 text-muted" },
    cancelled: { label: "Cancelled", cls: "bg-danger/15 text-danger" },
  } as const;
  const item = map[status];
  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-semibold", item.cls)}>
      {item.label}
    </span>
  );
}

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!open) setOffset(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex h-full w-full max-w-[430px] flex-col justify-end">
        <button className="absolute inset-0 bg-black/60" aria-label="Close dialog" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative rounded-t-[20px] border border-line bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
          style={{ transform: `translateY(${offset}px)`, transition: dragging ? "none" : "transform 180ms ease" }}
        >
          <button
            type="button"
            className="mx-auto mb-3 flex h-11 w-full items-center justify-center"
            aria-label="Drag to close"
            onPointerDown={(event) => {
              setDragging(true);
              setStartY(event.clientY);
            }}
            onPointerMove={(event) => {
              if (!dragging) return;
              setOffset(Math.max(0, event.clientY - startY));
            }}
            onPointerUp={() => {
              setDragging(false);
              if (offset > 90) onClose();
              setOffset(0);
            }}
          >
            <span className="h-1.5 w-12 rounded-full bg-white/25" />
          </button>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase leading-[30px]">{title}</h2>
            <button type="button" className="flex size-11 items-center justify-center" aria-label="Close" onClick={onClose}>
              <X strokeWidth={1.75} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-[14px] border border-line bg-surface-2 px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.body ? <p className="text-xs leading-4 text-muted">{toast.body}</p> : null}
      </div>
      <button type="button" className="flex size-11 items-center justify-center text-muted" aria-label="Dismiss" onClick={onDismiss}>
        <X className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function ToastViewport() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex w-full max-w-[430px] flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
}

export function SuccessMark({ label }: { label: string }) {
  return (
    <div className="check-pop mx-auto flex size-20 items-center justify-center rounded-full bg-accent text-ink shadow-[0_0_32px_rgba(255,206,8,0.35)]" aria-hidden>
      <svg viewBox="0 0 48 48" className="size-10">
        <path d="M12 25.5 20 33.5 36 16" fill="none" stroke="#00121C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-stroke" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function CoverImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (failed) {
    return (
      <div className={cn("flex items-center justify-center bg-surface-2 px-4 text-center text-sm text-muted", className)}>
        <button type="button" className="min-h-11 text-sky" onClick={() => { setFailed(false); setAttempt((n) => n + 1); }}>
          Image didn’t load. Tap to retry.
        </button>
      </div>
    );
  }
  return (
    <img
      key={attempt}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={cn("h-full w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
