import {v4 as uuidv4} from 'uuid';

/**
 * Create a new Place object.
 * @param {String} name - name of the place
 */
export function Place(name) {
  this.id = uuidv4(); // id of the place
  this.name = name; // name of the place
  // expected to have a "schema" field and a "data" field
  this.content = {
    schema: {},
    data: [],
  };
  console.log(this);
};

