<template>
    <div class="block">
        <p class="has-text-weight-bold">
            {{ indicatorStore.numberData }}
        </p>
    </div>

</template>
<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

import { useIndicatorStore } from '../../../stores/indicator'

export default defineComponent({
    computed: {
        ...mapStores(useIndicatorStore)
    }
})

</script>