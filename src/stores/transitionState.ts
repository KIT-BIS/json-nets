import { defineStore } from "pinia"

export const useTransitionStateStore = defineStore('transitionState', {
    state: () => {
        return {
            name: ''
        }
    }
});