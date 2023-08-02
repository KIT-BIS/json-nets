<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title">Place inscription</p>
        <button class="delete" aria-label="close" @click="close()"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name of the place</label>
          <div class="control">
            <input class="input" type="text" v-model="placeName" />
          </div>
          <p class="help is-danger">{{ nameError }}</p>
        </div>
        <label class="label">
          Structure of tokens (JSON Schema)
          <HelpButton help-text="
            For more information about JSON Schema, please visit
            <a href='https://json-schema.org/' target='_blank'>https://json-schema.org/</a>.
          "/>
        </label>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <div class="property-box">
              <json-forms
                :uischema="uischema"
                :data="formsData"
                :renderers="renderers"
                :schema="metaSchema"
                @change="onFormChange"
              />
            </div>
          </div>
          <div class="column is-2 has-text-centered">
            <Arrow />
          </div>
          <div class="column is-5">
            <Codemirror
              :disabled="true"
              v-model="generatedSchemaString"
              placeholder="Output"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">
            Tokens (JSON)
            <HelpButton help-text="
              For more information about JSON, please visit
              <a href='https://www.json.org/json-en.html' target='_blank'
                >https://www.json.org/json-en.html</a>.
            "/>
          </label>
        </div>
        <div class="block">
          <button
            @click="addToken()"
            class="array-list-add button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold"
            type="button"
          >
            +
          </button>
        </div>
        <div class="tags block">
          <TokenTag 
            v-for="(doc, index) in placeTokens"
            :callback="() => { selectToken(index) }"
            :token="JSON.stringify(doc, null, 2)"
            :isSelected="selectedTokenIndex === index"
            :isDeletable="true"
            :deletableCallback="() => { deleteToken(index) }"
          />
        </div>
        <div class="block">
          <Codemirror
            v-model="tokenString"
            placeholder="Select token to edit content."
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @update="updateCurrentToken"
          />
        </div>


        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item">Result of schema validation:</p>
            </div>
            <p
              v-html="tokenValidationMessage"
              class="level-item"
              :class="{
                'jsn-green-background': tokenValidation,
                'jsn-red-background': !tokenValidation
              }"
            ></p>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-success" @click="saveChanges">Save changes</button>
        <button class="button" @click="close()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">

import type { JsonFormsChangeEvent } from '@jsonforms/vue'
import { mapStores } from 'pinia'
import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { JsonForms  } from '@jsonforms/vue'
import { defaultStyles, mergeStyles, vanillaRenderers } from '@jsonforms/vue-vanilla'
import HelpButton from '@/components/_shared/HelpButton.vue'

import TokenTag from '@/components/_shared/TokenTag.vue'
import Arrow from '@/components/_shared/Arrow.vue'
import { testStyle, metaSchema, uischema } from './PlaceModalSchemaConfig'
import { Place } from '@/json-nets/Place'
import { transferJsonFormsDataToSchema, transferSchemaToJsonFormsData } from '@/util/jsonForms'
import type { JSONMarking } from '@/util/jsonOperations'
import { Net } from '@/json-nets/Net'
import { mock } from 'mock-json-schema'
import { compileValidator, unCacheSchema, validateJSON } from '@/util/jsonSchema'

import { getNetInstance } from "@/json-nets/Net";

const myStyles = mergeStyles(defaultStyles, testStyle)
const renderers = [...vanillaRenderers]

export default defineComponent({
  components: {
    JsonForms,
    Codemirror,
    HelpButton,
    TokenTag,
    Arrow
  },
  setup() {
    const extensions = [json(), oneDark]

    return {
      extensions,
    }
  },
  data() {
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      metaSchema,
      uischema,

      placeName: '',

      formsData: {},
      formsDataString: '',
      generatedSchemaString: '',
      tempSchemaValidator: compileValidator({ $id: 'temp' }),

      placeTokens: [] as JSONMarking,
      tokenString: '',
      selectedTokenIndex: -1,
      tokenValidation: true,
      tokenValidationMessage: '',

    }
  },
  computed: {
    ...mapStores(useUiStateStore),
    nameError() {
      let nameValid = getNetInstance().validatePlaceName(this.placeName, this.uiStateStore.lastSelectedID)
      if (!nameValid) {
        return 'Place name must be unique.'
      } else {
        return ''
      }

    }
  },
  provide() {
    return {
      styles: myStyles
    }
  },
  mounted() {
    const place = getNetInstance().findPlace(this.uiStateStore.lastSelectedID)
    //TODO some error handling
    if (!place) return;

    this.placeName = place.name;
    this.placeTokens = place.marking

    this.formsData = transferSchemaToJsonFormsData(place.schema.items)
    this.formsDataString = JSON.stringify(this.formsData, null, 2)


    this.updateJsonSchema()
    this.validateTokens()
  },
  methods: {
    onFormChange(event: JsonFormsChangeEvent) {
      this.formsData = event.data
      this.formsDataString = JSON.stringify(this.formsData, null, 2)
      this.updateJsonSchema()
    },
    updateJsonSchema() {
      unCacheSchema('temp');

      this.generatedSchemaString = JSON.stringify(
        transferJsonFormsDataToSchema(this.formsDataString),
        null,
        2
      )
      const tempSchema = JSON.parse(this.generatedSchemaString); 
      tempSchema['$id'] = 'temp';
      this.tempSchemaValidator = compileValidator(tempSchema);
      this.validateTokens()
    },
    selectToken(index: number) {
      this.selectedTokenIndex = index
      this.tokenString = JSON.stringify(this.placeTokens[index], null, 2)
    },
    addToken() {
      let newDoc = mock(JSON.parse(this.generatedSchemaString))
      this.placeTokens.push(newDoc)
      this.validateTokens()
    },
    deleteToken(index: number) {
      this.placeTokens.splice(index, 1)
      this.selectedTokenIndex = -1
      this.tokenString = ''
    },
    validateTokens() {
      const tokenErrors: Array<{tokenID: number, message: string}> = []
      let allValid = true

      let tokenID = 1
      this.placeTokens.forEach((token) => {
        const { isValid, error } = validateJSON(token, this.tempSchemaValidator);
        
        if (!isValid) {
          tokenErrors.push({ tokenID, message: error })
          allValid = false
        }
        tokenID++;
      })

      if (!allValid) {
        this.tokenValidation = false
        this.tokenValidationMessage = '<ul>'
        for (let i = 0; i < tokenErrors.length; i++) {
          let error = tokenErrors[i]
          this.tokenValidationMessage += '<li>'
          this.tokenValidationMessage +=
            'Token ' + error.tokenID + ': ' + error.message
          this.tokenValidationMessage += '</li>'
        }
        this.tokenValidationMessage += '</ul>'
      } else {
        this.tokenValidation = true
        this.tokenValidationMessage = 'All tokens valid to schema.'
      }
    },
    updateCurrentToken() {
      try {
        let newDoc = JSON.parse(this.tokenString)
        if (newDoc) {
          this.placeTokens[this.selectedTokenIndex] = newDoc
          this.validateTokens()
        }
      } catch (e) {

      }
    },

    saveChanges() {
      if (this.nameError !== '') {
        return;
      }
      if (!this.tokenValidation) {
        return;
      }
      const schemaToSave = JSON.parse(this.generatedSchemaString);
      getNetInstance().updatePlace(this.uiStateStore.lastSelectedID,  this.placeName, schemaToSave ,this.placeTokens)
      this.close()
    },
    close() {
      unCacheSchema('temp');
      this.uiStateStore.setModal('none');
    },

  },
})
</script>
<style>
@import '../../assets/json-forms.css';
</style>