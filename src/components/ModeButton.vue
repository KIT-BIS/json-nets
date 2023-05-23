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
        mode: String,
        callback: Function
    },
    computed: {
        notActive() {
            // TODO: I want upload button to never be active - this is a hacky solution
            //if (this.callback !== undefined) {
            //    return true;
            //}
            return this.mode !== this.uiState.mode;
        }
    },
    methods: {
        onClick() {
            if (this.callback === undefined) {
                this.uiState.setMode(this.mode);
            } else {
                this.uiState.setMode(this.mode);
                this.callback();
            }
        }
    }
})
</script>

<template>
<button 
  class="button is-primary" :class="{ 'is-outlined': notActive }" @click.stop="onClick">
<span class="icon is-small">
    <font-awesome-icon :icon="icon" />
</span>
</button>
</template>
<style scoped>
button,input {
  margin-left: 15px;
}
</style>
