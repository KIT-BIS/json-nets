import type { JSONObject, JSONMarking, JSONValue } from "@/util/jsonOperations";
import type { CheckResult } from "./Schema"

import { deepInsert, deepRemove } from "@/util/jsonOperations"

import { Schema } from "./Schema"
import { checkSchema } from "@/util/jsonSchema"

export type FragmentOperation = {
  type: "remove"
  pathExpression: string
} | {
  type: "insert"
  pathExpression: string
  fragment: JSONValue
  key: string | number
}


export class Place {
  readonly id: string
  private _name: string
  private _schema: Schema 
  public marking: JSONMarking

  /**
   * Create a new place.
   * @param {String} id ID of the place.
   * @param {String} name Name of the place.
   */
  constructor(id: string, name: string) {
    this.id = id // id of the place
    this._name = name // name of the place
    this._schema = new Schema(id, { $id: id, type: "array", items: { type: "object"} })
    this.marking = []
  }

  set name(name: string) {

    this._name = name;
  }


  get name() {
    return this._name;
  }

  // expects 
  set schema(schema: JSONObject) {
    const arraySchema = { $id: this.id, type: "array", items: schema }
    this._schema.update(arraySchema)
  }

  get schema(): JSONObject {
    return this._schema.schema;
  }

  // todo: probably move this to schema class?
  validateSchema(schema: JSONObject) {
    return checkSchema(JSON.stringify(schema));
  }

  validateToken(token: JSONObject): CheckResult {
    return this._schema.validateMarking([token])
  }

  validateMarking(marking: JSONMarking): CheckResult {
    return this._schema.validateMarking(marking);
  }

  insertValue(pathExpression: string, fragment: JSONValue, key: string | number, check = false) {
    if (!check) {
      deepInsert(pathExpression, this.marking, key, fragment);
      return true;
    } else {
      // Todo: this is probably to be solved smarter ... may run into performance issues here with large markings
      const markingCopy = <JSONMarking>JSON.parse(JSON.stringify(this.marking));
      const markingToCheck = <JSONMarking>deepInsert(pathExpression, markingCopy, key, fragment)
      return this._schema.validateMarking(markingToCheck);
    }
  }

  removeValue(pathExpression: string, check = false) {
    if (!check) {
      deepRemove(pathExpression, this.marking)
      return true;
    } else {
      const markingCopy = <JSONMarking>JSON.parse(JSON.stringify(this.marking));
      const markingToCheck = <JSONMarking>deepRemove(pathExpression, markingCopy)
      return this._schema.validateMarking(markingToCheck);

    }
  }

  batchOperation(fragmentOperations: Array<FragmentOperation>, check = false) {
    if (!check) {
      for (let i = 0; i < fragmentOperations.length; i++) {
        const operation = fragmentOperations[i]
        if (operation.type === 'insert') {
          deepInsert(operation.pathExpression, this.marking, operation.key, operation.fragment);
        } else if (operation.type === 'remove') {
          deepRemove(operation.pathExpression, this.marking)
        }
      }
    } else {
      const markingCopy = <JSONMarking>JSON.parse(JSON.stringify(this.marking));
      for (let i = 0; i < fragmentOperations.length; i++) {
        const operation = fragmentOperations[i]
        if (operation.type === 'insert') {
          deepInsert(operation.pathExpression, markingCopy, operation.key, operation.fragment);
        } else if (operation.type === 'remove') {
          deepRemove(operation.pathExpression, markingCopy)
        }
      }
      return this._schema.validateMarking(markingCopy);
    }
  }
}
