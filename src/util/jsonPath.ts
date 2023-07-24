import { JSONPath } from 'jsonpath-plus'
import type { JSONValue } from './jsonOperations'
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

//NEW JSON-NETS 2.0

// TODO: not sure if I should pass JSON along as string or parsed
// for consistency and clear interfaces strings for now
// deviating from specification in diss, paths are normalised JSONPath filterExpression, not JSONPointer
export function checkSyntax(filterExpression: string) {
  try {
    const json: JSONValue = [];
    JSONPath({
      resultType: 'pointer',
      path: filterExpression,
      json,
    })
    return { isValid: true }
  } catch (error: any) {

    return { isValid: false, error}
  }
}

export function getPathExpressions(json: JSONValue, filterExpression: string) {
  // const json = JSON.parse(document)
  return JSONPath({
    resultType: 'pointer',
    path: filterExpression,
    json,
  })
}
export function isValidForFilterExpression(json: JSONValue, filterExpression: string) {
  const paths = getPathExpressions(json, filterExpression);
  return paths.length > 0;
}

