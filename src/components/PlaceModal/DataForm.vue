
<template>
    <div class="block" >

        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && !isPrimary" class="notification is-info is-light is-size-7">
            <a @click="() => { uiStateStore.showSupplyChainData = true; }">Load primary data</a> from supply chain repository or enter secondary data below:
        </div>
        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && isPrimary" class="notification is-info is-light is-size-7">
            You have loaded data from the supply chain repository. <a @click="clearPrimaryData">Clear primary data</a> to discard.
        </div>


        <!-- <p class="is-size-7 pl-4 mb-3"></p> -->
        <json-forms v-if="!uiStateStore.showSupplyChainData" :data="placesStore.formsData" :schema="placesStore.place.schema" :renderers="renderers" @change="onFormChange"/>
        <SupplyChainData v-else />

        <!-- :uischema="uischema" -->
        <!-- @change="onChange" -->
    </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import SupplyChainData from './SupplyChainData.vue';
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from '@jsonforms/vue-vanilla';
import { mapStores } from 'pinia';
import { usePlacesStore } from '@/stores/place';
import { useUiStateStore } from '@/stores/uiState';
import { secondarySchema } from '@/json-nets/Net'

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
    components: {
        JsonForms,
        SupplyChainData
    },
    provide() {
        const schema = this.placesStore.place.schema;
        if (schema.minItems && schema.maxItems && 
            schema.minItems === 1 && 
            schema.maxItems === 1) {
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
        isPrimary() {
            return this.placesStore.place.marking[0].type === "primary"
        }
    },
    methods: {
        onFormChange(newValue: { data: {} }) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        },
        clearPrimaryData() {
            this.placesStore.schemaString = JSON.stringify(secondarySchema);
            this.placesStore.savePlaceSchema(JSON.stringify(secondarySchema));
            // this.$forceUpdate();
            // this.placesStore.place.schema = JSON.parse(JSON.stringify(primarySchema));
            const marking = this.placesStore.place.marking;
            marking[0].type = "secondary";
            this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));

            // this.uiStateStore.showSupplyChainData = false;

        }
    }
});
</script>