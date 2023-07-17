import { combineArrays } from '@/util/util'
import { evaluate, evaluateExpression, jsonnetify } from '@/util/jsonnet.js'
import type { Arc, FilterAssignment } from './Arc'
import type { JSONValue } from '@/util/jsonOperations'

/**
 * Creates a new Transition object.
 * @param {String} id ID of the transition.
 * @param {String} name Name of the transition.
 */
export class Transition {
  readonly id: string
  public name: string
  readonly preset: Array<Arc>
  readonly postset: Array<Arc>
  private _state: Record<string, JSONValue> 
  readonly inscription: string

  constructor(id: string, name:string) {
    this.id = id
    this.name = name
    this.preset = []
    this.postset = []
    this._state = {} // Save each variable
    this.inscription = 'true'
  }

  connectArc(arc: Arc) {
    if (arc.type === 'preset') {
      this.preset.push(arc)
    } else if (arc.type === 'postset') {
      this.postset.push(arc)
    }
  }

  clearAssignment() {
    for (var variableKey in this._state){
        if (this._state.hasOwnProperty(variableKey)){
            delete this._state[variableKey];
        }
    }
  }

  // todo: distinguish between logic for ui and net
  updateAssignment() {
    this.clearAssignment();
    //todo: more efficient with per arc assignment management
    const arcs = this.preset.concat(this.postset);
  
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i]
      const fragment = arc.currentAssignment.fragment;
      const key = arc.currentAssignment.key;
      const token = arc.currentAssignment.token;

      this._state[arc.fragmentVarName] = fragment;
      this._state[arc.keyVarName] = key;
      this._state[arc.tokenVarName] = token;
    }

  }

  /**
   * Checks whether all connected preset arcs have
   * valid documents in their connected places
   * And all connected postset arc can create valid documents.
   */
  isEnabled() {
    this.clearAssignment();
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
      this._state = assignment
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
      this.preset[i].occur(this._state[this.preset[i].place.name.toLowerCase()])
    }
    this.postset.forEach((arc) => arc.occur())

  }

  /**
   * Finds a valid assignment of documents to filters.
   * Based on filter expressions and transition inscriptions.
   */
  findAssignment() {
    // this.clearAssignment()
    const varNames = []
    const allAssignments: Array<Array<FilterAssignment>> = [];
    // const documents = []
    const allArcs = this.preset.concat(this.postset);
    for (let i = 0; i < allArcs.length; i++) {
      const arc = allArcs[i]
      const arcAssignments = arc.applyFilter();
      if (arcAssignments.length == 0) {
        return false
      } else {
        allAssignments.push(arcAssignments)
        varNames.push({ key: arc.keyVarName, fragment: arc.fragmentVarName, token: arc.tokenVarName })
      }
    }

    const combinations = combineArrays(allAssignments)

    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i]
      const state:Record<string, JSONValue> = {}
      let anyMarkingInvalid = false;
      for (let j = 0; j < combination.length; j++) {
        const currentVarNames = varNames[j]
        const currentAssignment = <FilterAssignment>combination[j]
        const currentArc = allArcs[j];
        currentArc.assignFilter(currentAssignment);
        state[currentVarNames.key] = currentAssignment.key;
        state[currentVarNames.fragment] = currentAssignment.fragment;
        state[currentVarNames.token] = currentAssignment.token;

        let markingValid;
        if (currentArc.type === 'preset') {
          markingValid = currentArc.place.removeFragment(currentAssignment.pathExpression, true)
        } else {
          markingValid = currentArc.place.insertFragment(currentAssignment.pathExpression, currentAssignment.fragment, currentAssignment.key, true) 
        }

        if (!markingValid) {
          anyMarkingInvalid = true;
          break;
        }
        
      }
      // transition inscription must be true
      if (this.evaluate(state) && !anyMarkingInvalid) {
        // 
        return state
      }
    }
    return false
  }

  /**
   * Evaluates the inscribed Jsonnet expression with the given state.
   * Returns true if the transition can occur, false otherwise.
   */
  evaluate(state: Record<string, JSONValue>): boolean {
    const evaluation = evaluateExpression(this.inscription, state, this.name);
    return evaluation.evaluation;
  }
}