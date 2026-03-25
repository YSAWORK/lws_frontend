// .src/model_schemas/dto/person/natural_person.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import { EmailShortSchema } from "@/model_schemas/dto/components/email.dto"
import { PhoneShortSchema } from "@/model_schemas/dto/components/phone.dto"
import { AddressShortSchema } from "@/model_schemas/dto/components/address.dto"
import { DocumentFullSchema } from "@/model_schemas/dto/components/document.dto"
import { FeedbackShortSchema } from "@/model_schemas/dto/feedback/feedback.dto"

// NATURAL PERSON
// NATURAL PERSON SHORT
export const NaturalPersonSchema = z.object({
    id: z.number(),
    last_name: z.string(),
    first_name: z.string(),
    surname: z.string(),
    avatar: z.string().nullable(),
})

export type NaturalPersonDTO = z.infer<typeof NaturalPersonSchema>


// NATURAL PERSON LIST
export const NaturalPersonListSchema = z.array(NaturalPersonSchema)
export type NaturalPersonListDTO = z.infer<typeof NaturalPersonListSchema>


// NATURAL PERSON FULL
export const NaturalPersonFullGetSchema = z.object({
    id: z.number(),

    first_name: z.string(),
    last_name: z.string(),
    surname: z.string().nullable(),

    register_id: z.string(),
    passport: z.string().nullable(),
    date_birth: z.string().nullable(),
    avatar: z.string().nullable(),
    info: z.string().nullable(),

    employee_name: z.string(),

    emails: z.array(EmailShortSchema),
    phones: z.array(PhoneShortSchema),
    addresses: z.array(AddressShortSchema),
    documents: z.array(DocumentFullSchema),
    feedbacks: z.array(FeedbackShortSchema),

    is_web_court: z.boolean(),
    notes: z.string().nullable(),
    global_code: z.string(),
})

export type NaturalPersonFullGetDTO = z.infer<typeof NaturalPersonFullGetSchema>


// NATURAL PERSON EDIT
export const NaturalPersonEditSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    surname: z.string().nullable().optional(),
    register_id: z.string().nullable().optional(),
    passport: z.string().nullable().optional(),
    date_birth: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    avatar_file: z.file().optional().nullable(),
})

export type NaturalPersonEditDTO = z.infer<typeof NaturalPersonEditSchema>