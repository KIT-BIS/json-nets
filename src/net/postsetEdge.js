/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {v4 as uuid} from 'uuid';
import {evaluate, variablifyDocuments} from '../util/jsonnet.js';
import {validate} from '../util/validator.js';

/**
 * Creates a new postset-edge that can modify or create documents in a place
 * based on data available in transition.
 * @param {Transition} transition Transition to read data from.
 * @param {Place} place Place to create or modify documents in.
 */
export function PostsetEdge(transition, place) {
  this.id = uuid();
  this.type = 'postset';
  this.transition = transition;
  this.place = place;
  this.label = '';
}

/**
 * The postset edge creates a new document in the connected place.
 * @method
 * @name PostsetEdge#createDocument
 * @return {*}
 */
PostsetEdge.prototype.createDocument = function() {
  const inputDocuments = this.transition.state;
  let jsonnetString = variablifyDocuments(inputDocuments);
  jsonnetString += this.label;

  console.log('Jsonnet string is:');
  console.log(jsonnetString);

  // Convert string to Boolean
  const evaluateDocuments = evaluate(jsonnetString);
  const outputDocument = JSON.parse(evaluateDocuments.data);
  if (!evaluateDocuments.success) {
    // throw new Error(evaluateDocuments.data);
    return undefined;
  } else {
    if (validate(outputDocument, this.place.content.schema).isValid) {
      return outputDocument;
    } else {
      return undefined;
    }
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
