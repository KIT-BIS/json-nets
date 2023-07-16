import { defineStore } from 'pinia'
import { mock } from 'mock-json-schema'
import { toRaw } from 'vue'
import * as beautify from 'js-beautify'
import {
  INSPECTOR_MODE_PLACE,
  INSPECTOR_MODE_POSTSET_ARC,
  INSPECTOR_MODE_PRESET_ARC,
  INSPECTOR_MODE_TRANSITION,
  MODE_NONE,
} from '@/App.vue'
import { findArc, findTransition, findPlace } from '@/jsonnets/net.js'
import { query } from '@/util/jsonPath.js'
import { jsonnetify, evaluate } from '@/util/jsonnet.js'
import { validate } from '@/util/jsonSchema.js'
import { transferSchemaToJsonFormsData, transferJsonFormsDataToSchema } from '@/util/jsonForms.js'
import { PresetArc } from '@/jsonnets/presetArc'

//TODO: this was built while I was still learning how to use stores
// some rework required, better architecture
// also MODES concept needs some rework
export const useUiStateStore = defineStore('uiState', {
  state: () => {
    return {
      mode: MODE_NONE as string,
      showInspector: false as boolean,
      lastSelectedID: '' as string,
      inspectorContent: '' as string,
      itemName: '' as string,
      nameError: '' as string,
      validationError: '' as string,

      showPresetModal: false as boolean,
      arcMode: '' as string,
      inputTokens: '' as string,
      inspectorMode: '' as string,
      jsonPathQuery: '' as string,
      queryResult: '' as string,
      jsonPathHelpExpanded: false as boolean,

      showTransitionModal: false as boolean,
      inputTokensArray: [] as Array<{ name: string, documents: Array<{}> }> | undefined,
      tempAssignment: {} as Object,
      selectedForAssignment: {} as { [key: string]: number },
      transitionInscriptionValid: false as boolean,
      inscriptionEvaluationResult: '' as string,

      showPostsetModal: false as boolean,
      outboundEvaluation: false as boolean,
      outboundEvaluationResult: '' as string,
      outboundSchemaEvaluation: false as boolean,
      outboundSchemaEvaluationResult: '' as string,

      showPlaceModal: false as boolean,
      formsData: {},
      formsDataString: '' as string,
      generatedSchemaString: '' as string,
      placeTokens: [] as Array<Object>,
      tokenString: '' as string,
      placeTokenValidation: false as boolean,
      placeTokenValidationResult: '' as string,
      selectedIndex: -1,

      showHelpModal: false as boolean
    }
  },
  actions: {
    setMode(mode: string) {
      this.mode = mode
    },
    setShowInspector(show: boolean) {
      this.showInspector = show
    },
    setShowPresetModal(show: boolean) {
      this.showPresetModal = show
    },
    setShowTransitionModal(show: boolean) {
      this.showTransitionModal = show
    },
    updateInspector(mode: string, id: string) {
      this.inspectorMode = mode
      this.lastSelectedID = id
      if (mode === INSPECTOR_MODE_PRESET_ARC) {
        const arc = findArc(this.lastSelectedID)
        if(!arc) return;
        if(!(arc instanceof PresetArc)) return;

        const place = arc.place
        this.jsonPathQuery = arc.label.filter
        this.inputTokens = JSON.stringify(place.content.data, null, 2)
        //@ts-ignore
        this.queryResult = JSON.stringify(
          query(JSON.parse(this.inputTokens), this.jsonPathQuery),
          null,
          2
        )
        this.showPresetModal = true
        this.arcMode = arc.label.type
      } else if (mode === INSPECTOR_MODE_POSTSET_ARC) {
        this.showPostsetModal = true
        const arc = findArc(this.lastSelectedID)
        if(!arc) return;

        const inputTokens = []
        const transition = arc.transition
        for (let i = 0; i < transition.preset.length; i++) {
          const name = transition.preset[i].place.name
          const documents = transition.preset[i].applyFilter()
          inputTokens.push({ name, documents })
        }
        this.inputTokensArray = inputTokens
        this.tempAssignment = {}
        this.selectedForAssignment = {}
        this.inscriptionEvaluationResult = 'false'
        this.setInspectorContent(String(arc.label))
      } else if (mode === INSPECTOR_MODE_TRANSITION) {
        this.showTransitionModal = true
        const transition = findTransition(this.lastSelectedID)
        if(!transition) return;

        const inputTokens = []
        for (let i = 0; i < transition.preset.length; i++) {
          const name = transition.preset[i].place.name
          const documents = transition.preset[i].applyFilter()
          inputTokens.push({ name, documents })
        }
        this.inputTokensArray = inputTokens
        this.tempAssignment = {}
        this.selectedForAssignment = {}
        // Todo: give feedback specifically when not all variables are selected.
        // Todo: show jsonnet feedback when error occurs
        this.inscriptionEvaluationResult = 'false'
        this.setInspectorContent(String(transition.content))
        this.setItemName(transition.name)
      } else if (mode === INSPECTOR_MODE_PLACE) {
        const place = findPlace(this.lastSelectedID)
        if (!place) return;

        this.showPlaceModal = true
        this.setItemName(place.name)
        this.formsData = transferSchemaToJsonFormsData(JSON.stringify(place.content.schema))
        this.formsDataString = JSON.stringify(this.formsData, null, 2)
        this.placeTokens = place.content.data
        this.tokenString = ''
        this.selectedIndex = -1
        this.updateJsonSchema()
        this.validateTokens()
      } else {
        this.showInspector = true
      }
    },
    updateJsonSchema() {
      this.generatedSchemaString = JSON.stringify(
        transferJsonFormsDataToSchema(this.formsDataString),
        null,
        2
      )
      this.validateTokens()
    },
    selectToken(index: number) {
      this.selectedIndex = index
      this.tokenString = JSON.stringify(this.placeTokens[index], null, 2)
    },
    addToken() {
      let newDoc = mock(JSON.parse(this.generatedSchemaString))
      this.placeTokens.push(newDoc)
      this.validateTokens()
    },
    deleteToken(index: number) {
      this.placeTokens.splice(index, 1)
      this.selectedIndex = -1
      this.tokenString = ''
    },
    validateTokens() {
      const docErrors: Array<any> = []
      let allValid = true

      this.placeTokens.forEach((doc, index) => {
        const { isValid, errors } = validate(doc, JSON.parse(this.generatedSchemaString))
        if (!isValid) {
          // console.log('Invalid document:')
          // console.log(errors)
          // const error: ErrorObject = errors[0]
          // error.errorIndex = index
          docErrors.push(errors)
          allValid = false
        }
      })

      if (!allValid) {
        this.placeTokenValidation = false
        this.placeTokenValidationResult = '<ul>'
        for (let i = 0; i < docErrors.length; i++) {
          let error = docErrors[i][0]
          this.placeTokenValidationResult += '<li>'
          this.placeTokenValidationResult +=
            'Token ' + error.errorIndex + ': ' + error.dataPath + ' ' + error.message
          this.placeTokenValidationResult += '</li>'
        }
        this.placeTokenValidationResult += '</ul>'
      } else {
        this.placeTokenValidation = true
        this.placeTokenValidationResult = 'All tokens valid to schema.'
      }
    },
    updateCurrentToken() {
      try {
        let newDoc = JSON.parse(this.tokenString)
        if (newDoc) {
          this.placeTokens[this.selectedIndex] = newDoc
          this.validateTokens()
        }
      } catch (e) {}
    },
    addDocumentToTempAssignment(name: string, doc: object, index: number) {
      //@ts-ignore
      this.tempAssignment[name] = doc
      //@ts-ignore
      this.selectedForAssignment[name] = index
      this.updateTransitionEvaluation()

      if (this.showPostsetModal) {
        this.updateOutboundEvaluation()
        this.updateOutboundSchemaEvaluation()
      }
    },
    updateOutboundEvaluation() {
      if (!this.transitionInscriptionValid) {
        this.outboundEvaluation = false
        this.outboundEvaluationResult = 'Evaluation failed.'
        return
      }

      let outboundEvaluation = false
      let outboundEvaluationResult = ''

      let jsonnetString = jsonnetify(toRaw(this.tempAssignment))
      jsonnetString += this.inspectorContent

      const evaluateDocuments = evaluate(jsonnetString)
      if (!evaluateDocuments.success) {
        // throw new Error(evaluateDocuments.data);
        outboundEvaluation = false
        outboundEvaluationResult = 'Evaluation failed.'
      } else {
        outboundEvaluation = true
        outboundEvaluationResult = evaluateDocuments.data
      }

      this.outboundEvaluation = outboundEvaluation
      this.outboundEvaluationResult = outboundEvaluationResult
    },
    updateOutboundSchemaEvaluation() {
      const arc = findArc(this.lastSelectedID)
      if(!arc) return;
      const place = arc.place
      if (this.outboundEvaluation) {
        //@ts-ignore
        const validationResult = validate(
          JSON.parse(this.outboundEvaluationResult),
          place.content.schema
        )
        if (validationResult.isValid) {
          this.outboundSchemaEvaluation = true
          this.outboundSchemaEvaluationResult = 'Token is valid.'
        } else {
          this.outboundSchemaEvaluation = false
          // Todo: multiple errors possible, also ts typing
          //@ts-ignore
          this.outboundSchemaEvaluationResult = 'Not valid: ' + validationResult.errors[0].message
        }
      } else {
        this.outboundSchemaEvaluation = false
        this.outboundSchemaEvaluationResult = 'Evaluation failed.'
        // todo: show appropriate message
      }
    },
    updateTransitionEvaluation() {
      let transitionEvaluation = false
      // Todo: some duplication from transition evaluation function
      let jsonnetString = jsonnetify(toRaw(this.tempAssignment))

      if (this.showTransitionModal) {
        jsonnetString += this.inspectorContent
      } else if (this.showPostsetModal) {
        const arc = findArc(this.lastSelectedID)
        if(!arc) return;
        jsonnetString += arc.transition.content
      }
      // Convert string to Boolean
      const evaluateDocuments = evaluate(jsonnetString)
      // Todo: give better evaluation feedback
      if (!evaluateDocuments.success) {
        // throw new Error(evaluateDocuments.data);
        transitionEvaluation = false
      } else {
        const result = JSON.parse(evaluateDocuments.data)
        if (result !== true) {
          transitionEvaluation = false
        } else {
          transitionEvaluation = true
        }
      }

      this.inscriptionEvaluationResult = String(transitionEvaluation)
      this.transitionInscriptionValid = transitionEvaluation
    },
    setJsonPathQuery(query: string) {
      this.jsonPathQuery = query
    },
    setQueryResult(result: string) {
      this.queryResult = result
    },
    updateQueryResult() {
      //@ts-ignore
      try {
        this.queryResult = JSON.stringify(
          query(JSON.parse(this.inputTokens), this.jsonPathQuery),
          null,
          2
        )
      } catch (e) {
        //TODO: properly handle error cases
        console.log('jsonpath query failed')
      }
    },
    setInspectorContent(content: string) {
      this.inspectorContent = beautify.js_beautify(content)
    },
    setItemName(name: string) {
      this.itemName = name
    },
    setNameError(error: string) {
      this.nameError = error
    },
    setValidationError(error: string) {
      this.validationError = error
    }
  }
})
