import { getKeyMap } from './keycodes'
import { assignKeyHandler } from './helpers'

/**
 *
 * @param {Object} el
 * @param {Object} bindings
 * @param {Object} alias
 */
function bindEvent (el, { value, modifiers }, alias) {
  const keyMap = getKeyMap(value, alias)
  el._keyHandler = e => assignKeyHandler(e, keyMap, modifiers)

  document.addEventListener('keydown', el._keyHandler)
  document.addEventListener('keyup', el._keyHandler)
}

/**
 *
 * @param {Object} el
 */
function unbindEvent (el) {
  document.removeEventListener('keydown', el._keyHandler)
  document.removeEventListener('keyup', el._keyHandler)
}

export {
  bindEvent,
  unbindEvent
}
