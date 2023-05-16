<script lang="ts">
import { useUiStateStore } from '@/stores/uiState';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const uiState = useUiStateStore();
        return { uiState };
    },
    props: {
        icon: String,
//        isActive: Boolean,
        mode: String
    },
    computed: {
        notActive() {
            return this.mode !== this.uiState.mode;
        }
    },
    methods: {
        setMode() {
            console.log("setting mode " + this.mode)
            this.uiState.setMode(this.mode);
            //callback();
            //event.stopPropagation()
        }
    }
})
//    @click=${ (event)  => {
//        callback();
//        event.stopPropagation();
//      }}
</script>

<template>
<button 
  class="button is-primary" :class="{ 'is-outlined': notActive }" @click.stop="setMode">
<span class="icon is-small">
    <font-awesome-icon :icon="icon" />
</span>
</button>
</template>
