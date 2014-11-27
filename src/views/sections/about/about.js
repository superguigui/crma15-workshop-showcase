'use strict';

var extend = require('extend'),
    section = require('base/section');

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
        },
        goBack: function(e) {
            e.preventDefault();
            // Woops, that's dirty.
            // No more time :)
            window.history.go(-1);
        }
    },

    ready: function() {
    },

    beforeDestroy: function() {

    }
});
