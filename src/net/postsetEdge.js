/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {v4 as uuid} from 'uuid';
import jsonpath from 'jsonpath';

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
  this.label = {};
}

/**
 * The postset edge creates a new document in the connected place.
 * @method
 * @name PostsetEdge#fire
 */
PostsetEdge.prototype.fire = function() {
  let document = {};
  document = assembleDocument(this.transition.state, document, this.label);
  this.place.content.push(document);
};

/**
 * Recursively assembles a document by traversing through the given label,
 * assigning atomic values to the document,
 * fetching JSONPath queries from the transitionState
 * and stepping deeper into arrays and objects.
 * @param {Object} transitionState To query JSONPath statements.
 * @param {Object} docToAssemble Recursively assemble document.
 * @param {Object} labelPart Traverse through this object.
 * @return {Object} The assembled document.
 */
function assembleDocument(transitionState, docToAssemble, labelPart) {
  if (labelPart instanceof Array) {
    docToAssemble = [];
    labelPart.forEach((element) => {
      docToAssemble.push(assembleDocument(transitionState, null, element));
    });
  } else if (labelPart instanceof Object) {
    Object.keys(labelPart).forEach((property) => {
      // in case parent was array
      if (!docToAssemble) {
        docToAssemble = {};
      }
      docToAssemble[property] = {};
      docToAssemble[property] = assembleDocument(transitionState,
          docToAssemble[property], labelPart[property]);
    });
  } else if ((typeof labelPart === 'string' || labelPart instanceof String) &&
              labelPart.startsWith('$')) {
    docToAssemble = jsonpath.query(transitionState, labelPart)[0];
  } else {
    docToAssemble = labelPart;
  }
  return docToAssemble;
}
