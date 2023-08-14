import type {EvaluationResult } from '@/util/jsonnet.js'
import type { JSONValue } from '@/util/jsonOperations'
import type { Arc } from './Arc'
import type { FragmentOperation } from './Place'
import type { FireEvent } from './Net'

import { combineAssignments } from '@/util/util'
import { evaluateExpression } from '@/util/jsonnet.js'
import { sortByOrder } from '@/util/jsonPointer'


export type AssignmentRef = {
      arc: Arc
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
  public valueVarSnippets: Record<string, string>
  public keyVarSnippets: Record<string, string>

  constructor(id: string, name:string) {
    this.id = id
    this.name = name
    this.preset = []
    this.postset = []
    this.guard = 'true',
    this.preface = ''
    this.valueVarSnippets = {}
    this.keyVarSnippets = {}
  }

  connectArc(arc: Arc) {
    if (arc.type === 'preset') {
      this.preset.push(arc)
    } else if (arc.type === 'postset') {
      // existing snippets are not overwritten (important for imports)
      if (!this.valueVarSnippets[arc.valueVarName]) {
        this.valueVarSnippets[arc.valueVarName] = 'local ' + arc.valueVarName + ' = {};';
      }
      if(!this.keyVarSnippets[arc.keyVarName]) {
        this.keyVarSnippets[arc.keyVarName] = "local " + arc.keyVarName + " = '-';";
      }
      this.postset.push(arc)
    }
  }

  updateSnippets(oldNames: { value: string, key: string, token: string}, newNames: { value: string, key: string, token: string }) {
    let newGuard = this.guard;
    newGuard = newGuard.replace(oldNames.value, newNames.value);
    newGuard = newGuard.replace(oldNames.key, newNames.key);
    newGuard = newGuard.replace(oldNames.token, newNames.token);
    this.guard = newGuard;

    let newPreface = this.preface;
    newPreface = newPreface.replace(oldNames.value, newNames.value);
    newPreface = newPreface.replace(oldNames.key, newNames.key);
    newPreface = newPreface.replace(oldNames.token, newNames.token);
    this.preface = newPreface;

    if(this.valueVarSnippets[oldNames.value]) {
      let newFragmentSnippet = this.valueVarSnippets[oldNames.value];
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.value, newNames.value);
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.key, newNames.key);
      newFragmentSnippet = newFragmentSnippet.replace(oldNames.token, newNames.token);
      delete this.valueVarSnippets[oldNames.value]
      this.valueVarSnippets[newNames.value] = newFragmentSnippet;
    }

    if(this.keyVarSnippets[oldNames.key]) {
      let newKeySnippet = this.keyVarSnippets[oldNames.key];
      newKeySnippet = newKeySnippet.replace(oldNames.value, newNames.value);
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
          delete this.valueVarSnippets[arc.valueVarName]
          delete this.keyVarSnippets[arc.keyVarName]
          return true;
        } else {
          return false;
        }
      })
    }
  }

  resetAssignments() {
    for (let i = 0; i < this.preset.length; i++){
      this.preset[i].resetAssignment();
    }

    for (let i = 0; i < this.postset.length; i++){
      this.postset[i].resetAssignment();
    }


  }

  fire(): Array<FireEvent> {
    const fireData: Array<FireEvent> = []
    for (let i = 0; i < this.preset.length; i++) {

      // todo: order by path expression order, use batch operation method!
      const arc = this.preset[i];
      // todo this should be reworked and part of enabled checking
      // transition can only fire if pathExpression != null
      if (arc.currentAssignment.pathExpression === null) return [];
      arc.place.removeFragment(arc.currentAssignment.pathExpression, false);
      fireData.push({ arcID: arc.id, placeID: arc.place.id, num: arc.place.marking.length })
    }

    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      if (arc.currentAssignment.pathExpression === null) return [];

      arc.place.insertFragment(arc.currentAssignment.pathExpression, arc.currentAssignment.value, arc.currentAssignment.key, false);

      fireData.push({ arcID: arc.id, placeID: arc.place.id, num: arc.place.marking.length })
    }

    return fireData;
  }

  hasCompletePresetAssignment() {
    const arcs = this.preset;
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      if (arc.currentAssignment.pathExpression === null) {
        return false;
      }
    }
    return true;
  }
  hasCompletePostsetAssignment() {
    const arcs = this.postset;
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      if (arc.currentAssignment.pathExpression === null) {
        return false;
      }
    }
    return true;
  }
  hasCompleteAssignment() {
    const arcs = this.preset.concat(this.postset);
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      if (arc.currentAssignment.pathExpression === null) {
        return false;
      }
    }
    return true;
  }
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


  assembleInputVariables(): Record<string, JSONValue> {
    let variables: Record<string, JSONValue> = {};
    // assemble variables based on selected assignment
    for (let i = 0; i < this.preset.length; i++) {
      const arc = this.preset[i];
      variables[arc.keyVarName] = arc.currentAssignment.key;
      variables[arc.valueVarName] = arc.currentAssignment.value;
      variables[arc.tokenVarName] = arc.currentAssignment.token;
      //TODO: batch operations, input and output arc
      // Todo check fragment removal and adding
    }
    return variables;
  }

  assembleOutputTokenVariables() {
    let variables: Record<string, JSONValue> = {};
    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      variables[arc.tokenVarName] = arc.currentAssignment.token;
    }
    return variables;

  }
  assembleOutputVariables(inputVariables: Record<string, JSONValue>): Record<string, JSONValue> | false {
    let outputTokenVariables: Record<string, JSONValue> = this.assembleOutputTokenVariables();
    let variables = {...inputVariables, ...outputTokenVariables};
    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      let fragmentSnippet = this.preface;
      fragmentSnippet += this.valueVarSnippets[arc.valueVarName] + arc.valueVarName; 
      const fragmentResult = evaluateExpression(fragmentSnippet, variables, this.name);
      console.log(fragmentResult)
      if (fragmentResult.hasError) return false;
      variables[arc.valueVarName] = fragmentResult.evaluation;
      arc.currentAssignment.value = fragmentResult.evaluation;

      let keySnippet = this.preface;
      keySnippet += this.keyVarSnippets[arc.keyVarName] + arc.keyVarName;
      const keyResult = evaluateExpression(keySnippet, variables, this.name);
      if (keyResult.hasError) return false;
      variables[arc.keyVarName] = keyResult.evaluation;
      arc.currentAssignment.key = fragmentResult.evaluation;
    }
    return variables;
  }

  assembleVariables() {
    let variables: Record<string, JSONValue> = this.assembleInputVariables();
    let outputVariables = this.assembleOutputVariables(variables);
    if (!outputVariables) return false;
    Object.assign(variables, outputVariables);
    return variables;
  }


  evaluateGuard(): EvaluationResult {
    const variables = this.assembleVariables();
    if (!variables) return { hasError: true, evaluation: 'Can\'t evaluate due to errors in variable expressions.'};

    let inscription = this.preface;
    // todo: currently, users MAY have (though unlikely) defined
    // additional stuff/variables in jsonnet var snippets
    inscription += this.guard;
    const result = evaluateExpression(inscription, variables, this.name);
    return result;

  }
  /**
   * Checks whether all connected preset arcs have
   * valid documents in their connected places
   * And all connected postset arc can create valid documents.
   */
  isEnabledForCurrentAssignment() {

    for (let i = 0; i < this.preset.length; i++) {

      // todo: order by path expression order, use batch operation method!
      const arc = this.preset[i];
      // todo this should be reworked and part of enabled checking
      // transition can only fire if pathExpression != null
      if (arc.currentAssignment.pathExpression === null) return false;
    }

    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      if (arc.currentAssignment.pathExpression === null) return false;
    }

    const result = this.evaluateGuard()
    if (result.hasError) return false;
    const evaluation = JSON.parse(result.evaluation)
    if (!(evaluation === true)) return false;

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
        let pathExpressions: Array<string> = [];
        if (arc.currentAssignment.pathExpression === null) return false;
        pathExpressions.push(arc.currentAssignment.pathExpression)
        if (postsetArc.currentAssignment.pathExpression === null) return false;
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
          fragment: postsetArc.currentAssignment.value,
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
        if (arc.currentAssignment.pathExpression === null) return false;
        const result = arc.place.removeFragment(arc.currentAssignment.pathExpression, true);
        if (!result) return false;
      }
    }
    
    for (let i = 0; i < this.postset.length; i++) {
      const arc = this.postset[i];
      // places that are in preset and postset have been handled before
      if (postsetArcWithPlaceInPreset.includes(arc.id)) continue;


      if (arc.currentAssignment.pathExpression === null) return false;
      const result = arc.place.insertFragment(arc.currentAssignment.pathExpression, arc.currentAssignment.value, arc.currentAssignment.key, true)
      if (!result) return true;
    }

    return true;
  }

  /**
   * Finds a valid assignment of documents to filters.
   * Based on filter expressions and transition inscriptions.
   */
  findAssignment() {
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
        arc.assignFilter(assignmentRef.assignmentIndex)
        if (this.isEnabledForCurrentAssignment()) {
          return true;
        }
      }
    }
    return false;

  }

  checkPreset() {

  }
}