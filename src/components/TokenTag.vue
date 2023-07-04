<template>
  <span 
    class="tag has-tooltip-bottom"
    @click="callback()" 
    :data-tooltip="token"  
    :class="{
      'is-light': !isSelected,
      'is-primary': isSelected
    }">
    {{ shortenString(token) }}

    <button v-if="isDeletable" class="delete is-small" @click.stop="() => { if(deletableCallback) deletableCallback()}"></button>
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    callback: {
      type: Function,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    isSelected: Boolean,
    isDeletable: Boolean,
    deletableCallback: Function
  },
  methods: {
    shortenString(string: String) {
      if (string.length <= 25) {
        return string
      } else {
        return string.slice(0, 22) + '...'
      }
    }
  }
})
</script>