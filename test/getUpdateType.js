'use strict';
var getUpdateType = require('../tasks/getUpdateType');

require('chai').should();

describe('getUpdateType', function() {
    it('first version should be marked as initial', function() {
        getUpdateType('0.1.0', undefined).should.equal('initial release');
    });

    it('patch bump should be marked as patch', function() {
        getUpdateType('0.1.1', '0.1.0').should.equal('patch');
    });

    it('patch bump should be marked as patch', function() {
        getUpdateType('0.1.1-beta', '0.1.0').should.equal('patch');
    });

    it('patch bump should be marked as patch', function() {
        getUpdateType('0.1.1', '0.1.0').should.equal('patch');
    });

    it('prerelease bump should be marked as prerelease', function() {
        getUpdateType('0.1.1-beta.1', '0.1.1-beta.0').should.equal('prerelease');
    });

    it('minor bump should be marked as minor', function() {
        getUpdateType('0.2.0', '0.1.0').should.equal('minor');
    });

    it('major bump should be marked as major', function() {
        getUpdateType('1.0.0', '0.0.1').should.equal('major');
    });
});

