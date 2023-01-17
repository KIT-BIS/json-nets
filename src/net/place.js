import {v4 as uuidv4} from 'uuid';

/**
 * Create a new Place object.
 * @param {String} id - id of the place
 */
export function Place(id=uuidv4() ) {
  this.id = id;
  // expected to have a "schema" field and a "data" field
  this.content = {schema: {}, data: []};
  console.log(this);
};

