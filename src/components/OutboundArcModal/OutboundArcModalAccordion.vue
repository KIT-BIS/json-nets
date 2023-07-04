<template>
  <label class="label has-text-white">Examples for Jsonnet expressions</label>
  <div class="accordion">
    <div class="scoped-accordion-item" v-for="(item, index) in examples" :key="index">
      <button class="button is-ghost has-text-white" @click="toggleAccordion(index)">
        {{ item.question }}
      </button>
      <button class="button is-ghost has-text-white is-pulled-right" @click="toggleAccordion(index)">
        <font-awesome-icon v-if="!item.isExpanded" icon="fas fa-plus-circle scoped-accordion-button" />
        <font-awesome-icon v-if="item.isExpanded" icon="fas fa-minus-circle scoped-accordion-button" />
      </button>
      <div class="scoped-accordion-content" v-show="item.isExpanded">
        <StaticCodeEditor class="my-1" :content="item.answer" language="jsonnet" />
        <div class="level my-1">
          <div class="level-left">
            <p class="level-item">Inscription evaluates to:</p>
          </div>
          <p v-if="item.evaluation === true" class="level-item jsn-green-background" style="margin-left: 15px">
            true
          </p>
          <p v-else-if="item.evaluation === false" class="level-item jsn-red-background" style="margin-left: 15px">
            false
          </p>
          <div v-else class="level-item">
            <StaticCodeEditor class="jsn-evaluation-editor" :content="JSON.stringify(item.evaluation, null, 2)" />
          </div>
        </div>
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

.scoped-accordion-item {
  border-bottom: 1px solid lightgray;
}
</style>