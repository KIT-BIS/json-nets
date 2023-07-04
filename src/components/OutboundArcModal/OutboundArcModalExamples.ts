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
  jsonnet: [{
    question: 'Pass token unchanged',
    answer: 'request',
    evaluation: { "id": 1, "lecture": "Process Modeling" },
    isExpanded: false
  },
  {
    question: 'Add attributes to existing token',
    answer: 'request\n{email: student.email}',
    evaluation: { "email": "alice@uni.edu", "id": 1, "lecture": "Process Modeling"},
    isExpanded: false
  },
  {
    question: 'Create new token',
    answer:
      '{\n  email: student.email,\n  message: "The request for " + request.lecture + " was accepted."\n}',
    evaluation:
      { "email": "alice@uni.edu", "message": "The request for Process Modeling was accepted."},
    isExpanded: false
  },
  {
    question: 'Definition of local variable and calculation',
    answer:
      'local tuitionPerSemester = 400;\nlocal calculateTotalTuition(tuitionPerSemester, numberSemester) = tuitionPerSemester * numberSemester;\nstudent\n{totalTuition: calculateTotalTuition(tuitionPerSemester, student.semester)}',
    evaluation:
      {"age": 25, "email": "alice@uni.edu", "id": 1, "name": "Alice", "semester": 4, "totalTuition": 1600},
    isExpanded: false
  },
  {
    question: 'Check whether an array contains a specific element',
    answer: 'request\n{accepted: std.member(student.lecturesNotYetDone, request.lecture)}',
    evaluation:
      {"accepted": true,"id": 1,"lecture": "Process Modeling","serviceFee": 15},
    // \n Info: The function std.member(array, element) returns true if the array contains the element, otherwise false.',
    isExpanded: false
  },
  {
    question: 'Calculation with self',
    answer:
      'local tuitionPerSemester = 400;\n{\n  semesterTuition: tuitionPerSemester,\n  totalCostThisSemester: self.semesterTuition + request.serviceFee\n}',
    evaluation: {"semesterTuition": 400, "totalCostThisSemester": 415},
    isExpanded: false
  }
  ]


}