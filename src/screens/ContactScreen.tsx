import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { ScreenFrame, TopAppBar } from "@/components/chrome";
import { business, faqs, privacySummary, termsSummary } from "@/data/content";
import { images } from "@/data/images";
import { useRequireUser } from "@/hooks/useRequireUser";

export function ContactScreen() {
  useRequireUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ScreenFrame>
      <TopAppBar title="About" onBack={() => navigate({ to: "/profile" })} />
      <div className="space-y-4 px-4 pb-10">
        <img src={images.logo} alt="Pro Stripe Markings" className="h-14 w-auto" />
        <h1 className="font-display text-[2rem] uppercase leading-9">{business.legalName}</h1>
        <p className="font-display text-xl uppercase leading-7 text-accent">{business.tagline}</p>
        <p className="text-[15px] leading-[22px] text-muted">{business.summary}</p>
        <p className="text-[15px] leading-[22px] text-muted">{business.story}</p>
        <p className="text-[15px] leading-[22px] text-muted">{business.servicesIntro}</p>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 text-accent" strokeWidth={1.75} />{business.address}</p>
          <a className="mt-3 flex min-h-11 items-center gap-2 text-sky" href={`tel:${business.phoneTel}`}><Phone className="size-4" strokeWidth={1.75} />{business.phoneDisplay}</a>
          <a className="flex min-h-11 items-center gap-2 text-sky" href={`mailto:${business.email}`}><Mail className="size-4" strokeWidth={1.75} />{business.email}</a>
          <a className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-accent font-semibold text-ink" href={business.mapsUrl} target="_blank" rel="noreferrer">Get Directions</a>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-display text-lg uppercase leading-6">Hours</h2>
          <p className="mt-2 text-sm leading-5 text-muted">{business.hoursNote}</p>
          <p className="mt-2 text-sm text-muted">{business.serviceArea}</p>
        </article>
        <section>
          <h2 className="font-display text-2xl uppercase leading-[30px]">Questions</h2>
          <div className="mt-3 space-y-2">
            {faqs.map((item, index) => (
              <div key={item.q} className="rounded-2xl border border-line bg-surface">
                <button type="button" className="flex min-h-12 w-full items-center justify-between gap-3 px-3 text-left" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
                  <span className="text-[15px] font-semibold">{item.q}</span>
                  <ChevronDown className={open === index ? "size-4 rotate-180 text-accent" : "size-4 text-muted"} />
                </button>
                {open === index ? <p className="px-3 pb-3 text-sm leading-5 text-muted">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>
        <p className="text-sm text-muted">
          Website:{" "}
          <a className="text-sky" href={business.website} target="_blank" rel="noreferrer">
            prostripemarkings.com
          </a>
        </p>
      </div>
    </ScreenFrame>
  );
}

function useBack(fallback: "/register" | "/profile" | "/home") {
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return () => {
    if (canGoBack) router.history.back();
    else navigate({ to: fallback });
  };
}

export function TermsScreen() {
  const back = useBack("/register");
  return (
    <ScreenFrame>
      <TopAppBar title="Terms" onBack={back} />
      <div className="space-y-3 px-4 pb-10 text-[15px] leading-[22px] text-muted">
        {termsSummary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <a className="inline-flex min-h-11 items-center text-sky" href={business.termsUrl} target="_blank" rel="noreferrer">
          Read the full terms
        </a>
      </div>
    </ScreenFrame>
  );
}

export function PrivacyScreen() {
  const back = useBack("/register");
  return (
    <ScreenFrame>
      <TopAppBar title="Privacy" onBack={back} />
      <div className="space-y-3 px-4 pb-10 text-[15px] leading-[22px] text-muted">
        {privacySummary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </ScreenFrame>
  );
}
