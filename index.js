(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueHotkey = factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var keyCode = (function (searchInput) {
    // Keyboard Events
    if (searchInput && 'object' === (typeof searchInput === 'undefined' ? 'undefined' : _typeof(searchInput))) {
      var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
      if (hasKeyCode) {
        searchInput = hasKeyCode;
      }
    }

    // Numbers
    if ('number' === typeof searchInput) {
      return names[searchInput];
    }

    // Everything else (cast to string)
    var search = String(searchInput);

    // check codes
    var foundNamedKey = codes[search.toLowerCase()];
    if (foundNamedKey) {
      return foundNamedKey;
    }

    // check aliases
    var foundNamedKey = aliases[search.toLowerCase()];
    if (foundNamedKey) {
      return foundNamedKey;
    }

    // weird character?
    if (search.length === 1) {
      return search.charCodeAt(0);
    }

    return undefined;
  });

  /**
   * Get by name
   *
   *   exports.code['enter'] // => 13
   */

  var codes = {
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

  var aliases = {
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
    codes['f' + i] = i + 111;
  }

  // numpad keys
  for (i = 0; i < 10; i++) {
    codes['numpad ' + i] = i + 96;
  }

  var getKeyMap = function getKeyMap(keymap) {
    return Object.keys(keymap).map(function (input) {
      var result = {};
      input.split('+').forEach(function (keyName) {
        switch (keyName.toLowerCase()) {
          case 'ctrl':
          case 'alt':
          case 'shift':
          case 'meta':
            result[keyName] = true;
            break;
          default:
            result.keyCode = keyCode(keyName);
        }
      });
      result.callback = keymap[input];
      return result;
    });
  };

  var index = {
    install: function install(Vue) {
      Vue.directive('hotkey', {
        bind: function bind(el, binding, vnode, oldVnode) {
          binding.keymap = getKeyMap(binding.value);
          binding.keyHandler = function (e) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = binding.keymap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var hotkey = _step.value;

                hotkey.keyCode === e.keyCode && !!hotkey.ctrl === e.ctrlKey && !!hotkey.alt === e.altKey && !!hotkey.shift === e.shiftKey && !!hotkey.meta === e.metaKey && hotkey.callback(e);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          };
          document.addEventListener('keydown', binding.keyHandler);
        },
        unbind: function unbind(el, binding, vnode, oldVnode) {
          document.removeEventListener('keydown', binding.keyHandler);
        }
      });
    }
  };

  return index;

}));