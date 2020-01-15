<template lang="pug">
article(v-hotkey="keymap")
  h1 Documentation
</template>

<script>
export default {
  computed: {
    keymap () {
      return {
        left: this.prevPage,
        right: this.nextPage,
        esc: this.backHome
      }
    }
  },
  methods: {
    backHome () {
      this.$router.push('/')
    }
  }
}
</script>
