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
    desc: "Return all objects (apply no filter)",
    querySnippet: "",
    query: "<i>(leave empty)</i>"
  },
  {
    desc: "Filter the first object",
    querySnippet: "0",
    query: "$.[0]"
  },
  {
    desc: "Filter the first two objects",
    querySnippet: "0,1",
    query: "$.[0,1]"
  },
  {
    desc: "Filter the last object",
    querySnippet: "-1:",
    query: "$.[-1:]"
  },
  {
    desc: "Filter until the third object",
    querySnippet: ":2",
    query: "$.[:2]"
  },
  {
    desc: "Filter all objects with a specific property",
    querySnippet: "?(@.name)",
    query: "$.[?(@.name)]"
  },
  {
    desc: "Filter all objects where the property is equal to a specific value",
    querySnippet: "?(@.name == \'Alice\')",
    query: "$.[?(@.name=='Alice')]"
  },
  {
    desc: "Filter all objects where a property is greater than a specific value",
    querySnippet: "?(@.age > 18)",
    query: "$.[?(@.age > 18)]"
  },
  {
    desc: "",
    querySnippet: "",
    query: ""
  },

]