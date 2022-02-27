<template lang="pug">
section(v-hotkey="keymap")
  router-view(v-slot="{ Component }")
    transition(name="slide", mode="out-in")
      component(:is="Component")
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
    nextPage () {
      const pageCount = 7
      const currentPage = this.$route.path.split('/')[2] | 0
      const nextPage = currentPage >= pageCount ? pageCount : currentPage + 1
      this.$router.push(`/step/${nextPage}`)
    },
    prevPage () {
      const currentPage = this.$route.path.split('/')[2] | 0
      const prevPage = currentPage <= 1 ? 1 : currentPage - 1
      this.$router.push(`/step/${prevPage}`)
    },
    backHome () {
      this.$router.push('/')
    }
  }
}
</script>
