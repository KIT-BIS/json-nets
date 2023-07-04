<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title">Inbound arc inscription</p>
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
        <div class="field has-addons">
          <p class="control">
            <span class="select">
              <select v-model="uiStateStore.arcMode">
                <!-- TODO: these are actually constants, not sure how to use them here-->
                <option value="read">Read</option>
                <option value="consume">Consume</option>
              </select>
            </span>
          </p>
          <p class="control">
            <a class="button is-static">$.[</a>
          </p>

          <p class="control is-expanded">
            <input
              class="input scoped-input"
              type="text"
              placeholder="Enter JSONPath expression"
              v-model="jsonPathQuery"
            />
          </p>
          <p class="control">
            <a style="" class="button is-static scoped-right-control">]</a>
          </p>
        </div>
        <div class="notification is-info">
          <div v-if="uiStateStore.jsonPathHelpExpanded == false">
            <div class="block">
              <span @click="expand" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-plus-circle"
              /></span>
              <span>Expand templates for JSONPath expressions</span>
            </div>
          </div>
          <div v-if="uiStateStore.jsonPathHelpExpanded == true">
            <div class="block">
              <span @click="expand" class="icon is-clickable"
                ><font-awesome-icon icon="fas fa-minus-circle"
              /></span>
              <span>Minimize templates for JSONPath expressions</span>
            </div>
            <div class="block">
              <table class="table">
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
                  <tr>
                    <td rowspan="9">
                      <code>
                        [ {<br />
                        "name": "Alice",<br />
                        "age": 23,<br />
                        "studentID": 2567<br />
                        },<br />
                        { <br />
                        "name": "Marco", <br />
                        "age": 17, <br />
                        "studentID": 2544 <br />
                        }, <br />
                        { <br />
                        "age": 21, <br />
                        "studentID": 2063 <br />
                        } ]</code
                      >
                    </td>
                    <td>Return all objects (apply no filter)</td>
                    <td>
                      <span class="is-clickable" @click="uiStateStore.setJsonPathQuery('')"
                        ><i>(leave empty)</i></span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter the first object</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery('0')">$.[0]</code>
                    </td>
                  </tr>
                  <tr>
                    <td>Filter the first two objects</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery('0,1')"
                        >$.[0,1]</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter the last object</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery('-1:')"
                        >$.[-1:]</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter until the third object</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery(':2')"
                        >$.[:2]</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter all objects with a specific property</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery('?(@.name)')"
                        >$.[?(@.name)]</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter all objects where the property is equal to a specific value</td>
                    <td>
                      <code
                        class="is-clickable"
                        @click="uiStateStore.setJsonPathQuery('?(@.name == \'Alice\')')"
                        >$.[?(@.name=="Alice")]</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>Filter all objects where a property is greater than a specific value</td>
                    <td>
                      <code class="is-clickable" @click="uiStateStore.setJsonPathQuery('?(@.age > 18)')"
                        >$.[?(@.age > 18)]</code
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <div class="field">
              <label class="label">Input tokens</label>
              <div class="control">
                <Codemirror
                  class="scoped-codemirror"
                  :disabled="true"
                  v-model="uiStateStore.inputTokens"
                  placeholder="JSON data as input"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  :extensions="extensions"
                />
              </div>
            </div>
          </div>
          <div class="column is-2 has-text-centered">
            <p class="scoped-arrow">&#10093;</p>
          </div>
          <div class="column is-5">
            <div class="field">
              <label class="label">Preview of results</label>
              <div class="control">
                <Codemirror
                  class="scoped-codemirror"
                  :disabled="true"
                  v-model="uiStateStore.queryResult"
                  placeholder="Output"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  :extensions="extensions"
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

import { setArcLabel } from '@/components/jsonnets/net'

import HelpButton from '@/components/HelpButton.vue'

import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror';

export default defineComponent({
  components: {
    Codemirror,
    HelpButton
  },
  setup() {
    const extensions = [basicSetup, json(), oneDark]
    return {
      extensions
    }
  },
  computed: {
    jsonPathQuery: {
      get() {
        this.uiStateStore.updateQueryResult();
        return this.uiStateStore.jsonPathQuery;
      },
      set(newQuery: string) {
        this.uiStateStore.jsonPathQuery = newQuery;
        this.uiStateStore.updateQueryResult();
      }
    },
    ...mapStores(useUiStateStore)
  },
  methods: {
    expand() {
      this.uiStateStore.jsonPathHelpExpanded = !this.uiStateStore.jsonPathHelpExpanded
    },
    saveChanges() {
      // TODO: check for expression errors
      const arcLabel = {
        type: this.uiStateStore.arcMode,
        filter: this.uiStateStore.jsonPathQuery
      }
      setArcLabel(this.uiStateStore.lastSelectedID, arcLabel)
      this.close()
    },
    close() {
      this.uiStateStore.setShowPresetModal(false)
    }
  }
})
</script>

<style scoped>
.scoped-input {
  border-left: none; 
  border-right: none;
}

.scoped-right-control {
  border-left: none;
}

.scoped-column {
  width: 35%;
}

.scoped-codemirror {
  height: '400px';
}
.scoped-arrow {
  font-size: 60px;
  display: inline-block;
  transform: scaleY(2);
  transform-origin: left center;
  width: 5%; 
  align-self: center; 
  text-align: center;
}
</style>
