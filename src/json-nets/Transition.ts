import { combineAssignments } from '@/util/util'
import { evaluate, evaluateExpression, jsonnetify } from '@/util/jsonnet.js'
import type { Arc, FilterAssignment } from './Arc'
import type { JSONValue } from '@/util/jsonOperations'
import { checkForConflict, sortByOrder } from '@/util/jsonPointer'
import type { FragmentOperation } from './Place'


export type AssignmentRef = {
      arc: Arc // 
      assignmentIndex: number
    }

/**
 * Creates a new Transition object.
 * @param {String} id ID of the transition.
 * @param {String} name Name of the transition.
 */
export class Transition {
  readonly id: string
  public name: string
  public preset: Array<Arc>
  public postset: Array<Arc>
  // private _state: Record<string, JSONValue> 
  public guard: string
  public preface: string
  public fragmentVarSnippets: Record<string, string>
  public keyVarSnippets: Record<string, string>

  constructor(id: string, name:string) {
    this.id = id
    this.name = name
    this.preset = []
    this.postset = []
    // this._state = {} // Save each variable
    this.guard = 'true',
    this.preface = ''
    this.fragmentVarSnippets = {}
    this.keyVarSnippets = {}
  }

  connectArc(arc: Arc) {
    if (arc.type === 'preset') {
      this.preset.push(arc)
    } else if (arc.type === 'postset') {
      // existing snippets are not overwritten (important for imports)
      if (!this.fragmentVarSnippets[arc.fragmentVarName]) {
        this.fragmentVarSnippets[arc.fragmentVarName] = 'local ' + arc.fragmentVarName + ' = {};';
      }
      if(!this.keyVarSnippets[arc.keyVarName]) {
        this.keyVarSnippets[arc.keyVarName] = "local " + arc.keyVarName + " = '-';";
      }
      this.postset.push(arc)
    }
  }

