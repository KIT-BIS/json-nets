<script setup lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Configurator from './configs/Configurator.vue'
import NetEditor from './components/NetEditor.vue'




const uiState = useUiStateStore();
const router = useRouter();

function setShowView() {
  if (router.currentRoute.value.path === '/configurator') {
    uiState.setView('configurator');
  } else {
    uiState.setView('mainEditor');
  }
};

onMounted(setShowView);
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
	<RouterView></RouterView>
  <!-- <div v-if="uiState.showView === 'mainEditor'">
    <NetEditor />
  </div>
  <div v-if="uiState.showView === 'configurator'">
    <Configurator />
  </div> -->
</template>


