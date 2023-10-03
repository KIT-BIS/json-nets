<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card scoped-modal jsn-modal-wide">
            <header class="modal-card-head">
                <span class="has-text-weight-bold">Expression Editor: {{ title }}</span>

                <p class="modal-card-title"></p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>

            <section class="modal-card-body">
                <div class="columns scoped-scrollable-outer">
                    <div class="column is-one-quarter scoped-scroll-container">
                        <aside class="menu is-small scoped-scrollable">
                            <p class="menu-label">
                                Variable Explorer
                            </p>


                            <ul class="menu-list">
                                <li>
                                    <a @click="() => { toggleActive('input') }">Input ({{ transitionsStore.inputArcs.length
                                    }} places)</a>
                                    <ul v-if="activeItems.includes('input')">
                                        <li v-for="(arc, index) in transitionsStore.inputArcs">
                                            <a @click="() => { toggleActive(arc.name) }">{{ arc.name }}</a>
                                            <ul v-if="activeItems.includes(arc.name)">
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.keyVar)"
                                                        @click="() => { insertVariableName(arc.keyVar) }">
                                                        <span class="has-text-weight-semibold">Key </span><br />
                                                        <span class="is-family-code">{{ arc.keyVar }}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.valueVar)"
                                                        @click="() => { insertVariableName(arc.valueVar) }">
                                                        <span class="has-text-weight-semibold">Value </span><br />
                                                        <span class="is-family-code">{{ arc.valueVar }}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.tokenVar)"
                                                        @click="() => { insertVariableName(arc.tokenVar) }">
                                                        <span class="has-text-weight-semibold">Token </span><br />
                                                        <span class="is-family-code">{{ arc.tokenVar }}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li><a @click="() => { toggleActive('output') }">Output ({{
                                    transitionsStore.outputArcs.length }} places)</a>
                                    <ul v-if="activeItems.includes('output')">
                                        <li v-for="(arc, index) in transitionsStore.outputArcs">
                                            <a @click="() => { toggleActive(arc.name) }">{{ arc.name }}</a>
                                            <ul v-if="activeItems.includes(arc.name)">
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.keyVar)"
                                                        @click="() => { insertVariableName(arc.keyVar) }">
                                                        <span class="has-text-weight-semibold">Key </span><br />
                                                        <span class="is-family-code">{{ arc.keyVar }}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.valueVar)"
                                                        @click="() => { insertVariableName(arc.valueVar) }">
                                                        <span class="has-text-weight-semibold">Value </span><br />
                                                        <span class="is-family-code">{{ arc.valueVar }}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="has-tooltip-bottom"
                                                        :data-tooltip="getVariableTooltip(arc.tokenVar)"
                                                        @click="() => { insertVariableName(arc.tokenVar) }">
                                                        <span class="has-text-weight-semibold">Token </span><br />
                                                        <span class="is-family-code">{{ arc.tokenVar }}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                        </aside>
                    </div>
                    <div class="column">

                        <div class="notification is-info is-light">
                            <div v-if="expandedExamples == false">
                                <div class="block">
                                    <span @click="expandExamples" class="icon is-clickable"><font-awesome-icon
                                            icon="fas fa-plus-circle" /></span>
                                    <span>Expand examples for {{ uiStateStore.showEditor }} expressions.</span>
                                </div>
                            </div>
                            <div v-else>

              <div class="block">
                <span @click="expandExamples" class="icon is-clickable"
                  ><font-awesome-icon icon="fas fa-minus-circle"
                /></span>
                    <span>Hide examples for {{ uiStateStore.showEditor }} expressions.</span>
              </div>

              <div class="block">
                <ExampleAccordion :examples="getCurrentExample"/>
              </div>
            
                            </div>
                        </div>
                        <div class="block">
                            <div class="field">
                                <label class="label is-small">Expression
                                    <HelpButton help-text="
                                 Expressions are written in 
                                <a href='https://jsonnet.org/' target='_blank'>
                                  Jsonnet
                                </a>. Click on variable names in the explorer to insert them at cursor position in the code.
                              " />


                                </label>
                                <div class="control is-small jsn-code">
                                    <Codemirror v-if="uiStateStore.showEditor === 'guard'" placeholder="Enter guard expression ..."
                                        style="height: 200px" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                        v-model="transitionsStore.transition.guard" 
                                        @ready="onEditorReady"
                                        />
                                    <Codemirror v-if="uiStateStore.showEditor === 'preface'" placeholder="Enter preface ..."
                                        style="height: 200px" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                        v-model="transitionsStore.transition.preface" 
                                        @ready="onEditorReady"
                                        />
                                    <Codemirror v-if="uiStateStore.showEditor === 'key'" placeholder="Enter output key expression ..."
                                        style="height: 200px" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                        v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].keySnippet" 
                                        @ready="onEditorReady"
                                        />
                                    <Codemirror v-if="uiStateStore.showEditor === 'value'" placeholder="Enter output value expression ..."
                                        style="height: 200px" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                        v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].valueSnippet" 
                                        @ready="onEditorReady"
                                        />
                                </div>

                            </div>
                        </div>
                        <div class="block" v-if="transitionsStore.assignmentComplete">
                            <div v-if="uiStateStore.showEditor == 'guard'" class="field">
                                <label class="label is-small">
                                    Evaluation
                                </label>
                                <div v-if="transitionsStore.prefaceHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    Fix errors in preface to see evaluations.
                                </div>
                                <div v-if="transitionsStore.hasAnyOutputError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    Fix errors in output expressions to see evaluations.
                                </div>
                                <div v-else-if="!transitionsStore.guardHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-success"
                                    style="height: 200px">
                                    <span>{{ JSON.stringify(JSON.parse(transitionsStore.guardEvaluation), null, 2) }}</span>
                                </div>
                                <div v-else-if="transitionsStore.guardHasError"
                                    class="notification is-small jsn-code json-code-font is-light is-danger"
                                    style="height: 200px">
                                    <span>{{ transitionsStore.guardEvaluation }}</span>
                                </div>
                            </div>
                            <div v-if="uiStateStore.showEditor == 'preface'" class="field">
                                <label class="label is-small">
                                    Evaluation
                                </label>
                                <div v-if="!transitionsStore.prefaceHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-success"
                                    style="height: 200px">
                                    <span>Preface seems to be fine.</span>
                                </div>
                                <div v-if="transitionsStore.prefaceHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    <span>Preface results in an error.</span>
                                </div>
                            </div>
                            <div v-if="uiStateStore.showEditor == 'key'" class="field">
                                <label class="label is-small">
                                    Evaluation
                                </label>
                                <div v-if="transitionsStore.prefaceHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    Fix errors in preface to see evaluations.
                                </div>
                                <div v-else-if="!keyHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-success"
                                    style="height: 200px">
                                    <span>{{ keyEvaluation }}</span>
                                </div>
                                <div v-else-if="keyHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    <span>{{ keyEvaluation }}</span>
                                </div>
                            </div>
                            <div v-if="uiStateStore.showEditor == 'value'" class="field">
                                <label class="label is-small">
                                    Evaluation
                                </label>
                                <div v-if="transitionsStore.prefaceHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    Fix errors in preface to see evaluations.
                                </div>
                                <div v-else-if="!valueHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-success"
                                    style="height: 200px">
                                    <span>{{ valueEvaluation }}</span>
                                </div>
                                <div v-else-if="valueHasError"
                                    class="notification is-small jsn-code jsn-code-font is-light is-danger"
                                    style="height: 200px">
                                    <span>{{ valueEvaluation }}</span>
                                </div>
                            </div>

                        </div>
                        <div v-if="!transitionsStore.assignmentComplete" class="block">
                            <div class="notification is-warning is-light is-size-7">
                                Select a value for each input and output place to see expression evaluations.
                            </div>
                        </div>
                        <!-- show values on variable hover -->
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script lang="ts">
import type { ViewUpdate } from "@codemirror/view";

