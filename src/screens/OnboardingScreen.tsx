import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { onboarding } from "@/data/content";
import { useApp } from "@/lib/store";
import { CoverImage, PrimaryButton } from "@/components/primitives";

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const navigate = useNavigate();
  const { markOnboarded } = useApp();
  const slide = onboarding[index]!;
  const last = index === onboarding.length - 1;

  const finish = (to: "/login" | "/register") => {
    markOnboarded();
    navigate({ to, replace: true });
  };

  const next = () => {
    if (last) finish("/register");
    else setIndex((value) => value + 1);
  };

  return (
    <div
      className="flex min-h-dvh flex-col bg-background"
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(event) => {
        const delta = (event.changedTouches[0]?.clientX ?? 0) - startX.current;
        if (delta < -40 && !last) setIndex((value) => value + 1);
        if (delta > 40 && index > 0) setIndex((value) => value - 1);
      }}
    >
      <div className="relative h-[55dvh] min-h-[280px]">
        <CoverImage src={slide.image} alt={slide.alt} priority className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00121C]/25 via-transparent to-[#00121C]" />
        {!last ? (
          <button
            type="button"
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] min-h-11 px-3 text-sm font-semibold text-white"
            onClick={() => finish("/login")}
          >
            Skip
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <h1 className="font-display text-[2rem] uppercase leading-9">
          <span className="text-accent">{slide.title.split(" ").slice(0, 2).join(" ")}</span>{" "}
          <span className="text-white">{slide.title.split(" ").slice(2).join(" ")}</span>
        </h1>
        <p className="mt-3 text-[15px] leading-[22px] text-muted">{slide.body}</p>
        <div className="mt-5 flex gap-2" aria-label="Slide">
          {onboarding.map((item, dot) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Go to slide ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={dot === index ? "h-2 w-8 rounded-full bg-accent" : "size-2 rounded-full bg-white/25"}
            />
          ))}
        </div>
        <div className="mt-auto pt-6">
          <PrimaryButton onClick={next}>{last ? "Get Started" : "Next"}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
