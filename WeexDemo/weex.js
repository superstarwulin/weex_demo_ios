/** @ali/weapp-js-framework v0.11.7 */

var WeAppVersion = 'v0.11.7';

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var framework = __webpack_require__(2)

	for (var key in framework) {
	    global[key] = framework[key]
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Main entry, instance manager
	 *
	 * - global.createInstance(instanceId, code, options, data)
	 * - global.refreshInstance(instanceId, data)
	 * - global.destroyInstance(instanceId)
	 * - global.registerComponents(components)
	 * - global.registerModules(modules)
	 * - global.getRoot(instanceId)
	 * - global.instanceMap
	 * - global.callJS(instanceId, tasks)
	 *   - fireEvent(ref, type, data)
	 *   - callback(funcId, data)
	 */

	var perf = __webpack_require__(3)
	var AppInstance = __webpack_require__(6)
	var Vm = __webpack_require__(12)

	var config = __webpack_require__(5)
	var nativeComponentMap = config.nativeComponentMap
	var composedComponentMap = config.composedComponentMap

	var instanceMap = {}

	function cleanComponents() {
	  var instanceId, instance, components, type, useful
	  for (type in composedComponentMap) {
	    useful = false
	    for (instanceId in instanceMap) {
	      instance = instanceMap[instanceId]
	      components = instance.components || {}
	      if (components[type]) {
	        useful = true
	      }
	    }
	    if (!useful) {
	      delete composedComponentMap[type]
	    }
	  }
	}

	/**
	 * create a WeApp+ instance
	 *
	 * @param  {string} instanceId
	 * @param  {string} code
	 * @param  {object} options
	 * @param  {boolean} [options.HAS_LOG]  print `nativeLog()`
	 * @param  {boolean} [options.NO_APPEND] only run JavaScript, not call any `callNative()`
	 * @param  {boolean} [options.APPEND_ONCE] append the whole root element once
	 * @param  {boolean} [options.APPEND_ASYNC] append by "floor" with `nextTick()` to for timing
	 * @param  {object} [data]
	 */
	function createInstance(instanceId, code, options, data) {
	  var instance = instanceMap[instanceId]
	  // flags = JSON.parse(flags || '{}')
	  // flags.HAS_LOG = true
	  // flags.NO_APPEND = true
	  // flags.APPEND_ONCE = true
	  // flags.APPEND_ASYNC = true
	  if (options.HAS_LOG) {
	    config.debug = true
	  }
	  if (!instance) {
	    perf.start('createInstance', instanceId)
	    instance = new AppInstance(instanceId, options)
	    instanceMap[instanceId] = instance
	    instance.init(code, data)
	    perf.end('createInstance', instanceId)
	  }
	}

	/**
	 * refresh a WeApp+ instance
	 * 
	 * @param  {string} instanceId
	 * @param  {object} data
	 */
	function refreshInstance(instanceId, data) {
	  var instance = instanceMap[instanceId]
	  if (instance) {
	    perf.start('refreshData', instanceId)
	    // obj = JSON.parse(data || '{}') || {}
	    instance.refreshData(data)
	    perf.end('refreshData', instanceId)
	  }
	}

	/**
	 * destroy a WeApp+ instance
	 * @param  {string} instanceId
	 */
	function destroyInstance(instanceId) {
	  if (!instanceMap[instanceId]) return

	  perf.start('destroyInstance', instanceId)
	  instanceMap[instanceId].destroy()
	  cleanComponents()
	  delete instanceMap[instanceId]
	  perf.end('destroyInstance', instanceId)
	}

	/**
	 * register the name of each native component
	 * @param  {object[]} components stringified array of name
	 */
	function registerComponents(components) {
	  // var list = JSON.parse(components)
	  if (Array.isArray(components)) {
	    components.forEach(function register(name) {
	      nativeComponentMap[name] = true
	    })
	  }
	}

	/**
	 * register the name and methods of each module
	 * @param  {object} modules stringified object of module
	 */
	function registerModules(modules) {
	  // var map = JSON.parse(modules)
	  if (typeof modules === 'object') {
	    Vm.registerModules(modules)
	  }
	}

	/**
	 * get a whole element tree of an instance
	 * for debugging
	 * @param  {string} instanceId
	 * @return {object} a virtual dom tree
	 */
	function getRoot(instanceId) {
	  var instance = instanceMap[instanceId]
	  if (instance) {
	    return instance.getRootElement()
	  }
	  else {
	    return {}
	  }
	}

	var jsHandlers = {
	  fireEvent: function fireEvent(instanceId, ref, type, data) {
	    var e
	    var instance = instanceMap[instanceId]
	    if (instance) {
	      perf.start('fireEvent', instanceId + '-' + ref + '-' + type)
	      // e = JSON.parse(data || '{}') || {}
	      instance.fireEvent(ref, type, data)
	      perf.end('fireEvent', instanceId + '-' + ref + '-' + type)
	    }
	  },
	  callback: function callback(instanceId, funcId, data) {
	    var instance = instanceMap[instanceId]
	    if (instance) {
	      instance.callback(funcId, data)
	    }
	  }
	}

	/**
	 * accept calls from native (event or callback)
	 *
	 * @param  {string} instanceId
	 * @param  {object[]} tasks task array with `method` and `args`
	 */
	function callJS(instanceId, tasks) {
	  var instance = instanceMap[instanceId]
	  if (instance && Array.isArray(tasks)) {
	    tasks.forEach(function handleAction(task) {
	      var handler = jsHandlers[task.method]
	      var args = task.args.slice(0)
	      if (typeof handler === 'function') {
	        log('javascript:', task.method, task.args)
	        args.unshift(instanceId)
	        handler.apply(null, args)
	      }
	    })
	  }
	}

	module.exports = {
	  createInstance: createInstance,
	  refreshInstance: refreshInstance,
	  destroyInstance: destroyInstance,
	  registerComponents: registerComponents,
	  registerModules: registerModules,
	  instanceMap: instanceMap,
	  getRoot: getRoot,
	  callJS: callJS
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4)

	var data = {type: 'root', children: []}
	var current = data
	var stack = [current]

	function spaces(num) {
	  return Array(num).join(' ')
	}

	function start(type, id) {
	  var task = {type: type, id: id, children: [], start: Date.now()}
	  current.children.push(task)
	  stack.push(task)
	  current = task
	  log('perf:' + spaces(stack.length - 1), 'start', task.type, task.id)
	}

	function end(type, id) {
	  var task = stack.pop()
	  task.end = Date.now()
	  current = stack[stack.length - 1]
	  log('perf:' + spaces(stack.length), 'end',
	    (task.end - task.start) + 'ms', task.type, task.id)
	}

	function reset() {
	  data.children = []
	  current = data
	  stack.length = 0
	  stack.push(current)
	}

	function toJSON() {
	  return JSON.parse(JSON.stringify(data))
	}

	module.exports = {
	  start: start,
	  end: end,
	  reset: reset,
	  toJSON: toJSON
	}



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var config = __webpack_require__(5)

	global.log = function log() {
	  if (config.debug) {
	    if (typeof nativeLog === 'function') {
	      nativeLog.apply(this, arguments)
	    }
	    else if (console && typeof console.log === 'function') {
	      console.log.apply(console, arguments)
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {

	  // debug: true,

	  nativeComponentMap: {
	    text: true,
	    image: true,
	    container: true

	    // slider: true,
	    // tabheader: true,
	    // countdown: true,
	    // marquee: true
	  },

	  composedComponentMap: {
	  }
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * WeApp+ instance constructor & definition
	 */

	var _ = __webpack_require__(7)
	var extend = _.extend

	var perf = __webpack_require__(3)
	var EventManager = __webpack_require__(9)
	var Document = __webpack_require__(10).Document

	function AppInstance(instanceId, flags) {
	  perf.start('initInstance', instanceId)
	  this.id = instanceId
	  this.flags = flags || {}
	  this.eventManager = new EventManager()
	  this.updates = []
	  this.blocks = []
	  this.vm = null
	  this.document = new Document(instanceId)
	  this.components = {}
	  this.callbacks = {}
	  this.uid = 0
	  this.rendered = false
	  perf.end('initInstance', instanceId)
	}

	extend(AppInstance.prototype, __webpack_require__(11))
	extend(AppInstance.prototype, __webpack_require__(24))
	extend(AppInstance.prototype, __webpack_require__(25))
	extend(AppInstance.prototype, __webpack_require__(26))

	/**
	 * helpers
	 */

	module.exports = AppInstance


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var mini = __webpack_require__(8)
	var extend = mini.extend

	extend(exports, mini)


/***/ },
/* 8 */
/***/ function(module, exports) {

	/// lang.js


	/**
	 * Check is a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */

	exports.isReserved = function (str) {
	  var c = (str + '').charCodeAt(0)
	  return c === 0x24 || c === 0x5F
	}

	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var camelRE = /-(\w)/g
	exports.camelize = function (str) {
	  return str.replace(camelRE, toUpper)
	}

	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */

	exports.bind = function (fn, ctx) {
	  return function (a) {
	    var l = arguments.length
	    return l
	      ? l > 1
	        ? fn.apply(ctx, arguments)
	        : fn.call(ctx, a)
	      : fn.call(ctx)
	  }
	}

	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */

	exports.toArray = function (list, start) {
	  start = start || 0
	  var i = list.length - start
	  var ret = new Array(i)
	  while (i--) {
	    ret[i] = list[i + start]
	  }
	  return ret
	}

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	exports.extend = function (to, from) {
	  for (var key in from) {
	    to[key] = from[key]
	  }
	  return to
	}

	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isObject = function (obj) {
	  return obj && typeof obj === 'object'
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString
	exports.isPlainObject = function (obj) {
	  return toString.call(obj) === '[object Object]'
	}

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isArray = function (obj) {
	  return Array.isArray(obj)
	}


	exports.stringify = function (x) {
	  return typeof x === 'undefined' || x === null
	    ? ''
	    : typeof x === 'object'
	      ? x instanceof RegExp
	        ? x.toString()
	        : x instanceof Date
	          ? JSON.parse(JSON.stringify(x))
	          : JSON.stringify(x)
	      : x.toString()
	}

	function typof(v) {
	  var s = Object.prototype.toString.call(v)
	  return s.substring(8, s.length - 1).toLowerCase()
	}

	exports.typof = typof

	exports.normalize = function (v) {
	  var type = typof(v)

	  switch(type) {
	    case 'undefined':
	    case 'null':
	      return ''
	    case 'regexp':
	      return v.toString()
	    case 'date':
	      return date.toISOString()
	    case 'number':
	    case 'string':
	    case 'boolean':
	    case 'array':
	    case 'object':
	      return v
	    default:
	      return JSON.stringify(v)
	  }
	}

	/**
	 * Define a non-enumerable property
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */

	exports.define = function (obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  })
	}

	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */

	exports.indexOf = function (arr, obj) {
	  for (var i = 0, l = arr.length; i < l; i++) {
	    if (arr[i] === obj) return i
	  }
	  return -1
	}


	/// debug.js


	var hasConsole = typeof console !== 'undefined'

	/**
	 * Log a message.
	 *
	 * @param {String} msg
	 */

	exports.log = function (msg) {
	  if (hasConsole && config.debug) {
	    console.log('[info]: ' + msg)
	  }
	}

	/**
	 * We've got a problem here.
	 *
	 * @param {String} msg
	 */

	exports.warn = function (msg) {
	  // if (hasConsole && (!config.silent || config.debug)) {
	  if (hasConsole) {
	    console.warn('[warn]: ' + msg)
	    /* istanbul ignore if */
	    // if (config.debug) {
	    //   /* jshint debug: true */
	    //   debugger
	    // }
	  }
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview event manager
	 */

	var _ = __webpack_require__(7)

	function EventManager() {
	  this.els = []
	  this.targets = []
	}

	EventManager.prototype._get = function (el, force) {
	  var index = _.indexOf(this.els, el)
	  var target
	  if (index >= 0) {
	    target = this.targets[index]
	  }
	  else if (force) {
	    target = {el: el, events: {}}
	    this.els.push(el)
	    this.targets.push(target)
	  }
	  return target
	}

	EventManager.prototype.add = function (el, type, handler) {
	  if (typeof el !== 'object' || !el ||
	    typeof type !== 'string' || !type ||
	    typeof handler !== 'function') {
	    return
	  }
	  var target = this._get(el, true)
	  target.events[type] = handler
	}

	EventManager.prototype.remove = function (el, type) {
	  if (typeof el !== 'object' || !el ||
	    typeof type !== 'string' || !type) {
	    return
	  }
	  var target = this._get(el)
	  if (target) {
	    delete target.events[type]
	  }
	}

	EventManager.prototype.fire = function (el, type, e) {
	  var target = this._get(el)
	  var handler, el
	  if (target) {
	    el = target.el
	    handler = target.events[type]
	    if (typeof handler === 'function') {
	      handler.call(el, e)
	    }
	  }
	}

	module.exports = EventManager


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * @fileOverview
	 * A simple virtual dom implementation
	 */

	var instanceMap = {}

	var Document = function (id) {
	  id = id ? id.toString() : ''
	  this.id = id
	  this.nextRef = 0
	  this.nodeMap = {}
	  instanceMap[id] = this
	  this.body = new Element('root', null, id)
	  this.nodeMap._root = this.body
	}

	Document.prototype.addRef = function (el) {
	  el.ref = this.nextRef.toString()
	  this.nodeMap[el.ref] = el
	  this.nextRef++
	}
	Document.prototype.getRef = function (ref) {
	  return this.nodeMap[ref]
	}
	Document.prototype.removeRef = function (ref) {
	  delete this.nodeMap[ref]
	}

	Document.prototype.createElement = function (tagName, props) {
	  return new Element(tagName, props, this.id)
	}
	Document.prototype.createTextNode = function (text) {
	  return new Text(text, this.id)
	}
	Document.prototype.createComment = function (text) {
	  return new Comment(text, this.id)
	},
	Document.prototype.createFragment = function () {
	  return new Fragment(this.id)
	},
	Document.prototype.move = function (ref, parentRef, index) {
	  var nodeMap = this.nodeMap
	  var target = nodeMap[ref]
	  var parent = nodeMap[parentRef]
	  var oldParent = nodeMap[target.parentRef]
	  if (oldParent) {
	    oldParent.removeChild(target, true)
	  }
	  parent.insertBefore(target, parent.children[index])
	},
	Document.prototype.getElementByRef = function (ref) {
	  return this.nodeMap[ref]
	}

	var Node = function () {
	}
	Node.prototype.create = function (instanceId) {
	  var doc
	  this.parentRef = null
	  if (instanceId) {
	    this.instanceId = instanceId
	    doc = instanceMap[instanceId]
	    doc.addRef(this)
	  }
	}
	Node.prototype.destroy = function () {
	  var ref = this.ref
	  var instanceId = this.instanceId
	  var doc
	  if (instanceId) {
	    doc = instanceMap[instanceId]
	    doc.removeRef(ref)
	  }

	  var children = this.children || []
	  var length = children.length
	  var i
	  for (i = 0; i < length; i++) {
	    children[i].destroy()
	  }
	}
	Node.prototype.toString = function () {
	  return '<' + this.type + '>'
	}
	Node.prototype.next = function () {
	  var instanceId = this.instanceId
	  var doc = instanceMap[instanceId]
	  var parent = doc.getRef(this.parentRef)
	  var index = parent.children.indexOf(this)
	  if (index < 0) {
	    return null
	  }
	  return parent.children[index + 1]
	}
	Node.prototype.prev = function () {
	  var instanceId = this.instanceId
	  var doc = instanceMap[instanceId]
	  var parent = doc.getRef(this.parentRef)
	  var index = parent.children.indexOf(this)
	  return parent.children[index - 1]
	}
	Node.prototype.getAllRefs = function () {
	  var refs = []
	  refs.push(this.ref)
	  var children = this.children || []
	  var length = children.length
	  var i, childRefs
	  for (var i = 0; i < length; i++) {
	    childRefs = children[i].getAllRefs()
	    Array.prototype.push.apply(refs, childRefs)
	  }
	  return refs
	}

	var Element = function (type, props, instanceId) {
	  this.create(instanceId)
	  this.type = type || 'div'
	  this.attr = (props && props.attr) || {}
	  this.classStyle = (props && props.classStyle) || {}
	  this.style = (props && props.style) || {}
	  this.event = []
	  this.children = []
	}
	Element.prototype = new Node()
	Element.prototype.appendChild = function (node) {
	  var children, length, i, child
	  if (node.type === 'fragment') {
	    children = node.children
	    length = children.length
	    for (i = 0; i < length; i++) {
	      child = children[i]
	      child.parentRef = this.ref
	      this.children.push(child)
	    }
	    children.length = 0
	  } else {
	    node.parentRef = this.ref
	    this.children.push(node)
	  }
	}
	Element.prototype.insertBefore = function (node, before) {
	  var children = this.children
	  var length = children.length
	  var nodes, index, nChildren, nLength, i, child

	  if (typeof before === 'number') {
	    index = before
	  } else {
	    index = children.indexOf(before)
	  }
	  if (index < 0 || index > length) {
	    index = length
	  }

	  if (node.type === 'fragment') {
	    nodes = []
	    nChildren = node.children
	    nLength = nChildren.nLength
	    for (i = 0; i < length; i++) {
	      child = nChildren[i]
	      child.parentRef = this.ref
	      nodes.push(child)
	    }
	    nChildren.length = 0
	  } else {
	    node.parentRef = this.ref
	    nodes = [node]
	  }

	  var args = [index, 0]
	  Array.prototype.push.apply(args, nodes)
	  Array.prototype.splice.apply(children, args)
	}
	Element.prototype.removeChild = function (node, preserved) {
	  var children = this.children
	  var ref, index, length, i
	  if (typeof node === 'string' || typeof node === 'number') {
	    ref = node
	    for (i = 0; i < length; i++) {
	      if (children[i].ref === ref) {
	        index = i
	      }
	    }
	  } else {
	    index = children.indexOf(node)
	  }
	  if (index >= 0) {
	    children[index].parentRef = null
	    children.splice(index, 1)
	    if (!preserved) {
	      node.destroy()
	    }
	  }
	}
	Element.prototype.clear = function () {
	  var children = this.children
	  var length = children.length
	  var i, child
	  for (i = 0; i < length; i++) {
	    child = children[i]
	    child.parentRef = null
	    child.destroy()
	  }
	  children.length = 0
	}

	Element.prototype.setAttr = function (props) {
	  var keys = Object.keys(props)
	  var length = keys.length
	  var i, key
	  for (i = 0; i < length; i++) {
	    key = keys[i]
	    this.attr[key] = props[key]
	  }
	}
	Element.prototype.setClassStyle = function (props) {
	  var keys = Object.keys(props)
	  var length = keys.length
	  var i, key
	  for (i = 0; i < length; i++) {
	    key = keys[i]
	    this.classStyle[key] = props[key]
	  }
	}
	Element.prototype.setStyle = function (props) {
	  var keys = Object.keys(props)
	  var length = keys.length
	  var i, key
	  for (i = 0; i < length; i++) {
	    key = keys[i]
	    this.style[key] = props[key]
	  }
	}
	Element.prototype.addEvent = function (type) {
	  var index = this.event.indexOf(type)
	  if (index < 0) {
	    this.event.push(type)
	  }
	}
	Element.prototype.removeEvent = function (type) {
	  var index = this.event.indexOf(type)
	  if (index >= 0) {
	    this.event.splice(index, 1)
	  }
	}
	Element.prototype.toStyle = function () {
	  var result = {}
	  var classStyle = this.classStyle
	  var style = this.style
	  for (var name in classStyle) {
	    result[name] = classStyle[name]
	  }
	  for (var name in style) {
	    result[name] = style[name]
	  }
	  return result
	}
	Element.prototype.toJSON = function () {
	  var children
	  var result = {
	    ref: this.ref.toString(),
	    type: this.type,
	    attr: this.attr,
	    style: this.toStyle()
	  }

	  if (this.component) {
	    result.component = this.component
	  }
	  if (this.event && this.event.length) {
	    result.event = this.event
	  }
	  if (this.children && this.children.length) {
	    children = this.children.filter(function (child) {
	      return child.type !== 'comment'
	    }).map(function (child) {
	      return child.toJSON()
	    })
	    if (children.length) {
	      result.children = children
	    }
	  }

	  return result
	}
	Element.prototype.toString = function () {
	  return '<' + this.type +
	    ' attr=' + JSON.stringify(this.attr) +
	    ' style=' + JSON.stringify(this.toStyle()) + '>' +
	    this.children.filter(function (child) {
	      return child.type !== 'comment'
	    }).map(function (child) {
	      return child.toString()
	    }).join('') + '</' + this.type + '>'
	}

	var Text = function (value, instanceId) {
	  this.create(instanceId)
	  this.type = 'text'
	  this.value = value
	}
	Text.prototype = new Node()
	Text.prototype.toString = function () {
	  return this.value || ''
	}
	Text.prototype.toJSON = function () {
	  return {
	    ref: this.ref.toString(),
	    type: this.type,
	    value: this.value
	  }
	}

	var Comment = function (value, instanceId) {
	  this.create(instanceId)
	  this.type = 'comment'
	  this.value = value
	}
	Comment.prototype = new Node()
	Comment.prototype.toString = function () {
	  return '<!-- ' + this.value + ' -->'
	}

	var Fragment = function (instanceId) {
	  this.create(instanceId)
	  this.type = 'fragment'
	  this.children = []
	}
	Fragment.prototype = Object.create(Element.prototype)

	var stringify = function (element) {
	  return JSON.stringify(element.toJSON())
	}

	module.exports = {
	  instanceMap: instanceMap,
	  Document: Document,
	  Node: Node,
	  Element: Element,
	  Text: Text,
	  Fragment: Fragment,
	  stringify: stringify
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * api that invoked by js bundle code
	 *
	 * - register(type, options): register a new composed component type
	 * - render(type, data): render by a certain type with (optional) data
	 */

	var perf = __webpack_require__(3)
	var Vm = __webpack_require__(12)
	var Queue = __webpack_require__(23)

	var config = __webpack_require__(5)
	var composedComponentMap = config.composedComponentMap

	exports.register = function register(type, options) {
	  perf.start('register', type)
	  composedComponentMap[type] = options
	  this.components[type] = true
	  perf.end('register', type)
	}

	exports.render = function render(type, data, callback) {
	  // var flags = this.flags
	  var queue = this._queue = new Queue()

	  var createStart = function(queue) {
	    perf.start('create vm', type)
	    var bodyComponentType = composedComponentMap[type].template.type || 'div'
	    if (['div', 'scroller'].indexOf(bodyComponentType) < 0) {
	      bodyComponentType = 'div'
	    }
	    var task = this.createBody(bodyComponentType)
	    this.callTasks(task, queue.next.bind(queue))
	  }

	  var creatVm = function() {
	    this.vm = new Vm(type, {app: this, data: data})
	  }

	  var createFinish = function (queue) {
	    // self.vm = vm
	    perf.end('create vm', type)

	    // collect all events into patch and bind to native
	    // perf.start('add event', type + '-' + self.id)
	    // self.initEvent()
	    // perf.end('add event', type + '-' + self.id)

	    var task = this.createFinish()
	    this.callTasks(task, queue.finish.bind(queue))
	    // self.finishRendering()
	  }

	  perf.start('render', this.id)

	  queue.start({
	    onfinish: function() {
	      this.rendered = true
	      perf.end('render', this.id)
	    }.bind(this)
	  })

	  queue.add(createStart.bind(this, queue))
	  creatVm.call(this)
	  queue.add(createFinish.bind(this, queue))
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * ViewModel Constructor & definition
	 */




	var _ = __webpack_require__(7)
	var extend = _.extend

	var config = __webpack_require__(5)
	var composedComponentMap = config.composedComponentMap

	/**
	 * options{app, parent, parentEl, data}
	 *
	 * @param {string} type    [description]
	 * @param {object} options [description]
	 * @param {string} flag [description]
	 */
	function Vm(type, options, flag, block) {
	  options = options || {}

	  var app = options.app || options._app
	  // var queue = options.queue || new Queue()
	  var parent = options.parent || null
	  var parentEl = options.parentEl || app.document

	  this._app = this.app = this.$app = app

	  var component = composedComponentMap[type] || {}
	  var style = component.style || {}
	  var template = component.template || {}
	  var data = component.data || {}
	  var methods = component.methods || {}

	  // static members
	  this._type = type
	  this._css = style
	  this._template = template
	  this._methods = methods
	  this._parent = parent
	  // this._queue = queue

	  // dynamic members
	  this._el = null
	  this._children = []
	  this._watchers = []
	  this._events = []
	  this._ids = {}

	  // proxy data and methods
	  // observe data and add this to vms
	  this._data = typeof data === 'function' ? data() : data
	  this._initScope()
	  this._bindSubData(parent, options.data)

	  if (typeof methods.ready === 'function') {
	    this.ready()
	  }

	  // compile template
	  // first build
	  // get $ refs
	  // bind directive (based on a collection of dom api)
	  // queue.start(options.callback)
	  this._build(parentEl, flag, block)
	}


	extend(Vm.prototype, __webpack_require__(13))
	extend(Vm.prototype, __webpack_require__(20))
	extend(Vm.prototype, __webpack_require__(22))

	Vm.prototype.$fire = function (name, detail) {
	  detail = detail || {}
	  if (typeof this[name] === 'function') {
	    this[name](detail)
	  }
	  if (!detail._stop && this._parent) {
	    this._parent.$fire(name, detail)
	  }
	}
	Vm.prototype.fire = Vm.prototype.$fire

	Vm.registerModules = function registerModules(modules) {
	  var p = Vm.prototype
	  var methods

	  function defineModule(module) {
	    var $module = '$' + module
	    if (!p.hasOwnProperty($module)) {
	      Object.defineProperty(p, $module, {
	        get: function () {
	          var self = Object.create(this)
	          Vm.modules[module].forEach(function (method) {
	            self[method] = function call() {
	              p.$call.apply(self, [module, method].concat(_.toArray(arguments)))
	            }
	          })
	          return self
	        }
	      })
	    }
	  }

	  // init `Vm.modules{}`
	  if (!Vm.modules) {
	    Vm.modules = {}
	  }

	  for (var module in modules) {

	    // init `Vm.modules[module][]`
	    methods = Vm.modules[module]
	    if (!methods) {
	      methods = []
	      Vm.modules[module] = methods
	    }

	    // push each non-existed new method
	    modules[module].forEach(function (method) {
	      if (methods.indexOf(method) < 0) {
	        methods.push(method)
	      }
	    })

	    // set return value of a new Vm prototype with all methods
	    defineModule(module)
	  }
	}




	module.exports = Vm


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(14)
	var Observer = __webpack_require__(15)
	var Dep = __webpack_require__(17)

	/**
	 * Setup the scope of an instance, which contains:
	 * - observed data
	 * - computed properties
	 * - user methods
	 * - meta properties
	 */

	exports._initScope = function () {
	  this._initData()
	  // this._initComputed()
	  this._initMethods()
	  // this._initMeta()
	}

	/**
	 * Initialize the data. 
	 */

	exports._initData = function () {
	  // proxy data on instance
	  var data = this._data
	  var i, key
	  // // make sure all props properties are observed
	  // var props = this.$options.props
	  // if (props) {
	  //   i = props.length
	  //   while (i--) {
	  //     key = _.camelize(props[i])
	  //     if (!(key in data)) {
	  //       data[key] = null
	  //     }
	  //   }
	  // }
	  var keys = Object.keys(data)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!_.isReserved(key)) {
	      this._proxy(key)
	    }
	  }
	  // observe data
	  Observer.create(data).addVm(this)
	}

	// /**
	//  * Swap the isntance's $data. Called in $data's setter.
	//  *
	//  * @param {Object} newData
	//  */

	// exports._setData = function (newData) {
	//   newData = newData || {}
	//   var oldData = this._data
	//   this._data = newData
	//   var keys, key, i
	//   // unproxy keys not present in new data
	//   keys = Object.keys(oldData)
	//   i = keys.length
	//   while (i--) {
	//     key = keys[i]
	//     if (!_.isReserved(key) && !(key in newData)) {
	//       this._unproxy(key)
	//     }
	//   }
	//   // proxy keys not already proxied,
	//   // and trigger change for changed values
	//   keys = Object.keys(newData)
	//   i = keys.length
	//   while (i--) {
	//     key = keys[i]
	//     if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
	//       // new property
	//       this._proxy(key)
	//     }
	//   }
	//   oldData.__ob__.removeVm(this)
	//   Observer.create(newData).addVm(this)
	//   this._digest()
	// }

	/**
	 * Proxy a property, so that
	 * vm.prop === vm._data.prop
	 *
	 * @param {String} key
	 */

	exports._proxy = function (key) {
	  // need to store ref to self here
	  // because these getter/setters might
	  // be called by child instances!
	  var self = this
	  Object.defineProperty(self, key, {
	    configurable: true,
	    enumerable: true,
	    get: function proxyGetter () {
	      return self._data[key]
	    },
	    set: function proxySetter (val) {
	      self._data[key] = val
	    }
	  })
	}

	/**
	 * Unproxy a property.
	 *
	 * @param {String} key
	 */

	exports._unproxy = function (key) {
	  delete this[key]
	}

	// /**
	//  * Force update on every watcher in scope.
	//  */

	// exports._digest = function () {
	//   var i = this._watchers.length
	//   while (i--) {
	//     this._watchers[i].update()
	//   }
	//   var children = this._children
	//   i = children.length
	//   while (i--) {
	//     var child = children[i]
	//     if (child.$options.inherit) {
	//       child._digest()
	//     }
	//   }
	// }

	// /**
	//  * Setup computed properties. They are essentially
	//  * special getter/setters
	//  */

	// function noop () {}
	// exports._initComputed = function () {
	//   var computed = this.$options.computed
	//   if (computed) {
	//     for (var key in computed) {
	//       var userDef = computed[key]
	//       var def = {
	//         enumerable: true,
	//         configurable: true
	//       }
	//       if (typeof userDef === 'function') {
	//         def.get = _.bind(userDef, this)
	//         def.set = noop
	//       } else {
	//         def.get = userDef.get
	//           ? _.bind(userDef.get, this)
	//           : noop
	//         def.set = userDef.set
	//           ? _.bind(userDef.set, this)
	//           : noop
	//       }
	//       Object.defineProperty(this, key, def)
	//     }
	//   }
	// }

	/**
	 * Setup instance methods. Methods must be bound to the
	 * instance since they might be called by children
	 * inheriting them.
	 */

	exports._initMethods = function () {
	  // var methods = this.$options.methods
	  var methods = this._methods
	  if (methods) {
	    for (var key in methods) {
	      this[key] = _.bind(methods[key], this)
	    }
	  }
	}

	// /**
	//  * Initialize meta information like $index, $key & $value.
	//  */

	// exports._initMeta = function () {
	//   var metas = this.$options._meta
	//   if (metas) {
	//     for (var key in metas) {
	//       this._defineMeta(key, metas[key])
	//     }
	//   }
	// }

	// /**
	//  * Define a meta property, e.g $index, $key, $value
	//  * which only exists on the vm instance but not in $data.
	//  *
	//  * @param {String} key
	//  * @param {*} value
	//  */

	// exports._defineMeta = function (key, value) {
	//   var dep = new Dep()
	//   Object.defineProperty(this, key, {
	//     enumerable: true,
	//     configurable: true,
	//     get: function metaGetter () {
	//       if (Observer.target) {
	//         Observer.target.addDep(dep)
	//       }
	//       return value
	//     },
	//     set: function metaSetter (val) {
	//       if (val !== value) {
	//         value = val
	//         dep.notify()
	//       }
	//     }
	//   })
	// }


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7)


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(14)
	var config = __webpack_require__(16)
	var Dep = __webpack_require__(17)
	var arrayMethods = __webpack_require__(18)
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
	__webpack_require__(19)

	var uid = 0

	/**
	 * Type enums
	 */

	var ARRAY  = 0
	var OBJECT = 1

	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function protoAugment (target, src) {
	  target.__proto__ = src
	}

	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function copyAugment (target, src, keys) {
	  var i = keys.length
	  var key
	  while (i--) {
	    key = keys[i]
	    _.define(target, key, src[key])
	  }
	}

	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @param {Number} type
	 * @constructor
	 */

	function Observer (value, type) {
	  this.id = ++uid
	  this.value = value
	  this.active = true
	  this.deps = []
	  _.define(value, '__ob__', this)
	  if (type === ARRAY) {
	    var augment = config.proto && _.hasProto
	      ? protoAugment
	      : copyAugment
	    augment(value, arrayMethods, arrayKeys)
	    this.observeArray(value)
	  } else if (type === OBJECT) {
	    this.walk(value)
	  }
	}

	Observer.target = null

	var p = Observer.prototype

	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @return {Observer|undefined}
	 * @static
	 */

	Observer.create = function (value) {
	  if (
	    value &&
	    value.hasOwnProperty('__ob__') &&
	    value.__ob__ instanceof Observer
	  ) {
	    return value.__ob__
	  } else if (_.isArray(value)) {
	    return new Observer(value, ARRAY)
	  } else if (
	    _.isPlainObject(value) &&
	    !value._isVue // avoid Vue instance
	  ) {
	    return new Observer(value, OBJECT)
	  }
	}

	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object. Properties prefixed with `$` or `_`
	 * and accessor properties are ignored.
	 *
	 * @param {Object} obj
	 */

	p.walk = function (obj) {
	  var keys = Object.keys(obj)
	  var i = keys.length
	  var key, prefix
	  while (i--) {
	    key = keys[i]
	    prefix = key.charCodeAt(0)
	    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
	      this.convert(key, obj[key])
	    }
	  }
	}

	/**
	 * Try to carete an observer for a child value,
	 * and if value is array, link dep to the array.
	 *
	 * @param {*} val
	 * @return {Dep|undefined}
	 */

	p.observe = function (val) {
	  return Observer.create(val)
	}

	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */

	p.observeArray = function (items) {
	  var i = items.length
	  while (i--) {
	    this.observe(items[i])
	  }
	}

	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	p.convert = function (key, val) {
	  var ob = this
	  var childOb = ob.observe(val)
	  var dep = new Dep()
	  if (childOb) {
	    childOb.deps.push(dep)
	  }
	  Object.defineProperty(ob.value, key, {
	    enumerable: true,
	    configurable: true,
	    get: function () {
	      // Observer.target is a watcher whose getter is
	      // currently being evaluated.
	      if (ob.active && Observer.target) {
	        Observer.target.addDep(dep)
	      }
	      return val
	    },
	    set: function (newVal) {
	      if (newVal === val) return
	      // remove dep from old value
	      var oldChildOb = val && val.__ob__
	      if (oldChildOb) {
	        oldChildOb.deps.$remove(dep)
	      }
	      val = newVal
	      // add dep to new value
	      var newChildOb = ob.observe(newVal)
	      if (newChildOb) {
	        newChildOb.deps.push(dep)
	      }
	      dep.notify()
	    }
	  })
	}

	/**
	 * Notify change on all self deps on an observer.
	 * This is called when a mutable value mutates. e.g.
	 * when an Array's mutating methods are called, or an
	 * Object's $add/$delete are called.
	 */

	p.notify = function () {
	  var deps = this.deps
	  for (var i = 0, l = deps.length; i < l; i++) {
	    deps[i].notify()
	  }
	}

	/**
	 * Add an owner vm, so that when $add/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */

	p.addVm = function (vm) {
	  (this.vms = this.vms || []).push(vm)
	}

	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */

	p.removeVm = function (vm) {
	  this.vms.$remove(vm)
	}

	module.exports = Observer


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {proto: true}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(14)

	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */

	function Dep () {
	  this.subs = []
	}

	var p = Dep.prototype

	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	p.addSub = function (sub) {
	  this.subs.push(sub)
	}

	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	p.removeSub = function (sub) {
	  this.subs.$remove(sub)
	}

	/**
	 * Notify all subscribers of a new value.
	 */

	p.notify = function () {
	  // stablize the subscriber list first
	  var subs = _.toArray(this.subs)
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update()
	  }
	}

	module.exports = Dep

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(14)
	var arrayProto = Array.prototype
	var arrayMethods = Object.create(arrayProto)

	/**
	 * Intercept mutating methods and emit events
	 */

	;[
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
	  var original = arrayProto[method]
	  _.define(arrayMethods, method, function mutator () {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length
	    var args = new Array(i)
	    while (i--) {
	      args[i] = arguments[i]
	    }
	    var result = original.apply(this, args)
	    var ob = this.__ob__
	    var inserted
	    switch (method) {
	      case 'push':
	        inserted = args
	        break
	      case 'unshift':
	        inserted = args
	        break
	      case 'splice':
	        inserted = args.slice(2)
	        break
	    }
	    if (inserted) ob.observeArray(inserted)
	    // notify change
	    ob.notify()
	    return result
	  })
	})

	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */

	_.define(
	  arrayProto,
	  '$set',
	  function $set (index, val) {
	    if (index >= this.length) {
	      this.length = index + 1
	    }
	    return this.splice(index, 1, val)[0]
	  }
	)

	/**
	 * Convenience method to remove the element at given index.
	 *
	 * @param {Number} index
	 * @param {*} val
	 */

	_.define(
	  arrayProto,
	  '$remove',
	  function $remove (index) {
	    /* istanbul ignore if */
	    if (!this.length) return
	    if (typeof index !== 'number') {
	      index = _.indexOf(this, index)
	    }
	    if (index > -1) {
	      this.splice(index, 1)
	    }
	  }
	)

	module.exports = arrayMethods

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(14)
	var objProto = Object.prototype

	/**
	 * Add a new property to an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$add',
	  function $add (key, val) {
	    if (this.hasOwnProperty(key)) return
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      this[key] = val
	      return
	    }
	    ob.convert(key, val)
	    ob.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._proxy(key)
	        // vm._digest() // todo
	      }
	    }
	  }
	)

	/**
	 * Set a property on an observed object, calling add to
	 * ensure the property is observed.
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$set',
	  function $set (key, val) {
	    this.$add(key, val)
	    this[key] = val
	  }
	)

	/**
	 * Deletes a property from an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @public
	 */

	_.define(
	  objProto,
	  '$delete',
	  function $delete (key) {
	    if (!this.hasOwnProperty(key)) return
	    delete this[key]
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      return
	    }
	    ob.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._unproxy(key)
	        // vm._digest() // todo
	      }
	    }
	  }
	)


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * ViewModel template parser & data-binding process
	 */

	var _ = __webpack_require__(7)
	var extend = _.extend

	var Watcher = __webpack_require__(21)
	var config = __webpack_require__(5)
	var nativeComponentMap = config.nativeComponentMap
	var composedComponentMap = config.composedComponentMap

	function appendAction(ref, el, flag) {
	  var app = this._app
	  var queue = app._queue
	  var tasks = []

	  if (flag !== 'NO_APPEND') {
	      tasks.push(app.addElement(ref, el))
	      // tasks.push.apply(tasks, events.forEach(function(args) {
	      //   var ref = args[0]
	      //   var type = args[1]
	      //   return app.addEvent(ref, type)
	      // }))
	  }

	  if (flag === 'APPEND_ASYNC') {
	    app.updates.length = 0
	    app.callTasks(tasks, queue.next.bind(queue))
	  } else if (flag === 'APPEND_SYNC') {
	    return true
	  }
	}


	/**
	 * generate the element and set it to this._el
	 * 
	 * @param  {Boolean}  isRoot   optimized specially for top level element
	 * @param  {Function} callback available for async process in isRoot mode
	 */
	exports._build = function (parentEl, flag, block) {
	  var self = this

	  if (!composedComponentMap[this._template.type]) {
	    this._el = this._generate(this._template, this._type, parentEl, flag, block)
	  }
	  else {
	    this._el = this._generateComposed(this._template, this._type, parentEl, flag, block)
	  }
	}


	/**
	 * set selves' id/attr/style/class/event
	 */
	exports._generateSelf = function (template, componentType) {
	  var app = this._app
	  var document = app.document
	  var type = template.type

	  // if (!nativeComponentMap[type] && !composedComponentMap[type]) {
	  //   type = 'container'
	  // }

	  var el = document.createElement(type)

	  if (componentType) {
	    el.component = componentType
	  }

	  this._setId(template.id, el, this)
	  this._setAttr(el, template.attr)
	  this._setClass(el, template.classList)
	  this._setStyle(el, template.style)
	  this._bindEvents(el, template.events)

	  return el
	}

	/**
	 * generate native element
	 */
	exports._generate = function (template, componentType, parentEl, flag, block) {
	  var app = this._app
	  var queue = app._queue
	  var isBody = parentEl.ref === undefined
	  var el = isBody ? parentEl.body : this._generateSelf(template, componentType)

	  if (isBody) {
	    app.root = el
	    el.ref = '_root'
	    el.type = this._type
	  } else {
	    flag = flag || 'APPEND_ASYNC'

	    if (flag === 'INSERT_BEFORE_ASYNC') {
	      parentEl.insertBefore(el, block.ender)
	    } else if (flag === 'APPEND_ASYNC') {
	      parentEl.appendChild(el)
	    }

	    if (!app.rendered && !!app.addElement) {
	      // var elJSON = JSON.stringify(el.toJSON())
	      // var events = this._events.filter(function(e) {
	      //   return e.el.ref === el.ref
	      // }).map(function(e) {
	      //   return [e.el.ref, e.type]
	      // })

	      var item = appendAction.bind(this, parentEl.ref, el.toJSON(), flag)
	      queue.add(item)
	    }
	  }
	  
	  this._setChildren(el, template.children)

	  return el
	}

	/**
	 * generate specially when composed element at the top level
	 */
	exports._generateComposed = function (template, componentType, parentEl, flag, block) {
	  var app = this._app
	  var document = app.document
	  var Vm = this.constructor

	  var options = {
	    app: app,
	    parent: this,
	    parentEl: parentEl,
	    data: template.attr
	    // queue: this._queue
	  }

	  var vm = new Vm(template.type, options, flag, block)
	  var el = vm._el

	  this._setId(template.id, el, vm)
	  this._setClass(el, template.classList)
	  this._setStyle(el, template.style)
	  this._bindEvents(el, template.events)

	  el.component = template.type

	  if (vm._content) {
	    this._setChildren(el, template.children)
	  }

	  return el
	}

	exports._setId = function (id, el, vm) {
	  var self = this
	  var handler
	  if (typeof id === 'function') {
	    handler = id
	    id = handler.call(this)
	    if (id) {
	      this._ids[id] = {el: el, vm: vm}
	    }
	    this._watch(handler, function (newId) {
	      if (newId) {
	        self._ids[newId] = {el: el, vm: vm}
	      }
	    })
	  }
	  else if (id && typeof id === 'string') {
	    this._ids[id] = {el: el, vm: vm}
	  }
	}

	exports._setAttr = function (el, attr) {
	  this._bindProps(el, 'attr', attr)
	}

	exports._setClass = function (el, classList) {
	  var self = this

	  if (typeof classList !== 'function' && !Array.isArray(classList)) {
	    return
	  }
	  if (Array.isArray(classList) && !classList.length) {
	    return
	  }

	  var setClassStyle = function (classList) {
	    var css = self._css
	    var classStyle = {}
	    var length = classList.length
	    var i, key, style
	    for (i = 0; i < length; i++) {
	      style = css[classList[i]]
	      if (style) {
	        for (key in style) {
	          classStyle[key] = style[key]
	        }
	      }
	    }
	    el.classStyle = classStyle
	    self._app.updates.push({
	      method: 'updateClass', args: [self._app.id, el.ref]
	    })
	  }

	  if (typeof classList === 'function') {
	    this._watch(classList, setClassStyle)
	    setClassStyle(classList.call(this))
	  }
	  else {
	    setClassStyle(classList)
	  }
	}

	exports._setStyle = function (el, style) {
	  this._bindProps(el, 'style', style)
	}

	exports._bindEvents = function (el, events) {
	  if (!events) {
	    return
	  }
	  var i, key, handler, listener
	  var manager = this._app.eventManager
	  var keys = Object.keys(events)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    handlerName = events[key]
	    el.event.push(key)
	    manager.add(el, key, _.bind(this[handlerName], this))
	    this._events.push({el: el, type: key})
	    this._app.updates.push({
	      method: 'addEvent', args: [this._app.id, el.ref, key]
	    })
	  }
	}

	exports._setChildren = function (el, children) {
	  if (!children) {
	    return
	  }
	  var length = children.length
	  var i, child
	  for (i = 0; i < length; i++) {
	    child = children[i]
	    this._setChild(el, child)
	  }
	}

	exports._setChild = function (el, template) {
	  var app = this._app
	  var document = app.document
	  var Vm = this.constructor
	  var sub, subEl, content

	  // <content></content>
	  if (template.type === 'content') {
	    this._setContentChild(el, template)
	    return true
	  }

	  // <foo if="{{condition}}">...</foo>
	  if (typeof template.shown === 'function') {
	    this._setShownChild(el, template)
	    return true
	  }

	  // <foo repeat="{{list}}">...</foo>
	  if (typeof template.repeat === 'function') {
	    this._setRepeatChildren(el, template)
	    return true
	  }

	  if (!composedComponentMap[template.type]) {
	    // native component
	    subEl = this._generate(template, undefined, el)
	  }
	  else {
	    subEl = this._generateComposed(template, template.type, el);
	  }

	  // append/insert element in children or <content>
	  content = this._content
	  if (content) {
	    content.parent.insertBefore(subEl, content.ender)
	  }
	}

	exports._setContentChild = function (el, template) {
	  var self = this
	  var Vm = this.constructor
	  var app = this._app
	  var document = app.document

	  var content = this._content

	  if (!content) {
	    var starter = document.createComment('content-start')
	    var ender = document.createComment('content-end')
	    el.appendChild(starter)
	    el.appendChild(ender)
	    this._content = {parent: el, starter: starter, ender: ender}
	  }
	}

	exports._setShownChild = function (el, template) {
	  var self = this
	  var Vm = this.constructor
	  var app = this._app
	  var document = app.document

	  var block = this._setBlock(el, 'if')
	  var starter = block.starter
	  var ender = block.ender

	  var checkShown = function (shown, firstTime) {
	    var sub, subEl
	    if (!document.getRef(el.ref)) {
	      return
	    }

	    // record old ref to call removeElement finally
	    var hasOldRefs = !!block.oldRefs
	    if (!hasOldRefs) {
	      block.oldRefs = []
	    }
	    var oldEl = ender.prev()
	    if (oldEl !== starter) {
	      // app.updates.push({
	      //   method: 'removeElement', args: [app.id, oldEl.ref]
	      // })
	      if (!hasOldRefs) {
	        block.oldRefs.push(oldEl.ref)
	      }
	      el.removeChild(oldEl)
	    }

	    // end when hidden
	    if (!shown) {
	      app.updates.push({
	        method: 'mutation', args: [app.id, el.ref, block]
	      })
	      return
	    }

	    // create and insert the shown element
	    var flag = firstTime ? undefined : 'INSERT_BEFORE_ASYNC'
	    if (!composedComponentMap[template.type]) {
	      subEl = self._generate(template, undefined, el, flag, block)
	    }
	    else {
	      subEl = self._generateComposed(template, template.type, el, flag, block)
	    }

	    app.updates.push({
	      method: 'mutation', args: [app.id, el.ref, block]
	    })
	  }

	  // bind and init
	  this._watch(template.shown, checkShown)
	  checkShown(template.shown.call(this), true)
	}

	exports._setRepeatChildren = function (el, template) {
	  var self = this
	  var app = this._app
	  var document = app.document

	  var block = this._setBlock(el, 'repeat')
	  var starter = block.starter
	  var ender = block.ender

	  var checkRepeat = function (list, firstTime) {
	    // clear
	    if (!document.getRef(el.ref)) {
	      return
	    }

	    // record old refs to call removeElement finally
	    var node = ender.prev()
	    var temp
	    var hasOldRefs = !!block.oldRefs
	    if (!hasOldRefs) {
	      block.oldRefs = []
	    }
	    while (node !== starter) {
	      temp = node
	      node = node.prev()
	      // app.updates.push({
	      //   method: 'removeElement', args: [app.id, temp.ref]
	      // })
	      if (!hasOldRefs) {
	        block.oldRefs.push(temp.ref)
	      }
	      el.removeChild(temp)
	    }

	    // create and insert the repeat elements
	    var length = list.length
	    var i, item, subEl
	    var flag = firstTime ? undefined : 'INSERT_BEFORE_ASYNC'
	    for (i = 0; i < length; i++) {
	      item = list[i]
	      subEl = self._clone(template, item, el, flag, block)
	    }

	    app.updates.push({
	      method: 'mutation', args: [app.id, el.ref, block]
	    })
	  }

	  this._watch(template.repeat, checkRepeat)
	  checkRepeat(template.repeat.call(this), true)
	}

	exports._setBlock = function (el, name) {
	  var app = this._app
	  var document = app.document

	  var starter = document.createComment(name + '-start')
	  var ender = document.createComment(name + '-end')

	  var content = this._content

	  if (content) {
	    content.parent.insertBefore(starter, content.ender)
	    content.parent.insertBefore(ender, content.ender)
	  }
	  else {
	    el.appendChild(starter)
	    el.appendChild(ender)
	  }

	  var block = {starter: starter, ender: ender, parent: el}
	  app.blocks.push(block)
	  return block
	}

	exports._clone = function (template, itemData, parent, flag, block) {
	  if (!composedComponentMap[template.type]) {
	    return this._cloneNative(template, itemData, parent, flag, block)
	  }
	  else {
	    return this._cloneComposed(template, itemData, parent, flag, block)
	  }
	}

	exports._cloneNative = function (template, itemData, parent, flag, block) {
	  // new context
	  // bind item data
	  // generate template
	  var context = Object.create(this)
	  context._data = itemData
	  context._initData()
	  return context._generate(template, null, parent, flag, block)
	}

	exports._cloneComposed = function (template, itemData, parent, flag, block) {
	  var cloneTemplate

	  // new context
	  var context = Object.create(this)
	  context._data = itemData
	  context._initData()

	  // clone template
	  var clonedTemplate = Object.create(template)
	  clonedTemplate.attr = Object.create(template.attr || {})
	  extend(clonedTemplate.attr, itemData)

	  return context._generateComposed(clonedTemplate, clonedTemplate.type, parent, flag, block)
	}

	exports._bindSubData = function (parent, data) {
	  if (!data) {
	    return
	  }
	  var i, key, value, update
	  var subData = this._data
	  // var keys = Object.keys(data)
	  // i = keys.length
	  // while (i--) {
	  //   key = keys[i]
	  for (key in data) {
	    value = data[key]
	    if (!this.hasOwnProperty(key)) {
	      this._proxy(key)
	    }
	    if (typeof value === 'function') {
	      update = value
	      parent._bindKey(subData, null, key, update)
	    }
	    else {
	      subData[key] = value
	    }
	  }
	}

	exports._bindProps = function (el, name, data) {
	  if (!data) {
	    return
	  }
	  var i, key, value, update
	  var keys = Object.keys(data)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    value = data[key]
	    if (typeof value === 'function') {
	      update = value
	      this._bindKey(el, name, key, update)
	    }
	    else {
	      el[name][key] = value
	    }
	  }
	}

	exports._bindKey = function (el, name, key, calc) {
	  var self = this
	  var obj = name ? el[name] : el
	  obj[key] = calc.call(this)
	  this._app.diff()
	  this._watch(calc, function (value) {
	    obj[key] = value
	    if (name) {
	      self._app.updates.push({
	        method: 'update', args: [self._app.id, el.ref, name, key]
	      })
	    }
	  })
	}

	exports._watch = function (calc, callback) {
	  var app = this._app
	  new Watcher(this, calc, function (value, oldValue) {
	    if (typeof value !== 'object' && value === oldValue) {
	      return
	    }
	    app.diff()
	    callback(value)
	  })
	}






