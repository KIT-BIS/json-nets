// TODO: jsonnet is loaded as additional library from public folder
// not nice, but explicitly importing it causes vue build process to complain
// there doesn't seem to be another up to date npm package as alternative

import type { JSONValue } from "./jsonOperations"


/**
 * Returns a Jsonnet-snippet as string value
 * where the values of the given document are assigned
 * to variables whose names correspond to the document
 * fields.
 * @param {Object} documents
 * @return {String}
 */
export function jsonnetify(documents: Object) {
// export function variablifyDocuments(documents) {
  let jsonnetString = ''
  for (const [key, value] of Object.entries(documents)) {
    jsonnetString += `local ${key} = ${JSON.stringify(value)}; \n`
  }

  return jsonnetString
}

export type EvaluationResult = {
  hasError: boolean,
  evaluation: string 
}
export function evaluateExpression(jsonnetExpression: string, variables: Record<string, JSONValue> = {}, reference = ''): EvaluationResult {
  const variableString = jsonnetify(variables)
  jsonnetExpression = variableString + jsonnetExpression;
  // console.log(jsonnetExpression)

  try {
    //@ts-ignore
    const result = jsonnet.EvaluateSnippet(reference, jsonnetExpression)
    // Error thrown is an array with two elements
    // throw error and return error message
    if (result[1]['$val']) {
      const error = new Error(result[1]['s'])
      throw error
    } else {
      return { evaluation: result[0], hasError: false }
    }

  } catch (error: any) {
    return { evaluation: error, hasError: true }
  }

}