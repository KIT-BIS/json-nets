import * as joint from 'jointjs';
import {
  removePlace,
  removeTransition
} from '@/jsonnets/net'
import { useUiStateStore } from '@/stores/uiState';

export default class DeleteButton extends joint.elementTools.Button {
    constructor(deleteX: string, element: joint.dia.Element) {
        super({
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attributes: {
              r: 7,
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
          const uiState = useUiStateStore()
          if (element.get('jsonnetsType') === 'place') {
            uiState.onPlaceDeleteClick(String(element.id))
          } else if (element.get('jsonnetsType') === 'transition') {
            uiState.onTransitionDeleteClick(String(element.id))
          }
        }
      })
    }
}