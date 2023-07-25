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
            <input class="input" type="text" v-model="transitionName" />
          </div>
        </div>
        <div class="block">
        <label class="label">
          Filter Assignment (preset)
          <HelpButton 
            help-text="
              Table shows tokens from pre-set places, filtered with JSONPath expression. If no
              tokens are visible, check inbound arc inscription first.
            "/>
        </label>

          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <td>Preset place</td>
                <td>Filtered fragments</td>
                <td>
                  Fragment variable
                  <HelpButton help-text="
                  Click to insert variable at cursor position in Jsonnet code.
                "/>
                </td>
                <td>
                  Key variable
                  <HelpButton help-text="
                  Click to select a token for temporary assignment.
                "/>
                </td>
                <td>
                  Token variable
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="arc in presetArray">
                <td>{{ arc.place.name }}</td>
                <td>
                  <div class="tags">
                    <TokenTag v-for="(filter, index) in arc.applyFilterExpression(arc.filterExpression)"
                      :callback="() => { selectFragment(arc, index) }"
                      :is-selected="selectedFragments[arc.id] === index"
                      :token="JSON.stringify(filter.fragment, null, 2)"
                    />
                  </div>

                  <!-- <code class="is-clickable" @click="insertVariableName(place.name.toLowerCase())">{{ -->
                    <!-- place.name.toLowerCase() -->
                  <!-- }}</code> -->
                </td>
                <td>
                  <code class="has-tooltip-bottom" :data-tooltip="JSON.stringify(selectedFragmentValues[arc.fragmentVarName],null,2)">{{ arc.fragmentVarName }}</code>
                </td>
                <td><code class="has-tooltip-bottom" :data-tooltip="selectedKeyValues[arc.keyVarName]">{{ arc.keyVarName }}</code></td>
                <td><code class="has-tooltip-bottom" :data-tooltip="JSON.stringify(selectedTokenValues[arc.tokenVarName],null,2)">{{ arc.tokenVarName }}</code></td>
              </tr>
            </tbody>
        
              </table>
</div>
              <div class="block">
        <label class="label">
          Filter Assignment (postset)
          <HelpButton 
            help-text="
              Table shows tokens from pre-set places, filtered with JSONPath expression. If no
              tokens are visible, check inbound arc inscription first.
            "/>
        </label>



          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <td>Postset place</td>
                <td>Filtered fragments</td>
                <td>
                  Fragment variable
                  <HelpButton help-text="
                  Click to insert variable at cursor position in Jsonnet code.
                "/>
                </td>
                <td>
                  Key variable
                  <HelpButton help-text="
                  Click to select a token for temporary assignment.
                "/>
                </td>
                <td>
                  Token variable
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="arc in postsetArray">
                <td>{{ arc.place.name }}</td>
                <td>
                  <div class="tags">
                    <TokenTag v-for="(filter, index) in arc.applyFilterExpression(arc.filterExpression)"
                      :callback="() => { selectFragment(arc, index) }"
                      :is-selected="selectedFragments[arc.id] === index"
                      :token="JSON.stringify(filter.fragment, null, 2)"
                    />
                  </div>

                  <!-- <code class="is-clickable" @click="insertVariableName(place.name.toLowerCase())">{{ -->
                    <!-- place.name.toLowerCase() -->
                  <!-- }}</code> -->
                </td>
                <td>
                  <code class="has-tooltip-bottom" :data-tooltip="JSON.stringify(fragmentEvaluationResults[arc.fragmentVarName],null,2)">{{ arc.fragmentVarName }}</code>
                </td>
                <td><code class="has-tooltip-bottom" :data-tooltip="JSON.stringify(keyEvaluationResults[arc.keyVarName],null,2)">{{ arc.keyVarName }}</code></td>
                <td><code class="has-tooltip-bottom" :data-tooltip="JSON.stringify(selectedTokenValues[arc.tokenVarName],null,2)">{{ arc.tokenVarName }}</code></td>
              </tr>
            </tbody>
        
              </table>
