import { splitCombination, returnCharCode, assignKeyHandler } from '../../src/helpers'

describe('helper functions', () => {
  it('should split combination', () => {
    const keys = splitCombination('ctrl+alt+1')
    expect(keys).toEqual(['ctrl', 'alt', '1'])
  })

  it('should split combination that contains `+`', () => {
    const keys = splitCombination('ctrl+alt++')
    expect(keys).toEqual(['ctrl', 'alt', '='])
  })

  it('should split combination that contains `numpad +`', () => {
    const keys = splitCombination('numpad + + 2')
    expect(keys).toEqual(['numpadadd', '2'])
  })

  it('sholud return charCode', () => {
    const charCode = returnCharCode('a')
    expect(charCode).toEqual(97)
  })

  it('sholud return undefined instead of charCode', () => {
    const charCode = returnCharCode('')
    expect(charCode).toEqual(undefined)
  })

  it('should assign handler to element and trigger callback', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 65,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: () => {}
    }

    const keyMap = [{
      code: 65,
      modifiers: {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
      },
      callback: {
        keydown: mockFn
      }
    }]

    assignKeyHandler(e, keyMap, {})

    expect(mockFn).toHaveBeenCalled()
  })

  it('should not trigger callback if key is not present', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 64,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: () => {}
    }

    const keyMap = [{
      code: 65,
      modifiers: {
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
      },
      callback: {
        keydown: mockFn
      }
    }]

    assignKeyHandler(e, keyMap, {})

    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should call preventDefault if prevent modifier is present', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 65,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: mockFn
    }

    assignKeyHandler(e, [], { prevent: true })

    expect(mockFn).toHaveBeenCalled()
  })

  it('should call stopPropagation if stop modifier is present', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 65,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      stopPropagation: mockFn
    }

    assignKeyHandler(e, [], { stop: true })
    expect(mockFn).toHaveBeenCalled()
  })

  it('should do nothing if active element is editable', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 65,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: mockFn
    }

    document.activeElement.isContentEditable = true

    assignKeyHandler(e, [], {})

    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should do nothing if active element is forbidden', () => {
    const mockFn = jest.fn()
    const e = {
      type: 'keydown',
      keyCode: 65,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: mockFn
    }

    document.body.innerHTML = `
      <div>
          <input class="input"> </input>
      </div>
    `
    const node = document.querySelector('.input')
    node.focus()
    document.activeElement.isContentEditable = false

    assignKeyHandler(e, [], {})

    expect(mockFn).not.toHaveBeenCalled()
  })
})
