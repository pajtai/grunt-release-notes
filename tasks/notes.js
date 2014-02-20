/*globals module:true, require:false */
module.exports = function(grunt) {
    'use strict';

    var versionSort = require('./versionSort'),
        path = require('path'),
        config = require('./config'),
        versionSeparator = grunt.config.get('releaseNotes.fileSeparator') || config.versionSeparator,
        directory = grunt.config.get('releaseNotes.notesDirectory') || config.notesDirectory,
        _ = require('lodash');

    grunt.registerTask('notes:since', function(start, stop) {
        var display = start ? false : true,
            files = [];
        grunt.file.recurse(directory, function(file) {
            var version = path.basename(file, '.md'), parts;
            version = version.substring(0,version.indexOf(versionSeparator));
            parts = version.split('.');
            files.push({version:version,parts:parts,file:file});
        });
        files = files.sort(versionSort);
        _.each(files, function(file) {
            if (display) {
                grunt.log.subhead(file.version);
                grunt.log.writeln(grunt.file.read(file.file));
            }
            if (start === file.version) {
                display = true;
            }
            if (stop === file.version) {
                display = false;
            }
        });
    });
};
