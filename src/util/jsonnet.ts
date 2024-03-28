/**
 * Utility functions to interact with Jsonnet code.
 * Todo: jsonnet is loaded as additional library from public folder
 * not nice, but explicitly importing it causes vue build process to complain
 * there doesn't seem to be another up to date npm package as alternative
 */
import type { JSONValue } from "./jsonOperations"


/**
 * Returns a Jsonnet-snippet as string value
 * where the values of the given document are assigned
 * to variables whose names correspond to the document
 * fields.
 * @param {Object} documents
 */
export function jsonnetify(documents: Object) {
	let jsonnetString = ''
	for (const [key, value] of Object.entries(documents)) {
		jsonnetString += `local ${key} = ${replaceUmlauts(JSON.stringify(value))}; \n`
	}

	return jsonnetString
}

// Todo: this is a hacky solution to fix Umlaut support
function replaceUmlauts(string: string) {
	let value = string;
	value = value.replace(/\u00c4/g, 'Ae');
	value = value.replace(/\u00e4/g, 'ae');
	value = value.replace(/\u00dc/g, 'Ue');
	value = value.replace(/\u00fc/g, 'ue');
	value = value.replace(/\u00d6/g, 'Oe');
	value = value.replace(/\u00f6/g, 'oe');
	value = value.replace(/\u00df/g, 'ss');
	return value;
}

export type EvaluationResult = {
	hasError: boolean,
	evaluation: string
}
export function evaluateExpression(jsonnetExpression: string, variables: Record<string, JSONValue> = {}, reference = ''): EvaluationResult {
	const variableString = jsonnetify(variables)
	jsonnetExpression = variableString + replaceUmlauts(jsonnetExpression);

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