// .src/model_schemas/dto/components/address.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";
import {OwnerSchema} from "@/model_schemas/dto/person/owner.dto";

// ADDRESS SHORT
export const AddressShortSchema = z.object({
    id: z.number(),
    postal_code: z.string(),
    country: z.string(),
    region: z.string().nullable(),
    district: z.string().nullable(),
    community: z.string().nullable(),
    city_type: z.string(),
    city: z.string(),
    street: z.string(),
    street_type: z.string(),
    building: z.string(),
    unit_type: z.string().nullable(),
    unit_number: z.string().nullable(),
    notes: z.string().nullable(),
    is_personal: z.boolean(),
    created_by: z.number(),
    feedbacks: z.array(FeedbackShortSchema),
    global_code: z.string(),
})

export type AddressShortDTO = z.infer<typeof AddressShortSchema>

// ADDRESS CREATE
export const AddressCreateSchema = z.object({
    postal_code: z.string().min(1, "Заповніть обов'язкове поле індексу"),
    country: z.string().min(1, "Заповніть обов'язкове поле країни"),
    region: z.string().nullable(),
    district: z.string().nullable(),
    community: z.string().nullable(),
    city_type: z.string().min(1, "Заповніть обов'язкове поле"),
    city: z.string().min(1, "Заповніть обов'язкові поля: тип та назву населеного пункту"),
    street: z.string().min(1, "Заповніть обов'язкові поля: тип, назву вулиці та номер будівлі"),
    street_type: z.string().min(1, "Заповніть обов'язкове поле"),
    building: z.string().min(1, "Заповніть обов'язкове поле"),
    unit_type: z.string().nullable(),
    unit_number: z.string().nullable(),
    notes: z.string().nullable().optional(),
    is_personal: z.boolean(),
    owner: OwnerSchema
})

export type AddressCreateDTO = z.infer<typeof AddressCreateSchema>