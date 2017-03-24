<template lang="pug">
.fixed
  .container(v-hotkey="keymap")
    h1 V Hotkey
    p Vue 2.x directive - binding hotkeys for components.
    p
      |Press 
      b "enter"
      |  to 
      router-link(to="/step/1") get start.
    p
      |Press 
      b "space"
      |  to 
      a(ref="doc", href="https://github.com/Dafrok/v-hotkey/blob/master/README.md", target="_blank") see the documentation.
</template>

<script>
export default {
  methods: {
    start () {
      this.$router.push('/step/1')
    },
    doc () {
      this.$refs.doc.click()
    }
  },
  computed: {
    keymap () {
      return {
        enter: this.start,
        space: this.doc
      }
    }
  }
}
</script>
