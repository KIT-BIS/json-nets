<script setup lang="ts">
//@ts-ignore
import example from '@/examples/recognition/net.js'
import InboundArcModal from './components/InboundArcModal.vue'
import HelpModal from './components/HelpModal.vue'
//@ts-ignore
import OutboundArcModal from './components/OutboundArcModal/OutboundArcModal.vue'
//@ts-ignore
import TransitionModal from './components/TransitionModal.vue'
import PlaceModal from './components/PlaceModal.vue'
import ModeButton from './components/ModeButton.vue'
import { useUiStateStore } from '@/stores/uiState'
// @ts-ignore
import { download, readFile } from '@/util/files'
import JointPaper from './components/JointPaper/JointPaper.vue'
// @ts-ignore
import { exportNet, importNet } from '@/components/jsonnets/net.js'

// I like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore()
</script>
<script lang="ts">
export const MODE_NONE = 'MODE_NONE'
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE'
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION'
export const MODE_REMOVE = 'MODE_REMOVE'
export const MODE_MOVE = 'MODE_MOVE'
export const MODE_PAN = 'MODE_PAN'
export const MODE_CONNECT_START = 'MODE_CONNECT_START'
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE'
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION'
export const MODE_INSPECT = 'MODE_INSPECT'
export const MODE_LAYOUT = 'MODE_LAYOUT'
export const MODE_OCCUR = 'MODE_OCCUR'
export const MODE_UPLOAD = 'MODE_UPLOAD'
export const MODE_EXAMPLE = 'MODE_EXAMPLE'
export const MODE_PLAY = 'MODE_PLAY'
export const MODE_HELP = 'MODE_HELP'

export const INSPECTOR_MODE_TRANSITION = 'INSPECTOR_MODE_TRANSITION'
export const INSPECTOR_MODE_PLACE = 'INSPECTOR_MODE_PLACE'
export const INSPECTOR_MODE_PRESET_ARC = 'INSPECTOR_MODE_PRESET_ARC'
export const INSPECTOR_MODE_POSTSET_ARC = 'INSPECTOR_MODE_POSTSET_ARC'
</script>

<template>
  <JointPaper />
  <div id="menu">
    <ModeButton icon="fas fa-circle" :mode="MODE_ADD_PLACE" />
    <ModeButton icon="fas fa-square" :mode="MODE_ADD_TRANSITION" />
    <ModeButton icon="fas fa-arrow-right" :mode="MODE_CONNECT_START" />
    <ModeButton icon="fas fa-wand-magic-sparkles" :mode="MODE_LAYOUT" />
    <ModeButton icon="fas fa-mouse-pointer" :mode="MODE_MOVE" />
    <ModeButton icon="fas fa-play-circle" :mode="MODE_PLAY" />
    <ModeButton
      icon="fas fa-file-arrow-down"
      :mode="MODE_UPLOAD"
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
      name="resume"
      @change="
        (event) => {
          readFile(event, importNet)
        }
      "
    />
    <button
      style="margin-left: 15px"
      @click.stop="
        () => {
          uiState.setMode(MODE_EXAMPLE)
          importNet('example', example)
        }
      "
      class="button is-primary is-outlined"
    >
      Load Example
    </button>
    <ModeButton
      icon="fas fa-question"
      :mode="MODE_HELP"
      :callback="
        () => {
          uiState.showHelpModal = true
        }
      "
    />
  </div>
  <InboundArcModal v-if="uiState.showPresetModal" />
  <OutboundArcModal v-if="uiState.showPostsetModal" />
  <TransitionModal v-if="uiState.showTransitionModal" />
  <PlaceModal v-if="uiState.showPlaceModal" />
  <HelpModal v-if="uiState.showHelpModal" />
  <!-- <RouterView /> -->
</template>
