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
            is_blocked: z.boolean(),
            created_by: z.number(),
            created_at: z.coerce.date(),
            updated_at: z.coerce.date(),
            global_code: z.string(),
        })

        export type DocumentDTO = z.infer<typeof DocumentFullSchema>


    /// SHORT SCHEMA
        export const DocumentCreateSchema = z.object({
            name: z.string(),
            extension: z.string().nullable(),
            date: z.string().nullable(),
            file: z.file().nullable(),
            notes: z.string().nullable(),
            is_personal: z.boolean(),
            is_blocked: z.boolean(),
            owner: OwnerSchema,
        })

        export type DocumentCreateDTO = z.infer<typeof DocumentCreateSchema>


    /// PATCH SCHEMA
        export const DocumentUpdateSchema = z.object({
            id: z.string(),
            name: z.string(),
            extension: z.string().nullable(),
            mime: z.string(),
            date: z.string().nullable(),
            size: z.number(),
            file: z.instanceof(File).nullable(),
            notes: z.string().nullable(),
            created_by: z.number(),
            is_personal: z.boolean(),
            is_blocked: z.boolean(),
            existing_file_url: z.string().nullable(),
        })

        export type DocumentUpdateDTO = z.infer<typeof DocumentUpdateSchema>

    /// MAP FOR UPDATE
        export function mapDocumentToEditDTO(document: DocumentDTO): DocumentUpdateDTO {
            return {
                id: String(document.id),
                name: document.name,
                extension: document.extension ?? null,
                mime: document.mime,
                date: document.date ? document.date.toISOString().slice(0, 10) : null,
                file: null,
                size: document.size,
                notes: document.notes,
                is_personal: document.is_personal,
                is_blocked: document.is_blocked,
                created_by: document.created_by,
                existing_file_url: document.file ?? null,
            }
        }
