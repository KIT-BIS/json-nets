<template>
    <div class="block">
        <div class="field">
            <label class="label is-small">Knotentyp:</label>
            <div class="select is-small">
            <select @change="setSchema">
                <!-- <option value="scope1" :selected="schemaSelected === 'scope1'">Scope 1 - Emissionen</option> -->
                <!-- <option value="scope2" :selected="schemaSelected === 'scope2'">Scope 2 - Emissionen</option> -->
                <!-- <option value="scope3" :selected="(schemaSelected === 'scope3') || (schemaSelected === 'supply-chain')">Scope 3 - Emissionen</option> -->
                <!-- <option value="product" :selected="isProductData">Produkt</option> -->
                <!-- <option value="start" :selected="schemaSelected === 'start'">Start</option> -->
                <!-- <option value="end" :selected="schemaSelected === 'end'">Ende</option> -->
                <!-- <option value="control" :selected="schemaSelected === 'control'">Kontrollfluss</option> -->
            </select>
            </div>
        </div>
        <hr />
    </div>
    <div class="block" >
        <!-- These explanations could be loaded by convention from a schema field -->
        <!-- <div v-if="!uiStateStore.showSupplyChainData && (schemaSelected === 'scope3')" class="notification is-info is-light is-size-7">
            <a @click="() => { uiStateStore.showSupplyChainData = true; }">Laden Sie Daten</a> aus dem Lieferketten-Verzeichnis oder geben Sie Sekundärdaten ein.
            Für Sekundärdaten wählen Sie zunächst die <b>Maßeinheit</b> (entweder 'Stückzahl' oder 'Gewicht' in mg, g oder kg) für die Angabe der Menge an Material oder Komponenten.
            Der <b>Emissionsfaktor</b> gibt an, welche Menge an Treibhausgasen mit der Produktion
            des Materials oder der Komponente verbunden sind.
            Die Angabe des Emissionsfaktors erfolgt immer <i>pro Stück oder kg</i>.
            Als <b>Maßeinheit für den Emissionsfaktor</b> können Sie 'mg', 'g' oder 'kg' CO2e / Stück oder kg auswählen.
            Über den <b>Skalierungsfaktor</b> können Sie die anzurechnende <b>Menge</b> skalieren.
            Wenn zum Beispiel die Hälfte der angegebenen Menge angerechnet werden soll, geben Sie den <b>Skalierungsfaktor</b> '0,5' an.
        </div>
        <div v-if="!uiStateStore.showSupplyChainData && (schemaSelected === 'supply-chain')" class="notification is-info is-light is-size-7">
            Sie haben Daten aus dem Lieferketten-Verzeichnis geladen. <a @click="clearSupplyChainData">Lieferketten-Daten entfernen</a>, um das Formular zurückzusetzen.
            Im Formular können Sie den von ihrem Lieferanten übermittelten <b>Emissionsfaktor</b> und <b>Primärdatenanteil</b> einsehen.
            Es wird angenommen, dass die Angaben zu Treibhausgasemission von Ihrem Lieferanten in <i>kg CO2e pro Stück</i> erfolgen.
            Sie können eine <b>Mengenangabe</b> als Stückzahl vornehmen und die angegebene Menge über einen <b>Skalierungsfaktor</b> skalieren.
            Wenn zum Beispiel die Hälfte der angegebenen Menge angerechnet werden soll, geben Sie den <b>Skalierungsfaktor</b> '0,5' an.
        </div>
        <div v-if="schemaSelected === 'scope1'" class="notification is-info is-light is-size-7">
            Wählen Sie zunächst das betreffende <b>Treibhausgas</b> im Formular aus.
            Als <b>Maßeinheit</b> können Sie 'mg', 'g' oder 'kg' wählen.
            Über den <b>Skalierungsfaktor</b> können Sie die anzurechnende <b>Menge</b> skalieren.
            Wenn zum Beispiel die Hälfte der angegebenen Menge angerechnet werden soll, geben Sie den <b>Skalierungsfaktor</b> '0,5' an.
        </div>
        <div v-if="schemaSelected === 'scope2'" class="notification is-info is-light is-size-7">
            Wählen Sie zunächst eine <b>Maßeinheit</b> ('Wh' oder 'kWh') für den angegebenen <b>Energieverbrauch</b>.
            Der <b>Emissionsfaktor</b> gibt an, welche Menge an Treibhausgasen <i>pro kWh</i> mit der Erzeugung der
            bezogenen Energie verbunden sind.
            Als <b>Maßeinheit für den Emissionsfaktor</b> können Sie 'mg', 'g' oder 'kg' CO2e / kWh auswählen.
            Über den <b>Skalierungsfaktor</b> können Sie den anzurechnenden Energieverbrauch skalieren.
            Wenn zum Beispiel die Hälfte der angegebenen Menge angerechnet werden soll, geben Sie den <b>Skalierungsfaktor</b> '0,5' an.
        </div>
        <div v-if="schemaSelected === 'start'" class="notification is-info is-light is-size-7">
            Um Berechnungen durchführen zu können, muss das Prozessmodell am Anfang genau einen Knoten
            vom Typ 'Start' haben.
        </div>
        <div v-if="schemaSelected === 'end'" class="notification is-info is-light is-size-7">
            Das Prozessmodell sollte am Ende einen Knoten vom Typ 'Ende' haben. 
            Wenn eine Berechung abgeschlossen wurde, und Daten im Knoten vorhanden sind,
            können Sie die Daten veröffentlichen und so in das Lieferketten-Verzeichnis laden.
        </div>
        <div v-if="schemaSelected === 'control'" class="notification is-info is-light is-size-7">
            Um Berechnungen durchführen zu können, müssen Aktivitäten miteinander mit Knoten 
            vom Typ 'Kontrollfluss' verbunden werden.
        </div>
 -->

    </div>

</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    methods: {
        setSchema(event: Event)  {
            //@ts-ignore
            const schema = event.target.value;
            let schemaString = '';
            let markingString = '';
            if (schema === "scope1") {
                // schemaString = JSON.stringify(scope1Schema)
                // markingString = JSON.stringify(scope1Marking)
            } else if (schema === "scope2") {
                // schemaString = JSON.stringify(scope2Schema)
                // markingString = JSON.stringify(scope2Marking)

            } else if (schema === "scope3") {
                // schemaString = JSON.stringify(scope3Schema)
                // markingString = JSON.stringify(scope3Marking)
            // } else if (schema === "product") {
                // schemaString = JSON.stringify(productSchema);
                // markingString = JSON.stringify(productMarking);
            } else if (schema === "start") {
                // schemaString = JSON.stringify(startSchema);
                // markingString = JSON.stringify(startMarking);
            } else if (schema === "end") {
                // schemaString = JSON.stringify(endSchema);
                // markingString = JSON.stringify(endMarking);
            } else if (schema === "control") {
                // schemaString = JSON.stringify(controlSchema);
                // markingString = JSON.stringify(controlMarking);

            }

            // this.placesStore.schemaString = schemaString;
            // this.placesStore.savePlaceSchema(schemaString);

            // this.placesStore.savePlaceMarkingFromEditor(markingString);
        },

    }
})
</script>