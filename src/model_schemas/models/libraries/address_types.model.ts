// .src/model_schemas/models/libraries/address_types.model.ts

/// IMPORT TOOLS
    import {Choice} from "@/model_schemas/models/libraries/choice.model";


export interface AddressTypes {
    city_type: Choice[]
    street_type: Choice[]
    unit_type: Choice[]
}
