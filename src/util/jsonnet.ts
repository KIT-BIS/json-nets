// TODO: jsonnet is loaded as additional library from public folder
// not nice, but explicitly importing it causes vue build process to complain
// there doesn't seem to be another up to date npm package as alternative
/**
 * Evaluate a document with Jsonnet.
 * @param {Object} jsonnetExpression
 * @return {Object}
 */
export function evaluate(jsonnetExpression: string) {
  try {
    //@ts-ignore
    const result = jsonnet.EvaluateSnippet('Error: ', jsonnetExpression)
    // Error thrown is an array with two elements
    // throw error and return error message
    if (result[1]['$val']) {
      const e = new Error(result[1]['s'])
      console.log('ERROR', result)
      throw e
    }
    return {
      success: true,
      data: result[0]
    }
  } catch (error: any) {
  // } catch (error) {
    return {
      success: false,
      data: error.message
    }
  }
}

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
    jsonnetString += `local ${key.toLowerCase()} = ${JSON.stringify(value)}; \n`
  }

  return jsonnetString
}


// NEW JSON-NET VERSION

export function evaluateExpression(jsonnetExpression: string, variables: Record<string, any> = {}, reference = '') {
  const variableString = jsonnetify(variables)
  jsonnetExpression = variableString + jsonnetExpression;

  try {
    //@ts-ignore
    const result = jsonnet.EvaluateSnippet(reference, jsonnetExpression)
    // Error thrown is an array with two elements
    // throw error and return error message
    if (result[1]['$val']) {
      const error = new Error(result[1]['s'])
      throw error
    } else {
      const returnValue = JSON.parse(result[0])
      if (returnValue === true) {
        return { evaluation: true, hasError: false }
      } else if (returnValue === false) {
        // return false for any not-true value
        return { evaluation: false, hasError: false }
      } else {
        const error = new Error('Jsonnet expression for ' + reference + ' does not return boolean value. Returned value is ' + result[0])
        throw error;
      }
    }

  } catch (error: any) {
    return { evaluation: false, hasError: true, error }
  }

}