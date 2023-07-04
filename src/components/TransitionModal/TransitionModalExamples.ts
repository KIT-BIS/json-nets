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
      answer: 'local check = student.id == request.id;\ncheck',
      evaluation: true,
      isExpanded: false
    },
    {
      question: 'Comparison of an attribute with a value',
      answer: "local check = student.name == 'Tom';\ncheck",
      evaluation: false,
      isExpanded: false
    },
    {
      question: 'Compare whether value is greater or smaller',
      answer: "local check = student.age > '18';\ncheck",
      evaluation: true,
      isExpanded: false
    },
    {
      question: 'Two conditions have to be true',
      answer:
        "local checkLecture = request.lecture == 'Process Modeling';\nlocal checkStudent = request.id == student.id;\ncheckLecture && checkStudent",
      evaluation: true,
      isExpanded: false
    }
  ]


}