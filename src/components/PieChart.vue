<template>
    <v-chart class="chart" :option="indicatorStore.pieOption" autoresize />
</template>
<script lang="ts">
import type { ComposeOption } from 'echarts/core'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption
} from 'echarts/components'

type EChartsOptionZ = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>

use([TitleComponent, TooltipComponent, LegendComponent, PieChart ])

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, defineComponent } from 'vue';

import { useIndicatorStore } from '@/stores/indicator';

import { mapStores } from 'pinia';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const key = <string><unknown>THEME_KEY;

export default defineComponent({
  name: 'Contributions',
  // components: {
    // VChart,
  // },
  provide: {
    [key]: 'light',
  },
  computed: {
    ...mapStores(useIndicatorStore),
  },
  setup() {
    // const option = ref();

    // return { option };
  },
});
</script>

<style scoped>
.chart {
  width: 50vh;
  height: 50vh;
}
</style>