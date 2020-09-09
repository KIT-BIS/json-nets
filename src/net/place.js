import {v4 as uuidv4} from 'uuid';

/**
 * Create a new Place object.
 */
export function Place() {
  this.id = uuidv4();
  // expected to have a "schema" field and a "data" field
  this.content = {
    schema: {},
    data: [],
  };
};

