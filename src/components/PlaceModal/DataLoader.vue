<template>
	<!-- It is assumed that loaded entries have a name field -->
	<div v-if="data">
		<table class="table is-size-7 is-fullwidth">
			<thead>
				<th>Eintrag</th>
				<th>Aktionen</th>
			</thead>
			<tbody>
				<tr v-for="element in data.data">
					<td>
						{{ //@ts-ignore
						element.name }}
					</td>
					<td>
						<a v-if="uiStateStore.uiAssistMode === 'expert'" class="mr-5" @click="//@ts-ignore
							loadModel(element)">
							Modell öffnen 
						</a>
						<a @click="//@ts-ignore
							setPlaceData(element)">
							Laden
						</a>
					</td>
				</tr>
			</tbody>
		</table>
		<hr />
	</div>

</template>
<script lang="ts">
import type { JSONMarking } from '@/util/jsonOperations';

import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

import { usePlacesStore } from '@/stores/place';
import { useConfigStore } from '@/stores/config';
import { useNetStore } from '@/stores/net';
import { useUiStateStore } from '@/stores/uiState';

/**
 * Loads the marking of a place from a remote url.
 */
export default defineComponent({
	data() {
		// Todo: clean up, implement more elegant solution
		return {
			data: { data: null }
		}
	},
	computed: {
		...mapStores(usePlacesStore),
		...mapStores(useNetStore),
		...mapStores(useUiStateStore),
		...mapStores(useConfigStore)
	},
	created() {
		this.load();
	},
	methods: {
		async load() {
			const externalInteractionSettings = this.configStore.getPlaceTypeById(this.netStore.placeTypes[this.placesStore.place.id])?.externalInteraction
			if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;


			const response = await fetch(externalInteractionSettings.url)
			this.data = await response.json();
		},
		loadModel(data: any) {
			this.netStore.import(data.model);
		},
		setPlaceData(data: { name: string, marking: JSONMarking }) {
			this.placesStore.place.name = data.name;
			this.placesStore.saveName();

			const externalInteractionSettings = this.configStore.getPlaceTypeById(this.netStore.placeTypes[this.placesStore.place.id])?.externalInteraction
			if (!externalInteractionSettings || externalInteractionSettings.type !== 'pull') return;

			const marking = data.marking;
			marking[0] = { ...data.marking[0], ...externalInteractionSettings.enforcedMarking }

			this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));
		}

	}
})
</script>