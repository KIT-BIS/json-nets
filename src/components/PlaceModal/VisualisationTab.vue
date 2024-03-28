<template>
  <div class="block">
    <div class="field">
      <label class="label is-small">Visualisierung:</label>

      <div class="select mb-5 is-small">
        <select v-model="indicatorStore.indicatorType" @change="indicatorStore.updateIndicator()">
          <option value="pcf-sankey">THG-Fußabdruck (Sankey)</option>
          <option value="pcf-sunburst">THG-Fußabdruck (Sunburst)</option>
          <option value="pds">Primärdatenanteil</option>
        </select>
      </div>
    </div>
  </div>
  <div class="block">
    <p class="has-text-weight-bold">Gesamtwert: {{ indicatorStore.indicatorValue }}
    </p>
  </div>


  <div class="block">
    <SankeyChart v-if="indicatorStore.indicatorType == 'pcf-sankey'" />
    <SunburstChart v-if="indicatorStore.indicatorType == 'pcf-sunburst'" />
  </div>

</template>
<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

import { useIndicatorStore } from '../../stores/indicator'
import SankeyChart from './SankeyChart.vue';
import SunburstChart from './SunburstChart.vue';

/**
 * A tab that provides different options to visualise marking data. Currently only works with scope3tool configuration.
 * Todo: Develop general visualisation concept.
 */
export default defineComponent({
  components: {
    SankeyChart,
    SunburstChart
  },
  computed: {
    ...mapStores(useIndicatorStore)
  },
  mounted() {
    this.indicatorStore.updateIndicator();
  }
});
</script>