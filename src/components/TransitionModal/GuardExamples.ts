export interface Examples {
	student: Array<Object>,
	request: Array<Object>,
	jsonnet: Array<{
		question: string,
		answer: string,
		evaluation: any,
		isExpanded: boolean
	}>
}

/**
 * A list of examples for transition guards. To be used in Example Accordion.
 */
export const examples: Examples = {
	student: [{
		"id": 1,
		"name": "Alice",
		"age": 25,
		"email": "alice@uni.edu",
		"semester": 4,
		"lecturesNotYetDone": ["Process Modeling", "Database Systems"]
	}],
	request: [{
		"id": 1,
		"lecture": "Process Modeling",
		"serviceFee": 15
	}],
	jsonnet: [
		{
			question: 'Always evaluate to true (no check functionality)',
			answer: 'true',
			evaluation: true,
			isExpanded: false
		},
		{
			question: 'Comparison of two attributes of different tokens',
			answer: 'input_somplace_token.id == output_otherplace_token.id',
			evaluation: true,
			isExpanded: false
		},
		{
			question: 'Comparison of an attribute with a value',
			answer: "input_someplace_value.name == 'Tom'",
			evaluation: false,
			isExpanded: false
		},
		{
			question: 'Compare whether value is greater or smaller',
			answer: "input_someplace_value.age > 18",
			evaluation: true,
			isExpanded: false
		},
		{
			question: 'Combine multiple conditions',
			answer:
				"input_someplace_value.name == 'Tom' &&\n input_someplace_value.age > 18",
			evaluation: true,
			isExpanded: false
		}
	]


}