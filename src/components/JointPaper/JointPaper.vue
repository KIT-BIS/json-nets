<template>
  <div
    id="canvasContainer"
    :class="{
      'scoped-canvas-add': isAddingElements,
      'scoped-canvas-panning': isPanningMode,
      'scoped-canvas-pannable': isPannableMode
    }"
  >
    <div id="jointCanvas"></div>
  </div>
</template>
<script lang="ts">
import * as joint from 'jointjs'
import Link from './JointLink'
import Place from './JointPlace'
import Transition from './JointTransition'

import * as dagre from '@dagrejs/dagre'
import * as graphlib from '@dagrejs/graphlib'

import { mapStores } from 'pinia'

import {
  MODE_PLAY,
  MODE_LAYOUT,
  MODE_ADD_PLACE,
  MODE_ADD_TRANSITION,
  MODE_CONNECT_START,
  MODE_MOVE,
  MODE_NONE
} from '@/App.vue'
import {
  EVENT_NET_IMPORTED,
  EVENT_OCCUR_ADD_TOKEN,
  EVENT_OCCUR_REMOVE_TOKEN,
  EVENT_ADD_PLACE,
  EVENT_ADD_TRANSITION,
  EVENT_CONNECT,
  EVENT_CHANGE_PLACE_CONTENT,
  EVENT_REMOVE_PLACE,
  EVENT_REMOVE_TRANSITION,
  EVENT_DISCONNECT,
  EVENT_CHANGE_TRANSITION_CONTENT,
  occurAny,
  addPlace,
  addTransition,
  register,
  connect
} from '@/jsonnets/net'

import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'

//Todo: not sure if having a variable declared outside of component
// is advisable - currently it seems to me the only way
// to share an object that shouldn't be reactive data across the 
// component methods
let _paper: joint.dia.Paper;
let _graph: joint.dia.Graph;

