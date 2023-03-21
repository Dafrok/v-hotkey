import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'

import VueHotkey from '../../src/index.js'
import App from './App.vue'
import routes from './routes'

import 'bulma/css/bulma.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
  .use(VueHotkey)
  .use(router);

app.mount('#app');
