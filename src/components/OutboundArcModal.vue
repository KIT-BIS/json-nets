<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 80%">
      <header class="modal-card-head">
        <p class="modal-card-title">Outbound arc inscription</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>

      <section class="modal-card-body">
        <label class="label"
          >Assignment selection

          <div class="dropdown is-hoverable is-right">
            <div class="dropdown-trigger">
              <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle" /></span>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <div class="dropdown-item">
                  <p>
                    Table shows tokens from pre-set places, filtered with JSONPath expression. If no
                    tokens are visible, check inbound arc inscription first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </label>
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Pre-set place</th>
              <th>
                Jsonnet variable
                <div class="dropdown is-hoverable is-right">
                  <div class="dropdown-trigger">
                    <span class="icon is-small"
                      ><font-awesome-icon icon="fas fa-info-circle"
                    /></span>
                  </div>
                  <div class="dropdown-menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                        <p>Click to insert variable at cursor position in Jsonnet code.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th>
                Input tokens
                <div class="dropdown is-hoverable is-right">
                  <div class="dropdown-trigger">
                    <span class="icon is-small"
                      ><font-awesome-icon icon="fas fa-info-circle"
                    /></span>
                  </div>
                  <div class="dropdown-menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                        <p>Click to select a token for temporary assignment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="place in uiState.inputTokensArray">
              <td>{{ place.name }}</td>
              <td>
                <code class="is-clickable" @click="insertVariableName(place.name.toLowerCase())">{{
                  place.name.toLowerCase()
                }}</code>
              </td>
              <td>
                <div class="tags">
                  <span
                    @click="uiState.addDocumentToTempAssignment(place.name, doc, index)"
                    v-for="(doc, index) in place.documents"
                    :data-tooltip="JSON.stringify(doc, null, 2)"
                    class="tag has-tooltip-bottom"
                    :class="{
                      'is-light': !isSelected(place.name, index),
                      'is-primary': isSelected(place.name, index)
                    }"
                  >
                    {{ shorten(JSON.stringify(doc, null, 2)) }}
                  </span>
                </div>
              </td>
           </tr>
          </tbody>
        </table>
        <label class="label">
          Transition inscription (Jsonnet)
          <div class="dropdown is-hoverable is-right">
            <div class="dropdown-trigger">
              <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle" /></span>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <div class="dropdown-item">
                  <p>
                    For more information about Jsonnet, please visit
                    <a href="https://jsonnet.org/" target="_blank">https://jsonnet.org/</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </label>
        <div class="notification is-info">
          <div v-if="expanded == false">
            <div class="block">
              <span @click="expand" class="icon" style="cursor: pointer"
                ><font-awesome-icon icon="fas fa-plus-circle"
              /></span>
              <span>Expand example for Jsonnet expressions</span>
            </div>
          </div>
          <div v-if="expanded == true">
            <div class="block">
              <span @click="expand" class="icon" style="cursor: pointer"
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
                      [ { "id": 1, "name": "Alice",<br />
                      "age": 25, "email": "alice@uni.edu",<br />
                      "semester": 4, <br />
                      "lecturesNotYetDone": [ "Process Modeling", "Database Systems" ] } ]
                    </td>
                    <!-- <td>student.id=1 <br> student.name="Alice" <br> student.age=25 <br>
                                        student.email="alice@uni.edu" <br> student.semester=4 <br>
                                        student.lecturesNotYetDone=["Process Modeling", "Database Systems"] </td> -->
                  </tr>
                  <tr>
                    <td>Request</td>
                    <td>request</td>
                    <td>
                      [ { "id": 1, <br />
                      "lecture": "Process Modeling", "serviceFee": 15 } ]
                    </td>
                    <!-- <td> request.id=1 <br> request.lecture="Process Modeling" <br> request.serviceFee=15 -->
                    <!-- </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="block">
              <label class="label has-text-white">Examples for Jsonnet expressions</label>
              <!--TODO Könnte man als component verwenden wenn in outbound modal nochmal verwendet-->
              <div class="accordion">
                <div class="accordion-item" v-for="(item, index) in accordionItems" :key="index">
                  <button class="button is-ghost has-text-white" @click="toggleAccordion(index)">
                    {{ item.question }}
                  </button>
                  <button
                    class="button is-ghost has-text-white is-pulled-right"
                    @click="toggleAccordion(index)"
                  >
                    <font-awesome-icon
                      v-if="!item.isExpanded"
                      icon="fas fa-plus-circle"
                      style="margin-top: 5px"
                    />
                    <font-awesome-icon
                      v-if="item.isExpanded"
                      icon="fas fa-minus-circle"
                      style="margin-top: 5px"
                    />
                  </button>
                  <div
                    class="accordion-content"
                    v-show="item.isExpanded"
                    style="margin-left: 1rem; margin-right: 1rem"
                  >
                    <p v-html="insertLineBreak(item.answer)" class="answer"></p>
                    <div class="level">
                      <div class="level-left">
                        <p class="level-item">Inscription evaluates to:</p>
                      </div>
                      <p
                        class="level-item answer"
                        style="margin-left: 15px"
                        v-html="insertLineBreak(item.evaluation)"
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="block">
          <Codemirror
            v-model="uiState.inspectorContent"
            placeholder="Define arc inscription in Jsonnet"
            :style="{ height: '200px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="handleReady"
            @update="handleCodeChange"
          />
        </div>

        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item" style="width: 200px">
                Evaluation of connected transition inscription:
              </p>
            </div>
            <p
              class="level-item"
              :class="{
                'green-background': uiState.transitionInscriptionValid,
                'red-background': !uiState.transitionInscriptionValid
              }"
            >
              {{ uiState.inscriptionEvaluationResult }}
            </p>
          </div>
        </div>
        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item" style="width: 200px">Evaluation of arc inscription:</p>
            </div>
            <p
              v-html="insertLineBreak(uiState.outboundEvaluationResult)"
              class="level-item"
              :class="{
                answer: uiState.outboundEvaluation,
                'red-background': !uiState.outboundEvaluation
              }"
            ></p>
          </div>
        </div>
        <div class="block">
          <div class="level">
            <div class="level-left">
              <p class="level-item" style="width: 200px">
                Evaluation of token against connected place schema:
              </p>
            </div>
            <p
              v-html="insertLineBreak(uiState.outboundSchemaEvaluationResult)"
              class="level-item"
              :class="{
                'green-background': uiState.outboundSchemaEvaluation,
                'red-background': !uiState.outboundSchemaEvaluation
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
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { evaluate } from '../util/jsonnet.js'
import { useUiStateStore } from '@/stores/uiState'
//@ts-ignore
import { setArcLabel } from '@/components/jsonnets/net.js'

