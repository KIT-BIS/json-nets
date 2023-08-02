import { unCacheSchema } from "@/util/jsonSchema";
import { Arc } from "./Arc";
import { Place } from "./Place";
import { Transition } from "./Transition";
import type { JSONMarking, JSONObject, JSONValue } from "@/util/jsonOperations";

import { v4 as uuid } from 'uuid'

export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE'
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE'
export const EVENT_UPDATE_PLACE = 'EVENT_UPDATE_PLACE'

export const EVENT_ADD_TRANSITION = 'EVENT_ADD_TRANSITION'
export const EVENT_REMOVE_TRANSITION = 'EVENT_REMOVE_TRANSITION'
export const EVENT_UPDATE_TRANSITION = 'EVENT_UPDATE_TRANSITION'

export const EVENT_CONNECT = 'EVENT_CONNECT'
export const EVENT_DISCONNECT = 'EVENT_DISCONNECT'

export const EVENT_FIRE_ADD_FRAGMENT = 'EVENT_FIRE_ADD_FRAGMENT'
export const EVENT_FIRE_REMOVE_FRAGMENT = 'EVENT_FIRE_REMOVE_FRAGMENT' 

export const EVENT_NET_IMPORTED = 'EVENT_NET_IMPORTED'

// Typescript config to make the class available as global property in typescript
//declare module '@vue/runtime-core' {
//  interface ComponentCustomProperties {
//    $net: Net
//  }
//}
//export {}
export type TransitionData = {
    name: string,
    id: string,
    preface: string,
    guard: string
}

// not sure if this actually ensures an app-wide singleton ... let's hope so
let net: Net | null = null
export function getNetInstance(): Net {
  if (net === null) {
    net = new Net();
  } 
  
  return net;
}

export class Net {

  private _transitions: Array<Transition>
  private _places: Array<Place>
  private _arcs: Array<Arc>
  private _notificationReceivers: Array<Function>

  constructor() {
    this._transitions = [];
    this._places = [];
    this._arcs = [];
    this._notificationReceivers = [];
  }

  /**
   * Notifies the registered observer of events
   * @param {String} event The event that occured.
   * @param {Object} payload Message to send to the observer.
   */
  notify(event: string, payload: Object) {
    for (let i = 0; i < this._notificationReceivers.length; i++) {
      this._notificationReceivers[0](event, payload)
    }
  }

  register(notificationReceiver: Function) {
    this._notificationReceivers.push(notificationReceiver)
  }


  addPlace(placeID = uuid()) {
    const shortID = placeID.substring(0, 4)
    // todo: check uniqueness?
    const name = 'place' + shortID;
    const newPlace = new Place(placeID, name)
    this._places.push(newPlace)
    this.notify(EVENT_ADD_PLACE, { id: newPlace.id, name })
    return newPlace
  }
  /**
   * Finds a place by given ID.
   */
  findPlace(placeID: string) {
    return this._places.find((place) => place.id === placeID)
  }

  /**
   * Removes a place from the net. Will also remove any
   * arcs that were connected to it.
   * @param {String} placeID The ID of the place to remove.
   */
  removePlace(placeID: string) {
    this._places = this._places.filter((place) => {
      return place.id !== placeID
    })
    this.notify(EVENT_REMOVE_PLACE, placeID)

    const arcsToremove = this._arcs.filter((arc) => {
      return arc.place.id === placeID
    })
    arcsToremove.forEach((arc) => {
      this.disconnect(arc.id)
    })
  }

  /**
   * Set the content of a place
   * (expected to be an object with fields 'schema' and 'data')
   * @param {String} placeID The place to set the content.
   * @param {String} placeName Name of the place.
   */
  updatePlace(placeID: string, placeName: string, schema: JSONObject, marking: JSONMarking) {
    const place = this.findPlace(placeID);
    if (!place) {
      return;
    }
    if (placeName !== place.name) {
      place.name = placeName;
      const connectedArcs = this._arcs.filter((arc) => {
        return arc.place.id === placeID;
      });
      for (let i = 0; i < connectedArcs.length; i++) {
        connectedArcs[i].updateVarNames(placeName);
      }
    }
    place.schema = schema;
    place.marking = marking;

    this.notify(EVENT_UPDATE_PLACE, { id: placeID, name: placeName, num: marking.length })
  }

  /**
   * Check if place name is unique.
   * @param {String} name - Name of the place
   * @param {String} id - ID of the place
   * @return {Boolean}
   */
  validatePlaceName(name: string, id: string): boolean {
    // Todo: ensure that we also get unique variable names with place names like "Some Product" and "SomeProduct"
    const otherPlacesWithSameName = this._places.filter((place) => {
      const isOtherPlaceWithSameName = place.name === name && place.id !== id
      return isOtherPlaceWithSameName
    })
    if (otherPlacesWithSameName.length > 0) {
      return false
    } else {
      return true
    }
  }
  /**
   * Creates a new transition and adds it to the net.
   * @param {String} transitionID - id of the transition
   */
  addTransition(transitionID: string = uuid()): TransitionData {
    const newTransition = new Transition(transitionID, 'transition')
    this._transitions.push(newTransition)
    // this.notify(EVENT_ADD_TRANSITION, { id: newTransition.id, name: newTransition.name })
    return { id: newTransition.id, 
      name: newTransition.name, 
      preface: newTransition.preface,
      guard: newTransition.guard }
  }

