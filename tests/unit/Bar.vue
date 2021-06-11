<template>
  <div>
    <input
      id="text"
      v-hotkey="{enter: {keydown: toggle, executeInForbiddenNode: true }}"
      class="text"
      type="text"
      autofocus
    >
    <div
      v-if="visible"
      class="visible"
    >
      Enter Pressed
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  data: () => ({ visible: false }),
  methods: {
    toggle () {
      this.visible = !this.visible
    }
  }
}
</script>