export default {
  name: 'OutboundArcModal',
  //props: ['modelValue', 'bindInput', 'bindJsonnet'],
  components: {
    Codemirror
  },
  setup() {
    const code = ref('')
    const extensions = [json(), oneDark]
    const view = shallowRef()
    const uiState = useUiStateStore()
    const handleReady = (payload) => {
      // console.log('ready')
      // console.log(payload)
      view.value = payload.view
    }
    return {
      code,
      extensions,
      handleReady,
      uiState,
      view
      //   insertText
    }
  },
  data() {
    return {
      result: false,
      input: [],
      variables: [],
      expanded: false,
      inscriptionEvaluated: false,
      accordionItems: [
        {
          question: 'Pass token unchanged',
          answer: 'request',
          evaluation: '{ "id": 1,\n "lecture": "Process Modeling" }',
          isExpanded: false
        },
        {
          question: 'Add attributes to existing token',
          answer: 'request\n{email: student.email}',
          evaluation: '{ "email": "alice@uni.edu",\n "id": 1,\n "lecture": "Process Modeling"}',
          isExpanded: false
        },
        {
          question: 'Create new token',
          answer:
            '{email: student.email,\n message: "The request for " + request.lecture + " was accepted."}',
          evaluation:
            '{ "email": "alice@uni.edu",\n "message": "The request for Process Modeling was accepted."}',
          isExpanded: false
        },
        {
          question: 'Definition of local variable and calculation',
          answer:
            'local tuitionPerSemester = 400;\n local calculateTotalTuition(tuitionPerSemester, numberSemester) = tuitionPerSemester * numberSemester;\n student\n{totalTuition: calculateTotalTuition(tuitionPerSemester, student.semester)}',
          evaluation:
            '{"age": 25,\n"email": "alice@uni.edu",\n "id": 1,\n "name": "Alice",\n "semester": 4,\n "totalTuition": 1600}',
          isExpanded: false
        },
        {
          question: 'Check whether an array contains a specific element',
          answer: 'request\n{accepted: std.member(student.lecturesNotYetDone, request.lecture)}',
          evaluation:
            '{"accepted": true,\n"id": 1,\n"lecture": "Process Modeling",\n"serviceFee": 15}',
          // \n Info: The function std.member(array, element) returns true if the array contains the element, otherwise false.',
          isExpanded: false
        },
        {
          question: 'Calculation with self',
          answer:
            'local tuitionPerSemester = 400;\n{semesterTuition: tuitionPerSemester,\ntotalCostThisSemester: self.semesterTuition + request.serviceFee}',
          evaluation: '{"semesterTuition": 400,\n "totalCostThisSemester": 415}',
          isExpanded: false
        }
      ]
    }
  },
  methods: {
    insertVariableName(varName) {
      const ranges = this.view.state.selection.ranges
      const cursor = ranges[0].anchor

      this.view.dispatch({
        changes: { from: cursor, insert: varName }
      })
    },
    isSelected(placeName, index) {
      if (this.uiState.selectedForAssignment[placeName] === index) {
        return true
      } else {
        return false
      }
    },
    shorten(string) {
      if (string.length <= 25) {
        return string
      } else {
        return string.slice(0, 22) + '...'
      }
    },
    handleCodeChange() {
      this.uiState.updateTransitionEvaluation()
      this.uiState.updateOutboundEvaluation()
      this.uiState.updateOutboundSchemaEvaluation()
    },
    expand() {
      this.expanded = !this.expanded
    },
    toggleAccordion(index) {
      if (this.accordionItems[index].isExpanded === false) {
        this.accordionItems[index].isExpanded = true
      } else {
        this.accordionItems[index].isExpanded = false
      }
    },
    insertLineBreak(text) {
      //TODO Ist wahrscheinlich auch hier und bei Outbound -> Component oder util (genauso bei expanded und toggleAccordion)
      return text.replace(/\n/g, '<br>')
    },
    saveChanges() {
      setArcLabel(this.uiState.lastSelectedID, this.uiState.inspectorContent)

      this.close()
    },
    close() {
      this.uiState.showPostsetModal = false
    }
  }
}
</script>

<style scoped>
.accordion .accordion-item {
  border-bottom: 1px solid lightgray;
}

.green-background {
  font-family: monospace;
  background-color: green;
  color: white;
  text-align: center;
  flex-grow: 1;
  margin-left: 15px;
  padding: 5px 10px;
}

.red-background {
  font-family: monospace;
  background-color: #e20505;
  color: white;
  text-align: center;
  flex-grow: 1;
  margin-left: 15px;
  padding: 5px 10px;
}

.answer {
  font-family: monospace;
  background-color: #282c34;
  color: #abb2bf;
  margin-left: 15px;
  padding: 5px 10px;
}

.accordion .accordion-content p {
  font-weight: 300;
  margin: 10px 0;
}
</style>
