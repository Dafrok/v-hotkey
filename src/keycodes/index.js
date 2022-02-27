import codes from './codes'
import { splitCombination, returnCharCode } from '../helpers'

const noop = () => {}

const defaultModifiers = {
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false
}

function isApplePlatform () {
  return typeof navigator !== 'undefined' &&
    typeof navigator.userAgentData !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.userAgentData.platform)
}

const alternativeKeyNames = {
  option: 'alt',
  command: 'meta',
  return: 'enter',
  escape: 'esc',
  plus: '+',
  mod: isApplePlatform() ? 'meta' : 'ctrl'
}

/**
 *
 * @param {Object} combinations
 * @param {Object} alias
 * @returns {Object}
 */
export const getKeyMap = (combinations, alias) => {
  const result = []

  Object.keys(combinations).forEach(combination => {
    const { keyup, keydown } = combinations[combination]
    const callback = {
      keydown: keydown || (keyup ? noop : combinations[combination]),
      keyup: keyup || noop
    }
    const keys = splitCombination(combination)
    const { code, modifiers } = resolveCodesAndModifiers(keys, alias)

    result.push({
      code,
      modifiers,
      callback
    })
  })

  return result
}

/**
 *
 * @param {Array} keys
 * @param {Object} alias
 * @returns {Object}
 */
const resolveCodesAndModifiers = (keys, alias) => {
  let modifiers = { ...defaultModifiers }
  if (keys.length > 1) {
    return keys.reduce((acc, key) => {
      key = alternativeKeyNames[key] || key
      if (`${key}Key` in defaultModifiers) {
        acc.modifiers = { ...acc.modifiers, [`${key}Key`]: true }
      } else {
        acc.code = alias[key] || searchKeyCode(key)
      }
      return acc
    }, { modifiers })
  }

  const key = alternativeKeyNames[keys[0]] || keys[0]
  if (`${key}Key` in defaultModifiers) {
    modifiers = { ...modifiers, [`${key}Key`]: true }
  }
  const code = alias[key] || searchKeyCode(key)

  return {
    modifiers,
    code
  }
}

/**
 *
 * @param {String} key
 */
const searchKeyCode = key => codes[key.toLowerCase()] || returnCharCode(key)
