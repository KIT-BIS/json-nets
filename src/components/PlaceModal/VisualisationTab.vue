<template>
  <div class="block">
    <div class="field" v-if="visualisations">
      <label class="label is-small">Available visualisations and indicators:</label>
      <div class="select is-small">
        <!-- <select v-model="indicatorStore.indicatorType" @change="indicatorStore.updateIndicator()"> -->
          <select @change="onVisualisationSelect">
            <option v-for="(vis,index) in visualisations" :value="index">{{vis.description}}</option>

          </select>
      </div>

      <!-- <div v-if="false"> -->
        <!-- <select v-model="indicatorStore.indicatorType" @change="indicatorStore.updateIndicator()"> -->
          <!-- <option value="pcf-sankey">THG-Fußabdruck (Sankey)</option> -->
          <!-- <option value="pcf-sunburst">THG-Fußabdruck (Sunburst)</option> -->
          <!-- <option value="pds">Primärdatenanteil</option> -->
        <!-- </select> -->
      <!-- </div> -->
      <!-- <div v-else class="select is-small"> -->
        <!-- <select v-model="indicatorStore.customIndicatorType" @change="indicatorStore.updateCustomIndicator()"> -->
          <!-- <option value="sankey">Sankey</option> -->
          <!-- <option value="sunburst">Sunburst</option> -->
          <!-- <option value="number">Value</option> -->
        <!-- </select> -->
      <!-- </div> -->
    </div>
    <div v-else class="notification is-info is-light is-size-7">
      No visualisations available.
    </div>
    <!-- <div class="field"> -->
      <!-- <label class="label is-small">Path: -->
      <!-- </label> -->
      <!-- <div class="control" :style="{ width: '200px' }"> -->
        <!-- <input class="input is-small" v-model="indicatorStore.valuePath"> -->
      <!-- </div> -->
    <!-- </div> -->
    <!-- <button class="button is-small is-primary" @click="indicatorStore.updateCustomIndicator()">Update</button> -->
  </div>
  <div class="block">
    <CustomNumber v-if="indicatorStore.visualisationData.type === 'number'" />
    <CustomSunburst v-else-if="indicatorStore.visualisationData.type === 'sunburst'" />
  </div>
  <!-- <div class="block"> -->
  <!-- <p class="has-text-weight-bold">Gesamtwert: {{ indicatorStore.indicatorValue }} -->
  <!-- </p> -->
  <!-- </div> -->
  <!-- <div class="block"> -->
  <!-- <SankeyChart v-if="indicatorStore.indicatorType == 'pcf-sankey'" /> -->
  <!-- <SunburstChart v-if="indicatorStore.indicatorType == 'pcf-sunburst'" /> -->
  <!-- </div> -->

</template>
<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

import { useIndicatorStore } from '../../stores/indicator'
import { useConfigStore } from '@/stores/config';

import SankeyChart from './SankeyChart.vue';
import SunburstChart from './SunburstChart.vue';
import CustomNumber from './Visualisations/CustomNumber.vue';
import CustomSunburst from './Visualisations/CustomSunburstChart.vue';
import { usePlacesStore } from '@/stores/place';

export type VisualisationData = {
  description: string
  type: "number" | "sunburst"
}

/**
 * A tab that provides different options to visualise marking data. Currently only works with scope3tool configuration.
 * Todo: Develop general visualisation concept.
 */
export default defineComponent({
  components: {
    SankeyChart,
    SunburstChart,
    CustomNumber,
    CustomSunburst
  },
  computed: {
    ...mapStores(useIndicatorStore),
    ...mapStores(useConfigStore),
    ...mapStores(usePlacesStore),
    visualisations(): Array<VisualisationData> | false {
      // Todo: by convention, visualisation data is pulled from first token, $visualisations field
      // provide documentation (also in UI), maybe allow to visualise also other tokens
      const visualisations = this.placesStore.place.marking[0]["$visualisations"];
      if (visualisations) {
        return <Array<VisualisationData>> visualisations;
      } else {
        return false
      }
    }
  },
  mounted() {
      if (this.visualisations) {
        this.indicatorStore.setVisualisationData(this.visualisations[0]);
      }
    // this.indicatorStore.updateIndicator();
    // this.indicatorStore.updateCustomIndicator();
  },
  methods: {
    onVisualisationSelect(event: Event) {
      const index = Number((event.target as HTMLInputElement).value);
      // console.log(event.target.value);
      if (this.visualisations) {
        this.indicatorStore.setVisualisationData(this.visualisations[index]);
      }
    }
  }
});
</script>