import Ajv, { type ValidateFunction } from 'ajv'
import type { JSONObject, JSONValue } from './jsonOperations'

const ajv = new Ajv({ validateSchema: false })

/**
 * Validates a document against a JSON Schema.
 * @param {Object} data
 * @param {Object} schema
 * @return {Object}
 */
export function validate(document: Object, schema: Object) {
  try {
    const check = ajv.compile(schema)
    const valid = check(document)
    // if (!valid) {
      // console.log('document not valid')
      // console.log(check.errors)
    // }
    // TODO: try/catch necessary?
    return { isValid: valid, errors: check.errors }
  } catch (error: any) {
    return { isValid: false, errors: { message: error.message } }
  }
}

// /**
//  * Finds the first document in a given list that is
//  * valid against schema.
//  * @param {Array} list
//  * @param {Object} schema
//  * @return {Object}
//  */
// export function findValidDocument(list, schema) {
//   const document = list.find((doc) => {
//     const isValid = validate(doc, schema);
//     return isValid;
//   });
//
//   return document;
// };

// NEW JSON-NETS 2.0

export function validateSchema(schema: JSONObject) {
  const schemaValid = ajv.validateSchema(schema)

  if (schemaValid) {
    return { isValid: true }
  } else {
    return { isValid: false, error: ajv.errorsText(ajv.errors) }
  }

}
// expects a validated Schema!!
export function compileValidator(schema: JSONObject) {
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
  // const schemaCheck = checkSchema(schema);
  // if (!schemaCheck.schemaValid) {
    // return { isValid: false, schemaValid: true, error: schemaCheck.error}
  // } 
  try {
    check = ajv.compile(JSON.parse(schema));
  } catch (error: any) {
    // JSON syntax error in schema
    return { isValid: false, schemaValid: false, error: error.message }
  }


    
  const valid = check(JSON.parse(document));
  return { isValid: valid, schemaValid: true, error: ajv.errorsText(check.errors) }
}

// todo: maybe it makes sense to compile schema only once and store it in place
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
      // const check = 
      ajv.compile(JSON.parse(schema));
      return { schemaValid };
      // check(true);
    } catch (error: any) {
      return { schemaValid, error: error.message}
    }
  }
}