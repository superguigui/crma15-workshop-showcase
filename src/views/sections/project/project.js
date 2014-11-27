'use strict';

var extend = require('extend'),
    section = require('base/section');

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
            this.tlTransition.fromTo(this.$el, 0.7, {alpha: 0, y: 50}, {alpha: 1, y: 0, ease: Expo.easeOut}, 0.4);
        },
        beforeTransitionIn: function() {
            this.author = this.$options.route.params.id;
            this.project = this.$root.$data.projects.filter(function(value){
                return value.id === this.$options.route.params.id;
            }, this)[0];
        }
    },

    ready: function() {
        this.$root.$data.stopAnimation = true;
    },

    beforeDestroy: function() {
        this.$root.$data.stopAnimation = false;
        console.log(window);
    }
});