import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { shallowRef } from 'vue'
import { useUiStateStore } from '@/stores/uiState';
import { useTransitionsStore } from '@/stores/transition';

import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror';

import HelpButton from '@/components/_shared/HelpButton.vue';
import ExampleAccordion from "@/components/TransitionModal/ExampleAccordion.vue";

import { examples as guardExamples } from '@/components/TransitionModal/GuardExamples'
import { examples as valueExamples } from '@/components/TransitionModal/ValueExamples'
import { examples as keyExamples } from '@/components/TransitionModal/KeyExamples'
import { examples as prefaceExamples } from '@/components/TransitionModal/PrefaceExamples'

export default defineComponent({
    components: {
        Codemirror,
        HelpButton,
        ExampleAccordion
    },
    setup() {
        const extensions = [basicSetup]
        const view = shallowRef();
        return {
            view,
            extensions,
        }
    },
    computed: {
        getCurrentExample(): { question: string, answer: string, evaluation: any, isExpanded: boolean}[] {
            if (this.uiStateStore.showEditor === 'guard') {
                return this.guardExamples.jsonnet
            } else if (this.uiStateStore.showEditor === 'value') {
                return this.valueExamples.jsonnet
            } else if (this.uiStateStore.showEditor === 'key') {
                return this.keyExamples.jsonnet
            } else {
                return this.prefaceExamples.jsonnet
            }
        },
        title(): string {
            if (this.uiStateStore.showEditor === 'guard') {
                return this.transitionsStore.transition.name + ' guard'
            } else if (this.uiStateStore.showEditor === 'preface') {
                return this.transitionsStore.transition.name + ' preface'
            } else if (this.uiStateStore.showEditor === 'key') {
                const arc = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex]
                return arc.name + ' key'
            } else if (this.uiStateStore.showEditor === 'value') {
                const arc = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex]
                return arc.name + ' value'
            }
            return '';
        },
        keyHasError():boolean {
            const keyVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].keyVar
            return this.transitionsStore.keyEvaluationResults[keyVar].hasError
        },
        keyEvaluation():string {
            const keyVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].keyVar
            return this.transitionsStore.keyEvaluationResults[keyVar].evaluation;

        },
        valueHasError():boolean {
            const valueVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].valueVar
            return this.transitionsStore.valueEvaluationResults[valueVar].hasError

        },
        valueEvaluation():string {
            const valueVar = this.transitionsStore.outputArcs[this.transitionsStore.selectedOutputSnippetIndex].valueVar
            return this.transitionsStore.valueEvaluationResults[valueVar].evaluation;
        },

        ...mapStores(useUiStateStore),
        ...mapStores(useTransitionsStore)
    },
    data() {
        return {
            activeItems: [] as Array<string>,
            expandedExamples: false,
            guardExamples,
            keyExamples,
            valueExamples,
            prefaceExamples
        }
    },
    methods: {
        getVariableTooltip(varName: string) {
            if (this.transitionsStore.variables[varName] !== undefined) {
                return JSON.stringify(this.transitionsStore.variables[varName], null, 2);
            } else {
                return "Variable has no value assigned.";
            }
        },

        expandExamples() {
            this.expandedExamples = !this.expandedExamples;
        },
        toggleActive(item: string) {
            if (this.activeItems.includes(item)) {
                this.activeItems.splice(this.activeItems.indexOf(item), 1);
            } else {
                this.activeItems.push(item)
            }
        },
        close() {
            this.uiStateStore.showEditor = 'none';
        },
        onEditorReady(payload: any) {
            this.view = payload.view;
        },
        insertVariableName(varName: string) {
            const ranges = this.view.state.selection.ranges;
            const cursor = ranges[0].anchor;

            this.view.dispatch({
                changes: { from: cursor, insert: varName }
            })
        },

    }
})
</script>
<style scoped>.scoped-modal {
    height: 70%;
}

.scoped-scrollable-outer {
    height: 100%;
}

.scoped-scroll-container {
    height: 100%
}

.scoped-scrollable {
    height: 100%;
    overflow: auto;
}</style>./TransitionModal/GuardExamples./TransitionModal/ValueExamples