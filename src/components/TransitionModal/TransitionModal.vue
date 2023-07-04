<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title">Transition inscription</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name of the transition</label>
          <div class="control">
            <input class="input" type="text" v-model="uiStateStore.itemName" />
          </div>
        </div>
        <label class="label"
          >Assignment selection
          <HelpButton 
            help-text="
              Table shows tokens from pre-set places, filtered with JSONPath expression. If no
              tokens are visible, check inbound arc inscription first.
            "/>
        </label>
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Pre-set place</th>
              <th>
                Jsonnet variable
                <HelpButton help-text="
                  Click to insert variable at cursor position in Jsonnet code.
                "/>
              </th>
              <th>
                Input tokens
                <HelpButton help-text="
                  Click to select a token for temporary assignment.
                "/>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="place in uiStateStore.inputTokensArray">
              <td>{{ place.name }}</td>
              <td>
                <code class="is-clickable" @click="insertVariableName(place.name.toLowerCase())">{{
                  place.name.toLowerCase()
                }}</code>
              </td>
              <td>
                <div class="tags">
                  <TokenTag v-for="(doc, index) in place.documents"
                    :callback="() => { uiStateStore.addDocumentToTempAssignment(place.name, doc, index) }"
                    :is-selected="isSelected(place.name, index)"
                    :token="JSON.stringify(doc, null, 2)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <label class="label">
          Transition inscription (Jsonnet)
          <HelpButton help-text="
            Note that jsonnet expressions in transition inscriptions must evaluate to true
            or false! For more information about Jsonnet, please visit
            <a href='https://jsonnet.org/' target='_blank'>https://jsonnet.org/</a>
          "/>
        </label>
        <div class="notification is-info">
          <div v-if="expandedExamples == false">
            <div class="block">
              <span @click="expandExamples" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-plus-circle"
              /></span>
              <span>Expand example for Jsonnet expressions</span>
            </div>
          </div>
          <div v-if="expandedExamples == true">
            <!--TODO Könnte man als component verwenden wenn in outbound modal nochmal verwendet-->
            <div class="block">
              <span @click="expandExamples" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-minus-circle"
              /></span>
              <span>Minimize example for Jsonnet expression</span>
            </div>

            <div class="block">
              <label class="label has-text-white">Example variable assignment</label>
              <table class="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Pre-set place</th>
                    <th>Jsonnet variable</th>
                    <th>Variables</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Student</td>
                    <td>student</td>
                    <td>
                      <StaticCodeEditor  :content="JSON.stringify(examples.student, null, 2)" />
                    </td>
                  </tr>
                  <tr>
                    <td>Request</td>
                    <td>request</td>
                    <td>
                      <StaticCodeEditor  :content="JSON.stringify(examples.request, null, 2)" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="block">
              <OutboundArcModalAccordion :examples="examples.jsonnet"/>
            </div>
          </div>
        </div>

        <div class="block">
          <Codemirror
            v-model="uiStateStore.inspectorContent"
            placeholder="Define transition inscription in Jsonnet"
            :style="{ height: '200px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="onEditorReady"
          />
            <!-- @update="handleCodeChange" -->
        </div>
        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item">Inscription evaluates to:</p>
            </div>
            <p
              class="level-item"
              :class="{
                'jsn-green-background': uiStateStore.transitionInscriptionValid,
                'jsn-red-background': !uiStateStore.transitionInscriptionValid
              }"
            >
              {{ uiStateStore.inscriptionEvaluationResult }}
            </p>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="saveChanges">Save changes</button>
        <button class="button" @click="close()">Close</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useUiStateStore } from '@/stores/uiState'
import { setTransitionContent } from '@/jsonnets/net'
import HelpButton from '@/components/_shared/HelpButton.vue'
import TokenTag from '@/components/_shared/TokenTag.vue'
import OutboundArcModalAccordion from '@/components/OutboundArcModal/OutboundArcModalAccordion.vue'
import { examples } from './TransitionModalExamples'
import StaticCodeEditor from '@/components/_shared/StaticCodeEditor.vue'
import { mapStores } from 'pinia'

export default {
  components: {
    Codemirror,
    HelpButton,
    OutboundArcModalAccordion,
    TokenTag,
    StaticCodeEditor
  },
  setup() {
    const extensions = [json(), oneDark]
    const view = shallowRef()
    return {
      extensions,
      view
    }
  },
  data() {
    return {
      examples,
      expandedExamples: false,
      inscriptionEvaluated: false,
    }
  },
  computed: {
    ...mapStores(useUiStateStore)
  },
  watch: {
    'uiStateStore.inspectorContent'() {
      //TODO: better a method of component rather than store?
      this.uiStateStore.updateTransitionEvaluation()
    }
  },
  methods: {
    onEditorReady(payload: any) {
      this.view = payload.view;
    },
    insertVariableName(varName: string) {
      const ranges = this.view.state.selection.ranges
      const cursor = ranges[0].anchor

      this.view.dispatch({
        changes: { from: cursor, insert: varName }
      })
    },
    isSelected(placeName: string, index: number) {
      if (this.uiStateStore.selectedForAssignment[placeName] === index) {
        return true
      } else {
        return false
      }
    },
    expandExamples() {
      this.expandedExamples = !this.expandedExamples
    },
    saveChanges() {
      setTransitionContent(
        this.uiStateStore.lastSelectedID,
        this.uiStateStore.inspectorContent,
        this.uiStateStore.itemName
      )
      this.close()
    },
    close() {
      this.uiStateStore.setShowTransitionModal(false)
    }
  }
}
</script>@/jsonnets/net