  /**
   * Set the content of a transition (expected to be a Jsonnet string)
   * @param {String} transitionID
   * @param {Object} content
   * @param {String} name
   */
  updateTransition(transitionID: string, name: string, preface?: string, guard?: string, fragmentVarSnippets?: Record<string, string>, keyVarSnippets?: Record<string, string>) {
    const transition = this.findTransition(transitionID)
    if (transition) {
      // transition.content = content
      transition.name = name
      if(guard) transition.guard = guard
      if(preface) transition.preface = preface
      if(keyVarSnippets) transition.keyVarSnippets = keyVarSnippets
      if(fragmentVarSnippets) transition.fragmentVarSnippets = fragmentVarSnippets
      this.notify(EVENT_UPDATE_TRANSITION, { transitionID, name })
    }
  }

  updateTransitionSnippets(transitionID: string, arcID: string, keySnippet: string, fragmentSnippet: string) {
    const transition = this.findTransition(transitionID)
    const arc = this.findArc(arcID)
    if (!transition || !arc) return;
    transition.keyVarSnippets[arc.keyVarName] = keySnippet;
    transition.fragmentVarSnippets[arc.fragmentVarName] = fragmentSnippet;

  }

  /**
   * Finds a transition by given ID.
   * @param {String} transitionID The ID of the transition to find.
   */
  findTransition(transitionID: string) {
    return this._transitions.find((transition) => transition.id === transitionID)
  }



  /**
   * Removes a transition from the net. Will also remove
   * any connected arcs.
   * @param {String} transitionID The ID of the transition to remove.
   */
  removeTransition(transitionID: string) {
    let transitionToRemove = this.findTransition(transitionID);
    const newTransitionsList = this._transitions.filter((transition) => {
      if (transition.id === transitionID) {
        transitionToRemove = transition
        return false
      } else {
        return true
      }
    })

    if (!transitionToRemove) return;

    transitionToRemove.preset.forEach((arc: Arc) => {
      this.disconnect(arc.id)
    })
    transitionToRemove.postset.forEach((arc) => {
      this.disconnect(arc.id)
    })
    this._transitions = newTransitionsList
    this.notify(EVENT_REMOVE_TRANSITION, transitionID)
  }

  /**
   * Creates an arc between two nodes of the net.
   * @param {String} fromID ID of the outgoing node.
   * @param {String} toID ID of the incoming node.
   * @param {String} arcID Optional predefined ID of arc.
   */
  connect(fromID: string, toID: string, arcID: string = uuid()): Arc | false {
    // console.log('connecting ' + fromID + ' with ' + toID)
    // const nodes: Array<Place|Transition> = _places.concat(_transitions)
    const nodes = [...this._places, ...this._transitions]
    const from = nodes.find((node) => node.id === fromID)
    const to = nodes.find((node) => node.id === toID)
    let arc
    if (from instanceof Place) {
      if (to instanceof Place) {
        // console.log("Can't connect Place with Place.")
      } else if (to instanceof Transition) {
        arc = new Arc(from, to, "preset", arcID)
        this._arcs.push(arc)
        to.connectArc(arc);
        // to.preset.push(arc)
      } else {
        // console.log('Can only connect Places and Transitions.')
      }
    } else if (from instanceof Transition) {
      if (to instanceof Transition) {
        // console.log("Can't connect Transition with Transition.")
      } else if (to instanceof Place) {
        arc = new Arc(to, from, "postset", arcID)
        this._arcs.push(arc)
        from.connectArc(arc);
        // from.postset.push(arc)
      } else {
        // console.log('Can only connect Places and Transitions.')
      }
    }
    if (arc && from && to) {
      this.notify(EVENT_CONNECT, { from: from.id, to: to.id, arcID, jsonnetsType: arc.type })
      return arc
    } else {
      return false
    }
  }

  /**
   * Removes an arc.
   * @param {String} arcID
   */
  disconnect(arcID: string) {
    const arc = this.findArc(arcID);
    if (!arc) return;
    arc.transition.disconnectArc(arc);
    // remove from all transitions
    // this._transitions.forEach((transition) => {
          // transition.disconnectArc(arcID)
          // transition.preset = transition.preset.filter((arc) => {
            // return arc.id !== arcID
          // })
          // transition.postset = transition.postset.filter((arc) => {
            // return arc.id !== arcID
          // })
        // })

    this._arcs = this._arcs.filter((arc) => {
      if (arc.id === arcID) {
        this.notify(EVENT_DISCONNECT, arcID)

        return false
      } else {
        return true
      }
    })
  }

