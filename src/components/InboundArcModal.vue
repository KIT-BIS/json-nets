<template>
    <div class="modal is-active" >
        <div class="modal-background"></div>
        <div class="modal-card" style="width: 80%">
            <header class="modal-card-head">
            <p class="modal-card-title">Inbound arc inscription</p>
            <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <!--
                    <div class="field">
                        <label class="label">Arc Type:</label>
                   </div>-->

                   <div class="field">
                     <label class="label" for="addons">JSONPath expression 
                            <div class="dropdown is-hoverable is-right">
                                    <div class="dropdown-trigger">
                                    <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <div class="dropdown-item">
                                        <p>For more information about JSONPath, visit <a href="https://goessner.net/articles/JsonPath/"
                                        target="_blank">https://goessner.net/articles/JsonPath/</a>.
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                    </div>
                    <div class="field has-addons">

                          
                    <p class="control">
                        <span class="select">
                          <select v-model="uiState.arcMode">
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
                            <input style="border-left:none; border-right: none;" id="jsonPathQuery" class="input" type="text" placeholder="Enter JSONPath expression" v-model="uiState.jsonPathQuery">
                        </p>
                        <p class="control">
                            <a style="border-left: none;" class="button is-static">]</a>
                        </p>
                        <!--          <p class="help is-danger">{{ uiState.nameError }} </p>-->
                    </div>
                        <div class="notification is-info">
                            <div v-if="expanded == false" >
                                <span @click="expand" class="icon" style="cursor: pointer"><font-awesome-icon icon="fas fa-plus-circle"/></span>
                                <span>Expand templates for JSONPath expressions</span>
                            </div>
                            <div v-if="expanded == true">
                                <span @click="expand" class="icon" style="cursor: pointer"><font-awesome-icon icon="fas fa-minus-circle"/></span>
                                <span>Minimize templates for JSONPath expressions</span>
                                <div>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <th>Example JSON document</th>
                                                <th>Filter command</th>
                                                <th style="width: 35%">
                                                    JSONPath expression
    <div class="dropdown is-hoverable is-right">
                                    <div class="dropdown-trigger">
                                    <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <div class="dropdown-item">
                                            <p>Click on expressions to insert in input field.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <td rowspan="9"><code> [
                                                    {<br>
                                                    "name": "Alice",<br>
                                                    "age": 23,<br>
                                                    "studentID": 2567<br>
                                                    },<br>
                                                    { <br>
                                                    "name": "Marco", <br>
                                                    "age": 17, <br>
                                                    "studentID": 2544 <br>
                                                    }, <br>
                                                    { <br>
                                                    "age": 21, <br>
                                                    "studentID": 2063 <br>
                                                    }
                                                    ]</code></td>
                                                <td>Return all objects (apply no filter)</td>
                                                <!--<td><button class="button is-white" @click="uiState.setJsonPathQuery('$.*')"><code>$.*</code></button></td>-->
                                                <!-- <td><code class="is-clickable" @click="uiState.setJsonPathQuery('$.*')">$.*</code></td> -->
                                                <td><span class="is-clickable" @click="uiState.setJsonPathQuery('')"><i>(leave empty)</i></span></td>
                                            </tr>
                                            <tr>
                                                <td>Filter the first object</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('0')">$.[0]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter the first two objects</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('0,1')">$.[0,1]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter the last object</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('-1:')">$.[-1:]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter until the third object</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery(':2')">$.[:2]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter all objects with a specific property</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('?(@.name)')">$.[?(@.name)]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter all objects where the property is equal to a specific value</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('?(@.name == \'Alice\')')">$.[?(@.name=="Alice")]</code></td>
                                            </tr>
                                            <tr>
                                                <td>Filter all objects where a property is greater than a specific value</td>
                                                <td><code class="is-clickable" @click="uiState.setJsonPathQuery('?(@.age > 18)')">$.[?(@.age >
                                                        18)]</code></td>
                                            </tr>
                                            <!-- <tr> -->
                                                <!-- <td>Filter for all objects the values of a property</td> -->
                                                <!-- <td><code class="is-clickable" @click="uiState.setJsonPathQuery('$..name')">$..name</code></td> -->
                                            <!-- </tr> -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <!--
                    <div v-if="bindSource == 'default'">
                        <h2> Input tokens</h2>
                        <label>Insert tokens in pre-set place first to display input tokens here.</label>
                    </div>-->
                        <div class="columns is-vcentered">
                            <div class="column is-5">
                                <div class="field">
                                <label class="label">Input tokens</label>
                                <div class="control">
                                <Codemirror :disabled="true" v-model="uiState.inputTokens" placeholder="JSON data as input" :style="{ height: '400px' }"
                                    :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions"
                                    @ready="handleReady" />
                                </div>
                                </div>
                            </div>
                            <div class="column is-2 has-text-centered">
                            <p style="width: 5%; align-self: center; text-align: center" class="arrow"> &#10093; </p>
                            </div>
                            <div class="column is-5">
                                <div class="field">
                                <label class="label">Preview of results</label>
                                <div class="control">
                                <Codemirror :disabled="true" v-model="uiState.queryResult" placeholder="Output" :style="{ height: '400px' }" :autofocus="true"
                                    :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" />
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
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useUiStateStore } from '@/stores/uiState'
//@ts-ignore
import { updateArcLabelInExportArray } from '@/util/exportNet.js'
//@ts-ignore
import {  setArcLabel } from '@/components/jsonnets/net.js';
//@ts-ignore
//import { PRESET_ARC_TYPE_CONSUME, PRESET_ARC_TYPE_READ } from '@/components/jsonnets/presetArc.js';

export default {
    name: 'InboundArcModal',
    components: {
        Codemirror,
    },
    setup() {
        const code1 = ref('')
        const code2 = ref('')
        const extensions = [json(), oneDark]
        const view = shallowRef()
        const handleReady = (payload) => {
            view.value = payload.view
            //view.value.state.readOnly.of(true);
        }
        const uiState = useUiStateStore();
        return {
            code1,
            code2,
            extensions,
            handleReady,
            uiState
        }
    },
    props: ['bindSource', 'bindQuery'],
    mounted() {
        // Todo: this subscription may need to be killed on unmount?
        // Todo: catch errors
        this.uiState.$subscribe((mutation, state) => {
            //@ts-ignore
            if (!(mutation.events.key === "jsonPathQuery")) {
                return;
            }
            this.uiState.updateQueryResult();
        })
    },
    data() {
        return {
            inputTokens: '',
            newArray: [],
            query: '',
            output: '',
            expanded: false,
        }
    },
    methods: {
        expand() {
            this.expanded = !this.expanded
        },
        saveChanges() {
            // TODO: check for expression errors
            //if (this.output == '[]') {
            //    alert("Your expression is not a valid JSONPath expression. Check the templates for help.")
            //    return
            //}

            const arcLabel = {
                type: this.uiState.arcMode,
                filter: this.uiState.jsonPathQuery
            }
            //@ts-ignore
            setArcLabel(this.uiState.lastSelectedID, arcLabel);
            //@ts-ignore
            updateArcLabelInExportArray(this.uiState.lastSelectedID, arcLabel);
            this.close();
        },
        close() {
            this.uiState.setShowPresetModal(false)
        }
    },

}
</script>

<style scoped>
.arrow {
    font-size: 60px;
    display: inline-block;
    transform: scaleY(2);
    transform-origin: left center;
}
</style>
