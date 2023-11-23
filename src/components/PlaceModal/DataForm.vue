
<template>
    <div class="block" >

        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && !isSupplyChain" class="notification is-info is-light is-size-7">
            <a @click="() => { uiStateStore.showSupplyChainData = true; }">Load data</a> from supply chain repository or enter secondary data below:
        </div>
        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && isSupplyChain" class="notification is-info is-light is-size-7">
            You have loaded data from the supply chain repository. <a @click="clearPrimaryData">Clear supply chain data</a> to discard.
        </div>


        <!-- <p class="is-size-7 pl-4 mb-3"></p> -->
        <json-forms v-if="!uiStateStore.isScope3" :data="placesStore.formsData" :schema="placesStore.place.schema" :renderers="renderers" @change="onFormChange"/>
        <json-forms v-else-if="!uiStateStore.showSupplyChainData" :data="placesStore.formsData[0].data" :schema="placesStore.place.schema.items.properties.data" :renderers="renderers" @change="onScope3FormChange"/>
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
import { onSiteSchema } from '@/json-nets/Net'

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
        isSupplyChain() {
            return this.placesStore.place.marking[0].data.type === "supply-chain"
        }
    },
    methods: {
        onFormChange(newValue: { data: {} }) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        },
        onScope3FormChange(newValue: { data: {}}) {
            this.placesStore.savePlaceMarkingFromForm([ { data: newValue.data } ]);
        },
        clearPrimaryData() {
            this.placesStore.schemaString = JSON.stringify(onSiteSchema);
            this.placesStore.savePlaceSchema(JSON.stringify(onSiteSchema));
            // this.$forceUpdate();
            // this.placesStore.place.schema = JSON.parse(JSON.stringify(primarySchema));
            const marking = this.placesStore.place.marking;
            marking[0].data.type = "secondary";
            marking[0].data.pds = 0;
            this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));

            // this.uiStateStore.showSupplyChainData = false;

        }
    }
});
</script>