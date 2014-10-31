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
            'about': require('./views/sections/about/about')

            /* COMMON */

        },

        directives: {
            'pw-view': require('./base/view.js')
        },

        ready: function() {
            router.on('router:update', this.onRouteUpdate.bind(this));

            router.addRoute(require('./views/sections/home/home').route);
            router.addRoute(require('./views/sections/about/about').route);
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

},{"./base/view.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/view.js","./imports":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/imports.js","./router":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/router.js","./views/components/nameButton/nameButton":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/components/nameButton/nameButton.js","./views/layout/footer/footer":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/footer/footer.js","./views/layout/header/header":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.js","./views/sections/about/about":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/about/about.js","./views/sections/home/home":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.js","TweenMax":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/greensock/src/minified/TweenMax.min.js","vue":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/bindall-standalone/index.js":[function(require,module,exports){
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
module.exports = "<h2 v-el=\"title\">CRMA 2015</h2>\n<h3 id=\"subtitle\" v-el=\"subtitle\">Creative Coding Workshop - Three.js</h3>";

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
        tl.from(this.$$.title, 0.6, {y: -20, alpha: 0, ease: Expo.easeOut}, startTime + 0.1);
    }
};
},{"./header.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/layout/header/header.html"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/about/about.html":[function(require,module,exports){
module.exports = "<div class=\"about\">\n    <h2>Patchwork about</h2>\n    <p>Looks like it's working - <a href=\"/home\">home</a></p>\n</div>";

},{}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/about/about.js":[function(require,module,exports){
'use strict';

var extend = require('extend'),
    section = require('./../../../base/section.js');

module.exports = extend(true, {}, section, {
    template: require('./about.html'),
    route: {
        id: 'about',
        transitionMode: 'outAndAfterIn',
        path: '/about'
    },
    data: {

    },
    methods: {
        insertTweens: function() {
            this.tlTransition.fromTo(this.$el, 0.7, {alpha: 0, y: 50}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.4);
        },
        beforeTransitionIn: function() {

        }
    },
    
    ready: function() {

    },

    beforeDestroy: function() {

    }
});

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/section.js","./about.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/about/about.html","extend":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js"}],"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.html":[function(require,module,exports){
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
                id: '0',
                author: 'Clément Bardon',
                title: 'Awefully long title'
            },
            {
                id: '1',
                author: 'Nicolas Bonnot',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Kevin Budain',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Bertrand Cayla',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Etienne Chaumont',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Jordan Delcros',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Jérémie Devoos',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Léonard Hetsch',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Samuel Honigstein',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Lory Huz',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Guillaume Jasmin',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Thomas Josseau',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Antonin Langlade',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Katia Moreira',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Louise Obé',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Jean-Baptiste Penrath',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Sylvain Reucherand',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Glenn Sonna',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Alexis Tessier',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Geoffrey Thenot',
                title: 'Title'
            }
        ]
    },
    methods: {
        insertTweens: function() {
            this.tlTransition.fromTo(this.$el, 0.7, {alpha: 0, y: 50}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.4);
        },
        beforeTransitionIn: function() {

        }
    },
    
    ready: function() {

    },

    beforeDestroy: function() {

    }
});

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/base/section.js","./home.html":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/src/views/sections/home/home.html","extend":"/Users/guillaumegouessan/Sites/crma15-workshop-showcase/node_modules/extend/index.js"}]},{},["./src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL2JpbmRhbGwtc3RhbmRhbG9uZS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZm9yZWFjaC5qcy9kaXN0L2ZvcmVhY2gubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvZ3JlZW5zb2NrL3NyYy9taW5pZmllZC9Ud2Vlbk1heC5taW4uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy9ncmVlbnNvY2svc3JjL21pbmlmaWVkL3BsdWdpbnMvU2Nyb2xsVG9QbHVnaW4ubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvcGFnZS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1kZWJ1Zy9zcmMvaW5kZXguanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUtZGVidWcvc3JjL2xvZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1lbC9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS1xdWVyeS9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmluZGluZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGVwcy1wYXJzZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZS5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2lmLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL29uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3BhcnRpYWwuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3N0eWxlLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3ZpZXcuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZW1pdHRlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZXhwLXBhcnNlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZnJhZ21lbnQuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL21haW4uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90ZW1wbGF0ZS1wYXJzZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL25vZGVfbW9kdWxlcy92dWUvc3JjL3RleHQtcGFyc2VyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9ub2RlX21vZHVsZXMvdnVlL3NyYy91dGlscy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdmlld21vZGVsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvYmFzZS9zZWN0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvYmFzZS92aWV3LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvY29tbW9uL2RlYnVnLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvY29tbW9uL2RpcmVjdGl2ZXMvdmlld3BvcnQuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL3NyYy9pbXBvcnRzLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvcm91dGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvY29tcG9uZW50cy9uYW1lQnV0dG9uL25hbWVCdXR0b24uaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2NvbXBvbmVudHMvbmFtZUJ1dHRvbi9uYW1lQnV0dG9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvbGF5b3V0L2Zvb3Rlci9mb290ZXIuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2xheW91dC9mb290ZXIvZm9vdGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3MvbGF5b3V0L2hlYWRlci9oZWFkZXIuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL2xheW91dC9oZWFkZXIvaGVhZGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3Mvc2VjdGlvbnMvYWJvdXQvYWJvdXQuaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMTUtd29ya3Nob3Atc2hvd2Nhc2Uvc3JjL3ZpZXdzL3NlY3Rpb25zL2Fib3V0L2Fib3V0LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWExNS13b3Jrc2hvcC1zaG93Y2FzZS9zcmMvdmlld3Mvc2VjdGlvbnMvaG9tZS9ob21lLmh0bWwiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTE1LXdvcmtzaG9wLXNob3djYXNlL3NyYy92aWV3cy9zZWN0aW9ucy9ob21lL2hvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Z0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBQYXRjaHdvcmsgLSBhIGd1bHAsIG5wbSwgdnVlLmpzLCBub2RlLXNhc3MgYm9pbGVycGxhdGUuXG4gICAgMjAxNCAtIEZsb3JpYW4gTW9yZWwsIEd1aWxsYXVtZSBHb3Vlc3NhblxuKi9cblxuLypcbiAgICBBcHAgZW50cnkgcG9pbnQuXG5cbiAgICBDcmVhdGVzIHRoZSB0b3AtbW9zdCB2aWV3bW9kZWwsXG4gICAgcmVnaXN0ZXJzIHRoZSByb3V0ZXMsXG4gICAgcmVnaXN0ZXJzIGFsbCBjb21wb25lbnRzLFxuICAgIGFuZCBzdGFydCBvbiBwYWdlIGxvYWQuXG4gKi9cblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyksXG4gICAgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpO1xuXG4vKlxuICAgIFBsdWdpbnMsIGxpYiBjb25maWcuLi5cbiAqL1xucmVxdWlyZSgnLi9pbXBvcnRzJyk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJ2JvZHknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjdXJyZW50UGFnZTogbnVsbCwgLy8gQ3VycmVudCBwYWdlIGlkLCB1c2VkIGJ5IHYtcHctdmlld1xuICAgICAgICAgICAgY29udGV4dDoge30gLy8gcmVmZXJlbmNlIHRvIHRoZSByb3V0ZXIgY29udGV4dFxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgIC8qIExBWU9VVCAqL1xuICAgICAgICAgICAgJ2Zvb3Rlcic6IHJlcXVpcmUoJy4vdmlld3MvbGF5b3V0L2Zvb3Rlci9mb290ZXInKSxcbiAgICAgICAgICAgICdoZWFkZXInOiByZXF1aXJlKCcuL3ZpZXdzL2xheW91dC9oZWFkZXIvaGVhZGVyJyksXG5cbiAgICAgICAgICAgIC8qIENPTVBPTkVOVHMgKi9cbiAgICAgICAgICAgICduYW1lQnV0dG9uJzogcmVxdWlyZSgnLi92aWV3cy9jb21wb25lbnRzL25hbWVCdXR0b24vbmFtZUJ1dHRvbicpLFxuXG4gICAgICAgICAgICAvKiBQQUdFUyAqL1xuICAgICAgICAgICAgJ2hvbWUnOiByZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL2hvbWUvaG9tZScpLFxuICAgICAgICAgICAgJ2Fib3V0JzogcmVxdWlyZSgnLi92aWV3cy9zZWN0aW9ucy9hYm91dC9hYm91dCcpXG5cbiAgICAgICAgICAgIC8qIENPTU1PTiAqL1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlyZWN0aXZlczoge1xuICAgICAgICAgICAgJ3B3LXZpZXcnOiByZXF1aXJlKCcuL2Jhc2Uvdmlldy5qcycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcm91dGVyLm9uKCdyb3V0ZXI6dXBkYXRlJywgdGhpcy5vblJvdXRlVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICByb3V0ZXIuYWRkUm91dGUocmVxdWlyZSgnLi92aWV3cy9zZWN0aW9ucy9ob21lL2hvbWUnKS5yb3V0ZSk7XG4gICAgICAgICAgICByb3V0ZXIuYWRkUm91dGUocmVxdWlyZSgnLi92aWV3cy9zZWN0aW9ucy9hYm91dC9hYm91dCcpLnJvdXRlKTtcbiAgICAgICAgICAgIHJvdXRlci5zZXREZWZhdWx0Um91dGUoJ2hvbWUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBvblJvdXRlVXBkYXRlOiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gY29udGV4dC5pZDtcbiAgICAgICAgICAgICAgICB0aGlzLiRyb290LiRlbWl0KCckcm91dGUudXBkYXRlJywgdGhpcy5jdXJyZW50UGFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxud2luZG93Lm9ubG9hZCA9IGluaXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmKCFvYmplY3QpIHJldHVybiBjb25zb2xlLndhcm4oJ2JpbmRBbGwgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50LicpO1xuXG4gICAgdmFyIGZ1bmN0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBpZiAoZnVuY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgIGZvciAodmFyIG1ldGhvZCBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBtZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFttZXRob2RdID09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbChvYmplY3RbbWV0aG9kXSkgPT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9ucy5wdXNoKG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZiA9IGZ1bmN0aW9uc1tpXTtcbiAgICAgICAgb2JqZWN0W2ZdID0gYmluZChvYmplY3RbZl0sIG9iamVjdCk7XG4gICAgfVxufTtcblxuLypcbiAgICBGYXN0ZXIgYmluZCB3aXRob3V0IHNwZWNpZmljLWNhc2UgY2hlY2tpbmcuIChzZWUgaHR0cHM6Ly9jb2RlcndhbGwuY29tL3Avb2kzajN3KS5cbiAgICBiaW5kQWxsIGlzIG9ubHkgbmVlZGVkIGZvciBldmVudHMgYmluZGluZyBzbyBubyBuZWVkIHRvIG1ha2Ugc2xvdyBmaXhlcyBmb3IgY29uc3RydWN0b3JcbiAgICBvciBwYXJ0aWFsIGFwcGxpY2F0aW9uLlxuKi9cbmZ1bmN0aW9uIGJpbmQoZnVuYywgY29udGV4dCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgfTtcbn0iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJ2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdW5kZWZpbmVkO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCFvYmogfHwgdG9TdHJpbmcuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBoYXNfb3duX2NvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc19vd25fY29uc3RydWN0b3IgJiYgIWhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIG9iaikge31cblxuXHRyZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcblx0XHRkZWVwID0gdGFyZ2V0O1xuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcblx0XHQvLyBza2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG5cdFx0aSA9IDI7XG5cdH0gZWxzZSBpZiAoKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmIHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicpIHx8IHRhcmdldCA9PSBudWxsKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHRmb3IgKDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1tpXTtcblx0XHQvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG5cdFx0aWYgKG9wdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yIChuYW1lIGluIG9wdGlvbnMpIHtcblx0XHRcdFx0c3JjID0gdGFyZ2V0W25hbWVdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1tuYW1lXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IGNvcHkpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlY3Vyc2UgaWYgd2UncmUgbWVyZ2luZyBwbGFpbiBvYmplY3RzIG9yIGFycmF5c1xuXHRcdFx0XHRpZiAoZGVlcCAmJiBjb3B5ICYmIChpc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY29weSkpKSkge1xuXHRcdFx0XHRcdGlmIChjb3B5SXNBcnJheSkge1xuXHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIEFycmF5LmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBOZXZlciBtb3ZlIG9yaWdpbmFsIG9iamVjdHMsIGNsb25lIHRoZW1cblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBleHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0YXJnZXRbbmFtZV0gPSBjb3B5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBtb2RpZmllZCBvYmplY3Rcblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbjtfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vKiEgZm9yZWFjaC5qcyB2MS4xLjAgfCAoYykgMjAxNCBAdG9kZG1vdHRvIHwgaHR0cHM6Ly9naXRodWIuY29tL3RvZGRtb3R0by9mb3JlYWNoICovXG52YXIgZm9yRWFjaD1mdW5jdGlvbih0LG8scil7aWYoXCJbb2JqZWN0IE9iamVjdF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSlmb3IodmFyIGMgaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxjKSYmby5jYWxsKHIsdFtjXSxjLHQpO2Vsc2UgZm9yKHZhciBlPTAsbD10Lmxlbmd0aDtsPmU7ZSsrKW8uY2FsbChyLHRbZV0sZSx0KX07XG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBmb3JFYWNoICE9IFwidW5kZWZpbmVkXCIgPyBmb3JFYWNoIDogd2luZG93LmZvckVhY2gpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbjtfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vKiFcbiAqIFZFUlNJT046IDEuMTQuMVxuICogREFURTogMjAxNC0xMC0xNlxuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL3d3dy5ncmVlbnNvY2suY29tXG4gKiBcbiAqIEluY2x1ZGVzIGFsbCBvZiB0aGUgZm9sbG93aW5nOiBUd2VlbkxpdGUsIFR3ZWVuTWF4LCBUaW1lbGluZUxpdGUsIFRpbWVsaW5lTWF4LCBFYXNlUGFjaywgQ1NTUGx1Z2luLCBSb3VuZFByb3BzUGx1Z2luLCBCZXppZXJQbHVnaW4sIEF0dHJQbHVnaW4sIERpcmVjdGlvbmFsUm90YXRpb25QbHVnaW5cbiAqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNCwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyB3b3JrIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIGF0IGh0dHA6Ly93d3cuZ3JlZW5zb2NrLmNvbS90ZXJtc19vZl91c2UuaHRtbCBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqKi9cbnZhciBfZ3NTY29wZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpc3x8d2luZG93OyhfZ3NTY29wZS5fZ3NRdWV1ZXx8KF9nc1Njb3BlLl9nc1F1ZXVlPVtdKSkucHVzaChmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO19nc1Njb3BlLl9nc0RlZmluZShcIlR3ZWVuTWF4XCIsW1wiY29yZS5BbmltYXRpb25cIixcImNvcmUuU2ltcGxlVGltZWxpbmVcIixcIlR3ZWVuTGl0ZVwiXSxmdW5jdGlvbih0LGUsaSl7dmFyIHM9ZnVuY3Rpb24odCl7dmFyIGUsaT1bXSxzPXQubGVuZ3RoO2ZvcihlPTA7ZSE9PXM7aS5wdXNoKHRbZSsrXSkpO3JldHVybiBpfSxyPWZ1bmN0aW9uKHQsZSxzKXtpLmNhbGwodGhpcyx0LGUscyksdGhpcy5fY3ljbGU9MCx0aGlzLl95b3lvPXRoaXMudmFycy55b3lvPT09ITAsdGhpcy5fcmVwZWF0PXRoaXMudmFycy5yZXBlYXR8fDAsdGhpcy5fcmVwZWF0RGVsYXk9dGhpcy52YXJzLnJlcGVhdERlbGF5fHwwLHRoaXMuX2RpcnR5PSEwLHRoaXMucmVuZGVyPXIucHJvdG90eXBlLnJlbmRlcn0sbj0xZS0xMCxhPWkuX2ludGVybmFscyxvPWEuaXNTZWxlY3RvcixoPWEuaXNBcnJheSxsPXIucHJvdG90eXBlPWkudG8oe30sLjEse30pLF89W107ci52ZXJzaW9uPVwiMS4xNC4xXCIsbC5jb25zdHJ1Y3Rvcj1yLGwua2lsbCgpLl9nYz0hMSxyLmtpbGxUd2VlbnNPZj1yLmtpbGxEZWxheWVkQ2FsbHNUbz1pLmtpbGxUd2VlbnNPZixyLmdldFR3ZWVuc09mPWkuZ2V0VHdlZW5zT2Ysci5sYWdTbW9vdGhpbmc9aS5sYWdTbW9vdGhpbmcsci50aWNrZXI9aS50aWNrZXIsci5yZW5kZXI9aS5yZW5kZXIsbC5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3lveW89dGhpcy52YXJzLnlveW89PT0hMCx0aGlzLl9yZXBlYXQ9dGhpcy52YXJzLnJlcGVhdHx8MCx0aGlzLl9yZXBlYXREZWxheT10aGlzLnZhcnMucmVwZWF0RGVsYXl8fDAsdGhpcy5fdW5jYWNoZSghMCksaS5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpfSxsLnVwZGF0ZVRvPWZ1bmN0aW9uKHQsZSl7dmFyIHMscj10aGlzLnJhdGlvO2UmJnRoaXMuX3N0YXJ0VGltZTx0aGlzLl90aW1lbGluZS5fdGltZSYmKHRoaXMuX3N0YXJ0VGltZT10aGlzLl90aW1lbGluZS5fdGltZSx0aGlzLl91bmNhY2hlKCExKSx0aGlzLl9nYz90aGlzLl9lbmFibGVkKCEwLCExKTp0aGlzLl90aW1lbGluZS5pbnNlcnQodGhpcyx0aGlzLl9zdGFydFRpbWUtdGhpcy5fZGVsYXkpKTtmb3IocyBpbiB0KXRoaXMudmFyc1tzXT10W3NdO2lmKHRoaXMuX2luaXR0ZWQpaWYoZSl0aGlzLl9pbml0dGVkPSExO2Vsc2UgaWYodGhpcy5fZ2MmJnRoaXMuX2VuYWJsZWQoITAsITEpLHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQmJnRoaXMuX2ZpcnN0UFQmJmkuX29uUGx1Z2luRXZlbnQoXCJfb25EaXNhYmxlXCIsdGhpcyksdGhpcy5fdGltZS90aGlzLl9kdXJhdGlvbj4uOTk4KXt2YXIgbj10aGlzLl90aW1lO3RoaXMucmVuZGVyKDAsITAsITEpLHRoaXMuX2luaXR0ZWQ9ITEsdGhpcy5yZW5kZXIobiwhMCwhMSl9ZWxzZSBpZih0aGlzLl90aW1lPjApe3RoaXMuX2luaXR0ZWQ9ITEsdGhpcy5faW5pdCgpO2Zvcih2YXIgYSxvPTEvKDEtciksaD10aGlzLl9maXJzdFBUO2g7KWE9aC5zK2guYyxoLmMqPW8saC5zPWEtaC5jLGg9aC5fbmV4dH1yZXR1cm4gdGhpc30sbC5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3RoaXMuX2luaXR0ZWR8fDA9PT10aGlzLl9kdXJhdGlvbiYmdGhpcy52YXJzLnJlcGVhdCYmdGhpcy5pbnZhbGlkYXRlKCk7dmFyIHMscixvLGgsbCx1LHAsYyxmPXRoaXMuX2RpcnR5P3RoaXMudG90YWxEdXJhdGlvbigpOnRoaXMuX3RvdGFsRHVyYXRpb24sbT10aGlzLl90aW1lLGQ9dGhpcy5fdG90YWxUaW1lLGc9dGhpcy5fY3ljbGUsdj10aGlzLl9kdXJhdGlvbix5PXRoaXMuX3Jhd1ByZXZUaW1lO2lmKHQ+PWY/KHRoaXMuX3RvdGFsVGltZT1mLHRoaXMuX2N5Y2xlPXRoaXMuX3JlcGVhdCx0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpPyh0aGlzLl90aW1lPTAsdGhpcy5yYXRpbz10aGlzLl9lYXNlLl9jYWxjRW5kP3RoaXMuX2Vhc2UuZ2V0UmF0aW8oMCk6MCk6KHRoaXMuX3RpbWU9dix0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygxKToxKSx0aGlzLl9yZXZlcnNlZHx8KHM9ITAscj1cIm9uQ29tcGxldGVcIiksMD09PXYmJih0aGlzLl9pbml0dGVkfHwhdGhpcy52YXJzLmxhenl8fGkpJiYodGhpcy5fc3RhcnRUaW1lPT09dGhpcy5fdGltZWxpbmUuX2R1cmF0aW9uJiYodD0wKSwoMD09PXR8fDA+eXx8eT09PW4pJiZ5IT09dCYmKGk9ITAseT5uJiYocj1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIpKSx0aGlzLl9yYXdQcmV2VGltZT1jPSFlfHx0fHx5PT09dD90Om4pKToxZS03PnQ/KHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXRoaXMuX2N5Y2xlPTAsdGhpcy5yYXRpbz10aGlzLl9lYXNlLl9jYWxjRW5kP3RoaXMuX2Vhc2UuZ2V0UmF0aW8oMCk6MCwoMCE9PWR8fDA9PT12JiZ5PjAmJnkhPT1uKSYmKHI9XCJvblJldmVyc2VDb21wbGV0ZVwiLHM9dGhpcy5fcmV2ZXJzZWQpLDA+dCYmKHRoaXMuX2FjdGl2ZT0hMSwwPT09diYmKHRoaXMuX2luaXR0ZWR8fCF0aGlzLnZhcnMubGF6eXx8aSkmJih5Pj0wJiYoaT0hMCksdGhpcy5fcmF3UHJldlRpbWU9Yz0hZXx8dHx8eT09PXQ/dDpuKSksdGhpcy5faW5pdHRlZHx8KGk9ITApKToodGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9dCwwIT09dGhpcy5fcmVwZWF0JiYoaD12K3RoaXMuX3JlcGVhdERlbGF5LHRoaXMuX2N5Y2xlPXRoaXMuX3RvdGFsVGltZS9oPj4wLDAhPT10aGlzLl9jeWNsZSYmdGhpcy5fY3ljbGU9PT10aGlzLl90b3RhbFRpbWUvaCYmdGhpcy5fY3ljbGUtLSx0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZS10aGlzLl9jeWNsZSpoLHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSkmJih0aGlzLl90aW1lPXYtdGhpcy5fdGltZSksdGhpcy5fdGltZT52P3RoaXMuX3RpbWU9djowPnRoaXMuX3RpbWUmJih0aGlzLl90aW1lPTApKSx0aGlzLl9lYXNlVHlwZT8obD10aGlzLl90aW1lL3YsdT10aGlzLl9lYXNlVHlwZSxwPXRoaXMuX2Vhc2VQb3dlciwoMT09PXV8fDM9PT11JiZsPj0uNSkmJihsPTEtbCksMz09PXUmJihsKj0yKSwxPT09cD9sKj1sOjI9PT1wP2wqPWwqbDozPT09cD9sKj1sKmwqbDo0PT09cCYmKGwqPWwqbCpsKmwpLHRoaXMucmF0aW89MT09PXU/MS1sOjI9PT11P2w6LjU+dGhpcy5fdGltZS92P2wvMjoxLWwvMik6dGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUvdikpLG09PT10aGlzLl90aW1lJiYhaSYmZz09PXRoaXMuX2N5Y2xlKXJldHVybiBkIT09dGhpcy5fdG90YWxUaW1lJiZ0aGlzLl9vblVwZGF0ZSYmKGV8fHRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8XykpLHZvaWQgMDtpZighdGhpcy5faW5pdHRlZCl7aWYodGhpcy5faW5pdCgpLCF0aGlzLl9pbml0dGVkfHx0aGlzLl9nYylyZXR1cm47aWYoIWkmJnRoaXMuX2ZpcnN0UFQmJih0aGlzLnZhcnMubGF6eSE9PSExJiZ0aGlzLl9kdXJhdGlvbnx8dGhpcy52YXJzLmxhenkmJiF0aGlzLl9kdXJhdGlvbikpcmV0dXJuIHRoaXMuX3RpbWU9bSx0aGlzLl90b3RhbFRpbWU9ZCx0aGlzLl9yYXdQcmV2VGltZT15LHRoaXMuX2N5Y2xlPWcsYS5sYXp5VHdlZW5zLnB1c2godGhpcyksdGhpcy5fbGF6eT1bdCxlXSx2b2lkIDA7dGhpcy5fdGltZSYmIXM/dGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUvdik6cyYmdGhpcy5fZWFzZS5fY2FsY0VuZCYmKHRoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbygwPT09dGhpcy5fdGltZT8wOjEpKX1mb3IodGhpcy5fbGF6eSE9PSExJiYodGhpcy5fbGF6eT0hMSksdGhpcy5fYWN0aXZlfHwhdGhpcy5fcGF1c2VkJiZ0aGlzLl90aW1lIT09bSYmdD49MCYmKHRoaXMuX2FjdGl2ZT0hMCksMD09PWQmJigyPT09dGhpcy5faW5pdHRlZCYmdD4wJiZ0aGlzLl9pbml0KCksdGhpcy5fc3RhcnRBdCYmKHQ+PTA/dGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpOnJ8fChyPVwiX2R1bW15R1NcIikpLHRoaXMudmFycy5vblN0YXJ0JiYoMCE9PXRoaXMuX3RvdGFsVGltZXx8MD09PXYpJiYoZXx8dGhpcy52YXJzLm9uU3RhcnQuYXBwbHkodGhpcy52YXJzLm9uU3RhcnRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25TdGFydFBhcmFtc3x8XykpKSxvPXRoaXMuX2ZpcnN0UFQ7bzspby5mP28udFtvLnBdKG8uYyp0aGlzLnJhdGlvK28ucyk6by50W28ucF09by5jKnRoaXMucmF0aW8rby5zLG89by5fbmV4dDt0aGlzLl9vblVwZGF0ZSYmKDA+dCYmdGhpcy5fc3RhcnRBdCYmdGhpcy5fc3RhcnRUaW1lJiZ0aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSksZXx8KHRoaXMuX3RvdGFsVGltZSE9PWR8fHMpJiZ0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fF8pKSx0aGlzLl9jeWNsZSE9PWcmJihlfHx0aGlzLl9nY3x8dGhpcy52YXJzLm9uUmVwZWF0JiZ0aGlzLnZhcnMub25SZXBlYXQuYXBwbHkodGhpcy52YXJzLm9uUmVwZWF0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uUmVwZWF0UGFyYW1zfHxfKSksciYmKCF0aGlzLl9nY3x8aSkmJigwPnQmJnRoaXMuX3N0YXJ0QXQmJiF0aGlzLl9vblVwZGF0ZSYmdGhpcy5fc3RhcnRUaW1lJiZ0aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSkscyYmKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiYmdGhpcy5fZW5hYmxlZCghMSwhMSksdGhpcy5fYWN0aXZlPSExKSwhZSYmdGhpcy52YXJzW3JdJiZ0aGlzLnZhcnNbcl0uYXBwbHkodGhpcy52YXJzW3IrXCJTY29wZVwiXXx8dGhpcyx0aGlzLnZhcnNbcitcIlBhcmFtc1wiXXx8XyksMD09PXYmJnRoaXMuX3Jhd1ByZXZUaW1lPT09biYmYyE9PW4mJih0aGlzLl9yYXdQcmV2VGltZT0wKSl9LHIudG89ZnVuY3Rpb24odCxlLGkpe3JldHVybiBuZXcgcih0LGUsaSl9LHIuZnJvbT1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIGkucnVuQmFja3dhcmRzPSEwLGkuaW1tZWRpYXRlUmVuZGVyPTAhPWkuaW1tZWRpYXRlUmVuZGVyLG5ldyByKHQsZSxpKX0sci5mcm9tVG89ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHMuc3RhcnRBdD1pLHMuaW1tZWRpYXRlUmVuZGVyPTAhPXMuaW1tZWRpYXRlUmVuZGVyJiYwIT1pLmltbWVkaWF0ZVJlbmRlcixuZXcgcih0LGUscyl9LHIuc3RhZ2dlclRvPXIuYWxsVG89ZnVuY3Rpb24odCxlLG4sYSxsLHUscCl7YT1hfHwwO3ZhciBjLGYsbSxkLGc9bi5kZWxheXx8MCx2PVtdLHk9ZnVuY3Rpb24oKXtuLm9uQ29tcGxldGUmJm4ub25Db21wbGV0ZS5hcHBseShuLm9uQ29tcGxldGVTY29wZXx8dGhpcyxhcmd1bWVudHMpLGwuYXBwbHkocHx8dGhpcyx1fHxfKX07Zm9yKGgodCl8fChcInN0cmluZ1wiPT10eXBlb2YgdCYmKHQ9aS5zZWxlY3Rvcih0KXx8dCksbyh0KSYmKHQ9cyh0KSkpLHQ9dHx8W10sMD5hJiYodD1zKHQpLHQucmV2ZXJzZSgpLGEqPS0xKSxjPXQubGVuZ3RoLTEsbT0wO2M+PW07bSsrKXtmPXt9O2ZvcihkIGluIG4pZltkXT1uW2RdO2YuZGVsYXk9ZyxtPT09YyYmbCYmKGYub25Db21wbGV0ZT15KSx2W21dPW5ldyByKHRbbV0sZSxmKSxnKz1hfXJldHVybiB2fSxyLnN0YWdnZXJGcm9tPXIuYWxsRnJvbT1mdW5jdGlvbih0LGUsaSxzLG4sYSxvKXtyZXR1cm4gaS5ydW5CYWNrd2FyZHM9ITAsaS5pbW1lZGlhdGVSZW5kZXI9MCE9aS5pbW1lZGlhdGVSZW5kZXIsci5zdGFnZ2VyVG8odCxlLGkscyxuLGEsbyl9LHIuc3RhZ2dlckZyb21Ubz1yLmFsbEZyb21Ubz1mdW5jdGlvbih0LGUsaSxzLG4sYSxvLGgpe3JldHVybiBzLnN0YXJ0QXQ9aSxzLmltbWVkaWF0ZVJlbmRlcj0wIT1zLmltbWVkaWF0ZVJlbmRlciYmMCE9aS5pbW1lZGlhdGVSZW5kZXIsci5zdGFnZ2VyVG8odCxlLHMsbixhLG8saCl9LHIuZGVsYXllZENhbGw9ZnVuY3Rpb24odCxlLGkscyxuKXtyZXR1cm4gbmV3IHIoZSwwLHtkZWxheTp0LG9uQ29tcGxldGU6ZSxvbkNvbXBsZXRlUGFyYW1zOmksb25Db21wbGV0ZVNjb3BlOnMsb25SZXZlcnNlQ29tcGxldGU6ZSxvblJldmVyc2VDb21wbGV0ZVBhcmFtczppLG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6cyxpbW1lZGlhdGVSZW5kZXI6ITEsdXNlRnJhbWVzOm4sb3ZlcndyaXRlOjB9KX0sci5zZXQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3IHIodCwwLGUpfSxyLmlzVHdlZW5pbmc9ZnVuY3Rpb24odCl7cmV0dXJuIGkuZ2V0VHdlZW5zT2YodCwhMCkubGVuZ3RoPjB9O3ZhciB1PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBzPVtdLHI9MCxuPXQuX2ZpcnN0O247KW4gaW5zdGFuY2VvZiBpP3NbcisrXT1uOihlJiYoc1tyKytdPW4pLHM9cy5jb25jYXQodShuLGUpKSxyPXMubGVuZ3RoKSxuPW4uX25leHQ7cmV0dXJuIHN9LHA9ci5nZXRBbGxUd2VlbnM9ZnVuY3Rpb24oZSl7cmV0dXJuIHUodC5fcm9vdFRpbWVsaW5lLGUpLmNvbmNhdCh1KHQuX3Jvb3RGcmFtZXNUaW1lbGluZSxlKSl9O3Iua2lsbEFsbD1mdW5jdGlvbih0LGkscyxyKXtudWxsPT1pJiYoaT0hMCksbnVsbD09cyYmKHM9ITApO3ZhciBuLGEsbyxoPXAoMCE9ciksbD1oLmxlbmd0aCxfPWkmJnMmJnI7Zm9yKG89MDtsPm87bysrKWE9aFtvXSwoX3x8YSBpbnN0YW5jZW9mIGV8fChuPWEudGFyZ2V0PT09YS52YXJzLm9uQ29tcGxldGUpJiZzfHxpJiYhbikmJih0P2EudG90YWxUaW1lKGEuX3JldmVyc2VkPzA6YS50b3RhbER1cmF0aW9uKCkpOmEuX2VuYWJsZWQoITEsITEpKX0sci5raWxsQ2hpbGRUd2VlbnNPZj1mdW5jdGlvbih0LGUpe2lmKG51bGwhPXQpe3ZhciBuLGwsXyx1LHAsYz1hLnR3ZWVuTG9va3VwO2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0JiYodD1pLnNlbGVjdG9yKHQpfHx0KSxvKHQpJiYodD1zKHQpKSxoKHQpKWZvcih1PXQubGVuZ3RoOy0tdT4tMTspci5raWxsQ2hpbGRUd2VlbnNPZih0W3VdLGUpO2Vsc2V7bj1bXTtmb3IoXyBpbiBjKWZvcihsPWNbX10udGFyZ2V0LnBhcmVudE5vZGU7bDspbD09PXQmJihuPW4uY29uY2F0KGNbX10udHdlZW5zKSksbD1sLnBhcmVudE5vZGU7Zm9yKHA9bi5sZW5ndGgsdT0wO3A+dTt1KyspZSYmblt1XS50b3RhbFRpbWUoblt1XS50b3RhbER1cmF0aW9uKCkpLG5bdV0uX2VuYWJsZWQoITEsITEpfX19O3ZhciBjPWZ1bmN0aW9uKHQsaSxzLHIpe2k9aSE9PSExLHM9cyE9PSExLHI9ciE9PSExO2Zvcih2YXIgbixhLG89cChyKSxoPWkmJnMmJnIsbD1vLmxlbmd0aDstLWw+LTE7KWE9b1tsXSwoaHx8YSBpbnN0YW5jZW9mIGV8fChuPWEudGFyZ2V0PT09YS52YXJzLm9uQ29tcGxldGUpJiZzfHxpJiYhbikmJmEucGF1c2VkKHQpfTtyZXR1cm4gci5wYXVzZUFsbD1mdW5jdGlvbih0LGUsaSl7YyghMCx0LGUsaSl9LHIucmVzdW1lQWxsPWZ1bmN0aW9uKHQsZSxpKXtjKCExLHQsZSxpKX0sci5nbG9iYWxUaW1lU2NhbGU9ZnVuY3Rpb24oZSl7dmFyIHM9dC5fcm9vdFRpbWVsaW5lLHI9aS50aWNrZXIudGltZTtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8oZT1lfHxuLHMuX3N0YXJ0VGltZT1yLShyLXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlL2Uscz10Ll9yb290RnJhbWVzVGltZWxpbmUscj1pLnRpY2tlci5mcmFtZSxzLl9zdGFydFRpbWU9ci0oci1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZS9lLHMuX3RpbWVTY2FsZT10Ll9yb290VGltZWxpbmUuX3RpbWVTY2FsZT1lLGUpOnMuX3RpbWVTY2FsZX0sbC5wcm9ncmVzcz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnRvdGFsVGltZSh0aGlzLmR1cmF0aW9uKCkqKHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/MS10OnQpK3RoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSksITEpOnRoaXMuX3RpbWUvdGhpcy5kdXJhdGlvbigpfSxsLnRvdGFsUHJvZ3Jlc3M9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy50b3RhbER1cmF0aW9uKCkqdCwhMSk6dGhpcy5fdG90YWxUaW1lL3RoaXMudG90YWxEdXJhdGlvbigpfSxsLnRpbWU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpLHQ+dGhpcy5fZHVyYXRpb24mJih0PXRoaXMuX2R1cmF0aW9uKSx0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpP3Q9dGhpcy5fZHVyYXRpb24tdCt0aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpOjAhPT10aGlzLl9yZXBlYXQmJih0Kz10aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpKSx0aGlzLnRvdGFsVGltZSh0LGUpKTp0aGlzLl90aW1lfSxsLmR1cmF0aW9uPWZ1bmN0aW9uKGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3QucHJvdG90eXBlLmR1cmF0aW9uLmNhbGwodGhpcyxlKTp0aGlzLl9kdXJhdGlvbn0sbC50b3RhbER1cmF0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPy0xPT09dGhpcy5fcmVwZWF0P3RoaXM6dGhpcy5kdXJhdGlvbigodC10aGlzLl9yZXBlYXQqdGhpcy5fcmVwZWF0RGVsYXkpLyh0aGlzLl9yZXBlYXQrMSkpOih0aGlzLl9kaXJ0eSYmKHRoaXMuX3RvdGFsRHVyYXRpb249LTE9PT10aGlzLl9yZXBlYXQ/OTk5OTk5OTk5OTk5OnRoaXMuX2R1cmF0aW9uKih0aGlzLl9yZXBlYXQrMSkrdGhpcy5fcmVwZWF0RGVsYXkqdGhpcy5fcmVwZWF0LHRoaXMuX2RpcnR5PSExKSx0aGlzLl90b3RhbER1cmF0aW9uKX0sbC5yZXBlYXQ9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlcGVhdD10LHRoaXMuX3VuY2FjaGUoITApKTp0aGlzLl9yZXBlYXR9LGwucmVwZWF0RGVsYXk9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlcGVhdERlbGF5PXQsdGhpcy5fdW5jYWNoZSghMCkpOnRoaXMuX3JlcGVhdERlbGF5fSxsLnlveW89ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3lveW89dCx0aGlzKTp0aGlzLl95b3lvfSxyfSwhMCksX2dzU2NvcGUuX2dzRGVmaW5lKFwiVGltZWxpbmVMaXRlXCIsW1wiY29yZS5BbmltYXRpb25cIixcImNvcmUuU2ltcGxlVGltZWxpbmVcIixcIlR3ZWVuTGl0ZVwiXSxmdW5jdGlvbih0LGUsaSl7dmFyIHM9ZnVuY3Rpb24odCl7ZS5jYWxsKHRoaXMsdCksdGhpcy5fbGFiZWxzPXt9LHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuPXRoaXMudmFycy5hdXRvUmVtb3ZlQ2hpbGRyZW49PT0hMCx0aGlzLnNtb290aENoaWxkVGltaW5nPXRoaXMudmFycy5zbW9vdGhDaGlsZFRpbWluZz09PSEwLHRoaXMuX3NvcnRDaGlsZHJlbj0hMCx0aGlzLl9vblVwZGF0ZT10aGlzLnZhcnMub25VcGRhdGU7dmFyIGkscyxyPXRoaXMudmFycztmb3IocyBpbiByKWk9cltzXSxvKGkpJiYtMSE9PWkuam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpJiYocltzXT10aGlzLl9zd2FwU2VsZkluUGFyYW1zKGkpKTtvKHIudHdlZW5zKSYmdGhpcy5hZGQoci50d2VlbnMsMCxyLmFsaWduLHIuc3RhZ2dlcil9LHI9MWUtMTAsbj1pLl9pbnRlcm5hbHMsYT1uLmlzU2VsZWN0b3Isbz1uLmlzQXJyYXksaD1uLmxhenlUd2VlbnMsbD1uLmxhenlSZW5kZXIsXz1bXSx1PV9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLHA9ZnVuY3Rpb24odCl7dmFyIGUsaT17fTtmb3IoZSBpbiB0KWlbZV09dFtlXTtyZXR1cm4gaX0sYz1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcj10Ll90aW1lbGluZS5fdG90YWxUaW1lOyhlfHwhdGhpcy5fZm9yY2luZ1BsYXloZWFkKSYmKHQuX3RpbWVsaW5lLnBhdXNlKHQuX3N0YXJ0VGltZSksZSYmZS5hcHBseShzfHx0Ll90aW1lbGluZSxpfHxfKSx0aGlzLl9mb3JjaW5nUGxheWhlYWQmJnQuX3RpbWVsaW5lLnNlZWsocikpfSxmPWZ1bmN0aW9uKHQpe3ZhciBlLGk9W10scz10Lmxlbmd0aDtmb3IoZT0wO2UhPT1zO2kucHVzaCh0W2UrK10pKTtyZXR1cm4gaX0sbT1zLnByb3RvdHlwZT1uZXcgZTtyZXR1cm4gcy52ZXJzaW9uPVwiMS4xNC4xXCIsbS5jb25zdHJ1Y3Rvcj1zLG0ua2lsbCgpLl9nYz1tLl9mb3JjaW5nUGxheWhlYWQ9ITEsbS50bz1mdW5jdGlvbih0LGUscyxyKXt2YXIgbj1zLnJlcGVhdCYmdS5Ud2Vlbk1heHx8aTtyZXR1cm4gZT90aGlzLmFkZChuZXcgbih0LGUscykscik6dGhpcy5zZXQodCxzLHIpfSxtLmZyb209ZnVuY3Rpb24odCxlLHMscil7cmV0dXJuIHRoaXMuYWRkKChzLnJlcGVhdCYmdS5Ud2Vlbk1heHx8aSkuZnJvbSh0LGUscykscil9LG0uZnJvbVRvPWZ1bmN0aW9uKHQsZSxzLHIsbil7dmFyIGE9ci5yZXBlYXQmJnUuVHdlZW5NYXh8fGk7cmV0dXJuIGU/dGhpcy5hZGQoYS5mcm9tVG8odCxlLHMsciksbik6dGhpcy5zZXQodCxyLG4pfSxtLnN0YWdnZXJUbz1mdW5jdGlvbih0LGUscixuLG8saCxsLF8pe3ZhciB1LGM9bmV3IHMoe29uQ29tcGxldGU6aCxvbkNvbXBsZXRlUGFyYW1zOmwsb25Db21wbGV0ZVNjb3BlOl8sc21vb3RoQ2hpbGRUaW1pbmc6dGhpcy5zbW9vdGhDaGlsZFRpbWluZ30pO2ZvcihcInN0cmluZ1wiPT10eXBlb2YgdCYmKHQ9aS5zZWxlY3Rvcih0KXx8dCksdD10fHxbXSxhKHQpJiYodD1mKHQpKSxuPW58fDAsMD5uJiYodD1mKHQpLHQucmV2ZXJzZSgpLG4qPS0xKSx1PTA7dC5sZW5ndGg+dTt1Kyspci5zdGFydEF0JiYoci5zdGFydEF0PXAoci5zdGFydEF0KSksYy50byh0W3VdLGUscChyKSx1Km4pO3JldHVybiB0aGlzLmFkZChjLG8pfSxtLnN0YWdnZXJGcm9tPWZ1bmN0aW9uKHQsZSxpLHMscixuLGEsbyl7cmV0dXJuIGkuaW1tZWRpYXRlUmVuZGVyPTAhPWkuaW1tZWRpYXRlUmVuZGVyLGkucnVuQmFja3dhcmRzPSEwLHRoaXMuc3RhZ2dlclRvKHQsZSxpLHMscixuLGEsbyl9LG0uc3RhZ2dlckZyb21Ubz1mdW5jdGlvbih0LGUsaSxzLHIsbixhLG8saCl7cmV0dXJuIHMuc3RhcnRBdD1pLHMuaW1tZWRpYXRlUmVuZGVyPTAhPXMuaW1tZWRpYXRlUmVuZGVyJiYwIT1pLmltbWVkaWF0ZVJlbmRlcix0aGlzLnN0YWdnZXJUbyh0LGUscyxyLG4sYSxvLGgpfSxtLmNhbGw9ZnVuY3Rpb24odCxlLHMscil7cmV0dXJuIHRoaXMuYWRkKGkuZGVsYXllZENhbGwoMCx0LGUscykscil9LG0uc2V0PWZ1bmN0aW9uKHQsZSxzKXtyZXR1cm4gcz10aGlzLl9wYXJzZVRpbWVPckxhYmVsKHMsMCwhMCksbnVsbD09ZS5pbW1lZGlhdGVSZW5kZXImJihlLmltbWVkaWF0ZVJlbmRlcj1zPT09dGhpcy5fdGltZSYmIXRoaXMuX3BhdXNlZCksdGhpcy5hZGQobmV3IGkodCwwLGUpLHMpfSxzLmV4cG9ydFJvb3Q9ZnVuY3Rpb24odCxlKXt0PXR8fHt9LG51bGw9PXQuc21vb3RoQ2hpbGRUaW1pbmcmJih0LnNtb290aENoaWxkVGltaW5nPSEwKTt2YXIgcixuLGE9bmV3IHModCksbz1hLl90aW1lbGluZTtmb3IobnVsbD09ZSYmKGU9ITApLG8uX3JlbW92ZShhLCEwKSxhLl9zdGFydFRpbWU9MCxhLl9yYXdQcmV2VGltZT1hLl90aW1lPWEuX3RvdGFsVGltZT1vLl90aW1lLHI9by5fZmlyc3Q7cjspbj1yLl9uZXh0LGUmJnIgaW5zdGFuY2VvZiBpJiZyLnRhcmdldD09PXIudmFycy5vbkNvbXBsZXRlfHxhLmFkZChyLHIuX3N0YXJ0VGltZS1yLl9kZWxheSkscj1uO3JldHVybiBvLmFkZChhLDApLGF9LG0uYWRkPWZ1bmN0aW9uKHIsbixhLGgpe3ZhciBsLF8sdSxwLGMsZjtpZihcIm51bWJlclwiIT10eXBlb2YgbiYmKG49dGhpcy5fcGFyc2VUaW1lT3JMYWJlbChuLDAsITAscikpLCEociBpbnN0YW5jZW9mIHQpKXtpZihyIGluc3RhbmNlb2YgQXJyYXl8fHImJnIucHVzaCYmbyhyKSl7Zm9yKGE9YXx8XCJub3JtYWxcIixoPWh8fDAsbD1uLF89ci5sZW5ndGgsdT0wO18+dTt1KyspbyhwPXJbdV0pJiYocD1uZXcgcyh7dHdlZW5zOnB9KSksdGhpcy5hZGQocCxsKSxcInN0cmluZ1wiIT10eXBlb2YgcCYmXCJmdW5jdGlvblwiIT10eXBlb2YgcCYmKFwic2VxdWVuY2VcIj09PWE/bD1wLl9zdGFydFRpbWUrcC50b3RhbER1cmF0aW9uKCkvcC5fdGltZVNjYWxlOlwic3RhcnRcIj09PWEmJihwLl9zdGFydFRpbWUtPXAuZGVsYXkoKSkpLGwrPWg7cmV0dXJuIHRoaXMuX3VuY2FjaGUoITApfWlmKFwic3RyaW5nXCI9PXR5cGVvZiByKXJldHVybiB0aGlzLmFkZExhYmVsKHIsbik7aWYoXCJmdW5jdGlvblwiIT10eXBlb2Ygcil0aHJvd1wiQ2Fubm90IGFkZCBcIityK1wiIGludG8gdGhlIHRpbWVsaW5lOyBpdCBpcyBub3QgYSB0d2VlbiwgdGltZWxpbmUsIGZ1bmN0aW9uLCBvciBzdHJpbmcuXCI7cj1pLmRlbGF5ZWRDYWxsKDAscil9aWYoZS5wcm90b3R5cGUuYWRkLmNhbGwodGhpcyxyLG4pLCh0aGlzLl9nY3x8dGhpcy5fdGltZT09PXRoaXMuX2R1cmF0aW9uKSYmIXRoaXMuX3BhdXNlZCYmdGhpcy5fZHVyYXRpb248dGhpcy5kdXJhdGlvbigpKWZvcihjPXRoaXMsZj1jLnJhd1RpbWUoKT5yLl9zdGFydFRpbWU7Yy5fdGltZWxpbmU7KWYmJmMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nP2MudG90YWxUaW1lKGMuX3RvdGFsVGltZSwhMCk6Yy5fZ2MmJmMuX2VuYWJsZWQoITAsITEpLGM9Yy5fdGltZWxpbmU7cmV0dXJuIHRoaXN9LG0ucmVtb3ZlPWZ1bmN0aW9uKGUpe2lmKGUgaW5zdGFuY2VvZiB0KXJldHVybiB0aGlzLl9yZW1vdmUoZSwhMSk7aWYoZSBpbnN0YW5jZW9mIEFycmF5fHxlJiZlLnB1c2gmJm8oZSkpe2Zvcih2YXIgaT1lLmxlbmd0aDstLWk+LTE7KXRoaXMucmVtb3ZlKGVbaV0pO3JldHVybiB0aGlzfXJldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlP3RoaXMucmVtb3ZlTGFiZWwoZSk6dGhpcy5raWxsKG51bGwsZSl9LG0uX3JlbW92ZT1mdW5jdGlvbih0LGkpe2UucHJvdG90eXBlLl9yZW1vdmUuY2FsbCh0aGlzLHQsaSk7dmFyIHM9dGhpcy5fbGFzdDtyZXR1cm4gcz90aGlzLl90aW1lPnMuX3N0YXJ0VGltZStzLl90b3RhbER1cmF0aW9uL3MuX3RpbWVTY2FsZSYmKHRoaXMuX3RpbWU9dGhpcy5kdXJhdGlvbigpLHRoaXMuX3RvdGFsVGltZT10aGlzLl90b3RhbER1cmF0aW9uKTp0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZT10aGlzLl9kdXJhdGlvbj10aGlzLl90b3RhbER1cmF0aW9uPTAsdGhpc30sbS5hcHBlbmQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5hZGQodCx0aGlzLl9wYXJzZVRpbWVPckxhYmVsKG51bGwsZSwhMCx0KSl9LG0uaW5zZXJ0PW0uaW5zZXJ0TXVsdGlwbGU9ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHRoaXMuYWRkKHQsZXx8MCxpLHMpfSxtLmFwcGVuZE11bHRpcGxlPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiB0aGlzLmFkZCh0LHRoaXMuX3BhcnNlVGltZU9yTGFiZWwobnVsbCxlLCEwLHQpLGkscyl9LG0uYWRkTGFiZWw9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fbGFiZWxzW3RdPXRoaXMuX3BhcnNlVGltZU9yTGFiZWwoZSksdGhpc30sbS5hZGRQYXVzZT1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gdGhpcy5jYWxsKGMsW1wie3NlbGZ9XCIsZSxpLHNdLHRoaXMsdCl9LG0ucmVtb3ZlTGFiZWw9ZnVuY3Rpb24odCl7cmV0dXJuIGRlbGV0ZSB0aGlzLl9sYWJlbHNbdF0sdGhpc30sbS5nZXRMYWJlbFRpbWU9ZnVuY3Rpb24odCl7cmV0dXJuIG51bGwhPXRoaXMuX2xhYmVsc1t0XT90aGlzLl9sYWJlbHNbdF06LTF9LG0uX3BhcnNlVGltZU9yTGFiZWw9ZnVuY3Rpb24oZSxpLHMscil7dmFyIG47aWYociBpbnN0YW5jZW9mIHQmJnIudGltZWxpbmU9PT10aGlzKXRoaXMucmVtb3ZlKHIpO2Vsc2UgaWYociYmKHIgaW5zdGFuY2VvZiBBcnJheXx8ci5wdXNoJiZvKHIpKSlmb3Iobj1yLmxlbmd0aDstLW4+LTE7KXJbbl1pbnN0YW5jZW9mIHQmJnJbbl0udGltZWxpbmU9PT10aGlzJiZ0aGlzLnJlbW92ZShyW25dKTtpZihcInN0cmluZ1wiPT10eXBlb2YgaSlyZXR1cm4gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChpLHMmJlwibnVtYmVyXCI9PXR5cGVvZiBlJiZudWxsPT10aGlzLl9sYWJlbHNbaV0/ZS10aGlzLmR1cmF0aW9uKCk6MCxzKTtpZihpPWl8fDAsXCJzdHJpbmdcIiE9dHlwZW9mIGV8fCFpc05hTihlKSYmbnVsbD09dGhpcy5fbGFiZWxzW2VdKW51bGw9PWUmJihlPXRoaXMuZHVyYXRpb24oKSk7ZWxzZXtpZihuPWUuaW5kZXhPZihcIj1cIiksLTE9PT1uKXJldHVybiBudWxsPT10aGlzLl9sYWJlbHNbZV0/cz90aGlzLl9sYWJlbHNbZV09dGhpcy5kdXJhdGlvbigpK2k6aTp0aGlzLl9sYWJlbHNbZV0raTtpPXBhcnNlSW50KGUuY2hhckF0KG4tMSkrXCIxXCIsMTApKk51bWJlcihlLnN1YnN0cihuKzEpKSxlPW4+MT90aGlzLl9wYXJzZVRpbWVPckxhYmVsKGUuc3Vic3RyKDAsbi0xKSwwLHMpOnRoaXMuZHVyYXRpb24oKX1yZXR1cm4gTnVtYmVyKGUpK2l9LG0uc2Vlaz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnRvdGFsVGltZShcIm51bWJlclwiPT10eXBlb2YgdD90OnRoaXMuX3BhcnNlVGltZU9yTGFiZWwodCksZSE9PSExKX0sbS5zdG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF1c2VkKCEwKX0sbS5nb3RvQW5kUGxheT1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnBsYXkodCxlKX0sbS5nb3RvQW5kU3RvcD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnBhdXNlKHQsZSl9LG0ucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt0aGlzLl9nYyYmdGhpcy5fZW5hYmxlZCghMCwhMSk7dmFyIHMsbixhLG8sdSxwPXRoaXMuX2RpcnR5P3RoaXMudG90YWxEdXJhdGlvbigpOnRoaXMuX3RvdGFsRHVyYXRpb24sYz10aGlzLl90aW1lLGY9dGhpcy5fc3RhcnRUaW1lLG09dGhpcy5fdGltZVNjYWxlLGQ9dGhpcy5fcGF1c2VkO2lmKHQ+PXA/KHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXAsdGhpcy5fcmV2ZXJzZWR8fHRoaXMuX2hhc1BhdXNlZENoaWxkKCl8fChuPSEwLG89XCJvbkNvbXBsZXRlXCIsMD09PXRoaXMuX2R1cmF0aW9uJiYoMD09PXR8fDA+dGhpcy5fcmF3UHJldlRpbWV8fHRoaXMuX3Jhd1ByZXZUaW1lPT09cikmJnRoaXMuX3Jhd1ByZXZUaW1lIT09dCYmdGhpcy5fZmlyc3QmJih1PSEwLHRoaXMuX3Jhd1ByZXZUaW1lPnImJihvPVwib25SZXZlcnNlQ29tcGxldGVcIikpKSx0aGlzLl9yYXdQcmV2VGltZT10aGlzLl9kdXJhdGlvbnx8IWV8fHR8fHRoaXMuX3Jhd1ByZXZUaW1lPT09dD90OnIsdD1wKzFlLTQpOjFlLTc+dD8odGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9MCwoMCE9PWN8fDA9PT10aGlzLl9kdXJhdGlvbiYmdGhpcy5fcmF3UHJldlRpbWUhPT1yJiYodGhpcy5fcmF3UHJldlRpbWU+MHx8MD50JiZ0aGlzLl9yYXdQcmV2VGltZT49MCkpJiYobz1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIsbj10aGlzLl9yZXZlcnNlZCksMD50Pyh0aGlzLl9hY3RpdmU9ITEsdGhpcy5fcmF3UHJldlRpbWU+PTAmJnRoaXMuX2ZpcnN0JiYodT0hMCksdGhpcy5fcmF3UHJldlRpbWU9dCk6KHRoaXMuX3Jhd1ByZXZUaW1lPXRoaXMuX2R1cmF0aW9ufHwhZXx8dHx8dGhpcy5fcmF3UHJldlRpbWU9PT10P3Q6cix0PTAsdGhpcy5faW5pdHRlZHx8KHU9ITApKSk6dGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9dGhpcy5fcmF3UHJldlRpbWU9dCx0aGlzLl90aW1lIT09YyYmdGhpcy5fZmlyc3R8fGl8fHUpe2lmKHRoaXMuX2luaXR0ZWR8fCh0aGlzLl9pbml0dGVkPSEwKSx0aGlzLl9hY3RpdmV8fCF0aGlzLl9wYXVzZWQmJnRoaXMuX3RpbWUhPT1jJiZ0PjAmJih0aGlzLl9hY3RpdmU9ITApLDA9PT1jJiZ0aGlzLnZhcnMub25TdGFydCYmMCE9PXRoaXMuX3RpbWUmJihlfHx0aGlzLnZhcnMub25TdGFydC5hcHBseSh0aGlzLnZhcnMub25TdGFydFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblN0YXJ0UGFyYW1zfHxfKSksdGhpcy5fdGltZT49Yylmb3Iocz10aGlzLl9maXJzdDtzJiYoYT1zLl9uZXh0LCF0aGlzLl9wYXVzZWR8fGQpOykocy5fYWN0aXZlfHxzLl9zdGFydFRpbWU8PXRoaXMuX3RpbWUmJiFzLl9wYXVzZWQmJiFzLl9nYykmJihzLl9yZXZlcnNlZD9zLnJlbmRlcigocy5fZGlydHk/cy50b3RhbER1cmF0aW9uKCk6cy5fdG90YWxEdXJhdGlvbiktKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKTpzLnJlbmRlcigodC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpKSxzPWE7ZWxzZSBmb3Iocz10aGlzLl9sYXN0O3MmJihhPXMuX3ByZXYsIXRoaXMuX3BhdXNlZHx8ZCk7KShzLl9hY3RpdmV8fGM+PXMuX3N0YXJ0VGltZSYmIXMuX3BhdXNlZCYmIXMuX2djKSYmKHMuX3JldmVyc2VkP3MucmVuZGVyKChzLl9kaXJ0eT9zLnRvdGFsRHVyYXRpb24oKTpzLl90b3RhbER1cmF0aW9uKS0odC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpOnMucmVuZGVyKCh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSkpLHM9YTt0aGlzLl9vblVwZGF0ZSYmKGV8fChoLmxlbmd0aCYmbCgpLHRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8XykpKSxvJiYodGhpcy5fZ2N8fChmPT09dGhpcy5fc3RhcnRUaW1lfHxtIT09dGhpcy5fdGltZVNjYWxlKSYmKDA9PT10aGlzLl90aW1lfHxwPj10aGlzLnRvdGFsRHVyYXRpb24oKSkmJihuJiYoaC5sZW5ndGgmJmwoKSx0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4mJnRoaXMuX2VuYWJsZWQoITEsITEpLHRoaXMuX2FjdGl2ZT0hMSksIWUmJnRoaXMudmFyc1tvXSYmdGhpcy52YXJzW29dLmFwcGx5KHRoaXMudmFyc1tvK1wiU2NvcGVcIl18fHRoaXMsdGhpcy52YXJzW28rXCJQYXJhbXNcIl18fF8pKSl9fSxtLl9oYXNQYXVzZWRDaGlsZD1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLl9maXJzdDt0Oyl7aWYodC5fcGF1c2VkfHx0IGluc3RhbmNlb2YgcyYmdC5faGFzUGF1c2VkQ2hpbGQoKSlyZXR1cm4hMDt0PXQuX25leHR9cmV0dXJuITF9LG0uZ2V0Q2hpbGRyZW49ZnVuY3Rpb24odCxlLHMscil7cj1yfHwtOTk5OTk5OTk5OTtmb3IodmFyIG49W10sYT10aGlzLl9maXJzdCxvPTA7YTspcj5hLl9zdGFydFRpbWV8fChhIGluc3RhbmNlb2YgaT9lIT09ITEmJihuW28rK109YSk6KHMhPT0hMSYmKG5bbysrXT1hKSx0IT09ITEmJihuPW4uY29uY2F0KGEuZ2V0Q2hpbGRyZW4oITAsZSxzKSksbz1uLmxlbmd0aCkpKSxhPWEuX25leHQ7cmV0dXJuIG59LG0uZ2V0VHdlZW5zT2Y9ZnVuY3Rpb24odCxlKXt2YXIgcyxyLG49dGhpcy5fZ2MsYT1bXSxvPTA7Zm9yKG4mJnRoaXMuX2VuYWJsZWQoITAsITApLHM9aS5nZXRUd2VlbnNPZih0KSxyPXMubGVuZ3RoOy0tcj4tMTspKHNbcl0udGltZWxpbmU9PT10aGlzfHxlJiZ0aGlzLl9jb250YWlucyhzW3JdKSkmJihhW28rK109c1tyXSk7cmV0dXJuIG4mJnRoaXMuX2VuYWJsZWQoITEsITApLGF9LG0ucmVjZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlY2VudH0sbS5fY29udGFpbnM9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQudGltZWxpbmU7ZTspe2lmKGU9PT10aGlzKXJldHVybiEwO2U9ZS50aW1lbGluZX1yZXR1cm4hMX0sbS5zaGlmdENoaWxkcmVuPWZ1bmN0aW9uKHQsZSxpKXtpPWl8fDA7Zm9yKHZhciBzLHI9dGhpcy5fZmlyc3Qsbj10aGlzLl9sYWJlbHM7cjspci5fc3RhcnRUaW1lPj1pJiYoci5fc3RhcnRUaW1lKz10KSxyPXIuX25leHQ7aWYoZSlmb3IocyBpbiBuKW5bc10+PWkmJihuW3NdKz10KTtyZXR1cm4gdGhpcy5fdW5jYWNoZSghMCl9LG0uX2tpbGw9ZnVuY3Rpb24odCxlKXtpZighdCYmIWUpcmV0dXJuIHRoaXMuX2VuYWJsZWQoITEsITEpO2Zvcih2YXIgaT1lP3RoaXMuZ2V0VHdlZW5zT2YoZSk6dGhpcy5nZXRDaGlsZHJlbighMCwhMCwhMSkscz1pLmxlbmd0aCxyPSExOy0tcz4tMTspaVtzXS5fa2lsbCh0LGUpJiYocj0hMCk7cmV0dXJuIHJ9LG0uY2xlYXI9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5nZXRDaGlsZHJlbighMSwhMCwhMCksaT1lLmxlbmd0aDtmb3IodGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWU9MDstLWk+LTE7KWVbaV0uX2VuYWJsZWQoITEsITEpO3JldHVybiB0IT09ITEmJih0aGlzLl9sYWJlbHM9e30pLHRoaXMuX3VuY2FjaGUoITApfSxtLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5fZmlyc3Q7ZTspZS5pbnZhbGlkYXRlKCksZT1lLl9uZXh0O3JldHVybiB0LnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyl9LG0uX2VuYWJsZWQ9ZnVuY3Rpb24odCxpKXtpZih0PT09dGhpcy5fZ2MpZm9yKHZhciBzPXRoaXMuX2ZpcnN0O3M7KXMuX2VuYWJsZWQodCwhMCkscz1zLl9uZXh0O3JldHVybiBlLnByb3RvdHlwZS5fZW5hYmxlZC5jYWxsKHRoaXMsdCxpKX0sbS50b3RhbFRpbWU9ZnVuY3Rpb24oKXt0aGlzLl9mb3JjaW5nUGxheWhlYWQ9ITA7dmFyIGU9dC5wcm90b3R5cGUudG90YWxUaW1lLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyZXR1cm4gdGhpcy5fZm9yY2luZ1BsYXloZWFkPSExLGV9LG0uZHVyYXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KDAhPT10aGlzLmR1cmF0aW9uKCkmJjAhPT10JiZ0aGlzLnRpbWVTY2FsZSh0aGlzLl9kdXJhdGlvbi90KSx0aGlzKToodGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpLHRoaXMuX2R1cmF0aW9uKX0sbS50b3RhbER1cmF0aW9uPWZ1bmN0aW9uKHQpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXtpZih0aGlzLl9kaXJ0eSl7Zm9yKHZhciBlLGkscz0wLHI9dGhpcy5fbGFzdCxuPTk5OTk5OTk5OTk5OTtyOyllPXIuX3ByZXYsci5fZGlydHkmJnIudG90YWxEdXJhdGlvbigpLHIuX3N0YXJ0VGltZT5uJiZ0aGlzLl9zb3J0Q2hpbGRyZW4mJiFyLl9wYXVzZWQ/dGhpcy5hZGQocixyLl9zdGFydFRpbWUtci5fZGVsYXkpOm49ci5fc3RhcnRUaW1lLDA+ci5fc3RhcnRUaW1lJiYhci5fcGF1c2VkJiYocy09ci5fc3RhcnRUaW1lLHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nJiYodGhpcy5fc3RhcnRUaW1lKz1yLl9zdGFydFRpbWUvdGhpcy5fdGltZVNjYWxlKSx0aGlzLnNoaWZ0Q2hpbGRyZW4oLXIuX3N0YXJ0VGltZSwhMSwtOTk5OTk5OTk5OSksbj0wKSxpPXIuX3N0YXJ0VGltZStyLl90b3RhbER1cmF0aW9uL3IuX3RpbWVTY2FsZSxpPnMmJihzPWkpLHI9ZTt0aGlzLl9kdXJhdGlvbj10aGlzLl90b3RhbER1cmF0aW9uPXMsdGhpcy5fZGlydHk9ITF9cmV0dXJuIHRoaXMuX3RvdGFsRHVyYXRpb259cmV0dXJuIDAhPT10aGlzLnRvdGFsRHVyYXRpb24oKSYmMCE9PXQmJnRoaXMudGltZVNjYWxlKHRoaXMuX3RvdGFsRHVyYXRpb24vdCksdGhpc30sbS51c2VzRnJhbWVzPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuX3RpbWVsaW5lO2UuX3RpbWVsaW5lOyllPWUuX3RpbWVsaW5lO3JldHVybiBlPT09dC5fcm9vdEZyYW1lc1RpbWVsaW5lfSxtLnJhd1RpbWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcGF1c2VkP3RoaXMuX3RvdGFsVGltZToodGhpcy5fdGltZWxpbmUucmF3VGltZSgpLXRoaXMuX3N0YXJ0VGltZSkqdGhpcy5fdGltZVNjYWxlfSxzfSwhMCksX2dzU2NvcGUuX2dzRGVmaW5lKFwiVGltZWxpbmVNYXhcIixbXCJUaW1lbGluZUxpdGVcIixcIlR3ZWVuTGl0ZVwiLFwiZWFzaW5nLkVhc2VcIl0sZnVuY3Rpb24odCxlLGkpe3ZhciBzPWZ1bmN0aW9uKGUpe3QuY2FsbCh0aGlzLGUpLHRoaXMuX3JlcGVhdD10aGlzLnZhcnMucmVwZWF0fHwwLHRoaXMuX3JlcGVhdERlbGF5PXRoaXMudmFycy5yZXBlYXREZWxheXx8MCx0aGlzLl9jeWNsZT0wLHRoaXMuX3lveW89dGhpcy52YXJzLnlveW89PT0hMCx0aGlzLl9kaXJ0eT0hMH0scj0xZS0xMCxuPVtdLGE9ZS5faW50ZXJuYWxzLG89YS5sYXp5VHdlZW5zLGg9YS5sYXp5UmVuZGVyLGw9bmV3IGkobnVsbCxudWxsLDEsMCksXz1zLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gXy5jb25zdHJ1Y3Rvcj1zLF8ua2lsbCgpLl9nYz0hMSxzLnZlcnNpb249XCIxLjE0LjFcIixfLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5feW95bz10aGlzLnZhcnMueW95bz09PSEwLHRoaXMuX3JlcGVhdD10aGlzLnZhcnMucmVwZWF0fHwwLHRoaXMuX3JlcGVhdERlbGF5PXRoaXMudmFycy5yZXBlYXREZWxheXx8MCx0aGlzLl91bmNhY2hlKCEwKSx0LnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyl9LF8uYWRkQ2FsbGJhY2s9ZnVuY3Rpb24odCxpLHMscil7cmV0dXJuIHRoaXMuYWRkKGUuZGVsYXllZENhbGwoMCx0LHMsciksaSl9LF8ucmVtb3ZlQ2FsbGJhY2s9ZnVuY3Rpb24odCxlKXtpZih0KWlmKG51bGw9PWUpdGhpcy5fa2lsbChudWxsLHQpO2Vsc2UgZm9yKHZhciBpPXRoaXMuZ2V0VHdlZW5zT2YodCwhMSkscz1pLmxlbmd0aCxyPXRoaXMuX3BhcnNlVGltZU9yTGFiZWwoZSk7LS1zPi0xOylpW3NdLl9zdGFydFRpbWU9PT1yJiZpW3NdLl9lbmFibGVkKCExLCExKTtyZXR1cm4gdGhpc30sXy50d2VlblRvPWZ1bmN0aW9uKHQsaSl7aT1pfHx7fTt2YXIgcyxyLGEsbz17ZWFzZTpsLG92ZXJ3cml0ZTppLmRlbGF5PzI6MSx1c2VGcmFtZXM6dGhpcy51c2VzRnJhbWVzKCksaW1tZWRpYXRlUmVuZGVyOiExfTtmb3IociBpbiBpKW9bcl09aVtyXTtyZXR1cm4gby50aW1lPXRoaXMuX3BhcnNlVGltZU9yTGFiZWwodCkscz1NYXRoLmFicyhOdW1iZXIoby50aW1lKS10aGlzLl90aW1lKS90aGlzLl90aW1lU2NhbGV8fC4wMDEsYT1uZXcgZSh0aGlzLHMsbyksby5vblN0YXJ0PWZ1bmN0aW9uKCl7YS50YXJnZXQucGF1c2VkKCEwKSxhLnZhcnMudGltZSE9PWEudGFyZ2V0LnRpbWUoKSYmcz09PWEuZHVyYXRpb24oKSYmYS5kdXJhdGlvbihNYXRoLmFicyhhLnZhcnMudGltZS1hLnRhcmdldC50aW1lKCkpL2EudGFyZ2V0Ll90aW1lU2NhbGUpLGkub25TdGFydCYmaS5vblN0YXJ0LmFwcGx5KGkub25TdGFydFNjb3BlfHxhLGkub25TdGFydFBhcmFtc3x8bil9LGF9LF8udHdlZW5Gcm9tVG89ZnVuY3Rpb24odCxlLGkpe2k9aXx8e30sdD10aGlzLl9wYXJzZVRpbWVPckxhYmVsKHQpLGkuc3RhcnRBdD17b25Db21wbGV0ZTp0aGlzLnNlZWssb25Db21wbGV0ZVBhcmFtczpbdF0sb25Db21wbGV0ZVNjb3BlOnRoaXN9LGkuaW1tZWRpYXRlUmVuZGVyPWkuaW1tZWRpYXRlUmVuZGVyIT09ITE7dmFyIHM9dGhpcy50d2VlblRvKGUsaSk7cmV0dXJuIHMuZHVyYXRpb24oTWF0aC5hYnMocy52YXJzLnRpbWUtdCkvdGhpcy5fdGltZVNjYWxlfHwuMDAxKX0sXy5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3RoaXMuX2djJiZ0aGlzLl9lbmFibGVkKCEwLCExKTt2YXIgcyxhLGwsXyx1LHAsYz10aGlzLl9kaXJ0eT90aGlzLnRvdGFsRHVyYXRpb24oKTp0aGlzLl90b3RhbER1cmF0aW9uLGY9dGhpcy5fZHVyYXRpb24sbT10aGlzLl90aW1lLGQ9dGhpcy5fdG90YWxUaW1lLGc9dGhpcy5fc3RhcnRUaW1lLHY9dGhpcy5fdGltZVNjYWxlLHk9dGhpcy5fcmF3UHJldlRpbWUsVD10aGlzLl9wYXVzZWQsdz10aGlzLl9jeWNsZTtpZih0Pj1jPyh0aGlzLl9sb2NrZWR8fCh0aGlzLl90b3RhbFRpbWU9Yyx0aGlzLl9jeWNsZT10aGlzLl9yZXBlYXQpLHRoaXMuX3JldmVyc2VkfHx0aGlzLl9oYXNQYXVzZWRDaGlsZCgpfHwoYT0hMCxfPVwib25Db21wbGV0ZVwiLDA9PT10aGlzLl9kdXJhdGlvbiYmKDA9PT10fHwwPnl8fHk9PT1yKSYmeSE9PXQmJnRoaXMuX2ZpcnN0JiYodT0hMCx5PnImJihfPVwib25SZXZlcnNlQ29tcGxldGVcIikpKSx0aGlzLl9yYXdQcmV2VGltZT10aGlzLl9kdXJhdGlvbnx8IWV8fHR8fHRoaXMuX3Jhd1ByZXZUaW1lPT09dD90OnIsdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT90aGlzLl90aW1lPXQ9MDoodGhpcy5fdGltZT1mLHQ9ZisxZS00KSk6MWUtNz50Pyh0aGlzLl9sb2NrZWR8fCh0aGlzLl90b3RhbFRpbWU9dGhpcy5fY3ljbGU9MCksdGhpcy5fdGltZT0wLCgwIT09bXx8MD09PWYmJnkhPT1yJiYoeT4wfHwwPnQmJnk+PTApJiYhdGhpcy5fbG9ja2VkKSYmKF89XCJvblJldmVyc2VDb21wbGV0ZVwiLGE9dGhpcy5fcmV2ZXJzZWQpLDA+dD8odGhpcy5fYWN0aXZlPSExLHk+PTAmJnRoaXMuX2ZpcnN0JiYodT0hMCksdGhpcy5fcmF3UHJldlRpbWU9dCk6KHRoaXMuX3Jhd1ByZXZUaW1lPWZ8fCFlfHx0fHx0aGlzLl9yYXdQcmV2VGltZT09PXQ/dDpyLHQ9MCx0aGlzLl9pbml0dGVkfHwodT0hMCkpKTooMD09PWYmJjA+eSYmKHU9ITApLHRoaXMuX3RpbWU9dGhpcy5fcmF3UHJldlRpbWU9dCx0aGlzLl9sb2NrZWR8fCh0aGlzLl90b3RhbFRpbWU9dCwwIT09dGhpcy5fcmVwZWF0JiYocD1mK3RoaXMuX3JlcGVhdERlbGF5LHRoaXMuX2N5Y2xlPXRoaXMuX3RvdGFsVGltZS9wPj4wLDAhPT10aGlzLl9jeWNsZSYmdGhpcy5fY3ljbGU9PT10aGlzLl90b3RhbFRpbWUvcCYmdGhpcy5fY3ljbGUtLSx0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZS10aGlzLl9jeWNsZSpwLHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSkmJih0aGlzLl90aW1lPWYtdGhpcy5fdGltZSksdGhpcy5fdGltZT5mPyh0aGlzLl90aW1lPWYsdD1mKzFlLTQpOjA+dGhpcy5fdGltZT90aGlzLl90aW1lPXQ9MDp0PXRoaXMuX3RpbWUpKSksdGhpcy5fY3ljbGUhPT13JiYhdGhpcy5fbG9ja2VkKXt2YXIgeD10aGlzLl95b3lvJiYwIT09KDEmdyksYj14PT09KHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSkpLFA9dGhpcy5fdG90YWxUaW1lLFM9dGhpcy5fY3ljbGUsaz10aGlzLl9yYXdQcmV2VGltZSxSPXRoaXMuX3RpbWU7aWYodGhpcy5fdG90YWxUaW1lPXcqZix3PnRoaXMuX2N5Y2xlP3g9IXg6dGhpcy5fdG90YWxUaW1lKz1mLHRoaXMuX3RpbWU9bSx0aGlzLl9yYXdQcmV2VGltZT0wPT09Zj95LTFlLTQ6eSx0aGlzLl9jeWNsZT13LHRoaXMuX2xvY2tlZD0hMCxtPXg/MDpmLHRoaXMucmVuZGVyKG0sZSwwPT09ZiksZXx8dGhpcy5fZ2N8fHRoaXMudmFycy5vblJlcGVhdCYmdGhpcy52YXJzLm9uUmVwZWF0LmFwcGx5KHRoaXMudmFycy5vblJlcGVhdFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblJlcGVhdFBhcmFtc3x8biksYiYmKG09eD9mKzFlLTQ6LTFlLTQsdGhpcy5yZW5kZXIobSwhMCwhMSkpLHRoaXMuX2xvY2tlZD0hMSx0aGlzLl9wYXVzZWQmJiFUKXJldHVybjt0aGlzLl90aW1lPVIsdGhpcy5fdG90YWxUaW1lPVAsdGhpcy5fY3ljbGU9Uyx0aGlzLl9yYXdQcmV2VGltZT1rfWlmKCEodGhpcy5fdGltZSE9PW0mJnRoaXMuX2ZpcnN0fHxpfHx1KSlyZXR1cm4gZCE9PXRoaXMuX3RvdGFsVGltZSYmdGhpcy5fb25VcGRhdGUmJihlfHx0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fG4pKSx2b2lkIDA7aWYodGhpcy5faW5pdHRlZHx8KHRoaXMuX2luaXR0ZWQ9ITApLHRoaXMuX2FjdGl2ZXx8IXRoaXMuX3BhdXNlZCYmdGhpcy5fdG90YWxUaW1lIT09ZCYmdD4wJiYodGhpcy5fYWN0aXZlPSEwKSwwPT09ZCYmdGhpcy52YXJzLm9uU3RhcnQmJjAhPT10aGlzLl90b3RhbFRpbWUmJihlfHx0aGlzLnZhcnMub25TdGFydC5hcHBseSh0aGlzLnZhcnMub25TdGFydFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblN0YXJ0UGFyYW1zfHxuKSksdGhpcy5fdGltZT49bSlmb3Iocz10aGlzLl9maXJzdDtzJiYobD1zLl9uZXh0LCF0aGlzLl9wYXVzZWR8fFQpOykocy5fYWN0aXZlfHxzLl9zdGFydFRpbWU8PXRoaXMuX3RpbWUmJiFzLl9wYXVzZWQmJiFzLl9nYykmJihzLl9yZXZlcnNlZD9zLnJlbmRlcigocy5fZGlydHk/cy50b3RhbER1cmF0aW9uKCk6cy5fdG90YWxEdXJhdGlvbiktKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKTpzLnJlbmRlcigodC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpKSxzPWw7ZWxzZSBmb3Iocz10aGlzLl9sYXN0O3MmJihsPXMuX3ByZXYsIXRoaXMuX3BhdXNlZHx8VCk7KShzLl9hY3RpdmV8fG0+PXMuX3N0YXJ0VGltZSYmIXMuX3BhdXNlZCYmIXMuX2djKSYmKHMuX3JldmVyc2VkP3MucmVuZGVyKChzLl9kaXJ0eT9zLnRvdGFsRHVyYXRpb24oKTpzLl90b3RhbER1cmF0aW9uKS0odC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpOnMucmVuZGVyKCh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSkpLHM9bDt0aGlzLl9vblVwZGF0ZSYmKGV8fChvLmxlbmd0aCYmaCgpLHRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8bikpKSxfJiYodGhpcy5fbG9ja2VkfHx0aGlzLl9nY3x8KGc9PT10aGlzLl9zdGFydFRpbWV8fHYhPT10aGlzLl90aW1lU2NhbGUpJiYoMD09PXRoaXMuX3RpbWV8fGM+PXRoaXMudG90YWxEdXJhdGlvbigpKSYmKGEmJihvLmxlbmd0aCYmaCgpLHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiYmdGhpcy5fZW5hYmxlZCghMSwhMSksdGhpcy5fYWN0aXZlPSExKSwhZSYmdGhpcy52YXJzW19dJiZ0aGlzLnZhcnNbX10uYXBwbHkodGhpcy52YXJzW18rXCJTY29wZVwiXXx8dGhpcyx0aGlzLnZhcnNbXytcIlBhcmFtc1wiXXx8bikpKX0sXy5nZXRBY3RpdmU9ZnVuY3Rpb24odCxlLGkpe251bGw9PXQmJih0PSEwKSxudWxsPT1lJiYoZT0hMCksbnVsbD09aSYmKGk9ITEpO3ZhciBzLHIsbj1bXSxhPXRoaXMuZ2V0Q2hpbGRyZW4odCxlLGkpLG89MCxoPWEubGVuZ3RoO2ZvcihzPTA7aD5zO3MrKylyPWFbc10sci5pc0FjdGl2ZSgpJiYobltvKytdPXIpO3JldHVybiBufSxfLmdldExhYmVsQWZ0ZXI9ZnVuY3Rpb24odCl7dHx8MCE9PXQmJih0PXRoaXMuX3RpbWUpO3ZhciBlLGk9dGhpcy5nZXRMYWJlbHNBcnJheSgpLHM9aS5sZW5ndGg7Zm9yKGU9MDtzPmU7ZSsrKWlmKGlbZV0udGltZT50KXJldHVybiBpW2VdLm5hbWU7cmV0dXJuIG51bGx9LF8uZ2V0TGFiZWxCZWZvcmU9ZnVuY3Rpb24odCl7bnVsbD09dCYmKHQ9dGhpcy5fdGltZSk7Zm9yKHZhciBlPXRoaXMuZ2V0TGFiZWxzQXJyYXkoKSxpPWUubGVuZ3RoOy0taT4tMTspaWYodD5lW2ldLnRpbWUpcmV0dXJuIGVbaV0ubmFtZTtyZXR1cm4gbnVsbH0sXy5nZXRMYWJlbHNBcnJheT1mdW5jdGlvbigpe3ZhciB0LGU9W10saT0wO2Zvcih0IGluIHRoaXMuX2xhYmVscyllW2krK109e3RpbWU6dGhpcy5fbGFiZWxzW3RdLG5hbWU6dH07cmV0dXJuIGUuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0LnRpbWUtZS50aW1lfSksZX0sXy5wcm9ncmVzcz1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMudG90YWxUaW1lKHRoaXMuZHVyYXRpb24oKSoodGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT8xLXQ6dCkrdGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KSxlKTp0aGlzLl90aW1lL3RoaXMuZHVyYXRpb24oKX0sXy50b3RhbFByb2dyZXNzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy50b3RhbER1cmF0aW9uKCkqdCxlKTp0aGlzLl90b3RhbFRpbWUvdGhpcy50b3RhbER1cmF0aW9uKCl9LF8udG90YWxEdXJhdGlvbj1mdW5jdGlvbihlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8tMT09PXRoaXMuX3JlcGVhdD90aGlzOnRoaXMuZHVyYXRpb24oKGUtdGhpcy5fcmVwZWF0KnRoaXMuX3JlcGVhdERlbGF5KS8odGhpcy5fcmVwZWF0KzEpKToodGhpcy5fZGlydHkmJih0LnByb3RvdHlwZS50b3RhbER1cmF0aW9uLmNhbGwodGhpcyksdGhpcy5fdG90YWxEdXJhdGlvbj0tMT09PXRoaXMuX3JlcGVhdD85OTk5OTk5OTk5OTk6dGhpcy5fZHVyYXRpb24qKHRoaXMuX3JlcGVhdCsxKSt0aGlzLl9yZXBlYXREZWxheSp0aGlzLl9yZXBlYXQpLHRoaXMuX3RvdGFsRHVyYXRpb24pfSxfLnRpbWU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpLHQ+dGhpcy5fZHVyYXRpb24mJih0PXRoaXMuX2R1cmF0aW9uKSx0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpP3Q9dGhpcy5fZHVyYXRpb24tdCt0aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpOjAhPT10aGlzLl9yZXBlYXQmJih0Kz10aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpKSx0aGlzLnRvdGFsVGltZSh0LGUpKTp0aGlzLl90aW1lfSxfLnJlcGVhdD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVwZWF0PXQsdGhpcy5fdW5jYWNoZSghMCkpOnRoaXMuX3JlcGVhdH0sXy5yZXBlYXREZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVwZWF0RGVsYXk9dCx0aGlzLl91bmNhY2hlKCEwKSk6dGhpcy5fcmVwZWF0RGVsYXl9LF8ueW95bz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5feW95bz10LHRoaXMpOnRoaXMuX3lveW99LF8uY3VycmVudExhYmVsPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMuc2Vlayh0LCEwKTp0aGlzLmdldExhYmVsQmVmb3JlKHRoaXMuX3RpbWUrMWUtOCl9LHN9LCEwKSxmdW5jdGlvbigpe3ZhciB0PTE4MC9NYXRoLlBJLGU9W10saT1bXSxzPVtdLHI9e30sbj1mdW5jdGlvbih0LGUsaSxzKXt0aGlzLmE9dCx0aGlzLmI9ZSx0aGlzLmM9aSx0aGlzLmQ9cyx0aGlzLmRhPXMtdCx0aGlzLmNhPWktdCx0aGlzLmJhPWUtdH0sYT1cIix4LHkseixsZWZ0LHRvcCxyaWdodCxib3R0b20sbWFyZ2luVG9wLG1hcmdpbkxlZnQsbWFyZ2luUmlnaHQsbWFyZ2luQm90dG9tLHBhZGRpbmdMZWZ0LHBhZGRpbmdUb3AscGFkZGluZ1JpZ2h0LHBhZGRpbmdCb3R0b20sYmFja2dyb3VuZFBvc2l0aW9uLGJhY2tncm91bmRQb3NpdGlvbl95LFwiLG89ZnVuY3Rpb24odCxlLGkscyl7dmFyIHI9e2E6dH0sbj17fSxhPXt9LG89e2M6c30saD0odCtlKS8yLGw9KGUraSkvMixfPShpK3MpLzIsdT0oaCtsKS8yLHA9KGwrXykvMixjPShwLXUpLzg7cmV0dXJuIHIuYj1oKyh0LWgpLzQsbi5iPXUrYyxyLmM9bi5hPShyLmIrbi5iKS8yLG4uYz1hLmE9KHUrcCkvMixhLmI9cC1jLG8uYj1fKyhzLV8pLzQsYS5jPW8uYT0oYS5iK28uYikvMixbcixuLGEsb119LGg9ZnVuY3Rpb24odCxyLG4sYSxoKXt2YXIgbCxfLHUscCxjLGYsbSxkLGcsdix5LFQsdyx4PXQubGVuZ3RoLTEsYj0wLFA9dFswXS5hO2ZvcihsPTA7eD5sO2wrKyljPXRbYl0sXz1jLmEsdT1jLmQscD10W2IrMV0uZCxoPyh5PWVbbF0sVD1pW2xdLHc9LjI1KihUK3kpKnIvKGE/LjU6c1tsXXx8LjUpLGY9dS0odS1fKSooYT8uNSpyOjAhPT15P3cveTowKSxtPXUrKHAtdSkqKGE/LjUqcjowIT09VD93L1Q6MCksZD11LShmKygobS1mKSooMyp5Lyh5K1QpKy41KS80fHwwKSkpOihmPXUtLjUqKHUtXykqcixtPXUrLjUqKHAtdSkqcixkPXUtKGYrbSkvMiksZis9ZCxtKz1kLGMuYz1nPWYsYy5iPTAhPT1sP1A6UD1jLmErLjYqKGMuYy1jLmEpLGMuZGE9dS1fLGMuY2E9Zy1fLGMuYmE9UC1fLG4/KHY9byhfLFAsZyx1KSx0LnNwbGljZShiLDEsdlswXSx2WzFdLHZbMl0sdlszXSksYis9NCk6YisrLFA9bTtjPXRbYl0sYy5iPVAsYy5jPVArLjQqKGMuZC1QKSxjLmRhPWMuZC1jLmEsYy5jYT1jLmMtYy5hLGMuYmE9UC1jLmEsbiYmKHY9byhjLmEsUCxjLmMsYy5kKSx0LnNwbGljZShiLDEsdlswXSx2WzFdLHZbMl0sdlszXSkpfSxsPWZ1bmN0aW9uKHQscyxyLGEpe3ZhciBvLGgsbCxfLHUscCxjPVtdO2lmKGEpZm9yKHQ9W2FdLmNvbmNhdCh0KSxoPXQubGVuZ3RoOy0taD4tMTspXCJzdHJpbmdcIj09dHlwZW9mKHA9dFtoXVtzXSkmJlwiPVwiPT09cC5jaGFyQXQoMSkmJih0W2hdW3NdPWFbc10rTnVtYmVyKHAuY2hhckF0KDApK3Auc3Vic3RyKDIpKSk7aWYobz10Lmxlbmd0aC0yLDA+bylyZXR1cm4gY1swXT1uZXcgbih0WzBdW3NdLDAsMCx0Wy0xPm8/MDoxXVtzXSksYztmb3IoaD0wO28+aDtoKyspbD10W2hdW3NdLF89dFtoKzFdW3NdLGNbaF09bmV3IG4obCwwLDAsXyksciYmKHU9dFtoKzJdW3NdLGVbaF09KGVbaF18fDApKyhfLWwpKihfLWwpLGlbaF09KGlbaF18fDApKyh1LV8pKih1LV8pKTtyZXR1cm4gY1toXT1uZXcgbih0W2hdW3NdLDAsMCx0W2grMV1bc10pLGN9LF89ZnVuY3Rpb24odCxuLG8sXyx1LHApe3ZhciBjLGYsbSxkLGcsdix5LFQsdz17fSx4PVtdLGI9cHx8dFswXTt1PVwic3RyaW5nXCI9PXR5cGVvZiB1P1wiLFwiK3UrXCIsXCI6YSxudWxsPT1uJiYobj0xKTtmb3IoZiBpbiB0WzBdKXgucHVzaChmKTtpZih0Lmxlbmd0aD4xKXtmb3IoVD10W3QubGVuZ3RoLTFdLHk9ITAsYz14Lmxlbmd0aDstLWM+LTE7KWlmKGY9eFtjXSxNYXRoLmFicyhiW2ZdLVRbZl0pPi4wNSl7eT0hMTticmVha315JiYodD10LmNvbmNhdCgpLHAmJnQudW5zaGlmdChwKSx0LnB1c2godFsxXSkscD10W3QubGVuZ3RoLTNdKX1mb3IoZS5sZW5ndGg9aS5sZW5ndGg9cy5sZW5ndGg9MCxjPXgubGVuZ3RoOy0tYz4tMTspZj14W2NdLHJbZl09LTEhPT11LmluZGV4T2YoXCIsXCIrZitcIixcIiksd1tmXT1sKHQsZixyW2ZdLHApO2ZvcihjPWUubGVuZ3RoOy0tYz4tMTspZVtjXT1NYXRoLnNxcnQoZVtjXSksaVtjXT1NYXRoLnNxcnQoaVtjXSk7aWYoIV8pe2ZvcihjPXgubGVuZ3RoOy0tYz4tMTspaWYocltmXSlmb3IobT13W3hbY11dLHY9bS5sZW5ndGgtMSxkPTA7dj5kO2QrKylnPW1bZCsxXS5kYS9pW2RdK21bZF0uZGEvZVtkXSxzW2RdPShzW2RdfHwwKStnKmc7Zm9yKGM9cy5sZW5ndGg7LS1jPi0xOylzW2NdPU1hdGguc3FydChzW2NdKX1mb3IoYz14Lmxlbmd0aCxkPW8/NDoxOy0tYz4tMTspZj14W2NdLG09d1tmXSxoKG0sbixvLF8scltmXSkseSYmKG0uc3BsaWNlKDAsZCksbS5zcGxpY2UobS5sZW5ndGgtZCxkKSk7cmV0dXJuIHd9LHU9ZnVuY3Rpb24odCxlLGkpe2U9ZXx8XCJzb2Z0XCI7dmFyIHMscixhLG8saCxsLF8sdSxwLGMsZixtPXt9LGQ9XCJjdWJpY1wiPT09ZT8zOjIsZz1cInNvZnRcIj09PWUsdj1bXTtpZihnJiZpJiYodD1baV0uY29uY2F0KHQpKSxudWxsPT10fHxkKzE+dC5sZW5ndGgpdGhyb3dcImludmFsaWQgQmV6aWVyIGRhdGFcIjtmb3IocCBpbiB0WzBdKXYucHVzaChwKTtmb3IobD12Lmxlbmd0aDstLWw+LTE7KXtmb3IocD12W2xdLG1bcF09aD1bXSxjPTAsdT10Lmxlbmd0aCxfPTA7dT5fO18rKylzPW51bGw9PWk/dFtfXVtwXTpcInN0cmluZ1wiPT10eXBlb2YoZj10W19dW3BdKSYmXCI9XCI9PT1mLmNoYXJBdCgxKT9pW3BdK051bWJlcihmLmNoYXJBdCgwKStmLnN1YnN0cigyKSk6TnVtYmVyKGYpLGcmJl8+MSYmdS0xPl8mJihoW2MrK109KHMraFtjLTJdKS8yKSxoW2MrK109cztmb3IodT1jLWQrMSxjPTAsXz0wO3U+XztfKz1kKXM9aFtfXSxyPWhbXysxXSxhPWhbXysyXSxvPTI9PT1kPzA6aFtfKzNdLGhbYysrXT1mPTM9PT1kP25ldyBuKHMscixhLG8pOm5ldyBuKHMsKDIqcitzKS8zLCgyKnIrYSkvMyxhKTtoLmxlbmd0aD1jfXJldHVybiBtfSxwPWZ1bmN0aW9uKHQsZSxpKXtmb3IodmFyIHMscixuLGEsbyxoLGwsXyx1LHAsYyxmPTEvaSxtPXQubGVuZ3RoOy0tbT4tMTspZm9yKHA9dFttXSxuPXAuYSxhPXAuZC1uLG89cC5jLW4saD1wLmItbixzPXI9MCxfPTE7aT49XztfKyspbD1mKl8sdT0xLWwscz1yLShyPShsKmwqYSszKnUqKGwqbyt1KmgpKSpsKSxjPW0qaStfLTEsZVtjXT0oZVtjXXx8MCkrcypzfSxjPWZ1bmN0aW9uKHQsZSl7ZT1lPj4wfHw2O3ZhciBpLHMscixuLGE9W10sbz1bXSxoPTAsbD0wLF89ZS0xLHU9W10sYz1bXTtmb3IoaSBpbiB0KXAodFtpXSxhLGUpO2ZvcihyPWEubGVuZ3RoLHM9MDtyPnM7cysrKWgrPU1hdGguc3FydChhW3NdKSxuPXMlZSxjW25dPWgsbj09PV8mJihsKz1oLG49cy9lPj4wLHVbbl09YyxvW25dPWwsaD0wLGM9W10pO3JldHVybntsZW5ndGg6bCxsZW5ndGhzOm8sc2VnbWVudHM6dX19LGY9X2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7cHJvcE5hbWU6XCJiZXppZXJcIixwcmlvcml0eTotMSx2ZXJzaW9uOlwiMS4zLjNcIixBUEk6MixnbG9iYWw6ITAsaW5pdDpmdW5jdGlvbih0LGUsaSl7dGhpcy5fdGFyZ2V0PXQsZSBpbnN0YW5jZW9mIEFycmF5JiYoZT17dmFsdWVzOmV9KSx0aGlzLl9mdW5jPXt9LHRoaXMuX3JvdW5kPXt9LHRoaXMuX3Byb3BzPVtdLHRoaXMuX3RpbWVSZXM9bnVsbD09ZS50aW1lUmVzb2x1dGlvbj82OnBhcnNlSW50KGUudGltZVJlc29sdXRpb24sMTApO3ZhciBzLHIsbixhLG8saD1lLnZhbHVlc3x8W10sbD17fSxwPWhbMF0sZj1lLmF1dG9Sb3RhdGV8fGkudmFycy5vcmllbnRUb0Jlemllcjt0aGlzLl9hdXRvUm90YXRlPWY/ZiBpbnN0YW5jZW9mIEFycmF5P2Y6W1tcInhcIixcInlcIixcInJvdGF0aW9uXCIsZj09PSEwPzA6TnVtYmVyKGYpfHwwXV06bnVsbDtmb3IocyBpbiBwKXRoaXMuX3Byb3BzLnB1c2gocyk7Zm9yKG49dGhpcy5fcHJvcHMubGVuZ3RoOy0tbj4tMTspcz10aGlzLl9wcm9wc1tuXSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHMpLHI9dGhpcy5fZnVuY1tzXT1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0W3NdLGxbc109cj90W3MuaW5kZXhPZihcInNldFwiKXx8XCJmdW5jdGlvblwiIT10eXBlb2YgdFtcImdldFwiK3Muc3Vic3RyKDMpXT9zOlwiZ2V0XCIrcy5zdWJzdHIoMyldKCk6cGFyc2VGbG9hdCh0W3NdKSxvfHxsW3NdIT09aFswXVtzXSYmKG89bCk7aWYodGhpcy5fYmV6aWVycz1cImN1YmljXCIhPT1lLnR5cGUmJlwicXVhZHJhdGljXCIhPT1lLnR5cGUmJlwic29mdFwiIT09ZS50eXBlP18oaCxpc05hTihlLmN1cnZpbmVzcyk/MTplLmN1cnZpbmVzcywhMSxcInRocnVCYXNpY1wiPT09ZS50eXBlLGUuY29ycmVsYXRlLG8pOnUoaCxlLnR5cGUsbCksdGhpcy5fc2VnQ291bnQ9dGhpcy5fYmV6aWVyc1tzXS5sZW5ndGgsdGhpcy5fdGltZVJlcyl7dmFyIG09Yyh0aGlzLl9iZXppZXJzLHRoaXMuX3RpbWVSZXMpO3RoaXMuX2xlbmd0aD1tLmxlbmd0aCx0aGlzLl9sZW5ndGhzPW0ubGVuZ3Rocyx0aGlzLl9zZWdtZW50cz1tLnNlZ21lbnRzLHRoaXMuX2wxPXRoaXMuX2xpPXRoaXMuX3MxPXRoaXMuX3NpPTAsdGhpcy5fbDI9dGhpcy5fbGVuZ3Roc1swXSx0aGlzLl9jdXJTZWc9dGhpcy5fc2VnbWVudHNbMF0sdGhpcy5fczI9dGhpcy5fY3VyU2VnWzBdLHRoaXMuX3ByZWM9MS90aGlzLl9jdXJTZWcubGVuZ3RofWlmKGY9dGhpcy5fYXV0b1JvdGF0ZSlmb3IodGhpcy5faW5pdGlhbFJvdGF0aW9ucz1bXSxmWzBdaW5zdGFuY2VvZiBBcnJheXx8KHRoaXMuX2F1dG9Sb3RhdGU9Zj1bZl0pLG49Zi5sZW5ndGg7LS1uPi0xOyl7Zm9yKGE9MDszPmE7YSsrKXM9ZltuXVthXSx0aGlzLl9mdW5jW3NdPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRbc10/dFtzLmluZGV4T2YoXCJzZXRcIil8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRbXCJnZXRcIitzLnN1YnN0cigzKV0/czpcImdldFwiK3Muc3Vic3RyKDMpXTohMTtzPWZbbl1bMl0sdGhpcy5faW5pdGlhbFJvdGF0aW9uc1tuXT10aGlzLl9mdW5jW3NdP3RoaXMuX2Z1bmNbc10uY2FsbCh0aGlzLl90YXJnZXQpOnRoaXMuX3RhcmdldFtzXX1yZXR1cm4gdGhpcy5fc3RhcnRSYXRpbz1pLnZhcnMucnVuQmFja3dhcmRzPzE6MCwhMH0sc2V0OmZ1bmN0aW9uKGUpe3ZhciBpLHMscixuLGEsbyxoLGwsXyx1LHA9dGhpcy5fc2VnQ291bnQsYz10aGlzLl9mdW5jLGY9dGhpcy5fdGFyZ2V0LG09ZSE9PXRoaXMuX3N0YXJ0UmF0aW87aWYodGhpcy5fdGltZVJlcyl7aWYoXz10aGlzLl9sZW5ndGhzLHU9dGhpcy5fY3VyU2VnLGUqPXRoaXMuX2xlbmd0aCxyPXRoaXMuX2xpLGU+dGhpcy5fbDImJnAtMT5yKXtmb3IobD1wLTE7bD5yJiZlPj0odGhpcy5fbDI9X1srK3JdKTspO3RoaXMuX2wxPV9bci0xXSx0aGlzLl9saT1yLHRoaXMuX2N1clNlZz11PXRoaXMuX3NlZ21lbnRzW3JdLHRoaXMuX3MyPXVbdGhpcy5fczE9dGhpcy5fc2k9MF19ZWxzZSBpZih0aGlzLl9sMT5lJiZyPjApe2Zvcig7cj4wJiYodGhpcy5fbDE9X1stLXJdKT49ZTspOzA9PT1yJiZ0aGlzLl9sMT5lP3RoaXMuX2wxPTA6cisrLHRoaXMuX2wyPV9bcl0sdGhpcy5fbGk9cix0aGlzLl9jdXJTZWc9dT10aGlzLl9zZWdtZW50c1tyXSx0aGlzLl9zMT11Wyh0aGlzLl9zaT11Lmxlbmd0aC0xKS0xXXx8MCx0aGlzLl9zMj11W3RoaXMuX3NpXX1pZihpPXIsZS09dGhpcy5fbDEscj10aGlzLl9zaSxlPnRoaXMuX3MyJiZ1Lmxlbmd0aC0xPnIpe2ZvcihsPXUubGVuZ3RoLTE7bD5yJiZlPj0odGhpcy5fczI9dVsrK3JdKTspO3RoaXMuX3MxPXVbci0xXSx0aGlzLl9zaT1yfWVsc2UgaWYodGhpcy5fczE+ZSYmcj4wKXtmb3IoO3I+MCYmKHRoaXMuX3MxPXVbLS1yXSk+PWU7KTswPT09ciYmdGhpcy5fczE+ZT90aGlzLl9zMT0wOnIrKyx0aGlzLl9zMj11W3JdLHRoaXMuX3NpPXJcbn1vPShyKyhlLXRoaXMuX3MxKS8odGhpcy5fczItdGhpcy5fczEpKSp0aGlzLl9wcmVjfWVsc2UgaT0wPmU/MDplPj0xP3AtMTpwKmU+PjAsbz0oZS1pKigxL3ApKSpwO2ZvcihzPTEtbyxyPXRoaXMuX3Byb3BzLmxlbmd0aDstLXI+LTE7KW49dGhpcy5fcHJvcHNbcl0sYT10aGlzLl9iZXppZXJzW25dW2ldLGg9KG8qbyphLmRhKzMqcyoobyphLmNhK3MqYS5iYSkpKm8rYS5hLHRoaXMuX3JvdW5kW25dJiYoaD1NYXRoLnJvdW5kKGgpKSxjW25dP2Zbbl0oaCk6ZltuXT1oO2lmKHRoaXMuX2F1dG9Sb3RhdGUpe3ZhciBkLGcsdix5LFQsdyx4LGI9dGhpcy5fYXV0b1JvdGF0ZTtmb3Iocj1iLmxlbmd0aDstLXI+LTE7KW49YltyXVsyXSx3PWJbcl1bM118fDAseD1iW3JdWzRdPT09ITA/MTp0LGE9dGhpcy5fYmV6aWVyc1tiW3JdWzBdXSxkPXRoaXMuX2JlemllcnNbYltyXVsxXV0sYSYmZCYmKGE9YVtpXSxkPWRbaV0sZz1hLmErKGEuYi1hLmEpKm8seT1hLmIrKGEuYy1hLmIpKm8sZys9KHktZykqbyx5Kz0oYS5jKyhhLmQtYS5jKSpvLXkpKm8sdj1kLmErKGQuYi1kLmEpKm8sVD1kLmIrKGQuYy1kLmIpKm8sdis9KFQtdikqbyxUKz0oZC5jKyhkLmQtZC5jKSpvLVQpKm8saD1tP01hdGguYXRhbjIoVC12LHktZykqeCt3OnRoaXMuX2luaXRpYWxSb3RhdGlvbnNbcl0sY1tuXT9mW25dKGgpOmZbbl09aCl9fX0pLG09Zi5wcm90b3R5cGU7Zi5iZXppZXJUaHJvdWdoPV8sZi5jdWJpY1RvUXVhZHJhdGljPW8sZi5fYXV0b0NTUz0hMCxmLnF1YWRyYXRpY1RvQ3ViaWM9ZnVuY3Rpb24odCxlLGkpe3JldHVybiBuZXcgbih0LCgyKmUrdCkvMywoMiplK2kpLzMsaSl9LGYuX2Nzc1JlZ2lzdGVyPWZ1bmN0aW9uKCl7dmFyIHQ9X2dzU2NvcGUuX2dzRGVmaW5lLmdsb2JhbHMuQ1NTUGx1Z2luO2lmKHQpe3ZhciBlPXQuX2ludGVybmFscyxpPWUuX3BhcnNlVG9Qcm94eSxzPWUuX3NldFBsdWdpblJhdGlvLHI9ZS5DU1NQcm9wVHdlZW47ZS5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiZXppZXJcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxuLGEsbyxoKXtlIGluc3RhbmNlb2YgQXJyYXkmJihlPXt2YWx1ZXM6ZX0pLGg9bmV3IGY7dmFyIGwsXyx1LHA9ZS52YWx1ZXMsYz1wLmxlbmd0aC0xLG09W10sZD17fTtpZigwPmMpcmV0dXJuIG87Zm9yKGw9MDtjPj1sO2wrKyl1PWkodCxwW2xdLGEsbyxoLGMhPT1sKSxtW2xdPXUuZW5kO2ZvcihfIGluIGUpZFtfXT1lW19dO3JldHVybiBkLnZhbHVlcz1tLG89bmV3IHIodCxcImJlemllclwiLDAsMCx1LnB0LDIpLG8uZGF0YT11LG8ucGx1Z2luPWgsby5zZXRSYXRpbz1zLDA9PT1kLmF1dG9Sb3RhdGUmJihkLmF1dG9Sb3RhdGU9ITApLCFkLmF1dG9Sb3RhdGV8fGQuYXV0b1JvdGF0ZSBpbnN0YW5jZW9mIEFycmF5fHwobD1kLmF1dG9Sb3RhdGU9PT0hMD8wOk51bWJlcihkLmF1dG9Sb3RhdGUpLGQuYXV0b1JvdGF0ZT1udWxsIT11LmVuZC5sZWZ0P1tbXCJsZWZ0XCIsXCJ0b3BcIixcInJvdGF0aW9uXCIsbCwhMV1dOm51bGwhPXUuZW5kLng/W1tcInhcIixcInlcIixcInJvdGF0aW9uXCIsbCwhMV1dOiExKSxkLmF1dG9Sb3RhdGUmJihhLl90cmFuc2Zvcm18fGEuX2VuYWJsZVRyYW5zZm9ybXMoITEpLHUuYXV0b1JvdGF0ZT1hLl90YXJnZXQuX2dzVHJhbnNmb3JtKSxoLl9vbkluaXRUd2Vlbih1LnByb3h5LGQsYS5fdHdlZW4pLG99fSl9fSxtLl9yb3VuZFByb3BzPWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBpPXRoaXMuX292ZXJ3cml0ZVByb3BzLHM9aS5sZW5ndGg7LS1zPi0xOykodFtpW3NdXXx8dC5iZXppZXJ8fHQuYmV6aWVyVGhyb3VnaCkmJih0aGlzLl9yb3VuZFtpW3NdXT1lKX0sbS5fa2lsbD1mdW5jdGlvbih0KXt2YXIgZSxpLHM9dGhpcy5fcHJvcHM7Zm9yKGUgaW4gdGhpcy5fYmV6aWVycylpZihlIGluIHQpZm9yKGRlbGV0ZSB0aGlzLl9iZXppZXJzW2VdLGRlbGV0ZSB0aGlzLl9mdW5jW2VdLGk9cy5sZW5ndGg7LS1pPi0xOylzW2ldPT09ZSYmcy5zcGxpY2UoaSwxKTtyZXR1cm4gdGhpcy5fc3VwZXIuX2tpbGwuY2FsbCh0aGlzLHQpfX0oKSxfZ3NTY29wZS5fZ3NEZWZpbmUoXCJwbHVnaW5zLkNTU1BsdWdpblwiLFtcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixcIlR3ZWVuTGl0ZVwiXSxmdW5jdGlvbih0LGUpe3ZhciBpLHMscixuLGE9ZnVuY3Rpb24oKXt0LmNhbGwodGhpcyxcImNzc1wiKSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5sZW5ndGg9MCx0aGlzLnNldFJhdGlvPWEucHJvdG90eXBlLnNldFJhdGlvfSxvPXt9LGg9YS5wcm90b3R5cGU9bmV3IHQoXCJjc3NcIik7aC5jb25zdHJ1Y3Rvcj1hLGEudmVyc2lvbj1cIjEuMTQuMVwiLGEuQVBJPTIsYS5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmU9MCxhLmRlZmF1bHRTa2V3VHlwZT1cImNvbXBlbnNhdGVkXCIsaD1cInB4XCIsYS5zdWZmaXhNYXA9e3RvcDpoLHJpZ2h0OmgsYm90dG9tOmgsbGVmdDpoLHdpZHRoOmgsaGVpZ2h0OmgsZm9udFNpemU6aCxwYWRkaW5nOmgsbWFyZ2luOmgscGVyc3BlY3RpdmU6aCxsaW5lSGVpZ2h0OlwiXCJ9O3ZhciBsLF8sdSxwLGMsZixtPS8oPzpcXGR8XFwtXFxkfFxcLlxcZHxcXC1cXC5cXGQpKy9nLGQ9Lyg/OlxcZHxcXC1cXGR8XFwuXFxkfFxcLVxcLlxcZHxcXCs9XFxkfFxcLT1cXGR8XFwrPS5cXGR8XFwtPVxcLlxcZCkrL2csZz0vKD86XFwrPXxcXC09fFxcLXxcXGIpW1xcZFxcLVxcLl0rW2EtekEtWjAtOV0qKD86JXxcXGIpL2dpLHY9L1teXFxkXFwtXFwuXS9nLHk9Lyg/OlxcZHxcXC18XFwrfD18I3xcXC4pKi9nLFQ9L29wYWNpdHkgKj0gKihbXildKikvaSx3PS9vcGFjaXR5OihbXjtdKikvaSx4PS9hbHBoYVxcKG9wYWNpdHkgKj0uKz9cXCkvaSxiPS9eKHJnYnxoc2wpLyxQPS8oW0EtWl0pL2csUz0vLShbYS16XSkvZ2ksaz0vKF4oPzp1cmxcXChcXFwifHVybFxcKCkpfCg/OihcXFwiXFwpKSR8XFwpJCkvZ2ksUj1mdW5jdGlvbih0LGUpe3JldHVybiBlLnRvVXBwZXJDYXNlKCl9LEE9Lyg/OkxlZnR8UmlnaHR8V2lkdGgpL2ksTz0vKE0xMXxNMTJ8TTIxfE0yMik9W1xcZFxcLVxcLmVdKy9naSxDPS9wcm9naWRcXDpEWEltYWdlVHJhbnNmb3JtXFwuTWljcm9zb2Z0XFwuTWF0cml4XFwoLis/XFwpL2ksRD0vLCg/PVteXFwpXSooPzpcXCh8JCkpL2dpLE09TWF0aC5QSS8xODAsej0xODAvTWF0aC5QSSxJPXt9LEU9ZG9jdW1lbnQsRj0oRS5kb2N1bWVudEVsZW1lbnQsRS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxMPUUuY3JlYXRlRWxlbWVudChcImltZ1wiKSxOPWEuX2ludGVybmFscz17X3NwZWNpYWxQcm9wczpvfSxYPW5hdmlnYXRvci51c2VyQWdlbnQsVT1mdW5jdGlvbigpe3ZhciB0LGU9WC5pbmRleE9mKFwiQW5kcm9pZFwiKSxpPUUuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gdT0tMSE9PVguaW5kZXhPZihcIlNhZmFyaVwiKSYmLTE9PT1YLmluZGV4T2YoXCJDaHJvbWVcIikmJigtMT09PWV8fE51bWJlcihYLnN1YnN0cihlKzgsMSkpPjMpLGM9dSYmNj5OdW1iZXIoWC5zdWJzdHIoWC5pbmRleE9mKFwiVmVyc2lvbi9cIikrOCwxKSkscD0tMSE9PVguaW5kZXhPZihcIkZpcmVmb3hcIiksKC9NU0lFIChbMC05XXsxLH1bXFwuMC05XXswLH0pLy5leGVjKFgpfHwvVHJpZGVudFxcLy4qcnY6KFswLTldezEsfVtcXC4wLTldezAsfSkvLmV4ZWMoWCkpJiYoZj1wYXJzZUZsb2F0KFJlZ0V4cC4kMSkpLGkuaW5uZXJIVE1MPVwiPGEgc3R5bGU9J3RvcDoxcHg7b3BhY2l0eTouNTU7Jz5hPC9hPlwiLHQ9aS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0sdD8vXjAuNTUvLnRlc3QodC5zdHlsZS5vcGFjaXR5KTohMX0oKSxZPWZ1bmN0aW9uKHQpe3JldHVybiBULnRlc3QoXCJzdHJpbmdcIj09dHlwZW9mIHQ/dDoodC5jdXJyZW50U3R5bGU/dC5jdXJyZW50U3R5bGUuZmlsdGVyOnQuc3R5bGUuZmlsdGVyKXx8XCJcIik/cGFyc2VGbG9hdChSZWdFeHAuJDEpLzEwMDoxfSxqPWZ1bmN0aW9uKHQpe3dpbmRvdy5jb25zb2xlJiZjb25zb2xlLmxvZyh0KX0sQj1cIlwiLHE9XCJcIixWPWZ1bmN0aW9uKHQsZSl7ZT1lfHxGO3ZhciBpLHMscj1lLnN0eWxlO2lmKHZvaWQgMCE9PXJbdF0pcmV0dXJuIHQ7Zm9yKHQ9dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSt0LnN1YnN0cigxKSxpPVtcIk9cIixcIk1velwiLFwibXNcIixcIk1zXCIsXCJXZWJraXRcIl0scz01Oy0tcz4tMSYmdm9pZCAwPT09cltpW3NdK3RdOyk7cmV0dXJuIHM+PTA/KHE9Mz09PXM/XCJtc1wiOmlbc10sQj1cIi1cIitxLnRvTG93ZXJDYXNlKCkrXCItXCIscSt0KTpudWxsfSxHPUUuZGVmYXVsdFZpZXc/RS5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlOmZ1bmN0aW9uKCl7fSxXPWEuZ2V0U3R5bGU9ZnVuY3Rpb24odCxlLGkscyxyKXt2YXIgbjtyZXR1cm4gVXx8XCJvcGFjaXR5XCIhPT1lPyghcyYmdC5zdHlsZVtlXT9uPXQuc3R5bGVbZV06KGk9aXx8Ryh0KSk/bj1pW2VdfHxpLmdldFByb3BlcnR5VmFsdWUoZSl8fGkuZ2V0UHJvcGVydHlWYWx1ZShlLnJlcGxhY2UoUCxcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTp0LmN1cnJlbnRTdHlsZSYmKG49dC5jdXJyZW50U3R5bGVbZV0pLG51bGw9PXJ8fG4mJlwibm9uZVwiIT09biYmXCJhdXRvXCIhPT1uJiZcImF1dG8gYXV0b1wiIT09bj9uOnIpOlkodCl9LFE9Ti5jb252ZXJ0VG9QaXhlbHM9ZnVuY3Rpb24odCxpLHMscixuKXtpZihcInB4XCI9PT1yfHwhcilyZXR1cm4gcztpZihcImF1dG9cIj09PXJ8fCFzKXJldHVybiAwO3ZhciBvLGgsbCxfPUEudGVzdChpKSx1PXQscD1GLnN0eWxlLGM9MD5zO2lmKGMmJihzPS1zKSxcIiVcIj09PXImJi0xIT09aS5pbmRleE9mKFwiYm9yZGVyXCIpKW89cy8xMDAqKF8/dC5jbGllbnRXaWR0aDp0LmNsaWVudEhlaWdodCk7ZWxzZXtpZihwLmNzc1RleHQ9XCJib3JkZXI6MCBzb2xpZCByZWQ7cG9zaXRpb246XCIrVyh0LFwicG9zaXRpb25cIikrXCI7bGluZS1oZWlnaHQ6MDtcIixcIiVcIiE9PXImJnUuYXBwZW5kQ2hpbGQpcFtfP1wiYm9yZGVyTGVmdFdpZHRoXCI6XCJib3JkZXJUb3BXaWR0aFwiXT1zK3I7ZWxzZXtpZih1PXQucGFyZW50Tm9kZXx8RS5ib2R5LGg9dS5fZ3NDYWNoZSxsPWUudGlja2VyLmZyYW1lLGgmJl8mJmgudGltZT09PWwpcmV0dXJuIGgud2lkdGgqcy8xMDA7cFtfP1wid2lkdGhcIjpcImhlaWdodFwiXT1zK3J9dS5hcHBlbmRDaGlsZChGKSxvPXBhcnNlRmxvYXQoRltfP1wib2Zmc2V0V2lkdGhcIjpcIm9mZnNldEhlaWdodFwiXSksdS5yZW1vdmVDaGlsZChGKSxfJiZcIiVcIj09PXImJmEuY2FjaGVXaWR0aHMhPT0hMSYmKGg9dS5fZ3NDYWNoZT11Ll9nc0NhY2hlfHx7fSxoLnRpbWU9bCxoLndpZHRoPTEwMCooby9zKSksMCE9PW98fG58fChvPVEodCxpLHMsciwhMCkpfXJldHVybiBjPy1vOm99LFo9Ti5jYWxjdWxhdGVPZmZzZXQ9ZnVuY3Rpb24odCxlLGkpe2lmKFwiYWJzb2x1dGVcIiE9PVcodCxcInBvc2l0aW9uXCIsaSkpcmV0dXJuIDA7dmFyIHM9XCJsZWZ0XCI9PT1lP1wiTGVmdFwiOlwiVG9wXCIscj1XKHQsXCJtYXJnaW5cIitzLGkpO3JldHVybiB0W1wib2Zmc2V0XCIrc10tKFEodCxlLHBhcnNlRmxvYXQociksci5yZXBsYWNlKHksXCJcIikpfHwwKX0sJD1mdW5jdGlvbih0LGUpe3ZhciBpLHMscj17fTtpZihlPWV8fEcodCxudWxsKSlpZihpPWUubGVuZ3RoKWZvcig7LS1pPi0xOylyW2VbaV0ucmVwbGFjZShTLFIpXT1lLmdldFByb3BlcnR5VmFsdWUoZVtpXSk7ZWxzZSBmb3IoaSBpbiBlKXJbaV09ZVtpXTtlbHNlIGlmKGU9dC5jdXJyZW50U3R5bGV8fHQuc3R5bGUpZm9yKGkgaW4gZSlcInN0cmluZ1wiPT10eXBlb2YgaSYmdm9pZCAwPT09cltpXSYmKHJbaS5yZXBsYWNlKFMsUildPWVbaV0pO3JldHVybiBVfHwoci5vcGFjaXR5PVkodCkpLHM9UmUodCxlLCExKSxyLnJvdGF0aW9uPXMucm90YXRpb24sci5za2V3WD1zLnNrZXdYLHIuc2NhbGVYPXMuc2NhbGVYLHIuc2NhbGVZPXMuc2NhbGVZLHIueD1zLngsci55PXMueSx4ZSYmKHIuej1zLnosci5yb3RhdGlvblg9cy5yb3RhdGlvblgsci5yb3RhdGlvblk9cy5yb3RhdGlvblksci5zY2FsZVo9cy5zY2FsZVopLHIuZmlsdGVycyYmZGVsZXRlIHIuZmlsdGVycyxyfSxIPWZ1bmN0aW9uKHQsZSxpLHMscil7dmFyIG4sYSxvLGg9e30sbD10LnN0eWxlO2ZvcihhIGluIGkpXCJjc3NUZXh0XCIhPT1hJiZcImxlbmd0aFwiIT09YSYmaXNOYU4oYSkmJihlW2FdIT09KG49aVthXSl8fHImJnJbYV0pJiYtMT09PWEuaW5kZXhPZihcIk9yaWdpblwiKSYmKFwibnVtYmVyXCI9PXR5cGVvZiBufHxcInN0cmluZ1wiPT10eXBlb2YgbikmJihoW2FdPVwiYXV0b1wiIT09bnx8XCJsZWZ0XCIhPT1hJiZcInRvcFwiIT09YT9cIlwiIT09biYmXCJhdXRvXCIhPT1uJiZcIm5vbmVcIiE9PW58fFwic3RyaW5nXCIhPXR5cGVvZiBlW2FdfHxcIlwiPT09ZVthXS5yZXBsYWNlKHYsXCJcIik/bjowOloodCxhKSx2b2lkIDAhPT1sW2FdJiYobz1uZXcgdWUobCxhLGxbYV0sbykpKTtpZihzKWZvcihhIGluIHMpXCJjbGFzc05hbWVcIiE9PWEmJihoW2FdPXNbYV0pO3JldHVybntkaWZzOmgsZmlyc3RNUFQ6b319LEs9e3dpZHRoOltcIkxlZnRcIixcIlJpZ2h0XCJdLGhlaWdodDpbXCJUb3BcIixcIkJvdHRvbVwiXX0sSj1bXCJtYXJnaW5MZWZ0XCIsXCJtYXJnaW5SaWdodFwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl0sdGU9ZnVuY3Rpb24odCxlLGkpe3ZhciBzPXBhcnNlRmxvYXQoXCJ3aWR0aFwiPT09ZT90Lm9mZnNldFdpZHRoOnQub2Zmc2V0SGVpZ2h0KSxyPUtbZV0sbj1yLmxlbmd0aDtmb3IoaT1pfHxHKHQsbnVsbCk7LS1uPi0xOylzLT1wYXJzZUZsb2F0KFcodCxcInBhZGRpbmdcIityW25dLGksITApKXx8MCxzLT1wYXJzZUZsb2F0KFcodCxcImJvcmRlclwiK3Jbbl0rXCJXaWR0aFwiLGksITApKXx8MDtyZXR1cm4gc30sZWU9ZnVuY3Rpb24odCxlKXsobnVsbD09dHx8XCJcIj09PXR8fFwiYXV0b1wiPT09dHx8XCJhdXRvIGF1dG9cIj09PXQpJiYodD1cIjAgMFwiKTt2YXIgaT10LnNwbGl0KFwiIFwiKSxzPS0xIT09dC5pbmRleE9mKFwibGVmdFwiKT9cIjAlXCI6LTEhPT10LmluZGV4T2YoXCJyaWdodFwiKT9cIjEwMCVcIjppWzBdLHI9LTEhPT10LmluZGV4T2YoXCJ0b3BcIik/XCIwJVwiOi0xIT09dC5pbmRleE9mKFwiYm90dG9tXCIpP1wiMTAwJVwiOmlbMV07cmV0dXJuIG51bGw9PXI/cj1cIjBcIjpcImNlbnRlclwiPT09ciYmKHI9XCI1MCVcIiksKFwiY2VudGVyXCI9PT1zfHxpc05hTihwYXJzZUZsb2F0KHMpKSYmLTE9PT0ocytcIlwiKS5pbmRleE9mKFwiPVwiKSkmJihzPVwiNTAlXCIpLGUmJihlLm94cD0tMSE9PXMuaW5kZXhPZihcIiVcIiksZS5veXA9LTEhPT1yLmluZGV4T2YoXCIlXCIpLGUub3hyPVwiPVwiPT09cy5jaGFyQXQoMSksZS5veXI9XCI9XCI9PT1yLmNoYXJBdCgxKSxlLm94PXBhcnNlRmxvYXQocy5yZXBsYWNlKHYsXCJcIikpLGUub3k9cGFyc2VGbG9hdChyLnJlcGxhY2UodixcIlwiKSkpLHMrXCIgXCIrcisoaS5sZW5ndGg+Mj9cIiBcIitpWzJdOlwiXCIpfSxpZT1mdW5jdGlvbih0LGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0JiZcIj1cIj09PXQuY2hhckF0KDEpP3BhcnNlSW50KHQuY2hhckF0KDApK1wiMVwiLDEwKSpwYXJzZUZsb2F0KHQuc3Vic3RyKDIpKTpwYXJzZUZsb2F0KHQpLXBhcnNlRmxvYXQoZSl9LHNlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGw9PXQ/ZTpcInN0cmluZ1wiPT10eXBlb2YgdCYmXCI9XCI9PT10LmNoYXJBdCgxKT9wYXJzZUludCh0LmNoYXJBdCgwKStcIjFcIiwxMCkqcGFyc2VGbG9hdCh0LnN1YnN0cigyKSkrZTpwYXJzZUZsb2F0KHQpfSxyZT1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcixuLGEsbyxoPTFlLTY7cmV0dXJuIG51bGw9PXQ/bz1lOlwibnVtYmVyXCI9PXR5cGVvZiB0P289dDoocj0zNjAsbj10LnNwbGl0KFwiX1wiKSxhPU51bWJlcihuWzBdLnJlcGxhY2UodixcIlwiKSkqKC0xPT09dC5pbmRleE9mKFwicmFkXCIpPzE6eiktKFwiPVwiPT09dC5jaGFyQXQoMSk/MDplKSxuLmxlbmd0aCYmKHMmJihzW2ldPWUrYSksLTEhPT10LmluZGV4T2YoXCJzaG9ydFwiKSYmKGElPXIsYSE9PWElKHIvMikmJihhPTA+YT9hK3I6YS1yKSksLTEhPT10LmluZGV4T2YoXCJfY3dcIikmJjA+YT9hPShhKzk5OTk5OTk5OTkqciklci0oMHxhL3IpKnI6LTEhPT10LmluZGV4T2YoXCJjY3dcIikmJmE+MCYmKGE9KGEtOTk5OTk5OTk5OSpyKSVyLSgwfGEvcikqcikpLG89ZSthKSxoPm8mJm8+LWgmJihvPTApLG99LG5lPXthcXVhOlswLDI1NSwyNTVdLGxpbWU6WzAsMjU1LDBdLHNpbHZlcjpbMTkyLDE5MiwxOTJdLGJsYWNrOlswLDAsMF0sbWFyb29uOlsxMjgsMCwwXSx0ZWFsOlswLDEyOCwxMjhdLGJsdWU6WzAsMCwyNTVdLG5hdnk6WzAsMCwxMjhdLHdoaXRlOlsyNTUsMjU1LDI1NV0sZnVjaHNpYTpbMjU1LDAsMjU1XSxvbGl2ZTpbMTI4LDEyOCwwXSx5ZWxsb3c6WzI1NSwyNTUsMF0sb3JhbmdlOlsyNTUsMTY1LDBdLGdyYXk6WzEyOCwxMjgsMTI4XSxwdXJwbGU6WzEyOCwwLDEyOF0sZ3JlZW46WzAsMTI4LDBdLHJlZDpbMjU1LDAsMF0scGluazpbMjU1LDE5MiwyMDNdLGN5YW46WzAsMjU1LDI1NV0sdHJhbnNwYXJlbnQ6WzI1NSwyNTUsMjU1LDBdfSxhZT1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIHQ9MD50P3QrMTp0PjE/dC0xOnQsMHwyNTUqKDE+Nip0P2UrNiooaS1lKSp0Oi41PnQ/aToyPjMqdD9lKzYqKGktZSkqKDIvMy10KTplKSsuNX0sb2U9ZnVuY3Rpb24odCl7dmFyIGUsaSxzLHIsbixhO3JldHVybiB0JiZcIlwiIT09dD9cIm51bWJlclwiPT10eXBlb2YgdD9bdD4+MTYsMjU1JnQ+PjgsMjU1JnRdOihcIixcIj09PXQuY2hhckF0KHQubGVuZ3RoLTEpJiYodD10LnN1YnN0cigwLHQubGVuZ3RoLTEpKSxuZVt0XT9uZVt0XTpcIiNcIj09PXQuY2hhckF0KDApPyg0PT09dC5sZW5ndGgmJihlPXQuY2hhckF0KDEpLGk9dC5jaGFyQXQoMikscz10LmNoYXJBdCgzKSx0PVwiI1wiK2UrZStpK2krcytzKSx0PXBhcnNlSW50KHQuc3Vic3RyKDEpLDE2KSxbdD4+MTYsMjU1JnQ+PjgsMjU1JnRdKTpcImhzbFwiPT09dC5zdWJzdHIoMCwzKT8odD10Lm1hdGNoKG0pLHI9TnVtYmVyKHRbMF0pJTM2MC8zNjAsbj1OdW1iZXIodFsxXSkvMTAwLGE9TnVtYmVyKHRbMl0pLzEwMCxpPS41Pj1hP2EqKG4rMSk6YStuLWEqbixlPTIqYS1pLHQubGVuZ3RoPjMmJih0WzNdPU51bWJlcih0WzNdKSksdFswXT1hZShyKzEvMyxlLGkpLHRbMV09YWUocixlLGkpLHRbMl09YWUoci0xLzMsZSxpKSx0KToodD10Lm1hdGNoKG0pfHxuZS50cmFuc3BhcmVudCx0WzBdPU51bWJlcih0WzBdKSx0WzFdPU51bWJlcih0WzFdKSx0WzJdPU51bWJlcih0WzJdKSx0Lmxlbmd0aD4zJiYodFszXT1OdW1iZXIodFszXSkpLHQpKTpuZS5ibGFja30saGU9XCIoPzpcXFxcYig/Oig/OnJnYnxyZ2JhfGhzbHxoc2xhKVxcXFwoLis/XFxcXCkpfFxcXFxCIy4rP1xcXFxiXCI7Zm9yKGggaW4gbmUpaGUrPVwifFwiK2grXCJcXFxcYlwiO2hlPVJlZ0V4cChoZStcIilcIixcImdpXCIpO3ZhciBsZT1mdW5jdGlvbih0LGUsaSxzKXtpZihudWxsPT10KXJldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gdH07dmFyIHIsbj1lPyh0Lm1hdGNoKGhlKXx8W1wiXCJdKVswXTpcIlwiLGE9dC5zcGxpdChuKS5qb2luKFwiXCIpLm1hdGNoKGcpfHxbXSxvPXQuc3Vic3RyKDAsdC5pbmRleE9mKGFbMF0pKSxoPVwiKVwiPT09dC5jaGFyQXQodC5sZW5ndGgtMSk/XCIpXCI6XCJcIixsPS0xIT09dC5pbmRleE9mKFwiIFwiKT9cIiBcIjpcIixcIixfPWEubGVuZ3RoLHU9Xz4wP2FbMF0ucmVwbGFjZShtLFwiXCIpOlwiXCI7cmV0dXJuIF8/cj1lP2Z1bmN0aW9uKHQpe3ZhciBlLHAsYyxmO2lmKFwibnVtYmVyXCI9PXR5cGVvZiB0KXQrPXU7ZWxzZSBpZihzJiZELnRlc3QodCkpe2ZvcihmPXQucmVwbGFjZShELFwifFwiKS5zcGxpdChcInxcIiksYz0wO2YubGVuZ3RoPmM7YysrKWZbY109cihmW2NdKTtyZXR1cm4gZi5qb2luKFwiLFwiKX1pZihlPSh0Lm1hdGNoKGhlKXx8W25dKVswXSxwPXQuc3BsaXQoZSkuam9pbihcIlwiKS5tYXRjaChnKXx8W10sYz1wLmxlbmd0aCxfPmMtLSlmb3IoO18+KytjOylwW2NdPWk/cFswfChjLTEpLzJdOmFbY107cmV0dXJuIG8rcC5qb2luKGwpK2wrZStoKygtMSE9PXQuaW5kZXhPZihcImluc2V0XCIpP1wiIGluc2V0XCI6XCJcIil9OmZ1bmN0aW9uKHQpe3ZhciBlLG4scDtpZihcIm51bWJlclwiPT10eXBlb2YgdCl0Kz11O2Vsc2UgaWYocyYmRC50ZXN0KHQpKXtmb3Iobj10LnJlcGxhY2UoRCxcInxcIikuc3BsaXQoXCJ8XCIpLHA9MDtuLmxlbmd0aD5wO3ArKyluW3BdPXIobltwXSk7cmV0dXJuIG4uam9pbihcIixcIil9aWYoZT10Lm1hdGNoKGcpfHxbXSxwPWUubGVuZ3RoLF8+cC0tKWZvcig7Xz4rK3A7KWVbcF09aT9lWzB8KHAtMSkvMl06YVtwXTtyZXR1cm4gbytlLmpvaW4obCkraH06ZnVuY3Rpb24odCl7cmV0dXJuIHR9fSxfZT1mdW5jdGlvbih0KXtyZXR1cm4gdD10LnNwbGl0KFwiLFwiKSxmdW5jdGlvbihlLGkscyxyLG4sYSxvKXt2YXIgaCxsPShpK1wiXCIpLnNwbGl0KFwiIFwiKTtmb3Iobz17fSxoPTA7ND5oO2grKylvW3RbaF1dPWxbaF09bFtoXXx8bFsoaC0xKS8yPj4wXTtyZXR1cm4gci5wYXJzZShlLG8sbixhKX19LHVlPShOLl9zZXRQbHVnaW5SYXRpbz1mdW5jdGlvbih0KXt0aGlzLnBsdWdpbi5zZXRSYXRpbyh0KTtmb3IodmFyIGUsaSxzLHIsbj10aGlzLmRhdGEsYT1uLnByb3h5LG89bi5maXJzdE1QVCxoPTFlLTY7bzspZT1hW28udl0sby5yP2U9TWF0aC5yb3VuZChlKTpoPmUmJmU+LWgmJihlPTApLG8udFtvLnBdPWUsbz1vLl9uZXh0O2lmKG4uYXV0b1JvdGF0ZSYmKG4uYXV0b1JvdGF0ZS5yb3RhdGlvbj1hLnJvdGF0aW9uKSwxPT09dClmb3Iobz1uLmZpcnN0TVBUO287KXtpZihpPW8udCxpLnR5cGUpe2lmKDE9PT1pLnR5cGUpe2ZvcihyPWkueHMwK2kucytpLnhzMSxzPTE7aS5sPnM7cysrKXIrPWlbXCJ4blwiK3NdK2lbXCJ4c1wiKyhzKzEpXTtpLmU9cn19ZWxzZSBpLmU9aS5zK2kueHMwO289by5fbmV4dH19LGZ1bmN0aW9uKHQsZSxpLHMscil7dGhpcy50PXQsdGhpcy5wPWUsdGhpcy52PWksdGhpcy5yPXIscyYmKHMuX3ByZXY9dGhpcyx0aGlzLl9uZXh0PXMpfSkscGU9KE4uX3BhcnNlVG9Qcm94eT1mdW5jdGlvbih0LGUsaSxzLHIsbil7dmFyIGEsbyxoLGwsXyx1PXMscD17fSxjPXt9LGY9aS5fdHJhbnNmb3JtLG09STtmb3IoaS5fdHJhbnNmb3JtPW51bGwsST1lLHM9Xz1pLnBhcnNlKHQsZSxzLHIpLEk9bSxuJiYoaS5fdHJhbnNmb3JtPWYsdSYmKHUuX3ByZXY9bnVsbCx1Ll9wcmV2JiYodS5fcHJldi5fbmV4dD1udWxsKSkpO3MmJnMhPT11Oyl7aWYoMT49cy50eXBlJiYobz1zLnAsY1tvXT1zLnMrcy5jLHBbb109cy5zLG58fChsPW5ldyB1ZShzLFwic1wiLG8sbCxzLnIpLHMuYz0wKSwxPT09cy50eXBlKSlmb3IoYT1zLmw7LS1hPjA7KWg9XCJ4blwiK2Esbz1zLnArXCJfXCIraCxjW29dPXMuZGF0YVtoXSxwW29dPXNbaF0sbnx8KGw9bmV3IHVlKHMsaCxvLGwscy5yeHBbaF0pKTtzPXMuX25leHR9cmV0dXJue3Byb3h5OnAsZW5kOmMsZmlyc3RNUFQ6bCxwdDpffX0sTi5DU1NQcm9wVHdlZW49ZnVuY3Rpb24odCxlLHMscixhLG8saCxsLF8sdSxwKXt0aGlzLnQ9dCx0aGlzLnA9ZSx0aGlzLnM9cyx0aGlzLmM9cix0aGlzLm49aHx8ZSx0IGluc3RhbmNlb2YgcGV8fG4ucHVzaCh0aGlzLm4pLHRoaXMucj1sLHRoaXMudHlwZT1vfHwwLF8mJih0aGlzLnByPV8saT0hMCksdGhpcy5iPXZvaWQgMD09PXU/czp1LHRoaXMuZT12b2lkIDA9PT1wP3MrcjpwLGEmJih0aGlzLl9uZXh0PWEsYS5fcHJldj10aGlzKX0pLGNlPWEucGFyc2VDb21wbGV4PWZ1bmN0aW9uKHQsZSxpLHMscixuLGEsbyxoLF8pe2k9aXx8bnx8XCJcIixhPW5ldyBwZSh0LGUsMCwwLGEsXz8yOjEsbnVsbCwhMSxvLGkscykscys9XCJcIjt2YXIgdSxwLGMsZixnLHYseSxULHcseCxQLFMsaz1pLnNwbGl0KFwiLCBcIikuam9pbihcIixcIikuc3BsaXQoXCIgXCIpLFI9cy5zcGxpdChcIiwgXCIpLmpvaW4oXCIsXCIpLnNwbGl0KFwiIFwiKSxBPWsubGVuZ3RoLE89bCE9PSExO2ZvcigoLTEhPT1zLmluZGV4T2YoXCIsXCIpfHwtMSE9PWkuaW5kZXhPZihcIixcIikpJiYoaz1rLmpvaW4oXCIgXCIpLnJlcGxhY2UoRCxcIiwgXCIpLnNwbGl0KFwiIFwiKSxSPVIuam9pbihcIiBcIikucmVwbGFjZShELFwiLCBcIikuc3BsaXQoXCIgXCIpLEE9ay5sZW5ndGgpLEEhPT1SLmxlbmd0aCYmKGs9KG58fFwiXCIpLnNwbGl0KFwiIFwiKSxBPWsubGVuZ3RoKSxhLnBsdWdpbj1oLGEuc2V0UmF0aW89Xyx1PTA7QT51O3UrKylpZihmPWtbdV0sZz1SW3VdLFQ9cGFyc2VGbG9hdChmKSxUfHwwPT09VClhLmFwcGVuZFh0cmEoXCJcIixULGllKGcsVCksZy5yZXBsYWNlKGQsXCJcIiksTyYmLTEhPT1nLmluZGV4T2YoXCJweFwiKSwhMCk7ZWxzZSBpZihyJiYoXCIjXCI9PT1mLmNoYXJBdCgwKXx8bmVbZl18fGIudGVzdChmKSkpUz1cIixcIj09PWcuY2hhckF0KGcubGVuZ3RoLTEpP1wiKSxcIjpcIilcIixmPW9lKGYpLGc9b2UoZyksdz1mLmxlbmd0aCtnLmxlbmd0aD42LHcmJiFVJiYwPT09Z1szXT8oYVtcInhzXCIrYS5sXSs9YS5sP1wiIHRyYW5zcGFyZW50XCI6XCJ0cmFuc3BhcmVudFwiLGEuZT1hLmUuc3BsaXQoUlt1XSkuam9pbihcInRyYW5zcGFyZW50XCIpKTooVXx8KHc9ITEpLGEuYXBwZW5kWHRyYSh3P1wicmdiYShcIjpcInJnYihcIixmWzBdLGdbMF0tZlswXSxcIixcIiwhMCwhMCkuYXBwZW5kWHRyYShcIlwiLGZbMV0sZ1sxXS1mWzFdLFwiLFwiLCEwKS5hcHBlbmRYdHJhKFwiXCIsZlsyXSxnWzJdLWZbMl0sdz9cIixcIjpTLCEwKSx3JiYoZj00PmYubGVuZ3RoPzE6ZlszXSxhLmFwcGVuZFh0cmEoXCJcIixmLCg0PmcubGVuZ3RoPzE6Z1szXSktZixTLCExKSkpO2Vsc2UgaWYodj1mLm1hdGNoKG0pKXtpZih5PWcubWF0Y2goZCksIXl8fHkubGVuZ3RoIT09di5sZW5ndGgpcmV0dXJuIGE7Zm9yKGM9MCxwPTA7di5sZW5ndGg+cDtwKyspUD12W3BdLHg9Zi5pbmRleE9mKFAsYyksYS5hcHBlbmRYdHJhKGYuc3Vic3RyKGMseC1jKSxOdW1iZXIoUCksaWUoeVtwXSxQKSxcIlwiLE8mJlwicHhcIj09PWYuc3Vic3RyKHgrUC5sZW5ndGgsMiksMD09PXApLGM9eCtQLmxlbmd0aDthW1wieHNcIithLmxdKz1mLnN1YnN0cihjKX1lbHNlIGFbXCJ4c1wiK2EubF0rPWEubD9cIiBcIitmOmY7aWYoLTEhPT1zLmluZGV4T2YoXCI9XCIpJiZhLmRhdGEpe2ZvcihTPWEueHMwK2EuZGF0YS5zLHU9MTthLmw+dTt1KyspUys9YVtcInhzXCIrdV0rYS5kYXRhW1wieG5cIit1XTthLmU9UythW1wieHNcIit1XX1yZXR1cm4gYS5sfHwoYS50eXBlPS0xLGEueHMwPWEuZSksYS54Zmlyc3R8fGF9LGZlPTk7Zm9yKGg9cGUucHJvdG90eXBlLGgubD1oLnByPTA7LS1mZT4wOyloW1wieG5cIitmZV09MCxoW1wieHNcIitmZV09XCJcIjtoLnhzMD1cIlwiLGguX25leHQ9aC5fcHJldj1oLnhmaXJzdD1oLmRhdGE9aC5wbHVnaW49aC5zZXRSYXRpbz1oLnJ4cD1udWxsLGguYXBwZW5kWHRyYT1mdW5jdGlvbih0LGUsaSxzLHIsbil7dmFyIGE9dGhpcyxvPWEubDtyZXR1cm4gYVtcInhzXCIrb10rPW4mJm8/XCIgXCIrdDp0fHxcIlwiLGl8fDA9PT1vfHxhLnBsdWdpbj8oYS5sKyssYS50eXBlPWEuc2V0UmF0aW8/MjoxLGFbXCJ4c1wiK2EubF09c3x8XCJcIixvPjA/KGEuZGF0YVtcInhuXCIrb109ZStpLGEucnhwW1wieG5cIitvXT1yLGFbXCJ4blwiK29dPWUsYS5wbHVnaW58fChhLnhmaXJzdD1uZXcgcGUoYSxcInhuXCIrbyxlLGksYS54Zmlyc3R8fGEsMCxhLm4scixhLnByKSxhLnhmaXJzdC54czA9MCksYSk6KGEuZGF0YT17czplK2l9LGEucnhwPXt9LGEucz1lLGEuYz1pLGEucj1yLGEpKTooYVtcInhzXCIrb10rPWUrKHN8fFwiXCIpLGEpfTt2YXIgbWU9ZnVuY3Rpb24odCxlKXtlPWV8fHt9LHRoaXMucD1lLnByZWZpeD9WKHQpfHx0OnQsb1t0XT1vW3RoaXMucF09dGhpcyx0aGlzLmZvcm1hdD1lLmZvcm1hdHRlcnx8bGUoZS5kZWZhdWx0VmFsdWUsZS5jb2xvcixlLmNvbGxhcHNpYmxlLGUubXVsdGkpLGUucGFyc2VyJiYodGhpcy5wYXJzZT1lLnBhcnNlciksdGhpcy5jbHJzPWUuY29sb3IsdGhpcy5tdWx0aT1lLm11bHRpLHRoaXMua2V5d29yZD1lLmtleXdvcmQsdGhpcy5kZmx0PWUuZGVmYXVsdFZhbHVlLHRoaXMucHI9ZS5wcmlvcml0eXx8MH0sZGU9Ti5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3A9ZnVuY3Rpb24odCxlLGkpe1wib2JqZWN0XCIhPXR5cGVvZiBlJiYoZT17cGFyc2VyOml9KTt2YXIgcyxyLG49dC5zcGxpdChcIixcIiksYT1lLmRlZmF1bHRWYWx1ZTtmb3IoaT1pfHxbYV0scz0wO24ubGVuZ3RoPnM7cysrKWUucHJlZml4PTA9PT1zJiZlLnByZWZpeCxlLmRlZmF1bHRWYWx1ZT1pW3NdfHxhLHI9bmV3IG1lKG5bc10sZSl9LGdlPWZ1bmN0aW9uKHQpe2lmKCFvW3RdKXt2YXIgZT10LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK3Quc3Vic3RyKDEpK1wiUGx1Z2luXCI7ZGUodCx7cGFyc2VyOmZ1bmN0aW9uKHQsaSxzLHIsbixhLGgpe3ZhciBsPShfZ3NTY29wZS5HcmVlblNvY2tHbG9iYWxzfHxfZ3NTY29wZSkuY29tLmdyZWVuc29jay5wbHVnaW5zW2VdO3JldHVybiBsPyhsLl9jc3NSZWdpc3RlcigpLG9bc10ucGFyc2UodCxpLHMscixuLGEsaCkpOihqKFwiRXJyb3I6IFwiK2UrXCIganMgZmlsZSBub3QgbG9hZGVkLlwiKSxuKX19KX19O2g9bWUucHJvdG90eXBlLGgucGFyc2VDb21wbGV4PWZ1bmN0aW9uKHQsZSxpLHMscixuKXt2YXIgYSxvLGgsbCxfLHUscD10aGlzLmtleXdvcmQ7aWYodGhpcy5tdWx0aSYmKEQudGVzdChpKXx8RC50ZXN0KGUpPyhvPWUucmVwbGFjZShELFwifFwiKS5zcGxpdChcInxcIiksaD1pLnJlcGxhY2UoRCxcInxcIikuc3BsaXQoXCJ8XCIpKTpwJiYobz1bZV0saD1baV0pKSxoKXtmb3IobD1oLmxlbmd0aD5vLmxlbmd0aD9oLmxlbmd0aDpvLmxlbmd0aCxhPTA7bD5hO2ErKyllPW9bYV09b1thXXx8dGhpcy5kZmx0LGk9aFthXT1oW2FdfHx0aGlzLmRmbHQscCYmKF89ZS5pbmRleE9mKHApLHU9aS5pbmRleE9mKHApLF8hPT11JiYoaT0tMT09PXU/aDpvLGlbYV0rPVwiIFwiK3ApKTtlPW8uam9pbihcIiwgXCIpLGk9aC5qb2luKFwiLCBcIil9cmV0dXJuIGNlKHQsdGhpcy5wLGUsaSx0aGlzLmNscnMsdGhpcy5kZmx0LHMsdGhpcy5wcixyLG4pfSxoLnBhcnNlPWZ1bmN0aW9uKHQsZSxpLHMsbixhKXtyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSx0aGlzLmZvcm1hdChXKHQsdGhpcy5wLHIsITEsdGhpcy5kZmx0KSksdGhpcy5mb3JtYXQoZSksbixhKX0sYS5yZWdpc3RlclNwZWNpYWxQcm9wPWZ1bmN0aW9uKHQsZSxpKXtkZSh0LHtwYXJzZXI6ZnVuY3Rpb24odCxzLHIsbixhLG8pe3ZhciBoPW5ldyBwZSh0LHIsMCwwLGEsMixyLCExLGkpO3JldHVybiBoLnBsdWdpbj1vLGguc2V0UmF0aW89ZSh0LHMsbi5fdHdlZW4sciksaH0scHJpb3JpdHk6aX0pfTt2YXIgdmU9XCJzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixza2V3WCxza2V3WSxyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHBlcnNwZWN0aXZlLHhQZXJjZW50LHlQZXJjZW50XCIuc3BsaXQoXCIsXCIpLHllPVYoXCJ0cmFuc2Zvcm1cIiksVGU9QitcInRyYW5zZm9ybVwiLHdlPVYoXCJ0cmFuc2Zvcm1PcmlnaW5cIikseGU9bnVsbCE9PVYoXCJwZXJzcGVjdGl2ZVwiKSxiZT1OLlRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMuc2tld1k9MH0sUGU9d2luZG93LlNWR0VsZW1lbnQsU2U9UGUmJihmfHwvQW5kcm9pZC9pLnRlc3QoWCkmJiF3aW5kb3cuY2hyb21lKSxrZT1mdW5jdGlvbih0LGUsaSl7dmFyIHM9dC5nZXRCQm94KCk7ZT1lZShlKS5zcGxpdChcIiBcIiksaS54T3JpZ2luPSgtMSE9PWVbMF0uaW5kZXhPZihcIiVcIik/cGFyc2VGbG9hdChlWzBdKS8xMDAqcy53aWR0aDpwYXJzZUZsb2F0KGVbMF0pKStzLngsaS55T3JpZ2luPSgtMSE9PWVbMV0uaW5kZXhPZihcIiVcIik/cGFyc2VGbG9hdChlWzFdKS8xMDAqcy5oZWlnaHQ6cGFyc2VGbG9hdChlWzFdKSkrcy55fSxSZT1OLmdldFRyYW5zZm9ybT1mdW5jdGlvbih0LGUsaSxzKXtpZih0Ll9nc1RyYW5zZm9ybSYmaSYmIXMpcmV0dXJuIHQuX2dzVHJhbnNmb3JtO3ZhciBuLG8saCxsLF8sdSxwLGMsZixtLGQsZyx2LHk9aT90Ll9nc1RyYW5zZm9ybXx8bmV3IGJlOm5ldyBiZSxUPTA+eS5zY2FsZVgsdz0yZS01LHg9MWU1LGI9MTc5Ljk5LFA9YipNLFM9eGU/cGFyc2VGbG9hdChXKHQsd2UsZSwhMSxcIjAgMCAwXCIpLnNwbGl0KFwiIFwiKVsyXSl8fHkuek9yaWdpbnx8MDowLGs9cGFyc2VGbG9hdChhLmRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZSl8fDA7aWYoeWU/bj1XKHQsVGUsZSwhMCk6dC5jdXJyZW50U3R5bGUmJihuPXQuY3VycmVudFN0eWxlLmZpbHRlci5tYXRjaChPKSxuPW4mJjQ9PT1uLmxlbmd0aD9bblswXS5zdWJzdHIoNCksTnVtYmVyKG5bMl0uc3Vic3RyKDQpKSxOdW1iZXIoblsxXS5zdWJzdHIoNCkpLG5bM10uc3Vic3RyKDQpLHkueHx8MCx5Lnl8fDBdLmpvaW4oXCIsXCIpOlwiXCIpLG4mJlwibm9uZVwiIT09biYmXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIiE9PW4pe2ZvcihvPShufHxcIlwiKS5tYXRjaCgvKD86XFwtfFxcYilbXFxkXFwtXFwuZV0rXFxiL2dpKXx8W10saD1vLmxlbmd0aDstLWg+LTE7KWw9TnVtYmVyKG9baF0pLG9baF09KF89bC0obHw9MCkpPygwfF8qeCsoMD5fPy0uNTouNSkpL3grbDpsO2lmKDE2PT09by5sZW5ndGgpe3ZhciBSPW9bOF0sQT1vWzldLEM9b1sxMF0sRD1vWzEyXSxJPW9bMTNdLEU9b1sxNF07aWYoeS56T3JpZ2luJiYoRT0teS56T3JpZ2luLEQ9UipFLW9bMTJdLEk9QSpFLW9bMTNdLEU9QypFK3kuek9yaWdpbi1vWzE0XSksIWl8fHN8fG51bGw9PXkucm90YXRpb25YKXt2YXIgRixMLE4sWCxVLFksaixCPW9bMF0scT1vWzFdLFY9b1syXSxHPW9bM10sUT1vWzRdLFo9b1s1XSwkPW9bNl0sSD1vWzddLEs9b1sxMV0sSj1NYXRoLmF0YW4yKCQsQyksdGU9LVA+Snx8Sj5QO3kucm90YXRpb25YPUoqeixKJiYoWD1NYXRoLmNvcygtSiksVT1NYXRoLnNpbigtSiksRj1RKlgrUipVLEw9WipYK0EqVSxOPSQqWCtDKlUsUj1RKi1VK1IqWCxBPVoqLVUrQSpYLEM9JCotVStDKlgsSz1IKi1VK0sqWCxRPUYsWj1MLCQ9TiksSj1NYXRoLmF0YW4yKFIsQikseS5yb3RhdGlvblk9Sip6LEomJihZPS1QPkp8fEo+UCxYPU1hdGguY29zKC1KKSxVPU1hdGguc2luKC1KKSxGPUIqWC1SKlUsTD1xKlgtQSpVLE49VipYLUMqVSxBPXEqVStBKlgsQz1WKlUrQypYLEs9RypVK0sqWCxCPUYscT1MLFY9TiksSj1NYXRoLmF0YW4yKHEsWikseS5yb3RhdGlvbj1KKnosSiYmKGo9LVA+Snx8Sj5QLFg9TWF0aC5jb3MoLUopLFU9TWF0aC5zaW4oLUopLEI9QipYK1EqVSxMPXEqWCtaKlUsWj1xKi1VK1oqWCwkPVYqLVUrJCpYLHE9TCksaiYmdGU/eS5yb3RhdGlvbj15LnJvdGF0aW9uWD0wOmomJlk/eS5yb3RhdGlvbj15LnJvdGF0aW9uWT0wOlkmJnRlJiYoeS5yb3RhdGlvblk9eS5yb3RhdGlvblg9MCkseS5zY2FsZVg9KDB8TWF0aC5zcXJ0KEIqQitxKnEpKngrLjUpL3gseS5zY2FsZVk9KDB8TWF0aC5zcXJ0KFoqWitBKkEpKngrLjUpL3gseS5zY2FsZVo9KDB8TWF0aC5zcXJ0KCQqJCtDKkMpKngrLjUpL3gseS5za2V3WD0wLHkucGVyc3BlY3RpdmU9Sz8xLygwPks/LUs6Syk6MCx5Lng9RCx5Lnk9SSx5Lno9RX19ZWxzZSBpZighKHhlJiYhcyYmby5sZW5ndGgmJnkueD09PW9bNF0mJnkueT09PW9bNV0mJih5LnJvdGF0aW9uWHx8eS5yb3RhdGlvblkpfHx2b2lkIDAhPT15LngmJlwibm9uZVwiPT09Vyh0LFwiZGlzcGxheVwiLGUpKSl7dmFyIGVlPW8ubGVuZ3RoPj02LGllPWVlP29bMF06MSxzZT1vWzFdfHwwLHJlPW9bMl18fDAsbmU9ZWU/b1szXToxO3kueD1vWzRdfHwwLHkueT1vWzVdfHwwLHU9TWF0aC5zcXJ0KGllKmllK3NlKnNlKSxwPU1hdGguc3FydChuZSpuZStyZSpyZSksYz1pZXx8c2U/TWF0aC5hdGFuMihzZSxpZSkqejp5LnJvdGF0aW9ufHwwLGY9cmV8fG5lP01hdGguYXRhbjIocmUsbmUpKnorYzp5LnNrZXdYfHwwLG09dS1NYXRoLmFicyh5LnNjYWxlWHx8MCksZD1wLU1hdGguYWJzKHkuc2NhbGVZfHwwKSxNYXRoLmFicyhmKT45MCYmMjcwPk1hdGguYWJzKGYpJiYoVD8odSo9LTEsZis9MD49Yz8xODA6LTE4MCxjKz0wPj1jPzE4MDotMTgwKToocCo9LTEsZis9MD49Zj8xODA6LTE4MCkpLGc9KGMteS5yb3RhdGlvbiklMTgwLHY9KGYteS5za2V3WCklMTgwLCh2b2lkIDA9PT15LnNrZXdYfHxtPnd8fC13Pm18fGQ+d3x8LXc+ZHx8Zz4tYiYmYj5nJiZmYWxzZXxnKnh8fHY+LWImJmI+diYmZmFsc2V8dip4KSYmKHkuc2NhbGVYPXUseS5zY2FsZVk9cCx5LnJvdGF0aW9uPWMseS5za2V3WD1mKSx4ZSYmKHkucm90YXRpb25YPXkucm90YXRpb25ZPXkuej0wLHkucGVyc3BlY3RpdmU9ayx5LnNjYWxlWj0xKX15LnpPcmlnaW49Uztmb3IoaCBpbiB5KXc+eVtoXSYmeVtoXT4tdyYmKHlbaF09MCl9ZWxzZSB5PXt4OjAseTowLHo6MCxzY2FsZVg6MSxzY2FsZVk6MSxzY2FsZVo6MSxza2V3WDowLHNrZXdZOjAscGVyc3BlY3RpdmU6ayxyb3RhdGlvbjowLHJvdGF0aW9uWDowLHJvdGF0aW9uWTowLHpPcmlnaW46MH07cmV0dXJuIGkmJih0Ll9nc1RyYW5zZm9ybT15KSx5LnN2Zz1QZSYmdCBpbnN0YW5jZW9mIFBlLHkuc3ZnJiZrZSh0LFcodCx3ZSxyLCExLFwiNTAlIDUwJVwiKStcIlwiLHkpLHkueFBlcmNlbnQ9eS55UGVyY2VudD0wLHl9LEFlPWZ1bmN0aW9uKHQpe3ZhciBlLGkscz10aGlzLmRhdGEscj0tcy5yb3RhdGlvbipNLG49citzLnNrZXdYKk0sYT0xZTUsbz0oMHxNYXRoLmNvcyhyKSpzLnNjYWxlWCphKS9hLGg9KDB8TWF0aC5zaW4ocikqcy5zY2FsZVgqYSkvYSxsPSgwfE1hdGguc2luKG4pKi1zLnNjYWxlWSphKS9hLF89KDB8TWF0aC5jb3Mobikqcy5zY2FsZVkqYSkvYSx1PXRoaXMudC5zdHlsZSxwPXRoaXMudC5jdXJyZW50U3R5bGU7aWYocCl7aT1oLGg9LWwsbD0taSxlPXAuZmlsdGVyLHUuZmlsdGVyPVwiXCI7dmFyIGMsbSxkPXRoaXMudC5vZmZzZXRXaWR0aCxnPXRoaXMudC5vZmZzZXRIZWlnaHQsdj1cImFic29sdXRlXCIhPT1wLnBvc2l0aW9uLHc9XCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KE0xMT1cIitvK1wiLCBNMTI9XCIraCtcIiwgTTIxPVwiK2wrXCIsIE0yMj1cIitfLHg9cy54K2Qqcy54UGVyY2VudC8xMDAsYj1zLnkrZypzLnlQZXJjZW50LzEwMDtpZihudWxsIT1zLm94JiYoYz0ocy5veHA/LjAxKmQqcy5veDpzLm94KS1kLzIsbT0ocy5veXA/LjAxKmcqcy5veTpzLm95KS1nLzIseCs9Yy0oYypvK20qaCksYis9bS0oYypsK20qXykpLHY/KGM9ZC8yLG09Zy8yLHcrPVwiLCBEeD1cIisoYy0oYypvK20qaCkreCkrXCIsIER5PVwiKyhtLShjKmwrbSpfKStiKStcIilcIik6dys9XCIsIHNpemluZ01ldGhvZD0nYXV0byBleHBhbmQnKVwiLHUuZmlsdGVyPS0xIT09ZS5pbmRleE9mKFwiRFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KFwiKT9lLnJlcGxhY2UoQyx3KTp3K1wiIFwiK2UsKDA9PT10fHwxPT09dCkmJjE9PT1vJiYwPT09aCYmMD09PWwmJjE9PT1fJiYodiYmLTE9PT13LmluZGV4T2YoXCJEeD0wLCBEeT0wXCIpfHxULnRlc3QoZSkmJjEwMCE9PXBhcnNlRmxvYXQoUmVnRXhwLiQxKXx8LTE9PT1lLmluZGV4T2YoXCJncmFkaWVudChcIiYmZS5pbmRleE9mKFwiQWxwaGFcIikpJiZ1LnJlbW92ZUF0dHJpYnV0ZShcImZpbHRlclwiKSksIXYpe3ZhciBQLFMsayxSPTg+Zj8xOi0xO2ZvcihjPXMuaWVPZmZzZXRYfHwwLG09cy5pZU9mZnNldFl8fDAscy5pZU9mZnNldFg9TWF0aC5yb3VuZCgoZC0oKDA+bz8tbzpvKSpkKygwPmg/LWg6aCkqZykpLzIreCkscy5pZU9mZnNldFk9TWF0aC5yb3VuZCgoZy0oKDA+Xz8tXzpfKSpnKygwPmw/LWw6bCkqZCkpLzIrYiksZmU9MDs0PmZlO2ZlKyspUz1KW2ZlXSxQPXBbU10saT0tMSE9PVAuaW5kZXhPZihcInB4XCIpP3BhcnNlRmxvYXQoUCk6USh0aGlzLnQsUyxwYXJzZUZsb2F0KFApLFAucmVwbGFjZSh5LFwiXCIpKXx8MCxrPWkhPT1zW1NdPzI+ZmU/LXMuaWVPZmZzZXRYOi1zLmllT2Zmc2V0WToyPmZlP2Mtcy5pZU9mZnNldFg6bS1zLmllT2Zmc2V0WSx1W1NdPShzW1NdPU1hdGgucm91bmQoaS1rKigwPT09ZmV8fDI9PT1mZT8xOlIpKSkrXCJweFwifX19LE9lPU4uc2V0M0RUcmFuc2Zvcm1SYXRpbz1mdW5jdGlvbih0KXt2YXIgZSxpLHMscixuLGEsbyxoLGwsXyx1LGMsZixtLGQsZyx2LHksVCx3LHgsYixQLFM9dGhpcy5kYXRhLGs9dGhpcy50LnN0eWxlLFI9Uy5yb3RhdGlvbipNLEE9Uy5zY2FsZVgsTz1TLnNjYWxlWSxDPVMuc2NhbGVaLEQ9Uy54LHo9Uy55LEk9Uy56LEU9Uy5wZXJzcGVjdGl2ZTtpZighKDEhPT10JiYwIT09dHx8XCJhdXRvXCIhPT1TLmZvcmNlM0R8fFMucm90YXRpb25ZfHxTLnJvdGF0aW9uWHx8MSE9PUN8fEV8fEkpKXJldHVybiBDZS5jYWxsKHRoaXMsdCksdm9pZCAwO2lmKHApe3ZhciBGPTFlLTQ7Rj5BJiZBPi1GJiYoQT1DPTJlLTUpLEY+TyYmTz4tRiYmKE89Qz0yZS01KSwhRXx8Uy56fHxTLnJvdGF0aW9uWHx8Uy5yb3RhdGlvbll8fChFPTApfWlmKFJ8fFMuc2tld1gpeT1NYXRoLmNvcyhSKSxUPU1hdGguc2luKFIpLGU9eSxuPVQsUy5za2V3WCYmKFItPVMuc2tld1gqTSx5PU1hdGguY29zKFIpLFQ9TWF0aC5zaW4oUiksXCJzaW1wbGVcIj09PVMuc2tld1R5cGUmJih3PU1hdGgudGFuKFMuc2tld1gqTSksdz1NYXRoLnNxcnQoMSt3KncpLHkqPXcsVCo9dykpLGk9LVQsYT15O2Vsc2V7aWYoIShTLnJvdGF0aW9uWXx8Uy5yb3RhdGlvblh8fDEhPT1DfHxFfHxTLnN2ZykpcmV0dXJuIGtbeWVdPShTLnhQZXJjZW50fHxTLnlQZXJjZW50P1widHJhbnNsYXRlKFwiK1MueFBlcmNlbnQrXCIlLFwiK1MueVBlcmNlbnQrXCIlKSB0cmFuc2xhdGUzZChcIjpcInRyYW5zbGF0ZTNkKFwiKStEK1wicHgsXCIreitcInB4LFwiK0krXCJweClcIisoMSE9PUF8fDEhPT1PP1wiIHNjYWxlKFwiK0ErXCIsXCIrTytcIilcIjpcIlwiKSx2b2lkIDA7ZT1hPTEsaT1uPTB9dT0xLHM9cj1vPWg9bD1fPWM9Zj1tPTAsZD1FPy0xL0U6MCxnPVMuek9yaWdpbix2PTFlNSxSPVMucm90YXRpb25ZKk0sUiYmKHk9TWF0aC5jb3MoUiksVD1NYXRoLnNpbihSKSxsPXUqLVQsZj1kKi1ULHM9ZSpULG89bipULHUqPXksZCo9eSxlKj15LG4qPXkpLFI9Uy5yb3RhdGlvblgqTSxSJiYoeT1NYXRoLmNvcyhSKSxUPU1hdGguc2luKFIpLHc9aSp5K3MqVCx4PWEqeStvKlQsYj1fKnkrdSpULFA9bSp5K2QqVCxzPWkqLVQrcyp5LG89YSotVCtvKnksdT1fKi1UK3UqeSxkPW0qLVQrZCp5LGk9dyxhPXgsXz1iLG09UCksMSE9PUMmJihzKj1DLG8qPUMsdSo9QyxkKj1DKSwxIT09TyYmKGkqPU8sYSo9TyxfKj1PLG0qPU8pLDEhPT1BJiYoZSo9QSxuKj1BLGwqPUEsZio9QSksZyYmKGMtPWcscj1zKmMsaD1vKmMsYz11KmMrZyksUy5zdmcmJihyKz1TLnhPcmlnaW4tKFMueE9yaWdpbiplK1MueU9yaWdpbippKSxoKz1TLnlPcmlnaW4tKFMueE9yaWdpbipuK1MueU9yaWdpbiphKSkscj0odz0ocis9RCktKHJ8PTApKT8oMHx3KnYrKDA+dz8tLjU6LjUpKS92K3I6cixoPSh3PShoKz16KS0oaHw9MCkpPygwfHcqdisoMD53Py0uNTouNSkpL3YraDpoLGM9KHc9KGMrPUkpLShjfD0wKSk/KDB8dyp2KygwPnc/LS41Oi41KSkvditjOmMsa1t5ZV09KFMueFBlcmNlbnR8fFMueVBlcmNlbnQ/XCJ0cmFuc2xhdGUoXCIrUy54UGVyY2VudCtcIiUsXCIrUy55UGVyY2VudCtcIiUpIG1hdHJpeDNkKFwiOlwibWF0cml4M2QoXCIpK1soMHxlKnYpL3YsKDB8bip2KS92LCgwfGwqdikvdiwoMHxmKnYpL3YsKDB8aSp2KS92LCgwfGEqdikvdiwoMHxfKnYpL3YsKDB8bSp2KS92LCgwfHMqdikvdiwoMHxvKnYpL3YsKDB8dSp2KS92LCgwfGQqdikvdixyLGgsYyxFPzErLWMvRToxXS5qb2luKFwiLFwiKStcIilcIn0sQ2U9Ti5zZXQyRFRyYW5zZm9ybVJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyLG4sYSxvLGgsbCxfLHUscD10aGlzLmRhdGEsYz10aGlzLnQsZj1jLnN0eWxlLG09cC54LGQ9cC55O3JldHVybiEocC5yb3RhdGlvblh8fHAucm90YXRpb25ZfHxwLnp8fHAuZm9yY2UzRD09PSEwfHxcImF1dG9cIj09PXAuZm9yY2UzRCYmMSE9PXQmJjAhPT10KXx8cC5zdmcmJlNlfHwheGU/KHI9cC5zY2FsZVgsbj1wLnNjYWxlWSxwLnJvdGF0aW9ufHxwLnNrZXdYfHxwLnN2Zz8oZT1wLnJvdGF0aW9uKk0saT1lLXAuc2tld1gqTSxzPTFlNSxhPU1hdGguY29zKGUpKnIsbz1NYXRoLnNpbihlKSpyLGg9TWF0aC5zaW4oaSkqLW4sbD1NYXRoLmNvcyhpKSpuLHAuc3ZnJiYobSs9cC54T3JpZ2luLShwLnhPcmlnaW4qYStwLnlPcmlnaW4qaCksZCs9cC55T3JpZ2luLShwLnhPcmlnaW4qbytwLnlPcmlnaW4qbCksdT0xZS02LHU+bSYmbT4tdSYmKG09MCksdT5kJiZkPi11JiYoZD0wKSksXz0oMHxhKnMpL3MrXCIsXCIrKDB8bypzKS9zK1wiLFwiKygwfGgqcykvcytcIixcIisoMHxsKnMpL3MrXCIsXCIrbStcIixcIitkK1wiKVwiLHAuc3ZnJiZTZT9jLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLFwibWF0cml4KFwiK18pOmZbeWVdPShwLnhQZXJjZW50fHxwLnlQZXJjZW50P1widHJhbnNsYXRlKFwiK3AueFBlcmNlbnQrXCIlLFwiK3AueVBlcmNlbnQrXCIlKSBtYXRyaXgoXCI6XCJtYXRyaXgoXCIpK18pOmZbeWVdPShwLnhQZXJjZW50fHxwLnlQZXJjZW50P1widHJhbnNsYXRlKFwiK3AueFBlcmNlbnQrXCIlLFwiK3AueVBlcmNlbnQrXCIlKSBtYXRyaXgoXCI6XCJtYXRyaXgoXCIpK3IrXCIsMCwwLFwiK24rXCIsXCIrbStcIixcIitkK1wiKVwiLHZvaWQgMCk6KHRoaXMuc2V0UmF0aW89T2UsT2UuY2FsbCh0aGlzLHQpLHZvaWQgMCl9O2RlKFwidHJhbnNmb3JtLHNjYWxlLHNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscm90YXRpb25aLHNrZXdYLHNrZXdZLHNob3J0Um90YXRpb24sc2hvcnRSb3RhdGlvblgsc2hvcnRSb3RhdGlvblksc2hvcnRSb3RhdGlvblosdHJhbnNmb3JtT3JpZ2luLHRyYW5zZm9ybVBlcnNwZWN0aXZlLGRpcmVjdGlvbmFsUm90YXRpb24scGFyc2VUcmFuc2Zvcm0sZm9yY2UzRCxza2V3VHlwZSx4UGVyY2VudCx5UGVyY2VudFwiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxuLG8saCl7aWYocy5fdHJhbnNmb3JtKXJldHVybiBuO3ZhciBsLF8sdSxwLGMsZixtLGQ9cy5fdHJhbnNmb3JtPVJlKHQsciwhMCxoLnBhcnNlVHJhbnNmb3JtKSxnPXQuc3R5bGUsdj0xZS02LHk9dmUubGVuZ3RoLFQ9aCx3PXt9O2lmKFwic3RyaW5nXCI9PXR5cGVvZiBULnRyYW5zZm9ybSYmeWUpdT1GLnN0eWxlLHVbeWVdPVQudHJhbnNmb3JtLHUuZGlzcGxheT1cImJsb2NrXCIsdS5wb3NpdGlvbj1cImFic29sdXRlXCIsRS5ib2R5LmFwcGVuZENoaWxkKEYpLGw9UmUoRixudWxsLCExKSxFLmJvZHkucmVtb3ZlQ2hpbGQoRik7ZWxzZSBpZihcIm9iamVjdFwiPT10eXBlb2YgVCl7aWYobD17c2NhbGVYOnNlKG51bGwhPVQuc2NhbGVYP1Quc2NhbGVYOlQuc2NhbGUsZC5zY2FsZVgpLHNjYWxlWTpzZShudWxsIT1ULnNjYWxlWT9ULnNjYWxlWTpULnNjYWxlLGQuc2NhbGVZKSxzY2FsZVo6c2UoVC5zY2FsZVosZC5zY2FsZVopLHg6c2UoVC54LGQueCkseTpzZShULnksZC55KSx6OnNlKFQueixkLnopLHhQZXJjZW50OnNlKFQueFBlcmNlbnQsZC54UGVyY2VudCkseVBlcmNlbnQ6c2UoVC55UGVyY2VudCxkLnlQZXJjZW50KSxwZXJzcGVjdGl2ZTpzZShULnRyYW5zZm9ybVBlcnNwZWN0aXZlLGQucGVyc3BlY3RpdmUpfSxtPVQuZGlyZWN0aW9uYWxSb3RhdGlvbixudWxsIT1tKWlmKFwib2JqZWN0XCI9PXR5cGVvZiBtKWZvcih1IGluIG0pVFt1XT1tW3VdO2Vsc2UgVC5yb3RhdGlvbj1tO1wic3RyaW5nXCI9PXR5cGVvZiBULngmJi0xIT09VC54LmluZGV4T2YoXCIlXCIpJiYobC54PTAsbC54UGVyY2VudD1zZShULngsZC54UGVyY2VudCkpLFwic3RyaW5nXCI9PXR5cGVvZiBULnkmJi0xIT09VC55LmluZGV4T2YoXCIlXCIpJiYobC55PTAsbC55UGVyY2VudD1zZShULnksZC55UGVyY2VudCkpLGwucm90YXRpb249cmUoXCJyb3RhdGlvblwiaW4gVD9ULnJvdGF0aW9uOlwic2hvcnRSb3RhdGlvblwiaW4gVD9ULnNob3J0Um90YXRpb24rXCJfc2hvcnRcIjpcInJvdGF0aW9uWlwiaW4gVD9ULnJvdGF0aW9uWjpkLnJvdGF0aW9uLGQucm90YXRpb24sXCJyb3RhdGlvblwiLHcpLHhlJiYobC5yb3RhdGlvblg9cmUoXCJyb3RhdGlvblhcImluIFQ/VC5yb3RhdGlvblg6XCJzaG9ydFJvdGF0aW9uWFwiaW4gVD9ULnNob3J0Um90YXRpb25YK1wiX3Nob3J0XCI6ZC5yb3RhdGlvblh8fDAsZC5yb3RhdGlvblgsXCJyb3RhdGlvblhcIix3KSxsLnJvdGF0aW9uWT1yZShcInJvdGF0aW9uWVwiaW4gVD9ULnJvdGF0aW9uWTpcInNob3J0Um90YXRpb25ZXCJpbiBUP1Quc2hvcnRSb3RhdGlvblkrXCJfc2hvcnRcIjpkLnJvdGF0aW9uWXx8MCxkLnJvdGF0aW9uWSxcInJvdGF0aW9uWVwiLHcpKSxsLnNrZXdYPW51bGw9PVQuc2tld1g/ZC5za2V3WDpyZShULnNrZXdYLGQuc2tld1gpLGwuc2tld1k9bnVsbD09VC5za2V3WT9kLnNrZXdZOnJlKFQuc2tld1ksZC5za2V3WSksKF89bC5za2V3WS1kLnNrZXdZKSYmKGwuc2tld1grPV8sbC5yb3RhdGlvbis9Xyl9Zm9yKHhlJiZudWxsIT1ULmZvcmNlM0QmJihkLmZvcmNlM0Q9VC5mb3JjZTNELGY9ITApLGQuc2tld1R5cGU9VC5za2V3VHlwZXx8ZC5za2V3VHlwZXx8YS5kZWZhdWx0U2tld1R5cGUsYz1kLmZvcmNlM0R8fGQuenx8ZC5yb3RhdGlvblh8fGQucm90YXRpb25ZfHxsLnp8fGwucm90YXRpb25YfHxsLnJvdGF0aW9uWXx8bC5wZXJzcGVjdGl2ZSxjfHxudWxsPT1ULnNjYWxlfHwobC5zY2FsZVo9MSk7LS15Pi0xOylpPXZlW3ldLHA9bFtpXS1kW2ldLChwPnZ8fC12PnB8fG51bGwhPVRbaV18fG51bGwhPUlbaV0pJiYoZj0hMCxuPW5ldyBwZShkLGksZFtpXSxwLG4pLGkgaW4gdyYmKG4uZT13W2ldKSxuLnhzMD0wLG4ucGx1Z2luPW8scy5fb3ZlcndyaXRlUHJvcHMucHVzaChuLm4pKTtyZXR1cm4gcD1ULnRyYW5zZm9ybU9yaWdpbixwJiZkLnN2Zz8oa2UodCxwLGwpLG49bmV3IHBlKGQsXCJ4T3JpZ2luXCIsZC54T3JpZ2luLGwueE9yaWdpbi1kLnhPcmlnaW4sbiwtMSxcInRyYW5zZm9ybU9yaWdpblwiKSxuLmI9ZC54T3JpZ2luLG4uZT1uLnhzMD1sLnhPcmlnaW4sbj1uZXcgcGUoZCxcInlPcmlnaW5cIixkLnlPcmlnaW4sbC55T3JpZ2luLWQueU9yaWdpbixuLC0xLFwidHJhbnNmb3JtT3JpZ2luXCIpLG4uYj1kLnlPcmlnaW4sbi5lPW4ueHMwPWwueU9yaWdpbixNZShnLHdlKSk6KHB8fHhlJiZjJiZkLnpPcmlnaW4pJiYoeWU/KGY9ITAsaT13ZSxwPShwfHxXKHQsaSxyLCExLFwiNTAlIDUwJVwiKSkrXCJcIixuPW5ldyBwZShnLGksMCwwLG4sLTEsXCJ0cmFuc2Zvcm1PcmlnaW5cIiksbi5iPWdbaV0sbi5wbHVnaW49byx4ZT8odT1kLnpPcmlnaW4scD1wLnNwbGl0KFwiIFwiKSxkLnpPcmlnaW49KHAubGVuZ3RoPjImJigwPT09dXx8XCIwcHhcIiE9PXBbMl0pP3BhcnNlRmxvYXQocFsyXSk6dSl8fDAsbi54czA9bi5lPXBbMF0rXCIgXCIrKHBbMV18fFwiNTAlXCIpK1wiIDBweFwiLG49bmV3IHBlKGQsXCJ6T3JpZ2luXCIsMCwwLG4sLTEsbi5uKSxuLmI9dSxuLnhzMD1uLmU9ZC56T3JpZ2luKTpuLnhzMD1uLmU9cCk6ZWUocCtcIlwiLGQpKSxmJiYocy5fdHJhbnNmb3JtVHlwZT1kLnN2ZyYmU2V8fCFjJiYzIT09dGhpcy5fdHJhbnNmb3JtVHlwZT8yOjMpLG59LHByZWZpeDohMH0pLGRlKFwiYm94U2hhZG93XCIse2RlZmF1bHRWYWx1ZTpcIjBweCAwcHggMHB4IDBweCAjOTk5XCIscHJlZml4OiEwLGNvbG9yOiEwLG11bHRpOiEwLGtleXdvcmQ6XCJpbnNldFwifSksZGUoXCJib3JkZXJSYWRpdXNcIix7ZGVmYXVsdFZhbHVlOlwiMHB4XCIscGFyc2VyOmZ1bmN0aW9uKHQsZSxpLG4sYSl7ZT10aGlzLmZvcm1hdChlKTt2YXIgbyxoLGwsXyx1LHAsYyxmLG0sZCxnLHYseSxULHcseCxiPVtcImJvcmRlclRvcExlZnRSYWRpdXNcIixcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiLFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXSxQPXQuc3R5bGU7Zm9yKG09cGFyc2VGbG9hdCh0Lm9mZnNldFdpZHRoKSxkPXBhcnNlRmxvYXQodC5vZmZzZXRIZWlnaHQpLG89ZS5zcGxpdChcIiBcIiksaD0wO2IubGVuZ3RoPmg7aCsrKXRoaXMucC5pbmRleE9mKFwiYm9yZGVyXCIpJiYoYltoXT1WKGJbaF0pKSx1PV89Vyh0LGJbaF0sciwhMSxcIjBweFwiKSwtMSE9PXUuaW5kZXhPZihcIiBcIikmJihfPXUuc3BsaXQoXCIgXCIpLHU9X1swXSxfPV9bMV0pLHA9bD1vW2hdLGM9cGFyc2VGbG9hdCh1KSx2PXUuc3Vic3RyKChjK1wiXCIpLmxlbmd0aCkseT1cIj1cIj09PXAuY2hhckF0KDEpLHk/KGY9cGFyc2VJbnQocC5jaGFyQXQoMCkrXCIxXCIsMTApLHA9cC5zdWJzdHIoMiksZio9cGFyc2VGbG9hdChwKSxnPXAuc3Vic3RyKChmK1wiXCIpLmxlbmd0aC0oMD5mPzE6MCkpfHxcIlwiKTooZj1wYXJzZUZsb2F0KHApLGc9cC5zdWJzdHIoKGYrXCJcIikubGVuZ3RoKSksXCJcIj09PWcmJihnPXNbaV18fHYpLGchPT12JiYoVD1RKHQsXCJib3JkZXJMZWZ0XCIsYyx2KSx3PVEodCxcImJvcmRlclRvcFwiLGMsdiksXCIlXCI9PT1nPyh1PTEwMCooVC9tKStcIiVcIixfPTEwMCoody9kKStcIiVcIik6XCJlbVwiPT09Zz8oeD1RKHQsXCJib3JkZXJMZWZ0XCIsMSxcImVtXCIpLHU9VC94K1wiZW1cIixfPXcveCtcImVtXCIpOih1PVQrXCJweFwiLF89dytcInB4XCIpLHkmJihwPXBhcnNlRmxvYXQodSkrZitnLGw9cGFyc2VGbG9hdChfKStmK2cpKSxhPWNlKFAsYltoXSx1K1wiIFwiK18scCtcIiBcIitsLCExLFwiMHB4XCIsYSk7cmV0dXJuIGF9LHByZWZpeDohMCxmb3JtYXR0ZXI6bGUoXCIwcHggMHB4IDBweCAwcHhcIiwhMSwhMCl9KSxkZShcImJhY2tncm91bmRQb3NpdGlvblwiLHtkZWZhdWx0VmFsdWU6XCIwIDBcIixwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxuLGEpe3ZhciBvLGgsbCxfLHUscCxjPVwiYmFja2dyb3VuZC1wb3NpdGlvblwiLG09cnx8Ryh0LG51bGwpLGQ9dGhpcy5mb3JtYXQoKG0/Zj9tLmdldFByb3BlcnR5VmFsdWUoYytcIi14XCIpK1wiIFwiK20uZ2V0UHJvcGVydHlWYWx1ZShjK1wiLXlcIik6bS5nZXRQcm9wZXJ0eVZhbHVlKGMpOnQuY3VycmVudFN0eWxlLmJhY2tncm91bmRQb3NpdGlvblgrXCIgXCIrdC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWSl8fFwiMCAwXCIpLGc9dGhpcy5mb3JtYXQoZSk7aWYoLTEhPT1kLmluZGV4T2YoXCIlXCIpIT0oLTEhPT1nLmluZGV4T2YoXCIlXCIpKSYmKHA9Vyh0LFwiYmFja2dyb3VuZEltYWdlXCIpLnJlcGxhY2UoayxcIlwiKSxwJiZcIm5vbmVcIiE9PXApKXtmb3Iobz1kLnNwbGl0KFwiIFwiKSxoPWcuc3BsaXQoXCIgXCIpLEwuc2V0QXR0cmlidXRlKFwic3JjXCIscCksbD0yOy0tbD4tMTspZD1vW2xdLF89LTEhPT1kLmluZGV4T2YoXCIlXCIpLF8hPT0oLTEhPT1oW2xdLmluZGV4T2YoXCIlXCIpKSYmKHU9MD09PWw/dC5vZmZzZXRXaWR0aC1MLndpZHRoOnQub2Zmc2V0SGVpZ2h0LUwuaGVpZ2h0LG9bbF09Xz9wYXJzZUZsb2F0KGQpLzEwMCp1K1wicHhcIjoxMDAqKHBhcnNlRmxvYXQoZCkvdSkrXCIlXCIpO2Q9by5qb2luKFwiIFwiKX1yZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSxkLGcsbixhKX0sZm9ybWF0dGVyOmVlfSksZGUoXCJiYWNrZ3JvdW5kU2l6ZVwiLHtkZWZhdWx0VmFsdWU6XCIwIDBcIixmb3JtYXR0ZXI6ZWV9KSxkZShcInBlcnNwZWN0aXZlXCIse2RlZmF1bHRWYWx1ZTpcIjBweFwiLHByZWZpeDohMH0pLGRlKFwicGVyc3BlY3RpdmVPcmlnaW5cIix7ZGVmYXVsdFZhbHVlOlwiNTAlIDUwJVwiLHByZWZpeDohMH0pLGRlKFwidHJhbnNmb3JtU3R5bGVcIix7cHJlZml4OiEwfSksZGUoXCJiYWNrZmFjZVZpc2liaWxpdHlcIix7cHJlZml4OiEwfSksZGUoXCJ1c2VyU2VsZWN0XCIse3ByZWZpeDohMH0pLGRlKFwibWFyZ2luXCIse3BhcnNlcjpfZShcIm1hcmdpblRvcCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20sbWFyZ2luTGVmdFwiKX0pLGRlKFwicGFkZGluZ1wiLHtwYXJzZXI6X2UoXCJwYWRkaW5nVG9wLHBhZGRpbmdSaWdodCxwYWRkaW5nQm90dG9tLHBhZGRpbmdMZWZ0XCIpfSksZGUoXCJjbGlwXCIse2RlZmF1bHRWYWx1ZTpcInJlY3QoMHB4LDBweCwwcHgsMHB4KVwiLHBhcnNlcjpmdW5jdGlvbih0LGUsaSxzLG4sYSl7dmFyIG8saCxsO3JldHVybiA5PmY/KGg9dC5jdXJyZW50U3R5bGUsbD04PmY/XCIgXCI6XCIsXCIsbz1cInJlY3QoXCIraC5jbGlwVG9wK2wraC5jbGlwUmlnaHQrbCtoLmNsaXBCb3R0b20rbCtoLmNsaXBMZWZ0K1wiKVwiLGU9dGhpcy5mb3JtYXQoZSkuc3BsaXQoXCIsXCIpLmpvaW4obCkpOihvPXRoaXMuZm9ybWF0KFcodCx0aGlzLnAsciwhMSx0aGlzLmRmbHQpKSxlPXRoaXMuZm9ybWF0KGUpKSx0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLG8sZSxuLGEpfX0pLGRlKFwidGV4dFNoYWRvd1wiLHtkZWZhdWx0VmFsdWU6XCIwcHggMHB4IDBweCAjOTk5XCIsY29sb3I6ITAsbXVsdGk6ITB9KSxkZShcImF1dG9Sb3VuZCxzdHJpY3RVbml0c1wiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxyKXtyZXR1cm4gcn19KSxkZShcImJvcmRlclwiLHtkZWZhdWx0VmFsdWU6XCIwcHggc29saWQgIzAwMFwiLHBhcnNlcjpmdW5jdGlvbih0LGUsaSxzLG4sYSl7cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsdGhpcy5mb3JtYXQoVyh0LFwiYm9yZGVyVG9wV2lkdGhcIixyLCExLFwiMHB4XCIpK1wiIFwiK1codCxcImJvcmRlclRvcFN0eWxlXCIsciwhMSxcInNvbGlkXCIpK1wiIFwiK1codCxcImJvcmRlclRvcENvbG9yXCIsciwhMSxcIiMwMDBcIikpLHRoaXMuZm9ybWF0KGUpLG4sYSl9LGNvbG9yOiEwLGZvcm1hdHRlcjpmdW5jdGlvbih0KXt2YXIgZT10LnNwbGl0KFwiIFwiKTtyZXR1cm4gZVswXStcIiBcIisoZVsxXXx8XCJzb2xpZFwiKStcIiBcIisodC5tYXRjaChoZSl8fFtcIiMwMDBcIl0pWzBdfX0pLGRlKFwiYm9yZGVyV2lkdGhcIix7cGFyc2VyOl9lKFwiYm9yZGVyVG9wV2lkdGgsYm9yZGVyUmlnaHRXaWR0aCxib3JkZXJCb3R0b21XaWR0aCxib3JkZXJMZWZ0V2lkdGhcIil9KSxkZShcImZsb2F0LGNzc0Zsb2F0LHN0eWxlRmxvYXRcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMscil7dmFyIG49dC5zdHlsZSxhPVwiY3NzRmxvYXRcImluIG4/XCJjc3NGbG9hdFwiOlwic3R5bGVGbG9hdFwiO3JldHVybiBuZXcgcGUobixhLDAsMCxyLC0xLGksITEsMCxuW2FdLGUpfX0pO3ZhciBEZT1mdW5jdGlvbih0KXt2YXIgZSxpPXRoaXMudCxzPWkuZmlsdGVyfHxXKHRoaXMuZGF0YSxcImZpbHRlclwiKXx8XCJcIixyPTB8dGhpcy5zK3RoaXMuYyp0OzEwMD09PXImJigtMT09PXMuaW5kZXhPZihcImF0cml4KFwiKSYmLTE9PT1zLmluZGV4T2YoXCJyYWRpZW50KFwiKSYmLTE9PT1zLmluZGV4T2YoXCJvYWRlcihcIik/KGkucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpLGU9IVcodGhpcy5kYXRhLFwiZmlsdGVyXCIpKTooaS5maWx0ZXI9cy5yZXBsYWNlKHgsXCJcIiksZT0hMCkpLGV8fCh0aGlzLnhuMSYmKGkuZmlsdGVyPXM9c3x8XCJhbHBoYShvcGFjaXR5PVwiK3IrXCIpXCIpLC0xPT09cy5pbmRleE9mKFwicGFjaXR5XCIpPzA9PT1yJiZ0aGlzLnhuMXx8KGkuZmlsdGVyPXMrXCIgYWxwaGEob3BhY2l0eT1cIityK1wiKVwiKTppLmZpbHRlcj1zLnJlcGxhY2UoVCxcIm9wYWNpdHk9XCIrcikpfTtkZShcIm9wYWNpdHksYWxwaGEsYXV0b0FscGhhXCIse2RlZmF1bHRWYWx1ZTpcIjFcIixwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxuLGEpe3ZhciBvPXBhcnNlRmxvYXQoVyh0LFwib3BhY2l0eVwiLHIsITEsXCIxXCIpKSxoPXQuc3R5bGUsbD1cImF1dG9BbHBoYVwiPT09aTtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZSYmXCI9XCI9PT1lLmNoYXJBdCgxKSYmKGU9KFwiLVwiPT09ZS5jaGFyQXQoMCk/LTE6MSkqcGFyc2VGbG9hdChlLnN1YnN0cigyKSkrbyksbCYmMT09PW8mJlwiaGlkZGVuXCI9PT1XKHQsXCJ2aXNpYmlsaXR5XCIscikmJjAhPT1lJiYobz0wKSxVP249bmV3IHBlKGgsXCJvcGFjaXR5XCIsbyxlLW8sbik6KG49bmV3IHBlKGgsXCJvcGFjaXR5XCIsMTAwKm8sMTAwKihlLW8pLG4pLG4ueG4xPWw/MTowLGguem9vbT0xLG4udHlwZT0yLG4uYj1cImFscGhhKG9wYWNpdHk9XCIrbi5zK1wiKVwiLG4uZT1cImFscGhhKG9wYWNpdHk9XCIrKG4ucytuLmMpK1wiKVwiLG4uZGF0YT10LG4ucGx1Z2luPWEsbi5zZXRSYXRpbz1EZSksbCYmKG49bmV3IHBlKGgsXCJ2aXNpYmlsaXR5XCIsMCwwLG4sLTEsbnVsbCwhMSwwLDAhPT1vP1wiaW5oZXJpdFwiOlwiaGlkZGVuXCIsMD09PWU/XCJoaWRkZW5cIjpcImluaGVyaXRcIiksbi54czA9XCJpbmhlcml0XCIscy5fb3ZlcndyaXRlUHJvcHMucHVzaChuLm4pLHMuX292ZXJ3cml0ZVByb3BzLnB1c2goaSkpLG59fSk7dmFyIE1lPWZ1bmN0aW9uKHQsZSl7ZSYmKHQucmVtb3ZlUHJvcGVydHk/KFwibXNcIj09PWUuc3Vic3RyKDAsMikmJihlPVwiTVwiK2Uuc3Vic3RyKDEpKSx0LnJlbW92ZVByb3BlcnR5KGUucmVwbGFjZShQLFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpKTp0LnJlbW92ZUF0dHJpYnV0ZShlKSl9LHplPWZ1bmN0aW9uKHQpe2lmKHRoaXMudC5fZ3NDbGFzc1BUPXRoaXMsMT09PXR8fDA9PT10KXt0aGlzLnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwwPT09dD90aGlzLmI6dGhpcy5lKTtmb3IodmFyIGU9dGhpcy5kYXRhLGk9dGhpcy50LnN0eWxlO2U7KWUudj9pW2UucF09ZS52Ok1lKGksZS5wKSxlPWUuX25leHQ7MT09PXQmJnRoaXMudC5fZ3NDbGFzc1BUPT09dGhpcyYmKHRoaXMudC5fZ3NDbGFzc1BUPW51bGwpfWVsc2UgdGhpcy50LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIT09dGhpcy5lJiZ0aGlzLnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIix0aGlzLmUpfTtkZShcImNsYXNzTmFtZVwiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLHMsbixhLG8saCl7dmFyIGwsXyx1LHAsYyxmPXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCIsbT10LnN0eWxlLmNzc1RleHQ7aWYoYT1uLl9jbGFzc05hbWVQVD1uZXcgcGUodCxzLDAsMCxhLDIpLGEuc2V0UmF0aW89emUsYS5wcj0tMTEsaT0hMCxhLmI9ZixfPSQodCxyKSx1PXQuX2dzQ2xhc3NQVCl7Zm9yKHA9e30sYz11LmRhdGE7YzspcFtjLnBdPTEsYz1jLl9uZXh0O3Uuc2V0UmF0aW8oMSl9cmV0dXJuIHQuX2dzQ2xhc3NQVD1hLGEuZT1cIj1cIiE9PWUuY2hhckF0KDEpP2U6Zi5yZXBsYWNlKFJlZ0V4cChcIlxcXFxzKlxcXFxiXCIrZS5zdWJzdHIoMikrXCJcXFxcYlwiKSxcIlwiKSsoXCIrXCI9PT1lLmNoYXJBdCgwKT9cIiBcIitlLnN1YnN0cigyKTpcIlwiKSxuLl90d2Vlbi5fZHVyYXRpb24mJih0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYS5lKSxsPUgodCxfLCQodCksaCxwKSx0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsZiksYS5kYXRhPWwuZmlyc3RNUFQsdC5zdHlsZS5jc3NUZXh0PW0sYT1hLnhmaXJzdD1uLnBhcnNlKHQsbC5kaWZzLGEsbykpLGF9fSk7dmFyIEllPWZ1bmN0aW9uKHQpe2lmKCgxPT09dHx8MD09PXQpJiZ0aGlzLmRhdGEuX3RvdGFsVGltZT09PXRoaXMuZGF0YS5fdG90YWxEdXJhdGlvbiYmXCJpc0Zyb21TdGFydFwiIT09dGhpcy5kYXRhLmRhdGEpe3ZhciBlLGkscyxyLG49dGhpcy50LnN0eWxlLGE9by50cmFuc2Zvcm0ucGFyc2U7aWYoXCJhbGxcIj09PXRoaXMuZSluLmNzc1RleHQ9XCJcIixyPSEwO2Vsc2UgZm9yKGU9dGhpcy5lLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpLnNwbGl0KFwiLFwiKSxzPWUubGVuZ3RoOy0tcz4tMTspaT1lW3NdLG9baV0mJihvW2ldLnBhcnNlPT09YT9yPSEwOmk9XCJ0cmFuc2Zvcm1PcmlnaW5cIj09PWk/d2U6b1tpXS5wKSxNZShuLGkpO3ImJihNZShuLHllKSx0aGlzLnQuX2dzVHJhbnNmb3JtJiZkZWxldGUgdGhpcy50Ll9nc1RyYW5zZm9ybSl9fTtmb3IoZGUoXCJjbGVhclByb3BzXCIse3BhcnNlcjpmdW5jdGlvbih0LGUscyxyLG4pe3JldHVybiBuPW5ldyBwZSh0LHMsMCwwLG4sMiksbi5zZXRSYXRpbz1JZSxuLmU9ZSxuLnByPS0xMCxuLmRhdGE9ci5fdHdlZW4saT0hMCxufX0pLGg9XCJiZXppZXIsdGhyb3dQcm9wcyxwaHlzaWNzUHJvcHMscGh5c2ljczJEXCIuc3BsaXQoXCIsXCIpLGZlPWgubGVuZ3RoO2ZlLS07KWdlKGhbZmVdKTtoPWEucHJvdG90eXBlLGguX2ZpcnN0UFQ9bnVsbCxoLl9vbkluaXRUd2Vlbj1mdW5jdGlvbih0LGUsbyl7aWYoIXQubm9kZVR5cGUpcmV0dXJuITE7dGhpcy5fdGFyZ2V0PXQsdGhpcy5fdHdlZW49byx0aGlzLl92YXJzPWUsbD1lLmF1dG9Sb3VuZCxpPSExLHM9ZS5zdWZmaXhNYXB8fGEuc3VmZml4TWFwLHI9Ryh0LFwiXCIpLG49dGhpcy5fb3ZlcndyaXRlUHJvcHM7dmFyIGgscCxmLG0sZCxnLHYseSxULHg9dC5zdHlsZTtpZihfJiZcIlwiPT09eC56SW5kZXgmJihoPVcodCxcInpJbmRleFwiLHIpLChcImF1dG9cIj09PWh8fFwiXCI9PT1oKSYmdGhpcy5fYWRkTGF6eVNldCh4LFwiekluZGV4XCIsMCkpLFwic3RyaW5nXCI9PXR5cGVvZiBlJiYobT14LmNzc1RleHQsaD0kKHQscikseC5jc3NUZXh0PW0rXCI7XCIrZSxoPUgodCxoLCQodCkpLmRpZnMsIVUmJncudGVzdChlKSYmKGgub3BhY2l0eT1wYXJzZUZsb2F0KFJlZ0V4cC4kMSkpLGU9aCx4LmNzc1RleHQ9bSksdGhpcy5fZmlyc3RQVD1wPXRoaXMucGFyc2UodCxlLG51bGwpLHRoaXMuX3RyYW5zZm9ybVR5cGUpe2ZvcihUPTM9PT10aGlzLl90cmFuc2Zvcm1UeXBlLHllP3UmJihfPSEwLFwiXCI9PT14LnpJbmRleCYmKHY9Vyh0LFwiekluZGV4XCIsciksKFwiYXV0b1wiPT09dnx8XCJcIj09PXYpJiZ0aGlzLl9hZGRMYXp5U2V0KHgsXCJ6SW5kZXhcIiwwKSksYyYmdGhpcy5fYWRkTGF6eVNldCh4LFwiV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5XCIsdGhpcy5fdmFycy5XZWJraXRCYWNrZmFjZVZpc2liaWxpdHl8fChUP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpKSk6eC56b29tPTEsZj1wO2YmJmYuX25leHQ7KWY9Zi5fbmV4dDt5PW5ldyBwZSh0LFwidHJhbnNmb3JtXCIsMCwwLG51bGwsMiksdGhpcy5fbGlua0NTU1AoeSxudWxsLGYpLHkuc2V0UmF0aW89VCYmeGU/T2U6eWU/Q2U6QWUseS5kYXRhPXRoaXMuX3RyYW5zZm9ybXx8UmUodCxyLCEwKSxuLnBvcCgpXG59aWYoaSl7Zm9yKDtwOyl7Zm9yKGc9cC5fbmV4dCxmPW07ZiYmZi5wcj5wLnByOylmPWYuX25leHQ7KHAuX3ByZXY9Zj9mLl9wcmV2OmQpP3AuX3ByZXYuX25leHQ9cDptPXAsKHAuX25leHQ9Zik/Zi5fcHJldj1wOmQ9cCxwPWd9dGhpcy5fZmlyc3RQVD1tfXJldHVybiEwfSxoLnBhcnNlPWZ1bmN0aW9uKHQsZSxpLG4pe3ZhciBhLGgsXyx1LHAsYyxmLG0sZCxnLHY9dC5zdHlsZTtmb3IoYSBpbiBlKWM9ZVthXSxoPW9bYV0saD9pPWgucGFyc2UodCxjLGEsdGhpcyxpLG4sZSk6KHA9Vyh0LGEscikrXCJcIixkPVwic3RyaW5nXCI9PXR5cGVvZiBjLFwiY29sb3JcIj09PWF8fFwiZmlsbFwiPT09YXx8XCJzdHJva2VcIj09PWF8fC0xIT09YS5pbmRleE9mKFwiQ29sb3JcIil8fGQmJmIudGVzdChjKT8oZHx8KGM9b2UoYyksYz0oYy5sZW5ndGg+Mz9cInJnYmEoXCI6XCJyZ2IoXCIpK2Muam9pbihcIixcIikrXCIpXCIpLGk9Y2UodixhLHAsYywhMCxcInRyYW5zcGFyZW50XCIsaSwwLG4pKTohZHx8LTE9PT1jLmluZGV4T2YoXCIgXCIpJiYtMT09PWMuaW5kZXhPZihcIixcIik/KF89cGFyc2VGbG9hdChwKSxmPV98fDA9PT1fP3Auc3Vic3RyKChfK1wiXCIpLmxlbmd0aCk6XCJcIiwoXCJcIj09PXB8fFwiYXV0b1wiPT09cCkmJihcIndpZHRoXCI9PT1hfHxcImhlaWdodFwiPT09YT8oXz10ZSh0LGEsciksZj1cInB4XCIpOlwibGVmdFwiPT09YXx8XCJ0b3BcIj09PWE/KF89Wih0LGEsciksZj1cInB4XCIpOihfPVwib3BhY2l0eVwiIT09YT8wOjEsZj1cIlwiKSksZz1kJiZcIj1cIj09PWMuY2hhckF0KDEpLGc/KHU9cGFyc2VJbnQoYy5jaGFyQXQoMCkrXCIxXCIsMTApLGM9Yy5zdWJzdHIoMiksdSo9cGFyc2VGbG9hdChjKSxtPWMucmVwbGFjZSh5LFwiXCIpKToodT1wYXJzZUZsb2F0KGMpLG09ZD9jLnN1YnN0cigodStcIlwiKS5sZW5ndGgpfHxcIlwiOlwiXCIpLFwiXCI9PT1tJiYobT1hIGluIHM/c1thXTpmKSxjPXV8fDA9PT11PyhnP3UrXzp1KSttOmVbYV0sZiE9PW0mJlwiXCIhPT1tJiYodXx8MD09PXUpJiZfJiYoXz1RKHQsYSxfLGYpLFwiJVwiPT09bT8oXy89USh0LGEsMTAwLFwiJVwiKS8xMDAsZS5zdHJpY3RVbml0cyE9PSEwJiYocD1fK1wiJVwiKSk6XCJlbVwiPT09bT9fLz1RKHQsYSwxLFwiZW1cIik6XCJweFwiIT09bSYmKHU9USh0LGEsdSxtKSxtPVwicHhcIiksZyYmKHV8fDA9PT11KSYmKGM9dStfK20pKSxnJiYodSs9XyksIV8mJjAhPT1ffHwhdSYmMCE9PXU/dm9pZCAwIT09dlthXSYmKGN8fFwiTmFOXCIhPWMrXCJcIiYmbnVsbCE9Yyk/KGk9bmV3IHBlKHYsYSx1fHxffHwwLDAsaSwtMSxhLCExLDAscCxjKSxpLnhzMD1cIm5vbmVcIiE9PWN8fFwiZGlzcGxheVwiIT09YSYmLTE9PT1hLmluZGV4T2YoXCJTdHlsZVwiKT9jOnApOmooXCJpbnZhbGlkIFwiK2ErXCIgdHdlZW4gdmFsdWU6IFwiK2VbYV0pOihpPW5ldyBwZSh2LGEsXyx1LV8saSwwLGEsbCE9PSExJiYoXCJweFwiPT09bXx8XCJ6SW5kZXhcIj09PWEpLDAscCxjKSxpLnhzMD1tKSk6aT1jZSh2LGEscCxjLCEwLG51bGwsaSwwLG4pKSxuJiZpJiYhaS5wbHVnaW4mJihpLnBsdWdpbj1uKTtyZXR1cm4gaX0saC5zZXRSYXRpbz1mdW5jdGlvbih0KXt2YXIgZSxpLHMscj10aGlzLl9maXJzdFBULG49MWUtNjtpZigxIT09dHx8dGhpcy5fdHdlZW4uX3RpbWUhPT10aGlzLl90d2Vlbi5fZHVyYXRpb24mJjAhPT10aGlzLl90d2Vlbi5fdGltZSlpZih0fHx0aGlzLl90d2Vlbi5fdGltZSE9PXRoaXMuX3R3ZWVuLl9kdXJhdGlvbiYmMCE9PXRoaXMuX3R3ZWVuLl90aW1lfHx0aGlzLl90d2Vlbi5fcmF3UHJldlRpbWU9PT0tMWUtNilmb3IoO3I7KXtpZihlPXIuYyp0K3IucyxyLnI/ZT1NYXRoLnJvdW5kKGUpOm4+ZSYmZT4tbiYmKGU9MCksci50eXBlKWlmKDE9PT1yLnR5cGUpaWYocz1yLmwsMj09PXMpci50W3IucF09ci54czArZStyLnhzMStyLnhuMStyLnhzMjtlbHNlIGlmKDM9PT1zKXIudFtyLnBdPXIueHMwK2Urci54czErci54bjErci54czIrci54bjIrci54czM7ZWxzZSBpZig0PT09cylyLnRbci5wXT1yLnhzMCtlK3IueHMxK3IueG4xK3IueHMyK3IueG4yK3IueHMzK3IueG4zK3IueHM0O2Vsc2UgaWYoNT09PXMpci50W3IucF09ci54czArZStyLnhzMStyLnhuMStyLnhzMityLnhuMityLnhzMytyLnhuMytyLnhzNCtyLnhuNCtyLnhzNTtlbHNle2ZvcihpPXIueHMwK2Urci54czEscz0xO3IubD5zO3MrKylpKz1yW1wieG5cIitzXStyW1wieHNcIisocysxKV07ci50W3IucF09aX1lbHNlLTE9PT1yLnR5cGU/ci50W3IucF09ci54czA6ci5zZXRSYXRpbyYmci5zZXRSYXRpbyh0KTtlbHNlIHIudFtyLnBdPWUrci54czA7cj1yLl9uZXh0fWVsc2UgZm9yKDtyOykyIT09ci50eXBlP3IudFtyLnBdPXIuYjpyLnNldFJhdGlvKHQpLHI9ci5fbmV4dDtlbHNlIGZvcig7cjspMiE9PXIudHlwZT9yLnRbci5wXT1yLmU6ci5zZXRSYXRpbyh0KSxyPXIuX25leHR9LGguX2VuYWJsZVRyYW5zZm9ybXM9ZnVuY3Rpb24odCl7dGhpcy5fdHJhbnNmb3JtPXRoaXMuX3RyYW5zZm9ybXx8UmUodGhpcy5fdGFyZ2V0LHIsITApLHRoaXMuX3RyYW5zZm9ybVR5cGU9dGhpcy5fdHJhbnNmb3JtLnN2ZyYmU2V8fCF0JiYzIT09dGhpcy5fdHJhbnNmb3JtVHlwZT8yOjN9O3ZhciBFZT1mdW5jdGlvbigpe3RoaXMudFt0aGlzLnBdPXRoaXMuZSx0aGlzLmRhdGEuX2xpbmtDU1NQKHRoaXMsdGhpcy5fbmV4dCxudWxsLCEwKX07aC5fYWRkTGF6eVNldD1mdW5jdGlvbih0LGUsaSl7dmFyIHM9dGhpcy5fZmlyc3RQVD1uZXcgcGUodCxlLDAsMCx0aGlzLl9maXJzdFBULDIpO3MuZT1pLHMuc2V0UmF0aW89RWUscy5kYXRhPXRoaXN9LGguX2xpbmtDU1NQPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiB0JiYoZSYmKGUuX3ByZXY9dCksdC5fbmV4dCYmKHQuX25leHQuX3ByZXY9dC5fcHJldiksdC5fcHJldj90Ll9wcmV2Ll9uZXh0PXQuX25leHQ6dGhpcy5fZmlyc3RQVD09PXQmJih0aGlzLl9maXJzdFBUPXQuX25leHQscz0hMCksaT9pLl9uZXh0PXQ6c3x8bnVsbCE9PXRoaXMuX2ZpcnN0UFR8fCh0aGlzLl9maXJzdFBUPXQpLHQuX25leHQ9ZSx0Ll9wcmV2PWkpLHR9LGguX2tpbGw9ZnVuY3Rpb24oZSl7dmFyIGkscyxyLG49ZTtpZihlLmF1dG9BbHBoYXx8ZS5hbHBoYSl7bj17fTtmb3IocyBpbiBlKW5bc109ZVtzXTtuLm9wYWNpdHk9MSxuLmF1dG9BbHBoYSYmKG4udmlzaWJpbGl0eT0xKX1yZXR1cm4gZS5jbGFzc05hbWUmJihpPXRoaXMuX2NsYXNzTmFtZVBUKSYmKHI9aS54Zmlyc3QsciYmci5fcHJldj90aGlzLl9saW5rQ1NTUChyLl9wcmV2LGkuX25leHQsci5fcHJldi5fcHJldik6cj09PXRoaXMuX2ZpcnN0UFQmJih0aGlzLl9maXJzdFBUPWkuX25leHQpLGkuX25leHQmJnRoaXMuX2xpbmtDU1NQKGkuX25leHQsaS5fbmV4dC5fbmV4dCxyLl9wcmV2KSx0aGlzLl9jbGFzc05hbWVQVD1udWxsKSx0LnByb3RvdHlwZS5fa2lsbC5jYWxsKHRoaXMsbil9O3ZhciBGZT1mdW5jdGlvbih0LGUsaSl7dmFyIHMscixuLGE7aWYodC5zbGljZSlmb3Iocj10Lmxlbmd0aDstLXI+LTE7KUZlKHRbcl0sZSxpKTtlbHNlIGZvcihzPXQuY2hpbGROb2RlcyxyPXMubGVuZ3RoOy0tcj4tMTspbj1zW3JdLGE9bi50eXBlLG4uc3R5bGUmJihlLnB1c2goJChuKSksaSYmaS5wdXNoKG4pKSwxIT09YSYmOSE9PWEmJjExIT09YXx8IW4uY2hpbGROb2Rlcy5sZW5ndGh8fEZlKG4sZSxpKX07cmV0dXJuIGEuY2FzY2FkZVRvPWZ1bmN0aW9uKHQsaSxzKXt2YXIgcixuLGEsbz1lLnRvKHQsaSxzKSxoPVtvXSxsPVtdLF89W10sdT1bXSxwPWUuX2ludGVybmFscy5yZXNlcnZlZFByb3BzO2Zvcih0PW8uX3RhcmdldHN8fG8udGFyZ2V0LEZlKHQsbCx1KSxvLnJlbmRlcihpLCEwKSxGZSh0LF8pLG8ucmVuZGVyKDAsITApLG8uX2VuYWJsZWQoITApLHI9dS5sZW5ndGg7LS1yPi0xOylpZihuPUgodVtyXSxsW3JdLF9bcl0pLG4uZmlyc3RNUFQpe249bi5kaWZzO2ZvcihhIGluIHMpcFthXSYmKG5bYV09c1thXSk7aC5wdXNoKGUudG8odVtyXSxpLG4pKX1yZXR1cm4gaH0sdC5hY3RpdmF0ZShbYV0pLGF9LCEwKSxmdW5jdGlvbigpe3ZhciB0PV9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe3Byb3BOYW1lOlwicm91bmRQcm9wc1wiLHByaW9yaXR5Oi0xLEFQSToyLGluaXQ6ZnVuY3Rpb24odCxlLGkpe3JldHVybiB0aGlzLl90d2Vlbj1pLCEwfX0pLGU9dC5wcm90b3R5cGU7ZS5fb25Jbml0QWxsUHJvcHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQsZSxpLHM9dGhpcy5fdHdlZW4scj1zLnZhcnMucm91bmRQcm9wcyBpbnN0YW5jZW9mIEFycmF5P3MudmFycy5yb3VuZFByb3BzOnMudmFycy5yb3VuZFByb3BzLnNwbGl0KFwiLFwiKSxuPXIubGVuZ3RoLGE9e30sbz1zLl9wcm9wTG9va3VwLnJvdW5kUHJvcHM7LS1uPi0xOylhW3Jbbl1dPTE7Zm9yKG49ci5sZW5ndGg7LS1uPi0xOylmb3IodD1yW25dLGU9cy5fZmlyc3RQVDtlOylpPWUuX25leHQsZS5wZz9lLnQuX3JvdW5kUHJvcHMoYSwhMCk6ZS5uPT09dCYmKHRoaXMuX2FkZChlLnQsdCxlLnMsZS5jKSxpJiYoaS5fcHJldj1lLl9wcmV2KSxlLl9wcmV2P2UuX3ByZXYuX25leHQ9aTpzLl9maXJzdFBUPT09ZSYmKHMuX2ZpcnN0UFQ9aSksZS5fbmV4dD1lLl9wcmV2PW51bGwscy5fcHJvcExvb2t1cFt0XT1vKSxlPWk7cmV0dXJuITF9LGUuX2FkZD1mdW5jdGlvbih0LGUsaSxzKXt0aGlzLl9hZGRUd2Vlbih0LGUsaSxpK3MsZSwhMCksdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChlKX19KCksX2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7cHJvcE5hbWU6XCJhdHRyXCIsQVBJOjIsdmVyc2lvbjpcIjAuMy4zXCIsaW5pdDpmdW5jdGlvbih0LGUpe3ZhciBpLHMscjtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0LnNldEF0dHJpYnV0ZSlyZXR1cm4hMTt0aGlzLl90YXJnZXQ9dCx0aGlzLl9wcm94eT17fSx0aGlzLl9zdGFydD17fSx0aGlzLl9lbmQ9e307Zm9yKGkgaW4gZSl0aGlzLl9zdGFydFtpXT10aGlzLl9wcm94eVtpXT1zPXQuZ2V0QXR0cmlidXRlKGkpLHI9dGhpcy5fYWRkVHdlZW4odGhpcy5fcHJveHksaSxwYXJzZUZsb2F0KHMpLGVbaV0saSksdGhpcy5fZW5kW2ldPXI/ci5zK3IuYzplW2ldLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goaSk7cmV0dXJuITB9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9zdXBlci5zZXRSYXRpby5jYWxsKHRoaXMsdCk7Zm9yKHZhciBlLGk9dGhpcy5fb3ZlcndyaXRlUHJvcHMscz1pLmxlbmd0aCxyPTE9PT10P3RoaXMuX2VuZDp0P3RoaXMuX3Byb3h5OnRoaXMuX3N0YXJ0Oy0tcz4tMTspZT1pW3NdLHRoaXMuX3RhcmdldC5zZXRBdHRyaWJ1dGUoZSxyW2VdK1wiXCIpfX0pLF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe3Byb3BOYW1lOlwiZGlyZWN0aW9uYWxSb3RhdGlvblwiLHZlcnNpb246XCIwLjIuMVwiLEFQSToyLGluaXQ6ZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiIT10eXBlb2YgZSYmKGU9e3JvdGF0aW9uOmV9KSx0aGlzLmZpbmFscz17fTt2YXIgaSxzLHIsbixhLG8saD1lLnVzZVJhZGlhbnM9PT0hMD8yKk1hdGguUEk6MzYwLGw9MWUtNjtmb3IoaSBpbiBlKVwidXNlUmFkaWFuc1wiIT09aSYmKG89KGVbaV0rXCJcIikuc3BsaXQoXCJfXCIpLHM9b1swXSxyPXBhcnNlRmxvYXQoXCJmdW5jdGlvblwiIT10eXBlb2YgdFtpXT90W2ldOnRbaS5pbmRleE9mKFwic2V0XCIpfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0W1wiZ2V0XCIraS5zdWJzdHIoMyldP2k6XCJnZXRcIitpLnN1YnN0cigzKV0oKSksbj10aGlzLmZpbmFsc1tpXT1cInN0cmluZ1wiPT10eXBlb2YgcyYmXCI9XCI9PT1zLmNoYXJBdCgxKT9yK3BhcnNlSW50KHMuY2hhckF0KDApK1wiMVwiLDEwKSpOdW1iZXIocy5zdWJzdHIoMikpOk51bWJlcihzKXx8MCxhPW4tcixvLmxlbmd0aCYmKHM9by5qb2luKFwiX1wiKSwtMSE9PXMuaW5kZXhPZihcInNob3J0XCIpJiYoYSU9aCxhIT09YSUoaC8yKSYmKGE9MD5hP2EraDphLWgpKSwtMSE9PXMuaW5kZXhPZihcIl9jd1wiKSYmMD5hP2E9KGErOTk5OTk5OTk5OSpoKSVoLSgwfGEvaCkqaDotMSE9PXMuaW5kZXhPZihcImNjd1wiKSYmYT4wJiYoYT0oYS05OTk5OTk5OTk5KmgpJWgtKDB8YS9oKSpoKSksKGE+bHx8LWw+YSkmJih0aGlzLl9hZGRUd2Vlbih0LGkscixyK2EsaSksdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChpKSkpO3JldHVybiEwfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU7aWYoMSE9PXQpdGhpcy5fc3VwZXIuc2V0UmF0aW8uY2FsbCh0aGlzLHQpO2Vsc2UgZm9yKGU9dGhpcy5fZmlyc3RQVDtlOyllLmY/ZS50W2UucF0odGhpcy5maW5hbHNbZS5wXSk6ZS50W2UucF09dGhpcy5maW5hbHNbZS5wXSxlPWUuX25leHR9fSkuX2F1dG9DU1M9ITAsX2dzU2NvcGUuX2dzRGVmaW5lKFwiZWFzaW5nLkJhY2tcIixbXCJlYXNpbmcuRWFzZVwiXSxmdW5jdGlvbih0KXt2YXIgZSxpLHMscj1fZ3NTY29wZS5HcmVlblNvY2tHbG9iYWxzfHxfZ3NTY29wZSxuPXIuY29tLmdyZWVuc29jayxhPTIqTWF0aC5QSSxvPU1hdGguUEkvMixoPW4uX2NsYXNzLGw9ZnVuY3Rpb24oZSxpKXt2YXIgcz1oKFwiZWFzaW5nLlwiK2UsZnVuY3Rpb24oKXt9LCEwKSxyPXMucHJvdG90eXBlPW5ldyB0O3JldHVybiByLmNvbnN0cnVjdG9yPXMsci5nZXRSYXRpbz1pLHN9LF89dC5yZWdpc3Rlcnx8ZnVuY3Rpb24oKXt9LHU9ZnVuY3Rpb24odCxlLGkscyl7dmFyIHI9aChcImVhc2luZy5cIit0LHtlYXNlT3V0Om5ldyBlLGVhc2VJbjpuZXcgaSxlYXNlSW5PdXQ6bmV3IHN9LCEwKTtyZXR1cm4gXyhyLHQpLHJ9LHA9ZnVuY3Rpb24odCxlLGkpe3RoaXMudD10LHRoaXMudj1lLGkmJih0aGlzLm5leHQ9aSxpLnByZXY9dGhpcyx0aGlzLmM9aS52LWUsdGhpcy5nYXA9aS50LXQpfSxjPWZ1bmN0aW9uKGUsaSl7dmFyIHM9aChcImVhc2luZy5cIitlLGZ1bmN0aW9uKHQpe3RoaXMuX3AxPXR8fDA9PT10P3Q6MS43MDE1OCx0aGlzLl9wMj0xLjUyNSp0aGlzLl9wMX0sITApLHI9cy5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIHIuY29uc3RydWN0b3I9cyxyLmdldFJhdGlvPWksci5jb25maWc9ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBzKHQpfSxzfSxmPXUoXCJCYWNrXCIsYyhcIkJhY2tPdXRcIixmdW5jdGlvbih0KXtyZXR1cm4odC09MSkqdCooKHRoaXMuX3AxKzEpKnQrdGhpcy5fcDEpKzF9KSxjKFwiQmFja0luXCIsZnVuY3Rpb24odCl7cmV0dXJuIHQqdCooKHRoaXMuX3AxKzEpKnQtdGhpcy5fcDEpfSksYyhcIkJhY2tJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8uNSp0KnQqKCh0aGlzLl9wMisxKSp0LXRoaXMuX3AyKTouNSooKHQtPTIpKnQqKCh0aGlzLl9wMisxKSp0K3RoaXMuX3AyKSsyKX0pKSxtPWgoXCJlYXNpbmcuU2xvd01vXCIsZnVuY3Rpb24odCxlLGkpe2U9ZXx8MD09PWU/ZTouNyxudWxsPT10P3Q9Ljc6dD4xJiYodD0xKSx0aGlzLl9wPTEhPT10P2U6MCx0aGlzLl9wMT0oMS10KS8yLHRoaXMuX3AyPXQsdGhpcy5fcDM9dGhpcy5fcDErdGhpcy5fcDIsdGhpcy5fY2FsY0VuZD1pPT09ITB9LCEwKSxkPW0ucHJvdG90eXBlPW5ldyB0O3JldHVybiBkLmNvbnN0cnVjdG9yPW0sZC5nZXRSYXRpbz1mdW5jdGlvbih0KXt2YXIgZT10KyguNS10KSp0aGlzLl9wO3JldHVybiB0aGlzLl9wMT50P3RoaXMuX2NhbGNFbmQ/MS0odD0xLXQvdGhpcy5fcDEpKnQ6ZS0odD0xLXQvdGhpcy5fcDEpKnQqdCp0KmU6dD50aGlzLl9wMz90aGlzLl9jYWxjRW5kPzEtKHQ9KHQtdGhpcy5fcDMpL3RoaXMuX3AxKSp0OmUrKHQtZSkqKHQ9KHQtdGhpcy5fcDMpL3RoaXMuX3AxKSp0KnQqdDp0aGlzLl9jYWxjRW5kPzE6ZX0sbS5lYXNlPW5ldyBtKC43LC43KSxkLmNvbmZpZz1tLmNvbmZpZz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIG5ldyBtKHQsZSxpKX0sZT1oKFwiZWFzaW5nLlN0ZXBwZWRFYXNlXCIsZnVuY3Rpb24odCl7dD10fHwxLHRoaXMuX3AxPTEvdCx0aGlzLl9wMj10KzF9LCEwKSxkPWUucHJvdG90eXBlPW5ldyB0LGQuY29uc3RydWN0b3I9ZSxkLmdldFJhdGlvPWZ1bmN0aW9uKHQpe3JldHVybiAwPnQ/dD0wOnQ+PTEmJih0PS45OTk5OTk5OTkpLCh0aGlzLl9wMip0Pj4wKSp0aGlzLl9wMX0sZC5jb25maWc9ZS5jb25maWc9ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBlKHQpfSxpPWgoXCJlYXNpbmcuUm91Z2hFYXNlXCIsZnVuY3Rpb24oZSl7ZT1lfHx7fTtmb3IodmFyIGkscyxyLG4sYSxvLGg9ZS50YXBlcnx8XCJub25lXCIsbD1bXSxfPTAsdT0wfChlLnBvaW50c3x8MjApLGM9dSxmPWUucmFuZG9taXplIT09ITEsbT1lLmNsYW1wPT09ITAsZD1lLnRlbXBsYXRlIGluc3RhbmNlb2YgdD9lLnRlbXBsYXRlOm51bGwsZz1cIm51bWJlclwiPT10eXBlb2YgZS5zdHJlbmd0aD8uNCplLnN0cmVuZ3RoOi40Oy0tYz4tMTspaT1mP01hdGgucmFuZG9tKCk6MS91KmMscz1kP2QuZ2V0UmF0aW8oaSk6aSxcIm5vbmVcIj09PWg/cj1nOlwib3V0XCI9PT1oPyhuPTEtaSxyPW4qbipnKTpcImluXCI9PT1oP3I9aSppKmc6LjU+aT8obj0yKmkscj0uNSpuKm4qZyk6KG49MiooMS1pKSxyPS41Km4qbipnKSxmP3MrPU1hdGgucmFuZG9tKCkqci0uNSpyOmMlMj9zKz0uNSpyOnMtPS41KnIsbSYmKHM+MT9zPTE6MD5zJiYocz0wKSksbFtfKytdPXt4OmkseTpzfTtmb3IobC5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQueC1lLnh9KSxvPW5ldyBwKDEsMSxudWxsKSxjPXU7LS1jPi0xOylhPWxbY10sbz1uZXcgcChhLngsYS55LG8pO3RoaXMuX3ByZXY9bmV3IHAoMCwwLDAhPT1vLnQ/bzpvLm5leHQpfSwhMCksZD1pLnByb3RvdHlwZT1uZXcgdCxkLmNvbnN0cnVjdG9yPWksZC5nZXRSYXRpbz1mdW5jdGlvbih0KXt2YXIgZT10aGlzLl9wcmV2O2lmKHQ+ZS50KXtmb3IoO2UubmV4dCYmdD49ZS50OyllPWUubmV4dDtlPWUucHJldn1lbHNlIGZvcig7ZS5wcmV2JiZlLnQ+PXQ7KWU9ZS5wcmV2O3JldHVybiB0aGlzLl9wcmV2PWUsZS52Kyh0LWUudCkvZS5nYXAqZS5jfSxkLmNvbmZpZz1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IGkodCl9LGkuZWFzZT1uZXcgaSx1KFwiQm91bmNlXCIsbChcIkJvdW5jZU91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxLzIuNzU+dD83LjU2MjUqdCp0OjIvMi43NT50PzcuNTYyNSoodC09MS41LzIuNzUpKnQrLjc1OjIuNS8yLjc1PnQ/Ny41NjI1Kih0LT0yLjI1LzIuNzUpKnQrLjkzNzU6Ny41NjI1Kih0LT0yLjYyNS8yLjc1KSp0Ky45ODQzNzV9KSxsKFwiQm91bmNlSW5cIixmdW5jdGlvbih0KXtyZXR1cm4gMS8yLjc1Pih0PTEtdCk/MS03LjU2MjUqdCp0OjIvMi43NT50PzEtKDcuNTYyNSoodC09MS41LzIuNzUpKnQrLjc1KToyLjUvMi43NT50PzEtKDcuNTYyNSoodC09Mi4yNS8yLjc1KSp0Ky45Mzc1KToxLSg3LjU2MjUqKHQtPTIuNjI1LzIuNzUpKnQrLjk4NDM3NSl9KSxsKFwiQm91bmNlSW5PdXRcIixmdW5jdGlvbih0KXt2YXIgZT0uNT50O3JldHVybiB0PWU/MS0yKnQ6Mip0LTEsdD0xLzIuNzU+dD83LjU2MjUqdCp0OjIvMi43NT50PzcuNTYyNSoodC09MS41LzIuNzUpKnQrLjc1OjIuNS8yLjc1PnQ/Ny41NjI1Kih0LT0yLjI1LzIuNzUpKnQrLjkzNzU6Ny41NjI1Kih0LT0yLjYyNS8yLjc1KSp0Ky45ODQzNzUsZT8uNSooMS10KTouNSp0Ky41fSkpLHUoXCJDaXJjXCIsbChcIkNpcmNPdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zcXJ0KDEtKHQtPTEpKnQpfSksbChcIkNpcmNJblwiLGZ1bmN0aW9uKHQpe3JldHVybi0oTWF0aC5zcXJ0KDEtdCp0KS0xKX0pLGwoXCJDaXJjSW5PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMT4odCo9Mik/LS41KihNYXRoLnNxcnQoMS10KnQpLTEpOi41KihNYXRoLnNxcnQoMS0odC09MikqdCkrMSl9KSkscz1mdW5jdGlvbihlLGkscyl7dmFyIHI9aChcImVhc2luZy5cIitlLGZ1bmN0aW9uKHQsZSl7dGhpcy5fcDE9dHx8MSx0aGlzLl9wMj1lfHxzLHRoaXMuX3AzPXRoaXMuX3AyL2EqKE1hdGguYXNpbigxL3RoaXMuX3AxKXx8MCl9LCEwKSxuPXIucHJvdG90eXBlPW5ldyB0O3JldHVybiBuLmNvbnN0cnVjdG9yPXIsbi5nZXRSYXRpbz1pLG4uY29uZmlnPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG5ldyByKHQsZSl9LHJ9LHUoXCJFbGFzdGljXCIscyhcIkVsYXN0aWNPdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fcDEqTWF0aC5wb3coMiwtMTAqdCkqTWF0aC5zaW4oKHQtdGhpcy5fcDMpKmEvdGhpcy5fcDIpKzF9LC4zKSxzKFwiRWxhc3RpY0luXCIsZnVuY3Rpb24odCl7cmV0dXJuLSh0aGlzLl9wMSpNYXRoLnBvdygyLDEwKih0LT0xKSkqTWF0aC5zaW4oKHQtdGhpcy5fcDMpKmEvdGhpcy5fcDIpKX0sLjMpLHMoXCJFbGFzdGljSW5PdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gMT4odCo9Mik/LS41KnRoaXMuX3AxKk1hdGgucG93KDIsMTAqKHQtPTEpKSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMik6LjUqdGhpcy5fcDEqTWF0aC5wb3coMiwtMTAqKHQtPTEpKSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMikrMX0sLjQ1KSksdShcIkV4cG9cIixsKFwiRXhwb091dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxLU1hdGgucG93KDIsLTEwKnQpfSksbChcIkV4cG9JblwiLGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnBvdygyLDEwKih0LTEpKS0uMDAxfSksbChcIkV4cG9Jbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8uNSpNYXRoLnBvdygyLDEwKih0LTEpKTouNSooMi1NYXRoLnBvdygyLC0xMCoodC0xKSkpfSkpLHUoXCJTaW5lXCIsbChcIlNpbmVPdXRcIixmdW5jdGlvbih0KXtyZXR1cm4gTWF0aC5zaW4odCpvKX0pLGwoXCJTaW5lSW5cIixmdW5jdGlvbih0KXtyZXR1cm4tTWF0aC5jb3ModCpvKSsxfSksbChcIlNpbmVJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybi0uNSooTWF0aC5jb3MoTWF0aC5QSSp0KS0xKX0pKSxoKFwiZWFzaW5nLkVhc2VMb29rdXBcIix7ZmluZDpmdW5jdGlvbihlKXtyZXR1cm4gdC5tYXBbZV19fSwhMCksXyhyLlNsb3dNbyxcIlNsb3dNb1wiLFwiZWFzZSxcIiksXyhpLFwiUm91Z2hFYXNlXCIsXCJlYXNlLFwiKSxfKGUsXCJTdGVwcGVkRWFzZVwiLFwiZWFzZSxcIiksZn0sITApfSksX2dzU2NvcGUuX2dzRGVmaW5lJiZfZ3NTY29wZS5fZ3NRdWV1ZS5wb3AoKSgpLGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9dC5HcmVlblNvY2tHbG9iYWxzPXQuR3JlZW5Tb2NrR2xvYmFsc3x8dDtpZighaS5Ud2VlbkxpdGUpe3ZhciBzLHIsbixhLG8saD1mdW5jdGlvbih0KXt2YXIgZSxzPXQuc3BsaXQoXCIuXCIpLHI9aTtmb3IoZT0wO3MubGVuZ3RoPmU7ZSsrKXJbc1tlXV09cj1yW3NbZV1dfHx7fTtyZXR1cm4gcn0sbD1oKFwiY29tLmdyZWVuc29ja1wiKSxfPTFlLTEwLHU9ZnVuY3Rpb24odCl7dmFyIGUsaT1bXSxzPXQubGVuZ3RoO2ZvcihlPTA7ZSE9PXM7aS5wdXNoKHRbZSsrXSkpO3JldHVybiBpfSxwPWZ1bmN0aW9uKCl7fSxjPWZ1bmN0aW9uKCl7dmFyIHQ9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxlPXQuY2FsbChbXSk7cmV0dXJuIGZ1bmN0aW9uKGkpe3JldHVybiBudWxsIT1pJiYoaSBpbnN0YW5jZW9mIEFycmF5fHxcIm9iamVjdFwiPT10eXBlb2YgaSYmISFpLnB1c2gmJnQuY2FsbChpKT09PWUpfX0oKSxmPXt9LG09ZnVuY3Rpb24ocyxyLG4sYSl7dGhpcy5zYz1mW3NdP2Zbc10uc2M6W10sZltzXT10aGlzLHRoaXMuZ3NDbGFzcz1udWxsLHRoaXMuZnVuYz1uO3ZhciBvPVtdO3RoaXMuY2hlY2s9ZnVuY3Rpb24obCl7Zm9yKHZhciBfLHUscCxjLGQ9ci5sZW5ndGgsZz1kOy0tZD4tMTspKF89ZltyW2RdXXx8bmV3IG0ocltkXSxbXSkpLmdzQ2xhc3M/KG9bZF09Xy5nc0NsYXNzLGctLSk6bCYmXy5zYy5wdXNoKHRoaXMpO2lmKDA9PT1nJiZuKWZvcih1PShcImNvbS5ncmVlbnNvY2suXCIrcykuc3BsaXQoXCIuXCIpLHA9dS5wb3AoKSxjPWgodS5qb2luKFwiLlwiKSlbcF09dGhpcy5nc0NsYXNzPW4uYXBwbHkobixvKSxhJiYoaVtwXT1jLFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoKHQuR3JlZW5Tb2NrQU1EUGF0aD90LkdyZWVuU29ja0FNRFBhdGgrXCIvXCI6XCJcIikrcy5zcGxpdChcIi5cIikucG9wKCksW10sZnVuY3Rpb24oKXtyZXR1cm4gY30pOnM9PT1lJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPWMpKSxkPTA7dGhpcy5zYy5sZW5ndGg+ZDtkKyspdGhpcy5zY1tkXS5jaGVjaygpfSx0aGlzLmNoZWNrKCEwKX0sZD10Ll9nc0RlZmluZT1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gbmV3IG0odCxlLGkscyl9LGc9bC5fY2xhc3M9ZnVuY3Rpb24odCxlLGkpe3JldHVybiBlPWV8fGZ1bmN0aW9uKCl7fSxkKHQsW10sZnVuY3Rpb24oKXtyZXR1cm4gZX0saSksZX07ZC5nbG9iYWxzPWk7dmFyIHY9WzAsMCwxLDFdLHk9W10sVD1nKFwiZWFzaW5nLkVhc2VcIixmdW5jdGlvbih0LGUsaSxzKXt0aGlzLl9mdW5jPXQsdGhpcy5fdHlwZT1pfHwwLHRoaXMuX3Bvd2VyPXN8fDAsdGhpcy5fcGFyYW1zPWU/di5jb25jYXQoZSk6dn0sITApLHc9VC5tYXA9e30seD1ULnJlZ2lzdGVyPWZ1bmN0aW9uKHQsZSxpLHMpe2Zvcih2YXIgcixuLGEsbyxoPWUuc3BsaXQoXCIsXCIpLF89aC5sZW5ndGgsdT0oaXx8XCJlYXNlSW4sZWFzZU91dCxlYXNlSW5PdXRcIikuc3BsaXQoXCIsXCIpOy0tXz4tMTspZm9yKG49aFtfXSxyPXM/ZyhcImVhc2luZy5cIituLG51bGwsITApOmwuZWFzaW5nW25dfHx7fSxhPXUubGVuZ3RoOy0tYT4tMTspbz11W2FdLHdbbitcIi5cIitvXT13W28rbl09cltvXT10LmdldFJhdGlvP3Q6dFtvXXx8bmV3IHR9O2ZvcihuPVQucHJvdG90eXBlLG4uX2NhbGNFbmQ9ITEsbi5nZXRSYXRpbz1mdW5jdGlvbih0KXtpZih0aGlzLl9mdW5jKXJldHVybiB0aGlzLl9wYXJhbXNbMF09dCx0aGlzLl9mdW5jLmFwcGx5KG51bGwsdGhpcy5fcGFyYW1zKTt2YXIgZT10aGlzLl90eXBlLGk9dGhpcy5fcG93ZXIscz0xPT09ZT8xLXQ6Mj09PWU/dDouNT50PzIqdDoyKigxLXQpO3JldHVybiAxPT09aT9zKj1zOjI9PT1pP3MqPXMqczozPT09aT9zKj1zKnMqczo0PT09aSYmKHMqPXMqcypzKnMpLDE9PT1lPzEtczoyPT09ZT9zOi41PnQ/cy8yOjEtcy8yfSxzPVtcIkxpbmVhclwiLFwiUXVhZFwiLFwiQ3ViaWNcIixcIlF1YXJ0XCIsXCJRdWludCxTdHJvbmdcIl0scj1zLmxlbmd0aDstLXI+LTE7KW49c1tyXStcIixQb3dlclwiK3IseChuZXcgVChudWxsLG51bGwsMSxyKSxuLFwiZWFzZU91dFwiLCEwKSx4KG5ldyBUKG51bGwsbnVsbCwyLHIpLG4sXCJlYXNlSW5cIisoMD09PXI/XCIsZWFzZU5vbmVcIjpcIlwiKSkseChuZXcgVChudWxsLG51bGwsMyxyKSxuLFwiZWFzZUluT3V0XCIpO3cubGluZWFyPWwuZWFzaW5nLkxpbmVhci5lYXNlSW4sdy5zd2luZz1sLmVhc2luZy5RdWFkLmVhc2VJbk91dDt2YXIgYj1nKFwiZXZlbnRzLkV2ZW50RGlzcGF0Y2hlclwiLGZ1bmN0aW9uKHQpe3RoaXMuX2xpc3RlbmVycz17fSx0aGlzLl9ldmVudFRhcmdldD10fHx0aGlzfSk7bj1iLnByb3RvdHlwZSxuLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlLGkscyxyKXtyPXJ8fDA7dmFyIG4saCxsPXRoaXMuX2xpc3RlbmVyc1t0XSxfPTA7Zm9yKG51bGw9PWwmJih0aGlzLl9saXN0ZW5lcnNbdF09bD1bXSksaD1sLmxlbmd0aDstLWg+LTE7KW49bFtoXSxuLmM9PT1lJiZuLnM9PT1pP2wuc3BsaWNlKGgsMSk6MD09PV8mJnI+bi5wciYmKF89aCsxKTtsLnNwbGljZShfLDAse2M6ZSxzOmksdXA6cyxwcjpyfSksdGhpcyE9PWF8fG98fGEud2FrZSgpfSxuLnJlbW92ZUV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXt2YXIgaSxzPXRoaXMuX2xpc3RlbmVyc1t0XTtpZihzKWZvcihpPXMubGVuZ3RoOy0taT4tMTspaWYoc1tpXS5jPT09ZSlyZXR1cm4gcy5zcGxpY2UoaSwxKSx2b2lkIDB9LG4uZGlzcGF0Y2hFdmVudD1mdW5jdGlvbih0KXt2YXIgZSxpLHMscj10aGlzLl9saXN0ZW5lcnNbdF07aWYocilmb3IoZT1yLmxlbmd0aCxpPXRoaXMuX2V2ZW50VGFyZ2V0Oy0tZT4tMTspcz1yW2VdLHMmJihzLnVwP3MuYy5jYWxsKHMuc3x8aSx7dHlwZTp0LHRhcmdldDppfSk6cy5jLmNhbGwocy5zfHxpKSl9O3ZhciBQPXQucmVxdWVzdEFuaW1hdGlvbkZyYW1lLFM9dC5jYW5jZWxBbmltYXRpb25GcmFtZSxrPURhdGUubm93fHxmdW5jdGlvbigpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpfSxSPWsoKTtmb3Iocz1bXCJtc1wiLFwibW96XCIsXCJ3ZWJraXRcIixcIm9cIl0scj1zLmxlbmd0aDstLXI+LTEmJiFQOylQPXRbc1tyXStcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXSxTPXRbc1tyXStcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdfHx0W3Nbcl0rXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07ZyhcIlRpY2tlclwiLGZ1bmN0aW9uKHQsZSl7dmFyIGkscyxyLG4saCxsPXRoaXMsdT1rKCksYz1lIT09ITEmJlAsZj01MDAsbT0zMyxkPWZ1bmN0aW9uKHQpe3ZhciBlLGEsbz1rKCktUjtvPmYmJih1Kz1vLW0pLFIrPW8sbC50aW1lPShSLXUpLzFlMyxlPWwudGltZS1oLCghaXx8ZT4wfHx0PT09ITApJiYobC5mcmFtZSsrLGgrPWUrKGU+PW4/LjAwNDpuLWUpLGE9ITApLHQhPT0hMCYmKHI9cyhkKSksYSYmbC5kaXNwYXRjaEV2ZW50KFwidGlja1wiKX07Yi5jYWxsKGwpLGwudGltZT1sLmZyYW1lPTAsbC50aWNrPWZ1bmN0aW9uKCl7ZCghMCl9LGwubGFnU21vb3RoaW5nPWZ1bmN0aW9uKHQsZSl7Zj10fHwxL18sbT1NYXRoLm1pbihlLGYsMCl9LGwuc2xlZXA9ZnVuY3Rpb24oKXtudWxsIT1yJiYoYyYmUz9TKHIpOmNsZWFyVGltZW91dChyKSxzPXAscj1udWxsLGw9PT1hJiYobz0hMSkpfSxsLndha2U9ZnVuY3Rpb24oKXtudWxsIT09cj9sLnNsZWVwKCk6bC5mcmFtZT4xMCYmKFI9aygpLWYrNSkscz0wPT09aT9wOmMmJlA/UDpmdW5jdGlvbih0KXtyZXR1cm4gc2V0VGltZW91dCh0LDB8MWUzKihoLWwudGltZSkrMSl9LGw9PT1hJiYobz0hMCksZCgyKX0sbC5mcHM9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGk9dCxuPTEvKGl8fDYwKSxoPXRoaXMudGltZStuLGwud2FrZSgpLHZvaWQgMCk6aX0sbC51c2VSQUY9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGwuc2xlZXAoKSxjPXQsbC5mcHMoaSksdm9pZCAwKTpjfSxsLmZwcyh0KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YyYmKCFyfHw1PmwuZnJhbWUpJiZsLnVzZVJBRighMSl9LDE1MDApfSksbj1sLlRpY2tlci5wcm90b3R5cGU9bmV3IGwuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcixuLmNvbnN0cnVjdG9yPWwuVGlja2VyO3ZhciBBPWcoXCJjb3JlLkFuaW1hdGlvblwiLGZ1bmN0aW9uKHQsZSl7aWYodGhpcy52YXJzPWU9ZXx8e30sdGhpcy5fZHVyYXRpb249dGhpcy5fdG90YWxEdXJhdGlvbj10fHwwLHRoaXMuX2RlbGF5PU51bWJlcihlLmRlbGF5KXx8MCx0aGlzLl90aW1lU2NhbGU9MSx0aGlzLl9hY3RpdmU9ZS5pbW1lZGlhdGVSZW5kZXI9PT0hMCx0aGlzLmRhdGE9ZS5kYXRhLHRoaXMuX3JldmVyc2VkPWUucmV2ZXJzZWQ9PT0hMCxCKXtvfHxhLndha2UoKTt2YXIgaT10aGlzLnZhcnMudXNlRnJhbWVzP2o6QjtpLmFkZCh0aGlzLGkuX3RpbWUpLHRoaXMudmFycy5wYXVzZWQmJnRoaXMucGF1c2VkKCEwKX19KTthPUEudGlja2VyPW5ldyBsLlRpY2tlcixuPUEucHJvdG90eXBlLG4uX2RpcnR5PW4uX2djPW4uX2luaXR0ZWQ9bi5fcGF1c2VkPSExLG4uX3RvdGFsVGltZT1uLl90aW1lPTAsbi5fcmF3UHJldlRpbWU9LTEsbi5fbmV4dD1uLl9sYXN0PW4uX29uVXBkYXRlPW4uX3RpbWVsaW5lPW4udGltZWxpbmU9bnVsbCxuLl9wYXVzZWQ9ITE7dmFyIE89ZnVuY3Rpb24oKXtvJiZrKCktUj4yZTMmJmEud2FrZSgpLHNldFRpbWVvdXQoTywyZTMpfTtPKCksbi5wbGF5PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0LGUpLHRoaXMucmV2ZXJzZWQoITEpLnBhdXNlZCghMSl9LG4ucGF1c2U9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5zZWVrKHQsZSksdGhpcy5wYXVzZWQoITApfSxuLnJlc3VtZT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsIT10JiZ0aGlzLnNlZWsodCxlKSx0aGlzLnBhdXNlZCghMSl9LG4uc2Vlaz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnRvdGFsVGltZShOdW1iZXIodCksZSE9PSExKX0sbi5yZXN0YXJ0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMucmV2ZXJzZWQoITEpLnBhdXNlZCghMSkudG90YWxUaW1lKHQ/LXRoaXMuX2RlbGF5OjAsZSE9PSExLCEwKX0sbi5yZXZlcnNlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0fHx0aGlzLnRvdGFsRHVyYXRpb24oKSxlKSx0aGlzLnJldmVyc2VkKCEwKS5wYXVzZWQoITEpfSxuLnJlbmRlcj1mdW5jdGlvbigpe30sbi5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lPTAsdGhpcy5faW5pdHRlZD10aGlzLl9nYz0hMSx0aGlzLl9yYXdQcmV2VGltZT0tMSwodGhpcy5fZ2N8fCF0aGlzLnRpbWVsaW5lKSYmdGhpcy5fZW5hYmxlZCghMCksdGhpc30sbi5pc0FjdGl2ZT1mdW5jdGlvbigpe3ZhciB0LGU9dGhpcy5fdGltZWxpbmUsaT10aGlzLl9zdGFydFRpbWU7cmV0dXJuIWV8fCF0aGlzLl9nYyYmIXRoaXMuX3BhdXNlZCYmZS5pc0FjdGl2ZSgpJiYodD1lLnJhd1RpbWUoKSk+PWkmJmkrdGhpcy50b3RhbER1cmF0aW9uKCkvdGhpcy5fdGltZVNjYWxlPnR9LG4uX2VuYWJsZWQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gb3x8YS53YWtlKCksdGhpcy5fZ2M9IXQsdGhpcy5fYWN0aXZlPXRoaXMuaXNBY3RpdmUoKSxlIT09ITAmJih0JiYhdGhpcy50aW1lbGluZT90aGlzLl90aW1lbGluZS5hZGQodGhpcyx0aGlzLl9zdGFydFRpbWUtdGhpcy5fZGVsYXkpOiF0JiZ0aGlzLnRpbWVsaW5lJiZ0aGlzLl90aW1lbGluZS5fcmVtb3ZlKHRoaXMsITApKSwhMX0sbi5fa2lsbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9lbmFibGVkKCExLCExKX0sbi5raWxsPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuX2tpbGwodCxlKSx0aGlzfSxuLl91bmNhY2hlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10P3RoaXM6dGhpcy50aW1lbGluZTtlOyllLl9kaXJ0eT0hMCxlPWUudGltZWxpbmU7cmV0dXJuIHRoaXN9LG4uX3N3YXBTZWxmSW5QYXJhbXM9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQubGVuZ3RoLGk9dC5jb25jYXQoKTstLWU+LTE7KVwie3NlbGZ9XCI9PT10W2VdJiYoaVtlXT10aGlzKTtyZXR1cm4gaX0sbi5ldmVudENhbGxiYWNrPWZ1bmN0aW9uKHQsZSxpLHMpe2lmKFwib25cIj09PSh0fHxcIlwiKS5zdWJzdHIoMCwyKSl7dmFyIHI9dGhpcy52YXJzO2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiByW3RdO251bGw9PWU/ZGVsZXRlIHJbdF06KHJbdF09ZSxyW3QrXCJQYXJhbXNcIl09YyhpKSYmLTEhPT1pLmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKT90aGlzLl9zd2FwU2VsZkluUGFyYW1zKGkpOmksclt0K1wiU2NvcGVcIl09cyksXCJvblVwZGF0ZVwiPT09dCYmKHRoaXMuX29uVXBkYXRlPWUpfXJldHVybiB0aGlzfSxuLmRlbGF5PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyYmdGhpcy5zdGFydFRpbWUodGhpcy5fc3RhcnRUaW1lK3QtdGhpcy5fZGVsYXkpLHRoaXMuX2RlbGF5PXQsdGhpcyk6dGhpcy5fZGVsYXl9LG4uZHVyYXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX2R1cmF0aW9uPXRoaXMuX3RvdGFsRHVyYXRpb249dCx0aGlzLl91bmNhY2hlKCEwKSx0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyYmdGhpcy5fdGltZT4wJiZ0aGlzLl90aW1lPHRoaXMuX2R1cmF0aW9uJiYwIT09dCYmdGhpcy50b3RhbFRpbWUodGhpcy5fdG90YWxUaW1lKih0L3RoaXMuX2R1cmF0aW9uKSwhMCksdGhpcyk6KHRoaXMuX2RpcnR5PSExLHRoaXMuX2R1cmF0aW9uKX0sbi50b3RhbER1cmF0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9kaXJ0eT0hMSxhcmd1bWVudHMubGVuZ3RoP3RoaXMuZHVyYXRpb24odCk6dGhpcy5fdG90YWxEdXJhdGlvbn0sbi50aW1lPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX2RpcnR5JiZ0aGlzLnRvdGFsRHVyYXRpb24oKSx0aGlzLnRvdGFsVGltZSh0PnRoaXMuX2R1cmF0aW9uP3RoaXMuX2R1cmF0aW9uOnQsZSkpOnRoaXMuX3RpbWV9LG4udG90YWxUaW1lPWZ1bmN0aW9uKHQsZSxpKXtpZihvfHxhLndha2UoKSwhYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fdG90YWxUaW1lO2lmKHRoaXMuX3RpbWVsaW5lKXtpZigwPnQmJiFpJiYodCs9dGhpcy50b3RhbER1cmF0aW9uKCkpLHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKXt0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCk7dmFyIHM9dGhpcy5fdG90YWxEdXJhdGlvbixyPXRoaXMuX3RpbWVsaW5lO2lmKHQ+cyYmIWkmJih0PXMpLHRoaXMuX3N0YXJ0VGltZT0odGhpcy5fcGF1c2VkP3RoaXMuX3BhdXNlVGltZTpyLl90aW1lKS0odGhpcy5fcmV2ZXJzZWQ/cy10OnQpL3RoaXMuX3RpbWVTY2FsZSxyLl9kaXJ0eXx8dGhpcy5fdW5jYWNoZSghMSksci5fdGltZWxpbmUpZm9yKDtyLl90aW1lbGluZTspci5fdGltZWxpbmUuX3RpbWUhPT0oci5fc3RhcnRUaW1lK3IuX3RvdGFsVGltZSkvci5fdGltZVNjYWxlJiZyLnRvdGFsVGltZShyLl90b3RhbFRpbWUsITApLHI9ci5fdGltZWxpbmV9dGhpcy5fZ2MmJnRoaXMuX2VuYWJsZWQoITAsITEpLCh0aGlzLl90b3RhbFRpbWUhPT10fHwwPT09dGhpcy5fZHVyYXRpb24pJiYodGhpcy5yZW5kZXIodCxlLCExKSxJLmxlbmd0aCYmcSgpKX1yZXR1cm4gdGhpc30sbi5wcm9ncmVzcz1uLnRvdGFsUHJvZ3Jlc3M9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnRvdGFsVGltZSh0aGlzLmR1cmF0aW9uKCkqdCxlKTp0aGlzLl90aW1lL3RoaXMuZHVyYXRpb24oKX0sbi5zdGFydFRpbWU9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHQhPT10aGlzLl9zdGFydFRpbWUmJih0aGlzLl9zdGFydFRpbWU9dCx0aGlzLnRpbWVsaW5lJiZ0aGlzLnRpbWVsaW5lLl9zb3J0Q2hpbGRyZW4mJnRoaXMudGltZWxpbmUuYWRkKHRoaXMsdC10aGlzLl9kZWxheSkpLHRoaXMpOnRoaXMuX3N0YXJ0VGltZX0sbi5lbmRUaW1lPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9zdGFydFRpbWUrKDAhPXQ/dGhpcy50b3RhbER1cmF0aW9uKCk6dGhpcy5kdXJhdGlvbigpKS90aGlzLl90aW1lU2NhbGV9LG4udGltZVNjYWxlPWZ1bmN0aW9uKHQpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl90aW1lU2NhbGU7aWYodD10fHxfLHRoaXMuX3RpbWVsaW5lJiZ0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyl7dmFyIGU9dGhpcy5fcGF1c2VUaW1lLGk9ZXx8MD09PWU/ZTp0aGlzLl90aW1lbGluZS50b3RhbFRpbWUoKTt0aGlzLl9zdGFydFRpbWU9aS0oaS10aGlzLl9zdGFydFRpbWUpKnRoaXMuX3RpbWVTY2FsZS90fXJldHVybiB0aGlzLl90aW1lU2NhbGU9dCx0aGlzLl91bmNhY2hlKCExKX0sbi5yZXZlcnNlZD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odCE9dGhpcy5fcmV2ZXJzZWQmJih0aGlzLl9yZXZlcnNlZD10LHRoaXMudG90YWxUaW1lKHRoaXMuX3RpbWVsaW5lJiYhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmc/dGhpcy50b3RhbER1cmF0aW9uKCktdGhpcy5fdG90YWxUaW1lOnRoaXMuX3RvdGFsVGltZSwhMCkpLHRoaXMpOnRoaXMuX3JldmVyc2VkfSxuLnBhdXNlZD1mdW5jdGlvbih0KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcGF1c2VkO2lmKHQhPXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZWxpbmUpe298fHR8fGEud2FrZSgpO3ZhciBlPXRoaXMuX3RpbWVsaW5lLGk9ZS5yYXdUaW1lKCkscz1pLXRoaXMuX3BhdXNlVGltZTshdCYmZS5zbW9vdGhDaGlsZFRpbWluZyYmKHRoaXMuX3N0YXJ0VGltZSs9cyx0aGlzLl91bmNhY2hlKCExKSksdGhpcy5fcGF1c2VUaW1lPXQ/aTpudWxsLHRoaXMuX3BhdXNlZD10LHRoaXMuX2FjdGl2ZT10aGlzLmlzQWN0aXZlKCksIXQmJjAhPT1zJiZ0aGlzLl9pbml0dGVkJiZ0aGlzLmR1cmF0aW9uKCkmJnRoaXMucmVuZGVyKGUuc21vb3RoQ2hpbGRUaW1pbmc/dGhpcy5fdG90YWxUaW1lOihpLXRoaXMuX3N0YXJ0VGltZSkvdGhpcy5fdGltZVNjYWxlLCEwLCEwKX1yZXR1cm4gdGhpcy5fZ2MmJiF0JiZ0aGlzLl9lbmFibGVkKCEwLCExKSx0aGlzfTt2YXIgQz1nKFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLGZ1bmN0aW9uKHQpe0EuY2FsbCh0aGlzLDAsdCksdGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW49dGhpcy5zbW9vdGhDaGlsZFRpbWluZz0hMH0pO249Qy5wcm90b3R5cGU9bmV3IEEsbi5jb25zdHJ1Y3Rvcj1DLG4ua2lsbCgpLl9nYz0hMSxuLl9maXJzdD1uLl9sYXN0PW4uX3JlY2VudD1udWxsLG4uX3NvcnRDaGlsZHJlbj0hMSxuLmFkZD1uLmluc2VydD1mdW5jdGlvbih0LGUpe3ZhciBpLHM7aWYodC5fc3RhcnRUaW1lPU51bWJlcihlfHwwKSt0Ll9kZWxheSx0Ll9wYXVzZWQmJnRoaXMhPT10Ll90aW1lbGluZSYmKHQuX3BhdXNlVGltZT10Ll9zdGFydFRpbWUrKHRoaXMucmF3VGltZSgpLXQuX3N0YXJ0VGltZSkvdC5fdGltZVNjYWxlKSx0LnRpbWVsaW5lJiZ0LnRpbWVsaW5lLl9yZW1vdmUodCwhMCksdC50aW1lbGluZT10Ll90aW1lbGluZT10aGlzLHQuX2djJiZ0Ll9lbmFibGVkKCEwLCEwKSxpPXRoaXMuX2xhc3QsdGhpcy5fc29ydENoaWxkcmVuKWZvcihzPXQuX3N0YXJ0VGltZTtpJiZpLl9zdGFydFRpbWU+czspaT1pLl9wcmV2O3JldHVybiBpPyh0Ll9uZXh0PWkuX25leHQsaS5fbmV4dD10KToodC5fbmV4dD10aGlzLl9maXJzdCx0aGlzLl9maXJzdD10KSx0Ll9uZXh0P3QuX25leHQuX3ByZXY9dDp0aGlzLl9sYXN0PXQsdC5fcHJldj1pLHRoaXMuX3JlY2VudD10LHRoaXMuX3RpbWVsaW5lJiZ0aGlzLl91bmNhY2hlKCEwKSx0aGlzfSxuLl9yZW1vdmU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC50aW1lbGluZT09PXRoaXMmJihlfHx0Ll9lbmFibGVkKCExLCEwKSx0Ll9wcmV2P3QuX3ByZXYuX25leHQ9dC5fbmV4dDp0aGlzLl9maXJzdD09PXQmJih0aGlzLl9maXJzdD10Ll9uZXh0KSx0Ll9uZXh0P3QuX25leHQuX3ByZXY9dC5fcHJldjp0aGlzLl9sYXN0PT09dCYmKHRoaXMuX2xhc3Q9dC5fcHJldiksdC5fbmV4dD10Ll9wcmV2PXQudGltZWxpbmU9bnVsbCx0PT09dGhpcy5fcmVjZW50JiYodGhpcy5fcmVjZW50PXRoaXMuX2xhc3QpLHRoaXMuX3RpbWVsaW5lJiZ0aGlzLl91bmNhY2hlKCEwKSksdGhpc30sbi5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLHI9dGhpcy5fZmlyc3Q7Zm9yKHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXRoaXMuX3Jhd1ByZXZUaW1lPXQ7cjspcz1yLl9uZXh0LChyLl9hY3RpdmV8fHQ+PXIuX3N0YXJ0VGltZSYmIXIuX3BhdXNlZCkmJihyLl9yZXZlcnNlZD9yLnJlbmRlcigoci5fZGlydHk/ci50b3RhbER1cmF0aW9uKCk6ci5fdG90YWxEdXJhdGlvbiktKHQtci5fc3RhcnRUaW1lKSpyLl90aW1lU2NhbGUsZSxpKTpyLnJlbmRlcigodC1yLl9zdGFydFRpbWUpKnIuX3RpbWVTY2FsZSxlLGkpKSxyPXN9LG4ucmF3VGltZT1mdW5jdGlvbigpe3JldHVybiBvfHxhLndha2UoKSx0aGlzLl90b3RhbFRpbWV9O3ZhciBEPWcoXCJUd2VlbkxpdGVcIixmdW5jdGlvbihlLGkscyl7aWYoQS5jYWxsKHRoaXMsaSxzKSx0aGlzLnJlbmRlcj1ELnByb3RvdHlwZS5yZW5kZXIsbnVsbD09ZSl0aHJvd1wiQ2Fubm90IHR3ZWVuIGEgbnVsbCB0YXJnZXQuXCI7dGhpcy50YXJnZXQ9ZT1cInN0cmluZ1wiIT10eXBlb2YgZT9lOkQuc2VsZWN0b3IoZSl8fGU7dmFyIHIsbixhLG89ZS5qcXVlcnl8fGUubGVuZ3RoJiZlIT09dCYmZVswXSYmKGVbMF09PT10fHxlWzBdLm5vZGVUeXBlJiZlWzBdLnN0eWxlJiYhZS5ub2RlVHlwZSksaD10aGlzLnZhcnMub3ZlcndyaXRlO2lmKHRoaXMuX292ZXJ3cml0ZT1oPW51bGw9PWg/WVtELmRlZmF1bHRPdmVyd3JpdGVdOlwibnVtYmVyXCI9PXR5cGVvZiBoP2g+PjA6WVtoXSwob3x8ZSBpbnN0YW5jZW9mIEFycmF5fHxlLnB1c2gmJmMoZSkpJiZcIm51bWJlclwiIT10eXBlb2YgZVswXSlmb3IodGhpcy5fdGFyZ2V0cz1hPXUoZSksdGhpcy5fcHJvcExvb2t1cD1bXSx0aGlzLl9zaWJsaW5ncz1bXSxyPTA7YS5sZW5ndGg+cjtyKyspbj1hW3JdLG4/XCJzdHJpbmdcIiE9dHlwZW9mIG4/bi5sZW5ndGgmJm4hPT10JiZuWzBdJiYoblswXT09PXR8fG5bMF0ubm9kZVR5cGUmJm5bMF0uc3R5bGUmJiFuLm5vZGVUeXBlKT8oYS5zcGxpY2Uoci0tLDEpLHRoaXMuX3RhcmdldHM9YT1hLmNvbmNhdCh1KG4pKSk6KHRoaXMuX3NpYmxpbmdzW3JdPVYobix0aGlzLCExKSwxPT09aCYmdGhpcy5fc2libGluZ3Nbcl0ubGVuZ3RoPjEmJlcobix0aGlzLG51bGwsMSx0aGlzLl9zaWJsaW5nc1tyXSkpOihuPWFbci0tXT1ELnNlbGVjdG9yKG4pLFwic3RyaW5nXCI9PXR5cGVvZiBuJiZhLnNwbGljZShyKzEsMSkpOmEuc3BsaWNlKHItLSwxKTtlbHNlIHRoaXMuX3Byb3BMb29rdXA9e30sdGhpcy5fc2libGluZ3M9VihlLHRoaXMsITEpLDE9PT1oJiZ0aGlzLl9zaWJsaW5ncy5sZW5ndGg+MSYmVyhlLHRoaXMsbnVsbCwxLHRoaXMuX3NpYmxpbmdzKTsodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlcnx8MD09PWkmJjA9PT10aGlzLl9kZWxheSYmdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciE9PSExKSYmKHRoaXMuX3RpbWU9LV8sdGhpcy5yZW5kZXIoLXRoaXMuX2RlbGF5KSl9LCEwKSxNPWZ1bmN0aW9uKGUpe3JldHVybiBlJiZlLmxlbmd0aCYmZSE9PXQmJmVbMF0mJihlWzBdPT09dHx8ZVswXS5ub2RlVHlwZSYmZVswXS5zdHlsZSYmIWUubm9kZVR5cGUpfSx6PWZ1bmN0aW9uKHQsZSl7dmFyIGkscz17fTtmb3IoaSBpbiB0KVVbaV18fGkgaW4gZSYmXCJ0cmFuc2Zvcm1cIiE9PWkmJlwieFwiIT09aSYmXCJ5XCIhPT1pJiZcIndpZHRoXCIhPT1pJiZcImhlaWdodFwiIT09aSYmXCJjbGFzc05hbWVcIiE9PWkmJlwiYm9yZGVyXCIhPT1pfHwhKCFMW2ldfHxMW2ldJiZMW2ldLl9hdXRvQ1NTKXx8KHNbaV09dFtpXSxkZWxldGUgdFtpXSk7dC5jc3M9c307bj1ELnByb3RvdHlwZT1uZXcgQSxuLmNvbnN0cnVjdG9yPUQsbi5raWxsKCkuX2djPSExLG4ucmF0aW89MCxuLl9maXJzdFBUPW4uX3RhcmdldHM9bi5fb3ZlcndyaXR0ZW5Qcm9wcz1uLl9zdGFydEF0PW51bGwsbi5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZD1uLl9sYXp5PSExLEQudmVyc2lvbj1cIjEuMTQuMVwiLEQuZGVmYXVsdEVhc2U9bi5fZWFzZT1uZXcgVChudWxsLG51bGwsMSwxKSxELmRlZmF1bHRPdmVyd3JpdGU9XCJhdXRvXCIsRC50aWNrZXI9YSxELmF1dG9TbGVlcD0hMCxELmxhZ1Ntb290aGluZz1mdW5jdGlvbih0LGUpe2EubGFnU21vb3RoaW5nKHQsZSl9LEQuc2VsZWN0b3I9dC4kfHx0LmpRdWVyeXx8ZnVuY3Rpb24oZSl7dmFyIGk9dC4kfHx0LmpRdWVyeTtyZXR1cm4gaT8oRC5zZWxlY3Rvcj1pLGkoZSkpOlwidW5kZWZpbmVkXCI9PXR5cGVvZiBkb2N1bWVudD9lOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw/ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKTpkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIiNcIj09PWUuY2hhckF0KDApP2Uuc3Vic3RyKDEpOmUpfTt2YXIgST1bXSxFPXt9LEY9RC5faW50ZXJuYWxzPXtpc0FycmF5OmMsaXNTZWxlY3RvcjpNLGxhenlUd2VlbnM6SX0sTD1ELl9wbHVnaW5zPXt9LE49Ri50d2Vlbkxvb2t1cD17fSxYPTAsVT1GLnJlc2VydmVkUHJvcHM9e2Vhc2U6MSxkZWxheToxLG92ZXJ3cml0ZToxLG9uQ29tcGxldGU6MSxvbkNvbXBsZXRlUGFyYW1zOjEsb25Db21wbGV0ZVNjb3BlOjEsdXNlRnJhbWVzOjEscnVuQmFja3dhcmRzOjEsc3RhcnRBdDoxLG9uVXBkYXRlOjEsb25VcGRhdGVQYXJhbXM6MSxvblVwZGF0ZVNjb3BlOjEsb25TdGFydDoxLG9uU3RhcnRQYXJhbXM6MSxvblN0YXJ0U2NvcGU6MSxvblJldmVyc2VDb21wbGV0ZToxLG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOjEsb25SZXZlcnNlQ29tcGxldGVTY29wZToxLG9uUmVwZWF0OjEsb25SZXBlYXRQYXJhbXM6MSxvblJlcGVhdFNjb3BlOjEsZWFzZVBhcmFtczoxLHlveW86MSxpbW1lZGlhdGVSZW5kZXI6MSxyZXBlYXQ6MSxyZXBlYXREZWxheToxLGRhdGE6MSxwYXVzZWQ6MSxyZXZlcnNlZDoxLGF1dG9DU1M6MSxsYXp5OjEsb25PdmVyd3JpdGU6MX0sWT17bm9uZTowLGFsbDoxLGF1dG86Mixjb25jdXJyZW50OjMsYWxsT25TdGFydDo0LHByZWV4aXN0aW5nOjUsXCJ0cnVlXCI6MSxcImZhbHNlXCI6MH0saj1BLl9yb290RnJhbWVzVGltZWxpbmU9bmV3IEMsQj1BLl9yb290VGltZWxpbmU9bmV3IEMscT1GLmxhenlSZW5kZXI9ZnVuY3Rpb24oKXt2YXIgdCxlPUkubGVuZ3RoO2ZvcihFPXt9Oy0tZT4tMTspdD1JW2VdLHQmJnQuX2xhenkhPT0hMSYmKHQucmVuZGVyKHQuX2xhenlbMF0sdC5fbGF6eVsxXSwhMCksdC5fbGF6eT0hMSk7SS5sZW5ndGg9MH07Qi5fc3RhcnRUaW1lPWEudGltZSxqLl9zdGFydFRpbWU9YS5mcmFtZSxCLl9hY3RpdmU9ai5fYWN0aXZlPSEwLHNldFRpbWVvdXQocSwxKSxBLl91cGRhdGVSb290PUQucmVuZGVyPWZ1bmN0aW9uKCl7dmFyIHQsZSxpO2lmKEkubGVuZ3RoJiZxKCksQi5yZW5kZXIoKGEudGltZS1CLl9zdGFydFRpbWUpKkIuX3RpbWVTY2FsZSwhMSwhMSksai5yZW5kZXIoKGEuZnJhbWUtai5fc3RhcnRUaW1lKSpqLl90aW1lU2NhbGUsITEsITEpLEkubGVuZ3RoJiZxKCksIShhLmZyYW1lJTEyMCkpe2ZvcihpIGluIE4pe2ZvcihlPU5baV0udHdlZW5zLHQ9ZS5sZW5ndGg7LS10Pi0xOyllW3RdLl9nYyYmZS5zcGxpY2UodCwxKTswPT09ZS5sZW5ndGgmJmRlbGV0ZSBOW2ldfWlmKGk9Qi5fZmlyc3QsKCFpfHxpLl9wYXVzZWQpJiZELmF1dG9TbGVlcCYmIWouX2ZpcnN0JiYxPT09YS5fbGlzdGVuZXJzLnRpY2subGVuZ3RoKXtmb3IoO2kmJmkuX3BhdXNlZDspaT1pLl9uZXh0O2l8fGEuc2xlZXAoKX19fSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsQS5fdXBkYXRlUm9vdCk7dmFyIFY9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLHIsbj10Ll9nc1R3ZWVuSUQ7aWYoTltufHwodC5fZ3NUd2VlbklEPW49XCJ0XCIrWCsrKV18fChOW25dPXt0YXJnZXQ6dCx0d2VlbnM6W119KSxlJiYocz1OW25dLnR3ZWVucyxzW3I9cy5sZW5ndGhdPWUsaSkpZm9yKDstLXI+LTE7KXNbcl09PT1lJiZzLnNwbGljZShyLDEpO3JldHVybiBOW25dLnR3ZWVuc30sRz1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcj10LnZhcnMub25PdmVyd3JpdGU7ciYmcih0LGUsaSxzKSxyPUQub25PdmVyd3JpdGUsciYmcih0LGUsaSxzKX0sVz1mdW5jdGlvbih0LGUsaSxzLHIpe3ZhciBuLGEsbyxoO2lmKDE9PT1zfHxzPj00KXtmb3IoaD1yLmxlbmd0aCxuPTA7aD5uO24rKylpZigobz1yW25dKSE9PWUpby5fZ2N8fChvLl9lbmFibGVkKCExLCExKSYmKGE9ITApLEcobyxlKSk7ZWxzZSBpZig1PT09cylicmVhaztyZXR1cm4gYX12YXIgbCx1PWUuX3N0YXJ0VGltZStfLHA9W10sYz0wLGY9MD09PWUuX2R1cmF0aW9uO2ZvcihuPXIubGVuZ3RoOy0tbj4tMTspKG89cltuXSk9PT1lfHxvLl9nY3x8by5fcGF1c2VkfHwoby5fdGltZWxpbmUhPT1lLl90aW1lbGluZT8obD1sfHxRKGUsMCxmKSwwPT09UShvLGwsZikmJihwW2MrK109bykpOnU+PW8uX3N0YXJ0VGltZSYmby5fc3RhcnRUaW1lK28udG90YWxEdXJhdGlvbigpL28uX3RpbWVTY2FsZT51JiYoKGZ8fCFvLl9pbml0dGVkKSYmMmUtMTA+PXUtby5fc3RhcnRUaW1lfHwocFtjKytdPW8pKSk7Zm9yKG49YzstLW4+LTE7KW89cFtuXSwyPT09cyYmby5fa2lsbChpLHQsZSkmJihhPSEwKSwoMiE9PXN8fCFvLl9maXJzdFBUJiZvLl9pbml0dGVkKSYmKG8uX2VuYWJsZWQoITEsITEpJiYoYT0hMCksMiE9PXMmJkcobyxlKSk7cmV0dXJuIGF9LFE9ZnVuY3Rpb24odCxlLGkpe2Zvcih2YXIgcz10Ll90aW1lbGluZSxyPXMuX3RpbWVTY2FsZSxuPXQuX3N0YXJ0VGltZTtzLl90aW1lbGluZTspe2lmKG4rPXMuX3N0YXJ0VGltZSxyKj1zLl90aW1lU2NhbGUscy5fcGF1c2VkKXJldHVybi0xMDA7cz1zLl90aW1lbGluZX1yZXR1cm4gbi89cixuPmU/bi1lOmkmJm49PT1lfHwhdC5faW5pdHRlZCYmMipfPm4tZT9fOihuKz10LnRvdGFsRHVyYXRpb24oKS90Ll90aW1lU2NhbGUvcik+ZStfPzA6bi1lLV99O24uX2luaXQ9ZnVuY3Rpb24oKXt2YXIgdCxlLGkscyxyLG49dGhpcy52YXJzLGE9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyxvPXRoaXMuX2R1cmF0aW9uLGg9ISFuLmltbWVkaWF0ZVJlbmRlcixsPW4uZWFzZTtpZihuLnN0YXJ0QXQpe3RoaXMuX3N0YXJ0QXQmJih0aGlzLl9zdGFydEF0LnJlbmRlcigtMSwhMCksdGhpcy5fc3RhcnRBdC5raWxsKCkpLHI9e307Zm9yKHMgaW4gbi5zdGFydEF0KXJbc109bi5zdGFydEF0W3NdO2lmKHIub3ZlcndyaXRlPSExLHIuaW1tZWRpYXRlUmVuZGVyPSEwLHIubGF6eT1oJiZuLmxhenkhPT0hMSxyLnN0YXJ0QXQ9ci5kZWxheT1udWxsLHRoaXMuX3N0YXJ0QXQ9RC50byh0aGlzLnRhcmdldCwwLHIpLGgpaWYodGhpcy5fdGltZT4wKXRoaXMuX3N0YXJ0QXQ9bnVsbDtlbHNlIGlmKDAhPT1vKXJldHVybn1lbHNlIGlmKG4ucnVuQmFja3dhcmRzJiYwIT09bylpZih0aGlzLl9zdGFydEF0KXRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCEwKSx0aGlzLl9zdGFydEF0LmtpbGwoKSx0aGlzLl9zdGFydEF0PW51bGw7ZWxzZXswIT09dGhpcy5fdGltZSYmKGg9ITEpLGk9e307Zm9yKHMgaW4gbilVW3NdJiZcImF1dG9DU1NcIiE9PXN8fChpW3NdPW5bc10pO2lmKGkub3ZlcndyaXRlPTAsaS5kYXRhPVwiaXNGcm9tU3RhcnRcIixpLmxhenk9aCYmbi5sYXp5IT09ITEsaS5pbW1lZGlhdGVSZW5kZXI9aCx0aGlzLl9zdGFydEF0PUQudG8odGhpcy50YXJnZXQsMCxpKSxoKXtpZigwPT09dGhpcy5fdGltZSlyZXR1cm59ZWxzZSB0aGlzLl9zdGFydEF0Ll9pbml0KCksdGhpcy5fc3RhcnRBdC5fZW5hYmxlZCghMSksdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciYmKHRoaXMuX3N0YXJ0QXQ9bnVsbCl9aWYodGhpcy5fZWFzZT1sPWw/bCBpbnN0YW5jZW9mIFQ/bDpcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP25ldyBUKGwsbi5lYXNlUGFyYW1zKTp3W2xdfHxELmRlZmF1bHRFYXNlOkQuZGVmYXVsdEVhc2Usbi5lYXNlUGFyYW1zIGluc3RhbmNlb2YgQXJyYXkmJmwuY29uZmlnJiYodGhpcy5fZWFzZT1sLmNvbmZpZy5hcHBseShsLG4uZWFzZVBhcmFtcykpLHRoaXMuX2Vhc2VUeXBlPXRoaXMuX2Vhc2UuX3R5cGUsdGhpcy5fZWFzZVBvd2VyPXRoaXMuX2Vhc2UuX3Bvd2VyLHRoaXMuX2ZpcnN0UFQ9bnVsbCx0aGlzLl90YXJnZXRzKWZvcih0PXRoaXMuX3RhcmdldHMubGVuZ3RoOy0tdD4tMTspdGhpcy5faW5pdFByb3BzKHRoaXMuX3RhcmdldHNbdF0sdGhpcy5fcHJvcExvb2t1cFt0XT17fSx0aGlzLl9zaWJsaW5nc1t0XSxhP2FbdF06bnVsbCkmJihlPSEwKTtlbHNlIGU9dGhpcy5faW5pdFByb3BzKHRoaXMudGFyZ2V0LHRoaXMuX3Byb3BMb29rdXAsdGhpcy5fc2libGluZ3MsYSk7aWYoZSYmRC5fb25QbHVnaW5FdmVudChcIl9vbkluaXRBbGxQcm9wc1wiLHRoaXMpLGEmJih0aGlzLl9maXJzdFBUfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0aGlzLnRhcmdldCYmdGhpcy5fZW5hYmxlZCghMSwhMSkpLG4ucnVuQmFja3dhcmRzKWZvcihpPXRoaXMuX2ZpcnN0UFQ7aTspaS5zKz1pLmMsaS5jPS1pLmMsaT1pLl9uZXh0O3RoaXMuX29uVXBkYXRlPW4ub25VcGRhdGUsdGhpcy5faW5pdHRlZD0hMH0sbi5faW5pdFByb3BzPWZ1bmN0aW9uKGUsaSxzLHIpe3ZhciBuLGEsbyxoLGwsXztpZihudWxsPT1lKXJldHVybiExO0VbZS5fZ3NUd2VlbklEXSYmcSgpLHRoaXMudmFycy5jc3N8fGUuc3R5bGUmJmUhPT10JiZlLm5vZGVUeXBlJiZMLmNzcyYmdGhpcy52YXJzLmF1dG9DU1MhPT0hMSYmeih0aGlzLnZhcnMsZSk7Zm9yKG4gaW4gdGhpcy52YXJzKXtpZihfPXRoaXMudmFyc1tuXSxVW25dKV8mJihfIGluc3RhbmNlb2YgQXJyYXl8fF8ucHVzaCYmYyhfKSkmJi0xIT09Xy5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikmJih0aGlzLnZhcnNbbl09Xz10aGlzLl9zd2FwU2VsZkluUGFyYW1zKF8sdGhpcykpO2Vsc2UgaWYoTFtuXSYmKGg9bmV3IExbbl0pLl9vbkluaXRUd2VlbihlLHRoaXMudmFyc1tuXSx0aGlzKSl7Zm9yKHRoaXMuX2ZpcnN0UFQ9bD17X25leHQ6dGhpcy5fZmlyc3RQVCx0OmgscDpcInNldFJhdGlvXCIsczowLGM6MSxmOiEwLG46bixwZzohMCxwcjpoLl9wcmlvcml0eX0sYT1oLl9vdmVyd3JpdGVQcm9wcy5sZW5ndGg7LS1hPi0xOylpW2guX292ZXJ3cml0ZVByb3BzW2FdXT10aGlzLl9maXJzdFBUOyhoLl9wcmlvcml0eXx8aC5fb25Jbml0QWxsUHJvcHMpJiYobz0hMCksKGguX29uRGlzYWJsZXx8aC5fb25FbmFibGUpJiYodGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZD0hMCl9ZWxzZSB0aGlzLl9maXJzdFBUPWlbbl09bD17X25leHQ6dGhpcy5fZmlyc3RQVCx0OmUscDpuLGY6XCJmdW5jdGlvblwiPT10eXBlb2YgZVtuXSxuOm4scGc6ITEscHI6MH0sbC5zPWwuZj9lW24uaW5kZXhPZihcInNldFwiKXx8XCJmdW5jdGlvblwiIT10eXBlb2YgZVtcImdldFwiK24uc3Vic3RyKDMpXT9uOlwiZ2V0XCIrbi5zdWJzdHIoMyldKCk6cGFyc2VGbG9hdChlW25dKSxsLmM9XCJzdHJpbmdcIj09dHlwZW9mIF8mJlwiPVwiPT09Xy5jaGFyQXQoMSk/cGFyc2VJbnQoXy5jaGFyQXQoMCkrXCIxXCIsMTApKk51bWJlcihfLnN1YnN0cigyKSk6TnVtYmVyKF8pLWwuc3x8MDtsJiZsLl9uZXh0JiYobC5fbmV4dC5fcHJldj1sKX1yZXR1cm4gciYmdGhpcy5fa2lsbChyLGUpP3RoaXMuX2luaXRQcm9wcyhlLGkscyxyKTp0aGlzLl9vdmVyd3JpdGU+MSYmdGhpcy5fZmlyc3RQVCYmcy5sZW5ndGg+MSYmVyhlLHRoaXMsaSx0aGlzLl9vdmVyd3JpdGUscyk/KHRoaXMuX2tpbGwoaSxlKSx0aGlzLl9pbml0UHJvcHMoZSxpLHMscikpOih0aGlzLl9maXJzdFBUJiYodGhpcy52YXJzLmxhenkhPT0hMSYmdGhpcy5fZHVyYXRpb258fHRoaXMudmFycy5sYXp5JiYhdGhpcy5fZHVyYXRpb24pJiYoRVtlLl9nc1R3ZWVuSURdPSEwKSxvKX0sbi5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLHIsbixhLG89dGhpcy5fdGltZSxoPXRoaXMuX2R1cmF0aW9uLGw9dGhpcy5fcmF3UHJldlRpbWU7aWYodD49aCl0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT1oLHRoaXMucmF0aW89dGhpcy5fZWFzZS5fY2FsY0VuZD90aGlzLl9lYXNlLmdldFJhdGlvKDEpOjEsdGhpcy5fcmV2ZXJzZWR8fChzPSEwLHI9XCJvbkNvbXBsZXRlXCIpLDA9PT1oJiYodGhpcy5faW5pdHRlZHx8IXRoaXMudmFycy5sYXp5fHxpKSYmKHRoaXMuX3N0YXJ0VGltZT09PXRoaXMuX3RpbWVsaW5lLl9kdXJhdGlvbiYmKHQ9MCksKDA9PT10fHwwPmx8fGw9PT1fKSYmbCE9PXQmJihpPSEwLGw+XyYmKHI9XCJvblJldmVyc2VDb21wbGV0ZVwiKSksdGhpcy5fcmF3UHJldlRpbWU9YT0hZXx8dHx8bD09PXQ/dDpfKTtlbHNlIGlmKDFlLTc+dCl0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT0wLHRoaXMucmF0aW89dGhpcy5fZWFzZS5fY2FsY0VuZD90aGlzLl9lYXNlLmdldFJhdGlvKDApOjAsKDAhPT1vfHwwPT09aCYmbD4wJiZsIT09XykmJihyPVwib25SZXZlcnNlQ29tcGxldGVcIixzPXRoaXMuX3JldmVyc2VkKSwwPnQmJih0aGlzLl9hY3RpdmU9ITEsMD09PWgmJih0aGlzLl9pbml0dGVkfHwhdGhpcy52YXJzLmxhenl8fGkpJiYobD49MCYmKGk9ITApLHRoaXMuX3Jhd1ByZXZUaW1lPWE9IWV8fHR8fGw9PT10P3Q6XykpLHRoaXMuX2luaXR0ZWR8fChpPSEwKTtlbHNlIGlmKHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXQsdGhpcy5fZWFzZVR5cGUpe3ZhciB1PXQvaCxwPXRoaXMuX2Vhc2VUeXBlLGM9dGhpcy5fZWFzZVBvd2VyOygxPT09cHx8Mz09PXAmJnU+PS41KSYmKHU9MS11KSwzPT09cCYmKHUqPTIpLDE9PT1jP3UqPXU6Mj09PWM/dSo9dSp1OjM9PT1jP3UqPXUqdSp1OjQ9PT1jJiYodSo9dSp1KnUqdSksdGhpcy5yYXRpbz0xPT09cD8xLXU6Mj09PXA/dTouNT50L2g/dS8yOjEtdS8yfWVsc2UgdGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKHQvaCk7aWYodGhpcy5fdGltZSE9PW98fGkpe2lmKCF0aGlzLl9pbml0dGVkKXtpZih0aGlzLl9pbml0KCksIXRoaXMuX2luaXR0ZWR8fHRoaXMuX2djKXJldHVybjtpZighaSYmdGhpcy5fZmlyc3RQVCYmKHRoaXMudmFycy5sYXp5IT09ITEmJnRoaXMuX2R1cmF0aW9ufHx0aGlzLnZhcnMubGF6eSYmIXRoaXMuX2R1cmF0aW9uKSlyZXR1cm4gdGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWU9byx0aGlzLl9yYXdQcmV2VGltZT1sLEkucHVzaCh0aGlzKSx0aGlzLl9sYXp5PVt0LGVdLHZvaWQgMDt0aGlzLl90aW1lJiYhcz90aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZS9oKTpzJiZ0aGlzLl9lYXNlLl9jYWxjRW5kJiYodGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKDA9PT10aGlzLl90aW1lPzA6MSkpfWZvcih0aGlzLl9sYXp5IT09ITEmJih0aGlzLl9sYXp5PSExKSx0aGlzLl9hY3RpdmV8fCF0aGlzLl9wYXVzZWQmJnRoaXMuX3RpbWUhPT1vJiZ0Pj0wJiYodGhpcy5fYWN0aXZlPSEwKSwwPT09byYmKHRoaXMuX3N0YXJ0QXQmJih0Pj0wP3RoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKTpyfHwocj1cIl9kdW1teUdTXCIpKSx0aGlzLnZhcnMub25TdGFydCYmKDAhPT10aGlzLl90aW1lfHwwPT09aCkmJihlfHx0aGlzLnZhcnMub25TdGFydC5hcHBseSh0aGlzLnZhcnMub25TdGFydFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblN0YXJ0UGFyYW1zfHx5KSkpLG49dGhpcy5fZmlyc3RQVDtuOyluLmY/bi50W24ucF0obi5jKnRoaXMucmF0aW8rbi5zKTpuLnRbbi5wXT1uLmMqdGhpcy5yYXRpbytuLnMsbj1uLl9uZXh0O3RoaXMuX29uVXBkYXRlJiYoMD50JiZ0aGlzLl9zdGFydEF0JiZ0IT09LTFlLTQmJnRoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKSxlfHwodGhpcy5fdGltZSE9PW98fHMpJiZ0aGlzLl9vblVwZGF0ZS5hcHBseSh0aGlzLnZhcnMub25VcGRhdGVTY29wZXx8dGhpcyx0aGlzLnZhcnMub25VcGRhdGVQYXJhbXN8fHkpKSxyJiYoIXRoaXMuX2djfHxpKSYmKDA+dCYmdGhpcy5fc3RhcnRBdCYmIXRoaXMuX29uVXBkYXRlJiZ0IT09LTFlLTQmJnRoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKSxzJiYodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuJiZ0aGlzLl9lbmFibGVkKCExLCExKSx0aGlzLl9hY3RpdmU9ITEpLCFlJiZ0aGlzLnZhcnNbcl0mJnRoaXMudmFyc1tyXS5hcHBseSh0aGlzLnZhcnNbcitcIlNjb3BlXCJdfHx0aGlzLHRoaXMudmFyc1tyK1wiUGFyYW1zXCJdfHx5KSwwPT09aCYmdGhpcy5fcmF3UHJldlRpbWU9PT1fJiZhIT09XyYmKHRoaXMuX3Jhd1ByZXZUaW1lPTApKX19LG4uX2tpbGw9ZnVuY3Rpb24odCxlLGkpe2lmKFwiYWxsXCI9PT10JiYodD1udWxsKSxudWxsPT10JiYobnVsbD09ZXx8ZT09PXRoaXMudGFyZ2V0KSlyZXR1cm4gdGhpcy5fbGF6eT0hMSx0aGlzLl9lbmFibGVkKCExLCExKTtlPVwic3RyaW5nXCIhPXR5cGVvZiBlP2V8fHRoaXMuX3RhcmdldHN8fHRoaXMudGFyZ2V0OkQuc2VsZWN0b3IoZSl8fGU7dmFyIHMscixuLGEsbyxoLGwsXyx1O2lmKChjKGUpfHxNKGUpKSYmXCJudW1iZXJcIiE9dHlwZW9mIGVbMF0pZm9yKHM9ZS5sZW5ndGg7LS1zPi0xOyl0aGlzLl9raWxsKHQsZVtzXSkmJihoPSEwKTtlbHNle2lmKHRoaXMuX3RhcmdldHMpe2ZvcihzPXRoaXMuX3RhcmdldHMubGVuZ3RoOy0tcz4tMTspaWYoZT09PXRoaXMuX3RhcmdldHNbc10pe289dGhpcy5fcHJvcExvb2t1cFtzXXx8e30sdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcz10aGlzLl9vdmVyd3JpdHRlblByb3BzfHxbXSxyPXRoaXMuX292ZXJ3cml0dGVuUHJvcHNbc109dD90aGlzLl9vdmVyd3JpdHRlblByb3BzW3NdfHx7fTpcImFsbFwiO2JyZWFrfX1lbHNle2lmKGUhPT10aGlzLnRhcmdldClyZXR1cm4hMTtvPXRoaXMuX3Byb3BMb29rdXAscj10aGlzLl9vdmVyd3JpdHRlblByb3BzPXQ/dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc3x8e306XCJhbGxcIn1pZihvKXtsPXR8fG8sXz10IT09ciYmXCJhbGxcIiE9PXImJnQhPT1vJiYoXCJvYmplY3RcIiE9dHlwZW9mIHR8fCF0Ll90ZW1wS2lsbCk7Zm9yKG4gaW4gbCkoYT1vW25dKSYmKHV8fCh1PVtdKSx1LnB1c2gobiksYS5wZyYmYS50Ll9raWxsKGwpJiYoaD0hMCksYS5wZyYmMCE9PWEudC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RofHwoYS5fcHJldj9hLl9wcmV2Ll9uZXh0PWEuX25leHQ6YT09PXRoaXMuX2ZpcnN0UFQmJih0aGlzLl9maXJzdFBUPWEuX25leHQpLGEuX25leHQmJihhLl9uZXh0Ll9wcmV2PWEuX3ByZXYpLGEuX25leHQ9YS5fcHJldj1udWxsKSxkZWxldGUgb1tuXSksXyYmKHJbbl09MSk7XG4hdGhpcy5fZmlyc3RQVCYmdGhpcy5faW5pdHRlZCYmdGhpcy5fZW5hYmxlZCghMSwhMSksdSYmaSYmRyh0aGlzLGksZSx1KX19cmV0dXJuIGh9LG4uaW52YWxpZGF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkJiZELl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLHRoaXMpLHRoaXMuX2ZpcnN0UFQ9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcz10aGlzLl9zdGFydEF0PXRoaXMuX29uVXBkYXRlPW51bGwsdGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZD10aGlzLl9hY3RpdmU9dGhpcy5fbGF6eT0hMSx0aGlzLl9wcm9wTG9va3VwPXRoaXMuX3RhcmdldHM/e306W10sQS5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpLHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXImJih0aGlzLl90aW1lPS1fLHRoaXMucmVuZGVyKC10aGlzLl9kZWxheSkpLHRoaXN9LG4uX2VuYWJsZWQ9ZnVuY3Rpb24odCxlKXtpZihvfHxhLndha2UoKSx0JiZ0aGlzLl9nYyl7dmFyIGkscz10aGlzLl90YXJnZXRzO2lmKHMpZm9yKGk9cy5sZW5ndGg7LS1pPi0xOyl0aGlzLl9zaWJsaW5nc1tpXT1WKHNbaV0sdGhpcywhMCk7ZWxzZSB0aGlzLl9zaWJsaW5ncz1WKHRoaXMudGFyZ2V0LHRoaXMsITApfXJldHVybiBBLnByb3RvdHlwZS5fZW5hYmxlZC5jYWxsKHRoaXMsdCxlKSx0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkJiZ0aGlzLl9maXJzdFBUP0QuX29uUGx1Z2luRXZlbnQodD9cIl9vbkVuYWJsZVwiOlwiX29uRGlzYWJsZVwiLHRoaXMpOiExfSxELnRvPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gbmV3IEQodCxlLGkpfSxELmZyb209ZnVuY3Rpb24odCxlLGkpe3JldHVybiBpLnJ1bkJhY2t3YXJkcz0hMCxpLmltbWVkaWF0ZVJlbmRlcj0wIT1pLmltbWVkaWF0ZVJlbmRlcixuZXcgRCh0LGUsaSl9LEQuZnJvbVRvPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiBzLnN0YXJ0QXQ9aSxzLmltbWVkaWF0ZVJlbmRlcj0wIT1zLmltbWVkaWF0ZVJlbmRlciYmMCE9aS5pbW1lZGlhdGVSZW5kZXIsbmV3IEQodCxlLHMpfSxELmRlbGF5ZWRDYWxsPWZ1bmN0aW9uKHQsZSxpLHMscil7cmV0dXJuIG5ldyBEKGUsMCx7ZGVsYXk6dCxvbkNvbXBsZXRlOmUsb25Db21wbGV0ZVBhcmFtczppLG9uQ29tcGxldGVTY29wZTpzLG9uUmV2ZXJzZUNvbXBsZXRlOmUsb25SZXZlcnNlQ29tcGxldGVQYXJhbXM6aSxvblJldmVyc2VDb21wbGV0ZVNjb3BlOnMsaW1tZWRpYXRlUmVuZGVyOiExLHVzZUZyYW1lczpyLG92ZXJ3cml0ZTowfSl9LEQuc2V0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG5ldyBEKHQsMCxlKX0sRC5nZXRUd2VlbnNPZj1mdW5jdGlvbih0LGUpe2lmKG51bGw9PXQpcmV0dXJuW107dD1cInN0cmluZ1wiIT10eXBlb2YgdD90OkQuc2VsZWN0b3IodCl8fHQ7dmFyIGkscyxyLG47aWYoKGModCl8fE0odCkpJiZcIm51bWJlclwiIT10eXBlb2YgdFswXSl7Zm9yKGk9dC5sZW5ndGgscz1bXTstLWk+LTE7KXM9cy5jb25jYXQoRC5nZXRUd2VlbnNPZih0W2ldLGUpKTtmb3IoaT1zLmxlbmd0aDstLWk+LTE7KWZvcihuPXNbaV0scj1pOy0tcj4tMTspbj09PXNbcl0mJnMuc3BsaWNlKGksMSl9ZWxzZSBmb3Iocz1WKHQpLmNvbmNhdCgpLGk9cy5sZW5ndGg7LS1pPi0xOykoc1tpXS5fZ2N8fGUmJiFzW2ldLmlzQWN0aXZlKCkpJiZzLnNwbGljZShpLDEpO3JldHVybiBzfSxELmtpbGxUd2VlbnNPZj1ELmtpbGxEZWxheWVkQ2FsbHNUbz1mdW5jdGlvbih0LGUsaSl7XCJvYmplY3RcIj09dHlwZW9mIGUmJihpPWUsZT0hMSk7Zm9yKHZhciBzPUQuZ2V0VHdlZW5zT2YodCxlKSxyPXMubGVuZ3RoOy0tcj4tMTspc1tyXS5fa2lsbChpLHQpfTt2YXIgWj1nKFwicGx1Z2lucy5Ud2VlblBsdWdpblwiLGZ1bmN0aW9uKHQsZSl7dGhpcy5fb3ZlcndyaXRlUHJvcHM9KHR8fFwiXCIpLnNwbGl0KFwiLFwiKSx0aGlzLl9wcm9wTmFtZT10aGlzLl9vdmVyd3JpdGVQcm9wc1swXSx0aGlzLl9wcmlvcml0eT1lfHwwLHRoaXMuX3N1cGVyPVoucHJvdG90eXBlfSwhMCk7aWYobj1aLnByb3RvdHlwZSxaLnZlcnNpb249XCIxLjEwLjFcIixaLkFQST0yLG4uX2ZpcnN0UFQ9bnVsbCxuLl9hZGRUd2Vlbj1mdW5jdGlvbih0LGUsaSxzLHIsbil7dmFyIGEsbztyZXR1cm4gbnVsbCE9cyYmKGE9XCJudW1iZXJcIj09dHlwZW9mIHN8fFwiPVwiIT09cy5jaGFyQXQoMSk/TnVtYmVyKHMpLWk6cGFyc2VJbnQocy5jaGFyQXQoMCkrXCIxXCIsMTApKk51bWJlcihzLnN1YnN0cigyKSkpPyh0aGlzLl9maXJzdFBUPW89e19uZXh0OnRoaXMuX2ZpcnN0UFQsdDp0LHA6ZSxzOmksYzphLGY6XCJmdW5jdGlvblwiPT10eXBlb2YgdFtlXSxuOnJ8fGUscjpufSxvLl9uZXh0JiYoby5fbmV4dC5fcHJldj1vKSxvKTp2b2lkIDB9LG4uc2V0UmF0aW89ZnVuY3Rpb24odCl7Zm9yKHZhciBlLGk9dGhpcy5fZmlyc3RQVCxzPTFlLTY7aTspZT1pLmMqdCtpLnMsaS5yP2U9TWF0aC5yb3VuZChlKTpzPmUmJmU+LXMmJihlPTApLGkuZj9pLnRbaS5wXShlKTppLnRbaS5wXT1lLGk9aS5fbmV4dH0sbi5fa2lsbD1mdW5jdGlvbih0KXt2YXIgZSxpPXRoaXMuX292ZXJ3cml0ZVByb3BzLHM9dGhpcy5fZmlyc3RQVDtpZihudWxsIT10W3RoaXMuX3Byb3BOYW1lXSl0aGlzLl9vdmVyd3JpdGVQcm9wcz1bXTtlbHNlIGZvcihlPWkubGVuZ3RoOy0tZT4tMTspbnVsbCE9dFtpW2VdXSYmaS5zcGxpY2UoZSwxKTtmb3IoO3M7KW51bGwhPXRbcy5uXSYmKHMuX25leHQmJihzLl9uZXh0Ll9wcmV2PXMuX3ByZXYpLHMuX3ByZXY/KHMuX3ByZXYuX25leHQ9cy5fbmV4dCxzLl9wcmV2PW51bGwpOnRoaXMuX2ZpcnN0UFQ9PT1zJiYodGhpcy5fZmlyc3RQVD1zLl9uZXh0KSkscz1zLl9uZXh0O3JldHVybiExfSxuLl9yb3VuZFByb3BzPWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBpPXRoaXMuX2ZpcnN0UFQ7aTspKHRbdGhpcy5fcHJvcE5hbWVdfHxudWxsIT1pLm4mJnRbaS5uLnNwbGl0KHRoaXMuX3Byb3BOYW1lK1wiX1wiKS5qb2luKFwiXCIpXSkmJihpLnI9ZSksaT1pLl9uZXh0fSxELl9vblBsdWdpbkV2ZW50PWZ1bmN0aW9uKHQsZSl7dmFyIGkscyxyLG4sYSxvPWUuX2ZpcnN0UFQ7aWYoXCJfb25Jbml0QWxsUHJvcHNcIj09PXQpe2Zvcig7bzspe2ZvcihhPW8uX25leHQscz1yO3MmJnMucHI+by5wcjspcz1zLl9uZXh0OyhvLl9wcmV2PXM/cy5fcHJldjpuKT9vLl9wcmV2Ll9uZXh0PW86cj1vLChvLl9uZXh0PXMpP3MuX3ByZXY9bzpuPW8sbz1hfW89ZS5fZmlyc3RQVD1yfWZvcig7bzspby5wZyYmXCJmdW5jdGlvblwiPT10eXBlb2Ygby50W3RdJiZvLnRbdF0oKSYmKGk9ITApLG89by5fbmV4dDtyZXR1cm4gaX0sWi5hY3RpdmF0ZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9dC5sZW5ndGg7LS1lPi0xOyl0W2VdLkFQST09PVouQVBJJiYoTFsobmV3IHRbZV0pLl9wcm9wTmFtZV09dFtlXSk7cmV0dXJuITB9LGQucGx1Z2luPWZ1bmN0aW9uKHQpe2lmKCEodCYmdC5wcm9wTmFtZSYmdC5pbml0JiZ0LkFQSSkpdGhyb3dcImlsbGVnYWwgcGx1Z2luIGRlZmluaXRpb24uXCI7dmFyIGUsaT10LnByb3BOYW1lLHM9dC5wcmlvcml0eXx8MCxyPXQub3ZlcndyaXRlUHJvcHMsbj17aW5pdDpcIl9vbkluaXRUd2VlblwiLHNldDpcInNldFJhdGlvXCIsa2lsbDpcIl9raWxsXCIscm91bmQ6XCJfcm91bmRQcm9wc1wiLGluaXRBbGw6XCJfb25Jbml0QWxsUHJvcHNcIn0sYT1nKFwicGx1Z2lucy5cIitpLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK2kuc3Vic3RyKDEpK1wiUGx1Z2luXCIsZnVuY3Rpb24oKXtaLmNhbGwodGhpcyxpLHMpLHRoaXMuX292ZXJ3cml0ZVByb3BzPXJ8fFtdfSx0Lmdsb2JhbD09PSEwKSxvPWEucHJvdG90eXBlPW5ldyBaKGkpO28uY29uc3RydWN0b3I9YSxhLkFQST10LkFQSTtmb3IoZSBpbiBuKVwiZnVuY3Rpb25cIj09dHlwZW9mIHRbZV0mJihvW25bZV1dPXRbZV0pO3JldHVybiBhLnZlcnNpb249dC52ZXJzaW9uLFouYWN0aXZhdGUoW2FdKSxhfSxzPXQuX2dzUXVldWUpe2ZvcihyPTA7cy5sZW5ndGg+cjtyKyspc1tyXSgpO2ZvcihuIGluIGYpZltuXS5mdW5jfHx0LmNvbnNvbGUubG9nKFwiR1NBUCBlbmNvdW50ZXJlZCBtaXNzaW5nIGRlcGVuZGVuY3k6IGNvbS5ncmVlbnNvY2suXCIrbil9bz0hMX19KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzfHx3aW5kb3csXCJUd2Vlbk1heFwiKTtcbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIFR3ZWVuTWF4ICE9IFwidW5kZWZpbmVkXCIgPyBUd2Vlbk1heCA6IHdpbmRvdy5Ud2Vlbk1heCk7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyohXG4gKiBWRVJTSU9OOiAxLjcuNFxuICogREFURTogMjAxNC0wNy0xN1xuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL3d3dy5ncmVlbnNvY2suY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTQsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vd3d3LmdyZWVuc29jay5jb20vdGVybXNfb2ZfdXNlLmh0bWwgb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgc29mdHdhcmUgYWdyZWVtZW50IHRoYXQgd2FzIGlzc3VlZCB3aXRoIHlvdXIgbWVtYmVyc2hpcC5cbiAqIFxuICogQGF1dGhvcjogSmFjayBEb3lsZSwgamFja0BncmVlbnNvY2suY29tXG4gKiovXG52YXIgX2dzU2NvcGU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXN8fHdpbmRvdzsoX2dzU2NvcGUuX2dzUXVldWV8fChfZ3NTY29wZS5fZ3NRdWV1ZT1bXSkpLnB1c2goZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsZT13aW5kb3csaT1mdW5jdGlvbihpLHIpe3ZhciBzPVwieFwiPT09cj9cIldpZHRoXCI6XCJIZWlnaHRcIixuPVwic2Nyb2xsXCIrcyxvPVwiY2xpZW50XCIrcyxhPWRvY3VtZW50LmJvZHk7cmV0dXJuIGk9PT1lfHxpPT09dHx8aT09PWE/TWF0aC5tYXgodFtuXSxhW25dKS0oZVtcImlubmVyXCIrc118fE1hdGgubWF4KHRbb10sYVtvXSkpOmlbbl0taVtcIm9mZnNldFwiK3NdfSxyPV9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe3Byb3BOYW1lOlwic2Nyb2xsVG9cIixBUEk6Mix2ZXJzaW9uOlwiMS43LjRcIixpbml0OmZ1bmN0aW9uKHQscixzKXtyZXR1cm4gdGhpcy5fd2R3PXQ9PT1lLHRoaXMuX3RhcmdldD10LHRoaXMuX3R3ZWVuPXMsXCJvYmplY3RcIiE9dHlwZW9mIHImJihyPXt5OnJ9KSx0aGlzLnZhcnM9cix0aGlzLl9hdXRvS2lsbD1yLmF1dG9LaWxsIT09ITEsdGhpcy54PXRoaXMueFByZXY9dGhpcy5nZXRYKCksdGhpcy55PXRoaXMueVByZXY9dGhpcy5nZXRZKCksbnVsbCE9ci54Pyh0aGlzLl9hZGRUd2Vlbih0aGlzLFwieFwiLHRoaXMueCxcIm1heFwiPT09ci54P2kodCxcInhcIik6ci54LFwic2Nyb2xsVG9feFwiLCEwKSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKFwic2Nyb2xsVG9feFwiKSk6dGhpcy5za2lwWD0hMCxudWxsIT1yLnk/KHRoaXMuX2FkZFR3ZWVuKHRoaXMsXCJ5XCIsdGhpcy55LFwibWF4XCI9PT1yLnk/aSh0LFwieVwiKTpyLnksXCJzY3JvbGxUb195XCIsITApLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goXCJzY3JvbGxUb195XCIpKTp0aGlzLnNraXBZPSEwLCEwfSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5fc3VwZXIuc2V0UmF0aW8uY2FsbCh0aGlzLHQpO3ZhciByPXRoaXMuX3dkd3x8IXRoaXMuc2tpcFg/dGhpcy5nZXRYKCk6dGhpcy54UHJldixzPXRoaXMuX3dkd3x8IXRoaXMuc2tpcFk/dGhpcy5nZXRZKCk6dGhpcy55UHJldixuPXMtdGhpcy55UHJldixvPXItdGhpcy54UHJldjt0aGlzLl9hdXRvS2lsbCYmKCF0aGlzLnNraXBYJiYobz43fHwtNz5vKSYmaSh0aGlzLl90YXJnZXQsXCJ4XCIpPnImJih0aGlzLnNraXBYPSEwKSwhdGhpcy5za2lwWSYmKG4+N3x8LTc+bikmJmkodGhpcy5fdGFyZ2V0LFwieVwiKT5zJiYodGhpcy5za2lwWT0hMCksdGhpcy5za2lwWCYmdGhpcy5za2lwWSYmKHRoaXMuX3R3ZWVuLmtpbGwoKSx0aGlzLnZhcnMub25BdXRvS2lsbCYmdGhpcy52YXJzLm9uQXV0b0tpbGwuYXBwbHkodGhpcy52YXJzLm9uQXV0b0tpbGxTY29wZXx8dGhpcy5fdHdlZW4sdGhpcy52YXJzLm9uQXV0b0tpbGxQYXJhbXN8fFtdKSkpLHRoaXMuX3dkdz9lLnNjcm9sbFRvKHRoaXMuc2tpcFg/cjp0aGlzLngsdGhpcy5za2lwWT9zOnRoaXMueSk6KHRoaXMuc2tpcFl8fCh0aGlzLl90YXJnZXQuc2Nyb2xsVG9wPXRoaXMueSksdGhpcy5za2lwWHx8KHRoaXMuX3RhcmdldC5zY3JvbGxMZWZ0PXRoaXMueCkpLHRoaXMueFByZXY9dGhpcy54LHRoaXMueVByZXY9dGhpcy55fX0pLHM9ci5wcm90b3R5cGU7ci5tYXg9aSxzLmdldFg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd2R3P251bGwhPWUucGFnZVhPZmZzZXQ/ZS5wYWdlWE9mZnNldDpudWxsIT10LnNjcm9sbExlZnQ/dC5zY3JvbGxMZWZ0OmRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDp0aGlzLl90YXJnZXQuc2Nyb2xsTGVmdH0scy5nZXRZPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dkdz9udWxsIT1lLnBhZ2VZT2Zmc2V0P2UucGFnZVlPZmZzZXQ6bnVsbCE9dC5zY3JvbGxUb3A/dC5zY3JvbGxUb3A6ZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A6dGhpcy5fdGFyZ2V0LnNjcm9sbFRvcH0scy5fa2lsbD1mdW5jdGlvbih0KXtyZXR1cm4gdC5zY3JvbGxUb194JiYodGhpcy5za2lwWD0hMCksdC5zY3JvbGxUb195JiYodGhpcy5za2lwWT0hMCksdGhpcy5fc3VwZXIuX2tpbGwuY2FsbCh0aGlzLHQpfX0pLF9nc1Njb3BlLl9nc0RlZmluZSYmX2dzU2NvcGUuX2dzUXVldWUucG9wKCkoKTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIlxuOyhmdW5jdGlvbigpe1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIGBwYWdlLnN0YXJ0KClgLlxuICAgKlxuICAgKiAgIHBhZ2UoZm4pO1xuICAgKiAgIHBhZ2UoJyonLCBmbik7XG4gICAqICAgcGFnZSgnL3VzZXIvOmlkJywgbG9hZCwgdXNlcik7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQsIHsgc29tZTogJ3RoaW5nJyB9KTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCk7XG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBwYXRoKSB7XG4gICAgICByZXR1cm4gcGFnZSgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIC8vIHJvdXRlIDxwYXRoPiB0byA8Y2FsbGJhY2sgLi4uPlxuICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgIC8vIHNob3cgPHBhdGg+IHdpdGggW3N0YXRlXVxuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBmbik7XG4gICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpe1xuICAgIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25jbGljaywgZmFsc2UpO1xuICAgIGlmICghZGlzcGF0Y2gpIHJldHVybjtcbiAgICB2YXIgdXJsID0gbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBpZiAoZmFsc2UgIT09IGRpc3BhdGNoKSBwYWdlLmRpc3BhdGNoKGN0eCk7XG4gICAgaWYgKCFjdHgudW5oYW5kbGVkKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UucmVwbGFjZSA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBpbml0LCBkaXNwYXRjaCl7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgaWYgKG51bGwgPT0gZGlzcGF0Y2gpIGRpc3BhdGNoID0gdHJ1ZTtcbiAgICBpZiAoZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBjdHguc2F2ZSgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuY2FsbGJhY2tzW2krK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHQpO1xuICAgIH1cblxuICAgIG5leHQoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgdmFyIGN1cnJlbnQgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIGlmIChjdXJyZW50ID09IGN0eC5jYW5vbmljYWxQYXRoKSByZXR1cm47XG4gICAgcGFnZS5zdG9wKCk7XG4gICAgY3R4LnVuaGFuZGxlZCA9IHRydWU7XG4gICAgd2luZG93LmxvY2F0aW9uID0gY3R4LmNhbm9uaWNhbFBhdGg7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBcInJlcXVlc3RcIiBgQ29udGV4dGBcbiAgICogd2l0aCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBvcHRpb25hbCBpbml0aWFsIGBzdGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBDb250ZXh0KHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKCcvJyA9PSBwYXRoWzBdICYmIDAgIT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIHBhdGg7XG4gICAgdmFyIGkgPSBwYXRoLmluZGV4T2YoJz8nKTtcblxuICAgIHRoaXMuY2Fub25pY2FsUGF0aCA9IHBhdGg7XG4gICAgdGhpcy5wYXRoID0gcGF0aC5yZXBsYWNlKGJhc2UsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gcGF0aC5zbGljZShpICsgMSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gfmkgPyBwYXRoLnNsaWNlKDAsIGkpIDogcGF0aDtcbiAgICB0aGlzLnBhcmFtcyA9IFtdO1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgdmFyIHBhcnRzID0gdGhpcy5wYXRoLnNwbGl0KCcjJyk7XG4gICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgdGhpcy5oYXNoID0gcGFydHNbMV0gfHwgJyc7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IHRoaXMucXVlcnlzdHJpbmcuc3BsaXQoJyMnKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKXtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAocGF0aFxuICAgICAgLCB0aGlzLmtleXMgPSBbXVxuICAgICAgLCBvcHRpb25zLnNlbnNpdGl2ZVxuICAgICAgLCBvcHRpb25zLnN0cmljdCk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBSb3V0ZWAuXG4gICAqL1xuXG4gIHBhZ2UuUm91dGUgPSBSb3V0ZTtcblxuICAvKipcbiAgICogUmV0dXJuIHJvdXRlIG1pZGRsZXdhcmUgd2l0aFxuICAgKiB0aGUgZ2l2ZW4gY2FsbGJhY2sgYGZuKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihmbil7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpe1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtBcnJheX0gcGFyYW1zXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihwYXRoLCBwYXJhbXMpe1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzXG4gICAgICAsIHFzSW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKVxuICAgICAgLCBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGhcbiAgICAgICwgbSA9IHRoaXMucmVnZXhwLmV4ZWMocGF0aG5hbWUpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICB2YXIgdmFsID0gJ3N0cmluZycgPT0gdHlwZW9mIG1baV1cbiAgICAgICAgPyBkZWNvZGVVUklDb21wb25lbnQobVtpXSlcbiAgICAgICAgOiBtW2ldO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB1bmRlZmluZWQgIT09IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA/IHBhcmFtc1trZXkubmFtZV1cbiAgICAgICAgICA6IHZhbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgZ2l2ZW4gcGF0aCBzdHJpbmcsXG4gICAqIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQW4gZW1wdHkgYXJyYXkgc2hvdWxkIGJlIHBhc3NlZCxcbiAgICogd2hpY2ggd2lsbCBjb250YWluIHRoZSBwbGFjZWhvbGRlclxuICAgKiBrZXkgbmFtZXMuIEZvciBleGFtcGxlIFwiL3VzZXIvOmlkXCIgd2lsbFxuICAgKiB0aGVuIGNvbnRhaW4gW1wiaWRcIl0uXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ3xSZWdFeHB8QXJyYXl9IHBhdGhcbiAgICogQHBhcmFtICB7QXJyYXl9IGtleXNcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2Vuc2l0aXZlXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHN0cmljdFxuICAgKiBAcmV0dXJuIHtSZWdFeHB9XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBwYXRodG9SZWdleHAocGF0aCwga2V5cywgc2Vuc2l0aXZlLCBzdHJpY3QpIHtcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHBhdGg7XG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkgcGF0aCA9ICcoJyArIHBhdGguam9pbignfCcpICsgJyknO1xuICAgIHBhdGggPSBwYXRoXG4gICAgICAuY29uY2F0KHN0cmljdCA/ICcnIDogJy8/JylcbiAgICAgIC5yZXBsYWNlKC9cXC9cXCgvZywgJyg/Oi8nKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPyhcXC4pPzooXFx3KykoPzooXFwoLio/XFwpKSk/KFxcPyk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBmb3JtYXQsIGtleSwgY2FwdHVyZSwgb3B0aW9uYWwpe1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhISBvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoZm9ybWF0IHx8ICcnKSArIChjYXB0dXJlIHx8IChmb3JtYXQgJiYgJyhbXi8uXSs/KScgfHwgJyhbXi9dKz8pJykpICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLy5dKS9nLCAnXFxcXCQxJylcbiAgICAgIC5yZXBsYWNlKC9cXCovZywgJyguKiknKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBzZW5zaXRpdmUgPyAnJyA6ICdpJyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgIHBhZ2UucmVwbGFjZShwYXRoLCBlLnN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuICAgIGlmICgxICE9IHdoaWNoKGUpKSByZXR1cm47XG4gICAgaWYgKGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSkgcmV0dXJuO1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9IGVsLm5vZGVOYW1lKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmIChlbC5wYXRobmFtZSA9PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT0gbGluaykpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cbiAgICAvLyByZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoICsgZWwuaGFzaDtcblxuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpO1xuICAgIGlmIChiYXNlICYmIG9yaWcgPT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT0gZS53aGljaFxuICAgICAgPyBlLmJ1dHRvblxuICAgICAgOiBlLndoaWNoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBocmVmYCBpcyB0aGUgc2FtZSBvcmlnaW4uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhbWVPcmlnaW4oaHJlZikge1xuICAgIHZhciBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBpZiAobG9jYXRpb24ucG9ydCkgb3JpZ2luICs9ICc6JyArIGxvY2F0aW9uLnBvcnQ7XG4gICAgcmV0dXJuIDAgPT0gaHJlZi5pbmRleE9mKG9yaWdpbik7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIGBwYWdlYC5cbiAgICovXG5cbiAgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBtb2R1bGUpIHtcbiAgICB3aW5kb3cucGFnZSA9IHBhZ2U7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuICB9XG5cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVnVlLCBvcHRpb25zKSB7XG4gICAgVnVlLmxvZyA9IHJlcXVpcmUoJy4vbG9nJykoVnVlKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENsZWFuIGxvZyB3aXRob3V0IGdldHRlci9zZXR0ZXJcbiAqIHVzZWZ1bGwgZm9yIGluLWFwcGxpY2F0aW9uIGRlYnVnZ2luZy5cbiAqIE9ubHkgbG9nICRkYXRhICYgaXRzIHByb3BlcnRpZXNcbiAqXG4gKiAobW9zdGx5IHRvIGF2b2lkIEpTT04gcGFyc2UgZXhjZXB0aW9uIHdpdGhcbiAqIGNpcmN1bGFyIHJlZmVyZW5jZXMgZnJvbSB2bS4kY29tcGlsZXIpXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihWdWUpIHtcbiAgICB2YXIgdXRpbHMgPSBWdWUucmVxdWlyZSgndXRpbHMnKSxcbiAgICBpc09iamVjdCA9IHV0aWxzLmlzVHJ1ZU9iamVjdCxcbiAgICBzbGljZSA9IFtdLnNsaWNlO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZighY29uc29sZSkgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gYXJncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG5cbiAgICAgICAgICAgIC8vIERpcmVjdGx5IGxvZyBhbnkgcHJpbWl0aXZlIGFyZ1xuICAgICAgICAgICAgaWYoIWlzT2JqZWN0KGFyZykpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICB2YXIgaGFzQ2lyY3VsYXJSZWYgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc1ZtID0gISFhcmcuJGNvbXBpbGVyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBJZiBhcmcgaXMgYSB2bSwgbG9nICRkYXRhIGRpcmVjdGx5XG4gICAgICAgICAgICBpZihpc1ZtKSB7XG4gICAgICAgICAgICAgICAgYXJncy5zcGxpY2UoaSwgMSwgYXJnLiRkYXRhKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZG9uJ3QgbG9nIGlmICQgb3IgJGNvbXBpbGVyXG4gICAgICAgICAgICBmb3IodmFyIHByb3AgaW4gYXJnKSB7XG4gICAgICAgICAgICAgICAgLy8gJGNvbXBpbGVyXG4gICAgICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3ZtJykgaGFzQ2lyY3VsYXJSZWYgPSB0cnVlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICQgLyB2LXJlZlxuICAgICAgICAgICAgICAgIGlmKGlzT2JqZWN0KGFyZ1twcm9wXSkgJiYgJyRjb21waWxlcicgaW4gYXJnW3Byb3BdKSBoYXNDaXJjdWxhclJlZiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGhhc0NpcmN1bGFyUmVmKSB7XG4gICAgICAgICAgICAgICAgYXJncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHVzaW5nIGByZXR1cm5gIG1ha2VzIGl0IHRlc3RhYmxlICBcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXJncykpKTtcbiAgICB9O1xufTsiLCJleHBvcnRzLmluc3RhbGwgPSBmdW5jdGlvbiAoVnVlKSB7XG4gIFxuICBWdWUuZGlyZWN0aXZlKCdlbCcse1xuXG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gICAgYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb247XG5cbiAgICAgIGlmIChpZCkge1xuICAgICAgICB0aGlzLnZtLiQkID0gdGhpcy52bS4kJCB8fCB7fTtcbiAgICAgICAgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dID0gdGhpcy5lbDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvbjtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl07XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuZnVuY3Rpb24gZmluZChlbCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBmaW5kQWxsKGVsLCBzZWxlY3Rvcikge1xuICBlbCA9IGVsIHx8IGRvY3VtZW50O1xuICByZXR1cm4gc2xpY2UuY2FsbChlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnICcgKyBjbGFzc05hbWUgKyAnICcpLnRlc3QoJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnKTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheShvYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uKFZ1ZSkge1xuICB2YXIgdXRpbHMgPSBWdWUucmVxdWlyZSgndXRpbHMnKTtcbiAgdXRpbHMuZXh0ZW5kKFZ1ZS5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBzaW5nbGUgZG9tIGVsZW1lbnQgZnJvbSB0aGUgY3VycmVudCBWTSBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdG9yIHN0cmluZyBzZWxlY3RvciB0byBzZWFyY2hcbiAgICAgKiBAcmV0dXJuIHtkb21FbGVtZW50fSAgICAgICAgICB0aGUgVk0ncyBjaGlsZCBmb3VuZFxuICAgICAqL1xuICAgICRmaW5kT25lOiBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZmluZCh0aGlzLiRlbCwgc2VsZWN0b3IpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgZG9tRWxlbWVudCBmcm9tIHRoZSBjdXJyZW50IFZNIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvclxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0b3Igc3RyaW5nIHNlbGVjdG9yIHRvIHNlYXJjaFxuICAgICAqIEByZXR1cm4ge2FycmF5fSAgICAgICAgICBhcnJheSBjb250YWluaW5nIGRvbUVsZW1lbnRzIGZvdW5kIGluIHRoZSBWTVxuICAgICAqL1xuICAgICRmaW5kOiBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZmluZEFsbCh0aGlzLiRlbCwgc2VsZWN0b3IpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgY3VycmVudCBWTSBoYXMgYSBnaXZlbiBjbGFzcywgaWYgYSBzZWxlY3RvciBpcyBwYXNzZWQgYXMgc2Vjb25kIHBhcmFtZXRlcnMsIHdlJ2xsIGNoZWNrIHRoZSBjb3JyZXNwb25kaW5nIGNoaWxkIGluc3RlYWRcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBzZWxlY3RvclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIGVsID0gc2VsZWN0b3IgPyB0aGlzLiRmaW5kT25lKHNlbGVjdG9yKSA6IHRoaXMuJGVsO1xuICAgICAgICByZXR1cm4gaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNsYXNzIHRvIHRoZSBjdXJyZW50IFZNIG9yIHRvIGl0cyBjaGlsZCBtYXRjaGluZyAnc2VsZWN0b3InXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICAgICAqL1xuICAgIGFkZENsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUsIHNlbGVjdG9yKSB7XG4gICAgICAgIGlmKHRoaXMuaGFzQ2xhc3MoY2xhc3NOYW1lLCBzZWxlY3RvcikpIHJldHVybjtcbiAgICAgICAgdmFyIGVsID0gc2VsZWN0b3IgPyB0aGlzLiRmaW5kKHNlbGVjdG9yKSA6IHRoaXMuJGVsO1xuICAgICAgICBpZihpc0FycmF5KGVsKSkge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbCA9IGVsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmFkZENsYXNzKGVsW2ldLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1dGlscy5hZGRDbGFzcyhlbCwgY2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY2xhc3MgdG8gdGhlIGN1cnJlbnQgVk0gb3IgdG8gaXRzIGNoaWxkIG1hdGNoaW5nICdzZWxlY3RvcidcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIGVsID0gc2VsZWN0b3IgPyB0aGlzLiRmaW5kKHNlbGVjdG9yKSA6IHRoaXMuJGVsO1xuICAgICAgICBpZihpc0FycmF5KGVsKSkge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbCA9IGVsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKGVsW2ldLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1dGlscy5yZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKTtcbiAgICB9XG4gIH0pO1xufTsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcblxuZnVuY3Rpb24gQmF0Y2hlciAoKSB7XG4gICAgdGhpcy5yZXNldCgpXG59XG5cbnZhciBCYXRjaGVyUHJvdG8gPSBCYXRjaGVyLnByb3RvdHlwZVxuXG5CYXRjaGVyUHJvdG8ucHVzaCA9IGZ1bmN0aW9uIChqb2IpIHtcbiAgICBpZiAoIWpvYi5pZCB8fCAhdGhpcy5oYXNbam9iLmlkXSkge1xuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goam9iKVxuICAgICAgICB0aGlzLmhhc1tqb2IuaWRdID0gam9iXG4gICAgICAgIGlmICghdGhpcy53YWl0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLndhaXRpbmcgPSB0cnVlXG4gICAgICAgICAgICB1dGlscy5uZXh0VGljayh1dGlscy5iaW5kKHRoaXMuZmx1c2gsIHRoaXMpKVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChqb2Iub3ZlcnJpZGUpIHtcbiAgICAgICAgdmFyIG9sZEpvYiA9IHRoaXMuaGFzW2pvYi5pZF1cbiAgICAgICAgb2xkSm9iLmNhbmNlbGxlZCA9IHRydWVcbiAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKGpvYilcbiAgICAgICAgdGhpcy5oYXNbam9iLmlkXSA9IGpvYlxuICAgIH1cbn1cblxuQmF0Y2hlclByb3RvLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGJlZm9yZSBmbHVzaCBob29rXG4gICAgaWYgKHRoaXMuX3ByZUZsdXNoKSB0aGlzLl9wcmVGbHVzaCgpXG4gICAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgam9icyBtaWdodCBiZSBwdXNoZWRcbiAgICAvLyBhcyB3ZSBleGVjdXRlIGV4aXN0aW5nIGpvYnNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGpvYiA9IHRoaXMucXVldWVbaV1cbiAgICAgICAgaWYgKCFqb2IuY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICBqb2IuZXhlY3V0ZSgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZXNldCgpXG59XG5cbkJhdGNoZXJQcm90by5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmhhcyA9IHV0aWxzLmhhc2goKVxuICAgIHRoaXMucXVldWUgPSBbXVxuICAgIHRoaXMud2FpdGluZyA9IGZhbHNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmF0Y2hlciIsInZhciBCYXRjaGVyICAgICAgICA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpLFxuICAgIGJpbmRpbmdCYXRjaGVyID0gbmV3IEJhdGNoZXIoKSxcbiAgICBiaW5kaW5nSWQgICAgICA9IDFcblxuLyoqXG4gKiAgQmluZGluZyBjbGFzcy5cbiAqXG4gKiAgZWFjaCBwcm9wZXJ0eSBvbiB0aGUgdmlld21vZGVsIGhhcyBvbmUgY29ycmVzcG9uZGluZyBCaW5kaW5nIG9iamVjdFxuICogIHdoaWNoIGhhcyBtdWx0aXBsZSBkaXJlY3RpdmUgaW5zdGFuY2VzIG9uIHRoZSBET01cbiAqICBhbmQgbXVsdGlwbGUgY29tcHV0ZWQgcHJvcGVydHkgZGVwZW5kZW50c1xuICovXG5mdW5jdGlvbiBCaW5kaW5nIChjb21waWxlciwga2V5LCBpc0V4cCwgaXNGbikge1xuICAgIHRoaXMuaWQgPSBiaW5kaW5nSWQrK1xuICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWRcbiAgICB0aGlzLmlzRXhwID0gISFpc0V4cFxuICAgIHRoaXMuaXNGbiA9IGlzRm5cbiAgICB0aGlzLnJvb3QgPSAhdGhpcy5pc0V4cCAmJiBrZXkuaW5kZXhPZignLicpID09PSAtMVxuICAgIHRoaXMuY29tcGlsZXIgPSBjb21waWxlclxuICAgIHRoaXMua2V5ID0ga2V5XG4gICAgdGhpcy5kaXJzID0gW11cbiAgICB0aGlzLnN1YnMgPSBbXVxuICAgIHRoaXMuZGVwcyA9IFtdXG4gICAgdGhpcy51bmJvdW5kID0gZmFsc2Vcbn1cblxudmFyIEJpbmRpbmdQcm90byA9IEJpbmRpbmcucHJvdG90eXBlXG5cbi8qKlxuICogIFVwZGF0ZSB2YWx1ZSBhbmQgcXVldWUgaW5zdGFuY2UgdXBkYXRlcy5cbiAqL1xuQmluZGluZ1Byb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdGhpcy5pc0NvbXB1dGVkIHx8IHRoaXMuaXNGbikge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlycy5sZW5ndGggfHwgdGhpcy5zdWJzLmxlbmd0aCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgYmluZGluZ0JhdGNoZXIucHVzaCh7XG4gICAgICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYudW5ib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGUoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogIEFjdHVhbGx5IHVwZGF0ZSB0aGUgZGlyZWN0aXZlcy5cbiAqL1xuQmluZGluZ1Byb3RvLl91cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGkgPSB0aGlzLmRpcnMubGVuZ3RoLFxuICAgICAgICB2YWx1ZSA9IHRoaXMudmFsKClcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMuZGlyc1tpXS4kdXBkYXRlKHZhbHVlKVxuICAgIH1cbiAgICB0aGlzLnB1YigpXG59XG5cbi8qKlxuICogIFJldHVybiB0aGUgdmFsdWF0ZWQgdmFsdWUgcmVnYXJkbGVzc1xuICogIG9mIHdoZXRoZXIgaXQgaXMgY29tcHV0ZWQgb3Igbm90XG4gKi9cbkJpbmRpbmdQcm90by52YWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb21wdXRlZCAmJiAhdGhpcy5pc0ZuXG4gICAgICAgID8gdGhpcy52YWx1ZS4kZ2V0KClcbiAgICAgICAgOiB0aGlzLnZhbHVlXG59XG5cbi8qKlxuICogIE5vdGlmeSBjb21wdXRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVwZW5kIG9uIHRoaXMgYmluZGluZ1xuICogIHRvIHVwZGF0ZSB0aGVtc2VsdmVzXG4gKi9cbkJpbmRpbmdQcm90by5wdWIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGkgPSB0aGlzLnN1YnMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB0aGlzLnN1YnNbaV0udXBkYXRlKClcbiAgICB9XG59XG5cbi8qKlxuICogIFVuYmluZCB0aGUgYmluZGluZywgcmVtb3ZlIGl0c2VsZiBmcm9tIGFsbCBvZiBpdHMgZGVwZW5kZW5jaWVzXG4gKi9cbkJpbmRpbmdQcm90by51bmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSW5kaWNhdGUgdGhpcyBoYXMgYmVlbiB1bmJvdW5kLlxuICAgIC8vIEl0J3MgcG9zc2libGUgdGhpcyBiaW5kaW5nIHdpbGwgYmUgaW5cbiAgICAvLyB0aGUgYmF0Y2hlcidzIGZsdXNoIHF1ZXVlIHdoZW4gaXRzIG93bmVyXG4gICAgLy8gY29tcGlsZXIgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWQuXG4gICAgdGhpcy51bmJvdW5kID0gdHJ1ZVxuICAgIHZhciBpID0gdGhpcy5kaXJzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5kaXJzW2ldLiR1bmJpbmQoKVxuICAgIH1cbiAgICBpID0gdGhpcy5kZXBzLmxlbmd0aFxuICAgIHZhciBzdWJzXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBzdWJzID0gdGhpcy5kZXBzW2ldLnN1YnNcbiAgICAgICAgdmFyIGogPSBzdWJzLmluZGV4T2YodGhpcylcbiAgICAgICAgaWYgKGogPiAtMSkgc3Vicy5zcGxpY2UoaiwgMSlcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmluZGluZyIsInZhciBFbWl0dGVyICAgICA9IHJlcXVpcmUoJy4vZW1pdHRlcicpLFxuICAgIE9ic2VydmVyICAgID0gcmVxdWlyZSgnLi9vYnNlcnZlcicpLFxuICAgIGNvbmZpZyAgICAgID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICB1dGlscyAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBCaW5kaW5nICAgICA9IHJlcXVpcmUoJy4vYmluZGluZycpLFxuICAgIERpcmVjdGl2ZSAgID0gcmVxdWlyZSgnLi9kaXJlY3RpdmUnKSxcbiAgICBUZXh0UGFyc2VyICA9IHJlcXVpcmUoJy4vdGV4dC1wYXJzZXInKSxcbiAgICBEZXBzUGFyc2VyICA9IHJlcXVpcmUoJy4vZGVwcy1wYXJzZXInKSxcbiAgICBFeHBQYXJzZXIgICA9IHJlcXVpcmUoJy4vZXhwLXBhcnNlcicpLFxuICAgIFZpZXdNb2RlbCxcbiAgICBcbiAgICAvLyBjYWNoZSBtZXRob2RzXG4gICAgc2xpY2UgICAgICAgPSBbXS5zbGljZSxcbiAgICBleHRlbmQgICAgICA9IHV0aWxzLmV4dGVuZCxcbiAgICBoYXNPd24gICAgICA9ICh7fSkuaGFzT3duUHJvcGVydHksXG4gICAgZGVmICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG5cbiAgICAvLyBob29rcyB0byByZWdpc3RlclxuICAgIGhvb2tzID0gW1xuICAgICAgICAnY3JlYXRlZCcsICdyZWFkeScsXG4gICAgICAgICdiZWZvcmVEZXN0cm95JywgJ2FmdGVyRGVzdHJveScsXG4gICAgICAgICdhdHRhY2hlZCcsICdkZXRhY2hlZCdcbiAgICBdLFxuXG4gICAgLy8gbGlzdCBvZiBwcmlvcml0eSBkaXJlY3RpdmVzXG4gICAgLy8gdGhhdCBuZWVkcyB0byBiZSBjaGVja2VkIGluIHNwZWNpZmljIG9yZGVyXG4gICAgcHJpb3JpdHlEaXJlY3RpdmVzID0gW1xuICAgICAgICAnaWYnLFxuICAgICAgICAncmVwZWF0JyxcbiAgICAgICAgJ3ZpZXcnLFxuICAgICAgICAnY29tcG9uZW50J1xuICAgIF1cblxuLyoqXG4gKiAgVGhlIERPTSBjb21waWxlclxuICogIHNjYW5zIGEgRE9NIG5vZGUgYW5kIGNvbXBpbGUgYmluZGluZ3MgZm9yIGEgVmlld01vZGVsXG4gKi9cbmZ1bmN0aW9uIENvbXBpbGVyICh2bSwgb3B0aW9ucykge1xuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAga2V5LCBpXG5cbiAgICAvLyBkZWZhdWx0IHN0YXRlXG4gICAgY29tcGlsZXIuaW5pdCAgICAgICA9IHRydWVcbiAgICBjb21waWxlci5kZXN0cm95ZWQgID0gZmFsc2VcblxuICAgIC8vIHByb2Nlc3MgYW5kIGV4dGVuZCBvcHRpb25zXG4gICAgb3B0aW9ucyA9IGNvbXBpbGVyLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdXRpbHMucHJvY2Vzc09wdGlvbnMob3B0aW9ucylcblxuICAgIC8vIGNvcHkgY29tcGlsZXIgb3B0aW9uc1xuICAgIGV4dGVuZChjb21waWxlciwgb3B0aW9ucy5jb21waWxlck9wdGlvbnMpXG4gICAgLy8gcmVwZWF0IGluZGljYXRlcyB0aGlzIGlzIGEgdi1yZXBlYXQgaW5zdGFuY2VcbiAgICBjb21waWxlci5yZXBlYXQgICA9IGNvbXBpbGVyLnJlcGVhdCB8fCBmYWxzZVxuICAgIC8vIGV4cENhY2hlIHdpbGwgYmUgc2hhcmVkIGJldHdlZW4gdi1yZXBlYXQgaW5zdGFuY2VzXG4gICAgY29tcGlsZXIuZXhwQ2FjaGUgPSBjb21waWxlci5leHBDYWNoZSB8fCB7fVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBlbGVtZW50XG4gICAgdmFyIGVsID0gY29tcGlsZXIuZWwgPSBjb21waWxlci5zZXR1cEVsZW1lbnQob3B0aW9ucylcbiAgICB1dGlscy5sb2coJ1xcbm5ldyBWTSBpbnN0YW5jZTogJyArIGVsLnRhZ05hbWUgKyAnXFxuJylcblxuICAgIC8vIHNldCBvdGhlciBjb21waWxlciBwcm9wZXJ0aWVzXG4gICAgY29tcGlsZXIudm0gICAgICAgPSBlbC52dWVfdm0gPSB2bVxuICAgIGNvbXBpbGVyLmJpbmRpbmdzID0gdXRpbHMuaGFzaCgpXG4gICAgY29tcGlsZXIuZGlycyAgICAgPSBbXVxuICAgIGNvbXBpbGVyLmRlZmVycmVkID0gW11cbiAgICBjb21waWxlci5jb21wdXRlZCA9IFtdXG4gICAgY29tcGlsZXIuY2hpbGRyZW4gPSBbXVxuICAgIGNvbXBpbGVyLmVtaXR0ZXIgID0gbmV3IEVtaXR0ZXIodm0pXG5cbiAgICAvLyBWTSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIHNldCBWTSBwcm9wZXJ0aWVzXG4gICAgdm0uJCAgICAgICAgID0ge31cbiAgICB2bS4kZWwgICAgICAgPSBlbFxuICAgIHZtLiRvcHRpb25zICA9IG9wdGlvbnNcbiAgICB2bS4kY29tcGlsZXIgPSBjb21waWxlclxuICAgIHZtLiRldmVudCAgICA9IG51bGxcblxuICAgIC8vIHNldCBwYXJlbnQgJiByb290XG4gICAgdmFyIHBhcmVudFZNID0gb3B0aW9ucy5wYXJlbnRcbiAgICBpZiAocGFyZW50Vk0pIHtcbiAgICAgICAgY29tcGlsZXIucGFyZW50ID0gcGFyZW50Vk0uJGNvbXBpbGVyXG4gICAgICAgIHBhcmVudFZNLiRjb21waWxlci5jaGlsZHJlbi5wdXNoKGNvbXBpbGVyKVxuICAgICAgICB2bS4kcGFyZW50ID0gcGFyZW50Vk1cbiAgICAgICAgLy8gaW5oZXJpdCBsYXp5IG9wdGlvblxuICAgICAgICBpZiAoISgnbGF6eScgaW4gb3B0aW9ucykpIHtcbiAgICAgICAgICAgIG9wdGlvbnMubGF6eSA9IGNvbXBpbGVyLnBhcmVudC5vcHRpb25zLmxhenlcbiAgICAgICAgfVxuICAgIH1cbiAgICB2bS4kcm9vdCA9IGdldFJvb3QoY29tcGlsZXIpLnZtXG5cbiAgICAvLyBEQVRBIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIHNldHVwIG9ic2VydmVyXG4gICAgLy8gdGhpcyBpcyBuZWNlc2FycnkgZm9yIGFsbCBob29rcyBhbmQgZGF0YSBvYnNlcnZhdGlvbiBldmVudHNcbiAgICBjb21waWxlci5zZXR1cE9ic2VydmVyKClcblxuICAgIC8vIGNyZWF0ZSBiaW5kaW5ncyBmb3IgY29tcHV0ZWQgcHJvcGVydGllc1xuICAgIGlmIChvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb3B0aW9ucy5tZXRob2RzKSB7XG4gICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBiaW5kaW5ncyBmb3IgbWV0aG9kc1xuICAgIGlmIChvcHRpb25zLmNvbXB1dGVkKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9wdGlvbnMuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBkYXRhXG4gICAgdmFyIGRhdGEgPSBjb21waWxlci5kYXRhID0gb3B0aW9ucy5kYXRhIHx8IHt9LFxuICAgICAgICBkZWZhdWx0RGF0YSA9IG9wdGlvbnMuZGVmYXVsdERhdGFcbiAgICBpZiAoZGVmYXVsdERhdGEpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gZGVmYXVsdERhdGEpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duLmNhbGwoZGF0YSwga2V5KSkge1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IGRlZmF1bHREYXRhW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvcHkgcGFyYW1BdHRyaWJ1dGVzXG4gICAgdmFyIHBhcmFtcyA9IG9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzXG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgICBpID0gcGFyYW1zLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBkYXRhW3BhcmFtc1tpXV0gPSB1dGlscy5jaGVja051bWJlcihcbiAgICAgICAgICAgICAgICBjb21waWxlci5ldmFsKFxuICAgICAgICAgICAgICAgICAgICBlbC5nZXRBdHRyaWJ1dGUocGFyYW1zW2ldKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvcHkgZGF0YSBwcm9wZXJ0aWVzIHRvIHZtXG4gICAgLy8gc28gdXNlciBjYW4gYWNjZXNzIHRoZW0gaW4gdGhlIGNyZWF0ZWQgaG9va1xuICAgIGV4dGVuZCh2bSwgZGF0YSlcbiAgICB2bS4kZGF0YSA9IGRhdGFcblxuICAgIC8vIGJlZm9yZUNvbXBpbGUgaG9va1xuICAgIGNvbXBpbGVyLmV4ZWNIb29rKCdjcmVhdGVkJylcblxuICAgIC8vIHRoZSB1c2VyIG1pZ2h0IGhhdmUgc3dhcHBlZCB0aGUgZGF0YSAuLi5cbiAgICBkYXRhID0gY29tcGlsZXIuZGF0YSA9IHZtLiRkYXRhXG5cbiAgICAvLyB1c2VyIG1pZ2h0IGFsc28gc2V0IHNvbWUgcHJvcGVydGllcyBvbiB0aGUgdm1cbiAgICAvLyBpbiB3aGljaCBjYXNlIHdlIHNob3VsZCBjb3B5IGJhY2sgdG8gJGRhdGFcbiAgICB2YXIgdm1Qcm9wXG4gICAgZm9yIChrZXkgaW4gdm0pIHtcbiAgICAgICAgdm1Qcm9wID0gdm1ba2V5XVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBrZXkuY2hhckF0KDApICE9PSAnJCcgJiZcbiAgICAgICAgICAgIGRhdGFba2V5XSAhPT0gdm1Qcm9wICYmXG4gICAgICAgICAgICB0eXBlb2Ygdm1Qcm9wICE9PSAnZnVuY3Rpb24nXG4gICAgICAgICkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0gdm1Qcm9wXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBub3cgd2UgY2FuIG9ic2VydmUgdGhlIGRhdGEuXG4gICAgLy8gdGhpcyB3aWxsIGNvbnZlcnQgZGF0YSBwcm9wZXJ0aWVzIHRvIGdldHRlci9zZXR0ZXJzXG4gICAgLy8gYW5kIGVtaXQgdGhlIGZpcnN0IGJhdGNoIG9mIHNldCBldmVudHMsIHdoaWNoIHdpbGxcbiAgICAvLyBpbiB0dXJuIGNyZWF0ZSB0aGUgY29ycmVzcG9uZGluZyBiaW5kaW5ncy5cbiAgICBjb21waWxlci5vYnNlcnZlRGF0YShkYXRhKVxuXG4gICAgLy8gQ09NUElMRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBiZWZvcmUgY29tcGlsaW5nLCByZXNvbHZlIGNvbnRlbnQgaW5zZXJ0aW9uIHBvaW50c1xuICAgIGlmIChvcHRpb25zLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZUNvbnRlbnQoKVxuICAgIH1cblxuICAgIC8vIG5vdyBwYXJzZSB0aGUgRE9NIGFuZCBiaW5kIGRpcmVjdGl2ZXMuXG4gICAgLy8gRHVyaW5nIHRoaXMgc3RhZ2UsIHdlIHdpbGwgYWxzbyBjcmVhdGUgYmluZGluZ3MgZm9yXG4gICAgLy8gZW5jb3VudGVyZWQga2V5cGF0aHMgdGhhdCBkb24ndCBoYXZlIGEgYmluZGluZyB5ZXQuXG4gICAgY29tcGlsZXIuY29tcGlsZShlbCwgdHJ1ZSlcblxuICAgIC8vIEFueSBkaXJlY3RpdmUgdGhhdCBjcmVhdGVzIGNoaWxkIFZNcyBhcmUgZGVmZXJyZWRcbiAgICAvLyBzbyB0aGF0IHdoZW4gdGhleSBhcmUgY29tcGlsZWQsIGFsbCBiaW5kaW5ncyBvbiB0aGVcbiAgICAvLyBwYXJlbnQgVk0gaGF2ZSBiZWVuIGNyZWF0ZWQuXG4gICAgaSA9IGNvbXBpbGVyLmRlZmVycmVkLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29tcGlsZXIuYmluZERpcmVjdGl2ZShjb21waWxlci5kZWZlcnJlZFtpXSlcbiAgICB9XG4gICAgY29tcGlsZXIuZGVmZXJyZWQgPSBudWxsXG5cbiAgICAvLyBleHRyYWN0IGRlcGVuZGVuY2llcyBmb3IgY29tcHV0ZWQgcHJvcGVydGllcy5cbiAgICAvLyB0aGlzIHdpbGwgZXZhbHVhdGVkIGFsbCBjb2xsZWN0ZWQgY29tcHV0ZWQgYmluZGluZ3NcbiAgICAvLyBhbmQgY29sbGVjdCBnZXQgZXZlbnRzIHRoYXQgYXJlIGVtaXR0ZWQuXG4gICAgaWYgKHRoaXMuY29tcHV0ZWQubGVuZ3RoKSB7XG4gICAgICAgIERlcHNQYXJzZXIucGFyc2UodGhpcy5jb21wdXRlZClcbiAgICB9XG5cbiAgICAvLyBkb25lIVxuICAgIGNvbXBpbGVyLmluaXQgPSBmYWxzZVxuXG4gICAgLy8gcG9zdCBjb21waWxlIC8gcmVhZHkgaG9va1xuICAgIGNvbXBpbGVyLmV4ZWNIb29rKCdyZWFkeScpXG59XG5cbnZhciBDb21waWxlclByb3RvID0gQ29tcGlsZXIucHJvdG90eXBlXG5cbi8qKlxuICogIEluaXRpYWxpemUgdGhlIFZNL0NvbXBpbGVyJ3MgZWxlbWVudC5cbiAqICBGaWxsIGl0IGluIHdpdGggdGhlIHRlbXBsYXRlIGlmIG5lY2Vzc2FyeS5cbiAqL1xuQ29tcGlsZXJQcm90by5zZXR1cEVsZW1lbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIC8vIGNyZWF0ZSB0aGUgbm9kZSBmaXJzdFxuICAgIHZhciBlbCA9IHR5cGVvZiBvcHRpb25zLmVsID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5lbClcbiAgICAgICAgOiBvcHRpb25zLmVsIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQob3B0aW9ucy50YWdOYW1lIHx8ICdkaXYnKVxuXG4gICAgdmFyIHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZSxcbiAgICAgICAgY2hpbGQsIHJlcGxhY2VyLCBpLCBhdHRyLCBhdHRyc1xuXG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIC8vIGNvbGxlY3QgYW55dGhpbmcgYWxyZWFkeSBpbiB0aGVyZVxuICAgICAgICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICB0aGlzLnJhd0NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgICAgICAgICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhd0NvbnRlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVwbGFjZSBvcHRpb246IHVzZSB0aGUgZmlyc3Qgbm9kZSBpblxuICAgICAgICAvLyB0aGUgdGVtcGxhdGUgZGlyZWN0bHlcbiAgICAgICAgaWYgKG9wdGlvbnMucmVwbGFjZSAmJiB0ZW1wbGF0ZS5maXJzdENoaWxkID09PSB0ZW1wbGF0ZS5sYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHJlcGxhY2VyID0gdGVtcGxhdGUuZmlyc3RDaGlsZC5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocmVwbGFjZXIsIGVsKVxuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb3B5IG92ZXIgYXR0cmlidXRlc1xuICAgICAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgICAgICAgICAgICAgIGkgPSBlbC5hdHRyaWJ1dGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0ciA9IGVsLmF0dHJpYnV0ZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZXIuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXBsYWNlXG4gICAgICAgICAgICBlbCA9IHJlcGxhY2VyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIGFwcGx5IGVsZW1lbnQgb3B0aW9uc1xuICAgIGlmIChvcHRpb25zLmlkKSBlbC5pZCA9IG9wdGlvbnMuaWRcbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGVsLmNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lXG4gICAgYXR0cnMgPSBvcHRpb25zLmF0dHJpYnV0ZXNcbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgICAgZm9yIChhdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiAgRGVhbCB3aXRoIDxjb250ZW50PiBpbnNlcnRpb24gcG9pbnRzXG4gKiAgcGVyIHRoZSBXZWIgQ29tcG9uZW50cyBzcGVjXG4gKi9cbkNvbXBpbGVyUHJvdG8ucmVzb2x2ZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgb3V0bGV0cyA9IHNsaWNlLmNhbGwodGhpcy5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY29udGVudCcpKSxcbiAgICAgICAgcmF3ID0gdGhpcy5yYXdDb250ZW50LFxuICAgICAgICBvdXRsZXQsIHNlbGVjdCwgaSwgaiwgbWFpblxuXG4gICAgaSA9IG91dGxldHMubGVuZ3RoXG4gICAgaWYgKGkpIHtcbiAgICAgICAgLy8gZmlyc3QgcGFzcywgY29sbGVjdCBjb3JyZXNwb25kaW5nIGNvbnRlbnRcbiAgICAgICAgLy8gZm9yIGVhY2ggb3V0bGV0LlxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ID0gb3V0bGV0LmdldEF0dHJpYnV0ZSgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0KSB7IC8vIHNlbGVjdCBjb250ZW50XG4gICAgICAgICAgICAgICAgICAgIG91dGxldC5jb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlLmNhbGwocmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0KSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBkZWZhdWx0IGNvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgbWFpbiA9IG91dGxldFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIGZhbGxiYWNrIGNvbnRlbnRcbiAgICAgICAgICAgICAgICBvdXRsZXQuY29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgIHNsaWNlLmNhbGwob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2Vjb25kIHBhc3MsIGFjdHVhbGx5IGluc2VydCB0aGUgY29udGVudHNcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IG91dGxldHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgICAgICAgICBpZiAob3V0bGV0ID09PSBtYWluKSBjb250aW51ZVxuICAgICAgICAgICAgaW5zZXJ0KG91dGxldCwgb3V0bGV0LmNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgICAgLy8gZmluYWxseSBpbnNlcnQgdGhlIG1haW4gY29udGVudFxuICAgICAgICBpZiAocmF3ICYmIG1haW4pIHtcbiAgICAgICAgICAgIGluc2VydChtYWluLCBzbGljZS5jYWxsKHJhdy5jaGlsZE5vZGVzKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydCAob3V0bGV0LCBjb250ZW50cykge1xuICAgICAgICB2YXIgcGFyZW50ID0gb3V0bGV0LnBhcmVudE5vZGUsXG4gICAgICAgICAgICBpID0gMCwgaiA9IGNvbnRlbnRzLmxlbmd0aFxuICAgICAgICBmb3IgKDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjb250ZW50c1tpXSwgb3V0bGV0KVxuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChvdXRsZXQpXG4gICAgfVxuXG4gICAgdGhpcy5yYXdDb250ZW50ID0gbnVsbFxufVxuXG4vKipcbiAqICBTZXR1cCBvYnNlcnZlci5cbiAqICBUaGUgb2JzZXJ2ZXIgbGlzdGVucyBmb3IgZ2V0L3NldC9tdXRhdGUgZXZlbnRzIG9uIGFsbCBWTVxuICogIHZhbHVlcy9vYmplY3RzIGFuZCB0cmlnZ2VyIGNvcnJlc3BvbmRpbmcgYmluZGluZyB1cGRhdGVzLlxuICogIEl0IGFsc28gbGlzdGVucyBmb3IgbGlmZWN5Y2xlIGhvb2tzLlxuICovXG5Db21waWxlclByb3RvLnNldHVwT2JzZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBiaW5kaW5ncyA9IGNvbXBpbGVyLmJpbmRpbmdzLFxuICAgICAgICBvcHRpb25zICA9IGNvbXBpbGVyLm9wdGlvbnMsXG4gICAgICAgIG9ic2VydmVyID0gY29tcGlsZXIub2JzZXJ2ZXIgPSBuZXcgRW1pdHRlcihjb21waWxlci52bSlcblxuICAgIC8vIGEgaGFzaCB0byBob2xkIGV2ZW50IHByb3hpZXMgZm9yIGVhY2ggcm9vdCBsZXZlbCBrZXlcbiAgICAvLyBzbyB0aGV5IGNhbiBiZSByZWZlcmVuY2VkIGFuZCByZW1vdmVkIGxhdGVyXG4gICAgb2JzZXJ2ZXIucHJveGllcyA9IHt9XG5cbiAgICAvLyBhZGQgb3duIGxpc3RlbmVycyB3aGljaCB0cmlnZ2VyIGJpbmRpbmcgdXBkYXRlc1xuICAgIG9ic2VydmVyXG4gICAgICAgIC5vbignZ2V0Jywgb25HZXQpXG4gICAgICAgIC5vbignc2V0Jywgb25TZXQpXG4gICAgICAgIC5vbignbXV0YXRlJywgb25TZXQpXG5cbiAgICAvLyByZWdpc3RlciBob29rc1xuICAgIHZhciBpID0gaG9va3MubGVuZ3RoLCBqLCBob29rLCBmbnNcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGhvb2sgPSBob29rc1tpXVxuICAgICAgICBmbnMgPSBvcHRpb25zW2hvb2tdXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZucykpIHtcbiAgICAgICAgICAgIGogPSBmbnMubGVuZ3RoXG4gICAgICAgICAgICAvLyBzaW5jZSBob29rcyB3ZXJlIG1lcmdlZCB3aXRoIGNoaWxkIGF0IGhlYWQsXG4gICAgICAgICAgICAvLyB3ZSBsb29wIHJldmVyc2VseS5cbiAgICAgICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlckhvb2soaG9vaywgZm5zW2pdKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZucykge1xuICAgICAgICAgICAgcmVnaXN0ZXJIb29rKGhvb2ssIGZucylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGJyb2FkY2FzdCBhdHRhY2hlZC9kZXRhY2hlZCBob29rc1xuICAgIG9ic2VydmVyXG4gICAgICAgIC5vbignaG9vazphdHRhY2hlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyb2FkY2FzdCgxKVxuICAgICAgICB9KVxuICAgICAgICAub24oJ2hvb2s6ZGV0YWNoZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBicm9hZGNhc3QoMClcbiAgICAgICAgfSlcblxuICAgIGZ1bmN0aW9uIG9uR2V0IChrZXkpIHtcbiAgICAgICAgY2hlY2soa2V5KVxuICAgICAgICBEZXBzUGFyc2VyLmNhdGNoZXIuZW1pdCgnZ2V0JywgYmluZGluZ3Nba2V5XSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblNldCAoa2V5LCB2YWwsIG11dGF0aW9uKSB7XG4gICAgICAgIG9ic2VydmVyLmVtaXQoJ2NoYW5nZTonICsga2V5LCB2YWwsIG11dGF0aW9uKVxuICAgICAgICBjaGVjayhrZXkpXG4gICAgICAgIGJpbmRpbmdzW2tleV0udXBkYXRlKHZhbClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3Rlckhvb2sgKGhvb2ssIGZuKSB7XG4gICAgICAgIG9ic2VydmVyLm9uKCdob29rOicgKyBob29rLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmbi5jYWxsKGNvbXBpbGVyLnZtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJyb2FkY2FzdCAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gY29tcGlsZXIuY2hpbGRyZW5cbiAgICAgICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQsIGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQgPSAnaG9vazonICsgKGV2ZW50ID8gJ2F0dGFjaGVkJyA6ICdkZXRhY2hlZCcpXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9ic2VydmVyLmVtaXQoZXZlbnQpXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmVtaXR0ZXIuZW1pdChldmVudClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVjayAoa2V5KSB7XG4gICAgICAgIGlmICghYmluZGluZ3Nba2V5XSkge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbkNvbXBpbGVyUHJvdG8ub2JzZXJ2ZURhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgb2JzZXJ2ZXIgPSBjb21waWxlci5vYnNlcnZlclxuXG4gICAgLy8gcmVjdXJzaXZlbHkgb2JzZXJ2ZSBuZXN0ZWQgcHJvcGVydGllc1xuICAgIE9ic2VydmVyLm9ic2VydmUoZGF0YSwgJycsIG9ic2VydmVyKVxuXG4gICAgLy8gYWxzbyBjcmVhdGUgYmluZGluZyBmb3IgdG9wIGxldmVsICRkYXRhXG4gICAgLy8gc28gaXQgY2FuIGJlIHVzZWQgaW4gdGVtcGxhdGVzIHRvb1xuICAgIHZhciAkZGF0YUJpbmRpbmcgPSBjb21waWxlci5iaW5kaW5nc1snJGRhdGEnXSA9IG5ldyBCaW5kaW5nKGNvbXBpbGVyLCAnJGRhdGEnKVxuICAgICRkYXRhQmluZGluZy51cGRhdGUoZGF0YSlcblxuICAgIC8vIGFsbG93ICRkYXRhIHRvIGJlIHN3YXBwZWRcbiAgICBkZWYoY29tcGlsZXIudm0sICckZGF0YScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21waWxlci5vYnNlcnZlci5lbWl0KCdnZXQnLCAnJGRhdGEnKVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBpbGVyLmRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgICAgICAgICAgdmFyIG9sZERhdGEgPSBjb21waWxlci5kYXRhXG4gICAgICAgICAgICBPYnNlcnZlci51bm9ic2VydmUob2xkRGF0YSwgJycsIG9ic2VydmVyKVxuICAgICAgICAgICAgY29tcGlsZXIuZGF0YSA9IG5ld0RhdGFcbiAgICAgICAgICAgIE9ic2VydmVyLmNvcHlQYXRocyhuZXdEYXRhLCBvbGREYXRhKVxuICAgICAgICAgICAgT2JzZXJ2ZXIub2JzZXJ2ZShuZXdEYXRhLCAnJywgb2JzZXJ2ZXIpXG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC8vIGVtaXQgJGRhdGEgY2hhbmdlIG9uIGFsbCBjaGFuZ2VzXG4gICAgb2JzZXJ2ZXJcbiAgICAgICAgLm9uKCdzZXQnLCBvblNldClcbiAgICAgICAgLm9uKCdtdXRhdGUnLCBvblNldClcblxuICAgIGZ1bmN0aW9uIG9uU2V0IChrZXkpIHtcbiAgICAgICAgaWYgKGtleSAhPT0gJyRkYXRhJykgdXBkYXRlKClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGUgKCkge1xuICAgICAgICAkZGF0YUJpbmRpbmcudXBkYXRlKGNvbXBpbGVyLmRhdGEpXG4gICAgICAgIG9ic2VydmVyLmVtaXQoJ2NoYW5nZTokZGF0YScsIGNvbXBpbGVyLmRhdGEpXG4gICAgfVxufVxuXG4vKipcbiAqICBDb21waWxlIGEgRE9NIG5vZGUgKHJlY3Vyc2l2ZSlcbiAqL1xuQ29tcGlsZXJQcm90by5jb21waWxlID0gZnVuY3Rpb24gKG5vZGUsIHJvb3QpIHtcbiAgICB2YXIgbm9kZVR5cGUgPSBub2RlLm5vZGVUeXBlXG4gICAgaWYgKG5vZGVUeXBlID09PSAxICYmIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcpIHsgLy8gYSBub3JtYWwgbm9kZVxuICAgICAgICB0aGlzLmNvbXBpbGVFbGVtZW50KG5vZGUsIHJvb3QpXG4gICAgfSBlbHNlIGlmIChub2RlVHlwZSA9PT0gMyAmJiBjb25maWcuaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgdGhpcy5jb21waWxlVGV4dE5vZGUobm9kZSlcbiAgICB9XG59XG5cbi8qKlxuICogIENoZWNrIGZvciBhIHByaW9yaXR5IGRpcmVjdGl2ZVxuICogIElmIGl0IGlzIHByZXNlbnQgYW5kIHZhbGlkLCByZXR1cm4gdHJ1ZSB0byBza2lwIHRoZSByZXN0XG4gKi9cbkNvbXBpbGVyUHJvdG8uY2hlY2tQcmlvcml0eURpciA9IGZ1bmN0aW9uIChkaXJuYW1lLCBub2RlLCByb290KSB7XG4gICAgdmFyIGV4cHJlc3Npb24sIGRpcmVjdGl2ZSwgQ3RvclxuICAgIGlmIChcbiAgICAgICAgZGlybmFtZSA9PT0gJ2NvbXBvbmVudCcgJiZcbiAgICAgICAgcm9vdCAhPT0gdHJ1ZSAmJlxuICAgICAgICAoQ3RvciA9IHRoaXMucmVzb2x2ZUNvbXBvbmVudChub2RlLCB1bmRlZmluZWQsIHRydWUpKVxuICAgICkge1xuICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKGRpcm5hbWUsICcnLCBub2RlKVxuICAgICAgICBkaXJlY3RpdmUuQ3RvciA9IEN0b3JcbiAgICB9IGVsc2Uge1xuICAgICAgICBleHByZXNzaW9uID0gdXRpbHMuYXR0cihub2RlLCBkaXJuYW1lKVxuICAgICAgICBkaXJlY3RpdmUgPSBleHByZXNzaW9uICYmIHRoaXMucGFyc2VEaXJlY3RpdmUoZGlybmFtZSwgZXhwcmVzc2lvbiwgbm9kZSlcbiAgICB9XG4gICAgaWYgKGRpcmVjdGl2ZSkge1xuICAgICAgICBpZiAocm9vdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdXRpbHMud2FybihcbiAgICAgICAgICAgICAgICAnRGlyZWN0aXZlIHYtJyArIGRpcm5hbWUgKyAnIGNhbm5vdCBiZSB1c2VkIG9uIGFuIGFscmVhZHkgaW5zdGFudGlhdGVkICcgK1xuICAgICAgICAgICAgICAgICdWTVxcJ3Mgcm9vdCBub2RlLiBVc2UgaXQgZnJvbSB0aGUgcGFyZW50XFwncyB0ZW1wbGF0ZSBpbnN0ZWFkLidcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmZXJyZWQucHVzaChkaXJlY3RpdmUpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxufVxuXG4vKipcbiAqICBDb21waWxlIG5vcm1hbCBkaXJlY3RpdmVzIG9uIGEgbm9kZVxuICovXG5Db21waWxlclByb3RvLmNvbXBpbGVFbGVtZW50ID0gZnVuY3Rpb24gKG5vZGUsIHJvb3QpIHtcblxuICAgIC8vIHRleHRhcmVhIGlzIHByZXR0eSBhbm5veWluZ1xuICAgIC8vIGJlY2F1c2UgaXRzIHZhbHVlIGNyZWF0ZXMgY2hpbGROb2RlcyB3aGljaFxuICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gY29tcGlsZS5cbiAgICBpZiAobm9kZS50YWdOYW1lID09PSAnVEVYVEFSRUEnICYmIG5vZGUudmFsdWUpIHtcbiAgICAgICAgbm9kZS52YWx1ZSA9IHRoaXMuZXZhbChub2RlLnZhbHVlKVxuICAgIH1cblxuICAgIC8vIG9ubHkgY29tcGlsZSBpZiB0aGlzIGVsZW1lbnQgaGFzIGF0dHJpYnV0ZXNcbiAgICAvLyBvciBpdHMgdGFnTmFtZSBjb250YWlucyBhIGh5cGhlbiAod2hpY2ggbWVhbnMgaXQgY291bGRcbiAgICAvLyBwb3RlbnRpYWxseSBiZSBhIGN1c3RvbSBlbGVtZW50KVxuICAgIGlmIChub2RlLmhhc0F0dHJpYnV0ZXMoKSB8fCBub2RlLnRhZ05hbWUuaW5kZXhPZignLScpID4gLTEpIHtcblxuICAgICAgICAvLyBza2lwIGFueXRoaW5nIHdpdGggdi1wcmVcbiAgICAgICAgaWYgKHV0aWxzLmF0dHIobm9kZSwgJ3ByZScpICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpLCBsLCBqLCBrXG5cbiAgICAgICAgLy8gY2hlY2sgcHJpb3JpdHkgZGlyZWN0aXZlcy5cbiAgICAgICAgLy8gaWYgYW55IG9mIHRoZW0gYXJlIHByZXNlbnQsIGl0IHdpbGwgdGFrZSBvdmVyIHRoZSBub2RlIHdpdGggYSBjaGlsZFZNXG4gICAgICAgIC8vIHNvIHdlIGNhbiBza2lwIHRoZSByZXN0XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBwcmlvcml0eURpcmVjdGl2ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja1ByaW9yaXR5RGlyKHByaW9yaXR5RGlyZWN0aXZlc1tpXSwgbm9kZSwgcm9vdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHRyYW5zaXRpb24gJiBhbmltYXRpb24gcHJvcGVydGllc1xuICAgICAgICBub2RlLnZ1ZV90cmFucyAgPSB1dGlscy5hdHRyKG5vZGUsICd0cmFuc2l0aW9uJylcbiAgICAgICAgbm9kZS52dWVfYW5pbSAgID0gdXRpbHMuYXR0cihub2RlLCAnYW5pbWF0aW9uJylcbiAgICAgICAgbm9kZS52dWVfZWZmZWN0ID0gdGhpcy5ldmFsKHV0aWxzLmF0dHIobm9kZSwgJ2VmZmVjdCcpKVxuXG4gICAgICAgIHZhciBwcmVmaXggPSBjb25maWcucHJlZml4ICsgJy0nLFxuICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtQXR0cmlidXRlcyxcbiAgICAgICAgICAgIGF0dHIsIGF0dHJuYW1lLCBpc0RpcmVjdGl2ZSwgZXhwLCBkaXJlY3RpdmVzLCBkaXJlY3RpdmUsIGRpcm5hbWVcblxuICAgICAgICAvLyB2LXdpdGggaGFzIHNwZWNpYWwgcHJpb3JpdHkgYW1vbmcgdGhlIHJlc3RcbiAgICAgICAgLy8gaXQgbmVlZHMgdG8gcHVsbCBpbiB0aGUgdmFsdWUgZnJvbSB0aGUgcGFyZW50IGJlZm9yZVxuICAgICAgICAvLyBjb21wdXRlZCBwcm9wZXJ0aWVzIGFyZSBldmFsdWF0ZWQsIGJlY2F1c2UgYXQgdGhpcyBzdGFnZVxuICAgICAgICAvLyB0aGUgY29tcHV0ZWQgcHJvcGVydGllcyBoYXZlIG5vdCBzZXQgdXAgdGhlaXIgZGVwZW5kZW5jaWVzIHlldC5cbiAgICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgICAgIHZhciB3aXRoRXhwID0gdXRpbHMuYXR0cihub2RlLCAnd2l0aCcpXG4gICAgICAgICAgICBpZiAod2l0aEV4cCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCd3aXRoJywgd2l0aEV4cCwgbm9kZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBrID0gZGlyZWN0aXZlcy5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZXNbal0sIHRoaXMucGFyZW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhdHRycyA9IHNsaWNlLmNhbGwobm9kZS5hdHRyaWJ1dGVzKVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpXVxuICAgICAgICAgICAgYXR0cm5hbWUgPSBhdHRyLm5hbWVcbiAgICAgICAgICAgIGlzRGlyZWN0aXZlID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgKGF0dHJuYW1lLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGEgZGlyZWN0aXZlIC0gc3BsaXQsIHBhcnNlIGFuZCBiaW5kIGl0LlxuICAgICAgICAgICAgICAgIGlzRGlyZWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGRpcm5hbWUgPSBhdHRybmFtZS5zbGljZShwcmVmaXgubGVuZ3RoKVxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHdpdGggbXVsdGlwbGU6IHRydWVcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzID0gdGhpcy5wYXJzZURpcmVjdGl2ZShkaXJuYW1lLCBhdHRyLnZhbHVlLCBub2RlLCB0cnVlKVxuICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBjbGF1c2VzIChzZXBhcmF0ZWQgYnkgXCIsXCIpXG4gICAgICAgICAgICAgICAgLy8gaW5zaWRlIGVhY2ggYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMCwgayA9IGRpcmVjdGl2ZXMubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmVzW2pdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmludGVycG9sYXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gbm9uIGRpcmVjdGl2ZSBhdHRyaWJ1dGUsIGNoZWNrIGludGVycG9sYXRpb24gdGFnc1xuICAgICAgICAgICAgICAgIGV4cCA9IFRleHRQYXJzZXIucGFyc2VBdHRyKGF0dHIudmFsdWUpXG4gICAgICAgICAgICAgICAgaWYgKGV4cCkge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCdhdHRyJywgZXhwLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXJnID0gYXR0cm5hbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMuaW5kZXhPZihhdHRybmFtZSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBwYXJhbSBhdHRyaWJ1dGUuLi4gd2Ugc2hvdWxkIHVzZSB0aGUgcGFyZW50IGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGF2b2lkIGNpcmN1bGFyIHVwZGF0ZXMgbGlrZSBzaXplPXt7c2l6ZX19XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlLCB0aGlzLnBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0RpcmVjdGl2ZSAmJiBkaXJuYW1lICE9PSAnY2xvYWsnKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIHJlY3Vyc2l2ZWx5IGNvbXBpbGUgY2hpbGROb2Rlc1xuICAgIGlmIChub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBzbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcykuZm9yRWFjaCh0aGlzLmNvbXBpbGUsIHRoaXMpXG4gICAgfVxufVxuXG4vKipcbiAqICBDb21waWxlIGEgdGV4dCBub2RlXG4gKi9cbkNvbXBpbGVyUHJvdG8uY29tcGlsZVRleHROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcblxuICAgIHZhciB0b2tlbnMgPSBUZXh0UGFyc2VyLnBhcnNlKG5vZGUubm9kZVZhbHVlKVxuICAgIGlmICghdG9rZW5zKSByZXR1cm5cbiAgICB2YXIgZWwsIHRva2VuLCBkaXJlY3RpdmVcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICAgIGRpcmVjdGl2ZSA9IG51bGxcblxuICAgICAgICBpZiAodG9rZW4ua2V5KSB7IC8vIGEgYmluZGluZ1xuICAgICAgICAgICAgaWYgKHRva2VuLmtleS5jaGFyQXQoMCkgPT09ICc+JykgeyAvLyBhIHBhcnRpYWxcbiAgICAgICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3JlZicpXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlID0gdGhpcy5wYXJzZURpcmVjdGl2ZSgncGFydGlhbCcsIHRva2VuLmtleS5zbGljZSgxKSwgZWwpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4uaHRtbCkgeyAvLyB0ZXh0IGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlID0gdGhpcy5wYXJzZURpcmVjdGl2ZSgndGV4dCcsIHRva2VuLmtleSwgZWwpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gaHRtbCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChjb25maWcucHJlZml4ICsgJy1odG1sJylcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlID0gdGhpcy5wYXJzZURpcmVjdGl2ZSgnaHRtbCcsIHRva2VuLmtleSwgZWwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBhIHBsYWluIHN0cmluZ1xuICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluc2VydCBub2RlXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIG5vZGUpXG4gICAgICAgIC8vIGJpbmQgZGlyZWN0aXZlXG4gICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmUpXG5cbiAgICB9XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpXG59XG5cbi8qKlxuICogIFBhcnNlIGEgZGlyZWN0aXZlIG5hbWUvdmFsdWUgcGFpciBpbnRvIG9uZSBvciBtb3JlXG4gKiAgZGlyZWN0aXZlIGluc3RhbmNlc1xuICovXG5Db21waWxlclByb3RvLnBhcnNlRGlyZWN0aXZlID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCBlbCwgbXVsdGlwbGUpIHtcbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBkZWZpbml0aW9uID0gY29tcGlsZXIuZ2V0T3B0aW9uKCdkaXJlY3RpdmVzJywgbmFtZSlcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICAvLyBwYXJzZSBpbnRvIEFTVC1saWtlIG9iamVjdHNcbiAgICAgICAgdmFyIGFzdHMgPSBEaXJlY3RpdmUucGFyc2UodmFsdWUpXG4gICAgICAgIHJldHVybiBtdWx0aXBsZVxuICAgICAgICAgICAgPyBhc3RzLm1hcChidWlsZClcbiAgICAgICAgICAgIDogYnVpbGQoYXN0c1swXSlcbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGQgKGFzdCkge1xuICAgICAgICByZXR1cm4gbmV3IERpcmVjdGl2ZShuYW1lLCBhc3QsIGRlZmluaXRpb24sIGNvbXBpbGVyLCBlbClcbiAgICB9XG59XG5cbi8qKlxuICogIEFkZCBhIGRpcmVjdGl2ZSBpbnN0YW5jZSB0byB0aGUgY29ycmVjdCBiaW5kaW5nICYgdmlld21vZGVsXG4gKi9cbkNvbXBpbGVyUHJvdG8uYmluZERpcmVjdGl2ZSA9IGZ1bmN0aW9uIChkaXJlY3RpdmUsIGJpbmRpbmdPd25lcikge1xuXG4gICAgaWYgKCFkaXJlY3RpdmUpIHJldHVyblxuXG4gICAgLy8ga2VlcCB0cmFjayBvZiBpdCBzbyB3ZSBjYW4gdW5iaW5kKCkgbGF0ZXJcbiAgICB0aGlzLmRpcnMucHVzaChkaXJlY3RpdmUpXG5cbiAgICAvLyBmb3IgZW1wdHkgb3IgbGl0ZXJhbCBkaXJlY3RpdmVzLCBzaW1wbHkgY2FsbCBpdHMgYmluZCgpXG4gICAgLy8gYW5kIHdlJ3JlIGRvbmUuXG4gICAgaWYgKGRpcmVjdGl2ZS5pc0VtcHR5IHx8IGRpcmVjdGl2ZS5pc0xpdGVyYWwpIHtcbiAgICAgICAgaWYgKGRpcmVjdGl2ZS5iaW5kKSBkaXJlY3RpdmUuYmluZCgpXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIG90aGVyd2lzZSwgd2UgZ290IG1vcmUgd29yayB0byBkby4uLlxuICAgIHZhciBiaW5kaW5nLFxuICAgICAgICBjb21waWxlciA9IGJpbmRpbmdPd25lciB8fCB0aGlzLFxuICAgICAgICBrZXkgICAgICA9IGRpcmVjdGl2ZS5rZXlcblxuICAgIGlmIChkaXJlY3RpdmUuaXNFeHApIHtcbiAgICAgICAgLy8gZXhwcmVzc2lvbiBiaW5kaW5ncyBhcmUgYWx3YXlzIGNyZWF0ZWQgb24gY3VycmVudCBjb21waWxlclxuICAgICAgICBiaW5kaW5nID0gY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXksIGRpcmVjdGl2ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZWN1cnNpdmVseSBsb2NhdGUgd2hpY2ggY29tcGlsZXIgb3ducyB0aGUgYmluZGluZ1xuICAgICAgICB3aGlsZSAoY29tcGlsZXIpIHtcbiAgICAgICAgICAgIGlmIChjb21waWxlci5oYXNLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBpbGVyID0gY29tcGlsZXIucGFyZW50XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsZXIgPSBjb21waWxlciB8fCB0aGlzXG4gICAgICAgIGJpbmRpbmcgPSBjb21waWxlci5iaW5kaW5nc1trZXldIHx8IGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5KVxuICAgIH1cbiAgICBiaW5kaW5nLmRpcnMucHVzaChkaXJlY3RpdmUpXG4gICAgZGlyZWN0aXZlLmJpbmRpbmcgPSBiaW5kaW5nXG5cbiAgICB2YXIgdmFsdWUgPSBiaW5kaW5nLnZhbCgpXG4gICAgLy8gaW52b2tlIGJpbmQgaG9vayBpZiBleGlzdHNcbiAgICBpZiAoZGlyZWN0aXZlLmJpbmQpIHtcbiAgICAgICAgZGlyZWN0aXZlLmJpbmQodmFsdWUpXG4gICAgfVxuICAgIC8vIHNldCBpbml0aWFsIHZhbHVlXG4gICAgZGlyZWN0aXZlLiR1cGRhdGUodmFsdWUsIHRydWUpXG59XG5cbi8qKlxuICogIENyZWF0ZSBiaW5kaW5nIGFuZCBhdHRhY2ggZ2V0dGVyL3NldHRlciBmb3IgYSBrZXkgdG8gdGhlIHZpZXdtb2RlbCBvYmplY3RcbiAqL1xuQ29tcGlsZXJQcm90by5jcmVhdGVCaW5kaW5nID0gZnVuY3Rpb24gKGtleSwgZGlyZWN0aXZlKSB7XG5cbiAgICB1dGlscy5sb2coJyAgY3JlYXRlZCBiaW5kaW5nOiAnICsga2V5KVxuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgbWV0aG9kcyAgPSBjb21waWxlci5vcHRpb25zLm1ldGhvZHMsXG4gICAgICAgIGlzRXhwICAgID0gZGlyZWN0aXZlICYmIGRpcmVjdGl2ZS5pc0V4cCxcbiAgICAgICAgaXNGbiAgICAgPSAoZGlyZWN0aXZlICYmIGRpcmVjdGl2ZS5pc0ZuKSB8fCAobWV0aG9kcyAmJiBtZXRob2RzW2tleV0pLFxuICAgICAgICBiaW5kaW5ncyA9IGNvbXBpbGVyLmJpbmRpbmdzLFxuICAgICAgICBjb21wdXRlZCA9IGNvbXBpbGVyLm9wdGlvbnMuY29tcHV0ZWQsXG4gICAgICAgIGJpbmRpbmcgID0gbmV3IEJpbmRpbmcoY29tcGlsZXIsIGtleSwgaXNFeHAsIGlzRm4pXG5cbiAgICBpZiAoaXNFeHApIHtcbiAgICAgICAgLy8gZXhwcmVzc2lvbiBiaW5kaW5ncyBhcmUgYW5vbnltb3VzXG4gICAgICAgIGNvbXBpbGVyLmRlZmluZUV4cChrZXksIGJpbmRpbmcsIGRpcmVjdGl2ZSlcbiAgICB9IGVsc2UgaWYgKGlzRm4pIHtcbiAgICAgICAgYmluZGluZ3Nba2V5XSA9IGJpbmRpbmdcbiAgICAgICAgY29tcGlsZXIuZGVmaW5lVm1Qcm9wKGtleSwgYmluZGluZywgbWV0aG9kc1trZXldKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbmRpbmdzW2tleV0gPSBiaW5kaW5nXG4gICAgICAgIGlmIChiaW5kaW5nLnJvb3QpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgYSByb290IGxldmVsIGJpbmRpbmcuIHdlIG5lZWQgdG8gZGVmaW5lIGdldHRlci9zZXR0ZXJzIGZvciBpdC5cbiAgICAgICAgICAgIGlmIChjb21wdXRlZCAmJiBjb21wdXRlZFtrZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZWQgcHJvcGVydHlcbiAgICAgICAgICAgICAgICBjb21waWxlci5kZWZpbmVDb21wdXRlZChrZXksIGJpbmRpbmcsIGNvbXB1dGVkW2tleV0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleS5jaGFyQXQoMCkgIT09ICckJykge1xuICAgICAgICAgICAgICAgIC8vIG5vcm1hbCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlZmluZURhdGFQcm9wKGtleSwgYmluZGluZylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcHJvcGVydGllcyB0aGF0IHN0YXJ0IHdpdGggJCBhcmUgbWV0YSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgLy8gdGhleSBzaG91bGQgYmUga2VwdCBvbiB0aGUgdm0gYnV0IG5vdCBpbiB0aGUgZGF0YSBvYmplY3QuXG4gICAgICAgICAgICAgICAgY29tcGlsZXIuZGVmaW5lVm1Qcm9wKGtleSwgYmluZGluZywgY29tcGlsZXIuZGF0YVtrZXldKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb21waWxlci5kYXRhW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb21wdXRlZCAmJiBjb21wdXRlZFt1dGlscy5iYXNlS2V5KGtleSldKSB7XG4gICAgICAgICAgICAvLyBuZXN0ZWQgcGF0aCBvbiBjb21wdXRlZCBwcm9wZXJ0eVxuICAgICAgICAgICAgY29tcGlsZXIuZGVmaW5lRXhwKGtleSwgYmluZGluZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZSBwYXRoIGluIGRhdGEgc28gdGhhdCBjb21wdXRlZCBwcm9wZXJ0aWVzIHRoYXRcbiAgICAgICAgICAgIC8vIGFjY2VzcyB0aGUgcGF0aCBkb24ndCB0aHJvdyBhbiBlcnJvciBhbmQgY2FuIGNvbGxlY3RcbiAgICAgICAgICAgIC8vIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgT2JzZXJ2ZXIuZW5zdXJlUGF0aChjb21waWxlci5kYXRhLCBrZXkpXG4gICAgICAgICAgICB2YXIgcGFyZW50S2V5ID0ga2V5LnNsaWNlKDAsIGtleS5sYXN0SW5kZXhPZignLicpKVxuICAgICAgICAgICAgaWYgKCFiaW5kaW5nc1twYXJlbnRLZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhIG5lc3RlZCB2YWx1ZSBiaW5kaW5nLCBidXQgdGhlIGJpbmRpbmcgZm9yIGl0cyBwYXJlbnRcbiAgICAgICAgICAgICAgICAvLyBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXQuIFdlIGJldHRlciBjcmVhdGUgdGhhdCBvbmUgdG9vLlxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcocGFyZW50S2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiaW5kaW5nXG59XG5cbi8qKlxuICogIERlZmluZSB0aGUgZ2V0dGVyL3NldHRlciB0byBwcm94eSBhIHJvb3QtbGV2ZWxcbiAqICBkYXRhIHByb3BlcnR5IG9uIHRoZSBWTVxuICovXG5Db21waWxlclByb3RvLmRlZmluZURhdGFQcm9wID0gZnVuY3Rpb24gKGtleSwgYmluZGluZykge1xuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGRhdGEgICAgID0gY29tcGlsZXIuZGF0YSxcbiAgICAgICAgb2IgICAgICAgPSBkYXRhLl9fZW1pdHRlcl9fXG5cbiAgICAvLyBtYWtlIHN1cmUgdGhlIGtleSBpcyBwcmVzZW50IGluIGRhdGFcbiAgICAvLyBzbyBpdCBjYW4gYmUgb2JzZXJ2ZWRcbiAgICBpZiAoIShoYXNPd24uY2FsbChkYXRhLCBrZXkpKSkge1xuICAgICAgICBkYXRhW2tleV0gPSB1bmRlZmluZWRcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgZGF0YSBvYmplY3QgaXMgYWxyZWFkeSBvYnNlcnZlZCwgYnV0IHRoZSBrZXlcbiAgICAvLyBpcyBub3Qgb2JzZXJ2ZWQsIHdlIG5lZWQgdG8gYWRkIGl0IHRvIHRoZSBvYnNlcnZlZCBrZXlzLlxuICAgIGlmIChvYiAmJiAhKGhhc093bi5jYWxsKG9iLnZhbHVlcywga2V5KSkpIHtcbiAgICAgICAgT2JzZXJ2ZXIuY29udmVydEtleShkYXRhLCBrZXkpXG4gICAgfVxuXG4gICAgYmluZGluZy52YWx1ZSA9IGRhdGFba2V5XVxuXG4gICAgZGVmKGNvbXBpbGVyLnZtLCBrZXksIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcGlsZXIuZGF0YVtrZXldXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgY29tcGlsZXIuZGF0YVtrZXldID0gdmFsXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqICBEZWZpbmUgYSB2bSBwcm9wZXJ0eSwgZS5nLiAkaW5kZXgsICRrZXksIG9yIG1peGluIG1ldGhvZHNcbiAqICB3aGljaCBhcmUgYmluZGFibGUgYnV0IG9ubHkgYWNjZXNzaWJsZSBvbiB0aGUgVk0sXG4gKiAgbm90IGluIHRoZSBkYXRhLlxuICovXG5Db21waWxlclByb3RvLmRlZmluZVZtUHJvcCA9IGZ1bmN0aW9uIChrZXksIGJpbmRpbmcsIHZhbHVlKSB7XG4gICAgdmFyIG9iID0gdGhpcy5vYnNlcnZlclxuICAgIGJpbmRpbmcudmFsdWUgPSB2YWx1ZVxuICAgIGRlZih0aGlzLnZtLCBrZXksIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoT2JzZXJ2ZXIuc2hvdWxkR2V0KSBvYi5lbWl0KCdnZXQnLCBrZXkpXG4gICAgICAgICAgICByZXR1cm4gYmluZGluZy52YWx1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIG9iLmVtaXQoJ3NldCcsIGtleSwgdmFsKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuLyoqXG4gKiAgRGVmaW5lIGFuIGV4cHJlc3Npb24gYmluZGluZywgd2hpY2ggaXMgZXNzZW50aWFsbHlcbiAqICBhbiBhbm9ueW1vdXMgY29tcHV0ZWQgcHJvcGVydHlcbiAqL1xuQ29tcGlsZXJQcm90by5kZWZpbmVFeHAgPSBmdW5jdGlvbiAoa2V5LCBiaW5kaW5nLCBkaXJlY3RpdmUpIHtcbiAgICB2YXIgY29tcHV0ZWRLZXkgPSBkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLmNvbXB1dGVkS2V5LFxuICAgICAgICBleHAgICAgICAgICA9IGNvbXB1dGVkS2V5ID8gZGlyZWN0aXZlLmV4cHJlc3Npb24gOiBrZXksXG4gICAgICAgIGdldHRlciAgICAgID0gdGhpcy5leHBDYWNoZVtleHBdXG4gICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgZ2V0dGVyID0gdGhpcy5leHBDYWNoZVtleHBdID0gRXhwUGFyc2VyLnBhcnNlKGNvbXB1dGVkS2V5IHx8IGtleSwgdGhpcylcbiAgICB9XG4gICAgaWYgKGdldHRlcikge1xuICAgICAgICB0aGlzLm1hcmtDb21wdXRlZChiaW5kaW5nLCBnZXR0ZXIpXG4gICAgfVxufVxuXG4vKipcbiAqICBEZWZpbmUgYSBjb21wdXRlZCBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqL1xuQ29tcGlsZXJQcm90by5kZWZpbmVDb21wdXRlZCA9IGZ1bmN0aW9uIChrZXksIGJpbmRpbmcsIHZhbHVlKSB7XG4gICAgdGhpcy5tYXJrQ29tcHV0ZWQoYmluZGluZywgdmFsdWUpXG4gICAgZGVmKHRoaXMudm0sIGtleSwge1xuICAgICAgICBnZXQ6IGJpbmRpbmcudmFsdWUuJGdldCxcbiAgICAgICAgc2V0OiBiaW5kaW5nLnZhbHVlLiRzZXRcbiAgICB9KVxufVxuXG4vKipcbiAqICBQcm9jZXNzIGEgY29tcHV0ZWQgcHJvcGVydHkgYmluZGluZ1xuICogIHNvIGl0cyBnZXR0ZXIvc2V0dGVyIGFyZSBib3VuZCB0byBwcm9wZXIgY29udGV4dFxuICovXG5Db21waWxlclByb3RvLm1hcmtDb21wdXRlZCA9IGZ1bmN0aW9uIChiaW5kaW5nLCB2YWx1ZSkge1xuICAgIGJpbmRpbmcuaXNDb21wdXRlZCA9IHRydWVcbiAgICAvLyBiaW5kIHRoZSBhY2Nlc3NvcnMgdG8gdGhlIHZtXG4gICAgaWYgKGJpbmRpbmcuaXNGbikge1xuICAgICAgICBiaW5kaW5nLnZhbHVlID0gdmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHsgJGdldDogdmFsdWUgfVxuICAgICAgICB9XG4gICAgICAgIGJpbmRpbmcudmFsdWUgPSB7XG4gICAgICAgICAgICAkZ2V0OiB1dGlscy5iaW5kKHZhbHVlLiRnZXQsIHRoaXMudm0pLFxuICAgICAgICAgICAgJHNldDogdmFsdWUuJHNldFxuICAgICAgICAgICAgICAgID8gdXRpbHMuYmluZCh2YWx1ZS4kc2V0LCB0aGlzLnZtKVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8ga2VlcCB0cmFjayBmb3IgZGVwIHBhcnNpbmcgbGF0ZXJcbiAgICB0aGlzLmNvbXB1dGVkLnB1c2goYmluZGluZylcbn1cblxuLyoqXG4gKiAgUmV0cml2ZSBhbiBvcHRpb24gZnJvbSB0aGUgY29tcGlsZXJcbiAqL1xuQ29tcGlsZXJQcm90by5nZXRPcHRpb24gPSBmdW5jdGlvbiAodHlwZSwgaWQsIHNpbGVudCkge1xuICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBwYXJlbnQgPSB0aGlzLnBhcmVudCxcbiAgICAgICAgZ2xvYmFsQXNzZXRzID0gY29uZmlnLmdsb2JhbEFzc2V0cyxcbiAgICAgICAgcmVzID0gKG9wdHNbdHlwZV0gJiYgb3B0c1t0eXBlXVtpZF0pIHx8IChcbiAgICAgICAgICAgIHBhcmVudFxuICAgICAgICAgICAgICAgID8gcGFyZW50LmdldE9wdGlvbih0eXBlLCBpZCwgc2lsZW50KVxuICAgICAgICAgICAgICAgIDogZ2xvYmFsQXNzZXRzW3R5cGVdICYmIGdsb2JhbEFzc2V0c1t0eXBlXVtpZF1cbiAgICAgICAgKVxuICAgIGlmICghcmVzICYmICFzaWxlbnQgJiYgdHlwZW9mIGlkID09PSAnc3RyaW5nJykge1xuICAgICAgICB1dGlscy53YXJuKCdVbmtub3duICcgKyB0eXBlLnNsaWNlKDAsIC0xKSArICc6ICcgKyBpZClcbiAgICB9XG4gICAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqICBFbWl0IGxpZmVjeWNsZSBldmVudHMgdG8gdHJpZ2dlciBob29rc1xuICovXG5Db21waWxlclByb3RvLmV4ZWNIb29rID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQgPSAnaG9vazonICsgZXZlbnRcbiAgICB0aGlzLm9ic2VydmVyLmVtaXQoZXZlbnQpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoZXZlbnQpXG59XG5cbi8qKlxuICogIENoZWNrIGlmIGEgY29tcGlsZXIncyBkYXRhIGNvbnRhaW5zIGEga2V5cGF0aFxuICovXG5Db21waWxlclByb3RvLmhhc0tleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgYmFzZUtleSA9IHV0aWxzLmJhc2VLZXkoa2V5KVxuICAgIHJldHVybiBoYXNPd24uY2FsbCh0aGlzLmRhdGEsIGJhc2VLZXkpIHx8XG4gICAgICAgIGhhc093bi5jYWxsKHRoaXMudm0sIGJhc2VLZXkpXG59XG5cbi8qKlxuICogIERvIGEgb25lLXRpbWUgZXZhbCBvZiBhIHN0cmluZyB0aGF0IHBvdGVudGlhbGx5XG4gKiAgaW5jbHVkZXMgYmluZGluZ3MuIEl0IGFjY2VwdHMgYWRkaXRpb25hbCByYXcgZGF0YVxuICogIGJlY2F1c2Ugd2UgbmVlZCB0byBkeW5hbWljYWxseSByZXNvbHZlIHYtY29tcG9uZW50XG4gKiAgYmVmb3JlIGEgY2hpbGRWTSBpcyBldmVuIGNvbXBpbGVkLi4uXG4gKi9cbkNvbXBpbGVyUHJvdG8uZXZhbCA9IGZ1bmN0aW9uIChleHAsIGRhdGEpIHtcbiAgICB2YXIgcGFyc2VkID0gVGV4dFBhcnNlci5wYXJzZUF0dHIoZXhwKVxuICAgIHJldHVybiBwYXJzZWRcbiAgICAgICAgPyBFeHBQYXJzZXIuZXZhbChwYXJzZWQsIHRoaXMsIGRhdGEpXG4gICAgICAgIDogZXhwXG59XG5cbi8qKlxuICogIFJlc29sdmUgYSBDb21wb25lbnQgY29uc3RydWN0b3IgZm9yIGFuIGVsZW1lbnRcbiAqICB3aXRoIHRoZSBkYXRhIHRvIGJlIHVzZWRcbiAqL1xuQ29tcGlsZXJQcm90by5yZXNvbHZlQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5vZGUsIGRhdGEsIHRlc3QpIHtcblxuICAgIC8vIGxhdGUgcmVxdWlyZSB0byBhdm9pZCBjaXJjdWxhciBkZXBzXG4gICAgVmlld01vZGVsID0gVmlld01vZGVsIHx8IHJlcXVpcmUoJy4vdmlld21vZGVsJylcblxuICAgIHZhciBleHAgICAgID0gdXRpbHMuYXR0cihub2RlLCAnY29tcG9uZW50JyksXG4gICAgICAgIHRhZ05hbWUgPSBub2RlLnRhZ05hbWUsXG4gICAgICAgIGlkICAgICAgPSB0aGlzLmV2YWwoZXhwLCBkYXRhKSxcbiAgICAgICAgdGFnSWQgICA9ICh0YWdOYW1lLmluZGV4T2YoJy0nKSA+IDAgJiYgdGFnTmFtZS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgQ3RvciAgICA9IHRoaXMuZ2V0T3B0aW9uKCdjb21wb25lbnRzJywgaWQgfHwgdGFnSWQsIHRydWUpXG5cbiAgICBpZiAoaWQgJiYgIUN0b3IpIHtcbiAgICAgICAgdXRpbHMud2FybignVW5rbm93biBjb21wb25lbnQ6ICcgKyBpZClcbiAgICB9XG5cbiAgICByZXR1cm4gdGVzdFxuICAgICAgICA/IGV4cCA9PT0gJydcbiAgICAgICAgICAgID8gVmlld01vZGVsXG4gICAgICAgICAgICA6IEN0b3JcbiAgICAgICAgOiBDdG9yIHx8IFZpZXdNb2RlbFxufVxuXG4vKipcbiAqICBVbmJpbmQgYW5kIHJlbW92ZSBlbGVtZW50XG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uIChub1JlbW92ZSkge1xuXG4gICAgLy8gYXZvaWQgYmVpbmcgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXG4gICAgLy8gdGhpcyBpcyBpcnJldmVyc2libGUhXG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm5cblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGksIGosIGtleSwgZGlyLCBkaXJzLCBiaW5kaW5nLFxuICAgICAgICB2bSAgICAgICAgICA9IGNvbXBpbGVyLnZtLFxuICAgICAgICBlbCAgICAgICAgICA9IGNvbXBpbGVyLmVsLFxuICAgICAgICBkaXJlY3RpdmVzICA9IGNvbXBpbGVyLmRpcnMsXG4gICAgICAgIGNvbXB1dGVkICAgID0gY29tcGlsZXIuY29tcHV0ZWQsXG4gICAgICAgIGJpbmRpbmdzICAgID0gY29tcGlsZXIuYmluZGluZ3MsXG4gICAgICAgIGNoaWxkcmVuICAgID0gY29tcGlsZXIuY2hpbGRyZW4sXG4gICAgICAgIHBhcmVudCAgICAgID0gY29tcGlsZXIucGFyZW50XG5cbiAgICBjb21waWxlci5leGVjSG9vaygnYmVmb3JlRGVzdHJveScpXG5cbiAgICAvLyB1bm9ic2VydmUgZGF0YVxuICAgIE9ic2VydmVyLnVub2JzZXJ2ZShjb21waWxlci5kYXRhLCAnJywgY29tcGlsZXIub2JzZXJ2ZXIpXG5cbiAgICAvLyBkZXN0cm95IGFsbCBjaGlsZHJlblxuICAgIC8vIGRvIG5vdCByZW1vdmUgdGhlaXIgZWxlbWVudHMgc2luY2UgdGhlIHBhcmVudFxuICAgIC8vIG1heSBoYXZlIHRyYW5zaXRpb25zIGFuZCB0aGUgY2hpbGRyZW4gbWF5IG5vdFxuICAgIGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNoaWxkcmVuW2ldLmRlc3Ryb3kodHJ1ZSlcbiAgICB9XG5cbiAgICAvLyB1bmJpbmQgYWxsIGRpcmVjaXR2ZXNcbiAgICBpID0gZGlyZWN0aXZlcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGRpciA9IGRpcmVjdGl2ZXNbaV1cbiAgICAgICAgLy8gaWYgdGhpcyBkaXJlY3RpdmUgaXMgYW4gaW5zdGFuY2Ugb2YgYW4gZXh0ZXJuYWwgYmluZGluZ1xuICAgICAgICAvLyBlLmcuIGEgZGlyZWN0aXZlIHRoYXQgcmVmZXJzIHRvIGEgdmFyaWFibGUgb24gdGhlIHBhcmVudCBWTVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHJlbW92ZSBpdCBmcm9tIHRoYXQgYmluZGluZydzIGRpcmVjdGl2ZXNcbiAgICAgICAgLy8gKiBlbXB0eSBhbmQgbGl0ZXJhbCBiaW5kaW5ncyBkbyBub3QgaGF2ZSBiaW5kaW5nLlxuICAgICAgICBpZiAoZGlyLmJpbmRpbmcgJiYgZGlyLmJpbmRpbmcuY29tcGlsZXIgIT09IGNvbXBpbGVyKSB7XG4gICAgICAgICAgICBkaXJzID0gZGlyLmJpbmRpbmcuZGlyc1xuICAgICAgICAgICAgaWYgKGRpcnMpIHtcbiAgICAgICAgICAgICAgICBqID0gZGlycy5pbmRleE9mKGRpcilcbiAgICAgICAgICAgICAgICBpZiAoaiA+IC0xKSBkaXJzLnNwbGljZShqLCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpci4kdW5iaW5kKClcbiAgICB9XG5cbiAgICAvLyB1bmJpbmQgYWxsIGNvbXB1dGVkLCBhbm9ueW1vdXMgYmluZGluZ3NcbiAgICBpID0gY29tcHV0ZWQubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb21wdXRlZFtpXS51bmJpbmQoKVxuICAgIH1cblxuICAgIC8vIHVuYmluZCBhbGwga2V5cGF0aCBiaW5kaW5nc1xuICAgIGZvciAoa2V5IGluIGJpbmRpbmdzKSB7XG4gICAgICAgIGJpbmRpbmcgPSBiaW5kaW5nc1trZXldXG4gICAgICAgIGlmIChiaW5kaW5nKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnVuYmluZCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudFxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaiA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGNvbXBpbGVyKVxuICAgICAgICBpZiAoaiA+IC0xKSBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGosIDEpXG4gICAgfVxuXG4gICAgLy8gZmluYWxseSByZW1vdmUgZG9tIGVsZW1lbnRcbiAgICBpZiAoIW5vUmVtb3ZlKSB7XG4gICAgICAgIGlmIChlbCA9PT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gJydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLiRyZW1vdmUoKVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsLnZ1ZV92bSA9IG51bGxcblxuICAgIGNvbXBpbGVyLmRlc3Ryb3llZCA9IHRydWVcbiAgICAvLyBlbWl0IGRlc3Ryb3kgaG9va1xuICAgIGNvbXBpbGVyLmV4ZWNIb29rKCdhZnRlckRlc3Ryb3knKVxuXG4gICAgLy8gZmluYWxseSwgdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzXG4gICAgY29tcGlsZXIub2JzZXJ2ZXIub2ZmKClcbiAgICBjb21waWxlci5lbWl0dGVyLm9mZigpXG59XG5cbi8vIEhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgc2hvcnRoYW5kIGZvciBnZXR0aW5nIHJvb3QgY29tcGlsZXJcbiAqL1xuZnVuY3Rpb24gZ2V0Um9vdCAoY29tcGlsZXIpIHtcbiAgICB3aGlsZSAoY29tcGlsZXIucGFyZW50KSB7XG4gICAgICAgIGNvbXBpbGVyID0gY29tcGlsZXIucGFyZW50XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlclxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBpbGVyIiwidmFyIFRleHRQYXJzZXIgPSByZXF1aXJlKCcuL3RleHQtcGFyc2VyJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJlZml4ICAgICAgICAgOiAndicsXG4gICAgZGVidWcgICAgICAgICAgOiBmYWxzZSxcbiAgICBzaWxlbnQgICAgICAgICA6IGZhbHNlLFxuICAgIGVudGVyQ2xhc3MgICAgIDogJ3YtZW50ZXInLFxuICAgIGxlYXZlQ2xhc3MgICAgIDogJ3YtbGVhdmUnLFxuICAgIGludGVycG9sYXRlICAgIDogdHJ1ZVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLmV4cG9ydHMsICdkZWxpbWl0ZXJzJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gVGV4dFBhcnNlci5kZWxpbWl0ZXJzXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIChkZWxpbWl0ZXJzKSB7XG4gICAgICAgIFRleHRQYXJzZXIuc2V0RGVsaW1pdGVycyhkZWxpbWl0ZXJzKVxuICAgIH1cbn0pIiwidmFyIEVtaXR0ZXIgID0gcmVxdWlyZSgnLi9lbWl0dGVyJyksXG4gICAgdXRpbHMgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuL29ic2VydmVyJyksXG4gICAgY2F0Y2hlciAgPSBuZXcgRW1pdHRlcigpXG5cbi8qKlxuICogIEF1dG8tZXh0cmFjdCB0aGUgZGVwZW5kZW5jaWVzIG9mIGEgY29tcHV0ZWQgcHJvcGVydHlcbiAqICBieSByZWNvcmRpbmcgdGhlIGdldHRlcnMgdHJpZ2dlcmVkIHdoZW4gZXZhbHVhdGluZyBpdC5cbiAqL1xuZnVuY3Rpb24gY2F0Y2hEZXBzIChiaW5kaW5nKSB7XG4gICAgaWYgKGJpbmRpbmcuaXNGbikgcmV0dXJuXG4gICAgdXRpbHMubG9nKCdcXG4tICcgKyBiaW5kaW5nLmtleSlcbiAgICB2YXIgZ290ID0gdXRpbHMuaGFzaCgpXG4gICAgYmluZGluZy5kZXBzID0gW11cbiAgICBjYXRjaGVyLm9uKCdnZXQnLCBmdW5jdGlvbiAoZGVwKSB7XG4gICAgICAgIHZhciBoYXMgPSBnb3RbZGVwLmtleV1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gYXZvaWQgZHVwbGljYXRlIGJpbmRpbmdzXG4gICAgICAgICAgICAoaGFzICYmIGhhcy5jb21waWxlciA9PT0gZGVwLmNvbXBpbGVyKSB8fFxuICAgICAgICAgICAgLy8gYXZvaWQgcmVwZWF0ZWQgaXRlbXMgYXMgZGVwZW5kZW5jeVxuICAgICAgICAgICAgLy8gb25seSB3aGVuIHRoZSBiaW5kaW5nIGlzIGZyb20gc2VsZiBvciB0aGUgcGFyZW50IGNoYWluXG4gICAgICAgICAgICAoZGVwLmNvbXBpbGVyLnJlcGVhdCAmJiAhaXNQYXJlbnRPZihkZXAuY29tcGlsZXIsIGJpbmRpbmcuY29tcGlsZXIpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGdvdFtkZXAua2V5XSA9IGRlcFxuICAgICAgICB1dGlscy5sb2coJyAgLSAnICsgZGVwLmtleSlcbiAgICAgICAgYmluZGluZy5kZXBzLnB1c2goZGVwKVxuICAgICAgICBkZXAuc3Vicy5wdXNoKGJpbmRpbmcpXG4gICAgfSlcbiAgICBiaW5kaW5nLnZhbHVlLiRnZXQoKVxuICAgIGNhdGNoZXIub2ZmKCdnZXQnKVxufVxuXG4vKipcbiAqICBUZXN0IGlmIEEgaXMgYSBwYXJlbnQgb2Ygb3IgZXF1YWxzIEJcbiAqL1xuZnVuY3Rpb24gaXNQYXJlbnRPZiAoYSwgYikge1xuICAgIHdoaWxlIChiKSB7XG4gICAgICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIGIgPSBiLnBhcmVudFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAvKipcbiAgICAgKiAgdGhlIG9ic2VydmVyIHRoYXQgY2F0Y2hlcyBldmVudHMgdHJpZ2dlcmVkIGJ5IGdldHRlcnNcbiAgICAgKi9cbiAgICBjYXRjaGVyOiBjYXRjaGVyLFxuXG4gICAgLyoqXG4gICAgICogIHBhcnNlIGEgbGlzdCBvZiBjb21wdXRlZCBwcm9wZXJ0eSBiaW5kaW5nc1xuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiAoYmluZGluZ3MpIHtcbiAgICAgICAgdXRpbHMubG9nKCdcXG5wYXJzaW5nIGRlcGVuZGVuY2llcy4uLicpXG4gICAgICAgIE9ic2VydmVyLnNob3VsZEdldCA9IHRydWVcbiAgICAgICAgYmluZGluZ3MuZm9yRWFjaChjYXRjaERlcHMpXG4gICAgICAgIE9ic2VydmVyLnNob3VsZEdldCA9IGZhbHNlXG4gICAgICAgIHV0aWxzLmxvZygnXFxuZG9uZS4nKVxuICAgIH1cbiAgICBcbn0iLCJ2YXIgZGlySWQgICAgICAgICAgID0gMSxcbiAgICBBUkdfUkUgICAgICAgICAgPSAvXltcXHdcXCQtXSskLyxcbiAgICBGSUxURVJfVE9LRU5fUkUgPSAvW15cXHMnXCJdK3wnW14nXSsnfFwiW15cIl0rXCIvZyxcbiAgICBORVNUSU5HX1JFICAgICAgPSAvXlxcJChwYXJlbnR8cm9vdClcXC4vLFxuICAgIFNJTkdMRV9WQVJfUkUgICA9IC9eW1xcd1xcLiRdKyQvLFxuICAgIFFVT1RFX1JFICAgICAgICA9IC9cIi9nLFxuICAgIFRleHRQYXJzZXIgICAgICA9IHJlcXVpcmUoJy4vdGV4dC1wYXJzZXInKVxuXG4vKipcbiAqICBEaXJlY3RpdmUgY2xhc3NcbiAqICByZXByZXNlbnRzIGEgc2luZ2xlIGRpcmVjdGl2ZSBpbnN0YW5jZSBpbiB0aGUgRE9NXG4gKi9cbmZ1bmN0aW9uIERpcmVjdGl2ZSAobmFtZSwgYXN0LCBkZWZpbml0aW9uLCBjb21waWxlciwgZWwpIHtcblxuICAgIHRoaXMuaWQgICAgICAgICAgICAgPSBkaXJJZCsrXG4gICAgdGhpcy5uYW1lICAgICAgICAgICA9IG5hbWVcbiAgICB0aGlzLmNvbXBpbGVyICAgICAgID0gY29tcGlsZXJcbiAgICB0aGlzLnZtICAgICAgICAgICAgID0gY29tcGlsZXIudm1cbiAgICB0aGlzLmVsICAgICAgICAgICAgID0gZWxcbiAgICB0aGlzLmNvbXB1dGVGaWx0ZXJzID0gZmFsc2VcbiAgICB0aGlzLmtleSAgICAgICAgICAgID0gYXN0LmtleVxuICAgIHRoaXMuYXJnICAgICAgICAgICAgPSBhc3QuYXJnXG4gICAgdGhpcy5leHByZXNzaW9uICAgICA9IGFzdC5leHByZXNzaW9uXG5cbiAgICB2YXIgaXNFbXB0eSA9IHRoaXMuZXhwcmVzc2lvbiA9PT0gJydcblxuICAgIC8vIG1peCBpbiBwcm9wZXJ0aWVzIGZyb20gdGhlIGRpcmVjdGl2ZSBkZWZpbml0aW9uXG4gICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbaXNFbXB0eSA/ICdiaW5kJyA6ICd1cGRhdGUnXSA9IGRlZmluaXRpb25cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGRlZmluaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXNbcHJvcF0gPSBkZWZpbml0aW9uW3Byb3BdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbXB0eSBleHByZXNzaW9uLCB3ZSdyZSBkb25lLlxuICAgIGlmIChpc0VtcHR5IHx8IHRoaXMuaXNFbXB0eSkge1xuICAgICAgICB0aGlzLmlzRW1wdHkgPSB0cnVlXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChUZXh0UGFyc2VyLlJlZ2V4LnRlc3QodGhpcy5rZXkpKSB7XG4gICAgICAgIHRoaXMua2V5ID0gY29tcGlsZXIuZXZhbCh0aGlzLmtleSlcbiAgICAgICAgaWYgKHRoaXMuaXNMaXRlcmFsKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSB0aGlzLmtleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGZpbHRlcnMgPSBhc3QuZmlsdGVycyxcbiAgICAgICAgZmlsdGVyLCBmbiwgaSwgbCwgY29tcHV0ZWRcbiAgICBpZiAoZmlsdGVycykge1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBbXVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGZpbHRlciA9IGZpbHRlcnNbaV1cbiAgICAgICAgICAgIGZuID0gdGhpcy5jb21waWxlci5nZXRPcHRpb24oJ2ZpbHRlcnMnLCBmaWx0ZXIubmFtZSlcbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgIGZpbHRlci5hcHBseSA9IGZuXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnB1c2goZmlsdGVyKVxuICAgICAgICAgICAgICAgIGlmIChmbi5jb21wdXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wdXRlZCA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZmlsdGVycyB8fCAhdGhpcy5maWx0ZXJzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHRoaXMuY29tcHV0ZWRLZXkgPSBEaXJlY3RpdmUuaW5saW5lRmlsdGVycyh0aGlzLmtleSwgdGhpcy5maWx0ZXJzKVxuICAgICAgICB0aGlzLmZpbHRlcnMgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5pc0V4cCA9XG4gICAgICAgIGNvbXB1dGVkIHx8XG4gICAgICAgICFTSU5HTEVfVkFSX1JFLnRlc3QodGhpcy5rZXkpIHx8XG4gICAgICAgIE5FU1RJTkdfUkUudGVzdCh0aGlzLmtleSlcblxufVxuXG52YXIgRGlyUHJvdG8gPSBEaXJlY3RpdmUucHJvdG90eXBlXG5cbi8qKlxuICogIGNhbGxlZCB3aGVuIGEgbmV3IHZhbHVlIGlzIHNldCBcbiAqICBmb3IgY29tcHV0ZWQgcHJvcGVydGllcywgdGhpcyB3aWxsIG9ubHkgYmUgY2FsbGVkIG9uY2VcbiAqICBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gKi9cbkRpclByb3RvLiR1cGRhdGUgPSBmdW5jdGlvbiAodmFsdWUsIGluaXQpIHtcbiAgICBpZiAodGhpcy4kbG9jaykgcmV0dXJuXG4gICAgaWYgKGluaXQgfHwgdmFsdWUgIT09IHRoaXMudmFsdWUgfHwgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgICAgICBpZiAodGhpcy51cGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycyAmJiAhdGhpcy5jb21wdXRlRmlsdGVyc1xuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuJGFwcGx5RmlsdGVycyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBpbml0XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIHBpcGUgdGhlIHZhbHVlIHRocm91Z2ggZmlsdGVyc1xuICovXG5EaXJQcm90by4kYXBwbHlGaWx0ZXJzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGZpbHRlcmVkID0gdmFsdWUsIGZpbHRlclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBmaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaV1cbiAgICAgICAgZmlsdGVyZWQgPSBmaWx0ZXIuYXBwbHkuYXBwbHkodGhpcy52bSwgW2ZpbHRlcmVkXS5jb25jYXQoZmlsdGVyLmFyZ3MpKVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyZWRcbn1cblxuLyoqXG4gKiAgVW5iaW5kIGRpcmV0aXZlXG4gKi9cbkRpclByb3RvLiR1bmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcyBjYW4gYmUgY2FsbGVkIGJlZm9yZSB0aGUgZWwgaXMgZXZlbiBhc3NpZ25lZC4uLlxuICAgIGlmICghdGhpcy5lbCB8fCAhdGhpcy52bSkgcmV0dXJuXG4gICAgaWYgKHRoaXMudW5iaW5kKSB0aGlzLnVuYmluZCgpXG4gICAgdGhpcy52bSA9IHRoaXMuZWwgPSB0aGlzLmJpbmRpbmcgPSB0aGlzLmNvbXBpbGVyID0gbnVsbFxufVxuXG4vLyBFeHBvc2VkIHN0YXRpYyBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIFBhcnNlIGEgZGlyZWN0aXZlIHN0cmluZyBpbnRvIGFuIEFycmF5IG9mXG4gKiAgQVNULWxpa2Ugb2JqZWN0cyByZXByZXNlbnRpbmcgZGlyZWN0aXZlc1xuICovXG5EaXJlY3RpdmUucGFyc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG5cbiAgICB2YXIgaW5TaW5nbGUgPSBmYWxzZSxcbiAgICAgICAgaW5Eb3VibGUgPSBmYWxzZSxcbiAgICAgICAgY3VybHkgICAgPSAwLFxuICAgICAgICBzcXVhcmUgICA9IDAsXG4gICAgICAgIHBhcmVuICAgID0gMCxcbiAgICAgICAgYmVnaW4gICAgPSAwLFxuICAgICAgICBhcmdJbmRleCA9IDAsXG4gICAgICAgIGRpcnMgICAgID0gW10sXG4gICAgICAgIGRpciAgICAgID0ge30sXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IDAsXG4gICAgICAgIGFyZ1xuXG4gICAgZm9yICh2YXIgYywgaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGMgPSBzdHIuY2hhckF0KGkpXG4gICAgICAgIGlmIChpblNpbmdsZSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgc2luZ2xlIHF1b3RlXG4gICAgICAgICAgICBpZiAoYyA9PT0gXCInXCIpIGluU2luZ2xlID0gIWluU2luZ2xlXG4gICAgICAgIH0gZWxzZSBpZiAoaW5Eb3VibGUpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGRvdWJsZSBxdW90ZVxuICAgICAgICAgICAgaWYgKGMgPT09ICdcIicpIGluRG91YmxlID0gIWluRG91YmxlXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJywnICYmICFwYXJlbiAmJiAhY3VybHkgJiYgIXNxdWFyZSkge1xuICAgICAgICAgICAgLy8gcmVhY2hlZCB0aGUgZW5kIG9mIGEgZGlyZWN0aXZlXG4gICAgICAgICAgICBwdXNoRGlyKClcbiAgICAgICAgICAgIC8vIHJlc2V0ICYgc2tpcCB0aGUgY29tbWFcbiAgICAgICAgICAgIGRpciA9IHt9XG4gICAgICAgICAgICBiZWdpbiA9IGFyZ0luZGV4ID0gbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnOicgJiYgIWRpci5rZXkgJiYgIWRpci5hcmcpIHtcbiAgICAgICAgICAgIC8vIGFyZ3VtZW50XG4gICAgICAgICAgICBhcmcgPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICAgICAgICAgICAgaWYgKEFSR19SRS50ZXN0KGFyZykpIHtcbiAgICAgICAgICAgICAgICBhcmdJbmRleCA9IGkgKyAxXG4gICAgICAgICAgICAgICAgZGlyLmFyZyA9IGFyZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd8JyAmJiBzdHIuY2hhckF0KGkgKyAxKSAhPT0gJ3wnICYmIHN0ci5jaGFyQXQoaSAtIDEpICE9PSAnfCcpIHtcbiAgICAgICAgICAgIGlmIChkaXIua2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBrZXlcbiAgICAgICAgICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICAgICAgICAgIGRpci5rZXkgPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhbHJlYWR5IGhhcyBmaWx0ZXJcbiAgICAgICAgICAgICAgICBwdXNoRmlsdGVyKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnXCInKSB7XG4gICAgICAgICAgICBpbkRvdWJsZSA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSBcIidcIikge1xuICAgICAgICAgICAgaW5TaW5nbGUgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJygnKSB7XG4gICAgICAgICAgICBwYXJlbisrXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJyknKSB7XG4gICAgICAgICAgICBwYXJlbi0tXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ1snKSB7XG4gICAgICAgICAgICBzcXVhcmUrK1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICddJykge1xuICAgICAgICAgICAgc3F1YXJlLS1cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAneycpIHtcbiAgICAgICAgICAgIGN1cmx5KytcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnfScpIHtcbiAgICAgICAgICAgIGN1cmx5LS1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaSA9PT0gMCB8fCBiZWdpbiAhPT0gaSkge1xuICAgICAgICBwdXNoRGlyKClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoRGlyICgpIHtcbiAgICAgICAgZGlyLmV4cHJlc3Npb24gPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICAgICAgICBpZiAoZGlyLmtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkaXIua2V5ID0gc3RyLnNsaWNlKGFyZ0luZGV4LCBpKS50cmltKClcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0RmlsdGVySW5kZXggIT09IGJlZ2luKSB7XG4gICAgICAgICAgICBwdXNoRmlsdGVyKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMCB8fCBkaXIua2V5KSB7XG4gICAgICAgICAgICBkaXJzLnB1c2goZGlyKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHVzaEZpbHRlciAoKSB7XG4gICAgICAgIHZhciBleHAgPSBzdHIuc2xpY2UobGFzdEZpbHRlckluZGV4LCBpKS50cmltKCksXG4gICAgICAgICAgICBmaWx0ZXJcbiAgICAgICAgaWYgKGV4cCkge1xuICAgICAgICAgICAgZmlsdGVyID0ge31cbiAgICAgICAgICAgIHZhciB0b2tlbnMgPSBleHAubWF0Y2goRklMVEVSX1RPS0VOX1JFKVxuICAgICAgICAgICAgZmlsdGVyLm5hbWUgPSB0b2tlbnNbMF1cbiAgICAgICAgICAgIGZpbHRlci5hcmdzID0gdG9rZW5zLmxlbmd0aCA+IDEgPyB0b2tlbnMuc2xpY2UoMSkgOiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgKGRpci5maWx0ZXJzID0gZGlyLmZpbHRlcnMgfHwgW10pLnB1c2goZmlsdGVyKVxuICAgICAgICB9XG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcnNcbn1cblxuLyoqXG4gKiAgSW5saW5lIGNvbXB1dGVkIGZpbHRlcnMgc28gdGhleSBiZWNvbWUgcGFydFxuICogIG9mIHRoZSBleHByZXNzaW9uXG4gKi9cbkRpcmVjdGl2ZS5pbmxpbmVGaWx0ZXJzID0gZnVuY3Rpb24gKGtleSwgZmlsdGVycykge1xuICAgIHZhciBhcmdzLCBmaWx0ZXJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGZpbHRlciA9IGZpbHRlcnNbaV1cbiAgICAgICAgYXJncyA9IGZpbHRlci5hcmdzXG4gICAgICAgICAgICA/ICcsXCInICsgZmlsdGVyLmFyZ3MubWFwKGVzY2FwZVF1b3RlKS5qb2luKCdcIixcIicpICsgJ1wiJ1xuICAgICAgICAgICAgOiAnJ1xuICAgICAgICBrZXkgPSAndGhpcy4kY29tcGlsZXIuZ2V0T3B0aW9uKFwiZmlsdGVyc1wiLCBcIicgK1xuICAgICAgICAgICAgICAgIGZpbHRlci5uYW1lICtcbiAgICAgICAgICAgICdcIikuY2FsbCh0aGlzLCcgK1xuICAgICAgICAgICAgICAgIGtleSArIGFyZ3MgK1xuICAgICAgICAgICAgJyknXG4gICAgfVxuICAgIHJldHVybiBrZXlcbn1cblxuLyoqXG4gKiAgQ29udmVydCBkb3VibGUgcXVvdGVzIHRvIHNpbmdsZSBxdW90ZXNcbiAqICBzbyB0aGV5IGRvbid0IG1lc3MgdXAgdGhlIGdlbmVyYXRlZCBmdW5jdGlvbiBib2R5XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVF1b3RlICh2KSB7XG4gICAgcmV0dXJuIHYuaW5kZXhPZignXCInKSA+IC0xXG4gICAgICAgID8gdi5yZXBsYWNlKFFVT1RFX1JFLCAnXFwnJylcbiAgICAgICAgOiB2XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcbiAgICBzbGljZSA9IFtdLnNsaWNlXG5cbi8qKlxuICogIEJpbmRpbmcgZm9yIGlubmVySFRNTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYSBjb21tZW50IG5vZGUgbWVhbnMgdGhpcyBpcyBhIGJpbmRpbmcgZm9yXG4gICAgICAgIC8vIHt7eyBpbmxpbmUgdW5lc2NhcGVkIGh0bWwgfX19XG4gICAgICAgIGlmICh0aGlzLmVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAgICAgICAvLyBob2xkIG5vZGVzXG4gICAgICAgICAgICB0aGlzLm5vZGVzID0gW11cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IHV0aWxzLmd1YXJkKHZhbHVlKVxuICAgICAgICBpZiAodGhpcy5ub2Rlcykge1xuICAgICAgICAgICAgdGhpcy5zd2FwKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN3YXA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5lbC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgbm9kZXMgID0gdGhpcy5ub2RlcyxcbiAgICAgICAgICAgIGkgICAgICA9IG5vZGVzLmxlbmd0aFxuICAgICAgICAvLyByZW1vdmUgb2xkIG5vZGVzXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChub2Rlc1tpXSlcbiAgICAgICAgfVxuICAgICAgICAvLyBjb252ZXJ0IG5ldyB2YWx1ZSB0byBhIGZyYWdtZW50XG4gICAgICAgIHZhciBmcmFnID0gdXRpbHMudG9GcmFnbWVudCh2YWx1ZSlcbiAgICAgICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSB0byB0aGVzZSBub2RlcyBzbyB3ZSBjYW4gcmVtb3ZlIGxhdGVyXG4gICAgICAgIHRoaXMubm9kZXMgPSBzbGljZS5jYWxsKGZyYWcuY2hpbGROb2RlcylcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShmcmFnLCB0aGlzLmVsKVxuICAgIH1cbn0iLCJ2YXIgdXRpbHMgICAgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbi8qKlxuICogIE1hbmFnZXMgYSBjb25kaXRpb25hbCBjaGlsZCBWTVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucGFyZW50ID0gdGhpcy5lbC5wYXJlbnROb2RlXG4gICAgICAgIHRoaXMucmVmICAgID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndnVlLWlmJylcbiAgICAgICAgdGhpcy5DdG9yICAgPSB0aGlzLmNvbXBpbGVyLnJlc29sdmVDb21wb25lbnQodGhpcy5lbClcblxuICAgICAgICAvLyBpbnNlcnQgcmVmXG4gICAgICAgIHRoaXMucGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLnJlZiwgdGhpcy5lbClcbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5lbClcblxuICAgICAgICBpZiAodXRpbHMuYXR0cih0aGlzLmVsLCAndmlldycpKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKFxuICAgICAgICAgICAgICAgICdDb25mbGljdDogdi1pZiBjYW5ub3QgYmUgdXNlZCB0b2dldGhlciB3aXRoIHYtdmlldy4gJyArXG4gICAgICAgICAgICAgICAgJ0p1c3Qgc2V0IHYtdmlld1xcJ3MgYmluZGluZyB2YWx1ZSB0byBlbXB0eSBzdHJpbmcgdG8gZW1wdHkgaXQuJ1xuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlscy5hdHRyKHRoaXMuZWwsICdyZXBlYXQnKSkge1xuICAgICAgICAgICAgdXRpbHMud2FybihcbiAgICAgICAgICAgICAgICAnQ29uZmxpY3Q6IHYtaWYgY2Fubm90IGJlIHVzZWQgdG9nZXRoZXIgd2l0aCB2LXJlcGVhdC4gJyArXG4gICAgICAgICAgICAgICAgJ1VzZSBgdi1zaG93YCBvciB0aGUgYGZpbHRlckJ5YCBmaWx0ZXIgaW5zdGVhZC4nXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcblxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZCgpXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNID0gbmV3IHRoaXMuQ3Rvcih7XG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuZWwuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgICAgIHBhcmVudDogdGhpcy52bVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBpbGVyLmluaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5pbnNlcnRCZWZvcmUodGhpcy5jaGlsZFZNLiRlbCwgdGhpcy5yZWYpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRkZXN0cm95KClcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTSA9IG51bGxcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ2YXIgdXRpbHMgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXG4gICAgY29uZmlnICAgICA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLFxuICAgIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJyksXG4gICAgZGlyZWN0aXZlcyA9IG1vZHVsZS5leHBvcnRzID0gdXRpbHMuaGFzaCgpXG5cbi8qKlxuICogIE5lc3QgYW5kIG1hbmFnZSBhIENoaWxkIFZNXG4gKi9cbmRpcmVjdGl2ZXMuY29tcG9uZW50ID0ge1xuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbC52dWVfdm0pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTSA9IG5ldyB0aGlzLkN0b3Ioe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLmVsLFxuICAgICAgICAgICAgICAgIHBhcmVudDogdGhpcy52bVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kZGVzdHJveSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIEJpbmRpbmcgSFRNTCBhdHRyaWJ1dGVzXG4gKi9cbmRpcmVjdGl2ZXMuYXR0ciA9IHtcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnZtLiRvcHRpb25zLnBhcmFtQXR0cmlidXRlc1xuICAgICAgICB0aGlzLmlzUGFyYW0gPSBwYXJhbXMgJiYgcGFyYW1zLmluZGV4T2YodGhpcy5hcmcpID4gLTFcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUodGhpcy5hcmcsIHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hcmcpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNQYXJhbSkge1xuICAgICAgICAgICAgdGhpcy52bVt0aGlzLmFyZ10gPSB1dGlscy5jaGVja051bWJlcih2YWx1ZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQmluZGluZyB0ZXh0Q29udGVudFxuICovXG5kaXJlY3RpdmVzLnRleHQgPSB7XG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmF0dHIgPSB0aGlzLmVsLm5vZGVUeXBlID09PSAzXG4gICAgICAgICAgICA/ICdub2RlVmFsdWUnXG4gICAgICAgICAgICA6ICd0ZXh0Q29udGVudCdcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZWxbdGhpcy5hdHRyXSA9IHV0aWxzLmd1YXJkKHZhbHVlKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQmluZGluZyBDU1MgZGlzcGxheSBwcm9wZXJ0eVxuICovXG5kaXJlY3RpdmVzLnNob3cgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsLFxuICAgICAgICB0YXJnZXQgPSB2YWx1ZSA/ICcnIDogJ25vbmUnLFxuICAgICAgICBjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdGFyZ2V0XG4gICAgICAgIH1cbiAgICB0cmFuc2l0aW9uKGVsLCB2YWx1ZSA/IDEgOiAtMSwgY2hhbmdlLCB0aGlzLmNvbXBpbGVyKVxufVxuXG4vKipcbiAqICBCaW5kaW5nIENTUyBjbGFzc2VzXG4gKi9cbmRpcmVjdGl2ZXNbJ2NsYXNzJ10gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5hcmcpIHtcbiAgICAgICAgdXRpbHNbdmFsdWUgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10odGhpcy5lbCwgdGhpcy5hcmcpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdFZhbCkge1xuICAgICAgICAgICAgdXRpbHMucmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5sYXN0VmFsKVxuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdXRpbHMuYWRkQ2xhc3ModGhpcy5lbCwgdmFsdWUpXG4gICAgICAgICAgICB0aGlzLmxhc3RWYWwgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBPbmx5IHJlbW92ZWQgYWZ0ZXIgdGhlIG93bmVyIFZNIGlzIHJlYWR5XG4gKi9cbmRpcmVjdGl2ZXMuY2xvYWsgPSB7XG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAgICAgdGhpcy5jb21waWxlci5vYnNlcnZlci5vbmNlKCdob29rOnJlYWR5JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyAnLWNsb2FrJylcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHNlbGYgaW4gcGFyZW50IFZNJ3MgJFxuICovXG5kaXJlY3RpdmVzLnJlZiA9IHtcbiAgICBpc0xpdGVyYWw6IHRydWUsXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb25cbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICB0aGlzLnZtLiRwYXJlbnQuJFtpZF0gPSB0aGlzLnZtXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb25cbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy52bS4kcGFyZW50LiRbaWRdXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmRpcmVjdGl2ZXMub24gICAgICA9IHJlcXVpcmUoJy4vb24nKVxuZGlyZWN0aXZlcy5yZXBlYXQgID0gcmVxdWlyZSgnLi9yZXBlYXQnKVxuZGlyZWN0aXZlcy5tb2RlbCAgID0gcmVxdWlyZSgnLi9tb2RlbCcpXG5kaXJlY3RpdmVzWydpZiddICAgPSByZXF1aXJlKCcuL2lmJylcbmRpcmVjdGl2ZXNbJ3dpdGgnXSA9IHJlcXVpcmUoJy4vd2l0aCcpXG5kaXJlY3RpdmVzLmh0bWwgICAgPSByZXF1aXJlKCcuL2h0bWwnKVxuZGlyZWN0aXZlcy5zdHlsZSAgID0gcmVxdWlyZSgnLi9zdHlsZScpXG5kaXJlY3RpdmVzLnBhcnRpYWwgPSByZXF1aXJlKCcuL3BhcnRpYWwnKVxuZGlyZWN0aXZlcy52aWV3ICAgID0gcmVxdWlyZSgnLi92aWV3JykiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIGlzSUU5ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDkuMCcpID4gMCxcbiAgICBmaWx0ZXIgPSBbXS5maWx0ZXJcblxuLyoqXG4gKiAgUmV0dXJucyBhbiBhcnJheSBvZiB2YWx1ZXMgZnJvbSBhIG11bHRpcGxlIHNlbGVjdFxuICovXG5mdW5jdGlvbiBnZXRNdWx0aXBsZVNlbGVjdE9wdGlvbnMgKHNlbGVjdCkge1xuICAgIHJldHVybiBmaWx0ZXJcbiAgICAgICAgLmNhbGwoc2VsZWN0Lm9wdGlvbnMsIGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb24uc2VsZWN0ZWRcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0XG4gICAgICAgIH0pXG59XG5cbi8qKlxuICogIFR3by13YXkgYmluZGluZyBmb3IgZm9ybSBpbnB1dCBlbGVtZW50c1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBlbCAgID0gc2VsZi5lbCxcbiAgICAgICAgICAgIHR5cGUgPSBlbC50eXBlLFxuICAgICAgICAgICAgdGFnICA9IGVsLnRhZ05hbWVcblxuICAgICAgICBzZWxmLmxvY2sgPSBmYWxzZVxuICAgICAgICBzZWxmLm93bmVyVk0gPSBzZWxmLmJpbmRpbmcuY29tcGlsZXIudm1cblxuICAgICAgICAvLyBkZXRlcm1pbmUgd2hhdCBldmVudCB0byBsaXN0ZW4gdG9cbiAgICAgICAgc2VsZi5ldmVudCA9XG4gICAgICAgICAgICAoc2VsZi5jb21waWxlci5vcHRpb25zLmxhenkgfHxcbiAgICAgICAgICAgIHRhZyA9PT0gJ1NFTEVDVCcgfHxcbiAgICAgICAgICAgIHR5cGUgPT09ICdjaGVja2JveCcgfHwgdHlwZSA9PT0gJ3JhZGlvJylcbiAgICAgICAgICAgICAgICA/ICdjaGFuZ2UnXG4gICAgICAgICAgICAgICAgOiAnaW5wdXQnXG5cbiAgICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBhdHRyaWJ1dGUgdG8gY2hhbmdlIHdoZW4gdXBkYXRpbmdcbiAgICAgICAgc2VsZi5hdHRyID0gdHlwZSA9PT0gJ2NoZWNrYm94J1xuICAgICAgICAgICAgPyAnY2hlY2tlZCdcbiAgICAgICAgICAgIDogKHRhZyA9PT0gJ0lOUFVUJyB8fCB0YWcgPT09ICdTRUxFQ1QnIHx8IHRhZyA9PT0gJ1RFWFRBUkVBJylcbiAgICAgICAgICAgICAgICA/ICd2YWx1ZSdcbiAgICAgICAgICAgICAgICA6ICdpbm5lckhUTUwnXG5cbiAgICAgICAgLy8gc2VsZWN0W211bHRpcGxlXSBzdXBwb3J0XG4gICAgICAgIGlmKHRhZyA9PT0gJ1NFTEVDVCcgJiYgZWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvc2l0aW9uTG9jayA9IGZhbHNlXG4gICAgICAgIHNlbGYuY0xvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21wb3NpdGlvbkxvY2sgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5jVW5sb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tcG9zaXRpb25Mb2NrID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jTG9jaylcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCB0aGlzLmNVbmxvY2spXG5cbiAgICAgICAgLy8gYXR0YWNoIGxpc3RlbmVyXG4gICAgICAgIHNlbGYuc2V0ID0gc2VsZi5maWx0ZXJzXG4gICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9zaXRpb25Mb2NrKSByZXR1cm5cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGRpcmVjdGl2ZSBoYXMgZmlsdGVyc1xuICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gbGV0IHRoZSB2bS4kc2V0IHRyaWdnZXJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUoKSBzbyBmaWx0ZXJzIGFyZSBhcHBsaWVkLlxuICAgICAgICAgICAgICAgIC8vIHRoZXJlZm9yZSB3ZSBoYXZlIHRvIHJlY29yZCBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAvLyBzbyB0aGF0IGFmdGVyIHZtLiRzZXQgY2hhbmdlcyB0aGUgaW5wdXRcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSB3ZSBjYW4gcHV0IHRoZSBjdXJzb3IgYmFjayBhdCB3aGVyZSBpdCBpc1xuICAgICAgICAgICAgICAgIHZhciBjdXJzb3JQb3NcbiAgICAgICAgICAgICAgICB0cnkgeyBjdXJzb3JQb3MgPSBlbC5zZWxlY3Rpb25TdGFydCB9IGNhdGNoIChlKSB7fVxuXG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0KClcblxuICAgICAgICAgICAgICAgIC8vIHNpbmNlIHVwZGF0ZXMgYXJlIGFzeW5jXG4gICAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byByZXNldCBjdXJzb3IgcG9zaXRpb24gYXN5bmMgdG9vXG4gICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3Vyc29yUG9zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKGN1cnNvclBvcywgY3Vyc29yUG9zKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb3NpdGlvbkxvY2spIHJldHVyblxuICAgICAgICAgICAgICAgIC8vIG5vIGZpbHRlcnMsIGRvbid0IGxldCBpdCB0cmlnZ2VyIHVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgc2VsZi5sb2NrID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0KClcblxuICAgICAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NrID0gZmFsc2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKHNlbGYuZXZlbnQsIHNlbGYuc2V0KVxuXG4gICAgICAgIC8vIGZpeCBzaGl0IGZvciBJRTlcbiAgICAgICAgLy8gc2luY2UgaXQgZG9lc24ndCBmaXJlIGlucHV0IG9uIGJhY2tzcGFjZSAvIGRlbCAvIGN1dFxuICAgICAgICBpZiAoaXNJRTkpIHtcbiAgICAgICAgICAgIHNlbGYub25DdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gY3V0IGV2ZW50IGZpcmVzIGJlZm9yZSB0aGUgdmFsdWUgYWN0dWFsbHkgY2hhbmdlc1xuICAgICAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXQoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLm9uRGVsID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0NiB8fCBlLmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXQoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2N1dCcsIHNlbGYub25DdXQpXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHNlbGYub25EZWwpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm93bmVyVk0uJHNldChcbiAgICAgICAgICAgIHRoaXMua2V5LCB0aGlzLm11bHRpXG4gICAgICAgICAgICAgICAgPyBnZXRNdWx0aXBsZVNlbGVjdE9wdGlvbnModGhpcy5lbClcbiAgICAgICAgICAgICAgICA6IHRoaXMuZWxbdGhpcy5hdHRyXVxuICAgICAgICApXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlLCBpbml0KSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIC8vIHN5bmMgYmFjayBpbmxpbmUgdmFsdWUgaWYgaW5pdGlhbCBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICBpZiAoaW5pdCAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0KClcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2NrKSByZXR1cm5cbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgICBpZiAoZWwudGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHsgLy8gc2VsZWN0IGRyb3Bkb3duXG4gICAgICAgICAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICAgICAgICAgIGlmKHRoaXMubXVsdGkgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKHRoaXMudXBkYXRlU2VsZWN0LCB0aGlzKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdCh2YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlbC50eXBlID09PSAncmFkaW8nKSB7IC8vIHJhZGlvIGJ1dHRvblxuICAgICAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlID09IGVsLnZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoZWwudHlwZSA9PT0gJ2NoZWNrYm94JykgeyAvLyBjaGVja2JveFxuICAgICAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsW3RoaXMuYXR0cl0gPSB1dGlscy5ndWFyZCh2YWx1ZSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVTZWxlY3Q6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICAvLyBzZXR0aW5nIDxzZWxlY3Q+J3MgdmFsdWUgaW4gSUU5IGRvZXNuJ3Qgd29ya1xuICAgICAgICAvLyB3ZSBoYXZlIHRvIG1hbnVhbGx5IGxvb3AgdGhyb3VnaCB0aGUgb3B0aW9uc1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZWwub3B0aW9ucyxcbiAgICAgICAgICAgIGkgPSBvcHRpb25zLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9uc1tpXS52YWx1ZSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbaV0uc2VsZWN0ZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuZXZlbnQsIHRoaXMuc2V0KVxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jTG9jaylcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCB0aGlzLmNVbmxvY2spXG4gICAgICAgIGlmIChpc0lFOSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY3V0JywgdGhpcy5vbkN1dClcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5vbkRlbClcbiAgICAgICAgfVxuICAgIH1cbn0iLCJ2YXIgdXRpbHMgICAgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbi8qKlxuICogIEJpbmRpbmcgZm9yIGV2ZW50IGxpc3RlbmVyc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGlzRm46IHRydWUsXG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuYmluZGluZy5pc0V4cFxuICAgICAgICAgICAgPyB0aGlzLnZtXG4gICAgICAgICAgICA6IHRoaXMuYmluZGluZy5jb21waWxlci52bVxuICAgICAgICBpZiAodGhpcy5lbC50YWdOYW1lID09PSAnSUZSQU1FJyAmJiB0aGlzLmFyZyAhPT0gJ2xvYWQnKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lQmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmVsLmNvbnRlbnRXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihzZWxmLmFyZywgc2VsZi5oYW5kbGVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKCdEaXJlY3RpdmUgXCJ2LW9uOicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgZXhwZWN0cyBhIG1ldGhvZC4nKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldCgpXG4gICAgICAgIHZhciB2bSA9IHRoaXMudm0sXG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcy5jb250ZXh0XG4gICAgICAgIHRoaXMuaGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnRhcmdldFZNID0gdm1cbiAgICAgICAgICAgIGNvbnRleHQuJGV2ZW50ID0gZVxuICAgICAgICAgICAgdmFyIHJlcyA9IGhhbmRsZXIuY2FsbChjb250ZXh0LCBlKVxuICAgICAgICAgICAgY29udGV4dC4kZXZlbnQgPSBudWxsXG4gICAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaWZyYW1lQmluZCkge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVCaW5kKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuaWZyYW1lQmluZFxuICAgICAgICAgICAgPyB0aGlzLmVsLmNvbnRlbnRXaW5kb3dcbiAgICAgICAgICAgIDogdGhpcy5lbFxuICAgICAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLmlmcmFtZUJpbmQpXG4gICAgfVxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgcGFydGlhbHNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGlkID0gdGhpcy5leHByZXNzaW9uXG4gICAgICAgIGlmICghaWQpIHJldHVyblxuXG4gICAgICAgIHZhciBlbCAgICAgICA9IHRoaXMuZWwsXG4gICAgICAgICAgICBjb21waWxlciA9IHRoaXMuY29tcGlsZXIsXG4gICAgICAgICAgICBwYXJ0aWFsICA9IGNvbXBpbGVyLmdldE9wdGlvbigncGFydGlhbHMnLCBpZClcblxuICAgICAgICBpZiAoIXBhcnRpYWwpIHtcbiAgICAgICAgICAgIGlmIChpZCA9PT0gJ3lpZWxkJykge1xuICAgICAgICAgICAgICAgIHV0aWxzLndhcm4oJ3t7PnlpZWxkfX0gc3ludGF4IGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFVzZSA8Y29udGVudD4gdGFnIGluc3RlYWQuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgcGFydGlhbCA9IHBhcnRpYWwuY2xvbmVOb2RlKHRydWUpXG5cbiAgICAgICAgLy8gY29tbWVudCByZWYgbm9kZSBtZWFucyBpbmxpbmUgcGFydGlhbFxuICAgICAgICBpZiAoZWwubm9kZVR5cGUgPT09IDgpIHtcblxuICAgICAgICAgICAgLy8ga2VlcCBhIHJlZiBmb3IgdGhlIHBhcnRpYWwncyBjb250ZW50IG5vZGVzXG4gICAgICAgICAgICB2YXIgbm9kZXMgPSBbXS5zbGljZS5jYWxsKHBhcnRpYWwuY2hpbGROb2RlcyksXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gZWwucGFyZW50Tm9kZVxuICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShwYXJ0aWFsLCBlbClcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgICAgIC8vIGNvbXBpbGUgcGFydGlhbCBhZnRlciBhcHBlbmRpbmcsIGJlY2F1c2UgaXRzIGNoaWxkcmVuJ3MgcGFyZW50Tm9kZVxuICAgICAgICAgICAgLy8gd2lsbCBjaGFuZ2UgZnJvbSB0aGUgZnJhZ21lbnQgdG8gdGhlIGNvcnJlY3QgcGFyZW50Tm9kZS5cbiAgICAgICAgICAgIC8vIFRoaXMgY291bGQgYWZmZWN0IGRpcmVjdGl2ZXMgdGhhdCBuZWVkIGFjY2VzcyB0byBpdHMgZWxlbWVudCdzIHBhcmVudE5vZGUuXG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGNvbXBpbGVyLmNvbXBpbGUsIGNvbXBpbGVyKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGp1c3Qgc2V0IGlubmVySFRNTC4uLlxuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gJydcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHBhcnRpYWwpXG5cbiAgICAgICAgfVxuICAgIH1cblxufSIsInZhciB1dGlscyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcbiAgICBjb25maWcgICAgID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiAgQmluZGluZyB0aGF0IG1hbmFnZXMgVk1zIGJhc2VkIG9uIGFuIEFycmF5XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaWRlbnRpZmllciA9ICckcicgKyB0aGlzLmlkXG5cbiAgICAgICAgLy8gYSBoYXNoIHRvIGNhY2hlIHRoZSBzYW1lIGV4cHJlc3Npb25zIG9uIHJlcGVhdGVkIGluc3RhbmNlc1xuICAgICAgICAvLyBzbyB0aGV5IGRvbid0IGhhdmUgdG8gYmUgY29tcGlsZWQgZm9yIGV2ZXJ5IHNpbmdsZSBpbnN0YW5jZVxuICAgICAgICB0aGlzLmV4cENhY2hlID0gdXRpbHMuaGFzaCgpXG5cbiAgICAgICAgdmFyIGVsICAgPSB0aGlzLmVsLFxuICAgICAgICAgICAgY3RuICA9IHRoaXMuY29udGFpbmVyID0gZWwucGFyZW50Tm9kZVxuXG4gICAgICAgIC8vIGV4dHJhY3QgY2hpbGQgSWQsIGlmIGFueVxuICAgICAgICB0aGlzLmNoaWxkSWQgPSB0aGlzLmNvbXBpbGVyLmV2YWwodXRpbHMuYXR0cihlbCwgJ3JlZicpKVxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGNvbW1lbnQgbm9kZSBhcyBhIHJlZmVyZW5jZSBub2RlIGZvciBET00gaW5zZXJ0aW9uc1xuICAgICAgICB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoY29uZmlnLnByZWZpeCArICctcmVwZWF0LScgKyB0aGlzLmtleSlcbiAgICAgICAgY3RuLmluc2VydEJlZm9yZSh0aGlzLnJlZiwgZWwpXG4gICAgICAgIGN0bi5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBudWxsXG4gICAgICAgIHRoaXMudm1zID0gbnVsbFxuXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIGlmICh1dGlscy5pc09iamVjdChjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSB1dGlscy5vYmplY3RUb0FycmF5KGNvbGxlY3Rpb24pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWxzLndhcm4oJ3YtcmVwZWF0IG9ubHkgYWNjZXB0cyBBcnJheSBvciBPYmplY3QgdmFsdWVzLicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBrZWVwIHJlZmVyZW5jZSBvZiBvbGQgZGF0YSBhbmQgVk1zXG4gICAgICAgIC8vIHNvIHdlIGNhbiByZXVzZSB0aGVtIGlmIHBvc3NpYmxlXG4gICAgICAgIHRoaXMub2xkVk1zID0gdGhpcy52bXNcbiAgICAgICAgdGhpcy5vbGRDb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uXG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uIHx8IFtdXG5cbiAgICAgICAgdmFyIGlzT2JqZWN0ID0gY29sbGVjdGlvblswXSAmJiB1dGlscy5pc09iamVjdChjb2xsZWN0aW9uWzBdKVxuICAgICAgICB0aGlzLnZtcyA9IHRoaXMub2xkQ29sbGVjdGlvblxuICAgICAgICAgICAgPyB0aGlzLmRpZmYoY29sbGVjdGlvbiwgaXNPYmplY3QpXG4gICAgICAgICAgICA6IHRoaXMuaW5pdChjb2xsZWN0aW9uLCBpc09iamVjdClcblxuICAgICAgICBpZiAodGhpcy5jaGlsZElkKSB7XG4gICAgICAgICAgICB0aGlzLnZtLiRbdGhpcy5jaGlsZElkXSA9IHRoaXMudm1zXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiAoY29sbGVjdGlvbiwgaXNPYmplY3QpIHtcbiAgICAgICAgdmFyIHZtLCB2bXMgPSBbXVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2bSA9IHRoaXMuYnVpbGQoY29sbGVjdGlvbltpXSwgaSwgaXNPYmplY3QpXG4gICAgICAgICAgICB2bXMucHVzaCh2bSlcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBpbGVyLmluaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUodm0uJGVsLCB0aGlzLnJlZilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdm0uJGJlZm9yZSh0aGlzLnJlZilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdm1zXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBEaWZmIHRoZSBuZXcgYXJyYXkgd2l0aCB0aGUgb2xkXG4gICAgICogIGFuZCBkZXRlcm1pbmUgdGhlIG1pbmltdW0gYW1vdW50IG9mIERPTSBtYW5pcHVsYXRpb25zLlxuICAgICAqL1xuICAgIGRpZmY6IGZ1bmN0aW9uIChuZXdDb2xsZWN0aW9uLCBpc09iamVjdCkge1xuXG4gICAgICAgIHZhciBpLCBsLCBpdGVtLCB2bSxcbiAgICAgICAgICAgIG9sZEluZGV4LFxuICAgICAgICAgICAgdGFyZ2V0TmV4dCxcbiAgICAgICAgICAgIGN1cnJlbnROZXh0LFxuICAgICAgICAgICAgbmV4dEVsLFxuICAgICAgICAgICAgY3RuICAgID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgICAgICBvbGRWTXMgPSB0aGlzLm9sZFZNcyxcbiAgICAgICAgICAgIHZtcyAgICA9IFtdXG5cbiAgICAgICAgdm1zLmxlbmd0aCA9IG5ld0NvbGxlY3Rpb24ubGVuZ3RoXG5cbiAgICAgICAgLy8gZmlyc3QgcGFzcywgY29sbGVjdCBuZXcgcmV1c2VkIGFuZCBuZXcgY3JlYXRlZFxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gbmV3Q29sbGVjdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGl0ZW0gPSBuZXdDb2xsZWN0aW9uW2ldXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpdGVtLiRpbmRleCA9IGlcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5fX2VtaXR0ZXJfXyAmJiBpdGVtLl9fZW1pdHRlcl9fW3RoaXMuaWRlbnRpZmllcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBwaWVjZSBvZiBkYXRhIGlzIGJlaW5nIHJldXNlZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjb3JkIGl0cyBmaW5hbCBwb3NpdGlvbiBpbiByZXVzZWQgdm1zXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uJHJldXNlZCA9IHRydWVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bXNbaV0gPSB0aGlzLmJ1aWxkKGl0ZW0sIGksIGlzT2JqZWN0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gd2UgY2FuJ3QgYXR0YWNoIGFuIGlkZW50aWZpZXIgdG8gcHJpbWl0aXZlIHZhbHVlc1xuICAgICAgICAgICAgICAgIC8vIHNvIGhhdmUgdG8gZG8gYW4gaW5kZXhPZi4uLlxuICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gaW5kZXhPZihvbGRWTXMsIGl0ZW0pXG4gICAgICAgICAgICAgICAgaWYgKG9sZEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVjb3JkIHRoZSBwb3NpdGlvbiBvbiB0aGUgZXhpc3Rpbmcgdm1cbiAgICAgICAgICAgICAgICAgICAgb2xkVk1zW29sZEluZGV4XS4kcmV1c2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBvbGRWTXNbb2xkSW5kZXhdLiRkYXRhLiRpbmRleCA9IGlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bXNbaV0gPSB0aGlzLmJ1aWxkKGl0ZW0sIGksIGlzT2JqZWN0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlY29uZCBwYXNzLCBjb2xsZWN0IG9sZCByZXVzZWQgYW5kIGRlc3Ryb3kgdW51c2VkXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBvbGRWTXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2bSA9IG9sZFZNc1tpXVxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuYXJnXG4gICAgICAgICAgICAgICAgPyB2bS4kZGF0YVt0aGlzLmFyZ11cbiAgICAgICAgICAgICAgICA6IHZtLiRkYXRhXG4gICAgICAgICAgICBpZiAoaXRlbS4kcmV1c2VkKSB7XG4gICAgICAgICAgICAgICAgdm0uJHJldXNlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS4kcmV1c2VkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodm0uJHJldXNlZCkge1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgaW5kZXggdG8gbGF0ZXN0XG4gICAgICAgICAgICAgICAgdm0uJGluZGV4ID0gaXRlbS4kaW5kZXhcbiAgICAgICAgICAgICAgICAvLyB0aGUgaXRlbSBjb3VsZCBoYXZlIGhhZCBhIG5ldyBrZXlcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS4ka2V5ICYmIGl0ZW0uJGtleSAhPT0gdm0uJGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2bS4ka2V5ID0gaXRlbS4ka2V5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtc1t2bS4kaW5kZXhdID0gdm1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBvbmUgY2FuIGJlIGRlc3Ryb3llZC5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5fX2VtaXR0ZXJfXykge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5fX2VtaXR0ZXJfX1t0aGlzLmlkZW50aWZpZXJdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLiRkZXN0cm95KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbmFsIHBhc3MsIG1vdmUvaW5zZXJ0IERPTSBlbGVtZW50c1xuICAgICAgICBpID0gdm1zLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICB2bSA9IHZtc1tpXVxuICAgICAgICAgICAgaXRlbSA9IHZtLiRkYXRhXG4gICAgICAgICAgICB0YXJnZXROZXh0ID0gdm1zW2kgKyAxXVxuICAgICAgICAgICAgaWYgKHZtLiRyZXVzZWQpIHtcbiAgICAgICAgICAgICAgICBuZXh0RWwgPSB2bS4kZWwubmV4dFNpYmxpbmdcbiAgICAgICAgICAgICAgICAvLyBkZXN0cm95ZWQgVk1zJyBlbGVtZW50IG1pZ2h0IHN0aWxsIGJlIGluIHRoZSBET01cbiAgICAgICAgICAgICAgICAvLyBkdWUgdG8gdHJhbnNpdGlvbnNcbiAgICAgICAgICAgICAgICB3aGlsZSAoIW5leHRFbC52dWVfdm0gJiYgbmV4dEVsICE9PSB0aGlzLnJlZikge1xuICAgICAgICAgICAgICAgICAgICBuZXh0RWwgPSBuZXh0RWwubmV4dFNpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudE5leHQgPSBuZXh0RWwudnVlX3ZtXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROZXh0ICE9PSB0YXJnZXROZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0TmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RuLmluc2VydEJlZm9yZSh2bS4kZWwsIHRoaXMucmVmKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEVsID0gdGFyZ2V0TmV4dC4kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBWTXMnIGVsZW1lbnQgbWlnaHQgbm90IGJlIGluIHRoZSBET00geWV0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkdWUgdG8gdHJhbnNpdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICghbmV4dEVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROZXh0ID0gdm1zW25leHRFbC52dWVfdm0uJGluZGV4ICsgMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0RWwgPSB0YXJnZXROZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGFyZ2V0TmV4dC4kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnJlZlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3RuLmluc2VydEJlZm9yZSh2bS4kZWwsIG5leHRFbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgdm0uJHJldXNlZFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLiRpbmRleFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLiRrZXlcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIGEgbmV3IHZtXG4gICAgICAgICAgICAgICAgdm0uJGJlZm9yZSh0YXJnZXROZXh0ID8gdGFyZ2V0TmV4dC4kZWwgOiB0aGlzLnJlZilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2bXNcbiAgICB9LFxuXG4gICAgYnVpbGQ6IGZ1bmN0aW9uIChkYXRhLCBpbmRleCwgaXNPYmplY3QpIHtcblxuICAgICAgICAvLyB3cmFwIG5vbi1vYmplY3QgdmFsdWVzXG4gICAgICAgIHZhciByYXcsIGFsaWFzLFxuICAgICAgICAgICAgd3JhcCA9ICFpc09iamVjdCB8fCB0aGlzLmFyZ1xuICAgICAgICBpZiAod3JhcCkge1xuICAgICAgICAgICAgcmF3ID0gZGF0YVxuICAgICAgICAgICAgYWxpYXMgPSB0aGlzLmFyZyB8fCAnJHZhbHVlJ1xuICAgICAgICAgICAgZGF0YSA9IHt9XG4gICAgICAgICAgICBkYXRhW2FsaWFzXSA9IHJhd1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuJGluZGV4ID0gaW5kZXhcblxuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgIEN0b3IgPSB0aGlzLmNvbXBpbGVyLnJlc29sdmVDb21wb25lbnQoZWwsIGRhdGEpLFxuICAgICAgICAgICAgdm0gPSBuZXcgQ3Rvcih7XG4gICAgICAgICAgICAgICAgZWw6IGVsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtLFxuICAgICAgICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICByZXBlYXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4cENhY2hlOiB0aGlzLmV4cENhY2hlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgICAgICAgIC8vIGF0dGFjaCBhbiBpZW51bWVyYWJsZSBpZGVudGlmaWVyIHRvIHRoZSByYXcgZGF0YVxuICAgICAgICAgICAgKHJhdyB8fCBkYXRhKS5fX2VtaXR0ZXJfX1t0aGlzLmlkZW50aWZpZXJdID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZtXG5cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkSWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZtLiRbdGhpcy5jaGlsZElkXVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZtcykge1xuICAgICAgICAgICAgdmFyIGkgPSB0aGlzLnZtcy5sZW5ndGhcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZtc1tpXS4kZGVzdHJveSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgRmluZCBhbiBvYmplY3Qgb3IgYSB3cmFwcGVkIGRhdGEgb2JqZWN0XG4gKiAgZnJvbSBhbiBBcnJheVxuICovXG5mdW5jdGlvbiBpbmRleE9mICh2bXMsIG9iaikge1xuICAgIGZvciAodmFyIHZtLCBpID0gMCwgbCA9IHZtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdm0gPSB2bXNbaV1cbiAgICAgICAgaWYgKCF2bS4kcmV1c2VkICYmIHZtLiR2YWx1ZSA9PT0gb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gaVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMVxufSIsInZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnLW1zLSddXG5cbi8qKlxuICogIEJpbmRpbmcgZm9yIENTUyBzdHlsZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5hcmdcbiAgICAgICAgaWYgKCFwcm9wKSByZXR1cm5cbiAgICAgICAgaWYgKHByb3AuY2hhckF0KDApID09PSAnJCcpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgdGhhdCBzdGFydCB3aXRoICQgd2lsbCBiZSBhdXRvLXByZWZpeGVkXG4gICAgICAgICAgICBwcm9wID0gcHJvcC5zbGljZSgxKVxuICAgICAgICAgICAgdGhpcy5wcmVmaXhlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb3AgPSBwcm9wXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5wcm9wLFxuICAgICAgICAgICAgaXNJbXBvcnRhbnRcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogdHJ1ZSAqL1xuICAgICAgICAvLyBjYXN0IHBvc3NpYmxlIG51bWJlcnMvYm9vbGVhbnMgaW50byBzdHJpbmdzXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB2YWx1ZSArPSAnJ1xuICAgICAgICBpZiAocHJvcCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaXNJbXBvcnRhbnQgPSB2YWx1ZS5zbGljZSgtMTApID09PSAnIWltcG9ydGFudCdcbiAgICAgICAgICAgICAgICAgICAgPyAnaW1wb3J0YW50J1xuICAgICAgICAgICAgICAgICAgICA6ICcnXG4gICAgICAgICAgICAgICAgaWYgKGlzSW1wb3J0YW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgLTEwKS50cmltKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWZpeGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBwcmVmaXhlcy5sZW5ndGhcbiAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkocHJlZml4ZXNbaV0gKyBwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5zdHlsZS5jc3NUZXh0ID0gdmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxufSIsIi8qKlxuICogIE1hbmFnZXMgYSBjb25kaXRpb25hbCBjaGlsZCBWTSB1c2luZyB0aGVcbiAqICBiaW5kaW5nJ3MgdmFsdWUgYXMgdGhlIGNvbXBvbmVudCBJRC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gdHJhY2sgcG9zaXRpb24gaW4gRE9NIHdpdGggYSByZWYgbm9kZVxuICAgICAgICB2YXIgZWwgICAgICAgPSB0aGlzLnJhdyA9IHRoaXMuZWwsXG4gICAgICAgICAgICBwYXJlbnQgICA9IGVsLnBhcmVudE5vZGUsXG4gICAgICAgICAgICByZWYgICAgICA9IHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi12aWV3JylcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShyZWYsIGVsKVxuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgLy8gY2FjaGUgb3JpZ2luYWwgY29udGVudFxuICAgICAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgICAgICB2YXIgbm9kZSxcbiAgICAgICAgICAgIGZyYWcgPSB0aGlzLmlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy51bmJpbmQoKVxuXG4gICAgICAgIHZhciBDdG9yICA9IHRoaXMuY29tcGlsZXIuZ2V0T3B0aW9uKCdjb21wb25lbnRzJywgdmFsdWUpXG4gICAgICAgIGlmICghQ3RvcikgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5jaGlsZFZNID0gbmV3IEN0b3Ioe1xuICAgICAgICAgICAgZWw6IHRoaXMucmF3LmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcy52bSxcbiAgICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHJhd0NvbnRlbnQ6IHRoaXMuaW5uZXIuY2xvbmVOb2RlKHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuY2hpbGRWTS4kZWxcbiAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgdGhpcy5yZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGhpcy5yZWYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGJlZm9yZSh0aGlzLnJlZilcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kZGVzdHJveSgpXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbi8qKlxuICogIEJpbmRpbmcgZm9yIGluaGVyaXRpbmcgZGF0YSBmcm9tIHBhcmVudCBWTXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzZWxmICAgICAgPSB0aGlzLFxuICAgICAgICAgICAgY2hpbGRLZXkgID0gc2VsZi5hcmcsXG4gICAgICAgICAgICBwYXJlbnRLZXkgPSBzZWxmLmtleSxcbiAgICAgICAgICAgIGNvbXBpbGVyICA9IHNlbGYuY29tcGlsZXIsXG4gICAgICAgICAgICBvd25lciAgICAgPSBzZWxmLmJpbmRpbmcuY29tcGlsZXJcblxuICAgICAgICBpZiAoY29tcGlsZXIgPT09IG93bmVyKSB7XG4gICAgICAgICAgICB0aGlzLmFsb25lID0gdHJ1ZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGRLZXkpIHtcbiAgICAgICAgICAgIGlmICghY29tcGlsZXIuYmluZGluZ3NbY2hpbGRLZXldKSB7XG4gICAgICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhjaGlsZEtleSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHN5bmMgY2hhbmdlcyBvbiBjaGlsZCBiYWNrIHRvIHBhcmVudFxuICAgICAgICAgICAgY29tcGlsZXIub2JzZXJ2ZXIub24oJ2NoYW5nZTonICsgY2hpbGRLZXksIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGlsZXIuaW5pdCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NrID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB1dGlscy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvd25lci52bS4kc2V0KHBhcmVudEtleSwgdmFsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBzeW5jIGZyb20gcGFyZW50XG4gICAgICAgIGlmICghdGhpcy5hbG9uZSAmJiAhdGhpcy5sb2NrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZtLiRzZXQodGhpcy5hcmcsIHZhbHVlKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZtLiRkYXRhICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudm0uJGRhdGEgPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59IiwidmFyIHNsaWNlID0gW10uc2xpY2VcblxuZnVuY3Rpb24gRW1pdHRlciAoY3R4KSB7XG4gICAgdGhpcy5fY3R4ID0gY3R4IHx8IHRoaXNcbn1cblxudmFyIEVtaXR0ZXJQcm90byA9IEVtaXR0ZXIucHJvdG90eXBlXG5cbkVtaXR0ZXJQcm90by5vbiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cbiAgICA7KHRoaXMuX2Nic1tldmVudF0gPSB0aGlzLl9jYnNbZXZlbnRdIHx8IFtdKVxuICAgICAgICAucHVzaChmbilcbiAgICByZXR1cm4gdGhpc1xufVxuXG5FbWl0dGVyUHJvdG8ub25jZSA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cblxuICAgIGZ1bmN0aW9uIG9uICgpIHtcbiAgICAgICAgc2VsZi5vZmYoZXZlbnQsIG9uKVxuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgb24uZm4gPSBmblxuICAgIHRoaXMub24oZXZlbnQsIG9uKVxuICAgIHJldHVybiB0aGlzXG59XG5cbkVtaXR0ZXJQcm90by5vZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG5cbiAgICAvLyBhbGxcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fY2JzID0ge31cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvLyBzcGVjaWZpYyBldmVudFxuICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYnNbZXZlbnRdXG4gICAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzXG5cbiAgICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2Nic1tldmVudF1cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICAgIHZhciBjYlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNiID0gY2FsbGJhY2tzW2ldXG4gICAgICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogIFRoZSBpbnRlcm5hbCwgZmFzdGVyIGVtaXQgd2l0aCBmaXhlZCBhbW91bnQgb2YgYXJndW1lbnRzXG4gKiAgdXNpbmcgRnVuY3Rpb24uY2FsbFxuICovXG5FbWl0dGVyUHJvdG8uZW1pdCA9IGZ1bmN0aW9uIChldmVudCwgYSwgYiwgYykge1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYnNbZXZlbnRdXG5cbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3NbaV0uY2FsbCh0aGlzLl9jdHgsIGEsIGIsIGMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqICBUaGUgZXh0ZXJuYWwgZW1pdCB1c2luZyBGdW5jdGlvbi5hcHBseVxuICovXG5FbWl0dGVyUHJvdG8uYXBwbHlFbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2Nic1tldmVudF0sIGFyZ3NcblxuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApXG4gICAgICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMuX2N0eCwgYXJncylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlciIsInZhciB1dGlscyAgICAgICAgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgU1RSX1NBVkVfUkUgICAgID0gL1wiKD86W15cIlxcXFxdfFxcXFwuKSpcInwnKD86W14nXFxcXF18XFxcXC4pKicvZyxcbiAgICBTVFJfUkVTVE9SRV9SRSAgPSAvXCIoXFxkKylcIi9nLFxuICAgIE5FV0xJTkVfUkUgICAgICA9IC9cXG4vZyxcbiAgICBDVE9SX1JFICAgICAgICAgPSBuZXcgUmVnRXhwKCdjb25zdHJ1Y3Rvcicuc3BsaXQoJycpLmpvaW4oJ1tcXCdcIissIF0qJykpLFxuICAgIFVOSUNPREVfUkUgICAgICA9IC9cXFxcdVxcZFxcZFxcZFxcZC9cblxuLy8gVmFyaWFibGUgZXh0cmFjdGlvbiBzY29vcGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL1J1YnlMb3V2cmUvYXZhbG9uXG5cbnZhciBLRVlXT1JEUyA9XG4gICAgICAgIC8vIGtleXdvcmRzXG4gICAgICAgICdicmVhayxjYXNlLGNhdGNoLGNvbnRpbnVlLGRlYnVnZ2VyLGRlZmF1bHQsZGVsZXRlLGRvLGVsc2UsZmFsc2UnICtcbiAgICAgICAgJyxmaW5hbGx5LGZvcixmdW5jdGlvbixpZixpbixpbnN0YW5jZW9mLG5ldyxudWxsLHJldHVybixzd2l0Y2gsdGhpcycgK1xuICAgICAgICAnLHRocm93LHRydWUsdHJ5LHR5cGVvZix2YXIsdm9pZCx3aGlsZSx3aXRoLHVuZGVmaW5lZCcgK1xuICAgICAgICAvLyByZXNlcnZlZFxuICAgICAgICAnLGFic3RyYWN0LGJvb2xlYW4sYnl0ZSxjaGFyLGNsYXNzLGNvbnN0LGRvdWJsZSxlbnVtLGV4cG9ydCxleHRlbmRzJyArXG4gICAgICAgICcsZmluYWwsZmxvYXQsZ290byxpbXBsZW1lbnRzLGltcG9ydCxpbnQsaW50ZXJmYWNlLGxvbmcsbmF0aXZlJyArXG4gICAgICAgICcscGFja2FnZSxwcml2YXRlLHByb3RlY3RlZCxwdWJsaWMsc2hvcnQsc3RhdGljLHN1cGVyLHN5bmNocm9uaXplZCcgK1xuICAgICAgICAnLHRocm93cyx0cmFuc2llbnQsdm9sYXRpbGUnICtcbiAgICAgICAgLy8gRUNNQSA1IC0gdXNlIHN0cmljdFxuICAgICAgICAnLGFyZ3VtZW50cyxsZXQseWllbGQnICtcbiAgICAgICAgLy8gYWxsb3cgdXNpbmcgTWF0aCBpbiBleHByZXNzaW9uc1xuICAgICAgICAnLE1hdGgnLFxuICAgICAgICBcbiAgICBLRVlXT1JEU19SRSA9IG5ldyBSZWdFeHAoW1wiXFxcXGJcIiArIEtFWVdPUkRTLnJlcGxhY2UoLywvZywgJ1xcXFxifFxcXFxiJykgKyBcIlxcXFxiXCJdLmpvaW4oJ3wnKSwgJ2cnKSxcbiAgICBSRU1PVkVfUkUgICA9IC9cXC9cXCooPzoufFxcbikqP1xcKlxcL3xcXC9cXC9bXlxcbl0qXFxufFxcL1xcL1teXFxuXSokfCdbXiddKid8XCJbXlwiXSpcInxbXFxzXFx0XFxuXSpcXC5bXFxzXFx0XFxuXSpbJFxcd1xcLl0rfFtcXHssXVxccypbXFx3XFwkX10rXFxzKjovZyxcbiAgICBTUExJVF9SRSAgICA9IC9bXlxcdyRdKy9nLFxuICAgIE5VTUJFUl9SRSAgID0gL1xcYlxcZFteLF0qL2csXG4gICAgQk9VTkRBUllfUkUgPSAvXiwrfCwrJC9nXG5cbi8qKlxuICogIFN0cmlwIHRvcCBsZXZlbCB2YXJpYWJsZSBuYW1lcyBmcm9tIGEgc25pcHBldCBvZiBKUyBleHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlcyAoY29kZSkge1xuICAgIGNvZGUgPSBjb2RlXG4gICAgICAgIC5yZXBsYWNlKFJFTU9WRV9SRSwgJycpXG4gICAgICAgIC5yZXBsYWNlKFNQTElUX1JFLCAnLCcpXG4gICAgICAgIC5yZXBsYWNlKEtFWVdPUkRTX1JFLCAnJylcbiAgICAgICAgLnJlcGxhY2UoTlVNQkVSX1JFLCAnJylcbiAgICAgICAgLnJlcGxhY2UoQk9VTkRBUllfUkUsICcnKVxuICAgIHJldHVybiBjb2RlXG4gICAgICAgID8gY29kZS5zcGxpdCgvLCsvKVxuICAgICAgICA6IFtdXG59XG5cbi8qKlxuICogIEEgZ2l2ZW4gcGF0aCBjb3VsZCBwb3RlbnRpYWxseSBleGlzdCBub3Qgb24gdGhlXG4gKiAgY3VycmVudCBjb21waWxlciwgYnV0IHVwIGluIHRoZSBwYXJlbnQgY2hhaW4gc29tZXdoZXJlLlxuICogIFRoaXMgZnVuY3Rpb24gZ2VuZXJhdGVzIGFuIGFjY2VzcyByZWxhdGlvbnNoaXAgc3RyaW5nXG4gKiAgdGhhdCBjYW4gYmUgdXNlZCBpbiB0aGUgZ2V0dGVyIGZ1bmN0aW9uIGJ5IHdhbGtpbmcgdXBcbiAqICB0aGUgcGFyZW50IGNoYWluIHRvIGNoZWNrIGZvciBrZXkgZXhpc3RlbmNlLlxuICpcbiAqICBJdCBzdG9wcyBhdCB0b3AgcGFyZW50IGlmIG5vIHZtIGluIHRoZSBjaGFpbiBoYXMgdGhlXG4gKiAga2V5LiBJdCB0aGVuIGNyZWF0ZXMgYW55IG1pc3NpbmcgYmluZGluZ3Mgb24gdGhlXG4gKiAgZmluYWwgcmVzb2x2ZWQgdm0uXG4gKi9cbmZ1bmN0aW9uIHRyYWNlU2NvcGUgKHBhdGgsIGNvbXBpbGVyLCBkYXRhKSB7XG4gICAgdmFyIHJlbCAgPSAnJyxcbiAgICAgICAgZGlzdCA9IDAsXG4gICAgICAgIHNlbGYgPSBjb21waWxlclxuXG4gICAgaWYgKGRhdGEgJiYgdXRpbHMuZ2V0KGRhdGEsIHBhdGgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gaGFjazogdGVtcG9yYXJpbHkgYXR0YWNoZWQgZGF0YVxuICAgICAgICByZXR1cm4gJyR0ZW1wLidcbiAgICB9XG5cbiAgICB3aGlsZSAoY29tcGlsZXIpIHtcbiAgICAgICAgaWYgKGNvbXBpbGVyLmhhc0tleShwYXRoKSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBpbGVyID0gY29tcGlsZXIucGFyZW50XG4gICAgICAgICAgICBkaXN0KytcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tcGlsZXIpIHtcbiAgICAgICAgd2hpbGUgKGRpc3QtLSkge1xuICAgICAgICAgICAgcmVsICs9ICckcGFyZW50LidcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbXBpbGVyLmJpbmRpbmdzW3BhdGhdICYmIHBhdGguY2hhckF0KDApICE9PSAnJCcpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcocGF0aClcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuY3JlYXRlQmluZGluZyhwYXRoKVxuICAgIH1cbiAgICByZXR1cm4gcmVsXG59XG5cbi8qKlxuICogIENyZWF0ZSBhIGZ1bmN0aW9uIGZyb20gYSBzdHJpbmcuLi5cbiAqICB0aGlzIGxvb2tzIGxpa2UgZXZpbCBtYWdpYyBidXQgc2luY2UgYWxsIHZhcmlhYmxlcyBhcmUgbGltaXRlZFxuICogIHRvIHRoZSBWTSdzIGRhdGEgaXQncyBhY3R1YWxseSBwcm9wZXJseSBzYW5kYm94ZWRcbiAqL1xuZnVuY3Rpb24gbWFrZUdldHRlciAoZXhwLCByYXcpIHtcbiAgICB2YXIgZm5cbiAgICB0cnkge1xuICAgICAgICBmbiA9IG5ldyBGdW5jdGlvbihleHApXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB1dGlscy53YXJuKCdFcnJvciBwYXJzaW5nIGV4cHJlc3Npb246ICcgKyByYXcpXG4gICAgfVxuICAgIHJldHVybiBmblxufVxuXG4vKipcbiAqICBFc2NhcGUgYSBsZWFkaW5nIGRvbGxhciBzaWduIGZvciByZWdleCBjb25zdHJ1Y3Rpb25cbiAqL1xuZnVuY3Rpb24gZXNjYXBlRG9sbGFyICh2KSB7XG4gICAgcmV0dXJuIHYuY2hhckF0KDApID09PSAnJCdcbiAgICAgICAgPyAnXFxcXCcgKyB2XG4gICAgICAgIDogdlxufVxuXG4vKipcbiAqICBQYXJzZSBhbmQgcmV0dXJuIGFuIGFub255bW91cyBjb21wdXRlZCBwcm9wZXJ0eSBnZXR0ZXIgZnVuY3Rpb25cbiAqICBmcm9tIGFuIGFyYml0cmFyeSBleHByZXNzaW9uLCB0b2dldGhlciB3aXRoIGEgbGlzdCBvZiBwYXRocyB0byBiZVxuICogIGNyZWF0ZWQgYXMgYmluZGluZ3MuXG4gKi9cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoZXhwLCBjb21waWxlciwgZGF0YSkge1xuICAgIC8vIHVuaWNvZGUgYW5kICdjb25zdHJ1Y3RvcicgYXJlIG5vdCBhbGxvd2VkIGZvciBYU1Mgc2VjdXJpdHkuXG4gICAgaWYgKFVOSUNPREVfUkUudGVzdChleHApIHx8IENUT1JfUkUudGVzdChleHApKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ1Vuc2FmZSBleHByZXNzaW9uOiAnICsgZXhwKVxuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gZXh0cmFjdCB2YXJpYWJsZSBuYW1lc1xuICAgIHZhciB2YXJzID0gZ2V0VmFyaWFibGVzKGV4cClcbiAgICBpZiAoIXZhcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBtYWtlR2V0dGVyKCdyZXR1cm4gJyArIGV4cCwgZXhwKVxuICAgIH1cbiAgICB2YXJzID0gdXRpbHMudW5pcXVlKHZhcnMpXG5cbiAgICB2YXIgYWNjZXNzb3JzID0gJycsXG4gICAgICAgIGhhcyAgICAgICA9IHV0aWxzLmhhc2goKSxcbiAgICAgICAgc3RyaW5ncyAgID0gW10sXG4gICAgICAgIC8vIGNvbnN0cnVjdCBhIHJlZ2V4IHRvIGV4dHJhY3QgYWxsIHZhbGlkIHZhcmlhYmxlIHBhdGhzXG4gICAgICAgIC8vIG9uZXMgdGhhdCBiZWdpbiB3aXRoIFwiJFwiIGFyZSBwYXJ0aWN1bGFybHkgdHJpY2t5XG4gICAgICAgIC8vIGJlY2F1c2Ugd2UgY2FuJ3QgdXNlIFxcYiBmb3IgdGhlbVxuICAgICAgICBwYXRoUkUgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgXCJbXiRcXFxcd1xcXFwuXShcIiArXG4gICAgICAgICAgICB2YXJzLm1hcChlc2NhcGVEb2xsYXIpLmpvaW4oJ3wnKSArXG4gICAgICAgICAgICBcIilbJFxcXFx3XFxcXC5dKlxcXFxiXCIsICdnJ1xuICAgICAgICApLFxuICAgICAgICBib2R5ID0gKCcgJyArIGV4cClcbiAgICAgICAgICAgIC5yZXBsYWNlKFNUUl9TQVZFX1JFLCBzYXZlU3RyaW5ncylcbiAgICAgICAgICAgIC5yZXBsYWNlKHBhdGhSRSwgcmVwbGFjZVBhdGgpXG4gICAgICAgICAgICAucmVwbGFjZShTVFJfUkVTVE9SRV9SRSwgcmVzdG9yZVN0cmluZ3MpXG5cbiAgICBib2R5ID0gYWNjZXNzb3JzICsgJ3JldHVybiAnICsgYm9keVxuXG4gICAgZnVuY3Rpb24gc2F2ZVN0cmluZ3MgKHN0cikge1xuICAgICAgICB2YXIgaSA9IHN0cmluZ3MubGVuZ3RoXG4gICAgICAgIC8vIGVzY2FwZSBuZXdsaW5lcyBpbiBzdHJpbmdzIHNvIHRoZSBleHByZXNzaW9uXG4gICAgICAgIC8vIGNhbiBiZSBjb3JyZWN0bHkgZXZhbHVhdGVkXG4gICAgICAgIHN0cmluZ3NbaV0gPSBzdHIucmVwbGFjZShORVdMSU5FX1JFLCAnXFxcXG4nKVxuICAgICAgICByZXR1cm4gJ1wiJyArIGkgKyAnXCInXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZVBhdGggKHBhdGgpIHtcbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgZmlyc3QgY2hhclxuICAgICAgICB2YXIgYyA9IHBhdGguY2hhckF0KDApXG4gICAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDEpXG4gICAgICAgIHZhciB2YWwgPSAndGhpcy4nICsgdHJhY2VTY29wZShwYXRoLCBjb21waWxlciwgZGF0YSkgKyBwYXRoXG4gICAgICAgIGlmICghaGFzW3BhdGhdKSB7XG4gICAgICAgICAgICBhY2Nlc3NvcnMgKz0gdmFsICsgJzsnXG4gICAgICAgICAgICBoYXNbcGF0aF0gPSAxXG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3QgZm9yZ2V0IHRvIHB1dCB0aGF0IGZpcnN0IGNoYXIgYmFja1xuICAgICAgICByZXR1cm4gYyArIHZhbFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc3RvcmVTdHJpbmdzIChzdHIsIGkpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ3NbaV1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUdldHRlcihib2R5LCBleHApXG59XG5cbi8qKlxuICogIEV2YWx1YXRlIGFuIGV4cHJlc3Npb24gaW4gdGhlIGNvbnRleHQgb2YgYSBjb21waWxlci5cbiAqICBBY2NlcHRzIGFkZGl0aW9uYWwgZGF0YS5cbiAqL1xuZXhwb3J0cy5ldmFsID0gZnVuY3Rpb24gKGV4cCwgY29tcGlsZXIsIGRhdGEpIHtcbiAgICB2YXIgZ2V0dGVyID0gZXhwb3J0cy5wYXJzZShleHAsIGNvbXBpbGVyLCBkYXRhKSwgcmVzXG4gICAgaWYgKGdldHRlcikge1xuICAgICAgICAvLyBoYWNrOiB0ZW1wb3JhcmlseSBhdHRhY2ggdGhlIGFkZGl0aW9uYWwgZGF0YSBzb1xuICAgICAgICAvLyBpdCBjYW4gYmUgYWNjZXNzZWQgaW4gdGhlIGdldHRlclxuICAgICAgICBjb21waWxlci52bS4kdGVtcCA9IGRhdGFcbiAgICAgICAgcmVzID0gZ2V0dGVyLmNhbGwoY29tcGlsZXIudm0pXG4gICAgICAgIGRlbGV0ZSBjb21waWxlci52bS4kdGVtcFxuICAgIH1cbiAgICByZXR1cm4gcmVzXG59IiwidmFyIHV0aWxzICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIGdldCAgICAgID0gdXRpbHMuZ2V0LFxuICAgIHNsaWNlICAgID0gW10uc2xpY2UsXG4gICAgUVVPVEVfUkUgPSAvXicuKickLyxcbiAgICBmaWx0ZXJzICA9IG1vZHVsZS5leHBvcnRzID0gdXRpbHMuaGFzaCgpXG5cbi8qKlxuICogICdhYmMnID0+ICdBYmMnXG4gKi9cbmZpbHRlcnMuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHJldHVybiAnJ1xuICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKVxuICAgIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpXG59XG5cbi8qKlxuICogICdhYmMnID0+ICdBQkMnXG4gKi9cbmZpbHRlcnMudXBwZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICAgICAgPyB2YWx1ZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgOiAnJ1xufVxuXG4vKipcbiAqICAnQWJDJyA9PiAnYWJjJ1xuICovXG5maWx0ZXJzLmxvd2VyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgfHwgdmFsdWUgPT09IDApXG4gICAgICAgID8gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIDogJydcbn1cblxuLyoqXG4gKiAgMTIzNDUgPT4gJDEyLDM0NS4wMFxuICovXG5maWx0ZXJzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBzaWduKSB7XG4gICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKVxuICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHJldHVybiAnJ1xuICAgIHNpZ24gPSBzaWduIHx8ICckJ1xuICAgIHZhciBzID0gTWF0aC5mbG9vcih2YWx1ZSkudG9TdHJpbmcoKSxcbiAgICAgICAgaSA9IHMubGVuZ3RoICUgMyxcbiAgICAgICAgaCA9IGkgPiAwID8gKHMuc2xpY2UoMCwgaSkgKyAocy5sZW5ndGggPiAzID8gJywnIDogJycpKSA6ICcnLFxuICAgICAgICBmID0gJy4nICsgdmFsdWUudG9GaXhlZCgyKS5zbGljZSgtMilcbiAgICByZXR1cm4gc2lnbiArIGggKyBzLnNsaWNlKGkpLnJlcGxhY2UoLyhcXGR7M30pKD89XFxkKS9nLCAnJDEsJykgKyBmXG59XG5cbi8qKlxuICogIGFyZ3M6IGFuIGFycmF5IG9mIHN0cmluZ3MgY29ycmVzcG9uZGluZyB0b1xuICogIHRoZSBzaW5nbGUsIGRvdWJsZSwgdHJpcGxlIC4uLiBmb3JtcyBvZiB0aGUgd29yZCB0b1xuICogIGJlIHBsdXJhbGl6ZWQuIFdoZW4gdGhlIG51bWJlciB0byBiZSBwbHVyYWxpemVkXG4gKiAgZXhjZWVkcyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmdzLCBpdCB3aWxsIHVzZSB0aGUgbGFzdFxuICogIGVudHJ5IGluIHRoZSBhcnJheS5cbiAqXG4gKiAgZS5nLiBbJ3NpbmdsZScsICdkb3VibGUnLCAndHJpcGxlJywgJ211bHRpcGxlJ11cbiAqL1xuZmlsdGVycy5wbHVyYWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDFcbiAgICAgICAgPyAoYXJnc1t2YWx1ZSAtIDFdIHx8IGFyZ3NbYXJncy5sZW5ndGggLSAxXSlcbiAgICAgICAgOiAoYXJnc1t2YWx1ZSAtIDFdIHx8IGFyZ3NbMF0gKyAncycpXG59XG5cbi8qKlxuICogIEEgc3BlY2lhbCBmaWx0ZXIgdGhhdCB0YWtlcyBhIGhhbmRsZXIgZnVuY3Rpb24sXG4gKiAgd3JhcHMgaXQgc28gaXQgb25seSBnZXRzIHRyaWdnZXJlZCBvbiBzcGVjaWZpYyBrZXlwcmVzc2VzLlxuICpcbiAqICB2LW9uIG9ubHlcbiAqL1xuXG52YXIga2V5Q29kZXMgPSB7XG4gICAgZW50ZXIgICAgOiAxMyxcbiAgICB0YWIgICAgICA6IDksXG4gICAgJ2RlbGV0ZScgOiA0NixcbiAgICB1cCAgICAgICA6IDM4LFxuICAgIGxlZnQgICAgIDogMzcsXG4gICAgcmlnaHQgICAgOiAzOSxcbiAgICBkb3duICAgICA6IDQwLFxuICAgIGVzYyAgICAgIDogMjdcbn1cblxuZmlsdGVycy5rZXkgPSBmdW5jdGlvbiAoaGFuZGxlciwga2V5KSB7XG4gICAgaWYgKCFoYW5kbGVyKSByZXR1cm5cbiAgICB2YXIgY29kZSA9IGtleUNvZGVzW2tleV1cbiAgICBpZiAoIWNvZGUpIHtcbiAgICAgICAgY29kZSA9IHBhcnNlSW50KGtleSwgMTApXG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBjb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlci5jYWxsKHRoaXMsIGUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIEZpbHRlciBmaWx0ZXIgZm9yIHYtcmVwZWF0XG4gKi9cbmZpbHRlcnMuZmlsdGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzZWFyY2hLZXksIGRlbGltaXRlciwgZGF0YUtleSkge1xuXG4gICAgLy8gYWxsb3cgb3B0aW9uYWwgYGluYCBkZWxpbWl0ZXJcbiAgICAvLyBiZWNhdXNlIHdoeSBub3RcbiAgICBpZiAoZGVsaW1pdGVyICYmIGRlbGltaXRlciAhPT0gJ2luJykge1xuICAgICAgICBkYXRhS2V5ID0gZGVsaW1pdGVyXG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBzZWFyY2ggc3RyaW5nXG4gICAgdmFyIHNlYXJjaCA9IHN0cmlwUXVvdGVzKHNlYXJjaEtleSkgfHwgdGhpcy4kZ2V0KHNlYXJjaEtleSlcbiAgICBpZiAoIXNlYXJjaCkgcmV0dXJuIGFyclxuICAgIHNlYXJjaCA9IHNlYXJjaC50b0xvd2VyQ2FzZSgpXG5cbiAgICAvLyBnZXQgdGhlIG9wdGlvbmFsIGRhdGFLZXlcbiAgICBkYXRhS2V5ID0gZGF0YUtleSAmJiAoc3RyaXBRdW90ZXMoZGF0YUtleSkgfHwgdGhpcy4kZ2V0KGRhdGFLZXkpKVxuXG4gICAgLy8gY29udmVydCBvYmplY3QgdG8gYXJyYXlcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICBhcnIgPSB1dGlscy5vYmplY3RUb0FycmF5KGFycilcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gZGF0YUtleVxuICAgICAgICAgICAgPyBjb250YWlucyhnZXQoaXRlbSwgZGF0YUtleSksIHNlYXJjaClcbiAgICAgICAgICAgIDogY29udGFpbnMoaXRlbSwgc2VhcmNoKVxuICAgIH0pXG5cbn1cblxuZmlsdGVycy5maWx0ZXJCeS5jb21wdXRlZCA9IHRydWVcblxuLyoqXG4gKiAgU29ydCBmaXRsZXIgZm9yIHYtcmVwZWF0XG4gKi9cbmZpbHRlcnMub3JkZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNvcnRLZXksIHJldmVyc2VLZXkpIHtcblxuICAgIHZhciBrZXkgPSBzdHJpcFF1b3Rlcyhzb3J0S2V5KSB8fCB0aGlzLiRnZXQoc29ydEtleSlcbiAgICBpZiAoIWtleSkgcmV0dXJuIGFyclxuXG4gICAgLy8gY29udmVydCBvYmplY3QgdG8gYXJyYXlcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICBhcnIgPSB1dGlscy5vYmplY3RUb0FycmF5KGFycilcbiAgICB9XG5cbiAgICB2YXIgb3JkZXIgPSAxXG4gICAgaWYgKHJldmVyc2VLZXkpIHtcbiAgICAgICAgaWYgKHJldmVyc2VLZXkgPT09ICctMScpIHtcbiAgICAgICAgICAgIG9yZGVyID0gLTFcbiAgICAgICAgfSBlbHNlIGlmIChyZXZlcnNlS2V5LmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgICByZXZlcnNlS2V5ID0gcmV2ZXJzZUtleS5zbGljZSgxKVxuICAgICAgICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAxIDogLTFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gLTEgOiAxXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzb3J0IG9uIGEgY29weSB0byBhdm9pZCBtdXRhdGluZyBvcmlnaW5hbCBhcnJheVxuICAgIHJldHVybiBhcnIuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGEgPSBnZXQoYSwga2V5KVxuICAgICAgICBiID0gZ2V0KGIsIGtleSlcbiAgICAgICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA+IGIgPyBvcmRlciA6IC1vcmRlclxuICAgIH0pXG5cbn1cblxuZmlsdGVycy5vcmRlckJ5LmNvbXB1dGVkID0gdHJ1ZVxuXG4vLyBBcnJheSBmaWx0ZXIgaGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIFN0cmluZyBjb250YWluIGhlbHBlclxuICovXG5mdW5jdGlvbiBjb250YWlucyAodmFsLCBzZWFyY2gpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIGlmICh1dGlscy5pc09iamVjdCh2YWwpKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICAgICAgICAgIGlmIChjb250YWlucyh2YWxba2V5XSwgc2VhcmNoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xXG4gICAgfVxufVxuXG4vKipcbiAqICBUZXN0IHdoZXRoZXIgYSBzdHJpbmcgaXMgaW4gcXVvdGVzLFxuICogIGlmIHllcyByZXR1cm4gc3RyaXBwZWQgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHN0cmlwUXVvdGVzIChzdHIpIHtcbiAgICBpZiAoUVVPVEVfUkUudGVzdChzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHIuc2xpY2UoMSwgLTEpXG4gICAgfVxufSIsIi8vIHN0cmluZyAtPiBET00gY29udmVyc2lvblxuLy8gd3JhcHBlcnMgb3JpZ2luYWxseSBmcm9tIGpRdWVyeSwgc2Nvb3BlZCBmcm9tIGNvbXBvbmVudC9kb21pZnlcbnZhciBtYXAgPSB7XG4gICAgbGVnZW5kICAgOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgICB0ciAgICAgICA6IFsyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPiddLFxuICAgIGNvbCAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PjwvdGJvZHk+PGNvbGdyb3VwPicsICc8L2NvbGdyb3VwPjwvdGFibGU+J10sXG4gICAgX2RlZmF1bHQgOiBbMCwgJycsICcnXVxufVxuXG5tYXAudGQgPVxubWFwLnRoID0gWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J11cblxubWFwLm9wdGlvbiA9XG5tYXAub3B0Z3JvdXAgPSBbMSwgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsICc8L3NlbGVjdD4nXVxuXG5tYXAudGhlYWQgPVxubWFwLnRib2R5ID1cbm1hcC5jb2xncm91cCA9XG5tYXAuY2FwdGlvbiA9XG5tYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXVxuXG5tYXAudGV4dCA9XG5tYXAuY2lyY2xlID1cbm1hcC5lbGxpcHNlID1cbm1hcC5saW5lID1cbm1hcC5wYXRoID1cbm1hcC5wb2x5Z29uID1cbm1hcC5wb2x5bGluZSA9XG5tYXAucmVjdCA9IFsxLCAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiPicsJzwvc3ZnPiddXG5cbnZhciBUQUdfUkUgPSAvPChbXFx3Ol0rKS9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGVtcGxhdGVTdHJpbmcpIHtcbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgbSA9IFRBR19SRS5leGVjKHRlbXBsYXRlU3RyaW5nKVxuICAgIC8vIHRleHQgb25seVxuICAgIGlmICghbSkge1xuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRlbXBsYXRlU3RyaW5nKSlcbiAgICAgICAgcmV0dXJuIGZyYWdcbiAgICB9XG5cbiAgICB2YXIgdGFnID0gbVsxXSxcbiAgICAgICAgd3JhcCA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdCxcbiAgICAgICAgZGVwdGggPSB3cmFwWzBdLFxuICAgICAgICBwcmVmaXggPSB3cmFwWzFdLFxuICAgICAgICBzdWZmaXggPSB3cmFwWzJdLFxuICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIG5vZGUuaW5uZXJIVE1MID0gcHJlZml4ICsgdGVtcGxhdGVTdHJpbmcudHJpbSgpICsgc3VmZml4XG4gICAgd2hpbGUgKGRlcHRoLS0pIG5vZGUgPSBub2RlLmxhc3RDaGlsZFxuXG4gICAgLy8gb25lIGVsZW1lbnRcbiAgICBpZiAobm9kZS5maXJzdENoaWxkID09PSBub2RlLmxhc3RDaGlsZCkge1xuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZClcbiAgICAgICAgcmV0dXJuIGZyYWdcbiAgICB9XG5cbiAgICAvLyBtdWx0aXBsZSBub2RlcywgcmV0dXJuIGEgZnJhZ21lbnRcbiAgICB2YXIgY2hpbGRcbiAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnJhZ1xufSIsInZhciBjb25maWcgICAgICA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgVmlld01vZGVsICAgPSByZXF1aXJlKCcuL3ZpZXdtb2RlbCcpLFxuICAgIHV0aWxzICAgICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIG1ha2VIYXNoICAgID0gdXRpbHMuaGFzaCxcbiAgICBhc3NldFR5cGVzICA9IFsnZGlyZWN0aXZlJywgJ2ZpbHRlcicsICdwYXJ0aWFsJywgJ2VmZmVjdCcsICdjb21wb25lbnQnXSxcbiAgICAvLyBJbnRlcm5hbCBtb2R1bGVzIHRoYXQgYXJlIGV4cG9zZWQgZm9yIHBsdWdpbnNcbiAgICBwbHVnaW5BUEkgICA9IHtcbiAgICAgICAgdXRpbHM6IHV0aWxzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgdHJhbnNpdGlvbjogcmVxdWlyZSgnLi90cmFuc2l0aW9uJyksXG4gICAgICAgIG9ic2VydmVyOiByZXF1aXJlKCcuL29ic2VydmVyJylcbiAgICB9XG5cblZpZXdNb2RlbC5vcHRpb25zID0gY29uZmlnLmdsb2JhbEFzc2V0cyA9IHtcbiAgICBkaXJlY3RpdmVzICA6IHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLFxuICAgIGZpbHRlcnMgICAgIDogcmVxdWlyZSgnLi9maWx0ZXJzJyksXG4gICAgcGFydGlhbHMgICAgOiBtYWtlSGFzaCgpLFxuICAgIGVmZmVjdHMgICAgIDogbWFrZUhhc2goKSxcbiAgICBjb21wb25lbnRzICA6IG1ha2VIYXNoKClcbn1cblxuLyoqXG4gKiAgRXhwb3NlIGFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzXG4gKi9cbmFzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIFZpZXdNb2RlbFt0eXBlXSA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGhhc2ggPSB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11cbiAgICAgICAgaWYgKCFoYXNoKSB7XG4gICAgICAgICAgICBoYXNoID0gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddID0gbWFrZUhhc2goKVxuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBoYXNoW2lkXVxuICAgICAgICBpZiAodHlwZSA9PT0gJ3BhcnRpYWwnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHV0aWxzLnBhcnNlVGVtcGxhdGVPcHRpb24odmFsdWUpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdXRpbHMudG9Db25zdHJ1Y3Rvcih2YWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZmlsdGVyJykge1xuICAgICAgICAgICAgdXRpbHMuY2hlY2tGaWx0ZXIodmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgaGFzaFtpZF0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbn0pXG5cbi8qKlxuICogIFNldCBjb25maWcgb3B0aW9uc1xuICovXG5WaWV3TW9kZWwuY29uZmlnID0gZnVuY3Rpb24gKG9wdHMsIHZhbCkge1xuICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnW29wdHNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdbb3B0c10gPSB2YWxcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHV0aWxzLmV4dGVuZChjb25maWcsIG9wdHMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogIEV4cG9zZSBhbiBpbnRlcmZhY2UgZm9yIHBsdWdpbnNcbiAqL1xuVmlld01vZGVsLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICBpZiAodHlwZW9mIHBsdWdpbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBsdWdpbiA9IHJlcXVpcmUocGx1Z2luKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKCdDYW5ub3QgZmluZCBwbHVnaW46ICcgKyBwbHVnaW4pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgYXJncy51bnNoaWZ0KHRoaXMpXG5cbiAgICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBsdWdpbi5pbnN0YWxsLmFwcGx5KHBsdWdpbiwgYXJncylcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbHVnaW4uYXBwbHkobnVsbCwgYXJncylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgRXhwb3NlIGludGVybmFsIG1vZHVsZXMgZm9yIHBsdWdpbnNcbiAqL1xuVmlld01vZGVsLnJlcXVpcmUgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgcmV0dXJuIHBsdWdpbkFQSVttb2R1bGVdXG59XG5cblZpZXdNb2RlbC5leHRlbmQgPSBleHRlbmRcblZpZXdNb2RlbC5uZXh0VGljayA9IHV0aWxzLm5leHRUaWNrXG5cbi8qKlxuICogIEV4cG9zZSB0aGUgbWFpbiBWaWV3TW9kZWwgY2xhc3NcbiAqICBhbmQgYWRkIGV4dGVuZCBtZXRob2RcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kIChvcHRpb25zKSB7XG5cbiAgICB2YXIgUGFyZW50Vk0gPSB0aGlzXG5cbiAgICAvLyBleHRlbmQgZGF0YSBvcHRpb25zIG5lZWQgdG8gYmUgY29waWVkXG4gICAgLy8gb24gaW5zdGFudGlhdGlvblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgICAgb3B0aW9ucy5kZWZhdWx0RGF0YSA9IG9wdGlvbnMuZGF0YVxuICAgICAgICBkZWxldGUgb3B0aW9ucy5kYXRhXG4gICAgfVxuXG4gICAgLy8gaW5oZXJpdCBvcHRpb25zXG4gICAgLy8gYnV0IG9ubHkgd2hlbiB0aGUgc3VwZXIgY2xhc3MgaXMgbm90IHRoZSBuYXRpdmUgVnVlLlxuICAgIGlmIChQYXJlbnRWTSAhPT0gVmlld01vZGVsKSB7XG4gICAgICAgIG9wdGlvbnMgPSBpbmhlcml0T3B0aW9ucyhvcHRpb25zLCBQYXJlbnRWTS5vcHRpb25zLCB0cnVlKVxuICAgIH1cbiAgICB1dGlscy5wcm9jZXNzT3B0aW9ucyhvcHRpb25zKVxuXG4gICAgdmFyIEV4dGVuZGVkVk0gPSBmdW5jdGlvbiAob3B0cywgYXNQYXJlbnQpIHtcbiAgICAgICAgaWYgKCFhc1BhcmVudCkge1xuICAgICAgICAgICAgb3B0cyA9IGluaGVyaXRPcHRpb25zKG9wdHMsIG9wdGlvbnMsIHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgUGFyZW50Vk0uY2FsbCh0aGlzLCBvcHRzLCB0cnVlKVxuICAgIH1cblxuICAgIC8vIGluaGVyaXQgcHJvdG90eXBlIHByb3BzXG4gICAgdmFyIHByb3RvID0gRXh0ZW5kZWRWTS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBhcmVudFZNLnByb3RvdHlwZSlcbiAgICB1dGlscy5kZWZQcm90ZWN0ZWQocHJvdG8sICdjb25zdHJ1Y3RvcicsIEV4dGVuZGVkVk0pXG5cbiAgICAvLyBhbGxvdyBleHRlbmRlZCBWTSB0byBiZSBmdXJ0aGVyIGV4dGVuZGVkXG4gICAgRXh0ZW5kZWRWTS5leHRlbmQgID0gZXh0ZW5kXG4gICAgRXh0ZW5kZWRWTS5zdXBlciAgID0gUGFyZW50Vk1cbiAgICBFeHRlbmRlZFZNLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvLyBhbGxvdyBleHRlbmRlZCBWTSB0byBhZGQgaXRzIG93biBhc3NldHNcbiAgICBhc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgRXh0ZW5kZWRWTVt0eXBlXSA9IFZpZXdNb2RlbFt0eXBlXVxuICAgIH0pXG5cbiAgICAvLyBhbGxvdyBleHRlbmRlZCBWTSB0byB1c2UgcGx1Z2luc1xuICAgIEV4dGVuZGVkVk0udXNlICAgICA9IFZpZXdNb2RlbC51c2VcbiAgICBFeHRlbmRlZFZNLnJlcXVpcmUgPSBWaWV3TW9kZWwucmVxdWlyZVxuXG4gICAgcmV0dXJuIEV4dGVuZGVkVk1cbn1cblxuLyoqXG4gKiAgSW5oZXJpdCBvcHRpb25zXG4gKlxuICogIEZvciBvcHRpb25zIHN1Y2ggYXMgYGRhdGFgLCBgdm1zYCwgYGRpcmVjdGl2ZXNgLCAncGFydGlhbHMnLFxuICogIHRoZXkgc2hvdWxkIGJlIGZ1cnRoZXIgZXh0ZW5kZWQuIEhvd2V2ZXIgZXh0ZW5kaW5nIHNob3VsZCBvbmx5XG4gKiAgYmUgZG9uZSBhdCB0b3AgbGV2ZWwuXG4gKiAgXG4gKiAgYHByb3RvYCBpcyBhbiBleGNlcHRpb24gYmVjYXVzZSBpdCdzIGhhbmRsZWQgZGlyZWN0bHkgb24gdGhlXG4gKiAgcHJvdG90eXBlLlxuICpcbiAqICBgZWxgIGlzIGFuIGV4Y2VwdGlvbiBiZWNhdXNlIGl0J3Mgbm90IGFsbG93ZWQgYXMgYW5cbiAqICBleHRlbnNpb24gb3B0aW9uLCBidXQgb25seSBhcyBhbiBpbnN0YW5jZSBvcHRpb24uXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXRPcHRpb25zIChjaGlsZCwgcGFyZW50LCB0b3BMZXZlbCkge1xuICAgIGNoaWxkID0gY2hpbGQgfHwge31cbiAgICBpZiAoIXBhcmVudCkgcmV0dXJuIGNoaWxkXG4gICAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgICAgICBpZiAoa2V5ID09PSAnZWwnKSBjb250aW51ZVxuICAgICAgICB2YXIgdmFsID0gY2hpbGRba2V5XSxcbiAgICAgICAgICAgIHBhcmVudFZhbCA9IHBhcmVudFtrZXldXG4gICAgICAgIGlmICh0b3BMZXZlbCAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nICYmIHBhcmVudFZhbCkge1xuICAgICAgICAgICAgLy8gbWVyZ2UgaG9vayBmdW5jdGlvbnMgaW50byBhbiBhcnJheVxuICAgICAgICAgICAgY2hpbGRba2V5XSA9IFt2YWxdXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnRWYWwpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRba2V5XSA9IGNoaWxkW2tleV0uY29uY2F0KHBhcmVudFZhbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2hpbGRba2V5XS5wdXNoKHBhcmVudFZhbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHRvcExldmVsICYmXG4gICAgICAgICAgICAodXRpbHMuaXNUcnVlT2JqZWN0KHZhbCkgfHwgdXRpbHMuaXNUcnVlT2JqZWN0KHBhcmVudFZhbCkpXG4gICAgICAgICAgICAmJiAhKHBhcmVudFZhbCBpbnN0YW5jZW9mIFZpZXdNb2RlbClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBtZXJnZSB0b3BsZXZlbCBvYmplY3Qgb3B0aW9uc1xuICAgICAgICAgICAgY2hpbGRba2V5XSA9IGluaGVyaXRPcHRpb25zKHZhbCwgcGFyZW50VmFsKVxuICAgICAgICB9IGVsc2UgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBpbmhlcml0IGlmIGNoaWxkIGRvZXNuJ3Qgb3ZlcnJpZGVcbiAgICAgICAgICAgIGNoaWxkW2tleV0gPSBwYXJlbnRWYWxcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hpbGRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TW9kZWwiLCIvKiBqc2hpbnQgcHJvdG86dHJ1ZSAqL1xuXG52YXIgRW1pdHRlciAgPSByZXF1aXJlKCcuL2VtaXR0ZXInKSxcbiAgICB1dGlscyAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICAvLyBjYWNoZSBtZXRob2RzXG4gICAgZGVmICAgICAgPSB1dGlscy5kZWZQcm90ZWN0ZWQsXG4gICAgaXNPYmplY3QgPSB1dGlscy5pc09iamVjdCxcbiAgICBpc0FycmF5ICA9IEFycmF5LmlzQXJyYXksXG4gICAgaGFzT3duICAgPSAoe30pLmhhc093blByb3BlcnR5LFxuICAgIG9EZWYgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgIHNsaWNlICAgID0gW10uc2xpY2UsXG4gICAgLy8gZml4IGZvciBJRSArIF9fcHJvdG9fXyBwcm9ibGVtXG4gICAgLy8gZGVmaW5lIG1ldGhvZHMgYXMgaW5lbnVtZXJhYmxlIGlmIF9fcHJvdG9fXyBpcyBwcmVzZW50LFxuICAgIC8vIG90aGVyd2lzZSBlbnVtZXJhYmxlIHNvIHdlIGNhbiBsb29wIHRocm91Z2ggYW5kIG1hbnVhbGx5XG4gICAgLy8gYXR0YWNoIHRvIGFycmF5IGluc3RhbmNlc1xuICAgIGhhc1Byb3RvID0gKHt9KS5fX3Byb3RvX19cblxuLy8gQXJyYXkgTXV0YXRpb24gSGFuZGxlcnMgJiBBdWdtZW50YXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBUaGUgcHJveHkgcHJvdG90eXBlIHRvIHJlcGxhY2UgdGhlIF9fcHJvdG9fXyBvZlxuLy8gYW4gb2JzZXJ2ZWQgYXJyYXlcbnZhciBBcnJheVByb3h5ID0gT2JqZWN0LmNyZWF0ZShBcnJheS5wcm90b3R5cGUpXG5cbi8vIGludGVyY2VwdCBtdXRhdGlvbiBtZXRob2RzXG47W1xuICAgICdwdXNoJyxcbiAgICAncG9wJyxcbiAgICAnc2hpZnQnLFxuICAgICd1bnNoaWZ0JyxcbiAgICAnc3BsaWNlJyxcbiAgICAnc29ydCcsXG4gICAgJ3JldmVyc2UnXG5dLmZvckVhY2god2F0Y2hNdXRhdGlvbilcblxuLy8gQXVnbWVudCB0aGUgQXJyYXlQcm94eSB3aXRoIGNvbnZlbmllbmNlIG1ldGhvZHNcbmRlZihBcnJheVByb3h5LCAnJHNldCcsIGZ1bmN0aW9uIChpbmRleCwgZGF0YSkge1xuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSwgZGF0YSlbMF1cbn0sICFoYXNQcm90bylcblxuZGVmKEFycmF5UHJveHksICckcmVtb3ZlJywgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4T2YoaW5kZXgpXG4gICAgfVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSlbMF1cbiAgICB9XG59LCAhaGFzUHJvdG8pXG5cbi8qKlxuICogIEludGVyY2VwIGEgbXV0YXRpb24gZXZlbnQgc28gd2UgY2FuIGVtaXQgdGhlIG11dGF0aW9uIGluZm8uXG4gKiAgd2UgYWxzbyBhbmFseXplIHdoYXQgZWxlbWVudHMgYXJlIGFkZGVkL3JlbW92ZWQgYW5kIGxpbmsvdW5saW5rXG4gKiAgdGhlbSB3aXRoIHRoZSBwYXJlbnQgQXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHdhdGNoTXV0YXRpb24gKG1ldGhvZCkge1xuICAgIGRlZihBcnJheVByb3h5LCBtZXRob2QsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgICAgIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZVttZXRob2RdLmFwcGx5KHRoaXMsIGFyZ3MpLFxuICAgICAgICAgICAgaW5zZXJ0ZWQsIHJlbW92ZWRcblxuICAgICAgICAvLyBkZXRlcm1pbmUgbmV3IC8gcmVtb3ZlZCBlbGVtZW50c1xuICAgICAgICBpZiAobWV0aG9kID09PSAncHVzaCcgfHwgbWV0aG9kID09PSAndW5zaGlmdCcpIHtcbiAgICAgICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3BvcCcgfHwgbWV0aG9kID09PSAnc2hpZnQnKSB7XG4gICAgICAgICAgICByZW1vdmVkID0gW3Jlc3VsdF1cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdzcGxpY2UnKSB7XG4gICAgICAgICAgICBpbnNlcnRlZCA9IGFyZ3Muc2xpY2UoMilcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZXN1bHRcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gbGluayAmIHVubGlua1xuICAgICAgICBsaW5rQXJyYXlFbGVtZW50cyh0aGlzLCBpbnNlcnRlZClcbiAgICAgICAgdW5saW5rQXJyYXlFbGVtZW50cyh0aGlzLCByZW1vdmVkKVxuXG4gICAgICAgIC8vIGVtaXQgdGhlIG11dGF0aW9uIGV2ZW50XG4gICAgICAgIHRoaXMuX19lbWl0dGVyX18uZW1pdCgnbXV0YXRlJywgJycsIHRoaXMsIHtcbiAgICAgICAgICAgIG1ldGhvZCAgIDogbWV0aG9kLFxuICAgICAgICAgICAgYXJncyAgICAgOiBhcmdzLFxuICAgICAgICAgICAgcmVzdWx0ICAgOiByZXN1bHQsXG4gICAgICAgICAgICBpbnNlcnRlZCA6IGluc2VydGVkLFxuICAgICAgICAgICAgcmVtb3ZlZCAgOiByZW1vdmVkXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICBcbiAgICB9LCAhaGFzUHJvdG8pXG59XG5cbi8qKlxuICogIExpbmsgbmV3IGVsZW1lbnRzIHRvIGFuIEFycmF5LCBzbyB3aGVuIHRoZXkgY2hhbmdlXG4gKiAgYW5kIGVtaXQgZXZlbnRzLCB0aGUgb3duZXIgQXJyYXkgY2FuIGJlIG5vdGlmaWVkLlxuICovXG5mdW5jdGlvbiBsaW5rQXJyYXlFbGVtZW50cyAoYXJyLCBpdGVtcykge1xuICAgIGlmIChpdGVtcykge1xuICAgICAgICB2YXIgaSA9IGl0ZW1zLmxlbmd0aCwgaXRlbSwgb3duZXJzXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpXVxuICAgICAgICAgICAgaWYgKGlzV2F0Y2hhYmxlKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgb2JqZWN0IGlzIG5vdCBjb252ZXJ0ZWQgZm9yIG9ic2VydmluZ1xuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgaXQuLi5cbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uX19lbWl0dGVyX18pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udmVydChpdGVtKVxuICAgICAgICAgICAgICAgICAgICB3YXRjaChpdGVtKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvd25lcnMgPSBpdGVtLl9fZW1pdHRlcl9fLm93bmVyc1xuICAgICAgICAgICAgICAgIGlmIChvd25lcnMuaW5kZXhPZihhcnIpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBvd25lcnMucHVzaChhcnIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBVbmxpbmsgcmVtb3ZlZCBlbGVtZW50cyBmcm9tIHRoZSBleC1vd25lciBBcnJheS5cbiAqL1xuZnVuY3Rpb24gdW5saW5rQXJyYXlFbGVtZW50cyAoYXJyLCBpdGVtcykge1xuICAgIGlmIChpdGVtcykge1xuICAgICAgICB2YXIgaSA9IGl0ZW1zLmxlbmd0aCwgaXRlbVxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbaV1cbiAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uX19lbWl0dGVyX18pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3duZXJzID0gaXRlbS5fX2VtaXR0ZXJfXy5vd25lcnNcbiAgICAgICAgICAgICAgICBpZiAob3duZXJzKSBvd25lcnMuc3BsaWNlKG93bmVycy5pbmRleE9mKGFycikpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE9iamVjdCBhZGQvZGVsZXRlIGtleSBhdWdtZW50YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE9ialByb3h5ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlKVxuXG5kZWYoT2JqUHJveHksICckYWRkJywgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKHRoaXMsIGtleSkpIHJldHVyblxuICAgIHRoaXNba2V5XSA9IHZhbFxuICAgIGNvbnZlcnRLZXkodGhpcywga2V5LCB0cnVlKVxufSwgIWhhc1Byb3RvKVxuXG5kZWYoT2JqUHJveHksICckZGVsZXRlJywgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghKGhhc093bi5jYWxsKHRoaXMsIGtleSkpKSByZXR1cm5cbiAgICAvLyB0cmlnZ2VyIHNldCBldmVudHNcbiAgICB0aGlzW2tleV0gPSB1bmRlZmluZWRcbiAgICBkZWxldGUgdGhpc1trZXldXG4gICAgdGhpcy5fX2VtaXR0ZXJfXy5lbWl0KCdkZWxldGUnLCBrZXkpXG59LCAhaGFzUHJvdG8pXG5cbi8vIFdhdGNoIEhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgQ2hlY2sgaWYgYSB2YWx1ZSBpcyB3YXRjaGFibGVcbiAqL1xuZnVuY3Rpb24gaXNXYXRjaGFibGUgKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogJiYgIW9iai4kY29tcGlsZXJcbn1cblxuLyoqXG4gKiAgQ29udmVydCBhbiBPYmplY3QvQXJyYXkgdG8gZ2l2ZSBpdCBhIGNoYW5nZSBlbWl0dGVyLlxuICovXG5mdW5jdGlvbiBjb252ZXJ0IChvYmopIHtcbiAgICBpZiAob2JqLl9fZW1pdHRlcl9fKSByZXR1cm4gdHJ1ZVxuICAgIHZhciBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIGRlZihvYmosICdfX2VtaXR0ZXJfXycsIGVtaXR0ZXIpXG4gICAgZW1pdHRlclxuICAgICAgICAub24oJ3NldCcsIGZ1bmN0aW9uIChrZXksIHZhbCwgcHJvcGFnYXRlKSB7XG4gICAgICAgICAgICBpZiAocHJvcGFnYXRlKSBwcm9wYWdhdGVDaGFuZ2Uob2JqKVxuICAgICAgICB9KVxuICAgICAgICAub24oJ211dGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByb3BhZ2F0ZUNoYW5nZShvYmopXG4gICAgICAgIH0pXG4gICAgZW1pdHRlci52YWx1ZXMgPSB1dGlscy5oYXNoKClcbiAgICBlbWl0dGVyLm93bmVycyA9IFtdXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogIFByb3BhZ2F0ZSBhbiBhcnJheSBlbGVtZW50J3MgY2hhbmdlIHRvIGl0cyBvd25lciBhcnJheXNcbiAqL1xuZnVuY3Rpb24gcHJvcGFnYXRlQ2hhbmdlIChvYmopIHtcbiAgICB2YXIgb3duZXJzID0gb2JqLl9fZW1pdHRlcl9fLm93bmVycyxcbiAgICAgICAgaSA9IG93bmVycy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIG93bmVyc1tpXS5fX2VtaXR0ZXJfXy5lbWl0KCdzZXQnLCAnJywgJycsIHRydWUpXG4gICAgfVxufVxuXG4vKipcbiAqICBXYXRjaCB0YXJnZXQgYmFzZWQgb24gaXRzIHR5cGVcbiAqL1xuZnVuY3Rpb24gd2F0Y2ggKG9iaikge1xuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgd2F0Y2hBcnJheShvYmopXG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2F0Y2hPYmplY3Qob2JqKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQXVnbWVudCB0YXJnZXQgb2JqZWN0cyB3aXRoIG1vZGlmaWVkXG4gKiAgbWV0aG9kc1xuICovXG5mdW5jdGlvbiBhdWdtZW50ICh0YXJnZXQsIHNyYykge1xuICAgIGlmIChoYXNQcm90bykge1xuICAgICAgICB0YXJnZXQuX19wcm90b19fID0gc3JjXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgICAgICAgZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgV2F0Y2ggYW4gT2JqZWN0LCByZWN1cnNpdmUuXG4gKi9cbmZ1bmN0aW9uIHdhdGNoT2JqZWN0IChvYmopIHtcbiAgICBhdWdtZW50KG9iaiwgT2JqUHJveHkpXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBjb252ZXJ0S2V5KG9iaiwga2V5KVxuICAgIH1cbn1cblxuLyoqXG4gKiAgV2F0Y2ggYW4gQXJyYXksIG92ZXJsb2FkIG11dGF0aW9uIG1ldGhvZHNcbiAqICBhbmQgYWRkIGF1Z21lbnRhdGlvbnMgYnkgaW50ZXJjZXB0aW5nIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAqL1xuZnVuY3Rpb24gd2F0Y2hBcnJheSAoYXJyKSB7XG4gICAgYXVnbWVudChhcnIsIEFycmF5UHJveHkpXG4gICAgbGlua0FycmF5RWxlbWVudHMoYXJyLCBhcnIpXG59XG5cbi8qKlxuICogIERlZmluZSBhY2Nlc3NvcnMgZm9yIGEgcHJvcGVydHkgb24gYW4gT2JqZWN0XG4gKiAgc28gaXQgZW1pdHMgZ2V0L3NldCBldmVudHMuXG4gKiAgVGhlbiB3YXRjaCB0aGUgdmFsdWUgaXRzZWxmLlxuICovXG5mdW5jdGlvbiBjb252ZXJ0S2V5IChvYmosIGtleSwgcHJvcGFnYXRlKSB7XG4gICAgdmFyIGtleVByZWZpeCA9IGtleS5jaGFyQXQoMClcbiAgICBpZiAoa2V5UHJlZml4ID09PSAnJCcgfHwga2V5UHJlZml4ID09PSAnXycpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIGVtaXQgc2V0IG9uIGJpbmRcbiAgICAvLyB0aGlzIG1lYW5zIHdoZW4gYW4gb2JqZWN0IGlzIG9ic2VydmVkIGl0IHdpbGwgZW1pdFxuICAgIC8vIGEgZmlyc3QgYmF0Y2ggb2Ygc2V0IGV2ZW50cy5cbiAgICB2YXIgZW1pdHRlciA9IG9iai5fX2VtaXR0ZXJfXyxcbiAgICAgICAgdmFsdWVzICA9IGVtaXR0ZXIudmFsdWVzXG5cbiAgICBpbml0KG9ialtrZXldLCBwcm9wYWdhdGUpXG5cbiAgICBvRGVmKG9iaiwga2V5LCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXNba2V5XVxuICAgICAgICAgICAgLy8gb25seSBlbWl0IGdldCBvbiB0aXAgdmFsdWVzXG4gICAgICAgICAgICBpZiAocHViLnNob3VsZEdldCkge1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnZ2V0Jywga2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbCA9IHZhbHVlc1trZXldXG4gICAgICAgICAgICB1bm9ic2VydmUob2xkVmFsLCBrZXksIGVtaXR0ZXIpXG4gICAgICAgICAgICBjb3B5UGF0aHMobmV3VmFsLCBvbGRWYWwpXG4gICAgICAgICAgICAvLyBhbiBpbW1lZGlhdGUgcHJvcGVydHkgc2hvdWxkIG5vdGlmeSBpdHMgcGFyZW50XG4gICAgICAgICAgICAvLyB0byBlbWl0IHNldCBmb3IgaXRzZWxmIHRvb1xuICAgICAgICAgICAgaW5pdChuZXdWYWwsIHRydWUpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gaW5pdCAodmFsLCBwcm9wYWdhdGUpIHtcbiAgICAgICAgdmFsdWVzW2tleV0gPSB2YWxcbiAgICAgICAgZW1pdHRlci5lbWl0KCdzZXQnLCBrZXksIHZhbCwgcHJvcGFnYXRlKVxuICAgICAgICBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ3NldCcsIGtleSArICcubGVuZ3RoJywgdmFsLmxlbmd0aCwgcHJvcGFnYXRlKVxuICAgICAgICB9XG4gICAgICAgIG9ic2VydmUodmFsLCBrZXksIGVtaXR0ZXIpXG4gICAgfVxufVxuXG4vKipcbiAqICBXaGVuIGEgdmFsdWUgdGhhdCBpcyBhbHJlYWR5IGNvbnZlcnRlZCBpc1xuICogIG9ic2VydmVkIGFnYWluIGJ5IGFub3RoZXIgb2JzZXJ2ZXIsIHdlIGNhbiBza2lwXG4gKiAgdGhlIHdhdGNoIGNvbnZlcnNpb24gYW5kIHNpbXBseSBlbWl0IHNldCBldmVudCBmb3JcbiAqICBhbGwgb2YgaXRzIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIGVtaXRTZXQgKG9iaikge1xuICAgIHZhciBlbWl0dGVyID0gb2JqICYmIG9iai5fX2VtaXR0ZXJfX1xuICAgIGlmICghZW1pdHRlcikgcmV0dXJuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ3NldCcsICdsZW5ndGgnLCBvYmoubGVuZ3RoKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrZXksIHZhbFxuICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIHZhbCA9IG9ialtrZXldXG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ3NldCcsIGtleSwgdmFsKVxuICAgICAgICAgICAgZW1pdFNldCh2YWwpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIE1ha2Ugc3VyZSBhbGwgdGhlIHBhdGhzIGluIGFuIG9sZCBvYmplY3QgZXhpc3RzXG4gKiAgaW4gYSBuZXcgb2JqZWN0LlxuICogIFNvIHdoZW4gYW4gb2JqZWN0IGNoYW5nZXMsIGFsbCBtaXNzaW5nIGtleXMgd2lsbFxuICogIGVtaXQgYSBzZXQgZXZlbnQgd2l0aCB1bmRlZmluZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGNvcHlQYXRocyAobmV3T2JqLCBvbGRPYmopIHtcbiAgICBpZiAoIWlzT2JqZWN0KG5ld09iaikgfHwgIWlzT2JqZWN0KG9sZE9iaikpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBwYXRoLCBvbGRWYWwsIG5ld1ZhbFxuICAgIGZvciAocGF0aCBpbiBvbGRPYmopIHtcbiAgICAgICAgaWYgKCEoaGFzT3duLmNhbGwobmV3T2JqLCBwYXRoKSkpIHtcbiAgICAgICAgICAgIG9sZFZhbCA9IG9sZE9ialtwYXRoXVxuICAgICAgICAgICAgaWYgKGlzQXJyYXkob2xkVmFsKSkge1xuICAgICAgICAgICAgICAgIG5ld09ialtwYXRoXSA9IFtdXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9sZFZhbCkpIHtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSBuZXdPYmpbcGF0aF0gPSB7fVxuICAgICAgICAgICAgICAgIGNvcHlQYXRocyhuZXdWYWwsIG9sZFZhbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqW3BhdGhdID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIHdhbGsgYWxvbmcgYSBwYXRoIGFuZCBtYWtlIHN1cmUgaXQgY2FuIGJlIGFjY2Vzc2VkXG4gKiAgYW5kIGVudW1lcmF0ZWQgaW4gdGhhdCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZW5zdXJlUGF0aCAob2JqLCBrZXkpIHtcbiAgICB2YXIgcGF0aCA9IGtleS5zcGxpdCgnLicpLCBzZWNcbiAgICBmb3IgKHZhciBpID0gMCwgZCA9IHBhdGgubGVuZ3RoIC0gMTsgaSA8IGQ7IGkrKykge1xuICAgICAgICBzZWMgPSBwYXRoW2ldXG4gICAgICAgIGlmICghb2JqW3NlY10pIHtcbiAgICAgICAgICAgIG9ialtzZWNdID0ge31cbiAgICAgICAgICAgIGlmIChvYmouX19lbWl0dGVyX18pIGNvbnZlcnRLZXkob2JqLCBzZWMpXG4gICAgICAgIH1cbiAgICAgICAgb2JqID0gb2JqW3NlY11cbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgc2VjID0gcGF0aFtpXVxuICAgICAgICBpZiAoIShoYXNPd24uY2FsbChvYmosIHNlYykpKSB7XG4gICAgICAgICAgICBvYmpbc2VjXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgaWYgKG9iai5fX2VtaXR0ZXJfXykgY29udmVydEtleShvYmosIHNlYylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gTWFpbiBBUEkgTWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBPYnNlcnZlIGFuIG9iamVjdCB3aXRoIGEgZ2l2ZW4gcGF0aCxcbiAqICBhbmQgcHJveHkgZ2V0L3NldC9tdXRhdGUgZXZlbnRzIHRvIHRoZSBwcm92aWRlZCBvYnNlcnZlci5cbiAqL1xuZnVuY3Rpb24gb2JzZXJ2ZSAob2JqLCByYXdQYXRoLCBvYnNlcnZlcikge1xuXG4gICAgaWYgKCFpc1dhdGNoYWJsZShvYmopKSByZXR1cm5cblxuICAgIHZhciBwYXRoID0gcmF3UGF0aCA/IHJhd1BhdGggKyAnLicgOiAnJyxcbiAgICAgICAgYWxyZWFkeUNvbnZlcnRlZCA9IGNvbnZlcnQob2JqKSxcbiAgICAgICAgZW1pdHRlciA9IG9iai5fX2VtaXR0ZXJfX1xuXG4gICAgLy8gc2V0dXAgcHJveHkgbGlzdGVuZXJzIG9uIHRoZSBwYXJlbnQgb2JzZXJ2ZXIuXG4gICAgLy8gd2UgbmVlZCB0byBrZWVwIHJlZmVyZW5jZSB0byB0aGVtIHNvIHRoYXQgdGhleVxuICAgIC8vIGNhbiBiZSByZW1vdmVkIHdoZW4gdGhlIG9iamVjdCBpcyB1bi1vYnNlcnZlZC5cbiAgICBvYnNlcnZlci5wcm94aWVzID0gb2JzZXJ2ZXIucHJveGllcyB8fCB7fVxuICAgIHZhciBwcm94aWVzID0gb2JzZXJ2ZXIucHJveGllc1twYXRoXSA9IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lbWl0KCdnZXQnLCBwYXRoICsga2V5KVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbCwgcHJvcGFnYXRlKSB7XG4gICAgICAgICAgICBpZiAoa2V5KSBvYnNlcnZlci5lbWl0KCdzZXQnLCBwYXRoICsga2V5LCB2YWwpXG4gICAgICAgICAgICAvLyBhbHNvIG5vdGlmeSBvYnNlcnZlciB0aGF0IHRoZSBvYmplY3QgaXRzZWxmIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGJ1dCBvbmx5IGRvIHNvIHdoZW4gaXQncyBhIGltbWVkaWF0ZSBwcm9wZXJ0eS4gdGhpc1xuICAgICAgICAgICAgLy8gYXZvaWRzIGR1cGxpY2F0ZSBldmVudCBmaXJpbmcuXG4gICAgICAgICAgICBpZiAocmF3UGF0aCAmJiBwcm9wYWdhdGUpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lbWl0KCdzZXQnLCByYXdQYXRoLCBvYmosIHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG11dGF0ZTogZnVuY3Rpb24gKGtleSwgdmFsLCBtdXRhdGlvbikge1xuICAgICAgICAgICAgLy8gaWYgdGhlIEFycmF5IGlzIGEgcm9vdCB2YWx1ZVxuICAgICAgICAgICAgLy8gdGhlIGtleSB3aWxsIGJlIG51bGxcbiAgICAgICAgICAgIHZhciBmaXhlZFBhdGggPSBrZXkgPyBwYXRoICsga2V5IDogcmF3UGF0aFxuICAgICAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnbXV0YXRlJywgZml4ZWRQYXRoLCB2YWwsIG11dGF0aW9uKVxuICAgICAgICAgICAgLy8gYWxzbyBlbWl0IHNldCBmb3IgQXJyYXkncyBsZW5ndGggd2hlbiBpdCBtdXRhdGVzXG4gICAgICAgICAgICB2YXIgbSA9IG11dGF0aW9uLm1ldGhvZFxuICAgICAgICAgICAgaWYgKG0gIT09ICdzb3J0JyAmJiBtICE9PSAncmV2ZXJzZScpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lbWl0KCdzZXQnLCBmaXhlZFBhdGggKyAnLmxlbmd0aCcsIHZhbC5sZW5ndGgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhdHRhY2ggdGhlIGxpc3RlbmVycyB0byB0aGUgY2hpbGQgb2JzZXJ2ZXIuXG4gICAgLy8gbm93IGFsbCB0aGUgZXZlbnRzIHdpbGwgcHJvcGFnYXRlIHVwd2FyZHMuXG4gICAgZW1pdHRlclxuICAgICAgICAub24oJ2dldCcsIHByb3hpZXMuZ2V0KVxuICAgICAgICAub24oJ3NldCcsIHByb3hpZXMuc2V0KVxuICAgICAgICAub24oJ211dGF0ZScsIHByb3hpZXMubXV0YXRlKVxuXG4gICAgaWYgKGFscmVhZHlDb252ZXJ0ZWQpIHtcbiAgICAgICAgLy8gZm9yIG9iamVjdHMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiBjb252ZXJ0ZWQsXG4gICAgICAgIC8vIGVtaXQgc2V0IGV2ZW50cyBmb3IgZXZlcnl0aGluZyBpbnNpZGVcbiAgICAgICAgZW1pdFNldChvYmopXG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2F0Y2gob2JqKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ2FuY2VsIG9ic2VydmF0aW9uLCB0dXJuIG9mZiB0aGUgbGlzdGVuZXJzLlxuICovXG5mdW5jdGlvbiB1bm9ic2VydmUgKG9iaiwgcGF0aCwgb2JzZXJ2ZXIpIHtcblxuICAgIGlmICghb2JqIHx8ICFvYmouX19lbWl0dGVyX18pIHJldHVyblxuXG4gICAgcGF0aCA9IHBhdGggPyBwYXRoICsgJy4nIDogJydcbiAgICB2YXIgcHJveGllcyA9IG9ic2VydmVyLnByb3hpZXNbcGF0aF1cbiAgICBpZiAoIXByb3hpZXMpIHJldHVyblxuXG4gICAgLy8gdHVybiBvZmYgbGlzdGVuZXJzXG4gICAgb2JqLl9fZW1pdHRlcl9fXG4gICAgICAgIC5vZmYoJ2dldCcsIHByb3hpZXMuZ2V0KVxuICAgICAgICAub2ZmKCdzZXQnLCBwcm94aWVzLnNldClcbiAgICAgICAgLm9mZignbXV0YXRlJywgcHJveGllcy5tdXRhdGUpXG5cbiAgICAvLyByZW1vdmUgcmVmZXJlbmNlXG4gICAgb2JzZXJ2ZXIucHJveGllc1twYXRoXSA9IG51bGxcbn1cblxuLy8gRXhwb3NlIEFQSSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcHViID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAvLyB3aGV0aGVyIHRvIGVtaXQgZ2V0IGV2ZW50c1xuICAgIC8vIG9ubHkgZW5hYmxlZCBkdXJpbmcgZGVwZW5kZW5jeSBwYXJzaW5nXG4gICAgc2hvdWxkR2V0ICAgOiBmYWxzZSxcblxuICAgIG9ic2VydmUgICAgIDogb2JzZXJ2ZSxcbiAgICB1bm9ic2VydmUgICA6IHVub2JzZXJ2ZSxcbiAgICBlbnN1cmVQYXRoICA6IGVuc3VyZVBhdGgsXG4gICAgY29weVBhdGhzICAgOiBjb3B5UGF0aHMsXG4gICAgd2F0Y2ggICAgICAgOiB3YXRjaCxcbiAgICBjb252ZXJ0ICAgICA6IGNvbnZlcnQsXG4gICAgY29udmVydEtleSAgOiBjb252ZXJ0S2V5XG59IiwidmFyIHRvRnJhZ21lbnQgPSByZXF1aXJlKCcuL2ZyYWdtZW50Jyk7XG5cbi8qKlxuICogUGFyc2VzIGEgdGVtcGxhdGUgc3RyaW5nIG9yIG5vZGUgYW5kIG5vcm1hbGl6ZXMgaXQgaW50byBhXG4gKiBhIG5vZGUgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIHBhcnRpYWwgb2YgYSB0ZW1wbGF0ZSBvcHRpb25cbiAqXG4gKiBQb3NzaWJsZSB2YWx1ZXMgaW5jbHVkZVxuICogaWQgc2VsZWN0b3I6ICcjc29tZS10ZW1wbGF0ZS1pZCdcbiAqIHRlbXBsYXRlIHN0cmluZzogJzxkaXY+PHNwYW4+bXkgdGVtcGxhdGU8L3NwYW4+PC9kaXY+J1xuICogRG9jdW1lbnRGcmFnbWVudCBvYmplY3RcbiAqIE5vZGUgb2JqZWN0IG9mIHR5cGUgVGVtcGxhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuICAgIHZhciB0ZW1wbGF0ZU5vZGU7XG5cbiAgICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICAvLyBpZiB0aGUgdGVtcGxhdGUgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50IC0tIGRvIG5vdGhpbmdcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gdGVtcGxhdGUgYnkgSURcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZS5zbGljZSgxKSlcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGVOb2RlKSByZXR1cm5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0b0ZyYWdtZW50KHRlbXBsYXRlKVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0ZW1wbGF0ZS5ub2RlVHlwZSkge1xuICAgICAgICB0ZW1wbGF0ZU5vZGUgPSB0ZW1wbGF0ZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGlmIGl0cyBhIHRlbXBsYXRlIHRhZyBhbmQgdGhlIGJyb3dzZXIgc3VwcG9ydHMgaXQsXG4gICAgLy8gaXRzIGNvbnRlbnQgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50IVxuICAgIGlmICh0ZW1wbGF0ZU5vZGUudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJyAmJiB0ZW1wbGF0ZU5vZGUuY29udGVudCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGVOb2RlLmNvbnRlbnRcbiAgICB9XG5cbiAgICBpZiAodGVtcGxhdGVOb2RlLnRhZ05hbWUgPT09ICdTQ1JJUFQnKSB7XG4gICAgICAgIHJldHVybiB0b0ZyYWdtZW50KHRlbXBsYXRlTm9kZS5pbm5lckhUTUwpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRvRnJhZ21lbnQodGVtcGxhdGVOb2RlLm91dGVySFRNTCk7XG59XG4iLCJ2YXIgb3BlbkNoYXIgICAgICAgID0gJ3snLFxuICAgIGVuZENoYXIgICAgICAgICA9ICd9JyxcbiAgICBFU0NBUEVfUkUgICAgICAgPSAvWy0uKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLFxuICAgIC8vIGxhenkgcmVxdWlyZVxuICAgIERpcmVjdGl2ZVxuXG5leHBvcnRzLlJlZ2V4ID0gYnVpbGRJbnRlcnBvbGF0aW9uUmVnZXgoKVxuXG5mdW5jdGlvbiBidWlsZEludGVycG9sYXRpb25SZWdleCAoKSB7XG4gICAgdmFyIG9wZW4gPSBlc2NhcGVSZWdleChvcGVuQ2hhciksXG4gICAgICAgIGVuZCAgPSBlc2NhcGVSZWdleChlbmRDaGFyKVxuICAgIHJldHVybiBuZXcgUmVnRXhwKG9wZW4gKyBvcGVuICsgb3BlbiArICc/KC4rPyknICsgZW5kICsgJz8nICsgZW5kICsgZW5kKVxufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleCAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKEVTQ0FQRV9SRSwgJ1xcXFwkJicpXG59XG5cbmZ1bmN0aW9uIHNldERlbGltaXRlcnMgKGRlbGltaXRlcnMpIHtcbiAgICBvcGVuQ2hhciA9IGRlbGltaXRlcnNbMF1cbiAgICBlbmRDaGFyID0gZGVsaW1pdGVyc1sxXVxuICAgIGV4cG9ydHMuZGVsaW1pdGVycyA9IGRlbGltaXRlcnNcbiAgICBleHBvcnRzLlJlZ2V4ID0gYnVpbGRJbnRlcnBvbGF0aW9uUmVnZXgoKVxufVxuXG4vKiogXG4gKiAgUGFyc2UgYSBwaWVjZSBvZiB0ZXh0LCByZXR1cm4gYW4gYXJyYXkgb2YgdG9rZW5zXG4gKiAgdG9rZW4gdHlwZXM6XG4gKiAgMS4gcGxhaW4gc3RyaW5nXG4gKiAgMi4gb2JqZWN0IHdpdGgga2V5ID0gYmluZGluZyBrZXlcbiAqICAzLiBvYmplY3Qgd2l0aCBrZXkgJiBodG1sID0gdHJ1ZVxuICovXG5mdW5jdGlvbiBwYXJzZSAodGV4dCkge1xuICAgIGlmICghZXhwb3J0cy5SZWdleC50ZXN0KHRleHQpKSByZXR1cm4gbnVsbFxuICAgIHZhciBtLCBpLCB0b2tlbiwgbWF0Y2gsIHRva2VucyA9IFtdXG4gICAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgICB3aGlsZSAobSA9IHRleHQubWF0Y2goZXhwb3J0cy5SZWdleCkpIHtcbiAgICAgICAgaSA9IG0uaW5kZXhcbiAgICAgICAgaWYgKGkgPiAwKSB0b2tlbnMucHVzaCh0ZXh0LnNsaWNlKDAsIGkpKVxuICAgICAgICB0b2tlbiA9IHsga2V5OiBtWzFdLnRyaW0oKSB9XG4gICAgICAgIG1hdGNoID0gbVswXVxuICAgICAgICB0b2tlbi5odG1sID1cbiAgICAgICAgICAgIG1hdGNoLmNoYXJBdCgyKSA9PT0gb3BlbkNoYXIgJiZcbiAgICAgICAgICAgIG1hdGNoLmNoYXJBdChtYXRjaC5sZW5ndGggLSAzKSA9PT0gZW5kQ2hhclxuICAgICAgICB0b2tlbnMucHVzaCh0b2tlbilcbiAgICAgICAgdGV4dCA9IHRleHQuc2xpY2UoaSArIG1bMF0ubGVuZ3RoKVxuICAgIH1cbiAgICBpZiAodGV4dC5sZW5ndGgpIHRva2Vucy5wdXNoKHRleHQpXG4gICAgcmV0dXJuIHRva2Vuc1xufVxuXG4vKipcbiAqICBQYXJzZSBhbiBhdHRyaWJ1dGUgdmFsdWUgd2l0aCBwb3NzaWJsZSBpbnRlcnBvbGF0aW9uIHRhZ3NcbiAqICByZXR1cm4gYSBEaXJlY3RpdmUtZnJpZW5kbHkgZXhwcmVzc2lvblxuICpcbiAqICBlLmcuICBhIHt7Yn19IGMgID0+ICBcImEgXCIgKyBiICsgXCIgY1wiXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXR0ciAoYXR0cikge1xuICAgIERpcmVjdGl2ZSA9IERpcmVjdGl2ZSB8fCByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG4gICAgdmFyIHRva2VucyA9IHBhcnNlKGF0dHIpXG4gICAgaWYgKCF0b2tlbnMpIHJldHVybiBudWxsXG4gICAgaWYgKHRva2Vucy5sZW5ndGggPT09IDEpIHJldHVybiB0b2tlbnNbMF0ua2V5XG4gICAgdmFyIHJlcyA9IFtdLCB0b2tlblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgICByZXMucHVzaChcbiAgICAgICAgICAgIHRva2VuLmtleVxuICAgICAgICAgICAgICAgID8gaW5saW5lRmlsdGVycyh0b2tlbi5rZXkpXG4gICAgICAgICAgICAgICAgOiAoJ1wiJyArIHRva2VuICsgJ1wiJylcbiAgICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gcmVzLmpvaW4oJysnKVxufVxuXG4vKipcbiAqICBJbmxpbmVzIGFueSBwb3NzaWJsZSBmaWx0ZXJzIGluIGEgYmluZGluZ1xuICogIHNvIHRoYXQgd2UgY2FuIGNvbWJpbmUgZXZlcnl0aGluZyBpbnRvIGEgaHVnZSBleHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGlubGluZUZpbHRlcnMgKGtleSkge1xuICAgIGlmIChrZXkuaW5kZXhPZignfCcpID4gLTEpIHtcbiAgICAgICAgdmFyIGRpcnMgPSBEaXJlY3RpdmUucGFyc2Uoa2V5KSxcbiAgICAgICAgICAgIGRpciA9IGRpcnMgJiYgZGlyc1swXVxuICAgICAgICBpZiAoZGlyICYmIGRpci5maWx0ZXJzKSB7XG4gICAgICAgICAgICBrZXkgPSBEaXJlY3RpdmUuaW5saW5lRmlsdGVycyhcbiAgICAgICAgICAgICAgICBkaXIua2V5LFxuICAgICAgICAgICAgICAgIGRpci5maWx0ZXJzXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcoJyArIGtleSArICcpJ1xufVxuXG5leHBvcnRzLnBhcnNlICAgICAgICAgPSBwYXJzZVxuZXhwb3J0cy5wYXJzZUF0dHIgICAgID0gcGFyc2VBdHRyXG5leHBvcnRzLnNldERlbGltaXRlcnMgPSBzZXREZWxpbWl0ZXJzXG5leHBvcnRzLmRlbGltaXRlcnMgICAgPSBbb3BlbkNoYXIsIGVuZENoYXJdIiwidmFyIGVuZEV2ZW50cyAgPSBzbmlmZkVuZEV2ZW50cygpLFxuICAgIGNvbmZpZyAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIC8vIGJhdGNoIGVudGVyIGFuaW1hdGlvbnMgc28gd2Ugb25seSBmb3JjZSB0aGUgbGF5b3V0IG9uY2VcbiAgICBCYXRjaGVyICAgID0gcmVxdWlyZSgnLi9iYXRjaGVyJyksXG4gICAgYmF0Y2hlciAgICA9IG5ldyBCYXRjaGVyKCksXG4gICAgLy8gY2FjaGUgdGltZXIgZnVuY3Rpb25zXG4gICAgc2V0VE8gICAgICA9IHdpbmRvdy5zZXRUaW1lb3V0LFxuICAgIGNsZWFyVE8gICAgPSB3aW5kb3cuY2xlYXJUaW1lb3V0LFxuICAgIC8vIGV4aXQgY29kZXMgZm9yIHRlc3RpbmdcbiAgICBjb2RlcyA9IHtcbiAgICAgICAgQ1NTX0UgICAgIDogMSxcbiAgICAgICAgQ1NTX0wgICAgIDogMixcbiAgICAgICAgSlNfRSAgICAgIDogMyxcbiAgICAgICAgSlNfTCAgICAgIDogNCxcbiAgICAgICAgQ1NTX1NLSVAgIDogLTEsXG4gICAgICAgIEpTX1NLSVAgICA6IC0yLFxuICAgICAgICBKU19TS0lQX0UgOiAtMyxcbiAgICAgICAgSlNfU0tJUF9MIDogLTQsXG4gICAgICAgIElOSVQgICAgICA6IC01LFxuICAgICAgICBTS0lQICAgICAgOiAtNlxuICAgIH1cblxuLy8gZm9yY2UgbGF5b3V0IGJlZm9yZSB0cmlnZ2VyaW5nIHRyYW5zaXRpb25zL2FuaW1hdGlvbnNcbmJhdGNoZXIuX3ByZUZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG4gICAgdmFyIGYgPSBkb2N1bWVudC5ib2R5Lm9mZnNldEhlaWdodFxufVxuXG4vKipcbiAqICBzdGFnZTpcbiAqICAgIDEgPSBlbnRlclxuICogICAgMiA9IGxlYXZlXG4gKi9cbnZhciB0cmFuc2l0aW9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIHN0YWdlLCBjYiwgY29tcGlsZXIpIHtcblxuICAgIHZhciBjaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2IoKVxuICAgICAgICBjb21waWxlci5leGVjSG9vayhzdGFnZSA+IDAgPyAnYXR0YWNoZWQnIDogJ2RldGFjaGVkJylcbiAgICB9XG5cbiAgICBpZiAoY29tcGlsZXIuaW5pdCkge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5JTklUXG4gICAgfVxuXG4gICAgdmFyIGhhc1RyYW5zaXRpb24gPSBlbC52dWVfdHJhbnMgPT09ICcnLFxuICAgICAgICBoYXNBbmltYXRpb24gID0gZWwudnVlX2FuaW0gPT09ICcnLFxuICAgICAgICBlZmZlY3RJZCAgICAgID0gZWwudnVlX2VmZmVjdFxuXG4gICAgaWYgKGVmZmVjdElkKSB7XG4gICAgICAgIHJldHVybiBhcHBseVRyYW5zaXRpb25GdW5jdGlvbnMoXG4gICAgICAgICAgICBlbCxcbiAgICAgICAgICAgIHN0YWdlLFxuICAgICAgICAgICAgY2hhbmdlU3RhdGUsXG4gICAgICAgICAgICBlZmZlY3RJZCxcbiAgICAgICAgICAgIGNvbXBpbGVyXG4gICAgICAgIClcbiAgICB9IGVsc2UgaWYgKGhhc1RyYW5zaXRpb24gfHwgaGFzQW5pbWF0aW9uKSB7XG4gICAgICAgIHJldHVybiBhcHBseVRyYW5zaXRpb25DbGFzcyhcbiAgICAgICAgICAgIGVsLFxuICAgICAgICAgICAgc3RhZ2UsXG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSxcbiAgICAgICAgICAgIGhhc0FuaW1hdGlvblxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICByZXR1cm4gY29kZXMuU0tJUFxuICAgIH1cblxufVxuXG4vKipcbiAqICBUb2dnZ2xlIGEgQ1NTIGNsYXNzIHRvIHRyaWdnZXIgdHJhbnNpdGlvblxuICovXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25DbGFzcyAoZWwsIHN0YWdlLCBjaGFuZ2VTdGF0ZSwgaGFzQW5pbWF0aW9uKSB7XG5cbiAgICBpZiAoIWVuZEV2ZW50cy50cmFucykge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5DU1NfU0tJUFxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb24sXG4gICAgLy8gaXQgbXVzdCBoYXZlIGNsYXNzTGlzdC4uLlxuICAgIHZhciBvbkVuZCxcbiAgICAgICAgY2xhc3NMaXN0ICAgICAgICA9IGVsLmNsYXNzTGlzdCxcbiAgICAgICAgZXhpc3RpbmdDYWxsYmFjayA9IGVsLnZ1ZV90cmFuc19jYixcbiAgICAgICAgZW50ZXJDbGFzcyAgICAgICA9IGNvbmZpZy5lbnRlckNsYXNzLFxuICAgICAgICBsZWF2ZUNsYXNzICAgICAgID0gY29uZmlnLmxlYXZlQ2xhc3MsXG4gICAgICAgIGVuZEV2ZW50ICAgICAgICAgPSBoYXNBbmltYXRpb24gPyBlbmRFdmVudHMuYW5pbSA6IGVuZEV2ZW50cy50cmFuc1xuXG4gICAgLy8gY2FuY2VsIHVuZmluaXNoZWQgY2FsbGJhY2tzIGFuZCBqb2JzXG4gICAgaWYgKGV4aXN0aW5nQ2FsbGJhY2spIHtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgZXhpc3RpbmdDYWxsYmFjaylcbiAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShlbnRlckNsYXNzKVxuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGxlYXZlQ2xhc3MpXG4gICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoc3RhZ2UgPiAwKSB7IC8vIGVudGVyXG5cbiAgICAgICAgLy8gc2V0IHRvIGVudGVyIHN0YXRlIGJlZm9yZSBhcHBlbmRpbmdcbiAgICAgICAgY2xhc3NMaXN0LmFkZChlbnRlckNsYXNzKVxuICAgICAgICAvLyBhcHBlbmRcbiAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICAvLyB0cmlnZ2VyIHRyYW5zaXRpb25cbiAgICAgICAgaWYgKCFoYXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGJhdGNoZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGVudGVyQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoZW50ZXJDbGFzcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZClcbiAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG9uRW5kXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGVzLkNTU19FXG5cbiAgICB9IGVsc2UgeyAvLyBsZWF2ZVxuXG4gICAgICAgIGlmIChlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQpIHtcbiAgICAgICAgICAgIC8vIHRyaWdnZXIgaGlkZSB0cmFuc2l0aW9uXG4gICAgICAgICAgICBjbGFzc0xpc3QuYWRkKGxlYXZlQ2xhc3MpXG4gICAgICAgICAgICBvbkVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBlbCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZClcbiAgICAgICAgICAgICAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAvLyBhY3R1YWxseSByZW1vdmUgbm9kZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShsZWF2ZUNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGF0dGFjaCB0cmFuc2l0aW9uIGVuZCBsaXN0ZW5lclxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpXG4gICAgICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBvbkVuZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGlyZWN0bHkgcmVtb3ZlIGludmlzaWJsZSBlbGVtZW50c1xuICAgICAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2Rlcy5DU1NfTFxuICAgICAgICBcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRnVuY3Rpb25zIChlbCwgc3RhZ2UsIGNoYW5nZVN0YXRlLCBlZmZlY3RJZCwgY29tcGlsZXIpIHtcblxuICAgIHZhciBmdW5jcyA9IGNvbXBpbGVyLmdldE9wdGlvbignZWZmZWN0cycsIGVmZmVjdElkKVxuICAgIGlmICghZnVuY3MpIHtcbiAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICByZXR1cm4gY29kZXMuSlNfU0tJUFxuICAgIH1cblxuICAgIHZhciBlbnRlciA9IGZ1bmNzLmVudGVyLFxuICAgICAgICBsZWF2ZSA9IGZ1bmNzLmxlYXZlLFxuICAgICAgICB0aW1lb3V0cyA9IGVsLnZ1ZV90aW1lb3V0c1xuXG4gICAgLy8gY2xlYXIgcHJldmlvdXMgdGltZW91dHNcbiAgICBpZiAodGltZW91dHMpIHtcbiAgICAgICAgdmFyIGkgPSB0aW1lb3V0cy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgY2xlYXJUTyh0aW1lb3V0c1tpXSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRpbWVvdXRzID0gZWwudnVlX3RpbWVvdXRzID0gW11cbiAgICBmdW5jdGlvbiB0aW1lb3V0IChjYiwgZGVsYXkpIHtcbiAgICAgICAgdmFyIGlkID0gc2V0VE8oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2IoKVxuICAgICAgICAgICAgdGltZW91dHMuc3BsaWNlKHRpbWVvdXRzLmluZGV4T2YoaWQpLCAxKVxuICAgICAgICAgICAgaWYgKCF0aW1lb3V0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlbC52dWVfdGltZW91dHMgPSBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGRlbGF5KVxuICAgICAgICB0aW1lb3V0cy5wdXNoKGlkKVxuICAgIH1cblxuICAgIGlmIChzdGFnZSA+IDApIHsgLy8gZW50ZXJcbiAgICAgICAgaWYgKHR5cGVvZiBlbnRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICAgICAgcmV0dXJuIGNvZGVzLkpTX1NLSVBfRVxuICAgICAgICB9XG4gICAgICAgIGVudGVyKGVsLCBjaGFuZ2VTdGF0ZSwgdGltZW91dClcbiAgICAgICAgcmV0dXJuIGNvZGVzLkpTX0VcbiAgICB9IGVsc2UgeyAvLyBsZWF2ZVxuICAgICAgICBpZiAodHlwZW9mIGxlYXZlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgICAgICByZXR1cm4gY29kZXMuSlNfU0tJUF9MXG4gICAgICAgIH1cbiAgICAgICAgbGVhdmUoZWwsIGNoYW5nZVN0YXRlLCB0aW1lb3V0KVxuICAgICAgICByZXR1cm4gY29kZXMuSlNfTFxuICAgIH1cblxufVxuXG4vKipcbiAqICBTbmlmZiBwcm9wZXIgdHJhbnNpdGlvbiBlbmQgZXZlbnQgbmFtZVxuICovXG5mdW5jdGlvbiBzbmlmZkVuZEV2ZW50cyAoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndnVlJyksXG4gICAgICAgIGRlZmF1bHRFdmVudCA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgZXZlbnRzID0ge1xuICAgICAgICAgICAgJ3dlYmtpdFRyYW5zaXRpb24nIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAgICAgJ3RyYW5zaXRpb24nICAgICAgIDogZGVmYXVsdEV2ZW50LFxuICAgICAgICAgICAgJ21velRyYW5zaXRpb24nICAgIDogZGVmYXVsdEV2ZW50XG4gICAgICAgIH0sXG4gICAgICAgIHJldCA9IHt9XG4gICAgZm9yICh2YXIgbmFtZSBpbiBldmVudHMpIHtcbiAgICAgICAgaWYgKGVsLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldC50cmFucyA9IGV2ZW50c1tuYW1lXVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXQuYW5pbSA9IGVsLnN0eWxlLmFuaW1hdGlvbiA9PT0gJydcbiAgICAgICAgPyAnYW5pbWF0aW9uZW5kJ1xuICAgICAgICA6ICd3ZWJraXRBbmltYXRpb25FbmQnXG4gICAgcmV0dXJuIHJldFxufVxuXG4vLyBFeHBvc2Ugc29tZSBzdHVmZiBmb3IgdGVzdGluZyBwdXJwb3Nlc1xudHJhbnNpdGlvbi5jb2RlcyA9IGNvZGVzXG50cmFuc2l0aW9uLnNuaWZmID0gc25pZmZFbmRFdmVudHMiLCJ2YXIgY29uZmlnICAgICAgID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICB0b1N0cmluZyAgICAgPSAoe30pLnRvU3RyaW5nLFxuICAgIHdpbiAgICAgICAgICA9IHdpbmRvdyxcbiAgICBjb25zb2xlICAgICAgPSB3aW4uY29uc29sZSxcbiAgICBkZWYgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgT0JKRUNUICAgICAgID0gJ29iamVjdCcsXG4gICAgVEhJU19SRSAgICAgID0gL1teXFx3XXRoaXNbXlxcd10vLFxuICAgIEJSQUNLRVRfUkVfUyA9IC9cXFsnKFteJ10rKSdcXF0vZyxcbiAgICBCUkFDS0VUX1JFX0QgPSAvXFxbXCIoW15cIl0rKVwiXFxdL2csXG4gICAgaGFzQ2xhc3NMaXN0ID0gJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgIFZpZXdNb2RlbCAvLyBsYXRlIGRlZlxuXG52YXIgZGVmZXIgPVxuICAgIHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW4ud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgd2luLnNldFRpbWVvdXRcblxuLyoqXG4gKiAgTm9ybWFsaXplIGtleXBhdGggd2l0aCBwb3NzaWJsZSBicmFja2V0cyBpbnRvIGRvdCBub3RhdGlvbnNcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplS2V5cGF0aCAoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKCdbJykgPCAwXG4gICAgICAgID8ga2V5XG4gICAgICAgIDoga2V5LnJlcGxhY2UoQlJBQ0tFVF9SRV9TLCAnLiQxJylcbiAgICAgICAgICAgICAucmVwbGFjZShCUkFDS0VUX1JFX0QsICcuJDEnKVxufVxuXG52YXIgdXRpbHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8qKlxuICAgICAqICBDb252ZXJ0IGEgc3RyaW5nIHRlbXBsYXRlIHRvIGEgZG9tIGZyYWdtZW50XG4gICAgICovXG4gICAgdG9GcmFnbWVudDogcmVxdWlyZSgnLi9mcmFnbWVudCcpLFxuXG4gICAgLyoqXG4gICAgICogIFBhcnNlIHRoZSB2YXJpb3VzIHR5cGVzIG9mIHRlbXBsYXRlIG9wdGlvbnNcbiAgICAgKi9cbiAgICBwYXJzZVRlbXBsYXRlT3B0aW9uOiByZXF1aXJlKCcuL3RlbXBsYXRlLXBhcnNlci5qcycpLFxuXG4gICAgLyoqXG4gICAgICogIGdldCBhIHZhbHVlIGZyb20gYW4gb2JqZWN0IGtleXBhdGhcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICBrZXkgPSBub3JtYWxpemVLZXlwYXRoKGtleSlcbiAgICAgICAgaWYgKGtleS5pbmRleE9mKCcuJykgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqW2tleV1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IGtleS5zcGxpdCgnLicpLFxuICAgICAgICAgICAgZCA9IC0xLCBsID0gcGF0aC5sZW5ndGhcbiAgICAgICAgd2hpbGUgKCsrZCA8IGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgIG9iaiA9IG9ialtwYXRoW2RdXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHNldCBhIHZhbHVlIHRvIGFuIG9iamVjdCBrZXlwYXRoXG4gICAgICovXG4gICAgc2V0OiBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICBrZXkgPSBub3JtYWxpemVLZXlwYXRoKGtleSlcbiAgICAgICAgaWYgKGtleS5pbmRleE9mKCcuJykgPCAwKSB7XG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhdGggPSBrZXkuc3BsaXQoJy4nKSxcbiAgICAgICAgICAgIGQgPSAtMSwgbCA9IHBhdGgubGVuZ3RoIC0gMVxuICAgICAgICB3aGlsZSAoKytkIDwgbCkge1xuICAgICAgICAgICAgaWYgKG9ialtwYXRoW2RdXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgb2JqW3BhdGhbZF1dID0ge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iaiA9IG9ialtwYXRoW2RdXVxuICAgICAgICB9XG4gICAgICAgIG9ialtwYXRoW2RdXSA9IHZhbFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgcmV0dXJuIHRoZSBiYXNlIHNlZ21lbnQgb2YgYSBrZXlwYXRoXG4gICAgICovXG4gICAgYmFzZUtleTogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5LmluZGV4T2YoJy4nKSA+IDBcbiAgICAgICAgICAgID8ga2V5LnNwbGl0KCcuJylbMF1cbiAgICAgICAgICAgIDoga2V5XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBDcmVhdGUgYSBwcm90b3R5cGUtbGVzcyBvYmplY3RcbiAgICAgKiAgd2hpY2ggaXMgYSBiZXR0ZXIgaGFzaC9tYXBcbiAgICAgKi9cbiAgICBoYXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBnZXQgYW4gYXR0cmlidXRlIGFuZCByZW1vdmUgaXQuXG4gICAgICovXG4gICAgYXR0cjogZnVuY3Rpb24gKGVsLCB0eXBlKSB7XG4gICAgICAgIHZhciBhdHRyID0gY29uZmlnLnByZWZpeCArICctJyArIHR5cGUsXG4gICAgICAgICAgICB2YWwgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cilcbiAgICAgICAgaWYgKHZhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgRGVmaW5lIGFuIGllbnVtZXJhYmxlIHByb3BlcnR5XG4gICAgICogIFRoaXMgYXZvaWRzIGl0IGJlaW5nIGluY2x1ZGVkIGluIEpTT04uc3RyaW5naWZ5XG4gICAgICogIG9yIGZvci4uLmluIGxvb3BzLlxuICAgICAqL1xuICAgIGRlZlByb3RlY3RlZDogZnVuY3Rpb24gKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUsIHdyaXRhYmxlKSB7XG4gICAgICAgIGRlZihvYmosIGtleSwge1xuICAgICAgICAgICAgdmFsdWUgICAgICAgIDogdmFsLFxuICAgICAgICAgICAgZW51bWVyYWJsZSAgIDogZW51bWVyYWJsZSxcbiAgICAgICAgICAgIHdyaXRhYmxlICAgICA6IHdyaXRhYmxlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQSBsZXNzIGJ1bGxldC1wcm9vZiBidXQgbW9yZSBlZmZpY2llbnQgdHlwZSBjaGVja1xuICAgICAqICB0aGFuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAgICAgKi9cbiAgICBpc09iamVjdDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gT0JKRUNUICYmIG9iaiAmJiAhQXJyYXkuaXNBcnJheShvYmopXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBBIG1vcmUgYWNjdXJhdGUgYnV0IGxlc3MgZWZmaWNpZW50IHR5cGUgY2hlY2tcbiAgICAgKi9cbiAgICBpc1RydWVPYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIE1vc3Qgc2ltcGxlIGJpbmRcbiAgICAgKiAgZW5vdWdoIGZvciB0aGUgdXNlY2FzZSBhbmQgZmFzdCB0aGFuIG5hdGl2ZSBiaW5kKClcbiAgICAgKi9cbiAgICBiaW5kOiBmdW5jdGlvbiAoZm4sIGN0eCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoY3R4LCBhcmcpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIE1ha2Ugc3VyZSBudWxsIGFuZCB1bmRlZmluZWQgb3V0cHV0IGVtcHR5IHN0cmluZ1xuICAgICAqL1xuICAgIGd1YXJkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UsIGVxbnVsbDogdHJ1ZSAqL1xuICAgICAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgOiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpXG4gICAgICAgICAgICAgICAgOiB2YWx1ZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgV2hlbiBzZXR0aW5nIHZhbHVlIG9uIHRoZSBWTSwgcGFyc2UgcG9zc2libGUgbnVtYmVyc1xuICAgICAqL1xuICAgIGNoZWNrTnVtYmVyOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpXG4gICAgICAgICAgICA/IHZhbHVlXG4gICAgICAgICAgICA6IE51bWJlcih2YWx1ZSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHNpbXBsZSBleHRlbmRcbiAgICAgKi9cbiAgICBleHRlbmQ6IGZ1bmN0aW9uIChvYmosIGV4dCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZXh0KSB7XG4gICAgICAgICAgICBpZiAob2JqW2tleV0gIT09IGV4dFtrZXldKSB7XG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBleHRba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIGZpbHRlciBhbiBhcnJheSB3aXRoIGR1cGxpY2F0ZXMgaW50byB1bmlxdWVzXG4gICAgICovXG4gICAgdW5pcXVlOiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHZhciBoYXNoID0gdXRpbHMuaGFzaCgpLFxuICAgICAgICAgICAgaSA9IGFyci5sZW5ndGgsXG4gICAgICAgICAgICBrZXksIHJlcyA9IFtdXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGtleSA9IGFycltpXVxuICAgICAgICAgICAgaWYgKGhhc2hba2V5XSkgY29udGludWVcbiAgICAgICAgICAgIGhhc2hba2V5XSA9IDFcbiAgICAgICAgICAgIHJlcy5wdXNoKGtleSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBDb252ZXJ0IHRoZSBvYmplY3QgdG8gYSBWaWV3TW9kZWwgY29uc3RydWN0b3JcbiAgICAgKiAgaWYgaXQgaXMgbm90IGFscmVhZHkgb25lXG4gICAgICovXG4gICAgdG9Db25zdHJ1Y3RvcjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBWaWV3TW9kZWwgPSBWaWV3TW9kZWwgfHwgcmVxdWlyZSgnLi92aWV3bW9kZWwnKVxuICAgICAgICByZXR1cm4gdXRpbHMuaXNPYmplY3Qob2JqKVxuICAgICAgICAgICAgPyBWaWV3TW9kZWwuZXh0ZW5kKG9iailcbiAgICAgICAgICAgIDogdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgID8gb2JqXG4gICAgICAgICAgICAgICAgOiBudWxsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBDaGVjayBpZiBhIGZpbHRlciBmdW5jdGlvbiBjb250YWlucyByZWZlcmVuY2VzIHRvIGB0aGlzYFxuICAgICAqICBJZiB5ZXMsIG1hcmsgaXQgYXMgYSBjb21wdXRlZCBmaWx0ZXIuXG4gICAgICovXG4gICAgY2hlY2tGaWx0ZXI6IGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgaWYgKFRISVNfUkUudGVzdChmaWx0ZXIudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgIGZpbHRlci5jb21wdXRlZCA9IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgY29udmVydCBjZXJ0YWluIG9wdGlvbiB2YWx1ZXMgdG8gdGhlIGRlc2lyZWQgZm9ybWF0LlxuICAgICAqL1xuICAgIHByb2Nlc3NPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgY29tcG9uZW50cyA9IG9wdGlvbnMuY29tcG9uZW50cyxcbiAgICAgICAgICAgIHBhcnRpYWxzICAgPSBvcHRpb25zLnBhcnRpYWxzLFxuICAgICAgICAgICAgdGVtcGxhdGUgICA9IG9wdGlvbnMudGVtcGxhdGUsXG4gICAgICAgICAgICBmaWx0ZXJzICAgID0gb3B0aW9ucy5maWx0ZXJzLFxuICAgICAgICAgICAga2V5XG4gICAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBjb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1trZXldID0gdXRpbHMudG9Db25zdHJ1Y3Rvcihjb21wb25lbnRzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRpYWxzKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBwYXJ0aWFscykge1xuICAgICAgICAgICAgICAgIHBhcnRpYWxzW2tleV0gPSB1dGlscy5wYXJzZVRlbXBsYXRlT3B0aW9uKHBhcnRpYWxzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5jaGVja0ZpbHRlcihmaWx0ZXJzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICBvcHRpb25zLnRlbXBsYXRlID0gdXRpbHMucGFyc2VUZW1wbGF0ZU9wdGlvbih0ZW1wbGF0ZSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgdXNlZCB0byBkZWZlciBiYXRjaCB1cGRhdGVzXG4gICAgICovXG4gICAgbmV4dFRpY2s6IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBkZWZlcihjYiwgMClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIGFkZCBjbGFzcyBmb3IgSUU5XG4gICAgICogIHVzZXMgY2xhc3NMaXN0IGlmIGF2YWlsYWJsZVxuICAgICAqL1xuICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICBpZiAoaGFzQ2xhc3NMaXN0KSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNscylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjdXIgPSAnICcgKyBlbC5jbGFzc05hbWUgKyAnICdcbiAgICAgICAgICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IChjdXIgKyBjbHMpLnRyaW0oKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICByZW1vdmUgY2xhc3MgZm9yIElFOVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICBpZiAoaGFzQ2xhc3NMaXN0KSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNscylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjdXIgPSAnICcgKyBlbC5jbGFzc05hbWUgKyAnICcsXG4gICAgICAgICAgICAgICAgdGFyID0gJyAnICsgY2xzICsgJyAnXG4gICAgICAgICAgICB3aGlsZSAoY3VyLmluZGV4T2YodGFyKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgY3VyID0gY3VyLnJlcGxhY2UodGFyLCAnICcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBjdXIudHJpbSgpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENvbnZlcnQgYW4gb2JqZWN0IHRvIEFycmF5XG4gICAgICogIHVzZWQgaW4gdi1yZXBlYXQgYW5kIGFycmF5IGZpbHRlcnNcbiAgICAgKi9cbiAgICBvYmplY3RUb0FycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSwgdmFsLCBkYXRhXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIHZhbCA9IG9ialtrZXldXG4gICAgICAgICAgICBkYXRhID0gdXRpbHMuaXNPYmplY3QodmFsKVxuICAgICAgICAgICAgICAgID8gdmFsXG4gICAgICAgICAgICAgICAgOiB7ICR2YWx1ZTogdmFsIH1cbiAgICAgICAgICAgIGRhdGEuJGtleSA9IGtleVxuICAgICAgICAgICAgcmVzLnB1c2goZGF0YSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxufVxuXG5lbmFibGVEZWJ1ZygpXG5mdW5jdGlvbiBlbmFibGVEZWJ1ZyAoKSB7XG4gICAgLyoqXG4gICAgICogIGxvZyBmb3IgZGVidWdnaW5nXG4gICAgICovXG4gICAgdXRpbHMubG9nID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZiAoY29uZmlnLmRlYnVnICYmIGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiAgd2FybmluZ3MsIHRyYWNlcyBieSBkZWZhdWx0XG4gICAgICogIGNhbiBiZSBzdXBwcmVzc2VkIGJ5IGBzaWxlbnRgIG9wdGlvbi5cbiAgICAgKi9cbiAgICB1dGlscy53YXJuID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZiAoIWNvbmZpZy5zaWxlbnQgJiYgY29uc29sZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZylcbiAgICAgICAgICAgIGlmIChjb25maWcuZGVidWcgJiYgY29uc29sZS50cmFjZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsInZhciBDb21waWxlciAgID0gcmVxdWlyZSgnLi9jb21waWxlcicpLFxuICAgIHV0aWxzICAgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbicpLFxuICAgIEJhdGNoZXIgICAgPSByZXF1aXJlKCcuL2JhdGNoZXInKSxcbiAgICBzbGljZSAgICAgID0gW10uc2xpY2UsXG4gICAgZGVmICAgICAgICA9IHV0aWxzLmRlZlByb3RlY3RlZCxcbiAgICBuZXh0VGljayAgID0gdXRpbHMubmV4dFRpY2ssXG5cbiAgICAvLyBiYXRjaCAkd2F0Y2ggY2FsbGJhY2tzXG4gICAgd2F0Y2hlckJhdGNoZXIgPSBuZXcgQmF0Y2hlcigpLFxuICAgIHdhdGNoZXJJZCAgICAgID0gMVxuXG4vKipcbiAqICBWaWV3TW9kZWwgZXhwb3NlZCB0byB0aGUgdXNlciB0aGF0IGhvbGRzIGRhdGEsXG4gKiAgY29tcHV0ZWQgcHJvcGVydGllcywgZXZlbnQgaGFuZGxlcnNcbiAqICBhbmQgYSBmZXcgcmVzZXJ2ZWQgbWV0aG9kc1xuICovXG5mdW5jdGlvbiBWaWV3TW9kZWwgKG9wdGlvbnMpIHtcbiAgICAvLyBjb21waWxlIGlmIG9wdGlvbnMgcGFzc2VkLCBpZiBmYWxzZSByZXR1cm4uIG9wdGlvbnMgYXJlIHBhc3NlZCBkaXJlY3RseSB0byBjb21waWxlclxuICAgIGlmIChvcHRpb25zID09PSBmYWxzZSkgcmV0dXJuXG4gICAgbmV3IENvbXBpbGVyKHRoaXMsIG9wdGlvbnMpXG59XG5cbi8vIEFsbCBWTSBwcm90b3R5cGUgbWV0aG9kcyBhcmUgaW5lbnVtZXJhYmxlXG4vLyBzbyBpdCBjYW4gYmUgc3RyaW5naWZpZWQvbG9vcGVkIHRocm91Z2ggYXMgcmF3IGRhdGFcbnZhciBWTVByb3RvID0gVmlld01vZGVsLnByb3RvdHlwZVxuXG4vKipcbiAqICBpbml0IGFsbG93cyBjb25maWcgY29tcGlsYXRpb24gYWZ0ZXIgaW5zdGFudGlhdGlvbjpcbiAqICAgIHZhciBhID0gbmV3IFZ1ZShmYWxzZSlcbiAqICAgIGEuaW5pdChjb25maWcpXG4gKi9cbmRlZihWTVByb3RvLCAnJGluaXQnLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG5ldyBDb21waWxlcih0aGlzLCBvcHRpb25zKVxufSlcblxuLyoqXG4gKiAgQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ2V0IGEgdmFsdWUgZnJvbVxuICogIGEga2V5cGF0aFxuICovXG5kZWYoVk1Qcm90bywgJyRnZXQnLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHZhbCA9IHV0aWxzLmdldCh0aGlzLCBrZXkpXG4gICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkICYmIHRoaXMuJHBhcmVudFxuICAgICAgICA/IHRoaXMuJHBhcmVudC4kZ2V0KGtleSlcbiAgICAgICAgOiB2YWxcbn0pXG5cbi8qKlxuICogIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIHNldCBhbiBhY3R1YWwgbmVzdGVkIHZhbHVlXG4gKiAgZnJvbSBhIGZsYXQga2V5IHN0cmluZy4gVXNlZCBpbiBkaXJlY3RpdmVzLlxuICovXG5kZWYoVk1Qcm90bywgJyRzZXQnLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHV0aWxzLnNldCh0aGlzLCBrZXksIHZhbHVlKVxufSlcblxuLyoqXG4gKiAgd2F0Y2ggYSBrZXkgb24gdGhlIHZpZXdtb2RlbCBmb3IgY2hhbmdlc1xuICogIGZpcmUgY2FsbGJhY2sgd2l0aCBuZXcgdmFsdWVcbiAqL1xuZGVmKFZNUHJvdG8sICckd2F0Y2gnLCBmdW5jdGlvbiAoa2V5LCBjYWxsYmFjaykge1xuICAgIC8vIHNhdmUgYSB1bmlxdWUgaWQgZm9yIGVhY2ggd2F0Y2hlclxuICAgIHZhciBpZCA9IHdhdGNoZXJJZCsrLFxuICAgICAgICBzZWxmID0gdGhpc1xuICAgIGZ1bmN0aW9uIG9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgd2F0Y2hlckJhdGNoZXIucHVzaCh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIGV4ZWN1dGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBjYWxsYmFjay5fZm4gPSBvblxuICAgIHNlbGYuJGNvbXBpbGVyLm9ic2VydmVyLm9uKCdjaGFuZ2U6JyArIGtleSwgb24pXG59KVxuXG4vKipcbiAqICB1bndhdGNoIGEga2V5XG4gKi9cbmRlZihWTVByb3RvLCAnJHVud2F0Y2gnLCBmdW5jdGlvbiAoa2V5LCBjYWxsYmFjaykge1xuICAgIC8vIHdvcmthcm91bmQgaGVyZVxuICAgIC8vIHNpbmNlIHRoZSBlbWl0dGVyIG1vZHVsZSBjaGVja3MgY2FsbGJhY2sgZXhpc3RlbmNlXG4gICAgLy8gYnkgY2hlY2tpbmcgdGhlIGxlbmd0aCBvZiBhcmd1bWVudHNcbiAgICB2YXIgYXJncyA9IFsnY2hhbmdlOicgKyBrZXldLFxuICAgICAgICBvYiA9IHRoaXMuJGNvbXBpbGVyLm9ic2VydmVyXG4gICAgaWYgKGNhbGxiYWNrKSBhcmdzLnB1c2goY2FsbGJhY2suX2ZuKVxuICAgIG9iLm9mZi5hcHBseShvYiwgYXJncylcbn0pXG5cbi8qKlxuICogIHVuYmluZCBldmVyeXRoaW5nLCByZW1vdmUgZXZlcnl0aGluZ1xuICovXG5kZWYoVk1Qcm90bywgJyRkZXN0cm95JywgZnVuY3Rpb24gKG5vUmVtb3ZlKSB7XG4gICAgdGhpcy4kY29tcGlsZXIuZGVzdHJveShub1JlbW92ZSlcbn0pXG5cbi8qKlxuICogIGJyb2FkY2FzdCBhbiBldmVudCB0byBhbGwgY2hpbGQgVk1zIHJlY3Vyc2l2ZWx5LlxuICovXG5kZWYoVk1Qcm90bywgJyRicm9hZGNhc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy4kY29tcGlsZXIuY2hpbGRyZW4sXG4gICAgICAgIGkgPSBjaGlsZHJlbi5sZW5ndGgsXG4gICAgICAgIGNoaWxkXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICAgIGNoaWxkLmVtaXR0ZXIuYXBwbHlFbWl0LmFwcGx5KGNoaWxkLmVtaXR0ZXIsIGFyZ3VtZW50cylcbiAgICAgICAgY2hpbGQudm0uJGJyb2FkY2FzdC5hcHBseShjaGlsZC52bSwgYXJndW1lbnRzKVxuICAgIH1cbn0pXG5cbi8qKlxuICogIGVtaXQgYW4gZXZlbnQgdGhhdCBwcm9wYWdhdGVzIGFsbCB0aGUgd2F5IHVwIHRvIHBhcmVudCBWTXMuXG4gKi9cbmRlZihWTVByb3RvLCAnJGRpc3BhdGNoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21waWxlciA9IHRoaXMuJGNvbXBpbGVyLFxuICAgICAgICBlbWl0dGVyID0gY29tcGlsZXIuZW1pdHRlcixcbiAgICAgICAgcGFyZW50ID0gY29tcGlsZXIucGFyZW50XG4gICAgZW1pdHRlci5hcHBseUVtaXQuYXBwbHkoZW1pdHRlciwgYXJndW1lbnRzKVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnZtLiRkaXNwYXRjaC5hcHBseShwYXJlbnQudm0sIGFyZ3VtZW50cylcbiAgICB9XG59KVxuXG4vKipcbiAqICBkZWxlZ2F0ZSBvbi9vZmYvb25jZSB0byB0aGUgY29tcGlsZXIncyBlbWl0dGVyXG4gKi9cbjtbJ2VtaXQnLCAnb24nLCAnb2ZmJywgJ29uY2UnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAvLyBpbnRlcm5hbCBlbWl0IGhhcyBmaXhlZCBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgIC8vIGV4cG9zZWQgZW1pdCB1c2VzIHRoZSBleHRlcm5hbCB2ZXJzaW9uXG4gICAgLy8gd2l0aCBmbi5hcHBseS5cbiAgICB2YXIgcmVhbE1ldGhvZCA9IG1ldGhvZCA9PT0gJ2VtaXQnXG4gICAgICAgID8gJ2FwcGx5RW1pdCdcbiAgICAgICAgOiBtZXRob2RcbiAgICBkZWYoVk1Qcm90bywgJyQnICsgbWV0aG9kLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy4kY29tcGlsZXIuZW1pdHRlclxuICAgICAgICBlbWl0dGVyW3JlYWxNZXRob2RdLmFwcGx5KGVtaXR0ZXIsIGFyZ3VtZW50cylcbiAgICB9KVxufSlcblxuLy8gRE9NIGNvbnZlbmllbmNlIG1ldGhvZHNcblxuZGVmKFZNUHJvdG8sICckYXBwZW5kVG8nLCBmdW5jdGlvbiAodGFyZ2V0LCBjYikge1xuICAgIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICAgICAgICBpZiAoY2IpIG5leHRUaWNrKGNiKVxuICAgIH0sIHRoaXMuJGNvbXBpbGVyKVxufSlcblxuZGVmKFZNUHJvdG8sICckcmVtb3ZlJywgZnVuY3Rpb24gKGNiKSB7XG4gICAgdmFyIGVsID0gdGhpcy4kZWxcbiAgICB0cmFuc2l0aW9uKGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2IpIG5leHRUaWNrKGNiKVxuICAgIH0sIHRoaXMuJGNvbXBpbGVyKVxufSlcblxuZGVmKFZNUHJvdG8sICckYmVmb3JlJywgZnVuY3Rpb24gKHRhcmdldCwgY2IpIHtcbiAgICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gICAgdmFyIGVsID0gdGhpcy4kZWxcbiAgICB0cmFuc2l0aW9uKGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0KVxuICAgICAgICBpZiAoY2IpIG5leHRUaWNrKGNiKVxuICAgIH0sIHRoaXMuJGNvbXBpbGVyKVxufSlcblxuZGVmKFZNUHJvdG8sICckYWZ0ZXInLCBmdW5jdGlvbiAodGFyZ2V0LCBjYikge1xuICAgIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRhcmdldC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQubmV4dFNpYmxpbmcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2IpIG5leHRUaWNrKGNiKVxuICAgIH0sIHRoaXMuJGNvbXBpbGVyKVxufSlcblxuZnVuY3Rpb24gcXVlcnkgKGVsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBlbCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgICAgICA6IGVsXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld01vZGVsXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBWdWUgPSByZXF1aXJlKCd2dWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICAgICAgUm91dGUgcGFyYW1zXG4gICAgICAgIFVzZWQgYnkgdGhlIHJvdXRlciBhbmQgdGhlIGN1c3RvbSB2LXZpZXdcbiAgICAgICAgaWQ6IHBhZ2Ugc2x1Z1xuICAgICAgICB0cmFuc2l0aW9uTW9kZTogdGltaW5nIChzZWUgdmlldyBmb3IgaW5mb3MpXG4gICAgICAgIHBhcmFtczogaW5qZWN0ZWQgYnkgdGhlIHZpZXcgZnJvbSByb3V0ZXIgaW5mb3NcbiAgICAqL1xuICAgIHJvdXRlOiB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgdHJhbnNpdGlvbk1vZGU6ICdvdXRBbmRBZnRlckluJyxcbiAgICAgICAgcGFyYW1zOiB7fVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgICAvKlxuICAgICAgICAgICAgUFVCTElDIEFQSVxuICAgICAgICAgICAgT3ZlcnJpZGFibGUgYmVoYXZpb3JcbiAgICAgICAgKi9cblxuICAgICAgICAvKlxuICAgICAgICAgICAgQ2FuIGJlIG92ZXJyaWRlbiBpZiB0aGUgc2VjdGlvbnMgdHJhbnNpdGlvbiBuZWVkcyB0byBiZSBkaWZmZXJlbnQgZGVwZW5kaW5nIG9uIHRoZSBwcmV2aW91cyByb3V0ZS4gSGFuZGxlIHdpdGggY2FyZSAhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRUcmFuc2l0aW9uTW9kZTogZnVuY3Rpb24ocHJldmlvdXNSb3V0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJG9wdGlvbnMucm91dGUudHJhbnNpdGlvbk1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIFN0YXJ0cyB0aGUgdHJhbnNpdGlvbkluLCBvdmVycmlkZSBpdCBpZiB5b3UgbmVlZCB0byBwbGF5IHNvbWV0aGluZyBlbHNlIHRoYW4gdGhlIGRlZmF1bHQgVGltZWxpbmUgZGVwZW5kaW5nIG9uIHByZXZpb3VzIHJvdXRlLlxuICAgICAgICAgICAgZXg6XG4gICAgICAgICAgICAgICAgaWYocHJldmlvdXNSb3V0ZSAmJiBwcmV2aW91c1JvdXRlLmlkID09PSAnaG9tZScpIHRoaXMudGxUcmFuc2l0aW9uLnBsYXkoKTtcbiAgICAgICAgICAgICAgICBlbHNlIFR3ZWVuTWF4LmZyb21Ubyh0aGlzLiRlbCwgMSwge2FscGhhOiAwfSwge2FscGhhOiAxLCBvbkNvbXBsZXRlOiB0aGlzLm9uVHJhbnNpdGlvbkluQ29tcGxldGUsIG9uQ29tcGxldGVTY29wZTogdGhpc30pO1xuICAgICAgICAqL1xuICAgICAgICBwbGF5VHJhbnNpdGlvbkluOiBmdW5jdGlvbihwcmV2aW91c1JvdXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VjdGlvbiAtIHBsYXlUcmFuc2l0aW9uSW4nKTtcbiAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uLnBsYXkoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgU3RhcnRzIHRoZSB0cmFuc2l0aW9uT3V0LCBvdmVycmlkZSBpdCBpZiB5b3UgbmVlZCB0byBwbGF5IHNvbWV0aGluZyBlbHNlIHRoYW4gdGhlIGRlZmF1bHQgVGltZWxpbmUgZGVwZW5kaW5nIG9uIG5leHQgcm91dGUuXG4gICAgICAgICovXG4gICAgICAgIHBsYXlUcmFuc2l0aW9uT3V0OiBmdW5jdGlvbihuZXh0Um91dGUpIHtcbiAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uLnJldmVyc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgQWxsb3cgdG8gcmVzaXplIGFuZCBtYW5pcHVsYXRlIHRoZSBET00gYmVmb3JlIGNyZWF0aW5nIHRoZSB0cmFuc2l0aW9uc1xuICAgICAgICAqL1xuICAgICAgICBiZWZvcmVUcmFuc2l0aW9uSW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2VjdGlvbl0gLSBZb3UgbmVlZCB0byBvdmVycmlkZSBzZWN0aW9uLmJlZm9yZVRyYW5zaXRpb25JbjonLCB0aGlzLiRvcHRpb25zLnJvdXRlLmlkKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgQ3JlYXRlIHRoZSBkaWZmZXJlbnQgdHdlZW4gaW50byB0aGUgdHJhbnNpdGlvbkluL091dCBUaW1lbGluZXNcbiAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0VHdlZW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NlY3Rpb25dIC0gWW91IG5lZWQgdG8gb3ZlcnJpZGUgc2VjdGlvbi5pbnNlcnRUd2VlbnM6JywgdGhpcy4kb3B0aW9ucy5yb3V0ZS5pZCk7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNCwge29wYWNpdHk6IDB9LCB7b3BhY2l0eTogMX0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBQUklWQVRFIEFQSVxuICAgICAgICAgICAgSW50ZXJuYWwgYmVoYXZpb3JcbiAgICAgICAgKi9cbiAgICAgICAgdHJhbnNpdGlvbkluOiBmdW5jdGlvbihwcmV2aW91c1JvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgdGhpcy5wbGF5VHJhbnNpdGlvbkluKHByZXZpb3VzUm91dGUpO1xuICAgICAgICB9LFxuICAgICAgICBvblRyYW5zaXRpb25JbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3NlY3Rpb246dHJhbnNpdGlvbkluQ29tcGxldGUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNpdGlvbk91dDogZnVuY3Rpb24obmV4dFJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlUcmFuc2l0aW9uT3V0KG5leHRSb3V0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVHJhbnNpdGlvbk91dENvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3NlY3Rpb246dHJhbnNpdGlvbk91dENvbXBsZXRlJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZVRpbWVsaW5lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uID0gbmV3IFRpbWVsaW5lTWF4KHtcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLm9uVHJhbnNpdGlvbkluQ29tcGxldGUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzLFxuICAgICAgICAgICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiB0aGlzLm9uVHJhbnNpdGlvbk91dENvbXBsZXRlLFxuICAgICAgICAgICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6IHRoaXMsXG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb25PdXQgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMub25UcmFuc2l0aW9uT3V0Q29tcGxldGUsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVNjb3BlOiB0aGlzLFxuICAgICAgICAgICAgICAgIHBhdXNlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWN0aW9uIC0gY3JlYXRlVGltZWxpbmUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNpdGlvbnNSZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290LiRlbWl0KCdzZWN0aW9uOnRyYW5zaXRpb25zUmVhZHknKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWN0aW9uIC0gdHJhbnNpdGlvbnNSZWFkeScpO1xuICAgICAgICB9LFxuICAgICAgICBhZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZVRyYW5zaXRpb25JbigpOyAvLyBPdmVycmlkZSB0aGF0IGJpdGNoXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVRpbWVsaW5lKCk7XG4gICAgICAgICAgICB0aGlzLmluc2VydFR3ZWVucygpOyAvLyBPdmVycmlkZSB0aGlzXG5cbiAgICAgICAgICAgIFZ1ZS5uZXh0VGljayh0aGlzLnRyYW5zaXRpb25zUmVhZHkuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cbiAgICAgICAgdGhpcy4kb25jZSgnaG9vazphZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVnVlLm5leHRUaWNrKHRoaXMuYWRkZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJG9uY2UoJ2hvb2s6cm91dGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSB3YW50IHRvIGhhbmRsZSBwcmVsb2FkIG9yIHByb21pc2VzIHJlc29sdmluZ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRvbmNlKCdob29rOmJlZm9yZURlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKHRoaXMudGxUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24ua2lsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGxUcmFuc2l0aW9uT3V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb25PdXQua2lsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uT3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIFZpZXdcbiAgICBFbmhhbmNlZCB2LXZpZXcgYWxsb3dpbmcgdG8gbWFuYWdlIHRpbWluZyBiZXR3ZWVuIHRyYW5zaXRpb25zXG4gICAgLSB0cmFuc2l0aW9uIEluIHRoZW4gT3V0LFxuICAgIC0gdHJhbnNpdGlvbiBJbiBhbmQgT3V0IHRvZ2V0aGVyLFxuICAgIC0gdHJhbnNpdGlvbiBJbiBvbmx5XG4gKi9cblxudmFyIFR3ZWVuTWF4ID0gcmVxdWlyZSgnVHdlZW5NYXgnKSxcbiAgICBWdWUgPSByZXF1aXJlKCd2dWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICAgICAgT3JpZ2luIHYtdmlldyAtIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIHZ1ZSByZXBvXG4gICAgKi9cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRyYWNrIHBvc2l0aW9uIGluIERPTSB3aXRoIGEgcmVmIG5vZGVcbiAgICAgICAgdmFyIGVsICAgICAgID0gdGhpcy5yYXcgPSB0aGlzLmVsLFxuICAgICAgICAgICAgcGFyZW50ICAgPSBlbC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgcmVmICAgICAgPSB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3B3LXZpZXcnKTtcbiAgICAgICAgaWYoIXBhcmVudCkgcmV0dXJuO1xuXG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUocmVmLCBlbCk7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbCk7XG5cbiAgICAgICAgLy8gY2FjaGUgb3JpZ2luYWwgY29udGVudFxuICAgICAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgICAgICB2YXIgbm9kZSxcbiAgICAgICAgICAgIGZyYWcgPSB0aGlzLmlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHdoaWxlIChub2RlID0gZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZtLiRvbignc2VjdGlvbjp0cmFuc2l0aW9uc1JlYWR5JywgdGhpcy5vblRyYW5zaXRpb25SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZighdGhpcy5pbm5lciB8fCB0aGlzLmlzVHJhbnNpdGlvbm5pbmcgfHwgIXZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgdmFyIEN0b3IgID0gdGhpcy5jb21waWxlci5nZXRPcHRpb24oJ2NvbXBvbmVudHMnLCB2YWx1ZSk7XG4gICAgICAgIGlmICghQ3RvcikgcmV0dXJuO1xuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0gPSB0aGlzLmNoaWxkVk07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5leHRDaGlsZFZNID0gbmV3IEN0b3Ioe1xuICAgICAgICAgICAgZWw6IHRoaXMucmF3LmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICAgIHBhcmVudDogdGhpcy52bSxcbiAgICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHJhd0NvbnRlbnQ6IHRoaXMuaW5uZXIuY2xvbmVOb2RlKHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCByb3V0ZXIgcGFyYW1zIHRvIG5leHRDaGlsZFZNXG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0uJG9wdGlvbnMucm91dGUucGFyYW1zID0gdGhpcy52bS5jb250ZXh0LnBhcmFtcztcblxuICAgICAgICAvLyBSb3V0aW5nIHBhcmFtcyBldmVudFxuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRlbWl0KCdob29rOnJvdXRlZCcpO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIG5leHRDaGlsZFZNICYgcHJldmlvdXNDaGlsZFZNIGFyZSB0cmFuc2l0aW9uIGNvbXBhdGlibGUsIGlmIG5vdCB0aHJvdyBlcnJvclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5uZXh0Q2hpbGRWTS4kZWw7XG4gICAgICAgIGlmICh0aGlzLmNvbXBpbGVyLmluaXQpIHtcbiAgICAgICAgICAgIHRoaXMucmVmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuZWwsIHRoaXMucmVmKTtcbiAgICAgICAgICAgIFZ1ZS5uZXh0VGljayh0aGlzLnZpZXdNb2RlbEFkZGVkLmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kYmVmb3JlKHRoaXMucmVmLCB0aGlzLnZpZXdNb2RlbEFkZGVkLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkVk0pIHRoaXMuY2hpbGRWTS4kZGVzdHJveSgpO1xuICAgICAgICBpZiAodGhpcy5uZXh0Q2hpbGRWTSkgdGhpcy5uZXh0Q2hpbGRWTS4kZGVzdHJveSgpO1xuICAgICAgICBpZiAodGhpcy5wcmV2aW91c0NoaWxkVk0pIHRoaXMucHJldmlvdXNDaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIFRyYW5zaXRpb24gdGltaW5ncyBzdHVmZlxuICAgICovXG5cbiAgICB2aWV3TW9kZWxBZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0uJGVtaXQoJ2hvb2s6YWRkZWQnKTtcbiAgICB9LFxuXG4gICAgb25UcmFuc2l0aW9uUmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZighdGhpcy5uZXh0Q2hpbGRWTSkgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZpZXcgLSBvblRyYW5zaXRpb25SZWFkeVwiKTtcblxuICAgICAgICB0aGlzLnRyYW5zaXRpb24oKTtcbiAgICB9LFxuXG4gICAgdHJhbnNpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW9ubmluZyA9IHRydWU7XG4gICAgICAgIGlmKHRoaXMucHJldmlvdXNDaGlsZFZNKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZpZXcgLSB0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMubmV4dENoaWxkVk0uZ2V0VHJhbnNpdGlvbk1vZGUodGhpcy5wcmV2aW91c0NoaWxkVk0uJG9wdGlvbnMucm91dGUpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5BbmRBZnRlck91dCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkluQW5kQWZ0ZXJPdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5BbmRPdXRUb2dldGhlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkluQW5kT3V0VG9nZXRoZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndHJhbnNpdGlvbkluT25seSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkluT25seSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25PdXRBbmRBZnRlckluKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5Pbmx5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdHJhbnNpdGlvbkluT25seTogZnVuY3Rpb24ocHJldmlvdXNSb3V0ZSkge1xuICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0uJG9uY2UoJ3NlY3Rpb246dHJhbnNpdGlvbkluQ29tcGxldGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLnRyYW5zaXRpb25JbihwcmV2aW91c1JvdXRlKTtcbiAgICB9LFxuXG4gICAgdHJhbnNpdGlvbk91dEFuZEFmdGVySW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmV4dFJvdXRlID0gdGhpcy5uZXh0Q2hpbGRWTS4kb3B0aW9ucy5yb3V0ZTtcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJG9uY2UoJ3NlY3Rpb246dHJhbnNpdGlvbk91dENvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AoKTtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Jbk9ubHkodGhpcy5wcmV2aW91c0NoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS50cmFuc2l0aW9uT3V0KHRoaXMubmV4dENoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgIH0sXG5cbiAgICB0cmFuc2l0aW9uSW5BbmRBZnRlck91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AoKTtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kb25jZSgnc2VjdGlvbjp0cmFuc2l0aW9uSW5Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb24oJ3NlY3Rpb246dHJhbnNpdGlvbk91dENvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0udHJhbnNpdGlvbk91dCh0aGlzLm5leHRDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS50cmFuc2l0aW9uSW4odGhpcy5wcmV2aW91c0NoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgIH0sXG5cbiAgICB0cmFuc2l0aW9uSW5BbmRPdXRUb2dldGhlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AoKTtcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJG9uY2UoJ3NlY3Rpb246dHJhbnNpdGlvbk91dENvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0udHJhbnNpdGlvbk91dCh0aGlzLm5leHRDaGlsZFZNLiRvcHRpb25zLnJvdXRlKTtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS50cmFuc2l0aW9uSW4odGhpcy5wcmV2aW91c0NoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgIH0sXG5cbiAgICBzY3JvbGxUb1RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIFR3ZWVuTWF4LnNldCh3aW5kb3csIHtzY3JvbGxUbzoge3k6IDAsIHg6IDB9fSk7XG4gICAgfSxcblxuICAgIG9uVHJhbnNpdGlvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hpbGRWTSA9IHRoaXMubmV4dENoaWxkVk07XG4gICAgICAgIGlmKHRoaXMucHJldmlvdXNDaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNID0gbnVsbDtcbiAgICAgICAgdGhpcy52bS4kZW1pdCgndmlldzp0cmFuc2l0aW9uQ29tcGxldGUnKTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIEZsYWdzIGFsbG93aW5nIHRvIHJlcXVpcmUvYWN0aXZhdGUgZGlmZmVyZW50c1xuICAgIHBhcnRzIG9mIHRoZSBhcHAuXG5cbiAgICBFeGFtcGxlOiByZXF1aXJlIHZ1ZS1kZWJ1Zywgc2V0IFRpbWVsaW5lIHRvIGZhc3QtZm9yd2FyZFxuICAgIGZvciBmYXN0ZXIgZGVidWcuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdnVlOiB0cnVlICBcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIE1vZGlmaWVkIHZ1ZS12aWV3cG9ydCBwbHVnaW5cbiAgICAodi1kZXRlY3Qtdmlld3BvcnQgZGlyZWN0aXZlKVxuICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9ob2xpYy92dWUtdmlld3BvcnRcblxuICAgIHRvIGFsbG93IHRvIHBhc3MgYW4gYXR0cmlidXRlIHRvIHRoZSBkaXJlY3RpdmVcbiAgICB2LXZpZXdwb3J0PVwidGhpbmdcIiwgYWxsb3dpbmcgdG8gcmVjb2duaXplIHdoaWNoXG4gICAgZWxlbWVudHMgdHJpZ2dlcmVkIHRoZSB2aWV3cG9ydCBldmVudCwgd2hlbiB1c2VkIG9uIG11bHRpcGxlcyBldmVudHMuXG4gKi9cblxudmFyIGRpcmVjdGl2ZXMgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnZtLiRvbignaG9vazphdHRhY2hlZCcsIG5vdGlmeUFsbCk7XG4gICAgICAgIHRoaXMudm0uJG9uKCdob29rOmRldGFjaGVkJywgbm90aWZ5QWxsKTtcblxuICAgICAgICBpZiAoZGlyZWN0aXZlcy5pbmRleE9mKHRoaXMpID09PSAtMSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlcy5wdXNoKHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnZtLiRvZmYoJ2hvb2s6YXR0YWNoZWQnLCBub3RpZnlBbGwpO1xuICAgICAgICB0aGlzLnZtLiRvZmYoJ2hvb2s6ZGV0YWNoZWQnLCBub3RpZnlBbGwpO1xuXG4gICAgICAgIHZhciBpbmRleCA9IGRpcmVjdGl2ZXMuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGRpcmVjdGl2ZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsKSB7XG4gICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gcmVjdC5ib3R0b20gPiAwICYmIHJlY3QucmlnaHQgPiAwICYmIHJlY3QudG9wIDwgKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAmJiByZWN0LmxlZnQgPCAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKTtcbn1cblxuZnVuY3Rpb24gbm90aWZ5IChkaXJlY3RpdmUpIHtcbiAgICBpZiAoIWRpcmVjdGl2ZS5lbCkgcmV0dXJuO1xuXG4gICAgdmFyIGluVmlld3BvcnQgPSBpc0VsZW1lbnRJblZpZXdwb3J0KGRpcmVjdGl2ZS5lbCk7XG4gICAgaWYgKGRpcmVjdGl2ZS5pblZpZXdwb3J0ID09PSBudWxsIHx8IGRpcmVjdGl2ZS5pblZpZXdwb3J0ICE9PSBpblZpZXdwb3J0KSB7XG4gICAgICAgIGRpcmVjdGl2ZS5pblZpZXdwb3J0ID0gaW5WaWV3cG9ydDtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGluVmlld3BvcnQgPyAnZW50ZXInIDogJ2xlYXZlJztcbiAgICAgICAgZGlyZWN0aXZlLnZtLiRlbWl0KCd2aWV3cG9ydCcgKyBkaXJlY3Rpb24sIHtlbDogZGlyZWN0aXZlLmVsLCBhdHRyOiBkaXJlY3RpdmUua2V5fSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBub3RpZnlBbGwgKCkge1xuICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChub3RpZnkpO1xufVxuXG5bJ0RPTUNvbnRlbnRMb2FkZWQnLCAnbG9hZCcsICdzY3JvbGwnLCAncmVzaXplJywgJ3BvcHN0YXRlJ10uZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbm90aWZ5QWxsLCBmYWxzZSk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gICAgSU1QT1JUU1xuXG4gICAgSG9sZGFsbCBmb3IgcGx1Z2lucyBhbmQgY29uZlxuICAgIHRvIGF2b2lkIHBvbGx1dGluZyB0aGUgbWFpbi5cbiAqL1xuXG52YXIgVnVlID0gcmVxdWlyZSgndnVlJyksXG4gICAgZGVidWcgPSByZXF1aXJlKCd2dWUtZGVidWcnKSxcbiAgICBxdWVyeSA9IHJlcXVpcmUoJ3Z1ZS1xdWVyeScpLFxuICAgIGVsID0gcmVxdWlyZSgndnVlLWVsJyksXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCcuL2NvbW1vbi9kaXJlY3RpdmVzL3ZpZXdwb3J0LmpzJyksXG4gICAgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpLFxuICAgIGRlYnVnQXBwID0gcmVxdWlyZSgnLi9jb21tb24vZGVidWcuanMnKTtcblxuLypcbiAgICBUd2Vlbk1heFxuKi9cbnJlcXVpcmUoJ1R3ZWVuTWF4LlNjcm9sbFRvUGx1Z2luJyk7IC8vIEFkZCBzY3JvbGxUb1BsdWdpbiB0byBUd2Vlbk1heFxuVHdlZW5MaXRlLmRlZmF1bHRFYXNlID0gRXhwby5lYXNlT3V0OyAvLyBTbyBJIGRvbid0IGhhdmUgdG8gd3JpdGUgaXQgZXZlcnkgdGltZVxuXG4vKlxuICAgIFZ1ZSBwbHVnaW5zXG4gKi9cbmlmKGRlYnVnQXBwKSBWdWUudXNlKGRlYnVnKTsgLy8gQWRkIFZ1ZS5sb2cgbWV0aG9kXG5WdWUudXNlKGVsKTsgLy8gdi1lbCBkaXJlY3RpdmUgdG8gYXZvaWQgc2VsZWN0aW5nIG5vZGVzIGluIEpTXG5WdWUudXNlKHF1ZXJ5KTsgLy8gQWRkIHRoaXMuJGZpbmRPbmUsIHRoaXMuJGZpbmQsIHRoaXMuYWRkL3JlbW92ZUNsYXNzIHRvIGFueSBWdWUgaW5zdGFuY2VcblZ1ZS5kaXJlY3RpdmUoJ3ZpZXdwb3J0JywgcmVxdWlyZSgnLi9jb21tb24vZGlyZWN0aXZlcy92aWV3cG9ydCcpKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBWdWUgPSByZXF1aXJlKCd2dWUnKSxcbiAgICBwYWdlID0gcmVxdWlyZSgncGFnZScpLFxuICAgIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpLFxuICAgIGZvckVhY2ggPSByZXF1aXJlKCdmb3JFYWNoJyksXG4gICAgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnY29tcG9uZW50LWVtaXR0ZXInKSxcbiAgICB2ZXJib3NlID0gdHJ1ZTtcblxuLypcbiAgICBSb3V0ZXIgYmFzZWQgb24gcGFnZS5qcyxcbiAgICBldmVudC1iYXNlZCwgbWFkZSB0byB3b3JrIHdpdGggdnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHtcbiAgICAvKlxuICAgICAgICBUaGlzIG9iamVjdCBpcyBkaXNwYXRjaGVkIG9uIGVhY2ggbG9jYXRpb25DaGFuZ2UuXG4gICAgICAgIEl0IGhvbGRzIHRoZSBjdXJyZW50IHBhdGgsIHRoZSByb3V0ZSBwYXJhbXMuLi5cbiAgICAgKi9cbiAgICBjb250ZXh0OiB7XG4gICAgICAgIHBhdGg6ICcnXG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIERlZmF1bHQgcm91dGUgKGNhbiBiZSBhIDQwNCwgb3IgdGhlIGluZGV4KVxuICAgICAqL1xuICAgIGRlZmF1bHRSb3V0ZTogJy8nLFxuXG4gICAgLypcbiAgICAgICAgUmVmZXJlbmNlIHRvIGFsbCB0aGUgcm91dGVzXG4gICAgKi9cbiAgICByb3V0ZUlkczogW10sXG5cbiAgICAvKlxuICAgICAgICBSZWdpc3RlcnMgdGhlIHJvdXRlIHdpdGggdGhlIHNwZWNpZmllZCBwYXRoL3BhdHRlcm4gKGV4cHJlc3MtbGlrZSByZWdleHApXG4gICAgICAgIHJvdXRlOiBpbmZvcyBhcyB7aWQ6IFwicm91dGUtaWRcIiwgcGF0aDogXCIvcm91dGVcIn0gb3Ige2lkOiBcInJvdXRlLWlkXCIsIHBhdGg6IFwiL3JvdXRlLzppZFwifVxuICAgICAqL1xuICAgIGFkZFJvdXRlOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICB0aGlzLnJvdXRlSWRzLnB1c2goe2lkOiByb3V0ZS5pZCwgcGF0aDogcm91dGUucGF0aH0pO1xuICAgICAgICBwYWdlKHJvdXRlLnBhdGgsIHRoaXMub25Sb3V0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYodmVyYm9zZSkgY29uc29sZS5kZWJ1ZygnW3JvdXRlcl0gYWRkIHJvdXRlIFwiJyArIHJvdXRlLnBhdGggKyAnXCInKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgVXBkYXRlcyB0aGUgZGVmYXVsdCByb3V0ZS5cbiAgICAgICAgVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBhbGwgcm91dGVzIHdlcmUgYWRkZWQsXG4gICAgICAgIGJlY2F1c2UgaXQgc3RhcnRzIHRoZSByb3V0aW5nLlxuICAgICAqL1xuICAgIHNldERlZmF1bHRSb3V0ZTogZnVuY3Rpb24oZGVmYXVsdFJvdXRlKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFJvdXRlID0gZGVmYXVsdFJvdXRlO1xuICAgICAgICBwYWdlKCcqJywgdGhpcy5vbkRlZmF1bHRSb3V0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBTdGFydHMgdGhlIHJvdXRlci5cbiAgICAgICAgT25seSBuZWVkZWQgdG8gY2FsbCBpZiB5b3UgZGlkbid0IGNhbGxlZCBgc2V0RGVmYXVsdFJvdXRlYC5cbiAgICAgKi9cbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5lbWl0KCdyb3V0ZXI6c3RhcnQnKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgSW50ZXJuYWwgbWV0aG9kLlxuICAgICAgICBVcGRhdGVzIHRoZSBjb250ZXh0IGFuZCBhbWl0IHRoZSBgcm91dGVyOnVwZGF0ZWAgZXZlbnQuXG4gICAgICovXG4gICAgb25Sb3V0ZTogZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICB0aGlzLmNvbnRleHQucGFyYW1zID0gY29udGV4dC5wYXJhbXM7XG4gICAgICAgIHRoaXMuY29udGV4dC5pZCA9IHRoaXMuZ2V0Q3VycmVudFJvdXRlSWQoY29udGV4dC5wYXRoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LnBhdGggPSBjb250ZXh0LnBhdGg7XG5cbiAgICAgICAgaWYodmVyYm9zZSkgY29uc29sZS5kZWJ1ZygnW3JvdXRlcl0gb25Sb3V0ZScsIHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuZW1pdCgncm91dGVyOnVwZGF0ZScsIHRoaXMuY29udGV4dCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIENhbGxlZCB3aGVuIHRoZSByZXF1ZXN0ZWQgcm91dGUgZG9lcyBub3QgZXhpc3RzXG4gICAgICAgIFJlZGlyZWN0cyB0byBwcm9wZXIgZGVmYXVsdCByb3V0ZVxuICAgICAqL1xuICAgIG9uRGVmYXVsdFJvdXRlOiBmdW5jdGlvbihjKSB7XG4gICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sICcnLCAnLycgKyB0aGlzLmRlZmF1bHRSb3V0ZSk7XG4gICAgICAgICAgICBwYWdlKCcvJyArIHRoaXMuZGVmYXVsdFJvdXRlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZ2V0Q3VycmVudFJvdXRlSWQ6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIG1hdGNoLCBpZDtcbiAgICAgICAgZm9yRWFjaCh0aGlzLnJvdXRlSWRzLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpe1xuICAgICAgICAgICAgbWF0Y2ggPSBwYXRoLm1hdGNoKG5ldyBSZWdFeHAoKHZhbHVlLnBhdGgucmVwbGFjZSgvOlthLXpdKy9nLCAnW2Etei1dKycpKS5yZXBsYWNlKC9cXC8vZywgJ1xcXFwvJyksICdnJykpO1xuICAgICAgICAgICAgaWYobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlkID0gdmFsdWUuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIE1hbnVhbGx5IHNldCB0aGUgcGF0aC5cbiAgICAgICAgQWxsb3cgdG8gcHJlc3MgdGhlIGBiYWNrYC9gZm9yd2FyZGAgYnV0dG9uc1xuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICBwYWdlLnNob3cocGF0aCwgbnVsbCwgZmFsc2UpO1xuICAgIH1cbn0sIG5ldyBFdmVudEVtaXR0ZXIoKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGEgY2xhc3M9XFxcIm5hbWUtYnV0dG9uXFxcIiBocmVmPVxcXCJ7e3VybH19XFxcIiB2LW9uPVxcXCJtb3VzZW92ZXI6IG9uTW91c2VPdmVyLCBtb3VzZW91dDogb25Nb3VzZU91dFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcIm5hbWVcXFwiIHYtZWw9XFxcIm5hbWVcXFwiPnt7cHJvamVjdC5hdXRob3J9fTwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCIgdi1lbD1cXFwidGl0bGVcXFwiPnt7cHJvamVjdC50aXRsZX19PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImxpbmVcXFwiIHYtZWw9XFxcImxpbmVcXFwiPjwvZGl2PlxcbjwvYT5cIjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIGJpbmRBbGwgPSByZXF1aXJlKCdiaW5kYWxsLXN0YW5kYWxvbmUnKVxuICAgIFR3ZWVuTWF4ID0gcmVxdWlyZSgnVHdlZW5NYXgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vbmFtZUJ1dHRvbi5odG1sJyksXG4gICAgbWV0aG9kczoge1xuICAgICAgICBvbk1vdXNlT3ZlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ29uTW91c2VPdmVyJyk7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLm5hbWUsIDAuNiwge3g6IDAsIGNvbG9yOiAnIzAwN2RhYycsIGVhc2U6IEV4cG8uZWFzZU91dH0pO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC50aXRsZSwgMC42LCB7YWxwaGE6IDEsIHg6IDAsIGVhc2U6IEV4cG8uZWFzZU91dH0pO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC5saW5lLCAxLCB7c2NhbGVYOiAxLCBlYXNlOiBFeHBvLmVhc2VPdXR9KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Nb3VzZU91dDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC5uYW1lLCAwLjYsIHt4OiB0aGlzLiQkLnRpdGxlLm9mZnNldFdpZHRoICogMC41LCBjb2xvcjogJyMzMzMnLCBlYXNlOiBFeHBvLmVhc2VPdXR9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQudGl0bGUsIDAuNiwge2FscGhhOiAwLCB4OiB0aGlzLiQkLnRpdGxlLm9mZnNldFdpZHRoICogMC41LCBlYXNlOiBFeHBvLmVhc2VPdXQgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLmxpbmUsIDEsIHtzY2FsZVg6IDAsIGVhc2U6IEV4cG8uZWFzZU91dH0pO1xuICAgICAgICB9LFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLiQkLm5hbWUsIHt4OiB0aGlzLiQkLnRpdGxlLm9mZnNldFdpZHRoICogMC41fSk7XG4gICAgICAgICAgICBUd2Vlbk1heC5zZXQodGhpcy4kJC50aXRsZSwge3g6IHRoaXMuJCQudGl0bGUub2Zmc2V0V2lkdGggKiAwLjV9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnVybCA9ICdwcm9qZWN0LycgKyB0aGlzLnByb2plY3QuaWQ7XG4gICAgICAgIGJpbmRBbGwodGhpcywgJ2luaXQnKTtcbiAgICAgICAgVnVlLm5leHRUaWNrKHRoaXMuaW5pdCk7XG4gICAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IFwiV29ya3Nob3AgYnkgPGEgaHJlZj1cXFwiaHR0cDovL2d1aWxsYXVtZWdvdWVzc2FuLmNvbVxcXCI+IEd1aWxsYXVtZSBHb3Vlc3NhbiA8L2E+IGZvciA8YSBocmVmPVxcXCJodHRwOi8vZ29iZWxpbnMuZnJcXFwiPiBHb2JlbGlucyBTY2hvb2wgPC9hPiBDUk1BIDIwMTUgc3R1ZGVudHMsIFBhcmlzIDIwMTQuXCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2Zvb3Rlci5odG1sJyksXG4gICAgY29tcG9uZW50czoge1xuXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gXCI8aDIgdi1lbD1cXFwidGl0bGVcXFwiPkNSTUEgMjAxNTwvaDI+XFxuPGgzIGlkPVxcXCJzdWJ0aXRsZVxcXCIgdi1lbD1cXFwic3VidGl0bGVcXFwiPkNyZWF0aXZlIENvZGluZyBXb3Jrc2hvcCAtIFRocmVlLmpzPC9oMz5cIjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vaGVhZGVyLmh0bWwnKSxcbiAgICBtZXRob2RzOiB7XG5cbiAgICB9LFxuICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0YXJ0VGltZSA9IDAuODtcbiAgICAgICAgdmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KCk7XG4gICAgICAgIHRsLmZyb20odGhpcy4kJC5zdWJ0aXRsZSwgMC42LCB7eTogLTIwLCBhbHBoYTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgc3RhcnRUaW1lICsgMC4wKTtcbiAgICAgICAgdGwuZnJvbSh0aGlzLiQkLnRpdGxlLCAwLjYsIHt5OiAtMjAsIGFscGhhOiAwLCBlYXNlOiBFeHBvLmVhc2VPdXR9LCBzdGFydFRpbWUgKyAwLjEpO1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcImFib3V0XFxcIj5cXG4gICAgPGgyPlBhdGNod29yayBhYm91dDwvaDI+XFxuICAgIDxwPkxvb2tzIGxpa2UgaXQncyB3b3JraW5nIC0gPGEgaHJlZj1cXFwiL2hvbWVcXFwiPmhvbWU8L2E+PC9wPlxcbjwvZGl2PlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgc2VjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYmFzZS9zZWN0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCBzZWN0aW9uLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYWJvdXQuaHRtbCcpLFxuICAgIHJvdXRlOiB7XG4gICAgICAgIGlkOiAnYWJvdXQnLFxuICAgICAgICB0cmFuc2l0aW9uTW9kZTogJ291dEFuZEFmdGVySW4nLFxuICAgICAgICBwYXRoOiAnL2Fib3V0J1xuICAgIH0sXG4gICAgZGF0YToge1xuXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNywge2FscGhhOiAwLCB5OiA1MH0sIHthbHBoYTogMSwgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgMC40KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJob21lXFxcIj5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpIHYtcmVwZWF0PVxcXCJwcm9qZWN0OnByb2plY3RzXFxcIiB2LWVsPVxcXCJsaW5rc1xcXCIgdi1jb21wb25lbnQ9XFxcIm5hbWVCdXR0b25cXFwiIHYtd2l0aD1cXFwicHJvamVjdFxcXCI+PC9saT5cXG4gICAgPC91bD5cXG48L2Rpdj5cIjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZCcpLFxuICAgIHNlY3Rpb24gPSByZXF1aXJlKCcuLy4uLy4uLy4uL2Jhc2Uvc2VjdGlvbi5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCh0cnVlLCB7fSwgc2VjdGlvbiwge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2hvbWUuaHRtbCcpLFxuICAgIHJvdXRlOiB7XG4gICAgICAgIGlkOiAnaG9tZScsXG4gICAgICAgIHRyYW5zaXRpb25Nb2RlOiAnb3V0QW5kQWZ0ZXJJbicsXG4gICAgICAgIHBhdGg6ICcvaG9tZSdcbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgICAgcHJvamVjdHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzAnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0Nsw6ltZW50IEJhcmRvbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBd2VmdWxseSBsb25nIHRpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ05pY29sYXMgQm9ubm90JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0tldmluIEJ1ZGFpbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdCZXJ0cmFuZCBDYXlsYScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdFdGllbm5lIENoYXVtb250JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0pvcmRhbiBEZWxjcm9zJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0rDqXLDqW1pZSBEZXZvb3MnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnTMOpb25hcmQgSGV0c2NoJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1NhbXVlbCBIb25pZ3N0ZWluJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0xvcnkgSHV6JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0d1aWxsYXVtZSBKYXNtaW4nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnVGhvbWFzIEpvc3NlYXUnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnQW50b25pbiBMYW5nbGFkZScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdLYXRpYSBNb3JlaXJhJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0xvdWlzZSBPYsOpJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0plYW4tQmFwdGlzdGUgUGVucmF0aCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdTeWx2YWluIFJldWNoZXJhbmQnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2xlbm4gU29ubmEnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnQWxleGlzIFRlc3NpZXInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2VvZmZyZXkgVGhlbm90JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNywge2FscGhhOiAwLCB5OiA1MH0sIHthbHBoYTogMSwgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgMC40KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcbiJdfQ==
