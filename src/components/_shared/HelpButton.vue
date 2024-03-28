<template>
	<div class="dropdown is-hoverable is-left">
		<div class="dropdown-trigger">
			<span class="icon is-small is-clickable">
				<font-awesome-icon icon="fas fa-info-circle" />
			</span>
		</div>
		<div class="dropdown-menu">
			<div class="dropdown-content">
				<div class="dropdown-item">
					<p class="is-size-7 has-text-weight-normal" v-html="helpText"></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

/**
	* A small reusable component to show helpful text when user hovers over it with mouse.
	*/
export default defineComponent({
	props: {
		helpText: String
	}
})
</script>