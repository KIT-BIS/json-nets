<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title" v-if="uiStateStore.showModal==='preset'">Inbound arc inscription</p>
        <p class="modal-card-title" v-if="uiStateStore.showModal==='postset'">Outbound arc inscription</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="addons">
            JSONPath expression 
            <HelpButton 
              help-text="
              For more information about JSONPath, visit 
              <a href='https://goessner.net/articles/JsonPath/' target='_blank'>
                https://goessner.net/articles/JsonPath/
              </a>.
              "
            />
         </label>
        </div>
        <div class="field">
          <p class="control is-expanded">
            <input
              class="input scoped-input"
              type="text"
              placeholder="Enter JSONPath expression"
              v-model="jsonPathExpression"
            />
          </p>
          <p class="help is-danger">{{ syntaxError }}</p>
        </div>
        <div class="notification is-info">
          <div v-if="!helpExpanded">
            <div class="block">
              <span @click="toggleExpand" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-plus-circle"
              /></span>
              <span>Expand templates for JSONPath expressions</span>
            </div>
          </div>
          <div v-if="helpExpanded">
            <div class="block">
              <span @click="toggleExpand" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-minus-circle"
              /></span>
              <span>Minimize templates for JSONPath expressions</span>
            </div>
            <div class="block">
              <table class="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Example</th>
                    <th>Filter command</th>
                    <th class="scoped-column">
                      JSONPath expression
                      <HelpButton help-text="Click on expressions to insert in input field."/>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(snippet, index) in jsonPathSnippets">
        
                    <td v-if="index === 0" rowspan="9">
                      <StaticCodeEditor :content="JSON.stringify(examples,null,2)"/>
                    </td>
                    <InboundArcModalExampleRow 
                      :desc="snippet.desc"
                      :query="snippet.query"
                      :callback="() => { jsonPathExpression = snippet.query }"
                    />
                  </tr>
               </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <div class="field">
              <label class="label">Input Marking</label>
              <div class="control">
                <Codemirror
                  class="scoped-codemirror"
                  :disabled="true"
                  v-model="inputTokensString"
                  placeholder="Input Marking"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  :extensions="extensions"
                />
              </div>
            </div>
          </div>
          <div class="column is-2 has-text-centered">
            <Arrow />
            <!-- <p class="scoped-arrow">&#10093;</p> -->
          </div>
          <div class="column is-5">
            <div class="field">
              <label class="label">Selected Values</label>
              <div class="control">
              <div v-if="filterAssignments.length === 0"><i>(no fragments selected)</i></div>
              <div v-if="filterAssignments.length > 0" class="tags block">
                  <!-- :callback="() => { selectToken(index) }" -->
                <TokenTag 
                  v-for="(filter, index) in filterAssignments"
                  :token="JSON.stringify(filter.fragment)"
                  :isSelected="index === selectedFragmentIndex"
                  :isDeletable="false"
                  :callback="() => { selectFragment(index); }"
                />
              </div>
            </div>
            </div>
            <label class="label">Resulting filter assignment</label>
            <div class="columns">
              <div class="column is-quarter">
                <span v-if="uiStateStore.showModal === 'preset'">Value to be removed:</span>
                <span v-if="uiStateStore.showModal === 'postset'">Value where fragment will be inserted:</span>
              </div>
                <div class="column is-three-quarters">
                    <Codemirror
                    class="scoped-codemirror"
                    :disabled="true"
                    v-model="fragmentString"
                    placeholder="Fragment to be removed"
                    :autofocus="true"
                    :indent-with-tab="true"
                    :tab-size="2"
                    :extensions="simpleExtensions"
                    />
                  </div>

            </div>
            <div class="columns" v-if="uiStateStore.showModal === 'preset'">
                    <div class="column is-quarter">Key of fragment:</div>
                    <div class="column is-three-quarters"><code>{{ keyString }}</code></div>
            </div>
            <div class="columns">

                    <div class="column is-quarter">Pathexpression:</div>
                    <div class="column is-three-quarters"><code>{{ pathExpression }}</code></div>
            </div>
            <div class="columns">

                    <div class="column is-quarter">Token containing fragment:</div>
                    <div class="column is-three-quarters">
                      <Codemirror
                    class="scoped-codemirror"
                    :disabled="true"
                    v-model="tokenString"
                    placeholder="Token containing fragment"
                    :autofocus="true"
                    :indent-with-tab="true"
                    :tab-size="2"
                    :extensions="simpleExtensions"
                    />
      
                    </div>
            </div>

          </div>
        </div>
              
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveChanges">Save changes</button>
          <button class="button" @click="close">Cancel</button>
        </footer>
      </div>
    </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'
import { useUiStateStore } from '@/stores/uiState'
import StaticCodeEditor from '@/components/_shared/StaticCodeEditor.vue'
import InboundArcModalExampleRow from './InboundArcModalExampleRow.vue'
import Arrow from '@/components/_shared/Arrow.vue'
import { checkSyntax } from '@/util/jsonPath'
import { Net } from '@/json-nets/Net'

