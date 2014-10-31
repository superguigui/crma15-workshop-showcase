'use strict';

module.exports = {
    template: require('./header.html'),
    methods: {

    },
    ready: function() {
        var startTime = 0.8;
        var tl = new TimelineMax();
        tl.from(this.$$.subtitle, 0.6, {y: -20, alpha: 0, ease: Expo.easeOut}, startTime + 0.0);
        tl.from(this.$$.logo, 0.6, {y: -20, alpha: 0, ease: Expo.easeOut}, startTime + 0.1);
    }
};
