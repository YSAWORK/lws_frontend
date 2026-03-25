// .src/model_schemas/dto/components/phones.dto.ts

// IMPORT TOOLS
    import { z } from "zod"
    import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";
    import {OwnerSchema} from "@/model_schemas/dto/person/owner.dto";
import {EmailCreateSchema} from "@/model_schemas/dto/components/email.dto";

// PHONE SHORT
    export const PhoneShortSchema = z.object({
        id: z.number(),
        phone_number: z.string(),
        notes: z.string().nullable(),
        feedbacks: z.array(FeedbackShortSchema),
        is_personal: z.boolean(),
        is_blocked: z.boolean(),
        created_by: z.number(),
        global_code: z.string(),
    })

    export type PhoneShortDTO = z.infer<typeof PhoneShortSchema>

// EMAIL PHONE
    export const PhoneCreateSchema = z.object({
        phone_number: z.string(),
        is_personal: z.boolean(),
        is_blocked: z.boolean(),
        notes: z.string().nullable().optional(),
        owner: OwnerSchema
    }).transform((data) => ({
        phone_number: data.phone_number,
        is_personal: data.is_personal,
        is_blocked: data.is_blocked,
        notes: data.notes,
        owner_id: data.owner.id,
        owner_key: data.owner.key,
    }))

    export type PhoneCreateFormDTO = z.input<typeof PhoneCreateSchema>
    export type PhoneCreateDTO = z.output<typeof PhoneCreateSchema>