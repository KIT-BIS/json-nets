<script lang="ts">
import { INSPECTOR_MODE_PLACE, INSPECTOR_MODE_TRANSITION, INSPECTOR_MODE_PRESET_ARC, INSPECTOR_MODE_POSTSET_ARC } from '@/App.vue';
import { useUiStateStore } from '@/stores/uiState';
import * as monaco from 'monaco-editor';
// TODO: proper modularisation
// @ts-ignore
import { findPlace, findTransition, findArc } from '@/components/jsonnets/net.js';
import { defineComponent } from 'vue';
// @ts-ignore
import { registerJsonnet, changeLang } from '@/util/editor';

export default defineComponent({
  setup() {
    const uiState = useUiStateStore();
    let editor = null;
    return { uiState, editor };
  },
  mounted() {
    // TODO: proper monaco integration
    // @ts-ignore
    this.editor = monaco.editor.create(document.getElementById('editor'), {
      // value: '',
      language: 'json',
      roundedSelection: true,
      autoIndent: true,
      automaticLayout: true,
      theme: 'vs-dark',
      features: {
        toggleTabFocusMode: true,
        linesOperations: false,
      },
      minimap: {
        enabled: false,
      },

    });
    //// NOTE: double out-commented probably not needed, was like this in pre-vue version
    //// setTimeout(function() {
    ////   _editor.updateOptions({
    ////     lineNumbers: 'on',
    ////   });
    ////   _editor.getAction('editor.action.formatDocument').run();
    //// }, 2000);
    //_initalized = true;
    registerJsonnet();

    this.uiState.$subscribe((mutation, state) => {
      // @ts-ignore
      if (!(mutation.events.key === "showInspector")) {
        return;
      }
      if (state.inspectorMode === INSPECTOR_MODE_PLACE) {
        //changeLang('json', _editor);
        const place = findPlace(state.lastSelectedID);
        this.uiState.setInspectorContent(JSON.stringify(place.content));
        this.uiState.setItemName(place.name);
      } else if (state.inspectorMode === INSPECTOR_MODE_TRANSITION) {
        //changeLang('jsonnet', _editor);
        const transition = findTransition(state.lastSelectedID);
        this.uiState.setInspectorContent(String(transition.content));
        this.uiState.setItemName(transition.name);
      } else if (state.inspectorMode === INSPECTOR_MODE_PRESET_ARC) {
        //changeLang('json', _editor);
        const arc = findArc(state.lastSelectedID);
        this.uiState.setInspectorContent(JSON.stringify(arc.label));
      } else if (state.inspectorMode === INSPECTOR_MODE_POSTSET_ARC) {
        //changeLang('jsonnet', _editor);
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
      if (toggle) {
        this.uiState.setShowInspector(true);
        // Format current content
        //_editor.getAction('editor.action.formatDocument').run();
      } else {
        this.uiState.setShowInspector(false);
        const console = document.getElementById('console');
        if (console) {
          console.remove();
        }
      }
      //update();
    },
    saveChanges() {
//          const content = _editor.getValue();
//          // _editorLanguage = 'json';
//          if (_inspectorMode === INSPECTOR_MODE_PLACE) {
//          const name = document.getElementById('itemName').value;
//          setPlaceContent(_lastSelectedID, JSON.parse(content), name);
//          updatePlaceContentInExportArray(_lastSelectedID,
//          JSON.parse(content), name);
//          } else if (_inspectorMode === INSPECTOR_MODE_TRANSITION) {
//          const name = document.getElementById('itemName').value;
//          setTransitionContent(_lastSelectedID, content, name);
//          updateTransitionContentInExportArray(_lastSelectedID, content, name);
//          } else if (_inspectorMode === INSPECTOR_MODE_PRESET_ARC) {
//          setArcLabel(_lastSelectedID, JSON.parse(content));
//          updateArcLabelInExportArray(_lastSelectedID, JSON.parse(content));
//          } else if (_inspectorMode === INSPECTOR_MODE_POSTSET_ARC) {
//          setArcLabel(_lastSelectedID, content);
//          updateArcLabelInExportArray(_lastSelectedID, content);
//          }

    }
///**
// * Changes the current value of the editor and applies the json schema
// * if node is of type place
// * @param {Object} model The model to update the editor with.
// */
//function updateEditor(model) {
//  _editor.setValue(model.inspectorContent);
//  if (_inspectorMode === INSPECTOR_MODE_PLACE ||
//    _inspectorMode === INSPECTOR_MODE_TRANSITION) {
//    document.getElementById('itemName').value = model.itemName;
//  }
//}
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
        <div id="itemNameContainer" class="field is-horizontal" :class="{ 'is-hidden': !showName }">
          <div class="field-label is-normal">
            <label class="label">Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input id="itemName" class="input" type="text" placeholder="Name of the element">
              </p>
              <p id="itemNameReturn" class="help is-danger">
              </p>
            </div>
          </div>
        </div>
        <div id="editor" style="min-height: 350px"></div>
      </section>
      <footer class="modal-card-foot">      
        <button class="button is-success" @click="saveChanges"> Save changes</button>
        <button class="button" @click="toggleModal(false)">Cancel</button>
      </footer>
    </div>
  </div>
</template>