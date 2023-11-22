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
    <DataForm v-if="placesStore.place.mode === 'assisted'"/>
    <DataEditor v-if="placesStore.place.mode === 'expert'"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import SupplyChainData from './SupplyChainData.vue';

import type { JSONMarking } from '@/util/jsonOperations';
import { usePlacesStore } from '@/stores/place';

import { JsonForms } from '@jsonforms/vue';
import { toRaw } from 'vue';
import { useUiStateStore } from '@/stores/uiState';

import DataForm from './DataForm.vue';
import DataEditor from './DataEditor.vue';


export default defineComponent({
    // props: {
        // schema: {}
    // },
    components: {
        DataForm,
        DataEditor

    },
    data() {
        return {
            // schema: this.$props.schema,
        }
    },
    computed: {
        ...mapStores(usePlacesStore),
        ...mapStores(useUiStateStore)
    },
    watch: {
        'placesStore.markingString'(newValue: string) {
            console.log('saving marking from string watcher')
            this.placesStore.savePlaceMarkingFromEditor(newValue);
        },
    },
    methods: {
        onUserModeClick(mode: "assisted" | "expert") {
            this.placesStore.setUserMode(mode)
        },


    }
})
</script>