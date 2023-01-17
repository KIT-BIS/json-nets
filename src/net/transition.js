import {v4 as uuidv4} from 'uuid';
import {combineArrays} from '../util/util';
import {evaluate, variablifyDocuments} from '../util/jsonnet.js';

/**
 * Creates a new Transition object.
 * @param {String} id - id of the transition
 * @param {Array} preset - array of preset edges
 * @param {Array} postset - array of postset edges
 * @param {Object} state - state of the transition
 */
export function Transition(id=uuidv4()) {
  this.id = id;
  this.preset = [];
  this.postset = [];
  // TODO: Delete dummy
  this.state = {
    //    'request': {
    //      'requestId': 1,
    //      'studentId': 'student-1',
    //      'foreignUniversity': 'university-1',
    //      'foreignLecture': 'Software Engineering and Technology',
    //      'homeLecture': 'Software Engineering',
    //      'grade': 1.3,
    //    },
    //    'student': {
    //      'studentId': 'student-1',
    //      'level': 'Master',
    //      'studyProgram': 'Information Systems',
    //      'email': 'student@uni.edu',
    //    },
    //    'lecture': {
    //      'name': 'Software Engineering 1',
    //      'levels': ['Bachelor'],
    //      'studyPrograms': ['Information Systems', 'Computer Science'],
    //      'recognizableLectures': [{
    //        'universityId': 'university-1',
    //        'lecture': 'Software Engineering and Technology',
    //      }],
    //    },
  }; // Save each document with placeName as key
  this.content = 'true';
  //  local checkLecture = lecture.name == request.homeLecture;
  //  local checkStudent = student.studentId == request.studentId;
  //  checkLecture && checkStudent
  // `;
};

/**
 * Checks whether all connected preset edges can fire (i.e. have
 * valid documents in their connected places)
 * @method
 * @name Transition#isAlive
 * @return {Boolean}
 */
Transition.prototype.isAlive = function() {
  // let isAlive = true;
  // check if each preset-edge filter finds a document
  for (let i = 0; i < this.preset.length; i++) {
    const filteredDocuments = this.preset[i].applyFilter();
    if (filteredDocuments.length == 0) {
      console.log('Filter found no documents.');
      return false;
      // isAlive = false;
      // break;
    }
  }

  // check if there is a valid assignment
  const assignment = this.findAssignment();
  if (assignment) {
    this.state = assignment;
  } else {
    console.log('No valid assignment found');
    return false;
  }

  // check if creation functions create a valid document
  for (let i = 0; i < this.postset.length; i++) {
    const document = this.postset[i].createDocument();
    if (document === undefined) {
      console.log('Could not create valid document');
      return false;
    } else {
      console.log('Created document is:');
      console.log(document);
      return true;
    }
  }
};

Transition.prototype.fire = function() {
  // TODO update fire functions in preset and postset edges
};

/**
 * Finds an assignments and writes it
 * @method
 * @return {Object|Boolean}
 */
Transition.prototype.findAssignment = function() {
  // const documents = [
  //  [{'a': 1}, {'b': 1}, {'c': 1}],
  //  [{'x': 2}, {'y': 2}],
  //  [{'p': 'bla'}],
  // ];
  const keys = [];
  const documents = [];
  for (let i = 0; i < this.preset.length; i++) {
    const filteredDocuments = this.preset[i].applyFilter();
    if (filteredDocuments.length == 0) {
      this.state = {};
      return undefined;
    } else {
      documents.push(filteredDocuments);
      keys.push(this.preset[i].place.name);
    }
  }

  const combinations = combineArrays(documents);

  for (let i = 0; i < combinations.length; i++) {
    const combination = combinations[i];
    const documents = {};
    for (let j = 0; j < combination.length; j++) {
      documents[keys[j]] = combination[j];
    }
    if (this.evaluate(documents)) {
      return documents;
    } else {
      return false;
    }
  }

//  this.state = {
//    keys,
//    assignments: combineArrays(documents),
//  };
};

/**
 * Evaluates the transistions documents with Jsonnet
 * @method
 * @param {Object} documents
 * @name Transition#evaluate
 * @return {Boolean} true if the transition can fire, false otherwise
 */
Transition.prototype.evaluate = function(documents) {
  // get documents and convert them to jsonnet format for evaluation
  // combine documents with content
  // Evaluate
  // const documents = this.state;
  let jsonnetString = variablifyDocuments(documents);
  jsonnetString += this.content;

  console.log('Jsonnet string is:');
  console.log(jsonnetString);

  // Convert string to Boolean
  const evaluateDocuments = evaluate(jsonnetString);
  const result = JSON.parse(evaluateDocuments.data);
  if (!evaluateDocuments.success) {
    // throw new Error(evaluateDocuments.data);
    return false;
  } else if (result !== true) {
    return false;
  } else {
    return result;
  }
};
