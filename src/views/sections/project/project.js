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
