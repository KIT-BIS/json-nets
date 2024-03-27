<template>
    <!-- It is assumed that loaded entries have a name field -->
    <div v-if="data">
        <table class="table is-size-7 is-fullwidth">
            <thead>
                <th>Eintrag</th>
                <th>Aktionen</th>
            </thead>
            <tbody>
                <tr v-for="element in data.data">
                    <td>
                        {{ //@ts-ignore
        element.name }}
                    </td>
                    <td>
                        <a @click="//@ts-ignore
        setPlaceData(element)">Laden</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />
    </div>

</template>
<script lang="ts">
import { usePlacesStore } from '@/stores/place';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import type { JSONMarking } from '@/util/jsonOperations';
import { useConfigStore } from '@/stores/config';

export default defineComponent({
    data() {
        return {
            data: { data: null }
        }
    },
    computed: {
        ...mapStores(usePlacesStore),
        ...mapStores(useConfigStore)
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            const externalInteractionSettings = this.configStore.getPlaceTypeById(this.placesStore.placeType)?.externalInteraction
            if (!externalInteractionSettings || externalInteractionSettings.type === 'none') return;
            // const databaseID = this.placesStore.databaseMap[this.placesStore.place.id];


            const response = await fetch(externalInteractionSettings.url)
            this.data = await response.json();
        },
        setPlaceData(data: { name: string, marking: JSONMarking }) {
            this.placesStore.place.name = data.name;
            this.placesStore.saveName();

            const externalInteractionSettings = this.configStore.getPlaceTypeById(this.placesStore.placeType)?.externalInteraction
            if (!externalInteractionSettings || externalInteractionSettings.type !== 'pull') return;

            const marking = data.marking;
            marking[0] = { ...data.marking[0],  ...externalInteractionSettings.enforcedMarking}

            // const marking = { ...data.marking, ...externalInteractionSettings.enforcedMarking}
            this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));
            //@ts-ignore
            // marking[0].scope = 3;
            // marking[0].title = 'scope3';
            // marking[0].scalingFactor = 1;
            //@ts-ignore
            // marking[0].fromSupplyChain = true;
            // console.log(marking);
        }

    }
})
</script>