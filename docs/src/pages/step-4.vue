<template lang="pug">
.container(v-hotkey="keymap")
  h1 Private Hotkeys of Components
  p Press `tab` to switch two Components
  div.component-a(:class="{active: flag}")
    p Component A
    p(v-if="flag", v-hotkey="keymapA") Press `enter` to say hello.
    p.message(ref="hello") HELLO!
  div.component-b(:class="{active: !flag}")
    p Component B
    p(v-if="!flag", v-hotkey="keymapB") Press `enter` to say bye.
    p.message(ref="bye") BYE!
  p(:class="{next: true, show: show}") Press `→` to play next case.
</template>

<script>
export default {
  data () {
    return {
      flag: true,
      show: false
    }
  },
  watch: {
    flag (val, oldVal) {
      if (val) {
        this.show = true
      }
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
    switch (e) {
      e.preventDefault()
      this.flag = !this.flag
    }
  },
  computed: {
    keymap () {
      return {
        'tab': this.switch
      }
    },
    keymapA () {
      return {
        'enter': this.hello
      }
    },
    keymapB () {
      return {
        'enter': this.bye
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
.next
  transition all 1s
  opacity 0
  transform translateY(100%)
.show
  opacity 1
  transform translateY(0)

.message
  opacity 0
  transform scale(0)
  &.active
    animation active-private 1s

@keyframes active-private
  0%
    opacity 0
    transform scale(0)
  50%
    opacity 1
    transform scale(2)
  100%
    opacity 0
    transform scale(0)

.show
  opacity 1
  transform translateY(0)

.component-a, .component-b
  transition all .3s
  vertical-align middle
  border 1px solid silver
  box-sizing border-box
  background #eee
  color #ccc
  margin 10px
  height 140px
  &.active
    background white
    color black
</style>