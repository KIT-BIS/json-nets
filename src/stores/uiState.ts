import { defineStore } from 'pinia';
import {toRaw} from 'vue'
// @ts-ignore
import * as beautify from  'js-beautify';
// TODO: proper modularisation
// @ts-ignore
import { toggleDraggable, setPanable } from '@/components/canvas/net.js';
import { INSPECTOR_MODE_PRESET_ARC, INSPECTOR_MODE_TRANSITION, MODE_MOVE, MODE_NONE, MODE_PAN } from '@/App.vue';
// @ts-ignore
import {  findArc, findTransition } from '@/components/jsonnets/net.js';
// @ts-ignore
import { query } from '@/util/jsonPath.js';
// @ts-ignore
import { variablifyDocuments, evaluate } from '@/util/jsonnet.js';

export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: MODE_NONE as string | undefined,
      showInspector: false as  boolean,
      lastSelectedID: '' as string | undefined,
      inspectorContent: '' as string | undefined,
      itemName: '' as string | undefined,
      nameError: '' as string | undefined,
      validationError: '' as string | undefined,


      showPresetModal: false as boolean,
      arcMode: '' as string | undefined,
      inputTokens: '' as string | undefined,
      inspectorMode: '' as string | undefined,
      jsonPathQuery: '' as string | undefined,
      queryResult: '' as string | undefined,

      showTransitionModal: false as boolean,
      transitionInput: [] as Array<Object> | undefined,
      tempAssignment: {} as Object | undefined,
      selectedForAssignment: {} as Object | undefined,
      transitionInscriptionValid: false as boolean,
      inscriptionEvaluationResult: '' as string | undefined
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
    setShowTransitionModal(show: boolean) {
      this.showTransitionModal = show;
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
      } else if (mode === INSPECTOR_MODE_TRANSITION) {
        this.showTransitionModal = true;
        const transition = findTransition(this.lastSelectedID);
        const transitionInput = [];
        for (let i = 0; i < transition.preset.length; i++) {
          const name = transition.preset[i].place.name;
          const documents = transition.preset[i].applyFilter();
          transitionInput.push({name, documents});
        }
        this.transitionInput = transitionInput;
        this.tempAssignment = {};
        // Todo: give feedback specifically when not all variables are selected.
        // Todo: show jsonnet feedback when error occurs
        this.inscriptionEvaluationResult = "false";
        this.setInspectorContent(String(transition.content));
        this.setItemName(transition.name);

      } else {
        this.showInspector = true;
      }

    },
    addDocumentToTempAssignment(name: string, doc: object, index: number) {
      //@ts-ignore
      this.tempAssignment[name] = doc;
      //@ts-ignore
      this.selectedForAssignment[name] = index;
      this.updateTransitionEvaluation();
    },
    updateTransitionEvaluation() {
      let transitionEvaluation = false;
      // Todo: some duplicatoin from transition evaluation function
      let jsonnetString = variablifyDocuments(toRaw(this.tempAssignment));
      jsonnetString += this.inspectorContent;
      // Convert string to Boolean
      const evaluateDocuments = evaluate(jsonnetString);
      // Todo: give better evaluation feedback
      if (!evaluateDocuments.success) {
        // throw new Error(evaluateDocuments.data);
        transitionEvaluation = false;
      } else {
        const result = JSON.parse(evaluateDocuments.data);
        if (result !== true) {
          transitionEvaluation = false;
        } else {
          transitionEvaluation = true;
        }
      }

      this.inscriptionEvaluationResult = String(transitionEvaluation);
      this.transitionInscriptionValid = transitionEvaluation;
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


