// src/model_schemas/mapped/libraries/choice.mapped.ts

/// IMPORT TOOLS
    import { ChoiceDTO } from "@/model_schemas/dto/libraries/choice.dto";
    import type { Choice } from "@/model_schemas/models/libraries/choice.model.ts"

/// FUNCTIONS
    export function mapChoice(
        dto: ChoiceDTO
    ): Choice {
        return {
            value: dto.value,
            label: dto.label,
        }
    }