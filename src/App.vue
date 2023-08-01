<script setup lang="ts">
import example from '@/examples/recognition/net'
import InboundArcModal from './components/InboundArcModal/InboundArcModal.vue'
import ArcModal from './components/InboundArcModal/ArcModal.vue'
import HelpModal from './components/HelpModal.vue'
import OutboundArcModal from './components/OutboundArcModal/OutboundArcModal.vue'
import TransitionModal from './components/TransitionModal/TransitionModal.vue'
import NewTransitionModal from './components/TransitionModal/NewTransitionModal.vue'
import PlaceModal from './components/PlaceModal/PlaceModal.vue'
import ModeButton from './components/_shared/ModeButton.vue'
import { useUiStateStore } from '@/stores/uiState'
import { download, readFile } from '@/util/files'
import JointPaper from './components/JointPaper/JointPaper.vue'
// import { exportNet, importNet } from '@/jsonnets/net'
import { Net } from './json-nets/Net'

// I like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore()

// TODO having the net as reactive property may cause performance issues?
const net = new Net();
uiState.setNet(net);

function exportNet() {
  const netData = net.export();
  const layoutData = uiState.exportLayout();
  return JSON.stringify({netData, layoutData}, null, 2);
}

function importNet(jsonString: string) {
  // console.log(jsonString);
  console.log(jsonString);
  const json = JSON.parse(jsonString);
  console.log(json)
  net.import(json.netData, json.layoutData)
  // uiState.importLayout(json.layoutData);
}
</script>
<script lang="ts">
export const MODE_NONE = 'MODE_NONE'
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE'
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION'
// export const MODE_REMOVE = 'MODE_REMOVE'
export const MODE_MOVE = 'MODE_MOVE'
// export const MODE_PAN = 'MODE_PAN'
export const MODE_CONNECT_START = 'MODE_CONNECT_START'
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE'
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION'
// export const MODE_INSPECT = 'MODE_INSPECT'
export const MODE_LAYOUT = 'MODE_LAYOUT'
// export const MODE_OCCUR = 'MODE_OCCUR'
export const MODE_UPLOAD = 'MODE_UPLOAD'
export const MODE_EXAMPLE = 'MODE_EXAMPLE'
export const MODE_PLAY = 'MODE_PLAY'
export const MODE_HELP = 'MODE_HELP'

// export const INSPECTOR_MODE_TRANSITION = 'INSPECTOR_MODE_TRANSITION'
// export const INSPECTOR_MODE_PLACE = 'INSPECTOR_MODE_PLACE'
// export const INSPECTOR_MODE_PRESET_ARC = 'INSPECTOR_MODE_PRESET_ARC'
// export const INSPECTOR_MODE_POSTSET_ARC = 'INSPECTOR_MODE_POSTSET_ARC'
</script>

<template>
  <JointPaper :net="net"/>
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
          // readFile(event, importNet)
        }
      "
    />
    <button
      style="margin-left: 15px"
      @click.stop="
        () => {
          uiState.setMode(MODE_EXAMPLE)
          // importNet('example', example)
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
  <!-- <InboundArcModal v-if="uiState.showPresetModal" /> -->
  <!-- <OutboundArcModal v-if="uiState.showPostsetModal" /> -->
  <!-- <TransitionModal v-if="uiState.showTransitionModal" /> -->
  <ArcModal v-if="uiState.showModal === 'preset' || uiState.showModal === 'postset'" :net="net"/>
  <PlaceModal v-if="uiState.showModal === 'place'" :net="net"/>
  <NewTransitionModal v-if="uiState.showModal === 'transition'" :net="net"/>
  <!-- <TestModal v-if="uiState.showModal === 'test'" /> -->
  <!-- <HelpModal v-if="uiState.showHelpModal" /> -->
  <!-- <RouterView /> -->
</template>