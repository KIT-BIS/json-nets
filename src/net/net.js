import {Place} from './place';
import {Transition} from './transition';
import {PresetEdge} from './presetEdge';
import {PostsetEdge} from './postsetEdge';
import {receiveNotification} from '../visualization/net';

export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE';
export const EVENT_ADD_TRANSITION = 'EVENT_ADD_TRANSITION';
export const EVENT_CHANGE_PLACE_CONTENT = 'EVENT_CHANGE_PLACE_CONTENT';
export const EVENT_CONNECT = 'EVENT_CONNECT';
export const EVENT_DISCONNECT = 'EVENT_DISCONNECT';
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE';
export const EVENT_REMOVE_TRANSITION = 'EVENT_REMOVE_TRANSITION';
export const EVENT_REMOVE_EDGE = 'EVENT_REMOVE_EDGE';

let _transitions = [];
let _places = [];
let _edges = [];

/**
 * Finds a place by given ID.
 * @param {String} placeID The ID of the place to find.
 * @return {Place} The found place.
 */
export function findPlace(placeID) {
  return _places.find((place) => place.id === placeID);
};

/**
 * Creates a new place and adds it to the net.
 */
export function addPlace() {
  const newPlace = new Place();
  _places.push(newPlace);
  notify(EVENT_ADD_PLACE, newPlace.id);
};

/**
 * Removes a place from the net. Will also remove any
 * edges that were connected to it.
 * @param {String} placeID The ID of the place to remove.
 */
export function removePlace(placeID) {
  _places = _places.filter((place) => {
    return place.id !== placeID;
  });
  notify(EVENT_REMOVE_PLACE, placeID);

  const edgesToRemove = _edges.filter((edge) => {
    return edge.place.id === placeID;
  });
  edgesToRemove.forEach((edge) => {
    disconnect(edge.id);
  });
};

/**
 * Set the content of a place (expected to be an array of objects)
 * @param {String} placeID The place to set the content.
 * @param {Array} content New content of the place.
 */
export function setPlaceContent(placeID, content) {
  const place = _places.find((place) => place.id === placeID);
  place.content = content;
  notify(EVENT_CHANGE_PLACE_CONTENT,
      {placeID, num: place.content.length});
};

/**
 * Finds a transition by given ID.
 * @param {String} transitionID The ID of the transition to find.
 * @return {Transition} The found transition.
 */
export function findTransition(transitionID) {
  return _transitions.find((transition) =>
    transition.id === transitionID);
};

/**
 * Creates a new transition and adds it to the net.
 */
export function addTransition() {
  const newTransition = new Transition();
  _transitions.push(newTransition);
  notify(EVENT_ADD_TRANSITION, newTransition.id);
};

/**
 * Removes a transition from the net. Will also remove
 * any connected edges.
 * @param {String} transitionID The ID of the transition to remove.
 */
export function removeTransition(transitionID) {
  let transitionToRemove = null;
  const newTransitionsList = _transitions.filter((transition) => {
    if (transition.id === transitionID) {
      transitionToRemove = transition;
      return false;
    } else {
      return true;
    }
  });

  transitionToRemove.preset.forEach((edge) => {
    disconnect(edge.id);
  });
  transitionToRemove.postset.forEach((edge) => {
    disconnect(edge.id);
  });
  _transitions = newTransitionsList;
  notify(EVENT_REMOVE_TRANSITION, transitionID);
};

/**
 * Connects one node in the net to another.
 * @param {String} fromID ID of the outgoing node.
 * @param {String} toID ID of the incoming node.
 */
export function connect(fromID, toID) {
  const nodes = _places.concat(_transitions);
  const from = nodes.find((node) => node.id === fromID);
  const to = nodes.find((node) => node.id === toID);
  let edgeID = '';
  if (from instanceof Place) {
    if (to instanceof Place) {
      console.log('Can\'t connect Place with Place.');
    } else if (to instanceof Transition) {
      const presetEdge = new PresetEdge(from, to);
      edgeID = presetEdge.id;
      _edges.push(presetEdge);
      to.preset.push(presetEdge);
    } else {
      console.log('Can only connect Places and Transitions.');
    }
  } else if (from instanceof Transition) {
    if (to instanceof Transition) {
      console.log('Can\'t connect Transition with Transition.');
    } else if (to instanceof Place) {
      const postsetEdge = new PostsetEdge(from, to);
      edgeID = postsetEdge.id;
      _edges.push(postsetEdge);
      from.postset.push(postsetEdge);
    } else {
      console.log('Can only connect Places and Transitions.');
    }
  }
  notify(EVENT_CONNECT, {from: from.id, to: to.id, edgeID});
};

/**
 * Removes an edge.
 * @param {String} edgeID
 */
export function disconnect(edgeID) {
  _edges = _edges.filter((edge) => {
    if (edge.id === edgeID) {
      _transitions.forEach((transition) => {
        transition.preset = transition.preset.filter((edge) => {
          return edge.id !== edgeID;
        });
        transition.postset = transition.postset.filter((edge) => {
          return edge.id !== edgeID;
        });
      });
      // remove from all transitions preset
      notify(EVENT_DISCONNECT, edgeID);

      return false;
    } else {
      return true;
    }
  });
}

/**
 * Find an edge by ID.
 * @param {String} edgeID The edge ID.
 * @return {PresetEdge|PostsetEdge} The found edge.
 */
export function findEdge(edgeID) {
  return _edges.find((edge) => edge.id === edgeID);
};

/**
 * Sets the label for an edge.
 * @param {String} edgeID The ID of the edge to add the label to.
 * @param {Object} label The label to set.
 */
export function setEdgeLabel(edgeID, label) {
  const edge = _edges.find((edge) => edge.id === edgeID);
  edge.label = label;
};

/**
 * Fire a given edge
 * @param {PresetEdge|PostsetEdge} edge The edge to fire.
 */
export function fireEdge(edge) {
  edge.fire();
  notify(EVENT_CHANGE_PLACE_CONTENT, {
    placeID: edge.place.id,
    num: edge.place.content.length,
  });
};

/**
 * Step through the simulation.
 */
export function step() {
  const alifeTransitions = [];
  _transitions.forEach((transition) => {
    transition.state = {};
    let isAlive = true;
    if (transition.preset.length < 1) {
      isAlive = false;
    }
    if (transition.preset.some((edge) => !edge.canFire())) {
      isAlive = false;
    }
    if (isAlive) {
      alifeTransitions.push(transition);
    }
  });
  alifeTransitions.forEach((transition) => {
    // TODO ... conflicts still possible?
    // let hadConflict = false;
    transition.preset.forEach((edge) => {
      fireEdge(edge);
    });
    transition.postset.forEach((edge) => {
      fireEdge(edge);
    });
  });
};

/**
 * Notifies the registered observer of events
 * @param {String} event The event that occured.
 * @param {Object} payload Message to send to the observer.
 */
export function notify(event, payload) {
  receiveNotification(event, payload);
};
