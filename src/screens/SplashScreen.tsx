import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { business } from "@/data/content";
import { images } from "@/data/images";
import { useApp } from "@/lib/store";

export function SplashScreen() {
  const navigate = useNavigate();
  const { ready, user, onboarded } = useApp();

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      if (user) navigate({ to: "/home", replace: true });
      else if (!onboarded) navigate({ to: "/onboarding", replace: true });
      else navigate({ to: "/login", replace: true });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [ready, user, onboarded, navigate]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6">
      <img src={images.splash} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-[#00121C]/55" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <svg viewBox="0 0 360 12" className="mb-8 w-full" aria-hidden>
          <line className="draw-line" x1="0" y1="6" x2="360" y2="6" stroke="#FFCE08" strokeWidth="4" strokeLinecap="butt" />
        </svg>
        <img src={images.logo} alt="Pro Stripe Markings" className="logo-in w-[240px] max-w-full" />
        <p className="tag-in mt-6 text-center font-display text-xl uppercase leading-7 text-accent">{business.tagline}</p>
      </div>
      <div className="absolute inset-x-8 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10">
        <div className="splash-bar h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100}>
          <span className="block h-full rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
