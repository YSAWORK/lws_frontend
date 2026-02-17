// .src/model_schemas/dto/components/phones.dto.ts

// IMPORT TOOLS
import { z } from "zod"

// PHONE SHORT
export const PhoneShortSchema = z.object({
    id: z.number(),
    phone_number: z.string(),
    notes: z.string().nullable(),
})

export type PhoneShortDTO = z.infer<typeof PhoneShortSchema>