'use strict';

var Vue = require('vue');

module.exports = {
    apply: function(ctx, vals) {
        this.valueToStart = parseInt(vals[1], 10);
        this.valueToEnd = parseInt(vals[2], 10);

        this.resultsToReturn = [];

        for(var i = this.valueToStart, j = this.valueToEnd; i < j; i++) {
            this.resultsToReturn.push(vals[0][i]);
        }

        return this.resultsToReturn;
    }
};
