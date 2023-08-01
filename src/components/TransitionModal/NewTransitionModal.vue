<template>
    <div class="modal is-active scoped-modal">
        <div class="modal-background"></div>
        <div class="scoped-modal-container">
            <div class="card scoped-modal-side has-background-light scoped-modal-left">
                <section class="m-5 scoped-scrollable-container">
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item">
                                <div class="field has-addons">
                                    <p class="control">
                                        <a class="button is-static is-small">
                                            Input
                                        </a>
                                    </p>
                                    <p class="control">
                                        <span class="select is-small">
                                            <select>
                                                <option>Component</option>
                                                <option>Order</option>
                                                <option>Order</option>
                                                <option>Order</option>
                                                <option>Order</option>
                                                <option>Order</option>
                                            </select>
                                        </span>
                                    </p>

                                </div>
                            </div>
                            <div class="level-item">
                                <button class="button is-small is-ghost">
                                    <span class="icon is-small has-text-grey-light"><font-awesome-icon
                                            icon="fas fa-filter"></font-awesome-icon>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <span class="icon is-small has-text-danger"><font-awesome-icon
                                        icon="fas fa-triangle-exclamation"></font-awesome-icon>
                                </span>

                            </div>
                        </div>


                    </div>
                    <div class="mt-3 mb-3 has-text-grey">
                        2 selectable values
                    </div>
                    <div class="block scoped-scrollable scoped-code p-2">
                        <vue-json-pretty :data="json" @node-click="(node) => { console.log(node) }"
                            :selected-value="selected" selectable-type="single" :show-select-controller="true"
                            :node-selectable="(node) => { if (node.path === 'root.data[0]' || node.path === 'root.data[1]') { return true } else { return false } }"
                            :show-icon="true" />

                        <!-- :virtual="true" -->
                        <!-- :render-node-value="({node, defaultValue}) => { return createNode(node)}" -->
                    </div>
                </section>
            </div>
            <div class="modal-card scoped-modal-center">
                <header class="modal-card-head">
                    <span class="has-text-weight-bold">Transition:</span>
                        <span class="ml-1">
                            <span v-if="!showNameInput"
                                class=" is-ghost icon-text has-text-weight-bold scoped-modal-title is-clickable" 
                                @click="showNameInput = true"
                                >
                                <span>{{ transitionStateStore.name }}</span>
                                <span class="scoped-edit-button icon has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-pen" /></span>
                            </span>
                            <span v-if="showNameInput" class="level">
                            <input style="width: 100px" class="input is-small level-item" v-model="transitionStateStore.name"/>
                            <button class="ml-1 button is-small level-item"
                                @click="cancelNameEdit">Cancel</button>
                            <button @click="saveName" class="ml-1 button is-small level-item is-primary">Save</button>
                            </span>
                        </span>
                    <p class="modal-card-title"></p>
                    <button class="delete" aria-label="close" @click="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Preface

                                <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small scoped-code">
                                <Codemirror placeholder="Define preface in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @update="onUpdate" @change="onChange"/>
                            </div>

                            <!-- :autofocus="true" -->
                        </div>
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Output Expressions
                            </label>
                            <div class="select is-small">
                                <select>
                                    <option>Component</option>
                                    <option>Order</option>
                                    <option>Order</option>
                                    <option>Order</option>
                                    <option>Order</option>
                                    <option>Order</option>
                                </select>
                            </div>

                        </div>

                        <div class="field">
                            <label class="label is-small">Key
                                <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small scoped-code">
                                <Codemirror placeholder="Define key in Jsonnet" style="height: 50px" :indent-with-tab="true"
                                    :tab-size="2" :extensions="extensions" />
                            </div>


                        </div>
                        <div class="field">
                            <label class="label is-small">Value
                                <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small scoped-code">
                                <Codemirror placeholder="Define value in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" />
                            </div>


                        </div>
                    </div>
                    <hr />
                    <div class="block">
                        <div class="field">
                            <label class="label is-small">Guard Expression
                                <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                                        icon="fas fa-up-right-from-square"></font-awesome-icon></span>
                            </label>
                            <div class="control is-small scoped-code">
                                <Codemirror placeholder="Define guard in Jsonnet" style="height: 50px"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" />
                            </div>

                        </div>
                    </div>

                </section>
                <footer class="modal-card-foot">
                    <button class="button is-pulled-right is-danger is-small" style="margin-left: auto"
                        @click="">Fire!</button>
                </footer>

            </div>
            <div class="card scoped-modal-side has-background-light scoped-modal-right">
                <section class="m-5 scoped-scrollable-container">
                    <div class="">
                        <div class="field has-addons">
                            <p class="control">
                                <a class="button is-static is-small">
                                    Output
                                </a>
                            </p>
                            <p class="control">
                                <span class="select is-small">
                                    <select>
                                        <option>Component</option>
                                        <option>Order</option>
                                        <option>Order</option>
                                        <option>Order</option>
                                        <option>Order</option>
                                        <option>Order</option>
                                    </select>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="mt-3 mb-3 has-text-grey">
                        2 selectable values
                    </div>
                    <div class="block scoped-scrollable scoped-code p-2">
                        <vue-json-pretty :data="json" @node-click="(node) => { console.log(node) }"
                            :selected-value="selected" selectable-type="single" :show-select-controller="true"
                            :node-selectable="(node) => { if (node.path === 'root.data[0]' || node.path === 'root.data[1]') { return true } else { return false } }"
                            :show-icon="true" />

                        <!-- :virtual="true" -->
                        <!-- :render-node-value="({node, defaultValue}) => { return createNode(node)}" -->
                    </div>
                </section>

            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { h } from 'vue';
