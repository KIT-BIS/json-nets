<template>
  <!-- TODO: this may be reworked to show Jsonnet on left side and evaluations on right side, similar to filter modal -->
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title">Outbound arc inscription</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <label class="label">Assignment selection
          <HelpButton
            help-text="
              Table shows tokens from pre-set places, filtered with JSONPath expression. If no
              tokens are visible, check inbound arc inscription first.
              " 
          />
        </label>
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Pre-set place</th>
              <th>
                Jsonnet variable 
                <HelpButton
                  help-text="
                    Click to insert variable at cursor position in Jsonnet code.
                  "
                />
              </th>
              <th>
                Input tokens
                <HelpButton
                  help-text="
                  Click to select a token for temporary assignment.
                  " 
                />
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
                    :token="JSON.stringify(doc, null, 2)"
                    :isSelected="isSelected(place.name, index)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <label class="label">
          Transition inscription (Jsonnet)
          <HelpButton 
            help-text="
              For more information about Jsonnet, please visit
              <a href='https://jsonnet.org/' target='_blank'>
                https://jsonnet.org/
              </a>.
            "
          />
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
                      <StaticCodeEditor :content="JSON.stringify(examples.student,null,2)"/>
                    </td>
                  </tr>
                  <tr>
                    <td>Request</td>
                    <td>request</td>
                    <td>
                      <StaticCodeEditor :content="JSON.stringify(examples.lecture,null,2)"/>
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
            placeholder="Define arc inscription in Jsonnet"
            v-model="uiStateStore.inspectorContent"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="onEditorReady"
          />
        </div>

        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item scoped-evaluation" >
                Evaluation of connected transition inscription:
              </p>
            </div>
            <p
              class="level-item"
              :class="{
                'scoped-green-background': uiStateStore.transitionInscriptionValid,
                'scoped-red-background': !uiStateStore.transitionInscriptionValid
              }"
            >
              {{ uiStateStore.inscriptionEvaluationResult }}
            </p>
          </div>
        </div>
        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item scoped-evaluation">Evaluation of arc inscription:</p>
            </div>
            <p v-if="!uiStateStore.outboundEvaluation"
              v-html="uiStateStore.outboundEvaluationResult"
              class="level-item scoped-red-background"
            ></p>
            <StaticCodeEditor v-if="uiStateStore.outboundEvaluation" :content="uiStateStore.outboundEvaluationResult" class="jsn-evaluation-editor"/>
          </div>
        </div>
        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item scoped-evaluation">
                Evaluation of token against connected place schema:
              </p>
            </div>
            <p
              v-html="uiStateStore.outboundSchemaEvaluationResult"
              class="level-item"
              :class="{
                'scoped-green-background': uiStateStore.outboundSchemaEvaluation,
                'scoped-red-background': !uiStateStore.outboundSchemaEvaluation
              }"
            ></p>
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
import HelpButton from '@/components/HelpButton.vue'
import StaticCodeEditor from '@/components/StaticCodeEditor.vue'
import TokenTag from '@/components/TokenTag.vue'
import OutboundArcModalAccordion from '@/components/OutboundArcModal/OutboundArcModalAccordion.vue'
import { shallowRef } from 'vue'
import { mapStores } from 'pinia'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useUiStateStore } from '@/stores/uiState'
import { setArcLabel } from '@/components/jsonnets/net.js'
import { defineComponent } from 'vue'
import { examples as _examples } from './OutboundArcModalExamples'
import { basicSetup } from 'codemirror';


export default defineComponent({
  components: {
    StaticCodeEditor,
    Codemirror,
    OutboundArcModalAccordion,
    HelpButton,
    TokenTag
  },
  setup() {
    // even though I'd like to rely on options API
    // it seems like using shallowRef is useful
    // for Codemirror's view
    // (and I don't know how this would work outside of setup)
    const view = shallowRef();
    const extensions = [basicSetup, json(), oneDark]
    return { view, extensions }
  },
  mounted() {
    this.updateEvaluation();
  },
  data() {
    const examples = _examples;
    return {
      examples,
      expandedExamples: false,
    }
  },
  watch: {
    'uiStateStore.inspectorContent'() {
        this.updateEvaluation();
    }
  },
  computed: {
    ...mapStores(useUiStateStore)
  },
  methods: {
    insertVariableName(varName: string) {
      const ranges = this.view.state.selection.ranges;
      const cursor = ranges[0].anchor;

      this.view.dispatch({
        changes: { from: cursor, insert: varName }
      })
    },
    isSelected(placeName: string, index: number) {
      if (this.uiStateStore.selectedForAssignment[placeName] 
          === index) {
        return true
      } else {
        return false
      }
    },
    onEditorReady(payload: any) {
      this.view = payload.view;
    },
    updateEvaluation() {
      this.uiStateStore.updateTransitionEvaluation()
      this.uiStateStore.updateOutboundSchemaEvaluation()
      this.uiStateStore.updateOutboundEvaluation()
    },
    expandExamples() {
      this.expandedExamples = !this.expandedExamples
    },
    saveChanges() {
      setArcLabel(this.uiStateStore.lastSelectedID, this.uiStateStore.inspectorContent)

      this.close()
    },
    close() {
      this.uiStateStore.showPostsetModal = false
    }
  }
})
</script>

<style scoped>
.scoped-evaluation {
  width: 200px
}

.scoped-green-background {
  font-family: monospace;
  background-color: green;
  color: white;
  text-align: center;
  margin-left: 15px;
  padding: 5px 10px;
}

.scoped-red-background {
  font-family: monospace;
  background-color: #e20505;
  color: white;
  text-align: center;
  margin-left: 15px;
  padding: 5px 10px;
}
</style>
