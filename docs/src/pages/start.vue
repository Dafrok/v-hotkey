<template lang="pug">
div(v-hotkey="keymap")
  h1.title V-Hotkey
  h2.subtitle Vue 2.x directive for binding hotkeys to components.
  section.hero-section
    p Press <kbd>enter</kbd> to <router-link to="/step/1">get start</router-link>.
    p Press <kbd>space</kbd> to see the <a ref="doc" href="https://github.com/Dafrok/v-hotkey/blob/master/README.md" target="_blank">documentation</a>.
</template>

<script>
export default {
  computed: {
    keymap () {
      return {
        enter: this.start,
        space: this.doc
      }
    }
  },
  methods: {
    start () {
      this.$router.push('/step/1')
    },
    doc () {
      this.$refs.doc.click()
    }
  }
}
</script>
