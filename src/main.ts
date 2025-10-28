import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'nprogress/nprogress.css'
import 'primeicons/primeicons.css'
import 'notyf/notyf.min.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { init } from '@/utils/theme'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

init()

app.mount('#app')
