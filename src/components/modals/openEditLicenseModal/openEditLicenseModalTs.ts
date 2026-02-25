// src/components/modals/openEditLicenseModal/openEditLicenseModalTs.ts

/// IMPORT TOOLS
    import api from "@/api"
    import { createApp, h } from "vue"
    import EditLicenseModal from "@/components/modals/openEditLicenseModal/openEditLicenseModalVue.vue"
    import { AttorneyCommissionDTO } from "@/model_schemas/dto/libraries/attorney_commissions.dto"
    import { mapAttorneyCommission } from "@/model_schemas/mapped/libraries/attorney_commissions.mapped"

/// TYPEs
    export type CommissionOption = { value: string; label: string }
    export type LicensePayload = {
        Number: string | null
        Date: string | null // ISO: YYYY-MM-DD
        Commission: string | null
        File: string | null
    }
    export type LicenseFieldMap = {
        number: string
        date: string
        commission: string
        file: string
    }

/// FUNCTIONS
    // Отримати значення AttorneyCommissions
        let commissionsCache: CommissionOption[] | null = null
        let commissionsPromise: Promise<CommissionOption[]> | null = null

        async function fetchAttorneyCommissions(): Promise<CommissionOption[]> {
            if (commissionsCache) return commissionsCache
            if (commissionsPromise) return commissionsPromise

            commissionsPromise = api
                .get<AttorneyCommissionDTO[]>("/libraries/attorney_commissions/")
                .then((r) => {
                    const mapped = r.data.map(mapAttorneyCommission) as CommissionOption[]
                    commissionsCache = mapped
                    return mapped
                })
                .finally(() => (commissionsPromise = null))

            return commissionsPromise
        }

        // Рендер модалки
        export function openEditLicenseModal(opts: {
            title?: string
            employeeId: number
            current: LicensePayload
            fieldMap: LicenseFieldMap
            commissionOptions?: CommissionOption[]
            onSaved?: () => Promise<void> | void
        }): void {
            const host = document.createElement("div")
            document.body.appendChild(host)

            ;(async () => {
                const commissionOptions =
                    opts.commissionOptions ?? (await fetchAttorneyCommissions())

                const app = createApp({
                    render() {
                        return h(EditLicenseModal, {
                            title: opts.title ?? "Редагувати дані",
                            employeeId: opts.employeeId,
                            current: opts.current,
                            fieldMap: opts.fieldMap,
                            commissionOptions,
                            onClose: () => {
                                app.unmount()
                                host.remove()
                            },
                            onSaved: async () => {
                                await opts.onSaved?.()
                                app.unmount()
                                host.remove()
                            },
                        })
                    },
                })

                app.mount(host)
            })().catch(() => {
                host.remove()
            })
        }