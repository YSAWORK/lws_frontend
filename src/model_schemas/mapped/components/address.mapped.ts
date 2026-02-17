// src/model_schemas/mapped/components/address.mapped.ts

// IMPORT TOOLS
import type { AddressShortDTO } from "@/model_schemas/dto/components/address.dto"
import type { AddressShort } from "@/model_schemas/models/components/address.model"

// ADDRESS SHORT
export function mapAddressShort(dto: AddressShortDTO): AddressShort {
    const parts = [
        dto.postal_code,
        dto.country,
        dto.region ? `${dto.region} обл.` : null,
        `${dto.city_type} ${dto.city}`,
        `${dto.street_type} ${dto.street}`,
        dto.building,
        dto.apartment ? `кв. ${dto.apartment}` : null,
    ]

    return {
        id: dto.id,
        address: parts.filter(Boolean).join(", "),
        notes: dto.notes ?? null,
    }
}