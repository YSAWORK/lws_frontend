// src/model_schemas/mapped/libraries/attorney_commissions.mapped.ts

/// IMPORT TOOLS
    import type { AttorneyCommissionDTO } from "@/model_schemas/dto/libraries/attorney_commissions.dto.ts"
    import type { AttorneyCommission } from "@/model_schemas/models/libraries/attorney_commissions.model.ts"

/// FUNCTIONS
    export function mapAttorneyCommission(
        dto: AttorneyCommissionDTO
    ): AttorneyCommission {
        return {
            value: dto.value,
            label: dto.label,
        }
    }