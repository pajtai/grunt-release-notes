/*globals module:true, require:false */
module.exports = function(grunt) {
    'use strict';

    var versionSort = require('./versionSort'),
        config = require('./config'),
        versionSeparator = grunt.config.get('releaseNotes.fileSeparator') || config.versionSeparator,
        directory = grunt.config.get('releaseNotes.notesDirectory') || config.notesDirectory,
        baseLinkPath = grunt.config.get('releaseNotes.baseLinkPath') || '',
        notesSuffix = grunt.config.get('releaseNotes.notesSuffix') || 'md',
        path = require('path'),
        _ = require('lodash');
            // grunt.util._ is depracated

    grunt.registerTask('releaseNotes', 'read in files to make release notes', function() {
        var types = ['backward incompatibilities', 'features', 'patches'],
            previous = ['0','0','0'],
            notes = '',
            last = '',
            files = [];

        grunt.file.recurse(directory, function(file) {
            var name = path.basename(file, '.md'),
                separatorAt = name.indexOf(versionSeparator),
                version = name.substring(0,separatorAt),
                date = name.substring(separatorAt + 1),
                parts = version.split('.');

            files.push({name: name, version: version, date: date, parts: parts});
        });

        files = files.sort(versionSort);

        _.each(files, function(file) {
            var name = file.name,
                version = file.version,
                date = file.date,
                parts = file.parts,
                updateType = '';

            last = version;
            _.each(parts, function(value, index) {
                if (previous[index].trim() != parts[index].trim()) {
                    updateType = types[index];
                    return false;
                }
                return undefined;
            });
            previous = parts;

            // TODO: use a grunt template for legibility
            notes += '* ' + version + ' - ' + date + ' - [' + updateType +
                '](' + baseLinkPath + directory + '/' + name + '.' + notesSuffix + ')\n';
        });
        if (grunt.config.get('pkg').version !== last) {
            grunt.fatal('Latest release notes and package.version do not match');
        }
        grunt.log.writeln(notes);
        grunt.config.set('releaseNotes', notes);
    });
};
