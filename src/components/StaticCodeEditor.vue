<template>
  <Codemirror v-if="language === 'jsonnet'"
    v-model="content" 
    :disabled="true"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="jsonnetExtensions"
    :class="class"
  />
  <Codemirror v-if="language === 'json'"
    v-model="content" 
    :disabled="true"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="jsonExtensions"
    :class="class"
  />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import * as themes from '@uiw/codemirror-theme-material'
import { basicSetup } from 'codemirror';

export default defineComponent({
  components: {
    Codemirror
  },
  props: {
    content: String,
    language: {
      type: String,
      default: 'json'
    },
    class: String 
  },
  setup() {
  //Todo: JSON-Highlighting somehow still missing
    const jsonExtensions = [json(),oneDark]
    const jsonnetExtensions = [oneDark]
    return {
      jsonExtensions,
      jsonnetExtensions
    }

  },

})
</script>
