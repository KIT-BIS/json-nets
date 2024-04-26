<template>
	<DataLoader v-if="configStore.getPlaceTypeById(netStore.placeTypes[placesStore.place.id])?.externalInteraction.type === 'pull'" />
	<DataForm v-if="uiStateStore.uiAssistMode === 'assisted'" />
	<DataEditor v-else-if="uiStateStore.uiAssistMode === 'expert'" />
	<div v-if="(configStore.getPlaceTypeById(netStore.placeTypes[placesStore.place.id])?.externalInteraction.type === 'push')
		&& (placesStore.place.marking.length > 0)" class="block">
		<button class="button is-pulled-right is-primary is-small" style="margin-left: auto"
			@click="publish()">Veröffentlichen</button>
		<button class="button is-pulled-right is-danger is-small mr-2" style="margin-left: auto" @click="deleteData()"
			:disabled="!isDeletable">Löschen</button>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import DataForm from './DataForm.vue';
import DataEditor from './DataEditor.vue';
import DataLoader from './DataLoader.vue';
import { useConfigStore } from '@/stores/config';
import { useNetStore } from '@/stores/net';
import { usePlacesStore } from '@/stores/place';
import { useUiStateStore } from '@/stores/uiState';

/**
 * Wrapper for the tab of the place modal that shows options to work with the marking.
 * May be a data form (for assisted UI mode) or a text editor (for expert UI mode).
 * If the place is of type 'pull' the marking is loaded from an external url.
 * If the place is of type 'push' the user is shown options to publish the data to the external url.
 */
export default defineComponent({
	components: {
		DataForm,
		DataEditor,
		DataLoader
	},
	computed: {
		...mapStores(usePlacesStore),
		...mapStores(useNetStore),
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
			const externalInteractionSettings = this.configStore.getPlaceTypeById(this.netStore.placeTypes[this.placesStore.place.id])?.externalInteraction
			if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;

			const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];

			if (!databaseID || databaseID === '') {
				alert("Daten wurden bisher noch nicht veröffentlicht.")
			} else {
				await fetch(externalInteractionSettings.url + databaseID, {
					method: "DELETE",
				}).then(response => response.json()).then(() => {
					this.placesStore.databaseMap[this.placesStore.place.id] = '';
					alert("Daten wurden gelöscht.");
				})
			}
		},
		async publish() {
			const externalInteractionSettings = this.configStore.getPlaceTypeById(this.netStore.placeTypes[this.placesStore.place.id])?.externalInteraction
			if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;

			const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];
			const marking = JSON.parse(JSON.stringify(this.placesStore.place.marking))

			// Todo: consider always resetting model with export
			useNetStore().resetModel();
			const model = useNetStore().export();

			const data = { name: this.placesStore.place.name, marking: marking, model: JSON.parse(model) };
			// if (databaseID === '') {
			// console.log('databaseID')
			// console.log(databaseID)
			if (!databaseID) {
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
				}).then(response => response.json()).then(data => { alert("Daten wurden aktualisiert (ID: " + databaseID + ")."); })
			}
		}
	}
})
</script>