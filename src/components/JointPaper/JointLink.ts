import * as joint from 'jointjs';
import { disconnect } from '@/jsonnets/net'
import { useUiStateStore } from '@/stores/uiState';
import {
  // INSPECTOR_MODE_POSTSET_ARC,
  // INSPECTOR_MODE_PRESET_ARC,
} from '@/App.vue'
import type { Net } from '@/json-nets/Net';


export default class Link extends joint.shapes.standard.Link {
  // jsn_net: Net
  
  constructor(from: string, to: string, id: string, jsonnetsType: string) {
    super({
      source: { id: from, selector: '.root' },
      target: { id: to, selector: '.root' },
      attrs: {
        '.connection': {
          fill: 'none',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          stroke: '#4b4a67'
        }
      }
    })
    // this.jsn_net = net;
    this.set('id', id)
    // Todo: probably distinction between inbound/outbound useful
    this.prop('jsonnetsType', jsonnetsType)

    // this.router('orthogonal')
    // this.router('manhattan')
    this.connector('straight', { cornerType: 'cubic' })
    
  }

  addInteractionTools(paper: joint.dia.Paper) {

    const deleteButton = new joint.linkTools.Button({
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
      distance: 30,
      action: () => {
        // this.get('jsonnetsNet').disconnect(String(this.id))
        const uiState = useUiStateStore();
        uiState.onLinkDeleteClick(String(this.id))
      }
    })

    const inspectorButton = new joint.linkTools.Button({
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
      distance: 70,
      action: () => {
        const uiState = useUiStateStore();
        uiState.setModal(this.get('jsonnetsType'), <string>this.id);
        // console.log('inspector')
        // console.log(this.id)
        // if (this.get('jsonnetsType') === 'preset') {
          //TODO
          // uiState.updateInspector(INSPECTOR_MODE_PRESET_ARC, <string>this.id)
        // } else if (this.get('jsonnetsType') === 'postset') {
          // TODO
          // uiState.updateInspector(INSPECTOR_MODE_POSTSET_ARC, <string>this.id)
        // }
      }
    })
    // var verticesTool = new joint.linkTools.Vertices();

    const toolsView = new joint.dia.ToolsView({
      tools: [deleteButton, inspectorButton]
    })

    let linkView = this.findView(paper)
    linkView.addTools(toolsView)
    linkView.hideTools()

  }

  addVerticesTools(paper: joint.dia.Paper) {
    var verticesTool = new joint.linkTools.Vertices();

    const toolsView = new joint.dia.ToolsView({
      tools: [verticesTool]
    })

    let linkView = this.findView(paper)
    linkView.addTools(toolsView)
    linkView.hideTools()

  }
}