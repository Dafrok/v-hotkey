import { searchKey } from './keys'

const FORBIDDEN_NODES = ['INPUT', 'TEXTAREA', 'SELECT']

/**
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean}
 */
const areObjectsEqual = (a, b) =>
  Object.entries(a).every(([key, value]) => b[key] === value)

/**
 *
 * @param {String} combination
 */
export const splitCombination = combination => {
  combination = combination.replace(/\s/g, '')
  combination = combination.includes('numpad+')
    ? combination.replace('numpad+', 'numpadadd')
    : combination
  combination = combination.includes('++')
    ? combination.replace('++', '+=')
    : combination
  return combination.split(/\+{1}/)
}

/**
 *
 * @param {Array} keyMap
 * @param {String} key
 * @param {Object} eventKeyModifiers
 * @returns {Function|Boolean}
 */
const getHotkeyCallback = (keyMap, eventKey, eventModifiers) => {
  const match = keyMap.find(({ key, modifiers }) =>
    eventKey && searchKey(eventKey) === key && areObjectsEqual(eventModifiers, modifiers)
  )
  if (!match) return false
  return match.callback
}

/**
 *
 * @param {Event} e
 * @param {Array} keyMap
 * @param {Object} modifiers Vue event modifiers
 */
export const assignKeyHandler = (e, keyMap, modifiers) => {
  const { key: eventKey, ctrlKey, altKey, shiftKey, metaKey } = e
  const eventModifiers = { ctrlKey, altKey, shiftKey, metaKey }

  const { nodeName, isContentEditable } = document.activeElement
  if (isContentEditable) return
  if (FORBIDDEN_NODES.includes(nodeName)) return

  const callback = getHotkeyCallback(keyMap, eventKey, eventModifiers)
  if (!callback) return e

  if (modifiers.stop) {
    e.stopPropagation()
  }

  if (modifiers.prevent) {
    e.preventDefault()
  }

  callback[e.type](e)
}
