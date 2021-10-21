import codes from './codes'
import { splitCombination, returnCharCode } from '../helpers'

const noop = () => {}

const defaultModifiers = {
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false
}

function isApplePlatform() {
  return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
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
 * @param {Object} indices
 * @param {Object} alias
 * @returns {Object}
 */
export const getKeyMap = (indices, alias) => {
  const result = []

  Object.keys(indices).forEach(index => {
    const { keyup, keydown } = indices[index]
    const callback = {
      keydown: keydown || (keyup ? noop : indices[index]),
      keyup: keyup || noop
    }

    const combinations = index.split(' ')
    combinations.forEach(combination => {
      const keys = splitCombination(combination)
      const { code, modifiers } = resolveCodesAndModifiers(keys, alias)

      result.push({
        code,
        modifiers,
        callback
      })
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
      if (defaultModifiers.hasOwnProperty(`${key}Key`)) {
        acc.modifiers = { ...acc.modifiers, [`${key}Key`]: true }
      } else {
        acc.code = alias[key] || searchKeyCode(key)
      }
      return acc
    }, { modifiers })
  }

  const key = alternativeKeyNames[keys[0]] || keys[0]
  if (defaultModifiers.hasOwnProperty(`${key}Key`)) {
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
