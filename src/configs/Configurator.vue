<template>
  <div class="container">
    <!-- Configurator Form -->
    <h1 class="title">Configurator</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Name -->
      <div class="field">
        <label class="label is-small" for="name">Name:</label>
        <div class="control is-small">
          <input id="name" v-model="formData.name" type="text" class="input is-small" required />
        </div>
      </div>

      <!-- Default UI Assist Mode -->
      <div class="field">
        <label class="label is-small" for="defaultUIAssistMode">Default UI Assist Mode:</label>
        <div class="control is-small">
          <div class="select is-small">
            <select id="defaultUIAssistMode" v-model="formData.defaultUIAssistMode" required>
              <option value="expert">Expert</option>
              <option value="assisted">Assisted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Default Transition Type -->
      <div class="field">
        <label class="label is-small" for="defaultTransitionType">Default Transition Type:</label>
        <div class="control is-small">
          <input id="defaultTransitionType" v-model="formData.defaultTransitionType" type="text" class="input is-small" required />
        </div>
      </div>

      <!-- Default Place Type -->
      <div class="field">
        <label class="label is-small" for="defaultPlaceType">Default Place Type:</label>
        <div class="control is-small">
          <input id="defaultPlaceType" v-model="formData.defaultPlaceType" type="text" class="input is-small" required />
        </div>
      </div>

      <!-- Allow Auto Layout -->
      <div class="field">
        <label class="checkbox is-small" for="allowAutoLayout" style="display: flex; align-items: center;">
          <input id="allowAutoLayout" v-model="formData.allowAutoLayout" type="checkbox" />
          <p class="is-size-7" style="margin-left: 0.25em;">Allow Auto Layout</p>
        </label>
      </div>

      <!-- Visualisation Tab -->
      <div class="field">
        <label class="checkbox is-small" for="visualisationConfig" style="display: flex; align-items: center;">
          <input id="visualisationConfig" v-model="formData.visualisationConfig" type="checkbox" />
          <p class="is-size-7" style="margin-left: 0.25em;">Visualisation Tab</p>
        </label>
      </div>

      <!-- Transition Types Configuration -->
      <h3 class="label is-small">Transition Types</h3>
      <!-- Loop over transition types -->
      <div v-for="(transitionType, index) in formData.transitionTypes" :key="index" class="box">
        <!-- Transition Type Details -->
        <article class="media">
          <div class="media-content">
            <div class="content">
              <!-- Toggle button and Remove button -->
              <div class="is-flex is-justify-content-space-between is-align-items-center">
          <h4 class="label is-small"> {{ transitionType.id ? `${transitionType.id}` : `Transition Type ${index + 1}` }}</h4>
          <div class="buttons">
            <button type="button" class="button is-small" @click="toggleDetail(index, 'transition')">
              <span v-if="!transitionType.collapsed">-</span>
              <span v-if="transitionType.collapsed">+</span>
            </button>
            <button type="button " @click="deleteTransitionPlaceType(index, 'transition')"  class="button is-danger is-small" >
		<span class="icon is-small">
			<font-awesome-icon icon="fas fa-trash" />
		</span>
	</button>         </div>
        </div>
              <!-- Transition Type details when expanded -->
              <div v-if="!transitionType.collapsed">
                <!-- Fields for transition type details -->
                <div class="field">
                  <label class="label" :for="'id-' + index">ID:</label>
                  <div class="control">
                    <input class="input" :id="'id-' + index" v-model="transitionType.id" placeholder="Enter ID">
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'title-' + index">Title:</label>
                    <div class="control">
                      <input class="input" id="'title-' + index" v-model="transitionType.title" placeholder="Enter Title">
                    </div>
                </div>

                <div class="field">
                  <label class="label" for="'description-' + index">Description:</label>
                  <div class="control">
                    <textarea class="textarea" id="'description-' + index" v-model="transitionType.description" placeholder="Describe the Transition Type"></textarea>
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'keySnippet-' + index">Key Snippet:</label>
                  <div class="control">
                    <input class="input" id="'keySnippet-' + index" v-model="transitionType.keySnippet" placeholder="Key Snippet">
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'valueSnippet-' + index">Value Snippet:</label>
                  <div class="control">
                    <textarea class="textarea" id="'valueSnippet-' + index" v-model="transitionType.valueSnippet" placeholder="Value Snippet"></textarea>
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'preface-' + index">Preface:</label>
                  <div class="control">
                    <textarea class="textarea" id="'preface-' + index" v-model="transitionType.preface" placeholder="Preface"></textarea>
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'guard-' + index">Guard:</label>
                  <div class="control">
                    <input class="input" id="'guard-' + index" v-model="transitionType.guard" placeholder="Guard Condition">
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'presetFilter-' + index">Preset Filter:</label>
                  <div class="control">
                    <input class="input" id="'presetFilter-' + index" v-model="transitionType.presetFilter" placeholder="Preset Filter">
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="'postsetFilter-' + index">Postset Filter:</label>
                  <div class="control">
                    <input class="input" id="'postsetFilter-' + index" v-model="transitionType.postsetFilter" placeholder="Postset Filter">
                  </div>
                </div>
