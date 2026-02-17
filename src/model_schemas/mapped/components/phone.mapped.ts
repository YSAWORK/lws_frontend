// src/model_schemas/mapped/components/email.mapped.ts

// IMPORT TOOLS
import type { PhoneShortDTO } from "@/model_schemas/dto/components/phone.dto"
import type { PhoneShort } from "@/model_schemas/models/components/phone.model"

// EMAIL
export function mapPhoneShort (dto: PhoneShortDTO): PhoneShort {
    return {
        id: dto.id,
        phone_number: dto.phone_number,
        notes: dto.notes,
    }
}