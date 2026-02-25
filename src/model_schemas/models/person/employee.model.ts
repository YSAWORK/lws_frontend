// .src/model_schemas/models/person/employee.model.ts

// IMPORT TOOLS
import type { EmailShort } from "@/model_schemas/models/components/email.model"
import type { PhoneShort } from "@/model_schemas/models/components/phone.model"
import type { AddressShort } from "@/model_schemas/models/components/address.model"
import type { FeedbackShort } from "@/model_schemas/models/feedback/feedback.model"
import type {AttorneyCommission} from "@/model_schemas/models/libraries/attorney_commissions.model";


// EMPLOYEE
// EMPLOYEE LIST
export interface EmployeeList {
    Id: number
    FullName: string
    Avatar: string | null
    Position: string
    IsAttorney: boolean
}

// EMPLOYEE FULL GET
export interface EmployeeFullGet {
    Id: number
    FullName: string

    TaxId: string | null
    Birthday: string | null
    Avatar: string | null
    Biography: string | null

    Position: string
    IsAttorney: boolean
    AttorneyCommission: string | null

    LicenseNumber: string | null
    LicenseDate: string | null
    LicenseCommission: string | null
    LicenseFile: string | null
    AttorneyUrl: string | null

    CertificateNumber: string | null
    CertificateDate: string | null
    CertificateCommission: string | null
    CertificateFile: string | null

    emails: EmailShort[] | null
    phones: PhoneShort[] | null
    addresses: AddressShort[] | null
    feedbacks: FeedbackShort[] | null
    global_code: string | null

    WebCourt: boolean | null
}