<!-- 
                <div class="field">
                  <label class="label" for="'customvariables-' + index">Custom Variables::</label>
                  <div class="control">
                    <input class="input" id="'customvariables-' + index" v-model="transitionType.customVariables" placeholder="Custom Variables">
                  </div>
                </div> -->

                <!-- <div class="field">
    <label class="label" :for="'customvariables-' + index">Custom Variables:</label>
    <div class="control">
      <input class="input" id="'customvariables-' + index" v-model="transitionType.customVariables" placeholder="Enter Custom Variables" @input="handleInput" />
    </div>
  </div> -->

                <div class="field">
                        <label class="label">Custom Variables:</label>
                        <div class="control">
                            <div class="jsn-code">
                                <Codemirror v-model="transitionType.customVariables" placeholder="Enter Custom Variables." :autofocus="true"
                                    :indent-with-tab="true" :tab-size="2" :style="{ height: '150px' }" :extensions="extensions"  />
                            </div>
                        </div>
                    </div>

               
              </div>
            </div>
          </div>
        </article>
      </div>
      <!-- Button to add transition type -->
      <button type="button" @click="addTransitionPlaceType('transition')" class="button is-info is-small">Add Transition Type</button>

      <!-- Place Types Configuration -->

      <h3 class="label is-small">Place Types</h3>
        <div v-for="(placeType, index) in formData.placeTypes" :key="index" class="box">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
          <h4 class="label is-small"> {{ placeType.id ? `${placeType.id}` : `Place Type ${index + 1}` }}</h4>
          <div class="buttons">
            <button type="button" class="button is-small" @click="toggleDetail(index, 'place')">
              <span v-if="!placeType.collapsed">-</span>
              <span v-if="placeType.collapsed">+</span>
            </button>
            <button type="button " @click="deleteTransitionPlaceType(index, 'place')"  class="button is-danger is-small" >
		<span class="icon is-small">
			<font-awesome-icon icon="fas fa-trash" />
		</span>
	</button>         </div>
        </div>
          <div v-if="!placeType.collapsed">
        <div class="field">
          <label class="label" for="'id-' + index">ID:</label>
          <div class="control">
            <input class="input" id="'id-' + index" v-model="placeType.id" placeholder="Enter ID">
          </div>
        </div>
        <div class="field">
          <label class="label" for="'title-' + index">External Interaction:</label>
          <div class="control">
            <input class="input" id="'title-' + index" v-model="placeType.externalInteraction" placeholder="Enter external Interaction">
          </div>
        </div>
      
        <div class="field">
        <label class="label">Schema</label>
      </div>
      <div class="field is-flex">
        <div class="field-group">
          <label class="label">-Type:</label>
          <input class="input" v-model="placeType.schema.type" placeholder="Type" />
        </div>
        <div class="field-group">
          <label class="label">-Title:</label>
          <input class="input" v-model="placeType.schema.title" placeholder="Title" />
        </div>
      </div>
      <div class="field is-flex">
        <div class="field-group">
          <label class="label">-Description:</label>
          <input class="input" v-model="placeType.schema.description" placeholder="Description" />
        </div>
        <div class="field-group">
          <label class="label">-Max Items:</label>
          <input class="input" type="number" v-model="placeType.schema.maxItems" placeholder="Max Items" />
        </div>
      </div>
      <div class="field is-flex">
        <div class="field-group">
          <label class="label">-Item Type:</label>
          <input class="input" v-model="placeType.schema.items.type" placeholder="Item Type" />
        </div>
      </div>

