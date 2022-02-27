import { mount } from '@vue/test-utils'
import hotkeyDirective from '../../src/index'
import Foo from './FooComponent.vue'

describe('Hotkey works', () => {
  it('shows div on enter down', async () => {
    const wrapper = mount(Foo, {
      global: {
        plugins: [hotkeyDirective]
      },
      attachTo: document.body
    })
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
    await wrapper.trigger('keydown.enter')
    div = wrapper.find('.visible')
    expect(div.exists()).toBe(true)
    expect(div.text()).toBe('Hello hotkey')
  })

  it('hiddes div on esc down', async () => {
    const wrapper = mount(Foo, {
      global: {
        plugins: [hotkeyDirective]
      },
      attachTo: document.body
    })
    await wrapper.trigger('keydown.enter')
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(true)
    await wrapper.trigger('keydown.esc')
    div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
  })
})
