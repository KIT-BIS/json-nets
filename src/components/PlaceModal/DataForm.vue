
<template>
    <div class="block">


        <!-- <p class="is-size-7 pl-4 mb-3"></p> -->
        <json-forms v-if="!uiStateStore.isScope3" :data="placesStore.formsData" :schema="placesStore.place.schema" :renderers="renderers" @change="onFormChange"/>
        <!-- @ts-ignore -->
        <div v-else>
            <div v-if="!uiStateStore.showSupplyChainData">
                <json-forms v-if="(schemaSelected !== 'control') 
                && (schemaSelected !== 'end') 
                && (schemaSelected !== 'start') && placesStore.place.marking.length > 0" 
                :data="//@ts-ignore
    
                placesStore.formsData[0]" :schema="placesStore.place.schema.items" :renderers="renderers" @change="onScope3FormChange"
                />
                <div v-if="(schemaSelected !== 'control') && (schemaSelected !== 'end') && placesStore.place.marking.length === 0">
                    Daten wurden verarbeitet. <a @click="placesStore.resetMarking">Formular zurücksetzen.</a>

                </div>
            </div>
        <SupplyChainData v-else />
        </div>

        <!-- :uischema="uischema" -->
        <!-- @change="onChange" -->
    </div>
    <div v-if="uiStateStore.isScope3 && (schemaSelected === 'end') && (placesStore.place.marking.length > 0)" class="block">
        <button class="button is-pulled-right is-primary is-small" style="margin-left: auto" @click="publish()">Veröffentlichen</button>
        <button class="button is-pulled-right is-danger is-small mr-2" style="margin-left: auto" @click="deleteData()" :disabled="!isDeletable">Löschen</button>

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

import { scope1Schema, scope1Marking, scope2Schema, scope2Marking, scope3Marking, scope3Schema, 
    // productSchema, 
    // productMarking, 
    startMarking, startSchema, endMarking, endSchema, controlMarking, controlSchema } from '@/examples/scope3transparent'
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
        schemaSelected(name: string):string {
            //@ts-ignore
            return this.placesStore.place.schema.title;
        },
        isDeletable() {
            // const databaseID = this.placesStore.place.marking[0].databaseID;
            const databaseID = this.uiStateStore.databaseID;
            if (databaseID !== '') {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        onFormChange(newValue: { data: {} }) {
            this.placesStore.savePlaceMarkingFromForm(newValue.data);
        },
        onScope3FormChange(newValue: { data: {}}) {
            this.placesStore.savePlaceMarkingFromForm([newValue.data]);
        },
        clearSupplyChainData() {
            this.placesStore.schemaString = JSON.stringify(scope3Schema);
            this.placesStore.savePlaceSchema(JSON.stringify(scope3Schema));
            const marking = JSON.stringify(scope3Marking);
            this.placesStore.savePlaceMarkingFromEditor(marking);
        },
        async deleteData() {
            //@ts-ignore
            // const databaseID = this.placesStore.place.marking[0].databaseID;
            const databaseID = this.uiStateStore.databaseID;
            if (databaseID === '') {
                alert("Daten wurden bisher noch nicht veröffentlicht.")
            } else {
                // await fetch('http://localhost:3030/footprints/' + databaseID, {
                await fetch('https://s3t.uber.space/footprints/' + databaseID, {
                    method: "DELETE",
                }).then(response => response.json()).then(data => { 
                    // delete this.placesStore.place.marking[0].databaseID;
                    this.uiStateStore.databaseID = '';
                    alert("Daten wurden aus Lieferketten-Verzeichnis gelöscht.");})
            }

        },
        async publish() {
            //@ts-ignore
            // const databaseID = this.placesStore.place.marking[0].databaseID;
            const databaseID = this.uiStateStore.databaseID;
            const marking = JSON.parse(JSON.stringify(this.placesStore.place.marking))
            useNetStore().resetModel();
            const model = useNetStore().export();
            const data = {name: this.placesStore.place.name, marking: marking, model: JSON.parse(model)};
            // const data = {name: this.placesStore.place.name, marking: this.placesStore.place.marking};
            console.log(data)
            if (databaseID === '') {
                await fetch('https://s3t.uber.space/footprints', {
                // await fetch('http://localhost:3030/footprints', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json()).then(data => { 
                    console.log(data); 
                    const newID = data._id; 
                    alert("Daten wurden veröffentlicht (ID: " + newID + "). Das Modell wurde zurückgesetzt."); 
                    this.uiStateStore.databaseID = newID;

                })
            } else {
                // await fetch('http://localhost:3030/footprints/' + databaseID, {
                await fetch('https://s3t.uber.space/footprints/' + databaseID, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json()).then(data => { alert("Daten wurden aktualisiert (ID: " + databaseID + ").");})
            }


        }

    }
});
</script>