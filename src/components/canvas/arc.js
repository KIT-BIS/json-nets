import Konva from 'konva';
import {MODE_INSPECT, MODE_REMOVE, INSPECTOR_MODE_PRESET_ARC,
  INSPECTOR_MODE_POSTSET_ARC, getMode, updateInspector} from '@/App.vue';
import {disconnect, findArc} from '../jsonnets/net';
import {removeArcFromExportArray} from '@/util/exportNet';

/**
 * Creates a new visualization of an arc
 * by extending Konva.Arrow.
 * @param {Array} points
 * @param {String} fromID
 * @param {String} toID
 * @param {STring} id
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
    if (getMode() === MODE_INSPECT) {
      const arc = findArc(id);
      if (arc.type === 'preset') {
        updateInspector(INSPECTOR_MODE_PRESET_ARC, id);
      } else if (arc.type === 'postset') {
        updateInspector(INSPECTOR_MODE_POSTSET_ARC, id);
      }
    } else if (getMode() === MODE_REMOVE) {
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
