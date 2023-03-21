import { getKeyMap } from '../../src/keys'

describe('keys functions', () => {
  it('should create a keymap', () => {
    const combinations = {
      'ctrl+1': () => {}
    }
    const result = getKeyMap(combinations, {})
    expect(result.length).toEqual(1)
    expect(result[0].key).toEqual("1")
  })

  it('should create a keymap for ctrl, alt, shift, command', () => {
    const combinations = {
      ctrl: () => {},
      alt: () => {},
      shift: () => {},
      command: () => {}
    }
    const result = getKeyMap(combinations, {})

    expect(result.length).toEqual(4)
    expect(result[0].key).toEqual("ctrl")
    expect(result[1].key).toEqual("alt")
    expect(result[2].key).toEqual("shift")
    expect(result[3].key).toEqual("meta")
  })

  it('should create a keymap with key modifers', () => {
    const combinations = {
      'ctrl+alt+shift+command+1': () => {}
    }
    const result = getKeyMap(combinations, {})
    expect(result.length).toEqual(1)
    expect(result[0].key).toEqual("1")
    expect(result[0].modifiers.ctrlKey).toEqual(true)
    expect(result[0].modifiers.altKey).toEqual(true)
    expect(result[0].modifiers.shiftKey).toEqual(true)
    expect(result[0].modifiers.metaKey).toEqual(true)
  })
})
