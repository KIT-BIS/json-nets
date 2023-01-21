/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {evaluate, variablifyDocuments} from '../util/jsonnet.js';
import {validate} from '../util/validator.js';

/**
 * Creates a new postset arc that can create a document in a place
 * based on data available in transition.
 * @param {Transition} transition Transition to read data from.
 * @param {Place} place Place to create a document in.
 * @param {String} id ID of the arc.
 */
export function PostsetArc(transition, place, id) {
  this.id = id;
  this.type = 'postset';
  this.transition = transition;
  this.place = place;
  this.label = '{}';
}

/**
 * Create a document based on label and transition state.
 * @method
 * @name PostsetArc#createDocument
 * @return {Object|undefined}
 */
PostsetArc.prototype.createDocument = function() {
  const inputDocuments = this.transition.state;
  let jsonnetString = variablifyDocuments(inputDocuments);
  jsonnetString += this.label;


  const evaluateDocuments = evaluate(jsonnetString);
  const outputDocument = JSON.parse(evaluateDocuments.data);
  if (!evaluateDocuments.success) {
    console.log('Jsonnet expression produced errors.');
    console.log('Jsonnet string is:');
    console.log(jsonnetString);
    // throw new Error(evaluateDocuments.data);
    return undefined;
  } else {
    if (validate(outputDocument, this.place.content.schema).isValid) {
      return outputDocument;
    } else {
      console.log('Created document is not valid to schema.');
      return undefined;
    }
  }
};

/**
 * Put a new document in connected place.
 * @method
 * @name PostsetArc#occur
 */
PostsetArc.prototype.occur = function() {
  const document = this.createDocument();
  this.place.content.data.push(document);
};
