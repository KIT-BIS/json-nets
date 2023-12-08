<template>
    <v-chart class="chart" :option="indicatorStore.option" autoresize />
</template>
<script lang="ts">
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

export default defineComponent({
  name: 'Contributions',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  computed: {
    ...mapStores(useIndicatorStore)
  },
  data() {
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