<template>
  <!--
  <div class="modal ${_modalState}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Inspector</p>
        <button class="delete" aria-label="close" @click=${ () => {
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
        <button class="button is-success" @click=${  ()=> {
          const content = _editor.getValue();
          // _editorLanguage = 'json';
          if (_inspectorMode === INSPECTOR_MODE_PLACE) {
          const name = document.getElementById('itemName').value;
          setPlaceContent(_lastSelectedID, JSON.parse(content), name);
          updatePlaceContentInExportArray(_lastSelectedID,
          JSON.parse(content), name);
          } else if (_inspectorMode === INSPECTOR_MODE_TRANSITION) {
          const name = document.getElementById('itemName').value;
          setTransitionContent(_lastSelectedID, content, name);
          updateTransitionContentInExportArray(_lastSelectedID, content, name);
          } else if (_inspectorMode === INSPECTOR_MODE_PRESET_ARC) {
          setArcLabel(_lastSelectedID, JSON.parse(content));
          updateArcLabelInExportArray(_lastSelectedID, JSON.parse(content));
          } else if (_inspectorMode === INSPECTOR_MODE_POSTSET_ARC) {
          setArcLabel(_lastSelectedID, content);
          updateArcLabelInExportArray(_lastSelectedID, content);
          }
          }}> Save changes</button>
        <button class="button" @click=${ () => {
          toggleModal(false);
          }}>Cancel</button>

      </footer>
    </div>
  </div>
-->

</template>