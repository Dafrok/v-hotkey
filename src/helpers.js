
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
 * @param {String} key
 * @returns {String|undefined}
 */
export const returnCharCode = key => key.length === 1 ? key.charCodeAt(0) : undefined

/**
 *
 * @param {Array} keyMap
 * @param {Number} keyCode
 * @param {Object} eventKeyModifiers
 * @returns {Function|Boolean}
 */
const getHotkeyCallback = (keyMap, keyCode, eventKeyModifiers) => {
  const key = keyMap.find(({ code, modifiers }) =>
    code === keyCode && areObjectsEqual(eventKeyModifiers, modifiers)
  )
  if (!key) return false
  return key.callback
}

/**
 *
 * @param {Event} e
 * @param {Array} keyMap
 * @param {Object} modifiers Vue event modifiers
 */
export const assignKeyHandler = (e, keyMap, modifiers) => {
  const { keyCode, ctrlKey, altKey, shiftKey, metaKey } = e
  const eventKeyModifiers = { ctrlKey, altKey, shiftKey, metaKey }

  if (modifiers.prevent) {
    e.preventDefault()
  }

  if (modifiers.stop) {
    e.stopPropagation()
  }

  const { nodeName, isContentEditable } = document.activeElement
  if (isContentEditable) return
  if (FORBIDDEN_NODES.includes(nodeName)) return

  const callback = getHotkeyCallback(keyMap, keyCode, eventKeyModifiers)
  if (!callback) return e
  e.preventDefault()
  callback[e.type](e)
}
