<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 80%">
      <header class="modal-card-head">
        <p class="modal-card-title">Place inscription</p>

        <button class="delete" aria-label="close" @click="close()"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name of the place</label>
          <div class="control">
            <input class="input" type="text" v-model="uiState.itemName" />
          </div>
          <p class="help is-danger">{{ uiState.nameError }}</p>
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
                :data="uiState.formsData"
                :renderers="renderers"
                :schema="schema"
                @change="onChange"
              />
            </div>
          </div>
          <div class="column is-2 has-text-centered">
            <p style="width: 5%; align-self: center; text-align: center" class="arrow">&#10093;</p>
          </div>
          <div class="column is-5">
            <Codemirror
              :disabled="true"
              v-model="uiState.generatedSchemaString"
              placeholder="Output"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
            />
            <!-- @ready="" -->
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
            @click="uiState.addToken()"
            class="array-list-add button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold"
            type="button"
          >
            +
          </button>
        </div>
        <div class="tags block">
          <TokenTag 
            v-for="(doc, index) in uiState.placeTokens"
            :callback="() => { uiState.selectToken(index) }"
            :token="JSON.stringify(doc, null, 2)"
            :isSelected="uiState.selectedIndex === index"
            :isDeletable="true"
            :deletableCallbak="() => { uiState.deleteToken(index) }"
          />
          <!-- <span
            @click="uiState.selectToken(index)"
            :data-tooltip="JSON.stringify(doc, null, 2)"
            class="tag has-tooltip-bottom"
            :class="{
              'is-light': !(uiState.selectedIndex === index),
              'is-primary': uiState.selectedIndex === index
            }"
          >
            {{ shorten(JSON.stringify(doc, null, 2)) }}
            <button class="delete is-small" @click.stop="uiState.deleteToken(index)"></button> -->
          <!-- </span> -->
        </div>
        <div class="block">
          <Codemirror
            v-model="uiState.tokenString"
            placeholder="Select token to edit content."
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready=""
            @update="handleTokenChange"
          />
        </div>

        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item">Result of schema validation:</p>
            </div>
            <p
              v-html="uiState.placeTokenValidationResult"
              class="level-item"
              :class="{
                'green-background': uiState.placeTokenValidation,
                'red-background': !uiState.placeTokenValidation
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
import { useUiStateStore } from '@/stores/uiState'
import { validatePlaceName, setPlaceContent } from '@/components/jsonnets/net.js'
import { defineComponent, ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue'
import { defaultStyles, mergeStyles, vanillaRenderers } from '@jsonforms/vue-vanilla'
import HelpButton from './HelpButton.vue'

import TokenTag from './TokenTag.vue'
import { testStyle, schema, uischema } from './PlaceModalSchemaConfig'


const myStyles = mergeStyles(defaultStyles, testStyle)
const renderers = [...vanillaRenderers]

export default defineComponent({
  components: {
    JsonForms,
    Codemirror,
    HelpButton,
    TokenTag
},
  setup() {
    const uiState = useUiStateStore()

    const extensions = [json(), oneDark]
    // const view = shallowRef()
    // const handleReady = (payload) => {
      // view.value = payload.view
    // }

    return {
      extensions,
      // handleReady,
      uiState
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
  methods: {
    close() {
      this.uiState.showPlaceModal = false
    },
    onChange(event: JsonFormsChangeEvent) {
      this.uiState.formsData = event.data
      this.uiState.formsDataString = JSON.stringify(this.uiState.formsData, null, 2)
      this.uiState.updateJsonSchema()
    },
    shorten(string: string) {
      if (string.length <= 25) {
        return string
      } else {
        return string.slice(0, 22) + '...'
      }
    },
    handleTokenChange() {
      this.uiState.updateCurrentToken()
    },
    insertLineBreak(text) {
      //TODO Ist wahrscheinlich auch hier und bei Outbound -> Component oder util (genauso bei expanded und toggleAccordion)
      return text.replace(/\n/g, '<br>')
    },
    saveChanges() {
      this.uiState.nameError = ''
      let nameValid = validatePlaceName(this.uiState.itemName, this.uiState.lastSelectedID)
      if (!nameValid) {
        this.uiState.nameError = 'Place name must be unique.'
      } else {
        const placeContent = {
          schema: {},
          data: []
        }
        placeContent.schema = JSON.parse(this.uiState.generatedSchemaString)
        placeContent.data = this.uiState.placeTokens
        setPlaceContent(this.uiState.lastSelectedID, placeContent, this.uiState.itemName)
        this.close()
      }
    }
  },
  provide() {
    return {
      styles: myStyles
    }
  }
})
</script>

<style>
.arrow {
  font-size: 60px;
  display: inline-block;
  transform: scaleY(2);
  transform-origin: left center;
}
.array-list-no-data {
  display: none;
}

.array-list-item-move-down {
  display: none;
}

.array-list-item-move-up {
  display: none;
}

.array-list-item-label {
  display: none;
}

.error {
  display: none;
}

.my-horizontal-spacing {
  margin-right: 1rem;
}

.property-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #6c757d;
  margin-top: 5px;
  padding: 10px;
  color: #000000;
  background-color: #e3e7ec;
  /* width: fit-content; */
  /* min-width: 200px; */
}

.remove-margin {
  margin-bottom: 0rem !important;
}

.my-add-button-spacer {
  margin-right: 0.75rem;
  background-color: rgba(10, 10, 10, 0.2);
}

.array-list-legend {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}

/* Todo: very hacky solution to beautify json form select */
/* may double down on it for the arrow and drop down content */
.wrapper .select {
  padding-right: 2.5em;
  cursor: pointer;
  display: block;
  font-size: 1em;
  max-width: 100%;
  outline: none;
  background-color: hsl(0, 0%, 100%);
  border-color: hsl(0, 0%, 86%);
  border-radius: 4px;
  color: hsl(0, 0%, 21%);
  border: 1px solid transparent;
  box-shadow: none;
  height: 2.5em;
  line-height: 1.5;
  padding-bottom: calc(0.5em - 1px);
  padding-left: calc(0.75em - 1px);
  padding-top: calc(0.5em - 1px);
  position: relative;
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  margin: 0;
  box-sizing: inherit;
  font-weight: 400;
  line-height: 1.5;
}
.green-background {
  background-color: green;
  color: white;
  text-align: center;
  flex-grow: 1;
  margin-left: 15px;
}

.red-background {
  background-color: #e20505;
  color: white;
  text-align: center;
  flex-grow: 1;
  margin-left: 15px;
}
</style>
