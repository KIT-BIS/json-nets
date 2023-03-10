import {Place} from './place';
import {v4 as uuidv4} from 'uuid';
import {Transition} from './transition';
import {PresetArc} from './presetArc';
import {PostsetArc} from './postsetArc';
import {receiveNotification} from '../visualization/net';
import {validate} from '../util/validator';
import {showConsole} from '../ui/console';
export const EVENT_ADD_PLACE = 'EVENT_ADD_PLACE';
export const EVENT_ADD_TRANSITION = 'EVENT_ADD_TRANSITION';
export const EVENT_CHANGE_PLACE_CONTENT = 'EVENT_CHANGE_PLACE_CONTENT';
export const EVENT_CHANGE_TRANSITION_CONTENT =
  'EVENT_CHANGE_TRANSITION_CONTENT';
export const EVENT_CONNECT = 'EVENT_CONNECT';
export const EVENT_DISCONNECT = 'EVENT_DISCONNECT';
export const EVENT_REMOVE_PLACE = 'EVENT_REMOVE_PLACE';
export const EVENT_REMOVE_TRANSITION = 'EVENT_REMOVE_TRANSITION';
export const EVENT_REMOVE_ARC = 'EVENT_REMOVE_ARC';

let _transitions = [];
let _places = [];
let _arcs = [];

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
 * If you don't pass an ID, a new one will be created.
 * @param {String} placeID Optional ID of the new place.
 * @return {Place} The new place.
 */
export function addPlace(placeID = uuidv4()) {
  // TODO: this does not guarantee a unique name in every case
  const name = 'place' + _places.length;
  const newPlace = new Place(placeID, name);
  _places.push(newPlace);
  notify(EVENT_ADD_PLACE, {id: newPlace.id, name});
  return newPlace;
};


/**
 * Removes a place from the net. Will also remove any
 * arcs that were connected to it.
 * @param {String} placeID The ID of the place to remove.
 */
export function removePlace(placeID) {
  _places = _places.filter((place) => {
    return place.id !== placeID;
  });
  notify(EVENT_REMOVE_PLACE, placeID);

  const arcsToremove = _arcs.filter((arc) => {
    return arc.place.id === placeID;
  });
  arcsToremove.forEach((arc) => {
    disconnect(arc.id);
  });
};

/**
 * Set the content of a place
 * (expected to be an object with fields 'schema' and 'data')
 * @param {String} placeID The place to set the content.
 * @param {Object} content New content of the place.
 * @param {String} placeName Name of the place.
 */
export function setPlaceContent(placeID, content, placeName) {
  const place = _places.find((place) => place.id === placeID);
  const schema = content.schema;
  const data = content.data;
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

  const itemNameReturn = document.getElementById('itemNameReturn');
  const itemName = document.getElementById('itemName');
  if (!validatePlaceName(placeName, placeID)) {
    itemNameReturn.classList.remove('is-hidden');
    itemName.classList.add('is-danger');
    itemNameReturn.innerHTML = 'Name already exists and must be unique.';
    allValid = false;
  } else {
    itemNameReturn.classList.add('is-hidden');
    itemName.classList.remove('is-danger');
  }

  if (docErrors.length > 0 ) {
    console.log('Schema validation errors.');
    console.log(docErrors);
    showConsole(docErrors);
  }

  if (allValid) {
    place.content = content;
    place.name = placeName;
    notify(EVENT_CHANGE_PLACE_CONTENT,
        {placeID, num: place.content.data.length, name: placeName});
  }
};

/**
 * Set the content of a transition (expected to be a Jsonnet string)
 * @param {String} transitionID
 * @param {Object} content
 * @param {String} name
 */
