import type { Place } from './Place'
import type { Transition } from './Transition'
import type { JSONValue, JSONObject, JSONSimple } from '@/util/jsonOperations'

import { getPathExpressions } from '@/util/jsonPath'
import { getEnvPathExpression, getFragment as getValue, getKey } from '@/util/jsonPointer'


type Filter = {
  filterExpression: string,
  pathExpression: string | null,
  key: string,
  value: JSONValue,
  token: JSONObject,
}

export type FilterAssignment = {
  pathExpression: string,
  key: string,
  value: JSONValue,
  token: JSONObject
}

/**
 * Creates a new preset arc that can read and may delete documents in a place
 * and wires the read data to a transition.
 * @param {Place} place Place to read documents from.
 * @param {Transition} transition Transition to wire data to.
 * @param {String} id ID of the new arc.
 */
export class Arc {
  readonly id: string
  readonly type: "preset" | "postset"
  readonly place: Place
  readonly transition: Transition
  private filter: Filter
  public filterAssignments: Array<FilterAssignment>
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
    let filterExpression = '$.*'
    if (type === "postset") {
      filterExpression = '$'
    }

    this.filter = {
      filterExpression,
      pathExpression: null,
      key: '',
      value: '',
      token: {}
    }
    this.filterAssignments = this.applyFilterExpression(this.filter.filterExpression);
  }

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

  private camelize(str: string): string {
    return str.replace(/\W+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
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
   * Returns a subset of documents from the connected place.
   * Documents are filtered by the inscribed JSONPath-expression.
   */
  applyFilterExpression(filterExpression: string): Array<FilterAssignment> {
    const marking = this.place.marking;

    const filterAssignments:Array<FilterAssignment> = [];
    const pathExpressions = getPathExpressions(marking, filterExpression);

    for (let i = 0; i < pathExpressions.length; i++) {
      const pathExpression = pathExpressions[i]
      const key = getKey(pathExpression);
      const envPathExpression = getEnvPathExpression(pathExpression);
      const value = getValue(marking, pathExpression);
      const token = getValue(marking, envPathExpression);
      filterAssignments.push({ pathExpression, key, value: value, token })
    }
    this.filterAssignments = filterAssignments;
    return filterAssignments;
  }

  set filterExpression(filterExpression: string) {
    this.filter.filterExpression = filterExpression;
    this.resetAssignment();
  }

  get filterExpression(): string {
    return this.filter.filterExpression
  }

  get currentAssignment() {
    return {
      pathExpression: this.filter.pathExpression,
      key: this.filter.key,
      value: this.filter.value,
      token: this.filter.token
    }
  }

  assignFilter(index: number) {
    const assignment = this.filterAssignments[index];
    this.filter.pathExpression = assignment.pathExpression
    this.filter.token = assignment.token;

    if (this.type === 'preset') {
      this.filter.key = assignment.key;
      this.filter.value = assignment.value;
    }
  }

  assignKeyValueFilter(key: string, value: JSONValue) {
    this.filter.key = key;
    this.filter.value = value;
  }

  assignFilterByPath(path: string) {
    const assignment = this.filterAssignments.find((assignment) => {
      return assignment.pathExpression === path

    })
    if(!assignment) return false;
    this.filter.pathExpression = assignment.pathExpression
    this.filter.token = assignment.token;

    if (this.type === 'preset') {
      this.filter.key = assignment.key;
      this.filter.value = assignment.value;
    }

  }

  resetAssignment() {
    this.filter.pathExpression = null;
    this.filter.key = '';
    this.filter.value = '';
    this.filter.token = {};
  }

}

