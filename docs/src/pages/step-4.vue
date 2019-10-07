<template lang="pug">
section(v-hotkey="keymap")
  h1.title Key Combination
  section.hero-section
    p Press <kbd>ctrl</kbd> + <kbd>enter</kbd> to say
      b(ref="hello") hello.
    p Press <kbd>alt</kbd> + <kbd>enter</kbd> to say
      b(ref="bye") bye.
    p Press <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>enter</kbd> to leave.
    p(:class="{next: true, show: show}") Press <kbd>→</kbd> to play next case.
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  computed: {
    keymap () {
      return {
        'ctrl+enter': this.hello,
        'alt+enter': this.bye,
        'ctrl+alt+enter': this.leave
      }
    }
  },
  mounted () {
    const $hello = this.$refs.hello
    const $bye = this.$refs.bye
    $hello.addEventListener('animationend', e => $hello.classList.remove('active'))
    $bye.addEventListener('animationend', e => $bye.classList.remove('active'))
  },
  methods: {
    hello () {
      const $hello = this.$refs.hello
      $hello.classList.add('active')
    },
    bye () {
      const $bye = this.$refs.bye
      $bye.classList.add('active')
    },
    leave () {
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
