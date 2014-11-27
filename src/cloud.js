'use strict';

var Proton = require('Proton');
var Promise = require('bluebird');

module.exports = (function () {

    function Cloud (id) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.proton = new Proton;

        this.renderer = new Proton.Renderer('canvas', this.proton, this.canvas);

        document.getElementById(id).appendChild(this.canvas);
        
        this.dump = true;
        this.clock = 0;
        this.frame = {width: window.innerWidth, height: window.innerHeight};
        this.offset = {width: 0, height: 0};
        this.current = null;
        this.areas = {};
        this.promises = [];
    };

    function init (name) {
        if (!this.areas[name]) {
            console.log('No shape with name `'+name+'` is registered yet!');
            return;
        }

        var scope = this;

        this.current = name;

        this.emitter = new Proton.Emitter();

        this.emitter.damping = 0.090;
        this.emitter.rate = new Proton.Rate(new Proton.Span(2000));

        this.emitter.addInitialize(new Proton.Radius(1, 4));

        this.emitter.addBehaviour({
            initialize: function (particle) {
                var areas = {};

                for (var area in scope.areas) {
                    areas[area] = scope.areas[area].getPosition().clone();
                }

                particle.current = scope.current;
                particle.areas = areas;
                particle.p = particle.areas[particle.current].clone();
            },
            applyBehaviour: function (particle) {
                particle.current = scope.current;
                particle.clock = scope.clock;
                particle.resize = scope.offset;
            }
        });
        this.emitter.addBehaviour(alphaBehaviour());
        this.emitter.addBehaviour(positionBehaviour());
        this.emitter.addBehaviour(scaleBehaviour());
        this.emitter.addBehaviour(new Proton.Color(['#0643CF', '#15223D', '#25126F', '#212E5D', '#0A338F', '#2A3C7E']));

        this.emitter.emit('once');

        this.proton.addEmitter(this.emitter);

        this.renderer.start();
    };

    function alphaBehaviour () {
        return {
            initialize: function (particle) {
                particle.period = Math.min(Math.random(), 0.5);
                particle.offset = Math.random()*5;
            },
            applyBehaviour: function (particle) {
                particle.alpha = Math.max(Math.sin(particle.clock*particle.period + particle.offset), 0);
            }
        };
    };

    function positionBehaviour () {
        return {
            initialize: function (particle) {
                particle.destination = particle.areas[particle.current].clone();
                particle.circle = Math.random();
                particle.angle = [-1, 1][Math.round(Math.random())];
                particle.last = particle.p.clone();
            },
            applyBehaviour: function (particle) {
                particle.v.clear();
                particle.destination = particle.areas[particle.current].clone();
                particle.destination.x += particle.resize.width;
                particle.destination.y += particle.resize.height;
                particle.p.x += (particle.destination.x - particle.p.x)*0.05 + Math.sin(particle.clock*particle.angle + particle.offset)*particle.circle;
                particle.p.y += (particle.destination.y - particle.p.y)*0.05 + Math.cos(particle.clock*particle.angle + particle.offset)*particle.circle;
                particle.last = particle.p.clone();
            }
        }
    };

    function scaleBehaviour () {
        return {
            initialize: function (particle) {
                particle.oldRadius = particle.radius;
                particle.radius = 0;
            },
            applyBehaviour: function (particle) {
                particle.radius += (particle.oldRadius - particle.radius)*0.05;
                particle.scale = particle.radius/10;
            }
        };
    };

    Cloud.prototype.register = function (name, url) {
        var deferred = Promise.defer();
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var zone = null;
            var width = image.width;
            var height = image.height;

            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, 0, 0);

            zone = context.getImageData(0, 0, width, height);
            zone = new Proton.ImageZone(zone, (window.innerWidth-width)/2, (window.innerHeight-height)/2);

            this.areas[name] = zone;

            deferred.resolve(zone);
        }.bind(this);
        image.onerror = function () {
            deferred.reject();
        };
        image.src = url;

        this.promises.push(deferred.promise);
    };

    Cloud.prototype.start = function (name) {
        Promise.all(this.promises).then(function () {
            init.call(this, name);
        }.bind(this));
    };

    Cloud.prototype.organize = function (name) {
        if (!this.areas[name]) {
            console.log('No shape with name `'+name+'` is registered yet!');
            return;
        }

        this.current = name;
    };

    Cloud.prototype.render = function () {
        if (this.dump) {
            this.proton.update();

            this.clock += this.proton.elapsed;

            if (this.notif && this.pr === this.emitter.particles.length - 1) {
                this.notif = false;
            }
        }
    };
    
    Cloud.prototype.pause = function () {
        this.dump = false;
    };
    
    Cloud.prototype.resume = function () {
        this.dump = true;
    };

    Cloud.prototype.resize = function (width, height)  {
        this.offset.width = (width - this.frame.width)/2;
        this.offset.height = (height - this.frame.height)/2;

        this.canvas.width = width;
        this.canvas.height = height;
    };

    return Cloud;

})();