<div class="field">
                        <label class="label">Marking:</label>
                        <div class="control">
                            <div class="jsn-code">
                                <Codemirror v-model="placeType.marking" placeholder="Enter Marking." :autofocus="true"
                                    :indent-with-tab="true" :tab-size="2" :style="{ height: '150px' }" :extensions="extensions"  />
                            </div>
                        </div>
                    </div>



      </div>      </div>

    </div>
  </article>
</div>
<button type="button" @click="addTransitionPlaceType('place')" class="button is-info is-small">Add Place Type</button>
      <!-- Examples -->
      <div class="field">
        <label class="label is-small" for="examples">Examples:</label>
        <div class="control is-small">
          <input id="examples" type="file" @change="handleFileUpload" multiple class="input is-small" />
        </div>
      </div>

      <!-- Uploaded Examples -->
      <div class="field" v-if="formData.examples.length > 0">
        <label class="label is-small">Uploaded Examples:</label>
        <div class="control is-small">
          <ul>
            <li v-for="(example, index) in formData.examples" :key="index">
              {{ example.name }}
              <button class="delete is-small" @click="deleteExample(index)">Delete</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Download Configuration Button -->
      <div class="field">
        <div class="control is-small">
          <button type="submit" class="button is-primary is-small">Download Configuration</button>
        </div>
      </div>
    </form>
  </div>
</template>

  
<script lang="ts">

/**
    Configuration form for downloading custom editor settings with JSONnet examples upload capability
*/
import { defineComponent, computed } from 'vue';
import { readFile, download } from '@/util/files';

import { useUiStateStore } from '@/stores/uiState';
import { ref } from 'vue';

import { basicSetup } from 'codemirror';
import { Codemirror } from 'vue-codemirror';
import { EditorState } from "@codemirror/state";
import { gutter, EditorView, lineNumbers } from "@codemirror/view";
import { history } from "@codemirror/commands";
import { closeBrackets } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import type { JSONSchema7 } from 'json-schema';
import { jsonSchema } from "codemirror-json-schema";
import JSONSchema from "@json-schema-tools/meta-schema"

interface Example {
    name: string;
    net: any;
}

interface FormData {
    name: string;
    defaultUIAssistMode: 'expert' | 'assisted';
    defaultTransitionType: string;
    defaultPlaceType: string;
    allowAutoLayout: boolean;
    visualisationConfig: boolean | {};
    examples: Example[];
    transitionTypes: any[];
    placeTypes: any[];

}

