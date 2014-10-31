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
