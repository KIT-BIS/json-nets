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
            <input class="input" type="text" v-model="uiStateStore.itemName" />
          </div>
          <p class="help is-danger">{{ uiStateStore.nameError }}</p>
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
                :data="uiStateStore.formsData"
                :renderers="renderers"
                :schema="schema"
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
              v-model="uiStateStore.generatedSchemaString"
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
            @click="uiStateStore.addToken()"
            class="array-list-add button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold"
            type="button"
          >
            +
          </button>
        </div>
        <div class="tags block">
          <TokenTag 
            v-for="(doc, index) in uiStateStore.placeTokens"
            :callback="() => { uiStateStore.selectToken(index) }"
            :token="JSON.stringify(doc, null, 2)"
            :isSelected="uiStateStore.selectedIndex === index"
            :isDeletable="true"
            :deletableCallback="() => { uiStateStore.deleteToken(index) }"
          />
        </div>
        <div class="block">
          <Codemirror
            v-model="uiStateStore.tokenString"
            placeholder="Select token to edit content."
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @update="onTokenEditorUpdate"
          />
        </div>


        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item">Result of schema validation:</p>
            </div>
            <p
              v-html="uiStateStore.placeTokenValidationResult"
              class="level-item"
              :class="{
                'jsn-green-background': uiStateStore.placeTokenValidation,
                'jsn-red-background': !uiStateStore.placeTokenValidation
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
import { validatePlaceName, setPlaceContent } from '@/jsonnets/net'
import { defineComponent } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { JsonForms  } from '@jsonforms/vue'
import { defaultStyles, mergeStyles, vanillaRenderers } from '@jsonforms/vue-vanilla'
import HelpButton from '@/components/_shared/HelpButton.vue'

import TokenTag from '@/components/_shared/TokenTag.vue'
import Arrow from '@/components/_shared/Arrow.vue'
import { testStyle, schema, uischema } from './PlaceModalSchemaConfig'


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
      schema,
      uischema
    }
  },
  computed: {
    ...mapStores(useUiStateStore)
  },
  provide() {
    return {
      styles: myStyles
    }
  },
  methods: {
    close() {
      this.uiStateStore.showPlaceModal = false
    },
    onFormChange(event: JsonFormsChangeEvent) {
      this.uiStateStore.formsData = event.data
      this.uiStateStore.formsDataString = JSON.stringify(this.uiStateStore.formsData, null, 2)
      this.uiStateStore.updateJsonSchema()
    },
    onTokenEditorUpdate() {
      this.uiStateStore.updateCurrentToken()
    },
    saveChanges() {
      this.uiStateStore.nameError = ''
      let nameValid = validatePlaceName(this.uiStateStore.itemName, this.uiStateStore.lastSelectedID)
      if (!nameValid) {
        this.uiStateStore.nameError = 'Place name must be unique.'
      } else {
        const placeContent: { schema: Object, data: Array<Object>} = {
          schema: {},
          data: [] 
        }
        placeContent.schema = JSON.parse(this.uiStateStore.generatedSchemaString)
        placeContent.data = this.uiStateStore.placeTokens;
        setPlaceContent(this.uiStateStore.lastSelectedID, placeContent, this.uiStateStore.itemName)
        this.close()
      }
    }
  },
})
</script>
<style>
@import '../../assets/json-forms.css';
</style>@/jsonnets/net.js