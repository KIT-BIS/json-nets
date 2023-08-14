import { defineStore } from 'pinia'
import {
  MODE_NONE,
} from '@/App.vue'

export type ShowModal = 'none' | 'place' | 'preset' | 'postset' | 'transition' | 'test' | 'help'

export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: MODE_NONE as string,
      showModal: 'test' as ShowModal,
      showEditor: 'none' as string,

      lastSelectedID: '' as string,
    }
  },
  actions: {
    setMode(mode: string) {
      this.mode = mode
    },
    setModal(modal: ShowModal, selectedID = '') {
      this.showModal = modal;
      this.lastSelectedID = selectedID;
    },
  }
})
