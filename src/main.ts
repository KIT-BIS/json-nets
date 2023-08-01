import './assets/style.scss'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCodemirror from 'vue-codemirror'
import {
  faCircle,
  faSquare,
  faArrowRight,
  faTrash,
  faMousePointer,
  faExpandArrowsAlt,
  faEdit,
  faPlayCircle,
  faFileArrowDown,
  faInfoCircle,
  faPlusCircle,
  faMinusCircle,
  faWandMagicSparkles,
  faQuestion,
  faPen,
  faUpRightFromSquare,
  faFilter,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* add icons to the library */
library.add(
  faCircle,
  faSquare,
  faArrowRight,
  faTrash,
  faMousePointer,
  faExpandArrowsAlt,
  faEdit,
  faPlayCircle,
  faFileArrowDown,
  faInfoCircle,
  faPlusCircle,
  faMinusCircle,
  faWandMagicSparkles,
  faQuestion,
  faPen,
  faUpRightFromSquare,
  faFilter,
  faTriangleExclamation
)

import App from './App.vue'
import { evaluateExpression, jsonnetify } from './util/jsonnet'
import { checkSchema, compileValidator, validateJSON, validateSchema } from './util/jsonSchema'
import { deepRemove, insert, remove, type JSONComplex, deepInsert } from './util/jsonOperations'
import JsonPointer from 'json-pointer'
import { Schema } from './json-nets/Schema'
//import router from './router'

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(VueCodemirror, {
  // keep the global default extensions empty
  // to allow removal of gutters
  extensions: []
})
//app.use(router)

app.mount('#app')


//Playground

// const schema = { type: 'object', properties: { a: { type: 'string' }} }
// const schemaObject = new Schema('a', schema)
// console.log(schemaObject.checkToken({ a: "bk"}))
// console.log(validateSchema(schema))
// const validator = compileValidator(schema)
// console.log(validateDocument(true, validator));

// console.log('Operations')
// let value: JSONComplex = [
  // { A: 5 },
  // { B: 3 },
  // { C: [3,5,7]}
// ]
// let value2: JSONComplex = {
  // 0: { A: 5 },
  // 1: { B: 3 },
  // 2: { C: {
    // 0: 3,
    // 1: 5,
    // 2: 7
  // }}
// }
// console.log(deepRemove('/3', value2));
// console.log(value2);
// console.log(deepInsert('',value2,1,4))
// console.log(value);
// console.log(JsonPointer.get(value, ''))
// let array = [1,5,6]
// console.log(insert(4,array,9));
// console.log(array)
// remove(1,array)
// console.log(array)
// array = [1,5,6]
// console.log(remove(2,array))
// array = [1,5,6]
// console.log(remove(3,array))
// array = [1,5,6]
// console.log(remove(4,array))
// array = [1,5,6]
// console.log(remove("a",array))
// array = [1,5,6]
// console.log(remove("1",array))
// array = [1,5,6]
// console.log(remove(-2,array))
// let object = { "a": 3, 2: 5, "3": 4 };
// console.log(insert("apfelkuchen", object, 44))
// console.log(object)
// let value = 2
// console.log(insert(44, value, 3))
// console.log(value);

// remove("3", object)
// console.log(object)
//JSON Schema
//console.log('JSON Schema')
//const schema = {
//"type": "object",
//"properties": {
//"studentId": { "type": "string" },
//"level": {
//"type": "string",
//"enum": ["Bachelor", "Master"]
//},
//"studyProgram": { "type": "stringz" },
//"email": {
//"type": "string",
//"format": "email"
//}
//}
//};
//const schemaString = JSON.stringify(schema);
//const document = {
//"studentId": "student-1",
//"level": "Master",
//// "level": 5,
//"studyProgram": "Information Systems",
//"email": "student@uni.edu"
//// "email": 5
//}
//const documentString = JSON.stringify(document);
//const documentString2 = "{ 5 }"
//console.log(validateDocument(documentString, schemaString))
// console.log(checkSchema(documentString2))

//JSonnet
// console.log('Jsonnet')
// console.log(evaluateExpression('true'));
// console.log(evaluateExpression('false'));
// console.log(evaluateExpression('falsez'));
// console.log(evaluateExpression('falsez', {}, 'test').error);
// console.log(evaluateExpression("local a = { 'myValue': 100 }; local b = 50; b", {}, 'test').error);
// const dict = {
  // a: { 'myValue': 100},
  // b: 50
// }
// console.log(jsonnetify(dict));
// console.log(evaluateExpression('a.myValue', dict).error)
// JSONPath and JSONPointer
// let test = {
// "store": {
  // "book": [
    // {
      // "category": "reference",
      // "author": "Nigel Rees",
      // "title": "Sayings of the Century",
      // "price": 8.95
    // },
    // {
      // "category": "fiction",
      // "author": "Evelyn Waugh",
      // "title": "Sword of Honour",
      // "price": 12.99
    // },
    // {
      // "category": "fiction",
      // "author": "Herman Melville",
      // "title": "Moby Dick",
      // "isbn": "0-553-21311-3",
      // "price": 8.99
    // },
    // {
      // "category": "fiction",
      // "author": "J. R. R. Tolkien",
      // "title": "The Lord of the Rings",
      // "isbn": "0-395-19395-8",
      // "price": 22.99
    // }
  // ],
  // "bicycle": {
    // "color": "red",
    // "price": 19.95
  // }
// }
// }
// 
// const testString = JSON.stringify(test)
// const paths = getPathExpressions(testString, '$..*');
// console.log('PATHS')
// console.log(paths);
// 
// console.log('check if valid filter')
// console.log(isValidForFilterExpression(testString, '$.store.book[*].author'))
// console.log(isValidForFilterExpression(testString, '$.store.book[*].authorzzz'))
// 
// console.log('get Fragments')
// console.log(getFragment(testString, paths[5]));
// 
// console.log('check if valid path')
// console.log(isValidForPathExpression(testString, '/store'))
// console.log(isValidForPathExpression(testString, '/storezzz'))
// console.log('/store')
// console.log('depth: ' + getDepth('/store'))
// console.log('env: ' + getEnvPathExpression('/store'))
// console.log('parent: ' + getParentPathExpression('/store'))
// console.log('key: ' + getKey('/store'))
// console.log('/')
// console.log('depth: ' + getDepth('/'))
// console.log('env: ' + getEnvPathExpression('/'))
// console.log('parent: ' + getParentPathExpression('/'))
// console.log('key: ' + getKey('/'))
// console.log('')
// console.log('depth: ' + getDepth(''))
// console.log('env: ' + getEnvPathExpression(''))
// console.log('parent: ' + getParentPathExpression(''))
// console.log('key: ' + getKey(''))
// console.log('/store/zzz')
// console.log('depth: ' + getDepth('/store/zzz'))
// console.log('env: ' + getEnvPathExpression('/store/zzz'))
// console.log('parent: ' + getParentPathExpression('/store/zzz'))
// console.log('key: ' + getKey('/store/zzz'))
// console.log('/store/zzz/0')
// console.log('depth: ' + getDepth('/store/zzz/0'))
// console.log('env: ' + getEnvPathExpression('/store/zzz/0'))
// console.log('parent: ' + getParentPathExpression('/store/zzz/0'))
// console.log('key: ' + getKey('/store/zzz/0'))
// 
// console.log('concat') 
// console.log(concatPathExpressions('/store/zzz', '0'))
// 
// const toSort = [ '/b/0', '/a', '/a/0/1', '/b/2', '/b/1']
// const sortA = { a: [['v']], b: ['x', 'y', 'z']};
// const sortO = { a: [['v']], b: {1:'x', 2:'y', 3:'z'}};
// console.log(sortByOrder(toSort, JSON.stringify(sortA)))
// console.log(sortByOrder(toSort, JSON.stringify(sortO)))
// 
// import * as JSONPointer from 'json-pointer';
// console.log('parse tes')
// console.log(JSONPointer.parse('/test'))
// console.log(JSONPointer.parse('/'))
// console.log(JSONPointer.parse(''))
// 
// 
// console.log('conflicts')
// console.log(checkForConflict('/a', '/a'))
// console.log(checkForConflict('/a', '/a/b'))
// console.log(checkForConflict('/a/b', '/a/a'))
// console.log(checkForConflict('/c/b', '/a/a'))
// console.log(checkForConflict('/c/b', '/c/b/a'))
// 
// console.log('pairwise conflicts')
// var myArray = ["/a", "/d/a", "/b", "/c", "/d"];
// console.log(pairwiseCheckForConflict(myArray))