/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The MIT License (MIT)
	 *
	 * Copyright (c) 2013-2015 Yuxi Evan You
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */

	var _ = __webpack_require__(14)
	// var config = require('./config')
	var Observer = __webpack_require__(15)
	// var expParser = require('./parsers/expression')
	// var batcher = require('./batcher')
	var uid = 0

	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String} expression
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Function} [preProcess]
	 * @constructor
	 */

	// function Watcher (vm, expression, cb, options) {
	function Watcher (vm, update, cb) {
	  this.vm = vm
	  vm._watchers.push(this)
	  // this.expression = expression
	  this.cb = cb
	  this.id = ++uid // uid for batching
	  this.active = true
	  // options = options || {}
	  // this.deep = !!options.deep
	  // this.user = !!options.user
	  // this.twoWay = !!options.twoWay
	  // this.filters = options.filters
	  // this.preProcess = options.preProcess
	  this.deps = []
	  this.newDeps = []
	  // parse expression for getter/setter
	  // var res = expParser.parse(expression, options.twoWay)
	  // this.getter = res.get
	  // this.setter = res.set
	  this.getter = update
	  this.value = this.get()
	}

	var p = Watcher.prototype

	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */

	p.addDep = function (dep) {
	  var newDeps = this.newDeps
	  var old = this.deps
	  if (_.indexOf(newDeps, dep) < 0) {
	    newDeps.push(dep)
	    var i = _.indexOf(old, dep)
	    if (i < 0) {
	      dep.addSub(this)
	    } else {
	      old[i] = null
	    }
	  }
	}

	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */

	p.get = function () {
	  this.beforeGet()
	  var vm = this.vm
	  var value
	  try {
	    value = this.getter.call(vm, vm)
	  } catch (e) {
	    // if (config.warnExpressionErrors) {
	    //   _.warn(
	    //     'Error when evaluating expression "' +
	    //     this.expression + '":\n   ' + e
	    //   )
	    // }
	    _.warn('Error when update"')
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value)
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value)
	  }
	  if (this.filters) {
	    value = vm._applyFilters(value, null, this.filters, false)
	  }
	  this.afterGet()
	  return value
	}

	// /**
	//  * Set the corresponding value with the setter.
	//  *
	//  * @param {*} value
	//  */

	// p.set = function (value) {
	//   var vm = this.vm
	//   if (this.filters) {
	//     value = vm._applyFilters(
	//       value, this.value, this.filters, true)
	//   }
	//   try {
	//     this.setter.call(vm, vm, value)
	//   } catch (e) {
	//     // if (config.warnExpressionErrors) {
	//       _.warn(
	//         'Error when evaluating setter "' +
	//         this.expression + '":\n   ' + e
	//       )
	//     // }
	//   }
	// }

	/**
	 * Prepare for dependency collection.
	 */

	p.beforeGet = function () {
	  Observer.target = this
	}

	/**
	 * Clean up for dependency collection.
	 */

	p.afterGet = function () {
	  Observer.target = null
	  var i = this.deps.length
	  while (i--) {
	    var dep = this.deps[i]
	    if (dep) {
	      dep.removeSub(this)
	    }
	  }
	  this.deps = this.newDeps
	  this.newDeps = []
	}

	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 */

	// p.update = function () {
	//   if (!config.async || config.debug) {
	//     this.run()
	//   } else {
	//     batcher.push(this)
	//   }
	// }

	// /**
	//  * Batcher job interface.
	//  * Will be called by the batcher.
	//  */

	// p.run = function () {
	p.update = function () {
	  if (this.active) {
	    var value = this.get()
	    if (
	      value !== this.value ||
	      Array.isArray(value) ||
	      this.deep
	    ) {
	      var oldValue = this.value
	      this.value = value
	      this.cb(value, oldValue)
	    }
	  }
	}

	/**
	 * Remove self from all dependencies' subcriber list.
	 */

	p.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // we can skip this if the vm if being destroyed
	    // which can improve teardown performance.
	    if (!this.vm._isBeingDestroyed) {
	      this.vm._watchers.$remove(this)
	    }
	    var i = this.deps.length
	    while (i--) {
	      this.deps[i].removeSub(this)
	    }
	    this.active = false
	    this.vm = this.cb = this.value = null
	  }
	}


	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {Object} obj
	 */

	function traverse (obj) {
	  var key, val, i
	  for (key in obj) {
	    val = obj[key]
	    if (_.isArray(val)) {
	      i = val.length
	      while (i--) traverse(val[i])
	    } else if (_.isObject(val)) {
	      traverse(val)
	    }
	  }
	}

	module.exports = Watcher


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Vm 对象中的内置 API，全部约定以 `$` 开头命名
	 */

	/**
	 * 找到组件中相应 id 的 vm 对象
	 * 注：id 只在当前组件内保证唯一，如果想找子组件或上层组件，
	 * 可利用组件间的通信模式加以实现
	 * 
	 * @param  {string} id
	 * @return {Vm}
	 */
	exports.$ = function (id) {
	  var info = this._ids[id]
	  if (info) {
	    return info.vm
	  }
	}

	/**
	 * 滚动到某个元素可见，offset 是其可见位置的偏移量
	 * 封装自 app 的 `scrollTo(ref, offset)` 方法
	 * 
	 * @param  {string} id
	 * @param  {number} offset
	 */
	exports.$scrollTo = function (id, offset) {
	  var info = this._ids[id]
	  if (info) {
	    var task = this._app.scrollToElement(info.el.ref, {offset: offset})
	    this._app.callTasks(task)
	  }
	}

	/**
	 * 封装自 app 的 `getConfig(callback)` 方法
	 *
	 * @param {Function} callback
	 * 回调的参数字段：
	 * - os: 'iPhone' | 'android' | 'iPad'
	 * - wpversion: weappplus版本号，如 '1.0.0'
	 * - bundleurl: bundle 的 url
	 * - appname: 如 'TB' | 'TM' ...
	 * - appversion: app版本号，如 '1.0.0' 不限制位数
	 * - devid: 手机唯一标识，如 'Aqh9z8dRJNBhmS9drLG5BKCmXhecHUXIZoXOctKwFebH'
	 * - sysversion: 手机系统版本，如 iOS:"7.0.4" android:"4.4.4"
	 * - sysmodel: 手机系统型号，如 iOS:"MGA82J/A" android:"MI NOTE LTE"
	 * - ttid: 渠道号，如 'wandoujia'
	 * - userid: 用户id
	 */
	exports.$getConfig = function (callback) {
	  // var task = this._app.getConfig()
	  // this._app.callTasks(task, callback)
	  var config = this._app.flags
	  callback(config)
	}

	/**
	 * 封装自 app 的 `userTrack(type, name, comName, param)` 方法
	 * 
	 * @param {string} type 埋点类型：enter, click, expose
	 * @param {string} name 页面名称
	 * @param {string} comName 控件名称
	 * @param {object} param 页面参数 (监控平台显示)
	 */
	exports.$userTrack = function (type, name, comName, param) {
	  var task = this._app.commit(type, name, comName, param)
	  this._app.callTasks(task)
	}

	/**
	 * 封装自 app 的 `sendRequest(params, callback)` 方法
	 * @deprecated update to sendMtop/sendHttp
	 * @param  {object}   params
	 * - apiName
	 * - apiVersion
	 * - needLogin
	 * - needSign
	 * - needCache
	 * - requestType
	 * - requestParams
	 * @param  {Function} callback
	 */
	exports.$sendRequest = function (params, callback) {
	  params = params || {}
	  var requestType = params.requestType
	  var responseHelper = function (response) {
	    if (requestType !== 'acds') {
	        var data = response.data
	        delete response.data

	        response = {
	            meta: response,
	            data: data
	        }
	    }
	    else {
	        response = {
	            meta: {type: 'acds'},
	            data: response
	        }
	    }
	    return response
	  }
	  this._app.sendRequest(params, function (response) {
	    response = responseHelper(response)
	    callback(response)
	  })
	}

	exports.$sendMtop = function(params, callback) {
	  var task = this._app.sendMtop(params, callback)
	  this._app.callTasks(task)
	}

	exports.$sendHttp = function(params, callback) {
	  var task = this._app.sendHttp(params, callback)
	  this._app.callTasks(task)
	}

	/**
	 * 封装自 app 的 `openURL(url)` 方法
	 * 
	 * @param  {string} url
	 */
	exports.$openURL = function (url) {
	  var task = this._app.openURL(url)
	  this._app.callTasks(task)
	}

	/**
	 * 封装自 app 的 `setTitle(title)` 方法
	 * 
	 * @param  {string} title
	 */
	exports.$setTitle = function (title) {
	  var task = this._app.setTitle(title)
	  this._app.callTasks(task)
	}

	/**
	 * 封装自 app 的 `setSpm(a, b)` 方法
	 *
	 * @param  {string} a SPM A位
	 * @param  {string} b SPM B位
	 */
	exports.$setSpm = function (a, b) {
	  var task = this._app.setSpm(a, b)
	  this._app.callTasks(task)
	}

	exports.$getUserInfo = function(callback) {
	  var task = this._app.getUserInfo(callback)
	  this._app.callTasks(task)
	}

	exports.$login = function(callback) {
	  var task = this._app.login(callback)
	  this._app.callTasks(task)
	}

	exports.$logout = function(callback) {
	  var task = this._app.logout(callback)
	  this._app.callTasks(task)
	}

	/**
	 * 自由调用 native api，至少两个参数，参数总个数不定，取决于具体 api 设计
	 *
	 * @param  {string} module
	 * @param  {string} method
	 * ...
	 */
	exports.$call = function (_module, _method) {
	  var args = [].slice.call(arguments, 2)
	  var callback
	  if (typeof args[args.length - 1] === 'function') {
	    callback = args.pop()
	  }

	  this._app.callTasks({
	    module: _module,
	    method: _method,
	    args: args
	  }, callback)
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function Queue() {
	  var array = []

	  this._array = array

	  var lockRun = false;
	  function ensureRun() {
	    if (!isStarting || lockRun) return
	    lockRun = true

	    while (array.length) {
	      var item = array.shift()
	      if (item) {
	        var ret = item()
	        if (typeof ret === 'undefined') return
	        // if (typeof ret === 'function') {
	        //   array[0] = ret
	        //   break;
	        // } else if (ret === true){
	        //   array.shift()
	        // } else {
	        //   break
	        // }
	      } else {
	        continue
	      }
	    }
	    lockRun = false
	  }

	  this.add = function(item) {
	    array.push(item)
	    ensureRun()
	  }

	  var isStarting = false
	  var finishHandler
	  this.start = function(options) {
	    if (isStarting) return

	    isStarting = true
	    if (options && options.onfinish) {
	      finishHandler = options.onfinish
	    }
	  }

	  this.next = function() {
	    lockRun = false
	    ensureRun()
	  }

	  this.finish = function() {
	    if (!isStarting) return

	    isStarting = false
	    finishHandler && finishHandler()
	  }
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * instance controls from native
	 *
	 * - init bundle
	 * - fire event
	 * - callback
	 * - destroy
	 *
	 * corresponded with the API of instance manager (framework.js)
	 */

	var _ = __webpack_require__(7)
	var perf = __webpack_require__(3)

	exports.init = function init(code, data) {
	  var register = _.bind(this.register, this)
	  var render = function (type, _data) {
	    // 如果createInstance()时有传入data，则使用这个data，否则使用render时的data 
	    // @see: lib/framework.js
	    this.render(type, data || _data || {})
	  }.bind(this)

	  perf.start('run bundle', this.id)
	  // @see: lib/app/bundle.js
	  if (typeof code === 'function') {
	    // `function () {...}` -> `{...}`
	    // not very strict
	    eval(code.toString().substr(12))
	  }
	  else {
	    eval(code.toString())
	  }
	  perf.end('run bundle', this.id)
	}

	exports.destroy = function destroy() {
	  this.id = ''
	  this.eventManager = null
	  this.updates = null
	  this.vm = null
	  this.document = null
	  this.components = {}
	}

	exports.getRootElement = function getRootElement() {
	  var document = this.document || {}
	  var body = document.body || {}
	  return body.toJSON ? body.toJSON() : {}
	}

	exports.fireEvent = function fireEvent(ref, type, e) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var el = this.document.getElementByRef(ref)
	  if (el) {
	    perf.start('manage event', ref + '-' + type)
	    e = e || {}
	    e.type = type
	    e.target = el
	    e.timestamp = Date.now()
	    this.eventManager.fire(el, type, e)
	    perf.end('manage event', ref + '-' + type)
	    this.realDiff() // fixed setTimeout bug
	  }
	}

	exports.callback = function callback(callbackId, data) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var callback = this.callbacks[callbackId]
	  if (typeof callback === 'function') {
	    this.blocks.forEach(function resetBlock(block) {
	      block.rendered = true
	      delete block.oldRefs
	    })
	    callback(data) // data is already a object, @see: lib/framework.js
	    delete this.callbacks[callbackId]
	    this.realDiff() // fixed setTimeout bug
	  }
	}

	exports.refreshData = function refreshData(data) {
	  var vm = this.vm

	  if (typeof vm.refreshData === 'function') {
	      vm.refreshData(data)
	  }
	  else {
	    if (vm && data) {
	      _.extend(this.vm, data)
	    }
	  }
	  this.realDiff()
	  this.callTasks(this.refreshFinish())
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview
	 * all kinds of tasks called from JavaScript to Native
	 */


	var _ = __webpack_require__(7)

	function createTask(_module) {
	  return function(method, handler) {
	    return function() {
	      var that
	      var args = [].slice.call(arguments);
	      if (handler) {
	        args = handler.apply(that, args);
	      }

	      if (args) {
	        return {
	          module: _module,
	          method: method,
	          args: args
	        }
	      }
	    }
	  }
	}

	/*==================
	  Dom Module Tasks
	===================*/
	var domTask = createTask('dom');

	/**
	 * @method createBody
	 * @param {string} type
	 */
	exports.createBody = domTask('createBody', 
	  function(type) {
	    type = type || 'div'
	    return [type]
	  })

	/*
	exports.initAppendChild = function (parentId, el) {
	  var flags = this.flags

	  if (flags.NO_APPEND || flags.APPEND_ONCE) {
	    return
	  }

	  var elJSON
	  if (typeof el !== 'string') {
	    elJSON = JSON.stringify(el.toJSON())
	  } else {
	    elJSON = el
	  }

	  callNative(this.id, JSON.stringify([
	    {
	      module: 'WADomModule',
	      method: 'appendChild',
	      args: [this.id, parentId, elJSON]
	    }
	  ]))
	}
	*/

	/**
	 * @method addElement
	 * @param {string} parentRef 
	 * @param {object} element
	 * @param {number} [index=-1]
	 */
	exports.addElement = domTask('addElement', 
	  function(parentRef, element, index) {
	    // if (typeof element !== 'string') {
	    //   element = element.toJSON()
	    // }

	    index = index == null ? -1 : index

	    return [parentRef, element, index]
	  })

	/**
	 * @method removeElement
	 * @param  {string} ref
	 */
	exports.removeElement = domTask('removeElement')

	/**
	 * @method moveElement
	 * @param {string} ref 
	 * @param {string} parentRef
	 * @param {number} [index=-1]
	 */
	exports.moveElement = domTask('moveElement', 
	  function(ref, parentRef, index) {
	    index = index == null ? -1 : index

	    return [ref, parentRef, index]
	  })

	/**
	 * @method addEvent
	 * @param {string} ref
	 * @param {string} type
	 */
	exports.addEvent = domTask('addEvent')

	/**
	 * @method addEvent
	 * @param {string} ref
	 * @param {string} type
	 */
	exports.removeEvent = domTask('removeEvent')

	/**
	 * add events to elements which havn't been attached yet when init
	 */
	/*
	exports.initEvent = function (updates) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var patch = []
	  updates = updates || this.updates
	  var i, update, length = updates.length

	  for (i = 0; i < length; i++) {
	    update = updates[i]
	    if (update.method === 'addEvent') {
	      update.module = 'WADomModule'
	      patch.push(update)
	    }
	  }

	  this.updates = []
	  // this.rendered = true

	  if (patch.length > 0) {
	    callNative(this.id, JSON.stringify(patch))
	  }
	}
	*/

	/**
	 * @method  updateAttrs
	 * @param {string} ref
	 * @param {object} attr
	 */
	exports.updateAttrs = domTask('updateAttrs')

	/**
	 * @method  updateStyle
	 * @param {string} ref
	 * @param {object} style
	 */
	exports.updateStyle = domTask('updateStyle')

	/**
	 * @method createFinish
	 */
	exports.createFinish = domTask('createFinish')

	/**
	 * @method refreshFinish
	 */
	exports.refreshFinish = domTask('refreshFinish')

	/**
	 * @method scrollToElement
	 * @param {string} ref
	 * @param {object} options
	 * @param {number} options.offset
	 */
	exports.scrollToElement = domTask('scrollToElement')

	/**
	 * record the time rendering completed
	 */
	/*
	exports.finishRendering = function () {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var tasks = [{
	    module: 'WAEventModule',
	    method: 'renderFinish',
	    args: [this.id]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*==================
	  Stream Module Tasks
	===================*/
	var streamTask = createTask('stream');

	/**
	 * @method sendMtop
	 * @param  {object} params
	 * @param  {string} params.api
	 * @param  {object} params.param
	 * @param  {string} [params.v="*"]
	 * @param  {string} [params.ecode="0"]
	 * @param  {string} [params.isHttps="0"]
	 * @param  {string} [params.isSec="0"]
	 * @param  {string} [params.post="0"]
	 * @param  {number} [params.timer]
	 * @param  {string} [params.sessionOption="AutoLoginOnly"]
	 * @param  {function} callback
	 */
	exports.sendMtop = streamTask('sendMtop', function(params, callback) {
	    this.callbacks[++this.uid] = callback

	    return [params, this.uid.toString()]
	})

	/**
	 * @method sendHttp
	 * @param  {object} params
	 * @param  {string} params.url
	 * @param  {string} [params.method]
	 * @param  {object} [params.header]
	 * @param  {object} params.body
	 * @param  {function} callback
	 */
	exports.sendHttp = streamTask('sendHttp', function(params, callback) {
	    this.callbacks[++this.uid] = callback

	    return [params, this.uid.toString()]
	})

	/*
	exports.sendRequest = function (params, callback) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  this.callbacks[++this.uid] = callback

	  var tasks = [{
	    module: 'WAStreamModule',
	    method: 'sendRequest',
	    args: [this.id, JSON.stringify(params), this.uid.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*==================
	  Event Module Tasks
	===================*/
	var eventTask = createTask('event');
	/**
	 * @method openURL
	 * @param {string} url
	 */
	exports.openURL = eventTask('openURL')

	/*
	exports.openURL = function (url) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  if (!url) {
	    return
	  }

	  var tasks = [{
	    module: 'WAEventModule',
	    method: 'openURL',
	    args: [this.id, url.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*==================
	  pageInfo Module Tasks
	===================*/
	var pageInfoTask = createTask('pageInfo')

	/**
	 * @method setTitle
	 * @param {string} text
	 */
	exports.setTitle = pageInfoTask('setTitle')

	/*
	exports.setTitle = function (title) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  if (!title) {
	    return
	  }

	  var tasks = [{
	    module: 'WAPageInfoModule',
	    method: 'setTitle',
	    args: [this.id, title.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/**
	 * @method setSpm
	 * @param {string} a
	 * @param {string} b
	 */
	exports.setSpm = pageInfoTask('setSpm')

	/*
	exports.setSpm = function (a, b) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var tasks = [{
	    module: 'WAPageInfoModule',
	    method: 'setSpm',
	    args: [this.id, a.toString(), b.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*==================
	  user Module Tasks
	===================*/
	var userTask = createTask('user')

	exports.getUserInfo = userTask('getUserInfo', function(callback) {
	    this.callbacks[++this.uid] = callback

	    return [this.uid.toString()]
	})

	exports.login = userTask('login', function(callback) {
	    this.callbacks[++this.uid] = callback

	    return [this.uid.toString()]
	})

	exports.logout = userTask('logout', function(callback) {
	    this.callbacks[++this.uid] = callback

	    return [this.uid.toString()]
	})

	/*==================
	  userTrack Module Tasks
	===================*/
	var utTask = createTask('userTrack')

	/**
	 * @method commit
	 * @param {string} type 埋点类型：enter，click, expose, updateNextProp
	 * @param {string} name 页面名称
	 * @param {string} comName 控件名称 以ut定义的类型为标准 Button Text Image
	 * @param {object} param 页面参数 (监控平台显示)
	 */
	exports.commit = utTask('commit')

	/*
	exports.userTrack = function (type, name, comName, params) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  var tasks = [{
	    module: 'WAUserTrackModule',
	    method: 'userTrack',
	    args: [this.id, type, name, comName, JSON.stringify(params)]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*
	exports.scrollTo = function (ref, offset) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  offset = (offset || 0).toString()
	  var tasks = [{
	    module: 'WAGestureModule',
	    method: 'scrollToElement',
	    args: [this.id, ref, JSON.stringify({offset: offset})]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*==================
	  config Module Tasks
	===================*/
	// var configTask = createTask('config')

	/**
	 * @method  getConfig
	 */
	// exports.getConfig = configTask('getConfig')

	/*
	exports.getConfig = function (callback) {
	  var flags = this.flags

	  if (flags.NO_APPEND) {
	    return
	  }

	  this.callbacks[++this.uid] = callback

	  var tasks = [{
	    module: 'WAConfigModule',
	    method: 'getConfig',
	    args: [this.id, this.uid.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	/*
	exports.nextTick = function (callback) {
	  this.callbacks[++this.uid] = callback

	  var tasks = [{
	    module: 'WAEventModule',
	    method: 'nextTick',
	    args: [this.id, this.uid.toString()]
	  }]

	  callNative(this.id, JSON.stringify(tasks))
	}
	*/

	exports.callTasks = function(tasks, callback) {
	  if (_.typof(tasks) !== 'array') {
	    tasks = [tasks]
	  }

	  tasks = tasks.filter(function(task) {
	    return !!task
	  }).map(function(task) {
	    if (task.args) {
	      task.args = task.args.map(_.normalize)
	    }
	    return task
	  })

	  if (callback) {
	    this.callbacks[++this.uid] = callback
	    callNative(this.id, tasks, this.uid.toString())
	  } else {
	    callNative(this.id, tasks, '-1')
	  }
	}

	/*
	exports.call = function (fullArgs) {
	  var args = _.toArray(fullArgs, 2)
	  args = [this.id].concat(args).map(_.stringify)
	  callNative(this.id, JSON.stringify([
	    {
	      module: fullArgs[0],
	      method: fullArgs[1],
	      args: args
	    }
	  ]))
	}
	*/


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(7)
	var perf = __webpack_require__(3)

	/**
	 * @deprecated
	 */
	exports.diff = function () {
	  // clearTimeout(this.diffTimer)
	  // if (!this.rendered) {return}
	  // this.diffTimer = setTimeout(function () {
	  //   this.realDiff()
	  // }.bind(this), 100)
	}

	exports.handleElementUpdate = function (item, updates) {
	  var ref = item.args[1]
	  var document = this.document
	  var node = document.getElementByRef(ref)
	  var name, key

	  if (!node) {
	    return
	  }

	  var el = updates[ref]

	  if (!el) {
	    el = {}
	    updates[ref] = el
	  }

	  if (item.method === 'update') {
	    name = item.args[2]
	    key = item.args[3]
	  }
	  if (item.method === 'updateAttrs') {
	    name = 'attr'
	    key = item.args[2]
	  }
	  if (item.method === 'updateStyle') {
	    name = 'style'
	    key = item.args[2]
	  }
	  if (item.method === 'updateClass') {
	    name = 'fullStyle'
	  }

	  if (!el[name]) {
	    el[name] = {}
	  }

	  if (name === 'fullStyle') {
	    el['fullStyle'] = node.toStyle()
	  }
	  else {
	    el[name][key] = node[name][key]
	  }
	}

	/**
	 * @deprecated
	 */
	exports.handleElementMutation = function (item, mutations) {
	  var ref = item.args[1]
	  var target = item.args[2]
	  var document = this.document
	  var node = document.getElementByRef(ref)
	  var parentRef = node.parentRef

	  while (node && node.type === 'comment') {
	    node = node.next()
	  }

	  var method, args

	  if (node) {
	    mutations.push({method: 'insertBefore', ref: node.ref, target: target})
	  }
	  else {
	    mutations.push({method: 'appendChild', ref: parentRef, target: target})
	  }
	}

	/**
	 * @deprecated
	 */
	exports.handleElementRemove = function (item, removes) {
	  var ref = item.args[1]
	  removes.push(ref)
	}

	exports.handleElementEvent = function (item, events) {
	  events.push(item)
	}

	/**
	 * @deprecated
	 */
	exports.flushRemoves = function (removes, patch) {
	  var appId = this.id
	  var length = removes.length
	  var i, ref

	  for (i = 0; i < length; i++) {
	    ref = removes[i]
	    patch.push({
	      module: 'WADomModule',
	      method: 'removeElement',
	      args: [appId, ref]
	    })
	  }
	}

	/**
	 * @deprecated
	 */
	exports.flushMutations = function (mutations, patch) {
	  var appId = this.id
	  var document = this.document

	  // foreach mutations
	  // -> find p/s-ref, treeRef, newRefs[]
	  // -> foreach newRefs -> newRefSEl[newRef] = treeRef
	  var newRefSEl = {}
	  var refMap = {}
	  mutations.forEach(function (mutation) {
	    var method = mutation.method
	    var ref = mutation.ref
	    var target = mutation.target
	    var treeRef = target.ref
	    var newRefs = document.getElementByRef(treeRef).getAllRefs()
	    newRefs.forEach(function (newRef) {
	      newRefSEl[newRef] = treeRef
	    })
	    refMap[treeRef] = mutation
	    mutation.subs = []
	  })

	  // foreach mutations
	  // -> if p/s-ref in newRefSEl
	  // --> mutations[p/s-ref].subs.push(treeRef)
	  // --> dep = p/s-ref
	  mutations.forEach(function (mutation) {
	    var ref = mutation.ref
	    var treeRef = mutation.target.ref
	    var depRef = newRefSEl[ref]
	    if (depRef) {
	      refMap[depRef].subs.push(treeRef)
	      mutation.dep = depRef
	    }
	  })

	  // foreach mutations
	  // -> if no dep
	  // --> call mutation
	  // --> call subs
	  function handleMutation(mutation) {
	    patch.push({
	      module: 'WADomModule',
	      method: mutation.method,
	      args: [appId, mutation.ref, JSON.stringify(mutation.target)]
	    })

	    // var subs = mutation.subs
	    // if (subs && subs.length) {
	    //   subs.forEach(function (subRef) {
	    //     handleMutation(refMap[subRef])
	    //   })
	    // }
	  }

	  mutations.forEach(function (mutation) {
	    if (!mutation.dep) {
	      handleMutation(mutation)
	    }
	  })

	  return newRefSEl
	}

	exports.patchUpdates = function (updates, newRefSEl, patch) {
	  var appId = this.id
	  var el

	  var newRefMap = {}
	  newRefSEl.forEach(function (ref) {
	    newRefMap[ref] = true
	  })

	  for (ref in updates) {
	    if (newRefMap[ref]) {
	      continue
	    }
	    el = updates[ref]
	    if (el.attr) {
	      // patch.push({
	      //   module: 'WADomModule',
	      //   method: 'updateAttrs',
	      //   args: [appId, ref, JSON.stringify(el.attr)]
	      // })
	      patch.push(this.updateAttrs(ref, el.attr))
	    }
	    if (el.style) {
	      // patch.push({
	      //   module: 'WADomModule',
	      //   method: 'updateStyle',
	      //   args: [appId, ref, JSON.stringify(el.style)]
	      // })
	      patch.push(this.updateStyle(ref, el.style))
	    }
	    if (el.fullStyle) {
	      // patch.push({
	      //   module: 'WADomModule',
	      //   method: 'updateFullStyle',
	      //   args: [appId, ref, JSON.stringify(el.fullStyle)]
	      // })
	      patch.push(this.updateStyle(ref, el.fullStyle))
	    }
	  }
	}

	exports.patchEvents = function (events, patch) {
	  var length = events.length
	  var i, item
	  for (i = 0; i < length; i++) {
	    item = events[i]
	    // patch.push({
	    //   module: 'WADomModule',
	    //   method: 'addEvent',
	    //   args: item.args
	    // })
	   patch.push(this.addEvent(item[1], item[2])) 
	  }
	}

	// new mutation sub-process
	exports.removeEach = function (refList, patch) {
	  var that = this
	  var appId = this.id

	  if (!refList || !refList.length) {
	    return
	  }
	  // refList.forEach(function (ref) {
	  //   patch.push({
	  //     module: 'WADomModule',
	  //     method: 'removeElement',
	  //     args: [appId, ref]
	  //   })
	  // })
	  for (var i = 0; i < refList.length; i++) {
	    patch.push(this.removeElement(refList[i]))
	  }
	}

	// new mutation sub-process
	exports.findNext = function (el, mutations) {
	  var isNew = true
	  var next = el.next()

	  // find next non-comment element
	  while (next && next.type === 'comment') {
	    // once meet comment element, no more new element added
	    isNew = false

	    // jump the non-parsed mutation block
	    var tempBlock = mutations[next.ref]
	    if (tempBlock && tempBlock.changed) {
	      next = tempBlock.ender
	    }

	    next = next.next()
	  }

	  // if next element not exsited, set isNew false
	  if (!next) {
	    isNew = false
	  }

	  return {
	    el: next,
	    isNew: isNew,
	    hasNext: !isNew && next
	  }
	}

	// new mutation sub-process
	exports.addEach = function (elements, method, parentRef, patch) {
	  // var appId = this.id
	  var self = this
	  var totalNewRefs = []

	  elements.forEach(function (el, index) {
	    var newRefs = el.getAllRefs()
	    totalNewRefs.push.apply(totalNewRefs, newRefs)
	    // patch.push({
	    //   module: 'WADomModule',
	    //   method: method,
	    //   args: [appId, targetRef, JSON.stringify(el)]
	    // })
	    index = method === 'insertBefore' ? index : -1
	    patch.push(self.addElement(parentRef, el, index))
	  })

	  return totalNewRefs
	}

	// new mutation process
	exports.patchMutations = function (mutations, patch, totalNewRefs) {
	  var appId = this.id
	  var self = this

	  // prepare:
	  // - starter, ender, parent
	  // - rendered, changed
	  // - oldRefs[]: record current elements first time (if rendered yet)

	  // foreach mutations[]
	  //   if block.rendered
	  //     remove all old elements from block.oldRefs[]
	  //     foreach newElements[]
	  //       find existing element after block
	  //       insert before the after element or append to parent
	  //       get all sub refs and push into totalNewRefs[]
	  //   else
	  //     set block.rendered
	  //   clear block.oldRefs[]
	  for (var startRef in mutations) {
	    var block = mutations[startRef]
	    if (block.rendered) {
	      this.removeEach(block.oldRefs, patch)
	      var parentRef = block.parent.ref
	      var next = this.findNext(block.starter, mutations)
	      var appendList = []
	      while (next.isNew) {
	        appendList.push(next.el)
	        next = this.findNext(next.el, mutations)
	      }
	      var method = next.el ? 'insertBefore' : 'appendChild'
	      // var ref = next.el ? next.el.ref : block.parent.ref
	      // var index = next.el ? appendList.length : -1
	      var newRefs = this.addEach(appendList, method, parentRef, patch)

	      totalNewRefs.push.apply(totalNewRefs, newRefs)
	    }
	    else {
	      block.rendered = true
	    }
	    delete block.changed
	    delete block.oldRefs
	  }
	}

	exports.realDiff = function () {
	  var self = this

	  if (!this.updates.length) {
	    return
	  }

	  // preparations
	  var document = this.document
	  var updates = this.updates
	  var patch = []

	  var elUpdates = {}
	  var elMutations = {}
	  var elRemoves = []
	  var elEvents = []

	  var length = updates.length
	  var i, item

	  perf.start('diff', this.id)

	  var testMutations = {}

	  // collect all mutations
	  // collect all updates
	  // collect all events
	  for (i = 0; i < length; i++) {
	    item = updates[i]
	    switch (item.method) {
	      case 'mutation':
	      var block = item.args[2]
	      var startRef = block.starter.ref
	      var endRef = block.ender.ref
	      elMutations[startRef] = block
	      block.changed = true
	      break

	      case 'update':
	      case 'updateAttrs':
	      case 'updateStyle':
	      case 'updateClass':
	      // elUpdates{ref}{attr{key}|style{key}|fullStyle}
	      self.handleElementUpdate(item, elUpdates)
	      break

	      case 'addEvent':
	      // elEvents[{method, args[]}]
	      self.handleElementEvent(item, elEvents)
	      break
	    }
	  }

	  // mutate all
	  var newRefSEl = []
	  this.patchMutations(elMutations, patch, newRefSEl)

	  // update all
	  this.patchUpdates(elUpdates, newRefSEl, patch)

	  // add all events
	  this.patchEvents(elEvents, patch)

	  perf.end('diff', this.id)

	  this.updates = []

	  if (patch.length > 0) {
	    perf.start('patch', this.id)
	    // callNative(this.id, JSON.stringify(patch))
	    this.callTasks(patch)
	    perf.end('patch', this.id)
	  }
	}


/***/ }
/******/ ]);