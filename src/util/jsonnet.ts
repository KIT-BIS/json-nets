// TODO: jsonnet is loaded as additional library from public folder
// not nice, but explicitly importing it causes vue build process to complain
// there doesn't seem to be another up to date npm package as alternative
/**
 * Evaluate a document with Jsonnet.
 * @param {Object} data
 * @return {Object}
 */
export function evaluate(data: Object) {
  try {
    //@ts-ignore
    const result = jsonnet.EvaluateSnippet('Error: ', data)
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
export function variablifyDocuments(documents: Object) {
// export function variablifyDocuments(documents) {
  let jsonnetString = ''
  for (const [key, value] of Object.entries(documents)) {
    jsonnetString += `local ${key.toLowerCase()} = ${JSON.stringify(value)}; \n`
  }

  return jsonnetString
}
