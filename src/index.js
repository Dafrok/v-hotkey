import { bindEvent, unbindEvent } from './main'

const DEFAULT_FORBIDDEN_NODES = ['INPUT', 'TEXTAREA', 'SELECT']

const buildDirective = function (alias = {}, forbiddenNodes = DEFAULT_FORBIDDEN_NODES) {
  return {
    bind (el, binding) {
      bindEvent(el, binding, alias, forbiddenNodes)
    },
    componentUpdated (el, binding) {
      if (binding.value !== binding.oldValue) {
        unbindEvent(el)
        bindEvent(el, binding, alias, forbiddenNodes)
      }
    },
    unbind: unbindEvent
  }
}

const plugin = {
  install (Vue, options = {}) {
    const { alias = {}, forbiddenNodes = DEFAULT_FORBIDDEN_NODES } = options;
    Vue.directive('hotkey', buildDirective(alias, forbiddenNodes))
  },

  directive: buildDirective()
}

export default plugin
