import type { JSONMarking, JSONObject, JSONValue } from "@/util/jsonOperations";
import { Arc } from "./Arc";
import { Place } from "./Place";
import { Transition } from "./Transition";

import { unCacheSchema } from "@/util/jsonSchema";
import { evaluateExpression, type EvaluationResult } from "@/util/jsonnet";
import { v4 as uuid } from 'uuid'
import type { JSONSchema7 } from "json-schema";

export type TransitionData = {
	name: string,
	id: string,
	preface: string,
	guard: string,
	readonly: boolean,
	customVariables: Record<string, string>
}

export type PlaceData = {
	name: string,
	id: string,
	marking: JSONMarking,
	schema: JSONSchema7,
	hasError: boolean,
	errorType: 'name' | 'schema' | 'data' | 'none',
	errorMessage: string | null
}

export type ArcData = {
	id: string,
	type: 'preset' | 'postset',
	from: string,
	to: string
}

export type FireEvent = {
	arcID: string,
	placeID: string,
	num: number
}

export type ImportData = {
	transitions: Array<TransitionData>,
	places: Array<PlaceData>,
	arcs: Array<ArcData>
}

export type AssignmentData = {
	complete: boolean,
	presetComplete: boolean,
	postsetComplete: boolean
}

export type EvaluationData = {
	hasAnyError: boolean,
	variables: Record<string, JSONValue>,
	preface: EvaluationResult,
	hasAnyOutputError?: boolean,
	outputValueVariables?: Record<string, EvaluationResult>,
	outputKeyVariables?: Record<string, EvaluationResult>,
	guard?: EvaluationResult
} | false


// not sure if this actually ensures an app-wide singleton ... let's hope so
let net: Net | null = null
export function getNetInstance(): Net {
	if (net === null) {
		net = new Net();
	}

	return net;
}

/**
 * Implementation of JSON-Nets concept.
 */
export class Net {

	private _transitions: Array<Transition>
	private _places: Array<Place>
	private _arcs: Array<Arc>

	constructor() {
		this._transitions = [];
		this._places = [];
		this._arcs = [];
	}

	/**
	 * Finds a place by given ID.
	 */
	findPlace(placeID: string) {
		return this._places.find((place) => place.id === placeID)
	}

	/**
	 * Removes a place from the net. Will also remove any
	 * arcs that were connected to it.
	 * @param {String} placeID The ID of the place to remove.
	 */
	removePlace(placeID: string): Array<string> {
		const removedElements = []
		this._places = this._places.filter((place) => {
			return place.id !== placeID
		})
		removedElements.push(placeID);

		const arcsToremove = this._arcs.filter((arc) => {
			return arc.place.id === placeID
		})
		arcsToremove.forEach((arc) => {
			this.disconnect(arc.id)
			removedElements.push(arc.id)
		})
		return removedElements;
	}

	/**
	 * Set the content of a place
	 * (expected to be an object with fields 'schema' and 'data')
	 * @param {String} placeID The place to set the content.
	 * @param {String} placeName Name of the place.
	 */
	updatePlace(placeID: string, placeName: string, schema?: JSONSchema7, marking?: JSONMarking): PlaceData | false {
		const place = this.findPlace(placeID);
		if (!place) {
			return false;
		}
		if (placeName !== place.name) {
			place.name = placeName;
			const connectedArcs = this._arcs.filter((arc) => {
				return arc.place.id === placeID;
			});
			for (let i = 0; i < connectedArcs.length; i++) {
				connectedArcs[i].updateVarNames(placeName);
			}
		}
		if (schema) place.schema = schema;
		if (marking) place.marking = marking;

		return { id: place.id, name: place.name, marking: place.marking, schema: place.schema, hasError: false, errorType: 'none', errorMessage: '' }
	}

	updatePlaceMarking(placeID: string, marking: JSONMarking): PlaceData | false {
		const place = this.findPlace(placeID);
		if (!place) {
			return false;
		}
		place.marking = marking;
		const checkResult = place.validateMarking(marking);
		return { id: place.id, name: place.name, marking: place.marking, schema: place.schema, hasError: !checkResult.isValid, errorType: 'data', errorMessage: checkResult.error }
	}

