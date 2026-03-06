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
        owner: OwnerSchema
    })

    export type EmailCreateDTO = z.infer<typeof EmailCreateSchema>