// src/model_schemas/mapped/components/document.mapped.ts

// IMPORT TOOLS
    import type { DocumentModel } from "@/model_schemas/models/components/document.model"
    import type { DocumentDTO } from "@/model_schemas/dto/components/document.dto"

export function mapDocument(dto: DocumentDTO): DocumentModel {
    return {
        id: dto.id,
        name: dto.name,
        extension: dto.extension,
        mime: dto.mime,
        date: dto.date ? new Date(dto.date) : null,
        size: dto.size,
        file: dto.file,
        notes: dto.notes,
        is_personal: dto.is_personal,
        is_blocked: dto.is_blocked,
        created_by: dto.created_by,
        created_at: new Date(dto.created_at),
        updated_at: new Date(dto.updated_at),
        global_code: dto.global_code,
    }
}