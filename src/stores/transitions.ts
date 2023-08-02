import { defineStore } from "pinia"
import { getNetInstance } from "@/json-nets/Net";
import type { TransitionData } from "@/json-nets/Net";
import type { JSONMarking } from "@/util/jsonOperations";
import type { FilterAssignment } from "@/json-nets/Arc";

export const useTransitionsStore = defineStore('transitions', {
    state: () => {
        return {
            transitions: [] as Array<TransitionData>,
            transition: {} as TransitionData,
            outputArcs: [] as Array<{ id: string, name: string, marking: JSONMarking, var: string, fragment: string, key: string, filter: string, filtered: Array<string>}>,
            inputArcs: [] as Array<{ id: string, name: string, marking: JSONMarking, filter: string, filtered: Array<string>}>,
            selectedOutputSnippetIndex: -1,

            selectedInputIndex: 0,
            selectedInputValues: {} as Record<string, string>,
            selectedInputValue: '',

            selectedOutputIndex: 0,
            selectedOutputValues: {} as Record<string, string>,
            selectedOutputValue: '',
        }
    },
    getters: {
//        outputArcs(state) {
//            const transition = getNetInstance().findTransition(state.transition.id)
//            if(!transition) return [];
//
//            // todo: not reactive, need own store
//
//            return outputArcs;
//        }
    },
    actions: {
        addTransition() {
            let transition: TransitionData = getNetInstance().addTransition();
            this.transitions.push(transition)
            return transition;
        },
        setTransition(transitionID: string) {
            const transitionData = this.transitions.find((t) => {
                return t.id === transitionID
            })
            if(transitionData) {
                this.transition = transitionData;
                const transition = getNetInstance().findTransition(this.transition.id); 
                if(!transition) return transitionData

                const outputArcs = []
                for (let i = 0; i < transition.postset.length; i++) {
                    const arc = transition.postset[i];

                    const filtered = []
                    const filterAssignments = arc.applyFilterExpression(arc.filterExpression);
                    for (let j = 0; j < filterAssignments.length; j++) {
                        filtered.push(filterAssignments[j].pathExpression)
                    }


                    const arcData = {
                        id: arc.id, 
                        name: arc.place.name,
                        marking: arc.place.marking,
                        var: arc.tokenVarName,
                        fragment: transition.fragmentVarSnippets[arc.fragmentVarName], // todo: can be simplified with planned input.placeName.key/fragment access
                        key: transition.keyVarSnippets[arc.keyVarName],
                        filter: arc.filterExpression,
                        filtered
                    }
                    this.selectedInputValues[arc.id] = '';
                    outputArcs.push(arcData)
                }
                this.outputArcs = outputArcs;

                const inputArcs = [];
                for (let i = 0; i <transition.preset.length; i++) {
                    const arc = transition.preset[i];

                    const filtered = []
                    const filterAssignments = arc.applyFilterExpression(arc.filterExpression);
                    for (let j = 0; j < filterAssignments.length; j++) {
                        filtered.push(filterAssignments[j].pathExpression)
                    }

                    const arcData = {
                        id: arc.id,
                        name: arc.place.name,
                        marking: arc.place.marking,
                        filter: arc.filterExpression,
                        filtered
                    }

                    inputArcs.push(arcData)
                }
                this.inputArcs = inputArcs;
            }
            // this.updateInput()

            return transitionData;
        },
        resetName() {
            const transition = getNetInstance().findTransition(this.transition.id)
            if(!transition) return;
            this.transition.name = transition.name;
        },
        resetInputFilter() {
            const arcData = this.inputArcs[this.selectedInputIndex];
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;
            arcData.filter = arc.filterExpression;
            this.updateInputFilter();

        },
        resetOutputFilter() {
            const arcData = this.outputArcs[this.selectedOutputIndex];
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;
            arcData.filter = arc.filterExpression;
            this.updateOutputFilter();

        },
        saveName() {
            getNetInstance().updateTransition(this.transition.id, this.transition.name);
        },
        saveInputFilter() {
            const arcData = this.inputArcs[this.selectedInputIndex];
            getNetInstance().updateArc(arcData.id, arcData.filter)
        },
        saveOutputFilter() {
            const arcData = this.outputArcs[this.selectedOutputIndex];
            getNetInstance().updateArc(arcData.id, arcData.filter)
        },
        saveBasicInscription() {
            getNetInstance().updateTransition(this.transition.id, this.transition.name, this.transition.preface, this.transition.guard);
        },
        saveOutputSnippets(){
            const arcData = this.outputArcs[this.selectedOutputSnippetIndex];
            getNetInstance().updateTransitionSnippets(this.transition.id, 
                arcData.id,
                arcData.key,
                arcData.fragment
                );

        },
        setSelectedInputValue(jsonPath: string) {
            const arcID = this.inputArcs[this.selectedInputIndex].id;
            this.selectedInputValues[arcID] = jsonPath;
        },
        setSelectedOutputValue(jsonPath: string) {
            const arcID = this.outputArcs[this.selectedOutputIndex].id;
            this.selectedOutputValues[arcID] = jsonPath;
        },
        updateInputFilter() {
            const arcData = this.inputArcs[this.selectedInputIndex]
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            const filtered = []
            const filterAssignments = arc.applyFilterExpression(arcData.filter);
            for (let j = 0; j < filterAssignments.length; j++) {
                filtered.push(filterAssignments[j].pathExpression)
            }           

            arcData.filtered = filtered;
        },
        updateOutputFilter() {
            const arcData = this.outputArcs[this.selectedOutputIndex]
            const arc = getNetInstance().findArc(arcData.id)
            if(!arc) return;

            const filtered = []
            const filterAssignments = arc.applyFilterExpression(arcData.filter);
            for (let j = 0; j < filterAssignments.length; j++) {
                filtered.push(filterAssignments[j].pathExpression)
            }           

            arcData.filtered = filtered;
        }


    }
});