import { defineStore } from 'pinia'
import {
  MODE_NONE,
} from '@/App.vue'
import { useIndicatorStore } from './indicator'

export type ShowModal = 'none' | 'place' | 'preset' | 'postset' | 'transition' | 'test' | 'help'

export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      databaseID: '' as String,
      mode: MODE_NONE as string,
      showModal: 'test' as ShowModal,
      showEditor: 'none' as string,
      showSupplyChainData: false as boolean,
      isScope3: true as boolean,

      lastSelectedID: '' as string,
    }
  },
  actions: {
    setMode(mode: string) {
      useIndicatorStore().reset();
      this.mode = mode
    },
    setModal(modal: ShowModal, selectedID = '') {
      this.showModal = modal;
      this.lastSelectedID = selectedID;
    },
  }
})