export default defineComponent({
  data() {
    return {
      panX: 0,
      panY : 0,
      clickX: 0,
      clickY: 0,
      isPanning: false
    }
  },
  computed: {
    isAddingElements() {
      return this.uiStateStore.mode === MODE_ADD_PLACE || this.uiStateStore.mode === MODE_ADD_TRANSITION
    },
    isPannableMode() {
      return this.uiStateStore.mode === MODE_MOVE && !this.isPanning
    },
    isPanningMode() {
      return this.uiStateStore.mode === MODE_MOVE && this.isPanning
    },
    ...mapStores(useUiStateStore)
  },
  watch: {
    'uiStateStore.mode'(newMode) {
      this.onModeChange(newMode)
    }
  },
  mounted() {
    const pn = joint.shapes.pn;
    const standard = joint.shapes.standard;
    _graph = new joint.dia.Graph();
    _paper = new joint.dia.Paper({
      el: <HTMLElement>document.getElementById('jointCanvas'),
      cellViewNamespace: { pn },
      model: _graph,
      width: window.innerWidth,
      height: window.innerHeight,
      gridSize: 12,
      drawGrid: true,
      background: {
        color: '#f6f6f6'
      },
      linkPinning: false,
      defaultLink: () => new standard.Link(),
      defaultAnchor: { name: 'modelCenter' },
      defaultConnectionPoint: { name: 'boundary' },
      // todo: this probably does something with some css classes
      markAvailable: true,
      validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
        if (cellViewT.model.isLink() || cellViewS.model.isLink()) return false

        if (cellViewT.model.get('jsonnetsType') === cellViewS.model.get('jsonnetsType'))
          return false

        return true
      }
    })

    _paper.on('blank:pointerclick', (event, eventX, eventY) => {
      this.onPaperClick(eventX, eventY)
    })

    _paper.on('element:mouseenter', (elementView) => {
      if (this.uiStateStore.mode === MODE_CONNECT_START || this.uiStateStore.mode === MODE_MOVE) {
        elementView.showTools()
      }
    })

    _paper.on('element:mouseleave', (elementView) => {
       elementView.hideTools()
    })

    _paper.on('link:mouseenter', (linkView) => {
      if (this.uiStateStore.mode === MODE_CONNECT_START || this.uiStateStore.mode === MODE_MOVE) {
        linkView.showTools()
      }
    })

    _paper.on('link:mouseleave', (linkView) => {
      linkView.hideTools()
    })

    _paper.on('blank:pointerdown', (event, x, y) => {
      this.onDragStart(x, y)
    })

    const jointCanvas = document.getElementById('jointCanvas');
    if (jointCanvas) {
        jointCanvas.onmousemove = (event) => {
        this.onMouseMove(event)
      }
    }

    _paper.on('cell:pointerup blank:pointerup', () => {
      this.onDragEnd()
    })

    _paper.on('link:connect', (linkView) => {
      let targetId = linkView.model.target().id
      let sourceId = linkView.model.source().id

      _graph.removeCells([linkView.model]);
      connect(String(sourceId), String(targetId))
    })

    register(this.onJsonnetsEvent)

  },
  methods: {
    onModeChange(newMode: string) {
      _paper.removeTools()
      if (newMode === MODE_CONNECT_START) {
        // append connect tools
        const elements = _graph.getElements()
        for (let i = 0; i < elements.length; i++) {
          const element = <Place|Transition>elements[i]; 
          element.addConnectTools(_paper);
        }
      } else if (newMode === MODE_MOVE) {
        const elements = _graph.getElements()
        for (let i = 0; i < elements.length; i++) {
          const element = <Place|Transition>elements[i]; 
          element.addInteractionTools(_paper)
        }

        const links = _graph.getLinks()
        for (let i = 0; i < links.length; i++) {
          const link = <Link>links[i];
          link.addInteractionTools(_paper);
        }
      } else if (newMode === MODE_LAYOUT) {
        this.updateGraphLayout()
        this.uiStateStore.mode = MODE_NONE
      } else if (newMode === MODE_PLAY) {
        let play = setInterval(() => {
          if (this.uiStateStore.mode !== MODE_PLAY) {
            clearInterval(play)
          } else {
            occurAny()
          }
        }, 1500)
      }
    },
    onJsonnetsEvent(event: string, payload: any) {
      if (event === EVENT_ADD_PLACE) {
        var place = new Place(this.clickX, this.clickY, payload.name, payload.id)
        place.addTo(_graph)
      } else if (event === EVENT_ADD_TRANSITION) {
        const transition = new Transition(this.clickX, this.clickY, payload.name, payload.id)
        transition.addTo(_graph)
      } else if (event === EVENT_CONNECT) {
        const link = new Link(payload.from, payload.to, payload.arcID, payload.jsonnetsType)
        link.addTo(_graph)
      } else if (event === EVENT_REMOVE_PLACE || event === EVENT_REMOVE_TRANSITION) {
        // connected links are automatically removed with current jointjs configuration
        // (and should already be properly removed in jsonnets backend)
        _graph.removeCells([_graph.getCell(payload)])
      } else if (event === EVENT_DISCONNECT) {
        _graph.removeCells([_graph.getCell(payload)])
      } else if (event === EVENT_CHANGE_PLACE_CONTENT) {
        const place = _graph.getCell(payload.placeID)
        place.set('tokens', payload.num)
        place.attr('.label/text', payload.name)
        // change name and token view
      } else if (event === EVENT_CHANGE_TRANSITION_CONTENT) {
        const transition = _graph.getCell(payload.transitionID)
        transition.attr('.label/text', payload.name)
        // change name
      } else if (event === EVENT_OCCUR_ADD_TOKEN || event === EVENT_OCCUR_REMOVE_TOKEN) {
        const link = _graph.getCell(payload.arcID)
        const place = _graph.getCell(payload.placeID);
        place.set('tokens', payload.num)

        //Todo: a hacky conversion to stop ts complaints
        var token = <SVGElement><unknown>joint.V('circle', { r: 5, fill: '#feb662' })
        let sec = 1
        const linkView = <joint.dia.LinkView> link.findView(_paper);
        linkView.sendToken(token, sec * 1000)
      } else if (event === EVENT_NET_IMPORTED) {
        this.updateGraphLayout()
        // TODO: this is VERY HACKY, but I'd like to have the layout of the example a bit nicer
        // could later add jointjs-specific positioning data to import/export functionality
        if (payload.isExample) {
          // set request
          const request = _graph.getCell('167d54d6-3a73-40f7-b317-0aa3580a44ac');
          request.set('position', { x: 0, y: 144 })
          // set student
          const student = _graph.getCell('48b440c6-43fc-4df6-b874-f758137e90e5')
          student.set('position', { x: 48, y: -12 })
          // set review
          const review = _graph.getCell('1952db8b-764c-45da-b2d4-8b1537400377')
          review.set('position', { x: 144, y: 144 })
          // set decision
          const decision = _graph.getCell('9a172fc4-04cd-49d1-94f3-b8b62d2aed42')
          decision.set('position', { x: 348, y: 144 })
          // set lecture
          const lecture = _graph.getCell('846b0b51-9981-40ad-a36a-5ee873f4de5a')
          lecture.set('position', { x: 288, y: -12 })
          // set accept
          const accept = _graph.getCell('0e1c227f-c03b-4969-be2b-9b151898a35c')
          accept.set('position', { x: 504, y: 48 })
          // set reject
          const reject = _graph.getCell('82ca126e-1b63-40ad-9f92-d156da6823b8')
          reject.set('position', { x: 504, y: 240 })
          // set notification
          const notification = _graph.getCell('daa76eb3-c88c-4f29-9903-43f2892d70da')
          notification.set('position', { x: 708, y: 144 })
          // set grade
          const grade = _graph.getCell('e6caf7c5-fe05-47fa-8179-cf3b7b3cad2a')
          grade.set('position', { x: 528, y: -96 })
        }
      }
    },
    onPaperClick(clickX: number, clickY: number) {
      this.clickX = clickX
      this.clickY = clickY
      if (this.uiStateStore.mode === MODE_ADD_PLACE) {
        addPlace()
      } else if (this.uiStateStore.mode === MODE_ADD_TRANSITION) {
        addTransition()
      }
    },
    updateGraphLayout() {
      _paper.freeze()
      joint.layout.DirectedGraph.layout(_graph, {
        nodeSep: 100,
        edgeSep: 100,
        rankSep: 100,
        rankDir: "LR",
        dagre: dagre,
        graphlib: graphlib
      })

      // TODO: resetting cells and fitting paper to content may be useful
      _paper.translate(100, 200)

      _paper.unfreeze()
    },
    onDragStart(x: number, y: number) {
      if (this.uiStateStore.mode === MODE_MOVE) {
        this.isPanning = true
        document.getElementById('canvasContainer')?.classList.add('panning-mode')
        this.panX = x
        this.panY = y
      }
    },
    onDragEnd() {
      if (this.uiStateStore.mode === MODE_MOVE) {
        document.getElementById('canvasContainer')?.classList.remove('panning-mode')
        this.isPanning = false
      }
    },
    onMouseMove(event: MouseEvent) {
      if (this.isPanning) {
        _paper.translate(event.offsetX - this.panX, event.offsetY - this.panY)
      }
    },
  },
})
</script>
<style scoped>
.scoped-canvas-add {
  cursor: copy;
}

.scoped-canvas-pannable {
  cursor: grab;
}

.scoped-canvas-panning {
  cursor: grabbing !important;
}
</style>
./JointPaper/JointPlace./JointPaper/JointTransition./JointPaper/JointLink@/jsonnets/net