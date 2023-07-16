import { evaluate, jsonnetify } from '@/util/jsonnet.js'
import { validate } from '@/util/jsonSchema'
import type { Transition } from './transition'
import type { Place } from './place'

/**
 * Creates a new postset arc that can create a document in a place
 * based on data available in transition.
 * @param {Transition} transition Transition to read data from.
 * @param {Place} place Place to create a document in.
 * @param {String} id ID of the arc.
 */
export class PostsetArc {
  id: string
  type: string
  transition: Transition
  place: Place
  label: string

  constructor(transition: Transition, place: Place, id: string) {
    this.id = id
    this.type = 'postset'
    this.transition = transition
    this.place = place
    this.label = '{}'
  }

  /**
   * Create a document based on label and transition state.
   * @method
   * @name PostsetArc#createDocument
   * @return {Object|undefined}
   */
  createDocument() {
    const inputDocuments = this.transition.state
    let jsonnetString = jsonnetify(inputDocuments)
    jsonnetString += this.label

    const evaluateDocuments = evaluate(jsonnetString)
    const outputDocument = JSON.parse(evaluateDocuments.data)
    if (!evaluateDocuments.success) {
      console.log('Jsonnet expression produced errors.')
      console.log('Jsonnet string is:')
      console.log(jsonnetString)
      // throw new Error(evaluateDocuments.data);
      return undefined
    } else {
      if (validate(outputDocument, this.place.content.schema).isValid) {
        return outputDocument
      } else {
        console.log('Created document is not valid to schema.')
        return undefined
      }
    }

  }

  /**
   * Put a new document in connected place.
   * @method
   * @name PostsetArc#occur
   */
  occur() {
    const document = this.createDocument()
    this.place.content.data.push(document)
  }
}