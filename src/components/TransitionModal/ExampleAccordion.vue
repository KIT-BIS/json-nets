<template>
  <div class="accordion">
    <div v-for="(item, index) in examples" :key="index">
      <button class="button is-ghost" @click="toggleAccordion(index)">
        {{ item.question }}
      </button>
      <button class="button is-ghost is-pulled-right" @click="toggleAccordion(index)">
        <font-awesome-icon v-if="!item.isExpanded" icon="fas fa-plus-circle scoped-accordion-button" />
        <font-awesome-icon v-if="item.isExpanded" icon="fas fa-minus-circle scoped-accordion-button" />
      </button>
      <div class="scoped-accordion-content jsn-code " v-show="item.isExpanded">
        <StaticCodeEditor class="my-1" :content="item.answer" language="jsonnet" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import StaticCodeEditor from '@/components/_shared/StaticCodeEditor.vue'

export default defineComponent({
  components: {
    StaticCodeEditor
  },
  props: {
    examples: {
      type: Array<{ question: string, isExpanded: boolean, evaluation: any, answer: string }>,
      required: true
    },
    isTransition: Boolean
  },
  methods: {
    toggleAccordion(index: number) {
      if (this.examples[index].isExpanded === false) {
        this.examples[index].isExpanded = true
      } else {
        this.examples[index].isExpanded = false
      }

    },
  }
})
</script>

<style scoped>
.scoped-accordion-button {
  margin-top: 5px
}

.scoped-accordion-content {
  margin-left: 1rem;
  margin-right: 1rem
}

</style>