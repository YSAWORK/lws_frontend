// src/model_schemas/dto/app/config.dto.ts

import { z } from "zod"

// DTO схема для налаштувань App
export const AppConfigSchema = z.object({
    appName: z.string().min(1),
    apiBaseUrl: z.string().min(1),
    environment: z.enum(["development", "staging", "production"]),
    debug: z.boolean(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>