export interface Examples {
	student: Array<Object>,
	lecture: Array<Object>,
	jsonnet: Array<{
		question: string,
		answer: string,
		evaluation: any,
		isExpanded: boolean
	}>
}

/**
 * A list of examples for output key expressions. To be used in Example Accordion.
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
	lecture: [{
		"id": 1,
		"lecture": "Process Modeling",
		"serviceFee": 15
	}],
	jsonnet: [{
		question: 'Insert corresponding output value at a specific field of an object.',
		answer: 'local output_someplace_key = "price";',
		evaluation: { "id": 1, "lecture": "Process Modeling" },
		isExpanded: false
	},
	{
		question: 'Insert corresponding output value in the beginning of an array.',
		answer: 'local output_someplace_key = 0;',
		evaluation: { "email": "alice@uni.edu", "id": 1, "lecture": "Process Modeling" },
		isExpanded: false
	},
	{
		question: 'Insert corresponding output value at the end of an array.',
		answer: 'local output_someplace_key = "-";',
		evaluation:
			{ "email": "alice@uni.edu", "message": "The request for Process Modeling was accepted." },
		isExpanded: false
	},
	{
		question: 'Use the key of some input value as output key.',
		answer: 'local output_someplace_key = input_otherplace_key;',
		evaluation:
			{ "age": 25, "email": "alice@uni.edu", "id": 1, "name": "Alice", "semester": 4, "totalTuition": 1600 },
		isExpanded: false
	}
	]


}