import HelpButton from '@/components/_shared/HelpButton.vue'

import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror';

import { examples, jsonPathSnippets } from './InboundArcModalExamples'
import type { FilterAssignment } from '@/json-nets/Arc'
import type { JSONValue } from '@/util/jsonOperations'
import TokenTag from '@/components/_shared/TokenTag.vue'

export default defineComponent({
  components: {
    Codemirror,
    HelpButton,
    StaticCodeEditor,
    InboundArcModalExampleRow,
    TokenTag,
    Arrow
  },
  props: {
    net: {
      type: Net,
      required: true
    }
  },
  setup() {
    const extensions = [basicSetup, json(), oneDark]
    const simpleExtensions = [json(), oneDark]
    return {
      extensions,
      simpleExtensions
    }
  },
  data() {
    return {
      examples,
      jsonPathSnippets,
      helpExpanded: false,

      _jsonPathExpression: '',
      inputTokensString: '',
      filterAssignments: [] as Array<FilterAssignment>,
      syntaxError: '',

      selectedFragmentIndex: -1,
      fragmentString: '',
      tokenString: '',
      pathExpression: 'no fragment assigned',
      keyString: 'no fragment assigned'
    }
  },
  computed: {
    assignmentsString() {
      let fragments: Array<JSONValue> = [];
      for (let i = 0; i < this.filterAssignments.length; i++) {
        //@ts-ignore
        fragments.push(this.filterAssignments[i].fragment)
      }
      return JSON.stringify(fragments, null, 2);
    },
    jsonPathExpression: {
      get() {
        // this.uiStateStore.updateQueryResult();
        return this._jsonPathExpression;
      },
      set(jsonPathExpression: string) {
        this._jsonPathExpression = jsonPathExpression;
        const arc = this.net.findArc(this.uiStateStore.lastSelectedID)
        if (!arc) return;
        // this.uiStateStore.updateQueryResult();
        const syntaxCheck = checkSyntax(jsonPathExpression)
        if (syntaxCheck.isValid) {
          console.log('all valid')
          this.syntaxError = ''
          this.selectedFragmentIndex = -1
          this.fragmentString = ''
          this.tokenString = ''
          this.pathExpression = 'no filter assigned'
          this.keyString = 'no filter assigned'
          this.filterAssignments = arc.applyFilterExpression(jsonPathExpression);
        } else {
          console.log('syntax error')
          this.syntaxError = 'Invalid Syntax'
          this.selectedFragmentIndex = -1
          this.fragmentString = ''
          this.tokenString = ''
          this.pathExpression = 'no filter assigned'
          this.keyString = 'no filter assigned'
          this.filterAssignments = [];
        }
        // TODO: show error message
      }
    },
    ...mapStores(useUiStateStore)
  },
  mounted() {
    const arc = this.net.findArc(this.uiStateStore.lastSelectedID)
    if (!arc) return;
    // if(!(arc instanceof PresetArc)) return;

    const place = arc.place
    this.jsonPathExpression = arc.filterExpression;
    this.inputTokensString = JSON.stringify(place.marking, null, 2);
    //@ts-ignore
    //not sure why ts starts complaining about type depths here
    //yes, it is recursive!
    this.filterAssignments = arc.applyFilterExpression(arc.filterExpression);
    // this.queryResult = JSON.stringify(
    // query(JSON.parse(this.inputTokens), this.jsonPathQuery),
    // null,
    // 2
    // )
  },
  methods: {
    toggleExpand() {
      this.helpExpanded = !this.helpExpanded
    },
    selectFragment(index: number) {
      this.selectedFragmentIndex = index;
      this.fragmentString = JSON.stringify(this.filterAssignments[index].fragment, null, 2);
      this.keyString = this.filterAssignments[index].key;
      this.tokenString = JSON.stringify(this.filterAssignments[index].token, null, 2)
      this.pathExpression = this.filterAssignments[index].pathExpression;
    },
    saveChanges() {
      // TODO: check for expression errors
      if (this.syntaxError !== '') return;
      this.net.updateArc(this.uiStateStore.lastSelectedID, this.jsonPathExpression)
      this.close()
    },
    close() {
      // this.uiStateStore.setShowPresetModal(false)
      this.uiStateStore.setModal('none')
    }
  }
})
</script>

<style scoped>
/* .scoped-input { */
/* border-left: none;  */
/* border-right: none; */
/* } */

.scoped-right-control {
  border-left: none;
}

.scoped-column {
  width: 35%;
}

.scoped-codemirror {
  height: '400px';
}

/* .scoped-arrow {
  font-size: 60px;
  display: inline-block;
  transform: scaleY(2);
  transform-origin: left center;
  width: 5%; 
  align-self: center; 
  text-align: center;
} */
</style>