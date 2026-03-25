// src/model_schemas/models/components/documents.model.ts

// IMPORT TOOLS

export interface DocumentModel {
    id: number
    name: string
    extension: string
    mime: string
    date: Date | null
    size: number
    file: string | null
    notes: string | null
    is_personal: boolean
    is_blocked: boolean
    created_by: number | null
    created_at: Date
    updated_at: Date
    global_code: string
}