<template>
    <div class="block">
        <div class="field">
            <label class="label is-small">Knotentyp:</label>
            <div class="select is-small">
            <select @change="setPlaceType">
                <option value="custom" :selected="'custom' === netStore.placeTypes[placesStore.place.id]">Individuell</option>
                <option v-for="placeType in configStore.placeTypes" :value="placeType.id" :selected="placeType.id === netStore.placeTypes[placesStore.place.id]">{{ placeType.schema.title }}</option>
            </select>
            </div>
        </div>
    </div>
    <div class="block" >
        <div v-if="'custom' === netStore.placeTypes[placesStore.place.id]" class="notification is-info is-light is-size-7">
            Sie können Schema und Markierung anpassen.
        </div>
        <div v-else class="notification is-info is-light is-size-7" v-html="configStore.getPlaceTypeById(netStore.placeTypes[placesStore.place.id])?.schema.description">
        </div>

        <!-- Todo: Check whether data removal functionality is needed for pull type places. -->
        <!--
            Sie haben Daten aus dem Lieferketten-Verzeichnis geladen. <a @click="clearSupplyChainData">Lieferketten-Daten entfernen</a>, um das Formular zurückzusetzen.
        -->

    </div>

    <hr />
</template>
<script lang="ts">
import { useConfigStore } from '@/stores/config';
import { useNetStore } from '@/stores/net';
import { usePlacesStore } from '@/stores/place';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

/**
 * Allows users to select predefined markings and schemas (if available in current configuration).
 */
export default defineComponent({
    computed: {
        ...mapStores(useConfigStore),
        ...mapStores(usePlacesStore),
        ...mapStores(useNetStore)
    },

    methods: {
        setPlaceType(event: Event)  {
            const placeTypeId = (event.target as HTMLInputElement).value
            this.netStore.placeTypes[this.placesStore.place.id] = placeTypeId

            // keep current marking and schema if place type is set to custom
            if (placeTypeId === 'custom') return;

            const placeType = this.configStore.getPlaceTypeById(placeTypeId);
            const schemaString = JSON.stringify(placeType?.schema, null, 2);
            const markingString = JSON.stringify(placeType?.marking, null, 2);

            this.placesStore.schemaString = schemaString;
            this.placesStore.savePlaceSchema(schemaString);
            this.placesStore.savePlaceMarkingFromEditor(markingString);

        },

    }
})
</script>