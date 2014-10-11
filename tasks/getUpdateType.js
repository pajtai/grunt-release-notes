'use strict';
var semver = require('semver'),
    _ = require('lodash');

module.exports = function (version, previousVersion) {
    var types = [
        'prerelease',
        'prepatch',
        'patch',
        'preminor',
        'minor',
        'premajor',
        'major'
    ];

    if (!previousVersion) {
        return 'initial release';
    }


    return _.find(types, function(type) {
        return semver.satisfies(semver.inc(previousVersion, type), '~' + version);
    });
};