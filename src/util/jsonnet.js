require('./libraries/jsonnet.js');
/**
 * Evaluate a document with Jsonnet.
 * @param {Object} data
 * @return {Object}
 */
export function evaluate(data) {
  try {
    // eslint-disable-next-line new-cap
    const result = jsonnet.EvaluateSnippet('Error: ', data);
    // Error thrown is an array with two elements
    // throw error and return error message
    if (result[1]['$val']) {
      const e = new Error(result[1]['s']);
      console.log('ERROR', result);
      throw e;
    }
    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      data: error.message,
    };
  }
}
