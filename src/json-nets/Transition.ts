import type { EvaluationResult } from '@/util/jsonnet.js'
import type { JSONObject, JSONValue } from '@/util/jsonOperations'
import type { Arc } from './Arc'
import type { FragmentOperation } from './Place'
import type { FireEvent } from './Net'

import { combineAssignments } from '@/util/util'
import { evaluateExpression } from '@/util/jsonnet.js'
import { sortByOrder } from '@/util/jsonPointer'


export type AssignmentRef = {
	arc: Arc
	assignmentIndex: number
}


/**
 * Implementation of JSON-Nets transition.
 * Creates a new Transition object.
 * @param {String} id ID of the transition.
 * @param {String} name Name of the transition.
 */
export class Transition {
	readonly id: string
	public name: string
	// Todo: should probably be an edge setting
	public readonly: boolean
	public preset: Array<Arc>
	public postset: Array<Arc>
	public guard: string
	public preface: string
	public customVariables: Record<string, string>
	public valueVarSnippets: Record<string, string>
	public keyVarSnippets: Record<string, string>

	constructor(id: string, name: string) {
		this.id = id
		this.name = name
		this.preset = []
		this.postset = []
		this.guard = 'true';
		this.preface = '';
		this.valueVarSnippets = {}
		this.keyVarSnippets = {}
		this.readonly = false;
		this.customVariables = {};
	}

	// Todo: naming issue: Snippets sometimes include variable part 'local <varname> =', sometimes don't
	// this sets the snippets if given snippets from transition type
	updateAllSnippets(keySnippet: string, valueSnippet: string) {

		for (let i = 0; i < this.postset.length; i++) {
			this.keyVarSnippets[this.postset[i].keyVarName] = 'local ' + this.postset[i].keyVarName + ' = ' + keySnippet;
			this.valueVarSnippets[this.postset[i].valueVarName] = 'local ' + this.postset[i].valueVarName + ' = ' + valueSnippet;
		}
	}

	connectArc(arc: Arc) {
		if (arc.type === 'preset') {
			this.preset.push(arc)
		} else if (arc.type === 'postset') {
			// existing snippets are not overwritten (important for imports)
			if (!this.valueVarSnippets[arc.valueVarName]) {
				this.valueVarSnippets[arc.valueVarName] = 'local ' + arc.valueVarName + ' = ' + "{};";
			}
			if (!this.keyVarSnippets[arc.keyVarName]) {
				this.keyVarSnippets[arc.keyVarName] = "local " + arc.keyVarName + " = " + "'-';";
			}
			this.postset.push(arc)
		}
	}

	updateSnippets(oldNames: { value: string, key: string, token: string }, newNames: { value: string, key: string, token: string }) {
		let newGuard = this.guard;
		newGuard = newGuard.replace(oldNames.value, newNames.value);
		newGuard = newGuard.replace(oldNames.key, newNames.key);
		newGuard = newGuard.replace(oldNames.token, newNames.token);
		this.guard = newGuard;

		let newPreface = this.preface;
		newPreface = newPreface.replace(oldNames.value, newNames.value);
		newPreface = newPreface.replace(oldNames.key, newNames.key);
		newPreface = newPreface.replace(oldNames.token, newNames.token);
		this.preface = newPreface;

		if (this.valueVarSnippets[oldNames.value]) {
			let newFragmentSnippet = this.valueVarSnippets[oldNames.value];
			newFragmentSnippet = newFragmentSnippet.replace(oldNames.value, newNames.value);
			newFragmentSnippet = newFragmentSnippet.replace(oldNames.key, newNames.key);
			newFragmentSnippet = newFragmentSnippet.replace(oldNames.token, newNames.token);
			delete this.valueVarSnippets[oldNames.value]
			this.valueVarSnippets[newNames.value] = newFragmentSnippet;
		}

		if (this.keyVarSnippets[oldNames.key]) {
			let newKeySnippet = this.keyVarSnippets[oldNames.key];
			newKeySnippet = newKeySnippet.replace(oldNames.value, newNames.value);
			newKeySnippet = newKeySnippet.replace(oldNames.key, newNames.key);
			newKeySnippet = newKeySnippet.replace(oldNames.token, newNames.token);
			delete this.keyVarSnippets[oldNames.key]
			this.keyVarSnippets[newNames.key] = newKeySnippet;
		}

	}

