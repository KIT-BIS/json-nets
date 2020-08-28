import {v4 as uuidv4} from 'uuid';

/**
 * Creates a new Token object
 */
export function Token() {
  this._id = uuidv4();
};
