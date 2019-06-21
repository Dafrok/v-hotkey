import keyCode from './keycode'

const noop = function () {}

const getKeyMap = (keymap, alias) => Object.keys(keymap).map(input => {
  const result = {}
  const {keyup, keydown} = keymap[input]
  input.replace('numpad +', 'numpad add').split('+').forEach(keyName => {
    switch (keyName.toLowerCase()) {
      case 'ctrl':
      case 'alt':
      case 'shift':
      case 'meta':
        result[keyName] = true
        break
      default:
        result.keyCode = alias[keyName] || keyCode(keyName)
    }
  })
  result.callback = {
    keydown: keydown || (keyup ? noop : keymap[input]),
    keyup: keyup || noop
  }
  return result
})

function bindEvent (el, binding, alias) {
  el._keymap = getKeyMap(binding.value, alias)
  el._keyHandler = e => {
    if (binding.modifiers.prevent) {
      e.preventDefault()
    }
    if (binding.modifiers.stop) {
      const {nodeName, isContentEditable} = document.activeElement
      if (isContentEditable) {
        return
      }
      switch (nodeName) {
        case 'INPUT':
        case 'TEXTAREA':
        case 'SELECT':
          return
      }
    }
    for (const hotkey of el._keymap) {
      const callback = hotkey.keyCode === e.keyCode &&
        !!hotkey.ctrl === e.ctrlKey &&
        !!hotkey.alt === e.altKey &&
        !!hotkey.shift === e.shiftKey &&
        !!hotkey.meta === e.metaKey &&
        hotkey.callback[e.type]
      callback && callback(e)
    }
  }
  document.addEventListener('keydown', el._keyHandler)
  document.addEventListener('keyup', el._keyHandler)
}

function unbindEvent (el) {
  document.removeEventListener('keydown', el._keyHandler)
  document.removeEventListener('keyup', el._keyHandler)
}

export default {
  install (Vue, alias = {}) {
    Vue.directive('hotkey', {
      bind: function (el, binding) {
        bindEvent.call(this, el, binding, alias)
      },
      componentUpdated (el, binding) {
        if (binding.value !== binding.oldValue) {
          unbindEvent.call(this, arguments)
          bindEvent.apply(this, el, binding, alias)
        }
      },
      unbind: unbindEvent
    })
  }
}
