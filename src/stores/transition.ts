import type { TransitionData, FireEvent } from "@/json-nets/Net";
import type { JSONMarking, JSONValue } from "@/util/jsonOperations";
import type { EvaluationResult } from "@/util/jsonnet";

import { defineStore } from "pinia"

import { getNetInstance } from "@/json-nets/Net";
import { useNetStore } from "./net";
import { useConfigStore } from "./config";

export const useTransitionsStore = defineStore('transitions', {
    state: () => {
        return {
            transition: {} as TransitionData,
            outputArcs: [] as Array<{ id: string, 
                name: string, 
                marking: JSONMarking, 
                tokenVar: string,
                valueVar: string,
                keyVar: string,
                valueSnippet: string, 
                keySnippet: string, 
                filter: string, 
                filtered: Array<string>}>,
            inputArcs: [] as Array<{ 
                id: string, 
                name: string, 
                marking: JSONMarking, 
                tokenVar: string,
                valueVar: string, 
                keyVar: string, 
                filter: string, 
                filtered: Array<string>}>,
            selectedOutputSnippetIndex: -1,

            variables: {} as Record<string, JSONValue>,
            assignmentComplete: false,
            presetAssignmentComplete: false,
            postsetAssignmentComplete: false,
            prefaceHasError: false,
            guardHasError: false,
            guardEvaluation: '',
            keyEvaluationResults: {} as Record<string, EvaluationResult>,
            valueEvaluationResults: {} as Record<string, EvaluationResult>,
            hasAnyError: false,
            hasAnyOutputError: false,
            isEnabled: false,

            selectedInputPlaceIndex: 0,
            // todo: this is a hack since empty string is root and may be selected
            selectedInputValueJsonPath: 'none',

            selectedOutputPlaceIndex: 0,
            selectedOutputValueJsonPath: 'none',

            // to enable forced rendering of json-pretty component
            inputDataKey: 0,
            outputDataKey: 0
        }
    },
    actions: {
        // storing basic data to the json net
        saveName() {
            const transitionData = getNetInstance().updateTransition(this.transition.id, this.transition.name);
            if  (transitionData) {
                this.transition.name = transitionData.name;
                useNetStore().lastUpdatedTransition = transitionData;
            }
        },
        switchMode() {
            this.transition.readonly = !this.transition.readonly;
            const transitionData = getNetInstance().updateTransitionMode(this.transition.id, this.transition.readonly);
            if  (transitionData) {
                this.transition.readonly = transitionData.readonly
                useNetStore().lastUpdatedTransition = transitionData;
            }
        },
        updateVariable(key: string, value:string){
            const transitionData = getNetInstance().updateTransitionVariable(this.transition.id, key, value);
            if (transitionData) {
                // this.transition.customVariables = transitionData.customVariables;
                this.transition = transitionData;
                useNetStore().lastUpdatedTransition = transitionData;
            }
        },
        removeVariable(key: string) {
            const transitionData = getNetInstance().removeTransitionVariable(this.transition.id, key);
            if (transitionData) {
                // this.transition.customVariables = transitionData.customVariables;
                this.transition = transitionData;
                useNetStore().lastUpdatedTransition = transitionData;
            }
        },
        saveInputFilter() {
            const arcData = this.inputArcs[this.selectedInputPlaceIndex];
            getNetInstance().updateArc(arcData.id, arcData.filter)

        },
        saveOutputFilter() {
            const arcData = this.outputArcs[this.selectedOutputPlaceIndex];
            getNetInstance().updateArc(arcData.id, arcData.filter)

        },
        saveBasicInscription() {
            getNetInstance().updateTransition(this.transition.id, this.transition.name, this.transition.preface, this.transition.guard);
            
        },
        saveOutputSnippets(){
            const arcData = this.outputArcs[this.selectedOutputSnippetIndex];
            if(!arcData) return;
            getNetInstance().updateTransitionSnippets(this.transition.id, 
                arcData.id,
                arcData.keySnippet,
                arcData.valueSnippet
                );

        },

        // managing assignments
        unsetAssignments() {
            // todo communication should always only be with net instance not its members
            const transition = getNetInstance().findTransition(this.transition.id)
            if(!transition) return;
            transition.resetAssignments();

            this.selectedInputValueJsonPath = 'none';
            this.selectedOutputValueJsonPath = 'none';
            this.assignmentComplete = false;
        },

        // managing assignments - input/output
        saveSelectedAssignment(jsonPath: string, type: 'input' | 'output') {
            let arcID;
            if (type === 'input') {
                this.selectedInputValueJsonPath = jsonPath;
                arcID = this.inputArcs[this.selectedInputPlaceIndex].id;
            } else {
                this.selectedOutputValueJsonPath = jsonPath;
                arcID = this.outputArcs[this.selectedOutputPlaceIndex].id;
            }
            const assignment = getNetInstance().assignFilterByPath(arcID, jsonPath);
            if (assignment) {
                this.assignmentComplete = assignment.complete;
                this.presetAssignmentComplete = assignment.presetComplete;
                this.postsetAssignmentComplete = assignment.postsetComplete;

                // if (assignment.complete) {
                    this.loadEvaluations()
                    if (!this.hasAnyError) {
                        getNetInstance().assignOutputVariables(arcID)
                    }
                // }
            }
            // else some error
        },

        loadCurrentInputAssignment() {
            const arcID = this.inputArcs[this.selectedInputPlaceIndex].id;
            const arc = getNetInstance().findArc(arcID);
            if (!arc) return;

            if (arc.assignedPathExpression !== null) {
                this.selectedInputValueJsonPath = arc.assignedPathExpression;
            } else {
                this.selectedInputValueJsonPath = 'none';
            }
        },
        loadCurrentOutputAssignment() {
            const arcID = this.outputArcs[this.selectedOutputPlaceIndex].id;
            const arc = getNetInstance().findArc(arcID);
            if (!arc) return;

            if (arc.assignedPathExpression !== null) {
                this.selectedOutputValueJsonPath = arc.assignedPathExpression;
            } else {
                this.selectedOutputValueJsonPath = 'none';
            }
        },

        loadAvailableInputAssignments() {
            const arcData = this.inputArcs[this.selectedInputPlaceIndex]
            if(!arcData) return;
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            const filtered = []
            const filterAssignments = arc.applyFilterExpression(arcData.filter);
            for (let j = 0; j < filterAssignments.length; j++) {
                filtered.push(filterAssignments[j])
            }           

            arcData.filtered = filtered;
        },
        loadAvailableOutputAssignments() {
            const arcData = this.outputArcs[this.selectedOutputPlaceIndex]
            if(!arcData) return;
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            const filtered = []
            const filterAssignments = arc.applyFilterExpression(arcData.filter);
            for (let j = 0; j < filterAssignments.length; j++) {
                filtered.push(filterAssignments[j])
            }           

            arcData.filtered = filtered;
        },

        unsetCurrentInputAssignment() {
            const arcData = this.inputArcs[this.selectedInputPlaceIndex]
            if(!arcData) return;
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            arc.resetAssignment();
            this.selectedInputValueJsonPath = 'none';
        },
        unsetCurrentOutputAssignment() {
            const arcData = this.outputArcs[this.selectedOutputPlaceIndex]
            if(!arcData) return;
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            arc.resetAssignment();
            this.selectedOutputValueJsonPath = 'none';
        },


        // interactions when input is cancelled
        resetName() {
            const transition = getNetInstance().findTransition(this.transition.id)
            if(!transition) return;
            this.transition.name = transition.name;
            useNetStore().lastUpdatedTransition = transition;
        },
        resetInputFilter() {
            const arcData = this.inputArcs[this.selectedInputPlaceIndex];
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;
            arcData.filter = arc.filterExpression;
            this.loadAvailableInputAssignments();

        },
        resetOutputFilter() {
            const arcData = this.outputArcs[this.selectedOutputPlaceIndex];
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;
            arcData.filter = arc.filterExpression;
            this.loadAvailableOutputAssignments();

        },

        // evaluations
        //loadVariables() {
        //    const variables = getNetInstance().getVariablesFromPathAssignments(this.transition.id)
//      //      findTransition(this.transition.id)
//      //      if(!transition) return;
//
//      //      const variables = transition.assembleVariables();
//      //      if(!variables) return
        //    this.variables = variables;
        //},
        loadEvaluations(){
            const evalResult = getNetInstance().getEvaluations(this.transition.id);
            // console.log(evalResult);
            if (evalResult) {
                this.variables = evalResult.variables;
                if(!this.assignmentComplete) return;

                this.hasAnyError = evalResult.hasAnyError;
                if(this.hasAnyError) {
                    this.isEnabled = false;
                }
                this.prefaceHasError = evalResult.preface.hasError;
                if (this.prefaceHasError) {
                    return;
                } 

                if (evalResult.hasAnyOutputError !== undefined && evalResult.outputKeyVariables && evalResult.outputValueVariables) {
                    this.hasAnyOutputError = evalResult.hasAnyOutputError;
                    this.keyEvaluationResults = evalResult.outputKeyVariables;
                    this.valueEvaluationResults = evalResult.outputValueVariables;
                }

                if (this.hasAnyOutputError) {
                    return;
                }

                if (evalResult.guard) {
                    this.guardHasError = evalResult.guard.hasError;
                    if (this.guardHasError) {
                        this.guardEvaluation = evalResult.guard.evaluation;
                    } else {
                        this.guardEvaluation = evalResult.guard.evaluation;
                        this.isEnabled = JSON.parse(this.guardEvaluation);
                    }
                }
            }
        },
        initSettings() {
            // init settings
            this.selectedOutputSnippetIndex = -1;
            this.selectedInputPlaceIndex = 0;
            this.selectedOutputPlaceIndex = 0;
            this.assignmentComplete = false;
        },

        loadTransition(transitionID: string) {
            // Todo rethink role of transitions in net store
            let transitionData = useNetStore().transitions.find((t) => {
                return t.id === transitionID
            })
            if(transitionData) {
                // this.transition = transitionData;
                const transition = getNetInstance().findTransition(transitionID); 
                // todo: return transitionData?
                if(!transition) return transitionData
                transitionData = transition;
                this.transition = transition;

                // outputarcs won't change once the transition modal is opened
                const outputArcs = []
                for (let i = 0; i < transition.postset.length; i++) {
                    const arc = transition.postset[i];

                    const filtered = []
                    const filterAssignments = arc.applyFilterExpression(arc.filterExpression);
                    for (let j = 0; j < filterAssignments.length; j++) {
                        filtered.push(filterAssignments[j])
                    }


                    const arcData = {
                        id: arc.id, 
                        name: arc.place.name,
                        marking: arc.place.marking,
                        tokenVar: arc.tokenVarName,
                        valueVar: arc.valueVarName,
                        keyVar: arc.keyVarName,
                        valueSnippet: transition.valueVarSnippets[arc.valueVarName], 
                        keySnippet: transition.keyVarSnippets[arc.keyVarName],
                        filter: arc.filterExpression,
                        filtered
                    }
                    outputArcs.push(arcData)
                }
                this.outputArcs = outputArcs;

                // input arcs won't change once the transition modal is opened
                const inputArcs = [];
                for (let i = 0; i <transition.preset.length; i++) {
                    const arc = transition.preset[i];

                    const filtered = []
                    const filterAssignments = arc.applyFilterExpression(arc.filterExpression);
                    for (let j = 0; j < filterAssignments.length; j++) {
                        filtered.push(filterAssignments[j])
                    }

                    const arcData = {
                        id: arc.id,
                        name: arc.place.name,
                        marking: arc.place.marking,
                        filter: arc.filterExpression,
                        tokenVar: arc.tokenVarName,
                        valueVar: arc.valueVarName,
                        keyVar: arc.keyVarName,
                        filtered
                    }

                    inputArcs.push(arcData)
                }
                this.inputArcs = inputArcs;

            }
        },

        forceRender(){
            this.inputDataKey += 1;
            this.outputDataKey += 1;
        },

        fireCurrentTransition() {
            getNetInstance().assignOutputVariables(this.transition.id);
            const fireData: Array<FireEvent>= getNetInstance().fireUnderCurrentAssignment(this.transition.id);
            useNetStore().lastFiredArcs = fireData;
            this.loadTransition(this.transition.id);
            this.unsetAssignments();
            this.loadAvailableInputAssignments();
            this.loadAvailableOutputAssignments();
            this.loadEvaluations();
            this.assignmentComplete = false;
            this.presetAssignmentComplete = false;
            this.postsetAssignmentComplete = false;


            this.forceRender()
        }
    }
});