<template>
    <div class="modal is-active scoped-modal">
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
                            <span class="scoped-edit-button icon has-text-grey-light"><font-awesome-icon icon="fas fa-pen" /></span>
                        </span>
                        <span v-if="showNameInput" class="level">
                            <input style="width: 100px" class="input is-small level-item"
                                v-model="transitionsStore.transition.name" />
                            <button class="ml-1 button is-small level-item" @click="cancelNameEdit">
                                <span class="icon is-small has-text-grey"><font-awesome-icon icon="fas fa-xmark" /></span>
                            </button>
                            <button @click="saveName" class="ml-1 button is-small level-item is-primary">
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

                                <span @click="openExpressionEditor"
                                    class="icon is-small is-pulled-right has-text-grey-light is-clickable">
                                    <font-awesome-icon icon="fas fa-up-right-from-square"></font-awesome-icon>
                                </span>
                            </label>
                            <div class="control is-small jsn-code">
                                <Codemirror placeholder="Define preface in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                    @update="onCodeUpdate" v-model="transitionsStore.transition.preface" />
                            </div>

                            <!-- :autofocus="true" -->
                        </div>
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Output Expressions
                            </label>
                            <div v-if="transitionsStore.outputArcs.length > 0" class="select is-small">
                                <select v-model="transitionsStore.selectedOutputSnippetIndex">
                                    <option :value="-1" selected disabled>Select output place</option>
                                    <option v-for="(arc, index) in transitionsStore.outputArcs" :value="index">{{ arc.name }}
                                    </option>
                                </select>
                            </div>
                            <div v-else class="notification is-info is-light is-size-7">Transition has no output places.</div>
                        </div>
                        <SnippetInput v-if="transitionsStore.selectedOutputSnippetIndex !== -1" />
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Guard Expression
                                <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small jsn-code">
                                <Codemirror placeholder="Define guard in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                    @update="onCodeUpdate" v-model="transitionsStore.transition.guard" />
                            </div>

                        </div>
                    </div>

                </section>
                <footer class="modal-card-foot">
                    <button class="button is-pulled-right is-danger is-small" style="margin-left: auto"
                        @click="">Fire!</button>
                </footer>

            </div>
            <PostsetFilter />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { mapStores } from 'pinia';
import { useTransitionStateStore } from '@/stores/transitionState';
import { useUiStateStore } from '@/stores/uiState';
import { Net } from '@/json-nets/Net';
import { useTransitionsStore } from '@/stores/transitions';
import SnippetInput from './SnippetInput.vue';
import PresetFilter from './PresetFilter.vue';
import PostsetFilter from './PostsetFilter.vue';

export default defineComponent({
    components: {
        Codemirror,
        VueJsonPretty,
        SnippetInput,
        PostsetFilter,
        PresetFilter,
    },
    setup() {
        const extensions = [basicSetup]

        return {
            extensions,
        }

    },
    data() {
        let json = { "status": 200, "text": "", "error": null, "data": [{ "news_id": 51184, "title": "iPhone X Review: Innovative future with real black technology", "source": "Netease phone" }, { "news_id": 51183, "title": "Traffic paradise: How to design streets for people and unmanned vehicles in the future?", "source": "Netease smart", "link": "http://netease.smart/traffic-paradise/1235" }, { "news_id": 51182, "title": "Teslamask's American Business Relations: The government does not pay billions to build factories", "source": "AI Finance", "members": ["Daniel", "Mike", "John"] }] };
        let selected = 'root.data.0'
        return {
            json,
            selected,
            showNameInput: false
        }
    },
    computed: {
        // ...mapStores(useTransitionStateStore),
        ...mapStores(useUiStateStore),
        ...mapStores(useTransitionsStore)
    },
    created() {
        // const transition = this.net.findTransition(this.uiStateStore.lastSelectedID)
        // if (!transition) return;
        // this.transitionStateStore.name = transition.name;
        this.transitionsStore.setTransition(this.uiStateStore.lastSelectedID);
    },
    methods: {
        cancelNameEdit() {
            // const transition = this.net.findTransition(this.uiStateStore.lastSelectedID)
            // if (!transition) return;

            // this.transitionsStore.transition.name = transition.name;
            this.transitionsStore.resetName();
            this.showNameInput = false;
        },
        saveName() {
            // this.net.updateTransition(this.uiStateStore.lastSelectedID, this.transitionStateStore.name)
            this.transitionsStore.saveName();
            this.showNameInput = false;
        },
        close() {
            this.uiStateStore.showModal = 'none';
        },
        onCodeUpdate(update: any) { // for the love of me, I can't figure out how to import the codemirror ViewUpdate type
            if (update.changedRanges.length === 0) {
                return;
            } else { // working on the assumption that text changes always change changedRanges (@change doesn't catch text cut)
                this.transitionsStore.saveBasicInscription();
            }
        },
        onChange() {
            console.log('change')
        },
        openExpressionEditor() {
            this.uiStateStore.showExpressionEditor = true;
        }

        // createNode(node) {
        // console.log(node)
        // return h('span', { innerHTML: 'hello'})

        // }
    }

})
</script>
<style scoped>




.scoped-modal {
    /* flex-direction: row; */
}

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