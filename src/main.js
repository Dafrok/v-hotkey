import { searchKeyCode } from './keycode'

const noop = () => {}

const getKeyMap = (keymap, alias) => Object.keys(keymap).map(input => {
  const result = {}
  const { keyup, keydown } = keymap[input]
  input.replace('numpad +', 'numpad add').split('+').forEach(keyName => {
    switch (keyName.toLowerCase()) {
      case 'ctrl':
      case 'alt':
      case 'shift':
      case 'meta':
        result[keyName] = true
        break
      default:
        result.keyCode = alias[keyName] || searchKeyCode(keyName)
    }
  })
  result.callback = {
    keydown: keydown || (keyup ? noop : keymap[input]),
    keyup: keyup || noop
  }
  return result
})

function bindEvent (el, { value, modifiers }, alias) {
  el._keymap = getKeyMap(value, alias)
  el._keyHandler = e => {
    if (modifiers.prevent) e.preventDefault()
    if (modifiers.stop) {
      const { nodeName, isContentEditable } = document.activeElement
      if (isContentEditable) return

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

export {
  bindEvent,
  unbindEvent
}
