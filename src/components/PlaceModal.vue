<script lang="ts">
import { INSPECTOR_MODE_PLACE, INSPECTOR_MODE_TRANSITION, INSPECTOR_MODE_PRESET_ARC, INSPECTOR_MODE_POSTSET_ARC } from '@/App.vue';
import { useUiStateStore } from '@/stores/uiState';
// TODO: proper modularisation
// @ts-ignore
import { findPlace, findTransition, findArc, setPlaceContent, setTransitionContent, setArcLabel } from '@/components/jsonnets/net.js';
// TODO: proper modularisation
//@ts-ignore
import { updateArcLabelInExportArray, updateTransitionContentInExportArray, updatePlaceContentInExportArray } from '@/util/exportNet.js'
// @ts-ignore

import { defineComponent, ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";


const testStyle = { 
  arrayList: { 
    addButton: "button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold",
    label: "label level-item",
    legend: "level",
    item: "level-left property-box",
    itemToolbar: "level-item",
    itemContent: "level-item",
    itemDelete: "delete",
    itemWrapper: "level remove-margin"
  },
  horizontalLayout: {
    item: "my-horizontal-spacing",
    root: "field is-horizontal"
  },
  group: {
    item: "property-box"
  }
  
 };

const myStyles = mergeStyles(defaultStyles, testStyle); 
const renderers = [
  ...vanillaRenderers,
];


const schema = {
  type: "object",
  properties: {
    properties: { 
      type: "array",
      items: { "$ref": "#/$defs/field"}
    }
  },

  "$defs": {
    "field": {
      type: "object",
      properties: {
        type: { "$ref": "#/$defs/type"},
        name: { "$ref": "#/$defs/name"},
        properties: {  "$ref": "#/$defs/properties" },
        items: {  "$ref": "#/$defs/type" }
      }
    },
    "type": {
        type: "string",
        enum: ["string", "number", "integer", "boolean", "null", "object", "array"]
    },
    "name": { type: "string"},
    "properties": {
        type: "array",
        items: { "$ref": "#/$defs/field" }
    },
  }
};

const nameAndTypeElements = {
  type: "HorizontalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/name"
    },
    {
      type: "Control",
      scope: "#/properties/type"
    },
  ]
}

const propertiesInArray = {
  type: "Control",
  scope: "#/properties/properties",
  options: {
    detail: {
      type: "VerticalLayout",
      elements: [
        nameAndTypeElements,
      ]
    }
  },
}

const items = {
  type: "Group",
  elements: [
    { 
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/items",
        },
        {
          type: "Control",
          scope: "#/properties/properties",
          options: {
            detail: nameAndTypeElements
          },
          rule: {
            effect: "SHOW",
            condition: {
              scope: "#/properties/items",
              schema: {
                const: "object"
              }
            }
          }
        }
       // propertiesInArray
      ]
    }
  ],
  rule: {
    effect: "SHOW",
    condition: {
      scope: "#/properties/type",
      schema: {
        const: "array"
      }
    }
  }
};
const properties = {
  type: "Control",
  scope: "#/properties/properties",
  options: {
    detail: {
      type: "VerticalLayout",
      elements: [
        nameAndTypeElements,
        {
          type: "Control",
          scope: "#/properties/properties",
          options: {
            detail: {
              type: "VerticalLayout",
              elements: [
                nameAndTypeElements
              ]
            } 
          },
          rule: {
            effect: "SHOW",
            condition: {
              scope: "#/properties/type",
              schema: {
                const: "object"
              }
            }
          }
        },
        items
      ]
    }
  },
  rule: {
    effect: "SHOW",
    condition: {
      scope: "#/properties/type",
      schema: {
        const: "object"
      }
    }
  }
}



const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/properties",
      options: {
        detail: {
          type: "VerticalLayout",
          elements: [
            nameAndTypeElements,
            items,
            properties
          ]
        }
      }
    },
  ],
};

export default defineComponent({
  setup() {
    const uiState = useUiStateStore();

    const code1 = ref('')
    const code2 = ref('')
    const code3 = ref('')
    const extensions = [json(), oneDark]
    const view = shallowRef()
    const handleReady = (payload) => {
        view.value = payload.view
    }

    console.log(myStyles);
    return { 
      code1,
      code2,
      code3,
      extensions,
      handleReady,
      uiState

     };
  },
  components: {
    JsonForms, Codemirror
  },
  mounted() {
    // const newData = transferSchemaToUiFormsData(this.uiState.inspectorContent);
    //this.data = newData;
  },
  data() {
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      // dataString: '',
      // data: {},
      schema,
      uischema,
    };
  },
  methods: {
    close() {
      this.uiState.showPlaceModal = false;
    },
    onChange(event: JsonFormsChangeEvent) {
      console.log("form changed")
      // this.data = event.data;
      this.uiState.formsData = event.data;
      this.uiState.formsDataString = JSON.stringify(this.uiState.formsData, null, 2)
      this.uiState.updateJsonSchema();
      // this.uiState.updateJsonSchema(this.uiState.formsDataString);
    },
    shorten(string) {
        if (string.length <= 25) {
            return string
        } else {
            return string.slice(0, 22) + "...";
        }
    },
    handleTokenChange() {
      this.uiState.updateCurrentToken();
    }
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
})


