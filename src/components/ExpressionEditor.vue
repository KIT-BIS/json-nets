<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card scoped-modal-center jsn-modal-wide">
            <header class="modal-card-head">
                <span class="has-text-weight-bold">Expression Editor</span>

                <p class="modal-card-title"></p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>

            <section class="modal-card-body">
                <div class="columns">
                    <div class="column is-one-quarter">
                <aside class="menu">
                    <p class="menu-label">
                        Variable Explorer
                    </p>
                    <ul class="menu-list">
                        <li>
                            <a>Input</a>
                            <ul>
                                <li>
                                    <a>Place 1</a>
                                    <ul>
                                        <li>
                                            <a><span class="has-text-weight-semibold">Key </span><br />
                                                <span class="is-family-code is-small">input_place1_key</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a><span class="has-text-weight-semibold">Value </span><br />
                                                <span class="is-family-code is-small">input_place1_value</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a><span class="has-text-weight-semibold">Token </span><br />
                                                <span class="is-family-code is-small">input_place1_token</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li><a>Place 2</a></li>
                            </ul>
                        </li>
                        <li><a>Output</a></li>
                    </ul>

                </aside>
                </div>
                <div class="column">
                    <div class="jsn-code">
                    <Codemirror 
                        placeholder="Code" style="height: 300px"
                        :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                        />
                    </div>

                    <div class="jsn-code mt-3">
                        TODO: evaluation should show no code on error, just an error message
                        add titles (as in n8n)
                        show values on variable hover
                    <Codemirror 
                        placeholder="Evaluation" style="height: 300px"
                        :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                        />
                    </div>

                </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror';


export default defineComponent({
    components: {
        Codemirror
    },
    computed: {
        ...mapStores(useUiStateStore)
    },
    setup() {
        const extensions = [basicSetup]

        return {
            extensions,
        }

    },

    data() {
        return {
            dataModel: [
                {
                    id: "variables",
                    label: "Variables",
                    children: [
                        {
                            id: "input",
                            label: "Input",
                            children: [
                                {
                                    'id': 'place1',
                                    'label': 'Place 1',
                                    'children': [
                                        {
                                            'id': 'place1key',
                                            'label': 'key'
                                        }
                                    ]
                                }
                            ]
                        },
                        { id: "node2", label: "Second Child" }
                    ]
                }
            ]
        }
    },
    methods: {
        close() {
            this.uiStateStore.showExpressionEditor = false;
        }
    }
})
</script>