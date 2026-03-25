// src/model_schemas/mapped/components/email.mapped.ts

// IMPORT TOOLS
import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"
import type { EmailShort } from "@/model_schemas/models/components/email.model"
import {mapFeedbackShort} from "@/model_schemas/mapped/feedback/feedback.mapped";

// EMAIL
export function mapEmailShort (dto: EmailShortDTO): EmailShort {
    return {
        id: dto.id,
        email: dto.email,
        notes: dto.notes,
        is_personal: dto.is_personal,
        is_blocked: dto.is_blocked,
        created_by: dto.created_by,
        feedbacks: dto.feedbacks.map(mapFeedbackShort),
        global_code: dto.global_code,
    }
}