	/**
	 * Sets the current marking as the default marking (a place can be reset to its default marking after marking was changed).
	 * @param placeID 
	 * @returns 
	 */
	setDefaultMarking(placeID: string) {
		const place = this.findPlace(placeID);
		if (!place) {
			return false;
		}
		place.defaultMarking = JSON.parse(JSON.stringify(place.marking));
	}

	getDefaultMarking(placeID: string) {
		const place = this.findPlace(placeID);
		if (!place) {
			return false;
		}
		return JSON.parse(JSON.stringify(place.defaultMarking));

	}

	allPlaces() {
		return JSON.parse(JSON.stringify(this._places));
	}


	updatePlaceSchema(placeID: string, schema: JSONObject): PlaceData | false {
		const place = this.findPlace(placeID);
		if (!place) {
			return false;
		}

		const checkResult = place.validateSchema(schema);
		if (checkResult.schemaValid) {
			place.schema = schema;
		}
		return { id: place.id, name: place.name, marking: place.marking, schema: place.schema, hasError: !checkResult.schemaValid, errorType: 'schema', errorMessage: checkResult.error }

	}

	/**
	 * Check if place name is unique.
	 * @param {String} name - Name of the place
	 * @param {String} id - ID of the place
	 * @return {Boolean}
	 */
	validatePlaceName(name: string, id: string): boolean {
		// Todo: ensure that we also get unique variable names with place names like "Some Product" and "SomeProduct"
		const otherPlacesWithSameName = this._places.filter((place) => {
			const isOtherPlaceWithSameName = place.name === name && place.id !== id
			return isOtherPlaceWithSameName
		})
		if (otherPlacesWithSameName.length > 0) {
			return false
		} else {
			return true
		}
	}

	/**
	 * Creates a new transition and adds it to the net.
	 * @param {String} transitionID - id of the transition
	 */
	addTransition(transitionID: string = uuid()): TransitionData {
		const newTransition = new Transition(transitionID, 'transition')
		this._transitions.push(newTransition)
		return {
			id: newTransition.id,
			name: newTransition.name,
			preface: newTransition.preface,
			guard: newTransition.guard,
			readonly: newTransition.readonly,
			customVariables: newTransition.customVariables
		}
	}

	addPlace(placeID = uuid()): PlaceData {
		const shortID = placeID.substring(0, 4)
		const name = 'place' + shortID;
		const newPlace = new Place(placeID, name)

		// Todo: clarify hard-coded default setting, config default and custom
		newPlace.schema = JSON.parse(JSON.stringify({ type: "array", items: { "type": "object" } }));
		newPlace.marking = JSON.parse(JSON.stringify([]));
		newPlace.defaultMarking = JSON.parse(JSON.stringify([]));

		this._places.push(newPlace)
		return { id: newPlace.id, name: newPlace.name, marking: newPlace.marking, schema: newPlace.schema, hasError: false, errorType: 'none', errorMessage: '' }
	}


	/**
	 * Set the name and inscription of a transition.
	 */
	updateTransition(transitionID: string, name: string, preface?: string, guard?: string, fragmentVarSnippets?: Record<string, string>, keyVarSnippets?: Record<string, string>, customVariables?: Record<string, string>): TransitionData | false {
		const transition = this.findTransition(transitionID)
		if (transition) {
			transition.name = name
			if (guard !== undefined) transition.guard = guard
			if (preface !== undefined) transition.preface = preface
			if (keyVarSnippets !== undefined) transition.keyVarSnippets = keyVarSnippets
			if (fragmentVarSnippets !== undefined) transition.valueVarSnippets = fragmentVarSnippets
			if (customVariables !== undefined) transition.customVariables = customVariables
			return { id: transition.id, name: transition.name, preface: transition.preface, guard: transition.guard, readonly: transition.readonly, customVariables: transition.customVariables };
		}
		return false;
	}

	updateTransitionMode(transitionID: string, readonly: boolean): TransitionData | false {
		const transition = this.findTransition(transitionID)
		if (transition) {
			transition.readonly = readonly
			return { id: transition.id, name: transition.name, preface: transition.preface, guard: transition.guard, readonly: transition.readonly, customVariables: transition.customVariables };
		}
		return false;

	}

