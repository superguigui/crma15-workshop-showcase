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
            timerIn: null,
            timerOut: null,
            shaper: false,
            animate: function () {
                if (this.cloud) {
                    this.cloud.render();
                }
                
                window.requestAnimationFrame(this.animate.bind(this));
            },
            projects: [
                {
                    id: 'clement-bardon',
                    author: 'Clément Bardon',
                    title: 'Blow!',
                    shape: 'clement-bardon'
                },
                {
                    id: 'nicolas-bonnot',
                    author: 'Nicolas Bonnot',
                    title: 'Pixel Vinyl',
                    shape: 'nicolas-bonnot'
                },
                {
                    id: 'kevin-budain',
                    author: 'Kevin Budain',
                    title: 'Planets',
                    shape: 'null'
                },
                {
                    id: 'bertrand-cayla',
                    author: 'Bertrand Cayla',
                    title: 'Aqua',
                    shape: 'null'
                },
                {
                    id: 'etienne-chaumont',
                    author: 'Etienne Chaumont',
                    title: 'Days',
                    shape: 'etienne-chaumont'
                },
                {
                    id: 'jordan-delcros',
                    author: 'Jordan Delcros',
                    title: 'Grenade',
                    shape: 'null'
                },
                {
                    id: 'jeremie-devoos',
                    author: 'Jérémie Devoos',
                    title: 'Pyramids are not',
                    shape: 'triangle'
                },
                {
                    id: 'leonard-hetsch',
                    author: 'Léonard Hetsch',
                    title: 'Balloon',
                    shape: 'null'
                },
                {
                    id: 'samuel-honigstein',
                    author: 'Samuel Honigstein',
                    title: 'Kinectic Surface',
                    shape: 'null'
                },
                {
                    id: 'lory-huz',
                    author: 'Lory Huz',
                    title: 'Shape Fight',
                    shape: 'round'
                },
                {
                    id: 'guillaume-jasmin',
                    author: 'Guillaume Jasmin',
                    title: 'Bob',
                    shape: 'guillaume-jasmin'
                },
                {
                    id: 'thomas-josseau',
                    author: 'Thomas Josseau',
                    title: 'Flatland',
                    shape: 'thomas-josseau'
                },
                {
                    id: 'antonin-langlade',
                    author: 'Antonin Langlade',
                    title: 'Words',
                    shape: 'antonin-langlade'
                },
                {
                    id: 'katia-moreira',
                    author: 'Katia Moreira',
                    title: '3D is better',
                    shape: 'null'
                },
                {
                    id: 'louise-obe',
                    author: 'Louise Obé',
                    title: 'Morphing pool',
                    shape: 'null'
                },
                {
                    id: 'jean-baptiste-penrath',
                    author: 'Jean-Baptiste Penrath',
                    title: 'Circles',
                    shape: 'circle'
                },
                {
                    id: 'sylvain-reucherand',
                    author: 'Sylvain Reucherand',
                    title: 'Euler',
                    shape: 'triangle'
                },
                {
                    id: 'glenn-sonna',
                    author: 'Glenn Sonna',
                    title: 'Dancelines',
                    shape: 'null'
                },
                {
                    id: 'alexis-tessier',
                    author: 'Alexis Tessier',
                    title: 'Lunar',
                    shape: 'null'
                },
                {
                    id: 'geoffrey-thenot',
                    author: 'Geoffrey Thenot',
                    title: 'Birds',
                    shape: 'null'
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
            this.cloud = new Cloud('stage');
            
            this.cloud.register('gobelins', 'assets/images/gobelins.png');
            this.cloud.register('circle', 'assets/images/shapes/circle.png');
            this.cloud.register('triangle', 'assets/images/shapes/triangle.png');
            this.cloud.register('round', 'assets/images/shapes/round.png');
            this.cloud.register('antonin-langlade', 'assets/images/shapes/antonin-langlade.png');
            this.cloud.register('etienne-chaumont', 'assets/images/shapes/etienne-chaumont.png');
            this.cloud.register('nicolas-bonnot', 'assets/images/shapes/nicolas-bonnot.png');
            this.cloud.register('thomas-josseau', 'assets/images/shapes/thomas-josseau.png');
            this.cloud.register('clement-bardon', 'assets/images/shapes/clement-bardon.png');
            this.cloud.register('guillaume-jasmin', 'assets/images/shapes/guillaume-jasmin.png');
            this.cloud.start('gobelins');
            
            this.animate();
            
            this.$on('cloud:needbreak', function () {
                this.cloud.pause();
            }.bind(this));        
            this.$on('cloud:needbeat', function () {
                this.cloud.resume();
            }.bind(this));           
            this.$on('cloud:needupdate', function (shape) {
                if (this.timerIn) {
                    return;
                }
                
                clearTimeout(this.timerOut);
                this.timerOut = null;

                this.timerIn = setTimeout(function () {
                    if (shape == 'null') {
                        this.cloud.organize('gobelins');
                    } else {
                        this.cloud.organize(shape);
                    }
                    this.shaped = true;
                }.bind(this), 600);
            }.bind(this));         
            this.$on('cloud:needreset', function (shape) {
                if (!this.timerIn) {
                    return;
                }
                
                clearTimeout(this.timerIn);
                this.timerIn = null;

                if (this.shaped) {
                    this.timerOut = setTimeout(function () {
                        this.cloud.organize('gobelins');
                        this.shaped = false;
                    }.bind(this), 1600);
                }
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
