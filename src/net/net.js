import {Place} from './place';
import {Transition} from './transition';
import {PresetEdge} from './presetEdge';
import {PostsetEdge} from './postsetEdge';
import {receiveNotification} from '../visualization/net';
import {validate, validatePlaceName} from '../util/validator';
import {addEdgesExportArray} from '../util/exportNet';
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
 * @param {String} id - id of the place
 * @param {Object} content - content of the place
 * @return {Place} The new place.
 */
export function addPlace(id) {
  const newPlace = new Place(id);
  _places.push(newPlace);
  notify(EVENT_ADD_PLACE, newPlace.id);
  return newPlace;
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
 * @param {Object} content New content of the place.
 * @param {String} placeName Name of the place.
 */
export function setPlaceContent(placeID, content, placeName) {
  const place = _places.find((place) => place.id === placeID);
  const schema = content.schema;
  const data = content.data;
  const name = placeName;
  let allValid = true;
  const docErrors = [];
  data.forEach((doc) => {
    const {isValid, errors} = validate(doc, schema);
    if (!isValid) {
      console.log('Invalid document:');
      console.log(errors);
      docErrors.push(errors);
      allValid = false;
    }
  });
  const nameUnique = validatePlaceName(name, _places);
  const itemNameReturn = document.getElementById('itemNameReturn');
  const itemName = document.getElementById('itemName');
  if (!nameUnique) {
    itemNameReturn.classList.remove('is-hidden');
    itemName.classList.add('is-danger');
    itemNameReturn.innerHTML = 'Name already exists and must be unique.';
  } else {
    itemNameReturn.classList.add('is-hidden');
    itemName.classList.remove('is-danger');
  }
  if (docErrors.length > 0 ) {
    const node = document.getElementById('modal-card-body');
    console.log(node);
    const consoleElement = document.getElementById('console');
    if (!consoleElement) {
      const textArea= document.createElement('textarea');
      textArea.id = 'console';
      textArea.className = 'console';
      textArea.readOnly = true;
      textArea.style.height = '100px';
      textArea.style.width = '100%';
      textArea.style.marginTop = '5px';
      node.appendChild(textArea);
    }

    document.getElementById('console').innerHTML = JSON.stringify(docErrors);
  }

  if (allValid) {
    place.content = content;
    place.name = name;
    notify(EVENT_CHANGE_PLACE_CONTENT,
        {placeID, num: place.content.data.length, name: name});
  }
};
/**
 * Set the content of a transition (expected to be of type jsonnet)
 * @param {String} transitionID
 * @param {Object} content
 */
export function setTransitionContent(transitionID, content) {
  const transition = _transitions.find(
      (transition) => transition.id === transitionID);
  transition.content = content;
  console.log(_transitions);
}

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
 * @param {String} id - id of the transition
 * @param {Array} preset - preset of the transition
 * @param {Array} postset - postset of the transition
 * @param {Object} state - state of the transition
 * @return {Transition} The new transition.
 */
export function addTransition(id) {
  const newTransition = new Transition(id);
  _transitions.push(newTransition);
  notify(EVENT_ADD_TRANSITION, newTransition.id);
  return newTransition;
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
 * @return {String} ID of the created edge.
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
      addEdgesExportArray(edgeID, fromID, toID, 'presetEdge');
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
      addEdgesExportArray(edgeID, fromID, toID, 'postsetEdge');
    } else {
      console.log('Can only connect Places and Transitions.');
    }
  }
  notify(EVENT_CONNECT, {from: from.id, to: to.id, edgeID});
  return edgeID;
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
    num: edge.place.content.data.length,
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