	updateTransitionVariable(transitionID: string, key: string, value: string): TransitionData | false {
		const transition = this.findTransition(transitionID)
		if (transition) {
			transition.customVariables[key] = value;
			return { id: transition.id, name: transition.name, preface: transition.preface, guard: transition.guard, readonly: transition.readonly, customVariables: transition.customVariables };
		}
		return false;
	}

	removeTransitionVariable(transitionID: string, key: string): TransitionData | false {
		const transition = this.findTransition(transitionID)
		if (transition) {
			delete transition.customVariables[key];
			return { id: transition.id, name: transition.name, preface: transition.preface, guard: transition.guard, readonly: transition.readonly, customVariables: transition.customVariables };
		}
		return false;
	}

	updateTransitionSnippets(transitionID: string, arcID: string, keySnippet: string, fragmentSnippet: string) {
		const transition = this.findTransition(transitionID)
		const arc = this.findArc(arcID)
		if (!transition || !arc) return;
		transition.keyVarSnippets[arc.keyVarName] = keySnippet;
		transition.valueVarSnippets[arc.valueVarName] = fragmentSnippet;
	}

	/**
	 * Finds a transition by given ID.
	 * @param {String} transitionID The ID of the transition to find.
	 */
	findTransition(transitionID: string) {
		return this._transitions.find((transition) => transition.id === transitionID)
	}

	assignFilterByPath(arcID: string, jsonPath: string): AssignmentData | false {
		const arc = this.findArc(arcID);
		if (!arc) return false;

		if (arc.type === 'preset') {
			arc.assignVariablesByPathExpression(jsonPath);
		} else if (arc.type === 'postset') {
			arc.assignTokenVariableByPathExpression(jsonPath);
		}
		const complete = arc.transition.hasCompleteAssignment()
		const presetComplete = arc.transition.hasCompletePresetAssignment()
		const postsetComplete = arc.transition.hasCompletePostsetAssignment()
		return { complete, presetComplete, postsetComplete }
	}

	/**
	 * Removes a transition from the net. Will also remove
	 * any connected arcs.
	 * @param {String} transitionID The ID of the transition to remove.
	 */
	removeTransition(transitionID: string): Array<string> {
		const removedElements = []
		let transitionToRemove = this.findTransition(transitionID);
		const newTransitionsList = this._transitions.filter((transition) => {
			if (transition.id === transitionID) {
				transitionToRemove = transition
				return false
			} else {
				return true
			}
		})

		if (!transitionToRemove) return [];
		removedElements.push(transitionToRemove.id)

		transitionToRemove.preset.forEach((arc: Arc) => {
			this.disconnect(arc.id)
			removedElements.push(arc.id)
		})
		transitionToRemove.postset.forEach((arc) => {
			this.disconnect(arc.id)
			removedElements.push(arc.id)
		})
		this._transitions = newTransitionsList
		return removedElements;
	}

	/**
	 * Creates an arc between two nodes of the net.
	 * @param {String} fromID ID of the outgoing node.
	 * @param {String} toID ID of the incoming node.
	 * @param {String} arcID Optional predefined ID of arc.
	 */
	connect(fromID: string, toID: string, arcID: string = uuid()): ArcData | false {
		const nodes = [...this._places, ...this._transitions]
		const from = nodes.find((node) => node.id === fromID)
		const to = nodes.find((node) => node.id === toID)
		let arc
		if (from instanceof Place) {
			if (to instanceof Place) {
			} else if (to instanceof Transition) {
				arc = new Arc(from, to, "preset", arcID)
				this._arcs.push(arc)
				to.connectArc(arc);
			} else {
			}
		} else if (from instanceof Transition) {
			if (to instanceof Transition) {
			} else if (to instanceof Place) {
				arc = new Arc(to, from, "postset", arcID)
				this._arcs.push(arc)
				from.connectArc(arc);
			} else {
			}
		}
		if (arc && from && to) {
			return { id: arc.id, type: arc.type, from: from.id, to: to.id }
		} else {
			return false
		}
	}

