<template>
    <div class="card scoped-modal-side has-background-light scoped-modal-left">
        <section class="m-5 scoped-scrollable-outer">
            <div class="scoped-scrollable-container" v-if="transitionsStore.inputArcs.length > 0">
                <div class="level mb-4">
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
                                        <select v-model="transitionsStore.selectedInputPlaceIndex"
                                            @change="onInputPlaceSelect">
                                            <option v-for="(arc, index) in transitionsStore.inputArcs" :value="index">{{
                                                arc.name }}</option>
                                        </select>
                                    </span>
                                </p>

                            </div>
                        </div>
                    </div>
                    <div v-if="!transitionsStore.presetAssignmentComplete" class="level-right">
                        <div class="level-item">
                            <span class="icon is-small has-text-warning is-clickable mr-2 has-tooltip-bottom"
                                data-tooltip="Some places have unselected values.">
                                <font-awesome-icon icon="fas fa-triangle-exclamation"></font-awesome-icon>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="level mb-4">
                    <div class="level-left">
                        <div v-if="!showFilterInput" class="level-item">
                            <span class="icon-text is-clickable" @click="showFilterInput = true">
                                <span class="icon mr-1 has-text-grey-light">
                                    <font-awesome-icon icon="fas fa-filter"></font-awesome-icon>
                                </span>

                                <span class="has-text-grey">{{
                                    transitionsStore.inputArcs[transitionsStore.selectedInputPlaceIndex].filtered.length }}
                                    selectable values</span>
                                &nbsp;
                                <HelpButton class="has-text-grey-light" help-text="
                      You can edit the filter to make other values selectable. Filter expressions are written in 
                      <a href='https://goessner.net/articles/JSONPath/' target='_blank'>
                        JsonPath
                      </a>.
                      " />

                            </span>
                        </div>
                        <div v-else class="level-item">
                            <span class="icon mr-1 has-text-grey-light">
                                <font-awesome-icon icon="fas fa-filter"></font-awesome-icon>
                            </span>

                            <input @input="onFilterInput" style="width: 100px" class="input is-small mr-1"
                                v-model="transitionsStore.inputArcs[transitionsStore.selectedInputPlaceIndex].filter" />
                            <button class="mr-1 button is-small " @click="cancelFilterEdit">
                                <span class="icon is-small has-text-grey"><font-awesome-icon icon="fas fa-xmark" /></span>
                            </button>
                            <button @click="saveFilter" class="button is-small is-primary">
                                <span class="icon is-small"><font-awesome-icon icon="fas fa-check" /></span>
                            </button>
                        </div>
                    </div>

                </div>
                <div class="scoped-scrollable jsn-code p-2">
                    <vue-json-pretty :key="transitionsStore.inputDataKey"
                        :data="transitionsStore.inputArcs[transitionsStore.selectedInputPlaceIndex].marking"
                        @selected-change="onSelectValueClick" :selected-value="selectedInputValueDotsBracketsPath"
                        selectable-type="single" :select-on-click-node="true" :show-select-controller="true"
                        :node-selectable="valueSelectable" :show-icon="true" />

                </div>
            </div>
            <div v-else class="notification is-info is-light is-size-7">Transition has no input places.</div>
        </section>

    </div>
</template>
<script lang="ts">
import type { NodeDataType } from 'vue-json-pretty/types/components/TreeNode';

import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import HelpButton from '../_shared/HelpButton.vue';
import { dotsAndBracketsToJSONPointer } from '@/util/jsonPointer'

import { useTransitionsStore } from '@/stores/transition';


export default defineComponent({
    components: {
        VueJsonPretty,
        HelpButton
    },
    data() {
        return {
            showFilterInput: false,
            pathDictionary: {} as Record<string, string>,
        }
    },
    computed: {
        ...mapStores(useTransitionsStore),
        selectedInputValueDotsBracketsPath: {
            get(): string {
                const path = this.transitionsStore.selectedInputValueJsonPath;
                if (path === 'none') {
                    return 'none'
                }

                const dotsBracketsPath = this.pathDictionary[path];
                if (dotsBracketsPath) {
                    return dotsBracketsPath;
                } else {
                    return 'none';
                };
            },
            set(value: string) {

            }
        }
    },
    created() {
        this.pathDictionary = {};
    },
    methods: {
        cancelFilterEdit() {
            this.transitionsStore.resetInputFilter();
            this.showFilterInput = false;
        },
        saveFilter() {
            this.transitionsStore.saveInputFilter();
            this.showFilterInput = false;
        },
        onFilterInput() {
            this.transitionsStore.unsetCurrentInputAssignment()
            this.pathDictionary = {};
            this.transitionsStore.loadAvailableInputAssignments()
        },
        onInputPlaceSelect() {
            this.showFilterInput = false;
            this.pathDictionary = {};
            this.transitionsStore.loadCurrentInputAssignment();

        },
        valueSelectable(node: NodeDataType) {
            let jsonPath = '';
            const stripRoot = node.path.substring(4);
            jsonPath = dotsAndBracketsToJSONPointer(stripRoot);


            const filteredPaths = this.transitionsStore.inputArcs[this.transitionsStore.selectedInputPlaceIndex].filtered;
            const isSelectable = filteredPaths.includes(jsonPath);

            if (isSelectable) {
                this.pathDictionary[jsonPath] = node.path;
            }
            return isSelectable;
        },
        onSelectValueClick(newValue: string | string[], oldValue: string | string[]) {
            if (Array.isArray(newValue)) return;

            const stripRoot = newValue.substring(4);
            const jsonPath = dotsAndBracketsToJSONPointer(stripRoot);

            this.transitionsStore.saveSelectedAssignment(jsonPath, 'input');
        }
    }

})
</script>
<style scoped>
.scoped-modal-side {
    width: 30%;
    height: 80%;
}

.scoped-modal-left {
    border-radius: 0.25rem 0 0 0.25rem;
}

.scoped-scrollable-outer {
    height: 100%;
}

.scoped-scrollable-container {
    height: 100%;
}

.scoped-scrollable {
    overflow-y: auto;
    overflow-x: auto;
    height: 80%;
}
</style>