export function setTransitionContent(transitionID, content, name) {
  const transition = findTransition(transitionID);
  transition.content = content;
  transition.name = name;
  notify(EVENT_CHANGE_TRANSITION_CONTENT,
      {transitionID, name});
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
 * @param {String} transitionID - id of the transition
 * @param {Array} preset - preset of the transition
 * @param {Array} postset - postset of the transition
 * @param {Object} state - state of the transition
 * @return {Transition} The new transition.
 */
export function addTransition(transitionID = uuidv4()) {
  const newTransition = new Transition(transitionID, 'transition');
  _transitions.push(newTransition);
  notify(EVENT_ADD_TRANSITION, {id: newTransition.id,
    name: newTransition.name});
  return newTransition;
};

/**
 * Removes a transition from the net. Will also remove
 * any connected arcs.
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

  transitionToRemove.preset.forEach((arc) => {
    disconnect(arc.id);
  });
  transitionToRemove.postset.forEach((arc) => {
    disconnect(arc.id);
  });
  _transitions = newTransitionsList;
  notify(EVENT_REMOVE_TRANSITION, transitionID);
};

/**
 * Creates an arc between two nodes of the net.
 * @param {String} fromID ID of the outgoing node.
 * @param {String} toID ID of the incoming node.
 * @param {String} arcID Optional predefined ID of arc.
 * @return {String} ID of the created arc.
 */
export function connect(fromID, toID, arcID = uuidv4()) {
  const nodes = _places.concat(_transitions);
  const from = nodes.find((node) => node.id === fromID);
  const to = nodes.find((node) => node.id === toID);
  let arc;
  if (from instanceof Place) {
    if (to instanceof Place) {
      console.log('Can\'t connect Place with Place.');
    } else if (to instanceof Transition) {
      arc = new PresetArc(from, to, arcID);
      _arcs.push(arc);
      to.preset.push(arc);
    } else {
      console.log('Can only connect Places and Transitions.');
    }
  } else if (from instanceof Transition) {
    if (to instanceof Transition) {
      console.log('Can\'t connect Transition with Transition.');
    } else if (to instanceof Place) {
      arc = new PostsetArc(from, to, arcID);
      _arcs.push(arc);
      from.postset.push(arc);
    } else {
      console.log('Can only connect Places and Transitions.');
    }
  }
  if (arc) {
    notify(EVENT_CONNECT, {from: from.id, to: to.id, arcID});
    return arc;
  }
};

/**
 * Removes an arc.
 * @param {String} arcID
 */
export function disconnect(arcID) {
  _arcs = _arcs.filter((arc) => {
    if (arc.id === arcID) {
      _transitions.forEach((transition) => {
        transition.preset = transition.preset.filter((arc) => {
          return arc.id !== arcID;
        });
        transition.postset = transition.postset.filter((arc) => {
          return arc.id !== arcID;
        });
      });
      // remove from all transitions preset
      notify(EVENT_DISCONNECT, arcID);

      return false;
    } else {
      return true;
    }
  });
}

/**
 * Find an arc by ID.
 * @param {String} arcID The arc ID.
 * @return {PresetArc|PostsetArc} The found arc.
 */
export function findArc(arcID) {
  return _arcs.find((arc) => arc.id === arcID);
};

/**
 * Sets the label for an arc.
 * @param {String} arcID The ID of the arc to add the label to.
 * @param {Object} label The label to set.
 */
export function setArcLabel(arcID, label) {
  const arc = _arcs.find((arc) => arc.id === arcID);
  arc.label = label;
};


/**
 * Make a transition occur.
 * Checks if transition is enabled.
 * @param {String} transitionID
 */
export function occur(transitionID) {
  const transition = findTransition(transitionID);
  if (!transition.isEnabled()) {
    alert('The transition is not enabled.');
  } else {
    transition.occur();
    transition.preset.forEach((arc) =>
      notify(EVENT_CHANGE_PLACE_CONTENT, {
        placeID: arc.place.id,
        num: arc.place.content.data.length,
        name: arc.place.name,
      }));
    transition.postset.forEach((arc) =>
      notify(EVENT_CHANGE_PLACE_CONTENT, {
        placeID: arc.place.id,
        num: arc.place.content.data.length,
        name: arc.place.name,
      }));
  }
}


/**
 * Notifies the registered observer of events
 * @param {String} event The event that occured.
 * @param {Object} payload Message to send to the observer.
 */
export function notify(event, payload) {
  receiveNotification(event, payload);
};

/**
 * Check if place name is unique.
 * @param {String} name - Name of the place
 * @param {String} id - ID of the place
 * @return {Boolean}
 */
function validatePlaceName(name, id) {
  const otherPlacesWithSameName = _places.filter((place) => {
    const isOtherPlaceWithSameName = place.name === name && place.id !== id;
    return isOtherPlaceWithSameName;
  });
  if (otherPlacesWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * Step through the simulation.
 */
// export function step() {
//   const alifeTransitions = [];
//   _transitions.forEach((transition) => {
//     transition.state = {};
//     let isAlive = true;
//     if (transition.preset.length < 1) {
//       isAlive = false;
//     }
//     if (transition.preset.some((ard) => !arc.canFire())) {
//       isAlive = false;
//     }
//     if (isAlive) {
//       alifeTransitions.push(transition);
//     }
//   });
//   alifeTransitions.forEach((transition) => {
//     // TODO ... conflicts still possible?
//     // let hadConflict = false;
//     transition.preset.forEach((arc) => {
//       fireArc(arc);
//     });
//     transition.postset.forEach((arc) => {
//       fireArc(arc);
//     });
//   });
// };
