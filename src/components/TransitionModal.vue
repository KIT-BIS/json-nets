<template>
        <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card" style="width: 80%">
            <header class="modal-card-head">
            <p class="modal-card-title">Transition inscription</p>
            <button class="delete" aria-label="close" @click="close"></button>
            </header>

            <section class="modal-card-body">
            <div class="field">
                <label class="label">Name of the transition</label>
                <div class="control">
                    <input class="input" type="text" v-model="uiState.itemName"  />
                </div>
            </div>
            <label class="label">Assignment selection

                <div class="dropdown is-hoverable is-right">
                    <div class="dropdown-trigger">
                        <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                    </div>
                    <div class="dropdown-menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">
                            <p>Table shows tokens from pre-set places, filtered with JSONPath expression. If no tokens are visible,
                                check inbound arc inscription first.</p>
                            </div>
                        </div>
                    </div>
                </div>

                </label>
                <!--
            <label v-if="bindInput.length == 0">Insert tokens in pre-set place first to display input tokens
                here.</label>-->
                <!--TODO bisher eigentlich pro Input Place, pro token würde aber mehr Sinn ergeben-->
                <!-- <table v-if="bindInput.length > 0" class="table"> -->
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Pre-set place</th>
                            <th>Jsonnet variable
                                <div class="dropdown is-hoverable is-right">
                                    <div class="dropdown-trigger">
                                        <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
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
                                        <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
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
                            <!-- <th>
                            <div class="alignedItemsContainer">
                                <span class="tableBoldHeading">Variables</span>
                                <button class="infoBtn">i </button>
                                <div class="infoModal smallInfoModal">
                                    <p>Current variable allocation of input tokens, to be used in Jsonnet.</p>
                                </div>
                            </div>
                        </th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="place in uiState.inputTokensArray">
                            <td>{{ place.name }}</td>
                            <td><code class="is-clickable" @click="insertVariableName(place.name.toLowerCase())">{{ place.name.toLowerCase() }}</code></td>
                            <td >
                                <div class="tags">
                                <!-- {{ JSON.stringify(place.documents, null, 2) }} -->
                                <span 
                                    @click="uiState.addDocumentToTempAssignment(place.name, doc, index)"
                                    v-for="(doc, index) in place.documents" :data-tooltip="JSON.stringify(doc, null, 2)" class="tag has-tooltip-bottom" :class="{ 'is-light': !isSelected(place.name, index), 'is-primary': isSelected(place.name, index) }">
                                {{ shorten(JSON.stringify(doc, null, 2)) }}
                                </span>
                                </div>
                            </td>
                            <!-- <td>
                            <div v-for="item in variables" :key="item">
                                <div v-if="item.startsWith(token.inputPlaceName.toLowerCase())">
                                    <p :style="{ 'font-weight': '300' }"> {{ item }}</p>
                                </div>
                            </div>
                        </td> -->
                        </tr>
                    </tbody>
                </table>
                    <label class="label">
                        Transition inscription (Jsonnet) 
                        <div class="dropdown is-hoverable is-right">
                            <div class="dropdown-trigger">
                                <span class="icon is-small"><font-awesome-icon icon="fas fa-info-circle"/></span>
                            </div>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <div class="dropdown-item">
                                        <p>Note that jsonnet expressions in transition inscriptions must evaluate to true or false! For more
                                            information about Jsonnet, please visit <a href="https://jsonnet.org/"
                                                target="_blank">https://jsonnet.org/</a>
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                    <div class="notification is-info">
                        <div v-if="expanded == false" >
                            <div class="block">
                            <span @click="expand" class="icon" style="cursor: pointer"><font-awesome-icon icon="fas fa-plus-circle"/></span>
                            <span>Expand example for Jsonnet expressions</span>
                            </div>
                        </div>
                        <div v-if="expanded == true">
                            <!--TODO Könnte man als component verwenden wenn in outbound modal nochmal verwendet-->
                            <div class="block">
                            <span @click="expand" class="icon" style="cursor: pointer"><font-awesome-icon icon="fas fa-minus-circle"/></span>
                            <span>Minimize example for Jsonnet expression</span>
                            </div>

                            <div class="block">
                            <label class="label has-text-white">Example variable assignment</label>
                            <table class="table is-fullwidth is-striped">
                                <thead>
                                    <tr>
                                        <th> Pre-set place</th>
                                        <th> Jsonnet variable</th>
                                        <th> Variables</th>
                                    </tr>
                                </thead>   
                                <tbody>
                                    <tr>
                                        <td>Student</td>
                                        <td>student</td>
                                        <td>[
                                            {
                                            "id": 1, "name": "Alice",<br>
                                            "age": 25, "email": "alice@uni.edu",<br>
                                            "semester": 4, <br>
                                            "lecturesNotYetDone": [
                                            "Process Modeling",
                                            "Database Systems"
                                            ]
                                            }
                                            ]</td>
                                        <!-- <td>student.id=1 <br> student.name="Alice" <br> student.age=25 <br>
                                        student.email="alice@uni.edu" <br> student.semester=4 <br>
                                        student.lecturesNotYetDone=["Process Modeling", "Database Systems"] </td> -->
                                    </tr>
                                    <tr>
                                        <td>Request</td>
                                        <td>request</td>
                                        <td>[
                                            {
                                            "id": 1, <br>
                                            "lecture": "Process Modeling",
                                            "serviceFee": 15
                                            }
                                            ]</td>
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
                                        <button class="button is-ghost has-text-white" @click="toggleAccordion(index)" >{{ item.question }}</button>
                                        <!-- <button class="button" :id="`accordion-button-${index}`" @click="toggleAccordion(index)"> -->
                                        <button class="button is-ghost has-text-white is-pulled-right" @click="toggleAccordion(index)" >
                                            <font-awesome-icon v-if="!item.isExpanded" icon="fas fa-plus-circle" style="margin-top: 5px;"/>
                                            <font-awesome-icon v-if="item.isExpanded" icon="fas fa-minus-circle" style="margin-top: 5px;"/>
                                        </button>
                                        <!-- </button> -->
                                        <div class="accordion-content" v-show="item.isExpanded" style="margin-left: 1rem; margin-right: 1rem;">
                                            <p v-html="insertLineBreak(item.answer)" class="answer"></p>
                                            <div class="level">
                                                <div class="level-left">
                                                <p class="level-item"> Inscription evaluates to:</p>
                                                </div>
                                                <p class="level-item" :class="{ 'green-background': item.evaluation === 'true', 'red-background': item.evaluation === 'false' }"
                                                    style="margin-left: 15px">
                                                    {{ item.evaluation }} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="block">
                    <Codemirror v-model="uiState.inspectorContent" placeholder="Define transition inscription in Jsonnet"
                        :style="{ height: '200px' }" :autofocus="true" :indent-with-tab="true" :tab-size="2"
                        :extensions="extensions" @ready="handleReady" @update="handleCodeChange" />
                    </div>

                <div class="block">
                    <div class="level">
                        <div class="level-left">
                        <p class="level-item">Inscription evaluates to: </p>
                        </div>
                        <p class="level-item"
                            :class="{ 'green-background': uiState.transitionInscriptionValid, 'red-background': !uiState.transitionInscriptionValid }">
                            {{ uiState.inscriptionEvaluationResult }}</p>
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

