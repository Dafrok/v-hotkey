(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VHotkey = factory());
}(this, (function () { 'use strict';

var keyCode = searchInput => {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
    if (hasKeyCode) {
      searchInput = hasKeyCode;
    }
  }

  // Numbers
  if ('number' === typeof searchInput) {
    return names[searchInput]
  }

  // Everything else (cast to string)
  var search = String(searchInput);

  // check codes
  var foundNamedKey = codes[search.toLowerCase()];
  if (foundNamedKey) {
    return foundNamedKey
  }

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()];
  if (foundNamedKey) {
    return foundNamedKey
  }

  // weird character?
  if (search.length === 1) {
    return search.charCodeAt(0)
  }

  return undefined
};

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

const codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
};

// Helper aliases

const aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
};

/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) {
  codes[String.fromCharCode(i)] = i - 32;
}

// numbers
for (var i = 48; i < 58; i++) {
  codes[i - 48] = i;
}

// function keys
for (i = 1; i < 13; i++) {
  codes['f'+i] = i + 111;
}

// numpad keys
for (i = 0; i < 10; i++) {
  codes['numpad '+i] = i + 96;
}

const getKeyMap = keymap => Object.keys(keymap).map(input => {
  const result = {};
  input.split('+').forEach(keyName => {
    switch (keyName.toLowerCase()) {
      case 'ctrl':
      case 'alt':
      case 'shift':
      case 'meta':
        result[keyName] = true;
        break
      default:
        result.keyCode = keyCode(keyName);
    }
  });
  result.callback = keymap[input];
  return result
});

var index = {
  install (Vue) {
    Vue.directive('hotkey', {
      bind (el, binding, vnode, oldVnode) {
        el._keymap = getKeyMap(binding.value);
        el._keyHandler = e => {
          for (const hotkey of el._keymap) {
            hotkey.keyCode === e.keyCode
              && !!hotkey.ctrl === e.ctrlKey
              && !!hotkey.alt === e.altKey
              && !!hotkey.shift === e.shiftKey
              && !!hotkey.meta === e.metaKey
              && hotkey.callback(e);
          }
        };
        document.addEventListener('keydown', el._keyHandler);
      },
      unbind (el, binding, vnode, oldVnode) {
        document.removeEventListener('keydown', el._keyHandler);
      }
    });
  }
};

return index;

})));
