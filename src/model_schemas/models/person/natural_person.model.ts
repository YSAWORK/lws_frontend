// .src/model_schemas/dto/person/natural_person.model.ts

// IMPORT TOOLS
    import type { EmailShort } from "@/model_schemas/models/components/email.model"
    import type { PhoneShort } from "@/model_schemas/models/components/phone.model"
    import type { AddressShort } from "@/model_schemas/models/components/address.model"
    import type { DocumentModel } from "@/model_schemas/models/components/document.model"
    import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"

// NATURAL PERSON
    // NATURAL PERSON LIST
        export interface NaturalPersonList {
            id: number
            FullName: string
            Avatar: string | null
        }

    // NATURAL PERSON FULL GET
    export interface NaturalPersonFullGet {
        id: number
        FullName: string

        TaxId: string | null
        Passport: string | null
        Birthday: string | null
        Avatar: string | null
        Biography: string | null

        Employee: string

        emails: EmailShort[] | null
        phones: PhoneShort[] | null
        addresses: AddressShort[]
        documents: DocumentModel[]
        feedbacks: FeedbackShort[]
        notes: string | null
        created_by: number
        is_blocked: boolean
        is_personal: boolean
        global_code: string | null

        WebCourt: boolean | null
    }
