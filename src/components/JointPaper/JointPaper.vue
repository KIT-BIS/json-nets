<template>
  <div id="canvasContainer" :class="{
    'scoped-canvas-add': isAddingElements,
    'scoped-canvas-panning': isPanningMode,
    'scoped-canvas-pannable': isPannableMode
  }">
    <div id="jointCanvas"></div>
  </div>
</template>
<script lang="ts">
import type { ArcData, ImportData, TransitionData, PlaceData, FireEvent } from '@/json-nets/Net'

import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

import { useUiStateStore } from '@/stores/uiState'
import { useTransitionsStore } from '@/stores/transition'
import { usePlacesStore } from '@/stores/place'
import { useNetStore } from '@/stores/net'

import * as joint from 'jointjs'
import Link from './JointLink'
import Place from './JointPlace'
import Transition from './JointTransition'

import * as dagre from '@dagrejs/dagre'
import * as graphlib from '@dagrejs/graphlib'

import {
  MODE_PLAY,
  MODE_LAYOUT,
  MODE_ADD_PLACE,
  MODE_ADD_TRANSITION,
  MODE_CONNECT_START,
  MODE_MOVE,
  MODE_NONE
} from '@/App.vue'

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
      panY: 0,
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
    ...mapStores(useUiStateStore),
    ...mapStores(useTransitionsStore),
    ...mapStores(usePlacesStore),
    ...mapStores(useNetStore)
  },
  watch: {
    'uiStateStore.mode'(newMode) {
      this.onModeChange(newMode)
    },
    'netStore.lastRemovedCells'(removedCells: Array<string>) {
      for (let i = 0; i < removedCells.length; i++) {
        _graph.removeCells([_graph.getCell(removedCells[i])])
      }
    },
    'netStore.lastUpdatedPlace'(placeData: PlaceData) {
      const place = _graph.getCell(placeData.id)
      place.set('tokens', placeData.marking.length)
      place.attr('.label/text', placeData.name)

    },
    'netStore.lastUpdatedTransition'(transData: TransitionData) {
      const transition = _graph.getCell(transData.id)
      transition.attr('.label/text', transData.name)

    },
    'netStore.lastFiredArcs'(fireData: Array<FireEvent>) {
      for (let i = 0; i < fireData.length; i++) {
        const fireEvent = fireData[i];
        const link = _graph.getCell(fireEvent.arcID)
        const place = _graph.getCell(fireEvent.placeID);
        place.set('tokens', fireEvent.num)

        //Todo: a hacky conversion to stop ts complaints
        var token = <SVGElement><unknown>joint.V('circle', { r: 5, fill: '#feb662' })
        let sec = 1
        const linkView = <joint.dia.LinkView>link.findView(_paper);
        linkView.sendToken(token, sec * 1000)
      }
    },
    'netStore.importedData'(data: { layoutData: any, netData: ImportData }) {
      _graph.clear();
      const netData = data.netData;
      const transitions = netData.transitions;
      for (let i = 0; i < transitions.length; i++) {
        const transitionData = transitions[i];
        const transition = new Transition(this.clickX, this.clickY, transitionData.name, transitionData.id)
        transition.addTo(_graph)
      }
      const places = netData.places;
      for (let i = 0; i < places.length; i++) {
        const placeData = places[i];
        const place = new Place(this.clickX, this.clickY, placeData.name, placeData.id)
        place.addTo(_graph)
        place.set('tokens', placeData.marking.length)
      }
      const arcs = netData.arcs;
      for (let i = 0; i < arcs.length; i++) {
        const arcData = arcs[i];
        const link = new Link(arcData.from, arcData.to, arcData.id, arcData.type)
        link.addTo(_graph)
        link.addVerticesTools(_paper)
      }

      const layout = data.layoutData;
      for (let i = 0; i < layout.cells.length; i++) {
        const cell = layout.cells[i];
        const element = _graph.getCell(cell.id);
        if (cell.type === "pn.Place" || cell.type === "pn.Transition") {
          element.set('position', { x: cell.position.x, y: cell.position.y });
        } else if (cell.type === "standard.Link") {
          const link = <joint.dia.Link>element;
          link.vertices(cell.vertices)
        }

      }

    },
    'netStore.lastCreatedTransitions'(transitions: Array<TransitionData>) {
      for (let i = 0; i < transitions.length; i++) {
        const transitionData = transitions[i];
        const transition = new Transition(this.clickX, this.clickY, transitionData.name, transitionData.id)
        transition.addTo(_graph)
      }

    },
    'netStore.lastCreatedPlaces'(places: Array<PlaceData>) {
      for (let i = 0; i < places.length; i++) {
        const placeData = places[i];
        const place = new Place(this.clickX, this.clickY, placeData.name, placeData.id)
        place.addTo(_graph)
      }

    },
    'netStore.lastCreatedArcs'(arcs: Array<ArcData>) {
      for (let i = 0; i < arcs.length; i++) {
        const arcData = arcs[i];
        const link = new Link(arcData.from, arcData.to, arcData.id, arcData.type)
        link.addTo(_graph)
        link.addVerticesTools(_paper)
      }

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


    this.netStore.setLayout(_graph)

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
      let sourceId = String(linkView.model.source().id)
      let targetId = String(linkView.model.target().id)

      _graph.removeCells([linkView.model]);
      this.netStore.connect(sourceId, targetId)
    })

  },
  methods: {
    onModeChange(newMode: string) {
      _paper.removeTools()
      if (newMode === MODE_CONNECT_START) {
        // append connect tools
        const elements = _graph.getElements()
        for (let i = 0; i < elements.length; i++) {
          const element = <Place | Transition>elements[i];
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
          const element = <Place | Transition>elements[i];
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
            this.netStore.fireAny();
          }
        }, 1500)
      }
    },
    onPaperClick(clickX: number, clickY: number) {
      this.clickX = clickX
      this.clickY = clickY
      if (this.uiStateStore.mode === MODE_ADD_PLACE) {
        this.netStore.addPlace()
      } else if (this.uiStateStore.mode === MODE_ADD_TRANSITION) {
        this.netStore.addTransition();
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