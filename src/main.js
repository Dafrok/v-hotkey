import { getKeyMap } from './keycodes'
import { assignKeyHandler } from './helpers'

/**
 *
 * @param {Object} el
 * @param {Object} bindings
 * @param {Object} alias
 */
function bindEvent (el, { value, modifiers }, alias, forbiddenNodes) {
  el._keyMap = getKeyMap(value, alias)
  el._keyHandler = e => assignKeyHandler(e, el._keyMap, modifiers, forbiddenNodes)

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
