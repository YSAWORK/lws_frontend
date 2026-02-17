// src/model_schemas/mapped/components/email.mapped.ts

// IMPORT TOOLS
import type { EmailShortDTO } from "@/model_schemas/dto/components/email.dto"
import type { EmailShort } from "@/model_schemas/models/components/email.model"

// EMAIL
export function mapEmailShort (dto: EmailShortDTO): EmailShort {
    return {
        id: dto.id,
        email: dto.email,
        notes: dto.notes,
    }
}