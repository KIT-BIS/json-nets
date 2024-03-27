
<template>
    <v-chart class="chart" :option="indicatorStore.sunburstOption" autoresize />
</template>
<script lang="ts">
import type { ComposeOption } from 'echarts/core'
import type { SunburstSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption
} from 'echarts/components'

type EChartsOptionZ = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | SunburstSeriesOption
>

use([TitleComponent, TooltipComponent, LegendComponent, SunburstChart ])

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { SunburstChart } from 'echarts/charts';
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
  SunburstChart,
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
  width: 100vh;
  height: 70vh;
}
</style>