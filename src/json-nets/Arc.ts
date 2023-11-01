import type { Place } from './Place'
import type { Transition } from './Transition'
import type { JSONValue, JSONObject  } from '@/util/jsonOperations'

import { getPathExpressions } from '@/util/jsonPath'
import { getEnvPathExpression, getFragment as getValue, getKey } from '@/util/jsonPointer'


//type Filter = {
//  filterExpression: string,
//  pathExpression: string | null,
//  key: string,
//  value: JSONValue,
//  token: JSONObject,
//}
//
//export type FilterAssignment = {
//  pathExpression: string,
//  key: string,
//  value: JSONValue,
//  token: JSONObject
//}

export class Arc {
  readonly id: string
  readonly type: "preset" | "postset"
  readonly place: Place
  readonly transition: Transition

  private _filterExpression: string
  public pathExpressions: Array<string>
  public assignedPathExpression: string | null
  // public filterAssignments: Array<FilterAssignment>
  public keyVarValue: string
  public valueVarValue: JSONValue
  public tokenVarValue: JSONObject

  private _tokenVarName: string
  private _valueVarName: string
  private _keyVarName: string


  constructor(place: Place, transition: Transition, type: "preset" | "postset", id: string) {
    this.id = id
    this.type = type;
    this.place = place
    this.transition = transition
    this._tokenVarName = '';
    this._valueVarName = '';
    this._keyVarName = '';
    this.updateVarNames(this.place.name, true);
    this._filterExpression = '$.*'
    if (type === "postset") {
      //this._filterExpression = '$'
      this._filterExpression = '$.*'
    }

    this.assignedPathExpression = null;
    this.keyVarValue = '';
    this.valueVarValue = '';
    this.tokenVarValue = {};

    this.pathExpressions = this.applyFilterExpression(this._filterExpression);
  }

  /**
   * Generates/Updates the name of variables to be used in jsonnet expressions by camelizing the given place name.
   * With initial = false, will search/replace old variable names with new variable names in jsonnet expressions.
   * 
   * @param placeName Name of the connected place.
   * @param initial Whether this is the first generation of variable names.
   */
  updateVarNames(placeName: string, initial = false) {
    const baseName = this.camelize(placeName);
    let prefix;
    if (this.type === 'preset') {
      prefix = 'input_';
    } else {
      prefix = 'output_';
    }
    
    const oldNames = {
      token: this._tokenVarName,
      key: this._keyVarName,
      value: this._valueVarName
    }
    this._tokenVarName = prefix + baseName + '_token';
    this._valueVarName = prefix + baseName + '_value';
    this._keyVarName = prefix + baseName + '_key';

    const newNames = {
      token: this._tokenVarName,
      key: this._keyVarName,
      value: this._valueVarName
    }

    if (!initial) {
      this.transition.updateSnippets(oldNames, newNames);
    }
  }

  /**
   * Camelizes a string. E.g. "Very Important Place" to "veryImportantPlace".
   * @param str The string to be camelized.
   * @returns The camelized string.
   */
  private camelize(str: string): string {
    const camelized = str.replace(/\W+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
    const firstLetterLowerCase = camelized.charAt(0).toLowerCase() + camelized.slice(1)
    return firstLetterLowerCase;
  }

  get tokenVarName() {
    return this._tokenVarName
  }

  get valueVarName() {
    return this._valueVarName;
  }

  get keyVarName() {
    return this._keyVarName;
  }

  /**
   * Applies the filter expression of the arc to the connected place marking. 
   * Generates a set of path expressions, which is stored in the arc and also returned by the function.
   * @param filterExpression 
   * @returns 
   */
  applyFilterExpression(filterExpression: string): Array<string> {
    const marking = this.place.marking;

    // const pathExpressions:Array<string> = [];
    const pathExpressions = getPathExpressions(marking, filterExpression);

    //for (let i = 0; i < pathExpressions.length; i++) {
    //  const pathExpression = pathExpressions[i]
    //  pathExpressions.push({ pathExpression, key, value: value, token })
    //}
    this.pathExpressions = pathExpressions;
    return pathExpressions;
  }

  /**
   * Assigns values to the arc variables based on a given index of the stored pathExpressions array. 
   * @param index Index of the pathExpressions array.
   * @returns For postset arcs, the assigned token value, for preset arcs all values.
   */
  assignVariablesByIndex(index: number) {
    const pathExpression = this.pathExpressions[index];
    // this.assignedPathExpression = pathExpression

    return this.assignVariablesByPathExpression(pathExpression);
  }

  assignTokenVariableByIndex(index: number) {
    const pathExpression = this.pathExpressions[index];
    // this.assignedPathExpression = pathExpression

    return this.assignTokenVariableByPathExpression(pathExpression);
  }

 
  /**
   * Assigns key, token and value - values by applying a given path expression 
   * to the connected place marking (to be used with preset arcs).
   * @param pathExpression The pathexpression that selects the corresponding values.
   * @returns An Object that contains the assigned key, value and token values.
   */
  assignVariablesByPathExpression(pathExpression: string) {
    const marking = this.place.marking;
    this.assignedPathExpression = pathExpression;

    this.keyVarValue = getKey(pathExpression);
    this.valueVarValue = getValue(marking, pathExpression);
    const envPathExpression = getEnvPathExpression(pathExpression);
    this.tokenVarValue = getValue(marking, envPathExpression);

    return { key: this.keyVarValue, value: this.valueVarValue, token: this.tokenVarValue }
  }
  
  /**
   * Assigns a token value by applying a given path expression
   * to the connected place marking (to be used with postset arcs) .
   * @param pathExpression The pathexpression that selects the corresponding value.
   * @returns An Object that contains the assigned token value.
   */
  assignTokenVariableByPathExpression(pathExpression: string) {
    const marking = this.place.marking;
    this.assignedPathExpression = pathExpression;

    const envPathExpression = getEnvPathExpression(pathExpression);
    this.tokenVarValue = getValue(marking, envPathExpression);

    return { token: this.tokenVarValue }

  }

  /**
   * Assigns values to the key and value vars of the arc. 
   * (To be used with postset arcs).
   * @param key Key value to be assigned.
   * @param value Token value to be assigned.
   */
  assignKeyAndValueVariables(key: string, value: JSONValue) {
    this.keyVarValue = key;
    this.valueVarValue = value;
  }

  resetAssignment() {
    this.assignedPathExpression = null;
    this.keyVarValue = '';
    this.valueVarValue = '';
    this.tokenVarValue = {};
  }

  set filterExpression(filterExpression: string) {
    this._filterExpression = filterExpression;
    this.resetAssignment();
  }

  get filterExpression(): string {
    return this._filterExpression
  }

  //get currentAssignment() {
  //  return {
  //    pathExpression: this.filter.pathExpression,
  //    key: this.filter.key,
  //    value: this.filter.value,
  //    token: this.filter.token
  //  }
  //}




  //assignFilterByPath(path: string) {
  //  const assignment = this.filterAssignments.find((assignment) => {
  //    return assignment.pathExpression === path

  //  })
  //  if(!assignment) return false;
  //  this.filter.pathExpression = assignment.pathExpression
  //  this.filter.token = assignment.token;

  //  if (this.type === 'preset') {
  //    this.filter.key = assignment.key;
  //    this.filter.value = assignment.value;
  //  }

  //}



}

