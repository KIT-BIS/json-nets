<template>
    <DataLoader v-if="configStore.getPlaceTypeById(placesStore.placeType)?.externalInteraction.type === 'pull'" />
    <DataForm v-if="uiStateStore.uiAssistMode === 'assisted'"/>
    <DataEditor v-else-if="uiStateStore.uiAssistMode === 'expert'"/>
    <div v-if="(configStore.getPlaceTypeById(placesStore.placeType)?.externalInteraction.type === 'push') 
        && (placesStore.place.marking.length > 0)" class="block">
        <button class="button is-pulled-right is-primary is-small" style="margin-left: auto" @click="publish()">Veröffentlichen</button>
        <button class="button is-pulled-right is-danger is-small mr-2" style="margin-left: auto" @click="deleteData()" :disabled="!isDeletable">Löschen</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import { usePlacesStore } from '@/stores/place';

import { useUiStateStore } from '@/stores/uiState';

import DataForm from './DataForm.vue';
import DataEditor from './DataEditor.vue';
import DataLoader from './DataLoader.vue';
import { useConfigStore } from '@/stores/config';
import { useNetStore } from '@/stores/net';


export default defineComponent({
    components: {
        DataForm,
        DataEditor,
        DataLoader
    },
    computed: {
        ...mapStores(usePlacesStore),
        ...mapStores(useUiStateStore),
        ...mapStores(useConfigStore),
        isDeletable() {
            const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];
            if (databaseID !== '') {
                return true;
            } else {
                return false;
            }
        }

    },
    watch: {
        'placesStore.markingString'(newValue: string) {
            this.placesStore.savePlaceMarkingFromEditor(newValue);
        },
    },
    methods: {
        async deleteData() {
            const externalInteractionSettings = this.configStore.getPlaceTypeById(this.placesStore.placeType)?.externalInteraction
            if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;

            const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];

            if (!databaseID || databaseID === '') {
                alert("Daten wurden bisher noch nicht veröffentlicht.")
            } else {
                await fetch(externalInteractionSettings.url + databaseID, {
                    method: "DELETE",
                }).then(response => response.json()).then(() => { 
                    this.placesStore.databaseMap[this.placesStore.place.id] = '';
                    alert("Daten wurden gelöscht.");})
            }

        },
        async publish() {
            const externalInteractionSettings = this.configStore.getPlaceTypeById(this.placesStore.placeType)?.externalInteraction
            if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;

            const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];
            const marking = JSON.parse(JSON.stringify(this.placesStore.place.marking))

            // Todo: consider always resetting model with export
            useNetStore().resetModel();
            const model = useNetStore().export();

            const data = {name: this.placesStore.place.name, marking: marking, model: JSON.parse(model)};
            if (databaseID === '') {
                await fetch(externalInteractionSettings.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json()).then(data => { 
                    const newID = data._id; 
                    alert("Daten wurden veröffentlicht (ID: " + newID + "). Das Modell wurde zurückgesetzt."); 
                    this.placesStore.databaseMap[this.placesStore.place.id] = newID;
                })
            } else {
                await fetch(externalInteractionSettings.url + databaseID, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json()).then(data => { alert("Daten wurden aktualisiert (ID: " + databaseID + ").");})
            }
        }
    }
})
</script>