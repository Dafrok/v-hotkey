<template lang="pug">
section(v-hotkey="keymap")
  h1.title Keyup and Keydown Listeners.
  section.hero-section
    p Press and hold <kbd>enter</kbd> to say #[b.hello(ref="hello") hello] louder.
    transition(name="slide")
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
        enter: {
          keydown: this.louder,
          keyup: this.softer
        }
      }
    }
  },
  methods: {
    louder () {
      const $hello = this.$refs.hello
      $hello.classList.add('loud')
      // this.show = true
    },
    softer () {
      const $hello = this.$refs.hello
      $hello.classList.remove('loud')
      this.show = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.hello
  display inline-block
  transition all 1s

.loud
  transform scale(1.5) translateY(-15px)

.next
  transition all 1s 1s
  opacity 0
  transform translateY(100%)

.show
  opacity 1
  transform translateY(0)
</style>
