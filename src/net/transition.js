import {v4 as uuidv4} from 'uuid';
import {combineArrays} from '../util/util';
import {evaluate} from '../util/jsonnet.js';

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
    'request': {
      'requestId': 1,
      'studentId': 'student-1',
      'foreignUniversity': 'university-1',
      'foreignLecture': 'Software Engineering and Technology',
      'homeLecture': 'Software Engineering',
      'grade': 1.3,
    },
    'student': {
      'studentId': 'student-1',
      'level': 'Master',
      'studyProgram': 'Information Systems',
      'email': 'student@uni.edu',
    },
    'lecture': {
      'name': 'Software Engineering 1',
      'levels': ['Bachelor'],
      'studyPrograms': ['Information Systems', 'Computer Science'],
      'recognizableLectures': [{
        'universityId': 'university-1',
        'lecture': 'Software Engineering and Technology',
      }],
    },
  }; // Save each document with placeName as key
  this.content = `
  local checkLecture = lecture.name == request.homeLecture;
  local checkStudent = student.studentId == request.studentId;
  checkLecture && checkStudent
  `;
};

/**
 * Checks whether all connected preset edges can fire (i.e. have
 * valid documents in their connected places)
 * @method
 * @name Transition#isAlive
 * @return {Boolean}
 */
Transition.prototype.isAlive = function() {
  isAlive = true;
  this.preset.forEach((edge) => {
    if (!edge.canFire()) {
      isAlive = false;
    }
  });
  return isAlive;
};

/**
 * Finds all possible assignments and writes them to
 * transition state
 * @method
 */
Transition.prototype.findAssignments = function() {
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
      break;
    } else {
      documents.push(filteredDocuments);
      keys.push(this.preset[i].place.name);
    }
  }

  this.state = {
    keys,
    assignments: combineArrays(documents),
  };
};
/**
 * Evaluates the transistions documents with Jsonnet
 * @method
 * @name Transition#evaluate
 * @return {Boolean} true if the transition can fire, false otherwise
 */
Transition.prototype.evaluate = function() {
  // get documents and convert them to jsonnet format for evaluation
  // combine documents with content
  // Evaluate
  const documents = this.state;
  let document = '';
  for (const [key, value] of Object.entries(documents)) {
    console.log(key, value);
    document += `local ${key} = ${JSON.stringify(value)}; \n`;
  }
  document += this.content;

  // Convert string to Boolean
  const evaluateDocuments = evaluate(document);
  const result = JSON.parse(evaluateDocuments.data);
  if (!evaluateDocuments.success) {
    throw new Error(evaluateDocuments.data);
  }
  return result;
};
