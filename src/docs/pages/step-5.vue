<template lang="pug">
section(v-hotkey="keymap")
  h1.title Private Hotkeys of Components
  section.hero-section
    p Press <kbd>tab</kbd> to switch between two components.
  section.hero-section
    .columns
      .column.is-2
      .column.is-4
        .box.content.component-a(:class="{active: flag}")
          h1 Component A
          p(v-if="flag", v-hotkey="keymapA") Press <kbd>enter</kbd> to say hello.
          .msg(ref="hello") HELLO!
      .column.is-4
        .box.content.component-b(:class="{active: !flag}")
          h1 Component B
          p(v-if="!flag", v-hotkey="keymapB") Press <kbd>enter</kbd> to say bye.
          .msg(ref="bye") BYE!
      .column.is-2
  section.hero-section
    p(:class="{next: true, show: show}") Press <kbd>→</kbd> to play next case.
</template>

<script>
export default {
  data () {
    return {
      flag: true,
      show: false
    }
  },
  computed: {
    keymap () {
      return {
        tab: this.switch
      }
    },
    keymapA () {
      return {
        enter: this.hello
      }
    },
    keymapB () {
      return {
        enter: this.bye
      }
    }
  },
  watch: {
    flag (val, oldVal) {
      if (val) {
        this.show = true
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
    switch (e) {
      e.preventDefault()
      this.flag = !this.flag
    }
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

.msg
  display inline-block
  margin 10px
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
  height 180px
  *
    color #ccc
  &.active
    *
      color black
</style>
