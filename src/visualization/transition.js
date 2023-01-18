import Konva from 'konva';
import {updateLines, setLastClickedTransition,
  getLastClickedPlace} from './net';
import {getMode, setMode, updateInspector, MODE_CONNECT_START,
  MODE_CONNECT_FROM_TRANSITION, MODE_CONNECT_FROM_PLACE, MODE_REMOVE,
  MODE_INSPECT, INSPECTOR_MODE_TRANSITION, MODE_FIRE} from '../ui/ui';
import {connect, fire, removeTransition} from '../net/net';

/**
 * Creates a new visualization for a transition by extending
 * Konva.Rect.
 * @param {Number} x
 * @param {Number} y
 * @param {String} id
 */
export function Transition(x, y, {id, name}) {
  console.log('new transition ' + name);
  Konva.Group.call(this, {
    x,
    y,
    id,
  });

  const rect = new Konva.Rect({
    width: 60,
    offsetX: 35,
    offsetY: 25,
    height: 50,
    fill: '#FFFFFF',
    stroke: '#000000',
    shadowBlur: 2,
    shadowOffset: {x: 3, y: 3},
    shadowOpacity: 0.5,
  });
  const nameText = new Konva.Text({
    name: 'name',
    text: name,
    x: -30,
    y: 35,
  });
  this.add(rect);
  this.add(nameText);

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
    } else if (getMode() === MODE_FIRE) {
      fire(id);
    }
  });

  this.on('dragmove', () => {
    updateLines(id);
  });
}

// TODO: This is fluff to properly set up inheritance ... I don't like it.
Transition.prototype = Object.create(Konva.Group.prototype);
Object.defineProperty(Transition.prototype, 'constructor', {
  value: Transition,
  enumerable: false,
  writable: true,
});