export default defineComponent({
    name: 'Configurator',
    mounted() {
      //Router back history does not load main component
      const uiState = useUiStateStore();
	    uiState.showView = 'configurator'
	},
  components: {
        Codemirror,
    },
    setup() {


const extensions = [
    gutter({ class: "CodeMirror-lint-markers" }),
    bracketMatching(),
    basicSetup,
    closeBrackets(),
    history(),
    lineNumbers(),
    lintGutter(),
    EditorView.lineWrapping,
    EditorState.tabSize.of(2),
    syntaxHighlighting(oneDarkHighlightStyle),
    jsonSchema(JSONSchema)
]

        const formData = ref<FormData>({
            name: '',
            defaultUIAssistMode: 'expert',
            defaultTransitionType: 'default',
            defaultPlaceType: 'default',
            allowAutoLayout: false,
            visualisationConfig: false,
            examples: [],
            transitionTypes: [
        {
            id: '',
            title: '',
            description: '',
            keySnippet: "'-';",
            valueSnippet: '',
            preface: '',
            guard: 'true',
            presetFilter: '$.*',
            postsetFilter: '$',
            customVariables: '{}', collapsed: false
        }
    ]
    ,placeTypes: [
        {
            id: '',
                    externalInteraction: "none",
                    schema: {
                        type: "array",
                        title: "Title",
                        description: "Description",
                        maxItems: 1,
                        items: {"type": "object"},
                    
                    }, collapsed: false,
                    marking: '[{}]'
          
        }
    ]     });

    function generateJson() {
            return JSON.stringify({
                ...formData.value,
                transitionTypes: formData.value.transitionTypes.map(transitionType => ({
                    ...transitionType,
                    customVariables:  JSON.parse(transitionType.customVariables),
                    collapsed: undefined  // Remove 'collapsed' property 
                })),
                placeTypes: formData.value.placeTypes.map(placeType => ({
                    ...placeType,
                    schema: placeType.schema,
                    marking: JSON.parse(placeType.marking),
                    externalInteraction: {type:placeType.externalInteraction},
                    collapsed: undefined 
                }))
            }, null, 2);
        }

        function handleSubmit() {
            const jsonConfig = generateJson();
            download(jsonConfig, `${formData.value.name || 'config'}.json`, 'application/json');
        }

        function handleFileUpload(event: Event) {
            const input = event.target as HTMLInputElement;
            if (!input.files) return;

            Array.from(input.files).forEach(file => {
                readFile({ target: { files: [file] } } as unknown as Event, (content: string) => {
                    try {
                        const jsonContent = JSON.parse(content);
                        formData.value.examples.push({
                            name: file.name,
                            net: jsonContent
                        });
                    } catch (error) {
                        alert(`Error parsing JSON in file ${file.name}: ${error}`);
                    }
                });
            });
        }

        function deleteExample(index: number) {
            formData.value.examples.splice(index, 1);
        }
        const addTransitionPlaceType = (type: string) => {
            if(type === "transition") {
                formData.value.transitionTypes.push({
                id: '',
                title: '',
                description: '',
                keySnippet: '',
                valueSnippet: '',
                preface: '',
                guard: 'true',
                presetFilter: '$.*',
                postsetFilter: '$',
                customVariables: '{}'
            });

            } else {
                formData.value.placeTypes.push({
                id: '',
                externalInteraction: "none",
                schema: {
                        type: "array",
                        title: "Title",
                        description: "Description",
                        maxItems: 1,
                        items: {"type": "object"},
                    
                    },
                    marking: '[{}]'
           
            });
            }
        
        };
    function toggleDetail(index: number, type: string) {
        if(type === "transition") {
            formData.value.transitionTypes[index].collapsed = !formData.value.transitionTypes[index].collapsed;

        } else {
            formData.value.placeTypes[index].collapsed = !formData.value.placeTypes[index].collapsed;

        }
    }
    
    const deleteTransitionPlaceType = (index, type: string) => {
      if(type === "transition") {
        formData.value.transitionTypes.splice(index, 1);

        } else {
            formData.value.placeTypes.splice(index, 1);

        }
    }

    // const deleteCustomVariable = (transitionTypeIndex: number, customVariableIndex: number) => {
    //         formData.value.transitionTypes[transitionTypeIndex].customVariables.splice(customVariableIndex, 1);
    //     };

    //     const toggleCustomVariableDetail = (transitionTypeIndex: number, customVariableIndex: number) => {
    //         formData.value.transitionTypes[transitionTypeIndex].customVariables[customVariableIndex].collapsed =
    //             !formData.value.transitionTypes[transitionTypeIndex].customVariables[customVariableIndex].collapsed;
    //     };

  
    const handleInput = (event: InputEvent) => {
      const inputElement = event.target as HTMLInputElement;
      try {
        const parsedJson = JSON.parse(inputElement.value);
        this.transitionType.customVariables = parsedJson;
      } catch (error) {
        // console.error('Invalid JSON format:', error);
      }
    }

  
        return {handleInput, extensions, toggleDetail, formData, handleSubmit, handleFileUpload, deleteExample,  addTransitionPlaceType,
      deleteTransitionPlaceType };
    },

    methods: {

      
    }
});
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.field.is-flex {
  display: flex;
  justify-content: space-between;
}

.field-group {
  flex-basis: calc(50% - 0.5rem); /* Adjust margin between fields */
}
</style>