  updateSnippets(oldNames: { fragment: string, key: string, token: string}, newNames: { fragment: string, key: string, token: string }) {
    let newGuard = this.guard;
    newGuard = newGuard.replace(oldNames.fragment, newNames.fragment);
    newGuard = newGuard.replace(oldNames.key, newNames.key);
    newGuard = newGuard.replace(oldNames.token, newNames.token);
    this.guard = newGuard;

    let newPreface = this.preface;
    newPreface = newPreface.replace(oldNames.fragment, newNames.fragment);
    newPreface = newPreface.replace(oldNames.key, newNames.key);
    newPreface = newPreface.replace(oldNames.token, newNames.token);
    this.preface = newPreface;

    if(this.fragmentVarSnippets[oldNames.fragment]) {
      let newFragmentSnippet = this.fragmentVarSnippets[oldNames.fragment];
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.fragment, newNames.fragment);
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.key, newNames.key);
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.token, newNames.token);
      delete this.fragmentVarSnippets[oldNames.fragment]
      this.fragmentVarSnippets[newNames.fragment] = newFragmentSnippet;
    }

    if(this.keyVarSnippets[oldNames.key]) {
      let newKeySnippet = this.keyVarSnippets[oldNames.key];
      newKeySnippet = newKeySnippet.replace(oldNames.fragment, newNames.fragment);
      newKeySnippet = newKeySnippet.replace(oldNames.key, newNames.key);
      newKeySnippet = newKeySnippet.replace(oldNames.token, newNames.token);
      delete this.keyVarSnippets[oldNames.key]
      this.keyVarSnippets[newNames.key] = newKeySnippet;
    }

  }

  disconnectArc(arc: Arc) {
    if (arc.type === 'preset') {
      this.preset = this.preset.filter((currentArc) => {
        return currentArc.id !== arc.id
      })
    } else if (arc.type === 'postset') {
      this.postset = this.postset.filter((currentArc) => {
        if (currentArc.id !== arc.id) {
          delete this.fragmentVarSnippets[arc.fragmentVarName]
          delete this.keyVarSnippets[arc.keyVarName]
          return true;
        } else {
          return false;
        }
      })
    }
  }

  fire() {
    for (let i = 0; i < this.preset.length; i++) {
      // todo: order by path expression order, use batch operation method!
      const arc = this.preset[i];
      arc.place.removeFragment(arc.currentAssignment.pathExpression, false);
    }

    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      arc.place.insertFragment(arc.currentAssignment.pathExpression, arc.currentAssignment.fragment, arc.currentAssignment.key, false);
    }
  }

  // clearAssignment() {
    // for (var variableKey in this._state) {
      // if (this._state.hasOwnProperty(variableKey)) {
        // delete this._state[variableKey];
      // }
    // }
  // }

  // todo: distinguish between logic for ui and net
  // updateAssignment() {
    // this.clearAssignment();
    //todo: more efficient with per arc assignment management
    // const arcs = this.preset.concat(this.postset);

    // for (let i = 0; i < arcs.length; i++) {
      // const arc = arcs[i]
      // const fragment = arc.currentAssignment.fragment;
      // const key = arc.currentAssignment.key;
      // const token = arc.currentAssignment.token;

      // this._state[arc.fragmentVarName] = fragment;
      // this._state[arc.keyVarName] = key;
      // this._state[arc.tokenVarName] = token;
    // }

  // }
  hasAnyCompleteAssignment() {
    const arcs = this.preset.concat(this.postset);
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const assignments = arc.applyFilterExpression(arc.filterExpression);
      if (assignments.length === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks whether all connected preset arcs have
   * valid documents in their connected places
   * And all connected postset arc can create valid documents.
   */
  isEnabledForCurrentAssignment() {
    if (!this.hasAnyCompleteAssignment()) return false;

    let variables: Record<string, JSONValue> = {};
    // assemble variables based on selected assignment
    for (let i = 0; i < this.preset.length; i++) {
      const arc = this.preset[i];
      variables[arc.keyVarName] = arc.currentAssignment.key;
      variables[arc.fragmentVarName] = arc.currentAssignment.fragment;
      variables[arc.tokenVarName] = arc.currentAssignment.token;
      // arc.place.removeFragment(arc.currentAssignment.pathExpression, true)
      //TODO: batch operations, input and output arc
      // Todo check fragment removal and adding
      // arc.place.removeFragment()
    }
    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      variables[arc.tokenVarName] = arc.currentAssignment.token;
      let fragmentSnippet = this.preface;
      fragmentSnippet += this.fragmentVarSnippets[arc.fragmentVarName] + arc.fragmentVarName; 
      const fragmentResult = evaluateExpression(fragmentSnippet, variables, this.name);
      if (fragmentResult.hasError) return false;
      variables[arc.fragmentVarName] = fragmentResult.evaluation;
      arc.currentAssignment.fragment = fragmentResult.evaluation;

      let keySnippet = this.preface;
      keySnippet += this.keyVarSnippets[arc.keyVarName] + arc.keyVarName;
      const keyResult = evaluateExpression(keySnippet, variables, this.name);
      if (keyResult.hasError) return false;
      variables[arc.keyVarName] = keyResult.evaluation;
      arc.currentAssignment.key = fragmentResult.evaluation;
      // let fragmentSnippet = this.preface + this.fragmentVarSnippets[arc.fragmentVarName];
      // arc.place.insertFragment()
    }


    let inscription = this.preface;
    // todo: currently, users MAY have (though unlikely) defined
    // additional stuff/variables in jsonnet var snippets
    inscription += this.guard;
    const result = evaluateExpression(inscription, variables, this.name);
    if (result.hasError) return false;
    if (!result.evaluation === true) return false;

    // handle preset and preset/postset arcs
    const postsetArcWithPlaceInPreset = [];
    for (let i = 0; i < this.preset.length; i++) {
      const arc = this.preset[i];
      // check if place is also postset
      let placeIsPostset = false;
      let postsetArc = null;
      for (let j = 0; j < this.postset.length; j++) {
        const pArc = this.postset[j];
        if (pArc.place.id === arc.place.id) {
          postsetArcWithPlaceInPreset.push(pArc.id)
          placeIsPostset = true;
          postsetArc = pArc;
        }
      }
      if (placeIsPostset && postsetArc) {
        // handling places that are in preset and postset
        let pathExpressions = [];
        pathExpressions.push(arc.currentAssignment.pathExpression)
        pathExpressions.push(postsetArc.currentAssignment.pathExpression)

        // TODO: fix in concept/diss => I guess conflict is notrelevant for one transition
        // only in case of parallel firing...
        // if (checkForConflict(pathExpressions[0], pathExpressions[1])) return false;

        pathExpressions = sortByOrder(pathExpressions, arc.place.marking);
       const insertOperation: FragmentOperation = {
          // fragment: arc.currentAssignment.fragment,
          // key: arc.currentAssignment.key,
          pathExpression: arc.currentAssignment.pathExpression,
          type: 'remove'
        }

        const removeOperation: FragmentOperation = {
          fragment: postsetArc.currentAssignment.fragment,
          key: postsetArc.currentAssignment.key,
          pathExpression: postsetArc.currentAssignment.pathExpression,
          type: 'insert'
        }

        const operations = [];
        if (pathExpressions[0] === arc.currentAssignment.pathExpression) {
          // preset expression is higher order
          operations.push(removeOperation);
          operations.push(insertOperation);
        } else {
          operations.push(insertOperation);
          operations.push(removeOperation);
        }
 
        const result = arc.place.batchOperation(operations, true);
        if(!result) return false;

      } else {
        // check removal of fragment
        const result = arc.place.removeFragment(arc.currentAssignment.pathExpression, true);
        if (!result) return false;
      }
    }
    
    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      // places that are in preset and postset have been handled before
      if (postsetArcWithPlaceInPreset.includes(arc.id)) continue;

      const result = arc.place.insertFragment(arc.currentAssignment.pathExpression, arc.currentAssignment.fragment, arc.currentAssignment.key, true)
      if (!result) return true;
    }

    return true;
  }

  // occur() {
    // for (let i = 0; i < this.preset.length; i++) {
      // this.preset[i].occur(this._state[this.preset[i].place.name.toLowerCase()])
    // }
    // this.postset.forEach((arc) => arc.occur())

  // }

  /**
   * Finds a valid assignment of documents to filters.
   * Based on filter expressions and transition inscriptions.
   */
  findAssignment() {
    console.log('find assignmetn')
    if (!this.hasAnyCompleteAssignment()) return false;
    const assignmentRefsPerArc: Array<Array<AssignmentRef>> = []

    const arcs = this.preset.concat(this.postset);
    for (let i = 0; i < arcs.length; i++) {
      const assignmentRefs: Array<AssignmentRef> = [];
      const arc = arcs[i];
      const assignments = arc.applyFilterExpression(arc.filterExpression);
      for (let j = 0; j < assignments.length; j++) {
        assignmentRefs.push({
          arc: arc,
          assignmentIndex: j
        })
      }
      assignmentRefsPerArc.push(assignmentRefs);
    }

    const combinations = combineAssignments(assignmentRefsPerArc);
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i]
      for (let j = 0; j < combination.length; j++) {
        const assignmentRef = combination[j];
        const arc = assignmentRef.arc; 
        // const arc = arcs.find((fArc) => { fArc.id === assignmentRef.arcID})
        // if (!arc) return false;
        arc.assignFilter(arc.filterAssignments[assignmentRef.assignmentIndex])
        if (this.isEnabledForCurrentAssignment()) {
          return true;
        }
        // next step: isEnabled()
      }
    }
    return false;
      // const state: Record<string, JSONValue> = {}
      // let anyMarkingInvalid = false;
      // for (let j = 0; j < combination.length; j++) {
        // const currentVarNames = varNames[j]
        // const currentAssignment = <FilterAssignment>combination[j]
        // const currentArc = allArcs[j];
        // currentArc.assignFilter(currentAssignment);
        // state[currentVarNames.key] = currentAssignment.key;
        // state[currentVarNames.fragment] = currentAssignment.fragment;
        // state[currentVarNames.token] = currentAssignment.token;
