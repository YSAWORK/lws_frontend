// .src/model_schemas/dto/person/employee.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import { EmailShortSchema } from "@/model_schemas/dto/components/email.dto"
import { PhoneShortSchema } from "@/model_schemas/dto/components/phone.dto"
import { AddressShortSchema } from "@/model_schemas/dto/components/address.dto"

// EMPLOYEE
// EMPLOYEE SHORT
export const EmployeeSchema = z.object({
    id: z.number(),
    last_name: z.string(),
    first_name: z.string(),
    surname: z.string(),
    avatar: z.string().nullable(),
    position: z.string(),
    is_attorney: z.boolean(),
})

export type EmployeeDTO = z.infer<typeof EmployeeSchema>


// EMPLOYEE LIST
export const EmployeeListSchema = z.array(EmployeeSchema)
export type EmployeeListDTO = z.infer<typeof EmployeeListSchema>


//EMPLOYEE FULL
export const EmployeeFullGetSchema = z.object({
    id: z.number(),

    first_name: z.string(),
    last_name: z.string(),
    surname: z.string().nullable(),

    register_id: z.string(),
    date_birth: z.string().nullable(),
    avatar: z.string().nullable(),
    info: z.string().nullable(),

    position: z.string(),
    is_attorney: z.boolean(),
    attorney_commission: z.string().nullable(),

    series_number_license: z.string().nullable(),
    date_issued_license: z.string().nullable(),
    issuing_organization_license: z.string().nullable(),
    attorney_license_file: z.string().nullable(),
    attorney_register_url: z.string().nullable(),

    series_number_certificate: z.string().nullable(),
    date_issued_certificate: z.string().nullable(),
    issuing_organization_certificate: z.string().nullable(),
    attorney_certificate_file: z.string().nullable(),

    emails: z.array(EmailShortSchema),
    phones: z.array(PhoneShortSchema),
    addresses: z.array(AddressShortSchema),

    is_web_court: z.boolean(),

})

export type EmployeeFullGetDTO = z.infer<typeof EmployeeFullGetSchema>
