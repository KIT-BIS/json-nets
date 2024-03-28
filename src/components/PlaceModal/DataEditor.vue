<template>
    <div class="block">
        <div class="field">
            <label class="label is-small icon-text">Place marking
                <HelpButton help-text="
                            Edit the JSON array to insert or remove data. 
                            <a href='https://www.json.org/json-en.html' target='_blank'
                            >Click here</a> for more information about JSON.
                            "/>
                <button class="button is-pulled-right is-small is-ghost" style="margin-left: auto"
                    @click="onAddTokenClick">Add token</button>


            </label>

            <div class="control is-small jsn-code">
                <Codemirror v-model="placesStore.markingString" placeholder="Edit place data." :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :style="{ height: '400px' }" :extensions="extensions" />
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
import type { JSONSchema7 } from 'json-schema';

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

import { usePlacesStore } from '@/stores/place';
import HelpButton from '@/components/_shared/HelpButton.vue';

/**
 * Shows an editor to edit the marking of a place.
 */
export default defineComponent({
    components: {
        Codemirror,
        HelpButton,
    },

    setup() {

        const placesStore = usePlacesStore();

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
            jsonSchema(placesStore.place.schema as JSONSchema7)
        ]
        return {
            extensions,
        }
    },
    computed: {
        ...mapStores(usePlacesStore),
    },
    methods: {
        onAddTokenClick() {
            // Todo make token dependent on schema
            this.placesStore.addToken();
        },
    }
})
</script>