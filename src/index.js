import { bindEvent, unbindEvent } from './main'

const buildDirective = function (alias = {}) {
  return {
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
  }
}

const plugin = {
  install (Vue, alias = {}) {
    Vue.directive('hotkey', buildDirective(alias))
  },

  directive: buildDirective()
}

export default plugin
