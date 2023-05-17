import Konva from 'konva';
import {EVENT_ADD_PLACE, EVENT_ADD_TRANSITION,
  EVENT_CONNECT,
  EVENT_CHANGE_PLACE_CONTENT,
  EVENT_REMOVE_PLACE,
  EVENT_REMOVE_TRANSITION,
  EVENT_DISCONNECT,
  EVENT_CHANGE_TRANSITION_CONTENT} from '../jsonnets/net';
import {Transition} from './transition';
import {Place} from './place';
import {Arc} from './arc';

let _clickPosition = {x: 0, y: 0};
let _lastClickedPlace = null;
let _lastClickedTransition = null;
let _connectors = [];

const _width = window.innerWidth;
const _height = window.innerHeight;
let _layer = null;
let _stage = null;

/**
 * Initialize the vizualisation of the net
 */
export function init() {
  _stage = new Konva.Stage({
    container: 'container',
    width: _width,
    height: _height,
  });
  _layer = new Konva.Layer();
  _stage.add(_layer);
}


/**
 * Returns position of conva stage
 * @return {Object}
 */
export function getStagePosition() {
  return _stage.position();
}

/**
 * Whether stage is panable
 * @param {Boolean} toggle
 */
export function setPanable(toggle) {
  _stage.draggable(toggle);
}
/**
 * Whether nodes are currently draggable or not.
 * @param {Boolean} toggle
 */
export function toggleDraggable(toggle) {
  const elements = _layer.find('Group');
  elements.each((e) => {
    e.draggable(toggle);
  });
}

/**
 * Store position of last click.
 * @param {Number} x
 * @param {Number} y
 */
export function setClickPosition(x, y) {
  _clickPosition = {x, y};
}

/**
 * Stores the last clicked place
 * @param {String} placeID
 */
export function setLastClickedPlace(placeID) {
  _lastClickedPlace = placeID;
}

/**
 * Returns the ID of the last clicked place.
 * @return {String}
 */
export function getLastClickedPlace() {
  return _lastClickedPlace;
}

/**
 * Stores the last clicked Transition
 * @param {String} transitionID
 */
export function setLastClickedTransition(transitionID) {
  _lastClickedTransition = transitionID;
}

/**
 * Returns the ID of the last clicked transition.
 * @return {String}
 */
export function getLastClickedTransition() {
  return _lastClickedTransition;
}

/**
 * Update positions of all lines that are connected to one (dragged) node.
 * @param {String} connectedNodeID
 */
export function updateLines(connectedNodeID) {
  const affectedCons = _connectors.filter((conn) => {
    return conn.fromID === connectedNodeID || conn.toID === connectedNodeID;
  });
  affectedCons.forEach((conn) => {
    const from = _stage.findOne('#' + conn.fromID);
    const to = _stage.findOne('#' + conn.toID);
    conn.points(_calculatePoints(from.position(), to.position()));
  });
  _layer.batchDraw();
};

/**
 * Calculate points for connecting nodes with a bit of a margin.
 * @param {Object} from
 * @param {Object} to
 * @return {Array}
 */
function _calculatePoints(from, to) {
  const radius = 50;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(-dy, dx);

  const points = [
    from.x + -radius * Math.cos(angle + Math.PI),
    from.y + radius * Math.sin(angle + Math.PI),
    to.x + -radius * Math.cos(angle),
    to.y + radius * Math.sin(angle),
  ];
  return points;
};

/**
 * React to an event from the net.
 * @param {String} event
 * @param {Object} payload
 */
export function receiveNotification(event, payload) {
  if (event === EVENT_ADD_TRANSITION) {
    _layer.add(new Transition(_clickPosition.x, _clickPosition.y, payload));
    _layer.batchDraw();
  } else if (event === EVENT_ADD_PLACE) {
    _layer.add(new Place(_clickPosition.x, _clickPosition.y, payload));
    _layer.batchDraw();
  } else if (event === EVENT_CONNECT) {
    const from = _stage.findOne('#' + payload.from).position();
    const to = _stage.findOne('#' + payload.to).position();

    const points = _calculatePoints(from, to);

    const arc = new Arc(points, payload.from, payload.to, payload.arcID);
    // TODO handle ids with konva ... this seems a bit weird
    arc.id(payload.arcID);
    _connectors.push(arc);

    _layer.add(arc);
    _layer.batchDraw();
  } else if (event === EVENT_DISCONNECT) {
    const connector = _stage.findOne('#' + payload);
    const internalID = connector.id();
    _connectors = _connectors.filter((connector) => {
      if (connector.id() === internalID) {
        return false;
      } else {
        return true;
      }
    });

    connector.destroy();
    _layer.batchDraw();
  } else if (event === EVENT_CHANGE_PLACE_CONTENT) {
    const place = _stage.findOne('#' + payload.placeID);
    const text = place.findOne('.counter');
    const name = place.findOne('.name');
    text.text(payload.num);
    name.text(payload.name);
    _layer.batchDraw();
  } else if (event === EVENT_CHANGE_TRANSITION_CONTENT) {
    const transition = _stage.findOne('#' + payload.transitionID);
    const name = transition.findOne('.name');
    name.text(payload.name);
    _layer.batchDraw();
  } else if (event === EVENT_REMOVE_PLACE) {
    const place = _stage.findOne('#' + payload);
    place.destroy();
    _layer.batchDraw();
  } else if (event === EVENT_REMOVE_TRANSITION) {
    const transition = _stage.findOne('#' + payload);
    transition.destroy();
    _layer.batchDraw();
  }
}
