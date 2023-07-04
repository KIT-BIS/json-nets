<template>
  <label class="label has-text-white">Examples for Jsonnet expressions</label>
  <!--TODO Könnte man als component verwenden wenn in outbound modal nochmal verwendet-->
  <div class="accordion">
    <div class="accordion-item" v-for="(item, index) in examples" :key="index">
      <button class="button is-ghost has-text-white" @click="toggleAccordion(index)">
        {{ item.question }}
      </button>
      <button class="button is-ghost has-text-white is-pulled-right" @click="toggleAccordion(index)">
        <font-awesome-icon v-if="!item.isExpanded" icon="fas fa-plus-circle" style="margin-top: 5px" />
        <font-awesome-icon v-if="item.isExpanded" icon="fas fa-minus-circle" style="margin-top: 5px" />
      </button>
      <div class="accordion-content" v-show="item.isExpanded" style="margin-left: 1rem; margin-right: 1rem">
        <StaticCodeEditor class="my-1" :content="item.answer" language="jsonnet" />
        <div class="level my-1">
          <div class="level-left">
            <p class="level-item">Inscription evaluates to:</p>
          </div>
          <div class="level-item">
            <StaticCodeEditor class="jsn-evaluation-editor" :content="JSON.stringify(item.evaluation, null, 2)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    examples: {
      type: Array<{ question: string, isExpanded: boolean, evaluation: any, answer: string}>,
      required: true
    }
  },
  methods: {
    toggleAccordion(index: number) {
      if (this.examples[index].isExpanded === false) {
        this.examples[index].isExpanded = true
      } else {
        this.examples[index].isExpanded = false
      }

    }
  }
})
</script>

<style>
.accordion .accordion-item {
  border-bottom: 1px solid lightgray;
}
</style>