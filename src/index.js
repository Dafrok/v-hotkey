const getKeyCode = alias => {} 

const getKeyMap = keymap => Object.keys(keymap).map(input => {
  const result = {}
  input.split('+').forEach(keyName => {
    const key = keyName === '.' ? [keyName] : keyName.split('.')
    switch (key[0]) {
      case 'ctrl':
        result.ctrl = key[1] ? key[1] : true
        break
      case 'alt':
        result.alt = key[1] ? key[1] : true
        break
      case 'shift':
        result.shift = key[1] ? key[1] : true
        break
      case 'meta':
        result.meta = key[1] ? key[1] : true
        break
      default:
        result.key = getKeyCode(key[0])
    }
  })

  return result
})

export default {
  install (Vue) {
    Vue.directive('hotkey', {
      bind (el, binding, vnode, oldVnode) {
        binding.keymap = getKeyMap(binding.value)
        binding.keyHandler = () => {
          for (const hotkey of binding.keymap) {
            
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