// a separate Schema class - currently using JSON schema
// but I try to encapsulate as much as possible to enable
import type { JSONMarking, JSONObject } from "@/util/jsonOperations"
import { compileValidator, unCacheSchema, validateJSON } from "@/util/jsonSchema"
import type { ValidateFunction } from "ajv"

export interface CheckResult {
    isValid: boolean
    error: string | null
}

// different Schema languages in the future
export class Schema {
    private ref: string;
    private _schema: JSONObject
    private validator: ValidateFunction 

    // expects a checked Schema!
    constructor(id: string, schema: JSONObject) {
        this.ref = id;
        this._schema = schema;
        this.schema['$id'] = id; // just to ensure id is available
        this.validator = compileValidator(schema);
    }

    update(schema: JSONObject) {
        unCacheSchema(this.ref)
        this._schema = schema;
        this.schema['$id'] = this.ref; // just do ensure id is available
        this.validator = compileValidator(schema);
    }

    validateMarking(marking: JSONMarking): CheckResult {
        return validateJSON(marking, this.validator)
    }

    get schema() {
        return this._schema
    }
}