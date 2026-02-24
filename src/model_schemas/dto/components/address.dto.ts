// .src/model_schemas/dto/components/address.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {FeedbackShortSchema} from "@/model_schemas/dto/feedback/feedback.dto";

// ADDRESS SHORT
export const AddressShortSchema = z.object({
    id: z.number(),
    postal_code: z.string(),
    country: z.string(),
    region: z.string().nullable(),
    city_type: z.string(),
    city: z.string(),
    street: z.string(),
    street_type: z.string(),
    building: z.string(),
    apartment: z.string().nullable(),
    notes: z.string().nullable(),
    feedbacks: z.array(FeedbackShortSchema),
    global_code: z.string(),
})

export type AddressShortDTO = z.infer<typeof AddressShortSchema>