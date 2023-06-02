import Konva from 'konva';
import {MODE_INSPECT, MODE_REMOVE, INSPECTOR_MODE_PRESET_ARC,
  INSPECTOR_MODE_POSTSET_ARC } from '@/App.vue';
import {disconnect, findArc} from '../jsonnets/net';
import {removeArcFromExportArray} from '@/util/exportNet';
import { useUiStateStore } from '@/stores/uiState';

/**
 * Creates a new visualization of an arc
 * by extending Konva.Arrow.
 * @param {Array} points
 * @param {String} fromID
 * @param {String} toID
 * @param {String} id
 */
export function Arc(points, fromID, toID, id) {
  Konva.Arrow.call(this, {
    id,
    fill: '#2E3532',
    stroke: '#2E3532',
    shadowBlur: 2,
    shadowOffset: {x: 3, y: 3},
    shadowOpacity: 0.5,
    points,
  });
  this.fromID = fromID;
  this.toID = toID;

  this.on('click', () => {
    const currentMode = useUiStateStore().mode;
    if (currentMode === MODE_INSPECT) {
      const arc = findArc(id);
      if (arc.type === 'preset') {

        useUiStateStore().updateInspector(INSPECTOR_MODE_PRESET_ARC, id);
      } else if (arc.type === 'postset') {
        useUiStateStore().updateInspector(INSPECTOR_MODE_POSTSET_ARC, id);
      }
    } else if (currentMode === MODE_REMOVE) {
      disconnect(id);
      removeArcFromExportArray(id);
    }
  });
}

// TODO: This is fluff to properly set up inheritance ... I don't like it.
Arc.prototype = Object.create(Konva.Arrow.prototype);
Object.defineProperty(Arc.prototype, 'constructor', {
  value: Arc,
  enumerable: false,
  writable: true,
});
