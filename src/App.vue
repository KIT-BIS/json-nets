<script setup lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { useNetStore } from './stores/net'

import { download, readFile } from '@/util/files'

import JointPaper from './components/JointPaper/JointPaper.vue'
import HelpModal from './components/HelpModal.vue'
import PlaceModal from './components/PlaceModal/PlaceModal.vue'
import TransitionModal from './components/TransitionModal/TransitionModal.vue'
import ExamplesModal from './components/ExamplesModal.vue'
import ExpressionEditor from './components/TransitionModal/ExpressionEditor.vue'
import SettingsModal from './components/SettingsModal.vue'

import ModeButton from './components/_shared/ModeButton.vue'
import { useIndicatorStore } from './stores/indicator'
import { useConfigStore, type ConfigData } from './stores/config'

// import config from './configs/test-config.json';
// I like the syntax with export and setup() better,
// but for some reason the code only compiles with script setup here
const uiState = useUiStateStore();
const configState = useConfigStore();

// configState.loadConfig(config as ConfigData);

function exportNet() {
	return useNetStore().export();
}

function importNet(jsonString: string) {
	let json;
	// Todo: this was used to import examples, no longer needed
	if (jsonString === '1') {
	} else {
		json = JSON.parse(jsonString);
	}
	useNetStore().import(json)
}

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
export const MODE_PLAY = 'MODE_PLAY'
export const MODE_HELP = 'MODE_HELP'

</script>

<template>
	<JointPaper />
	<div id="menu">
		<ModeButton icon="fas fa-circle" :mode="MODE_ADD_PLACE" />
		<ModeButton icon="fas fa-square" :mode="MODE_ADD_TRANSITION" />
		<ModeButton icon="fas fa-arrow-right" :mode="MODE_CONNECT_START" />
		<ModeButton v-if="configState.allowAutoLayout" icon="fas fa-wand-magic-sparkles" :mode="MODE_LAYOUT" />
		<ModeButton icon="fas fa-mouse-pointer" :mode="MODE_MOVE" />
		<ModeButton icon="fas fa-play-circle" :mode="MODE_PLAY" />
		<ModeButton icon="fas fa-file-arrow-down" :mode="MODE_EXPORT" :callback="() => {
			download(exportNet(), 'export.json', 'application/json')
		}
			" />
		<input class="button is-primary is-outlined" style="margin-left: 15px" type="file" name="netfile" @change="(event) => {
			readFile(event, importNet)
		}
			" />
		<button v-if="configState.examples && configState.examples.length > 0" style="margin-left: 15px" @click.stop="() => {
				uiState.setModal('examples');
			}
			" class="button is-primary is-outlined">
			Examples
		</button>

		<ModeButton icon="fas fa-question" :mode="MODE_HELP" :callback="() => {
			uiState.showModal = 'help'
		}
			" />
	</div>
	<TransitionModal v-if="uiState.showModal === 'transition'" />
	<PlaceModal v-if="uiState.showModal === 'place'" />
	<ExpressionEditor v-if="uiState.showEditor !== 'none'" />
	<HelpModal v-if="uiState.showModal === 'help'" />
	<ExamplesModal v-if="uiState.showModal === 'examples'" />
	<SettingsModal v-if="uiState.showModal === 'settings'" />
	<RouterView />
	<div style="position: absolute; bottom: 5px; right: 5px">
		<a @click="useNetStore().resetModel()">Reset Model</a>
	</div>
	<div style="position: absolute; bottom: 5px; left: 5px">
		<a @click="() => { uiState.showModal = 'settings' }">Settings</a>
	</div>

</template>