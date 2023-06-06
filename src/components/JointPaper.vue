<template>
    <!-- <div > -->
    <!-- <div id="jointCanvas" :class="{ 'add-mode': isAddingElements }" ></div> -->
    <div :class="{ 'add-mode': isAddingElements }">
    <div id="jointCanvas" ></div>
    </div>
</template>
<script lang="js">
//@ts-ignore
// import { dia } from 'jointjs';
//@ts-ignore
import * as joint from 'jointjs/src/core.mjs';
//@ts-ignore
// import * as pn from 'jointjs/src/shapes/pn.mjs';
import * as standard from 'jointjs/src/shapes/standard.mjs';

import { MODE_ADD_PLACE, MODE_ADD_TRANSITION, MODE_CONNECT_START } from '@/App.vue';

import {EVENT_ADD_PLACE, EVENT_ADD_TRANSITION,
  EVENT_CONNECT,
  EVENT_CHANGE_PLACE_CONTENT,
  EVENT_REMOVE_PLACE,
  EVENT_REMOVE_TRANSITION,
  EVENT_DISCONNECT,
  EVENT_CHANGE_TRANSITION_CONTENT, addPlace, addTransition, register} from '@/components/jsonnets/net';


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
        return { 
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
        }
    },
    methods: {
        onJsonnetsEvent(event, payload) {
            if (event === EVENT_ADD_PLACE) {
                this.drawPlace(payload.id, payload.name);
            } else if (event === EVENT_ADD_TRANSITION) {
                this.drawTransition(payload.id, payload.name);
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
        onConnectModeStart() {
            this.paper.showTools()
        },
        onConnectModeEnd() {
            this.paper.hideTools()
        },
        onElementHoverStart(elementView) {
            if (this.uiState.mode === MODE_CONNECT_START) {
                elementView.showTools();
            }
        },
        onElementHoverEnd(elementView) {
            if (this.uiState.mode === MODE_CONNECT_START) {
                elementView.hideTools();
            }
        },
        drawPlace(id, name) {
            var place = new pn.Place({
                // TODO: actually calculate this position to center it
                position: { x: this.clickX -25, y: this.clickY -25 },
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
                    }
                },
                tokens: 3,
                id: id
            });
            place.addTo(this.graph);

            const connectButton = new joint.elementTools.Connect({
                x: "120%",
                //TODO: properly understand the logic of this positioning
                y: "66%",
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
            window.connectButton = connectButton;

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

            let elementView = place.findView(this.paper);
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
                id: id
            });
            transition.resize(100, 50);
            transition.addTo(this.graph);
            transition.myType = "transition";
        }
    },
    mounted() {
        this.paper = new joint.dia.Paper({
            el: document.getElementById('jointCanvas'),
            cellViewNamespace: { pn },
            model: this.graph,
            width: window.innerWidth,
            height: window.innerHeight,
            gridSize: 10,
            drawGrid: true,
            background: {
                color: '#f6f6f6'
            },
            defaultLink: () => new standard.Link(),
            defaultAnchor: { name: 'modelCenter' },
            defaultConnectionPoint: { name: 'boundary' },
            // todo: this probably does something with some css classes
            markAvailable: true,
            validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
                // Prevent Link to Link connections
                // console.log(cellViewS.myType)
                //console.log(magnetS.myType)
                // console.log(cellViewT.myType)
                // console.log(magnetT.myType)
                // console.log(end.myType)
                // console.log(linkView.myType)

                if (cellViewT.model.isLink() || cellViewS.model.isLink()) return false;

                // Prevent loop linking - This means the source and target cannot connect to the same magnet (e.g. port)
                // if (magnetS === magnetT) return false;


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
            // this.onElementHoverStart(elementView);
        });

        this.paper.on('element:mouseleave', (elementView) => {
            // this.onElementHoverEnd(elementView);
        })

        this.paper.on('link:connect', (linkView, evt, elementViewConnected, magnet, arrowhead) => {
            console.log('connected, yay')
            console.log(elementViewConnected.myType)

        })

        register(this.onJsonnetsEvent);

        this.uiState.$subscribe((mutation, state) => {
            if ((mutation.events.key === "mode")) {
                if (state.mode === MODE_CONNECT_START) {
                    this.onConnectModeStart();
                } else {
                    this.onConnectModeEnd();
                }
            }
        })
    }
};
</script>
<style scoped>
.add-mode {
    cursor: copy
}
</style>