  /**
   * Find an arc by ID.
   * @param {String} arcID The arc ID.
   */
  findArc(arcID: string) {
    return this._arcs.find((arc) => arc.id === arcID)
  }

  /**
   * Sets the label for an arc.
   * @param {String} arcID The ID of the arc to add the label to.
   * @param {Object} label The label to set.
   */
  updateArc(arcID: string, inscription: string) {
    const arc = this._arcs.find((arc) => arc.id === arcID)
    if (!arc) return;
    arc.filterExpression = inscription;
    // if (arc instanceof PostsetArc) {
    // arc.label = String(label)
    // } else if (arc instanceof PresetArc){
    //Todo: this doesn't feel right
    // arc.label = <PresetArcLabel>label
    // }
  }

  fireUnderCurrentAssignment(transitionID: string) {
    const transition = this.findTransition(transitionID);
    if(!transition) return;
    if(!transition.isEnabledForCurrentAssignment()) return;
    transition.fire()
    transition.preset.forEach((arc) =>
      this.notify(EVENT_FIRE_REMOVE_FRAGMENT, {
        arcID: arc.id,
        placeID: arc.place.id,
        num: arc.place.marking.length
      })
    )
    transition.postset.forEach((arc) =>
      this.notify(EVENT_FIRE_ADD_FRAGMENT, {
        arcID: arc.id,
        placeID: arc.place.id,
        num: arc.place.marking.length
      })
    )
  }

  fireUnderAnyAssignment(transitionID: string) {
    const transition = this.findTransition(transitionID);
    if(!transition) return;
    const hasValidAssignment = transition.findAssignment();
    if(hasValidAssignment) {
      this.fireUnderCurrentAssignment(transitionID);
      return true;
    } else {
      return false;
    }
  }

  fireAny() {
    for (let i = 0; i < this._transitions.length; i++) {
      let transition = this._transitions[i]
      if (transition.findAssignment()) {
        this.fireUnderCurrentAssignment(transition.id)
        break
      }
    }
  }

  export() {
    const placesExportArray = []
    const transitionsExportArray = []
    const arcsExportArray = []

    for (let i = 0; i < this._places.length; i++) {
      let place = this._places[i]
      placesExportArray.push({
        id: place.id,
        name: place.name,
        marking: place.marking,
        schema: place.schema.items
      })
    }

    for (let i = 0; i < this._transitions.length; i++) {
      let transition = this._transitions[i]
      transitionsExportArray.push({
        id: transition.id,
        name: transition.name,
        preface: transition.preface,
        guard: transition.guard,
        keyVarSnippets: transition.keyVarSnippets,
        fragmentVarSnippets: transition.fragmentVarSnippets
      })
    }

    for (let i = 0; i < this._arcs.length; i++) {
      let arc = this._arcs[i]
      let fromId, toId
      if (arc.type === 'preset') {
        fromId = arc.place.id
        toId = arc.transition.id
      } else if (arc.type === 'postset') {
        fromId = arc.transition.id
        toId = arc.place.id
      }

      arcsExportArray.push({
        id: arc.id,
        // type: arc.type,
        // label: arc.label,
        filter: arc.filterExpression,
        fromId,
        toId
      })
    }
    const exportData = {
      places: placesExportArray,
      transitions: transitionsExportArray,
      arcs: arcsExportArray
    }

    // Convert JSON string to BLOB.
    // const json = JSON.stringify(exportData)
    return exportData

    // return ''
  }

  clear() {
    while (this._transitions.length > 0) {
      this.removeTransition(this._transitions[0].id)
    }

    while (this._places.length > 0) {
      unCacheSchema(this._places[0].id);
      this.removePlace(this._places[0].id)
    }
  }

  import(json: any, layout: JSONObject) {
    this.clear()
    console.log(json)

    // let isExample = false
    // if (json === 'example') {
      // isExample = true
      // data = JSON.parse('{}')
    // } else {
    // }
    // else {
      // data = JSON.parse(json)
    // }

    for (let i = 0; i < json.places.length; i++) {
      let place = json.places[i]
      this.addPlace(place.id)
      this.updatePlace(place.id, place.name, place.schema, place.marking);
    }

    for (let i = 0; i < json.transitions.length; i++) {
      let transition = json.transitions[i]
      this.addTransition(transition.id)
      console.log(transition)
      this.updateTransition(transition.id, transition.name, transition.preface, transition.guard, transition.fragmentVarSnippets, transition.keyVarSnippets)
    }

    for (let i = 0; i < json.arcs.length; i++) {
      let arc = json.arcs[i]
      this.connect(arc.fromId, arc.toId, arc.id)
      this.updateArc(arc.id, arc.filter)
      // setArcLabel(arc.id, arc.label)
    }

    this.notify(EVENT_NET_IMPORTED, { layout })

  }
}