// src/model_schemas/models/components/address.model.ts

// IMPORT TOOLS
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// ADDRESS SHORT
export interface AddressShort {
    id: number
    postal_code: string
    country: string
    region: string | null
    district: string | null
    community: string | null
    city_type: string
    city: string
    street: string
    street_type: string
    building: string
    unit_type: string | null
    unit_number: string | null
    notes: string | null
    is_personal: boolean,
    created_by: number,
    feedbacks: FeedbackShort[]
    global_code: string
}