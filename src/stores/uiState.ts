import { defineStore } from 'pinia';
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
      // todo: probably not the smartest way, as these are actually constants
//      MODE_NONE: 'MODE_NONE' as string,
//      MODE_ADD_PLACE: 'MODE_ADD_PLACE' as string,
//      MODE_ADD_TRANSITION: 'MODE_ADD_TRANSITION' as string,
//      MODE_REMOVE: 'MODE_REMOVE' as string,
//      MODE_MOVE: 'MODE_MOVE' as string,
//      MODE_PAN: 'MODE_PAN' as string,
//      MODE_CONNECT_START: 'MODE_CONNECT_START' as string,
//      MODE_CONNECT_FROM_PLACE: 'MODE_CONNECT_FROM_PLACE' as string,
//      MODE_CONNECT_FROM_TRANSITION: 'MODE_CONNECT_FROM_TRANSITION' as string,
//      MODE_INSPECT: 'MODE_INSPECT' as string,
//      MODE_OCCUR: 'MODE_OCCUR' as string,
//
//      INSPECTOR_MODE_TRANSITION: 'INSPECTOR_MODE_TRANSITION' as string,
//      INSPECTOR_MODE_PLACE: 'INSPECTOR_MODE_PLACE' as string,
//      INSPECTOR_MODE_PRESET_ARC: 'INSPECTOR_MODE_PRESET_ARC' as string,
//      INSPECTOR_MODE_POSTSET_ARC: 'INSPECTOR_MODE_POSTSET_ARC' as string
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
      this.inspectorContent = content;
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


