<template lang="pug">
section(v-hotkey="keymap")
  h1.title Well done!
  section.hero-section
    p Press <kbd>enter</kbd> to give me a <a href="https://github.com/Dafrok/v-hotkey" target="_blank" ref="star">STAR</a>.
    p Press <kbd>esc</kbd> to return home.
</template>
<script>
export default {
  computed: {
    keymap () {
      return {
        enter: this.star
      }
    }
  },
  methods: {
    star () {
      const $star = this.$refs.star
      $star.click()
    }
  }
}
</script>
