/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {query} from '../util/jsonPath';

export const PRESET_ARC_TYPE_CONSUME = 'consume';
export const PRESET_ARC_TYPE_READ = 'read';

/**
 * Creates a new preset arc that can read and may delete documents in a place
 * and wires the read data to a transition.
 * @param {Place} place Place to read documents from.
 * @param {Transition} transition Transition to wire data to.
 * @param {String} id ID of the new arc.
 */
export function PresetArc(place, transition, id) {
  this.id = id;
  this.place = place;
  this.type = 'preset';
  this.transition = transition;
  this.label = {
    type: PRESET_ARC_TYPE_CONSUME,
    filter: '',
  };
}

/**
 * Returns a subset of documents from the connected place.
 * Documents are filtered by the inscribed JSONPath-expression.
 * @method
 * @name PresetArc#applyFilter
 * @return {Array}
 */
PresetArc.prototype.applyFilter = function() {
  const documents = this.place.content.data;
  if (this.label.filter === '') {
    return documents;
  } else {
    const filteredDocuments = query(documents, this.label.filter);
    return filteredDocuments;
  }
};

/**
 * Removes the given document from the connected place
 * (if this arc is of consume type).
 * @method
 * @param {Object} document
 * @name PresetArc#occur
 */
PresetArc.prototype.occur = function(document) {
  if (this.label.type === PRESET_ARC_TYPE_CONSUME) {
    const index = this.place.content.data.indexOf(document);
    this.place.content.data.splice(index, 1);
  }
};
