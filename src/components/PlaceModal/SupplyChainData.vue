<template>

                <!-- <pre v-if="data">{{ data }}</pre> -->
                <div class="notification is-info is-light is-size-7">
                    Komponente zum Laden aus dem Lieferketten-Verzeichnis auswählen oder 
                    <a @click="() => uiStateStore.showSupplyChainData = false">Abbrechen</a>.
                </div>

                <div v-if="data">
                    <table class="table is-size-7 is-fullwidth">
                        <thead>
                            <th>Komponente</th>
                            <th>Aktionen</th>
                        </thead>
                        <tbody>
                            <tr v-for="element in data.data">
                                <td>
                                    {{  //@ts-ignore
                                        element.name }}
                                </td>
                                <td>
                                    <a @click="//@ts-ignore
                                        setPlaceData(element)">Laden</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            <!-- <footer v-if="isScope3" class="modal-card-foot"></footer> -->
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState';
import { usePlacesStore } from '@/stores/place';
import { mapStores } from 'pinia';
import { defineComponent, toRaw } from 'vue';
import { supplyChainSchema } from '@/examples/scope3transparent';
import type { JSONMarking } from '@/util/jsonOperations';

export default defineComponent({
    setup(props) {
    },
    data() {
        return {
            data: { data: null }
        }
    },
    computed: {
        ...mapStores(useUiStateStore),
        ...mapStores(usePlacesStore)
    },
    created() {
        this.load();
    },
    watch: {
    },
    methods: {
        close() {
            // this.uiStateStore. = false;
        },
        async load() {
            // const response = await fetch('http://localhost:3030/footprints')
            const response = await fetch('https://s3t.uber.space/footprints')
            this.data = await response.json();
            // .then(response => response.json())
            // .then(data => { console.log(data); this.uiStateStore.databaseID = data._id; })
        },
        setPlaceData(data: { name: string, marking: JSONMarking }) {
            this.placesStore.place.name = data.name;
            this.placesStore.saveName();
            this.placesStore.schemaString = JSON.stringify(supplyChainSchema);
            this.placesStore.savePlaceSchema(JSON.stringify(supplyChainSchema));
            // this.$forceUpdate();
            // this.placesStore.place.schema = JSON.parse(JSON.stringify(primarySchema));
            
            const marking = data.marking;
            //@ts-ignore
            marking[0].scope = 3;
            marking[0].title = 'scope3';
            //@ts-ignore
            marking[0].fromSupplyChain = true;
            console.log(marking);
            this.placesStore.savePlaceMarkingFromEditor(JSON.stringify(marking));

            this.uiStateStore.showSupplyChainData = false;
        }

    }
})
</script>
<style scoped>
.scoped-modal-footer {
    border-top: none;
}

.scoped-modal-header {
    border-bottom: none;
}

.scoped-edit-button {
    display: none;
}

.scoped-modal-title:hover>.scoped-edit-button,
.scoped-edit-button:hover {
    display: inline-block;
}
</style>