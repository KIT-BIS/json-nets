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
  // EVENT_NET_IMPORTED,
  // EVENT_ADD_PLACE,
  // EVENT_CONNECT,
  // EVENT_CHANGE_PLACE_CONTENT,
  // EVENT_REMOVE_PLACE,
  // EVENT_DISCONNECT,
  // occurAny,
  // addPlace,
  // register,
  // connect
} from '@/jsonnets/net'

import {
  EVENT_ADD_PLACE,
  EVENT_REMOVE_PLACE,
  EVENT_UPDATE_PLACE,
  EVENT_ADD_TRANSITION,
  EVENT_REMOVE_TRANSITION,
  EVENT_UPDATE_TRANSITION,
  EVENT_CONNECT,
  EVENT_DISCONNECT,
  EVENT_FIRE_ADD_FRAGMENT,
  EVENT_FIRE_REMOVE_FRAGMENT,
  EVENT_NET_IMPORTED,
  Net
} from '@/json-nets/Net'

import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { toRaw } from 'vue'

//Todo: not sure if having a variable declared outside of component
// is advisable - currently it seems to me the only way
// to share an object that shouldn't be reactive data across the 
// component methods
let _paper: joint.dia.Paper;
let _graph: joint.dia.Graph;

export default defineComponent({
  props: {
    net: {
      type: Net,
      required: true
    }
  },
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


    this.uiStateStore.setLayout(_graph)

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
      this.net.connect(String(sourceId), String(targetId))
    })

    this.net.register(this.onJsonnetsEvent)
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

        const links = _graph.getLinks()
        for (let i = 0; i < links.length; i++) {
          const link = <Link>links[i];
          link.addVerticesTools(_paper);
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
            this.net.fireAny()
            // occurAny()
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
        link.addVerticesTools(_paper)
      } else if (event === EVENT_REMOVE_PLACE || event === EVENT_REMOVE_TRANSITION) {
        // connected links are automatically removed with current jointjs configuration
        // (and should already be properly removed in jsonnets backend)
        _graph.removeCells([_graph.getCell(payload)])
      } else if (event === EVENT_DISCONNECT) {
        _graph.removeCells([_graph.getCell(payload)])
      } else if (event === EVENT_UPDATE_PLACE) {
        const place = _graph.getCell(payload.id)
        place.set('tokens', payload.num)
        place.attr('.label/text', payload.name)
        // change name and token view
      } else if (event === EVENT_UPDATE_TRANSITION) {
        const transition = _graph.getCell(payload.transitionID)
        transition.attr('.label/text', payload.name)
        // change name
      } else if (event === EVENT_FIRE_ADD_FRAGMENT || event === EVENT_FIRE_REMOVE_FRAGMENT) {
        const link = _graph.getCell(payload.arcID)
        const place = _graph.getCell(payload.placeID);
        place.set('tokens', payload.num)

        //Todo: a hacky conversion to stop ts complaints
        var token = <SVGElement><unknown>joint.V('circle', { r: 5, fill: '#feb662' })
        let sec = 1
        const linkView = <joint.dia.LinkView> link.findView(_paper);
        linkView.sendToken(token, sec * 1000)
      } else if (event === EVENT_NET_IMPORTED) {
        const layout = payload.layout;
        for (let i = 0; i < layout.cells.length; i++) {
          const cell = layout.cells[i];
          const element = _graph.getCell(cell.id);
          if (cell.type === "pn.Place" || cell.type === "pn.Transition") {
            element.set('position', { x: cell.position.x, y: cell.position.y});
          } else if (cell.type === "standard.Link") {
            const link = <joint.dia.Link> element;
            link.vertices(cell.vertices)
          }

        }
      }
    },
    onPaperClick(clickX: number, clickY: number) {
      this.clickX = clickX
      this.clickY = clickY
      if (this.uiStateStore.mode === MODE_ADD_PLACE) {
        this.net.addPlace()
      } else if (this.uiStateStore.mode === MODE_ADD_TRANSITION) {
        this.net.addTransition()
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