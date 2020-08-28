import {v4 as uuidv4} from 'uuid';
/**
 * Creates a new Transition object.
 */
export function Transition() {
  this._id = uuidv4();
  this.preset = [];
  this.postset = [];
};
