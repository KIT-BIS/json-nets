import {v4 as uuidv4} from 'uuid';
/**
 * Create a new Place object.
 */
export function Place() {
  this._id = uuidv4();
  this.tokens = [];
};

