import { createApp } from 'vue'
import router from './router'
import i18n from './language/index'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'lib-flexible'
import './assets/css/style.scss'
import '@js/theme.js' //toggletheme
// import '@js/performance.js'
import VConsole from 'vconsole'

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'uat' || process.env.NODE_ENV === 'gray') {
	new VConsole()
}
const pinia = createPinia()
const app = createApp(App)

app.use(router).use(i18n).use(pinia)
app.mount('#app')
