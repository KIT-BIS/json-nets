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
export function Transition(id, name) {
  this.id = id;
  this.name = name;
  this.preset = [];
  this.postset = [];
  this.state = {}; // Save each document with placeName as key
  this.content = 'true';
};

/**
 * Checks whether all connected preset edges can fire (i.e. have
 * valid documents in their connected places)
 * @method
 * @name Transition#isAlive
 * @return {Boolean}
 */
Transition.prototype.isAlive = function() {
  this.state = {};
  // check if each preset-edge filter finds documents
  for (let i = 0; i < this.preset.length; i++) {
    const filteredDocuments = this.preset[i].applyFilter();
    if (filteredDocuments.length == 0) {
      console.log('Filter found no documents.');
      return false;
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
  for (let i = 0; i < this.preset.length; i++) {
    this.preset[i].fire(this.state[this.preset[i].place.name.toLowerCase()]);
  }
  this.postset.forEach((edge) => edge.fire());
};

/**
 * Finds an assignments and writes it
 * @method
 * @return {Object|Boolean}
 */
Transition.prototype.findAssignment = function() {
  const keys = [];
  const documents = [];
  for (let i = 0; i < this.preset.length; i++) {
    const filteredDocuments = this.preset[i].applyFilter();
    if (filteredDocuments.length == 0) {
      this.state = {};
      return undefined;
    } else {
      documents.push(filteredDocuments);
      keys.push(this.preset[i].place.name.toLowerCase());
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
    }
  }
  return false;
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
