<template>
    <div class="field">
        <label class="label is-small">Key
            <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                    icon="fas fa-up-right-from-square"></font-awesome-icon></span>
        </label>
        <div class="control is-small jsn-code">
            <Codemirror placeholder="Define key in Jsonnet" style="height: 50px" :indent-with-tab="true" :tab-size="2"
                :extensions="extensions" 
                v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].key"
                @update="onCodeUpdate"
                />
        </div>


    </div>
    <div class="field">
        <label class="label is-small">Value
            <span class="icon is-small is-pulled-right has-text-grey-light"><font-awesome-icon
                    icon="fas fa-up-right-from-square"></font-awesome-icon></span>
        </label>
        <div class="control is-small jsn-code">
            <Codemirror placeholder="Define value in Jsonnet" style="height: 50px" :indent-with-tab="true" :tab-size="2"
                :extensions="extensions" 
                v-model="transitionsStore.outputArcs[transitionsStore.selectedOutputSnippetIndex].fragment"
                @update="onCodeUpdate"
                />
        </div>


    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { basicSetup } from 'codemirror';
import { mapStores } from 'pinia';
import { useTransitionState } from 'vue';
import { useTransitionsStore } from '@/stores/transitions';

export default defineComponent({
    components: {
        Codemirror
    },
    setup() {
        const extensions = [basicSetup]

        mapStores
        return {
            extensions,
        }
    },
    computed: {

        ...mapStores(useTransitionsStore)
    },
    methods: {
        onCodeUpdate(update: any) { // for the love of me, I can't figure out how to import the codemirror ViewUpdate type
            // if (update.changedRanges.length === 0) {
                // return;
            // } else { // working on the assumption that text changes always change changedRanges (@change doesn't catch text cut)
                this.transitionsStore.saveOutputSnippets();
            // }
        },
        // onCodeChange(update: any) {
            // this.transitionsStore.saveOutputSnippets();
        // }
    }

})

</script>