// 
        // let markingValid;
        // if (currentArc.type === 'preset') {
          // markingValid = currentArc.place.removeFragment(currentAssignment.pathExpression, true)
        // } else {
          // markingValid = currentArc.place.insertFragment(currentAssignment.pathExpression, currentAssignment.fragment, currentAssignment.key, true)
        // }
// 
        // if (!markingValid) {
          // anyMarkingInvalid = true;
          // break;
        // }
// 
      // }
      // transition inscription must be true
      // if (this.evaluate(state) && !anyMarkingInvalid) {
        
        // return state
      // }
    // }
    // return false

    // this.clearAssignment()
    // const varNames = []
    // const allAssignments: Array<Array<FilterAssignment>> = [];
    // const documents = []
    // const allArcs = this.preset.concat(this.postset);
    // for (let i = 0; i < allArcs.length; i++) {
      // const arc = allArcs[i]
      // const arcAssignments = arc.applyFilterExpression(arc.filterExpression)
      // applyFilter();
      // if (arcAssignments.length == 0) {
        // return false
      // } else {
        // allAssignments.push(arcAssignments)
        // varNames.push({ key: arc.keyVarName, fragment: arc.fragmentVarName, token: arc.tokenVarName })
      // }
    // }

    // const combinations = combineArrays(allAssignments)
// 

  }

  /**
   * Evaluates the inscribed Jsonnet expression with the given state.
   * Returns true if the transition can occur, false otherwise.
   */
//  evaluate(state: Record<string, JSONValue>): boolean {
//    const evaluation = evaluateExpression(this.guard, state, this.name);
//    return evaluation.evaluation;
//  }
}