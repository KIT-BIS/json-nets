import * as joint from 'jointjs'
import DeleteButton from './JointElementDeleteButton'
import InspectorButton from './JointElementInspectorButton'
import ConnectButton from './JointConnectButton'
import { 
  occur
} from '@/components/jsonnets/net'


export default class Transition extends joint.shapes.pn.Transition {
  constructor(x: number, y: number, name: string, id: string) {
    super({
      position: { x: x - 25, y: y - 25 },
      attrs: {
        '.label': {
          text: name,
          fill: '#7a7e9b'
        },
        '.root': {
          fill: 'hsl(204, 71%, 39%)',
          stroke: 'hsl(0, 0%, 21%)'
        }
      }
    })
    this.set('id', id)
    this.prop('jsonnetsType', 'transition')
    this.resize(100, 50)
  }

  addInteractionTools(paper: joint.dia.Paper) {
    const deleteX = '0%'
    const inspectorX = '100%'

    const deleteButton = new DeleteButton(deleteX, this);

    const inspectorButton = new InspectorButton(inspectorX, this);

    const occurButton = new joint.elementTools.Button({
      markup: [
        {
          tagName: 'circle',
          selector: 'button',
          attributes: {
            r: 7,
            fill: 'blue',
            cursor: 'pointer'
          }
        },
        {
          tagName: 'path',
          selector: 'icon',
          attributes: {
            d: 'M75,5 l-60,0 0,90 M15,45 l50,0',
            transform: 'translate(-3,-3) scale(0.09)',
            fill: 'none',
            stroke: 'white',
            'stroke-width': 20,
            cursor: 'pointer'
          }
        }
      ],
      useModelGeometry: true,
      x: '50%',
      y: '100%',
      offset: {
        x: 0,
        y: 0
      },
      rotate: true,
      action: () => {
        occur(this.id)
      }
    })
    const toolsView = new joint.dia.ToolsView({
      tools: [deleteButton, inspectorButton, occurButton]
    })

    const elementView = this.findView(paper)
    elementView.addTools(toolsView)
    elementView.hideTools()
  }
  addConnectTools(paper: joint.dia.Paper) {
    const connectButton = new ConnectButton();
    const toolsView = new joint.dia.ToolsView({
      tools: [connectButton]
    })

    const elementView = this.findView(paper)
    elementView.addTools(toolsView)
    elementView.hideTools()
  }

}