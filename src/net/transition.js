import {v4 as uuidv4} from 'uuid';

/**
 * Creates a new Transition object.
 */
export function Transition() {
  this.id = uuidv4();
  this.preset = [];
  this.postset = [];
  this.state = {};
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
