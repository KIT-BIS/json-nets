// import type { ArcData, TransitionData, PlaceData, FireEvent, ImportData } from "@/json-nets/Net";
// import type { JSONObject } from "@/util/jsonOperations";

import { defineStore } from "pinia";
// import { getNetInstance } from "@/json-nets/Net";

export type ConfigData = {
    placeTypes: Array<Object>
}

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
        } as ConfigData
    },
    actions: {
        loadConfig(config: ConfigData) {
            this.placeTypes = config.placeTypes
        }
    }
});