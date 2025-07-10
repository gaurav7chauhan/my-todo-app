import { z } from "zod";

export const todoSchema = z.object({
    textInput: z
    .string()
    .max(259, "You reached the limit of words")
    .min(1, "Todo text is required").trim(),

  title: z.string().min(1, "Title is required").trim(),
  
  description: z.string().trim().optional(),
  
  isCompleted: z.boolean().default(false),
  
  priority: z.enum(["low", "medium", "high"]).optional(),
  
  tags: z.array(z.string()).optional(),
});
