import type { PlaceData } from "@/json-nets/Net";

import { defineStore } from "pinia"

import { useNetStore } from "./net";
import { getNetInstance } from "@/json-nets/Net";

import { mock } from "mock-json-schema";

/**
 * Provides state for currently selected place to be shown in PlaceModal.
 */
export const usePlacesStore = defineStore('places', {
    state: () => {
        return {
            place: {} as PlaceData,
            markingString: '' as string,
            schemaString: '' as string,
            databaseMap: {} as Record<string, string>,
            formsData: {}
        }
    },
    actions: {
        // storing basic data to the json net
        saveName() {
            // Todo: check uniqueness!
            const placeData = getNetInstance().updatePlace(this.place.id, this.place.name);
            if (placeData) {
                this.place.name = placeData.name;
                useNetStore().lastUpdatedPlace = placeData;
            }
        },
        addToken() {
            let token = mock(this.place.schema.items)
            this.place.marking.push(token)
            this.savePlaceMarkingFromEditor(JSON.stringify(this.place.marking, null, 2));
        },
        savePlaceMarkingFromEditor(markingString: string) {
            try {
                const marking = JSON.parse(markingString)
                this.formsData = marking;
                this.markingString = markingString;
                const placeData = getNetInstance().updatePlaceMarking(this.place.id, marking)
                if (placeData) {
                    getNetInstance().setDefaultMarking(this.place.id);
                    this.place.marking = placeData.marking;
                    this.place.errorMessage = placeData.errorMessage;
                    this.place.hasError = placeData.hasError;
                    this.place.errorType = placeData.errorType;
                    useNetStore().lastUpdatedPlace = placeData;
                }

            } catch (e: any){
                // parsing failed
            }

        },
        resetMarking() {
            let marking = getNetInstance().getDefaultMarking(this.place.id);
            this.savePlaceMarkingFromForm(marking);
        },
        savePlaceMarkingFromForm(newValue: any) {
            try {
                this.formsData = newValue;
                this.markingString = JSON.stringify(this.formsData, null, 2);

                const placeData = getNetInstance().updatePlaceMarking(this.place.id, newValue);
                if (placeData) {
                    this.place.marking = placeData.marking;
                    this.place.errorMessage = placeData.errorMessage;
                    this.place.hasError = placeData.hasError;
                    this.place.errorType = placeData.errorType;
                    useNetStore().lastUpdatedPlace = placeData;
                }

            } catch (e: any) {

            }
        },
        savePlaceSchema(schemaString: string) {
            try {
                const schema = JSON.parse(schemaString)
                this.schemaString = schemaString;
                const placeData = getNetInstance().updatePlaceSchema(this.place.id, schema)
                if (placeData) {
                    this.place.schema = placeData.schema;
                    this.place.errorMessage = placeData.errorMessage;
                    this.place.hasError = placeData.hasError;
                    this.place.errorType = placeData.errorType;
                }

            } catch (e: any){
                // parsing failed
            }
        },
        // interactions when input is cancelled
        resetName() {
            const place = getNetInstance().findPlace(this.place.id)
            if(!place) return;
            this.place.name = place.name;
        },
        loadPlace(placeID: string) {
            const placeData = useNetStore().places.find((p) => {
                return p.id === placeID 
            })
            if(placeData) {
                this.place = placeData;

                const place = getNetInstance().findPlace(this.place.id)
                if(place) {
                    // this will also update the placeData object in the array
                    this.place.id = place.id;
                    this.place.name = place.name;
                    this.place.marking = place.marking;
                    this.place.schema = place.schema;
                }
                this.markingString = JSON.stringify(placeData.marking, null, 2)
                this.formsData = JSON.parse(JSON.stringify(placeData.marking));
                // only the schema for root array elements is shown in editor
                this.schemaString = JSON.stringify(placeData.schema, null, 2)
            }
        },
    }
});