</div>
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
          <div class="columns">
            <div class="column is-one-fifth">Preface:</div>
            <div class="column">
             <!-- @update="handleCodeChange" -->
            <Codemirror
              v-model="jsonnetPreface"
              placeholder="Define preface for transition inscription in Jsonnet"
              :style="{ height: '200px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              @update="updateEvaluation"
            />
 
              <!-- @ready="onEditorReady" -->
            </div>

          </div>
          <div v-for="(arc, index) in postsetArray" class="columns">
            <div  class="column is-one-fifth">Variable assignment (<span class="is-family-code">{{ arc.fragmentVarName }}</span>):</div>
            <div class="column">
            <Codemirror
              v-model="fragmentVarSnippets[arc.fragmentVarName]"
              placeholder="Define variable assignment in Jsonnet"
              :style="{ height: '200px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              @update="updateEvaluation"
            />
              <!-- TODO: enable variable insertion @ready="onEditorReady" -->
            <p 
              :class="{
                  'jsn-green-background': fragmentEvaluationValid[arc.fragmentVarName],
                  'jsn-red-background': !fragmentEvaluationValid[arc.fragmentVarName]
                }"

            >{{ fragmentEvaluationResults[arc.fragmentVarName] }}</p>
            </div>
            <div  class="column is-one-fifth">Variable assignment (<span class="is-family-code">{{ arc.keyVarName }}</span>):</div>
            <div class="column">
            <Codemirror
              v-model="keyVarSnippets[arc.keyVarName]"
              placeholder="Define variable assignment in Jsonnet"
              :style="{ height: '50px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              @update="updateEvaluation"
            />
              <!-- TODO: enable variable insertion @ready="onEditorReady" -->
            <p 
              :class="{
                  'jsn-green-background': keyEvaluationValid[arc.keyVarName],
                  'jsn-red-background': !keyEvaluationValid[arc.keyVarName]
                }"

            >{{ keyEvaluationResults[arc.keyVarName] }}</p>
            </div>

          </div>
          <div class="columns">
            <div class="column is-one-fifth">Guard:</div>

            <div class="column">
            <Codemirror
              v-model="jsonnetGuard"
              placeholder="Define transition guard in Jsonnet"
              :style="{ height: '200px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
              @update="updateEvaluation"
            />
              <!-- @ready="onEditorReady" -->
            <p 
              :class="{
                  'jsn-green-background': guardEvaluationValid,
                  'jsn-red-background': !guardEvaluationValid
                }"

            >{{ guardEvaluationResult }}</p>

            </div>
          </div>
 
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
import { defineComponent } from 'vue'
import { Net } from '@/json-nets/Net'
import type { Arc } from '@/json-nets/Arc'
import type { JSONValue, JSONObject } from '@/util/jsonOperations'
import { toRaw } from 'vue'
import { evaluateExpression } from '@/util/jsonnet'
import { mapStateToControlWithDetailProps } from '@jsonforms/core'

