import { mount, createLocalVue } from '@vue/test-utils'
import hotkeyDirective from '../../src/index'
import Foo from './Foo.vue'
import FooWithInput from './FooWithInput.vue'

const localVue = createLocalVue()
localVue.use(hotkeyDirective)

describe('Hotkey works', () => {
  it('shows div on enter down', async () => {
    const wrapper = mount(Foo, {
      localVue,
      attachToDocument: true
    })
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
    wrapper.trigger('keydown.enter')
    div = wrapper.find('.visible')
    expect(div.exists()).toBe(true)
    expect(div.text()).toBe('Hello hotkey')
  })

  it('hiddes div on esc down', async () => {
    const wrapper = mount(Foo, {
      localVue,
      attachToDocument: true
    })
    wrapper.trigger('keydown.enter')
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(true)
    wrapper.trigger('keydown.esc')
    div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
  })

it('directive doesnt work on input node', async () => {
    const wrapper = mount(FooWithInput, {
      localVue,
      attachToDocument: true
    })

    wrapper.find('input').element.focus()
    wrapper.trigger('keydown.enter')
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
  });

it('directive works on all nodes (forbiddenNodes: [])', async () => {
    const localVue = createLocalVue()
    localVue.use(hotkeyDirective, { forbiddenNodes: [] })
    
    const wrapper = mount(FooWithInput, {
      localVue,
      attachToDocument: true
    })

    wrapper.find('input').element.focus()
    wrapper.trigger('keydown.enter')
    let div = wrapper.find('.visible')
    expect(div.exists()).toBe(true)
    wrapper.trigger('keydown.esc')
    div = wrapper.find('.visible')
    expect(div.exists()).toBe(false)
  });
})
