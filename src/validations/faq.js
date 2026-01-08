import { z } from "zod";

export const createFaqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question cannot exceed 200 characters"),

  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters"),
});
