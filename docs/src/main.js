import Vue from 'vue'
import VueHotkey from '../../src/index.js'
import VueRouter from 'vue-router'

import App from './App.vue'
import routes from './routes'

import 'bulma/css/bulma.css'

Vue.use(VueHotkey)
Vue.use(VueRouter)

const router = new VueRouter({ routes })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render (h) {
    return h(App)
  }
})
