// src/model_schemas/models/components/phone.model.ts

// IMPORT TOOLS
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// EMAIL
export interface PhoneShort {
    id: number
    phone_number: string
    notes: string | null
    is_personal: boolean,
    is_blocked: boolean,
    created_by: number,
    feedbacks: FeedbackShort[]
    global_code: string
}