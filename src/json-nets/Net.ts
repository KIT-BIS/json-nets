import type { Arc } from "./Arc";
import { Place } from "./Place";

import { v4 as uuid } from 'uuid'
import type { Transition } from "./Transition";

export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE'
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE'

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
        const shortID = placeID.substring(0,4)
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

    disconnect(arcID: string) {

    }
    /**
     * Set the content of a place
     * (expected to be an object with fields 'schema' and 'data')
     * @param {String} placeID The place to set the content.
     * @param {Object} content New content of the place.
     * @param {String} placeName Name of the place.
     */
    setPlaceContent(placeID: string, content: any, placeName: string) {
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

}