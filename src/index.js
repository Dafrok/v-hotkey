import { bindEvent, unbindEvent } from './main.js'

export default {
  install (Vue, alias = {}) {
    Vue.directive('hotkey', {
      bind (el, binding) {
        bindEvent(el, binding, alias)
      },
      componentUpdated (el, binding) {
        if (binding.value !== binding.oldValue) {
          unbindEvent(el)
          bindEvent(el, binding, alias)
        }
      },
      unbind: unbindEvent
    })
  }
}
