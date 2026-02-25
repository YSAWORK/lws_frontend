// src/model_schemas/dto/libraries/attorney_commissions.dto.ts

/// IMPORT TOOLS
    import { z } from "zod"

/// SCHEMAs
    export interface AttorneyCommissionDTO {
        value: string
        label: string
    }
