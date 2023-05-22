<script lang="ts">
import { INSPECTOR_MODE_PLACE, INSPECTOR_MODE_TRANSITION, INSPECTOR_MODE_PRESET_ARC, INSPECTOR_MODE_POSTSET_ARC } from '@/App.vue';
import { useUiStateStore } from '@/stores/uiState';
// TODO: proper modularisation
// @ts-ignore
import { findPlace, findTransition, findArc, setPlaceContent, setTransitionContent, setArcLabel } from '@/components/jsonnets/net.js';
import { defineComponent } from 'vue';
// TODO: proper modularisation
//@ts-ignore
import { updateArcLabelInExportArray, updateTransitionContentInExportArray, updatePlaceContentInExportArray } from '@/util/exportNet.js'
// @ts-ignore

export default defineComponent({
  setup() {
    const uiState = useUiStateStore();
    let editor = null;
    return { uiState, editor };
  },
  mounted() {

    this.uiState.$subscribe((mutation, state) => {
      // @ts-ignore
      if (!(mutation.events.key === "showInspector")) {
        return;
      }
      if (state.inspectorMode === INSPECTOR_MODE_PLACE) {
        const place = findPlace(state.lastSelectedID);
        this.uiState.setInspectorContent(JSON.stringify(place.content));
        this.uiState.setItemName(place.name);
      } else if (state.inspectorMode === INSPECTOR_MODE_TRANSITION) {
        const transition = findTransition(state.lastSelectedID);
        this.uiState.setInspectorContent(String(transition.content));
        this.uiState.setItemName(transition.name);
      } else if (state.inspectorMode === INSPECTOR_MODE_PRESET_ARC) {
        const arc = findArc(state.lastSelectedID);
        this.uiState.setInspectorContent(JSON.stringify(arc.label));
      } else if (state.inspectorMode === INSPECTOR_MODE_POSTSET_ARC) {
        const arc = findArc(state.lastSelectedID);
        this.uiState.setInspectorContent(String(arc.label));
      }

    });
  },
  computed: {
    showName(): boolean {
        if (this.uiState.inspectorMode === INSPECTOR_MODE_PLACE ||
          this.uiState.inspectorMode === INSPECTOR_MODE_TRANSITION) {
            return true;
        } else {
          return false;
        }
    }
  },
  methods: {
    toggleModal(toggle: boolean) {
      this.uiState.setNameError("");
      this.uiState.setValidationError("");
      if (toggle) {
        this.uiState.setShowInspector(true);
      } else {
        this.uiState.setShowInspector(false);
      }
    },
    saveChanges() {
      this.uiState.setNameError("");
      this.uiState.setValidationError("");

      if (this.uiState.inspectorMode === INSPECTOR_MODE_PLACE) {
        // @ts-ignore
        setPlaceContent(this.uiState.lastSelectedID, JSON.parse(this.uiState.inspectorContent), this.uiState.itemName);
        updatePlaceContentInExportArray(this.uiState.lastSelectedID,
          this.uiState.inspectorContent, this.uiState.itemName);
      } else if (this.uiState.inspectorMode === INSPECTOR_MODE_TRANSITION) {
        setTransitionContent(this.uiState.lastSelectedID, this.uiState.inspectorContent, this.uiState.itemName);
        updateTransitionContentInExportArray(this.uiState.lastSelectedID, this.uiState.inspectorContent, this.uiState.itemName);
      } else if (this.uiState.inspectorMode === INSPECTOR_MODE_PRESET_ARC) {
        // @ts-ignore
        setArcLabel(this.uiState.lastSelectedID, JSON.parse(this.uiState.inspectorContent));
        // @ts-ignore
        updateArcLabelInExportArray(this.uiState.lastSelectedID, JSON.parse(this.uiState.inspectorContent));
      } else if (this.uiState.inspectorMode === INSPECTOR_MODE_POSTSET_ARC) {
        setArcLabel(this.uiState.lastSelectedID, this.uiState.inspectorContent);
        updateArcLabelInExportArray(this.uiState.lastSelectedID, this.uiState.inspectorContent);
      }
      if (this.uiState.nameError === "" && this.uiState.validationError === "") {
        this.toggleModal(false);
      }
    }
  }
})

/**
 * Updates the inspector when a new entity is selected.
 * @param {String} entityType
 * @param {String} entityID
 */
//export function updateInspector(entityType: string, entityID) {
export function updateInspector(entityType: string) {
  useUiStateStore().inspectorMode = entityType;
};
</script>
<template>
  <div class="modal" :class="{ 'is-active': uiState.showInspector }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Inspector</p>

        <button class="delete" aria-label="close" @click="toggleModal(false)"></button>
      </header>
      <section id="modal-card-body" class="modal-card-body">
        <div id="itemNameContainer" class="field" :class="{ 'is-hidden': !showName }">
          <label class="label">Name</label>
          <div class="control">
            <input id="itemName" class="input" type="text" placeholder="Name of the element" v-model="uiState.itemName" >
          </div>
          <p class="help is-danger">{{ uiState.nameError }}
          </p>
        </div>
        <div class="field" >
          <label class="label">Inscription</label>
          <div class="control">
            <textarea id="editor" class="editor textarea has-fixed-size" v-model="uiState.inspectorContent"></textarea>
          </div>
          <p class="help is-danger">{{ uiState.validationError }}
          </p>
        </div>
        <!--<div>
          <textarea id="console" class="console textarea has-fixed-size" v-model="uiState.validationError"  readonly>
          </textarea>
        </div>-->
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="saveChanges">Save changes</button>
        <button class="button" @click="toggleModal(false)">Cancel</button>
      </footer>
    </div>
  </div>
</template>