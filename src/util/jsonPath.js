import jsonpath from 'jsonpath';

/**
 * Filters a list of document based on a JSONPath-predicate.
 * @param {Array} documents list of documents to be filtered.
 * @param {String} expression expects a JSONPath-predicate.
 * @return {*}
 */
export function query(documents, expression) {
  const jsonPathString = '$..[?(' + expression + ')]';
  return jsonpath.query(documents, jsonPathString);
}
