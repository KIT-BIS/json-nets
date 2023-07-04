<template>
  <td>{{ desc }}</td>
  <td>
    <span class="is-clickable" @click="uiStateStore.setJsonPathQuery(querySnippet)" v-html="query"></span>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia'
import { useUiStateStore } from '@/stores/uiState'

export default defineComponent({
  props: {
    desc: String,
    query: String,
    querySnippet: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapStores(useUiStateStore)
  }
});
</script>