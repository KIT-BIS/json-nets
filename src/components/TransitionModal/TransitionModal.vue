<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="scoped-modal-container">
            <PresetFilter />
            <div class="modal-card scoped-modal-center">
                <header class="modal-card-head">
                    <span class="has-text-weight-bold">Transition:</span>
                    <span class="ml-1">
                        <span v-if="!showNameInput"
                            class=" is-ghost icon-text has-text-weight-bold scoped-modal-title is-clickable"
                            @click="showNameInput = true">
                            <span>{{ transitionsStore.transition.name }}</span>
                            <span class="scoped-edit-button icon has-text-grey-light"><font-awesome-icon
                                    icon="fas fa-pen" /></span>
                        </span>
                        <span v-if="showNameInput" class="level">
                            <input style="width: 100px" class="input is-small level-item"
                                v-model="transitionsStore.transition.name" />
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
                <section class="modal-card-body">
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Preface
                                <HelpButton help-text="
                                Preface is evaluated before any output expression or guard. Use it to define custom variables and functions.
                              " />

                                <span @click="() => { uiStateStore.showEditor = 'preface' }"
                                    class="icon is-small is-pulled-right has-text-grey-light is-clickable">
                                    <font-awesome-icon icon="fas fa-up-right-from-square"></font-awesome-icon>
                                </span>
                            </label>
                            <div class="control is-small jsn-code">
                                <Codemirror placeholder="Define preface in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                    v-model="transitionsStore.transition.preface" />
                            </div>
                            <p v-if="transitionsStore.prefaceHasError" class="help is-danger">
                                Expression has errors. Use preface only for variable and function definitions.</p>
                        </div>
                    </div>
                    <hr />
                    <div v-if="transitionsStore.outputArcs.length > 0" class="block">
                        <div class="field">
                            <label class="label is-small">Output Expressions

                            </label>
                            <div class="select is-small">
                                <select v-model="transitionsStore.selectedOutputSnippetIndex">
                                    <option :value="-1" selected disabled>Select output place</option>
                                    <option v-for="(arc, index) in transitionsStore.outputArcs" :value="index">{{ arc.name
                                    }}
                                    </option>
                                </select>

                            </div>

                            <p v-if="transitionsStore.hasAnyOutputError" class="help is-danger">Some output expressions have
                                errors.</p>
                        </div>
                        <SnippetInput v-if="transitionsStore.selectedOutputSnippetIndex !== -1" />

                    </div>
                    <div v-else class="block">
                        <div class="notification is-info is-light is-size-7">Transition has no output places.</div>
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Guard Expression
                                <HelpButton help-text="
                                The guard is a function that evaluates to true or false. Use it to describe rules when the transition is enabled.
                              " />

                                <span @click="() => { uiStateStore.showEditor = 'guard' }"
                                    class="icon is-small is-pulled-right has-text-grey-light is-clickable"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small jsn-code">
                                <Codemirror placeholder="Define guard in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                    v-model="transitionsStore.transition.guard" />
                            </div>
                            <div
                                v-if="transitionsStore.assignmentComplete && !transitionsStore.prefaceHasError && !transitionsStore.hasAnyError">
                                <p v-if="transitionsStore.guardHasError" class="help is-danger">Guard expression has errors.
                                </p>
                                <p v-if="!transitionsStore.guardHasError" class="help">Result:
                                    <code class="has-text-grey has-tooltip-bottom"
                                        :data-tooltip="getFormattedString(transitionsStore.guardEvaluation)">
                                                        {{ getShortString(transitionsStore.guardEvaluation) }}
                                                    </code>
                                </p>
                            </div>

                        </div>
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Settings</label>
                            <div class="control">
                                <div class="field">
                                    <input @click="transitionsStore.switchMode()"
                                        id="readonly-switch" type="checkbox" name="readonly-switch"
                                        class="switch is-rtl is-small" :checked="transitionsStore.transition.readonly">
                                    <label for="readonly-switch">Only read input values</label>
                                </div>
                                <!-- <input id="filter-read-setting" type="checkbox" name="filter-read-setting" -->
                                <!-- class="switch is-rounded is-outlined is-rtl is-small" checked> -->
                            </div>
                        </div>
                    </div>
                    <div v-if="!transitionsStore.assignmentComplete" class="block">
                        <div class="notification is-warning is-light is-size-7">
                            Select a value for each input and output place to see expression evaluations.
                        </div>
                    </div>
                    <div v-else-if="transitionsStore.hasAnyError" class="block">
                        <div class="notification is-danger is-light is-size-7">
                            The transition inscription has errors.
                        </div>
                    </div>
                    <div v-else-if="!transitionsStore.isEnabled" class="block">
                        <div class="notification is-warning is-light is-size-7">
                            The transition can't fire with selected values.
                        </div>
                    </div>
                    <div v-else-if="transitionsStore.isEnabled" class="block">
                        <div class="notification is-success is-light is-size-7">
                            The transition can fire with selected values.
                        </div>
                    </div>

                </section>
                <footer class="modal-card-foot">
                    <button class="button is-pulled-right is-danger is-small" :disabled="!transitionsStore.isEnabled"
                        style="margin-left: auto" @click="onFireClick">Fire!</button>
                </footer>

            </div>
            <PostsetFilter />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia';

import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror';

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { useUiStateStore } from '@/stores/uiState';
import { useTransitionsStore } from '@/stores/transition';

import SnippetInput from './SnippetInput.vue';
import PresetFilter from './PresetFilter.vue';
import PostsetFilter from './PostsetFilter.vue';
import HelpButton from '../_shared/HelpButton.vue';

export default defineComponent({
    components: {
        Codemirror,
        VueJsonPretty,
        SnippetInput,
        PostsetFilter,
        PresetFilter,
        HelpButton,
    },
    setup() {
        const extensions = [basicSetup]

        return {
            extensions,
        }
    },
    data() {
        return {
            showNameInput: false
        }
    },
    computed: {
        ...mapStores(useUiStateStore),
        ...mapStores(useTransitionsStore)
    },
    created() {
        this.transitionsStore.initSettings();
        this.transitionsStore.loadTransition(this.uiStateStore.lastSelectedID);
    },
    watch: {
        'transitionsStore.transition.guard'(newValue: string) {
            this.transitionsStore.saveBasicInscription();
            this.transitionsStore.loadEvaluations();
        },
        'transitionsStore.transition.preface'(newValue: string) {
            this.transitionsStore.saveBasicInscription();
            this.transitionsStore.loadEvaluations();
        }
    },
    methods: {
        onCancelNameEdit() {
            this.transitionsStore.resetName();
            this.showNameInput = false;
        },
        onNameSave() {
            this.transitionsStore.saveName();
            this.showNameInput = false;
        },
        close() {
            this.uiStateStore.showModal = 'none';
            this.transitionsStore.unsetAssignments();
        },
        onFireClick() {
            if (this.transitionsStore.isEnabled) {
                this.transitionsStore.fireCurrentTransition()
            }
        },
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
<style scoped>
.scoped-modal-container {
    width: 90%;
    display: flex;
    height: 90%;
    align-items: center;
}

.scoped-modal-center {
    height: 100%;
    width: 40%;
}

.scoped-modal-center {
    border-radius: 0.25rem;
}

.scoped-edit-button {
    display: none;
}

.scoped-modal-title:hover>.scoped-edit-button,
.scoped-edit-button:hover {
    display: inline-block;
}
</style>