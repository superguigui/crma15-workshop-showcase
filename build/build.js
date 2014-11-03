(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/index.js":[function(require,module,exports){
'use strict';

/*
    Patchwork - a gulp, npm, vue.js, node-sass boilerplate.
    2014 - Florian Morel, Guillaume Gouessan
*/

/*
    App entry point.

    Creates the top-most viewmodel,
    registers the routes,
    registers all components,
    and start on page load.
 */

var Vue = require('vue'),
    router = require('./router'),
    TweenMax = require('TweenMax');

/*
    Plugins, lib config...
 */
require('./imports');

function init() {
    var app = new Vue({
        el: 'body',
        data: {
            currentPage: null, // Current page id, used by v-pw-view
            context: {} // reference to the router context
        },

        components: {
            /* LAYOUT */
            'footer': require('./views/layout/footer/footer'),
            'header': require('./views/layout/header/header'),

            /* COMPONENTs */
            'nameButton': require('./views/components/nameButton/nameButton'),

            /* PAGES */
            'home': require('./views/sections/home/home'),
            'project': require('./views/sections/project/project')

            /* COMMON */

        },

        directives: {
            'pw-view': require('./base/view.js')
        },

        ready: function() {
            router.on('router:update', this.onRouteUpdate.bind(this));

            router.addRoute(require('./views/sections/home/home').route);
            router.addRoute(require('./views/sections/project/project').route);
            router.setDefaultRoute('home');
        },

        methods: {
            onRouteUpdate: function(context) {
                this.context = context;
                this.currentPage = context.id;
                this.$root.$emit('$route.update', this.currentPage);
            }
        }
    });
}

window.onload = init;

},{"./base/view.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/view.js","./imports":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/imports.js","./router":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/router.js","./views/components/nameButton/nameButton":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/components/nameButton/nameButton.js","./views/layout/footer/footer":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/footer/footer.js","./views/layout/header/header":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.js","./views/sections/home/home":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.js","./views/sections/project/project":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/project/project.js","TweenMax":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/bindall-standalone/index.js":[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function(object) {
    if(!object) return console.warn('bindAll requires at least one argument.');

    var functions = Array.prototype.slice.call(arguments, 1);

    if (functions.length === 0) {

        for (var method in object) {
            if(hasOwnProperty.call(object, method)) {
                if(typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
                    functions.push(method);
                }
            }
        }
    }

    for(var i = 0; i < functions.length; i++) {
        var f = functions[i];
        object[f] = bind(object[f], object);
    }
};

/*
    Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
    bindAll is only needed for events binding so no need to make slow fixes for constructor
    or partial application.
*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/component-emitter/index.js":[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js":[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/foreach.js/dist/foreach.min.js":[function(require,module,exports){
(function (global){
;__browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*! foreach.js v1.1.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/foreach */
var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};
; browserify_shim__define__module__export__(typeof forEach != "undefined" ? forEach : window.forEach);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js":[function(require,module,exports){
(function (global){
;__browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*!
 * VERSION: 1.14.1
 * DATE: 2014-10-16
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},r=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=r.prototype.render},n=1e-10,a=i._internals,o=a.isSelector,h=a.isArray,l=r.prototype=i.to({},.1,{}),_=[];r.version="1.14.1",l.constructor=r,l.kill()._gc=!1,r.killTweensOf=r.killDelayedCallsTo=i.killTweensOf,r.getTweensOf=i.getTweensOf,r.lagSmoothing=i.lagSmoothing,r.ticker=i.ticker,r.render=i.render,l.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),i.prototype.invalidate.call(this)},l.updateTo=function(t,e){var s,r=this.ratio;e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(s in t)this.vars[s]=t[s];if(this._initted)if(e)this._initted=!1;else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var n=this._time;this.render(0,!0,!1),this._initted=!1,this.render(n,!0,!1)}else if(this._time>0){this._initted=!1,this._init();for(var a,o=1/(1-r),h=this._firstPT;h;)a=h.s+h.c,h.c*=o,h.s=a-h.c,h=h._next}return this},l.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var s,r,o,h,l,u,p,c,f=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,v=this._duration,y=this._rawPrevTime;if(t>=f?(this._totalTime=f,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=v,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(s=!0,r="onComplete"),0===v&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>y||y===n)&&y!==t&&(i=!0,y>n&&(r="onReverseComplete")),this._rawPrevTime=c=!e||t||y===t?t:n)):1e-7>t?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===v&&y>0&&y!==n)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===v&&(this._initted||!this.vars.lazy||i)&&(y>=0&&(i=!0),this._rawPrevTime=c=!e||t||y===t?t:n)),this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(h=v+this._repeatDelay,this._cycle=this._totalTime/h>>0,0!==this._cycle&&this._cycle===this._totalTime/h&&this._cycle--,this._time=this._totalTime-this._cycle*h,this._yoyo&&0!==(1&this._cycle)&&(this._time=v-this._time),this._time>v?this._time=v:0>this._time&&(this._time=0)),this._easeType?(l=this._time/v,u=this._easeType,p=this._easePower,(1===u||3===u&&l>=.5)&&(l=1-l),3===u&&(l*=2),1===p?l*=l:2===p?l*=l*l:3===p?l*=l*l*l:4===p&&(l*=l*l*l*l),this.ratio=1===u?1-l:2===u?l:.5>this._time/v?l/2:1-l/2):this.ratio=this._ease.getRatio(this._time/v)),m===this._time&&!i&&g===this._cycle)return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),void 0;if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=y,this._cycle=g,a.lazyTweens.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/v):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._totalTime||0===v)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_))),o=this._firstPT;o;)o.f?o.t[o.p](o.c*this.ratio+o.s):o.t[o.p]=o.c*this.ratio+o.s,o=o._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._totalTime!==d||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||_)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||_),0===v&&this._rawPrevTime===n&&c!==n&&(this._rawPrevTime=0))},r.to=function(t,e,i){return new r(t,e,i)},r.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new r(t,e,i)},r.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new r(t,e,s)},r.staggerTo=r.allTo=function(t,e,n,a,l,u,p){a=a||0;var c,f,m,d,g=n.delay||0,v=[],y=function(){n.onComplete&&n.onComplete.apply(n.onCompleteScope||this,arguments),l.apply(p||this,u||_)};for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t))),t=t||[],0>a&&(t=s(t),t.reverse(),a*=-1),c=t.length-1,m=0;c>=m;m++){f={};for(d in n)f[d]=n[d];f.delay=g,m===c&&l&&(f.onComplete=y),v[m]=new r(t[m],e,f),g+=a}return v},r.staggerFrom=r.allFrom=function(t,e,i,s,n,a,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,r.staggerTo(t,e,i,s,n,a,o)},r.staggerFromTo=r.allFromTo=function(t,e,i,s,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,r.staggerTo(t,e,s,n,a,o,h)},r.delayedCall=function(t,e,i,s,n){return new r(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:n,overwrite:0})},r.set=function(t,e){return new r(t,0,e)},r.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var u=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),s=s.concat(u(n,e)),r=s.length),n=n._next;return s},p=r.getAllTweens=function(e){return u(t._rootTimeline,e).concat(u(t._rootFramesTimeline,e))};r.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,h=p(0!=r),l=h.length,_=i&&s&&r;for(o=0;l>o;o++)a=h[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},r.killChildTweensOf=function(t,e){if(null!=t){var n,l,_,u,p,c=a.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s(t)),h(t))for(u=t.length;--u>-1;)r.killChildTweensOf(t[u],e);else{n=[];for(_ in c)for(l=c[_].target.parentNode;l;)l===t&&(n=n.concat(c[_].tweens)),l=l.parentNode;for(p=n.length,u=0;p>u;u++)e&&n[u].totalTime(n[u].totalDuration()),n[u]._enabled(!1,!1)}}};var c=function(t,i,s,r){i=i!==!1,s=s!==!1,r=r!==!1;for(var n,a,o=p(r),h=i&&s&&r,l=o.length;--l>-1;)a=o[l],(h||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return r.pauseAll=function(t,e,i){c(!0,t,e,i)},r.resumeAll=function(t,e,i){c(!1,t,e,i)},r.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||n,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},l.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},l.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},l.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},l.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},l.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},l.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},l.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},r},!0),_gsScope._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],o(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));o(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals,a=n.isSelector,o=n.isArray,h=n.lazyTweens,l=n.lazyRender,_=[],u=_gsScope._gsDefine.globals,p=function(t){var e,i={};for(e in t)i[e]=t[e];return i},c=function(t,e,i,s){var r=t._timeline._totalTime;(e||!this._forcingPlayhead)&&(t._timeline.pause(t._startTime),e&&e.apply(s||t._timeline,i||_),this._forcingPlayhead&&t._timeline.seek(r))},f=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},m=s.prototype=new e;return s.version="1.14.1",m.constructor=s,m.kill()._gc=m._forcingPlayhead=!1,m.to=function(t,e,s,r){var n=s.repeat&&u.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},m.from=function(t,e,s,r){return this.add((s.repeat&&u.TweenMax||i).from(t,e,s),r)},m.fromTo=function(t,e,s,r,n){var a=r.repeat&&u.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},m.staggerTo=function(t,e,r,n,o,h,l,_){var u,c=new s({onComplete:h,onCompleteParams:l,onCompleteScope:_,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),t=t||[],a(t)&&(t=f(t)),n=n||0,0>n&&(t=f(t),t.reverse(),n*=-1),u=0;t.length>u;u++)r.startAt&&(r.startAt=p(r.startAt)),c.to(t[u],e,p(r),u*n);return this.add(c,o)},m.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},m.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},m.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},m.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},m.add=function(r,n,a,h){var l,_,u,p,c,f;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&o(r)){for(a=a||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)o(p=r[u])&&(p=new s({tweens:p})),this.add(p,l),"string"!=typeof p&&"function"!=typeof p&&("sequence"===a?l=p._startTime+p.totalDuration()/p._timeScale:"start"===a&&(p._startTime-=p.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(c=this,f=c.rawTime()>r._startTime;c._timeline;)f&&c._timeline.smoothChildTiming?c.totalTime(c._totalTime,!0):c._gc&&c._enabled(!0,!1),c=c._timeline;return this},m.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&o(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},m._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},m.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},m.insert=m.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},m.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},m.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},m.addPause=function(t,e,i,s){return this.call(c,["{self}",e,i,s],this,t)},m.removeLabel=function(t){return delete this._labels[t],this},m.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},m._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&o(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},m.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},m.stop=function(){return this.paused(!0)},m.gotoAndPlay=function(t,e){return this.play(t,e)},m.gotoAndStop=function(t,e){return this.pause(t,e)},m.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,o,u,p=this._dirty?this.totalDuration():this._totalDuration,c=this._time,f=this._startTime,m=this._timeScale,d=this._paused;if(t>=p?(this._totalTime=this._time=p,this._reversed||this._hasPausedChild()||(n=!0,o="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(u=!0,this._rawPrevTime>r&&(o="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=p+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==c||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(o="onReverseComplete",n=this._reversed),0>t?(this._active=!1,this._rawPrevTime>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==c&&this._first||i||u){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_)),this._time>=c)for(s=this._first;s&&(a=s._next,!this._paused||d);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||d);)(s._active||c>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||(h.length&&l(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_))),o&&(this._gc||(f===this._startTime||m!==this._timeScale)&&(0===this._time||p>=this.totalDuration())&&(n&&(h.length&&l(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[o]&&this.vars[o].apply(this.vars[o+"Scope"]||this,this.vars[o+"Params"]||_)))}},m._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},m.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},m.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},m.recent=function(){return this._recent},m._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},m.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},m._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},m.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},m.invalidate=function(){for(var e=this._first;e;)e.invalidate(),e=e._next;return t.prototype.invalidate.call(this)},m._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},m.totalTime=function(){this._forcingPlayhead=!0;var e=t.prototype.totalTime.apply(this,arguments);return this._forcingPlayhead=!1,e},m.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},m.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},m.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},m.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0),_gsScope._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=e._internals,o=a.lazyTweens,h=a.lazyRender,l=new i(null,null,1,0),_=s.prototype=new t;return _.constructor=s,_.kill()._gc=!1,s.version="1.14.1",_.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},_.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},_.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},_.tweenTo=function(t,i){i=i||{};var s,r,a,o={ease:l,overwrite:i.delay?2:1,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)o[r]=i[r];return o.time=this._parseTimeOrLabel(t),s=Math.abs(Number(o.time)-this._time)/this._timeScale||.001,a=new e(this,s,o),o.onStart=function(){a.target.paused(!0),a.vars.time!==a.target.time()&&s===a.duration()&&a.duration(Math.abs(a.vars.time-a.target.time())/a.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||a,i.onStartParams||n)},a},_.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},_.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,l,_,u,p,c=this._dirty?this.totalDuration():this._totalDuration,f=this._duration,m=this._time,d=this._totalTime,g=this._startTime,v=this._timeScale,y=this._rawPrevTime,T=this._paused,w=this._cycle;if(t>=c?(this._locked||(this._totalTime=c,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,_="onComplete",0===this._duration&&(0===t||0>y||y===r)&&y!==t&&this._first&&(u=!0,y>r&&(_="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=f,t=f+1e-4)):1e-7>t?(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==m||0===f&&y!==r&&(y>0||0>t&&y>=0)&&!this._locked)&&(_="onReverseComplete",a=this._reversed),0>t?(this._active=!1,y>=0&&this._first&&(u=!0),this._rawPrevTime=t):(this._rawPrevTime=f||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(u=!0))):(0===f&&0>y&&(u=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(p=f+this._repeatDelay,this._cycle=this._totalTime/p>>0,0!==this._cycle&&this._cycle===this._totalTime/p&&this._cycle--,this._time=this._totalTime-this._cycle*p,this._yoyo&&0!==(1&this._cycle)&&(this._time=f-this._time),this._time>f?(this._time=f,t=f+1e-4):0>this._time?this._time=t=0:t=this._time))),this._cycle!==w&&!this._locked){var x=this._yoyo&&0!==(1&w),b=x===(this._yoyo&&0!==(1&this._cycle)),P=this._totalTime,S=this._cycle,k=this._rawPrevTime,R=this._time;if(this._totalTime=w*f,w>this._cycle?x=!x:this._totalTime+=f,this._time=m,this._rawPrevTime=0===f?y-1e-4:y,this._cycle=w,this._locked=!0,m=x?0:f,this.render(m,e,0===f),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),b&&(m=x?f+1e-4:-1e-4,this.render(m,!0,!1)),this._locked=!1,this._paused&&!T)return;this._time=R,this._totalTime=P,this._cycle=S,this._rawPrevTime=k}if(!(this._time!==m&&this._first||i||u))return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==d&&t>0&&(this._active=!0),0===d&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=m)for(s=this._first;s&&(l=s._next,!this._paused||T);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;else for(s=this._last;s&&(l=s._prev,!this._paused||T);)(s._active||m>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=l;this._onUpdate&&(e||(o.length&&h(),this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n))),_&&(this._locked||this._gc||(g===this._startTime||v!==this._timeScale)&&(0===this._time||c>=this.totalDuration())&&(a&&(o.length&&h(),this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[_]&&this.vars[_].apply(this.vars[_+"Scope"]||this,this.vars[_+"Params"]||n)))},_.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},_.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},_.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},_.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},_.progress=function(t,e){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),e):this._time/this.duration()},_.totalProgress=function(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._totalTime/this.totalDuration()},_.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},_.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},_.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},_.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},_.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},_.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),function(){var t=180/Math.PI,e=[],i=[],s=[],r={},n=function(t,e,i,s){this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},a=",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",o=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},h=(t+e)/2,l=(e+i)/2,_=(i+s)/2,u=(h+l)/2,p=(l+_)/2,c=(p-u)/8;return r.b=h+(t-h)/4,n.b=u+c,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-c,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},h=function(t,r,n,a,h){var l,_,u,p,c,f,m,d,g,v,y,T,w,x=t.length-1,b=0,P=t[0].a;for(l=0;x>l;l++)c=t[b],_=c.a,u=c.d,p=t[b+1].d,h?(y=e[l],T=i[l],w=.25*(T+y)*r/(a?.5:s[l]||.5),f=u-(u-_)*(a?.5*r:0!==y?w/y:0),m=u+(p-u)*(a?.5*r:0!==T?w/T:0),d=u-(f+((m-f)*(3*y/(y+T)+.5)/4||0))):(f=u-.5*(u-_)*r,m=u+.5*(p-u)*r,d=u-(f+m)/2),f+=d,m+=d,c.c=g=f,c.b=0!==l?P:P=c.a+.6*(c.c-c.a),c.da=u-_,c.ca=g-_,c.ba=P-_,n?(v=o(_,P,g,u),t.splice(b,1,v[0],v[1],v[2],v[3]),b+=4):b++,P=m;c=t[b],c.b=P,c.c=P+.4*(c.d-P),c.da=c.d-c.a,c.ca=c.c-c.a,c.ba=P-c.a,n&&(v=o(c.a,P,c.c,c.d),t.splice(b,1,v[0],v[1],v[2],v[3]))},l=function(t,s,r,a){var o,h,l,_,u,p,c=[];if(a)for(t=[a].concat(t),h=t.length;--h>-1;)"string"==typeof(p=t[h][s])&&"="===p.charAt(1)&&(t[h][s]=a[s]+Number(p.charAt(0)+p.substr(2)));if(o=t.length-2,0>o)return c[0]=new n(t[0][s],0,0,t[-1>o?0:1][s]),c;for(h=0;o>h;h++)l=t[h][s],_=t[h+1][s],c[h]=new n(l,0,0,_),r&&(u=t[h+2][s],e[h]=(e[h]||0)+(_-l)*(_-l),i[h]=(i[h]||0)+(u-_)*(u-_));return c[h]=new n(t[h][s],0,0,t[h+1][s]),c},_=function(t,n,o,_,u,p){var c,f,m,d,g,v,y,T,w={},x=[],b=p||t[0];u="string"==typeof u?","+u+",":a,null==n&&(n=1);for(f in t[0])x.push(f);if(t.length>1){for(T=t[t.length-1],y=!0,c=x.length;--c>-1;)if(f=x[c],Math.abs(b[f]-T[f])>.05){y=!1;break}y&&(t=t.concat(),p&&t.unshift(p),t.push(t[1]),p=t[t.length-3])}for(e.length=i.length=s.length=0,c=x.length;--c>-1;)f=x[c],r[f]=-1!==u.indexOf(","+f+","),w[f]=l(t,f,r[f],p);for(c=e.length;--c>-1;)e[c]=Math.sqrt(e[c]),i[c]=Math.sqrt(i[c]);if(!_){for(c=x.length;--c>-1;)if(r[f])for(m=w[x[c]],v=m.length-1,d=0;v>d;d++)g=m[d+1].da/i[d]+m[d].da/e[d],s[d]=(s[d]||0)+g*g;for(c=s.length;--c>-1;)s[c]=Math.sqrt(s[c])}for(c=x.length,d=o?4:1;--c>-1;)f=x[c],m=w[f],h(m,n,o,_,r[f]),y&&(m.splice(0,d),m.splice(m.length-d,d));return w},u=function(t,e,i){e=e||"soft";var s,r,a,o,h,l,_,u,p,c,f,m={},d="cubic"===e?3:2,g="soft"===e,v=[];if(g&&i&&(t=[i].concat(t)),null==t||d+1>t.length)throw"invalid Bezier data";for(p in t[0])v.push(p);for(l=v.length;--l>-1;){for(p=v[l],m[p]=h=[],c=0,u=t.length,_=0;u>_;_++)s=null==i?t[_][p]:"string"==typeof(f=t[_][p])&&"="===f.charAt(1)?i[p]+Number(f.charAt(0)+f.substr(2)):Number(f),g&&_>1&&u-1>_&&(h[c++]=(s+h[c-2])/2),h[c++]=s;for(u=c-d+1,c=0,_=0;u>_;_+=d)s=h[_],r=h[_+1],a=h[_+2],o=2===d?0:h[_+3],h[c++]=f=3===d?new n(s,r,a,o):new n(s,(2*r+s)/3,(2*r+a)/3,a);h.length=c}return m},p=function(t,e,i){for(var s,r,n,a,o,h,l,_,u,p,c,f=1/i,m=t.length;--m>-1;)for(p=t[m],n=p.a,a=p.d-n,o=p.c-n,h=p.b-n,s=r=0,_=1;i>=_;_++)l=f*_,u=1-l,s=r-(r=(l*l*a+3*u*(l*o+u*h))*l),c=m*i+_-1,e[c]=(e[c]||0)+s*s},c=function(t,e){e=e>>0||6;var i,s,r,n,a=[],o=[],h=0,l=0,_=e-1,u=[],c=[];for(i in t)p(t[i],a,e);for(r=a.length,s=0;r>s;s++)h+=Math.sqrt(a[s]),n=s%e,c[n]=h,n===_&&(l+=h,n=s/e>>0,u[n]=c,o[n]=l,h=0,c=[]);return{length:l,lengths:o,segments:u}},f=_gsScope._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.3",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._round={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,a,o,h=e.values||[],l={},p=h[0],f=e.autoRotate||i.vars.orientToBezier;this._autoRotate=f?f instanceof Array?f:[["x","y","rotation",f===!0?0:Number(f)||0]]:null;for(s in p)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],l[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),o||l[s]!==h[0][s]&&(o=l);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):u(h,e.type,l),this._segCount=this._beziers[s].length,this._timeRes){var m=c(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(f=this._autoRotate)for(this._initialRotations=[],f[0]instanceof Array||(this._autoRotate=f=[f]),n=f.length;--n>-1;){for(a=0;3>a;a++)s=f[n][a],this._func[s]="function"==typeof t[s]?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]:!1;s=f[n][2],this._initialRotations[n]=this._func[s]?this._func[s].call(this._target):this._target[s]}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,h,l,_,u,p=this._segCount,c=this._func,f=this._target,m=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,e*=this._length,r=this._li,e>this._l2&&p-1>r){for(l=p-1;l>r&&e>=(this._l2=_[++r]););this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(this._l1>e&&r>0){for(;r>0&&(this._l1=_[--r])>=e;);0===r&&this._l1>e?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,e-=this._l1,r=this._si,e>this._s2&&u.length-1>r){for(l=u.length-1;l>r&&e>=(this._s2=u[++r]););this._s1=u[r-1],this._si=r}else if(this._s1>e&&r>0){for(;r>0&&(this._s1=u[--r])>=e;);0===r&&this._s1>e?this._s1=0:r++,this._s2=u[r],this._si=r
}o=(r+(e-this._s1)/(this._s2-this._s1))*this._prec}else i=0>e?0:e>=1?p-1:p*e>>0,o=(e-i*(1/p))*p;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],a=this._beziers[n][i],h=(o*o*a.da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._round[n]&&(h=Math.round(h)),c[n]?f[n](h):f[n]=h;if(this._autoRotate){var d,g,v,y,T,w,x,b=this._autoRotate;for(r=b.length;--r>-1;)n=b[r][2],w=b[r][3]||0,x=b[r][4]===!0?1:t,a=this._beziers[b[r][0]],d=this._beziers[b[r][1]],a&&d&&(a=a[i],d=d[i],g=a.a+(a.b-a.a)*o,y=a.b+(a.c-a.b)*o,g+=(y-g)*o,y+=(a.c+(a.d-a.c)*o-y)*o,v=d.a+(d.b-d.a)*o,T=d.b+(d.c-d.b)*o,v+=(T-v)*o,T+=(d.c+(d.d-d.c)*o-T)*o,h=m?Math.atan2(T-v,y-g)*x+w:this._initialRotations[r],c[n]?f[n](h):f[n]=h)}}}),m=f.prototype;f.bezierThrough=_,f.cubicToQuadratic=o,f._autoCSS=!0,f.quadraticToCubic=function(t,e,i){return new n(t,(2*e+t)/3,(2*e+i)/3,i)},f._cssRegister=function(){var t=_gsScope._gsDefine.globals.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,h){e instanceof Array&&(e={values:e}),h=new f;var l,_,u,p=e.values,c=p.length-1,m=[],d={};if(0>c)return o;for(l=0;c>=l;l++)u=i(t,p[l],a,o,h,c!==l),m[l]=u.end;for(_ in e)d[_]=e[_];return d.values=m,o=new r(t,"bezier",0,0,u.pt,2),o.data=u,o.plugin=h,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(l=d.autoRotate===!0?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",l,!1]]:null!=u.end.x?[["x","y","rotation",l,!1]]:!1),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform),h._onInitTween(u.proxy,d,a._tween),o}})}},m._roundProps=function(t,e){for(var i=this._overwriteProps,s=i.length;--s>-1;)(t[i[s]]||t.bezier||t.bezierThrough)&&(this._round[i[s]]=e)},m._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);return this._super._kill.call(this,t)}}(),_gsScope._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o={},h=a.prototype=new t("css");h.constructor=a,a.version="1.14.1",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",h="px",a.suffixMap={top:h,right:h,bottom:h,left:h,width:h,height:h,fontSize:h,padding:h,margin:h,perspective:h,lineHeight:""};var l,_,u,p,c,f,m=/(?:\d|\-\d|\.\d|\-\.\d)+/g,d=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,g=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/[^\d\-\.]/g,y=/(?:\d|\-|\+|=|#|\.)*/g,T=/opacity *= *([^)]*)/i,w=/opacity:([^;]*)/i,x=/alpha\(opacity *=.+?\)/i,b=/^(rgb|hsl)/,P=/([A-Z])/g,S=/-([a-z])/gi,k=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,R=function(t,e){return e.toUpperCase()},A=/(?:Left|Right|Width)/i,O=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,C=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,D=/,(?=[^\)]*(?:\(|$))/gi,M=Math.PI/180,z=180/Math.PI,I={},E=document,F=(E.documentElement,E.createElement("div")),L=E.createElement("img"),N=a._internals={_specialProps:o},X=navigator.userAgent,U=function(){var t,e=X.indexOf("Android"),i=E.createElement("div");return u=-1!==X.indexOf("Safari")&&-1===X.indexOf("Chrome")&&(-1===e||Number(X.substr(e+8,1))>3),c=u&&6>Number(X.substr(X.indexOf("Version/")+8,1)),p=-1!==X.indexOf("Firefox"),(/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(X)||/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(X))&&(f=parseFloat(RegExp.$1)),i.innerHTML="<a style='top:1px;opacity:.55;'>a</a>",t=i.getElementsByTagName("a")[0],t?/^0.55/.test(t.style.opacity):!1}(),Y=function(t){return T.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},j=function(t){window.console&&console.log(t)},B="",q="",V=function(t,e){e=e||F;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(q=3===s?"ms":i[s],B="-"+q.toLowerCase()+"-",q+t):null},G=E.defaultView?E.defaultView.getComputedStyle:function(){},W=a.getStyle=function(t,e,i,s,r){var n;return U||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||G(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(P,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):Y(t)},Q=N.convertToPixels=function(t,i,s,r,n){if("px"===r||!r)return s;if("auto"===r||!s)return 0;var o,h,l,_=A.test(i),u=t,p=F.style,c=0>s;if(c&&(s=-s),"%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+W(t,"position")+";line-height:0;","%"!==r&&u.appendChild)p[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||E.body,h=u._gsCache,l=e.ticker.frame,h&&_&&h.time===l)return h.width*s/100;p[_?"width":"height"]=s+r}u.appendChild(F),o=parseFloat(F[_?"offsetWidth":"offsetHeight"]),u.removeChild(F),_&&"%"===r&&a.cacheWidths!==!1&&(h=u._gsCache=u._gsCache||{},h.time=l,h.width=100*(o/s)),0!==o||n||(o=Q(t,i,s,r,!0))}return c?-o:o},Z=N.calculateOffset=function(t,e,i){if("absolute"!==W(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=W(t,"margin"+s,i);return t["offset"+s]-(Q(t,e,parseFloat(r),r.replace(y,""))||0)},$=function(t,e){var i,s,r={};if(e=e||G(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(S,R)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===r[i]&&(r[i.replace(S,R)]=e[i]);return U||(r.opacity=Y(t)),s=Re(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,xe&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},H=function(t,e,i,s,r){var n,a,o,h={},l=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(h[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(v,"")?n:0:Z(t,a),void 0!==l[a]&&(o=new ue(l,a,l[a],o)));if(s)for(a in s)"className"!==a&&(h[a]=s[a]);return{difs:h,firstMPT:o}},K={width:["Left","Right"],height:["Top","Bottom"]},J=["marginLeft","marginRight","marginTop","marginBottom"],te=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=K[e],n=r.length;for(i=i||G(t,null);--n>-1;)s-=parseFloat(W(t,"padding"+r[n],i,!0))||0,s-=parseFloat(W(t,"border"+r[n]+"Width",i,!0))||0;return s},ee=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(v,"")),e.oy=parseFloat(r.replace(v,""))),s+" "+r+(i.length>2?" "+i[2]:"")},ie=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},se=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2))+e:parseFloat(t)},re=function(t,e,i,s){var r,n,a,o,h=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(v,""))*(-1===t.indexOf("rad")?1:z)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),h>o&&o>-h&&(o=0),o},ne={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ae=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},oe=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ne[t]?ne[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(m),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=ae(r+1/3,e,i),t[1]=ae(r,e,i),t[2]=ae(r-1/3,e,i),t):(t=t.match(m)||ne.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):ne.black},he="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(h in ne)he+="|"+h+"\\b";he=RegExp(he+")","gi");var le=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(he)||[""])[0]:"",a=t.split(n).join("").match(g)||[],o=t.substr(0,t.indexOf(a[0])),h=")"===t.charAt(t.length-1)?")":"",l=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(m,""):"";return _?r=e?function(t){var e,p,c,f;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(f=t.replace(D,"|").split("|"),c=0;f.length>c;c++)f[c]=r(f[c]);return f.join(",")}if(e=(t.match(he)||[n])[0],p=t.split(e).join("").match(g)||[],c=p.length,_>c--)for(;_>++c;)p[c]=i?p[0|(c-1)/2]:a[c];return o+p.join(l)+l+e+h+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(n=t.replace(D,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(g)||[],p=e.length,_>p--)for(;_>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(l)+h}:function(t){return t}},_e=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var h,l=(i+"").split(" ");for(o={},h=0;4>h;h++)o[t[h]]=l[h]=l[h]||l[(h-1)/2>>0];return r.parse(e,o,n,a)}},ue=(N._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,h=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):h>e&&e>-h&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),pe=(N._parseToProxy=function(t,e,i,s,r,n){var a,o,h,l,_,u=s,p={},c={},f=i._transform,m=I;for(i._transform=null,I=e,s=_=i.parse(t,e,s,r),I=m,n&&(i._transform=f,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(1>=s.type&&(o=s.p,c[o]=s.s+s.c,p[o]=s.s,n||(l=new ue(s,"s",o,l,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)h="xn"+a,o=s.p+"_"+h,c[o]=s.data[h],p[o]=s[h],n||(l=new ue(s,h,o,l,s.rxp[h]));s=s._next}return{proxy:p,end:c,firstMPT:l,pt:_}},N.CSSPropTween=function(t,e,s,r,a,o,h,l,_,u,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=h||e,t instanceof pe||n.push(this.n),this.r=l,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),ce=a.parseComplex=function(t,e,i,s,r,n,a,o,h,_){i=i||n||"",a=new pe(t,e,0,0,a,_?2:1,null,!1,o,i,s),s+="";var u,p,c,f,g,v,y,T,w,x,P,S,k=i.split(", ").join(",").split(" "),R=s.split(", ").join(",").split(" "),A=k.length,O=l!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(k=k.join(" ").replace(D,", ").split(" "),R=R.join(" ").replace(D,", ").split(" "),A=k.length),A!==R.length&&(k=(n||"").split(" "),A=k.length),a.plugin=h,a.setRatio=_,u=0;A>u;u++)if(f=k[u],g=R[u],T=parseFloat(f),T||0===T)a.appendXtra("",T,ie(g,T),g.replace(d,""),O&&-1!==g.indexOf("px"),!0);else if(r&&("#"===f.charAt(0)||ne[f]||b.test(f)))S=","===g.charAt(g.length-1)?"),":")",f=oe(f),g=oe(g),w=f.length+g.length>6,w&&!U&&0===g[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(R[u]).join("transparent")):(U||(w=!1),a.appendXtra(w?"rgba(":"rgb(",f[0],g[0]-f[0],",",!0,!0).appendXtra("",f[1],g[1]-f[1],",",!0).appendXtra("",f[2],g[2]-f[2],w?",":S,!0),w&&(f=4>f.length?1:f[3],a.appendXtra("",f,(4>g.length?1:g[3])-f,S,!1)));else if(v=f.match(m)){if(y=g.match(d),!y||y.length!==v.length)return a;for(c=0,p=0;v.length>p;p++)P=v[p],x=f.indexOf(P,c),a.appendXtra(f.substr(c,x-c),Number(P),ie(y[p],P),"",O&&"px"===f.substr(x+P.length,2),0===p),c=x+P.length;a["xs"+a.l]+=f.substr(c)}else a["xs"+a.l]+=a.l?" "+f:f;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,u=1;a.l>u;u++)S+=a["xs"+u]+a.data["xn"+u];a.e=S+a["xs"+u]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},fe=9;for(h=pe.prototype,h.l=h.pr=0;--fe>0;)h["xn"+fe]=0,h["xs"+fe]="";h.xs0="",h._next=h._prev=h.xfirst=h.data=h.plugin=h.setRatio=h.rxp=null,h.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new pe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var me=function(t,e){e=e||{},this.p=e.prefix?V(t)||t:t,o[t]=o[this.p]=this,this.format=e.formatter||le(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},de=N._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new me(n[s],e)},ge=function(t){if(!o[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";de(t,{parser:function(t,i,s,r,n,a,h){var l=(_gsScope.GreenSockGlobals||_gsScope).com.greensock.plugins[e];return l?(l._cssRegister(),o[s].parse(t,i,s,r,n,a,h)):(j("Error: "+e+" js file not loaded."),n)}})}};h=me.prototype,h.parseComplex=function(t,e,i,s,r,n){var a,o,h,l,_,u,p=this.keyword;if(this.multi&&(D.test(i)||D.test(e)?(o=e.replace(D,"|").split("|"),h=i.replace(D,"|").split("|")):p&&(o=[e],h=[i])),h){for(l=h.length>o.length?h.length:o.length,a=0;l>a;a++)e=o[a]=o[a]||this.dflt,i=h[a]=h[a]||this.dflt,p&&(_=e.indexOf(p),u=i.indexOf(p),_!==u&&(i=-1===u?h:o,i[a]+=" "+p));e=o.join(", "),i=h.join(", ")}return ce(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},h.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(W(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){de(t,{parser:function(t,s,r,n,a,o){var h=new pe(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})};var ve="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),ye=V("transform"),Te=B+"transform",we=V("transformOrigin"),xe=null!==V("perspective"),be=N.Transform=function(){this.skewY=0},Pe=window.SVGElement,Se=Pe&&(f||/Android/i.test(X)&&!window.chrome),ke=function(t,e,i){var s=t.getBBox();e=ee(e).split(" "),i.xOrigin=(-1!==e[0].indexOf("%")?parseFloat(e[0])/100*s.width:parseFloat(e[0]))+s.x,i.yOrigin=(-1!==e[1].indexOf("%")?parseFloat(e[1])/100*s.height:parseFloat(e[1]))+s.y},Re=N.getTransform=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var n,o,h,l,_,u,p,c,f,m,d,g,v,y=i?t._gsTransform||new be:new be,T=0>y.scaleX,w=2e-5,x=1e5,b=179.99,P=b*M,S=xe?parseFloat(W(t,we,e,!1,"0 0 0").split(" ")[2])||y.zOrigin||0:0,k=parseFloat(a.defaultTransformPerspective)||0;if(ye?n=W(t,Te,e,!0):t.currentStyle&&(n=t.currentStyle.filter.match(O),n=n&&4===n.length?[n[0].substr(4),Number(n[2].substr(4)),Number(n[1].substr(4)),n[3].substr(4),y.x||0,y.y||0].join(","):""),n&&"none"!==n&&"matrix(1, 0, 0, 1, 0, 0)"!==n){for(o=(n||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],h=o.length;--h>-1;)l=Number(o[h]),o[h]=(_=l-(l|=0))?(0|_*x+(0>_?-.5:.5))/x+l:l;if(16===o.length){var R=o[8],A=o[9],C=o[10],D=o[12],I=o[13],E=o[14];if(y.zOrigin&&(E=-y.zOrigin,D=R*E-o[12],I=A*E-o[13],E=C*E+y.zOrigin-o[14]),!i||s||null==y.rotationX){var F,L,N,X,U,Y,j,B=o[0],q=o[1],V=o[2],G=o[3],Q=o[4],Z=o[5],$=o[6],H=o[7],K=o[11],J=Math.atan2($,C),te=-P>J||J>P;y.rotationX=J*z,J&&(X=Math.cos(-J),U=Math.sin(-J),F=Q*X+R*U,L=Z*X+A*U,N=$*X+C*U,R=Q*-U+R*X,A=Z*-U+A*X,C=$*-U+C*X,K=H*-U+K*X,Q=F,Z=L,$=N),J=Math.atan2(R,B),y.rotationY=J*z,J&&(Y=-P>J||J>P,X=Math.cos(-J),U=Math.sin(-J),F=B*X-R*U,L=q*X-A*U,N=V*X-C*U,A=q*U+A*X,C=V*U+C*X,K=G*U+K*X,B=F,q=L,V=N),J=Math.atan2(q,Z),y.rotation=J*z,J&&(j=-P>J||J>P,X=Math.cos(-J),U=Math.sin(-J),B=B*X+Q*U,L=q*X+Z*U,Z=q*-U+Z*X,$=V*-U+$*X,q=L),j&&te?y.rotation=y.rotationX=0:j&&Y?y.rotation=y.rotationY=0:Y&&te&&(y.rotationY=y.rotationX=0),y.scaleX=(0|Math.sqrt(B*B+q*q)*x+.5)/x,y.scaleY=(0|Math.sqrt(Z*Z+A*A)*x+.5)/x,y.scaleZ=(0|Math.sqrt($*$+C*C)*x+.5)/x,y.skewX=0,y.perspective=K?1/(0>K?-K:K):0,y.x=D,y.y=I,y.z=E}}else if(!(xe&&!s&&o.length&&y.x===o[4]&&y.y===o[5]&&(y.rotationX||y.rotationY)||void 0!==y.x&&"none"===W(t,"display",e))){var ee=o.length>=6,ie=ee?o[0]:1,se=o[1]||0,re=o[2]||0,ne=ee?o[3]:1;y.x=o[4]||0,y.y=o[5]||0,u=Math.sqrt(ie*ie+se*se),p=Math.sqrt(ne*ne+re*re),c=ie||se?Math.atan2(se,ie)*z:y.rotation||0,f=re||ne?Math.atan2(re,ne)*z+c:y.skewX||0,m=u-Math.abs(y.scaleX||0),d=p-Math.abs(y.scaleY||0),Math.abs(f)>90&&270>Math.abs(f)&&(T?(u*=-1,f+=0>=c?180:-180,c+=0>=c?180:-180):(p*=-1,f+=0>=f?180:-180)),g=(c-y.rotation)%180,v=(f-y.skewX)%180,(void 0===y.skewX||m>w||-w>m||d>w||-w>d||g>-b&&b>g&&false|g*x||v>-b&&b>v&&false|v*x)&&(y.scaleX=u,y.scaleY=p,y.rotation=c,y.skewX=f),xe&&(y.rotationX=y.rotationY=y.z=0,y.perspective=k,y.scaleZ=1)}y.zOrigin=S;for(h in y)w>y[h]&&y[h]>-w&&(y[h]=0)}else y={x:0,y:0,z:0,scaleX:1,scaleY:1,scaleZ:1,skewX:0,skewY:0,perspective:k,rotation:0,rotationX:0,rotationY:0,zOrigin:0};return i&&(t._gsTransform=y),y.svg=Pe&&t instanceof Pe,y.svg&&ke(t,W(t,we,r,!1,"50% 50%")+"",y),y.xPercent=y.yPercent=0,y},Ae=function(t){var e,i,s=this.data,r=-s.rotation*M,n=r+s.skewX*M,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,h=(0|Math.sin(r)*s.scaleX*a)/a,l=(0|Math.sin(n)*-s.scaleY*a)/a,_=(0|Math.cos(n)*s.scaleY*a)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=h,h=-l,l=-i,e=p.filter,u.filter="";var c,m,d=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,w="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+h+", M21="+l+", M22="+_,x=s.x+d*s.xPercent/100,b=s.y+g*s.yPercent/100;if(null!=s.ox&&(c=(s.oxp?.01*d*s.ox:s.ox)-d/2,m=(s.oyp?.01*g*s.oy:s.oy)-g/2,x+=c-(c*o+m*h),b+=m-(c*l+m*_)),v?(c=d/2,m=g/2,w+=", Dx="+(c-(c*o+m*h)+x)+", Dy="+(m-(c*l+m*_)+b)+")"):w+=", sizingMethod='auto expand')",u.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(C,w):w+" "+e,(0===t||1===t)&&1===o&&0===h&&0===l&&1===_&&(v&&-1===w.indexOf("Dx=0, Dy=0")||T.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&u.removeAttribute("filter")),!v){var P,S,k,R=8>f?1:-1;for(c=s.ieOffsetX||0,m=s.ieOffsetY||0,s.ieOffsetX=Math.round((d-((0>o?-o:o)*d+(0>h?-h:h)*g))/2+x),s.ieOffsetY=Math.round((g-((0>_?-_:_)*g+(0>l?-l:l)*d))/2+b),fe=0;4>fe;fe++)S=J[fe],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):Q(this.t,S,parseFloat(P),P.replace(y,""))||0,k=i!==s[S]?2>fe?-s.ieOffsetX:-s.ieOffsetY:2>fe?c-s.ieOffsetX:m-s.ieOffsetY,u[S]=(s[S]=Math.round(i-k*(0===fe||2===fe?1:R)))+"px"}}},Oe=N.set3DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,c,f,m,d,g,v,y,T,w,x,b,P,S=this.data,k=this.t.style,R=S.rotation*M,A=S.scaleX,O=S.scaleY,C=S.scaleZ,D=S.x,z=S.y,I=S.z,E=S.perspective;if(!(1!==t&&0!==t||"auto"!==S.force3D||S.rotationY||S.rotationX||1!==C||E||I))return Ce.call(this,t),void 0;if(p){var F=1e-4;F>A&&A>-F&&(A=C=2e-5),F>O&&O>-F&&(O=C=2e-5),!E||S.z||S.rotationX||S.rotationY||(E=0)}if(R||S.skewX)y=Math.cos(R),T=Math.sin(R),e=y,n=T,S.skewX&&(R-=S.skewX*M,y=Math.cos(R),T=Math.sin(R),"simple"===S.skewType&&(w=Math.tan(S.skewX*M),w=Math.sqrt(1+w*w),y*=w,T*=w)),i=-T,a=y;else{if(!(S.rotationY||S.rotationX||1!==C||E||S.svg))return k[ye]=(S.xPercent||S.yPercent?"translate("+S.xPercent+"%,"+S.yPercent+"%) translate3d(":"translate3d(")+D+"px,"+z+"px,"+I+"px)"+(1!==A||1!==O?" scale("+A+","+O+")":""),void 0;e=a=1,i=n=0}u=1,s=r=o=h=l=_=c=f=m=0,d=E?-1/E:0,g=S.zOrigin,v=1e5,R=S.rotationY*M,R&&(y=Math.cos(R),T=Math.sin(R),l=u*-T,f=d*-T,s=e*T,o=n*T,u*=y,d*=y,e*=y,n*=y),R=S.rotationX*M,R&&(y=Math.cos(R),T=Math.sin(R),w=i*y+s*T,x=a*y+o*T,b=_*y+u*T,P=m*y+d*T,s=i*-T+s*y,o=a*-T+o*y,u=_*-T+u*y,d=m*-T+d*y,i=w,a=x,_=b,m=P),1!==C&&(s*=C,o*=C,u*=C,d*=C),1!==O&&(i*=O,a*=O,_*=O,m*=O),1!==A&&(e*=A,n*=A,l*=A,f*=A),g&&(c-=g,r=s*c,h=o*c,c=u*c+g),S.svg&&(r+=S.xOrigin-(S.xOrigin*e+S.yOrigin*i),h+=S.yOrigin-(S.xOrigin*n+S.yOrigin*a)),r=(w=(r+=D)-(r|=0))?(0|w*v+(0>w?-.5:.5))/v+r:r,h=(w=(h+=z)-(h|=0))?(0|w*v+(0>w?-.5:.5))/v+h:h,c=(w=(c+=I)-(c|=0))?(0|w*v+(0>w?-.5:.5))/v+c:c,k[ye]=(S.xPercent||S.yPercent?"translate("+S.xPercent+"%,"+S.yPercent+"%) matrix3d(":"matrix3d(")+[(0|e*v)/v,(0|n*v)/v,(0|l*v)/v,(0|f*v)/v,(0|i*v)/v,(0|a*v)/v,(0|_*v)/v,(0|m*v)/v,(0|s*v)/v,(0|o*v)/v,(0|u*v)/v,(0|d*v)/v,r,h,c,E?1+-c/E:1].join(",")+")"},Ce=N.set2DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,p=this.data,c=this.t,f=c.style,m=p.x,d=p.y;return!(p.rotationX||p.rotationY||p.z||p.force3D===!0||"auto"===p.force3D&&1!==t&&0!==t)||p.svg&&Se||!xe?(r=p.scaleX,n=p.scaleY,p.rotation||p.skewX||p.svg?(e=p.rotation*M,i=e-p.skewX*M,s=1e5,a=Math.cos(e)*r,o=Math.sin(e)*r,h=Math.sin(i)*-n,l=Math.cos(i)*n,p.svg&&(m+=p.xOrigin-(p.xOrigin*a+p.yOrigin*h),d+=p.yOrigin-(p.xOrigin*o+p.yOrigin*l),u=1e-6,u>m&&m>-u&&(m=0),u>d&&d>-u&&(d=0)),_=(0|a*s)/s+","+(0|o*s)/s+","+(0|h*s)/s+","+(0|l*s)/s+","+m+","+d+")",p.svg&&Se?c.setAttribute("transform","matrix("+_):f[ye]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+_):f[ye]=(p.xPercent||p.yPercent?"translate("+p.xPercent+"%,"+p.yPercent+"%) matrix(":"matrix(")+r+",0,0,"+n+","+m+","+d+")",void 0):(this.setRatio=Oe,Oe.call(this,t),void 0)};de("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent",{parser:function(t,e,i,s,n,o,h){if(s._transform)return n;var l,_,u,p,c,f,m,d=s._transform=Re(t,r,!0,h.parseTransform),g=t.style,v=1e-6,y=ve.length,T=h,w={};if("string"==typeof T.transform&&ye)u=F.style,u[ye]=T.transform,u.display="block",u.position="absolute",E.body.appendChild(F),l=Re(F,null,!1),E.body.removeChild(F);else if("object"==typeof T){if(l={scaleX:se(null!=T.scaleX?T.scaleX:T.scale,d.scaleX),scaleY:se(null!=T.scaleY?T.scaleY:T.scale,d.scaleY),scaleZ:se(T.scaleZ,d.scaleZ),x:se(T.x,d.x),y:se(T.y,d.y),z:se(T.z,d.z),xPercent:se(T.xPercent,d.xPercent),yPercent:se(T.yPercent,d.yPercent),perspective:se(T.transformPerspective,d.perspective)},m=T.directionalRotation,null!=m)if("object"==typeof m)for(u in m)T[u]=m[u];else T.rotation=m;"string"==typeof T.x&&-1!==T.x.indexOf("%")&&(l.x=0,l.xPercent=se(T.x,d.xPercent)),"string"==typeof T.y&&-1!==T.y.indexOf("%")&&(l.y=0,l.yPercent=se(T.y,d.yPercent)),l.rotation=re("rotation"in T?T.rotation:"shortRotation"in T?T.shortRotation+"_short":"rotationZ"in T?T.rotationZ:d.rotation,d.rotation,"rotation",w),xe&&(l.rotationX=re("rotationX"in T?T.rotationX:"shortRotationX"in T?T.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",w),l.rotationY=re("rotationY"in T?T.rotationY:"shortRotationY"in T?T.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",w)),l.skewX=null==T.skewX?d.skewX:re(T.skewX,d.skewX),l.skewY=null==T.skewY?d.skewY:re(T.skewY,d.skewY),(_=l.skewY-d.skewY)&&(l.skewX+=_,l.rotation+=_)}for(xe&&null!=T.force3D&&(d.force3D=T.force3D,f=!0),d.skewType=T.skewType||d.skewType||a.defaultSkewType,c=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,c||null==T.scale||(l.scaleZ=1);--y>-1;)i=ve[y],p=l[i]-d[i],(p>v||-v>p||null!=T[i]||null!=I[i])&&(f=!0,n=new pe(d,i,d[i],p,n),i in w&&(n.e=w[i]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return p=T.transformOrigin,p&&d.svg?(ke(t,p,l),n=new pe(d,"xOrigin",d.xOrigin,l.xOrigin-d.xOrigin,n,-1,"transformOrigin"),n.b=d.xOrigin,n.e=n.xs0=l.xOrigin,n=new pe(d,"yOrigin",d.yOrigin,l.yOrigin-d.yOrigin,n,-1,"transformOrigin"),n.b=d.yOrigin,n.e=n.xs0=l.yOrigin,Me(g,we)):(p||xe&&c&&d.zOrigin)&&(ye?(f=!0,i=we,p=(p||W(t,i,r,!1,"50% 50%"))+"",n=new pe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,xe?(u=d.zOrigin,p=p.split(" "),d.zOrigin=(p.length>2&&(0===u||"0px"!==p[2])?parseFloat(p[2]):u)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new pe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=p):ee(p+"",d)),f&&(s._transformType=d.svg&&Se||!c&&3!==this._transformType?2:3),n},prefix:!0}),de("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),de("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,h,l,_,u,p,c,f,m,d,g,v,y,T,w,x,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(m=parseFloat(t.offsetWidth),d=parseFloat(t.offsetHeight),o=e.split(" "),h=0;b.length>h;h++)this.p.indexOf("border")&&(b[h]=V(b[h])),u=_=W(t,b[h],r,!1,"0px"),-1!==u.indexOf(" ")&&(_=u.split(" "),u=_[0],_=_[1]),p=l=o[h],c=parseFloat(u),v=u.substr((c+"").length),y="="===p.charAt(1),y?(f=parseInt(p.charAt(0)+"1",10),p=p.substr(2),f*=parseFloat(p),g=p.substr((f+"").length-(0>f?1:0))||""):(f=parseFloat(p),g=p.substr((f+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=Q(t,"borderLeft",c,v),w=Q(t,"borderTop",c,v),"%"===g?(u=100*(T/m)+"%",_=100*(w/d)+"%"):"em"===g?(x=Q(t,"borderLeft",1,"em"),u=T/x+"em",_=w/x+"em"):(u=T+"px",_=w+"px"),y&&(p=parseFloat(u)+f+g,l=parseFloat(_)+f+g)),a=ce(P,b[h],u+" "+_,p+" "+l,!1,"0px",a);return a},prefix:!0,formatter:le("0px 0px 0px 0px",!1,!0)}),de("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,h,l,_,u,p,c="background-position",m=r||G(t,null),d=this.format((m?f?m.getPropertyValue(c+"-x")+" "+m.getPropertyValue(c+"-y"):m.getPropertyValue(c):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=W(t,"backgroundImage").replace(k,""),p&&"none"!==p)){for(o=d.split(" "),h=g.split(" "),L.setAttribute("src",p),l=2;--l>-1;)d=o[l],_=-1!==d.indexOf("%"),_!==(-1!==h[l].indexOf("%"))&&(u=0===l?t.offsetWidth-L.width:t.offsetHeight-L.height,o[l]=_?parseFloat(d)/100*u+"px":100*(parseFloat(d)/u)+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:ee}),de("backgroundSize",{defaultValue:"0 0",formatter:ee}),de("perspective",{defaultValue:"0px",prefix:!0}),de("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),de("transformStyle",{prefix:!0}),de("backfaceVisibility",{prefix:!0}),de("userSelect",{prefix:!0}),de("margin",{parser:_e("marginTop,marginRight,marginBottom,marginLeft")}),de("padding",{parser:_e("paddingTop,paddingRight,paddingBottom,paddingLeft")}),de("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,h,l;return 9>f?(h=t.currentStyle,l=8>f?" ":",",o="rect("+h.clipTop+l+h.clipRight+l+h.clipBottom+l+h.clipLeft+")",e=this.format(e).split(",").join(l)):(o=this.format(W(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),de("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),de("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),de("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(W(t,"borderTopWidth",r,!1,"0px")+" "+W(t,"borderTopStyle",r,!1,"solid")+" "+W(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(he)||["#000"])[0]}}),de("borderWidth",{parser:_e("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),de("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new pe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var De=function(t){var e,i=this.t,s=i.filter||W(this.data,"filter")||"",r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!W(this.data,"filter")):(i.filter=s.replace(x,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(T,"opacity="+r))};de("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(W(t,"opacity",r,!1,"1")),h=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),l&&1===o&&"hidden"===W(t,"visibility",r)&&0!==e&&(o=0),U?n=new pe(h,"opacity",o,e-o,n):(n=new pe(h,"opacity",100*o,100*(e-o),n),n.xn1=l?1:0,h.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=De),l&&(n=new pe(h,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Me=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(P,"-$1").toLowerCase())):t.removeAttribute(e))},ze=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Me(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};de("className",{parser:function(t,e,s,n,a,o,h){var l,_,u,p,c,f=t.getAttribute("class")||"",m=t.style.cssText;if(a=n._classNamePT=new pe(t,s,0,0,a,2),a.setRatio=ze,a.pr=-11,i=!0,a.b=f,_=$(t,r),u=t._gsClassPT){for(p={},c=u.data;c;)p[c.p]=1,c=c._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:f.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),l=H(t,_,$(t),h,p),t.setAttribute("class",f),a.data=l.firstMPT,t.style.cssText=m,a=a.xfirst=n.parse(t,l.difs,a,o)),a}});var Ie=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=o.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(" ").join("").split(","),s=e.length;--s>-1;)i=e[s],o[i]&&(o[i].parse===a?r=!0:i="transformOrigin"===i?we:o[i].p),Me(n,i);r&&(Me(n,ye),this.t._gsTransform&&delete this.t._gsTransform)}};for(de("clearProps",{parser:function(t,e,s,r,n){return n=new pe(t,s,0,0,n,2),n.setRatio=Ie,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),h="bezier,throwProps,physicsProps,physics2D".split(","),fe=h.length;fe--;)ge(h[fe]);h=a.prototype,h._firstPT=null,h._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,l=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=G(t,""),n=this._overwriteProps;var h,p,f,m,d,g,v,y,T,x=t.style;if(_&&""===x.zIndex&&(h=W(t,"zIndex",r),("auto"===h||""===h)&&this._addLazySet(x,"zIndex",0)),"string"==typeof e&&(m=x.cssText,h=$(t,r),x.cssText=m+";"+e,h=H(t,h,$(t)).difs,!U&&w.test(e)&&(h.opacity=parseFloat(RegExp.$1)),e=h,x.cssText=m),this._firstPT=p=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,ye?u&&(_=!0,""===x.zIndex&&(v=W(t,"zIndex",r),("auto"===v||""===v)&&this._addLazySet(x,"zIndex",0)),c&&this._addLazySet(x,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):x.zoom=1,f=p;f&&f._next;)f=f._next;y=new pe(t,"transform",0,0,null,2),this._linkCSSP(y,null,f),y.setRatio=T&&xe?Oe:ye?Ce:Ae,y.data=this._transform||Re(t,r,!0),n.pop()
}if(i){for(;p;){for(g=p._next,f=m;f&&f.pr>p.pr;)f=f._next;(p._prev=f?f._prev:d)?p._prev._next=p:m=p,(p._next=f)?f._prev=p:d=p,p=g}this._firstPT=m}return!0},h.parse=function(t,e,i,n){var a,h,_,u,p,c,f,m,d,g,v=t.style;for(a in e)c=e[a],h=o[a],h?i=h.parse(t,c,a,this,i,n,e):(p=W(t,a,r)+"",d="string"==typeof c,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||d&&b.test(c)?(d||(c=oe(c),c=(c.length>3?"rgba(":"rgb(")+c.join(",")+")"),i=ce(v,a,p,c,!0,"transparent",i,0,n)):!d||-1===c.indexOf(" ")&&-1===c.indexOf(",")?(_=parseFloat(p),f=_||0===_?p.substr((_+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(_=te(t,a,r),f="px"):"left"===a||"top"===a?(_=Z(t,a,r),f="px"):(_="opacity"!==a?0:1,f="")),g=d&&"="===c.charAt(1),g?(u=parseInt(c.charAt(0)+"1",10),c=c.substr(2),u*=parseFloat(c),m=c.replace(y,"")):(u=parseFloat(c),m=d?c.substr((u+"").length)||"":""),""===m&&(m=a in s?s[a]:f),c=u||0===u?(g?u+_:u)+m:e[a],f!==m&&""!==m&&(u||0===u)&&_&&(_=Q(t,a,_,f),"%"===m?(_/=Q(t,a,100,"%")/100,e.strictUnits!==!0&&(p=_+"%")):"em"===m?_/=Q(t,a,1,"em"):"px"!==m&&(u=Q(t,a,u,m),m="px"),g&&(u||0===u)&&(c=u+_+m)),g&&(u+=_),!_&&0!==_||!u&&0!==u?void 0!==v[a]&&(c||"NaN"!=c+""&&null!=c)?(i=new pe(v,a,u||_||0,0,i,-1,a,!1,0,p,c),i.xs0="none"!==c||"display"!==a&&-1===a.indexOf("Style")?c:p):j("invalid "+a+" tween value: "+e[a]):(i=new pe(v,a,_,u-_,i,0,a,l!==!1&&("px"===m||"zIndex"===a),0,p,c),i.xs0=m)):i=ce(v,a,p,c,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},h.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=Math.round(e):n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},h._enableTransforms=function(t){this._transform=this._transform||Re(this._target,r,!0),this._transformType=this._transform.svg&&Se||!t&&3!==this._transformType?2:3};var Ee=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)};h._addLazySet=function(t,e,i){var s=this._firstPT=new pe(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=Ee,s.data=this},h._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},h._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var Fe=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)Fe(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push($(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||Fe(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),h=[o],l=[],_=[],u=[],p=e._internals.reservedProps;for(t=o._targets||o.target,Fe(t,l,u),o.render(i,!0),Fe(t,_),o.render(0,!0),o._enabled(!0),r=u.length;--r>-1;)if(n=H(u[r],l[r],_[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);h.push(e.to(u[r],i,n))}return h},t.activate([a]),a},!0),function(){var t=_gsScope._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=t.prototype;e._onInitAllProps=function(){for(var t,e,i,s=this._tween,r=s.vars.roundProps instanceof Array?s.vars.roundProps:s.vars.roundProps.split(","),n=r.length,a={},o=s._propLookup.roundProps;--n>-1;)a[r[n]]=1;for(n=r.length;--n>-1;)for(t=r[n],e=s._firstPT;e;)i=e._next,e.pg?e.t._roundProps(a,!0):e.n===t&&(this._add(e.t,t,e.s,e.c),i&&(i._prev=e._prev),e._prev?e._prev._next=i:s._firstPT===e&&(s._firstPT=i),e._next=e._prev=null,s._propLookup[t]=o),e=i;return!1},e._add=function(t,e,i,s){this._addTween(t,e,i,i+s,e,!0),this._overwriteProps.push(e)}}(),_gsScope._gsDefine.plugin({propName:"attr",API:2,version:"0.3.3",init:function(t,e){var i,s,r;if("function"!=typeof t.setAttribute)return!1;this._target=t,this._proxy={},this._start={},this._end={};for(i in e)this._start[i]=this._proxy[i]=s=t.getAttribute(i),r=this._addTween(this._proxy,i,parseFloat(s),e[i],i),this._end[i]=r?r.s+r.c:e[i],this._overwriteProps.push(i);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,s=i.length,r=1===t?this._end:t?this._proxy:this._start;--s>-1;)e=i[s],this._target.setAttribute(e,r[e]+"")}}),_gsScope._gsDefine.plugin({propName:"directionalRotation",version:"0.2.1",API:2,init:function(t,e){"object"!=typeof e&&(e={rotation:e}),this.finals={};var i,s,r,n,a,o,h=e.useRadians===!0?2*Math.PI:360,l=1e-6;for(i in e)"useRadians"!==i&&(o=(e[i]+"").split("_"),s=o[0],r=parseFloat("function"!=typeof t[i]?t[i]:t[i.indexOf("set")||"function"!=typeof t["get"+i.substr(3)]?i:"get"+i.substr(3)]()),n=this.finals[i]="string"==typeof s&&"="===s.charAt(1)?r+parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)):Number(s)||0,a=n-r,o.length&&(s=o.join("_"),-1!==s.indexOf("short")&&(a%=h,a!==a%(h/2)&&(a=0>a?a+h:a-h)),-1!==s.indexOf("_cw")&&0>a?a=(a+9999999999*h)%h-(0|a/h)*h:-1!==s.indexOf("ccw")&&a>0&&(a=(a-9999999999*h)%h-(0|a/h)*h)),(a>l||-l>a)&&(this._addTween(t,i,r,r+a,i),this._overwriteProps.push(i)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=_gsScope.GreenSockGlobals||_gsScope,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},p=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},c=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",c("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),c("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),c("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),c=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--c>-1;)i=f?Math.random():1/u*c,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:c%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new p(1,1,null),c=u;--c>-1;)a=l[c],o=new p(a.x,a.y,o);this._prev=new p(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(t,e){"use strict";var i=t.GreenSockGlobals=t.GreenSockGlobals||t;if(!i.TweenLite){var s,r,n,a,o,h=function(t){var e,s=t.split("."),r=i;for(e=0;s.length>e;e++)r[s[e]]=r=r[s[e]]||{};return r},l=h("com.greensock"),_=1e-10,u=function(t){var e,i=[],s=t.length;for(e=0;e!==s;i.push(t[e++]));return i},p=function(){},c=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),f={},m=function(s,r,n,a){this.sc=f[s]?f[s].sc:[],f[s]=this,this.gsClass=null,this.func=n;var o=[];this.check=function(l){for(var _,u,p,c,d=r.length,g=d;--d>-1;)(_=f[r[d]]||new m(r[d],[])).gsClass?(o[d]=_.gsClass,g--):l&&_.sc.push(this);if(0===g&&n)for(u=("com.greensock."+s).split("."),p=u.pop(),c=h(u.join("."))[p]=this.gsClass=n.apply(n,o),a&&(i[p]=c,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+s.split(".").pop(),[],function(){return c}):s===e&&"undefined"!=typeof module&&module.exports&&(module.exports=c)),d=0;this.sc.length>d;d++)this.sc[d].check()},this.check(!0)},d=t._gsDefine=function(t,e,i,s){return new m(t,e,i,s)},g=l._class=function(t,e,i){return e=e||function(){},d(t,[],function(){return e},i),e};d.globals=i;var v=[0,0,1,1],y=[],T=g("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?v.concat(e):v},!0),w=T.map={},x=T.register=function(t,e,i,s){for(var r,n,a,o,h=e.split(","),_=h.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=h[_],r=s?g("easing."+n,null,!0):l.easing[n]||{},a=u.length;--a>-1;)o=u[a],w[n+"."+o]=w[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(n=T.prototype,n._calcEnd=!1,n.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},s=["Linear","Quad","Cubic","Quart","Quint,Strong"],r=s.length;--r>-1;)n=s[r]+",Power"+r,x(new T(null,null,1,r),n,"easeOut",!0),x(new T(null,null,2,r),n,"easeIn"+(0===r?",easeNone":"")),x(new T(null,null,3,r),n,"easeInOut");w.linear=l.easing.Linear.easeIn,w.swing=l.easing.Quad.easeInOut;var b=g("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});n=b.prototype,n.addEventListener=function(t,e,i,s,r){r=r||0;var n,h,l=this._listeners[t],_=0;for(null==l&&(this._listeners[t]=l=[]),h=l.length;--h>-1;)n=l[h],n.c===e&&n.s===i?l.splice(h,1):0===_&&r>n.pr&&(_=h+1);l.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==a||o||a.wake()},n.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},n.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s&&(s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i))};var P=t.requestAnimationFrame,S=t.cancelAnimationFrame,k=Date.now||function(){return(new Date).getTime()},R=k();for(s=["ms","moz","webkit","o"],r=s.length;--r>-1&&!P;)P=t[s[r]+"RequestAnimationFrame"],S=t[s[r]+"CancelAnimationFrame"]||t[s[r]+"CancelRequestAnimationFrame"];g("Ticker",function(t,e){var i,s,r,n,h,l=this,u=k(),c=e!==!1&&P,f=500,m=33,d=function(t){var e,a,o=k()-R;o>f&&(u+=o-m),R+=o,l.time=(R-u)/1e3,e=l.time-h,(!i||e>0||t===!0)&&(l.frame++,h+=e+(e>=n?.004:n-e),a=!0),t!==!0&&(r=s(d)),a&&l.dispatchEvent("tick")};b.call(l),l.time=l.frame=0,l.tick=function(){d(!0)},l.lagSmoothing=function(t,e){f=t||1/_,m=Math.min(e,f,0)},l.sleep=function(){null!=r&&(c&&S?S(r):clearTimeout(r),s=p,r=null,l===a&&(o=!1))},l.wake=function(){null!==r?l.sleep():l.frame>10&&(R=k()-f+5),s=0===i?p:c&&P?P:function(t){return setTimeout(t,0|1e3*(h-l.time)+1)},l===a&&(o=!0),d(2)},l.fps=function(t){return arguments.length?(i=t,n=1/(i||60),h=this.time+n,l.wake(),void 0):i},l.useRAF=function(t){return arguments.length?(l.sleep(),c=t,l.fps(i),void 0):c},l.fps(t),setTimeout(function(){c&&(!r||5>l.frame)&&l.useRAF(!1)},1500)}),n=l.Ticker.prototype=new l.events.EventDispatcher,n.constructor=l.Ticker;var A=g("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,B){o||a.wake();var i=this.vars.useFrames?j:B;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});a=A.ticker=new l.Ticker,n=A.prototype,n._dirty=n._gc=n._initted=n._paused=!1,n._totalTime=n._time=0,n._rawPrevTime=-1,n._next=n._last=n._onUpdate=n._timeline=n.timeline=null,n._paused=!1;var O=function(){o&&k()-R>2e3&&a.wake(),setTimeout(O,2e3)};O(),n.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},n.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},n.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},n.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},n.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},n.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},n.render=function(){},n.invalidate=function(){return this._time=this._totalTime=0,this._initted=this._gc=!1,this._rawPrevTime=-1,(this._gc||!this.timeline)&&this._enabled(!0),this},n.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},n._enabled=function(t,e){return o||a.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},n._kill=function(){return this._enabled(!1,!1)},n.kill=function(t,e){return this._kill(t,e),this},n._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},n._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},n.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=c(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},n.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},n.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},n.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},n.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},n.totalTime=function(t,e,i){if(o||a.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),I.length&&q())}return this},n.progress=n.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},n.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},n.endTime=function(t){return this._startTime+(0!=t?this.totalDuration():this.duration())/this._timeScale},n.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||_,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},n.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},n.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){o||t||a.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var C=g("core.SimpleTimeline",function(t){A.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});n=C.prototype=new A,n.constructor=C,n.kill()._gc=!1,n._first=n._last=n._recent=null,n._sortChildren=!1,n.add=n.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._recent=t,this._timeline&&this._uncache(!0),this},n._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),t._next=t._prev=t.timeline=null,t===this._recent&&(this._recent=this._last),this._timeline&&this._uncache(!0)),this},n.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},n.rawTime=function(){return o||a.wake(),this._totalTime};var D=g("TweenLite",function(e,i,s){if(A.call(this,i,s),this.render=D.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:D.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),h=this.vars.overwrite;if(this._overwrite=h=null==h?Y[D.defaultOverwrite]:"number"==typeof h?h>>0:Y[h],(o||e instanceof Array||e.push&&c(e))&&"number"!=typeof e[0])for(this._targets=a=u(e),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(u(n))):(this._siblings[r]=V(n,this,!1),1===h&&this._siblings[r].length>1&&W(n,this,null,1,this._siblings[r])):(n=a[r--]=D.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=V(e,this,!1),1===h&&this._siblings.length>1&&W(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-_,this.render(-this._delay))},!0),M=function(e){return e&&e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},z=function(t,e){var i,s={};for(i in t)U[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!L[i]||L[i]&&L[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};n=D.prototype=new A,n.constructor=D,n.kill()._gc=!1,n.ratio=0,n._firstPT=n._targets=n._overwrittenProps=n._startAt=null,n._notifyPluginsOfEnabled=n._lazy=!1,D.version="1.14.1",D.defaultEase=n._ease=new T(null,null,1,1),D.defaultOverwrite="auto",D.ticker=a,D.autoSleep=!0,D.lagSmoothing=function(t,e){a.lagSmoothing(t,e)},D.selector=t.$||t.jQuery||function(e){var i=t.$||t.jQuery;return i?(D.selector=i,i(e)):"undefined"==typeof document?e:document.querySelectorAll?document.querySelectorAll(e):document.getElementById("#"===e.charAt(0)?e.substr(1):e)};var I=[],E={},F=D._internals={isArray:c,isSelector:M,lazyTweens:I},L=D._plugins={},N=F.tweenLookup={},X=0,U=F.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1,onOverwrite:1},Y={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},j=A._rootFramesTimeline=new C,B=A._rootTimeline=new C,q=F.lazyRender=function(){var t,e=I.length;for(E={};--e>-1;)t=I[e],t&&t._lazy!==!1&&(t.render(t._lazy[0],t._lazy[1],!0),t._lazy=!1);I.length=0};B._startTime=a.time,j._startTime=a.frame,B._active=j._active=!0,setTimeout(q,1),A._updateRoot=D.render=function(){var t,e,i;if(I.length&&q(),B.render((a.time-B._startTime)*B._timeScale,!1,!1),j.render((a.frame-j._startTime)*j._timeScale,!1,!1),I.length&&q(),!(a.frame%120)){for(i in N){for(e=N[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete N[i]}if(i=B._first,(!i||i._paused)&&D.autoSleep&&!j._first&&1===a._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||a.sleep()}}},a.addEventListener("tick",A._updateRoot);var V=function(t,e,i){var s,r,n=t._gsTweenID;if(N[n||(t._gsTweenID=n="t"+X++)]||(N[n]={target:t,tweens:[]}),e&&(s=N[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return N[n].tweens},G=function(t,e,i,s){var r=t.vars.onOverwrite;r&&r(t,e,i,s),r=D.onOverwrite,r&&r(t,e,i,s)},W=function(t,e,i,s,r){var n,a,o,h;if(1===s||s>=4){for(h=r.length,n=0;h>n;n++)if((o=r[n])!==e)o._gc||(o._enabled(!1,!1)&&(a=!0),G(o,e));else if(5===s)break;return a}var l,u=e._startTime+_,p=[],c=0,f=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(l=l||Q(e,0,f),0===Q(o,l,f)&&(p[c++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((f||!o._initted)&&2e-10>=u-o._startTime||(p[c++]=o)));for(n=c;--n>-1;)o=p[n],2===s&&o._kill(i,t,e)&&(a=!0),(2!==s||!o._firstPT&&o._initted)&&(o._enabled(!1,!1)&&(a=!0),2!==s&&G(o,e));return a},Q=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*_>n-e?_:(n+=t.totalDuration()/t._timeScale/r)>e+_?0:n-e-_};n._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,h=!!n.immediateRender,l=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=D.to(this.target,0,r),h)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{0!==this._time&&(h=!1),i={};for(s in n)U[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&n.lazy!==!1,i.immediateRender=h,this._startAt=D.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1),this.vars.immediateRender&&(this._startAt=null)}if(this._ease=l=l?l instanceof T?l:"function"==typeof l?new T(l,n.easeParams):w[l]||D.defaultEase:D.defaultEase,n.easeParams instanceof Array&&l.config&&(this._ease=l.config.apply(l,n.easeParams)),this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&D._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},n._initProps=function(e,i,s,r){var n,a,o,h,l,_;if(null==e)return!1;E[e._gsTweenID]&&q(),this.vars.css||e.style&&e!==t&&e.nodeType&&L.css&&this.vars.autoCSS!==!1&&z(this.vars,e);for(n in this.vars){if(_=this.vars[n],U[n])_&&(_ instanceof Array||_.push&&c(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(L[n]&&(h=new L[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=l={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:h._priority},a=h._overwriteProps.length;--a>-1;)i[h._overwriteProps[a]]=this._firstPT;(h._priority||h._onInitAllProps)&&(o=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=l={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},l.s=l.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),l.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-l.s||0;l&&l._next&&(l._next._prev=l)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&W(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(E[e._gsTweenID]=!0),o)},n.render=function(t,e,i){var s,r,n,a,o=this._time,h=this._duration,l=this._rawPrevTime;if(t>=h)this._totalTime=this._time=h,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===h&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>l||l===_)&&l!==t&&(i=!0,l>_&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||l===t?t:_);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===h&&l>0&&l!==_)&&(r="onReverseComplete",s=this._reversed),0>t&&(this._active=!1,0===h&&(this._initted||!this.vars.lazy||i)&&(l>=0&&(i=!0),this._rawPrevTime=a=!e||t||l===t?t:_)),this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/h,p=this._easeType,c=this._easePower;(1===p||3===p&&u>=.5)&&(u=1-u),3===p&&(u*=2),1===c?u*=u:2===c?u*=u*u:3===c?u*=u*u*u:4===c&&(u*=u*u*u*u),this.ratio=1===p?1-u:2===p?u:.5>t/h?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/h);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=l,I.push(this),this._lazy=[t,e],void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/h):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===h)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||y))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&t!==-1e-4&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||y)),r&&(!this._gc||i)&&(0>t&&this._startAt&&!this._onUpdate&&t!==-1e-4&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||y),0===h&&this._rawPrevTime===_&&a!==_&&(this._rawPrevTime=0))}},n._kill=function(t,e,i){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:D.selector(e)||e;var s,r,n,a,o,h,l,_,u;if((c(e)||M(e))&&"number"!=typeof e[0])for(s=e.length;--s>-1;)this._kill(t,e[s])&&(h=!0);else{if(this._targets){for(s=this._targets.length;--s>-1;)if(e===this._targets[s]){o=this._propLookup[s]||{},this._overwrittenProps=this._overwrittenProps||[],r=this._overwrittenProps[s]=t?this._overwrittenProps[s]||{}:"all";break}}else{if(e!==this.target)return!1;o=this._propLookup,r=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(o){l=t||o,_=t!==r&&"all"!==r&&t!==o&&("object"!=typeof t||!t._tempKill);for(n in l)(a=o[n])&&(u||(u=[]),u.push(n),a.pg&&a.t._kill(l)&&(h=!0),a.pg&&0!==a.t._overwriteProps.length||(a._prev?a._prev._next=a._next:a===this._firstPT&&(this._firstPT=a._next),a._next&&(a._next._prev=a._prev),a._next=a._prev=null),delete o[n]),_&&(r[n]=1);
!this._firstPT&&this._initted&&this._enabled(!1,!1),u&&i&&G(this,i,e,u)}}return h},n.invalidate=function(){return this._notifyPluginsOfEnabled&&D._onPluginEvent("_onDisable",this),this._firstPT=this._overwrittenProps=this._startAt=this._onUpdate=null,this._notifyPluginsOfEnabled=this._active=this._lazy=!1,this._propLookup=this._targets?{}:[],A.prototype.invalidate.call(this),this.vars.immediateRender&&(this._time=-_,this.render(-this._delay)),this},n._enabled=function(t,e){if(o||a.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=V(s[i],this,!0);else this._siblings=V(this.target,this,!0)}return A.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?D._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},D.to=function(t,e,i){return new D(t,e,i)},D.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new D(t,e,i)},D.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new D(t,e,s)},D.delayedCall=function(t,e,i,s,r){return new D(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:r,overwrite:0})},D.set=function(t,e){return new D(t,0,e)},D.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:D.selector(t)||t;var i,s,r,n;if((c(t)||M(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(D.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=V(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},D.killTweensOf=D.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=D.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var Z=g("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=Z.prototype},!0);if(n=Z.prototype,Z.version="1.10.1",Z.API=2,n._firstPT=null,n._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},n.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},n._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},n._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},D._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},Z.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===Z.API&&(L[(new t[e])._propName]=t[e]);return!0},d.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=g("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){Z.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new Z(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,Z.activate([a]),a},s=t._gsQueue){for(r=0;s.length>r;r++)s[r]();for(n in f)f[n].func||t.console.log("GSAP encountered missing dependency: com.greensock."+n)}o=!1}}("undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window,"TweenMax");
; browserify_shim__define__module__export__(typeof TweenMax != "undefined" ? TweenMax : window.TweenMax);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/plugins/ScrollToPlugin.min.js":[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.7.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,r){var s="x"===r?"Width":"Height",n="scroll"+s,o="client"+s,a=document.body;return i===e||i===t||i===a?Math.max(t[n],a[n])-(e["inner"+s]||Math.max(t[o],a[o])):i[n]-i["offset"+s]},r=_gsScope._gsDefine.plugin({propName:"scrollTo",API:2,version:"1.7.4",init:function(t,r,s){return this._wdw=t===e,this._target=t,this._tween=s,"object"!=typeof r&&(r={y:r}),this.vars=r,this._autoKill=r.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=r.x?(this._addTween(this,"x",this.x,"max"===r.x?i(t,"x"):r.x,"scrollTo_x",!0),this._overwriteProps.push("scrollTo_x")):this.skipX=!0,null!=r.y?(this._addTween(this,"y",this.y,"max"===r.y?i(t,"y"):r.y,"scrollTo_y",!0),this._overwriteProps.push("scrollTo_y")):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var r=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,n=s-this.yPrev,o=r-this.xPrev;this._autoKill&&(!this.skipX&&(o>7||-7>o)&&i(this._target,"x")>r&&(this.skipX=!0),!this.skipY&&(n>7||-7>n)&&i(this._target,"y")>s&&(this.skipY=!0),this.skipX&&this.skipY&&(this._tween.kill(),this.vars.onAutoKill&&this.vars.onAutoKill.apply(this.vars.onAutoKillScope||this._tween,this.vars.onAutoKillParams||[]))),this._wdw?e.scrollTo(this.skipX?r:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),s=r.prototype;r.max=i,s.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},s.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},s._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/page/index.js":[function(require,module,exports){

;(function(){

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 == arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (!dispatch) return;
    var url = location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== dispatch) page.dispatch(ctx);
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    var current = window.location.pathname + window.location.search;
    if (current == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
    this.params = [];

    // fragment
    this.hash = '';
    if (!~this.path.indexOf('#')) return;
    var parts = this.path.split('#');
    this.path = parts[0];
    this.hash = parts[1] || '';
    this.querystring = this.querystring.split('#')[0];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname == location.pathname && (el.hash || '#' == link)) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;

    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // same page
    var orig = path + el.hash;

    path = path.replace(base, '');
    if (base && orig == path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-debug/src/index.js":[function(require,module,exports){
'use strict';

module.exports = function(Vue, options) {
    Vue.log = require('./log')(Vue);
};
},{"./log":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-debug/src/log.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-debug/src/log.js":[function(require,module,exports){
'use strict';

/**
 * Clean log without getter/setter
 * usefull for in-application debugging.
 * Only log $data & its properties
 *
 * (mostly to avoid JSON parse exception with
 * circular references from vm.$compiler)
 */

module.exports = function(Vue) {
    var utils = Vue.require('utils'),
    isObject = utils.isTrueObject,
    slice = [].slice;

    return function() {
        if(!console) return;
            
        var args = slice.call(arguments);
        
        for(var i = args.length - 1; i >= 0; i--) {
            var arg = args[i];

            // Directly log any primitive arg
            if(!isObject(arg)) continue;

            var hasCircularRef = false,
                isVm = !!arg.$compiler;
            
            // If arg is a vm, log $data directly
            if(isVm) {
                args.splice(i, 1, arg.$data);
                continue;
            }

            // don't log if $ or $compiler
            for(var prop in arg) {
                // $compiler
                if(prop === 'vm') hasCircularRef = true;
                
                // $ / v-ref
                if(isObject(arg[prop]) && '$compiler' in arg[prop]) hasCircularRef = true;
            }

            if(hasCircularRef) {
                args.splice(i, 1);
                continue;
            }
        }
        
        // using `return` makes it testable  
        return console.log.apply(console, JSON.parse(JSON.stringify(args)));
    };
};
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-el/index.js":[function(require,module,exports){
exports.install = function (Vue) {
  
  Vue.directive('el',{

    isLiteral: true,

    bind: function() {
      var id = this.expression;

      if (id) {
        this.vm.$$ = this.vm.$$ || {};
        this.vm.$$[this.expression] = this.el;
      }
    },

    unbind: function() {
      var id = this.expression;

      if (id) {
        delete this.vm.$$[this.expression];
      }
    }

  });

}
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-query/index.js":[function(require,module,exports){
'use strict';

var slice = [].slice;

function find(el, selector) {
  return el.querySelector(selector);
}

function findAll(el, selector) {
  el = el || document;
  return slice.call(el.querySelectorAll(selector));
}

function hasClass(el, className) {
    return new RegExp(' ' + className + ' ').test(' ' + el.className + ' ');
}

function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

exports.install = function(Vue) {
  var utils = Vue.require('utils');
  utils.extend(Vue.prototype, {
    /**
     * Return a single dom element from the current VM matching the given selector
     * @param  {string} selector string selector to search
     * @return {domElement}          the VM's child found
     */
    $findOne: function(selector) {
        return find(this.$el, selector);
    },

    /**
     * Return an array of domElement from the current VM matching the given selector
     * @param  {string} selector string selector to search
     * @return {array}          array containing domElements found in the VM
     */
    $find: function(selector) {
        return findAll(this.$el, selector);
    },

    /**
     * Check if the current VM has a given class, if a selector is passed as second parameters, we'll check the corresponding child instead
     * @param  {string}  className
     * @param  {string}  selector
     * @return {Boolean}
     */
    hasClass: function(className, selector) {
        var el = selector ? this.$findOne(selector) : this.$el;
        return hasClass(el, className);
    },

    /**
     * Add a class to the current VM or to its child matching 'selector'
     * @param {string} className
     * @param {string} selector
     */
    addClass: function(className, selector) {
        if(this.hasClass(className, selector)) return;
        var el = selector ? this.$find(selector) : this.$el;
        if(isArray(el)) {
            for(var i = 0, l = el.length; i < l; i++) {
                utils.addClass(el[i], className);
            }
            return;
        }
        return utils.addClass(el, className);
    },

    /**
     * Remove a class to the current VM or to its child matching 'selector'
     * @param {string} className
     * @param {string} selector
     */
    removeClass: function(className, selector) {
        var el = selector ? this.$find(selector) : this.$el;
        if(isArray(el)) {
            for(var i = 0, l = el.length; i < l; i++) {
                utils.removeClass(el[i], className);
            }
            return;
        }
        return utils.removeClass(el, className);
    }
  });
};
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/batcher.js":[function(require,module,exports){
var utils = require('./utils')

function Batcher () {
    this.reset()
}

var BatcherProto = Batcher.prototype

BatcherProto.push = function (job) {
    if (!job.id || !this.has[job.id]) {
        this.queue.push(job)
        this.has[job.id] = job
        if (!this.waiting) {
            this.waiting = true
            utils.nextTick(utils.bind(this.flush, this))
        }
    } else if (job.override) {
        var oldJob = this.has[job.id]
        oldJob.cancelled = true
        this.queue.push(job)
        this.has[job.id] = job
    }
}

BatcherProto.flush = function () {
    // before flush hook
    if (this._preFlush) this._preFlush()
    // do not cache length because more jobs might be pushed
    // as we execute existing jobs
    for (var i = 0; i < this.queue.length; i++) {
        var job = this.queue[i]
        if (!job.cancelled) {
            job.execute()
        }
    }
    this.reset()
}

BatcherProto.reset = function () {
    this.has = utils.hash()
    this.queue = []
    this.waiting = false
}

module.exports = Batcher
},{"./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/binding.js":[function(require,module,exports){
var Batcher        = require('./batcher'),
    bindingBatcher = new Batcher(),
    bindingId      = 1

/**
 *  Binding class.
 *
 *  each property on the viewmodel has one corresponding Binding object
 *  which has multiple directive instances on the DOM
 *  and multiple computed property dependents
 */
function Binding (compiler, key, isExp, isFn) {
    this.id = bindingId++
    this.value = undefined
    this.isExp = !!isExp
    this.isFn = isFn
    this.root = !this.isExp && key.indexOf('.') === -1
    this.compiler = compiler
    this.key = key
    this.dirs = []
    this.subs = []
    this.deps = []
    this.unbound = false
}

var BindingProto = Binding.prototype

/**
 *  Update value and queue instance updates.
 */
BindingProto.update = function (value) {
    if (!this.isComputed || this.isFn) {
        this.value = value
    }
    if (this.dirs.length || this.subs.length) {
        var self = this
        bindingBatcher.push({
            id: this.id,
            execute: function () {
                if (!self.unbound) {
                    self._update()
                }
            }
        })
    }
}

/**
 *  Actually update the directives.
 */
BindingProto._update = function () {
    var i = this.dirs.length,
        value = this.val()
    while (i--) {
        this.dirs[i].$update(value)
    }
    this.pub()
}

/**
 *  Return the valuated value regardless
 *  of whether it is computed or not
 */
BindingProto.val = function () {
    return this.isComputed && !this.isFn
        ? this.value.$get()
        : this.value
}

/**
 *  Notify computed properties that depend on this binding
 *  to update themselves
 */
BindingProto.pub = function () {
    var i = this.subs.length
    while (i--) {
        this.subs[i].update()
    }
}

/**
 *  Unbind the binding, remove itself from all of its dependencies
 */
BindingProto.unbind = function () {
    // Indicate this has been unbound.
    // It's possible this binding will be in
    // the batcher's flush queue when its owner
    // compiler has already been destroyed.
    this.unbound = true
    var i = this.dirs.length
    while (i--) {
        this.dirs[i].$unbind()
    }
    i = this.deps.length
    var subs
    while (i--) {
        subs = this.deps[i].subs
        var j = subs.indexOf(this)
        if (j > -1) subs.splice(j, 1)
    }
}

module.exports = Binding
},{"./batcher":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/batcher.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/compiler.js":[function(require,module,exports){
var Emitter     = require('./emitter'),
    Observer    = require('./observer'),
    config      = require('./config'),
    utils       = require('./utils'),
    Binding     = require('./binding'),
    Directive   = require('./directive'),
    TextParser  = require('./text-parser'),
    DepsParser  = require('./deps-parser'),
    ExpParser   = require('./exp-parser'),
    ViewModel,
    
    // cache methods
    slice       = [].slice,
    extend      = utils.extend,
    hasOwn      = ({}).hasOwnProperty,
    def         = Object.defineProperty,

    // hooks to register
    hooks = [
        'created', 'ready',
        'beforeDestroy', 'afterDestroy',
        'attached', 'detached'
    ],

    // list of priority directives
    // that needs to be checked in specific order
    priorityDirectives = [
        'if',
        'repeat',
        'view',
        'component'
    ]

/**
 *  The DOM compiler
 *  scans a DOM node and compile bindings for a ViewModel
 */
function Compiler (vm, options) {

    var compiler = this,
        key, i

    // default state
    compiler.init       = true
    compiler.destroyed  = false

    // process and extend options
    options = compiler.options = options || {}
    utils.processOptions(options)

    // copy compiler options
    extend(compiler, options.compilerOptions)
    // repeat indicates this is a v-repeat instance
    compiler.repeat   = compiler.repeat || false
    // expCache will be shared between v-repeat instances
    compiler.expCache = compiler.expCache || {}

    // initialize element
    var el = compiler.el = compiler.setupElement(options)
    utils.log('\nnew VM instance: ' + el.tagName + '\n')

    // set other compiler properties
    compiler.vm       = el.vue_vm = vm
    compiler.bindings = utils.hash()
    compiler.dirs     = []
    compiler.deferred = []
    compiler.computed = []
    compiler.children = []
    compiler.emitter  = new Emitter(vm)

    // VM ---------------------------------------------------------------------

    // set VM properties
    vm.$         = {}
    vm.$el       = el
    vm.$options  = options
    vm.$compiler = compiler
    vm.$event    = null

    // set parent & root
    var parentVM = options.parent
    if (parentVM) {
        compiler.parent = parentVM.$compiler
        parentVM.$compiler.children.push(compiler)
        vm.$parent = parentVM
        // inherit lazy option
        if (!('lazy' in options)) {
            options.lazy = compiler.parent.options.lazy
        }
    }
    vm.$root = getRoot(compiler).vm

    // DATA -------------------------------------------------------------------

    // setup observer
    // this is necesarry for all hooks and data observation events
    compiler.setupObserver()

    // create bindings for computed properties
    if (options.methods) {
        for (key in options.methods) {
            compiler.createBinding(key)
        }
    }

    // create bindings for methods
    if (options.computed) {
        for (key in options.computed) {
            compiler.createBinding(key)
        }
    }

    // initialize data
    var data = compiler.data = options.data || {},
        defaultData = options.defaultData
    if (defaultData) {
        for (key in defaultData) {
            if (!hasOwn.call(data, key)) {
                data[key] = defaultData[key]
            }
        }
    }

    // copy paramAttributes
    var params = options.paramAttributes
    if (params) {
        i = params.length
        while (i--) {
            data[params[i]] = utils.checkNumber(
                compiler.eval(
                    el.getAttribute(params[i])
                )
            )
        }
    }

    // copy data properties to vm
    // so user can access them in the created hook
    extend(vm, data)
    vm.$data = data

    // beforeCompile hook
    compiler.execHook('created')

    // the user might have swapped the data ...
    data = compiler.data = vm.$data

    // user might also set some properties on the vm
    // in which case we should copy back to $data
    var vmProp
    for (key in vm) {
        vmProp = vm[key]
        if (
            key.charAt(0) !== '$' &&
            data[key] !== vmProp &&
            typeof vmProp !== 'function'
        ) {
            data[key] = vmProp
        }
    }

    // now we can observe the data.
    // this will convert data properties to getter/setters
    // and emit the first batch of set events, which will
    // in turn create the corresponding bindings.
    compiler.observeData(data)

    // COMPILE ----------------------------------------------------------------

    // before compiling, resolve content insertion points
    if (options.template) {
        this.resolveContent()
    }

    // now parse the DOM and bind directives.
    // During this stage, we will also create bindings for
    // encountered keypaths that don't have a binding yet.
    compiler.compile(el, true)

    // Any directive that creates child VMs are deferred
    // so that when they are compiled, all bindings on the
    // parent VM have been created.
    i = compiler.deferred.length
    while (i--) {
        compiler.bindDirective(compiler.deferred[i])
    }
    compiler.deferred = null

    // extract dependencies for computed properties.
    // this will evaluated all collected computed bindings
    // and collect get events that are emitted.
    if (this.computed.length) {
        DepsParser.parse(this.computed)
    }

    // done!
    compiler.init = false

    // post compile / ready hook
    compiler.execHook('ready')
}

var CompilerProto = Compiler.prototype

/**
 *  Initialize the VM/Compiler's element.
 *  Fill it in with the template if necessary.
 */
CompilerProto.setupElement = function (options) {
    // create the node first
    var el = typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el || document.createElement(options.tagName || 'div')

    var template = options.template,
        child, replacer, i, attr, attrs

    if (template) {
        // collect anything already in there
        if (el.hasChildNodes()) {
            this.rawContent = document.createElement('div')
            /* jshint boss: true */
            while (child = el.firstChild) {
                this.rawContent.appendChild(child)
            }
        }
        // replace option: use the first node in
        // the template directly
        if (options.replace && template.firstChild === template.lastChild) {
            replacer = template.firstChild.cloneNode(true)
            if (el.parentNode) {
                el.parentNode.insertBefore(replacer, el)
                el.parentNode.removeChild(el)
            }
            // copy over attributes
            if (el.hasAttributes()) {
                i = el.attributes.length
                while (i--) {
                    attr = el.attributes[i]
                    replacer.setAttribute(attr.name, attr.value)
                }
            }
            // replace
            el = replacer
        } else {
            el.appendChild(template.cloneNode(true))
        }

    }

    // apply element options
    if (options.id) el.id = options.id
    if (options.className) el.className = options.className
    attrs = options.attributes
    if (attrs) {
        for (attr in attrs) {
            el.setAttribute(attr, attrs[attr])
        }
    }

    return el
}

/**
 *  Deal with <content> insertion points
 *  per the Web Components spec
 */
CompilerProto.resolveContent = function () {

    var outlets = slice.call(this.el.getElementsByTagName('content')),
        raw = this.rawContent,
        outlet, select, i, j, main

    i = outlets.length
    if (i) {
        // first pass, collect corresponding content
        // for each outlet.
        while (i--) {
            outlet = outlets[i]
            if (raw) {
                select = outlet.getAttribute('select')
                if (select) { // select content
                    outlet.content =
                        slice.call(raw.querySelectorAll(select))
                } else { // default content
                    main = outlet
                }
            } else { // fallback content
                outlet.content =
                    slice.call(outlet.childNodes)
            }
        }
        // second pass, actually insert the contents
        for (i = 0, j = outlets.length; i < j; i++) {
            outlet = outlets[i]
            if (outlet === main) continue
            insert(outlet, outlet.content)
        }
        // finally insert the main content
        if (raw && main) {
            insert(main, slice.call(raw.childNodes))
        }
    }

    function insert (outlet, contents) {
        var parent = outlet.parentNode,
            i = 0, j = contents.length
        for (; i < j; i++) {
            parent.insertBefore(contents[i], outlet)
        }
        parent.removeChild(outlet)
    }

    this.rawContent = null
}

/**
 *  Setup observer.
 *  The observer listens for get/set/mutate events on all VM
 *  values/objects and trigger corresponding binding updates.
 *  It also listens for lifecycle hooks.
 */
CompilerProto.setupObserver = function () {

    var compiler = this,
        bindings = compiler.bindings,
        options  = compiler.options,
        observer = compiler.observer = new Emitter(compiler.vm)

    // a hash to hold event proxies for each root level key
    // so they can be referenced and removed later
    observer.proxies = {}

    // add own listeners which trigger binding updates
    observer
        .on('get', onGet)
        .on('set', onSet)
        .on('mutate', onSet)

    // register hooks
    var i = hooks.length, j, hook, fns
    while (i--) {
        hook = hooks[i]
        fns = options[hook]
        if (Array.isArray(fns)) {
            j = fns.length
            // since hooks were merged with child at head,
            // we loop reversely.
            while (j--) {
                registerHook(hook, fns[j])
            }
        } else if (fns) {
            registerHook(hook, fns)
        }
    }

    // broadcast attached/detached hooks
    observer
        .on('hook:attached', function () {
            broadcast(1)
        })
        .on('hook:detached', function () {
            broadcast(0)
        })

    function onGet (key) {
        check(key)
        DepsParser.catcher.emit('get', bindings[key])
    }

    function onSet (key, val, mutation) {
        observer.emit('change:' + key, val, mutation)
        check(key)
        bindings[key].update(val)
    }

    function registerHook (hook, fn) {
        observer.on('hook:' + hook, function () {
            fn.call(compiler.vm)
        })
    }

    function broadcast (event) {
        var children = compiler.children
        if (children) {
            var child, i = children.length
            while (i--) {
                child = children[i]
                if (child.el.parentNode) {
                    event = 'hook:' + (event ? 'attached' : 'detached')
                    child.observer.emit(event)
                    child.emitter.emit(event)
                }
            }
        }
    }

    function check (key) {
        if (!bindings[key]) {
            compiler.createBinding(key)
        }
    }
}

CompilerProto.observeData = function (data) {

    var compiler = this,
        observer = compiler.observer

    // recursively observe nested properties
    Observer.observe(data, '', observer)

    // also create binding for top level $data
    // so it can be used in templates too
    var $dataBinding = compiler.bindings['$data'] = new Binding(compiler, '$data')
    $dataBinding.update(data)

    // allow $data to be swapped
    def(compiler.vm, '$data', {
        get: function () {
            compiler.observer.emit('get', '$data')
            return compiler.data
        },
        set: function (newData) {
            var oldData = compiler.data
            Observer.unobserve(oldData, '', observer)
            compiler.data = newData
            Observer.copyPaths(newData, oldData)
            Observer.observe(newData, '', observer)
            update()
        }
    })

    // emit $data change on all changes
    observer
        .on('set', onSet)
        .on('mutate', onSet)

    function onSet (key) {
        if (key !== '$data') update()
    }

    function update () {
        $dataBinding.update(compiler.data)
        observer.emit('change:$data', compiler.data)
    }
}

/**
 *  Compile a DOM node (recursive)
 */
CompilerProto.compile = function (node, root) {
    var nodeType = node.nodeType
    if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node
        this.compileElement(node, root)
    } else if (nodeType === 3 && config.interpolate) {
        this.compileTextNode(node)
    }
}

/**
 *  Check for a priority directive
 *  If it is present and valid, return true to skip the rest
 */
CompilerProto.checkPriorityDir = function (dirname, node, root) {
    var expression, directive, Ctor
    if (
        dirname === 'component' &&
        root !== true &&
        (Ctor = this.resolveComponent(node, undefined, true))
    ) {
        directive = this.parseDirective(dirname, '', node)
        directive.Ctor = Ctor
    } else {
        expression = utils.attr(node, dirname)
        directive = expression && this.parseDirective(dirname, expression, node)
    }
    if (directive) {
        if (root === true) {
            utils.warn(
                'Directive v-' + dirname + ' cannot be used on an already instantiated ' +
                'VM\'s root node. Use it from the parent\'s template instead.'
            )
            return
        }
        this.deferred.push(directive)
        return true
    }
}

/**
 *  Compile normal directives on a node
 */
CompilerProto.compileElement = function (node, root) {

    // textarea is pretty annoying
    // because its value creates childNodes which
    // we don't want to compile.
    if (node.tagName === 'TEXTAREA' && node.value) {
        node.value = this.eval(node.value)
    }

    // only compile if this element has attributes
    // or its tagName contains a hyphen (which means it could
    // potentially be a custom element)
    if (node.hasAttributes() || node.tagName.indexOf('-') > -1) {

        // skip anything with v-pre
        if (utils.attr(node, 'pre') !== null) {
            return
        }

        var i, l, j, k

        // check priority directives.
        // if any of them are present, it will take over the node with a childVM
        // so we can skip the rest
        for (i = 0, l = priorityDirectives.length; i < l; i++) {
            if (this.checkPriorityDir(priorityDirectives[i], node, root)) {
                return
            }
        }

        // check transition & animation properties
        node.vue_trans  = utils.attr(node, 'transition')
        node.vue_anim   = utils.attr(node, 'animation')
        node.vue_effect = this.eval(utils.attr(node, 'effect'))

        var prefix = config.prefix + '-',
            params = this.options.paramAttributes,
            attr, attrname, isDirective, exp, directives, directive, dirname

        // v-with has special priority among the rest
        // it needs to pull in the value from the parent before
        // computed properties are evaluated, because at this stage
        // the computed properties have not set up their dependencies yet.
        if (root) {
            var withExp = utils.attr(node, 'with')
            if (withExp) {
                directives = this.parseDirective('with', withExp, node, true)
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j], this.parent)
                }
            }
        }

        var attrs = slice.call(node.attributes)
        for (i = 0, l = attrs.length; i < l; i++) {

            attr = attrs[i]
            attrname = attr.name
            isDirective = false

            if (attrname.indexOf(prefix) === 0) {
                // a directive - split, parse and bind it.
                isDirective = true
                dirname = attrname.slice(prefix.length)
                // build with multiple: true
                directives = this.parseDirective(dirname, attr.value, node, true)
                // loop through clauses (separated by ",")
                // inside each attribute
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j])
                }
            } else if (config.interpolate) {
                // non directive attribute, check interpolation tags
                exp = TextParser.parseAttr(attr.value)
                if (exp) {
                    directive = this.parseDirective('attr', exp, node)
                    directive.arg = attrname
                    if (params && params.indexOf(attrname) > -1) {
                        // a param attribute... we should use the parent binding
                        // to avoid circular updates like size={{size}}
                        this.bindDirective(directive, this.parent)
                    } else {
                        this.bindDirective(directive)
                    }
                }
            }

            if (isDirective && dirname !== 'cloak') {
                node.removeAttribute(attrname)
            }
        }

    }

    // recursively compile childNodes
    if (node.hasChildNodes()) {
        slice.call(node.childNodes).forEach(this.compile, this)
    }
}

/**
 *  Compile a text node
 */
CompilerProto.compileTextNode = function (node) {

    var tokens = TextParser.parse(node.nodeValue)
    if (!tokens) return
    var el, token, directive

    for (var i = 0, l = tokens.length; i < l; i++) {

        token = tokens[i]
        directive = null

        if (token.key) { // a binding
            if (token.key.charAt(0) === '>') { // a partial
                el = document.createComment('ref')
                directive = this.parseDirective('partial', token.key.slice(1), el)
            } else {
                if (!token.html) { // text binding
                    el = document.createTextNode('')
                    directive = this.parseDirective('text', token.key, el)
                } else { // html binding
                    el = document.createComment(config.prefix + '-html')
                    directive = this.parseDirective('html', token.key, el)
                }
            }
        } else { // a plain string
            el = document.createTextNode(token)
        }

        // insert node
        node.parentNode.insertBefore(el, node)
        // bind directive
        this.bindDirective(directive)

    }
    node.parentNode.removeChild(node)
}

/**
 *  Parse a directive name/value pair into one or more
 *  directive instances
 */
CompilerProto.parseDirective = function (name, value, el, multiple) {
    var compiler = this,
        definition = compiler.getOption('directives', name)
    if (definition) {
        // parse into AST-like objects
        var asts = Directive.parse(value)
        return multiple
            ? asts.map(build)
            : build(asts[0])
    }
    function build (ast) {
        return new Directive(name, ast, definition, compiler, el)
    }
}

/**
 *  Add a directive instance to the correct binding & viewmodel
 */
CompilerProto.bindDirective = function (directive, bindingOwner) {

    if (!directive) return

    // keep track of it so we can unbind() later
    this.dirs.push(directive)

    // for empty or literal directives, simply call its bind()
    // and we're done.
    if (directive.isEmpty || directive.isLiteral) {
        if (directive.bind) directive.bind()
        return
    }

    // otherwise, we got more work to do...
    var binding,
        compiler = bindingOwner || this,
        key      = directive.key

    if (directive.isExp) {
        // expression bindings are always created on current compiler
        binding = compiler.createBinding(key, directive)
    } else {
        // recursively locate which compiler owns the binding
        while (compiler) {
            if (compiler.hasKey(key)) {
                break
            } else {
                compiler = compiler.parent
            }
        }
        compiler = compiler || this
        binding = compiler.bindings[key] || compiler.createBinding(key)
    }
    binding.dirs.push(directive)
    directive.binding = binding

    var value = binding.val()
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(value)
    }
    // set initial value
    directive.$update(value, true)
}

/**
 *  Create binding and attach getter/setter for a key to the viewmodel object
 */
CompilerProto.createBinding = function (key, directive) {

    utils.log('  created binding: ' + key)

    var compiler = this,
        methods  = compiler.options.methods,
        isExp    = directive && directive.isExp,
        isFn     = (directive && directive.isFn) || (methods && methods[key]),
        bindings = compiler.bindings,
        computed = compiler.options.computed,
        binding  = new Binding(compiler, key, isExp, isFn)

    if (isExp) {
        // expression bindings are anonymous
        compiler.defineExp(key, binding, directive)
    } else if (isFn) {
        bindings[key] = binding
        compiler.defineVmProp(key, binding, methods[key])
    } else {
        bindings[key] = binding
        if (binding.root) {
            // this is a root level binding. we need to define getter/setters for it.
            if (computed && computed[key]) {
                // computed property
                compiler.defineComputed(key, binding, computed[key])
            } else if (key.charAt(0) !== '$') {
                // normal property
                compiler.defineDataProp(key, binding)
            } else {
                // properties that start with $ are meta properties
                // they should be kept on the vm but not in the data object.
                compiler.defineVmProp(key, binding, compiler.data[key])
                delete compiler.data[key]
            }
        } else if (computed && computed[utils.baseKey(key)]) {
            // nested path on computed property
            compiler.defineExp(key, binding)
        } else {
            // ensure path in data so that computed properties that
            // access the path don't throw an error and can collect
            // dependencies
            Observer.ensurePath(compiler.data, key)
            var parentKey = key.slice(0, key.lastIndexOf('.'))
            if (!bindings[parentKey]) {
                // this is a nested value binding, but the binding for its parent
                // has not been created yet. We better create that one too.
                compiler.createBinding(parentKey)
            }
        }
    }
    return binding
}

/**
 *  Define the getter/setter to proxy a root-level
 *  data property on the VM
 */
CompilerProto.defineDataProp = function (key, binding) {
    var compiler = this,
        data     = compiler.data,
        ob       = data.__emitter__

    // make sure the key is present in data
    // so it can be observed
    if (!(hasOwn.call(data, key))) {
        data[key] = undefined
    }

    // if the data object is already observed, but the key
    // is not observed, we need to add it to the observed keys.
    if (ob && !(hasOwn.call(ob.values, key))) {
        Observer.convertKey(data, key)
    }

    binding.value = data[key]

    def(compiler.vm, key, {
        get: function () {
            return compiler.data[key]
        },
        set: function (val) {
            compiler.data[key] = val
        }
    })
}

/**
 *  Define a vm property, e.g. $index, $key, or mixin methods
 *  which are bindable but only accessible on the VM,
 *  not in the data.
 */
CompilerProto.defineVmProp = function (key, binding, value) {
    var ob = this.observer
    binding.value = value
    def(this.vm, key, {
        get: function () {
            if (Observer.shouldGet) ob.emit('get', key)
            return binding.value
        },
        set: function (val) {
            ob.emit('set', key, val)
        }
    })
}

/**
 *  Define an expression binding, which is essentially
 *  an anonymous computed property
 */
CompilerProto.defineExp = function (key, binding, directive) {
    var computedKey = directive && directive.computedKey,
        exp         = computedKey ? directive.expression : key,
        getter      = this.expCache[exp]
    if (!getter) {
        getter = this.expCache[exp] = ExpParser.parse(computedKey || key, this)
    }
    if (getter) {
        this.markComputed(binding, getter)
    }
}

/**
 *  Define a computed property on the VM
 */
CompilerProto.defineComputed = function (key, binding, value) {
    this.markComputed(binding, value)
    def(this.vm, key, {
        get: binding.value.$get,
        set: binding.value.$set
    })
}

/**
 *  Process a computed property binding
 *  so its getter/setter are bound to proper context
 */
CompilerProto.markComputed = function (binding, value) {
    binding.isComputed = true
    // bind the accessors to the vm
    if (binding.isFn) {
        binding.value = value
    } else {
        if (typeof value === 'function') {
            value = { $get: value }
        }
        binding.value = {
            $get: utils.bind(value.$get, this.vm),
            $set: value.$set
                ? utils.bind(value.$set, this.vm)
                : undefined
        }
    }
    // keep track for dep parsing later
    this.computed.push(binding)
}

/**
 *  Retrive an option from the compiler
 */
CompilerProto.getOption = function (type, id, silent) {
    var opts = this.options,
        parent = this.parent,
        globalAssets = config.globalAssets,
        res = (opts[type] && opts[type][id]) || (
            parent
                ? parent.getOption(type, id, silent)
                : globalAssets[type] && globalAssets[type][id]
        )
    if (!res && !silent && typeof id === 'string') {
        utils.warn('Unknown ' + type.slice(0, -1) + ': ' + id)
    }
    return res
}

/**
 *  Emit lifecycle events to trigger hooks
 */
CompilerProto.execHook = function (event) {
    event = 'hook:' + event
    this.observer.emit(event)
    this.emitter.emit(event)
}

/**
 *  Check if a compiler's data contains a keypath
 */
CompilerProto.hasKey = function (key) {
    var baseKey = utils.baseKey(key)
    return hasOwn.call(this.data, baseKey) ||
        hasOwn.call(this.vm, baseKey)
}

/**
 *  Do a one-time eval of a string that potentially
 *  includes bindings. It accepts additional raw data
 *  because we need to dynamically resolve v-component
 *  before a childVM is even compiled...
 */
CompilerProto.eval = function (exp, data) {
    var parsed = TextParser.parseAttr(exp)
    return parsed
        ? ExpParser.eval(parsed, this, data)
        : exp
}

/**
 *  Resolve a Component constructor for an element
 *  with the data to be used
 */
CompilerProto.resolveComponent = function (node, data, test) {

    // late require to avoid circular deps
    ViewModel = ViewModel || require('./viewmodel')

    var exp     = utils.attr(node, 'component'),
        tagName = node.tagName,
        id      = this.eval(exp, data),
        tagId   = (tagName.indexOf('-') > 0 && tagName.toLowerCase()),
        Ctor    = this.getOption('components', id || tagId, true)

    if (id && !Ctor) {
        utils.warn('Unknown component: ' + id)
    }

    return test
        ? exp === ''
            ? ViewModel
            : Ctor
        : Ctor || ViewModel
}

/**
 *  Unbind and remove element
 */
CompilerProto.destroy = function (noRemove) {

    // avoid being called more than once
    // this is irreversible!
    if (this.destroyed) return

    var compiler = this,
        i, j, key, dir, dirs, binding,
        vm          = compiler.vm,
        el          = compiler.el,
        directives  = compiler.dirs,
        computed    = compiler.computed,
        bindings    = compiler.bindings,
        children    = compiler.children,
        parent      = compiler.parent

    compiler.execHook('beforeDestroy')

    // unobserve data
    Observer.unobserve(compiler.data, '', compiler.observer)

    // destroy all children
    // do not remove their elements since the parent
    // may have transitions and the children may not
    i = children.length
    while (i--) {
        children[i].destroy(true)
    }

    // unbind all direcitves
    i = directives.length
    while (i--) {
        dir = directives[i]
        // if this directive is an instance of an external binding
        // e.g. a directive that refers to a variable on the parent VM
        // we need to remove it from that binding's directives
        // * empty and literal bindings do not have binding.
        if (dir.binding && dir.binding.compiler !== compiler) {
            dirs = dir.binding.dirs
            if (dirs) {
                j = dirs.indexOf(dir)
                if (j > -1) dirs.splice(j, 1)
            }
        }
        dir.$unbind()
    }

    // unbind all computed, anonymous bindings
    i = computed.length
    while (i--) {
        computed[i].unbind()
    }

    // unbind all keypath bindings
    for (key in bindings) {
        binding = bindings[key]
        if (binding) {
            binding.unbind()
        }
    }

    // remove self from parent
    if (parent) {
        j = parent.children.indexOf(compiler)
        if (j > -1) parent.children.splice(j, 1)
    }

    // finally remove dom element
    if (!noRemove) {
        if (el === document.body) {
            el.innerHTML = ''
        } else {
            vm.$remove()
        }
    }
    el.vue_vm = null

    compiler.destroyed = true
    // emit destroy hook
    compiler.execHook('afterDestroy')

    // finally, unregister all listeners
    compiler.observer.off()
    compiler.emitter.off()
}

// Helpers --------------------------------------------------------------------

/**
 *  shorthand for getting root compiler
 */
function getRoot (compiler) {
    while (compiler.parent) {
        compiler = compiler.parent
    }
    return compiler
}

module.exports = Compiler
},{"./binding":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/binding.js","./config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js","./deps-parser":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/deps-parser.js","./directive":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directive.js","./emitter":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/emitter.js","./exp-parser":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/exp-parser.js","./observer":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/observer.js","./text-parser":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/text-parser.js","./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js":[function(require,module,exports){
var TextParser = require('./text-parser')

module.exports = {
    prefix         : 'v',
    debug          : false,
    silent         : false,
    enterClass     : 'v-enter',
    leaveClass     : 'v-leave',
    interpolate    : true
}

Object.defineProperty(module.exports, 'delimiters', {
    get: function () {
        return TextParser.delimiters
    },
    set: function (delimiters) {
        TextParser.setDelimiters(delimiters)
    }
})
},{"./text-parser":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/text-parser.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/deps-parser.js":[function(require,module,exports){
var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    Observer = require('./observer'),
    catcher  = new Emitter()

/**
 *  Auto-extract the dependencies of a computed property
 *  by recording the getters triggered when evaluating it.
 */
function catchDeps (binding) {
    if (binding.isFn) return
    utils.log('\n- ' + binding.key)
    var got = utils.hash()
    binding.deps = []
    catcher.on('get', function (dep) {
        var has = got[dep.key]
        if (
            // avoid duplicate bindings
            (has && has.compiler === dep.compiler) ||
            // avoid repeated items as dependency
            // only when the binding is from self or the parent chain
            (dep.compiler.repeat && !isParentOf(dep.compiler, binding.compiler))
        ) {
            return
        }
        got[dep.key] = dep
        utils.log('  - ' + dep.key)
        binding.deps.push(dep)
        dep.subs.push(binding)
    })
    binding.value.$get()
    catcher.off('get')
}

/**
 *  Test if A is a parent of or equals B
 */
function isParentOf (a, b) {
    while (b) {
        if (a === b) {
            return true
        }
        b = b.parent
    }
}

module.exports = {

    /**
     *  the observer that catches events triggered by getters
     */
    catcher: catcher,

    /**
     *  parse a list of computed property bindings
     */
    parse: function (bindings) {
        utils.log('\nparsing dependencies...')
        Observer.shouldGet = true
        bindings.forEach(catchDeps)
        Observer.shouldGet = false
        utils.log('\ndone.')
    }
    
}
},{"./emitter":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/emitter.js","./observer":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/observer.js","./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directive.js":[function(require,module,exports){
var dirId           = 1,
    ARG_RE          = /^[\w\$-]+$/,
    FILTER_TOKEN_RE = /[^\s'"]+|'[^']+'|"[^"]+"/g,
    NESTING_RE      = /^\$(parent|root)\./,
    SINGLE_VAR_RE   = /^[\w\.$]+$/,
    QUOTE_RE        = /"/g,
    TextParser      = require('./text-parser')

/**
 *  Directive class
 *  represents a single directive instance in the DOM
 */
function Directive (name, ast, definition, compiler, el) {

    this.id             = dirId++
    this.name           = name
    this.compiler       = compiler
    this.vm             = compiler.vm
    this.el             = el
    this.computeFilters = false
    this.key            = ast.key
    this.arg            = ast.arg
    this.expression     = ast.expression

    var isEmpty = this.expression === ''

    // mix in properties from the directive definition
    if (typeof definition === 'function') {
        this[isEmpty ? 'bind' : 'update'] = definition
    } else {
        for (var prop in definition) {
            this[prop] = definition[prop]
        }
    }

    // empty expression, we're done.
    if (isEmpty || this.isEmpty) {
        this.isEmpty = true
        return
    }

    if (TextParser.Regex.test(this.key)) {
        this.key = compiler.eval(this.key)
        if (this.isLiteral) {
            this.expression = this.key
        }
    }

    var filters = ast.filters,
        filter, fn, i, l, computed
    if (filters) {
        this.filters = []
        for (i = 0, l = filters.length; i < l; i++) {
            filter = filters[i]
            fn = this.compiler.getOption('filters', filter.name)
            if (fn) {
                filter.apply = fn
                this.filters.push(filter)
                if (fn.computed) {
                    computed = true
                }
            }
        }
    }

    if (!this.filters || !this.filters.length) {
        this.filters = null
    }

    if (computed) {
        this.computedKey = Directive.inlineFilters(this.key, this.filters)
        this.filters = null
    }

    this.isExp =
        computed ||
        !SINGLE_VAR_RE.test(this.key) ||
        NESTING_RE.test(this.key)

}

var DirProto = Directive.prototype

/**
 *  called when a new value is set 
 *  for computed properties, this will only be called once
 *  during initialization.
 */
DirProto.$update = function (value, init) {
    if (this.$lock) return
    if (init || value !== this.value || (value && typeof value === 'object')) {
        this.value = value
        if (this.update) {
            this.update(
                this.filters && !this.computeFilters
                    ? this.$applyFilters(value)
                    : value,
                init
            )
        }
    }
}

/**
 *  pipe the value through filters
 */
DirProto.$applyFilters = function (value) {
    var filtered = value, filter
    for (var i = 0, l = this.filters.length; i < l; i++) {
        filter = this.filters[i]
        filtered = filter.apply.apply(this.vm, [filtered].concat(filter.args))
    }
    return filtered
}

/**
 *  Unbind diretive
 */
DirProto.$unbind = function () {
    // this can be called before the el is even assigned...
    if (!this.el || !this.vm) return
    if (this.unbind) this.unbind()
    this.vm = this.el = this.binding = this.compiler = null
}

// Exposed static methods -----------------------------------------------------

/**
 *  Parse a directive string into an Array of
 *  AST-like objects representing directives
 */
Directive.parse = function (str) {

    var inSingle = false,
        inDouble = false,
        curly    = 0,
        square   = 0,
        paren    = 0,
        begin    = 0,
        argIndex = 0,
        dirs     = [],
        dir      = {},
        lastFilterIndex = 0,
        arg

    for (var c, i = 0, l = str.length; i < l; i++) {
        c = str.charAt(i)
        if (inSingle) {
            // check single quote
            if (c === "'") inSingle = !inSingle
        } else if (inDouble) {
            // check double quote
            if (c === '"') inDouble = !inDouble
        } else if (c === ',' && !paren && !curly && !square) {
            // reached the end of a directive
            pushDir()
            // reset & skip the comma
            dir = {}
            begin = argIndex = lastFilterIndex = i + 1
        } else if (c === ':' && !dir.key && !dir.arg) {
            // argument
            arg = str.slice(begin, i).trim()
            if (ARG_RE.test(arg)) {
                argIndex = i + 1
                dir.arg = arg
            }
        } else if (c === '|' && str.charAt(i + 1) !== '|' && str.charAt(i - 1) !== '|') {
            if (dir.key === undefined) {
                // first filter, end of key
                lastFilterIndex = i + 1
                dir.key = str.slice(argIndex, i).trim()
            } else {
                // already has filter
                pushFilter()
            }
        } else if (c === '"') {
            inDouble = true
        } else if (c === "'") {
            inSingle = true
        } else if (c === '(') {
            paren++
        } else if (c === ')') {
            paren--
        } else if (c === '[') {
            square++
        } else if (c === ']') {
            square--
        } else if (c === '{') {
            curly++
        } else if (c === '}') {
            curly--
        }
    }
    if (i === 0 || begin !== i) {
        pushDir()
    }

    function pushDir () {
        dir.expression = str.slice(begin, i).trim()
        if (dir.key === undefined) {
            dir.key = str.slice(argIndex, i).trim()
        } else if (lastFilterIndex !== begin) {
            pushFilter()
        }
        if (i === 0 || dir.key) {
            dirs.push(dir)
        }
    }

    function pushFilter () {
        var exp = str.slice(lastFilterIndex, i).trim(),
            filter
        if (exp) {
            filter = {}
            var tokens = exp.match(FILTER_TOKEN_RE)
            filter.name = tokens[0]
            filter.args = tokens.length > 1 ? tokens.slice(1) : null
        }
        if (filter) {
            (dir.filters = dir.filters || []).push(filter)
        }
        lastFilterIndex = i + 1
    }

    return dirs
}

/**
 *  Inline computed filters so they become part
 *  of the expression
 */
Directive.inlineFilters = function (key, filters) {
    var args, filter
    for (var i = 0, l = filters.length; i < l; i++) {
        filter = filters[i]
        args = filter.args
            ? ',"' + filter.args.map(escapeQuote).join('","') + '"'
            : ''
        key = 'this.$compiler.getOption("filters", "' +
                filter.name +
            '").call(this,' +
                key + args +
            ')'
    }
    return key
}

/**
 *  Convert double quotes to single quotes
 *  so they don't mess up the generated function body
 */
function escapeQuote (v) {
    return v.indexOf('"') > -1
        ? v.replace(QUOTE_RE, '\'')
        : v
}

module.exports = Directive
},{"./text-parser":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/text-parser.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/html.js":[function(require,module,exports){
var utils = require('../utils'),
    slice = [].slice

/**
 *  Binding for innerHTML
 */
module.exports = {

    bind: function () {
        // a comment node means this is a binding for
        // {{{ inline unescaped html }}}
        if (this.el.nodeType === 8) {
            // hold nodes
            this.nodes = []
        }
    },

    update: function (value) {
        value = utils.guard(value)
        if (this.nodes) {
            this.swap(value)
        } else {
            this.el.innerHTML = value
        }
    },

    swap: function (value) {
        var parent = this.el.parentNode,
            nodes  = this.nodes,
            i      = nodes.length
        // remove old nodes
        while (i--) {
            parent.removeChild(nodes[i])
        }
        // convert new value to a fragment
        var frag = utils.toFragment(value)
        // save a reference to these nodes so we can remove later
        this.nodes = slice.call(frag.childNodes)
        parent.insertBefore(frag, this.el)
    }
}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/if.js":[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Manages a conditional child VM
 */
module.exports = {

    bind: function () {
        
        this.parent = this.el.parentNode
        this.ref    = document.createComment('vue-if')
        this.Ctor   = this.compiler.resolveComponent(this.el)

        // insert ref
        this.parent.insertBefore(this.ref, this.el)
        this.parent.removeChild(this.el)

        if (utils.attr(this.el, 'view')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-view. ' +
                'Just set v-view\'s binding value to empty string to empty it.'
            )
        }
        if (utils.attr(this.el, 'repeat')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-repeat. ' +
                'Use `v-show` or the `filterBy` filter instead.'
            )
        }
    },

    update: function (value) {

        if (!value) {
            this.unbind()
        } else if (!this.childVM) {
            this.childVM = new this.Ctor({
                el: this.el.cloneNode(true),
                parent: this.vm
            })
            if (this.compiler.init) {
                this.parent.insertBefore(this.childVM.$el, this.ref)
            } else {
                this.childVM.$before(this.ref)
            }
        }
        
    },

    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
            this.childVM = null
        }
    }
}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/index.js":[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config'),
    transition = require('../transition'),
    directives = module.exports = utils.hash()

/**
 *  Nest and manage a Child VM
 */
directives.component = {
    isLiteral: true,
    bind: function () {
        if (!this.el.vue_vm) {
            this.childVM = new this.Ctor({
                el: this.el,
                parent: this.vm
            })
        }
    },
    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }
}

/**
 *  Binding HTML attributes
 */
directives.attr = {
    bind: function () {
        var params = this.vm.$options.paramAttributes
        this.isParam = params && params.indexOf(this.arg) > -1
    },
    update: function (value) {
        if (value || value === 0) {
            this.el.setAttribute(this.arg, value)
        } else {
            this.el.removeAttribute(this.arg)
        }
        if (this.isParam) {
            this.vm[this.arg] = utils.checkNumber(value)
        }
    }
}

/**
 *  Binding textContent
 */
directives.text = {
    bind: function () {
        this.attr = this.el.nodeType === 3
            ? 'nodeValue'
            : 'textContent'
    },
    update: function (value) {
        this.el[this.attr] = utils.guard(value)
    }
}

/**
 *  Binding CSS display property
 */
directives.show = function (value) {
    var el = this.el,
        target = value ? '' : 'none',
        change = function () {
            el.style.display = target
        }
    transition(el, value ? 1 : -1, change, this.compiler)
}

/**
 *  Binding CSS classes
 */
directives['class'] = function (value) {
    if (this.arg) {
        utils[value ? 'addClass' : 'removeClass'](this.el, this.arg)
    } else {
        if (this.lastVal) {
            utils.removeClass(this.el, this.lastVal)
        }
        if (value) {
            utils.addClass(this.el, value)
            this.lastVal = value
        }
    }
}

/**
 *  Only removed after the owner VM is ready
 */
directives.cloak = {
    isEmpty: true,
    bind: function () {
        var el = this.el
        this.compiler.observer.once('hook:ready', function () {
            el.removeAttribute(config.prefix + '-cloak')
        })
    }
}

/**
 *  Store a reference to self in parent VM's $
 */
directives.ref = {
    isLiteral: true,
    bind: function () {
        var id = this.expression
        if (id) {
            this.vm.$parent.$[id] = this.vm
        }
    },
    unbind: function () {
        var id = this.expression
        if (id) {
            delete this.vm.$parent.$[id]
        }
    }
}

directives.on      = require('./on')
directives.repeat  = require('./repeat')
directives.model   = require('./model')
directives['if']   = require('./if')
directives['with'] = require('./with')
directives.html    = require('./html')
directives.style   = require('./style')
directives.partial = require('./partial')
directives.view    = require('./view')
},{"../config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js","../transition":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/transition.js","../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js","./html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/html.js","./if":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/if.js","./model":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/model.js","./on":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/on.js","./partial":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/partial.js","./repeat":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/repeat.js","./style":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/style.js","./view":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/view.js","./with":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/with.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/model.js":[function(require,module,exports){
var utils = require('../utils'),
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0,
    filter = [].filter

/**
 *  Returns an array of values from a multiple select
 */
function getMultipleSelectOptions (select) {
    return filter
        .call(select.options, function (option) {
            return option.selected
        })
        .map(function (option) {
            return option.value || option.text
        })
}

/**
 *  Two-way binding for form input elements
 */
module.exports = {

    bind: function () {

        var self = this,
            el   = self.el,
            type = el.type,
            tag  = el.tagName

        self.lock = false
        self.ownerVM = self.binding.compiler.vm

        // determine what event to listen to
        self.event =
            (self.compiler.options.lazy ||
            tag === 'SELECT' ||
            type === 'checkbox' || type === 'radio')
                ? 'change'
                : 'input'

        // determine the attribute to change when updating
        self.attr = type === 'checkbox'
            ? 'checked'
            : (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')
                ? 'value'
                : 'innerHTML'

        // select[multiple] support
        if(tag === 'SELECT' && el.hasAttribute('multiple')) {
            this.multi = true
        }

        var compositionLock = false
        self.cLock = function () {
            compositionLock = true
        }
        self.cUnlock = function () {
            compositionLock = false
        }
        el.addEventListener('compositionstart', this.cLock)
        el.addEventListener('compositionend', this.cUnlock)

        // attach listener
        self.set = self.filters
            ? function () {
                if (compositionLock) return
                // if this directive has filters
                // we need to let the vm.$set trigger
                // update() so filters are applied.
                // therefore we have to record cursor position
                // so that after vm.$set changes the input
                // value we can put the cursor back at where it is
                var cursorPos
                try { cursorPos = el.selectionStart } catch (e) {}

                self._set()

                // since updates are async
                // we need to reset cursor position async too
                utils.nextTick(function () {
                    if (cursorPos !== undefined) {
                        el.setSelectionRange(cursorPos, cursorPos)
                    }
                })
            }
            : function () {
                if (compositionLock) return
                // no filters, don't let it trigger update()
                self.lock = true

                self._set()

                utils.nextTick(function () {
                    self.lock = false
                })
            }
        el.addEventListener(self.event, self.set)

        // fix shit for IE9
        // since it doesn't fire input on backspace / del / cut
        if (isIE9) {
            self.onCut = function () {
                // cut event fires before the value actually changes
                utils.nextTick(function () {
                    self.set()
                })
            }
            self.onDel = function (e) {
                if (e.keyCode === 46 || e.keyCode === 8) {
                    self.set()
                }
            }
            el.addEventListener('cut', self.onCut)
            el.addEventListener('keyup', self.onDel)
        }
    },

    _set: function () {
        this.ownerVM.$set(
            this.key, this.multi
                ? getMultipleSelectOptions(this.el)
                : this.el[this.attr]
        )
    },

    update: function (value, init) {
        /* jshint eqeqeq: false */
        // sync back inline value if initial data is undefined
        if (init && value === undefined) {
            return this._set()
        }
        if (this.lock) return
        var el = this.el
        if (el.tagName === 'SELECT') { // select dropdown
            el.selectedIndex = -1
            if(this.multi && Array.isArray(value)) {
                value.forEach(this.updateSelect, this)
            } else {
                this.updateSelect(value)
            }
        } else if (el.type === 'radio') { // radio button
            el.checked = value == el.value
        } else if (el.type === 'checkbox') { // checkbox
            el.checked = !!value
        } else {
            el[this.attr] = utils.guard(value)
        }
    },

    updateSelect: function (value) {
        /* jshint eqeqeq: false */
        // setting <select>'s value in IE9 doesn't work
        // we have to manually loop through the options
        var options = this.el.options,
            i = options.length
        while (i--) {
            if (options[i].value == value) {
                options[i].selected = true
                break
            }
        }
    },

    unbind: function () {
        var el = this.el
        el.removeEventListener(this.event, this.set)
        el.removeEventListener('compositionstart', this.cLock)
        el.removeEventListener('compositionend', this.cUnlock)
        if (isIE9) {
            el.removeEventListener('cut', this.onCut)
            el.removeEventListener('keyup', this.onDel)
        }
    }
}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/on.js":[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Binding for event listeners
 */
module.exports = {

    isFn: true,

    bind: function () {
        this.context = this.binding.isExp
            ? this.vm
            : this.binding.compiler.vm
        if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
            var self = this
            this.iframeBind = function () {
                self.el.contentWindow.addEventListener(self.arg, self.handler)
            }
            this.el.addEventListener('load', this.iframeBind)
        }
    },

    update: function (handler) {
        if (typeof handler !== 'function') {
            utils.warn('Directive "v-on:' + this.expression + '" expects a method.')
            return
        }
        this.reset()
        var vm = this.vm,
            context = this.context
        this.handler = function (e) {
            e.targetVM = vm
            context.$event = e
            var res = handler.call(context, e)
            context.$event = null
            return res
        }
        if (this.iframeBind) {
            this.iframeBind()
        } else {
            this.el.addEventListener(this.arg, this.handler)
        }
    },

    reset: function () {
        var el = this.iframeBind
            ? this.el.contentWindow
            : this.el
        if (this.handler) {
            el.removeEventListener(this.arg, this.handler)
        }
    },

    unbind: function () {
        this.reset()
        this.el.removeEventListener('load', this.iframeBind)
    }
}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/partial.js":[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for partials
 */
module.exports = {

    isLiteral: true,

    bind: function () {

        var id = this.expression
        if (!id) return

        var el       = this.el,
            compiler = this.compiler,
            partial  = compiler.getOption('partials', id)

        if (!partial) {
            if (id === 'yield') {
                utils.warn('{{>yield}} syntax has been deprecated. Use <content> tag instead.')
            }
            return
        }

        partial = partial.cloneNode(true)

        // comment ref node means inline partial
        if (el.nodeType === 8) {

            // keep a ref for the partial's content nodes
            var nodes = [].slice.call(partial.childNodes),
                parent = el.parentNode
            parent.insertBefore(partial, el)
            parent.removeChild(el)
            // compile partial after appending, because its children's parentNode
            // will change from the fragment to the correct parentNode.
            // This could affect directives that need access to its element's parentNode.
            nodes.forEach(compiler.compile, compiler)

        } else {

            // just set innerHTML...
            el.innerHTML = ''
            el.appendChild(partial)

        }
    }

}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/repeat.js":[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config')

/**
 *  Binding that manages VMs based on an Array
 */
module.exports = {

    bind: function () {

        this.identifier = '$r' + this.id

        // a hash to cache the same expressions on repeated instances
        // so they don't have to be compiled for every single instance
        this.expCache = utils.hash()

        var el   = this.el,
            ctn  = this.container = el.parentNode

        // extract child Id, if any
        this.childId = this.compiler.eval(utils.attr(el, 'ref'))

        // create a comment node as a reference node for DOM insertions
        this.ref = document.createComment(config.prefix + '-repeat-' + this.key)
        ctn.insertBefore(this.ref, el)
        ctn.removeChild(el)

        this.collection = null
        this.vms = null

    },

    update: function (collection) {

        if (!Array.isArray(collection)) {
            if (utils.isObject(collection)) {
                collection = utils.objectToArray(collection)
            } else {
                utils.warn('v-repeat only accepts Array or Object values.')
            }
        }

        // keep reference of old data and VMs
        // so we can reuse them if possible
        this.oldVMs = this.vms
        this.oldCollection = this.collection
        collection = this.collection = collection || []

        var isObject = collection[0] && utils.isObject(collection[0])
        this.vms = this.oldCollection
            ? this.diff(collection, isObject)
            : this.init(collection, isObject)

        if (this.childId) {
            this.vm.$[this.childId] = this.vms
        }

    },

    init: function (collection, isObject) {
        var vm, vms = []
        for (var i = 0, l = collection.length; i < l; i++) {
            vm = this.build(collection[i], i, isObject)
            vms.push(vm)
            if (this.compiler.init) {
                this.container.insertBefore(vm.$el, this.ref)
            } else {
                vm.$before(this.ref)
            }
        }
        return vms
    },

    /**
     *  Diff the new array with the old
     *  and determine the minimum amount of DOM manipulations.
     */
    diff: function (newCollection, isObject) {

        var i, l, item, vm,
            oldIndex,
            targetNext,
            currentNext,
            nextEl,
            ctn    = this.container,
            oldVMs = this.oldVMs,
            vms    = []

        vms.length = newCollection.length

        // first pass, collect new reused and new created
        for (i = 0, l = newCollection.length; i < l; i++) {
            item = newCollection[i]
            if (isObject) {
                item.$index = i
                if (item.__emitter__ && item.__emitter__[this.identifier]) {
                    // this piece of data is being reused.
                    // record its final position in reused vms
                    item.$reused = true
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            } else {
                // we can't attach an identifier to primitive values
                // so have to do an indexOf...
                oldIndex = indexOf(oldVMs, item)
                if (oldIndex > -1) {
                    // record the position on the existing vm
                    oldVMs[oldIndex].$reused = true
                    oldVMs[oldIndex].$data.$index = i
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            }
        }

        // second pass, collect old reused and destroy unused
        for (i = 0, l = oldVMs.length; i < l; i++) {
            vm = oldVMs[i]
            item = this.arg
                ? vm.$data[this.arg]
                : vm.$data
            if (item.$reused) {
                vm.$reused = true
                delete item.$reused
            }
            if (vm.$reused) {
                // update the index to latest
                vm.$index = item.$index
                // the item could have had a new key
                if (item.$key && item.$key !== vm.$key) {
                    vm.$key = item.$key
                }
                vms[vm.$index] = vm
            } else {
                // this one can be destroyed.
                if (item.__emitter__) {
                    delete item.__emitter__[this.identifier]
                }
                vm.$destroy()
            }
        }

        // final pass, move/insert DOM elements
        i = vms.length
        while (i--) {
            vm = vms[i]
            item = vm.$data
            targetNext = vms[i + 1]
            if (vm.$reused) {
                nextEl = vm.$el.nextSibling
                // destroyed VMs' element might still be in the DOM
                // due to transitions
                while (!nextEl.vue_vm && nextEl !== this.ref) {
                    nextEl = nextEl.nextSibling
                }
                currentNext = nextEl.vue_vm
                if (currentNext !== targetNext) {
                    if (!targetNext) {
                        ctn.insertBefore(vm.$el, this.ref)
                    } else {
                        nextEl = targetNext.$el
                        // new VMs' element might not be in the DOM yet
                        // due to transitions
                        while (!nextEl.parentNode) {
                            targetNext = vms[nextEl.vue_vm.$index + 1]
                            nextEl = targetNext
                                ? targetNext.$el
                                : this.ref
                        }
                        ctn.insertBefore(vm.$el, nextEl)
                    }
                }
                delete vm.$reused
                delete item.$index
                delete item.$key
            } else { // a new vm
                vm.$before(targetNext ? targetNext.$el : this.ref)
            }
        }

        return vms
    },

    build: function (data, index, isObject) {

        // wrap non-object values
        var raw, alias,
            wrap = !isObject || this.arg
        if (wrap) {
            raw = data
            alias = this.arg || '$value'
            data = {}
            data[alias] = raw
        }
        data.$index = index

        var el = this.el.cloneNode(true),
            Ctor = this.compiler.resolveComponent(el, data),
            vm = new Ctor({
                el: el,
                data: data,
                parent: this.vm,
                compilerOptions: {
                    repeat: true,
                    expCache: this.expCache
                }
            })

        if (isObject) {
            // attach an ienumerable identifier to the raw data
            (raw || data).__emitter__[this.identifier] = true
        }

        return vm

    },

    unbind: function () {
        if (this.childId) {
            delete this.vm.$[this.childId]
        }
        if (this.vms) {
            var i = this.vms.length
            while (i--) {
                this.vms[i].$destroy()
            }
        }
    }
}

// Helpers --------------------------------------------------------------------

/**
 *  Find an object or a wrapped data object
 *  from an Array
 */
function indexOf (vms, obj) {
    for (var vm, i = 0, l = vms.length; i < l; i++) {
        vm = vms[i]
        if (!vm.$reused && vm.$value === obj) {
            return i
        }
    }
    return -1
}
},{"../config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js","../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/style.js":[function(require,module,exports){
var prefixes = ['-webkit-', '-moz-', '-ms-']

/**
 *  Binding for CSS styles
 */
module.exports = {

    bind: function () {
        var prop = this.arg
        if (!prop) return
        if (prop.charAt(0) === '$') {
            // properties that start with $ will be auto-prefixed
            prop = prop.slice(1)
            this.prefixed = true
        }
        this.prop = prop
    },

    update: function (value) {
        var prop = this.prop,
            isImportant
        /* jshint eqeqeq: true */
        // cast possible numbers/booleans into strings
        if (value != null) value += ''
        if (prop) {
            if (value) {
                isImportant = value.slice(-10) === '!important'
                    ? 'important'
                    : ''
                if (isImportant) {
                    value = value.slice(0, -10).trim()
                }
            }
            this.el.style.setProperty(prop, value, isImportant)
            if (this.prefixed) {
                var i = prefixes.length
                while (i--) {
                    this.el.style.setProperty(prefixes[i] + prop, value, isImportant)
                }
            }
        } else {
            this.el.style.cssText = value
        }
    }

}
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/view.js":[function(require,module,exports){
/**
 *  Manages a conditional child VM using the
 *  binding's value as the component ID.
 */
module.exports = {

    bind: function () {

        // track position in DOM with a ref node
        var el       = this.raw = this.el,
            parent   = el.parentNode,
            ref      = this.ref = document.createComment('v-view')
        parent.insertBefore(ref, el)
        parent.removeChild(el)

        // cache original content
        /* jshint boss: true */
        var node,
            frag = this.inner = document.createElement('div')
        while (node = el.firstChild) {
            frag.appendChild(node)
        }

    },

    update: function(value) {

        this.unbind()

        var Ctor  = this.compiler.getOption('components', value)
        if (!Ctor) return

        this.childVM = new Ctor({
            el: this.raw.cloneNode(true),
            parent: this.vm,
            compilerOptions: {
                rawContent: this.inner.cloneNode(true)
            }
        })

        this.el = this.childVM.$el
        if (this.compiler.init) {
            this.ref.parentNode.insertBefore(this.el, this.ref)
        } else {
            this.childVM.$before(this.ref)
        }

    },

    unbind: function() {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }

}
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/with.js":[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for inheriting data from parent VMs.
 */
module.exports = {

    bind: function () {

        var self      = this,
            childKey  = self.arg,
            parentKey = self.key,
            compiler  = self.compiler,
            owner     = self.binding.compiler

        if (compiler === owner) {
            this.alone = true
            return
        }

        if (childKey) {
            if (!compiler.bindings[childKey]) {
                compiler.createBinding(childKey)
            }
            // sync changes on child back to parent
            compiler.observer.on('change:' + childKey, function (val) {
                if (compiler.init) return
                if (!self.lock) {
                    self.lock = true
                    utils.nextTick(function () {
                        self.lock = false
                    })
                }
                owner.vm.$set(parentKey, val)
            })
        }
    },

    update: function (value) {
        // sync from parent
        if (!this.alone && !this.lock) {
            if (this.arg) {
                this.vm.$set(this.arg, value)
            } else if (this.vm.$data !== value) {
                this.vm.$data = value
            }
        }
    }

}
},{"../utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/emitter.js":[function(require,module,exports){
var slice = [].slice

function Emitter (ctx) {
    this._ctx = ctx || this
}

var EmitterProto = Emitter.prototype

EmitterProto.on = function (event, fn) {
    this._cbs = this._cbs || {}
    ;(this._cbs[event] = this._cbs[event] || [])
        .push(fn)
    return this
}

EmitterProto.once = function (event, fn) {
    var self = this
    this._cbs = this._cbs || {}

    function on () {
        self.off(event, on)
        fn.apply(this, arguments)
    }

    on.fn = fn
    this.on(event, on)
    return this
}

EmitterProto.off = function (event, fn) {
    this._cbs = this._cbs || {}

    // all
    if (!arguments.length) {
        this._cbs = {}
        return this
    }

    // specific event
    var callbacks = this._cbs[event]
    if (!callbacks) return this

    // remove all handlers
    if (arguments.length === 1) {
        delete this._cbs[event]
        return this
    }

    // remove specific handler
    var cb
    for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i]
        if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1)
            break
        }
    }
    return this
}

/**
 *  The internal, faster emit with fixed amount of arguments
 *  using Function.call
 */
EmitterProto.emit = function (event, a, b, c) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event]

    if (callbacks) {
        callbacks = callbacks.slice(0)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].call(this._ctx, a, b, c)
        }
    }

    return this
}

/**
 *  The external emit using Function.apply
 */
EmitterProto.applyEmit = function (event) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event], args

    if (callbacks) {
        callbacks = callbacks.slice(0)
        args = slice.call(arguments, 1)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(this._ctx, args)
        }
    }

    return this
}

module.exports = Emitter
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/exp-parser.js":[function(require,module,exports){
var utils           = require('./utils'),
    STR_SAVE_RE     = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
    STR_RESTORE_RE  = /"(\d+)"/g,
    NEWLINE_RE      = /\n/g,
    CTOR_RE         = new RegExp('constructor'.split('').join('[\'"+, ]*')),
    UNICODE_RE      = /\\u\d\d\d\d/

// Variable extraction scooped from https://github.com/RubyLouvre/avalon

var KEYWORDS =
        // keywords
        'break,case,catch,continue,debugger,default,delete,do,else,false' +
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
        ',throw,true,try,typeof,var,void,while,with,undefined' +
        // reserved
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
        ',final,float,goto,implements,import,int,interface,long,native' +
        ',package,private,protected,public,short,static,super,synchronized' +
        ',throws,transient,volatile' +
        // ECMA 5 - use strict
        ',arguments,let,yield' +
        // allow using Math in expressions
        ',Math',
        
    KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g'),
    REMOVE_RE   = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+|[\{,]\s*[\w\$_]+\s*:/g,
    SPLIT_RE    = /[^\w$]+/g,
    NUMBER_RE   = /\b\d[^,]*/g,
    BOUNDARY_RE = /^,+|,+$/g

/**
 *  Strip top level variable names from a snippet of JS expression
 */
function getVariables (code) {
    code = code
        .replace(REMOVE_RE, '')
        .replace(SPLIT_RE, ',')
        .replace(KEYWORDS_RE, '')
        .replace(NUMBER_RE, '')
        .replace(BOUNDARY_RE, '')
    return code
        ? code.split(/,+/)
        : []
}

/**
 *  A given path could potentially exist not on the
 *  current compiler, but up in the parent chain somewhere.
 *  This function generates an access relationship string
 *  that can be used in the getter function by walking up
 *  the parent chain to check for key existence.
 *
 *  It stops at top parent if no vm in the chain has the
 *  key. It then creates any missing bindings on the
 *  final resolved vm.
 */
function traceScope (path, compiler, data) {
    var rel  = '',
        dist = 0,
        self = compiler

    if (data && utils.get(data, path) !== undefined) {
        // hack: temporarily attached data
        return '$temp.'
    }

    while (compiler) {
        if (compiler.hasKey(path)) {
            break
        } else {
            compiler = compiler.parent
            dist++
        }
    }
    if (compiler) {
        while (dist--) {
            rel += '$parent.'
        }
        if (!compiler.bindings[path] && path.charAt(0) !== '$') {
            compiler.createBinding(path)
        }
    } else {
        self.createBinding(path)
    }
    return rel
}

/**
 *  Create a function from a string...
 *  this looks like evil magic but since all variables are limited
 *  to the VM's data it's actually properly sandboxed
 */
function makeGetter (exp, raw) {
    var fn
    try {
        fn = new Function(exp)
    } catch (e) {
        utils.warn('Error parsing expression: ' + raw)
    }
    return fn
}

/**
 *  Escape a leading dollar sign for regex construction
 */
function escapeDollar (v) {
    return v.charAt(0) === '$'
        ? '\\' + v
        : v
}

/**
 *  Parse and return an anonymous computed property getter function
 *  from an arbitrary expression, together with a list of paths to be
 *  created as bindings.
 */
exports.parse = function (exp, compiler, data) {
    // unicode and 'constructor' are not allowed for XSS security.
    if (UNICODE_RE.test(exp) || CTOR_RE.test(exp)) {
        utils.warn('Unsafe expression: ' + exp)
        return
    }
    // extract variable names
    var vars = getVariables(exp)
    if (!vars.length) {
        return makeGetter('return ' + exp, exp)
    }
    vars = utils.unique(vars)

    var accessors = '',
        has       = utils.hash(),
        strings   = [],
        // construct a regex to extract all valid variable paths
        // ones that begin with "$" are particularly tricky
        // because we can't use \b for them
        pathRE = new RegExp(
            "[^$\\w\\.](" +
            vars.map(escapeDollar).join('|') +
            ")[$\\w\\.]*\\b", 'g'
        ),
        body = (' ' + exp)
            .replace(STR_SAVE_RE, saveStrings)
            .replace(pathRE, replacePath)
            .replace(STR_RESTORE_RE, restoreStrings)

    body = accessors + 'return ' + body

    function saveStrings (str) {
        var i = strings.length
        // escape newlines in strings so the expression
        // can be correctly evaluated
        strings[i] = str.replace(NEWLINE_RE, '\\n')
        return '"' + i + '"'
    }

    function replacePath (path) {
        // keep track of the first char
        var c = path.charAt(0)
        path = path.slice(1)
        var val = 'this.' + traceScope(path, compiler, data) + path
        if (!has[path]) {
            accessors += val + ';'
            has[path] = 1
        }
        // don't forget to put that first char back
        return c + val
    }

    function restoreStrings (str, i) {
        return strings[i]
    }

    return makeGetter(body, exp)
}

/**
 *  Evaluate an expression in the context of a compiler.
 *  Accepts additional data.
 */
exports.eval = function (exp, compiler, data) {
    var getter = exports.parse(exp, compiler, data), res
    if (getter) {
        // hack: temporarily attach the additional data so
        // it can be accessed in the getter
        compiler.vm.$temp = data
        res = getter.call(compiler.vm)
        delete compiler.vm.$temp
    }
    return res
}
},{"./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/filters.js":[function(require,module,exports){
var utils    = require('./utils'),
    get      = utils.get,
    slice    = [].slice,
    QUOTE_RE = /^'.*'$/,
    filters  = module.exports = utils.hash()

/**
 *  'abc' => 'Abc'
 */
filters.capitalize = function (value) {
    if (!value && value !== 0) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 *  'abc' => 'ABC'
 */
filters.uppercase = function (value) {
    return (value || value === 0)
        ? value.toString().toUpperCase()
        : ''
}

/**
 *  'AbC' => 'abc'
 */
filters.lowercase = function (value) {
    return (value || value === 0)
        ? value.toString().toLowerCase()
        : ''
}

/**
 *  12345 => $12,345.00
 */
filters.currency = function (value, sign) {
    value = parseFloat(value)
    if (!value && value !== 0) return ''
    sign = sign || '$'
    var s = Math.floor(value).toString(),
        i = s.length % 3,
        h = i > 0 ? (s.slice(0, i) + (s.length > 3 ? ',' : '')) : '',
        f = '.' + value.toFixed(2).slice(-2)
    return sign + h + s.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + f
}

/**
 *  args: an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */
filters.pluralize = function (value) {
    var args = slice.call(arguments, 1)
    return args.length > 1
        ? (args[value - 1] || args[args.length - 1])
        : (args[value - 1] || args[0] + 's')
}

/**
 *  A special filter that takes a handler function,
 *  wraps it so it only gets triggered on specific keypresses.
 *
 *  v-on only
 */

var keyCodes = {
    enter    : 13,
    tab      : 9,
    'delete' : 46,
    up       : 38,
    left     : 37,
    right    : 39,
    down     : 40,
    esc      : 27
}

filters.key = function (handler, key) {
    if (!handler) return
    var code = keyCodes[key]
    if (!code) {
        code = parseInt(key, 10)
    }
    return function (e) {
        if (e.keyCode === code) {
            return handler.call(this, e)
        }
    }
}

/**
 *  Filter filter for v-repeat
 */
filters.filterBy = function (arr, searchKey, delimiter, dataKey) {

    // allow optional `in` delimiter
    // because why not
    if (delimiter && delimiter !== 'in') {
        dataKey = delimiter
    }

    // get the search string
    var search = stripQuotes(searchKey) || this.$get(searchKey)
    if (!search) return arr
    search = search.toLowerCase()

    // get the optional dataKey
    dataKey = dataKey && (stripQuotes(dataKey) || this.$get(dataKey))

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    return arr.filter(function (item) {
        return dataKey
            ? contains(get(item, dataKey), search)
            : contains(item, search)
    })

}

filters.filterBy.computed = true

/**
 *  Sort fitler for v-repeat
 */
filters.orderBy = function (arr, sortKey, reverseKey) {

    var key = stripQuotes(sortKey) || this.$get(sortKey)
    if (!key) return arr

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    var order = 1
    if (reverseKey) {
        if (reverseKey === '-1') {
            order = -1
        } else if (reverseKey.charAt(0) === '!') {
            reverseKey = reverseKey.slice(1)
            order = this.$get(reverseKey) ? 1 : -1
        } else {
            order = this.$get(reverseKey) ? -1 : 1
        }
    }

    // sort on a copy to avoid mutating original array
    return arr.slice().sort(function (a, b) {
        a = get(a, key)
        b = get(b, key)
        return a === b ? 0 : a > b ? order : -order
    })

}

filters.orderBy.computed = true

// Array filter helpers -------------------------------------------------------

/**
 *  String contain helper
 */
function contains (val, search) {
    /* jshint eqeqeq: false */
    if (utils.isObject(val)) {
        for (var key in val) {
            if (contains(val[key], search)) {
                return true
            }
        }
    } else if (val != null) {
        return val.toString().toLowerCase().indexOf(search) > -1
    }
}

/**
 *  Test whether a string is in quotes,
 *  if yes return stripped string
 */
function stripQuotes (str) {
    if (QUOTE_RE.test(str)) {
        return str.slice(1, -1)
    }
}
},{"./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/fragment.js":[function(require,module,exports){
// string -> DOM conversion
// wrappers originally from jQuery, scooped from component/domify
var map = {
    legend   : [1, '<fieldset>', '</fieldset>'],
    tr       : [2, '<table><tbody>', '</tbody></table>'],
    col      : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    _default : [0, '', '']
}

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>']

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>']

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>']

var TAG_RE = /<([\w:]+)/

module.exports = function (templateString) {
    var frag = document.createDocumentFragment(),
        m = TAG_RE.exec(templateString)
    // text only
    if (!m) {
        frag.appendChild(document.createTextNode(templateString))
        return frag
    }

    var tag = m[1],
        wrap = map[tag] || map._default,
        depth = wrap[0],
        prefix = wrap[1],
        suffix = wrap[2],
        node = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) node = node.lastChild

    // one element
    if (node.firstChild === node.lastChild) {
        frag.appendChild(node.firstChild)
        return frag
    }

    // multiple nodes, return a fragment
    var child
    /* jshint boss: true */
    while (child = node.firstChild) {
        if (node.nodeType === 1) {
            frag.appendChild(child)
        }
    }
    return frag
}
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js":[function(require,module,exports){
var config      = require('./config'),
    ViewModel   = require('./viewmodel'),
    utils       = require('./utils'),
    makeHash    = utils.hash,
    assetTypes  = ['directive', 'filter', 'partial', 'effect', 'component'],
    // Internal modules that are exposed for plugins
    pluginAPI   = {
        utils: utils,
        config: config,
        transition: require('./transition'),
        observer: require('./observer')
    }

ViewModel.options = config.globalAssets = {
    directives  : require('./directives'),
    filters     : require('./filters'),
    partials    : makeHash(),
    effects     : makeHash(),
    components  : makeHash()
}

/**
 *  Expose asset registration methods
 */
assetTypes.forEach(function (type) {
    ViewModel[type] = function (id, value) {
        var hash = this.options[type + 's']
        if (!hash) {
            hash = this.options[type + 's'] = makeHash()
        }
        if (!value) return hash[id]
        if (type === 'partial') {
            value = utils.parseTemplateOption(value)
        } else if (type === 'component') {
            value = utils.toConstructor(value)
        } else if (type === 'filter') {
            utils.checkFilter(value)
        }
        hash[id] = value
        return this
    }
})

/**
 *  Set config options
 */
ViewModel.config = function (opts, val) {
    if (typeof opts === 'string') {
        if (val === undefined) {
            return config[opts]
        } else {
            config[opts] = val
        }
    } else {
        utils.extend(config, opts)
    }
    return this
}

/**
 *  Expose an interface for plugins
 */
ViewModel.use = function (plugin) {
    if (typeof plugin === 'string') {
        try {
            plugin = require(plugin)
        } catch (e) {
            utils.warn('Cannot find plugin: ' + plugin)
            return
        }
    }

    // additional parameters
    var args = [].slice.call(arguments, 1)
    args.unshift(this)

    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else {
        plugin.apply(null, args)
    }
    return this
}

/**
 *  Expose internal modules for plugins
 */
ViewModel.require = function (module) {
    return pluginAPI[module]
}

ViewModel.extend = extend
ViewModel.nextTick = utils.nextTick

/**
 *  Expose the main ViewModel class
 *  and add extend method
 */
function extend (options) {

    var ParentVM = this

    // extend data options need to be copied
    // on instantiation
    if (options.data) {
        options.defaultData = options.data
        delete options.data
    }

    // inherit options
    // but only when the super class is not the native Vue.
    if (ParentVM !== ViewModel) {
        options = inheritOptions(options, ParentVM.options, true)
    }
    utils.processOptions(options)

    var ExtendedVM = function (opts, asParent) {
        if (!asParent) {
            opts = inheritOptions(opts, options, true)
        }
        ParentVM.call(this, opts, true)
    }

    // inherit prototype props
    var proto = ExtendedVM.prototype = Object.create(ParentVM.prototype)
    utils.defProtected(proto, 'constructor', ExtendedVM)

    // allow extended VM to be further extended
    ExtendedVM.extend  = extend
    ExtendedVM.super   = ParentVM
    ExtendedVM.options = options

    // allow extended VM to add its own assets
    assetTypes.forEach(function (type) {
        ExtendedVM[type] = ViewModel[type]
    })

    // allow extended VM to use plugins
    ExtendedVM.use     = ViewModel.use
    ExtendedVM.require = ViewModel.require

    return ExtendedVM
}

/**
 *  Inherit options
 *
 *  For options such as `data`, `vms`, `directives`, 'partials',
 *  they should be further extended. However extending should only
 *  be done at top level.
 *  
 *  `proto` is an exception because it's handled directly on the
 *  prototype.
 *
 *  `el` is an exception because it's not allowed as an
 *  extension option, but only as an instance option.
 */
function inheritOptions (child, parent, topLevel) {
    child = child || {}
    if (!parent) return child
    for (var key in parent) {
        if (key === 'el') continue
        var val = child[key],
            parentVal = parent[key]
        if (topLevel && typeof val === 'function' && parentVal) {
            // merge hook functions into an array
            child[key] = [val]
            if (Array.isArray(parentVal)) {
                child[key] = child[key].concat(parentVal)
            } else {
                child[key].push(parentVal)
            }
        } else if (
            topLevel &&
            (utils.isTrueObject(val) || utils.isTrueObject(parentVal))
            && !(parentVal instanceof ViewModel)
        ) {
            // merge toplevel object options
            child[key] = inheritOptions(val, parentVal)
        } else if (val === undefined) {
            // inherit if child doesn't override
            child[key] = parentVal
        }
    }
    return child
}

module.exports = ViewModel
},{"./config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js","./directives":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directives/index.js","./filters":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/filters.js","./observer":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/observer.js","./transition":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/transition.js","./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/observer.js":[function(require,module,exports){
/* jshint proto:true */

var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    // cache methods
    def      = utils.defProtected,
    isObject = utils.isObject,
    isArray  = Array.isArray,
    hasOwn   = ({}).hasOwnProperty,
    oDef     = Object.defineProperty,
    slice    = [].slice,
    // fix for IE + __proto__ problem
    // define methods as inenumerable if __proto__ is present,
    // otherwise enumerable so we can loop through and manually
    // attach to array instances
    hasProto = ({}).__proto__

// Array Mutation Handlers & Augmentations ------------------------------------

// The proxy prototype to replace the __proto__ of
// an observed array
var ArrayProxy = Object.create(Array.prototype)

// intercept mutation methods
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(watchMutation)

// Augment the ArrayProxy with convenience methods
def(ArrayProxy, '$set', function (index, data) {
    return this.splice(index, 1, data)[0]
}, !hasProto)

def(ArrayProxy, '$remove', function (index) {
    if (typeof index !== 'number') {
        index = this.indexOf(index)
    }
    if (index > -1) {
        return this.splice(index, 1)[0]
    }
}, !hasProto)

/**
 *  Intercep a mutation event so we can emit the mutation info.
 *  we also analyze what elements are added/removed and link/unlink
 *  them with the parent Array.
 */
function watchMutation (method) {
    def(ArrayProxy, method, function () {

        var args = slice.call(arguments),
            result = Array.prototype[method].apply(this, args),
            inserted, removed

        // determine new / removed elements
        if (method === 'push' || method === 'unshift') {
            inserted = args
        } else if (method === 'pop' || method === 'shift') {
            removed = [result]
        } else if (method === 'splice') {
            inserted = args.slice(2)
            removed = result
        }
        
        // link & unlink
        linkArrayElements(this, inserted)
        unlinkArrayElements(this, removed)

        // emit the mutation event
        this.__emitter__.emit('mutate', '', this, {
            method   : method,
            args     : args,
            result   : result,
            inserted : inserted,
            removed  : removed
        })

        return result
        
    }, !hasProto)
}

/**
 *  Link new elements to an Array, so when they change
 *  and emit events, the owner Array can be notified.
 */
function linkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item, owners
        while (i--) {
            item = items[i]
            if (isWatchable(item)) {
                // if object is not converted for observing
                // convert it...
                if (!item.__emitter__) {
                    convert(item)
                    watch(item)
                }
                owners = item.__emitter__.owners
                if (owners.indexOf(arr) < 0) {
                    owners.push(arr)
                }
            }
        }
    }
}

/**
 *  Unlink removed elements from the ex-owner Array.
 */
function unlinkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item
        while (i--) {
            item = items[i]
            if (item && item.__emitter__) {
                var owners = item.__emitter__.owners
                if (owners) owners.splice(owners.indexOf(arr))
            }
        }
    }
}

// Object add/delete key augmentation -----------------------------------------

var ObjProxy = Object.create(Object.prototype)

def(ObjProxy, '$add', function (key, val) {
    if (hasOwn.call(this, key)) return
    this[key] = val
    convertKey(this, key, true)
}, !hasProto)

def(ObjProxy, '$delete', function (key) {
    if (!(hasOwn.call(this, key))) return
    // trigger set events
    this[key] = undefined
    delete this[key]
    this.__emitter__.emit('delete', key)
}, !hasProto)

// Watch Helpers --------------------------------------------------------------

/**
 *  Check if a value is watchable
 */
function isWatchable (obj) {
    return typeof obj === 'object' && obj && !obj.$compiler
}

/**
 *  Convert an Object/Array to give it a change emitter.
 */
function convert (obj) {
    if (obj.__emitter__) return true
    var emitter = new Emitter()
    def(obj, '__emitter__', emitter)
    emitter
        .on('set', function (key, val, propagate) {
            if (propagate) propagateChange(obj)
        })
        .on('mutate', function () {
            propagateChange(obj)
        })
    emitter.values = utils.hash()
    emitter.owners = []
    return false
}

/**
 *  Propagate an array element's change to its owner arrays
 */
function propagateChange (obj) {
    var owners = obj.__emitter__.owners,
        i = owners.length
    while (i--) {
        owners[i].__emitter__.emit('set', '', '', true)
    }
}

/**
 *  Watch target based on its type
 */
function watch (obj) {
    if (isArray(obj)) {
        watchArray(obj)
    } else {
        watchObject(obj)
    }
}

/**
 *  Augment target objects with modified
 *  methods
 */
function augment (target, src) {
    if (hasProto) {
        target.__proto__ = src
    } else {
        for (var key in src) {
            def(target, key, src[key])
        }
    }
}

/**
 *  Watch an Object, recursive.
 */
function watchObject (obj) {
    augment(obj, ObjProxy)
    for (var key in obj) {
        convertKey(obj, key)
    }
}

/**
 *  Watch an Array, overload mutation methods
 *  and add augmentations by intercepting the prototype chain
 */
function watchArray (arr) {
    augment(arr, ArrayProxy)
    linkArrayElements(arr, arr)
}

/**
 *  Define accessors for a property on an Object
 *  so it emits get/set events.
 *  Then watch the value itself.
 */
function convertKey (obj, key, propagate) {
    var keyPrefix = key.charAt(0)
    if (keyPrefix === '$' || keyPrefix === '_') {
        return
    }
    // emit set on bind
    // this means when an object is observed it will emit
    // a first batch of set events.
    var emitter = obj.__emitter__,
        values  = emitter.values

    init(obj[key], propagate)

    oDef(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var value = values[key]
            // only emit get on tip values
            if (pub.shouldGet) {
                emitter.emit('get', key)
            }
            return value
        },
        set: function (newVal) {
            var oldVal = values[key]
            unobserve(oldVal, key, emitter)
            copyPaths(newVal, oldVal)
            // an immediate property should notify its parent
            // to emit set for itself too
            init(newVal, true)
        }
    })

    function init (val, propagate) {
        values[key] = val
        emitter.emit('set', key, val, propagate)
        if (isArray(val)) {
            emitter.emit('set', key + '.length', val.length, propagate)
        }
        observe(val, key, emitter)
    }
}

/**
 *  When a value that is already converted is
 *  observed again by another observer, we can skip
 *  the watch conversion and simply emit set event for
 *  all of its properties.
 */
function emitSet (obj) {
    var emitter = obj && obj.__emitter__
    if (!emitter) return
    if (isArray(obj)) {
        emitter.emit('set', 'length', obj.length)
    } else {
        var key, val
        for (key in obj) {
            val = obj[key]
            emitter.emit('set', key, val)
            emitSet(val)
        }
    }
}

/**
 *  Make sure all the paths in an old object exists
 *  in a new object.
 *  So when an object changes, all missing keys will
 *  emit a set event with undefined value.
 */
function copyPaths (newObj, oldObj) {
    if (!isObject(newObj) || !isObject(oldObj)) {
        return
    }
    var path, oldVal, newVal
    for (path in oldObj) {
        if (!(hasOwn.call(newObj, path))) {
            oldVal = oldObj[path]
            if (isArray(oldVal)) {
                newObj[path] = []
            } else if (isObject(oldVal)) {
                newVal = newObj[path] = {}
                copyPaths(newVal, oldVal)
            } else {
                newObj[path] = undefined
            }
        }
    }
}

/**
 *  walk along a path and make sure it can be accessed
 *  and enumerated in that object
 */
function ensurePath (obj, key) {
    var path = key.split('.'), sec
    for (var i = 0, d = path.length - 1; i < d; i++) {
        sec = path[i]
        if (!obj[sec]) {
            obj[sec] = {}
            if (obj.__emitter__) convertKey(obj, sec)
        }
        obj = obj[sec]
    }
    if (isObject(obj)) {
        sec = path[i]
        if (!(hasOwn.call(obj, sec))) {
            obj[sec] = undefined
            if (obj.__emitter__) convertKey(obj, sec)
        }
    }
}

// Main API Methods -----------------------------------------------------------

/**
 *  Observe an object with a given path,
 *  and proxy get/set/mutate events to the provided observer.
 */
function observe (obj, rawPath, observer) {

    if (!isWatchable(obj)) return

    var path = rawPath ? rawPath + '.' : '',
        alreadyConverted = convert(obj),
        emitter = obj.__emitter__

    // setup proxy listeners on the parent observer.
    // we need to keep reference to them so that they
    // can be removed when the object is un-observed.
    observer.proxies = observer.proxies || {}
    var proxies = observer.proxies[path] = {
        get: function (key) {
            observer.emit('get', path + key)
        },
        set: function (key, val, propagate) {
            if (key) observer.emit('set', path + key, val)
            // also notify observer that the object itself changed
            // but only do so when it's a immediate property. this
            // avoids duplicate event firing.
            if (rawPath && propagate) {
                observer.emit('set', rawPath, obj, true)
            }
        },
        mutate: function (key, val, mutation) {
            // if the Array is a root value
            // the key will be null
            var fixedPath = key ? path + key : rawPath
            observer.emit('mutate', fixedPath, val, mutation)
            // also emit set for Array's length when it mutates
            var m = mutation.method
            if (m !== 'sort' && m !== 'reverse') {
                observer.emit('set', fixedPath + '.length', val.length)
            }
        }
    }

    // attach the listeners to the child observer.
    // now all the events will propagate upwards.
    emitter
        .on('get', proxies.get)
        .on('set', proxies.set)
        .on('mutate', proxies.mutate)

    if (alreadyConverted) {
        // for objects that have already been converted,
        // emit set events for everything inside
        emitSet(obj)
    } else {
        watch(obj)
    }
}

/**
 *  Cancel observation, turn off the listeners.
 */
function unobserve (obj, path, observer) {

    if (!obj || !obj.__emitter__) return

    path = path ? path + '.' : ''
    var proxies = observer.proxies[path]
    if (!proxies) return

    // turn off listeners
    obj.__emitter__
        .off('get', proxies.get)
        .off('set', proxies.set)
        .off('mutate', proxies.mutate)

    // remove reference
    observer.proxies[path] = null
}

// Expose API -----------------------------------------------------------------

var pub = module.exports = {

    // whether to emit get events
    // only enabled during dependency parsing
    shouldGet   : false,

    observe     : observe,
    unobserve   : unobserve,
    ensurePath  : ensurePath,
    copyPaths   : copyPaths,
    watch       : watch,
    convert     : convert,
    convertKey  : convertKey
}
},{"./emitter":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/emitter.js","./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/template-parser.js":[function(require,module,exports){
var toFragment = require('./fragment');

/**
 * Parses a template string or node and normalizes it into a
 * a node that can be used as a partial of a template option
 *
 * Possible values include
 * id selector: '#some-template-id'
 * template string: '<div><span>my template</span></div>'
 * DocumentFragment object
 * Node object of type Template
 */
module.exports = function(template) {
    var templateNode;

    if (template instanceof window.DocumentFragment) {
        // if the template is already a document fragment -- do nothing
        return template
    }

    if (typeof template === 'string') {
        // template by ID
        if (template.charAt(0) === '#') {
            templateNode = document.getElementById(template.slice(1))
            if (!templateNode) return
        } else {
            return toFragment(template)
        }
    } else if (template.nodeType) {
        templateNode = template
    } else {
        return
    }

    // if its a template tag and the browser supports it,
    // its content is already a document fragment!
    if (templateNode.tagName === 'TEMPLATE' && templateNode.content) {
        return templateNode.content
    }

    if (templateNode.tagName === 'SCRIPT') {
        return toFragment(templateNode.innerHTML)
    }

    return toFragment(templateNode.outerHTML);
}

},{"./fragment":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/fragment.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/text-parser.js":[function(require,module,exports){
var openChar        = '{',
    endChar         = '}',
    ESCAPE_RE       = /[-.*+?^${}()|[\]\/\\]/g,
    // lazy require
    Directive

exports.Regex = buildInterpolationRegex()

function buildInterpolationRegex () {
    var open = escapeRegex(openChar),
        end  = escapeRegex(endChar)
    return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end)
}

function escapeRegex (str) {
    return str.replace(ESCAPE_RE, '\\$&')
}

function setDelimiters (delimiters) {
    openChar = delimiters[0]
    endChar = delimiters[1]
    exports.delimiters = delimiters
    exports.Regex = buildInterpolationRegex()
}

/** 
 *  Parse a piece of text, return an array of tokens
 *  token types:
 *  1. plain string
 *  2. object with key = binding key
 *  3. object with key & html = true
 */
function parse (text) {
    if (!exports.Regex.test(text)) return null
    var m, i, token, match, tokens = []
    /* jshint boss: true */
    while (m = text.match(exports.Regex)) {
        i = m.index
        if (i > 0) tokens.push(text.slice(0, i))
        token = { key: m[1].trim() }
        match = m[0]
        token.html =
            match.charAt(2) === openChar &&
            match.charAt(match.length - 3) === endChar
        tokens.push(token)
        text = text.slice(i + m[0].length)
    }
    if (text.length) tokens.push(text)
    return tokens
}

/**
 *  Parse an attribute value with possible interpolation tags
 *  return a Directive-friendly expression
 *
 *  e.g.  a {{b}} c  =>  "a " + b + " c"
 */
function parseAttr (attr) {
    Directive = Directive || require('./directive')
    var tokens = parse(attr)
    if (!tokens) return null
    if (tokens.length === 1) return tokens[0].key
    var res = [], token
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i]
        res.push(
            token.key
                ? inlineFilters(token.key)
                : ('"' + token + '"')
        )
    }
    return res.join('+')
}

/**
 *  Inlines any possible filters in a binding
 *  so that we can combine everything into a huge expression
 */
function inlineFilters (key) {
    if (key.indexOf('|') > -1) {
        var dirs = Directive.parse(key),
            dir = dirs && dirs[0]
        if (dir && dir.filters) {
            key = Directive.inlineFilters(
                dir.key,
                dir.filters
            )
        }
    }
    return '(' + key + ')'
}

exports.parse         = parse
exports.parseAttr     = parseAttr
exports.setDelimiters = setDelimiters
exports.delimiters    = [openChar, endChar]
},{"./directive":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/directive.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/transition.js":[function(require,module,exports){
var endEvents  = sniffEndEvents(),
    config     = require('./config'),
    // batch enter animations so we only force the layout once
    Batcher    = require('./batcher'),
    batcher    = new Batcher(),
    // cache timer functions
    setTO      = window.setTimeout,
    clearTO    = window.clearTimeout,
    // exit codes for testing
    codes = {
        CSS_E     : 1,
        CSS_L     : 2,
        JS_E      : 3,
        JS_L      : 4,
        CSS_SKIP  : -1,
        JS_SKIP   : -2,
        JS_SKIP_E : -3,
        JS_SKIP_L : -4,
        INIT      : -5,
        SKIP      : -6
    }

// force layout before triggering transitions/animations
batcher._preFlush = function () {
    /* jshint unused: false */
    var f = document.body.offsetHeight
}

/**
 *  stage:
 *    1 = enter
 *    2 = leave
 */
var transition = module.exports = function (el, stage, cb, compiler) {

    var changeState = function () {
        cb()
        compiler.execHook(stage > 0 ? 'attached' : 'detached')
    }

    if (compiler.init) {
        changeState()
        return codes.INIT
    }

    var hasTransition = el.vue_trans === '',
        hasAnimation  = el.vue_anim === '',
        effectId      = el.vue_effect

    if (effectId) {
        return applyTransitionFunctions(
            el,
            stage,
            changeState,
            effectId,
            compiler
        )
    } else if (hasTransition || hasAnimation) {
        return applyTransitionClass(
            el,
            stage,
            changeState,
            hasAnimation
        )
    } else {
        changeState()
        return codes.SKIP
    }

}

/**
 *  Togggle a CSS class to trigger transition
 */
function applyTransitionClass (el, stage, changeState, hasAnimation) {

    if (!endEvents.trans) {
        changeState()
        return codes.CSS_SKIP
    }

    // if the browser supports transition,
    // it must have classList...
    var onEnd,
        classList        = el.classList,
        existingCallback = el.vue_trans_cb,
        enterClass       = config.enterClass,
        leaveClass       = config.leaveClass,
        endEvent         = hasAnimation ? endEvents.anim : endEvents.trans

    // cancel unfinished callbacks and jobs
    if (existingCallback) {
        el.removeEventListener(endEvent, existingCallback)
        classList.remove(enterClass)
        classList.remove(leaveClass)
        el.vue_trans_cb = null
    }

    if (stage > 0) { // enter

        // set to enter state before appending
        classList.add(enterClass)
        // append
        changeState()
        // trigger transition
        if (!hasAnimation) {
            batcher.push({
                execute: function () {
                    classList.remove(enterClass)
                }
            })
        } else {
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    classList.remove(enterClass)
                }
            }
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        }
        return codes.CSS_E

    } else { // leave

        if (el.offsetWidth || el.offsetHeight) {
            // trigger hide transition
            classList.add(leaveClass)
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    // actually remove node here
                    changeState()
                    classList.remove(leaveClass)
                }
            }
            // attach transition end listener
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        } else {
            // directly remove invisible elements
            changeState()
        }
        return codes.CSS_L
        
    }

}

function applyTransitionFunctions (el, stage, changeState, effectId, compiler) {

    var funcs = compiler.getOption('effects', effectId)
    if (!funcs) {
        changeState()
        return codes.JS_SKIP
    }

    var enter = funcs.enter,
        leave = funcs.leave,
        timeouts = el.vue_timeouts

    // clear previous timeouts
    if (timeouts) {
        var i = timeouts.length
        while (i--) {
            clearTO(timeouts[i])
        }
    }

    timeouts = el.vue_timeouts = []
    function timeout (cb, delay) {
        var id = setTO(function () {
            cb()
            timeouts.splice(timeouts.indexOf(id), 1)
            if (!timeouts.length) {
                el.vue_timeouts = null
            }
        }, delay)
        timeouts.push(id)
    }

    if (stage > 0) { // enter
        if (typeof enter !== 'function') {
            changeState()
            return codes.JS_SKIP_E
        }
        enter(el, changeState, timeout)
        return codes.JS_E
    } else { // leave
        if (typeof leave !== 'function') {
            changeState()
            return codes.JS_SKIP_L
        }
        leave(el, changeState, timeout)
        return codes.JS_L
    }

}

/**
 *  Sniff proper transition end event name
 */
function sniffEndEvents () {
    var el = document.createElement('vue'),
        defaultEvent = 'transitionend',
        events = {
            'webkitTransition' : 'webkitTransitionEnd',
            'transition'       : defaultEvent,
            'mozTransition'    : defaultEvent
        },
        ret = {}
    for (var name in events) {
        if (el.style[name] !== undefined) {
            ret.trans = events[name]
            break
        }
    }
    ret.anim = el.style.animation === ''
        ? 'animationend'
        : 'webkitAnimationEnd'
    return ret
}

// Expose some stuff for testing purposes
transition.codes = codes
transition.sniff = sniffEndEvents
},{"./batcher":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/batcher.js","./config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js":[function(require,module,exports){
var config       = require('./config'),
    toString     = ({}).toString,
    win          = window,
    console      = win.console,
    def          = Object.defineProperty,
    OBJECT       = 'object',
    THIS_RE      = /[^\w]this[^\w]/,
    BRACKET_RE_S = /\['([^']+)'\]/g,
    BRACKET_RE_D = /\["([^"]+)"\]/g,
    hasClassList = 'classList' in document.documentElement,
    ViewModel // late def

var defer =
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.setTimeout

/**
 *  Normalize keypath with possible brackets into dot notations
 */
function normalizeKeypath (key) {
    return key.indexOf('[') < 0
        ? key
        : key.replace(BRACKET_RE_S, '.$1')
             .replace(BRACKET_RE_D, '.$1')
}

var utils = module.exports = {

    /**
     *  Convert a string template to a dom fragment
     */
    toFragment: require('./fragment'),

    /**
     *  Parse the various types of template options
     */
    parseTemplateOption: require('./template-parser.js'),

    /**
     *  get a value from an object keypath
     */
    get: function (obj, key) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            return obj[key]
        }
        var path = key.split('.'),
            d = -1, l = path.length
        while (++d < l && obj != null) {
            obj = obj[path[d]]
        }
        return obj
    },

    /**
     *  set a value to an object keypath
     */
    set: function (obj, key, val) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            obj[key] = val
            return
        }
        var path = key.split('.'),
            d = -1, l = path.length - 1
        while (++d < l) {
            if (obj[path[d]] == null) {
                obj[path[d]] = {}
            }
            obj = obj[path[d]]
        }
        obj[path[d]] = val
    },

    /**
     *  return the base segment of a keypath
     */
    baseKey: function (key) {
        return key.indexOf('.') > 0
            ? key.split('.')[0]
            : key
    },

    /**
     *  Create a prototype-less object
     *  which is a better hash/map
     */
    hash: function () {
        return Object.create(null)
    },

    /**
     *  get an attribute and remove it.
     */
    attr: function (el, type) {
        var attr = config.prefix + '-' + type,
            val = el.getAttribute(attr)
        if (val !== null) {
            el.removeAttribute(attr)
        }
        return val
    },

    /**
     *  Define an ienumerable property
     *  This avoids it being included in JSON.stringify
     *  or for...in loops.
     */
    defProtected: function (obj, key, val, enumerable, writable) {
        def(obj, key, {
            value        : val,
            enumerable   : enumerable,
            writable     : writable,
            configurable : true
        })
    },

    /**
     *  A less bullet-proof but more efficient type check
     *  than Object.prototype.toString
     */
    isObject: function (obj) {
        return typeof obj === OBJECT && obj && !Array.isArray(obj)
    },

    /**
     *  A more accurate but less efficient type check
     */
    isTrueObject: function (obj) {
        return toString.call(obj) === '[object Object]'
    },

    /**
     *  Most simple bind
     *  enough for the usecase and fast than native bind()
     */
    bind: function (fn, ctx) {
        return function (arg) {
            return fn.call(ctx, arg)
        }
    },

    /**
     *  Make sure null and undefined output empty string
     */
    guard: function (value) {
        /* jshint eqeqeq: false, eqnull: true */
        return value == null
            ? ''
            : (typeof value == 'object')
                ? JSON.stringify(value)
                : value
    },

    /**
     *  When setting value on the VM, parse possible numbers
     */
    checkNumber: function (value) {
        return (isNaN(value) || value === null || typeof value === 'boolean')
            ? value
            : Number(value)
    },

    /**
     *  simple extend
     */
    extend: function (obj, ext) {
        for (var key in ext) {
            if (obj[key] !== ext[key]) {
                obj[key] = ext[key]
            }
        }
        return obj
    },

    /**
     *  filter an array with duplicates into uniques
     */
    unique: function (arr) {
        var hash = utils.hash(),
            i = arr.length,
            key, res = []
        while (i--) {
            key = arr[i]
            if (hash[key]) continue
            hash[key] = 1
            res.push(key)
        }
        return res
    },

    /**
     *  Convert the object to a ViewModel constructor
     *  if it is not already one
     */
    toConstructor: function (obj) {
        ViewModel = ViewModel || require('./viewmodel')
        return utils.isObject(obj)
            ? ViewModel.extend(obj)
            : typeof obj === 'function'
                ? obj
                : null
    },

    /**
     *  Check if a filter function contains references to `this`
     *  If yes, mark it as a computed filter.
     */
    checkFilter: function (filter) {
        if (THIS_RE.test(filter.toString())) {
            filter.computed = true
        }
    },

    /**
     *  convert certain option values to the desired format.
     */
    processOptions: function (options) {
        var components = options.components,
            partials   = options.partials,
            template   = options.template,
            filters    = options.filters,
            key
        if (components) {
            for (key in components) {
                components[key] = utils.toConstructor(components[key])
            }
        }
        if (partials) {
            for (key in partials) {
                partials[key] = utils.parseTemplateOption(partials[key])
            }
        }
        if (filters) {
            for (key in filters) {
                utils.checkFilter(filters[key])
            }
        }
        if (template) {
            options.template = utils.parseTemplateOption(template)
        }
    },

    /**
     *  used to defer batch updates
     */
    nextTick: function (cb) {
        defer(cb, 0)
    },

    /**
     *  add class for IE9
     *  uses classList if available
     */
    addClass: function (el, cls) {
        if (hasClassList) {
            el.classList.add(cls)
        } else {
            var cur = ' ' + el.className + ' '
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.className = (cur + cls).trim()
            }
        }
    },

    /**
     *  remove class for IE9
     */
    removeClass: function (el, cls) {
        if (hasClassList) {
            el.classList.remove(cls)
        } else {
            var cur = ' ' + el.className + ' ',
                tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }
            el.className = cur.trim()
        }
    },

    /**
     *  Convert an object to Array
     *  used in v-repeat and array filters
     */
    objectToArray: function (obj) {
        var res = [], val, data
        for (var key in obj) {
            val = obj[key]
            data = utils.isObject(val)
                ? val
                : { $value: val }
            data.$key = key
            res.push(data)
        }
        return res
    }
}

enableDebug()
function enableDebug () {
    /**
     *  log for debugging
     */
    utils.log = function (msg) {
        if (config.debug && console) {
            console.log(msg)
        }
    }
    
    /**
     *  warnings, traces by default
     *  can be suppressed by `silent` option.
     */
    utils.warn = function (msg) {
        if (!config.silent && console) {
            console.warn(msg)
            if (config.debug && console.trace) {
                console.trace()
            }
        }
    }
}
},{"./config":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/config.js","./fragment":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/fragment.js","./template-parser.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/template-parser.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/viewmodel.js":[function(require,module,exports){
var Compiler   = require('./compiler'),
    utils      = require('./utils'),
    transition = require('./transition'),
    Batcher    = require('./batcher'),
    slice      = [].slice,
    def        = utils.defProtected,
    nextTick   = utils.nextTick,

    // batch $watch callbacks
    watcherBatcher = new Batcher(),
    watcherId      = 1

/**
 *  ViewModel exposed to the user that holds data,
 *  computed properties, event handlers
 *  and a few reserved methods
 */
function ViewModel (options) {
    // compile if options passed, if false return. options are passed directly to compiler
    if (options === false) return
    new Compiler(this, options)
}

// All VM prototype methods are inenumerable
// so it can be stringified/looped through as raw data
var VMProto = ViewModel.prototype

/**
 *  init allows config compilation after instantiation:
 *    var a = new Vue(false)
 *    a.init(config)
 */
def(VMProto, '$init', function (options) {
    new Compiler(this, options)
})

/**
 *  Convenience function to get a value from
 *  a keypath
 */
def(VMProto, '$get', function (key) {
    var val = utils.get(this, key)
    return val === undefined && this.$parent
        ? this.$parent.$get(key)
        : val
})

/**
 *  Convenience function to set an actual nested value
 *  from a flat key string. Used in directives.
 */
def(VMProto, '$set', function (key, value) {
    utils.set(this, key, value)
})

/**
 *  watch a key on the viewmodel for changes
 *  fire callback with new value
 */
def(VMProto, '$watch', function (key, callback) {
    // save a unique id for each watcher
    var id = watcherId++,
        self = this
    function on () {
        var args = slice.call(arguments)
        watcherBatcher.push({
            id: id,
            override: true,
            execute: function () {
                callback.apply(self, args)
            }
        })
    }
    callback._fn = on
    self.$compiler.observer.on('change:' + key, on)
})

/**
 *  unwatch a key
 */
def(VMProto, '$unwatch', function (key, callback) {
    // workaround here
    // since the emitter module checks callback existence
    // by checking the length of arguments
    var args = ['change:' + key],
        ob = this.$compiler.observer
    if (callback) args.push(callback._fn)
    ob.off.apply(ob, args)
})

/**
 *  unbind everything, remove everything
 */
def(VMProto, '$destroy', function (noRemove) {
    this.$compiler.destroy(noRemove)
})

/**
 *  broadcast an event to all child VMs recursively.
 */
def(VMProto, '$broadcast', function () {
    var children = this.$compiler.children,
        i = children.length,
        child
    while (i--) {
        child = children[i]
        child.emitter.applyEmit.apply(child.emitter, arguments)
        child.vm.$broadcast.apply(child.vm, arguments)
    }
})

/**
 *  emit an event that propagates all the way up to parent VMs.
 */
def(VMProto, '$dispatch', function () {
    var compiler = this.$compiler,
        emitter = compiler.emitter,
        parent = compiler.parent
    emitter.applyEmit.apply(emitter, arguments)
    if (parent) {
        parent.vm.$dispatch.apply(parent.vm, arguments)
    }
})

/**
 *  delegate on/off/once to the compiler's emitter
 */
;['emit', 'on', 'off', 'once'].forEach(function (method) {
    // internal emit has fixed number of arguments.
    // exposed emit uses the external version
    // with fn.apply.
    var realMethod = method === 'emit'
        ? 'applyEmit'
        : method
    def(VMProto, '$' + method, function () {
        var emitter = this.$compiler.emitter
        emitter[realMethod].apply(emitter, arguments)
    })
})

// DOM convenience methods

def(VMProto, '$appendTo', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.appendChild(el)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$remove', function (cb) {
    var el = this.$el
    transition(el, -1, function () {
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$before', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.parentNode.insertBefore(el, target)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$after', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        if (target.nextSibling) {
            target.parentNode.insertBefore(el, target.nextSibling)
        } else {
            target.parentNode.appendChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

function query (el) {
    return typeof el === 'string'
        ? document.querySelector(el)
        : el
}

module.exports = ViewModel

},{"./batcher":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/batcher.js","./compiler":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/compiler.js","./transition":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/transition.js","./utils":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/section.js":[function(require,module,exports){
'use strict';

var Vue = require('vue');

module.exports = {
    /*
        Route params
        Used by the router and the custom v-view
        id: page slug
        transitionMode: timing (see view for infos)
        params: injected by the view from router infos
    */
    route: {
        id: '',
        transitionMode: 'outAndAfterIn',
        params: {}
    },
    methods: {
        /*
            PUBLIC API
            Overridable behavior
        */

        /*
            Can be overriden if the sections transition needs to be different depending on the previous route. Handle with care !
         */
        getTransitionMode: function(previousRoute) {
            return this.$options.route.transitionMode;
        },

        /*
            Starts the transitionIn, override it if you need to play something else than the default Timeline depending on previous route.
            ex:
                if(previousRoute && previousRoute.id === 'home') this.tlTransition.play();
                else TweenMax.fromTo(this.$el, 1, {alpha: 0}, {alpha: 1, onComplete: this.onTransitionInComplete, onCompleteScope: this});
        */
        playTransitionIn: function(previousRoute) {
            console.log('Section - playTransitionIn');
            this.tlTransition.play();
        },

        /*
            Starts the transitionOut, override it if you need to play something else than the default Timeline depending on next route.
        */
        playTransitionOut: function(nextRoute) {
            this.tlTransition.reverse();
        },

        /*
            Allow to resize and manipulate the DOM before creating the transitions
        */
        beforeTransitionIn: function() {
            console.warn('[section] - You need to override section.beforeTransitionIn:', this.$options.route.id);
        },

        /*
            Create the different tween into the transitionIn/Out Timelines
        */
        insertTweens: function() {
            console.warn('[section] - You need to override section.insertTweens:', this.$options.route.id);
            this.tlTransition.fromTo(this.$el, 0.4, {opacity: 0}, {opacity: 1});
        },

        /*
            PRIVATE API
            Internal behavior
        */
        transitionIn: function(previousRoute) {
            this.$el.style.visibility = 'visible';
            this.playTransitionIn(previousRoute);
        },
        onTransitionInComplete: function() {
            this.$emit('section:transitionInComplete');
        },
        transitionOut: function(nextRoute) {
            this.playTransitionOut(nextRoute);
        },
        onTransitionOutComplete: function() {
            this.$emit('section:transitionOutComplete');
        },
        createTimeline: function() {
            this.tlTransition = new TimelineMax({
                onComplete: this.onTransitionInComplete,
                onCompleteScope: this,
                onReverseComplete: this.onTransitionOutComplete,
                onReverseCompleteScope: this,
                paused: true
            });

            this.tlTransitionOut = new TimelineMax({
                onComplete: this.onTransitionOutComplete,
                onCompleteScope: this,
                paused: true
            });

            console.log('Section - createTimeline');
        },
        transitionsReady: function() {
            this.$root.$emit('section:transitionsReady');
            console.log('Section - transitionsReady');
        },
        added: function() {
            this.beforeTransitionIn(); // Override that bitch
            this.createTimeline();
            this.insertTweens(); // Override this

            Vue.nextTick(this.transitionsReady.bind(this));
        }
    },
    created: function() {
        this.$el.style.visibility = 'hidden';

        this.$once('hook:added', function() {
            Vue.nextTick(this.added.bind(this));
        });

        this.$once('hook:routed', function() {
            // If we want to handle preload or promises resolving
        });

        this.$once('hook:beforeDestroy', function() {
            if(this.tlTransition) {
                this.tlTransition.kill();
                this.tlTransition = null;
            }
            if(this.tlTransitionOut) {
                this.tlTransitionOut.kill();
                this.tlTransitionOut = null;
            }
        });

    }
};

},{"vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/view.js":[function(require,module,exports){
'use strict';

/*
    View
    Enhanced v-view allowing to manage timing between transitions
    - transition In then Out,
    - transition In and Out together,
    - transition In only
 */

var TweenMax = require('TweenMax'),
    Vue = require('vue');

module.exports = {
    /*
        Origin v-view - must be kept in sync with the vue repo
    */
    bind: function () {
        // track position in DOM with a ref node
        var el       = this.raw = this.el,
            parent   = el.parentNode,
            ref      = this.ref = document.createComment('pw-view');
        if(!parent) return;

        parent.insertBefore(ref, el);
        parent.removeChild(el);

        // cache original content
        /* jshint boss: true */
        var node,
            frag = this.inner = document.createElement('div');
        while (node = el.firstChild) {
            frag.appendChild(node);
        }
        this.vm.$on('section:transitionsReady', this.onTransitionReady.bind(this));
    },

    update: function(value) {
        if(!this.inner || this.isTransitionning || !value) return;

        var Ctor  = this.compiler.getOption('components', value);
        if (!Ctor) return;

        if(this.childVM) {
            this.previousChildVM = this.childVM;
        }

        this.nextChildVM = new Ctor({
            el: this.raw.cloneNode(true),
            parent: this.vm,
            compilerOptions: {
                rawContent: this.inner.cloneNode(true)
            }
        });

        // Add router params to nextChildVM
        this.nextChildVM.$options.route.params = this.vm.context.params;

        // Routing params event
        this.nextChildVM.$emit('hook:routed');

        // check if nextChildVM & previousChildVM are transition compatible, if not throw error
        this.el = this.nextChildVM.$el;
        if (this.compiler.init) {
            this.ref.parentNode.insertBefore(this.el, this.ref);
            Vue.nextTick(this.viewModelAdded.bind(this));
        } else {
            this.nextChildVM.$before(this.ref, this.viewModelAdded.bind(this));
        }
    },

    unbind: function() {
        if (this.childVM) this.childVM.$destroy();
        if (this.nextChildVM) this.nextChildVM.$destroy();
        if (this.previousChildVM) this.previousChildVM.$destroy();
    },

    /*
        Transition timings stuff
    */

    viewModelAdded: function() {
        this.nextChildVM.$emit('hook:added');
    },

    onTransitionReady: function() {
        if(!this.nextChildVM) return;
        console.log("View - onTransitionReady");

        this.transition();
    },

    transition: function() {
        this.isTransitionning = true;
        if(this.previousChildVM) {
            console.log("View - transition");
            switch(this.nextChildVM.getTransitionMode(this.previousChildVM.$options.route)) {
                case 'inAndAfterOut':
                    this.transitionInAndAfterOut();
                    break;
                case 'inAndOutTogether':
                    this.transitionInAndOutTogether();
                    break;
                case 'transitionInOnly':
                    this.previousChildVM.$destroy();
                    this.transitionInOnly();
                    break;
                default:
                    this.transitionOutAndAfterIn();
                    break;
            }
        }
        else {
            this.transitionInOnly();
        }
    },

    transitionInOnly: function(previousRoute) {
        this.scrollToTop();
        this.nextChildVM.$once('section:transitionInComplete', function(){
            this.onTransitionComplete();
        }.bind(this));
        this.nextChildVM.transitionIn(previousRoute);
    },

    transitionOutAndAfterIn: function() {
        var nextRoute = this.nextChildVM.$options.route;
        this.previousChildVM.$once('section:transitionOutComplete', function(){
            this.scrollToTop();
            this.previousChildVM.$destroy();
            this.transitionInOnly(this.previousChildVM.$options.route);
        }.bind(this));
        this.previousChildVM.transitionOut(this.nextChildVM.$options.route);
    },

    transitionInAndAfterOut: function() {
        this.scrollToTop();
        this.nextChildVM.$once('section:transitionInComplete', function(){
            this.previousChildVM.$on('section:transitionOutComplete', function(){
                this.onTransitionComplete();
            }.bind(this));
            this.previousChildVM.transitionOut(this.nextChildVM.$options.route);
        }.bind(this));
        this.nextChildVM.transitionIn(this.previousChildVM.$options.route);
    },

    transitionInAndOutTogether: function() {
        this.scrollToTop();
        this.previousChildVM.$once('section:transitionOutComplete', function(){
            this.onTransitionComplete();
        }.bind(this));
        this.previousChildVM.transitionOut(this.nextChildVM.$options.route);
        this.nextChildVM.transitionIn(this.previousChildVM.$options.route);
    },

    scrollToTop: function() {
        TweenMax.set(window, {scrollTo: {y: 0, x: 0}});
    },

    onTransitionComplete: function() {
        this.isTransitionning = false;
        this.childVM = this.nextChildVM;
        if(this.previousChildVM) {
            this.previousChildVM.$destroy();
        }
        this.previousChildVM = null;
        this.vm.$emit('view:transitionComplete');
    }
};

},{"TweenMax":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/common/debug.js":[function(require,module,exports){
'use strict';

/*
    Flags allowing to require/activate differents
    parts of the app.

    Example: require vue-debug, set Timeline to fast-forward
    for faster debug.
 */

module.exports = {
    vue: true  
};
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/common/directives/viewport.js":[function(require,module,exports){
'use strict';

/*
    Modified vue-viewport plugin
    (v-detect-viewport directive)
    https://github.com/holic/vue-viewport

    to allow to pass an attribute to the directive
    v-viewport="thing", allowing to recognize which
    elements triggered the viewport event, when used on multiples events.
 */

var directives = [];

module.exports = {
    isLiteral: true,

    bind: function () {
        this.vm.$on('hook:attached', notifyAll);
        this.vm.$on('hook:detached', notifyAll);

        if (directives.indexOf(this) === -1) {
            directives.push(this);
        }
    },

    unbind: function () {
        this.vm.$off('hook:attached', notifyAll);
        this.vm.$off('hook:detached', notifyAll);

        var index = directives.indexOf(this);
        if (index > -1) {
            directives.splice(index, 1);
        }
    }
};

function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth);
}

function notify (directive) {
    if (!directive.el) return;

    var inViewport = isElementInViewport(directive.el);
    if (directive.inViewport === null || directive.inViewport !== inViewport) {
        directive.inViewport = inViewport;
        var direction = inViewport ? 'enter' : 'leave';
        directive.vm.$emit('viewport' + direction, {el: directive.el, attr: directive.key});
    }
}

function notifyAll () {
    directives.forEach(notify);
}

['DOMContentLoaded', 'load', 'scroll', 'resize', 'popstate'].forEach(function (event) {
    window.addEventListener(event, notifyAll, false);
});
},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/imports.js":[function(require,module,exports){
'use strict';

/*
    IMPORTS

    Holdall for plugins and conf
    to avoid polluting the main.
 */

var Vue = require('vue'),
    debug = require('vue-debug'),
    query = require('vue-query'),
    el = require('vue-el'),
    viewport = require('./common/directives/viewport.js'),
    TweenMax = require('TweenMax'),
    debugApp = require('./common/debug.js');

/*
    TweenMax
*/
require('TweenMax.ScrollToPlugin'); // Add scrollToPlugin to TweenMax
TweenLite.defaultEase = Expo.easeOut; // So I don't have to write it every time

/*
    Vue plugins
 */
if(debugApp) Vue.use(debug); // Add Vue.log method
Vue.use(el); // v-el directive to avoid selecting nodes in JS
Vue.use(query); // Add this.$findOne, this.$find, this.add/removeClass to any Vue instance
Vue.directive('viewport', require('./common/directives/viewport'));
},{"./common/debug.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/common/debug.js","./common/directives/viewport":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/common/directives/viewport.js","./common/directives/viewport.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/common/directives/viewport.js","TweenMax":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js","TweenMax.ScrollToPlugin":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/plugins/ScrollToPlugin.min.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js","vue-debug":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-debug/src/index.js","vue-el":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-el/index.js","vue-query":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue-query/index.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/router.js":[function(require,module,exports){
'use strict';

var Vue = require('vue'),
    page = require('page'),
    extend = require('extend'),
    forEach = require('forEach'),
    EventEmitter = require('component-emitter'),
    verbose = true;

/*
    Router based on page.js,
    event-based, made to work with vue
 */
module.exports = extend({
    /*
        This object is dispatched on each locationChange.
        It holds the current path, the route params...
     */
    context: {
        path: ''
    },

    /*
        Default route (can be a 404, or the index)
     */
    defaultRoute: '/',

    /*
        Reference to all the routes
    */
    routeIds: [],

    /*
        Registers the route with the specified path/pattern (express-like regexp)
        route: infos as {id: "route-id", path: "/route"} or {id: "route-id", path: "/route/:id"}
     */
    addRoute: function(route) {
        this.routeIds.push({id: route.id, path: route.path});
        page(route.path, this.onRoute.bind(this));
        if(verbose) console.debug('[router] add route "' + route.path + '"');
    },

    /*
        Updates the default route.
        This method should be called after all routes were added,
        because it starts the routing.
     */
    setDefaultRoute: function(defaultRoute) {
        this.defaultRoute = defaultRoute;
        page('*', this.onDefaultRoute.bind(this));
        this.start();
    },

    /*
        Starts the router.
        Only needed to call if you didn't called `setDefaultRoute`.
     */
    start: function() {
        page.start();
        this.emit('router:start');
    },

    /*
        Internal method.
        Updates the context and amit the `router:update` event.
     */
    onRoute: function(context) {
        this.context.params = context.params;
        this.context.id = this.getCurrentRouteId(context.path);
        this.context.path = context.path;

        if(verbose) console.debug('[router] onRoute', this.context);
        this.emit('router:update', this.context);
    },

    /*
        Called when the requested route does not exists
        Redirects to proper default route
     */
    onDefaultRoute: function(c) {
        Vue.nextTick(function(){
            history.replaceState({}, '', '/' + this.defaultRoute);
            page('/' + this.defaultRoute);
        }.bind(this));
    },

    getCurrentRouteId: function(path) {
        var match, id;
        forEach(this.routeIds, function(value, index){
            match = path.match(new RegExp((value.path.replace(/:[a-z]+/g, '[a-z-]+')).replace(/\//g, '\\/'), 'g'));
            if(match && match.length > 0) {
                id = value.id;
            }
        });
        return id;
    },

    /*
        Manually set the path.
        Allow to press the `back`/`forward` buttons
     */
    update: function(path) {
        page.show(path, null, false);
    }
}, new EventEmitter());

},{"component-emitter":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/component-emitter/index.js","extend":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js","forEach":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/foreach.js/dist/foreach.min.js","page":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/page/index.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/components/nameButton/nameButton.html":[function(require,module,exports){
module.exports = "<a class=\"name-button\" href=\"{{url}}\" v-on=\"mouseover: onMouseOver, mouseout: onMouseOut\">\n    <div class=\"name\" v-el=\"name\">{{project.author}}</div>\n    <div class=\"title\" v-el=\"title\">{{project.title}}</div>\n    <div class=\"line\" v-el=\"line\"></div>\n</a>";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/components/nameButton/nameButton.js":[function(require,module,exports){
'use strict';

var Vue = require('vue'),
    bindAll = require('bindall-standalone')
    TweenMax = require('TweenMax');

module.exports = {
    template: require('./nameButton.html'),
    methods: {
        onMouseOver: function(e) {
            console.log('onMouseOver');
            TweenMax.to(this.$$.name, 0.6, {x: 0, color: '#007dac', ease: Expo.easeOut});
            TweenMax.to(this.$$.title, 0.6, {alpha: 1, x: 0, ease: Expo.easeOut});
            TweenMax.to(this.$$.line, 1, {scaleX: 1, ease: Expo.easeOut});
        },
        onMouseOut: function(e) {
            TweenMax.to(this.$$.name, 0.6, {x: this.$$.title.offsetWidth * 0.5, color: '#333', ease: Expo.easeOut});
            TweenMax.to(this.$$.title, 0.6, {alpha: 0, x: this.$$.title.offsetWidth * 0.5, ease: Expo.easeOut });
            TweenMax.to(this.$$.line, 1, {scaleX: 0, ease: Expo.easeOut});
        },
        init: function() {
            TweenMax.set(this.$$.name, {x: this.$$.title.offsetWidth * 0.5});
            TweenMax.set(this.$$.title, {x: this.$$.title.offsetWidth * 0.5});
        }
    },
    ready: function() {
        this.url = 'project/' + this.project.id;
        bindAll(this, 'init');
        Vue.nextTick(this.init);
    }
};
},{"./nameButton.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/components/nameButton/nameButton.html","TweenMax":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js","bindall-standalone":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/bindall-standalone/index.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/footer/footer.html":[function(require,module,exports){
module.exports = "Workshop by <a href=\"http://guillaumegouessan.com\"> Guillaume Gouessan </a> for <a href=\"http://gobelins.fr\"> Gobelins School </a> CRMA 2015 students, Paris 2014.";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/footer/footer.js":[function(require,module,exports){
'use strict';

module.exports = {
    template: require('./footer.html'),
    components: {

    },
    methods: {
        
    },
    ready: function() {
        
    }
};
},{"./footer.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/footer/footer.html"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.html":[function(require,module,exports){
module.exports = "<a href=\"/\"><img v-el=\"logo\" src=\"assets/images/logo.svg\" width=\"240\" /></a>\n<h2 id=\"subtitle\" v-el=\"subtitle\">Creative Coding Workshop - Three.js</h2>\n";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.js":[function(require,module,exports){
'use strict';

module.exports = {
    template: require('./header.html'),
    methods: {

    },
    ready: function() {
        var startTime = 0.8;
        var tl = new TimelineMax();
        tl.from(this.$$.subtitle, 0.6, {y: -20, alpha: 0, ease: Expo.easeOut}, startTime + 0.0);
        tl.from(this.$$.logo, 0.6, {y: -20, alpha: 0, ease: Expo.easeOut}, startTime + 0.1);
    }
};

},{"./header.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.html"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.html":[function(require,module,exports){
module.exports = "<div class=\"home\">\n    <ul>\n        <li v-repeat=\"project:projects\" v-el=\"links\" v-component=\"nameButton\" v-with=\"project\"></li>\n    </ul>\n</div>";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.js":[function(require,module,exports){
'use strict';

var extend = require('extend'),
    section = require('./../../../base/section.js');

module.exports = extend(true, {}, section, {
    template: require('./home.html'),
    route: {
        id: 'home',
        transitionMode: 'outAndAfterIn',
        path: '/home'
    },
    data: {
        projects: [
            {
                id: 'clement',
                author: 'Clément Bardon',
                title: 'Awefully long title'
            },
            {
                id: 'nicolas',
                author: 'Nicolas Bonnot',
                title: 'Title'
            },
            {
                id: 'kevin',
                author: 'Kevin Budain',
                title: 'Title'
            },
            {
                id: 'bertrand',
                author: 'Bertrand Cayla',
                title: 'Title'
            },
            {
                id: 'etienne',
                author: 'Etienne Chaumont',
                title: 'Title'
            },
            {
                id: 'jordan',
                author: 'Jordan Delcros',
                title: 'Title'
            },
            {
                id: 'jeremie',
                author: 'Jérémie Devoos',
                title: 'Title'
            },
            {
                id: 'leonard',
                author: 'Léonard Hetsch',
                title: 'Title'
            },
            {
                id: 'samuel',
                author: 'Samuel Honigstein',
                title: 'Title'
            },
            {
                id: 'lory',
                author: 'Lory Huz',
                title: 'Title'
            },
            {
                id: 'guillaume',
                author: 'Guillaume Jasmin',
                title: 'Title'
            },
            {
                id: 'thomas',
                author: 'Thomas Josseau',
                title: 'Title'
            },
            {
                id: 'antonin',
                author: 'Antonin Langlade',
                title: 'Title'
            },
            {
                id: 'katia',
                author: 'Katia Moreira',
                title: 'Title'
            },
            {
                id: 'louise',
                author: 'Louise Obé',
                title: 'Title'
            },
            {
                id: 'jean-baptiste',
                author: 'Jean-Baptiste Penrath',
                title: 'Title'
            },
            {
                id: 'sylvain',
                author: 'Sylvain Reucherand',
                title: 'Title'
            },
            {
                id: 'glenn',
                author: 'Glenn Sonna',
                title: 'Title'
            },
            {
                id: 'alexis',
                author: 'Alexis Tessier',
                title: 'Title'
            },
            {
                id: 'geoffrey',
                author: 'Geoffrey Thenot',
                title: 'Title'
            }
        ]
    },
    methods: {
        insertTweens: function() {
            this.projects = this.shuffle(this.projects);
            this.tlTransition.fromTo(this.$el, 0.7, {alpha: 0, y: 50}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.4);
        },

        shuffle: function(o) {
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        },

        beforeTransitionIn: function() {
        }
    },
    
    ready: function() {

    },

    beforeDestroy: function() {

    }
});

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/section.js","./home.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.html","extend":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/project/project.html":[function(require,module,exports){
module.exports = "<div class=\"project\">\n    <h2>ici insérer l'iframe de {{author}}</h2>\n</div>";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/project/project.js":[function(require,module,exports){
'use strict';

var extend = require('extend'),
    section = require('./../../../base/section.js');

module.exports = extend(true, {}, section, {
    template: require('./project.html'),
    route: {
        id: 'project',
        transitionMode: 'outAndAfterIn',
        path: '/project/:id'
    },
    data: {

    },
    methods: {
        insertTweens: function() {
            console.log('Project.insertTweens');
            this.tlTransition.fromTo(this.$el, 0.7, {alpha: 0, y: 50}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.4);
        },
        beforeTransitionIn: function() {
            console.log('Project.beforeTransitionIn', this.$options.route.params.id);
            this.author = this.$options.route.params.id;
        }
    },
    
    ready: function() {
    },

    beforeDestroy: function() {

    }
});

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/section.js","./project.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/project/project.html","extend":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js"}]},{},["./src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL2JpbmRhbGwtc3RhbmRhbG9uZS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZm9yZWFjaC5qcy9kaXN0L2ZvcmVhY2gubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZ3JlZW5zb2NrL3NyYy9taW5pZmllZC9Ud2Vlbk1heC5taW4uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy9ncmVlbnNvY2svc3JjL21pbmlmaWVkL3BsdWdpbnMvU2Nyb2xsVG9QbHVnaW4ubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvcGFnZS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1kZWJ1Zy9zcmMvaW5kZXguanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUtZGVidWcvc3JjL2xvZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1lbC9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1xdWVyeS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmluZGluZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGVwcy1wYXJzZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZS5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2lmLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL29uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3BhcnRpYWwuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3N0eWxlLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3ZpZXcuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZW1pdHRlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZXhwLXBhcnNlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZnJhZ21lbnQuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL21haW4uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90ZW1wbGF0ZS1wYXJzZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL3RleHQtcGFyc2VyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy91dGlscy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdmlld21vZGVsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvYmFzZS9zZWN0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvYmFzZS92aWV3LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvY29tbW9uL2RlYnVnLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvY29tbW9uL2RpcmVjdGl2ZXMvdmlld3BvcnQuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL3NyYy9pbXBvcnRzLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvcm91dGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvY29tcG9uZW50cy9uYW1lQnV0dG9uL25hbWVCdXR0b24uaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2NvbXBvbmVudHMvbmFtZUJ1dHRvbi9uYW1lQnV0dG9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvbGF5b3V0L2Zvb3Rlci9mb290ZXIuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2xheW91dC9mb290ZXIvZm9vdGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvbGF5b3V0L2hlYWRlci9oZWFkZXIuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2xheW91dC9oZWFkZXIvaGVhZGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3Mvc2VjdGlvbnMvaG9tZS9ob21lLmh0bWwiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL3NyYy92aWV3cy9zZWN0aW9ucy9ob21lL2hvbWUuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL3NyYy92aWV3cy9zZWN0aW9ucy9wcm9qZWN0L3Byb2plY3QuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL3NlY3Rpb25zL3Byb2plY3QvcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBQYXRjaHdvcmsgLSBhIGd1bHAsIG5wbSwgdnVlLmpzLCBub2RlLXNhc3MgYm9pbGVycGxhdGUuXG4gICAgMjAxNCAtIEZsb3JpYW4gTW9yZWwsIEd1aWxsYXVtZSBHb3Vlc3NhblxuKi9cblxuLypcbiAgICBBcHAgZW50cnkgcG9pbnQuXG5cbiAgICBDcmVhdGVzIHRoZSB0b3AtbW9zdCB2aWV3bW9kZWwsXG4gICAgcmVnaXN0ZXJzIHRoZSByb3V0ZXMsXG4gICAgcmVnaXN0ZXJzIGFsbCBjb21wb25lbnRzLFxuICAgIGFuZCBzdGFydCBvbiBwYWdlIGxvYWQuXG4gKi9cblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyksXG4gICAgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpO1xuXG4vKlxuICAgIFBsdWdpbnMsIGxpYiBjb25maWcuLi5cbiAqL1xucmVxdWlyZSgnLi9pbXBvcnRzJyk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJ2JvZHknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjdXJyZW50UGFnZTogbnVsbCwgLy8gQ3VycmVudCBwYWdlIGlkLCB1c2VkIGJ5IHYtcHctdmlld1xuICAgICAgICAgICAgY29udGV4dDoge30gLy8gcmVmZXJlbmNlIHRvIHRoZSByb3V0ZXIgY29udGV4dFxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgIC8qIExBWU9VVCAqL1xuICAgICAgICAgICAgJ2Zvb3Rlcic6IHJlcXVpcmUoJy4vdmlld3MvbGF5b3V0L2Zvb3Rlci9mb290ZXInKSxcbiAgICAgICAgICAgICdoZWFkZXInOiByZXF1aXJlKCcuL3ZpZXdzL2xheW91dC9oZWFkZXIvaGVhZGVyJyksXG5cbiAgICAgICAgICAgIC8qIENPTVBPTkVOVHMgKi9cbiAgICAgICAgICAgICduYW1lQnV0dG9uJzogcmVxdWlyZSgnLi92aWV3cy9jb21wb25lbnRzL25hbWVCdXR0b24vbmFtZUJ1dHRvbicpLFxuXG4gICAgICAgICAgICAvKiBQQUdFUyAqL1xuICAgICAgICAgICAgJ2hvbWUnOiByZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL2hvbWUvaG9tZScpLFxuICAgICAgICAgICAgJ3Byb2plY3QnOiByZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL3Byb2plY3QvcHJvamVjdCcpXG5cbiAgICAgICAgICAgIC8qIENPTU1PTiAqL1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlyZWN0aXZlczoge1xuICAgICAgICAgICAgJ3B3LXZpZXcnOiByZXF1aXJlKCcuL2Jhc2Uvdmlldy5qcycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcm91dGVyLm9uKCdyb3V0ZXI6dXBkYXRlJywgdGhpcy5vblJvdXRlVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICByb3V0ZXIuYWRkUm91dGUocmVxdWlyZSgnLi92aWV3cy9zZWN0aW9ucy9ob21lL2hvbWUnKS5yb3V0ZSk7XG4gICAgICAgICAgICByb3V0ZXIuYWRkUm91dGUocmVxdWlyZSgnLi92aWV3cy9zZWN0aW9ucy9wcm9qZWN0L3Byb2plY3QnKS5yb3V0ZSk7XG4gICAgICAgICAgICByb3V0ZXIuc2V0RGVmYXVsdFJvdXRlKCdob21lJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgb25Sb3V0ZVVwZGF0ZTogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IGNvbnRleHQuaWQ7XG4gICAgICAgICAgICAgICAgdGhpcy4kcm9vdC4kZW1pdCgnJHJvdXRlLnVwZGF0ZScsIHRoaXMuY3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbndpbmRvdy5vbmxvYWQgPSBpbml0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZighb2JqZWN0KSByZXR1cm4gY29uc29sZS53YXJuKCdiaW5kQWxsIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBhcmd1bWVudC4nKTtcblxuICAgIHZhciBmdW5jdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgaWYgKGZ1bmN0aW9ucy5sZW5ndGggPT09IDApIHtcblxuICAgICAgICBmb3IgKHZhciBtZXRob2QgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZihoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgbWV0aG9kKSkge1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvYmplY3RbbWV0aG9kXSA9PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwob2JqZWN0W21ldGhvZF0pID09IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnMucHVzaChtZXRob2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGYgPSBmdW5jdGlvbnNbaV07XG4gICAgICAgIG9iamVjdFtmXSA9IGJpbmQob2JqZWN0W2ZdLCBvYmplY3QpO1xuICAgIH1cbn07XG5cbi8qXG4gICAgRmFzdGVyIGJpbmQgd2l0aG91dCBzcGVjaWZpYy1jYXNlIGNoZWNraW5nLiAoc2VlIGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wL29pM2ozdykuXG4gICAgYmluZEFsbCBpcyBvbmx5IG5lZWRlZCBmb3IgZXZlbnRzIGJpbmRpbmcgc28gbm8gbmVlZCB0byBtYWtlIHNsb3cgZml4ZXMgZm9yIGNvbnN0cnVjdG9yXG4gICAgb3IgcGFydGlhbCBhcHBsaWNhdGlvbi5cbiovXG5mdW5jdGlvbiBiaW5kKGZ1bmMsIGNvbnRleHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gIH07XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwidmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHVuZGVmaW5lZDtcblxudmFyIGlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgaGFzX293bl9jb25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG5cdHZhciBoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kID0gb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgJiYgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcblx0Ly8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuXHRpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNfb3duX2NvbnN0cnVjdG9yICYmICFoYXNfaXNfcHJvcGVydHlfb2ZfbWV0aG9kKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG5cdC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBvYmopIHt9XG5cblx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMF0sXG5cdFx0aSA9IDEsXG5cdFx0bGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcblx0XHRkZWVwID0gZmFsc2U7XG5cblx0Ly8gSGFuZGxlIGEgZGVlcCBjb3B5IHNpdHVhdGlvblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKCh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGFyZ2V0ICE9PSAnZnVuY3Rpb24nKSB8fCB0YXJnZXQgPT0gbnVsbCkge1xuXHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbaV07XG5cdFx0Ly8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuXHRcdGlmIChvcHRpb25zICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG47X19icm93c2VyaWZ5X3NoaW1fcmVxdWlyZV9fPXJlcXVpcmU7KGZ1bmN0aW9uIGJyb3dzZXJpZnlTaGltKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgZGVmaW5lLCBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXykge1xuLyohIGZvcmVhY2guanMgdjEuMS4wIHwgKGMpIDIwMTQgQHRvZGRtb3R0byB8IGh0dHBzOi8vZ2l0aHViLmNvbS90b2RkbW90dG8vZm9yZWFjaCAqL1xudmFyIGZvckVhY2g9ZnVuY3Rpb24odCxvLHIpe2lmKFwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpZm9yKHZhciBjIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsYykmJm8uY2FsbChyLHRbY10sYyx0KTtlbHNlIGZvcih2YXIgZT0wLGw9dC5sZW5ndGg7bD5lO2UrKylvLmNhbGwocix0W2VdLGUsdCl9O1xuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2YgZm9yRWFjaCAhPSBcInVuZGVmaW5lZFwiID8gZm9yRWFjaCA6IHdpbmRvdy5mb3JFYWNoKTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG47X19icm93c2VyaWZ5X3NoaW1fcmVxdWlyZV9fPXJlcXVpcmU7KGZ1bmN0aW9uIGJyb3dzZXJpZnlTaGltKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgZGVmaW5lLCBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXykge1xuLyohXG4gKiBWRVJTSU9OOiAxLjE0LjFcbiAqIERBVEU6IDIwMTQtMTAtMTZcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly93d3cuZ3JlZW5zb2NrLmNvbVxuICogXG4gKiBJbmNsdWRlcyBhbGwgb2YgdGhlIGZvbGxvd2luZzogVHdlZW5MaXRlLCBUd2Vlbk1heCwgVGltZWxpbmVMaXRlLCBUaW1lbGluZU1heCwgRWFzZVBhY2ssIENTU1BsdWdpbiwgUm91bmRQcm9wc1BsdWdpbiwgQmV6aWVyUGx1Z2luLCBBdHRyUGx1Z2luLCBEaXJlY3Rpb25hbFJvdGF0aW9uUGx1Z2luXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTQsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vd3d3LmdyZWVuc29jay5jb20vdGVybXNfb2ZfdXNlLmh0bWwgb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgc29mdHdhcmUgYWdyZWVtZW50IHRoYXQgd2FzIGlzc3VlZCB3aXRoIHlvdXIgbWVtYmVyc2hpcC5cbiAqIFxuICogQGF1dGhvcjogSmFjayBEb3lsZSwgamFja0BncmVlbnNvY2suY29tXG4gKiovXG52YXIgX2dzU2NvcGU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXN8fHdpbmRvdzsoX2dzU2NvcGUuX2dzUXVldWV8fChfZ3NTY29wZS5fZ3NRdWV1ZT1bXSkpLnB1c2goZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtfZ3NTY29wZS5fZ3NEZWZpbmUoXCJUd2Vlbk1heFwiLFtcImNvcmUuQW5pbWF0aW9uXCIsXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsXCJUd2VlbkxpdGVcIl0sZnVuY3Rpb24odCxlLGkpe3ZhciBzPWZ1bmN0aW9uKHQpe3ZhciBlLGk9W10scz10Lmxlbmd0aDtmb3IoZT0wO2UhPT1zO2kucHVzaCh0W2UrK10pKTtyZXR1cm4gaX0scj1mdW5jdGlvbih0LGUscyl7aS5jYWxsKHRoaXMsdCxlLHMpLHRoaXMuX2N5Y2xlPTAsdGhpcy5feW95bz10aGlzLnZhcnMueW95bz09PSEwLHRoaXMuX3JlcGVhdD10aGlzLnZhcnMucmVwZWF0fHwwLHRoaXMuX3JlcGVhdERlbGF5PXRoaXMudmFycy5yZXBlYXREZWxheXx8MCx0aGlzLl9kaXJ0eT0hMCx0aGlzLnJlbmRlcj1yLnByb3RvdHlwZS5yZW5kZXJ9LG49MWUtMTAsYT1pLl9pbnRlcm5hbHMsbz1hLmlzU2VsZWN0b3IsaD1hLmlzQXJyYXksbD1yLnByb3RvdHlwZT1pLnRvKHt9LC4xLHt9KSxfPVtdO3IudmVyc2lvbj1cIjEuMTQuMVwiLGwuY29uc3RydWN0b3I9cixsLmtpbGwoKS5fZ2M9ITEsci5raWxsVHdlZW5zT2Y9ci5raWxsRGVsYXllZENhbGxzVG89aS5raWxsVHdlZW5zT2Ysci5nZXRUd2VlbnNPZj1pLmdldFR3ZWVuc09mLHIubGFnU21vb3RoaW5nPWkubGFnU21vb3RoaW5nLHIudGlja2VyPWkudGlja2VyLHIucmVuZGVyPWkucmVuZGVyLGwuaW52YWxpZGF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl95b3lvPXRoaXMudmFycy55b3lvPT09ITAsdGhpcy5fcmVwZWF0PXRoaXMudmFycy5yZXBlYXR8fDAsdGhpcy5fcmVwZWF0RGVsYXk9dGhpcy52YXJzLnJlcGVhdERlbGF5fHwwLHRoaXMuX3VuY2FjaGUoITApLGkucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKX0sbC51cGRhdGVUbz1mdW5jdGlvbih0LGUpe3ZhciBzLHI9dGhpcy5yYXRpbztlJiZ0aGlzLl9zdGFydFRpbWU8dGhpcy5fdGltZWxpbmUuX3RpbWUmJih0aGlzLl9zdGFydFRpbWU9dGhpcy5fdGltZWxpbmUuX3RpbWUsdGhpcy5fdW5jYWNoZSghMSksdGhpcy5fZ2M/dGhpcy5fZW5hYmxlZCghMCwhMSk6dGhpcy5fdGltZWxpbmUuaW5zZXJ0KHRoaXMsdGhpcy5fc3RhcnRUaW1lLXRoaXMuX2RlbGF5KSk7Zm9yKHMgaW4gdCl0aGlzLnZhcnNbc109dFtzXTtpZih0aGlzLl9pbml0dGVkKWlmKGUpdGhpcy5faW5pdHRlZD0hMTtlbHNlIGlmKHRoaXMuX2djJiZ0aGlzLl9lbmFibGVkKCEwLCExKSx0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkJiZ0aGlzLl9maXJzdFBUJiZpLl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLHRoaXMpLHRoaXMuX3RpbWUvdGhpcy5fZHVyYXRpb24+Ljk5OCl7dmFyIG49dGhpcy5fdGltZTt0aGlzLnJlbmRlcigwLCEwLCExKSx0aGlzLl9pbml0dGVkPSExLHRoaXMucmVuZGVyKG4sITAsITEpfWVsc2UgaWYodGhpcy5fdGltZT4wKXt0aGlzLl9pbml0dGVkPSExLHRoaXMuX2luaXQoKTtmb3IodmFyIGEsbz0xLygxLXIpLGg9dGhpcy5fZmlyc3RQVDtoOylhPWgucytoLmMsaC5jKj1vLGgucz1hLWguYyxoPWguX25leHR9cmV0dXJuIHRoaXN9LGwucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLl9pbml0dGVkfHwwPT09dGhpcy5fZHVyYXRpb24mJnRoaXMudmFycy5yZXBlYXQmJnRoaXMuaW52YWxpZGF0ZSgpO3ZhciBzLHIsbyxoLGwsdSxwLGMsZj10aGlzLl9kaXJ0eT90aGlzLnRvdGFsRHVyYXRpb24oKTp0aGlzLl90b3RhbER1cmF0aW9uLG09dGhpcy5fdGltZSxkPXRoaXMuX3RvdGFsVGltZSxnPXRoaXMuX2N5Y2xlLHY9dGhpcy5fZHVyYXRpb24seT10aGlzLl9yYXdQcmV2VGltZTtpZih0Pj1mPyh0aGlzLl90b3RhbFRpbWU9Zix0aGlzLl9jeWNsZT10aGlzLl9yZXBlYXQsdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT8odGhpcy5fdGltZT0wLHRoaXMucmF0aW89dGhpcy5fZWFzZS5fY2FsY0VuZD90aGlzLl9lYXNlLmdldFJhdGlvKDApOjApOih0aGlzLl90aW1lPXYsdGhpcy5yYXRpbz10aGlzLl9lYXNlLl9jYWxjRW5kP3RoaXMuX2Vhc2UuZ2V0UmF0aW8oMSk6MSksdGhpcy5fcmV2ZXJzZWR8fChzPSEwLHI9XCJvbkNvbXBsZXRlXCIpLDA9PT12JiYodGhpcy5faW5pdHRlZHx8IXRoaXMudmFycy5sYXp5fHxpKSYmKHRoaXMuX3N0YXJ0VGltZT09PXRoaXMuX3RpbWVsaW5lLl9kdXJhdGlvbiYmKHQ9MCksKDA9PT10fHwwPnl8fHk9PT1uKSYmeSE9PXQmJihpPSEwLHk+biYmKHI9XCJvblJldmVyc2VDb21wbGV0ZVwiKSksdGhpcy5fcmF3UHJldlRpbWU9Yz0hZXx8dHx8eT09PXQ/dDpuKSk6MWUtNz50Pyh0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT10aGlzLl9jeWNsZT0wLHRoaXMucmF0aW89dGhpcy5fZWFzZS5fY2FsY0VuZD90aGlzLl9lYXNlLmdldFJhdGlvKDApOjAsKDAhPT1kfHwwPT09diYmeT4wJiZ5IT09bikmJihyPVwib25SZXZlcnNlQ29tcGxldGVcIixzPXRoaXMuX3JldmVyc2VkKSwwPnQmJih0aGlzLl9hY3RpdmU9ITEsMD09PXYmJih0aGlzLl9pbml0dGVkfHwhdGhpcy52YXJzLmxhenl8fGkpJiYoeT49MCYmKGk9ITApLHRoaXMuX3Jhd1ByZXZUaW1lPWM9IWV8fHR8fHk9PT10P3Q6bikpLHRoaXMuX2luaXR0ZWR8fChpPSEwKSk6KHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXQsMCE9PXRoaXMuX3JlcGVhdCYmKGg9dit0aGlzLl9yZXBlYXREZWxheSx0aGlzLl9jeWNsZT10aGlzLl90b3RhbFRpbWUvaD4+MCwwIT09dGhpcy5fY3ljbGUmJnRoaXMuX2N5Y2xlPT09dGhpcy5fdG90YWxUaW1lL2gmJnRoaXMuX2N5Y2xlLS0sdGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWUtdGhpcy5fY3ljbGUqaCx0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpJiYodGhpcy5fdGltZT12LXRoaXMuX3RpbWUpLHRoaXMuX3RpbWU+dj90aGlzLl90aW1lPXY6MD50aGlzLl90aW1lJiYodGhpcy5fdGltZT0wKSksdGhpcy5fZWFzZVR5cGU/KGw9dGhpcy5fdGltZS92LHU9dGhpcy5fZWFzZVR5cGUscD10aGlzLl9lYXNlUG93ZXIsKDE9PT11fHwzPT09dSYmbD49LjUpJiYobD0xLWwpLDM9PT11JiYobCo9MiksMT09PXA/bCo9bDoyPT09cD9sKj1sKmw6Mz09PXA/bCo9bCpsKmw6ND09PXAmJihsKj1sKmwqbCpsKSx0aGlzLnJhdGlvPTE9PT11PzEtbDoyPT09dT9sOi41PnRoaXMuX3RpbWUvdj9sLzI6MS1sLzIpOnRoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lL3YpKSxtPT09dGhpcy5fdGltZSYmIWkmJmc9PT10aGlzLl9jeWNsZSlyZXR1cm4gZCE9PXRoaXMuX3RvdGFsVGltZSYmdGhpcy5fb25VcGRhdGUmJihlfHx0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fF8pKSx2b2lkIDA7aWYoIXRoaXMuX2luaXR0ZWQpe2lmKHRoaXMuX2luaXQoKSwhdGhpcy5faW5pdHRlZHx8dGhpcy5fZ2MpcmV0dXJuO2lmKCFpJiZ0aGlzLl9maXJzdFBUJiYodGhpcy52YXJzLmxhenkhPT0hMSYmdGhpcy5fZHVyYXRpb258fHRoaXMudmFycy5sYXp5JiYhdGhpcy5fZHVyYXRpb24pKXJldHVybiB0aGlzLl90aW1lPW0sdGhpcy5fdG90YWxUaW1lPWQsdGhpcy5fcmF3UHJldlRpbWU9eSx0aGlzLl9jeWNsZT1nLGEubGF6eVR3ZWVucy5wdXNoKHRoaXMpLHRoaXMuX2xhenk9W3QsZV0sdm9pZCAwO3RoaXMuX3RpbWUmJiFzP3RoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lL3YpOnMmJnRoaXMuX2Vhc2UuX2NhbGNFbmQmJih0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8oMD09PXRoaXMuX3RpbWU/MDoxKSl9Zm9yKHRoaXMuX2xhenkhPT0hMSYmKHRoaXMuX2xhenk9ITEpLHRoaXMuX2FjdGl2ZXx8IXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZSE9PW0mJnQ+PTAmJih0aGlzLl9hY3RpdmU9ITApLDA9PT1kJiYoMj09PXRoaXMuX2luaXR0ZWQmJnQ+MCYmdGhpcy5faW5pdCgpLHRoaXMuX3N0YXJ0QXQmJih0Pj0wP3RoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKTpyfHwocj1cIl9kdW1teUdTXCIpKSx0aGlzLnZhcnMub25TdGFydCYmKDAhPT10aGlzLl90b3RhbFRpbWV8fDA9PT12KSYmKGV8fHRoaXMudmFycy5vblN0YXJ0LmFwcGx5KHRoaXMudmFycy5vblN0YXJ0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uU3RhcnRQYXJhbXN8fF8pKSksbz10aGlzLl9maXJzdFBUO287KW8uZj9vLnRbby5wXShvLmMqdGhpcy5yYXRpbytvLnMpOm8udFtvLnBdPW8uYyp0aGlzLnJhdGlvK28ucyxvPW8uX25leHQ7dGhpcy5fb25VcGRhdGUmJigwPnQmJnRoaXMuX3N0YXJ0QXQmJnRoaXMuX3N0YXJ0VGltZSYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLGV8fCh0aGlzLl90b3RhbFRpbWUhPT1kfHxzKSYmdGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHxfKSksdGhpcy5fY3ljbGUhPT1nJiYoZXx8dGhpcy5fZ2N8fHRoaXMudmFycy5vblJlcGVhdCYmdGhpcy52YXJzLm9uUmVwZWF0LmFwcGx5KHRoaXMudmFycy5vblJlcGVhdFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblJlcGVhdFBhcmFtc3x8XykpLHImJighdGhpcy5fZ2N8fGkpJiYoMD50JiZ0aGlzLl9zdGFydEF0JiYhdGhpcy5fb25VcGRhdGUmJnRoaXMuX3N0YXJ0VGltZSYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLHMmJih0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4mJnRoaXMuX2VuYWJsZWQoITEsITEpLHRoaXMuX2FjdGl2ZT0hMSksIWUmJnRoaXMudmFyc1tyXSYmdGhpcy52YXJzW3JdLmFwcGx5KHRoaXMudmFyc1tyK1wiU2NvcGVcIl18fHRoaXMsdGhpcy52YXJzW3IrXCJQYXJhbXNcIl18fF8pLDA9PT12JiZ0aGlzLl9yYXdQcmV2VGltZT09PW4mJmMhPT1uJiYodGhpcy5fcmF3UHJldlRpbWU9MCkpfSxyLnRvPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gbmV3IHIodCxlLGkpfSxyLmZyb209ZnVuY3Rpb24odCxlLGkpe3JldHVybiBpLnJ1bkJhY2t3YXJkcz0hMCxpLmltbWVkaWF0ZVJlbmRlcj0wIT1pLmltbWVkaWF0ZVJlbmRlcixuZXcgcih0LGUsaSl9LHIuZnJvbVRvPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiBzLnN0YXJ0QXQ9aSxzLmltbWVkaWF0ZVJlbmRlcj0wIT1zLmltbWVkaWF0ZVJlbmRlciYmMCE9aS5pbW1lZGlhdGVSZW5kZXIsbmV3IHIodCxlLHMpfSxyLnN0YWdnZXJUbz1yLmFsbFRvPWZ1bmN0aW9uKHQsZSxuLGEsbCx1LHApe2E9YXx8MDt2YXIgYyxmLG0sZCxnPW4uZGVsYXl8fDAsdj1bXSx5PWZ1bmN0aW9uKCl7bi5vbkNvbXBsZXRlJiZuLm9uQ29tcGxldGUuYXBwbHkobi5vbkNvbXBsZXRlU2NvcGV8fHRoaXMsYXJndW1lbnRzKSxsLmFwcGx5KHB8fHRoaXMsdXx8Xyl9O2ZvcihoKHQpfHwoXCJzdHJpbmdcIj09dHlwZW9mIHQmJih0PWkuc2VsZWN0b3IodCl8fHQpLG8odCkmJih0PXModCkpKSx0PXR8fFtdLDA+YSYmKHQ9cyh0KSx0LnJldmVyc2UoKSxhKj0tMSksYz10Lmxlbmd0aC0xLG09MDtjPj1tO20rKyl7Zj17fTtmb3IoZCBpbiBuKWZbZF09bltkXTtmLmRlbGF5PWcsbT09PWMmJmwmJihmLm9uQ29tcGxldGU9eSksdlttXT1uZXcgcih0W21dLGUsZiksZys9YX1yZXR1cm4gdn0sci5zdGFnZ2VyRnJvbT1yLmFsbEZyb209ZnVuY3Rpb24odCxlLGkscyxuLGEsbyl7cmV0dXJuIGkucnVuQmFja3dhcmRzPSEwLGkuaW1tZWRpYXRlUmVuZGVyPTAhPWkuaW1tZWRpYXRlUmVuZGVyLHIuc3RhZ2dlclRvKHQsZSxpLHMsbixhLG8pfSxyLnN0YWdnZXJGcm9tVG89ci5hbGxGcm9tVG89ZnVuY3Rpb24odCxlLGkscyxuLGEsbyxoKXtyZXR1cm4gcy5zdGFydEF0PWkscy5pbW1lZGlhdGVSZW5kZXI9MCE9cy5pbW1lZGlhdGVSZW5kZXImJjAhPWkuaW1tZWRpYXRlUmVuZGVyLHIuc3RhZ2dlclRvKHQsZSxzLG4sYSxvLGgpfSxyLmRlbGF5ZWRDYWxsPWZ1bmN0aW9uKHQsZSxpLHMsbil7cmV0dXJuIG5ldyByKGUsMCx7ZGVsYXk6dCxvbkNvbXBsZXRlOmUsb25Db21wbGV0ZVBhcmFtczppLG9uQ29tcGxldGVTY29wZTpzLG9uUmV2ZXJzZUNvbXBsZXRlOmUsb25SZXZlcnNlQ29tcGxldGVQYXJhbXM6aSxvblJldmVyc2VDb21wbGV0ZVNjb3BlOnMsaW1tZWRpYXRlUmVuZGVyOiExLHVzZUZyYW1lczpuLG92ZXJ3cml0ZTowfSl9LHIuc2V0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG5ldyByKHQsMCxlKX0sci5pc1R3ZWVuaW5nPWZ1bmN0aW9uKHQpe3JldHVybiBpLmdldFR3ZWVuc09mKHQsITApLmxlbmd0aD4wfTt2YXIgdT1mdW5jdGlvbih0LGUpe2Zvcih2YXIgcz1bXSxyPTAsbj10Ll9maXJzdDtuOyluIGluc3RhbmNlb2YgaT9zW3IrK109bjooZSYmKHNbcisrXT1uKSxzPXMuY29uY2F0KHUobixlKSkscj1zLmxlbmd0aCksbj1uLl9uZXh0O3JldHVybiBzfSxwPXIuZ2V0QWxsVHdlZW5zPWZ1bmN0aW9uKGUpe3JldHVybiB1KHQuX3Jvb3RUaW1lbGluZSxlKS5jb25jYXQodSh0Ll9yb290RnJhbWVzVGltZWxpbmUsZSkpfTtyLmtpbGxBbGw9ZnVuY3Rpb24odCxpLHMscil7bnVsbD09aSYmKGk9ITApLG51bGw9PXMmJihzPSEwKTt2YXIgbixhLG8saD1wKDAhPXIpLGw9aC5sZW5ndGgsXz1pJiZzJiZyO2ZvcihvPTA7bD5vO28rKylhPWhbb10sKF98fGEgaW5zdGFuY2VvZiBlfHwobj1hLnRhcmdldD09PWEudmFycy5vbkNvbXBsZXRlKSYmc3x8aSYmIW4pJiYodD9hLnRvdGFsVGltZShhLl9yZXZlcnNlZD8wOmEudG90YWxEdXJhdGlvbigpKTphLl9lbmFibGVkKCExLCExKSl9LHIua2lsbENoaWxkVHdlZW5zT2Y9ZnVuY3Rpb24odCxlKXtpZihudWxsIT10KXt2YXIgbixsLF8sdSxwLGM9YS50d2Vlbkxvb2t1cDtpZihcInN0cmluZ1wiPT10eXBlb2YgdCYmKHQ9aS5zZWxlY3Rvcih0KXx8dCksbyh0KSYmKHQ9cyh0KSksaCh0KSlmb3IodT10Lmxlbmd0aDstLXU+LTE7KXIua2lsbENoaWxkVHdlZW5zT2YodFt1XSxlKTtlbHNle249W107Zm9yKF8gaW4gYylmb3IobD1jW19dLnRhcmdldC5wYXJlbnROb2RlO2w7KWw9PT10JiYobj1uLmNvbmNhdChjW19dLnR3ZWVucykpLGw9bC5wYXJlbnROb2RlO2ZvcihwPW4ubGVuZ3RoLHU9MDtwPnU7dSsrKWUmJm5bdV0udG90YWxUaW1lKG5bdV0udG90YWxEdXJhdGlvbigpKSxuW3VdLl9lbmFibGVkKCExLCExKX19fTt2YXIgYz1mdW5jdGlvbih0LGkscyxyKXtpPWkhPT0hMSxzPXMhPT0hMSxyPXIhPT0hMTtmb3IodmFyIG4sYSxvPXAociksaD1pJiZzJiZyLGw9by5sZW5ndGg7LS1sPi0xOylhPW9bbF0sKGh8fGEgaW5zdGFuY2VvZiBlfHwobj1hLnRhcmdldD09PWEudmFycy5vbkNvbXBsZXRlKSYmc3x8aSYmIW4pJiZhLnBhdXNlZCh0KX07cmV0dXJuIHIucGF1c2VBbGw9ZnVuY3Rpb24odCxlLGkpe2MoITAsdCxlLGkpfSxyLnJlc3VtZUFsbD1mdW5jdGlvbih0LGUsaSl7YyghMSx0LGUsaSl9LHIuZ2xvYmFsVGltZVNjYWxlPWZ1bmN0aW9uKGUpe3ZhciBzPXQuX3Jvb3RUaW1lbGluZSxyPWkudGlja2VyLnRpbWU7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGU9ZXx8bixzLl9zdGFydFRpbWU9ci0oci1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZS9lLHM9dC5fcm9vdEZyYW1lc1RpbWVsaW5lLHI9aS50aWNrZXIuZnJhbWUscy5fc3RhcnRUaW1lPXItKHItcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUvZSxzLl90aW1lU2NhbGU9dC5fcm9vdFRpbWVsaW5lLl90aW1lU2NhbGU9ZSxlKTpzLl90aW1lU2NhbGV9LGwucHJvZ3Jlc3M9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy5kdXJhdGlvbigpKih0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpPzEtdDp0KSt0aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpLCExKTp0aGlzLl90aW1lL3RoaXMuZHVyYXRpb24oKX0sbC50b3RhbFByb2dyZXNzPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMudG90YWxUaW1lKHRoaXMudG90YWxEdXJhdGlvbigpKnQsITEpOnRoaXMuX3RvdGFsVGltZS90aGlzLnRvdGFsRHVyYXRpb24oKX0sbC50aW1lPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX2RpcnR5JiZ0aGlzLnRvdGFsRHVyYXRpb24oKSx0PnRoaXMuX2R1cmF0aW9uJiYodD10aGlzLl9kdXJhdGlvbiksdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT90PXRoaXMuX2R1cmF0aW9uLXQrdGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KTowIT09dGhpcy5fcmVwZWF0JiYodCs9dGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KSksdGhpcy50b3RhbFRpbWUodCxlKSk6dGhpcy5fdGltZX0sbC5kdXJhdGlvbj1mdW5jdGlvbihlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90LnByb3RvdHlwZS5kdXJhdGlvbi5jYWxsKHRoaXMsZSk6dGhpcy5fZHVyYXRpb259LGwudG90YWxEdXJhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8tMT09PXRoaXMuX3JlcGVhdD90aGlzOnRoaXMuZHVyYXRpb24oKHQtdGhpcy5fcmVwZWF0KnRoaXMuX3JlcGVhdERlbGF5KS8odGhpcy5fcmVwZWF0KzEpKToodGhpcy5fZGlydHkmJih0aGlzLl90b3RhbER1cmF0aW9uPS0xPT09dGhpcy5fcmVwZWF0Pzk5OTk5OTk5OTk5OTp0aGlzLl9kdXJhdGlvbioodGhpcy5fcmVwZWF0KzEpK3RoaXMuX3JlcGVhdERlbGF5KnRoaXMuX3JlcGVhdCx0aGlzLl9kaXJ0eT0hMSksdGhpcy5fdG90YWxEdXJhdGlvbil9LGwucmVwZWF0PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZXBlYXQ9dCx0aGlzLl91bmNhY2hlKCEwKSk6dGhpcy5fcmVwZWF0fSxsLnJlcGVhdERlbGF5PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZXBlYXREZWxheT10LHRoaXMuX3VuY2FjaGUoITApKTp0aGlzLl9yZXBlYXREZWxheX0sbC55b3lvPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl95b3lvPXQsdGhpcyk6dGhpcy5feW95b30scn0sITApLF9nc1Njb3BlLl9nc0RlZmluZShcIlRpbWVsaW5lTGl0ZVwiLFtcImNvcmUuQW5pbWF0aW9uXCIsXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsXCJUd2VlbkxpdGVcIl0sZnVuY3Rpb24odCxlLGkpe3ZhciBzPWZ1bmN0aW9uKHQpe2UuY2FsbCh0aGlzLHQpLHRoaXMuX2xhYmVscz17fSx0aGlzLmF1dG9SZW1vdmVDaGlsZHJlbj10aGlzLnZhcnMuYXV0b1JlbW92ZUNoaWxkcmVuPT09ITAsdGhpcy5zbW9vdGhDaGlsZFRpbWluZz10aGlzLnZhcnMuc21vb3RoQ2hpbGRUaW1pbmc9PT0hMCx0aGlzLl9zb3J0Q2hpbGRyZW49ITAsdGhpcy5fb25VcGRhdGU9dGhpcy52YXJzLm9uVXBkYXRlO3ZhciBpLHMscj10aGlzLnZhcnM7Zm9yKHMgaW4gcilpPXJbc10sbyhpKSYmLTEhPT1pLmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSYmKHJbc109dGhpcy5fc3dhcFNlbGZJblBhcmFtcyhpKSk7byhyLnR3ZWVucykmJnRoaXMuYWRkKHIudHdlZW5zLDAsci5hbGlnbixyLnN0YWdnZXIpfSxyPTFlLTEwLG49aS5faW50ZXJuYWxzLGE9bi5pc1NlbGVjdG9yLG89bi5pc0FycmF5LGg9bi5sYXp5VHdlZW5zLGw9bi5sYXp5UmVuZGVyLF89W10sdT1fZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxwPWZ1bmN0aW9uKHQpe3ZhciBlLGk9e307Zm9yKGUgaW4gdClpW2VdPXRbZV07cmV0dXJuIGl9LGM9ZnVuY3Rpb24odCxlLGkscyl7dmFyIHI9dC5fdGltZWxpbmUuX3RvdGFsVGltZTsoZXx8IXRoaXMuX2ZvcmNpbmdQbGF5aGVhZCkmJih0Ll90aW1lbGluZS5wYXVzZSh0Ll9zdGFydFRpbWUpLGUmJmUuYXBwbHkoc3x8dC5fdGltZWxpbmUsaXx8XyksdGhpcy5fZm9yY2luZ1BsYXloZWFkJiZ0Ll90aW1lbGluZS5zZWVrKHIpKX0sZj1mdW5jdGlvbih0KXt2YXIgZSxpPVtdLHM9dC5sZW5ndGg7Zm9yKGU9MDtlIT09cztpLnB1c2godFtlKytdKSk7cmV0dXJuIGl9LG09cy5wcm90b3R5cGU9bmV3IGU7cmV0dXJuIHMudmVyc2lvbj1cIjEuMTQuMVwiLG0uY29uc3RydWN0b3I9cyxtLmtpbGwoKS5fZ2M9bS5fZm9yY2luZ1BsYXloZWFkPSExLG0udG89ZnVuY3Rpb24odCxlLHMscil7dmFyIG49cy5yZXBlYXQmJnUuVHdlZW5NYXh8fGk7cmV0dXJuIGU/dGhpcy5hZGQobmV3IG4odCxlLHMpLHIpOnRoaXMuc2V0KHQscyxyKX0sbS5mcm9tPWZ1bmN0aW9uKHQsZSxzLHIpe3JldHVybiB0aGlzLmFkZCgocy5yZXBlYXQmJnUuVHdlZW5NYXh8fGkpLmZyb20odCxlLHMpLHIpfSxtLmZyb21Ubz1mdW5jdGlvbih0LGUscyxyLG4pe3ZhciBhPXIucmVwZWF0JiZ1LlR3ZWVuTWF4fHxpO3JldHVybiBlP3RoaXMuYWRkKGEuZnJvbVRvKHQsZSxzLHIpLG4pOnRoaXMuc2V0KHQscixuKX0sbS5zdGFnZ2VyVG89ZnVuY3Rpb24odCxlLHIsbixvLGgsbCxfKXt2YXIgdSxjPW5ldyBzKHtvbkNvbXBsZXRlOmgsb25Db21wbGV0ZVBhcmFtczpsLG9uQ29tcGxldGVTY29wZTpfLHNtb290aENoaWxkVGltaW5nOnRoaXMuc21vb3RoQ2hpbGRUaW1pbmd9KTtmb3IoXCJzdHJpbmdcIj09dHlwZW9mIHQmJih0PWkuc2VsZWN0b3IodCl8fHQpLHQ9dHx8W10sYSh0KSYmKHQ9Zih0KSksbj1ufHwwLDA+biYmKHQ9Zih0KSx0LnJldmVyc2UoKSxuKj0tMSksdT0wO3QubGVuZ3RoPnU7dSsrKXIuc3RhcnRBdCYmKHIuc3RhcnRBdD1wKHIuc3RhcnRBdCkpLGMudG8odFt1XSxlLHAociksdSpuKTtyZXR1cm4gdGhpcy5hZGQoYyxvKX0sbS5zdGFnZ2VyRnJvbT1mdW5jdGlvbih0LGUsaSxzLHIsbixhLG8pe3JldHVybiBpLmltbWVkaWF0ZVJlbmRlcj0wIT1pLmltbWVkaWF0ZVJlbmRlcixpLnJ1bkJhY2t3YXJkcz0hMCx0aGlzLnN0YWdnZXJUbyh0LGUsaSxzLHIsbixhLG8pfSxtLnN0YWdnZXJGcm9tVG89ZnVuY3Rpb24odCxlLGkscyxyLG4sYSxvLGgpe3JldHVybiBzLnN0YXJ0QXQ9aSxzLmltbWVkaWF0ZVJlbmRlcj0wIT1zLmltbWVkaWF0ZVJlbmRlciYmMCE9aS5pbW1lZGlhdGVSZW5kZXIsdGhpcy5zdGFnZ2VyVG8odCxlLHMscixuLGEsbyxoKX0sbS5jYWxsPWZ1bmN0aW9uKHQsZSxzLHIpe3JldHVybiB0aGlzLmFkZChpLmRlbGF5ZWRDYWxsKDAsdCxlLHMpLHIpfSxtLnNldD1mdW5jdGlvbih0LGUscyl7cmV0dXJuIHM9dGhpcy5fcGFyc2VUaW1lT3JMYWJlbChzLDAsITApLG51bGw9PWUuaW1tZWRpYXRlUmVuZGVyJiYoZS5pbW1lZGlhdGVSZW5kZXI9cz09PXRoaXMuX3RpbWUmJiF0aGlzLl9wYXVzZWQpLHRoaXMuYWRkKG5ldyBpKHQsMCxlKSxzKX0scy5leHBvcnRSb290PWZ1bmN0aW9uKHQsZSl7dD10fHx7fSxudWxsPT10LnNtb290aENoaWxkVGltaW5nJiYodC5zbW9vdGhDaGlsZFRpbWluZz0hMCk7dmFyIHIsbixhPW5ldyBzKHQpLG89YS5fdGltZWxpbmU7Zm9yKG51bGw9PWUmJihlPSEwKSxvLl9yZW1vdmUoYSwhMCksYS5fc3RhcnRUaW1lPTAsYS5fcmF3UHJldlRpbWU9YS5fdGltZT1hLl90b3RhbFRpbWU9by5fdGltZSxyPW8uX2ZpcnN0O3I7KW49ci5fbmV4dCxlJiZyIGluc3RhbmNlb2YgaSYmci50YXJnZXQ9PT1yLnZhcnMub25Db21wbGV0ZXx8YS5hZGQocixyLl9zdGFydFRpbWUtci5fZGVsYXkpLHI9bjtyZXR1cm4gby5hZGQoYSwwKSxhfSxtLmFkZD1mdW5jdGlvbihyLG4sYSxoKXt2YXIgbCxfLHUscCxjLGY7aWYoXCJudW1iZXJcIiE9dHlwZW9mIG4mJihuPXRoaXMuX3BhcnNlVGltZU9yTGFiZWwobiwwLCEwLHIpKSwhKHIgaW5zdGFuY2VvZiB0KSl7aWYociBpbnN0YW5jZW9mIEFycmF5fHxyJiZyLnB1c2gmJm8ocikpe2ZvcihhPWF8fFwibm9ybWFsXCIsaD1ofHwwLGw9bixfPXIubGVuZ3RoLHU9MDtfPnU7dSsrKW8ocD1yW3VdKSYmKHA9bmV3IHMoe3R3ZWVuczpwfSkpLHRoaXMuYWRkKHAsbCksXCJzdHJpbmdcIiE9dHlwZW9mIHAmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHAmJihcInNlcXVlbmNlXCI9PT1hP2w9cC5fc3RhcnRUaW1lK3AudG90YWxEdXJhdGlvbigpL3AuX3RpbWVTY2FsZTpcInN0YXJ0XCI9PT1hJiYocC5fc3RhcnRUaW1lLT1wLmRlbGF5KCkpKSxsKz1oO3JldHVybiB0aGlzLl91bmNhY2hlKCEwKX1pZihcInN0cmluZ1wiPT10eXBlb2YgcilyZXR1cm4gdGhpcy5hZGRMYWJlbChyLG4pO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHIpdGhyb3dcIkNhbm5vdCBhZGQgXCIrcitcIiBpbnRvIHRoZSB0aW1lbGluZTsgaXQgaXMgbm90IGEgdHdlZW4sIHRpbWVsaW5lLCBmdW5jdGlvbiwgb3Igc3RyaW5nLlwiO3I9aS5kZWxheWVkQ2FsbCgwLHIpfWlmKGUucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMscixuKSwodGhpcy5fZ2N8fHRoaXMuX3RpbWU9PT10aGlzLl9kdXJhdGlvbikmJiF0aGlzLl9wYXVzZWQmJnRoaXMuX2R1cmF0aW9uPHRoaXMuZHVyYXRpb24oKSlmb3IoYz10aGlzLGY9Yy5yYXdUaW1lKCk+ci5fc3RhcnRUaW1lO2MuX3RpbWVsaW5lOylmJiZjLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZz9jLnRvdGFsVGltZShjLl90b3RhbFRpbWUsITApOmMuX2djJiZjLl9lbmFibGVkKCEwLCExKSxjPWMuX3RpbWVsaW5lO3JldHVybiB0aGlzfSxtLnJlbW92ZT1mdW5jdGlvbihlKXtpZihlIGluc3RhbmNlb2YgdClyZXR1cm4gdGhpcy5fcmVtb3ZlKGUsITEpO2lmKGUgaW5zdGFuY2VvZiBBcnJheXx8ZSYmZS5wdXNoJiZvKGUpKXtmb3IodmFyIGk9ZS5sZW5ndGg7LS1pPi0xOyl0aGlzLnJlbW92ZShlW2ldKTtyZXR1cm4gdGhpc31yZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT90aGlzLnJlbW92ZUxhYmVsKGUpOnRoaXMua2lsbChudWxsLGUpfSxtLl9yZW1vdmU9ZnVuY3Rpb24odCxpKXtlLnByb3RvdHlwZS5fcmVtb3ZlLmNhbGwodGhpcyx0LGkpO3ZhciBzPXRoaXMuX2xhc3Q7cmV0dXJuIHM/dGhpcy5fdGltZT5zLl9zdGFydFRpbWUrcy5fdG90YWxEdXJhdGlvbi9zLl90aW1lU2NhbGUmJih0aGlzLl90aW1lPXRoaXMuZHVyYXRpb24oKSx0aGlzLl90b3RhbFRpbWU9dGhpcy5fdG90YWxEdXJhdGlvbik6dGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWU9dGhpcy5fZHVyYXRpb249dGhpcy5fdG90YWxEdXJhdGlvbj0wLHRoaXN9LG0uYXBwZW5kPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuYWRkKHQsdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChudWxsLGUsITAsdCkpfSxtLmluc2VydD1tLmluc2VydE11bHRpcGxlPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiB0aGlzLmFkZCh0LGV8fDAsaSxzKX0sbS5hcHBlbmRNdWx0aXBsZT1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gdGhpcy5hZGQodCx0aGlzLl9wYXJzZVRpbWVPckxhYmVsKG51bGwsZSwhMCx0KSxpLHMpfSxtLmFkZExhYmVsPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuX2xhYmVsc1t0XT10aGlzLl9wYXJzZVRpbWVPckxhYmVsKGUpLHRoaXN9LG0uYWRkUGF1c2U9ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHRoaXMuY2FsbChjLFtcIntzZWxmfVwiLGUsaSxzXSx0aGlzLHQpfSxtLnJlbW92ZUxhYmVsPWZ1bmN0aW9uKHQpe3JldHVybiBkZWxldGUgdGhpcy5fbGFiZWxzW3RdLHRoaXN9LG0uZ2V0TGFiZWxUaW1lPWZ1bmN0aW9uKHQpe3JldHVybiBudWxsIT10aGlzLl9sYWJlbHNbdF0/dGhpcy5fbGFiZWxzW3RdOi0xfSxtLl9wYXJzZVRpbWVPckxhYmVsPWZ1bmN0aW9uKGUsaSxzLHIpe3ZhciBuO2lmKHIgaW5zdGFuY2VvZiB0JiZyLnRpbWVsaW5lPT09dGhpcyl0aGlzLnJlbW92ZShyKTtlbHNlIGlmKHImJihyIGluc3RhbmNlb2YgQXJyYXl8fHIucHVzaCYmbyhyKSkpZm9yKG49ci5sZW5ndGg7LS1uPi0xOylyW25daW5zdGFuY2VvZiB0JiZyW25dLnRpbWVsaW5lPT09dGhpcyYmdGhpcy5yZW1vdmUocltuXSk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGkpcmV0dXJuIHRoaXMuX3BhcnNlVGltZU9yTGFiZWwoaSxzJiZcIm51bWJlclwiPT10eXBlb2YgZSYmbnVsbD09dGhpcy5fbGFiZWxzW2ldP2UtdGhpcy5kdXJhdGlvbigpOjAscyk7aWYoaT1pfHwwLFwic3RyaW5nXCIhPXR5cGVvZiBlfHwhaXNOYU4oZSkmJm51bGw9PXRoaXMuX2xhYmVsc1tlXSludWxsPT1lJiYoZT10aGlzLmR1cmF0aW9uKCkpO2Vsc2V7aWYobj1lLmluZGV4T2YoXCI9XCIpLC0xPT09bilyZXR1cm4gbnVsbD09dGhpcy5fbGFiZWxzW2VdP3M/dGhpcy5fbGFiZWxzW2VdPXRoaXMuZHVyYXRpb24oKStpOmk6dGhpcy5fbGFiZWxzW2VdK2k7aT1wYXJzZUludChlLmNoYXJBdChuLTEpK1wiMVwiLDEwKSpOdW1iZXIoZS5zdWJzdHIobisxKSksZT1uPjE/dGhpcy5fcGFyc2VUaW1lT3JMYWJlbChlLnN1YnN0cigwLG4tMSksMCxzKTp0aGlzLmR1cmF0aW9uKCl9cmV0dXJuIE51bWJlcihlKStpfSxtLnNlZWs9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy50b3RhbFRpbWUoXCJudW1iZXJcIj09dHlwZW9mIHQ/dDp0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHQpLGUhPT0hMSl9LG0uc3RvcD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdXNlZCghMCl9LG0uZ290b0FuZFBsYXk9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5wbGF5KHQsZSl9LG0uZ290b0FuZFN0b3A9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5wYXVzZSh0LGUpfSxtLnJlbmRlcj1mdW5jdGlvbih0LGUsaSl7dGhpcy5fZ2MmJnRoaXMuX2VuYWJsZWQoITAsITEpO3ZhciBzLG4sYSxvLHUscD10aGlzLl9kaXJ0eT90aGlzLnRvdGFsRHVyYXRpb24oKTp0aGlzLl90b3RhbER1cmF0aW9uLGM9dGhpcy5fdGltZSxmPXRoaXMuX3N0YXJ0VGltZSxtPXRoaXMuX3RpbWVTY2FsZSxkPXRoaXMuX3BhdXNlZDtpZih0Pj1wPyh0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT1wLHRoaXMuX3JldmVyc2VkfHx0aGlzLl9oYXNQYXVzZWRDaGlsZCgpfHwobj0hMCxvPVwib25Db21wbGV0ZVwiLDA9PT10aGlzLl9kdXJhdGlvbiYmKDA9PT10fHwwPnRoaXMuX3Jhd1ByZXZUaW1lfHx0aGlzLl9yYXdQcmV2VGltZT09PXIpJiZ0aGlzLl9yYXdQcmV2VGltZSE9PXQmJnRoaXMuX2ZpcnN0JiYodT0hMCx0aGlzLl9yYXdQcmV2VGltZT5yJiYobz1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIpKSksdGhpcy5fcmF3UHJldlRpbWU9dGhpcy5fZHVyYXRpb258fCFlfHx0fHx0aGlzLl9yYXdQcmV2VGltZT09PXQ/dDpyLHQ9cCsxZS00KToxZS03PnQ/KHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPTAsKDAhPT1jfHwwPT09dGhpcy5fZHVyYXRpb24mJnRoaXMuX3Jhd1ByZXZUaW1lIT09ciYmKHRoaXMuX3Jhd1ByZXZUaW1lPjB8fDA+dCYmdGhpcy5fcmF3UHJldlRpbWU+PTApKSYmKG89XCJvblJldmVyc2VDb21wbGV0ZVwiLG49dGhpcy5fcmV2ZXJzZWQpLDA+dD8odGhpcy5fYWN0aXZlPSExLHRoaXMuX3Jhd1ByZXZUaW1lPj0wJiZ0aGlzLl9maXJzdCYmKHU9ITApLHRoaXMuX3Jhd1ByZXZUaW1lPXQpOih0aGlzLl9yYXdQcmV2VGltZT10aGlzLl9kdXJhdGlvbnx8IWV8fHR8fHRoaXMuX3Jhd1ByZXZUaW1lPT09dD90OnIsdD0wLHRoaXMuX2luaXR0ZWR8fCh1PSEwKSkpOnRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXRoaXMuX3Jhd1ByZXZUaW1lPXQsdGhpcy5fdGltZSE9PWMmJnRoaXMuX2ZpcnN0fHxpfHx1KXtpZih0aGlzLl9pbml0dGVkfHwodGhpcy5faW5pdHRlZD0hMCksdGhpcy5fYWN0aXZlfHwhdGhpcy5fcGF1c2VkJiZ0aGlzLl90aW1lIT09YyYmdD4wJiYodGhpcy5fYWN0aXZlPSEwKSwwPT09YyYmdGhpcy52YXJzLm9uU3RhcnQmJjAhPT10aGlzLl90aW1lJiYoZXx8dGhpcy52YXJzLm9uU3RhcnQuYXBwbHkodGhpcy52YXJzLm9uU3RhcnRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25TdGFydFBhcmFtc3x8XykpLHRoaXMuX3RpbWU+PWMpZm9yKHM9dGhpcy5fZmlyc3Q7cyYmKGE9cy5fbmV4dCwhdGhpcy5fcGF1c2VkfHxkKTspKHMuX2FjdGl2ZXx8cy5fc3RhcnRUaW1lPD10aGlzLl90aW1lJiYhcy5fcGF1c2VkJiYhcy5fZ2MpJiYocy5fcmV2ZXJzZWQ/cy5yZW5kZXIoKHMuX2RpcnR5P3MudG90YWxEdXJhdGlvbigpOnMuX3RvdGFsRHVyYXRpb24pLSh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSk6cy5yZW5kZXIoKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKSkscz1hO2Vsc2UgZm9yKHM9dGhpcy5fbGFzdDtzJiYoYT1zLl9wcmV2LCF0aGlzLl9wYXVzZWR8fGQpOykocy5fYWN0aXZlfHxjPj1zLl9zdGFydFRpbWUmJiFzLl9wYXVzZWQmJiFzLl9nYykmJihzLl9yZXZlcnNlZD9zLnJlbmRlcigocy5fZGlydHk/cy50b3RhbER1cmF0aW9uKCk6cy5fdG90YWxEdXJhdGlvbiktKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKTpzLnJlbmRlcigodC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpKSxzPWE7dGhpcy5fb25VcGRhdGUmJihlfHwoaC5sZW5ndGgmJmwoKSx0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fF8pKSksbyYmKHRoaXMuX2djfHwoZj09PXRoaXMuX3N0YXJ0VGltZXx8bSE9PXRoaXMuX3RpbWVTY2FsZSkmJigwPT09dGhpcy5fdGltZXx8cD49dGhpcy50b3RhbER1cmF0aW9uKCkpJiYobiYmKGgubGVuZ3RoJiZsKCksdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuJiZ0aGlzLl9lbmFibGVkKCExLCExKSx0aGlzLl9hY3RpdmU9ITEpLCFlJiZ0aGlzLnZhcnNbb10mJnRoaXMudmFyc1tvXS5hcHBseSh0aGlzLnZhcnNbbytcIlNjb3BlXCJdfHx0aGlzLHRoaXMudmFyc1tvK1wiUGFyYW1zXCJdfHxfKSkpfX0sbS5faGFzUGF1c2VkQ2hpbGQ9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcy5fZmlyc3Q7dDspe2lmKHQuX3BhdXNlZHx8dCBpbnN0YW5jZW9mIHMmJnQuX2hhc1BhdXNlZENoaWxkKCkpcmV0dXJuITA7dD10Ll9uZXh0fXJldHVybiExfSxtLmdldENoaWxkcmVuPWZ1bmN0aW9uKHQsZSxzLHIpe3I9cnx8LTk5OTk5OTk5OTk7Zm9yKHZhciBuPVtdLGE9dGhpcy5fZmlyc3Qsbz0wO2E7KXI+YS5fc3RhcnRUaW1lfHwoYSBpbnN0YW5jZW9mIGk/ZSE9PSExJiYobltvKytdPWEpOihzIT09ITEmJihuW28rK109YSksdCE9PSExJiYobj1uLmNvbmNhdChhLmdldENoaWxkcmVuKCEwLGUscykpLG89bi5sZW5ndGgpKSksYT1hLl9uZXh0O3JldHVybiBufSxtLmdldFR3ZWVuc09mPWZ1bmN0aW9uKHQsZSl7dmFyIHMscixuPXRoaXMuX2djLGE9W10sbz0wO2ZvcihuJiZ0aGlzLl9lbmFibGVkKCEwLCEwKSxzPWkuZ2V0VHdlZW5zT2YodCkscj1zLmxlbmd0aDstLXI+LTE7KShzW3JdLnRpbWVsaW5lPT09dGhpc3x8ZSYmdGhpcy5fY29udGFpbnMoc1tyXSkpJiYoYVtvKytdPXNbcl0pO3JldHVybiBuJiZ0aGlzLl9lbmFibGVkKCExLCEwKSxhfSxtLnJlY2VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWNlbnR9LG0uX2NvbnRhaW5zPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10LnRpbWVsaW5lO2U7KXtpZihlPT09dGhpcylyZXR1cm4hMDtlPWUudGltZWxpbmV9cmV0dXJuITF9LG0uc2hpZnRDaGlsZHJlbj1mdW5jdGlvbih0LGUsaSl7aT1pfHwwO2Zvcih2YXIgcyxyPXRoaXMuX2ZpcnN0LG49dGhpcy5fbGFiZWxzO3I7KXIuX3N0YXJ0VGltZT49aSYmKHIuX3N0YXJ0VGltZSs9dCkscj1yLl9uZXh0O2lmKGUpZm9yKHMgaW4gbiluW3NdPj1pJiYobltzXSs9dCk7cmV0dXJuIHRoaXMuX3VuY2FjaGUoITApfSxtLl9raWxsPWZ1bmN0aW9uKHQsZSl7aWYoIXQmJiFlKXJldHVybiB0aGlzLl9lbmFibGVkKCExLCExKTtmb3IodmFyIGk9ZT90aGlzLmdldFR3ZWVuc09mKGUpOnRoaXMuZ2V0Q2hpbGRyZW4oITAsITAsITEpLHM9aS5sZW5ndGgscj0hMTstLXM+LTE7KWlbc10uX2tpbGwodCxlKSYmKHI9ITApO3JldHVybiByfSxtLmNsZWFyPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuZ2V0Q2hpbGRyZW4oITEsITAsITApLGk9ZS5sZW5ndGg7Zm9yKHRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lPTA7LS1pPi0xOyllW2ldLl9lbmFibGVkKCExLCExKTtyZXR1cm4gdCE9PSExJiYodGhpcy5fbGFiZWxzPXt9KSx0aGlzLl91bmNhY2hlKCEwKX0sbS5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX2ZpcnN0O2U7KWUuaW52YWxpZGF0ZSgpLGU9ZS5fbmV4dDtyZXR1cm4gdC5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpfSxtLl9lbmFibGVkPWZ1bmN0aW9uKHQsaSl7aWYodD09PXRoaXMuX2djKWZvcih2YXIgcz10aGlzLl9maXJzdDtzOylzLl9lbmFibGVkKHQsITApLHM9cy5fbmV4dDtyZXR1cm4gZS5wcm90b3R5cGUuX2VuYWJsZWQuY2FsbCh0aGlzLHQsaSl9LG0udG90YWxUaW1lPWZ1bmN0aW9uKCl7dGhpcy5fZm9yY2luZ1BsYXloZWFkPSEwO3ZhciBlPXQucHJvdG90eXBlLnRvdGFsVGltZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIHRoaXMuX2ZvcmNpbmdQbGF5aGVhZD0hMSxlfSxtLmR1cmF0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPygwIT09dGhpcy5kdXJhdGlvbigpJiYwIT09dCYmdGhpcy50aW1lU2NhbGUodGhpcy5fZHVyYXRpb24vdCksdGhpcyk6KHRoaXMuX2RpcnR5JiZ0aGlzLnRvdGFsRHVyYXRpb24oKSx0aGlzLl9kdXJhdGlvbil9LG0udG90YWxEdXJhdGlvbj1mdW5jdGlvbih0KXtpZighYXJndW1lbnRzLmxlbmd0aCl7aWYodGhpcy5fZGlydHkpe2Zvcih2YXIgZSxpLHM9MCxyPXRoaXMuX2xhc3Qsbj05OTk5OTk5OTk5OTk7cjspZT1yLl9wcmV2LHIuX2RpcnR5JiZyLnRvdGFsRHVyYXRpb24oKSxyLl9zdGFydFRpbWU+biYmdGhpcy5fc29ydENoaWxkcmVuJiYhci5fcGF1c2VkP3RoaXMuYWRkKHIsci5fc3RhcnRUaW1lLXIuX2RlbGF5KTpuPXIuX3N0YXJ0VGltZSwwPnIuX3N0YXJ0VGltZSYmIXIuX3BhdXNlZCYmKHMtPXIuX3N0YXJ0VGltZSx0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyYmKHRoaXMuX3N0YXJ0VGltZSs9ci5fc3RhcnRUaW1lL3RoaXMuX3RpbWVTY2FsZSksdGhpcy5zaGlmdENoaWxkcmVuKC1yLl9zdGFydFRpbWUsITEsLTk5OTk5OTk5OTkpLG49MCksaT1yLl9zdGFydFRpbWUrci5fdG90YWxEdXJhdGlvbi9yLl90aW1lU2NhbGUsaT5zJiYocz1pKSxyPWU7dGhpcy5fZHVyYXRpb249dGhpcy5fdG90YWxEdXJhdGlvbj1zLHRoaXMuX2RpcnR5PSExfXJldHVybiB0aGlzLl90b3RhbER1cmF0aW9ufXJldHVybiAwIT09dGhpcy50b3RhbER1cmF0aW9uKCkmJjAhPT10JiZ0aGlzLnRpbWVTY2FsZSh0aGlzLl90b3RhbER1cmF0aW9uL3QpLHRoaXN9LG0udXNlc0ZyYW1lcz1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl90aW1lbGluZTtlLl90aW1lbGluZTspZT1lLl90aW1lbGluZTtyZXR1cm4gZT09PXQuX3Jvb3RGcmFtZXNUaW1lbGluZX0sbS5yYXdUaW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3BhdXNlZD90aGlzLl90b3RhbFRpbWU6KHRoaXMuX3RpbWVsaW5lLnJhd1RpbWUoKS10aGlzLl9zdGFydFRpbWUpKnRoaXMuX3RpbWVTY2FsZX0sc30sITApLF9nc1Njb3BlLl9nc0RlZmluZShcIlRpbWVsaW5lTWF4XCIsW1wiVGltZWxpbmVMaXRlXCIsXCJUd2VlbkxpdGVcIixcImVhc2luZy5FYXNlXCJdLGZ1bmN0aW9uKHQsZSxpKXt2YXIgcz1mdW5jdGlvbihlKXt0LmNhbGwodGhpcyxlKSx0aGlzLl9yZXBlYXQ9dGhpcy52YXJzLnJlcGVhdHx8MCx0aGlzLl9yZXBlYXREZWxheT10aGlzLnZhcnMucmVwZWF0RGVsYXl8fDAsdGhpcy5fY3ljbGU9MCx0aGlzLl95b3lvPXRoaXMudmFycy55b3lvPT09ITAsdGhpcy5fZGlydHk9ITB9LHI9MWUtMTAsbj1bXSxhPWUuX2ludGVybmFscyxvPWEubGF6eVR3ZWVucyxoPWEubGF6eVJlbmRlcixsPW5ldyBpKG51bGwsbnVsbCwxLDApLF89cy5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIF8uY29uc3RydWN0b3I9cyxfLmtpbGwoKS5fZ2M9ITEscy52ZXJzaW9uPVwiMS4xNC4xXCIsXy5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3lveW89dGhpcy52YXJzLnlveW89PT0hMCx0aGlzLl9yZXBlYXQ9dGhpcy52YXJzLnJlcGVhdHx8MCx0aGlzLl9yZXBlYXREZWxheT10aGlzLnZhcnMucmVwZWF0RGVsYXl8fDAsdGhpcy5fdW5jYWNoZSghMCksdC5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpfSxfLmFkZENhbGxiYWNrPWZ1bmN0aW9uKHQsaSxzLHIpe3JldHVybiB0aGlzLmFkZChlLmRlbGF5ZWRDYWxsKDAsdCxzLHIpLGkpfSxfLnJlbW92ZUNhbGxiYWNrPWZ1bmN0aW9uKHQsZSl7aWYodClpZihudWxsPT1lKXRoaXMuX2tpbGwobnVsbCx0KTtlbHNlIGZvcih2YXIgaT10aGlzLmdldFR3ZWVuc09mKHQsITEpLHM9aS5sZW5ndGgscj10aGlzLl9wYXJzZVRpbWVPckxhYmVsKGUpOy0tcz4tMTspaVtzXS5fc3RhcnRUaW1lPT09ciYmaVtzXS5fZW5hYmxlZCghMSwhMSk7cmV0dXJuIHRoaXN9LF8udHdlZW5Ubz1mdW5jdGlvbih0LGkpe2k9aXx8e307dmFyIHMscixhLG89e2Vhc2U6bCxvdmVyd3JpdGU6aS5kZWxheT8yOjEsdXNlRnJhbWVzOnRoaXMudXNlc0ZyYW1lcygpLGltbWVkaWF0ZVJlbmRlcjohMX07Zm9yKHIgaW4gaSlvW3JdPWlbcl07cmV0dXJuIG8udGltZT10aGlzLl9wYXJzZVRpbWVPckxhYmVsKHQpLHM9TWF0aC5hYnMoTnVtYmVyKG8udGltZSktdGhpcy5fdGltZSkvdGhpcy5fdGltZVNjYWxlfHwuMDAxLGE9bmV3IGUodGhpcyxzLG8pLG8ub25TdGFydD1mdW5jdGlvbigpe2EudGFyZ2V0LnBhdXNlZCghMCksYS52YXJzLnRpbWUhPT1hLnRhcmdldC50aW1lKCkmJnM9PT1hLmR1cmF0aW9uKCkmJmEuZHVyYXRpb24oTWF0aC5hYnMoYS52YXJzLnRpbWUtYS50YXJnZXQudGltZSgpKS9hLnRhcmdldC5fdGltZVNjYWxlKSxpLm9uU3RhcnQmJmkub25TdGFydC5hcHBseShpLm9uU3RhcnRTY29wZXx8YSxpLm9uU3RhcnRQYXJhbXN8fG4pfSxhfSxfLnR3ZWVuRnJvbVRvPWZ1bmN0aW9uKHQsZSxpKXtpPWl8fHt9LHQ9dGhpcy5fcGFyc2VUaW1lT3JMYWJlbCh0KSxpLnN0YXJ0QXQ9e29uQ29tcGxldGU6dGhpcy5zZWVrLG9uQ29tcGxldGVQYXJhbXM6W3RdLG9uQ29tcGxldGVTY29wZTp0aGlzfSxpLmltbWVkaWF0ZVJlbmRlcj1pLmltbWVkaWF0ZVJlbmRlciE9PSExO3ZhciBzPXRoaXMudHdlZW5UbyhlLGkpO3JldHVybiBzLmR1cmF0aW9uKE1hdGguYWJzKHMudmFycy50aW1lLXQpL3RoaXMuX3RpbWVTY2FsZXx8LjAwMSl9LF8ucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLl9nYyYmdGhpcy5fZW5hYmxlZCghMCwhMSk7dmFyIHMsYSxsLF8sdSxwLGM9dGhpcy5fZGlydHk/dGhpcy50b3RhbER1cmF0aW9uKCk6dGhpcy5fdG90YWxEdXJhdGlvbixmPXRoaXMuX2R1cmF0aW9uLG09dGhpcy5fdGltZSxkPXRoaXMuX3RvdGFsVGltZSxnPXRoaXMuX3N0YXJ0VGltZSx2PXRoaXMuX3RpbWVTY2FsZSx5PXRoaXMuX3Jhd1ByZXZUaW1lLFQ9dGhpcy5fcGF1c2VkLHc9dGhpcy5fY3ljbGU7aWYodD49Yz8odGhpcy5fbG9ja2VkfHwodGhpcy5fdG90YWxUaW1lPWMsdGhpcy5fY3ljbGU9dGhpcy5fcmVwZWF0KSx0aGlzLl9yZXZlcnNlZHx8dGhpcy5faGFzUGF1c2VkQ2hpbGQoKXx8KGE9ITAsXz1cIm9uQ29tcGxldGVcIiwwPT09dGhpcy5fZHVyYXRpb24mJigwPT09dHx8MD55fHx5PT09cikmJnkhPT10JiZ0aGlzLl9maXJzdCYmKHU9ITAseT5yJiYoXz1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIpKSksdGhpcy5fcmF3UHJldlRpbWU9dGhpcy5fZHVyYXRpb258fCFlfHx0fHx0aGlzLl9yYXdQcmV2VGltZT09PXQ/dDpyLHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/dGhpcy5fdGltZT10PTA6KHRoaXMuX3RpbWU9Zix0PWYrMWUtNCkpOjFlLTc+dD8odGhpcy5fbG9ja2VkfHwodGhpcy5fdG90YWxUaW1lPXRoaXMuX2N5Y2xlPTApLHRoaXMuX3RpbWU9MCwoMCE9PW18fDA9PT1mJiZ5IT09ciYmKHk+MHx8MD50JiZ5Pj0wKSYmIXRoaXMuX2xvY2tlZCkmJihfPVwib25SZXZlcnNlQ29tcGxldGVcIixhPXRoaXMuX3JldmVyc2VkKSwwPnQ/KHRoaXMuX2FjdGl2ZT0hMSx5Pj0wJiZ0aGlzLl9maXJzdCYmKHU9ITApLHRoaXMuX3Jhd1ByZXZUaW1lPXQpOih0aGlzLl9yYXdQcmV2VGltZT1mfHwhZXx8dHx8dGhpcy5fcmF3UHJldlRpbWU9PT10P3Q6cix0PTAsdGhpcy5faW5pdHRlZHx8KHU9ITApKSk6KDA9PT1mJiYwPnkmJih1PSEwKSx0aGlzLl90aW1lPXRoaXMuX3Jhd1ByZXZUaW1lPXQsdGhpcy5fbG9ja2VkfHwodGhpcy5fdG90YWxUaW1lPXQsMCE9PXRoaXMuX3JlcGVhdCYmKHA9Zit0aGlzLl9yZXBlYXREZWxheSx0aGlzLl9jeWNsZT10aGlzLl90b3RhbFRpbWUvcD4+MCwwIT09dGhpcy5fY3ljbGUmJnRoaXMuX2N5Y2xlPT09dGhpcy5fdG90YWxUaW1lL3AmJnRoaXMuX2N5Y2xlLS0sdGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWUtdGhpcy5fY3ljbGUqcCx0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpJiYodGhpcy5fdGltZT1mLXRoaXMuX3RpbWUpLHRoaXMuX3RpbWU+Zj8odGhpcy5fdGltZT1mLHQ9ZisxZS00KTowPnRoaXMuX3RpbWU/dGhpcy5fdGltZT10PTA6dD10aGlzLl90aW1lKSkpLHRoaXMuX2N5Y2xlIT09dyYmIXRoaXMuX2xvY2tlZCl7dmFyIHg9dGhpcy5feW95byYmMCE9PSgxJncpLGI9eD09PSh0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpKSxQPXRoaXMuX3RvdGFsVGltZSxTPXRoaXMuX2N5Y2xlLGs9dGhpcy5fcmF3UHJldlRpbWUsUj10aGlzLl90aW1lO2lmKHRoaXMuX3RvdGFsVGltZT13KmYsdz50aGlzLl9jeWNsZT94PSF4OnRoaXMuX3RvdGFsVGltZSs9Zix0aGlzLl90aW1lPW0sdGhpcy5fcmF3UHJldlRpbWU9MD09PWY/eS0xZS00OnksdGhpcy5fY3ljbGU9dyx0aGlzLl9sb2NrZWQ9ITAsbT14PzA6Zix0aGlzLnJlbmRlcihtLGUsMD09PWYpLGV8fHRoaXMuX2djfHx0aGlzLnZhcnMub25SZXBlYXQmJnRoaXMudmFycy5vblJlcGVhdC5hcHBseSh0aGlzLnZhcnMub25SZXBlYXRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25SZXBlYXRQYXJhbXN8fG4pLGImJihtPXg/ZisxZS00Oi0xZS00LHRoaXMucmVuZGVyKG0sITAsITEpKSx0aGlzLl9sb2NrZWQ9ITEsdGhpcy5fcGF1c2VkJiYhVClyZXR1cm47dGhpcy5fdGltZT1SLHRoaXMuX3RvdGFsVGltZT1QLHRoaXMuX2N5Y2xlPVMsdGhpcy5fcmF3UHJldlRpbWU9a31pZighKHRoaXMuX3RpbWUhPT1tJiZ0aGlzLl9maXJzdHx8aXx8dSkpcmV0dXJuIGQhPT10aGlzLl90b3RhbFRpbWUmJnRoaXMuX29uVXBkYXRlJiYoZXx8dGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHxuKSksdm9pZCAwO2lmKHRoaXMuX2luaXR0ZWR8fCh0aGlzLl9pbml0dGVkPSEwKSx0aGlzLl9hY3RpdmV8fCF0aGlzLl9wYXVzZWQmJnRoaXMuX3RvdGFsVGltZSE9PWQmJnQ+MCYmKHRoaXMuX2FjdGl2ZT0hMCksMD09PWQmJnRoaXMudmFycy5vblN0YXJ0JiYwIT09dGhpcy5fdG90YWxUaW1lJiYoZXx8dGhpcy52YXJzLm9uU3RhcnQuYXBwbHkodGhpcy52YXJzLm9uU3RhcnRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25TdGFydFBhcmFtc3x8bikpLHRoaXMuX3RpbWU+PW0pZm9yKHM9dGhpcy5fZmlyc3Q7cyYmKGw9cy5fbmV4dCwhdGhpcy5fcGF1c2VkfHxUKTspKHMuX2FjdGl2ZXx8cy5fc3RhcnRUaW1lPD10aGlzLl90aW1lJiYhcy5fcGF1c2VkJiYhcy5fZ2MpJiYocy5fcmV2ZXJzZWQ/cy5yZW5kZXIoKHMuX2RpcnR5P3MudG90YWxEdXJhdGlvbigpOnMuX3RvdGFsRHVyYXRpb24pLSh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSk6cy5yZW5kZXIoKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKSkscz1sO2Vsc2UgZm9yKHM9dGhpcy5fbGFzdDtzJiYobD1zLl9wcmV2LCF0aGlzLl9wYXVzZWR8fFQpOykocy5fYWN0aXZlfHxtPj1zLl9zdGFydFRpbWUmJiFzLl9wYXVzZWQmJiFzLl9nYykmJihzLl9yZXZlcnNlZD9zLnJlbmRlcigocy5fZGlydHk/cy50b3RhbER1cmF0aW9uKCk6cy5fdG90YWxEdXJhdGlvbiktKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKTpzLnJlbmRlcigodC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpKSxzPWw7dGhpcy5fb25VcGRhdGUmJihlfHwoby5sZW5ndGgmJmgoKSx0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fG4pKSksXyYmKHRoaXMuX2xvY2tlZHx8dGhpcy5fZ2N8fChnPT09dGhpcy5fc3RhcnRUaW1lfHx2IT09dGhpcy5fdGltZVNjYWxlKSYmKDA9PT10aGlzLl90aW1lfHxjPj10aGlzLnRvdGFsRHVyYXRpb24oKSkmJihhJiYoby5sZW5ndGgmJmgoKSx0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4mJnRoaXMuX2VuYWJsZWQoITEsITEpLHRoaXMuX2FjdGl2ZT0hMSksIWUmJnRoaXMudmFyc1tfXSYmdGhpcy52YXJzW19dLmFwcGx5KHRoaXMudmFyc1tfK1wiU2NvcGVcIl18fHRoaXMsdGhpcy52YXJzW18rXCJQYXJhbXNcIl18fG4pKSl9LF8uZ2V0QWN0aXZlPWZ1bmN0aW9uKHQsZSxpKXtudWxsPT10JiYodD0hMCksbnVsbD09ZSYmKGU9ITApLG51bGw9PWkmJihpPSExKTt2YXIgcyxyLG49W10sYT10aGlzLmdldENoaWxkcmVuKHQsZSxpKSxvPTAsaD1hLmxlbmd0aDtmb3Iocz0wO2g+cztzKyspcj1hW3NdLHIuaXNBY3RpdmUoKSYmKG5bbysrXT1yKTtyZXR1cm4gbn0sXy5nZXRMYWJlbEFmdGVyPWZ1bmN0aW9uKHQpe3R8fDAhPT10JiYodD10aGlzLl90aW1lKTt2YXIgZSxpPXRoaXMuZ2V0TGFiZWxzQXJyYXkoKSxzPWkubGVuZ3RoO2ZvcihlPTA7cz5lO2UrKylpZihpW2VdLnRpbWU+dClyZXR1cm4gaVtlXS5uYW1lO3JldHVybiBudWxsfSxfLmdldExhYmVsQmVmb3JlPWZ1bmN0aW9uKHQpe251bGw9PXQmJih0PXRoaXMuX3RpbWUpO2Zvcih2YXIgZT10aGlzLmdldExhYmVsc0FycmF5KCksaT1lLmxlbmd0aDstLWk+LTE7KWlmKHQ+ZVtpXS50aW1lKXJldHVybiBlW2ldLm5hbWU7cmV0dXJuIG51bGx9LF8uZ2V0TGFiZWxzQXJyYXk9ZnVuY3Rpb24oKXt2YXIgdCxlPVtdLGk9MDtmb3IodCBpbiB0aGlzLl9sYWJlbHMpZVtpKytdPXt0aW1lOnRoaXMuX2xhYmVsc1t0XSxuYW1lOnR9O3JldHVybiBlLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdC50aW1lLWUudGltZX0pLGV9LF8ucHJvZ3Jlc3M9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnRvdGFsVGltZSh0aGlzLmR1cmF0aW9uKCkqKHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/MS10OnQpK3RoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSksZSk6dGhpcy5fdGltZS90aGlzLmR1cmF0aW9uKCl9LF8udG90YWxQcm9ncmVzcz1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMudG90YWxUaW1lKHRoaXMudG90YWxEdXJhdGlvbigpKnQsZSk6dGhpcy5fdG90YWxUaW1lL3RoaXMudG90YWxEdXJhdGlvbigpfSxfLnRvdGFsRHVyYXRpb249ZnVuY3Rpb24oZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/LTE9PT10aGlzLl9yZXBlYXQ/dGhpczp0aGlzLmR1cmF0aW9uKChlLXRoaXMuX3JlcGVhdCp0aGlzLl9yZXBlYXREZWxheSkvKHRoaXMuX3JlcGVhdCsxKSk6KHRoaXMuX2RpcnR5JiYodC5wcm90b3R5cGUudG90YWxEdXJhdGlvbi5jYWxsKHRoaXMpLHRoaXMuX3RvdGFsRHVyYXRpb249LTE9PT10aGlzLl9yZXBlYXQ/OTk5OTk5OTk5OTk5OnRoaXMuX2R1cmF0aW9uKih0aGlzLl9yZXBlYXQrMSkrdGhpcy5fcmVwZWF0RGVsYXkqdGhpcy5fcmVwZWF0KSx0aGlzLl90b3RhbER1cmF0aW9uKX0sXy50aW1lPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX2RpcnR5JiZ0aGlzLnRvdGFsRHVyYXRpb24oKSx0PnRoaXMuX2R1cmF0aW9uJiYodD10aGlzLl9kdXJhdGlvbiksdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT90PXRoaXMuX2R1cmF0aW9uLXQrdGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KTowIT09dGhpcy5fcmVwZWF0JiYodCs9dGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KSksdGhpcy50b3RhbFRpbWUodCxlKSk6dGhpcy5fdGltZX0sXy5yZXBlYXQ9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlcGVhdD10LHRoaXMuX3VuY2FjaGUoITApKTp0aGlzLl9yZXBlYXR9LF8ucmVwZWF0RGVsYXk9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlcGVhdERlbGF5PXQsdGhpcy5fdW5jYWNoZSghMCkpOnRoaXMuX3JlcGVhdERlbGF5fSxfLnlveW89ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3lveW89dCx0aGlzKTp0aGlzLl95b3lvfSxfLmN1cnJlbnRMYWJlbD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnNlZWsodCwhMCk6dGhpcy5nZXRMYWJlbEJlZm9yZSh0aGlzLl90aW1lKzFlLTgpfSxzfSwhMCksZnVuY3Rpb24oKXt2YXIgdD0xODAvTWF0aC5QSSxlPVtdLGk9W10scz1bXSxyPXt9LG49ZnVuY3Rpb24odCxlLGkscyl7dGhpcy5hPXQsdGhpcy5iPWUsdGhpcy5jPWksdGhpcy5kPXMsdGhpcy5kYT1zLXQsdGhpcy5jYT1pLXQsdGhpcy5iYT1lLXR9LGE9XCIseCx5LHosbGVmdCx0b3AscmlnaHQsYm90dG9tLG1hcmdpblRvcCxtYXJnaW5MZWZ0LG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxwYWRkaW5nTGVmdCxwYWRkaW5nVG9wLHBhZGRpbmdSaWdodCxwYWRkaW5nQm90dG9tLGJhY2tncm91bmRQb3NpdGlvbixiYWNrZ3JvdW5kUG9zaXRpb25feSxcIixvPWZ1bmN0aW9uKHQsZSxpLHMpe3ZhciByPXthOnR9LG49e30sYT17fSxvPXtjOnN9LGg9KHQrZSkvMixsPShlK2kpLzIsXz0oaStzKS8yLHU9KGgrbCkvMixwPShsK18pLzIsYz0ocC11KS84O3JldHVybiByLmI9aCsodC1oKS80LG4uYj11K2Msci5jPW4uYT0oci5iK24uYikvMixuLmM9YS5hPSh1K3ApLzIsYS5iPXAtYyxvLmI9Xysocy1fKS80LGEuYz1vLmE9KGEuYitvLmIpLzIsW3IsbixhLG9dfSxoPWZ1bmN0aW9uKHQscixuLGEsaCl7dmFyIGwsXyx1LHAsYyxmLG0sZCxnLHYseSxULHcseD10Lmxlbmd0aC0xLGI9MCxQPXRbMF0uYTtmb3IobD0wO3g+bDtsKyspYz10W2JdLF89Yy5hLHU9Yy5kLHA9dFtiKzFdLmQsaD8oeT1lW2xdLFQ9aVtsXSx3PS4yNSooVCt5KSpyLyhhPy41OnNbbF18fC41KSxmPXUtKHUtXykqKGE/LjUqcjowIT09eT93L3k6MCksbT11KyhwLXUpKihhPy41KnI6MCE9PVQ/dy9UOjApLGQ9dS0oZisoKG0tZikqKDMqeS8oeStUKSsuNSkvNHx8MCkpKTooZj11LS41Kih1LV8pKnIsbT11Ky41KihwLXUpKnIsZD11LShmK20pLzIpLGYrPWQsbSs9ZCxjLmM9Zz1mLGMuYj0wIT09bD9QOlA9Yy5hKy42KihjLmMtYy5hKSxjLmRhPXUtXyxjLmNhPWctXyxjLmJhPVAtXyxuPyh2PW8oXyxQLGcsdSksdC5zcGxpY2UoYiwxLHZbMF0sdlsxXSx2WzJdLHZbM10pLGIrPTQpOmIrKyxQPW07Yz10W2JdLGMuYj1QLGMuYz1QKy40KihjLmQtUCksYy5kYT1jLmQtYy5hLGMuY2E9Yy5jLWMuYSxjLmJhPVAtYy5hLG4mJih2PW8oYy5hLFAsYy5jLGMuZCksdC5zcGxpY2UoYiwxLHZbMF0sdlsxXSx2WzJdLHZbM10pKX0sbD1mdW5jdGlvbih0LHMscixhKXt2YXIgbyxoLGwsXyx1LHAsYz1bXTtpZihhKWZvcih0PVthXS5jb25jYXQodCksaD10Lmxlbmd0aDstLWg+LTE7KVwic3RyaW5nXCI9PXR5cGVvZihwPXRbaF1bc10pJiZcIj1cIj09PXAuY2hhckF0KDEpJiYodFtoXVtzXT1hW3NdK051bWJlcihwLmNoYXJBdCgwKStwLnN1YnN0cigyKSkpO2lmKG89dC5sZW5ndGgtMiwwPm8pcmV0dXJuIGNbMF09bmV3IG4odFswXVtzXSwwLDAsdFstMT5vPzA6MV1bc10pLGM7Zm9yKGg9MDtvPmg7aCsrKWw9dFtoXVtzXSxfPXRbaCsxXVtzXSxjW2hdPW5ldyBuKGwsMCwwLF8pLHImJih1PXRbaCsyXVtzXSxlW2hdPShlW2hdfHwwKSsoXy1sKSooXy1sKSxpW2hdPShpW2hdfHwwKSsodS1fKSoodS1fKSk7cmV0dXJuIGNbaF09bmV3IG4odFtoXVtzXSwwLDAsdFtoKzFdW3NdKSxjfSxfPWZ1bmN0aW9uKHQsbixvLF8sdSxwKXt2YXIgYyxmLG0sZCxnLHYseSxULHc9e30seD1bXSxiPXB8fHRbMF07dT1cInN0cmluZ1wiPT10eXBlb2YgdT9cIixcIit1K1wiLFwiOmEsbnVsbD09biYmKG49MSk7Zm9yKGYgaW4gdFswXSl4LnB1c2goZik7aWYodC5sZW5ndGg+MSl7Zm9yKFQ9dFt0Lmxlbmd0aC0xXSx5PSEwLGM9eC5sZW5ndGg7LS1jPi0xOylpZihmPXhbY10sTWF0aC5hYnMoYltmXS1UW2ZdKT4uMDUpe3k9ITE7YnJlYWt9eSYmKHQ9dC5jb25jYXQoKSxwJiZ0LnVuc2hpZnQocCksdC5wdXNoKHRbMV0pLHA9dFt0Lmxlbmd0aC0zXSl9Zm9yKGUubGVuZ3RoPWkubGVuZ3RoPXMubGVuZ3RoPTAsYz14Lmxlbmd0aDstLWM+LTE7KWY9eFtjXSxyW2ZdPS0xIT09dS5pbmRleE9mKFwiLFwiK2YrXCIsXCIpLHdbZl09bCh0LGYscltmXSxwKTtmb3IoYz1lLmxlbmd0aDstLWM+LTE7KWVbY109TWF0aC5zcXJ0KGVbY10pLGlbY109TWF0aC5zcXJ0KGlbY10pO2lmKCFfKXtmb3IoYz14Lmxlbmd0aDstLWM+LTE7KWlmKHJbZl0pZm9yKG09d1t4W2NdXSx2PW0ubGVuZ3RoLTEsZD0wO3Y+ZDtkKyspZz1tW2QrMV0uZGEvaVtkXSttW2RdLmRhL2VbZF0sc1tkXT0oc1tkXXx8MCkrZypnO2ZvcihjPXMubGVuZ3RoOy0tYz4tMTspc1tjXT1NYXRoLnNxcnQoc1tjXSl9Zm9yKGM9eC5sZW5ndGgsZD1vPzQ6MTstLWM+LTE7KWY9eFtjXSxtPXdbZl0saChtLG4sbyxfLHJbZl0pLHkmJihtLnNwbGljZSgwLGQpLG0uc3BsaWNlKG0ubGVuZ3RoLWQsZCkpO3JldHVybiB3fSx1PWZ1bmN0aW9uKHQsZSxpKXtlPWV8fFwic29mdFwiO3ZhciBzLHIsYSxvLGgsbCxfLHUscCxjLGYsbT17fSxkPVwiY3ViaWNcIj09PWU/MzoyLGc9XCJzb2Z0XCI9PT1lLHY9W107aWYoZyYmaSYmKHQ9W2ldLmNvbmNhdCh0KSksbnVsbD09dHx8ZCsxPnQubGVuZ3RoKXRocm93XCJpbnZhbGlkIEJlemllciBkYXRhXCI7Zm9yKHAgaW4gdFswXSl2LnB1c2gocCk7Zm9yKGw9di5sZW5ndGg7LS1sPi0xOyl7Zm9yKHA9dltsXSxtW3BdPWg9W10sYz0wLHU9dC5sZW5ndGgsXz0wO3U+XztfKyspcz1udWxsPT1pP3RbX11bcF06XCJzdHJpbmdcIj09dHlwZW9mKGY9dFtfXVtwXSkmJlwiPVwiPT09Zi5jaGFyQXQoMSk/aVtwXStOdW1iZXIoZi5jaGFyQXQoMCkrZi5zdWJzdHIoMikpOk51bWJlcihmKSxnJiZfPjEmJnUtMT5fJiYoaFtjKytdPShzK2hbYy0yXSkvMiksaFtjKytdPXM7Zm9yKHU9Yy1kKzEsYz0wLF89MDt1Pl87Xys9ZClzPWhbX10scj1oW18rMV0sYT1oW18rMl0sbz0yPT09ZD8wOmhbXyszXSxoW2MrK109Zj0zPT09ZD9uZXcgbihzLHIsYSxvKTpuZXcgbihzLCgyKnIrcykvMywoMipyK2EpLzMsYSk7aC5sZW5ndGg9Y31yZXR1cm4gbX0scD1mdW5jdGlvbih0LGUsaSl7Zm9yKHZhciBzLHIsbixhLG8saCxsLF8sdSxwLGMsZj0xL2ksbT10Lmxlbmd0aDstLW0+LTE7KWZvcihwPXRbbV0sbj1wLmEsYT1wLmQtbixvPXAuYy1uLGg9cC5iLW4scz1yPTAsXz0xO2k+PV87XysrKWw9ZipfLHU9MS1sLHM9ci0ocj0obCpsKmErMyp1KihsKm8rdSpoKSkqbCksYz1tKmkrXy0xLGVbY109KGVbY118fDApK3Mqc30sYz1mdW5jdGlvbih0LGUpe2U9ZT4+MHx8Njt2YXIgaSxzLHIsbixhPVtdLG89W10saD0wLGw9MCxfPWUtMSx1PVtdLGM9W107Zm9yKGkgaW4gdClwKHRbaV0sYSxlKTtmb3Iocj1hLmxlbmd0aCxzPTA7cj5zO3MrKyloKz1NYXRoLnNxcnQoYVtzXSksbj1zJWUsY1tuXT1oLG49PT1fJiYobCs9aCxuPXMvZT4+MCx1W25dPWMsb1tuXT1sLGg9MCxjPVtdKTtyZXR1cm57bGVuZ3RoOmwsbGVuZ3RoczpvLHNlZ21lbnRzOnV9fSxmPV9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe3Byb3BOYW1lOlwiYmV6aWVyXCIscHJpb3JpdHk6LTEsdmVyc2lvbjpcIjEuMy4zXCIsQVBJOjIsZ2xvYmFsOiEwLGluaXQ6ZnVuY3Rpb24odCxlLGkpe3RoaXMuX3RhcmdldD10LGUgaW5zdGFuY2VvZiBBcnJheSYmKGU9e3ZhbHVlczplfSksdGhpcy5fZnVuYz17fSx0aGlzLl9yb3VuZD17fSx0aGlzLl9wcm9wcz1bXSx0aGlzLl90aW1lUmVzPW51bGw9PWUudGltZVJlc29sdXRpb24/NjpwYXJzZUludChlLnRpbWVSZXNvbHV0aW9uLDEwKTt2YXIgcyxyLG4sYSxvLGg9ZS52YWx1ZXN8fFtdLGw9e30scD1oWzBdLGY9ZS5hdXRvUm90YXRlfHxpLnZhcnMub3JpZW50VG9CZXppZXI7dGhpcy5fYXV0b1JvdGF0ZT1mP2YgaW5zdGFuY2VvZiBBcnJheT9mOltbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLGY9PT0hMD8wOk51bWJlcihmKXx8MF1dOm51bGw7Zm9yKHMgaW4gcCl0aGlzLl9wcm9wcy5wdXNoKHMpO2ZvcihuPXRoaXMuX3Byb3BzLmxlbmd0aDstLW4+LTE7KXM9dGhpcy5fcHJvcHNbbl0sdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChzKSxyPXRoaXMuX2Z1bmNbc109XCJmdW5jdGlvblwiPT10eXBlb2YgdFtzXSxsW3NdPXI/dFtzLmluZGV4T2YoXCJzZXRcIil8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRbXCJnZXRcIitzLnN1YnN0cigzKV0/czpcImdldFwiK3Muc3Vic3RyKDMpXSgpOnBhcnNlRmxvYXQodFtzXSksb3x8bFtzXSE9PWhbMF1bc10mJihvPWwpO2lmKHRoaXMuX2JlemllcnM9XCJjdWJpY1wiIT09ZS50eXBlJiZcInF1YWRyYXRpY1wiIT09ZS50eXBlJiZcInNvZnRcIiE9PWUudHlwZT9fKGgsaXNOYU4oZS5jdXJ2aW5lc3MpPzE6ZS5jdXJ2aW5lc3MsITEsXCJ0aHJ1QmFzaWNcIj09PWUudHlwZSxlLmNvcnJlbGF0ZSxvKTp1KGgsZS50eXBlLGwpLHRoaXMuX3NlZ0NvdW50PXRoaXMuX2JlemllcnNbc10ubGVuZ3RoLHRoaXMuX3RpbWVSZXMpe3ZhciBtPWModGhpcy5fYmV6aWVycyx0aGlzLl90aW1lUmVzKTt0aGlzLl9sZW5ndGg9bS5sZW5ndGgsdGhpcy5fbGVuZ3Rocz1tLmxlbmd0aHMsdGhpcy5fc2VnbWVudHM9bS5zZWdtZW50cyx0aGlzLl9sMT10aGlzLl9saT10aGlzLl9zMT10aGlzLl9zaT0wLHRoaXMuX2wyPXRoaXMuX2xlbmd0aHNbMF0sdGhpcy5fY3VyU2VnPXRoaXMuX3NlZ21lbnRzWzBdLHRoaXMuX3MyPXRoaXMuX2N1clNlZ1swXSx0aGlzLl9wcmVjPTEvdGhpcy5fY3VyU2VnLmxlbmd0aH1pZihmPXRoaXMuX2F1dG9Sb3RhdGUpZm9yKHRoaXMuX2luaXRpYWxSb3RhdGlvbnM9W10sZlswXWluc3RhbmNlb2YgQXJyYXl8fCh0aGlzLl9hdXRvUm90YXRlPWY9W2ZdKSxuPWYubGVuZ3RoOy0tbj4tMTspe2ZvcihhPTA7Mz5hO2ErKylzPWZbbl1bYV0sdGhpcy5fZnVuY1tzXT1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0W3NdP3Rbcy5pbmRleE9mKFwic2V0XCIpfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0W1wiZ2V0XCIrcy5zdWJzdHIoMyldP3M6XCJnZXRcIitzLnN1YnN0cigzKV06ITE7cz1mW25dWzJdLHRoaXMuX2luaXRpYWxSb3RhdGlvbnNbbl09dGhpcy5fZnVuY1tzXT90aGlzLl9mdW5jW3NdLmNhbGwodGhpcy5fdGFyZ2V0KTp0aGlzLl90YXJnZXRbc119cmV0dXJuIHRoaXMuX3N0YXJ0UmF0aW89aS52YXJzLnJ1bkJhY2t3YXJkcz8xOjAsITB9LHNldDpmdW5jdGlvbihlKXt2YXIgaSxzLHIsbixhLG8saCxsLF8sdSxwPXRoaXMuX3NlZ0NvdW50LGM9dGhpcy5fZnVuYyxmPXRoaXMuX3RhcmdldCxtPWUhPT10aGlzLl9zdGFydFJhdGlvO2lmKHRoaXMuX3RpbWVSZXMpe2lmKF89dGhpcy5fbGVuZ3Rocyx1PXRoaXMuX2N1clNlZyxlKj10aGlzLl9sZW5ndGgscj10aGlzLl9saSxlPnRoaXMuX2wyJiZwLTE+cil7Zm9yKGw9cC0xO2w+ciYmZT49KHRoaXMuX2wyPV9bKytyXSk7KTt0aGlzLl9sMT1fW3ItMV0sdGhpcy5fbGk9cix0aGlzLl9jdXJTZWc9dT10aGlzLl9zZWdtZW50c1tyXSx0aGlzLl9zMj11W3RoaXMuX3MxPXRoaXMuX3NpPTBdfWVsc2UgaWYodGhpcy5fbDE+ZSYmcj4wKXtmb3IoO3I+MCYmKHRoaXMuX2wxPV9bLS1yXSk+PWU7KTswPT09ciYmdGhpcy5fbDE+ZT90aGlzLl9sMT0wOnIrKyx0aGlzLl9sMj1fW3JdLHRoaXMuX2xpPXIsdGhpcy5fY3VyU2VnPXU9dGhpcy5fc2VnbWVudHNbcl0sdGhpcy5fczE9dVsodGhpcy5fc2k9dS5sZW5ndGgtMSktMV18fDAsdGhpcy5fczI9dVt0aGlzLl9zaV19aWYoaT1yLGUtPXRoaXMuX2wxLHI9dGhpcy5fc2ksZT50aGlzLl9zMiYmdS5sZW5ndGgtMT5yKXtmb3IobD11Lmxlbmd0aC0xO2w+ciYmZT49KHRoaXMuX3MyPXVbKytyXSk7KTt0aGlzLl9zMT11W3ItMV0sdGhpcy5fc2k9cn1lbHNlIGlmKHRoaXMuX3MxPmUmJnI+MCl7Zm9yKDtyPjAmJih0aGlzLl9zMT11Wy0tcl0pPj1lOyk7MD09PXImJnRoaXMuX3MxPmU/dGhpcy5fczE9MDpyKyssdGhpcy5fczI9dVtyXSx0aGlzLl9zaT1yXG59bz0ocisoZS10aGlzLl9zMSkvKHRoaXMuX3MyLXRoaXMuX3MxKSkqdGhpcy5fcHJlY31lbHNlIGk9MD5lPzA6ZT49MT9wLTE6cCplPj4wLG89KGUtaSooMS9wKSkqcDtmb3Iocz0xLW8scj10aGlzLl9wcm9wcy5sZW5ndGg7LS1yPi0xOyluPXRoaXMuX3Byb3BzW3JdLGE9dGhpcy5fYmV6aWVyc1tuXVtpXSxoPShvKm8qYS5kYSszKnMqKG8qYS5jYStzKmEuYmEpKSpvK2EuYSx0aGlzLl9yb3VuZFtuXSYmKGg9TWF0aC5yb3VuZChoKSksY1tuXT9mW25dKGgpOmZbbl09aDtpZih0aGlzLl9hdXRvUm90YXRlKXt2YXIgZCxnLHYseSxULHcseCxiPXRoaXMuX2F1dG9Sb3RhdGU7Zm9yKHI9Yi5sZW5ndGg7LS1yPi0xOyluPWJbcl1bMl0sdz1iW3JdWzNdfHwwLHg9YltyXVs0XT09PSEwPzE6dCxhPXRoaXMuX2JlemllcnNbYltyXVswXV0sZD10aGlzLl9iZXppZXJzW2Jbcl1bMV1dLGEmJmQmJihhPWFbaV0sZD1kW2ldLGc9YS5hKyhhLmItYS5hKSpvLHk9YS5iKyhhLmMtYS5iKSpvLGcrPSh5LWcpKm8seSs9KGEuYysoYS5kLWEuYykqby15KSpvLHY9ZC5hKyhkLmItZC5hKSpvLFQ9ZC5iKyhkLmMtZC5iKSpvLHYrPShULXYpKm8sVCs9KGQuYysoZC5kLWQuYykqby1UKSpvLGg9bT9NYXRoLmF0YW4yKFQtdix5LWcpKngrdzp0aGlzLl9pbml0aWFsUm90YXRpb25zW3JdLGNbbl0/ZltuXShoKTpmW25dPWgpfX19KSxtPWYucHJvdG90eXBlO2YuYmV6aWVyVGhyb3VnaD1fLGYuY3ViaWNUb1F1YWRyYXRpYz1vLGYuX2F1dG9DU1M9ITAsZi5xdWFkcmF0aWNUb0N1YmljPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gbmV3IG4odCwoMiplK3QpLzMsKDIqZStpKS8zLGkpfSxmLl9jc3NSZWdpc3Rlcj1mdW5jdGlvbigpe3ZhciB0PV9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLkNTU1BsdWdpbjtpZih0KXt2YXIgZT10Ll9pbnRlcm5hbHMsaT1lLl9wYXJzZVRvUHJveHkscz1lLl9zZXRQbHVnaW5SYXRpbyxyPWUuQ1NTUHJvcFR3ZWVuO2UuX3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYmV6aWVyXCIse3BhcnNlcjpmdW5jdGlvbih0LGUsbixhLG8saCl7ZSBpbnN0YW5jZW9mIEFycmF5JiYoZT17dmFsdWVzOmV9KSxoPW5ldyBmO3ZhciBsLF8sdSxwPWUudmFsdWVzLGM9cC5sZW5ndGgtMSxtPVtdLGQ9e307aWYoMD5jKXJldHVybiBvO2ZvcihsPTA7Yz49bDtsKyspdT1pKHQscFtsXSxhLG8saCxjIT09bCksbVtsXT11LmVuZDtmb3IoXyBpbiBlKWRbX109ZVtfXTtyZXR1cm4gZC52YWx1ZXM9bSxvPW5ldyByKHQsXCJiZXppZXJcIiwwLDAsdS5wdCwyKSxvLmRhdGE9dSxvLnBsdWdpbj1oLG8uc2V0UmF0aW89cywwPT09ZC5hdXRvUm90YXRlJiYoZC5hdXRvUm90YXRlPSEwKSwhZC5hdXRvUm90YXRlfHxkLmF1dG9Sb3RhdGUgaW5zdGFuY2VvZiBBcnJheXx8KGw9ZC5hdXRvUm90YXRlPT09ITA/MDpOdW1iZXIoZC5hdXRvUm90YXRlKSxkLmF1dG9Sb3RhdGU9bnVsbCE9dS5lbmQubGVmdD9bW1wibGVmdFwiLFwidG9wXCIsXCJyb3RhdGlvblwiLGwsITFdXTpudWxsIT11LmVuZC54P1tbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLGwsITFdXTohMSksZC5hdXRvUm90YXRlJiYoYS5fdHJhbnNmb3JtfHxhLl9lbmFibGVUcmFuc2Zvcm1zKCExKSx1LmF1dG9Sb3RhdGU9YS5fdGFyZ2V0Ll9nc1RyYW5zZm9ybSksaC5fb25Jbml0VHdlZW4odS5wcm94eSxkLGEuX3R3ZWVuKSxvfX0pfX0sbS5fcm91bmRQcm9wcz1mdW5jdGlvbih0LGUpe2Zvcih2YXIgaT10aGlzLl9vdmVyd3JpdGVQcm9wcyxzPWkubGVuZ3RoOy0tcz4tMTspKHRbaVtzXV18fHQuYmV6aWVyfHx0LmJlemllclRocm91Z2gpJiYodGhpcy5fcm91bmRbaVtzXV09ZSl9LG0uX2tpbGw9ZnVuY3Rpb24odCl7dmFyIGUsaSxzPXRoaXMuX3Byb3BzO2ZvcihlIGluIHRoaXMuX2JlemllcnMpaWYoZSBpbiB0KWZvcihkZWxldGUgdGhpcy5fYmV6aWVyc1tlXSxkZWxldGUgdGhpcy5fZnVuY1tlXSxpPXMubGVuZ3RoOy0taT4tMTspc1tpXT09PWUmJnMuc3BsaWNlKGksMSk7cmV0dXJuIHRoaXMuX3N1cGVyLl9raWxsLmNhbGwodGhpcyx0KX19KCksX2dzU2NvcGUuX2dzRGVmaW5lKFwicGx1Z2lucy5DU1NQbHVnaW5cIixbXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsXCJUd2VlbkxpdGVcIl0sZnVuY3Rpb24odCxlKXt2YXIgaSxzLHIsbixhPWZ1bmN0aW9uKCl7dC5jYWxsKHRoaXMsXCJjc3NcIiksdGhpcy5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoPTAsdGhpcy5zZXRSYXRpbz1hLnByb3RvdHlwZS5zZXRSYXRpb30sbz17fSxoPWEucHJvdG90eXBlPW5ldyB0KFwiY3NzXCIpO2guY29uc3RydWN0b3I9YSxhLnZlcnNpb249XCIxLjE0LjFcIixhLkFQST0yLGEuZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlPTAsYS5kZWZhdWx0U2tld1R5cGU9XCJjb21wZW5zYXRlZFwiLGg9XCJweFwiLGEuc3VmZml4TWFwPXt0b3A6aCxyaWdodDpoLGJvdHRvbTpoLGxlZnQ6aCx3aWR0aDpoLGhlaWdodDpoLGZvbnRTaXplOmgscGFkZGluZzpoLG1hcmdpbjpoLHBlcnNwZWN0aXZlOmgsbGluZUhlaWdodDpcIlwifTt2YXIgbCxfLHUscCxjLGYsbT0vKD86XFxkfFxcLVxcZHxcXC5cXGR8XFwtXFwuXFxkKSsvZyxkPS8oPzpcXGR8XFwtXFxkfFxcLlxcZHxcXC1cXC5cXGR8XFwrPVxcZHxcXC09XFxkfFxcKz0uXFxkfFxcLT1cXC5cXGQpKy9nLGc9Lyg/OlxcKz18XFwtPXxcXC18XFxiKVtcXGRcXC1cXC5dK1thLXpBLVowLTldKig/OiV8XFxiKS9naSx2PS9bXlxcZFxcLVxcLl0vZyx5PS8oPzpcXGR8XFwtfFxcK3w9fCN8XFwuKSovZyxUPS9vcGFjaXR5ICo9ICooW14pXSopL2ksdz0vb3BhY2l0eTooW147XSopL2kseD0vYWxwaGFcXChvcGFjaXR5ICo9Lis/XFwpL2ksYj0vXihyZ2J8aHNsKS8sUD0vKFtBLVpdKS9nLFM9Ly0oW2Etel0pL2dpLGs9LyheKD86dXJsXFwoXFxcInx1cmxcXCgpKXwoPzooXFxcIlxcKSkkfFxcKSQpL2dpLFI9ZnVuY3Rpb24odCxlKXtyZXR1cm4gZS50b1VwcGVyQ2FzZSgpfSxBPS8oPzpMZWZ0fFJpZ2h0fFdpZHRoKS9pLE89LyhNMTF8TTEyfE0yMXxNMjIpPVtcXGRcXC1cXC5lXSsvZ2ksQz0vcHJvZ2lkXFw6RFhJbWFnZVRyYW5zZm9ybVxcLk1pY3Jvc29mdFxcLk1hdHJpeFxcKC4rP1xcKS9pLEQ9LywoPz1bXlxcKV0qKD86XFwofCQpKS9naSxNPU1hdGguUEkvMTgwLHo9MTgwL01hdGguUEksST17fSxFPWRvY3VtZW50LEY9KEUuZG9jdW1lbnRFbGVtZW50LEUuY3JlYXRlRWxlbWVudChcImRpdlwiKSksTD1FLmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksTj1hLl9pbnRlcm5hbHM9e19zcGVjaWFsUHJvcHM6b30sWD1uYXZpZ2F0b3IudXNlckFnZW50LFU9ZnVuY3Rpb24oKXt2YXIgdCxlPVguaW5kZXhPZihcIkFuZHJvaWRcIiksaT1FLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7cmV0dXJuIHU9LTEhPT1YLmluZGV4T2YoXCJTYWZhcmlcIikmJi0xPT09WC5pbmRleE9mKFwiQ2hyb21lXCIpJiYoLTE9PT1lfHxOdW1iZXIoWC5zdWJzdHIoZSs4LDEpKT4zKSxjPXUmJjY+TnVtYmVyKFguc3Vic3RyKFguaW5kZXhPZihcIlZlcnNpb24vXCIpKzgsMSkpLHA9LTEhPT1YLmluZGV4T2YoXCJGaXJlZm94XCIpLCgvTVNJRSAoWzAtOV17MSx9W1xcLjAtOV17MCx9KS8uZXhlYyhYKXx8L1RyaWRlbnRcXC8uKnJ2OihbMC05XXsxLH1bXFwuMC05XXswLH0pLy5leGVjKFgpKSYmKGY9cGFyc2VGbG9hdChSZWdFeHAuJDEpKSxpLmlubmVySFRNTD1cIjxhIHN0eWxlPSd0b3A6MXB4O29wYWNpdHk6LjU1Oyc+YTwvYT5cIix0PWkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdLHQ/L14wLjU1Ly50ZXN0KHQuc3R5bGUub3BhY2l0eSk6ITF9KCksWT1mdW5jdGlvbih0KXtyZXR1cm4gVC50ZXN0KFwic3RyaW5nXCI9PXR5cGVvZiB0P3Q6KHQuY3VycmVudFN0eWxlP3QuY3VycmVudFN0eWxlLmZpbHRlcjp0LnN0eWxlLmZpbHRlcil8fFwiXCIpP3BhcnNlRmxvYXQoUmVnRXhwLiQxKS8xMDA6MX0saj1mdW5jdGlvbih0KXt3aW5kb3cuY29uc29sZSYmY29uc29sZS5sb2codCl9LEI9XCJcIixxPVwiXCIsVj1mdW5jdGlvbih0LGUpe2U9ZXx8Rjt2YXIgaSxzLHI9ZS5zdHlsZTtpZih2b2lkIDAhPT1yW3RdKXJldHVybiB0O2Zvcih0PXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrdC5zdWJzdHIoMSksaT1bXCJPXCIsXCJNb3pcIixcIm1zXCIsXCJNc1wiLFwiV2Via2l0XCJdLHM9NTstLXM+LTEmJnZvaWQgMD09PXJbaVtzXSt0XTspO3JldHVybiBzPj0wPyhxPTM9PT1zP1wibXNcIjppW3NdLEI9XCItXCIrcS50b0xvd2VyQ2FzZSgpK1wiLVwiLHErdCk6bnVsbH0sRz1FLmRlZmF1bHRWaWV3P0UuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZTpmdW5jdGlvbigpe30sVz1hLmdldFN0eWxlPWZ1bmN0aW9uKHQsZSxpLHMscil7dmFyIG47cmV0dXJuIFV8fFwib3BhY2l0eVwiIT09ZT8oIXMmJnQuc3R5bGVbZV0/bj10LnN0eWxlW2VdOihpPWl8fEcodCkpP249aVtlXXx8aS5nZXRQcm9wZXJ0eVZhbHVlKGUpfHxpLmdldFByb3BlcnR5VmFsdWUoZS5yZXBsYWNlKFAsXCItJDFcIikudG9Mb3dlckNhc2UoKSk6dC5jdXJyZW50U3R5bGUmJihuPXQuY3VycmVudFN0eWxlW2VdKSxudWxsPT1yfHxuJiZcIm5vbmVcIiE9PW4mJlwiYXV0b1wiIT09biYmXCJhdXRvIGF1dG9cIiE9PW4/bjpyKTpZKHQpfSxRPU4uY29udmVydFRvUGl4ZWxzPWZ1bmN0aW9uKHQsaSxzLHIsbil7aWYoXCJweFwiPT09cnx8IXIpcmV0dXJuIHM7aWYoXCJhdXRvXCI9PT1yfHwhcylyZXR1cm4gMDt2YXIgbyxoLGwsXz1BLnRlc3QoaSksdT10LHA9Ri5zdHlsZSxjPTA+cztpZihjJiYocz0tcyksXCIlXCI9PT1yJiYtMSE9PWkuaW5kZXhPZihcImJvcmRlclwiKSlvPXMvMTAwKihfP3QuY2xpZW50V2lkdGg6dC5jbGllbnRIZWlnaHQpO2Vsc2V7aWYocC5jc3NUZXh0PVwiYm9yZGVyOjAgc29saWQgcmVkO3Bvc2l0aW9uOlwiK1codCxcInBvc2l0aW9uXCIpK1wiO2xpbmUtaGVpZ2h0OjA7XCIsXCIlXCIhPT1yJiZ1LmFwcGVuZENoaWxkKXBbXz9cImJvcmRlckxlZnRXaWR0aFwiOlwiYm9yZGVyVG9wV2lkdGhcIl09cytyO2Vsc2V7aWYodT10LnBhcmVudE5vZGV8fEUuYm9keSxoPXUuX2dzQ2FjaGUsbD1lLnRpY2tlci5mcmFtZSxoJiZfJiZoLnRpbWU9PT1sKXJldHVybiBoLndpZHRoKnMvMTAwO3BbXz9cIndpZHRoXCI6XCJoZWlnaHRcIl09cytyfXUuYXBwZW5kQ2hpbGQoRiksbz1wYXJzZUZsb2F0KEZbXz9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIl0pLHUucmVtb3ZlQ2hpbGQoRiksXyYmXCIlXCI9PT1yJiZhLmNhY2hlV2lkdGhzIT09ITEmJihoPXUuX2dzQ2FjaGU9dS5fZ3NDYWNoZXx8e30saC50aW1lPWwsaC53aWR0aD0xMDAqKG8vcykpLDAhPT1vfHxufHwobz1RKHQsaSxzLHIsITApKX1yZXR1cm4gYz8tbzpvfSxaPU4uY2FsY3VsYXRlT2Zmc2V0PWZ1bmN0aW9uKHQsZSxpKXtpZihcImFic29sdXRlXCIhPT1XKHQsXCJwb3NpdGlvblwiLGkpKXJldHVybiAwO3ZhciBzPVwibGVmdFwiPT09ZT9cIkxlZnRcIjpcIlRvcFwiLHI9Vyh0LFwibWFyZ2luXCIrcyxpKTtyZXR1cm4gdFtcIm9mZnNldFwiK3NdLShRKHQsZSxwYXJzZUZsb2F0KHIpLHIucmVwbGFjZSh5LFwiXCIpKXx8MCl9LCQ9ZnVuY3Rpb24odCxlKXt2YXIgaSxzLHI9e307aWYoZT1lfHxHKHQsbnVsbCkpaWYoaT1lLmxlbmd0aClmb3IoOy0taT4tMTspcltlW2ldLnJlcGxhY2UoUyxSKV09ZS5nZXRQcm9wZXJ0eVZhbHVlKGVbaV0pO2Vsc2UgZm9yKGkgaW4gZSlyW2ldPWVbaV07ZWxzZSBpZihlPXQuY3VycmVudFN0eWxlfHx0LnN0eWxlKWZvcihpIGluIGUpXCJzdHJpbmdcIj09dHlwZW9mIGkmJnZvaWQgMD09PXJbaV0mJihyW2kucmVwbGFjZShTLFIpXT1lW2ldKTtyZXR1cm4gVXx8KHIub3BhY2l0eT1ZKHQpKSxzPVJlKHQsZSwhMSksci5yb3RhdGlvbj1zLnJvdGF0aW9uLHIuc2tld1g9cy5za2V3WCxyLnNjYWxlWD1zLnNjYWxlWCxyLnNjYWxlWT1zLnNjYWxlWSxyLng9cy54LHIueT1zLnkseGUmJihyLno9cy56LHIucm90YXRpb25YPXMucm90YXRpb25YLHIucm90YXRpb25ZPXMucm90YXRpb25ZLHIuc2NhbGVaPXMuc2NhbGVaKSxyLmZpbHRlcnMmJmRlbGV0ZSByLmZpbHRlcnMscn0sSD1mdW5jdGlvbih0LGUsaSxzLHIpe3ZhciBuLGEsbyxoPXt9LGw9dC5zdHlsZTtmb3IoYSBpbiBpKVwiY3NzVGV4dFwiIT09YSYmXCJsZW5ndGhcIiE9PWEmJmlzTmFOKGEpJiYoZVthXSE9PShuPWlbYV0pfHxyJiZyW2FdKSYmLTE9PT1hLmluZGV4T2YoXCJPcmlnaW5cIikmJihcIm51bWJlclwiPT10eXBlb2Ygbnx8XCJzdHJpbmdcIj09dHlwZW9mIG4pJiYoaFthXT1cImF1dG9cIiE9PW58fFwibGVmdFwiIT09YSYmXCJ0b3BcIiE9PWE/XCJcIiE9PW4mJlwiYXV0b1wiIT09biYmXCJub25lXCIhPT1ufHxcInN0cmluZ1wiIT10eXBlb2YgZVthXXx8XCJcIj09PWVbYV0ucmVwbGFjZSh2LFwiXCIpP246MDpaKHQsYSksdm9pZCAwIT09bFthXSYmKG89bmV3IHVlKGwsYSxsW2FdLG8pKSk7aWYocylmb3IoYSBpbiBzKVwiY2xhc3NOYW1lXCIhPT1hJiYoaFthXT1zW2FdKTtyZXR1cm57ZGlmczpoLGZpcnN0TVBUOm99fSxLPXt3aWR0aDpbXCJMZWZ0XCIsXCJSaWdodFwiXSxoZWlnaHQ6W1wiVG9wXCIsXCJCb3R0b21cIl19LEo9W1wibWFyZ2luTGVmdFwiLFwibWFyZ2luUmlnaHRcIixcIm1hcmdpblRvcFwiLFwibWFyZ2luQm90dG9tXCJdLHRlPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcz1wYXJzZUZsb2F0KFwid2lkdGhcIj09PWU/dC5vZmZzZXRXaWR0aDp0Lm9mZnNldEhlaWdodCkscj1LW2VdLG49ci5sZW5ndGg7Zm9yKGk9aXx8Ryh0LG51bGwpOy0tbj4tMTspcy09cGFyc2VGbG9hdChXKHQsXCJwYWRkaW5nXCIrcltuXSxpLCEwKSl8fDAscy09cGFyc2VGbG9hdChXKHQsXCJib3JkZXJcIityW25dK1wiV2lkdGhcIixpLCEwKSl8fDA7cmV0dXJuIHN9LGVlPWZ1bmN0aW9uKHQsZSl7KG51bGw9PXR8fFwiXCI9PT10fHxcImF1dG9cIj09PXR8fFwiYXV0byBhdXRvXCI9PT10KSYmKHQ9XCIwIDBcIik7dmFyIGk9dC5zcGxpdChcIiBcIikscz0tMSE9PXQuaW5kZXhPZihcImxlZnRcIik/XCIwJVwiOi0xIT09dC5pbmRleE9mKFwicmlnaHRcIik/XCIxMDAlXCI6aVswXSxyPS0xIT09dC5pbmRleE9mKFwidG9wXCIpP1wiMCVcIjotMSE9PXQuaW5kZXhPZihcImJvdHRvbVwiKT9cIjEwMCVcIjppWzFdO3JldHVybiBudWxsPT1yP3I9XCIwXCI6XCJjZW50ZXJcIj09PXImJihyPVwiNTAlXCIpLChcImNlbnRlclwiPT09c3x8aXNOYU4ocGFyc2VGbG9hdChzKSkmJi0xPT09KHMrXCJcIikuaW5kZXhPZihcIj1cIikpJiYocz1cIjUwJVwiKSxlJiYoZS5veHA9LTEhPT1zLmluZGV4T2YoXCIlXCIpLGUub3lwPS0xIT09ci5pbmRleE9mKFwiJVwiKSxlLm94cj1cIj1cIj09PXMuY2hhckF0KDEpLGUub3lyPVwiPVwiPT09ci5jaGFyQXQoMSksZS5veD1wYXJzZUZsb2F0KHMucmVwbGFjZSh2LFwiXCIpKSxlLm95PXBhcnNlRmxvYXQoci5yZXBsYWNlKHYsXCJcIikpKSxzK1wiIFwiK3IrKGkubGVuZ3RoPjI/XCIgXCIraVsyXTpcIlwiKX0saWU9ZnVuY3Rpb24odCxlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdCYmXCI9XCI9PT10LmNoYXJBdCgxKT9wYXJzZUludCh0LmNoYXJBdCgwKStcIjFcIiwxMCkqcGFyc2VGbG9hdCh0LnN1YnN0cigyKSk6cGFyc2VGbG9hdCh0KS1wYXJzZUZsb2F0KGUpfSxzZT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsPT10P2U6XCJzdHJpbmdcIj09dHlwZW9mIHQmJlwiPVwiPT09dC5jaGFyQXQoMSk/cGFyc2VJbnQodC5jaGFyQXQoMCkrXCIxXCIsMTApKnBhcnNlRmxvYXQodC5zdWJzdHIoMikpK2U6cGFyc2VGbG9hdCh0KX0scmU9ZnVuY3Rpb24odCxlLGkscyl7dmFyIHIsbixhLG8saD0xZS02O3JldHVybiBudWxsPT10P289ZTpcIm51bWJlclwiPT10eXBlb2YgdD9vPXQ6KHI9MzYwLG49dC5zcGxpdChcIl9cIiksYT1OdW1iZXIoblswXS5yZXBsYWNlKHYsXCJcIikpKigtMT09PXQuaW5kZXhPZihcInJhZFwiKT8xOnopLShcIj1cIj09PXQuY2hhckF0KDEpPzA6ZSksbi5sZW5ndGgmJihzJiYoc1tpXT1lK2EpLC0xIT09dC5pbmRleE9mKFwic2hvcnRcIikmJihhJT1yLGEhPT1hJShyLzIpJiYoYT0wPmE/YStyOmEtcikpLC0xIT09dC5pbmRleE9mKFwiX2N3XCIpJiYwPmE/YT0oYSs5OTk5OTk5OTk5KnIpJXItKDB8YS9yKSpyOi0xIT09dC5pbmRleE9mKFwiY2N3XCIpJiZhPjAmJihhPShhLTk5OTk5OTk5OTkqciklci0oMHxhL3IpKnIpKSxvPWUrYSksaD5vJiZvPi1oJiYobz0wKSxvfSxuZT17YXF1YTpbMCwyNTUsMjU1XSxsaW1lOlswLDI1NSwwXSxzaWx2ZXI6WzE5MiwxOTIsMTkyXSxibGFjazpbMCwwLDBdLG1hcm9vbjpbMTI4LDAsMF0sdGVhbDpbMCwxMjgsMTI4XSxibHVlOlswLDAsMjU1XSxuYXZ5OlswLDAsMTI4XSx3aGl0ZTpbMjU1LDI1NSwyNTVdLGZ1Y2hzaWE6WzI1NSwwLDI1NV0sb2xpdmU6WzEyOCwxMjgsMF0seWVsbG93OlsyNTUsMjU1LDBdLG9yYW5nZTpbMjU1LDE2NSwwXSxncmF5OlsxMjgsMTI4LDEyOF0scHVycGxlOlsxMjgsMCwxMjhdLGdyZWVuOlswLDEyOCwwXSxyZWQ6WzI1NSwwLDBdLHBpbms6WzI1NSwxOTIsMjAzXSxjeWFuOlswLDI1NSwyNTVdLHRyYW5zcGFyZW50OlsyNTUsMjU1LDI1NSwwXX0sYWU9ZnVuY3Rpb24odCxlLGkpe3JldHVybiB0PTA+dD90KzE6dD4xP3QtMTp0LDB8MjU1KigxPjYqdD9lKzYqKGktZSkqdDouNT50P2k6Mj4zKnQ/ZSs2KihpLWUpKigyLzMtdCk6ZSkrLjV9LG9lPWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyLG4sYTtyZXR1cm4gdCYmXCJcIiE9PXQ/XCJudW1iZXJcIj09dHlwZW9mIHQ/W3Q+PjE2LDI1NSZ0Pj44LDI1NSZ0XTooXCIsXCI9PT10LmNoYXJBdCh0Lmxlbmd0aC0xKSYmKHQ9dC5zdWJzdHIoMCx0Lmxlbmd0aC0xKSksbmVbdF0/bmVbdF06XCIjXCI9PT10LmNoYXJBdCgwKT8oND09PXQubGVuZ3RoJiYoZT10LmNoYXJBdCgxKSxpPXQuY2hhckF0KDIpLHM9dC5jaGFyQXQoMyksdD1cIiNcIitlK2UraStpK3MrcyksdD1wYXJzZUludCh0LnN1YnN0cigxKSwxNiksW3Q+PjE2LDI1NSZ0Pj44LDI1NSZ0XSk6XCJoc2xcIj09PXQuc3Vic3RyKDAsMyk/KHQ9dC5tYXRjaChtKSxyPU51bWJlcih0WzBdKSUzNjAvMzYwLG49TnVtYmVyKHRbMV0pLzEwMCxhPU51bWJlcih0WzJdKS8xMDAsaT0uNT49YT9hKihuKzEpOmErbi1hKm4sZT0yKmEtaSx0Lmxlbmd0aD4zJiYodFszXT1OdW1iZXIodFszXSkpLHRbMF09YWUocisxLzMsZSxpKSx0WzFdPWFlKHIsZSxpKSx0WzJdPWFlKHItMS8zLGUsaSksdCk6KHQ9dC5tYXRjaChtKXx8bmUudHJhbnNwYXJlbnQsdFswXT1OdW1iZXIodFswXSksdFsxXT1OdW1iZXIodFsxXSksdFsyXT1OdW1iZXIodFsyXSksdC5sZW5ndGg+MyYmKHRbM109TnVtYmVyKHRbM10pKSx0KSk6bmUuYmxhY2t9LGhlPVwiKD86XFxcXGIoPzooPzpyZ2J8cmdiYXxoc2x8aHNsYSlcXFxcKC4rP1xcXFwpKXxcXFxcQiMuKz9cXFxcYlwiO2ZvcihoIGluIG5lKWhlKz1cInxcIitoK1wiXFxcXGJcIjtoZT1SZWdFeHAoaGUrXCIpXCIsXCJnaVwiKTt2YXIgbGU9ZnVuY3Rpb24odCxlLGkscyl7aWYobnVsbD09dClyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHR9O3ZhciByLG49ZT8odC5tYXRjaChoZSl8fFtcIlwiXSlbMF06XCJcIixhPXQuc3BsaXQobikuam9pbihcIlwiKS5tYXRjaChnKXx8W10sbz10LnN1YnN0cigwLHQuaW5kZXhPZihhWzBdKSksaD1cIilcIj09PXQuY2hhckF0KHQubGVuZ3RoLTEpP1wiKVwiOlwiXCIsbD0tMSE9PXQuaW5kZXhPZihcIiBcIik/XCIgXCI6XCIsXCIsXz1hLmxlbmd0aCx1PV8+MD9hWzBdLnJlcGxhY2UobSxcIlwiKTpcIlwiO3JldHVybiBfP3I9ZT9mdW5jdGlvbih0KXt2YXIgZSxwLGMsZjtpZihcIm51bWJlclwiPT10eXBlb2YgdCl0Kz11O2Vsc2UgaWYocyYmRC50ZXN0KHQpKXtmb3IoZj10LnJlcGxhY2UoRCxcInxcIikuc3BsaXQoXCJ8XCIpLGM9MDtmLmxlbmd0aD5jO2MrKylmW2NdPXIoZltjXSk7cmV0dXJuIGYuam9pbihcIixcIil9aWYoZT0odC5tYXRjaChoZSl8fFtuXSlbMF0scD10LnNwbGl0KGUpLmpvaW4oXCJcIikubWF0Y2goZyl8fFtdLGM9cC5sZW5ndGgsXz5jLS0pZm9yKDtfPisrYzspcFtjXT1pP3BbMHwoYy0xKS8yXTphW2NdO3JldHVybiBvK3Auam9pbihsKStsK2UraCsoLTEhPT10LmluZGV4T2YoXCJpbnNldFwiKT9cIiBpbnNldFwiOlwiXCIpfTpmdW5jdGlvbih0KXt2YXIgZSxuLHA7aWYoXCJudW1iZXJcIj09dHlwZW9mIHQpdCs9dTtlbHNlIGlmKHMmJkQudGVzdCh0KSl7Zm9yKG49dC5yZXBsYWNlKEQsXCJ8XCIpLnNwbGl0KFwifFwiKSxwPTA7bi5sZW5ndGg+cDtwKyspbltwXT1yKG5bcF0pO3JldHVybiBuLmpvaW4oXCIsXCIpfWlmKGU9dC5tYXRjaChnKXx8W10scD1lLmxlbmd0aCxfPnAtLSlmb3IoO18+KytwOyllW3BdPWk/ZVswfChwLTEpLzJdOmFbcF07cmV0dXJuIG8rZS5qb2luKGwpK2h9OmZ1bmN0aW9uKHQpe3JldHVybiB0fX0sX2U9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9dC5zcGxpdChcIixcIiksZnVuY3Rpb24oZSxpLHMscixuLGEsbyl7dmFyIGgsbD0oaStcIlwiKS5zcGxpdChcIiBcIik7Zm9yKG89e30saD0wOzQ+aDtoKyspb1t0W2hdXT1sW2hdPWxbaF18fGxbKGgtMSkvMj4+MF07cmV0dXJuIHIucGFyc2UoZSxvLG4sYSl9fSx1ZT0oTi5fc2V0UGx1Z2luUmF0aW89ZnVuY3Rpb24odCl7dGhpcy5wbHVnaW4uc2V0UmF0aW8odCk7Zm9yKHZhciBlLGkscyxyLG49dGhpcy5kYXRhLGE9bi5wcm94eSxvPW4uZmlyc3RNUFQsaD0xZS02O287KWU9YVtvLnZdLG8ucj9lPU1hdGgucm91bmQoZSk6aD5lJiZlPi1oJiYoZT0wKSxvLnRbby5wXT1lLG89by5fbmV4dDtpZihuLmF1dG9Sb3RhdGUmJihuLmF1dG9Sb3RhdGUucm90YXRpb249YS5yb3RhdGlvbiksMT09PXQpZm9yKG89bi5maXJzdE1QVDtvOyl7aWYoaT1vLnQsaS50eXBlKXtpZigxPT09aS50eXBlKXtmb3Iocj1pLnhzMCtpLnMraS54czEscz0xO2kubD5zO3MrKylyKz1pW1wieG5cIitzXStpW1wieHNcIisocysxKV07aS5lPXJ9fWVsc2UgaS5lPWkucytpLnhzMDtvPW8uX25leHR9fSxmdW5jdGlvbih0LGUsaSxzLHIpe3RoaXMudD10LHRoaXMucD1lLHRoaXMudj1pLHRoaXMucj1yLHMmJihzLl9wcmV2PXRoaXMsdGhpcy5fbmV4dD1zKX0pLHBlPShOLl9wYXJzZVRvUHJveHk9ZnVuY3Rpb24odCxlLGkscyxyLG4pe3ZhciBhLG8saCxsLF8sdT1zLHA9e30sYz17fSxmPWkuX3RyYW5zZm9ybSxtPUk7Zm9yKGkuX3RyYW5zZm9ybT1udWxsLEk9ZSxzPV89aS5wYXJzZSh0LGUscyxyKSxJPW0sbiYmKGkuX3RyYW5zZm9ybT1mLHUmJih1Ll9wcmV2PW51bGwsdS5fcHJldiYmKHUuX3ByZXYuX25leHQ9bnVsbCkpKTtzJiZzIT09dTspe2lmKDE+PXMudHlwZSYmKG89cy5wLGNbb109cy5zK3MuYyxwW29dPXMucyxufHwobD1uZXcgdWUocyxcInNcIixvLGwscy5yKSxzLmM9MCksMT09PXMudHlwZSkpZm9yKGE9cy5sOy0tYT4wOyloPVwieG5cIithLG89cy5wK1wiX1wiK2gsY1tvXT1zLmRhdGFbaF0scFtvXT1zW2hdLG58fChsPW5ldyB1ZShzLGgsbyxsLHMucnhwW2hdKSk7cz1zLl9uZXh0fXJldHVybntwcm94eTpwLGVuZDpjLGZpcnN0TVBUOmwscHQ6X319LE4uQ1NTUHJvcFR3ZWVuPWZ1bmN0aW9uKHQsZSxzLHIsYSxvLGgsbCxfLHUscCl7dGhpcy50PXQsdGhpcy5wPWUsdGhpcy5zPXMsdGhpcy5jPXIsdGhpcy5uPWh8fGUsdCBpbnN0YW5jZW9mIHBlfHxuLnB1c2godGhpcy5uKSx0aGlzLnI9bCx0aGlzLnR5cGU9b3x8MCxfJiYodGhpcy5wcj1fLGk9ITApLHRoaXMuYj12b2lkIDA9PT11P3M6dSx0aGlzLmU9dm9pZCAwPT09cD9zK3I6cCxhJiYodGhpcy5fbmV4dD1hLGEuX3ByZXY9dGhpcyl9KSxjZT1hLnBhcnNlQ29tcGxleD1mdW5jdGlvbih0LGUsaSxzLHIsbixhLG8saCxfKXtpPWl8fG58fFwiXCIsYT1uZXcgcGUodCxlLDAsMCxhLF8/MjoxLG51bGwsITEsbyxpLHMpLHMrPVwiXCI7dmFyIHUscCxjLGYsZyx2LHksVCx3LHgsUCxTLGs9aS5zcGxpdChcIiwgXCIpLmpvaW4oXCIsXCIpLnNwbGl0KFwiIFwiKSxSPXMuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksQT1rLmxlbmd0aCxPPWwhPT0hMTtmb3IoKC0xIT09cy5pbmRleE9mKFwiLFwiKXx8LTEhPT1pLmluZGV4T2YoXCIsXCIpKSYmKGs9ay5qb2luKFwiIFwiKS5yZXBsYWNlKEQsXCIsIFwiKS5zcGxpdChcIiBcIiksUj1SLmpvaW4oXCIgXCIpLnJlcGxhY2UoRCxcIiwgXCIpLnNwbGl0KFwiIFwiKSxBPWsubGVuZ3RoKSxBIT09Ui5sZW5ndGgmJihrPShufHxcIlwiKS5zcGxpdChcIiBcIiksQT1rLmxlbmd0aCksYS5wbHVnaW49aCxhLnNldFJhdGlvPV8sdT0wO0E+dTt1KyspaWYoZj1rW3VdLGc9Ult1XSxUPXBhcnNlRmxvYXQoZiksVHx8MD09PVQpYS5hcHBlbmRYdHJhKFwiXCIsVCxpZShnLFQpLGcucmVwbGFjZShkLFwiXCIpLE8mJi0xIT09Zy5pbmRleE9mKFwicHhcIiksITApO2Vsc2UgaWYociYmKFwiI1wiPT09Zi5jaGFyQXQoMCl8fG5lW2ZdfHxiLnRlc3QoZikpKVM9XCIsXCI9PT1nLmNoYXJBdChnLmxlbmd0aC0xKT9cIiksXCI6XCIpXCIsZj1vZShmKSxnPW9lKGcpLHc9Zi5sZW5ndGgrZy5sZW5ndGg+Nix3JiYhVSYmMD09PWdbM10/KGFbXCJ4c1wiK2EubF0rPWEubD9cIiB0cmFuc3BhcmVudFwiOlwidHJhbnNwYXJlbnRcIixhLmU9YS5lLnNwbGl0KFJbdV0pLmpvaW4oXCJ0cmFuc3BhcmVudFwiKSk6KFV8fCh3PSExKSxhLmFwcGVuZFh0cmEodz9cInJnYmEoXCI6XCJyZ2IoXCIsZlswXSxnWzBdLWZbMF0sXCIsXCIsITAsITApLmFwcGVuZFh0cmEoXCJcIixmWzFdLGdbMV0tZlsxXSxcIixcIiwhMCkuYXBwZW5kWHRyYShcIlwiLGZbMl0sZ1syXS1mWzJdLHc/XCIsXCI6UywhMCksdyYmKGY9ND5mLmxlbmd0aD8xOmZbM10sYS5hcHBlbmRYdHJhKFwiXCIsZiwoND5nLmxlbmd0aD8xOmdbM10pLWYsUywhMSkpKTtlbHNlIGlmKHY9Zi5tYXRjaChtKSl7aWYoeT1nLm1hdGNoKGQpLCF5fHx5Lmxlbmd0aCE9PXYubGVuZ3RoKXJldHVybiBhO2ZvcihjPTAscD0wO3YubGVuZ3RoPnA7cCsrKVA9dltwXSx4PWYuaW5kZXhPZihQLGMpLGEuYXBwZW5kWHRyYShmLnN1YnN0cihjLHgtYyksTnVtYmVyKFApLGllKHlbcF0sUCksXCJcIixPJiZcInB4XCI9PT1mLnN1YnN0cih4K1AubGVuZ3RoLDIpLDA9PT1wKSxjPXgrUC5sZW5ndGg7YVtcInhzXCIrYS5sXSs9Zi5zdWJzdHIoYyl9ZWxzZSBhW1wieHNcIithLmxdKz1hLmw/XCIgXCIrZjpmO2lmKC0xIT09cy5pbmRleE9mKFwiPVwiKSYmYS5kYXRhKXtmb3IoUz1hLnhzMCthLmRhdGEucyx1PTE7YS5sPnU7dSsrKVMrPWFbXCJ4c1wiK3VdK2EuZGF0YVtcInhuXCIrdV07YS5lPVMrYVtcInhzXCIrdV19cmV0dXJuIGEubHx8KGEudHlwZT0tMSxhLnhzMD1hLmUpLGEueGZpcnN0fHxhfSxmZT05O2ZvcihoPXBlLnByb3RvdHlwZSxoLmw9aC5wcj0wOy0tZmU+MDspaFtcInhuXCIrZmVdPTAsaFtcInhzXCIrZmVdPVwiXCI7aC54czA9XCJcIixoLl9uZXh0PWguX3ByZXY9aC54Zmlyc3Q9aC5kYXRhPWgucGx1Z2luPWguc2V0UmF0aW89aC5yeHA9bnVsbCxoLmFwcGVuZFh0cmE9ZnVuY3Rpb24odCxlLGkscyxyLG4pe3ZhciBhPXRoaXMsbz1hLmw7cmV0dXJuIGFbXCJ4c1wiK29dKz1uJiZvP1wiIFwiK3Q6dHx8XCJcIixpfHwwPT09b3x8YS5wbHVnaW4/KGEubCsrLGEudHlwZT1hLnNldFJhdGlvPzI6MSxhW1wieHNcIithLmxdPXN8fFwiXCIsbz4wPyhhLmRhdGFbXCJ4blwiK29dPWUraSxhLnJ4cFtcInhuXCIrb109cixhW1wieG5cIitvXT1lLGEucGx1Z2lufHwoYS54Zmlyc3Q9bmV3IHBlKGEsXCJ4blwiK28sZSxpLGEueGZpcnN0fHxhLDAsYS5uLHIsYS5wciksYS54Zmlyc3QueHMwPTApLGEpOihhLmRhdGE9e3M6ZStpfSxhLnJ4cD17fSxhLnM9ZSxhLmM9aSxhLnI9cixhKSk6KGFbXCJ4c1wiK29dKz1lKyhzfHxcIlwiKSxhKX07dmFyIG1lPWZ1bmN0aW9uKHQsZSl7ZT1lfHx7fSx0aGlzLnA9ZS5wcmVmaXg/Vih0KXx8dDp0LG9bdF09b1t0aGlzLnBdPXRoaXMsdGhpcy5mb3JtYXQ9ZS5mb3JtYXR0ZXJ8fGxlKGUuZGVmYXVsdFZhbHVlLGUuY29sb3IsZS5jb2xsYXBzaWJsZSxlLm11bHRpKSxlLnBhcnNlciYmKHRoaXMucGFyc2U9ZS5wYXJzZXIpLHRoaXMuY2xycz1lLmNvbG9yLHRoaXMubXVsdGk9ZS5tdWx0aSx0aGlzLmtleXdvcmQ9ZS5rZXl3b3JkLHRoaXMuZGZsdD1lLmRlZmF1bHRWYWx1ZSx0aGlzLnByPWUucHJpb3JpdHl8fDB9LGRlPU4uX3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wPWZ1bmN0aW9uKHQsZSxpKXtcIm9iamVjdFwiIT10eXBlb2YgZSYmKGU9e3BhcnNlcjppfSk7dmFyIHMscixuPXQuc3BsaXQoXCIsXCIpLGE9ZS5kZWZhdWx0VmFsdWU7Zm9yKGk9aXx8W2FdLHM9MDtuLmxlbmd0aD5zO3MrKyllLnByZWZpeD0wPT09cyYmZS5wcmVmaXgsZS5kZWZhdWx0VmFsdWU9aVtzXXx8YSxyPW5ldyBtZShuW3NdLGUpfSxnZT1mdW5jdGlvbih0KXtpZighb1t0XSl7dmFyIGU9dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSt0LnN1YnN0cigxKStcIlBsdWdpblwiO2RlKHQse3BhcnNlcjpmdW5jdGlvbih0LGkscyxyLG4sYSxoKXt2YXIgbD0oX2dzU2NvcGUuR3JlZW5Tb2NrR2xvYmFsc3x8X2dzU2NvcGUpLmNvbS5ncmVlbnNvY2sucGx1Z2luc1tlXTtyZXR1cm4gbD8obC5fY3NzUmVnaXN0ZXIoKSxvW3NdLnBhcnNlKHQsaSxzLHIsbixhLGgpKTooaihcIkVycm9yOiBcIitlK1wiIGpzIGZpbGUgbm90IGxvYWRlZC5cIiksbil9fSl9fTtoPW1lLnByb3RvdHlwZSxoLnBhcnNlQ29tcGxleD1mdW5jdGlvbih0LGUsaSxzLHIsbil7dmFyIGEsbyxoLGwsXyx1LHA9dGhpcy5rZXl3b3JkO2lmKHRoaXMubXVsdGkmJihELnRlc3QoaSl8fEQudGVzdChlKT8obz1lLnJlcGxhY2UoRCxcInxcIikuc3BsaXQoXCJ8XCIpLGg9aS5yZXBsYWNlKEQsXCJ8XCIpLnNwbGl0KFwifFwiKSk6cCYmKG89W2VdLGg9W2ldKSksaCl7Zm9yKGw9aC5sZW5ndGg+by5sZW5ndGg/aC5sZW5ndGg6by5sZW5ndGgsYT0wO2w+YTthKyspZT1vW2FdPW9bYV18fHRoaXMuZGZsdCxpPWhbYV09aFthXXx8dGhpcy5kZmx0LHAmJihfPWUuaW5kZXhPZihwKSx1PWkuaW5kZXhPZihwKSxfIT09dSYmKGk9LTE9PT11P2g6byxpW2FdKz1cIiBcIitwKSk7ZT1vLmpvaW4oXCIsIFwiKSxpPWguam9pbihcIiwgXCIpfXJldHVybiBjZSh0LHRoaXMucCxlLGksdGhpcy5jbHJzLHRoaXMuZGZsdCxzLHRoaXMucHIscixuKX0saC5wYXJzZT1mdW5jdGlvbih0LGUsaSxzLG4sYSl7cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsdGhpcy5mb3JtYXQoVyh0LHRoaXMucCxyLCExLHRoaXMuZGZsdCkpLHRoaXMuZm9ybWF0KGUpLG4sYSl9LGEucmVnaXN0ZXJTcGVjaWFsUHJvcD1mdW5jdGlvbih0LGUsaSl7ZGUodCx7cGFyc2VyOmZ1bmN0aW9uKHQscyxyLG4sYSxvKXt2YXIgaD1uZXcgcGUodCxyLDAsMCxhLDIsciwhMSxpKTtyZXR1cm4gaC5wbHVnaW49byxoLnNldFJhdGlvPWUodCxzLG4uX3R3ZWVuLHIpLGh9LHByaW9yaXR5Oml9KX07dmFyIHZlPVwic2NhbGVYLHNjYWxlWSxzY2FsZVoseCx5LHosc2tld1gsc2tld1kscm90YXRpb24scm90YXRpb25YLHJvdGF0aW9uWSxwZXJzcGVjdGl2ZSx4UGVyY2VudCx5UGVyY2VudFwiLnNwbGl0KFwiLFwiKSx5ZT1WKFwidHJhbnNmb3JtXCIpLFRlPUIrXCJ0cmFuc2Zvcm1cIix3ZT1WKFwidHJhbnNmb3JtT3JpZ2luXCIpLHhlPW51bGwhPT1WKFwicGVyc3BlY3RpdmVcIiksYmU9Ti5UcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnNrZXdZPTB9LFBlPXdpbmRvdy5TVkdFbGVtZW50LFNlPVBlJiYoZnx8L0FuZHJvaWQvaS50ZXN0KFgpJiYhd2luZG93LmNocm9tZSksa2U9ZnVuY3Rpb24odCxlLGkpe3ZhciBzPXQuZ2V0QkJveCgpO2U9ZWUoZSkuc3BsaXQoXCIgXCIpLGkueE9yaWdpbj0oLTEhPT1lWzBdLmluZGV4T2YoXCIlXCIpP3BhcnNlRmxvYXQoZVswXSkvMTAwKnMud2lkdGg6cGFyc2VGbG9hdChlWzBdKSkrcy54LGkueU9yaWdpbj0oLTEhPT1lWzFdLmluZGV4T2YoXCIlXCIpP3BhcnNlRmxvYXQoZVsxXSkvMTAwKnMuaGVpZ2h0OnBhcnNlRmxvYXQoZVsxXSkpK3MueX0sUmU9Ti5nZXRUcmFuc2Zvcm09ZnVuY3Rpb24odCxlLGkscyl7aWYodC5fZ3NUcmFuc2Zvcm0mJmkmJiFzKXJldHVybiB0Ll9nc1RyYW5zZm9ybTt2YXIgbixvLGgsbCxfLHUscCxjLGYsbSxkLGcsdix5PWk/dC5fZ3NUcmFuc2Zvcm18fG5ldyBiZTpuZXcgYmUsVD0wPnkuc2NhbGVYLHc9MmUtNSx4PTFlNSxiPTE3OS45OSxQPWIqTSxTPXhlP3BhcnNlRmxvYXQoVyh0LHdlLGUsITEsXCIwIDAgMFwiKS5zcGxpdChcIiBcIilbMl0pfHx5LnpPcmlnaW58fDA6MCxrPXBhcnNlRmxvYXQoYS5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUpfHwwO2lmKHllP249Vyh0LFRlLGUsITApOnQuY3VycmVudFN0eWxlJiYobj10LmN1cnJlbnRTdHlsZS5maWx0ZXIubWF0Y2goTyksbj1uJiY0PT09bi5sZW5ndGg/W25bMF0uc3Vic3RyKDQpLE51bWJlcihuWzJdLnN1YnN0cig0KSksTnVtYmVyKG5bMV0uc3Vic3RyKDQpKSxuWzNdLnN1YnN0cig0KSx5Lnh8fDAseS55fHwwXS5qb2luKFwiLFwiKTpcIlwiKSxuJiZcIm5vbmVcIiE9PW4mJlwibWF0cml4KDEsIDAsIDAsIDEsIDAsIDApXCIhPT1uKXtmb3Iobz0obnx8XCJcIikubWF0Y2goLyg/OlxcLXxcXGIpW1xcZFxcLVxcLmVdK1xcYi9naSl8fFtdLGg9by5sZW5ndGg7LS1oPi0xOylsPU51bWJlcihvW2hdKSxvW2hdPShfPWwtKGx8PTApKT8oMHxfKngrKDA+Xz8tLjU6LjUpKS94K2w6bDtpZigxNj09PW8ubGVuZ3RoKXt2YXIgUj1vWzhdLEE9b1s5XSxDPW9bMTBdLEQ9b1sxMl0sST1vWzEzXSxFPW9bMTRdO2lmKHkuek9yaWdpbiYmKEU9LXkuek9yaWdpbixEPVIqRS1vWzEyXSxJPUEqRS1vWzEzXSxFPUMqRSt5LnpPcmlnaW4tb1sxNF0pLCFpfHxzfHxudWxsPT15LnJvdGF0aW9uWCl7dmFyIEYsTCxOLFgsVSxZLGosQj1vWzBdLHE9b1sxXSxWPW9bMl0sRz1vWzNdLFE9b1s0XSxaPW9bNV0sJD1vWzZdLEg9b1s3XSxLPW9bMTFdLEo9TWF0aC5hdGFuMigkLEMpLHRlPS1QPkp8fEo+UDt5LnJvdGF0aW9uWD1KKnosSiYmKFg9TWF0aC5jb3MoLUopLFU9TWF0aC5zaW4oLUopLEY9USpYK1IqVSxMPVoqWCtBKlUsTj0kKlgrQypVLFI9USotVStSKlgsQT1aKi1VK0EqWCxDPSQqLVUrQypYLEs9SCotVStLKlgsUT1GLFo9TCwkPU4pLEo9TWF0aC5hdGFuMihSLEIpLHkucm90YXRpb25ZPUoqeixKJiYoWT0tUD5KfHxKPlAsWD1NYXRoLmNvcygtSiksVT1NYXRoLnNpbigtSiksRj1CKlgtUipVLEw9cSpYLUEqVSxOPVYqWC1DKlUsQT1xKlUrQSpYLEM9VipVK0MqWCxLPUcqVStLKlgsQj1GLHE9TCxWPU4pLEo9TWF0aC5hdGFuMihxLFopLHkucm90YXRpb249Sip6LEomJihqPS1QPkp8fEo+UCxYPU1hdGguY29zKC1KKSxVPU1hdGguc2luKC1KKSxCPUIqWCtRKlUsTD1xKlgrWipVLFo9cSotVStaKlgsJD1WKi1VKyQqWCxxPUwpLGomJnRlP3kucm90YXRpb249eS5yb3RhdGlvblg9MDpqJiZZP3kucm90YXRpb249eS5yb3RhdGlvblk9MDpZJiZ0ZSYmKHkucm90YXRpb25ZPXkucm90YXRpb25YPTApLHkuc2NhbGVYPSgwfE1hdGguc3FydChCKkIrcSpxKSp4Ky41KS94LHkuc2NhbGVZPSgwfE1hdGguc3FydChaKlorQSpBKSp4Ky41KS94LHkuc2NhbGVaPSgwfE1hdGguc3FydCgkKiQrQypDKSp4Ky41KS94LHkuc2tld1g9MCx5LnBlcnNwZWN0aXZlPUs/MS8oMD5LPy1LOkspOjAseS54PUQseS55PUkseS56PUV9fWVsc2UgaWYoISh4ZSYmIXMmJm8ubGVuZ3RoJiZ5Lng9PT1vWzRdJiZ5Lnk9PT1vWzVdJiYoeS5yb3RhdGlvblh8fHkucm90YXRpb25ZKXx8dm9pZCAwIT09eS54JiZcIm5vbmVcIj09PVcodCxcImRpc3BsYXlcIixlKSkpe3ZhciBlZT1vLmxlbmd0aD49NixpZT1lZT9vWzBdOjEsc2U9b1sxXXx8MCxyZT1vWzJdfHwwLG5lPWVlP29bM106MTt5Lng9b1s0XXx8MCx5Lnk9b1s1XXx8MCx1PU1hdGguc3FydChpZSppZStzZSpzZSkscD1NYXRoLnNxcnQobmUqbmUrcmUqcmUpLGM9aWV8fHNlP01hdGguYXRhbjIoc2UsaWUpKno6eS5yb3RhdGlvbnx8MCxmPXJlfHxuZT9NYXRoLmF0YW4yKHJlLG5lKSp6K2M6eS5za2V3WHx8MCxtPXUtTWF0aC5hYnMoeS5zY2FsZVh8fDApLGQ9cC1NYXRoLmFicyh5LnNjYWxlWXx8MCksTWF0aC5hYnMoZik+OTAmJjI3MD5NYXRoLmFicyhmKSYmKFQ/KHUqPS0xLGYrPTA+PWM/MTgwOi0xODAsYys9MD49Yz8xODA6LTE4MCk6KHAqPS0xLGYrPTA+PWY/MTgwOi0xODApKSxnPShjLXkucm90YXRpb24pJTE4MCx2PShmLXkuc2tld1gpJTE4MCwodm9pZCAwPT09eS5za2V3WHx8bT53fHwtdz5tfHxkPnd8fC13PmR8fGc+LWImJmI+ZyYmZmFsc2V8Zyp4fHx2Pi1iJiZiPnYmJmZhbHNlfHYqeCkmJih5LnNjYWxlWD11LHkuc2NhbGVZPXAseS5yb3RhdGlvbj1jLHkuc2tld1g9ZikseGUmJih5LnJvdGF0aW9uWD15LnJvdGF0aW9uWT15Lno9MCx5LnBlcnNwZWN0aXZlPWsseS5zY2FsZVo9MSl9eS56T3JpZ2luPVM7Zm9yKGggaW4geSl3PnlbaF0mJnlbaF0+LXcmJih5W2hdPTApfWVsc2UgeT17eDowLHk6MCx6OjAsc2NhbGVYOjEsc2NhbGVZOjEsc2NhbGVaOjEsc2tld1g6MCxza2V3WTowLHBlcnNwZWN0aXZlOmsscm90YXRpb246MCxyb3RhdGlvblg6MCxyb3RhdGlvblk6MCx6T3JpZ2luOjB9O3JldHVybiBpJiYodC5fZ3NUcmFuc2Zvcm09eSkseS5zdmc9UGUmJnQgaW5zdGFuY2VvZiBQZSx5LnN2ZyYma2UodCxXKHQsd2UsciwhMSxcIjUwJSA1MCVcIikrXCJcIix5KSx5LnhQZXJjZW50PXkueVBlcmNlbnQ9MCx5fSxBZT1mdW5jdGlvbih0KXt2YXIgZSxpLHM9dGhpcy5kYXRhLHI9LXMucm90YXRpb24qTSxuPXIrcy5za2V3WCpNLGE9MWU1LG89KDB8TWF0aC5jb3Mocikqcy5zY2FsZVgqYSkvYSxoPSgwfE1hdGguc2luKHIpKnMuc2NhbGVYKmEpL2EsbD0oMHxNYXRoLnNpbihuKSotcy5zY2FsZVkqYSkvYSxfPSgwfE1hdGguY29zKG4pKnMuc2NhbGVZKmEpL2EsdT10aGlzLnQuc3R5bGUscD10aGlzLnQuY3VycmVudFN0eWxlO2lmKHApe2k9aCxoPS1sLGw9LWksZT1wLmZpbHRlcix1LmZpbHRlcj1cIlwiO3ZhciBjLG0sZD10aGlzLnQub2Zmc2V0V2lkdGgsZz10aGlzLnQub2Zmc2V0SGVpZ2h0LHY9XCJhYnNvbHV0ZVwiIT09cC5wb3NpdGlvbix3PVwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChNMTE9XCIrbytcIiwgTTEyPVwiK2grXCIsIE0yMT1cIitsK1wiLCBNMjI9XCIrXyx4PXMueCtkKnMueFBlcmNlbnQvMTAwLGI9cy55K2cqcy55UGVyY2VudC8xMDA7aWYobnVsbCE9cy5veCYmKGM9KHMub3hwPy4wMSpkKnMub3g6cy5veCktZC8yLG09KHMub3lwPy4wMSpnKnMub3k6cy5veSktZy8yLHgrPWMtKGMqbyttKmgpLGIrPW0tKGMqbCttKl8pKSx2PyhjPWQvMixtPWcvMix3Kz1cIiwgRHg9XCIrKGMtKGMqbyttKmgpK3gpK1wiLCBEeT1cIisobS0oYypsK20qXykrYikrXCIpXCIpOncrPVwiLCBzaXppbmdNZXRob2Q9J2F1dG8gZXhwYW5kJylcIix1LmZpbHRlcj0tMSE9PWUuaW5kZXhPZihcIkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChcIik/ZS5yZXBsYWNlKEMsdyk6dytcIiBcIitlLCgwPT09dHx8MT09PXQpJiYxPT09byYmMD09PWgmJjA9PT1sJiYxPT09XyYmKHYmJi0xPT09dy5pbmRleE9mKFwiRHg9MCwgRHk9MFwiKXx8VC50ZXN0KGUpJiYxMDAhPT1wYXJzZUZsb2F0KFJlZ0V4cC4kMSl8fC0xPT09ZS5pbmRleE9mKFwiZ3JhZGllbnQoXCImJmUuaW5kZXhPZihcIkFscGhhXCIpKSYmdS5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIikpLCF2KXt2YXIgUCxTLGssUj04PmY/MTotMTtmb3IoYz1zLmllT2Zmc2V0WHx8MCxtPXMuaWVPZmZzZXRZfHwwLHMuaWVPZmZzZXRYPU1hdGgucm91bmQoKGQtKCgwPm8/LW86bykqZCsoMD5oPy1oOmgpKmcpKS8yK3gpLHMuaWVPZmZzZXRZPU1hdGgucm91bmQoKGctKCgwPl8/LV86XykqZysoMD5sPy1sOmwpKmQpKS8yK2IpLGZlPTA7ND5mZTtmZSsrKVM9SltmZV0sUD1wW1NdLGk9LTEhPT1QLmluZGV4T2YoXCJweFwiKT9wYXJzZUZsb2F0KFApOlEodGhpcy50LFMscGFyc2VGbG9hdChQKSxQLnJlcGxhY2UoeSxcIlwiKSl8fDAsaz1pIT09c1tTXT8yPmZlPy1zLmllT2Zmc2V0WDotcy5pZU9mZnNldFk6Mj5mZT9jLXMuaWVPZmZzZXRYOm0tcy5pZU9mZnNldFksdVtTXT0oc1tTXT1NYXRoLnJvdW5kKGktayooMD09PWZlfHwyPT09ZmU/MTpSKSkpK1wicHhcIn19fSxPZT1OLnNldDNEVHJhbnNmb3JtUmF0aW89ZnVuY3Rpb24odCl7dmFyIGUsaSxzLHIsbixhLG8saCxsLF8sdSxjLGYsbSxkLGcsdix5LFQsdyx4LGIsUCxTPXRoaXMuZGF0YSxrPXRoaXMudC5zdHlsZSxSPVMucm90YXRpb24qTSxBPVMuc2NhbGVYLE89Uy5zY2FsZVksQz1TLnNjYWxlWixEPVMueCx6PVMueSxJPVMueixFPVMucGVyc3BlY3RpdmU7aWYoISgxIT09dCYmMCE9PXR8fFwiYXV0b1wiIT09Uy5mb3JjZTNEfHxTLnJvdGF0aW9uWXx8Uy5yb3RhdGlvblh8fDEhPT1DfHxFfHxJKSlyZXR1cm4gQ2UuY2FsbCh0aGlzLHQpLHZvaWQgMDtpZihwKXt2YXIgRj0xZS00O0Y+QSYmQT4tRiYmKEE9Qz0yZS01KSxGPk8mJk8+LUYmJihPPUM9MmUtNSksIUV8fFMuenx8Uy5yb3RhdGlvblh8fFMucm90YXRpb25ZfHwoRT0wKX1pZihSfHxTLnNrZXdYKXk9TWF0aC5jb3MoUiksVD1NYXRoLnNpbihSKSxlPXksbj1ULFMuc2tld1gmJihSLT1TLnNrZXdYKk0seT1NYXRoLmNvcyhSKSxUPU1hdGguc2luKFIpLFwic2ltcGxlXCI9PT1TLnNrZXdUeXBlJiYodz1NYXRoLnRhbihTLnNrZXdYKk0pLHc9TWF0aC5zcXJ0KDErdyp3KSx5Kj13LFQqPXcpKSxpPS1ULGE9eTtlbHNle2lmKCEoUy5yb3RhdGlvbll8fFMucm90YXRpb25YfHwxIT09Q3x8RXx8Uy5zdmcpKXJldHVybiBrW3llXT0oUy54UGVyY2VudHx8Uy55UGVyY2VudD9cInRyYW5zbGF0ZShcIitTLnhQZXJjZW50K1wiJSxcIitTLnlQZXJjZW50K1wiJSkgdHJhbnNsYXRlM2QoXCI6XCJ0cmFuc2xhdGUzZChcIikrRCtcInB4LFwiK3orXCJweCxcIitJK1wicHgpXCIrKDEhPT1BfHwxIT09Tz9cIiBzY2FsZShcIitBK1wiLFwiK08rXCIpXCI6XCJcIiksdm9pZCAwO2U9YT0xLGk9bj0wfXU9MSxzPXI9bz1oPWw9Xz1jPWY9bT0wLGQ9RT8tMS9FOjAsZz1TLnpPcmlnaW4sdj0xZTUsUj1TLnJvdGF0aW9uWSpNLFImJih5PU1hdGguY29zKFIpLFQ9TWF0aC5zaW4oUiksbD11Ki1ULGY9ZCotVCxzPWUqVCxvPW4qVCx1Kj15LGQqPXksZSo9eSxuKj15KSxSPVMucm90YXRpb25YKk0sUiYmKHk9TWF0aC5jb3MoUiksVD1NYXRoLnNpbihSKSx3PWkqeStzKlQseD1hKnkrbypULGI9Xyp5K3UqVCxQPW0qeStkKlQscz1pKi1UK3MqeSxvPWEqLVQrbyp5LHU9XyotVCt1KnksZD1tKi1UK2QqeSxpPXcsYT14LF89YixtPVApLDEhPT1DJiYocyo9QyxvKj1DLHUqPUMsZCo9QyksMSE9PU8mJihpKj1PLGEqPU8sXyo9TyxtKj1PKSwxIT09QSYmKGUqPUEsbio9QSxsKj1BLGYqPUEpLGcmJihjLT1nLHI9cypjLGg9bypjLGM9dSpjK2cpLFMuc3ZnJiYocis9Uy54T3JpZ2luLShTLnhPcmlnaW4qZStTLnlPcmlnaW4qaSksaCs9Uy55T3JpZ2luLShTLnhPcmlnaW4qbitTLnlPcmlnaW4qYSkpLHI9KHc9KHIrPUQpLShyfD0wKSk/KDB8dyp2KygwPnc/LS41Oi41KSkvdityOnIsaD0odz0oaCs9eiktKGh8PTApKT8oMHx3KnYrKDA+dz8tLjU6LjUpKS92K2g6aCxjPSh3PShjKz1JKS0oY3w9MCkpPygwfHcqdisoMD53Py0uNTouNSkpL3YrYzpjLGtbeWVdPShTLnhQZXJjZW50fHxTLnlQZXJjZW50P1widHJhbnNsYXRlKFwiK1MueFBlcmNlbnQrXCIlLFwiK1MueVBlcmNlbnQrXCIlKSBtYXRyaXgzZChcIjpcIm1hdHJpeDNkKFwiKStbKDB8ZSp2KS92LCgwfG4qdikvdiwoMHxsKnYpL3YsKDB8Zip2KS92LCgwfGkqdikvdiwoMHxhKnYpL3YsKDB8Xyp2KS92LCgwfG0qdikvdiwoMHxzKnYpL3YsKDB8byp2KS92LCgwfHUqdikvdiwoMHxkKnYpL3YscixoLGMsRT8xKy1jL0U6MV0uam9pbihcIixcIikrXCIpXCJ9LENlPU4uc2V0MkRUcmFuc2Zvcm1SYXRpbz1mdW5jdGlvbih0KXt2YXIgZSxpLHMscixuLGEsbyxoLGwsXyx1LHA9dGhpcy5kYXRhLGM9dGhpcy50LGY9Yy5zdHlsZSxtPXAueCxkPXAueTtyZXR1cm4hKHAucm90YXRpb25YfHxwLnJvdGF0aW9uWXx8cC56fHxwLmZvcmNlM0Q9PT0hMHx8XCJhdXRvXCI9PT1wLmZvcmNlM0QmJjEhPT10JiYwIT09dCl8fHAuc3ZnJiZTZXx8IXhlPyhyPXAuc2NhbGVYLG49cC5zY2FsZVkscC5yb3RhdGlvbnx8cC5za2V3WHx8cC5zdmc/KGU9cC5yb3RhdGlvbipNLGk9ZS1wLnNrZXdYKk0scz0xZTUsYT1NYXRoLmNvcyhlKSpyLG89TWF0aC5zaW4oZSkqcixoPU1hdGguc2luKGkpKi1uLGw9TWF0aC5jb3MoaSkqbixwLnN2ZyYmKG0rPXAueE9yaWdpbi0ocC54T3JpZ2luKmErcC55T3JpZ2luKmgpLGQrPXAueU9yaWdpbi0ocC54T3JpZ2luKm8rcC55T3JpZ2luKmwpLHU9MWUtNix1Pm0mJm0+LXUmJihtPTApLHU+ZCYmZD4tdSYmKGQ9MCkpLF89KDB8YSpzKS9zK1wiLFwiKygwfG8qcykvcytcIixcIisoMHxoKnMpL3MrXCIsXCIrKDB8bCpzKS9zK1wiLFwiK20rXCIsXCIrZCtcIilcIixwLnN2ZyYmU2U/Yy5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIixcIm1hdHJpeChcIitfKTpmW3llXT0ocC54UGVyY2VudHx8cC55UGVyY2VudD9cInRyYW5zbGF0ZShcIitwLnhQZXJjZW50K1wiJSxcIitwLnlQZXJjZW50K1wiJSkgbWF0cml4KFwiOlwibWF0cml4KFwiKStfKTpmW3llXT0ocC54UGVyY2VudHx8cC55UGVyY2VudD9cInRyYW5zbGF0ZShcIitwLnhQZXJjZW50K1wiJSxcIitwLnlQZXJjZW50K1wiJSkgbWF0cml4KFwiOlwibWF0cml4KFwiKStyK1wiLDAsMCxcIituK1wiLFwiK20rXCIsXCIrZCtcIilcIix2b2lkIDApOih0aGlzLnNldFJhdGlvPU9lLE9lLmNhbGwodGhpcyx0KSx2b2lkIDApfTtkZShcInRyYW5zZm9ybSxzY2FsZSxzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHJvdGF0aW9uWixza2V3WCxza2V3WSxzaG9ydFJvdGF0aW9uLHNob3J0Um90YXRpb25YLHNob3J0Um90YXRpb25ZLHNob3J0Um90YXRpb25aLHRyYW5zZm9ybU9yaWdpbix0cmFuc2Zvcm1QZXJzcGVjdGl2ZSxkaXJlY3Rpb25hbFJvdGF0aW9uLHBhcnNlVHJhbnNmb3JtLGZvcmNlM0Qsc2tld1R5cGUseFBlcmNlbnQseVBlcmNlbnRcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMsbixvLGgpe2lmKHMuX3RyYW5zZm9ybSlyZXR1cm4gbjt2YXIgbCxfLHUscCxjLGYsbSxkPXMuX3RyYW5zZm9ybT1SZSh0LHIsITAsaC5wYXJzZVRyYW5zZm9ybSksZz10LnN0eWxlLHY9MWUtNix5PXZlLmxlbmd0aCxUPWgsdz17fTtpZihcInN0cmluZ1wiPT10eXBlb2YgVC50cmFuc2Zvcm0mJnllKXU9Ri5zdHlsZSx1W3llXT1ULnRyYW5zZm9ybSx1LmRpc3BsYXk9XCJibG9ja1wiLHUucG9zaXRpb249XCJhYnNvbHV0ZVwiLEUuYm9keS5hcHBlbmRDaGlsZChGKSxsPVJlKEYsbnVsbCwhMSksRS5ib2R5LnJlbW92ZUNoaWxkKEYpO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIFQpe2lmKGw9e3NjYWxlWDpzZShudWxsIT1ULnNjYWxlWD9ULnNjYWxlWDpULnNjYWxlLGQuc2NhbGVYKSxzY2FsZVk6c2UobnVsbCE9VC5zY2FsZVk/VC5zY2FsZVk6VC5zY2FsZSxkLnNjYWxlWSksc2NhbGVaOnNlKFQuc2NhbGVaLGQuc2NhbGVaKSx4OnNlKFQueCxkLngpLHk6c2UoVC55LGQueSksejpzZShULnosZC56KSx4UGVyY2VudDpzZShULnhQZXJjZW50LGQueFBlcmNlbnQpLHlQZXJjZW50OnNlKFQueVBlcmNlbnQsZC55UGVyY2VudCkscGVyc3BlY3RpdmU6c2UoVC50cmFuc2Zvcm1QZXJzcGVjdGl2ZSxkLnBlcnNwZWN0aXZlKX0sbT1ULmRpcmVjdGlvbmFsUm90YXRpb24sbnVsbCE9bSlpZihcIm9iamVjdFwiPT10eXBlb2YgbSlmb3IodSBpbiBtKVRbdV09bVt1XTtlbHNlIFQucm90YXRpb249bTtcInN0cmluZ1wiPT10eXBlb2YgVC54JiYtMSE9PVQueC5pbmRleE9mKFwiJVwiKSYmKGwueD0wLGwueFBlcmNlbnQ9c2UoVC54LGQueFBlcmNlbnQpKSxcInN0cmluZ1wiPT10eXBlb2YgVC55JiYtMSE9PVQueS5pbmRleE9mKFwiJVwiKSYmKGwueT0wLGwueVBlcmNlbnQ9c2UoVC55LGQueVBlcmNlbnQpKSxsLnJvdGF0aW9uPXJlKFwicm90YXRpb25cImluIFQ/VC5yb3RhdGlvbjpcInNob3J0Um90YXRpb25cImluIFQ/VC5zaG9ydFJvdGF0aW9uK1wiX3Nob3J0XCI6XCJyb3RhdGlvblpcImluIFQ/VC5yb3RhdGlvblo6ZC5yb3RhdGlvbixkLnJvdGF0aW9uLFwicm90YXRpb25cIix3KSx4ZSYmKGwucm90YXRpb25YPXJlKFwicm90YXRpb25YXCJpbiBUP1Qucm90YXRpb25YOlwic2hvcnRSb3RhdGlvblhcImluIFQ/VC5zaG9ydFJvdGF0aW9uWCtcIl9zaG9ydFwiOmQucm90YXRpb25YfHwwLGQucm90YXRpb25YLFwicm90YXRpb25YXCIsdyksbC5yb3RhdGlvblk9cmUoXCJyb3RhdGlvbllcImluIFQ/VC5yb3RhdGlvblk6XCJzaG9ydFJvdGF0aW9uWVwiaW4gVD9ULnNob3J0Um90YXRpb25ZK1wiX3Nob3J0XCI6ZC5yb3RhdGlvbll8fDAsZC5yb3RhdGlvblksXCJyb3RhdGlvbllcIix3KSksbC5za2V3WD1udWxsPT1ULnNrZXdYP2Quc2tld1g6cmUoVC5za2V3WCxkLnNrZXdYKSxsLnNrZXdZPW51bGw9PVQuc2tld1k/ZC5za2V3WTpyZShULnNrZXdZLGQuc2tld1kpLChfPWwuc2tld1ktZC5za2V3WSkmJihsLnNrZXdYKz1fLGwucm90YXRpb24rPV8pfWZvcih4ZSYmbnVsbCE9VC5mb3JjZTNEJiYoZC5mb3JjZTNEPVQuZm9yY2UzRCxmPSEwKSxkLnNrZXdUeXBlPVQuc2tld1R5cGV8fGQuc2tld1R5cGV8fGEuZGVmYXVsdFNrZXdUeXBlLGM9ZC5mb3JjZTNEfHxkLnp8fGQucm90YXRpb25YfHxkLnJvdGF0aW9uWXx8bC56fHxsLnJvdGF0aW9uWHx8bC5yb3RhdGlvbll8fGwucGVyc3BlY3RpdmUsY3x8bnVsbD09VC5zY2FsZXx8KGwuc2NhbGVaPTEpOy0teT4tMTspaT12ZVt5XSxwPWxbaV0tZFtpXSwocD52fHwtdj5wfHxudWxsIT1UW2ldfHxudWxsIT1JW2ldKSYmKGY9ITAsbj1uZXcgcGUoZCxpLGRbaV0scCxuKSxpIGluIHcmJihuLmU9d1tpXSksbi54czA9MCxuLnBsdWdpbj1vLHMuX292ZXJ3cml0ZVByb3BzLnB1c2gobi5uKSk7cmV0dXJuIHA9VC50cmFuc2Zvcm1PcmlnaW4scCYmZC5zdmc/KGtlKHQscCxsKSxuPW5ldyBwZShkLFwieE9yaWdpblwiLGQueE9yaWdpbixsLnhPcmlnaW4tZC54T3JpZ2luLG4sLTEsXCJ0cmFuc2Zvcm1PcmlnaW5cIiksbi5iPWQueE9yaWdpbixuLmU9bi54czA9bC54T3JpZ2luLG49bmV3IHBlKGQsXCJ5T3JpZ2luXCIsZC55T3JpZ2luLGwueU9yaWdpbi1kLnlPcmlnaW4sbiwtMSxcInRyYW5zZm9ybU9yaWdpblwiKSxuLmI9ZC55T3JpZ2luLG4uZT1uLnhzMD1sLnlPcmlnaW4sTWUoZyx3ZSkpOihwfHx4ZSYmYyYmZC56T3JpZ2luKSYmKHllPyhmPSEwLGk9d2UscD0ocHx8Vyh0LGksciwhMSxcIjUwJSA1MCVcIikpK1wiXCIsbj1uZXcgcGUoZyxpLDAsMCxuLC0xLFwidHJhbnNmb3JtT3JpZ2luXCIpLG4uYj1nW2ldLG4ucGx1Z2luPW8seGU/KHU9ZC56T3JpZ2luLHA9cC5zcGxpdChcIiBcIiksZC56T3JpZ2luPShwLmxlbmd0aD4yJiYoMD09PXV8fFwiMHB4XCIhPT1wWzJdKT9wYXJzZUZsb2F0KHBbMl0pOnUpfHwwLG4ueHMwPW4uZT1wWzBdK1wiIFwiKyhwWzFdfHxcIjUwJVwiKStcIiAwcHhcIixuPW5ldyBwZShkLFwiek9yaWdpblwiLDAsMCxuLC0xLG4ubiksbi5iPXUsbi54czA9bi5lPWQuek9yaWdpbik6bi54czA9bi5lPXApOmVlKHArXCJcIixkKSksZiYmKHMuX3RyYW5zZm9ybVR5cGU9ZC5zdmcmJlNlfHwhYyYmMyE9PXRoaXMuX3RyYW5zZm9ybVR5cGU/MjozKSxufSxwcmVmaXg6ITB9KSxkZShcImJveFNoYWRvd1wiLHtkZWZhdWx0VmFsdWU6XCIwcHggMHB4IDBweCAwcHggIzk5OVwiLHByZWZpeDohMCxjb2xvcjohMCxtdWx0aTohMCxrZXl3b3JkOlwiaW5zZXRcIn0pLGRlKFwiYm9yZGVyUmFkaXVzXCIse2RlZmF1bHRWYWx1ZTpcIjBweFwiLHBhcnNlcjpmdW5jdGlvbih0LGUsaSxuLGEpe2U9dGhpcy5mb3JtYXQoZSk7dmFyIG8saCxsLF8sdSxwLGMsZixtLGQsZyx2LHksVCx3LHgsYj1bXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIixcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIl0sUD10LnN0eWxlO2ZvcihtPXBhcnNlRmxvYXQodC5vZmZzZXRXaWR0aCksZD1wYXJzZUZsb2F0KHQub2Zmc2V0SGVpZ2h0KSxvPWUuc3BsaXQoXCIgXCIpLGg9MDtiLmxlbmd0aD5oO2grKyl0aGlzLnAuaW5kZXhPZihcImJvcmRlclwiKSYmKGJbaF09VihiW2hdKSksdT1fPVcodCxiW2hdLHIsITEsXCIwcHhcIiksLTEhPT11LmluZGV4T2YoXCIgXCIpJiYoXz11LnNwbGl0KFwiIFwiKSx1PV9bMF0sXz1fWzFdKSxwPWw9b1toXSxjPXBhcnNlRmxvYXQodSksdj11LnN1YnN0cigoYytcIlwiKS5sZW5ndGgpLHk9XCI9XCI9PT1wLmNoYXJBdCgxKSx5PyhmPXBhcnNlSW50KHAuY2hhckF0KDApK1wiMVwiLDEwKSxwPXAuc3Vic3RyKDIpLGYqPXBhcnNlRmxvYXQocCksZz1wLnN1YnN0cigoZitcIlwiKS5sZW5ndGgtKDA+Zj8xOjApKXx8XCJcIik6KGY9cGFyc2VGbG9hdChwKSxnPXAuc3Vic3RyKChmK1wiXCIpLmxlbmd0aCkpLFwiXCI9PT1nJiYoZz1zW2ldfHx2KSxnIT09diYmKFQ9USh0LFwiYm9yZGVyTGVmdFwiLGMsdiksdz1RKHQsXCJib3JkZXJUb3BcIixjLHYpLFwiJVwiPT09Zz8odT0xMDAqKFQvbSkrXCIlXCIsXz0xMDAqKHcvZCkrXCIlXCIpOlwiZW1cIj09PWc/KHg9USh0LFwiYm9yZGVyTGVmdFwiLDEsXCJlbVwiKSx1PVQveCtcImVtXCIsXz13L3grXCJlbVwiKToodT1UK1wicHhcIixfPXcrXCJweFwiKSx5JiYocD1wYXJzZUZsb2F0KHUpK2YrZyxsPXBhcnNlRmxvYXQoXykrZitnKSksYT1jZShQLGJbaF0sdStcIiBcIitfLHArXCIgXCIrbCwhMSxcIjBweFwiLGEpO3JldHVybiBhfSxwcmVmaXg6ITAsZm9ybWF0dGVyOmxlKFwiMHB4IDBweCAwcHggMHB4XCIsITEsITApfSksZGUoXCJiYWNrZ3JvdW5kUG9zaXRpb25cIix7ZGVmYXVsdFZhbHVlOlwiMCAwXCIscGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMsbixhKXt2YXIgbyxoLGwsXyx1LHAsYz1cImJhY2tncm91bmQtcG9zaXRpb25cIixtPXJ8fEcodCxudWxsKSxkPXRoaXMuZm9ybWF0KChtP2Y/bS5nZXRQcm9wZXJ0eVZhbHVlKGMrXCIteFwiKStcIiBcIittLmdldFByb3BlcnR5VmFsdWUoYytcIi15XCIpOm0uZ2V0UHJvcGVydHlWYWx1ZShjKTp0LmN1cnJlbnRTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25YK1wiIFwiK3QuY3VycmVudFN0eWxlLmJhY2tncm91bmRQb3NpdGlvblkpfHxcIjAgMFwiKSxnPXRoaXMuZm9ybWF0KGUpO2lmKC0xIT09ZC5pbmRleE9mKFwiJVwiKSE9KC0xIT09Zy5pbmRleE9mKFwiJVwiKSkmJihwPVcodCxcImJhY2tncm91bmRJbWFnZVwiKS5yZXBsYWNlKGssXCJcIikscCYmXCJub25lXCIhPT1wKSl7Zm9yKG89ZC5zcGxpdChcIiBcIiksaD1nLnNwbGl0KFwiIFwiKSxMLnNldEF0dHJpYnV0ZShcInNyY1wiLHApLGw9MjstLWw+LTE7KWQ9b1tsXSxfPS0xIT09ZC5pbmRleE9mKFwiJVwiKSxfIT09KC0xIT09aFtsXS5pbmRleE9mKFwiJVwiKSkmJih1PTA9PT1sP3Qub2Zmc2V0V2lkdGgtTC53aWR0aDp0Lm9mZnNldEhlaWdodC1MLmhlaWdodCxvW2xdPV8/cGFyc2VGbG9hdChkKS8xMDAqdStcInB4XCI6MTAwKihwYXJzZUZsb2F0KGQpL3UpK1wiJVwiKTtkPW8uam9pbihcIiBcIil9cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsZCxnLG4sYSl9LGZvcm1hdHRlcjplZX0pLGRlKFwiYmFja2dyb3VuZFNpemVcIix7ZGVmYXVsdFZhbHVlOlwiMCAwXCIsZm9ybWF0dGVyOmVlfSksZGUoXCJwZXJzcGVjdGl2ZVwiLHtkZWZhdWx0VmFsdWU6XCIwcHhcIixwcmVmaXg6ITB9KSxkZShcInBlcnNwZWN0aXZlT3JpZ2luXCIse2RlZmF1bHRWYWx1ZTpcIjUwJSA1MCVcIixwcmVmaXg6ITB9KSxkZShcInRyYW5zZm9ybVN0eWxlXCIse3ByZWZpeDohMH0pLGRlKFwiYmFja2ZhY2VWaXNpYmlsaXR5XCIse3ByZWZpeDohMH0pLGRlKFwidXNlclNlbGVjdFwiLHtwcmVmaXg6ITB9KSxkZShcIm1hcmdpblwiLHtwYXJzZXI6X2UoXCJtYXJnaW5Ub3AsbWFyZ2luUmlnaHQsbWFyZ2luQm90dG9tLG1hcmdpbkxlZnRcIil9KSxkZShcInBhZGRpbmdcIix7cGFyc2VyOl9lKFwicGFkZGluZ1RvcCxwYWRkaW5nUmlnaHQscGFkZGluZ0JvdHRvbSxwYWRkaW5nTGVmdFwiKX0pLGRlKFwiY2xpcFwiLHtkZWZhdWx0VmFsdWU6XCJyZWN0KDBweCwwcHgsMHB4LDBweClcIixwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxuLGEpe3ZhciBvLGgsbDtyZXR1cm4gOT5mPyhoPXQuY3VycmVudFN0eWxlLGw9OD5mP1wiIFwiOlwiLFwiLG89XCJyZWN0KFwiK2guY2xpcFRvcCtsK2guY2xpcFJpZ2h0K2wraC5jbGlwQm90dG9tK2wraC5jbGlwTGVmdCtcIilcIixlPXRoaXMuZm9ybWF0KGUpLnNwbGl0KFwiLFwiKS5qb2luKGwpKToobz10aGlzLmZvcm1hdChXKHQsdGhpcy5wLHIsITEsdGhpcy5kZmx0KSksZT10aGlzLmZvcm1hdChlKSksdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSxvLGUsbixhKX19KSxkZShcInRleHRTaGFkb3dcIix7ZGVmYXVsdFZhbHVlOlwiMHB4IDBweCAwcHggIzk5OVwiLGNvbG9yOiEwLG11bHRpOiEwfSksZGUoXCJhdXRvUm91bmQsc3RyaWN0VW5pdHNcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMscil7cmV0dXJuIHJ9fSksZGUoXCJib3JkZXJcIix7ZGVmYXVsdFZhbHVlOlwiMHB4IHNvbGlkICMwMDBcIixwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxuLGEpe3JldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLHRoaXMuZm9ybWF0KFcodCxcImJvcmRlclRvcFdpZHRoXCIsciwhMSxcIjBweFwiKStcIiBcIitXKHQsXCJib3JkZXJUb3BTdHlsZVwiLHIsITEsXCJzb2xpZFwiKStcIiBcIitXKHQsXCJib3JkZXJUb3BDb2xvclwiLHIsITEsXCIjMDAwXCIpKSx0aGlzLmZvcm1hdChlKSxuLGEpfSxjb2xvcjohMCxmb3JtYXR0ZXI6ZnVuY3Rpb24odCl7dmFyIGU9dC5zcGxpdChcIiBcIik7cmV0dXJuIGVbMF0rXCIgXCIrKGVbMV18fFwic29saWRcIikrXCIgXCIrKHQubWF0Y2goaGUpfHxbXCIjMDAwXCJdKVswXX19KSxkZShcImJvcmRlcldpZHRoXCIse3BhcnNlcjpfZShcImJvcmRlclRvcFdpZHRoLGJvcmRlclJpZ2h0V2lkdGgsYm9yZGVyQm90dG9tV2lkdGgsYm9yZGVyTGVmdFdpZHRoXCIpfSksZGUoXCJmbG9hdCxjc3NGbG9hdCxzdHlsZUZsb2F0XCIse3BhcnNlcjpmdW5jdGlvbih0LGUsaSxzLHIpe3ZhciBuPXQuc3R5bGUsYT1cImNzc0Zsb2F0XCJpbiBuP1wiY3NzRmxvYXRcIjpcInN0eWxlRmxvYXRcIjtyZXR1cm4gbmV3IHBlKG4sYSwwLDAsciwtMSxpLCExLDAsblthXSxlKX19KTt2YXIgRGU9ZnVuY3Rpb24odCl7dmFyIGUsaT10aGlzLnQscz1pLmZpbHRlcnx8Vyh0aGlzLmRhdGEsXCJmaWx0ZXJcIil8fFwiXCIscj0wfHRoaXMucyt0aGlzLmMqdDsxMDA9PT1yJiYoLTE9PT1zLmluZGV4T2YoXCJhdHJpeChcIikmJi0xPT09cy5pbmRleE9mKFwicmFkaWVudChcIikmJi0xPT09cy5pbmRleE9mKFwib2FkZXIoXCIpPyhpLnJlbW92ZUF0dHJpYnV0ZShcImZpbHRlclwiKSxlPSFXKHRoaXMuZGF0YSxcImZpbHRlclwiKSk6KGkuZmlsdGVyPXMucmVwbGFjZSh4LFwiXCIpLGU9ITApKSxlfHwodGhpcy54bjEmJihpLmZpbHRlcj1zPXN8fFwiYWxwaGEob3BhY2l0eT1cIityK1wiKVwiKSwtMT09PXMuaW5kZXhPZihcInBhY2l0eVwiKT8wPT09ciYmdGhpcy54bjF8fChpLmZpbHRlcj1zK1wiIGFscGhhKG9wYWNpdHk9XCIrcitcIilcIik6aS5maWx0ZXI9cy5yZXBsYWNlKFQsXCJvcGFjaXR5PVwiK3IpKX07ZGUoXCJvcGFjaXR5LGFscGhhLGF1dG9BbHBoYVwiLHtkZWZhdWx0VmFsdWU6XCIxXCIscGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMsbixhKXt2YXIgbz1wYXJzZUZsb2F0KFcodCxcIm9wYWNpdHlcIixyLCExLFwiMVwiKSksaD10LnN0eWxlLGw9XCJhdXRvQWxwaGFcIj09PWk7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGUmJlwiPVwiPT09ZS5jaGFyQXQoMSkmJihlPShcIi1cIj09PWUuY2hhckF0KDApPy0xOjEpKnBhcnNlRmxvYXQoZS5zdWJzdHIoMikpK28pLGwmJjE9PT1vJiZcImhpZGRlblwiPT09Vyh0LFwidmlzaWJpbGl0eVwiLHIpJiYwIT09ZSYmKG89MCksVT9uPW5ldyBwZShoLFwib3BhY2l0eVwiLG8sZS1vLG4pOihuPW5ldyBwZShoLFwib3BhY2l0eVwiLDEwMCpvLDEwMCooZS1vKSxuKSxuLnhuMT1sPzE6MCxoLnpvb209MSxuLnR5cGU9MixuLmI9XCJhbHBoYShvcGFjaXR5PVwiK24ucytcIilcIixuLmU9XCJhbHBoYShvcGFjaXR5PVwiKyhuLnMrbi5jKStcIilcIixuLmRhdGE9dCxuLnBsdWdpbj1hLG4uc2V0UmF0aW89RGUpLGwmJihuPW5ldyBwZShoLFwidmlzaWJpbGl0eVwiLDAsMCxuLC0xLG51bGwsITEsMCwwIT09bz9cImluaGVyaXRcIjpcImhpZGRlblwiLDA9PT1lP1wiaGlkZGVuXCI6XCJpbmhlcml0XCIpLG4ueHMwPVwiaW5oZXJpdFwiLHMuX292ZXJ3cml0ZVByb3BzLnB1c2gobi5uKSxzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKGkpKSxufX0pO3ZhciBNZT1mdW5jdGlvbih0LGUpe2UmJih0LnJlbW92ZVByb3BlcnR5PyhcIm1zXCI9PT1lLnN1YnN0cigwLDIpJiYoZT1cIk1cIitlLnN1YnN0cigxKSksdC5yZW1vdmVQcm9wZXJ0eShlLnJlcGxhY2UoUCxcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKSk6dC5yZW1vdmVBdHRyaWJ1dGUoZSkpfSx6ZT1mdW5jdGlvbih0KXtpZih0aGlzLnQuX2dzQ2xhc3NQVD10aGlzLDE9PT10fHwwPT09dCl7dGhpcy50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsMD09PXQ/dGhpcy5iOnRoaXMuZSk7Zm9yKHZhciBlPXRoaXMuZGF0YSxpPXRoaXMudC5zdHlsZTtlOyllLnY/aVtlLnBdPWUudjpNZShpLGUucCksZT1lLl9uZXh0OzE9PT10JiZ0aGlzLnQuX2dzQ2xhc3NQVD09PXRoaXMmJih0aGlzLnQuX2dzQ2xhc3NQVD1udWxsKX1lbHNlIHRoaXMudC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSE9PXRoaXMuZSYmdGhpcy50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsdGhpcy5lKX07ZGUoXCJjbGFzc05hbWVcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxzLG4sYSxvLGgpe3ZhciBsLF8sdSxwLGMsZj10LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiLG09dC5zdHlsZS5jc3NUZXh0O2lmKGE9bi5fY2xhc3NOYW1lUFQ9bmV3IHBlKHQscywwLDAsYSwyKSxhLnNldFJhdGlvPXplLGEucHI9LTExLGk9ITAsYS5iPWYsXz0kKHQsciksdT10Ll9nc0NsYXNzUFQpe2ZvcihwPXt9LGM9dS5kYXRhO2M7KXBbYy5wXT0xLGM9Yy5fbmV4dDt1LnNldFJhdGlvKDEpfXJldHVybiB0Ll9nc0NsYXNzUFQ9YSxhLmU9XCI9XCIhPT1lLmNoYXJBdCgxKT9lOmYucmVwbGFjZShSZWdFeHAoXCJcXFxccypcXFxcYlwiK2Uuc3Vic3RyKDIpK1wiXFxcXGJcIiksXCJcIikrKFwiK1wiPT09ZS5jaGFyQXQoMCk/XCIgXCIrZS5zdWJzdHIoMik6XCJcIiksbi5fdHdlZW4uX2R1cmF0aW9uJiYodC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGEuZSksbD1IKHQsXywkKHQpLGgscCksdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGYpLGEuZGF0YT1sLmZpcnN0TVBULHQuc3R5bGUuY3NzVGV4dD1tLGE9YS54Zmlyc3Q9bi5wYXJzZSh0LGwuZGlmcyxhLG8pKSxhfX0pO3ZhciBJZT1mdW5jdGlvbih0KXtpZigoMT09PXR8fDA9PT10KSYmdGhpcy5kYXRhLl90b3RhbFRpbWU9PT10aGlzLmRhdGEuX3RvdGFsRHVyYXRpb24mJlwiaXNGcm9tU3RhcnRcIiE9PXRoaXMuZGF0YS5kYXRhKXt2YXIgZSxpLHMscixuPXRoaXMudC5zdHlsZSxhPW8udHJhbnNmb3JtLnBhcnNlO2lmKFwiYWxsXCI9PT10aGlzLmUpbi5jc3NUZXh0PVwiXCIscj0hMDtlbHNlIGZvcihlPXRoaXMuZS5zcGxpdChcIiBcIikuam9pbihcIlwiKS5zcGxpdChcIixcIikscz1lLmxlbmd0aDstLXM+LTE7KWk9ZVtzXSxvW2ldJiYob1tpXS5wYXJzZT09PWE/cj0hMDppPVwidHJhbnNmb3JtT3JpZ2luXCI9PT1pP3dlOm9baV0ucCksTWUobixpKTtyJiYoTWUobix5ZSksdGhpcy50Ll9nc1RyYW5zZm9ybSYmZGVsZXRlIHRoaXMudC5fZ3NUcmFuc2Zvcm0pfX07Zm9yKGRlKFwiY2xlYXJQcm9wc1wiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLHMscixuKXtyZXR1cm4gbj1uZXcgcGUodCxzLDAsMCxuLDIpLG4uc2V0UmF0aW89SWUsbi5lPWUsbi5wcj0tMTAsbi5kYXRhPXIuX3R3ZWVuLGk9ITAsbn19KSxoPVwiYmV6aWVyLHRocm93UHJvcHMscGh5c2ljc1Byb3BzLHBoeXNpY3MyRFwiLnNwbGl0KFwiLFwiKSxmZT1oLmxlbmd0aDtmZS0tOylnZShoW2ZlXSk7aD1hLnByb3RvdHlwZSxoLl9maXJzdFBUPW51bGwsaC5fb25Jbml0VHdlZW49ZnVuY3Rpb24odCxlLG8pe2lmKCF0Lm5vZGVUeXBlKXJldHVybiExO3RoaXMuX3RhcmdldD10LHRoaXMuX3R3ZWVuPW8sdGhpcy5fdmFycz1lLGw9ZS5hdXRvUm91bmQsaT0hMSxzPWUuc3VmZml4TWFwfHxhLnN1ZmZpeE1hcCxyPUcodCxcIlwiKSxuPXRoaXMuX292ZXJ3cml0ZVByb3BzO3ZhciBoLHAsZixtLGQsZyx2LHksVCx4PXQuc3R5bGU7aWYoXyYmXCJcIj09PXguekluZGV4JiYoaD1XKHQsXCJ6SW5kZXhcIixyKSwoXCJhdXRvXCI9PT1ofHxcIlwiPT09aCkmJnRoaXMuX2FkZExhenlTZXQoeCxcInpJbmRleFwiLDApKSxcInN0cmluZ1wiPT10eXBlb2YgZSYmKG09eC5jc3NUZXh0LGg9JCh0LHIpLHguY3NzVGV4dD1tK1wiO1wiK2UsaD1IKHQsaCwkKHQpKS5kaWZzLCFVJiZ3LnRlc3QoZSkmJihoLm9wYWNpdHk9cGFyc2VGbG9hdChSZWdFeHAuJDEpKSxlPWgseC5jc3NUZXh0PW0pLHRoaXMuX2ZpcnN0UFQ9cD10aGlzLnBhcnNlKHQsZSxudWxsKSx0aGlzLl90cmFuc2Zvcm1UeXBlKXtmb3IoVD0zPT09dGhpcy5fdHJhbnNmb3JtVHlwZSx5ZT91JiYoXz0hMCxcIlwiPT09eC56SW5kZXgmJih2PVcodCxcInpJbmRleFwiLHIpLChcImF1dG9cIj09PXZ8fFwiXCI9PT12KSYmdGhpcy5fYWRkTGF6eVNldCh4LFwiekluZGV4XCIsMCkpLGMmJnRoaXMuX2FkZExhenlTZXQoeCxcIldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eVwiLHRoaXMuX3ZhcnMuV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5fHwoVD9cInZpc2libGVcIjpcImhpZGRlblwiKSkpOnguem9vbT0xLGY9cDtmJiZmLl9uZXh0OylmPWYuX25leHQ7eT1uZXcgcGUodCxcInRyYW5zZm9ybVwiLDAsMCxudWxsLDIpLHRoaXMuX2xpbmtDU1NQKHksbnVsbCxmKSx5LnNldFJhdGlvPVQmJnhlP09lOnllP0NlOkFlLHkuZGF0YT10aGlzLl90cmFuc2Zvcm18fFJlKHQsciwhMCksbi5wb3AoKVxufWlmKGkpe2Zvcig7cDspe2ZvcihnPXAuX25leHQsZj1tO2YmJmYucHI+cC5wcjspZj1mLl9uZXh0OyhwLl9wcmV2PWY/Zi5fcHJldjpkKT9wLl9wcmV2Ll9uZXh0PXA6bT1wLChwLl9uZXh0PWYpP2YuX3ByZXY9cDpkPXAscD1nfXRoaXMuX2ZpcnN0UFQ9bX1yZXR1cm4hMH0saC5wYXJzZT1mdW5jdGlvbih0LGUsaSxuKXt2YXIgYSxoLF8sdSxwLGMsZixtLGQsZyx2PXQuc3R5bGU7Zm9yKGEgaW4gZSljPWVbYV0saD1vW2FdLGg/aT1oLnBhcnNlKHQsYyxhLHRoaXMsaSxuLGUpOihwPVcodCxhLHIpK1wiXCIsZD1cInN0cmluZ1wiPT10eXBlb2YgYyxcImNvbG9yXCI9PT1hfHxcImZpbGxcIj09PWF8fFwic3Ryb2tlXCI9PT1hfHwtMSE9PWEuaW5kZXhPZihcIkNvbG9yXCIpfHxkJiZiLnRlc3QoYyk/KGR8fChjPW9lKGMpLGM9KGMubGVuZ3RoPjM/XCJyZ2JhKFwiOlwicmdiKFwiKStjLmpvaW4oXCIsXCIpK1wiKVwiKSxpPWNlKHYsYSxwLGMsITAsXCJ0cmFuc3BhcmVudFwiLGksMCxuKSk6IWR8fC0xPT09Yy5pbmRleE9mKFwiIFwiKSYmLTE9PT1jLmluZGV4T2YoXCIsXCIpPyhfPXBhcnNlRmxvYXQocCksZj1ffHwwPT09Xz9wLnN1YnN0cigoXytcIlwiKS5sZW5ndGgpOlwiXCIsKFwiXCI9PT1wfHxcImF1dG9cIj09PXApJiYoXCJ3aWR0aFwiPT09YXx8XCJoZWlnaHRcIj09PWE/KF89dGUodCxhLHIpLGY9XCJweFwiKTpcImxlZnRcIj09PWF8fFwidG9wXCI9PT1hPyhfPVoodCxhLHIpLGY9XCJweFwiKTooXz1cIm9wYWNpdHlcIiE9PWE/MDoxLGY9XCJcIikpLGc9ZCYmXCI9XCI9PT1jLmNoYXJBdCgxKSxnPyh1PXBhcnNlSW50KGMuY2hhckF0KDApK1wiMVwiLDEwKSxjPWMuc3Vic3RyKDIpLHUqPXBhcnNlRmxvYXQoYyksbT1jLnJlcGxhY2UoeSxcIlwiKSk6KHU9cGFyc2VGbG9hdChjKSxtPWQ/Yy5zdWJzdHIoKHUrXCJcIikubGVuZ3RoKXx8XCJcIjpcIlwiKSxcIlwiPT09bSYmKG09YSBpbiBzP3NbYV06ZiksYz11fHwwPT09dT8oZz91K186dSkrbTplW2FdLGYhPT1tJiZcIlwiIT09bSYmKHV8fDA9PT11KSYmXyYmKF89USh0LGEsXyxmKSxcIiVcIj09PW0/KF8vPVEodCxhLDEwMCxcIiVcIikvMTAwLGUuc3RyaWN0VW5pdHMhPT0hMCYmKHA9XytcIiVcIikpOlwiZW1cIj09PW0/Xy89USh0LGEsMSxcImVtXCIpOlwicHhcIiE9PW0mJih1PVEodCxhLHUsbSksbT1cInB4XCIpLGcmJih1fHwwPT09dSkmJihjPXUrXyttKSksZyYmKHUrPV8pLCFfJiYwIT09X3x8IXUmJjAhPT11P3ZvaWQgMCE9PXZbYV0mJihjfHxcIk5hTlwiIT1jK1wiXCImJm51bGwhPWMpPyhpPW5ldyBwZSh2LGEsdXx8X3x8MCwwLGksLTEsYSwhMSwwLHAsYyksaS54czA9XCJub25lXCIhPT1jfHxcImRpc3BsYXlcIiE9PWEmJi0xPT09YS5pbmRleE9mKFwiU3R5bGVcIik/YzpwKTpqKFwiaW52YWxpZCBcIithK1wiIHR3ZWVuIHZhbHVlOiBcIitlW2FdKTooaT1uZXcgcGUodixhLF8sdS1fLGksMCxhLGwhPT0hMSYmKFwicHhcIj09PW18fFwiekluZGV4XCI9PT1hKSwwLHAsYyksaS54czA9bSkpOmk9Y2UodixhLHAsYywhMCxudWxsLGksMCxuKSksbiYmaSYmIWkucGx1Z2luJiYoaS5wbHVnaW49bik7cmV0dXJuIGl9LGguc2V0UmF0aW89ZnVuY3Rpb24odCl7dmFyIGUsaSxzLHI9dGhpcy5fZmlyc3RQVCxuPTFlLTY7aWYoMSE9PXR8fHRoaXMuX3R3ZWVuLl90aW1lIT09dGhpcy5fdHdlZW4uX2R1cmF0aW9uJiYwIT09dGhpcy5fdHdlZW4uX3RpbWUpaWYodHx8dGhpcy5fdHdlZW4uX3RpbWUhPT10aGlzLl90d2Vlbi5fZHVyYXRpb24mJjAhPT10aGlzLl90d2Vlbi5fdGltZXx8dGhpcy5fdHdlZW4uX3Jhd1ByZXZUaW1lPT09LTFlLTYpZm9yKDtyOyl7aWYoZT1yLmMqdCtyLnMsci5yP2U9TWF0aC5yb3VuZChlKTpuPmUmJmU+LW4mJihlPTApLHIudHlwZSlpZigxPT09ci50eXBlKWlmKHM9ci5sLDI9PT1zKXIudFtyLnBdPXIueHMwK2Urci54czErci54bjErci54czI7ZWxzZSBpZigzPT09cylyLnRbci5wXT1yLnhzMCtlK3IueHMxK3IueG4xK3IueHMyK3IueG4yK3IueHMzO2Vsc2UgaWYoND09PXMpci50W3IucF09ci54czArZStyLnhzMStyLnhuMStyLnhzMityLnhuMityLnhzMytyLnhuMytyLnhzNDtlbHNlIGlmKDU9PT1zKXIudFtyLnBdPXIueHMwK2Urci54czErci54bjErci54czIrci54bjIrci54czMrci54bjMrci54czQrci54bjQrci54czU7ZWxzZXtmb3IoaT1yLnhzMCtlK3IueHMxLHM9MTtyLmw+cztzKyspaSs9cltcInhuXCIrc10rcltcInhzXCIrKHMrMSldO3IudFtyLnBdPWl9ZWxzZS0xPT09ci50eXBlP3IudFtyLnBdPXIueHMwOnIuc2V0UmF0aW8mJnIuc2V0UmF0aW8odCk7ZWxzZSByLnRbci5wXT1lK3IueHMwO3I9ci5fbmV4dH1lbHNlIGZvcig7cjspMiE9PXIudHlwZT9yLnRbci5wXT1yLmI6ci5zZXRSYXRpbyh0KSxyPXIuX25leHQ7ZWxzZSBmb3IoO3I7KTIhPT1yLnR5cGU/ci50W3IucF09ci5lOnIuc2V0UmF0aW8odCkscj1yLl9uZXh0fSxoLl9lbmFibGVUcmFuc2Zvcm1zPWZ1bmN0aW9uKHQpe3RoaXMuX3RyYW5zZm9ybT10aGlzLl90cmFuc2Zvcm18fFJlKHRoaXMuX3RhcmdldCxyLCEwKSx0aGlzLl90cmFuc2Zvcm1UeXBlPXRoaXMuX3RyYW5zZm9ybS5zdmcmJlNlfHwhdCYmMyE9PXRoaXMuX3RyYW5zZm9ybVR5cGU/MjozfTt2YXIgRWU9ZnVuY3Rpb24oKXt0aGlzLnRbdGhpcy5wXT10aGlzLmUsdGhpcy5kYXRhLl9saW5rQ1NTUCh0aGlzLHRoaXMuX25leHQsbnVsbCwhMCl9O2guX2FkZExhenlTZXQ9ZnVuY3Rpb24odCxlLGkpe3ZhciBzPXRoaXMuX2ZpcnN0UFQ9bmV3IHBlKHQsZSwwLDAsdGhpcy5fZmlyc3RQVCwyKTtzLmU9aSxzLnNldFJhdGlvPUVlLHMuZGF0YT10aGlzfSxoLl9saW5rQ1NTUD1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gdCYmKGUmJihlLl9wcmV2PXQpLHQuX25leHQmJih0Ll9uZXh0Ll9wcmV2PXQuX3ByZXYpLHQuX3ByZXY/dC5fcHJldi5fbmV4dD10Ll9uZXh0OnRoaXMuX2ZpcnN0UFQ9PT10JiYodGhpcy5fZmlyc3RQVD10Ll9uZXh0LHM9ITApLGk/aS5fbmV4dD10OnN8fG51bGwhPT10aGlzLl9maXJzdFBUfHwodGhpcy5fZmlyc3RQVD10KSx0Ll9uZXh0PWUsdC5fcHJldj1pKSx0fSxoLl9raWxsPWZ1bmN0aW9uKGUpe3ZhciBpLHMscixuPWU7aWYoZS5hdXRvQWxwaGF8fGUuYWxwaGEpe249e307Zm9yKHMgaW4gZSluW3NdPWVbc107bi5vcGFjaXR5PTEsbi5hdXRvQWxwaGEmJihuLnZpc2liaWxpdHk9MSl9cmV0dXJuIGUuY2xhc3NOYW1lJiYoaT10aGlzLl9jbGFzc05hbWVQVCkmJihyPWkueGZpcnN0LHImJnIuX3ByZXY/dGhpcy5fbGlua0NTU1Aoci5fcHJldixpLl9uZXh0LHIuX3ByZXYuX3ByZXYpOnI9PT10aGlzLl9maXJzdFBUJiYodGhpcy5fZmlyc3RQVD1pLl9uZXh0KSxpLl9uZXh0JiZ0aGlzLl9saW5rQ1NTUChpLl9uZXh0LGkuX25leHQuX25leHQsci5fcHJldiksdGhpcy5fY2xhc3NOYW1lUFQ9bnVsbCksdC5wcm90b3R5cGUuX2tpbGwuY2FsbCh0aGlzLG4pfTt2YXIgRmU9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLHIsbixhO2lmKHQuc2xpY2UpZm9yKHI9dC5sZW5ndGg7LS1yPi0xOylGZSh0W3JdLGUsaSk7ZWxzZSBmb3Iocz10LmNoaWxkTm9kZXMscj1zLmxlbmd0aDstLXI+LTE7KW49c1tyXSxhPW4udHlwZSxuLnN0eWxlJiYoZS5wdXNoKCQobikpLGkmJmkucHVzaChuKSksMSE9PWEmJjkhPT1hJiYxMSE9PWF8fCFuLmNoaWxkTm9kZXMubGVuZ3RofHxGZShuLGUsaSl9O3JldHVybiBhLmNhc2NhZGVUbz1mdW5jdGlvbih0LGkscyl7dmFyIHIsbixhLG89ZS50byh0LGkscyksaD1bb10sbD1bXSxfPVtdLHU9W10scD1lLl9pbnRlcm5hbHMucmVzZXJ2ZWRQcm9wcztmb3IodD1vLl90YXJnZXRzfHxvLnRhcmdldCxGZSh0LGwsdSksby5yZW5kZXIoaSwhMCksRmUodCxfKSxvLnJlbmRlcigwLCEwKSxvLl9lbmFibGVkKCEwKSxyPXUubGVuZ3RoOy0tcj4tMTspaWYobj1IKHVbcl0sbFtyXSxfW3JdKSxuLmZpcnN0TVBUKXtuPW4uZGlmcztmb3IoYSBpbiBzKXBbYV0mJihuW2FdPXNbYV0pO2gucHVzaChlLnRvKHVbcl0saSxuKSl9cmV0dXJuIGh9LHQuYWN0aXZhdGUoW2FdKSxhfSwhMCksZnVuY3Rpb24oKXt2YXIgdD1fZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtwcm9wTmFtZTpcInJvdW5kUHJvcHNcIixwcmlvcml0eTotMSxBUEk6Mixpbml0OmZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gdGhpcy5fdHdlZW49aSwhMH19KSxlPXQucHJvdG90eXBlO2UuX29uSW5pdEFsbFByb3BzPWZ1bmN0aW9uKCl7Zm9yKHZhciB0LGUsaSxzPXRoaXMuX3R3ZWVuLHI9cy52YXJzLnJvdW5kUHJvcHMgaW5zdGFuY2VvZiBBcnJheT9zLnZhcnMucm91bmRQcm9wczpzLnZhcnMucm91bmRQcm9wcy5zcGxpdChcIixcIiksbj1yLmxlbmd0aCxhPXt9LG89cy5fcHJvcExvb2t1cC5yb3VuZFByb3BzOy0tbj4tMTspYVtyW25dXT0xO2ZvcihuPXIubGVuZ3RoOy0tbj4tMTspZm9yKHQ9cltuXSxlPXMuX2ZpcnN0UFQ7ZTspaT1lLl9uZXh0LGUucGc/ZS50Ll9yb3VuZFByb3BzKGEsITApOmUubj09PXQmJih0aGlzLl9hZGQoZS50LHQsZS5zLGUuYyksaSYmKGkuX3ByZXY9ZS5fcHJldiksZS5fcHJldj9lLl9wcmV2Ll9uZXh0PWk6cy5fZmlyc3RQVD09PWUmJihzLl9maXJzdFBUPWkpLGUuX25leHQ9ZS5fcHJldj1udWxsLHMuX3Byb3BMb29rdXBbdF09byksZT1pO3JldHVybiExfSxlLl9hZGQ9ZnVuY3Rpb24odCxlLGkscyl7dGhpcy5fYWRkVHdlZW4odCxlLGksaStzLGUsITApLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goZSl9fSgpLF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe3Byb3BOYW1lOlwiYXR0clwiLEFQSToyLHZlcnNpb246XCIwLjMuM1wiLGluaXQ6ZnVuY3Rpb24odCxlKXt2YXIgaSxzLHI7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdC5zZXRBdHRyaWJ1dGUpcmV0dXJuITE7dGhpcy5fdGFyZ2V0PXQsdGhpcy5fcHJveHk9e30sdGhpcy5fc3RhcnQ9e30sdGhpcy5fZW5kPXt9O2ZvcihpIGluIGUpdGhpcy5fc3RhcnRbaV09dGhpcy5fcHJveHlbaV09cz10LmdldEF0dHJpYnV0ZShpKSxyPXRoaXMuX2FkZFR3ZWVuKHRoaXMuX3Byb3h5LGkscGFyc2VGbG9hdChzKSxlW2ldLGkpLHRoaXMuX2VuZFtpXT1yP3IucytyLmM6ZVtpXSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKGkpO3JldHVybiEwfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fc3VwZXIuc2V0UmF0aW8uY2FsbCh0aGlzLHQpO2Zvcih2YXIgZSxpPXRoaXMuX292ZXJ3cml0ZVByb3BzLHM9aS5sZW5ndGgscj0xPT09dD90aGlzLl9lbmQ6dD90aGlzLl9wcm94eTp0aGlzLl9zdGFydDstLXM+LTE7KWU9aVtzXSx0aGlzLl90YXJnZXQuc2V0QXR0cmlidXRlKGUscltlXStcIlwiKX19KSxfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtwcm9wTmFtZTpcImRpcmVjdGlvbmFsUm90YXRpb25cIix2ZXJzaW9uOlwiMC4yLjFcIixBUEk6Mixpbml0OmZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIiE9dHlwZW9mIGUmJihlPXtyb3RhdGlvbjplfSksdGhpcy5maW5hbHM9e307dmFyIGkscyxyLG4sYSxvLGg9ZS51c2VSYWRpYW5zPT09ITA/MipNYXRoLlBJOjM2MCxsPTFlLTY7Zm9yKGkgaW4gZSlcInVzZVJhZGlhbnNcIiE9PWkmJihvPShlW2ldK1wiXCIpLnNwbGl0KFwiX1wiKSxzPW9bMF0scj1wYXJzZUZsb2F0KFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRbaV0/dFtpXTp0W2kuaW5kZXhPZihcInNldFwiKXx8XCJmdW5jdGlvblwiIT10eXBlb2YgdFtcImdldFwiK2kuc3Vic3RyKDMpXT9pOlwiZ2V0XCIraS5zdWJzdHIoMyldKCkpLG49dGhpcy5maW5hbHNbaV09XCJzdHJpbmdcIj09dHlwZW9mIHMmJlwiPVwiPT09cy5jaGFyQXQoMSk/citwYXJzZUludChzLmNoYXJBdCgwKStcIjFcIiwxMCkqTnVtYmVyKHMuc3Vic3RyKDIpKTpOdW1iZXIocyl8fDAsYT1uLXIsby5sZW5ndGgmJihzPW8uam9pbihcIl9cIiksLTEhPT1zLmluZGV4T2YoXCJzaG9ydFwiKSYmKGElPWgsYSE9PWElKGgvMikmJihhPTA+YT9hK2g6YS1oKSksLTEhPT1zLmluZGV4T2YoXCJfY3dcIikmJjA+YT9hPShhKzk5OTk5OTk5OTkqaCklaC0oMHxhL2gpKmg6LTEhPT1zLmluZGV4T2YoXCJjY3dcIikmJmE+MCYmKGE9KGEtOTk5OTk5OTk5OSpoKSVoLSgwfGEvaCkqaCkpLChhPmx8fC1sPmEpJiYodGhpcy5fYWRkVHdlZW4odCxpLHIscithLGkpLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goaSkpKTtyZXR1cm4hMH0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlO2lmKDEhPT10KXRoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcyx0KTtlbHNlIGZvcihlPXRoaXMuX2ZpcnN0UFQ7ZTspZS5mP2UudFtlLnBdKHRoaXMuZmluYWxzW2UucF0pOmUudFtlLnBdPXRoaXMuZmluYWxzW2UucF0sZT1lLl9uZXh0fX0pLl9hdXRvQ1NTPSEwLF9nc1Njb3BlLl9nc0RlZmluZShcImVhc2luZy5CYWNrXCIsW1wiZWFzaW5nLkVhc2VcIl0sZnVuY3Rpb24odCl7dmFyIGUsaSxzLHI9X2dzU2NvcGUuR3JlZW5Tb2NrR2xvYmFsc3x8X2dzU2NvcGUsbj1yLmNvbS5ncmVlbnNvY2ssYT0yKk1hdGguUEksbz1NYXRoLlBJLzIsaD1uLl9jbGFzcyxsPWZ1bmN0aW9uKGUsaSl7dmFyIHM9aChcImVhc2luZy5cIitlLGZ1bmN0aW9uKCl7fSwhMCkscj1zLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gci5jb25zdHJ1Y3Rvcj1zLHIuZ2V0UmF0aW89aSxzfSxfPXQucmVnaXN0ZXJ8fGZ1bmN0aW9uKCl7fSx1PWZ1bmN0aW9uKHQsZSxpLHMpe3ZhciByPWgoXCJlYXNpbmcuXCIrdCx7ZWFzZU91dDpuZXcgZSxlYXNlSW46bmV3IGksZWFzZUluT3V0Om5ldyBzfSwhMCk7cmV0dXJuIF8ocix0KSxyfSxwPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLnQ9dCx0aGlzLnY9ZSxpJiYodGhpcy5uZXh0PWksaS5wcmV2PXRoaXMsdGhpcy5jPWkudi1lLHRoaXMuZ2FwPWkudC10KX0sYz1mdW5jdGlvbihlLGkpe3ZhciBzPWgoXCJlYXNpbmcuXCIrZSxmdW5jdGlvbih0KXt0aGlzLl9wMT10fHwwPT09dD90OjEuNzAxNTgsdGhpcy5fcDI9MS41MjUqdGhpcy5fcDF9LCEwKSxyPXMucHJvdG90eXBlPW5ldyB0O3JldHVybiByLmNvbnN0cnVjdG9yPXMsci5nZXRSYXRpbz1pLHIuY29uZmlnPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgcyh0KX0sc30sZj11KFwiQmFja1wiLGMoXCJCYWNrT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuKHQtPTEpKnQqKCh0aGlzLl9wMSsxKSp0K3RoaXMuX3AxKSsxfSksYyhcIkJhY2tJblwiLGZ1bmN0aW9uKHQpe3JldHVybiB0KnQqKCh0aGlzLl9wMSsxKSp0LXRoaXMuX3AxKX0pLGMoXCJCYWNrSW5PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMT4odCo9Mik/LjUqdCp0KigodGhpcy5fcDIrMSkqdC10aGlzLl9wMik6LjUqKCh0LT0yKSp0KigodGhpcy5fcDIrMSkqdCt0aGlzLl9wMikrMil9KSksbT1oKFwiZWFzaW5nLlNsb3dNb1wiLGZ1bmN0aW9uKHQsZSxpKXtlPWV8fDA9PT1lP2U6LjcsbnVsbD09dD90PS43OnQ+MSYmKHQ9MSksdGhpcy5fcD0xIT09dD9lOjAsdGhpcy5fcDE9KDEtdCkvMix0aGlzLl9wMj10LHRoaXMuX3AzPXRoaXMuX3AxK3RoaXMuX3AyLHRoaXMuX2NhbGNFbmQ9aT09PSEwfSwhMCksZD1tLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gZC5jb25zdHJ1Y3Rvcj1tLGQuZ2V0UmF0aW89ZnVuY3Rpb24odCl7dmFyIGU9dCsoLjUtdCkqdGhpcy5fcDtyZXR1cm4gdGhpcy5fcDE+dD90aGlzLl9jYWxjRW5kPzEtKHQ9MS10L3RoaXMuX3AxKSp0OmUtKHQ9MS10L3RoaXMuX3AxKSp0KnQqdCplOnQ+dGhpcy5fcDM/dGhpcy5fY2FsY0VuZD8xLSh0PSh0LXRoaXMuX3AzKS90aGlzLl9wMSkqdDplKyh0LWUpKih0PSh0LXRoaXMuX3AzKS90aGlzLl9wMSkqdCp0KnQ6dGhpcy5fY2FsY0VuZD8xOmV9LG0uZWFzZT1uZXcgbSguNywuNyksZC5jb25maWc9bS5jb25maWc9ZnVuY3Rpb24odCxlLGkpe3JldHVybiBuZXcgbSh0LGUsaSl9LGU9aChcImVhc2luZy5TdGVwcGVkRWFzZVwiLGZ1bmN0aW9uKHQpe3Q9dHx8MSx0aGlzLl9wMT0xL3QsdGhpcy5fcDI9dCsxfSwhMCksZD1lLnByb3RvdHlwZT1uZXcgdCxkLmNvbnN0cnVjdG9yPWUsZC5nZXRSYXRpbz1mdW5jdGlvbih0KXtyZXR1cm4gMD50P3Q9MDp0Pj0xJiYodD0uOTk5OTk5OTk5KSwodGhpcy5fcDIqdD4+MCkqdGhpcy5fcDF9LGQuY29uZmlnPWUuY29uZmlnPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgZSh0KX0saT1oKFwiZWFzaW5nLlJvdWdoRWFzZVwiLGZ1bmN0aW9uKGUpe2U9ZXx8e307Zm9yKHZhciBpLHMscixuLGEsbyxoPWUudGFwZXJ8fFwibm9uZVwiLGw9W10sXz0wLHU9MHwoZS5wb2ludHN8fDIwKSxjPXUsZj1lLnJhbmRvbWl6ZSE9PSExLG09ZS5jbGFtcD09PSEwLGQ9ZS50ZW1wbGF0ZSBpbnN0YW5jZW9mIHQ/ZS50ZW1wbGF0ZTpudWxsLGc9XCJudW1iZXJcIj09dHlwZW9mIGUuc3RyZW5ndGg/LjQqZS5zdHJlbmd0aDouNDstLWM+LTE7KWk9Zj9NYXRoLnJhbmRvbSgpOjEvdSpjLHM9ZD9kLmdldFJhdGlvKGkpOmksXCJub25lXCI9PT1oP3I9ZzpcIm91dFwiPT09aD8obj0xLWkscj1uKm4qZyk6XCJpblwiPT09aD9yPWkqaSpnOi41Pmk/KG49MippLHI9LjUqbipuKmcpOihuPTIqKDEtaSkscj0uNSpuKm4qZyksZj9zKz1NYXRoLnJhbmRvbSgpKnItLjUqcjpjJTI/cys9LjUqcjpzLT0uNSpyLG0mJihzPjE/cz0xOjA+cyYmKHM9MCkpLGxbXysrXT17eDppLHk6c307Zm9yKGwuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0LngtZS54fSksbz1uZXcgcCgxLDEsbnVsbCksYz11Oy0tYz4tMTspYT1sW2NdLG89bmV3IHAoYS54LGEueSxvKTt0aGlzLl9wcmV2PW5ldyBwKDAsMCwwIT09by50P286by5uZXh0KX0sITApLGQ9aS5wcm90b3R5cGU9bmV3IHQsZC5jb25zdHJ1Y3Rvcj1pLGQuZ2V0UmF0aW89ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5fcHJldjtpZih0PmUudCl7Zm9yKDtlLm5leHQmJnQ+PWUudDspZT1lLm5leHQ7ZT1lLnByZXZ9ZWxzZSBmb3IoO2UucHJldiYmZS50Pj10OyllPWUucHJldjtyZXR1cm4gdGhpcy5fcHJldj1lLGUudisodC1lLnQpL2UuZ2FwKmUuY30sZC5jb25maWc9ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBpKHQpfSxpLmVhc2U9bmV3IGksdShcIkJvdW5jZVwiLGwoXCJCb3VuY2VPdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD83LjU2MjUqKHQtPTEuNS8yLjc1KSp0Ky43NToyLjUvMi43NT50PzcuNTYyNSoodC09Mi4yNS8yLjc1KSp0Ky45Mzc1OjcuNTYyNSoodC09Mi42MjUvMi43NSkqdCsuOTg0Mzc1fSksbChcIkJvdW5jZUluXCIsZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT4odD0xLXQpPzEtNy41NjI1KnQqdDoyLzIuNzU+dD8xLSg3LjU2MjUqKHQtPTEuNS8yLjc1KSp0Ky43NSk6Mi41LzIuNzU+dD8xLSg3LjU2MjUqKHQtPTIuMjUvMi43NSkqdCsuOTM3NSk6MS0oNy41NjI1Kih0LT0yLjYyNS8yLjc1KSp0Ky45ODQzNzUpfSksbChcIkJvdW5jZUluT3V0XCIsZnVuY3Rpb24odCl7dmFyIGU9LjU+dDtyZXR1cm4gdD1lPzEtMip0OjIqdC0xLHQ9MS8yLjc1PnQ/Ny41NjI1KnQqdDoyLzIuNzU+dD83LjU2MjUqKHQtPTEuNS8yLjc1KSp0Ky43NToyLjUvMi43NT50PzcuNTYyNSoodC09Mi4yNS8yLjc1KSp0Ky45Mzc1OjcuNTYyNSoodC09Mi42MjUvMi43NSkqdCsuOTg0Mzc1LGU/LjUqKDEtdCk6LjUqdCsuNX0pKSx1KFwiQ2lyY1wiLGwoXCJDaXJjT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc3FydCgxLSh0LT0xKSp0KX0pLGwoXCJDaXJjSW5cIixmdW5jdGlvbih0KXtyZXR1cm4tKE1hdGguc3FydCgxLXQqdCktMSl9KSxsKFwiQ2lyY0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy0uNSooTWF0aC5zcXJ0KDEtdCp0KS0xKTouNSooTWF0aC5zcXJ0KDEtKHQtPTIpKnQpKzEpfSkpLHM9ZnVuY3Rpb24oZSxpLHMpe3ZhciByPWgoXCJlYXNpbmcuXCIrZSxmdW5jdGlvbih0LGUpe3RoaXMuX3AxPXR8fDEsdGhpcy5fcDI9ZXx8cyx0aGlzLl9wMz10aGlzLl9wMi9hKihNYXRoLmFzaW4oMS90aGlzLl9wMSl8fDApfSwhMCksbj1yLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gbi5jb25zdHJ1Y3Rvcj1yLG4uZ2V0UmF0aW89aSxuLmNvbmZpZz1mdW5jdGlvbih0LGUpe3JldHVybiBuZXcgcih0LGUpfSxyfSx1KFwiRWxhc3RpY1wiLHMoXCJFbGFzdGljT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3AxKk1hdGgucG93KDIsLTEwKnQpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKSsxfSwuMykscyhcIkVsYXN0aWNJblwiLGZ1bmN0aW9uKHQpe3JldHVybi0odGhpcy5fcDEqTWF0aC5wb3coMiwxMCoodC09MSkpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKSl9LC4zKSxzKFwiRWxhc3RpY0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy0uNSp0aGlzLl9wMSpNYXRoLnBvdygyLDEwKih0LT0xKSkqTWF0aC5zaW4oKHQtdGhpcy5fcDMpKmEvdGhpcy5fcDIpOi41KnRoaXMuX3AxKk1hdGgucG93KDIsLTEwKih0LT0xKSkqTWF0aC5zaW4oKHQtdGhpcy5fcDMpKmEvdGhpcy5fcDIpKzF9LC40NSkpLHUoXCJFeHBvXCIsbChcIkV4cG9PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMS1NYXRoLnBvdygyLC0xMCp0KX0pLGwoXCJFeHBvSW5cIixmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5wb3coMiwxMCoodC0xKSktLjAwMX0pLGwoXCJFeHBvSW5PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMT4odCo9Mik/LjUqTWF0aC5wb3coMiwxMCoodC0xKSk6LjUqKDItTWF0aC5wb3coMiwtMTAqKHQtMSkpKX0pKSx1KFwiU2luZVwiLGwoXCJTaW5lT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIE1hdGguc2luKHQqbyl9KSxsKFwiU2luZUluXCIsZnVuY3Rpb24odCl7cmV0dXJuLU1hdGguY29zKHQqbykrMX0pLGwoXCJTaW5lSW5PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4tLjUqKE1hdGguY29zKE1hdGguUEkqdCktMSl9KSksaChcImVhc2luZy5FYXNlTG9va3VwXCIse2ZpbmQ6ZnVuY3Rpb24oZSl7cmV0dXJuIHQubWFwW2VdfX0sITApLF8oci5TbG93TW8sXCJTbG93TW9cIixcImVhc2UsXCIpLF8oaSxcIlJvdWdoRWFzZVwiLFwiZWFzZSxcIiksXyhlLFwiU3RlcHBlZEVhc2VcIixcImVhc2UsXCIpLGZ9LCEwKX0pLF9nc1Njb3BlLl9nc0RlZmluZSYmX2dzU2NvcGUuX2dzUXVldWUucG9wKCkoKSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO3ZhciBpPXQuR3JlZW5Tb2NrR2xvYmFscz10LkdyZWVuU29ja0dsb2JhbHN8fHQ7aWYoIWkuVHdlZW5MaXRlKXt2YXIgcyxyLG4sYSxvLGg9ZnVuY3Rpb24odCl7dmFyIGUscz10LnNwbGl0KFwiLlwiKSxyPWk7Zm9yKGU9MDtzLmxlbmd0aD5lO2UrKylyW3NbZV1dPXI9cltzW2VdXXx8e307cmV0dXJuIHJ9LGw9aChcImNvbS5ncmVlbnNvY2tcIiksXz0xZS0xMCx1PWZ1bmN0aW9uKHQpe3ZhciBlLGk9W10scz10Lmxlbmd0aDtmb3IoZT0wO2UhPT1zO2kucHVzaCh0W2UrK10pKTtyZXR1cm4gaX0scD1mdW5jdGlvbigpe30sYz1mdW5jdGlvbigpe3ZhciB0PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsZT10LmNhbGwoW10pO3JldHVybiBmdW5jdGlvbihpKXtyZXR1cm4gbnVsbCE9aSYmKGkgaW5zdGFuY2VvZiBBcnJheXx8XCJvYmplY3RcIj09dHlwZW9mIGkmJiEhaS5wdXNoJiZ0LmNhbGwoaSk9PT1lKX19KCksZj17fSxtPWZ1bmN0aW9uKHMscixuLGEpe3RoaXMuc2M9ZltzXT9mW3NdLnNjOltdLGZbc109dGhpcyx0aGlzLmdzQ2xhc3M9bnVsbCx0aGlzLmZ1bmM9bjt2YXIgbz1bXTt0aGlzLmNoZWNrPWZ1bmN0aW9uKGwpe2Zvcih2YXIgXyx1LHAsYyxkPXIubGVuZ3RoLGc9ZDstLWQ+LTE7KShfPWZbcltkXV18fG5ldyBtKHJbZF0sW10pKS5nc0NsYXNzPyhvW2RdPV8uZ3NDbGFzcyxnLS0pOmwmJl8uc2MucHVzaCh0aGlzKTtpZigwPT09ZyYmbilmb3IodT0oXCJjb20uZ3JlZW5zb2NrLlwiK3MpLnNwbGl0KFwiLlwiKSxwPXUucG9wKCksYz1oKHUuam9pbihcIi5cIikpW3BdPXRoaXMuZ3NDbGFzcz1uLmFwcGx5KG4sbyksYSYmKGlbcF09YyxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKCh0LkdyZWVuU29ja0FNRFBhdGg/dC5HcmVlblNvY2tBTURQYXRoK1wiL1wiOlwiXCIpK3Muc3BsaXQoXCIuXCIpLnBvcCgpLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGN9KTpzPT09ZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz1jKSksZD0wO3RoaXMuc2MubGVuZ3RoPmQ7ZCsrKXRoaXMuc2NbZF0uY2hlY2soKX0sdGhpcy5jaGVjayghMCl9LGQ9dC5fZ3NEZWZpbmU9ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIG5ldyBtKHQsZSxpLHMpfSxnPWwuX2NsYXNzPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gZT1lfHxmdW5jdGlvbigpe30sZCh0LFtdLGZ1bmN0aW9uKCl7cmV0dXJuIGV9LGkpLGV9O2QuZ2xvYmFscz1pO3ZhciB2PVswLDAsMSwxXSx5PVtdLFQ9ZyhcImVhc2luZy5FYXNlXCIsZnVuY3Rpb24odCxlLGkscyl7dGhpcy5fZnVuYz10LHRoaXMuX3R5cGU9aXx8MCx0aGlzLl9wb3dlcj1zfHwwLHRoaXMuX3BhcmFtcz1lP3YuY29uY2F0KGUpOnZ9LCEwKSx3PVQubWFwPXt9LHg9VC5yZWdpc3Rlcj1mdW5jdGlvbih0LGUsaSxzKXtmb3IodmFyIHIsbixhLG8saD1lLnNwbGl0KFwiLFwiKSxfPWgubGVuZ3RoLHU9KGl8fFwiZWFzZUluLGVhc2VPdXQsZWFzZUluT3V0XCIpLnNwbGl0KFwiLFwiKTstLV8+LTE7KWZvcihuPWhbX10scj1zP2coXCJlYXNpbmcuXCIrbixudWxsLCEwKTpsLmVhc2luZ1tuXXx8e30sYT11Lmxlbmd0aDstLWE+LTE7KW89dVthXSx3W24rXCIuXCIrb109d1tvK25dPXJbb109dC5nZXRSYXRpbz90OnRbb118fG5ldyB0fTtmb3Iobj1ULnByb3RvdHlwZSxuLl9jYWxjRW5kPSExLG4uZ2V0UmF0aW89ZnVuY3Rpb24odCl7aWYodGhpcy5fZnVuYylyZXR1cm4gdGhpcy5fcGFyYW1zWzBdPXQsdGhpcy5fZnVuYy5hcHBseShudWxsLHRoaXMuX3BhcmFtcyk7dmFyIGU9dGhpcy5fdHlwZSxpPXRoaXMuX3Bvd2VyLHM9MT09PWU/MS10OjI9PT1lP3Q6LjU+dD8yKnQ6MiooMS10KTtyZXR1cm4gMT09PWk/cyo9czoyPT09aT9zKj1zKnM6Mz09PWk/cyo9cypzKnM6ND09PWkmJihzKj1zKnMqcypzKSwxPT09ZT8xLXM6Mj09PWU/czouNT50P3MvMjoxLXMvMn0scz1bXCJMaW5lYXJcIixcIlF1YWRcIixcIkN1YmljXCIsXCJRdWFydFwiLFwiUXVpbnQsU3Ryb25nXCJdLHI9cy5sZW5ndGg7LS1yPi0xOyluPXNbcl0rXCIsUG93ZXJcIityLHgobmV3IFQobnVsbCxudWxsLDEsciksbixcImVhc2VPdXRcIiwhMCkseChuZXcgVChudWxsLG51bGwsMixyKSxuLFwiZWFzZUluXCIrKDA9PT1yP1wiLGVhc2VOb25lXCI6XCJcIikpLHgobmV3IFQobnVsbCxudWxsLDMsciksbixcImVhc2VJbk91dFwiKTt3LmxpbmVhcj1sLmVhc2luZy5MaW5lYXIuZWFzZUluLHcuc3dpbmc9bC5lYXNpbmcuUXVhZC5lYXNlSW5PdXQ7dmFyIGI9ZyhcImV2ZW50cy5FdmVudERpc3BhdGNoZXJcIixmdW5jdGlvbih0KXt0aGlzLl9saXN0ZW5lcnM9e30sdGhpcy5fZXZlbnRUYXJnZXQ9dHx8dGhpc30pO249Yi5wcm90b3R5cGUsbi5hZGRFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSxpLHMscil7cj1yfHwwO3ZhciBuLGgsbD10aGlzLl9saXN0ZW5lcnNbdF0sXz0wO2ZvcihudWxsPT1sJiYodGhpcy5fbGlzdGVuZXJzW3RdPWw9W10pLGg9bC5sZW5ndGg7LS1oPi0xOyluPWxbaF0sbi5jPT09ZSYmbi5zPT09aT9sLnNwbGljZShoLDEpOjA9PT1fJiZyPm4ucHImJihfPWgrMSk7bC5zcGxpY2UoXywwLHtjOmUsczppLHVwOnMscHI6cn0pLHRoaXMhPT1hfHxvfHxhLndha2UoKX0sbi5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7dmFyIGkscz10aGlzLl9saXN0ZW5lcnNbdF07aWYocylmb3IoaT1zLmxlbmd0aDstLWk+LTE7KWlmKHNbaV0uYz09PWUpcmV0dXJuIHMuc3BsaWNlKGksMSksdm9pZCAwfSxuLmRpc3BhdGNoRXZlbnQ9ZnVuY3Rpb24odCl7dmFyIGUsaSxzLHI9dGhpcy5fbGlzdGVuZXJzW3RdO2lmKHIpZm9yKGU9ci5sZW5ndGgsaT10aGlzLl9ldmVudFRhcmdldDstLWU+LTE7KXM9cltlXSxzJiYocy51cD9zLmMuY2FsbChzLnN8fGkse3R5cGU6dCx0YXJnZXQ6aX0pOnMuYy5jYWxsKHMuc3x8aSkpfTt2YXIgUD10LnJlcXVlc3RBbmltYXRpb25GcmFtZSxTPXQuY2FuY2VsQW5pbWF0aW9uRnJhbWUsaz1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKX0sUj1rKCk7Zm9yKHM9W1wibXNcIixcIm1velwiLFwid2Via2l0XCIsXCJvXCJdLHI9cy5sZW5ndGg7LS1yPi0xJiYhUDspUD10W3Nbcl0rXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl0sUz10W3Nbcl0rXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXXx8dFtzW3JdK1wiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO2coXCJUaWNrZXJcIixmdW5jdGlvbih0LGUpe3ZhciBpLHMscixuLGgsbD10aGlzLHU9aygpLGM9ZSE9PSExJiZQLGY9NTAwLG09MzMsZD1mdW5jdGlvbih0KXt2YXIgZSxhLG89aygpLVI7bz5mJiYodSs9by1tKSxSKz1vLGwudGltZT0oUi11KS8xZTMsZT1sLnRpbWUtaCwoIWl8fGU+MHx8dD09PSEwKSYmKGwuZnJhbWUrKyxoKz1lKyhlPj1uPy4wMDQ6bi1lKSxhPSEwKSx0IT09ITAmJihyPXMoZCkpLGEmJmwuZGlzcGF0Y2hFdmVudChcInRpY2tcIil9O2IuY2FsbChsKSxsLnRpbWU9bC5mcmFtZT0wLGwudGljaz1mdW5jdGlvbigpe2QoITApfSxsLmxhZ1Ntb290aGluZz1mdW5jdGlvbih0LGUpe2Y9dHx8MS9fLG09TWF0aC5taW4oZSxmLDApfSxsLnNsZWVwPWZ1bmN0aW9uKCl7bnVsbCE9ciYmKGMmJlM/UyhyKTpjbGVhclRpbWVvdXQocikscz1wLHI9bnVsbCxsPT09YSYmKG89ITEpKX0sbC53YWtlPWZ1bmN0aW9uKCl7bnVsbCE9PXI/bC5zbGVlcCgpOmwuZnJhbWU+MTAmJihSPWsoKS1mKzUpLHM9MD09PWk/cDpjJiZQP1A6ZnVuY3Rpb24odCl7cmV0dXJuIHNldFRpbWVvdXQodCwwfDFlMyooaC1sLnRpbWUpKzEpfSxsPT09YSYmKG89ITApLGQoMil9LGwuZnBzPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyhpPXQsbj0xLyhpfHw2MCksaD10aGlzLnRpbWUrbixsLndha2UoKSx2b2lkIDApOml9LGwudXNlUkFGPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyhsLnNsZWVwKCksYz10LGwuZnBzKGkpLHZvaWQgMCk6Y30sbC5mcHModCksc2V0VGltZW91dChmdW5jdGlvbigpe2MmJighcnx8NT5sLmZyYW1lKSYmbC51c2VSQUYoITEpfSwxNTAwKX0pLG49bC5UaWNrZXIucHJvdG90eXBlPW5ldyBsLmV2ZW50cy5FdmVudERpc3BhdGNoZXIsbi5jb25zdHJ1Y3Rvcj1sLlRpY2tlcjt2YXIgQT1nKFwiY29yZS5BbmltYXRpb25cIixmdW5jdGlvbih0LGUpe2lmKHRoaXMudmFycz1lPWV8fHt9LHRoaXMuX2R1cmF0aW9uPXRoaXMuX3RvdGFsRHVyYXRpb249dHx8MCx0aGlzLl9kZWxheT1OdW1iZXIoZS5kZWxheSl8fDAsdGhpcy5fdGltZVNjYWxlPTEsdGhpcy5fYWN0aXZlPWUuaW1tZWRpYXRlUmVuZGVyPT09ITAsdGhpcy5kYXRhPWUuZGF0YSx0aGlzLl9yZXZlcnNlZD1lLnJldmVyc2VkPT09ITAsQil7b3x8YS53YWtlKCk7dmFyIGk9dGhpcy52YXJzLnVzZUZyYW1lcz9qOkI7aS5hZGQodGhpcyxpLl90aW1lKSx0aGlzLnZhcnMucGF1c2VkJiZ0aGlzLnBhdXNlZCghMCl9fSk7YT1BLnRpY2tlcj1uZXcgbC5UaWNrZXIsbj1BLnByb3RvdHlwZSxuLl9kaXJ0eT1uLl9nYz1uLl9pbml0dGVkPW4uX3BhdXNlZD0hMSxuLl90b3RhbFRpbWU9bi5fdGltZT0wLG4uX3Jhd1ByZXZUaW1lPS0xLG4uX25leHQ9bi5fbGFzdD1uLl9vblVwZGF0ZT1uLl90aW1lbGluZT1uLnRpbWVsaW5lPW51bGwsbi5fcGF1c2VkPSExO3ZhciBPPWZ1bmN0aW9uKCl7byYmaygpLVI+MmUzJiZhLndha2UoKSxzZXRUaW1lb3V0KE8sMmUzKX07TygpLG4ucGxheT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsIT10JiZ0aGlzLnNlZWsodCxlKSx0aGlzLnJldmVyc2VkKCExKS5wYXVzZWQoITEpfSxuLnBhdXNlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0LGUpLHRoaXMucGF1c2VkKCEwKX0sbi5yZXN1bWU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5zZWVrKHQsZSksdGhpcy5wYXVzZWQoITEpfSxuLnNlZWs9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy50b3RhbFRpbWUoTnVtYmVyKHQpLGUhPT0hMSl9LG4ucmVzdGFydD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnJldmVyc2VkKCExKS5wYXVzZWQoITEpLnRvdGFsVGltZSh0Py10aGlzLl9kZWxheTowLGUhPT0hMSwhMCl9LG4ucmV2ZXJzZT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsIT10JiZ0aGlzLnNlZWsodHx8dGhpcy50b3RhbER1cmF0aW9uKCksZSksdGhpcy5yZXZlcnNlZCghMCkucGF1c2VkKCExKX0sbi5yZW5kZXI9ZnVuY3Rpb24oKXt9LG4uaW52YWxpZGF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZT0wLHRoaXMuX2luaXR0ZWQ9dGhpcy5fZ2M9ITEsdGhpcy5fcmF3UHJldlRpbWU9LTEsKHRoaXMuX2djfHwhdGhpcy50aW1lbGluZSkmJnRoaXMuX2VuYWJsZWQoITApLHRoaXN9LG4uaXNBY3RpdmU9ZnVuY3Rpb24oKXt2YXIgdCxlPXRoaXMuX3RpbWVsaW5lLGk9dGhpcy5fc3RhcnRUaW1lO3JldHVybiFlfHwhdGhpcy5fZ2MmJiF0aGlzLl9wYXVzZWQmJmUuaXNBY3RpdmUoKSYmKHQ9ZS5yYXdUaW1lKCkpPj1pJiZpK3RoaXMudG90YWxEdXJhdGlvbigpL3RoaXMuX3RpbWVTY2FsZT50fSxuLl9lbmFibGVkPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG98fGEud2FrZSgpLHRoaXMuX2djPSF0LHRoaXMuX2FjdGl2ZT10aGlzLmlzQWN0aXZlKCksZSE9PSEwJiYodCYmIXRoaXMudGltZWxpbmU/dGhpcy5fdGltZWxpbmUuYWRkKHRoaXMsdGhpcy5fc3RhcnRUaW1lLXRoaXMuX2RlbGF5KTohdCYmdGhpcy50aW1lbGluZSYmdGhpcy5fdGltZWxpbmUuX3JlbW92ZSh0aGlzLCEwKSksITF9LG4uX2tpbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZW5hYmxlZCghMSwhMSl9LG4ua2lsbD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLl9raWxsKHQsZSksdGhpc30sbi5fdW5jYWNoZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9dD90aGlzOnRoaXMudGltZWxpbmU7ZTspZS5fZGlydHk9ITAsZT1lLnRpbWVsaW5lO3JldHVybiB0aGlzfSxuLl9zd2FwU2VsZkluUGFyYW1zPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10Lmxlbmd0aCxpPXQuY29uY2F0KCk7LS1lPi0xOylcIntzZWxmfVwiPT09dFtlXSYmKGlbZV09dGhpcyk7cmV0dXJuIGl9LG4uZXZlbnRDYWxsYmFjaz1mdW5jdGlvbih0LGUsaSxzKXtpZihcIm9uXCI9PT0odHx8XCJcIikuc3Vic3RyKDAsMikpe3ZhciByPXRoaXMudmFycztpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gclt0XTtudWxsPT1lP2RlbGV0ZSByW3RdOihyW3RdPWUsclt0K1wiUGFyYW1zXCJdPWMoaSkmJi0xIT09aS5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIik/dGhpcy5fc3dhcFNlbGZJblBhcmFtcyhpKTppLHJbdCtcIlNjb3BlXCJdPXMpLFwib25VcGRhdGVcIj09PXQmJih0aGlzLl9vblVwZGF0ZT1lKX1yZXR1cm4gdGhpc30sbi5kZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcmJnRoaXMuc3RhcnRUaW1lKHRoaXMuX3N0YXJ0VGltZSt0LXRoaXMuX2RlbGF5KSx0aGlzLl9kZWxheT10LHRoaXMpOnRoaXMuX2RlbGF5fSxuLmR1cmF0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kdXJhdGlvbj10aGlzLl90b3RhbER1cmF0aW9uPXQsdGhpcy5fdW5jYWNoZSghMCksdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcmJnRoaXMuX3RpbWU+MCYmdGhpcy5fdGltZTx0aGlzLl9kdXJhdGlvbiYmMCE9PXQmJnRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSoodC90aGlzLl9kdXJhdGlvbiksITApLHRoaXMpOih0aGlzLl9kaXJ0eT0hMSx0aGlzLl9kdXJhdGlvbil9LG4udG90YWxEdXJhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fZGlydHk9ITEsYXJndW1lbnRzLmxlbmd0aD90aGlzLmR1cmF0aW9uKHQpOnRoaXMuX3RvdGFsRHVyYXRpb259LG4udGltZT1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCksdGhpcy50b3RhbFRpbWUodD50aGlzLl9kdXJhdGlvbj90aGlzLl9kdXJhdGlvbjp0LGUpKTp0aGlzLl90aW1lfSxuLnRvdGFsVGltZT1mdW5jdGlvbih0LGUsaSl7aWYob3x8YS53YWtlKCksIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3RvdGFsVGltZTtpZih0aGlzLl90aW1lbGluZSl7aWYoMD50JiYhaSYmKHQrPXRoaXMudG90YWxEdXJhdGlvbigpKSx0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyl7dGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpO3ZhciBzPXRoaXMuX3RvdGFsRHVyYXRpb24scj10aGlzLl90aW1lbGluZTtpZih0PnMmJiFpJiYodD1zKSx0aGlzLl9zdGFydFRpbWU9KHRoaXMuX3BhdXNlZD90aGlzLl9wYXVzZVRpbWU6ci5fdGltZSktKHRoaXMuX3JldmVyc2VkP3MtdDp0KS90aGlzLl90aW1lU2NhbGUsci5fZGlydHl8fHRoaXMuX3VuY2FjaGUoITEpLHIuX3RpbWVsaW5lKWZvcig7ci5fdGltZWxpbmU7KXIuX3RpbWVsaW5lLl90aW1lIT09KHIuX3N0YXJ0VGltZStyLl90b3RhbFRpbWUpL3IuX3RpbWVTY2FsZSYmci50b3RhbFRpbWUoci5fdG90YWxUaW1lLCEwKSxyPXIuX3RpbWVsaW5lfXRoaXMuX2djJiZ0aGlzLl9lbmFibGVkKCEwLCExKSwodGhpcy5fdG90YWxUaW1lIT09dHx8MD09PXRoaXMuX2R1cmF0aW9uKSYmKHRoaXMucmVuZGVyKHQsZSwhMSksSS5sZW5ndGgmJnEoKSl9cmV0dXJuIHRoaXN9LG4ucHJvZ3Jlc3M9bi50b3RhbFByb2dyZXNzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy5kdXJhdGlvbigpKnQsZSk6dGhpcy5fdGltZS90aGlzLmR1cmF0aW9uKCl9LG4uc3RhcnRUaW1lPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0IT09dGhpcy5fc3RhcnRUaW1lJiYodGhpcy5fc3RhcnRUaW1lPXQsdGhpcy50aW1lbGluZSYmdGhpcy50aW1lbGluZS5fc29ydENoaWxkcmVuJiZ0aGlzLnRpbWVsaW5lLmFkZCh0aGlzLHQtdGhpcy5fZGVsYXkpKSx0aGlzKTp0aGlzLl9zdGFydFRpbWV9LG4uZW5kVGltZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fc3RhcnRUaW1lKygwIT10P3RoaXMudG90YWxEdXJhdGlvbigpOnRoaXMuZHVyYXRpb24oKSkvdGhpcy5fdGltZVNjYWxlfSxuLnRpbWVTY2FsZT1mdW5jdGlvbih0KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fdGltZVNjYWxlO2lmKHQ9dHx8Xyx0aGlzLl90aW1lbGluZSYmdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpe3ZhciBlPXRoaXMuX3BhdXNlVGltZSxpPWV8fDA9PT1lP2U6dGhpcy5fdGltZWxpbmUudG90YWxUaW1lKCk7dGhpcy5fc3RhcnRUaW1lPWktKGktdGhpcy5fc3RhcnRUaW1lKSp0aGlzLl90aW1lU2NhbGUvdH1yZXR1cm4gdGhpcy5fdGltZVNjYWxlPXQsdGhpcy5fdW5jYWNoZSghMSl9LG4ucmV2ZXJzZWQ9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHQhPXRoaXMuX3JldmVyc2VkJiYodGhpcy5fcmV2ZXJzZWQ9dCx0aGlzLnRvdGFsVGltZSh0aGlzLl90aW1lbGluZSYmIXRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nP3RoaXMudG90YWxEdXJhdGlvbigpLXRoaXMuX3RvdGFsVGltZTp0aGlzLl90b3RhbFRpbWUsITApKSx0aGlzKTp0aGlzLl9yZXZlcnNlZH0sbi5wYXVzZWQ9ZnVuY3Rpb24odCl7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3BhdXNlZDtpZih0IT10aGlzLl9wYXVzZWQmJnRoaXMuX3RpbWVsaW5lKXtvfHx0fHxhLndha2UoKTt2YXIgZT10aGlzLl90aW1lbGluZSxpPWUucmF3VGltZSgpLHM9aS10aGlzLl9wYXVzZVRpbWU7IXQmJmUuc21vb3RoQ2hpbGRUaW1pbmcmJih0aGlzLl9zdGFydFRpbWUrPXMsdGhpcy5fdW5jYWNoZSghMSkpLHRoaXMuX3BhdXNlVGltZT10P2k6bnVsbCx0aGlzLl9wYXVzZWQ9dCx0aGlzLl9hY3RpdmU9dGhpcy5pc0FjdGl2ZSgpLCF0JiYwIT09cyYmdGhpcy5faW5pdHRlZCYmdGhpcy5kdXJhdGlvbigpJiZ0aGlzLnJlbmRlcihlLnNtb290aENoaWxkVGltaW5nP3RoaXMuX3RvdGFsVGltZTooaS10aGlzLl9zdGFydFRpbWUpL3RoaXMuX3RpbWVTY2FsZSwhMCwhMCl9cmV0dXJuIHRoaXMuX2djJiYhdCYmdGhpcy5fZW5hYmxlZCghMCwhMSksdGhpc307dmFyIEM9ZyhcImNvcmUuU2ltcGxlVGltZWxpbmVcIixmdW5jdGlvbih0KXtBLmNhbGwodGhpcywwLHQpLHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuPXRoaXMuc21vb3RoQ2hpbGRUaW1pbmc9ITB9KTtuPUMucHJvdG90eXBlPW5ldyBBLG4uY29uc3RydWN0b3I9QyxuLmtpbGwoKS5fZ2M9ITEsbi5fZmlyc3Q9bi5fbGFzdD1uLl9yZWNlbnQ9bnVsbCxuLl9zb3J0Q2hpbGRyZW49ITEsbi5hZGQ9bi5pbnNlcnQ9ZnVuY3Rpb24odCxlKXt2YXIgaSxzO2lmKHQuX3N0YXJ0VGltZT1OdW1iZXIoZXx8MCkrdC5fZGVsYXksdC5fcGF1c2VkJiZ0aGlzIT09dC5fdGltZWxpbmUmJih0Ll9wYXVzZVRpbWU9dC5fc3RhcnRUaW1lKyh0aGlzLnJhd1RpbWUoKS10Ll9zdGFydFRpbWUpL3QuX3RpbWVTY2FsZSksdC50aW1lbGluZSYmdC50aW1lbGluZS5fcmVtb3ZlKHQsITApLHQudGltZWxpbmU9dC5fdGltZWxpbmU9dGhpcyx0Ll9nYyYmdC5fZW5hYmxlZCghMCwhMCksaT10aGlzLl9sYXN0LHRoaXMuX3NvcnRDaGlsZHJlbilmb3Iocz10Ll9zdGFydFRpbWU7aSYmaS5fc3RhcnRUaW1lPnM7KWk9aS5fcHJldjtyZXR1cm4gaT8odC5fbmV4dD1pLl9uZXh0LGkuX25leHQ9dCk6KHQuX25leHQ9dGhpcy5fZmlyc3QsdGhpcy5fZmlyc3Q9dCksdC5fbmV4dD90Ll9uZXh0Ll9wcmV2PXQ6dGhpcy5fbGFzdD10LHQuX3ByZXY9aSx0aGlzLl9yZWNlbnQ9dCx0aGlzLl90aW1lbGluZSYmdGhpcy5fdW5jYWNoZSghMCksdGhpc30sbi5fcmVtb3ZlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQudGltZWxpbmU9PT10aGlzJiYoZXx8dC5fZW5hYmxlZCghMSwhMCksdC5fcHJldj90Ll9wcmV2Ll9uZXh0PXQuX25leHQ6dGhpcy5fZmlyc3Q9PT10JiYodGhpcy5fZmlyc3Q9dC5fbmV4dCksdC5fbmV4dD90Ll9uZXh0Ll9wcmV2PXQuX3ByZXY6dGhpcy5fbGFzdD09PXQmJih0aGlzLl9sYXN0PXQuX3ByZXYpLHQuX25leHQ9dC5fcHJldj10LnRpbWVsaW5lPW51bGwsdD09PXRoaXMuX3JlY2VudCYmKHRoaXMuX3JlY2VudD10aGlzLl9sYXN0KSx0aGlzLl90aW1lbGluZSYmdGhpcy5fdW5jYWNoZSghMCkpLHRoaXN9LG4ucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcyxyPXRoaXMuX2ZpcnN0O2Zvcih0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT10aGlzLl9yYXdQcmV2VGltZT10O3I7KXM9ci5fbmV4dCwoci5fYWN0aXZlfHx0Pj1yLl9zdGFydFRpbWUmJiFyLl9wYXVzZWQpJiYoci5fcmV2ZXJzZWQ/ci5yZW5kZXIoKHIuX2RpcnR5P3IudG90YWxEdXJhdGlvbigpOnIuX3RvdGFsRHVyYXRpb24pLSh0LXIuX3N0YXJ0VGltZSkqci5fdGltZVNjYWxlLGUsaSk6ci5yZW5kZXIoKHQtci5fc3RhcnRUaW1lKSpyLl90aW1lU2NhbGUsZSxpKSkscj1zfSxuLnJhd1RpbWU9ZnVuY3Rpb24oKXtyZXR1cm4gb3x8YS53YWtlKCksdGhpcy5fdG90YWxUaW1lfTt2YXIgRD1nKFwiVHdlZW5MaXRlXCIsZnVuY3Rpb24oZSxpLHMpe2lmKEEuY2FsbCh0aGlzLGkscyksdGhpcy5yZW5kZXI9RC5wcm90b3R5cGUucmVuZGVyLG51bGw9PWUpdGhyb3dcIkNhbm5vdCB0d2VlbiBhIG51bGwgdGFyZ2V0LlwiO3RoaXMudGFyZ2V0PWU9XCJzdHJpbmdcIiE9dHlwZW9mIGU/ZTpELnNlbGVjdG9yKGUpfHxlO3ZhciByLG4sYSxvPWUuanF1ZXJ5fHxlLmxlbmd0aCYmZSE9PXQmJmVbMF0mJihlWzBdPT09dHx8ZVswXS5ub2RlVHlwZSYmZVswXS5zdHlsZSYmIWUubm9kZVR5cGUpLGg9dGhpcy52YXJzLm92ZXJ3cml0ZTtpZih0aGlzLl9vdmVyd3JpdGU9aD1udWxsPT1oP1lbRC5kZWZhdWx0T3ZlcndyaXRlXTpcIm51bWJlclwiPT10eXBlb2YgaD9oPj4wOllbaF0sKG98fGUgaW5zdGFuY2VvZiBBcnJheXx8ZS5wdXNoJiZjKGUpKSYmXCJudW1iZXJcIiE9dHlwZW9mIGVbMF0pZm9yKHRoaXMuX3RhcmdldHM9YT11KGUpLHRoaXMuX3Byb3BMb29rdXA9W10sdGhpcy5fc2libGluZ3M9W10scj0wO2EubGVuZ3RoPnI7cisrKW49YVtyXSxuP1wic3RyaW5nXCIhPXR5cGVvZiBuP24ubGVuZ3RoJiZuIT09dCYmblswXSYmKG5bMF09PT10fHxuWzBdLm5vZGVUeXBlJiZuWzBdLnN0eWxlJiYhbi5ub2RlVHlwZSk/KGEuc3BsaWNlKHItLSwxKSx0aGlzLl90YXJnZXRzPWE9YS5jb25jYXQodShuKSkpOih0aGlzLl9zaWJsaW5nc1tyXT1WKG4sdGhpcywhMSksMT09PWgmJnRoaXMuX3NpYmxpbmdzW3JdLmxlbmd0aD4xJiZXKG4sdGhpcyxudWxsLDEsdGhpcy5fc2libGluZ3Nbcl0pKToobj1hW3ItLV09RC5zZWxlY3RvcihuKSxcInN0cmluZ1wiPT10eXBlb2YgbiYmYS5zcGxpY2UocisxLDEpKTphLnNwbGljZShyLS0sMSk7ZWxzZSB0aGlzLl9wcm9wTG9va3VwPXt9LHRoaXMuX3NpYmxpbmdzPVYoZSx0aGlzLCExKSwxPT09aCYmdGhpcy5fc2libGluZ3MubGVuZ3RoPjEmJlcoZSx0aGlzLG51bGwsMSx0aGlzLl9zaWJsaW5ncyk7KHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXJ8fDA9PT1pJiYwPT09dGhpcy5fZGVsYXkmJnRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIhPT0hMSkmJih0aGlzLl90aW1lPS1fLHRoaXMucmVuZGVyKC10aGlzLl9kZWxheSkpfSwhMCksTT1mdW5jdGlvbihlKXtyZXR1cm4gZSYmZS5sZW5ndGgmJmUhPT10JiZlWzBdJiYoZVswXT09PXR8fGVbMF0ubm9kZVR5cGUmJmVbMF0uc3R5bGUmJiFlLm5vZGVUeXBlKX0sej1mdW5jdGlvbih0LGUpe3ZhciBpLHM9e307Zm9yKGkgaW4gdClVW2ldfHxpIGluIGUmJlwidHJhbnNmb3JtXCIhPT1pJiZcInhcIiE9PWkmJlwieVwiIT09aSYmXCJ3aWR0aFwiIT09aSYmXCJoZWlnaHRcIiE9PWkmJlwiY2xhc3NOYW1lXCIhPT1pJiZcImJvcmRlclwiIT09aXx8ISghTFtpXXx8TFtpXSYmTFtpXS5fYXV0b0NTUyl8fChzW2ldPXRbaV0sZGVsZXRlIHRbaV0pO3QuY3NzPXN9O249RC5wcm90b3R5cGU9bmV3IEEsbi5jb25zdHJ1Y3Rvcj1ELG4ua2lsbCgpLl9nYz0hMSxuLnJhdGlvPTAsbi5fZmlyc3RQVD1uLl90YXJnZXRzPW4uX292ZXJ3cml0dGVuUHJvcHM9bi5fc3RhcnRBdD1udWxsLG4uX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQ9bi5fbGF6eT0hMSxELnZlcnNpb249XCIxLjE0LjFcIixELmRlZmF1bHRFYXNlPW4uX2Vhc2U9bmV3IFQobnVsbCxudWxsLDEsMSksRC5kZWZhdWx0T3ZlcndyaXRlPVwiYXV0b1wiLEQudGlja2VyPWEsRC5hdXRvU2xlZXA9ITAsRC5sYWdTbW9vdGhpbmc9ZnVuY3Rpb24odCxlKXthLmxhZ1Ntb290aGluZyh0LGUpfSxELnNlbGVjdG9yPXQuJHx8dC5qUXVlcnl8fGZ1bmN0aW9uKGUpe3ZhciBpPXQuJHx8dC5qUXVlcnk7cmV0dXJuIGk/KEQuc2VsZWN0b3I9aSxpKGUpKTpcInVuZGVmaW5lZFwiPT10eXBlb2YgZG9jdW1lbnQ/ZTpkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsP2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSk6ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCIjXCI9PT1lLmNoYXJBdCgwKT9lLnN1YnN0cigxKTplKX07dmFyIEk9W10sRT17fSxGPUQuX2ludGVybmFscz17aXNBcnJheTpjLGlzU2VsZWN0b3I6TSxsYXp5VHdlZW5zOkl9LEw9RC5fcGx1Z2lucz17fSxOPUYudHdlZW5Mb29rdXA9e30sWD0wLFU9Ri5yZXNlcnZlZFByb3BzPXtlYXNlOjEsZGVsYXk6MSxvdmVyd3JpdGU6MSxvbkNvbXBsZXRlOjEsb25Db21wbGV0ZVBhcmFtczoxLG9uQ29tcGxldGVTY29wZToxLHVzZUZyYW1lczoxLHJ1bkJhY2t3YXJkczoxLHN0YXJ0QXQ6MSxvblVwZGF0ZToxLG9uVXBkYXRlUGFyYW1zOjEsb25VcGRhdGVTY29wZToxLG9uU3RhcnQ6MSxvblN0YXJ0UGFyYW1zOjEsb25TdGFydFNjb3BlOjEsb25SZXZlcnNlQ29tcGxldGU6MSxvblJldmVyc2VDb21wbGV0ZVBhcmFtczoxLG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6MSxvblJlcGVhdDoxLG9uUmVwZWF0UGFyYW1zOjEsb25SZXBlYXRTY29wZToxLGVhc2VQYXJhbXM6MSx5b3lvOjEsaW1tZWRpYXRlUmVuZGVyOjEscmVwZWF0OjEscmVwZWF0RGVsYXk6MSxkYXRhOjEscGF1c2VkOjEscmV2ZXJzZWQ6MSxhdXRvQ1NTOjEsbGF6eToxLG9uT3ZlcndyaXRlOjF9LFk9e25vbmU6MCxhbGw6MSxhdXRvOjIsY29uY3VycmVudDozLGFsbE9uU3RhcnQ6NCxwcmVleGlzdGluZzo1LFwidHJ1ZVwiOjEsXCJmYWxzZVwiOjB9LGo9QS5fcm9vdEZyYW1lc1RpbWVsaW5lPW5ldyBDLEI9QS5fcm9vdFRpbWVsaW5lPW5ldyBDLHE9Ri5sYXp5UmVuZGVyPWZ1bmN0aW9uKCl7dmFyIHQsZT1JLmxlbmd0aDtmb3IoRT17fTstLWU+LTE7KXQ9SVtlXSx0JiZ0Ll9sYXp5IT09ITEmJih0LnJlbmRlcih0Ll9sYXp5WzBdLHQuX2xhenlbMV0sITApLHQuX2xhenk9ITEpO0kubGVuZ3RoPTB9O0IuX3N0YXJ0VGltZT1hLnRpbWUsai5fc3RhcnRUaW1lPWEuZnJhbWUsQi5fYWN0aXZlPWouX2FjdGl2ZT0hMCxzZXRUaW1lb3V0KHEsMSksQS5fdXBkYXRlUm9vdD1ELnJlbmRlcj1mdW5jdGlvbigpe3ZhciB0LGUsaTtpZihJLmxlbmd0aCYmcSgpLEIucmVuZGVyKChhLnRpbWUtQi5fc3RhcnRUaW1lKSpCLl90aW1lU2NhbGUsITEsITEpLGoucmVuZGVyKChhLmZyYW1lLWouX3N0YXJ0VGltZSkqai5fdGltZVNjYWxlLCExLCExKSxJLmxlbmd0aCYmcSgpLCEoYS5mcmFtZSUxMjApKXtmb3IoaSBpbiBOKXtmb3IoZT1OW2ldLnR3ZWVucyx0PWUubGVuZ3RoOy0tdD4tMTspZVt0XS5fZ2MmJmUuc3BsaWNlKHQsMSk7MD09PWUubGVuZ3RoJiZkZWxldGUgTltpXX1pZihpPUIuX2ZpcnN0LCghaXx8aS5fcGF1c2VkKSYmRC5hdXRvU2xlZXAmJiFqLl9maXJzdCYmMT09PWEuX2xpc3RlbmVycy50aWNrLmxlbmd0aCl7Zm9yKDtpJiZpLl9wYXVzZWQ7KWk9aS5fbmV4dDtpfHxhLnNsZWVwKCl9fX0sYS5hZGRFdmVudExpc3RlbmVyKFwidGlja1wiLEEuX3VwZGF0ZVJvb3QpO3ZhciBWPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcyxyLG49dC5fZ3NUd2VlbklEO2lmKE5bbnx8KHQuX2dzVHdlZW5JRD1uPVwidFwiK1grKyldfHwoTltuXT17dGFyZ2V0OnQsdHdlZW5zOltdfSksZSYmKHM9TltuXS50d2VlbnMsc1tyPXMubGVuZ3RoXT1lLGkpKWZvcig7LS1yPi0xOylzW3JdPT09ZSYmcy5zcGxpY2UociwxKTtyZXR1cm4gTltuXS50d2VlbnN9LEc9ZnVuY3Rpb24odCxlLGkscyl7dmFyIHI9dC52YXJzLm9uT3ZlcndyaXRlO3ImJnIodCxlLGkscykscj1ELm9uT3ZlcndyaXRlLHImJnIodCxlLGkscyl9LFc9ZnVuY3Rpb24odCxlLGkscyxyKXt2YXIgbixhLG8saDtpZigxPT09c3x8cz49NCl7Zm9yKGg9ci5sZW5ndGgsbj0wO2g+bjtuKyspaWYoKG89cltuXSkhPT1lKW8uX2djfHwoby5fZW5hYmxlZCghMSwhMSkmJihhPSEwKSxHKG8sZSkpO2Vsc2UgaWYoNT09PXMpYnJlYWs7cmV0dXJuIGF9dmFyIGwsdT1lLl9zdGFydFRpbWUrXyxwPVtdLGM9MCxmPTA9PT1lLl9kdXJhdGlvbjtmb3Iobj1yLmxlbmd0aDstLW4+LTE7KShvPXJbbl0pPT09ZXx8by5fZ2N8fG8uX3BhdXNlZHx8KG8uX3RpbWVsaW5lIT09ZS5fdGltZWxpbmU/KGw9bHx8UShlLDAsZiksMD09PVEobyxsLGYpJiYocFtjKytdPW8pKTp1Pj1vLl9zdGFydFRpbWUmJm8uX3N0YXJ0VGltZStvLnRvdGFsRHVyYXRpb24oKS9vLl90aW1lU2NhbGU+dSYmKChmfHwhby5faW5pdHRlZCkmJjJlLTEwPj11LW8uX3N0YXJ0VGltZXx8KHBbYysrXT1vKSkpO2ZvcihuPWM7LS1uPi0xOylvPXBbbl0sMj09PXMmJm8uX2tpbGwoaSx0LGUpJiYoYT0hMCksKDIhPT1zfHwhby5fZmlyc3RQVCYmby5faW5pdHRlZCkmJihvLl9lbmFibGVkKCExLCExKSYmKGE9ITApLDIhPT1zJiZHKG8sZSkpO3JldHVybiBhfSxRPWZ1bmN0aW9uKHQsZSxpKXtmb3IodmFyIHM9dC5fdGltZWxpbmUscj1zLl90aW1lU2NhbGUsbj10Ll9zdGFydFRpbWU7cy5fdGltZWxpbmU7KXtpZihuKz1zLl9zdGFydFRpbWUscio9cy5fdGltZVNjYWxlLHMuX3BhdXNlZClyZXR1cm4tMTAwO3M9cy5fdGltZWxpbmV9cmV0dXJuIG4vPXIsbj5lP24tZTppJiZuPT09ZXx8IXQuX2luaXR0ZWQmJjIqXz5uLWU/Xzoobis9dC50b3RhbER1cmF0aW9uKCkvdC5fdGltZVNjYWxlL3IpPmUrXz8wOm4tZS1ffTtuLl9pbml0PWZ1bmN0aW9uKCl7dmFyIHQsZSxpLHMscixuPXRoaXMudmFycyxhPXRoaXMuX292ZXJ3cml0dGVuUHJvcHMsbz10aGlzLl9kdXJhdGlvbixoPSEhbi5pbW1lZGlhdGVSZW5kZXIsbD1uLmVhc2U7aWYobi5zdGFydEF0KXt0aGlzLl9zdGFydEF0JiYodGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsITApLHRoaXMuX3N0YXJ0QXQua2lsbCgpKSxyPXt9O2ZvcihzIGluIG4uc3RhcnRBdClyW3NdPW4uc3RhcnRBdFtzXTtpZihyLm92ZXJ3cml0ZT0hMSxyLmltbWVkaWF0ZVJlbmRlcj0hMCxyLmxhenk9aCYmbi5sYXp5IT09ITEsci5zdGFydEF0PXIuZGVsYXk9bnVsbCx0aGlzLl9zdGFydEF0PUQudG8odGhpcy50YXJnZXQsMCxyKSxoKWlmKHRoaXMuX3RpbWU+MCl0aGlzLl9zdGFydEF0PW51bGw7ZWxzZSBpZigwIT09bylyZXR1cm59ZWxzZSBpZihuLnJ1bkJhY2t3YXJkcyYmMCE9PW8paWYodGhpcy5fc3RhcnRBdCl0aGlzLl9zdGFydEF0LnJlbmRlcigtMSwhMCksdGhpcy5fc3RhcnRBdC5raWxsKCksdGhpcy5fc3RhcnRBdD1udWxsO2Vsc2V7MCE9PXRoaXMuX3RpbWUmJihoPSExKSxpPXt9O2ZvcihzIGluIG4pVVtzXSYmXCJhdXRvQ1NTXCIhPT1zfHwoaVtzXT1uW3NdKTtpZihpLm92ZXJ3cml0ZT0wLGkuZGF0YT1cImlzRnJvbVN0YXJ0XCIsaS5sYXp5PWgmJm4ubGF6eSE9PSExLGkuaW1tZWRpYXRlUmVuZGVyPWgsdGhpcy5fc3RhcnRBdD1ELnRvKHRoaXMudGFyZ2V0LDAsaSksaCl7aWYoMD09PXRoaXMuX3RpbWUpcmV0dXJufWVsc2UgdGhpcy5fc3RhcnRBdC5faW5pdCgpLHRoaXMuX3N0YXJ0QXQuX2VuYWJsZWQoITEpLHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXImJih0aGlzLl9zdGFydEF0PW51bGwpfWlmKHRoaXMuX2Vhc2U9bD1sP2wgaW5zdGFuY2VvZiBUP2w6XCJmdW5jdGlvblwiPT10eXBlb2YgbD9uZXcgVChsLG4uZWFzZVBhcmFtcyk6d1tsXXx8RC5kZWZhdWx0RWFzZTpELmRlZmF1bHRFYXNlLG4uZWFzZVBhcmFtcyBpbnN0YW5jZW9mIEFycmF5JiZsLmNvbmZpZyYmKHRoaXMuX2Vhc2U9bC5jb25maWcuYXBwbHkobCxuLmVhc2VQYXJhbXMpKSx0aGlzLl9lYXNlVHlwZT10aGlzLl9lYXNlLl90eXBlLHRoaXMuX2Vhc2VQb3dlcj10aGlzLl9lYXNlLl9wb3dlcix0aGlzLl9maXJzdFBUPW51bGwsdGhpcy5fdGFyZ2V0cylmb3IodD10aGlzLl90YXJnZXRzLmxlbmd0aDstLXQ+LTE7KXRoaXMuX2luaXRQcm9wcyh0aGlzLl90YXJnZXRzW3RdLHRoaXMuX3Byb3BMb29rdXBbdF09e30sdGhpcy5fc2libGluZ3NbdF0sYT9hW3RdOm51bGwpJiYoZT0hMCk7ZWxzZSBlPXRoaXMuX2luaXRQcm9wcyh0aGlzLnRhcmdldCx0aGlzLl9wcm9wTG9va3VwLHRoaXMuX3NpYmxpbmdzLGEpO2lmKGUmJkQuX29uUGx1Z2luRXZlbnQoXCJfb25Jbml0QWxsUHJvcHNcIix0aGlzKSxhJiYodGhpcy5fZmlyc3RQVHx8XCJmdW5jdGlvblwiIT10eXBlb2YgdGhpcy50YXJnZXQmJnRoaXMuX2VuYWJsZWQoITEsITEpKSxuLnJ1bkJhY2t3YXJkcylmb3IoaT10aGlzLl9maXJzdFBUO2k7KWkucys9aS5jLGkuYz0taS5jLGk9aS5fbmV4dDt0aGlzLl9vblVwZGF0ZT1uLm9uVXBkYXRlLHRoaXMuX2luaXR0ZWQ9ITB9LG4uX2luaXRQcm9wcz1mdW5jdGlvbihlLGkscyxyKXt2YXIgbixhLG8saCxsLF87aWYobnVsbD09ZSlyZXR1cm4hMTtFW2UuX2dzVHdlZW5JRF0mJnEoKSx0aGlzLnZhcnMuY3NzfHxlLnN0eWxlJiZlIT09dCYmZS5ub2RlVHlwZSYmTC5jc3MmJnRoaXMudmFycy5hdXRvQ1NTIT09ITEmJnoodGhpcy52YXJzLGUpO2ZvcihuIGluIHRoaXMudmFycyl7aWYoXz10aGlzLnZhcnNbbl0sVVtuXSlfJiYoXyBpbnN0YW5jZW9mIEFycmF5fHxfLnB1c2gmJmMoXykpJiYtMSE9PV8uam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpJiYodGhpcy52YXJzW25dPV89dGhpcy5fc3dhcFNlbGZJblBhcmFtcyhfLHRoaXMpKTtlbHNlIGlmKExbbl0mJihoPW5ldyBMW25dKS5fb25Jbml0VHdlZW4oZSx0aGlzLnZhcnNbbl0sdGhpcykpe2Zvcih0aGlzLl9maXJzdFBUPWw9e19uZXh0OnRoaXMuX2ZpcnN0UFQsdDpoLHA6XCJzZXRSYXRpb1wiLHM6MCxjOjEsZjohMCxuOm4scGc6ITAscHI6aC5fcHJpb3JpdHl9LGE9aC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoOy0tYT4tMTspaVtoLl9vdmVyd3JpdGVQcm9wc1thXV09dGhpcy5fZmlyc3RQVDsoaC5fcHJpb3JpdHl8fGguX29uSW5pdEFsbFByb3BzKSYmKG89ITApLChoLl9vbkRpc2FibGV8fGguX29uRW5hYmxlKSYmKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQ9ITApfWVsc2UgdGhpcy5fZmlyc3RQVD1pW25dPWw9e19uZXh0OnRoaXMuX2ZpcnN0UFQsdDplLHA6bixmOlwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl0sbjpuLHBnOiExLHByOjB9LGwucz1sLmY/ZVtuLmluZGV4T2YoXCJzZXRcIil8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGVbXCJnZXRcIituLnN1YnN0cigzKV0/bjpcImdldFwiK24uc3Vic3RyKDMpXSgpOnBhcnNlRmxvYXQoZVtuXSksbC5jPVwic3RyaW5nXCI9PXR5cGVvZiBfJiZcIj1cIj09PV8uY2hhckF0KDEpP3BhcnNlSW50KF8uY2hhckF0KDApK1wiMVwiLDEwKSpOdW1iZXIoXy5zdWJzdHIoMikpOk51bWJlcihfKS1sLnN8fDA7bCYmbC5fbmV4dCYmKGwuX25leHQuX3ByZXY9bCl9cmV0dXJuIHImJnRoaXMuX2tpbGwocixlKT90aGlzLl9pbml0UHJvcHMoZSxpLHMscik6dGhpcy5fb3ZlcndyaXRlPjEmJnRoaXMuX2ZpcnN0UFQmJnMubGVuZ3RoPjEmJlcoZSx0aGlzLGksdGhpcy5fb3ZlcndyaXRlLHMpPyh0aGlzLl9raWxsKGksZSksdGhpcy5faW5pdFByb3BzKGUsaSxzLHIpKToodGhpcy5fZmlyc3RQVCYmKHRoaXMudmFycy5sYXp5IT09ITEmJnRoaXMuX2R1cmF0aW9ufHx0aGlzLnZhcnMubGF6eSYmIXRoaXMuX2R1cmF0aW9uKSYmKEVbZS5fZ3NUd2VlbklEXT0hMCksbyl9LG4ucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcyxyLG4sYSxvPXRoaXMuX3RpbWUsaD10aGlzLl9kdXJhdGlvbixsPXRoaXMuX3Jhd1ByZXZUaW1lO2lmKHQ+PWgpdGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9aCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygxKToxLHRoaXMuX3JldmVyc2VkfHwocz0hMCxyPVwib25Db21wbGV0ZVwiKSwwPT09aCYmKHRoaXMuX2luaXR0ZWR8fCF0aGlzLnZhcnMubGF6eXx8aSkmJih0aGlzLl9zdGFydFRpbWU9PT10aGlzLl90aW1lbGluZS5fZHVyYXRpb24mJih0PTApLCgwPT09dHx8MD5sfHxsPT09XykmJmwhPT10JiYoaT0hMCxsPl8mJihyPVwib25SZXZlcnNlQ29tcGxldGVcIikpLHRoaXMuX3Jhd1ByZXZUaW1lPWE9IWV8fHR8fGw9PT10P3Q6Xyk7ZWxzZSBpZigxZS03PnQpdGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9MCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygwKTowLCgwIT09b3x8MD09PWgmJmw+MCYmbCE9PV8pJiYocj1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIscz10aGlzLl9yZXZlcnNlZCksMD50JiYodGhpcy5fYWN0aXZlPSExLDA9PT1oJiYodGhpcy5faW5pdHRlZHx8IXRoaXMudmFycy5sYXp5fHxpKSYmKGw+PTAmJihpPSEwKSx0aGlzLl9yYXdQcmV2VGltZT1hPSFlfHx0fHxsPT09dD90Ol8pKSx0aGlzLl9pbml0dGVkfHwoaT0hMCk7ZWxzZSBpZih0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT10LHRoaXMuX2Vhc2VUeXBlKXt2YXIgdT10L2gscD10aGlzLl9lYXNlVHlwZSxjPXRoaXMuX2Vhc2VQb3dlcjsoMT09PXB8fDM9PT1wJiZ1Pj0uNSkmJih1PTEtdSksMz09PXAmJih1Kj0yKSwxPT09Yz91Kj11OjI9PT1jP3UqPXUqdTozPT09Yz91Kj11KnUqdTo0PT09YyYmKHUqPXUqdSp1KnUpLHRoaXMucmF0aW89MT09PXA/MS11OjI9PT1wP3U6LjU+dC9oP3UvMjoxLXUvMn1lbHNlIHRoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbyh0L2gpO2lmKHRoaXMuX3RpbWUhPT1vfHxpKXtpZighdGhpcy5faW5pdHRlZCl7aWYodGhpcy5faW5pdCgpLCF0aGlzLl9pbml0dGVkfHx0aGlzLl9nYylyZXR1cm47aWYoIWkmJnRoaXMuX2ZpcnN0UFQmJih0aGlzLnZhcnMubGF6eSE9PSExJiZ0aGlzLl9kdXJhdGlvbnx8dGhpcy52YXJzLmxhenkmJiF0aGlzLl9kdXJhdGlvbikpcmV0dXJuIHRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lPW8sdGhpcy5fcmF3UHJldlRpbWU9bCxJLnB1c2godGhpcyksdGhpcy5fbGF6eT1bdCxlXSx2b2lkIDA7dGhpcy5fdGltZSYmIXM/dGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUvaCk6cyYmdGhpcy5fZWFzZS5fY2FsY0VuZCYmKHRoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbygwPT09dGhpcy5fdGltZT8wOjEpKX1mb3IodGhpcy5fbGF6eSE9PSExJiYodGhpcy5fbGF6eT0hMSksdGhpcy5fYWN0aXZlfHwhdGhpcy5fcGF1c2VkJiZ0aGlzLl90aW1lIT09byYmdD49MCYmKHRoaXMuX2FjdGl2ZT0hMCksMD09PW8mJih0aGlzLl9zdGFydEF0JiYodD49MD90aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSk6cnx8KHI9XCJfZHVtbXlHU1wiKSksdGhpcy52YXJzLm9uU3RhcnQmJigwIT09dGhpcy5fdGltZXx8MD09PWgpJiYoZXx8dGhpcy52YXJzLm9uU3RhcnQuYXBwbHkodGhpcy52YXJzLm9uU3RhcnRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25TdGFydFBhcmFtc3x8eSkpKSxuPXRoaXMuX2ZpcnN0UFQ7bjspbi5mP24udFtuLnBdKG4uYyp0aGlzLnJhdGlvK24ucyk6bi50W24ucF09bi5jKnRoaXMucmF0aW8rbi5zLG49bi5fbmV4dDt0aGlzLl9vblVwZGF0ZSYmKDA+dCYmdGhpcy5fc3RhcnRBdCYmdCE9PS0xZS00JiZ0aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSksZXx8KHRoaXMuX3RpbWUhPT1vfHxzKSYmdGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHx5KSksciYmKCF0aGlzLl9nY3x8aSkmJigwPnQmJnRoaXMuX3N0YXJ0QXQmJiF0aGlzLl9vblVwZGF0ZSYmdCE9PS0xZS00JiZ0aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSkscyYmKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiYmdGhpcy5fZW5hYmxlZCghMSwhMSksdGhpcy5fYWN0aXZlPSExKSwhZSYmdGhpcy52YXJzW3JdJiZ0aGlzLnZhcnNbcl0uYXBwbHkodGhpcy52YXJzW3IrXCJTY29wZVwiXXx8dGhpcyx0aGlzLnZhcnNbcitcIlBhcmFtc1wiXXx8eSksMD09PWgmJnRoaXMuX3Jhd1ByZXZUaW1lPT09XyYmYSE9PV8mJih0aGlzLl9yYXdQcmV2VGltZT0wKSl9fSxuLl9raWxsPWZ1bmN0aW9uKHQsZSxpKXtpZihcImFsbFwiPT09dCYmKHQ9bnVsbCksbnVsbD09dCYmKG51bGw9PWV8fGU9PT10aGlzLnRhcmdldCkpcmV0dXJuIHRoaXMuX2xhenk9ITEsdGhpcy5fZW5hYmxlZCghMSwhMSk7ZT1cInN0cmluZ1wiIT10eXBlb2YgZT9lfHx0aGlzLl90YXJnZXRzfHx0aGlzLnRhcmdldDpELnNlbGVjdG9yKGUpfHxlO3ZhciBzLHIsbixhLG8saCxsLF8sdTtpZigoYyhlKXx8TShlKSkmJlwibnVtYmVyXCIhPXR5cGVvZiBlWzBdKWZvcihzPWUubGVuZ3RoOy0tcz4tMTspdGhpcy5fa2lsbCh0LGVbc10pJiYoaD0hMCk7ZWxzZXtpZih0aGlzLl90YXJnZXRzKXtmb3Iocz10aGlzLl90YXJnZXRzLmxlbmd0aDstLXM+LTE7KWlmKGU9PT10aGlzLl90YXJnZXRzW3NdKXtvPXRoaXMuX3Byb3BMb29rdXBbc118fHt9LHRoaXMuX292ZXJ3cml0dGVuUHJvcHM9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc3x8W10scj10aGlzLl9vdmVyd3JpdHRlblByb3BzW3NdPXQ/dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tzXXx8e306XCJhbGxcIjticmVha319ZWxzZXtpZihlIT09dGhpcy50YXJnZXQpcmV0dXJuITE7bz10aGlzLl9wcm9wTG9va3VwLHI9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcz10P3RoaXMuX292ZXJ3cml0dGVuUHJvcHN8fHt9OlwiYWxsXCJ9aWYobyl7bD10fHxvLF89dCE9PXImJlwiYWxsXCIhPT1yJiZ0IT09byYmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHwhdC5fdGVtcEtpbGwpO2ZvcihuIGluIGwpKGE9b1tuXSkmJih1fHwodT1bXSksdS5wdXNoKG4pLGEucGcmJmEudC5fa2lsbChsKSYmKGg9ITApLGEucGcmJjAhPT1hLnQuX292ZXJ3cml0ZVByb3BzLmxlbmd0aHx8KGEuX3ByZXY/YS5fcHJldi5fbmV4dD1hLl9uZXh0OmE9PT10aGlzLl9maXJzdFBUJiYodGhpcy5fZmlyc3RQVD1hLl9uZXh0KSxhLl9uZXh0JiYoYS5fbmV4dC5fcHJldj1hLl9wcmV2KSxhLl9uZXh0PWEuX3ByZXY9bnVsbCksZGVsZXRlIG9bbl0pLF8mJihyW25dPTEpO1xuIXRoaXMuX2ZpcnN0UFQmJnRoaXMuX2luaXR0ZWQmJnRoaXMuX2VuYWJsZWQoITEsITEpLHUmJmkmJkcodGhpcyxpLGUsdSl9fXJldHVybiBofSxuLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCYmRC5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIix0aGlzKSx0aGlzLl9maXJzdFBUPXRoaXMuX292ZXJ3cml0dGVuUHJvcHM9dGhpcy5fc3RhcnRBdD10aGlzLl9vblVwZGF0ZT1udWxsLHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQ9dGhpcy5fYWN0aXZlPXRoaXMuX2xhenk9ITEsdGhpcy5fcHJvcExvb2t1cD10aGlzLl90YXJnZXRzP3t9OltdLEEucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKSx0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyJiYodGhpcy5fdGltZT0tXyx0aGlzLnJlbmRlcigtdGhpcy5fZGVsYXkpKSx0aGlzfSxuLl9lbmFibGVkPWZ1bmN0aW9uKHQsZSl7aWYob3x8YS53YWtlKCksdCYmdGhpcy5fZ2Mpe3ZhciBpLHM9dGhpcy5fdGFyZ2V0cztpZihzKWZvcihpPXMubGVuZ3RoOy0taT4tMTspdGhpcy5fc2libGluZ3NbaV09VihzW2ldLHRoaXMsITApO2Vsc2UgdGhpcy5fc2libGluZ3M9Vih0aGlzLnRhcmdldCx0aGlzLCEwKX1yZXR1cm4gQS5wcm90b3R5cGUuX2VuYWJsZWQuY2FsbCh0aGlzLHQsZSksdGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCYmdGhpcy5fZmlyc3RQVD9ELl9vblBsdWdpbkV2ZW50KHQ/XCJfb25FbmFibGVcIjpcIl9vbkRpc2FibGVcIix0aGlzKTohMX0sRC50bz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIG5ldyBEKHQsZSxpKX0sRC5mcm9tPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gaS5ydW5CYWNrd2FyZHM9ITAsaS5pbW1lZGlhdGVSZW5kZXI9MCE9aS5pbW1lZGlhdGVSZW5kZXIsbmV3IEQodCxlLGkpfSxELmZyb21Ubz1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gcy5zdGFydEF0PWkscy5pbW1lZGlhdGVSZW5kZXI9MCE9cy5pbW1lZGlhdGVSZW5kZXImJjAhPWkuaW1tZWRpYXRlUmVuZGVyLG5ldyBEKHQsZSxzKX0sRC5kZWxheWVkQ2FsbD1mdW5jdGlvbih0LGUsaSxzLHIpe3JldHVybiBuZXcgRChlLDAse2RlbGF5OnQsb25Db21wbGV0ZTplLG9uQ29tcGxldGVQYXJhbXM6aSxvbkNvbXBsZXRlU2NvcGU6cyxvblJldmVyc2VDb21wbGV0ZTplLG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOmksb25SZXZlcnNlQ29tcGxldGVTY29wZTpzLGltbWVkaWF0ZVJlbmRlcjohMSx1c2VGcmFtZXM6cixvdmVyd3JpdGU6MH0pfSxELnNldD1mdW5jdGlvbih0LGUpe3JldHVybiBuZXcgRCh0LDAsZSl9LEQuZ2V0VHdlZW5zT2Y9ZnVuY3Rpb24odCxlKXtpZihudWxsPT10KXJldHVybltdO3Q9XCJzdHJpbmdcIiE9dHlwZW9mIHQ/dDpELnNlbGVjdG9yKHQpfHx0O3ZhciBpLHMscixuO2lmKChjKHQpfHxNKHQpKSYmXCJudW1iZXJcIiE9dHlwZW9mIHRbMF0pe2ZvcihpPXQubGVuZ3RoLHM9W107LS1pPi0xOylzPXMuY29uY2F0KEQuZ2V0VHdlZW5zT2YodFtpXSxlKSk7Zm9yKGk9cy5sZW5ndGg7LS1pPi0xOylmb3Iobj1zW2ldLHI9aTstLXI+LTE7KW49PT1zW3JdJiZzLnNwbGljZShpLDEpfWVsc2UgZm9yKHM9Vih0KS5jb25jYXQoKSxpPXMubGVuZ3RoOy0taT4tMTspKHNbaV0uX2djfHxlJiYhc1tpXS5pc0FjdGl2ZSgpKSYmcy5zcGxpY2UoaSwxKTtyZXR1cm4gc30sRC5raWxsVHdlZW5zT2Y9RC5raWxsRGVsYXllZENhbGxzVG89ZnVuY3Rpb24odCxlLGkpe1wib2JqZWN0XCI9PXR5cGVvZiBlJiYoaT1lLGU9ITEpO2Zvcih2YXIgcz1ELmdldFR3ZWVuc09mKHQsZSkscj1zLmxlbmd0aDstLXI+LTE7KXNbcl0uX2tpbGwoaSx0KX07dmFyIFo9ZyhcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixmdW5jdGlvbih0LGUpe3RoaXMuX292ZXJ3cml0ZVByb3BzPSh0fHxcIlwiKS5zcGxpdChcIixcIiksdGhpcy5fcHJvcE5hbWU9dGhpcy5fb3ZlcndyaXRlUHJvcHNbMF0sdGhpcy5fcHJpb3JpdHk9ZXx8MCx0aGlzLl9zdXBlcj1aLnByb3RvdHlwZX0sITApO2lmKG49Wi5wcm90b3R5cGUsWi52ZXJzaW9uPVwiMS4xMC4xXCIsWi5BUEk9MixuLl9maXJzdFBUPW51bGwsbi5fYWRkVHdlZW49ZnVuY3Rpb24odCxlLGkscyxyLG4pe3ZhciBhLG87cmV0dXJuIG51bGwhPXMmJihhPVwibnVtYmVyXCI9PXR5cGVvZiBzfHxcIj1cIiE9PXMuY2hhckF0KDEpP051bWJlcihzKS1pOnBhcnNlSW50KHMuY2hhckF0KDApK1wiMVwiLDEwKSpOdW1iZXIocy5zdWJzdHIoMikpKT8odGhpcy5fZmlyc3RQVD1vPXtfbmV4dDp0aGlzLl9maXJzdFBULHQ6dCxwOmUsczppLGM6YSxmOlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZV0sbjpyfHxlLHI6bn0sby5fbmV4dCYmKG8uX25leHQuX3ByZXY9byksbyk6dm9pZCAwfSxuLnNldFJhdGlvPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxpPXRoaXMuX2ZpcnN0UFQscz0xZS02O2k7KWU9aS5jKnQraS5zLGkucj9lPU1hdGgucm91bmQoZSk6cz5lJiZlPi1zJiYoZT0wKSxpLmY/aS50W2kucF0oZSk6aS50W2kucF09ZSxpPWkuX25leHR9LG4uX2tpbGw9ZnVuY3Rpb24odCl7dmFyIGUsaT10aGlzLl9vdmVyd3JpdGVQcm9wcyxzPXRoaXMuX2ZpcnN0UFQ7aWYobnVsbCE9dFt0aGlzLl9wcm9wTmFtZV0pdGhpcy5fb3ZlcndyaXRlUHJvcHM9W107ZWxzZSBmb3IoZT1pLmxlbmd0aDstLWU+LTE7KW51bGwhPXRbaVtlXV0mJmkuc3BsaWNlKGUsMSk7Zm9yKDtzOyludWxsIT10W3Mubl0mJihzLl9uZXh0JiYocy5fbmV4dC5fcHJldj1zLl9wcmV2KSxzLl9wcmV2PyhzLl9wcmV2Ll9uZXh0PXMuX25leHQscy5fcHJldj1udWxsKTp0aGlzLl9maXJzdFBUPT09cyYmKHRoaXMuX2ZpcnN0UFQ9cy5fbmV4dCkpLHM9cy5fbmV4dDtyZXR1cm4hMX0sbi5fcm91bmRQcm9wcz1mdW5jdGlvbih0LGUpe2Zvcih2YXIgaT10aGlzLl9maXJzdFBUO2k7KSh0W3RoaXMuX3Byb3BOYW1lXXx8bnVsbCE9aS5uJiZ0W2kubi5zcGxpdCh0aGlzLl9wcm9wTmFtZStcIl9cIikuam9pbihcIlwiKV0pJiYoaS5yPWUpLGk9aS5fbmV4dH0sRC5fb25QbHVnaW5FdmVudD1mdW5jdGlvbih0LGUpe3ZhciBpLHMscixuLGEsbz1lLl9maXJzdFBUO2lmKFwiX29uSW5pdEFsbFByb3BzXCI9PT10KXtmb3IoO287KXtmb3IoYT1vLl9uZXh0LHM9cjtzJiZzLnByPm8ucHI7KXM9cy5fbmV4dDsoby5fcHJldj1zP3MuX3ByZXY6bik/by5fcHJldi5fbmV4dD1vOnI9bywoby5fbmV4dD1zKT9zLl9wcmV2PW86bj1vLG89YX1vPWUuX2ZpcnN0UFQ9cn1mb3IoO287KW8ucGcmJlwiZnVuY3Rpb25cIj09dHlwZW9mIG8udFt0XSYmby50W3RdKCkmJihpPSEwKSxvPW8uX25leHQ7cmV0dXJuIGl9LFouYWN0aXZhdGU9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQubGVuZ3RoOy0tZT4tMTspdFtlXS5BUEk9PT1aLkFQSSYmKExbKG5ldyB0W2VdKS5fcHJvcE5hbWVdPXRbZV0pO3JldHVybiEwfSxkLnBsdWdpbj1mdW5jdGlvbih0KXtpZighKHQmJnQucHJvcE5hbWUmJnQuaW5pdCYmdC5BUEkpKXRocm93XCJpbGxlZ2FsIHBsdWdpbiBkZWZpbml0aW9uLlwiO3ZhciBlLGk9dC5wcm9wTmFtZSxzPXQucHJpb3JpdHl8fDAscj10Lm92ZXJ3cml0ZVByb3BzLG49e2luaXQ6XCJfb25Jbml0VHdlZW5cIixzZXQ6XCJzZXRSYXRpb1wiLGtpbGw6XCJfa2lsbFwiLHJvdW5kOlwiX3JvdW5kUHJvcHNcIixpbml0QWxsOlwiX29uSW5pdEFsbFByb3BzXCJ9LGE9ZyhcInBsdWdpbnMuXCIraS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStpLnN1YnN0cigxKStcIlBsdWdpblwiLGZ1bmN0aW9uKCl7Wi5jYWxsKHRoaXMsaSxzKSx0aGlzLl9vdmVyd3JpdGVQcm9wcz1yfHxbXX0sdC5nbG9iYWw9PT0hMCksbz1hLnByb3RvdHlwZT1uZXcgWihpKTtvLmNvbnN0cnVjdG9yPWEsYS5BUEk9dC5BUEk7Zm9yKGUgaW4gbilcImZ1bmN0aW9uXCI9PXR5cGVvZiB0W2VdJiYob1tuW2VdXT10W2VdKTtyZXR1cm4gYS52ZXJzaW9uPXQudmVyc2lvbixaLmFjdGl2YXRlKFthXSksYX0scz10Ll9nc1F1ZXVlKXtmb3Iocj0wO3MubGVuZ3RoPnI7cisrKXNbcl0oKTtmb3IobiBpbiBmKWZbbl0uZnVuY3x8dC5jb25zb2xlLmxvZyhcIkdTQVAgZW5jb3VudGVyZWQgbWlzc2luZyBkZXBlbmRlbmN5OiBjb20uZ3JlZW5zb2NrLlwiK24pfW89ITF9fShcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpc3x8d2luZG93LFwiVHdlZW5NYXhcIik7XG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBUd2Vlbk1heCAhPSBcInVuZGVmaW5lZFwiID8gVHdlZW5NYXggOiB3aW5kb3cuVHdlZW5NYXgpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qIVxuICogVkVSU0lPTjogMS43LjRcbiAqIERBVEU6IDIwMTQtMDctMTdcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly93d3cuZ3JlZW5zb2NrLmNvbVxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE0LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL3d3dy5ncmVlbnNvY2suY29tL3Rlcm1zX29mX3VzZS5odG1sIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICoqL1xudmFyIF9nc1Njb3BlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzfHx3aW5kb3c7KF9nc1Njb3BlLl9nc1F1ZXVlfHwoX2dzU2NvcGUuX2dzUXVldWU9W10pKS5wdXNoKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHQ9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LGU9d2luZG93LGk9ZnVuY3Rpb24oaSxyKXt2YXIgcz1cInhcIj09PXI/XCJXaWR0aFwiOlwiSGVpZ2h0XCIsbj1cInNjcm9sbFwiK3Msbz1cImNsaWVudFwiK3MsYT1kb2N1bWVudC5ib2R5O3JldHVybiBpPT09ZXx8aT09PXR8fGk9PT1hP01hdGgubWF4KHRbbl0sYVtuXSktKGVbXCJpbm5lclwiK3NdfHxNYXRoLm1heCh0W29dLGFbb10pKTppW25dLWlbXCJvZmZzZXRcIitzXX0scj1fZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtwcm9wTmFtZTpcInNjcm9sbFRvXCIsQVBJOjIsdmVyc2lvbjpcIjEuNy40XCIsaW5pdDpmdW5jdGlvbih0LHIscyl7cmV0dXJuIHRoaXMuX3dkdz10PT09ZSx0aGlzLl90YXJnZXQ9dCx0aGlzLl90d2Vlbj1zLFwib2JqZWN0XCIhPXR5cGVvZiByJiYocj17eTpyfSksdGhpcy52YXJzPXIsdGhpcy5fYXV0b0tpbGw9ci5hdXRvS2lsbCE9PSExLHRoaXMueD10aGlzLnhQcmV2PXRoaXMuZ2V0WCgpLHRoaXMueT10aGlzLnlQcmV2PXRoaXMuZ2V0WSgpLG51bGwhPXIueD8odGhpcy5fYWRkVHdlZW4odGhpcyxcInhcIix0aGlzLngsXCJtYXhcIj09PXIueD9pKHQsXCJ4XCIpOnIueCxcInNjcm9sbFRvX3hcIiwhMCksdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChcInNjcm9sbFRvX3hcIikpOnRoaXMuc2tpcFg9ITAsbnVsbCE9ci55Pyh0aGlzLl9hZGRUd2Vlbih0aGlzLFwieVwiLHRoaXMueSxcIm1heFwiPT09ci55P2kodCxcInlcIik6ci55LFwic2Nyb2xsVG9feVwiLCEwKSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKFwic2Nyb2xsVG9feVwiKSk6dGhpcy5za2lwWT0hMCwhMH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcyx0KTt2YXIgcj10aGlzLl93ZHd8fCF0aGlzLnNraXBYP3RoaXMuZ2V0WCgpOnRoaXMueFByZXYscz10aGlzLl93ZHd8fCF0aGlzLnNraXBZP3RoaXMuZ2V0WSgpOnRoaXMueVByZXYsbj1zLXRoaXMueVByZXYsbz1yLXRoaXMueFByZXY7dGhpcy5fYXV0b0tpbGwmJighdGhpcy5za2lwWCYmKG8+N3x8LTc+bykmJmkodGhpcy5fdGFyZ2V0LFwieFwiKT5yJiYodGhpcy5za2lwWD0hMCksIXRoaXMuc2tpcFkmJihuPjd8fC03Pm4pJiZpKHRoaXMuX3RhcmdldCxcInlcIik+cyYmKHRoaXMuc2tpcFk9ITApLHRoaXMuc2tpcFgmJnRoaXMuc2tpcFkmJih0aGlzLl90d2Vlbi5raWxsKCksdGhpcy52YXJzLm9uQXV0b0tpbGwmJnRoaXMudmFycy5vbkF1dG9LaWxsLmFwcGx5KHRoaXMudmFycy5vbkF1dG9LaWxsU2NvcGV8fHRoaXMuX3R3ZWVuLHRoaXMudmFycy5vbkF1dG9LaWxsUGFyYW1zfHxbXSkpKSx0aGlzLl93ZHc/ZS5zY3JvbGxUbyh0aGlzLnNraXBYP3I6dGhpcy54LHRoaXMuc2tpcFk/czp0aGlzLnkpOih0aGlzLnNraXBZfHwodGhpcy5fdGFyZ2V0LnNjcm9sbFRvcD10aGlzLnkpLHRoaXMuc2tpcFh8fCh0aGlzLl90YXJnZXQuc2Nyb2xsTGVmdD10aGlzLngpKSx0aGlzLnhQcmV2PXRoaXMueCx0aGlzLnlQcmV2PXRoaXMueX19KSxzPXIucHJvdG90eXBlO3IubWF4PWkscy5nZXRYPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dkdz9udWxsIT1lLnBhZ2VYT2Zmc2V0P2UucGFnZVhPZmZzZXQ6bnVsbCE9dC5zY3JvbGxMZWZ0P3Quc2Nyb2xsTGVmdDpkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ6dGhpcy5fdGFyZ2V0LnNjcm9sbExlZnR9LHMuZ2V0WT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl93ZHc/bnVsbCE9ZS5wYWdlWU9mZnNldD9lLnBhZ2VZT2Zmc2V0Om51bGwhPXQuc2Nyb2xsVG9wP3Quc2Nyb2xsVG9wOmRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wOnRoaXMuX3RhcmdldC5zY3JvbGxUb3B9LHMuX2tpbGw9ZnVuY3Rpb24odCl7cmV0dXJuIHQuc2Nyb2xsVG9feCYmKHRoaXMuc2tpcFg9ITApLHQuc2Nyb2xsVG9feSYmKHRoaXMuc2tpcFk9ITApLHRoaXMuX3N1cGVyLl9raWxsLmNhbGwodGhpcyx0KX19KSxfZ3NTY29wZS5fZ3NEZWZpbmUmJl9nc1Njb3BlLl9nc1F1ZXVlLnBvcCgpKCk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJcbjsoZnVuY3Rpb24oKXtcblxuICAvKipcbiAgICogUGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoLlxuICAgKi9cblxuICB2YXIgZGlzcGF0Y2ggPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBCYXNlIHBhdGguXG4gICAqL1xuXG4gIHZhciBiYXNlID0gJyc7XG5cbiAgLyoqXG4gICAqIFJ1bm5pbmcgZmxhZy5cbiAgICovXG5cbiAgdmFyIHJ1bm5pbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGBwYXRoYCB3aXRoIGNhbGxiYWNrIGBmbigpYCxcbiAgICogb3Igcm91dGUgYHBhdGhgLCBvciBgcGFnZS5zdGFydCgpYC5cbiAgICpcbiAgICogICBwYWdlKGZuKTtcbiAgICogICBwYWdlKCcqJywgZm4pO1xuICAgKiAgIHBhZ2UoJy91c2VyLzppZCcsIGxvYWQsIHVzZXIpO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkLCB7IHNvbWU6ICd0aGluZycgfSk7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQpO1xuICAgKiAgIHBhZ2UoKTtcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4uLi5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gcGFnZShwYXRoLCBmbikge1xuICAgIC8vIDxjYWxsYmFjaz5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcmV0dXJuIHBhZ2UoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyByb3V0ZSA8cGF0aD4gdG8gPGNhbGxiYWNrIC4uLj5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHBhZ2UuY2FsbGJhY2tzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICAgIH1cbiAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBwYXRoKSB7XG4gICAgICBwYWdlLnNob3cocGF0aCwgZm4pO1xuICAgIC8vIHN0YXJ0IFtvcHRpb25zXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnN0YXJ0KHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbnMuXG4gICAqL1xuXG4gIHBhZ2UuY2FsbGJhY2tzID0gW107XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgYmFzZXBhdGggdG8gYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhc2UgPSBmdW5jdGlvbihwYXRoKXtcbiAgICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICBiYXNlID0gcGF0aDtcbiAgfTtcblxuICAvKipcbiAgICogQmluZCB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AuXG4gICAqXG4gICAqIE9wdGlvbnM6XG4gICAqXG4gICAqICAgIC0gYGNsaWNrYCBiaW5kIHRvIGNsaWNrIGV2ZW50cyBbdHJ1ZV1cbiAgICogICAgLSBgcG9wc3RhdGVgIGJpbmQgdG8gcG9wc3RhdGUgW3RydWVdXG4gICAqICAgIC0gYGRpc3BhdGNoYCBwZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2ggW3RydWVdXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RhcnQgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAocnVubmluZykgcmV0dXJuO1xuICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kaXNwYXRjaCkgZGlzcGF0Y2ggPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMucG9wc3RhdGUpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgICBpZiAoZmFsc2UgIT09IG9wdGlvbnMuY2xpY2spIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaDtcbiAgICBwYWdlLnJlcGxhY2UodXJsLCBudWxsLCB0cnVlLCBkaXNwYXRjaCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuYmluZCBjbGljayBhbmQgcG9wc3RhdGUgZXZlbnQgaGFuZGxlcnMuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RvcCA9IGZ1bmN0aW9uKCl7XG4gICAgcnVubmluZyA9IGZhbHNlO1xuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jbGljaywgZmFsc2UpO1xuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwYXRjaFxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnNob3cgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgZGlzcGF0Y2gpe1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmICghY3R4LnVuaGFuZGxlZCkgY3R4LnB1c2hTdGF0ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnJlcGxhY2UgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgaW5pdCwgZGlzcGF0Y2gpe1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgY3R4LmluaXQgPSBpbml0O1xuICAgIGlmIChudWxsID09IGRpc3BhdGNoKSBkaXNwYXRjaCA9IHRydWU7XG4gICAgaWYgKGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCB0aGUgZ2l2ZW4gYGN0eGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIHBhZ2UuZGlzcGF0Y2ggPSBmdW5jdGlvbihjdHgpe1xuICAgIHZhciBpID0gMDtcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuICAgICAgaWYgKCFmbikgcmV0dXJuIHVuaGFuZGxlZChjdHgpO1xuICAgICAgZm4oY3R4LCBuZXh0KTtcbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuaGFuZGxlZCBgY3R4YC4gV2hlbiBpdCdzIG5vdCB0aGUgaW5pdGlhbFxuICAgKiBwb3BzdGF0ZSB0aGVuIHJlZGlyZWN0LiBJZiB5b3Ugd2lzaCB0byBoYW5kbGVcbiAgICogNDA0cyBvbiB5b3VyIG93biB1c2UgYHBhZ2UoJyonLCBjYWxsYmFjaylgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gdW5oYW5kbGVkKGN0eCkge1xuICAgIHZhciBjdXJyZW50ID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICBpZiAoY3VycmVudCA9PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC51bmhhbmRsZWQgPSB0cnVlO1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT0gcGF0aFswXSAmJiAwICE9IHBhdGguaW5kZXhPZihiYXNlKSkgcGF0aCA9IGJhc2UgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuXG4gICAgdGhpcy50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSB8fCB7fTtcbiAgICB0aGlzLnN0YXRlLnBhdGggPSBwYXRoO1xuICAgIHRoaXMucXVlcnlzdHJpbmcgPSB+aSA/IHBhdGguc2xpY2UoaSArIDEpIDogJyc7XG4gICAgdGhpcy5wYXRobmFtZSA9IH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGg7XG4gICAgdGhpcy5wYXJhbXMgPSBbXTtcblxuICAgIC8vIGZyYWdtZW50XG4gICAgdGhpcy5oYXNoID0gJyc7XG4gICAgaWYgKCF+dGhpcy5wYXRoLmluZGV4T2YoJyMnKSkgcmV0dXJuO1xuICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgIHRoaXMucGF0aCA9IHBhcnRzWzBdO1xuICAgIHRoaXMuaGFzaCA9IHBhcnRzWzFdIHx8ICcnO1xuICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBDb250ZXh0YC5cbiAgICovXG5cbiAgcGFnZS5Db250ZXh0ID0gQ29udGV4dDtcblxuICAvKipcbiAgICogUHVzaCBzdGF0ZS5cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSB0aGUgY29udGV4dCBzdGF0ZS5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBgUm91dGVgIHdpdGggdGhlIGdpdmVuIEhUVFAgYHBhdGhgLFxuICAgKiBhbmQgYW4gYXJyYXkgb2YgYGNhbGxiYWNrc2AgYW5kIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAtIGBzZW5zaXRpdmVgICAgIGVuYWJsZSBjYXNlLXNlbnNpdGl2ZSByb3V0ZXNcbiAgICogICAtIGBzdHJpY3RgICAgICAgIGVuYWJsZSBzdHJpY3QgbWF0Y2hpbmcgZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBSb3V0ZShwYXRoLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm1ldGhvZCA9ICdHRVQnO1xuICAgIHRoaXMucmVnZXhwID0gcGF0aHRvUmVnZXhwKHBhdGhcbiAgICAgICwgdGhpcy5rZXlzID0gW11cbiAgICAgICwgb3B0aW9ucy5zZW5zaXRpdmVcbiAgICAgICwgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4LCBuZXh0KXtcbiAgICAgIGlmIChzZWxmLm1hdGNoKGN0eC5wYXRoLCBjdHgucGFyYW1zKSkgcmV0dXJuIGZuKGN0eCwgbmV4dCk7XG4gICAgICBuZXh0KCk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyByb3V0ZSBtYXRjaGVzIGBwYXRoYCwgaWYgc29cbiAgICogcG9wdWxhdGUgYHBhcmFtc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKXtcbiAgICB2YXIga2V5cyA9IHRoaXMua2V5c1xuICAgICAgLCBxc0luZGV4ID0gcGF0aC5pbmRleE9mKCc/JylcbiAgICAgICwgcGF0aG5hbWUgPSB+cXNJbmRleCA/IHBhdGguc2xpY2UoMCwgcXNJbmRleCkgOiBwYXRoXG4gICAgICAsIG0gPSB0aGlzLnJlZ2V4cC5leGVjKHBhdGhuYW1lKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgdmFyIHZhbCA9ICdzdHJpbmcnID09IHR5cGVvZiBtW2ldXG4gICAgICAgID8gZGVjb2RlVVJJQ29tcG9uZW50KG1baV0pXG4gICAgICAgIDogbVtpXTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdW5kZWZpbmVkICE9PSBwYXJhbXNba2V5Lm5hbWVdXG4gICAgICAgICAgPyBwYXJhbXNba2V5Lm5hbWVdXG4gICAgICAgICAgOiB2YWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMucHVzaCh2YWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLFxuICAgKiByZXR1cm5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEFuIGVtcHR5IGFycmF5IHNob3VsZCBiZSBwYXNzZWQsXG4gICAqIHdoaWNoIHdpbGwgY29udGFpbiB0aGUgcGxhY2Vob2xkZXJcbiAgICoga2V5IG5hbWVzLiBGb3IgZXhhbXBsZSBcIi91c2VyLzppZFwiIHdpbGxcbiAgICogdGhlbiBjb250YWluIFtcImlkXCJdLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd8UmVnRXhwfEFycmF5fSBwYXRoXG4gICAqIEBwYXJhbSAge0FycmF5fSBrZXlzXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHNlbnNpdGl2ZVxuICAgKiBAcGFyYW0gIHtCb29sZWFufSBzdHJpY3RcbiAgICogQHJldHVybiB7UmVnRXhwfVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gcGF0aHRvUmVnZXhwKHBhdGgsIGtleXMsIHNlbnNpdGl2ZSwgc3RyaWN0KSB7XG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBSZWdFeHApIHJldHVybiBwYXRoO1xuICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHBhdGggPSAnKCcgKyBwYXRoLmpvaW4oJ3wnKSArICcpJztcbiAgICBwYXRoID0gcGF0aFxuICAgICAgLmNvbmNhdChzdHJpY3QgPyAnJyA6ICcvPycpXG4gICAgICAucmVwbGFjZSgvXFwvXFwoL2csICcoPzovJylcbiAgICAgIC5yZXBsYWNlKC8oXFwvKT8oXFwuKT86KFxcdyspKD86KFxcKC4qP1xcKSkpPyhcXD8pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwgZm9ybWF0LCBrZXksIGNhcHR1cmUsIG9wdGlvbmFsKXtcbiAgICAgICAga2V5cy5wdXNoKHsgbmFtZToga2V5LCBvcHRpb25hbDogISEgb3B0aW9uYWwgfSk7XG4gICAgICAgIHNsYXNoID0gc2xhc2ggfHwgJyc7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gJycgOiBzbGFzaClcbiAgICAgICAgICArICcoPzonXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyBzbGFzaCA6ICcnKVxuICAgICAgICAgICsgKGZvcm1hdCB8fCAnJykgKyAoY2FwdHVyZSB8fCAoZm9ybWF0ICYmICcoW14vLl0rPyknIHx8ICcoW14vXSs/KScpKSArICcpJ1xuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvKFtcXC8uXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvXFwqL2csICcoLiopJyk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcGF0aCArICckJywgc2Vuc2l0aXZlID8gJycgOiAnaScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBcInBvcHVsYXRlXCIgZXZlbnRzLlxuICAgKi9cblxuICBmdW5jdGlvbiBvbnBvcHN0YXRlKGUpIHtcbiAgICBpZiAoZS5zdGF0ZSkge1xuICAgICAgdmFyIHBhdGggPSBlLnN0YXRlLnBhdGg7XG4gICAgICBwYWdlLnJlcGxhY2UocGF0aCwgZS5zdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBcImNsaWNrXCIgZXZlbnRzLlxuICAgKi9cblxuICBmdW5jdGlvbiBvbmNsaWNrKGUpIHtcbiAgICBpZiAoMSAhPSB3aGljaChlKSkgcmV0dXJuO1xuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpIHJldHVybjtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbGlua1xuICAgIHZhciBlbCA9IGUudGFyZ2V0O1xuICAgIHdoaWxlIChlbCAmJiAnQScgIT0gZWwubm9kZU5hbWUpIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICBpZiAoIWVsIHx8ICdBJyAhPSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG4gICAgLy8gZW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoZWwucGF0aG5hbWUgPT0gbG9jYXRpb24ucGF0aG5hbWUgJiYgKGVsLmhhc2ggfHwgJyMnID09IGxpbmspKSByZXR1cm47XG5cbiAgICAvLyBjaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSByZXR1cm47XG5cbiAgICAvLyB4LW9yaWdpblxuICAgIGlmICghc2FtZU9yaWdpbihlbC5ocmVmKSkgcmV0dXJuO1xuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHNhbWUgcGFnZVxuICAgIHZhciBvcmlnID0gcGF0aCArIGVsLmhhc2g7XG5cbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKTtcbiAgICBpZiAoYmFzZSAmJiBvcmlnID09IHBhdGgpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBwYWdlLnNob3cob3JpZyk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgYnV0dG9uLlxuICAgKi9cblxuICBmdW5jdGlvbiB3aGljaChlKSB7XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgIHJldHVybiBudWxsID09IGUud2hpY2hcbiAgICAgID8gZS5idXR0b25cbiAgICAgIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAwID09IGhyZWYuaW5kZXhPZihvcmlnaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgcGFnZWAuXG4gICAqL1xuXG4gIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgbW9kdWxlKSB7XG4gICAgd2luZG93LnBhZ2UgPSBwYWdlO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiAgfVxuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFZ1ZSwgb3B0aW9ucykge1xuICAgIFZ1ZS5sb2cgPSByZXF1aXJlKCcuL2xvZycpKFZ1ZSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDbGVhbiBsb2cgd2l0aG91dCBnZXR0ZXIvc2V0dGVyXG4gKiB1c2VmdWxsIGZvciBpbi1hcHBsaWNhdGlvbiBkZWJ1Z2dpbmcuXG4gKiBPbmx5IGxvZyAkZGF0YSAmIGl0cyBwcm9wZXJ0aWVzXG4gKlxuICogKG1vc3RseSB0byBhdm9pZCBKU09OIHBhcnNlIGV4Y2VwdGlvbiB3aXRoXG4gKiBjaXJjdWxhciByZWZlcmVuY2VzIGZyb20gdm0uJGNvbXBpbGVyKVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVnVlKSB7XG4gICAgdmFyIHV0aWxzID0gVnVlLnJlcXVpcmUoJ3V0aWxzJyksXG4gICAgaXNPYmplY3QgPSB1dGlscy5pc1RydWVPYmplY3QsXG4gICAgc2xpY2UgPSBbXS5zbGljZTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIWNvbnNvbGUpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgXG4gICAgICAgIGZvcih2YXIgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2ldO1xuXG4gICAgICAgICAgICAvLyBEaXJlY3RseSBsb2cgYW55IHByaW1pdGl2ZSBhcmdcbiAgICAgICAgICAgIGlmKCFpc09iamVjdChhcmcpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgdmFyIGhhc0NpcmN1bGFyUmVmID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNWbSA9ICEhYXJnLiRjb21waWxlcjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gSWYgYXJnIGlzIGEgdm0sIGxvZyAkZGF0YSBkaXJlY3RseVxuICAgICAgICAgICAgaWYoaXNWbSkge1xuICAgICAgICAgICAgICAgIGFyZ3Muc3BsaWNlKGksIDEsIGFyZy4kZGF0YSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRvbid0IGxvZyBpZiAkIG9yICRjb21waWxlclxuICAgICAgICAgICAgZm9yKHZhciBwcm9wIGluIGFyZykge1xuICAgICAgICAgICAgICAgIC8vICRjb21waWxlclxuICAgICAgICAgICAgICAgIGlmKHByb3AgPT09ICd2bScpIGhhc0NpcmN1bGFyUmVmID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAkIC8gdi1yZWZcbiAgICAgICAgICAgICAgICBpZihpc09iamVjdChhcmdbcHJvcF0pICYmICckY29tcGlsZXInIGluIGFyZ1twcm9wXSkgaGFzQ2lyY3VsYXJSZWYgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihoYXNDaXJjdWxhclJlZikge1xuICAgICAgICAgICAgICAgIGFyZ3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyB1c2luZyBgcmV0dXJuYCBtYWtlcyBpdCB0ZXN0YWJsZSAgXG4gICAgICAgIHJldHVybiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFyZ3MpKSk7XG4gICAgfTtcbn07IiwiZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24gKFZ1ZSkge1xuICBcbiAgVnVlLmRpcmVjdGl2ZSgnZWwnLHtcblxuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkID0gdGhpcy5leHByZXNzaW9uO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgdGhpcy52bS4kJCA9IHRoaXMudm0uJCQgfHwge307XG4gICAgICAgIHRoaXMudm0uJCRbdGhpcy5leHByZXNzaW9uXSA9IHRoaXMuZWw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb247XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICBkZWxldGUgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dO1xuICAgICAgfVxuICAgIH1cblxuICB9KTtcblxufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNsaWNlID0gW10uc2xpY2U7XG5cbmZ1bmN0aW9uIGZpbmQoZWwsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gZmluZEFsbChlbCwgc2VsZWN0b3IpIHtcbiAgZWwgPSBlbCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIHNsaWNlLmNhbGwoZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuXG5mdW5jdGlvbiBoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyAnICsgY2xhc3NOYW1lICsgJyAnKS50ZXN0KCcgJyArIGVsLmNsYXNzTmFtZSArICcgJyk7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbihWdWUpIHtcbiAgdmFyIHV0aWxzID0gVnVlLnJlcXVpcmUoJ3V0aWxzJyk7XG4gIHV0aWxzLmV4dGVuZChWdWUucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgc2luZ2xlIGRvbSBlbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgVk0gbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3RvciBzdHJpbmcgc2VsZWN0b3IgdG8gc2VhcmNoXG4gICAgICogQHJldHVybiB7ZG9tRWxlbWVudH0gICAgICAgICAgdGhlIFZNJ3MgY2hpbGQgZm91bmRcbiAgICAgKi9cbiAgICAkZmluZE9uZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZpbmQodGhpcy4kZWwsIHNlbGVjdG9yKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFuIGFycmF5IG9mIGRvbUVsZW1lbnQgZnJvbSB0aGUgY3VycmVudCBWTSBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdG9yIHN0cmluZyBzZWxlY3RvciB0byBzZWFyY2hcbiAgICAgKiBAcmV0dXJuIHthcnJheX0gICAgICAgICAgYXJyYXkgY29udGFpbmluZyBkb21FbGVtZW50cyBmb3VuZCBpbiB0aGUgVk1cbiAgICAgKi9cbiAgICAkZmluZDogZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRBbGwodGhpcy4kZWwsIHNlbGVjdG9yKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGN1cnJlbnQgVk0gaGFzIGEgZ2l2ZW4gY2xhc3MsIGlmIGEgc2VsZWN0b3IgaXMgcGFzc2VkIGFzIHNlY29uZCBwYXJhbWV0ZXJzLCB3ZSdsbCBjaGVjayB0aGUgY29ycmVzcG9uZGluZyBjaGlsZCBpbnN0ZWFkXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSAgY2xhc3NOYW1lXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSAgc2VsZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUsIHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciBlbCA9IHNlbGVjdG9yID8gdGhpcy4kZmluZE9uZShzZWxlY3RvcikgOiB0aGlzLiRlbDtcbiAgICAgICAgcmV0dXJuIGhhc0NsYXNzKGVsLCBjbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjbGFzcyB0byB0aGUgY3VycmVudCBWTSBvciB0byBpdHMgY2hpbGQgbWF0Y2hpbmcgJ3NlbGVjdG9yJ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lLCBzZWxlY3Rvcikge1xuICAgICAgICBpZih0aGlzLmhhc0NsYXNzKGNsYXNzTmFtZSwgc2VsZWN0b3IpKSByZXR1cm47XG4gICAgICAgIHZhciBlbCA9IHNlbGVjdG9yID8gdGhpcy4kZmluZChzZWxlY3RvcikgOiB0aGlzLiRlbDtcbiAgICAgICAgaWYoaXNBcnJheShlbCkpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBlbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRDbGFzcyhlbFtpXSwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbHMuYWRkQ2xhc3MoZWwsIGNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNsYXNzIHRvIHRoZSBjdXJyZW50IFZNIG9yIHRvIGl0cyBjaGlsZCBtYXRjaGluZyAnc2VsZWN0b3InXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUsIHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciBlbCA9IHNlbGVjdG9yID8gdGhpcy4kZmluZChzZWxlY3RvcikgOiB0aGlzLiRlbDtcbiAgICAgICAgaWYoaXNBcnJheShlbCkpIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBlbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyhlbFtpXSwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbHMucmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9KTtcbn07IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbmZ1bmN0aW9uIEJhdGNoZXIgKCkge1xuICAgIHRoaXMucmVzZXQoKVxufVxuXG52YXIgQmF0Y2hlclByb3RvID0gQmF0Y2hlci5wcm90b3R5cGVcblxuQmF0Y2hlclByb3RvLnB1c2ggPSBmdW5jdGlvbiAoam9iKSB7XG4gICAgaWYgKCFqb2IuaWQgfHwgIXRoaXMuaGFzW2pvYi5pZF0pIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKGpvYilcbiAgICAgICAgdGhpcy5oYXNbam9iLmlkXSA9IGpvYlxuICAgICAgICBpZiAoIXRoaXMud2FpdGluZykge1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gdHJ1ZVxuICAgICAgICAgICAgdXRpbHMubmV4dFRpY2sodXRpbHMuYmluZCh0aGlzLmZsdXNoLCB0aGlzKSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoam9iLm92ZXJyaWRlKSB7XG4gICAgICAgIHZhciBvbGRKb2IgPSB0aGlzLmhhc1tqb2IuaWRdXG4gICAgICAgIG9sZEpvYi5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICAgIHRoaXMucXVldWUucHVzaChqb2IpXG4gICAgICAgIHRoaXMuaGFzW2pvYi5pZF0gPSBqb2JcbiAgICB9XG59XG5cbkJhdGNoZXJQcm90by5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBiZWZvcmUgZmx1c2ggaG9va1xuICAgIGlmICh0aGlzLl9wcmVGbHVzaCkgdGhpcy5fcHJlRmx1c2goKVxuICAgIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIGpvYnMgbWlnaHQgYmUgcHVzaGVkXG4gICAgLy8gYXMgd2UgZXhlY3V0ZSBleGlzdGluZyBqb2JzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBqb2IgPSB0aGlzLnF1ZXVlW2ldXG4gICAgICAgIGlmICgham9iLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgam9iLmV4ZWN1dGUoKVxuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVzZXQoKVxufVxuXG5CYXRjaGVyUHJvdG8ucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5oYXMgPSB1dGlscy5oYXNoKClcbiAgICB0aGlzLnF1ZXVlID0gW11cbiAgICB0aGlzLndhaXRpbmcgPSBmYWxzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhdGNoZXIiLCJ2YXIgQmF0Y2hlciAgICAgICAgPSByZXF1aXJlKCcuL2JhdGNoZXInKSxcbiAgICBiaW5kaW5nQmF0Y2hlciA9IG5ldyBCYXRjaGVyKCksXG4gICAgYmluZGluZ0lkICAgICAgPSAxXG5cbi8qKlxuICogIEJpbmRpbmcgY2xhc3MuXG4gKlxuICogIGVhY2ggcHJvcGVydHkgb24gdGhlIHZpZXdtb2RlbCBoYXMgb25lIGNvcnJlc3BvbmRpbmcgQmluZGluZyBvYmplY3RcbiAqICB3aGljaCBoYXMgbXVsdGlwbGUgZGlyZWN0aXZlIGluc3RhbmNlcyBvbiB0aGUgRE9NXG4gKiAgYW5kIG11bHRpcGxlIGNvbXB1dGVkIHByb3BlcnR5IGRlcGVuZGVudHNcbiAqL1xuZnVuY3Rpb24gQmluZGluZyAoY29tcGlsZXIsIGtleSwgaXNFeHAsIGlzRm4pIHtcbiAgICB0aGlzLmlkID0gYmluZGluZ0lkKytcbiAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkXG4gICAgdGhpcy5pc0V4cCA9ICEhaXNFeHBcbiAgICB0aGlzLmlzRm4gPSBpc0ZuXG4gICAgdGhpcy5yb290ID0gIXRoaXMuaXNFeHAgJiYga2V5LmluZGV4T2YoJy4nKSA9PT0gLTFcbiAgICB0aGlzLmNvbXBpbGVyID0gY29tcGlsZXJcbiAgICB0aGlzLmtleSA9IGtleVxuICAgIHRoaXMuZGlycyA9IFtdXG4gICAgdGhpcy5zdWJzID0gW11cbiAgICB0aGlzLmRlcHMgPSBbXVxuICAgIHRoaXMudW5ib3VuZCA9IGZhbHNlXG59XG5cbnZhciBCaW5kaW5nUHJvdG8gPSBCaW5kaW5nLnByb3RvdHlwZVxuXG4vKipcbiAqICBVcGRhdGUgdmFsdWUgYW5kIHF1ZXVlIGluc3RhbmNlIHVwZGF0ZXMuXG4gKi9cbkJpbmRpbmdQcm90by51cGRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoIXRoaXMuaXNDb21wdXRlZCB8fCB0aGlzLmlzRm4pIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgfVxuICAgIGlmICh0aGlzLmRpcnMubGVuZ3RoIHx8IHRoaXMuc3Vicy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgIGJpbmRpbmdCYXRjaGVyLnB1c2goe1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLnVuYm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fdXBkYXRlKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG4vKipcbiAqICBBY3R1YWxseSB1cGRhdGUgdGhlIGRpcmVjdGl2ZXMuXG4gKi9cbkJpbmRpbmdQcm90by5fdXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpID0gdGhpcy5kaXJzLmxlbmd0aCxcbiAgICAgICAgdmFsdWUgPSB0aGlzLnZhbCgpXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB0aGlzLmRpcnNbaV0uJHVwZGF0ZSh2YWx1ZSlcbiAgICB9XG4gICAgdGhpcy5wdWIoKVxufVxuXG4vKipcbiAqICBSZXR1cm4gdGhlIHZhbHVhdGVkIHZhbHVlIHJlZ2FyZGxlc3NcbiAqICBvZiB3aGV0aGVyIGl0IGlzIGNvbXB1dGVkIG9yIG5vdFxuICovXG5CaW5kaW5nUHJvdG8udmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzQ29tcHV0ZWQgJiYgIXRoaXMuaXNGblxuICAgICAgICA/IHRoaXMudmFsdWUuJGdldCgpXG4gICAgICAgIDogdGhpcy52YWx1ZVxufVxuXG4vKipcbiAqICBOb3RpZnkgY29tcHV0ZWQgcHJvcGVydGllcyB0aGF0IGRlcGVuZCBvbiB0aGlzIGJpbmRpbmdcbiAqICB0byB1cGRhdGUgdGhlbXNlbHZlc1xuICovXG5CaW5kaW5nUHJvdG8ucHViID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpID0gdGhpcy5zdWJzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5zdWJzW2ldLnVwZGF0ZSgpXG4gICAgfVxufVxuXG4vKipcbiAqICBVbmJpbmQgdGhlIGJpbmRpbmcsIHJlbW92ZSBpdHNlbGYgZnJvbSBhbGwgb2YgaXRzIGRlcGVuZGVuY2llc1xuICovXG5CaW5kaW5nUHJvdG8udW5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIEluZGljYXRlIHRoaXMgaGFzIGJlZW4gdW5ib3VuZC5cbiAgICAvLyBJdCdzIHBvc3NpYmxlIHRoaXMgYmluZGluZyB3aWxsIGJlIGluXG4gICAgLy8gdGhlIGJhdGNoZXIncyBmbHVzaCBxdWV1ZSB3aGVuIGl0cyBvd25lclxuICAgIC8vIGNvbXBpbGVyIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkLlxuICAgIHRoaXMudW5ib3VuZCA9IHRydWVcbiAgICB2YXIgaSA9IHRoaXMuZGlycy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMuZGlyc1tpXS4kdW5iaW5kKClcbiAgICB9XG4gICAgaSA9IHRoaXMuZGVwcy5sZW5ndGhcbiAgICB2YXIgc3Vic1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgc3VicyA9IHRoaXMuZGVwc1tpXS5zdWJzXG4gICAgICAgIHZhciBqID0gc3Vicy5pbmRleE9mKHRoaXMpXG4gICAgICAgIGlmIChqID4gLTEpIHN1YnMuc3BsaWNlKGosIDEpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpbmRpbmciLCJ2YXIgRW1pdHRlciAgICAgPSByZXF1aXJlKCcuL2VtaXR0ZXInKSxcbiAgICBPYnNlcnZlciAgICA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKSxcbiAgICBjb25maWcgICAgICA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgdXRpbHMgICAgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgQmluZGluZyAgICAgPSByZXF1aXJlKCcuL2JpbmRpbmcnKSxcbiAgICBEaXJlY3RpdmUgICA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlJyksXG4gICAgVGV4dFBhcnNlciAgPSByZXF1aXJlKCcuL3RleHQtcGFyc2VyJyksXG4gICAgRGVwc1BhcnNlciAgPSByZXF1aXJlKCcuL2RlcHMtcGFyc2VyJyksXG4gICAgRXhwUGFyc2VyICAgPSByZXF1aXJlKCcuL2V4cC1wYXJzZXInKSxcbiAgICBWaWV3TW9kZWwsXG4gICAgXG4gICAgLy8gY2FjaGUgbWV0aG9kc1xuICAgIHNsaWNlICAgICAgID0gW10uc2xpY2UsXG4gICAgZXh0ZW5kICAgICAgPSB1dGlscy5leHRlbmQsXG4gICAgaGFzT3duICAgICAgPSAoe30pLmhhc093blByb3BlcnR5LFxuICAgIGRlZiAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuXG4gICAgLy8gaG9va3MgdG8gcmVnaXN0ZXJcbiAgICBob29rcyA9IFtcbiAgICAgICAgJ2NyZWF0ZWQnLCAncmVhZHknLFxuICAgICAgICAnYmVmb3JlRGVzdHJveScsICdhZnRlckRlc3Ryb3knLFxuICAgICAgICAnYXR0YWNoZWQnLCAnZGV0YWNoZWQnXG4gICAgXSxcblxuICAgIC8vIGxpc3Qgb2YgcHJpb3JpdHkgZGlyZWN0aXZlc1xuICAgIC8vIHRoYXQgbmVlZHMgdG8gYmUgY2hlY2tlZCBpbiBzcGVjaWZpYyBvcmRlclxuICAgIHByaW9yaXR5RGlyZWN0aXZlcyA9IFtcbiAgICAgICAgJ2lmJyxcbiAgICAgICAgJ3JlcGVhdCcsXG4gICAgICAgICd2aWV3JyxcbiAgICAgICAgJ2NvbXBvbmVudCdcbiAgICBdXG5cbi8qKlxuICogIFRoZSBET00gY29tcGlsZXJcbiAqICBzY2FucyBhIERPTSBub2RlIGFuZCBjb21waWxlIGJpbmRpbmdzIGZvciBhIFZpZXdNb2RlbFxuICovXG5mdW5jdGlvbiBDb21waWxlciAodm0sIG9wdGlvbnMpIHtcblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGtleSwgaVxuXG4gICAgLy8gZGVmYXVsdCBzdGF0ZVxuICAgIGNvbXBpbGVyLmluaXQgICAgICAgPSB0cnVlXG4gICAgY29tcGlsZXIuZGVzdHJveWVkICA9IGZhbHNlXG5cbiAgICAvLyBwcm9jZXNzIGFuZCBleHRlbmQgb3B0aW9uc1xuICAgIG9wdGlvbnMgPSBjb21waWxlci5vcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHV0aWxzLnByb2Nlc3NPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAvLyBjb3B5IGNvbXBpbGVyIG9wdGlvbnNcbiAgICBleHRlbmQoY29tcGlsZXIsIG9wdGlvbnMuY29tcGlsZXJPcHRpb25zKVxuICAgIC8vIHJlcGVhdCBpbmRpY2F0ZXMgdGhpcyBpcyBhIHYtcmVwZWF0IGluc3RhbmNlXG4gICAgY29tcGlsZXIucmVwZWF0ICAgPSBjb21waWxlci5yZXBlYXQgfHwgZmFsc2VcbiAgICAvLyBleHBDYWNoZSB3aWxsIGJlIHNoYXJlZCBiZXR3ZWVuIHYtcmVwZWF0IGluc3RhbmNlc1xuICAgIGNvbXBpbGVyLmV4cENhY2hlID0gY29tcGlsZXIuZXhwQ2FjaGUgfHwge31cblxuICAgIC8vIGluaXRpYWxpemUgZWxlbWVudFxuICAgIHZhciBlbCA9IGNvbXBpbGVyLmVsID0gY29tcGlsZXIuc2V0dXBFbGVtZW50KG9wdGlvbnMpXG4gICAgdXRpbHMubG9nKCdcXG5uZXcgVk0gaW5zdGFuY2U6ICcgKyBlbC50YWdOYW1lICsgJ1xcbicpXG5cbiAgICAvLyBzZXQgb3RoZXIgY29tcGlsZXIgcHJvcGVydGllc1xuICAgIGNvbXBpbGVyLnZtICAgICAgID0gZWwudnVlX3ZtID0gdm1cbiAgICBjb21waWxlci5iaW5kaW5ncyA9IHV0aWxzLmhhc2goKVxuICAgIGNvbXBpbGVyLmRpcnMgICAgID0gW11cbiAgICBjb21waWxlci5kZWZlcnJlZCA9IFtdXG4gICAgY29tcGlsZXIuY29tcHV0ZWQgPSBbXVxuICAgIGNvbXBpbGVyLmNoaWxkcmVuID0gW11cbiAgICBjb21waWxlci5lbWl0dGVyICA9IG5ldyBFbWl0dGVyKHZtKVxuXG4gICAgLy8gVk0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBzZXQgVk0gcHJvcGVydGllc1xuICAgIHZtLiQgICAgICAgICA9IHt9XG4gICAgdm0uJGVsICAgICAgID0gZWxcbiAgICB2bS4kb3B0aW9ucyAgPSBvcHRpb25zXG4gICAgdm0uJGNvbXBpbGVyID0gY29tcGlsZXJcbiAgICB2bS4kZXZlbnQgICAgPSBudWxsXG5cbiAgICAvLyBzZXQgcGFyZW50ICYgcm9vdFxuICAgIHZhciBwYXJlbnRWTSA9IG9wdGlvbnMucGFyZW50XG4gICAgaWYgKHBhcmVudFZNKSB7XG4gICAgICAgIGNvbXBpbGVyLnBhcmVudCA9IHBhcmVudFZNLiRjb21waWxlclxuICAgICAgICBwYXJlbnRWTS4kY29tcGlsZXIuY2hpbGRyZW4ucHVzaChjb21waWxlcilcbiAgICAgICAgdm0uJHBhcmVudCA9IHBhcmVudFZNXG4gICAgICAgIC8vIGluaGVyaXQgbGF6eSBvcHRpb25cbiAgICAgICAgaWYgKCEoJ2xhenknIGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmxhenkgPSBjb21waWxlci5wYXJlbnQub3B0aW9ucy5sYXp5XG4gICAgICAgIH1cbiAgICB9XG4gICAgdm0uJHJvb3QgPSBnZXRSb290KGNvbXBpbGVyKS52bVxuXG4gICAgLy8gREFUQSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBzZXR1cCBvYnNlcnZlclxuICAgIC8vIHRoaXMgaXMgbmVjZXNhcnJ5IGZvciBhbGwgaG9va3MgYW5kIGRhdGEgb2JzZXJ2YXRpb24gZXZlbnRzXG4gICAgY29tcGlsZXIuc2V0dXBPYnNlcnZlcigpXG5cbiAgICAvLyBjcmVhdGUgYmluZGluZ3MgZm9yIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAgICBpZiAob3B0aW9ucy5tZXRob2RzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9wdGlvbnMubWV0aG9kcykge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYmluZGluZ3MgZm9yIG1ldGhvZHNcbiAgICBpZiAob3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgICBmb3IgKGtleSBpbiBvcHRpb25zLmNvbXB1dGVkKSB7XG4gICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGluaXRpYWxpemUgZGF0YVxuICAgIHZhciBkYXRhID0gY29tcGlsZXIuZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fSxcbiAgICAgICAgZGVmYXVsdERhdGEgPSBvcHRpb25zLmRlZmF1bHREYXRhXG4gICAgaWYgKGRlZmF1bHREYXRhKSB7XG4gICAgICAgIGZvciAoa2V5IGluIGRlZmF1bHREYXRhKSB7XG4gICAgICAgICAgICBpZiAoIWhhc093bi5jYWxsKGRhdGEsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSBkZWZhdWx0RGF0YVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb3B5IHBhcmFtQXR0cmlidXRlc1xuICAgIHZhciBwYXJhbXMgPSBvcHRpb25zLnBhcmFtQXR0cmlidXRlc1xuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgaSA9IHBhcmFtcy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgZGF0YVtwYXJhbXNbaV1dID0gdXRpbHMuY2hlY2tOdW1iZXIoXG4gICAgICAgICAgICAgICAgY29tcGlsZXIuZXZhbChcbiAgICAgICAgICAgICAgICAgICAgZWwuZ2V0QXR0cmlidXRlKHBhcmFtc1tpXSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb3B5IGRhdGEgcHJvcGVydGllcyB0byB2bVxuICAgIC8vIHNvIHVzZXIgY2FuIGFjY2VzcyB0aGVtIGluIHRoZSBjcmVhdGVkIGhvb2tcbiAgICBleHRlbmQodm0sIGRhdGEpXG4gICAgdm0uJGRhdGEgPSBkYXRhXG5cbiAgICAvLyBiZWZvcmVDb21waWxlIGhvb2tcbiAgICBjb21waWxlci5leGVjSG9vaygnY3JlYXRlZCcpXG5cbiAgICAvLyB0aGUgdXNlciBtaWdodCBoYXZlIHN3YXBwZWQgdGhlIGRhdGEgLi4uXG4gICAgZGF0YSA9IGNvbXBpbGVyLmRhdGEgPSB2bS4kZGF0YVxuXG4gICAgLy8gdXNlciBtaWdodCBhbHNvIHNldCBzb21lIHByb3BlcnRpZXMgb24gdGhlIHZtXG4gICAgLy8gaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgY29weSBiYWNrIHRvICRkYXRhXG4gICAgdmFyIHZtUHJvcFxuICAgIGZvciAoa2V5IGluIHZtKSB7XG4gICAgICAgIHZtUHJvcCA9IHZtW2tleV1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAga2V5LmNoYXJBdCgwKSAhPT0gJyQnICYmXG4gICAgICAgICAgICBkYXRhW2tleV0gIT09IHZtUHJvcCAmJlxuICAgICAgICAgICAgdHlwZW9mIHZtUHJvcCAhPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IHZtUHJvcFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbm93IHdlIGNhbiBvYnNlcnZlIHRoZSBkYXRhLlxuICAgIC8vIHRoaXMgd2lsbCBjb252ZXJ0IGRhdGEgcHJvcGVydGllcyB0byBnZXR0ZXIvc2V0dGVyc1xuICAgIC8vIGFuZCBlbWl0IHRoZSBmaXJzdCBiYXRjaCBvZiBzZXQgZXZlbnRzLCB3aGljaCB3aWxsXG4gICAgLy8gaW4gdHVybiBjcmVhdGUgdGhlIGNvcnJlc3BvbmRpbmcgYmluZGluZ3MuXG4gICAgY29tcGlsZXIub2JzZXJ2ZURhdGEoZGF0YSlcblxuICAgIC8vIENPTVBJTEUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gYmVmb3JlIGNvbXBpbGluZywgcmVzb2x2ZSBjb250ZW50IGluc2VydGlvbiBwb2ludHNcbiAgICBpZiAob3B0aW9ucy50ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLnJlc29sdmVDb250ZW50KClcbiAgICB9XG5cbiAgICAvLyBub3cgcGFyc2UgdGhlIERPTSBhbmQgYmluZCBkaXJlY3RpdmVzLlxuICAgIC8vIER1cmluZyB0aGlzIHN0YWdlLCB3ZSB3aWxsIGFsc28gY3JlYXRlIGJpbmRpbmdzIGZvclxuICAgIC8vIGVuY291bnRlcmVkIGtleXBhdGhzIHRoYXQgZG9uJ3QgaGF2ZSBhIGJpbmRpbmcgeWV0LlxuICAgIGNvbXBpbGVyLmNvbXBpbGUoZWwsIHRydWUpXG5cbiAgICAvLyBBbnkgZGlyZWN0aXZlIHRoYXQgY3JlYXRlcyBjaGlsZCBWTXMgYXJlIGRlZmVycmVkXG4gICAgLy8gc28gdGhhdCB3aGVuIHRoZXkgYXJlIGNvbXBpbGVkLCBhbGwgYmluZGluZ3Mgb24gdGhlXG4gICAgLy8gcGFyZW50IFZNIGhhdmUgYmVlbiBjcmVhdGVkLlxuICAgIGkgPSBjb21waWxlci5kZWZlcnJlZC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbXBpbGVyLmJpbmREaXJlY3RpdmUoY29tcGlsZXIuZGVmZXJyZWRbaV0pXG4gICAgfVxuICAgIGNvbXBpbGVyLmRlZmVycmVkID0gbnVsbFxuXG4gICAgLy8gZXh0cmFjdCBkZXBlbmRlbmNpZXMgZm9yIGNvbXB1dGVkIHByb3BlcnRpZXMuXG4gICAgLy8gdGhpcyB3aWxsIGV2YWx1YXRlZCBhbGwgY29sbGVjdGVkIGNvbXB1dGVkIGJpbmRpbmdzXG4gICAgLy8gYW5kIGNvbGxlY3QgZ2V0IGV2ZW50cyB0aGF0IGFyZSBlbWl0dGVkLlxuICAgIGlmICh0aGlzLmNvbXB1dGVkLmxlbmd0aCkge1xuICAgICAgICBEZXBzUGFyc2VyLnBhcnNlKHRoaXMuY29tcHV0ZWQpXG4gICAgfVxuXG4gICAgLy8gZG9uZSFcbiAgICBjb21waWxlci5pbml0ID0gZmFsc2VcblxuICAgIC8vIHBvc3QgY29tcGlsZSAvIHJlYWR5IGhvb2tcbiAgICBjb21waWxlci5leGVjSG9vaygncmVhZHknKVxufVxuXG52YXIgQ29tcGlsZXJQcm90byA9IENvbXBpbGVyLnByb3RvdHlwZVxuXG4vKipcbiAqICBJbml0aWFsaXplIHRoZSBWTS9Db21waWxlcidzIGVsZW1lbnQuXG4gKiAgRmlsbCBpdCBpbiB3aXRoIHRoZSB0ZW1wbGF0ZSBpZiBuZWNlc3NhcnkuXG4gKi9cbkNvbXBpbGVyUHJvdG8uc2V0dXBFbGVtZW50ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAvLyBjcmVhdGUgdGhlIG5vZGUgZmlyc3RcbiAgICB2YXIgZWwgPSB0eXBlb2Ygb3B0aW9ucy5lbCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuZWwpXG4gICAgICAgIDogb3B0aW9ucy5lbCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG9wdGlvbnMudGFnTmFtZSB8fCAnZGl2JylcblxuICAgIHZhciB0ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGUsXG4gICAgICAgIGNoaWxkLCByZXBsYWNlciwgaSwgYXR0ciwgYXR0cnNcblxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAvLyBjb2xsZWN0IGFueXRoaW5nIGFscmVhZHkgaW4gdGhlcmVcbiAgICAgICAgaWYgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgdGhpcy5yYXdDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgICAgICAgICB3aGlsZSAoY2hpbGQgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yYXdDb250ZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlcGxhY2Ugb3B0aW9uOiB1c2UgdGhlIGZpcnN0IG5vZGUgaW5cbiAgICAgICAgLy8gdGhlIHRlbXBsYXRlIGRpcmVjdGx5XG4gICAgICAgIGlmIChvcHRpb25zLnJlcGxhY2UgJiYgdGVtcGxhdGUuZmlyc3RDaGlsZCA9PT0gdGVtcGxhdGUubGFzdENoaWxkKSB7XG4gICAgICAgICAgICByZXBsYWNlciA9IHRlbXBsYXRlLmZpcnN0Q2hpbGQuY2xvbmVOb2RlKHRydWUpXG4gICAgICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHJlcGxhY2VyLCBlbClcbiAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29weSBvdmVyIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAgICAgICAgICAgICBpID0gZWwuYXR0cmlidXRlcy5sZW5ndGhcbiAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBlbC5hdHRyaWJ1dGVzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VyLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVwbGFjZVxuICAgICAgICAgICAgZWwgPSByZXBsYWNlclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBhcHBseSBlbGVtZW50IG9wdGlvbnNcbiAgICBpZiAob3B0aW9ucy5pZCkgZWwuaWQgPSBvcHRpb25zLmlkXG4gICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSBlbC5jbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZVxuICAgIGF0dHJzID0gb3B0aW9ucy5hdHRyaWJ1dGVzXG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICAgIGZvciAoYXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogIERlYWwgd2l0aCA8Y29udGVudD4gaW5zZXJ0aW9uIHBvaW50c1xuICogIHBlciB0aGUgV2ViIENvbXBvbmVudHMgc3BlY1xuICovXG5Db21waWxlclByb3RvLnJlc29sdmVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIG91dGxldHMgPSBzbGljZS5jYWxsKHRoaXMuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NvbnRlbnQnKSksXG4gICAgICAgIHJhdyA9IHRoaXMucmF3Q29udGVudCxcbiAgICAgICAgb3V0bGV0LCBzZWxlY3QsIGksIGosIG1haW5cblxuICAgIGkgPSBvdXRsZXRzLmxlbmd0aFxuICAgIGlmIChpKSB7XG4gICAgICAgIC8vIGZpcnN0IHBhc3MsIGNvbGxlY3QgY29ycmVzcG9uZGluZyBjb250ZW50XG4gICAgICAgIC8vIGZvciBlYWNoIG91dGxldC5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgb3V0bGV0ID0gb3V0bGV0c1tpXVxuICAgICAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgICAgICAgIHNlbGVjdCA9IG91dGxldC5nZXRBdHRyaWJ1dGUoJ3NlbGVjdCcpXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdCkgeyAvLyBzZWxlY3QgY29udGVudFxuICAgICAgICAgICAgICAgICAgICBvdXRsZXQuY29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGljZS5jYWxsKHJhdy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdCkpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gZGVmYXVsdCBjb250ZW50XG4gICAgICAgICAgICAgICAgICAgIG1haW4gPSBvdXRsZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBmYWxsYmFjayBjb250ZW50XG4gICAgICAgICAgICAgICAgb3V0bGV0LmNvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBzbGljZS5jYWxsKG91dGxldC5jaGlsZE5vZGVzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNlY29uZCBwYXNzLCBhY3R1YWxseSBpbnNlcnQgdGhlIGNvbnRlbnRzXG4gICAgICAgIGZvciAoaSA9IDAsIGogPSBvdXRsZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgb3V0bGV0ID0gb3V0bGV0c1tpXVxuICAgICAgICAgICAgaWYgKG91dGxldCA9PT0gbWFpbikgY29udGludWVcbiAgICAgICAgICAgIGluc2VydChvdXRsZXQsIG91dGxldC5jb250ZW50KVxuICAgICAgICB9XG4gICAgICAgIC8vIGZpbmFsbHkgaW5zZXJ0IHRoZSBtYWluIGNvbnRlbnRcbiAgICAgICAgaWYgKHJhdyAmJiBtYWluKSB7XG4gICAgICAgICAgICBpbnNlcnQobWFpbiwgc2xpY2UuY2FsbChyYXcuY2hpbGROb2RlcykpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNlcnQgKG91dGxldCwgY29udGVudHMpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IG91dGxldC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgaSA9IDAsIGogPSBjb250ZW50cy5sZW5ndGhcbiAgICAgICAgZm9yICg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY29udGVudHNbaV0sIG91dGxldClcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQob3V0bGV0KVxuICAgIH1cblxuICAgIHRoaXMucmF3Q29udGVudCA9IG51bGxcbn1cblxuLyoqXG4gKiAgU2V0dXAgb2JzZXJ2ZXIuXG4gKiAgVGhlIG9ic2VydmVyIGxpc3RlbnMgZm9yIGdldC9zZXQvbXV0YXRlIGV2ZW50cyBvbiBhbGwgVk1cbiAqICB2YWx1ZXMvb2JqZWN0cyBhbmQgdHJpZ2dlciBjb3JyZXNwb25kaW5nIGJpbmRpbmcgdXBkYXRlcy5cbiAqICBJdCBhbHNvIGxpc3RlbnMgZm9yIGxpZmVjeWNsZSBob29rcy5cbiAqL1xuQ29tcGlsZXJQcm90by5zZXR1cE9ic2VydmVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgYmluZGluZ3MgPSBjb21waWxlci5iaW5kaW5ncyxcbiAgICAgICAgb3B0aW9ucyAgPSBjb21waWxlci5vcHRpb25zLFxuICAgICAgICBvYnNlcnZlciA9IGNvbXBpbGVyLm9ic2VydmVyID0gbmV3IEVtaXR0ZXIoY29tcGlsZXIudm0pXG5cbiAgICAvLyBhIGhhc2ggdG8gaG9sZCBldmVudCBwcm94aWVzIGZvciBlYWNoIHJvb3QgbGV2ZWwga2V5XG4gICAgLy8gc28gdGhleSBjYW4gYmUgcmVmZXJlbmNlZCBhbmQgcmVtb3ZlZCBsYXRlclxuICAgIG9ic2VydmVyLnByb3hpZXMgPSB7fVxuXG4gICAgLy8gYWRkIG93biBsaXN0ZW5lcnMgd2hpY2ggdHJpZ2dlciBiaW5kaW5nIHVwZGF0ZXNcbiAgICBvYnNlcnZlclxuICAgICAgICAub24oJ2dldCcsIG9uR2V0KVxuICAgICAgICAub24oJ3NldCcsIG9uU2V0KVxuICAgICAgICAub24oJ211dGF0ZScsIG9uU2V0KVxuXG4gICAgLy8gcmVnaXN0ZXIgaG9va3NcbiAgICB2YXIgaSA9IGhvb2tzLmxlbmd0aCwgaiwgaG9vaywgZm5zXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBob29rID0gaG9va3NbaV1cbiAgICAgICAgZm5zID0gb3B0aW9uc1tob29rXVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmbnMpKSB7XG4gICAgICAgICAgICBqID0gZm5zLmxlbmd0aFxuICAgICAgICAgICAgLy8gc2luY2UgaG9va3Mgd2VyZSBtZXJnZWQgd2l0aCBjaGlsZCBhdCBoZWFkLFxuICAgICAgICAgICAgLy8gd2UgbG9vcCByZXZlcnNlbHkuXG4gICAgICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJIb29rKGhvb2ssIGZuc1tqXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmbnMpIHtcbiAgICAgICAgICAgIHJlZ2lzdGVySG9vayhob29rLCBmbnMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBicm9hZGNhc3QgYXR0YWNoZWQvZGV0YWNoZWQgaG9va3NcbiAgICBvYnNlcnZlclxuICAgICAgICAub24oJ2hvb2s6YXR0YWNoZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBicm9hZGNhc3QoMSlcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdob29rOmRldGFjaGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJvYWRjYXN0KDApXG4gICAgICAgIH0pXG5cbiAgICBmdW5jdGlvbiBvbkdldCAoa2V5KSB7XG4gICAgICAgIGNoZWNrKGtleSlcbiAgICAgICAgRGVwc1BhcnNlci5jYXRjaGVyLmVtaXQoJ2dldCcsIGJpbmRpbmdzW2tleV0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25TZXQgKGtleSwgdmFsLCBtdXRhdGlvbikge1xuICAgICAgICBvYnNlcnZlci5lbWl0KCdjaGFuZ2U6JyArIGtleSwgdmFsLCBtdXRhdGlvbilcbiAgICAgICAgY2hlY2soa2V5KVxuICAgICAgICBiaW5kaW5nc1trZXldLnVwZGF0ZSh2YWwpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJIb29rIChob29rLCBmbikge1xuICAgICAgICBvYnNlcnZlci5vbignaG9vazonICsgaG9vaywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm4uY2FsbChjb21waWxlci52bSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBicm9hZGNhc3QgKGV2ZW50KSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IGNvbXBpbGVyLmNoaWxkcmVuXG4gICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgdmFyIGNoaWxkLCBpID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5lbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50ID0gJ2hvb2s6JyArIChldmVudCA/ICdhdHRhY2hlZCcgOiAnZGV0YWNoZWQnKVxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vYnNlcnZlci5lbWl0KGV2ZW50KVxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5lbWl0dGVyLmVtaXQoZXZlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2sgKGtleSkge1xuICAgICAgICBpZiAoIWJpbmRpbmdzW2tleV0pIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5Db21waWxlclByb3RvLm9ic2VydmVEYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIG9ic2VydmVyID0gY29tcGlsZXIub2JzZXJ2ZXJcblxuICAgIC8vIHJlY3Vyc2l2ZWx5IG9ic2VydmUgbmVzdGVkIHByb3BlcnRpZXNcbiAgICBPYnNlcnZlci5vYnNlcnZlKGRhdGEsICcnLCBvYnNlcnZlcilcblxuICAgIC8vIGFsc28gY3JlYXRlIGJpbmRpbmcgZm9yIHRvcCBsZXZlbCAkZGF0YVxuICAgIC8vIHNvIGl0IGNhbiBiZSB1c2VkIGluIHRlbXBsYXRlcyB0b29cbiAgICB2YXIgJGRhdGFCaW5kaW5nID0gY29tcGlsZXIuYmluZGluZ3NbJyRkYXRhJ10gPSBuZXcgQmluZGluZyhjb21waWxlciwgJyRkYXRhJylcbiAgICAkZGF0YUJpbmRpbmcudXBkYXRlKGRhdGEpXG5cbiAgICAvLyBhbGxvdyAkZGF0YSB0byBiZSBzd2FwcGVkXG4gICAgZGVmKGNvbXBpbGVyLnZtLCAnJGRhdGEnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tcGlsZXIub2JzZXJ2ZXIuZW1pdCgnZ2V0JywgJyRkYXRhJylcbiAgICAgICAgICAgIHJldHVybiBjb21waWxlci5kYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBvbGREYXRhID0gY29tcGlsZXIuZGF0YVxuICAgICAgICAgICAgT2JzZXJ2ZXIudW5vYnNlcnZlKG9sZERhdGEsICcnLCBvYnNlcnZlcilcbiAgICAgICAgICAgIGNvbXBpbGVyLmRhdGEgPSBuZXdEYXRhXG4gICAgICAgICAgICBPYnNlcnZlci5jb3B5UGF0aHMobmV3RGF0YSwgb2xkRGF0YSlcbiAgICAgICAgICAgIE9ic2VydmVyLm9ic2VydmUobmV3RGF0YSwgJycsIG9ic2VydmVyKVxuICAgICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBlbWl0ICRkYXRhIGNoYW5nZSBvbiBhbGwgY2hhbmdlc1xuICAgIG9ic2VydmVyXG4gICAgICAgIC5vbignc2V0Jywgb25TZXQpXG4gICAgICAgIC5vbignbXV0YXRlJywgb25TZXQpXG5cbiAgICBmdW5jdGlvbiBvblNldCAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgIT09ICckZGF0YScpIHVwZGF0ZSgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlICgpIHtcbiAgICAgICAgJGRhdGFCaW5kaW5nLnVwZGF0ZShjb21waWxlci5kYXRhKVxuICAgICAgICBvYnNlcnZlci5lbWl0KCdjaGFuZ2U6JGRhdGEnLCBjb21waWxlci5kYXRhKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ29tcGlsZSBhIERPTSBub2RlIChyZWN1cnNpdmUpXG4gKi9cbkNvbXBpbGVyUHJvdG8uY29tcGlsZSA9IGZ1bmN0aW9uIChub2RlLCByb290KSB7XG4gICAgdmFyIG5vZGVUeXBlID0gbm9kZS5ub2RlVHlwZVxuICAgIGlmIChub2RlVHlwZSA9PT0gMSAmJiBub2RlLnRhZ05hbWUgIT09ICdTQ1JJUFQnKSB7IC8vIGEgbm9ybWFsIG5vZGVcbiAgICAgICAgdGhpcy5jb21waWxlRWxlbWVudChub2RlLCByb290KVxuICAgIH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDMgJiYgY29uZmlnLmludGVycG9sYXRlKSB7XG4gICAgICAgIHRoaXMuY29tcGlsZVRleHROb2RlKG5vZGUpXG4gICAgfVxufVxuXG4vKipcbiAqICBDaGVjayBmb3IgYSBwcmlvcml0eSBkaXJlY3RpdmVcbiAqICBJZiBpdCBpcyBwcmVzZW50IGFuZCB2YWxpZCwgcmV0dXJuIHRydWUgdG8gc2tpcCB0aGUgcmVzdFxuICovXG5Db21waWxlclByb3RvLmNoZWNrUHJpb3JpdHlEaXIgPSBmdW5jdGlvbiAoZGlybmFtZSwgbm9kZSwgcm9vdCkge1xuICAgIHZhciBleHByZXNzaW9uLCBkaXJlY3RpdmUsIEN0b3JcbiAgICBpZiAoXG4gICAgICAgIGRpcm5hbWUgPT09ICdjb21wb25lbnQnICYmXG4gICAgICAgIHJvb3QgIT09IHRydWUgJiZcbiAgICAgICAgKEN0b3IgPSB0aGlzLnJlc29sdmVDb21wb25lbnQobm9kZSwgdW5kZWZpbmVkLCB0cnVlKSlcbiAgICApIHtcbiAgICAgICAgZGlyZWN0aXZlID0gdGhpcy5wYXJzZURpcmVjdGl2ZShkaXJuYW1lLCAnJywgbm9kZSlcbiAgICAgICAgZGlyZWN0aXZlLkN0b3IgPSBDdG9yXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXhwcmVzc2lvbiA9IHV0aWxzLmF0dHIobm9kZSwgZGlybmFtZSlcbiAgICAgICAgZGlyZWN0aXZlID0gZXhwcmVzc2lvbiAmJiB0aGlzLnBhcnNlRGlyZWN0aXZlKGRpcm5hbWUsIGV4cHJlc3Npb24sIG5vZGUpXG4gICAgfVxuICAgIGlmIChkaXJlY3RpdmUpIHtcbiAgICAgICAgaWYgKHJvb3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oXG4gICAgICAgICAgICAgICAgJ0RpcmVjdGl2ZSB2LScgKyBkaXJuYW1lICsgJyBjYW5ub3QgYmUgdXNlZCBvbiBhbiBhbHJlYWR5IGluc3RhbnRpYXRlZCAnICtcbiAgICAgICAgICAgICAgICAnVk1cXCdzIHJvb3Qgbm9kZS4gVXNlIGl0IGZyb20gdGhlIHBhcmVudFxcJ3MgdGVtcGxhdGUgaW5zdGVhZC4nXG4gICAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmVycmVkLnB1c2goZGlyZWN0aXZlKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ29tcGlsZSBub3JtYWwgZGlyZWN0aXZlcyBvbiBhIG5vZGVcbiAqL1xuQ29tcGlsZXJQcm90by5jb21waWxlRWxlbWVudCA9IGZ1bmN0aW9uIChub2RlLCByb290KSB7XG5cbiAgICAvLyB0ZXh0YXJlYSBpcyBwcmV0dHkgYW5ub3lpbmdcbiAgICAvLyBiZWNhdXNlIGl0cyB2YWx1ZSBjcmVhdGVzIGNoaWxkTm9kZXMgd2hpY2hcbiAgICAvLyB3ZSBkb24ndCB3YW50IHRvIGNvbXBpbGUuXG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyAmJiBub2RlLnZhbHVlKSB7XG4gICAgICAgIG5vZGUudmFsdWUgPSB0aGlzLmV2YWwobm9kZS52YWx1ZSlcbiAgICB9XG5cbiAgICAvLyBvbmx5IGNvbXBpbGUgaWYgdGhpcyBlbGVtZW50IGhhcyBhdHRyaWJ1dGVzXG4gICAgLy8gb3IgaXRzIHRhZ05hbWUgY29udGFpbnMgYSBoeXBoZW4gKHdoaWNoIG1lYW5zIGl0IGNvdWxkXG4gICAgLy8gcG90ZW50aWFsbHkgYmUgYSBjdXN0b20gZWxlbWVudClcbiAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGVzKCkgfHwgbm9kZS50YWdOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cbiAgICAgICAgLy8gc2tpcCBhbnl0aGluZyB3aXRoIHYtcHJlXG4gICAgICAgIGlmICh1dGlscy5hdHRyKG5vZGUsICdwcmUnKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSwgbCwgaiwga1xuXG4gICAgICAgIC8vIGNoZWNrIHByaW9yaXR5IGRpcmVjdGl2ZXMuXG4gICAgICAgIC8vIGlmIGFueSBvZiB0aGVtIGFyZSBwcmVzZW50LCBpdCB3aWxsIHRha2Ugb3ZlciB0aGUgbm9kZSB3aXRoIGEgY2hpbGRWTVxuICAgICAgICAvLyBzbyB3ZSBjYW4gc2tpcCB0aGUgcmVzdFxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gcHJpb3JpdHlEaXJlY3RpdmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQcmlvcml0eURpcihwcmlvcml0eURpcmVjdGl2ZXNbaV0sIG5vZGUsIHJvb3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayB0cmFuc2l0aW9uICYgYW5pbWF0aW9uIHByb3BlcnRpZXNcbiAgICAgICAgbm9kZS52dWVfdHJhbnMgID0gdXRpbHMuYXR0cihub2RlLCAndHJhbnNpdGlvbicpXG4gICAgICAgIG5vZGUudnVlX2FuaW0gICA9IHV0aWxzLmF0dHIobm9kZSwgJ2FuaW1hdGlvbicpXG4gICAgICAgIG5vZGUudnVlX2VmZmVjdCA9IHRoaXMuZXZhbCh1dGlscy5hdHRyKG5vZGUsICdlZmZlY3QnKSlcblxuICAgICAgICB2YXIgcHJlZml4ID0gY29uZmlnLnByZWZpeCArICctJyxcbiAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXMsXG4gICAgICAgICAgICBhdHRyLCBhdHRybmFtZSwgaXNEaXJlY3RpdmUsIGV4cCwgZGlyZWN0aXZlcywgZGlyZWN0aXZlLCBkaXJuYW1lXG5cbiAgICAgICAgLy8gdi13aXRoIGhhcyBzcGVjaWFsIHByaW9yaXR5IGFtb25nIHRoZSByZXN0XG4gICAgICAgIC8vIGl0IG5lZWRzIHRvIHB1bGwgaW4gdGhlIHZhbHVlIGZyb20gdGhlIHBhcmVudCBiZWZvcmVcbiAgICAgICAgLy8gY29tcHV0ZWQgcHJvcGVydGllcyBhcmUgZXZhbHVhdGVkLCBiZWNhdXNlIGF0IHRoaXMgc3RhZ2VcbiAgICAgICAgLy8gdGhlIGNvbXB1dGVkIHByb3BlcnRpZXMgaGF2ZSBub3Qgc2V0IHVwIHRoZWlyIGRlcGVuZGVuY2llcyB5ZXQuXG4gICAgICAgIGlmIChyb290KSB7XG4gICAgICAgICAgICB2YXIgd2l0aEV4cCA9IHV0aWxzLmF0dHIobm9kZSwgJ3dpdGgnKVxuICAgICAgICAgICAgaWYgKHdpdGhFeHApIHtcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzID0gdGhpcy5wYXJzZURpcmVjdGl2ZSgnd2l0aCcsIHdpdGhFeHAsIG5vZGUsIHRydWUpXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMCwgayA9IGRpcmVjdGl2ZXMubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmVzW2pdLCB0aGlzLnBhcmVudClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXR0cnMgPSBzbGljZS5jYWxsKG5vZGUuYXR0cmlidXRlcylcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaV1cbiAgICAgICAgICAgIGF0dHJuYW1lID0gYXR0ci5uYW1lXG4gICAgICAgICAgICBpc0RpcmVjdGl2ZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIChhdHRybmFtZS5pbmRleE9mKHByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhIGRpcmVjdGl2ZSAtIHNwbGl0LCBwYXJzZSBhbmQgYmluZCBpdC5cbiAgICAgICAgICAgICAgICBpc0RpcmVjdGl2ZSA9IHRydWVcbiAgICAgICAgICAgICAgICBkaXJuYW1lID0gYXR0cm5hbWUuc2xpY2UocHJlZml4Lmxlbmd0aClcbiAgICAgICAgICAgICAgICAvLyBidWlsZCB3aXRoIG11bHRpcGxlOiB0cnVlXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcyA9IHRoaXMucGFyc2VEaXJlY3RpdmUoZGlybmFtZSwgYXR0ci52YWx1ZSwgbm9kZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggY2xhdXNlcyAoc2VwYXJhdGVkIGJ5IFwiLFwiKVxuICAgICAgICAgICAgICAgIC8vIGluc2lkZSBlYWNoIGF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGsgPSBkaXJlY3RpdmVzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlc1tqXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vIG5vbiBkaXJlY3RpdmUgYXR0cmlidXRlLCBjaGVjayBpbnRlcnBvbGF0aW9uIHRhZ3NcbiAgICAgICAgICAgICAgICBleHAgPSBUZXh0UGFyc2VyLnBhcnNlQXR0cihhdHRyLnZhbHVlKVxuICAgICAgICAgICAgICAgIGlmIChleHApIHtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlID0gdGhpcy5wYXJzZURpcmVjdGl2ZSgnYXR0cicsIGV4cCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlLmFyZyA9IGF0dHJuYW1lXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLmluZGV4T2YoYXR0cm5hbWUpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgcGFyYW0gYXR0cmlidXRlLi4uIHdlIHNob3VsZCB1c2UgdGhlIHBhcmVudCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBhdm9pZCBjaXJjdWxhciB1cGRhdGVzIGxpa2Ugc2l6ZT17e3NpemV9fVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZSwgdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNEaXJlY3RpdmUgJiYgZGlybmFtZSAhPT0gJ2Nsb2FrJykge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyByZWN1cnNpdmVseSBjb21waWxlIGNoaWxkTm9kZXNcbiAgICBpZiAobm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgc2xpY2UuY2FsbChub2RlLmNoaWxkTm9kZXMpLmZvckVhY2godGhpcy5jb21waWxlLCB0aGlzKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ29tcGlsZSBhIHRleHQgbm9kZVxuICovXG5Db21waWxlclByb3RvLmNvbXBpbGVUZXh0Tm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG5cbiAgICB2YXIgdG9rZW5zID0gVGV4dFBhcnNlci5wYXJzZShub2RlLm5vZGVWYWx1ZSlcbiAgICBpZiAoIXRva2VucykgcmV0dXJuXG4gICAgdmFyIGVsLCB0b2tlbiwgZGlyZWN0aXZlXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblxuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgICBkaXJlY3RpdmUgPSBudWxsXG5cbiAgICAgICAgaWYgKHRva2VuLmtleSkgeyAvLyBhIGJpbmRpbmdcbiAgICAgICAgICAgIGlmICh0b2tlbi5rZXkuY2hhckF0KDApID09PSAnPicpIHsgLy8gYSBwYXJ0aWFsXG4gICAgICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCdyZWYnKVxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ3BhcnRpYWwnLCB0b2tlbi5rZXkuc2xpY2UoMSksIGVsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuLmh0bWwpIHsgLy8gdGV4dCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ3RleHQnLCB0b2tlbi5rZXksIGVsKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGh0bWwgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoY29uZmlnLnByZWZpeCArICctaHRtbCcpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ2h0bWwnLCB0b2tlbi5rZXksIGVsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gYSBwbGFpbiBzdHJpbmdcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4pXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnNlcnQgbm9kZVxuICAgICAgICBub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCBub2RlKVxuICAgICAgICAvLyBiaW5kIGRpcmVjdGl2ZVxuICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlKVxuXG4gICAgfVxuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKVxufVxuXG4vKipcbiAqICBQYXJzZSBhIGRpcmVjdGl2ZSBuYW1lL3ZhbHVlIHBhaXIgaW50byBvbmUgb3IgbW9yZVxuICogIGRpcmVjdGl2ZSBpbnN0YW5jZXNcbiAqL1xuQ29tcGlsZXJQcm90by5wYXJzZURpcmVjdGl2ZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgZWwsIG11bHRpcGxlKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgZGVmaW5pdGlvbiA9IGNvbXBpbGVyLmdldE9wdGlvbignZGlyZWN0aXZlcycsIG5hbWUpXG4gICAgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgICAgLy8gcGFyc2UgaW50byBBU1QtbGlrZSBvYmplY3RzXG4gICAgICAgIHZhciBhc3RzID0gRGlyZWN0aXZlLnBhcnNlKHZhbHVlKVxuICAgICAgICByZXR1cm4gbXVsdGlwbGVcbiAgICAgICAgICAgID8gYXN0cy5tYXAoYnVpbGQpXG4gICAgICAgICAgICA6IGJ1aWxkKGFzdHNbMF0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkIChhc3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3RpdmUobmFtZSwgYXN0LCBkZWZpbml0aW9uLCBjb21waWxlciwgZWwpXG4gICAgfVxufVxuXG4vKipcbiAqICBBZGQgYSBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGNvcnJlY3QgYmluZGluZyAmIHZpZXdtb2RlbFxuICovXG5Db21waWxlclByb3RvLmJpbmREaXJlY3RpdmUgPSBmdW5jdGlvbiAoZGlyZWN0aXZlLCBiaW5kaW5nT3duZXIpIHtcblxuICAgIGlmICghZGlyZWN0aXZlKSByZXR1cm5cblxuICAgIC8vIGtlZXAgdHJhY2sgb2YgaXQgc28gd2UgY2FuIHVuYmluZCgpIGxhdGVyXG4gICAgdGhpcy5kaXJzLnB1c2goZGlyZWN0aXZlKVxuXG4gICAgLy8gZm9yIGVtcHR5IG9yIGxpdGVyYWwgZGlyZWN0aXZlcywgc2ltcGx5IGNhbGwgaXRzIGJpbmQoKVxuICAgIC8vIGFuZCB3ZSdyZSBkb25lLlxuICAgIGlmIChkaXJlY3RpdmUuaXNFbXB0eSB8fCBkaXJlY3RpdmUuaXNMaXRlcmFsKSB7XG4gICAgICAgIGlmIChkaXJlY3RpdmUuYmluZCkgZGlyZWN0aXZlLmJpbmQoKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UsIHdlIGdvdCBtb3JlIHdvcmsgdG8gZG8uLi5cbiAgICB2YXIgYmluZGluZyxcbiAgICAgICAgY29tcGlsZXIgPSBiaW5kaW5nT3duZXIgfHwgdGhpcyxcbiAgICAgICAga2V5ICAgICAgPSBkaXJlY3RpdmUua2V5XG5cbiAgICBpZiAoZGlyZWN0aXZlLmlzRXhwKSB7XG4gICAgICAgIC8vIGV4cHJlc3Npb24gYmluZGluZ3MgYXJlIGFsd2F5cyBjcmVhdGVkIG9uIGN1cnJlbnQgY29tcGlsZXJcbiAgICAgICAgYmluZGluZyA9IGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5LCBkaXJlY3RpdmUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgbG9jYXRlIHdoaWNoIGNvbXBpbGVyIG93bnMgdGhlIGJpbmRpbmdcbiAgICAgICAgd2hpbGUgKGNvbXBpbGVyKSB7XG4gICAgICAgICAgICBpZiAoY29tcGlsZXIuaGFzS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21waWxlciA9IGNvbXBpbGVyLnBhcmVudFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGVyID0gY29tcGlsZXIgfHwgdGhpc1xuICAgICAgICBiaW5kaW5nID0gY29tcGlsZXIuYmluZGluZ3Nba2V5XSB8fCBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSlcbiAgICB9XG4gICAgYmluZGluZy5kaXJzLnB1c2goZGlyZWN0aXZlKVxuICAgIGRpcmVjdGl2ZS5iaW5kaW5nID0gYmluZGluZ1xuXG4gICAgdmFyIHZhbHVlID0gYmluZGluZy52YWwoKVxuICAgIC8vIGludm9rZSBiaW5kIGhvb2sgaWYgZXhpc3RzXG4gICAgaWYgKGRpcmVjdGl2ZS5iaW5kKSB7XG4gICAgICAgIGRpcmVjdGl2ZS5iaW5kKHZhbHVlKVxuICAgIH1cbiAgICAvLyBzZXQgaW5pdGlhbCB2YWx1ZVxuICAgIGRpcmVjdGl2ZS4kdXBkYXRlKHZhbHVlLCB0cnVlKVxufVxuXG4vKipcbiAqICBDcmVhdGUgYmluZGluZyBhbmQgYXR0YWNoIGdldHRlci9zZXR0ZXIgZm9yIGEga2V5IHRvIHRoZSB2aWV3bW9kZWwgb2JqZWN0XG4gKi9cbkNvbXBpbGVyUHJvdG8uY3JlYXRlQmluZGluZyA9IGZ1bmN0aW9uIChrZXksIGRpcmVjdGl2ZSkge1xuXG4gICAgdXRpbHMubG9nKCcgIGNyZWF0ZWQgYmluZGluZzogJyArIGtleSlcblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIG1ldGhvZHMgID0gY29tcGlsZXIub3B0aW9ucy5tZXRob2RzLFxuICAgICAgICBpc0V4cCAgICA9IGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuaXNFeHAsXG4gICAgICAgIGlzRm4gICAgID0gKGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuaXNGbikgfHwgKG1ldGhvZHMgJiYgbWV0aG9kc1trZXldKSxcbiAgICAgICAgYmluZGluZ3MgPSBjb21waWxlci5iaW5kaW5ncyxcbiAgICAgICAgY29tcHV0ZWQgPSBjb21waWxlci5vcHRpb25zLmNvbXB1dGVkLFxuICAgICAgICBiaW5kaW5nICA9IG5ldyBCaW5kaW5nKGNvbXBpbGVyLCBrZXksIGlzRXhwLCBpc0ZuKVxuXG4gICAgaWYgKGlzRXhwKSB7XG4gICAgICAgIC8vIGV4cHJlc3Npb24gYmluZGluZ3MgYXJlIGFub255bW91c1xuICAgICAgICBjb21waWxlci5kZWZpbmVFeHAoa2V5LCBiaW5kaW5nLCBkaXJlY3RpdmUpXG4gICAgfSBlbHNlIGlmIChpc0ZuKSB7XG4gICAgICAgIGJpbmRpbmdzW2tleV0gPSBiaW5kaW5nXG4gICAgICAgIGNvbXBpbGVyLmRlZmluZVZtUHJvcChrZXksIGJpbmRpbmcsIG1ldGhvZHNba2V5XSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBiaW5kaW5nc1trZXldID0gYmluZGluZ1xuICAgICAgICBpZiAoYmluZGluZy5yb290KSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIGEgcm9vdCBsZXZlbCBiaW5kaW5nLiB3ZSBuZWVkIHRvIGRlZmluZSBnZXR0ZXIvc2V0dGVycyBmb3IgaXQuXG4gICAgICAgICAgICBpZiAoY29tcHV0ZWQgJiYgY29tcHV0ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgY29tcGlsZXIuZGVmaW5lQ29tcHV0ZWQoa2V5LCBiaW5kaW5nLCBjb21wdXRlZFtrZXldKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkuY2hhckF0KDApICE9PSAnJCcpIHtcbiAgICAgICAgICAgICAgICAvLyBub3JtYWwgcHJvcGVydHlcbiAgICAgICAgICAgICAgICBjb21waWxlci5kZWZpbmVEYXRhUHJvcChrZXksIGJpbmRpbmcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgdGhhdCBzdGFydCB3aXRoICQgYXJlIG1ldGEgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIC8vIHRoZXkgc2hvdWxkIGJlIGtlcHQgb24gdGhlIHZtIGJ1dCBub3QgaW4gdGhlIGRhdGEgb2JqZWN0LlxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlZmluZVZtUHJvcChrZXksIGJpbmRpbmcsIGNvbXBpbGVyLmRhdGFba2V5XSlcbiAgICAgICAgICAgICAgICBkZWxldGUgY29tcGlsZXIuZGF0YVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY29tcHV0ZWQgJiYgY29tcHV0ZWRbdXRpbHMuYmFzZUtleShrZXkpXSkge1xuICAgICAgICAgICAgLy8gbmVzdGVkIHBhdGggb24gY29tcHV0ZWQgcHJvcGVydHlcbiAgICAgICAgICAgIGNvbXBpbGVyLmRlZmluZUV4cChrZXksIGJpbmRpbmcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbnN1cmUgcGF0aCBpbiBkYXRhIHNvIHRoYXQgY29tcHV0ZWQgcHJvcGVydGllcyB0aGF0XG4gICAgICAgICAgICAvLyBhY2Nlc3MgdGhlIHBhdGggZG9uJ3QgdGhyb3cgYW4gZXJyb3IgYW5kIGNhbiBjb2xsZWN0XG4gICAgICAgICAgICAvLyBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIE9ic2VydmVyLmVuc3VyZVBhdGgoY29tcGlsZXIuZGF0YSwga2V5KVxuICAgICAgICAgICAgdmFyIHBhcmVudEtleSA9IGtleS5zbGljZSgwLCBrZXkubGFzdEluZGV4T2YoJy4nKSlcbiAgICAgICAgICAgIGlmICghYmluZGluZ3NbcGFyZW50S2V5XSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgYSBuZXN0ZWQgdmFsdWUgYmluZGluZywgYnV0IHRoZSBiaW5kaW5nIGZvciBpdHMgcGFyZW50XG4gICAgICAgICAgICAgICAgLy8gaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0LiBXZSBiZXR0ZXIgY3JlYXRlIHRoYXQgb25lIHRvby5cbiAgICAgICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKHBhcmVudEtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmluZGluZ1xufVxuXG4vKipcbiAqICBEZWZpbmUgdGhlIGdldHRlci9zZXR0ZXIgdG8gcHJveHkgYSByb290LWxldmVsXG4gKiAgZGF0YSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqL1xuQ29tcGlsZXJQcm90by5kZWZpbmVEYXRhUHJvcCA9IGZ1bmN0aW9uIChrZXksIGJpbmRpbmcpIHtcbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBkYXRhICAgICA9IGNvbXBpbGVyLmRhdGEsXG4gICAgICAgIG9iICAgICAgID0gZGF0YS5fX2VtaXR0ZXJfX1xuXG4gICAgLy8gbWFrZSBzdXJlIHRoZSBrZXkgaXMgcHJlc2VudCBpbiBkYXRhXG4gICAgLy8gc28gaXQgY2FuIGJlIG9ic2VydmVkXG4gICAgaWYgKCEoaGFzT3duLmNhbGwoZGF0YSwga2V5KSkpIHtcbiAgICAgICAgZGF0YVtrZXldID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRhdGEgb2JqZWN0IGlzIGFscmVhZHkgb2JzZXJ2ZWQsIGJ1dCB0aGUga2V5XG4gICAgLy8gaXMgbm90IG9ic2VydmVkLCB3ZSBuZWVkIHRvIGFkZCBpdCB0byB0aGUgb2JzZXJ2ZWQga2V5cy5cbiAgICBpZiAob2IgJiYgIShoYXNPd24uY2FsbChvYi52YWx1ZXMsIGtleSkpKSB7XG4gICAgICAgIE9ic2VydmVyLmNvbnZlcnRLZXkoZGF0YSwga2V5KVxuICAgIH1cblxuICAgIGJpbmRpbmcudmFsdWUgPSBkYXRhW2tleV1cblxuICAgIGRlZihjb21waWxlci52bSwga2V5LCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBpbGVyLmRhdGFba2V5XVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmRhdGFba2V5XSA9IHZhbFxuICAgICAgICB9XG4gICAgfSlcbn1cblxuLyoqXG4gKiAgRGVmaW5lIGEgdm0gcHJvcGVydHksIGUuZy4gJGluZGV4LCAka2V5LCBvciBtaXhpbiBtZXRob2RzXG4gKiAgd2hpY2ggYXJlIGJpbmRhYmxlIGJ1dCBvbmx5IGFjY2Vzc2libGUgb24gdGhlIFZNLFxuICogIG5vdCBpbiB0aGUgZGF0YS5cbiAqL1xuQ29tcGlsZXJQcm90by5kZWZpbmVWbVByb3AgPSBmdW5jdGlvbiAoa2V5LCBiaW5kaW5nLCB2YWx1ZSkge1xuICAgIHZhciBvYiA9IHRoaXMub2JzZXJ2ZXJcbiAgICBiaW5kaW5nLnZhbHVlID0gdmFsdWVcbiAgICBkZWYodGhpcy52bSwga2V5LCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKE9ic2VydmVyLnNob3VsZEdldCkgb2IuZW1pdCgnZ2V0Jywga2V5KVxuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmcudmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBvYi5lbWl0KCdzZXQnLCBrZXksIHZhbClcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICogIERlZmluZSBhbiBleHByZXNzaW9uIGJpbmRpbmcsIHdoaWNoIGlzIGVzc2VudGlhbGx5XG4gKiAgYW4gYW5vbnltb3VzIGNvbXB1dGVkIHByb3BlcnR5XG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lRXhwID0gZnVuY3Rpb24gKGtleSwgYmluZGluZywgZGlyZWN0aXZlKSB7XG4gICAgdmFyIGNvbXB1dGVkS2V5ID0gZGlyZWN0aXZlICYmIGRpcmVjdGl2ZS5jb21wdXRlZEtleSxcbiAgICAgICAgZXhwICAgICAgICAgPSBjb21wdXRlZEtleSA/IGRpcmVjdGl2ZS5leHByZXNzaW9uIDoga2V5LFxuICAgICAgICBnZXR0ZXIgICAgICA9IHRoaXMuZXhwQ2FjaGVbZXhwXVxuICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIGdldHRlciA9IHRoaXMuZXhwQ2FjaGVbZXhwXSA9IEV4cFBhcnNlci5wYXJzZShjb21wdXRlZEtleSB8fCBrZXksIHRoaXMpXG4gICAgfVxuICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgdGhpcy5tYXJrQ29tcHV0ZWQoYmluZGluZywgZ2V0dGVyKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgRGVmaW5lIGEgY29tcHV0ZWQgcHJvcGVydHkgb24gdGhlIFZNXG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lQ29tcHV0ZWQgPSBmdW5jdGlvbiAoa2V5LCBiaW5kaW5nLCB2YWx1ZSkge1xuICAgIHRoaXMubWFya0NvbXB1dGVkKGJpbmRpbmcsIHZhbHVlKVxuICAgIGRlZih0aGlzLnZtLCBrZXksIHtcbiAgICAgICAgZ2V0OiBiaW5kaW5nLnZhbHVlLiRnZXQsXG4gICAgICAgIHNldDogYmluZGluZy52YWx1ZS4kc2V0XG4gICAgfSlcbn1cblxuLyoqXG4gKiAgUHJvY2VzcyBhIGNvbXB1dGVkIHByb3BlcnR5IGJpbmRpbmdcbiAqICBzbyBpdHMgZ2V0dGVyL3NldHRlciBhcmUgYm91bmQgdG8gcHJvcGVyIGNvbnRleHRcbiAqL1xuQ29tcGlsZXJQcm90by5tYXJrQ29tcHV0ZWQgPSBmdW5jdGlvbiAoYmluZGluZywgdmFsdWUpIHtcbiAgICBiaW5kaW5nLmlzQ29tcHV0ZWQgPSB0cnVlXG4gICAgLy8gYmluZCB0aGUgYWNjZXNzb3JzIHRvIHRoZSB2bVxuICAgIGlmIChiaW5kaW5nLmlzRm4pIHtcbiAgICAgICAgYmluZGluZy52YWx1ZSA9IHZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFsdWUgPSB7ICRnZXQ6IHZhbHVlIH1cbiAgICAgICAgfVxuICAgICAgICBiaW5kaW5nLnZhbHVlID0ge1xuICAgICAgICAgICAgJGdldDogdXRpbHMuYmluZCh2YWx1ZS4kZ2V0LCB0aGlzLnZtKSxcbiAgICAgICAgICAgICRzZXQ6IHZhbHVlLiRzZXRcbiAgICAgICAgICAgICAgICA/IHV0aWxzLmJpbmQodmFsdWUuJHNldCwgdGhpcy52bSlcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGtlZXAgdHJhY2sgZm9yIGRlcCBwYXJzaW5nIGxhdGVyXG4gICAgdGhpcy5jb21wdXRlZC5wdXNoKGJpbmRpbmcpXG59XG5cbi8qKlxuICogIFJldHJpdmUgYW4gb3B0aW9uIGZyb20gdGhlIGNvbXBpbGVyXG4gKi9cbkNvbXBpbGVyUHJvdG8uZ2V0T3B0aW9uID0gZnVuY3Rpb24gKHR5cGUsIGlkLCBzaWxlbnQpIHtcbiAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgcGFyZW50ID0gdGhpcy5wYXJlbnQsXG4gICAgICAgIGdsb2JhbEFzc2V0cyA9IGNvbmZpZy5nbG9iYWxBc3NldHMsXG4gICAgICAgIHJlcyA9IChvcHRzW3R5cGVdICYmIG9wdHNbdHlwZV1baWRdKSB8fCAoXG4gICAgICAgICAgICBwYXJlbnRcbiAgICAgICAgICAgICAgICA/IHBhcmVudC5nZXRPcHRpb24odHlwZSwgaWQsIHNpbGVudClcbiAgICAgICAgICAgICAgICA6IGdsb2JhbEFzc2V0c1t0eXBlXSAmJiBnbG9iYWxBc3NldHNbdHlwZV1baWRdXG4gICAgICAgIClcbiAgICBpZiAoIXJlcyAmJiAhc2lsZW50ICYmIHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdXRpbHMud2FybignVW5rbm93biAnICsgdHlwZS5zbGljZSgwLCAtMSkgKyAnOiAnICsgaWQpXG4gICAgfVxuICAgIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiAgRW1pdCBsaWZlY3ljbGUgZXZlbnRzIHRvIHRyaWdnZXIgaG9va3NcbiAqL1xuQ29tcGlsZXJQcm90by5leGVjSG9vayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50ID0gJ2hvb2s6JyArIGV2ZW50XG4gICAgdGhpcy5vYnNlcnZlci5lbWl0KGV2ZW50KVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KGV2ZW50KVxufVxuXG4vKipcbiAqICBDaGVjayBpZiBhIGNvbXBpbGVyJ3MgZGF0YSBjb250YWlucyBhIGtleXBhdGhcbiAqL1xuQ29tcGlsZXJQcm90by5oYXNLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGJhc2VLZXkgPSB1dGlscy5iYXNlS2V5KGtleSlcbiAgICByZXR1cm4gaGFzT3duLmNhbGwodGhpcy5kYXRhLCBiYXNlS2V5KSB8fFxuICAgICAgICBoYXNPd24uY2FsbCh0aGlzLnZtLCBiYXNlS2V5KVxufVxuXG4vKipcbiAqICBEbyBhIG9uZS10aW1lIGV2YWwgb2YgYSBzdHJpbmcgdGhhdCBwb3RlbnRpYWxseVxuICogIGluY2x1ZGVzIGJpbmRpbmdzLiBJdCBhY2NlcHRzIGFkZGl0aW9uYWwgcmF3IGRhdGFcbiAqICBiZWNhdXNlIHdlIG5lZWQgdG8gZHluYW1pY2FsbHkgcmVzb2x2ZSB2LWNvbXBvbmVudFxuICogIGJlZm9yZSBhIGNoaWxkVk0gaXMgZXZlbiBjb21waWxlZC4uLlxuICovXG5Db21waWxlclByb3RvLmV2YWwgPSBmdW5jdGlvbiAoZXhwLCBkYXRhKSB7XG4gICAgdmFyIHBhcnNlZCA9IFRleHRQYXJzZXIucGFyc2VBdHRyKGV4cClcbiAgICByZXR1cm4gcGFyc2VkXG4gICAgICAgID8gRXhwUGFyc2VyLmV2YWwocGFyc2VkLCB0aGlzLCBkYXRhKVxuICAgICAgICA6IGV4cFxufVxuXG4vKipcbiAqICBSZXNvbHZlIGEgQ29tcG9uZW50IGNvbnN0cnVjdG9yIGZvciBhbiBlbGVtZW50XG4gKiAgd2l0aCB0aGUgZGF0YSB0byBiZSB1c2VkXG4gKi9cbkNvbXBpbGVyUHJvdG8ucmVzb2x2ZUNvbXBvbmVudCA9IGZ1bmN0aW9uIChub2RlLCBkYXRhLCB0ZXN0KSB7XG5cbiAgICAvLyBsYXRlIHJlcXVpcmUgdG8gYXZvaWQgY2lyY3VsYXIgZGVwc1xuICAgIFZpZXdNb2RlbCA9IFZpZXdNb2RlbCB8fCByZXF1aXJlKCcuL3ZpZXdtb2RlbCcpXG5cbiAgICB2YXIgZXhwICAgICA9IHV0aWxzLmF0dHIobm9kZSwgJ2NvbXBvbmVudCcpLFxuICAgICAgICB0YWdOYW1lID0gbm9kZS50YWdOYW1lLFxuICAgICAgICBpZCAgICAgID0gdGhpcy5ldmFsKGV4cCwgZGF0YSksXG4gICAgICAgIHRhZ0lkICAgPSAodGFnTmFtZS5pbmRleE9mKCctJykgPiAwICYmIHRhZ05hbWUudG9Mb3dlckNhc2UoKSksXG4gICAgICAgIEN0b3IgICAgPSB0aGlzLmdldE9wdGlvbignY29tcG9uZW50cycsIGlkIHx8IHRhZ0lkLCB0cnVlKVxuXG4gICAgaWYgKGlkICYmICFDdG9yKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ1Vua25vd24gY29tcG9uZW50OiAnICsgaWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRlc3RcbiAgICAgICAgPyBleHAgPT09ICcnXG4gICAgICAgICAgICA/IFZpZXdNb2RlbFxuICAgICAgICAgICAgOiBDdG9yXG4gICAgICAgIDogQ3RvciB8fCBWaWV3TW9kZWxcbn1cblxuLyoqXG4gKiAgVW5iaW5kIGFuZCByZW1vdmUgZWxlbWVudFxuICovXG5Db21waWxlclByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbiAobm9SZW1vdmUpIHtcblxuICAgIC8vIGF2b2lkIGJlaW5nIGNhbGxlZCBtb3JlIHRoYW4gb25jZVxuICAgIC8vIHRoaXMgaXMgaXJyZXZlcnNpYmxlIVxuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuXG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBpLCBqLCBrZXksIGRpciwgZGlycywgYmluZGluZyxcbiAgICAgICAgdm0gICAgICAgICAgPSBjb21waWxlci52bSxcbiAgICAgICAgZWwgICAgICAgICAgPSBjb21waWxlci5lbCxcbiAgICAgICAgZGlyZWN0aXZlcyAgPSBjb21waWxlci5kaXJzLFxuICAgICAgICBjb21wdXRlZCAgICA9IGNvbXBpbGVyLmNvbXB1dGVkLFxuICAgICAgICBiaW5kaW5ncyAgICA9IGNvbXBpbGVyLmJpbmRpbmdzLFxuICAgICAgICBjaGlsZHJlbiAgICA9IGNvbXBpbGVyLmNoaWxkcmVuLFxuICAgICAgICBwYXJlbnQgICAgICA9IGNvbXBpbGVyLnBhcmVudFxuXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ2JlZm9yZURlc3Ryb3knKVxuXG4gICAgLy8gdW5vYnNlcnZlIGRhdGFcbiAgICBPYnNlcnZlci51bm9ic2VydmUoY29tcGlsZXIuZGF0YSwgJycsIGNvbXBpbGVyLm9ic2VydmVyKVxuXG4gICAgLy8gZGVzdHJveSBhbGwgY2hpbGRyZW5cbiAgICAvLyBkbyBub3QgcmVtb3ZlIHRoZWlyIGVsZW1lbnRzIHNpbmNlIHRoZSBwYXJlbnRcbiAgICAvLyBtYXkgaGF2ZSB0cmFuc2l0aW9ucyBhbmQgdGhlIGNoaWxkcmVuIG1heSBub3RcbiAgICBpID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjaGlsZHJlbltpXS5kZXN0cm95KHRydWUpXG4gICAgfVxuXG4gICAgLy8gdW5iaW5kIGFsbCBkaXJlY2l0dmVzXG4gICAgaSA9IGRpcmVjdGl2ZXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBkaXIgPSBkaXJlY3RpdmVzW2ldXG4gICAgICAgIC8vIGlmIHRoaXMgZGlyZWN0aXZlIGlzIGFuIGluc3RhbmNlIG9mIGFuIGV4dGVybmFsIGJpbmRpbmdcbiAgICAgICAgLy8gZS5nLiBhIGRpcmVjdGl2ZSB0aGF0IHJlZmVycyB0byBhIHZhcmlhYmxlIG9uIHRoZSBwYXJlbnQgVk1cbiAgICAgICAgLy8gd2UgbmVlZCB0byByZW1vdmUgaXQgZnJvbSB0aGF0IGJpbmRpbmcncyBkaXJlY3RpdmVzXG4gICAgICAgIC8vICogZW1wdHkgYW5kIGxpdGVyYWwgYmluZGluZ3MgZG8gbm90IGhhdmUgYmluZGluZy5cbiAgICAgICAgaWYgKGRpci5iaW5kaW5nICYmIGRpci5iaW5kaW5nLmNvbXBpbGVyICE9PSBjb21waWxlcikge1xuICAgICAgICAgICAgZGlycyA9IGRpci5iaW5kaW5nLmRpcnNcbiAgICAgICAgICAgIGlmIChkaXJzKSB7XG4gICAgICAgICAgICAgICAgaiA9IGRpcnMuaW5kZXhPZihkaXIpXG4gICAgICAgICAgICAgICAgaWYgKGogPiAtMSkgZGlycy5zcGxpY2UoaiwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkaXIuJHVuYmluZCgpXG4gICAgfVxuXG4gICAgLy8gdW5iaW5kIGFsbCBjb21wdXRlZCwgYW5vbnltb3VzIGJpbmRpbmdzXG4gICAgaSA9IGNvbXB1dGVkLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29tcHV0ZWRbaV0udW5iaW5kKClcbiAgICB9XG5cbiAgICAvLyB1bmJpbmQgYWxsIGtleXBhdGggYmluZGluZ3NcbiAgICBmb3IgKGtleSBpbiBiaW5kaW5ncykge1xuICAgICAgICBiaW5kaW5nID0gYmluZGluZ3Nba2V5XVxuICAgICAgICBpZiAoYmluZGluZykge1xuICAgICAgICAgICAgYmluZGluZy51bmJpbmQoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHNlbGYgZnJvbSBwYXJlbnRcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGogPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihjb21waWxlcilcbiAgICAgICAgaWYgKGogPiAtMSkgcGFyZW50LmNoaWxkcmVuLnNwbGljZShqLCAxKVxuICAgIH1cblxuICAgIC8vIGZpbmFsbHkgcmVtb3ZlIGRvbSBlbGVtZW50XG4gICAgaWYgKCFub1JlbW92ZSkge1xuICAgICAgICBpZiAoZWwgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9ICcnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS4kcmVtb3ZlKClcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbC52dWVfdm0gPSBudWxsXG5cbiAgICBjb21waWxlci5kZXN0cm95ZWQgPSB0cnVlXG4gICAgLy8gZW1pdCBkZXN0cm95IGhvb2tcbiAgICBjb21waWxlci5leGVjSG9vaygnYWZ0ZXJEZXN0cm95JylcblxuICAgIC8vIGZpbmFsbHksIHVucmVnaXN0ZXIgYWxsIGxpc3RlbmVyc1xuICAgIGNvbXBpbGVyLm9ic2VydmVyLm9mZigpXG4gICAgY29tcGlsZXIuZW1pdHRlci5vZmYoKVxufVxuXG4vLyBIZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIHNob3J0aGFuZCBmb3IgZ2V0dGluZyByb290IGNvbXBpbGVyXG4gKi9cbmZ1bmN0aW9uIGdldFJvb3QgKGNvbXBpbGVyKSB7XG4gICAgd2hpbGUgKGNvbXBpbGVyLnBhcmVudCkge1xuICAgICAgICBjb21waWxlciA9IGNvbXBpbGVyLnBhcmVudFxuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZXJcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21waWxlciIsInZhciBUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi90ZXh0LXBhcnNlcicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByZWZpeCAgICAgICAgIDogJ3YnLFxuICAgIGRlYnVnICAgICAgICAgIDogZmFsc2UsXG4gICAgc2lsZW50ICAgICAgICAgOiBmYWxzZSxcbiAgICBlbnRlckNsYXNzICAgICA6ICd2LWVudGVyJyxcbiAgICBsZWF2ZUNsYXNzICAgICA6ICd2LWxlYXZlJyxcbiAgICBpbnRlcnBvbGF0ZSAgICA6IHRydWVcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnZGVsaW1pdGVycycsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFRleHRQYXJzZXIuZGVsaW1pdGVyc1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAoZGVsaW1pdGVycykge1xuICAgICAgICBUZXh0UGFyc2VyLnNldERlbGltaXRlcnMoZGVsaW1pdGVycylcbiAgICB9XG59KSIsInZhciBFbWl0dGVyICA9IHJlcXVpcmUoJy4vZW1pdHRlcicpLFxuICAgIHV0aWxzICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIE9ic2VydmVyID0gcmVxdWlyZSgnLi9vYnNlcnZlcicpLFxuICAgIGNhdGNoZXIgID0gbmV3IEVtaXR0ZXIoKVxuXG4vKipcbiAqICBBdXRvLWV4dHJhY3QgdGhlIGRlcGVuZGVuY2llcyBvZiBhIGNvbXB1dGVkIHByb3BlcnR5XG4gKiAgYnkgcmVjb3JkaW5nIHRoZSBnZXR0ZXJzIHRyaWdnZXJlZCB3aGVuIGV2YWx1YXRpbmcgaXQuXG4gKi9cbmZ1bmN0aW9uIGNhdGNoRGVwcyAoYmluZGluZykge1xuICAgIGlmIChiaW5kaW5nLmlzRm4pIHJldHVyblxuICAgIHV0aWxzLmxvZygnXFxuLSAnICsgYmluZGluZy5rZXkpXG4gICAgdmFyIGdvdCA9IHV0aWxzLmhhc2goKVxuICAgIGJpbmRpbmcuZGVwcyA9IFtdXG4gICAgY2F0Y2hlci5vbignZ2V0JywgZnVuY3Rpb24gKGRlcCkge1xuICAgICAgICB2YXIgaGFzID0gZ290W2RlcC5rZXldXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIGF2b2lkIGR1cGxpY2F0ZSBiaW5kaW5nc1xuICAgICAgICAgICAgKGhhcyAmJiBoYXMuY29tcGlsZXIgPT09IGRlcC5jb21waWxlcikgfHxcbiAgICAgICAgICAgIC8vIGF2b2lkIHJlcGVhdGVkIGl0ZW1zIGFzIGRlcGVuZGVuY3lcbiAgICAgICAgICAgIC8vIG9ubHkgd2hlbiB0aGUgYmluZGluZyBpcyBmcm9tIHNlbGYgb3IgdGhlIHBhcmVudCBjaGFpblxuICAgICAgICAgICAgKGRlcC5jb21waWxlci5yZXBlYXQgJiYgIWlzUGFyZW50T2YoZGVwLmNvbXBpbGVyLCBiaW5kaW5nLmNvbXBpbGVyKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBnb3RbZGVwLmtleV0gPSBkZXBcbiAgICAgICAgdXRpbHMubG9nKCcgIC0gJyArIGRlcC5rZXkpXG4gICAgICAgIGJpbmRpbmcuZGVwcy5wdXNoKGRlcClcbiAgICAgICAgZGVwLnN1YnMucHVzaChiaW5kaW5nKVxuICAgIH0pXG4gICAgYmluZGluZy52YWx1ZS4kZ2V0KClcbiAgICBjYXRjaGVyLm9mZignZ2V0Jylcbn1cblxuLyoqXG4gKiAgVGVzdCBpZiBBIGlzIGEgcGFyZW50IG9mIG9yIGVxdWFscyBCXG4gKi9cbmZ1bmN0aW9uIGlzUGFyZW50T2YgKGEsIGIpIHtcbiAgICB3aGlsZSAoYikge1xuICAgICAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBiID0gYi5wYXJlbnRcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLyoqXG4gICAgICogIHRoZSBvYnNlcnZlciB0aGF0IGNhdGNoZXMgZXZlbnRzIHRyaWdnZXJlZCBieSBnZXR0ZXJzXG4gICAgICovXG4gICAgY2F0Y2hlcjogY2F0Y2hlcixcblxuICAgIC8qKlxuICAgICAqICBwYXJzZSBhIGxpc3Qgb2YgY29tcHV0ZWQgcHJvcGVydHkgYmluZGluZ3NcbiAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKGJpbmRpbmdzKSB7XG4gICAgICAgIHV0aWxzLmxvZygnXFxucGFyc2luZyBkZXBlbmRlbmNpZXMuLi4nKVxuICAgICAgICBPYnNlcnZlci5zaG91bGRHZXQgPSB0cnVlXG4gICAgICAgIGJpbmRpbmdzLmZvckVhY2goY2F0Y2hEZXBzKVxuICAgICAgICBPYnNlcnZlci5zaG91bGRHZXQgPSBmYWxzZVxuICAgICAgICB1dGlscy5sb2coJ1xcbmRvbmUuJylcbiAgICB9XG4gICAgXG59IiwidmFyIGRpcklkICAgICAgICAgICA9IDEsXG4gICAgQVJHX1JFICAgICAgICAgID0gL15bXFx3XFwkLV0rJC8sXG4gICAgRklMVEVSX1RPS0VOX1JFID0gL1teXFxzJ1wiXSt8J1teJ10rJ3xcIlteXCJdK1wiL2csXG4gICAgTkVTVElOR19SRSAgICAgID0gL15cXCQocGFyZW50fHJvb3QpXFwuLyxcbiAgICBTSU5HTEVfVkFSX1JFICAgPSAvXltcXHdcXC4kXSskLyxcbiAgICBRVU9URV9SRSAgICAgICAgPSAvXCIvZyxcbiAgICBUZXh0UGFyc2VyICAgICAgPSByZXF1aXJlKCcuL3RleHQtcGFyc2VyJylcblxuLyoqXG4gKiAgRGlyZWN0aXZlIGNsYXNzXG4gKiAgcmVwcmVzZW50cyBhIHNpbmdsZSBkaXJlY3RpdmUgaW5zdGFuY2UgaW4gdGhlIERPTVxuICovXG5mdW5jdGlvbiBEaXJlY3RpdmUgKG5hbWUsIGFzdCwgZGVmaW5pdGlvbiwgY29tcGlsZXIsIGVsKSB7XG5cbiAgICB0aGlzLmlkICAgICAgICAgICAgID0gZGlySWQrK1xuICAgIHRoaXMubmFtZSAgICAgICAgICAgPSBuYW1lXG4gICAgdGhpcy5jb21waWxlciAgICAgICA9IGNvbXBpbGVyXG4gICAgdGhpcy52bSAgICAgICAgICAgICA9IGNvbXBpbGVyLnZtXG4gICAgdGhpcy5lbCAgICAgICAgICAgICA9IGVsXG4gICAgdGhpcy5jb21wdXRlRmlsdGVycyA9IGZhbHNlXG4gICAgdGhpcy5rZXkgICAgICAgICAgICA9IGFzdC5rZXlcbiAgICB0aGlzLmFyZyAgICAgICAgICAgID0gYXN0LmFyZ1xuICAgIHRoaXMuZXhwcmVzc2lvbiAgICAgPSBhc3QuZXhwcmVzc2lvblxuXG4gICAgdmFyIGlzRW1wdHkgPSB0aGlzLmV4cHJlc3Npb24gPT09ICcnXG5cbiAgICAvLyBtaXggaW4gcHJvcGVydGllcyBmcm9tIHRoZSBkaXJlY3RpdmUgZGVmaW5pdGlvblxuICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzW2lzRW1wdHkgPyAnYmluZCcgOiAndXBkYXRlJ10gPSBkZWZpbml0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkZWZpbml0aW9uKSB7XG4gICAgICAgICAgICB0aGlzW3Byb3BdID0gZGVmaW5pdGlvbltwcm9wXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZW1wdHkgZXhwcmVzc2lvbiwgd2UncmUgZG9uZS5cbiAgICBpZiAoaXNFbXB0eSB8fCB0aGlzLmlzRW1wdHkpIHtcbiAgICAgICAgdGhpcy5pc0VtcHR5ID0gdHJ1ZVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoVGV4dFBhcnNlci5SZWdleC50ZXN0KHRoaXMua2V5KSkge1xuICAgICAgICB0aGlzLmtleSA9IGNvbXBpbGVyLmV2YWwodGhpcy5rZXkpXG4gICAgICAgIGlmICh0aGlzLmlzTGl0ZXJhbCkge1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gdGhpcy5rZXlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBmaWx0ZXJzID0gYXN0LmZpbHRlcnMsXG4gICAgICAgIGZpbHRlciwgZm4sIGksIGwsIGNvbXB1dGVkXG4gICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW11cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSBmaWx0ZXJzW2ldXG4gICAgICAgICAgICBmbiA9IHRoaXMuY29tcGlsZXIuZ2V0T3B0aW9uKCdmaWx0ZXJzJywgZmlsdGVyLm5hbWUpXG4gICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXIuYXBwbHkgPSBmblxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycy5wdXNoKGZpbHRlcilcbiAgICAgICAgICAgICAgICBpZiAoZm4uY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmZpbHRlcnMgfHwgIXRoaXMuZmlsdGVycy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICB0aGlzLmNvbXB1dGVkS2V5ID0gRGlyZWN0aXZlLmlubGluZUZpbHRlcnModGhpcy5rZXksIHRoaXMuZmlsdGVycylcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gbnVsbFxuICAgIH1cblxuICAgIHRoaXMuaXNFeHAgPVxuICAgICAgICBjb21wdXRlZCB8fFxuICAgICAgICAhU0lOR0xFX1ZBUl9SRS50ZXN0KHRoaXMua2V5KSB8fFxuICAgICAgICBORVNUSU5HX1JFLnRlc3QodGhpcy5rZXkpXG5cbn1cblxudmFyIERpclByb3RvID0gRGlyZWN0aXZlLnByb3RvdHlwZVxuXG4vKipcbiAqICBjYWxsZWQgd2hlbiBhIG5ldyB2YWx1ZSBpcyBzZXQgXG4gKiAgZm9yIGNvbXB1dGVkIHByb3BlcnRpZXMsIHRoaXMgd2lsbCBvbmx5IGJlIGNhbGxlZCBvbmNlXG4gKiAgZHVyaW5nIGluaXRpYWxpemF0aW9uLlxuICovXG5EaXJQcm90by4kdXBkYXRlID0gZnVuY3Rpb24gKHZhbHVlLCBpbml0KSB7XG4gICAgaWYgKHRoaXMuJGxvY2spIHJldHVyblxuICAgIGlmIChpbml0IHx8IHZhbHVlICE9PSB0aGlzLnZhbHVlIHx8ICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcnMgJiYgIXRoaXMuY29tcHV0ZUZpbHRlcnNcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLiRhcHBseUZpbHRlcnModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgaW5pdFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBwaXBlIHRoZSB2YWx1ZSB0aHJvdWdoIGZpbHRlcnNcbiAqL1xuRGlyUHJvdG8uJGFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHZhbHVlLCBmaWx0ZXJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgZmlsdGVyID0gdGhpcy5maWx0ZXJzW2ldXG4gICAgICAgIGZpbHRlcmVkID0gZmlsdGVyLmFwcGx5LmFwcGx5KHRoaXMudm0sIFtmaWx0ZXJlZF0uY29uY2F0KGZpbHRlci5hcmdzKSlcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlcmVkXG59XG5cbi8qKlxuICogIFVuYmluZCBkaXJldGl2ZVxuICovXG5EaXJQcm90by4kdW5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIHRoaXMgY2FuIGJlIGNhbGxlZCBiZWZvcmUgdGhlIGVsIGlzIGV2ZW4gYXNzaWduZWQuLi5cbiAgICBpZiAoIXRoaXMuZWwgfHwgIXRoaXMudm0pIHJldHVyblxuICAgIGlmICh0aGlzLnVuYmluZCkgdGhpcy51bmJpbmQoKVxuICAgIHRoaXMudm0gPSB0aGlzLmVsID0gdGhpcy5iaW5kaW5nID0gdGhpcy5jb21waWxlciA9IG51bGxcbn1cblxuLy8gRXhwb3NlZCBzdGF0aWMgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBQYXJzZSBhIGRpcmVjdGl2ZSBzdHJpbmcgaW50byBhbiBBcnJheSBvZlxuICogIEFTVC1saWtlIG9iamVjdHMgcmVwcmVzZW50aW5nIGRpcmVjdGl2ZXNcbiAqL1xuRGlyZWN0aXZlLnBhcnNlID0gZnVuY3Rpb24gKHN0cikge1xuXG4gICAgdmFyIGluU2luZ2xlID0gZmFsc2UsXG4gICAgICAgIGluRG91YmxlID0gZmFsc2UsXG4gICAgICAgIGN1cmx5ICAgID0gMCxcbiAgICAgICAgc3F1YXJlICAgPSAwLFxuICAgICAgICBwYXJlbiAgICA9IDAsXG4gICAgICAgIGJlZ2luICAgID0gMCxcbiAgICAgICAgYXJnSW5kZXggPSAwLFxuICAgICAgICBkaXJzICAgICA9IFtdLFxuICAgICAgICBkaXIgICAgICA9IHt9LFxuICAgICAgICBsYXN0RmlsdGVySW5kZXggPSAwLFxuICAgICAgICBhcmdcblxuICAgIGZvciAodmFyIGMsIGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjID0gc3RyLmNoYXJBdChpKVxuICAgICAgICBpZiAoaW5TaW5nbGUpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIHNpbmdsZSBxdW90ZVxuICAgICAgICAgICAgaWYgKGMgPT09IFwiJ1wiKSBpblNpbmdsZSA9ICFpblNpbmdsZVxuICAgICAgICB9IGVsc2UgaWYgKGluRG91YmxlKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBkb3VibGUgcXVvdGVcbiAgICAgICAgICAgIGlmIChjID09PSAnXCInKSBpbkRvdWJsZSA9ICFpbkRvdWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICcsJyAmJiAhcGFyZW4gJiYgIWN1cmx5ICYmICFzcXVhcmUpIHtcbiAgICAgICAgICAgIC8vIHJlYWNoZWQgdGhlIGVuZCBvZiBhIGRpcmVjdGl2ZVxuICAgICAgICAgICAgcHVzaERpcigpXG4gICAgICAgICAgICAvLyByZXNldCAmIHNraXAgdGhlIGNvbW1hXG4gICAgICAgICAgICBkaXIgPSB7fVxuICAgICAgICAgICAgYmVnaW4gPSBhcmdJbmRleCA9IGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJzonICYmICFkaXIua2V5ICYmICFkaXIuYXJnKSB7XG4gICAgICAgICAgICAvLyBhcmd1bWVudFxuICAgICAgICAgICAgYXJnID0gc3RyLnNsaWNlKGJlZ2luLCBpKS50cmltKClcbiAgICAgICAgICAgIGlmIChBUkdfUkUudGVzdChhcmcpKSB7XG4gICAgICAgICAgICAgICAgYXJnSW5kZXggPSBpICsgMVxuICAgICAgICAgICAgICAgIGRpci5hcmcgPSBhcmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnfCcgJiYgc3RyLmNoYXJBdChpICsgMSkgIT09ICd8JyAmJiBzdHIuY2hhckF0KGkgLSAxKSAhPT0gJ3wnKSB7XG4gICAgICAgICAgICBpZiAoZGlyLmtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gZmlyc3QgZmlsdGVyLCBlbmQgb2Yga2V5XG4gICAgICAgICAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICAgICAgICAgICAgICBkaXIua2V5ID0gc3RyLnNsaWNlKGFyZ0luZGV4LCBpKS50cmltKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYWxyZWFkeSBoYXMgZmlsdGVyXG4gICAgICAgICAgICAgICAgcHVzaEZpbHRlcigpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1wiJykge1xuICAgICAgICAgICAgaW5Eb3VibGUgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgIGluU2luZ2xlID0gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICcoJykge1xuICAgICAgICAgICAgcGFyZW4rK1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICcpJykge1xuICAgICAgICAgICAgcGFyZW4tLVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICdbJykge1xuICAgICAgICAgICAgc3F1YXJlKytcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHNxdWFyZS0tXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ3snKSB7XG4gICAgICAgICAgICBjdXJseSsrXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ30nKSB7XG4gICAgICAgICAgICBjdXJseS0tXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGkgPT09IDAgfHwgYmVnaW4gIT09IGkpIHtcbiAgICAgICAgcHVzaERpcigpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaERpciAoKSB7XG4gICAgICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKGJlZ2luLCBpKS50cmltKClcbiAgICAgICAgaWYgKGRpci5rZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGlyLmtleSA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICAgIH0gZWxzZSBpZiAobGFzdEZpbHRlckluZGV4ICE9PSBiZWdpbikge1xuICAgICAgICAgICAgcHVzaEZpbHRlcigpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDAgfHwgZGlyLmtleSkge1xuICAgICAgICAgICAgZGlycy5wdXNoKGRpcilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHB1c2hGaWx0ZXIgKCkge1xuICAgICAgICB2YXIgZXhwID0gc3RyLnNsaWNlKGxhc3RGaWx0ZXJJbmRleCwgaSkudHJpbSgpLFxuICAgICAgICAgICAgZmlsdGVyXG4gICAgICAgIGlmIChleHApIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHt9XG4gICAgICAgICAgICB2YXIgdG9rZW5zID0gZXhwLm1hdGNoKEZJTFRFUl9UT0tFTl9SRSlcbiAgICAgICAgICAgIGZpbHRlci5uYW1lID0gdG9rZW5zWzBdXG4gICAgICAgICAgICBmaWx0ZXIuYXJncyA9IHRva2Vucy5sZW5ndGggPiAxID8gdG9rZW5zLnNsaWNlKDEpIDogbnVsbFxuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICAgIChkaXIuZmlsdGVycyA9IGRpci5maWx0ZXJzIHx8IFtdKS5wdXNoKGZpbHRlcilcbiAgICAgICAgfVxuICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgIH1cblxuICAgIHJldHVybiBkaXJzXG59XG5cbi8qKlxuICogIElubGluZSBjb21wdXRlZCBmaWx0ZXJzIHNvIHRoZXkgYmVjb21lIHBhcnRcbiAqICBvZiB0aGUgZXhwcmVzc2lvblxuICovXG5EaXJlY3RpdmUuaW5saW5lRmlsdGVycyA9IGZ1bmN0aW9uIChrZXksIGZpbHRlcnMpIHtcbiAgICB2YXIgYXJncywgZmlsdGVyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBmaWx0ZXIgPSBmaWx0ZXJzW2ldXG4gICAgICAgIGFyZ3MgPSBmaWx0ZXIuYXJnc1xuICAgICAgICAgICAgPyAnLFwiJyArIGZpbHRlci5hcmdzLm1hcChlc2NhcGVRdW90ZSkuam9pbignXCIsXCInKSArICdcIidcbiAgICAgICAgICAgIDogJydcbiAgICAgICAga2V5ID0gJ3RoaXMuJGNvbXBpbGVyLmdldE9wdGlvbihcImZpbHRlcnNcIiwgXCInICtcbiAgICAgICAgICAgICAgICBmaWx0ZXIubmFtZSArXG4gICAgICAgICAgICAnXCIpLmNhbGwodGhpcywnICtcbiAgICAgICAgICAgICAgICBrZXkgKyBhcmdzICtcbiAgICAgICAgICAgICcpJ1xuICAgIH1cbiAgICByZXR1cm4ga2V5XG59XG5cbi8qKlxuICogIENvbnZlcnQgZG91YmxlIHF1b3RlcyB0byBzaW5nbGUgcXVvdGVzXG4gKiAgc28gdGhleSBkb24ndCBtZXNzIHVwIHRoZSBnZW5lcmF0ZWQgZnVuY3Rpb24gYm9keVxuICovXG5mdW5jdGlvbiBlc2NhcGVRdW90ZSAodikge1xuICAgIHJldHVybiB2LmluZGV4T2YoJ1wiJykgPiAtMVxuICAgICAgICA/IHYucmVwbGFjZShRVU9URV9SRSwgJ1xcJycpXG4gICAgICAgIDogdlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXG4gICAgc2xpY2UgPSBbXS5zbGljZVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBpbm5lckhUTUxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGEgY29tbWVudCBub2RlIG1lYW5zIHRoaXMgaXMgYSBiaW5kaW5nIGZvclxuICAgICAgICAvLyB7e3sgaW5saW5lIHVuZXNjYXBlZCBodG1sIH19fVxuICAgICAgICBpZiAodGhpcy5lbC5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgICAgICAgLy8gaG9sZCBub2Rlc1xuICAgICAgICAgICAgdGhpcy5ub2RlcyA9IFtdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB1dGlscy5ndWFyZCh2YWx1ZSlcbiAgICAgICAgaWYgKHRoaXMubm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3dhcCh2YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzd2FwOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuZWwucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIG5vZGVzICA9IHRoaXMubm9kZXMsXG4gICAgICAgICAgICBpICAgICAgPSBub2Rlcy5sZW5ndGhcbiAgICAgICAgLy8gcmVtb3ZlIG9sZCBub2Rlc1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobm9kZXNbaV0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29udmVydCBuZXcgdmFsdWUgdG8gYSBmcmFnbWVudFxuICAgICAgICB2YXIgZnJhZyA9IHV0aWxzLnRvRnJhZ21lbnQodmFsdWUpXG4gICAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgdG8gdGhlc2Ugbm9kZXMgc28gd2UgY2FuIHJlbW92ZSBsYXRlclxuICAgICAgICB0aGlzLm5vZGVzID0gc2xpY2UuY2FsbChmcmFnLmNoaWxkTm9kZXMpXG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoZnJhZywgdGhpcy5lbClcbiAgICB9XG59IiwidmFyIHV0aWxzICAgID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vKipcbiAqICBNYW5hZ2VzIGEgY29uZGl0aW9uYWwgY2hpbGQgVk1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBhcmVudCA9IHRoaXMuZWwucGFyZW50Tm9kZVxuICAgICAgICB0aGlzLnJlZiAgICA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3Z1ZS1pZicpXG4gICAgICAgIHRoaXMuQ3RvciAgID0gdGhpcy5jb21waWxlci5yZXNvbHZlQ29tcG9uZW50KHRoaXMuZWwpXG5cbiAgICAgICAgLy8gaW5zZXJ0IHJlZlxuICAgICAgICB0aGlzLnBhcmVudC5pbnNlcnRCZWZvcmUodGhpcy5yZWYsIHRoaXMuZWwpXG4gICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuZWwpXG5cbiAgICAgICAgaWYgKHV0aWxzLmF0dHIodGhpcy5lbCwgJ3ZpZXcnKSkge1xuICAgICAgICAgICAgdXRpbHMud2FybihcbiAgICAgICAgICAgICAgICAnQ29uZmxpY3Q6IHYtaWYgY2Fubm90IGJlIHVzZWQgdG9nZXRoZXIgd2l0aCB2LXZpZXcuICcgK1xuICAgICAgICAgICAgICAgICdKdXN0IHNldCB2LXZpZXdcXCdzIGJpbmRpbmcgdmFsdWUgdG8gZW1wdHkgc3RyaW5nIHRvIGVtcHR5IGl0LidcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuYXR0cih0aGlzLmVsLCAncmVwZWF0JykpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oXG4gICAgICAgICAgICAgICAgJ0NvbmZsaWN0OiB2LWlmIGNhbm5vdCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggdi1yZXBlYXQuICcgK1xuICAgICAgICAgICAgICAgICdVc2UgYHYtc2hvd2Agb3IgdGhlIGBmaWx0ZXJCeWAgZmlsdGVyIGluc3RlYWQuJ1xuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy51bmJpbmQoKVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTSA9IG5ldyB0aGlzLkN0b3Ioe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLmVsLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbml0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuaW5zZXJ0QmVmb3JlKHRoaXMuY2hpbGRWTS4kZWwsIHRoaXMucmVmKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGJlZm9yZSh0aGlzLnJlZilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kZGVzdHJveSgpXG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0gPSBudWxsXG4gICAgICAgIH1cbiAgICB9XG59IiwidmFyIHV0aWxzICAgICAgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIGNvbmZpZyAgICAgPSByZXF1aXJlKCcuLi9jb25maWcnKSxcbiAgICB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpLFxuICAgIGRpcmVjdGl2ZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmhhc2goKVxuXG4vKipcbiAqICBOZXN0IGFuZCBtYW5hZ2UgYSBDaGlsZCBWTVxuICovXG5kaXJlY3RpdmVzLmNvbXBvbmVudCA9IHtcbiAgICBpc0xpdGVyYWw6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuZWwudnVlX3ZtKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0gPSBuZXcgdGhpcy5DdG9yKHtcbiAgICAgICAgICAgICAgICBlbDogdGhpcy5lbCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGRlc3Ryb3koKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBCaW5kaW5nIEhUTUwgYXR0cmlidXRlc1xuICovXG5kaXJlY3RpdmVzLmF0dHIgPSB7XG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy52bS4kb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgICAgICAgdGhpcy5pc1BhcmFtID0gcGFyYW1zICYmIHBhcmFtcy5pbmRleE9mKHRoaXMuYXJnKSA+IC0xXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgfHwgdmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKHRoaXMuYXJnLCB2YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXJnKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzUGFyYW0pIHtcbiAgICAgICAgICAgIHRoaXMudm1bdGhpcy5hcmddID0gdXRpbHMuY2hlY2tOdW1iZXIodmFsdWUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIEJpbmRpbmcgdGV4dENvbnRlbnRcbiAqL1xuZGlyZWN0aXZlcy50ZXh0ID0ge1xuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hdHRyID0gdGhpcy5lbC5ub2RlVHlwZSA9PT0gM1xuICAgICAgICAgICAgPyAnbm9kZVZhbHVlJ1xuICAgICAgICAgICAgOiAndGV4dENvbnRlbnQnXG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmVsW3RoaXMuYXR0cl0gPSB1dGlscy5ndWFyZCh2YWx1ZSlcbiAgICB9XG59XG5cbi8qKlxuICogIEJpbmRpbmcgQ1NTIGRpc3BsYXkgcHJvcGVydHlcbiAqL1xuZGlyZWN0aXZlcy5zaG93ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbCxcbiAgICAgICAgdGFyZ2V0ID0gdmFsdWUgPyAnJyA6ICdub25lJyxcbiAgICAgICAgY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHRhcmdldFxuICAgICAgICB9XG4gICAgdHJhbnNpdGlvbihlbCwgdmFsdWUgPyAxIDogLTEsIGNoYW5nZSwgdGhpcy5jb21waWxlcilcbn1cblxuLyoqXG4gKiAgQmluZGluZyBDU1MgY2xhc3Nlc1xuICovXG5kaXJlY3RpdmVzWydjbGFzcyddID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuYXJnKSB7XG4gICAgICAgIHV0aWxzW3ZhbHVlID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKHRoaXMuZWwsIHRoaXMuYXJnKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RWYWwpIHtcbiAgICAgICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKHRoaXMuZWwsIHRoaXMubGFzdFZhbClcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHV0aWxzLmFkZENsYXNzKHRoaXMuZWwsIHZhbHVlKVxuICAgICAgICAgICAgdGhpcy5sYXN0VmFsID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgT25seSByZW1vdmVkIGFmdGVyIHRoZSBvd25lciBWTSBpcyByZWFkeVxuICovXG5kaXJlY3RpdmVzLmNsb2FrID0ge1xuICAgIGlzRW1wdHk6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICAgIHRoaXMuY29tcGlsZXIub2JzZXJ2ZXIub25jZSgnaG9vazpyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJy1jbG9haycpXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG4vKipcbiAqICBTdG9yZSBhIHJlZmVyZW5jZSB0byBzZWxmIGluIHBhcmVudCBWTSdzICRcbiAqL1xuZGlyZWN0aXZlcy5yZWYgPSB7XG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5leHByZXNzaW9uXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgdGhpcy52bS4kcGFyZW50LiRbaWRdID0gdGhpcy52bVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5leHByZXNzaW9uXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudm0uJHBhcmVudC4kW2lkXVxuICAgICAgICB9XG4gICAgfVxufVxuXG5kaXJlY3RpdmVzLm9uICAgICAgPSByZXF1aXJlKCcuL29uJylcbmRpcmVjdGl2ZXMucmVwZWF0ICA9IHJlcXVpcmUoJy4vcmVwZWF0JylcbmRpcmVjdGl2ZXMubW9kZWwgICA9IHJlcXVpcmUoJy4vbW9kZWwnKVxuZGlyZWN0aXZlc1snaWYnXSAgID0gcmVxdWlyZSgnLi9pZicpXG5kaXJlY3RpdmVzWyd3aXRoJ10gPSByZXF1aXJlKCcuL3dpdGgnKVxuZGlyZWN0aXZlcy5odG1sICAgID0gcmVxdWlyZSgnLi9odG1sJylcbmRpcmVjdGl2ZXMuc3R5bGUgICA9IHJlcXVpcmUoJy4vc3R5bGUnKVxuZGlyZWN0aXZlcy5wYXJ0aWFsID0gcmVxdWlyZSgnLi9wYXJ0aWFsJylcbmRpcmVjdGl2ZXMudmlldyAgICA9IHJlcXVpcmUoJy4vdmlldycpIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcbiAgICBpc0lFOSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSA5LjAnKSA+IDAsXG4gICAgZmlsdGVyID0gW10uZmlsdGVyXG5cbi8qKlxuICogIFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzIGZyb20gYSBtdWx0aXBsZSBzZWxlY3RcbiAqL1xuZnVuY3Rpb24gZ2V0TXVsdGlwbGVTZWxlY3RPcHRpb25zIChzZWxlY3QpIHtcbiAgICByZXR1cm4gZmlsdGVyXG4gICAgICAgIC5jYWxsKHNlbGVjdC5vcHRpb25zLCBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uLnNlbGVjdGVkXG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSB8fCBvcHRpb24udGV4dFxuICAgICAgICB9KVxufVxuXG4vKipcbiAqICBUd28td2F5IGJpbmRpbmcgZm9yIGZvcm0gaW5wdXQgZWxlbWVudHNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgZWwgICA9IHNlbGYuZWwsXG4gICAgICAgICAgICB0eXBlID0gZWwudHlwZSxcbiAgICAgICAgICAgIHRhZyAgPSBlbC50YWdOYW1lXG5cbiAgICAgICAgc2VsZi5sb2NrID0gZmFsc2VcbiAgICAgICAgc2VsZi5vd25lclZNID0gc2VsZi5iaW5kaW5nLmNvbXBpbGVyLnZtXG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoYXQgZXZlbnQgdG8gbGlzdGVuIHRvXG4gICAgICAgIHNlbGYuZXZlbnQgPVxuICAgICAgICAgICAgKHNlbGYuY29tcGlsZXIub3B0aW9ucy5sYXp5IHx8XG4gICAgICAgICAgICB0YWcgPT09ICdTRUxFQ1QnIHx8XG4gICAgICAgICAgICB0eXBlID09PSAnY2hlY2tib3gnIHx8IHR5cGUgPT09ICdyYWRpbycpXG4gICAgICAgICAgICAgICAgPyAnY2hhbmdlJ1xuICAgICAgICAgICAgICAgIDogJ2lucHV0J1xuXG4gICAgICAgIC8vIGRldGVybWluZSB0aGUgYXR0cmlidXRlIHRvIGNoYW5nZSB3aGVuIHVwZGF0aW5nXG4gICAgICAgIHNlbGYuYXR0ciA9IHR5cGUgPT09ICdjaGVja2JveCdcbiAgICAgICAgICAgID8gJ2NoZWNrZWQnXG4gICAgICAgICAgICA6ICh0YWcgPT09ICdJTlBVVCcgfHwgdGFnID09PSAnU0VMRUNUJyB8fCB0YWcgPT09ICdURVhUQVJFQScpXG4gICAgICAgICAgICAgICAgPyAndmFsdWUnXG4gICAgICAgICAgICAgICAgOiAnaW5uZXJIVE1MJ1xuXG4gICAgICAgIC8vIHNlbGVjdFttdWx0aXBsZV0gc3VwcG9ydFxuICAgICAgICBpZih0YWcgPT09ICdTRUxFQ1QnICYmIGVsLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aSA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb21wb3NpdGlvbkxvY2sgPSBmYWxzZVxuICAgICAgICBzZWxmLmNMb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tcG9zaXRpb25Mb2NrID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuY1VubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uTG9jayA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIHRoaXMuY0xvY2spXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgdGhpcy5jVW5sb2NrKVxuXG4gICAgICAgIC8vIGF0dGFjaCBsaXN0ZW5lclxuICAgICAgICBzZWxmLnNldCA9IHNlbGYuZmlsdGVyc1xuICAgICAgICAgICAgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvc2l0aW9uTG9jaykgcmV0dXJuXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBkaXJlY3RpdmUgaGFzIGZpbHRlcnNcbiAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGxldCB0aGUgdm0uJHNldCB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlKCkgc28gZmlsdGVycyBhcmUgYXBwbGllZC5cbiAgICAgICAgICAgICAgICAvLyB0aGVyZWZvcmUgd2UgaGF2ZSB0byByZWNvcmQgY3Vyc29yIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgLy8gc28gdGhhdCBhZnRlciB2bS4kc2V0IGNoYW5nZXMgdGhlIGlucHV0XG4gICAgICAgICAgICAgICAgLy8gdmFsdWUgd2UgY2FuIHB1dCB0aGUgY3Vyc29yIGJhY2sgYXQgd2hlcmUgaXQgaXNcbiAgICAgICAgICAgICAgICB2YXIgY3Vyc29yUG9zXG4gICAgICAgICAgICAgICAgdHJ5IHsgY3Vyc29yUG9zID0gZWwuc2VsZWN0aW9uU3RhcnQgfSBjYXRjaCAoZSkge31cblxuICAgICAgICAgICAgICAgIHNlbGYuX3NldCgpXG5cbiAgICAgICAgICAgICAgICAvLyBzaW5jZSB1cGRhdGVzIGFyZSBhc3luY1xuICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gcmVzZXQgY3Vyc29yIHBvc2l0aW9uIGFzeW5jIHRvb1xuICAgICAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnNvclBvcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3JQb3MsIGN1cnNvclBvcylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9zaXRpb25Mb2NrKSByZXR1cm5cbiAgICAgICAgICAgICAgICAvLyBubyBmaWx0ZXJzLCBkb24ndCBsZXQgaXQgdHJpZ2dlciB1cGRhdGUoKVxuICAgICAgICAgICAgICAgIHNlbGYubG9jayA9IHRydWVcblxuICAgICAgICAgICAgICAgIHNlbGYuX3NldCgpXG5cbiAgICAgICAgICAgICAgICB1dGlscy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9jayA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihzZWxmLmV2ZW50LCBzZWxmLnNldClcblxuICAgICAgICAvLyBmaXggc2hpdCBmb3IgSUU5XG4gICAgICAgIC8vIHNpbmNlIGl0IGRvZXNuJ3QgZmlyZSBpbnB1dCBvbiBiYWNrc3BhY2UgLyBkZWwgLyBjdXRcbiAgICAgICAgaWYgKGlzSUU5KSB7XG4gICAgICAgICAgICBzZWxmLm9uQ3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGN1dCBldmVudCBmaXJlcyBiZWZvcmUgdGhlIHZhbHVlIGFjdHVhbGx5IGNoYW5nZXNcbiAgICAgICAgICAgICAgICB1dGlscy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0KClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5vbkRlbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDYgfHwgZS5rZXlDb2RlID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjdXQnLCBzZWxmLm9uQ3V0KVxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBzZWxmLm9uRGVsKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vd25lclZNLiRzZXQoXG4gICAgICAgICAgICB0aGlzLmtleSwgdGhpcy5tdWx0aVxuICAgICAgICAgICAgICAgID8gZ2V0TXVsdGlwbGVTZWxlY3RPcHRpb25zKHRoaXMuZWwpXG4gICAgICAgICAgICAgICAgOiB0aGlzLmVsW3RoaXMuYXR0cl1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSwgaW5pdCkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICAvLyBzeW5jIGJhY2sgaW5saW5lIHZhbHVlIGlmIGluaXRpYWwgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgaWYgKGluaXQgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubG9jaykgcmV0dXJuXG4gICAgICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAgICAgaWYgKGVsLnRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7IC8vIHNlbGVjdCBkcm9wZG93blxuICAgICAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IC0xXG4gICAgICAgICAgICBpZih0aGlzLm11bHRpICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCh0aGlzLnVwZGF0ZVNlbGVjdCwgdGhpcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3QodmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykgeyAvLyByYWRpbyBidXR0b25cbiAgICAgICAgICAgIGVsLmNoZWNrZWQgPSB2YWx1ZSA9PSBlbC52YWx1ZVxuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdjaGVja2JveCcpIHsgLy8gY2hlY2tib3hcbiAgICAgICAgICAgIGVsLmNoZWNrZWQgPSAhIXZhbHVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbFt0aGlzLmF0dHJdID0gdXRpbHMuZ3VhcmQodmFsdWUpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlU2VsZWN0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgLy8gc2V0dGluZyA8c2VsZWN0PidzIHZhbHVlIGluIElFOSBkb2Vzbid0IHdvcmtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBtYW51YWxseSBsb29wIHRocm91Z2ggdGhlIG9wdGlvbnNcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmVsLm9wdGlvbnMsXG4gICAgICAgICAgICBpID0gb3B0aW9ucy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbaV0udmFsdWUgPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zW2ldLnNlbGVjdGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmV2ZW50LCB0aGlzLnNldClcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIHRoaXMuY0xvY2spXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgdGhpcy5jVW5sb2NrKVxuICAgICAgICBpZiAoaXNJRTkpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25EZWwpXG4gICAgICAgIH1cbiAgICB9XG59IiwidmFyIHV0aWxzICAgID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBldmVudCBsaXN0ZW5lcnNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBpc0ZuOiB0cnVlLFxuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmJpbmRpbmcuaXNFeHBcbiAgICAgICAgICAgID8gdGhpcy52bVxuICAgICAgICAgICAgOiB0aGlzLmJpbmRpbmcuY29tcGlsZXIudm1cbiAgICAgICAgaWYgKHRoaXMuZWwudGFnTmFtZSA9PT0gJ0lGUkFNRScgJiYgdGhpcy5hcmcgIT09ICdsb2FkJykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgICAgICB0aGlzLmlmcmFtZUJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lbC5jb250ZW50V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoc2VsZi5hcmcsIHNlbGYuaGFuZGxlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdXRpbHMud2FybignRGlyZWN0aXZlIFwidi1vbjonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGV4cGVjdHMgYSBtZXRob2QuJylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXQoKVxuICAgICAgICB2YXIgdm0gPSB0aGlzLnZtLFxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMuY29udGV4dFxuICAgICAgICB0aGlzLmhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS50YXJnZXRWTSA9IHZtXG4gICAgICAgICAgICBjb250ZXh0LiRldmVudCA9IGVcbiAgICAgICAgICAgIHZhciByZXMgPSBoYW5kbGVyLmNhbGwoY29udGV4dCwgZSlcbiAgICAgICAgICAgIGNvbnRleHQuJGV2ZW50ID0gbnVsbFxuICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZUJpbmQpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lQmluZCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5hcmcsIHRoaXMuaGFuZGxlcilcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLmlmcmFtZUJpbmRcbiAgICAgICAgICAgID8gdGhpcy5lbC5jb250ZW50V2luZG93XG4gICAgICAgICAgICA6IHRoaXMuZWxcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlc2V0KClcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICAgIH1cbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbi8qKlxuICogIEJpbmRpbmcgZm9yIHBhcnRpYWxzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvblxuICAgICAgICBpZiAoIWlkKSByZXR1cm5cblxuICAgICAgICB2YXIgZWwgICAgICAgPSB0aGlzLmVsLFxuICAgICAgICAgICAgY29tcGlsZXIgPSB0aGlzLmNvbXBpbGVyLFxuICAgICAgICAgICAgcGFydGlhbCAgPSBjb21waWxlci5nZXRPcHRpb24oJ3BhcnRpYWxzJywgaWQpXG5cbiAgICAgICAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgICAgICAgICBpZiAoaWQgPT09ICd5aWVsZCcpIHtcbiAgICAgICAgICAgICAgICB1dGlscy53YXJuKCd7ez55aWVsZH19IHN5bnRheCBoYXMgYmVlbiBkZXByZWNhdGVkLiBVc2UgPGNvbnRlbnQ+IHRhZyBpbnN0ZWFkLicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnRpYWwgPSBwYXJ0aWFsLmNsb25lTm9kZSh0cnVlKVxuXG4gICAgICAgIC8vIGNvbW1lbnQgcmVmIG5vZGUgbWVhbnMgaW5saW5lIHBhcnRpYWxcbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlID09PSA4KSB7XG5cbiAgICAgICAgICAgIC8vIGtlZXAgYSByZWYgZm9yIHRoZSBwYXJ0aWFsJ3MgY29udGVudCBub2Rlc1xuICAgICAgICAgICAgdmFyIG5vZGVzID0gW10uc2xpY2UuY2FsbChwYXJ0aWFsLmNoaWxkTm9kZXMpLFxuICAgICAgICAgICAgICAgIHBhcmVudCA9IGVsLnBhcmVudE5vZGVcbiAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUocGFydGlhbCwgZWwpXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgICAgICAvLyBjb21waWxlIHBhcnRpYWwgYWZ0ZXIgYXBwZW5kaW5nLCBiZWNhdXNlIGl0cyBjaGlsZHJlbidzIHBhcmVudE5vZGVcbiAgICAgICAgICAgIC8vIHdpbGwgY2hhbmdlIGZyb20gdGhlIGZyYWdtZW50IHRvIHRoZSBjb3JyZWN0IHBhcmVudE5vZGUuXG4gICAgICAgICAgICAvLyBUaGlzIGNvdWxkIGFmZmVjdCBkaXJlY3RpdmVzIHRoYXQgbmVlZCBhY2Nlc3MgdG8gaXRzIGVsZW1lbnQncyBwYXJlbnROb2RlLlxuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChjb21waWxlci5jb21waWxlLCBjb21waWxlcilcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBqdXN0IHNldCBpbm5lckhUTUwuLi5cbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9ICcnXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChwYXJ0aWFsKVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJ2YXIgdXRpbHMgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXG4gICAgY29uZmlnICAgICA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbi8qKlxuICogIEJpbmRpbmcgdGhhdCBtYW5hZ2VzIFZNcyBiYXNlZCBvbiBhbiBBcnJheVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLmlkZW50aWZpZXIgPSAnJHInICsgdGhpcy5pZFxuXG4gICAgICAgIC8vIGEgaGFzaCB0byBjYWNoZSB0aGUgc2FtZSBleHByZXNzaW9ucyBvbiByZXBlYXRlZCBpbnN0YW5jZXNcbiAgICAgICAgLy8gc28gdGhleSBkb24ndCBoYXZlIHRvIGJlIGNvbXBpbGVkIGZvciBldmVyeSBzaW5nbGUgaW5zdGFuY2VcbiAgICAgICAgdGhpcy5leHBDYWNoZSA9IHV0aWxzLmhhc2goKVxuXG4gICAgICAgIHZhciBlbCAgID0gdGhpcy5lbCxcbiAgICAgICAgICAgIGN0biAgPSB0aGlzLmNvbnRhaW5lciA9IGVsLnBhcmVudE5vZGVcblxuICAgICAgICAvLyBleHRyYWN0IGNoaWxkIElkLCBpZiBhbnlcbiAgICAgICAgdGhpcy5jaGlsZElkID0gdGhpcy5jb21waWxlci5ldmFsKHV0aWxzLmF0dHIoZWwsICdyZWYnKSlcblxuICAgICAgICAvLyBjcmVhdGUgYSBjb21tZW50IG5vZGUgYXMgYSByZWZlcmVuY2Ugbm9kZSBmb3IgRE9NIGluc2VydGlvbnNcbiAgICAgICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGNvbmZpZy5wcmVmaXggKyAnLXJlcGVhdC0nICsgdGhpcy5rZXkpXG4gICAgICAgIGN0bi5pbnNlcnRCZWZvcmUodGhpcy5yZWYsIGVsKVxuICAgICAgICBjdG4ucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gbnVsbFxuICAgICAgICB0aGlzLnZtcyA9IG51bGxcblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNPYmplY3QoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gdXRpbHMub2JqZWN0VG9BcnJheShjb2xsZWN0aW9uKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlscy53YXJuKCd2LXJlcGVhdCBvbmx5IGFjY2VwdHMgQXJyYXkgb3IgT2JqZWN0IHZhbHVlcy4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8ga2VlcCByZWZlcmVuY2Ugb2Ygb2xkIGRhdGEgYW5kIFZNc1xuICAgICAgICAvLyBzbyB3ZSBjYW4gcmV1c2UgdGhlbSBpZiBwb3NzaWJsZVxuICAgICAgICB0aGlzLm9sZFZNcyA9IHRoaXMudm1zXG4gICAgICAgIHRoaXMub2xkQ29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvblxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbiB8fCBbXVxuXG4gICAgICAgIHZhciBpc09iamVjdCA9IGNvbGxlY3Rpb25bMF0gJiYgdXRpbHMuaXNPYmplY3QoY29sbGVjdGlvblswXSlcbiAgICAgICAgdGhpcy52bXMgPSB0aGlzLm9sZENvbGxlY3Rpb25cbiAgICAgICAgICAgID8gdGhpcy5kaWZmKGNvbGxlY3Rpb24sIGlzT2JqZWN0KVxuICAgICAgICAgICAgOiB0aGlzLmluaXQoY29sbGVjdGlvbiwgaXNPYmplY3QpXG5cbiAgICAgICAgaWYgKHRoaXMuY2hpbGRJZCkge1xuICAgICAgICAgICAgdGhpcy52bS4kW3RoaXMuY2hpbGRJZF0gPSB0aGlzLnZtc1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKGNvbGxlY3Rpb24sIGlzT2JqZWN0KSB7XG4gICAgICAgIHZhciB2bSwgdm1zID0gW11cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdm0gPSB0aGlzLmJ1aWxkKGNvbGxlY3Rpb25baV0sIGksIGlzT2JqZWN0KVxuICAgICAgICAgICAgdm1zLnB1c2godm0pXG4gICAgICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbml0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHZtLiRlbCwgdGhpcy5yZWYpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZtc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgRGlmZiB0aGUgbmV3IGFycmF5IHdpdGggdGhlIG9sZFxuICAgICAqICBhbmQgZGV0ZXJtaW5lIHRoZSBtaW5pbXVtIGFtb3VudCBvZiBET00gbWFuaXB1bGF0aW9ucy5cbiAgICAgKi9cbiAgICBkaWZmOiBmdW5jdGlvbiAobmV3Q29sbGVjdGlvbiwgaXNPYmplY3QpIHtcblxuICAgICAgICB2YXIgaSwgbCwgaXRlbSwgdm0sXG4gICAgICAgICAgICBvbGRJbmRleCxcbiAgICAgICAgICAgIHRhcmdldE5leHQsXG4gICAgICAgICAgICBjdXJyZW50TmV4dCxcbiAgICAgICAgICAgIG5leHRFbCxcbiAgICAgICAgICAgIGN0biAgICA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICAgICAgb2xkVk1zID0gdGhpcy5vbGRWTXMsXG4gICAgICAgICAgICB2bXMgICAgPSBbXVxuXG4gICAgICAgIHZtcy5sZW5ndGggPSBuZXdDb2xsZWN0aW9uLmxlbmd0aFxuXG4gICAgICAgIC8vIGZpcnN0IHBhc3MsIGNvbGxlY3QgbmV3IHJldXNlZCBhbmQgbmV3IGNyZWF0ZWRcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IG5ld0NvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gbmV3Q29sbGVjdGlvbltpXVxuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgaXRlbS4kaW5kZXggPSBpXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uX19lbWl0dGVyX18gJiYgaXRlbS5fX2VtaXR0ZXJfX1t0aGlzLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgcGllY2Ugb2YgZGF0YSBpcyBiZWluZyByZXVzZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY29yZCBpdHMgZmluYWwgcG9zaXRpb24gaW4gcmV1c2VkIHZtc1xuICAgICAgICAgICAgICAgICAgICBpdGVtLiRyZXVzZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm1zW2ldID0gdGhpcy5idWlsZChpdGVtLCBpLCBpc09iamVjdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHdlIGNhbid0IGF0dGFjaCBhbiBpZGVudGlmaWVyIHRvIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAvLyBzbyBoYXZlIHRvIGRvIGFuIGluZGV4T2YuLi5cbiAgICAgICAgICAgICAgICBvbGRJbmRleCA9IGluZGV4T2Yob2xkVk1zLCBpdGVtKVxuICAgICAgICAgICAgICAgIGlmIChvbGRJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlY29yZCB0aGUgcG9zaXRpb24gb24gdGhlIGV4aXN0aW5nIHZtXG4gICAgICAgICAgICAgICAgICAgIG9sZFZNc1tvbGRJbmRleF0uJHJldXNlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgb2xkVk1zW29sZEluZGV4XS4kZGF0YS4kaW5kZXggPSBpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm1zW2ldID0gdGhpcy5idWlsZChpdGVtLCBpLCBpc09iamVjdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZWNvbmQgcGFzcywgY29sbGVjdCBvbGQgcmV1c2VkIGFuZCBkZXN0cm95IHVudXNlZFxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gb2xkVk1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdm0gPSBvbGRWTXNbaV1cbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLmFyZ1xuICAgICAgICAgICAgICAgID8gdm0uJGRhdGFbdGhpcy5hcmddXG4gICAgICAgICAgICAgICAgOiB2bS4kZGF0YVxuICAgICAgICAgICAgaWYgKGl0ZW0uJHJldXNlZCkge1xuICAgICAgICAgICAgICAgIHZtLiRyZXVzZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uJHJldXNlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZtLiRyZXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGluZGV4IHRvIGxhdGVzdFxuICAgICAgICAgICAgICAgIHZtLiRpbmRleCA9IGl0ZW0uJGluZGV4XG4gICAgICAgICAgICAgICAgLy8gdGhlIGl0ZW0gY291bGQgaGF2ZSBoYWQgYSBuZXcga2V5XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uJGtleSAmJiBpdGVtLiRrZXkgIT09IHZtLiRrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uJGtleSA9IGl0ZW0uJGtleVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bXNbdm0uJGluZGV4XSA9IHZtXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgb25lIGNhbiBiZSBkZXN0cm95ZWQuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uX19lbWl0dGVyX18pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uX19lbWl0dGVyX19bdGhpcy5pZGVudGlmaWVyXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS4kZGVzdHJveSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaW5hbCBwYXNzLCBtb3ZlL2luc2VydCBET00gZWxlbWVudHNcbiAgICAgICAgaSA9IHZtcy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgdm0gPSB2bXNbaV1cbiAgICAgICAgICAgIGl0ZW0gPSB2bS4kZGF0YVxuICAgICAgICAgICAgdGFyZ2V0TmV4dCA9IHZtc1tpICsgMV1cbiAgICAgICAgICAgIGlmICh2bS4kcmV1c2VkKSB7XG4gICAgICAgICAgICAgICAgbmV4dEVsID0gdm0uJGVsLm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgLy8gZGVzdHJveWVkIFZNcycgZWxlbWVudCBtaWdodCBzdGlsbCBiZSBpbiB0aGUgRE9NXG4gICAgICAgICAgICAgICAgLy8gZHVlIHRvIHRyYW5zaXRpb25zXG4gICAgICAgICAgICAgICAgd2hpbGUgKCFuZXh0RWwudnVlX3ZtICYmIG5leHRFbCAhPT0gdGhpcy5yZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsID0gbmV4dEVsLm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN1cnJlbnROZXh0ID0gbmV4dEVsLnZ1ZV92bVxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TmV4dCAhPT0gdGFyZ2V0TmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldE5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bi5pbnNlcnRCZWZvcmUodm0uJGVsLCB0aGlzLnJlZilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRFbCA9IHRhcmdldE5leHQuJGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgVk1zJyBlbGVtZW50IG1pZ2h0IG5vdCBiZSBpbiB0aGUgRE9NIHlldFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZHVlIHRvIHRyYW5zaXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIW5leHRFbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TmV4dCA9IHZtc1tuZXh0RWwudnVlX3ZtLiRpbmRleCArIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEVsID0gdGFyZ2V0TmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRhcmdldE5leHQuJGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5yZWZcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bi5pbnNlcnRCZWZvcmUodm0uJGVsLCBuZXh0RWwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIHZtLiRyZXVzZWRcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS4kaW5kZXhcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS4ka2V5XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBhIG5ldyB2bVxuICAgICAgICAgICAgICAgIHZtLiRiZWZvcmUodGFyZ2V0TmV4dCA/IHRhcmdldE5leHQuJGVsIDogdGhpcy5yZWYpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdm1zXG4gICAgfSxcblxuICAgIGJ1aWxkOiBmdW5jdGlvbiAoZGF0YSwgaW5kZXgsIGlzT2JqZWN0KSB7XG5cbiAgICAgICAgLy8gd3JhcCBub24tb2JqZWN0IHZhbHVlc1xuICAgICAgICB2YXIgcmF3LCBhbGlhcyxcbiAgICAgICAgICAgIHdyYXAgPSAhaXNPYmplY3QgfHwgdGhpcy5hcmdcbiAgICAgICAgaWYgKHdyYXApIHtcbiAgICAgICAgICAgIHJhdyA9IGRhdGFcbiAgICAgICAgICAgIGFsaWFzID0gdGhpcy5hcmcgfHwgJyR2YWx1ZSdcbiAgICAgICAgICAgIGRhdGEgPSB7fVxuICAgICAgICAgICAgZGF0YVthbGlhc10gPSByYXdcbiAgICAgICAgfVxuICAgICAgICBkYXRhLiRpbmRleCA9IGluZGV4XG5cbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbC5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICBDdG9yID0gdGhpcy5jb21waWxlci5yZXNvbHZlQ29tcG9uZW50KGVsLCBkYXRhKSxcbiAgICAgICAgICAgIHZtID0gbmV3IEN0b3Ioe1xuICAgICAgICAgICAgICAgIGVsOiBlbCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHBhcmVudDogdGhpcy52bSxcbiAgICAgICAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVwZWF0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleHBDYWNoZTogdGhpcy5leHBDYWNoZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgICAgICAvLyBhdHRhY2ggYW4gaWVudW1lcmFibGUgaWRlbnRpZmllciB0byB0aGUgcmF3IGRhdGFcbiAgICAgICAgICAgIChyYXcgfHwgZGF0YSkuX19lbWl0dGVyX19bdGhpcy5pZGVudGlmaWVyXSA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2bVxuXG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZElkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy52bS4kW3RoaXMuY2hpbGRJZF1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy52bXMpIHtcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy52bXMubGVuZ3RoXG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52bXNbaV0uJGRlc3Ryb3koKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBIZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIEZpbmQgYW4gb2JqZWN0IG9yIGEgd3JhcHBlZCBkYXRhIG9iamVjdFxuICogIGZyb20gYW4gQXJyYXlcbiAqL1xuZnVuY3Rpb24gaW5kZXhPZiAodm1zLCBvYmopIHtcbiAgICBmb3IgKHZhciB2bSwgaSA9IDAsIGwgPSB2bXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZtID0gdm1zW2ldXG4gICAgICAgIGlmICghdm0uJHJldXNlZCAmJiB2bS4kdmFsdWUgPT09IG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTFcbn0iLCJ2YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBDU1Mgc3R5bGVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuYXJnXG4gICAgICAgIGlmICghcHJvcCkgcmV0dXJuXG4gICAgICAgIGlmIChwcm9wLmNoYXJBdCgwKSA9PT0gJyQnKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgc3RhcnQgd2l0aCAkIHdpbGwgYmUgYXV0by1wcmVmaXhlZFxuICAgICAgICAgICAgcHJvcCA9IHByb3Auc2xpY2UoMSlcbiAgICAgICAgICAgIHRoaXMucHJlZml4ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9wID0gcHJvcFxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMucHJvcCxcbiAgICAgICAgICAgIGlzSW1wb3J0YW50XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IHRydWUgKi9cbiAgICAgICAgLy8gY2FzdCBwb3NzaWJsZSBudW1iZXJzL2Jvb2xlYW5zIGludG8gc3RyaW5nc1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWUgKz0gJydcbiAgICAgICAgaWYgKHByb3ApIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlzSW1wb3J0YW50ID0gdmFsdWUuc2xpY2UoLTEwKSA9PT0gJyFpbXBvcnRhbnQnXG4gICAgICAgICAgICAgICAgICAgID8gJ2ltcG9ydGFudCdcbiAgICAgICAgICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgICAgICAgIGlmIChpc0ltcG9ydGFudCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIC0xMCkudHJpbSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQpXG4gICAgICAgICAgICBpZiAodGhpcy5wcmVmaXhlZCkge1xuICAgICAgICAgICAgICAgIHZhciBpID0gcHJlZml4ZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByZWZpeGVzW2ldICsgcHJvcCwgdmFsdWUsIGlzSW1wb3J0YW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUuY3NzVGV4dCA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCIvKipcbiAqICBNYW5hZ2VzIGEgY29uZGl0aW9uYWwgY2hpbGQgVk0gdXNpbmcgdGhlXG4gKiAgYmluZGluZydzIHZhbHVlIGFzIHRoZSBjb21wb25lbnQgSUQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIHRyYWNrIHBvc2l0aW9uIGluIERPTSB3aXRoIGEgcmVmIG5vZGVcbiAgICAgICAgdmFyIGVsICAgICAgID0gdGhpcy5yYXcgPSB0aGlzLmVsLFxuICAgICAgICAgICAgcGFyZW50ICAgPSBlbC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgcmVmICAgICAgPSB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtdmlldycpXG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUocmVmLCBlbClcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIC8vIGNhY2hlIG9yaWdpbmFsIGNvbnRlbnRcbiAgICAgICAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgICAgICAgdmFyIG5vZGUsXG4gICAgICAgICAgICBmcmFnID0gdGhpcy5pbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHdoaWxlIChub2RlID0gZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChub2RlKVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMudW5iaW5kKClcblxuICAgICAgICB2YXIgQ3RvciAgPSB0aGlzLmNvbXBpbGVyLmdldE9wdGlvbignY29tcG9uZW50cycsIHZhbHVlKVxuICAgICAgICBpZiAoIUN0b3IpIHJldHVyblxuXG4gICAgICAgIHRoaXMuY2hpbGRWTSA9IG5ldyBDdG9yKHtcbiAgICAgICAgICAgIGVsOiB0aGlzLnJhdy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm0sXG4gICAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYXdDb250ZW50OiB0aGlzLmlubmVyLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLmNoaWxkVk0uJGVsXG4gICAgICAgIGlmICh0aGlzLmNvbXBpbGVyLmluaXQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZWwsIHRoaXMucmVmKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGRlc3Ryb3koKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBpbmhlcml0aW5nIGRhdGEgZnJvbSBwYXJlbnQgVk1zLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiAgICAgID0gdGhpcyxcbiAgICAgICAgICAgIGNoaWxkS2V5ICA9IHNlbGYuYXJnLFxuICAgICAgICAgICAgcGFyZW50S2V5ID0gc2VsZi5rZXksXG4gICAgICAgICAgICBjb21waWxlciAgPSBzZWxmLmNvbXBpbGVyLFxuICAgICAgICAgICAgb3duZXIgICAgID0gc2VsZi5iaW5kaW5nLmNvbXBpbGVyXG5cbiAgICAgICAgaWYgKGNvbXBpbGVyID09PSBvd25lcikge1xuICAgICAgICAgICAgdGhpcy5hbG9uZSA9IHRydWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkS2V5KSB7XG4gICAgICAgICAgICBpZiAoIWNvbXBpbGVyLmJpbmRpbmdzW2NoaWxkS2V5XSkge1xuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoY2hpbGRLZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzeW5jIGNoYW5nZXMgb24gY2hpbGQgYmFjayB0byBwYXJlbnRcbiAgICAgICAgICAgIGNvbXBpbGVyLm9ic2VydmVyLm9uKCdjaGFuZ2U6JyArIGNoaWxkS2V5LCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBpbGVyLmluaXQpIHJldHVyblxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5sb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9jayA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NrID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3duZXIudm0uJHNldChwYXJlbnRLZXksIHZhbClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gc3luYyBmcm9tIHBhcmVudFxuICAgICAgICBpZiAoIXRoaXMuYWxvbmUgJiYgIXRoaXMubG9jaykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXJnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52bS4kc2V0KHRoaXMuYXJnLCB2YWx1ZSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52bS4kZGF0YSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZtLiRkYXRhID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSIsInZhciBzbGljZSA9IFtdLnNsaWNlXG5cbmZ1bmN0aW9uIEVtaXR0ZXIgKGN0eCkge1xuICAgIHRoaXMuX2N0eCA9IGN0eCB8fCB0aGlzXG59XG5cbnZhciBFbWl0dGVyUHJvdG8gPSBFbWl0dGVyLnByb3RvdHlwZVxuXG5FbWl0dGVyUHJvdG8ub24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG4gICAgOyh0aGlzLl9jYnNbZXZlbnRdID0gdGhpcy5fY2JzW2V2ZW50XSB8fCBbXSlcbiAgICAgICAgLnB1c2goZm4pXG4gICAgcmV0dXJuIHRoaXNcbn1cblxuRW1pdHRlclByb3RvLm9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG5cbiAgICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgICAgIHNlbGYub2ZmKGV2ZW50LCBvbilcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIG9uLmZuID0gZm5cbiAgICB0aGlzLm9uKGV2ZW50LCBvbilcbiAgICByZXR1cm4gdGhpc1xufVxuXG5FbWl0dGVyUHJvdG8ub2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuXG4gICAgLy8gYWxsXG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2NicyA9IHt9XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2JzW2V2ZW50XVxuICAgIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpc1xuXG4gICAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYnNbZXZlbnRdXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgICB2YXIgY2JcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYiA9IGNhbGxiYWNrc1tpXVxuICAgICAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqICBUaGUgaW50ZXJuYWwsIGZhc3RlciBlbWl0IHdpdGggZml4ZWQgYW1vdW50IG9mIGFyZ3VtZW50c1xuICogIHVzaW5nIEZ1bmN0aW9uLmNhbGxcbiAqL1xuRW1pdHRlclByb3RvLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQsIGEsIGIsIGMpIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cbiAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2JzW2V2ZW50XVxuXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwodGhpcy5fY3R4LCBhLCBiLCBjKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgVGhlIGV4dGVybmFsIGVtaXQgdXNpbmcgRnVuY3Rpb24uYXBwbHlcbiAqL1xuRW1pdHRlclByb3RvLmFwcGx5RW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYnNbZXZlbnRdLCBhcmdzXG5cbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKVxuICAgICAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLl9jdHgsIGFyZ3MpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXIiLCJ2YXIgdXRpbHMgICAgICAgICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIFNUUl9TQVZFX1JFICAgICA9IC9cIig/OlteXCJcXFxcXXxcXFxcLikqXCJ8Jyg/OlteJ1xcXFxdfFxcXFwuKSonL2csXG4gICAgU1RSX1JFU1RPUkVfUkUgID0gL1wiKFxcZCspXCIvZyxcbiAgICBORVdMSU5FX1JFICAgICAgPSAvXFxuL2csXG4gICAgQ1RPUl9SRSAgICAgICAgID0gbmV3IFJlZ0V4cCgnY29uc3RydWN0b3InLnNwbGl0KCcnKS5qb2luKCdbXFwnXCIrLCBdKicpKSxcbiAgICBVTklDT0RFX1JFICAgICAgPSAvXFxcXHVcXGRcXGRcXGRcXGQvXG5cbi8vIFZhcmlhYmxlIGV4dHJhY3Rpb24gc2Nvb3BlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9SdWJ5TG91dnJlL2F2YWxvblxuXG52YXIgS0VZV09SRFMgPVxuICAgICAgICAvLyBrZXl3b3Jkc1xuICAgICAgICAnYnJlYWssY2FzZSxjYXRjaCxjb250aW51ZSxkZWJ1Z2dlcixkZWZhdWx0LGRlbGV0ZSxkbyxlbHNlLGZhbHNlJyArXG4gICAgICAgICcsZmluYWxseSxmb3IsZnVuY3Rpb24saWYsaW4saW5zdGFuY2VvZixuZXcsbnVsbCxyZXR1cm4sc3dpdGNoLHRoaXMnICtcbiAgICAgICAgJyx0aHJvdyx0cnVlLHRyeSx0eXBlb2YsdmFyLHZvaWQsd2hpbGUsd2l0aCx1bmRlZmluZWQnICtcbiAgICAgICAgLy8gcmVzZXJ2ZWRcbiAgICAgICAgJyxhYnN0cmFjdCxib29sZWFuLGJ5dGUsY2hhcixjbGFzcyxjb25zdCxkb3VibGUsZW51bSxleHBvcnQsZXh0ZW5kcycgK1xuICAgICAgICAnLGZpbmFsLGZsb2F0LGdvdG8saW1wbGVtZW50cyxpbXBvcnQsaW50LGludGVyZmFjZSxsb25nLG5hdGl2ZScgK1xuICAgICAgICAnLHBhY2thZ2UscHJpdmF0ZSxwcm90ZWN0ZWQscHVibGljLHNob3J0LHN0YXRpYyxzdXBlcixzeW5jaHJvbml6ZWQnICtcbiAgICAgICAgJyx0aHJvd3MsdHJhbnNpZW50LHZvbGF0aWxlJyArXG4gICAgICAgIC8vIEVDTUEgNSAtIHVzZSBzdHJpY3RcbiAgICAgICAgJyxhcmd1bWVudHMsbGV0LHlpZWxkJyArXG4gICAgICAgIC8vIGFsbG93IHVzaW5nIE1hdGggaW4gZXhwcmVzc2lvbnNcbiAgICAgICAgJyxNYXRoJyxcbiAgICAgICAgXG4gICAgS0VZV09SRFNfUkUgPSBuZXcgUmVnRXhwKFtcIlxcXFxiXCIgKyBLRVlXT1JEUy5yZXBsYWNlKC8sL2csICdcXFxcYnxcXFxcYicpICsgXCJcXFxcYlwiXS5qb2luKCd8JyksICdnJyksXG4gICAgUkVNT1ZFX1JFICAgPSAvXFwvXFwqKD86LnxcXG4pKj9cXCpcXC98XFwvXFwvW15cXG5dKlxcbnxcXC9cXC9bXlxcbl0qJHwnW14nXSonfFwiW15cIl0qXCJ8W1xcc1xcdFxcbl0qXFwuW1xcc1xcdFxcbl0qWyRcXHdcXC5dK3xbXFx7LF1cXHMqW1xcd1xcJF9dK1xccyo6L2csXG4gICAgU1BMSVRfUkUgICAgPSAvW15cXHckXSsvZyxcbiAgICBOVU1CRVJfUkUgICA9IC9cXGJcXGRbXixdKi9nLFxuICAgIEJPVU5EQVJZX1JFID0gL14sK3wsKyQvZ1xuXG4vKipcbiAqICBTdHJpcCB0b3AgbGV2ZWwgdmFyaWFibGUgbmFtZXMgZnJvbSBhIHNuaXBwZXQgb2YgSlMgZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZXMgKGNvZGUpIHtcbiAgICBjb2RlID0gY29kZVxuICAgICAgICAucmVwbGFjZShSRU1PVkVfUkUsICcnKVxuICAgICAgICAucmVwbGFjZShTUExJVF9SRSwgJywnKVxuICAgICAgICAucmVwbGFjZShLRVlXT1JEU19SRSwgJycpXG4gICAgICAgIC5yZXBsYWNlKE5VTUJFUl9SRSwgJycpXG4gICAgICAgIC5yZXBsYWNlKEJPVU5EQVJZX1JFLCAnJylcbiAgICByZXR1cm4gY29kZVxuICAgICAgICA/IGNvZGUuc3BsaXQoLywrLylcbiAgICAgICAgOiBbXVxufVxuXG4vKipcbiAqICBBIGdpdmVuIHBhdGggY291bGQgcG90ZW50aWFsbHkgZXhpc3Qgbm90IG9uIHRoZVxuICogIGN1cnJlbnQgY29tcGlsZXIsIGJ1dCB1cCBpbiB0aGUgcGFyZW50IGNoYWluIHNvbWV3aGVyZS5cbiAqICBUaGlzIGZ1bmN0aW9uIGdlbmVyYXRlcyBhbiBhY2Nlc3MgcmVsYXRpb25zaGlwIHN0cmluZ1xuICogIHRoYXQgY2FuIGJlIHVzZWQgaW4gdGhlIGdldHRlciBmdW5jdGlvbiBieSB3YWxraW5nIHVwXG4gKiAgdGhlIHBhcmVudCBjaGFpbiB0byBjaGVjayBmb3Iga2V5IGV4aXN0ZW5jZS5cbiAqXG4gKiAgSXQgc3RvcHMgYXQgdG9wIHBhcmVudCBpZiBubyB2bSBpbiB0aGUgY2hhaW4gaGFzIHRoZVxuICogIGtleS4gSXQgdGhlbiBjcmVhdGVzIGFueSBtaXNzaW5nIGJpbmRpbmdzIG9uIHRoZVxuICogIGZpbmFsIHJlc29sdmVkIHZtLlxuICovXG5mdW5jdGlvbiB0cmFjZVNjb3BlIChwYXRoLCBjb21waWxlciwgZGF0YSkge1xuICAgIHZhciByZWwgID0gJycsXG4gICAgICAgIGRpc3QgPSAwLFxuICAgICAgICBzZWxmID0gY29tcGlsZXJcblxuICAgIGlmIChkYXRhICYmIHV0aWxzLmdldChkYXRhLCBwYXRoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGhhY2s6IHRlbXBvcmFyaWx5IGF0dGFjaGVkIGRhdGFcbiAgICAgICAgcmV0dXJuICckdGVtcC4nXG4gICAgfVxuXG4gICAgd2hpbGUgKGNvbXBpbGVyKSB7XG4gICAgICAgIGlmIChjb21waWxlci5oYXNLZXkocGF0aCkpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21waWxlciA9IGNvbXBpbGVyLnBhcmVudFxuICAgICAgICAgICAgZGlzdCsrXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbXBpbGVyKSB7XG4gICAgICAgIHdoaWxlIChkaXN0LS0pIHtcbiAgICAgICAgICAgIHJlbCArPSAnJHBhcmVudC4nXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb21waWxlci5iaW5kaW5nc1twYXRoXSAmJiBwYXRoLmNoYXJBdCgwKSAhPT0gJyQnKSB7XG4gICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKHBhdGgpXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmNyZWF0ZUJpbmRpbmcocGF0aClcbiAgICB9XG4gICAgcmV0dXJuIHJlbFxufVxuXG4vKipcbiAqICBDcmVhdGUgYSBmdW5jdGlvbiBmcm9tIGEgc3RyaW5nLi4uXG4gKiAgdGhpcyBsb29rcyBsaWtlIGV2aWwgbWFnaWMgYnV0IHNpbmNlIGFsbCB2YXJpYWJsZXMgYXJlIGxpbWl0ZWRcbiAqICB0byB0aGUgVk0ncyBkYXRhIGl0J3MgYWN0dWFsbHkgcHJvcGVybHkgc2FuZGJveGVkXG4gKi9cbmZ1bmN0aW9uIG1ha2VHZXR0ZXIgKGV4cCwgcmF3KSB7XG4gICAgdmFyIGZuXG4gICAgdHJ5IHtcbiAgICAgICAgZm4gPSBuZXcgRnVuY3Rpb24oZXhwKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdXRpbHMud2FybignRXJyb3IgcGFyc2luZyBleHByZXNzaW9uOiAnICsgcmF3KVxuICAgIH1cbiAgICByZXR1cm4gZm5cbn1cblxuLyoqXG4gKiAgRXNjYXBlIGEgbGVhZGluZyBkb2xsYXIgc2lnbiBmb3IgcmVnZXggY29uc3RydWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZURvbGxhciAodikge1xuICAgIHJldHVybiB2LmNoYXJBdCgwKSA9PT0gJyQnXG4gICAgICAgID8gJ1xcXFwnICsgdlxuICAgICAgICA6IHZcbn1cblxuLyoqXG4gKiAgUGFyc2UgYW5kIHJldHVybiBhbiBhbm9ueW1vdXMgY29tcHV0ZWQgcHJvcGVydHkgZ2V0dGVyIGZ1bmN0aW9uXG4gKiAgZnJvbSBhbiBhcmJpdHJhcnkgZXhwcmVzc2lvbiwgdG9nZXRoZXIgd2l0aCBhIGxpc3Qgb2YgcGF0aHMgdG8gYmVcbiAqICBjcmVhdGVkIGFzIGJpbmRpbmdzLlxuICovXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKGV4cCwgY29tcGlsZXIsIGRhdGEpIHtcbiAgICAvLyB1bmljb2RlIGFuZCAnY29uc3RydWN0b3InIGFyZSBub3QgYWxsb3dlZCBmb3IgWFNTIHNlY3VyaXR5LlxuICAgIGlmIChVTklDT0RFX1JFLnRlc3QoZXhwKSB8fCBDVE9SX1JFLnRlc3QoZXhwKSkge1xuICAgICAgICB1dGlscy53YXJuKCdVbnNhZmUgZXhwcmVzc2lvbjogJyArIGV4cClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIGV4dHJhY3QgdmFyaWFibGUgbmFtZXNcbiAgICB2YXIgdmFycyA9IGdldFZhcmlhYmxlcyhleHApXG4gICAgaWYgKCF2YXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbWFrZUdldHRlcigncmV0dXJuICcgKyBleHAsIGV4cClcbiAgICB9XG4gICAgdmFycyA9IHV0aWxzLnVuaXF1ZSh2YXJzKVxuXG4gICAgdmFyIGFjY2Vzc29ycyA9ICcnLFxuICAgICAgICBoYXMgICAgICAgPSB1dGlscy5oYXNoKCksXG4gICAgICAgIHN0cmluZ3MgICA9IFtdLFxuICAgICAgICAvLyBjb25zdHJ1Y3QgYSByZWdleCB0byBleHRyYWN0IGFsbCB2YWxpZCB2YXJpYWJsZSBwYXRoc1xuICAgICAgICAvLyBvbmVzIHRoYXQgYmVnaW4gd2l0aCBcIiRcIiBhcmUgcGFydGljdWxhcmx5IHRyaWNreVxuICAgICAgICAvLyBiZWNhdXNlIHdlIGNhbid0IHVzZSBcXGIgZm9yIHRoZW1cbiAgICAgICAgcGF0aFJFID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgIFwiW14kXFxcXHdcXFxcLl0oXCIgK1xuICAgICAgICAgICAgdmFycy5tYXAoZXNjYXBlRG9sbGFyKS5qb2luKCd8JykgK1xuICAgICAgICAgICAgXCIpWyRcXFxcd1xcXFwuXSpcXFxcYlwiLCAnZydcbiAgICAgICAgKSxcbiAgICAgICAgYm9keSA9ICgnICcgKyBleHApXG4gICAgICAgICAgICAucmVwbGFjZShTVFJfU0FWRV9SRSwgc2F2ZVN0cmluZ3MpXG4gICAgICAgICAgICAucmVwbGFjZShwYXRoUkUsIHJlcGxhY2VQYXRoKVxuICAgICAgICAgICAgLnJlcGxhY2UoU1RSX1JFU1RPUkVfUkUsIHJlc3RvcmVTdHJpbmdzKVxuXG4gICAgYm9keSA9IGFjY2Vzc29ycyArICdyZXR1cm4gJyArIGJvZHlcblxuICAgIGZ1bmN0aW9uIHNhdmVTdHJpbmdzIChzdHIpIHtcbiAgICAgICAgdmFyIGkgPSBzdHJpbmdzLmxlbmd0aFxuICAgICAgICAvLyBlc2NhcGUgbmV3bGluZXMgaW4gc3RyaW5ncyBzbyB0aGUgZXhwcmVzc2lvblxuICAgICAgICAvLyBjYW4gYmUgY29ycmVjdGx5IGV2YWx1YXRlZFxuICAgICAgICBzdHJpbmdzW2ldID0gc3RyLnJlcGxhY2UoTkVXTElORV9SRSwgJ1xcXFxuJylcbiAgICAgICAgcmV0dXJuICdcIicgKyBpICsgJ1wiJ1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VQYXRoIChwYXRoKSB7XG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGZpcnN0IGNoYXJcbiAgICAgICAgdmFyIGMgPSBwYXRoLmNoYXJBdCgwKVxuICAgICAgICBwYXRoID0gcGF0aC5zbGljZSgxKVxuICAgICAgICB2YXIgdmFsID0gJ3RoaXMuJyArIHRyYWNlU2NvcGUocGF0aCwgY29tcGlsZXIsIGRhdGEpICsgcGF0aFxuICAgICAgICBpZiAoIWhhc1twYXRoXSkge1xuICAgICAgICAgICAgYWNjZXNzb3JzICs9IHZhbCArICc7J1xuICAgICAgICAgICAgaGFzW3BhdGhdID0gMVxuICAgICAgICB9XG4gICAgICAgIC8vIGRvbid0IGZvcmdldCB0byBwdXQgdGhhdCBmaXJzdCBjaGFyIGJhY2tcbiAgICAgICAgcmV0dXJuIGMgKyB2YWxcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXN0b3JlU3RyaW5ncyAoc3RyLCBpKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdzW2ldXG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VHZXR0ZXIoYm9keSwgZXhwKVxufVxuXG4vKipcbiAqICBFdmFsdWF0ZSBhbiBleHByZXNzaW9uIGluIHRoZSBjb250ZXh0IG9mIGEgY29tcGlsZXIuXG4gKiAgQWNjZXB0cyBhZGRpdGlvbmFsIGRhdGEuXG4gKi9cbmV4cG9ydHMuZXZhbCA9IGZ1bmN0aW9uIChleHAsIGNvbXBpbGVyLCBkYXRhKSB7XG4gICAgdmFyIGdldHRlciA9IGV4cG9ydHMucGFyc2UoZXhwLCBjb21waWxlciwgZGF0YSksIHJlc1xuICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgLy8gaGFjazogdGVtcG9yYXJpbHkgYXR0YWNoIHRoZSBhZGRpdGlvbmFsIGRhdGEgc29cbiAgICAgICAgLy8gaXQgY2FuIGJlIGFjY2Vzc2VkIGluIHRoZSBnZXR0ZXJcbiAgICAgICAgY29tcGlsZXIudm0uJHRlbXAgPSBkYXRhXG4gICAgICAgIHJlcyA9IGdldHRlci5jYWxsKGNvbXBpbGVyLnZtKVxuICAgICAgICBkZWxldGUgY29tcGlsZXIudm0uJHRlbXBcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xufSIsInZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBnZXQgICAgICA9IHV0aWxzLmdldCxcbiAgICBzbGljZSAgICA9IFtdLnNsaWNlLFxuICAgIFFVT1RFX1JFID0gL14nLionJC8sXG4gICAgZmlsdGVycyAgPSBtb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmhhc2goKVxuXG4vKipcbiAqICAnYWJjJyA9PiAnQWJjJ1xuICovXG5maWx0ZXJzLmNhcGl0YWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gJydcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKClcbiAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWx1ZS5zbGljZSgxKVxufVxuXG4vKipcbiAqICAnYWJjJyA9PiAnQUJDJ1xuICovXG5maWx0ZXJzLnVwcGVyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgfHwgdmFsdWUgPT09IDApXG4gICAgICAgID8gdmFsdWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIDogJydcbn1cblxuLyoqXG4gKiAgJ0FiQycgPT4gJ2FiYydcbiAqL1xuZmlsdGVycy5sb3dlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgICA6ICcnXG59XG5cbi8qKlxuICogIDEyMzQ1ID0+ICQxMiwzNDUuMDBcbiAqL1xuZmlsdGVycy5jdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgc2lnbikge1xuICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gJydcbiAgICBzaWduID0gc2lnbiB8fCAnJCdcbiAgICB2YXIgcyA9IE1hdGguZmxvb3IodmFsdWUpLnRvU3RyaW5nKCksXG4gICAgICAgIGkgPSBzLmxlbmd0aCAlIDMsXG4gICAgICAgIGggPSBpID4gMCA/IChzLnNsaWNlKDAsIGkpICsgKHMubGVuZ3RoID4gMyA/ICcsJyA6ICcnKSkgOiAnJyxcbiAgICAgICAgZiA9ICcuJyArIHZhbHVlLnRvRml4ZWQoMikuc2xpY2UoLTIpXG4gICAgcmV0dXJuIHNpZ24gKyBoICsgcy5zbGljZShpKS5yZXBsYWNlKC8oXFxkezN9KSg/PVxcZCkvZywgJyQxLCcpICsgZlxufVxuXG4vKipcbiAqICBhcmdzOiBhbiBhcnJheSBvZiBzdHJpbmdzIGNvcnJlc3BvbmRpbmcgdG9cbiAqICB0aGUgc2luZ2xlLCBkb3VibGUsIHRyaXBsZSAuLi4gZm9ybXMgb2YgdGhlIHdvcmQgdG9cbiAqICBiZSBwbHVyYWxpemVkLiBXaGVuIHRoZSBudW1iZXIgdG8gYmUgcGx1cmFsaXplZFxuICogIGV4Y2VlZHMgdGhlIGxlbmd0aCBvZiB0aGUgYXJncywgaXQgd2lsbCB1c2UgdGhlIGxhc3RcbiAqICBlbnRyeSBpbiB0aGUgYXJyYXkuXG4gKlxuICogIGUuZy4gWydzaW5nbGUnLCAnZG91YmxlJywgJ3RyaXBsZScsICdtdWx0aXBsZSddXG4gKi9cbmZpbHRlcnMucGx1cmFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICByZXR1cm4gYXJncy5sZW5ndGggPiAxXG4gICAgICAgID8gKGFyZ3NbdmFsdWUgLSAxXSB8fCBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pXG4gICAgICAgIDogKGFyZ3NbdmFsdWUgLSAxXSB8fCBhcmdzWzBdICsgJ3MnKVxufVxuXG4vKipcbiAqICBBIHNwZWNpYWwgZmlsdGVyIHRoYXQgdGFrZXMgYSBoYW5kbGVyIGZ1bmN0aW9uLFxuICogIHdyYXBzIGl0IHNvIGl0IG9ubHkgZ2V0cyB0cmlnZ2VyZWQgb24gc3BlY2lmaWMga2V5cHJlc3Nlcy5cbiAqXG4gKiAgdi1vbiBvbmx5XG4gKi9cblxudmFyIGtleUNvZGVzID0ge1xuICAgIGVudGVyICAgIDogMTMsXG4gICAgdGFiICAgICAgOiA5LFxuICAgICdkZWxldGUnIDogNDYsXG4gICAgdXAgICAgICAgOiAzOCxcbiAgICBsZWZ0ICAgICA6IDM3LFxuICAgIHJpZ2h0ICAgIDogMzksXG4gICAgZG93biAgICAgOiA0MCxcbiAgICBlc2MgICAgICA6IDI3XG59XG5cbmZpbHRlcnMua2V5ID0gZnVuY3Rpb24gKGhhbmRsZXIsIGtleSkge1xuICAgIGlmICghaGFuZGxlcikgcmV0dXJuXG4gICAgdmFyIGNvZGUgPSBrZXlDb2Rlc1trZXldXG4gICAgaWYgKCFjb2RlKSB7XG4gICAgICAgIGNvZGUgPSBwYXJzZUludChrZXksIDEwKVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gY29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbCh0aGlzLCBlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBGaWx0ZXIgZmlsdGVyIGZvciB2LXJlcGVhdFxuICovXG5maWx0ZXJzLmZpbHRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc2VhcmNoS2V5LCBkZWxpbWl0ZXIsIGRhdGFLZXkpIHtcblxuICAgIC8vIGFsbG93IG9wdGlvbmFsIGBpbmAgZGVsaW1pdGVyXG4gICAgLy8gYmVjYXVzZSB3aHkgbm90XG4gICAgaWYgKGRlbGltaXRlciAmJiBkZWxpbWl0ZXIgIT09ICdpbicpIHtcbiAgICAgICAgZGF0YUtleSA9IGRlbGltaXRlclxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgc2VhcmNoIHN0cmluZ1xuICAgIHZhciBzZWFyY2ggPSBzdHJpcFF1b3RlcyhzZWFyY2hLZXkpIHx8IHRoaXMuJGdldChzZWFyY2hLZXkpXG4gICAgaWYgKCFzZWFyY2gpIHJldHVybiBhcnJcbiAgICBzZWFyY2ggPSBzZWFyY2gudG9Mb3dlckNhc2UoKVxuXG4gICAgLy8gZ2V0IHRoZSBvcHRpb25hbCBkYXRhS2V5XG4gICAgZGF0YUtleSA9IGRhdGFLZXkgJiYgKHN0cmlwUXVvdGVzKGRhdGFLZXkpIHx8IHRoaXMuJGdldChkYXRhS2V5KSlcblxuICAgIC8vIGNvbnZlcnQgb2JqZWN0IHRvIGFycmF5XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgYXJyID0gdXRpbHMub2JqZWN0VG9BcnJheShhcnIpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGRhdGFLZXlcbiAgICAgICAgICAgID8gY29udGFpbnMoZ2V0KGl0ZW0sIGRhdGFLZXkpLCBzZWFyY2gpXG4gICAgICAgICAgICA6IGNvbnRhaW5zKGl0ZW0sIHNlYXJjaClcbiAgICB9KVxuXG59XG5cbmZpbHRlcnMuZmlsdGVyQnkuY29tcHV0ZWQgPSB0cnVlXG5cbi8qKlxuICogIFNvcnQgZml0bGVyIGZvciB2LXJlcGVhdFxuICovXG5maWx0ZXJzLm9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzb3J0S2V5LCByZXZlcnNlS2V5KSB7XG5cbiAgICB2YXIga2V5ID0gc3RyaXBRdW90ZXMoc29ydEtleSkgfHwgdGhpcy4kZ2V0KHNvcnRLZXkpXG4gICAgaWYgKCFrZXkpIHJldHVybiBhcnJcblxuICAgIC8vIGNvbnZlcnQgb2JqZWN0IHRvIGFycmF5XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgYXJyID0gdXRpbHMub2JqZWN0VG9BcnJheShhcnIpXG4gICAgfVxuXG4gICAgdmFyIG9yZGVyID0gMVxuICAgIGlmIChyZXZlcnNlS2V5KSB7XG4gICAgICAgIGlmIChyZXZlcnNlS2V5ID09PSAnLTEnKSB7XG4gICAgICAgICAgICBvcmRlciA9IC0xXG4gICAgICAgIH0gZWxzZSBpZiAocmV2ZXJzZUtleS5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgICAgcmV2ZXJzZUtleSA9IHJldmVyc2VLZXkuc2xpY2UoMSlcbiAgICAgICAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gMSA6IC0xXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IC0xIDogMVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc29ydCBvbiBhIGNvcHkgdG8gYXZvaWQgbXV0YXRpbmcgb3JpZ2luYWwgYXJyYXlcbiAgICByZXR1cm4gYXJyLnNsaWNlKCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBhID0gZ2V0KGEsIGtleSlcbiAgICAgICAgYiA9IGdldChiLCBrZXkpXG4gICAgICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPiBiID8gb3JkZXIgOiAtb3JkZXJcbiAgICB9KVxuXG59XG5cbmZpbHRlcnMub3JkZXJCeS5jb21wdXRlZCA9IHRydWVcblxuLy8gQXJyYXkgZmlsdGVyIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBTdHJpbmcgY29udGFpbiBoZWxwZXJcbiAqL1xuZnVuY3Rpb24gY29udGFpbnMgKHZhbCwgc2VhcmNoKSB7XG4gICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICBpZiAodXRpbHMuaXNPYmplY3QodmFsKSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgICAgICAgICBpZiAoY29udGFpbnModmFsW2tleV0sIHNlYXJjaCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICAgIH1cbn1cblxuLyoqXG4gKiAgVGVzdCB3aGV0aGVyIGEgc3RyaW5nIGlzIGluIHF1b3RlcyxcbiAqICBpZiB5ZXMgcmV0dXJuIHN0cmlwcGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBzdHJpcFF1b3RlcyAoc3RyKSB7XG4gICAgaWYgKFFVT1RFX1JFLnRlc3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDEsIC0xKVxuICAgIH1cbn0iLCIvLyBzdHJpbmcgLT4gRE9NIGNvbnZlcnNpb25cbi8vIHdyYXBwZXJzIG9yaWdpbmFsbHkgZnJvbSBqUXVlcnksIHNjb29wZWQgZnJvbSBjb21wb25lbnQvZG9taWZ5XG52YXIgbWFwID0ge1xuICAgIGxlZ2VuZCAgIDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gICAgdHIgICAgICAgOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgICBjb2wgICAgICA6IFsyLCAnPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPiddLFxuICAgIF9kZWZhdWx0IDogWzAsICcnLCAnJ11cbn1cblxubWFwLnRkID1cbm1hcC50aCA9IFszLCAnPHRhYmxlPjx0Ym9keT48dHI+JywgJzwvdHI+PC90Ym9keT48L3RhYmxlPiddXG5cbm1hcC5vcHRpb24gPVxubWFwLm9wdGdyb3VwID0gWzEsICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLCAnPC9zZWxlY3Q+J11cblxubWFwLnRoZWFkID1cbm1hcC50Ym9keSA9XG5tYXAuY29sZ3JvdXAgPVxubWFwLmNhcHRpb24gPVxubWFwLnRmb290ID0gWzEsICc8dGFibGU+JywgJzwvdGFibGU+J11cblxubWFwLnRleHQgPVxubWFwLmNpcmNsZSA9XG5tYXAuZWxsaXBzZSA9XG5tYXAubGluZSA9XG5tYXAucGF0aCA9XG5tYXAucG9seWdvbiA9XG5tYXAucG9seWxpbmUgPVxubWFwLnJlY3QgPSBbMSwgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjFcIj4nLCc8L3N2Zz4nXVxuXG52YXIgVEFHX1JFID0gLzwoW1xcdzpdKykvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRlbXBsYXRlU3RyaW5nKSB7XG4gICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIG0gPSBUQUdfUkUuZXhlYyh0ZW1wbGF0ZVN0cmluZylcbiAgICAvLyB0ZXh0IG9ubHlcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZW1wbGF0ZVN0cmluZykpXG4gICAgICAgIHJldHVybiBmcmFnXG4gICAgfVxuXG4gICAgdmFyIHRhZyA9IG1bMV0sXG4gICAgICAgIHdyYXAgPSBtYXBbdGFnXSB8fCBtYXAuX2RlZmF1bHQsXG4gICAgICAgIGRlcHRoID0gd3JhcFswXSxcbiAgICAgICAgcHJlZml4ID0gd3JhcFsxXSxcbiAgICAgICAgc3VmZml4ID0gd3JhcFsyXSxcbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBub2RlLmlubmVySFRNTCA9IHByZWZpeCArIHRlbXBsYXRlU3RyaW5nLnRyaW0oKSArIHN1ZmZpeFxuICAgIHdoaWxlIChkZXB0aC0tKSBub2RlID0gbm9kZS5sYXN0Q2hpbGRcblxuICAgIC8vIG9uZSBlbGVtZW50XG4gICAgaWYgKG5vZGUuZmlyc3RDaGlsZCA9PT0gbm9kZS5sYXN0Q2hpbGQpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChub2RlLmZpcnN0Q2hpbGQpXG4gICAgICAgIHJldHVybiBmcmFnXG4gICAgfVxuXG4gICAgLy8gbXVsdGlwbGUgbm9kZXMsIHJldHVybiBhIGZyYWdtZW50XG4gICAgdmFyIGNoaWxkXG4gICAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgICB3aGlsZSAoY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZyYWdcbn0iLCJ2YXIgY29uZmlnICAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIFZpZXdNb2RlbCAgID0gcmVxdWlyZSgnLi92aWV3bW9kZWwnKSxcbiAgICB1dGlscyAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBtYWtlSGFzaCAgICA9IHV0aWxzLmhhc2gsXG4gICAgYXNzZXRUeXBlcyAgPSBbJ2RpcmVjdGl2ZScsICdmaWx0ZXInLCAncGFydGlhbCcsICdlZmZlY3QnLCAnY29tcG9uZW50J10sXG4gICAgLy8gSW50ZXJuYWwgbW9kdWxlcyB0aGF0IGFyZSBleHBvc2VkIGZvciBwbHVnaW5zXG4gICAgcGx1Z2luQVBJICAgPSB7XG4gICAgICAgIHV0aWxzOiB1dGlscyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHRyYW5zaXRpb246IHJlcXVpcmUoJy4vdHJhbnNpdGlvbicpLFxuICAgICAgICBvYnNlcnZlcjogcmVxdWlyZSgnLi9vYnNlcnZlcicpXG4gICAgfVxuXG5WaWV3TW9kZWwub3B0aW9ucyA9IGNvbmZpZy5nbG9iYWxBc3NldHMgPSB7XG4gICAgZGlyZWN0aXZlcyAgOiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKSxcbiAgICBmaWx0ZXJzICAgICA6IHJlcXVpcmUoJy4vZmlsdGVycycpLFxuICAgIHBhcnRpYWxzICAgIDogbWFrZUhhc2goKSxcbiAgICBlZmZlY3RzICAgICA6IG1ha2VIYXNoKCksXG4gICAgY29tcG9uZW50cyAgOiBtYWtlSGFzaCgpXG59XG5cbi8qKlxuICogIEV4cG9zZSBhc3NldCByZWdpc3RyYXRpb24gbWV0aG9kc1xuICovXG5hc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBWaWV3TW9kZWxbdHlwZV0gPSBmdW5jdGlvbiAoaWQsIHZhbHVlKSB7XG4gICAgICAgIHZhciBoYXNoID0gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddXG4gICAgICAgIGlmICghaGFzaCkge1xuICAgICAgICAgICAgaGFzaCA9IHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXSA9IG1ha2VIYXNoKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gaGFzaFtpZF1cbiAgICAgICAgaWYgKHR5cGUgPT09ICdwYXJ0aWFsJykge1xuICAgICAgICAgICAgdmFsdWUgPSB1dGlscy5wYXJzZVRlbXBsYXRlT3B0aW9uKHZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHV0aWxzLnRvQ29uc3RydWN0b3IodmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2ZpbHRlcicpIHtcbiAgICAgICAgICAgIHV0aWxzLmNoZWNrRmlsdGVyKHZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGhhc2hbaWRdID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG59KVxuXG4vKipcbiAqICBTZXQgY29uZmlnIG9wdGlvbnNcbiAqL1xuVmlld01vZGVsLmNvbmZpZyA9IGZ1bmN0aW9uIChvcHRzLCB2YWwpIHtcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1tvcHRzXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnW29wdHNdID0gdmFsXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB1dGlscy5leHRlbmQoY29uZmlnLCBvcHRzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqICBFeHBvc2UgYW4gaW50ZXJmYWNlIGZvciBwbHVnaW5zXG4gKi9cblZpZXdNb2RlbC51c2UgPSBmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwbHVnaW4gPSByZXF1aXJlKHBsdWdpbilcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdXRpbHMud2FybignQ2Fubm90IGZpbmQgcGx1Z2luOiAnICsgcGx1Z2luKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIGFyZ3MudW5zaGlmdCh0aGlzKVxuXG4gICAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGx1Z2luLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogIEV4cG9zZSBpbnRlcm5hbCBtb2R1bGVzIGZvciBwbHVnaW5zXG4gKi9cblZpZXdNb2RlbC5yZXF1aXJlID0gZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgIHJldHVybiBwbHVnaW5BUElbbW9kdWxlXVxufVxuXG5WaWV3TW9kZWwuZXh0ZW5kID0gZXh0ZW5kXG5WaWV3TW9kZWwubmV4dFRpY2sgPSB1dGlscy5uZXh0VGlja1xuXG4vKipcbiAqICBFeHBvc2UgdGhlIG1haW4gVmlld01vZGVsIGNsYXNzXG4gKiAgYW5kIGFkZCBleHRlbmQgbWV0aG9kXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZCAob3B0aW9ucykge1xuXG4gICAgdmFyIFBhcmVudFZNID0gdGhpc1xuXG4gICAgLy8gZXh0ZW5kIGRhdGEgb3B0aW9ucyBuZWVkIHRvIGJlIGNvcGllZFxuICAgIC8vIG9uIGluc3RhbnRpYXRpb25cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIG9wdGlvbnMuZGVmYXVsdERhdGEgPSBvcHRpb25zLmRhdGFcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMuZGF0YVxuICAgIH1cblxuICAgIC8vIGluaGVyaXQgb3B0aW9uc1xuICAgIC8vIGJ1dCBvbmx5IHdoZW4gdGhlIHN1cGVyIGNsYXNzIGlzIG5vdCB0aGUgbmF0aXZlIFZ1ZS5cbiAgICBpZiAoUGFyZW50Vk0gIT09IFZpZXdNb2RlbCkge1xuICAgICAgICBvcHRpb25zID0gaW5oZXJpdE9wdGlvbnMob3B0aW9ucywgUGFyZW50Vk0ub3B0aW9ucywgdHJ1ZSlcbiAgICB9XG4gICAgdXRpbHMucHJvY2Vzc09wdGlvbnMob3B0aW9ucylcblxuICAgIHZhciBFeHRlbmRlZFZNID0gZnVuY3Rpb24gKG9wdHMsIGFzUGFyZW50KSB7XG4gICAgICAgIGlmICghYXNQYXJlbnQpIHtcbiAgICAgICAgICAgIG9wdHMgPSBpbmhlcml0T3B0aW9ucyhvcHRzLCBvcHRpb25zLCB0cnVlKVxuICAgICAgICB9XG4gICAgICAgIFBhcmVudFZNLmNhbGwodGhpcywgb3B0cywgdHJ1ZSlcbiAgICB9XG5cbiAgICAvLyBpbmhlcml0IHByb3RvdHlwZSBwcm9wc1xuICAgIHZhciBwcm90byA9IEV4dGVuZGVkVk0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQYXJlbnRWTS5wcm90b3R5cGUpXG4gICAgdXRpbHMuZGVmUHJvdGVjdGVkKHByb3RvLCAnY29uc3RydWN0b3InLCBFeHRlbmRlZFZNKVxuXG4gICAgLy8gYWxsb3cgZXh0ZW5kZWQgVk0gdG8gYmUgZnVydGhlciBleHRlbmRlZFxuICAgIEV4dGVuZGVkVk0uZXh0ZW5kICA9IGV4dGVuZFxuICAgIEV4dGVuZGVkVk0uc3VwZXIgICA9IFBhcmVudFZNXG4gICAgRXh0ZW5kZWRWTS5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgLy8gYWxsb3cgZXh0ZW5kZWQgVk0gdG8gYWRkIGl0cyBvd24gYXNzZXRzXG4gICAgYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIEV4dGVuZGVkVk1bdHlwZV0gPSBWaWV3TW9kZWxbdHlwZV1cbiAgICB9KVxuXG4gICAgLy8gYWxsb3cgZXh0ZW5kZWQgVk0gdG8gdXNlIHBsdWdpbnNcbiAgICBFeHRlbmRlZFZNLnVzZSAgICAgPSBWaWV3TW9kZWwudXNlXG4gICAgRXh0ZW5kZWRWTS5yZXF1aXJlID0gVmlld01vZGVsLnJlcXVpcmVcblxuICAgIHJldHVybiBFeHRlbmRlZFZNXG59XG5cbi8qKlxuICogIEluaGVyaXQgb3B0aW9uc1xuICpcbiAqICBGb3Igb3B0aW9ucyBzdWNoIGFzIGBkYXRhYCwgYHZtc2AsIGBkaXJlY3RpdmVzYCwgJ3BhcnRpYWxzJyxcbiAqICB0aGV5IHNob3VsZCBiZSBmdXJ0aGVyIGV4dGVuZGVkLiBIb3dldmVyIGV4dGVuZGluZyBzaG91bGQgb25seVxuICogIGJlIGRvbmUgYXQgdG9wIGxldmVsLlxuICogIFxuICogIGBwcm90b2AgaXMgYW4gZXhjZXB0aW9uIGJlY2F1c2UgaXQncyBoYW5kbGVkIGRpcmVjdGx5IG9uIHRoZVxuICogIHByb3RvdHlwZS5cbiAqXG4gKiAgYGVsYCBpcyBhbiBleGNlcHRpb24gYmVjYXVzZSBpdCdzIG5vdCBhbGxvd2VkIGFzIGFuXG4gKiAgZXh0ZW5zaW9uIG9wdGlvbiwgYnV0IG9ubHkgYXMgYW4gaW5zdGFuY2Ugb3B0aW9uLlxuICovXG5mdW5jdGlvbiBpbmhlcml0T3B0aW9ucyAoY2hpbGQsIHBhcmVudCwgdG9wTGV2ZWwpIHtcbiAgICBjaGlsZCA9IGNoaWxkIHx8IHt9XG4gICAgaWYgKCFwYXJlbnQpIHJldHVybiBjaGlsZFxuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2VsJykgY29udGludWVcbiAgICAgICAgdmFyIHZhbCA9IGNoaWxkW2tleV0sXG4gICAgICAgICAgICBwYXJlbnRWYWwgPSBwYXJlbnRba2V5XVxuICAgICAgICBpZiAodG9wTGV2ZWwgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJlbnRWYWwpIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIGhvb2sgZnVuY3Rpb25zIGludG8gYW4gYXJyYXlcbiAgICAgICAgICAgIGNoaWxkW2tleV0gPSBbdmFsXVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50VmFsKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkW2tleV0gPSBjaGlsZFtrZXldLmNvbmNhdChwYXJlbnRWYWwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNoaWxkW2tleV0ucHVzaChwYXJlbnRWYWwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB0b3BMZXZlbCAmJlxuICAgICAgICAgICAgKHV0aWxzLmlzVHJ1ZU9iamVjdCh2YWwpIHx8IHV0aWxzLmlzVHJ1ZU9iamVjdChwYXJlbnRWYWwpKVxuICAgICAgICAgICAgJiYgIShwYXJlbnRWYWwgaW5zdGFuY2VvZiBWaWV3TW9kZWwpXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gbWVyZ2UgdG9wbGV2ZWwgb2JqZWN0IG9wdGlvbnNcbiAgICAgICAgICAgIGNoaWxkW2tleV0gPSBpbmhlcml0T3B0aW9ucyh2YWwsIHBhcmVudFZhbClcbiAgICAgICAgfSBlbHNlIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaW5oZXJpdCBpZiBjaGlsZCBkb2Vzbid0IG92ZXJyaWRlXG4gICAgICAgICAgICBjaGlsZFtrZXldID0gcGFyZW50VmFsXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld01vZGVsIiwiLyoganNoaW50IHByb3RvOnRydWUgKi9cblxudmFyIEVtaXR0ZXIgID0gcmVxdWlyZSgnLi9lbWl0dGVyJyksXG4gICAgdXRpbHMgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgLy8gY2FjaGUgbWV0aG9kc1xuICAgIGRlZiAgICAgID0gdXRpbHMuZGVmUHJvdGVjdGVkLFxuICAgIGlzT2JqZWN0ID0gdXRpbHMuaXNPYmplY3QsXG4gICAgaXNBcnJheSAgPSBBcnJheS5pc0FycmF5LFxuICAgIGhhc093biAgID0gKHt9KS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBvRGVmICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICBzbGljZSAgICA9IFtdLnNsaWNlLFxuICAgIC8vIGZpeCBmb3IgSUUgKyBfX3Byb3RvX18gcHJvYmxlbVxuICAgIC8vIGRlZmluZSBtZXRob2RzIGFzIGluZW51bWVyYWJsZSBpZiBfX3Byb3RvX18gaXMgcHJlc2VudCxcbiAgICAvLyBvdGhlcndpc2UgZW51bWVyYWJsZSBzbyB3ZSBjYW4gbG9vcCB0aHJvdWdoIGFuZCBtYW51YWxseVxuICAgIC8vIGF0dGFjaCB0byBhcnJheSBpbnN0YW5jZXNcbiAgICBoYXNQcm90byA9ICh7fSkuX19wcm90b19fXG5cbi8vIEFycmF5IE11dGF0aW9uIEhhbmRsZXJzICYgQXVnbWVudGF0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIHByb3h5IHByb3RvdHlwZSB0byByZXBsYWNlIHRoZSBfX3Byb3RvX18gb2Zcbi8vIGFuIG9ic2VydmVkIGFycmF5XG52YXIgQXJyYXlQcm94eSA9IE9iamVjdC5jcmVhdGUoQXJyYXkucHJvdG90eXBlKVxuXG4vLyBpbnRlcmNlcHQgbXV0YXRpb24gbWV0aG9kc1xuO1tcbiAgICAncHVzaCcsXG4gICAgJ3BvcCcsXG4gICAgJ3NoaWZ0JyxcbiAgICAndW5zaGlmdCcsXG4gICAgJ3NwbGljZScsXG4gICAgJ3NvcnQnLFxuICAgICdyZXZlcnNlJ1xuXS5mb3JFYWNoKHdhdGNoTXV0YXRpb24pXG5cbi8vIEF1Z21lbnQgdGhlIEFycmF5UHJveHkgd2l0aCBjb252ZW5pZW5jZSBtZXRob2RzXG5kZWYoQXJyYXlQcm94eSwgJyRzZXQnLCBmdW5jdGlvbiAoaW5kZXgsIGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEsIGRhdGEpWzBdXG59LCAhaGFzUHJvdG8pXG5cbmRlZihBcnJheVByb3h5LCAnJHJlbW92ZScsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5pbmRleE9mKGluZGV4KVxuICAgIH1cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gICAgfVxufSwgIWhhc1Byb3RvKVxuXG4vKipcbiAqICBJbnRlcmNlcCBhIG11dGF0aW9uIGV2ZW50IHNvIHdlIGNhbiBlbWl0IHRoZSBtdXRhdGlvbiBpbmZvLlxuICogIHdlIGFsc28gYW5hbHl6ZSB3aGF0IGVsZW1lbnRzIGFyZSBhZGRlZC9yZW1vdmVkIGFuZCBsaW5rL3VubGlua1xuICogIHRoZW0gd2l0aCB0aGUgcGFyZW50IEFycmF5LlxuICovXG5mdW5jdGlvbiB3YXRjaE11dGF0aW9uIChtZXRob2QpIHtcbiAgICBkZWYoQXJyYXlQcm94eSwgbWV0aG9kLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgICAgICByZXN1bHQgPSBBcnJheS5wcm90b3R5cGVbbWV0aG9kXS5hcHBseSh0aGlzLCBhcmdzKSxcbiAgICAgICAgICAgIGluc2VydGVkLCByZW1vdmVkXG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIG5ldyAvIHJlbW92ZWQgZWxlbWVudHNcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gJ3B1c2gnIHx8IG1ldGhvZCA9PT0gJ3Vuc2hpZnQnKSB7XG4gICAgICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdwb3AnIHx8IG1ldGhvZCA9PT0gJ3NoaWZ0Jykge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IFtyZXN1bHRdXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAnc3BsaWNlJykge1xuICAgICAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpXG4gICAgICAgICAgICByZW1vdmVkID0gcmVzdWx0XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGxpbmsgJiB1bmxpbmtcbiAgICAgICAgbGlua0FycmF5RWxlbWVudHModGhpcywgaW5zZXJ0ZWQpXG4gICAgICAgIHVubGlua0FycmF5RWxlbWVudHModGhpcywgcmVtb3ZlZClcblxuICAgICAgICAvLyBlbWl0IHRoZSBtdXRhdGlvbiBldmVudFxuICAgICAgICB0aGlzLl9fZW1pdHRlcl9fLmVtaXQoJ211dGF0ZScsICcnLCB0aGlzLCB7XG4gICAgICAgICAgICBtZXRob2QgICA6IG1ldGhvZCxcbiAgICAgICAgICAgIGFyZ3MgICAgIDogYXJncyxcbiAgICAgICAgICAgIHJlc3VsdCAgIDogcmVzdWx0LFxuICAgICAgICAgICAgaW5zZXJ0ZWQgOiBpbnNlcnRlZCxcbiAgICAgICAgICAgIHJlbW92ZWQgIDogcmVtb3ZlZFxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgXG4gICAgfSwgIWhhc1Byb3RvKVxufVxuXG4vKipcbiAqICBMaW5rIG5ldyBlbGVtZW50cyB0byBhbiBBcnJheSwgc28gd2hlbiB0aGV5IGNoYW5nZVxuICogIGFuZCBlbWl0IGV2ZW50cywgdGhlIG93bmVyIEFycmF5IGNhbiBiZSBub3RpZmllZC5cbiAqL1xuZnVuY3Rpb24gbGlua0FycmF5RWxlbWVudHMgKGFyciwgaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBpdGVtcy5sZW5ndGgsIGl0ZW0sIG93bmVyc1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbaV1cbiAgICAgICAgICAgIGlmIChpc1dhdGNoYWJsZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIG9iamVjdCBpcyBub3QgY29udmVydGVkIGZvciBvYnNlcnZpbmdcbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGl0Li4uXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLl9fZW1pdHRlcl9fKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnQoaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2goaXRlbSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3duZXJzID0gaXRlbS5fX2VtaXR0ZXJfXy5vd25lcnNcbiAgICAgICAgICAgICAgICBpZiAob3duZXJzLmluZGV4T2YoYXJyKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXJzLnB1c2goYXJyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgVW5saW5rIHJlbW92ZWQgZWxlbWVudHMgZnJvbSB0aGUgZXgtb3duZXIgQXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHVubGlua0FycmF5RWxlbWVudHMgKGFyciwgaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgdmFyIGkgPSBpdGVtcy5sZW5ndGgsIGl0ZW1cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldXG4gICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLl9fZW1pdHRlcl9fKSB7XG4gICAgICAgICAgICAgICAgdmFyIG93bmVycyA9IGl0ZW0uX19lbWl0dGVyX18ub3duZXJzXG4gICAgICAgICAgICAgICAgaWYgKG93bmVycykgb3duZXJzLnNwbGljZShvd25lcnMuaW5kZXhPZihhcnIpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBPYmplY3QgYWRkL2RlbGV0ZSBrZXkgYXVnbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBPYmpQcm94eSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSlcblxuZGVmKE9ialByb3h5LCAnJGFkZCcsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIGlmIChoYXNPd24uY2FsbCh0aGlzLCBrZXkpKSByZXR1cm5cbiAgICB0aGlzW2tleV0gPSB2YWxcbiAgICBjb252ZXJ0S2V5KHRoaXMsIGtleSwgdHJ1ZSlcbn0sICFoYXNQcm90bylcblxuZGVmKE9ialByb3h5LCAnJGRlbGV0ZScsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIShoYXNPd24uY2FsbCh0aGlzLCBrZXkpKSkgcmV0dXJuXG4gICAgLy8gdHJpZ2dlciBzZXQgZXZlbnRzXG4gICAgdGhpc1trZXldID0gdW5kZWZpbmVkXG4gICAgZGVsZXRlIHRoaXNba2V5XVxuICAgIHRoaXMuX19lbWl0dGVyX18uZW1pdCgnZGVsZXRlJywga2V5KVxufSwgIWhhc1Byb3RvKVxuXG4vLyBXYXRjaCBIZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIENoZWNrIGlmIGEgdmFsdWUgaXMgd2F0Y2hhYmxlXG4gKi9cbmZ1bmN0aW9uIGlzV2F0Y2hhYmxlIChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICYmICFvYmouJGNvbXBpbGVyXG59XG5cbi8qKlxuICogIENvbnZlcnQgYW4gT2JqZWN0L0FycmF5IHRvIGdpdmUgaXQgYSBjaGFuZ2UgZW1pdHRlci5cbiAqL1xuZnVuY3Rpb24gY29udmVydCAob2JqKSB7XG4gICAgaWYgKG9iai5fX2VtaXR0ZXJfXykgcmV0dXJuIHRydWVcbiAgICB2YXIgZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICBkZWYob2JqLCAnX19lbWl0dGVyX18nLCBlbWl0dGVyKVxuICAgIGVtaXR0ZXJcbiAgICAgICAgLm9uKCdzZXQnLCBmdW5jdGlvbiAoa2V5LCB2YWwsIHByb3BhZ2F0ZSkge1xuICAgICAgICAgICAgaWYgKHByb3BhZ2F0ZSkgcHJvcGFnYXRlQ2hhbmdlKG9iailcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtdXRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9wYWdhdGVDaGFuZ2Uob2JqKVxuICAgICAgICB9KVxuICAgIGVtaXR0ZXIudmFsdWVzID0gdXRpbHMuaGFzaCgpXG4gICAgZW1pdHRlci5vd25lcnMgPSBbXVxuICAgIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqICBQcm9wYWdhdGUgYW4gYXJyYXkgZWxlbWVudCdzIGNoYW5nZSB0byBpdHMgb3duZXIgYXJyYXlzXG4gKi9cbmZ1bmN0aW9uIHByb3BhZ2F0ZUNoYW5nZSAob2JqKSB7XG4gICAgdmFyIG93bmVycyA9IG9iai5fX2VtaXR0ZXJfXy5vd25lcnMsXG4gICAgICAgIGkgPSBvd25lcnMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBvd25lcnNbaV0uX19lbWl0dGVyX18uZW1pdCgnc2V0JywgJycsICcnLCB0cnVlKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgV2F0Y2ggdGFyZ2V0IGJhc2VkIG9uIGl0cyB0eXBlXG4gKi9cbmZ1bmN0aW9uIHdhdGNoIChvYmopIHtcbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIHdhdGNoQXJyYXkob2JqKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdhdGNoT2JqZWN0KG9iailcbiAgICB9XG59XG5cbi8qKlxuICogIEF1Z21lbnQgdGFyZ2V0IG9iamVjdHMgd2l0aCBtb2RpZmllZFxuICogIG1ldGhvZHNcbiAqL1xuZnVuY3Rpb24gYXVnbWVudCAodGFyZ2V0LCBzcmMpIHtcbiAgICBpZiAoaGFzUHJvdG8pIHtcbiAgICAgICAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyY1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgICAgICAgIGRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIFdhdGNoIGFuIE9iamVjdCwgcmVjdXJzaXZlLlxuICovXG5mdW5jdGlvbiB3YXRjaE9iamVjdCAob2JqKSB7XG4gICAgYXVnbWVudChvYmosIE9ialByb3h5KVxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgY29udmVydEtleShvYmosIGtleSlcbiAgICB9XG59XG5cbi8qKlxuICogIFdhdGNoIGFuIEFycmF5LCBvdmVybG9hZCBtdXRhdGlvbiBtZXRob2RzXG4gKiAgYW5kIGFkZCBhdWdtZW50YXRpb25zIGJ5IGludGVyY2VwdGluZyB0aGUgcHJvdG90eXBlIGNoYWluXG4gKi9cbmZ1bmN0aW9uIHdhdGNoQXJyYXkgKGFycikge1xuICAgIGF1Z21lbnQoYXJyLCBBcnJheVByb3h5KVxuICAgIGxpbmtBcnJheUVsZW1lbnRzKGFyciwgYXJyKVxufVxuXG4vKipcbiAqICBEZWZpbmUgYWNjZXNzb3JzIGZvciBhIHByb3BlcnR5IG9uIGFuIE9iamVjdFxuICogIHNvIGl0IGVtaXRzIGdldC9zZXQgZXZlbnRzLlxuICogIFRoZW4gd2F0Y2ggdGhlIHZhbHVlIGl0c2VsZi5cbiAqL1xuZnVuY3Rpb24gY29udmVydEtleSAob2JqLCBrZXksIHByb3BhZ2F0ZSkge1xuICAgIHZhciBrZXlQcmVmaXggPSBrZXkuY2hhckF0KDApXG4gICAgaWYgKGtleVByZWZpeCA9PT0gJyQnIHx8IGtleVByZWZpeCA9PT0gJ18nKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBlbWl0IHNldCBvbiBiaW5kXG4gICAgLy8gdGhpcyBtZWFucyB3aGVuIGFuIG9iamVjdCBpcyBvYnNlcnZlZCBpdCB3aWxsIGVtaXRcbiAgICAvLyBhIGZpcnN0IGJhdGNoIG9mIHNldCBldmVudHMuXG4gICAgdmFyIGVtaXR0ZXIgPSBvYmouX19lbWl0dGVyX18sXG4gICAgICAgIHZhbHVlcyAgPSBlbWl0dGVyLnZhbHVlc1xuXG4gICAgaW5pdChvYmpba2V5XSwgcHJvcGFnYXRlKVxuXG4gICAgb0RlZihvYmosIGtleSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW2tleV1cbiAgICAgICAgICAgIC8vIG9ubHkgZW1pdCBnZXQgb24gdGlwIHZhbHVlc1xuICAgICAgICAgICAgaWYgKHB1Yi5zaG91bGRHZXQpIHtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2dldCcsIGtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgICAgIHZhciBvbGRWYWwgPSB2YWx1ZXNba2V5XVxuICAgICAgICAgICAgdW5vYnNlcnZlKG9sZFZhbCwga2V5LCBlbWl0dGVyKVxuICAgICAgICAgICAgY29weVBhdGhzKG5ld1ZhbCwgb2xkVmFsKVxuICAgICAgICAgICAgLy8gYW4gaW1tZWRpYXRlIHByb3BlcnR5IHNob3VsZCBub3RpZnkgaXRzIHBhcmVudFxuICAgICAgICAgICAgLy8gdG8gZW1pdCBzZXQgZm9yIGl0c2VsZiB0b29cbiAgICAgICAgICAgIGluaXQobmV3VmFsLCB0cnVlKVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIGluaXQgKHZhbCwgcHJvcGFnYXRlKSB7XG4gICAgICAgIHZhbHVlc1trZXldID0gdmFsXG4gICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0Jywga2V5LCB2YWwsIHByb3BhZ2F0ZSlcbiAgICAgICAgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdzZXQnLCBrZXkgKyAnLmxlbmd0aCcsIHZhbC5sZW5ndGgsIHByb3BhZ2F0ZSlcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlKHZhbCwga2V5LCBlbWl0dGVyKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgV2hlbiBhIHZhbHVlIHRoYXQgaXMgYWxyZWFkeSBjb252ZXJ0ZWQgaXNcbiAqICBvYnNlcnZlZCBhZ2FpbiBieSBhbm90aGVyIG9ic2VydmVyLCB3ZSBjYW4gc2tpcFxuICogIHRoZSB3YXRjaCBjb252ZXJzaW9uIGFuZCBzaW1wbHkgZW1pdCBzZXQgZXZlbnQgZm9yXG4gKiAgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBlbWl0U2V0IChvYmopIHtcbiAgICB2YXIgZW1pdHRlciA9IG9iaiAmJiBvYmouX19lbWl0dGVyX19cbiAgICBpZiAoIWVtaXR0ZXIpIHJldHVyblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgZW1pdHRlci5lbWl0KCdzZXQnLCAnbGVuZ3RoJywgb2JqLmxlbmd0aClcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIga2V5LCB2YWxcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICB2YWwgPSBvYmpba2V5XVxuICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdzZXQnLCBrZXksIHZhbClcbiAgICAgICAgICAgIGVtaXRTZXQodmFsKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBNYWtlIHN1cmUgYWxsIHRoZSBwYXRocyBpbiBhbiBvbGQgb2JqZWN0IGV4aXN0c1xuICogIGluIGEgbmV3IG9iamVjdC5cbiAqICBTbyB3aGVuIGFuIG9iamVjdCBjaGFuZ2VzLCBhbGwgbWlzc2luZyBrZXlzIHdpbGxcbiAqICBlbWl0IGEgc2V0IGV2ZW50IHdpdGggdW5kZWZpbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBjb3B5UGF0aHMgKG5ld09iaiwgb2xkT2JqKSB7XG4gICAgaWYgKCFpc09iamVjdChuZXdPYmopIHx8ICFpc09iamVjdChvbGRPYmopKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgcGF0aCwgb2xkVmFsLCBuZXdWYWxcbiAgICBmb3IgKHBhdGggaW4gb2xkT2JqKSB7XG4gICAgICAgIGlmICghKGhhc093bi5jYWxsKG5ld09iaiwgcGF0aCkpKSB7XG4gICAgICAgICAgICBvbGRWYWwgPSBvbGRPYmpbcGF0aF1cbiAgICAgICAgICAgIGlmIChpc0FycmF5KG9sZFZhbCkpIHtcbiAgICAgICAgICAgICAgICBuZXdPYmpbcGF0aF0gPSBbXVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChvbGRWYWwpKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsID0gbmV3T2JqW3BhdGhdID0ge31cbiAgICAgICAgICAgICAgICBjb3B5UGF0aHMobmV3VmFsLCBvbGRWYWwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09ialtwYXRoXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICB3YWxrIGFsb25nIGEgcGF0aCBhbmQgbWFrZSBzdXJlIGl0IGNhbiBiZSBhY2Nlc3NlZFxuICogIGFuZCBlbnVtZXJhdGVkIGluIHRoYXQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGVuc3VyZVBhdGggKG9iaiwga2V5KSB7XG4gICAgdmFyIHBhdGggPSBrZXkuc3BsaXQoJy4nKSwgc2VjXG4gICAgZm9yICh2YXIgaSA9IDAsIGQgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPCBkOyBpKyspIHtcbiAgICAgICAgc2VjID0gcGF0aFtpXVxuICAgICAgICBpZiAoIW9ialtzZWNdKSB7XG4gICAgICAgICAgICBvYmpbc2VjXSA9IHt9XG4gICAgICAgICAgICBpZiAob2JqLl9fZW1pdHRlcl9fKSBjb252ZXJ0S2V5KG9iaiwgc2VjKVxuICAgICAgICB9XG4gICAgICAgIG9iaiA9IG9ialtzZWNdXG4gICAgfVxuICAgIGlmIChpc09iamVjdChvYmopKSB7XG4gICAgICAgIHNlYyA9IHBhdGhbaV1cbiAgICAgICAgaWYgKCEoaGFzT3duLmNhbGwob2JqLCBzZWMpKSkge1xuICAgICAgICAgICAgb2JqW3NlY10gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGlmIChvYmouX19lbWl0dGVyX18pIGNvbnZlcnRLZXkob2JqLCBzZWMpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE1haW4gQVBJIE1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgT2JzZXJ2ZSBhbiBvYmplY3Qgd2l0aCBhIGdpdmVuIHBhdGgsXG4gKiAgYW5kIHByb3h5IGdldC9zZXQvbXV0YXRlIGV2ZW50cyB0byB0aGUgcHJvdmlkZWQgb2JzZXJ2ZXIuXG4gKi9cbmZ1bmN0aW9uIG9ic2VydmUgKG9iaiwgcmF3UGF0aCwgb2JzZXJ2ZXIpIHtcblxuICAgIGlmICghaXNXYXRjaGFibGUob2JqKSkgcmV0dXJuXG5cbiAgICB2YXIgcGF0aCA9IHJhd1BhdGggPyByYXdQYXRoICsgJy4nIDogJycsXG4gICAgICAgIGFscmVhZHlDb252ZXJ0ZWQgPSBjb252ZXJ0KG9iaiksXG4gICAgICAgIGVtaXR0ZXIgPSBvYmouX19lbWl0dGVyX19cblxuICAgIC8vIHNldHVwIHByb3h5IGxpc3RlbmVycyBvbiB0aGUgcGFyZW50IG9ic2VydmVyLlxuICAgIC8vIHdlIG5lZWQgdG8ga2VlcCByZWZlcmVuY2UgdG8gdGhlbSBzbyB0aGF0IHRoZXlcbiAgICAvLyBjYW4gYmUgcmVtb3ZlZCB3aGVuIHRoZSBvYmplY3QgaXMgdW4tb2JzZXJ2ZWQuXG4gICAgb2JzZXJ2ZXIucHJveGllcyA9IG9ic2VydmVyLnByb3hpZXMgfHwge31cbiAgICB2YXIgcHJveGllcyA9IG9ic2VydmVyLnByb3hpZXNbcGF0aF0gPSB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnZ2V0JywgcGF0aCArIGtleSlcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWwsIHByb3BhZ2F0ZSkge1xuICAgICAgICAgICAgaWYgKGtleSkgb2JzZXJ2ZXIuZW1pdCgnc2V0JywgcGF0aCArIGtleSwgdmFsKVxuICAgICAgICAgICAgLy8gYWxzbyBub3RpZnkgb2JzZXJ2ZXIgdGhhdCB0aGUgb2JqZWN0IGl0c2VsZiBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBidXQgb25seSBkbyBzbyB3aGVuIGl0J3MgYSBpbW1lZGlhdGUgcHJvcGVydHkuIHRoaXNcbiAgICAgICAgICAgIC8vIGF2b2lkcyBkdXBsaWNhdGUgZXZlbnQgZmlyaW5nLlxuICAgICAgICAgICAgaWYgKHJhd1BhdGggJiYgcHJvcGFnYXRlKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnc2V0JywgcmF3UGF0aCwgb2JqLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtdXRhdGU6IGZ1bmN0aW9uIChrZXksIHZhbCwgbXV0YXRpb24pIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBBcnJheSBpcyBhIHJvb3QgdmFsdWVcbiAgICAgICAgICAgIC8vIHRoZSBrZXkgd2lsbCBiZSBudWxsXG4gICAgICAgICAgICB2YXIgZml4ZWRQYXRoID0ga2V5ID8gcGF0aCArIGtleSA6IHJhd1BhdGhcbiAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ211dGF0ZScsIGZpeGVkUGF0aCwgdmFsLCBtdXRhdGlvbilcbiAgICAgICAgICAgIC8vIGFsc28gZW1pdCBzZXQgZm9yIEFycmF5J3MgbGVuZ3RoIHdoZW4gaXQgbXV0YXRlc1xuICAgICAgICAgICAgdmFyIG0gPSBtdXRhdGlvbi5tZXRob2RcbiAgICAgICAgICAgIGlmIChtICE9PSAnc29ydCcgJiYgbSAhPT0gJ3JldmVyc2UnKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnc2V0JywgZml4ZWRQYXRoICsgJy5sZW5ndGgnLCB2YWwubGVuZ3RoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXR0YWNoIHRoZSBsaXN0ZW5lcnMgdG8gdGhlIGNoaWxkIG9ic2VydmVyLlxuICAgIC8vIG5vdyBhbGwgdGhlIGV2ZW50cyB3aWxsIHByb3BhZ2F0ZSB1cHdhcmRzLlxuICAgIGVtaXR0ZXJcbiAgICAgICAgLm9uKCdnZXQnLCBwcm94aWVzLmdldClcbiAgICAgICAgLm9uKCdzZXQnLCBwcm94aWVzLnNldClcbiAgICAgICAgLm9uKCdtdXRhdGUnLCBwcm94aWVzLm11dGF0ZSlcblxuICAgIGlmIChhbHJlYWR5Q29udmVydGVkKSB7XG4gICAgICAgIC8vIGZvciBvYmplY3RzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gY29udmVydGVkLFxuICAgICAgICAvLyBlbWl0IHNldCBldmVudHMgZm9yIGV2ZXJ5dGhpbmcgaW5zaWRlXG4gICAgICAgIGVtaXRTZXQob2JqKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdhdGNoKG9iailcbiAgICB9XG59XG5cbi8qKlxuICogIENhbmNlbCBvYnNlcnZhdGlvbiwgdHVybiBvZmYgdGhlIGxpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gdW5vYnNlcnZlIChvYmosIHBhdGgsIG9ic2VydmVyKSB7XG5cbiAgICBpZiAoIW9iaiB8fCAhb2JqLl9fZW1pdHRlcl9fKSByZXR1cm5cblxuICAgIHBhdGggPSBwYXRoID8gcGF0aCArICcuJyA6ICcnXG4gICAgdmFyIHByb3hpZXMgPSBvYnNlcnZlci5wcm94aWVzW3BhdGhdXG4gICAgaWYgKCFwcm94aWVzKSByZXR1cm5cblxuICAgIC8vIHR1cm4gb2ZmIGxpc3RlbmVyc1xuICAgIG9iai5fX2VtaXR0ZXJfX1xuICAgICAgICAub2ZmKCdnZXQnLCBwcm94aWVzLmdldClcbiAgICAgICAgLm9mZignc2V0JywgcHJveGllcy5zZXQpXG4gICAgICAgIC5vZmYoJ211dGF0ZScsIHByb3hpZXMubXV0YXRlKVxuXG4gICAgLy8gcmVtb3ZlIHJlZmVyZW5jZVxuICAgIG9ic2VydmVyLnByb3hpZXNbcGF0aF0gPSBudWxsXG59XG5cbi8vIEV4cG9zZSBBUEkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHB1YiA9IG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLy8gd2hldGhlciB0byBlbWl0IGdldCBldmVudHNcbiAgICAvLyBvbmx5IGVuYWJsZWQgZHVyaW5nIGRlcGVuZGVuY3kgcGFyc2luZ1xuICAgIHNob3VsZEdldCAgIDogZmFsc2UsXG5cbiAgICBvYnNlcnZlICAgICA6IG9ic2VydmUsXG4gICAgdW5vYnNlcnZlICAgOiB1bm9ic2VydmUsXG4gICAgZW5zdXJlUGF0aCAgOiBlbnN1cmVQYXRoLFxuICAgIGNvcHlQYXRocyAgIDogY29weVBhdGhzLFxuICAgIHdhdGNoICAgICAgIDogd2F0Y2gsXG4gICAgY29udmVydCAgICAgOiBjb252ZXJ0LFxuICAgIGNvbnZlcnRLZXkgIDogY29udmVydEtleVxufSIsInZhciB0b0ZyYWdtZW50ID0gcmVxdWlyZSgnLi9mcmFnbWVudCcpO1xuXG4vKipcbiAqIFBhcnNlcyBhIHRlbXBsYXRlIHN0cmluZyBvciBub2RlIGFuZCBub3JtYWxpemVzIGl0IGludG8gYVxuICogYSBub2RlIHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBwYXJ0aWFsIG9mIGEgdGVtcGxhdGUgb3B0aW9uXG4gKlxuICogUG9zc2libGUgdmFsdWVzIGluY2x1ZGVcbiAqIGlkIHNlbGVjdG9yOiAnI3NvbWUtdGVtcGxhdGUtaWQnXG4gKiB0ZW1wbGF0ZSBzdHJpbmc6ICc8ZGl2PjxzcGFuPm15IHRlbXBsYXRlPC9zcGFuPjwvZGl2PidcbiAqIERvY3VtZW50RnJhZ21lbnQgb2JqZWN0XG4gKiBOb2RlIG9iamVjdCBvZiB0eXBlIFRlbXBsYXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICB2YXIgdGVtcGxhdGVOb2RlO1xuXG4gICAgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2Ygd2luZG93LkRvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgLy8gaWYgdGhlIHRlbXBsYXRlIGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCAtLSBkbyBub3RoaW5nXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIHRlbXBsYXRlIGJ5IElEXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgICAgdGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGUuc2xpY2UoMSkpXG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlTm9kZSkgcmV0dXJuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdG9GcmFnbWVudCh0ZW1wbGF0ZSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUubm9kZVR5cGUpIHtcbiAgICAgICAgdGVtcGxhdGVOb2RlID0gdGVtcGxhdGVcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBpZiBpdHMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LFxuICAgIC8vIGl0cyBjb250ZW50IGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCFcbiAgICBpZiAodGVtcGxhdGVOb2RlLnRhZ05hbWUgPT09ICdURU1QTEFURScgJiYgdGVtcGxhdGVOb2RlLmNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlTm9kZS5jb250ZW50XG4gICAgfVxuXG4gICAgaWYgKHRlbXBsYXRlTm9kZS50YWdOYW1lID09PSAnU0NSSVBUJykge1xuICAgICAgICByZXR1cm4gdG9GcmFnbWVudCh0ZW1wbGF0ZU5vZGUuaW5uZXJIVE1MKVxuICAgIH1cblxuICAgIHJldHVybiB0b0ZyYWdtZW50KHRlbXBsYXRlTm9kZS5vdXRlckhUTUwpO1xufVxuIiwidmFyIG9wZW5DaGFyICAgICAgICA9ICd7JyxcbiAgICBlbmRDaGFyICAgICAgICAgPSAnfScsXG4gICAgRVNDQVBFX1JFICAgICAgID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZyxcbiAgICAvLyBsYXp5IHJlcXVpcmVcbiAgICBEaXJlY3RpdmVcblxuZXhwb3J0cy5SZWdleCA9IGJ1aWxkSW50ZXJwb2xhdGlvblJlZ2V4KClcblxuZnVuY3Rpb24gYnVpbGRJbnRlcnBvbGF0aW9uUmVnZXggKCkge1xuICAgIHZhciBvcGVuID0gZXNjYXBlUmVnZXgob3BlbkNoYXIpLFxuICAgICAgICBlbmQgID0gZXNjYXBlUmVnZXgoZW5kQ2hhcilcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChvcGVuICsgb3BlbiArIG9wZW4gKyAnPyguKz8pJyArIGVuZCArICc/JyArIGVuZCArIGVuZClcbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXggKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShFU0NBUEVfUkUsICdcXFxcJCYnKVxufVxuXG5mdW5jdGlvbiBzZXREZWxpbWl0ZXJzIChkZWxpbWl0ZXJzKSB7XG4gICAgb3BlbkNoYXIgPSBkZWxpbWl0ZXJzWzBdXG4gICAgZW5kQ2hhciA9IGRlbGltaXRlcnNbMV1cbiAgICBleHBvcnRzLmRlbGltaXRlcnMgPSBkZWxpbWl0ZXJzXG4gICAgZXhwb3J0cy5SZWdleCA9IGJ1aWxkSW50ZXJwb2xhdGlvblJlZ2V4KClcbn1cblxuLyoqIFxuICogIFBhcnNlIGEgcGllY2Ugb2YgdGV4dCwgcmV0dXJuIGFuIGFycmF5IG9mIHRva2Vuc1xuICogIHRva2VuIHR5cGVzOlxuICogIDEuIHBsYWluIHN0cmluZ1xuICogIDIuIG9iamVjdCB3aXRoIGtleSA9IGJpbmRpbmcga2V5XG4gKiAgMy4gb2JqZWN0IHdpdGgga2V5ICYgaHRtbCA9IHRydWVcbiAqL1xuZnVuY3Rpb24gcGFyc2UgKHRleHQpIHtcbiAgICBpZiAoIWV4cG9ydHMuUmVnZXgudGVzdCh0ZXh0KSkgcmV0dXJuIG51bGxcbiAgICB2YXIgbSwgaSwgdG9rZW4sIG1hdGNoLCB0b2tlbnMgPSBbXVxuICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgd2hpbGUgKG0gPSB0ZXh0Lm1hdGNoKGV4cG9ydHMuUmVnZXgpKSB7XG4gICAgICAgIGkgPSBtLmluZGV4XG4gICAgICAgIGlmIChpID4gMCkgdG9rZW5zLnB1c2godGV4dC5zbGljZSgwLCBpKSlcbiAgICAgICAgdG9rZW4gPSB7IGtleTogbVsxXS50cmltKCkgfVxuICAgICAgICBtYXRjaCA9IG1bMF1cbiAgICAgICAgdG9rZW4uaHRtbCA9XG4gICAgICAgICAgICBtYXRjaC5jaGFyQXQoMikgPT09IG9wZW5DaGFyICYmXG4gICAgICAgICAgICBtYXRjaC5jaGFyQXQobWF0Y2gubGVuZ3RoIC0gMykgPT09IGVuZENoYXJcbiAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pXG4gICAgICAgIHRleHQgPSB0ZXh0LnNsaWNlKGkgKyBtWzBdLmxlbmd0aClcbiAgICB9XG4gICAgaWYgKHRleHQubGVuZ3RoKSB0b2tlbnMucHVzaCh0ZXh0KVxuICAgIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiAgUGFyc2UgYW4gYXR0cmlidXRlIHZhbHVlIHdpdGggcG9zc2libGUgaW50ZXJwb2xhdGlvbiB0YWdzXG4gKiAgcmV0dXJuIGEgRGlyZWN0aXZlLWZyaWVuZGx5IGV4cHJlc3Npb25cbiAqXG4gKiAgZS5nLiAgYSB7e2J9fSBjICA9PiAgXCJhIFwiICsgYiArIFwiIGNcIlxuICovXG5mdW5jdGlvbiBwYXJzZUF0dHIgKGF0dHIpIHtcbiAgICBEaXJlY3RpdmUgPSBEaXJlY3RpdmUgfHwgcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxuICAgIHZhciB0b2tlbnMgPSBwYXJzZShhdHRyKVxuICAgIGlmICghdG9rZW5zKSByZXR1cm4gbnVsbFxuICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSAxKSByZXR1cm4gdG9rZW5zWzBdLmtleVxuICAgIHZhciByZXMgPSBbXSwgdG9rZW5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgICAgcmVzLnB1c2goXG4gICAgICAgICAgICB0b2tlbi5rZXlcbiAgICAgICAgICAgICAgICA/IGlubGluZUZpbHRlcnModG9rZW4ua2V5KVxuICAgICAgICAgICAgICAgIDogKCdcIicgKyB0b2tlbiArICdcIicpXG4gICAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5qb2luKCcrJylcbn1cblxuLyoqXG4gKiAgSW5saW5lcyBhbnkgcG9zc2libGUgZmlsdGVycyBpbiBhIGJpbmRpbmdcbiAqICBzbyB0aGF0IHdlIGNhbiBjb21iaW5lIGV2ZXJ5dGhpbmcgaW50byBhIGh1Z2UgZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpbmxpbmVGaWx0ZXJzIChrZXkpIHtcbiAgICBpZiAoa2V5LmluZGV4T2YoJ3wnKSA+IC0xKSB7XG4gICAgICAgIHZhciBkaXJzID0gRGlyZWN0aXZlLnBhcnNlKGtleSksXG4gICAgICAgICAgICBkaXIgPSBkaXJzICYmIGRpcnNbMF1cbiAgICAgICAgaWYgKGRpciAmJiBkaXIuZmlsdGVycykge1xuICAgICAgICAgICAga2V5ID0gRGlyZWN0aXZlLmlubGluZUZpbHRlcnMoXG4gICAgICAgICAgICAgICAgZGlyLmtleSxcbiAgICAgICAgICAgICAgICBkaXIuZmlsdGVyc1xuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnKCcgKyBrZXkgKyAnKSdcbn1cblxuZXhwb3J0cy5wYXJzZSAgICAgICAgID0gcGFyc2VcbmV4cG9ydHMucGFyc2VBdHRyICAgICA9IHBhcnNlQXR0clxuZXhwb3J0cy5zZXREZWxpbWl0ZXJzID0gc2V0RGVsaW1pdGVyc1xuZXhwb3J0cy5kZWxpbWl0ZXJzICAgID0gW29wZW5DaGFyLCBlbmRDaGFyXSIsInZhciBlbmRFdmVudHMgID0gc25pZmZFbmRFdmVudHMoKSxcbiAgICBjb25maWcgICAgID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICAvLyBiYXRjaCBlbnRlciBhbmltYXRpb25zIHNvIHdlIG9ubHkgZm9yY2UgdGhlIGxheW91dCBvbmNlXG4gICAgQmF0Y2hlciAgICA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpLFxuICAgIGJhdGNoZXIgICAgPSBuZXcgQmF0Y2hlcigpLFxuICAgIC8vIGNhY2hlIHRpbWVyIGZ1bmN0aW9uc1xuICAgIHNldFRPICAgICAgPSB3aW5kb3cuc2V0VGltZW91dCxcbiAgICBjbGVhclRPICAgID0gd2luZG93LmNsZWFyVGltZW91dCxcbiAgICAvLyBleGl0IGNvZGVzIGZvciB0ZXN0aW5nXG4gICAgY29kZXMgPSB7XG4gICAgICAgIENTU19FICAgICA6IDEsXG4gICAgICAgIENTU19MICAgICA6IDIsXG4gICAgICAgIEpTX0UgICAgICA6IDMsXG4gICAgICAgIEpTX0wgICAgICA6IDQsXG4gICAgICAgIENTU19TS0lQICA6IC0xLFxuICAgICAgICBKU19TS0lQICAgOiAtMixcbiAgICAgICAgSlNfU0tJUF9FIDogLTMsXG4gICAgICAgIEpTX1NLSVBfTCA6IC00LFxuICAgICAgICBJTklUICAgICAgOiAtNSxcbiAgICAgICAgU0tJUCAgICAgIDogLTZcbiAgICB9XG5cbi8vIGZvcmNlIGxheW91dCBiZWZvcmUgdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy9hbmltYXRpb25zXG5iYXRjaGVyLl9wcmVGbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xuICAgIHZhciBmID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHRcbn1cblxuLyoqXG4gKiAgc3RhZ2U6XG4gKiAgICAxID0gZW50ZXJcbiAqICAgIDIgPSBsZWF2ZVxuICovXG52YXIgdHJhbnNpdGlvbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsLCBzdGFnZSwgY2IsIGNvbXBpbGVyKSB7XG5cbiAgICB2YXIgY2hhbmdlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNiKClcbiAgICAgICAgY29tcGlsZXIuZXhlY0hvb2soc3RhZ2UgPiAwID8gJ2F0dGFjaGVkJyA6ICdkZXRhY2hlZCcpXG4gICAgfVxuXG4gICAgaWYgKGNvbXBpbGVyLmluaXQpIHtcbiAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICByZXR1cm4gY29kZXMuSU5JVFxuICAgIH1cblxuICAgIHZhciBoYXNUcmFuc2l0aW9uID0gZWwudnVlX3RyYW5zID09PSAnJyxcbiAgICAgICAgaGFzQW5pbWF0aW9uICA9IGVsLnZ1ZV9hbmltID09PSAnJyxcbiAgICAgICAgZWZmZWN0SWQgICAgICA9IGVsLnZ1ZV9lZmZlY3RcblxuICAgIGlmIChlZmZlY3RJZCkge1xuICAgICAgICByZXR1cm4gYXBwbHlUcmFuc2l0aW9uRnVuY3Rpb25zKFxuICAgICAgICAgICAgZWwsXG4gICAgICAgICAgICBzdGFnZSxcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlLFxuICAgICAgICAgICAgZWZmZWN0SWQsXG4gICAgICAgICAgICBjb21waWxlclxuICAgICAgICApXG4gICAgfSBlbHNlIGlmIChoYXNUcmFuc2l0aW9uIHx8IGhhc0FuaW1hdGlvbikge1xuICAgICAgICByZXR1cm4gYXBwbHlUcmFuc2l0aW9uQ2xhc3MoXG4gICAgICAgICAgICBlbCxcbiAgICAgICAgICAgIHN0YWdlLFxuICAgICAgICAgICAgY2hhbmdlU3RhdGUsXG4gICAgICAgICAgICBoYXNBbmltYXRpb25cbiAgICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLlNLSVBcbiAgICB9XG5cbn1cblxuLyoqXG4gKiAgVG9nZ2dsZSBhIENTUyBjbGFzcyB0byB0cmlnZ2VyIHRyYW5zaXRpb25cbiAqL1xuZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uQ2xhc3MgKGVsLCBzdGFnZSwgY2hhbmdlU3RhdGUsIGhhc0FuaW1hdGlvbikge1xuXG4gICAgaWYgKCFlbmRFdmVudHMudHJhbnMpIHtcbiAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICByZXR1cm4gY29kZXMuQ1NTX1NLSVBcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2l0aW9uLFxuICAgIC8vIGl0IG11c3QgaGF2ZSBjbGFzc0xpc3QuLi5cbiAgICB2YXIgb25FbmQsXG4gICAgICAgIGNsYXNzTGlzdCAgICAgICAgPSBlbC5jbGFzc0xpc3QsXG4gICAgICAgIGV4aXN0aW5nQ2FsbGJhY2sgPSBlbC52dWVfdHJhbnNfY2IsXG4gICAgICAgIGVudGVyQ2xhc3MgICAgICAgPSBjb25maWcuZW50ZXJDbGFzcyxcbiAgICAgICAgbGVhdmVDbGFzcyAgICAgICA9IGNvbmZpZy5sZWF2ZUNsYXNzLFxuICAgICAgICBlbmRFdmVudCAgICAgICAgID0gaGFzQW5pbWF0aW9uID8gZW5kRXZlbnRzLmFuaW0gOiBlbmRFdmVudHMudHJhbnNcblxuICAgIC8vIGNhbmNlbCB1bmZpbmlzaGVkIGNhbGxiYWNrcyBhbmQgam9ic1xuICAgIGlmIChleGlzdGluZ0NhbGxiYWNrKSB7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIGV4aXN0aW5nQ2FsbGJhY2spXG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoZW50ZXJDbGFzcylcbiAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShsZWF2ZUNsYXNzKVxuICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHN0YWdlID4gMCkgeyAvLyBlbnRlclxuXG4gICAgICAgIC8vIHNldCB0byBlbnRlciBzdGF0ZSBiZWZvcmUgYXBwZW5kaW5nXG4gICAgICAgIGNsYXNzTGlzdC5hZGQoZW50ZXJDbGFzcylcbiAgICAgICAgLy8gYXBwZW5kXG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgLy8gdHJpZ2dlciB0cmFuc2l0aW9uXG4gICAgICAgIGlmICghaGFzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBiYXRjaGVyLnB1c2goe1xuICAgICAgICAgICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShlbnRlckNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBlbCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZClcbiAgICAgICAgICAgICAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGVudGVyQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpXG4gICAgICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBvbkVuZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2Rlcy5DU1NfRVxuXG4gICAgfSBlbHNlIHsgLy8gbGVhdmVcblxuICAgICAgICBpZiAoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgICAgICAvLyB0cmlnZ2VyIGhpZGUgdHJhbnNpdGlvblxuICAgICAgICAgICAgY2xhc3NMaXN0LmFkZChsZWF2ZUNsYXNzKVxuICAgICAgICAgICAgb25FbmQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpXG4gICAgICAgICAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgLy8gYWN0dWFsbHkgcmVtb3ZlIG5vZGUgaGVyZVxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobGVhdmVDbGFzcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhdHRhY2ggdHJhbnNpdGlvbiBlbmQgbGlzdGVuZXJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gb25FbmRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRpcmVjdGx5IHJlbW92ZSBpbnZpc2libGUgZWxlbWVudHNcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29kZXMuQ1NTX0xcbiAgICAgICAgXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkZ1bmN0aW9ucyAoZWwsIHN0YWdlLCBjaGFuZ2VTdGF0ZSwgZWZmZWN0SWQsIGNvbXBpbGVyKSB7XG5cbiAgICB2YXIgZnVuY3MgPSBjb21waWxlci5nZXRPcHRpb24oJ2VmZmVjdHMnLCBlZmZlY3RJZClcbiAgICBpZiAoIWZ1bmNzKSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLkpTX1NLSVBcbiAgICB9XG5cbiAgICB2YXIgZW50ZXIgPSBmdW5jcy5lbnRlcixcbiAgICAgICAgbGVhdmUgPSBmdW5jcy5sZWF2ZSxcbiAgICAgICAgdGltZW91dHMgPSBlbC52dWVfdGltZW91dHNcblxuICAgIC8vIGNsZWFyIHByZXZpb3VzIHRpbWVvdXRzXG4gICAgaWYgKHRpbWVvdXRzKSB7XG4gICAgICAgIHZhciBpID0gdGltZW91dHMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGNsZWFyVE8odGltZW91dHNbaV0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aW1lb3V0cyA9IGVsLnZ1ZV90aW1lb3V0cyA9IFtdXG4gICAgZnVuY3Rpb24gdGltZW91dCAoY2IsIGRlbGF5KSB7XG4gICAgICAgIHZhciBpZCA9IHNldFRPKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNiKClcbiAgICAgICAgICAgIHRpbWVvdXRzLnNwbGljZSh0aW1lb3V0cy5pbmRleE9mKGlkKSwgMSlcbiAgICAgICAgICAgIGlmICghdGltZW91dHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZWwudnVlX3RpbWVvdXRzID0gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBkZWxheSlcbiAgICAgICAgdGltZW91dHMucHVzaChpZClcbiAgICB9XG5cbiAgICBpZiAoc3RhZ2UgPiAwKSB7IC8vIGVudGVyXG4gICAgICAgIGlmICh0eXBlb2YgZW50ZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgICAgIHJldHVybiBjb2Rlcy5KU19TS0lQX0VcbiAgICAgICAgfVxuICAgICAgICBlbnRlcihlbCwgY2hhbmdlU3RhdGUsIHRpbWVvdXQpXG4gICAgICAgIHJldHVybiBjb2Rlcy5KU19FXG4gICAgfSBlbHNlIHsgLy8gbGVhdmVcbiAgICAgICAgaWYgKHR5cGVvZiBsZWF2ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICAgICAgcmV0dXJuIGNvZGVzLkpTX1NLSVBfTFxuICAgICAgICB9XG4gICAgICAgIGxlYXZlKGVsLCBjaGFuZ2VTdGF0ZSwgdGltZW91dClcbiAgICAgICAgcmV0dXJuIGNvZGVzLkpTX0xcbiAgICB9XG5cbn1cblxuLyoqXG4gKiAgU25pZmYgcHJvcGVyIHRyYW5zaXRpb24gZW5kIGV2ZW50IG5hbWVcbiAqL1xuZnVuY3Rpb24gc25pZmZFbmRFdmVudHMgKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Z1ZScpLFxuICAgICAgICBkZWZhdWx0RXZlbnQgPSAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgIGV2ZW50cyA9IHtcbiAgICAgICAgICAgICd3ZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICd0cmFuc2l0aW9uJyAgICAgICA6IGRlZmF1bHRFdmVudCxcbiAgICAgICAgICAgICdtb3pUcmFuc2l0aW9uJyAgICA6IGRlZmF1bHRFdmVudFxuICAgICAgICB9LFxuICAgICAgICByZXQgPSB7fVxuICAgIGZvciAodmFyIG5hbWUgaW4gZXZlbnRzKSB7XG4gICAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXQudHJhbnMgPSBldmVudHNbbmFtZV1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0LmFuaW0gPSBlbC5zdHlsZS5hbmltYXRpb24gPT09ICcnXG4gICAgICAgID8gJ2FuaW1hdGlvbmVuZCdcbiAgICAgICAgOiAnd2Via2l0QW5pbWF0aW9uRW5kJ1xuICAgIHJldHVybiByZXRcbn1cblxuLy8gRXhwb3NlIHNvbWUgc3R1ZmYgZm9yIHRlc3RpbmcgcHVycG9zZXNcbnRyYW5zaXRpb24uY29kZXMgPSBjb2Rlc1xudHJhbnNpdGlvbi5zbmlmZiA9IHNuaWZmRW5kRXZlbnRzIiwidmFyIGNvbmZpZyAgICAgICA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgdG9TdHJpbmcgICAgID0gKHt9KS50b1N0cmluZyxcbiAgICB3aW4gICAgICAgICAgPSB3aW5kb3csXG4gICAgY29uc29sZSAgICAgID0gd2luLmNvbnNvbGUsXG4gICAgZGVmICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgIE9CSkVDVCAgICAgICA9ICdvYmplY3QnLFxuICAgIFRISVNfUkUgICAgICA9IC9bXlxcd110aGlzW15cXHddLyxcbiAgICBCUkFDS0VUX1JFX1MgPSAvXFxbJyhbXiddKyknXFxdL2csXG4gICAgQlJBQ0tFVF9SRV9EID0gL1xcW1wiKFteXCJdKylcIlxcXS9nLFxuICAgIGhhc0NsYXNzTGlzdCA9ICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICBWaWV3TW9kZWwgLy8gbGF0ZSBkZWZcblxudmFyIGRlZmVyID1cbiAgICB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbi5zZXRUaW1lb3V0XG5cbi8qKlxuICogIE5vcm1hbGl6ZSBrZXlwYXRoIHdpdGggcG9zc2libGUgYnJhY2tldHMgaW50byBkb3Qgbm90YXRpb25zXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUtleXBhdGggKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZignWycpIDwgMFxuICAgICAgICA/IGtleVxuICAgICAgICA6IGtleS5yZXBsYWNlKEJSQUNLRVRfUkVfUywgJy4kMScpXG4gICAgICAgICAgICAgLnJlcGxhY2UoQlJBQ0tFVF9SRV9ELCAnLiQxJylcbn1cblxudmFyIHV0aWxzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAvKipcbiAgICAgKiAgQ29udmVydCBhIHN0cmluZyB0ZW1wbGF0ZSB0byBhIGRvbSBmcmFnbWVudFxuICAgICAqL1xuICAgIHRvRnJhZ21lbnQ6IHJlcXVpcmUoJy4vZnJhZ21lbnQnKSxcblxuICAgIC8qKlxuICAgICAqICBQYXJzZSB0aGUgdmFyaW91cyB0eXBlcyBvZiB0ZW1wbGF0ZSBvcHRpb25zXG4gICAgICovXG4gICAgcGFyc2VUZW1wbGF0ZU9wdGlvbjogcmVxdWlyZSgnLi90ZW1wbGF0ZS1wYXJzZXIuanMnKSxcblxuICAgIC8qKlxuICAgICAqICBnZXQgYSB2YWx1ZSBmcm9tIGFuIG9iamVjdCBrZXlwYXRoXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAga2V5ID0gbm9ybWFsaXplS2V5cGF0aChrZXkpXG4gICAgICAgIGlmIChrZXkuaW5kZXhPZignLicpIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG9ialtrZXldXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhdGggPSBrZXkuc3BsaXQoJy4nKSxcbiAgICAgICAgICAgIGQgPSAtMSwgbCA9IHBhdGgubGVuZ3RoXG4gICAgICAgIHdoaWxlICgrK2QgPCBsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICBvYmogPSBvYmpbcGF0aFtkXV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBzZXQgYSB2YWx1ZSB0byBhbiBvYmplY3Qga2V5cGF0aFxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24gKG9iaiwga2V5LCB2YWwpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAga2V5ID0gbm9ybWFsaXplS2V5cGF0aChrZXkpXG4gICAgICAgIGlmIChrZXkuaW5kZXhPZignLicpIDwgMCkge1xuICAgICAgICAgICAgb2JqW2tleV0gPSB2YWxcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgICBkID0gLTEsIGwgPSBwYXRoLmxlbmd0aCAtIDFcbiAgICAgICAgd2hpbGUgKCsrZCA8IGwpIHtcbiAgICAgICAgICAgIGlmIChvYmpbcGF0aFtkXV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG9ialtwYXRoW2RdXSA9IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmogPSBvYmpbcGF0aFtkXV1cbiAgICAgICAgfVxuICAgICAgICBvYmpbcGF0aFtkXV0gPSB2YWxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHJldHVybiB0aGUgYmFzZSBzZWdtZW50IG9mIGEga2V5cGF0aFxuICAgICAqL1xuICAgIGJhc2VLZXk6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5pbmRleE9mKCcuJykgPiAwXG4gICAgICAgICAgICA/IGtleS5zcGxpdCgnLicpWzBdXG4gICAgICAgICAgICA6IGtleVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQ3JlYXRlIGEgcHJvdG90eXBlLWxlc3Mgb2JqZWN0XG4gICAgICogIHdoaWNoIGlzIGEgYmV0dGVyIGhhc2gvbWFwXG4gICAgICovXG4gICAgaGFzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgZ2V0IGFuIGF0dHJpYnV0ZSBhbmQgcmVtb3ZlIGl0LlxuICAgICAqL1xuICAgIGF0dHI6IGZ1bmN0aW9uIChlbCwgdHlwZSkge1xuICAgICAgICB2YXIgYXR0ciA9IGNvbmZpZy5wcmVmaXggKyAnLScgKyB0eXBlLFxuICAgICAgICAgICAgdmFsID0gZWwuZ2V0QXR0cmlidXRlKGF0dHIpXG4gICAgICAgIGlmICh2YWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIERlZmluZSBhbiBpZW51bWVyYWJsZSBwcm9wZXJ0eVxuICAgICAqICBUaGlzIGF2b2lkcyBpdCBiZWluZyBpbmNsdWRlZCBpbiBKU09OLnN0cmluZ2lmeVxuICAgICAqICBvciBmb3IuLi5pbiBsb29wcy5cbiAgICAgKi9cbiAgICBkZWZQcm90ZWN0ZWQ6IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsLCBlbnVtZXJhYmxlLCB3cml0YWJsZSkge1xuICAgICAgICBkZWYob2JqLCBrZXksIHtcbiAgICAgICAgICAgIHZhbHVlICAgICAgICA6IHZhbCxcbiAgICAgICAgICAgIGVudW1lcmFibGUgICA6IGVudW1lcmFibGUsXG4gICAgICAgICAgICB3cml0YWJsZSAgICAgOiB3cml0YWJsZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIEEgbGVzcyBidWxsZXQtcHJvb2YgYnV0IG1vcmUgZWZmaWNpZW50IHR5cGUgY2hlY2tcbiAgICAgKiAgdGhhbiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgICovXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09IE9CSkVDVCAmJiBvYmogJiYgIUFycmF5LmlzQXJyYXkob2JqKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQSBtb3JlIGFjY3VyYXRlIGJ1dCBsZXNzIGVmZmljaWVudCB0eXBlIGNoZWNrXG4gICAgICovXG4gICAgaXNUcnVlT2JqZWN0OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBNb3N0IHNpbXBsZSBiaW5kXG4gICAgICogIGVub3VnaCBmb3IgdGhlIHVzZWNhc2UgYW5kIGZhc3QgdGhhbiBuYXRpdmUgYmluZCgpXG4gICAgICovXG4gICAgYmluZDogZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKGN0eCwgYXJnKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBNYWtlIHN1cmUgbnVsbCBhbmQgdW5kZWZpbmVkIG91dHB1dCBlbXB0eSBzdHJpbmdcbiAgICAgKi9cbiAgICBndWFyZDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlLCBlcW51bGw6IHRydWUgKi9cbiAgICAgICAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgIDogKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JylcbiAgICAgICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKVxuICAgICAgICAgICAgICAgIDogdmFsdWVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIFdoZW4gc2V0dGluZyB2YWx1ZSBvbiB0aGUgVk0sIHBhcnNlIHBvc3NpYmxlIG51bWJlcnNcbiAgICAgKi9cbiAgICBjaGVja051bWJlcjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgICAgICAgICAgPyB2YWx1ZVxuICAgICAgICAgICAgOiBOdW1iZXIodmFsdWUpXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBzaW1wbGUgZXh0ZW5kXG4gICAgICovXG4gICAgZXh0ZW5kOiBmdW5jdGlvbiAob2JqLCBleHQpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGV4dCkge1xuICAgICAgICAgICAgaWYgKG9ialtrZXldICE9PSBleHRba2V5XSkge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gZXh0W2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBmaWx0ZXIgYW4gYXJyYXkgd2l0aCBkdXBsaWNhdGVzIGludG8gdW5pcXVlc1xuICAgICAqL1xuICAgIHVuaXF1ZTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICB2YXIgaGFzaCA9IHV0aWxzLmhhc2goKSxcbiAgICAgICAgICAgIGkgPSBhcnIubGVuZ3RoLFxuICAgICAgICAgICAga2V5LCByZXMgPSBbXVxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBrZXkgPSBhcnJbaV1cbiAgICAgICAgICAgIGlmIChoYXNoW2tleV0pIGNvbnRpbnVlXG4gICAgICAgICAgICBoYXNoW2tleV0gPSAxXG4gICAgICAgICAgICByZXMucHVzaChrZXkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQ29udmVydCB0aGUgb2JqZWN0IHRvIGEgVmlld01vZGVsIGNvbnN0cnVjdG9yXG4gICAgICogIGlmIGl0IGlzIG5vdCBhbHJlYWR5IG9uZVxuICAgICAqL1xuICAgIHRvQ29uc3RydWN0b3I6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgVmlld01vZGVsID0gVmlld01vZGVsIHx8IHJlcXVpcmUoJy4vdmlld21vZGVsJylcbiAgICAgICAgcmV0dXJuIHV0aWxzLmlzT2JqZWN0KG9iailcbiAgICAgICAgICAgID8gVmlld01vZGVsLmV4dGVuZChvYmopXG4gICAgICAgICAgICA6IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICA/IG9ialxuICAgICAgICAgICAgICAgIDogbnVsbFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQ2hlY2sgaWYgYSBmaWx0ZXIgZnVuY3Rpb24gY29udGFpbnMgcmVmZXJlbmNlcyB0byBgdGhpc2BcbiAgICAgKiAgSWYgeWVzLCBtYXJrIGl0IGFzIGEgY29tcHV0ZWQgZmlsdGVyLlxuICAgICAqL1xuICAgIGNoZWNrRmlsdGVyOiBmdW5jdGlvbiAoZmlsdGVyKSB7XG4gICAgICAgIGlmIChUSElTX1JFLnRlc3QoZmlsdGVyLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICBmaWx0ZXIuY29tcHV0ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIGNvbnZlcnQgY2VydGFpbiBvcHRpb24gdmFsdWVzIHRvIHRoZSBkZXNpcmVkIGZvcm1hdC5cbiAgICAgKi9cbiAgICBwcm9jZXNzT3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSBvcHRpb25zLmNvbXBvbmVudHMsXG4gICAgICAgICAgICBwYXJ0aWFscyAgID0gb3B0aW9ucy5wYXJ0aWFscyxcbiAgICAgICAgICAgIHRlbXBsYXRlICAgPSBvcHRpb25zLnRlbXBsYXRlLFxuICAgICAgICAgICAgZmlsdGVycyAgICA9IG9wdGlvbnMuZmlsdGVycyxcbiAgICAgICAgICAgIGtleVxuICAgICAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gY29tcG9uZW50cykge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHNba2V5XSA9IHV0aWxzLnRvQ29uc3RydWN0b3IoY29tcG9uZW50c1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0aWFscykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gcGFydGlhbHMpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsc1trZXldID0gdXRpbHMucGFyc2VUZW1wbGF0ZU9wdGlvbihwYXJ0aWFsc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBmaWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuY2hlY2tGaWx0ZXIoZmlsdGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IHV0aWxzLnBhcnNlVGVtcGxhdGVPcHRpb24odGVtcGxhdGUpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHVzZWQgdG8gZGVmZXIgYmF0Y2ggdXBkYXRlc1xuICAgICAqL1xuICAgIG5leHRUaWNrOiBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgZGVmZXIoY2IsIDApXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBhZGQgY2xhc3MgZm9yIElFOVxuICAgICAqICB1c2VzIGNsYXNzTGlzdCBpZiBhdmFpbGFibGVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgaWYgKGhhc0NsYXNzTGlzdCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnXG4gICAgICAgICAgICBpZiAoY3VyLmluZGV4T2YoJyAnICsgY2xzICsgJyAnKSA8IDApIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc05hbWUgPSAoY3VyICsgY2xzKS50cmltKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgcmVtb3ZlIGNsYXNzIGZvciBJRTlcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgaWYgKGhhc0NsYXNzTGlzdCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnLFxuICAgICAgICAgICAgICAgIHRhciA9ICcgJyArIGNscyArICcgJ1xuICAgICAgICAgICAgd2hpbGUgKGN1ci5pbmRleE9mKHRhcikgPj0gMCkge1xuICAgICAgICAgICAgICAgIGN1ciA9IGN1ci5yZXBsYWNlKHRhciwgJyAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gY3VyLnRyaW0oKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBDb252ZXJ0IGFuIG9iamVjdCB0byBBcnJheVxuICAgICAqICB1c2VkIGluIHYtcmVwZWF0IGFuZCBhcnJheSBmaWx0ZXJzXG4gICAgICovXG4gICAgb2JqZWN0VG9BcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2YXIgcmVzID0gW10sIHZhbCwgZGF0YVxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICB2YWwgPSBvYmpba2V5XVxuICAgICAgICAgICAgZGF0YSA9IHV0aWxzLmlzT2JqZWN0KHZhbClcbiAgICAgICAgICAgICAgICA/IHZhbFxuICAgICAgICAgICAgICAgIDogeyAkdmFsdWU6IHZhbCB9XG4gICAgICAgICAgICBkYXRhLiRrZXkgPSBrZXlcbiAgICAgICAgICAgIHJlcy5wdXNoKGRhdGEpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbn1cblxuZW5hYmxlRGVidWcoKVxuZnVuY3Rpb24gZW5hYmxlRGVidWcgKCkge1xuICAgIC8qKlxuICAgICAqICBsb2cgZm9yIGRlYnVnZ2luZ1xuICAgICAqL1xuICAgIHV0aWxzLmxvZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5kZWJ1ZyAmJiBjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogIHdhcm5pbmdzLCB0cmFjZXMgYnkgZGVmYXVsdFxuICAgICAqICBjYW4gYmUgc3VwcHJlc3NlZCBieSBgc2lsZW50YCBvcHRpb24uXG4gICAgICovXG4gICAgdXRpbHMud2FybiA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYgKCFjb25maWcuc2lsZW50ICYmIGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihtc2cpXG4gICAgICAgICAgICBpZiAoY29uZmlnLmRlYnVnICYmIGNvbnNvbGUudHJhY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJ2YXIgQ29tcGlsZXIgICA9IHJlcXVpcmUoJy4vY29tcGlsZXInKSxcbiAgICB1dGlscyAgICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuL3RyYW5zaXRpb24nKSxcbiAgICBCYXRjaGVyICAgID0gcmVxdWlyZSgnLi9iYXRjaGVyJyksXG4gICAgc2xpY2UgICAgICA9IFtdLnNsaWNlLFxuICAgIGRlZiAgICAgICAgPSB1dGlscy5kZWZQcm90ZWN0ZWQsXG4gICAgbmV4dFRpY2sgICA9IHV0aWxzLm5leHRUaWNrLFxuXG4gICAgLy8gYmF0Y2ggJHdhdGNoIGNhbGxiYWNrc1xuICAgIHdhdGNoZXJCYXRjaGVyID0gbmV3IEJhdGNoZXIoKSxcbiAgICB3YXRjaGVySWQgICAgICA9IDFcblxuLyoqXG4gKiAgVmlld01vZGVsIGV4cG9zZWQgdG8gdGhlIHVzZXIgdGhhdCBob2xkcyBkYXRhLFxuICogIGNvbXB1dGVkIHByb3BlcnRpZXMsIGV2ZW50IGhhbmRsZXJzXG4gKiAgYW5kIGEgZmV3IHJlc2VydmVkIG1ldGhvZHNcbiAqL1xuZnVuY3Rpb24gVmlld01vZGVsIChvcHRpb25zKSB7XG4gICAgLy8gY29tcGlsZSBpZiBvcHRpb25zIHBhc3NlZCwgaWYgZmFsc2UgcmV0dXJuLiBvcHRpb25zIGFyZSBwYXNzZWQgZGlyZWN0bHkgdG8gY29tcGlsZXJcbiAgICBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHJldHVyblxuICAgIG5ldyBDb21waWxlcih0aGlzLCBvcHRpb25zKVxufVxuXG4vLyBBbGwgVk0gcHJvdG90eXBlIG1ldGhvZHMgYXJlIGluZW51bWVyYWJsZVxuLy8gc28gaXQgY2FuIGJlIHN0cmluZ2lmaWVkL2xvb3BlZCB0aHJvdWdoIGFzIHJhdyBkYXRhXG52YXIgVk1Qcm90byA9IFZpZXdNb2RlbC5wcm90b3R5cGVcblxuLyoqXG4gKiAgaW5pdCBhbGxvd3MgY29uZmlnIGNvbXBpbGF0aW9uIGFmdGVyIGluc3RhbnRpYXRpb246XG4gKiAgICB2YXIgYSA9IG5ldyBWdWUoZmFsc2UpXG4gKiAgICBhLmluaXQoY29uZmlnKVxuICovXG5kZWYoVk1Qcm90bywgJyRpbml0JywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBuZXcgQ29tcGlsZXIodGhpcywgb3B0aW9ucylcbn0pXG5cbi8qKlxuICogIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCBhIHZhbHVlIGZyb21cbiAqICBhIGtleXBhdGhcbiAqL1xuZGVmKFZNUHJvdG8sICckZ2V0JywgZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciB2YWwgPSB1dGlscy5nZXQodGhpcywga2V5KVxuICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCAmJiB0aGlzLiRwYXJlbnRcbiAgICAgICAgPyB0aGlzLiRwYXJlbnQuJGdldChrZXkpXG4gICAgICAgIDogdmFsXG59KVxuXG4vKipcbiAqICBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBzZXQgYW4gYWN0dWFsIG5lc3RlZCB2YWx1ZVxuICogIGZyb20gYSBmbGF0IGtleSBzdHJpbmcuIFVzZWQgaW4gZGlyZWN0aXZlcy5cbiAqL1xuZGVmKFZNUHJvdG8sICckc2V0JywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB1dGlscy5zZXQodGhpcywga2V5LCB2YWx1ZSlcbn0pXG5cbi8qKlxuICogIHdhdGNoIGEga2V5IG9uIHRoZSB2aWV3bW9kZWwgZm9yIGNoYW5nZXNcbiAqICBmaXJlIGNhbGxiYWNrIHdpdGggbmV3IHZhbHVlXG4gKi9cbmRlZihWTVByb3RvLCAnJHdhdGNoJywgZnVuY3Rpb24gKGtleSwgY2FsbGJhY2spIHtcbiAgICAvLyBzYXZlIGEgdW5pcXVlIGlkIGZvciBlYWNoIHdhdGNoZXJcbiAgICB2YXIgaWQgPSB3YXRjaGVySWQrKyxcbiAgICAgICAgc2VsZiA9IHRoaXNcbiAgICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICAgIHdhdGNoZXJCYXRjaGVyLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJncylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgY2FsbGJhY2suX2ZuID0gb25cbiAgICBzZWxmLiRjb21waWxlci5vYnNlcnZlci5vbignY2hhbmdlOicgKyBrZXksIG9uKVxufSlcblxuLyoqXG4gKiAgdW53YXRjaCBhIGtleVxuICovXG5kZWYoVk1Qcm90bywgJyR1bndhdGNoJywgZnVuY3Rpb24gKGtleSwgY2FsbGJhY2spIHtcbiAgICAvLyB3b3JrYXJvdW5kIGhlcmVcbiAgICAvLyBzaW5jZSB0aGUgZW1pdHRlciBtb2R1bGUgY2hlY2tzIGNhbGxiYWNrIGV4aXN0ZW5jZVxuICAgIC8vIGJ5IGNoZWNraW5nIHRoZSBsZW5ndGggb2YgYXJndW1lbnRzXG4gICAgdmFyIGFyZ3MgPSBbJ2NoYW5nZTonICsga2V5XSxcbiAgICAgICAgb2IgPSB0aGlzLiRjb21waWxlci5vYnNlcnZlclxuICAgIGlmIChjYWxsYmFjaykgYXJncy5wdXNoKGNhbGxiYWNrLl9mbilcbiAgICBvYi5vZmYuYXBwbHkob2IsIGFyZ3MpXG59KVxuXG4vKipcbiAqICB1bmJpbmQgZXZlcnl0aGluZywgcmVtb3ZlIGV2ZXJ5dGhpbmdcbiAqL1xuZGVmKFZNUHJvdG8sICckZGVzdHJveScsIGZ1bmN0aW9uIChub1JlbW92ZSkge1xuICAgIHRoaXMuJGNvbXBpbGVyLmRlc3Ryb3kobm9SZW1vdmUpXG59KVxuXG4vKipcbiAqICBicm9hZGNhc3QgYW4gZXZlbnQgdG8gYWxsIGNoaWxkIFZNcyByZWN1cnNpdmVseS5cbiAqL1xuZGVmKFZNUHJvdG8sICckYnJvYWRjYXN0JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuJGNvbXBpbGVyLmNoaWxkcmVuLFxuICAgICAgICBpID0gY2hpbGRyZW4ubGVuZ3RoLFxuICAgICAgICBjaGlsZFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgICAgICBjaGlsZC5lbWl0dGVyLmFwcGx5RW1pdC5hcHBseShjaGlsZC5lbWl0dGVyLCBhcmd1bWVudHMpXG4gICAgICAgIGNoaWxkLnZtLiRicm9hZGNhc3QuYXBwbHkoY2hpbGQudm0sIGFyZ3VtZW50cylcbiAgICB9XG59KVxuXG4vKipcbiAqICBlbWl0IGFuIGV2ZW50IHRoYXQgcHJvcGFnYXRlcyBhbGwgdGhlIHdheSB1cCB0byBwYXJlbnQgVk1zLlxuICovXG5kZWYoVk1Qcm90bywgJyRkaXNwYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLiRjb21waWxlcixcbiAgICAgICAgZW1pdHRlciA9IGNvbXBpbGVyLmVtaXR0ZXIsXG4gICAgICAgIHBhcmVudCA9IGNvbXBpbGVyLnBhcmVudFxuICAgIGVtaXR0ZXIuYXBwbHlFbWl0LmFwcGx5KGVtaXR0ZXIsIGFyZ3VtZW50cylcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC52bS4kZGlzcGF0Y2guYXBwbHkocGFyZW50LnZtLCBhcmd1bWVudHMpXG4gICAgfVxufSlcblxuLyoqXG4gKiAgZGVsZWdhdGUgb24vb2ZmL29uY2UgdG8gdGhlIGNvbXBpbGVyJ3MgZW1pdHRlclxuICovXG47WydlbWl0JywgJ29uJywgJ29mZicsICdvbmNlJ10uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgLy8gaW50ZXJuYWwgZW1pdCBoYXMgZml4ZWQgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICAvLyBleHBvc2VkIGVtaXQgdXNlcyB0aGUgZXh0ZXJuYWwgdmVyc2lvblxuICAgIC8vIHdpdGggZm4uYXBwbHkuXG4gICAgdmFyIHJlYWxNZXRob2QgPSBtZXRob2QgPT09ICdlbWl0J1xuICAgICAgICA/ICdhcHBseUVtaXQnXG4gICAgICAgIDogbWV0aG9kXG4gICAgZGVmKFZNUHJvdG8sICckJyArIG1ldGhvZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuJGNvbXBpbGVyLmVtaXR0ZXJcbiAgICAgICAgZW1pdHRlcltyZWFsTWV0aG9kXS5hcHBseShlbWl0dGVyLCBhcmd1bWVudHMpXG4gICAgfSlcbn0pXG5cbi8vIERPTSBjb252ZW5pZW5jZSBtZXRob2RzXG5cbmRlZihWTVByb3RvLCAnJGFwcGVuZFRvJywgZnVuY3Rpb24gKHRhcmdldCwgY2IpIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gICAgdmFyIGVsID0gdGhpcy4kZWxcbiAgICB0cmFuc2l0aW9uKGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgaWYgKGNiKSBuZXh0VGljayhjYilcbiAgICB9LCB0aGlzLiRjb21waWxlcilcbn0pXG5cbmRlZihWTVByb3RvLCAnJHJlbW92ZScsIGZ1bmN0aW9uIChjYikge1xuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgLTEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNiKSBuZXh0VGljayhjYilcbiAgICB9LCB0aGlzLiRjb21waWxlcilcbn0pXG5cbmRlZihWTVByb3RvLCAnJGJlZm9yZScsIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldClcbiAgICAgICAgaWYgKGNiKSBuZXh0VGljayhjYilcbiAgICB9LCB0aGlzLiRjb21waWxlcilcbn0pXG5cbmRlZihWTVByb3RvLCAnJGFmdGVyJywgZnVuY3Rpb24gKHRhcmdldCwgY2IpIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gICAgdmFyIGVsID0gdGhpcy4kZWxcbiAgICB0cmFuc2l0aW9uKGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0Lm5leHRTaWJsaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNiKSBuZXh0VGljayhjYilcbiAgICB9LCB0aGlzLiRjb21waWxlcilcbn0pXG5cbmZ1bmN0aW9uIHF1ZXJ5IChlbCkge1xuICAgIHJldHVybiB0eXBlb2YgZWwgPT09ICdzdHJpbmcnXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICAgICAgOiBlbFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2RlbFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVnVlID0gcmVxdWlyZSgndnVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qXG4gICAgICAgIFJvdXRlIHBhcmFtc1xuICAgICAgICBVc2VkIGJ5IHRoZSByb3V0ZXIgYW5kIHRoZSBjdXN0b20gdi12aWV3XG4gICAgICAgIGlkOiBwYWdlIHNsdWdcbiAgICAgICAgdHJhbnNpdGlvbk1vZGU6IHRpbWluZyAoc2VlIHZpZXcgZm9yIGluZm9zKVxuICAgICAgICBwYXJhbXM6IGluamVjdGVkIGJ5IHRoZSB2aWV3IGZyb20gcm91dGVyIGluZm9zXG4gICAgKi9cbiAgICByb3V0ZToge1xuICAgICAgICBpZDogJycsXG4gICAgICAgIHRyYW5zaXRpb25Nb2RlOiAnb3V0QW5kQWZ0ZXJJbicsXG4gICAgICAgIHBhcmFtczoge31cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgIFBVQkxJQyBBUElcbiAgICAgICAgICAgIE92ZXJyaWRhYmxlIGJlaGF2aW9yXG4gICAgICAgICovXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIENhbiBiZSBvdmVycmlkZW4gaWYgdGhlIHNlY3Rpb25zIHRyYW5zaXRpb24gbmVlZHMgdG8gYmUgZGlmZmVyZW50IGRlcGVuZGluZyBvbiB0aGUgcHJldmlvdXMgcm91dGUuIEhhbmRsZSB3aXRoIGNhcmUgIVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VHJhbnNpdGlvbk1vZGU6IGZ1bmN0aW9uKHByZXZpb3VzUm91dGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRvcHRpb25zLnJvdXRlLnRyYW5zaXRpb25Nb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBTdGFydHMgdGhlIHRyYW5zaXRpb25Jbiwgb3ZlcnJpZGUgaXQgaWYgeW91IG5lZWQgdG8gcGxheSBzb21ldGhpbmcgZWxzZSB0aGFuIHRoZSBkZWZhdWx0IFRpbWVsaW5lIGRlcGVuZGluZyBvbiBwcmV2aW91cyByb3V0ZS5cbiAgICAgICAgICAgIGV4OlxuICAgICAgICAgICAgICAgIGlmKHByZXZpb3VzUm91dGUgJiYgcHJldmlvdXNSb3V0ZS5pZCA9PT0gJ2hvbWUnKSB0aGlzLnRsVHJhbnNpdGlvbi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBUd2Vlbk1heC5mcm9tVG8odGhpcy4kZWwsIDEsIHthbHBoYTogMH0sIHthbHBoYTogMSwgb25Db21wbGV0ZTogdGhpcy5vblRyYW5zaXRpb25JbkNvbXBsZXRlLCBvbkNvbXBsZXRlU2NvcGU6IHRoaXN9KTtcbiAgICAgICAgKi9cbiAgICAgICAgcGxheVRyYW5zaXRpb25JbjogZnVuY3Rpb24ocHJldmlvdXNSb3V0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlY3Rpb24gLSBwbGF5VHJhbnNpdGlvbkluJyk7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5wbGF5KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIFN0YXJ0cyB0aGUgdHJhbnNpdGlvbk91dCwgb3ZlcnJpZGUgaXQgaWYgeW91IG5lZWQgdG8gcGxheSBzb21ldGhpbmcgZWxzZSB0aGFuIHRoZSBkZWZhdWx0IFRpbWVsaW5lIGRlcGVuZGluZyBvbiBuZXh0IHJvdXRlLlxuICAgICAgICAqL1xuICAgICAgICBwbGF5VHJhbnNpdGlvbk91dDogZnVuY3Rpb24obmV4dFJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5yZXZlcnNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIEFsbG93IHRvIHJlc2l6ZSBhbmQgbWFuaXB1bGF0ZSB0aGUgRE9NIGJlZm9yZSBjcmVhdGluZyB0aGUgdHJhbnNpdGlvbnNcbiAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NlY3Rpb25dIC0gWW91IG5lZWQgdG8gb3ZlcnJpZGUgc2VjdGlvbi5iZWZvcmVUcmFuc2l0aW9uSW46JywgdGhpcy4kb3B0aW9ucy5yb3V0ZS5pZCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIENyZWF0ZSB0aGUgZGlmZmVyZW50IHR3ZWVuIGludG8gdGhlIHRyYW5zaXRpb25Jbi9PdXQgVGltZWxpbmVzXG4gICAgICAgICovXG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZWN0aW9uXSAtIFlvdSBuZWVkIHRvIG92ZXJyaWRlIHNlY3Rpb24uaW5zZXJ0VHdlZW5zOicsIHRoaXMuJG9wdGlvbnMucm91dGUuaWQpO1xuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24uZnJvbVRvKHRoaXMuJGVsLCAwLjQsIHtvcGFjaXR5OiAwfSwge29wYWNpdHk6IDF9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgUFJJVkFURSBBUElcbiAgICAgICAgICAgIEludGVybmFsIGJlaGF2aW9yXG4gICAgICAgICovXG4gICAgICAgIHRyYW5zaXRpb25JbjogZnVuY3Rpb24ocHJldmlvdXNSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgICAgIHRoaXMucGxheVRyYW5zaXRpb25JbihwcmV2aW91c1JvdXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25UcmFuc2l0aW9uSW5Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdzZWN0aW9uOnRyYW5zaXRpb25JbkNvbXBsZXRlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zaXRpb25PdXQ6IGZ1bmN0aW9uKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5VHJhbnNpdGlvbk91dChuZXh0Um91dGUpO1xuICAgICAgICB9LFxuICAgICAgICBvblRyYW5zaXRpb25PdXRDb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdzZWN0aW9uOnRyYW5zaXRpb25PdXRDb21wbGV0ZScpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVUaW1lbGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbiA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vblRyYW5zaXRpb25JbkNvbXBsZXRlLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpcyxcbiAgICAgICAgICAgICAgICBvblJldmVyc2VDb21wbGV0ZTogdGhpcy5vblRyYW5zaXRpb25PdXRDb21wbGV0ZSxcbiAgICAgICAgICAgICAgICBvblJldmVyc2VDb21wbGV0ZVNjb3BlOiB0aGlzLFxuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uT3V0ID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uVHJhbnNpdGlvbk91dENvbXBsZXRlLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGVTY29wZTogdGhpcyxcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VjdGlvbiAtIGNyZWF0ZVRpbWVsaW5lJyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zaXRpb25zUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdC4kZW1pdCgnc2VjdGlvbjp0cmFuc2l0aW9uc1JlYWR5Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VjdGlvbiAtIHRyYW5zaXRpb25zUmVhZHknKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVUcmFuc2l0aW9uSW4oKTsgLy8gT3ZlcnJpZGUgdGhhdCBiaXRjaFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVUaW1lbGluZSgpO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRUd2VlbnMoKTsgLy8gT3ZlcnJpZGUgdGhpc1xuXG4gICAgICAgICAgICBWdWUubmV4dFRpY2sodGhpcy50cmFuc2l0aW9uc1JlYWR5LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXG4gICAgICAgIHRoaXMuJG9uY2UoJ2hvb2s6YWRkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFZ1ZS5uZXh0VGljayh0aGlzLmFkZGVkLmJpbmQodGhpcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRvbmNlKCdob29rOnJvdXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSWYgd2Ugd2FudCB0byBoYW5kbGUgcHJlbG9hZCBvciBwcm9taXNlcyByZXNvbHZpbmdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kb25jZSgnaG9vazpiZWZvcmVEZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZih0aGlzLnRsVHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uLmtpbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRsVHJhbnNpdGlvbk91dCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uT3V0LmtpbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbk91dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBWaWV3XG4gICAgRW5oYW5jZWQgdi12aWV3IGFsbG93aW5nIHRvIG1hbmFnZSB0aW1pbmcgYmV0d2VlbiB0cmFuc2l0aW9uc1xuICAgIC0gdHJhbnNpdGlvbiBJbiB0aGVuIE91dCxcbiAgICAtIHRyYW5zaXRpb24gSW4gYW5kIE91dCB0b2dldGhlcixcbiAgICAtIHRyYW5zaXRpb24gSW4gb25seVxuICovXG5cbnZhciBUd2Vlbk1heCA9IHJlcXVpcmUoJ1R3ZWVuTWF4JyksXG4gICAgVnVlID0gcmVxdWlyZSgndnVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qXG4gICAgICAgIE9yaWdpbiB2LXZpZXcgLSBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSB2dWUgcmVwb1xuICAgICovXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0cmFjayBwb3NpdGlvbiBpbiBET00gd2l0aCBhIHJlZiBub2RlXG4gICAgICAgIHZhciBlbCAgICAgICA9IHRoaXMucmF3ID0gdGhpcy5lbCxcbiAgICAgICAgICAgIHBhcmVudCAgID0gZWwucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIHJlZiAgICAgID0gdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCdwdy12aWV3Jyk7XG4gICAgICAgIGlmKCFwYXJlbnQpIHJldHVybjtcblxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHJlZiwgZWwpO1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZWwpO1xuXG4gICAgICAgIC8vIGNhY2hlIG9yaWdpbmFsIGNvbnRlbnRcbiAgICAgICAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgICAgICAgdmFyIG5vZGUsXG4gICAgICAgICAgICBmcmFnID0gdGhpcy5pbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB3aGlsZSAobm9kZSA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52bS4kb24oJ3NlY3Rpb246dHJhbnNpdGlvbnNSZWFkeScsIHRoaXMub25UcmFuc2l0aW9uUmVhZHkuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYoIXRoaXMuaW5uZXIgfHwgdGhpcy5pc1RyYW5zaXRpb25uaW5nIHx8ICF2YWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBDdG9yICA9IHRoaXMuY29tcGlsZXIuZ2V0T3B0aW9uKCdjb21wb25lbnRzJywgdmFsdWUpO1xuICAgICAgICBpZiAoIUN0b3IpIHJldHVybjtcblxuICAgICAgICBpZih0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNID0gdGhpcy5jaGlsZFZNO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTSA9IG5ldyBDdG9yKHtcbiAgICAgICAgICAgIGVsOiB0aGlzLnJhdy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm0sXG4gICAgICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICByYXdDb250ZW50OiB0aGlzLmlubmVyLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgcm91dGVyIHBhcmFtcyB0byBuZXh0Q2hpbGRWTVxuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRvcHRpb25zLnJvdXRlLnBhcmFtcyA9IHRoaXMudm0uY29udGV4dC5wYXJhbXM7XG5cbiAgICAgICAgLy8gUm91dGluZyBwYXJhbXMgZXZlbnRcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kZW1pdCgnaG9vazpyb3V0ZWQnKTtcblxuICAgICAgICAvLyBjaGVjayBpZiBuZXh0Q2hpbGRWTSAmIHByZXZpb3VzQ2hpbGRWTSBhcmUgdHJhbnNpdGlvbiBjb21wYXRpYmxlLCBpZiBub3QgdGhyb3cgZXJyb3JcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMubmV4dENoaWxkVk0uJGVsO1xuICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnJlZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmVsLCB0aGlzLnJlZik7XG4gICAgICAgICAgICBWdWUubmV4dFRpY2sodGhpcy52aWV3TW9kZWxBZGRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV4dENoaWxkVk0uJGJlZm9yZSh0aGlzLnJlZiwgdGhpcy52aWV3TW9kZWxBZGRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZFZNKSB0aGlzLmNoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICAgICAgaWYgKHRoaXMubmV4dENoaWxkVk0pIHRoaXMubmV4dENoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICAgICAgaWYgKHRoaXMucHJldmlvdXNDaGlsZFZNKSB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kZGVzdHJveSgpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBUcmFuc2l0aW9uIHRpbWluZ3Mgc3R1ZmZcbiAgICAqL1xuXG4gICAgdmlld01vZGVsQWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRlbWl0KCdob29rOmFkZGVkJyk7XG4gICAgfSxcblxuICAgIG9uVHJhbnNpdGlvblJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXRoaXMubmV4dENoaWxkVk0pIHJldHVybjtcbiAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IC0gb25UcmFuc2l0aW9uUmVhZHlcIik7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uKCk7XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbm5pbmcgPSB0cnVlO1xuICAgICAgICBpZih0aGlzLnByZXZpb3VzQ2hpbGRWTSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWaWV3IC0gdHJhbnNpdGlvblwiKTtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLm5leHRDaGlsZFZNLmdldFRyYW5zaXRpb25Nb2RlKHRoaXMucHJldmlvdXNDaGlsZFZNLiRvcHRpb25zLnJvdXRlKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luQW5kQWZ0ZXJPdXQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25JbkFuZEFmdGVyT3V0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luQW5kT3V0VG9nZXRoZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25JbkFuZE91dFRvZ2V0aGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RyYW5zaXRpb25Jbk9ubHknOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Jbk9ubHkoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uT3V0QW5kQWZ0ZXJJbigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkluT25seSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb25Jbk9ubHk6IGZ1bmN0aW9uKHByZXZpb3VzUm91dGUpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRvbmNlKCdzZWN0aW9uOnRyYW5zaXRpb25JbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS50cmFuc2l0aW9uSW4ocHJldmlvdXNSb3V0ZSk7XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb25PdXRBbmRBZnRlckluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5leHRSb3V0ZSA9IHRoaXMubmV4dENoaWxkVk0uJG9wdGlvbnMucm91dGU7XG4gICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRvbmNlKCdzZWN0aW9uOnRyYW5zaXRpb25PdXRDb21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5Pbmx5KHRoaXMucHJldmlvdXNDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0udHJhbnNpdGlvbk91dCh0aGlzLm5leHRDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICB9LFxuXG4gICAgdHJhbnNpdGlvbkluQW5kQWZ0ZXJPdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0uJG9uY2UoJ3NlY3Rpb246dHJhbnNpdGlvbkluQ29tcGxldGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJG9uKCdzZWN0aW9uOnRyYW5zaXRpb25PdXRDb21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLnRyYW5zaXRpb25PdXQodGhpcy5uZXh0Q2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0udHJhbnNpdGlvbkluKHRoaXMucHJldmlvdXNDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICB9LFxuXG4gICAgdHJhbnNpdGlvbkluQW5kT3V0VG9nZXRoZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRvbmNlKCdzZWN0aW9uOnRyYW5zaXRpb25PdXRDb21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLnRyYW5zaXRpb25PdXQodGhpcy5uZXh0Q2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0udHJhbnNpdGlvbkluKHRoaXMucHJldmlvdXNDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICB9LFxuXG4gICAgc2Nyb2xsVG9Ub3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICBUd2Vlbk1heC5zZXQod2luZG93LCB7c2Nyb2xsVG86IHt5OiAwLCB4OiAwfX0pO1xuICAgIH0sXG5cbiAgICBvblRyYW5zaXRpb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW9ubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoaWxkVk0gPSB0aGlzLm5leHRDaGlsZFZNO1xuICAgICAgICBpZih0aGlzLnByZXZpb3VzQ2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTSA9IG51bGw7XG4gICAgICAgIHRoaXMudm0uJGVtaXQoJ3ZpZXc6dHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBGbGFncyBhbGxvd2luZyB0byByZXF1aXJlL2FjdGl2YXRlIGRpZmZlcmVudHNcbiAgICBwYXJ0cyBvZiB0aGUgYXBwLlxuXG4gICAgRXhhbXBsZTogcmVxdWlyZSB2dWUtZGVidWcsIHNldCBUaW1lbGluZSB0byBmYXN0LWZvcndhcmRcbiAgICBmb3IgZmFzdGVyIGRlYnVnLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHZ1ZTogdHJ1ZSAgXG59OyIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBNb2RpZmllZCB2dWUtdmlld3BvcnQgcGx1Z2luXG4gICAgKHYtZGV0ZWN0LXZpZXdwb3J0IGRpcmVjdGl2ZSlcbiAgICBodHRwczovL2dpdGh1Yi5jb20vaG9saWMvdnVlLXZpZXdwb3J0XG5cbiAgICB0byBhbGxvdyB0byBwYXNzIGFuIGF0dHJpYnV0ZSB0byB0aGUgZGlyZWN0aXZlXG4gICAgdi12aWV3cG9ydD1cInRoaW5nXCIsIGFsbG93aW5nIHRvIHJlY29nbml6ZSB3aGljaFxuICAgIGVsZW1lbnRzIHRyaWdnZXJlZCB0aGUgdmlld3BvcnQgZXZlbnQsIHdoZW4gdXNlZCBvbiBtdWx0aXBsZXMgZXZlbnRzLlxuICovXG5cbnZhciBkaXJlY3RpdmVzID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy52bS4kb24oJ2hvb2s6YXR0YWNoZWQnLCBub3RpZnlBbGwpO1xuICAgICAgICB0aGlzLnZtLiRvbignaG9vazpkZXRhY2hlZCcsIG5vdGlmeUFsbCk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGl2ZXMuaW5kZXhPZih0aGlzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZXMucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy52bS4kb2ZmKCdob29rOmF0dGFjaGVkJywgbm90aWZ5QWxsKTtcbiAgICAgICAgdGhpcy52bS4kb2ZmKCdob29rOmRldGFjaGVkJywgbm90aWZ5QWxsKTtcblxuICAgICAgICB2YXIgaW5kZXggPSBkaXJlY3RpdmVzLmluZGV4T2YodGhpcyk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBkaXJlY3RpdmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCkge1xuICAgIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHJlY3QuYm90dG9tID4gMCAmJiByZWN0LnJpZ2h0ID4gMCAmJiByZWN0LnRvcCA8ICh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgJiYgcmVjdC5sZWZ0IDwgKHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCk7XG59XG5cbmZ1bmN0aW9uIG5vdGlmeSAoZGlyZWN0aXZlKSB7XG4gICAgaWYgKCFkaXJlY3RpdmUuZWwpIHJldHVybjtcblxuICAgIHZhciBpblZpZXdwb3J0ID0gaXNFbGVtZW50SW5WaWV3cG9ydChkaXJlY3RpdmUuZWwpO1xuICAgIGlmIChkaXJlY3RpdmUuaW5WaWV3cG9ydCA9PT0gbnVsbCB8fCBkaXJlY3RpdmUuaW5WaWV3cG9ydCAhPT0gaW5WaWV3cG9ydCkge1xuICAgICAgICBkaXJlY3RpdmUuaW5WaWV3cG9ydCA9IGluVmlld3BvcnQ7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBpblZpZXdwb3J0ID8gJ2VudGVyJyA6ICdsZWF2ZSc7XG4gICAgICAgIGRpcmVjdGl2ZS52bS4kZW1pdCgndmlld3BvcnQnICsgZGlyZWN0aW9uLCB7ZWw6IGRpcmVjdGl2ZS5lbCwgYXR0cjogZGlyZWN0aXZlLmtleX0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbm90aWZ5QWxsICgpIHtcbiAgICBkaXJlY3RpdmVzLmZvckVhY2gobm90aWZ5KTtcbn1cblxuWydET01Db250ZW50TG9hZGVkJywgJ2xvYWQnLCAnc2Nyb2xsJywgJ3Jlc2l6ZScsICdwb3BzdGF0ZSddLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG5vdGlmeUFsbCwgZmFsc2UpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIElNUE9SVFNcblxuICAgIEhvbGRhbGwgZm9yIHBsdWdpbnMgYW5kIGNvbmZcbiAgICB0byBhdm9pZCBwb2xsdXRpbmcgdGhlIG1haW4uXG4gKi9cblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIGRlYnVnID0gcmVxdWlyZSgndnVlLWRlYnVnJyksXG4gICAgcXVlcnkgPSByZXF1aXJlKCd2dWUtcXVlcnknKSxcbiAgICBlbCA9IHJlcXVpcmUoJ3Z1ZS1lbCcpLFxuICAgIHZpZXdwb3J0ID0gcmVxdWlyZSgnLi9jb21tb24vZGlyZWN0aXZlcy92aWV3cG9ydC5qcycpLFxuICAgIFR3ZWVuTWF4ID0gcmVxdWlyZSgnVHdlZW5NYXgnKSxcbiAgICBkZWJ1Z0FwcCA9IHJlcXVpcmUoJy4vY29tbW9uL2RlYnVnLmpzJyk7XG5cbi8qXG4gICAgVHdlZW5NYXhcbiovXG5yZXF1aXJlKCdUd2Vlbk1heC5TY3JvbGxUb1BsdWdpbicpOyAvLyBBZGQgc2Nyb2xsVG9QbHVnaW4gdG8gVHdlZW5NYXhcblR3ZWVuTGl0ZS5kZWZhdWx0RWFzZSA9IEV4cG8uZWFzZU91dDsgLy8gU28gSSBkb24ndCBoYXZlIHRvIHdyaXRlIGl0IGV2ZXJ5IHRpbWVcblxuLypcbiAgICBWdWUgcGx1Z2luc1xuICovXG5pZihkZWJ1Z0FwcCkgVnVlLnVzZShkZWJ1Zyk7IC8vIEFkZCBWdWUubG9nIG1ldGhvZFxuVnVlLnVzZShlbCk7IC8vIHYtZWwgZGlyZWN0aXZlIHRvIGF2b2lkIHNlbGVjdGluZyBub2RlcyBpbiBKU1xuVnVlLnVzZShxdWVyeSk7IC8vIEFkZCB0aGlzLiRmaW5kT25lLCB0aGlzLiRmaW5kLCB0aGlzLmFkZC9yZW1vdmVDbGFzcyB0byBhbnkgVnVlIGluc3RhbmNlXG5WdWUuZGlyZWN0aXZlKCd2aWV3cG9ydCcsIHJlcXVpcmUoJy4vY29tbW9uL2RpcmVjdGl2ZXMvdmlld3BvcnQnKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVnVlID0gcmVxdWlyZSgndnVlJyksXG4gICAgcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKSxcbiAgICBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKSxcbiAgICBmb3JFYWNoID0gcmVxdWlyZSgnZm9yRWFjaCcpLFxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2NvbXBvbmVudC1lbWl0dGVyJyksXG4gICAgdmVyYm9zZSA9IHRydWU7XG5cbi8qXG4gICAgUm91dGVyIGJhc2VkIG9uIHBhZ2UuanMsXG4gICAgZXZlbnQtYmFzZWQsIG1hZGUgdG8gd29yayB3aXRoIHZ1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCh7XG4gICAgLypcbiAgICAgICAgVGhpcyBvYmplY3QgaXMgZGlzcGF0Y2hlZCBvbiBlYWNoIGxvY2F0aW9uQ2hhbmdlLlxuICAgICAgICBJdCBob2xkcyB0aGUgY3VycmVudCBwYXRoLCB0aGUgcm91dGUgcGFyYW1zLi4uXG4gICAgICovXG4gICAgY29udGV4dDoge1xuICAgICAgICBwYXRoOiAnJ1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBEZWZhdWx0IHJvdXRlIChjYW4gYmUgYSA0MDQsIG9yIHRoZSBpbmRleClcbiAgICAgKi9cbiAgICBkZWZhdWx0Um91dGU6ICcvJyxcblxuICAgIC8qXG4gICAgICAgIFJlZmVyZW5jZSB0byBhbGwgdGhlIHJvdXRlc1xuICAgICovXG4gICAgcm91dGVJZHM6IFtdLFxuXG4gICAgLypcbiAgICAgICAgUmVnaXN0ZXJzIHRoZSByb3V0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgcGF0aC9wYXR0ZXJuIChleHByZXNzLWxpa2UgcmVnZXhwKVxuICAgICAgICByb3V0ZTogaW5mb3MgYXMge2lkOiBcInJvdXRlLWlkXCIsIHBhdGg6IFwiL3JvdXRlXCJ9IG9yIHtpZDogXCJyb3V0ZS1pZFwiLCBwYXRoOiBcIi9yb3V0ZS86aWRcIn1cbiAgICAgKi9cbiAgICBhZGRSb3V0ZTogZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgICAgdGhpcy5yb3V0ZUlkcy5wdXNoKHtpZDogcm91dGUuaWQsIHBhdGg6IHJvdXRlLnBhdGh9KTtcbiAgICAgICAgcGFnZShyb3V0ZS5wYXRoLCB0aGlzLm9uUm91dGUuYmluZCh0aGlzKSk7XG4gICAgICAgIGlmKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoJ1tyb3V0ZXJdIGFkZCByb3V0ZSBcIicgKyByb3V0ZS5wYXRoICsgJ1wiJyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIFVwZGF0ZXMgdGhlIGRlZmF1bHQgcm91dGUuXG4gICAgICAgIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgYWxsIHJvdXRlcyB3ZXJlIGFkZGVkLFxuICAgICAgICBiZWNhdXNlIGl0IHN0YXJ0cyB0aGUgcm91dGluZy5cbiAgICAgKi9cbiAgICBzZXREZWZhdWx0Um91dGU6IGZ1bmN0aW9uKGRlZmF1bHRSb3V0ZSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRSb3V0ZSA9IGRlZmF1bHRSb3V0ZTtcbiAgICAgICAgcGFnZSgnKicsIHRoaXMub25EZWZhdWx0Um91dGUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgU3RhcnRzIHRoZSByb3V0ZXIuXG4gICAgICAgIE9ubHkgbmVlZGVkIHRvIGNhbGwgaWYgeW91IGRpZG4ndCBjYWxsZWQgYHNldERlZmF1bHRSb3V0ZWAuXG4gICAgICovXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYWdlLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuZW1pdCgncm91dGVyOnN0YXJ0Jyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIEludGVybmFsIG1ldGhvZC5cbiAgICAgICAgVXBkYXRlcyB0aGUgY29udGV4dCBhbmQgYW1pdCB0aGUgYHJvdXRlcjp1cGRhdGVgIGV2ZW50LlxuICAgICAqL1xuICAgIG9uUm91dGU6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhcmFtcyA9IGNvbnRleHQucGFyYW1zO1xuICAgICAgICB0aGlzLmNvbnRleHQuaWQgPSB0aGlzLmdldEN1cnJlbnRSb3V0ZUlkKGNvbnRleHQucGF0aCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXRoID0gY29udGV4dC5wYXRoO1xuXG4gICAgICAgIGlmKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoJ1tyb3V0ZXJdIG9uUm91dGUnLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICB0aGlzLmVtaXQoJ3JvdXRlcjp1cGRhdGUnLCB0aGlzLmNvbnRleHQpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBDYWxsZWQgd2hlbiB0aGUgcmVxdWVzdGVkIHJvdXRlIGRvZXMgbm90IGV4aXN0c1xuICAgICAgICBSZWRpcmVjdHMgdG8gcHJvcGVyIGRlZmF1bHQgcm91dGVcbiAgICAgKi9cbiAgICBvbkRlZmF1bHRSb3V0ZTogZnVuY3Rpb24oYykge1xuICAgICAgICBWdWUubmV4dFRpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgJy8nICsgdGhpcy5kZWZhdWx0Um91dGUpO1xuICAgICAgICAgICAgcGFnZSgnLycgKyB0aGlzLmRlZmF1bHRSb3V0ZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGdldEN1cnJlbnRSb3V0ZUlkOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHZhciBtYXRjaCwgaWQ7XG4gICAgICAgIGZvckVhY2godGhpcy5yb3V0ZUlkcywgZnVuY3Rpb24odmFsdWUsIGluZGV4KXtcbiAgICAgICAgICAgIG1hdGNoID0gcGF0aC5tYXRjaChuZXcgUmVnRXhwKCh2YWx1ZS5wYXRoLnJlcGxhY2UoLzpbYS16XSsvZywgJ1thLXotXSsnKSkucmVwbGFjZSgvXFwvL2csICdcXFxcLycpLCAnZycpKTtcbiAgICAgICAgICAgIGlmKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZCA9IHZhbHVlLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBNYW51YWxseSBzZXQgdGhlIHBhdGguXG4gICAgICAgIEFsbG93IHRvIHByZXNzIHRoZSBgYmFja2AvYGZvcndhcmRgIGJ1dHRvbnNcbiAgICAgKi9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIG51bGwsIGZhbHNlKTtcbiAgICB9XG59LCBuZXcgRXZlbnRFbWl0dGVyKCkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxhIGNsYXNzPVxcXCJuYW1lLWJ1dHRvblxcXCIgaHJlZj1cXFwie3t1cmx9fVxcXCIgdi1vbj1cXFwibW91c2VvdmVyOiBvbk1vdXNlT3ZlciwgbW91c2VvdXQ6IG9uTW91c2VPdXRcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJuYW1lXFxcIiB2LWVsPVxcXCJuYW1lXFxcIj57e3Byb2plY3QuYXV0aG9yfX08L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwidGl0bGVcXFwiIHYtZWw9XFxcInRpdGxlXFxcIj57e3Byb2plY3QudGl0bGV9fTwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsaW5lXFxcIiB2LWVsPVxcXCJsaW5lXFxcIj48L2Rpdj5cXG48L2E+XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBWdWUgPSByZXF1aXJlKCd2dWUnKSxcbiAgICBiaW5kQWxsID0gcmVxdWlyZSgnYmluZGFsbC1zdGFuZGFsb25lJylcbiAgICBUd2Vlbk1heCA9IHJlcXVpcmUoJ1R3ZWVuTWF4Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL25hbWVCdXR0b24uaHRtbCcpLFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgb25Nb3VzZU92ZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvbk1vdXNlT3ZlcicpO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC5uYW1lLCAwLjYsIHt4OiAwLCBjb2xvcjogJyMwMDdkYWMnLCBlYXNlOiBFeHBvLmVhc2VPdXR9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQudGl0bGUsIDAuNiwge2FscGhhOiAxLCB4OiAwLCBlYXNlOiBFeHBvLmVhc2VPdXR9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQubGluZSwgMSwge3NjYWxlWDogMSwgZWFzZTogRXhwby5lYXNlT3V0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTW91c2VPdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQubmFtZSwgMC42LCB7eDogdGhpcy4kJC50aXRsZS5vZmZzZXRXaWR0aCAqIDAuNSwgY29sb3I6ICcjMzMzJywgZWFzZTogRXhwby5lYXNlT3V0fSk7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLnRpdGxlLCAwLjYsIHthbHBoYTogMCwgeDogdGhpcy4kJC50aXRsZS5vZmZzZXRXaWR0aCAqIDAuNSwgZWFzZTogRXhwby5lYXNlT3V0IH0pO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC5saW5lLCAxLCB7c2NhbGVYOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXR9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy4kJC5uYW1lLCB7eDogdGhpcy4kJC50aXRsZS5vZmZzZXRXaWR0aCAqIDAuNX0pO1xuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMuJCQudGl0bGUsIHt4OiB0aGlzLiQkLnRpdGxlLm9mZnNldFdpZHRoICogMC41fSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy51cmwgPSAncHJvamVjdC8nICsgdGhpcy5wcm9qZWN0LmlkO1xuICAgICAgICBiaW5kQWxsKHRoaXMsICdpbml0Jyk7XG4gICAgICAgIFZ1ZS5uZXh0VGljayh0aGlzLmluaXQpO1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBcIldvcmtzaG9wIGJ5IDxhIGhyZWY9XFxcImh0dHA6Ly9ndWlsbGF1bWVnb3Vlc3Nhbi5jb21cXFwiPiBHdWlsbGF1bWUgR291ZXNzYW4gPC9hPiBmb3IgPGEgaHJlZj1cXFwiaHR0cDovL2dvYmVsaW5zLmZyXFxcIj4gR29iZWxpbnMgU2Nob29sIDwvYT4gQ1JNQSAyMDE1IHN0dWRlbnRzLCBQYXJpcyAyMDE0LlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9mb290ZXIuaHRtbCcpLFxuICAgIGNvbXBvbmVudHM6IHtcblxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBcbiAgICB9LFxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGEgaHJlZj1cXFwiL1xcXCI+PGltZyB2LWVsPVxcXCJsb2dvXFxcIiBzcmM9XFxcImFzc2V0cy9pbWFnZXMvbG9nby5zdmdcXFwiIHdpZHRoPVxcXCIyNDBcXFwiIC8+PC9hPlxcbjxoMiBpZD1cXFwic3VidGl0bGVcXFwiIHYtZWw9XFxcInN1YnRpdGxlXFxcIj5DcmVhdGl2ZSBDb2RpbmcgV29ya3Nob3AgLSBUaHJlZS5qczwvaDI+XFxuXCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2hlYWRlci5odG1sJyksXG4gICAgbWV0aG9kczoge1xuXG4gICAgfSxcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGFydFRpbWUgPSAwLjg7XG4gICAgICAgIHZhciB0bCA9IG5ldyBUaW1lbGluZU1heCgpO1xuICAgICAgICB0bC5mcm9tKHRoaXMuJCQuc3VidGl0bGUsIDAuNiwge3k6IC0yMCwgYWxwaGE6IDAsIGVhc2U6IEV4cG8uZWFzZU91dH0sIHN0YXJ0VGltZSArIDAuMCk7XG4gICAgICAgIHRsLmZyb20odGhpcy4kJC5sb2dvLCAwLjYsIHt5OiAtMjAsIGFscGhhOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXR9LCBzdGFydFRpbWUgKyAwLjEpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwiaG9tZVxcXCI+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaSB2LXJlcGVhdD1cXFwicHJvamVjdDpwcm9qZWN0c1xcXCIgdi1lbD1cXFwibGlua3NcXFwiIHYtY29tcG9uZW50PVxcXCJuYW1lQnV0dG9uXFxcIiB2LXdpdGg9XFxcInByb2plY3RcXFwiPjwvbGk+XFxuICAgIDwvdWw+XFxuPC9kaXY+XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCdleHRlbmQnKSxcbiAgICBzZWN0aW9uID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9iYXNlL3NlY3Rpb24uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQodHJ1ZSwge30sIHNlY3Rpb24sIHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9ob21lLmh0bWwnKSxcbiAgICByb3V0ZToge1xuICAgICAgICBpZDogJ2hvbWUnLFxuICAgICAgICB0cmFuc2l0aW9uTW9kZTogJ291dEFuZEFmdGVySW4nLFxuICAgICAgICBwYXRoOiAnL2hvbWUnXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICAgIHByb2plY3RzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdjbGVtZW50JyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdDbMOpbWVudCBCYXJkb24nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQXdlZnVsbHkgbG9uZyB0aXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICduaWNvbGFzJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdOaWNvbGFzIEJvbm5vdCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdrZXZpbicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnS2V2aW4gQnVkYWluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2JlcnRyYW5kJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdCZXJ0cmFuZCBDYXlsYScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdldGllbm5lJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdFdGllbm5lIENoYXVtb250JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2pvcmRhbicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnSm9yZGFuIERlbGNyb3MnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnamVyZW1pZScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnSsOpcsOpbWllIERldm9vcycsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdsZW9uYXJkJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdMw6lvbmFyZCBIZXRzY2gnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnc2FtdWVsJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdTYW11ZWwgSG9uaWdzdGVpbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdsb3J5JyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdMb3J5IEh1eicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdndWlsbGF1bWUnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0d1aWxsYXVtZSBKYXNtaW4nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAndGhvbWFzJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdUaG9tYXMgSm9zc2VhdScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdhbnRvbmluJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdBbnRvbmluIExhbmdsYWRlJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2thdGlhJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdLYXRpYSBNb3JlaXJhJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2xvdWlzZScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnTG91aXNlIE9iw6knLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnamVhbi1iYXB0aXN0ZScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnSmVhbi1CYXB0aXN0ZSBQZW5yYXRoJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ3N5bHZhaW4nLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1N5bHZhaW4gUmV1Y2hlcmFuZCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdnbGVubicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2xlbm4gU29ubmEnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnYWxleGlzJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdBbGV4aXMgVGVzc2llcicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdnZW9mZnJleScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2VvZmZyZXkgVGhlbm90JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnByb2plY3RzID0gdGhpcy5zaHVmZmxlKHRoaXMucHJvamVjdHMpO1xuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24uZnJvbVRvKHRoaXMuJGVsLCAwLjcsIHthbHBoYTogMCwgeTogNTB9LCB7YWxwaGE6IDEsIHk6IDAsIGVhc2U6IEV4cG8uZWFzZU91dH0sIDAuNCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2h1ZmZsZTogZnVuY3Rpb24obykge1xuICAgICAgICAgICAgZm9yKHZhciBqLCB4LCBpID0gby5sZW5ndGg7IGk7IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKSwgeCA9IG9bLS1pXSwgb1tpXSA9IG9bal0sIG9bal0gPSB4KTtcbiAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJlZm9yZVRyYW5zaXRpb25JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcblxuICAgIH0sXG5cbiAgICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpIHtcblxuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInByb2plY3RcXFwiPlxcbiAgICA8aDI+aWNpIGluc8OpcmVyIGwnaWZyYW1lIGRlIHt7YXV0aG9yfX08L2gyPlxcbjwvZGl2PlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgc2VjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYmFzZS9zZWN0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCBzZWN0aW9uLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vcHJvamVjdC5odG1sJyksXG4gICAgcm91dGU6IHtcbiAgICAgICAgaWQ6ICdwcm9qZWN0JyxcbiAgICAgICAgdHJhbnNpdGlvbk1vZGU6ICdvdXRBbmRBZnRlckluJyxcbiAgICAgICAgcGF0aDogJy9wcm9qZWN0LzppZCdcbiAgICB9LFxuICAgIGRhdGE6IHtcblxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICBpbnNlcnRUd2VlbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb2plY3QuaW5zZXJ0VHdlZW5zJyk7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNywge2FscGhhOiAwLCB5OiA1MH0sIHthbHBoYTogMSwgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgMC40KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcm9qZWN0LmJlZm9yZVRyYW5zaXRpb25JbicsIHRoaXMuJG9wdGlvbnMucm91dGUucGFyYW1zLmlkKTtcbiAgICAgICAgICAgIHRoaXMuYXV0aG9yID0gdGhpcy4kb3B0aW9ucy5yb3V0ZS5wYXJhbXMuaWQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICB9LFxuXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcbiJdfQ==
