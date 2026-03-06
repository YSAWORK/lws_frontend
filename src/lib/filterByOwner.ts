// src/

type OwnerItem = {
    is_personal?: boolean
    created_by?: number
}


// FILTER COMPONENTS
export function filterComponentByOwner<T extends OwnerItem>(
    items: T[] | undefined,
    ownerId?: number
): T[] {
    if (!items) return []

    return items.filter(
        item => !item.is_personal || item.created_by === ownerId
    )
}