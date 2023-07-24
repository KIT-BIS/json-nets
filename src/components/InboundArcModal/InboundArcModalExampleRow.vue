<template>
  <td>{{ desc }}</td>
  <td>
    <code class="is-clickable" @click="() => { callback() }" >{{ query }}</code>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    desc: String,
    query: String,
    callback: {
      required: true,
      type: Function
    }
  },
});
</script>