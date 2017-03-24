# v-hotkey

Vue 2.x directive - binding hotkeys for components.

## Play with me

[https://dafrok.github.io/v-hotkey](https://dafrok.github.io/v-hotkey)

## Install

```bash
$ npm i --save v-hotkey
```

## Usage

```javascript
import Vue from 'vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
```

```vue
<template>
<span v-hotkey="keymap" v-show="show"> Press `ctrl + esc` to toggle me! </span>
</template>

<script>
export default {
  data () {
    return {
      show: true
    }
  },
  methods: {
    toggle () {
      this.show = !this.show
    }
  },
  computed {
    keymap () {
      return {
        'ctrl+esc': this.toggle
      }
    }
  }
}
</script>
```