import { getKeyMap } from '../../src/keycodes'

describe('keycodes functions', () => {
  it('should create a keymap', () => {
    const combinations = {
      'ctrl+1': () => {}
    }
    const result = getKeyMap(combinations, {})
    expect(result.length).toEqual(1)
    expect(result[0].code).toEqual(49)
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
    expect(result[0].code).toEqual(17)
    expect(result[1].code).toEqual(18)
    expect(result[2].code).toEqual(16)
    expect(result[3].code).toEqual(91)
  })

  it('should create a keymap with key modifers', () => {
    const combinations = {
      'ctrl+alt+shift+command+1': () => {}
    }
    const result = getKeyMap(combinations, {})
    expect(result.length).toEqual(1)
    expect(result[0].code).toEqual(49)
    expect(result[0].modifiers.ctrlKey).toEqual(true)
    expect(result[0].modifiers.altKey).toEqual(true)
    expect(result[0].modifiers.shiftKey).toEqual(true)
    expect(result[0].modifiers.metaKey).toEqual(true)
  })
})
