import Ajv from 'ajv';

const ajv = new Ajv();

/**
 * Validates a document against a JSON Schema.
 * @param {Object} data
 * @param {Object} schema
 * @return {Object}
 */
export function validate(data, schema) {
  try {
    const check = ajv.compile(schema);
    const valid = check(data);
    if (!valid) {
      console.log('document not valid');
      console.log(check.errors);
    }
    return {isValid: valid, errors: check.errors};
  } catch (error) {
    return {isValid: false, errors: {message: error.message}};
  }
}

/**
 * Finds the first document in a given list that is
 * valid against schema.
 * @param {Array} list
 * @param {Object} schema
 * @return {Object}
 */
export function findValidDocument(list, schema) {
  const document = list.find((doc) => {
    const isValid = validate(doc, schema);
    return isValid;
  });

  return document;
};

/**
 * Validate the name of a place.
 * Check if place name is unique.
 * @param {String} name - Name of the place
 * @param {Array} places - List of places
 * @return {Boolean}
 */
export function validatePlaceName(name, places) {
  const place = places.find((place) => place.name === name);
  if (place) {
    return false;
  }
  return true;
}
