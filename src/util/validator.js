import Ajv from 'ajv';

const ajv = new Ajv();

/**
 * Validates a document against a JSON Schema.
 * @param {Object} data
 * @param {Object} schema
 * @return {Boolean}
 */
export function validate(data, schema) {
  const check = ajv.compile(schema);
  const valid = check(data);
  if (!valid) {
    console.log('document not valid');
    console.log(check.errors);
  }
  return valid;
}
