<template lang="pug">
.container(v-hotkey="keymap")
  h1 Key Combination
  p Press `ctrl + enter` to say 
    b(ref="hello") hello.
  p Press `alt + enter` to say 
    b(ref="bye") bye.
  p Press `ctrl + alt + enter` to leave
  p(:class="{next: true, show: show}") Press `→` to play next case.
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
    },
    bye () {
      const $bye = this.$refs.bye
      $bye.classList.add('active')
    },
    leave () {
      this.show = true
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
    $hello.addEventListener('animationend', e => {$hello.classList.remove('active')})
    $bye.addEventListener('animationend', e => {$bye.classList.remove('active')})
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