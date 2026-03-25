// .src/model_schemas/dto/components/email.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";
import {OwnerSchema} from "@/model_schemas/dto/person/owner.dto";

// EMAIL SHORT
    export const EmailShortSchema = z.object({
        id: z.number(),
        email: z.string(),
        notes: z.string().nullable(),
        is_personal: z.boolean(),
        is_blocked: z.boolean(),
        created_by: z.number(),
        feedbacks: z.array(FeedbackShortSchema),
        global_code: z.string(),
    })

    export type EmailShortDTO = z.infer<typeof EmailShortSchema>


// EMAIL CREATE
    export const EmailCreateSchema = z.object({
        email: z.string(),
        notes: z.string().nullable().optional(),
        is_personal: z.boolean(),
        is_blocked: z.boolean(),
        owner: OwnerSchema,
    }).transform((data) => ({
        email: data.email,
        is_personal: data.is_personal,
        is_blocked: data.is_blocked,
        notes: data.notes,
        owner_id: data.owner.id,
        owner_key: data.owner.key,
    }))

export type EmailCreateFormDTO = z.input<typeof EmailCreateSchema>
export type EmailCreateDTO = z.output<typeof EmailCreateSchema>