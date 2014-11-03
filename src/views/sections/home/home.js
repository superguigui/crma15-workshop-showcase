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
