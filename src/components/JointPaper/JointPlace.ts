import * as joint from 'jointjs';
import DeleteButton from './JointElementDeleteButton';
import InspectorButton from './JointElementInspectorButton';
import ConnectButton from './JointConnectButton'

export default class Place extends joint.shapes.pn.Place {
  constructor(x: number, y: number, name: string, id: string) {
    super({
      // TODO: actually calculate this position to center it
      position: { x: x - 25, y: y - 25 },
      attrs: {
        '.label': {
          text: name,
          fill: '#7a7e9b'
        },
        '.root': {
          stroke: 'hsl(204, 71%, 39%)',
          'stroke-width': 3
        },
        '.tokens > circle': {
          fill: '#7a7e9b'
        },
        '.alot > text': {
          fill: '#7a7e9b',
          'font-family': 'Courier New',
          'font-size': 20,
          'font-weight': 'bold',
          'ref-x': 0.5,
          'ref-y': 0.5,
          'y-alignment': -0.5,
        }
      },
      tokens: 0
    });
    this.set('id', id)
    this.prop('jsonnetsType', 'place')

  }

  addInteractionTools(paper: joint.dia.Paper) {
    const deleteX = '25%'
    const inspectorX = '75%'

    const deleteButton = new DeleteButton(deleteX, this);

    const inspectorButton = new InspectorButton(inspectorX, this);

    const toolsView = new joint.dia.ToolsView({
      tools: [deleteButton, inspectorButton]
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