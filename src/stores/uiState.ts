import { defineStore } from 'pinia';
import {mock} from 'mock-json-schema';
import {toRaw} from 'vue'
// @ts-ignore
import * as beautify from  'js-beautify';
// TODO: proper modularisation
// @ts-ignore
import { toggleDraggable, setPanable } from '@/components/canvas/net.js';
import { INSPECTOR_MODE_PLACE, INSPECTOR_MODE_POSTSET_ARC, INSPECTOR_MODE_PRESET_ARC, INSPECTOR_MODE_TRANSITION, MODE_MOVE, MODE_NONE, MODE_PAN } from '@/App.vue';
// @ts-ignore
import {  findArc, findTransition, findPlace } from '@/components/jsonnets/net.js';
// @ts-ignore
import { query } from '@/util/jsonPath.js';
// @ts-ignore
import { variablifyDocuments, evaluate } from '@/util/jsonnet.js';
// @ts-ignore
import {validate} from '@/util/validator.js';
// @ts-ignore
import {transferSchemaToJsonFormsData, transferJsonFormsDataToSchema} from '@/util/jsonForms.js';
import { threadId } from 'worker_threads';

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
      inputTokensArray: [] as Array<Object> | undefined,
      tempAssignment: {} as Object | undefined,
      selectedForAssignment: {} as Object | undefined,
      transitionInscriptionValid: false as boolean,
      inscriptionEvaluationResult: '' as string | undefined,

      showPostsetModal: false as boolean,
      outboundEvaluation: false as boolean,
      outboundEvaluationResult: '' as string | undefined,
      outboundSchemaEvaluation: false as boolean,
      outboundSchemaEvaluationResult: '' as string | undefined,

      showPlaceModal: false as boolean,
      // originalSchema: '' as string | undefined,
      formsData: {},
      formsDataString: '' as string | undefined,
      // formsDataFromOriginal: '' as string | undefined,
      generatedSchemaString: '' as string | undefined,
      placeTokens: [] as Array<Object> | undefined,
      tokenString: '' as string | undefined,
      placeTokenValidation: false as boolean,
      placeTokenValidationResult: '' as string | undefined,
      selectedIndex: -1
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
        console.log("showing preset ar c modal")
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
      } else if (mode === INSPECTOR_MODE_POSTSET_ARC) {
        console.log("showing postset modal")
        this.showPostsetModal = true;
        const arc = findArc(this.lastSelectedID);
        const inputTokens = [];
        const transition = arc.transition;
        for (let i = 0; i < transition.preset.length; i++) {
          const name = transition.preset[i].place.name;
          const documents = transition.preset[i].applyFilter();
          inputTokens.push({name, documents});
        }
        this.inputTokensArray = inputTokens;
        this.tempAssignment = {};
        this.selectedForAssignment = {};
        this.inscriptionEvaluationResult = "false";
        this.setInspectorContent(String(arc.label));


      } else if (mode === INSPECTOR_MODE_TRANSITION) {
        this.showTransitionModal = true;
        const transition = findTransition(this.lastSelectedID);
        const inputTokens = [];
        for (let i = 0; i < transition.preset.length; i++) {
          const name = transition.preset[i].place.name;
          const documents = transition.preset[i].applyFilter();
          inputTokens.push({name, documents});
        }
        this.inputTokensArray = inputTokens;
        this.tempAssignment = {};
        this.selectedForAssignment = {};
        // Todo: give feedback specifically when not all variables are selected.
        // Todo: show jsonnet feedback when error occurs
        this.inscriptionEvaluationResult = "false";
        this.setInspectorContent(String(transition.content));
        this.setItemName(transition.name);

      } else if (mode === INSPECTOR_MODE_PLACE) {

        const place = findPlace(this.lastSelectedID);
        this.showPlaceModal = true;
        this.setItemName(place.name)
        // this.json = JSON.stringify(place.content.schema, null,2);
        this.formsData = transferSchemaToJsonFormsData(JSON.stringify(place.content.schema));
        this.formsDataString = JSON.stringify(this.formsData, null, 2);
        // this.formsDataFromOriginal = JSON.stringify(this.formsData, null, 2);
        this.placeTokens = place.content.data;
        this.tokenString = '';
        this.selectedIndex = -1;
        this.updateJsonSchema();
        this.validateTokens();

      } else {
        this.showInspector = true;
      }

    },
    updateJsonSchema() {
      this.generatedSchemaString = JSON.stringify(transferJsonFormsDataToSchema(this.formsDataString), null, 2)
      this.validateTokens();
    },
    selectToken(index) {
      this.selectedIndex = index;
      this.tokenString = JSON.stringify(this.placeTokens[index], null, 2);
    },
    addToken() {
      let newDoc = mock(JSON.parse(this.generatedSchemaString))
      this.placeTokens.push(newDoc);
      this.validateTokens();
    },
    deleteToken(index) {
      this.placeTokens.splice(index,1);
      this.selectedIndex = -1;
      this.tokenString = '';
    },
    validateTokens() {
      const docErrors = [];
      let allValid = true;
      console.log("valdating tokens")
      console.log(this.placeTokens);
      console.log(this.generatedSchemaString);
      this.placeTokens.forEach((doc, index) => {
        const {isValid, errors} = validate(doc, JSON.parse(this.generatedSchemaString));
        if (!isValid) {
          console.log('Invalid document:');
          console.log(errors);
          errors[0].errorIndex =  index;
          docErrors.push(errors);
          allValid = false;
        }
      });

      if (!allValid) {
        this.placeTokenValidation = false;
        this.placeTokenValidationResult = "<ul>"
        for (let i = 0; i < docErrors.length; i++) {
          let error = docErrors[i][0];
          this.placeTokenValidationResult += "<li>"
          this.placeTokenValidationResult += "Token " + error.errorIndex + ": " + error.dataPath + " " + error.message;
          this.placeTokenValidationResult += "</li>"
        }
        this.placeTokenValidationResult += "</ul>";

      } else {
        this.placeTokenValidation = true;
        this.placeTokenValidationResult = "All tokens valid to schema.";
      }
    },
    updateCurrentToken() {
      try {
        let newDoc = JSON.parse(this.tokenString);
        if (newDoc) {
          this.placeTokens[this.selectedIndex] = newDoc;
          this.validateTokens();
        } 
      } catch(e) {

      }
      
    },
    addDocumentToTempAssignment(name: string, doc: object, index: number) {
      //@ts-ignore
      this.tempAssignment[name] = doc;
      //@ts-ignore
      this.selectedForAssignment[name] = index;
      this.updateTransitionEvaluation();

      if (this.showPostsetModal) {
        this.updateOutboundEvaluation();
        this.updateOutboundSchemaEvaluation();
      }
    },
    updateOutboundEvaluation() {
      if (!this.transitionInscriptionValid) {
        this.outboundEvaluation = false;
        this.outboundEvaluationResult = 'Evaluation failed.';
        return;
      }

      let outboundEvaluation = false;
      let outboundEvaluationResult = '';

      let jsonnetString = variablifyDocuments(toRaw(this.tempAssignment));
      jsonnetString += this.inspectorContent;


      const evaluateDocuments = evaluate(jsonnetString);
      if (!evaluateDocuments.success) {
        // throw new Error(evaluateDocuments.data);
        outboundEvaluation = false;
        outboundEvaluationResult ='Evaluation failed.'
      } else {
        outboundEvaluation = true;
        outboundEvaluationResult = evaluateDocuments.data;
      }

      this.outboundEvaluation = outboundEvaluation;
      this.outboundEvaluationResult = outboundEvaluationResult;
    },
    updateOutboundSchemaEvaluation() {
        const arc = findArc(this.lastSelectedID);
        const place = arc.place;
        if(this.outboundEvaluation) {
           
          //@ts-ignore
          const validationResult =  validate(JSON.parse(this.outboundEvaluationResult),place.content.schema);
          if (validationResult.isValid) {
            this.outboundSchemaEvaluation = true;
            this.outboundSchemaEvaluationResult = 'Token is valid.'

          } else {
            this.outboundSchemaEvaluation = false;
            // Todo: multiple errors possible
            this.outboundSchemaEvaluationResult = 'Not valid: ' + validationResult.errors[0].message;
          }
        } else {
          console.log("inscription failed")
          this.outboundSchemaEvaluation = false;
          this.outboundSchemaEvaluationResult = 'Evaluation failed.'
          // todo: show appropriate message
        }
        // if (validate(outputDocument, this.place.content.schema).isValid) {
    },
    updateTransitionEvaluation() {
      let transitionEvaluation = false;
      // Todo: some duplicatoin from transition evaluation function
      let jsonnetString = variablifyDocuments(toRaw(this.tempAssignment));

      if (this.showTransitionModal) {
        jsonnetString += this.inspectorContent;
      } else if (this.showPostsetModal) {
        const arc = findArc(this.lastSelectedID);
        jsonnetString += arc.transition.content
      }
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


