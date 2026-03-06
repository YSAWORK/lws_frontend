// .src/model_schemas/dto/components/phones.dto.ts

// IMPORT TOOLS
    import { z } from "zod"
    import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";
    import {OwnerSchema} from "@/model_schemas/dto/person/owner.dto";

// PHONE SHORT
    export const PhoneShortSchema = z.object({
        id: z.number(),
        phone_number: z.string(),
        notes: z.string().nullable(),
        feedbacks: z.array(FeedbackShortSchema),
        is_personal: z.boolean(),
        created_by: z.number(),
        global_code: z.string(),
    })

    export type PhoneShortDTO = z.infer<typeof PhoneShortSchema>

// EMAIL PHONE
    export const PhoneCreateSchema = z.object({
        phone_number: z.string(),
        is_personal: z.boolean(),
        notes: z.string().nullable().optional(),
        owner: OwnerSchema
    })

    export type PhoneCreateDTO = z.infer<typeof PhoneCreateSchema>