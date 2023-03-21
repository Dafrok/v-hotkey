<template>
  <div>
    <div
      v-hotkey="{ enter: show, esc: hide }"
      class="hotkey"
    >
      Toggle
    </div>
    <div
      v-if="visible"
      class="visible"
    >
      Hello hotkey
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({ visible: false }),
  methods: {
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    }
  }
}
</script>
