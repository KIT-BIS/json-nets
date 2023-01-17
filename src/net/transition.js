import {v4 as uuidv4} from 'uuid';
import {combineArrays} from '../util/util';

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
  this.state = {};
  this.content = '//Add your JSONNET Code here';
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
