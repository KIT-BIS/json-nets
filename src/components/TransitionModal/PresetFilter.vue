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
                                    <select v-model="transitionsStore.selectedInputIndex" @change="onInputSelect">
                                        <option v-for="(arc, index) in transitionsStore.inputArcs" :value="index">{{ arc.name }}</option>
                                    </select>
                                </span>
                            </p>

                        </div>
                    </div>
               </div>
                <!-- <div class="level-right">
                    <div class="level-item">
                        <span class="icon is-small has-text-danger"><font-awesome-icon
                                icon="fas fa-triangle-exclamation"></font-awesome-icon>
                        </span>

                    </div>
                </div>
 -->

            </div>
            <div class="level mb-4">
                <div class="level-left">
                <div v-if="!showFilterInput" class="level-item">
                    <span class="icon-text is-clickable" @click="showFilterInput = true">
                    <span class="icon mr-1 has-text-grey-light">
                        <font-awesome-icon icon="fas fa-filter"></font-awesome-icon>
                    </span>
 
                    <span class="has-text-grey" >{{ transitionsStore.inputArcs[transitionsStore.selectedInputIndex].filtered.length }} selectable values</span>
                   </span>
                </div>
                <div v-else class="level-item">
                    <span class="icon mr-1 has-text-grey-light">
                        <font-awesome-icon icon="fas fa-filter"></font-awesome-icon>
                    </span>
 
                    <input 
                        @input="transitionsStore.updateInputFilter"
                        style="width: 100px" class="input is-small mr-1" v-model="transitionsStore.inputArcs[transitionsStore.selectedInputIndex].filter"/>
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
                <vue-json-pretty 
                    :data="transitionsStore.inputArcs[transitionsStore.selectedInputIndex].marking" 
                    @selected-change="onSelectClick" 
                    :selected-value="transitionsStore.selectedInputValue"
                    selectable-type="single"
                    :select-on-click-node="true"
                    :show-select-controller="true"
                    :node-selectable="valueSelectable"
                    :show-icon="true" />

                    <!-- @node-click="onValueClick" -->
                <!-- :virtual="true" -->
                <!-- :render-node-value="({node, defaultValue}) => { return createNode(node)}" -->
            </div>
            </div>
            <div v-else class="notification is-info is-light is-size-7">Transition has no input places.</div>
        </section>

    </div>
</template>
<script lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useTransitionsStore } from '@/stores/transitions';
import type { NodeDataType } from 'vue-json-pretty/types/components/TreeNode';
import { dotsAndBracketsToJSONPointer } from '@/util/jsonPointer'

export default defineComponent({
    components: {
        VueJsonPretty
    },
    data() {
        return {
            showFilterInput: false,
        }
    },
    computed: {
        ...mapStores(useTransitionsStore)
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
        onInputSelect() {
            // this.transitionsStore.updateInput();
            this.showFilterInput = false;
        },
        valueSelectable(node: NodeDataType) {
            const stripRoot = node.path.substring(4);
            const jsonPath = dotsAndBracketsToJSONPointer(stripRoot);
            // console.log(jsonPath);
            const filteredPaths = this.transitionsStore.inputArcs[this.transitionsStore.selectedInputIndex].filtered;
            // console.log(selectedPaths);
            return filteredPaths.includes(jsonPath);
        },
        // onValueClick(node: NodeDataType) {
//            if (this.valueSelectable(node)) {
//                console.log('selectable')
//                console.log(node.path)
//                this.transitionsStore.selectedValue = node.path
//                console.log(this.transitionsStore.selectedValue)
        // },
        onSelectClick(newValue: string | string[], oldValue: string | string[]) {
            // console.log('onSelectClick')
            // console.log(oldValue)
            // console.log(newValue)
            if(Array.isArray(newValue)) return;

            this.transitionsStore.selectedInputValue = newValue;
            const stripRoot = newValue.substring(4);
            const jsonPath = dotsAndBracketsToJSONPointer(stripRoot);

            this.transitionsStore.setSelectedInputValue(jsonPath);
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