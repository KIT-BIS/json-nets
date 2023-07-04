<script lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

export default defineComponent({
  props: {
    icon: String,
    mode: {
      type: String,
      required: true
    },
    callback: Function
  },
  computed: {
    notActive() {
      return this.mode !== this.uiStateStore.mode
    },
    ...mapStores(useUiStateStore)
  },
  methods: {
    onClick() {
      if (this.callback === undefined) {
        this.uiStateStore.setMode(this.mode)
      } else {
        this.uiStateStore.setMode(this.mode)
        this.callback()
      }
    }
  }
})
</script>

<template>
  <button class="button is-primary" :class="{ 'is-outlined': notActive }" @click.stop="onClick">
    <span class="icon is-small">
      <font-awesome-icon :icon="icon" />
    </span>
  </button>
</template>

<style scoped>
button,
input {
  margin-left: 15px;
}
</style>
