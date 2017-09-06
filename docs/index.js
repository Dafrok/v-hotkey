/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if (media) {
		styleElement.setAttribute("media", media);
	}

	if (sourceMap) {
		// https://developer.chrome.com/devtools/docs/javascript-debugging
		// this makes source maps inside style tags work properly in Chrome
		css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(28), __webpack_require__(29), __webpack_require__(30), __webpack_require__(31), __webpack_require__(32), __webpack_require__(27), __webpack_require__(33), __webpack_require__(26)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./pages/step-1.vue'), require('./pages/step-2.vue'), require('./pages/step-3.vue'), require('./pages/step-4.vue'), require('./pages/step-5.vue'), require('./pages/start.vue'), require('./pages/step.vue'), require('./pages/doc.vue'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.step1, global.step2, global.step3, global.step4, global.step5, global.start, global.step, global.doc);
    global.routes = mod.exports;
  }
})(this, function (module, exports, _step, _step3, _step5, _step7, _step9, _start, _step11, _doc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _step2 = _interopRequireDefault(_step);

  var _step4 = _interopRequireDefault(_step3);

  var _step6 = _interopRequireDefault(_step5);

  var _step8 = _interopRequireDefault(_step7);

  var _step10 = _interopRequireDefault(_step9);

  var _start2 = _interopRequireDefault(_start);

  var _step12 = _interopRequireDefault(_step11);

  var _doc2 = _interopRequireDefault(_doc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = [{
    path: '/',
    alias: '/start',
    component: _start2.default
  }, {
    path: '/step',
    component: _step12.default,
    children: [{
      path: '1',
      component: _step2.default
    }, {
      path: '2',
      component: _step4.default
    }, {
      path: '3',
      component: _step6.default
    }, {
      path: '4',
      component: _step8.default
    }, {
      path: '5',
      component: _step10.default
    }]
  }];
  module.exports = exports['default'];
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(18)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./keycode'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.keycode);
    global.index = mod.exports;
  }
})(this, function (module, exports, _keycode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _keycode2 = _interopRequireDefault(_keycode);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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
            result.keyCode = (0, _keycode2.default)(keyName);
        }
      });
      result.callback = keymap[input];
      return result;
    });
  };

  exports.default = {
    install: function install(Vue) {
      Vue.directive('hotkey', {
        bind: function bind(el, binding, vnode, oldVnode) {
          el._keymap = getKeyMap(binding.value);

          el._keymapHasKeyUp = el._keymap.some(function (hotkey) {
            return hotkey.callback.keyup;
          });

          el._keyHandler = function (e) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = el._keymap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var hotkey = _step.value;

                var callback = hotkey.keyCode === e.keyCode && !!hotkey.ctrl === e.ctrlKey && !!hotkey.alt === e.altKey && !!hotkey.shift === e.shiftKey && !!hotkey.meta === e.metaKey && (e.type === "keydown" ? hotkey.callback.keydown || hotkey.callback : hotkey.callback.keyup);
                if (callback) {
                  callback(e);
                }
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
          document.addEventListener('keydown', el._keyHandler);
          if (el._keymapHasKeyUp) {
            document.addEventListener('keyup', el._keyHandler);
          }
        },
        unbind: function unbind(el, binding, vnode, oldVnode) {
          document.removeEventListener('keydown', el._keyHandler);
          if (el._keymapHasKeyUp) {
            document.removeEventListener('keyup', el._keyHandler);
          }
        }
      });
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(25)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./bulma.css", function() {
			var newContent = require("!!../../css-loader/index.js!./bulma.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(46)

/* script */
__vue_exports__ = __webpack_require__(10)

/* template */
var __vue_template__ = __webpack_require__(42)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/App.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7dd95fbe", __vue_options__)
  } else {
    hotAPI.reload("data-v-7dd95fbe", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] App.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.7.0
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var normalizedPath = normalizePath(path, parent);
  var pathToRegexpOptions = route.pathToRegexpOptions || {};

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = index(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (resolvedDef.__esModule && resolvedDef.default) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      var current = this$1.current;
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  window.location.replace((base + "#" + path));
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.7.0';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * Vue.js v2.4.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefix has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (parentVal, childVal) {
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options) {
  var inject = options.inject;
  if (Array.isArray(inject)) {
    var normalized = options.inject = {};
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = inject[i];
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeInject(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (comp.__esModule && comp.default) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listensers hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data && parentVnode.data.attrs;
  vm.$listeners = listeners;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function checkOptionType (vm, name) {
  var option = vm.$options[name];
  if (!isPlainObject(option)) {
    warn(
      ("component option \"" + name + "\" should be an object."),
      vm
    );
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (isReservedAttribute(key) || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'computed');
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'methods');
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  process.env.NODE_ENV !== 'production' && checkOptionType(vm, 'watch');
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (process.env.NODE_ENV !== 'production' && !source) {
        warn(("Injection \"" + key + "\" not found"), vm);
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(ours, existing) : ours;
      }
    }
  }
  return data
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, null, true);
    defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, null, true);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
  Vue.prototype._g = bindObjectListeners;
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp, Array];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.4.2';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if (process.env.NODE_ENV !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;



function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */


/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var str;
var index$1;

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2), __webpack_require__(47)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(8), __webpack_require__(4), __webpack_require__(7), __webpack_require__(6), __webpack_require__(3), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(require('vue'), require('../../src/index.js'), require('vue-router'), require('./App.vue'), require('./routes'), require('bulma/css/bulma.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.vue, global.index, global.vueRouter, global.App, global.routes, global.bulma);
    global.main = mod.exports;
  }
})(this, function (_vue, _index, _vueRouter, _App, _routes) {
  'use strict';

  var _vue2 = _interopRequireDefault(_vue);

  var _index2 = _interopRequireDefault(_index);

  var _vueRouter2 = _interopRequireDefault(_vueRouter);

  var _App2 = _interopRequireDefault(_App);

  var _routes2 = _interopRequireDefault(_routes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _vue2.default.use(_index2.default);
  _vue2.default.use(_vueRouter2.default);

  var router = new _vueRouter2.default({ routes: _routes2.default });

  var rootNode = document.createElement('div');
  document.body.appendChild(rootNode);

  /* eslint-disable no-new */
  new _vue2.default({
    el: rootNode,
    router: router,
    render: function render(h) {
      return h(_App2.default);
    }
  });
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//
//
//
//
//
//
//
//

(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.App = mod.exports;
  }
})(this, function () {
  "use strict";
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.doc = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    methods: {
      backHome: function backHome() {
        this.$router.push("/");
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          left: this.prevPage,
          right: this.nextPage,
          esc: this.backHome
        };
      }
    }
  };
  module.exports = exports["default"];
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.start = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    methods: {
      start: function start() {
        this.$router.push('/step/1');
      },
      doc: function doc() {
        this.$refs.doc.click();
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          enter: this.start,
          space: this.doc
        };
      }
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.step2 = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    data: function data() {
      return {
        show: false
      };
    },

    methods: {
      hello: function hello() {
        var $hello = this.$refs.hello;
        $hello.classList.add('active');
        this.show = true;
      },
      goodbye: function goodbye() {
        var $hello = this.$refs.hello;
        $hello.classList.remove('active');
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          enter: {
            keydown: this.hello,
            keyup: this.goodbye
          }
        };
      }
    },
    mounted: function mounted() {
      var $hello = this.$refs.hello;
      //$hello.addEventListener('animationend', e => {$hello.classList.remove('active')})
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.step3 = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    data: function data() {
      return {
        show: false
      };
    },

    methods: {
      hello: function hello() {
        var $hello = this.$refs.hello;
        $hello.classList.add('active');
      },
      bye: function bye() {
        var $bye = this.$refs.bye;
        $bye.classList.add('active');
      },
      leave: function leave() {
        this.show = true;
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          'ctrl+enter': this.hello,
          'alt+enter': this.bye,
          'ctrl+alt+enter': this.leave
        };
      }
    },
    mounted: function mounted() {
      var $hello = this.$refs.hello;
      var $bye = this.$refs.bye;
      $hello.addEventListener('animationend', function (e) {
        $hello.classList.remove('active');
      });
      $bye.addEventListener('animationend', function (e) {
        $bye.classList.remove('active');
      });
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.step4 = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    data: function data() {
      return {
        flag: true,
        show: false
      };
    },

    watch: {
      flag: function flag(val, oldVal) {
        if (val) {
          this.show = true;
        }
      }
    },
    methods: {
      hello: function hello() {
        var $hello = this.$refs.hello;
        $hello.classList.add('active');
      },
      bye: function bye() {
        var $bye = this.$refs.bye;
        $bye.classList.add('active');
      },
      switch: function _switch(e) {
        e.preventDefault();
        this.flag = !this.flag;
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          'tab': this.switch
        };
      },
      keymapA: function keymapA() {
        return {
          'enter': this.hello
        };
      },
      keymapB: function keymapB() {
        return {
          'enter': this.bye
        };
      }
    },
    mounted: function mounted() {
      var $hello = this.$refs.hello;
      var $bye = this.$refs.bye;
      $hello.addEventListener('animationend', function (e) {
        $hello.classList.remove('active');
      });
      $bye.addEventListener('animationend', function (e) {
        $bye.classList.remove('active');
      });
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.step5 = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    methods: {
      star: function star() {
        var $star = this.$refs.star;
        $star.click();
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          enter: this.star
        };
      }
    }
  };
  module.exports = exports["default"];
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.step = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    methods: {
      nextPage: function nextPage() {
        var currentPage = this.$route.path.split('/')[2] | 0;
        var nextPage = currentPage >= 5 ? 5 : currentPage + 1;
        this.$router.push('/step/' + nextPage);
      },
      prevPage: function prevPage() {
        var currentPage = this.$route.path.split('/')[2] | 0;
        var prevPage = currentPage <= 1 ? 1 : currentPage - 1;
        this.$router.push('/step/' + prevPage);
      },
      backHome: function backHome() {
        this.$router.push('/');
      }
    },
    computed: {
      keymap: function keymap() {
        return {
          left: this.prevPage,
          right: this.nextPage,
          esc: this.backHome
        };
      }
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.keycode = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  exports.default = function (searchInput) {
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
  };

  /**
   * Get by name
   *
   *   exports.code['enter'] // => 13
   */

  var codes = exports.codes = {
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

    // Helper aliases

  };var aliases = exports.aliases = {
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

    /*!
     * Programatically add the following
     */

    // lower case chars
  };for (i = 97; i < 123; i++) {
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
});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/*! bulma.io v0.4.4 | MIT License | github.com/jgthms/bulma */\n@-webkit-keyframes spinAround {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n  }\n}\n@keyframes spinAround {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  to {\n    -webkit-transform: rotate(359deg);\n            transform: rotate(359deg);\n  }\n}\n\n/*! minireset.css v0.0.2 | MIT License | github.com/jgthms/minireset.css */\nhtml,\nbody,\np,\nol,\nul,\nli,\ndl,\ndt,\ndd,\nblockquote,\nfigure,\nfieldset,\nlegend,\ntextarea,\npre,\niframe,\nhr,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin: 0;\n  padding: 0;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%;\n  font-weight: normal;\n}\n\nul {\n  list-style: none;\n}\n\nbutton,\ninput,\nselect,\ntextarea {\n  margin: 0;\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n* {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\n\n*:before, *:after {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\n\nimg,\nembed,\nobject,\naudio,\nvideo {\n  max-width: 100%;\n}\n\niframe {\n  border: 0;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n  text-align: left;\n}\n\nhtml {\n  background-color: #fff;\n  font-size: 16px;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  min-width: 300px;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  text-rendering: optimizeLegibility;\n}\n\narticle,\naside,\nfigure,\nfooter,\nheader,\nhgroup,\nsection {\n  display: block;\n}\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font-family: BlinkMacSystemFont, -apple-system, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif;\n}\n\ncode,\npre {\n  -moz-osx-font-smoothing: auto;\n  -webkit-font-smoothing: auto;\n  font-family: monospace;\n}\n\nbody {\n  color: #4a4a4a;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n\na {\n  color: #00d1b2;\n  cursor: pointer;\n  text-decoration: none;\n  -webkit-transition: none 86ms ease-out;\n  transition: none 86ms ease-out;\n}\n\na:hover {\n  color: #363636;\n}\n\ncode {\n  background-color: whitesmoke;\n  color: #ff3860;\n  font-size: 0.8em;\n  font-weight: normal;\n  padding: 0.25em 0.5em 0.25em;\n}\n\nhr {\n  background-color: #dbdbdb;\n  border: none;\n  display: block;\n  height: 1px;\n  margin: 1.5rem 0;\n}\n\nimg {\n  height: auto;\n  max-width: 100%;\n}\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  vertical-align: baseline;\n}\n\nsmall {\n  font-size: 0.875em;\n}\n\nspan {\n  font-style: inherit;\n  font-weight: inherit;\n}\n\nstrong {\n  color: #363636;\n  font-weight: 700;\n}\n\npre {\n  background-color: whitesmoke;\n  color: #4a4a4a;\n  font-size: 0.8em;\n  white-space: pre;\n  word-wrap: normal;\n}\n\npre code {\n  -webkit-overflow-scrolling: touch;\n  background: none;\n  color: inherit;\n  display: block;\n  font-size: 1em;\n  overflow-x: auto;\n  padding: 1.25rem 1.5rem;\n}\n\ntable {\n  width: 100%;\n}\n\ntable td,\ntable th {\n  text-align: left;\n  vertical-align: top;\n}\n\ntable th {\n  color: #363636;\n}\n\n.is-block {\n  display: block;\n}\n\n@media screen and (max-width: 768px) {\n  .is-block-mobile {\n    display: block !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-block-tablet {\n    display: block !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-block-tablet-only {\n    display: block !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-block-touch {\n    display: block !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-block-desktop {\n    display: block !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-block-desktop-only {\n    display: block !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-block-widescreen {\n    display: block !important;\n  }\n}\n\n.is-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n@media screen and (max-width: 768px) {\n  .is-flex-mobile {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-flex-tablet {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-flex-tablet-only {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-flex-touch {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-flex-desktop {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-flex-desktop-only {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-flex-widescreen {\n    display: -webkit-box !important;\n    display: -ms-flexbox !important;\n    display: flex !important;\n  }\n}\n\n.is-inline {\n  display: inline;\n}\n\n@media screen and (max-width: 768px) {\n  .is-inline-mobile {\n    display: inline !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-inline-tablet {\n    display: inline !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-inline-tablet-only {\n    display: inline !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-inline-touch {\n    display: inline !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-inline-desktop {\n    display: inline !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-inline-desktop-only {\n    display: inline !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-inline-widescreen {\n    display: inline !important;\n  }\n}\n\n.is-inline-block {\n  display: inline-block;\n}\n\n@media screen and (max-width: 768px) {\n  .is-inline-block-mobile {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-inline-block-tablet {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-inline-block-tablet-only {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-inline-block-touch {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-inline-block-desktop {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-inline-block-desktop-only {\n    display: inline-block !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-inline-block-widescreen {\n    display: inline-block !important;\n  }\n}\n\n.is-inline-flex {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n}\n\n@media screen and (max-width: 768px) {\n  .is-inline-flex-mobile {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-inline-flex-tablet {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-inline-flex-tablet-only {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-inline-flex-touch {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-inline-flex-desktop {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-inline-flex-desktop-only {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-inline-flex-widescreen {\n    display: -webkit-inline-box !important;\n    display: -ms-inline-flexbox !important;\n    display: inline-flex !important;\n  }\n}\n\n.is-clearfix:after {\n  clear: both;\n  content: \" \";\n  display: table;\n}\n\n.is-pulled-left {\n  float: left !important;\n}\n\n.is-pulled-right {\n  float: right !important;\n}\n\n.is-clipped {\n  overflow: hidden !important;\n}\n\n.is-overlay {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.is-size-1 {\n  font-size: 3rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-1-mobile {\n    font-size: 3rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-1-tablet {\n    font-size: 3rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-1-touch {\n    font-size: 3rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-1-desktop {\n    font-size: 3rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-1-widescreen {\n    font-size: 3rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-1-fullhd {\n    font-size: 3rem;\n  }\n}\n\n.is-size-2 {\n  font-size: 2.5rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-2-mobile {\n    font-size: 2.5rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-2-tablet {\n    font-size: 2.5rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-2-touch {\n    font-size: 2.5rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-2-desktop {\n    font-size: 2.5rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-2-widescreen {\n    font-size: 2.5rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-2-fullhd {\n    font-size: 2.5rem;\n  }\n}\n\n.is-size-3 {\n  font-size: 2rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-3-mobile {\n    font-size: 2rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-3-tablet {\n    font-size: 2rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-3-touch {\n    font-size: 2rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-3-desktop {\n    font-size: 2rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-3-widescreen {\n    font-size: 2rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-3-fullhd {\n    font-size: 2rem;\n  }\n}\n\n.is-size-4 {\n  font-size: 1.5rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-4-mobile {\n    font-size: 1.5rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-4-tablet {\n    font-size: 1.5rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-4-touch {\n    font-size: 1.5rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-4-desktop {\n    font-size: 1.5rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-4-widescreen {\n    font-size: 1.5rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-4-fullhd {\n    font-size: 1.5rem;\n  }\n}\n\n.is-size-5 {\n  font-size: 1.25rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-5-mobile {\n    font-size: 1.25rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-5-tablet {\n    font-size: 1.25rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-5-touch {\n    font-size: 1.25rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-5-desktop {\n    font-size: 1.25rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-5-widescreen {\n    font-size: 1.25rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-5-fullhd {\n    font-size: 1.25rem;\n  }\n}\n\n.is-size-6 {\n  font-size: 1rem;\n}\n\n@media screen and (max-width: 768px) {\n  .is-size-6-mobile {\n    font-size: 1rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-size-6-tablet {\n    font-size: 1rem;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-size-6-touch {\n    font-size: 1rem;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-size-6-desktop {\n    font-size: 1rem;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-size-6-widescreen {\n    font-size: 1rem;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .is-size-6-fullhd {\n    font-size: 1rem;\n  }\n}\n\n.has-text-centered {\n  text-align: center !important;\n}\n\n.has-text-left {\n  text-align: left !important;\n}\n\n.has-text-right {\n  text-align: right !important;\n}\n\n.has-text-white {\n  color: white;\n}\n\na.has-text-white:hover, a.has-text-white:focus {\n  color: #e6e6e6;\n}\n\n.has-text-black {\n  color: #0a0a0a;\n}\n\na.has-text-black:hover, a.has-text-black:focus {\n  color: black;\n}\n\n.has-text-light {\n  color: whitesmoke;\n}\n\na.has-text-light:hover, a.has-text-light:focus {\n  color: #dbdbdb;\n}\n\n.has-text-dark {\n  color: #363636;\n}\n\na.has-text-dark:hover, a.has-text-dark:focus {\n  color: #1c1c1c;\n}\n\n.has-text-primary {\n  color: #00d1b2;\n}\n\na.has-text-primary:hover, a.has-text-primary:focus {\n  color: #009e86;\n}\n\n.has-text-info {\n  color: #3273dc;\n}\n\na.has-text-info:hover, a.has-text-info:focus {\n  color: #205bbc;\n}\n\n.has-text-success {\n  color: #23d160;\n}\n\na.has-text-success:hover, a.has-text-success:focus {\n  color: #1ca64c;\n}\n\n.has-text-warning {\n  color: #ffdd57;\n}\n\na.has-text-warning:hover, a.has-text-warning:focus {\n  color: #ffd324;\n}\n\n.has-text-danger {\n  color: #ff3860;\n}\n\na.has-text-danger:hover, a.has-text-danger:focus {\n  color: #ff0537;\n}\n\n.is-hidden {\n  display: none !important;\n}\n\n@media screen and (max-width: 768px) {\n  .is-hidden-mobile {\n    display: none !important;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .is-hidden-tablet {\n    display: none !important;\n  }\n}\n\n@media screen and (min-width: 769px) and (max-width: 1007px) {\n  .is-hidden-tablet-only {\n    display: none !important;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .is-hidden-touch {\n    display: none !important;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .is-hidden-desktop {\n    display: none !important;\n  }\n}\n\n@media screen and (min-width: 1008px) and (max-width: 1199px) {\n  .is-hidden-desktop-only {\n    display: none !important;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .is-hidden-widescreen {\n    display: none !important;\n  }\n}\n\n.is-marginless {\n  margin: 0 !important;\n}\n\n.is-paddingless {\n  padding: 0 !important;\n}\n\n.is-unselectable {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.box {\n  background-color: white;\n  border-radius: 5px;\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n  color: #4a4a4a;\n  display: block;\n  padding: 1.25rem;\n}\n\n.box:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\na.box:hover, a.box:focus {\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px #00d1b2;\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px #00d1b2;\n}\n\na.box:active {\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2), 0 0 0 1px #00d1b2;\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2), 0 0 0 1px #00d1b2;\n}\n\n.button {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: 1px solid transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1rem;\n  height: 2.25em;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  line-height: 1.5;\n  padding-bottom: calc(0.375em - 1px);\n  padding-left: calc(0.625em - 1px);\n  padding-right: calc(0.625em - 1px);\n  padding-top: calc(0.375em - 1px);\n  position: relative;\n  vertical-align: top;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  background-color: white;\n  border-color: #dbdbdb;\n  color: #363636;\n  cursor: pointer;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n  text-align: center;\n  white-space: nowrap;\n}\n\n.button:focus, .button.is-focused, .button:active, .button.is-active {\n  outline: none;\n}\n\n.button[disabled] {\n  cursor: not-allowed;\n}\n\n.button strong {\n  color: inherit;\n}\n\n.button .icon, .button .icon.is-small, .button .icon.is-medium, .button .icon.is-large {\n  height: 1.5em;\n  width: 1.5em;\n}\n\n.button .icon:first-child:not(:last-child) {\n  margin-left: calc(-0.375em - 1px);\n  margin-right: 0.1875em;\n}\n\n.button .icon:last-child:not(:first-child) {\n  margin-left: 0.1875em;\n  margin-right: calc(-0.375em - 1px);\n}\n\n.button .icon:first-child:last-child {\n  margin-left: calc(-0.375em - 1px);\n  margin-right: calc(-0.375em - 1px);\n}\n\n.button:hover, .button.is-hovered {\n  border-color: #b5b5b5;\n  color: #363636;\n}\n\n.button:focus, .button.is-focused {\n  border-color: #00d1b2;\n  -webkit-box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25);\n          box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25);\n  color: #363636;\n}\n\n.button:active, .button.is-active {\n  border-color: #4a4a4a;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #363636;\n}\n\n.button.is-link {\n  background-color: transparent;\n  border-color: transparent;\n  color: #4a4a4a;\n  text-decoration: underline;\n}\n\n.button.is-link:hover, .button.is-link.is-hovered, .button.is-link:focus, .button.is-link.is-focused, .button.is-link:active, .button.is-link.is-active {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.button.is-link[disabled] {\n  background-color: transparent;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-white {\n  background-color: white;\n  border-color: transparent;\n  color: #0a0a0a;\n}\n\n.button.is-white:hover, .button.is-white.is-hovered {\n  background-color: #f9f9f9;\n  border-color: transparent;\n  color: #0a0a0a;\n}\n\n.button.is-white:focus, .button.is-white.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(255, 255, 255, 0.25);\n          box-shadow: 0 0 0.5em rgba(255, 255, 255, 0.25);\n  color: #0a0a0a;\n}\n\n.button.is-white:active, .button.is-white.is-active {\n  background-color: #f2f2f2;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #0a0a0a;\n}\n\n.button.is-white[disabled] {\n  background-color: white;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-white.is-inverted {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.button.is-white.is-inverted:hover {\n  background-color: black;\n}\n\n.button.is-white.is-inverted[disabled] {\n  background-color: #0a0a0a;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: white;\n}\n\n.button.is-white.is-loading:after {\n  border-color: transparent transparent #0a0a0a #0a0a0a !important;\n}\n\n.button.is-white.is-outlined {\n  background-color: transparent;\n  border-color: white;\n  color: white;\n}\n\n.button.is-white.is-outlined:hover, .button.is-white.is-outlined:focus {\n  background-color: white;\n  border-color: white;\n  color: #0a0a0a;\n}\n\n.button.is-white.is-outlined.is-loading:after {\n  border-color: transparent transparent white white !important;\n}\n\n.button.is-white.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: white;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: white;\n}\n\n.button.is-white.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #0a0a0a;\n  color: #0a0a0a;\n}\n\n.button.is-white.is-inverted.is-outlined:hover, .button.is-white.is-inverted.is-outlined:focus {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.button.is-white.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #0a0a0a;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #0a0a0a;\n}\n\n.button.is-black {\n  background-color: #0a0a0a;\n  border-color: transparent;\n  color: white;\n}\n\n.button.is-black:hover, .button.is-black.is-hovered {\n  background-color: #040404;\n  border-color: transparent;\n  color: white;\n}\n\n.button.is-black:focus, .button.is-black.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(10, 10, 10, 0.25);\n          box-shadow: 0 0 0.5em rgba(10, 10, 10, 0.25);\n  color: white;\n}\n\n.button.is-black:active, .button.is-black.is-active {\n  background-color: black;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: white;\n}\n\n.button.is-black[disabled] {\n  background-color: #0a0a0a;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-black.is-inverted {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.button.is-black.is-inverted:hover {\n  background-color: #f2f2f2;\n}\n\n.button.is-black.is-inverted[disabled] {\n  background-color: white;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #0a0a0a;\n}\n\n.button.is-black.is-loading:after {\n  border-color: transparent transparent white white !important;\n}\n\n.button.is-black.is-outlined {\n  background-color: transparent;\n  border-color: #0a0a0a;\n  color: #0a0a0a;\n}\n\n.button.is-black.is-outlined:hover, .button.is-black.is-outlined:focus {\n  background-color: #0a0a0a;\n  border-color: #0a0a0a;\n  color: white;\n}\n\n.button.is-black.is-outlined.is-loading:after {\n  border-color: transparent transparent #0a0a0a #0a0a0a !important;\n}\n\n.button.is-black.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #0a0a0a;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #0a0a0a;\n}\n\n.button.is-black.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: white;\n  color: white;\n}\n\n.button.is-black.is-inverted.is-outlined:hover, .button.is-black.is-inverted.is-outlined:focus {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.button.is-black.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: white;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: white;\n}\n\n.button.is-light {\n  background-color: whitesmoke;\n  border-color: transparent;\n  color: #363636;\n}\n\n.button.is-light:hover, .button.is-light.is-hovered {\n  background-color: #eeeeee;\n  border-color: transparent;\n  color: #363636;\n}\n\n.button.is-light:focus, .button.is-light.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(245, 245, 245, 0.25);\n          box-shadow: 0 0 0.5em rgba(245, 245, 245, 0.25);\n  color: #363636;\n}\n\n.button.is-light:active, .button.is-light.is-active {\n  background-color: #e8e8e8;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #363636;\n}\n\n.button.is-light[disabled] {\n  background-color: whitesmoke;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-light.is-inverted {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.button.is-light.is-inverted:hover {\n  background-color: #292929;\n}\n\n.button.is-light.is-inverted[disabled] {\n  background-color: #363636;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: whitesmoke;\n}\n\n.button.is-light.is-loading:after {\n  border-color: transparent transparent #363636 #363636 !important;\n}\n\n.button.is-light.is-outlined {\n  background-color: transparent;\n  border-color: whitesmoke;\n  color: whitesmoke;\n}\n\n.button.is-light.is-outlined:hover, .button.is-light.is-outlined:focus {\n  background-color: whitesmoke;\n  border-color: whitesmoke;\n  color: #363636;\n}\n\n.button.is-light.is-outlined.is-loading:after {\n  border-color: transparent transparent whitesmoke whitesmoke !important;\n}\n\n.button.is-light.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: whitesmoke;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: whitesmoke;\n}\n\n.button.is-light.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #363636;\n  color: #363636;\n}\n\n.button.is-light.is-inverted.is-outlined:hover, .button.is-light.is-inverted.is-outlined:focus {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.button.is-light.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #363636;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #363636;\n}\n\n.button.is-dark {\n  background-color: #363636;\n  border-color: transparent;\n  color: whitesmoke;\n}\n\n.button.is-dark:hover, .button.is-dark.is-hovered {\n  background-color: #2f2f2f;\n  border-color: transparent;\n  color: whitesmoke;\n}\n\n.button.is-dark:focus, .button.is-dark.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(54, 54, 54, 0.25);\n          box-shadow: 0 0 0.5em rgba(54, 54, 54, 0.25);\n  color: whitesmoke;\n}\n\n.button.is-dark:active, .button.is-dark.is-active {\n  background-color: #292929;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: whitesmoke;\n}\n\n.button.is-dark[disabled] {\n  background-color: #363636;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-dark.is-inverted {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.button.is-dark.is-inverted:hover {\n  background-color: #e8e8e8;\n}\n\n.button.is-dark.is-inverted[disabled] {\n  background-color: whitesmoke;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #363636;\n}\n\n.button.is-dark.is-loading:after {\n  border-color: transparent transparent whitesmoke whitesmoke !important;\n}\n\n.button.is-dark.is-outlined {\n  background-color: transparent;\n  border-color: #363636;\n  color: #363636;\n}\n\n.button.is-dark.is-outlined:hover, .button.is-dark.is-outlined:focus {\n  background-color: #363636;\n  border-color: #363636;\n  color: whitesmoke;\n}\n\n.button.is-dark.is-outlined.is-loading:after {\n  border-color: transparent transparent #363636 #363636 !important;\n}\n\n.button.is-dark.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #363636;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #363636;\n}\n\n.button.is-dark.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: whitesmoke;\n  color: whitesmoke;\n}\n\n.button.is-dark.is-inverted.is-outlined:hover, .button.is-dark.is-inverted.is-outlined:focus {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.button.is-dark.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: whitesmoke;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: whitesmoke;\n}\n\n.button.is-primary {\n  background-color: #00d1b2;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-primary:hover, .button.is-primary.is-hovered {\n  background-color: #00c4a7;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-primary:focus, .button.is-primary.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25);\n          box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25);\n  color: #fff;\n}\n\n.button.is-primary:active, .button.is-primary.is-active {\n  background-color: #00b89c;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #fff;\n}\n\n.button.is-primary[disabled] {\n  background-color: #00d1b2;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-primary.is-inverted {\n  background-color: #fff;\n  color: #00d1b2;\n}\n\n.button.is-primary.is-inverted:hover {\n  background-color: #f2f2f2;\n}\n\n.button.is-primary.is-inverted[disabled] {\n  background-color: #fff;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #00d1b2;\n}\n\n.button.is-primary.is-loading:after {\n  border-color: transparent transparent #fff #fff !important;\n}\n\n.button.is-primary.is-outlined {\n  background-color: transparent;\n  border-color: #00d1b2;\n  color: #00d1b2;\n}\n\n.button.is-primary.is-outlined:hover, .button.is-primary.is-outlined:focus {\n  background-color: #00d1b2;\n  border-color: #00d1b2;\n  color: #fff;\n}\n\n.button.is-primary.is-outlined.is-loading:after {\n  border-color: transparent transparent #00d1b2 #00d1b2 !important;\n}\n\n.button.is-primary.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #00d1b2;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #00d1b2;\n}\n\n.button.is-primary.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n\n.button.is-primary.is-inverted.is-outlined:hover, .button.is-primary.is-inverted.is-outlined:focus {\n  background-color: #fff;\n  color: #00d1b2;\n}\n\n.button.is-primary.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #fff;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #fff;\n}\n\n.button.is-info {\n  background-color: #3273dc;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-info:hover, .button.is-info.is-hovered {\n  background-color: #276cda;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-info:focus, .button.is-info.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(50, 115, 220, 0.25);\n          box-shadow: 0 0 0.5em rgba(50, 115, 220, 0.25);\n  color: #fff;\n}\n\n.button.is-info:active, .button.is-info.is-active {\n  background-color: #2366d1;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #fff;\n}\n\n.button.is-info[disabled] {\n  background-color: #3273dc;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-info.is-inverted {\n  background-color: #fff;\n  color: #3273dc;\n}\n\n.button.is-info.is-inverted:hover {\n  background-color: #f2f2f2;\n}\n\n.button.is-info.is-inverted[disabled] {\n  background-color: #fff;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #3273dc;\n}\n\n.button.is-info.is-loading:after {\n  border-color: transparent transparent #fff #fff !important;\n}\n\n.button.is-info.is-outlined {\n  background-color: transparent;\n  border-color: #3273dc;\n  color: #3273dc;\n}\n\n.button.is-info.is-outlined:hover, .button.is-info.is-outlined:focus {\n  background-color: #3273dc;\n  border-color: #3273dc;\n  color: #fff;\n}\n\n.button.is-info.is-outlined.is-loading:after {\n  border-color: transparent transparent #3273dc #3273dc !important;\n}\n\n.button.is-info.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #3273dc;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #3273dc;\n}\n\n.button.is-info.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n\n.button.is-info.is-inverted.is-outlined:hover, .button.is-info.is-inverted.is-outlined:focus {\n  background-color: #fff;\n  color: #3273dc;\n}\n\n.button.is-info.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #fff;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #fff;\n}\n\n.button.is-success {\n  background-color: #23d160;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-success:hover, .button.is-success.is-hovered {\n  background-color: #22c65b;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-success:focus, .button.is-success.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(35, 209, 96, 0.25);\n          box-shadow: 0 0 0.5em rgba(35, 209, 96, 0.25);\n  color: #fff;\n}\n\n.button.is-success:active, .button.is-success.is-active {\n  background-color: #20bc56;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #fff;\n}\n\n.button.is-success[disabled] {\n  background-color: #23d160;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-success.is-inverted {\n  background-color: #fff;\n  color: #23d160;\n}\n\n.button.is-success.is-inverted:hover {\n  background-color: #f2f2f2;\n}\n\n.button.is-success.is-inverted[disabled] {\n  background-color: #fff;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #23d160;\n}\n\n.button.is-success.is-loading:after {\n  border-color: transparent transparent #fff #fff !important;\n}\n\n.button.is-success.is-outlined {\n  background-color: transparent;\n  border-color: #23d160;\n  color: #23d160;\n}\n\n.button.is-success.is-outlined:hover, .button.is-success.is-outlined:focus {\n  background-color: #23d160;\n  border-color: #23d160;\n  color: #fff;\n}\n\n.button.is-success.is-outlined.is-loading:after {\n  border-color: transparent transparent #23d160 #23d160 !important;\n}\n\n.button.is-success.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #23d160;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #23d160;\n}\n\n.button.is-success.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n\n.button.is-success.is-inverted.is-outlined:hover, .button.is-success.is-inverted.is-outlined:focus {\n  background-color: #fff;\n  color: #23d160;\n}\n\n.button.is-success.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #fff;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #fff;\n}\n\n.button.is-warning {\n  background-color: #ffdd57;\n  border-color: transparent;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning:hover, .button.is-warning.is-hovered {\n  background-color: #ffdb4a;\n  border-color: transparent;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning:focus, .button.is-warning.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(255, 221, 87, 0.25);\n          box-shadow: 0 0 0.5em rgba(255, 221, 87, 0.25);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning:active, .button.is-warning.is-active {\n  background-color: #ffd83d;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning[disabled] {\n  background-color: #ffdd57;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-warning.is-inverted {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #ffdd57;\n}\n\n.button.is-warning.is-inverted:hover {\n  background-color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning.is-inverted[disabled] {\n  background-color: rgba(0, 0, 0, 0.7);\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #ffdd57;\n}\n\n.button.is-warning.is-loading:after {\n  border-color: transparent transparent rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7) !important;\n}\n\n.button.is-warning.is-outlined {\n  background-color: transparent;\n  border-color: #ffdd57;\n  color: #ffdd57;\n}\n\n.button.is-warning.is-outlined:hover, .button.is-warning.is-outlined:focus {\n  background-color: #ffdd57;\n  border-color: #ffdd57;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning.is-outlined.is-loading:after {\n  border-color: transparent transparent #ffdd57 #ffdd57 !important;\n}\n\n.button.is-warning.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #ffdd57;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #ffdd57;\n}\n\n.button.is-warning.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.7);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-warning.is-inverted.is-outlined:hover, .button.is-warning.is-inverted.is-outlined:focus {\n  background-color: rgba(0, 0, 0, 0.7);\n  color: #ffdd57;\n}\n\n.button.is-warning.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.7);\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.button.is-danger {\n  background-color: #ff3860;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-danger:hover, .button.is-danger.is-hovered {\n  background-color: #ff2b56;\n  border-color: transparent;\n  color: #fff;\n}\n\n.button.is-danger:focus, .button.is-danger.is-focused {\n  border-color: transparent;\n  -webkit-box-shadow: 0 0 0.5em rgba(255, 56, 96, 0.25);\n          box-shadow: 0 0 0.5em rgba(255, 56, 96, 0.25);\n  color: #fff;\n}\n\n.button.is-danger:active, .button.is-danger.is-active {\n  background-color: #ff1f4b;\n  border-color: transparent;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n  color: #fff;\n}\n\n.button.is-danger[disabled] {\n  background-color: #ff3860;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.button.is-danger.is-inverted {\n  background-color: #fff;\n  color: #ff3860;\n}\n\n.button.is-danger.is-inverted:hover {\n  background-color: #f2f2f2;\n}\n\n.button.is-danger.is-inverted[disabled] {\n  background-color: #fff;\n  border-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #ff3860;\n}\n\n.button.is-danger.is-loading:after {\n  border-color: transparent transparent #fff #fff !important;\n}\n\n.button.is-danger.is-outlined {\n  background-color: transparent;\n  border-color: #ff3860;\n  color: #ff3860;\n}\n\n.button.is-danger.is-outlined:hover, .button.is-danger.is-outlined:focus {\n  background-color: #ff3860;\n  border-color: #ff3860;\n  color: #fff;\n}\n\n.button.is-danger.is-outlined.is-loading:after {\n  border-color: transparent transparent #ff3860 #ff3860 !important;\n}\n\n.button.is-danger.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #ff3860;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #ff3860;\n}\n\n.button.is-danger.is-inverted.is-outlined {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n\n.button.is-danger.is-inverted.is-outlined:hover, .button.is-danger.is-inverted.is-outlined:focus {\n  background-color: #fff;\n  color: #ff3860;\n}\n\n.button.is-danger.is-inverted.is-outlined[disabled] {\n  background-color: transparent;\n  border-color: #fff;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #fff;\n}\n\n.button.is-small {\n  border-radius: 2px;\n  font-size: 0.75rem;\n}\n\n.button.is-medium {\n  font-size: 1.25rem;\n}\n\n.button.is-large {\n  font-size: 1.5rem;\n}\n\n.button[disabled] {\n  background-color: white;\n  border-color: #dbdbdb;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  opacity: 0.5;\n}\n\n.button.is-fullwidth {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n}\n\n.button.is-loading {\n  color: transparent !important;\n  pointer-events: none;\n}\n\n.button.is-loading:after {\n  -webkit-animation: spinAround 500ms infinite linear;\n          animation: spinAround 500ms infinite linear;\n  border: 2px solid #dbdbdb;\n  border-radius: 290486px;\n  border-right-color: transparent;\n  border-top-color: transparent;\n  content: \"\";\n  display: block;\n  height: 1em;\n  position: relative;\n  width: 1em;\n  position: absolute;\n  left: calc(50% - (1em / 2));\n  top: calc(50% - (1em / 2));\n  position: absolute !important;\n}\n\n.button.is-static {\n  background-color: whitesmoke;\n  border-color: #dbdbdb;\n  color: #7a7a7a;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  pointer-events: none;\n}\n\nbutton.button,\ninput[type=\"submit\"].button {\n  line-height: 1;\n  padding-bottom: 0.4em;\n  padding-top: 0.35em;\n}\n\n.content:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.content li + li {\n  margin-top: 0.25em;\n}\n\n.content p:not(:last-child),\n.content dl:not(:last-child),\n.content ol:not(:last-child),\n.content ul:not(:last-child),\n.content blockquote:not(:last-child),\n.content pre:not(:last-child),\n.content table:not(:last-child) {\n  margin-bottom: 1em;\n}\n\n.content h1,\n.content h2,\n.content h3,\n.content h4,\n.content h5,\n.content h6 {\n  color: #363636;\n  font-weight: 400;\n  line-height: 1.125;\n}\n\n.content h1 {\n  font-size: 2em;\n  margin-bottom: 0.5em;\n}\n\n.content h1:not(:first-child) {\n  margin-top: 1em;\n}\n\n.content h2 {\n  font-size: 1.75em;\n  margin-bottom: 0.5714em;\n}\n\n.content h2:not(:first-child) {\n  margin-top: 1.1428em;\n}\n\n.content h3 {\n  font-size: 1.5em;\n  margin-bottom: 0.6666em;\n}\n\n.content h3:not(:first-child) {\n  margin-top: 1.3333em;\n}\n\n.content h4 {\n  font-size: 1.25em;\n  margin-bottom: 0.8em;\n}\n\n.content h5 {\n  font-size: 1.125em;\n  margin-bottom: 0.8888em;\n}\n\n.content h6 {\n  font-size: 1em;\n  margin-bottom: 1em;\n}\n\n.content blockquote {\n  background-color: whitesmoke;\n  border-left: 5px solid #dbdbdb;\n  padding: 1.25em 1.5em;\n}\n\n.content ol {\n  list-style: decimal outside;\n  margin-left: 2em;\n  margin-top: 1em;\n}\n\n.content ul {\n  list-style: disc outside;\n  margin-left: 2em;\n  margin-top: 1em;\n}\n\n.content ul ul {\n  list-style-type: circle;\n  margin-top: 0.5em;\n}\n\n.content ul ul ul {\n  list-style-type: square;\n}\n\n.content dd {\n  margin-left: 2em;\n}\n\n.content figure {\n  text-align: center;\n}\n\n.content figure img {\n  display: inline-block;\n}\n\n.content figure figcaption {\n  font-style: italic;\n}\n\n.content pre {\n  -webkit-overflow-scrolling: touch;\n  overflow-x: auto;\n  padding: 1.25em 1.5em;\n  white-space: pre;\n  word-wrap: normal;\n}\n\n.content sup,\n.content sub {\n  font-size: 70%;\n}\n\n.content table {\n  width: 100%;\n}\n\n.content table td,\n.content table th {\n  border: 1px solid #dbdbdb;\n  border-width: 0 0 1px;\n  padding: 0.5em 0.75em;\n  vertical-align: top;\n}\n\n.content table th {\n  color: #363636;\n  text-align: left;\n}\n\n.content table tr:hover {\n  background-color: whitesmoke;\n}\n\n.content table thead td,\n.content table thead th {\n  border-width: 0 0 2px;\n  color: #363636;\n}\n\n.content table tfoot td,\n.content table tfoot th {\n  border-width: 2px 0 0;\n  color: #363636;\n}\n\n.content table tbody tr:last-child td,\n.content table tbody tr:last-child th {\n  border-bottom-width: 0;\n}\n\n.content.is-small {\n  font-size: 0.75rem;\n}\n\n.content.is-medium {\n  font-size: 1.25rem;\n}\n\n.content.is-large {\n  font-size: 1.5rem;\n}\n\n.input,\n.textarea {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: 1px solid transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1rem;\n  height: 2.25em;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  line-height: 1.5;\n  padding-bottom: calc(0.375em - 1px);\n  padding-left: calc(0.625em - 1px);\n  padding-right: calc(0.625em - 1px);\n  padding-top: calc(0.375em - 1px);\n  position: relative;\n  vertical-align: top;\n  background-color: white;\n  border-color: #dbdbdb;\n  color: #363636;\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);\n  max-width: 100%;\n  width: 100%;\n}\n\n.input:focus, .input.is-focused, .input:active, .input.is-active,\n.textarea:focus,\n.textarea.is-focused,\n.textarea:active,\n.textarea.is-active {\n  outline: none;\n}\n\n.input[disabled],\n.textarea[disabled] {\n  cursor: not-allowed;\n}\n\n.input:hover, .input.is-hovered,\n.textarea:hover,\n.textarea.is-hovered {\n  border-color: #b5b5b5;\n}\n\n.input:focus, .input.is-focused, .input:active, .input.is-active,\n.textarea:focus,\n.textarea.is-focused,\n.textarea:active,\n.textarea.is-active {\n  border-color: #00d1b2;\n}\n\n.input[disabled],\n.textarea[disabled] {\n  background-color: whitesmoke;\n  border-color: whitesmoke;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #7a7a7a;\n}\n\n.input[disabled]::-moz-placeholder,\n.textarea[disabled]::-moz-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.input[disabled]::-webkit-input-placeholder,\n.textarea[disabled]::-webkit-input-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.input[disabled]:-moz-placeholder,\n.textarea[disabled]:-moz-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.input[disabled]:-ms-input-placeholder,\n.textarea[disabled]:-ms-input-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.input[type=\"search\"],\n.textarea[type=\"search\"] {\n  border-radius: 290486px;\n}\n\n.input.is-white,\n.textarea.is-white {\n  border-color: white;\n}\n\n.input.is-black,\n.textarea.is-black {\n  border-color: #0a0a0a;\n}\n\n.input.is-light,\n.textarea.is-light {\n  border-color: whitesmoke;\n}\n\n.input.is-dark,\n.textarea.is-dark {\n  border-color: #363636;\n}\n\n.input.is-primary,\n.textarea.is-primary {\n  border-color: #00d1b2;\n}\n\n.input.is-info,\n.textarea.is-info {\n  border-color: #3273dc;\n}\n\n.input.is-success,\n.textarea.is-success {\n  border-color: #23d160;\n}\n\n.input.is-warning,\n.textarea.is-warning {\n  border-color: #ffdd57;\n}\n\n.input.is-danger,\n.textarea.is-danger {\n  border-color: #ff3860;\n}\n\n.input.is-small,\n.textarea.is-small {\n  border-radius: 2px;\n  font-size: 0.75rem;\n}\n\n.input.is-medium,\n.textarea.is-medium {\n  font-size: 1.25rem;\n}\n\n.input.is-large,\n.textarea.is-large {\n  font-size: 1.5rem;\n}\n\n.input.is-fullwidth,\n.textarea.is-fullwidth {\n  display: block;\n  width: 100%;\n}\n\n.input.is-inline,\n.textarea.is-inline {\n  display: inline;\n  width: auto;\n}\n\n.textarea {\n  display: block;\n  max-width: 100%;\n  min-width: 100%;\n  padding: 0.625em;\n  resize: vertical;\n}\n\n.textarea:not([rows]) {\n  max-height: 600px;\n  min-height: 120px;\n}\n\n.textarea[rows] {\n  height: unset;\n}\n\n.checkbox,\n.radio {\n  cursor: pointer;\n  display: inline-block;\n  line-height: 1.25;\n  position: relative;\n}\n\n.checkbox input,\n.radio input {\n  cursor: pointer;\n}\n\n.checkbox:hover,\n.radio:hover {\n  color: #363636;\n}\n\n.checkbox[disabled],\n.radio[disabled] {\n  color: #7a7a7a;\n  cursor: not-allowed;\n}\n\n.radio + .radio {\n  margin-left: 0.5em;\n}\n\n.select {\n  display: inline-block;\n  max-width: 100%;\n  position: relative;\n  vertical-align: top;\n}\n\n.select:not(.is-multiple) {\n  height: 2.25em;\n}\n\n.select:not(.is-multiple)::after {\n  border: 1px solid #00d1b2;\n  border-right: 0;\n  border-top: 0;\n  content: \" \";\n  display: block;\n  height: 0.5em;\n  pointer-events: none;\n  position: absolute;\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n  width: 0.5em;\n  margin-top: -0.375em;\n  right: 1.125em;\n  top: 50%;\n  z-index: 4;\n}\n\n.select select {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: 1px solid transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1rem;\n  height: 2.25em;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  line-height: 1.5;\n  padding-bottom: calc(0.375em - 1px);\n  padding-left: calc(0.625em - 1px);\n  padding-right: calc(0.625em - 1px);\n  padding-top: calc(0.375em - 1px);\n  position: relative;\n  vertical-align: top;\n  background-color: white;\n  border-color: #dbdbdb;\n  color: #363636;\n  cursor: pointer;\n  display: block;\n  font-size: 1em;\n  max-width: 100%;\n  outline: none;\n}\n\n.select select:focus, .select select.is-focused, .select select:active, .select select.is-active {\n  outline: none;\n}\n\n.select select[disabled] {\n  cursor: not-allowed;\n}\n\n.select select:hover, .select select.is-hovered {\n  border-color: #b5b5b5;\n}\n\n.select select:focus, .select select.is-focused, .select select:active, .select select.is-active {\n  border-color: #00d1b2;\n}\n\n.select select[disabled] {\n  background-color: whitesmoke;\n  border-color: whitesmoke;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #7a7a7a;\n}\n\n.select select[disabled]::-moz-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.select select[disabled]::-webkit-input-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.select select[disabled]:-moz-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.select select[disabled]:-ms-input-placeholder {\n  color: rgba(54, 54, 54, 0.3);\n}\n\n.select select:hover {\n  border-color: #b5b5b5;\n}\n\n.select select:focus, .select select.is-focused, .select select:active, .select select.is-active {\n  border-color: #00d1b2;\n}\n\n.select select::-ms-expand {\n  display: none;\n}\n\n.select select[disabled]:hover {\n  border-color: whitesmoke;\n}\n\n.select select:not([multiple]) {\n  padding-right: 2.5em;\n}\n\n.select select[multiple] {\n  height: unset;\n  padding: 0;\n}\n\n.select select[multiple] option {\n  padding: 0.5em 1em;\n}\n\n.select:hover::after {\n  border-color: #363636;\n}\n\n.select.is-white select {\n  border-color: white;\n}\n\n.select.is-black select {\n  border-color: #0a0a0a;\n}\n\n.select.is-light select {\n  border-color: whitesmoke;\n}\n\n.select.is-dark select {\n  border-color: #363636;\n}\n\n.select.is-primary select {\n  border-color: #00d1b2;\n}\n\n.select.is-info select {\n  border-color: #3273dc;\n}\n\n.select.is-success select {\n  border-color: #23d160;\n}\n\n.select.is-warning select {\n  border-color: #ffdd57;\n}\n\n.select.is-danger select {\n  border-color: #ff3860;\n}\n\n.select.is-small {\n  border-radius: 2px;\n  font-size: 0.75rem;\n}\n\n.select.is-medium {\n  font-size: 1.25rem;\n}\n\n.select.is-large {\n  font-size: 1.5rem;\n}\n\n.select.is-disabled::after {\n  border-color: #7a7a7a;\n}\n\n.select.is-fullwidth {\n  width: 100%;\n}\n\n.select.is-fullwidth select {\n  width: 100%;\n}\n\n.select.is-loading::after {\n  -webkit-animation: spinAround 500ms infinite linear;\n          animation: spinAround 500ms infinite linear;\n  border: 2px solid #dbdbdb;\n  border-radius: 290486px;\n  border-right-color: transparent;\n  border-top-color: transparent;\n  content: \"\";\n  display: block;\n  height: 1em;\n  position: relative;\n  width: 1em;\n  margin-top: 0;\n  position: absolute;\n  right: 0.625em;\n  top: 0.625em;\n  -webkit-transform: none;\n          transform: none;\n}\n\n.select.is-loading.is-small:after {\n  font-size: 0.75rem;\n}\n\n.select.is-loading.is-medium:after {\n  font-size: 1.25rem;\n}\n\n.select.is-loading.is-large:after {\n  font-size: 1.5rem;\n}\n\n.label {\n  color: #363636;\n  display: block;\n  font-size: 1rem;\n  font-weight: 700;\n}\n\n.label:not(:last-child) {\n  margin-bottom: 0.5em;\n}\n\n.label.is-small {\n  font-size: 0.75rem;\n}\n\n.label.is-medium {\n  font-size: 1.25rem;\n}\n\n.label.is-large {\n  font-size: 1.5rem;\n}\n\n.help {\n  display: block;\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n\n.help.is-white {\n  color: white;\n}\n\n.help.is-black {\n  color: #0a0a0a;\n}\n\n.help.is-light {\n  color: whitesmoke;\n}\n\n.help.is-dark {\n  color: #363636;\n}\n\n.help.is-primary {\n  color: #00d1b2;\n}\n\n.help.is-info {\n  color: #3273dc;\n}\n\n.help.is-success {\n  color: #23d160;\n}\n\n.help.is-warning {\n  color: #ffdd57;\n}\n\n.help.is-danger {\n  color: #ff3860;\n}\n\n.field:not(:last-child) {\n  margin-bottom: 0.75rem;\n}\n\n.field.has-addons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n.field.has-addons .control:not(:last-child) {\n  margin-right: -1px;\n}\n\n.field.has-addons .control:first-child .button,\n.field.has-addons .control:first-child .input,\n.field.has-addons .control:first-child .select select {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px;\n}\n\n.field.has-addons .control:last-child .button,\n.field.has-addons .control:last-child .input,\n.field.has-addons .control:last-child .select select {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px;\n}\n\n.field.has-addons .control .button,\n.field.has-addons .control .input,\n.field.has-addons .control .select select {\n  border-radius: 0;\n}\n\n.field.has-addons .control .button:hover, .field.has-addons .control .button.is-hovered,\n.field.has-addons .control .input:hover,\n.field.has-addons .control .input.is-hovered,\n.field.has-addons .control .select select:hover,\n.field.has-addons .control .select select.is-hovered {\n  z-index: 2;\n}\n\n.field.has-addons .control .button:focus, .field.has-addons .control .button.is-focused, .field.has-addons .control .button:active, .field.has-addons .control .button.is-active,\n.field.has-addons .control .input:focus,\n.field.has-addons .control .input.is-focused,\n.field.has-addons .control .input:active,\n.field.has-addons .control .input.is-active,\n.field.has-addons .control .select select:focus,\n.field.has-addons .control .select select.is-focused,\n.field.has-addons .control .select select:active,\n.field.has-addons .control .select select.is-active {\n  z-index: 3;\n}\n\n.field.has-addons .control .button:focus:hover, .field.has-addons .control .button.is-focused:hover, .field.has-addons .control .button:active:hover, .field.has-addons .control .button.is-active:hover,\n.field.has-addons .control .input:focus:hover,\n.field.has-addons .control .input.is-focused:hover,\n.field.has-addons .control .input:active:hover,\n.field.has-addons .control .input.is-active:hover,\n.field.has-addons .control .select select:focus:hover,\n.field.has-addons .control .select select.is-focused:hover,\n.field.has-addons .control .select select:active:hover,\n.field.has-addons .control .select select.is-active:hover {\n  z-index: 4;\n}\n\n.field.has-addons .control.is-expanded {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n.field.has-addons.has-addons-centered {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.field.has-addons.has-addons-right {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.field.has-addons.has-addons-fullwidth .control {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.field.is-grouped {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n.field.is-grouped > .control {\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.field.is-grouped > .control:not(:last-child) {\n  margin-bottom: 0;\n  margin-right: 0.75rem;\n}\n\n.field.is-grouped > .control.is-expanded {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n\n.field.is-grouped.is-grouped-centered {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.field.is-grouped.is-grouped-right {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n@media screen and (min-width: 769px), print {\n  .field.is-horizontal {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n.field-label .label {\n  font-size: inherit;\n}\n\n@media screen and (max-width: 768px) {\n  .field-label {\n    margin-bottom: 0.5rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .field-label {\n    -ms-flex-preferred-size: 0;\n        flex-basis: 0;\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n    margin-right: 1.5rem;\n    text-align: right;\n  }\n  .field-label.is-small {\n    font-size: 0.75rem;\n    padding-top: 0.375em;\n  }\n  .field-label.is-normal {\n    padding-top: 0.375em;\n  }\n  .field-label.is-medium {\n    font-size: 1.25rem;\n    padding-top: 0.375em;\n  }\n  .field-label.is-large {\n    font-size: 1.5rem;\n    padding-top: 0.375em;\n  }\n}\n\n.field-body .field .field {\n  margin-bottom: 0;\n}\n\n@media screen and (min-width: 769px), print {\n  .field-body {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-preferred-size: 0;\n        flex-basis: 0;\n    -webkit-box-flex: 5;\n        -ms-flex-positive: 5;\n            flex-grow: 5;\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n  }\n  .field-body .field {\n    margin-bottom: 0;\n  }\n  .field-body > .field {\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n  }\n  .field-body > .field:not(.is-narrow) {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n  }\n  .field-body > .field:not(:last-child) {\n    margin-right: 0.75rem;\n  }\n}\n\n.control {\n  font-size: 1rem;\n  position: relative;\n  text-align: left;\n}\n\n.control.has-icon .icon {\n  color: #dbdbdb;\n  height: 2.25em;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  width: 2.25em;\n  z-index: 4;\n}\n\n.control.has-icon .input:focus + .icon {\n  color: #7a7a7a;\n}\n\n.control.has-icon .input.is-small + .icon {\n  font-size: 0.75rem;\n}\n\n.control.has-icon .input.is-medium + .icon {\n  font-size: 1.25rem;\n}\n\n.control.has-icon .input.is-large + .icon {\n  font-size: 1.5rem;\n}\n\n.control.has-icon:not(.has-icon-right) .icon {\n  left: 0;\n}\n\n.control.has-icon:not(.has-icon-right) .input {\n  padding-left: 2.25em;\n}\n\n.control.has-icon.has-icon-right .icon {\n  right: 0;\n}\n\n.control.has-icon.has-icon-right .input {\n  padding-right: 2.25em;\n}\n\n.control.has-icons-left .input:focus ~ .icon,\n.control.has-icons-left .select:focus ~ .icon, .control.has-icons-right .input:focus ~ .icon,\n.control.has-icons-right .select:focus ~ .icon {\n  color: #7a7a7a;\n}\n\n.control.has-icons-left .input.is-small ~ .icon,\n.control.has-icons-left .select.is-small ~ .icon, .control.has-icons-right .input.is-small ~ .icon,\n.control.has-icons-right .select.is-small ~ .icon {\n  font-size: 0.75rem;\n}\n\n.control.has-icons-left .input.is-medium ~ .icon,\n.control.has-icons-left .select.is-medium ~ .icon, .control.has-icons-right .input.is-medium ~ .icon,\n.control.has-icons-right .select.is-medium ~ .icon {\n  font-size: 1.25rem;\n}\n\n.control.has-icons-left .input.is-large ~ .icon,\n.control.has-icons-left .select.is-large ~ .icon, .control.has-icons-right .input.is-large ~ .icon,\n.control.has-icons-right .select.is-large ~ .icon {\n  font-size: 1.5rem;\n}\n\n.control.has-icons-left .icon, .control.has-icons-right .icon {\n  color: #dbdbdb;\n  height: 2.25em;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  width: 2.25em;\n  z-index: 4;\n}\n\n.control.has-icons-left .input,\n.control.has-icons-left .select select {\n  padding-left: 2.25em;\n}\n\n.control.has-icons-left .icon.is-left {\n  left: 0;\n}\n\n.control.has-icons-right .input,\n.control.has-icons-right .select select {\n  padding-right: 2.25em;\n}\n\n.control.has-icons-right .icon.is-right {\n  right: 0;\n}\n\n.control.is-loading::after {\n  -webkit-animation: spinAround 500ms infinite linear;\n          animation: spinAround 500ms infinite linear;\n  border: 2px solid #dbdbdb;\n  border-radius: 290486px;\n  border-right-color: transparent;\n  border-top-color: transparent;\n  content: \"\";\n  display: block;\n  height: 1em;\n  position: relative;\n  width: 1em;\n  position: absolute !important;\n  right: 0.625em;\n  top: 0.625em;\n}\n\n.control.is-loading.is-small:after {\n  font-size: 0.75rem;\n}\n\n.control.is-loading.is-medium:after {\n  font-size: 1.25rem;\n}\n\n.control.is-loading.is-large:after {\n  font-size: 1.5rem;\n}\n\n.icon {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  height: 1.5rem;\n  width: 1.5rem;\n}\n\n.icon .fa {\n  font-size: 21px;\n}\n\n.icon.is-small {\n  height: 1rem;\n  width: 1rem;\n}\n\n.icon.is-small .fa {\n  font-size: 14px;\n}\n\n.icon.is-medium {\n  height: 2rem;\n  width: 2rem;\n}\n\n.icon.is-medium .fa {\n  font-size: 28px;\n}\n\n.icon.is-large {\n  height: 3rem;\n  width: 3rem;\n}\n\n.icon.is-large .fa {\n  font-size: 42px;\n}\n\n.image {\n  display: block;\n  position: relative;\n}\n\n.image img {\n  display: block;\n  height: auto;\n  width: 100%;\n}\n\n.image.is-square img, .image.is-1by1 img, .image.is-4by3 img, .image.is-3by2 img, .image.is-16by9 img, .image.is-2by1 img {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.image.is-square, .image.is-1by1 {\n  padding-top: 100%;\n}\n\n.image.is-4by3 {\n  padding-top: 75%;\n}\n\n.image.is-3by2 {\n  padding-top: 66.6666%;\n}\n\n.image.is-16by9 {\n  padding-top: 56.25%;\n}\n\n.image.is-2by1 {\n  padding-top: 50%;\n}\n\n.image.is-16x16 {\n  height: 16px;\n  width: 16px;\n}\n\n.image.is-24x24 {\n  height: 24px;\n  width: 24px;\n}\n\n.image.is-32x32 {\n  height: 32px;\n  width: 32px;\n}\n\n.image.is-48x48 {\n  height: 48px;\n  width: 48px;\n}\n\n.image.is-64x64 {\n  height: 64px;\n  width: 64px;\n}\n\n.image.is-96x96 {\n  height: 96px;\n  width: 96px;\n}\n\n.image.is-128x128 {\n  height: 128px;\n  width: 128px;\n}\n\n.notification {\n  background-color: whitesmoke;\n  border-radius: 3px;\n  padding: 1.25rem 2.5rem 1.25rem 1.5rem;\n  position: relative;\n}\n\n.notification:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.notification a:not(.button) {\n  color: currentColor;\n  text-decoration: underline;\n}\n\n.notification strong {\n  color: currentColor;\n}\n\n.notification code,\n.notification pre {\n  background: white;\n}\n\n.notification pre code {\n  background: transparent;\n}\n\n.notification > .delete {\n  position: absolute;\n  right: 0.5em;\n  top: 0.5em;\n}\n\n.notification .title,\n.notification .subtitle,\n.notification .content {\n  color: currentColor;\n}\n\n.notification.is-white {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.notification.is-black {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.notification.is-light {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.notification.is-dark {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.notification.is-primary {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.notification.is-info {\n  background-color: #3273dc;\n  color: #fff;\n}\n\n.notification.is-success {\n  background-color: #23d160;\n  color: #fff;\n}\n\n.notification.is-warning {\n  background-color: #ffdd57;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.notification.is-danger {\n  background-color: #ff3860;\n  color: #fff;\n}\n\n.progress {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  border: none;\n  border-radius: 290486px;\n  display: block;\n  height: 1rem;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.progress:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.progress::-webkit-progress-bar {\n  background-color: #dbdbdb;\n}\n\n.progress::-webkit-progress-value {\n  background-color: #4a4a4a;\n}\n\n.progress::-moz-progress-bar {\n  background-color: #4a4a4a;\n}\n\n.progress.is-white::-webkit-progress-value {\n  background-color: white;\n}\n\n.progress.is-white::-moz-progress-bar {\n  background-color: white;\n}\n\n.progress.is-black::-webkit-progress-value {\n  background-color: #0a0a0a;\n}\n\n.progress.is-black::-moz-progress-bar {\n  background-color: #0a0a0a;\n}\n\n.progress.is-light::-webkit-progress-value {\n  background-color: whitesmoke;\n}\n\n.progress.is-light::-moz-progress-bar {\n  background-color: whitesmoke;\n}\n\n.progress.is-dark::-webkit-progress-value {\n  background-color: #363636;\n}\n\n.progress.is-dark::-moz-progress-bar {\n  background-color: #363636;\n}\n\n.progress.is-primary::-webkit-progress-value {\n  background-color: #00d1b2;\n}\n\n.progress.is-primary::-moz-progress-bar {\n  background-color: #00d1b2;\n}\n\n.progress.is-info::-webkit-progress-value {\n  background-color: #3273dc;\n}\n\n.progress.is-info::-moz-progress-bar {\n  background-color: #3273dc;\n}\n\n.progress.is-success::-webkit-progress-value {\n  background-color: #23d160;\n}\n\n.progress.is-success::-moz-progress-bar {\n  background-color: #23d160;\n}\n\n.progress.is-warning::-webkit-progress-value {\n  background-color: #ffdd57;\n}\n\n.progress.is-warning::-moz-progress-bar {\n  background-color: #ffdd57;\n}\n\n.progress.is-danger::-webkit-progress-value {\n  background-color: #ff3860;\n}\n\n.progress.is-danger::-moz-progress-bar {\n  background-color: #ff3860;\n}\n\n.progress.is-small {\n  height: 0.75rem;\n}\n\n.progress.is-medium {\n  height: 1.25rem;\n}\n\n.progress.is-large {\n  height: 1.5rem;\n}\n\n.table {\n  background-color: white;\n  color: #363636;\n  margin-bottom: 1.5rem;\n  width: 100%;\n}\n\n.table td,\n.table th {\n  border: 1px solid #dbdbdb;\n  border-width: 0 0 1px;\n  padding: 0.5em 0.75em;\n  vertical-align: top;\n}\n\n.table td.is-narrow,\n.table th.is-narrow {\n  white-space: nowrap;\n  width: 1%;\n}\n\n.table th {\n  color: #363636;\n  text-align: left;\n}\n\n.table tr:hover {\n  background-color: #fafafa;\n}\n\n.table tr.is-selected {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.table tr.is-selected a,\n.table tr.is-selected strong {\n  color: currentColor;\n}\n\n.table tr.is-selected td,\n.table tr.is-selected th {\n  border-color: #fff;\n  color: currentColor;\n}\n\n.table thead td,\n.table thead th {\n  border-width: 0 0 2px;\n  color: #7a7a7a;\n}\n\n.table tfoot td,\n.table tfoot th {\n  border-width: 2px 0 0;\n  color: #7a7a7a;\n}\n\n.table tbody tr:last-child td,\n.table tbody tr:last-child th {\n  border-bottom-width: 0;\n}\n\n.table.is-bordered td,\n.table.is-bordered th {\n  border-width: 1px;\n}\n\n.table.is-bordered tr:last-child td,\n.table.is-bordered tr:last-child th {\n  border-bottom-width: 1px;\n}\n\n.table.is-narrow td,\n.table.is-narrow th {\n  padding: 0.25em 0.5em;\n}\n\n.table.is-striped tbody tr:not(.is-selected):nth-child(even) {\n  background-color: #fafafa;\n}\n\n.table.is-striped tbody tr:not(.is-selected):nth-child(even):hover {\n  background-color: whitesmoke;\n}\n\n.tag {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: whitesmoke;\n  border-radius: 290486px;\n  color: #4a4a4a;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 0.75rem;\n  height: 2em;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  line-height: 1.5;\n  padding-left: 0.875em;\n  padding-right: 0.875em;\n  white-space: nowrap;\n}\n\n.tag .delete {\n  margin-left: 0.25em;\n  margin-right: -0.375em;\n}\n\n.tag.is-white {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.tag.is-black {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.tag.is-light {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.tag.is-dark {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.tag.is-primary {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.tag.is-info {\n  background-color: #3273dc;\n  color: #fff;\n}\n\n.tag.is-success {\n  background-color: #23d160;\n  color: #fff;\n}\n\n.tag.is-warning {\n  background-color: #ffdd57;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.tag.is-danger {\n  background-color: #ff3860;\n  color: #fff;\n}\n\n.tag.is-medium {\n  font-size: 1rem;\n}\n\n.tag.is-large {\n  font-size: 1.25rem;\n}\n\n.title,\n.subtitle {\n  word-break: break-word;\n}\n\n.title:not(:last-child),\n.subtitle:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.title em,\n.title span,\n.subtitle em,\n.subtitle span {\n  font-weight: 300;\n}\n\n.title strong,\n.subtitle strong {\n  font-weight: 500;\n}\n\n.title .tag,\n.subtitle .tag {\n  vertical-align: middle;\n}\n\n.title {\n  color: #363636;\n  font-size: 2rem;\n  font-weight: 300;\n  line-height: 1.125;\n}\n\n.title strong {\n  color: inherit;\n}\n\n.title + .highlight {\n  margin-top: -0.75rem;\n}\n\n.title:not(.is-spaced) + .subtitle {\n  margin-top: -1.5rem;\n}\n\n.title.is-1 {\n  font-size: 3rem;\n}\n\n.title.is-2 {\n  font-size: 2.5rem;\n}\n\n.title.is-3 {\n  font-size: 2rem;\n}\n\n.title.is-4 {\n  font-size: 1.5rem;\n}\n\n.title.is-5 {\n  font-size: 1.25rem;\n}\n\n.title.is-6 {\n  font-size: 1rem;\n}\n\n.subtitle {\n  color: #4a4a4a;\n  font-size: 1.25rem;\n  font-weight: 300;\n  line-height: 1.25;\n}\n\n.subtitle strong {\n  color: #363636;\n}\n\n.subtitle:not(.is-spaced) + .title {\n  margin-top: -1.5rem;\n}\n\n.subtitle.is-1 {\n  font-size: 3rem;\n}\n\n.subtitle.is-2 {\n  font-size: 2.5rem;\n}\n\n.subtitle.is-3 {\n  font-size: 2rem;\n}\n\n.subtitle.is-4 {\n  font-size: 1.5rem;\n}\n\n.subtitle.is-5 {\n  font-size: 1.25rem;\n}\n\n.subtitle.is-6 {\n  font-size: 1rem;\n}\n\n.block:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.container {\n  margin: 0 auto;\n  position: relative;\n}\n\n@media screen and (min-width: 1008px) {\n  .container {\n    max-width: 960px;\n    width: 960px;\n  }\n  .container.is-fluid {\n    margin-left: 24px;\n    margin-right: 24px;\n    max-width: none;\n    width: auto;\n  }\n}\n\n@media screen and (max-width: 1199px) {\n  .container.is-widescreen {\n    max-width: 1152px;\n    width: auto;\n  }\n}\n\n@media screen and (max-width: 1391px) {\n  .container.is-fullhd {\n    max-width: 1344px;\n    width: auto;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .container {\n    max-width: 1152px;\n    width: 1152px;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .container {\n    max-width: 1344px;\n    width: 1344px;\n  }\n}\n\n.delete {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  background-color: rgba(10, 10, 10, 0.2);\n  border: none;\n  border-radius: 290486px;\n  cursor: pointer;\n  display: inline-block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  font-size: 1rem;\n  height: 20px;\n  max-height: 20px;\n  max-width: 20px;\n  min-height: 20px;\n  min-width: 20px;\n  outline: none;\n  position: relative;\n  vertical-align: top;\n  width: 20px;\n}\n\n.delete:before, .delete:after {\n  background-color: white;\n  content: \"\";\n  display: block;\n  left: 50%;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);\n          transform: translateX(-50%) translateY(-50%) rotate(45deg);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.delete:before {\n  height: 2px;\n  width: 50%;\n}\n\n.delete:after {\n  height: 50%;\n  width: 2px;\n}\n\n.delete:hover, .delete:focus {\n  background-color: rgba(10, 10, 10, 0.3);\n}\n\n.delete:active {\n  background-color: rgba(10, 10, 10, 0.4);\n}\n\n.delete.is-small {\n  height: 16px;\n  max-height: 16px;\n  max-width: 16px;\n  min-height: 16px;\n  min-width: 16px;\n  width: 16px;\n}\n\n.delete.is-medium {\n  height: 24px;\n  max-height: 24px;\n  max-width: 24px;\n  min-height: 24px;\n  min-width: 24px;\n  width: 24px;\n}\n\n.delete.is-large {\n  height: 32px;\n  max-height: 32px;\n  max-width: 32px;\n  min-height: 32px;\n  min-width: 32px;\n  width: 32px;\n}\n\n.fa {\n  font-size: 21px;\n  text-align: center;\n  vertical-align: top;\n}\n\n.heading {\n  display: block;\n  font-size: 11px;\n  letter-spacing: 1px;\n  margin-bottom: 5px;\n  text-transform: uppercase;\n}\n\n.highlight {\n  font-weight: 400;\n  max-width: 100%;\n  overflow: hidden;\n  padding: 0;\n}\n\n.highlight:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.highlight pre {\n  overflow: auto;\n  max-width: 100%;\n}\n\n.loader {\n  -webkit-animation: spinAround 500ms infinite linear;\n          animation: spinAround 500ms infinite linear;\n  border: 2px solid #dbdbdb;\n  border-radius: 290486px;\n  border-right-color: transparent;\n  border-top-color: transparent;\n  content: \"\";\n  display: block;\n  height: 1em;\n  position: relative;\n  width: 1em;\n}\n\n.number {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: whitesmoke;\n  border-radius: 290486px;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1.25rem;\n  height: 2em;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-right: 1.5rem;\n  min-width: 2.5em;\n  padding: 0.25rem 0.5rem;\n  text-align: center;\n  vertical-align: top;\n}\n\n.breadcrumb {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 1rem;\n  overflow: hidden;\n  overflow-x: auto;\n  white-space: nowrap;\n}\n\n.breadcrumb:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.breadcrumb a {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: #7a7a7a;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0.5em 0.75em;\n}\n\n.breadcrumb a:hover {\n  color: #363636;\n}\n\n.breadcrumb li {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.breadcrumb li.is-active a {\n  color: #363636;\n  cursor: default;\n  pointer-events: none;\n}\n\n.breadcrumb li + li:before {\n  color: #4a4a4a;\n  content: '/';\n}\n\n.breadcrumb ul, .breadcrumb ol {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n.breadcrumb .icon:first-child {\n  margin-right: 0.5em;\n}\n\n.breadcrumb .icon:last-child {\n  margin-left: 0.5em;\n}\n\n.breadcrumb.is-centered ol, .breadcrumb.is-centered ul {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.breadcrumb.is-right ol, .breadcrumb.is-right ul {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.breadcrumb.is-small {\n  font-size: 0.75rem;\n}\n\n.breadcrumb.is-medium {\n  font-size: 1.25rem;\n}\n\n.breadcrumb.is-large {\n  font-size: 1.5rem;\n}\n\n.breadcrumb.has-arrow-separator li + li:before {\n  content: '\\2192';\n}\n\n.breadcrumb.has-bullet-separator li + li:before {\n  content: '\\2022';\n}\n\n.breadcrumb.has-dot-separator li + li:before {\n  content: '\\B7';\n}\n\n.breadcrumb.has-succeeds-separator li + li:before {\n  content: '\\227B';\n}\n\n.card {\n  background-color: white;\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n  color: #4a4a4a;\n  max-width: 100%;\n  position: relative;\n}\n\n.card-header {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  -webkit-box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.card-header-title {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: #363636;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  font-weight: 700;\n  padding: 0.75rem;\n}\n\n.card-header-icon {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0.75rem;\n}\n\n.card-image {\n  display: block;\n  position: relative;\n}\n\n.card-content {\n  padding: 1.5rem;\n}\n\n.card-footer {\n  border-top: 1px solid #dbdbdb;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.card-footer-item {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0.75rem;\n}\n\n.card-footer-item:not(:last-child) {\n  border-right: 1px solid #dbdbdb;\n}\n\n.card .media:not(:last-child) {\n  margin-bottom: 0.75rem;\n}\n\n.dropdown {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  vertical-align: top;\n}\n\n.dropdown.is-active .dropdown-menu, .dropdown.is-hoverable:hover .dropdown-menu {\n  display: block;\n}\n\n.dropdown.is-right .dropdown-menu {\n  left: auto;\n  right: 0;\n}\n\n.dropdown-menu {\n  display: none;\n  left: 0;\n  max-width: 20rem;\n  min-width: 12rem;\n  padding-top: 4px;\n  position: absolute;\n  top: 100%;\n  width: 100%;\n  z-index: 20;\n}\n\n.dropdown-content {\n  background-color: white;\n  border-radius: 3px;\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n  padding-bottom: 0.5rem;\n  padding-top: 0.5rem;\n}\n\n.dropdown-item {\n  color: #4a4a4a;\n  display: block;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  padding: 0.375rem 1rem;\n  position: relative;\n}\n\na.dropdown-item {\n  padding-right: 3rem;\n  white-space: nowrap;\n}\n\na.dropdown-item:hover {\n  background-color: whitesmoke;\n  color: #0a0a0a;\n}\n\na.dropdown-item.is-active {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.dropdown-divider {\n  background-color: #dbdbdb;\n  border: none;\n  display: block;\n  height: 1px;\n  margin: 0.5rem 0;\n}\n\n.level-item {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-preferred-size: auto;\n      flex-basis: auto;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.level-item .title,\n.level-item .subtitle {\n  margin-bottom: 0;\n}\n\n@media screen and (max-width: 768px) {\n  .level-item:not(:last-child) {\n    margin-bottom: 0.75rem;\n  }\n}\n\n.level-left,\n.level-right {\n  -ms-flex-preferred-size: auto;\n      flex-basis: auto;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.level-left .level-item:not(:last-child),\n.level-right .level-item:not(:last-child) {\n  margin-right: 0.75rem;\n}\n\n.level-left .level-item.is-flexible,\n.level-right .level-item.is-flexible {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n.level-left {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n@media screen and (max-width: 768px) {\n  .level-left + .level-right {\n    margin-top: 1.5rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .level-left {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n.level-right {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n@media screen and (min-width: 769px), print {\n  .level-right {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n.level {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n\n.level:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.level code {\n  border-radius: 3px;\n}\n\n.level img {\n  display: inline-block;\n  vertical-align: top;\n}\n\n.level.is-mobile {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.level.is-mobile .level-left,\n.level.is-mobile .level-right {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.level.is-mobile .level-left + .level-right {\n  margin-top: 0;\n}\n\n.level.is-mobile .level-item:not(:last-child) {\n  margin-bottom: 0;\n}\n\n.level.is-mobile .level-item:not(.is-narrow) {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n@media screen and (min-width: 769px), print {\n  .level {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .level > .level-item:not(.is-narrow) {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n  }\n}\n\n.media-left,\n.media-right {\n  -ms-flex-preferred-size: auto;\n      flex-basis: auto;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.media-left {\n  margin-right: 1rem;\n}\n\n.media-right {\n  margin-left: 1rem;\n}\n\n.media-content {\n  -ms-flex-preferred-size: auto;\n      flex-basis: auto;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  text-align: left;\n}\n\n.media {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  text-align: left;\n}\n\n.media .content:not(:last-child) {\n  margin-bottom: 0.75rem;\n}\n\n.media .media {\n  border-top: 1px solid rgba(219, 219, 219, 0.5);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding-top: 0.75rem;\n}\n\n.media .media .content:not(:last-child),\n.media .media .control:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.media .media .media {\n  padding-top: 0.5rem;\n}\n\n.media .media .media + .media {\n  margin-top: 0.5rem;\n}\n\n.media + .media {\n  border-top: 1px solid rgba(219, 219, 219, 0.5);\n  margin-top: 1rem;\n  padding-top: 1rem;\n}\n\n.media.is-large + .media {\n  margin-top: 1.5rem;\n  padding-top: 1.5rem;\n}\n\n.menu {\n  font-size: 1rem;\n}\n\n.menu-list {\n  line-height: 1.25;\n}\n\n.menu-list a {\n  border-radius: 2px;\n  color: #4a4a4a;\n  display: block;\n  padding: 0.5em 0.75em;\n}\n\n.menu-list a:hover {\n  background-color: whitesmoke;\n  color: #00d1b2;\n}\n\n.menu-list a.is-active {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.menu-list li ul {\n  border-left: 1px solid #dbdbdb;\n  margin: 0.75em;\n  padding-left: 0.75em;\n}\n\n.menu-label {\n  color: #7a7a7a;\n  font-size: 0.8em;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\n.menu-label:not(:first-child) {\n  margin-top: 1em;\n}\n\n.menu-label:not(:last-child) {\n  margin-bottom: 1em;\n}\n\n.message {\n  background-color: whitesmoke;\n  border-radius: 3px;\n  font-size: 1rem;\n}\n\n.message:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.message.is-white {\n  background-color: white;\n}\n\n.message.is-white .message-header {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.message.is-white .message-body {\n  border-color: white;\n  color: #4d4d4d;\n}\n\n.message.is-black {\n  background-color: #fafafa;\n}\n\n.message.is-black .message-header {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.message.is-black .message-body {\n  border-color: #0a0a0a;\n  color: #090909;\n}\n\n.message.is-light {\n  background-color: #fafafa;\n}\n\n.message.is-light .message-header {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.message.is-light .message-body {\n  border-color: whitesmoke;\n  color: #505050;\n}\n\n.message.is-dark {\n  background-color: #fafafa;\n}\n\n.message.is-dark .message-header {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.message.is-dark .message-body {\n  border-color: #363636;\n  color: #2a2a2a;\n}\n\n.message.is-primary {\n  background-color: #f5fffd;\n}\n\n.message.is-primary .message-header {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.message.is-primary .message-body {\n  border-color: #00d1b2;\n  color: #021310;\n}\n\n.message.is-info {\n  background-color: #f6f9fe;\n}\n\n.message.is-info .message-header {\n  background-color: #3273dc;\n  color: #fff;\n}\n\n.message.is-info .message-body {\n  border-color: #3273dc;\n  color: #22509a;\n}\n\n.message.is-success {\n  background-color: #f6fef9;\n}\n\n.message.is-success .message-header {\n  background-color: #23d160;\n  color: #fff;\n}\n\n.message.is-success .message-body {\n  border-color: #23d160;\n  color: #0e301a;\n}\n\n.message.is-warning {\n  background-color: #fffdf5;\n}\n\n.message.is-warning .message-header {\n  background-color: #ffdd57;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.message.is-warning .message-body {\n  border-color: #ffdd57;\n  color: #3b3108;\n}\n\n.message.is-danger {\n  background-color: #fff5f7;\n}\n\n.message.is-danger .message-header {\n  background-color: #ff3860;\n  color: #fff;\n}\n\n.message.is-danger .message-body {\n  border-color: #ff3860;\n  color: #cd0930;\n}\n\n.message-header {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #4a4a4a;\n  border-radius: 3px 3px 0 0;\n  color: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  line-height: 1.25;\n  padding: 0.5em 0.75em;\n  position: relative;\n}\n\n.message-header a:not(.button),\n.message-header strong {\n  color: currentColor;\n}\n\n.message-header a:not(.button) {\n  text-decoration: underline;\n}\n\n.message-header .delete {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  margin-left: 0.75em;\n}\n\n.message-header + .message-body {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  border-top: none;\n}\n\n.message-body {\n  border: 1px solid #dbdbdb;\n  border-radius: 3px;\n  color: #4a4a4a;\n  padding: 1em 1.25em;\n}\n\n.message-body a:not(.button),\n.message-body strong {\n  color: currentColor;\n}\n\n.message-body a:not(.button) {\n  text-decoration: underline;\n}\n\n.message-body code,\n.message-body pre {\n  background: white;\n}\n\n.message-body pre code {\n  background: transparent;\n}\n\n.modal-background {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  background-color: rgba(10, 10, 10, 0.86);\n}\n\n.modal-content,\n.modal-card {\n  margin: 0 20px;\n  max-height: calc(100vh - 160px);\n  overflow: auto;\n  position: relative;\n  width: 100%;\n}\n\n@media screen and (min-width: 769px), print {\n  .modal-content,\n  .modal-card {\n    margin: 0 auto;\n    max-height: calc(100vh - 40px);\n    width: 640px;\n  }\n}\n\n.modal-close {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  background-color: rgba(10, 10, 10, 0.2);\n  border: none;\n  border-radius: 290486px;\n  cursor: pointer;\n  display: inline-block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  font-size: 1rem;\n  height: 20px;\n  max-height: 20px;\n  max-width: 20px;\n  min-height: 20px;\n  min-width: 20px;\n  outline: none;\n  position: relative;\n  vertical-align: top;\n  width: 20px;\n  background: none;\n  height: 40px;\n  position: fixed;\n  right: 20px;\n  top: 20px;\n  width: 40px;\n}\n\n.modal-close:before, .modal-close:after {\n  background-color: white;\n  content: \"\";\n  display: block;\n  left: 50%;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);\n          transform: translateX(-50%) translateY(-50%) rotate(45deg);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.modal-close:before {\n  height: 2px;\n  width: 50%;\n}\n\n.modal-close:after {\n  height: 50%;\n  width: 2px;\n}\n\n.modal-close:hover, .modal-close:focus {\n  background-color: rgba(10, 10, 10, 0.3);\n}\n\n.modal-close:active {\n  background-color: rgba(10, 10, 10, 0.4);\n}\n\n.modal-close.is-small {\n  height: 16px;\n  max-height: 16px;\n  max-width: 16px;\n  min-height: 16px;\n  min-width: 16px;\n  width: 16px;\n}\n\n.modal-close.is-medium {\n  height: 24px;\n  max-height: 24px;\n  max-width: 24px;\n  min-height: 24px;\n  min-width: 24px;\n  width: 24px;\n}\n\n.modal-close.is-large {\n  height: 32px;\n  max-height: 32px;\n  max-width: 32px;\n  min-height: 32px;\n  min-width: 32px;\n  width: 32px;\n}\n\n.modal-card {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  max-height: calc(100vh - 40px);\n  overflow: hidden;\n}\n\n.modal-card-head,\n.modal-card-foot {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: whitesmoke;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  padding: 20px;\n  position: relative;\n}\n\n.modal-card-head {\n  border-bottom: 1px solid #dbdbdb;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n}\n\n.modal-card-title {\n  color: #363636;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  font-size: 1.5rem;\n  line-height: 1;\n}\n\n.modal-card-foot {\n  border-bottom-left-radius: 5px;\n  border-bottom-right-radius: 5px;\n  border-top: 1px solid #dbdbdb;\n}\n\n.modal-card-foot .button:not(:last-child) {\n  margin-right: 10px;\n}\n\n.modal-card-body {\n  -webkit-overflow-scrolling: touch;\n  background-color: white;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  overflow: auto;\n  padding: 20px;\n}\n\n.modal {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: none;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  overflow: hidden;\n  position: fixed;\n  z-index: 20;\n}\n\n.modal.is-active {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.nav-toggle {\n  cursor: pointer;\n  display: block;\n  height: 3.25rem;\n  position: relative;\n  width: 3.25rem;\n}\n\n.nav-toggle span {\n  background-color: #4a4a4a;\n  display: block;\n  height: 1px;\n  left: 50%;\n  margin-left: -7px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: none 86ms ease-out;\n  transition: none 86ms ease-out;\n  -webkit-transition-property: background, left, opacity, -webkit-transform;\n  transition-property: background, left, opacity, -webkit-transform;\n  transition-property: background, left, opacity, transform;\n  transition-property: background, left, opacity, transform, -webkit-transform;\n  width: 15px;\n}\n\n.nav-toggle span:nth-child(1) {\n  margin-top: -6px;\n}\n\n.nav-toggle span:nth-child(2) {\n  margin-top: -1px;\n}\n\n.nav-toggle span:nth-child(3) {\n  margin-top: 4px;\n}\n\n.nav-toggle:hover {\n  background-color: whitesmoke;\n}\n\n.nav-toggle.is-active span {\n  background-color: #00d1b2;\n}\n\n.nav-toggle.is-active span:nth-child(1) {\n  margin-left: -5px;\n  -webkit-transform: rotate(45deg);\n          transform: rotate(45deg);\n  -webkit-transform-origin: left top;\n          transform-origin: left top;\n}\n\n.nav-toggle.is-active span:nth-child(2) {\n  opacity: 0;\n}\n\n.nav-toggle.is-active span:nth-child(3) {\n  margin-left: -5px;\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n  -webkit-transform-origin: left bottom;\n          transform-origin: left bottom;\n}\n\n@media screen and (min-width: 769px), print {\n  .nav-toggle {\n    display: none;\n  }\n}\n\n.nav-item {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  font-size: 1rem;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  line-height: 1.5;\n  padding: 0.5rem 0.75rem;\n}\n\n.nav-item a {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.nav-item img {\n  max-height: 1.75rem;\n}\n\n.nav-item .tag:first-child:not(:last-child) {\n  margin-right: 0.5rem;\n}\n\n.nav-item .tag:last-child:not(:first-child) {\n  margin-left: 0.5rem;\n}\n\n@media screen and (max-width: 768px) {\n  .nav-item {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n  }\n}\n\n.nav-item a:not(.button),\na.nav-item:not(.button) {\n  color: #7a7a7a;\n}\n\n.nav-item a:not(.button):hover,\na.nav-item:not(.button):hover {\n  color: #363636;\n}\n\n.nav-item a:not(.button).is-active,\na.nav-item:not(.button).is-active {\n  color: #363636;\n}\n\n.nav-item a:not(.button).is-tab,\na.nav-item:not(.button).is-tab {\n  border-bottom: 1px solid transparent;\n  border-top: 1px solid transparent;\n  padding-bottom: calc(0.75rem - 1px);\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: calc(0.75rem - 1px);\n}\n\n.nav-item a:not(.button).is-tab:hover,\na.nav-item:not(.button).is-tab:hover {\n  border-bottom-color: #00d1b2;\n  border-top-color: transparent;\n}\n\n.nav-item a:not(.button).is-tab.is-active,\na.nav-item:not(.button).is-tab.is-active {\n  border-bottom: 3px solid #00d1b2;\n  color: #00d1b2;\n  padding-bottom: calc(0.75rem - 3px);\n}\n\n@media screen and (min-width: 1008px) {\n  .nav-item a:not(.button).is-brand,\n  a.nav-item:not(.button).is-brand {\n    padding-left: 0;\n  }\n}\n\n.nav-left,\n.nav-right {\n  -webkit-overflow-scrolling: touch;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  max-width: 100%;\n  overflow: auto;\n}\n\n@media screen and (min-width: 1200px) {\n  .nav-left,\n  .nav-right {\n    -ms-flex-preferred-size: 0;\n        flex-basis: 0;\n  }\n}\n\n.nav-left {\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  white-space: nowrap;\n}\n\n.nav-right {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.nav-center {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n@media screen and (max-width: 768px) {\n  .nav-menu.nav-right {\n    background-color: white;\n    -webkit-box-shadow: 0 4px 7px rgba(10, 10, 10, 0.1);\n            box-shadow: 0 4px 7px rgba(10, 10, 10, 0.1);\n    left: 0;\n    display: none;\n    right: 0;\n    top: 100%;\n    position: absolute;\n  }\n  .nav-menu.nav-right .nav-item {\n    border-top: 1px solid rgba(219, 219, 219, 0.5);\n    padding: 0.75rem;\n  }\n  .nav-menu.nav-right.is-active {\n    display: block;\n  }\n}\n\n.nav {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  background-color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 3.25rem;\n  position: relative;\n  text-align: center;\n  z-index: 10;\n}\n\n.nav > .container {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  min-height: 3.25rem;\n  width: 100%;\n}\n\n.nav.has-shadow {\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);\n}\n\n.navbar {\n  background-color: white;\n  min-height: 3.25rem;\n  position: relative;\n}\n\n.navbar > .container {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  min-height: 3.25rem;\n  width: 100%;\n}\n\n.navbar.has-shadow {\n  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);\n          box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);\n}\n\n.navbar-brand {\n  -webkit-overflow-scrolling: touch;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  min-height: 3.25rem;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.navbar-burger {\n  cursor: pointer;\n  display: block;\n  height: 3.25rem;\n  position: relative;\n  width: 3.25rem;\n  margin-left: auto;\n}\n\n.navbar-burger span {\n  background-color: #4a4a4a;\n  display: block;\n  height: 1px;\n  left: 50%;\n  margin-left: -7px;\n  position: absolute;\n  top: 50%;\n  -webkit-transition: none 86ms ease-out;\n  transition: none 86ms ease-out;\n  -webkit-transition-property: background, left, opacity, -webkit-transform;\n  transition-property: background, left, opacity, -webkit-transform;\n  transition-property: background, left, opacity, transform;\n  transition-property: background, left, opacity, transform, -webkit-transform;\n  width: 15px;\n}\n\n.navbar-burger span:nth-child(1) {\n  margin-top: -6px;\n}\n\n.navbar-burger span:nth-child(2) {\n  margin-top: -1px;\n}\n\n.navbar-burger span:nth-child(3) {\n  margin-top: 4px;\n}\n\n.navbar-burger:hover {\n  background-color: whitesmoke;\n}\n\n.navbar-burger.is-active span {\n  background-color: #00d1b2;\n}\n\n.navbar-burger.is-active span:nth-child(1) {\n  margin-left: -5px;\n  -webkit-transform: rotate(45deg);\n          transform: rotate(45deg);\n  -webkit-transform-origin: left top;\n          transform-origin: left top;\n}\n\n.navbar-burger.is-active span:nth-child(2) {\n  opacity: 0;\n}\n\n.navbar-burger.is-active span:nth-child(3) {\n  margin-left: -5px;\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n  -webkit-transform-origin: left bottom;\n          transform-origin: left bottom;\n}\n\n.navbar-menu {\n  display: none;\n}\n\n.navbar-item,\n.navbar-link {\n  color: #4a4a4a;\n  display: block;\n  line-height: 1.5;\n  padding: 0.5rem 1rem;\n  position: relative;\n}\n\na.navbar-item:hover, a.navbar-item.is-active,\n.navbar-link:hover,\n.navbar-link.is-active {\n  background-color: whitesmoke;\n  color: #0a0a0a;\n}\n\n.navbar-item {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.navbar-item img {\n  max-height: 1.75rem;\n}\n\n.navbar-item.has-dropdown {\n  padding: 0;\n}\n\n.navbar-item.is-tab {\n  border-bottom: 1px solid transparent;\n  min-height: 3.25rem;\n  padding-bottom: calc(0.5rem - 1px);\n}\n\n.navbar-item.is-tab:hover {\n  background-color: transparent;\n  border-bottom-color: #00d1b2;\n}\n\n.navbar-item.is-tab.is-active {\n  background-color: transparent;\n  border-bottom: 3px solid #00d1b2;\n  color: #00d1b2;\n  padding-bottom: calc(0.5rem - 3px);\n}\n\n.navbar-content {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n\n.navbar-link {\n  padding-right: 2.5em;\n}\n\n.navbar-dropdown {\n  font-size: 0.875rem;\n  padding-bottom: 0.5rem;\n  padding-top: 0.5rem;\n}\n\n.navbar-dropdown .navbar-item {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n\n.navbar-divider {\n  background-color: #dbdbdb;\n  border: none;\n  display: none;\n  height: 1px;\n  margin: 0.5rem 0;\n}\n\n@media screen and (max-width: 1007px) {\n  .navbar-brand .navbar-item {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .navbar-menu {\n    -webkit-box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);\n            box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);\n    padding: 0.5rem 0;\n  }\n  .navbar-menu.is-active {\n    display: block;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .navbar,\n  .navbar-menu,\n  .navbar-start,\n  .navbar-end {\n    -webkit-box-align: stretch;\n        -ms-flex-align: stretch;\n            align-items: stretch;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .navbar {\n    min-height: 3.25rem;\n  }\n  .navbar.is-transparent a.navbar-item:hover, .navbar.is-transparent a.navbar-item.is-active,\n  .navbar.is-transparent .navbar-link:hover,\n  .navbar.is-transparent .navbar-link.is-active {\n    background-color: transparent;\n  }\n  .navbar.is-transparent .navbar-item.has-dropdown.is-active .navbar-link, .navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:hover .navbar-link {\n    background-color: transparent;\n  }\n  .navbar.is-transparent .navbar-dropdown a.navbar-item:hover {\n    background-color: whitesmoke;\n    color: #0a0a0a;\n  }\n  .navbar.is-transparent .navbar-dropdown a.navbar-item.is-active {\n    background-color: whitesmoke;\n    color: #00d1b2;\n  }\n  .navbar-burger {\n    display: none;\n  }\n  .navbar-item,\n  .navbar-link {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .navbar-item.has-dropdown {\n    -webkit-box-align: stretch;\n        -ms-flex-align: stretch;\n            align-items: stretch;\n  }\n  .navbar-item.is-active .navbar-dropdown, .navbar-item.is-hoverable:hover .navbar-dropdown {\n    display: block;\n  }\n  .navbar-item.is-active .navbar-dropdown.is-boxed, .navbar-item.is-hoverable:hover .navbar-dropdown.is-boxed {\n    opacity: 1;\n    pointer-events: auto;\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n  }\n  .navbar-link::after {\n    border: 1px solid #00d1b2;\n    border-right: 0;\n    border-top: 0;\n    content: \" \";\n    display: block;\n    height: 0.5em;\n    pointer-events: none;\n    position: absolute;\n    -webkit-transform: rotate(-45deg);\n            transform: rotate(-45deg);\n    width: 0.5em;\n    margin-top: -0.375em;\n    right: 1.125em;\n    top: 50%;\n  }\n  .navbar-menu {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n  }\n  .navbar-start {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    margin-right: auto;\n  }\n  .navbar-end {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    margin-left: auto;\n  }\n  .navbar-dropdown {\n    background-color: white;\n    border-bottom-left-radius: 5px;\n    border-bottom-right-radius: 5px;\n    border-top: 1px solid #dbdbdb;\n    -webkit-box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1);\n            box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1);\n    display: none;\n    font-size: 0.875rem;\n    left: 0;\n    min-width: 100%;\n    position: absolute;\n    top: 100%;\n    z-index: 20;\n  }\n  .navbar-dropdown .navbar-item {\n    padding: 0.375rem 1rem;\n    white-space: nowrap;\n  }\n  .navbar-dropdown a.navbar-item {\n    padding-right: 3rem;\n  }\n  .navbar-dropdown a.navbar-item:hover {\n    background-color: whitesmoke;\n    color: #0a0a0a;\n  }\n  .navbar-dropdown a.navbar-item.is-active {\n    background-color: whitesmoke;\n    color: #00d1b2;\n  }\n  .navbar-dropdown.is-boxed {\n    border-radius: 5px;\n    border-top: none;\n    -webkit-box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n            box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);\n    display: block;\n    opacity: 0;\n    pointer-events: none;\n    top: calc(100% + (-4px));\n    -webkit-transform: translateY(-5px);\n            transform: translateY(-5px);\n    -webkit-transition-duration: 86ms;\n            transition-duration: 86ms;\n    -webkit-transition-property: opacity, -webkit-transform;\n    transition-property: opacity, -webkit-transform;\n    transition-property: opacity, transform;\n    transition-property: opacity, transform, -webkit-transform;\n  }\n  .navbar-divider {\n    display: block;\n  }\n  .container > .navbar {\n    margin-left: -1rem;\n    margin-right: -1rem;\n  }\n  a.navbar-item.is-active,\n  .navbar-link.is-active {\n    color: #0a0a0a;\n  }\n  a.navbar-item.is-active:not(:hover),\n  .navbar-link.is-active:not(:hover) {\n    background-color: transparent;\n  }\n  .navbar-item.has-dropdown:hover .navbar-link, .navbar-item.has-dropdown.is-active .navbar-link {\n    background-color: whitesmoke;\n  }\n}\n\n.pagination {\n  font-size: 1rem;\n  margin: -0.25rem;\n}\n\n.pagination.is-small {\n  font-size: 0.75rem;\n}\n\n.pagination.is-medium {\n  font-size: 1.25rem;\n}\n\n.pagination.is-large {\n  font-size: 1.5rem;\n}\n\n.pagination,\n.pagination-list {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  text-align: center;\n}\n\n.pagination-previous,\n.pagination-next,\n.pagination-link,\n.pagination-ellipsis {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border: 1px solid transparent;\n  border-radius: 3px;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  font-size: 1rem;\n  height: 2.25em;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  line-height: 1.5;\n  padding-bottom: calc(0.375em - 1px);\n  padding-left: calc(0.625em - 1px);\n  padding-right: calc(0.625em - 1px);\n  padding-top: calc(0.375em - 1px);\n  position: relative;\n  vertical-align: top;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  font-size: 1em;\n  padding-left: 0.5em;\n  padding-right: 0.5em;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 0.25rem;\n  text-align: center;\n}\n\n.pagination-previous:focus, .pagination-previous.is-focused, .pagination-previous:active, .pagination-previous.is-active,\n.pagination-next:focus,\n.pagination-next.is-focused,\n.pagination-next:active,\n.pagination-next.is-active,\n.pagination-link:focus,\n.pagination-link.is-focused,\n.pagination-link:active,\n.pagination-link.is-active,\n.pagination-ellipsis:focus,\n.pagination-ellipsis.is-focused,\n.pagination-ellipsis:active,\n.pagination-ellipsis.is-active {\n  outline: none;\n}\n\n.pagination-previous[disabled],\n.pagination-next[disabled],\n.pagination-link[disabled],\n.pagination-ellipsis[disabled] {\n  cursor: not-allowed;\n}\n\n.pagination-previous,\n.pagination-next,\n.pagination-link {\n  border-color: #dbdbdb;\n  min-width: 2.25em;\n}\n\n.pagination-previous:hover,\n.pagination-next:hover,\n.pagination-link:hover {\n  border-color: #b5b5b5;\n  color: #363636;\n}\n\n.pagination-previous:focus,\n.pagination-next:focus,\n.pagination-link:focus {\n  border-color: #00d1b2;\n}\n\n.pagination-previous:active,\n.pagination-next:active,\n.pagination-link:active {\n  -webkit-box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2);\n}\n\n.pagination-previous[disabled],\n.pagination-next[disabled],\n.pagination-link[disabled] {\n  background-color: #dbdbdb;\n  border-color: #dbdbdb;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #7a7a7a;\n  opacity: 0.5;\n}\n\n.pagination-previous,\n.pagination-next {\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n  white-space: nowrap;\n}\n\n.pagination-link.is-current {\n  background-color: #00d1b2;\n  border-color: #00d1b2;\n  color: #fff;\n}\n\n.pagination-ellipsis {\n  color: #b5b5b5;\n  pointer-events: none;\n}\n\n.pagination-list {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n@media screen and (max-width: 768px) {\n  .pagination {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n  }\n  .pagination-previous,\n  .pagination-next {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n  }\n  .pagination-list li {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .pagination-list {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    -ms-flex-negative: 1;\n        flex-shrink: 1;\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n  }\n  .pagination-previous {\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n  }\n  .pagination-next {\n    -webkit-box-ordinal-group: 4;\n        -ms-flex-order: 3;\n            order: 3;\n  }\n  .pagination {\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n  }\n  .pagination.is-centered .pagination-previous {\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n  }\n  .pagination.is-centered .pagination-list {\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n  }\n  .pagination.is-centered .pagination-next {\n    -webkit-box-ordinal-group: 4;\n        -ms-flex-order: 3;\n            order: 3;\n  }\n  .pagination.is-right .pagination-previous {\n    -webkit-box-ordinal-group: 2;\n        -ms-flex-order: 1;\n            order: 1;\n  }\n  .pagination.is-right .pagination-next {\n    -webkit-box-ordinal-group: 3;\n        -ms-flex-order: 2;\n            order: 2;\n  }\n  .pagination.is-right .pagination-list {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    -webkit-box-ordinal-group: 4;\n        -ms-flex-order: 3;\n            order: 3;\n  }\n}\n\n.panel {\n  font-size: 1rem;\n}\n\n.panel:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.panel-heading,\n.panel-tabs,\n.panel-block {\n  border-bottom: 1px solid #dbdbdb;\n  border-left: 1px solid #dbdbdb;\n  border-right: 1px solid #dbdbdb;\n}\n\n.panel-heading:first-child,\n.panel-tabs:first-child,\n.panel-block:first-child {\n  border-top: 1px solid #dbdbdb;\n}\n\n.panel-heading {\n  background-color: whitesmoke;\n  border-radius: 3px 3px 0 0;\n  color: #363636;\n  font-size: 1.25em;\n  font-weight: 300;\n  line-height: 1.25;\n  padding: 0.5em 0.75em;\n}\n\n.panel-tabs {\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 0.875em;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.panel-tabs a {\n  border-bottom: 1px solid #dbdbdb;\n  margin-bottom: -1px;\n  padding: 0.5em;\n}\n\n.panel-tabs a.is-active {\n  border-bottom-color: #4a4a4a;\n  color: #363636;\n}\n\n.panel-list a {\n  color: #4a4a4a;\n}\n\n.panel-list a:hover {\n  color: #00d1b2;\n}\n\n.panel-block {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: #363636;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  padding: 0.5em 0.75em;\n}\n\n.panel-block input[type=\"checkbox\"] {\n  margin-right: 0.75em;\n}\n\n.panel-block > .control {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  width: 100%;\n}\n\n.panel-block.is-wrapped {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.panel-block.is-active {\n  border-left-color: #00d1b2;\n  color: #363636;\n}\n\n.panel-block.is-active .panel-icon {\n  color: #00d1b2;\n}\n\na.panel-block,\nlabel.panel-block {\n  cursor: pointer;\n}\n\na.panel-block:hover,\nlabel.panel-block:hover {\n  background-color: whitesmoke;\n}\n\n.panel-icon {\n  display: inline-block;\n  font-size: 14px;\n  height: 1em;\n  line-height: 1em;\n  text-align: center;\n  vertical-align: top;\n  width: 1em;\n  color: #7a7a7a;\n  margin-right: 0.75em;\n}\n\n.panel-icon .fa {\n  font-size: inherit;\n  line-height: inherit;\n}\n\n.tabs {\n  -webkit-overflow-scrolling: touch;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 1rem;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  overflow: hidden;\n  overflow-x: auto;\n  white-space: nowrap;\n}\n\n.tabs:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.tabs a {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border-bottom: 1px solid #dbdbdb;\n  color: #4a4a4a;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-bottom: -1px;\n  padding: 0.5em 1em;\n  vertical-align: top;\n}\n\n.tabs a:hover {\n  border-bottom-color: #363636;\n  color: #363636;\n}\n\n.tabs li {\n  display: block;\n}\n\n.tabs li.is-active a {\n  border-bottom-color: #00d1b2;\n  color: #00d1b2;\n}\n\n.tabs ul {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  border-bottom: 1px solid #dbdbdb;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n}\n\n.tabs ul.is-left {\n  padding-right: 0.75em;\n}\n\n.tabs ul.is-center {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n}\n\n.tabs ul.is-right {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  padding-left: 0.75em;\n}\n\n.tabs .icon:first-child {\n  margin-right: 0.5em;\n}\n\n.tabs .icon:last-child {\n  margin-left: 0.5em;\n}\n\n.tabs.is-centered ul {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.tabs.is-right ul {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.tabs.is-boxed a {\n  border: 1px solid transparent;\n  border-radius: 3px 3px 0 0;\n}\n\n.tabs.is-boxed a:hover {\n  background-color: whitesmoke;\n  border-bottom-color: #dbdbdb;\n}\n\n.tabs.is-boxed li.is-active a {\n  background-color: white;\n  border-color: #dbdbdb;\n  border-bottom-color: transparent !important;\n}\n\n.tabs.is-fullwidth li {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.tabs.is-toggle a {\n  border: 1px solid #dbdbdb;\n  margin-bottom: 0;\n  position: relative;\n}\n\n.tabs.is-toggle a:hover {\n  background-color: whitesmoke;\n  border-color: #b5b5b5;\n  z-index: 2;\n}\n\n.tabs.is-toggle li + li {\n  margin-left: -1px;\n}\n\n.tabs.is-toggle li:first-child a {\n  border-radius: 3px 0 0 3px;\n}\n\n.tabs.is-toggle li:last-child a {\n  border-radius: 0 3px 3px 0;\n}\n\n.tabs.is-toggle li.is-active a {\n  background-color: #00d1b2;\n  border-color: #00d1b2;\n  color: #fff;\n  z-index: 1;\n}\n\n.tabs.is-toggle ul {\n  border-bottom: none;\n}\n\n.tabs.is-small {\n  font-size: 0.75rem;\n}\n\n.tabs.is-medium {\n  font-size: 1.25rem;\n}\n\n.tabs.is-large {\n  font-size: 1.5rem;\n}\n\n.column {\n  display: block;\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  padding: 0.75rem;\n}\n\n.columns.is-mobile > .column.is-narrow {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n}\n\n.columns.is-mobile > .column.is-full {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 100%;\n}\n\n.columns.is-mobile > .column.is-three-quarters {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 75%;\n}\n\n.columns.is-mobile > .column.is-two-thirds {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 66.6666%;\n}\n\n.columns.is-mobile > .column.is-half {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 50%;\n}\n\n.columns.is-mobile > .column.is-one-third {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 33.3333%;\n}\n\n.columns.is-mobile > .column.is-one-quarter {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 25%;\n}\n\n.columns.is-mobile > .column.is-offset-three-quarters {\n  margin-left: 75%;\n}\n\n.columns.is-mobile > .column.is-offset-two-thirds {\n  margin-left: 66.6666%;\n}\n\n.columns.is-mobile > .column.is-offset-half {\n  margin-left: 50%;\n}\n\n.columns.is-mobile > .column.is-offset-one-third {\n  margin-left: 33.3333%;\n}\n\n.columns.is-mobile > .column.is-offset-one-quarter {\n  margin-left: 25%;\n}\n\n.columns.is-mobile > .column.is-1 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 8.33333%;\n}\n\n.columns.is-mobile > .column.is-offset-1 {\n  margin-left: 8.33333%;\n}\n\n.columns.is-mobile > .column.is-2 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 16.66667%;\n}\n\n.columns.is-mobile > .column.is-offset-2 {\n  margin-left: 16.66667%;\n}\n\n.columns.is-mobile > .column.is-3 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 25%;\n}\n\n.columns.is-mobile > .column.is-offset-3 {\n  margin-left: 25%;\n}\n\n.columns.is-mobile > .column.is-4 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 33.33333%;\n}\n\n.columns.is-mobile > .column.is-offset-4 {\n  margin-left: 33.33333%;\n}\n\n.columns.is-mobile > .column.is-5 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 41.66667%;\n}\n\n.columns.is-mobile > .column.is-offset-5 {\n  margin-left: 41.66667%;\n}\n\n.columns.is-mobile > .column.is-6 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 50%;\n}\n\n.columns.is-mobile > .column.is-offset-6 {\n  margin-left: 50%;\n}\n\n.columns.is-mobile > .column.is-7 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 58.33333%;\n}\n\n.columns.is-mobile > .column.is-offset-7 {\n  margin-left: 58.33333%;\n}\n\n.columns.is-mobile > .column.is-8 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 66.66667%;\n}\n\n.columns.is-mobile > .column.is-offset-8 {\n  margin-left: 66.66667%;\n}\n\n.columns.is-mobile > .column.is-9 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 75%;\n}\n\n.columns.is-mobile > .column.is-offset-9 {\n  margin-left: 75%;\n}\n\n.columns.is-mobile > .column.is-10 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 83.33333%;\n}\n\n.columns.is-mobile > .column.is-offset-10 {\n  margin-left: 83.33333%;\n}\n\n.columns.is-mobile > .column.is-11 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 91.66667%;\n}\n\n.columns.is-mobile > .column.is-offset-11 {\n  margin-left: 91.66667%;\n}\n\n.columns.is-mobile > .column.is-12 {\n  -webkit-box-flex: 0;\n      -ms-flex: none;\n          flex: none;\n  width: 100%;\n}\n\n.columns.is-mobile > .column.is-offset-12 {\n  margin-left: 100%;\n}\n\n@media screen and (max-width: 768px) {\n  .column.is-narrow-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters-mobile {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds-mobile {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half-mobile {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third-mobile {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter-mobile {\n    margin-left: 25%;\n  }\n  .column.is-1-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1-mobile {\n    margin-left: 8.33333%;\n  }\n  .column.is-2-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2-mobile {\n    margin-left: 16.66667%;\n  }\n  .column.is-3-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3-mobile {\n    margin-left: 25%;\n  }\n  .column.is-4-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4-mobile {\n    margin-left: 33.33333%;\n  }\n  .column.is-5-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5-mobile {\n    margin-left: 41.66667%;\n  }\n  .column.is-6-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6-mobile {\n    margin-left: 50%;\n  }\n  .column.is-7-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7-mobile {\n    margin-left: 58.33333%;\n  }\n  .column.is-8-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8-mobile {\n    margin-left: 66.66667%;\n  }\n  .column.is-9-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9-mobile {\n    margin-left: 75%;\n  }\n  .column.is-10-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10-mobile {\n    margin-left: 83.33333%;\n  }\n  .column.is-11-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11-mobile {\n    margin-left: 91.66667%;\n  }\n  .column.is-12-mobile {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12-mobile {\n    margin-left: 100%;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .column.is-narrow, .column.is-narrow-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full, .column.is-full-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters, .column.is-three-quarters-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds, .column.is-two-thirds-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half, .column.is-half-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third, .column.is-one-third-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter, .column.is-one-quarter-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters, .column.is-offset-three-quarters-tablet {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds, .column.is-offset-two-thirds-tablet {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half, .column.is-offset-half-tablet {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third, .column.is-offset-one-third-tablet {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter, .column.is-offset-one-quarter-tablet {\n    margin-left: 25%;\n  }\n  .column.is-1, .column.is-1-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1, .column.is-offset-1-tablet {\n    margin-left: 8.33333%;\n  }\n  .column.is-2, .column.is-2-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2, .column.is-offset-2-tablet {\n    margin-left: 16.66667%;\n  }\n  .column.is-3, .column.is-3-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3, .column.is-offset-3-tablet {\n    margin-left: 25%;\n  }\n  .column.is-4, .column.is-4-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4, .column.is-offset-4-tablet {\n    margin-left: 33.33333%;\n  }\n  .column.is-5, .column.is-5-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5, .column.is-offset-5-tablet {\n    margin-left: 41.66667%;\n  }\n  .column.is-6, .column.is-6-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6, .column.is-offset-6-tablet {\n    margin-left: 50%;\n  }\n  .column.is-7, .column.is-7-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7, .column.is-offset-7-tablet {\n    margin-left: 58.33333%;\n  }\n  .column.is-8, .column.is-8-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8, .column.is-offset-8-tablet {\n    margin-left: 66.66667%;\n  }\n  .column.is-9, .column.is-9-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9, .column.is-offset-9-tablet {\n    margin-left: 75%;\n  }\n  .column.is-10, .column.is-10-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10, .column.is-offset-10-tablet {\n    margin-left: 83.33333%;\n  }\n  .column.is-11, .column.is-11-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11, .column.is-offset-11-tablet {\n    margin-left: 91.66667%;\n  }\n  .column.is-12, .column.is-12-tablet {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12, .column.is-offset-12-tablet {\n    margin-left: 100%;\n  }\n}\n\n@media screen and (max-width: 1007px) {\n  .column.is-narrow-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters-touch {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds-touch {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half-touch {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third-touch {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter-touch {\n    margin-left: 25%;\n  }\n  .column.is-1-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1-touch {\n    margin-left: 8.33333%;\n  }\n  .column.is-2-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2-touch {\n    margin-left: 16.66667%;\n  }\n  .column.is-3-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3-touch {\n    margin-left: 25%;\n  }\n  .column.is-4-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4-touch {\n    margin-left: 33.33333%;\n  }\n  .column.is-5-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5-touch {\n    margin-left: 41.66667%;\n  }\n  .column.is-6-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6-touch {\n    margin-left: 50%;\n  }\n  .column.is-7-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7-touch {\n    margin-left: 58.33333%;\n  }\n  .column.is-8-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8-touch {\n    margin-left: 66.66667%;\n  }\n  .column.is-9-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9-touch {\n    margin-left: 75%;\n  }\n  .column.is-10-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10-touch {\n    margin-left: 83.33333%;\n  }\n  .column.is-11-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11-touch {\n    margin-left: 91.66667%;\n  }\n  .column.is-12-touch {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12-touch {\n    margin-left: 100%;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .column.is-narrow-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters-desktop {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds-desktop {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half-desktop {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third-desktop {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter-desktop {\n    margin-left: 25%;\n  }\n  .column.is-1-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1-desktop {\n    margin-left: 8.33333%;\n  }\n  .column.is-2-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2-desktop {\n    margin-left: 16.66667%;\n  }\n  .column.is-3-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3-desktop {\n    margin-left: 25%;\n  }\n  .column.is-4-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4-desktop {\n    margin-left: 33.33333%;\n  }\n  .column.is-5-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5-desktop {\n    margin-left: 41.66667%;\n  }\n  .column.is-6-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6-desktop {\n    margin-left: 50%;\n  }\n  .column.is-7-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7-desktop {\n    margin-left: 58.33333%;\n  }\n  .column.is-8-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8-desktop {\n    margin-left: 66.66667%;\n  }\n  .column.is-9-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9-desktop {\n    margin-left: 75%;\n  }\n  .column.is-10-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10-desktop {\n    margin-left: 83.33333%;\n  }\n  .column.is-11-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11-desktop {\n    margin-left: 91.66667%;\n  }\n  .column.is-12-desktop {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12-desktop {\n    margin-left: 100%;\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .column.is-narrow-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters-widescreen {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds-widescreen {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half-widescreen {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third-widescreen {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter-widescreen {\n    margin-left: 25%;\n  }\n  .column.is-1-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1-widescreen {\n    margin-left: 8.33333%;\n  }\n  .column.is-2-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2-widescreen {\n    margin-left: 16.66667%;\n  }\n  .column.is-3-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3-widescreen {\n    margin-left: 25%;\n  }\n  .column.is-4-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4-widescreen {\n    margin-left: 33.33333%;\n  }\n  .column.is-5-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5-widescreen {\n    margin-left: 41.66667%;\n  }\n  .column.is-6-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6-widescreen {\n    margin-left: 50%;\n  }\n  .column.is-7-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7-widescreen {\n    margin-left: 58.33333%;\n  }\n  .column.is-8-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8-widescreen {\n    margin-left: 66.66667%;\n  }\n  .column.is-9-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9-widescreen {\n    margin-left: 75%;\n  }\n  .column.is-10-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10-widescreen {\n    margin-left: 83.33333%;\n  }\n  .column.is-11-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11-widescreen {\n    margin-left: 91.66667%;\n  }\n  .column.is-12-widescreen {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12-widescreen {\n    margin-left: 100%;\n  }\n}\n\n@media screen and (min-width: 1392px) {\n  .column.is-narrow-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n  }\n  .column.is-full-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-three-quarters-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-two-thirds-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.6666%;\n  }\n  .column.is-half-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-one-third-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.3333%;\n  }\n  .column.is-one-quarter-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-three-quarters-fullhd {\n    margin-left: 75%;\n  }\n  .column.is-offset-two-thirds-fullhd {\n    margin-left: 66.6666%;\n  }\n  .column.is-offset-half-fullhd {\n    margin-left: 50%;\n  }\n  .column.is-offset-one-third-fullhd {\n    margin-left: 33.3333%;\n  }\n  .column.is-offset-one-quarter-fullhd {\n    margin-left: 25%;\n  }\n  .column.is-1-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .column.is-offset-1-fullhd {\n    margin-left: 8.33333%;\n  }\n  .column.is-2-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .column.is-offset-2-fullhd {\n    margin-left: 16.66667%;\n  }\n  .column.is-3-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .column.is-offset-3-fullhd {\n    margin-left: 25%;\n  }\n  .column.is-4-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .column.is-offset-4-fullhd {\n    margin-left: 33.33333%;\n  }\n  .column.is-5-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .column.is-offset-5-fullhd {\n    margin-left: 41.66667%;\n  }\n  .column.is-6-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .column.is-offset-6-fullhd {\n    margin-left: 50%;\n  }\n  .column.is-7-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .column.is-offset-7-fullhd {\n    margin-left: 58.33333%;\n  }\n  .column.is-8-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .column.is-offset-8-fullhd {\n    margin-left: 66.66667%;\n  }\n  .column.is-9-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .column.is-offset-9-fullhd {\n    margin-left: 75%;\n  }\n  .column.is-10-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .column.is-offset-10-fullhd {\n    margin-left: 83.33333%;\n  }\n  .column.is-11-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .column.is-offset-11-fullhd {\n    margin-left: 91.66667%;\n  }\n  .column.is-12-fullhd {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n  .column.is-offset-12-fullhd {\n    margin-left: 100%;\n  }\n}\n\n.columns {\n  margin-left: -0.75rem;\n  margin-right: -0.75rem;\n  margin-top: -0.75rem;\n}\n\n.columns:last-child {\n  margin-bottom: -0.75rem;\n}\n\n.columns:not(:last-child) {\n  margin-bottom: 0.75rem;\n}\n\n.columns.is-centered {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.columns.is-gapless {\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n}\n\n.columns.is-gapless:last-child {\n  margin-bottom: 0;\n}\n\n.columns.is-gapless:not(:last-child) {\n  margin-bottom: 1.5rem;\n}\n\n.columns.is-gapless > .column {\n  margin: 0;\n  padding: 0;\n}\n\n@media screen and (min-width: 769px), print {\n  .columns.is-grid {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n  }\n  .columns.is-grid > .column {\n    max-width: 33.3333%;\n    padding: 0.75rem;\n    width: 33.3333%;\n  }\n  .columns.is-grid > .column + .column {\n    margin-left: 0;\n  }\n}\n\n.columns.is-mobile {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.columns.is-multiline {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.columns.is-vcentered {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n@media screen and (min-width: 769px), print {\n  .columns:not(.is-desktop) {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n@media screen and (min-width: 1008px) {\n  .columns.is-desktop {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n\n.tile {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  display: block;\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  min-height: -webkit-min-content;\n  min-height: -moz-min-content;\n  min-height: min-content;\n}\n\n.tile.is-ancestor {\n  margin-left: -0.75rem;\n  margin-right: -0.75rem;\n  margin-top: -0.75rem;\n}\n\n.tile.is-ancestor:last-child {\n  margin-bottom: -0.75rem;\n}\n\n.tile.is-ancestor:not(:last-child) {\n  margin-bottom: 0.75rem;\n}\n\n.tile.is-child {\n  margin: 0 !important;\n}\n\n.tile.is-parent {\n  padding: 0.75rem;\n}\n\n.tile.is-vertical {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.tile.is-vertical > .tile.is-child:not(:last-child) {\n  margin-bottom: 1.5rem !important;\n}\n\n@media screen and (min-width: 769px), print {\n  .tile:not(.is-child) {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .tile.is-1 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 8.33333%;\n  }\n  .tile.is-2 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 16.66667%;\n  }\n  .tile.is-3 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 25%;\n  }\n  .tile.is-4 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 33.33333%;\n  }\n  .tile.is-5 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 41.66667%;\n  }\n  .tile.is-6 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 50%;\n  }\n  .tile.is-7 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 58.33333%;\n  }\n  .tile.is-8 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 66.66667%;\n  }\n  .tile.is-9 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 75%;\n  }\n  .tile.is-10 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 83.33333%;\n  }\n  .tile.is-11 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 91.66667%;\n  }\n  .tile.is-12 {\n    -webkit-box-flex: 0;\n        -ms-flex: none;\n            flex: none;\n    width: 100%;\n  }\n}\n\n.hero-video {\n  bottom: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  overflow: hidden;\n}\n\n.hero-video video {\n  left: 50%;\n  min-height: 100%;\n  min-width: 100%;\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translate3d(-50%, -50%, 0);\n          transform: translate3d(-50%, -50%, 0);\n}\n\n.hero-video.is-transparent {\n  opacity: 0.3;\n}\n\n@media screen and (max-width: 768px) {\n  .hero-video {\n    display: none;\n  }\n}\n\n.hero-buttons {\n  margin-top: 1.5rem;\n}\n\n@media screen and (max-width: 768px) {\n  .hero-buttons .button {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n  }\n  .hero-buttons .button:not(:last-child) {\n    margin-bottom: 0.75rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .hero-buttons {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n  }\n  .hero-buttons .button:not(:last-child) {\n    margin-right: 1.5rem;\n  }\n}\n\n.hero-head,\n.hero-foot {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n}\n\n.hero-body {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  padding: 3rem 1.5rem;\n}\n\n.hero {\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n  background-color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n\n.hero .nav {\n  background: none;\n  -webkit-box-shadow: 0 1px 0 rgba(219, 219, 219, 0.3);\n          box-shadow: 0 1px 0 rgba(219, 219, 219, 0.3);\n}\n\n.hero .tabs ul {\n  border-bottom: none;\n}\n\n.hero.is-white {\n  background-color: white;\n  color: #0a0a0a;\n}\n\n.hero.is-white a:not(.button),\n.hero.is-white strong {\n  color: inherit;\n}\n\n.hero.is-white .title {\n  color: #0a0a0a;\n}\n\n.hero.is-white .subtitle {\n  color: rgba(10, 10, 10, 0.9);\n}\n\n.hero.is-white .subtitle a:not(.button),\n.hero.is-white .subtitle strong {\n  color: #0a0a0a;\n}\n\n.hero.is-white .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(10, 10, 10, 0.2);\n          box-shadow: 0 1px 0 rgba(10, 10, 10, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-white .nav-menu {\n    background-color: white;\n  }\n}\n\n.hero.is-white a.nav-item,\n.hero.is-white .nav-item a:not(.button) {\n  color: rgba(10, 10, 10, 0.7);\n}\n\n.hero.is-white a.nav-item:hover, .hero.is-white a.nav-item.is-active,\n.hero.is-white .nav-item a:not(.button):hover,\n.hero.is-white .nav-item a:not(.button).is-active {\n  color: #0a0a0a;\n}\n\n.hero.is-white .tabs a {\n  color: #0a0a0a;\n  opacity: 0.9;\n}\n\n.hero.is-white .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-white .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-white .tabs.is-boxed a, .hero.is-white .tabs.is-toggle a {\n  color: #0a0a0a;\n}\n\n.hero.is-white .tabs.is-boxed a:hover, .hero.is-white .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-white .tabs.is-boxed li.is-active a, .hero.is-white .tabs.is-boxed li.is-active a:hover, .hero.is-white .tabs.is-toggle li.is-active a, .hero.is-white .tabs.is-toggle li.is-active a:hover {\n  background-color: #0a0a0a;\n  border-color: #0a0a0a;\n  color: white;\n}\n\n.hero.is-white.is-bold {\n  background-image: linear-gradient(141deg, #e6e6e6 0%, white 71%, white 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-white.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #e6e6e6 0%, white 71%, white 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-white .nav-toggle span {\n    background-color: #0a0a0a;\n  }\n  .hero.is-white .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-white .nav-toggle.is-active span {\n    background-color: #0a0a0a;\n  }\n  .hero.is-white .nav-menu .nav-item {\n    border-top-color: rgba(10, 10, 10, 0.2);\n  }\n}\n\n.hero.is-black {\n  background-color: #0a0a0a;\n  color: white;\n}\n\n.hero.is-black a:not(.button),\n.hero.is-black strong {\n  color: inherit;\n}\n\n.hero.is-black .title {\n  color: white;\n}\n\n.hero.is-black .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.hero.is-black .subtitle a:not(.button),\n.hero.is-black .subtitle strong {\n  color: white;\n}\n\n.hero.is-black .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-black .nav-menu {\n    background-color: #0a0a0a;\n  }\n}\n\n.hero.is-black a.nav-item,\n.hero.is-black .nav-item a:not(.button) {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.hero.is-black a.nav-item:hover, .hero.is-black a.nav-item.is-active,\n.hero.is-black .nav-item a:not(.button):hover,\n.hero.is-black .nav-item a:not(.button).is-active {\n  color: white;\n}\n\n.hero.is-black .tabs a {\n  color: white;\n  opacity: 0.9;\n}\n\n.hero.is-black .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-black .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-black .tabs.is-boxed a, .hero.is-black .tabs.is-toggle a {\n  color: white;\n}\n\n.hero.is-black .tabs.is-boxed a:hover, .hero.is-black .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-black .tabs.is-boxed li.is-active a, .hero.is-black .tabs.is-boxed li.is-active a:hover, .hero.is-black .tabs.is-toggle li.is-active a, .hero.is-black .tabs.is-toggle li.is-active a:hover {\n  background-color: white;\n  border-color: white;\n  color: #0a0a0a;\n}\n\n.hero.is-black.is-bold {\n  background-image: linear-gradient(141deg, black 0%, #0a0a0a 71%, #181616 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-black.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, black 0%, #0a0a0a 71%, #181616 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-black .nav-toggle span {\n    background-color: white;\n  }\n  .hero.is-black .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-black .nav-toggle.is-active span {\n    background-color: white;\n  }\n  .hero.is-black .nav-menu .nav-item {\n    border-top-color: rgba(255, 255, 255, 0.2);\n  }\n}\n\n.hero.is-light {\n  background-color: whitesmoke;\n  color: #363636;\n}\n\n.hero.is-light a:not(.button),\n.hero.is-light strong {\n  color: inherit;\n}\n\n.hero.is-light .title {\n  color: #363636;\n}\n\n.hero.is-light .subtitle {\n  color: rgba(54, 54, 54, 0.9);\n}\n\n.hero.is-light .subtitle a:not(.button),\n.hero.is-light .subtitle strong {\n  color: #363636;\n}\n\n.hero.is-light .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(54, 54, 54, 0.2);\n          box-shadow: 0 1px 0 rgba(54, 54, 54, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-light .nav-menu {\n    background-color: whitesmoke;\n  }\n}\n\n.hero.is-light a.nav-item,\n.hero.is-light .nav-item a:not(.button) {\n  color: rgba(54, 54, 54, 0.7);\n}\n\n.hero.is-light a.nav-item:hover, .hero.is-light a.nav-item.is-active,\n.hero.is-light .nav-item a:not(.button):hover,\n.hero.is-light .nav-item a:not(.button).is-active {\n  color: #363636;\n}\n\n.hero.is-light .tabs a {\n  color: #363636;\n  opacity: 0.9;\n}\n\n.hero.is-light .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-light .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-light .tabs.is-boxed a, .hero.is-light .tabs.is-toggle a {\n  color: #363636;\n}\n\n.hero.is-light .tabs.is-boxed a:hover, .hero.is-light .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-light .tabs.is-boxed li.is-active a, .hero.is-light .tabs.is-boxed li.is-active a:hover, .hero.is-light .tabs.is-toggle li.is-active a, .hero.is-light .tabs.is-toggle li.is-active a:hover {\n  background-color: #363636;\n  border-color: #363636;\n  color: whitesmoke;\n}\n\n.hero.is-light.is-bold {\n  background-image: linear-gradient(141deg, #dfd8d9 0%, whitesmoke 71%, white 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-light.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #dfd8d9 0%, whitesmoke 71%, white 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-light .nav-toggle span {\n    background-color: #363636;\n  }\n  .hero.is-light .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-light .nav-toggle.is-active span {\n    background-color: #363636;\n  }\n  .hero.is-light .nav-menu .nav-item {\n    border-top-color: rgba(54, 54, 54, 0.2);\n  }\n}\n\n.hero.is-dark {\n  background-color: #363636;\n  color: whitesmoke;\n}\n\n.hero.is-dark a:not(.button),\n.hero.is-dark strong {\n  color: inherit;\n}\n\n.hero.is-dark .title {\n  color: whitesmoke;\n}\n\n.hero.is-dark .subtitle {\n  color: rgba(245, 245, 245, 0.9);\n}\n\n.hero.is-dark .subtitle a:not(.button),\n.hero.is-dark .subtitle strong {\n  color: whitesmoke;\n}\n\n.hero.is-dark .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(245, 245, 245, 0.2);\n          box-shadow: 0 1px 0 rgba(245, 245, 245, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-dark .nav-menu {\n    background-color: #363636;\n  }\n}\n\n.hero.is-dark a.nav-item,\n.hero.is-dark .nav-item a:not(.button) {\n  color: rgba(245, 245, 245, 0.7);\n}\n\n.hero.is-dark a.nav-item:hover, .hero.is-dark a.nav-item.is-active,\n.hero.is-dark .nav-item a:not(.button):hover,\n.hero.is-dark .nav-item a:not(.button).is-active {\n  color: whitesmoke;\n}\n\n.hero.is-dark .tabs a {\n  color: whitesmoke;\n  opacity: 0.9;\n}\n\n.hero.is-dark .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-dark .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-dark .tabs.is-boxed a, .hero.is-dark .tabs.is-toggle a {\n  color: whitesmoke;\n}\n\n.hero.is-dark .tabs.is-boxed a:hover, .hero.is-dark .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-dark .tabs.is-boxed li.is-active a, .hero.is-dark .tabs.is-boxed li.is-active a:hover, .hero.is-dark .tabs.is-toggle li.is-active a, .hero.is-dark .tabs.is-toggle li.is-active a:hover {\n  background-color: whitesmoke;\n  border-color: whitesmoke;\n  color: #363636;\n}\n\n.hero.is-dark.is-bold {\n  background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-dark.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-dark .nav-toggle span {\n    background-color: whitesmoke;\n  }\n  .hero.is-dark .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-dark .nav-toggle.is-active span {\n    background-color: whitesmoke;\n  }\n  .hero.is-dark .nav-menu .nav-item {\n    border-top-color: rgba(245, 245, 245, 0.2);\n  }\n}\n\n.hero.is-primary {\n  background-color: #00d1b2;\n  color: #fff;\n}\n\n.hero.is-primary a:not(.button),\n.hero.is-primary strong {\n  color: inherit;\n}\n\n.hero.is-primary .title {\n  color: #fff;\n}\n\n.hero.is-primary .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.hero.is-primary .subtitle a:not(.button),\n.hero.is-primary .subtitle strong {\n  color: #fff;\n}\n\n.hero.is-primary .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-primary .nav-menu {\n    background-color: #00d1b2;\n  }\n}\n\n.hero.is-primary a.nav-item,\n.hero.is-primary .nav-item a:not(.button) {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.hero.is-primary a.nav-item:hover, .hero.is-primary a.nav-item.is-active,\n.hero.is-primary .nav-item a:not(.button):hover,\n.hero.is-primary .nav-item a:not(.button).is-active {\n  color: #fff;\n}\n\n.hero.is-primary .tabs a {\n  color: #fff;\n  opacity: 0.9;\n}\n\n.hero.is-primary .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-primary .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-primary .tabs.is-boxed a, .hero.is-primary .tabs.is-toggle a {\n  color: #fff;\n}\n\n.hero.is-primary .tabs.is-boxed a:hover, .hero.is-primary .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-primary .tabs.is-boxed li.is-active a, .hero.is-primary .tabs.is-boxed li.is-active a:hover, .hero.is-primary .tabs.is-toggle li.is-active a, .hero.is-primary .tabs.is-toggle li.is-active a:hover {\n  background-color: #fff;\n  border-color: #fff;\n  color: #00d1b2;\n}\n\n.hero.is-primary.is-bold {\n  background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-primary.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-primary .nav-toggle span {\n    background-color: #fff;\n  }\n  .hero.is-primary .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-primary .nav-toggle.is-active span {\n    background-color: #fff;\n  }\n  .hero.is-primary .nav-menu .nav-item {\n    border-top-color: rgba(255, 255, 255, 0.2);\n  }\n}\n\n.hero.is-info {\n  background-color: #3273dc;\n  color: #fff;\n}\n\n.hero.is-info a:not(.button),\n.hero.is-info strong {\n  color: inherit;\n}\n\n.hero.is-info .title {\n  color: #fff;\n}\n\n.hero.is-info .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.hero.is-info .subtitle a:not(.button),\n.hero.is-info .subtitle strong {\n  color: #fff;\n}\n\n.hero.is-info .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-info .nav-menu {\n    background-color: #3273dc;\n  }\n}\n\n.hero.is-info a.nav-item,\n.hero.is-info .nav-item a:not(.button) {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.hero.is-info a.nav-item:hover, .hero.is-info a.nav-item.is-active,\n.hero.is-info .nav-item a:not(.button):hover,\n.hero.is-info .nav-item a:not(.button).is-active {\n  color: #fff;\n}\n\n.hero.is-info .tabs a {\n  color: #fff;\n  opacity: 0.9;\n}\n\n.hero.is-info .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-info .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-info .tabs.is-boxed a, .hero.is-info .tabs.is-toggle a {\n  color: #fff;\n}\n\n.hero.is-info .tabs.is-boxed a:hover, .hero.is-info .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-info .tabs.is-boxed li.is-active a, .hero.is-info .tabs.is-boxed li.is-active a:hover, .hero.is-info .tabs.is-toggle li.is-active a, .hero.is-info .tabs.is-toggle li.is-active a:hover {\n  background-color: #fff;\n  border-color: #fff;\n  color: #3273dc;\n}\n\n.hero.is-info.is-bold {\n  background-image: linear-gradient(141deg, #1577c6 0%, #3273dc 71%, #4366e5 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-info.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #1577c6 0%, #3273dc 71%, #4366e5 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-info .nav-toggle span {\n    background-color: #fff;\n  }\n  .hero.is-info .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-info .nav-toggle.is-active span {\n    background-color: #fff;\n  }\n  .hero.is-info .nav-menu .nav-item {\n    border-top-color: rgba(255, 255, 255, 0.2);\n  }\n}\n\n.hero.is-success {\n  background-color: #23d160;\n  color: #fff;\n}\n\n.hero.is-success a:not(.button),\n.hero.is-success strong {\n  color: inherit;\n}\n\n.hero.is-success .title {\n  color: #fff;\n}\n\n.hero.is-success .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.hero.is-success .subtitle a:not(.button),\n.hero.is-success .subtitle strong {\n  color: #fff;\n}\n\n.hero.is-success .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-success .nav-menu {\n    background-color: #23d160;\n  }\n}\n\n.hero.is-success a.nav-item,\n.hero.is-success .nav-item a:not(.button) {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.hero.is-success a.nav-item:hover, .hero.is-success a.nav-item.is-active,\n.hero.is-success .nav-item a:not(.button):hover,\n.hero.is-success .nav-item a:not(.button).is-active {\n  color: #fff;\n}\n\n.hero.is-success .tabs a {\n  color: #fff;\n  opacity: 0.9;\n}\n\n.hero.is-success .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-success .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-success .tabs.is-boxed a, .hero.is-success .tabs.is-toggle a {\n  color: #fff;\n}\n\n.hero.is-success .tabs.is-boxed a:hover, .hero.is-success .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-success .tabs.is-boxed li.is-active a, .hero.is-success .tabs.is-boxed li.is-active a:hover, .hero.is-success .tabs.is-toggle li.is-active a, .hero.is-success .tabs.is-toggle li.is-active a:hover {\n  background-color: #fff;\n  border-color: #fff;\n  color: #23d160;\n}\n\n.hero.is-success.is-bold {\n  background-image: linear-gradient(141deg, #12af2f 0%, #23d160 71%, #2ce28a 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-success.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #12af2f 0%, #23d160 71%, #2ce28a 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-success .nav-toggle span {\n    background-color: #fff;\n  }\n  .hero.is-success .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-success .nav-toggle.is-active span {\n    background-color: #fff;\n  }\n  .hero.is-success .nav-menu .nav-item {\n    border-top-color: rgba(255, 255, 255, 0.2);\n  }\n}\n\n.hero.is-warning {\n  background-color: #ffdd57;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning a:not(.button),\n.hero.is-warning strong {\n  color: inherit;\n}\n\n.hero.is-warning .title {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning .subtitle {\n  color: rgba(0, 0, 0, 0.9);\n}\n\n.hero.is-warning .subtitle a:not(.button),\n.hero.is-warning .subtitle strong {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-warning .nav-menu {\n    background-color: #ffdd57;\n  }\n}\n\n.hero.is-warning a.nav-item,\n.hero.is-warning .nav-item a:not(.button) {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning a.nav-item:hover, .hero.is-warning a.nav-item.is-active,\n.hero.is-warning .nav-item a:not(.button):hover,\n.hero.is-warning .nav-item a:not(.button).is-active {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning .tabs a {\n  color: rgba(0, 0, 0, 0.7);\n  opacity: 0.9;\n}\n\n.hero.is-warning .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-warning .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-warning .tabs.is-boxed a, .hero.is-warning .tabs.is-toggle a {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.hero.is-warning .tabs.is-boxed a:hover, .hero.is-warning .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-warning .tabs.is-boxed li.is-active a, .hero.is-warning .tabs.is-boxed li.is-active a:hover, .hero.is-warning .tabs.is-toggle li.is-active a, .hero.is-warning .tabs.is-toggle li.is-active a:hover {\n  background-color: rgba(0, 0, 0, 0.7);\n  border-color: rgba(0, 0, 0, 0.7);\n  color: #ffdd57;\n}\n\n.hero.is-warning.is-bold {\n  background-image: linear-gradient(141deg, #ffaf24 0%, #ffdd57 71%, #fffa70 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-warning.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #ffaf24 0%, #ffdd57 71%, #fffa70 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-warning .nav-toggle span {\n    background-color: rgba(0, 0, 0, 0.7);\n  }\n  .hero.is-warning .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-warning .nav-toggle.is-active span {\n    background-color: rgba(0, 0, 0, 0.7);\n  }\n  .hero.is-warning .nav-menu .nav-item {\n    border-top-color: rgba(0, 0, 0, 0.2);\n  }\n}\n\n.hero.is-danger {\n  background-color: #ff3860;\n  color: #fff;\n}\n\n.hero.is-danger a:not(.button),\n.hero.is-danger strong {\n  color: inherit;\n}\n\n.hero.is-danger .title {\n  color: #fff;\n}\n\n.hero.is-danger .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.hero.is-danger .subtitle a:not(.button),\n.hero.is-danger .subtitle strong {\n  color: #fff;\n}\n\n.hero.is-danger .nav {\n  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-danger .nav-menu {\n    background-color: #ff3860;\n  }\n}\n\n.hero.is-danger a.nav-item,\n.hero.is-danger .nav-item a:not(.button) {\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.hero.is-danger a.nav-item:hover, .hero.is-danger a.nav-item.is-active,\n.hero.is-danger .nav-item a:not(.button):hover,\n.hero.is-danger .nav-item a:not(.button).is-active {\n  color: #fff;\n}\n\n.hero.is-danger .tabs a {\n  color: #fff;\n  opacity: 0.9;\n}\n\n.hero.is-danger .tabs a:hover {\n  opacity: 1;\n}\n\n.hero.is-danger .tabs li.is-active a {\n  opacity: 1;\n}\n\n.hero.is-danger .tabs.is-boxed a, .hero.is-danger .tabs.is-toggle a {\n  color: #fff;\n}\n\n.hero.is-danger .tabs.is-boxed a:hover, .hero.is-danger .tabs.is-toggle a:hover {\n  background-color: rgba(10, 10, 10, 0.1);\n}\n\n.hero.is-danger .tabs.is-boxed li.is-active a, .hero.is-danger .tabs.is-boxed li.is-active a:hover, .hero.is-danger .tabs.is-toggle li.is-active a, .hero.is-danger .tabs.is-toggle li.is-active a:hover {\n  background-color: #fff;\n  border-color: #fff;\n  color: #ff3860;\n}\n\n.hero.is-danger.is-bold {\n  background-image: linear-gradient(141deg, #ff0561 0%, #ff3860 71%, #ff5257 100%);\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-danger.is-bold .nav-menu {\n    background-image: linear-gradient(141deg, #ff0561 0%, #ff3860 71%, #ff5257 100%);\n  }\n}\n\n@media screen and (max-width: 768px) {\n  .hero.is-danger .nav-toggle span {\n    background-color: #fff;\n  }\n  .hero.is-danger .nav-toggle:hover {\n    background-color: rgba(10, 10, 10, 0.1);\n  }\n  .hero.is-danger .nav-toggle.is-active span {\n    background-color: #fff;\n  }\n  .hero.is-danger .nav-menu .nav-item {\n    border-top-color: rgba(255, 255, 255, 0.2);\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .hero.is-medium .hero-body {\n    padding-bottom: 9rem;\n    padding-top: 9rem;\n  }\n}\n\n@media screen and (min-width: 769px), print {\n  .hero.is-large .hero-body {\n    padding-bottom: 18rem;\n    padding-top: 18rem;\n  }\n}\n\n.hero.is-halfheight .hero-body, .hero.is-fullheight .hero-body {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.hero.is-halfheight .hero-body > .container, .hero.is-fullheight .hero-body > .container {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n\n.hero.is-halfheight {\n  min-height: 50vh;\n}\n\n.hero.is-fullheight {\n  min-height: 100vh;\n}\n\n.section {\n  background-color: white;\n  padding: 3rem 1.5rem;\n}\n\n@media screen and (min-width: 1008px) {\n  .section.is-medium {\n    padding: 9rem 1.5rem;\n  }\n  .section.is-large {\n    padding: 18rem 1.5rem;\n  }\n}\n\n.footer {\n  background-color: whitesmoke;\n  padding: 3rem 1.5rem 6rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2J1bG1hLnNhc3MiLCIuLi9zYXNzL3V0aWxpdGllcy9hbmltYXRpb25zLnNhc3MiLCJidWxtYS5jc3MiLCIuLi9zYXNzL2Jhc2UvbWluaXJlc2V0LnNhc3MiLCIuLi9zYXNzL2Jhc2UvZ2VuZXJpYy5zYXNzIiwiLi4vc2Fzcy91dGlsaXRpZXMvaW5pdGlhbC12YXJpYWJsZXMuc2FzcyIsIi4uL3Nhc3MvdXRpbGl0aWVzL21peGlucy5zYXNzIiwiLi4vc2Fzcy9iYXNlL2hlbHBlcnMuc2FzcyIsIi4uL3Nhc3MvZWxlbWVudHMvYm94LnNhc3MiLCIuLi9zYXNzL2VsZW1lbnRzL2J1dHRvbi5zYXNzIiwiLi4vc2Fzcy91dGlsaXRpZXMvY29udHJvbHMuc2FzcyIsIi4uL3Nhc3MvdXRpbGl0aWVzL2Z1bmN0aW9ucy5zYXNzIiwiLi4vc2Fzcy9lbGVtZW50cy9jb250ZW50LnNhc3MiLCIuLi9zYXNzL2VsZW1lbnRzL2Zvcm0uc2FzcyIsIi4uL3Nhc3MvZWxlbWVudHMvaWNvbi5zYXNzIiwiLi4vc2Fzcy9lbGVtZW50cy9pbWFnZS5zYXNzIiwiLi4vc2Fzcy9lbGVtZW50cy9ub3RpZmljYXRpb24uc2FzcyIsIi4uL3Nhc3MvZWxlbWVudHMvcHJvZ3Jlc3Muc2FzcyIsIi4uL3Nhc3MvZWxlbWVudHMvdGFibGUuc2FzcyIsIi4uL3Nhc3MvZWxlbWVudHMvdGFnLnNhc3MiLCIuLi9zYXNzL2VsZW1lbnRzL3RpdGxlLnNhc3MiLCIuLi9zYXNzL2VsZW1lbnRzL290aGVyLnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi5zYXNzIiwiLi4vc2Fzcy9jb21wb25lbnRzL2NhcmQuc2FzcyIsIi4uL3Nhc3MvY29tcG9uZW50cy9kcm9wZG93bi5zYXNzIiwiLi4vc2Fzcy9jb21wb25lbnRzL2xldmVsLnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvbWVkaWEuc2FzcyIsIi4uL3Nhc3MvY29tcG9uZW50cy9tZW51LnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvbWVzc2FnZS5zYXNzIiwiLi4vc2Fzcy9jb21wb25lbnRzL21vZGFsLnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvbmF2LnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvbmF2YmFyLnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5zYXNzIiwiLi4vc2Fzcy9jb21wb25lbnRzL3BhbmVsLnNhc3MiLCIuLi9zYXNzL2NvbXBvbmVudHMvdGFicy5zYXNzIiwiLi4vc2Fzcy9ncmlkL2NvbHVtbnMuc2FzcyIsIi4uL3Nhc3MvZ3JpZC90aWxlcy5zYXNzIiwiLi4vc2Fzcy9sYXlvdXQvaGVyby5zYXNzIiwiLi4vc2Fzcy9sYXlvdXQvc2VjdGlvbi5zYXNzIiwiLi4vc2Fzcy9sYXlvdXQvZm9vdGVyLnNhc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsOERBQThEO0FDRDlEO0VBQ0U7SUFDRSxnQ0FBdUI7WUFBdkIsd0JBQXVCO0dDRXhCO0VEREQ7SUFDRSxrQ0FBeUI7WUFBekIsMEJBQXlCO0dDRzFCO0NBQ0Y7QURSRDtFQUNFO0lBQ0UsZ0NBQXVCO1lBQXZCLHdCQUF1QjtHQ0V4QjtFREREO0lBQ0Usa0NBQXlCO1lBQXpCLDBCQUF5QjtHQ0cxQjtDQUNGOztBQ1JELDJFQUEyRTtBQUUzRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QkUsVUFBUztFQUNULFdBQVU7Q0FBSTs7QUFHaEI7Ozs7OztFQU1FLGdCQUFlO0VBQ2Ysb0JBQW1CO0NBQUk7O0FBR3pCO0VBQ0UsaUJBQWdCO0NBQUk7O0FBR3RCOzs7O0VBSUUsVUFBUztDQUFJOztBQUdmO0VBQ0UsK0JBQXNCO1VBQXRCLHVCQUFzQjtDQUFJOztBQUU1QjtFQUNFLDRCQUFtQjtVQUFuQixvQkFBbUI7Q0FHUTs7QUFKN0I7RUFJSSw0QkFBbUI7VUFBbkIsb0JBQW1CO0NBQUk7O0FBRzNCOzs7OztFQUtFLGdCQUFlO0NBQUk7O0FBR3JCO0VBQ0UsVUFBUztDQUFJOztBQUdmO0VBQ0UsMEJBQXlCO0VBQ3pCLGtCQUFpQjtD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NUxFO0lBQ0UsdUNBQStCO0lBQS9CLHVDQUErQjtJQUEvQixnQ0FBK0I7R0FBRztDTGthdkM7O0FJbk9DO0VDN0xFO0lBQ0UsdUNBQStCO0lBQS9CLHVDQUErQjtJQUEvQixnQ0FBK0I7R0FBRztDTHFhdkM7O0FJL2FDO0VBQ0UsWUFBVztFQUNYLGFBQVk7RUFDWixlQUFjO0NBQUk7O0FDY3RCO0VBQ0UsdUJBQXNCO0NBQUk7O0FBRTVCO0VBQ0Usd0JBQXVCO0NBQUk7O0FBSTdCO0VBQ0UsNEJBQTJCO0NBQUk7O0FBSWpDO0VEa0hFLFVBRHVCO0VBRXZCLFFBRnVCO0VBR3ZCLG1CQUFrQjtFQUNsQixTQUp1QjtFQUt2QixPQUx1QjtDQ2hISjs7QUFNbkI7RUFDRSxnQkZ6QlM7Q0V5QlU7O0FEd0lyQjtFQ3RJRTtJQUNFLGdCRjVCTztHRTRCWTtDTDBheEI7O0FJalNDO0VDdklFO0lBQ0UsZ0JGL0JPO0dFK0JZO0NMNmF4Qjs7QUkvUkM7RUM1SUU7SUFDRSxnQkZsQ087R0VrQ1k7Q0xnYnhCOztBSWpTQztFQzdJRTtJQUNFLGdCRnJDTztHRXFDWTtDTG1ieEI7O0FJL1JDO0VDbEpFO0lBQ0UsZ0JGeENPO0dFd0NZO0NMc2J4Qjs7QUk3UkM7RUN2SkU7SUFDRSxnQkYzQ087R0UyQ1k7Q0x5YnhCOztBSzVjQztFQUNFLGtCRnhCVztDRXdCUTs7QUR3SXJCO0VDdElFO0lBQ0Usa0JGM0JTO0dFMkJVO0NMa2R4Qjs7QUl6VUM7RUN2SUU7SUFDRSxrQkY5QlM7R0U4QlU7Q0xxZHhCOztBSXZVQztFQzVJRTtJQUNFLGtCRmpDUztHRWlDVTtDTHdkeEI7O0FJelVDO0VDN0lFO0lBQ0Usa0JGcENTO0dFb0NVO0NMMmR4Qjs7QUl2VUM7RUNsSkU7SUFDRSxrQkZ2Q1M7R0V1Q1U7Q0w4ZHhCOztBSXJVQztFQ3ZKRTtJQUNFLGtCRjFDUztHRTBDVTtDTGlleEI7O0FLcGZDO0VBQ0UsZ0JGdkJTO0NFdUJVOztBRHdJckI7RUN0SUU7SUFDRSxnQkYxQk87R0UwQlk7Q0wwZnhCOztBSWpYQztFQ3ZJRTtJQUNFLGdCRjdCTztHRTZCWTtDTDZmeEI7O0FJL1dDO0VDNUlFO0lBQ0UsZ0JGaENPO0dFZ0NZO0NMZ2dCeEI7O0FJalhDO0VDN0lFO0lBQ0UsZ0JGbkNPO0dFbUNZO0NMbWdCeEI7O0FJL1dDO0VDbEpFO0lBQ0UsZ0JGdENPO0dFc0NZO0NMc2dCeEI7O0FJN1dDO0VDdkpFO0lBQ0UsZ0JGekNPO0dFeUNZO0NMeWdCeEI7O0FLNWhCQztFQUNFLGtCRnRCVztDRXNCUTs7QUR3SXJCO0VDdElFO0lBQ0Usa0JGekJTO0dFeUJVO0NMa2lCeEI7O0FJelpDO0VDdklFO0lBQ0Usa0JGNUJTO0dFNEJVO0NMcWlCeEI7O0FJdlpDO0VDNUlFO0lBQ0Usa0JGL0JTO0dFK0JVO0NMd2lCeEI7O0FJelpDO0VDN0lFO0lBQ0Usa0JGbENTO0dFa0NVO0NMMmlCeEI7O0FJdlpDO0VDbEpFO0lBQ0Usa0JGckNTO0dFcUNVO0NMOGlCeEI7O0FJclpDO0VDdkpFO0lBQ0Usa0JGeENTO0dFd0NVO0NMaWpCeEI7O0FLcGtCQztFQUNFLG1CRnJCWTtDRXFCTzs7QUR3SXJCO0VDdElFO0lBQ0UsbUJGeEJVO0dFd0JTO0NMMGtCeEI7O0FJamNDO0VDdklFO0lBQ0UsbUJGM0JVO0dFMkJTO0NMNmtCeEI7O0FJL2JDO0VDNUlFO0lBQ0UsbUJGOUJVO0dFOEJTO0NMZ2xCeEI7O0FJamNDO0VDN0lFO0lBQ0UsbUJGakNVO0dFaUNTO0NMbWxCeEI7O0FJL2JDO0VDbEpFO0lBQ0UsbUJGcENVO0dFb0NTO0NMc2xCeEI7O0FJN2JDO0VDdkpFO0lBQ0UsbUJGdkNVO0dFdUNTO0NMeWxCeEI7O0FLNW1CQztFQUNFLGdCRnBCUztDRW9CVTs7QUR3SXJCO0VDdElFO0lBQ0UsZ0JGdkJPO0dFdUJZO0NMa25CeEI7O0FJemVDO0VDdklFO0lBQ0UsZ0JGMUJPO0dFMEJZO0NMcW5CeEI7O0FJdmVDO0VDNUlFO0lBQ0UsZ0JGN0JPO0dFNkJZO0NMd25CeEI7O0FJemVDO0VDN0lFO0lBQ0UsZ0JGaENPO0dFZ0NZO0NMMm5CeEI7O0FJdmVDO0VDbEpFO0lBQ0UsZ0JGbkNP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SUE4RWMsMEJoQzNIZTtHZ0MySG1CO0VBOUVoRDtJQWlGWSx3Q2hDOUhpQjtHZ0M4SDRCO0NuQ204TXhEOztBbUNwaE5EO0VBaUJNLDBCaEM5RHVCO0VnQytEdkIsYWhDbkR5QjtDZ0NrSGdDOztBQWpGL0Q7O0VBcUJRLGVBQWM7Q0FBSTs7QUFyQjFCO0VBdUJRLGFoQ3hEdUI7Q2dDd0RBOztBQXZCL0I7RUF5QlEsZ0NoQzFEdUI7Q2dDNkRJOztBQTVCbkM7O0VBNEJVLGFoQzdEcUI7Q2dDNkRFOztBQTVCakM7RUE4QlEscURoQy9EdUI7VWdDK0R2Qiw2Q2hDL0R1QjtDZ0MrRHdCOztBL0JrSHJEO0UrQmhKRjtJQWlDVSwwQmhDOUVtQjtHZ0M4RVU7Q25Db2hOdEM7O0FtQ3JqTkQ7O0VBb0NRLGdDaENyRXVCO0NnQ3dFSTs7QUF2Q25DOzs7RUF1Q1UsYWhDeEVxQjtDZ0N3RUU7O0FBdkNqQztFQTBDVSxhaEMzRXFCO0VnQzRFckIsYUFBWTtDQUVNOztBQTdDNUI7RUE2Q1ksV0FBVTtDQUFJOztBQTdDMUI7RUFnRFksV0FBVTtDQUFJOztBQWhEMUI7RUFvRFksYWhDckZtQjtDZ0N1RnVCOztBQXREdEQ7RUFzRGMsd0NoQ25HZTtDZ0NtR3VCOztBQXREcEQ7RUEwRGMsd0JoQzNGaUI7RWdDNEZqQixvQmhDNUZpQjtFZ0M2RmpCLGVoQ3pHZTtDZ0N5R0M7O0FBNUQ5QjtFQWlFUSwrRUFBeUc7Q0FHVzs7QS9CNEUxSDtFK0JoSkY7SUFvRVksK0VBQXlHO0dBQUc7Q25DaWlOdkg7O0FJcjlNQztFK0JoSkY7SUF5RVksd0JoQzFHbUI7R2dDMEdlO0VBekU5QztJQTJFWSx3Q2hDeEhpQjtHZ0N3SHFCO0VBM0VsRDtJQThFYyx3QmhDL0dpQjtHZ0MrR2lCO0VBOUVoRDtJQWlGWSwyQ2hDbEhtQjtHZ0NrSDBCO0NuQ21pTnhEOztBbUNwbk5EO0VBaUJNLDZCaENwRHdCO0VnQ3FEeEIsZWhDM0R3QjtDZ0MwSGlDOztBQWpGL0Q7O0VBcUJRLGVBQWM7Q0FBSTs7QUFyQjFCO0VBdUJRLGVoQ2hFc0I7Q2dDZ0VDOztBQXZCL0I7RUF5QlEsNkJoQ2xFc0I7Q2dDcUVLOztBQTVCbkM7O0VBNEJVLGVoQ3JFb0I7Q2dDcUVHOztBQTVCakM7RUE4QlEsa0RoQ3ZFc0I7VWdDdUV0QiwwQ2hDdkVzQjtDZ0N1RXlCOztBL0JrSHJEO0UrQmhKRjtJQWlDVSw2QmhDcEVvQjtHZ0NvRVM7Q25Db25OdEM7O0FtQ3JwTkQ7O0VBb0NRLDZCaEM3RXNCO0NnQ2dGSzs7QUF2Q25DOzs7RUF1Q1UsZWhDaEZvQjtDZ0NnRkc7O0FBdkNqQztFQTBDVSxlaENuRm9CO0VnQ29GcEIsYUFBWTtDQUVNOztBQTdDNUI7RUE2Q1ksV0FBVTtDQUFJOztBQTdDMUI7RUFnRFksV0FBVTtDQUFJOztBQWhEMUI7RUFvRFksZWhDN0ZrQjtDZ0MrRndCOztBQXREdEQ7RUFzRGMsd0NoQ25HZTtDZ0NtR3VCOztBQXREcEQ7RUEwRGMsMEJoQ25HZ0I7RWdDb0doQixzQmhDcEdnQjtFZ0NxR2hCLGtCaEMvRmdCO0NnQytGQTs7QUE1RDlCO0VBaUVRLGtGQUF5RztDQUdXOztBL0I0RTFIO0UrQmhKRjtJQW9FWSxrRkFBeUc7R0FBRztDbkNpb052SDs7QUlyak5DO0UrQmhKRjtJQXlFWSwwQmhDbEhrQjtHZ0NrSGdCO0VBekU5QztJQTJFWSx3Q2hDeEhpQjtHZ0N3SHFCO0VBM0VsRDtJQThFYywwQmhDdkhnQjtHZ0N1SGtCO0VBOUVoRDtJQWlGWSx3Q2hDMUhrQjtHZ0MwSDJCO0NuQ21vTnhEOztBbUNwdE5EO0VBaUJNLDBCaEMxRHdCO0VnQzJEeEIsa0JoQ3JEd0I7Q2dDb0hpQzs7QUFqRi9EOztFQXFCUSxlQUFjO0NBQUk7O0FBckIxQjtFQXVCUSxrQmhDMURzQjtDZ0MwREM7O0FBdkIvQjtFQXlCUSxnQ2hDNURzQjtDZ0MrREs7O0FBNUJuQzs7RUE0QlUsa0JoQy9Eb0I7Q2dDK0RHOztBQTVCakM7RUE4QlEscURoQ2pFc0I7VWdDaUV0Qiw2Q2hDakVzQjtDZ0NpRXlCOztBL0JrSHJEO0UrQmhKRjtJQWlDVSwwQmhDMUVvQjtHZ0MwRVM7Q25Db3ROdEM7O0FtQ3J2TkQ7O0VBb0NRLGdDaEN2RXNCO0NnQzBFSzs7QUF2Q25DOzs7RUF1Q1Usa0JoQzFFb0I7Q2dDMEVHOztBQXZDakM7RUEwQ1Usa0JoQzdFb0I7RWdDOEVwQixhQUFZO0NBRU07O0FBN0M1QjtFQTZDWSxXQUFVO0NBQUk7O0FBN0MxQjtFQWdEWSxXQUFVO0NBQUk7O0FBaEQxQjtFQW9EWSxrQmhDdkZrQjtDZ0N5RndCOztBQXREdEQ7RUFzRGMsd0NoQ25HZTtDZ0NtR3VCOztBQXREcEQ7RUEwRGMsNkJoQzdGZ0I7RWdDOEZoQix5QmhDOUZnQjtFZ0MrRmhCLGVoQ3JHZ0I7Q2dDcUdBOztBQTVEOUI7RUFpRVEsaUZBQXlHO0NBR1c7O0EvQjRFMUg7RStCaEpGO0lBb0VZLGlGQUF5RztHQUFHO0NuQ2l1TnZIOztBSXJwTkM7RStCaEpGO0lBeUVZLDZCaEM1R2tCO0dnQzRHZ0I7RUF6RTlDO0lBMkVZLHdDaEN4SGlCO0dnQ3dIcUI7RUEzRWxEO0lBOEVjLDZCaENqSGdCO0dnQ2lIa0I7RUE5RWhEO0lBaUZZLDJDaENwSGtCO0dnQ29IMkI7Q25DbXVOeEQ7O0FtQ3B6TkQ7RUFpQk0sMEJoQzdDNEI7RWdDOEM1QixZMUJ0Q1U7QzBCcUcrQzs7QUFqRi9EOztFQXFCUSxlQUFjO0NBQUk7O0FBckIxQjtFQXVCUSxZMUIzQ1E7QzBCMkNlOztBQXZCL0I7RUF5QlEsZ0MxQjdDUTtDMEJnRG1COztBQTVCbkM7O0VBNEJVLFkxQmhETTtDMEJnRGlCOztBQTVCakM7RUE4QlEscUQxQmxEUTtVMEJrRFIsNkMxQmxEUTtDMEJrRHVDOztBL0JrSHJEO0UrQmhKRjtJQWlDVSwwQmhDN0R3QjtHZ0M2REs7Q25Db3pOdEM7O0FtQ3IxTkQ7O0VBb0NRLGdDMUJ4RFE7QzBCMkRtQjs7QUF2Q25DOzs7RUF1Q1UsWTFCM0RNO0MwQjJEaUI7O0FBdkNqQztFQTBDVSxZMUI5RE07RTBCK0ROLGFBQVk7Q0FFTTs7QUE3QzVCO0VBNkNZLFdBQVU7Q0FBSTs7QUE3QzFCO0VBZ0RZLFdBQVU7Q0FBSTs7QUFoRDFCO0VBb0RZLFkxQnhFSTtDMEIwRXNDOztBQXREdEQ7RUFzRGMsd0NoQ25HZTtDZ0NtR3VCOztBQXREcEQ7RUEwRGMsdUIxQjlFRTtFMEIrRUYsbUIxQi9FRTtFMEJnRkYsZWhDeEZvQjtDZ0N3Rko7O0FBNUQ5QjtFQWlFUSxpRkFBeUc7Q0FHVzs7QS9CNEUxSDtFK0JoSkY7SUFvRVksaUZBQXlHO0dBQUc7Q25DaTBOdkg7O0FJcnZOQztFK0JoSkY7SUF5RVksdUIxQjdGSTtHMEI2RjhCO0VBekU5QztJQTJFWSx3Q2hDeEhpQjtHZ0N3SHFCO0VBM0VsRDtJQThFYyx1QjFCbEdFO0cwQmtHZ0M7RUE5RWhEO0lBaUZZLDJDMUJyR0k7RzBCcUd5QztDbkNtME54RDs7QW1DcDVORDtFQWlCTSwwQmhDNUM0QjtFZ0M2QzVCLFkxQnRDVTtDMEJxRytDOztBQWpGL0Q7O0VBcUJRLGVBQWM7Q0FBSTs7QUFyQjFCO0VBdUJRLFkxQjNDUTtDMEIyQ2U7O0FBdkIvQjtFQXlCUSxnQzFCN0NRO0MwQmdEbUI7O0FBNUJuQzs7RUE0QlUsWTFCaERNO0MwQmdEaUI7O0FBNUJqQztFQThCUSxxRDFCbERRO1UwQmtEUiw2QzFCbERRO0MwQmtEdUM7O0EvQmtIckQ7RStCaEpGO0lBaUNVLDBCaEM1RHdCO0dnQzRESztDbkNvNU50Qzs7QW1DcjdORDs7RUFvQ1EsZ0MxQnhEUTtDMEIyRG1COztBQXZDbkM7OztFQXVDVSxZMUIzRE07QzBCMkRpQjs7QUF2Q2pDO0VBMENVLFkxQjlETTtFMEIrRE4sYUFBWTtDQUVNOztBQTdDNUI7RUE2Q1ksV0FBVTtDQUFJOztBQTdDMUI7RUFnRFksV0FBVTtDQUFJOztBQWhEMUI7RUFvRFksWTFCeEVJO0MwQjBFc0M7O0FBdER0RDtFQXNEYyx3Q2hDbkdlO0NnQ21HdUI7O0FBdERwRDtFQTBEYyx1QjFCOUVFO0UwQitFRixtQjFCL0VFO0UwQmdGRixlaEN2Rm9CO0NnQ3VGSjs7QUE1RDlCO0VBaUVRLGlGQUF5RztDQUdXOztBL0I0RTFIO0UrQmhKRjtJQW9FWSxpRkFBeUc7R0FBRztDbkNpNk52SDs7QUlyMU5DO0UrQmhKRjtJQXlFWSx1QjFCN0ZJO0cwQjZGOEI7RUF6RTlDO0lBMkVZLHdDaEN4SGlCO0dnQ3dIcUI7RUEzRWxEO0lBOEVjLHVCMUJsR0U7RzBCa0dnQztFQTlFaEQ7SUFpRlksMkMxQnJHSTtHMEJxR3lDO0NuQ202TnhEOztBbUNwL05EO0VBaUJNLDBCaEM5QzRCO0VnQytDNUIsWTFCdENVO0MwQnFHK0M7O0FBakYvRDs7RUFxQlEsZUFBYztDQUFJOztBQXJCMUI7RUF1QlEsWTFCM0NRO0MwQjJDZTs7QUF2Qi9CO0VBeUJRLGdDMUI3Q1E7QzBCZ0RtQjs7QUE1Qm5DOztFQTRCVSxZMUJoRE07QzBCZ0RpQjs7QUE1QmpDO0VBOEJRLHFEMUJsRFE7VTBCa0RSLDZDMUJsRFE7QzBCa0R1Qzs7QS9Ca0hyRDtFK0JoSkY7SUFpQ1UsMEJoQzlEd0I7R2dDOERLO0NuQ28vTnRDOztBbUNyaE9EOztFQW9DUSxnQzFCeERRO0MwQjJEbUI7O0FBdkNuQzs7O0VBdUNVLFkxQjNETTtDMEIyRGlCOztBQXZDakM7RUEwQ1UsWTFCOURNO0UwQitETixhQUFZO0NBRU07O0FBN0M1QjtFQTZDWSxXQUFVO0NBQUk7O0FBN0MxQjtFQWdEWSxXQUFVO0NBQUk7O0FBaEQxQjtFQW9EWSxZMUJ4RUk7QzBCMEVzQzs7QUF0RHREO0VBc0RjLHdDaENuR2U7Q2dDbUd1Qjs7QUF0RHBEO0VBMERjLHVCMUI5RUU7RTBCK0VGLG1CMUIvRUU7RTBCZ0ZGLGVoQ3pGb0I7Q2dDeUZKOztBQTVEOUI7RUFpRVEsaUZBQXlHO0NBR1c7O0EvQjRFMUg7RStCaEpGO0lBb0VZLGlGQUF5RztHQUFHO0NuQ2lnT3ZIOztBSXI3TkM7RStCaEpGO0lBeUVZLHVCMUI3Rkk7RzBCNkY4QjtFQXpFOUM7SUEyRVksd0NoQ3hIaUI7R2dDd0hxQjtFQTNFbEQ7SUE4RWMsdUIxQmxHRTtHMEJrR2dDO0VBOUVoRDtJQWlGWSwyQzFCckdJO0cwQnFHeUM7Q25DbWdPeEQ7O0FtQ3BsT0Q7RUFpQk0sMEJoQy9DNEI7RWdDZ0Q1QiwwQjFCeENlO0MwQnVHMEM7O0FBakYvRDs7RUFxQlEsZUFBYztDQUFJOztBQXJCMUI7RUF1QlEsMEIxQjdDYTtDMEI2Q1U7O0FBdkIvQjtFQXlCUSwwQjFCL0NhO0MwQmtEYzs7QUE1Qm5DOztFQTRCVSwwQjFCbERXO0MwQmtEWTs7QUE1QmpDO0VBOEJRLCtDMUJwRGE7VTBCb0RiLHVDMUJwRGE7QzBCb0RrQzs7QS9Ca0hyRDtFK0JoSkY7SUFpQ1UsMEJoQy9Ed0I7R2dDK0RLO0NuQ29sT3RDOztBbUNybk9EOztFQW9DUSwwQjFCMURhO0MwQjZEYzs7QUF2Q25DOzs7RUF1Q1UsMEIxQjdEVztDMEI2RFk7O0FBdkNqQztFQTBDVSwwQjFCaEVXO0UwQmlFWCxhQUFZO0NBRU07O0FBN0M1QjtFQTZDWSxXQUFVO0NBQUk7O0FBN0MxQjtFQWdEWSxXQUFVO0NBQUk7O0FBaEQxQjtFQW9EWSwwQjFCMUVTO0MwQjRFaUM7O0FBdER0RDtFQXNEYyx3Q2hDbkdlO0NnQ21HdUI7O0FBdERwRDtFQTBEYyxxQzFCaEZPO0UwQmlGUCxpQzFCakZPO0UwQmtGUCxlaEMxRm9CO0NnQzBGSjs7QUE1RDlCO0VBaUVRLGlGQUF5RztDQUdXOztBL0I0RTFIO0UrQmhKRjtJQW9FWSxpRkFBeUc7R0FBRztDbkNpbU92SDs7QUlyaE9DO0UrQmhKRjtJQXlFWSxxQzFCL0ZTO0cwQitGeUI7RUF6RTlDO0lBMkVZLHdDaEN4SGlCO0dnQ3dIcUI7RUEzRWxEO0lBOEVjLHFDMUJwR087RzBCb0cyQjtFQTlFaEQ7SUFpRlkscUMxQnZHUztHMEJ1R29DO0NuQ21tT3hEOztBbUNwck9EO0VBaUJNLDBCaEMxQzRCO0VnQzJDNUIsWTFCdENVO0MwQnFHK0M7O0FBakYvRDs7RUFxQlEsZUFBYztDQUFJOztBQXJCMUI7RUF1QlEsWTFCM0NRO0MwQjJDZTs7QUF2Qi9CO0VBeUJRLGdDMUI3Q1E7QzBCZ0RtQjs7QUE1Qm5DOztFQTRCVSxZMUJoRE07QzBCZ0RpQjs7QUE1QmpDO0VBOEJRLHFEMUJsRFE7VTBCa0RSLDZDMUJsRFE7QzBCa0R1Qzs7QS9Ca0hyRDtFK0JoSkY7SUFpQ1UsMEJoQzFEd0I7R2dDMERLO0NuQ29yT3RDOztBbUNydE9EOztFQW9DUSxnQzFCeERRO0MwQjJEbUI7O0FBdkNuQzs7O0VBdUNVLFkxQjNETTtDMEIyRGlCOztBQXZDakM7RUEwQ1UsWTFCOURNO0UwQitETixhQUFZO0NBRU07O0FBN0M1QjtFQTZDWSxXQUFVO0NBQUk7O0FBN0MxQjtFQWdEWSxXQUFVO0NBQUk7O0FBaEQxQjtFQW9EWSxZMUJ4RUk7QzBCMEVzQzs7QUF0RHREO0VBc0RjLHdDaENuR2U7Q2dDbUd1Qjs7QUF0RHBEO0VBMERjLHVCMUI5RUU7RTBCK0VGLG1CMUIvRUU7RTBCZ0ZGLGVoQ3JGb0I7Q2dDcUZKOztBQTVEOUI7RUFpRVEsaUZBQXlHO0NBR1c7O0EvQjRFMUg7RStCaEpGO0lBb0VZLGlGQUF5RztHQUFHO0NuQ2lzT3ZIOztBSXJuT0M7RStCaEpGO0lBeUVZLHVCMUI3Rkk7RzBCNkY4QjtFQXpFOUM7SUEyRVksd0NoQ3hIaUI7R2dDd0hxQjtFQTNFbEQ7SUE4RWMsdUIxQmxHRTtHMEJrR2dDO0VBOUVoRDtJQWlGWSwyQzFCckdJO0cwQnFHeUM7Q25DbXNPeEQ7O0FJaG9PQztFK0JwSkY7SUFzRlEscUJBQW9CO0lBQ3BCLGtCQUFpQjtHQUFJO0NuQ29zTzVCOztBSXZvT0M7RStCcEpGO0lBMkZRLHNCQUFxQjtJQUNyQixtQkFBa0I7R0FBSTtDbkNzc083Qjs7QW1DbHlPRDtFQWdHTSwwQkFBbUI7TUFBbkIsdUJBQW1CO1VBQW5CLG9CQUFtQjtFQUNuQixxQkFBYTtFQUFiLHFCQUFhO0VBQWIsY0FBYTtDQUdTOztBQXBHNUI7RUFtR1Esb0JBQVk7TUFBWixxQkFBWTtVQUFaLGFBQVk7RUFDWixxQkFBYztNQUFkLGVBQWM7Q0FBSTs7QUFwRzFCO0VBc0dJLGlCQUFnQjtDQUFJOztBQXRHeEI7RUF3R0ksa0JBQWlCO0NBQUk7O0FDdkp6QjtFQUNFLHdCakNhNkI7RWlDWjdCLHFCQUFvQjtDQU9hOztBaENzTWpDO0VnQy9NRjtJQU9NLHFCQUFvQjtHQUFJO0VBUDlCO0lBU00sc0JBQXFCO0dBQUk7Q3BDdzJPOUI7O0FxQ2ozT0Q7RUFDRSw2QmxDVzRCO0VrQ1Y1QiwwQkFBeUI7Q0FBSSIsImZpbGUiOiJidWxtYS5jc3MifQ== */", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.next[data-v-53c822a4] {\n  transition: all 1s;\n  opacity: 0;\n  transform: translateY(100%);\n}\n.show[data-v-53c822a4] {\n  opacity: 1;\n  transform: translateY(0);\n}\n.msg[data-v-53c822a4] {\n  display: inline-block;\n  margin: 10px;\n  opacity: 0;\n  transform: scale(0);\n}\n.msg.active[data-v-53c822a4] {\n  animation: active-private 1s;\n}\n.show[data-v-53c822a4] {\n  opacity: 1;\n  transform: translateY(0);\n}\n.component-a[data-v-53c822a4],\n.component-b[data-v-53c822a4] {\n  transition: all 0.3s;\n  height: 180px;\n}\n.component-a *[data-v-53c822a4],\n.component-b *[data-v-53c822a4] {\n  color: #ccc;\n}\n.component-a.active *[data-v-53c822a4],\n.component-b.active *[data-v-53c822a4] {\n  color: #000;\n}\n@-moz-keyframes active-private {\n0% {\n    opacity: 0;\n    transform: scale(0);\n}\n50% {\n    opacity: 1;\n    transform: scale(2);\n}\n100% {\n    opacity: 0;\n    transform: scale(0);\n}\n}\n@-webkit-keyframes active-private {\n0% {\n    opacity: 0;\n    transform: scale(0);\n}\n50% {\n    opacity: 1;\n    transform: scale(2);\n}\n100% {\n    opacity: 0;\n    transform: scale(0);\n}\n}\n@-o-keyframes active-private {\n0% {\n    opacity: 0;\n    transform: scale(0);\n}\n50% {\n    opacity: 1;\n    transform: scale(2);\n}\n100% {\n    opacity: 0;\n    transform: scale(0);\n}\n}\n@keyframes active-private {\n0% {\n    opacity: 0;\n    transform: scale(0);\n}\n50% {\n    opacity: 1;\n    transform: scale(2);\n}\n100% {\n    opacity: 0;\n    transform: scale(0);\n}\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\nb[data-v-53e451a6] {\n  display: inline-block;\n}\n.active[data-v-53e451a6] {\n  animation: active 1s;\n}\n.next[data-v-53e451a6] {\n  transition: all 1s;\n  opacity: 0;\n  transform: translateY(100%);\n}\n.show[data-v-53e451a6] {\n  opacity: 1;\n  transform: translateY(0);\n}\n@-moz-keyframes active {\n0% {\n    transform: translateX(0);\n}\n50% {\n    transform: translateX(15px);\n}\n100% {\n    transform: translateX(0);\n}\n}\n@-webkit-keyframes active {\n0% {\n    transform: translateX(0);\n}\n50% {\n    transform: translateX(15px);\n}\n100% {\n    transform: translateX(0);\n}\n}\n@-o-keyframes active {\n0% {\n    transform: translateX(0);\n}\n50% {\n    transform: translateX(15px);\n}\n100% {\n    transform: translateX(0);\n}\n}\n@keyframes active {\n0% {\n    transform: translateX(0);\n}\n50% {\n    transform: translateX(15px);\n}\n100% {\n    transform: translateX(0);\n}\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.title[data-v-540080a8] {\n  transition: all 0.5s;\n}\n.active[data-v-540080a8] {\n  transform: scale(1.5);\n}\n.next[data-v-540080a8] {\n  transition: all 1s 1s;\n  opacity: 0;\n  transform: translateY(100%);\n}\n.show[data-v-540080a8] {\n  opacity: 1;\n  transform: translateY(0);\n}\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\nhtml,\nbody {\n  margin: 0;\n}\n.hero {\n  background-image: url(" + __webpack_require__(24) + ");\n  background-size: cover;\n  background-attachment: fixed;\n}\n.box {\n  opacity: 0.5;\n}\n.box.active {\n  opacity: 1;\n  background-color: rgba(255,255,255,0.5) !important;\n}\n.slide-enter-active,\n.slide-leave-active {\n  transition: all 0.3s;\n}\n.slide-enter,\n.slide-leave-active {\n  transform: translateX(-50%);\n  opacity: 0;\n}\nkbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font: 11px \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  line-height: 10px;\n  color: #444d56;\n  vertical-align: middle;\n  background-color: #fcfcfc;\n  border: solid 1px #c6cbd1;\n  border-bottom-color: #959da5;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #959da5;\n}\n.hero-section {\n  margin-top: 1.5rem;\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "42ff3056ad27f0c86701d55f436cee67.jpg";

/***/ }),
/* 25 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(11)

/* template */
var __vue_template__ = __webpack_require__(34)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/doc.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b15628d", __vue_options__)
  } else {
    hotAPI.reload("data-v-2b15628d", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] doc.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(12)

/* template */
var __vue_template__ = __webpack_require__(41)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/start.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7cb04177", __vue_options__)
  } else {
    hotAPI.reload("data-v-7cb04177", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] start.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* template */
var __vue_template__ = __webpack_require__(39)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step-1.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-541cafaa", __vue_options__)
  } else {
    hotAPI.reload("data-v-541cafaa", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step-1.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(45)

/* script */
__vue_exports__ = __webpack_require__(13)

/* template */
var __vue_template__ = __webpack_require__(38)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step-2.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-540080a8"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-540080a8", __vue_options__)
  } else {
    hotAPI.reload("data-v-540080a8", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step-2.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(44)

/* script */
__vue_exports__ = __webpack_require__(14)

/* template */
var __vue_template__ = __webpack_require__(37)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step-3.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-53e451a6"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53e451a6", __vue_options__)
  } else {
    hotAPI.reload("data-v-53e451a6", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step-3.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(43)

/* script */
__vue_exports__ = __webpack_require__(15)

/* template */
var __vue_template__ = __webpack_require__(36)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step-4.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-53c822a4"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53c822a4", __vue_options__)
  } else {
    hotAPI.reload("data-v-53c822a4", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step-4.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(16)

/* template */
var __vue_template__ = __webpack_require__(35)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step-5.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53abf3a2", __vue_options__)
  } else {
    hotAPI.reload("data-v-53abf3a2", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step-5.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(17)

/* template */
var __vue_template__ = __webpack_require__(40)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/reinbulaong/stuff/git/v-hotkey/docs/src/pages/step.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5d32c447", __vue_options__)
  } else {
    hotAPI.reload("data-v-5d32c447", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] step.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('article', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', [_vm._v("Documentation")])])
},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2b15628d", module.exports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', {
    staticClass: "title"
  }, [_vm._v("Well done!")]), _c('section', {
    staticClass: "hero-section"
  }, [_c('p', [_vm._v("Press "), _c('kbd', [_vm._v("enter")]), _vm._v(" to give me a "), _c('a', {
    ref: "star",
    attrs: {
      "href": "https://github.com/Dafrok/v-hotkey",
      "target": "_blank"
    }
  }, [_vm._v("STAR")]), _vm._v(".")]), _vm._m(0)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("esc")]), _vm._v(" to return home.")])
}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-53abf3a2", module.exports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', {
    staticClass: "title"
  }, [_vm._v("Private Hotkeys of Components")]), _vm._m(0), _c('section', {
    staticClass: "hero-section"
  }, [_c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-2"
  }), _c('div', {
    staticClass: "column is-4"
  }, [_c('div', {
    staticClass: "box content component-a",
    class: {
      active: _vm.flag
    }
  }, [_c('h1', [_vm._v("Component A")]), (_vm.flag) ? _c('p', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymapA),
      expression: "keymapA"
    }]
  }, [_vm._v("Press "), _c('kbd', [_vm._v("enter")]), _vm._v(" to say hello.")]) : _vm._e(), _c('div', {
    ref: "hello",
    staticClass: "msg"
  }, [_vm._v("HELLO!")])])]), _c('div', {
    staticClass: "column is-4"
  }, [_c('div', {
    staticClass: "box content component-b",
    class: {
      active: !_vm.flag
    }
  }, [_c('h1', [_vm._v("Component B")]), (!_vm.flag) ? _c('p', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymapB),
      expression: "keymapB"
    }]
  }, [_vm._v("Press "), _c('kbd', [_vm._v("enter")]), _vm._v(" to say bye.")]) : _vm._e(), _c('div', {
    ref: "bye",
    staticClass: "msg"
  }, [_vm._v("BYE!")])])]), _c('div', {
    staticClass: "column is-2"
  })])]), _c('section', {
    staticClass: "hero-section"
  }, [_c('p', {
    class: {
      next: true, show: _vm.show
    }
  }, [_vm._v("Press "), _c('kbd', [_vm._v("→")]), _vm._v(" to play next case.")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "hero-section"
  }, [_c('p', [_vm._v("Press "), _c('kbd', [_vm._v("tab")]), _vm._v(" to switch between two components.")])])
}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-53c822a4", module.exports)
  }
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', {
    staticClass: "title"
  }, [_vm._v("Key Combination")]), _c('section', {
    staticClass: "hero-section"
  }, [_c('p', [_vm._v("Press "), _c('kbd', [_vm._v("ctrl")]), _vm._v(" + "), _c('kbd', [_vm._v("enter")]), _vm._v(" to say "), _c('b', {
    ref: "hello"
  }, [_vm._v("hello.")])]), _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("alt")]), _vm._v(" + "), _c('kbd', [_vm._v("enter")]), _vm._v(" to say "), _c('b', {
    ref: "bye"
  }, [_vm._v("bye.")])]), _vm._m(0), _c('p', {
    class: {
      next: true, show: _vm.show
    }
  }, [_vm._v("Press "), _c('kbd', [_vm._v("→")]), _vm._v(" to play next case.")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("ctrl")]), _vm._v(" + "), _c('kbd', [_vm._v("alt")]), _vm._v(" + "), _c('kbd', [_vm._v("enter")]), _vm._v(" to leave.")])
}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-53e451a6", module.exports)
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', {
    ref: "hello",
    staticClass: "title"
  }, [_vm._v("Hello world.")]), _c('section', {
    staticClass: "hero-section"
  }, [_vm._m(0), _c('transition', {
    attrs: {
      "name": "slide"
    }
  }, [_c('p', {
    class: {
      next: true, show: _vm.show
    }
  }, [_vm._v("Press "), _c('kbd', [_vm._v("→")]), _vm._v(" to play next case.")])])], 1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_vm._v("Press and hold "), _c('kbd', [_vm._v("enter")]), _vm._v(" to say hello.")])
}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-540080a8", module.exports)
  }
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('h1', {
    staticClass: "title"
  }, [_vm._v("Get Start")]), _c('section', {
    staticClass: "hero-section"
  }, [_c('p', [_vm._v("Press "), _c('kbd', [_vm._v("←")]), _vm._v(" to previous page.")]), _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("→")]), _vm._v(" to next page.")]), _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("esc")]), _vm._v(" to return home.")])])])
}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-541cafaa", module.exports)
  }
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('transition', {
    attrs: {
      "name": "slide",
      "mode": "out-in"
    }
  }, [_c('router-view')], 1)], 1)
},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5d32c447", module.exports)
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "hotkey",
      rawName: "v-hotkey",
      value: (_vm.keymap),
      expression: "keymap"
    }]
  }, [_c('h1', {
    staticClass: "title"
  }, [_vm._v("V Hotkey")]), _c('h2', {
    staticClass: "subtitle"
  }, [_vm._v("Vue 2.x directive for binding hotkeys to components.")]), _c('section', {
    staticClass: "hero-section"
  }, [_c('p', [_vm._v("Press "), _c('kbd', [_vm._v("enter")]), _vm._v(" to "), _c('router-link', {
    attrs: {
      "to": "/step/1"
    }
  }, [_vm._v("get start")]), _vm._v(".")], 1), _c('p', [_vm._v("Press "), _c('kbd', [_vm._v("space")]), _vm._v(" to see the "), _c('a', {
    ref: "doc",
    attrs: {
      "href": "https://github.com/Dafrok/v-hotkey/blob/master/README.md",
      "target": "_blank"
    }
  }, [_vm._v("documentation")]), _vm._v(".    ")])])])
},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7cb04177", module.exports)
  }
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "hero is-fullheight"
  }, [_c('div', {
    staticClass: "hero-body"
  }, [_c('div', {
    staticClass: "container has-text-centered"
  }, [_c('transition', {
    attrs: {
      "name": "slide",
      "mode": "out-in"
    }
  }, [_c('router-view')], 1)], 1)])])
},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7dd95fbe", module.exports)
  }
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53c822a4&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-4.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53c822a4&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-4.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53e451a6&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-3.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53e451a6&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-3.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-540080a8&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-2.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-540080a8&scoped=true!../../../node_modules/stylus-loader/index.js!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./step-2.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7dd95fbe!../../node_modules/stylus-loader/index.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7dd95fbe!../../node_modules/stylus-loader/index.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);