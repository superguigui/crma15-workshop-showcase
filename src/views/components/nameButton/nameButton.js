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
        },
        onMouseOut: function(e) {
            TweenMax.to(this.$$.name, 0.6, {x: this.$$.title.offsetWidth * 0.5, color: '#333', ease: Expo.easeOut});
            TweenMax.to(this.$$.title, 0.6, {alpha: 0, x: this.$$.title.offsetWidth * 0.5, ease: Expo.easeOut });
        },
        init: function() {
            TweenMax.set(this.$$.name, {x: this.$$.title.offsetWidth * 0.5});
            TweenMax.set(this.$$.title, {x: this.$$.title.offsetWidth * 0.5});
        }
    },
    ready: function() {
        // this.url = 'project/' + this.project.id;
        bindAll(this, 'init');
        Vue.nextTick(this.init);
    }
};