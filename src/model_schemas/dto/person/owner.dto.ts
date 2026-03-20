// .src/model_schemas/dto/person/owner.dto.ts

/// IMPORT TOOLS
import { z } from "zod"

/// OWNER
    export const OwnerSchema = z.object({
        id: z.number(),
        key: z.enum(["app_person.Person",]),
    })
    export type OwnerDTO = z.infer<typeof OwnerSchema>
