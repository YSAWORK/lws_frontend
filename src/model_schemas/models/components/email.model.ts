// src/model_schemas/models/components/email.model.ts

// IMPORT TOOLS
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// EMAIL
export interface EmailShort {
    id: number
    email: string
    notes: string | null
    feedbacks: FeedbackShort[]
    global_code: string
}