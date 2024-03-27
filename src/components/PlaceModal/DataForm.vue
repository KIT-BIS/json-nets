<template>
    <div class="block">

        <json-forms v-if="!(placesStore.place.schema.maxItems === 1)" 
            :data="placesStore.formsData" 
            :schema="placesStore.place.schema" 
            :renderers="renderers" 
            @change="onFormChange"
            />

        <!-- if capacity of place (i.e. maxItems setting of Schema) is 1, edit only the first entry -->
        <json-forms v-if="placesStore.place.marking.length > 0" 
            :data="//@ts-ignore
            placesStore.formsData[0]" 
            :schema="placesStore.place.schema.items" 
            :renderers="renderers" 
            @change="onSingleTokenFormChange"
            />

            <!-- <SupplyChainData v-else /> -->
        <!-- <div v-if="(schemaSelected !== 'control') && (schemaSelected !== 'end') && placesStore.place.marking.length === 0">
            Daten wurden verarbeitet. <a @click="placesStore.resetMarking">Formular zurücksetzen.</a>
 -->
        <!-- @ts-ignore -->
        <!-- <div v-else>
            <div v-if="!uiStateStore.showSupplyChainData">
                <json-forms v-if="(schemaSelected !== 'control') 
                && (schemaSelected !== 'end') 
                && (schemaSelected !== 'start') && placesStore.place.marking.length > 0" 
                :data="//@ts-ignore
    
                placesStore.formsData[0]" :schema="placesStore.place.schema.items" :renderers="renderers" @change="onScope3FormChange"
                />

                </div>
            </div>
        </div> -->

    </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms } from '@jsonforms/vue';
// import DataLoader from './DataLoader.vue';
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from '@jsonforms/vue-vanilla';
import { mapStores } from 'pinia';
import { usePlacesStore } from '@/stores/place';
import { useUiStateStore } from '@/stores/uiState';
import { useNetStore } from '@/stores/net';

const singleTokenStyle = mergeStyles(defaultStyles, {
  arrayList: { 
    addButton: 'is-hidden',
    itemContent: 'expanded',
    itemToolbar: 'is-hidden'
 },
});

const renderers = [
    ...vanillaRenderers,
];

export default defineComponent({
    components: {
        JsonForms,
    },
    provide() {
        const schema = this.placesStore.place.schema;
        if (
            // schema.minItems && 
            schema.maxItems && 
            // schema.minItems === 1 && 
            schema.maxItems === 1
            ) {
            return {
                styles: singleTokenStyle,
            };
        } else {
            return {
                styles: defaultStyles
            }
        }
    },
    data() {
        return {
            renderers: Object.freeze(renderers),
        }
    },
    computed: {
        ...mapStores(usePlacesStore),
        ...mapStores(useUiStateStore),
        schemaSelected(name: string):string {
            //@ts-ignore
            return this.placesStore.place.schema.title;
        },
    },
    methods: {
        onFormChange(newValue: { data: {} }) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        },
        onSingleTokenFormChange(newValue: { data: {}}) {
            this.placesStore.savePlaceMarkingFromForm([newValue.data]);
        },
    }
});
</script>