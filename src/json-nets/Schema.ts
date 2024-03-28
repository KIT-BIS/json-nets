// a separate Schema class - currently using JSON schema
// but I try to encapsulate as much as possible to enable
import type { JSONMarking } from "@/util/jsonOperations"
import { compileValidator, unCacheSchema, validateJSON } from "@/util/jsonSchema"
import type { ValidateFunction } from "ajv"
import type { JSONSchema7 } from "json-schema"

export interface CheckResult {
	isValid: boolean
	error: string | null
}

/**
 * Handles the schema of a place.
 */
export class Schema {
	private ref: string;
	private _schema: JSONSchema7
	private validator: ValidateFunction

	// expects a checked Schema!
	constructor(id: string, schema: JSONSchema7) {
		this.ref = id;
		this._schema = schema;
		this.schema['$id'] = id; // just to ensure id is available
		this.validator = compileValidator(schema);
	}

	update(schema: JSONSchema7) {
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