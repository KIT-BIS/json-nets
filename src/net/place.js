/**
 * Create a new place.
 * @param {String} id ID of the place.
 * @param {String} name Name of the place.
 */
export function Place(id, name) {
  this.id = id; // id of the place
  this.name = name; // name of the place
  // expected to have a "schema" field and a "data" field
  this.content = {
    schema: {},
    data: [],
  };
};

