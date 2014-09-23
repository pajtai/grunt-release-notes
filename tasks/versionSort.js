/*globals module:true */
var semver = require('semver');

module.exports = function() {
    'use strict';
    return function(versionA, versionB) {
	    return semver.lt(versionA.version, versionB.version) ? -1 : 1;
    }
};
