import { z } from "zod";

export function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const passwordField = z
  .string()
  .min(8, "Use at least 8 characters.")
  .superRefine((value, ctx) => {
    if (passwordScore(value) < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a mix of letters and a number.",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    company: z.string().trim().min(2, "Enter your company name."),
    email: z.string().trim().email("Enter a valid email."),
    phone: z
      .string()
      .trim()
      .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number."),
    password: passwordField,
    confirm: z.string().min(1, "Confirm your password."),
    address: z.string().trim().optional(),
    role: z.enum(["owner", "paving"]),
    agree: z.boolean().refine((value) => value, { message: "Agree to the Terms and Privacy Policy." }),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export const forgotSchema = z.object({
  email: z.string().trim().email("Enter the email on your account."),
});

export const quoteSchema = z.object({
  serviceIds: z.array(z.string()).min(1, "Choose at least one service."),
  address: z.string().trim().min(6, "Enter the property address."),
  details: z.string().trim().min(8, "Add a few details about the property."),
  contactMethod: z.enum(["phone", "email", "either"]),
  name: z.string().trim().min(2, "Enter a contact name."),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number."),
  email: z.string().trim().email("Enter a valid email."),
});

export const propertyStepSchema = z.object({
  propertyName: z.string().trim().min(2, "Enter the property name."),
  address: z.string().trim().min(6, "Enter a street, city, and state."),
  propertyType: z.string().min(1, "Choose a property type."),
  stallCount: z.number().min(10, "Enter at least 10 stalls.").max(800),
  notes: z.string().max(500, "Keep notes under 500 characters."),
});

export const scheduleStepSchema = z
  .object({
    flexible: z.boolean(),
    date: z.string().nullable(),
    time: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.flexible) return;
    if (!value.date) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a date or choose flexible.", path: ["date"] });
    }
    if (!value.time) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pick a time window.", path: ["time"] });
    }
  });

export const contactStepSchema = z.object({
  contactName: z.string().trim().min(2, "Enter a contact name."),
  contactPhone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number."),
  contactEmail: z.string().trim().email("Enter a valid email."),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  company: z.string().trim().min(2, "Enter your company name."),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a 10-digit phone number."),
  address: z.string().trim().optional(),
});

export const savedPropertySchema = z.object({
  name: z.string().trim().min(2, "Enter a property name."),
  address: z.string().trim().min(6, "Enter the address."),
  type: z.string().min(1, "Choose a property type."),
});
