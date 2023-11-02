import { getNetInstance } from "@/json-nets/Net";
import { defineStore } from "pinia"

export const useIndicatorStore = defineStore('indicator', {
    state: () => {
        return {
            selectedPlaceID: 'none' as string,
            placeName: '' as string,
            indicatorValue: 0 as number
        }
    },
    actions: {
        reset() {
            this.selectedPlaceID = 'none'
        },
        selectPlace(id: string) {
            this.selectedPlaceID = id;

            const placeData = getNetInstance().findPlace(id)
            if (placeData) {
                this.placeName = placeData.name;
                const content = placeData.marking[0];
                this.indicatorValue = <number>content['ghgFactor'] * <number>content['amount'];
            }
        }

    }
})