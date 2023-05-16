<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue';
import type Inspector from './components/Inspector.vue';
import ModeButton from './components/ModeButton.vue';
import { useUiStateStore } from '@/stores/uiState';
// TODO: proper typescript modularisation
// @ts-ignore
import { addPlace } from '@/components/jsonnets/net.js'
// TODO: proper typescript modularisation
// @ts-ignore
import { init as initCanvas, getStagePosition, setClickPosition } from '@/components/canvas/net.js'
//export default {
//  setup() {
// I actually like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore();
//    return { uiState } 
//  },
//  methods: {
//    setMode() {
//
//    }
//  }
//}
onMounted(() => {
  //TODO: some of this stuff can probably happen earlier
  initCanvas();
  //_editor = monaco.editor.create(document.getElementById('editor'), {
  //  // value: '',
  //  language: 'json',
  //  roundedSelection: true,
  //  autoIndent: true,
  //  automaticLayout: true,
  //  theme: 'vs-dark',
  //  features: {
  //    toggleTabFocusMode: true,
  //    linesOperations: false,
  //  },
  //  minimap: {
  //    enabled: false,
  //  },

  //});
  // NOTE: double out-commented probably not needed, was like this in pre-vue version
  //// setTimeout(function() {
  ////   _editor.updateOptions({
  ////     lineNumbers: 'on',
  ////   });
  ////   _editor.getAction('editor.action.formatDocument').run();
  //// }, 2000);
  //_initalized = true;
  //registerJsonnet();
})

function onCanvasClick(event: MouseEvent) {
  console.log(event);
  if (uiState.mode === uiState.MODE_ADD_PLACE) {
    const stagePosition = getStagePosition();
    const x = event.clientX - stagePosition.x;
    const y = event.clientY - stagePosition.y;
    setClickPosition(x, y);
    const place = addPlace();
    addPlaceToExportArray(x, y, place.id, place.name, place.content);
  } else if (uiState.mode === uiState.MODE_ADD_TRANSITION) {
    //const stagePosition = getStagePosition();
    //const x = event.clientX - stagePosition.x;
    //const y = event.clientY - stagePosition.y;
    //setClickPosition(x, y);
    //const transition = addTransition();
    //addTransitionToExportArray(x, y, transition.id, transition.name,
    //  transition.content);
  }
}
</script>

<template>
  <div id="container" @click="onCanvasClick"></div>
  <div id="menu">
    <ModeButton icon="fas fa-circle" :mode="uiState.MODE_ADD_PLACE" />
    <ModeButton icon="fas fa-square" :mode="uiState.MODE_ADD_TRANSITION" />
    <ModeButton icon="fas fa-arrow-right" :mode="uiState.MODE_CONNECT_START" />
    <!--TODO: FROM_PLACE and FROM_TRANSITION also outlined-->
    <ModeButton icon="fas fa-trash" :mode="uiState.MODE_REMOVE" />
    <ModeButton icon="fas fa-mouse-pointer" :mode="uiState.MODE_MOVE" />
    <ModeButton icon="fas fa-expand-arrows-alt" :mode="uiState.MODE_PAN" />
    <ModeButton icon="fas fa-edit" :mode="uiState.MODE_INSPECT" />
    <ModeButton icon="fas fa-play-circle" :mode="uiState.MODE_OCCUR" />
    <ModeButton icon="fas fa-file-arrow-down" :mode="uiState.MODE_NONE" /><!--TODO exportNet(); -->
    <!--
    <input class="button is-primary is-outlined" type="file" name="resume" @change=${ (event) =>{
    uploadNet(event);
    }}>
    <button @click=${ (event) => {
      importNet();
      event.stopPropagation();
      }} class="button is-primary is-outlined">
      Load Example
    </button>
-->
  </div>
  <Inspector />
  <!-- <RouterView /> -->
</template>