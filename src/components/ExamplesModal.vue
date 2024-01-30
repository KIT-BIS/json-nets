<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card jsn-modal-wide">
            <header class="modal-card-head">
                <p class="modal-card-title">Beispiele</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <div class="notification is-info is-light is-size-7">
                        Wählen Sie ein Beispiel-Modell aus, um es in den Editor zu laden.
                    </div>

                    <div>
                        <table class="table is-size-7 is-fullwidth">
                            <thead>
                                <th>Modell</th>
                                <th>Aktionen</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        Kamerahersteller
                                    </td>
                                    <td>
                                        <a @click="() => { importNet('1') }">Laden</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Chip
                                    </td>
                                    <td>
                                        <a @click="() => { importNet('2')}">Laden</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Anschluss
                                    </td>
                                    <td>
                                        <a @click="() => { importNet('3')}">Laden</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Leiterplatte
                                    </td>
                                    <td>
                                        <a @click="() => {importNet('4') }">Laden</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Wafer
                                    </td>
                                    <td>
                                        <a @click="() => {importNet('5') }">Laden</a>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>


                </div>
            </section>
        </div>
    </div>
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { data as kamera_1 } from '@/examples/1_kamera_blank'
import { data as chip_2 } from '@/examples/2_chip_blank'
import { data as anschluss_3 } from '@/examples/3_anschluss_blank'
import { data as leiterplatte_4 } from '@/examples/4_leiterplatte_blank'
import { data as wafer_5 } from '@/examples/5_wafer_blank'
import { useNetStore } from '@/stores/net'

export default defineComponent({
    computed: {
        ...mapStores(useUiStateStore)
    },
    methods: {
        // todo needs refactoring, doubled in App.vue
        importNet(jsonString: string) {
            let json;
            if (jsonString === '1') {
                json = JSON.parse(JSON.stringify(kamera_1))
            } else if (jsonString === '2') {
                json = JSON.parse(JSON.stringify(chip_2))
            } else if (jsonString === '3') {
                json = JSON.parse(JSON.stringify(anschluss_3))
            } else if (jsonString === '4') {
                json = JSON.parse(JSON.stringify(leiterplatte_4))
            } else if (jsonString === '5') {
                json = JSON.parse(JSON.stringify(wafer_5))
            } else {
                json = JSON.parse(jsonString);
            }
            useNetStore().import(json)

            this.close();
        },
        close() {
            this.uiStateStore.showModal = 'none'
        }
    }
})
</script>