<script>
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { evaluate } from '../util/jsonnet.js'
import { useUiStateStore } from '@/stores/uiState'
//@ts-ignore
import { updateTransitionContentInExportArray } from '@/util/exportNet.js'
//@ts-ignore
import {  setTransitionContent } from '@/components/jsonnets/net.js';


export default {
    name: 'TransitionModal',
    //props: ['modelValue', 'bindInput', 'bindJsonnet'],
    components: {
        Codemirror
    },
    setup() {
        const code = ref('')
        const extensions = [json(), oneDark]
        const view = shallowRef()
        const uiState = useUiStateStore();
        const handleReady = (payload) => {
            console.log("ready")
            console.log(payload);
            view.value = payload.view
        }
        //const insertText = (text) => {
        //    console.log(view);
        //    const state = view.state;
        //    const ranges = state.selection.ranges;
        //    const cursor = ranges[0].anchor;

        //    view.value.dispatch({
        //        changes: { from: cursor, insert: text }
        //    });
        //}
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
                    question: "Always evaluate to true (no check functionality)",
                    answer: "true",
                    evaluation: "true",
                    isExpanded: false
                },
                {
                    question: "Comparison of two attributes of different tokens",
                    answer: "local check = student.id == request.id;\ncheck",
                    evaluation: "true",
                    isExpanded: false
                },
                {
                    question: "Comparison of an attribute with a value",
                    answer: "local check = student.name == 'Tom';\ncheck",
                    evaluation: "false",
                    isExpanded: false
                },
                {
                    question: "Compare whether value is greater or smaller",
                    answer: "local check = student.age > '18';\ncheck",
                    evaluation: "true",
                    isExpanded: false
                },
                {
                    question: "Two conditions have to be true",
                    answer: "local checkLecture = request.lecture == 'Process Modeling';\nlocal checkStudent = request.id == student.id;\ncheckLecture && checkStudent",
                    evaluation: "true",
                    isExpanded: false
                },
            ]
        }
    },
    methods: {
        insertVariableName(varName) {
            //console.log(this.view.value.state);
            //var doc = this.view.getDoc();
            //var cursor = doc.getCursor();
            //doc.replaceRange(varName, cursor);
            const ranges = this.view.state.selection.ranges;
            const cursor = ranges[0].anchor;

            this.view.dispatch({
                changes: { from: cursor, insert: varName }
            });
        },
        isSelected(placeName, index) {
            if (this.uiState.selectedForAssignment[placeName] === index) {
                return true;
            } else {
                return false;
            }
        },
        shorten(string) {
            if (string.length <= 25) {
                return string
            } else {
                return string.slice(0, 22) + "...";
            }
        },
        handleCodeChange() {
            this.uiState.updateTransitionEvaluation();
        },
        adjustInput() {
            //this.bindInput.forEach(obj => {
            //    if (obj.inputFromJSONPath === '') {
            //        return;
            //    }
            //    const data = JSON.parse(obj.inputFromJSONPath);
            //    const variableName = obj.inputPlaceName.toLowerCase();
            //    const assignments = Object.entries(data[0]).map(([key, value]) => `"${key}": "${value}"`).join(',\n ');
            //    // if (assignments != '') {
            //    //     this.input += `local ${variableName} = {\n ${assignments}\n};\n`;
            //    // } else {
            //    //     this.input += `local ${variableName} = {\n};\n`;
            //    // }
            //    this.input += `local ${variableName} = {\n ${assignments}\n};\n`;
            //});

            //NEU
            // // Process the input array to extract variable names and corresponding arrays
            // for (var i = 0; i < this.bindInput.length; i++) {
            //     const variableName = this.bindInput[i].place.toLowerCase();
            //     for (var j = 0; j < this.bindInput[i].inputs.length; j++) {
            //         const inputData = JSON.parse(this.bindInput[i].inputs[j].inputFromJSONPath);
            //         //this.input += `local ${variableName} = {\n ${inputData}\n};\n`;
            //         this.arrays[variableName] = inputData;
            //     }
            // }

        },
        showInputVariables() {
            // this.bindInput.forEach(obj => {
            //     const data = JSON.parse(obj.inputFromJSONPath);
            //     const variableName = obj.inputPlaceName.toLowerCase();
            //     const assignments = Object.entries(data[0]).map(([key, value]) => `${key}=${value}`); 
            //     this.variables.push(`${variableName}.${assignments}`);
            //     //this.variables += `${variableName}.${assignments}`;
            // });
            //            this.bindInput.forEach(item => {
            //                if (item.inputFromJSONPath === '') {
            //                    return;
            //                }
            //                const { inputPlaceName, inputFromJSONPath } = item;
            //                const inputData = JSON.parse(inputFromJSONPath);
            //                inputData.forEach((obj) => {
            //                    for (const prop in obj) {
            //                        const variableName = `${inputPlaceName.toLowerCase()}.${prop}`;
            //                        const variableValue = JSON.stringify(obj[prop], this.replacer);
            //                        this.variables.push(`${variableName}=${variableValue}`);
            //                    }
            //                });
            //            });
        },
        replacer(key, value) {
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return value;
        },
        //validate() {
        //    //NEU (für mehrere input tokens)
        //    // // Create an empty container object to store the dynamically assigned variables
        //    // const variables = {};

        //    // // Iterate over the input object to assign variables dynamically
        //    // Object.keys(this.arrays).forEach(key => {
        //    //     const variableName = key.toLowerCase();
        //    //     variables[variableName] = this.arrays[key];
        //    // });

        //    // // Print the dynamically assigned variables
        //    // for (const variableName in variables) {
        //    //     console.log(`${variableName}:`, variables[variableName]);
        //    // }

        //    // for (const variableName in variables) {
        //    //     if (variables[variableName].length > 1) {
        //    //         const inputData = JSON.stringify(variables[variableName][0], null, 2);
        //    //         this.input += `local ${variableName} = {\n ${inputData}\n};\n`;
        //    //     } else {

        //    //         const inputData = JSON.stringify(variables[variableName], null, 2);
        //    //         this.input += `local ${variableName} = {\n ${inputData}\n};\n`;
        //    //     }
        //    // }

        //    //this.inscriptionEvaluated = true
        //    //var interimsResult = evaluate(this.input + this.code)
        //    //this.result = interimsResult.data.trim()
        //},
        expand() {
            this.expanded = !this.expanded
        },
        toggleAccordion(index) {
            //for (let i = 0; i < this.$el.querySelectorAll(".accordion button").length; i++) {
            //    this.$el.querySelectorAll(".accordion button")[i].setAttribute('aria-expanded', 'false');
            //}
            if (this.accordionItems[index].isExpanded === false) {
                this.accordionItems[index].isExpanded = true;
            } else {
                this.accordionItems[index].isExpanded = false;
            }
        },
        insertLineBreak(text) { //TODO Ist wahrscheinlich auch hier und bei Outbound -> Component oder util (genauso bei expanded und toggleAccordion)
            return text.replace(/\n/g, "<br>");
        },
        saveChanges() {
            //if (this.modelValue.length > 12) { //if name is longer, the remove and edit button are not reachable anymore
            //    alert("The name must not contain more than 12 characters!")
            //    return
            //}
            //this.$emit('saveChanges', this.code, this.result)
            setTransitionContent(this.uiState.lastSelectedID, this.uiState.inspectorContent, this.uiState.itemName);
            // updateTransitionContentInExportArray(this.uiState.lastSelectedID, this.uiState.inspectorContent, this.uiState.itemName);

            this.close()

        },
        close() {
            this.uiState.setShowTransitionModal(false);
        }

    }
}
</script>

<style scoped>
.accordion .accordion-item {
    border-bottom: 1px solid lightgray;
}

.green-background {
    background-color: green;
    color: white;
    text-align: center;
    flex-grow: 1;
    margin-left: 15px;
}

.red-background {
    background-color: #e20505;
    color: white;
    text-align: center;
    flex-grow: 1;
    margin-left: 15px;
}




.accordion .accordion-content .answer {
    font-family: monospace;
    background-color: #282C34;
    color: #ABB2BF;
    padding: 5px 10px;
}

.accordion .accordion-content p {
    font-weight: 300;
    margin: 10px 0;
}
</style>