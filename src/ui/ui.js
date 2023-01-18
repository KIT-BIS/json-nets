import {
  addPlace, addTransition, setPlaceContent, setEdgeLabel,
  findPlace, findTransition, findEdge, setTransitionContent} from '../net/net';
import {setClickPosition, toggleDraggable,
  setPanable, getStagePosition} from '../visualization/net';
import {html, render} from 'lit-html';
import {button} from './button';
import * as monaco from 'monaco-editor';
import {addPlacesExportArray,
  addTransitionsExportArray,
  exportNet, updatePlaceContentExportArray,
  updateTransitionContentExportArray,
  updateEdgeLabelExportArray} from '../util/exportNet';
import {importNet, uploadNet} from '../util/importNet';
import {registerJsonnet, changeLang} from '../util/editor';

export const MODE_NONE = 'MODE_NONE';
export const MODE_ADD_PLACE = 'MODE_ADD_PLACE';
export const MODE_ADD_TRANSITION = 'MODE_ADD_TRANSITION';
export const MODE_REMOVE = 'MODE_REMOVE';
export const MODE_MOVE = 'MODE_MOVE';
export const MODE_PAN = 'MODE_PAN';
export const MODE_CONNECT_START = 'MODE_CONNECT_START';
export const MODE_CONNECT_FROM_PLACE = 'MODE_CONNECT_FROM_PLACE';
export const MODE_CONNECT_FROM_TRANSITION = 'MODE_CONNECT_FROM_TRANSITION';
export const MODE_INSPECT = 'MODE_INSPECT';
export const MODE_FIRE = 'MODE_FIRE';

export const INSPECTOR_MODE_TRANSITION = 'INSPECTOR_MODE_TRANSITION';
export const INSPECTOR_MODE_PLACE = 'INSPECTOR_MODE_PLACE';
export const INSPECTOR_MODE_PRESET_EDGE = 'INSPECTOR_MODE_PRESET_EDGE';
export const INSPECTOR_MODE_POSTSET_EDGE = 'INSPECTOR_MODE_POSTSET_EDGE';

let _mode = MODE_NONE;
let _lastSelectedID = null;
let _inspectorMode = '';
let _inspectorContent = '';
let _itemName = '';
let _modalState = '';
let _editor = '';
let _initalized = false;
/**
 * Changes the current value of the editor and applies the json schema
 * if node is of type place
 * @param {Object} model The model to update the editor with.
 */
function updateEditor(model) {
  _editor.setValue(model.inspectorContent);
  if (_inspectorMode === INSPECTOR_MODE_PLACE ||
    _inspectorMode === INSPECTOR_MODE_TRANSITION) {
    document.getElementById('itemName').value = model.itemName;
  }
}

/*
  ${button('file-arrow-up', () => {
    setMode(MODE_NONE);
    importNet();
  })}

 */
const main = (model) => html`
${ (_initalized) ? updateEditor(model): ''}

<div id="container"></div>
<div id="menu">
  ${button('circle', _mode===MODE_ADD_PLACE?'':'is-outlined', () => {
    setMode(MODE_ADD_PLACE);
  })}

  ${button('square', _mode===MODE_ADD_TRANSITION?'':'is-outlined', () => {
    setMode(MODE_ADD_TRANSITION);
  })}
  ${button('arrow-right', _mode===MODE_CONNECT_START ||
  _mode === MODE_CONNECT_FROM_PLACE ||
  _mode === MODE_CONNECT_FROM_TRANSITION ?'':'is-outlined',
() => {
  setMode(MODE_CONNECT_START);
})}
  ${button('trash', _mode === MODE_REMOVE ?'':'is-outlined', () => {
    setMode(MODE_REMOVE);
  })}
  ${button('mouse-pointer', _mode === MODE_MOVE ?'':'is-outlined', () => {
    setMode(MODE_MOVE);
  })}
  ${button('expand-arrows-alt', _mode === MODE_PAN ? '' : 'is-outlined', () => {
    setMode(MODE_PAN);
  })}
  ${button('edit', _mode === MODE_INSPECT ? '' : 'is-outlined', () => {
    setMode(MODE_INSPECT);
  })}
  ${button('play-circle', _mode === MODE_FIRE ? '' : 'is-outlined', () => {
    setMode(MODE_FIRE);
  })}
  ${button('file-arrow-down', 'is-outlined', () => {
    setMode(MODE_NONE);
    exportNet();
  })}
  <input class="button is-primary is-outlined" 
    type="file" name="resume" @change=${(event)=>{
    uploadNet(event);
  }}>
  <button @click=${(event) => {
    importNet();
    event.stopPropagation();
  }} class="button is-primary is-outlined">
  Load Example
  </button>

</div>
<div class="modal ${_modalState}">
  <div class="modal-background"></div>
    <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Inspector</p>
      <button class="delete" aria-label="close" @click=${() => {
    toggleModal(false);
  }}></button>
    </header>
    <section id="modal-card-body" class="modal-card-body">    
    <div id="itemNameContainer" class="field is-horizontal is-hidden">
      <div class="field-label is-normal">
        <label class="label">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input id="itemName" class="input" type="text" 
            placeholder="Name of the element">
          </p>
          <p id="itemNameReturn" class="help is-danger">
          </p>
        </div>
      </div>
    </div>
    <div id="editor" style="min-height: 350px"></div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" @click=${ () => {
    const content = _editor.getValue();
    // _editorLanguage = 'json';
    if (_inspectorMode === INSPECTOR_MODE_PLACE) {
      const name = document.getElementById('itemName').value;
      setPlaceContent(_lastSelectedID, JSON.parse(content), name);
      updatePlaceContentExportArray(_lastSelectedID, JSON.parse(content), name);
    } else if (_inspectorMode === INSPECTOR_MODE_TRANSITION) {
      const name = document.getElementById('itemName').value;
      setTransitionContent(_lastSelectedID, content, name);
      updateTransitionContentExportArray(_lastSelectedID, content, name);
    } else if (_inspectorMode === INSPECTOR_MODE_PRESET_EDGE) {
      setEdgeLabel(_lastSelectedID, JSON.parse(content));
      updateEdgeLabelExportArray(_lastSelectedID, JSON.parse(content));
    } else if (_inspectorMode === INSPECTOR_MODE_POSTSET_EDGE) {
      setEdgeLabel(_lastSelectedID, content);
      updateEdgeLabelExportArray(_lastSelectedID, content);
    }
  }}> Save changes</button >
  <button class="button" @click=${() => {
    toggleModal(false);
  }}>Cancel</button>
  
    </footer >
  </div >
</div >
  `;

