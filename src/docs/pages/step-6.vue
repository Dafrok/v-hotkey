<template lang="pug">
section(v-hotkey="keymap")
  h1.title Dynamic Keymap With Single Component
  section.hero-section
    p Press <kbd>tab</kbd> to switch keymap.
  section.hero-section(v-show="keymapType === 'keymap1'")
    p Press <kbd>ctrl</kbd> + <kbd>enter</kbd> to say
      b(ref="hello") hello.
    p You can't say bye now.
  section.hero-section(v-show="keymapType === 'keymap2'")
    p Press <kbd>alt</kbd> + <kbd>enter</kbd> to say
      b(ref="bye") bye.
    p You can't say hello now.
  section.hero-section
    p(:class="{next: true, show: show}") Press <kbd>→</kbd> to play next case.
</template>
<script>
export default {
  data () {
    return {
      keymapType: 'keymap1',
      show: false
    }
  },
  computed: {
    keymap () {
      const keymaps = {
        keymap1: {
          tab: this.switchKeyMap,
          'ctrl+enter': this.hello
        },
        keymap2: {
          tab: this.switchKeyMap,
          'alt+enter': this.bye
        }
      }
      return keymaps[this.keymapType]
    }
  },
  mounted () {
    const $hello = this.$refs.hello
    const $bye = this.$refs.bye
    $hello.addEventListener('animationend', e => $hello.classList.remove('active'))
    $bye.addEventListener('animationend', e => $bye.classList.remove('active'))
  },
  methods: {
    switchKeyMap (e) {
      e.preventDefault()
      this.keymapType = this.keymapType === 'keymap1' ? 'keymap2' : 'keymap1'
      const $hello = this.$refs.hello
      const $bye = this.$refs.bye
      $hello.classList.remove('active')
      $bye.classList.remove('active')
    },
    hello () {
      const $hello = this.$refs.hello
      $hello.classList.add('active')
    },
    bye () {
      const $bye = this.$refs.bye
      $bye.classList.add('active')
      this.show = true
    }
  }
}
</script>

<style lang="stylus" scoped>
b
  display inline-block
.active
  animation active 1s

.next
  transition all 1s
  opacity 0
  transform translateY(100%)
.show
  opacity 1
  transform translateY(0)

@keyframes active
  0%
    transform translateX(0)
  50%
    transform translateX(15px)
  100%
    transform translateX(0)
</style>
