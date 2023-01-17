/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {v4 as uuid} from 'uuid';
import {evaluate} from '../util/jsonnet.js';

/**
 * Creates a new postset-edge that can modify or create documents in a place
 * based on data available in transition.
 * @param {Transition} transition Transition to read data from.
 * @param {Place} place Place to create or modify documents in.
 */
export function PostsetEdge(transition, place) {
  this.id = uuid();
  this.transition = transition;
  this.place = place;
  this.label = {
    'creationFunction': {},
  };
}

/**
 * The postset edge creates a new document in the connected place.
 * @method
 * @name PostsetEdge#createDocument
 * @return {*}
 */
PostsetEdge.prototype.createDocument = function() {
  const documents = this.transition.state;
  let jsonnetString = variablifyDocuments(documents);
  jsonnetString += this.content;

  // Convert string to Boolean
  const evaluateDocuments = evaluate(jsonnetString);
  const result = JSON.parse(evaluateDocuments.data);
  if (!evaluateDocuments.success) {
    // throw new Error(evaluateDocuments.data);
    return undefined;
  } else {
    return result;
  }
};

/**
 * @method
 * @name PostsetEdge#fire
 */
PostsetEdge.prototype.fire = function() {
  const document = this.createDocument();
  this.place.content.data.push(document);
};
