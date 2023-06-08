<template>
    <!-- <div > -->
    <!-- <div id="jointCanvas" :class="{ 'add-mode': isAddingElements }" ></div> -->
    <!-- TODO: would like to have grab cursor during panning, but isPanning somehow doesn't work - maybe view not updating during dragging?-->
    <div id="canvasContainer" :class="{ 'add-mode': isAddingElements, 'panning-mode': isPanningMode, 'pannable-mode': isPannableMode,  }">
    <div id="jointCanvas" ></div>
    </div>
</template>
<script lang="ts">
//@ts-ignore
// import { dia } from 'jointjs';
//@ts-ignore
import * as joint from 'jointjs/src/core.mjs';
//@ts-ignore
import * as layout from 'jointjs/src/layout/index.mjs';
//@ts-ignore
// import * as pn from 'jointjs/src/shapes/pn.mjs';
import * as standard from 'jointjs/src/shapes/standard.mjs';

import * as dagre from '@dagrejs/dagre';
import * as graphlib from '@dagrejs/graphlib';

import { MODE_PLAY, MODE_LAYOUT, MODE_ADD_PLACE, MODE_ADD_TRANSITION, MODE_CONNECT_START, MODE_MOVE, INSPECTOR_MODE_PLACE, INSPECTOR_MODE_TRANSITION, INSPECTOR_MODE_POSTSET_ARC, INSPECTOR_MODE_PRESET_ARC, MODE_NONE } from '@/App.vue';
import {
    EVENT_NET_IMPORTED,
    EVENT_OCCUR_ADD_TOKEN,
    EVENT_OCCUR_REMOVE_TOKEN,
EVENT_ADD_PLACE, EVENT_ADD_TRANSITION,
  EVENT_CONNECT,
  EVENT_CHANGE_PLACE_CONTENT,
  EVENT_REMOVE_PLACE,
  EVENT_REMOVE_TRANSITION,
  EVENT_DISCONNECT,
  EVENT_CHANGE_TRANSITION_CONTENT, occur, occurAny, addPlace, addTransition, removePlace, removeTransition, disconnect, register, connect} from '@/components/jsonnets/net';


import { useUiStateStore } from '@/stores/uiState';
import Place from '@/components/canvas/place';

import * as pn from 'jointjs/src/shapes/pn.mjs';


