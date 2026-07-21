import { z } from "zod";

import { budgetOptions, serviceOptions } from "@/data/contact";

const serviceValues = serviceOptions.map((option) => option.value);
const budgetValues = budgetOptions.map((option) => option.value);

/** Shared by the form and the Route Handler so both validate identically. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z
    .string()
    .refine((value) => serviceValues.includes(value), "Please pick a service."),
  budget: z
    .string()
    .refine((value) => budgetValues.includes(value), "Please pick a budget."),
  message: z
    .string()
    .trim()
    .min(20, "Please share at least a couple of sentences.")
    .max(4000),
  /*
   * Honeypot: real people leave this empty. It must stay permissive here so a
   * filled value reaches the Route Handler, which accepts it with a 200 — a
   * validation error would tell the bot exactly which field gave it away.
   */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
