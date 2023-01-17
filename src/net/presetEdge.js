/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {v4 as uuidv4} from 'uuid';
import {query} from '../util/jsonPath';
// import {} from '../util/validator';

export const PRESET_EDGE_TYPE_DELETE = 'delete';
export const PRESET_EDGE_TYPE_READ = 'read';

/**
 * Creates a new preset-edge that can read and may delete documents in a place
 * and wires the read data to a transition.
 * @param {Place} place Place to read documents from.
 * @param {Transition} transition Transition to wire data to.
 */
export function PresetEdge(place, transition) {
  this.id = uuidv4();
  this.place = place;
  this.transition = transition;
  this.label = {
    type: PRESET_EDGE_TYPE_DELETE,
    filter: '',
  };
}

/**
 * Returns a subset of documents from the connected place.
 * Documents are filtered by the inscibed JSONPath-expression.
 * @method
 * @name PresetEdge#applyFilter
 * @return {Array}
 */
PresetEdge.prototype.applyFilter = function() {
  const documents = this.place.content.data;
  const filteredDocuments = query(documents, this.filter);
  return filteredDocuments;
};

/**
 * Assigns the properties of a valid document in the connected place
 * to the connected transtion's state
 * @method
 * @name PresetEdge#fire
 */
PresetEdge.prototype.fire = function() {
  const document = findValidDocument(this.place.content.data,
      this.label.filter);
  if (this.label.mode === PRESET_EDGE_TYPE_DELETE) {
    this.place.content.data = this.place.content.data.filter((doc) => {
      return doc !== document;
    });
  }
  // state is assumed to be one object
  // WARNING/TODO: currently overwrites values of previously fired edges
  // Is this a problem or intended behavior?
  Object.assign(this.transition.state, document);
};

// /**
//  * Checks whether this edge can fire (i.e. the connected place has a
//  * valid document)
//  * @method
//  * @name PresetEdge#canFire
//  * @return {Boolean}
//  */
// PresetEdge.prototype.canFire = function() {
//   const document = findValidDocument(this.place.content.data, this.label);
//
//   return Boolean(document);
// };


