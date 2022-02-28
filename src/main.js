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

  el.ownerDocument.addEventListener('keydown', el._keyHandler)
  el.ownerDocument.addEventListener('keyup', el._keyHandler)
}

/**
 *
 * @param {Object} el
 */
function unbindEvent (el) {
  el.ownerDocument.removeEventListener('keydown', el._keyHandler)
  el.ownerDocument.removeEventListener('keyup', el._keyHandler)
}

export {
  bindEvent,
  unbindEvent
}
