/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import {v4 as uuidv4} from 'uuid';
import {validate} from '../util/validator';

export const PRESET_EDGE_MODE_DELETE = 'PRESET_EDGE_MODE_DELETE';

/**
 * Creates a new preset-edge that can read and may delete documents in a place
 * and wires the read data to a transition.
 * @param {Place} place Place to read documents from.
 * @param {Transition} transition Transition to wire data to.
 * @param {String} mode Whether the edge "read"s or reads and
 *  "delete"s a document.
 */
export function PresetEdge(place, transition, mode = PRESET_EDGE_MODE_DELETE) {
  this.id = uuidv4();
  this.place = place;
  this.transition = transition;
  this.mode = mode;
  this.label = {};
}

/**
 * Assigns the properties of a valid document in the connected place
 * to the connected transtion's state
 * @method
 * @name PresetEdge#fire
 */
PresetEdge.prototype.fire = function() {
  const document = this.findValidDocument();
  if (this.mode === PRESET_EDGE_MODE_DELETE) {
    this.place.content = this.place.content.filter((doc) => {
      return doc !== document;
    });
  }
  // state is assumed to be one object
  // WARNING/TODO: currently overwrites values of previously fired edges
  // Is this a problem or intended behavior?
  Object.assign(this.transition.state, document);
};

/**
 * Checks whether this edge can fire (i.e. the connected place has a
 * valid document)
 * @method
 * @name PresetEdge#canFire
 * @return {Boolean}
 */
PresetEdge.prototype.canFire = function() {
  const document = this.findValidDocument();

  return Boolean(document);
};

/**
 * Finds the first document in the connected place that is
 * valid against label.
 * @method
 * @name PresetEdge#findValidDocument
 * @return {Object}
 */
PresetEdge.prototype.findValidDocument = function() {
  const document = this.place.content.find((doc) => {
    const isValid = validate(doc, this.label);
    return isValid;
  });

  return document;
};
