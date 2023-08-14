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
    question: 'Definition of a variable',
    answer:
      'local tuitionPerSemester = 400;',
    evaluation:
      {"age": 25, "email": "alice@uni.edu", "id": 1, "name": "Alice", "semester": 4, "totalTuition": 1600},
    isExpanded: false
  },
   {
    question: 'Definition of a function',
    answer:
      'local calculateTotalTuition(tuitionPerSemester, numberSemester) = tuitionPerSemester * numberSemester;',
    evaluation:
      {"age": 25, "email": "alice@uni.edu", "id": 1, "name": "Alice", "semester": 4, "totalTuition": 1600},
    isExpanded: false
  },
 

  ]


}