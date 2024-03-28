/**
 * Provides utility functions to work with JSON Schema.
 */
import Ajv, { type ValidateFunction } from 'ajv'
import type { JSONValue } from './jsonOperations'
import type { JSONSchema7 } from 'json-schema';

const ajv = new Ajv({ validateSchema: false })


// expects a validated Schema!
export function compileValidator(schema: JSONSchema7) {
  const validator = ajv.compile(schema);
  return validator;
}

export function validateJSON(json: JSONValue, validator: ValidateFunction) {
  const isValid = validator(json)
  return { isValid, error: ajv.errorsText(validator.errors) }

}

export function unCacheSchema(id: string) {
  ajv.removeSchema(id);
}

/**
 * Validates a document against a JSON Schema.
 */
export function validateDocumentOld(document: string, schema: string) {
  let check, json;

  // check if document is valid JSON
  try {
    json = JSON.parse(document);
  } catch (error: any) {
    // JSON syntax error in document
    return { isValid: false, schemaValid: true, error: error.message }
  }

  // check if schema is valid
  try {
    check = ajv.compile(JSON.parse(schema));
  } catch (error: any) {
    // JSON syntax error in schema
    return { isValid: false, schemaValid: false, error: error.message }
  }

  const valid = check(JSON.parse(document));
  return { isValid: valid, schemaValid: true, error: ajv.errorsText(check.errors) }
}

// Todo: maybe it makes sense to compile schema only once and store it in place
// would maybe allow for some better structure here, as one can be sure
// that a compiled schema is correct
export function checkSchema(schema: string) {
  let schemaValid;
  try {
    schemaValid = ajv.validateSchema(JSON.parse(schema))
  } catch (error: any) {
    // JSON parsing error
    return { schemaValid: false, error: error.message }
  }

  if (schemaValid) {
    return { schemaValid };
  } else {
    try {
      // schema is invalid so this will force an error
      ajv.compile(JSON.parse(schema));
      return { schemaValid };
    } catch (error: any) {
      return { schemaValid, error: error.message}
    }
  }
}