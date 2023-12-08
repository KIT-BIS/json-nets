
<template>
    <div v-if="uiStateStore.isScope3" class="block">
        <div class="field">
            <label class="label is-small">Formulartyp:</label>
            <div class="select is-small">
            <select @change="setSchema">
                <option value="scope1" :selected="isScope1Data">Scope 1 - Emissionen</option>
                <option value="scope2" :selected="isScope2Data">Scope 2 - Emissionen</option>
                <option value="scope3" :selected="isScope3Data">Scope 3 - Emissionen</option>
                <option value="product" :selected="isProductData">Produkt</option>
            </select>
            </div>
        </div>
        <hr />
    </div>
    <div v-if="uiStateStore.isScope3 && isScope3Data" class="block" >
        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && !isSupplyChain" class="notification is-info is-light is-size-7">
            <a @click="() => { uiStateStore.showSupplyChainData = true; }">Laden Sie Daten</a> aus dem Lieferketten-Verzeichnis oder geben Sie Sekundärdaten ein:
        </div>
        <div v-if="uiStateStore.isScope3 && !uiStateStore.showSupplyChainData && isSupplyChain" class="notification is-info is-light is-size-7">
            Sie haben Daten aus dem Lieferketten-Verzeichnis geladen. <a @click="clearSupplyChainData">Lieferketten-Daten entfernen</a>, um Formular zurückzusetzen.
        </div>
    </div>
    <div class="block">


        <!-- <p class="is-size-7 pl-4 mb-3"></p> -->
        <json-forms v-if="!uiStateStore.isScope3" :data="placesStore.formsData" :schema="placesStore.place.schema" :renderers="renderers" @change="onFormChange"/>
        <json-forms v-else-if="!uiStateStore.showSupplyChainData" :data="placesStore.formsData[0].data" :schema="placesStore.place.schema.items.properties.data" :renderers="renderers" @change="onScope3FormChange"/>
        <SupplyChainData v-else />

        <!-- :uischema="uischema" -->
        <!-- @change="onChange" -->
    </div>
    <div v-if="uiStateStore.isScope3 && isProductData" class="block">
        <button class="button is-pulled-right is-primary is-small" style="margin-left: auto" @click="publish()">Veröffentlichen</button>
        <button class="button is-pulled-right is-danger is-small mr-2" style="margin-left: auto" @click="deleteData()">Löschen</button>

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
// import { onSiteSchema } from '@/json-nets/Net';

import { scope1Schema, scope1Marking, scope2Schema, scope2Marking, scope3Marking, scope3Schema, productSchema, productMarking } from '@/examples/scope3transparent'

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
            return this.placesStore.place.marking[0].data.fromSupplyChain === true;
        },
        isScope1Data() {
            return this.placesStore.place.marking[0].data.scope === 1;
        },
        isScope2Data() {
            return this.placesStore.place.marking[0].data.scope === 2;
        },
        isScope3Data() {
            return this.placesStore.place.marking[0].data.scope === 3;
        },
        isProductData() {
            return this.placesStore.place.marking[0].data.scope === "product";
        }
    },
    methods: {
        setSchema(event: Event)  {
            const schema = event.target.value;
            let schemaString = '';
            let markingString = '';
            if (schema === "scope1") {
                schemaString = JSON.stringify(scope1Schema)
                markingString = JSON.stringify(scope1Marking)
            } else if (schema === "scope2") {
                schemaString = JSON.stringify(scope2Schema)
                markingString = JSON.stringify(scope2Marking)

            } else if (schema === "scope3") {
                schemaString = JSON.stringify(scope3Schema)
                markingString = JSON.stringify(scope3Marking)
            } else if (schema === "product") {
                schemaString = JSON.stringify(productSchema);
                markingString = JSON.stringify(productMarking);
            }

            this.placesStore.schemaString = schemaString;
            this.placesStore.savePlaceSchema(schemaString);

            this.placesStore.savePlaceMarkingFromEditor(markingString);
        },
        onFormChange(newValue: { data: {} }) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        },
        onScope3FormChange(newValue: { data: {}}) {
            this.placesStore.savePlaceMarkingFromForm([ { data: newValue.data } ]);
        },
        clearSupplyChainData() {
            this.placesStore.schemaString = JSON.stringify(scope3Schema);
            this.placesStore.savePlaceSchema(JSON.stringify(scope3Schema));
            const marking = JSON.stringify(scope3Marking);
            this.placesStore.savePlaceMarkingFromEditor(marking);
        },
        async deleteData() {
            const databaseID = this.placesStore.place.marking[0].data.databaseID;
            if (!databaseID) {
                alert("Daten wurden bisher noch nicht veröffentlicht.")
            } else {
                await fetch('http://localhost:3030/footprints/' + databaseID, {
                    method: "DELETE",
                }).then(response => response.json()).then(data => { alert("Daten wurden aus Lieferketten-Verzeichnis gelöscht.");})
            }

        },
        async publish() {
            const databaseID = this.placesStore.place.marking[0].data.databaseID;
            if (!databaseID) {
                await fetch('http://localhost:3030/footprints', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: this.placesStore.place.name, marking: this.placesStore.place.marking})
                }).then(response => response.json()).then(data => { 
                    console.log(data); 
                    const newID = data._id; 
                    alert("Daten wurden veröffentlicht (ID: " + newID + ")."); 
                    const marking = this.placesStore.place.marking;
                    marking[0].data.databaseID = newID;
                    // marking[0].data.scope = 3;
                    // marking[0].data.fromSupplyChain = true;
                    // console.log(marking);
                    this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));

                })
            } else {
                // console.log('patching')
                // console.log(this.uiStateStore.databaseID)
                await fetch('http://localhost:3030/footprints/' + databaseID, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: this.placesStore.place.name, marking: this.placesStore.place.marking})
                }).then(response => response.json()).then(data => { alert("Daten wurden aktualisiert (ID: " + databaseID + ").");})
            }


        }

    }
});
</script>