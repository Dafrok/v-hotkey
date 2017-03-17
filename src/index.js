const getKeyCode = alias => {} 

const getKeyMap = keymap => Object.keys(keymap).map(input => {
  const result = {
/*
    key,
    ctrl,
    alt,
    shift,
    meta
*/
  }
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