
<template>
    <v-chart class="chart" :option="indicatorStore.sunburstOption" autoresize />
</template>
<script lang="ts">

import { defineComponent } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { SunburstChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

import { useIndicatorStore } from '@/stores/indicator';

import { mapStores } from 'pinia';

use([TitleComponent, TooltipComponent, LegendComponent, SunburstChart ])
use([
  CanvasRenderer,
  SunburstChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const key = <string><unknown>THEME_KEY;

/**
 * A sunburst chart to display marking data (data needs to be in a specific format, currently only works with scope3tool configuration).
 */
export default defineComponent({
  name: 'Contributions',
  provide: {
    [key]: 'light',
  },
  computed: {
    ...mapStores(useIndicatorStore),
  },
});
</script>

<style scoped>
.chart {
  width: 100vh;
  height: 70vh;
}
</style>