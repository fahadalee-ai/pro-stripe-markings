import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

export function useRequireUser() {
  const { user, ready } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);
  return { user, ready };
}
