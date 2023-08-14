import type { ArcData, TransitionData, PlaceData, FireEvent, ImportData } from "@/json-nets/Net";
import type { JSONObject } from "@/util/jsonOperations";

import { defineStore } from "pinia";
import { getNetInstance } from "@/json-nets/Net";

export const useNetStore = defineStore('net', {
    state: () => {
        return {
            places: [] as Array<PlaceData>,
            transitions: [] as Array<TransitionData>,

            lastRemovedCells: [] as Array<string>,
            lastCreatedPlaces: [] as Array<PlaceData>,
            lastCreatedTransitions: [] as Array<TransitionData>,
            lastCreatedArcs: [] as Array<ArcData>,
            lastUpdatedPlace: {} as PlaceData,
            lastUpdatedTransition: {} as TransitionData,
            lastFiredArcs: [] as Array<FireEvent>,

            layout: {} as joint.dia.Graph,
            importedData: {} as JSONObject,

        }
    },
    actions: {
        setLayout(layout: joint.dia.Graph) {
          this.layout = layout;
        },
        export() {
            const netData = getNetInstance().export();
            const layoutData = this.layout.toJSON();
            return JSON.stringify({netData, layoutData}, null, 2);
        },
        import(json: JSONObject) {
            console.log('json')
            console.log(json);
            const layoutData = <JSONObject>json.layoutData;
            const netData = <ImportData> getNetInstance().import(json.netData)
            this.transitions = netData.transitions;
            // this.lastCreatedTransitions = importData.transitions;
            this.places = netData.places;
            this.importedData = {layoutData, netData}
            // this.lastCreatedTransitions = importData.transitions;
        },
        connect(fromID: string, toID: string) {
            const arcData = getNetInstance().connect(fromID, toID);
            if (arcData) {
                this.lastCreatedArcs = [arcData]
            }
        },

        addPlace() {
            let placeData: PlaceData = getNetInstance().addPlace();
            this.places.push(placeData)
            this.lastCreatedPlaces = [placeData];
        },

        deletePlace(id: string) {
            this.lastRemovedCells = getNetInstance().removePlace(id);
        },
        addTransition() {
            let transition: TransitionData = getNetInstance().addTransition();
            this.transitions.push(transition);
            this.lastCreatedTransitions = [transition];
        },

        deleteTransition(id: string) {
            this.lastRemovedCells = getNetInstance().removeTransition(id);
        },
        disconnect(id: string) {
            getNetInstance().disconnect(id);
            this.lastRemovedCells = [id];
        },

        // todo can use similar patten like lastRemovedCells and watch in JointPaper
        fireUnderAnyAssignment(id: string) {
            this.lastFiredArcs = getNetInstance().fireUnderAnyAssignment(id)
        },
        fireAny(){
            this.lastFiredArcs = getNetInstance().fireAny();
        },

    }
});