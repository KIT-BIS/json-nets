import * as joint from 'jointjs';

import { useNetStore } from '@/stores/net';

export default class DeleteButton extends joint.elementTools.Button {
    constructor(deleteX: string, element: joint.dia.Element) {
        super({
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attributes: {
              r: 8,
              fill: '#FF1D00',
              cursor: 'pointer'
            }
          },
          {
            tagName: 'path',
            selector: 'icon',
            attributes: {
              d: 'M -3 -3 3 3 M -3 3 3 -3',
              fill: 'none',
              stroke: '#FFFFFF',
              'stroke-width': 2,
              'pointer-events': 'none'
            }
          }
        ],
        useModelGeometry: true,
        x: deleteX,
        y: '100%',
        offset: {
          x: 0,
          y: 0
        },
        rotate: true,
        action: function () {
          const netState = useNetStore()
          if (element.get('jsonnetsType') === 'place') {
            netState.deletePlace(String(element.id))
          } else if (element.get('jsonnetsType') === 'transition') {
            netState.deleteTransition(String(element.id))
          }
        }
      })
    }
}