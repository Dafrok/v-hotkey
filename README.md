# v-hotkey

[![bundlephobia minified size](https://badgen.net/bundlephobia/min/v-hotkey)](https://bundlephobia.com/result?p=v-hotkey)
[![npm package version](https://badgen.net/npm/v/v-hotkey)](https://npm.im/v-hotkey)
[![github license](https://badgen.net/github/license/dafrok/v-hotkey)](https://github.com/dafrok/v-hotkey/blob/master/LICENSE)
[![js standard style](https://badgen.net/badge/code%20style/standard/pink)](https://standardjs.com)

Vue 2.x directive for binding hotkeys to components.

## Play with me

[https://dafrok.github.io/v-hotkey](https://dafrok.github.io/v-hotkey)

## Install

```bash
$ npm i v-hotkey
# or
$ yarn add v-hotkey
```

## Usage

```javascript
import Vue from 'vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
```

```vue
<template>
  <span v-hotkey="keymap" v-show="show"> 
    Press `ctrl + esc` to toggle me! Hold `enter` to hide me!
  </span>
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
    },
    show () {
      this.show = true
    },
    hide () {
      this.show = false
    }
  },
  computed: {
    keymap () {
      return {
        // 'esc+ctrl' is OK.
        'ctrl+esc': this.toggle,
        'enter': {
          keydown: this.hide,
          keyup: this.show
        }
      }
    }
  }
}
</script>
```

## Event Handler

- keydown (as default) 
- keyup

## Key Combination

Use one or more of following keys to fire your hotkeys.

- ctrl
- alt
- shift
- command (MacOS)
- windows (Windows)

## Modifiers

### prevent

Add the prevent modifier to the directive to prevent default browser behavior.

```vue
<template>
  <span v-hotkey.prevent="keymap" v-show="show">
    Press `ctrl + esc` to toggle me! Hold `enter` to hide me!
  </span>
</template>
```

### stop

Add the stop modifier to the directive to stop event propagation.

```vue
<template>
  <div v-hotkey.stop="keymap">
    <span> Enter characters in editable areas doesn't trigger any hotkeys. </span>
    <input>
  </div>
</template>
```

## Key Code Alias

The default key code map is based on US standard keyboard.
This ability to provide their own key code alias for developers who using keyboards with different layouts. The alias name must be a **single character**.

### Definition

```javascript
import Vue from 'vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey, {
  '①': 49 // the key code of character '1'
})
```

### Template

```vue
<span v-hotkey="keymap"></span>
<script>
export default {
  foo () {
    console.log('Hooray!')
  },
  computed: {
    keymap () {
      return {
        '①': foo
      }
    }
  }
}
</script>
```
