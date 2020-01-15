<template lang="pug">
section(v-hotkey="keymap")
  h1.title(ref="hello") Hello world.
  section.hero-section
    p Press <kbd>enter</kbd> to say hello.
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
        enter: this.hello
      }
    }
  },
  mounted () {
    const $hello = this.$refs.hello
    $hello.addEventListener('animationend', e => $hello.classList.remove('active'))
  },
  methods: {
    hello () {
      const $hello = this.$refs.hello
      $hello.classList.add('active')
      this.show = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.active
  animation active-helloworld 1s

.next
  transition all 1s 1s
  opacity 0
  transform translateY(100%)
.show
  opacity 1
  transform translateY(0)

@keyframes active-helloworld
  0%
    transform scale(1)
  50%
    transform scale(1.5)
  100%
    transform scale(1)
</style>
