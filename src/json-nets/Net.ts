import { Arc } from "./Arc";
import { Place } from "./Place";
import { Transition } from "./Transition";
import type { JSONMarking, JSONObject } from "@/util/jsonOperations";

import { v4 as uuid } from 'uuid'

export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE'
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE'
export const EVENT_UPDATE_PLACE = 'EVENT_UPDATE_PLACE'

export const EVENT_ADD_TRANSITION = 'EVENT_ADD_TRANSITION'
export const EVENT_REMOVE_TRANSITION = 'EVENT_REMOVE_TRANSITION'
export const EVENT_UPDATE_TRANSITION = 'EVENT_UPDATE_TRANSITION'

export const EVENT_CONNECT = 'EVENT_CONNECT'
export const EVENT_DISCONNECT = 'EVENT_DISCONNECT'

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
    place.name = placeName;
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
   * @return {Transition} The new transition.
   */
  addTransition(transitionID: string = uuid()): Transition {
    const newTransition = new Transition(transitionID, 'transition')
    this._transitions.push(newTransition)
    this.notify(EVENT_ADD_TRANSITION, { id: newTransition.id, name: newTransition.name })
    return newTransition
  }

  /**
   * Set the content of a transition (expected to be a Jsonnet string)
   * @param {String} transitionID
   * @param {Object} content
   * @param {String} name
   */
  updateTransition(transitionID: string, name: string) {
    const transition = this.findTransition(transitionID)
    if (transition) {
      // transition.content = content
      transition.name = name
      this.notify(EVENT_UPDATE_TRANSITION, { transitionID, name })
    }
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
    this._arcs = this._arcs.filter((arc) => {
      if (arc.id === arcID) {
        this._transitions.forEach((transition) => {
          transition.preset = transition.preset.filter((arc) => {
            return arc.id !== arcID
          })
          transition.postset = transition.postset.filter((arc) => {
            return arc.id !== arcID
          })
        })
        // remove from all transitions preset
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

}