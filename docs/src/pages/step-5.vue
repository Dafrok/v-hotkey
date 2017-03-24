<template lang="pug">
.container(v-hotkey="keymap")
  h1 Well done!
  p
    span Press `enter` to give me a 
    a(href="https://github.com/Dafrok/v-hotkey", target="_blank", ref="star") STAR
    span .
  p Press `esc` to return home.
</template>
<script>
export default {
  methods: {
    star () {
      const $star = this.$refs.star
      $star.click()
    },
    doc () {
      this.$router.push('/doc')
    }
  },
  computed: {
    keymap () {
      return {
        enter: this.star,
        space: this.doc
      }
    }
  }
}
</script>