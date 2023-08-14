<template>
    <div class="field">
        <label class="label is-small">Key
            <HelpButton help-text="
                Output key variables define the field of a selected object or position in a selected array, where the corresponding output value is inserted.
              " />


            <span @click="() => { uiStateStore.showEditor = 'key' }"
                class="icon is-small is-pulled-right has-text-grey-light is-clickable"><font-awesome-icon
                    icon="fas fa-up-right-from-square"></font-awesome-icon></span>
        </label>
        <div class="control is-small jsn-code">
            <Codemirror placeholder="Define key in Jsonnet" style="height: 50px" :indent-with-tab="true" :tab-size="2"
                :extensions="extensions"
                v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].keySnippet" />
        </div>
        <!-- todo: maybe add link to editor for more info -->
        <div v-if="transitionsStore.assignmentComplete && !transitionsStore.prefaceHasError">
            <p v-if="keyHasError" class="help is-danger">Key expression has errors.</p>
            <p v-if="!keyHasError" class="help">Result:
                <code class="has-text-grey has-tooltip-bottom" :data-tooltip="getFormattedString(keyEvaluation)">
                                {{ getShortString(keyEvaluation) }}
                            </code>
            </p>

        </div>

    </div>
    <div class="field">
        <label class="label is-small">Value
            <HelpButton help-text="
                Output value variables define the value that is inserted in the corresponding place.
              " />
            <span @click="() => { uiStateStore.showEditor = 'value' }"
                class="icon is-small is-pulled-right has-text-grey-light is-clickable"><font-awesome-icon
                    icon="fas fa-up-right-from-square"></font-awesome-icon></span>
        </label>
        <div class="control is-small jsn-code">
            <Codemirror placeholder="Define value in Jsonnet" style="height: 50px" :indent-with-tab="true" :tab-size="2"
                :extensions="extensions"
                v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].valueSnippet" />
        </div>
        <div v-if="transitionsStore.assignmentComplete && !transitionsStore.prefaceHasError">
            <p v-if="valueHasError" class="help is-danger">Value expression has errors.</p>
            <p v-if="!valueHasError" class="help">Result:
                <code class="has-text-grey has-tooltip-bottom" :data-tooltip="getFormattedString(valueEvaluation)">
                                {{ getShortString(valueEvaluation) }}
                            </code>
            </p>
        </div>


    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useUiStateStore } from '@/stores/uiState';
import { useTransitionsStore } from '@/stores/transition';

import { Codemirror } from 'vue-codemirror';
import { basicSetup } from 'codemirror';
import { EditorView } from "@codemirror/view";

import HelpButton from '../_shared/HelpButton.vue';

export default defineComponent({
    components: {
        Codemirror,
        HelpButton
    },
    setup() {
        const extensions = [basicSetup,
            EditorView.lineWrapping]

        return {
            extensions,
        }
    },
    computed: {

        ...mapStores(useTransitionsStore),
        ...mapStores(useUiStateStore),
        keyHasError() {
            const keyVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].keyVar
            return this.transitionsStore.keyEvaluationResults[keyVar].hasError
        },
        keyEvaluation() {
            const keyVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].keyVar
            return this.transitionsStore.keyEvaluationResults[keyVar].evaluation;

        },
        valueHasError() {
            const valueVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].valueVar
            return this.transitionsStore.valueEvaluationResults[valueVar].hasError

        },
        valueEvaluation() {
            const valueVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].valueVar
            return this.transitionsStore.valueEvaluationResults[valueVar].evaluation;
        }
    },
    watch: {
        'transitionsStore.outputArcs': {
            handler(newValue: string, oldValue: string) {
                console.log('saving output arcs')
                this.transitionsStore.saveOutputSnippets();

                this.transitionsStore.loadEvaluations();
            },
            deep: true
        }
    },
    methods: {
        getShortString(str: string) {
            if (str.length > 8) {
                return str.slice(0, 8) + "..."
            } else {
                return str
            }

        },
        getFormattedString(str: string) {
            return JSON.stringify(JSON.parse(str), null, 2);

        }
    }
})
</script>