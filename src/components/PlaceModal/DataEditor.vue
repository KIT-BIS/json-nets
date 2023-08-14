<template>
    <div class="block">
        <div class="field">
            <label class="label is-small icon-text">Place marking
            <HelpButton help-text="
              Edit the JSON array to insert or remove data. 
              <a href='https://www.json.org/json-en.html' target='_blank'
                >Click here</a> for more information about JSON.
            "/>

            </label>
            <div class="control is-small jsn-code">
                <Codemirror v-model="placesStore.markingString" placeholder="Edit place data." :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :style="{ height: '400px' }" :extensions="extensions"
                    />
                    <!-- @change="onMarkingCodeChange"  -->
            </div>
            <p class="help" v-if="!placesStore.place.hasError">
                {{ placesStore.place.errorMessage }} &nbsp;
            </p>
            <p class="help is-danger" v-if="placesStore.place.hasError && placesStore.place.errorType === 'data'">
                {{ placesStore.place.errorMessage }}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import { basicSetup } from 'codemirror';
import { Codemirror } from 'vue-codemirror';
import { jsonSchema } from "codemirror-json-schema";
import { EditorState } from "@codemirror/state";
import { gutter, EditorView, lineNumbers } from "@codemirror/view";
import { history } from "@codemirror/commands";
import { closeBrackets } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import type { ViewUpdate } from "@codemirror/view";

import HelpButton from '@/components/_shared/HelpButton.vue'

import { usePlacesStore } from '@/stores/place';
export default defineComponent({
    props: {
        schema: {}
    },
    components: {
        Codemirror,
        HelpButton
    },
    setup(props) {

        const extensions = [
            gutter({ class: "CodeMirror-lint-markers" }),
            bracketMatching(),
            basicSetup,
            closeBrackets(),
            history(),
            lineNumbers(),
            lintGutter(),
            EditorView.lineWrapping,
            EditorState.tabSize.of(2),
            syntaxHighlighting(oneDarkHighlightStyle),
            jsonSchema(props.schema)
        ]
        return {
            extensions,
        }
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapStores(usePlacesStore)
    },
    watch: {
        'placesStore.markingString'(newValue: string) {
            this.placesStore.savePlaceMarking(newValue);
        }
    },
    methods: {
        // onMarkingCodeChange(value: string, update: ViewUpdate) {
            // this way (passing along the onChange value)
            // seems to catch all changes - are there potential inconsistencies with vmodel?
        // },
    }
})
</script>@/stores/place