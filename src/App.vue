<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue';
import Inspector from './components/Inspector.vue';
import InboundArcModal from './components/InboundArcModal.vue';
import OutboundArcModal from './components/OutboundArcModal.vue';
//@ts-ignore
import TransitionModal from './components/TransitionModal.vue';
import ModeButton from './components/ModeButton.vue';
import { useUiStateStore } from '@/stores/uiState';
// TODO: proper typescript modularisation
// @ts-ignore
import { addPlaceToExportArray, addTransitionToExportArray } from '@/util/exportNet';
// TODO: proper typescript modularisation
// @ts-ignore
import {importNet, uploadNet} from '@/util/importNet';
// @ts-ignore
import {exportNet} from '@/util/exportNet';
// TODO: proper typescript modularisation
// @ts-ignore
import { addPlace, addTransition } from '@/components/jsonnets/net.js'
// TODO: proper typescript modularisation
// @ts-ignore
import { init as initCanvas, getStagePosition, setClickPosition } from '@/components/canvas/net.js'

// I like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore();
onMounted(() => {
  initCanvas();
})

function onCanvasClick(event: MouseEvent) {
  if (uiState.mode === MODE_ADD_PLACE) {
    const stagePosition = getStagePosition();
    const x = event.clientX - stagePosition.x;
    const y = event.clientY - stagePosition.y;
    setClickPosition(x, y);
    const place = addPlace();
    addPlaceToExportArray(x, y, place.id, place.name, place.content);
  } else if (uiState.mode === MODE_ADD_TRANSITION) {
    const stagePosition = getStagePosition();
    const x = event.clientX - stagePosition.x;
    const y = event.clientY - stagePosition.y;
    setClickPosition(x, y);
    const transition = addTransition();
    addTransitionToExportArray(x, y, transition.id, transition.name,
      transition.content);
  }
}
</script>
<script lang="ts">
export const MODE_NONE = 'MODE_NONE';
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE';
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION';
export const MODE_REMOVE = 'MODE_REMOVE';
export const MODE_MOVE = 'MODE_MOVE';
export const MODE_PAN = 'MODE_PAN';
export const MODE_CONNECT_START = 'MODE_CONNECT_START';
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE';
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION';
export const MODE_INSPECT = 'MODE_INSPECT';
export const MODE_OCCUR = 'MODE_OCCUR';
export const MODE_UPLOAD = 'MODE_UPLOAD';
export const MODE_EXAMPLE = 'MODE_EXAMPLE';

export const INSPECTOR_MODE_TRANSITION = 'INSPECTOR_MODE_TRANSITION';
export const INSPECTOR_MODE_PLACE = 'INSPECTOR_MODE_PLACE';
export const INSPECTOR_MODE_PRESET_ARC = 'INSPECTOR_MODE_PRESET_ARC';
export const INSPECTOR_MODE_POSTSET_ARC = 'INSPECTOR_MODE_POSTSET_ARC';
</script>

<template>
  <div id="container" @click="onCanvasClick"></div>
  <div id="menu">
    <ModeButton icon="fas fa-circle" :mode="MODE_ADD_PLACE" />
    <ModeButton icon="fas fa-square" :mode="MODE_ADD_TRANSITION" />
    <ModeButton icon="fas fa-arrow-right" :mode="MODE_CONNECT_START" />
    <ModeButton icon="fas fa-trash" :mode="MODE_REMOVE" />
    <ModeButton icon="fas fa-mouse-pointer" :mode="MODE_MOVE" />
    <ModeButton icon="fas fa-expand-arrows-alt" :mode="MODE_PAN" />
    <ModeButton icon="fas fa-edit" :mode="MODE_INSPECT" />
    <ModeButton icon="fas fa-play-circle" :mode="MODE_OCCUR" />
    <ModeButton icon="fas fa-file-arrow-down" :mode="MODE_UPLOAD" :callback="exportNet"/>
    <input class="button is-primary is-outlined" style="margin-left: 15px" type="file" name="resume" @change="(event) =>{
    uploadNet(event);
    }">
    <button style="margin-left: 15px" @click.stop="() => {uiState.setMode(MODE_EXAMPLE); importNet(false);}" class="button is-primary is-outlined">
      Load Example
    </button>
  </div>
  <Inspector />
  <InboundArcModal v-if="uiState.showPresetModal"/>
  <OutboundArcModal v-if="uiState.showPostsetModal" />
  <TransitionModal v-if="uiState.showTransitionModal" />
  <!-- <RouterView /> -->
</template>