</script>
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
                <input class="input" type="text" v-model="uiState.itemName"  />
            </div>
        </div>
        <label class="label">
                        Structure of tokens (JSON Schema) 
                        <div class="dropdown is-hoverable is-right">
                            <div class="dropdown-trigger">
                                <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <div class="dropdown-item">
                                      <p>For more information about JSON Schema, please visit 
                                            <a href="https://json-schema.org/"
                                                target="_blank">https://json-schema.org/</a>
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
          </label>
          <div class="columns is-vcentered">
              <div class="column is-5">
          <div class="property-box">
            <json-forms :uischema="uischema" :data="uiState.formsData" :renderers="renderers" :schema="schema" @change="onChange" />
          </div>

              </div>
              <div class="column is-2 has-text-centered">
              <p style="width: 5%; align-self: center; text-align: center" class="arrow"> &#10093; </p>
              </div>
              <div class="column is-5">
                <Codemirror :disabled="true" v-model="uiState.generatedSchemaString" placeholder="Output"  :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="" />
 
              </div>
          </div>
          <div class="field">
            <label class="label">
              Tokens (JSON)
              <div class="dropdown is-hoverable">
                  <div class="dropdown-trigger">
                      <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                  </div>
                  <div class="dropdown-menu">
                      <div class="dropdown-content">
                          <div class="dropdown-item">
                            <p>For more information about JSON, please visit 
                                  <a href="https://www.json.org/json-en.html"
                                      target="_blank">https://www.json.org/json-en.html</a>
                              </p>

                          </div>
                      </div>
                  </div>
              </div>

            </label>
            <div class="block">
            <button @click="uiState.addToken()" class="array-list-add button level-item is-small my-add-button-spacer has-text-white has-text-weight-bold" type="button"> + </button>
            </div>
            <div class="tags block">
            <!-- {{ JSON.stringify(place.documents, null, 2) }} -->
            <span 
              @click="uiState.selectToken(index)"
                v-for="(doc, index) in uiState.placeTokens" :data-tooltip="JSON.stringify(doc, null, 2)" class="tag has-tooltip-bottom" :class="{ 'is-light': !(uiState.selectedIndex === index), 'is-primary': (uiState.selectedIndex === index) }">
            {{ shorten(JSON.stringify(doc, null, 2)) }}
            <button class="delete is-small" @click.stop="uiState.deleteToken(index)"></button>
            </span>
            </div>
            <Codemirror v-model="uiState.tokenString" placeholder="Output" :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="" @update="handleTokenChange" />



          </div>
          <!-- <div class="field">
          <label class="label">
            JSON forms data from form:
          </label>
          <div class="control">
                 <Codemirror :disabled="true" v-model="uiState.formsDataString" placeholder="Output" :style="{ height: '600px' }" :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="" />
          </div>
          </div>

          <div class="columns is-vcentered">
            <div class="column">
            <div class="field">
            <label class="label">
              Original loaded schema:
            </label>
            <div class="control">
                   <Codemirror :disabled="true" v-model="uiState.originalSchema" placeholder="Output" :style="{ height: '600px' }" :autofocus="true"
                      :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="" />
            </div>
            </div>
            </div>
            <div class="column">
            <div class="field">
            <label class="label">
              JSON forms data from loaded schema:
            </label>
            <div class="control">
                   <Codemirror :disabled="true" v-model="uiState.formsDataFromOriginal" placeholder="Output" :style="{ height: '600px' }" :autofocus="true"
                      :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="" />
            </div>
            </div>
            </div>
          </div>
 -->
        </section>

        <footer class="modal-card-foot">
          <button class="button is-success" @click="">Save changes</button>
          <button class="button" @click="close()">Cancel</button>
        </footer>
      </div>
    </div>
</template>

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
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  margin: 0;
  box-sizing: inherit;
  font-weight: 400;
  line-height: 1.5;
}

/* #app { */
/* font-family: Avenir, Helvetica, Arial, sans-serif; */
/* -webkit-font-smoothing: antialiased; */
/* -moz-osx-font-smoothing: grayscale; */
/* text-align: center; */
/* color: #2c3e50; */
/* margin-top: 60px; */
/* margin-left: 120px; */
/* margin-right: 120px; */
/* } */
/*  */
/* .mylabel { */
/* color: darkslategrey; */
/* } */
/*  */
/* .vertical-layout { */
/* margin-left: 10px; */
/* margin-right: 10px; */
/* } */
/*  */
/* .myform { */
/* width: 640px; */
/* margin: 0 auto; */
/* } */
/*  */
/* .text-area { */
/* min-height: 80px; */
/* } */
</style>