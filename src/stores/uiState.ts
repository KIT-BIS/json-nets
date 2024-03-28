import { defineStore } from 'pinia'
import {
  MODE_NONE,
} from '@/App.vue'

export type ShowModal = 'none' | 'place' | 'preset' | 'postset' | 'transition' | 'examples' | 'help' | 'settings'

/**
 * Handles general state of user interface.
 */
export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      uiAssistMode: 'expert' as 'assisted' | 'expert',
      mode: MODE_NONE as string,
      showModal: 'none' as ShowModal,
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
