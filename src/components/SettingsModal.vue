<template>
	<div class="modal is-active">
		<div class="modal-background"></div>
		<div class="modal-card jsn-modal-wide">
			<header class="modal-card-head">
				<p class="modal-card-title">Einstellungen</p>
				<button class="delete" aria-label="close" @click="close"></button>
			</header>
			<section class="modal-card-body">
				<div class="content">
					<div class="block">
						<div class="field">
							<label class="label is-small">Configuration:</label>
							<div class="select is-small">
								<select @change="setConfig">
									<option value="default" :selected="configStore.name === 'default'">Default</option>
									<option value="scope3tool" :selected="configStore.name === 'scope3tool'">Scope3tool
									</option>
									<option value="scenario" :selected="configStore.name === 'scenario'">Scenario
									</option>
									<!-- <option value="test" :selected="configStore.name === 'test'">Test</option> -->
									<option value="uploaded" :selected="configStore.name === 'uploaded'">Upload custom
										...</option>
								</select>
							</div>
						</div>
						<div class="field" v-if="configStore.name === 'uploaded'">
							<label class="label is-small">Upload config file:</label>
							<input class="button is-small" style="margin-left: 15px" type="file" name="configfile"
								@change="(event) => {
								readFile(event)
								}" />
						</div>
					</div>

					<div class="block is-flex is-justify-content-center">
						<div class="field has-addons">
							<p class="control">
								<button @click="onUserModeClick('assisted')" class="button is-small"
									:class="uiStateStore.uiAssistMode === 'assisted' ? 'is-primary' : ''">
									<span>Assisted</span>
								</button>
							</p>
							<p class="control">
								<button @click="onUserModeClick('expert')" class="button is-small"
									:class="uiStateStore.uiAssistMode === 'expert' ? 'is-primary' : ''">
									<span>Expert</span>
								</button>
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

import { useUiStateStore } from '../stores/uiState'
import { useConfigStore, type ConfigData } from '@/stores/config';
import { getNetInstance } from '@/json-nets/Net';
import { useNetStore } from '@/stores/net';
import { readFile } from '@/util/files';

import s3tConfig from '../configs/s3t-config.json';
import scenarioConfig from '../configs/scenario-config.json';

/**
 * Shows a window to switch between assisted UI mode and expert UI mode. Allows to select predefined config or load a custom one.
 */
export default defineComponent({
	computed: {
		...mapStores(useUiStateStore),
		...mapStores(useNetStore),
		...mapStores(useConfigStore)
	},
	methods: {
		close() {
			this.uiStateStore.showModal = 'none'
		},
		onUserModeClick(mode: "assisted" | "expert") {
			this.uiStateStore.uiAssistMode = mode;
		},
		setConfig(event: Event) {
			const configID = (event.target as HTMLInputElement).value;
			// Todo: store config name in config store and show current state in modal

			// Todo: should better be handled via a store, e.g. new clear function in netStore
			getNetInstance().clear();
			this.netStore.transitions = [];
			this.netStore.places = [];
			// this triggers the importedData watcher in JointPaper - kinda hacky, could directly run _graph.clear() somewhere fitting
			this.netStore.importedData = {};


			if (configID === "default") {
				this.configStore.resetConfig();
				// Todo: handle standard config
			} else if (configID === "scope3tool") {
				this.configStore.loadConfig(s3tConfig as ConfigData);
				// } else if (configID === "test") {
				// this.configStore.loadConfig(testConfig as ConfigData);
			} else if (configID === "scenario") {
				this.configStore.loadConfig(scenarioConfig as ConfigData);
			} else if (configID === "uploaded") {
				this.configStore.resetConfig();
				this.configStore.name = "uploaded";
			}
		},
		readFile(event: Event) {
			readFile(event, this.importConfig);
		},
		importConfig(jsonString: string) {
			let json = JSON.parse(jsonString);
			useConfigStore().loadConfig(json, true);
		}
	}
})
</script>
