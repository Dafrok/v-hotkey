import keyCode from './keycode'

const noop = function () {}

const getKeyMap = keymap => Object.keys(keymap).map(input => {
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
        result.keyCode = keyCode(keyName)
    }
  })
  result.callback = {
    keydown: keydown || (keyup ? noop : keymap[input]),
    keyup: keyup || noop
  }
  return result
})

function bindEvent (el, binding) {
  el._keymap = getKeyMap(binding.value)
  el._keyHandler = e => {
    for (const hotkey of el._keymap) {
      const callback = hotkey.keyCode === e.keyCode &&
        !!hotkey.ctrl === e.ctrlKey &&
        !!hotkey.alt === e.altKey &&
        !!hotkey.shift === e.shiftKey &&
        !!hotkey.meta === e.metaKey &&
        hotkey.callback[e.type]
      console.log(hotkey.callback, e.type)
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
  install (Vue) {
    Vue.directive('hotkey', {
      bind: bindEvent,
      componentUpdated (el, binding) {
        if (binding.value !== binding.oldValue) {
          unbindEvent.apply(this, arguments)
          bindEvent.apply(this, arguments)
        }
      },
      unbind: unbindEvent
    })
  }
}
