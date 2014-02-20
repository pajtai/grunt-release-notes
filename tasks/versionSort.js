/*globals module:true */
module.exports = function() {
    'use strict';
    return function(versionA, versionB) {
        if (versionA.parts[0] !== versionB.parts[0]) {
            return versionA.parts[0] - versionB.parts[0];
        }
        if (versionA.parts[1] !== versionB.parts[1]) {
            return versionA.parts[1] - versionB.parts[1];
        }
        if (versionA.parts[2] !== versionB.parts[2]) {
            return versionA.parts[2] - versionB.parts[2];
        }
        return 0;
    }
}