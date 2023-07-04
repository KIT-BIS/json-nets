export interface PlaceContent {
  schema: {}, 
  data: Array<Object> 
}

/**
 * Create a new place.
 * @param {String} id ID of the place.
 * @param {String} name Name of the place.
 */
export class Place {
  id: string
  name: string
  content: PlaceContent

  constructor(id: string, name: string) {
    this.id = id // id of the place
    this.name = name // name of the place
    // expected to have a "schema" field and a "data" field
    this.content = {
      schema: {},
      data: []
    }
  }
}
