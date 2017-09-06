<template lang="pug">
section(v-hotkey="keymap")
  h1.title(ref="hello") Hello world.
  section.hero-section
    p Press and hold <kbd>enter</kbd> to say hello.
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
  methods: {
    hello () {
      const $hello = this.$refs.hello
      $hello.classList.add('active')
      this.show = true
    },
  goodbye () {
  const $hello = this.$refs.hello
      $hello.classList.remove('active')
  }
  },
  computed: {
    keymap () {
      return {
        enter: {
  keydown: this.hello,
  keyup: this.goodbye
  }
      }
    }
  },
  mounted () {
    const $hello = this.$refs.hello
    //$hello.addEventListener('animationend', e => {$hello.classList.remove('active')})
  }
}
</script>

<style lang="stylus" scoped>
.title
  transition all 0.5s
.active
  transform scale(1.5)

.next
  transition all 1s 1s
  opacity 0
  transform translateY(100%)
.show
  opacity 1
  transform translateY(0)
</style>
