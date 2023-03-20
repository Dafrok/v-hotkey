import keyAliases from './aliases'
import { splitCombination } from '../helpers'

const noop = () => {}

const defaultModifiers = {
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false
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
    const { key, modifiers } = resolveKeyAndModifiers(keys, alias)

    result.push({
      key,
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
const resolveKeyAndModifiers = (keys, alias) => {
  let modifiers = { ...defaultModifiers }
  if (keys.length > 1) {
    return keys.reduce((acc, key) => {
      key = searchKey(key)
      if (`${key}Key` in defaultModifiers) {
        acc.modifiers = { ...acc.modifiers, [`${key}Key`]: true }
      } else {
        acc.key = key
      }
      return acc
    }, { modifiers })
  }

  const key = searchKey(keys[0])

  return {
    key,
    modifiers,
  }
}

/**
 *
 * @param {String} key
 */
export const searchKey = key => keyAliases[key.toLowerCase()] || key.toLowerCase()
