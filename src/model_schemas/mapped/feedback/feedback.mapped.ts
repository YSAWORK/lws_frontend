// src/model_schemas/mapped/feedback/feedback.mapped.ts

// IMPORT TOOLS
import type { FeedbackShortDTO } from "@/model_schemas/dto/feedback/feedback.dto"
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// EMAIL
export function mapFeedbackShort (dto: FeedbackShortDTO): FeedbackShort {
    return {
        id: dto.id,
        created_at: dto.created_at,
        notes: dto.notes,
    }
}