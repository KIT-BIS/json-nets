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

<style lang="scss" scoped>
button,input {
  margin-left: 15px;
}
</style>
