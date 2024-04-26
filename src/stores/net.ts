import type { ArcData, TransitionData, PlaceData, FireEvent, ImportData } from "@/json-nets/Net";

import { defineStore } from "pinia";
import { getNetInstance } from "@/json-nets/Net";
import { useConfigStore } from "./config";

/**
 * Provides state of current json net for the UI and especially JointJS visualisation.
 * All Vue components should interact with stores, while the stores communicate with
 * json-nets "backend" that handles the core logic (getNetInstance)
 */
export const useNetStore = defineStore('net', {
	state: () => {
		return {
			places: [] as Array<PlaceData>,
			transitions: [] as Array<TransitionData>,
			// Todo: consider renaming to distinguis from configStore types (here only references are savec)
			transitionTypes: {} as Record<string, string>,
			placeTypes: {} as Record<string, string>,

			lastRemovedCells: [] as Array<string>,
			lastCreatedPlaces: [] as Array<PlaceData>,
			lastCreatedTransitions: [] as Array<TransitionData>,
			lastCreatedArcs: [] as Array<ArcData>,
			lastUpdatedPlace: {} as PlaceData,
			lastUpdatedPlaces: [] as Array<PlaceData>,
			lastUpdatedTransition: {} as TransitionData,
			lastFiredArcs: [] as Array<FireEvent>,

			layout: {} as joint.dia.Graph,
			// Todo: fix Schema, JSONObject types
			importedData: {} as any,

		}
	},
	actions: {
		setLayout(layout: joint.dia.Graph) {
			this.layout = layout;
		},
		export() {
			const netData = getNetInstance().export();
			const layoutData = this.layout.toJSON();
			const typeData = { placeTypes: this.placeTypes, transitionTypes: this.transitionTypes }
			return JSON.stringify({ typeData, netData, layoutData }, null, 2);
		},
		import(json: { typeData?: { placeTypes: Record<string, string>, transitionTypes: Record<string, string> }, netData: ImportData, layoutData: any }) {
			if (json.typeData) {
				this.placeTypes = json.typeData.placeTypes;
				this.transitionTypes = json.typeData.transitionTypes;
			}
			const layoutData = json.layoutData;
			const netData = getNetInstance().import(json.netData)
			this.transitions = netData.transitions;
			this.places = netData.places;
			this.importedData = { layoutData, netData }
		},
		connect(fromID: string, toID: string) {
			const arcData = getNetInstance().connect(fromID, toID);
			if (arcData) {
				this.lastCreatedArcs = [arcData];

				let transitionID = '';
				if (arcData.type == 'preset') {
					transitionID = arcData.to;
				} else {
					transitionID = arcData.from;
				}

				const transitionTypeID = this.transitionTypes[transitionID];
				if (transitionTypeID !== 'custom') {
					const transitionType = useConfigStore().getTransitionTypeById(transitionTypeID);
					if (!transitionType) return;
					if (arcData.type == 'preset') {
						getNetInstance().updateArc(arcData.id, transitionType.presetFilter)
					} else {
						getNetInstance().updateAllTransitionSnippets(transitionID,
							transitionType.keySnippet,
							transitionType.valueSnippet
						);
						getNetInstance().updateArc(arcData.id, transitionType.postsetFilter)
					}

				}
			}
		},

		resetModel() {
			const allPlaces = getNetInstance().allPlaces();
			const updates = [];
			for (let i = 0; i < allPlaces.length; i++) {
				const place = allPlaces[i];
				console.log('resetting place' + place.id)
				const marking = getNetInstance().getDefaultMarking(place.id);
				console.log(marking);
				if (marking) {
					const placeData = getNetInstance().updatePlaceMarking(place.id, marking)
					if (placeData) {
						updates.push(placeData);
					}
				}
			}

			this.lastUpdatedPlaces = updates;
		},

		addPlace() {
			let placeData: PlaceData = getNetInstance().addPlace();
			this.places.push(placeData)

			const config = useConfigStore();
			this.placeTypes[placeData.id] = config.defaultPlaceType;

			if (config.defaultPlaceType !== 'custom') {
				const placeType = config.getPlaceTypeById(config.defaultPlaceType)
				if (!placeType) return;
				const updateData = getNetInstance().updatePlace(placeData.id, placeData.name, placeType.schema, placeType.marking);
				if (updateData) {
					this.lastCreatedPlaces = [updateData];
					getNetInstance().setDefaultMarking(placeData.id);
				}
			} else {
				this.lastCreatedPlaces = [placeData];
			}

		},

		deletePlace(id: string) {
			// Todo: clean up types as well
			this.lastRemovedCells = getNetInstance().removePlace(id);
		},
		addTransition() {
			let transition: TransitionData = getNetInstance().addTransition();
			this.transitions.push(transition);

			const config = useConfigStore();
			this.transitionTypes[transition.id] = config.defaultTransitionType;

			if (config.defaultTransitionType !== 'custom') {
				const transitionType = config.getTransitionTypeById(config.defaultTransitionType)
				if (!transitionType) return;
				let updateData = getNetInstance().updateTransition(transition.id, transition.name, transitionType.preface, transitionType.guard);
				if (updateData) transition = updateData;

				const customVarNames = Object.keys(transitionType.customVariables);
				for (let i = 0; i < customVarNames.length; i++) {
					let updateData = getNetInstance().updateTransitionVariable(transition.id, customVarNames[i], transitionType.customVariables[customVarNames[i]]);
					if (updateData) transition = updateData;
				}


			}
			this.lastCreatedTransitions = [transition];
		},

		deleteTransition(id: string) {
			// Todo: clean up types as well
			this.lastRemovedCells = getNetInstance().removeTransition(id);
		},
		disconnect(id: string) {
			getNetInstance().disconnect(id);
			this.lastRemovedCells = [id];
		},

		// Todo: can use similar patten like lastRemovedCells and watch in JointPaper
		fireUnderAnyAssignment(id: string) {
			this.lastFiredArcs = getNetInstance().fireUnderAnyAssignment(id)
		},
		fireAny() {
			this.lastFiredArcs = getNetInstance().fireAny();
		},

	}
});