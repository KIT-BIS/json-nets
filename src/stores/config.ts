import type { JSONMarking, JSONObject } from "@/util/jsonOperations";
import type { JSONSchema7 } from "json-schema";
import { defineStore } from "pinia";
import { usePlacesStore } from "./place";
import { useTransitionsStore } from "./transition";
import { useUiStateStore } from "./uiState";

export type ConfigTransitionType = {
    id: string,
    title: string,
    description: string,
    keySnippet: string,
    valueSnippet: string,
    preface: string,
    guard: string,
    presetFilter: string,
    postsetFilter: string,
    customVariables: Record<string, string>
}

export type ConfigPlaceType = {
    id: string,
    externalInteraction: ExternalInteractionType,
    schema: JSONSchema7,
    marking: JSONMarking
}

type ExternalInteractionType = { type: 'none' } | {
    type: 'push',
    url: string
} | {
    type: 'pull',
    url: string,
    enforcedMarking: JSONObject
}

export type ConfigData = {
    name: string,
    defaultUIAssistMode: 'assisted' | 'expert',
    defaultTransitionType: string,
    defaultPlaceType: string,
    placeTypes: Array<ConfigPlaceType>,
    transitionTypes: Array<ConfigTransitionType>,
    examples: Array<{ name: string, net: any }>,
    allowAutoLayout: boolean,
    visualisationConfig: {} | false
}

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            // Todo: UI AssistMode is actually not needed to be saved here
            name: 'default',
            defaultUIAssistMode: 'expert',
            defaultTransitionType: 'custom',
            defaultPlaceType: 'custom',
            placeTypes: [],
            transitionTypes: [],
            examples: [],
            allowAutoLayout: true,
            // Todo: Visualisations are currently only really viable for Scope3tool
            // develop generic solution
            visualisationConfig: false,
        } as ConfigData
    },
    getters: {
        //selectedPlaceTypeDescription: (state) => {
        //    const selectedPlaceType = state.placeTypes.find((placeType) => placeType.id === usePlacesStore().placeType)
        //    return selectedPlaceType?.schema.description;
        //},
        getPlaceTypeById: (state) => {
            return (placeTypeId: String) => state.placeTypes.find((placeType) => placeType.id === placeTypeId)
        },
        //selectedTransitionTypeDescription: (state) => {
        //    const selectedTransitionType = state.transitionTypes.find(
        //        (transitionType) => 
        //            transitionType.id === useTransitionsStore().transitionType
        //    )
        //    return selectedTransitionType?.description;
        //},
        getTransitionTypeById: (state) => {
            return (transitionTypeId: String) => state.transitionTypes.find((transitionType) => transitionType.id === transitionTypeId)
        }

    },
    actions: {
        loadConfig(config: ConfigData, uploaded = false) {
            if (!uploaded) {
                this.name = config.name;
            }
            this.placeTypes = config.placeTypes;
            this.transitionTypes = config.transitionTypes;
            this.defaultPlaceType = config.defaultPlaceType;
            this.defaultTransitionType = config.defaultTransitionType;
            this.examples = config.examples;
            this.allowAutoLayout = config.allowAutoLayout;
            this.visualisationConfig = config.visualisationConfig;
            useUiStateStore().uiAssistMode = config.defaultUIAssistMode;
        },
        resetConfig() {
            this.$reset();
            useUiStateStore().uiAssistMode = this.defaultUIAssistMode;
        }
    }
});