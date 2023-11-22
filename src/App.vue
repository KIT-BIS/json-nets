<script setup lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { useNetStore } from './stores/net'

//import { data as example } from '@/examples/production'
import { data as example1 } from '@/examples/project1'
import { data as example2 } from '@/examples/project2'
import { data as example3 } from '@/examples/project3'
import { download, readFile } from '@/util/files'

import JointPaper from './components/JointPaper/JointPaper.vue'
import HelpModal from './components/HelpModal.vue'
import PlaceModal from './components/PlaceModal/PlaceModal.vue'
import TransitionModal from './components/TransitionModal/TransitionModal.vue'
import ExpressionEditor from './components/TransitionModal/ExpressionEditor.vue'

import ModeButton from './components/_shared/ModeButton.vue'
import { useIndicatorStore } from './stores/indicator'

// I like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore();
const indicatorState = useIndicatorStore();

function exportNet() {
  return useNetStore().export();
}

function importNet(jsonString: string) {
  let json;
  if (jsonString === 'example1') {
    json = JSON.parse(JSON.stringify(example1))
  } else if (jsonString === 'example2') {
    json = JSON.parse(JSON.stringify(example2))
  } else if (jsonString === 'example3') {
    json = JSON.parse(JSON.stringify(example3))
  } else {
    json = JSON.parse(jsonString);
  }
  useNetStore().import(json)
}

//TODO: should be in some general config store
const isScope3 = true;
</script>
<script lang="ts">
export const MODE_NONE = 'MODE_NONE'
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE'
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION'
export const MODE_MOVE = 'MODE_MOVE'
export const MODE_CONNECT_START = 'MODE_CONNECT_START'
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE'
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION'
export const MODE_LAYOUT = 'MODE_LAYOUT'
export const MODE_UPLOAD = 'MODE_UPLOAD'
export const MODE_EXPORT = 'MODE_EXPORT'
export const MODE_EXAMPLE = 'MODE_EXAMPLE'
export const MODE_PLAY = 'MODE_PLAY'
export const MODE_HELP = 'MODE_HELP'
export const MODE_INDICATOR = 'MODE_INDICATOR'

</script>

<template>
  <JointPaper />
  <div id="menu">
    <ModeButton icon="fas fa-circle" :mode="MODE_ADD_PLACE" />
    <ModeButton icon="fas fa-square" :mode="MODE_ADD_TRANSITION" />
    <ModeButton icon="fas fa-arrow-right" :mode="MODE_CONNECT_START" />
    <ModeButton icon="fas fa-wand-magic-sparkles" :mode="MODE_LAYOUT" />
    <ModeButton icon="fas fa-mouse-pointer" :mode="MODE_MOVE" />
    <ModeButton v-if="isScope3" icon="fas fa-chart-simple" :mode="MODE_INDICATOR" />
    <ModeButton icon="fas fa-play-circle" :mode="MODE_PLAY" />
    <ModeButton
      icon="fas fa-file-arrow-down"
      :mode="MODE_EXPORT"
      :callback="
        () => {
          download(exportNet(), 'export.json', 'application/json')
        }
      "
    />
    <input
      class="button is-primary is-outlined"
      style="margin-left: 15px"
      type="file"
      name="netfile"
      @change="
        (event) => {
          readFile(event, importNet)
        }
      "
    />
    <!-- <button
      style="margin-left: 15px"
      @click.stop="
        () => {
          uiState.setMode(MODE_EXAMPLE)
          importNet('example1')
        }
      "
      class="button is-primary is-outlined"
    >
      Ex1
    </button>
    <button
      style="margin-left: 15px"
      @click.stop="
        () => {
          uiState.setMode(MODE_EXAMPLE)
          importNet('example2')
        }
      "
      class="button is-primary is-outlined"
    >
      Ex2
    </button>
    <button
      style="margin-left: 15px"
      @click.stop="
        () => {
          uiState.setMode(MODE_EXAMPLE)
          importNet('example3')
        }
      "
      class="button is-primary is-outlined"
    >
      Ex3
    </button> -->


    <ModeButton
      icon="fas fa-question"
      :mode="MODE_HELP"
      :callback="
        () => {
          uiState.showModal = 'help' 
        }
      "
    />
  </div>
  <div v-if="uiState.mode === MODE_INDICATOR" id="indicator-panel" class="has-text-centered p-5" style="border: dashed grey;">
    <div v-if="indicatorState.selectedPlaceID !== 'none'">    
      <p class="title is-3">{{ indicatorState.indicatorValue }} kgCO2eq</p>
      <p class="subtitle is-5">{{ indicatorState.placeName }}</p>
    </div>
    <div v-else>
      <span>Select place to show indicator value.</span>
    </div>

  </div>
  <TransitionModal v-if="uiState.showModal === 'transition'"/>
  <PlaceModal v-if="uiState.showModal === 'place'" />
  <ExpressionEditor v-if="uiState.showEditor !== 'none'"/>
  <HelpModal v-if="uiState.showModal === 'help'" />
  <!-- <Scope3Modal v-if="uiState.showScope3Data" /> -->
  <!-- <RouterView /> -->
</template>