export default defineComponent({
  components: {
    Codemirror,
    HelpButton,
    OutboundArcModalAccordion,
    TokenTag,
    StaticCodeEditor
  },
  props: {
    net: {
      type: Net,
      required: true
    }
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

      transitionName: '',
      jsonnetPreface: '',
      jsonnetGuard: '',
      presetArray: [] as Array<Arc>,
      postsetArray: [] as Array<Arc>,
      fragmentVarSnippets: {} as Record<string, string>,
      fragmentEvaluationResults: {} as Record<string, JSONValue>,
      fragmentEvaluationValid: {} as Record<string, boolean>,

      keyVarSnippets: {} as Record<string, string>,
      keyEvaluationResults: {} as Record<string, JSONValue>,
      keyEvaluationValid: {} as Record<string, boolean>,

      guardEvaluationResult: '',
      guardEvaluationValid: false,

      selectedFragments: {} as Record<string, number>,
      selectedKeyValues: {} as Record<string, string | number>,
      selectedFragmentValues: {} as Record<string, JSONValue>,
      selectedTokenValues: {} as Record<string, JSONObject>
    }
  },
  computed: {
    ...mapStores(useUiStateStore)
  },
  watch: {
    // 'uiStateStore.inspectorContent'() {
    //TODO: better a method of component rather than store?
    // this.uiStateStore.updateTransitionEvaluation()
    // }
  },
  mounted() {
    const transition = this.net.findTransition(this.uiStateStore.lastSelectedID)
    if (!transition) return;
    this.transitionName = transition.name;
    //@ts-ignore
    this.postsetArray = transition.postset;
    this.presetArray = transition.preset;
    this.fragmentVarSnippets = JSON.parse(JSON.stringify(transition.fragmentVarSnippets));
    this.keyVarSnippets = JSON.parse(JSON.stringify(transition.keyVarSnippets));
    // TODO: will this directly change the guard ... it should not.
    this.jsonnetGuard = transition.guard;
    // console.log("fragment var snippets")
    // console.log(toRaw(this.fragmentVarSnippets));
    //
    //        const inputTokens = []
    //        for (let i = 0; i < transition.preset.length; i++) {
    //          const name = transition.preset[i].place.name
    //          const documents = transition.preset[i].applyFilter()
    //          inputTokens.push({ name, documents })
    //        }
    //        this.inputTokensArray = inputTokens
    //        this.tempAssignment = {}
    //        this.selectedForAssignment = {}
    //        // Todo: give feedback specifically when not all variables are selected.
    //        // Todo: show jsonnet feedback when error occurs
    //        this.inscriptionEvaluationResult = 'false'
    //        this.setInspectorContent(String(transition.content))
    //        this.setItemName(transition.name)
    //      
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
    selectFragment(arc: Arc, index: number) {
      this.selectedFragments[arc.id] = index;
      const filterAssignments = arc.applyFilterExpression(arc.filterExpression);
      if (arc.type === "preset") {
        this.selectedKeyValues[arc.keyVarName] = filterAssignments[index].key;
        this.selectedFragmentValues[arc.fragmentVarName] = filterAssignments[index].fragment;
      }
      this.selectedTokenValues[arc.tokenVarName] = filterAssignments[index].token;
      this.updateEvaluation();
    },
    expandExamples() {
      this.expandedExamples = !this.expandedExamples
    },
    updateEvaluation() {
      let allSelected = false;
      if (Object.keys(this.selectedFragments).length === (this.presetArray.length + this.postsetArray.length)) {
        allSelected = true;
      }
      let variables = {
        ...toRaw(this.selectedKeyValues),
        ...toRaw(this.selectedFragmentValues),
        ...toRaw(this.selectedTokenValues)
      }


      const fragmentVars = Object.keys(this.fragmentVarSnippets)
      for (let i = 0; i < fragmentVars.length; i++) {
        if (!allSelected) {
          this.fragmentEvaluationValid[fragmentVars[i]] = false;
          this.fragmentEvaluationResults[fragmentVars[i]] = "Select a complete filter assignment first.";
        } else {
          let snippet = this.jsonnetPreface;
          snippet += this.fragmentVarSnippets[fragmentVars[i]] + fragmentVars[i]
          const result = evaluateExpression(snippet, variables, this.transitionName);
          this.fragmentEvaluationValid[fragmentVars[i]] = !result.hasError;
          if (result.hasError) {
            this.fragmentEvaluationResults[fragmentVars[i]] = result.error;
          } else {
            this.fragmentEvaluationResults[fragmentVars[i]] = result.evaluation;
          }
        }
      }

      const keyVars = Object.keys(this.keyVarSnippets)
      for (let i = 0; i < keyVars.length; i++) {
        if (!allSelected) {
          this.keyEvaluationValid[keyVars[i]] = false;
          this.keyEvaluationResults[keyVars[i]] = "Select a complete filter assignment first.";
        } else {
          let snippet = this.jsonnetPreface;
          snippet += this.keyVarSnippets[keyVars[i]] + keyVars[i]
          const result = evaluateExpression(snippet, variables, this.transitionName);
          this.keyEvaluationValid[keyVars[i]] = !result.hasError;
          if (result.hasError) {
            this.keyEvaluationResults[keyVars[i]] = result.error;
          } else {
            this.keyEvaluationResults[keyVars[i]] = result.evaluation;
          }
        }
      }

      if (!allSelected) {
        this.guardEvaluationValid = false;
        this.guardEvaluationResult = "Select a complete filter assignment first.";
        return;
      }

      let guardSnippet = this.jsonnetPreface;
      for (let i = 0; i < fragmentVars.length; i++) {
        guardSnippet += this.fragmentVarSnippets[fragmentVars[i]]
      }
      for (let i = 0; i < keyVars.length; i++) {
        guardSnippet += this.keyVarSnippets[keyVars[i]]
      }
      const transition = this.net.findTransition(this.uiStateStore.lastSelectedID);
      if (!transition) return;
      guardSnippet += this.jsonnetGuard;
      const result = evaluateExpression(guardSnippet, variables, this.transitionName);
      // this.guardEvaluationValid = !result.hasError;
      //if (returnValue === true) {
      //  return { evaluation: true, hasError: false }
      //} else if (returnValue === false) {
      //  // return false for any not-true value
      //  return { evaluation: false, hasError: false }
      //} else {
      //  const error = new Error('Jsonnet expression for ' + reference + ' does not return boolean value. Returned value is ' + result[0])
      //  throw error;
      //}

      if (result.hasError) {
        this.guardEvaluationResult = result.error;
        this.guardEvaluationValid = false
      } else {
        if (result.evaluation === true || result.evaluation === false ){
          this.guardEvaluationValid = true;
          this.guardEvaluationResult = result.evaluation;
        } else {
          this.guardEvaluationValid = false;
          this.guardEvaluationResult = "Guard expression must evaluate to true or false. Evaluation is: " + JSON.stringify(result.evaluation, null , 2);
        }
      }


    },
    saveChanges() {
      this.net.updateTransition(this.uiStateStore.lastSelectedID,
        this.transitionName)
      // setTransitionContent(
      // this.uiStateStore.lastSelectedID,
      // this.uiStateStore.inspectorContent,
      // this.uiStateStore.itemName
      // )
      this.close()
    },
    close() {
      this.uiStateStore.setModal('none')
    }
  }
})
</script>