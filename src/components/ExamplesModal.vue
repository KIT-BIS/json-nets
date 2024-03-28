<template>
	<div class="modal is-active">
		<div class="modal-background"></div>
		<div class="modal-card jsn-modal-wide">
			<header class="modal-card-head">
				<p class="modal-card-title">Beispiele</p>
				<button class="delete" aria-label="close" @click="close"></button>
			</header>
			<section class="modal-card-body">
				<div class="content">
					<div class="notification is-info is-light is-size-7">
						Wählen Sie ein Beispiel-Modell aus, um es in den Editor zu laden.
					</div>

					<div>
						<table class="table is-size-7 is-fullwidth">
							<thead>
								<th>Modell</th>
								<th>Aktionen</th>
							</thead>
							<tbody>
								<tr v-for="example in configStore.examples">
									<td>
										{{ example.name }}
									</td>
									<td>
										<a @click="() => { importNet(example.net) }">Laden</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>


				</div>
			</section>
		</div>
	</div>
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useNetStore } from '@/stores/net'
import { useConfigStore } from '@/stores/config'

/**
 * Shows a list of example models to be loaded in the editor (if available in current config).
 */
export default defineComponent({
	computed: {
		...mapStores(useUiStateStore),
		...mapStores(useNetStore),
		...mapStores(useConfigStore)
	},
	methods: {
		// Todo needs refactoring, doubled in App.vue
		importNet(json: any) {
			this.netStore.import(json)
			this.close();
		},
		close() {
			this.uiStateStore.showModal = 'none'
		}
	}
})
</script>
