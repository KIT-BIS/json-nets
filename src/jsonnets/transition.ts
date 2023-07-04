import { combineArrays } from '@/util/util'
import { evaluate, variablifyDocuments } from '@/util/jsonnet.js'
import type { PresetArc } from './presetArc'

/**
 * Creates a new Transition object.
 * @param {String} id ID of the transition.
 * @param {String} name Name of the transition.
 */
export class Transition {
  id: string
  name: string
  preset: Array<PresetArc>
  postset: Array<any>
  state: Record<string, Object> 
  content: string

  constructor(id: string, name:string) {
    this.id = id
    this.name = name
    this.preset = []
    this.postset = []
    this.state = {} // Save each document with placeName as key
    this.content = 'true'
  }

  /**
   * Checks whether all connected preset arcs have
   * valid documents in their connected places
   * And all connected postset arc can create valid documents.
   * @method
   * @name Transition#isAlive
   * @return {Boolean}
   */
  isEnabled() {
    this.state = {}
    // check if each preset arc filter finds documents
    for (let i = 0; i < this.preset.length; i++) {
      const filteredDocuments = this.preset[i].applyFilter()
      if (filteredDocuments.length == 0) {
        console.log('Filter found no documents.')
        return false
      }
    }

    // check if there is a valid assignment
    const assignment = this.findAssignment()
    if (assignment) {
      this.state = assignment
    } else {
      console.log('No valid assignment found')
      return false
    }

    // check if creation functions create a valid document
    for (let i = 0; i < this.postset.length; i++) {
      const document = this.postset[i].createDocument()
      if (document === undefined) {
        console.log('Could not create valid document')
        return false
      } else {
        console.log('Created document is:')
        console.log(document)
        return true
      }
    }

  }

  occur() {
    for (let i = 0; i < this.preset.length; i++) {
      this.preset[i].occur(this.state[this.preset[i].place.name.toLowerCase()])
    }
    this.postset.forEach((arc) => arc.occur())

  }

  /**
   * Finds a valid assignment of documents to filters.
   * Based on filter expressions and transition inscriptions.
   * @method
   * @return {Object|Boolean}
   */
  findAssignment() {
    const keys = []
    const documents = []
    for (let i = 0; i < this.preset.length; i++) {
      const filteredDocuments = this.preset[i].applyFilter()
      if (filteredDocuments.length == 0) {
        // TODO: is resetting state required here?
        this.state = {}
        return undefined
      } else {
        documents.push(filteredDocuments)
        keys.push(this.preset[i].place.name.toLowerCase())
      }
    }

    const combinations = combineArrays(documents)

    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i]
      //TODO: proper typescript solution without any
      const documents:any = {}
      for (let j = 0; j < combination.length; j++) {
        documents[keys[j]] = combination[j]
      }
      if (this.evaluate(documents)) {
        return documents
      }
    }
    return false
  }

  /**
   * TODO: proper typescript solution witout any
   * Evaluates the inscribed Jsonnet expression with the given documents.
   * Returns true if the transition can occur, false otherwise.
   * @method
   * @param {Object} documents
   * @name Transition#evaluate
   * @return {Boolean}
   */
  evaluate(documents: any) {
    // combine documents with content
    let jsonnetString = variablifyDocuments(documents)
    jsonnetString += this.content

    // Convert string to Boolean
    const evaluateDocuments = evaluate(jsonnetString)
    // Todo: give better evaluation feedback
    if (!evaluateDocuments.success) {
      // throw new Error(evaluateDocuments.data);
      return false
    } else {
      const result = JSON.parse(evaluateDocuments.data)
      if (result !== true) {
        return false
      } else {
        return result
      }
    }

  }
}