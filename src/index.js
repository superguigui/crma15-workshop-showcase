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
    TweenMax = require('TweenMax'),
    Cloud = require('./cloud');


/*
    Plugins, lib config...
 */
require('./imports');

function init() {

    var app = new Vue({
        el: 'body',
        data: {
            currentPage: null, // Current page id, used by v-pw-view
            context: {}, // reference to the router context
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

        components: {
            /* LAYOUT */
            'footer': require('./views/layout/footer/footer'),
            'header': require('./views/layout/header/header'),

            /* COMPONENTs */
            'nameButton': require('./views/components/nameButton/nameButton'),

            /* PAGES */
            'home': require('./views/sections/home/home'),
            'project': require('./views/sections/project/project'),
            'projects-list': require('./views/sections/projects-list/projects-list')

            /* COMMON */

        },

        directives: {
            'pw-view': require('base/view')
        },

        filters: {
            'startAt': require('base/start-at')
        },

        ready: function() {
            router.on('router:update', this.onRouteUpdate.bind(this));

            router.addRoute(require('./views/sections/home/home').route);
            router.addRoute(require('./views/sections/project/project').route);
            router.addRoute(require('./views/sections/projects-list/projects-list').route);
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
    
    var cloud = new Cloud('stage');
    
    cloud.register('gobelins', 'assets/images/gobelins.png');
    cloud.start('gobelins');
    
    var animate = function () {
        window.requestAnimationFrame(animate);
        
        cloud.render();
    }
    
    window.addEventListener('resize', function () {
        cloud.resize(window.innerWidth, window.innerHeight);
    });
    
    animate();
}

window.onload = init;
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000/60);
    };
})();
