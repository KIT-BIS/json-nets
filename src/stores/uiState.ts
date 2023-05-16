import { defineStore } from 'pinia'


export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: 'MODE_NONE' as string | undefined,
      // todo: probably not the smartest way, as these are actually constants
      MODE_NONE: 'MODE_NONE' as string,
      MODE_ADD_PLACE: 'MODE_ADD_PLACE' as string,
      MODE_ADD_TRANSITION: 'MODE_ADD_TRANSITION' as string,
      MODE_REMOVE: 'MODE_REMOVE' as string,
      MODE_MOVE: 'MODE_MOVE' as string,
      MODE_PAN: 'MODE_PAN' as string,
      MODE_CONNECT_START: 'MODE_CONNECT_START' as string,
      MODE_CONNECT_FROM_PLACE: 'MODE_CONNECT_FROM_PLACE' as string,
      MODE_CONNECT_FROM_TRANSITION: 'MODE_CONNECT_FROM_TRANSITION' as string,
      MODE_INSPECT: 'MODE_INSPECT' as string,
      MODE_OCCUR: 'MODE_OCCUR' as string,

      INSPECTOR_MODE_TRANSITION: 'INSPECTOR_MODE_TRANSITION' as string,
      INSPECTOR_MODE_PLACE: 'INSPECTOR_MODE_PLACE' as string,
      INSPECTOR_MODE_PRESET_ARC: 'INSPECTOR_MODE_PRESET_ARC' as string,
      INSPECTOR_MODE_POSTSET_ARC: 'INSPECTOR_MODE_POSTSET_ARC' as string
    }
  },
  actions: {
    setMode(mode: string | undefined) {
      if (mode === this.MODE_MOVE) {
        this.toggleDraggable(true);
      } else {
        this.toggleDraggable(false);
      }

      if (mode === this.MODE_PAN) {
        this.setPanable(true);
      } else {
        this.setPanable(false);
      }
      this.mode = mode;
      //update();
      this.mode = mode;
    },
    toggleDraggable(toggle: boolean) {
      //const elements = _layer.find('Group');
      //elements.each((e) => {
      //  e.draggable(toggle);
      //});
    },
    setPanable(toggle: boolean) {
      //_stage.draggable(toggle);
    }
  }
});


