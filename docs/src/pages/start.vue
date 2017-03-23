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
</template>

<script>
export default {
  methods: {
    start () {
      this.$router.push('/step/1')
    }
  },
  computed: {
    keymap () {
      return {
        enter: this.start
      }
    }
  }
}
</script>
