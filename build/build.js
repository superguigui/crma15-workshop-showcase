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

},{"./base/view.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/base/view.js","./imports":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/imports.js","./router":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/router.js","./views/components/nameButton/nameButton":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/components/nameButton/nameButton.js","./views/layout/footer/footer":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/layout/footer/footer.js","./views/sections/about/about":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/about/about.js","./views/sections/home/home":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/home/home.js","TweenMax":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/TweenMax.min.js","vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/bindall-standalone/index.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/component-emitter/index.js":[function(require,module,exports){

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

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/extend/index.js":[function(require,module,exports){
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


},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/foreach.js/dist/foreach.min.js":[function(require,module,exports){
(function (global){
;__browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*! foreach.js v1.1.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/foreach */
var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};
; browserify_shim__define__module__export__(typeof forEach != "undefined" ? forEach : window.forEach);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/TweenMax.min.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/plugins/ScrollToPlugin.min.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/page/index.js":[function(require,module,exports){

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

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-debug/src/index.js":[function(require,module,exports){
'use strict';

module.exports = function(Vue, options) {
    Vue.log = require('./log')(Vue);
};
},{"./log":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-debug/src/log.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-debug/src/log.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-el/index.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-query/index.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/batcher.js":[function(require,module,exports){
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
},{"./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/binding.js":[function(require,module,exports){
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
},{"./batcher":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/batcher.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/compiler.js":[function(require,module,exports){
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
},{"./binding":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/binding.js","./config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js","./deps-parser":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/deps-parser.js","./directive":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directive.js","./emitter":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/emitter.js","./exp-parser":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/exp-parser.js","./observer":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/observer.js","./text-parser":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/text-parser.js","./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js":[function(require,module,exports){
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
},{"./text-parser":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/text-parser.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/deps-parser.js":[function(require,module,exports){
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
},{"./emitter":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/emitter.js","./observer":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/observer.js","./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directive.js":[function(require,module,exports){
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
},{"./text-parser":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/text-parser.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/html.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/if.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/index.js":[function(require,module,exports){
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
},{"../config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js","../transition":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/transition.js","../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js","./html":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/html.js","./if":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/if.js","./model":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/model.js","./on":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/on.js","./partial":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/partial.js","./repeat":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/repeat.js","./style":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/style.js","./view":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/view.js","./with":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/with.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/model.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/on.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/partial.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/repeat.js":[function(require,module,exports){
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
},{"../config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js","../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/style.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/view.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/with.js":[function(require,module,exports){
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
},{"../utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/emitter.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/exp-parser.js":[function(require,module,exports){
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
},{"./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/filters.js":[function(require,module,exports){
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
},{"./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/fragment.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js":[function(require,module,exports){
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
},{"./config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js","./directives":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directives/index.js","./filters":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/filters.js","./observer":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/observer.js","./transition":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/transition.js","./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/observer.js":[function(require,module,exports){
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
},{"./emitter":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/emitter.js","./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/template-parser.js":[function(require,module,exports){
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

},{"./fragment":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/fragment.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/text-parser.js":[function(require,module,exports){
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
},{"./directive":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/directive.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/transition.js":[function(require,module,exports){
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
},{"./batcher":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/batcher.js","./config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js":[function(require,module,exports){
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
},{"./config":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/config.js","./fragment":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/fragment.js","./template-parser.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/template-parser.js","./viewmodel":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/viewmodel.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/viewmodel.js":[function(require,module,exports){
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

},{"./batcher":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/batcher.js","./compiler":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/compiler.js","./transition":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/transition.js","./utils":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/utils.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/base/section.js":[function(require,module,exports){
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

},{"vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/base/view.js":[function(require,module,exports){
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

},{"TweenMax":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/TweenMax.min.js","vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/common/debug.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/common/directives/viewport.js":[function(require,module,exports){
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
},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/imports.js":[function(require,module,exports){
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
},{"./common/debug.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/common/debug.js","./common/directives/viewport":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/common/directives/viewport.js","./common/directives/viewport.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/common/directives/viewport.js","TweenMax":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/TweenMax.min.js","TweenMax.ScrollToPlugin":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/plugins/ScrollToPlugin.min.js","vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js","vue-debug":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-debug/src/index.js","vue-el":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-el/index.js","vue-query":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue-query/index.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/router.js":[function(require,module,exports){
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

},{"component-emitter":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/component-emitter/index.js","extend":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/extend/index.js","forEach":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/foreach.js/dist/foreach.min.js","page":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/page/index.js","vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/components/nameButton/nameButton.html":[function(require,module,exports){
module.exports = "<a class=\"name-button\" href=\"{{url}}\" v-on=\"mouseover: onMouseOver, mouseout: onMouseOut\">\n    <div class=\"name\" v-el=\"name\">{{project.author}}</div>\n    <div class=\"title\" v-el=\"title\">{{project.title}}</div>\n    <div class=\"line\" v-el=\"line\"></div>\n</a>";

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/components/nameButton/nameButton.js":[function(require,module,exports){
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
},{"./nameButton.html":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/components/nameButton/nameButton.html","TweenMax":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/greensock/src/minified/TweenMax.min.js","bindall-standalone":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/bindall-standalone/index.js","vue":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/vue/src/main.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/layout/footer/footer.html":[function(require,module,exports){
module.exports = "Workshop by <a href=\"http://guillaumegouessan.com\"> Guillaume Gouessan </a> for <a href=\"http://gobelins.fr\"> Gobelins School </a> CRMA 2015 students, Paris 2014.";

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/layout/footer/footer.js":[function(require,module,exports){
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
},{"./footer.html":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/layout/footer/footer.html"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/about/about.html":[function(require,module,exports){
module.exports = "<div class=\"about\">\n    <h2>Patchwork about</h2>\n    <p>Looks like it's working - <a href=\"/home\">home</a></p>\n</div>";

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/about/about.js":[function(require,module,exports){
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

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/base/section.js","./about.html":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/about/about.html","extend":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/extend/index.js"}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/home/home.html":[function(require,module,exports){
module.exports = "<div class=\"home\">\n    <h2>CRMA 2015</h2>\n    <h3 id=\"subtitle\">Creative Coding Workshop - Three.js</h3>\n    <ul>\n        <li v-repeat=\"project:projects\" v-component=\"nameButton\" v-with=\"project\"></li>\n    </ul>\n</div>";

},{}],"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/home/home.js":[function(require,module,exports){
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
                author: 'John Lennon',
                title: 'Awefully long title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '1',
                author: 'Georges Harrisson',
                title: 'Title'
            },
            {
                id: '2',
                author: 'Paul Macartney',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
                title: 'Title'
            },
            {
                id: '3',
                author: 'Ringo Star',
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

},{"./../../../base/section.js":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/base/section.js","./home.html":"/Users/guillaumegouessan/Sites/crma2015-workshop/src/views/sections/home/home.html","extend":"/Users/guillaumegouessan/Sites/crma2015-workshop/node_modules/extend/index.js"}]},{},["./src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvYmluZGFsbC1zdGFuZGFsb25lL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy9jb21wb25lbnQtZW1pdHRlci9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy9mb3JlYWNoLmpzL2Rpc3QvZm9yZWFjaC5taW4uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL2dyZWVuc29jay9zcmMvbWluaWZpZWQvVHdlZW5NYXgubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy9ncmVlbnNvY2svc3JjL21pbmlmaWVkL3BsdWdpbnMvU2Nyb2xsVG9QbHVnaW4ubWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy9wYWdlL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUtZGVidWcvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUtZGVidWcvc3JjL2xvZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlLWVsL2luZGV4LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUtcXVlcnkvaW5kZXguanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9iaW5kaW5nLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2NvbXBpbGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9kZXBzLXBhcnNlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmUuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvaWYuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pbmRleC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvb24uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9wYXJ0aWFsLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvc3R5bGUuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy92aWV3LmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9lbWl0dGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL2V4cC1wYXJzZXIuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9mcmFnbWVudC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy9tYWluLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL3RlbXBsYXRlLXBhcnNlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy90ZXh0LXBhcnNlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9ub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWxzLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL25vZGVfbW9kdWxlcy92dWUvc3JjL3ZpZXdtb2RlbC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9zcmMvYmFzZS9zZWN0aW9uLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL3NyYy9iYXNlL3ZpZXcuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL2NvbW1vbi9kZWJ1Zy5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9zcmMvY29tbW9uL2RpcmVjdGl2ZXMvdmlld3BvcnQuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL2ltcG9ydHMuanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL3JvdXRlci5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9zcmMvdmlld3MvY29tcG9uZW50cy9uYW1lQnV0dG9uL25hbWVCdXR0b24uaHRtbCIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9zcmMvdmlld3MvY29tcG9uZW50cy9uYW1lQnV0dG9uL25hbWVCdXR0b24uanMiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL3ZpZXdzL2xheW91dC9mb290ZXIvZm9vdGVyLmh0bWwiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL3ZpZXdzL2xheW91dC9mb290ZXIvZm9vdGVyLmpzIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL3NyYy92aWV3cy9zZWN0aW9ucy9hYm91dC9hYm91dC5odG1sIiwiL1VzZXJzL2d1aWxsYXVtZWdvdWVzc2FuL1NpdGVzL2NybWEyMDE1LXdvcmtzaG9wL3NyYy92aWV3cy9zZWN0aW9ucy9hYm91dC9hYm91dC5qcyIsIi9Vc2Vycy9ndWlsbGF1bWVnb3Vlc3Nhbi9TaXRlcy9jcm1hMjAxNS13b3Jrc2hvcC9zcmMvdmlld3Mvc2VjdGlvbnMvaG9tZS9ob21lLmh0bWwiLCIvVXNlcnMvZ3VpbGxhdW1lZ291ZXNzYW4vU2l0ZXMvY3JtYTIwMTUtd29ya3Nob3Avc3JjL3ZpZXdzL3NlY3Rpb25zL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Z0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBQYXRjaHdvcmsgLSBhIGd1bHAsIG5wbSwgdnVlLmpzLCBub2RlLXNhc3MgYm9pbGVycGxhdGUuXG4gICAgMjAxNCAtIEZsb3JpYW4gTW9yZWwsIEd1aWxsYXVtZSBHb3Vlc3NhblxuKi9cblxuLypcbiAgICBBcHAgZW50cnkgcG9pbnQuXG5cbiAgICBDcmVhdGVzIHRoZSB0b3AtbW9zdCB2aWV3bW9kZWwsXG4gICAgcmVnaXN0ZXJzIHRoZSByb3V0ZXMsXG4gICAgcmVnaXN0ZXJzIGFsbCBjb21wb25lbnRzLFxuICAgIGFuZCBzdGFydCBvbiBwYWdlIGxvYWQuXG4gKi9cblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIHJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyksXG4gICAgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpO1xuXG4vKlxuICAgIFBsdWdpbnMsIGxpYiBjb25maWcuLi5cbiAqL1xucmVxdWlyZSgnLi9pbXBvcnRzJyk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJ2JvZHknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjdXJyZW50UGFnZTogbnVsbCwgLy8gQ3VycmVudCBwYWdlIGlkLCB1c2VkIGJ5IHYtcHctdmlld1xuICAgICAgICAgICAgY29udGV4dDoge30gLy8gcmVmZXJlbmNlIHRvIHRoZSByb3V0ZXIgY29udGV4dFxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgIC8qIExBWU9VVCAqL1xuICAgICAgICAgICAgJ2Zvb3Rlcic6IHJlcXVpcmUoJy4vdmlld3MvbGF5b3V0L2Zvb3Rlci9mb290ZXInKSxcblxuICAgICAgICAgICAgLyogQ09NUE9ORU5UcyAqL1xuICAgICAgICAgICAgJ25hbWVCdXR0b24nOiByZXF1aXJlKCcuL3ZpZXdzL2NvbXBvbmVudHMvbmFtZUJ1dHRvbi9uYW1lQnV0dG9uJyksXG5cbiAgICAgICAgICAgIC8qIFBBR0VTICovXG4gICAgICAgICAgICAnaG9tZSc6IHJlcXVpcmUoJy4vdmlld3Mvc2VjdGlvbnMvaG9tZS9ob21lJyksXG4gICAgICAgICAgICAnYWJvdXQnOiByZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL2Fib3V0L2Fib3V0JylcblxuICAgICAgICAgICAgLyogQ09NTU9OICovXG5cbiAgICAgICAgfSxcblxuICAgICAgICBkaXJlY3RpdmVzOiB7XG4gICAgICAgICAgICAncHctdmlldyc6IHJlcXVpcmUoJy4vYmFzZS92aWV3LmpzJylcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByb3V0ZXIub24oJ3JvdXRlcjp1cGRhdGUnLCB0aGlzLm9uUm91dGVVcGRhdGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHJvdXRlci5hZGRSb3V0ZShyZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL2hvbWUvaG9tZScpLnJvdXRlKTtcbiAgICAgICAgICAgIHJvdXRlci5hZGRSb3V0ZShyZXF1aXJlKCcuL3ZpZXdzL3NlY3Rpb25zL2Fib3V0L2Fib3V0Jykucm91dGUpO1xuICAgICAgICAgICAgcm91dGVyLnNldERlZmF1bHRSb3V0ZSgnaG9tZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIG9uUm91dGVVcGRhdGU6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBjb250ZXh0LmlkO1xuICAgICAgICAgICAgICAgIHRoaXMuJHJvb3QuJGVtaXQoJyRyb3V0ZS51cGRhdGUnLCB0aGlzLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG53aW5kb3cub25sb2FkID0gaW5pdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYoIW9iamVjdCkgcmV0dXJuIGNvbnNvbGUud2FybignYmluZEFsbCByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQuJyk7XG5cbiAgICB2YXIgZnVuY3Rpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGlmIChmdW5jdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgZm9yICh2YXIgbWV0aG9kIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb2JqZWN0W21ldGhvZF0gPT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKG9iamVjdFttZXRob2RdKSA9PSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zLnB1c2gobWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmID0gZnVuY3Rpb25zW2ldO1xuICAgICAgICBvYmplY3RbZl0gPSBiaW5kKG9iamVjdFtmXSwgb2JqZWN0KTtcbiAgICB9XG59O1xuXG4vKlxuICAgIEZhc3RlciBiaW5kIHdpdGhvdXQgc3BlY2lmaWMtY2FzZSBjaGVja2luZy4gKHNlZSBodHRwczovL2NvZGVyd2FsbC5jb20vcC9vaTNqM3cpLlxuICAgIGJpbmRBbGwgaXMgb25seSBuZWVkZWQgZm9yIGV2ZW50cyBiaW5kaW5nIHNvIG5vIG5lZWQgdG8gbWFrZSBzbG93IGZpeGVzIGZvciBjb25zdHJ1Y3RvclxuICAgIG9yIHBhcnRpYWwgYXBwbGljYXRpb24uXG4qL1xuZnVuY3Rpb24gYmluZChmdW5jLCBjb250ZXh0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICB9O1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIW9iaiB8fCB0b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIGhhc19vd25fY29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuXHR2YXIgaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG5cdC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3Rcblx0aWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzX293bl9jb25zdHJ1Y3RvciAmJiAhaGFzX2lzX3Byb3BlcnR5X29mX21ldGhvZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuXHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gb2JqKSB7fVxuXG5cdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuXHRcdGRlZXAgPSB0YXJnZXQ7XG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuXHRcdC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHRpID0gMjtcblx0fSBlbHNlIGlmICgodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykgfHwgdGFyZ2V0ID09IG51bGwpIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzW2ldO1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAob3B0aW9ucyAhPSBudWxsKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbbmFtZV07XG5cdFx0XHRcdGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gY29weSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmIChkZWVwICYmIGNvcHkgJiYgKGlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG5cdFx0XHRcdFx0aWYgKGNvcHlJc0FycmF5KSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5ldmVyIG1vdmUgb3JpZ2luYWwgb2JqZWN0cywgY2xvbmUgdGhlbVxuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYnJpbmcgaW4gdW5kZWZpbmVkIHZhbHVlc1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldFtuYW1lXSA9IGNvcHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIG1vZGlmaWVkIG9iamVjdFxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuO19fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qISBmb3JlYWNoLmpzIHYxLjEuMCB8IChjKSAyMDE0IEB0b2RkbW90dG8gfCBodHRwczovL2dpdGh1Yi5jb20vdG9kZG1vdHRvL2ZvcmVhY2ggKi9cbnZhciBmb3JFYWNoPWZ1bmN0aW9uKHQsbyxyKXtpZihcIltvYmplY3QgT2JqZWN0XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKWZvcih2YXIgYyBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LGMpJiZvLmNhbGwocix0W2NdLGMsdCk7ZWxzZSBmb3IodmFyIGU9MCxsPXQubGVuZ3RoO2w+ZTtlKyspby5jYWxsKHIsdFtlXSxlLHQpfTtcbjsgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18odHlwZW9mIGZvckVhY2ggIT0gXCJ1bmRlZmluZWRcIiA/IGZvckVhY2ggOiB3aW5kb3cuZm9yRWFjaCk7XG5cbn0pLmNhbGwoZ2xvYmFsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZ1bmN0aW9uIGRlZmluZUV4cG9ydChleCkgeyBtb2R1bGUuZXhwb3J0cyA9IGV4OyB9KTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuO19fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qIVxuICogVkVSU0lPTjogMS4xNC4xXG4gKiBEQVRFOiAyMDE0LTEwLTE2XG4gKiBVUERBVEVTIEFORCBET0NTIEFUOiBodHRwOi8vd3d3LmdyZWVuc29jay5jb21cbiAqIFxuICogSW5jbHVkZXMgYWxsIG9mIHRoZSBmb2xsb3dpbmc6IFR3ZWVuTGl0ZSwgVHdlZW5NYXgsIFRpbWVsaW5lTGl0ZSwgVGltZWxpbmVNYXgsIEVhc2VQYWNrLCBDU1NQbHVnaW4sIFJvdW5kUHJvcHNQbHVnaW4sIEJlemllclBsdWdpbiwgQXR0clBsdWdpbiwgRGlyZWN0aW9uYWxSb3RhdGlvblBsdWdpblxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE0LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL3d3dy5ncmVlbnNvY2suY29tL3Rlcm1zX29mX3VzZS5odG1sIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICoqL1xudmFyIF9nc1Njb3BlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzfHx3aW5kb3c7KF9nc1Njb3BlLl9nc1F1ZXVlfHwoX2dzU2NvcGUuX2dzUXVldWU9W10pKS5wdXNoKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7X2dzU2NvcGUuX2dzRGVmaW5lKFwiVHdlZW5NYXhcIixbXCJjb3JlLkFuaW1hdGlvblwiLFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLFwiVHdlZW5MaXRlXCJdLGZ1bmN0aW9uKHQsZSxpKXt2YXIgcz1mdW5jdGlvbih0KXt2YXIgZSxpPVtdLHM9dC5sZW5ndGg7Zm9yKGU9MDtlIT09cztpLnB1c2godFtlKytdKSk7cmV0dXJuIGl9LHI9ZnVuY3Rpb24odCxlLHMpe2kuY2FsbCh0aGlzLHQsZSxzKSx0aGlzLl9jeWNsZT0wLHRoaXMuX3lveW89dGhpcy52YXJzLnlveW89PT0hMCx0aGlzLl9yZXBlYXQ9dGhpcy52YXJzLnJlcGVhdHx8MCx0aGlzLl9yZXBlYXREZWxheT10aGlzLnZhcnMucmVwZWF0RGVsYXl8fDAsdGhpcy5fZGlydHk9ITAsdGhpcy5yZW5kZXI9ci5wcm90b3R5cGUucmVuZGVyfSxuPTFlLTEwLGE9aS5faW50ZXJuYWxzLG89YS5pc1NlbGVjdG9yLGg9YS5pc0FycmF5LGw9ci5wcm90b3R5cGU9aS50byh7fSwuMSx7fSksXz1bXTtyLnZlcnNpb249XCIxLjE0LjFcIixsLmNvbnN0cnVjdG9yPXIsbC5raWxsKCkuX2djPSExLHIua2lsbFR3ZWVuc09mPXIua2lsbERlbGF5ZWRDYWxsc1RvPWkua2lsbFR3ZWVuc09mLHIuZ2V0VHdlZW5zT2Y9aS5nZXRUd2VlbnNPZixyLmxhZ1Ntb290aGluZz1pLmxhZ1Ntb290aGluZyxyLnRpY2tlcj1pLnRpY2tlcixyLnJlbmRlcj1pLnJlbmRlcixsLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5feW95bz10aGlzLnZhcnMueW95bz09PSEwLHRoaXMuX3JlcGVhdD10aGlzLnZhcnMucmVwZWF0fHwwLHRoaXMuX3JlcGVhdERlbGF5PXRoaXMudmFycy5yZXBlYXREZWxheXx8MCx0aGlzLl91bmNhY2hlKCEwKSxpLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyl9LGwudXBkYXRlVG89ZnVuY3Rpb24odCxlKXt2YXIgcyxyPXRoaXMucmF0aW87ZSYmdGhpcy5fc3RhcnRUaW1lPHRoaXMuX3RpbWVsaW5lLl90aW1lJiYodGhpcy5fc3RhcnRUaW1lPXRoaXMuX3RpbWVsaW5lLl90aW1lLHRoaXMuX3VuY2FjaGUoITEpLHRoaXMuX2djP3RoaXMuX2VuYWJsZWQoITAsITEpOnRoaXMuX3RpbWVsaW5lLmluc2VydCh0aGlzLHRoaXMuX3N0YXJ0VGltZS10aGlzLl9kZWxheSkpO2ZvcihzIGluIHQpdGhpcy52YXJzW3NdPXRbc107aWYodGhpcy5faW5pdHRlZClpZihlKXRoaXMuX2luaXR0ZWQ9ITE7ZWxzZSBpZih0aGlzLl9nYyYmdGhpcy5fZW5hYmxlZCghMCwhMSksdGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCYmdGhpcy5fZmlyc3RQVCYmaS5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIix0aGlzKSx0aGlzLl90aW1lL3RoaXMuX2R1cmF0aW9uPi45OTgpe3ZhciBuPXRoaXMuX3RpbWU7dGhpcy5yZW5kZXIoMCwhMCwhMSksdGhpcy5faW5pdHRlZD0hMSx0aGlzLnJlbmRlcihuLCEwLCExKX1lbHNlIGlmKHRoaXMuX3RpbWU+MCl7dGhpcy5faW5pdHRlZD0hMSx0aGlzLl9pbml0KCk7Zm9yKHZhciBhLG89MS8oMS1yKSxoPXRoaXMuX2ZpcnN0UFQ7aDspYT1oLnMraC5jLGguYyo9byxoLnM9YS1oLmMsaD1oLl9uZXh0fXJldHVybiB0aGlzfSxsLnJlbmRlcj1mdW5jdGlvbih0LGUsaSl7dGhpcy5faW5pdHRlZHx8MD09PXRoaXMuX2R1cmF0aW9uJiZ0aGlzLnZhcnMucmVwZWF0JiZ0aGlzLmludmFsaWRhdGUoKTt2YXIgcyxyLG8saCxsLHUscCxjLGY9dGhpcy5fZGlydHk/dGhpcy50b3RhbER1cmF0aW9uKCk6dGhpcy5fdG90YWxEdXJhdGlvbixtPXRoaXMuX3RpbWUsZD10aGlzLl90b3RhbFRpbWUsZz10aGlzLl9jeWNsZSx2PXRoaXMuX2R1cmF0aW9uLHk9dGhpcy5fcmF3UHJldlRpbWU7aWYodD49Zj8odGhpcy5fdG90YWxUaW1lPWYsdGhpcy5fY3ljbGU9dGhpcy5fcmVwZWF0LHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/KHRoaXMuX3RpbWU9MCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygwKTowKToodGhpcy5fdGltZT12LHRoaXMucmF0aW89dGhpcy5fZWFzZS5fY2FsY0VuZD90aGlzLl9lYXNlLmdldFJhdGlvKDEpOjEpLHRoaXMuX3JldmVyc2VkfHwocz0hMCxyPVwib25Db21wbGV0ZVwiKSwwPT09diYmKHRoaXMuX2luaXR0ZWR8fCF0aGlzLnZhcnMubGF6eXx8aSkmJih0aGlzLl9zdGFydFRpbWU9PT10aGlzLl90aW1lbGluZS5fZHVyYXRpb24mJih0PTApLCgwPT09dHx8MD55fHx5PT09bikmJnkhPT10JiYoaT0hMCx5Pm4mJihyPVwib25SZXZlcnNlQ29tcGxldGVcIikpLHRoaXMuX3Jhd1ByZXZUaW1lPWM9IWV8fHR8fHk9PT10P3Q6bikpOjFlLTc+dD8odGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9dGhpcy5fY3ljbGU9MCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygwKTowLCgwIT09ZHx8MD09PXYmJnk+MCYmeSE9PW4pJiYocj1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIscz10aGlzLl9yZXZlcnNlZCksMD50JiYodGhpcy5fYWN0aXZlPSExLDA9PT12JiYodGhpcy5faW5pdHRlZHx8IXRoaXMudmFycy5sYXp5fHxpKSYmKHk+PTAmJihpPSEwKSx0aGlzLl9yYXdQcmV2VGltZT1jPSFlfHx0fHx5PT09dD90Om4pKSx0aGlzLl9pbml0dGVkfHwoaT0hMCkpOih0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT10LDAhPT10aGlzLl9yZXBlYXQmJihoPXYrdGhpcy5fcmVwZWF0RGVsYXksdGhpcy5fY3ljbGU9dGhpcy5fdG90YWxUaW1lL2g+PjAsMCE9PXRoaXMuX2N5Y2xlJiZ0aGlzLl9jeWNsZT09PXRoaXMuX3RvdGFsVGltZS9oJiZ0aGlzLl9jeWNsZS0tLHRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lLXRoaXMuX2N5Y2xlKmgsdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKSYmKHRoaXMuX3RpbWU9di10aGlzLl90aW1lKSx0aGlzLl90aW1lPnY/dGhpcy5fdGltZT12OjA+dGhpcy5fdGltZSYmKHRoaXMuX3RpbWU9MCkpLHRoaXMuX2Vhc2VUeXBlPyhsPXRoaXMuX3RpbWUvdix1PXRoaXMuX2Vhc2VUeXBlLHA9dGhpcy5fZWFzZVBvd2VyLCgxPT09dXx8Mz09PXUmJmw+PS41KSYmKGw9MS1sKSwzPT09dSYmKGwqPTIpLDE9PT1wP2wqPWw6Mj09PXA/bCo9bCpsOjM9PT1wP2wqPWwqbCpsOjQ9PT1wJiYobCo9bCpsKmwqbCksdGhpcy5yYXRpbz0xPT09dT8xLWw6Mj09PXU/bDouNT50aGlzLl90aW1lL3Y/bC8yOjEtbC8yKTp0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZS92KSksbT09PXRoaXMuX3RpbWUmJiFpJiZnPT09dGhpcy5fY3ljbGUpcmV0dXJuIGQhPT10aGlzLl90b3RhbFRpbWUmJnRoaXMuX29uVXBkYXRlJiYoZXx8dGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHxfKSksdm9pZCAwO2lmKCF0aGlzLl9pbml0dGVkKXtpZih0aGlzLl9pbml0KCksIXRoaXMuX2luaXR0ZWR8fHRoaXMuX2djKXJldHVybjtpZighaSYmdGhpcy5fZmlyc3RQVCYmKHRoaXMudmFycy5sYXp5IT09ITEmJnRoaXMuX2R1cmF0aW9ufHx0aGlzLnZhcnMubGF6eSYmIXRoaXMuX2R1cmF0aW9uKSlyZXR1cm4gdGhpcy5fdGltZT1tLHRoaXMuX3RvdGFsVGltZT1kLHRoaXMuX3Jhd1ByZXZUaW1lPXksdGhpcy5fY3ljbGU9ZyxhLmxhenlUd2VlbnMucHVzaCh0aGlzKSx0aGlzLl9sYXp5PVt0LGVdLHZvaWQgMDt0aGlzLl90aW1lJiYhcz90aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZS92KTpzJiZ0aGlzLl9lYXNlLl9jYWxjRW5kJiYodGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKDA9PT10aGlzLl90aW1lPzA6MSkpfWZvcih0aGlzLl9sYXp5IT09ITEmJih0aGlzLl9sYXp5PSExKSx0aGlzLl9hY3RpdmV8fCF0aGlzLl9wYXVzZWQmJnRoaXMuX3RpbWUhPT1tJiZ0Pj0wJiYodGhpcy5fYWN0aXZlPSEwKSwwPT09ZCYmKDI9PT10aGlzLl9pbml0dGVkJiZ0PjAmJnRoaXMuX2luaXQoKSx0aGlzLl9zdGFydEF0JiYodD49MD90aGlzLl9zdGFydEF0LnJlbmRlcih0LGUsaSk6cnx8KHI9XCJfZHVtbXlHU1wiKSksdGhpcy52YXJzLm9uU3RhcnQmJigwIT09dGhpcy5fdG90YWxUaW1lfHwwPT09dikmJihlfHx0aGlzLnZhcnMub25TdGFydC5hcHBseSh0aGlzLnZhcnMub25TdGFydFNjb3BlfHx0aGlzLHRoaXMudmFycy5vblN0YXJ0UGFyYW1zfHxfKSkpLG89dGhpcy5fZmlyc3RQVDtvOylvLmY/by50W28ucF0oby5jKnRoaXMucmF0aW8rby5zKTpvLnRbby5wXT1vLmMqdGhpcy5yYXRpbytvLnMsbz1vLl9uZXh0O3RoaXMuX29uVXBkYXRlJiYoMD50JiZ0aGlzLl9zdGFydEF0JiZ0aGlzLl9zdGFydFRpbWUmJnRoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKSxlfHwodGhpcy5fdG90YWxUaW1lIT09ZHx8cykmJnRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8XykpLHRoaXMuX2N5Y2xlIT09ZyYmKGV8fHRoaXMuX2djfHx0aGlzLnZhcnMub25SZXBlYXQmJnRoaXMudmFycy5vblJlcGVhdC5hcHBseSh0aGlzLnZhcnMub25SZXBlYXRTY29wZXx8dGhpcyx0aGlzLnZhcnMub25SZXBlYXRQYXJhbXN8fF8pKSxyJiYoIXRoaXMuX2djfHxpKSYmKDA+dCYmdGhpcy5fc3RhcnRBdCYmIXRoaXMuX29uVXBkYXRlJiZ0aGlzLl9zdGFydFRpbWUmJnRoaXMuX3N0YXJ0QXQucmVuZGVyKHQsZSxpKSxzJiYodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuJiZ0aGlzLl9lbmFibGVkKCExLCExKSx0aGlzLl9hY3RpdmU9ITEpLCFlJiZ0aGlzLnZhcnNbcl0mJnRoaXMudmFyc1tyXS5hcHBseSh0aGlzLnZhcnNbcitcIlNjb3BlXCJdfHx0aGlzLHRoaXMudmFyc1tyK1wiUGFyYW1zXCJdfHxfKSwwPT09diYmdGhpcy5fcmF3UHJldlRpbWU9PT1uJiZjIT09biYmKHRoaXMuX3Jhd1ByZXZUaW1lPTApKX0sci50bz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIG5ldyByKHQsZSxpKX0sci5mcm9tPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gaS5ydW5CYWNrd2FyZHM9ITAsaS5pbW1lZGlhdGVSZW5kZXI9MCE9aS5pbW1lZGlhdGVSZW5kZXIsbmV3IHIodCxlLGkpfSxyLmZyb21Ubz1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gcy5zdGFydEF0PWkscy5pbW1lZGlhdGVSZW5kZXI9MCE9cy5pbW1lZGlhdGVSZW5kZXImJjAhPWkuaW1tZWRpYXRlUmVuZGVyLG5ldyByKHQsZSxzKX0sci5zdGFnZ2VyVG89ci5hbGxUbz1mdW5jdGlvbih0LGUsbixhLGwsdSxwKXthPWF8fDA7dmFyIGMsZixtLGQsZz1uLmRlbGF5fHwwLHY9W10seT1mdW5jdGlvbigpe24ub25Db21wbGV0ZSYmbi5vbkNvbXBsZXRlLmFwcGx5KG4ub25Db21wbGV0ZVNjb3BlfHx0aGlzLGFyZ3VtZW50cyksbC5hcHBseShwfHx0aGlzLHV8fF8pfTtmb3IoaCh0KXx8KFwic3RyaW5nXCI9PXR5cGVvZiB0JiYodD1pLnNlbGVjdG9yKHQpfHx0KSxvKHQpJiYodD1zKHQpKSksdD10fHxbXSwwPmEmJih0PXModCksdC5yZXZlcnNlKCksYSo9LTEpLGM9dC5sZW5ndGgtMSxtPTA7Yz49bTttKyspe2Y9e307Zm9yKGQgaW4gbilmW2RdPW5bZF07Zi5kZWxheT1nLG09PT1jJiZsJiYoZi5vbkNvbXBsZXRlPXkpLHZbbV09bmV3IHIodFttXSxlLGYpLGcrPWF9cmV0dXJuIHZ9LHIuc3RhZ2dlckZyb209ci5hbGxGcm9tPWZ1bmN0aW9uKHQsZSxpLHMsbixhLG8pe3JldHVybiBpLnJ1bkJhY2t3YXJkcz0hMCxpLmltbWVkaWF0ZVJlbmRlcj0wIT1pLmltbWVkaWF0ZVJlbmRlcixyLnN0YWdnZXJUbyh0LGUsaSxzLG4sYSxvKX0sci5zdGFnZ2VyRnJvbVRvPXIuYWxsRnJvbVRvPWZ1bmN0aW9uKHQsZSxpLHMsbixhLG8saCl7cmV0dXJuIHMuc3RhcnRBdD1pLHMuaW1tZWRpYXRlUmVuZGVyPTAhPXMuaW1tZWRpYXRlUmVuZGVyJiYwIT1pLmltbWVkaWF0ZVJlbmRlcixyLnN0YWdnZXJUbyh0LGUscyxuLGEsbyxoKX0sci5kZWxheWVkQ2FsbD1mdW5jdGlvbih0LGUsaSxzLG4pe3JldHVybiBuZXcgcihlLDAse2RlbGF5OnQsb25Db21wbGV0ZTplLG9uQ29tcGxldGVQYXJhbXM6aSxvbkNvbXBsZXRlU2NvcGU6cyxvblJldmVyc2VDb21wbGV0ZTplLG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOmksb25SZXZlcnNlQ29tcGxldGVTY29wZTpzLGltbWVkaWF0ZVJlbmRlcjohMSx1c2VGcmFtZXM6bixvdmVyd3JpdGU6MH0pfSxyLnNldD1mdW5jdGlvbih0LGUpe3JldHVybiBuZXcgcih0LDAsZSl9LHIuaXNUd2VlbmluZz1mdW5jdGlvbih0KXtyZXR1cm4gaS5nZXRUd2VlbnNPZih0LCEwKS5sZW5ndGg+MH07dmFyIHU9ZnVuY3Rpb24odCxlKXtmb3IodmFyIHM9W10scj0wLG49dC5fZmlyc3Q7bjspbiBpbnN0YW5jZW9mIGk/c1tyKytdPW46KGUmJihzW3IrK109bikscz1zLmNvbmNhdCh1KG4sZSkpLHI9cy5sZW5ndGgpLG49bi5fbmV4dDtyZXR1cm4gc30scD1yLmdldEFsbFR3ZWVucz1mdW5jdGlvbihlKXtyZXR1cm4gdSh0Ll9yb290VGltZWxpbmUsZSkuY29uY2F0KHUodC5fcm9vdEZyYW1lc1RpbWVsaW5lLGUpKX07ci5raWxsQWxsPWZ1bmN0aW9uKHQsaSxzLHIpe251bGw9PWkmJihpPSEwKSxudWxsPT1zJiYocz0hMCk7dmFyIG4sYSxvLGg9cCgwIT1yKSxsPWgubGVuZ3RoLF89aSYmcyYmcjtmb3Iobz0wO2w+bztvKyspYT1oW29dLChffHxhIGluc3RhbmNlb2YgZXx8KG49YS50YXJnZXQ9PT1hLnZhcnMub25Db21wbGV0ZSkmJnN8fGkmJiFuKSYmKHQ/YS50b3RhbFRpbWUoYS5fcmV2ZXJzZWQ/MDphLnRvdGFsRHVyYXRpb24oKSk6YS5fZW5hYmxlZCghMSwhMSkpfSxyLmtpbGxDaGlsZFR3ZWVuc09mPWZ1bmN0aW9uKHQsZSl7aWYobnVsbCE9dCl7dmFyIG4sbCxfLHUscCxjPWEudHdlZW5Mb29rdXA7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJih0PWkuc2VsZWN0b3IodCl8fHQpLG8odCkmJih0PXModCkpLGgodCkpZm9yKHU9dC5sZW5ndGg7LS11Pi0xOylyLmtpbGxDaGlsZFR3ZWVuc09mKHRbdV0sZSk7ZWxzZXtuPVtdO2ZvcihfIGluIGMpZm9yKGw9Y1tfXS50YXJnZXQucGFyZW50Tm9kZTtsOylsPT09dCYmKG49bi5jb25jYXQoY1tfXS50d2VlbnMpKSxsPWwucGFyZW50Tm9kZTtmb3IocD1uLmxlbmd0aCx1PTA7cD51O3UrKyllJiZuW3VdLnRvdGFsVGltZShuW3VdLnRvdGFsRHVyYXRpb24oKSksblt1XS5fZW5hYmxlZCghMSwhMSl9fX07dmFyIGM9ZnVuY3Rpb24odCxpLHMscil7aT1pIT09ITEscz1zIT09ITEscj1yIT09ITE7Zm9yKHZhciBuLGEsbz1wKHIpLGg9aSYmcyYmcixsPW8ubGVuZ3RoOy0tbD4tMTspYT1vW2xdLChofHxhIGluc3RhbmNlb2YgZXx8KG49YS50YXJnZXQ9PT1hLnZhcnMub25Db21wbGV0ZSkmJnN8fGkmJiFuKSYmYS5wYXVzZWQodCl9O3JldHVybiByLnBhdXNlQWxsPWZ1bmN0aW9uKHQsZSxpKXtjKCEwLHQsZSxpKX0sci5yZXN1bWVBbGw9ZnVuY3Rpb24odCxlLGkpe2MoITEsdCxlLGkpfSxyLmdsb2JhbFRpbWVTY2FsZT1mdW5jdGlvbihlKXt2YXIgcz10Ll9yb290VGltZWxpbmUscj1pLnRpY2tlci50aW1lO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyhlPWV8fG4scy5fc3RhcnRUaW1lPXItKHItcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUvZSxzPXQuX3Jvb3RGcmFtZXNUaW1lbGluZSxyPWkudGlja2VyLmZyYW1lLHMuX3N0YXJ0VGltZT1yLShyLXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlL2Uscy5fdGltZVNjYWxlPXQuX3Jvb3RUaW1lbGluZS5fdGltZVNjYWxlPWUsZSk6cy5fdGltZVNjYWxlfSxsLnByb2dyZXNzPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMudG90YWxUaW1lKHRoaXMuZHVyYXRpb24oKSoodGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKT8xLXQ6dCkrdGhpcy5fY3ljbGUqKHRoaXMuX2R1cmF0aW9uK3RoaXMuX3JlcGVhdERlbGF5KSwhMSk6dGhpcy5fdGltZS90aGlzLmR1cmF0aW9uKCl9LGwudG90YWxQcm9ncmVzcz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnRvdGFsVGltZSh0aGlzLnRvdGFsRHVyYXRpb24oKSp0LCExKTp0aGlzLl90b3RhbFRpbWUvdGhpcy50b3RhbER1cmF0aW9uKCl9LGwudGltZT1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCksdD50aGlzLl9kdXJhdGlvbiYmKHQ9dGhpcy5fZHVyYXRpb24pLHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/dD10aGlzLl9kdXJhdGlvbi10K3RoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSk6MCE9PXRoaXMuX3JlcGVhdCYmKHQrPXRoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSkpLHRoaXMudG90YWxUaW1lKHQsZSkpOnRoaXMuX3RpbWV9LGwuZHVyYXRpb249ZnVuY3Rpb24oZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dC5wcm90b3R5cGUuZHVyYXRpb24uY2FsbCh0aGlzLGUpOnRoaXMuX2R1cmF0aW9ufSxsLnRvdGFsRHVyYXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/LTE9PT10aGlzLl9yZXBlYXQ/dGhpczp0aGlzLmR1cmF0aW9uKCh0LXRoaXMuX3JlcGVhdCp0aGlzLl9yZXBlYXREZWxheSkvKHRoaXMuX3JlcGVhdCsxKSk6KHRoaXMuX2RpcnR5JiYodGhpcy5fdG90YWxEdXJhdGlvbj0tMT09PXRoaXMuX3JlcGVhdD85OTk5OTk5OTk5OTk6dGhpcy5fZHVyYXRpb24qKHRoaXMuX3JlcGVhdCsxKSt0aGlzLl9yZXBlYXREZWxheSp0aGlzLl9yZXBlYXQsdGhpcy5fZGlydHk9ITEpLHRoaXMuX3RvdGFsRHVyYXRpb24pfSxsLnJlcGVhdD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVwZWF0PXQsdGhpcy5fdW5jYWNoZSghMCkpOnRoaXMuX3JlcGVhdH0sbC5yZXBlYXREZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVwZWF0RGVsYXk9dCx0aGlzLl91bmNhY2hlKCEwKSk6dGhpcy5fcmVwZWF0RGVsYXl9LGwueW95bz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5feW95bz10LHRoaXMpOnRoaXMuX3lveW99LHJ9LCEwKSxfZ3NTY29wZS5fZ3NEZWZpbmUoXCJUaW1lbGluZUxpdGVcIixbXCJjb3JlLkFuaW1hdGlvblwiLFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLFwiVHdlZW5MaXRlXCJdLGZ1bmN0aW9uKHQsZSxpKXt2YXIgcz1mdW5jdGlvbih0KXtlLmNhbGwodGhpcyx0KSx0aGlzLl9sYWJlbHM9e30sdGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW49dGhpcy52YXJzLmF1dG9SZW1vdmVDaGlsZHJlbj09PSEwLHRoaXMuc21vb3RoQ2hpbGRUaW1pbmc9dGhpcy52YXJzLnNtb290aENoaWxkVGltaW5nPT09ITAsdGhpcy5fc29ydENoaWxkcmVuPSEwLHRoaXMuX29uVXBkYXRlPXRoaXMudmFycy5vblVwZGF0ZTt2YXIgaSxzLHI9dGhpcy52YXJzO2ZvcihzIGluIHIpaT1yW3NdLG8oaSkmJi0xIT09aS5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikmJihyW3NdPXRoaXMuX3N3YXBTZWxmSW5QYXJhbXMoaSkpO28oci50d2VlbnMpJiZ0aGlzLmFkZChyLnR3ZWVucywwLHIuYWxpZ24sci5zdGFnZ2VyKX0scj0xZS0xMCxuPWkuX2ludGVybmFscyxhPW4uaXNTZWxlY3RvcixvPW4uaXNBcnJheSxoPW4ubGF6eVR3ZWVucyxsPW4ubGF6eVJlbmRlcixfPVtdLHU9X2dzU2NvcGUuX2dzRGVmaW5lLmdsb2JhbHMscD1mdW5jdGlvbih0KXt2YXIgZSxpPXt9O2ZvcihlIGluIHQpaVtlXT10W2VdO3JldHVybiBpfSxjPWZ1bmN0aW9uKHQsZSxpLHMpe3ZhciByPXQuX3RpbWVsaW5lLl90b3RhbFRpbWU7KGV8fCF0aGlzLl9mb3JjaW5nUGxheWhlYWQpJiYodC5fdGltZWxpbmUucGF1c2UodC5fc3RhcnRUaW1lKSxlJiZlLmFwcGx5KHN8fHQuX3RpbWVsaW5lLGl8fF8pLHRoaXMuX2ZvcmNpbmdQbGF5aGVhZCYmdC5fdGltZWxpbmUuc2VlayhyKSl9LGY9ZnVuY3Rpb24odCl7dmFyIGUsaT1bXSxzPXQubGVuZ3RoO2ZvcihlPTA7ZSE9PXM7aS5wdXNoKHRbZSsrXSkpO3JldHVybiBpfSxtPXMucHJvdG90eXBlPW5ldyBlO3JldHVybiBzLnZlcnNpb249XCIxLjE0LjFcIixtLmNvbnN0cnVjdG9yPXMsbS5raWxsKCkuX2djPW0uX2ZvcmNpbmdQbGF5aGVhZD0hMSxtLnRvPWZ1bmN0aW9uKHQsZSxzLHIpe3ZhciBuPXMucmVwZWF0JiZ1LlR3ZWVuTWF4fHxpO3JldHVybiBlP3RoaXMuYWRkKG5ldyBuKHQsZSxzKSxyKTp0aGlzLnNldCh0LHMscil9LG0uZnJvbT1mdW5jdGlvbih0LGUscyxyKXtyZXR1cm4gdGhpcy5hZGQoKHMucmVwZWF0JiZ1LlR3ZWVuTWF4fHxpKS5mcm9tKHQsZSxzKSxyKX0sbS5mcm9tVG89ZnVuY3Rpb24odCxlLHMscixuKXt2YXIgYT1yLnJlcGVhdCYmdS5Ud2Vlbk1heHx8aTtyZXR1cm4gZT90aGlzLmFkZChhLmZyb21Ubyh0LGUscyxyKSxuKTp0aGlzLnNldCh0LHIsbil9LG0uc3RhZ2dlclRvPWZ1bmN0aW9uKHQsZSxyLG4sbyxoLGwsXyl7dmFyIHUsYz1uZXcgcyh7b25Db21wbGV0ZTpoLG9uQ29tcGxldGVQYXJhbXM6bCxvbkNvbXBsZXRlU2NvcGU6XyxzbW9vdGhDaGlsZFRpbWluZzp0aGlzLnNtb290aENoaWxkVGltaW5nfSk7Zm9yKFwic3RyaW5nXCI9PXR5cGVvZiB0JiYodD1pLnNlbGVjdG9yKHQpfHx0KSx0PXR8fFtdLGEodCkmJih0PWYodCkpLG49bnx8MCwwPm4mJih0PWYodCksdC5yZXZlcnNlKCksbio9LTEpLHU9MDt0Lmxlbmd0aD51O3UrKylyLnN0YXJ0QXQmJihyLnN0YXJ0QXQ9cChyLnN0YXJ0QXQpKSxjLnRvKHRbdV0sZSxwKHIpLHUqbik7cmV0dXJuIHRoaXMuYWRkKGMsbyl9LG0uc3RhZ2dlckZyb209ZnVuY3Rpb24odCxlLGkscyxyLG4sYSxvKXtyZXR1cm4gaS5pbW1lZGlhdGVSZW5kZXI9MCE9aS5pbW1lZGlhdGVSZW5kZXIsaS5ydW5CYWNrd2FyZHM9ITAsdGhpcy5zdGFnZ2VyVG8odCxlLGkscyxyLG4sYSxvKX0sbS5zdGFnZ2VyRnJvbVRvPWZ1bmN0aW9uKHQsZSxpLHMscixuLGEsbyxoKXtyZXR1cm4gcy5zdGFydEF0PWkscy5pbW1lZGlhdGVSZW5kZXI9MCE9cy5pbW1lZGlhdGVSZW5kZXImJjAhPWkuaW1tZWRpYXRlUmVuZGVyLHRoaXMuc3RhZ2dlclRvKHQsZSxzLHIsbixhLG8saCl9LG0uY2FsbD1mdW5jdGlvbih0LGUscyxyKXtyZXR1cm4gdGhpcy5hZGQoaS5kZWxheWVkQ2FsbCgwLHQsZSxzKSxyKX0sbS5zZXQ9ZnVuY3Rpb24odCxlLHMpe3JldHVybiBzPXRoaXMuX3BhcnNlVGltZU9yTGFiZWwocywwLCEwKSxudWxsPT1lLmltbWVkaWF0ZVJlbmRlciYmKGUuaW1tZWRpYXRlUmVuZGVyPXM9PT10aGlzLl90aW1lJiYhdGhpcy5fcGF1c2VkKSx0aGlzLmFkZChuZXcgaSh0LDAsZSkscyl9LHMuZXhwb3J0Um9vdD1mdW5jdGlvbih0LGUpe3Q9dHx8e30sbnVsbD09dC5zbW9vdGhDaGlsZFRpbWluZyYmKHQuc21vb3RoQ2hpbGRUaW1pbmc9ITApO3ZhciByLG4sYT1uZXcgcyh0KSxvPWEuX3RpbWVsaW5lO2ZvcihudWxsPT1lJiYoZT0hMCksby5fcmVtb3ZlKGEsITApLGEuX3N0YXJ0VGltZT0wLGEuX3Jhd1ByZXZUaW1lPWEuX3RpbWU9YS5fdG90YWxUaW1lPW8uX3RpbWUscj1vLl9maXJzdDtyOyluPXIuX25leHQsZSYmciBpbnN0YW5jZW9mIGkmJnIudGFyZ2V0PT09ci52YXJzLm9uQ29tcGxldGV8fGEuYWRkKHIsci5fc3RhcnRUaW1lLXIuX2RlbGF5KSxyPW47cmV0dXJuIG8uYWRkKGEsMCksYX0sbS5hZGQ9ZnVuY3Rpb24ocixuLGEsaCl7dmFyIGwsXyx1LHAsYyxmO2lmKFwibnVtYmVyXCIhPXR5cGVvZiBuJiYobj10aGlzLl9wYXJzZVRpbWVPckxhYmVsKG4sMCwhMCxyKSksIShyIGluc3RhbmNlb2YgdCkpe2lmKHIgaW5zdGFuY2VvZiBBcnJheXx8ciYmci5wdXNoJiZvKHIpKXtmb3IoYT1hfHxcIm5vcm1hbFwiLGg9aHx8MCxsPW4sXz1yLmxlbmd0aCx1PTA7Xz51O3UrKylvKHA9clt1XSkmJihwPW5ldyBzKHt0d2VlbnM6cH0pKSx0aGlzLmFkZChwLGwpLFwic3RyaW5nXCIhPXR5cGVvZiBwJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBwJiYoXCJzZXF1ZW5jZVwiPT09YT9sPXAuX3N0YXJ0VGltZStwLnRvdGFsRHVyYXRpb24oKS9wLl90aW1lU2NhbGU6XCJzdGFydFwiPT09YSYmKHAuX3N0YXJ0VGltZS09cC5kZWxheSgpKSksbCs9aDtyZXR1cm4gdGhpcy5fdW5jYWNoZSghMCl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIHIpcmV0dXJuIHRoaXMuYWRkTGFiZWwocixuKTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiByKXRocm93XCJDYW5ub3QgYWRkIFwiK3IrXCIgaW50byB0aGUgdGltZWxpbmU7IGl0IGlzIG5vdCBhIHR3ZWVuLCB0aW1lbGluZSwgZnVuY3Rpb24sIG9yIHN0cmluZy5cIjtyPWkuZGVsYXllZENhbGwoMCxyKX1pZihlLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLHIsbiksKHRoaXMuX2djfHx0aGlzLl90aW1lPT09dGhpcy5fZHVyYXRpb24pJiYhdGhpcy5fcGF1c2VkJiZ0aGlzLl9kdXJhdGlvbjx0aGlzLmR1cmF0aW9uKCkpZm9yKGM9dGhpcyxmPWMucmF3VGltZSgpPnIuX3N0YXJ0VGltZTtjLl90aW1lbGluZTspZiYmYy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmc/Yy50b3RhbFRpbWUoYy5fdG90YWxUaW1lLCEwKTpjLl9nYyYmYy5fZW5hYmxlZCghMCwhMSksYz1jLl90aW1lbGluZTtyZXR1cm4gdGhpc30sbS5yZW1vdmU9ZnVuY3Rpb24oZSl7aWYoZSBpbnN0YW5jZW9mIHQpcmV0dXJuIHRoaXMuX3JlbW92ZShlLCExKTtpZihlIGluc3RhbmNlb2YgQXJyYXl8fGUmJmUucHVzaCYmbyhlKSl7Zm9yKHZhciBpPWUubGVuZ3RoOy0taT4tMTspdGhpcy5yZW1vdmUoZVtpXSk7cmV0dXJuIHRoaXN9cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/dGhpcy5yZW1vdmVMYWJlbChlKTp0aGlzLmtpbGwobnVsbCxlKX0sbS5fcmVtb3ZlPWZ1bmN0aW9uKHQsaSl7ZS5wcm90b3R5cGUuX3JlbW92ZS5jYWxsKHRoaXMsdCxpKTt2YXIgcz10aGlzLl9sYXN0O3JldHVybiBzP3RoaXMuX3RpbWU+cy5fc3RhcnRUaW1lK3MuX3RvdGFsRHVyYXRpb24vcy5fdGltZVNjYWxlJiYodGhpcy5fdGltZT10aGlzLmR1cmF0aW9uKCksdGhpcy5fdG90YWxUaW1lPXRoaXMuX3RvdGFsRHVyYXRpb24pOnRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lPXRoaXMuX2R1cmF0aW9uPXRoaXMuX3RvdGFsRHVyYXRpb249MCx0aGlzfSxtLmFwcGVuZD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmFkZCh0LHRoaXMuX3BhcnNlVGltZU9yTGFiZWwobnVsbCxlLCEwLHQpKX0sbS5pbnNlcnQ9bS5pbnNlcnRNdWx0aXBsZT1mdW5jdGlvbih0LGUsaSxzKXtyZXR1cm4gdGhpcy5hZGQodCxlfHwwLGkscyl9LG0uYXBwZW5kTXVsdGlwbGU9ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHRoaXMuYWRkKHQsdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChudWxsLGUsITAsdCksaSxzKX0sbS5hZGRMYWJlbD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLl9sYWJlbHNbdF09dGhpcy5fcGFyc2VUaW1lT3JMYWJlbChlKSx0aGlzfSxtLmFkZFBhdXNlPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiB0aGlzLmNhbGwoYyxbXCJ7c2VsZn1cIixlLGksc10sdGhpcyx0KX0sbS5yZW1vdmVMYWJlbD1mdW5jdGlvbih0KXtyZXR1cm4gZGVsZXRlIHRoaXMuX2xhYmVsc1t0XSx0aGlzfSxtLmdldExhYmVsVGltZT1mdW5jdGlvbih0KXtyZXR1cm4gbnVsbCE9dGhpcy5fbGFiZWxzW3RdP3RoaXMuX2xhYmVsc1t0XTotMX0sbS5fcGFyc2VUaW1lT3JMYWJlbD1mdW5jdGlvbihlLGkscyxyKXt2YXIgbjtpZihyIGluc3RhbmNlb2YgdCYmci50aW1lbGluZT09PXRoaXMpdGhpcy5yZW1vdmUocik7ZWxzZSBpZihyJiYociBpbnN0YW5jZW9mIEFycmF5fHxyLnB1c2gmJm8ocikpKWZvcihuPXIubGVuZ3RoOy0tbj4tMTspcltuXWluc3RhbmNlb2YgdCYmcltuXS50aW1lbGluZT09PXRoaXMmJnRoaXMucmVtb3ZlKHJbbl0pO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBpKXJldHVybiB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKGkscyYmXCJudW1iZXJcIj09dHlwZW9mIGUmJm51bGw9PXRoaXMuX2xhYmVsc1tpXT9lLXRoaXMuZHVyYXRpb24oKTowLHMpO2lmKGk9aXx8MCxcInN0cmluZ1wiIT10eXBlb2YgZXx8IWlzTmFOKGUpJiZudWxsPT10aGlzLl9sYWJlbHNbZV0pbnVsbD09ZSYmKGU9dGhpcy5kdXJhdGlvbigpKTtlbHNle2lmKG49ZS5pbmRleE9mKFwiPVwiKSwtMT09PW4pcmV0dXJuIG51bGw9PXRoaXMuX2xhYmVsc1tlXT9zP3RoaXMuX2xhYmVsc1tlXT10aGlzLmR1cmF0aW9uKCkraTppOnRoaXMuX2xhYmVsc1tlXStpO2k9cGFyc2VJbnQoZS5jaGFyQXQobi0xKStcIjFcIiwxMCkqTnVtYmVyKGUuc3Vic3RyKG4rMSkpLGU9bj4xP3RoaXMuX3BhcnNlVGltZU9yTGFiZWwoZS5zdWJzdHIoMCxuLTEpLDAscyk6dGhpcy5kdXJhdGlvbigpfXJldHVybiBOdW1iZXIoZSkraX0sbS5zZWVrPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMudG90YWxUaW1lKFwibnVtYmVyXCI9PXR5cGVvZiB0P3Q6dGhpcy5fcGFyc2VUaW1lT3JMYWJlbCh0KSxlIT09ITEpfSxtLnN0b3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXVzZWQoITApfSxtLmdvdG9BbmRQbGF5PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMucGxheSh0LGUpfSxtLmdvdG9BbmRTdG9wPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMucGF1c2UodCxlKX0sbS5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3RoaXMuX2djJiZ0aGlzLl9lbmFibGVkKCEwLCExKTt2YXIgcyxuLGEsbyx1LHA9dGhpcy5fZGlydHk/dGhpcy50b3RhbER1cmF0aW9uKCk6dGhpcy5fdG90YWxEdXJhdGlvbixjPXRoaXMuX3RpbWUsZj10aGlzLl9zdGFydFRpbWUsbT10aGlzLl90aW1lU2NhbGUsZD10aGlzLl9wYXVzZWQ7aWYodD49cD8odGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9cCx0aGlzLl9yZXZlcnNlZHx8dGhpcy5faGFzUGF1c2VkQ2hpbGQoKXx8KG49ITAsbz1cIm9uQ29tcGxldGVcIiwwPT09dGhpcy5fZHVyYXRpb24mJigwPT09dHx8MD50aGlzLl9yYXdQcmV2VGltZXx8dGhpcy5fcmF3UHJldlRpbWU9PT1yKSYmdGhpcy5fcmF3UHJldlRpbWUhPT10JiZ0aGlzLl9maXJzdCYmKHU9ITAsdGhpcy5fcmF3UHJldlRpbWU+ciYmKG89XCJvblJldmVyc2VDb21wbGV0ZVwiKSkpLHRoaXMuX3Jhd1ByZXZUaW1lPXRoaXMuX2R1cmF0aW9ufHwhZXx8dHx8dGhpcy5fcmF3UHJldlRpbWU9PT10P3Q6cix0PXArMWUtNCk6MWUtNz50Pyh0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT0wLCgwIT09Y3x8MD09PXRoaXMuX2R1cmF0aW9uJiZ0aGlzLl9yYXdQcmV2VGltZSE9PXImJih0aGlzLl9yYXdQcmV2VGltZT4wfHwwPnQmJnRoaXMuX3Jhd1ByZXZUaW1lPj0wKSkmJihvPVwib25SZXZlcnNlQ29tcGxldGVcIixuPXRoaXMuX3JldmVyc2VkKSwwPnQ/KHRoaXMuX2FjdGl2ZT0hMSx0aGlzLl9yYXdQcmV2VGltZT49MCYmdGhpcy5fZmlyc3QmJih1PSEwKSx0aGlzLl9yYXdQcmV2VGltZT10KToodGhpcy5fcmF3UHJldlRpbWU9dGhpcy5fZHVyYXRpb258fCFlfHx0fHx0aGlzLl9yYXdQcmV2VGltZT09PXQ/dDpyLHQ9MCx0aGlzLl9pbml0dGVkfHwodT0hMCkpKTp0aGlzLl90b3RhbFRpbWU9dGhpcy5fdGltZT10aGlzLl9yYXdQcmV2VGltZT10LHRoaXMuX3RpbWUhPT1jJiZ0aGlzLl9maXJzdHx8aXx8dSl7aWYodGhpcy5faW5pdHRlZHx8KHRoaXMuX2luaXR0ZWQ9ITApLHRoaXMuX2FjdGl2ZXx8IXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZSE9PWMmJnQ+MCYmKHRoaXMuX2FjdGl2ZT0hMCksMD09PWMmJnRoaXMudmFycy5vblN0YXJ0JiYwIT09dGhpcy5fdGltZSYmKGV8fHRoaXMudmFycy5vblN0YXJ0LmFwcGx5KHRoaXMudmFycy5vblN0YXJ0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uU3RhcnRQYXJhbXN8fF8pKSx0aGlzLl90aW1lPj1jKWZvcihzPXRoaXMuX2ZpcnN0O3MmJihhPXMuX25leHQsIXRoaXMuX3BhdXNlZHx8ZCk7KShzLl9hY3RpdmV8fHMuX3N0YXJ0VGltZTw9dGhpcy5fdGltZSYmIXMuX3BhdXNlZCYmIXMuX2djKSYmKHMuX3JldmVyc2VkP3MucmVuZGVyKChzLl9kaXJ0eT9zLnRvdGFsRHVyYXRpb24oKTpzLl90b3RhbER1cmF0aW9uKS0odC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpOnMucmVuZGVyKCh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSkpLHM9YTtlbHNlIGZvcihzPXRoaXMuX2xhc3Q7cyYmKGE9cy5fcHJldiwhdGhpcy5fcGF1c2VkfHxkKTspKHMuX2FjdGl2ZXx8Yz49cy5fc3RhcnRUaW1lJiYhcy5fcGF1c2VkJiYhcy5fZ2MpJiYocy5fcmV2ZXJzZWQ/cy5yZW5kZXIoKHMuX2RpcnR5P3MudG90YWxEdXJhdGlvbigpOnMuX3RvdGFsRHVyYXRpb24pLSh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSk6cy5yZW5kZXIoKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKSkscz1hO3RoaXMuX29uVXBkYXRlJiYoZXx8KGgubGVuZ3RoJiZsKCksdGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHxfKSkpLG8mJih0aGlzLl9nY3x8KGY9PT10aGlzLl9zdGFydFRpbWV8fG0hPT10aGlzLl90aW1lU2NhbGUpJiYoMD09PXRoaXMuX3RpbWV8fHA+PXRoaXMudG90YWxEdXJhdGlvbigpKSYmKG4mJihoLmxlbmd0aCYmbCgpLHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiYmdGhpcy5fZW5hYmxlZCghMSwhMSksdGhpcy5fYWN0aXZlPSExKSwhZSYmdGhpcy52YXJzW29dJiZ0aGlzLnZhcnNbb10uYXBwbHkodGhpcy52YXJzW28rXCJTY29wZVwiXXx8dGhpcyx0aGlzLnZhcnNbbytcIlBhcmFtc1wiXXx8XykpKX19LG0uX2hhc1BhdXNlZENoaWxkPWZ1bmN0aW9uKCl7Zm9yKHZhciB0PXRoaXMuX2ZpcnN0O3Q7KXtpZih0Ll9wYXVzZWR8fHQgaW5zdGFuY2VvZiBzJiZ0Ll9oYXNQYXVzZWRDaGlsZCgpKXJldHVybiEwO3Q9dC5fbmV4dH1yZXR1cm4hMX0sbS5nZXRDaGlsZHJlbj1mdW5jdGlvbih0LGUscyxyKXtyPXJ8fC05OTk5OTk5OTk5O2Zvcih2YXIgbj1bXSxhPXRoaXMuX2ZpcnN0LG89MDthOylyPmEuX3N0YXJ0VGltZXx8KGEgaW5zdGFuY2VvZiBpP2UhPT0hMSYmKG5bbysrXT1hKToocyE9PSExJiYobltvKytdPWEpLHQhPT0hMSYmKG49bi5jb25jYXQoYS5nZXRDaGlsZHJlbighMCxlLHMpKSxvPW4ubGVuZ3RoKSkpLGE9YS5fbmV4dDtyZXR1cm4gbn0sbS5nZXRUd2VlbnNPZj1mdW5jdGlvbih0LGUpe3ZhciBzLHIsbj10aGlzLl9nYyxhPVtdLG89MDtmb3IobiYmdGhpcy5fZW5hYmxlZCghMCwhMCkscz1pLmdldFR3ZWVuc09mKHQpLHI9cy5sZW5ndGg7LS1yPi0xOykoc1tyXS50aW1lbGluZT09PXRoaXN8fGUmJnRoaXMuX2NvbnRhaW5zKHNbcl0pKSYmKGFbbysrXT1zW3JdKTtyZXR1cm4gbiYmdGhpcy5fZW5hYmxlZCghMSwhMCksYX0sbS5yZWNlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVjZW50fSxtLl9jb250YWlucz1mdW5jdGlvbih0KXtmb3IodmFyIGU9dC50aW1lbGluZTtlOyl7aWYoZT09PXRoaXMpcmV0dXJuITA7ZT1lLnRpbWVsaW5lfXJldHVybiExfSxtLnNoaWZ0Q2hpbGRyZW49ZnVuY3Rpb24odCxlLGkpe2k9aXx8MDtmb3IodmFyIHMscj10aGlzLl9maXJzdCxuPXRoaXMuX2xhYmVscztyOylyLl9zdGFydFRpbWU+PWkmJihyLl9zdGFydFRpbWUrPXQpLHI9ci5fbmV4dDtpZihlKWZvcihzIGluIG4pbltzXT49aSYmKG5bc10rPXQpO3JldHVybiB0aGlzLl91bmNhY2hlKCEwKX0sbS5fa2lsbD1mdW5jdGlvbih0LGUpe2lmKCF0JiYhZSlyZXR1cm4gdGhpcy5fZW5hYmxlZCghMSwhMSk7Zm9yKHZhciBpPWU/dGhpcy5nZXRUd2VlbnNPZihlKTp0aGlzLmdldENoaWxkcmVuKCEwLCEwLCExKSxzPWkubGVuZ3RoLHI9ITE7LS1zPi0xOylpW3NdLl9raWxsKHQsZSkmJihyPSEwKTtyZXR1cm4gcn0sbS5jbGVhcj1mdW5jdGlvbih0KXt2YXIgZT10aGlzLmdldENoaWxkcmVuKCExLCEwLCEwKSxpPWUubGVuZ3RoO2Zvcih0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZT0wOy0taT4tMTspZVtpXS5fZW5hYmxlZCghMSwhMSk7cmV0dXJuIHQhPT0hMSYmKHRoaXMuX2xhYmVscz17fSksdGhpcy5fdW5jYWNoZSghMCl9LG0uaW52YWxpZGF0ZT1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLl9maXJzdDtlOyllLmludmFsaWRhdGUoKSxlPWUuX25leHQ7cmV0dXJuIHQucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKX0sbS5fZW5hYmxlZD1mdW5jdGlvbih0LGkpe2lmKHQ9PT10aGlzLl9nYylmb3IodmFyIHM9dGhpcy5fZmlyc3Q7czspcy5fZW5hYmxlZCh0LCEwKSxzPXMuX25leHQ7cmV0dXJuIGUucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcyx0LGkpfSxtLnRvdGFsVGltZT1mdW5jdGlvbigpe3RoaXMuX2ZvcmNpbmdQbGF5aGVhZD0hMDt2YXIgZT10LnByb3RvdHlwZS50b3RhbFRpbWUuYXBwbHkodGhpcyxhcmd1bWVudHMpO3JldHVybiB0aGlzLl9mb3JjaW5nUGxheWhlYWQ9ITEsZX0sbS5kdXJhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8oMCE9PXRoaXMuZHVyYXRpb24oKSYmMCE9PXQmJnRoaXMudGltZVNjYWxlKHRoaXMuX2R1cmF0aW9uL3QpLHRoaXMpOih0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCksdGhpcy5fZHVyYXRpb24pfSxtLnRvdGFsRHVyYXRpb249ZnVuY3Rpb24odCl7aWYoIWFyZ3VtZW50cy5sZW5ndGgpe2lmKHRoaXMuX2RpcnR5KXtmb3IodmFyIGUsaSxzPTAscj10aGlzLl9sYXN0LG49OTk5OTk5OTk5OTk5O3I7KWU9ci5fcHJldixyLl9kaXJ0eSYmci50b3RhbER1cmF0aW9uKCksci5fc3RhcnRUaW1lPm4mJnRoaXMuX3NvcnRDaGlsZHJlbiYmIXIuX3BhdXNlZD90aGlzLmFkZChyLHIuX3N0YXJ0VGltZS1yLl9kZWxheSk6bj1yLl9zdGFydFRpbWUsMD5yLl9zdGFydFRpbWUmJiFyLl9wYXVzZWQmJihzLT1yLl9zdGFydFRpbWUsdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcmJih0aGlzLl9zdGFydFRpbWUrPXIuX3N0YXJ0VGltZS90aGlzLl90aW1lU2NhbGUpLHRoaXMuc2hpZnRDaGlsZHJlbigtci5fc3RhcnRUaW1lLCExLC05OTk5OTk5OTk5KSxuPTApLGk9ci5fc3RhcnRUaW1lK3IuX3RvdGFsRHVyYXRpb24vci5fdGltZVNjYWxlLGk+cyYmKHM9aSkscj1lO3RoaXMuX2R1cmF0aW9uPXRoaXMuX3RvdGFsRHVyYXRpb249cyx0aGlzLl9kaXJ0eT0hMX1yZXR1cm4gdGhpcy5fdG90YWxEdXJhdGlvbn1yZXR1cm4gMCE9PXRoaXMudG90YWxEdXJhdGlvbigpJiYwIT09dCYmdGhpcy50aW1lU2NhbGUodGhpcy5fdG90YWxEdXJhdGlvbi90KSx0aGlzfSxtLnVzZXNGcmFtZXM9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5fdGltZWxpbmU7ZS5fdGltZWxpbmU7KWU9ZS5fdGltZWxpbmU7cmV0dXJuIGU9PT10Ll9yb290RnJhbWVzVGltZWxpbmV9LG0ucmF3VGltZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXVzZWQ/dGhpcy5fdG90YWxUaW1lOih0aGlzLl90aW1lbGluZS5yYXdUaW1lKCktdGhpcy5fc3RhcnRUaW1lKSp0aGlzLl90aW1lU2NhbGV9LHN9LCEwKSxfZ3NTY29wZS5fZ3NEZWZpbmUoXCJUaW1lbGluZU1heFwiLFtcIlRpbWVsaW5lTGl0ZVwiLFwiVHdlZW5MaXRlXCIsXCJlYXNpbmcuRWFzZVwiXSxmdW5jdGlvbih0LGUsaSl7dmFyIHM9ZnVuY3Rpb24oZSl7dC5jYWxsKHRoaXMsZSksdGhpcy5fcmVwZWF0PXRoaXMudmFycy5yZXBlYXR8fDAsdGhpcy5fcmVwZWF0RGVsYXk9dGhpcy52YXJzLnJlcGVhdERlbGF5fHwwLHRoaXMuX2N5Y2xlPTAsdGhpcy5feW95bz10aGlzLnZhcnMueW95bz09PSEwLHRoaXMuX2RpcnR5PSEwfSxyPTFlLTEwLG49W10sYT1lLl9pbnRlcm5hbHMsbz1hLmxhenlUd2VlbnMsaD1hLmxhenlSZW5kZXIsbD1uZXcgaShudWxsLG51bGwsMSwwKSxfPXMucHJvdG90eXBlPW5ldyB0O3JldHVybiBfLmNvbnN0cnVjdG9yPXMsXy5raWxsKCkuX2djPSExLHMudmVyc2lvbj1cIjEuMTQuMVwiLF8uaW52YWxpZGF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLl95b3lvPXRoaXMudmFycy55b3lvPT09ITAsdGhpcy5fcmVwZWF0PXRoaXMudmFycy5yZXBlYXR8fDAsdGhpcy5fcmVwZWF0RGVsYXk9dGhpcy52YXJzLnJlcGVhdERlbGF5fHwwLHRoaXMuX3VuY2FjaGUoITApLHQucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKX0sXy5hZGRDYWxsYmFjaz1mdW5jdGlvbih0LGkscyxyKXtyZXR1cm4gdGhpcy5hZGQoZS5kZWxheWVkQ2FsbCgwLHQscyxyKSxpKX0sXy5yZW1vdmVDYWxsYmFjaz1mdW5jdGlvbih0LGUpe2lmKHQpaWYobnVsbD09ZSl0aGlzLl9raWxsKG51bGwsdCk7ZWxzZSBmb3IodmFyIGk9dGhpcy5nZXRUd2VlbnNPZih0LCExKSxzPWkubGVuZ3RoLHI9dGhpcy5fcGFyc2VUaW1lT3JMYWJlbChlKTstLXM+LTE7KWlbc10uX3N0YXJ0VGltZT09PXImJmlbc10uX2VuYWJsZWQoITEsITEpO3JldHVybiB0aGlzfSxfLnR3ZWVuVG89ZnVuY3Rpb24odCxpKXtpPWl8fHt9O3ZhciBzLHIsYSxvPXtlYXNlOmwsb3ZlcndyaXRlOmkuZGVsYXk/MjoxLHVzZUZyYW1lczp0aGlzLnVzZXNGcmFtZXMoKSxpbW1lZGlhdGVSZW5kZXI6ITF9O2ZvcihyIGluIGkpb1tyXT1pW3JdO3JldHVybiBvLnRpbWU9dGhpcy5fcGFyc2VUaW1lT3JMYWJlbCh0KSxzPU1hdGguYWJzKE51bWJlcihvLnRpbWUpLXRoaXMuX3RpbWUpL3RoaXMuX3RpbWVTY2FsZXx8LjAwMSxhPW5ldyBlKHRoaXMscyxvKSxvLm9uU3RhcnQ9ZnVuY3Rpb24oKXthLnRhcmdldC5wYXVzZWQoITApLGEudmFycy50aW1lIT09YS50YXJnZXQudGltZSgpJiZzPT09YS5kdXJhdGlvbigpJiZhLmR1cmF0aW9uKE1hdGguYWJzKGEudmFycy50aW1lLWEudGFyZ2V0LnRpbWUoKSkvYS50YXJnZXQuX3RpbWVTY2FsZSksaS5vblN0YXJ0JiZpLm9uU3RhcnQuYXBwbHkoaS5vblN0YXJ0U2NvcGV8fGEsaS5vblN0YXJ0UGFyYW1zfHxuKX0sYX0sXy50d2VlbkZyb21Ubz1mdW5jdGlvbih0LGUsaSl7aT1pfHx7fSx0PXRoaXMuX3BhcnNlVGltZU9yTGFiZWwodCksaS5zdGFydEF0PXtvbkNvbXBsZXRlOnRoaXMuc2VlayxvbkNvbXBsZXRlUGFyYW1zOlt0XSxvbkNvbXBsZXRlU2NvcGU6dGhpc30saS5pbW1lZGlhdGVSZW5kZXI9aS5pbW1lZGlhdGVSZW5kZXIhPT0hMTt2YXIgcz10aGlzLnR3ZWVuVG8oZSxpKTtyZXR1cm4gcy5kdXJhdGlvbihNYXRoLmFicyhzLnZhcnMudGltZS10KS90aGlzLl90aW1lU2NhbGV8fC4wMDEpfSxfLnJlbmRlcj1mdW5jdGlvbih0LGUsaSl7dGhpcy5fZ2MmJnRoaXMuX2VuYWJsZWQoITAsITEpO3ZhciBzLGEsbCxfLHUscCxjPXRoaXMuX2RpcnR5P3RoaXMudG90YWxEdXJhdGlvbigpOnRoaXMuX3RvdGFsRHVyYXRpb24sZj10aGlzLl9kdXJhdGlvbixtPXRoaXMuX3RpbWUsZD10aGlzLl90b3RhbFRpbWUsZz10aGlzLl9zdGFydFRpbWUsdj10aGlzLl90aW1lU2NhbGUseT10aGlzLl9yYXdQcmV2VGltZSxUPXRoaXMuX3BhdXNlZCx3PXRoaXMuX2N5Y2xlO2lmKHQ+PWM/KHRoaXMuX2xvY2tlZHx8KHRoaXMuX3RvdGFsVGltZT1jLHRoaXMuX2N5Y2xlPXRoaXMuX3JlcGVhdCksdGhpcy5fcmV2ZXJzZWR8fHRoaXMuX2hhc1BhdXNlZENoaWxkKCl8fChhPSEwLF89XCJvbkNvbXBsZXRlXCIsMD09PXRoaXMuX2R1cmF0aW9uJiYoMD09PXR8fDA+eXx8eT09PXIpJiZ5IT09dCYmdGhpcy5fZmlyc3QmJih1PSEwLHk+ciYmKF89XCJvblJldmVyc2VDb21wbGV0ZVwiKSkpLHRoaXMuX3Jhd1ByZXZUaW1lPXRoaXMuX2R1cmF0aW9ufHwhZXx8dHx8dGhpcy5fcmF3UHJldlRpbWU9PT10P3Q6cix0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpP3RoaXMuX3RpbWU9dD0wOih0aGlzLl90aW1lPWYsdD1mKzFlLTQpKToxZS03PnQ/KHRoaXMuX2xvY2tlZHx8KHRoaXMuX3RvdGFsVGltZT10aGlzLl9jeWNsZT0wKSx0aGlzLl90aW1lPTAsKDAhPT1tfHwwPT09ZiYmeSE9PXImJih5PjB8fDA+dCYmeT49MCkmJiF0aGlzLl9sb2NrZWQpJiYoXz1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIsYT10aGlzLl9yZXZlcnNlZCksMD50Pyh0aGlzLl9hY3RpdmU9ITEseT49MCYmdGhpcy5fZmlyc3QmJih1PSEwKSx0aGlzLl9yYXdQcmV2VGltZT10KToodGhpcy5fcmF3UHJldlRpbWU9Znx8IWV8fHR8fHRoaXMuX3Jhd1ByZXZUaW1lPT09dD90OnIsdD0wLHRoaXMuX2luaXR0ZWR8fCh1PSEwKSkpOigwPT09ZiYmMD55JiYodT0hMCksdGhpcy5fdGltZT10aGlzLl9yYXdQcmV2VGltZT10LHRoaXMuX2xvY2tlZHx8KHRoaXMuX3RvdGFsVGltZT10LDAhPT10aGlzLl9yZXBlYXQmJihwPWYrdGhpcy5fcmVwZWF0RGVsYXksdGhpcy5fY3ljbGU9dGhpcy5fdG90YWxUaW1lL3A+PjAsMCE9PXRoaXMuX2N5Y2xlJiZ0aGlzLl9jeWNsZT09PXRoaXMuX3RvdGFsVGltZS9wJiZ0aGlzLl9jeWNsZS0tLHRoaXMuX3RpbWU9dGhpcy5fdG90YWxUaW1lLXRoaXMuX2N5Y2xlKnAsdGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKSYmKHRoaXMuX3RpbWU9Zi10aGlzLl90aW1lKSx0aGlzLl90aW1lPmY/KHRoaXMuX3RpbWU9Zix0PWYrMWUtNCk6MD50aGlzLl90aW1lP3RoaXMuX3RpbWU9dD0wOnQ9dGhpcy5fdGltZSkpKSx0aGlzLl9jeWNsZSE9PXcmJiF0aGlzLl9sb2NrZWQpe3ZhciB4PXRoaXMuX3lveW8mJjAhPT0oMSZ3KSxiPXg9PT0odGhpcy5feW95byYmMCE9PSgxJnRoaXMuX2N5Y2xlKSksUD10aGlzLl90b3RhbFRpbWUsUz10aGlzLl9jeWNsZSxrPXRoaXMuX3Jhd1ByZXZUaW1lLFI9dGhpcy5fdGltZTtpZih0aGlzLl90b3RhbFRpbWU9dypmLHc+dGhpcy5fY3ljbGU/eD0heDp0aGlzLl90b3RhbFRpbWUrPWYsdGhpcy5fdGltZT1tLHRoaXMuX3Jhd1ByZXZUaW1lPTA9PT1mP3ktMWUtNDp5LHRoaXMuX2N5Y2xlPXcsdGhpcy5fbG9ja2VkPSEwLG09eD8wOmYsdGhpcy5yZW5kZXIobSxlLDA9PT1mKSxlfHx0aGlzLl9nY3x8dGhpcy52YXJzLm9uUmVwZWF0JiZ0aGlzLnZhcnMub25SZXBlYXQuYXBwbHkodGhpcy52YXJzLm9uUmVwZWF0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uUmVwZWF0UGFyYW1zfHxuKSxiJiYobT14P2YrMWUtNDotMWUtNCx0aGlzLnJlbmRlcihtLCEwLCExKSksdGhpcy5fbG9ja2VkPSExLHRoaXMuX3BhdXNlZCYmIVQpcmV0dXJuO3RoaXMuX3RpbWU9Uix0aGlzLl90b3RhbFRpbWU9UCx0aGlzLl9jeWNsZT1TLHRoaXMuX3Jhd1ByZXZUaW1lPWt9aWYoISh0aGlzLl90aW1lIT09bSYmdGhpcy5fZmlyc3R8fGl8fHUpKXJldHVybiBkIT09dGhpcy5fdG90YWxUaW1lJiZ0aGlzLl9vblVwZGF0ZSYmKGV8fHRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8bikpLHZvaWQgMDtpZih0aGlzLl9pbml0dGVkfHwodGhpcy5faW5pdHRlZD0hMCksdGhpcy5fYWN0aXZlfHwhdGhpcy5fcGF1c2VkJiZ0aGlzLl90b3RhbFRpbWUhPT1kJiZ0PjAmJih0aGlzLl9hY3RpdmU9ITApLDA9PT1kJiZ0aGlzLnZhcnMub25TdGFydCYmMCE9PXRoaXMuX3RvdGFsVGltZSYmKGV8fHRoaXMudmFycy5vblN0YXJ0LmFwcGx5KHRoaXMudmFycy5vblN0YXJ0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uU3RhcnRQYXJhbXN8fG4pKSx0aGlzLl90aW1lPj1tKWZvcihzPXRoaXMuX2ZpcnN0O3MmJihsPXMuX25leHQsIXRoaXMuX3BhdXNlZHx8VCk7KShzLl9hY3RpdmV8fHMuX3N0YXJ0VGltZTw9dGhpcy5fdGltZSYmIXMuX3BhdXNlZCYmIXMuX2djKSYmKHMuX3JldmVyc2VkP3MucmVuZGVyKChzLl9kaXJ0eT9zLnRvdGFsRHVyYXRpb24oKTpzLl90b3RhbER1cmF0aW9uKS0odC1zLl9zdGFydFRpbWUpKnMuX3RpbWVTY2FsZSxlLGkpOnMucmVuZGVyKCh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSkpLHM9bDtlbHNlIGZvcihzPXRoaXMuX2xhc3Q7cyYmKGw9cy5fcHJldiwhdGhpcy5fcGF1c2VkfHxUKTspKHMuX2FjdGl2ZXx8bT49cy5fc3RhcnRUaW1lJiYhcy5fcGF1c2VkJiYhcy5fZ2MpJiYocy5fcmV2ZXJzZWQ/cy5yZW5kZXIoKHMuX2RpcnR5P3MudG90YWxEdXJhdGlvbigpOnMuX3RvdGFsRHVyYXRpb24pLSh0LXMuX3N0YXJ0VGltZSkqcy5fdGltZVNjYWxlLGUsaSk6cy5yZW5kZXIoKHQtcy5fc3RhcnRUaW1lKSpzLl90aW1lU2NhbGUsZSxpKSkscz1sO3RoaXMuX29uVXBkYXRlJiYoZXx8KG8ubGVuZ3RoJiZoKCksdGhpcy5fb25VcGRhdGUuYXBwbHkodGhpcy52YXJzLm9uVXBkYXRlU2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uVXBkYXRlUGFyYW1zfHxuKSkpLF8mJih0aGlzLl9sb2NrZWR8fHRoaXMuX2djfHwoZz09PXRoaXMuX3N0YXJ0VGltZXx8diE9PXRoaXMuX3RpbWVTY2FsZSkmJigwPT09dGhpcy5fdGltZXx8Yz49dGhpcy50b3RhbER1cmF0aW9uKCkpJiYoYSYmKG8ubGVuZ3RoJiZoKCksdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuJiZ0aGlzLl9lbmFibGVkKCExLCExKSx0aGlzLl9hY3RpdmU9ITEpLCFlJiZ0aGlzLnZhcnNbX10mJnRoaXMudmFyc1tfXS5hcHBseSh0aGlzLnZhcnNbXytcIlNjb3BlXCJdfHx0aGlzLHRoaXMudmFyc1tfK1wiUGFyYW1zXCJdfHxuKSkpfSxfLmdldEFjdGl2ZT1mdW5jdGlvbih0LGUsaSl7bnVsbD09dCYmKHQ9ITApLG51bGw9PWUmJihlPSEwKSxudWxsPT1pJiYoaT0hMSk7dmFyIHMscixuPVtdLGE9dGhpcy5nZXRDaGlsZHJlbih0LGUsaSksbz0wLGg9YS5sZW5ndGg7Zm9yKHM9MDtoPnM7cysrKXI9YVtzXSxyLmlzQWN0aXZlKCkmJihuW28rK109cik7cmV0dXJuIG59LF8uZ2V0TGFiZWxBZnRlcj1mdW5jdGlvbih0KXt0fHwwIT09dCYmKHQ9dGhpcy5fdGltZSk7dmFyIGUsaT10aGlzLmdldExhYmVsc0FycmF5KCkscz1pLmxlbmd0aDtmb3IoZT0wO3M+ZTtlKyspaWYoaVtlXS50aW1lPnQpcmV0dXJuIGlbZV0ubmFtZTtyZXR1cm4gbnVsbH0sXy5nZXRMYWJlbEJlZm9yZT1mdW5jdGlvbih0KXtudWxsPT10JiYodD10aGlzLl90aW1lKTtmb3IodmFyIGU9dGhpcy5nZXRMYWJlbHNBcnJheSgpLGk9ZS5sZW5ndGg7LS1pPi0xOylpZih0PmVbaV0udGltZSlyZXR1cm4gZVtpXS5uYW1lO3JldHVybiBudWxsfSxfLmdldExhYmVsc0FycmF5PWZ1bmN0aW9uKCl7dmFyIHQsZT1bXSxpPTA7Zm9yKHQgaW4gdGhpcy5fbGFiZWxzKWVbaSsrXT17dGltZTp0aGlzLl9sYWJlbHNbdF0sbmFtZTp0fTtyZXR1cm4gZS5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQudGltZS1lLnRpbWV9KSxlfSxfLnByb2dyZXNzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy5kdXJhdGlvbigpKih0aGlzLl95b3lvJiYwIT09KDEmdGhpcy5fY3ljbGUpPzEtdDp0KSt0aGlzLl9jeWNsZSoodGhpcy5fZHVyYXRpb24rdGhpcy5fcmVwZWF0RGVsYXkpLGUpOnRoaXMuX3RpbWUvdGhpcy5kdXJhdGlvbigpfSxfLnRvdGFsUHJvZ3Jlc3M9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD90aGlzLnRvdGFsVGltZSh0aGlzLnRvdGFsRHVyYXRpb24oKSp0LGUpOnRoaXMuX3RvdGFsVGltZS90aGlzLnRvdGFsRHVyYXRpb24oKX0sXy50b3RhbER1cmF0aW9uPWZ1bmN0aW9uKGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPy0xPT09dGhpcy5fcmVwZWF0P3RoaXM6dGhpcy5kdXJhdGlvbigoZS10aGlzLl9yZXBlYXQqdGhpcy5fcmVwZWF0RGVsYXkpLyh0aGlzLl9yZXBlYXQrMSkpOih0aGlzLl9kaXJ0eSYmKHQucHJvdG90eXBlLnRvdGFsRHVyYXRpb24uY2FsbCh0aGlzKSx0aGlzLl90b3RhbER1cmF0aW9uPS0xPT09dGhpcy5fcmVwZWF0Pzk5OTk5OTk5OTk5OTp0aGlzLl9kdXJhdGlvbioodGhpcy5fcmVwZWF0KzEpK3RoaXMuX3JlcGVhdERlbGF5KnRoaXMuX3JlcGVhdCksdGhpcy5fdG90YWxEdXJhdGlvbil9LF8udGltZT1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCksdD50aGlzLl9kdXJhdGlvbiYmKHQ9dGhpcy5fZHVyYXRpb24pLHRoaXMuX3lveW8mJjAhPT0oMSZ0aGlzLl9jeWNsZSk/dD10aGlzLl9kdXJhdGlvbi10K3RoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSk6MCE9PXRoaXMuX3JlcGVhdCYmKHQrPXRoaXMuX2N5Y2xlKih0aGlzLl9kdXJhdGlvbit0aGlzLl9yZXBlYXREZWxheSkpLHRoaXMudG90YWxUaW1lKHQsZSkpOnRoaXMuX3RpbWV9LF8ucmVwZWF0PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZXBlYXQ9dCx0aGlzLl91bmNhY2hlKCEwKSk6dGhpcy5fcmVwZWF0fSxfLnJlcGVhdERlbGF5PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZXBlYXREZWxheT10LHRoaXMuX3VuY2FjaGUoITApKTp0aGlzLl9yZXBlYXREZWxheX0sXy55b3lvPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl95b3lvPXQsdGhpcyk6dGhpcy5feW95b30sXy5jdXJyZW50TGFiZWw9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy5zZWVrKHQsITApOnRoaXMuZ2V0TGFiZWxCZWZvcmUodGhpcy5fdGltZSsxZS04KX0sc30sITApLGZ1bmN0aW9uKCl7dmFyIHQ9MTgwL01hdGguUEksZT1bXSxpPVtdLHM9W10scj17fSxuPWZ1bmN0aW9uKHQsZSxpLHMpe3RoaXMuYT10LHRoaXMuYj1lLHRoaXMuYz1pLHRoaXMuZD1zLHRoaXMuZGE9cy10LHRoaXMuY2E9aS10LHRoaXMuYmE9ZS10fSxhPVwiLHgseSx6LGxlZnQsdG9wLHJpZ2h0LGJvdHRvbSxtYXJnaW5Ub3AsbWFyZ2luTGVmdCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20scGFkZGluZ0xlZnQscGFkZGluZ1RvcCxwYWRkaW5nUmlnaHQscGFkZGluZ0JvdHRvbSxiYWNrZ3JvdW5kUG9zaXRpb24sYmFja2dyb3VuZFBvc2l0aW9uX3ksXCIsbz1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcj17YTp0fSxuPXt9LGE9e30sbz17YzpzfSxoPSh0K2UpLzIsbD0oZStpKS8yLF89KGkrcykvMix1PShoK2wpLzIscD0obCtfKS8yLGM9KHAtdSkvODtyZXR1cm4gci5iPWgrKHQtaCkvNCxuLmI9dStjLHIuYz1uLmE9KHIuYituLmIpLzIsbi5jPWEuYT0odStwKS8yLGEuYj1wLWMsby5iPV8rKHMtXykvNCxhLmM9by5hPShhLmIrby5iKS8yLFtyLG4sYSxvXX0saD1mdW5jdGlvbih0LHIsbixhLGgpe3ZhciBsLF8sdSxwLGMsZixtLGQsZyx2LHksVCx3LHg9dC5sZW5ndGgtMSxiPTAsUD10WzBdLmE7Zm9yKGw9MDt4Pmw7bCsrKWM9dFtiXSxfPWMuYSx1PWMuZCxwPXRbYisxXS5kLGg/KHk9ZVtsXSxUPWlbbF0sdz0uMjUqKFQreSkqci8oYT8uNTpzW2xdfHwuNSksZj11LSh1LV8pKihhPy41KnI6MCE9PXk/dy95OjApLG09dSsocC11KSooYT8uNSpyOjAhPT1UP3cvVDowKSxkPXUtKGYrKChtLWYpKigzKnkvKHkrVCkrLjUpLzR8fDApKSk6KGY9dS0uNSoodS1fKSpyLG09dSsuNSoocC11KSpyLGQ9dS0oZittKS8yKSxmKz1kLG0rPWQsYy5jPWc9ZixjLmI9MCE9PWw/UDpQPWMuYSsuNiooYy5jLWMuYSksYy5kYT11LV8sYy5jYT1nLV8sYy5iYT1QLV8sbj8odj1vKF8sUCxnLHUpLHQuc3BsaWNlKGIsMSx2WzBdLHZbMV0sdlsyXSx2WzNdKSxiKz00KTpiKyssUD1tO2M9dFtiXSxjLmI9UCxjLmM9UCsuNCooYy5kLVApLGMuZGE9Yy5kLWMuYSxjLmNhPWMuYy1jLmEsYy5iYT1QLWMuYSxuJiYodj1vKGMuYSxQLGMuYyxjLmQpLHQuc3BsaWNlKGIsMSx2WzBdLHZbMV0sdlsyXSx2WzNdKSl9LGw9ZnVuY3Rpb24odCxzLHIsYSl7dmFyIG8saCxsLF8sdSxwLGM9W107aWYoYSlmb3IodD1bYV0uY29uY2F0KHQpLGg9dC5sZW5ndGg7LS1oPi0xOylcInN0cmluZ1wiPT10eXBlb2YocD10W2hdW3NdKSYmXCI9XCI9PT1wLmNoYXJBdCgxKSYmKHRbaF1bc109YVtzXStOdW1iZXIocC5jaGFyQXQoMCkrcC5zdWJzdHIoMikpKTtpZihvPXQubGVuZ3RoLTIsMD5vKXJldHVybiBjWzBdPW5ldyBuKHRbMF1bc10sMCwwLHRbLTE+bz8wOjFdW3NdKSxjO2ZvcihoPTA7bz5oO2grKylsPXRbaF1bc10sXz10W2grMV1bc10sY1toXT1uZXcgbihsLDAsMCxfKSxyJiYodT10W2grMl1bc10sZVtoXT0oZVtoXXx8MCkrKF8tbCkqKF8tbCksaVtoXT0oaVtoXXx8MCkrKHUtXykqKHUtXykpO3JldHVybiBjW2hdPW5ldyBuKHRbaF1bc10sMCwwLHRbaCsxXVtzXSksY30sXz1mdW5jdGlvbih0LG4sbyxfLHUscCl7dmFyIGMsZixtLGQsZyx2LHksVCx3PXt9LHg9W10sYj1wfHx0WzBdO3U9XCJzdHJpbmdcIj09dHlwZW9mIHU/XCIsXCIrdStcIixcIjphLG51bGw9PW4mJihuPTEpO2ZvcihmIGluIHRbMF0peC5wdXNoKGYpO2lmKHQubGVuZ3RoPjEpe2ZvcihUPXRbdC5sZW5ndGgtMV0seT0hMCxjPXgubGVuZ3RoOy0tYz4tMTspaWYoZj14W2NdLE1hdGguYWJzKGJbZl0tVFtmXSk+LjA1KXt5PSExO2JyZWFrfXkmJih0PXQuY29uY2F0KCkscCYmdC51bnNoaWZ0KHApLHQucHVzaCh0WzFdKSxwPXRbdC5sZW5ndGgtM10pfWZvcihlLmxlbmd0aD1pLmxlbmd0aD1zLmxlbmd0aD0wLGM9eC5sZW5ndGg7LS1jPi0xOylmPXhbY10scltmXT0tMSE9PXUuaW5kZXhPZihcIixcIitmK1wiLFwiKSx3W2ZdPWwodCxmLHJbZl0scCk7Zm9yKGM9ZS5sZW5ndGg7LS1jPi0xOyllW2NdPU1hdGguc3FydChlW2NdKSxpW2NdPU1hdGguc3FydChpW2NdKTtpZighXyl7Zm9yKGM9eC5sZW5ndGg7LS1jPi0xOylpZihyW2ZdKWZvcihtPXdbeFtjXV0sdj1tLmxlbmd0aC0xLGQ9MDt2PmQ7ZCsrKWc9bVtkKzFdLmRhL2lbZF0rbVtkXS5kYS9lW2RdLHNbZF09KHNbZF18fDApK2cqZztmb3IoYz1zLmxlbmd0aDstLWM+LTE7KXNbY109TWF0aC5zcXJ0KHNbY10pfWZvcihjPXgubGVuZ3RoLGQ9bz80OjE7LS1jPi0xOylmPXhbY10sbT13W2ZdLGgobSxuLG8sXyxyW2ZdKSx5JiYobS5zcGxpY2UoMCxkKSxtLnNwbGljZShtLmxlbmd0aC1kLGQpKTtyZXR1cm4gd30sdT1mdW5jdGlvbih0LGUsaSl7ZT1lfHxcInNvZnRcIjt2YXIgcyxyLGEsbyxoLGwsXyx1LHAsYyxmLG09e30sZD1cImN1YmljXCI9PT1lPzM6MixnPVwic29mdFwiPT09ZSx2PVtdO2lmKGcmJmkmJih0PVtpXS5jb25jYXQodCkpLG51bGw9PXR8fGQrMT50Lmxlbmd0aCl0aHJvd1wiaW52YWxpZCBCZXppZXIgZGF0YVwiO2ZvcihwIGluIHRbMF0pdi5wdXNoKHApO2ZvcihsPXYubGVuZ3RoOy0tbD4tMTspe2ZvcihwPXZbbF0sbVtwXT1oPVtdLGM9MCx1PXQubGVuZ3RoLF89MDt1Pl87XysrKXM9bnVsbD09aT90W19dW3BdOlwic3RyaW5nXCI9PXR5cGVvZihmPXRbX11bcF0pJiZcIj1cIj09PWYuY2hhckF0KDEpP2lbcF0rTnVtYmVyKGYuY2hhckF0KDApK2Yuc3Vic3RyKDIpKTpOdW1iZXIoZiksZyYmXz4xJiZ1LTE+XyYmKGhbYysrXT0ocytoW2MtMl0pLzIpLGhbYysrXT1zO2Zvcih1PWMtZCsxLGM9MCxfPTA7dT5fO18rPWQpcz1oW19dLHI9aFtfKzFdLGE9aFtfKzJdLG89Mj09PWQ/MDpoW18rM10saFtjKytdPWY9Mz09PWQ/bmV3IG4ocyxyLGEsbyk6bmV3IG4ocywoMipyK3MpLzMsKDIqcithKS8zLGEpO2gubGVuZ3RoPWN9cmV0dXJuIG19LHA9ZnVuY3Rpb24odCxlLGkpe2Zvcih2YXIgcyxyLG4sYSxvLGgsbCxfLHUscCxjLGY9MS9pLG09dC5sZW5ndGg7LS1tPi0xOylmb3IocD10W21dLG49cC5hLGE9cC5kLW4sbz1wLmMtbixoPXAuYi1uLHM9cj0wLF89MTtpPj1fO18rKylsPWYqXyx1PTEtbCxzPXItKHI9KGwqbCphKzMqdSoobCpvK3UqaCkpKmwpLGM9bSppK18tMSxlW2NdPShlW2NdfHwwKStzKnN9LGM9ZnVuY3Rpb24odCxlKXtlPWU+PjB8fDY7dmFyIGkscyxyLG4sYT1bXSxvPVtdLGg9MCxsPTAsXz1lLTEsdT1bXSxjPVtdO2ZvcihpIGluIHQpcCh0W2ldLGEsZSk7Zm9yKHI9YS5sZW5ndGgscz0wO3I+cztzKyspaCs9TWF0aC5zcXJ0KGFbc10pLG49cyVlLGNbbl09aCxuPT09XyYmKGwrPWgsbj1zL2U+PjAsdVtuXT1jLG9bbl09bCxoPTAsYz1bXSk7cmV0dXJue2xlbmd0aDpsLGxlbmd0aHM6byxzZWdtZW50czp1fX0sZj1fZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtwcm9wTmFtZTpcImJlemllclwiLHByaW9yaXR5Oi0xLHZlcnNpb246XCIxLjMuM1wiLEFQSToyLGdsb2JhbDohMCxpbml0OmZ1bmN0aW9uKHQsZSxpKXt0aGlzLl90YXJnZXQ9dCxlIGluc3RhbmNlb2YgQXJyYXkmJihlPXt2YWx1ZXM6ZX0pLHRoaXMuX2Z1bmM9e30sdGhpcy5fcm91bmQ9e30sdGhpcy5fcHJvcHM9W10sdGhpcy5fdGltZVJlcz1udWxsPT1lLnRpbWVSZXNvbHV0aW9uPzY6cGFyc2VJbnQoZS50aW1lUmVzb2x1dGlvbiwxMCk7dmFyIHMscixuLGEsbyxoPWUudmFsdWVzfHxbXSxsPXt9LHA9aFswXSxmPWUuYXV0b1JvdGF0ZXx8aS52YXJzLm9yaWVudFRvQmV6aWVyO3RoaXMuX2F1dG9Sb3RhdGU9Zj9mIGluc3RhbmNlb2YgQXJyYXk/ZjpbW1wieFwiLFwieVwiLFwicm90YXRpb25cIixmPT09ITA/MDpOdW1iZXIoZil8fDBdXTpudWxsO2ZvcihzIGluIHApdGhpcy5fcHJvcHMucHVzaChzKTtmb3Iobj10aGlzLl9wcm9wcy5sZW5ndGg7LS1uPi0xOylzPXRoaXMuX3Byb3BzW25dLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocykscj10aGlzLl9mdW5jW3NdPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRbc10sbFtzXT1yP3Rbcy5pbmRleE9mKFwic2V0XCIpfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0W1wiZ2V0XCIrcy5zdWJzdHIoMyldP3M6XCJnZXRcIitzLnN1YnN0cigzKV0oKTpwYXJzZUZsb2F0KHRbc10pLG98fGxbc10hPT1oWzBdW3NdJiYobz1sKTtpZih0aGlzLl9iZXppZXJzPVwiY3ViaWNcIiE9PWUudHlwZSYmXCJxdWFkcmF0aWNcIiE9PWUudHlwZSYmXCJzb2Z0XCIhPT1lLnR5cGU/XyhoLGlzTmFOKGUuY3VydmluZXNzKT8xOmUuY3VydmluZXNzLCExLFwidGhydUJhc2ljXCI9PT1lLnR5cGUsZS5jb3JyZWxhdGUsbyk6dShoLGUudHlwZSxsKSx0aGlzLl9zZWdDb3VudD10aGlzLl9iZXppZXJzW3NdLmxlbmd0aCx0aGlzLl90aW1lUmVzKXt2YXIgbT1jKHRoaXMuX2JlemllcnMsdGhpcy5fdGltZVJlcyk7dGhpcy5fbGVuZ3RoPW0ubGVuZ3RoLHRoaXMuX2xlbmd0aHM9bS5sZW5ndGhzLHRoaXMuX3NlZ21lbnRzPW0uc2VnbWVudHMsdGhpcy5fbDE9dGhpcy5fbGk9dGhpcy5fczE9dGhpcy5fc2k9MCx0aGlzLl9sMj10aGlzLl9sZW5ndGhzWzBdLHRoaXMuX2N1clNlZz10aGlzLl9zZWdtZW50c1swXSx0aGlzLl9zMj10aGlzLl9jdXJTZWdbMF0sdGhpcy5fcHJlYz0xL3RoaXMuX2N1clNlZy5sZW5ndGh9aWYoZj10aGlzLl9hdXRvUm90YXRlKWZvcih0aGlzLl9pbml0aWFsUm90YXRpb25zPVtdLGZbMF1pbnN0YW5jZW9mIEFycmF5fHwodGhpcy5fYXV0b1JvdGF0ZT1mPVtmXSksbj1mLmxlbmd0aDstLW4+LTE7KXtmb3IoYT0wOzM+YTthKyspcz1mW25dW2FdLHRoaXMuX2Z1bmNbc109XCJmdW5jdGlvblwiPT10eXBlb2YgdFtzXT90W3MuaW5kZXhPZihcInNldFwiKXx8XCJmdW5jdGlvblwiIT10eXBlb2YgdFtcImdldFwiK3Muc3Vic3RyKDMpXT9zOlwiZ2V0XCIrcy5zdWJzdHIoMyldOiExO3M9ZltuXVsyXSx0aGlzLl9pbml0aWFsUm90YXRpb25zW25dPXRoaXMuX2Z1bmNbc10/dGhpcy5fZnVuY1tzXS5jYWxsKHRoaXMuX3RhcmdldCk6dGhpcy5fdGFyZ2V0W3NdfXJldHVybiB0aGlzLl9zdGFydFJhdGlvPWkudmFycy5ydW5CYWNrd2FyZHM/MTowLCEwfSxzZXQ6ZnVuY3Rpb24oZSl7dmFyIGkscyxyLG4sYSxvLGgsbCxfLHUscD10aGlzLl9zZWdDb3VudCxjPXRoaXMuX2Z1bmMsZj10aGlzLl90YXJnZXQsbT1lIT09dGhpcy5fc3RhcnRSYXRpbztpZih0aGlzLl90aW1lUmVzKXtpZihfPXRoaXMuX2xlbmd0aHMsdT10aGlzLl9jdXJTZWcsZSo9dGhpcy5fbGVuZ3RoLHI9dGhpcy5fbGksZT50aGlzLl9sMiYmcC0xPnIpe2ZvcihsPXAtMTtsPnImJmU+PSh0aGlzLl9sMj1fWysrcl0pOyk7dGhpcy5fbDE9X1tyLTFdLHRoaXMuX2xpPXIsdGhpcy5fY3VyU2VnPXU9dGhpcy5fc2VnbWVudHNbcl0sdGhpcy5fczI9dVt0aGlzLl9zMT10aGlzLl9zaT0wXX1lbHNlIGlmKHRoaXMuX2wxPmUmJnI+MCl7Zm9yKDtyPjAmJih0aGlzLl9sMT1fWy0tcl0pPj1lOyk7MD09PXImJnRoaXMuX2wxPmU/dGhpcy5fbDE9MDpyKyssdGhpcy5fbDI9X1tyXSx0aGlzLl9saT1yLHRoaXMuX2N1clNlZz11PXRoaXMuX3NlZ21lbnRzW3JdLHRoaXMuX3MxPXVbKHRoaXMuX3NpPXUubGVuZ3RoLTEpLTFdfHwwLHRoaXMuX3MyPXVbdGhpcy5fc2ldfWlmKGk9cixlLT10aGlzLl9sMSxyPXRoaXMuX3NpLGU+dGhpcy5fczImJnUubGVuZ3RoLTE+cil7Zm9yKGw9dS5sZW5ndGgtMTtsPnImJmU+PSh0aGlzLl9zMj11Wysrcl0pOyk7dGhpcy5fczE9dVtyLTFdLHRoaXMuX3NpPXJ9ZWxzZSBpZih0aGlzLl9zMT5lJiZyPjApe2Zvcig7cj4wJiYodGhpcy5fczE9dVstLXJdKT49ZTspOzA9PT1yJiZ0aGlzLl9zMT5lP3RoaXMuX3MxPTA6cisrLHRoaXMuX3MyPXVbcl0sdGhpcy5fc2k9clxufW89KHIrKGUtdGhpcy5fczEpLyh0aGlzLl9zMi10aGlzLl9zMSkpKnRoaXMuX3ByZWN9ZWxzZSBpPTA+ZT8wOmU+PTE/cC0xOnAqZT4+MCxvPShlLWkqKDEvcCkpKnA7Zm9yKHM9MS1vLHI9dGhpcy5fcHJvcHMubGVuZ3RoOy0tcj4tMTspbj10aGlzLl9wcm9wc1tyXSxhPXRoaXMuX2JlemllcnNbbl1baV0saD0obypvKmEuZGErMypzKihvKmEuY2ErcyphLmJhKSkqbythLmEsdGhpcy5fcm91bmRbbl0mJihoPU1hdGgucm91bmQoaCkpLGNbbl0/ZltuXShoKTpmW25dPWg7aWYodGhpcy5fYXV0b1JvdGF0ZSl7dmFyIGQsZyx2LHksVCx3LHgsYj10aGlzLl9hdXRvUm90YXRlO2ZvcihyPWIubGVuZ3RoOy0tcj4tMTspbj1iW3JdWzJdLHc9YltyXVszXXx8MCx4PWJbcl1bNF09PT0hMD8xOnQsYT10aGlzLl9iZXppZXJzW2Jbcl1bMF1dLGQ9dGhpcy5fYmV6aWVyc1tiW3JdWzFdXSxhJiZkJiYoYT1hW2ldLGQ9ZFtpXSxnPWEuYSsoYS5iLWEuYSkqbyx5PWEuYisoYS5jLWEuYikqbyxnKz0oeS1nKSpvLHkrPShhLmMrKGEuZC1hLmMpKm8teSkqbyx2PWQuYSsoZC5iLWQuYSkqbyxUPWQuYisoZC5jLWQuYikqbyx2Kz0oVC12KSpvLFQrPShkLmMrKGQuZC1kLmMpKm8tVCkqbyxoPW0/TWF0aC5hdGFuMihULXYseS1nKSp4K3c6dGhpcy5faW5pdGlhbFJvdGF0aW9uc1tyXSxjW25dP2Zbbl0oaCk6ZltuXT1oKX19fSksbT1mLnByb3RvdHlwZTtmLmJlemllclRocm91Z2g9XyxmLmN1YmljVG9RdWFkcmF0aWM9byxmLl9hdXRvQ1NTPSEwLGYucXVhZHJhdGljVG9DdWJpYz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIG5ldyBuKHQsKDIqZSt0KS8zLCgyKmUraSkvMyxpKX0sZi5fY3NzUmVnaXN0ZXI9ZnVuY3Rpb24oKXt2YXIgdD1fZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscy5DU1NQbHVnaW47aWYodCl7dmFyIGU9dC5faW50ZXJuYWxzLGk9ZS5fcGFyc2VUb1Byb3h5LHM9ZS5fc2V0UGx1Z2luUmF0aW8scj1lLkNTU1Byb3BUd2VlbjtlLl9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJlemllclwiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLG4sYSxvLGgpe2UgaW5zdGFuY2VvZiBBcnJheSYmKGU9e3ZhbHVlczplfSksaD1uZXcgZjt2YXIgbCxfLHUscD1lLnZhbHVlcyxjPXAubGVuZ3RoLTEsbT1bXSxkPXt9O2lmKDA+YylyZXR1cm4gbztmb3IobD0wO2M+PWw7bCsrKXU9aSh0LHBbbF0sYSxvLGgsYyE9PWwpLG1bbF09dS5lbmQ7Zm9yKF8gaW4gZSlkW19dPWVbX107cmV0dXJuIGQudmFsdWVzPW0sbz1uZXcgcih0LFwiYmV6aWVyXCIsMCwwLHUucHQsMiksby5kYXRhPXUsby5wbHVnaW49aCxvLnNldFJhdGlvPXMsMD09PWQuYXV0b1JvdGF0ZSYmKGQuYXV0b1JvdGF0ZT0hMCksIWQuYXV0b1JvdGF0ZXx8ZC5hdXRvUm90YXRlIGluc3RhbmNlb2YgQXJyYXl8fChsPWQuYXV0b1JvdGF0ZT09PSEwPzA6TnVtYmVyKGQuYXV0b1JvdGF0ZSksZC5hdXRvUm90YXRlPW51bGwhPXUuZW5kLmxlZnQ/W1tcImxlZnRcIixcInRvcFwiLFwicm90YXRpb25cIixsLCExXV06bnVsbCE9dS5lbmQueD9bW1wieFwiLFwieVwiLFwicm90YXRpb25cIixsLCExXV06ITEpLGQuYXV0b1JvdGF0ZSYmKGEuX3RyYW5zZm9ybXx8YS5fZW5hYmxlVHJhbnNmb3JtcyghMSksdS5hdXRvUm90YXRlPWEuX3RhcmdldC5fZ3NUcmFuc2Zvcm0pLGguX29uSW5pdFR3ZWVuKHUucHJveHksZCxhLl90d2Vlbiksb319KX19LG0uX3JvdW5kUHJvcHM9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGk9dGhpcy5fb3ZlcndyaXRlUHJvcHMscz1pLmxlbmd0aDstLXM+LTE7KSh0W2lbc11dfHx0LmJlemllcnx8dC5iZXppZXJUaHJvdWdoKSYmKHRoaXMuX3JvdW5kW2lbc11dPWUpfSxtLl9raWxsPWZ1bmN0aW9uKHQpe3ZhciBlLGkscz10aGlzLl9wcm9wcztmb3IoZSBpbiB0aGlzLl9iZXppZXJzKWlmKGUgaW4gdClmb3IoZGVsZXRlIHRoaXMuX2JlemllcnNbZV0sZGVsZXRlIHRoaXMuX2Z1bmNbZV0saT1zLmxlbmd0aDstLWk+LTE7KXNbaV09PT1lJiZzLnNwbGljZShpLDEpO3JldHVybiB0aGlzLl9zdXBlci5fa2lsbC5jYWxsKHRoaXMsdCl9fSgpLF9nc1Njb3BlLl9nc0RlZmluZShcInBsdWdpbnMuQ1NTUGx1Z2luXCIsW1wicGx1Z2lucy5Ud2VlblBsdWdpblwiLFwiVHdlZW5MaXRlXCJdLGZ1bmN0aW9uKHQsZSl7dmFyIGkscyxyLG4sYT1mdW5jdGlvbigpe3QuY2FsbCh0aGlzLFwiY3NzXCIpLHRoaXMuX292ZXJ3cml0ZVByb3BzLmxlbmd0aD0wLHRoaXMuc2V0UmF0aW89YS5wcm90b3R5cGUuc2V0UmF0aW99LG89e30saD1hLnByb3RvdHlwZT1uZXcgdChcImNzc1wiKTtoLmNvbnN0cnVjdG9yPWEsYS52ZXJzaW9uPVwiMS4xNC4xXCIsYS5BUEk9MixhLmRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZT0wLGEuZGVmYXVsdFNrZXdUeXBlPVwiY29tcGVuc2F0ZWRcIixoPVwicHhcIixhLnN1ZmZpeE1hcD17dG9wOmgscmlnaHQ6aCxib3R0b206aCxsZWZ0Omgsd2lkdGg6aCxoZWlnaHQ6aCxmb250U2l6ZTpoLHBhZGRpbmc6aCxtYXJnaW46aCxwZXJzcGVjdGl2ZTpoLGxpbmVIZWlnaHQ6XCJcIn07dmFyIGwsXyx1LHAsYyxmLG09Lyg/OlxcZHxcXC1cXGR8XFwuXFxkfFxcLVxcLlxcZCkrL2csZD0vKD86XFxkfFxcLVxcZHxcXC5cXGR8XFwtXFwuXFxkfFxcKz1cXGR8XFwtPVxcZHxcXCs9LlxcZHxcXC09XFwuXFxkKSsvZyxnPS8oPzpcXCs9fFxcLT18XFwtfFxcYilbXFxkXFwtXFwuXStbYS16QS1aMC05XSooPzolfFxcYikvZ2ksdj0vW15cXGRcXC1cXC5dL2cseT0vKD86XFxkfFxcLXxcXCt8PXwjfFxcLikqL2csVD0vb3BhY2l0eSAqPSAqKFteKV0qKS9pLHc9L29wYWNpdHk6KFteO10qKS9pLHg9L2FscGhhXFwob3BhY2l0eSAqPS4rP1xcKS9pLGI9L14ocmdifGhzbCkvLFA9LyhbQS1aXSkvZyxTPS8tKFthLXpdKS9naSxrPS8oXig/OnVybFxcKFxcXCJ8dXJsXFwoKSl8KD86KFxcXCJcXCkpJHxcXCkkKS9naSxSPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUudG9VcHBlckNhc2UoKX0sQT0vKD86TGVmdHxSaWdodHxXaWR0aCkvaSxPPS8oTTExfE0xMnxNMjF8TTIyKT1bXFxkXFwtXFwuZV0rL2dpLEM9L3Byb2dpZFxcOkRYSW1hZ2VUcmFuc2Zvcm1cXC5NaWNyb3NvZnRcXC5NYXRyaXhcXCguKz9cXCkvaSxEPS8sKD89W15cXCldKig/OlxcKHwkKSkvZ2ksTT1NYXRoLlBJLzE4MCx6PTE4MC9NYXRoLlBJLEk9e30sRT1kb2N1bWVudCxGPShFLmRvY3VtZW50RWxlbWVudCxFLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLEw9RS5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLE49YS5faW50ZXJuYWxzPXtfc3BlY2lhbFByb3BzOm99LFg9bmF2aWdhdG9yLnVzZXJBZ2VudCxVPWZ1bmN0aW9uKCl7dmFyIHQsZT1YLmluZGV4T2YoXCJBbmRyb2lkXCIpLGk9RS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVybiB1PS0xIT09WC5pbmRleE9mKFwiU2FmYXJpXCIpJiYtMT09PVguaW5kZXhPZihcIkNocm9tZVwiKSYmKC0xPT09ZXx8TnVtYmVyKFguc3Vic3RyKGUrOCwxKSk+MyksYz11JiY2Pk51bWJlcihYLnN1YnN0cihYLmluZGV4T2YoXCJWZXJzaW9uL1wiKSs4LDEpKSxwPS0xIT09WC5pbmRleE9mKFwiRmlyZWZveFwiKSwoL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvLmV4ZWMoWCl8fC9UcmlkZW50XFwvLipydjooWzAtOV17MSx9W1xcLjAtOV17MCx9KS8uZXhlYyhYKSkmJihmPXBhcnNlRmxvYXQoUmVnRXhwLiQxKSksaS5pbm5lckhUTUw9XCI8YSBzdHlsZT0ndG9wOjFweDtvcGFjaXR5Oi41NTsnPmE8L2E+XCIsdD1pLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSx0Py9eMC41NS8udGVzdCh0LnN0eWxlLm9wYWNpdHkpOiExfSgpLFk9ZnVuY3Rpb24odCl7cmV0dXJuIFQudGVzdChcInN0cmluZ1wiPT10eXBlb2YgdD90Oih0LmN1cnJlbnRTdHlsZT90LmN1cnJlbnRTdHlsZS5maWx0ZXI6dC5zdHlsZS5maWx0ZXIpfHxcIlwiKT9wYXJzZUZsb2F0KFJlZ0V4cC4kMSkvMTAwOjF9LGo9ZnVuY3Rpb24odCl7d2luZG93LmNvbnNvbGUmJmNvbnNvbGUubG9nKHQpfSxCPVwiXCIscT1cIlwiLFY9ZnVuY3Rpb24odCxlKXtlPWV8fEY7dmFyIGkscyxyPWUuc3R5bGU7aWYodm9pZCAwIT09clt0XSlyZXR1cm4gdDtmb3IodD10LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK3Quc3Vic3RyKDEpLGk9W1wiT1wiLFwiTW96XCIsXCJtc1wiLFwiTXNcIixcIldlYmtpdFwiXSxzPTU7LS1zPi0xJiZ2b2lkIDA9PT1yW2lbc10rdF07KTtyZXR1cm4gcz49MD8ocT0zPT09cz9cIm1zXCI6aVtzXSxCPVwiLVwiK3EudG9Mb3dlckNhc2UoKStcIi1cIixxK3QpOm51bGx9LEc9RS5kZWZhdWx0Vmlldz9FLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGU6ZnVuY3Rpb24oKXt9LFc9YS5nZXRTdHlsZT1mdW5jdGlvbih0LGUsaSxzLHIpe3ZhciBuO3JldHVybiBVfHxcIm9wYWNpdHlcIiE9PWU/KCFzJiZ0LnN0eWxlW2VdP249dC5zdHlsZVtlXTooaT1pfHxHKHQpKT9uPWlbZV18fGkuZ2V0UHJvcGVydHlWYWx1ZShlKXx8aS5nZXRQcm9wZXJ0eVZhbHVlKGUucmVwbGFjZShQLFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpOnQuY3VycmVudFN0eWxlJiYobj10LmN1cnJlbnRTdHlsZVtlXSksbnVsbD09cnx8biYmXCJub25lXCIhPT1uJiZcImF1dG9cIiE9PW4mJlwiYXV0byBhdXRvXCIhPT1uP246cik6WSh0KX0sUT1OLmNvbnZlcnRUb1BpeGVscz1mdW5jdGlvbih0LGkscyxyLG4pe2lmKFwicHhcIj09PXJ8fCFyKXJldHVybiBzO2lmKFwiYXV0b1wiPT09cnx8IXMpcmV0dXJuIDA7dmFyIG8saCxsLF89QS50ZXN0KGkpLHU9dCxwPUYuc3R5bGUsYz0wPnM7aWYoYyYmKHM9LXMpLFwiJVwiPT09ciYmLTEhPT1pLmluZGV4T2YoXCJib3JkZXJcIikpbz1zLzEwMCooXz90LmNsaWVudFdpZHRoOnQuY2xpZW50SGVpZ2h0KTtlbHNle2lmKHAuY3NzVGV4dD1cImJvcmRlcjowIHNvbGlkIHJlZDtwb3NpdGlvbjpcIitXKHQsXCJwb3NpdGlvblwiKStcIjtsaW5lLWhlaWdodDowO1wiLFwiJVwiIT09ciYmdS5hcHBlbmRDaGlsZClwW18/XCJib3JkZXJMZWZ0V2lkdGhcIjpcImJvcmRlclRvcFdpZHRoXCJdPXMrcjtlbHNle2lmKHU9dC5wYXJlbnROb2RlfHxFLmJvZHksaD11Ll9nc0NhY2hlLGw9ZS50aWNrZXIuZnJhbWUsaCYmXyYmaC50aW1lPT09bClyZXR1cm4gaC53aWR0aCpzLzEwMDtwW18/XCJ3aWR0aFwiOlwiaGVpZ2h0XCJdPXMrcn11LmFwcGVuZENoaWxkKEYpLG89cGFyc2VGbG9hdChGW18/XCJvZmZzZXRXaWR0aFwiOlwib2Zmc2V0SGVpZ2h0XCJdKSx1LnJlbW92ZUNoaWxkKEYpLF8mJlwiJVwiPT09ciYmYS5jYWNoZVdpZHRocyE9PSExJiYoaD11Ll9nc0NhY2hlPXUuX2dzQ2FjaGV8fHt9LGgudGltZT1sLGgud2lkdGg9MTAwKihvL3MpKSwwIT09b3x8bnx8KG89USh0LGkscyxyLCEwKSl9cmV0dXJuIGM/LW86b30sWj1OLmNhbGN1bGF0ZU9mZnNldD1mdW5jdGlvbih0LGUsaSl7aWYoXCJhYnNvbHV0ZVwiIT09Vyh0LFwicG9zaXRpb25cIixpKSlyZXR1cm4gMDt2YXIgcz1cImxlZnRcIj09PWU/XCJMZWZ0XCI6XCJUb3BcIixyPVcodCxcIm1hcmdpblwiK3MsaSk7cmV0dXJuIHRbXCJvZmZzZXRcIitzXS0oUSh0LGUscGFyc2VGbG9hdChyKSxyLnJlcGxhY2UoeSxcIlwiKSl8fDApfSwkPWZ1bmN0aW9uKHQsZSl7dmFyIGkscyxyPXt9O2lmKGU9ZXx8Ryh0LG51bGwpKWlmKGk9ZS5sZW5ndGgpZm9yKDstLWk+LTE7KXJbZVtpXS5yZXBsYWNlKFMsUildPWUuZ2V0UHJvcGVydHlWYWx1ZShlW2ldKTtlbHNlIGZvcihpIGluIGUpcltpXT1lW2ldO2Vsc2UgaWYoZT10LmN1cnJlbnRTdHlsZXx8dC5zdHlsZSlmb3IoaSBpbiBlKVwic3RyaW5nXCI9PXR5cGVvZiBpJiZ2b2lkIDA9PT1yW2ldJiYocltpLnJlcGxhY2UoUyxSKV09ZVtpXSk7cmV0dXJuIFV8fChyLm9wYWNpdHk9WSh0KSkscz1SZSh0LGUsITEpLHIucm90YXRpb249cy5yb3RhdGlvbixyLnNrZXdYPXMuc2tld1gsci5zY2FsZVg9cy5zY2FsZVgsci5zY2FsZVk9cy5zY2FsZVksci54PXMueCxyLnk9cy55LHhlJiYoci56PXMueixyLnJvdGF0aW9uWD1zLnJvdGF0aW9uWCxyLnJvdGF0aW9uWT1zLnJvdGF0aW9uWSxyLnNjYWxlWj1zLnNjYWxlWiksci5maWx0ZXJzJiZkZWxldGUgci5maWx0ZXJzLHJ9LEg9ZnVuY3Rpb24odCxlLGkscyxyKXt2YXIgbixhLG8saD17fSxsPXQuc3R5bGU7Zm9yKGEgaW4gaSlcImNzc1RleHRcIiE9PWEmJlwibGVuZ3RoXCIhPT1hJiZpc05hTihhKSYmKGVbYV0hPT0obj1pW2FdKXx8ciYmclthXSkmJi0xPT09YS5pbmRleE9mKFwiT3JpZ2luXCIpJiYoXCJudW1iZXJcIj09dHlwZW9mIG58fFwic3RyaW5nXCI9PXR5cGVvZiBuKSYmKGhbYV09XCJhdXRvXCIhPT1ufHxcImxlZnRcIiE9PWEmJlwidG9wXCIhPT1hP1wiXCIhPT1uJiZcImF1dG9cIiE9PW4mJlwibm9uZVwiIT09bnx8XCJzdHJpbmdcIiE9dHlwZW9mIGVbYV18fFwiXCI9PT1lW2FdLnJlcGxhY2UodixcIlwiKT9uOjA6Wih0LGEpLHZvaWQgMCE9PWxbYV0mJihvPW5ldyB1ZShsLGEsbFthXSxvKSkpO2lmKHMpZm9yKGEgaW4gcylcImNsYXNzTmFtZVwiIT09YSYmKGhbYV09c1thXSk7cmV0dXJue2RpZnM6aCxmaXJzdE1QVDpvfX0sSz17d2lkdGg6W1wiTGVmdFwiLFwiUmlnaHRcIl0saGVpZ2h0OltcIlRvcFwiLFwiQm90dG9tXCJdfSxKPVtcIm1hcmdpbkxlZnRcIixcIm1hcmdpblJpZ2h0XCIsXCJtYXJnaW5Ub3BcIixcIm1hcmdpbkJvdHRvbVwiXSx0ZT1mdW5jdGlvbih0LGUsaSl7dmFyIHM9cGFyc2VGbG9hdChcIndpZHRoXCI9PT1lP3Qub2Zmc2V0V2lkdGg6dC5vZmZzZXRIZWlnaHQpLHI9S1tlXSxuPXIubGVuZ3RoO2ZvcihpPWl8fEcodCxudWxsKTstLW4+LTE7KXMtPXBhcnNlRmxvYXQoVyh0LFwicGFkZGluZ1wiK3Jbbl0saSwhMCkpfHwwLHMtPXBhcnNlRmxvYXQoVyh0LFwiYm9yZGVyXCIrcltuXStcIldpZHRoXCIsaSwhMCkpfHwwO3JldHVybiBzfSxlZT1mdW5jdGlvbih0LGUpeyhudWxsPT10fHxcIlwiPT09dHx8XCJhdXRvXCI9PT10fHxcImF1dG8gYXV0b1wiPT09dCkmJih0PVwiMCAwXCIpO3ZhciBpPXQuc3BsaXQoXCIgXCIpLHM9LTEhPT10LmluZGV4T2YoXCJsZWZ0XCIpP1wiMCVcIjotMSE9PXQuaW5kZXhPZihcInJpZ2h0XCIpP1wiMTAwJVwiOmlbMF0scj0tMSE9PXQuaW5kZXhPZihcInRvcFwiKT9cIjAlXCI6LTEhPT10LmluZGV4T2YoXCJib3R0b21cIik/XCIxMDAlXCI6aVsxXTtyZXR1cm4gbnVsbD09cj9yPVwiMFwiOlwiY2VudGVyXCI9PT1yJiYocj1cIjUwJVwiKSwoXCJjZW50ZXJcIj09PXN8fGlzTmFOKHBhcnNlRmxvYXQocykpJiYtMT09PShzK1wiXCIpLmluZGV4T2YoXCI9XCIpKSYmKHM9XCI1MCVcIiksZSYmKGUub3hwPS0xIT09cy5pbmRleE9mKFwiJVwiKSxlLm95cD0tMSE9PXIuaW5kZXhPZihcIiVcIiksZS5veHI9XCI9XCI9PT1zLmNoYXJBdCgxKSxlLm95cj1cIj1cIj09PXIuY2hhckF0KDEpLGUub3g9cGFyc2VGbG9hdChzLnJlcGxhY2UodixcIlwiKSksZS5veT1wYXJzZUZsb2F0KHIucmVwbGFjZSh2LFwiXCIpKSkscytcIiBcIityKyhpLmxlbmd0aD4yP1wiIFwiK2lbMl06XCJcIil9LGllPWZ1bmN0aW9uKHQsZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHQmJlwiPVwiPT09dC5jaGFyQXQoMSk/cGFyc2VJbnQodC5jaGFyQXQoMCkrXCIxXCIsMTApKnBhcnNlRmxvYXQodC5zdWJzdHIoMikpOnBhcnNlRmxvYXQodCktcGFyc2VGbG9hdChlKX0sc2U9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbD09dD9lOlwic3RyaW5nXCI9PXR5cGVvZiB0JiZcIj1cIj09PXQuY2hhckF0KDEpP3BhcnNlSW50KHQuY2hhckF0KDApK1wiMVwiLDEwKSpwYXJzZUZsb2F0KHQuc3Vic3RyKDIpKStlOnBhcnNlRmxvYXQodCl9LHJlPWZ1bmN0aW9uKHQsZSxpLHMpe3ZhciByLG4sYSxvLGg9MWUtNjtyZXR1cm4gbnVsbD09dD9vPWU6XCJudW1iZXJcIj09dHlwZW9mIHQ/bz10OihyPTM2MCxuPXQuc3BsaXQoXCJfXCIpLGE9TnVtYmVyKG5bMF0ucmVwbGFjZSh2LFwiXCIpKSooLTE9PT10LmluZGV4T2YoXCJyYWRcIik/MTp6KS0oXCI9XCI9PT10LmNoYXJBdCgxKT8wOmUpLG4ubGVuZ3RoJiYocyYmKHNbaV09ZSthKSwtMSE9PXQuaW5kZXhPZihcInNob3J0XCIpJiYoYSU9cixhIT09YSUoci8yKSYmKGE9MD5hP2ErcjphLXIpKSwtMSE9PXQuaW5kZXhPZihcIl9jd1wiKSYmMD5hP2E9KGErOTk5OTk5OTk5OSpyKSVyLSgwfGEvcikqcjotMSE9PXQuaW5kZXhPZihcImNjd1wiKSYmYT4wJiYoYT0oYS05OTk5OTk5OTk5KnIpJXItKDB8YS9yKSpyKSksbz1lK2EpLGg+byYmbz4taCYmKG89MCksb30sbmU9e2FxdWE6WzAsMjU1LDI1NV0sbGltZTpbMCwyNTUsMF0sc2lsdmVyOlsxOTIsMTkyLDE5Ml0sYmxhY2s6WzAsMCwwXSxtYXJvb246WzEyOCwwLDBdLHRlYWw6WzAsMTI4LDEyOF0sYmx1ZTpbMCwwLDI1NV0sbmF2eTpbMCwwLDEyOF0sd2hpdGU6WzI1NSwyNTUsMjU1XSxmdWNoc2lhOlsyNTUsMCwyNTVdLG9saXZlOlsxMjgsMTI4LDBdLHllbGxvdzpbMjU1LDI1NSwwXSxvcmFuZ2U6WzI1NSwxNjUsMF0sZ3JheTpbMTI4LDEyOCwxMjhdLHB1cnBsZTpbMTI4LDAsMTI4XSxncmVlbjpbMCwxMjgsMF0scmVkOlsyNTUsMCwwXSxwaW5rOlsyNTUsMTkyLDIwM10sY3lhbjpbMCwyNTUsMjU1XSx0cmFuc3BhcmVudDpbMjU1LDI1NSwyNTUsMF19LGFlPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gdD0wPnQ/dCsxOnQ+MT90LTE6dCwwfDI1NSooMT42KnQ/ZSs2KihpLWUpKnQ6LjU+dD9pOjI+Myp0P2UrNiooaS1lKSooMi8zLXQpOmUpKy41fSxvZT1mdW5jdGlvbih0KXt2YXIgZSxpLHMscixuLGE7cmV0dXJuIHQmJlwiXCIhPT10P1wibnVtYmVyXCI9PXR5cGVvZiB0P1t0Pj4xNiwyNTUmdD4+OCwyNTUmdF06KFwiLFwiPT09dC5jaGFyQXQodC5sZW5ndGgtMSkmJih0PXQuc3Vic3RyKDAsdC5sZW5ndGgtMSkpLG5lW3RdP25lW3RdOlwiI1wiPT09dC5jaGFyQXQoMCk/KDQ9PT10Lmxlbmd0aCYmKGU9dC5jaGFyQXQoMSksaT10LmNoYXJBdCgyKSxzPXQuY2hhckF0KDMpLHQ9XCIjXCIrZStlK2kraStzK3MpLHQ9cGFyc2VJbnQodC5zdWJzdHIoMSksMTYpLFt0Pj4xNiwyNTUmdD4+OCwyNTUmdF0pOlwiaHNsXCI9PT10LnN1YnN0cigwLDMpPyh0PXQubWF0Y2gobSkscj1OdW1iZXIodFswXSklMzYwLzM2MCxuPU51bWJlcih0WzFdKS8xMDAsYT1OdW1iZXIodFsyXSkvMTAwLGk9LjU+PWE/YSoobisxKTphK24tYSpuLGU9MiphLWksdC5sZW5ndGg+MyYmKHRbM109TnVtYmVyKHRbM10pKSx0WzBdPWFlKHIrMS8zLGUsaSksdFsxXT1hZShyLGUsaSksdFsyXT1hZShyLTEvMyxlLGkpLHQpOih0PXQubWF0Y2gobSl8fG5lLnRyYW5zcGFyZW50LHRbMF09TnVtYmVyKHRbMF0pLHRbMV09TnVtYmVyKHRbMV0pLHRbMl09TnVtYmVyKHRbMl0pLHQubGVuZ3RoPjMmJih0WzNdPU51bWJlcih0WzNdKSksdCkpOm5lLmJsYWNrfSxoZT1cIig/OlxcXFxiKD86KD86cmdifHJnYmF8aHNsfGhzbGEpXFxcXCguKz9cXFxcKSl8XFxcXEIjLis/XFxcXGJcIjtmb3IoaCBpbiBuZSloZSs9XCJ8XCIraCtcIlxcXFxiXCI7aGU9UmVnRXhwKGhlK1wiKVwiLFwiZ2lcIik7dmFyIGxlPWZ1bmN0aW9uKHQsZSxpLHMpe2lmKG51bGw9PXQpcmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiB0fTt2YXIgcixuPWU/KHQubWF0Y2goaGUpfHxbXCJcIl0pWzBdOlwiXCIsYT10LnNwbGl0KG4pLmpvaW4oXCJcIikubWF0Y2goZyl8fFtdLG89dC5zdWJzdHIoMCx0LmluZGV4T2YoYVswXSkpLGg9XCIpXCI9PT10LmNoYXJBdCh0Lmxlbmd0aC0xKT9cIilcIjpcIlwiLGw9LTEhPT10LmluZGV4T2YoXCIgXCIpP1wiIFwiOlwiLFwiLF89YS5sZW5ndGgsdT1fPjA/YVswXS5yZXBsYWNlKG0sXCJcIik6XCJcIjtyZXR1cm4gXz9yPWU/ZnVuY3Rpb24odCl7dmFyIGUscCxjLGY7aWYoXCJudW1iZXJcIj09dHlwZW9mIHQpdCs9dTtlbHNlIGlmKHMmJkQudGVzdCh0KSl7Zm9yKGY9dC5yZXBsYWNlKEQsXCJ8XCIpLnNwbGl0KFwifFwiKSxjPTA7Zi5sZW5ndGg+YztjKyspZltjXT1yKGZbY10pO3JldHVybiBmLmpvaW4oXCIsXCIpfWlmKGU9KHQubWF0Y2goaGUpfHxbbl0pWzBdLHA9dC5zcGxpdChlKS5qb2luKFwiXCIpLm1hdGNoKGcpfHxbXSxjPXAubGVuZ3RoLF8+Yy0tKWZvcig7Xz4rK2M7KXBbY109aT9wWzB8KGMtMSkvMl06YVtjXTtyZXR1cm4gbytwLmpvaW4obCkrbCtlK2grKC0xIT09dC5pbmRleE9mKFwiaW5zZXRcIik/XCIgaW5zZXRcIjpcIlwiKX06ZnVuY3Rpb24odCl7dmFyIGUsbixwO2lmKFwibnVtYmVyXCI9PXR5cGVvZiB0KXQrPXU7ZWxzZSBpZihzJiZELnRlc3QodCkpe2ZvcihuPXQucmVwbGFjZShELFwifFwiKS5zcGxpdChcInxcIikscD0wO24ubGVuZ3RoPnA7cCsrKW5bcF09cihuW3BdKTtyZXR1cm4gbi5qb2luKFwiLFwiKX1pZihlPXQubWF0Y2goZyl8fFtdLHA9ZS5sZW5ndGgsXz5wLS0pZm9yKDtfPisrcDspZVtwXT1pP2VbMHwocC0xKS8yXTphW3BdO3JldHVybiBvK2Uuam9pbihsKStofTpmdW5jdGlvbih0KXtyZXR1cm4gdH19LF9lPWZ1bmN0aW9uKHQpe3JldHVybiB0PXQuc3BsaXQoXCIsXCIpLGZ1bmN0aW9uKGUsaSxzLHIsbixhLG8pe3ZhciBoLGw9KGkrXCJcIikuc3BsaXQoXCIgXCIpO2ZvcihvPXt9LGg9MDs0Pmg7aCsrKW9bdFtoXV09bFtoXT1sW2hdfHxsWyhoLTEpLzI+PjBdO3JldHVybiByLnBhcnNlKGUsbyxuLGEpfX0sdWU9KE4uX3NldFBsdWdpblJhdGlvPWZ1bmN0aW9uKHQpe3RoaXMucGx1Z2luLnNldFJhdGlvKHQpO2Zvcih2YXIgZSxpLHMscixuPXRoaXMuZGF0YSxhPW4ucHJveHksbz1uLmZpcnN0TVBULGg9MWUtNjtvOyllPWFbby52XSxvLnI/ZT1NYXRoLnJvdW5kKGUpOmg+ZSYmZT4taCYmKGU9MCksby50W28ucF09ZSxvPW8uX25leHQ7aWYobi5hdXRvUm90YXRlJiYobi5hdXRvUm90YXRlLnJvdGF0aW9uPWEucm90YXRpb24pLDE9PT10KWZvcihvPW4uZmlyc3RNUFQ7bzspe2lmKGk9by50LGkudHlwZSl7aWYoMT09PWkudHlwZSl7Zm9yKHI9aS54czAraS5zK2kueHMxLHM9MTtpLmw+cztzKyspcis9aVtcInhuXCIrc10raVtcInhzXCIrKHMrMSldO2kuZT1yfX1lbHNlIGkuZT1pLnMraS54czA7bz1vLl9uZXh0fX0sZnVuY3Rpb24odCxlLGkscyxyKXt0aGlzLnQ9dCx0aGlzLnA9ZSx0aGlzLnY9aSx0aGlzLnI9cixzJiYocy5fcHJldj10aGlzLHRoaXMuX25leHQ9cyl9KSxwZT0oTi5fcGFyc2VUb1Byb3h5PWZ1bmN0aW9uKHQsZSxpLHMscixuKXt2YXIgYSxvLGgsbCxfLHU9cyxwPXt9LGM9e30sZj1pLl90cmFuc2Zvcm0sbT1JO2ZvcihpLl90cmFuc2Zvcm09bnVsbCxJPWUscz1fPWkucGFyc2UodCxlLHMsciksST1tLG4mJihpLl90cmFuc2Zvcm09Zix1JiYodS5fcHJldj1udWxsLHUuX3ByZXYmJih1Ll9wcmV2Ll9uZXh0PW51bGwpKSk7cyYmcyE9PXU7KXtpZigxPj1zLnR5cGUmJihvPXMucCxjW29dPXMucytzLmMscFtvXT1zLnMsbnx8KGw9bmV3IHVlKHMsXCJzXCIsbyxsLHMucikscy5jPTApLDE9PT1zLnR5cGUpKWZvcihhPXMubDstLWE+MDspaD1cInhuXCIrYSxvPXMucCtcIl9cIitoLGNbb109cy5kYXRhW2hdLHBbb109c1toXSxufHwobD1uZXcgdWUocyxoLG8sbCxzLnJ4cFtoXSkpO3M9cy5fbmV4dH1yZXR1cm57cHJveHk6cCxlbmQ6YyxmaXJzdE1QVDpsLHB0Ol99fSxOLkNTU1Byb3BUd2Vlbj1mdW5jdGlvbih0LGUscyxyLGEsbyxoLGwsXyx1LHApe3RoaXMudD10LHRoaXMucD1lLHRoaXMucz1zLHRoaXMuYz1yLHRoaXMubj1ofHxlLHQgaW5zdGFuY2VvZiBwZXx8bi5wdXNoKHRoaXMubiksdGhpcy5yPWwsdGhpcy50eXBlPW98fDAsXyYmKHRoaXMucHI9XyxpPSEwKSx0aGlzLmI9dm9pZCAwPT09dT9zOnUsdGhpcy5lPXZvaWQgMD09PXA/cytyOnAsYSYmKHRoaXMuX25leHQ9YSxhLl9wcmV2PXRoaXMpfSksY2U9YS5wYXJzZUNvbXBsZXg9ZnVuY3Rpb24odCxlLGkscyxyLG4sYSxvLGgsXyl7aT1pfHxufHxcIlwiLGE9bmV3IHBlKHQsZSwwLDAsYSxfPzI6MSxudWxsLCExLG8saSxzKSxzKz1cIlwiO3ZhciB1LHAsYyxmLGcsdix5LFQsdyx4LFAsUyxrPWkuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksUj1zLnNwbGl0KFwiLCBcIikuam9pbihcIixcIikuc3BsaXQoXCIgXCIpLEE9ay5sZW5ndGgsTz1sIT09ITE7Zm9yKCgtMSE9PXMuaW5kZXhPZihcIixcIil8fC0xIT09aS5pbmRleE9mKFwiLFwiKSkmJihrPWsuam9pbihcIiBcIikucmVwbGFjZShELFwiLCBcIikuc3BsaXQoXCIgXCIpLFI9Ui5qb2luKFwiIFwiKS5yZXBsYWNlKEQsXCIsIFwiKS5zcGxpdChcIiBcIiksQT1rLmxlbmd0aCksQSE9PVIubGVuZ3RoJiYoaz0obnx8XCJcIikuc3BsaXQoXCIgXCIpLEE9ay5sZW5ndGgpLGEucGx1Z2luPWgsYS5zZXRSYXRpbz1fLHU9MDtBPnU7dSsrKWlmKGY9a1t1XSxnPVJbdV0sVD1wYXJzZUZsb2F0KGYpLFR8fDA9PT1UKWEuYXBwZW5kWHRyYShcIlwiLFQsaWUoZyxUKSxnLnJlcGxhY2UoZCxcIlwiKSxPJiYtMSE9PWcuaW5kZXhPZihcInB4XCIpLCEwKTtlbHNlIGlmKHImJihcIiNcIj09PWYuY2hhckF0KDApfHxuZVtmXXx8Yi50ZXN0KGYpKSlTPVwiLFwiPT09Zy5jaGFyQXQoZy5sZW5ndGgtMSk/XCIpLFwiOlwiKVwiLGY9b2UoZiksZz1vZShnKSx3PWYubGVuZ3RoK2cubGVuZ3RoPjYsdyYmIVUmJjA9PT1nWzNdPyhhW1wieHNcIithLmxdKz1hLmw/XCIgdHJhbnNwYXJlbnRcIjpcInRyYW5zcGFyZW50XCIsYS5lPWEuZS5zcGxpdChSW3VdKS5qb2luKFwidHJhbnNwYXJlbnRcIikpOihVfHwodz0hMSksYS5hcHBlbmRYdHJhKHc/XCJyZ2JhKFwiOlwicmdiKFwiLGZbMF0sZ1swXS1mWzBdLFwiLFwiLCEwLCEwKS5hcHBlbmRYdHJhKFwiXCIsZlsxXSxnWzFdLWZbMV0sXCIsXCIsITApLmFwcGVuZFh0cmEoXCJcIixmWzJdLGdbMl0tZlsyXSx3P1wiLFwiOlMsITApLHcmJihmPTQ+Zi5sZW5ndGg/MTpmWzNdLGEuYXBwZW5kWHRyYShcIlwiLGYsKDQ+Zy5sZW5ndGg/MTpnWzNdKS1mLFMsITEpKSk7ZWxzZSBpZih2PWYubWF0Y2gobSkpe2lmKHk9Zy5tYXRjaChkKSwheXx8eS5sZW5ndGghPT12Lmxlbmd0aClyZXR1cm4gYTtmb3IoYz0wLHA9MDt2Lmxlbmd0aD5wO3ArKylQPXZbcF0seD1mLmluZGV4T2YoUCxjKSxhLmFwcGVuZFh0cmEoZi5zdWJzdHIoYyx4LWMpLE51bWJlcihQKSxpZSh5W3BdLFApLFwiXCIsTyYmXCJweFwiPT09Zi5zdWJzdHIoeCtQLmxlbmd0aCwyKSwwPT09cCksYz14K1AubGVuZ3RoO2FbXCJ4c1wiK2EubF0rPWYuc3Vic3RyKGMpfWVsc2UgYVtcInhzXCIrYS5sXSs9YS5sP1wiIFwiK2Y6ZjtpZigtMSE9PXMuaW5kZXhPZihcIj1cIikmJmEuZGF0YSl7Zm9yKFM9YS54czArYS5kYXRhLnMsdT0xO2EubD51O3UrKylTKz1hW1wieHNcIit1XSthLmRhdGFbXCJ4blwiK3VdO2EuZT1TK2FbXCJ4c1wiK3VdfXJldHVybiBhLmx8fChhLnR5cGU9LTEsYS54czA9YS5lKSxhLnhmaXJzdHx8YX0sZmU9OTtmb3IoaD1wZS5wcm90b3R5cGUsaC5sPWgucHI9MDstLWZlPjA7KWhbXCJ4blwiK2ZlXT0wLGhbXCJ4c1wiK2ZlXT1cIlwiO2gueHMwPVwiXCIsaC5fbmV4dD1oLl9wcmV2PWgueGZpcnN0PWguZGF0YT1oLnBsdWdpbj1oLnNldFJhdGlvPWgucnhwPW51bGwsaC5hcHBlbmRYdHJhPWZ1bmN0aW9uKHQsZSxpLHMscixuKXt2YXIgYT10aGlzLG89YS5sO3JldHVybiBhW1wieHNcIitvXSs9biYmbz9cIiBcIit0OnR8fFwiXCIsaXx8MD09PW98fGEucGx1Z2luPyhhLmwrKyxhLnR5cGU9YS5zZXRSYXRpbz8yOjEsYVtcInhzXCIrYS5sXT1zfHxcIlwiLG8+MD8oYS5kYXRhW1wieG5cIitvXT1lK2ksYS5yeHBbXCJ4blwiK29dPXIsYVtcInhuXCIrb109ZSxhLnBsdWdpbnx8KGEueGZpcnN0PW5ldyBwZShhLFwieG5cIitvLGUsaSxhLnhmaXJzdHx8YSwwLGEubixyLGEucHIpLGEueGZpcnN0LnhzMD0wKSxhKTooYS5kYXRhPXtzOmUraX0sYS5yeHA9e30sYS5zPWUsYS5jPWksYS5yPXIsYSkpOihhW1wieHNcIitvXSs9ZSsoc3x8XCJcIiksYSl9O3ZhciBtZT1mdW5jdGlvbih0LGUpe2U9ZXx8e30sdGhpcy5wPWUucHJlZml4P1YodCl8fHQ6dCxvW3RdPW9bdGhpcy5wXT10aGlzLHRoaXMuZm9ybWF0PWUuZm9ybWF0dGVyfHxsZShlLmRlZmF1bHRWYWx1ZSxlLmNvbG9yLGUuY29sbGFwc2libGUsZS5tdWx0aSksZS5wYXJzZXImJih0aGlzLnBhcnNlPWUucGFyc2VyKSx0aGlzLmNscnM9ZS5jb2xvcix0aGlzLm11bHRpPWUubXVsdGksdGhpcy5rZXl3b3JkPWUua2V5d29yZCx0aGlzLmRmbHQ9ZS5kZWZhdWx0VmFsdWUsdGhpcy5wcj1lLnByaW9yaXR5fHwwfSxkZT1OLl9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcD1mdW5jdGlvbih0LGUsaSl7XCJvYmplY3RcIiE9dHlwZW9mIGUmJihlPXtwYXJzZXI6aX0pO3ZhciBzLHIsbj10LnNwbGl0KFwiLFwiKSxhPWUuZGVmYXVsdFZhbHVlO2ZvcihpPWl8fFthXSxzPTA7bi5sZW5ndGg+cztzKyspZS5wcmVmaXg9MD09PXMmJmUucHJlZml4LGUuZGVmYXVsdFZhbHVlPWlbc118fGEscj1uZXcgbWUobltzXSxlKX0sZ2U9ZnVuY3Rpb24odCl7aWYoIW9bdF0pe3ZhciBlPXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrdC5zdWJzdHIoMSkrXCJQbHVnaW5cIjtkZSh0LHtwYXJzZXI6ZnVuY3Rpb24odCxpLHMscixuLGEsaCl7dmFyIGw9KF9nc1Njb3BlLkdyZWVuU29ja0dsb2JhbHN8fF9nc1Njb3BlKS5jb20uZ3JlZW5zb2NrLnBsdWdpbnNbZV07cmV0dXJuIGw/KGwuX2Nzc1JlZ2lzdGVyKCksb1tzXS5wYXJzZSh0LGkscyxyLG4sYSxoKSk6KGooXCJFcnJvcjogXCIrZStcIiBqcyBmaWxlIG5vdCBsb2FkZWQuXCIpLG4pfX0pfX07aD1tZS5wcm90b3R5cGUsaC5wYXJzZUNvbXBsZXg9ZnVuY3Rpb24odCxlLGkscyxyLG4pe3ZhciBhLG8saCxsLF8sdSxwPXRoaXMua2V5d29yZDtpZih0aGlzLm11bHRpJiYoRC50ZXN0KGkpfHxELnRlc3QoZSk/KG89ZS5yZXBsYWNlKEQsXCJ8XCIpLnNwbGl0KFwifFwiKSxoPWkucmVwbGFjZShELFwifFwiKS5zcGxpdChcInxcIikpOnAmJihvPVtlXSxoPVtpXSkpLGgpe2ZvcihsPWgubGVuZ3RoPm8ubGVuZ3RoP2gubGVuZ3RoOm8ubGVuZ3RoLGE9MDtsPmE7YSsrKWU9b1thXT1vW2FdfHx0aGlzLmRmbHQsaT1oW2FdPWhbYV18fHRoaXMuZGZsdCxwJiYoXz1lLmluZGV4T2YocCksdT1pLmluZGV4T2YocCksXyE9PXUmJihpPS0xPT09dT9oOm8saVthXSs9XCIgXCIrcCkpO2U9by5qb2luKFwiLCBcIiksaT1oLmpvaW4oXCIsIFwiKX1yZXR1cm4gY2UodCx0aGlzLnAsZSxpLHRoaXMuY2xycyx0aGlzLmRmbHQscyx0aGlzLnByLHIsbil9LGgucGFyc2U9ZnVuY3Rpb24odCxlLGkscyxuLGEpe3JldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLHRoaXMuZm9ybWF0KFcodCx0aGlzLnAsciwhMSx0aGlzLmRmbHQpKSx0aGlzLmZvcm1hdChlKSxuLGEpfSxhLnJlZ2lzdGVyU3BlY2lhbFByb3A9ZnVuY3Rpb24odCxlLGkpe2RlKHQse3BhcnNlcjpmdW5jdGlvbih0LHMscixuLGEsbyl7dmFyIGg9bmV3IHBlKHQsciwwLDAsYSwyLHIsITEsaSk7cmV0dXJuIGgucGx1Z2luPW8saC5zZXRSYXRpbz1lKHQscyxuLl90d2VlbixyKSxofSxwcmlvcml0eTppfSl9O3ZhciB2ZT1cInNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHNrZXdYLHNrZXdZLHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscGVyc3BlY3RpdmUseFBlcmNlbnQseVBlcmNlbnRcIi5zcGxpdChcIixcIikseWU9VihcInRyYW5zZm9ybVwiKSxUZT1CK1widHJhbnNmb3JtXCIsd2U9VihcInRyYW5zZm9ybU9yaWdpblwiKSx4ZT1udWxsIT09VihcInBlcnNwZWN0aXZlXCIpLGJlPU4uVHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy5za2V3WT0wfSxQZT13aW5kb3cuU1ZHRWxlbWVudCxTZT1QZSYmKGZ8fC9BbmRyb2lkL2kudGVzdChYKSYmIXdpbmRvdy5jaHJvbWUpLGtlPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcz10LmdldEJCb3goKTtlPWVlKGUpLnNwbGl0KFwiIFwiKSxpLnhPcmlnaW49KC0xIT09ZVswXS5pbmRleE9mKFwiJVwiKT9wYXJzZUZsb2F0KGVbMF0pLzEwMCpzLndpZHRoOnBhcnNlRmxvYXQoZVswXSkpK3MueCxpLnlPcmlnaW49KC0xIT09ZVsxXS5pbmRleE9mKFwiJVwiKT9wYXJzZUZsb2F0KGVbMV0pLzEwMCpzLmhlaWdodDpwYXJzZUZsb2F0KGVbMV0pKStzLnl9LFJlPU4uZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKHQsZSxpLHMpe2lmKHQuX2dzVHJhbnNmb3JtJiZpJiYhcylyZXR1cm4gdC5fZ3NUcmFuc2Zvcm07dmFyIG4sbyxoLGwsXyx1LHAsYyxmLG0sZCxnLHYseT1pP3QuX2dzVHJhbnNmb3JtfHxuZXcgYmU6bmV3IGJlLFQ9MD55LnNjYWxlWCx3PTJlLTUseD0xZTUsYj0xNzkuOTksUD1iKk0sUz14ZT9wYXJzZUZsb2F0KFcodCx3ZSxlLCExLFwiMCAwIDBcIikuc3BsaXQoXCIgXCIpWzJdKXx8eS56T3JpZ2lufHwwOjAsaz1wYXJzZUZsb2F0KGEuZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlKXx8MDtpZih5ZT9uPVcodCxUZSxlLCEwKTp0LmN1cnJlbnRTdHlsZSYmKG49dC5jdXJyZW50U3R5bGUuZmlsdGVyLm1hdGNoKE8pLG49biYmND09PW4ubGVuZ3RoP1tuWzBdLnN1YnN0cig0KSxOdW1iZXIoblsyXS5zdWJzdHIoNCkpLE51bWJlcihuWzFdLnN1YnN0cig0KSksblszXS5zdWJzdHIoNCkseS54fHwwLHkueXx8MF0uam9pbihcIixcIik6XCJcIiksbiYmXCJub25lXCIhPT1uJiZcIm1hdHJpeCgxLCAwLCAwLCAxLCAwLCAwKVwiIT09bil7Zm9yKG89KG58fFwiXCIpLm1hdGNoKC8oPzpcXC18XFxiKVtcXGRcXC1cXC5lXStcXGIvZ2kpfHxbXSxoPW8ubGVuZ3RoOy0taD4tMTspbD1OdW1iZXIob1toXSksb1toXT0oXz1sLShsfD0wKSk/KDB8Xyp4KygwPl8/LS41Oi41KSkveCtsOmw7aWYoMTY9PT1vLmxlbmd0aCl7dmFyIFI9b1s4XSxBPW9bOV0sQz1vWzEwXSxEPW9bMTJdLEk9b1sxM10sRT1vWzE0XTtpZih5LnpPcmlnaW4mJihFPS15LnpPcmlnaW4sRD1SKkUtb1sxMl0sST1BKkUtb1sxM10sRT1DKkUreS56T3JpZ2luLW9bMTRdKSwhaXx8c3x8bnVsbD09eS5yb3RhdGlvblgpe3ZhciBGLEwsTixYLFUsWSxqLEI9b1swXSxxPW9bMV0sVj1vWzJdLEc9b1szXSxRPW9bNF0sWj1vWzVdLCQ9b1s2XSxIPW9bN10sSz1vWzExXSxKPU1hdGguYXRhbjIoJCxDKSx0ZT0tUD5KfHxKPlA7eS5yb3RhdGlvblg9Sip6LEomJihYPU1hdGguY29zKC1KKSxVPU1hdGguc2luKC1KKSxGPVEqWCtSKlUsTD1aKlgrQSpVLE49JCpYK0MqVSxSPVEqLVUrUipYLEE9WiotVStBKlgsQz0kKi1VK0MqWCxLPUgqLVUrSypYLFE9RixaPUwsJD1OKSxKPU1hdGguYXRhbjIoUixCKSx5LnJvdGF0aW9uWT1KKnosSiYmKFk9LVA+Snx8Sj5QLFg9TWF0aC5jb3MoLUopLFU9TWF0aC5zaW4oLUopLEY9QipYLVIqVSxMPXEqWC1BKlUsTj1WKlgtQypVLEE9cSpVK0EqWCxDPVYqVStDKlgsSz1HKlUrSypYLEI9RixxPUwsVj1OKSxKPU1hdGguYXRhbjIocSxaKSx5LnJvdGF0aW9uPUoqeixKJiYoaj0tUD5KfHxKPlAsWD1NYXRoLmNvcygtSiksVT1NYXRoLnNpbigtSiksQj1CKlgrUSpVLEw9cSpYK1oqVSxaPXEqLVUrWipYLCQ9ViotVSskKlgscT1MKSxqJiZ0ZT95LnJvdGF0aW9uPXkucm90YXRpb25YPTA6aiYmWT95LnJvdGF0aW9uPXkucm90YXRpb25ZPTA6WSYmdGUmJih5LnJvdGF0aW9uWT15LnJvdGF0aW9uWD0wKSx5LnNjYWxlWD0oMHxNYXRoLnNxcnQoQipCK3EqcSkqeCsuNSkveCx5LnNjYWxlWT0oMHxNYXRoLnNxcnQoWipaK0EqQSkqeCsuNSkveCx5LnNjYWxlWj0oMHxNYXRoLnNxcnQoJCokK0MqQykqeCsuNSkveCx5LnNrZXdYPTAseS5wZXJzcGVjdGl2ZT1LPzEvKDA+Sz8tSzpLKTowLHkueD1ELHkueT1JLHkuej1FfX1lbHNlIGlmKCEoeGUmJiFzJiZvLmxlbmd0aCYmeS54PT09b1s0XSYmeS55PT09b1s1XSYmKHkucm90YXRpb25YfHx5LnJvdGF0aW9uWSl8fHZvaWQgMCE9PXkueCYmXCJub25lXCI9PT1XKHQsXCJkaXNwbGF5XCIsZSkpKXt2YXIgZWU9by5sZW5ndGg+PTYsaWU9ZWU/b1swXToxLHNlPW9bMV18fDAscmU9b1syXXx8MCxuZT1lZT9vWzNdOjE7eS54PW9bNF18fDAseS55PW9bNV18fDAsdT1NYXRoLnNxcnQoaWUqaWUrc2Uqc2UpLHA9TWF0aC5zcXJ0KG5lKm5lK3JlKnJlKSxjPWllfHxzZT9NYXRoLmF0YW4yKHNlLGllKSp6Onkucm90YXRpb258fDAsZj1yZXx8bmU/TWF0aC5hdGFuMihyZSxuZSkqeitjOnkuc2tld1h8fDAsbT11LU1hdGguYWJzKHkuc2NhbGVYfHwwKSxkPXAtTWF0aC5hYnMoeS5zY2FsZVl8fDApLE1hdGguYWJzKGYpPjkwJiYyNzA+TWF0aC5hYnMoZikmJihUPyh1Kj0tMSxmKz0wPj1jPzE4MDotMTgwLGMrPTA+PWM/MTgwOi0xODApOihwKj0tMSxmKz0wPj1mPzE4MDotMTgwKSksZz0oYy15LnJvdGF0aW9uKSUxODAsdj0oZi15LnNrZXdYKSUxODAsKHZvaWQgMD09PXkuc2tld1h8fG0+d3x8LXc+bXx8ZD53fHwtdz5kfHxnPi1iJiZiPmcmJmZhbHNlfGcqeHx8dj4tYiYmYj52JiZmYWxzZXx2KngpJiYoeS5zY2FsZVg9dSx5LnNjYWxlWT1wLHkucm90YXRpb249Yyx5LnNrZXdYPWYpLHhlJiYoeS5yb3RhdGlvblg9eS5yb3RhdGlvblk9eS56PTAseS5wZXJzcGVjdGl2ZT1rLHkuc2NhbGVaPTEpfXkuek9yaWdpbj1TO2ZvcihoIGluIHkpdz55W2hdJiZ5W2hdPi13JiYoeVtoXT0wKX1lbHNlIHk9e3g6MCx5OjAsejowLHNjYWxlWDoxLHNjYWxlWToxLHNjYWxlWjoxLHNrZXdYOjAsc2tld1k6MCxwZXJzcGVjdGl2ZTprLHJvdGF0aW9uOjAscm90YXRpb25YOjAscm90YXRpb25ZOjAsek9yaWdpbjowfTtyZXR1cm4gaSYmKHQuX2dzVHJhbnNmb3JtPXkpLHkuc3ZnPVBlJiZ0IGluc3RhbmNlb2YgUGUseS5zdmcmJmtlKHQsVyh0LHdlLHIsITEsXCI1MCUgNTAlXCIpK1wiXCIseSkseS54UGVyY2VudD15LnlQZXJjZW50PTAseX0sQWU9ZnVuY3Rpb24odCl7dmFyIGUsaSxzPXRoaXMuZGF0YSxyPS1zLnJvdGF0aW9uKk0sbj1yK3Muc2tld1gqTSxhPTFlNSxvPSgwfE1hdGguY29zKHIpKnMuc2NhbGVYKmEpL2EsaD0oMHxNYXRoLnNpbihyKSpzLnNjYWxlWCphKS9hLGw9KDB8TWF0aC5zaW4obikqLXMuc2NhbGVZKmEpL2EsXz0oMHxNYXRoLmNvcyhuKSpzLnNjYWxlWSphKS9hLHU9dGhpcy50LnN0eWxlLHA9dGhpcy50LmN1cnJlbnRTdHlsZTtpZihwKXtpPWgsaD0tbCxsPS1pLGU9cC5maWx0ZXIsdS5maWx0ZXI9XCJcIjt2YXIgYyxtLGQ9dGhpcy50Lm9mZnNldFdpZHRoLGc9dGhpcy50Lm9mZnNldEhlaWdodCx2PVwiYWJzb2x1dGVcIiE9PXAucG9zaXRpb24sdz1cInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5NYXRyaXgoTTExPVwiK28rXCIsIE0xMj1cIitoK1wiLCBNMjE9XCIrbCtcIiwgTTIyPVwiK18seD1zLngrZCpzLnhQZXJjZW50LzEwMCxiPXMueStnKnMueVBlcmNlbnQvMTAwO2lmKG51bGwhPXMub3gmJihjPShzLm94cD8uMDEqZCpzLm94OnMub3gpLWQvMixtPShzLm95cD8uMDEqZypzLm95OnMub3kpLWcvMix4Kz1jLShjKm8rbSpoKSxiKz1tLShjKmwrbSpfKSksdj8oYz1kLzIsbT1nLzIsdys9XCIsIER4PVwiKyhjLShjKm8rbSpoKSt4KStcIiwgRHk9XCIrKG0tKGMqbCttKl8pK2IpK1wiKVwiKTp3Kz1cIiwgc2l6aW5nTWV0aG9kPSdhdXRvIGV4cGFuZCcpXCIsdS5maWx0ZXI9LTEhPT1lLmluZGV4T2YoXCJEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5NYXRyaXgoXCIpP2UucmVwbGFjZShDLHcpOncrXCIgXCIrZSwoMD09PXR8fDE9PT10KSYmMT09PW8mJjA9PT1oJiYwPT09bCYmMT09PV8mJih2JiYtMT09PXcuaW5kZXhPZihcIkR4PTAsIER5PTBcIil8fFQudGVzdChlKSYmMTAwIT09cGFyc2VGbG9hdChSZWdFeHAuJDEpfHwtMT09PWUuaW5kZXhPZihcImdyYWRpZW50KFwiJiZlLmluZGV4T2YoXCJBbHBoYVwiKSkmJnUucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpKSwhdil7dmFyIFAsUyxrLFI9OD5mPzE6LTE7Zm9yKGM9cy5pZU9mZnNldFh8fDAsbT1zLmllT2Zmc2V0WXx8MCxzLmllT2Zmc2V0WD1NYXRoLnJvdW5kKChkLSgoMD5vPy1vOm8pKmQrKDA+aD8taDpoKSpnKSkvMit4KSxzLmllT2Zmc2V0WT1NYXRoLnJvdW5kKChnLSgoMD5fPy1fOl8pKmcrKDA+bD8tbDpsKSpkKSkvMitiKSxmZT0wOzQ+ZmU7ZmUrKylTPUpbZmVdLFA9cFtTXSxpPS0xIT09UC5pbmRleE9mKFwicHhcIik/cGFyc2VGbG9hdChQKTpRKHRoaXMudCxTLHBhcnNlRmxvYXQoUCksUC5yZXBsYWNlKHksXCJcIikpfHwwLGs9aSE9PXNbU10/Mj5mZT8tcy5pZU9mZnNldFg6LXMuaWVPZmZzZXRZOjI+ZmU/Yy1zLmllT2Zmc2V0WDptLXMuaWVPZmZzZXRZLHVbU109KHNbU109TWF0aC5yb3VuZChpLWsqKDA9PT1mZXx8Mj09PWZlPzE6UikpKStcInB4XCJ9fX0sT2U9Ti5zZXQzRFRyYW5zZm9ybVJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyLG4sYSxvLGgsbCxfLHUsYyxmLG0sZCxnLHYseSxULHcseCxiLFAsUz10aGlzLmRhdGEsaz10aGlzLnQuc3R5bGUsUj1TLnJvdGF0aW9uKk0sQT1TLnNjYWxlWCxPPVMuc2NhbGVZLEM9Uy5zY2FsZVosRD1TLngsej1TLnksST1TLnosRT1TLnBlcnNwZWN0aXZlO2lmKCEoMSE9PXQmJjAhPT10fHxcImF1dG9cIiE9PVMuZm9yY2UzRHx8Uy5yb3RhdGlvbll8fFMucm90YXRpb25YfHwxIT09Q3x8RXx8SSkpcmV0dXJuIENlLmNhbGwodGhpcyx0KSx2b2lkIDA7aWYocCl7dmFyIEY9MWUtNDtGPkEmJkE+LUYmJihBPUM9MmUtNSksRj5PJiZPPi1GJiYoTz1DPTJlLTUpLCFFfHxTLnp8fFMucm90YXRpb25YfHxTLnJvdGF0aW9uWXx8KEU9MCl9aWYoUnx8Uy5za2V3WCl5PU1hdGguY29zKFIpLFQ9TWF0aC5zaW4oUiksZT15LG49VCxTLnNrZXdYJiYoUi09Uy5za2V3WCpNLHk9TWF0aC5jb3MoUiksVD1NYXRoLnNpbihSKSxcInNpbXBsZVwiPT09Uy5za2V3VHlwZSYmKHc9TWF0aC50YW4oUy5za2V3WCpNKSx3PU1hdGguc3FydCgxK3cqdykseSo9dyxUKj13KSksaT0tVCxhPXk7ZWxzZXtpZighKFMucm90YXRpb25ZfHxTLnJvdGF0aW9uWHx8MSE9PUN8fEV8fFMuc3ZnKSlyZXR1cm4ga1t5ZV09KFMueFBlcmNlbnR8fFMueVBlcmNlbnQ/XCJ0cmFuc2xhdGUoXCIrUy54UGVyY2VudCtcIiUsXCIrUy55UGVyY2VudCtcIiUpIHRyYW5zbGF0ZTNkKFwiOlwidHJhbnNsYXRlM2QoXCIpK0QrXCJweCxcIit6K1wicHgsXCIrSStcInB4KVwiKygxIT09QXx8MSE9PU8/XCIgc2NhbGUoXCIrQStcIixcIitPK1wiKVwiOlwiXCIpLHZvaWQgMDtlPWE9MSxpPW49MH11PTEscz1yPW89aD1sPV89Yz1mPW09MCxkPUU/LTEvRTowLGc9Uy56T3JpZ2luLHY9MWU1LFI9Uy5yb3RhdGlvblkqTSxSJiYoeT1NYXRoLmNvcyhSKSxUPU1hdGguc2luKFIpLGw9dSotVCxmPWQqLVQscz1lKlQsbz1uKlQsdSo9eSxkKj15LGUqPXksbio9eSksUj1TLnJvdGF0aW9uWCpNLFImJih5PU1hdGguY29zKFIpLFQ9TWF0aC5zaW4oUiksdz1pKnkrcypULHg9YSp5K28qVCxiPV8qeSt1KlQsUD1tKnkrZCpULHM9aSotVCtzKnksbz1hKi1UK28qeSx1PV8qLVQrdSp5LGQ9bSotVCtkKnksaT13LGE9eCxfPWIsbT1QKSwxIT09QyYmKHMqPUMsbyo9Qyx1Kj1DLGQqPUMpLDEhPT1PJiYoaSo9TyxhKj1PLF8qPU8sbSo9TyksMSE9PUEmJihlKj1BLG4qPUEsbCo9QSxmKj1BKSxnJiYoYy09ZyxyPXMqYyxoPW8qYyxjPXUqYytnKSxTLnN2ZyYmKHIrPVMueE9yaWdpbi0oUy54T3JpZ2luKmUrUy55T3JpZ2luKmkpLGgrPVMueU9yaWdpbi0oUy54T3JpZ2luKm4rUy55T3JpZ2luKmEpKSxyPSh3PShyKz1EKS0ocnw9MCkpPygwfHcqdisoMD53Py0uNTouNSkpL3YrcjpyLGg9KHc9KGgrPXopLShofD0wKSk/KDB8dyp2KygwPnc/LS41Oi41KSkvditoOmgsYz0odz0oYys9SSktKGN8PTApKT8oMHx3KnYrKDA+dz8tLjU6LjUpKS92K2M6YyxrW3llXT0oUy54UGVyY2VudHx8Uy55UGVyY2VudD9cInRyYW5zbGF0ZShcIitTLnhQZXJjZW50K1wiJSxcIitTLnlQZXJjZW50K1wiJSkgbWF0cml4M2QoXCI6XCJtYXRyaXgzZChcIikrWygwfGUqdikvdiwoMHxuKnYpL3YsKDB8bCp2KS92LCgwfGYqdikvdiwoMHxpKnYpL3YsKDB8YSp2KS92LCgwfF8qdikvdiwoMHxtKnYpL3YsKDB8cyp2KS92LCgwfG8qdikvdiwoMHx1KnYpL3YsKDB8ZCp2KS92LHIsaCxjLEU/MSstYy9FOjFdLmpvaW4oXCIsXCIpK1wiKVwifSxDZT1OLnNldDJEVHJhbnNmb3JtUmF0aW89ZnVuY3Rpb24odCl7dmFyIGUsaSxzLHIsbixhLG8saCxsLF8sdSxwPXRoaXMuZGF0YSxjPXRoaXMudCxmPWMuc3R5bGUsbT1wLngsZD1wLnk7cmV0dXJuIShwLnJvdGF0aW9uWHx8cC5yb3RhdGlvbll8fHAuenx8cC5mb3JjZTNEPT09ITB8fFwiYXV0b1wiPT09cC5mb3JjZTNEJiYxIT09dCYmMCE9PXQpfHxwLnN2ZyYmU2V8fCF4ZT8ocj1wLnNjYWxlWCxuPXAuc2NhbGVZLHAucm90YXRpb258fHAuc2tld1h8fHAuc3ZnPyhlPXAucm90YXRpb24qTSxpPWUtcC5za2V3WCpNLHM9MWU1LGE9TWF0aC5jb3MoZSkqcixvPU1hdGguc2luKGUpKnIsaD1NYXRoLnNpbihpKSotbixsPU1hdGguY29zKGkpKm4scC5zdmcmJihtKz1wLnhPcmlnaW4tKHAueE9yaWdpbiphK3AueU9yaWdpbipoKSxkKz1wLnlPcmlnaW4tKHAueE9yaWdpbipvK3AueU9yaWdpbipsKSx1PTFlLTYsdT5tJiZtPi11JiYobT0wKSx1PmQmJmQ+LXUmJihkPTApKSxfPSgwfGEqcykvcytcIixcIisoMHxvKnMpL3MrXCIsXCIrKDB8aCpzKS9zK1wiLFwiKygwfGwqcykvcytcIixcIittK1wiLFwiK2QrXCIpXCIscC5zdmcmJlNlP2Muc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsXCJtYXRyaXgoXCIrXyk6Zlt5ZV09KHAueFBlcmNlbnR8fHAueVBlcmNlbnQ/XCJ0cmFuc2xhdGUoXCIrcC54UGVyY2VudCtcIiUsXCIrcC55UGVyY2VudCtcIiUpIG1hdHJpeChcIjpcIm1hdHJpeChcIikrXyk6Zlt5ZV09KHAueFBlcmNlbnR8fHAueVBlcmNlbnQ/XCJ0cmFuc2xhdGUoXCIrcC54UGVyY2VudCtcIiUsXCIrcC55UGVyY2VudCtcIiUpIG1hdHJpeChcIjpcIm1hdHJpeChcIikrcitcIiwwLDAsXCIrbitcIixcIittK1wiLFwiK2QrXCIpXCIsdm9pZCAwKToodGhpcy5zZXRSYXRpbz1PZSxPZS5jYWxsKHRoaXMsdCksdm9pZCAwKX07ZGUoXCJ0cmFuc2Zvcm0sc2NhbGUsc2NhbGVYLHNjYWxlWSxzY2FsZVoseCx5LHoscm90YXRpb24scm90YXRpb25YLHJvdGF0aW9uWSxyb3RhdGlvblosc2tld1gsc2tld1ksc2hvcnRSb3RhdGlvbixzaG9ydFJvdGF0aW9uWCxzaG9ydFJvdGF0aW9uWSxzaG9ydFJvdGF0aW9uWix0cmFuc2Zvcm1PcmlnaW4sdHJhbnNmb3JtUGVyc3BlY3RpdmUsZGlyZWN0aW9uYWxSb3RhdGlvbixwYXJzZVRyYW5zZm9ybSxmb3JjZTNELHNrZXdUeXBlLHhQZXJjZW50LHlQZXJjZW50XCIse3BhcnNlcjpmdW5jdGlvbih0LGUsaSxzLG4sbyxoKXtpZihzLl90cmFuc2Zvcm0pcmV0dXJuIG47dmFyIGwsXyx1LHAsYyxmLG0sZD1zLl90cmFuc2Zvcm09UmUodCxyLCEwLGgucGFyc2VUcmFuc2Zvcm0pLGc9dC5zdHlsZSx2PTFlLTYseT12ZS5sZW5ndGgsVD1oLHc9e307aWYoXCJzdHJpbmdcIj09dHlwZW9mIFQudHJhbnNmb3JtJiZ5ZSl1PUYuc3R5bGUsdVt5ZV09VC50cmFuc2Zvcm0sdS5kaXNwbGF5PVwiYmxvY2tcIix1LnBvc2l0aW9uPVwiYWJzb2x1dGVcIixFLmJvZHkuYXBwZW5kQ2hpbGQoRiksbD1SZShGLG51bGwsITEpLEUuYm9keS5yZW1vdmVDaGlsZChGKTtlbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBUKXtpZihsPXtzY2FsZVg6c2UobnVsbCE9VC5zY2FsZVg/VC5zY2FsZVg6VC5zY2FsZSxkLnNjYWxlWCksc2NhbGVZOnNlKG51bGwhPVQuc2NhbGVZP1Quc2NhbGVZOlQuc2NhbGUsZC5zY2FsZVkpLHNjYWxlWjpzZShULnNjYWxlWixkLnNjYWxlWikseDpzZShULngsZC54KSx5OnNlKFQueSxkLnkpLHo6c2UoVC56LGQueikseFBlcmNlbnQ6c2UoVC54UGVyY2VudCxkLnhQZXJjZW50KSx5UGVyY2VudDpzZShULnlQZXJjZW50LGQueVBlcmNlbnQpLHBlcnNwZWN0aXZlOnNlKFQudHJhbnNmb3JtUGVyc3BlY3RpdmUsZC5wZXJzcGVjdGl2ZSl9LG09VC5kaXJlY3Rpb25hbFJvdGF0aW9uLG51bGwhPW0paWYoXCJvYmplY3RcIj09dHlwZW9mIG0pZm9yKHUgaW4gbSlUW3VdPW1bdV07ZWxzZSBULnJvdGF0aW9uPW07XCJzdHJpbmdcIj09dHlwZW9mIFQueCYmLTEhPT1ULnguaW5kZXhPZihcIiVcIikmJihsLng9MCxsLnhQZXJjZW50PXNlKFQueCxkLnhQZXJjZW50KSksXCJzdHJpbmdcIj09dHlwZW9mIFQueSYmLTEhPT1ULnkuaW5kZXhPZihcIiVcIikmJihsLnk9MCxsLnlQZXJjZW50PXNlKFQueSxkLnlQZXJjZW50KSksbC5yb3RhdGlvbj1yZShcInJvdGF0aW9uXCJpbiBUP1Qucm90YXRpb246XCJzaG9ydFJvdGF0aW9uXCJpbiBUP1Quc2hvcnRSb3RhdGlvbitcIl9zaG9ydFwiOlwicm90YXRpb25aXCJpbiBUP1Qucm90YXRpb25aOmQucm90YXRpb24sZC5yb3RhdGlvbixcInJvdGF0aW9uXCIsdykseGUmJihsLnJvdGF0aW9uWD1yZShcInJvdGF0aW9uWFwiaW4gVD9ULnJvdGF0aW9uWDpcInNob3J0Um90YXRpb25YXCJpbiBUP1Quc2hvcnRSb3RhdGlvblgrXCJfc2hvcnRcIjpkLnJvdGF0aW9uWHx8MCxkLnJvdGF0aW9uWCxcInJvdGF0aW9uWFwiLHcpLGwucm90YXRpb25ZPXJlKFwicm90YXRpb25ZXCJpbiBUP1Qucm90YXRpb25ZOlwic2hvcnRSb3RhdGlvbllcImluIFQ/VC5zaG9ydFJvdGF0aW9uWStcIl9zaG9ydFwiOmQucm90YXRpb25ZfHwwLGQucm90YXRpb25ZLFwicm90YXRpb25ZXCIsdykpLGwuc2tld1g9bnVsbD09VC5za2V3WD9kLnNrZXdYOnJlKFQuc2tld1gsZC5za2V3WCksbC5za2V3WT1udWxsPT1ULnNrZXdZP2Quc2tld1k6cmUoVC5za2V3WSxkLnNrZXdZKSwoXz1sLnNrZXdZLWQuc2tld1kpJiYobC5za2V3WCs9XyxsLnJvdGF0aW9uKz1fKX1mb3IoeGUmJm51bGwhPVQuZm9yY2UzRCYmKGQuZm9yY2UzRD1ULmZvcmNlM0QsZj0hMCksZC5za2V3VHlwZT1ULnNrZXdUeXBlfHxkLnNrZXdUeXBlfHxhLmRlZmF1bHRTa2V3VHlwZSxjPWQuZm9yY2UzRHx8ZC56fHxkLnJvdGF0aW9uWHx8ZC5yb3RhdGlvbll8fGwuenx8bC5yb3RhdGlvblh8fGwucm90YXRpb25ZfHxsLnBlcnNwZWN0aXZlLGN8fG51bGw9PVQuc2NhbGV8fChsLnNjYWxlWj0xKTstLXk+LTE7KWk9dmVbeV0scD1sW2ldLWRbaV0sKHA+dnx8LXY+cHx8bnVsbCE9VFtpXXx8bnVsbCE9SVtpXSkmJihmPSEwLG49bmV3IHBlKGQsaSxkW2ldLHAsbiksaSBpbiB3JiYobi5lPXdbaV0pLG4ueHMwPTAsbi5wbHVnaW49byxzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKG4ubikpO3JldHVybiBwPVQudHJhbnNmb3JtT3JpZ2luLHAmJmQuc3ZnPyhrZSh0LHAsbCksbj1uZXcgcGUoZCxcInhPcmlnaW5cIixkLnhPcmlnaW4sbC54T3JpZ2luLWQueE9yaWdpbixuLC0xLFwidHJhbnNmb3JtT3JpZ2luXCIpLG4uYj1kLnhPcmlnaW4sbi5lPW4ueHMwPWwueE9yaWdpbixuPW5ldyBwZShkLFwieU9yaWdpblwiLGQueU9yaWdpbixsLnlPcmlnaW4tZC55T3JpZ2luLG4sLTEsXCJ0cmFuc2Zvcm1PcmlnaW5cIiksbi5iPWQueU9yaWdpbixuLmU9bi54czA9bC55T3JpZ2luLE1lKGcsd2UpKToocHx8eGUmJmMmJmQuek9yaWdpbikmJih5ZT8oZj0hMCxpPXdlLHA9KHB8fFcodCxpLHIsITEsXCI1MCUgNTAlXCIpKStcIlwiLG49bmV3IHBlKGcsaSwwLDAsbiwtMSxcInRyYW5zZm9ybU9yaWdpblwiKSxuLmI9Z1tpXSxuLnBsdWdpbj1vLHhlPyh1PWQuek9yaWdpbixwPXAuc3BsaXQoXCIgXCIpLGQuek9yaWdpbj0ocC5sZW5ndGg+MiYmKDA9PT11fHxcIjBweFwiIT09cFsyXSk/cGFyc2VGbG9hdChwWzJdKTp1KXx8MCxuLnhzMD1uLmU9cFswXStcIiBcIisocFsxXXx8XCI1MCVcIikrXCIgMHB4XCIsbj1uZXcgcGUoZCxcInpPcmlnaW5cIiwwLDAsbiwtMSxuLm4pLG4uYj11LG4ueHMwPW4uZT1kLnpPcmlnaW4pOm4ueHMwPW4uZT1wKTplZShwK1wiXCIsZCkpLGYmJihzLl90cmFuc2Zvcm1UeXBlPWQuc3ZnJiZTZXx8IWMmJjMhPT10aGlzLl90cmFuc2Zvcm1UeXBlPzI6Myksbn0scHJlZml4OiEwfSksZGUoXCJib3hTaGFkb3dcIix7ZGVmYXVsdFZhbHVlOlwiMHB4IDBweCAwcHggMHB4ICM5OTlcIixwcmVmaXg6ITAsY29sb3I6ITAsbXVsdGk6ITAsa2V5d29yZDpcImluc2V0XCJ9KSxkZShcImJvcmRlclJhZGl1c1wiLHtkZWZhdWx0VmFsdWU6XCIwcHhcIixwYXJzZXI6ZnVuY3Rpb24odCxlLGksbixhKXtlPXRoaXMuZm9ybWF0KGUpO3ZhciBvLGgsbCxfLHUscCxjLGYsbSxkLGcsdix5LFQsdyx4LGI9W1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIixcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIsXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdLFA9dC5zdHlsZTtmb3IobT1wYXJzZUZsb2F0KHQub2Zmc2V0V2lkdGgpLGQ9cGFyc2VGbG9hdCh0Lm9mZnNldEhlaWdodCksbz1lLnNwbGl0KFwiIFwiKSxoPTA7Yi5sZW5ndGg+aDtoKyspdGhpcy5wLmluZGV4T2YoXCJib3JkZXJcIikmJihiW2hdPVYoYltoXSkpLHU9Xz1XKHQsYltoXSxyLCExLFwiMHB4XCIpLC0xIT09dS5pbmRleE9mKFwiIFwiKSYmKF89dS5zcGxpdChcIiBcIiksdT1fWzBdLF89X1sxXSkscD1sPW9baF0sYz1wYXJzZUZsb2F0KHUpLHY9dS5zdWJzdHIoKGMrXCJcIikubGVuZ3RoKSx5PVwiPVwiPT09cC5jaGFyQXQoMSkseT8oZj1wYXJzZUludChwLmNoYXJBdCgwKStcIjFcIiwxMCkscD1wLnN1YnN0cigyKSxmKj1wYXJzZUZsb2F0KHApLGc9cC5zdWJzdHIoKGYrXCJcIikubGVuZ3RoLSgwPmY/MTowKSl8fFwiXCIpOihmPXBhcnNlRmxvYXQocCksZz1wLnN1YnN0cigoZitcIlwiKS5sZW5ndGgpKSxcIlwiPT09ZyYmKGc9c1tpXXx8diksZyE9PXYmJihUPVEodCxcImJvcmRlckxlZnRcIixjLHYpLHc9USh0LFwiYm9yZGVyVG9wXCIsYyx2KSxcIiVcIj09PWc/KHU9MTAwKihUL20pK1wiJVwiLF89MTAwKih3L2QpK1wiJVwiKTpcImVtXCI9PT1nPyh4PVEodCxcImJvcmRlckxlZnRcIiwxLFwiZW1cIiksdT1UL3grXCJlbVwiLF89dy94K1wiZW1cIik6KHU9VCtcInB4XCIsXz13K1wicHhcIikseSYmKHA9cGFyc2VGbG9hdCh1KStmK2csbD1wYXJzZUZsb2F0KF8pK2YrZykpLGE9Y2UoUCxiW2hdLHUrXCIgXCIrXyxwK1wiIFwiK2wsITEsXCIwcHhcIixhKTtyZXR1cm4gYX0scHJlZml4OiEwLGZvcm1hdHRlcjpsZShcIjBweCAwcHggMHB4IDBweFwiLCExLCEwKX0pLGRlKFwiYmFja2dyb3VuZFBvc2l0aW9uXCIse2RlZmF1bHRWYWx1ZTpcIjAgMFwiLHBhcnNlcjpmdW5jdGlvbih0LGUsaSxzLG4sYSl7dmFyIG8saCxsLF8sdSxwLGM9XCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIsbT1yfHxHKHQsbnVsbCksZD10aGlzLmZvcm1hdCgobT9mP20uZ2V0UHJvcGVydHlWYWx1ZShjK1wiLXhcIikrXCIgXCIrbS5nZXRQcm9wZXJ0eVZhbHVlKGMrXCIteVwiKTptLmdldFByb3BlcnR5VmFsdWUoYyk6dC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWCtcIiBcIit0LmN1cnJlbnRTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25ZKXx8XCIwIDBcIiksZz10aGlzLmZvcm1hdChlKTtpZigtMSE9PWQuaW5kZXhPZihcIiVcIikhPSgtMSE9PWcuaW5kZXhPZihcIiVcIikpJiYocD1XKHQsXCJiYWNrZ3JvdW5kSW1hZ2VcIikucmVwbGFjZShrLFwiXCIpLHAmJlwibm9uZVwiIT09cCkpe2ZvcihvPWQuc3BsaXQoXCIgXCIpLGg9Zy5zcGxpdChcIiBcIiksTC5zZXRBdHRyaWJ1dGUoXCJzcmNcIixwKSxsPTI7LS1sPi0xOylkPW9bbF0sXz0tMSE9PWQuaW5kZXhPZihcIiVcIiksXyE9PSgtMSE9PWhbbF0uaW5kZXhPZihcIiVcIikpJiYodT0wPT09bD90Lm9mZnNldFdpZHRoLUwud2lkdGg6dC5vZmZzZXRIZWlnaHQtTC5oZWlnaHQsb1tsXT1fP3BhcnNlRmxvYXQoZCkvMTAwKnUrXCJweFwiOjEwMCoocGFyc2VGbG9hdChkKS91KStcIiVcIik7ZD1vLmpvaW4oXCIgXCIpfXJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLGQsZyxuLGEpfSxmb3JtYXR0ZXI6ZWV9KSxkZShcImJhY2tncm91bmRTaXplXCIse2RlZmF1bHRWYWx1ZTpcIjAgMFwiLGZvcm1hdHRlcjplZX0pLGRlKFwicGVyc3BlY3RpdmVcIix7ZGVmYXVsdFZhbHVlOlwiMHB4XCIscHJlZml4OiEwfSksZGUoXCJwZXJzcGVjdGl2ZU9yaWdpblwiLHtkZWZhdWx0VmFsdWU6XCI1MCUgNTAlXCIscHJlZml4OiEwfSksZGUoXCJ0cmFuc2Zvcm1TdHlsZVwiLHtwcmVmaXg6ITB9KSxkZShcImJhY2tmYWNlVmlzaWJpbGl0eVwiLHtwcmVmaXg6ITB9KSxkZShcInVzZXJTZWxlY3RcIix7cHJlZml4OiEwfSksZGUoXCJtYXJnaW5cIix7cGFyc2VyOl9lKFwibWFyZ2luVG9wLG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxtYXJnaW5MZWZ0XCIpfSksZGUoXCJwYWRkaW5nXCIse3BhcnNlcjpfZShcInBhZGRpbmdUb3AscGFkZGluZ1JpZ2h0LHBhZGRpbmdCb3R0b20scGFkZGluZ0xlZnRcIil9KSxkZShcImNsaXBcIix7ZGVmYXVsdFZhbHVlOlwicmVjdCgwcHgsMHB4LDBweCwwcHgpXCIscGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMsbixhKXt2YXIgbyxoLGw7cmV0dXJuIDk+Zj8oaD10LmN1cnJlbnRTdHlsZSxsPTg+Zj9cIiBcIjpcIixcIixvPVwicmVjdChcIitoLmNsaXBUb3ArbCtoLmNsaXBSaWdodCtsK2guY2xpcEJvdHRvbStsK2guY2xpcExlZnQrXCIpXCIsZT10aGlzLmZvcm1hdChlKS5zcGxpdChcIixcIikuam9pbihsKSk6KG89dGhpcy5mb3JtYXQoVyh0LHRoaXMucCxyLCExLHRoaXMuZGZsdCkpLGU9dGhpcy5mb3JtYXQoZSkpLHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsbyxlLG4sYSl9fSksZGUoXCJ0ZXh0U2hhZG93XCIse2RlZmF1bHRWYWx1ZTpcIjBweCAwcHggMHB4ICM5OTlcIixjb2xvcjohMCxtdWx0aTohMH0pLGRlKFwiYXV0b1JvdW5kLHN0cmljdFVuaXRzXCIse3BhcnNlcjpmdW5jdGlvbih0LGUsaSxzLHIpe3JldHVybiByfX0pLGRlKFwiYm9yZGVyXCIse2RlZmF1bHRWYWx1ZTpcIjBweCBzb2xpZCAjMDAwXCIscGFyc2VyOmZ1bmN0aW9uKHQsZSxpLHMsbixhKXtyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSx0aGlzLmZvcm1hdChXKHQsXCJib3JkZXJUb3BXaWR0aFwiLHIsITEsXCIwcHhcIikrXCIgXCIrVyh0LFwiYm9yZGVyVG9wU3R5bGVcIixyLCExLFwic29saWRcIikrXCIgXCIrVyh0LFwiYm9yZGVyVG9wQ29sb3JcIixyLCExLFwiIzAwMFwiKSksdGhpcy5mb3JtYXQoZSksbixhKX0sY29sb3I6ITAsZm9ybWF0dGVyOmZ1bmN0aW9uKHQpe3ZhciBlPXQuc3BsaXQoXCIgXCIpO3JldHVybiBlWzBdK1wiIFwiKyhlWzFdfHxcInNvbGlkXCIpK1wiIFwiKyh0Lm1hdGNoKGhlKXx8W1wiIzAwMFwiXSlbMF19fSksZGUoXCJib3JkZXJXaWR0aFwiLHtwYXJzZXI6X2UoXCJib3JkZXJUb3BXaWR0aCxib3JkZXJSaWdodFdpZHRoLGJvcmRlckJvdHRvbVdpZHRoLGJvcmRlckxlZnRXaWR0aFwiKX0pLGRlKFwiZmxvYXQsY3NzRmxvYXQsc3R5bGVGbG9hdFwiLHtwYXJzZXI6ZnVuY3Rpb24odCxlLGkscyxyKXt2YXIgbj10LnN0eWxlLGE9XCJjc3NGbG9hdFwiaW4gbj9cImNzc0Zsb2F0XCI6XCJzdHlsZUZsb2F0XCI7cmV0dXJuIG5ldyBwZShuLGEsMCwwLHIsLTEsaSwhMSwwLG5bYV0sZSl9fSk7dmFyIERlPWZ1bmN0aW9uKHQpe3ZhciBlLGk9dGhpcy50LHM9aS5maWx0ZXJ8fFcodGhpcy5kYXRhLFwiZmlsdGVyXCIpfHxcIlwiLHI9MHx0aGlzLnMrdGhpcy5jKnQ7MTAwPT09ciYmKC0xPT09cy5pbmRleE9mKFwiYXRyaXgoXCIpJiYtMT09PXMuaW5kZXhPZihcInJhZGllbnQoXCIpJiYtMT09PXMuaW5kZXhPZihcIm9hZGVyKFwiKT8oaS5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIiksZT0hVyh0aGlzLmRhdGEsXCJmaWx0ZXJcIikpOihpLmZpbHRlcj1zLnJlcGxhY2UoeCxcIlwiKSxlPSEwKSksZXx8KHRoaXMueG4xJiYoaS5maWx0ZXI9cz1zfHxcImFscGhhKG9wYWNpdHk9XCIrcitcIilcIiksLTE9PT1zLmluZGV4T2YoXCJwYWNpdHlcIik/MD09PXImJnRoaXMueG4xfHwoaS5maWx0ZXI9cytcIiBhbHBoYShvcGFjaXR5PVwiK3IrXCIpXCIpOmkuZmlsdGVyPXMucmVwbGFjZShULFwib3BhY2l0eT1cIityKSl9O2RlKFwib3BhY2l0eSxhbHBoYSxhdXRvQWxwaGFcIix7ZGVmYXVsdFZhbHVlOlwiMVwiLHBhcnNlcjpmdW5jdGlvbih0LGUsaSxzLG4sYSl7dmFyIG89cGFyc2VGbG9hdChXKHQsXCJvcGFjaXR5XCIsciwhMSxcIjFcIikpLGg9dC5zdHlsZSxsPVwiYXV0b0FscGhhXCI9PT1pO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlJiZcIj1cIj09PWUuY2hhckF0KDEpJiYoZT0oXCItXCI9PT1lLmNoYXJBdCgwKT8tMToxKSpwYXJzZUZsb2F0KGUuc3Vic3RyKDIpKStvKSxsJiYxPT09byYmXCJoaWRkZW5cIj09PVcodCxcInZpc2liaWxpdHlcIixyKSYmMCE9PWUmJihvPTApLFU/bj1uZXcgcGUoaCxcIm9wYWNpdHlcIixvLGUtbyxuKToobj1uZXcgcGUoaCxcIm9wYWNpdHlcIiwxMDAqbywxMDAqKGUtbyksbiksbi54bjE9bD8xOjAsaC56b29tPTEsbi50eXBlPTIsbi5iPVwiYWxwaGEob3BhY2l0eT1cIituLnMrXCIpXCIsbi5lPVwiYWxwaGEob3BhY2l0eT1cIisobi5zK24uYykrXCIpXCIsbi5kYXRhPXQsbi5wbHVnaW49YSxuLnNldFJhdGlvPURlKSxsJiYobj1uZXcgcGUoaCxcInZpc2liaWxpdHlcIiwwLDAsbiwtMSxudWxsLCExLDAsMCE9PW8/XCJpbmhlcml0XCI6XCJoaWRkZW5cIiwwPT09ZT9cImhpZGRlblwiOlwiaW5oZXJpdFwiKSxuLnhzMD1cImluaGVyaXRcIixzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKG4ubikscy5fb3ZlcndyaXRlUHJvcHMucHVzaChpKSksbn19KTt2YXIgTWU9ZnVuY3Rpb24odCxlKXtlJiYodC5yZW1vdmVQcm9wZXJ0eT8oXCJtc1wiPT09ZS5zdWJzdHIoMCwyKSYmKGU9XCJNXCIrZS5zdWJzdHIoMSkpLHQucmVtb3ZlUHJvcGVydHkoZS5yZXBsYWNlKFAsXCItJDFcIikudG9Mb3dlckNhc2UoKSkpOnQucmVtb3ZlQXR0cmlidXRlKGUpKX0semU9ZnVuY3Rpb24odCl7aWYodGhpcy50Ll9nc0NsYXNzUFQ9dGhpcywxPT09dHx8MD09PXQpe3RoaXMudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLDA9PT10P3RoaXMuYjp0aGlzLmUpO2Zvcih2YXIgZT10aGlzLmRhdGEsaT10aGlzLnQuc3R5bGU7ZTspZS52P2lbZS5wXT1lLnY6TWUoaSxlLnApLGU9ZS5fbmV4dDsxPT09dCYmdGhpcy50Ll9nc0NsYXNzUFQ9PT10aGlzJiYodGhpcy50Ll9nc0NsYXNzUFQ9bnVsbCl9ZWxzZSB0aGlzLnQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikhPT10aGlzLmUmJnRoaXMudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLHRoaXMuZSl9O2RlKFwiY2xhc3NOYW1lXCIse3BhcnNlcjpmdW5jdGlvbih0LGUscyxuLGEsbyxoKXt2YXIgbCxfLHUscCxjLGY9dC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIixtPXQuc3R5bGUuY3NzVGV4dDtpZihhPW4uX2NsYXNzTmFtZVBUPW5ldyBwZSh0LHMsMCwwLGEsMiksYS5zZXRSYXRpbz16ZSxhLnByPS0xMSxpPSEwLGEuYj1mLF89JCh0LHIpLHU9dC5fZ3NDbGFzc1BUKXtmb3IocD17fSxjPXUuZGF0YTtjOylwW2MucF09MSxjPWMuX25leHQ7dS5zZXRSYXRpbygxKX1yZXR1cm4gdC5fZ3NDbGFzc1BUPWEsYS5lPVwiPVwiIT09ZS5jaGFyQXQoMSk/ZTpmLnJlcGxhY2UoUmVnRXhwKFwiXFxcXHMqXFxcXGJcIitlLnN1YnN0cigyKStcIlxcXFxiXCIpLFwiXCIpKyhcIitcIj09PWUuY2hhckF0KDApP1wiIFwiK2Uuc3Vic3RyKDIpOlwiXCIpLG4uX3R3ZWVuLl9kdXJhdGlvbiYmKHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixhLmUpLGw9SCh0LF8sJCh0KSxoLHApLHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixmKSxhLmRhdGE9bC5maXJzdE1QVCx0LnN0eWxlLmNzc1RleHQ9bSxhPWEueGZpcnN0PW4ucGFyc2UodCxsLmRpZnMsYSxvKSksYX19KTt2YXIgSWU9ZnVuY3Rpb24odCl7aWYoKDE9PT10fHwwPT09dCkmJnRoaXMuZGF0YS5fdG90YWxUaW1lPT09dGhpcy5kYXRhLl90b3RhbER1cmF0aW9uJiZcImlzRnJvbVN0YXJ0XCIhPT10aGlzLmRhdGEuZGF0YSl7dmFyIGUsaSxzLHIsbj10aGlzLnQuc3R5bGUsYT1vLnRyYW5zZm9ybS5wYXJzZTtpZihcImFsbFwiPT09dGhpcy5lKW4uY3NzVGV4dD1cIlwiLHI9ITA7ZWxzZSBmb3IoZT10aGlzLmUuc3BsaXQoXCIgXCIpLmpvaW4oXCJcIikuc3BsaXQoXCIsXCIpLHM9ZS5sZW5ndGg7LS1zPi0xOylpPWVbc10sb1tpXSYmKG9baV0ucGFyc2U9PT1hP3I9ITA6aT1cInRyYW5zZm9ybU9yaWdpblwiPT09aT93ZTpvW2ldLnApLE1lKG4saSk7ciYmKE1lKG4seWUpLHRoaXMudC5fZ3NUcmFuc2Zvcm0mJmRlbGV0ZSB0aGlzLnQuX2dzVHJhbnNmb3JtKX19O2ZvcihkZShcImNsZWFyUHJvcHNcIix7cGFyc2VyOmZ1bmN0aW9uKHQsZSxzLHIsbil7cmV0dXJuIG49bmV3IHBlKHQscywwLDAsbiwyKSxuLnNldFJhdGlvPUllLG4uZT1lLG4ucHI9LTEwLG4uZGF0YT1yLl90d2VlbixpPSEwLG59fSksaD1cImJlemllcix0aHJvd1Byb3BzLHBoeXNpY3NQcm9wcyxwaHlzaWNzMkRcIi5zcGxpdChcIixcIiksZmU9aC5sZW5ndGg7ZmUtLTspZ2UoaFtmZV0pO2g9YS5wcm90b3R5cGUsaC5fZmlyc3RQVD1udWxsLGguX29uSW5pdFR3ZWVuPWZ1bmN0aW9uKHQsZSxvKXtpZighdC5ub2RlVHlwZSlyZXR1cm4hMTt0aGlzLl90YXJnZXQ9dCx0aGlzLl90d2Vlbj1vLHRoaXMuX3ZhcnM9ZSxsPWUuYXV0b1JvdW5kLGk9ITEscz1lLnN1ZmZpeE1hcHx8YS5zdWZmaXhNYXAscj1HKHQsXCJcIiksbj10aGlzLl9vdmVyd3JpdGVQcm9wczt2YXIgaCxwLGYsbSxkLGcsdix5LFQseD10LnN0eWxlO2lmKF8mJlwiXCI9PT14LnpJbmRleCYmKGg9Vyh0LFwiekluZGV4XCIsciksKFwiYXV0b1wiPT09aHx8XCJcIj09PWgpJiZ0aGlzLl9hZGRMYXp5U2V0KHgsXCJ6SW5kZXhcIiwwKSksXCJzdHJpbmdcIj09dHlwZW9mIGUmJihtPXguY3NzVGV4dCxoPSQodCxyKSx4LmNzc1RleHQ9bStcIjtcIitlLGg9SCh0LGgsJCh0KSkuZGlmcywhVSYmdy50ZXN0KGUpJiYoaC5vcGFjaXR5PXBhcnNlRmxvYXQoUmVnRXhwLiQxKSksZT1oLHguY3NzVGV4dD1tKSx0aGlzLl9maXJzdFBUPXA9dGhpcy5wYXJzZSh0LGUsbnVsbCksdGhpcy5fdHJhbnNmb3JtVHlwZSl7Zm9yKFQ9Mz09PXRoaXMuX3RyYW5zZm9ybVR5cGUseWU/dSYmKF89ITAsXCJcIj09PXguekluZGV4JiYodj1XKHQsXCJ6SW5kZXhcIixyKSwoXCJhdXRvXCI9PT12fHxcIlwiPT09dikmJnRoaXMuX2FkZExhenlTZXQoeCxcInpJbmRleFwiLDApKSxjJiZ0aGlzLl9hZGRMYXp5U2V0KHgsXCJXZWJraXRCYWNrZmFjZVZpc2liaWxpdHlcIix0aGlzLl92YXJzLldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eXx8KFQ/XCJ2aXNpYmxlXCI6XCJoaWRkZW5cIikpKTp4Lnpvb209MSxmPXA7ZiYmZi5fbmV4dDspZj1mLl9uZXh0O3k9bmV3IHBlKHQsXCJ0cmFuc2Zvcm1cIiwwLDAsbnVsbCwyKSx0aGlzLl9saW5rQ1NTUCh5LG51bGwsZikseS5zZXRSYXRpbz1UJiZ4ZT9PZTp5ZT9DZTpBZSx5LmRhdGE9dGhpcy5fdHJhbnNmb3JtfHxSZSh0LHIsITApLG4ucG9wKClcbn1pZihpKXtmb3IoO3A7KXtmb3IoZz1wLl9uZXh0LGY9bTtmJiZmLnByPnAucHI7KWY9Zi5fbmV4dDsocC5fcHJldj1mP2YuX3ByZXY6ZCk/cC5fcHJldi5fbmV4dD1wOm09cCwocC5fbmV4dD1mKT9mLl9wcmV2PXA6ZD1wLHA9Z310aGlzLl9maXJzdFBUPW19cmV0dXJuITB9LGgucGFyc2U9ZnVuY3Rpb24odCxlLGksbil7dmFyIGEsaCxfLHUscCxjLGYsbSxkLGcsdj10LnN0eWxlO2ZvcihhIGluIGUpYz1lW2FdLGg9b1thXSxoP2k9aC5wYXJzZSh0LGMsYSx0aGlzLGksbixlKToocD1XKHQsYSxyKStcIlwiLGQ9XCJzdHJpbmdcIj09dHlwZW9mIGMsXCJjb2xvclwiPT09YXx8XCJmaWxsXCI9PT1hfHxcInN0cm9rZVwiPT09YXx8LTEhPT1hLmluZGV4T2YoXCJDb2xvclwiKXx8ZCYmYi50ZXN0KGMpPyhkfHwoYz1vZShjKSxjPShjLmxlbmd0aD4zP1wicmdiYShcIjpcInJnYihcIikrYy5qb2luKFwiLFwiKStcIilcIiksaT1jZSh2LGEscCxjLCEwLFwidHJhbnNwYXJlbnRcIixpLDAsbikpOiFkfHwtMT09PWMuaW5kZXhPZihcIiBcIikmJi0xPT09Yy5pbmRleE9mKFwiLFwiKT8oXz1wYXJzZUZsb2F0KHApLGY9X3x8MD09PV8/cC5zdWJzdHIoKF8rXCJcIikubGVuZ3RoKTpcIlwiLChcIlwiPT09cHx8XCJhdXRvXCI9PT1wKSYmKFwid2lkdGhcIj09PWF8fFwiaGVpZ2h0XCI9PT1hPyhfPXRlKHQsYSxyKSxmPVwicHhcIik6XCJsZWZ0XCI9PT1hfHxcInRvcFwiPT09YT8oXz1aKHQsYSxyKSxmPVwicHhcIik6KF89XCJvcGFjaXR5XCIhPT1hPzA6MSxmPVwiXCIpKSxnPWQmJlwiPVwiPT09Yy5jaGFyQXQoMSksZz8odT1wYXJzZUludChjLmNoYXJBdCgwKStcIjFcIiwxMCksYz1jLnN1YnN0cigyKSx1Kj1wYXJzZUZsb2F0KGMpLG09Yy5yZXBsYWNlKHksXCJcIikpOih1PXBhcnNlRmxvYXQoYyksbT1kP2Muc3Vic3RyKCh1K1wiXCIpLmxlbmd0aCl8fFwiXCI6XCJcIiksXCJcIj09PW0mJihtPWEgaW4gcz9zW2FdOmYpLGM9dXx8MD09PXU/KGc/dStfOnUpK206ZVthXSxmIT09bSYmXCJcIiE9PW0mJih1fHwwPT09dSkmJl8mJihfPVEodCxhLF8sZiksXCIlXCI9PT1tPyhfLz1RKHQsYSwxMDAsXCIlXCIpLzEwMCxlLnN0cmljdFVuaXRzIT09ITAmJihwPV8rXCIlXCIpKTpcImVtXCI9PT1tP18vPVEodCxhLDEsXCJlbVwiKTpcInB4XCIhPT1tJiYodT1RKHQsYSx1LG0pLG09XCJweFwiKSxnJiYodXx8MD09PXUpJiYoYz11K18rbSkpLGcmJih1Kz1fKSwhXyYmMCE9PV98fCF1JiYwIT09dT92b2lkIDAhPT12W2FdJiYoY3x8XCJOYU5cIiE9YytcIlwiJiZudWxsIT1jKT8oaT1uZXcgcGUodixhLHV8fF98fDAsMCxpLC0xLGEsITEsMCxwLGMpLGkueHMwPVwibm9uZVwiIT09Y3x8XCJkaXNwbGF5XCIhPT1hJiYtMT09PWEuaW5kZXhPZihcIlN0eWxlXCIpP2M6cCk6aihcImludmFsaWQgXCIrYStcIiB0d2VlbiB2YWx1ZTogXCIrZVthXSk6KGk9bmV3IHBlKHYsYSxfLHUtXyxpLDAsYSxsIT09ITEmJihcInB4XCI9PT1tfHxcInpJbmRleFwiPT09YSksMCxwLGMpLGkueHMwPW0pKTppPWNlKHYsYSxwLGMsITAsbnVsbCxpLDAsbikpLG4mJmkmJiFpLnBsdWdpbiYmKGkucGx1Z2luPW4pO3JldHVybiBpfSxoLnNldFJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyPXRoaXMuX2ZpcnN0UFQsbj0xZS02O2lmKDEhPT10fHx0aGlzLl90d2Vlbi5fdGltZSE9PXRoaXMuX3R3ZWVuLl9kdXJhdGlvbiYmMCE9PXRoaXMuX3R3ZWVuLl90aW1lKWlmKHR8fHRoaXMuX3R3ZWVuLl90aW1lIT09dGhpcy5fdHdlZW4uX2R1cmF0aW9uJiYwIT09dGhpcy5fdHdlZW4uX3RpbWV8fHRoaXMuX3R3ZWVuLl9yYXdQcmV2VGltZT09PS0xZS02KWZvcig7cjspe2lmKGU9ci5jKnQrci5zLHIucj9lPU1hdGgucm91bmQoZSk6bj5lJiZlPi1uJiYoZT0wKSxyLnR5cGUpaWYoMT09PXIudHlwZSlpZihzPXIubCwyPT09cylyLnRbci5wXT1yLnhzMCtlK3IueHMxK3IueG4xK3IueHMyO2Vsc2UgaWYoMz09PXMpci50W3IucF09ci54czArZStyLnhzMStyLnhuMStyLnhzMityLnhuMityLnhzMztlbHNlIGlmKDQ9PT1zKXIudFtyLnBdPXIueHMwK2Urci54czErci54bjErci54czIrci54bjIrci54czMrci54bjMrci54czQ7ZWxzZSBpZig1PT09cylyLnRbci5wXT1yLnhzMCtlK3IueHMxK3IueG4xK3IueHMyK3IueG4yK3IueHMzK3IueG4zK3IueHM0K3IueG40K3IueHM1O2Vsc2V7Zm9yKGk9ci54czArZStyLnhzMSxzPTE7ci5sPnM7cysrKWkrPXJbXCJ4blwiK3NdK3JbXCJ4c1wiKyhzKzEpXTtyLnRbci5wXT1pfWVsc2UtMT09PXIudHlwZT9yLnRbci5wXT1yLnhzMDpyLnNldFJhdGlvJiZyLnNldFJhdGlvKHQpO2Vsc2Ugci50W3IucF09ZStyLnhzMDtyPXIuX25leHR9ZWxzZSBmb3IoO3I7KTIhPT1yLnR5cGU/ci50W3IucF09ci5iOnIuc2V0UmF0aW8odCkscj1yLl9uZXh0O2Vsc2UgZm9yKDtyOykyIT09ci50eXBlP3IudFtyLnBdPXIuZTpyLnNldFJhdGlvKHQpLHI9ci5fbmV4dH0saC5fZW5hYmxlVHJhbnNmb3Jtcz1mdW5jdGlvbih0KXt0aGlzLl90cmFuc2Zvcm09dGhpcy5fdHJhbnNmb3JtfHxSZSh0aGlzLl90YXJnZXQsciwhMCksdGhpcy5fdHJhbnNmb3JtVHlwZT10aGlzLl90cmFuc2Zvcm0uc3ZnJiZTZXx8IXQmJjMhPT10aGlzLl90cmFuc2Zvcm1UeXBlPzI6M307dmFyIEVlPWZ1bmN0aW9uKCl7dGhpcy50W3RoaXMucF09dGhpcy5lLHRoaXMuZGF0YS5fbGlua0NTU1AodGhpcyx0aGlzLl9uZXh0LG51bGwsITApfTtoLl9hZGRMYXp5U2V0PWZ1bmN0aW9uKHQsZSxpKXt2YXIgcz10aGlzLl9maXJzdFBUPW5ldyBwZSh0LGUsMCwwLHRoaXMuX2ZpcnN0UFQsMik7cy5lPWkscy5zZXRSYXRpbz1FZSxzLmRhdGE9dGhpc30saC5fbGlua0NTU1A9ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHQmJihlJiYoZS5fcHJldj10KSx0Ll9uZXh0JiYodC5fbmV4dC5fcHJldj10Ll9wcmV2KSx0Ll9wcmV2P3QuX3ByZXYuX25leHQ9dC5fbmV4dDp0aGlzLl9maXJzdFBUPT09dCYmKHRoaXMuX2ZpcnN0UFQ9dC5fbmV4dCxzPSEwKSxpP2kuX25leHQ9dDpzfHxudWxsIT09dGhpcy5fZmlyc3RQVHx8KHRoaXMuX2ZpcnN0UFQ9dCksdC5fbmV4dD1lLHQuX3ByZXY9aSksdH0saC5fa2lsbD1mdW5jdGlvbihlKXt2YXIgaSxzLHIsbj1lO2lmKGUuYXV0b0FscGhhfHxlLmFscGhhKXtuPXt9O2ZvcihzIGluIGUpbltzXT1lW3NdO24ub3BhY2l0eT0xLG4uYXV0b0FscGhhJiYobi52aXNpYmlsaXR5PTEpfXJldHVybiBlLmNsYXNzTmFtZSYmKGk9dGhpcy5fY2xhc3NOYW1lUFQpJiYocj1pLnhmaXJzdCxyJiZyLl9wcmV2P3RoaXMuX2xpbmtDU1NQKHIuX3ByZXYsaS5fbmV4dCxyLl9wcmV2Ll9wcmV2KTpyPT09dGhpcy5fZmlyc3RQVCYmKHRoaXMuX2ZpcnN0UFQ9aS5fbmV4dCksaS5fbmV4dCYmdGhpcy5fbGlua0NTU1AoaS5fbmV4dCxpLl9uZXh0Ll9uZXh0LHIuX3ByZXYpLHRoaXMuX2NsYXNzTmFtZVBUPW51bGwpLHQucHJvdG90eXBlLl9raWxsLmNhbGwodGhpcyxuKX07dmFyIEZlPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcyxyLG4sYTtpZih0LnNsaWNlKWZvcihyPXQubGVuZ3RoOy0tcj4tMTspRmUodFtyXSxlLGkpO2Vsc2UgZm9yKHM9dC5jaGlsZE5vZGVzLHI9cy5sZW5ndGg7LS1yPi0xOyluPXNbcl0sYT1uLnR5cGUsbi5zdHlsZSYmKGUucHVzaCgkKG4pKSxpJiZpLnB1c2gobikpLDEhPT1hJiY5IT09YSYmMTEhPT1hfHwhbi5jaGlsZE5vZGVzLmxlbmd0aHx8RmUobixlLGkpfTtyZXR1cm4gYS5jYXNjYWRlVG89ZnVuY3Rpb24odCxpLHMpe3ZhciByLG4sYSxvPWUudG8odCxpLHMpLGg9W29dLGw9W10sXz1bXSx1PVtdLHA9ZS5faW50ZXJuYWxzLnJlc2VydmVkUHJvcHM7Zm9yKHQ9by5fdGFyZ2V0c3x8by50YXJnZXQsRmUodCxsLHUpLG8ucmVuZGVyKGksITApLEZlKHQsXyksby5yZW5kZXIoMCwhMCksby5fZW5hYmxlZCghMCkscj11Lmxlbmd0aDstLXI+LTE7KWlmKG49SCh1W3JdLGxbcl0sX1tyXSksbi5maXJzdE1QVCl7bj1uLmRpZnM7Zm9yKGEgaW4gcylwW2FdJiYoblthXT1zW2FdKTtoLnB1c2goZS50byh1W3JdLGksbikpfXJldHVybiBofSx0LmFjdGl2YXRlKFthXSksYX0sITApLGZ1bmN0aW9uKCl7dmFyIHQ9X2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7cHJvcE5hbWU6XCJyb3VuZFByb3BzXCIscHJpb3JpdHk6LTEsQVBJOjIsaW5pdDpmdW5jdGlvbih0LGUsaSl7cmV0dXJuIHRoaXMuX3R3ZWVuPWksITB9fSksZT10LnByb3RvdHlwZTtlLl9vbkluaXRBbGxQcm9wcz1mdW5jdGlvbigpe2Zvcih2YXIgdCxlLGkscz10aGlzLl90d2VlbixyPXMudmFycy5yb3VuZFByb3BzIGluc3RhbmNlb2YgQXJyYXk/cy52YXJzLnJvdW5kUHJvcHM6cy52YXJzLnJvdW5kUHJvcHMuc3BsaXQoXCIsXCIpLG49ci5sZW5ndGgsYT17fSxvPXMuX3Byb3BMb29rdXAucm91bmRQcm9wczstLW4+LTE7KWFbcltuXV09MTtmb3Iobj1yLmxlbmd0aDstLW4+LTE7KWZvcih0PXJbbl0sZT1zLl9maXJzdFBUO2U7KWk9ZS5fbmV4dCxlLnBnP2UudC5fcm91bmRQcm9wcyhhLCEwKTplLm49PT10JiYodGhpcy5fYWRkKGUudCx0LGUucyxlLmMpLGkmJihpLl9wcmV2PWUuX3ByZXYpLGUuX3ByZXY/ZS5fcHJldi5fbmV4dD1pOnMuX2ZpcnN0UFQ9PT1lJiYocy5fZmlyc3RQVD1pKSxlLl9uZXh0PWUuX3ByZXY9bnVsbCxzLl9wcm9wTG9va3VwW3RdPW8pLGU9aTtyZXR1cm4hMX0sZS5fYWRkPWZ1bmN0aW9uKHQsZSxpLHMpe3RoaXMuX2FkZFR3ZWVuKHQsZSxpLGkrcyxlLCEwKSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKGUpfX0oKSxfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtwcm9wTmFtZTpcImF0dHJcIixBUEk6Mix2ZXJzaW9uOlwiMC4zLjNcIixpbml0OmZ1bmN0aW9uKHQsZSl7dmFyIGkscyxyO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQuc2V0QXR0cmlidXRlKXJldHVybiExO3RoaXMuX3RhcmdldD10LHRoaXMuX3Byb3h5PXt9LHRoaXMuX3N0YXJ0PXt9LHRoaXMuX2VuZD17fTtmb3IoaSBpbiBlKXRoaXMuX3N0YXJ0W2ldPXRoaXMuX3Byb3h5W2ldPXM9dC5nZXRBdHRyaWJ1dGUoaSkscj10aGlzLl9hZGRUd2Vlbih0aGlzLl9wcm94eSxpLHBhcnNlRmxvYXQocyksZVtpXSxpKSx0aGlzLl9lbmRbaV09cj9yLnMrci5jOmVbaV0sdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChpKTtyZXR1cm4hMH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcyx0KTtmb3IodmFyIGUsaT10aGlzLl9vdmVyd3JpdGVQcm9wcyxzPWkubGVuZ3RoLHI9MT09PXQ/dGhpcy5fZW5kOnQ/dGhpcy5fcHJveHk6dGhpcy5fc3RhcnQ7LS1zPi0xOyllPWlbc10sdGhpcy5fdGFyZ2V0LnNldEF0dHJpYnV0ZShlLHJbZV0rXCJcIil9fSksX2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7cHJvcE5hbWU6XCJkaXJlY3Rpb25hbFJvdGF0aW9uXCIsdmVyc2lvbjpcIjAuMi4xXCIsQVBJOjIsaW5pdDpmdW5jdGlvbih0LGUpe1wib2JqZWN0XCIhPXR5cGVvZiBlJiYoZT17cm90YXRpb246ZX0pLHRoaXMuZmluYWxzPXt9O3ZhciBpLHMscixuLGEsbyxoPWUudXNlUmFkaWFucz09PSEwPzIqTWF0aC5QSTozNjAsbD0xZS02O2ZvcihpIGluIGUpXCJ1c2VSYWRpYW5zXCIhPT1pJiYobz0oZVtpXStcIlwiKS5zcGxpdChcIl9cIikscz1vWzBdLHI9cGFyc2VGbG9hdChcImZ1bmN0aW9uXCIhPXR5cGVvZiB0W2ldP3RbaV06dFtpLmluZGV4T2YoXCJzZXRcIil8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRbXCJnZXRcIitpLnN1YnN0cigzKV0/aTpcImdldFwiK2kuc3Vic3RyKDMpXSgpKSxuPXRoaXMuZmluYWxzW2ldPVwic3RyaW5nXCI9PXR5cGVvZiBzJiZcIj1cIj09PXMuY2hhckF0KDEpP3IrcGFyc2VJbnQocy5jaGFyQXQoMCkrXCIxXCIsMTApKk51bWJlcihzLnN1YnN0cigyKSk6TnVtYmVyKHMpfHwwLGE9bi1yLG8ubGVuZ3RoJiYocz1vLmpvaW4oXCJfXCIpLC0xIT09cy5pbmRleE9mKFwic2hvcnRcIikmJihhJT1oLGEhPT1hJShoLzIpJiYoYT0wPmE/YStoOmEtaCkpLC0xIT09cy5pbmRleE9mKFwiX2N3XCIpJiYwPmE/YT0oYSs5OTk5OTk5OTk5KmgpJWgtKDB8YS9oKSpoOi0xIT09cy5pbmRleE9mKFwiY2N3XCIpJiZhPjAmJihhPShhLTk5OTk5OTk5OTkqaCklaC0oMHxhL2gpKmgpKSwoYT5sfHwtbD5hKSYmKHRoaXMuX2FkZFR3ZWVuKHQsaSxyLHIrYSxpKSx0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKGkpKSk7cmV0dXJuITB9LHNldDpmdW5jdGlvbih0KXt2YXIgZTtpZigxIT09dCl0aGlzLl9zdXBlci5zZXRSYXRpby5jYWxsKHRoaXMsdCk7ZWxzZSBmb3IoZT10aGlzLl9maXJzdFBUO2U7KWUuZj9lLnRbZS5wXSh0aGlzLmZpbmFsc1tlLnBdKTplLnRbZS5wXT10aGlzLmZpbmFsc1tlLnBdLGU9ZS5fbmV4dH19KS5fYXV0b0NTUz0hMCxfZ3NTY29wZS5fZ3NEZWZpbmUoXCJlYXNpbmcuQmFja1wiLFtcImVhc2luZy5FYXNlXCJdLGZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyPV9nc1Njb3BlLkdyZWVuU29ja0dsb2JhbHN8fF9nc1Njb3BlLG49ci5jb20uZ3JlZW5zb2NrLGE9MipNYXRoLlBJLG89TWF0aC5QSS8yLGg9bi5fY2xhc3MsbD1mdW5jdGlvbihlLGkpe3ZhciBzPWgoXCJlYXNpbmcuXCIrZSxmdW5jdGlvbigpe30sITApLHI9cy5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIHIuY29uc3RydWN0b3I9cyxyLmdldFJhdGlvPWksc30sXz10LnJlZ2lzdGVyfHxmdW5jdGlvbigpe30sdT1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcj1oKFwiZWFzaW5nLlwiK3Qse2Vhc2VPdXQ6bmV3IGUsZWFzZUluOm5ldyBpLGVhc2VJbk91dDpuZXcgc30sITApO3JldHVybiBfKHIsdCkscn0scD1mdW5jdGlvbih0LGUsaSl7dGhpcy50PXQsdGhpcy52PWUsaSYmKHRoaXMubmV4dD1pLGkucHJldj10aGlzLHRoaXMuYz1pLnYtZSx0aGlzLmdhcD1pLnQtdCl9LGM9ZnVuY3Rpb24oZSxpKXt2YXIgcz1oKFwiZWFzaW5nLlwiK2UsZnVuY3Rpb24odCl7dGhpcy5fcDE9dHx8MD09PXQ/dDoxLjcwMTU4LHRoaXMuX3AyPTEuNTI1KnRoaXMuX3AxfSwhMCkscj1zLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gci5jb25zdHJ1Y3Rvcj1zLHIuZ2V0UmF0aW89aSxyLmNvbmZpZz1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IHModCl9LHN9LGY9dShcIkJhY2tcIixjKFwiQmFja091dFwiLGZ1bmN0aW9uKHQpe3JldHVybih0LT0xKSp0KigodGhpcy5fcDErMSkqdCt0aGlzLl9wMSkrMX0pLGMoXCJCYWNrSW5cIixmdW5jdGlvbih0KXtyZXR1cm4gdCp0KigodGhpcy5fcDErMSkqdC10aGlzLl9wMSl9KSxjKFwiQmFja0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy41KnQqdCooKHRoaXMuX3AyKzEpKnQtdGhpcy5fcDIpOi41KigodC09MikqdCooKHRoaXMuX3AyKzEpKnQrdGhpcy5fcDIpKzIpfSkpLG09aChcImVhc2luZy5TbG93TW9cIixmdW5jdGlvbih0LGUsaSl7ZT1lfHwwPT09ZT9lOi43LG51bGw9PXQ/dD0uNzp0PjEmJih0PTEpLHRoaXMuX3A9MSE9PXQ/ZTowLHRoaXMuX3AxPSgxLXQpLzIsdGhpcy5fcDI9dCx0aGlzLl9wMz10aGlzLl9wMSt0aGlzLl9wMix0aGlzLl9jYWxjRW5kPWk9PT0hMH0sITApLGQ9bS5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIGQuY29uc3RydWN0b3I9bSxkLmdldFJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlPXQrKC41LXQpKnRoaXMuX3A7cmV0dXJuIHRoaXMuX3AxPnQ/dGhpcy5fY2FsY0VuZD8xLSh0PTEtdC90aGlzLl9wMSkqdDplLSh0PTEtdC90aGlzLl9wMSkqdCp0KnQqZTp0PnRoaXMuX3AzP3RoaXMuX2NhbGNFbmQ/MS0odD0odC10aGlzLl9wMykvdGhpcy5fcDEpKnQ6ZSsodC1lKSoodD0odC10aGlzLl9wMykvdGhpcy5fcDEpKnQqdCp0OnRoaXMuX2NhbGNFbmQ/MTplfSxtLmVhc2U9bmV3IG0oLjcsLjcpLGQuY29uZmlnPW0uY29uZmlnPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gbmV3IG0odCxlLGkpfSxlPWgoXCJlYXNpbmcuU3RlcHBlZEVhc2VcIixmdW5jdGlvbih0KXt0PXR8fDEsdGhpcy5fcDE9MS90LHRoaXMuX3AyPXQrMX0sITApLGQ9ZS5wcm90b3R5cGU9bmV3IHQsZC5jb25zdHJ1Y3Rvcj1lLGQuZ2V0UmF0aW89ZnVuY3Rpb24odCl7cmV0dXJuIDA+dD90PTA6dD49MSYmKHQ9Ljk5OTk5OTk5OSksKHRoaXMuX3AyKnQ+PjApKnRoaXMuX3AxfSxkLmNvbmZpZz1lLmNvbmZpZz1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IGUodCl9LGk9aChcImVhc2luZy5Sb3VnaEVhc2VcIixmdW5jdGlvbihlKXtlPWV8fHt9O2Zvcih2YXIgaSxzLHIsbixhLG8saD1lLnRhcGVyfHxcIm5vbmVcIixsPVtdLF89MCx1PTB8KGUucG9pbnRzfHwyMCksYz11LGY9ZS5yYW5kb21pemUhPT0hMSxtPWUuY2xhbXA9PT0hMCxkPWUudGVtcGxhdGUgaW5zdGFuY2VvZiB0P2UudGVtcGxhdGU6bnVsbCxnPVwibnVtYmVyXCI9PXR5cGVvZiBlLnN0cmVuZ3RoPy40KmUuc3RyZW5ndGg6LjQ7LS1jPi0xOylpPWY/TWF0aC5yYW5kb20oKToxL3UqYyxzPWQ/ZC5nZXRSYXRpbyhpKTppLFwibm9uZVwiPT09aD9yPWc6XCJvdXRcIj09PWg/KG49MS1pLHI9bipuKmcpOlwiaW5cIj09PWg/cj1pKmkqZzouNT5pPyhuPTIqaSxyPS41Km4qbipnKToobj0yKigxLWkpLHI9LjUqbipuKmcpLGY/cys9TWF0aC5yYW5kb20oKSpyLS41KnI6YyUyP3MrPS41KnI6cy09LjUqcixtJiYocz4xP3M9MTowPnMmJihzPTApKSxsW18rK109e3g6aSx5OnN9O2ZvcihsLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdC54LWUueH0pLG89bmV3IHAoMSwxLG51bGwpLGM9dTstLWM+LTE7KWE9bFtjXSxvPW5ldyBwKGEueCxhLnksbyk7dGhpcy5fcHJldj1uZXcgcCgwLDAsMCE9PW8udD9vOm8ubmV4dCl9LCEwKSxkPWkucHJvdG90eXBlPW5ldyB0LGQuY29uc3RydWN0b3I9aSxkLmdldFJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuX3ByZXY7aWYodD5lLnQpe2Zvcig7ZS5uZXh0JiZ0Pj1lLnQ7KWU9ZS5uZXh0O2U9ZS5wcmV2fWVsc2UgZm9yKDtlLnByZXYmJmUudD49dDspZT1lLnByZXY7cmV0dXJuIHRoaXMuX3ByZXY9ZSxlLnYrKHQtZS50KS9lLmdhcCplLmN9LGQuY29uZmlnPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgaSh0KX0saS5lYXNlPW5ldyBpLHUoXCJCb3VuY2VcIixsKFwiQm91bmNlT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/Ny41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzU6Mi41LzIuNzU+dD83LjU2MjUqKHQtPTIuMjUvMi43NSkqdCsuOTM3NTo3LjU2MjUqKHQtPTIuNjI1LzIuNzUpKnQrLjk4NDM3NX0pLGwoXCJCb3VuY2VJblwiLGZ1bmN0aW9uKHQpe3JldHVybiAxLzIuNzU+KHQ9MS10KT8xLTcuNTYyNSp0KnQ6Mi8yLjc1PnQ/MS0oNy41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzUpOjIuNS8yLjc1PnQ/MS0oNy41NjI1Kih0LT0yLjI1LzIuNzUpKnQrLjkzNzUpOjEtKDcuNTYyNSoodC09Mi42MjUvMi43NSkqdCsuOTg0Mzc1KX0pLGwoXCJCb3VuY2VJbk91dFwiLGZ1bmN0aW9uKHQpe3ZhciBlPS41PnQ7cmV0dXJuIHQ9ZT8xLTIqdDoyKnQtMSx0PTEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/Ny41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzU6Mi41LzIuNzU+dD83LjU2MjUqKHQtPTIuMjUvMi43NSkqdCsuOTM3NTo3LjU2MjUqKHQtPTIuNjI1LzIuNzUpKnQrLjk4NDM3NSxlPy41KigxLXQpOi41KnQrLjV9KSksdShcIkNpcmNcIixsKFwiQ2lyY091dFwiLGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0odC09MSkqdCl9KSxsKFwiQ2lyY0luXCIsZnVuY3Rpb24odCl7cmV0dXJuLShNYXRoLnNxcnQoMS10KnQpLTEpfSksbChcIkNpcmNJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LT0yKSp0KSsxKX0pKSxzPWZ1bmN0aW9uKGUsaSxzKXt2YXIgcj1oKFwiZWFzaW5nLlwiK2UsZnVuY3Rpb24odCxlKXt0aGlzLl9wMT10fHwxLHRoaXMuX3AyPWV8fHMsdGhpcy5fcDM9dGhpcy5fcDIvYSooTWF0aC5hc2luKDEvdGhpcy5fcDEpfHwwKX0sITApLG49ci5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIG4uY29uc3RydWN0b3I9cixuLmdldFJhdGlvPWksbi5jb25maWc9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3IHIodCxlKX0scn0sdShcIkVsYXN0aWNcIixzKFwiRWxhc3RpY091dFwiLGZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9wMSpNYXRoLnBvdygyLC0xMCp0KSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMikrMX0sLjMpLHMoXCJFbGFzdGljSW5cIixmdW5jdGlvbih0KXtyZXR1cm4tKHRoaXMuX3AxKk1hdGgucG93KDIsMTAqKHQtPTEpKSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMikpfSwuMykscyhcIkVsYXN0aWNJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8tLjUqdGhpcy5fcDEqTWF0aC5wb3coMiwxMCoodC09MSkpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKTouNSp0aGlzLl9wMSpNYXRoLnBvdygyLC0xMCoodC09MSkpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKSsxfSwuNDUpKSx1KFwiRXhwb1wiLGwoXCJFeHBvT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5wb3coMiwtMTAqdCl9KSxsKFwiRXhwb0luXCIsZnVuY3Rpb24odCl7cmV0dXJuIE1hdGgucG93KDIsMTAqKHQtMSkpLS4wMDF9KSxsKFwiRXhwb0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy41Kk1hdGgucG93KDIsMTAqKHQtMSkpOi41KigyLU1hdGgucG93KDIsLTEwKih0LTEpKSl9KSksdShcIlNpbmVcIixsKFwiU2luZU91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNpbih0Km8pfSksbChcIlNpbmVJblwiLGZ1bmN0aW9uKHQpe3JldHVybi1NYXRoLmNvcyh0Km8pKzF9KSxsKFwiU2luZUluT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuLS41KihNYXRoLmNvcyhNYXRoLlBJKnQpLTEpfSkpLGgoXCJlYXNpbmcuRWFzZUxvb2t1cFwiLHtmaW5kOmZ1bmN0aW9uKGUpe3JldHVybiB0Lm1hcFtlXX19LCEwKSxfKHIuU2xvd01vLFwiU2xvd01vXCIsXCJlYXNlLFwiKSxfKGksXCJSb3VnaEVhc2VcIixcImVhc2UsXCIpLF8oZSxcIlN0ZXBwZWRFYXNlXCIsXCJlYXNlLFwiKSxmfSwhMCl9KSxfZ3NTY29wZS5fZ3NEZWZpbmUmJl9nc1Njb3BlLl9nc1F1ZXVlLnBvcCgpKCksZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjt2YXIgaT10LkdyZWVuU29ja0dsb2JhbHM9dC5HcmVlblNvY2tHbG9iYWxzfHx0O2lmKCFpLlR3ZWVuTGl0ZSl7dmFyIHMscixuLGEsbyxoPWZ1bmN0aW9uKHQpe3ZhciBlLHM9dC5zcGxpdChcIi5cIikscj1pO2ZvcihlPTA7cy5sZW5ndGg+ZTtlKyspcltzW2VdXT1yPXJbc1tlXV18fHt9O3JldHVybiByfSxsPWgoXCJjb20uZ3JlZW5zb2NrXCIpLF89MWUtMTAsdT1mdW5jdGlvbih0KXt2YXIgZSxpPVtdLHM9dC5sZW5ndGg7Zm9yKGU9MDtlIT09cztpLnB1c2godFtlKytdKSk7cmV0dXJuIGl9LHA9ZnVuY3Rpb24oKXt9LGM9ZnVuY3Rpb24oKXt2YXIgdD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGU9dC5jYWxsKFtdKTtyZXR1cm4gZnVuY3Rpb24oaSl7cmV0dXJuIG51bGwhPWkmJihpIGluc3RhbmNlb2YgQXJyYXl8fFwib2JqZWN0XCI9PXR5cGVvZiBpJiYhIWkucHVzaCYmdC5jYWxsKGkpPT09ZSl9fSgpLGY9e30sbT1mdW5jdGlvbihzLHIsbixhKXt0aGlzLnNjPWZbc10/ZltzXS5zYzpbXSxmW3NdPXRoaXMsdGhpcy5nc0NsYXNzPW51bGwsdGhpcy5mdW5jPW47dmFyIG89W107dGhpcy5jaGVjaz1mdW5jdGlvbihsKXtmb3IodmFyIF8sdSxwLGMsZD1yLmxlbmd0aCxnPWQ7LS1kPi0xOykoXz1mW3JbZF1dfHxuZXcgbShyW2RdLFtdKSkuZ3NDbGFzcz8ob1tkXT1fLmdzQ2xhc3MsZy0tKTpsJiZfLnNjLnB1c2godGhpcyk7aWYoMD09PWcmJm4pZm9yKHU9KFwiY29tLmdyZWVuc29jay5cIitzKS5zcGxpdChcIi5cIikscD11LnBvcCgpLGM9aCh1LmpvaW4oXCIuXCIpKVtwXT10aGlzLmdzQ2xhc3M9bi5hcHBseShuLG8pLGEmJihpW3BdPWMsXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZSgodC5HcmVlblNvY2tBTURQYXRoP3QuR3JlZW5Tb2NrQU1EUGF0aCtcIi9cIjpcIlwiKStzLnNwbGl0KFwiLlwiKS5wb3AoKSxbXSxmdW5jdGlvbigpe3JldHVybiBjfSk6cz09PWUmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9YykpLGQ9MDt0aGlzLnNjLmxlbmd0aD5kO2QrKyl0aGlzLnNjW2RdLmNoZWNrKCl9LHRoaXMuY2hlY2soITApfSxkPXQuX2dzRGVmaW5lPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiBuZXcgbSh0LGUsaSxzKX0sZz1sLl9jbGFzcz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIGU9ZXx8ZnVuY3Rpb24oKXt9LGQodCxbXSxmdW5jdGlvbigpe3JldHVybiBlfSxpKSxlfTtkLmdsb2JhbHM9aTt2YXIgdj1bMCwwLDEsMV0seT1bXSxUPWcoXCJlYXNpbmcuRWFzZVwiLGZ1bmN0aW9uKHQsZSxpLHMpe3RoaXMuX2Z1bmM9dCx0aGlzLl90eXBlPWl8fDAsdGhpcy5fcG93ZXI9c3x8MCx0aGlzLl9wYXJhbXM9ZT92LmNvbmNhdChlKTp2fSwhMCksdz1ULm1hcD17fSx4PVQucmVnaXN0ZXI9ZnVuY3Rpb24odCxlLGkscyl7Zm9yKHZhciByLG4sYSxvLGg9ZS5zcGxpdChcIixcIiksXz1oLmxlbmd0aCx1PShpfHxcImVhc2VJbixlYXNlT3V0LGVhc2VJbk91dFwiKS5zcGxpdChcIixcIik7LS1fPi0xOylmb3Iobj1oW19dLHI9cz9nKFwiZWFzaW5nLlwiK24sbnVsbCwhMCk6bC5lYXNpbmdbbl18fHt9LGE9dS5sZW5ndGg7LS1hPi0xOylvPXVbYV0sd1tuK1wiLlwiK29dPXdbbytuXT1yW29dPXQuZ2V0UmF0aW8/dDp0W29dfHxuZXcgdH07Zm9yKG49VC5wcm90b3R5cGUsbi5fY2FsY0VuZD0hMSxuLmdldFJhdGlvPWZ1bmN0aW9uKHQpe2lmKHRoaXMuX2Z1bmMpcmV0dXJuIHRoaXMuX3BhcmFtc1swXT10LHRoaXMuX2Z1bmMuYXBwbHkobnVsbCx0aGlzLl9wYXJhbXMpO3ZhciBlPXRoaXMuX3R5cGUsaT10aGlzLl9wb3dlcixzPTE9PT1lPzEtdDoyPT09ZT90Oi41PnQ/Mip0OjIqKDEtdCk7cmV0dXJuIDE9PT1pP3MqPXM6Mj09PWk/cyo9cypzOjM9PT1pP3MqPXMqcypzOjQ9PT1pJiYocyo9cypzKnMqcyksMT09PWU/MS1zOjI9PT1lP3M6LjU+dD9zLzI6MS1zLzJ9LHM9W1wiTGluZWFyXCIsXCJRdWFkXCIsXCJDdWJpY1wiLFwiUXVhcnRcIixcIlF1aW50LFN0cm9uZ1wiXSxyPXMubGVuZ3RoOy0tcj4tMTspbj1zW3JdK1wiLFBvd2VyXCIrcix4KG5ldyBUKG51bGwsbnVsbCwxLHIpLG4sXCJlYXNlT3V0XCIsITApLHgobmV3IFQobnVsbCxudWxsLDIsciksbixcImVhc2VJblwiKygwPT09cj9cIixlYXNlTm9uZVwiOlwiXCIpKSx4KG5ldyBUKG51bGwsbnVsbCwzLHIpLG4sXCJlYXNlSW5PdXRcIik7dy5saW5lYXI9bC5lYXNpbmcuTGluZWFyLmVhc2VJbix3LnN3aW5nPWwuZWFzaW5nLlF1YWQuZWFzZUluT3V0O3ZhciBiPWcoXCJldmVudHMuRXZlbnREaXNwYXRjaGVyXCIsZnVuY3Rpb24odCl7dGhpcy5fbGlzdGVuZXJzPXt9LHRoaXMuX2V2ZW50VGFyZ2V0PXR8fHRoaXN9KTtuPWIucHJvdG90eXBlLG4uYWRkRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUsaSxzLHIpe3I9cnx8MDt2YXIgbixoLGw9dGhpcy5fbGlzdGVuZXJzW3RdLF89MDtmb3IobnVsbD09bCYmKHRoaXMuX2xpc3RlbmVyc1t0XT1sPVtdKSxoPWwubGVuZ3RoOy0taD4tMTspbj1sW2hdLG4uYz09PWUmJm4ucz09PWk/bC5zcGxpY2UoaCwxKTowPT09XyYmcj5uLnByJiYoXz1oKzEpO2wuc3BsaWNlKF8sMCx7YzplLHM6aSx1cDpzLHByOnJ9KSx0aGlzIT09YXx8b3x8YS53YWtlKCl9LG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe3ZhciBpLHM9dGhpcy5fbGlzdGVuZXJzW3RdO2lmKHMpZm9yKGk9cy5sZW5ndGg7LS1pPi0xOylpZihzW2ldLmM9PT1lKXJldHVybiBzLnNwbGljZShpLDEpLHZvaWQgMH0sbi5kaXNwYXRjaEV2ZW50PWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyPXRoaXMuX2xpc3RlbmVyc1t0XTtpZihyKWZvcihlPXIubGVuZ3RoLGk9dGhpcy5fZXZlbnRUYXJnZXQ7LS1lPi0xOylzPXJbZV0scyYmKHMudXA/cy5jLmNhbGwocy5zfHxpLHt0eXBlOnQsdGFyZ2V0Oml9KTpzLmMuY2FsbChzLnN8fGkpKX07dmFyIFA9dC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsUz10LmNhbmNlbEFuaW1hdGlvbkZyYW1lLGs9RGF0ZS5ub3d8fGZ1bmN0aW9uKCl7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCl9LFI9aygpO2ZvcihzPVtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXSxyPXMubGVuZ3RoOy0tcj4tMSYmIVA7KVA9dFtzW3JdK1wiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdLFM9dFtzW3JdK1wiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl18fHRbc1tyXStcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtnKFwiVGlja2VyXCIsZnVuY3Rpb24odCxlKXt2YXIgaSxzLHIsbixoLGw9dGhpcyx1PWsoKSxjPWUhPT0hMSYmUCxmPTUwMCxtPTMzLGQ9ZnVuY3Rpb24odCl7dmFyIGUsYSxvPWsoKS1SO28+ZiYmKHUrPW8tbSksUis9byxsLnRpbWU9KFItdSkvMWUzLGU9bC50aW1lLWgsKCFpfHxlPjB8fHQ9PT0hMCkmJihsLmZyYW1lKyssaCs9ZSsoZT49bj8uMDA0Om4tZSksYT0hMCksdCE9PSEwJiYocj1zKGQpKSxhJiZsLmRpc3BhdGNoRXZlbnQoXCJ0aWNrXCIpfTtiLmNhbGwobCksbC50aW1lPWwuZnJhbWU9MCxsLnRpY2s9ZnVuY3Rpb24oKXtkKCEwKX0sbC5sYWdTbW9vdGhpbmc9ZnVuY3Rpb24odCxlKXtmPXR8fDEvXyxtPU1hdGgubWluKGUsZiwwKX0sbC5zbGVlcD1mdW5jdGlvbigpe251bGwhPXImJihjJiZTP1Mocik6Y2xlYXJUaW1lb3V0KHIpLHM9cCxyPW51bGwsbD09PWEmJihvPSExKSl9LGwud2FrZT1mdW5jdGlvbigpe251bGwhPT1yP2wuc2xlZXAoKTpsLmZyYW1lPjEwJiYoUj1rKCktZis1KSxzPTA9PT1pP3A6YyYmUD9QOmZ1bmN0aW9uKHQpe3JldHVybiBzZXRUaW1lb3V0KHQsMHwxZTMqKGgtbC50aW1lKSsxKX0sbD09PWEmJihvPSEwKSxkKDIpfSxsLmZwcz1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8oaT10LG49MS8oaXx8NjApLGg9dGhpcy50aW1lK24sbC53YWtlKCksdm9pZCAwKTppfSxsLnVzZVJBRj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8obC5zbGVlcCgpLGM9dCxsLmZwcyhpKSx2b2lkIDApOmN9LGwuZnBzKHQpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtjJiYoIXJ8fDU+bC5mcmFtZSkmJmwudXNlUkFGKCExKX0sMTUwMCl9KSxuPWwuVGlja2VyLnByb3RvdHlwZT1uZXcgbC5ldmVudHMuRXZlbnREaXNwYXRjaGVyLG4uY29uc3RydWN0b3I9bC5UaWNrZXI7dmFyIEE9ZyhcImNvcmUuQW5pbWF0aW9uXCIsZnVuY3Rpb24odCxlKXtpZih0aGlzLnZhcnM9ZT1lfHx7fSx0aGlzLl9kdXJhdGlvbj10aGlzLl90b3RhbER1cmF0aW9uPXR8fDAsdGhpcy5fZGVsYXk9TnVtYmVyKGUuZGVsYXkpfHwwLHRoaXMuX3RpbWVTY2FsZT0xLHRoaXMuX2FjdGl2ZT1lLmltbWVkaWF0ZVJlbmRlcj09PSEwLHRoaXMuZGF0YT1lLmRhdGEsdGhpcy5fcmV2ZXJzZWQ9ZS5yZXZlcnNlZD09PSEwLEIpe298fGEud2FrZSgpO3ZhciBpPXRoaXMudmFycy51c2VGcmFtZXM/ajpCO2kuYWRkKHRoaXMsaS5fdGltZSksdGhpcy52YXJzLnBhdXNlZCYmdGhpcy5wYXVzZWQoITApfX0pO2E9QS50aWNrZXI9bmV3IGwuVGlja2VyLG49QS5wcm90b3R5cGUsbi5fZGlydHk9bi5fZ2M9bi5faW5pdHRlZD1uLl9wYXVzZWQ9ITEsbi5fdG90YWxUaW1lPW4uX3RpbWU9MCxuLl9yYXdQcmV2VGltZT0tMSxuLl9uZXh0PW4uX2xhc3Q9bi5fb25VcGRhdGU9bi5fdGltZWxpbmU9bi50aW1lbGluZT1udWxsLG4uX3BhdXNlZD0hMTt2YXIgTz1mdW5jdGlvbigpe28mJmsoKS1SPjJlMyYmYS53YWtlKCksc2V0VGltZW91dChPLDJlMyl9O08oKSxuLnBsYXk9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5zZWVrKHQsZSksdGhpcy5yZXZlcnNlZCghMSkucGF1c2VkKCExKX0sbi5wYXVzZT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsIT10JiZ0aGlzLnNlZWsodCxlKSx0aGlzLnBhdXNlZCghMCl9LG4ucmVzdW1lPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0LGUpLHRoaXMucGF1c2VkKCExKX0sbi5zZWVrPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMudG90YWxUaW1lKE51bWJlcih0KSxlIT09ITEpfSxuLnJlc3RhcnQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5yZXZlcnNlZCghMSkucGF1c2VkKCExKS50b3RhbFRpbWUodD8tdGhpcy5fZGVsYXk6MCxlIT09ITEsITApfSxuLnJldmVyc2U9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5zZWVrKHR8fHRoaXMudG90YWxEdXJhdGlvbigpLGUpLHRoaXMucmV2ZXJzZWQoITApLnBhdXNlZCghMSl9LG4ucmVuZGVyPWZ1bmN0aW9uKCl7fSxuLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWU9MCx0aGlzLl9pbml0dGVkPXRoaXMuX2djPSExLHRoaXMuX3Jhd1ByZXZUaW1lPS0xLCh0aGlzLl9nY3x8IXRoaXMudGltZWxpbmUpJiZ0aGlzLl9lbmFibGVkKCEwKSx0aGlzfSxuLmlzQWN0aXZlPWZ1bmN0aW9uKCl7dmFyIHQsZT10aGlzLl90aW1lbGluZSxpPXRoaXMuX3N0YXJ0VGltZTtyZXR1cm4hZXx8IXRoaXMuX2djJiYhdGhpcy5fcGF1c2VkJiZlLmlzQWN0aXZlKCkmJih0PWUucmF3VGltZSgpKT49aSYmaSt0aGlzLnRvdGFsRHVyYXRpb24oKS90aGlzLl90aW1lU2NhbGU+dH0sbi5fZW5hYmxlZD1mdW5jdGlvbih0LGUpe3JldHVybiBvfHxhLndha2UoKSx0aGlzLl9nYz0hdCx0aGlzLl9hY3RpdmU9dGhpcy5pc0FjdGl2ZSgpLGUhPT0hMCYmKHQmJiF0aGlzLnRpbWVsaW5lP3RoaXMuX3RpbWVsaW5lLmFkZCh0aGlzLHRoaXMuX3N0YXJ0VGltZS10aGlzLl9kZWxheSk6IXQmJnRoaXMudGltZWxpbmUmJnRoaXMuX3RpbWVsaW5lLl9yZW1vdmUodGhpcywhMCkpLCExfSxuLl9raWxsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2VuYWJsZWQoITEsITEpfSxuLmtpbGw9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fa2lsbCh0LGUpLHRoaXN9LG4uX3VuY2FjaGU9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQ/dGhpczp0aGlzLnRpbWVsaW5lO2U7KWUuX2RpcnR5PSEwLGU9ZS50aW1lbGluZTtyZXR1cm4gdGhpc30sbi5fc3dhcFNlbGZJblBhcmFtcz1mdW5jdGlvbih0KXtmb3IodmFyIGU9dC5sZW5ndGgsaT10LmNvbmNhdCgpOy0tZT4tMTspXCJ7c2VsZn1cIj09PXRbZV0mJihpW2VdPXRoaXMpO3JldHVybiBpfSxuLmV2ZW50Q2FsbGJhY2s9ZnVuY3Rpb24odCxlLGkscyl7aWYoXCJvblwiPT09KHR8fFwiXCIpLnN1YnN0cigwLDIpKXt2YXIgcj10aGlzLnZhcnM7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHJbdF07bnVsbD09ZT9kZWxldGUgclt0XTooclt0XT1lLHJbdCtcIlBhcmFtc1wiXT1jKGkpJiYtMSE9PWkuam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpP3RoaXMuX3N3YXBTZWxmSW5QYXJhbXMoaSk6aSxyW3QrXCJTY29wZVwiXT1zKSxcIm9uVXBkYXRlXCI9PT10JiYodGhpcy5fb25VcGRhdGU9ZSl9cmV0dXJuIHRoaXN9LG4uZGVsYXk9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nJiZ0aGlzLnN0YXJ0VGltZSh0aGlzLl9zdGFydFRpbWUrdC10aGlzLl9kZWxheSksdGhpcy5fZGVsYXk9dCx0aGlzKTp0aGlzLl9kZWxheX0sbi5kdXJhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fZHVyYXRpb249dGhpcy5fdG90YWxEdXJhdGlvbj10LHRoaXMuX3VuY2FjaGUoITApLHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nJiZ0aGlzLl90aW1lPjAmJnRoaXMuX3RpbWU8dGhpcy5fZHVyYXRpb24mJjAhPT10JiZ0aGlzLnRvdGFsVGltZSh0aGlzLl90b3RhbFRpbWUqKHQvdGhpcy5fZHVyYXRpb24pLCEwKSx0aGlzKToodGhpcy5fZGlydHk9ITEsdGhpcy5fZHVyYXRpb24pfSxuLnRvdGFsRHVyYXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2RpcnR5PSExLGFyZ3VtZW50cy5sZW5ndGg/dGhpcy5kdXJhdGlvbih0KTp0aGlzLl90b3RhbER1cmF0aW9ufSxuLnRpbWU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpLHRoaXMudG90YWxUaW1lKHQ+dGhpcy5fZHVyYXRpb24/dGhpcy5fZHVyYXRpb246dCxlKSk6dGhpcy5fdGltZX0sbi50b3RhbFRpbWU9ZnVuY3Rpb24odCxlLGkpe2lmKG98fGEud2FrZSgpLCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl90b3RhbFRpbWU7aWYodGhpcy5fdGltZWxpbmUpe2lmKDA+dCYmIWkmJih0Kz10aGlzLnRvdGFsRHVyYXRpb24oKSksdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpe3RoaXMuX2RpcnR5JiZ0aGlzLnRvdGFsRHVyYXRpb24oKTt2YXIgcz10aGlzLl90b3RhbER1cmF0aW9uLHI9dGhpcy5fdGltZWxpbmU7aWYodD5zJiYhaSYmKHQ9cyksdGhpcy5fc3RhcnRUaW1lPSh0aGlzLl9wYXVzZWQ/dGhpcy5fcGF1c2VUaW1lOnIuX3RpbWUpLSh0aGlzLl9yZXZlcnNlZD9zLXQ6dCkvdGhpcy5fdGltZVNjYWxlLHIuX2RpcnR5fHx0aGlzLl91bmNhY2hlKCExKSxyLl90aW1lbGluZSlmb3IoO3IuX3RpbWVsaW5lOylyLl90aW1lbGluZS5fdGltZSE9PShyLl9zdGFydFRpbWUrci5fdG90YWxUaW1lKS9yLl90aW1lU2NhbGUmJnIudG90YWxUaW1lKHIuX3RvdGFsVGltZSwhMCkscj1yLl90aW1lbGluZX10aGlzLl9nYyYmdGhpcy5fZW5hYmxlZCghMCwhMSksKHRoaXMuX3RvdGFsVGltZSE9PXR8fDA9PT10aGlzLl9kdXJhdGlvbikmJih0aGlzLnJlbmRlcih0LGUsITEpLEkubGVuZ3RoJiZxKCkpfXJldHVybiB0aGlzfSxuLnByb2dyZXNzPW4udG90YWxQcm9ncmVzcz1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP3RoaXMudG90YWxUaW1lKHRoaXMuZHVyYXRpb24oKSp0LGUpOnRoaXMuX3RpbWUvdGhpcy5kdXJhdGlvbigpfSxuLnN0YXJ0VGltZT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odCE9PXRoaXMuX3N0YXJ0VGltZSYmKHRoaXMuX3N0YXJ0VGltZT10LHRoaXMudGltZWxpbmUmJnRoaXMudGltZWxpbmUuX3NvcnRDaGlsZHJlbiYmdGhpcy50aW1lbGluZS5hZGQodGhpcyx0LXRoaXMuX2RlbGF5KSksdGhpcyk6dGhpcy5fc3RhcnRUaW1lfSxuLmVuZFRpbWU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3N0YXJ0VGltZSsoMCE9dD90aGlzLnRvdGFsRHVyYXRpb24oKTp0aGlzLmR1cmF0aW9uKCkpL3RoaXMuX3RpbWVTY2FsZX0sbi50aW1lU2NhbGU9ZnVuY3Rpb24odCl7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtpZih0PXR8fF8sdGhpcy5fdGltZWxpbmUmJnRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKXt2YXIgZT10aGlzLl9wYXVzZVRpbWUsaT1lfHwwPT09ZT9lOnRoaXMuX3RpbWVsaW5lLnRvdGFsVGltZSgpO3RoaXMuX3N0YXJ0VGltZT1pLShpLXRoaXMuX3N0YXJ0VGltZSkqdGhpcy5fdGltZVNjYWxlL3R9cmV0dXJuIHRoaXMuX3RpbWVTY2FsZT10LHRoaXMuX3VuY2FjaGUoITEpfSxuLnJldmVyc2VkPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0IT10aGlzLl9yZXZlcnNlZCYmKHRoaXMuX3JldmVyc2VkPXQsdGhpcy50b3RhbFRpbWUodGhpcy5fdGltZWxpbmUmJiF0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZz90aGlzLnRvdGFsRHVyYXRpb24oKS10aGlzLl90b3RhbFRpbWU6dGhpcy5fdG90YWxUaW1lLCEwKSksdGhpcyk6dGhpcy5fcmV2ZXJzZWR9LG4ucGF1c2VkPWZ1bmN0aW9uKHQpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9wYXVzZWQ7aWYodCE9dGhpcy5fcGF1c2VkJiZ0aGlzLl90aW1lbGluZSl7b3x8dHx8YS53YWtlKCk7dmFyIGU9dGhpcy5fdGltZWxpbmUsaT1lLnJhd1RpbWUoKSxzPWktdGhpcy5fcGF1c2VUaW1lOyF0JiZlLnNtb290aENoaWxkVGltaW5nJiYodGhpcy5fc3RhcnRUaW1lKz1zLHRoaXMuX3VuY2FjaGUoITEpKSx0aGlzLl9wYXVzZVRpbWU9dD9pOm51bGwsdGhpcy5fcGF1c2VkPXQsdGhpcy5fYWN0aXZlPXRoaXMuaXNBY3RpdmUoKSwhdCYmMCE9PXMmJnRoaXMuX2luaXR0ZWQmJnRoaXMuZHVyYXRpb24oKSYmdGhpcy5yZW5kZXIoZS5zbW9vdGhDaGlsZFRpbWluZz90aGlzLl90b3RhbFRpbWU6KGktdGhpcy5fc3RhcnRUaW1lKS90aGlzLl90aW1lU2NhbGUsITAsITApfXJldHVybiB0aGlzLl9nYyYmIXQmJnRoaXMuX2VuYWJsZWQoITAsITEpLHRoaXN9O3ZhciBDPWcoXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsZnVuY3Rpb24odCl7QS5jYWxsKHRoaXMsMCx0KSx0aGlzLmF1dG9SZW1vdmVDaGlsZHJlbj10aGlzLnNtb290aENoaWxkVGltaW5nPSEwfSk7bj1DLnByb3RvdHlwZT1uZXcgQSxuLmNvbnN0cnVjdG9yPUMsbi5raWxsKCkuX2djPSExLG4uX2ZpcnN0PW4uX2xhc3Q9bi5fcmVjZW50PW51bGwsbi5fc29ydENoaWxkcmVuPSExLG4uYWRkPW4uaW5zZXJ0PWZ1bmN0aW9uKHQsZSl7dmFyIGkscztpZih0Ll9zdGFydFRpbWU9TnVtYmVyKGV8fDApK3QuX2RlbGF5LHQuX3BhdXNlZCYmdGhpcyE9PXQuX3RpbWVsaW5lJiYodC5fcGF1c2VUaW1lPXQuX3N0YXJ0VGltZSsodGhpcy5yYXdUaW1lKCktdC5fc3RhcnRUaW1lKS90Ll90aW1lU2NhbGUpLHQudGltZWxpbmUmJnQudGltZWxpbmUuX3JlbW92ZSh0LCEwKSx0LnRpbWVsaW5lPXQuX3RpbWVsaW5lPXRoaXMsdC5fZ2MmJnQuX2VuYWJsZWQoITAsITApLGk9dGhpcy5fbGFzdCx0aGlzLl9zb3J0Q2hpbGRyZW4pZm9yKHM9dC5fc3RhcnRUaW1lO2kmJmkuX3N0YXJ0VGltZT5zOylpPWkuX3ByZXY7cmV0dXJuIGk/KHQuX25leHQ9aS5fbmV4dCxpLl9uZXh0PXQpOih0Ll9uZXh0PXRoaXMuX2ZpcnN0LHRoaXMuX2ZpcnN0PXQpLHQuX25leHQ/dC5fbmV4dC5fcHJldj10OnRoaXMuX2xhc3Q9dCx0Ll9wcmV2PWksdGhpcy5fcmVjZW50PXQsdGhpcy5fdGltZWxpbmUmJnRoaXMuX3VuY2FjaGUoITApLHRoaXN9LG4uX3JlbW92ZT1mdW5jdGlvbih0LGUpe3JldHVybiB0LnRpbWVsaW5lPT09dGhpcyYmKGV8fHQuX2VuYWJsZWQoITEsITApLHQuX3ByZXY/dC5fcHJldi5fbmV4dD10Ll9uZXh0OnRoaXMuX2ZpcnN0PT09dCYmKHRoaXMuX2ZpcnN0PXQuX25leHQpLHQuX25leHQ/dC5fbmV4dC5fcHJldj10Ll9wcmV2OnRoaXMuX2xhc3Q9PT10JiYodGhpcy5fbGFzdD10Ll9wcmV2KSx0Ll9uZXh0PXQuX3ByZXY9dC50aW1lbGluZT1udWxsLHQ9PT10aGlzLl9yZWNlbnQmJih0aGlzLl9yZWNlbnQ9dGhpcy5fbGFzdCksdGhpcy5fdGltZWxpbmUmJnRoaXMuX3VuY2FjaGUoITApKSx0aGlzfSxuLnJlbmRlcj1mdW5jdGlvbih0LGUsaSl7dmFyIHMscj10aGlzLl9maXJzdDtmb3IodGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9dGhpcy5fcmF3UHJldlRpbWU9dDtyOylzPXIuX25leHQsKHIuX2FjdGl2ZXx8dD49ci5fc3RhcnRUaW1lJiYhci5fcGF1c2VkKSYmKHIuX3JldmVyc2VkP3IucmVuZGVyKChyLl9kaXJ0eT9yLnRvdGFsRHVyYXRpb24oKTpyLl90b3RhbER1cmF0aW9uKS0odC1yLl9zdGFydFRpbWUpKnIuX3RpbWVTY2FsZSxlLGkpOnIucmVuZGVyKCh0LXIuX3N0YXJ0VGltZSkqci5fdGltZVNjYWxlLGUsaSkpLHI9c30sbi5yYXdUaW1lPWZ1bmN0aW9uKCl7cmV0dXJuIG98fGEud2FrZSgpLHRoaXMuX3RvdGFsVGltZX07dmFyIEQ9ZyhcIlR3ZWVuTGl0ZVwiLGZ1bmN0aW9uKGUsaSxzKXtpZihBLmNhbGwodGhpcyxpLHMpLHRoaXMucmVuZGVyPUQucHJvdG90eXBlLnJlbmRlcixudWxsPT1lKXRocm93XCJDYW5ub3QgdHdlZW4gYSBudWxsIHRhcmdldC5cIjt0aGlzLnRhcmdldD1lPVwic3RyaW5nXCIhPXR5cGVvZiBlP2U6RC5zZWxlY3RvcihlKXx8ZTt2YXIgcixuLGEsbz1lLmpxdWVyeXx8ZS5sZW5ndGgmJmUhPT10JiZlWzBdJiYoZVswXT09PXR8fGVbMF0ubm9kZVR5cGUmJmVbMF0uc3R5bGUmJiFlLm5vZGVUeXBlKSxoPXRoaXMudmFycy5vdmVyd3JpdGU7aWYodGhpcy5fb3ZlcndyaXRlPWg9bnVsbD09aD9ZW0QuZGVmYXVsdE92ZXJ3cml0ZV06XCJudW1iZXJcIj09dHlwZW9mIGg/aD4+MDpZW2hdLChvfHxlIGluc3RhbmNlb2YgQXJyYXl8fGUucHVzaCYmYyhlKSkmJlwibnVtYmVyXCIhPXR5cGVvZiBlWzBdKWZvcih0aGlzLl90YXJnZXRzPWE9dShlKSx0aGlzLl9wcm9wTG9va3VwPVtdLHRoaXMuX3NpYmxpbmdzPVtdLHI9MDthLmxlbmd0aD5yO3IrKyluPWFbcl0sbj9cInN0cmluZ1wiIT10eXBlb2Ygbj9uLmxlbmd0aCYmbiE9PXQmJm5bMF0mJihuWzBdPT09dHx8blswXS5ub2RlVHlwZSYmblswXS5zdHlsZSYmIW4ubm9kZVR5cGUpPyhhLnNwbGljZShyLS0sMSksdGhpcy5fdGFyZ2V0cz1hPWEuY29uY2F0KHUobikpKToodGhpcy5fc2libGluZ3Nbcl09VihuLHRoaXMsITEpLDE9PT1oJiZ0aGlzLl9zaWJsaW5nc1tyXS5sZW5ndGg+MSYmVyhuLHRoaXMsbnVsbCwxLHRoaXMuX3NpYmxpbmdzW3JdKSk6KG49YVtyLS1dPUQuc2VsZWN0b3IobiksXCJzdHJpbmdcIj09dHlwZW9mIG4mJmEuc3BsaWNlKHIrMSwxKSk6YS5zcGxpY2Uoci0tLDEpO2Vsc2UgdGhpcy5fcHJvcExvb2t1cD17fSx0aGlzLl9zaWJsaW5ncz1WKGUsdGhpcywhMSksMT09PWgmJnRoaXMuX3NpYmxpbmdzLmxlbmd0aD4xJiZXKGUsdGhpcyxudWxsLDEsdGhpcy5fc2libGluZ3MpOyh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyfHwwPT09aSYmMD09PXRoaXMuX2RlbGF5JiZ0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyIT09ITEpJiYodGhpcy5fdGltZT0tXyx0aGlzLnJlbmRlcigtdGhpcy5fZGVsYXkpKX0sITApLE09ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJmUubGVuZ3RoJiZlIT09dCYmZVswXSYmKGVbMF09PT10fHxlWzBdLm5vZGVUeXBlJiZlWzBdLnN0eWxlJiYhZS5ub2RlVHlwZSl9LHo9ZnVuY3Rpb24odCxlKXt2YXIgaSxzPXt9O2ZvcihpIGluIHQpVVtpXXx8aSBpbiBlJiZcInRyYW5zZm9ybVwiIT09aSYmXCJ4XCIhPT1pJiZcInlcIiE9PWkmJlwid2lkdGhcIiE9PWkmJlwiaGVpZ2h0XCIhPT1pJiZcImNsYXNzTmFtZVwiIT09aSYmXCJib3JkZXJcIiE9PWl8fCEoIUxbaV18fExbaV0mJkxbaV0uX2F1dG9DU1MpfHwoc1tpXT10W2ldLGRlbGV0ZSB0W2ldKTt0LmNzcz1zfTtuPUQucHJvdG90eXBlPW5ldyBBLG4uY29uc3RydWN0b3I9RCxuLmtpbGwoKS5fZ2M9ITEsbi5yYXRpbz0wLG4uX2ZpcnN0UFQ9bi5fdGFyZ2V0cz1uLl9vdmVyd3JpdHRlblByb3BzPW4uX3N0YXJ0QXQ9bnVsbCxuLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkPW4uX2xhenk9ITEsRC52ZXJzaW9uPVwiMS4xNC4xXCIsRC5kZWZhdWx0RWFzZT1uLl9lYXNlPW5ldyBUKG51bGwsbnVsbCwxLDEpLEQuZGVmYXVsdE92ZXJ3cml0ZT1cImF1dG9cIixELnRpY2tlcj1hLEQuYXV0b1NsZWVwPSEwLEQubGFnU21vb3RoaW5nPWZ1bmN0aW9uKHQsZSl7YS5sYWdTbW9vdGhpbmcodCxlKX0sRC5zZWxlY3Rvcj10LiR8fHQualF1ZXJ5fHxmdW5jdGlvbihlKXt2YXIgaT10LiR8fHQualF1ZXJ5O3JldHVybiBpPyhELnNlbGVjdG9yPWksaShlKSk6XCJ1bmRlZmluZWRcIj09dHlwZW9mIGRvY3VtZW50P2U6ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbD9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpOmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI1wiPT09ZS5jaGFyQXQoMCk/ZS5zdWJzdHIoMSk6ZSl9O3ZhciBJPVtdLEU9e30sRj1ELl9pbnRlcm5hbHM9e2lzQXJyYXk6Yyxpc1NlbGVjdG9yOk0sbGF6eVR3ZWVuczpJfSxMPUQuX3BsdWdpbnM9e30sTj1GLnR3ZWVuTG9va3VwPXt9LFg9MCxVPUYucmVzZXJ2ZWRQcm9wcz17ZWFzZToxLGRlbGF5OjEsb3ZlcndyaXRlOjEsb25Db21wbGV0ZToxLG9uQ29tcGxldGVQYXJhbXM6MSxvbkNvbXBsZXRlU2NvcGU6MSx1c2VGcmFtZXM6MSxydW5CYWNrd2FyZHM6MSxzdGFydEF0OjEsb25VcGRhdGU6MSxvblVwZGF0ZVBhcmFtczoxLG9uVXBkYXRlU2NvcGU6MSxvblN0YXJ0OjEsb25TdGFydFBhcmFtczoxLG9uU3RhcnRTY29wZToxLG9uUmV2ZXJzZUNvbXBsZXRlOjEsb25SZXZlcnNlQ29tcGxldGVQYXJhbXM6MSxvblJldmVyc2VDb21wbGV0ZVNjb3BlOjEsb25SZXBlYXQ6MSxvblJlcGVhdFBhcmFtczoxLG9uUmVwZWF0U2NvcGU6MSxlYXNlUGFyYW1zOjEseW95bzoxLGltbWVkaWF0ZVJlbmRlcjoxLHJlcGVhdDoxLHJlcGVhdERlbGF5OjEsZGF0YToxLHBhdXNlZDoxLHJldmVyc2VkOjEsYXV0b0NTUzoxLGxhenk6MSxvbk92ZXJ3cml0ZToxfSxZPXtub25lOjAsYWxsOjEsYXV0bzoyLGNvbmN1cnJlbnQ6MyxhbGxPblN0YXJ0OjQscHJlZXhpc3Rpbmc6NSxcInRydWVcIjoxLFwiZmFsc2VcIjowfSxqPUEuX3Jvb3RGcmFtZXNUaW1lbGluZT1uZXcgQyxCPUEuX3Jvb3RUaW1lbGluZT1uZXcgQyxxPUYubGF6eVJlbmRlcj1mdW5jdGlvbigpe3ZhciB0LGU9SS5sZW5ndGg7Zm9yKEU9e307LS1lPi0xOyl0PUlbZV0sdCYmdC5fbGF6eSE9PSExJiYodC5yZW5kZXIodC5fbGF6eVswXSx0Ll9sYXp5WzFdLCEwKSx0Ll9sYXp5PSExKTtJLmxlbmd0aD0wfTtCLl9zdGFydFRpbWU9YS50aW1lLGouX3N0YXJ0VGltZT1hLmZyYW1lLEIuX2FjdGl2ZT1qLl9hY3RpdmU9ITAsc2V0VGltZW91dChxLDEpLEEuX3VwZGF0ZVJvb3Q9RC5yZW5kZXI9ZnVuY3Rpb24oKXt2YXIgdCxlLGk7aWYoSS5sZW5ndGgmJnEoKSxCLnJlbmRlcigoYS50aW1lLUIuX3N0YXJ0VGltZSkqQi5fdGltZVNjYWxlLCExLCExKSxqLnJlbmRlcigoYS5mcmFtZS1qLl9zdGFydFRpbWUpKmouX3RpbWVTY2FsZSwhMSwhMSksSS5sZW5ndGgmJnEoKSwhKGEuZnJhbWUlMTIwKSl7Zm9yKGkgaW4gTil7Zm9yKGU9TltpXS50d2VlbnMsdD1lLmxlbmd0aDstLXQ+LTE7KWVbdF0uX2djJiZlLnNwbGljZSh0LDEpOzA9PT1lLmxlbmd0aCYmZGVsZXRlIE5baV19aWYoaT1CLl9maXJzdCwoIWl8fGkuX3BhdXNlZCkmJkQuYXV0b1NsZWVwJiYhai5fZmlyc3QmJjE9PT1hLl9saXN0ZW5lcnMudGljay5sZW5ndGgpe2Zvcig7aSYmaS5fcGF1c2VkOylpPWkuX25leHQ7aXx8YS5zbGVlcCgpfX19LGEuYWRkRXZlbnRMaXN0ZW5lcihcInRpY2tcIixBLl91cGRhdGVSb290KTt2YXIgVj1mdW5jdGlvbih0LGUsaSl7dmFyIHMscixuPXQuX2dzVHdlZW5JRDtpZihOW258fCh0Ll9nc1R3ZWVuSUQ9bj1cInRcIitYKyspXXx8KE5bbl09e3RhcmdldDp0LHR3ZWVuczpbXX0pLGUmJihzPU5bbl0udHdlZW5zLHNbcj1zLmxlbmd0aF09ZSxpKSlmb3IoOy0tcj4tMTspc1tyXT09PWUmJnMuc3BsaWNlKHIsMSk7cmV0dXJuIE5bbl0udHdlZW5zfSxHPWZ1bmN0aW9uKHQsZSxpLHMpe3ZhciByPXQudmFycy5vbk92ZXJ3cml0ZTtyJiZyKHQsZSxpLHMpLHI9RC5vbk92ZXJ3cml0ZSxyJiZyKHQsZSxpLHMpfSxXPWZ1bmN0aW9uKHQsZSxpLHMscil7dmFyIG4sYSxvLGg7aWYoMT09PXN8fHM+PTQpe2ZvcihoPXIubGVuZ3RoLG49MDtoPm47bisrKWlmKChvPXJbbl0pIT09ZSlvLl9nY3x8KG8uX2VuYWJsZWQoITEsITEpJiYoYT0hMCksRyhvLGUpKTtlbHNlIGlmKDU9PT1zKWJyZWFrO3JldHVybiBhfXZhciBsLHU9ZS5fc3RhcnRUaW1lK18scD1bXSxjPTAsZj0wPT09ZS5fZHVyYXRpb247Zm9yKG49ci5sZW5ndGg7LS1uPi0xOykobz1yW25dKT09PWV8fG8uX2djfHxvLl9wYXVzZWR8fChvLl90aW1lbGluZSE9PWUuX3RpbWVsaW5lPyhsPWx8fFEoZSwwLGYpLDA9PT1RKG8sbCxmKSYmKHBbYysrXT1vKSk6dT49by5fc3RhcnRUaW1lJiZvLl9zdGFydFRpbWUrby50b3RhbER1cmF0aW9uKCkvby5fdGltZVNjYWxlPnUmJigoZnx8IW8uX2luaXR0ZWQpJiYyZS0xMD49dS1vLl9zdGFydFRpbWV8fChwW2MrK109bykpKTtmb3Iobj1jOy0tbj4tMTspbz1wW25dLDI9PT1zJiZvLl9raWxsKGksdCxlKSYmKGE9ITApLCgyIT09c3x8IW8uX2ZpcnN0UFQmJm8uX2luaXR0ZWQpJiYoby5fZW5hYmxlZCghMSwhMSkmJihhPSEwKSwyIT09cyYmRyhvLGUpKTtyZXR1cm4gYX0sUT1mdW5jdGlvbih0LGUsaSl7Zm9yKHZhciBzPXQuX3RpbWVsaW5lLHI9cy5fdGltZVNjYWxlLG49dC5fc3RhcnRUaW1lO3MuX3RpbWVsaW5lOyl7aWYobis9cy5fc3RhcnRUaW1lLHIqPXMuX3RpbWVTY2FsZSxzLl9wYXVzZWQpcmV0dXJuLTEwMDtzPXMuX3RpbWVsaW5lfXJldHVybiBuLz1yLG4+ZT9uLWU6aSYmbj09PWV8fCF0Ll9pbml0dGVkJiYyKl8+bi1lP186KG4rPXQudG90YWxEdXJhdGlvbigpL3QuX3RpbWVTY2FsZS9yKT5lK18/MDpuLWUtX307bi5faW5pdD1mdW5jdGlvbigpe3ZhciB0LGUsaSxzLHIsbj10aGlzLnZhcnMsYT10aGlzLl9vdmVyd3JpdHRlblByb3BzLG89dGhpcy5fZHVyYXRpb24saD0hIW4uaW1tZWRpYXRlUmVuZGVyLGw9bi5lYXNlO2lmKG4uc3RhcnRBdCl7dGhpcy5fc3RhcnRBdCYmKHRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCEwKSx0aGlzLl9zdGFydEF0LmtpbGwoKSkscj17fTtmb3IocyBpbiBuLnN0YXJ0QXQpcltzXT1uLnN0YXJ0QXRbc107aWYoci5vdmVyd3JpdGU9ITEsci5pbW1lZGlhdGVSZW5kZXI9ITAsci5sYXp5PWgmJm4ubGF6eSE9PSExLHIuc3RhcnRBdD1yLmRlbGF5PW51bGwsdGhpcy5fc3RhcnRBdD1ELnRvKHRoaXMudGFyZ2V0LDAsciksaClpZih0aGlzLl90aW1lPjApdGhpcy5fc3RhcnRBdD1udWxsO2Vsc2UgaWYoMCE9PW8pcmV0dXJufWVsc2UgaWYobi5ydW5CYWNrd2FyZHMmJjAhPT1vKWlmKHRoaXMuX3N0YXJ0QXQpdGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsITApLHRoaXMuX3N0YXJ0QXQua2lsbCgpLHRoaXMuX3N0YXJ0QXQ9bnVsbDtlbHNlezAhPT10aGlzLl90aW1lJiYoaD0hMSksaT17fTtmb3IocyBpbiBuKVVbc10mJlwiYXV0b0NTU1wiIT09c3x8KGlbc109bltzXSk7aWYoaS5vdmVyd3JpdGU9MCxpLmRhdGE9XCJpc0Zyb21TdGFydFwiLGkubGF6eT1oJiZuLmxhenkhPT0hMSxpLmltbWVkaWF0ZVJlbmRlcj1oLHRoaXMuX3N0YXJ0QXQ9RC50byh0aGlzLnRhcmdldCwwLGkpLGgpe2lmKDA9PT10aGlzLl90aW1lKXJldHVybn1lbHNlIHRoaXMuX3N0YXJ0QXQuX2luaXQoKSx0aGlzLl9zdGFydEF0Ll9lbmFibGVkKCExKSx0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyJiYodGhpcy5fc3RhcnRBdD1udWxsKX1pZih0aGlzLl9lYXNlPWw9bD9sIGluc3RhbmNlb2YgVD9sOlwiZnVuY3Rpb25cIj09dHlwZW9mIGw/bmV3IFQobCxuLmVhc2VQYXJhbXMpOndbbF18fEQuZGVmYXVsdEVhc2U6RC5kZWZhdWx0RWFzZSxuLmVhc2VQYXJhbXMgaW5zdGFuY2VvZiBBcnJheSYmbC5jb25maWcmJih0aGlzLl9lYXNlPWwuY29uZmlnLmFwcGx5KGwsbi5lYXNlUGFyYW1zKSksdGhpcy5fZWFzZVR5cGU9dGhpcy5fZWFzZS5fdHlwZSx0aGlzLl9lYXNlUG93ZXI9dGhpcy5fZWFzZS5fcG93ZXIsdGhpcy5fZmlyc3RQVD1udWxsLHRoaXMuX3RhcmdldHMpZm9yKHQ9dGhpcy5fdGFyZ2V0cy5sZW5ndGg7LS10Pi0xOyl0aGlzLl9pbml0UHJvcHModGhpcy5fdGFyZ2V0c1t0XSx0aGlzLl9wcm9wTG9va3VwW3RdPXt9LHRoaXMuX3NpYmxpbmdzW3RdLGE/YVt0XTpudWxsKSYmKGU9ITApO2Vsc2UgZT10aGlzLl9pbml0UHJvcHModGhpcy50YXJnZXQsdGhpcy5fcHJvcExvb2t1cCx0aGlzLl9zaWJsaW5ncyxhKTtpZihlJiZELl9vblBsdWdpbkV2ZW50KFwiX29uSW5pdEFsbFByb3BzXCIsdGhpcyksYSYmKHRoaXMuX2ZpcnN0UFR8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHRoaXMudGFyZ2V0JiZ0aGlzLl9lbmFibGVkKCExLCExKSksbi5ydW5CYWNrd2FyZHMpZm9yKGk9dGhpcy5fZmlyc3RQVDtpOylpLnMrPWkuYyxpLmM9LWkuYyxpPWkuX25leHQ7dGhpcy5fb25VcGRhdGU9bi5vblVwZGF0ZSx0aGlzLl9pbml0dGVkPSEwfSxuLl9pbml0UHJvcHM9ZnVuY3Rpb24oZSxpLHMscil7dmFyIG4sYSxvLGgsbCxfO2lmKG51bGw9PWUpcmV0dXJuITE7RVtlLl9nc1R3ZWVuSURdJiZxKCksdGhpcy52YXJzLmNzc3x8ZS5zdHlsZSYmZSE9PXQmJmUubm9kZVR5cGUmJkwuY3NzJiZ0aGlzLnZhcnMuYXV0b0NTUyE9PSExJiZ6KHRoaXMudmFycyxlKTtmb3IobiBpbiB0aGlzLnZhcnMpe2lmKF89dGhpcy52YXJzW25dLFVbbl0pXyYmKF8gaW5zdGFuY2VvZiBBcnJheXx8Xy5wdXNoJiZjKF8pKSYmLTEhPT1fLmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSYmKHRoaXMudmFyc1tuXT1fPXRoaXMuX3N3YXBTZWxmSW5QYXJhbXMoXyx0aGlzKSk7ZWxzZSBpZihMW25dJiYoaD1uZXcgTFtuXSkuX29uSW5pdFR3ZWVuKGUsdGhpcy52YXJzW25dLHRoaXMpKXtmb3IodGhpcy5fZmlyc3RQVD1sPXtfbmV4dDp0aGlzLl9maXJzdFBULHQ6aCxwOlwic2V0UmF0aW9cIixzOjAsYzoxLGY6ITAsbjpuLHBnOiEwLHByOmguX3ByaW9yaXR5fSxhPWguX292ZXJ3cml0ZVByb3BzLmxlbmd0aDstLWE+LTE7KWlbaC5fb3ZlcndyaXRlUHJvcHNbYV1dPXRoaXMuX2ZpcnN0UFQ7KGguX3ByaW9yaXR5fHxoLl9vbkluaXRBbGxQcm9wcykmJihvPSEwKSwoaC5fb25EaXNhYmxlfHxoLl9vbkVuYWJsZSkmJih0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkPSEwKX1lbHNlIHRoaXMuX2ZpcnN0UFQ9aVtuXT1sPXtfbmV4dDp0aGlzLl9maXJzdFBULHQ6ZSxwOm4sZjpcImZ1bmN0aW9uXCI9PXR5cGVvZiBlW25dLG46bixwZzohMSxwcjowfSxsLnM9bC5mP2Vbbi5pbmRleE9mKFwic2V0XCIpfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlW1wiZ2V0XCIrbi5zdWJzdHIoMyldP246XCJnZXRcIituLnN1YnN0cigzKV0oKTpwYXJzZUZsb2F0KGVbbl0pLGwuYz1cInN0cmluZ1wiPT10eXBlb2YgXyYmXCI9XCI9PT1fLmNoYXJBdCgxKT9wYXJzZUludChfLmNoYXJBdCgwKStcIjFcIiwxMCkqTnVtYmVyKF8uc3Vic3RyKDIpKTpOdW1iZXIoXyktbC5zfHwwO2wmJmwuX25leHQmJihsLl9uZXh0Ll9wcmV2PWwpfXJldHVybiByJiZ0aGlzLl9raWxsKHIsZSk/dGhpcy5faW5pdFByb3BzKGUsaSxzLHIpOnRoaXMuX292ZXJ3cml0ZT4xJiZ0aGlzLl9maXJzdFBUJiZzLmxlbmd0aD4xJiZXKGUsdGhpcyxpLHRoaXMuX292ZXJ3cml0ZSxzKT8odGhpcy5fa2lsbChpLGUpLHRoaXMuX2luaXRQcm9wcyhlLGkscyxyKSk6KHRoaXMuX2ZpcnN0UFQmJih0aGlzLnZhcnMubGF6eSE9PSExJiZ0aGlzLl9kdXJhdGlvbnx8dGhpcy52YXJzLmxhenkmJiF0aGlzLl9kdXJhdGlvbikmJihFW2UuX2dzVHdlZW5JRF09ITApLG8pfSxuLnJlbmRlcj1mdW5jdGlvbih0LGUsaSl7dmFyIHMscixuLGEsbz10aGlzLl90aW1lLGg9dGhpcy5fZHVyYXRpb24sbD10aGlzLl9yYXdQcmV2VGltZTtpZih0Pj1oKXRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPWgsdGhpcy5yYXRpbz10aGlzLl9lYXNlLl9jYWxjRW5kP3RoaXMuX2Vhc2UuZ2V0UmF0aW8oMSk6MSx0aGlzLl9yZXZlcnNlZHx8KHM9ITAscj1cIm9uQ29tcGxldGVcIiksMD09PWgmJih0aGlzLl9pbml0dGVkfHwhdGhpcy52YXJzLmxhenl8fGkpJiYodGhpcy5fc3RhcnRUaW1lPT09dGhpcy5fdGltZWxpbmUuX2R1cmF0aW9uJiYodD0wKSwoMD09PXR8fDA+bHx8bD09PV8pJiZsIT09dCYmKGk9ITAsbD5fJiYocj1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIpKSx0aGlzLl9yYXdQcmV2VGltZT1hPSFlfHx0fHxsPT09dD90Ol8pO2Vsc2UgaWYoMWUtNz50KXRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPTAsdGhpcy5yYXRpbz10aGlzLl9lYXNlLl9jYWxjRW5kP3RoaXMuX2Vhc2UuZ2V0UmF0aW8oMCk6MCwoMCE9PW98fDA9PT1oJiZsPjAmJmwhPT1fKSYmKHI9XCJvblJldmVyc2VDb21wbGV0ZVwiLHM9dGhpcy5fcmV2ZXJzZWQpLDA+dCYmKHRoaXMuX2FjdGl2ZT0hMSwwPT09aCYmKHRoaXMuX2luaXR0ZWR8fCF0aGlzLnZhcnMubGF6eXx8aSkmJihsPj0wJiYoaT0hMCksdGhpcy5fcmF3UHJldlRpbWU9YT0hZXx8dHx8bD09PXQ/dDpfKSksdGhpcy5faW5pdHRlZHx8KGk9ITApO2Vsc2UgaWYodGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9dCx0aGlzLl9lYXNlVHlwZSl7dmFyIHU9dC9oLHA9dGhpcy5fZWFzZVR5cGUsYz10aGlzLl9lYXNlUG93ZXI7KDE9PT1wfHwzPT09cCYmdT49LjUpJiYodT0xLXUpLDM9PT1wJiYodSo9MiksMT09PWM/dSo9dToyPT09Yz91Kj11KnU6Mz09PWM/dSo9dSp1KnU6ND09PWMmJih1Kj11KnUqdSp1KSx0aGlzLnJhdGlvPTE9PT1wPzEtdToyPT09cD91Oi41PnQvaD91LzI6MS11LzJ9ZWxzZSB0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8odC9oKTtpZih0aGlzLl90aW1lIT09b3x8aSl7aWYoIXRoaXMuX2luaXR0ZWQpe2lmKHRoaXMuX2luaXQoKSwhdGhpcy5faW5pdHRlZHx8dGhpcy5fZ2MpcmV0dXJuO2lmKCFpJiZ0aGlzLl9maXJzdFBUJiYodGhpcy52YXJzLmxhenkhPT0hMSYmdGhpcy5fZHVyYXRpb258fHRoaXMudmFycy5sYXp5JiYhdGhpcy5fZHVyYXRpb24pKXJldHVybiB0aGlzLl90aW1lPXRoaXMuX3RvdGFsVGltZT1vLHRoaXMuX3Jhd1ByZXZUaW1lPWwsSS5wdXNoKHRoaXMpLHRoaXMuX2xhenk9W3QsZV0sdm9pZCAwO3RoaXMuX3RpbWUmJiFzP3RoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lL2gpOnMmJnRoaXMuX2Vhc2UuX2NhbGNFbmQmJih0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8oMD09PXRoaXMuX3RpbWU/MDoxKSl9Zm9yKHRoaXMuX2xhenkhPT0hMSYmKHRoaXMuX2xhenk9ITEpLHRoaXMuX2FjdGl2ZXx8IXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZSE9PW8mJnQ+PTAmJih0aGlzLl9hY3RpdmU9ITApLDA9PT1vJiYodGhpcy5fc3RhcnRBdCYmKHQ+PTA/dGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpOnJ8fChyPVwiX2R1bW15R1NcIikpLHRoaXMudmFycy5vblN0YXJ0JiYoMCE9PXRoaXMuX3RpbWV8fDA9PT1oKSYmKGV8fHRoaXMudmFycy5vblN0YXJ0LmFwcGx5KHRoaXMudmFycy5vblN0YXJ0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uU3RhcnRQYXJhbXN8fHkpKSksbj10aGlzLl9maXJzdFBUO247KW4uZj9uLnRbbi5wXShuLmMqdGhpcy5yYXRpbytuLnMpOm4udFtuLnBdPW4uYyp0aGlzLnJhdGlvK24ucyxuPW4uX25leHQ7dGhpcy5fb25VcGRhdGUmJigwPnQmJnRoaXMuX3N0YXJ0QXQmJnQhPT0tMWUtNCYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLGV8fCh0aGlzLl90aW1lIT09b3x8cykmJnRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8eSkpLHImJighdGhpcy5fZ2N8fGkpJiYoMD50JiZ0aGlzLl9zdGFydEF0JiYhdGhpcy5fb25VcGRhdGUmJnQhPT0tMWUtNCYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLHMmJih0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4mJnRoaXMuX2VuYWJsZWQoITEsITEpLHRoaXMuX2FjdGl2ZT0hMSksIWUmJnRoaXMudmFyc1tyXSYmdGhpcy52YXJzW3JdLmFwcGx5KHRoaXMudmFyc1tyK1wiU2NvcGVcIl18fHRoaXMsdGhpcy52YXJzW3IrXCJQYXJhbXNcIl18fHkpLDA9PT1oJiZ0aGlzLl9yYXdQcmV2VGltZT09PV8mJmEhPT1fJiYodGhpcy5fcmF3UHJldlRpbWU9MCkpfX0sbi5fa2lsbD1mdW5jdGlvbih0LGUsaSl7aWYoXCJhbGxcIj09PXQmJih0PW51bGwpLG51bGw9PXQmJihudWxsPT1lfHxlPT09dGhpcy50YXJnZXQpKXJldHVybiB0aGlzLl9sYXp5PSExLHRoaXMuX2VuYWJsZWQoITEsITEpO2U9XCJzdHJpbmdcIiE9dHlwZW9mIGU/ZXx8dGhpcy5fdGFyZ2V0c3x8dGhpcy50YXJnZXQ6RC5zZWxlY3RvcihlKXx8ZTt2YXIgcyxyLG4sYSxvLGgsbCxfLHU7aWYoKGMoZSl8fE0oZSkpJiZcIm51bWJlclwiIT10eXBlb2YgZVswXSlmb3Iocz1lLmxlbmd0aDstLXM+LTE7KXRoaXMuX2tpbGwodCxlW3NdKSYmKGg9ITApO2Vsc2V7aWYodGhpcy5fdGFyZ2V0cyl7Zm9yKHM9dGhpcy5fdGFyZ2V0cy5sZW5ndGg7LS1zPi0xOylpZihlPT09dGhpcy5fdGFyZ2V0c1tzXSl7bz10aGlzLl9wcm9wTG9va3VwW3NdfHx7fSx0aGlzLl9vdmVyd3JpdHRlblByb3BzPXRoaXMuX292ZXJ3cml0dGVuUHJvcHN8fFtdLHI9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tzXT10P3RoaXMuX292ZXJ3cml0dGVuUHJvcHNbc118fHt9OlwiYWxsXCI7YnJlYWt9fWVsc2V7aWYoZSE9PXRoaXMudGFyZ2V0KXJldHVybiExO289dGhpcy5fcHJvcExvb2t1cCxyPXRoaXMuX292ZXJ3cml0dGVuUHJvcHM9dD90aGlzLl9vdmVyd3JpdHRlblByb3BzfHx7fTpcImFsbFwifWlmKG8pe2w9dHx8byxfPXQhPT1yJiZcImFsbFwiIT09ciYmdCE9PW8mJihcIm9iamVjdFwiIT10eXBlb2YgdHx8IXQuX3RlbXBLaWxsKTtmb3IobiBpbiBsKShhPW9bbl0pJiYodXx8KHU9W10pLHUucHVzaChuKSxhLnBnJiZhLnQuX2tpbGwobCkmJihoPSEwKSxhLnBnJiYwIT09YS50Ll9vdmVyd3JpdGVQcm9wcy5sZW5ndGh8fChhLl9wcmV2P2EuX3ByZXYuX25leHQ9YS5fbmV4dDphPT09dGhpcy5fZmlyc3RQVCYmKHRoaXMuX2ZpcnN0UFQ9YS5fbmV4dCksYS5fbmV4dCYmKGEuX25leHQuX3ByZXY9YS5fcHJldiksYS5fbmV4dD1hLl9wcmV2PW51bGwpLGRlbGV0ZSBvW25dKSxfJiYocltuXT0xKTtcbiF0aGlzLl9maXJzdFBUJiZ0aGlzLl9pbml0dGVkJiZ0aGlzLl9lbmFibGVkKCExLCExKSx1JiZpJiZHKHRoaXMsaSxlLHUpfX1yZXR1cm4gaH0sbi5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQmJkQuX29uUGx1Z2luRXZlbnQoXCJfb25EaXNhYmxlXCIsdGhpcyksdGhpcy5fZmlyc3RQVD10aGlzLl9vdmVyd3JpdHRlblByb3BzPXRoaXMuX3N0YXJ0QXQ9dGhpcy5fb25VcGRhdGU9bnVsbCx0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkPXRoaXMuX2FjdGl2ZT10aGlzLl9sYXp5PSExLHRoaXMuX3Byb3BMb29rdXA9dGhpcy5fdGFyZ2V0cz97fTpbXSxBLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyksdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciYmKHRoaXMuX3RpbWU9LV8sdGhpcy5yZW5kZXIoLXRoaXMuX2RlbGF5KSksdGhpc30sbi5fZW5hYmxlZD1mdW5jdGlvbih0LGUpe2lmKG98fGEud2FrZSgpLHQmJnRoaXMuX2djKXt2YXIgaSxzPXRoaXMuX3RhcmdldHM7aWYocylmb3IoaT1zLmxlbmd0aDstLWk+LTE7KXRoaXMuX3NpYmxpbmdzW2ldPVYoc1tpXSx0aGlzLCEwKTtlbHNlIHRoaXMuX3NpYmxpbmdzPVYodGhpcy50YXJnZXQsdGhpcywhMCl9cmV0dXJuIEEucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcyx0LGUpLHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQmJnRoaXMuX2ZpcnN0UFQ/RC5fb25QbHVnaW5FdmVudCh0P1wiX29uRW5hYmxlXCI6XCJfb25EaXNhYmxlXCIsdGhpcyk6ITF9LEQudG89ZnVuY3Rpb24odCxlLGkpe3JldHVybiBuZXcgRCh0LGUsaSl9LEQuZnJvbT1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIGkucnVuQmFja3dhcmRzPSEwLGkuaW1tZWRpYXRlUmVuZGVyPTAhPWkuaW1tZWRpYXRlUmVuZGVyLG5ldyBEKHQsZSxpKX0sRC5mcm9tVG89ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHMuc3RhcnRBdD1pLHMuaW1tZWRpYXRlUmVuZGVyPTAhPXMuaW1tZWRpYXRlUmVuZGVyJiYwIT1pLmltbWVkaWF0ZVJlbmRlcixuZXcgRCh0LGUscyl9LEQuZGVsYXllZENhbGw9ZnVuY3Rpb24odCxlLGkscyxyKXtyZXR1cm4gbmV3IEQoZSwwLHtkZWxheTp0LG9uQ29tcGxldGU6ZSxvbkNvbXBsZXRlUGFyYW1zOmksb25Db21wbGV0ZVNjb3BlOnMsb25SZXZlcnNlQ29tcGxldGU6ZSxvblJldmVyc2VDb21wbGV0ZVBhcmFtczppLG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6cyxpbW1lZGlhdGVSZW5kZXI6ITEsdXNlRnJhbWVzOnIsb3ZlcndyaXRlOjB9KX0sRC5zZXQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3IEQodCwwLGUpfSxELmdldFR3ZWVuc09mPWZ1bmN0aW9uKHQsZSl7aWYobnVsbD09dClyZXR1cm5bXTt0PVwic3RyaW5nXCIhPXR5cGVvZiB0P3Q6RC5zZWxlY3Rvcih0KXx8dDt2YXIgaSxzLHIsbjtpZigoYyh0KXx8TSh0KSkmJlwibnVtYmVyXCIhPXR5cGVvZiB0WzBdKXtmb3IoaT10Lmxlbmd0aCxzPVtdOy0taT4tMTspcz1zLmNvbmNhdChELmdldFR3ZWVuc09mKHRbaV0sZSkpO2ZvcihpPXMubGVuZ3RoOy0taT4tMTspZm9yKG49c1tpXSxyPWk7LS1yPi0xOyluPT09c1tyXSYmcy5zcGxpY2UoaSwxKX1lbHNlIGZvcihzPVYodCkuY29uY2F0KCksaT1zLmxlbmd0aDstLWk+LTE7KShzW2ldLl9nY3x8ZSYmIXNbaV0uaXNBY3RpdmUoKSkmJnMuc3BsaWNlKGksMSk7cmV0dXJuIHN9LEQua2lsbFR3ZWVuc09mPUQua2lsbERlbGF5ZWRDYWxsc1RvPWZ1bmN0aW9uKHQsZSxpKXtcIm9iamVjdFwiPT10eXBlb2YgZSYmKGk9ZSxlPSExKTtmb3IodmFyIHM9RC5nZXRUd2VlbnNPZih0LGUpLHI9cy5sZW5ndGg7LS1yPi0xOylzW3JdLl9raWxsKGksdCl9O3ZhciBaPWcoXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsZnVuY3Rpb24odCxlKXt0aGlzLl9vdmVyd3JpdGVQcm9wcz0odHx8XCJcIikuc3BsaXQoXCIsXCIpLHRoaXMuX3Byb3BOYW1lPXRoaXMuX292ZXJ3cml0ZVByb3BzWzBdLHRoaXMuX3ByaW9yaXR5PWV8fDAsdGhpcy5fc3VwZXI9Wi5wcm90b3R5cGV9LCEwKTtpZihuPVoucHJvdG90eXBlLFoudmVyc2lvbj1cIjEuMTAuMVwiLFouQVBJPTIsbi5fZmlyc3RQVD1udWxsLG4uX2FkZFR3ZWVuPWZ1bmN0aW9uKHQsZSxpLHMscixuKXt2YXIgYSxvO3JldHVybiBudWxsIT1zJiYoYT1cIm51bWJlclwiPT10eXBlb2Ygc3x8XCI9XCIhPT1zLmNoYXJBdCgxKT9OdW1iZXIocyktaTpwYXJzZUludChzLmNoYXJBdCgwKStcIjFcIiwxMCkqTnVtYmVyKHMuc3Vic3RyKDIpKSk/KHRoaXMuX2ZpcnN0UFQ9bz17X25leHQ6dGhpcy5fZmlyc3RQVCx0OnQscDplLHM6aSxjOmEsZjpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0W2VdLG46cnx8ZSxyOm59LG8uX25leHQmJihvLl9uZXh0Ll9wcmV2PW8pLG8pOnZvaWQgMH0sbi5zZXRSYXRpbz1mdW5jdGlvbih0KXtmb3IodmFyIGUsaT10aGlzLl9maXJzdFBULHM9MWUtNjtpOyllPWkuYyp0K2kucyxpLnI/ZT1NYXRoLnJvdW5kKGUpOnM+ZSYmZT4tcyYmKGU9MCksaS5mP2kudFtpLnBdKGUpOmkudFtpLnBdPWUsaT1pLl9uZXh0fSxuLl9raWxsPWZ1bmN0aW9uKHQpe3ZhciBlLGk9dGhpcy5fb3ZlcndyaXRlUHJvcHMscz10aGlzLl9maXJzdFBUO2lmKG51bGwhPXRbdGhpcy5fcHJvcE5hbWVdKXRoaXMuX292ZXJ3cml0ZVByb3BzPVtdO2Vsc2UgZm9yKGU9aS5sZW5ndGg7LS1lPi0xOyludWxsIT10W2lbZV1dJiZpLnNwbGljZShlLDEpO2Zvcig7czspbnVsbCE9dFtzLm5dJiYocy5fbmV4dCYmKHMuX25leHQuX3ByZXY9cy5fcHJldikscy5fcHJldj8ocy5fcHJldi5fbmV4dD1zLl9uZXh0LHMuX3ByZXY9bnVsbCk6dGhpcy5fZmlyc3RQVD09PXMmJih0aGlzLl9maXJzdFBUPXMuX25leHQpKSxzPXMuX25leHQ7cmV0dXJuITF9LG4uX3JvdW5kUHJvcHM9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGk9dGhpcy5fZmlyc3RQVDtpOykodFt0aGlzLl9wcm9wTmFtZV18fG51bGwhPWkubiYmdFtpLm4uc3BsaXQodGhpcy5fcHJvcE5hbWUrXCJfXCIpLmpvaW4oXCJcIildKSYmKGkucj1lKSxpPWkuX25leHR9LEQuX29uUGx1Z2luRXZlbnQ9ZnVuY3Rpb24odCxlKXt2YXIgaSxzLHIsbixhLG89ZS5fZmlyc3RQVDtpZihcIl9vbkluaXRBbGxQcm9wc1wiPT09dCl7Zm9yKDtvOyl7Zm9yKGE9by5fbmV4dCxzPXI7cyYmcy5wcj5vLnByOylzPXMuX25leHQ7KG8uX3ByZXY9cz9zLl9wcmV2Om4pP28uX3ByZXYuX25leHQ9bzpyPW8sKG8uX25leHQ9cyk/cy5fcHJldj1vOm49byxvPWF9bz1lLl9maXJzdFBUPXJ9Zm9yKDtvOylvLnBnJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBvLnRbdF0mJm8udFt0XSgpJiYoaT0hMCksbz1vLl9uZXh0O3JldHVybiBpfSxaLmFjdGl2YXRlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10Lmxlbmd0aDstLWU+LTE7KXRbZV0uQVBJPT09Wi5BUEkmJihMWyhuZXcgdFtlXSkuX3Byb3BOYW1lXT10W2VdKTtyZXR1cm4hMH0sZC5wbHVnaW49ZnVuY3Rpb24odCl7aWYoISh0JiZ0LnByb3BOYW1lJiZ0LmluaXQmJnQuQVBJKSl0aHJvd1wiaWxsZWdhbCBwbHVnaW4gZGVmaW5pdGlvbi5cIjt2YXIgZSxpPXQucHJvcE5hbWUscz10LnByaW9yaXR5fHwwLHI9dC5vdmVyd3JpdGVQcm9wcyxuPXtpbml0OlwiX29uSW5pdFR3ZWVuXCIsc2V0Olwic2V0UmF0aW9cIixraWxsOlwiX2tpbGxcIixyb3VuZDpcIl9yb3VuZFByb3BzXCIsaW5pdEFsbDpcIl9vbkluaXRBbGxQcm9wc1wifSxhPWcoXCJwbHVnaW5zLlwiK2kuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkraS5zdWJzdHIoMSkrXCJQbHVnaW5cIixmdW5jdGlvbigpe1ouY2FsbCh0aGlzLGkscyksdGhpcy5fb3ZlcndyaXRlUHJvcHM9cnx8W119LHQuZ2xvYmFsPT09ITApLG89YS5wcm90b3R5cGU9bmV3IFooaSk7by5jb25zdHJ1Y3Rvcj1hLGEuQVBJPXQuQVBJO2ZvcihlIGluIG4pXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlXSYmKG9bbltlXV09dFtlXSk7cmV0dXJuIGEudmVyc2lvbj10LnZlcnNpb24sWi5hY3RpdmF0ZShbYV0pLGF9LHM9dC5fZ3NRdWV1ZSl7Zm9yKHI9MDtzLmxlbmd0aD5yO3IrKylzW3JdKCk7Zm9yKG4gaW4gZilmW25dLmZ1bmN8fHQuY29uc29sZS5sb2coXCJHU0FQIGVuY291bnRlcmVkIG1pc3NpbmcgZGVwZW5kZW5jeTogY29tLmdyZWVuc29jay5cIituKX1vPSExfX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXN8fHdpbmRvdyxcIlR3ZWVuTWF4XCIpO1xuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2YgVHdlZW5NYXggIT0gXCJ1bmRlZmluZWRcIiA/IFR3ZWVuTWF4IDogd2luZG93LlR3ZWVuTWF4KTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiFcbiAqIFZFUlNJT046IDEuNy40XG4gKiBEQVRFOiAyMDE0LTA3LTE3XG4gKiBVUERBVEVTIEFORCBET0NTIEFUOiBodHRwOi8vd3d3LmdyZWVuc29jay5jb21cbiAqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNCwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyB3b3JrIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIGF0IGh0dHA6Ly93d3cuZ3JlZW5zb2NrLmNvbS90ZXJtc19vZl91c2UuaHRtbCBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqKi9cbnZhciBfZ3NTY29wZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpc3x8d2luZG93OyhfZ3NTY29wZS5fZ3NRdWV1ZXx8KF9nc1Njb3BlLl9nc1F1ZXVlPVtdKSkucHVzaChmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3ZhciB0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxlPXdpbmRvdyxpPWZ1bmN0aW9uKGkscil7dmFyIHM9XCJ4XCI9PT1yP1wiV2lkdGhcIjpcIkhlaWdodFwiLG49XCJzY3JvbGxcIitzLG89XCJjbGllbnRcIitzLGE9ZG9jdW1lbnQuYm9keTtyZXR1cm4gaT09PWV8fGk9PT10fHxpPT09YT9NYXRoLm1heCh0W25dLGFbbl0pLShlW1wiaW5uZXJcIitzXXx8TWF0aC5tYXgodFtvXSxhW29dKSk6aVtuXS1pW1wib2Zmc2V0XCIrc119LHI9X2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7cHJvcE5hbWU6XCJzY3JvbGxUb1wiLEFQSToyLHZlcnNpb246XCIxLjcuNFwiLGluaXQ6ZnVuY3Rpb24odCxyLHMpe3JldHVybiB0aGlzLl93ZHc9dD09PWUsdGhpcy5fdGFyZ2V0PXQsdGhpcy5fdHdlZW49cyxcIm9iamVjdFwiIT10eXBlb2YgciYmKHI9e3k6cn0pLHRoaXMudmFycz1yLHRoaXMuX2F1dG9LaWxsPXIuYXV0b0tpbGwhPT0hMSx0aGlzLng9dGhpcy54UHJldj10aGlzLmdldFgoKSx0aGlzLnk9dGhpcy55UHJldj10aGlzLmdldFkoKSxudWxsIT1yLng/KHRoaXMuX2FkZFR3ZWVuKHRoaXMsXCJ4XCIsdGhpcy54LFwibWF4XCI9PT1yLng/aSh0LFwieFwiKTpyLngsXCJzY3JvbGxUb194XCIsITApLHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goXCJzY3JvbGxUb194XCIpKTp0aGlzLnNraXBYPSEwLG51bGwhPXIueT8odGhpcy5fYWRkVHdlZW4odGhpcyxcInlcIix0aGlzLnksXCJtYXhcIj09PXIueT9pKHQsXCJ5XCIpOnIueSxcInNjcm9sbFRvX3lcIiwhMCksdGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChcInNjcm9sbFRvX3lcIikpOnRoaXMuc2tpcFk9ITAsITB9LHNldDpmdW5jdGlvbih0KXt0aGlzLl9zdXBlci5zZXRSYXRpby5jYWxsKHRoaXMsdCk7dmFyIHI9dGhpcy5fd2R3fHwhdGhpcy5za2lwWD90aGlzLmdldFgoKTp0aGlzLnhQcmV2LHM9dGhpcy5fd2R3fHwhdGhpcy5za2lwWT90aGlzLmdldFkoKTp0aGlzLnlQcmV2LG49cy10aGlzLnlQcmV2LG89ci10aGlzLnhQcmV2O3RoaXMuX2F1dG9LaWxsJiYoIXRoaXMuc2tpcFgmJihvPjd8fC03Pm8pJiZpKHRoaXMuX3RhcmdldCxcInhcIik+ciYmKHRoaXMuc2tpcFg9ITApLCF0aGlzLnNraXBZJiYobj43fHwtNz5uKSYmaSh0aGlzLl90YXJnZXQsXCJ5XCIpPnMmJih0aGlzLnNraXBZPSEwKSx0aGlzLnNraXBYJiZ0aGlzLnNraXBZJiYodGhpcy5fdHdlZW4ua2lsbCgpLHRoaXMudmFycy5vbkF1dG9LaWxsJiZ0aGlzLnZhcnMub25BdXRvS2lsbC5hcHBseSh0aGlzLnZhcnMub25BdXRvS2lsbFNjb3BlfHx0aGlzLl90d2Vlbix0aGlzLnZhcnMub25BdXRvS2lsbFBhcmFtc3x8W10pKSksdGhpcy5fd2R3P2Uuc2Nyb2xsVG8odGhpcy5za2lwWD9yOnRoaXMueCx0aGlzLnNraXBZP3M6dGhpcy55KToodGhpcy5za2lwWXx8KHRoaXMuX3RhcmdldC5zY3JvbGxUb3A9dGhpcy55KSx0aGlzLnNraXBYfHwodGhpcy5fdGFyZ2V0LnNjcm9sbExlZnQ9dGhpcy54KSksdGhpcy54UHJldj10aGlzLngsdGhpcy55UHJldj10aGlzLnl9fSkscz1yLnByb3RvdHlwZTtyLm1heD1pLHMuZ2V0WD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl93ZHc/bnVsbCE9ZS5wYWdlWE9mZnNldD9lLnBhZ2VYT2Zmc2V0Om51bGwhPXQuc2Nyb2xsTGVmdD90LnNjcm9sbExlZnQ6ZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0OnRoaXMuX3RhcmdldC5zY3JvbGxMZWZ0fSxzLmdldFk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd2R3P251bGwhPWUucGFnZVlPZmZzZXQ/ZS5wYWdlWU9mZnNldDpudWxsIT10LnNjcm9sbFRvcD90LnNjcm9sbFRvcDpkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDp0aGlzLl90YXJnZXQuc2Nyb2xsVG9wfSxzLl9raWxsPWZ1bmN0aW9uKHQpe3JldHVybiB0LnNjcm9sbFRvX3gmJih0aGlzLnNraXBYPSEwKSx0LnNjcm9sbFRvX3kmJih0aGlzLnNraXBZPSEwKSx0aGlzLl9zdXBlci5fa2lsbC5jYWxsKHRoaXMsdCl9fSksX2dzU2NvcGUuX2dzRGVmaW5lJiZfZ3NTY29wZS5fZ3NRdWV1ZS5wb3AoKSgpO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiXG47KGZ1bmN0aW9uKCl7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaC5cbiAgICovXG5cbiAgdmFyIGRpc3BhdGNoID0gdHJ1ZTtcblxuICAvKipcbiAgICogQmFzZSBwYXRoLlxuICAgKi9cblxuICB2YXIgYmFzZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBSdW5uaW5nIGZsYWcuXG4gICAqL1xuXG4gIHZhciBydW5uaW5nO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBgcGF0aGAgd2l0aCBjYWxsYmFjayBgZm4oKWAsXG4gICAqIG9yIHJvdXRlIGBwYXRoYCwgb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCk7XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBwYXRoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuLi4uXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhZ2UocGF0aCwgZm4pIHtcbiAgICAvLyA8Y2FsbGJhY2s+XG4gICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHJldHVybiBwYWdlKCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgLy8gcm91dGUgPHBhdGg+IHRvIDxjYWxsYmFjayAuLi4+XG4gICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBwYWdlLmNhbGxiYWNrcy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgICB9XG4gICAgLy8gc2hvdyA8cGF0aD4gd2l0aCBbc3RhdGVdXG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcGFnZS5zaG93KHBhdGgsIGZuKTtcbiAgICAvLyBzdGFydCBbb3B0aW9uc11cbiAgICB9IGVsc2Uge1xuICAgICAgcGFnZS5zdGFydChwYXRoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgKi9cblxuICBwYWdlLmNhbGxiYWNrcyA9IFtdO1xuXG4gIC8qKlxuICAgKiBHZXQgb3Igc2V0IGJhc2VwYXRoIHRvIGBwYXRoYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYXNlID0gZnVuY3Rpb24ocGF0aCl7XG4gICAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHJ1bm5pbmcpIHJldHVybjtcbiAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGlzcGF0Y2gpIGRpc3BhdGNoID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgaWYgKCFkaXNwYXRjaCkgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2g7XG4gICAgcGFnZS5yZXBsYWNlKHVybCwgbnVsbCwgdHJ1ZSwgZGlzcGF0Y2gpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmJpbmQgY2xpY2sgYW5kIHBvcHN0YXRlIGV2ZW50IGhhbmRsZXJzLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0b3AgPSBmdW5jdGlvbigpe1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIG9ucG9wc3RhdGUsIGZhbHNlKTtcbiAgfTtcblxuICAvKipcbiAgICogU2hvdyBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzcGF0Y2hcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zaG93ID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGRpc3BhdGNoKXtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBpZiAoIWN0eC51bmhhbmRsZWQpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5yZXBsYWNlID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGluaXQsIGRpc3BhdGNoKXtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIGN0eC5pbml0ID0gaW5pdDtcbiAgICBpZiAobnVsbCA9PSBkaXNwYXRjaCkgZGlzcGF0Y2ggPSB0cnVlO1xuICAgIGlmIChkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2ggdGhlIGdpdmVuIGBjdHhgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBwYWdlLmRpc3BhdGNoID0gZnVuY3Rpb24oY3R4KXtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgdmFyIGZuID0gcGFnZS5jYWxsYmFja3NbaSsrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiB1bmhhbmRsZWQoY3R4KTtcbiAgICAgIGZuKGN0eCwgbmV4dCk7XG4gICAgfVxuXG4gICAgbmV4dCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBVbmhhbmRsZWQgYGN0eGAuIFdoZW4gaXQncyBub3QgdGhlIGluaXRpYWxcbiAgICogcG9wc3RhdGUgdGhlbiByZWRpcmVjdC4gSWYgeW91IHdpc2ggdG8gaGFuZGxlXG4gICAqIDQwNHMgb24geW91ciBvd24gdXNlIGBwYWdlKCcqJywgY2FsbGJhY2spYC5cbiAgICpcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHVuaGFuZGxlZChjdHgpIHtcbiAgICB2YXIgY3VycmVudCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gICAgaWYgKGN1cnJlbnQgPT0gY3R4LmNhbm9uaWNhbFBhdGgpIHJldHVybjtcbiAgICBwYWdlLnN0b3AoKTtcbiAgICBjdHgudW5oYW5kbGVkID0gdHJ1ZTtcbiAgICB3aW5kb3cubG9jYXRpb24gPSBjdHguY2Fub25pY2FsUGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmV3IFwicmVxdWVzdFwiIGBDb250ZXh0YFxuICAgKiB3aXRoIHRoZSBnaXZlbiBgcGF0aGAgYW5kIG9wdGlvbmFsIGluaXRpYWwgYHN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbnRleHQocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAoJy8nID09IHBhdGhbMF0gJiYgMCAhPSBwYXRoLmluZGV4T2YoYmFzZSkpIHBhdGggPSBiYXNlICsgcGF0aDtcbiAgICB2YXIgaSA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgdGhpcy5jYW5vbmljYWxQYXRoID0gcGF0aDtcbiAgICB0aGlzLnBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBwYXRoLnNsaWNlKGkgKyAxKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSB+aSA/IHBhdGguc2xpY2UoMCwgaSkgOiBwYXRoO1xuICAgIHRoaXMucGFyYW1zID0gW107XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICB2YXIgcGFydHMgPSB0aGlzLnBhdGguc3BsaXQoJyMnKTtcbiAgICB0aGlzLnBhdGggPSBwYXJ0c1swXTtcbiAgICB0aGlzLmhhc2ggPSBwYXJ0c1sxXSB8fCAnJztcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gdGhpcy5xdWVyeXN0cmluZy5zcGxpdCgnIycpWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpe1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpe1xuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYFJvdXRlYCB3aXRoIHRoZSBnaXZlbiBIVFRQIGBwYXRoYCxcbiAgICogYW5kIGFuIGFycmF5IG9mIGBjYWxsYmFja3NgIGFuZCBgb3B0aW9uc2AuXG4gICAqXG4gICAqIE9wdGlvbnM6XG4gICAqXG4gICAqICAgLSBgc2Vuc2l0aXZlYCAgICBlbmFibGUgY2FzZS1zZW5zaXRpdmUgcm91dGVzXG4gICAqICAgLSBgc3RyaWN0YCAgICAgICBlbmFibGUgc3RyaWN0IG1hdGNoaW5nIGZvciB0cmFpbGluZyBzbGFzaGVzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gUm91dGUocGF0aCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cChwYXRoXG4gICAgICAsIHRoaXMua2V5cyA9IFtdXG4gICAgICAsIG9wdGlvbnMuc2Vuc2l0aXZlXG4gICAgICAsIG9wdGlvbnMuc3RyaWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYFJvdXRlYC5cbiAgICovXG5cbiAgcGFnZS5Sb3V0ZSA9IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gcm91dGUgbWlkZGxld2FyZSB3aXRoXG4gICAqIHRoZSBnaXZlbiBjYWxsYmFjayBgZm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCwgbmV4dCl7XG4gICAgICBpZiAoc2VsZi5tYXRjaChjdHgucGF0aCwgY3R4LnBhcmFtcykpIHJldHVybiBmbihjdHgsIG5leHQpO1xuICAgICAgbmV4dCgpO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoaXMgcm91dGUgbWF0Y2hlcyBgcGF0aGAsIGlmIHNvXG4gICAqIHBvcHVsYXRlIGBwYXJhbXNgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIHBhcmFtcyl7XG4gICAgdmFyIGtleXMgPSB0aGlzLmtleXNcbiAgICAgICwgcXNJbmRleCA9IHBhdGguaW5kZXhPZignPycpXG4gICAgICAsIHBhdGhuYW1lID0gfnFzSW5kZXggPyBwYXRoLnNsaWNlKDAsIHFzSW5kZXgpIDogcGF0aFxuICAgICAgLCBtID0gdGhpcy5yZWdleHAuZXhlYyhwYXRobmFtZSk7XG5cbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG5cbiAgICAgIHZhciB2YWwgPSAnc3RyaW5nJyA9PSB0eXBlb2YgbVtpXVxuICAgICAgICA/IGRlY29kZVVSSUNvbXBvbmVudChtW2ldKVxuICAgICAgICA6IG1baV07XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHVuZGVmaW5lZCAhPT0gcGFyYW1zW2tleS5uYW1lXVxuICAgICAgICAgID8gcGFyYW1zW2tleS5uYW1lXVxuICAgICAgICAgIDogdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1zLnB1c2godmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogTm9ybWFsaXplIHRoZSBnaXZlbiBwYXRoIHN0cmluZyxcbiAgICogcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgKlxuICAgKiBBbiBlbXB0eSBhcnJheSBzaG91bGQgYmUgcGFzc2VkLFxuICAgKiB3aGljaCB3aWxsIGNvbnRhaW4gdGhlIHBsYWNlaG9sZGVyXG4gICAqIGtleSBuYW1lcy4gRm9yIGV4YW1wbGUgXCIvdXNlci86aWRcIiB3aWxsXG4gICAqIHRoZW4gY29udGFpbiBbXCJpZFwiXS5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfFJlZ0V4cHxBcnJheX0gcGF0aFxuICAgKiBAcGFyYW0gIHtBcnJheX0ga2V5c1xuICAgKiBAcGFyYW0gIHtCb29sZWFufSBzZW5zaXRpdmVcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gc3RyaWN0XG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhdGh0b1JlZ2V4cChwYXRoLCBrZXlzLCBzZW5zaXRpdmUsIHN0cmljdCkge1xuICAgIGlmIChwYXRoIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gcGF0aDtcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSBwYXRoID0gJygnICsgcGF0aC5qb2luKCd8JykgKyAnKSc7XG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5jb25jYXQoc3RyaWN0ID8gJycgOiAnLz8nKVxuICAgICAgLnJlcGxhY2UoL1xcL1xcKC9nLCAnKD86LycpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/KFxcLik/OihcXHcrKSg/OihcXCguKj9cXCkpKT8oXFw/KT8vZywgZnVuY3Rpb24oXywgc2xhc2gsIGZvcm1hdCwga2V5LCBjYXB0dXJlLCBvcHRpb25hbCl7XG4gICAgICAgIGtleXMucHVzaCh7IG5hbWU6IGtleSwgb3B0aW9uYWw6ICEhIG9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChmb3JtYXQgfHwgJycpICsgKGNhcHR1cmUgfHwgKGZvcm1hdCAmJiAnKFteLy5dKz8pJyB8fCAnKFteL10rPyknKSkgKyAnKSdcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJyk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyhbXFwvLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoL1xcKi9nLCAnKC4qKScpO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAnJCcsIHNlbnNpdGl2ZSA/ICcnIDogJ2knKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJwb3B1bGF0ZVwiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25wb3BzdGF0ZShlKSB7XG4gICAgaWYgKGUuc3RhdGUpIHtcbiAgICAgIHZhciBwYXRoID0gZS5zdGF0ZS5wYXRoO1xuICAgICAgcGFnZS5yZXBsYWNlKHBhdGgsIGUuc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJjbGlja1wiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25jbGljayhlKSB7XG4gICAgaWYgKDEgIT0gd2hpY2goZSkpIHJldHVybjtcbiAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSByZXR1cm47XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgLy8gZW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9IGVsLm5vZGVOYW1lKSBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgaWYgKCFlbCB8fCAnQScgIT0gZWwubm9kZU5hbWUpIHJldHVybjtcblxuICAgIC8vIGVuc3VyZSBub24taGFzaCBmb3IgdGhlIHNhbWUgcGF0aFxuICAgIHZhciBsaW5rID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKGVsLnBhdGhuYW1lID09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PSBsaW5rKSkgcmV0dXJuO1xuXG4gICAgLy8gY2hlY2sgdGFyZ2V0XG4gICAgaWYgKGVsLnRhcmdldCkgcmV0dXJuO1xuXG4gICAgLy8geC1vcmlnaW5cbiAgICBpZiAoIXNhbWVPcmlnaW4oZWwuaHJlZikpIHJldHVybjtcblxuICAgIC8vIHJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGggKyBlbC5oYXNoO1xuXG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJyk7XG4gICAgaWYgKGJhc2UgJiYgb3JpZyA9PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PSBlLndoaWNoXG4gICAgICA/IGUuYnV0dG9uXG4gICAgICA6IGUud2hpY2g7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYGhyZWZgIGlzIHRoZSBzYW1lIG9yaWdpbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gc2FtZU9yaWdpbihocmVmKSB7XG4gICAgdmFyIG9yaWdpbiA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGlmIChsb2NhdGlvbi5wb3J0KSBvcmlnaW4gKz0gJzonICsgbG9jYXRpb24ucG9ydDtcbiAgICByZXR1cm4gMCA9PSBocmVmLmluZGV4T2Yob3JpZ2luKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYHBhZ2VgLlxuICAgKi9cblxuICBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIG1vZHVsZSkge1xuICAgIHdpbmRvdy5wYWdlID0gcGFnZTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4gIH1cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihWdWUsIG9wdGlvbnMpIHtcbiAgICBWdWUubG9nID0gcmVxdWlyZSgnLi9sb2cnKShWdWUpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2xlYW4gbG9nIHdpdGhvdXQgZ2V0dGVyL3NldHRlclxuICogdXNlZnVsbCBmb3IgaW4tYXBwbGljYXRpb24gZGVidWdnaW5nLlxuICogT25seSBsb2cgJGRhdGEgJiBpdHMgcHJvcGVydGllc1xuICpcbiAqIChtb3N0bHkgdG8gYXZvaWQgSlNPTiBwYXJzZSBleGNlcHRpb24gd2l0aFxuICogY2lyY3VsYXIgcmVmZXJlbmNlcyBmcm9tIHZtLiRjb21waWxlcilcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFZ1ZSkge1xuICAgIHZhciB1dGlscyA9IFZ1ZS5yZXF1aXJlKCd1dGlscycpLFxuICAgIGlzT2JqZWN0ID0gdXRpbHMuaXNUcnVlT2JqZWN0LFxuICAgIHNsaWNlID0gW10uc2xpY2U7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFjb25zb2xlKSByZXR1cm47XG4gICAgICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIFxuICAgICAgICBmb3IodmFyIGkgPSBhcmdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJnc1tpXTtcblxuICAgICAgICAgICAgLy8gRGlyZWN0bHkgbG9nIGFueSBwcmltaXRpdmUgYXJnXG4gICAgICAgICAgICBpZighaXNPYmplY3QoYXJnKSkgY29udGludWU7XG5cbiAgICAgICAgICAgIHZhciBoYXNDaXJjdWxhclJlZiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzVm0gPSAhIWFyZy4kY29tcGlsZXI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIElmIGFyZyBpcyBhIHZtLCBsb2cgJGRhdGEgZGlyZWN0bHlcbiAgICAgICAgICAgIGlmKGlzVm0pIHtcbiAgICAgICAgICAgICAgICBhcmdzLnNwbGljZShpLCAxLCBhcmcuJGRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkb24ndCBsb2cgaWYgJCBvciAkY29tcGlsZXJcbiAgICAgICAgICAgIGZvcih2YXIgcHJvcCBpbiBhcmcpIHtcbiAgICAgICAgICAgICAgICAvLyAkY29tcGlsZXJcbiAgICAgICAgICAgICAgICBpZihwcm9wID09PSAndm0nKSBoYXNDaXJjdWxhclJlZiA9IHRydWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gJCAvIHYtcmVmXG4gICAgICAgICAgICAgICAgaWYoaXNPYmplY3QoYXJnW3Byb3BdKSAmJiAnJGNvbXBpbGVyJyBpbiBhcmdbcHJvcF0pIGhhc0NpcmN1bGFyUmVmID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaGFzQ2lyY3VsYXJSZWYpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdXNpbmcgYHJldHVybmAgbWFrZXMgaXQgdGVzdGFibGUgIFxuICAgICAgICByZXR1cm4gY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcmdzKSkpO1xuICAgIH07XG59OyIsImV4cG9ydHMuaW5zdGFsbCA9IGZ1bmN0aW9uIChWdWUpIHtcbiAgXG4gIFZ1ZS5kaXJlY3RpdmUoJ2VsJyx7XG5cbiAgICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgICBiaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvbjtcblxuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIHRoaXMudm0uJCQgPSB0aGlzLnZtLiQkIHx8IHt9O1xuICAgICAgICB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl0gPSB0aGlzLmVsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkID0gdGhpcy5leHByZXNzaW9uO1xuXG4gICAgICBpZiAoaWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMudm0uJCRbdGhpcy5leHByZXNzaW9uXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfSk7XG5cbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG5mdW5jdGlvbiBmaW5kKGVsLCBzZWxlY3Rvcikge1xuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG59XG5cbmZ1bmN0aW9uIGZpbmRBbGwoZWwsIHNlbGVjdG9yKSB7XG4gIGVsID0gZWwgfHwgZG9jdW1lbnQ7XG4gIHJldHVybiBzbGljZS5jYWxsKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cblxuZnVuY3Rpb24gaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCcgJyArIGNsYXNzTmFtZSArICcgJykudGVzdCgnICcgKyBlbC5jbGFzc05hbWUgKyAnICcpO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZXhwb3J0cy5pbnN0YWxsID0gZnVuY3Rpb24oVnVlKSB7XG4gIHZhciB1dGlscyA9IFZ1ZS5yZXF1aXJlKCd1dGlscycpO1xuICB1dGlscy5leHRlbmQoVnVlLnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIFJldHVybiBhIHNpbmdsZSBkb20gZWxlbWVudCBmcm9tIHRoZSBjdXJyZW50IFZNIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvclxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0b3Igc3RyaW5nIHNlbGVjdG9yIHRvIHNlYXJjaFxuICAgICAqIEByZXR1cm4ge2RvbUVsZW1lbnR9ICAgICAgICAgIHRoZSBWTSdzIGNoaWxkIGZvdW5kXG4gICAgICovXG4gICAgJGZpbmRPbmU6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBmaW5kKHRoaXMuJGVsLCBzZWxlY3Rvcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbiBhcnJheSBvZiBkb21FbGVtZW50IGZyb20gdGhlIGN1cnJlbnQgVk0gbWF0Y2hpbmcgdGhlIGdpdmVuIHNlbGVjdG9yXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3RvciBzdHJpbmcgc2VsZWN0b3IgdG8gc2VhcmNoXG4gICAgICogQHJldHVybiB7YXJyYXl9ICAgICAgICAgIGFycmF5IGNvbnRhaW5pbmcgZG9tRWxlbWVudHMgZm91bmQgaW4gdGhlIFZNXG4gICAgICovXG4gICAgJGZpbmQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBmaW5kQWxsKHRoaXMuJGVsLCBzZWxlY3Rvcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBjdXJyZW50IFZNIGhhcyBhIGdpdmVuIGNsYXNzLCBpZiBhIHNlbGVjdG9yIGlzIHBhc3NlZCBhcyBzZWNvbmQgcGFyYW1ldGVycywgd2UnbGwgY2hlY2sgdGhlIGNvcnJlc3BvbmRpbmcgY2hpbGQgaW5zdGVhZFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gIGNsYXNzTmFtZVxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gIHNlbGVjdG9yXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgZWwgPSBzZWxlY3RvciA/IHRoaXMuJGZpbmRPbmUoc2VsZWN0b3IpIDogdGhpcy4kZWw7XG4gICAgICAgIHJldHVybiBoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2xhc3MgdG8gdGhlIGN1cnJlbnQgVk0gb3IgdG8gaXRzIGNoaWxkIG1hdGNoaW5nICdzZWxlY3RvcidcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSwgc2VsZWN0b3IpIHtcbiAgICAgICAgaWYodGhpcy5oYXNDbGFzcyhjbGFzc05hbWUsIHNlbGVjdG9yKSkgcmV0dXJuO1xuICAgICAgICB2YXIgZWwgPSBzZWxlY3RvciA/IHRoaXMuJGZpbmQoc2VsZWN0b3IpIDogdGhpcy4kZWw7XG4gICAgICAgIGlmKGlzQXJyYXkoZWwpKSB7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsID0gZWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkQ2xhc3MoZWxbaV0sIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHV0aWxzLmFkZENsYXNzKGVsLCBjbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBjbGFzcyB0byB0aGUgY3VycmVudCBWTSBvciB0byBpdHMgY2hpbGQgbWF0Y2hpbmcgJ3NlbGVjdG9yJ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgZWwgPSBzZWxlY3RvciA/IHRoaXMuJGZpbmQoc2VsZWN0b3IpIDogdGhpcy4kZWw7XG4gICAgICAgIGlmKGlzQXJyYXkoZWwpKSB7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsID0gZWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMucmVtb3ZlQ2xhc3MoZWxbaV0sIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHV0aWxzLnJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG59OyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuXG5mdW5jdGlvbiBCYXRjaGVyICgpIHtcbiAgICB0aGlzLnJlc2V0KClcbn1cblxudmFyIEJhdGNoZXJQcm90byA9IEJhdGNoZXIucHJvdG90eXBlXG5cbkJhdGNoZXJQcm90by5wdXNoID0gZnVuY3Rpb24gKGpvYikge1xuICAgIGlmICgham9iLmlkIHx8ICF0aGlzLmhhc1tqb2IuaWRdKSB7XG4gICAgICAgIHRoaXMucXVldWUucHVzaChqb2IpXG4gICAgICAgIHRoaXMuaGFzW2pvYi5pZF0gPSBqb2JcbiAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMud2FpdGluZyA9IHRydWVcbiAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKHV0aWxzLmJpbmQodGhpcy5mbHVzaCwgdGhpcykpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGpvYi5vdmVycmlkZSkge1xuICAgICAgICB2YXIgb2xkSm9iID0gdGhpcy5oYXNbam9iLmlkXVxuICAgICAgICBvbGRKb2IuY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goam9iKVxuICAgICAgICB0aGlzLmhhc1tqb2IuaWRdID0gam9iXG4gICAgfVxufVxuXG5CYXRjaGVyUHJvdG8uZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYmVmb3JlIGZsdXNoIGhvb2tcbiAgICBpZiAodGhpcy5fcHJlRmx1c2gpIHRoaXMuX3ByZUZsdXNoKClcbiAgICAvLyBkbyBub3QgY2FjaGUgbGVuZ3RoIGJlY2F1c2UgbW9yZSBqb2JzIG1pZ2h0IGJlIHB1c2hlZFxuICAgIC8vIGFzIHdlIGV4ZWN1dGUgZXhpc3Rpbmcgam9ic1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgam9iID0gdGhpcy5xdWV1ZVtpXVxuICAgICAgICBpZiAoIWpvYi5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGpvYi5leGVjdXRlKClcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlc2V0KClcbn1cblxuQmF0Y2hlclByb3RvLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaGFzID0gdXRpbHMuaGFzaCgpXG4gICAgdGhpcy5xdWV1ZSA9IFtdXG4gICAgdGhpcy53YWl0aW5nID0gZmFsc2Vcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXRjaGVyIiwidmFyIEJhdGNoZXIgICAgICAgID0gcmVxdWlyZSgnLi9iYXRjaGVyJyksXG4gICAgYmluZGluZ0JhdGNoZXIgPSBuZXcgQmF0Y2hlcigpLFxuICAgIGJpbmRpbmdJZCAgICAgID0gMVxuXG4vKipcbiAqICBCaW5kaW5nIGNsYXNzLlxuICpcbiAqICBlYWNoIHByb3BlcnR5IG9uIHRoZSB2aWV3bW9kZWwgaGFzIG9uZSBjb3JyZXNwb25kaW5nIEJpbmRpbmcgb2JqZWN0XG4gKiAgd2hpY2ggaGFzIG11bHRpcGxlIGRpcmVjdGl2ZSBpbnN0YW5jZXMgb24gdGhlIERPTVxuICogIGFuZCBtdWx0aXBsZSBjb21wdXRlZCBwcm9wZXJ0eSBkZXBlbmRlbnRzXG4gKi9cbmZ1bmN0aW9uIEJpbmRpbmcgKGNvbXBpbGVyLCBrZXksIGlzRXhwLCBpc0ZuKSB7XG4gICAgdGhpcy5pZCA9IGJpbmRpbmdJZCsrXG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZFxuICAgIHRoaXMuaXNFeHAgPSAhIWlzRXhwXG4gICAgdGhpcy5pc0ZuID0gaXNGblxuICAgIHRoaXMucm9vdCA9ICF0aGlzLmlzRXhwICYmIGtleS5pbmRleE9mKCcuJykgPT09IC0xXG4gICAgdGhpcy5jb21waWxlciA9IGNvbXBpbGVyXG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgICB0aGlzLmRpcnMgPSBbXVxuICAgIHRoaXMuc3VicyA9IFtdXG4gICAgdGhpcy5kZXBzID0gW11cbiAgICB0aGlzLnVuYm91bmQgPSBmYWxzZVxufVxuXG52YXIgQmluZGluZ1Byb3RvID0gQmluZGluZy5wcm90b3R5cGVcblxuLyoqXG4gKiAgVXBkYXRlIHZhbHVlIGFuZCBxdWV1ZSBpbnN0YW5jZSB1cGRhdGVzLlxuICovXG5CaW5kaW5nUHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZWQgfHwgdGhpcy5pc0ZuKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5kaXJzLmxlbmd0aCB8fCB0aGlzLnN1YnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICBiaW5kaW5nQmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi51bmJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQWN0dWFsbHkgdXBkYXRlIHRoZSBkaXJlY3RpdmVzLlxuICovXG5CaW5kaW5nUHJvdG8uX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHRoaXMuZGlycy5sZW5ndGgsXG4gICAgICAgIHZhbHVlID0gdGhpcy52YWwoKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5kaXJzW2ldLiR1cGRhdGUodmFsdWUpXG4gICAgfVxuICAgIHRoaXMucHViKClcbn1cblxuLyoqXG4gKiAgUmV0dXJuIHRoZSB2YWx1YXRlZCB2YWx1ZSByZWdhcmRsZXNzXG4gKiAgb2Ygd2hldGhlciBpdCBpcyBjb21wdXRlZCBvciBub3RcbiAqL1xuQmluZGluZ1Byb3RvLnZhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0NvbXB1dGVkICYmICF0aGlzLmlzRm5cbiAgICAgICAgPyB0aGlzLnZhbHVlLiRnZXQoKVxuICAgICAgICA6IHRoaXMudmFsdWVcbn1cblxuLyoqXG4gKiAgTm90aWZ5IGNvbXB1dGVkIHByb3BlcnRpZXMgdGhhdCBkZXBlbmQgb24gdGhpcyBiaW5kaW5nXG4gKiAgdG8gdXBkYXRlIHRoZW1zZWx2ZXNcbiAqL1xuQmluZGluZ1Byb3RvLnB1YiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHRoaXMuc3Vicy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMuc3Vic1tpXS51cGRhdGUoKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgVW5iaW5kIHRoZSBiaW5kaW5nLCByZW1vdmUgaXRzZWxmIGZyb20gYWxsIG9mIGl0cyBkZXBlbmRlbmNpZXNcbiAqL1xuQmluZGluZ1Byb3RvLnVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJbmRpY2F0ZSB0aGlzIGhhcyBiZWVuIHVuYm91bmQuXG4gICAgLy8gSXQncyBwb3NzaWJsZSB0aGlzIGJpbmRpbmcgd2lsbCBiZSBpblxuICAgIC8vIHRoZSBiYXRjaGVyJ3MgZmx1c2ggcXVldWUgd2hlbiBpdHMgb3duZXJcbiAgICAvLyBjb21waWxlciBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZC5cbiAgICB0aGlzLnVuYm91bmQgPSB0cnVlXG4gICAgdmFyIGkgPSB0aGlzLmRpcnMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB0aGlzLmRpcnNbaV0uJHVuYmluZCgpXG4gICAgfVxuICAgIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gICAgdmFyIHN1YnNcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHN1YnMgPSB0aGlzLmRlcHNbaV0uc3Vic1xuICAgICAgICB2YXIgaiA9IHN1YnMuaW5kZXhPZih0aGlzKVxuICAgICAgICBpZiAoaiA+IC0xKSBzdWJzLnNwbGljZShqLCAxKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCaW5kaW5nIiwidmFyIEVtaXR0ZXIgICAgID0gcmVxdWlyZSgnLi9lbWl0dGVyJyksXG4gICAgT2JzZXJ2ZXIgICAgPSByZXF1aXJlKCcuL29ic2VydmVyJyksXG4gICAgY29uZmlnICAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIHV0aWxzICAgICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIEJpbmRpbmcgICAgID0gcmVxdWlyZSgnLi9iaW5kaW5nJyksXG4gICAgRGlyZWN0aXZlICAgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpLFxuICAgIFRleHRQYXJzZXIgID0gcmVxdWlyZSgnLi90ZXh0LXBhcnNlcicpLFxuICAgIERlcHNQYXJzZXIgID0gcmVxdWlyZSgnLi9kZXBzLXBhcnNlcicpLFxuICAgIEV4cFBhcnNlciAgID0gcmVxdWlyZSgnLi9leHAtcGFyc2VyJyksXG4gICAgVmlld01vZGVsLFxuICAgIFxuICAgIC8vIGNhY2hlIG1ldGhvZHNcbiAgICBzbGljZSAgICAgICA9IFtdLnNsaWNlLFxuICAgIGV4dGVuZCAgICAgID0gdXRpbHMuZXh0ZW5kLFxuICAgIGhhc093biAgICAgID0gKHt9KS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBkZWYgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcblxuICAgIC8vIGhvb2tzIHRvIHJlZ2lzdGVyXG4gICAgaG9va3MgPSBbXG4gICAgICAgICdjcmVhdGVkJywgJ3JlYWR5JyxcbiAgICAgICAgJ2JlZm9yZURlc3Ryb3knLCAnYWZ0ZXJEZXN0cm95JyxcbiAgICAgICAgJ2F0dGFjaGVkJywgJ2RldGFjaGVkJ1xuICAgIF0sXG5cbiAgICAvLyBsaXN0IG9mIHByaW9yaXR5IGRpcmVjdGl2ZXNcbiAgICAvLyB0aGF0IG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gc3BlY2lmaWMgb3JkZXJcbiAgICBwcmlvcml0eURpcmVjdGl2ZXMgPSBbXG4gICAgICAgICdpZicsXG4gICAgICAgICdyZXBlYXQnLFxuICAgICAgICAndmlldycsXG4gICAgICAgICdjb21wb25lbnQnXG4gICAgXVxuXG4vKipcbiAqICBUaGUgRE9NIGNvbXBpbGVyXG4gKiAgc2NhbnMgYSBET00gbm9kZSBhbmQgY29tcGlsZSBiaW5kaW5ncyBmb3IgYSBWaWV3TW9kZWxcbiAqL1xuZnVuY3Rpb24gQ29tcGlsZXIgKHZtLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBrZXksIGlcblxuICAgIC8vIGRlZmF1bHQgc3RhdGVcbiAgICBjb21waWxlci5pbml0ICAgICAgID0gdHJ1ZVxuICAgIGNvbXBpbGVyLmRlc3Ryb3llZCAgPSBmYWxzZVxuXG4gICAgLy8gcHJvY2VzcyBhbmQgZXh0ZW5kIG9wdGlvbnNcbiAgICBvcHRpb25zID0gY29tcGlsZXIub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB1dGlscy5wcm9jZXNzT3B0aW9ucyhvcHRpb25zKVxuXG4gICAgLy8gY29weSBjb21waWxlciBvcHRpb25zXG4gICAgZXh0ZW5kKGNvbXBpbGVyLCBvcHRpb25zLmNvbXBpbGVyT3B0aW9ucylcbiAgICAvLyByZXBlYXQgaW5kaWNhdGVzIHRoaXMgaXMgYSB2LXJlcGVhdCBpbnN0YW5jZVxuICAgIGNvbXBpbGVyLnJlcGVhdCAgID0gY29tcGlsZXIucmVwZWF0IHx8IGZhbHNlXG4gICAgLy8gZXhwQ2FjaGUgd2lsbCBiZSBzaGFyZWQgYmV0d2VlbiB2LXJlcGVhdCBpbnN0YW5jZXNcbiAgICBjb21waWxlci5leHBDYWNoZSA9IGNvbXBpbGVyLmV4cENhY2hlIHx8IHt9XG5cbiAgICAvLyBpbml0aWFsaXplIGVsZW1lbnRcbiAgICB2YXIgZWwgPSBjb21waWxlci5lbCA9IGNvbXBpbGVyLnNldHVwRWxlbWVudChvcHRpb25zKVxuICAgIHV0aWxzLmxvZygnXFxubmV3IFZNIGluc3RhbmNlOiAnICsgZWwudGFnTmFtZSArICdcXG4nKVxuXG4gICAgLy8gc2V0IG90aGVyIGNvbXBpbGVyIHByb3BlcnRpZXNcbiAgICBjb21waWxlci52bSAgICAgICA9IGVsLnZ1ZV92bSA9IHZtXG4gICAgY29tcGlsZXIuYmluZGluZ3MgPSB1dGlscy5oYXNoKClcbiAgICBjb21waWxlci5kaXJzICAgICA9IFtdXG4gICAgY29tcGlsZXIuZGVmZXJyZWQgPSBbXVxuICAgIGNvbXBpbGVyLmNvbXB1dGVkID0gW11cbiAgICBjb21waWxlci5jaGlsZHJlbiA9IFtdXG4gICAgY29tcGlsZXIuZW1pdHRlciAgPSBuZXcgRW1pdHRlcih2bSlcblxuICAgIC8vIFZNIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gc2V0IFZNIHByb3BlcnRpZXNcbiAgICB2bS4kICAgICAgICAgPSB7fVxuICAgIHZtLiRlbCAgICAgICA9IGVsXG4gICAgdm0uJG9wdGlvbnMgID0gb3B0aW9uc1xuICAgIHZtLiRjb21waWxlciA9IGNvbXBpbGVyXG4gICAgdm0uJGV2ZW50ICAgID0gbnVsbFxuXG4gICAgLy8gc2V0IHBhcmVudCAmIHJvb3RcbiAgICB2YXIgcGFyZW50Vk0gPSBvcHRpb25zLnBhcmVudFxuICAgIGlmIChwYXJlbnRWTSkge1xuICAgICAgICBjb21waWxlci5wYXJlbnQgPSBwYXJlbnRWTS4kY29tcGlsZXJcbiAgICAgICAgcGFyZW50Vk0uJGNvbXBpbGVyLmNoaWxkcmVuLnB1c2goY29tcGlsZXIpXG4gICAgICAgIHZtLiRwYXJlbnQgPSBwYXJlbnRWTVxuICAgICAgICAvLyBpbmhlcml0IGxhenkgb3B0aW9uXG4gICAgICAgIGlmICghKCdsYXp5JyBpbiBvcHRpb25zKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5sYXp5ID0gY29tcGlsZXIucGFyZW50Lm9wdGlvbnMubGF6eVxuICAgICAgICB9XG4gICAgfVxuICAgIHZtLiRyb290ID0gZ2V0Um9vdChjb21waWxlcikudm1cblxuICAgIC8vIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gc2V0dXAgb2JzZXJ2ZXJcbiAgICAvLyB0aGlzIGlzIG5lY2VzYXJyeSBmb3IgYWxsIGhvb2tzIGFuZCBkYXRhIG9ic2VydmF0aW9uIGV2ZW50c1xuICAgIGNvbXBpbGVyLnNldHVwT2JzZXJ2ZXIoKVxuXG4gICAgLy8gY3JlYXRlIGJpbmRpbmdzIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzXG4gICAgaWYgKG9wdGlvbnMubWV0aG9kcykge1xuICAgICAgICBmb3IgKGtleSBpbiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGJpbmRpbmdzIGZvciBtZXRob2RzXG4gICAgaWYgKG9wdGlvbnMuY29tcHV0ZWQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIGRhdGFcbiAgICB2YXIgZGF0YSA9IGNvbXBpbGVyLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwge30sXG4gICAgICAgIGRlZmF1bHREYXRhID0gb3B0aW9ucy5kZWZhdWx0RGF0YVxuICAgIGlmIChkZWZhdWx0RGF0YSkge1xuICAgICAgICBmb3IgKGtleSBpbiBkZWZhdWx0RGF0YSkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd24uY2FsbChkYXRhLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gZGVmYXVsdERhdGFba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29weSBwYXJhbUF0dHJpYnV0ZXNcbiAgICB2YXIgcGFyYW1zID0gb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIGkgPSBwYXJhbXMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGRhdGFbcGFyYW1zW2ldXSA9IHV0aWxzLmNoZWNrTnVtYmVyKFxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmV2YWwoXG4gICAgICAgICAgICAgICAgICAgIGVsLmdldEF0dHJpYnV0ZShwYXJhbXNbaV0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29weSBkYXRhIHByb3BlcnRpZXMgdG8gdm1cbiAgICAvLyBzbyB1c2VyIGNhbiBhY2Nlc3MgdGhlbSBpbiB0aGUgY3JlYXRlZCBob29rXG4gICAgZXh0ZW5kKHZtLCBkYXRhKVxuICAgIHZtLiRkYXRhID0gZGF0YVxuXG4gICAgLy8gYmVmb3JlQ29tcGlsZSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ2NyZWF0ZWQnKVxuXG4gICAgLy8gdGhlIHVzZXIgbWlnaHQgaGF2ZSBzd2FwcGVkIHRoZSBkYXRhIC4uLlxuICAgIGRhdGEgPSBjb21waWxlci5kYXRhID0gdm0uJGRhdGFcblxuICAgIC8vIHVzZXIgbWlnaHQgYWxzbyBzZXQgc29tZSBwcm9wZXJ0aWVzIG9uIHRoZSB2bVxuICAgIC8vIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIGNvcHkgYmFjayB0byAkZGF0YVxuICAgIHZhciB2bVByb3BcbiAgICBmb3IgKGtleSBpbiB2bSkge1xuICAgICAgICB2bVByb3AgPSB2bVtrZXldXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGtleS5jaGFyQXQoMCkgIT09ICckJyAmJlxuICAgICAgICAgICAgZGF0YVtrZXldICE9PSB2bVByb3AgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2bVByb3AgIT09ICdmdW5jdGlvbidcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB2bVByb3BcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5vdyB3ZSBjYW4gb2JzZXJ2ZSB0aGUgZGF0YS5cbiAgICAvLyB0aGlzIHdpbGwgY29udmVydCBkYXRhIHByb3BlcnRpZXMgdG8gZ2V0dGVyL3NldHRlcnNcbiAgICAvLyBhbmQgZW1pdCB0aGUgZmlyc3QgYmF0Y2ggb2Ygc2V0IGV2ZW50cywgd2hpY2ggd2lsbFxuICAgIC8vIGluIHR1cm4gY3JlYXRlIHRoZSBjb3JyZXNwb25kaW5nIGJpbmRpbmdzLlxuICAgIGNvbXBpbGVyLm9ic2VydmVEYXRhKGRhdGEpXG5cbiAgICAvLyBDT01QSUxFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIGJlZm9yZSBjb21waWxpbmcsIHJlc29sdmUgY29udGVudCBpbnNlcnRpb24gcG9pbnRzXG4gICAgaWYgKG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlQ29udGVudCgpXG4gICAgfVxuXG4gICAgLy8gbm93IHBhcnNlIHRoZSBET00gYW5kIGJpbmQgZGlyZWN0aXZlcy5cbiAgICAvLyBEdXJpbmcgdGhpcyBzdGFnZSwgd2Ugd2lsbCBhbHNvIGNyZWF0ZSBiaW5kaW5ncyBmb3JcbiAgICAvLyBlbmNvdW50ZXJlZCBrZXlwYXRocyB0aGF0IGRvbid0IGhhdmUgYSBiaW5kaW5nIHlldC5cbiAgICBjb21waWxlci5jb21waWxlKGVsLCB0cnVlKVxuXG4gICAgLy8gQW55IGRpcmVjdGl2ZSB0aGF0IGNyZWF0ZXMgY2hpbGQgVk1zIGFyZSBkZWZlcnJlZFxuICAgIC8vIHNvIHRoYXQgd2hlbiB0aGV5IGFyZSBjb21waWxlZCwgYWxsIGJpbmRpbmdzIG9uIHRoZVxuICAgIC8vIHBhcmVudCBWTSBoYXZlIGJlZW4gY3JlYXRlZC5cbiAgICBpID0gY29tcGlsZXIuZGVmZXJyZWQubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb21waWxlci5iaW5kRGlyZWN0aXZlKGNvbXBpbGVyLmRlZmVycmVkW2ldKVxuICAgIH1cbiAgICBjb21waWxlci5kZWZlcnJlZCA9IG51bGxcblxuICAgIC8vIGV4dHJhY3QgZGVwZW5kZW5jaWVzIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzLlxuICAgIC8vIHRoaXMgd2lsbCBldmFsdWF0ZWQgYWxsIGNvbGxlY3RlZCBjb21wdXRlZCBiaW5kaW5nc1xuICAgIC8vIGFuZCBjb2xsZWN0IGdldCBldmVudHMgdGhhdCBhcmUgZW1pdHRlZC5cbiAgICBpZiAodGhpcy5jb21wdXRlZC5sZW5ndGgpIHtcbiAgICAgICAgRGVwc1BhcnNlci5wYXJzZSh0aGlzLmNvbXB1dGVkKVxuICAgIH1cblxuICAgIC8vIGRvbmUhXG4gICAgY29tcGlsZXIuaW5pdCA9IGZhbHNlXG5cbiAgICAvLyBwb3N0IGNvbXBpbGUgLyByZWFkeSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ3JlYWR5Jylcbn1cblxudmFyIENvbXBpbGVyUHJvdG8gPSBDb21waWxlci5wcm90b3R5cGVcblxuLyoqXG4gKiAgSW5pdGlhbGl6ZSB0aGUgVk0vQ29tcGlsZXIncyBlbGVtZW50LlxuICogIEZpbGwgaXQgaW4gd2l0aCB0aGUgdGVtcGxhdGUgaWYgbmVjZXNzYXJ5LlxuICovXG5Db21waWxlclByb3RvLnNldHVwRWxlbWVudCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgLy8gY3JlYXRlIHRoZSBub2RlIGZpcnN0XG4gICAgdmFyIGVsID0gdHlwZW9mIG9wdGlvbnMuZWwgPT09ICdzdHJpbmcnXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmVsKVxuICAgICAgICA6IG9wdGlvbnMuZWwgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRpb25zLnRhZ05hbWUgfHwgJ2RpdicpXG5cbiAgICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlLFxuICAgICAgICBjaGlsZCwgcmVwbGFjZXIsIGksIGF0dHIsIGF0dHJzXG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgLy8gY29sbGVjdCBhbnl0aGluZyBhbHJlYWR5IGluIHRoZXJlXG4gICAgICAgIGlmIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMucmF3Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgICAgICAgICAgd2hpbGUgKGNoaWxkID0gZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmF3Q29udGVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZXBsYWNlIG9wdGlvbjogdXNlIHRoZSBmaXJzdCBub2RlIGluXG4gICAgICAgIC8vIHRoZSB0ZW1wbGF0ZSBkaXJlY3RseVxuICAgICAgICBpZiAob3B0aW9ucy5yZXBsYWNlICYmIHRlbXBsYXRlLmZpcnN0Q2hpbGQgPT09IHRlbXBsYXRlLmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgcmVwbGFjZXIgPSB0ZW1wbGF0ZS5maXJzdENoaWxkLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyZXBsYWNlciwgZWwpXG4gICAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvcHkgb3ZlciBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGVsLmF0dHJpYnV0ZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyID0gZWwuYXR0cmlidXRlc1tpXVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlci5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlcGxhY2VcbiAgICAgICAgICAgIGVsID0gcmVwbGFjZXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gYXBwbHkgZWxlbWVudCBvcHRpb25zXG4gICAgaWYgKG9wdGlvbnMuaWQpIGVsLmlkID0gb3B0aW9ucy5pZFxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWVcbiAgICBhdHRycyA9IG9wdGlvbnMuYXR0cmlidXRlc1xuICAgIGlmIChhdHRycykge1xuICAgICAgICBmb3IgKGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbFxufVxuXG4vKipcbiAqICBEZWFsIHdpdGggPGNvbnRlbnQ+IGluc2VydGlvbiBwb2ludHNcbiAqICBwZXIgdGhlIFdlYiBDb21wb25lbnRzIHNwZWNcbiAqL1xuQ29tcGlsZXJQcm90by5yZXNvbHZlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBvdXRsZXRzID0gc2xpY2UuY2FsbCh0aGlzLmVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjb250ZW50JykpLFxuICAgICAgICByYXcgPSB0aGlzLnJhd0NvbnRlbnQsXG4gICAgICAgIG91dGxldCwgc2VsZWN0LCBpLCBqLCBtYWluXG5cbiAgICBpID0gb3V0bGV0cy5sZW5ndGhcbiAgICBpZiAoaSkge1xuICAgICAgICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IGNvcnJlc3BvbmRpbmcgY29udGVudFxuICAgICAgICAvLyBmb3IgZWFjaCBvdXRsZXQuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3QgPSBvdXRsZXQuZ2V0QXR0cmlidXRlKCdzZWxlY3QnKVxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3QpIHsgLy8gc2VsZWN0IGNvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgb3V0bGV0LmNvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2UuY2FsbChyYXcucXVlcnlTZWxlY3RvckFsbChzZWxlY3QpKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGRlZmF1bHQgY29udGVudFxuICAgICAgICAgICAgICAgICAgICBtYWluID0gb3V0bGV0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gZmFsbGJhY2sgY29udGVudFxuICAgICAgICAgICAgICAgIG91dGxldC5jb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgc2xpY2UuY2FsbChvdXRsZXQuY2hpbGROb2RlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzZWNvbmQgcGFzcywgYWN0dWFsbHkgaW5zZXJ0IHRoZSBjb250ZW50c1xuICAgICAgICBmb3IgKGkgPSAwLCBqID0gb3V0bGV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICAgICAgICAgIGlmIChvdXRsZXQgPT09IG1haW4pIGNvbnRpbnVlXG4gICAgICAgICAgICBpbnNlcnQob3V0bGV0LCBvdXRsZXQuY29udGVudClcbiAgICAgICAgfVxuICAgICAgICAvLyBmaW5hbGx5IGluc2VydCB0aGUgbWFpbiBjb250ZW50XG4gICAgICAgIGlmIChyYXcgJiYgbWFpbikge1xuICAgICAgICAgICAgaW5zZXJ0KG1haW4sIHNsaWNlLmNhbGwocmF3LmNoaWxkTm9kZXMpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zZXJ0IChvdXRsZXQsIGNvbnRlbnRzKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSBvdXRsZXQucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIGkgPSAwLCBqID0gY29udGVudHMubGVuZ3RoXG4gICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnRzW2ldLCBvdXRsZXQpXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG91dGxldClcbiAgICB9XG5cbiAgICB0aGlzLnJhd0NvbnRlbnQgPSBudWxsXG59XG5cbi8qKlxuICogIFNldHVwIG9ic2VydmVyLlxuICogIFRoZSBvYnNlcnZlciBsaXN0ZW5zIGZvciBnZXQvc2V0L211dGF0ZSBldmVudHMgb24gYWxsIFZNXG4gKiAgdmFsdWVzL29iamVjdHMgYW5kIHRyaWdnZXIgY29ycmVzcG9uZGluZyBiaW5kaW5nIHVwZGF0ZXMuXG4gKiAgSXQgYWxzbyBsaXN0ZW5zIGZvciBsaWZlY3ljbGUgaG9va3MuXG4gKi9cbkNvbXBpbGVyUHJvdG8uc2V0dXBPYnNlcnZlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGJpbmRpbmdzID0gY29tcGlsZXIuYmluZGluZ3MsXG4gICAgICAgIG9wdGlvbnMgID0gY29tcGlsZXIub3B0aW9ucyxcbiAgICAgICAgb2JzZXJ2ZXIgPSBjb21waWxlci5vYnNlcnZlciA9IG5ldyBFbWl0dGVyKGNvbXBpbGVyLnZtKVxuXG4gICAgLy8gYSBoYXNoIHRvIGhvbGQgZXZlbnQgcHJveGllcyBmb3IgZWFjaCByb290IGxldmVsIGtleVxuICAgIC8vIHNvIHRoZXkgY2FuIGJlIHJlZmVyZW5jZWQgYW5kIHJlbW92ZWQgbGF0ZXJcbiAgICBvYnNlcnZlci5wcm94aWVzID0ge31cblxuICAgIC8vIGFkZCBvd24gbGlzdGVuZXJzIHdoaWNoIHRyaWdnZXIgYmluZGluZyB1cGRhdGVzXG4gICAgb2JzZXJ2ZXJcbiAgICAgICAgLm9uKCdnZXQnLCBvbkdldClcbiAgICAgICAgLm9uKCdzZXQnLCBvblNldClcbiAgICAgICAgLm9uKCdtdXRhdGUnLCBvblNldClcblxuICAgIC8vIHJlZ2lzdGVyIGhvb2tzXG4gICAgdmFyIGkgPSBob29rcy5sZW5ndGgsIGosIGhvb2ssIGZuc1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaG9vayA9IGhvb2tzW2ldXG4gICAgICAgIGZucyA9IG9wdGlvbnNbaG9va11cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZm5zKSkge1xuICAgICAgICAgICAgaiA9IGZucy5sZW5ndGhcbiAgICAgICAgICAgIC8vIHNpbmNlIGhvb2tzIHdlcmUgbWVyZ2VkIHdpdGggY2hpbGQgYXQgaGVhZCxcbiAgICAgICAgICAgIC8vIHdlIGxvb3AgcmV2ZXJzZWx5LlxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVySG9vayhob29rLCBmbnNbal0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZm5zKSB7XG4gICAgICAgICAgICByZWdpc3Rlckhvb2soaG9vaywgZm5zKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYnJvYWRjYXN0IGF0dGFjaGVkL2RldGFjaGVkIGhvb2tzXG4gICAgb2JzZXJ2ZXJcbiAgICAgICAgLm9uKCdob29rOmF0dGFjaGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJvYWRjYXN0KDEpXG4gICAgICAgIH0pXG4gICAgICAgIC5vbignaG9vazpkZXRhY2hlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyb2FkY2FzdCgwKVxuICAgICAgICB9KVxuXG4gICAgZnVuY3Rpb24gb25HZXQgKGtleSkge1xuICAgICAgICBjaGVjayhrZXkpXG4gICAgICAgIERlcHNQYXJzZXIuY2F0Y2hlci5lbWl0KCdnZXQnLCBiaW5kaW5nc1trZXldKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uU2V0IChrZXksIHZhbCwgbXV0YXRpb24pIHtcbiAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnY2hhbmdlOicgKyBrZXksIHZhbCwgbXV0YXRpb24pXG4gICAgICAgIGNoZWNrKGtleSlcbiAgICAgICAgYmluZGluZ3Nba2V5XS51cGRhdGUodmFsKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVySG9vayAoaG9vaywgZm4pIHtcbiAgICAgICAgb2JzZXJ2ZXIub24oJ2hvb2s6JyArIGhvb2ssIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY29tcGlsZXIudm0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0IChldmVudCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBjb21waWxlci5jaGlsZHJlblxuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCwgaSA9IGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudCA9ICdob29rOicgKyAoZXZlbnQgPyAnYXR0YWNoZWQnIDogJ2RldGFjaGVkJylcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2JzZXJ2ZXIuZW1pdChldmVudClcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuZW1pdHRlci5lbWl0KGV2ZW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrIChrZXkpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nc1trZXldKSB7XG4gICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQ29tcGlsZXJQcm90by5vYnNlcnZlRGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBvYnNlcnZlciA9IGNvbXBpbGVyLm9ic2VydmVyXG5cbiAgICAvLyByZWN1cnNpdmVseSBvYnNlcnZlIG5lc3RlZCBwcm9wZXJ0aWVzXG4gICAgT2JzZXJ2ZXIub2JzZXJ2ZShkYXRhLCAnJywgb2JzZXJ2ZXIpXG5cbiAgICAvLyBhbHNvIGNyZWF0ZSBiaW5kaW5nIGZvciB0b3AgbGV2ZWwgJGRhdGFcbiAgICAvLyBzbyBpdCBjYW4gYmUgdXNlZCBpbiB0ZW1wbGF0ZXMgdG9vXG4gICAgdmFyICRkYXRhQmluZGluZyA9IGNvbXBpbGVyLmJpbmRpbmdzWyckZGF0YSddID0gbmV3IEJpbmRpbmcoY29tcGlsZXIsICckZGF0YScpXG4gICAgJGRhdGFCaW5kaW5nLnVwZGF0ZShkYXRhKVxuXG4gICAgLy8gYWxsb3cgJGRhdGEgdG8gYmUgc3dhcHBlZFxuICAgIGRlZihjb21waWxlci52bSwgJyRkYXRhJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLm9ic2VydmVyLmVtaXQoJ2dldCcsICckZGF0YScpXG4gICAgICAgICAgICByZXR1cm4gY29tcGlsZXIuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICAgICAgICB2YXIgb2xkRGF0YSA9IGNvbXBpbGVyLmRhdGFcbiAgICAgICAgICAgIE9ic2VydmVyLnVub2JzZXJ2ZShvbGREYXRhLCAnJywgb2JzZXJ2ZXIpXG4gICAgICAgICAgICBjb21waWxlci5kYXRhID0gbmV3RGF0YVxuICAgICAgICAgICAgT2JzZXJ2ZXIuY29weVBhdGhzKG5ld0RhdGEsIG9sZERhdGEpXG4gICAgICAgICAgICBPYnNlcnZlci5vYnNlcnZlKG5ld0RhdGEsICcnLCBvYnNlcnZlcilcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gZW1pdCAkZGF0YSBjaGFuZ2Ugb24gYWxsIGNoYW5nZXNcbiAgICBvYnNlcnZlclxuICAgICAgICAub24oJ3NldCcsIG9uU2V0KVxuICAgICAgICAub24oJ211dGF0ZScsIG9uU2V0KVxuXG4gICAgZnVuY3Rpb24gb25TZXQgKGtleSkge1xuICAgICAgICBpZiAoa2V5ICE9PSAnJGRhdGEnKSB1cGRhdGUoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gICAgICAgICRkYXRhQmluZGluZy51cGRhdGUoY29tcGlsZXIuZGF0YSlcbiAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnY2hhbmdlOiRkYXRhJywgY29tcGlsZXIuZGF0YSlcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgYSBET00gbm9kZSAocmVjdXJzaXZlKVxuICovXG5Db21waWxlclByb3RvLmNvbXBpbGUgPSBmdW5jdGlvbiAobm9kZSwgcm9vdCkge1xuICAgIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGVcbiAgICBpZiAobm9kZVR5cGUgPT09IDEgJiYgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJykgeyAvLyBhIG5vcm1hbCBub2RlXG4gICAgICAgIHRoaXMuY29tcGlsZUVsZW1lbnQobm9kZSwgcm9vdClcbiAgICB9IGVsc2UgaWYgKG5vZGVUeXBlID09PSAzICYmIGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgICB0aGlzLmNvbXBpbGVUZXh0Tm9kZShub2RlKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ2hlY2sgZm9yIGEgcHJpb3JpdHkgZGlyZWN0aXZlXG4gKiAgSWYgaXQgaXMgcHJlc2VudCBhbmQgdmFsaWQsIHJldHVybiB0cnVlIHRvIHNraXAgdGhlIHJlc3RcbiAqL1xuQ29tcGlsZXJQcm90by5jaGVja1ByaW9yaXR5RGlyID0gZnVuY3Rpb24gKGRpcm5hbWUsIG5vZGUsIHJvb3QpIHtcbiAgICB2YXIgZXhwcmVzc2lvbiwgZGlyZWN0aXZlLCBDdG9yXG4gICAgaWYgKFxuICAgICAgICBkaXJuYW1lID09PSAnY29tcG9uZW50JyAmJlxuICAgICAgICByb290ICE9PSB0cnVlICYmXG4gICAgICAgIChDdG9yID0gdGhpcy5yZXNvbHZlQ29tcG9uZW50KG5vZGUsIHVuZGVmaW5lZCwgdHJ1ZSkpXG4gICAgKSB7XG4gICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoZGlybmFtZSwgJycsIG5vZGUpXG4gICAgICAgIGRpcmVjdGl2ZS5DdG9yID0gQ3RvclxuICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cHJlc3Npb24gPSB1dGlscy5hdHRyKG5vZGUsIGRpcm5hbWUpXG4gICAgICAgIGRpcmVjdGl2ZSA9IGV4cHJlc3Npb24gJiYgdGhpcy5wYXJzZURpcmVjdGl2ZShkaXJuYW1lLCBleHByZXNzaW9uLCBub2RlKVxuICAgIH1cbiAgICBpZiAoZGlyZWN0aXZlKSB7XG4gICAgICAgIGlmIChyb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKFxuICAgICAgICAgICAgICAgICdEaXJlY3RpdmUgdi0nICsgZGlybmFtZSArICcgY2Fubm90IGJlIHVzZWQgb24gYW4gYWxyZWFkeSBpbnN0YW50aWF0ZWQgJyArXG4gICAgICAgICAgICAgICAgJ1ZNXFwncyByb290IG5vZGUuIFVzZSBpdCBmcm9tIHRoZSBwYXJlbnRcXCdzIHRlbXBsYXRlIGluc3RlYWQuJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWZlcnJlZC5wdXNoKGRpcmVjdGl2ZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgbm9ybWFsIGRpcmVjdGl2ZXMgb24gYSBub2RlXG4gKi9cbkNvbXBpbGVyUHJvdG8uY29tcGlsZUVsZW1lbnQgPSBmdW5jdGlvbiAobm9kZSwgcm9vdCkge1xuXG4gICAgLy8gdGV4dGFyZWEgaXMgcHJldHR5IGFubm95aW5nXG4gICAgLy8gYmVjYXVzZSBpdHMgdmFsdWUgY3JlYXRlcyBjaGlsZE5vZGVzIHdoaWNoXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBjb21waWxlLlxuICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdURVhUQVJFQScgJiYgbm9kZS52YWx1ZSkge1xuICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5ldmFsKG5vZGUudmFsdWUpXG4gICAgfVxuXG4gICAgLy8gb25seSBjb21waWxlIGlmIHRoaXMgZWxlbWVudCBoYXMgYXR0cmlidXRlc1xuICAgIC8vIG9yIGl0cyB0YWdOYW1lIGNvbnRhaW5zIGEgaHlwaGVuICh3aGljaCBtZWFucyBpdCBjb3VsZFxuICAgIC8vIHBvdGVudGlhbGx5IGJlIGEgY3VzdG9tIGVsZW1lbnQpXG4gICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlcygpIHx8IG5vZGUudGFnTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXG4gICAgICAgIC8vIHNraXAgYW55dGhpbmcgd2l0aCB2LXByZVxuICAgICAgICBpZiAodXRpbHMuYXR0cihub2RlLCAncHJlJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGksIGwsIGosIGtcblxuICAgICAgICAvLyBjaGVjayBwcmlvcml0eSBkaXJlY3RpdmVzLlxuICAgICAgICAvLyBpZiBhbnkgb2YgdGhlbSBhcmUgcHJlc2VudCwgaXQgd2lsbCB0YWtlIG92ZXIgdGhlIG5vZGUgd2l0aCBhIGNoaWxkVk1cbiAgICAgICAgLy8gc28gd2UgY2FuIHNraXAgdGhlIHJlc3RcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHByaW9yaXR5RGlyZWN0aXZlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUHJpb3JpdHlEaXIocHJpb3JpdHlEaXJlY3RpdmVzW2ldLCBub2RlLCByb290KSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdHJhbnNpdGlvbiAmIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgIG5vZGUudnVlX3RyYW5zICA9IHV0aWxzLmF0dHIobm9kZSwgJ3RyYW5zaXRpb24nKVxuICAgICAgICBub2RlLnZ1ZV9hbmltICAgPSB1dGlscy5hdHRyKG5vZGUsICdhbmltYXRpb24nKVxuICAgICAgICBub2RlLnZ1ZV9lZmZlY3QgPSB0aGlzLmV2YWwodXRpbHMuYXR0cihub2RlLCAnZWZmZWN0JykpXG5cbiAgICAgICAgdmFyIHByZWZpeCA9IGNvbmZpZy5wcmVmaXggKyAnLScsXG4gICAgICAgICAgICBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzLFxuICAgICAgICAgICAgYXR0ciwgYXR0cm5hbWUsIGlzRGlyZWN0aXZlLCBleHAsIGRpcmVjdGl2ZXMsIGRpcmVjdGl2ZSwgZGlybmFtZVxuXG4gICAgICAgIC8vIHYtd2l0aCBoYXMgc3BlY2lhbCBwcmlvcml0eSBhbW9uZyB0aGUgcmVzdFxuICAgICAgICAvLyBpdCBuZWVkcyB0byBwdWxsIGluIHRoZSB2YWx1ZSBmcm9tIHRoZSBwYXJlbnQgYmVmb3JlXG4gICAgICAgIC8vIGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIGV2YWx1YXRlZCwgYmVjYXVzZSBhdCB0aGlzIHN0YWdlXG4gICAgICAgIC8vIHRoZSBjb21wdXRlZCBwcm9wZXJ0aWVzIGhhdmUgbm90IHNldCB1cCB0aGVpciBkZXBlbmRlbmNpZXMgeWV0LlxuICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIHdpdGhFeHAgPSB1dGlscy5hdHRyKG5vZGUsICd3aXRoJylcbiAgICAgICAgICAgIGlmICh3aXRoRXhwKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcyA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ3dpdGgnLCB3aXRoRXhwLCBub2RlLCB0cnVlKVxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGsgPSBkaXJlY3RpdmVzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlc1tqXSwgdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGF0dHJzID0gc2xpY2UuY2FsbChub2RlLmF0dHJpYnV0ZXMpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblxuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2ldXG4gICAgICAgICAgICBhdHRybmFtZSA9IGF0dHIubmFtZVxuICAgICAgICAgICAgaXNEaXJlY3RpdmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiAoYXR0cm5hbWUuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gYSBkaXJlY3RpdmUgLSBzcGxpdCwgcGFyc2UgYW5kIGJpbmQgaXQuXG4gICAgICAgICAgICAgICAgaXNEaXJlY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgZGlybmFtZSA9IGF0dHJuYW1lLnNsaWNlKHByZWZpeC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgd2l0aCBtdWx0aXBsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKGRpcm5hbWUsIGF0dHIudmFsdWUsIG5vZGUsIHRydWUpXG4gICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGNsYXVzZXMgKHNlcGFyYXRlZCBieSBcIixcIilcbiAgICAgICAgICAgICAgICAvLyBpbnNpZGUgZWFjaCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBrID0gZGlyZWN0aXZlcy5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZXNbal0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcuaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBub24gZGlyZWN0aXZlIGF0dHJpYnV0ZSwgY2hlY2sgaW50ZXJwb2xhdGlvbiB0YWdzXG4gICAgICAgICAgICAgICAgZXhwID0gVGV4dFBhcnNlci5wYXJzZUF0dHIoYXR0ci52YWx1ZSlcbiAgICAgICAgICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ2F0dHInLCBleHAsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5hcmcgPSBhdHRybmFtZVxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5pbmRleE9mKGF0dHJuYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIHBhcmFtIGF0dHJpYnV0ZS4uLiB3ZSBzaG91bGQgdXNlIHRoZSBwYXJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgY2lyY3VsYXIgdXBkYXRlcyBsaWtlIHNpemU9e3tzaXplfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmUsIHRoaXMucGFyZW50KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzRGlyZWN0aXZlICYmIGRpcm5hbWUgIT09ICdjbG9haycpIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRybmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gcmVjdXJzaXZlbHkgY29tcGlsZSBjaGlsZE5vZGVzXG4gICAgaWYgKG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIHNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKHRoaXMuY29tcGlsZSwgdGhpcylcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgYSB0ZXh0IG5vZGVcbiAqL1xuQ29tcGlsZXJQcm90by5jb21waWxlVGV4dE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuXG4gICAgdmFyIHRva2VucyA9IFRleHRQYXJzZXIucGFyc2Uobm9kZS5ub2RlVmFsdWUpXG4gICAgaWYgKCF0b2tlbnMpIHJldHVyblxuICAgIHZhciBlbCwgdG9rZW4sIGRpcmVjdGl2ZVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgICAgZGlyZWN0aXZlID0gbnVsbFxuXG4gICAgICAgIGlmICh0b2tlbi5rZXkpIHsgLy8gYSBiaW5kaW5nXG4gICAgICAgICAgICBpZiAodG9rZW4ua2V5LmNoYXJBdCgwKSA9PT0gJz4nKSB7IC8vIGEgcGFydGlhbFxuICAgICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgncmVmJylcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCdwYXJ0aWFsJywgdG9rZW4ua2V5LnNsaWNlKDEpLCBlbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5odG1sKSB7IC8vIHRleHQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCd0ZXh0JywgdG9rZW4ua2V5LCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBodG1sIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGNvbmZpZy5wcmVmaXggKyAnLWh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCdodG1sJywgdG9rZW4ua2V5LCBlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGEgcGxhaW4gc3RyaW5nXG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5zZXJ0IG5vZGVcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgbm9kZSlcbiAgICAgICAgLy8gYmluZCBkaXJlY3RpdmVcbiAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZSlcblxuICAgIH1cbiAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSlcbn1cblxuLyoqXG4gKiAgUGFyc2UgYSBkaXJlY3RpdmUgbmFtZS92YWx1ZSBwYWlyIGludG8gb25lIG9yIG1vcmVcbiAqICBkaXJlY3RpdmUgaW5zdGFuY2VzXG4gKi9cbkNvbXBpbGVyUHJvdG8ucGFyc2VEaXJlY3RpdmUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGVsLCBtdWx0aXBsZSkge1xuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGRlZmluaXRpb24gPSBjb21waWxlci5nZXRPcHRpb24oJ2RpcmVjdGl2ZXMnLCBuYW1lKVxuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIC8vIHBhcnNlIGludG8gQVNULWxpa2Ugb2JqZWN0c1xuICAgICAgICB2YXIgYXN0cyA9IERpcmVjdGl2ZS5wYXJzZSh2YWx1ZSlcbiAgICAgICAgcmV0dXJuIG11bHRpcGxlXG4gICAgICAgICAgICA/IGFzdHMubWFwKGJ1aWxkKVxuICAgICAgICAgICAgOiBidWlsZChhc3RzWzBdKVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZCAoYXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgRGlyZWN0aXZlKG5hbWUsIGFzdCwgZGVmaW5pdGlvbiwgY29tcGlsZXIsIGVsKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQWRkIGEgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBjb3JyZWN0IGJpbmRpbmcgJiB2aWV3bW9kZWxcbiAqL1xuQ29tcGlsZXJQcm90by5iaW5kRGlyZWN0aXZlID0gZnVuY3Rpb24gKGRpcmVjdGl2ZSwgYmluZGluZ093bmVyKSB7XG5cbiAgICBpZiAoIWRpcmVjdGl2ZSkgcmV0dXJuXG5cbiAgICAvLyBrZWVwIHRyYWNrIG9mIGl0IHNvIHdlIGNhbiB1bmJpbmQoKSBsYXRlclxuICAgIHRoaXMuZGlycy5wdXNoKGRpcmVjdGl2ZSlcblxuICAgIC8vIGZvciBlbXB0eSBvciBsaXRlcmFsIGRpcmVjdGl2ZXMsIHNpbXBseSBjYWxsIGl0cyBiaW5kKClcbiAgICAvLyBhbmQgd2UncmUgZG9uZS5cbiAgICBpZiAoZGlyZWN0aXZlLmlzRW1wdHkgfHwgZGlyZWN0aXZlLmlzTGl0ZXJhbCkge1xuICAgICAgICBpZiAoZGlyZWN0aXZlLmJpbmQpIGRpcmVjdGl2ZS5iaW5kKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlLCB3ZSBnb3QgbW9yZSB3b3JrIHRvIGRvLi4uXG4gICAgdmFyIGJpbmRpbmcsXG4gICAgICAgIGNvbXBpbGVyID0gYmluZGluZ093bmVyIHx8IHRoaXMsXG4gICAgICAgIGtleSAgICAgID0gZGlyZWN0aXZlLmtleVxuXG4gICAgaWYgKGRpcmVjdGl2ZS5pc0V4cCkge1xuICAgICAgICAvLyBleHByZXNzaW9uIGJpbmRpbmdzIGFyZSBhbHdheXMgY3JlYXRlZCBvbiBjdXJyZW50IGNvbXBpbGVyXG4gICAgICAgIGJpbmRpbmcgPSBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSwgZGlyZWN0aXZlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGxvY2F0ZSB3aGljaCBjb21waWxlciBvd25zIHRoZSBiaW5kaW5nXG4gICAgICAgIHdoaWxlIChjb21waWxlcikge1xuICAgICAgICAgICAgaWYgKGNvbXBpbGVyLmhhc0tleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21waWxlciA9IGNvbXBpbGVyIHx8IHRoaXNcbiAgICAgICAgYmluZGluZyA9IGNvbXBpbGVyLmJpbmRpbmdzW2tleV0gfHwgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgfVxuICAgIGJpbmRpbmcuZGlycy5wdXNoKGRpcmVjdGl2ZSlcbiAgICBkaXJlY3RpdmUuYmluZGluZyA9IGJpbmRpbmdcblxuICAgIHZhciB2YWx1ZSA9IGJpbmRpbmcudmFsKClcbiAgICAvLyBpbnZva2UgYmluZCBob29rIGlmIGV4aXN0c1xuICAgIGlmIChkaXJlY3RpdmUuYmluZCkge1xuICAgICAgICBkaXJlY3RpdmUuYmluZCh2YWx1ZSlcbiAgICB9XG4gICAgLy8gc2V0IGluaXRpYWwgdmFsdWVcbiAgICBkaXJlY3RpdmUuJHVwZGF0ZSh2YWx1ZSwgdHJ1ZSlcbn1cblxuLyoqXG4gKiAgQ3JlYXRlIGJpbmRpbmcgYW5kIGF0dGFjaCBnZXR0ZXIvc2V0dGVyIGZvciBhIGtleSB0byB0aGUgdmlld21vZGVsIG9iamVjdFxuICovXG5Db21waWxlclByb3RvLmNyZWF0ZUJpbmRpbmcgPSBmdW5jdGlvbiAoa2V5LCBkaXJlY3RpdmUpIHtcblxuICAgIHV0aWxzLmxvZygnICBjcmVhdGVkIGJpbmRpbmc6ICcgKyBrZXkpXG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBtZXRob2RzICA9IGNvbXBpbGVyLm9wdGlvbnMubWV0aG9kcyxcbiAgICAgICAgaXNFeHAgICAgPSBkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLmlzRXhwLFxuICAgICAgICBpc0ZuICAgICA9IChkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLmlzRm4pIHx8IChtZXRob2RzICYmIG1ldGhvZHNba2V5XSksXG4gICAgICAgIGJpbmRpbmdzID0gY29tcGlsZXIuYmluZGluZ3MsXG4gICAgICAgIGNvbXB1dGVkID0gY29tcGlsZXIub3B0aW9ucy5jb21wdXRlZCxcbiAgICAgICAgYmluZGluZyAgPSBuZXcgQmluZGluZyhjb21waWxlciwga2V5LCBpc0V4cCwgaXNGbilcblxuICAgIGlmIChpc0V4cCkge1xuICAgICAgICAvLyBleHByZXNzaW9uIGJpbmRpbmdzIGFyZSBhbm9ueW1vdXNcbiAgICAgICAgY29tcGlsZXIuZGVmaW5lRXhwKGtleSwgYmluZGluZywgZGlyZWN0aXZlKVxuICAgIH0gZWxzZSBpZiAoaXNGbikge1xuICAgICAgICBiaW5kaW5nc1trZXldID0gYmluZGluZ1xuICAgICAgICBjb21waWxlci5kZWZpbmVWbVByb3Aoa2V5LCBiaW5kaW5nLCBtZXRob2RzW2tleV0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmluZGluZ3Nba2V5XSA9IGJpbmRpbmdcbiAgICAgICAgaWYgKGJpbmRpbmcucm9vdCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBhIHJvb3QgbGV2ZWwgYmluZGluZy4gd2UgbmVlZCB0byBkZWZpbmUgZ2V0dGVyL3NldHRlcnMgZm9yIGl0LlxuICAgICAgICAgICAgaWYgKGNvbXB1dGVkICYmIGNvbXB1dGVkW2tleV0pIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlZCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlZmluZUNvbXB1dGVkKGtleSwgYmluZGluZywgY29tcHV0ZWRba2V5XSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5LmNoYXJBdCgwKSAhPT0gJyQnKSB7XG4gICAgICAgICAgICAgICAgLy8gbm9ybWFsIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgY29tcGlsZXIuZGVmaW5lRGF0YVByb3Aoa2V5LCBiaW5kaW5nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgc3RhcnQgd2l0aCAkIGFyZSBtZXRhIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAvLyB0aGV5IHNob3VsZCBiZSBrZXB0IG9uIHRoZSB2bSBidXQgbm90IGluIHRoZSBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgICAgICBjb21waWxlci5kZWZpbmVWbVByb3Aoa2V5LCBiaW5kaW5nLCBjb21waWxlci5kYXRhW2tleV0pXG4gICAgICAgICAgICAgICAgZGVsZXRlIGNvbXBpbGVyLmRhdGFba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvbXB1dGVkICYmIGNvbXB1dGVkW3V0aWxzLmJhc2VLZXkoa2V5KV0pIHtcbiAgICAgICAgICAgIC8vIG5lc3RlZCBwYXRoIG9uIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICBjb21waWxlci5kZWZpbmVFeHAoa2V5LCBiaW5kaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZW5zdXJlIHBhdGggaW4gZGF0YSBzbyB0aGF0IGNvbXB1dGVkIHByb3BlcnRpZXMgdGhhdFxuICAgICAgICAgICAgLy8gYWNjZXNzIHRoZSBwYXRoIGRvbid0IHRocm93IGFuIGVycm9yIGFuZCBjYW4gY29sbGVjdFxuICAgICAgICAgICAgLy8gZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICBPYnNlcnZlci5lbnN1cmVQYXRoKGNvbXBpbGVyLmRhdGEsIGtleSlcbiAgICAgICAgICAgIHZhciBwYXJlbnRLZXkgPSBrZXkuc2xpY2UoMCwga2V5Lmxhc3RJbmRleE9mKCcuJykpXG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdzW3BhcmVudEtleV0pIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGEgbmVzdGVkIHZhbHVlIGJpbmRpbmcsIGJ1dCB0aGUgYmluZGluZyBmb3IgaXRzIHBhcmVudFxuICAgICAgICAgICAgICAgIC8vIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldC4gV2UgYmV0dGVyIGNyZWF0ZSB0aGF0IG9uZSB0b28uXG4gICAgICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhwYXJlbnRLZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmRpbmdcbn1cblxuLyoqXG4gKiAgRGVmaW5lIHRoZSBnZXR0ZXIvc2V0dGVyIHRvIHByb3h5IGEgcm9vdC1sZXZlbFxuICogIGRhdGEgcHJvcGVydHkgb24gdGhlIFZNXG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lRGF0YVByb3AgPSBmdW5jdGlvbiAoa2V5LCBiaW5kaW5nKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgZGF0YSAgICAgPSBjb21waWxlci5kYXRhLFxuICAgICAgICBvYiAgICAgICA9IGRhdGEuX19lbWl0dGVyX19cblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUga2V5IGlzIHByZXNlbnQgaW4gZGF0YVxuICAgIC8vIHNvIGl0IGNhbiBiZSBvYnNlcnZlZFxuICAgIGlmICghKGhhc093bi5jYWxsKGRhdGEsIGtleSkpKSB7XG4gICAgICAgIGRhdGFba2V5XSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBkYXRhIG9iamVjdCBpcyBhbHJlYWR5IG9ic2VydmVkLCBidXQgdGhlIGtleVxuICAgIC8vIGlzIG5vdCBvYnNlcnZlZCwgd2UgbmVlZCB0byBhZGQgaXQgdG8gdGhlIG9ic2VydmVkIGtleXMuXG4gICAgaWYgKG9iICYmICEoaGFzT3duLmNhbGwob2IudmFsdWVzLCBrZXkpKSkge1xuICAgICAgICBPYnNlcnZlci5jb252ZXJ0S2V5KGRhdGEsIGtleSlcbiAgICB9XG5cbiAgICBiaW5kaW5nLnZhbHVlID0gZGF0YVtrZXldXG5cbiAgICBkZWYoY29tcGlsZXIudm0sIGtleSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21waWxlci5kYXRhW2tleV1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBjb21waWxlci5kYXRhW2tleV0gPSB2YWxcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICogIERlZmluZSBhIHZtIHByb3BlcnR5LCBlLmcuICRpbmRleCwgJGtleSwgb3IgbWl4aW4gbWV0aG9kc1xuICogIHdoaWNoIGFyZSBiaW5kYWJsZSBidXQgb25seSBhY2Nlc3NpYmxlIG9uIHRoZSBWTSxcbiAqICBub3QgaW4gdGhlIGRhdGEuXG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lVm1Qcm9wID0gZnVuY3Rpb24gKGtleSwgYmluZGluZywgdmFsdWUpIHtcbiAgICB2YXIgb2IgPSB0aGlzLm9ic2VydmVyXG4gICAgYmluZGluZy52YWx1ZSA9IHZhbHVlXG4gICAgZGVmKHRoaXMudm0sIGtleSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChPYnNlcnZlci5zaG91bGRHZXQpIG9iLmVtaXQoJ2dldCcsIGtleSlcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nLnZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgb2IuZW1pdCgnc2V0Jywga2V5LCB2YWwpXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqICBEZWZpbmUgYW4gZXhwcmVzc2lvbiBiaW5kaW5nLCB3aGljaCBpcyBlc3NlbnRpYWxseVxuICogIGFuIGFub255bW91cyBjb21wdXRlZCBwcm9wZXJ0eVxuICovXG5Db21waWxlclByb3RvLmRlZmluZUV4cCA9IGZ1bmN0aW9uIChrZXksIGJpbmRpbmcsIGRpcmVjdGl2ZSkge1xuICAgIHZhciBjb21wdXRlZEtleSA9IGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuY29tcHV0ZWRLZXksXG4gICAgICAgIGV4cCAgICAgICAgID0gY29tcHV0ZWRLZXkgPyBkaXJlY3RpdmUuZXhwcmVzc2lvbiA6IGtleSxcbiAgICAgICAgZ2V0dGVyICAgICAgPSB0aGlzLmV4cENhY2hlW2V4cF1cbiAgICBpZiAoIWdldHRlcikge1xuICAgICAgICBnZXR0ZXIgPSB0aGlzLmV4cENhY2hlW2V4cF0gPSBFeHBQYXJzZXIucGFyc2UoY29tcHV0ZWRLZXkgfHwga2V5LCB0aGlzKVxuICAgIH1cbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIHRoaXMubWFya0NvbXB1dGVkKGJpbmRpbmcsIGdldHRlcilcbiAgICB9XG59XG5cbi8qKlxuICogIERlZmluZSBhIGNvbXB1dGVkIHByb3BlcnR5IG9uIHRoZSBWTVxuICovXG5Db21waWxlclByb3RvLmRlZmluZUNvbXB1dGVkID0gZnVuY3Rpb24gKGtleSwgYmluZGluZywgdmFsdWUpIHtcbiAgICB0aGlzLm1hcmtDb21wdXRlZChiaW5kaW5nLCB2YWx1ZSlcbiAgICBkZWYodGhpcy52bSwga2V5LCB7XG4gICAgICAgIGdldDogYmluZGluZy52YWx1ZS4kZ2V0LFxuICAgICAgICBzZXQ6IGJpbmRpbmcudmFsdWUuJHNldFxuICAgIH0pXG59XG5cbi8qKlxuICogIFByb2Nlc3MgYSBjb21wdXRlZCBwcm9wZXJ0eSBiaW5kaW5nXG4gKiAgc28gaXRzIGdldHRlci9zZXR0ZXIgYXJlIGJvdW5kIHRvIHByb3BlciBjb250ZXh0XG4gKi9cbkNvbXBpbGVyUHJvdG8ubWFya0NvbXB1dGVkID0gZnVuY3Rpb24gKGJpbmRpbmcsIHZhbHVlKSB7XG4gICAgYmluZGluZy5pc0NvbXB1dGVkID0gdHJ1ZVxuICAgIC8vIGJpbmQgdGhlIGFjY2Vzc29ycyB0byB0aGUgdm1cbiAgICBpZiAoYmluZGluZy5pc0ZuKSB7XG4gICAgICAgIGJpbmRpbmcudmFsdWUgPSB2YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0geyAkZ2V0OiB2YWx1ZSB9XG4gICAgICAgIH1cbiAgICAgICAgYmluZGluZy52YWx1ZSA9IHtcbiAgICAgICAgICAgICRnZXQ6IHV0aWxzLmJpbmQodmFsdWUuJGdldCwgdGhpcy52bSksXG4gICAgICAgICAgICAkc2V0OiB2YWx1ZS4kc2V0XG4gICAgICAgICAgICAgICAgPyB1dGlscy5iaW5kKHZhbHVlLiRzZXQsIHRoaXMudm0pXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBrZWVwIHRyYWNrIGZvciBkZXAgcGFyc2luZyBsYXRlclxuICAgIHRoaXMuY29tcHV0ZWQucHVzaChiaW5kaW5nKVxufVxuXG4vKipcbiAqICBSZXRyaXZlIGFuIG9wdGlvbiBmcm9tIHRoZSBjb21waWxlclxuICovXG5Db21waWxlclByb3RvLmdldE9wdGlvbiA9IGZ1bmN0aW9uICh0eXBlLCBpZCwgc2lsZW50KSB7XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHBhcmVudCA9IHRoaXMucGFyZW50LFxuICAgICAgICBnbG9iYWxBc3NldHMgPSBjb25maWcuZ2xvYmFsQXNzZXRzLFxuICAgICAgICByZXMgPSAob3B0c1t0eXBlXSAmJiBvcHRzW3R5cGVdW2lkXSkgfHwgKFxuICAgICAgICAgICAgcGFyZW50XG4gICAgICAgICAgICAgICAgPyBwYXJlbnQuZ2V0T3B0aW9uKHR5cGUsIGlkLCBzaWxlbnQpXG4gICAgICAgICAgICAgICAgOiBnbG9iYWxBc3NldHNbdHlwZV0gJiYgZ2xvYmFsQXNzZXRzW3R5cGVdW2lkXVxuICAgICAgICApXG4gICAgaWYgKCFyZXMgJiYgIXNpbGVudCAmJiB0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ1Vua25vd24gJyArIHR5cGUuc2xpY2UoMCwgLTEpICsgJzogJyArIGlkKVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogIEVtaXQgbGlmZWN5Y2xlIGV2ZW50cyB0byB0cmlnZ2VyIGhvb2tzXG4gKi9cbkNvbXBpbGVyUHJvdG8uZXhlY0hvb2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudCA9ICdob29rOicgKyBldmVudFxuICAgIHRoaXMub2JzZXJ2ZXIuZW1pdChldmVudClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChldmVudClcbn1cblxuLyoqXG4gKiAgQ2hlY2sgaWYgYSBjb21waWxlcidzIGRhdGEgY29udGFpbnMgYSBrZXlwYXRoXG4gKi9cbkNvbXBpbGVyUHJvdG8uaGFzS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBiYXNlS2V5ID0gdXRpbHMuYmFzZUtleShrZXkpXG4gICAgcmV0dXJuIGhhc093bi5jYWxsKHRoaXMuZGF0YSwgYmFzZUtleSkgfHxcbiAgICAgICAgaGFzT3duLmNhbGwodGhpcy52bSwgYmFzZUtleSlcbn1cblxuLyoqXG4gKiAgRG8gYSBvbmUtdGltZSBldmFsIG9mIGEgc3RyaW5nIHRoYXQgcG90ZW50aWFsbHlcbiAqICBpbmNsdWRlcyBiaW5kaW5ncy4gSXQgYWNjZXB0cyBhZGRpdGlvbmFsIHJhdyBkYXRhXG4gKiAgYmVjYXVzZSB3ZSBuZWVkIHRvIGR5bmFtaWNhbGx5IHJlc29sdmUgdi1jb21wb25lbnRcbiAqICBiZWZvcmUgYSBjaGlsZFZNIGlzIGV2ZW4gY29tcGlsZWQuLi5cbiAqL1xuQ29tcGlsZXJQcm90by5ldmFsID0gZnVuY3Rpb24gKGV4cCwgZGF0YSkge1xuICAgIHZhciBwYXJzZWQgPSBUZXh0UGFyc2VyLnBhcnNlQXR0cihleHApXG4gICAgcmV0dXJuIHBhcnNlZFxuICAgICAgICA/IEV4cFBhcnNlci5ldmFsKHBhcnNlZCwgdGhpcywgZGF0YSlcbiAgICAgICAgOiBleHBcbn1cblxuLyoqXG4gKiAgUmVzb2x2ZSBhIENvbXBvbmVudCBjb25zdHJ1Y3RvciBmb3IgYW4gZWxlbWVudFxuICogIHdpdGggdGhlIGRhdGEgdG8gYmUgdXNlZFxuICovXG5Db21waWxlclByb3RvLnJlc29sdmVDb21wb25lbnQgPSBmdW5jdGlvbiAobm9kZSwgZGF0YSwgdGVzdCkge1xuXG4gICAgLy8gbGF0ZSByZXF1aXJlIHRvIGF2b2lkIGNpcmN1bGFyIGRlcHNcbiAgICBWaWV3TW9kZWwgPSBWaWV3TW9kZWwgfHwgcmVxdWlyZSgnLi92aWV3bW9kZWwnKVxuXG4gICAgdmFyIGV4cCAgICAgPSB1dGlscy5hdHRyKG5vZGUsICdjb21wb25lbnQnKSxcbiAgICAgICAgdGFnTmFtZSA9IG5vZGUudGFnTmFtZSxcbiAgICAgICAgaWQgICAgICA9IHRoaXMuZXZhbChleHAsIGRhdGEpLFxuICAgICAgICB0YWdJZCAgID0gKHRhZ05hbWUuaW5kZXhPZignLScpID4gMCAmJiB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICBDdG9yICAgID0gdGhpcy5nZXRPcHRpb24oJ2NvbXBvbmVudHMnLCBpZCB8fCB0YWdJZCwgdHJ1ZSlcblxuICAgIGlmIChpZCAmJiAhQ3Rvcikge1xuICAgICAgICB1dGlscy53YXJuKCdVbmtub3duIGNvbXBvbmVudDogJyArIGlkKVxuICAgIH1cblxuICAgIHJldHVybiB0ZXN0XG4gICAgICAgID8gZXhwID09PSAnJ1xuICAgICAgICAgICAgPyBWaWV3TW9kZWxcbiAgICAgICAgICAgIDogQ3RvclxuICAgICAgICA6IEN0b3IgfHwgVmlld01vZGVsXG59XG5cbi8qKlxuICogIFVuYmluZCBhbmQgcmVtb3ZlIGVsZW1lbnRcbiAqL1xuQ29tcGlsZXJQcm90by5kZXN0cm95ID0gZnVuY3Rpb24gKG5vUmVtb3ZlKSB7XG5cbiAgICAvLyBhdm9pZCBiZWluZyBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcbiAgICAvLyB0aGlzIGlzIGlycmV2ZXJzaWJsZSFcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVyblxuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgaSwgaiwga2V5LCBkaXIsIGRpcnMsIGJpbmRpbmcsXG4gICAgICAgIHZtICAgICAgICAgID0gY29tcGlsZXIudm0sXG4gICAgICAgIGVsICAgICAgICAgID0gY29tcGlsZXIuZWwsXG4gICAgICAgIGRpcmVjdGl2ZXMgID0gY29tcGlsZXIuZGlycyxcbiAgICAgICAgY29tcHV0ZWQgICAgPSBjb21waWxlci5jb21wdXRlZCxcbiAgICAgICAgYmluZGluZ3MgICAgPSBjb21waWxlci5iaW5kaW5ncyxcbiAgICAgICAgY2hpbGRyZW4gICAgPSBjb21waWxlci5jaGlsZHJlbixcbiAgICAgICAgcGFyZW50ICAgICAgPSBjb21waWxlci5wYXJlbnRcblxuICAgIGNvbXBpbGVyLmV4ZWNIb29rKCdiZWZvcmVEZXN0cm95JylcblxuICAgIC8vIHVub2JzZXJ2ZSBkYXRhXG4gICAgT2JzZXJ2ZXIudW5vYnNlcnZlKGNvbXBpbGVyLmRhdGEsICcnLCBjb21waWxlci5vYnNlcnZlcilcblxuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWxkcmVuXG4gICAgLy8gZG8gbm90IHJlbW92ZSB0aGVpciBlbGVtZW50cyBzaW5jZSB0aGUgcGFyZW50XG4gICAgLy8gbWF5IGhhdmUgdHJhbnNpdGlvbnMgYW5kIHRoZSBjaGlsZHJlbiBtYXkgbm90XG4gICAgaSA9IGNoaWxkcmVuLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY2hpbGRyZW5baV0uZGVzdHJveSh0cnVlKVxuICAgIH1cblxuICAgIC8vIHVuYmluZCBhbGwgZGlyZWNpdHZlc1xuICAgIGkgPSBkaXJlY3RpdmVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgZGlyID0gZGlyZWN0aXZlc1tpXVxuICAgICAgICAvLyBpZiB0aGlzIGRpcmVjdGl2ZSBpcyBhbiBpbnN0YW5jZSBvZiBhbiBleHRlcm5hbCBiaW5kaW5nXG4gICAgICAgIC8vIGUuZy4gYSBkaXJlY3RpdmUgdGhhdCByZWZlcnMgdG8gYSB2YXJpYWJsZSBvbiB0aGUgcGFyZW50IFZNXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gcmVtb3ZlIGl0IGZyb20gdGhhdCBiaW5kaW5nJ3MgZGlyZWN0aXZlc1xuICAgICAgICAvLyAqIGVtcHR5IGFuZCBsaXRlcmFsIGJpbmRpbmdzIGRvIG5vdCBoYXZlIGJpbmRpbmcuXG4gICAgICAgIGlmIChkaXIuYmluZGluZyAmJiBkaXIuYmluZGluZy5jb21waWxlciAhPT0gY29tcGlsZXIpIHtcbiAgICAgICAgICAgIGRpcnMgPSBkaXIuYmluZGluZy5kaXJzXG4gICAgICAgICAgICBpZiAoZGlycykge1xuICAgICAgICAgICAgICAgIGogPSBkaXJzLmluZGV4T2YoZGlyKVxuICAgICAgICAgICAgICAgIGlmIChqID4gLTEpIGRpcnMuc3BsaWNlKGosIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGlyLiR1bmJpbmQoKVxuICAgIH1cblxuICAgIC8vIHVuYmluZCBhbGwgY29tcHV0ZWQsIGFub255bW91cyBiaW5kaW5nc1xuICAgIGkgPSBjb21wdXRlZC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbXB1dGVkW2ldLnVuYmluZCgpXG4gICAgfVxuXG4gICAgLy8gdW5iaW5kIGFsbCBrZXlwYXRoIGJpbmRpbmdzXG4gICAgZm9yIChrZXkgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgYmluZGluZyA9IGJpbmRpbmdzW2tleV1cbiAgICAgICAgaWYgKGJpbmRpbmcpIHtcbiAgICAgICAgICAgIGJpbmRpbmcudW5iaW5kKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gcGFyZW50XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBqID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YoY29tcGlsZXIpXG4gICAgICAgIGlmIChqID4gLTEpIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaiwgMSlcbiAgICB9XG5cbiAgICAvLyBmaW5hbGx5IHJlbW92ZSBkb20gZWxlbWVudFxuICAgIGlmICghbm9SZW1vdmUpIHtcbiAgICAgICAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uJHJlbW92ZSgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWwudnVlX3ZtID0gbnVsbFxuXG4gICAgY29tcGlsZXIuZGVzdHJveWVkID0gdHJ1ZVxuICAgIC8vIGVtaXQgZGVzdHJveSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ2FmdGVyRGVzdHJveScpXG5cbiAgICAvLyBmaW5hbGx5LCB1bnJlZ2lzdGVyIGFsbCBsaXN0ZW5lcnNcbiAgICBjb21waWxlci5vYnNlcnZlci5vZmYoKVxuICAgIGNvbXBpbGVyLmVtaXR0ZXIub2ZmKClcbn1cblxuLy8gSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBzaG9ydGhhbmQgZm9yIGdldHRpbmcgcm9vdCBjb21waWxlclxuICovXG5mdW5jdGlvbiBnZXRSb290IChjb21waWxlcikge1xuICAgIHdoaWxlIChjb21waWxlci5wYXJlbnQpIHtcbiAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGVyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGlsZXIiLCJ2YXIgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vdGV4dC1wYXJzZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVmaXggICAgICAgICA6ICd2JyxcbiAgICBkZWJ1ZyAgICAgICAgICA6IGZhbHNlLFxuICAgIHNpbGVudCAgICAgICAgIDogZmFsc2UsXG4gICAgZW50ZXJDbGFzcyAgICAgOiAndi1lbnRlcicsXG4gICAgbGVhdmVDbGFzcyAgICAgOiAndi1sZWF2ZScsXG4gICAgaW50ZXJwb2xhdGUgICAgOiB0cnVlXG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2RlbGltaXRlcnMnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBUZXh0UGFyc2VyLmRlbGltaXRlcnNcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKGRlbGltaXRlcnMpIHtcbiAgICAgICAgVGV4dFBhcnNlci5zZXREZWxpbWl0ZXJzKGRlbGltaXRlcnMpXG4gICAgfVxufSkiLCJ2YXIgRW1pdHRlciAgPSByZXF1aXJlKCcuL2VtaXR0ZXInKSxcbiAgICB1dGlscyAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKSxcbiAgICBjYXRjaGVyICA9IG5ldyBFbWl0dGVyKClcblxuLyoqXG4gKiAgQXV0by1leHRyYWN0IHRoZSBkZXBlbmRlbmNpZXMgb2YgYSBjb21wdXRlZCBwcm9wZXJ0eVxuICogIGJ5IHJlY29yZGluZyB0aGUgZ2V0dGVycyB0cmlnZ2VyZWQgd2hlbiBldmFsdWF0aW5nIGl0LlxuICovXG5mdW5jdGlvbiBjYXRjaERlcHMgKGJpbmRpbmcpIHtcbiAgICBpZiAoYmluZGluZy5pc0ZuKSByZXR1cm5cbiAgICB1dGlscy5sb2coJ1xcbi0gJyArIGJpbmRpbmcua2V5KVxuICAgIHZhciBnb3QgPSB1dGlscy5oYXNoKClcbiAgICBiaW5kaW5nLmRlcHMgPSBbXVxuICAgIGNhdGNoZXIub24oJ2dldCcsIGZ1bmN0aW9uIChkZXApIHtcbiAgICAgICAgdmFyIGhhcyA9IGdvdFtkZXAua2V5XVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBhdm9pZCBkdXBsaWNhdGUgYmluZGluZ3NcbiAgICAgICAgICAgIChoYXMgJiYgaGFzLmNvbXBpbGVyID09PSBkZXAuY29tcGlsZXIpIHx8XG4gICAgICAgICAgICAvLyBhdm9pZCByZXBlYXRlZCBpdGVtcyBhcyBkZXBlbmRlbmN5XG4gICAgICAgICAgICAvLyBvbmx5IHdoZW4gdGhlIGJpbmRpbmcgaXMgZnJvbSBzZWxmIG9yIHRoZSBwYXJlbnQgY2hhaW5cbiAgICAgICAgICAgIChkZXAuY29tcGlsZXIucmVwZWF0ICYmICFpc1BhcmVudE9mKGRlcC5jb21waWxlciwgYmluZGluZy5jb21waWxlcikpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZ290W2RlcC5rZXldID0gZGVwXG4gICAgICAgIHV0aWxzLmxvZygnICAtICcgKyBkZXAua2V5KVxuICAgICAgICBiaW5kaW5nLmRlcHMucHVzaChkZXApXG4gICAgICAgIGRlcC5zdWJzLnB1c2goYmluZGluZylcbiAgICB9KVxuICAgIGJpbmRpbmcudmFsdWUuJGdldCgpXG4gICAgY2F0Y2hlci5vZmYoJ2dldCcpXG59XG5cbi8qKlxuICogIFRlc3QgaWYgQSBpcyBhIHBhcmVudCBvZiBvciBlcXVhbHMgQlxuICovXG5mdW5jdGlvbiBpc1BhcmVudE9mIChhLCBiKSB7XG4gICAgd2hpbGUgKGIpIHtcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgYiA9IGIucGFyZW50XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8qKlxuICAgICAqICB0aGUgb2JzZXJ2ZXIgdGhhdCBjYXRjaGVzIGV2ZW50cyB0cmlnZ2VyZWQgYnkgZ2V0dGVyc1xuICAgICAqL1xuICAgIGNhdGNoZXI6IGNhdGNoZXIsXG5cbiAgICAvKipcbiAgICAgKiAgcGFyc2UgYSBsaXN0IG9mIGNvbXB1dGVkIHByb3BlcnR5IGJpbmRpbmdzXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChiaW5kaW5ncykge1xuICAgICAgICB1dGlscy5sb2coJ1xcbnBhcnNpbmcgZGVwZW5kZW5jaWVzLi4uJylcbiAgICAgICAgT2JzZXJ2ZXIuc2hvdWxkR2V0ID0gdHJ1ZVxuICAgICAgICBiaW5kaW5ncy5mb3JFYWNoKGNhdGNoRGVwcylcbiAgICAgICAgT2JzZXJ2ZXIuc2hvdWxkR2V0ID0gZmFsc2VcbiAgICAgICAgdXRpbHMubG9nKCdcXG5kb25lLicpXG4gICAgfVxuICAgIFxufSIsInZhciBkaXJJZCAgICAgICAgICAgPSAxLFxuICAgIEFSR19SRSAgICAgICAgICA9IC9eW1xcd1xcJC1dKyQvLFxuICAgIEZJTFRFUl9UT0tFTl9SRSA9IC9bXlxccydcIl0rfCdbXiddKyd8XCJbXlwiXStcIi9nLFxuICAgIE5FU1RJTkdfUkUgICAgICA9IC9eXFwkKHBhcmVudHxyb290KVxcLi8sXG4gICAgU0lOR0xFX1ZBUl9SRSAgID0gL15bXFx3XFwuJF0rJC8sXG4gICAgUVVPVEVfUkUgICAgICAgID0gL1wiL2csXG4gICAgVGV4dFBhcnNlciAgICAgID0gcmVxdWlyZSgnLi90ZXh0LXBhcnNlcicpXG5cbi8qKlxuICogIERpcmVjdGl2ZSBjbGFzc1xuICogIHJlcHJlc2VudHMgYSBzaW5nbGUgZGlyZWN0aXZlIGluc3RhbmNlIGluIHRoZSBET01cbiAqL1xuZnVuY3Rpb24gRGlyZWN0aXZlIChuYW1lLCBhc3QsIGRlZmluaXRpb24sIGNvbXBpbGVyLCBlbCkge1xuXG4gICAgdGhpcy5pZCAgICAgICAgICAgICA9IGRpcklkKytcbiAgICB0aGlzLm5hbWUgICAgICAgICAgID0gbmFtZVxuICAgIHRoaXMuY29tcGlsZXIgICAgICAgPSBjb21waWxlclxuICAgIHRoaXMudm0gICAgICAgICAgICAgPSBjb21waWxlci52bVxuICAgIHRoaXMuZWwgICAgICAgICAgICAgPSBlbFxuICAgIHRoaXMuY29tcHV0ZUZpbHRlcnMgPSBmYWxzZVxuICAgIHRoaXMua2V5ICAgICAgICAgICAgPSBhc3Qua2V5XG4gICAgdGhpcy5hcmcgICAgICAgICAgICA9IGFzdC5hcmdcbiAgICB0aGlzLmV4cHJlc3Npb24gICAgID0gYXN0LmV4cHJlc3Npb25cblxuICAgIHZhciBpc0VtcHR5ID0gdGhpcy5leHByZXNzaW9uID09PSAnJ1xuXG4gICAgLy8gbWl4IGluIHByb3BlcnRpZXMgZnJvbSB0aGUgZGlyZWN0aXZlIGRlZmluaXRpb25cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1tpc0VtcHR5ID8gJ2JpbmQnIDogJ3VwZGF0ZSddID0gZGVmaW5pdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgdGhpc1twcm9wXSA9IGRlZmluaXRpb25bcHJvcF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVtcHR5IGV4cHJlc3Npb24sIHdlJ3JlIGRvbmUuXG4gICAgaWYgKGlzRW1wdHkgfHwgdGhpcy5pc0VtcHR5KSB7XG4gICAgICAgIHRoaXMuaXNFbXB0eSA9IHRydWVcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKFRleHRQYXJzZXIuUmVnZXgudGVzdCh0aGlzLmtleSkpIHtcbiAgICAgICAgdGhpcy5rZXkgPSBjb21waWxlci5ldmFsKHRoaXMua2V5KVxuICAgICAgICBpZiAodGhpcy5pc0xpdGVyYWwpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMua2V5XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZmlsdGVycyA9IGFzdC5maWx0ZXJzLFxuICAgICAgICBmaWx0ZXIsIGZuLCBpLCBsLCBjb21wdXRlZFxuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyc1tpXVxuICAgICAgICAgICAgZm4gPSB0aGlzLmNvbXBpbGVyLmdldE9wdGlvbignZmlsdGVycycsIGZpbHRlci5uYW1lKVxuICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyLmFwcGx5ID0gZm5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcnMucHVzaChmaWx0ZXIpXG4gICAgICAgICAgICAgICAgaWYgKGZuLmNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5maWx0ZXJzIHx8ICF0aGlzLmZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlZEtleSA9IERpcmVjdGl2ZS5pbmxpbmVGaWx0ZXJzKHRoaXMua2V5LCB0aGlzLmZpbHRlcnMpXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLmlzRXhwID1cbiAgICAgICAgY29tcHV0ZWQgfHxcbiAgICAgICAgIVNJTkdMRV9WQVJfUkUudGVzdCh0aGlzLmtleSkgfHxcbiAgICAgICAgTkVTVElOR19SRS50ZXN0KHRoaXMua2V5KVxuXG59XG5cbnZhciBEaXJQcm90byA9IERpcmVjdGl2ZS5wcm90b3R5cGVcblxuLyoqXG4gKiAgY2FsbGVkIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2V0IFxuICogIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzLCB0aGlzIHdpbGwgb25seSBiZSBjYWxsZWQgb25jZVxuICogIGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAqL1xuRGlyUHJvdG8uJHVwZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgaW5pdCkge1xuICAgIGlmICh0aGlzLiRsb2NrKSByZXR1cm5cbiAgICBpZiAoaW5pdCB8fCB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJzICYmICF0aGlzLmNvbXB1dGVGaWx0ZXJzXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy4kYXBwbHlGaWx0ZXJzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGluaXRcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgcGlwZSB0aGUgdmFsdWUgdGhyb3VnaCBmaWx0ZXJzXG4gKi9cbkRpclByb3RvLiRhcHBseUZpbHRlcnMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgZmlsdGVyZWQgPSB2YWx1ZSwgZmlsdGVyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGZpbHRlciA9IHRoaXMuZmlsdGVyc1tpXVxuICAgICAgICBmaWx0ZXJlZCA9IGZpbHRlci5hcHBseS5hcHBseSh0aGlzLnZtLCBbZmlsdGVyZWRdLmNvbmNhdChmaWx0ZXIuYXJncykpXG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZFxufVxuXG4vKipcbiAqICBVbmJpbmQgZGlyZXRpdmVcbiAqL1xuRGlyUHJvdG8uJHVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0aGlzIGNhbiBiZSBjYWxsZWQgYmVmb3JlIHRoZSBlbCBpcyBldmVuIGFzc2lnbmVkLi4uXG4gICAgaWYgKCF0aGlzLmVsIHx8ICF0aGlzLnZtKSByZXR1cm5cbiAgICBpZiAodGhpcy51bmJpbmQpIHRoaXMudW5iaW5kKClcbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuYmluZGluZyA9IHRoaXMuY29tcGlsZXIgPSBudWxsXG59XG5cbi8vIEV4cG9zZWQgc3RhdGljIG1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgUGFyc2UgYSBkaXJlY3RpdmUgc3RyaW5nIGludG8gYW4gQXJyYXkgb2ZcbiAqICBBU1QtbGlrZSBvYmplY3RzIHJlcHJlc2VudGluZyBkaXJlY3RpdmVzXG4gKi9cbkRpcmVjdGl2ZS5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcblxuICAgIHZhciBpblNpbmdsZSA9IGZhbHNlLFxuICAgICAgICBpbkRvdWJsZSA9IGZhbHNlLFxuICAgICAgICBjdXJseSAgICA9IDAsXG4gICAgICAgIHNxdWFyZSAgID0gMCxcbiAgICAgICAgcGFyZW4gICAgPSAwLFxuICAgICAgICBiZWdpbiAgICA9IDAsXG4gICAgICAgIGFyZ0luZGV4ID0gMCxcbiAgICAgICAgZGlycyAgICAgPSBbXSxcbiAgICAgICAgZGlyICAgICAgPSB7fSxcbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gMCxcbiAgICAgICAgYXJnXG5cbiAgICBmb3IgKHZhciBjLCBpID0gMCwgbCA9IHN0ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgYyA9IHN0ci5jaGFyQXQoaSlcbiAgICAgICAgaWYgKGluU2luZ2xlKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBzaW5nbGUgcXVvdGVcbiAgICAgICAgICAgIGlmIChjID09PSBcIidcIikgaW5TaW5nbGUgPSAhaW5TaW5nbGVcbiAgICAgICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgZG91YmxlIHF1b3RlXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1wiJykgaW5Eb3VibGUgPSAhaW5Eb3VibGVcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnLCcgJiYgIXBhcmVuICYmICFjdXJseSAmJiAhc3F1YXJlKSB7XG4gICAgICAgICAgICAvLyByZWFjaGVkIHRoZSBlbmQgb2YgYSBkaXJlY3RpdmVcbiAgICAgICAgICAgIHB1c2hEaXIoKVxuICAgICAgICAgICAgLy8gcmVzZXQgJiBza2lwIHRoZSBjb21tYVxuICAgICAgICAgICAgZGlyID0ge31cbiAgICAgICAgICAgIGJlZ2luID0gYXJnSW5kZXggPSBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc6JyAmJiAhZGlyLmtleSAmJiAhZGlyLmFyZykge1xuICAgICAgICAgICAgLy8gYXJndW1lbnRcbiAgICAgICAgICAgIGFyZyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAgICAgICBpZiAoQVJHX1JFLnRlc3QoYXJnKSkge1xuICAgICAgICAgICAgICAgIGFyZ0luZGV4ID0gaSArIDFcbiAgICAgICAgICAgICAgICBkaXIuYXJnID0gYXJnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ3wnICYmIHN0ci5jaGFyQXQoaSArIDEpICE9PSAnfCcgJiYgc3RyLmNoYXJBdChpIC0gMSkgIT09ICd8Jykge1xuICAgICAgICAgICAgaWYgKGRpci5rZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGZpbHRlciwgZW5kIG9mIGtleVxuICAgICAgICAgICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgICAgICAgICAgICAgZGlyLmtleSA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgaGFzIGZpbHRlclxuICAgICAgICAgICAgICAgIHB1c2hGaWx0ZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICdcIicpIHtcbiAgICAgICAgICAgIGluRG91YmxlID0gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICBpblNpbmdsZSA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnKCcpIHtcbiAgICAgICAgICAgIHBhcmVuKytcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnKScpIHtcbiAgICAgICAgICAgIHBhcmVuLS1cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnWycpIHtcbiAgICAgICAgICAgIHNxdWFyZSsrXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ10nKSB7XG4gICAgICAgICAgICBzcXVhcmUtLVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd7Jykge1xuICAgICAgICAgICAgY3VybHkrK1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd9Jykge1xuICAgICAgICAgICAgY3VybHktLVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpID09PSAwIHx8IGJlZ2luICE9PSBpKSB7XG4gICAgICAgIHB1c2hEaXIoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHB1c2hEaXIgKCkge1xuICAgICAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAgIGlmIChkaXIua2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRpci5rZXkgPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICAgICAgICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gYmVnaW4pIHtcbiAgICAgICAgICAgIHB1c2hGaWx0ZXIoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAwIHx8IGRpci5rZXkpIHtcbiAgICAgICAgICAgIGRpcnMucHVzaChkaXIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoRmlsdGVyICgpIHtcbiAgICAgICAgdmFyIGV4cCA9IHN0ci5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKSxcbiAgICAgICAgICAgIGZpbHRlclxuICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7fVxuICAgICAgICAgICAgdmFyIHRva2VucyA9IGV4cC5tYXRjaChGSUxURVJfVE9LRU5fUkUpXG4gICAgICAgICAgICBmaWx0ZXIubmFtZSA9IHRva2Vuc1swXVxuICAgICAgICAgICAgZmlsdGVyLmFyZ3MgPSB0b2tlbnMubGVuZ3RoID4gMSA/IHRva2Vucy5zbGljZSgxKSA6IG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAoZGlyLmZpbHRlcnMgPSBkaXIuZmlsdGVycyB8fCBbXSkucHVzaChmaWx0ZXIpXG4gICAgICAgIH1cbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyc1xufVxuXG4vKipcbiAqICBJbmxpbmUgY29tcHV0ZWQgZmlsdGVycyBzbyB0aGV5IGJlY29tZSBwYXJ0XG4gKiAgb2YgdGhlIGV4cHJlc3Npb25cbiAqL1xuRGlyZWN0aXZlLmlubGluZUZpbHRlcnMgPSBmdW5jdGlvbiAoa2V5LCBmaWx0ZXJzKSB7XG4gICAgdmFyIGFyZ3MsIGZpbHRlclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgZmlsdGVyID0gZmlsdGVyc1tpXVxuICAgICAgICBhcmdzID0gZmlsdGVyLmFyZ3NcbiAgICAgICAgICAgID8gJyxcIicgKyBmaWx0ZXIuYXJncy5tYXAoZXNjYXBlUXVvdGUpLmpvaW4oJ1wiLFwiJykgKyAnXCInXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgIGtleSA9ICd0aGlzLiRjb21waWxlci5nZXRPcHRpb24oXCJmaWx0ZXJzXCIsIFwiJyArXG4gICAgICAgICAgICAgICAgZmlsdGVyLm5hbWUgK1xuICAgICAgICAgICAgJ1wiKS5jYWxsKHRoaXMsJyArXG4gICAgICAgICAgICAgICAga2V5ICsgYXJncyArXG4gICAgICAgICAgICAnKSdcbiAgICB9XG4gICAgcmV0dXJuIGtleVxufVxuXG4vKipcbiAqICBDb252ZXJ0IGRvdWJsZSBxdW90ZXMgdG8gc2luZ2xlIHF1b3Rlc1xuICogIHNvIHRoZXkgZG9uJ3QgbWVzcyB1cCB0aGUgZ2VuZXJhdGVkIGZ1bmN0aW9uIGJvZHlcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUXVvdGUgKHYpIHtcbiAgICByZXR1cm4gdi5pbmRleE9mKCdcIicpID4gLTFcbiAgICAgICAgPyB2LnJlcGxhY2UoUVVPVEVfUkUsICdcXCcnKVxuICAgICAgICA6IHZcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmUiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIHNsaWNlID0gW10uc2xpY2VcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgaW5uZXJIVE1MXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBhIGNvbW1lbnQgbm9kZSBtZWFucyB0aGlzIGlzIGEgYmluZGluZyBmb3JcbiAgICAgICAgLy8ge3t7IGlubGluZSB1bmVzY2FwZWQgaHRtbCB9fX1cbiAgICAgICAgaWYgKHRoaXMuZWwubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgICAgICAgIC8vIGhvbGQgbm9kZXNcbiAgICAgICAgICAgIHRoaXMubm9kZXMgPSBbXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdXRpbHMuZ3VhcmQodmFsdWUpXG4gICAgICAgIGlmICh0aGlzLm5vZGVzKSB7XG4gICAgICAgICAgICB0aGlzLnN3YXAodmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3dhcDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmVsLnBhcmVudE5vZGUsXG4gICAgICAgICAgICBub2RlcyAgPSB0aGlzLm5vZGVzLFxuICAgICAgICAgICAgaSAgICAgID0gbm9kZXMubGVuZ3RoXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgbm9kZXNcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGVzW2ldKVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnZlcnQgbmV3IHZhbHVlIHRvIGEgZnJhZ21lbnRcbiAgICAgICAgdmFyIGZyYWcgPSB1dGlscy50b0ZyYWdtZW50KHZhbHVlKVxuICAgICAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIHRvIHRoZXNlIG5vZGVzIHNvIHdlIGNhbiByZW1vdmUgbGF0ZXJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHNsaWNlLmNhbGwoZnJhZy5jaGlsZE5vZGVzKVxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGZyYWcsIHRoaXMuZWwpXG4gICAgfVxufSIsInZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgTWFuYWdlcyBhIGNvbmRpdGlvbmFsIGNoaWxkIFZNXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB0aGlzLmVsLnBhcmVudE5vZGVcbiAgICAgICAgdGhpcy5yZWYgICAgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2dWUtaWYnKVxuICAgICAgICB0aGlzLkN0b3IgICA9IHRoaXMuY29tcGlsZXIucmVzb2x2ZUNvbXBvbmVudCh0aGlzLmVsKVxuXG4gICAgICAgIC8vIGluc2VydCByZWZcbiAgICAgICAgdGhpcy5wYXJlbnQuaW5zZXJ0QmVmb3JlKHRoaXMucmVmLCB0aGlzLmVsKVxuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLmVsKVxuXG4gICAgICAgIGlmICh1dGlscy5hdHRyKHRoaXMuZWwsICd2aWV3JykpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oXG4gICAgICAgICAgICAgICAgJ0NvbmZsaWN0OiB2LWlmIGNhbm5vdCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggdi12aWV3LiAnICtcbiAgICAgICAgICAgICAgICAnSnVzdCBzZXQgdi12aWV3XFwncyBiaW5kaW5nIHZhbHVlIHRvIGVtcHR5IHN0cmluZyB0byBlbXB0eSBpdC4nXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzLmF0dHIodGhpcy5lbCwgJ3JlcGVhdCcpKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKFxuICAgICAgICAgICAgICAgICdDb25mbGljdDogdi1pZiBjYW5ub3QgYmUgdXNlZCB0b2dldGhlciB3aXRoIHYtcmVwZWF0LiAnICtcbiAgICAgICAgICAgICAgICAnVXNlIGB2LXNob3dgIG9yIHRoZSBgZmlsdGVyQnlgIGZpbHRlciBpbnN0ZWFkLidcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKClcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0gPSBuZXcgdGhpcy5DdG9yKHtcbiAgICAgICAgICAgICAgICBlbDogdGhpcy5lbC5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLmNoaWxkVk0uJGVsLCB0aGlzLnJlZilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGRlc3Ryb3koKVxuICAgICAgICAgICAgdGhpcy5jaGlsZFZNID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxufSIsInZhciB1dGlscyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcbiAgICBjb25maWcgICAgID0gcmVxdWlyZSgnLi4vY29uZmlnJyksXG4gICAgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4uL3RyYW5zaXRpb24nKSxcbiAgICBkaXJlY3RpdmVzID0gbW9kdWxlLmV4cG9ydHMgPSB1dGlscy5oYXNoKClcblxuLyoqXG4gKiAgTmVzdCBhbmQgbWFuYWdlIGEgQ2hpbGQgVk1cbiAqL1xuZGlyZWN0aXZlcy5jb21wb25lbnQgPSB7XG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsLnZ1ZV92bSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNID0gbmV3IHRoaXMuQ3Rvcih7XG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuZWwsXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRkZXN0cm95KClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQmluZGluZyBIVE1MIGF0dHJpYnV0ZXNcbiAqL1xuZGlyZWN0aXZlcy5hdHRyID0ge1xuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMudm0uJG9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzXG4gICAgICAgIHRoaXMuaXNQYXJhbSA9IHBhcmFtcyAmJiBwYXJhbXMuaW5kZXhPZih0aGlzLmFyZykgPiAtMVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSh0aGlzLmFyZywgdmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmFyZylcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1BhcmFtKSB7XG4gICAgICAgICAgICB0aGlzLnZtW3RoaXMuYXJnXSA9IHV0aWxzLmNoZWNrTnVtYmVyKHZhbHVlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBCaW5kaW5nIHRleHRDb250ZW50XG4gKi9cbmRpcmVjdGl2ZXMudGV4dCA9IHtcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYXR0ciA9IHRoaXMuZWwubm9kZVR5cGUgPT09IDNcbiAgICAgICAgICAgID8gJ25vZGVWYWx1ZSdcbiAgICAgICAgICAgIDogJ3RleHRDb250ZW50J1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbFt0aGlzLmF0dHJdID0gdXRpbHMuZ3VhcmQodmFsdWUpXG4gICAgfVxufVxuXG4vKipcbiAqICBCaW5kaW5nIENTUyBkaXNwbGF5IHByb3BlcnR5XG4gKi9cbmRpcmVjdGl2ZXMuc2hvdyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICAgIHRhcmdldCA9IHZhbHVlID8gJycgOiAnbm9uZScsXG4gICAgICAgIGNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB0YXJnZXRcbiAgICAgICAgfVxuICAgIHRyYW5zaXRpb24oZWwsIHZhbHVlID8gMSA6IC0xLCBjaGFuZ2UsIHRoaXMuY29tcGlsZXIpXG59XG5cbi8qKlxuICogIEJpbmRpbmcgQ1NTIGNsYXNzZXNcbiAqL1xuZGlyZWN0aXZlc1snY2xhc3MnXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgICB1dGlsc1t2YWx1ZSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSh0aGlzLmVsLCB0aGlzLmFyZylcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0VmFsKSB7XG4gICAgICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyh0aGlzLmVsLCB0aGlzLmxhc3RWYWwpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB1dGlscy5hZGRDbGFzcyh0aGlzLmVsLCB2YWx1ZSlcbiAgICAgICAgICAgIHRoaXMubGFzdFZhbCA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIE9ubHkgcmVtb3ZlZCBhZnRlciB0aGUgb3duZXIgVk0gaXMgcmVhZHlcbiAqL1xuZGlyZWN0aXZlcy5jbG9hayA9IHtcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgICB0aGlzLmNvbXBpbGVyLm9ic2VydmVyLm9uY2UoJ2hvb2s6cmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArICctY2xvYWsnKVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuLyoqXG4gKiAgU3RvcmUgYSByZWZlcmVuY2UgdG8gc2VsZiBpbiBwYXJlbnQgVk0ncyAkXG4gKi9cbmRpcmVjdGl2ZXMucmVmID0ge1xuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvblxuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHRoaXMudm0uJHBhcmVudC4kW2lkXSA9IHRoaXMudm1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvblxuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZtLiRwYXJlbnQuJFtpZF1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZGlyZWN0aXZlcy5vbiAgICAgID0gcmVxdWlyZSgnLi9vbicpXG5kaXJlY3RpdmVzLnJlcGVhdCAgPSByZXF1aXJlKCcuL3JlcGVhdCcpXG5kaXJlY3RpdmVzLm1vZGVsICAgPSByZXF1aXJlKCcuL21vZGVsJylcbmRpcmVjdGl2ZXNbJ2lmJ10gICA9IHJlcXVpcmUoJy4vaWYnKVxuZGlyZWN0aXZlc1snd2l0aCddID0gcmVxdWlyZSgnLi93aXRoJylcbmRpcmVjdGl2ZXMuaHRtbCAgICA9IHJlcXVpcmUoJy4vaHRtbCcpXG5kaXJlY3RpdmVzLnN0eWxlICAgPSByZXF1aXJlKCcuL3N0eWxlJylcbmRpcmVjdGl2ZXMucGFydGlhbCA9IHJlcXVpcmUoJy4vcGFydGlhbCcpXG5kaXJlY3RpdmVzLnZpZXcgICAgPSByZXF1aXJlKCcuL3ZpZXcnKSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXG4gICAgaXNJRTkgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgOS4wJykgPiAwLFxuICAgIGZpbHRlciA9IFtdLmZpbHRlclxuXG4vKipcbiAqICBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBmcm9tIGEgbXVsdGlwbGUgc2VsZWN0XG4gKi9cbmZ1bmN0aW9uIGdldE11bHRpcGxlU2VsZWN0T3B0aW9ucyAoc2VsZWN0KSB7XG4gICAgcmV0dXJuIGZpbHRlclxuICAgICAgICAuY2FsbChzZWxlY3Qub3B0aW9ucywgZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi5zZWxlY3RlZFxuICAgICAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHRcbiAgICAgICAgfSlcbn1cblxuLyoqXG4gKiAgVHdvLXdheSBiaW5kaW5nIGZvciBmb3JtIGlucHV0IGVsZW1lbnRzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGVsICAgPSBzZWxmLmVsLFxuICAgICAgICAgICAgdHlwZSA9IGVsLnR5cGUsXG4gICAgICAgICAgICB0YWcgID0gZWwudGFnTmFtZVxuXG4gICAgICAgIHNlbGYubG9jayA9IGZhbHNlXG4gICAgICAgIHNlbGYub3duZXJWTSA9IHNlbGYuYmluZGluZy5jb21waWxlci52bVxuXG4gICAgICAgIC8vIGRldGVybWluZSB3aGF0IGV2ZW50IHRvIGxpc3RlbiB0b1xuICAgICAgICBzZWxmLmV2ZW50ID1cbiAgICAgICAgICAgIChzZWxmLmNvbXBpbGVyLm9wdGlvbnMubGF6eSB8fFxuICAgICAgICAgICAgdGFnID09PSAnU0VMRUNUJyB8fFxuICAgICAgICAgICAgdHlwZSA9PT0gJ2NoZWNrYm94JyB8fCB0eXBlID09PSAncmFkaW8nKVxuICAgICAgICAgICAgICAgID8gJ2NoYW5nZSdcbiAgICAgICAgICAgICAgICA6ICdpbnB1dCdcblxuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIGF0dHJpYnV0ZSB0byBjaGFuZ2Ugd2hlbiB1cGRhdGluZ1xuICAgICAgICBzZWxmLmF0dHIgPSB0eXBlID09PSAnY2hlY2tib3gnXG4gICAgICAgICAgICA/ICdjaGVja2VkJ1xuICAgICAgICAgICAgOiAodGFnID09PSAnSU5QVVQnIHx8IHRhZyA9PT0gJ1NFTEVDVCcgfHwgdGFnID09PSAnVEVYVEFSRUEnKVxuICAgICAgICAgICAgICAgID8gJ3ZhbHVlJ1xuICAgICAgICAgICAgICAgIDogJ2lubmVySFRNTCdcblxuICAgICAgICAvLyBzZWxlY3RbbXVsdGlwbGVdIHN1cHBvcnRcbiAgICAgICAgaWYodGFnID09PSAnU0VMRUNUJyAmJiBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGkgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9zaXRpb25Mb2NrID0gZmFsc2VcbiAgICAgICAgc2VsZi5jTG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uTG9jayA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmNVbmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21wb3NpdGlvbkxvY2sgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNMb2NrKVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY1VubG9jaylcblxuICAgICAgICAvLyBhdHRhY2ggbGlzdGVuZXJcbiAgICAgICAgc2VsZi5zZXQgPSBzZWxmLmZpbHRlcnNcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb3NpdGlvbkxvY2spIHJldHVyblxuICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgZGlyZWN0aXZlIGhhcyBmaWx0ZXJzXG4gICAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBsZXQgdGhlIHZtLiRzZXQgdHJpZ2dlclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSgpIHNvIGZpbHRlcnMgYXJlIGFwcGxpZWQuXG4gICAgICAgICAgICAgICAgLy8gdGhlcmVmb3JlIHdlIGhhdmUgdG8gcmVjb3JkIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgYWZ0ZXIgdm0uJHNldCBjaGFuZ2VzIHRoZSBpbnB1dFxuICAgICAgICAgICAgICAgIC8vIHZhbHVlIHdlIGNhbiBwdXQgdGhlIGN1cnNvciBiYWNrIGF0IHdoZXJlIGl0IGlzXG4gICAgICAgICAgICAgICAgdmFyIGN1cnNvclBvc1xuICAgICAgICAgICAgICAgIHRyeSB7IGN1cnNvclBvcyA9IGVsLnNlbGVjdGlvblN0YXJ0IH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9zZXQoKVxuXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgdXBkYXRlcyBhcmUgYXN5bmNcbiAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHJlc2V0IGN1cnNvciBwb3NpdGlvbiBhc3luYyB0b29cbiAgICAgICAgICAgICAgICB1dGlscy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJzb3JQb3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvc2l0aW9uTG9jaykgcmV0dXJuXG4gICAgICAgICAgICAgICAgLy8gbm8gZmlsdGVycywgZG9uJ3QgbGV0IGl0IHRyaWdnZXIgdXBkYXRlKClcbiAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICBzZWxmLl9zZXQoKVxuXG4gICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoc2VsZi5ldmVudCwgc2VsZi5zZXQpXG5cbiAgICAgICAgLy8gZml4IHNoaXQgZm9yIElFOVxuICAgICAgICAvLyBzaW5jZSBpdCBkb2Vzbid0IGZpcmUgaW5wdXQgb24gYmFja3NwYWNlIC8gZGVsIC8gY3V0XG4gICAgICAgIGlmIChpc0lFOSkge1xuICAgICAgICAgICAgc2VsZi5vbkN1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjdXQgZXZlbnQgZmlyZXMgYmVmb3JlIHRoZSB2YWx1ZSBhY3R1YWxseSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYub25EZWwgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQ2IHx8IGUua2V5Q29kZSA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY3V0Jywgc2VsZi5vbkN1dClcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc2VsZi5vbkRlbClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3duZXJWTS4kc2V0KFxuICAgICAgICAgICAgdGhpcy5rZXksIHRoaXMubXVsdGlcbiAgICAgICAgICAgICAgICA/IGdldE11bHRpcGxlU2VsZWN0T3B0aW9ucyh0aGlzLmVsKVxuICAgICAgICAgICAgICAgIDogdGhpcy5lbFt0aGlzLmF0dHJdXG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUsIGluaXQpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgLy8gc3luYyBiYWNrIGlubGluZSB2YWx1ZSBpZiBpbml0aWFsIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgIGlmIChpbml0ICYmIHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXQoKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxvY2spIHJldHVyblxuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICAgIGlmIChlbC50YWdOYW1lID09PSAnU0VMRUNUJykgeyAvLyBzZWxlY3QgZHJvcGRvd25cbiAgICAgICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICAgICAgaWYodGhpcy5tdWx0aSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2godGhpcy51cGRhdGVTZWxlY3QsIHRoaXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0KHZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHsgLy8gcmFkaW8gYnV0dG9uXG4gICAgICAgICAgICBlbC5jaGVja2VkID0gdmFsdWUgPT0gZWwudmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChlbC50eXBlID09PSAnY2hlY2tib3gnKSB7IC8vIGNoZWNrYm94XG4gICAgICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxbdGhpcy5hdHRyXSA9IHV0aWxzLmd1YXJkKHZhbHVlKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNlbGVjdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIC8vIHNldHRpbmcgPHNlbGVjdD4ncyB2YWx1ZSBpbiBJRTkgZG9lc24ndCB3b3JrXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gbWFudWFsbHkgbG9vcCB0aHJvdWdoIHRoZSBvcHRpb25zXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5lbC5vcHRpb25zLFxuICAgICAgICAgICAgaSA9IG9wdGlvbnMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zW2ldLnZhbHVlID09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tpXS5zZWxlY3RlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5ldmVudCwgdGhpcy5zZXQpXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNMb2NrKVxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY1VubG9jaylcbiAgICAgICAgaWYgKGlzSUU5KSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjdXQnLCB0aGlzLm9uQ3V0KVxuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgICAgICB9XG4gICAgfVxufSIsInZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgaXNGbjogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5iaW5kaW5nLmlzRXhwXG4gICAgICAgICAgICA/IHRoaXMudm1cbiAgICAgICAgICAgIDogdGhpcy5iaW5kaW5nLmNvbXBpbGVyLnZtXG4gICAgICAgIGlmICh0aGlzLmVsLnRhZ05hbWUgPT09ICdJRlJBTUUnICYmIHRoaXMuYXJnICE9PSAnbG9hZCcpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVCaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY29udGVudFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKHNlbGYuYXJnLCBzZWxmLmhhbmRsZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLmlmcmFtZUJpbmQpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oJ0RpcmVjdGl2ZSBcInYtb246JyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBleHBlY3RzIGEgbWV0aG9kLicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0KClcbiAgICAgICAgdmFyIHZtID0gdGhpcy52bSxcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzLmNvbnRleHRcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUudGFyZ2V0Vk0gPSB2bVxuICAgICAgICAgICAgY29udGV4dC4kZXZlbnQgPSBlXG4gICAgICAgICAgICB2YXIgcmVzID0gaGFuZGxlci5jYWxsKGNvbnRleHQsIGUpXG4gICAgICAgICAgICBjb250ZXh0LiRldmVudCA9IG51bGxcbiAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pZnJhbWVCaW5kKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZUJpbmQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5pZnJhbWVCaW5kXG4gICAgICAgICAgICA/IHRoaXMuZWwuY29udGVudFdpbmRvd1xuICAgICAgICAgICAgOiB0aGlzLmVsXG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5hcmcsIHRoaXMuaGFuZGxlcilcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICB9XG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBwYXJ0aWFsc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb25cbiAgICAgICAgaWYgKCFpZCkgcmV0dXJuXG5cbiAgICAgICAgdmFyIGVsICAgICAgID0gdGhpcy5lbCxcbiAgICAgICAgICAgIGNvbXBpbGVyID0gdGhpcy5jb21waWxlcixcbiAgICAgICAgICAgIHBhcnRpYWwgID0gY29tcGlsZXIuZ2V0T3B0aW9uKCdwYXJ0aWFscycsIGlkKVxuXG4gICAgICAgIGlmICghcGFydGlhbCkge1xuICAgICAgICAgICAgaWYgKGlkID09PSAneWllbGQnKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMud2Fybigne3s+eWllbGR9fSBzeW50YXggaGFzIGJlZW4gZGVwcmVjYXRlZC4gVXNlIDxjb250ZW50PiB0YWcgaW5zdGVhZC4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBwYXJ0aWFsID0gcGFydGlhbC5jbG9uZU5vZGUodHJ1ZSlcblxuICAgICAgICAvLyBjb21tZW50IHJlZiBub2RlIG1lYW5zIGlubGluZSBwYXJ0aWFsXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSA9PT0gOCkge1xuXG4gICAgICAgICAgICAvLyBrZWVwIGEgcmVmIGZvciB0aGUgcGFydGlhbCdzIGNvbnRlbnQgbm9kZXNcbiAgICAgICAgICAgIHZhciBub2RlcyA9IFtdLnNsaWNlLmNhbGwocGFydGlhbC5jaGlsZE5vZGVzKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBlbC5wYXJlbnROb2RlXG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHBhcnRpYWwsIGVsKVxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICAgICAgLy8gY29tcGlsZSBwYXJ0aWFsIGFmdGVyIGFwcGVuZGluZywgYmVjYXVzZSBpdHMgY2hpbGRyZW4ncyBwYXJlbnROb2RlXG4gICAgICAgICAgICAvLyB3aWxsIGNoYW5nZSBmcm9tIHRoZSBmcmFnbWVudCB0byB0aGUgY29ycmVjdCBwYXJlbnROb2RlLlxuICAgICAgICAgICAgLy8gVGhpcyBjb3VsZCBhZmZlY3QgZGlyZWN0aXZlcyB0aGF0IG5lZWQgYWNjZXNzIHRvIGl0cyBlbGVtZW50J3MgcGFyZW50Tm9kZS5cbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goY29tcGlsZXIuY29tcGlsZSwgY29tcGlsZXIpXG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8ganVzdCBzZXQgaW5uZXJIVE1MLi4uXG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocGFydGlhbClcblxuICAgICAgICB9XG4gICAgfVxuXG59IiwidmFyIHV0aWxzICAgICAgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIGNvbmZpZyAgICAgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqICBCaW5kaW5nIHRoYXQgbWFuYWdlcyBWTXMgYmFzZWQgb24gYW4gQXJyYXlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5pZGVudGlmaWVyID0gJyRyJyArIHRoaXMuaWRcblxuICAgICAgICAvLyBhIGhhc2ggdG8gY2FjaGUgdGhlIHNhbWUgZXhwcmVzc2lvbnMgb24gcmVwZWF0ZWQgaW5zdGFuY2VzXG4gICAgICAgIC8vIHNvIHRoZXkgZG9uJ3QgaGF2ZSB0byBiZSBjb21waWxlZCBmb3IgZXZlcnkgc2luZ2xlIGluc3RhbmNlXG4gICAgICAgIHRoaXMuZXhwQ2FjaGUgPSB1dGlscy5oYXNoKClcblxuICAgICAgICB2YXIgZWwgICA9IHRoaXMuZWwsXG4gICAgICAgICAgICBjdG4gID0gdGhpcy5jb250YWluZXIgPSBlbC5wYXJlbnROb2RlXG5cbiAgICAgICAgLy8gZXh0cmFjdCBjaGlsZCBJZCwgaWYgYW55XG4gICAgICAgIHRoaXMuY2hpbGRJZCA9IHRoaXMuY29tcGlsZXIuZXZhbCh1dGlscy5hdHRyKGVsLCAncmVmJykpXG5cbiAgICAgICAgLy8gY3JlYXRlIGEgY29tbWVudCBub2RlIGFzIGEgcmVmZXJlbmNlIG5vZGUgZm9yIERPTSBpbnNlcnRpb25zXG4gICAgICAgIHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChjb25maWcucHJlZml4ICsgJy1yZXBlYXQtJyArIHRoaXMua2V5KVxuICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHRoaXMucmVmLCBlbClcbiAgICAgICAgY3RuLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG51bGxcbiAgICAgICAgdGhpcy52bXMgPSBudWxsXG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgaWYgKHV0aWxzLmlzT2JqZWN0KGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IHV0aWxzLm9iamVjdFRvQXJyYXkoY29sbGVjdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbHMud2Fybigndi1yZXBlYXQgb25seSBhY2NlcHRzIEFycmF5IG9yIE9iamVjdCB2YWx1ZXMuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGtlZXAgcmVmZXJlbmNlIG9mIG9sZCBkYXRhIGFuZCBWTXNcbiAgICAgICAgLy8gc28gd2UgY2FuIHJldXNlIHRoZW0gaWYgcG9zc2libGVcbiAgICAgICAgdGhpcy5vbGRWTXMgPSB0aGlzLnZtc1xuICAgICAgICB0aGlzLm9sZENvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb25cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24gfHwgW11cblxuICAgICAgICB2YXIgaXNPYmplY3QgPSBjb2xsZWN0aW9uWzBdICYmIHV0aWxzLmlzT2JqZWN0KGNvbGxlY3Rpb25bMF0pXG4gICAgICAgIHRoaXMudm1zID0gdGhpcy5vbGRDb2xsZWN0aW9uXG4gICAgICAgICAgICA/IHRoaXMuZGlmZihjb2xsZWN0aW9uLCBpc09iamVjdClcbiAgICAgICAgICAgIDogdGhpcy5pbml0KGNvbGxlY3Rpb24sIGlzT2JqZWN0KVxuXG4gICAgICAgIGlmICh0aGlzLmNoaWxkSWQpIHtcbiAgICAgICAgICAgIHRoaXMudm0uJFt0aGlzLmNoaWxkSWRdID0gdGhpcy52bXNcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBpc09iamVjdCkge1xuICAgICAgICB2YXIgdm0sIHZtcyA9IFtdXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY29sbGVjdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZtID0gdGhpcy5idWlsZChjb2xsZWN0aW9uW2ldLCBpLCBpc09iamVjdClcbiAgICAgICAgICAgIHZtcy5wdXNoKHZtKVxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh2bS4kZWwsIHRoaXMucmVmKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIERpZmYgdGhlIG5ldyBhcnJheSB3aXRoIHRoZSBvbGRcbiAgICAgKiAgYW5kIGRldGVybWluZSB0aGUgbWluaW11bSBhbW91bnQgb2YgRE9NIG1hbmlwdWxhdGlvbnMuXG4gICAgICovXG4gICAgZGlmZjogZnVuY3Rpb24gKG5ld0NvbGxlY3Rpb24sIGlzT2JqZWN0KSB7XG5cbiAgICAgICAgdmFyIGksIGwsIGl0ZW0sIHZtLFxuICAgICAgICAgICAgb2xkSW5kZXgsXG4gICAgICAgICAgICB0YXJnZXROZXh0LFxuICAgICAgICAgICAgY3VycmVudE5leHQsXG4gICAgICAgICAgICBuZXh0RWwsXG4gICAgICAgICAgICBjdG4gICAgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICAgIG9sZFZNcyA9IHRoaXMub2xkVk1zLFxuICAgICAgICAgICAgdm1zICAgID0gW11cblxuICAgICAgICB2bXMubGVuZ3RoID0gbmV3Q29sbGVjdGlvbi5sZW5ndGhcblxuICAgICAgICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IG5ldyByZXVzZWQgYW5kIG5ldyBjcmVhdGVkXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBuZXdDb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaXRlbSA9IG5ld0NvbGxlY3Rpb25baV1cbiAgICAgICAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICAgICAgICAgIGl0ZW0uJGluZGV4ID0gaVxuICAgICAgICAgICAgICAgIGlmIChpdGVtLl9fZW1pdHRlcl9fICYmIGl0ZW0uX19lbWl0dGVyX19bdGhpcy5pZGVudGlmaWVyXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHBpZWNlIG9mIGRhdGEgaXMgYmVpbmcgcmV1c2VkLlxuICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgaXRzIGZpbmFsIHBvc2l0aW9uIGluIHJldXNlZCB2bXNcbiAgICAgICAgICAgICAgICAgICAgaXRlbS4kcmV1c2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZtc1tpXSA9IHRoaXMuYnVpbGQoaXRlbSwgaSwgaXNPYmplY3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4ndCBhdHRhY2ggYW4gaWRlbnRpZmllciB0byBwcmltaXRpdmUgdmFsdWVzXG4gICAgICAgICAgICAgICAgLy8gc28gaGF2ZSB0byBkbyBhbiBpbmRleE9mLi4uXG4gICAgICAgICAgICAgICAgb2xkSW5kZXggPSBpbmRleE9mKG9sZFZNcywgaXRlbSlcbiAgICAgICAgICAgICAgICBpZiAob2xkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGhlIHBvc2l0aW9uIG9uIHRoZSBleGlzdGluZyB2bVxuICAgICAgICAgICAgICAgICAgICBvbGRWTXNbb2xkSW5kZXhdLiRyZXVzZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIG9sZFZNc1tvbGRJbmRleF0uJGRhdGEuJGluZGV4ID0gaVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZtc1tpXSA9IHRoaXMuYnVpbGQoaXRlbSwgaSwgaXNPYmplY3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2Vjb25kIHBhc3MsIGNvbGxlY3Qgb2xkIHJldXNlZCBhbmQgZGVzdHJveSB1bnVzZWRcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IG9sZFZNcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZtID0gb2xkVk1zW2ldXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5hcmdcbiAgICAgICAgICAgICAgICA/IHZtLiRkYXRhW3RoaXMuYXJnXVxuICAgICAgICAgICAgICAgIDogdm0uJGRhdGFcbiAgICAgICAgICAgIGlmIChpdGVtLiRyZXVzZWQpIHtcbiAgICAgICAgICAgICAgICB2bS4kcmV1c2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLiRyZXVzZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2bS4kcmV1c2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBpbmRleCB0byBsYXRlc3RcbiAgICAgICAgICAgICAgICB2bS4kaW5kZXggPSBpdGVtLiRpbmRleFxuICAgICAgICAgICAgICAgIC8vIHRoZSBpdGVtIGNvdWxkIGhhdmUgaGFkIGEgbmV3IGtleVxuICAgICAgICAgICAgICAgIGlmIChpdGVtLiRrZXkgJiYgaXRlbS4ka2V5ICE9PSB2bS4ka2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLiRrZXkgPSBpdGVtLiRrZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm1zW3ZtLiRpbmRleF0gPSB2bVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIG9uZSBjYW4gYmUgZGVzdHJveWVkLlxuICAgICAgICAgICAgICAgIGlmIChpdGVtLl9fZW1pdHRlcl9fKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLl9fZW1pdHRlcl9fW3RoaXMuaWRlbnRpZmllcl1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uJGRlc3Ryb3koKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmluYWwgcGFzcywgbW92ZS9pbnNlcnQgRE9NIGVsZW1lbnRzXG4gICAgICAgIGkgPSB2bXMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHZtID0gdm1zW2ldXG4gICAgICAgICAgICBpdGVtID0gdm0uJGRhdGFcbiAgICAgICAgICAgIHRhcmdldE5leHQgPSB2bXNbaSArIDFdXG4gICAgICAgICAgICBpZiAodm0uJHJldXNlZCkge1xuICAgICAgICAgICAgICAgIG5leHRFbCA9IHZtLiRlbC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3llZCBWTXMnIGVsZW1lbnQgbWlnaHQgc3RpbGwgYmUgaW4gdGhlIERPTVxuICAgICAgICAgICAgICAgIC8vIGR1ZSB0byB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgICAgIHdoaWxlICghbmV4dEVsLnZ1ZV92bSAmJiBuZXh0RWwgIT09IHRoaXMucmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRFbCA9IG5leHRFbC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50TmV4dCA9IG5leHRFbC52dWVfdm1cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5leHQgIT09IHRhcmdldE5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXROZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHZtLiRlbCwgdGhpcy5yZWYpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0RWwgPSB0YXJnZXROZXh0LiRlbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IFZNcycgZWxlbWVudCBtaWdodCBub3QgYmUgaW4gdGhlIERPTSB5ZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGR1ZSB0byB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFuZXh0RWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE5leHQgPSB2bXNbbmV4dEVsLnZ1ZV92bS4kaW5kZXggKyAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRFbCA9IHRhcmdldE5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0YXJnZXROZXh0LiRlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucmVmXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHZtLiRlbCwgbmV4dEVsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB2bS4kcmV1c2VkXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uJGluZGV4XG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uJGtleVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gYSBuZXcgdm1cbiAgICAgICAgICAgICAgICB2bS4kYmVmb3JlKHRhcmdldE5leHQgPyB0YXJnZXROZXh0LiRlbCA6IHRoaXMucmVmKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZtc1xuICAgIH0sXG5cbiAgICBidWlsZDogZnVuY3Rpb24gKGRhdGEsIGluZGV4LCBpc09iamVjdCkge1xuXG4gICAgICAgIC8vIHdyYXAgbm9uLW9iamVjdCB2YWx1ZXNcbiAgICAgICAgdmFyIHJhdywgYWxpYXMsXG4gICAgICAgICAgICB3cmFwID0gIWlzT2JqZWN0IHx8IHRoaXMuYXJnXG4gICAgICAgIGlmICh3cmFwKSB7XG4gICAgICAgICAgICByYXcgPSBkYXRhXG4gICAgICAgICAgICBhbGlhcyA9IHRoaXMuYXJnIHx8ICckdmFsdWUnXG4gICAgICAgICAgICBkYXRhID0ge31cbiAgICAgICAgICAgIGRhdGFbYWxpYXNdID0gcmF3XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS4kaW5kZXggPSBpbmRleFxuXG4gICAgICAgIHZhciBlbCA9IHRoaXMuZWwuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgQ3RvciA9IHRoaXMuY29tcGlsZXIucmVzb2x2ZUNvbXBvbmVudChlbCwgZGF0YSksXG4gICAgICAgICAgICB2bSA9IG5ldyBDdG9yKHtcbiAgICAgICAgICAgICAgICBlbDogZWwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm0sXG4gICAgICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGVhdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhwQ2FjaGU6IHRoaXMuZXhwQ2FjaGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICAgICAgLy8gYXR0YWNoIGFuIGllbnVtZXJhYmxlIGlkZW50aWZpZXIgdG8gdGhlIHJhdyBkYXRhXG4gICAgICAgICAgICAocmF3IHx8IGRhdGEpLl9fZW1pdHRlcl9fW3RoaXMuaWRlbnRpZmllcl0gPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdm1cblxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRJZCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudm0uJFt0aGlzLmNoaWxkSWRdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudm1zKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMudm1zLmxlbmd0aFxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIHRoaXMudm1zW2ldLiRkZXN0cm95KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBGaW5kIGFuIG9iamVjdCBvciBhIHdyYXBwZWQgZGF0YSBvYmplY3RcbiAqICBmcm9tIGFuIEFycmF5XG4gKi9cbmZ1bmN0aW9uIGluZGV4T2YgKHZtcywgb2JqKSB7XG4gICAgZm9yICh2YXIgdm0sIGkgPSAwLCBsID0gdm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2bSA9IHZtc1tpXVxuICAgICAgICBpZiAoIXZtLiRyZXVzZWQgJiYgdm0uJHZhbHVlID09PSBvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG59IiwidmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICctbXMtJ11cblxuLyoqXG4gKiAgQmluZGluZyBmb3IgQ1NTIHN0eWxlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmFyZ1xuICAgICAgICBpZiAoIXByb3ApIHJldHVyblxuICAgICAgICBpZiAocHJvcC5jaGFyQXQoMCkgPT09ICckJykge1xuICAgICAgICAgICAgLy8gcHJvcGVydGllcyB0aGF0IHN0YXJ0IHdpdGggJCB3aWxsIGJlIGF1dG8tcHJlZml4ZWRcbiAgICAgICAgICAgIHByb3AgPSBwcm9wLnNsaWNlKDEpXG4gICAgICAgICAgICB0aGlzLnByZWZpeGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvcCA9IHByb3BcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLnByb3AsXG4gICAgICAgICAgICBpc0ltcG9ydGFudFxuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiB0cnVlICovXG4gICAgICAgIC8vIGNhc3QgcG9zc2libGUgbnVtYmVycy9ib29sZWFucyBpbnRvIHN0cmluZ3NcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHZhbHVlICs9ICcnXG4gICAgICAgIGlmIChwcm9wKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpc0ltcG9ydGFudCA9IHZhbHVlLnNsaWNlKC0xMCkgPT09ICchaW1wb3J0YW50J1xuICAgICAgICAgICAgICAgICAgICA/ICdpbXBvcnRhbnQnXG4gICAgICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICAgICBpZiAoaXNJbXBvcnRhbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCAtMTApLnRyaW0oKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcCwgdmFsdWUsIGlzSW1wb3J0YW50KVxuICAgICAgICAgICAgaWYgKHRoaXMucHJlZml4ZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcmVmaXhlc1tpXSArIHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiLyoqXG4gKiAgTWFuYWdlcyBhIGNvbmRpdGlvbmFsIGNoaWxkIFZNIHVzaW5nIHRoZVxuICogIGJpbmRpbmcncyB2YWx1ZSBhcyB0aGUgY29tcG9uZW50IElELlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyB0cmFjayBwb3NpdGlvbiBpbiBET00gd2l0aCBhIHJlZiBub2RlXG4gICAgICAgIHZhciBlbCAgICAgICA9IHRoaXMucmF3ID0gdGhpcy5lbCxcbiAgICAgICAgICAgIHBhcmVudCAgID0gZWwucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIHJlZiAgICAgID0gdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXZpZXcnKVxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHJlZiwgZWwpXG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICAvLyBjYWNoZSBvcmlnaW5hbCBjb250ZW50XG4gICAgICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgICAgIHZhciBub2RlLFxuICAgICAgICAgICAgZnJhZyA9IHRoaXMuaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB3aGlsZSAobm9kZSA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcblxuICAgICAgICB0aGlzLnVuYmluZCgpXG5cbiAgICAgICAgdmFyIEN0b3IgID0gdGhpcy5jb21waWxlci5nZXRPcHRpb24oJ2NvbXBvbmVudHMnLCB2YWx1ZSlcbiAgICAgICAgaWYgKCFDdG9yKSByZXR1cm5cblxuICAgICAgICB0aGlzLmNoaWxkVk0gPSBuZXcgQ3Rvcih7XG4gICAgICAgICAgICBlbDogdGhpcy5yYXcuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtLFxuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmF3Q29udGVudDogdGhpcy5pbm5lci5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmVsID0gdGhpcy5jaGlsZFZNLiRlbFxuICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnJlZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRkZXN0cm95KClcbiAgICAgICAgfVxuICAgIH1cblxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgaW5oZXJpdGluZyBkYXRhIGZyb20gcGFyZW50IFZNcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgICAgICA9IHRoaXMsXG4gICAgICAgICAgICBjaGlsZEtleSAgPSBzZWxmLmFyZyxcbiAgICAgICAgICAgIHBhcmVudEtleSA9IHNlbGYua2V5LFxuICAgICAgICAgICAgY29tcGlsZXIgID0gc2VsZi5jb21waWxlcixcbiAgICAgICAgICAgIG93bmVyICAgICA9IHNlbGYuYmluZGluZy5jb21waWxlclxuXG4gICAgICAgIGlmIChjb21waWxlciA9PT0gb3duZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWxvbmUgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGlsZEtleSkge1xuICAgICAgICAgICAgaWYgKCFjb21waWxlci5iaW5kaW5nc1tjaGlsZEtleV0pIHtcbiAgICAgICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGNoaWxkS2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc3luYyBjaGFuZ2VzIG9uIGNoaWxkIGJhY2sgdG8gcGFyZW50XG4gICAgICAgICAgICBjb21waWxlci5vYnNlcnZlci5vbignY2hhbmdlOicgKyBjaGlsZEtleSwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21waWxlci5pbml0KSByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYubG9jaykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9jayA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG93bmVyLnZtLiRzZXQocGFyZW50S2V5LCB2YWwpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIHN5bmMgZnJvbSBwYXJlbnRcbiAgICAgICAgaWYgKCF0aGlzLmFsb25lICYmICF0aGlzLmxvY2spIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgICAgICAgICAgIHRoaXMudm0uJHNldCh0aGlzLmFyZywgdmFsdWUpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudm0uJGRhdGEgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52bS4kZGF0YSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJ2YXIgc2xpY2UgPSBbXS5zbGljZVxuXG5mdW5jdGlvbiBFbWl0dGVyIChjdHgpIHtcbiAgICB0aGlzLl9jdHggPSBjdHggfHwgdGhpc1xufVxuXG52YXIgRW1pdHRlclByb3RvID0gRW1pdHRlci5wcm90b3R5cGVcblxuRW1pdHRlclByb3RvLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuICAgIDsodGhpcy5fY2JzW2V2ZW50XSA9IHRoaXMuX2Nic1tldmVudF0gfHwgW10pXG4gICAgICAgIC5wdXNoKGZuKVxuICAgIHJldHVybiB0aGlzXG59XG5cbkVtaXR0ZXJQcm90by5vbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuXG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgICBzZWxmLm9mZihldmVudCwgb24pXG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBvbi5mbiA9IGZuXG4gICAgdGhpcy5vbihldmVudCwgb24pXG4gICAgcmV0dXJuIHRoaXNcbn1cblxuRW1pdHRlclByb3RvLm9mZiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cblxuICAgIC8vIGFsbFxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9jYnMgPSB7fVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vIHNwZWNpZmljIGV2ZW50XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2Nic1tldmVudF1cbiAgICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXNcblxuICAgIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2JzW2V2ZW50XVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gICAgdmFyIGNiXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2IgPSBjYWxsYmFja3NbaV1cbiAgICAgICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgVGhlIGludGVybmFsLCBmYXN0ZXIgZW1pdCB3aXRoIGZpeGVkIGFtb3VudCBvZiBhcmd1bWVudHNcbiAqICB1c2luZyBGdW5jdGlvbi5jYWxsXG4gKi9cbkVtaXR0ZXJQcm90by5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50LCBhLCBiLCBjKSB7XG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2Nic1tldmVudF1cblxuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc1tpXS5jYWxsKHRoaXMuX2N0eCwgYSwgYiwgYylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogIFRoZSBleHRlcm5hbCBlbWl0IHVzaW5nIEZ1bmN0aW9uLmFwcGx5XG4gKi9cbkVtaXR0ZXJQcm90by5hcHBseUVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cbiAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2JzW2V2ZW50XSwgYXJnc1xuXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICAgICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcy5fY3R4LCBhcmdzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyIiwidmFyIHV0aWxzICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBTVFJfU0FWRV9SRSAgICAgPSAvXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifCcoPzpbXidcXFxcXXxcXFxcLikqJy9nLFxuICAgIFNUUl9SRVNUT1JFX1JFICA9IC9cIihcXGQrKVwiL2csXG4gICAgTkVXTElORV9SRSAgICAgID0gL1xcbi9nLFxuICAgIENUT1JfUkUgICAgICAgICA9IG5ldyBSZWdFeHAoJ2NvbnN0cnVjdG9yJy5zcGxpdCgnJykuam9pbignW1xcJ1wiKywgXSonKSksXG4gICAgVU5JQ09ERV9SRSAgICAgID0gL1xcXFx1XFxkXFxkXFxkXFxkL1xuXG4vLyBWYXJpYWJsZSBleHRyYWN0aW9uIHNjb29wZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vUnVieUxvdXZyZS9hdmFsb25cblxudmFyIEtFWVdPUkRTID1cbiAgICAgICAgLy8ga2V5d29yZHNcbiAgICAgICAgJ2JyZWFrLGNhc2UsY2F0Y2gsY29udGludWUsZGVidWdnZXIsZGVmYXVsdCxkZWxldGUsZG8sZWxzZSxmYWxzZScgK1xuICAgICAgICAnLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLGluLGluc3RhbmNlb2YsbmV3LG51bGwscmV0dXJuLHN3aXRjaCx0aGlzJyArXG4gICAgICAgICcsdGhyb3csdHJ1ZSx0cnksdHlwZW9mLHZhcix2b2lkLHdoaWxlLHdpdGgsdW5kZWZpbmVkJyArXG4gICAgICAgIC8vIHJlc2VydmVkXG4gICAgICAgICcsYWJzdHJhY3QsYm9vbGVhbixieXRlLGNoYXIsY2xhc3MsY29uc3QsZG91YmxlLGVudW0sZXhwb3J0LGV4dGVuZHMnICtcbiAgICAgICAgJyxmaW5hbCxmbG9hdCxnb3RvLGltcGxlbWVudHMsaW1wb3J0LGludCxpbnRlcmZhY2UsbG9uZyxuYXRpdmUnICtcbiAgICAgICAgJyxwYWNrYWdlLHByaXZhdGUscHJvdGVjdGVkLHB1YmxpYyxzaG9ydCxzdGF0aWMsc3VwZXIsc3luY2hyb25pemVkJyArXG4gICAgICAgICcsdGhyb3dzLHRyYW5zaWVudCx2b2xhdGlsZScgK1xuICAgICAgICAvLyBFQ01BIDUgLSB1c2Ugc3RyaWN0XG4gICAgICAgICcsYXJndW1lbnRzLGxldCx5aWVsZCcgK1xuICAgICAgICAvLyBhbGxvdyB1c2luZyBNYXRoIGluIGV4cHJlc3Npb25zXG4gICAgICAgICcsTWF0aCcsXG4gICAgICAgIFxuICAgIEtFWVdPUkRTX1JFID0gbmV3IFJlZ0V4cChbXCJcXFxcYlwiICsgS0VZV09SRFMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8XFxcXGInKSArIFwiXFxcXGJcIl0uam9pbignfCcpLCAnZycpLFxuICAgIFJFTU9WRV9SRSAgID0gL1xcL1xcKig/Oi58XFxuKSo/XFwqXFwvfFxcL1xcL1teXFxuXSpcXG58XFwvXFwvW15cXG5dKiR8J1teJ10qJ3xcIlteXCJdKlwifFtcXHNcXHRcXG5dKlxcLltcXHNcXHRcXG5dKlskXFx3XFwuXSt8W1xceyxdXFxzKltcXHdcXCRfXStcXHMqOi9nLFxuICAgIFNQTElUX1JFICAgID0gL1teXFx3JF0rL2csXG4gICAgTlVNQkVSX1JFICAgPSAvXFxiXFxkW14sXSovZyxcbiAgICBCT1VOREFSWV9SRSA9IC9eLCt8LCskL2dcblxuLyoqXG4gKiAgU3RyaXAgdG9wIGxldmVsIHZhcmlhYmxlIG5hbWVzIGZyb20gYSBzbmlwcGV0IG9mIEpTIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVzIChjb2RlKSB7XG4gICAgY29kZSA9IGNvZGVcbiAgICAgICAgLnJlcGxhY2UoUkVNT1ZFX1JFLCAnJylcbiAgICAgICAgLnJlcGxhY2UoU1BMSVRfUkUsICcsJylcbiAgICAgICAgLnJlcGxhY2UoS0VZV09SRFNfUkUsICcnKVxuICAgICAgICAucmVwbGFjZShOVU1CRVJfUkUsICcnKVxuICAgICAgICAucmVwbGFjZShCT1VOREFSWV9SRSwgJycpXG4gICAgcmV0dXJuIGNvZGVcbiAgICAgICAgPyBjb2RlLnNwbGl0KC8sKy8pXG4gICAgICAgIDogW11cbn1cblxuLyoqXG4gKiAgQSBnaXZlbiBwYXRoIGNvdWxkIHBvdGVudGlhbGx5IGV4aXN0IG5vdCBvbiB0aGVcbiAqICBjdXJyZW50IGNvbXBpbGVyLCBidXQgdXAgaW4gdGhlIHBhcmVudCBjaGFpbiBzb21ld2hlcmUuXG4gKiAgVGhpcyBmdW5jdGlvbiBnZW5lcmF0ZXMgYW4gYWNjZXNzIHJlbGF0aW9uc2hpcCBzdHJpbmdcbiAqICB0aGF0IGNhbiBiZSB1c2VkIGluIHRoZSBnZXR0ZXIgZnVuY3Rpb24gYnkgd2Fsa2luZyB1cFxuICogIHRoZSBwYXJlbnQgY2hhaW4gdG8gY2hlY2sgZm9yIGtleSBleGlzdGVuY2UuXG4gKlxuICogIEl0IHN0b3BzIGF0IHRvcCBwYXJlbnQgaWYgbm8gdm0gaW4gdGhlIGNoYWluIGhhcyB0aGVcbiAqICBrZXkuIEl0IHRoZW4gY3JlYXRlcyBhbnkgbWlzc2luZyBiaW5kaW5ncyBvbiB0aGVcbiAqICBmaW5hbCByZXNvbHZlZCB2bS5cbiAqL1xuZnVuY3Rpb24gdHJhY2VTY29wZSAocGF0aCwgY29tcGlsZXIsIGRhdGEpIHtcbiAgICB2YXIgcmVsICA9ICcnLFxuICAgICAgICBkaXN0ID0gMCxcbiAgICAgICAgc2VsZiA9IGNvbXBpbGVyXG5cbiAgICBpZiAoZGF0YSAmJiB1dGlscy5nZXQoZGF0YSwgcGF0aCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBoYWNrOiB0ZW1wb3JhcmlseSBhdHRhY2hlZCBkYXRhXG4gICAgICAgIHJldHVybiAnJHRlbXAuJ1xuICAgIH1cblxuICAgIHdoaWxlIChjb21waWxlcikge1xuICAgICAgICBpZiAoY29tcGlsZXIuaGFzS2V5KHBhdGgpKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICAgICAgICAgIGRpc3QrK1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjb21waWxlcikge1xuICAgICAgICB3aGlsZSAoZGlzdC0tKSB7XG4gICAgICAgICAgICByZWwgKz0gJyRwYXJlbnQuJ1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29tcGlsZXIuYmluZGluZ3NbcGF0aF0gJiYgcGF0aC5jaGFyQXQoMCkgIT09ICckJykge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhwYXRoKVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5jcmVhdGVCaW5kaW5nKHBhdGgpXG4gICAgfVxuICAgIHJldHVybiByZWxcbn1cblxuLyoqXG4gKiAgQ3JlYXRlIGEgZnVuY3Rpb24gZnJvbSBhIHN0cmluZy4uLlxuICogIHRoaXMgbG9va3MgbGlrZSBldmlsIG1hZ2ljIGJ1dCBzaW5jZSBhbGwgdmFyaWFibGVzIGFyZSBsaW1pdGVkXG4gKiAgdG8gdGhlIFZNJ3MgZGF0YSBpdCdzIGFjdHVhbGx5IHByb3Blcmx5IHNhbmRib3hlZFxuICovXG5mdW5jdGlvbiBtYWtlR2V0dGVyIChleHAsIHJhdykge1xuICAgIHZhciBmblxuICAgIHRyeSB7XG4gICAgICAgIGZuID0gbmV3IEZ1bmN0aW9uKGV4cClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ0Vycm9yIHBhcnNpbmcgZXhwcmVzc2lvbjogJyArIHJhdylcbiAgICB9XG4gICAgcmV0dXJuIGZuXG59XG5cbi8qKlxuICogIEVzY2FwZSBhIGxlYWRpbmcgZG9sbGFyIHNpZ24gZm9yIHJlZ2V4IGNvbnN0cnVjdGlvblxuICovXG5mdW5jdGlvbiBlc2NhcGVEb2xsYXIgKHYpIHtcbiAgICByZXR1cm4gdi5jaGFyQXQoMCkgPT09ICckJ1xuICAgICAgICA/ICdcXFxcJyArIHZcbiAgICAgICAgOiB2XG59XG5cbi8qKlxuICogIFBhcnNlIGFuZCByZXR1cm4gYW4gYW5vbnltb3VzIGNvbXB1dGVkIHByb3BlcnR5IGdldHRlciBmdW5jdGlvblxuICogIGZyb20gYW4gYXJiaXRyYXJ5IGV4cHJlc3Npb24sIHRvZ2V0aGVyIHdpdGggYSBsaXN0IG9mIHBhdGhzIHRvIGJlXG4gKiAgY3JlYXRlZCBhcyBiaW5kaW5ncy5cbiAqL1xuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChleHAsIGNvbXBpbGVyLCBkYXRhKSB7XG4gICAgLy8gdW5pY29kZSBhbmQgJ2NvbnN0cnVjdG9yJyBhcmUgbm90IGFsbG93ZWQgZm9yIFhTUyBzZWN1cml0eS5cbiAgICBpZiAoVU5JQ09ERV9SRS50ZXN0KGV4cCkgfHwgQ1RPUl9SRS50ZXN0KGV4cCkpIHtcbiAgICAgICAgdXRpbHMud2FybignVW5zYWZlIGV4cHJlc3Npb246ICcgKyBleHApXG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBleHRyYWN0IHZhcmlhYmxlIG5hbWVzXG4gICAgdmFyIHZhcnMgPSBnZXRWYXJpYWJsZXMoZXhwKVxuICAgIGlmICghdmFycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VHZXR0ZXIoJ3JldHVybiAnICsgZXhwLCBleHApXG4gICAgfVxuICAgIHZhcnMgPSB1dGlscy51bmlxdWUodmFycylcblxuICAgIHZhciBhY2Nlc3NvcnMgPSAnJyxcbiAgICAgICAgaGFzICAgICAgID0gdXRpbHMuaGFzaCgpLFxuICAgICAgICBzdHJpbmdzICAgPSBbXSxcbiAgICAgICAgLy8gY29uc3RydWN0IGEgcmVnZXggdG8gZXh0cmFjdCBhbGwgdmFsaWQgdmFyaWFibGUgcGF0aHNcbiAgICAgICAgLy8gb25lcyB0aGF0IGJlZ2luIHdpdGggXCIkXCIgYXJlIHBhcnRpY3VsYXJseSB0cmlja3lcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSBjYW4ndCB1c2UgXFxiIGZvciB0aGVtXG4gICAgICAgIHBhdGhSRSA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICBcIlteJFxcXFx3XFxcXC5dKFwiICtcbiAgICAgICAgICAgIHZhcnMubWFwKGVzY2FwZURvbGxhcikuam9pbignfCcpICtcbiAgICAgICAgICAgIFwiKVskXFxcXHdcXFxcLl0qXFxcXGJcIiwgJ2cnXG4gICAgICAgICksXG4gICAgICAgIGJvZHkgPSAoJyAnICsgZXhwKVxuICAgICAgICAgICAgLnJlcGxhY2UoU1RSX1NBVkVfUkUsIHNhdmVTdHJpbmdzKVxuICAgICAgICAgICAgLnJlcGxhY2UocGF0aFJFLCByZXBsYWNlUGF0aClcbiAgICAgICAgICAgIC5yZXBsYWNlKFNUUl9SRVNUT1JFX1JFLCByZXN0b3JlU3RyaW5ncylcblxuICAgIGJvZHkgPSBhY2Nlc3NvcnMgKyAncmV0dXJuICcgKyBib2R5XG5cbiAgICBmdW5jdGlvbiBzYXZlU3RyaW5ncyAoc3RyKSB7XG4gICAgICAgIHZhciBpID0gc3RyaW5ncy5sZW5ndGhcbiAgICAgICAgLy8gZXNjYXBlIG5ld2xpbmVzIGluIHN0cmluZ3Mgc28gdGhlIGV4cHJlc3Npb25cbiAgICAgICAgLy8gY2FuIGJlIGNvcnJlY3RseSBldmFsdWF0ZWRcbiAgICAgICAgc3RyaW5nc1tpXSA9IHN0ci5yZXBsYWNlKE5FV0xJTkVfUkUsICdcXFxcbicpXG4gICAgICAgIHJldHVybiAnXCInICsgaSArICdcIidcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlUGF0aCAocGF0aCkge1xuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBmaXJzdCBjaGFyXG4gICAgICAgIHZhciBjID0gcGF0aC5jaGFyQXQoMClcbiAgICAgICAgcGF0aCA9IHBhdGguc2xpY2UoMSlcbiAgICAgICAgdmFyIHZhbCA9ICd0aGlzLicgKyB0cmFjZVNjb3BlKHBhdGgsIGNvbXBpbGVyLCBkYXRhKSArIHBhdGhcbiAgICAgICAgaWYgKCFoYXNbcGF0aF0pIHtcbiAgICAgICAgICAgIGFjY2Vzc29ycyArPSB2YWwgKyAnOydcbiAgICAgICAgICAgIGhhc1twYXRoXSA9IDFcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCBmb3JnZXQgdG8gcHV0IHRoYXQgZmlyc3QgY2hhciBiYWNrXG4gICAgICAgIHJldHVybiBjICsgdmFsXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzdG9yZVN0cmluZ3MgKHN0ciwgaSkge1xuICAgICAgICByZXR1cm4gc3RyaW5nc1tpXVxuICAgIH1cblxuICAgIHJldHVybiBtYWtlR2V0dGVyKGJvZHksIGV4cClcbn1cblxuLyoqXG4gKiAgRXZhbHVhdGUgYW4gZXhwcmVzc2lvbiBpbiB0aGUgY29udGV4dCBvZiBhIGNvbXBpbGVyLlxuICogIEFjY2VwdHMgYWRkaXRpb25hbCBkYXRhLlxuICovXG5leHBvcnRzLmV2YWwgPSBmdW5jdGlvbiAoZXhwLCBjb21waWxlciwgZGF0YSkge1xuICAgIHZhciBnZXR0ZXIgPSBleHBvcnRzLnBhcnNlKGV4cCwgY29tcGlsZXIsIGRhdGEpLCByZXNcbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIC8vIGhhY2s6IHRlbXBvcmFyaWx5IGF0dGFjaCB0aGUgYWRkaXRpb25hbCBkYXRhIHNvXG4gICAgICAgIC8vIGl0IGNhbiBiZSBhY2Nlc3NlZCBpbiB0aGUgZ2V0dGVyXG4gICAgICAgIGNvbXBpbGVyLnZtLiR0ZW1wID0gZGF0YVxuICAgICAgICByZXMgPSBnZXR0ZXIuY2FsbChjb21waWxlci52bSlcbiAgICAgICAgZGVsZXRlIGNvbXBpbGVyLnZtLiR0ZW1wXG4gICAgfVxuICAgIHJldHVybiByZXNcbn0iLCJ2YXIgdXRpbHMgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgZ2V0ICAgICAgPSB1dGlscy5nZXQsXG4gICAgc2xpY2UgICAgPSBbXS5zbGljZSxcbiAgICBRVU9URV9SRSA9IC9eJy4qJyQvLFxuICAgIGZpbHRlcnMgID0gbW9kdWxlLmV4cG9ydHMgPSB1dGlscy5oYXNoKClcblxuLyoqXG4gKiAgJ2FiYycgPT4gJ0FiYydcbiAqL1xuZmlsdGVycy5jYXBpdGFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiAgJ2FiYycgPT4gJ0FCQydcbiAqL1xuZmlsdGVycy51cHBlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKVxuICAgICAgICA6ICcnXG59XG5cbi8qKlxuICogICdBYkMnID0+ICdhYmMnXG4gKi9cbmZpbHRlcnMubG93ZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICAgICAgPyB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgOiAnJ1xufVxuXG4vKipcbiAqICAxMjM0NSA9PiAkMTIsMzQ1LjAwXG4gKi9cbmZpbHRlcnMuY3VycmVuY3kgPSBmdW5jdGlvbiAodmFsdWUsIHNpZ24pIHtcbiAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnXG4gICAgc2lnbiA9IHNpZ24gfHwgJyQnXG4gICAgdmFyIHMgPSBNYXRoLmZsb29yKHZhbHVlKS50b1N0cmluZygpLFxuICAgICAgICBpID0gcy5sZW5ndGggJSAzLFxuICAgICAgICBoID0gaSA+IDAgPyAocy5zbGljZSgwLCBpKSArIChzLmxlbmd0aCA+IDMgPyAnLCcgOiAnJykpIDogJycsXG4gICAgICAgIGYgPSAnLicgKyB2YWx1ZS50b0ZpeGVkKDIpLnNsaWNlKC0yKVxuICAgIHJldHVybiBzaWduICsgaCArIHMuc2xpY2UoaSkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csICckMSwnKSArIGZcbn1cblxuLyoqXG4gKiAgYXJnczogYW4gYXJyYXkgb2Ygc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvXG4gKiAgdGhlIHNpbmdsZSwgZG91YmxlLCB0cmlwbGUgLi4uIGZvcm1zIG9mIHRoZSB3b3JkIHRvXG4gKiAgYmUgcGx1cmFsaXplZC4gV2hlbiB0aGUgbnVtYmVyIHRvIGJlIHBsdXJhbGl6ZWRcbiAqICBleGNlZWRzIHRoZSBsZW5ndGggb2YgdGhlIGFyZ3MsIGl0IHdpbGwgdXNlIHRoZSBsYXN0XG4gKiAgZW50cnkgaW4gdGhlIGFycmF5LlxuICpcbiAqICBlLmcuIFsnc2luZ2xlJywgJ2RvdWJsZScsICd0cmlwbGUnLCAnbXVsdGlwbGUnXVxuICovXG5maWx0ZXJzLnBsdXJhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMVxuICAgICAgICA/IChhcmdzW3ZhbHVlIC0gMV0gfHwgYXJnc1thcmdzLmxlbmd0aCAtIDFdKVxuICAgICAgICA6IChhcmdzW3ZhbHVlIC0gMV0gfHwgYXJnc1swXSArICdzJylcbn1cblxuLyoqXG4gKiAgQSBzcGVjaWFsIGZpbHRlciB0aGF0IHRha2VzIGEgaGFuZGxlciBmdW5jdGlvbixcbiAqICB3cmFwcyBpdCBzbyBpdCBvbmx5IGdldHMgdHJpZ2dlcmVkIG9uIHNwZWNpZmljIGtleXByZXNzZXMuXG4gKlxuICogIHYtb24gb25seVxuICovXG5cbnZhciBrZXlDb2RlcyA9IHtcbiAgICBlbnRlciAgICA6IDEzLFxuICAgIHRhYiAgICAgIDogOSxcbiAgICAnZGVsZXRlJyA6IDQ2LFxuICAgIHVwICAgICAgIDogMzgsXG4gICAgbGVmdCAgICAgOiAzNyxcbiAgICByaWdodCAgICA6IDM5LFxuICAgIGRvd24gICAgIDogNDAsXG4gICAgZXNjICAgICAgOiAyN1xufVxuXG5maWx0ZXJzLmtleSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBrZXkpIHtcbiAgICBpZiAoIWhhbmRsZXIpIHJldHVyblxuICAgIHZhciBjb2RlID0ga2V5Q29kZXNba2V5XVxuICAgIGlmICghY29kZSkge1xuICAgICAgICBjb2RlID0gcGFyc2VJbnQoa2V5LCAxMClcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqL1xuZmlsdGVycy5maWx0ZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNlYXJjaEtleSwgZGVsaW1pdGVyLCBkYXRhS2V5KSB7XG5cbiAgICAvLyBhbGxvdyBvcHRpb25hbCBgaW5gIGRlbGltaXRlclxuICAgIC8vIGJlY2F1c2Ugd2h5IG5vdFxuICAgIGlmIChkZWxpbWl0ZXIgJiYgZGVsaW1pdGVyICE9PSAnaW4nKSB7XG4gICAgICAgIGRhdGFLZXkgPSBkZWxpbWl0ZXJcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIHNlYXJjaCBzdHJpbmdcbiAgICB2YXIgc2VhcmNoID0gc3RyaXBRdW90ZXMoc2VhcmNoS2V5KSB8fCB0aGlzLiRnZXQoc2VhcmNoS2V5KVxuICAgIGlmICghc2VhcmNoKSByZXR1cm4gYXJyXG4gICAgc2VhcmNoID0gc2VhcmNoLnRvTG93ZXJDYXNlKClcblxuICAgIC8vIGdldCB0aGUgb3B0aW9uYWwgZGF0YUtleVxuICAgIGRhdGFLZXkgPSBkYXRhS2V5ICYmIChzdHJpcFF1b3RlcyhkYXRhS2V5KSB8fCB0aGlzLiRnZXQoZGF0YUtleSkpXG5cbiAgICAvLyBjb252ZXJ0IG9iamVjdCB0byBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IHV0aWxzLm9iamVjdFRvQXJyYXkoYXJyKVxuICAgIH1cblxuICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBkYXRhS2V5XG4gICAgICAgICAgICA/IGNvbnRhaW5zKGdldChpdGVtLCBkYXRhS2V5KSwgc2VhcmNoKVxuICAgICAgICAgICAgOiBjb250YWlucyhpdGVtLCBzZWFyY2gpXG4gICAgfSlcblxufVxuXG5maWx0ZXJzLmZpbHRlckJ5LmNvbXB1dGVkID0gdHJ1ZVxuXG4vKipcbiAqICBTb3J0IGZpdGxlciBmb3Igdi1yZXBlYXRcbiAqL1xuZmlsdGVycy5vcmRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc29ydEtleSwgcmV2ZXJzZUtleSkge1xuXG4gICAgdmFyIGtleSA9IHN0cmlwUXVvdGVzKHNvcnRLZXkpIHx8IHRoaXMuJGdldChzb3J0S2V5KVxuICAgIGlmICgha2V5KSByZXR1cm4gYXJyXG5cbiAgICAvLyBjb252ZXJ0IG9iamVjdCB0byBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IHV0aWxzLm9iamVjdFRvQXJyYXkoYXJyKVxuICAgIH1cblxuICAgIHZhciBvcmRlciA9IDFcbiAgICBpZiAocmV2ZXJzZUtleSkge1xuICAgICAgICBpZiAocmV2ZXJzZUtleSA9PT0gJy0xJykge1xuICAgICAgICAgICAgb3JkZXIgPSAtMVxuICAgICAgICB9IGVsc2UgaWYgKHJldmVyc2VLZXkuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICAgIHJldmVyc2VLZXkgPSByZXZlcnNlS2V5LnNsaWNlKDEpXG4gICAgICAgICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IDEgOiAtMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAtMSA6IDFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNvcnQgb24gYSBjb3B5IHRvIGF2b2lkIG11dGF0aW5nIG9yaWdpbmFsIGFycmF5XG4gICAgcmV0dXJuIGFyci5zbGljZSgpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgYSA9IGdldChhLCBrZXkpXG4gICAgICAgIGIgPSBnZXQoYiwga2V5KVxuICAgICAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhID4gYiA/IG9yZGVyIDogLW9yZGVyXG4gICAgfSlcblxufVxuXG5maWx0ZXJzLm9yZGVyQnkuY29tcHV0ZWQgPSB0cnVlXG5cbi8vIEFycmF5IGZpbHRlciBoZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgU3RyaW5nIGNvbnRhaW4gaGVscGVyXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zICh2YWwsIHNlYXJjaCkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KHZhbCkpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5zKHZhbFtrZXldLCBzZWFyY2gpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHZhbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTFcbiAgICB9XG59XG5cbi8qKlxuICogIFRlc3Qgd2hldGhlciBhIHN0cmluZyBpcyBpbiBxdW90ZXMsXG4gKiAgaWYgeWVzIHJldHVybiBzdHJpcHBlZCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gc3RyaXBRdW90ZXMgKHN0cikge1xuICAgIGlmIChRVU9URV9SRS50ZXN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgxLCAtMSlcbiAgICB9XG59IiwiLy8gc3RyaW5nIC0+IERPTSBjb252ZXJzaW9uXG4vLyB3cmFwcGVycyBvcmlnaW5hbGx5IGZyb20galF1ZXJ5LCBzY29vcGVkIGZyb20gY29tcG9uZW50L2RvbWlmeVxudmFyIG1hcCA9IHtcbiAgICBsZWdlbmQgICA6IFsxLCAnPGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PiddLFxuICAgIHRyICAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gICAgY29sICAgICAgOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXSxcbiAgICBfZGVmYXVsdCA6IFswLCAnJywgJyddXG59XG5cbm1hcC50ZCA9XG5tYXAudGggPSBbMywgJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXVxuXG5tYXAub3B0aW9uID1cbm1hcC5vcHRncm91cCA9IFsxLCAnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JywgJzwvc2VsZWN0PiddXG5cbm1hcC50aGVhZCA9XG5tYXAudGJvZHkgPVxubWFwLmNvbGdyb3VwID1cbm1hcC5jYXB0aW9uID1cbm1hcC50Zm9vdCA9IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddXG5cbm1hcC50ZXh0ID1cbm1hcC5jaXJjbGUgPVxubWFwLmVsbGlwc2UgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnBvbHlnb24gPVxubWFwLnBvbHlsaW5lID1cbm1hcC5yZWN0ID0gWzEsICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCI+JywnPC9zdmc+J11cblxudmFyIFRBR19SRSA9IC88KFtcXHc6XSspL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZykge1xuICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICBtID0gVEFHX1JFLmV4ZWModGVtcGxhdGVTdHJpbmcpXG4gICAgLy8gdGV4dCBvbmx5XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGVtcGxhdGVTdHJpbmcpKVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgIH1cblxuICAgIHZhciB0YWcgPSBtWzFdLFxuICAgICAgICB3cmFwID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0LFxuICAgICAgICBkZXB0aCA9IHdyYXBbMF0sXG4gICAgICAgIHByZWZpeCA9IHdyYXBbMV0sXG4gICAgICAgIHN1ZmZpeCA9IHdyYXBbMl0sXG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZy50cmltKCkgKyBzdWZmaXhcbiAgICB3aGlsZSAoZGVwdGgtLSkgbm9kZSA9IG5vZGUubGFzdENoaWxkXG5cbiAgICAvLyBvbmUgZWxlbWVudFxuICAgIGlmIChub2RlLmZpcnN0Q2hpbGQgPT09IG5vZGUubGFzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgIH1cblxuICAgIC8vIG11bHRpcGxlIG5vZGVzLCByZXR1cm4gYSBmcmFnbWVudFxuICAgIHZhciBjaGlsZFxuICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgd2hpbGUgKGNoaWxkID0gbm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmcmFnXG59IiwidmFyIGNvbmZpZyAgICAgID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICBWaWV3TW9kZWwgICA9IHJlcXVpcmUoJy4vdmlld21vZGVsJyksXG4gICAgdXRpbHMgICAgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgbWFrZUhhc2ggICAgPSB1dGlscy5oYXNoLFxuICAgIGFzc2V0VHlwZXMgID0gWydkaXJlY3RpdmUnLCAnZmlsdGVyJywgJ3BhcnRpYWwnLCAnZWZmZWN0JywgJ2NvbXBvbmVudCddLFxuICAgIC8vIEludGVybmFsIG1vZHVsZXMgdGhhdCBhcmUgZXhwb3NlZCBmb3IgcGx1Z2luc1xuICAgIHBsdWdpbkFQSSAgID0ge1xuICAgICAgICB1dGlsczogdXRpbHMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICB0cmFuc2l0aW9uOiByZXF1aXJlKCcuL3RyYW5zaXRpb24nKSxcbiAgICAgICAgb2JzZXJ2ZXI6IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKVxuICAgIH1cblxuVmlld01vZGVsLm9wdGlvbnMgPSBjb25maWcuZ2xvYmFsQXNzZXRzID0ge1xuICAgIGRpcmVjdGl2ZXMgIDogcmVxdWlyZSgnLi9kaXJlY3RpdmVzJyksXG4gICAgZmlsdGVycyAgICAgOiByZXF1aXJlKCcuL2ZpbHRlcnMnKSxcbiAgICBwYXJ0aWFscyAgICA6IG1ha2VIYXNoKCksXG4gICAgZWZmZWN0cyAgICAgOiBtYWtlSGFzaCgpLFxuICAgIGNvbXBvbmVudHMgIDogbWFrZUhhc2goKVxufVxuXG4vKipcbiAqICBFeHBvc2UgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHNcbiAqL1xuYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgVmlld01vZGVsW3R5cGVdID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaGFzaCA9IHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVxuICAgICAgICBpZiAoIWhhc2gpIHtcbiAgICAgICAgICAgIGhhc2ggPSB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ10gPSBtYWtlSGFzaCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGhhc2hbaWRdXG4gICAgICAgIGlmICh0eXBlID09PSAncGFydGlhbCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdXRpbHMucGFyc2VUZW1wbGF0ZU9wdGlvbih2YWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgdmFsdWUgPSB1dGlscy50b0NvbnN0cnVjdG9yKHZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmaWx0ZXInKSB7XG4gICAgICAgICAgICB1dGlscy5jaGVja0ZpbHRlcih2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBoYXNoW2lkXSA9IHZhbHVlXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufSlcblxuLyoqXG4gKiAgU2V0IGNvbmZpZyBvcHRpb25zXG4gKi9cblZpZXdNb2RlbC5jb25maWcgPSBmdW5jdGlvbiAob3B0cywgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWdbb3B0c11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ1tvcHRzXSA9IHZhbFxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdXRpbHMuZXh0ZW5kKGNvbmZpZywgb3B0cylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgRXhwb3NlIGFuIGludGVyZmFjZSBmb3IgcGx1Z2luc1xuICovXG5WaWV3TW9kZWwudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGx1Z2luID0gcmVxdWlyZShwbHVnaW4pXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oJ0Nhbm5vdCBmaW5kIHBsdWdpbjogJyArIHBsdWdpbilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICBhcmdzLnVuc2hpZnQodGhpcylcblxuICAgIGlmICh0eXBlb2YgcGx1Z2luLmluc3RhbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqICBFeHBvc2UgaW50ZXJuYWwgbW9kdWxlcyBmb3IgcGx1Z2luc1xuICovXG5WaWV3TW9kZWwucmVxdWlyZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICByZXR1cm4gcGx1Z2luQVBJW21vZHVsZV1cbn1cblxuVmlld01vZGVsLmV4dGVuZCA9IGV4dGVuZFxuVmlld01vZGVsLm5leHRUaWNrID0gdXRpbHMubmV4dFRpY2tcblxuLyoqXG4gKiAgRXhwb3NlIHRoZSBtYWluIFZpZXdNb2RlbCBjbGFzc1xuICogIGFuZCBhZGQgZXh0ZW5kIG1ldGhvZFxuICovXG5mdW5jdGlvbiBleHRlbmQgKG9wdGlvbnMpIHtcblxuICAgIHZhciBQYXJlbnRWTSA9IHRoaXNcblxuICAgIC8vIGV4dGVuZCBkYXRhIG9wdGlvbnMgbmVlZCB0byBiZSBjb3BpZWRcbiAgICAvLyBvbiBpbnN0YW50aWF0aW9uXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgICBvcHRpb25zLmRlZmF1bHREYXRhID0gb3B0aW9ucy5kYXRhXG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmRhdGFcbiAgICB9XG5cbiAgICAvLyBpbmhlcml0IG9wdGlvbnNcbiAgICAvLyBidXQgb25seSB3aGVuIHRoZSBzdXBlciBjbGFzcyBpcyBub3QgdGhlIG5hdGl2ZSBWdWUuXG4gICAgaWYgKFBhcmVudFZNICE9PSBWaWV3TW9kZWwpIHtcbiAgICAgICAgb3B0aW9ucyA9IGluaGVyaXRPcHRpb25zKG9wdGlvbnMsIFBhcmVudFZNLm9wdGlvbnMsIHRydWUpXG4gICAgfVxuICAgIHV0aWxzLnByb2Nlc3NPcHRpb25zKG9wdGlvbnMpXG5cbiAgICB2YXIgRXh0ZW5kZWRWTSA9IGZ1bmN0aW9uIChvcHRzLCBhc1BhcmVudCkge1xuICAgICAgICBpZiAoIWFzUGFyZW50KSB7XG4gICAgICAgICAgICBvcHRzID0gaW5oZXJpdE9wdGlvbnMob3B0cywgb3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBQYXJlbnRWTS5jYWxsKHRoaXMsIG9wdHMsIHRydWUpXG4gICAgfVxuXG4gICAgLy8gaW5oZXJpdCBwcm90b3R5cGUgcHJvcHNcbiAgICB2YXIgcHJvdG8gPSBFeHRlbmRlZFZNLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGFyZW50Vk0ucHJvdG90eXBlKVxuICAgIHV0aWxzLmRlZlByb3RlY3RlZChwcm90bywgJ2NvbnN0cnVjdG9yJywgRXh0ZW5kZWRWTSlcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIGJlIGZ1cnRoZXIgZXh0ZW5kZWRcbiAgICBFeHRlbmRlZFZNLmV4dGVuZCAgPSBleHRlbmRcbiAgICBFeHRlbmRlZFZNLnN1cGVyICAgPSBQYXJlbnRWTVxuICAgIEV4dGVuZGVkVk0ub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIGFkZCBpdHMgb3duIGFzc2V0c1xuICAgIGFzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBFeHRlbmRlZFZNW3R5cGVdID0gVmlld01vZGVsW3R5cGVdXG4gICAgfSlcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIHVzZSBwbHVnaW5zXG4gICAgRXh0ZW5kZWRWTS51c2UgICAgID0gVmlld01vZGVsLnVzZVxuICAgIEV4dGVuZGVkVk0ucmVxdWlyZSA9IFZpZXdNb2RlbC5yZXF1aXJlXG5cbiAgICByZXR1cm4gRXh0ZW5kZWRWTVxufVxuXG4vKipcbiAqICBJbmhlcml0IG9wdGlvbnNcbiAqXG4gKiAgRm9yIG9wdGlvbnMgc3VjaCBhcyBgZGF0YWAsIGB2bXNgLCBgZGlyZWN0aXZlc2AsICdwYXJ0aWFscycsXG4gKiAgdGhleSBzaG91bGQgYmUgZnVydGhlciBleHRlbmRlZC4gSG93ZXZlciBleHRlbmRpbmcgc2hvdWxkIG9ubHlcbiAqICBiZSBkb25lIGF0IHRvcCBsZXZlbC5cbiAqICBcbiAqICBgcHJvdG9gIGlzIGFuIGV4Y2VwdGlvbiBiZWNhdXNlIGl0J3MgaGFuZGxlZCBkaXJlY3RseSBvbiB0aGVcbiAqICBwcm90b3R5cGUuXG4gKlxuICogIGBlbGAgaXMgYW4gZXhjZXB0aW9uIGJlY2F1c2UgaXQncyBub3QgYWxsb3dlZCBhcyBhblxuICogIGV4dGVuc2lvbiBvcHRpb24sIGJ1dCBvbmx5IGFzIGFuIGluc3RhbmNlIG9wdGlvbi5cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdE9wdGlvbnMgKGNoaWxkLCBwYXJlbnQsIHRvcExldmVsKSB7XG4gICAgY2hpbGQgPSBjaGlsZCB8fCB7fVxuICAgIGlmICghcGFyZW50KSByZXR1cm4gY2hpbGRcbiAgICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdlbCcpIGNvbnRpbnVlXG4gICAgICAgIHZhciB2YWwgPSBjaGlsZFtrZXldLFxuICAgICAgICAgICAgcGFyZW50VmFsID0gcGFyZW50W2tleV1cbiAgICAgICAgaWYgKHRvcExldmVsICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgJiYgcGFyZW50VmFsKSB7XG4gICAgICAgICAgICAvLyBtZXJnZSBob29rIGZ1bmN0aW9ucyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICBjaGlsZFtrZXldID0gW3ZhbF1cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudFZhbCkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFtrZXldID0gY2hpbGRba2V5XS5jb25jYXQocGFyZW50VmFsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGlsZFtrZXldLnB1c2gocGFyZW50VmFsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdG9wTGV2ZWwgJiZcbiAgICAgICAgICAgICh1dGlscy5pc1RydWVPYmplY3QodmFsKSB8fCB1dGlscy5pc1RydWVPYmplY3QocGFyZW50VmFsKSlcbiAgICAgICAgICAgICYmICEocGFyZW50VmFsIGluc3RhbmNlb2YgVmlld01vZGVsKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHRvcGxldmVsIG9iamVjdCBvcHRpb25zXG4gICAgICAgICAgICBjaGlsZFtrZXldID0gaW5oZXJpdE9wdGlvbnModmFsLCBwYXJlbnRWYWwpXG4gICAgICAgIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGluaGVyaXQgaWYgY2hpbGQgZG9lc24ndCBvdmVycmlkZVxuICAgICAgICAgICAgY2hpbGRba2V5XSA9IHBhcmVudFZhbFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGlsZFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2RlbCIsIi8qIGpzaGludCBwcm90bzp0cnVlICovXG5cbnZhciBFbWl0dGVyICA9IHJlcXVpcmUoJy4vZW1pdHRlcicpLFxuICAgIHV0aWxzICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIC8vIGNhY2hlIG1ldGhvZHNcbiAgICBkZWYgICAgICA9IHV0aWxzLmRlZlByb3RlY3RlZCxcbiAgICBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0LFxuICAgIGlzQXJyYXkgID0gQXJyYXkuaXNBcnJheSxcbiAgICBoYXNPd24gICA9ICh7fSkuaGFzT3duUHJvcGVydHksXG4gICAgb0RlZiAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgc2xpY2UgICAgPSBbXS5zbGljZSxcbiAgICAvLyBmaXggZm9yIElFICsgX19wcm90b19fIHByb2JsZW1cbiAgICAvLyBkZWZpbmUgbWV0aG9kcyBhcyBpbmVudW1lcmFibGUgaWYgX19wcm90b19fIGlzIHByZXNlbnQsXG4gICAgLy8gb3RoZXJ3aXNlIGVudW1lcmFibGUgc28gd2UgY2FuIGxvb3AgdGhyb3VnaCBhbmQgbWFudWFsbHlcbiAgICAvLyBhdHRhY2ggdG8gYXJyYXkgaW5zdGFuY2VzXG4gICAgaGFzUHJvdG8gPSAoe30pLl9fcHJvdG9fX1xuXG4vLyBBcnJheSBNdXRhdGlvbiBIYW5kbGVycyAmIEF1Z21lbnRhdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRoZSBwcm94eSBwcm90b3R5cGUgdG8gcmVwbGFjZSB0aGUgX19wcm90b19fIG9mXG4vLyBhbiBvYnNlcnZlZCBhcnJheVxudmFyIEFycmF5UHJveHkgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSlcblxuLy8gaW50ZXJjZXB0IG11dGF0aW9uIG1ldGhvZHNcbjtbXG4gICAgJ3B1c2gnLFxuICAgICdwb3AnLFxuICAgICdzaGlmdCcsXG4gICAgJ3Vuc2hpZnQnLFxuICAgICdzcGxpY2UnLFxuICAgICdzb3J0JyxcbiAgICAncmV2ZXJzZSdcbl0uZm9yRWFjaCh3YXRjaE11dGF0aW9uKVxuXG4vLyBBdWdtZW50IHRoZSBBcnJheVByb3h5IHdpdGggY29udmVuaWVuY2UgbWV0aG9kc1xuZGVmKEFycmF5UHJveHksICckc2V0JywgZnVuY3Rpb24gKGluZGV4LCBkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxLCBkYXRhKVswXVxufSwgIWhhc1Byb3RvKVxuXG5kZWYoQXJyYXlQcm94eSwgJyRyZW1vdmUnLCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhPZihpbmRleClcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxKVswXVxuICAgIH1cbn0sICFoYXNQcm90bylcblxuLyoqXG4gKiAgSW50ZXJjZXAgYSBtdXRhdGlvbiBldmVudCBzbyB3ZSBjYW4gZW1pdCB0aGUgbXV0YXRpb24gaW5mby5cbiAqICB3ZSBhbHNvIGFuYWx5emUgd2hhdCBlbGVtZW50cyBhcmUgYWRkZWQvcmVtb3ZlZCBhbmQgbGluay91bmxpbmtcbiAqICB0aGVtIHdpdGggdGhlIHBhcmVudCBBcnJheS5cbiAqL1xuZnVuY3Rpb24gd2F0Y2hNdXRhdGlvbiAobWV0aG9kKSB7XG4gICAgZGVmKEFycmF5UHJveHksIG1ldGhvZCwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpLFxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyksXG4gICAgICAgICAgICBpbnNlcnRlZCwgcmVtb3ZlZFxuXG4gICAgICAgIC8vIGRldGVybWluZSBuZXcgLyByZW1vdmVkIGVsZW1lbnRzXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdwdXNoJyB8fCBtZXRob2QgPT09ICd1bnNoaWZ0Jykge1xuICAgICAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAncG9wJyB8fCBtZXRob2QgPT09ICdzaGlmdCcpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSBbcmVzdWx0XVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3NwbGljZScpIHtcbiAgICAgICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKVxuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlc3VsdFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBsaW5rICYgdW5saW5rXG4gICAgICAgIGxpbmtBcnJheUVsZW1lbnRzKHRoaXMsIGluc2VydGVkKVxuICAgICAgICB1bmxpbmtBcnJheUVsZW1lbnRzKHRoaXMsIHJlbW92ZWQpXG5cbiAgICAgICAgLy8gZW1pdCB0aGUgbXV0YXRpb24gZXZlbnRcbiAgICAgICAgdGhpcy5fX2VtaXR0ZXJfXy5lbWl0KCdtdXRhdGUnLCAnJywgdGhpcywge1xuICAgICAgICAgICAgbWV0aG9kICAgOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzICAgICA6IGFyZ3MsXG4gICAgICAgICAgICByZXN1bHQgICA6IHJlc3VsdCxcbiAgICAgICAgICAgIGluc2VydGVkIDogaW5zZXJ0ZWQsXG4gICAgICAgICAgICByZW1vdmVkICA6IHJlbW92ZWRcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgIH0sICFoYXNQcm90bylcbn1cblxuLyoqXG4gKiAgTGluayBuZXcgZWxlbWVudHMgdG8gYW4gQXJyYXksIHNvIHdoZW4gdGhleSBjaGFuZ2VcbiAqICBhbmQgZW1pdCBldmVudHMsIHRoZSBvd25lciBBcnJheSBjYW4gYmUgbm90aWZpZWQuXG4gKi9cbmZ1bmN0aW9uIGxpbmtBcnJheUVsZW1lbnRzIChhcnIsIGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gaXRlbXMubGVuZ3RoLCBpdGVtLCBvd25lcnNcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldXG4gICAgICAgICAgICBpZiAoaXNXYXRjaGFibGUoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBvYmplY3QgaXMgbm90IGNvbnZlcnRlZCBmb3Igb2JzZXJ2aW5nXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBpdC4uLlxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5fX2VtaXR0ZXJfXykge1xuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0KGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIHdhdGNoKGl0ZW0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG93bmVycyA9IGl0ZW0uX19lbWl0dGVyX18ub3duZXJzXG4gICAgICAgICAgICAgICAgaWYgKG93bmVycy5pbmRleE9mKGFycikgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVycy5wdXNoKGFycilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIFVubGluayByZW1vdmVkIGVsZW1lbnRzIGZyb20gdGhlIGV4LW93bmVyIEFycmF5LlxuICovXG5mdW5jdGlvbiB1bmxpbmtBcnJheUVsZW1lbnRzIChhcnIsIGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gaXRlbXMubGVuZ3RoLCBpdGVtXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpXVxuICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5fX2VtaXR0ZXJfXykge1xuICAgICAgICAgICAgICAgIHZhciBvd25lcnMgPSBpdGVtLl9fZW1pdHRlcl9fLm93bmVyc1xuICAgICAgICAgICAgICAgIGlmIChvd25lcnMpIG93bmVycy5zcGxpY2Uob3duZXJzLmluZGV4T2YoYXJyKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gT2JqZWN0IGFkZC9kZWxldGUga2V5IGF1Z21lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgT2JqUHJveHkgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUpXG5cbmRlZihPYmpQcm94eSwgJyRhZGQnLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICBpZiAoaGFzT3duLmNhbGwodGhpcywga2V5KSkgcmV0dXJuXG4gICAgdGhpc1trZXldID0gdmFsXG4gICAgY29udmVydEtleSh0aGlzLCBrZXksIHRydWUpXG59LCAhaGFzUHJvdG8pXG5cbmRlZihPYmpQcm94eSwgJyRkZWxldGUnLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoaGFzT3duLmNhbGwodGhpcywga2V5KSkpIHJldHVyblxuICAgIC8vIHRyaWdnZXIgc2V0IGV2ZW50c1xuICAgIHRoaXNba2V5XSA9IHVuZGVmaW5lZFxuICAgIGRlbGV0ZSB0aGlzW2tleV1cbiAgICB0aGlzLl9fZW1pdHRlcl9fLmVtaXQoJ2RlbGV0ZScsIGtleSlcbn0sICFoYXNQcm90bylcblxuLy8gV2F0Y2ggSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBDaGVjayBpZiBhIHZhbHVlIGlzIHdhdGNoYWJsZVxuICovXG5mdW5jdGlvbiBpc1dhdGNoYWJsZSAob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAmJiAhb2JqLiRjb21waWxlclxufVxuXG4vKipcbiAqICBDb252ZXJ0IGFuIE9iamVjdC9BcnJheSB0byBnaXZlIGl0IGEgY2hhbmdlIGVtaXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnQgKG9iaikge1xuICAgIGlmIChvYmouX19lbWl0dGVyX18pIHJldHVybiB0cnVlXG4gICAgdmFyIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgZGVmKG9iaiwgJ19fZW1pdHRlcl9fJywgZW1pdHRlcilcbiAgICBlbWl0dGVyXG4gICAgICAgIC5vbignc2V0JywgZnVuY3Rpb24gKGtleSwgdmFsLCBwcm9wYWdhdGUpIHtcbiAgICAgICAgICAgIGlmIChwcm9wYWdhdGUpIHByb3BhZ2F0ZUNoYW5nZShvYmopXG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbXV0YXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJvcGFnYXRlQ2hhbmdlKG9iailcbiAgICAgICAgfSlcbiAgICBlbWl0dGVyLnZhbHVlcyA9IHV0aWxzLmhhc2goKVxuICAgIGVtaXR0ZXIub3duZXJzID0gW11cbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiAgUHJvcGFnYXRlIGFuIGFycmF5IGVsZW1lbnQncyBjaGFuZ2UgdG8gaXRzIG93bmVyIGFycmF5c1xuICovXG5mdW5jdGlvbiBwcm9wYWdhdGVDaGFuZ2UgKG9iaikge1xuICAgIHZhciBvd25lcnMgPSBvYmouX19lbWl0dGVyX18ub3duZXJzLFxuICAgICAgICBpID0gb3duZXJzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgb3duZXJzW2ldLl9fZW1pdHRlcl9fLmVtaXQoJ3NldCcsICcnLCAnJywgdHJ1ZSlcbiAgICB9XG59XG5cbi8qKlxuICogIFdhdGNoIHRhcmdldCBiYXNlZCBvbiBpdHMgdHlwZVxuICovXG5mdW5jdGlvbiB3YXRjaCAob2JqKSB7XG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICB3YXRjaEFycmF5KG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXRjaE9iamVjdChvYmopXG4gICAgfVxufVxuXG4vKipcbiAqICBBdWdtZW50IHRhcmdldCBvYmplY3RzIHdpdGggbW9kaWZpZWRcbiAqICBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIGF1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gICAgaWYgKGhhc1Byb3RvKSB7XG4gICAgICAgIHRhcmdldC5fX3Byb3RvX18gPSBzcmNcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZWYodGFyZ2V0LCBrZXksIHNyY1trZXldKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBXYXRjaCBhbiBPYmplY3QsIHJlY3Vyc2l2ZS5cbiAqL1xuZnVuY3Rpb24gd2F0Y2hPYmplY3QgKG9iaikge1xuICAgIGF1Z21lbnQob2JqLCBPYmpQcm94eSlcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnZlcnRLZXkob2JqLCBrZXkpXG4gICAgfVxufVxuXG4vKipcbiAqICBXYXRjaCBhbiBBcnJheSwgb3ZlcmxvYWQgbXV0YXRpb24gbWV0aG9kc1xuICogIGFuZCBhZGQgYXVnbWVudGF0aW9ucyBieSBpbnRlcmNlcHRpbmcgdGhlIHByb3RvdHlwZSBjaGFpblxuICovXG5mdW5jdGlvbiB3YXRjaEFycmF5IChhcnIpIHtcbiAgICBhdWdtZW50KGFyciwgQXJyYXlQcm94eSlcbiAgICBsaW5rQXJyYXlFbGVtZW50cyhhcnIsIGFycilcbn1cblxuLyoqXG4gKiAgRGVmaW5lIGFjY2Vzc29ycyBmb3IgYSBwcm9wZXJ0eSBvbiBhbiBPYmplY3RcbiAqICBzbyBpdCBlbWl0cyBnZXQvc2V0IGV2ZW50cy5cbiAqICBUaGVuIHdhdGNoIHRoZSB2YWx1ZSBpdHNlbGYuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRLZXkgKG9iaiwga2V5LCBwcm9wYWdhdGUpIHtcbiAgICB2YXIga2V5UHJlZml4ID0ga2V5LmNoYXJBdCgwKVxuICAgIGlmIChrZXlQcmVmaXggPT09ICckJyB8fCBrZXlQcmVmaXggPT09ICdfJykge1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gZW1pdCBzZXQgb24gYmluZFxuICAgIC8vIHRoaXMgbWVhbnMgd2hlbiBhbiBvYmplY3QgaXMgb2JzZXJ2ZWQgaXQgd2lsbCBlbWl0XG4gICAgLy8gYSBmaXJzdCBiYXRjaCBvZiBzZXQgZXZlbnRzLlxuICAgIHZhciBlbWl0dGVyID0gb2JqLl9fZW1pdHRlcl9fLFxuICAgICAgICB2YWx1ZXMgID0gZW1pdHRlci52YWx1ZXNcblxuICAgIGluaXQob2JqW2tleV0sIHByb3BhZ2F0ZSlcblxuICAgIG9EZWYob2JqLCBrZXksIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1trZXldXG4gICAgICAgICAgICAvLyBvbmx5IGVtaXQgZ2V0IG9uIHRpcCB2YWx1ZXNcbiAgICAgICAgICAgIGlmIChwdWIuc2hvdWxkR2V0KSB7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdnZXQnLCBrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICB2YXIgb2xkVmFsID0gdmFsdWVzW2tleV1cbiAgICAgICAgICAgIHVub2JzZXJ2ZShvbGRWYWwsIGtleSwgZW1pdHRlcilcbiAgICAgICAgICAgIGNvcHlQYXRocyhuZXdWYWwsIG9sZFZhbClcbiAgICAgICAgICAgIC8vIGFuIGltbWVkaWF0ZSBwcm9wZXJ0eSBzaG91bGQgbm90aWZ5IGl0cyBwYXJlbnRcbiAgICAgICAgICAgIC8vIHRvIGVtaXQgc2V0IGZvciBpdHNlbGYgdG9vXG4gICAgICAgICAgICBpbml0KG5ld1ZhbCwgdHJ1ZSlcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBpbml0ICh2YWwsIHByb3BhZ2F0ZSkge1xuICAgICAgICB2YWx1ZXNba2V5XSA9IHZhbFxuICAgICAgICBlbWl0dGVyLmVtaXQoJ3NldCcsIGtleSwgdmFsLCBwcm9wYWdhdGUpXG4gICAgICAgIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0Jywga2V5ICsgJy5sZW5ndGgnLCB2YWwubGVuZ3RoLCBwcm9wYWdhdGUpXG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZSh2YWwsIGtleSwgZW1pdHRlcilcbiAgICB9XG59XG5cbi8qKlxuICogIFdoZW4gYSB2YWx1ZSB0aGF0IGlzIGFscmVhZHkgY29udmVydGVkIGlzXG4gKiAgb2JzZXJ2ZWQgYWdhaW4gYnkgYW5vdGhlciBvYnNlcnZlciwgd2UgY2FuIHNraXBcbiAqICB0aGUgd2F0Y2ggY29udmVyc2lvbiBhbmQgc2ltcGx5IGVtaXQgc2V0IGV2ZW50IGZvclxuICogIGFsbCBvZiBpdHMgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gZW1pdFNldCAob2JqKSB7XG4gICAgdmFyIGVtaXR0ZXIgPSBvYmogJiYgb2JqLl9fZW1pdHRlcl9fXG4gICAgaWYgKCFlbWl0dGVyKSByZXR1cm5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0JywgJ2xlbmd0aCcsIG9iai5sZW5ndGgpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleSwgdmFsXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgdmFsID0gb2JqW2tleV1cbiAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0Jywga2V5LCB2YWwpXG4gICAgICAgICAgICBlbWl0U2V0KHZhbClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgTWFrZSBzdXJlIGFsbCB0aGUgcGF0aHMgaW4gYW4gb2xkIG9iamVjdCBleGlzdHNcbiAqICBpbiBhIG5ldyBvYmplY3QuXG4gKiAgU28gd2hlbiBhbiBvYmplY3QgY2hhbmdlcywgYWxsIG1pc3Npbmcga2V5cyB3aWxsXG4gKiAgZW1pdCBhIHNldCBldmVudCB3aXRoIHVuZGVmaW5lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gY29weVBhdGhzIChuZXdPYmosIG9sZE9iaikge1xuICAgIGlmICghaXNPYmplY3QobmV3T2JqKSB8fCAhaXNPYmplY3Qob2xkT2JqKSkge1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIHBhdGgsIG9sZFZhbCwgbmV3VmFsXG4gICAgZm9yIChwYXRoIGluIG9sZE9iaikge1xuICAgICAgICBpZiAoIShoYXNPd24uY2FsbChuZXdPYmosIHBhdGgpKSkge1xuICAgICAgICAgICAgb2xkVmFsID0gb2xkT2JqW3BhdGhdXG4gICAgICAgICAgICBpZiAoaXNBcnJheShvbGRWYWwpKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqW3BhdGhdID0gW11cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob2xkVmFsKSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbCA9IG5ld09ialtwYXRoXSA9IHt9XG4gICAgICAgICAgICAgICAgY29weVBhdGhzKG5ld1ZhbCwgb2xkVmFsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmpbcGF0aF0gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgd2FsayBhbG9uZyBhIHBhdGggYW5kIG1ha2Ugc3VyZSBpdCBjYW4gYmUgYWNjZXNzZWRcbiAqICBhbmQgZW51bWVyYXRlZCBpbiB0aGF0IG9iamVjdFxuICovXG5mdW5jdGlvbiBlbnN1cmVQYXRoIChvYmosIGtleSkge1xuICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyksIHNlY1xuICAgIGZvciAodmFyIGkgPSAwLCBkID0gcGF0aC5sZW5ndGggLSAxOyBpIDwgZDsgaSsrKSB7XG4gICAgICAgIHNlYyA9IHBhdGhbaV1cbiAgICAgICAgaWYgKCFvYmpbc2VjXSkge1xuICAgICAgICAgICAgb2JqW3NlY10gPSB7fVxuICAgICAgICAgICAgaWYgKG9iai5fX2VtaXR0ZXJfXykgY29udmVydEtleShvYmosIHNlYylcbiAgICAgICAgfVxuICAgICAgICBvYmogPSBvYmpbc2VjXVxuICAgIH1cbiAgICBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgICBzZWMgPSBwYXRoW2ldXG4gICAgICAgIGlmICghKGhhc093bi5jYWxsKG9iaiwgc2VjKSkpIHtcbiAgICAgICAgICAgIG9ialtzZWNdID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAob2JqLl9fZW1pdHRlcl9fKSBjb252ZXJ0S2V5KG9iaiwgc2VjKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNYWluIEFQSSBNZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIE9ic2VydmUgYW4gb2JqZWN0IHdpdGggYSBnaXZlbiBwYXRoLFxuICogIGFuZCBwcm94eSBnZXQvc2V0L211dGF0ZSBldmVudHMgdG8gdGhlIHByb3ZpZGVkIG9ic2VydmVyLlxuICovXG5mdW5jdGlvbiBvYnNlcnZlIChvYmosIHJhd1BhdGgsIG9ic2VydmVyKSB7XG5cbiAgICBpZiAoIWlzV2F0Y2hhYmxlKG9iaikpIHJldHVyblxuXG4gICAgdmFyIHBhdGggPSByYXdQYXRoID8gcmF3UGF0aCArICcuJyA6ICcnLFxuICAgICAgICBhbHJlYWR5Q29udmVydGVkID0gY29udmVydChvYmopLFxuICAgICAgICBlbWl0dGVyID0gb2JqLl9fZW1pdHRlcl9fXG5cbiAgICAvLyBzZXR1cCBwcm94eSBsaXN0ZW5lcnMgb24gdGhlIHBhcmVudCBvYnNlcnZlci5cbiAgICAvLyB3ZSBuZWVkIHRvIGtlZXAgcmVmZXJlbmNlIHRvIHRoZW0gc28gdGhhdCB0aGV5XG4gICAgLy8gY2FuIGJlIHJlbW92ZWQgd2hlbiB0aGUgb2JqZWN0IGlzIHVuLW9ic2VydmVkLlxuICAgIG9ic2VydmVyLnByb3hpZXMgPSBvYnNlcnZlci5wcm94aWVzIHx8IHt9XG4gICAgdmFyIHByb3hpZXMgPSBvYnNlcnZlci5wcm94aWVzW3BhdGhdID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ2dldCcsIHBhdGggKyBrZXkpXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsLCBwcm9wYWdhdGUpIHtcbiAgICAgICAgICAgIGlmIChrZXkpIG9ic2VydmVyLmVtaXQoJ3NldCcsIHBhdGggKyBrZXksIHZhbClcbiAgICAgICAgICAgIC8vIGFsc28gbm90aWZ5IG9ic2VydmVyIHRoYXQgdGhlIG9iamVjdCBpdHNlbGYgY2hhbmdlZFxuICAgICAgICAgICAgLy8gYnV0IG9ubHkgZG8gc28gd2hlbiBpdCdzIGEgaW1tZWRpYXRlIHByb3BlcnR5LiB0aGlzXG4gICAgICAgICAgICAvLyBhdm9pZHMgZHVwbGljYXRlIGV2ZW50IGZpcmluZy5cbiAgICAgICAgICAgIGlmIChyYXdQYXRoICYmIHByb3BhZ2F0ZSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ3NldCcsIHJhd1BhdGgsIG9iaiwgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbXV0YXRlOiBmdW5jdGlvbiAoa2V5LCB2YWwsIG11dGF0aW9uKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgQXJyYXkgaXMgYSByb290IHZhbHVlXG4gICAgICAgICAgICAvLyB0aGUga2V5IHdpbGwgYmUgbnVsbFxuICAgICAgICAgICAgdmFyIGZpeGVkUGF0aCA9IGtleSA/IHBhdGggKyBrZXkgOiByYXdQYXRoXG4gICAgICAgICAgICBvYnNlcnZlci5lbWl0KCdtdXRhdGUnLCBmaXhlZFBhdGgsIHZhbCwgbXV0YXRpb24pXG4gICAgICAgICAgICAvLyBhbHNvIGVtaXQgc2V0IGZvciBBcnJheSdzIGxlbmd0aCB3aGVuIGl0IG11dGF0ZXNcbiAgICAgICAgICAgIHZhciBtID0gbXV0YXRpb24ubWV0aG9kXG4gICAgICAgICAgICBpZiAobSAhPT0gJ3NvcnQnICYmIG0gIT09ICdyZXZlcnNlJykge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ3NldCcsIGZpeGVkUGF0aCArICcubGVuZ3RoJywgdmFsLmxlbmd0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF0dGFjaCB0aGUgbGlzdGVuZXJzIHRvIHRoZSBjaGlsZCBvYnNlcnZlci5cbiAgICAvLyBub3cgYWxsIHRoZSBldmVudHMgd2lsbCBwcm9wYWdhdGUgdXB3YXJkcy5cbiAgICBlbWl0dGVyXG4gICAgICAgIC5vbignZ2V0JywgcHJveGllcy5nZXQpXG4gICAgICAgIC5vbignc2V0JywgcHJveGllcy5zZXQpXG4gICAgICAgIC5vbignbXV0YXRlJywgcHJveGllcy5tdXRhdGUpXG5cbiAgICBpZiAoYWxyZWFkeUNvbnZlcnRlZCkge1xuICAgICAgICAvLyBmb3Igb2JqZWN0cyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGNvbnZlcnRlZCxcbiAgICAgICAgLy8gZW1pdCBzZXQgZXZlbnRzIGZvciBldmVyeXRoaW5nIGluc2lkZVxuICAgICAgICBlbWl0U2V0KG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXRjaChvYmopXG4gICAgfVxufVxuXG4vKipcbiAqICBDYW5jZWwgb2JzZXJ2YXRpb24sIHR1cm4gb2ZmIHRoZSBsaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIHVub2JzZXJ2ZSAob2JqLCBwYXRoLCBvYnNlcnZlcikge1xuXG4gICAgaWYgKCFvYmogfHwgIW9iai5fX2VtaXR0ZXJfXykgcmV0dXJuXG5cbiAgICBwYXRoID0gcGF0aCA/IHBhdGggKyAnLicgOiAnJ1xuICAgIHZhciBwcm94aWVzID0gb2JzZXJ2ZXIucHJveGllc1twYXRoXVxuICAgIGlmICghcHJveGllcykgcmV0dXJuXG5cbiAgICAvLyB0dXJuIG9mZiBsaXN0ZW5lcnNcbiAgICBvYmouX19lbWl0dGVyX19cbiAgICAgICAgLm9mZignZ2V0JywgcHJveGllcy5nZXQpXG4gICAgICAgIC5vZmYoJ3NldCcsIHByb3hpZXMuc2V0KVxuICAgICAgICAub2ZmKCdtdXRhdGUnLCBwcm94aWVzLm11dGF0ZSlcblxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2VcbiAgICBvYnNlcnZlci5wcm94aWVzW3BhdGhdID0gbnVsbFxufVxuXG4vLyBFeHBvc2UgQVBJIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwdWIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8vIHdoZXRoZXIgdG8gZW1pdCBnZXQgZXZlbnRzXG4gICAgLy8gb25seSBlbmFibGVkIGR1cmluZyBkZXBlbmRlbmN5IHBhcnNpbmdcbiAgICBzaG91bGRHZXQgICA6IGZhbHNlLFxuXG4gICAgb2JzZXJ2ZSAgICAgOiBvYnNlcnZlLFxuICAgIHVub2JzZXJ2ZSAgIDogdW5vYnNlcnZlLFxuICAgIGVuc3VyZVBhdGggIDogZW5zdXJlUGF0aCxcbiAgICBjb3B5UGF0aHMgICA6IGNvcHlQYXRocyxcbiAgICB3YXRjaCAgICAgICA6IHdhdGNoLFxuICAgIGNvbnZlcnQgICAgIDogY29udmVydCxcbiAgICBjb252ZXJ0S2V5ICA6IGNvbnZlcnRLZXlcbn0iLCJ2YXIgdG9GcmFnbWVudCA9IHJlcXVpcmUoJy4vZnJhZ21lbnQnKTtcblxuLyoqXG4gKiBQYXJzZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgb3Igbm9kZSBhbmQgbm9ybWFsaXplcyBpdCBpbnRvIGFcbiAqIGEgbm9kZSB0aGF0IGNhbiBiZSB1c2VkIGFzIGEgcGFydGlhbCBvZiBhIHRlbXBsYXRlIG9wdGlvblxuICpcbiAqIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlXG4gKiBpZCBzZWxlY3RvcjogJyNzb21lLXRlbXBsYXRlLWlkJ1xuICogdGVtcGxhdGUgc3RyaW5nOiAnPGRpdj48c3Bhbj5teSB0ZW1wbGF0ZTwvc3Bhbj48L2Rpdj4nXG4gKiBEb2N1bWVudEZyYWdtZW50IG9iamVjdFxuICogTm9kZSBvYmplY3Qgb2YgdHlwZSBUZW1wbGF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgdmFyIHRlbXBsYXRlTm9kZTtcblxuICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIC8vIGlmIHRoZSB0ZW1wbGF0ZSBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQgLS0gZG8gbm90aGluZ1xuICAgICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyB0ZW1wbGF0ZSBieSBJRFxuICAgICAgICBpZiAodGVtcGxhdGUuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlLnNsaWNlKDEpKVxuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZU5vZGUpIHJldHVyblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRvRnJhZ21lbnQodGVtcGxhdGUpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XG4gICAgICAgIHRlbXBsYXRlTm9kZSA9IHRlbXBsYXRlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgICAvLyBpdHMgY29udGVudCBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQhXG4gICAgaWYgKHRlbXBsYXRlTm9kZS50YWdOYW1lID09PSAnVEVNUExBVEUnICYmIHRlbXBsYXRlTm9kZS5jb250ZW50KSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZU5vZGUuY29udGVudFxuICAgIH1cblxuICAgIGlmICh0ZW1wbGF0ZU5vZGUudGFnTmFtZSA9PT0gJ1NDUklQVCcpIHtcbiAgICAgICAgcmV0dXJuIHRvRnJhZ21lbnQodGVtcGxhdGVOb2RlLmlubmVySFRNTClcbiAgICB9XG5cbiAgICByZXR1cm4gdG9GcmFnbWVudCh0ZW1wbGF0ZU5vZGUub3V0ZXJIVE1MKTtcbn1cbiIsInZhciBvcGVuQ2hhciAgICAgICAgPSAneycsXG4gICAgZW5kQ2hhciAgICAgICAgID0gJ30nLFxuICAgIEVTQ0FQRV9SRSAgICAgICA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgLy8gbGF6eSByZXF1aXJlXG4gICAgRGlyZWN0aXZlXG5cbmV4cG9ydHMuUmVnZXggPSBidWlsZEludGVycG9sYXRpb25SZWdleCgpXG5cbmZ1bmN0aW9uIGJ1aWxkSW50ZXJwb2xhdGlvblJlZ2V4ICgpIHtcbiAgICB2YXIgb3BlbiA9IGVzY2FwZVJlZ2V4KG9wZW5DaGFyKSxcbiAgICAgICAgZW5kICA9IGVzY2FwZVJlZ2V4KGVuZENoYXIpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAob3BlbiArIG9wZW4gKyBvcGVuICsgJz8oLis/KScgKyBlbmQgKyAnPycgKyBlbmQgKyBlbmQpXG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4IChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoRVNDQVBFX1JFLCAnXFxcXCQmJylcbn1cblxuZnVuY3Rpb24gc2V0RGVsaW1pdGVycyAoZGVsaW1pdGVycykge1xuICAgIG9wZW5DaGFyID0gZGVsaW1pdGVyc1swXVxuICAgIGVuZENoYXIgPSBkZWxpbWl0ZXJzWzFdXG4gICAgZXhwb3J0cy5kZWxpbWl0ZXJzID0gZGVsaW1pdGVyc1xuICAgIGV4cG9ydHMuUmVnZXggPSBidWlsZEludGVycG9sYXRpb25SZWdleCgpXG59XG5cbi8qKiBcbiAqICBQYXJzZSBhIHBpZWNlIG9mIHRleHQsIHJldHVybiBhbiBhcnJheSBvZiB0b2tlbnNcbiAqICB0b2tlbiB0eXBlczpcbiAqICAxLiBwbGFpbiBzdHJpbmdcbiAqICAyLiBvYmplY3Qgd2l0aCBrZXkgPSBiaW5kaW5nIGtleVxuICogIDMuIG9iamVjdCB3aXRoIGtleSAmIGh0bWwgPSB0cnVlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlICh0ZXh0KSB7XG4gICAgaWYgKCFleHBvcnRzLlJlZ2V4LnRlc3QodGV4dCkpIHJldHVybiBudWxsXG4gICAgdmFyIG0sIGksIHRva2VuLCBtYXRjaCwgdG9rZW5zID0gW11cbiAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgIHdoaWxlIChtID0gdGV4dC5tYXRjaChleHBvcnRzLlJlZ2V4KSkge1xuICAgICAgICBpID0gbS5pbmRleFxuICAgICAgICBpZiAoaSA+IDApIHRva2Vucy5wdXNoKHRleHQuc2xpY2UoMCwgaSkpXG4gICAgICAgIHRva2VuID0geyBrZXk6IG1bMV0udHJpbSgpIH1cbiAgICAgICAgbWF0Y2ggPSBtWzBdXG4gICAgICAgIHRva2VuLmh0bWwgPVxuICAgICAgICAgICAgbWF0Y2guY2hhckF0KDIpID09PSBvcGVuQ2hhciAmJlxuICAgICAgICAgICAgbWF0Y2guY2hhckF0KG1hdGNoLmxlbmd0aCAtIDMpID09PSBlbmRDaGFyXG4gICAgICAgIHRva2Vucy5wdXNoKHRva2VuKVxuICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZShpICsgbVswXS5sZW5ndGgpXG4gICAgfVxuICAgIGlmICh0ZXh0Lmxlbmd0aCkgdG9rZW5zLnB1c2godGV4dClcbiAgICByZXR1cm4gdG9rZW5zXG59XG5cbi8qKlxuICogIFBhcnNlIGFuIGF0dHJpYnV0ZSB2YWx1ZSB3aXRoIHBvc3NpYmxlIGludGVycG9sYXRpb24gdGFnc1xuICogIHJldHVybiBhIERpcmVjdGl2ZS1mcmllbmRseSBleHByZXNzaW9uXG4gKlxuICogIGUuZy4gIGEge3tifX0gYyAgPT4gIFwiYSBcIiArIGIgKyBcIiBjXCJcbiAqL1xuZnVuY3Rpb24gcGFyc2VBdHRyIChhdHRyKSB7XG4gICAgRGlyZWN0aXZlID0gRGlyZWN0aXZlIHx8IHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiAgICB2YXIgdG9rZW5zID0gcGFyc2UoYXR0cilcbiAgICBpZiAoIXRva2VucykgcmV0dXJuIG51bGxcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRva2Vuc1swXS5rZXlcbiAgICB2YXIgcmVzID0gW10sIHRva2VuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICAgIHJlcy5wdXNoKFxuICAgICAgICAgICAgdG9rZW4ua2V5XG4gICAgICAgICAgICAgICAgPyBpbmxpbmVGaWx0ZXJzKHRva2VuLmtleSlcbiAgICAgICAgICAgICAgICA6ICgnXCInICsgdG9rZW4gKyAnXCInKVxuICAgICAgICApXG4gICAgfVxuICAgIHJldHVybiByZXMuam9pbignKycpXG59XG5cbi8qKlxuICogIElubGluZXMgYW55IHBvc3NpYmxlIGZpbHRlcnMgaW4gYSBiaW5kaW5nXG4gKiAgc28gdGhhdCB3ZSBjYW4gY29tYmluZSBldmVyeXRoaW5nIGludG8gYSBodWdlIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gaW5saW5lRmlsdGVycyAoa2V5KSB7XG4gICAgaWYgKGtleS5pbmRleE9mKCd8JykgPiAtMSkge1xuICAgICAgICB2YXIgZGlycyA9IERpcmVjdGl2ZS5wYXJzZShrZXkpLFxuICAgICAgICAgICAgZGlyID0gZGlycyAmJiBkaXJzWzBdXG4gICAgICAgIGlmIChkaXIgJiYgZGlyLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIGtleSA9IERpcmVjdGl2ZS5pbmxpbmVGaWx0ZXJzKFxuICAgICAgICAgICAgICAgIGRpci5rZXksXG4gICAgICAgICAgICAgICAgZGlyLmZpbHRlcnNcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJygnICsga2V5ICsgJyknXG59XG5cbmV4cG9ydHMucGFyc2UgICAgICAgICA9IHBhcnNlXG5leHBvcnRzLnBhcnNlQXR0ciAgICAgPSBwYXJzZUF0dHJcbmV4cG9ydHMuc2V0RGVsaW1pdGVycyA9IHNldERlbGltaXRlcnNcbmV4cG9ydHMuZGVsaW1pdGVycyAgICA9IFtvcGVuQ2hhciwgZW5kQ2hhcl0iLCJ2YXIgZW5kRXZlbnRzICA9IHNuaWZmRW5kRXZlbnRzKCksXG4gICAgY29uZmlnICAgICA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgLy8gYmF0Y2ggZW50ZXIgYW5pbWF0aW9ucyBzbyB3ZSBvbmx5IGZvcmNlIHRoZSBsYXlvdXQgb25jZVxuICAgIEJhdGNoZXIgICAgPSByZXF1aXJlKCcuL2JhdGNoZXInKSxcbiAgICBiYXRjaGVyICAgID0gbmV3IEJhdGNoZXIoKSxcbiAgICAvLyBjYWNoZSB0aW1lciBmdW5jdGlvbnNcbiAgICBzZXRUTyAgICAgID0gd2luZG93LnNldFRpbWVvdXQsXG4gICAgY2xlYXJUTyAgICA9IHdpbmRvdy5jbGVhclRpbWVvdXQsXG4gICAgLy8gZXhpdCBjb2RlcyBmb3IgdGVzdGluZ1xuICAgIGNvZGVzID0ge1xuICAgICAgICBDU1NfRSAgICAgOiAxLFxuICAgICAgICBDU1NfTCAgICAgOiAyLFxuICAgICAgICBKU19FICAgICAgOiAzLFxuICAgICAgICBKU19MICAgICAgOiA0LFxuICAgICAgICBDU1NfU0tJUCAgOiAtMSxcbiAgICAgICAgSlNfU0tJUCAgIDogLTIsXG4gICAgICAgIEpTX1NLSVBfRSA6IC0zLFxuICAgICAgICBKU19TS0lQX0wgOiAtNCxcbiAgICAgICAgSU5JVCAgICAgIDogLTUsXG4gICAgICAgIFNLSVAgICAgICA6IC02XG4gICAgfVxuXG4vLyBmb3JjZSBsYXlvdXQgYmVmb3JlIHRyaWdnZXJpbmcgdHJhbnNpdGlvbnMvYW5pbWF0aW9uc1xuYmF0Y2hlci5fcHJlRmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cbiAgICB2YXIgZiA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0XG59XG5cbi8qKlxuICogIHN0YWdlOlxuICogICAgMSA9IGVudGVyXG4gKiAgICAyID0gbGVhdmVcbiAqL1xudmFyIHRyYW5zaXRpb24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgc3RhZ2UsIGNiLCBjb21waWxlcikge1xuXG4gICAgdmFyIGNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYigpXG4gICAgICAgIGNvbXBpbGVyLmV4ZWNIb29rKHN0YWdlID4gMCA/ICdhdHRhY2hlZCcgOiAnZGV0YWNoZWQnKVxuICAgIH1cblxuICAgIGlmIChjb21waWxlci5pbml0KSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLklOSVRcbiAgICB9XG5cbiAgICB2YXIgaGFzVHJhbnNpdGlvbiA9IGVsLnZ1ZV90cmFucyA9PT0gJycsXG4gICAgICAgIGhhc0FuaW1hdGlvbiAgPSBlbC52dWVfYW5pbSA9PT0gJycsXG4gICAgICAgIGVmZmVjdElkICAgICAgPSBlbC52dWVfZWZmZWN0XG5cbiAgICBpZiAoZWZmZWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5VHJhbnNpdGlvbkZ1bmN0aW9ucyhcbiAgICAgICAgICAgIGVsLFxuICAgICAgICAgICAgc3RhZ2UsXG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSxcbiAgICAgICAgICAgIGVmZmVjdElkLFxuICAgICAgICAgICAgY29tcGlsZXJcbiAgICAgICAgKVxuICAgIH0gZWxzZSBpZiAoaGFzVHJhbnNpdGlvbiB8fCBoYXNBbmltYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5VHJhbnNpdGlvbkNsYXNzKFxuICAgICAgICAgICAgZWwsXG4gICAgICAgICAgICBzdGFnZSxcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlLFxuICAgICAgICAgICAgaGFzQW5pbWF0aW9uXG4gICAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5TS0lQXG4gICAgfVxuXG59XG5cbi8qKlxuICogIFRvZ2dnbGUgYSBDU1MgY2xhc3MgdG8gdHJpZ2dlciB0cmFuc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkNsYXNzIChlbCwgc3RhZ2UsIGNoYW5nZVN0YXRlLCBoYXNBbmltYXRpb24pIHtcblxuICAgIGlmICghZW5kRXZlbnRzLnRyYW5zKSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLkNTU19TS0lQXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHJhbnNpdGlvbixcbiAgICAvLyBpdCBtdXN0IGhhdmUgY2xhc3NMaXN0Li4uXG4gICAgdmFyIG9uRW5kLFxuICAgICAgICBjbGFzc0xpc3QgICAgICAgID0gZWwuY2xhc3NMaXN0LFxuICAgICAgICBleGlzdGluZ0NhbGxiYWNrID0gZWwudnVlX3RyYW5zX2NiLFxuICAgICAgICBlbnRlckNsYXNzICAgICAgID0gY29uZmlnLmVudGVyQ2xhc3MsXG4gICAgICAgIGxlYXZlQ2xhc3MgICAgICAgPSBjb25maWcubGVhdmVDbGFzcyxcbiAgICAgICAgZW5kRXZlbnQgICAgICAgICA9IGhhc0FuaW1hdGlvbiA/IGVuZEV2ZW50cy5hbmltIDogZW5kRXZlbnRzLnRyYW5zXG5cbiAgICAvLyBjYW5jZWwgdW5maW5pc2hlZCBjYWxsYmFja3MgYW5kIGpvYnNcbiAgICBpZiAoZXhpc3RpbmdDYWxsYmFjaykge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBleGlzdGluZ0NhbGxiYWNrKVxuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGVudGVyQ2xhc3MpXG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobGVhdmVDbGFzcylcbiAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChzdGFnZSA+IDApIHsgLy8gZW50ZXJcblxuICAgICAgICAvLyBzZXQgdG8gZW50ZXIgc3RhdGUgYmVmb3JlIGFwcGVuZGluZ1xuICAgICAgICBjbGFzc0xpc3QuYWRkKGVudGVyQ2xhc3MpXG4gICAgICAgIC8vIGFwcGVuZFxuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIC8vIHRyaWdnZXIgdHJhbnNpdGlvblxuICAgICAgICBpZiAoIWhhc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgYmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoZW50ZXJDbGFzcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb25FbmQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpXG4gICAgICAgICAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShlbnRlckNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gb25FbmRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29kZXMuQ1NTX0VcblxuICAgIH0gZWxzZSB7IC8vIGxlYXZlXG5cbiAgICAgICAgaWYgKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCkge1xuICAgICAgICAgICAgLy8gdHJpZ2dlciBoaWRlIHRyYW5zaXRpb25cbiAgICAgICAgICAgIGNsYXNzTGlzdC5hZGQobGVhdmVDbGFzcylcbiAgICAgICAgICAgIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFjdHVhbGx5IHJlbW92ZSBub2RlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGxlYXZlQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYXR0YWNoIHRyYW5zaXRpb24gZW5kIGxpc3RlbmVyXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZClcbiAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG9uRW5kXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkaXJlY3RseSByZW1vdmUgaW52aXNpYmxlIGVsZW1lbnRzXG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGVzLkNTU19MXG4gICAgICAgIFxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25GdW5jdGlvbnMgKGVsLCBzdGFnZSwgY2hhbmdlU3RhdGUsIGVmZmVjdElkLCBjb21waWxlcikge1xuXG4gICAgdmFyIGZ1bmNzID0gY29tcGlsZXIuZ2V0T3B0aW9uKCdlZmZlY3RzJywgZWZmZWN0SWQpXG4gICAgaWYgKCFmdW5jcykge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5KU19TS0lQXG4gICAgfVxuXG4gICAgdmFyIGVudGVyID0gZnVuY3MuZW50ZXIsXG4gICAgICAgIGxlYXZlID0gZnVuY3MubGVhdmUsXG4gICAgICAgIHRpbWVvdXRzID0gZWwudnVlX3RpbWVvdXRzXG5cbiAgICAvLyBjbGVhciBwcmV2aW91cyB0aW1lb3V0c1xuICAgIGlmICh0aW1lb3V0cykge1xuICAgICAgICB2YXIgaSA9IHRpbWVvdXRzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBjbGVhclRPKHRpbWVvdXRzW2ldKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGltZW91dHMgPSBlbC52dWVfdGltZW91dHMgPSBbXVxuICAgIGZ1bmN0aW9uIHRpbWVvdXQgKGNiLCBkZWxheSkge1xuICAgICAgICB2YXIgaWQgPSBzZXRUTyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYigpXG4gICAgICAgICAgICB0aW1lb3V0cy5zcGxpY2UodGltZW91dHMuaW5kZXhPZihpZCksIDEpXG4gICAgICAgICAgICBpZiAoIXRpbWVvdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsLnZ1ZV90aW1lb3V0cyA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgICAgIHRpbWVvdXRzLnB1c2goaWQpXG4gICAgfVxuXG4gICAgaWYgKHN0YWdlID4gMCkgeyAvLyBlbnRlclxuICAgICAgICBpZiAodHlwZW9mIGVudGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgICAgICByZXR1cm4gY29kZXMuSlNfU0tJUF9FXG4gICAgICAgIH1cbiAgICAgICAgZW50ZXIoZWwsIGNoYW5nZVN0YXRlLCB0aW1lb3V0KVxuICAgICAgICByZXR1cm4gY29kZXMuSlNfRVxuICAgIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgICAgIGlmICh0eXBlb2YgbGVhdmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgICAgIHJldHVybiBjb2Rlcy5KU19TS0lQX0xcbiAgICAgICAgfVxuICAgICAgICBsZWF2ZShlbCwgY2hhbmdlU3RhdGUsIHRpbWVvdXQpXG4gICAgICAgIHJldHVybiBjb2Rlcy5KU19MXG4gICAgfVxuXG59XG5cbi8qKlxuICogIFNuaWZmIHByb3BlciB0cmFuc2l0aW9uIGVuZCBldmVudCBuYW1lXG4gKi9cbmZ1bmN0aW9uIHNuaWZmRW5kRXZlbnRzICgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2dWUnKSxcbiAgICAgICAgZGVmYXVsdEV2ZW50ID0gJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICBldmVudHMgPSB7XG4gICAgICAgICAgICAnd2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAndHJhbnNpdGlvbicgICAgICAgOiBkZWZhdWx0RXZlbnQsXG4gICAgICAgICAgICAnbW96VHJhbnNpdGlvbicgICAgOiBkZWZhdWx0RXZlbnRcbiAgICAgICAgfSxcbiAgICAgICAgcmV0ID0ge31cbiAgICBmb3IgKHZhciBuYW1lIGluIGV2ZW50cykge1xuICAgICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0LnRyYW5zID0gZXZlbnRzW25hbWVdXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldC5hbmltID0gZWwuc3R5bGUuYW5pbWF0aW9uID09PSAnJ1xuICAgICAgICA/ICdhbmltYXRpb25lbmQnXG4gICAgICAgIDogJ3dlYmtpdEFuaW1hdGlvbkVuZCdcbiAgICByZXR1cm4gcmV0XG59XG5cbi8vIEV4cG9zZSBzb21lIHN0dWZmIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG50cmFuc2l0aW9uLmNvZGVzID0gY29kZXNcbnRyYW5zaXRpb24uc25pZmYgPSBzbmlmZkVuZEV2ZW50cyIsInZhciBjb25maWcgICAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIHRvU3RyaW5nICAgICA9ICh7fSkudG9TdHJpbmcsXG4gICAgd2luICAgICAgICAgID0gd2luZG93LFxuICAgIGNvbnNvbGUgICAgICA9IHdpbi5jb25zb2xlLFxuICAgIGRlZiAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICBPQkpFQ1QgICAgICAgPSAnb2JqZWN0JyxcbiAgICBUSElTX1JFICAgICAgPSAvW15cXHdddGhpc1teXFx3XS8sXG4gICAgQlJBQ0tFVF9SRV9TID0gL1xcWycoW14nXSspJ1xcXS9nLFxuICAgIEJSQUNLRVRfUkVfRCA9IC9cXFtcIihbXlwiXSspXCJcXF0vZyxcbiAgICBoYXNDbGFzc0xpc3QgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgVmlld01vZGVsIC8vIGxhdGUgZGVmXG5cbnZhciBkZWZlciA9XG4gICAgd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW4uc2V0VGltZW91dFxuXG4vKipcbiAqICBOb3JtYWxpemUga2V5cGF0aCB3aXRoIHBvc3NpYmxlIGJyYWNrZXRzIGludG8gZG90IG5vdGF0aW9uc1xuICovXG5mdW5jdGlvbiBub3JtYWxpemVLZXlwYXRoIChrZXkpIHtcbiAgICByZXR1cm4ga2V5LmluZGV4T2YoJ1snKSA8IDBcbiAgICAgICAgPyBrZXlcbiAgICAgICAgOiBrZXkucmVwbGFjZShCUkFDS0VUX1JFX1MsICcuJDEnKVxuICAgICAgICAgICAgIC5yZXBsYWNlKEJSQUNLRVRfUkVfRCwgJy4kMScpXG59XG5cbnZhciB1dGlscyA9IG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLyoqXG4gICAgICogIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBkb20gZnJhZ21lbnRcbiAgICAgKi9cbiAgICB0b0ZyYWdtZW50OiByZXF1aXJlKCcuL2ZyYWdtZW50JyksXG5cbiAgICAvKipcbiAgICAgKiAgUGFyc2UgdGhlIHZhcmlvdXMgdHlwZXMgb2YgdGVtcGxhdGUgb3B0aW9uc1xuICAgICAqL1xuICAgIHBhcnNlVGVtcGxhdGVPcHRpb246IHJlcXVpcmUoJy4vdGVtcGxhdGUtcGFyc2VyLmpzJyksXG5cbiAgICAvKipcbiAgICAgKiAgZ2V0IGEgdmFsdWUgZnJvbSBhbiBvYmplY3Qga2V5cGF0aFxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIGtleSA9IG5vcm1hbGl6ZUtleXBhdGgoa2V5KVxuICAgICAgICBpZiAoa2V5LmluZGV4T2YoJy4nKSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpba2V5XVxuICAgICAgICB9XG4gICAgICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgICBkID0gLTEsIGwgPSBwYXRoLmxlbmd0aFxuICAgICAgICB3aGlsZSAoKytkIDwgbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqID0gb2JqW3BhdGhbZF1dXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgc2V0IGEgdmFsdWUgdG8gYW4gb2JqZWN0IGtleXBhdGhcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsKSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIGtleSA9IG5vcm1hbGl6ZUtleXBhdGgoa2V5KVxuICAgICAgICBpZiAoa2V5LmluZGV4T2YoJy4nKSA8IDApIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IGtleS5zcGxpdCgnLicpLFxuICAgICAgICAgICAgZCA9IC0xLCBsID0gcGF0aC5sZW5ndGggLSAxXG4gICAgICAgIHdoaWxlICgrK2QgPCBsKSB7XG4gICAgICAgICAgICBpZiAob2JqW3BhdGhbZF1dID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmpbcGF0aFtkXV0gPSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqID0gb2JqW3BhdGhbZF1dXG4gICAgICAgIH1cbiAgICAgICAgb2JqW3BhdGhbZF1dID0gdmFsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICByZXR1cm4gdGhlIGJhc2Ugc2VnbWVudCBvZiBhIGtleXBhdGhcbiAgICAgKi9cbiAgICBiYXNlS2V5OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuaW5kZXhPZignLicpID4gMFxuICAgICAgICAgICAgPyBrZXkuc3BsaXQoJy4nKVswXVxuICAgICAgICAgICAgOiBrZXlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENyZWF0ZSBhIHByb3RvdHlwZS1sZXNzIG9iamVjdFxuICAgICAqICB3aGljaCBpcyBhIGJldHRlciBoYXNoL21hcFxuICAgICAqL1xuICAgIGhhc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIGdldCBhbiBhdHRyaWJ1dGUgYW5kIHJlbW92ZSBpdC5cbiAgICAgKi9cbiAgICBhdHRyOiBmdW5jdGlvbiAoZWwsIHR5cGUpIHtcbiAgICAgICAgdmFyIGF0dHIgPSBjb25maWcucHJlZml4ICsgJy0nICsgdHlwZSxcbiAgICAgICAgICAgIHZhbCA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgICAgICBpZiAodmFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBEZWZpbmUgYW4gaWVudW1lcmFibGUgcHJvcGVydHlcbiAgICAgKiAgVGhpcyBhdm9pZHMgaXQgYmVpbmcgaW5jbHVkZWQgaW4gSlNPTi5zdHJpbmdpZnlcbiAgICAgKiAgb3IgZm9yLi4uaW4gbG9vcHMuXG4gICAgICovXG4gICAgZGVmUHJvdGVjdGVkOiBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSwgd3JpdGFibGUpIHtcbiAgICAgICAgZGVmKG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZSAgICAgICAgOiB2YWwsXG4gICAgICAgICAgICBlbnVtZXJhYmxlICAgOiBlbnVtZXJhYmxlLFxuICAgICAgICAgICAgd3JpdGFibGUgICAgIDogd3JpdGFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGUgOiB0cnVlXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBBIGxlc3MgYnVsbGV0LXByb29mIGJ1dCBtb3JlIGVmZmljaWVudCB0eXBlIGNoZWNrXG4gICAgICogIHRoYW4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuICAgICAqL1xuICAgIGlzT2JqZWN0OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBPQkpFQ1QgJiYgb2JqICYmICFBcnJheS5pc0FycmF5KG9iailcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIEEgbW9yZSBhY2N1cmF0ZSBidXQgbGVzcyBlZmZpY2llbnQgdHlwZSBjaGVja1xuICAgICAqL1xuICAgIGlzVHJ1ZU9iamVjdDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgTW9zdCBzaW1wbGUgYmluZFxuICAgICAqICBlbm91Z2ggZm9yIHRoZSB1c2VjYXNlIGFuZCBmYXN0IHRoYW4gbmF0aXZlIGJpbmQoKVxuICAgICAqL1xuICAgIGJpbmQ6IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uY2FsbChjdHgsIGFyZylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgTWFrZSBzdXJlIG51bGwgYW5kIHVuZGVmaW5lZCBvdXRwdXQgZW1wdHkgc3RyaW5nXG4gICAgICovXG4gICAgZ3VhcmQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSwgZXFudWxsOiB0cnVlICovXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICA6ICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgICAgICAgICAgICAgICA6IHZhbHVlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBXaGVuIHNldHRpbmcgdmFsdWUgb24gdGhlIFZNLCBwYXJzZSBwb3NzaWJsZSBudW1iZXJzXG4gICAgICovXG4gICAgY2hlY2tOdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJylcbiAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgIDogTnVtYmVyKHZhbHVlKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgc2ltcGxlIGV4dGVuZFxuICAgICAqL1xuICAgIGV4dGVuZDogZnVuY3Rpb24gKG9iaiwgZXh0KSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBleHQpIHtcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSAhPT0gZXh0W2tleV0pIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGV4dFtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgZmlsdGVyIGFuIGFycmF5IHdpdGggZHVwbGljYXRlcyBpbnRvIHVuaXF1ZXNcbiAgICAgKi9cbiAgICB1bmlxdWU6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIGhhc2ggPSB1dGlscy5oYXNoKCksXG4gICAgICAgICAgICBpID0gYXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGtleSwgcmVzID0gW11cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAga2V5ID0gYXJyW2ldXG4gICAgICAgICAgICBpZiAoaGFzaFtrZXldKSBjb250aW51ZVxuICAgICAgICAgICAgaGFzaFtrZXldID0gMVxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENvbnZlcnQgdGhlIG9iamVjdCB0byBhIFZpZXdNb2RlbCBjb25zdHJ1Y3RvclxuICAgICAqICBpZiBpdCBpcyBub3QgYWxyZWFkeSBvbmVcbiAgICAgKi9cbiAgICB0b0NvbnN0cnVjdG9yOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIFZpZXdNb2RlbCA9IFZpZXdNb2RlbCB8fCByZXF1aXJlKCcuL3ZpZXdtb2RlbCcpXG4gICAgICAgIHJldHVybiB1dGlscy5pc09iamVjdChvYmopXG4gICAgICAgICAgICA/IFZpZXdNb2RlbC5leHRlbmQob2JqKVxuICAgICAgICAgICAgOiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgPyBvYmpcbiAgICAgICAgICAgICAgICA6IG51bGxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENoZWNrIGlmIGEgZmlsdGVyIGZ1bmN0aW9uIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gYHRoaXNgXG4gICAgICogIElmIHllcywgbWFyayBpdCBhcyBhIGNvbXB1dGVkIGZpbHRlci5cbiAgICAgKi9cbiAgICBjaGVja0ZpbHRlcjogZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICBpZiAoVEhJU19SRS50ZXN0KGZpbHRlci50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgZmlsdGVyLmNvbXB1dGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBjb252ZXJ0IGNlcnRhaW4gb3B0aW9uIHZhbHVlcyB0byB0aGUgZGVzaXJlZCBmb3JtYXQuXG4gICAgICovXG4gICAgcHJvY2Vzc09wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBjb21wb25lbnRzID0gb3B0aW9ucy5jb21wb25lbnRzLFxuICAgICAgICAgICAgcGFydGlhbHMgICA9IG9wdGlvbnMucGFydGlhbHMsXG4gICAgICAgICAgICB0ZW1wbGF0ZSAgID0gb3B0aW9ucy50ZW1wbGF0ZSxcbiAgICAgICAgICAgIGZpbHRlcnMgICAgPSBvcHRpb25zLmZpbHRlcnMsXG4gICAgICAgICAgICBrZXlcbiAgICAgICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW2tleV0gPSB1dGlscy50b0NvbnN0cnVjdG9yKGNvbXBvbmVudHNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydGlhbHMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbHNba2V5XSA9IHV0aWxzLnBhcnNlVGVtcGxhdGVPcHRpb24ocGFydGlhbHNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVycykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZmlsdGVycykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmNoZWNrRmlsdGVyKGZpbHRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSB1dGlscy5wYXJzZVRlbXBsYXRlT3B0aW9uKHRlbXBsYXRlKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICB1c2VkIHRvIGRlZmVyIGJhdGNoIHVwZGF0ZXNcbiAgICAgKi9cbiAgICBuZXh0VGljazogZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIGRlZmVyKGNiLCAwKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgYWRkIGNsYXNzIGZvciBJRTlcbiAgICAgKiAgdXNlcyBjbGFzc0xpc3QgaWYgYXZhaWxhYmxlXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChoYXNDbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGN1ciA9ICcgJyArIGVsLmNsYXNzTmFtZSArICcgJ1xuICAgICAgICAgICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gKGN1ciArIGNscykudHJpbSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHJlbW92ZSBjbGFzcyBmb3IgSUU5XG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChoYXNDbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGN1ciA9ICcgJyArIGVsLmNsYXNzTmFtZSArICcgJyxcbiAgICAgICAgICAgICAgICB0YXIgPSAnICcgKyBjbHMgKyAnICdcbiAgICAgICAgICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgICAgICAgICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGN1ci50cmltKClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQ29udmVydCBhbiBvYmplY3QgdG8gQXJyYXlcbiAgICAgKiAgdXNlZCBpbiB2LXJlcGVhdCBhbmQgYXJyYXkgZmlsdGVyc1xuICAgICAqL1xuICAgIG9iamVjdFRvQXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCB2YWwsIGRhdGFcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgdmFsID0gb2JqW2tleV1cbiAgICAgICAgICAgIGRhdGEgPSB1dGlscy5pc09iamVjdCh2YWwpXG4gICAgICAgICAgICAgICAgPyB2YWxcbiAgICAgICAgICAgICAgICA6IHsgJHZhbHVlOiB2YWwgfVxuICAgICAgICAgICAgZGF0YS4ka2V5ID0ga2V5XG4gICAgICAgICAgICByZXMucHVzaChkYXRhKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG59XG5cbmVuYWJsZURlYnVnKClcbmZ1bmN0aW9uIGVuYWJsZURlYnVnICgpIHtcbiAgICAvKipcbiAgICAgKiAgbG9nIGZvciBkZWJ1Z2dpbmdcbiAgICAgKi9cbiAgICB1dGlscy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmIChjb25maWcuZGVidWcgJiYgY29uc29sZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqICB3YXJuaW5ncywgdHJhY2VzIGJ5IGRlZmF1bHRcbiAgICAgKiAgY2FuIGJlIHN1cHByZXNzZWQgYnkgYHNpbGVudGAgb3B0aW9uLlxuICAgICAqL1xuICAgIHV0aWxzLndhcm4gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmICghY29uZmlnLnNpbGVudCAmJiBjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obXNnKVxuICAgICAgICAgICAgaWYgKGNvbmZpZy5kZWJ1ZyAmJiBjb25zb2xlLnRyYWNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS50cmFjZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwidmFyIENvbXBpbGVyICAgPSByZXF1aXJlKCcuL2NvbXBpbGVyJyksXG4gICAgdXRpbHMgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi90cmFuc2l0aW9uJyksXG4gICAgQmF0Y2hlciAgICA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpLFxuICAgIHNsaWNlICAgICAgPSBbXS5zbGljZSxcbiAgICBkZWYgICAgICAgID0gdXRpbHMuZGVmUHJvdGVjdGVkLFxuICAgIG5leHRUaWNrICAgPSB1dGlscy5uZXh0VGljayxcblxuICAgIC8vIGJhdGNoICR3YXRjaCBjYWxsYmFja3NcbiAgICB3YXRjaGVyQmF0Y2hlciA9IG5ldyBCYXRjaGVyKCksXG4gICAgd2F0Y2hlcklkICAgICAgPSAxXG5cbi8qKlxuICogIFZpZXdNb2RlbCBleHBvc2VkIHRvIHRoZSB1c2VyIHRoYXQgaG9sZHMgZGF0YSxcbiAqICBjb21wdXRlZCBwcm9wZXJ0aWVzLCBldmVudCBoYW5kbGVyc1xuICogIGFuZCBhIGZldyByZXNlcnZlZCBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIFZpZXdNb2RlbCAob3B0aW9ucykge1xuICAgIC8vIGNvbXBpbGUgaWYgb3B0aW9ucyBwYXNzZWQsIGlmIGZhbHNlIHJldHVybi4gb3B0aW9ucyBhcmUgcGFzc2VkIGRpcmVjdGx5IHRvIGNvbXBpbGVyXG4gICAgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSByZXR1cm5cbiAgICBuZXcgQ29tcGlsZXIodGhpcywgb3B0aW9ucylcbn1cblxuLy8gQWxsIFZNIHByb3RvdHlwZSBtZXRob2RzIGFyZSBpbmVudW1lcmFibGVcbi8vIHNvIGl0IGNhbiBiZSBzdHJpbmdpZmllZC9sb29wZWQgdGhyb3VnaCBhcyByYXcgZGF0YVxudmFyIFZNUHJvdG8gPSBWaWV3TW9kZWwucHJvdG90eXBlXG5cbi8qKlxuICogIGluaXQgYWxsb3dzIGNvbmZpZyBjb21waWxhdGlvbiBhZnRlciBpbnN0YW50aWF0aW9uOlxuICogICAgdmFyIGEgPSBuZXcgVnVlKGZhbHNlKVxuICogICAgYS5pbml0KGNvbmZpZylcbiAqL1xuZGVmKFZNUHJvdG8sICckaW5pdCcsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgbmV3IENvbXBpbGVyKHRoaXMsIG9wdGlvbnMpXG59KVxuXG4vKipcbiAqICBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBnZXQgYSB2YWx1ZSBmcm9tXG4gKiAgYSBrZXlwYXRoXG4gKi9cbmRlZihWTVByb3RvLCAnJGdldCcsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gdXRpbHMuZ2V0KHRoaXMsIGtleSlcbiAgICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgJiYgdGhpcy4kcGFyZW50XG4gICAgICAgID8gdGhpcy4kcGFyZW50LiRnZXQoa2V5KVxuICAgICAgICA6IHZhbFxufSlcblxuLyoqXG4gKiAgQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gc2V0IGFuIGFjdHVhbCBuZXN0ZWQgdmFsdWVcbiAqICBmcm9tIGEgZmxhdCBrZXkgc3RyaW5nLiBVc2VkIGluIGRpcmVjdGl2ZXMuXG4gKi9cbmRlZihWTVByb3RvLCAnJHNldCcsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdXRpbHMuc2V0KHRoaXMsIGtleSwgdmFsdWUpXG59KVxuXG4vKipcbiAqICB3YXRjaCBhIGtleSBvbiB0aGUgdmlld21vZGVsIGZvciBjaGFuZ2VzXG4gKiAgZmlyZSBjYWxsYmFjayB3aXRoIG5ldyB2YWx1ZVxuICovXG5kZWYoVk1Qcm90bywgJyR3YXRjaCcsIGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gICAgLy8gc2F2ZSBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB3YXRjaGVyXG4gICAgdmFyIGlkID0gd2F0Y2hlcklkKyssXG4gICAgICAgIHNlbGYgPSB0aGlzXG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgICAgICB3YXRjaGVyQmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3MpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGNhbGxiYWNrLl9mbiA9IG9uXG4gICAgc2VsZi4kY29tcGlsZXIub2JzZXJ2ZXIub24oJ2NoYW5nZTonICsga2V5LCBvbilcbn0pXG5cbi8qKlxuICogIHVud2F0Y2ggYSBrZXlcbiAqL1xuZGVmKFZNUHJvdG8sICckdW53YXRjaCcsIGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gICAgLy8gd29ya2Fyb3VuZCBoZXJlXG4gICAgLy8gc2luY2UgdGhlIGVtaXR0ZXIgbW9kdWxlIGNoZWNrcyBjYWxsYmFjayBleGlzdGVuY2VcbiAgICAvLyBieSBjaGVja2luZyB0aGUgbGVuZ3RoIG9mIGFyZ3VtZW50c1xuICAgIHZhciBhcmdzID0gWydjaGFuZ2U6JyArIGtleV0sXG4gICAgICAgIG9iID0gdGhpcy4kY29tcGlsZXIub2JzZXJ2ZXJcbiAgICBpZiAoY2FsbGJhY2spIGFyZ3MucHVzaChjYWxsYmFjay5fZm4pXG4gICAgb2Iub2ZmLmFwcGx5KG9iLCBhcmdzKVxufSlcblxuLyoqXG4gKiAgdW5iaW5kIGV2ZXJ5dGhpbmcsIHJlbW92ZSBldmVyeXRoaW5nXG4gKi9cbmRlZihWTVByb3RvLCAnJGRlc3Ryb3knLCBmdW5jdGlvbiAobm9SZW1vdmUpIHtcbiAgICB0aGlzLiRjb21waWxlci5kZXN0cm95KG5vUmVtb3ZlKVxufSlcblxuLyoqXG4gKiAgYnJvYWRjYXN0IGFuIGV2ZW50IHRvIGFsbCBjaGlsZCBWTXMgcmVjdXJzaXZlbHkuXG4gKi9cbmRlZihWTVByb3RvLCAnJGJyb2FkY2FzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLiRjb21waWxlci5jaGlsZHJlbixcbiAgICAgICAgaSA9IGNoaWxkcmVuLmxlbmd0aCxcbiAgICAgICAgY2hpbGRcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICAgICAgY2hpbGQuZW1pdHRlci5hcHBseUVtaXQuYXBwbHkoY2hpbGQuZW1pdHRlciwgYXJndW1lbnRzKVxuICAgICAgICBjaGlsZC52bS4kYnJvYWRjYXN0LmFwcGx5KGNoaWxkLnZtLCBhcmd1bWVudHMpXG4gICAgfVxufSlcblxuLyoqXG4gKiAgZW1pdCBhbiBldmVudCB0aGF0IHByb3BhZ2F0ZXMgYWxsIHRoZSB3YXkgdXAgdG8gcGFyZW50IFZNcy5cbiAqL1xuZGVmKFZNUHJvdG8sICckZGlzcGF0Y2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcy4kY29tcGlsZXIsXG4gICAgICAgIGVtaXR0ZXIgPSBjb21waWxlci5lbWl0dGVyLFxuICAgICAgICBwYXJlbnQgPSBjb21waWxlci5wYXJlbnRcbiAgICBlbWl0dGVyLmFwcGx5RW1pdC5hcHBseShlbWl0dGVyLCBhcmd1bWVudHMpXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQudm0uJGRpc3BhdGNoLmFwcGx5KHBhcmVudC52bSwgYXJndW1lbnRzKVxuICAgIH1cbn0pXG5cbi8qKlxuICogIGRlbGVnYXRlIG9uL29mZi9vbmNlIHRvIHRoZSBjb21waWxlcidzIGVtaXR0ZXJcbiAqL1xuO1snZW1pdCcsICdvbicsICdvZmYnLCAnb25jZSddLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIC8vIGludGVybmFsIGVtaXQgaGFzIGZpeGVkIG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgLy8gZXhwb3NlZCBlbWl0IHVzZXMgdGhlIGV4dGVybmFsIHZlcnNpb25cbiAgICAvLyB3aXRoIGZuLmFwcGx5LlxuICAgIHZhciByZWFsTWV0aG9kID0gbWV0aG9kID09PSAnZW1pdCdcbiAgICAgICAgPyAnYXBwbHlFbWl0J1xuICAgICAgICA6IG1ldGhvZFxuICAgIGRlZihWTVByb3RvLCAnJCcgKyBtZXRob2QsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVtaXR0ZXIgPSB0aGlzLiRjb21waWxlci5lbWl0dGVyXG4gICAgICAgIGVtaXR0ZXJbcmVhbE1ldGhvZF0uYXBwbHkoZW1pdHRlciwgYXJndW1lbnRzKVxuICAgIH0pXG59KVxuXG4vLyBET00gY29udmVuaWVuY2UgbWV0aG9kc1xuXG5kZWYoVk1Qcm90bywgJyRhcHBlbmRUbycsIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRyZW1vdmUnLCBmdW5jdGlvbiAoY2IpIHtcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRiZWZvcmUnLCBmdW5jdGlvbiAodGFyZ2V0LCBjYikge1xuICAgIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQpXG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRhZnRlcicsIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5uZXh0U2libGluZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5mdW5jdGlvbiBxdWVyeSAoZWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVsID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgICAgIDogZWxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TW9kZWxcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKlxuICAgICAgICBSb3V0ZSBwYXJhbXNcbiAgICAgICAgVXNlZCBieSB0aGUgcm91dGVyIGFuZCB0aGUgY3VzdG9tIHYtdmlld1xuICAgICAgICBpZDogcGFnZSBzbHVnXG4gICAgICAgIHRyYW5zaXRpb25Nb2RlOiB0aW1pbmcgKHNlZSB2aWV3IGZvciBpbmZvcylcbiAgICAgICAgcGFyYW1zOiBpbmplY3RlZCBieSB0aGUgdmlldyBmcm9tIHJvdXRlciBpbmZvc1xuICAgICovXG4gICAgcm91dGU6IHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICB0cmFuc2l0aW9uTW9kZTogJ291dEFuZEFmdGVySW4nLFxuICAgICAgICBwYXJhbXM6IHt9XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIC8qXG4gICAgICAgICAgICBQVUJMSUMgQVBJXG4gICAgICAgICAgICBPdmVycmlkYWJsZSBiZWhhdmlvclxuICAgICAgICAqL1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBDYW4gYmUgb3ZlcnJpZGVuIGlmIHRoZSBzZWN0aW9ucyB0cmFuc2l0aW9uIG5lZWRzIHRvIGJlIGRpZmZlcmVudCBkZXBlbmRpbmcgb24gdGhlIHByZXZpb3VzIHJvdXRlLiBIYW5kbGUgd2l0aCBjYXJlICFcbiAgICAgICAgICovXG4gICAgICAgIGdldFRyYW5zaXRpb25Nb2RlOiBmdW5jdGlvbihwcmV2aW91c1JvdXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kb3B0aW9ucy5yb3V0ZS50cmFuc2l0aW9uTW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgICAgU3RhcnRzIHRoZSB0cmFuc2l0aW9uSW4sIG92ZXJyaWRlIGl0IGlmIHlvdSBuZWVkIHRvIHBsYXkgc29tZXRoaW5nIGVsc2UgdGhhbiB0aGUgZGVmYXVsdCBUaW1lbGluZSBkZXBlbmRpbmcgb24gcHJldmlvdXMgcm91dGUuXG4gICAgICAgICAgICBleDpcbiAgICAgICAgICAgICAgICBpZihwcmV2aW91c1JvdXRlICYmIHByZXZpb3VzUm91dGUuaWQgPT09ICdob21lJykgdGhpcy50bFRyYW5zaXRpb24ucGxheSgpO1xuICAgICAgICAgICAgICAgIGVsc2UgVHdlZW5NYXguZnJvbVRvKHRoaXMuJGVsLCAxLCB7YWxwaGE6IDB9LCB7YWxwaGE6IDEsIG9uQ29tcGxldGU6IHRoaXMub25UcmFuc2l0aW9uSW5Db21wbGV0ZSwgb25Db21wbGV0ZVNjb3BlOiB0aGlzfSk7XG4gICAgICAgICovXG4gICAgICAgIHBsYXlUcmFuc2l0aW9uSW46IGZ1bmN0aW9uKHByZXZpb3VzUm91dGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWN0aW9uIC0gcGxheVRyYW5zaXRpb25JbicpO1xuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24ucGxheSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBTdGFydHMgdGhlIHRyYW5zaXRpb25PdXQsIG92ZXJyaWRlIGl0IGlmIHlvdSBuZWVkIHRvIHBsYXkgc29tZXRoaW5nIGVsc2UgdGhhbiB0aGUgZGVmYXVsdCBUaW1lbGluZSBkZXBlbmRpbmcgb24gbmV4dCByb3V0ZS5cbiAgICAgICAgKi9cbiAgICAgICAgcGxheVRyYW5zaXRpb25PdXQ6IGZ1bmN0aW9uKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24ucmV2ZXJzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBBbGxvdyB0byByZXNpemUgYW5kIG1hbmlwdWxhdGUgdGhlIERPTSBiZWZvcmUgY3JlYXRpbmcgdGhlIHRyYW5zaXRpb25zXG4gICAgICAgICovXG4gICAgICAgIGJlZm9yZVRyYW5zaXRpb25JbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZWN0aW9uXSAtIFlvdSBuZWVkIHRvIG92ZXJyaWRlIHNlY3Rpb24uYmVmb3JlVHJhbnNpdGlvbkluOicsIHRoaXMuJG9wdGlvbnMucm91dGUuaWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgICBDcmVhdGUgdGhlIGRpZmZlcmVudCB0d2VlbiBpbnRvIHRoZSB0cmFuc2l0aW9uSW4vT3V0IFRpbWVsaW5lc1xuICAgICAgICAqL1xuICAgICAgICBpbnNlcnRUd2VlbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2VjdGlvbl0gLSBZb3UgbmVlZCB0byBvdmVycmlkZSBzZWN0aW9uLmluc2VydFR3ZWVuczonLCB0aGlzLiRvcHRpb25zLnJvdXRlLmlkKTtcbiAgICAgICAgICAgIHRoaXMudGxUcmFuc2l0aW9uLmZyb21Ubyh0aGlzLiRlbCwgMC40LCB7b3BhY2l0eTogMH0sIHtvcGFjaXR5OiAxfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIFBSSVZBVEUgQVBJXG4gICAgICAgICAgICBJbnRlcm5hbCBiZWhhdmlvclxuICAgICAgICAqL1xuICAgICAgICB0cmFuc2l0aW9uSW46IGZ1bmN0aW9uKHByZXZpb3VzUm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgICAgICB0aGlzLnBsYXlUcmFuc2l0aW9uSW4ocHJldmlvdXNSb3V0ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVHJhbnNpdGlvbkluQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnc2VjdGlvbjp0cmFuc2l0aW9uSW5Db21wbGV0ZScpO1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2l0aW9uT3V0OiBmdW5jdGlvbihuZXh0Um91dGUpIHtcbiAgICAgICAgICAgIHRoaXMucGxheVRyYW5zaXRpb25PdXQobmV4dFJvdXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25UcmFuc2l0aW9uT3V0Q29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnc2VjdGlvbjp0cmFuc2l0aW9uT3V0Q29tcGxldGUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlVGltZWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24gPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMub25UcmFuc2l0aW9uSW5Db21wbGV0ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlU2NvcGU6IHRoaXMsXG4gICAgICAgICAgICAgICAgb25SZXZlcnNlQ29tcGxldGU6IHRoaXMub25UcmFuc2l0aW9uT3V0Q29tcGxldGUsXG4gICAgICAgICAgICAgICAgb25SZXZlcnNlQ29tcGxldGVTY29wZTogdGhpcyxcbiAgICAgICAgICAgICAgICBwYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbk91dCA9IG5ldyBUaW1lbGluZU1heCh7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5vblRyYW5zaXRpb25PdXRDb21wbGV0ZSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlU2NvcGU6IHRoaXMsXG4gICAgICAgICAgICAgICAgcGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlY3Rpb24gLSBjcmVhdGVUaW1lbGluZScpO1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2l0aW9uc1JlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QuJGVtaXQoJ3NlY3Rpb246dHJhbnNpdGlvbnNSZWFkeScpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlY3Rpb24gLSB0cmFuc2l0aW9uc1JlYWR5Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlVHJhbnNpdGlvbkluKCk7IC8vIE92ZXJyaWRlIHRoYXQgYml0Y2hcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVGltZWxpbmUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0VHdlZW5zKCk7IC8vIE92ZXJyaWRlIHRoaXNcblxuICAgICAgICAgICAgVnVlLm5leHRUaWNrKHRoaXMudHJhbnNpdGlvbnNSZWFkeS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblxuICAgICAgICB0aGlzLiRvbmNlKCdob29rOmFkZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBWdWUubmV4dFRpY2sodGhpcy5hZGRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kb25jZSgnaG9vazpyb3V0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHdhbnQgdG8gaGFuZGxlIHByZWxvYWQgb3IgcHJvbWlzZXMgcmVzb2x2aW5nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJG9uY2UoJ2hvb2s6YmVmb3JlRGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYodGhpcy50bFRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5raWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy50bFRyYW5zaXRpb25PdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbk91dC5raWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50bFRyYW5zaXRpb25PdXQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gICAgVmlld1xuICAgIEVuaGFuY2VkIHYtdmlldyBhbGxvd2luZyB0byBtYW5hZ2UgdGltaW5nIGJldHdlZW4gdHJhbnNpdGlvbnNcbiAgICAtIHRyYW5zaXRpb24gSW4gdGhlbiBPdXQsXG4gICAgLSB0cmFuc2l0aW9uIEluIGFuZCBPdXQgdG9nZXRoZXIsXG4gICAgLSB0cmFuc2l0aW9uIEluIG9ubHlcbiAqL1xuXG52YXIgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpLFxuICAgIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKlxuICAgICAgICBPcmlnaW4gdi12aWV3IC0gbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgdnVlIHJlcG9cbiAgICAqL1xuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdHJhY2sgcG9zaXRpb24gaW4gRE9NIHdpdGggYSByZWYgbm9kZVxuICAgICAgICB2YXIgZWwgICAgICAgPSB0aGlzLnJhdyA9IHRoaXMuZWwsXG4gICAgICAgICAgICBwYXJlbnQgICA9IGVsLnBhcmVudE5vZGUsXG4gICAgICAgICAgICByZWYgICAgICA9IHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgncHctdmlldycpO1xuICAgICAgICBpZighcGFyZW50KSByZXR1cm47XG5cbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShyZWYsIGVsKTtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsKTtcblxuICAgICAgICAvLyBjYWNoZSBvcmlnaW5hbCBjb250ZW50XG4gICAgICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgICAgIHZhciBub2RlLFxuICAgICAgICAgICAgZnJhZyA9IHRoaXMuaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudm0uJG9uKCdzZWN0aW9uOnRyYW5zaXRpb25zUmVhZHknLCB0aGlzLm9uVHJhbnNpdGlvblJlYWR5LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmKCF0aGlzLmlubmVyIHx8IHRoaXMuaXNUcmFuc2l0aW9ubmluZyB8fCAhdmFsdWUpIHJldHVybjtcblxuICAgICAgICB2YXIgQ3RvciAgPSB0aGlzLmNvbXBpbGVyLmdldE9wdGlvbignY29tcG9uZW50cycsIHZhbHVlKTtcbiAgICAgICAgaWYgKCFDdG9yKSByZXR1cm47XG5cbiAgICAgICAgaWYodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTSA9IHRoaXMuY2hpbGRWTTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0gPSBuZXcgQ3Rvcih7XG4gICAgICAgICAgICBlbDogdGhpcy5yYXcuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtLFxuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmF3Q29udGVudDogdGhpcy5pbm5lci5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWRkIHJvdXRlciBwYXJhbXMgdG8gbmV4dENoaWxkVk1cbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kb3B0aW9ucy5yb3V0ZS5wYXJhbXMgPSB0aGlzLnZtLmNvbnRleHQucGFyYW1zO1xuXG4gICAgICAgIC8vIFJvdXRpbmcgcGFyYW1zIGV2ZW50XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0uJGVtaXQoJ2hvb2s6cm91dGVkJyk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgbmV4dENoaWxkVk0gJiBwcmV2aW91c0NoaWxkVk0gYXJlIHRyYW5zaXRpb24gY29tcGF0aWJsZSwgaWYgbm90IHRocm93IGVycm9yXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLm5leHRDaGlsZFZNLiRlbDtcbiAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgdGhpcy5yZWYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGhpcy5yZWYpO1xuICAgICAgICAgICAgVnVlLm5leHRUaWNrKHRoaXMudmlld01vZGVsQWRkZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRiZWZvcmUodGhpcy5yZWYsIHRoaXMudmlld01vZGVsQWRkZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkgdGhpcy5jaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLm5leHRDaGlsZFZNKSB0aGlzLm5leHRDaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLnByZXZpb3VzQ2hpbGRWTSkgdGhpcy5wcmV2aW91c0NoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgVHJhbnNpdGlvbiB0aW1pbmdzIHN0dWZmXG4gICAgKi9cblxuICAgIHZpZXdNb2RlbEFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kZW1pdCgnaG9vazphZGRlZCcpO1xuICAgIH0sXG5cbiAgICBvblRyYW5zaXRpb25SZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCF0aGlzLm5leHRDaGlsZFZNKSByZXR1cm47XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVmlldyAtIG9uVHJhbnNpdGlvblJlYWR5XCIpO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbigpO1xuICAgIH0sXG5cbiAgICB0cmFuc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pc1RyYW5zaXRpb25uaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYodGhpcy5wcmV2aW91c0NoaWxkVk0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVmlldyAtIHRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5uZXh0Q2hpbGRWTS5nZXRUcmFuc2l0aW9uTW9kZSh0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpbkFuZEFmdGVyT3V0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5BbmRBZnRlck91dCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpbkFuZE91dFRvZ2V0aGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5BbmRPdXRUb2dldGhlcigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0cmFuc2l0aW9uSW5Pbmx5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5Pbmx5KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbk91dEFuZEFmdGVySW4oKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Jbk9ubHkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0cmFuc2l0aW9uSW5Pbmx5OiBmdW5jdGlvbihwcmV2aW91c1JvdXRlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AoKTtcbiAgICAgICAgdGhpcy5uZXh0Q2hpbGRWTS4kb25jZSgnc2VjdGlvbjp0cmFuc2l0aW9uSW5Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMubmV4dENoaWxkVk0udHJhbnNpdGlvbkluKHByZXZpb3VzUm91dGUpO1xuICAgIH0sXG5cbiAgICB0cmFuc2l0aW9uT3V0QW5kQWZ0ZXJJbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuZXh0Um91dGUgPSB0aGlzLm5leHRDaGlsZFZNLiRvcHRpb25zLnJvdXRlO1xuICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb25jZSgnc2VjdGlvbjp0cmFuc2l0aW9uT3V0Q29tcGxldGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0uJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkluT25seSh0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLnRyYW5zaXRpb25PdXQodGhpcy5uZXh0Q2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb25JbkFuZEFmdGVyT3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLiRvbmNlKCdzZWN0aW9uOnRyYW5zaXRpb25JbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRvbignc2VjdGlvbjp0cmFuc2l0aW9uT3V0Q29tcGxldGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS50cmFuc2l0aW9uT3V0KHRoaXMubmV4dENoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLnRyYW5zaXRpb25Jbih0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgfSxcblxuICAgIHRyYW5zaXRpb25JbkFuZE91dFRvZ2V0aGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCgpO1xuICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb25jZSgnc2VjdGlvbjp0cmFuc2l0aW9uT3V0Q29tcGxldGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnByZXZpb3VzQ2hpbGRWTS50cmFuc2l0aW9uT3V0KHRoaXMubmV4dENoaWxkVk0uJG9wdGlvbnMucm91dGUpO1xuICAgICAgICB0aGlzLm5leHRDaGlsZFZNLnRyYW5zaXRpb25Jbih0aGlzLnByZXZpb3VzQ2hpbGRWTS4kb3B0aW9ucy5yb3V0ZSk7XG4gICAgfSxcblxuICAgIHNjcm9sbFRvVG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgVHdlZW5NYXguc2V0KHdpbmRvdywge3Njcm9sbFRvOiB7eTogMCwgeDogMH19KTtcbiAgICB9LFxuXG4gICAgb25UcmFuc2l0aW9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlsZFZNID0gdGhpcy5uZXh0Q2hpbGRWTTtcbiAgICAgICAgaWYodGhpcy5wcmV2aW91c0NoaWxkVk0pIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNDaGlsZFZNLiRkZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2aW91c0NoaWxkVk0gPSBudWxsO1xuICAgICAgICB0aGlzLnZtLiRlbWl0KCd2aWV3OnRyYW5zaXRpb25Db21wbGV0ZScpO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gICAgRmxhZ3MgYWxsb3dpbmcgdG8gcmVxdWlyZS9hY3RpdmF0ZSBkaWZmZXJlbnRzXG4gICAgcGFydHMgb2YgdGhlIGFwcC5cblxuICAgIEV4YW1wbGU6IHJlcXVpcmUgdnVlLWRlYnVnLCBzZXQgVGltZWxpbmUgdG8gZmFzdC1mb3J3YXJkXG4gICAgZm9yIGZhc3RlciBkZWJ1Zy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB2dWU6IHRydWUgIFxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gICAgTW9kaWZpZWQgdnVlLXZpZXdwb3J0IHBsdWdpblxuICAgICh2LWRldGVjdC12aWV3cG9ydCBkaXJlY3RpdmUpXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL2hvbGljL3Z1ZS12aWV3cG9ydFxuXG4gICAgdG8gYWxsb3cgdG8gcGFzcyBhbiBhdHRyaWJ1dGUgdG8gdGhlIGRpcmVjdGl2ZVxuICAgIHYtdmlld3BvcnQ9XCJ0aGluZ1wiLCBhbGxvd2luZyB0byByZWNvZ25pemUgd2hpY2hcbiAgICBlbGVtZW50cyB0cmlnZ2VyZWQgdGhlIHZpZXdwb3J0IGV2ZW50LCB3aGVuIHVzZWQgb24gbXVsdGlwbGVzIGV2ZW50cy5cbiAqL1xuXG52YXIgZGlyZWN0aXZlcyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudm0uJG9uKCdob29rOmF0dGFjaGVkJywgbm90aWZ5QWxsKTtcbiAgICAgICAgdGhpcy52bS4kb24oJ2hvb2s6ZGV0YWNoZWQnLCBub3RpZnlBbGwpO1xuXG4gICAgICAgIGlmIChkaXJlY3RpdmVzLmluZGV4T2YodGhpcykgPT09IC0xKSB7XG4gICAgICAgICAgICBkaXJlY3RpdmVzLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudm0uJG9mZignaG9vazphdHRhY2hlZCcsIG5vdGlmeUFsbCk7XG4gICAgICAgIHRoaXMudm0uJG9mZignaG9vazpkZXRhY2hlZCcsIG5vdGlmeUFsbCk7XG5cbiAgICAgICAgdmFyIGluZGV4ID0gZGlyZWN0aXZlcy5pbmRleE9mKHRoaXMpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwpIHtcbiAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiByZWN0LmJvdHRvbSA+IDAgJiYgcmVjdC5yaWdodCA+IDAgJiYgcmVjdC50b3AgPCAod2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICYmIHJlY3QubGVmdCA8ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xufVxuXG5mdW5jdGlvbiBub3RpZnkgKGRpcmVjdGl2ZSkge1xuICAgIGlmICghZGlyZWN0aXZlLmVsKSByZXR1cm47XG5cbiAgICB2YXIgaW5WaWV3cG9ydCA9IGlzRWxlbWVudEluVmlld3BvcnQoZGlyZWN0aXZlLmVsKTtcbiAgICBpZiAoZGlyZWN0aXZlLmluVmlld3BvcnQgPT09IG51bGwgfHwgZGlyZWN0aXZlLmluVmlld3BvcnQgIT09IGluVmlld3BvcnQpIHtcbiAgICAgICAgZGlyZWN0aXZlLmluVmlld3BvcnQgPSBpblZpZXdwb3J0O1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5WaWV3cG9ydCA/ICdlbnRlcicgOiAnbGVhdmUnO1xuICAgICAgICBkaXJlY3RpdmUudm0uJGVtaXQoJ3ZpZXdwb3J0JyArIGRpcmVjdGlvbiwge2VsOiBkaXJlY3RpdmUuZWwsIGF0dHI6IGRpcmVjdGl2ZS5rZXl9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vdGlmeUFsbCAoKSB7XG4gICAgZGlyZWN0aXZlcy5mb3JFYWNoKG5vdGlmeSk7XG59XG5cblsnRE9NQ29udGVudExvYWRlZCcsICdsb2FkJywgJ3Njcm9sbCcsICdyZXNpemUnLCAncG9wc3RhdGUnXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBub3RpZnlBbGwsIGZhbHNlKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAgICBJTVBPUlRTXG5cbiAgICBIb2xkYWxsIGZvciBwbHVnaW5zIGFuZCBjb25mXG4gICAgdG8gYXZvaWQgcG9sbHV0aW5nIHRoZSBtYWluLlxuICovXG5cbnZhciBWdWUgPSByZXF1aXJlKCd2dWUnKSxcbiAgICBkZWJ1ZyA9IHJlcXVpcmUoJ3Z1ZS1kZWJ1ZycpLFxuICAgIHF1ZXJ5ID0gcmVxdWlyZSgndnVlLXF1ZXJ5JyksXG4gICAgZWwgPSByZXF1aXJlKCd2dWUtZWwnKSxcbiAgICB2aWV3cG9ydCA9IHJlcXVpcmUoJy4vY29tbW9uL2RpcmVjdGl2ZXMvdmlld3BvcnQuanMnKSxcbiAgICBUd2Vlbk1heCA9IHJlcXVpcmUoJ1R3ZWVuTWF4JyksXG4gICAgZGVidWdBcHAgPSByZXF1aXJlKCcuL2NvbW1vbi9kZWJ1Zy5qcycpO1xuXG4vKlxuICAgIFR3ZWVuTWF4XG4qL1xucmVxdWlyZSgnVHdlZW5NYXguU2Nyb2xsVG9QbHVnaW4nKTsgLy8gQWRkIHNjcm9sbFRvUGx1Z2luIHRvIFR3ZWVuTWF4XG5Ud2VlbkxpdGUuZGVmYXVsdEVhc2UgPSBFeHBvLmVhc2VPdXQ7IC8vIFNvIEkgZG9uJ3QgaGF2ZSB0byB3cml0ZSBpdCBldmVyeSB0aW1lXG5cbi8qXG4gICAgVnVlIHBsdWdpbnNcbiAqL1xuaWYoZGVidWdBcHApIFZ1ZS51c2UoZGVidWcpOyAvLyBBZGQgVnVlLmxvZyBtZXRob2RcblZ1ZS51c2UoZWwpOyAvLyB2LWVsIGRpcmVjdGl2ZSB0byBhdm9pZCBzZWxlY3Rpbmcgbm9kZXMgaW4gSlNcblZ1ZS51c2UocXVlcnkpOyAvLyBBZGQgdGhpcy4kZmluZE9uZSwgdGhpcy4kZmluZCwgdGhpcy5hZGQvcmVtb3ZlQ2xhc3MgdG8gYW55IFZ1ZSBpbnN0YW5jZVxuVnVlLmRpcmVjdGl2ZSgndmlld3BvcnQnLCByZXF1aXJlKCcuL2NvbW1vbi9kaXJlY3RpdmVzL3ZpZXdwb3J0JykpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpLFxuICAgIHBhZ2UgPSByZXF1aXJlKCdwYWdlJyksXG4gICAgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgZm9yRWFjaCA9IHJlcXVpcmUoJ2ZvckVhY2gnKSxcbiAgICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdjb21wb25lbnQtZW1pdHRlcicpLFxuICAgIHZlcmJvc2UgPSB0cnVlO1xuXG4vKlxuICAgIFJvdXRlciBiYXNlZCBvbiBwYWdlLmpzLFxuICAgIGV2ZW50LWJhc2VkLCBtYWRlIHRvIHdvcmsgd2l0aCB2dWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQoe1xuICAgIC8qXG4gICAgICAgIFRoaXMgb2JqZWN0IGlzIGRpc3BhdGNoZWQgb24gZWFjaCBsb2NhdGlvbkNoYW5nZS5cbiAgICAgICAgSXQgaG9sZHMgdGhlIGN1cnJlbnQgcGF0aCwgdGhlIHJvdXRlIHBhcmFtcy4uLlxuICAgICAqL1xuICAgIGNvbnRleHQ6IHtcbiAgICAgICAgcGF0aDogJydcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgRGVmYXVsdCByb3V0ZSAoY2FuIGJlIGEgNDA0LCBvciB0aGUgaW5kZXgpXG4gICAgICovXG4gICAgZGVmYXVsdFJvdXRlOiAnLycsXG5cbiAgICAvKlxuICAgICAgICBSZWZlcmVuY2UgdG8gYWxsIHRoZSByb3V0ZXNcbiAgICAqL1xuICAgIHJvdXRlSWRzOiBbXSxcblxuICAgIC8qXG4gICAgICAgIFJlZ2lzdGVycyB0aGUgcm91dGUgd2l0aCB0aGUgc3BlY2lmaWVkIHBhdGgvcGF0dGVybiAoZXhwcmVzcy1saWtlIHJlZ2V4cClcbiAgICAgICAgcm91dGU6IGluZm9zIGFzIHtpZDogXCJyb3V0ZS1pZFwiLCBwYXRoOiBcIi9yb3V0ZVwifSBvciB7aWQ6IFwicm91dGUtaWRcIiwgcGF0aDogXCIvcm91dGUvOmlkXCJ9XG4gICAgICovXG4gICAgYWRkUm91dGU6IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICAgIHRoaXMucm91dGVJZHMucHVzaCh7aWQ6IHJvdXRlLmlkLCBwYXRoOiByb3V0ZS5wYXRofSk7XG4gICAgICAgIHBhZ2Uocm91dGUucGF0aCwgdGhpcy5vblJvdXRlLmJpbmQodGhpcykpO1xuICAgICAgICBpZih2ZXJib3NlKSBjb25zb2xlLmRlYnVnKCdbcm91dGVyXSBhZGQgcm91dGUgXCInICsgcm91dGUucGF0aCArICdcIicpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBVcGRhdGVzIHRoZSBkZWZhdWx0IHJvdXRlLlxuICAgICAgICBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIGFsbCByb3V0ZXMgd2VyZSBhZGRlZCxcbiAgICAgICAgYmVjYXVzZSBpdCBzdGFydHMgdGhlIHJvdXRpbmcuXG4gICAgICovXG4gICAgc2V0RGVmYXVsdFJvdXRlOiBmdW5jdGlvbihkZWZhdWx0Um91dGUpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0Um91dGUgPSBkZWZhdWx0Um91dGU7XG4gICAgICAgIHBhZ2UoJyonLCB0aGlzLm9uRGVmYXVsdFJvdXRlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICAgIFN0YXJ0cyB0aGUgcm91dGVyLlxuICAgICAgICBPbmx5IG5lZWRlZCB0byBjYWxsIGlmIHlvdSBkaWRuJ3QgY2FsbGVkIGBzZXREZWZhdWx0Um91dGVgLlxuICAgICAqL1xuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zdGFydCgpO1xuICAgICAgICB0aGlzLmVtaXQoJ3JvdXRlcjpzdGFydCcpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAgICBJbnRlcm5hbCBtZXRob2QuXG4gICAgICAgIFVwZGF0ZXMgdGhlIGNvbnRleHQgYW5kIGFtaXQgdGhlIGByb3V0ZXI6dXBkYXRlYCBldmVudC5cbiAgICAgKi9cbiAgICBvblJvdXRlOiBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJhbXMgPSBjb250ZXh0LnBhcmFtcztcbiAgICAgICAgdGhpcy5jb250ZXh0LmlkID0gdGhpcy5nZXRDdXJyZW50Um91dGVJZChjb250ZXh0LnBhdGgpO1xuICAgICAgICB0aGlzLmNvbnRleHQucGF0aCA9IGNvbnRleHQucGF0aDtcblxuICAgICAgICBpZih2ZXJib3NlKSBjb25zb2xlLmRlYnVnKCdbcm91dGVyXSBvblJvdXRlJywgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgdGhpcy5lbWl0KCdyb3V0ZXI6dXBkYXRlJywgdGhpcy5jb250ZXh0KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgQ2FsbGVkIHdoZW4gdGhlIHJlcXVlc3RlZCByb3V0ZSBkb2VzIG5vdCBleGlzdHNcbiAgICAgICAgUmVkaXJlY3RzIHRvIHByb3BlciBkZWZhdWx0IHJvdXRlXG4gICAgICovXG4gICAgb25EZWZhdWx0Um91dGU6IGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgVnVlLm5leHRUaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsICcvJyArIHRoaXMuZGVmYXVsdFJvdXRlKTtcbiAgICAgICAgICAgIHBhZ2UoJy8nICsgdGhpcy5kZWZhdWx0Um91dGUpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBnZXRDdXJyZW50Um91dGVJZDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB2YXIgbWF0Y2gsIGlkO1xuICAgICAgICBmb3JFYWNoKHRoaXMucm91dGVJZHMsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCl7XG4gICAgICAgICAgICBtYXRjaCA9IHBhdGgubWF0Y2gobmV3IFJlZ0V4cCgodmFsdWUucGF0aC5yZXBsYWNlKC86W2Etel0rL2csICdbYS16LV0rJykpLnJlcGxhY2UoL1xcLy9nLCAnXFxcXC8nKSwgJ2cnKSk7XG4gICAgICAgICAgICBpZihtYXRjaCAmJiBtYXRjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWQgPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgICAgTWFudWFsbHkgc2V0IHRoZSBwYXRoLlxuICAgICAgICBBbGxvdyB0byBwcmVzcyB0aGUgYGJhY2tgL2Bmb3J3YXJkYCBidXR0b25zXG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBudWxsLCBmYWxzZSk7XG4gICAgfVxufSwgbmV3IEV2ZW50RW1pdHRlcigpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8YSBjbGFzcz1cXFwibmFtZS1idXR0b25cXFwiIGhyZWY9XFxcInt7dXJsfX1cXFwiIHYtb249XFxcIm1vdXNlb3Zlcjogb25Nb3VzZU92ZXIsIG1vdXNlb3V0OiBvbk1vdXNlT3V0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwibmFtZVxcXCIgdi1lbD1cXFwibmFtZVxcXCI+e3twcm9qZWN0LmF1dGhvcn19PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInRpdGxlXFxcIiB2LWVsPVxcXCJ0aXRsZVxcXCI+e3twcm9qZWN0LnRpdGxlfX08L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGluZVxcXCIgdi1lbD1cXFwibGluZVxcXCI+PC9kaXY+XFxuPC9hPlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVnVlID0gcmVxdWlyZSgndnVlJyksXG4gICAgYmluZEFsbCA9IHJlcXVpcmUoJ2JpbmRhbGwtc3RhbmRhbG9uZScpXG4gICAgVHdlZW5NYXggPSByZXF1aXJlKCdUd2Vlbk1heCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9uYW1lQnV0dG9uLmh0bWwnKSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIG9uTW91c2VPdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb25Nb3VzZU92ZXInKTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQubmFtZSwgMC42LCB7eDogMCwgY29sb3I6ICcjMDA3ZGFjJywgZWFzZTogRXhwby5lYXNlT3V0fSk7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLnRpdGxlLCAwLjYsIHthbHBoYTogMSwgeDogMCwgZWFzZTogRXhwby5lYXNlT3V0fSk7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLmxpbmUsIDEsIHtzY2FsZVg6IDEsIGVhc2U6IEV4cG8uZWFzZU91dH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbk1vdXNlT3V0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLiQkLm5hbWUsIDAuNiwge3g6IHRoaXMuJCQudGl0bGUub2Zmc2V0V2lkdGggKiAwLjUsIGNvbG9yOiAnIzMzMycsIGVhc2U6IEV4cG8uZWFzZU91dH0pO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy4kJC50aXRsZSwgMC42LCB7YWxwaGE6IDAsIHg6IHRoaXMuJCQudGl0bGUub2Zmc2V0V2lkdGggKiAwLjUsIGVhc2U6IEV4cG8uZWFzZU91dCB9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuJCQubGluZSwgMSwge3NjYWxlWDogMCwgZWFzZTogRXhwby5lYXNlT3V0fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRoaXMuJCQubmFtZSwge3g6IHRoaXMuJCQudGl0bGUub2Zmc2V0V2lkdGggKiAwLjV9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLiQkLnRpdGxlLCB7eDogdGhpcy4kJC50aXRsZS5vZmZzZXRXaWR0aCAqIDAuNX0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudXJsID0gJ3Byb2plY3QvJyArIHRoaXMucHJvamVjdC5pZDtcbiAgICAgICAgYmluZEFsbCh0aGlzLCAnaW5pdCcpO1xuICAgICAgICBWdWUubmV4dFRpY2sodGhpcy5pbml0KTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gXCJXb3Jrc2hvcCBieSA8YSBocmVmPVxcXCJodHRwOi8vZ3VpbGxhdW1lZ291ZXNzYW4uY29tXFxcIj4gR3VpbGxhdW1lIEdvdWVzc2FuIDwvYT4gZm9yIDxhIGhyZWY9XFxcImh0dHA6Ly9nb2JlbGlucy5mclxcXCI+IEdvYmVsaW5zIFNjaG9vbCA8L2E+IENSTUEgMjAxNSBzdHVkZW50cywgUGFyaXMgMjAxNC5cIjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vZm9vdGVyLmh0bWwnKSxcbiAgICBjb21wb25lbnRzOiB7XG5cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgXG4gICAgfSxcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcImFib3V0XFxcIj5cXG4gICAgPGgyPlBhdGNod29yayBhYm91dDwvaDI+XFxuICAgIDxwPkxvb2tzIGxpa2UgaXQncyB3b3JraW5nIC0gPGEgaHJlZj1cXFwiL2hvbWVcXFwiPmhvbWU8L2E+PC9wPlxcbjwvZGl2PlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgc2VjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYmFzZS9zZWN0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCBzZWN0aW9uLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYWJvdXQuaHRtbCcpLFxuICAgIHJvdXRlOiB7XG4gICAgICAgIGlkOiAnYWJvdXQnLFxuICAgICAgICB0cmFuc2l0aW9uTW9kZTogJ291dEFuZEFmdGVySW4nLFxuICAgICAgICBwYXRoOiAnL2Fib3V0J1xuICAgIH0sXG4gICAgZGF0YToge1xuXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNywge2FscGhhOiAwLCB5OiA1MH0sIHthbHBoYTogMSwgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgMC40KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG5cbiAgICB9LFxuXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJob21lXFxcIj5cXG4gICAgPGgyPkNSTUEgMjAxNTwvaDI+XFxuICAgIDxoMyBpZD1cXFwic3VidGl0bGVcXFwiPkNyZWF0aXZlIENvZGluZyBXb3Jrc2hvcCAtIFRocmVlLmpzPC9oMz5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpIHYtcmVwZWF0PVxcXCJwcm9qZWN0OnByb2plY3RzXFxcIiB2LWNvbXBvbmVudD1cXFwibmFtZUJ1dHRvblxcXCIgdi13aXRoPVxcXCJwcm9qZWN0XFxcIj48L2xpPlxcbiAgICA8L3VsPlxcbjwvZGl2PlwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyksXG4gICAgc2VjdGlvbiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYmFzZS9zZWN0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kKHRydWUsIHt9LCBzZWN0aW9uLCB7XG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vaG9tZS5odG1sJyksXG4gICAgcm91dGU6IHtcbiAgICAgICAgaWQ6ICdob21lJyxcbiAgICAgICAgdHJhbnNpdGlvbk1vZGU6ICdvdXRBbmRBZnRlckluJyxcbiAgICAgICAgcGF0aDogJy9ob21lJ1xuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBwcm9qZWN0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMCcsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnSm9obiBMZW5ub24nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQXdlZnVsbHkgbG9uZyB0aXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdHZW9yZ2VzIEhhcnJpc3NvbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdQYXVsIE1hY2FydG5leScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdSaW5nbyBTdGFyJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0dlb3JnZXMgSGFycmlzc29uJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1BhdWwgTWFjYXJ0bmV5JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1JpbmdvIFN0YXInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2VvcmdlcyBIYXJyaXNzb24nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnUGF1bCBNYWNhcnRuZXknLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnUmluZ28gU3RhcicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdHZW9yZ2VzIEhhcnJpc3NvbicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdQYXVsIE1hY2FydG5leScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdSaW5nbyBTdGFyJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzEnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ0dlb3JnZXMgSGFycmlzc29uJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1BhdWwgTWFjYXJ0bmV5JyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJzMnLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogJ1JpbmdvIFN0YXInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMScsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnR2VvcmdlcyBIYXJyaXNzb24nLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnUGF1bCBNYWNhcnRuZXknLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnVGl0bGUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiAnUmluZ28gU3RhcicsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdUaXRsZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICAgICAgICBhdXRob3I6ICdSaW5nbyBTdGFyJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1RpdGxlJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICAgIGluc2VydFR3ZWVuczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnRsVHJhbnNpdGlvbi5mcm9tVG8odGhpcy4kZWwsIDAuNywge2FscGhhOiAwLCB5OiA1MH0sIHthbHBoYTogMSwgeTogMCwgZWFzZTogRXhwby5lYXNlT3V0fSwgMC40KTtcbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlVHJhbnNpdGlvbkluOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XG4gICAgfSxcblxuICAgIGJlZm9yZURlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufSk7XG4iXX0=