/**
 * Toggles Modal visibility
 * @param {Boolean} toggle
 */
function toggleModal(toggle) {
  if (toggle) {
    _modalState = 'is-active';
    // Format current content
    _editor.getAction('editor.action.formatDocument').run();
    const itemNameContainer = document.getElementById('itemNameContainer');
    if (_inspectorMode === INSPECTOR_MODE_PLACE ||
      _inspectorMode === INSPECTOR_MODE_TRANSITION) {
      itemNameContainer.classList.remove('is-hidden');
    } else {
      itemNameContainer.classList.add('is-hidden');
    }
  } else {
    _modalState = '';
    const console = document.getElementById('console');
    if (console) {
      console.remove();
    }
  }
  update();
}


/**
 * Triggers a new render of UI.
 */
function update() {
  render(main({inspectorContent: _inspectorContent,
    itemName: _itemName}), document.body);
}
/**
 * Initialize the UI
 */
export function init() {
  update();
  // Initialize UI
  // TODO: this should be added to template with @click (after restructure)
  document.addEventListener('click', (event) => {
    if (_mode === MODE_ADD_PLACE) {
      const stagePosition = getStagePosition();
      const x = event.clientX - stagePosition.x;
      const y = event.clientY - stagePosition.y;
      setClickPosition(x, y);
      const place = addPlace();
      addPlacesExportArray(x, y, place.id, place.name, place.content);
    } else if (_mode === MODE_ADD_TRANSITION) {
      const stagePosition = getStagePosition();
      const x = event.clientX - stagePosition.x;
      const y = event.clientY - stagePosition.y;
      setClickPosition(x, y);
      const transition = addTransition();
      addTransitionsExportArray(x, y, transition.id, transition.name,
          transition.content);
    }
  });
  _editor = monaco.editor.create(document.getElementById('editor'), {
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
  // setTimeout(function() {
  //   _editor.updateOptions({
  //     lineNumbers: 'on',
  //   });
  //   _editor.getAction('editor.action.formatDocument').run();
  // }, 2000);
  _initalized = true;
  registerJsonnet();
}

/**
 * Specify whether the user currently moves nodes or adds new ones etc...
 * @param {String} mode
 */
export function setMode(mode) {
  if (mode === MODE_MOVE) {
    toggleDraggable(true);
  } else {
    toggleDraggable(false);
  }

  if (mode === MODE_PAN) {
    setPanable(true);
  } else {
    setPanable(false);
  }
  _mode = mode;
  update();
}

/**
 * Returns current UI mode.
 * @return {String}
 */
export function getMode() {
  return _mode;
}

/**
 * Updates the inspector when a new entity is selected.
 * @param {String} entityType
 * @param {String} entityID
 */
export function updateInspector(entityType, entityID) {
  _inspectorMode = entityType;
  _lastSelectedID = entityID;
  if (entityType === INSPECTOR_MODE_PLACE) {
    changeLang('json', _editor);
    const place = findPlace(entityID);
    _inspectorContent = JSON.stringify(place.content);
    _itemName = place.name;
  } else if (entityType === INSPECTOR_MODE_TRANSITION) {
    changeLang('jsonnet', _editor);
    const transition = findTransition(entityID);
    console.log('inspect transition');
    console.log(transition.content);
    console.log(transition.name);
    _inspectorContent = String(transition.content);
    _itemName = transition.name;
  } else if (entityType === INSPECTOR_MODE_PRESET_EDGE) {
    changeLang('json', _editor);
    const edge = findEdge(entityID);
    _inspectorContent = JSON.stringify(edge.label);
  } else if (entityType === INSPECTOR_MODE_POSTSET_EDGE) {
    console.log('update inspector for postset edge');
    changeLang('jsonnet', _editor);
    const edge = findEdge(entityID);
    _inspectorContent = String(edge.label);
  }
  toggleModal(true);
};
