import { z } from "zod";

export const websiteSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .max(100, "Domain is too long")
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid domain (e.g., example.com)"
    ),
});