	// Todo: when updating from transition types, snippets without variable names are given (as expected in this case)
	// when updating from editor, the snippets include the names (as expected in updateTransitionSnippets)
	updateAllTransitionSnippets(transitionID: string, keySnippet: string, valueSnippet: string) {
		const transition = this._transitions.find((node) => node.id === transitionID);
		if (!transition) return;
		transition.updateAllSnippets(keySnippet, valueSnippet);
	}

	/**
	 * Removes an arc.
	 * @param {String} arcID
	 */
	disconnect(arcID: string) {
		const arc = this.findArc(arcID);
		if (!arc) return;
		arc.transition.disconnectArc(arc);
		this._arcs = this._arcs.filter((arc) => {
			if (arc.id === arcID) {
				return false
			} else {
				return true
			}
		})
	}

	/**
	 * Find an arc by ID.
	 * @param {String} arcID The arc ID.
	 */
	findArc(arcID: string) {
		return this._arcs.find((arc) => arc.id === arcID)
	}

	/**
	 * Sets the label for an arc.
	 * @param {String} arcID The ID of the arc to add the label to.
	 * @param {Object} label The label to set.
	 */
	updateArc(arcID: string, inscription: string): ArcData | false {
		const arc = this._arcs.find((arc) => arc.id === arcID)
		if (!arc) return false;
		arc.filterExpression = inscription;
		let from, to = '';
		if (arc.type === 'preset') {
			from = arc.place.id
			to = arc.transition.id
		} else {
			from = arc.transition.id
			to = arc.place.id
		}
		return { from, to, id: arc.id, type: arc.type }
	}

	fireUnderCurrentAssignment(transitionID: string): Array<FireEvent> {
		const transition = this.findTransition(transitionID);
		if (!transition) return [];

		return transition.fire();
	}

	fireUnderAnyAssignment(transitionID: string): Array<FireEvent> {
		const transition = this.findTransition(transitionID);
		if (!transition) return [];

		const hasValidAssignment = transition.findAssignment();
		if (hasValidAssignment) {
			return transition.fire();
		} else {
			return [];
		}
	}

	fireAny(): Array<FireEvent> {
		for (let i = 0; i < this._transitions.length; i++) {
			let transition = this._transitions[i]
			if (transition.findAssignment()) {
				return transition.fire();
			}
		}
		return []
	}

	export() {
		const placesExportArray = []
		const transitionsExportArray = []
		const arcsExportArray = []

		for (let i = 0; i < this._places.length; i++) {
			let place = this._places[i]
			placesExportArray.push({
				id: place.id,
				name: place.name,
				marking: place.marking,
				schema: place.schema
			})
		}

		for (let i = 0; i < this._transitions.length; i++) {
			let transition = this._transitions[i]
			transitionsExportArray.push({
				id: transition.id,
				name: transition.name,
				preface: transition.preface,
				guard: transition.guard,
				customVariables: transition.customVariables,
				keyVarSnippets: transition.keyVarSnippets,
				fragmentVarSnippets: transition.valueVarSnippets
			})
		}

		for (let i = 0; i < this._arcs.length; i++) {
			let arc = this._arcs[i]
			let fromId, toId
			if (arc.type === 'preset') {
				fromId = arc.place.id
				toId = arc.transition.id
			} else if (arc.type === 'postset') {
				fromId = arc.transition.id
				toId = arc.place.id
			}

			arcsExportArray.push({
				id: arc.id,
				filter: arc.filterExpression,
				fromId,
				toId
			})
		}
		const exportData = {
			places: placesExportArray,
			transitions: transitionsExportArray,
			arcs: arcsExportArray
		}

		return exportData
	}

	assignOutputVariables(id: string) {
		const transition = this.findTransition(id);
		if (!transition) return;


		for (let i = 0; i < transition.postset.length; i++) {
			const arc: Arc = transition.postset[i];
			const variablesFromPathAssignments = transition.assembleVariablesFromPathAssignments();
			const variables = transition.assignOutputKeyValueVariables(variablesFromPathAssignments);
			if (variables) {
				// Todo: ensure that keys are always strings
				arc.assignKeyAndValueVariables(String(variables[arc.keyVarName]), variables[arc.valueVarName]);
			}
		}

	}