import { mapStores } from 'pinia';
import { useTransitionStateStore } from '@/stores/transitionState';
import { useUiStateStore } from '@/stores/uiState';
import { Net } from '@/json-nets/Net';

export default defineComponent({
    components: {
        Codemirror,
        VueJsonPretty
    },
    props: {
        net: {
            type: Net,
            required: true
        }
    },
    setup() {
        const extensions = [basicSetup]

        return {
            extensions,
        }

    },
    data() {
        let json = { "status": 200, "text": "", "error": null, "data": [{ "news_id": 51184, "title": "iPhone X Review: Innovative future with real black technology", "source": "Netease phone" }, { "news_id": 51183, "title": "Traffic paradise: How to design streets for people and unmanned vehicles in the future?", "source": "Netease smart", "link": "http://netease.smart/traffic-paradise/1235" }, { "news_id": 51182, "title": "Teslamask's American Business Relations: The government does not pay billions to build factories", "source": "AI Finance", "members": ["Daniel", "Mike", "John"] }] };
        let selected = 'root.data[0]'
        return {
            json,
            selected,
            showNameInput: false
        }
    },
    computed: {
        ...mapStores(useTransitionStateStore),
        ...mapStores(useUiStateStore)
    },
    created() {
        const transition = this.net.findTransition(this.uiStateStore.lastSelectedID)
        if (!transition) return;

        this.transitionStateStore.name = transition.name;
    },
    methods: {
        cancelNameEdit() {
            const transition = this.net.findTransition(this.uiStateStore.lastSelectedID)
            if (!transition) return;

            this.transitionStateStore.name = transition.name;
            this.showNameInput = false;
        },
        saveName() {
            this.net.updateTransition(this.uiStateStore.lastSelectedID, this.transitionStateStore.name)

            this.showNameInput = false;
        },
        close() {
            this.uiStateStore.showModal = 'none';
        },
        onUpdate(update){
            console.log('update')
            console.log(update)
        },
        onChange() {
            console.log('change')
        }
        // createNode(node) {
        // console.log(node)
        // return h('span', { innerHTML: 'hello'})

        // }
    }

})
</script>
<style scoped>
.scoped-scrollable-container {
    height: 100%;
}

.scoped-scrollable {
    overflow-y: auto;
    overflow-x: auto;
    height: 80%;
}

.scoped-code {
    border: 1px solid hsl(0, 0%, 86%);
    border-radius: 4px
}

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

.scoped-modal-side {
    width: 30%;
    height: 80%;
}

.scoped-modal-right {
    border-radius: 0 0.25rem 0.25rem 0;
}

.scoped-modal-center {
    border-radius: 0.25rem;
}

.scoped-modal-left {
    border-radius: 0.25rem 0 0 0.25rem;
}

.scoped-edit-button {
    display: none;
}

.scoped-modal-title:hover>.scoped-edit-button,
.scoped-edit-button:hover {
    display: inline-block;
}
</style>