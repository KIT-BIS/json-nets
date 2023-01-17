import {v4 as uuidv4} from 'uuid';

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
