// .src/components/modals/global/changeOwner/changeOwnerRegistry.ts

export type ChangeOwnerModel = {
    id: number | string
    created_by: number
}

export type ChangeOwnerRegistryItem<T = any> = {
    url: (id: ChangeOwnerModel["id"]) => string
    title: string
    display: (item: T) => string
}

export const ChangeOwnerRegistry = {
    emails: {
        url: (id: ChangeOwnerModel["id"]) => `/components/email/${id}/`,
        title: "Змінити відповідального для email",
        display: (item: any) => item.email ?? "",
    },
    phones: {
        url: (id: ChangeOwnerModel["id"]) => `/components/phone/${id}/`,
        title: "Змінити відповідального для телефону",
        display: (item: any) => item.phone_number ?? "",
    },
    addresses: {
        url: (id: ChangeOwnerModel["id"]) => `/components/address/${id}/`,
        title: "Змінити відповідального для адреси",
        display: (item: any) => item.full_address ?? "",
    },
    documents: {
        url: (id: ChangeOwnerModel["id"]) => `/components/document/${id}/`,
        title: "Змінити відповідального для документа",
        display: (item: any) => item.name ?? "",
    },
    natural_person: {
        url: (id: ChangeOwnerModel["id"]) => `/person/natural_person/${id}/`,
        title: "Змінити відповідального фізичної особи:",
        display: (e: any) => e.FullName ?? "",
    },
} as const

export type ChangeOwnerKey = keyof typeof ChangeOwnerRegistry
