<template>
  <div class="dropdown is-hoverable is-right">
    <div class="dropdown-trigger">
      <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle" /></span>
    </div>
    <div class="dropdown-menu">
      <div class="dropdown-content">
        <div class="dropdown-item">
          <p v-html="helpText"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    helpText: String
  }
})
</script>
 