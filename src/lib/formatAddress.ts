// .src/lib/formatAddress.ts

/// IMPORT TOOLS
    import { AddressShortDTO } from "@/model_schemas/dto/components/address.dto"

//  Форматує адресу в 01001, Україна, Київська обл., м. Київ, вул. Хрещатик, 10, кв. 5
export function formatAddress(dto: AddressShortDTO): string {
    const parts: (string | null | undefined)[] = [
        dto.postal_code,
        dto.country,
        dto.region ? `${dto.region} обл.` : null,
        dto.district ? `${dto.district} р-н` : null,
        dto.community ? `${dto.community}` : null,
        dto.city_type && dto.city
            ? `${dto.city_type} ${dto.city}`
            : dto.city,
        dto.street_type && dto.street
            ? `${dto.street_type} ${dto.street}`
            : dto.street,
        dto.building,
        dto.unit_type && dto.unit_number
            ? `${dto.unit_type} ${dto.unit_number}`
            : null
    ]

    return parts
        .filter(Boolean)
        .join(", ")
}