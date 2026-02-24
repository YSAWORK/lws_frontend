// .src/model_schemas/dto/components/email.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";

// EMAIL SHORT
export const EmailShortSchema = z.object({
    id: z.number(),
    email: z.string(),
    notes: z.string().nullable(),
    feedbacks: z.array(FeedbackShortSchema),
    global_code: z.string(),
})

export type EmailShortDTO = z.infer<typeof EmailShortSchema>