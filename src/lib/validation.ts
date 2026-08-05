import { z } from "zod";

import { isValidDate, rentalDays } from "./dates";

const isoDate = z
  .string()
  .refine(isValidDate, { message: "Use a real date in YYYY-MM-DD format." });

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a time like 14:30.");

export const bookingRequestSchema = z
  .object({
    carId: z.string().min(1, "Choose a car."),
    name: z.string().trim().min(2, "Tell us your name.").max(120),
    email: z.email("That email doesn't look right.").max(200),
    phone: z
      .string()
      .trim()
      .min(7, "We need a phone number in case we can't reach you by email.")
      .max(40),
    startDate: isoDate,
    endDate: isoDate,
    pickupTime: time,
    dropoffTime: time,
    occasion: z.string().trim().max(120).optional().default(""),
    deliveryRequested: z.boolean().optional().default(false),
    deliveryAddress: z.string().trim().max(300).optional().default(""),
    notes: z.string().trim().max(2000).optional().default(""),
    /**
     * Honeypot — real people leave this empty. Deliberately permissive: the
     * route handler inspects it and returns a fake success, so a bot never
     * learns which field gave it away. Rejecting it here would leak that.
     */
    website: z.string().max(500).optional().default(""),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "The drop-off date can't be before the pick-up date.",
    path: ["endDate"],
  })
  .refine((data) => rentalDays(data.startDate, data.endDate) <= 30, {
    message: "For rentals longer than 30 days, please contact us directly.",
    path: ["endDate"],
  })
  .refine(
    (data) => !data.deliveryRequested || data.deliveryAddress.trim().length > 5,
    {
      message: "Add the address you'd like the car delivered to.",
      path: ["deliveryAddress"],
    },
  );

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.email("That email doesn't look right.").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Give us a little more detail.")
    .max(2000),
  /** Honeypot — see the note on the booking schema. */
  website: z.string().max(500).optional().default(""),
});

export const carSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "The car needs a name.").max(80),
  theme: z.string().trim().max(80).optional().default(""),
  tagline: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(4000).optional().default(""),
  model: z.string().trim().max(120).optional().default(""),
  seats: z.coerce.number().int().min(1).max(9),
  transmission: z.enum(["Automatic", "Manual"]),
  image: z.string().trim().max(500).optional().default(""),
  accent: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #d94436."),
  features: z.string().max(2000).optional().default(""),
  dailyRate: z.coerce.number().min(0).max(100000),
  weekendRate: z.coerce.number().min(0).max(100000).optional(),
  deliveryFee: z.coerce.number().min(0).max(100000),
  cleaningFee: z.coerce.number().min(0).max(100000),
  minDays: z.coerce.number().int().min(1).max(30),
  active: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const blackoutSchema = z
  .object({
    carId: z.string(),
    startDate: isoDate,
    endDate: isoDate,
    reason: z.string().trim().max(200).optional().default(""),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "The end date can't be before the start date.",
    path: ["endDate"],
  });

/** Turns a Zod error into { field: message } for inline form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
