import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#00060c]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
