// .src/model_schemas/dto/components/email.dto.ts

// IMPORT TOOLS
import { z } from "zod"

// EMAIL SHORT
export const EmailShortSchema = z.object({
    id: z.number(),
    email: z.string(),
    notes: z.string().nullable(),
})

export type EmailShortDTO = z.infer<typeof EmailShortSchema>