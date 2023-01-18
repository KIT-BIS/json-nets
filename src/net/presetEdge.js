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
  this.type = 'preset';
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
  if (this.label.filter === '') {
    console.log('Filter is empty.');
    return documents;
  } else {
    console.log('Filter is ' + this.label.filter + '.');
    const filteredDocuments = query(documents, this.label.filter);
    return filteredDocuments;
  }
};

/**
 * Assigns the properties of a valid document in the connected place
 * to the connected transtion's state
 * @method
 * @param {Object} document
 * @name PresetEdge#fire
 */
PresetEdge.prototype.fire = function(document) {
  if (this.label.type === PRESET_EDGE_TYPE_DELETE) {
    console.log('Document to be removed:');
    console.log(document);
    const index = this.place.content.data.indexOf(document);
    this.place.content.data.splice(index, 1);
  }
};
