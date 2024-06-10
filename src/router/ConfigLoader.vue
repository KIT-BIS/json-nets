<template>
	<div>Loading configuration...</div>
  </template>
  
  <script lang="ts">
  import { useConfigStore } from '@/stores/config';
  import { defineComponent } from 'vue';
  import s3tConfig from '../configs/s3t-config.json'
  import scenarioConfig from '../configs/scenario-config.json'
  import controlFlowConfig from '../configs/controlflow-config.json'
  import dataFlowConfig from '../configs/dataflow-config.json'
  import substructuresConfig from '../configs/substructures-config.json'
  import hectorschoolConfig from '../configs/hectorschool-config.json'
  import { mapStores } from 'pinia';
  import type { ConfigData } from '../stores/config'
  import { useNetStore } from '@/stores/net';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
	setup() {
	  const configStore = useConfigStore();
	  const netStore = useNetStore();
	  const router = useRouter();
  
	  const loadConfig = (configID: string | undefined) => {
		if (configID === "scope3tool") {
		  configStore.loadConfig(s3tConfig as ConfigData);
		} else if (configID === "scenario") {
		  configStore.loadConfig(scenarioConfig as ConfigData);
		} else if (configID === "controlflow") {
		  configStore.loadConfig(controlFlowConfig as ConfigData);
		} else if (configID === "dataflow") {
		  configStore.loadConfig(dataFlowConfig as ConfigData);
		} else if (configID === "substructures") {
		  configStore.loadConfig(substructuresConfig as ConfigData);
		} else if (configID === "hectorschool") {
		  configStore.loadConfig(hectorschoolConfig as ConfigData);
		}
	  };
  
	  const loadModel = (modelID: string | undefined) => {
		if (modelID) {
		  const model = configStore.examples.find(example => example.name === modelID);
		  if (model) {
			netStore.import(model.net);
		  }
		}
	  };
  
	  return { loadConfig, loadModel, router }
	},
	mounted() {
	  const configID = this.$route.params.configID;
	  const modelID = this.$route.params.modelID;
	  this.loadConfig(configID);
	  this.loadModel(modelID);
  
	  // Navigate to NetEditor once the config and model are loaded
	  this.router.push('/');
	}
  })
  </script>
  