	disconnectArc(arc: Arc) {
		if (arc.type === 'preset') {
			this.preset = this.preset.filter((currentArc) => {
				return currentArc.id !== arc.id
			})
		} else if (arc.type === 'postset') {
			this.postset = this.postset.filter((currentArc) => {
				if (currentArc.id !== arc.id) {
					delete this.valueVarSnippets[arc.valueVarName]
					delete this.keyVarSnippets[arc.keyVarName]
					return true;
				} else {
					return false;
				}
			})
		}
	}

	resetAssignments() {
		for (let i = 0; i < this.preset.length; i++) {
			this.preset[i].resetAssignment();
		}

		for (let i = 0; i < this.postset.length; i++) {
			this.postset[i].resetAssignment();
		}
	}

	fire(): Array<FireEvent> {
		const fireData: Array<FireEvent> = []
		for (let i = 0; i < this.preset.length; i++) {

			// Todo: order by path expression order, use batch operation method as in checkResultingMarkings
			const arc = this.preset[i];
			// Todo: this should be reworked and part of enabled checking
			// transition can only fire if pathExpression != null
			if (arc.assignedPathExpression === null) return [];

			if (!this.readonly) {
				arc.place.removeValue(arc.assignedPathExpression, false);
			}
			fireData.push({ arcID: arc.id, placeID: arc.place.id, num: arc.place.marking.length })
		}

		for (let i = 0; i < this.postset.length; i++) {
			const arc = this.postset[i];
			if (arc.assignedPathExpression === null) return [];

			arc.place.insertValue(arc.assignedPathExpression, arc.valueVarValue, arc.keyVarValue, false);

			fireData.push({ arcID: arc.id, placeID: arc.place.id, num: arc.place.marking.length })
		}

		return fireData;
	}

	hasCompletePresetAssignment() {
		const arcs = this.preset;
		for (let i = 0; i < arcs.length; i++) {
			const arc = arcs[i];
			if (arc.assignedPathExpression === null) {
				return false;
			}
		}
		return true;
	}

	hasCompletePostsetAssignment() {
		const arcs = this.postset;
		for (let i = 0; i < arcs.length; i++) {
			const arc = arcs[i];
			if (arc.assignedPathExpression === null) {
				return false;
			}
		}
		return true;
	}

	hasCompleteAssignment() {
		const arcs = this.preset.concat(this.postset);
		for (let i = 0; i < arcs.length; i++) {
			const arc = arcs[i];
			if (arc.assignedPathExpression === null) {
				return false;
			}
		}
		return true;
	}


