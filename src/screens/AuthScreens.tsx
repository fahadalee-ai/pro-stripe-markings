import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { business, demoAccount } from "@/data/content";
import { images } from "@/data/images";
import { forgotSchema } from "@/lib/schemas";
import { useApp } from "@/lib/store";
import { PasswordField, PrimaryButton, SecondaryButton, StrengthMeter, SuccessMark, TextField } from "@/components/primitives";

function LogoBlock() {
  return <img src={images.logo} alt="Pro Stripe Markings" className="mx-auto h-16 w-auto" />;
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginDemo, user, ready, pushToast } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (ready && user) navigate({ to: "/home", replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="asphalt min-h-dvh px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <LogoBlock />
      <h1 className="mt-6 text-center font-display text-[2rem] uppercase leading-9">Welcome Back</h1>
      <p className="mt-2 text-center text-[15px] leading-[22px] text-muted">Log in to manage your appointments.</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitting(true);
          await new Promise((resolve) => setTimeout(resolve, 400));
          login(values.email, values.password);
          pushToast("Welcome back");
          navigate({ to: "/home" });
        })}
        noValidate
      >
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" {...form.register("email")} />
        <PasswordField label="Password" autoComplete="current-password" {...form.register("password")} />
        <div className="text-right">
          <Link to="/forgot-password" className="inline-flex min-h-11 items-center text-sm font-semibold text-sky">
            Forgot Password?
          </Link>
        </div>
        <PrimaryButton type="submit" loading={submitting}>
          Log In
        </PrimaryButton>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="space-y-2">
        <SecondaryButton type="button" onClick={() => { loginDemo("Google"); navigate({ to: "/home" }); }}>
          Continue with Google
        </SecondaryButton>
        <SecondaryButton type="button" onClick={() => { loginDemo("Apple"); navigate({ to: "/home" }); }}>
          Continue with Apple
        </SecondaryButton>
      </div>
      <p className="mt-4 text-center text-xs leading-4 text-muted">
        Preview account: {demoAccount.email}
        <br />
        Password: {demoAccount.password}
      </p>
      <p className="mt-6 text-center text-[15px] text-muted">
        New here?{" "}
        <Link to="/register" className="font-semibold text-sky">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register: registerUser, pushToast } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      address: "",
      role: "owner" as const,
      agree: false,
    },
  });
  const role = form.watch("role");
  const password = form.watch("password");

  return (
    <div className="asphalt min-h-dvh px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <LogoBlock />
      <h1 className="mt-5 font-display text-[2rem] uppercase leading-9">Create Your Account</h1>
      <p className="mt-2 text-[15px] leading-[22px] text-muted">For paving companies and commercial property owners.</p>
      <div className="mt-4 grid grid-cols-2 rounded-[14px] bg-surface-2 p-1" role="tablist" aria-label="Account type">
        {(
          [
            ["owner", "Property Owner"],
            ["paving", "Paving Company"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={role === value}
            className={role === value ? "min-h-11 rounded-[12px] bg-accent text-sm font-semibold text-ink" : "min-h-11 rounded-[12px] text-sm font-semibold text-muted"}
            onClick={() => form.setValue("role", value)}
          >
            {label}
          </button>
        ))}
      </div>
      <form
        className="mt-4 space-y-3"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitting(true);
          await new Promise((resolve) => setTimeout(resolve, 400));
          registerUser(values);
          pushToast("Account created", "You’re signed in and ready to book.");
          navigate({ to: "/home" });
        })}
      >
        <TextField label="Full Name" autoComplete="name" {...form.register("fullName")} />
        <TextField label="Company Name" autoComplete="organization" {...form.register("company")} />
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" {...form.register("email")} />
        <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" {...form.register("phone")} />
        <div>
          <PasswordField label="Password" autoComplete="new-password" {...form.register("password")} />
          <StrengthMeter password={password} />
        </div>
        <PasswordField label="Confirm Password" autoComplete="new-password" {...form.register("confirm")} />
        <TextField label="Property / Business Address (optional)" autoComplete="street-address" {...form.register("address")} />
        <label className="flex min-h-11 items-start gap-3 py-1 text-sm leading-5 text-muted">
          <input type="checkbox" className="mt-1 size-5 accent-[#FFCE08]" {...form.register("agree")} />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-sky">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="font-semibold text-sky">
              Privacy Policy
            </Link>
          </span>
        </label>
        <PrimaryButton type="submit" loading={submitting}>
          Create Account
        </PrimaryButton>
      </form>
      <p className="mt-6 text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-sky">
          Log in
        </Link>
      </p>
    </div>
  );
}

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [sent, setSent] = useState("");
  const form = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" }, mode: "onTouched" });

  return (
    <div className="asphalt min-h-dvh px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <button type="button" className="min-h-11 text-sm font-semibold text-sky" onClick={() => navigate({ to: "/login" })}>
        Back to log in
      </button>
      {sent ? (
        <div className="mt-10 text-center">
          <SuccessMark label="Reset link sent" />
          <h1 className="mt-5 font-display text-[2rem] uppercase leading-9">Check your email</h1>
          <p className="mt-3 text-[15px] leading-[22px] text-muted">
            If an account exists for {sent}, a reset link is ready in this preview. In production this would email {business.email}.
          </p>
          <PrimaryButton className="mt-6" onClick={() => navigate({ to: "/login" })}>
            Return to log in
          </PrimaryButton>
        </div>
      ) : (
        <>
          <h1 className="mt-4 font-display text-[2rem] uppercase leading-9">Forgot Password</h1>
          <p className="mt-2 text-[15px] leading-[22px] text-muted">Enter your email and we’ll send a reset link.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              await new Promise((resolve) => setTimeout(resolve, 600));
              setSent(values.email);
            })}
            noValidate
          >
            <TextField label="Email" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
            <PrimaryButton type="submit" loading={form.formState.isSubmitting}>
              Send Reset Link
            </PrimaryButton>
          </form>
        </>
      )}
    </div>
  );
}
