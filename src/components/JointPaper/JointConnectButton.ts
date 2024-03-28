import * as joint from 'jointjs';

/**
 * A small button shown when hovering over model elements to draw arcs.
 */
export default class ConnectButton extends joint.elementTools.Connect {
  constructor() {
    super({
      x: '100%',
      y: '50%',
      useModelGeometry: true,
      markup: [
        {
          tagName: 'circle',
          selector: 'button',
          attributes: {
            r: 8,
            fill: '#7a7e9b',
            cursor: 'pointer'
          }
        },
        {
          tagName: 'path',
          selector: 'icon',
          attributes: {
            d: 'M -4 -1 L 0 -1 L 0 -4 L 4 0 L 0 4 0 1 -4 1 z',
            fill: '#FFFFFF',
            stroke: 'none',
            'stroke-width': 2,
            'pointer-events': 'none'
          }
        }
      ]
    })
  }
}