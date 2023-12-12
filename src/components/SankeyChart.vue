<template>
  <!-- <v-chart class="chart" :option="option" autoresize /> -->
    <v-chart class="chart" :option="indicatorStore.sankeyOption" autoresize />
</template>
<script lang="ts">
import { use } from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { ComposeOption } from 'echarts/core'
import type { SankeySeriesOption } from 'echarts/charts'

use([SankeyChart, CanvasRenderer])

type EChartsOption = ComposeOption<SankeySeriesOption>

import { ref, defineComponent } from 'vue';

import { useIndicatorStore } from '@/stores/indicator';

import { mapStores } from 'pinia';



// const key = <string><unknown>THEME_KEY;

export default defineComponent({
  name: 'Contributions',
  // components: {
  // VChart,
  // },
  // provide: {
  // [key]: 'light',
  // },
  computed: {
    ...mapStores(useIndicatorStore),
  },
  // setup() {
    // const option = ref();

    // return { option };
  // },
  setup() {
    const option = ref()
    return { option
    } as EChartsOption
  }
});
</script>

<style scoped>
.chart {
  width: 80vw;
  height: 50vh;
}
</style>