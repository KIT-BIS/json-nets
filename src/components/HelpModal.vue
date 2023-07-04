<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card jsn-modal-wide">
      <header class="modal-card-head">
        <p class="modal-card-title">Manual</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <h2>Get started</h2>
          <p>
            <b>Create a place:</b> Click on the button showing a circle, then click on the canvas to
            add a new place.
          </p>
          <p>
            <b>Create a transition:</b> Click on the button showing a square, then click on the
            canvas to add a new transition.
          </p>
          <p>
            <b>Create an arc:</b> Click on the button showing an arc. When you now hover over a
            place or a transition, it will show a small arc icon. Click on the icon and drag a new
            arc towards another place or transition.
          </p>
          <p>You can click on the magic wand button to automagically layout the net.</p>
          <h2>Edit</h2>
          <p>
            Click on the cursor button to go into <b>edit mode</b>. In edit mode, when you hover
            over places, transitions and arcs, they will show several buttons:
          </p>
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <img src="manual.png" width="300" />
            </div>
            <div class="column">
              <p><b>Delete element:</b> Click on the delete button to delete the element.</p>
              <p>
                <b>Edit element:</b> Click on the edit button to change the name, inscription and
                content of elements.
              </p>
              <p>
                <b>Fire transition:</b> Transitions additionally show a fire button. Click on it to
                make the transition fire and consume or create new tokens in the neighbouring
                places. If the transition is not enabled, you will receive an alert.
              </p>
            </div>
          </div>
          <h2>Play</h2>
          <p>
            Click on the play button to go into <b>play mode</b>. In play mode, one transition after
            another will fire automatically, until no transition is enabled any more.
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">Close</button>
      </footer>
    </div>
  </div>
</template>
<script lang="ts">
import { useUiStateStore } from '@/stores/uiState'
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

export default defineComponent({
  computed: {
    ...mapStores(useUiStateStore)
  },
  methods: {
    close() {
      this.uiStateStore.showHelpModal = false
    }
  }
})
</script>
