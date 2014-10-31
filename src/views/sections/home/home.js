'use strict';

var extend = require('extend'),
    section = require('base/section');

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
