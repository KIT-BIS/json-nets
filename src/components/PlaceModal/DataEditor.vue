<template>
    <div class="block is-flex is-justify-content-center">
        <div class="field has-addons">
            <p class="control">
                <button @click="onUserModeClick('assisted')" class="button is-small"
                    :class="placesStore.place.mode === 'assisted' ? 'is-primary' : ''">
                    <span>Assisted</span>
                </button>
            </p>
            <p class="control">
                <button @click="onUserModeClick('expert')" class="button is-small"
                    :class="placesStore.place.mode === 'expert' ? 'is-primary' : ''">
                    <span>Expert</span>
                </button>
            </p>
        </div>
    </div>

    <div class="block" v-if="placesStore.place.mode === 'assisted'">

        <div class="notification is-info is-light is-size-7">
            <a>Load primary data</a> from supply chain repository or enter secondary data below:
        </div>

        <!-- <p class="is-size-7 pl-4 mb-3"></p> -->
        <json-forms :data="placesStore.formsData" :schema="schema" :renderers="renderers" @change="onFormChange"/>

        <!-- :uischema="uischema" -->
        <!-- @change="onChange" -->
    </div>

    <div class="block" v-if="placesStore.place.mode === 'expert'">
        <div class="field">
            <label class="label is-small icon-text">Place marking
                <HelpButton help-text="
              Edit the JSON array to insert or remove data. 
              <a href='https://www.json.org/json-en.html' target='_blank'
                >Click here</a> for more information about JSON.
            " />
                <button class="button is-pulled-right is-small is-ghost" style="margin-left: auto"
                    @click="onAddTokenClick">Add token</button>


            </label>

            <div class="control is-small jsn-code">
                <Codemirror v-model="placesStore.markingString" placeholder="Edit place data." :autofocus="true"
                    :indent-with-tab="true" :tab-size="2" :style="{ height: '400px' }" :extensions="extensions" />
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
import type { JSONSchema7 } from 'json-schema';
import HelpButton from '@/components/_shared/HelpButton.vue';

import type { JSONMarking } from '@/util/jsonOperations';
import { usePlacesStore } from '@/stores/place';

import { JsonForms } from '@jsonforms/vue';
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from '@jsonforms/vue-vanilla';
import { toRaw } from 'vue';

const singleTokenStyle = mergeStyles(defaultStyles, {
  arrayList: { 
    addButton: 'is-hidden',
    itemContent: 'expanded',
    itemToolbar: 'is-hidden'
 },

});

const renderers = [
    ...vanillaRenderers,
    // here you can add custom renderers
];

export default defineComponent({
    props: {
        schema: {}
    },
    components: {
        Codemirror,
        HelpButton,
        JsonForms
    },
    provide() {
        if (this.schema.minItems && 
        this.schema.maxItems && 
        this.schema.minItems === 1 && 
        this.schema.maxItems === 1) {
            return {
                styles: singleTokenStyle,
            };
        } else {
            return {
                styles: defaultStyles
            }
        }
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
            jsonSchema(props.schema as JSONSchema7)
        ]
        return {
            extensions,
        }
    },
    data() {
        return {

            renderers: Object.freeze(renderers),
            schema: this.$props.schema
        }
    },
    computed: {
        ...mapStores(usePlacesStore)
    },
    watch: {
        'placesStore.markingString'(newValue: string) {
            console.log('saving marking from string watcher')
            this.placesStore.savePlaceMarkingFromEditor(newValue);
        },
    },
    methods: {
        onAddTokenClick() {
            // todo make token dependent on schema
            this.placesStore.addToken();
        },
        onUserModeClick(mode: "assisted" | "expert") {
            this.placesStore.setUserMode(mode)
        },
        onFormChange(newValue) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        }


    }
})
</script>