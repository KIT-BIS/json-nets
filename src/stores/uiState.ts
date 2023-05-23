import { defineStore } from 'pinia';
// @ts-ignore
import * as beautify from  'js-beautify';
// TODO: proper modularisation
// @ts-ignore
import { toggleDraggable, setPanable } from '@/components/canvas/net.js';
import { MODE_MOVE, MODE_NONE, MODE_PAN } from '@/App.vue';


export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: MODE_NONE as string | undefined,
      showInspector: false as  boolean,
      inspectorMode: '' as string | undefined,
      lastSelectedID: '' as string | undefined,
      inspectorContent: '' as string | undefined,
      itemName: '' as string | undefined,
      nameError: '' as string | undefined,
      validationError: '' as string | undefined
    }
  },
  actions: {
    setMode(mode: string | undefined) {
      if (mode === MODE_MOVE) {
        toggleDraggable(true);
      } else {
        toggleDraggable(false);
      }

      if (mode === MODE_PAN) {
        setPanable(true);
      } else {
        setPanable(false);
      }
      this.mode = mode;
    },
    setShowInspector(show: boolean) {
      this.showInspector = show;
    },
    updateInspector(mode: string, id: string) {
      this.inspectorMode = mode;
      this.lastSelectedID = id;
      this.showInspector = true;

    },
    setInspectorContent(content: string) {
      this.inspectorContent = beautify.js_beautify(content);
    },
    setItemName(name: string) {
      this.itemName = name;
    },
    setNameError(error: string) {
      this.nameError = error;
    },
    setValidationError(error: string) {
      this.validationError = error;
    }
  }
});


