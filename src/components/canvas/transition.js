import Konva from 'konva';
import {updateLines, setLastClickedTransition,
  getLastClickedPlace} from './net';
import {MODE_CONNECT_START,
  MODE_CONNECT_FROM_TRANSITION, MODE_CONNECT_FROM_PLACE, MODE_REMOVE,
  MODE_INSPECT, INSPECTOR_MODE_TRANSITION, MODE_OCCUR} from '@/App.vue';
import {connect, occur, removeTransition} from '../jsonnets/net';
import {removeTransitionFromExportArray,
  addArcToExportArray} from '@/util/exportNet';
import { useUiStateStore } from '@/stores/uiState';

/**
 * Creates a new visualization for a transition by extending
 * Konva.Rect.
 * @param {Number} x
 * @param {Number} y
 * @param {String} id
 */
export function Transition(x, y, {id, name}) {
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
    const currentMode = useUiStateStore().mode;
    if (currentMode === MODE_CONNECT_START) {
      setLastClickedTransition(id);
      useUiStateStore().setMode(MODE_CONNECT_FROM_TRANSITION)
      //setMode(MODE_CONNECT_FROM_TRANSITION);
    } else if (currentMode === MODE_CONNECT_FROM_PLACE) {
      const arc = connect(getLastClickedPlace(), id);
      addArcToExportArray(arc.id, arc.place.id, id, 'preset', arc.label);
      useUiStateStore().setMode(MODE_CONNECT_START)
      //setMode(MODE_CONNECT_START);
    } else if (currentMode === MODE_REMOVE) {
      removeTransition(id);
      removeTransitionFromExportArray(id);
    } else if (currentMode === MODE_INSPECT) {
      useUiStateStore().updateInspector(INSPECTOR_MODE_TRANSITION, id);
    } else if (currentMode === MODE_OCCUR) {
      occur(id);
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
