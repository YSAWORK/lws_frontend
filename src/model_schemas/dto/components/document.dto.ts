// .src/model_schemas/dto/components/document.dto.ts

// IMPORT TOOLS
import { z } from "zod"
import {OwnerSchema} from "@/model_schemas/dto/person/owner.dto";

// DOCUMENT
    /// FULL SCHEMA
        export const DocumentFullSchema = z.object({
            id: z.number(),
            name: z.string(),
            extension: z.string(),
            mime: z.string(),
            date: z.coerce.date(),
            size: z.number(),
            file: z.string().nullable(),
            notes: z.string().nullable(),
            is_personal: z.boolean(),
            created_by: z.number().nullable(),
            created_at: z.coerce.date(),
            updated_at: z.coerce.date(),
            global_code: z.string(),
        })

        export type DocumentDTO = z.infer<typeof DocumentFullSchema>


    /// SHORT SCHEMA
        export const DocumentShortSchema = z.object({
            id: z.number(),
            name: z.string(),
            extension: z.string(),
            date: z.string().nullable(),
            size: z.number(),
            notes: z.string().nullable(),
            is_personal: z.boolean(),
            created_by: z.number().nullable(),
        })

        export type DocumentShortDTO = z.infer<typeof DocumentShortSchema>
