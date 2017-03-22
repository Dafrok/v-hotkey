<template lang="pug">
article.fixed(v-hotkey="keymap")
  transition(name="slide")
    router-view
</template>
<script>
export default {
  methods: {
    nextPage () {
      const currentPage = this.$route.path.split('/')[2] | 0
      const nextPage = currentPage >= 5 ? 5 : currentPage + 1
      this.$router.push(`/step/${nextPage}`)
    },
    prevPage () {
      const currentPage = this.$route.path.split('/')[2] | 0
      const prevPage = currentPage <= 1 ? 1 : currentPage - 1
      this.$router.push(`/step/${prevPage}`)
    },
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