import {
  step, addPlace, addTransition, setPlaceContent, setEdgeLabel,
  findPlace, findTransition, findEdge} from '../net/net';
import {setClickPosition, toggleDraggable,
  setPanable, getStagePosition} from '../visualization/net';
import {html, render} from 'lit-html';
import {button} from './button';

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
let _modalState = '';

const main = (model) => html`
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
    <section class="modal-card-body">
    <textarea class="textarea" 
    rows="10" id="node-content" .value="${model.inspectorContent}"></textarea>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" @click=${ () => {
    const content = document.getElementById('node-content').value;
    if (_inspectorMode === INSPECTOR_MODE_PLACE) {
      setPlaceContent(_lastSelectedID, JSON.parse(content));
    } else if (_inspectorMode === INSPECTOR_MODE_TRANSITION) {
      // NOP
    } else if (_inspectorMode === INSPECTOR_MODE_EDGE) {
      setEdgeLabel(_lastSelectedID, JSON.parse(content));
    }
    toggleModal(false);
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
  } else {
    _modalState = '';
  }
  update();
}

/**
 * Triggers a new render of UI.
 */
function update() {
  render(main({inspectorContent: _inspectorContent}), document.body);
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
      addPlace();
    } else if (_mode === MODE_ADD_TRANSITION) {
      const stagePosition = getStagePosition();
      const x = event.clientX - stagePosition.x;
      const y = event.clientY - stagePosition.y;
      setClickPosition(x, y);
      addTransition();
    }
  });
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
    const place = findPlace(entityID);
    _inspectorContent = JSON.stringify(place.content);
  } else if (entityType === INSPECTOR_MODE_TRANSITION) {
    const transition = findTransition(entityID);
    _inspectorContent = JSON.stringify(transition.state);
  } else if (entityType === INSPECTOR_MODE_EDGE) {
    const edge = findEdge(entityID);
    _inspectorContent = JSON.stringify(edge.label);
  }
  toggleModal(true);
};

