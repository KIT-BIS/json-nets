import { getPathExpressions, query } from '@/util/jsonPath'
import type { Place } from './Place'
import type { Transition } from './Transition'
import type { JSONValue, JSONObject } from '@/util/jsonOperations'
import { getEnvPathExpression, getFragment, getKey } from '@/util/jsonPointer'


type Filter = {
  filterExpression: string,
  pathExpression: string | null,
  key: string | null,
  fragment: JSONValue | null,
  token: JSONObject | null,
}

export type FilterAssignment = {
  pathExpression: string,
  key: string,
  fragment: JSONValue,
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
  readonly filterAssignments: Array<FilterAssignment>
  private _tokenVarName: string
  private _fragmentVarName: string
  private _keyVarName: string


  constructor(place: Place, transition: Transition, type: "preset" | "postset", id: string) {
    this.id = id
    this.type = type;
    this.place = place
    this.transition = transition
    this._tokenVarName = '';
    this._fragmentVarName = '';
    this._keyVarName = '';
    this.updateVarNames(this.place.name);

    this.filter = {
      filterExpression: '$.*',
      pathExpression: null,
      key: null,
      fragment: null,
      token: null
    }
    this.filterAssignments = this.applyFilter();
  }

  // Todo: remember to update var names when place name changes
  updateVarNames(placeName: string) {
    const baseName = this.camelize(placeName);
    let suffix;
    if (this.type === 'preset') {
      suffix = 'Out';
    } else {
      suffix = 'In';
    }
    
    this._tokenVarName = baseName + suffix;
    this._fragmentVarName = baseName + 'Frament' + suffix;
    this._keyVarName = baseName + 'Key' + suffix;
  }

  private camelize(str: string): string {
    return str.replace(/\W+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
  }

  get tokenVarName() {
    return this._tokenVarName
  }

  get fragmentVarName() {
    return this._fragmentVarName;
  }

  get keyVarName() {
    return this._keyVarName;
  }

  /**
   * Returns a subset of documents from the connected place.
   * Documents are filtered by the inscribed JSONPath-expression.
   */
  applyFilter(): Array<FilterAssignment> {
    const marking = this.place.marking;

    const filterAssignments:Array<FilterAssignment> = [];
    const pathExpressions = getPathExpressions(marking, this.filter.filterExpression);

    for (let i = 0; i < pathExpressions.length; i++) {
      const pathExpression = pathExpressions[i]
      const key = getKey(pathExpression);
      const envPathExpression = getEnvPathExpression(pathExpression);
      const fragment = getFragment(marking, pathExpression);
      const token = getFragment(marking, envPathExpression);
      filterAssignments.push({ pathExpression, key, fragment, token })
    }
    return filterAssignments;
  }

  set filterExpression(filterExpression: string) {
    this.filter.filterExpression = filterExpression;
    this.resetAssignment();
  }

  get currentAssignment() {
    return {
      pathExpression: this.filter.pathExpression,
      key: this.filter.key,
      fragment: this.filter.fragment,
      token: this.filter.token
    }
  }

  assignFilter(assignment: FilterAssignment) {
    this.filter.pathExpression = assignment.pathExpression
    this.filter.key = assignment.key;
    this.filter.fragment = assignment.fragment;
    this.filter.token = assignment.token;
  }

  resetAssignment() {
    this.filter.key = null;
    this.filter.fragment = null;
    this.filter.token = null;
  }

}

