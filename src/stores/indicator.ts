import { getNetInstance } from "@/json-nets/Net";
import { defineStore } from "pinia"

export const useIndicatorStore = defineStore('indicator', {
    state: () => {
        return {
            selectedPlaceID: 'none' as string,
            placeName: '' as string,
            indicatorValue: "... loading" as string,
            indicatorType: 'pcf' as string
        }
    },
    actions: {
        reset() {
            this.selectedPlaceID = 'none'
        },
        selectPlace(id: string) {
            this.selectedPlaceID = id;

            this.updateIndicator();
        },
        updateIndicator() {
            const placeData = getNetInstance().findPlace(this.selectedPlaceID)
            if (placeData) {
                this.placeName = placeData.name;
                const content = <{ ghgFactor: number, amount: number, pds:number, type: string}>placeData.marking[0].data;

                if (this.indicatorType === 'pcf') {
                    this.indicatorValue = (content.ghgFactor * content.amount) + " kgCO2eq";
                } else if (this.indicatorType === 'pds') {
                    if (content.type === "secondary") {
                        this.indicatorValue = "0% Primary Data"
                    } else {
                        this.indicatorValue = (content.pds * 100) + "% Primary Data";
                    }
                }
            }

        }

    }
})