	clear() {
		while (this._transitions.length > 0) {
			this.removeTransition(this._transitions[0].id)
		}

		while (this._places.length > 0) {
			unCacheSchema(this._places[0].id);
			this.removePlace(this._places[0].id)
		}
	}

	import(json: any): ImportData {
		this.clear()
		const importData: ImportData = {
			places: [],
			transitions: [],
			arcs: []
		}

		for (let i = 0; i < json.places.length; i++) {
			let place = json.places[i]
			this.addPlace(place.id)
			const placeData = this.updatePlace(place.id, place.name, place.schema, place.marking)
			this.setDefaultMarking(place.id);
			if (placeData) {
				importData.places.push(placeData);
			}
		}

		for (let i = 0; i < json.transitions.length; i++) {
			let transition = json.transitions[i]
			this.addTransition(transition.id)
			const transitionData = this.updateTransition(transition.id, transition.name, transition.preface, transition.guard, transition.fragmentVarSnippets, transition.keyVarSnippets, transition.customVariables)
			if (transitionData) {
				importData.transitions.push(transitionData);

			}
		}

		// Todo: probably makes sense to also return arcData, but current editor doesn't need this
		for (let i = 0; i < json.arcs.length; i++) {
			let arc = json.arcs[i]
			this.connect(arc.fromId, arc.toId, arc.id)
			const arcData = this.updateArc(arc.id, arc.filter)
			if (arcData) {
				importData.arcs.push(arcData);
			}
		}

		return importData;
	}

	getEvaluations(id: string): EvaluationData {
		const transition = this.findTransition(id);
		if (!transition) return false;

		const variables = transition.assembleVariablesFromPathAssignments();

		let hasAnyError = false;
		let hasAnyOutputError = false;
		const preface = evaluateExpression(transition.preface + ' true', variables)
		if (preface.hasError) {
			hasAnyError = true;
			return { hasAnyError, preface, variables }
		}

		const valueVariables = Object.keys(transition.valueVarSnippets);
		const outputValueVariables: Record<string, EvaluationResult> = {};
		// This is somewhat duplicated with transition logic, but I want this function
		// to give more verbose info to the ui
		for (let i = 0; i < valueVariables.length; i++) {
			const varName = valueVariables[i];
			let valueVarSnippet = transition.preface;
			valueVarSnippet += transition.valueVarSnippets[varName] + varName;
			const valueResult = evaluateExpression(valueVarSnippet, variables);
			outputValueVariables[varName] = valueResult;
			if (valueResult.hasError) {
				hasAnyError = true;
				hasAnyOutputError = true;
			}
		}

		const keyVariables = Object.keys(transition.keyVarSnippets);
		const outputKeyVariables: Record<string, EvaluationResult> = {};
		for (let i = 0; i < keyVariables.length; i++) {
			const varName = keyVariables[i];
			let keyVarSnippet = transition.preface;
			keyVarSnippet += transition.keyVarSnippets[varName] + varName;
			const valueResult = evaluateExpression(keyVarSnippet, variables);
			outputKeyVariables[varName] = valueResult;
			if (valueResult.hasError) {
				hasAnyError = true;
				hasAnyOutputError = true;
			}
		}

		if (hasAnyOutputError) {
			return { hasAnyError, variables, hasAnyOutputError, preface, outputKeyVariables, outputValueVariables }
		}


		const allVars = transition.assignOutputKeyValueVariables(variables)
		if (!allVars) {
			// Todo: better solution than this if
			return { hasAnyOutputError, hasAnyError, variables, preface, outputValueVariables, outputKeyVariables, guard: { evaluation: 'Output expressions have errors.', hasError: true } }
		}
		const guard = transition.evaluateGuard(allVars);
		if (guard.hasError) hasAnyError = true;
		return { hasAnyOutputError, hasAnyError, preface, variables: allVars, outputValueVariables, outputKeyVariables, guard }
	}
}