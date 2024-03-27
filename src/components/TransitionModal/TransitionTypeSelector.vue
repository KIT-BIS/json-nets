<template>
    <div class="block">
        <div class="field">
            <label class="label is-small">Knotentyp:</label>
            <div class="select is-small">
            <select @change="setTransitionType">
                <option value="custom" :selected="'custom' === netStore.transitionTypes[transitionsStore.transition.id]">Individuell</option>
                <option v-for="transitionType in configStore.transitionTypes" :value="transitionType.id" :selected="transitionType.id === netStore.transitionTypes[transitionsStore.transition.id]">{{ transitionType.title }}</option>
            </select>
            </div>
        </div>
    </div>
    <div class="block" >
        <div v-if="'custom' === netStore.transitionTypes[transitionsStore.transition.id]" class="notification is-info is-light is-size-7">
            Sie können die Transitionsinschrift anpassen.
        </div>
        <div v-else class="notification is-info is-light is-size-7" v-html="configStore.getTransitionTypeById(netStore.transitionTypes[transitionsStore.transition.id])?.description">
        </div>

    </div>

    <hr />
</template>
<script lang="ts">
import { useConfigStore } from '@/stores/config';
import { useNetStore } from '@/stores/net';
import { useTransitionsStore } from '@/stores/transition';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
    computed: {
        ...mapStores(useConfigStore),
        ...mapStores(useTransitionsStore),
        ...mapStores(useNetStore)
    },

    methods: {
        setTransitionType(event: Event)  {
            const transitionTypeId = (event.target as HTMLInputElement).value

            if (transitionTypeId === 'custom') {
                // unset custom variables
                // Todo: generally rethink use of custom variables, develop proper concept
                const oldTypeId = this.netStore.transitionTypes[this.transitionsStore.transition.id]
                const oldTransitionType = this.configStore.getTransitionTypeById(oldTypeId);

                if (oldTransitionType) {
                    const customVarNames = Object.keys(oldTransitionType.customVariables);
                    for (let i = 0; i < customVarNames.length; i++) {
                        this.transitionsStore.removeVariable(customVarNames[i]);
                    }
                }
            };

            this.netStore.transitionTypes[this.transitionsStore.transition.id] = transitionTypeId
            const transitionType = this.configStore.getTransitionTypeById(transitionTypeId);
            if (!transitionType) return;

            // this.transitionsStore.transitionType = transitionTypeId;

            this.transitionsStore.transition.preface = transitionType.preface;
            this.transitionsStore.transition.guard = transitionType.guard;
            this.transitionsStore.saveBasicInscription();

            for (let i = 0; i < this.transitionsStore.outputArcs.length; i++) {
                // todo: this may not be compatible with current backend behavior
                this.transitionsStore.selectedOutputSnippetIndex = i;
                let currentValueSnippet = this.transitionsStore.outputArcs[i].valueSnippet;
                let currentKeySnippet = this.transitionsStore.outputArcs[i].keySnippet;

                let newValueSnippet = currentValueSnippet.substring(0, currentValueSnippet.indexOf('=') + 2) + transitionType.valueSnippet;
                let newKeySnippet = currentKeySnippet.substring(0, currentKeySnippet.indexOf('=') + 2) + transitionType.keySnippet;

                this.transitionsStore.outputArcs[i].valueSnippet = newValueSnippet;
                this.transitionsStore.outputArcs[i].keySnippet = newKeySnippet;
                this.transitionsStore.saveOutputSnippets()

                this.transitionsStore.selectedOutputPlaceIndex = i;
                this.transitionsStore.outputArcs[i].filter = transitionType.postsetFilter;
                this.transitionsStore.saveOutputFilter();
            }

            for (let i = 0; i < this.transitionsStore.inputArcs.length; i++) { 
                this.transitionsStore.selectedInputPlaceIndex = i;
                this.transitionsStore.inputArcs[i].filter = transitionType.presetFilter;
                this.transitionsStore.saveInputFilter();
            }

            this.transitionsStore.selectedInputPlaceIndex = 0;
            this.transitionsStore.selectedOutputPlaceIndex = 0;
            this.transitionsStore.selectedOutputSnippetIndex = 0;

            const customVarNames = Object.keys(transitionType.customVariables);
            for (let i = 0; i < customVarNames.length; i++) {
                this.transitionsStore.updateVariable(customVarNames[i], transitionType.customVariables[customVarNames[i]]);
            }

        },

    }
})

</script>