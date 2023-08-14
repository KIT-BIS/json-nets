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
  jsonnet: [
  {
    question: 'Pass some static simple value as output.',
    answer: 'local output_somplace_value = true;',
    evaluation: { "id": 1, "lecture": "Process Modeling" },
    isExpanded: false
  },
  {
    question: 'Pass some static complex value as output.',
    answer: 'local output_somplace_value = { "id": 1, "lecture": "Process Modeling" };',
    evaluation: { "id": 1, "lecture": "Process Modeling" },
    isExpanded: false
  },
  {
    question: 'Pass some input value unchanged.',
    answer: 'local output_somplace_value = input_otherplace_value;',
    evaluation: { "id": 1, "lecture": "Process Modeling" },
    isExpanded: false
  },
  {
    question: 'Merge objects.',
    answer: 'local output_someplace_value = input_otherplace_value + {email: somevariable.email};',
    evaluation: { "email": "alice@uni.edu", "id": 1, "lecture": "Process Modeling"},
    isExpanded: false
  },
  ]


}