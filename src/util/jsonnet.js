//require('./libraries/jsonnet.js');
import './libraries/jsonnet'

/**
 * Evaluate a document with Jsonnet.
 * @param {Object} data
 * @return {Object}
 */
export function evaluate(data) {
  try {
    // eslint-disable-next-line new-cap
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
  } catch (error) {
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
export function variablifyDocuments(documents) {
  let jsonnetString = ''
  for (const [key, value] of Object.entries(documents)) {
    jsonnetString += `local ${key.toLowerCase()} = ${JSON.stringify(value)}; \n`
  }

  return jsonnetString
}
