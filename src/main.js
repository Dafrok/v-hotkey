import { getKeyMap } from './keys'
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

  el.addEventListener('keydown', el._keyHandler)
  el.addEventListener('keyup', el._keyHandler)
}

/**
 *
 * @param {Object} el
 */
function unbindEvent (el) {
  el.removeEventListener('keydown', el._keyHandler)
  el.removeEventListener('keyup', el._keyHandler)
}

export {
  bindEvent,
  unbindEvent
}
