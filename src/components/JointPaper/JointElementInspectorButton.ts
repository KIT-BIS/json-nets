import * as joint from 'jointjs';
import { useUiStateStore } from '@/stores/uiState';
import {
  INSPECTOR_MODE_PLACE,
  INSPECTOR_MODE_TRANSITION
} from '@/App.vue'


export default class InspectorButton extends joint.elementTools.Button {
  constructor(inspectorX: string, element: joint.dia.Element) {
    super({
      markup: [
        {
          tagName: 'circle',
          selector: 'button',
          attributes: {
            r: 7,
            fill: 'green',
            cursor: 'pointer'
          }
        },
        {
          tagName: 'path',
          selector: 'icon',
          attributes: {
            d: 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
            fill: 'none',
            stroke: '#FFFFFF',
            'stroke-width': 2,
            'pointer-events': 'none'
          }
        }
      ],
      useModelGeometry: true,
      x: inspectorX,
      y: '100%',
      offset: {
        x: 0,
        y: 0
      },
      rotate: true,
      action: () => {
        const uiState = useUiStateStore();
        if (element.get('jsonnetsType') === 'place') {
          uiState.updateInspector(INSPECTOR_MODE_PLACE, <string>element.id)
        } else if (element.get('jsonnetsType') === 'transition') {
          uiState.updateInspector(INSPECTOR_MODE_TRANSITION, <string>element.id)
        }
      }
    })
  }

}