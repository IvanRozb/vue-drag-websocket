import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import router from './router'
import { workspaceStore, key } from './store/workspace'

const app = createApp(App)

app.use(router)
app.use(VueKonva)
app.use(workspaceStore, key)

app.mount('#app')
