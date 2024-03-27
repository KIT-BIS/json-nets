<template>
  <!-- <div id="indicator-panel" class="mt-5 has-text-centered p-5" -->
  <!-- <div v-if="indicatorState.selectedPlaceID !== 'none'"> -->
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
      <!-- <span class="is-italic has-text-weight-normal">(Primärdatenanteil: X)</span> -->
    </p>
    <!-- <p class="is-italic">Primärdatenanteil: {{ indicatorStore.indicatorValue }}</p> -->
    <!-- <p class="subtitle is-5">{{ indicatorStore.placeName }}</p> -->
    <!-- <PieChart v-if="indicatorStore.indicatorType == 'pcf-pie'"/> -->
  </div>


  <div class="block">
    <SankeyChart v-if="indicatorStore.indicatorType == 'pcf-sankey'" />
    <SunburstChart v-if="indicatorStore.indicatorType == 'pcf-sunburst'" />
    <!-- <div v-else> -->
    <!-- <span>Wähle eine Stelle aus, um die Indikatorwerte anzuzeigen.</span> -->
    <!-- </div> -->
  </div>

</template>
<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { useIndicatorStore } from '../../stores/indicator'
import SankeyChart from './SankeyChart.vue';
import SunburstChart from './SunburstChart.vue';

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