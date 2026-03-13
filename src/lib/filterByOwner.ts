// src/

type OwnerItem = {
    is_personal?: boolean
    created_by?: number
}

export function filterComponentByOwner<T extends OwnerItem>(
    items: T[] | undefined,
    ownerId?: number,
): T[] {
    if (!items) return []

    console.log("ownerId:", ownerId, typeof ownerId)
    console.log("items:", items)

    return items.filter(item => {
        console.log("created_by:", item.created_by, typeof item.created_by, "is_personal:", item.is_personal)
        return !item.is_personal || item.created_by === ownerId
    })
}