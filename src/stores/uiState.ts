import { defineStore } from 'pinia'
import {
  MODE_NONE,
} from '@/App.vue'
// import { useIndicatorStore } from './indicator'

export type ShowModal = 'none' | 'place' | 'preset' | 'postset' | 'transition' | 'examples' | 'help' | 'settings'

export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      uiAssistMode: 'expert' as 'assisted' | 'expert',
      mode: MODE_NONE as string,
      showModal: 'none' as ShowModal,
      showEditor: 'none' as string,
      // showSupplyChainData: false as boolean,
      // isScope3: true as boolean,
      // databaseID: '' as string,

      lastSelectedID: '' as string,
    }
  },
  actions: {
    setMode(mode: string) {
      // useIndicatorStore().reset();
      this.mode = mode
    },
    setModal(modal: ShowModal, selectedID = '') {
      this.showModal = modal;
      this.lastSelectedID = selectedID;
    },
  }
})
