import {
  step, addPlace, addTransition, setPlaceContent, setEdgeLabel,
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

export const INSPECTOR_MODE_TRANSITION = 'INSPECTOR_MODE_TRANSITION';
export const INSPECTOR_MODE_PLACE = 'INSPECTOR_MODE_PLACE';
export const INSPECTOR_MODE_EDGE = 'INSPECTOR_MODE_EDGE';

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
  if (_inspectorMode === INSPECTOR_MODE_PLACE) {
    document.getElementById('itemName').value = model.itemName;
  }
}
const main = (model) => html`
${ (_initalized) ? updateEditor(model): ''}

<div id="container"></div>
<div id="menu">
  ${button('circle', () => {
    setMode(MODE_ADD_PLACE);
  })}
  ${button('square', () => {
    setMode(MODE_ADD_TRANSITION);
  })}
  ${button('arrow-right', () => {
    setMode(MODE_CONNECT_START);
  })}
  ${button('trash', () => {
    setMode(MODE_REMOVE);
  })}
  ${button('mouse-pointer', () => {
    setMode(MODE_MOVE);
  })}
  ${button('expand-arrows-alt', () => {
    setMode(MODE_PAN);
  })}
  ${button('edit', () => {
    setMode(MODE_INSPECT);
  })}
  ${button('play-circle', () => {
    setMode(MODE_NONE);
    step();
  })}
  ${button('file-arrow-down', () => {
    setMode(MODE_NONE);
    exportNet();
  })}
  ${button('file-arrow-up', () => {
    setMode(MODE_NONE);
    importNet();
  })}
 
  <div class="file">
  <label class="file-label">
    <input class="file-input" type="file" name="resume" @change=${(event)=>{
    uploadNet(event);
  }}>
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label">
        Choose a file…
      </span>
    </span>
  </label>
</div>
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
            placeholder="Name of the place">
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
    if (_inspectorMode === INSPECTOR_MODE_PLACE) {
      const name = document.getElementById('itemName').value.toLowerCase();
      setPlaceContent(_lastSelectedID, JSON.parse(content), name);
      updatePlaceContentExportArray(_lastSelectedID, JSON.parse(content));
    } else if (_inspectorMode === INSPECTOR_MODE_TRANSITION) {
      setTransitionContent(_lastSelectedID, content);
      updateTransitionContentExportArray(_lastSelectedID, content);
    } else if (_inspectorMode === INSPECTOR_MODE_EDGE) {
      setEdgeLabel(_lastSelectedID, JSON.parse(content));
      updateEdgeLabelExportArray(_lastSelectedID, JSON.parse(content));
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
    if (_inspectorMode === INSPECTOR_MODE_PLACE) {
      itemNameContainer.classList.remove('is-hidden');
    } else {
      itemNameContainer.classList.add('is-hidden');
    }
  } else {
    _modalState = '';
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
      addPlacesExportArray(x, y, place.data, place.id);
    } else if (_mode === MODE_ADD_TRANSITION) {
      const stagePosition = getStagePosition();
      const x = event.clientX - stagePosition.x;
      const y = event.clientY - stagePosition.y;
      setClickPosition(x, y);
      const transition = addTransition();
      addTransitionsExportArray(x, y, transition.id);
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
    changeLang('json');
    const place = findPlace(entityID);
    _inspectorContent = JSON.stringify(place.content);
    _itemName = place.name;
  } else if (entityType === INSPECTOR_MODE_TRANSITION) {
    changeLang('jsonnet');
    const transition = findTransition(entityID);
    console.log(transition.content);
    _inspectorContent = String(transition.content);
  } else if (entityType === INSPECTOR_MODE_EDGE) {
    changeLang('json');
    const edge = findEdge(entityID);
    _inspectorContent = JSON.stringify(edge.label);
  }
  toggleModal(true);
};
/**
 * Registers a new language for Monaco Editor
 */
function registerJsonnet() {
  monaco.languages.register({id: 'jsonnet'});
  monaco.languages.setMonarchTokensProvider('jsonnet', {
    keywords: [
      'local',
      'self',
      'super',
      'assert',
      'function',
      'if',
      'then',
      'else',
      'for',
      'in',
      'tailstrict',
      'error',
      'true',
      'false',
      'null',
    ],
    operators: [
      '_', ':', '=', '=>', '<-', '<:', '<%', '>:', '#', '@',

      // Copied from java.ts, to be validated
      '=', '>', '<', '!', '~', '?', ':',
      '==', '<=', '>=', '!=', '&&', '||', '++', '--',
      '+', '-', '*', '/', '&', '|', '^', '%', '<<',
      '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
      '^=', '%=', '<<=', '>>=', '>>>=', '|||',
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
    // The main tokenizer for our languages
    tokenizer: {
      root: [

        // TS/Scala-style type annotations
        [/\: *[\w$ \[\]\&\|]*/, 'type.identifier'],

        // identifiers and keywords
        [/[a-zA-Z_$][\w$]*/, {
          cases: {
            '@keywords': {token: 'keyword.$0'},
            '@default': 'identifier',
          },
        }],

        // whitespace
        {include: '@whitespace'},

        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        }],

        // @ annotations.
        [/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
        [/0(@octaldigits)[Ll]?/, 'number.octal'],
        [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
        [/(@digits)[fFdD]/, 'number.float'],
        [/(@digits)[lL]?/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string'],

        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@scaladoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
        // [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
	  [/#/, 'comment'],
      ],
      // Identical copy of comment above, except for the addition of .doc
      scaladoc: [
        [/[^\/*]+/, 'comment.doc'],
        // [/\/\*/, 'comment.doc', '@push' ],    // nested comment not allowed :-(
        [/\/\*/, 'comment.doc.invalid'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc'],
	  [/#/, 'comment.doc'],

      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ]},
  });
}
/**
 * Change the language of the editor
 * @param {*} lang
 */
export function changeLang(lang) {
  monaco.editor.setModelLanguage(_editor.getModel(), lang);
}
