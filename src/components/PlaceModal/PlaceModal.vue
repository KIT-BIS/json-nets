<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head scoped-modal-header">
                <span class="has-text-weight-bold">Place:</span>
                <span class="ml-1">
                    <span v-if="!showNameInput"
                        class=" is-ghost icon-text has-text-weight-bold scoped-modal-title is-clickable"
                        @click="showNameInput = true">
                        <span>{{ placesStore.place.name }}</span>
                        <span class="scoped-edit-button icon has-text-grey-light"><font-awesome-icon
                                icon="fas fa-pen" /></span>
                    </span>
                    <span v-if="showNameInput" class="level">
                        <input style="width: 100px" class="input is-small level-item" v-model="placesStore.place.name" />
                        <button class="ml-1 button is-small level-item" @click="onCancelNameEdit">
                            <span class="icon is-small has-text-grey"><font-awesome-icon icon="fas fa-xmark" /></span>
                        </button>
                        <button @click="onNameSave" class="ml-1 button is-small level-item is-primary">
                            <span class="icon is-small"><font-awesome-icon icon="fas fa-check" /></span>
                        </button>
                    </span>
                </span>
                <p class="modal-card-title"></p>
                <button class="delete" aria-label="close" @click="close"></button>

            </header>
            <div class="tabs is-left is-small has-background-light mb-0">
                <ul>
                    <li :class="{ 'is-active': shownTab === 'data' }"><a @click="() => { showTab('data') }">Data</a></li>
                    <li :class="{ 'is-active': shownTab === 'schema' }"><a @click="() => { showTab('schema') }">Schema</a>
                    </li>
                </ul>
            </div>

            <section class="modal-card-body">
                <DataTab v-if="shownTab === 'data'"  />
                <!-- :schema="placesStore.place.schema" /> -->

                <div v-if="shownTab === 'schema'" class="block">
                    <div class="field">
                        <label class="label is-small icon-text">Token schema
                            <HelpButton help-text="
                          Describe the structure of data tokens stored in the place with 
                          <a href='https://json-schema.org/' target='_blank'>JSON Schema</a>.
                        " />

                        </label>
                        <div class="control is-small jsn-code">
                            <Codemirror v-model="placesStore.schemaString" placeholder="Edit place schema."
                                :autofocus="true" :indent-with-tab="true" :tab-size="2" :style="{ height: '400px' }"
                                :extensions="extensions" />
                            <!-- @change="onSchemaCodeChange" -->
                        </div>
                        <p class="help" v-if="!placesStore.place.hasError">
                            {{ placesStore.place.errorMessage }}
                        </p>
                        <p class="help is-danger"
                            v-if="placesStore.place.hasError && placesStore.place.errorType === 'schema'">
                            {{ placesStore.place.errorMessage }}
                        </p>

                    </div>
                </div>




                <!-- @update="onMarkingCodeUpdate" -->

            </section>

            <footer v-if="uiStateStore.isScope3" class="modal-card-foot">
                <button class="button is-pulled-right is-primary is-small" 
                        style="margin-left: auto" @click="publish()">Publish</button>
            </footer>
        </div>
    </div>
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState';
import { usePlacesStore } from '@/stores/place';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { jsonSchema } from "codemirror-json-schema";
import { basicSetup } from 'codemirror';
import type { JSONSchema7 } from "json-schema";
import { EditorState } from "@codemirror/state";
import { gutter, EditorView, lineNumbers } from "@codemirror/view";
import { history } from "@codemirror/commands";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle, oneDark } from "@codemirror/theme-one-dark";
import type { ViewUpdate } from "@codemirror/view";
import DataEditor from './DataEditor.vue'
import JSONSchema from "@json-schema-tools/meta-schema"
import HelpButton from '@/components/_shared/HelpButton.vue'
import { getCurrentInstance } from 'vue';
import DataTab from './DataTab.vue';

const schema: JSONSchema7 = {
    type: "object",
    properties: {
        example: {
            type: "string",
        },
    },
};

export default defineComponent({
    components: {
    Codemirror,
    DataEditor,
    HelpButton,
    DataTab
},
    setup(props) {
        const extensions = [
            gutter({ class: "CodeMirror-lint-markers" }),
            bracketMatching(),
            basicSetup,
            closeBrackets(),
            history(),
            autocompletion(),
            lineNumbers(),
            lintGutter(),
            EditorView.lineWrapping,
            EditorState.tabSize.of(2),
            syntaxHighlighting(oneDarkHighlightStyle),
            jsonSchema(JSONSchema),
        ]

        return {
            extensions,
        }
    },
    data() {
        return {
            shownTab: 'data' as 'data' | 'schema',
            showNameInput: false,
            // TODO: should be in general configuration store
            // isScope3: true
        }
    },
    computed: {
        ...mapStores(useUiStateStore),
        ...mapStores(usePlacesStore)
    },
    created() {
        this.placesStore.loadPlace(this.uiStateStore.lastSelectedID);
    },
    watch: {
        'placesStore.schemaString'(newValue: string) {
            console.log('on my watch')
            console.log(newValue)
            this.placesStore.savePlaceSchema(newValue);
            // this.$forceUpdate();
        }
    },
    methods: {
        close() {
            this.uiStateStore.showModal = 'none';
        },
        onCancelNameEdit() {
            this.placesStore.resetName();
            this.showNameInput = false;

        },
        onNameSave() {
            this.placesStore.saveName();
            this.showNameInput = false;
        },

        showTab(tab: 'data' | 'schema') {
            this.shownTab = tab;
        },
        async publish() {
            if (this.uiStateStore.databaseID === '') {
                await fetch('http://localhost:3030/footprints', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: this.placesStore.place.name, marking: this.placesStore.place.marking})
                }).then(response => response.json()).then(data => { console.log(data); this.uiStateStore.databaseID = data._id; })
            } else {
                console.log('patching')
                console.log(this.uiStateStore.databaseID)
                await fetch('http://localhost:3030/footprints/' + this.uiStateStore.databaseID, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: this.placesStore.place.name, marking: this.placesStore.place.marking})
                }).then(response => response.json()).then(data => { console.log(data); console.log('patched'); })
            }


        }
    }
})
</script>
<style scoped>
.scoped-modal-footer {
    border-top: none;
}

.scoped-modal-header {
    border-bottom: none;
}

.scoped-edit-button {
    display: none;
}

.scoped-modal-title:hover>.scoped-edit-button,
.scoped-edit-button:hover {
    display: inline-block;
}
</style>@/stores/place