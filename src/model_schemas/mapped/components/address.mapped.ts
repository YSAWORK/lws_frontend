// src/model_schemas/mapped/components/address.mapped.ts

// IMPORT TOOLS
import type { AddressShortDTO } from "@/model_schemas/dto/components/address.dto"
import type { AddressShort } from "@/model_schemas/models/components/address.model"
import {mapFeedbackShort} from "@/model_schemas/mapped/feedback/feedback.mapped";

// ADDRESS SHORT
export function mapAddressShort(dto: AddressShortDTO): AddressShort {
    return {
        id: dto.id,
        postal_code: dto.postal_code,
        country: dto.country,
        region: dto.region ?? null,
        district: dto.district ?? null,
        community: dto.community ?? null,
        city_type: dto.city_type,
        city: dto.city,
        street: dto.street,
        street_type: dto.street_type,
        building: dto.building,
        unit_type: dto.unit_type ?? null,
        unit_number: dto.unit_number ?? null,
        notes: dto.notes ?? null,
        is_personal: dto.is_personal,
        created_by: dto.created_by,
        feedbacks: dto.feedbacks.map(mapFeedbackShort),
        global_code: dto.global_code
    }
}