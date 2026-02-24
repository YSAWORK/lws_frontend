// src/model_schemas/mapped/person/employee.mapped.ts


// IMPORT TOOLS
import type {EmployeeDTO} from "@/model_schemas/dto/person/employee.dto";
import type {EmployeeList} from "@/model_schemas/models/person/employee.model";
import type {EmployeeFullGetDTO} from "@/model_schemas/dto/person/employee.dto";
import type {EmployeeFullGet} from "@/model_schemas/models/person/employee.model";
import { mapAddressShort } from "@/model_schemas/mapped/components/address.mapped"
import { mapEmailShort } from "@/model_schemas/mapped/components/email.mapped"
import { mapPhoneShort } from "@/model_schemas/mapped/components/phone.mapped"
import {mapFeedbackShort} from "@/model_schemas/mapped/feedback/feedback.mapped";


// EMPLOYEE MAP
// EMPLOYEE SHORT MAP
export function mapEmployee(dto: EmployeeDTO): EmployeeList {
    return {
        Id: dto.id,
        FullName: `${dto.last_name} ${dto.first_name} ${dto.surname}`,
        Avatar: dto.avatar ?? null,
        Position: dto.position,
        IsAttorney: dto.is_attorney,
    }
}

// EMPLOYEE FULL MAP
export function mapEmployeeFullGet(dto: EmployeeFullGetDTO): EmployeeFullGet {
    const fullName = [dto.last_name, dto.first_name, dto.surname].filter(Boolean).join(" ")

    return {
        Id: dto.id,
        FullName: fullName,

        TaxId: dto.register_id ?? null,
        Birthday: dto.date_birth,
        Avatar: dto.avatar,
        Biography: dto.info,

        Position: dto.position,
        IsAttorney: dto.is_attorney,
        AttorneyCommission: dto.attorney_commission,

        LicenseNumber: dto.series_number_license,
        LicenseDate: dto.date_issued_license,
        LicenseCommission: dto.issuing_organization_license,
        LicenseFile: dto.attorney_license_file,
        AttorneyUrl: dto.attorney_register_url,

        CertificateNumber: dto.series_number_certificate,
        CertificateDate: dto.date_issued_certificate,
        CertificateCommission: dto.issuing_organization_certificate,
        CertificateFile: dto.attorney_certificate_file,

        emails: dto.emails.map(mapEmailShort),
        phones: dto.phones.map(mapPhoneShort),
        addresses: dto.addresses.map(mapAddressShort),
        feedbacks: dto.feedbacks.map(mapFeedbackShort),

        WebCourt: dto.is_web_court,
        global_code: dto.global_code
    }
}