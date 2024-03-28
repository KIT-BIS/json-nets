<template>
	<div class="block">

		<json-forms v-if="!(placesStore.place.schema.maxItems === 1)" :data="placesStore.formsData"
			:schema="<JsonSchema>placesStore.place.schema" :renderers="renderers" @change="onFormChange" />

		<!-- if capacity of place (i.e. maxItems setting of Schema) is 1, edit only the first entry -->
		<json-forms v-if="placesStore.place.marking.length > 0" :data="//@ts-ignore
			placesStore.formsData[0]" :schema="placesStore.place.schema.items" :renderers="renderers"
			@change="onSingleTokenFormChange" />
	</div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import {
	defaultStyles,
	mergeStyles,
	vanillaRenderers,
} from '@jsonforms/vue-vanilla';
import { mapStores } from 'pinia';
import { usePlacesStore } from '@/stores/place';
import { useUiStateStore } from '@/stores/uiState';
import type { JsonSchema } from '@jsonforms/core';

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

/**
 * Shows a form to edit the marking of a place in assisted UI mode.
 */
export default defineComponent({
	components: {
		JsonForms,
	},
	provide() {
		const schema = this.placesStore.place.schema;
		if (
			schema.maxItems &&
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
		// schemaSelected(name: string):string {
		//@ts-ignore
		// return this.placesStore.place.schema.title;
		// },
	},
	methods: {
		onFormChange(newValue: { data: {} }) {
			this.placesStore.savePlaceMarkingFromForm(newValue.data);
		},
		onSingleTokenFormChange(newValue: { data: {} }) {
			this.placesStore.savePlaceMarkingFromForm([newValue.data]);
		},
	}
});
</script>