'use strict';

var Vue = require('vue'),
    bindAll = require('bindall-standalone')
    TweenMax = require('TweenMax');

module.exports = {
    template: require('./nameButton.html'),
    methods: {
        onMouseOver: function(e) {
            TweenMax.to(this.$$.name, 0.6, {y: 0, ease: Expo.easeOut});
            TweenMax.to(this.$$.title, 0.6, {alpha: 1, y: 0, ease: Expo.easeOut});
            
            this.$root.$emit('cloud:needupdate', this.project.shape);
        },
        onMouseOut: function(e) {
            TweenMax.to(this.$$.name, 0.6, {y: this.$$.title.offsetHeight * 0.5, ease: Expo.easeOut});
            TweenMax.to(this.$$.title, 0.6, {alpha: 0, y: -this.$$.title.offsetHeight * 0.5, ease: Expo.easeOut });
            
            this.$root.$emit('cloud:needreset');
        },
        init: function() {
            TweenMax.set(this.$$.name, {y: this.$$.title.offsetHeight * 0.5});
            TweenMax.set(this.$$.title, {y: -this.$$.title.offsetHeight * 0.5});
        }
    },
    ready: function() {
        this.url = 'project/' + this.project.id;
        bindAll(this, 'init');
        Vue.nextTick(this.init);
    }
};
