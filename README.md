# v-hotkey

Vue 2.x directive for binding hotkeys to components.

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
  <span v-hotkey="keymap" v-show="show"> Press `ctrl + esc` to toggle me! Hold `enter` to hide me! </span>
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
- meta (windows / command)

## Modifiers

### prevent

Add the prevent modifier to the directive to prevent default browser behavior.

```vue
<template>
  <span v-hotkey.prevent="keymap" v-show="show"> Press `ctrl + esc` to toggle me! Hold `enter` to hide me! </span>
</template>
```

### stop

Add the stop modifier to the directive to stop event propagation.

```vue
<template>
  <div v-hotkey.stop="keymap">
    <span>Enter characters in editable areas doesn't trigger any hotkeys.</span>
    <input>
  </div>
</template>
```

## Key Code Alias

The default key code map is based on US standard keyboard.
This ability to provide their own key code alias for developers who using keyboards with different layouts. The alias name must be a **SINGLE CHARACTOR**.

### Definition

```javascript
import Vue from 'vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey, {
  '①': 49 // the key code of charactor '1'
})
```

### Template

```vue
<span v-hotkey="keymap"></span>
<script>
export default {
  foo () {
    console.log('Hoory!')
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