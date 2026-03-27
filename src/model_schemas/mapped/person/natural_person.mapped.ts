// .src/model_schemas/dto/person/natural_person.mapped.ts

// IMPORT TOOLS
    import {NaturalPersonDTO, NaturalPersonListSchema} from "@/model_schemas/dto/person/natural_person.dto";
    import type {NaturalPersonList} from "@/model_schemas/models/person/natural_person.model";
    import type {NaturalPersonFullGetDTO, NaturalPersonEditDTO} from "@/model_schemas/dto/person/natural_person.dto";
    import type {NaturalPersonFullGet} from "@/model_schemas/models/person/natural_person.model";
    import { mapAddressShort } from "@/model_schemas/mapped/components/address.mapped"
    import { mapEmailShort } from "@/model_schemas/mapped/components/email.mapped"
    import { mapPhoneShort } from "@/model_schemas/mapped/components/phone.mapped"
    import { mapDocument } from "@/model_schemas/mapped/components/document.mapped"
    import {mapFeedbackShort} from "@/model_schemas/mapped/feedback/feedback.mapped";


/// NATURAL PERSON MAP
    // NATURAL PERSON SHORT MAP
    export function mapNaturalPerson(dto: NaturalPersonDTO): NaturalPersonList {
        return {
            id: dto.id,
            FullName: `${dto.last_name} ${dto.first_name} ${dto.surname}`,
            Avatar: dto.avatar ?? null,
        }
    }

    // NATURAL PERSON FULL MAP
    export function mapNaturalPersonFullGet(dto: NaturalPersonFullGetDTO): NaturalPersonFullGet {
        const fullName = [dto.last_name, dto.first_name, dto.surname].filter(Boolean).join(" ")

        return {
            id: dto.id,
            FullName: fullName,

            TaxId: dto.register_id ?? null,
            Passport: dto.passport ?? null,
            Birthday: dto.date_birth,
            Avatar: dto.avatar,
            Biography: dto.info,

            Employee: dto.employee_name,

            emails: dto.emails.map(mapEmailShort),
            phones: dto.phones.map(mapPhoneShort),
            addresses: dto.addresses.map(mapAddressShort),
            documents: dto.documents.map(mapDocument),
            feedbacks: dto.feedbacks.map(mapFeedbackShort),

            WebCourt: dto.is_web_court,
            notes: dto.notes,
            created_by: dto.created_by,
            is_blocked: dto.is_blocked,
            is_personal: dto.is_personal,
            global_code: dto.global_code
        }
    }

// MAPPER FROM FULL MODEL TO EDIT MODEL
export function mapNaturalPersonFullToEditDTO(
    person: NaturalPersonFullGetDTO
): NaturalPersonEditDTO {
    return {
        id: String(person.id),
        first_name: person.first_name ?? "",
        last_name: person.last_name ?? "",
        surname: person.surname ?? "",
        register_id: person.register_id ?? "",
        date_birth: person.date_birth ?? "",
        passport: person.passport ?? "",
        avatar: person.avatar ?? null,
        avatar_file: null
    }
}
