<template>

</template>
<script lang="ts">
import { useConfigStore } from '@/stores/config';
import { defineComponent } from 'vue';
import s3tConfig from '../configs/s3t-config.json'
import { mapStores } from 'pinia';
import type { ConfigData } from '../stores/config'
import { useNetStore } from '@/stores/net';

/**
 * Loads config selected by params provided by router.
 */
export default defineComponent({
	computed: {
		...mapStores(useConfigStore),
		...mapStores(useNetStore)
	},
	mounted() {
		const configID = this.$route.params.configID
		if (configID === "scope3tool") {
			this.configStore.loadConfig(s3tConfig as ConfigData);
		}
		const modelID = this.$route.params.modelID;
		if (modelID) {

			const model = this.configStore.examples.find(example => example.name === modelID);
			if (model) {
				this.netStore.import(model.net)
			}
		}
	}
})
</script>