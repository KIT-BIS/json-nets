import Konva from 'konva';
import {getMode, setMode, updateInspector, MODE_CONNECT_START,
  MODE_CONNECT_FROM_TRANSITION, MODE_CONNECT_FROM_PLACE,
  MODE_INSPECT, INSPECTOR_MODE_PLACE, MODE_REMOVE} from '../ui/ui';
import {connect, removePlace} from '../net/net';
import {updateLines, setLastClickedPlace,
  getLastClickedTransition} from './net';
import {removePlacesExportArray} from '../util/exportNet';
/**
 * Creates a new visualization for a Place by extending
 * Konva.Group.
 * @param {Number} x
 * @param {Number} y
 * @param {String} id
 */
export function Place(x, y, id) {
  Konva.Group.call(this, {
    x,
    y,
    id,
  });

  const text = new Konva.Text({
    name: 'counter',
    text: '0',
    x: -3,
    y: -3,
  });
  const circle = new Konva.Circle({
    radius: 35,
    fill: '#C7CEDB',
    shadowBlur: 2,
    shadowOpacity: 0.5,
    shadowOffset: {x: 3, y: 3},
  });
  const name = new Konva.Text({
    name: 'name',
    text: 'place',
    x: -15,
    y: 50,
  });
  this.add(circle);
  this.add(text);
  this.add(name);

  circle.on('click', () => {
    if (getMode() === MODE_CONNECT_START) {
      setLastClickedPlace(id);
      setMode(MODE_CONNECT_FROM_PLACE);
    } else if (getMode() === MODE_CONNECT_FROM_TRANSITION) {
      connect(getLastClickedTransition(), id);
      setMode(MODE_CONNECT_START);
    } else if (getMode() === MODE_INSPECT) {
      updateInspector(INSPECTOR_MODE_PLACE, id);
    } else if (getMode() === MODE_REMOVE) {
      removePlace(id);
      removePlacesExportArray(id);
    }
  });

  this.on('dragmove', () => {
    updateLines(id);
  });
}

// TODO: This is fluff to properly set up inheritance ... I don't like it.
Place.prototype = Object.create(Konva.Group.prototype);
Object.defineProperty(Place.prototype, 'constructor', {
  value: Place,
  enumerable: false,
  writable: true,
});
