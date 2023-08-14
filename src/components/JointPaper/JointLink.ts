import { useNetStore } from '@/stores/net';

import * as joint from 'jointjs';


export default class Link extends joint.shapes.standard.Link {
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
    this.set('id', id)
    // Todo: probably distinction between inbound/outbound useful
    this.prop('jsonnetsType', jsonnetsType)

    this.connector('straight', { cornerType: 'cubic' })
    
  }

  addInteractionTools(paper: joint.dia.Paper) {

    const deleteButton = new joint.linkTools.Button({
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
      distance: 30,
      action: () => {
        const netState = useNetStore();
        netState.disconnect(String(this.id))
      }
    })

    const toolsView = new joint.dia.ToolsView({
      tools: [deleteButton]
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