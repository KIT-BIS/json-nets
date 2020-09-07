import Konva from 'konva';
import {updateLines, setLastClickedTransition,
  getLastClickedPlace} from './net';
import {getMode, setMode, updateInspector, MODE_CONNECT_START,
  MODE_CONNECT_FROM_TRANSITION, MODE_CONNECT_FROM_PLACE, MODE_REMOVE,
  MODE_INSPECT, INSPECTOR_MODE_TRANSITION} from '../ui/ui';
import {connect, removeTransition} from '../net/net';

/**
 * Creates a new visualization for a transition by extending
 * Konva.Rect.
 * @param {Number} x
 * @param {Number} y
 * @param {String} id
 */
export function Transition(x, y, id) {
  Konva.Rect.call(this, {
    x,
    y,
    width: 60,
    offsetX: 35,
    offsetY: 25,
    height: 50,
    fill: '#63A46C',
    shadowBlur: 2,
    shadowOffset: {x: 3, y: 3},
    shadowOpacity: 0.5,
    id,
  });

  this.on('click', () => {
    if (getMode() === MODE_CONNECT_START) {
      setLastClickedTransition(id);
      setMode(MODE_CONNECT_FROM_TRANSITION);
    } else if (getMode() === MODE_CONNECT_FROM_PLACE) {
      connect(getLastClickedPlace(), id);
      setMode(MODE_CONNECT_START);
    } else if (getMode() === MODE_REMOVE) {
      removeTransition(id);
    } else if (getMode() === MODE_INSPECT) {
      updateInspector(INSPECTOR_MODE_TRANSITION, id);
    }
  });

  this.on('dragmove', () => {
    updateLines(id);
  });
}

// TODO: This is fluff to properly set up inheritance ... I don't like it.
Transition.prototype = Object.create(Konva.Rect.prototype);
Object.defineProperty(Transition.prototype, 'constructor', {
  value: Transition,
  enumerable: false,
  writable: true,
});
