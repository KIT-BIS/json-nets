export const examples =
  [{
    "name": "Alice",
    "age": 23,
    "studentID": 2567
  },
  {
    "name": "Marco",
    "age": 17,
    "studentID": 2544
  },
  {
    "age": 21,
    "studentID": 2063
  }]

export const jsonPathSnippets = [
  {
    desc: "Return all objects",
    query: "$.*",
  },
  {
    desc: "Filter the first object",
    query: "$.[0]",
  },
  {
    desc: "Filter the first two objects",
    query: "$.[0,1]",
  },
  {
    desc: "Filter the last object",
    query: "$.[-1:]",
  },
  {
    desc: "Filter until the third object",
    query: "$.[:2]",
  },
  {
    desc: "Filter all objects with a specific property",
    query: "$.[?(@.name)]",
  },
  {
    desc: "Filter all objects where the property is equal to a specific value",
    query: "$.[?(@.name=='Alice')]",
  },
  {
    desc: "Filter all objects where a property is greater than a specific value",
    query: "$.[?(@.age > 18)]",
  },

]