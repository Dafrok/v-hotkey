import keyCode from 'keycode'

const getKeyMap = keymap => Object.keys(keymap).map(input => {
  const result = {}
  input.split('+').forEach(keyName => {
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
  result.callback = keymap[input]
  return result
})

export default {
  install (Vue) {
    Vue.directive('hotkey', {
      bind (el, binding, vnode, oldVnode) {
        binding.keymap = getKeyMap(binding.value)
        binding.keyHandler = e => {
          for (const hotkey of binding.keymap) {
            hotkey.keyCode === e.keyCode
              && !!hotkey.ctrl === e.ctrlKey
              && !!hotkey.alt === e.altKey
              && !!hotkey.shift === e.shiftKey
              && !!hotkey.meta === e.metaKey
              && hotkey.callback(e)
          }
        }

        document.addEventListener('keydown', binding.keyHandler)
      },
      unbind (el, binding, vnode, oldVnode) {
        document.removeEventListener('keydown', binding.keyHandler)
      }
    })
  }
}