	/**
	 * Checks whether the transition has any complete assignment i.e. every adjacent arc filter expression
	 * generates at least one path expression for the corresponding marking.
	 * @returns Boolean for yes/no.
	 */
	hasAnyCompleteAssignment(): boolean {
		const arcs = this.preset.concat(this.postset);
		for (let i = 0; i < arcs.length; i++) {
			const arc = arcs[i];
			const assignments = arc.applyFilterExpression(arc.filterExpression);
			if (assignments.length === 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Evaluates key and value output expression snippets of the transition and returns a 
	 * dictionary of each key/value output variables with the assigned value.
	 * Expects key/value/token variables of input arcs and token variables of output arcs.
	 * Assigns the resulting values to the corresponding arcs.
	 * @param variables A dictionary of variables and values that may occur in the output expression snippets.
	 * @returns A merged dictionary of all variables. False if an error occurs.
	 */
	assignOutputKeyValueVariables(variables: Record<string, JSONValue>): Record<string, JSONValue> | false {
		for (let i = 0; i < this.postset.length; i++) {
			const arc = this.postset[i];
			let valueVarSnippet = this.assembleCustomVariables();
			valueVarSnippet += this.preface;
			valueVarSnippet += this.valueVarSnippets[arc.valueVarName] + arc.valueVarName;
			const valueResult = evaluateExpression(valueVarSnippet, variables, this.name);
			if (valueResult.hasError) return false;
			// Todo: maybe some error handling, if can't be evaluated as string
			const valueVarValue = JSON.parse(valueResult.evaluation);
			variables[arc.valueVarName] = valueVarValue;

			let keyVarSnippet = this.assembleCustomVariables();
			keyVarSnippet += this.preface;
			keyVarSnippet += this.keyVarSnippets[arc.keyVarName] + arc.keyVarName;
			const keyResult = evaluateExpression(keyVarSnippet, variables, this.name);
			if (keyResult.hasError) return false;
			const keyVarValue = String(JSON.parse(keyResult.evaluation));
			variables[arc.keyVarName] = keyVarValue;

			arc.assignKeyAndValueVariables(keyVarValue, valueVarValue)
		}
		return variables;
	}

	assembleCustomVariables() {
		let inscription = '';
		for (const [key, value] of Object.entries(this.customVariables)) {
			inscription += 'local ' + key + ' = ' + value + ';'
		}
		return inscription;
	}


	evaluateGuard(variables: Record<string, JSONValue>): EvaluationResult {

		let inscription = this.assembleCustomVariables();
		inscription += this.preface;
		// Todo: currently, users MAY have (though unlikely) defined
		// additional stuff/variables in jsonnet var snippets
		inscription += this.guard;
		console.log('inscription')
		console.log(inscription)
		const result = evaluateExpression(inscription, variables, this.name);
		return result;

	}

	checkResultingMarkings() {
		// handle preset and preset/postset arcs
		const postsetArcWithPlaceInPreset = [];
		for (let i = 0; i < this.preset.length; i++) {
			const arc = this.preset[i];
			// check if place is also postset
			let placeIsPostset = false;
			let postsetArc = null;
			for (let j = 0; j < this.postset.length; j++) {
				const pArc = this.postset[j];
				if (pArc.place.id === arc.place.id) {
					postsetArcWithPlaceInPreset.push(pArc.id)
					placeIsPostset = true;
					postsetArc = pArc;
				}
			}
			if (placeIsPostset && postsetArc) {
				// handling places that are in preset and postset
				let pathExpressions: Array<string> = [];
				if (arc.assignedPathExpression === null) return false;
				pathExpressions.push(arc.assignedPathExpression)
				if (postsetArc.assignedPathExpression === null) return false;
				pathExpressions.push(postsetArc.assignedPathExpression)

				// Todo: fix in concept/diss => I guess conflict is not relevant for one transition
				// only in case of parallel firing...
				// DISTINGUISH SELECTED VALUE AND INSERTED VALUE IN POSTSET
				// if (checkForConflict(pathExpressions[0], pathExpressions[1])) return false;

				pathExpressions = sortByOrder(pathExpressions, arc.place.marking);
				const insertOperation: FragmentOperation = {
					pathExpression: arc.assignedPathExpression,
					type: 'remove'
				}

				const removeOperation: FragmentOperation = {
					fragment: postsetArc.valueVarValue,
					key: postsetArc.keyVarValue,
					pathExpression: postsetArc.assignedPathExpression,
					type: 'insert'
				}

				const operations = [];
				if (pathExpressions[0] === arc.assignedPathExpression) {
					// preset expression is higher order
					operations.push(removeOperation);
					operations.push(insertOperation);
				} else {
					operations.push(insertOperation);
					operations.push(removeOperation);
				}

				const result = arc.place.batchOperation(operations, true);
				if (!result) return false;

			} else {
				// check removal of fragment
				if (arc.assignedPathExpression === null) return false;
				const result = arc.place.removeValue(arc.assignedPathExpression, true);
				if (!result) return false;
			}
		}

		for (let i = 0; i < this.postset.length; i++) {
			const arc = this.postset[i];
			// places that are in preset and postset have been handled before
			if (postsetArcWithPlaceInPreset.includes(arc.id)) continue;

			if (arc.assignedPathExpression === null) return false;
			const result = arc.place.insertValue(arc.assignedPathExpression, arc.valueVarValue, arc.keyVarValue, true)
			if (!result) return false;
		}
		return true;
	}

	assembleVariablesFromPathAssignments() {
		const inputValues = [];
		const inputNames = [];
		const outputNames = [];
		const variables: Record<string, JSONValue> = {}
		for (let i = 0; i < this.preset.length; i++) {
			const arc = this.preset[i]
			// if path expression is not assigned, don't pass variable assignments
			if (arc.assignedPathExpression === null) continue;
			variables[arc.tokenVarName] = arc.tokenVarValue;
			variables[arc.keyVarName] = arc.keyVarValue;
			variables[arc.valueVarName] = arc.valueVarValue;
			inputValues.push(arc.valueVarValue);
			inputNames.push(arc.place.name)
		}

		for (let i = 0; i < this.postset.length; i++) {
			const arc = this.postset[i]
			// if path expression is not assigned, don't pass variable assignments
			if (arc.assignedPathExpression === null) continue;
			variables[arc.tokenVarName] = arc.tokenVarValue;
			outputNames.push(arc.place.name);
		}
		variables['transition_name'] = this.name;
		variables['input_values'] = inputValues;
		variables['input_names'] = inputNames;
		variables['output_names'] = outputNames;
		return variables;
	}

	/**
	 * Finds a valid assignment of values to adjacent variables, for which the transition is enabled.
	 * @returns Boolean for whether any assignment was found.
	 */
	findAssignment(): boolean {
		this.resetAssignments();
		// Todo: this should be checked before?
		// if (!this.hasAnyCompleteAssignment()) return false;

		// assemble all possible path expressions per arc
		const assignmentRefsPerArc: Array<Array<AssignmentRef>> = []
		const arcs = this.preset.concat(this.postset);
		for (let i = 0; i < arcs.length; i++) {
			const assignmentRefs: Array<AssignmentRef> = [];
			const arc = arcs[i];
			const assignments = arc.applyFilterExpression(arc.filterExpression);
			if (assignments.length === 0) {
				return false;
			}
			for (let j = 0; j < assignments.length; j++) {
				assignmentRefs.push({
					arc: arc,
					assignmentIndex: j
				})
			}
			assignmentRefsPerArc.push(assignmentRefs);
		}

		// for each possible combination of arc expressions 
		// check whether the transition is enabled.
		const combinations = combineAssignments(assignmentRefsPerArc);
		for (let i = 0; i < combinations.length; i++) {
			const combination = combinations[i]
			const keyVariables: Record<string, string> = {};
			const valueVariables: Record<string, JSONValue> = {}
			const tokenVariables: Record<string, JSONObject> = {}
			// assign path expressions and key, value, token for preset
			// assign path expressions and token for postset
			// collect all token vars, and preset value, key vars first
			// as these are needed to evaluate postset key, value vars
			// Todo: there is some duplicate code with other function that assembles variables
			const inputValues = [];
			const inputNames = [];
			const outputNames = [];
			let combinationHasAnyVariableError = false;
			for (let j = 0; j < combination.length; j++) {
				const assignmentRef = combination[j];
				const arc = assignmentRef.arc;
				if (arc.type === 'preset') {
					const arcVariables = arc.assignVariablesByIndex(assignmentRef.assignmentIndex)
					if (!arcVariables) {
						combinationHasAnyVariableError = true;
						// break; would this break the outer loop as well?
					}
					tokenVariables[arc.tokenVarName] = arcVariables.token;
					keyVariables[arc.keyVarName] = arcVariables.key;
					valueVariables[arc.valueVarName] = arcVariables.value;
					inputValues.push(arcVariables.value);
					inputNames.push(arc.place.name);
				} else {
					const arcVariables = arc.assignTokenVariableByIndex(assignmentRef.assignmentIndex)
					if (!arcVariables) {
						combinationHasAnyVariableError = true;
						// break;
					}
					tokenVariables[arc.tokenVarName] = arcVariables.token;
					outputNames.push(arc.place.name);
				}
			}
			if (combinationHasAnyVariableError) continue;

			// for the postset arcs, evaluate key, value snippets
			const variables = this.assignOutputKeyValueVariables({
				'transition_name': this.name,
				'input_values': inputValues,
				'input_names': inputNames,
				'output_names': outputNames,
				...keyVariables, ...valueVariables, ...tokenVariables
			})
			if (!variables) continue;

			// check whether guard evaluates to true (and not only truthy), otherwise check next combination
			const guardResult = this.evaluateGuard(variables)
			if (guardResult.hasError) continue;
			const guardIsTrue = JSON.parse(guardResult.evaluation)
			if (!(guardIsTrue === true)) continue;


			// check whether operations would result in invalid markings.
			const resutingMarkingsValid = this.checkResultingMarkings();

			if (resutingMarkingsValid) return true;
		}
		// no enabled assignment found. return false
		return false;
	}

}