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
            break: false,
            animate: function () {
                if (!this.break) {
                    if (this.cloud) {
                        this.cloud.render();
                    }
                }
                window.requestAnimationFrame(this.animate.bind(this));
            },
            projects: [
                {
                    id: 'clement-bardon',
                    author: 'Clément Bardon',
                    title: 'Blow!'
                },
                {
                    id: 'nicolas-bonnot',
                    author: 'Nicolas Bonnot',
                    title: 'Pixel Vinyl'
                },
                {
                    id: 'kevin-budain',
                    author: 'Kevin Budain',
                    title: 'Planets'
                },
                {
                    id: 'bertrand-cayla',
                    author: 'Bertrand Cayla',
                    title: 'Aqua'
                },
                {
                    id: 'etienne-chaumont',
                    author: 'Etienne Chaumont',
                    title: 'Days'
                },
                {
                    id: 'jordan-delcros',
                    author: 'Jordan Delcros',
                    title: 'Grenade'
                },
                {
                    id: 'jeremie-devoos',
                    author: 'Jérémie Devoos',
                    title: 'Pyramids are not Triangles'
                },
                {
                    id: 'leonard-hetsch',
                    author: 'Léonard Hetsch',
                    title: 'Balloon'
                },
                {
                    id: 'samuel-honigstein',
                    author: 'Samuel Honigstein',
                    title: 'Kinectic Surface'
                },
                {
                    id: 'lory-huz',
                    author: 'Lory Huz',
                    title: 'Shape Fighter'
                },
                {
                    id: 'guillaume-jasmin',
                    author: 'Guillaume Jasmin',
                    title: 'Bob'
                },
                {
                    id: 'thomas-josseau',
                    author: 'Thomas Josseau',
                    title: 'Flatland'
                },
                {
                    id: 'antonin-langlade',
                    author: 'Antonin Langlade',
                    title: 'Words'
                },
                {
                    id: 'katia-moreira',
                    author: 'Katia Moreira',
                    title: '3D is better'
                },
                {
                    id: 'louise-obe',
                    author: 'Louise Obé',
                    title: 'Morphing pool'
                },
                {
                    id: 'jean-baptiste-penrath',
                    author: 'Jean-Baptiste Penrath',
                    title: 'Circles'
                },
                {
                    id: 'sylvain-reucherand',
                    author: 'Sylvain Reucherand',
                    title: 'Euler'
                },
                {
                    id: 'glenn-sonna',
                    author: 'Glenn Sonna',
                    title: 'Dancelines'
                },
                {
                    id: 'alexis-tessier',
                    author: 'Alexis Tessier',
                    title: 'Lunar'
                },
                {
                    id: 'geoffrey-thenot',
                    author: 'Geoffrey Thenot',
                    title: 'Birds'
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
            'projects-list': require('./views/sections/projects-list/projects-list'),
            'about': require('./views/sections/about/about')

            /* COMMON */

        },

        directives: {
            'pw-view': require('base/view')
        },

        filters: {
            'limitToRange': require('base/limit-to-range')
        },

        ready: function() {
            console.log(this);
            this.cloud = new Cloud('stage');
            
            this.cloud.register('gobelins', 'assets/images/gobelins.png');
            this.cloud.start('gobelins');
            
            this.animate();
            
            this.$on('cloud:needbreak', function () {
                this.break = true;
            }.bind(this));            
            this.$on('cloud:needbeat', function () {
                this.break = false;
            }.bind(this));
            
            router.on('router:update', this.onRouteUpdate.bind(this));

            router.addRoute(require('./views/sections/home/home').route);
            router.addRoute(require('./views/sections/project/project').route);
            router.addRoute(require('./views/sections/projects-list/projects-list').route);
            router.addRoute(require('./views/sections/about/about').route);
            router.setDefaultRoute('home');
            
            window.addEventListener('resize', function () {
                this.cloud.resize(window.innerWidth, window.innerHeight);
            }.bind(this));
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
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000/60);
    };
})();
