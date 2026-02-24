// .src/model_schemas/dto/feedback/feedback.dto.ts

// IMPORT TOOLS
import { z } from "zod"

// PHONE SHORT
export const FeedbackShortSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    notes: z.string(),
})

export type FeedbackShortDTO = z.infer<typeof FeedbackShortSchema>