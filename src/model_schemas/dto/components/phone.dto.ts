// .src/model_schemas/dto/components/phones.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";

// PHONE SHORT
export const PhoneShortSchema = z.object({
    id: z.number(),
    phone_number: z.string(),
    notes: z.string().nullable(),
    feedbacks: z.array(FeedbackShortSchema),
    global_code: z.string(),
})

export type PhoneShortDTO = z.infer<typeof PhoneShortSchema>