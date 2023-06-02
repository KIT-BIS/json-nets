import { defineStore } from 'pinia';
// @ts-ignore
import * as beautify from  'js-beautify';
// TODO: proper modularisation
// @ts-ignore
import { toggleDraggable, setPanable } from '@/components/canvas/net.js';
import { INSPECTOR_MODE_PRESET_ARC, MODE_MOVE, MODE_NONE, MODE_PAN } from '@/App.vue';
// @ts-ignore
import {  findArc } from '@/components/jsonnets/net.js';
// @ts-ignore
import { query } from '@/util/jsonPath.js';

export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: MODE_NONE as string | undefined,
      showInspector: false as  boolean,
      showPresetModal: false as boolean,
      arcMode: '' as string | undefined,
      inputTokens: '' as string | undefined,
      inspectorMode: '' as string | undefined,
      jsonPathQuery: '' as string | undefined,
      queryResult: '' as string | undefined,
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
    setShowPresetModal(show: boolean) {
      this.showPresetModal = show;
    },
    updateInspector(mode: string, id: string) {
      this.inspectorMode = mode;
      this.lastSelectedID = id;
      if (mode === INSPECTOR_MODE_PRESET_ARC) {
        const arc = findArc(this.lastSelectedID);
        const place = arc.place;
        this.jsonPathQuery = arc.label.filter;
        this.inputTokens = JSON.stringify(place.content.data, null, 2);
        //@ts-ignore
        this.queryResult = JSON.stringify(query(JSON.parse(this.inputTokens),this.jsonPathQuery), null, 2);
       //   JSONPath({
        //@ts-ignore
        //  path: this.jsonPathQuery,
        //  json: JSON.parse(this.inputTokens)
        //})

        this.showPresetModal = true;
        this.arcMode = arc.label.type;
      } else {
        this.showInspector = true;
      }

    },
    setJsonPathQuery(query: string) {
      this.jsonPathQuery = query;
    },
    setQueryResult(result: string) {
      this.queryResult = result;
    },
    updateQueryResult() {
        //@ts-ignore
        this.queryResult = JSON.stringify(query(JSON.parse(this.inputTokens), this.jsonPathQuery), null, 2);

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


