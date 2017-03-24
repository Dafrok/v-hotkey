<template lang="pug">
article(v-hotkey="keymap")
  h1 Documentation
</template>

<script>
export default {
  methods: {
    backHome () {
      this.$router.push(`/`)
    }
  },
  computed: {
    keymap () {
      return {
        left: this.prevPage,
        right: this.nextPage,
        esc: this.backHome
      }
    }
  }
}
</script>