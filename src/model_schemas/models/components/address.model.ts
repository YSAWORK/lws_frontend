// src/model_schemas/models/components/address.model.ts

// IMPORT TOOLS
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// ADDRESS SHORT
export interface AddressShort {
    id: number
    address: string
    notes: string | null
    feedbacks: FeedbackShort[]
    global_code: string
}