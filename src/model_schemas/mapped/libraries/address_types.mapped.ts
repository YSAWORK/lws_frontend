// .src/model_schemas/mapped/libraries/address_types.mapped.ts

/// IMPORT TOOLS
import {AddressTypesDTO} from "@/model_schemas/dto/libraries/address_types.dto";
import {AddressTypes} from "@/model_schemas/models/libraries/address_types.model";
import {mapChoice} from "@/model_schemas/mapped/libraries/choice.mapped";
import {ChoiceDTO} from "@/model_schemas/dto/libraries/choice.dto";


export function mapAddressType(
    dto: AddressTypesDTO
): AddressTypes {
    return {
        city_type: dto.city_type.map(mapChoice),
        street_type: dto.street_type.map(mapChoice),
        unit_type: dto.unit_type.map(mapChoice),
    }
}