export default {
    setup() {
        const paper = {};
        const uiState = useUiStateStore();
        let clickX = 0;
        let clickY = 0;

        const graph = new joint.dia.Graph();
        let isPanning = false;
        let panX = 0;
        let panY = 0;
        return { 
            isPanning,
            graph,
            paper, 
            uiState,
            clickX,
            clickY
        }
    },
    computed: {
        isAddingElements() {
            return (this.uiState.mode === MODE_ADD_PLACE || this.uiState.mode === MODE_ADD_TRANSITION);
        },
        isPannableMode() {
            return (this.uiState.mode === MODE_MOVE && !this.isPanning)
        },
        isPanningMode() {
            return (this.uiState.mode === MODE_MOVE && this.isPanning)
        }
    },
    methods: {
        onModeChange(){
            this.paper.removeTools()
            if (this.uiState.mode === MODE_CONNECT_START) {
                const elements = this.graph.getElements();
                for (let i = 0; i < elements.length; i++) {
                    this.addConnectTools(elements[i])
                }

                // append connect tools
            } else if (this.uiState.mode === MODE_MOVE){
                const elements = this.graph.getElements();
                for (let i = 0; i < elements.length; i++) {
                    this.addInteractionToolsForElements(elements[i])
                }

                const links = this.graph.getLinks();
                for (let i = 0; i < links.length; i++) {
                    this.addInteractionToolsForLinks(links[i]);
                }
            }  else if (this.uiState.mode === MODE_LAYOUT) {
                    this.updateGraphLayout();
                    this.uiState.mode = MODE_NONE;
            } else if (this.uiState.mode === MODE_PLAY) {
                console.log('playing')
                let play = setInterval(() => {
                    if (this.uiState.mode !== MODE_PLAY) {
                        console.log('stop playing')
                        clearInterval(play)
                    } else {
                        console.log('should fire')
                        occurAny();
                    }
                }, 1500);

            }
        },
        updateGraphLayout() {

            this.paper.freeze();
            const layoutOptions = {
                nodeSep: 100,
                edgeSep: 100,
                rankSep: 100,
                rankDir: "LR",
                dagre: dagre,
                graphlib: graphlib
            }
            layout.DirectedGraph.layout(this.graph, layoutOptions);

            // TODO: needed?
            // if (this.graph.getCells().length === 0) {
                // The graph could be empty at the beginning to avoid cells rendering
                // and their subsequent update when elements are translated
                // this.graph.resetCells(cells);
            // }
            // this.paper.fitToContent({
                // padding: 50,
                // allowNewOrigin: 'any',
                // useModelGeometry: true
            // })
            this.paper.translate(100,200);

            this.paper.unfreeze();


        },
        onDragStart(x, y) {
            if (this.uiState.mode === MODE_MOVE) {
                this.isPanning = true;
                document.getElementById('canvasContainer')?.classList.add('panning-mode')
                this.panX = x;
                this.panY = y;
            }

        },
        onDragEnd() {
            if (this.uiState.mode === MODE_MOVE) {
                document.getElementById('canvasContainer')?.classList.remove('panning-mode')
                this.isPanning = false;
            }
        },
        onMouseMove(event) {
            if(this.isPanning) {
                this.paper.translate(
                event.offsetX - this.panX, 
                event.offsetY - this.panY);
            }
        },
        onJsonnetsEvent(event, payload) {
            if (event === EVENT_ADD_PLACE) {
                this.drawPlace(payload.id, payload.name);
            } else if (event === EVENT_ADD_TRANSITION) {
                this.drawTransition(payload.id, payload.name);
            } else if (event === EVENT_CONNECT) {
                this.drawLink(payload.from, payload.to, payload.arcID, payload.jsonnetsType)
            } else if (event === EVENT_REMOVE_PLACE || event === EVENT_REMOVE_TRANSITION) {
                // connected links are automatically removed with current jointjs configuration
                // (and should already be properly removed in jsonnets backend)
                this.graph.removeCells(this.graph.getCell(payload));
            } else if (event === EVENT_DISCONNECT) {
                this.graph.removeCells(this.graph.getCell(payload))
            } else if (event === EVENT_CHANGE_PLACE_CONTENT) {
                const place = this.graph.getCell(payload.placeID);
                place.set('tokens', payload.num)
                place.attr('.label/text', payload.name)
                // change name and token view

            } else if (event === EVENT_CHANGE_TRANSITION_CONTENT) {
                const transition = this.graph.getCell(payload.transitionID);
                transition.attr('.label/text', payload.name)
                // change name
            } else if (event === EVENT_OCCUR_ADD_TOKEN || event === EVENT_OCCUR_REMOVE_TOKEN) {
                const link = this.graph.getCell(payload.arcID) 
                const place = this.graph.getCell(payload.placeID) 
                place.set('tokens', payload.num)

                var token = joint.V('circle', { r: 5, fill: '#feb662' });
                let sec = 1;
                link.findView(this.paper).sendToken(token, sec * 1000);

            } else if (event === EVENT_NET_IMPORTED) {
                this.updateGraphLayout();
                // TODO: this is VERY HACKY, but I'd like to have the layout of the example a bit nicer
                // could later add jointjs-specific positioning data to import/export functionality
                if (payload.isExample) {
                    // set request
                    this.graph.getCell('167d54d6-3a73-40f7-b317-0aa3580a44ac').set('position', { x: 0, y: 144 })
                    // set student
                    this.graph.getCell('48b440c6-43fc-4df6-b874-f758137e90e5').set('position', { x: 48, y: -12 })
                    // set review 
                    this.graph.getCell('1952db8b-764c-45da-b2d4-8b1537400377').set('position', { x: 144, y: 144 })
                    // set decision
                    this.graph.getCell('9a172fc4-04cd-49d1-94f3-b8b62d2aed42').set('position', { x: 348, y: 144 })
                    // set lecture
                    this.graph.getCell('846b0b51-9981-40ad-a36a-5ee873f4de5a').set('position', { x: 288, y: -12 })
                    // set accept
                    this.graph.getCell('0e1c227f-c03b-4969-be2b-9b151898a35c').set('position', { x: 504, y: 48 })
                    // set reject
                    this.graph.getCell('82ca126e-1b63-40ad-9f92-d156da6823b8').set('position', { x: 504, y: 240 })
                    // set notification
                    this.graph.getCell('daa76eb3-c88c-4f29-9903-43f2892d70da').set('position', { x: 708, y: 144 })
                    // set grade
                    this.graph.getCell('e6caf7c5-fe05-47fa-8179-cf3b7b3cad2a').set('position', { x: 528, y: -96 })



                    // set lecture
                    // this.graph.getCell('846b0b51-9981-40ad-a36a-5ee873f4de5a').set('position', { x: 264, y: 0 })
                    // set notification
                    // set reject
                    // set grade
                }

                
            }
        },
        onPaperClick(clickX, clickY) {
            this.clickX = clickX;
            this.clickY =  clickY;
            if (this.uiState.mode === MODE_ADD_PLACE) {
                addPlace(); 
            } else if (this.uiState.mode === MODE_ADD_TRANSITION) {
                addTransition();
            }
        },
        onViewHoverStart(view) {
            if (this.uiState.mode === MODE_CONNECT_START ||
                this.uiState.mode === MODE_MOVE) {
                view.showTools();
            }
        },
        onViewHoverEnd(view) {
            // todo distinguish between links and elements
            if (this.uiState.mode === MODE_CONNECT_START || 
                this.uiState.mode === MODE_MOVE) {
                view.hideTools();
            }
        },
        drawLink(from, to, id, jsonnetsType) {
            const link = new standard.Link({
                source: { id: from, selector: '.root' },
                target: { id: to, selector: '.root' },
                attrs: {
                    '.connection': {
                        'fill': 'none',
                        'stroke-linejoin': 'round',
                        'stroke-width': '2',
                        'stroke': '#4b4a67'
                    }
                }
            });
            link.set('id', id);
            // Todo: probably distinction between inbound/outbound useful
            link.prop('jsonnetsType', jsonnetsType);
            link.addTo(this.graph);

            // link.findView(this.paper);
        },
        drawPlace(id, name) {
            var place = new pn.Place({
                // TODO: actually calculate this position to center it
                position: { x: this.clickX - 25, y: this.clickY - 25 },
                attrs: {
                    '.label': {
                        'text': name,
                        'fill': '#7a7e9b'
                    },
                    '.root': {
                        'stroke': 'hsl(204, 71%, 39%)',
                        'stroke-width': 3
                    },
                    '.tokens > circle': {
                        'fill': '#7a7e9b'
                    },
                    '.alot > text': {
                        'fill': '#7a7e9b',
                        'font-family': 'Courier New',
                        'font-size': 20,
                        'font-weight': 'bold',
                        'ref-x': 0.5,
                        'ref-y': 0.5,
                        'y-alignment': -0.5,
                        'transform': null
                    }
                },
                tokens: 0,
            });
            place.set('id', id);
            // place.prop('jsonnetsId', id);
            place.prop('jsonnetsType', 'place');
            place.addTo(this.graph);
            // this.addConnectTools(place, "120%");
        },
        addInteractionToolsForLinks(link) {
            let deleteButton = new joint.linkTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 7,
                        'fill': '#FF1D00',
                        'cursor': 'pointer'
                    }
                }, {
                    tagName: 'path',
                    selector: 'icon',
                    attributes: {
                        'd': 'M -3 -3 3 3 M -3 3 3 -3',
                        'fill': 'none',
                        'stroke': '#FFFFFF',
                        'stroke-width': 2,
                        'pointer-events': 'none'
                    }
                }],
                distance: 30,
                // rotate: true,
                action: function (evt) {
                    disconnect(this.model.id)
                    // if (this.model.get('jsonnetsType') === 'place') {
                    // removePlace(this.model.id);
                    // } else if (this.model.get('jsonnetsType') === 'transition') {
                    // removeTransition(this.model.id);
                    // }
                    // TODO: delete
                    // alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
                }
            });

            var inspectorButton = new joint.linkTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 7,
                        'fill': 'green',
                        'cursor': 'pointer'
                    }
                }, {
                    tagName: 'path',
                    selector: 'icon',
                    attributes: {
                        'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                        'fill': 'none',
                        'stroke': '#FFFFFF',
                        'stroke-width': 2,
                        'pointer-events': 'none'
                    }
                }],
                distance: 70,
                // rotate: true,
                action: (evt) => {
                    if (link.get('jsonnetsType') === 'preset') {
                        this.uiState.updateInspector(INSPECTOR_MODE_PRESET_ARC, link.id);
                    } else if (link.get('jsonnetsType') === 'postset') {
                        this.uiState.updateInspector(INSPECTOR_MODE_POSTSET_ARC, link.id);
                    }
                }
            });

            var toolsView = new joint.dia.ToolsView({
                tools: [deleteButton, inspectorButton]
            });

            let linkView = link.findView(this.paper);
            linkView.addTools(toolsView);
            linkView.hideTools()
        },
        addInteractionToolsForElements(element) {
            let deleteX = "0%";
            let inspectorX = "100%";
            if (element.get('jsonnetsType') === 'place') {
                deleteX = "25%";
                inspectorX = "75%";
            }

            let deleteButton = new joint.elementTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 7,
                        'fill': '#FF1D00',
                        'cursor': 'pointer'
                    }
                }, {
                    tagName: 'path',
                    selector: 'icon',
                    attributes: {
                        'd': 'M -3 -3 3 3 M -3 3 3 -3',
                        'fill': 'none',
                        'stroke': '#FFFFFF',
                        'stroke-width': 2,
                        'pointer-events': 'none'
                    }
                }],
                useModelGeometry: true,
                x: deleteX,
                y: '100%',
                offset: {
                    x: 0,
                    y: 0
                },
                rotate: true,
                action: function (evt) {
                    if (this.model.get('jsonnetsType') === 'place') {
                        removePlace(this.model.id);
                    } else if (this.model.get('jsonnetsType') === 'transition') {
                        removeTransition(this.model.id);
                    }
                    // TODO: delete
                    // alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
                }
            });

            var inspectorButton = new joint.elementTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 7,
                        // 'fill': '#001DFF',
                        'fill': 'green',
                        'cursor': 'pointer'
                    }
                }, {
                    tagName: 'path',
                    selector: 'icon',
                    attributes: {
                        'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                        'fill': 'none',
                        'stroke': '#FFFFFF',
                        'stroke-width': 2,
                        'pointer-events': 'none'
                    }
                }],
                useModelGeometry: true,
                x: inspectorX,
                y: '100%',
                offset: {
                    x: 0,
                    y: 0
                },
                rotate: true,
                action: (evt) => {
                    console.log('clicked inspector')
                    console.log(element.id)
                    console.log(element.get('position'));
                    if (element.get('jsonnetsType') === 'place') {
                        this.uiState.updateInspector(INSPECTOR_MODE_PLACE, element.id);
                    } else if (element.get('jsonnetsType') === 'transition') {
                        this.uiState.updateInspector(INSPECTOR_MODE_TRANSITION, element.id);
                    }
                }
            });

            if (element.get('jsonnetsType') === 'transition') {
                let occurButton = new joint.elementTools.Button({
                    markup: [{
                        tagName: 'circle',
                        selector: 'button',
                        attributes: {
                            'r': 7,
                            // 'fill': '#001DFF',
                            'fill': 'blue',
                            'cursor': 'pointer'
                        }
                    }, {
                        tagName: 'path',
                        selector: 'icon',
                        attributes: {
                            'd': 'M75,5 l-60,0 0,90 M15,45 l50,0',
                            'transform': 'translate(-3,-3) scale(0.09)',
                            'fill': 'none',
                            'stroke': 'white',
                            'stroke-width': 20,
                            'cursor': 'pointer',

                            // 'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                            // 'fill': 'none',
                            // 'stroke': '#FFFFFF',
                            // 'stroke-width': 2,
                            // 'pointer-events': 'none'
                        }
                    }],
                    useModelGeometry: true,
                    x: '50%',
                    y: '100%',
                    offset: {
                        x: 0,
                        y: 0
                    },
                    rotate: true,
                    action: (evt) => {
                        occur(element.id);
                    }
                });
                var toolsView = new joint.dia.ToolsView({
                    tools: [deleteButton, inspectorButton, occurButton]
                });

                let elementView = element.findView(this.paper);
                elementView.addTools(toolsView);
                elementView.hideTools()



            } else {
                var toolsView = new joint.dia.ToolsView({
                    tools: [deleteButton, inspectorButton]
                });

                let elementView = element.findView(this.paper);
                elementView.addTools(toolsView);
                elementView.hideTools()

            }
        },
        addConnectTools(element) {
            const x = "100%";
            const connectButton = new joint.elementTools.Connect({
                x: x,
                y: "50%",
                useModelGeometry: true,
                markup: [
                    {
                        tagName: 'circle',
                        selector: 'button',
                        attributes: {
                            'r': 7,
                            'fill': '#7a7e9b',
                            'cursor': 'pointer'
                        }
                    },
                    {
                        tagName: "path",
                        selector: "icon",
                        attributes: {
                            // transform: `rotate(90)`,
                            d: "M -4 -1 L 0 -1 L 0 -4 L 4 0 L 0 4 0 1 -4 1 z",
                            fill: "#FFFFFF",
                            stroke: "none",
                            "stroke-width": 2,
                            "pointer-events": "none"
                        }
                    }
                ]
            });

            // var boundaryTool = new joint.elementTools.Boundary();
            var boundaryTool = new joint.elementTools.Boundary({
                padding: 20,
                rotate: true,
                useModelGeometry: true,
            });

            var toolsView = new joint.dia.ToolsView({
                tools: [
                    // boundaryTool,
                    connectButton
                    // removeButton
                ]
            });

            let elementView = element.findView(this.paper);
            elementView.addTools(toolsView);
            elementView.hideTools();
        },
        drawTransition(id, name) {
            var transition = new pn.Transition({
                position: { x: this.clickX - 25, y: this.clickY - 25 },
                attrs: {
                    '.label': {
                        'text': name,
                        'fill': '#7a7e9b'
                    },
                    '.root': {
                        // 'fill': '#9586fd',
                        'fill': 'hsl(204, 71%, 39%)',
                        'stroke': 'hsl(0, 0%, 21%)',
                    }
                },
            });
            transition.set('id', id);
            transition.prop('jsonnetsType', 'transition');
            transition.resize(100, 50);
            transition.addTo(this.graph);

            // this.addConnectTools(transition, "110%");
            // this.addInteractionToolsForElements(transition);
        }
    },
    mounted() {
        this.paper = new joint.dia.Paper({
            el: document.getElementById('jointCanvas'),
            cellViewNamespace: { pn },
            model: this.graph,
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

                if (cellViewT.model.isLink() || cellViewS.model.isLink()) return false;

                if (cellViewT.model.get('jsonnetsType') === cellViewS.model.get('jsonnetsType')) return false;

                return true;
            }
            //connectionStrategy: function (end, view, _magnet, coords) {
            //    end.anchor = {
            //    name: view.model.getBBox().sideNearestToPoint(coords)
            //    };
            //}
            // drawGrid: this.drawGrid,
            // background: this.background,
            // interactive: !this.readonly,
        });

        this.paper.on('blank:pointerclick', (event, eventX, eventY) => {
            this.onPaperClick(eventX, eventY)
        });

        this.paper.on('element:mouseenter', (elementView) => {
            this.onViewHoverStart(elementView);
        });

        this.paper.on('element:mouseleave', (elementView) => {
            this.onViewHoverEnd(elementView);
        })

        this.paper.on('link:mouseenter', (linkView) => {
            this.onViewHoverStart(linkView)
        });

        this.paper.on('link:mouseleave', (linkView) => {
            this.onViewHoverEnd(linkView)
        });


        this.paper.on('blank:pointerdown', (event, x, y) => {
            this.onDragStart(x, y);
        });

        document.getElementById('jointCanvas').onmousemove = (event) => {
            this.onMouseMove(event);
        };

        this.paper.on('cell:pointerup blank:pointerup', (cellView, x, y) => {
            this.onDragEnd();
        });

        this.paper.on('link:connect', (linkView, evt, elementViewConnected, magnet, arrowhead) => {

            let targetId = linkView.model.target().id;
            let sourceId = linkView.model.source().id;

            this.graph.removeCells(linkView.model);
            connect(sourceId, targetId);
        })

        register(this.onJsonnetsEvent);

        this.uiState.$subscribe((mutation, state) => {
            if ((mutation.events.key === "mode")) {
                this.onModeChange();
            }
        })
    }
};
</script>
<style scoped>
.add-mode {
    cursor: copy
}

.pannable-mode {
    cursor: grab
}

.panning-mode {
    cursor: grabbing !important
}
</style>