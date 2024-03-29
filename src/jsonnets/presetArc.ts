/** @typedef {import('./transition').Transition} Transition */
/** @typedef {import('./place').Place} Place */
import { query } from '@/util/jsonPath'
import type { Place } from './place'
import type { Transition } from './transition'

export const PRESET_ARC_TYPE_CONSUME = 'consume'
export const PRESET_ARC_TYPE_READ = 'read'

export interface PresetArcLabel {
  type: string, 
  filter: string 
}

/**
 * Creates a new preset arc that can read and may delete documents in a place
 * and wires the read data to a transition.
 * @param {Place} place Place to read documents from.
 * @param {Transition} transition Transition to wire data to.
 * @param {String} id ID of the new arc.
 */
export class PresetArc {
  id: string
  type: string
  place: Place
  transition: Transition
  label: PresetArcLabel
  constructor(place: Place, transition: Transition, id: string) {
    this.id = id
    this.type = 'preset'
    this.place = place
    this.transition = transition
    this.label = {
      type: PRESET_ARC_TYPE_CONSUME,
      filter: ''
    }
  }

  /**
   * Returns a subset of documents from the connected place.
   * Documents are filtered by the inscribed JSONPath-expression.
   * @method
   * @name PresetArc#applyFilter
   * @return {Array}
   */
  applyFilter() {
    const documents = this.place.content.data
    //TODO: jsonPath query functin was updated, this if condition may not be necessary any more
    if (this.label.filter === '') {
      return documents
    } else {
      const filteredDocuments = query(documents, this.label.filter)
      return filteredDocuments
    }

  }

  /**
   * Removes the given document from the connected place
   * (if this arc is of consume type).
   * @method
   * @param {Object} document
   * @name PresetArc#occur
   */
  occur(document: Object) {
    if (this.label.type === PRESET_ARC_TYPE_CONSUME) {
      const index = this.place.content.data.indexOf(document)
      this.place.content.data.splice(index, 1)
    }
  }
}

