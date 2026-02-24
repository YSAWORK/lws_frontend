// src/model_schemas/models/components/phone.model.ts

// IMPORT TOOLS
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// EMAIL
export interface PhoneShort {
    id: number
    phone_number: string
    notes: string | null
    feedbacks: FeedbackShort[]
    global_code: string
}