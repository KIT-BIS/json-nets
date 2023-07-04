import { JSONPath } from 'jsonpath-plus'

/**
 * Filters a list of documents based on a JSONPath-predicate.
 * @param {Array} documents list of documents to be filtered.
 * @param {String} expression expects a JSONPath-predicate.
 * @return {*}
 */
export function query(documents: Array<any>, expression: String) {
  let jsonPathString = ''

  if (expression === '') {
    jsonPathString = '$.*'
  } else {
    jsonPathString = '$.[' + expression + ']'
  }

  return JSONPath({
    path: jsonPathString,
    json: documents
  })
  //return jsonpath.query(documents, jsonPathString);
}
