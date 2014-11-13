'use strict';

var Vue = require('vue');

module.exports = {
    apply: function(ctx, vals) {
        this.valueToStart = parseInt(vals[1], 10);

        var projects = [];

        for(var i = this.valueToStart, j = (this.valueToStart + 4); i < j; i++) {
            projects.push(vals[0][i]);
        }

        return projects;
    }
};
