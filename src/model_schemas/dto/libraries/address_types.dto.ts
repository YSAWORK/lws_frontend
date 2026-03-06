// src/model_schemas/dto/libraries/address_types.dto.ts

/// IMPORT TOOLS
import { ChoiceDTO } from "@/model_schemas/dto/libraries/choice.dto";

/// SCHEMAs
export interface AddressTypesDTO {
    city_type: ChoiceDTO[]
    street_type: ChoiceDTO[]
    unit_type: ChoiceDTO[]
}