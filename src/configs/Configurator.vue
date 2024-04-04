<template>
    <div class="container is-grouped is-horizontal">
        <h1 class="title">Configuration Form</h1>
        <form @submit.prevent="handleSubmit" class="form">
            <div class="field is-horizontal">
                <label class="label" for="name">Name:</label>
                <div class="control">
                    <input id="name" v-model="formData.name" type="text" class="input" required />
                </div>
            </div>

            <div class="field is-horizontal">
                <label class="label" for="defaultUIAssistMode">Default UI Assist Mode:</label>
                <div class="control">
                    <div class="select">
                        <select id="defaultUIAssistMode" v-model="formData.defaultUIAssistMode" required>
                            <option value="expert">Expert</option>
                            <option value="assisted">Assisted</option>
                        </select>
                    </div>
                </div>
            </div>


            <div class="field is-horizontal">
                <label class="label" for="defaultTransitionType">Default Transition Type:</label>
                <div class="control">
                    <input id="defaultTransitionType" v-model="formData.defaultTransitionType" type="text" class="input"
                        required />
                </div>
            </div>

            <div class="field is-horizontal">
                <label class="label" for="defaultPlaceType">Default Place Type:</label>
                <div class="control">
                    <input id="defaultPlaceType" v-model="formData.defaultPlaceType" type="text" class="input"
                        required />
                </div>
            </div>

            <div class="field is-horizontal">
                <label class="checkbox" for="allowAutoLayout">
                    <input id="allowAutoLayout" v-model="formData.allowAutoLayout" type="checkbox" />
                    Allow Auto Layout
                </label>
            </div>

            <div class="field is-horizontal">
                <label class="checkbox" for="visualisationConfig">
                    <input id="visualisationConfig" v-model="formData.visualisationConfig" type="checkbox" />
                    Visualisation Tab
                </label>
            </div>
            <!-- <div class="field is-horizontal">
          <label class="label" for="visualisationConfig">Visualisation Config:</label>
          <div class="control">
            <div class="select">
              <select id="visualisationConfig" v-model="formData.visualisationConfig" required>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
        </div> -->

            <div class="field is-horizontal">
                <label class="label" for="examples">Examples:</label>
                <div class="control">
                    <input id="examples" type="file" @change="handleFileUpload" multiple class="input" />
                </div>
            </div>

            <div class="field is-horizontal" v-if="formData.examples.length > 0">
                <label class="label">Uploaded Examples: </label>
                <div class="control">
                    <ul>
                        <li v-for="(example, index) in formData.examples" :key="index">
                            {{ example.name }}
                            <button class="delete" @click="deleteExample(index)">Delete</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button type="submit" class="button is-primary">Download Konfiguration</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">

/**
    Configuration form for downloading custom editor settings with JSONnet examples upload capability
*/
import { defineComponent, ref } from 'vue';
import { readFile, download } from '@/util/files';

interface Example {
    name: string;
    net: any;
}

interface FormData {
    name: string;
    defaultUIAssistMode: 'expert' | 'assisted';
    defaultTransitionType: string;
    defaultPlaceType: string;
    allowAutoLayout: boolean;
    visualisationConfig: boolean | {};
    examples: Example[];
}

export default defineComponent({
    name: 'ConfiguratorForm',
    setup() {
        const formData = ref<FormData>({
            name: '',
            defaultUIAssistMode: 'expert',
            defaultTransitionType: 'default',
            defaultPlaceType: 'default',
            allowAutoLayout: false,
            visualisationConfig: false,
            examples: []
        });

        function generateJson() {
            return JSON.stringify({
                ...formData.value,
                defaultPlaceType: formData.value.defaultPlaceType !== '' ? formData.value.defaultPlaceType : 'default',
                transitionTypes: [],
                placeTypes: [],
            }, null, 2);
        }

        function handleSubmit() {
            const jsonConfig = generateJson();
            download(jsonConfig, `${formData.value.name || 'config'}.json`, 'application/json');
        }

        function handleFileUpload(event: Event) {
            const input = event.target as HTMLInputElement;
            if (!input.files) return;

            Array.from(input.files).forEach(file => {
                readFile({ target: { files: [file] } } as unknown as Event, (content: string) => {
                    try {
                        const jsonContent = JSON.parse(content);
                        formData.value.examples.push({
                            name: file.name,
                            net: jsonContent
                        });
                    } catch (error) {
                        alert(`Error parsing JSON in file ${file.name}: ${error}`);
                    }
                });
            });
        }

        function deleteExample(index: number) {
            formData.value.examples.splice(index, 1);
        }

        return { formData, handleSubmit, handleFileUpload, deleteExample };
    },
});
</script>