import { z } from "zod";

export const updateTodoSchema = z.object({
  textInput: z.string().max(259, "Text is too long").optional(),
  
  title: z.string().optional(),
  
  description: z.string().optional(),
  
  isCompleted: z.boolean().optional(),
  
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  
  tags: z.array(z.string()).optional(),
});
