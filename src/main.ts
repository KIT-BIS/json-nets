import './assets/style.scss'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueCodemirror from 'vue-codemirror'
import {
	faCircle,
	faSquare,
	faArrowRight,
	faTrash,
	faMousePointer,
	faExpandArrowsAlt,
	faEdit,
	faPlayCircle,
	faFileArrowDown,
	faInfoCircle,
	faPlusCircle,
	faMinusCircle,
	faWandMagicSparkles,
	faQuestion,
	faPen,
	faUpRightFromSquare,
	faFilter,
	faTriangleExclamation,
	faXmark,
	faCheck,
	faChartSimple,
	faPercent
} from '@fortawesome/free-solid-svg-icons'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueEcharts from 'vue-echarts';

import App from './App.vue'
import router from './router'

/* add icons to the library */
library.add(
	faCircle,
	faSquare,
	faArrowRight,
	faTrash,
	faMousePointer,
	faExpandArrowsAlt,
	faEdit,
	faPlayCircle,
	faFileArrowDown,
	faInfoCircle,
	faPlusCircle,
	faMinusCircle,
	faWandMagicSparkles,
	faQuestion,
	faPen,
	faUpRightFromSquare,
	faFilter,
	faTriangleExclamation,
	faXmark,
	faCheck,
	faChartSimple,
	faPercent
)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(createPinia())
app.use(VueCodemirror, {
	// keep the global default extensions empty
	// to allow removal of gutters
	extensions: []
})
app.component('v-chart', VueEcharts);

app.mount('#app');