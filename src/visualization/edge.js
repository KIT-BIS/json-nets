import Konva from 'konva';
import {MODE_INSPECT, MODE_REMOVE, INSPECTOR_MODE_PRESET_EDGE,
  INSPECTOR_MODE_POSTSET_EDGE, getMode, updateInspector} from '../ui/ui';
import {disconnect, findEdge} from '../net/net';
import {removeEdgesExportArray} from '../util/exportNet';

/**
 * Creates a new visualization of an edge
 * by extending Konva.Arrow.
 * @param {Array} points
 * @param {String} fromID
 * @param {String} toID
 * @param {STring} id
 */
export function Edge(points, fromID, toID, id) {
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
      const edge = findEdge(id);
      console.log('clicked on edge');
      console.log(edge.type);
      if (edge.type === 'preset') {
        console.log('preset')
        updateInspector(INSPECTOR_MODE_PRESET_EDGE, id);
      } else if (edge.type === 'postset') {
        console.log('postset')
        updateInspector(INSPECTOR_MODE_POSTSET_EDGE, id);
      }
    } else if (getMode() === MODE_REMOVE) {
      disconnect(id);
      removeEdgesExportArray(id);
    }
  });
}

// TODO: This is fluff to properly set up inheritance ... I don't like it.
Edge.prototype = Object.create(Konva.Arrow.prototype);
Object.defineProperty(Edge.prototype, 'constructor', {
  value: Edge,
  enumerable: false,
  writable: true,
});
