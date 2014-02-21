/*globals module:true, require:false */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('releaseNotes', 'read in files to make release notes', function() {

        var versionSort = require('./versionSort'),
            config = require('./config'),
            versionSeparator = grunt.config.get('releaseNotes.fileSeparator') || config.versionSeparator,
            directory = grunt.config.get('releaseNotes.notesDirectory') || config.notesDirectory,
            baseLinkPath = grunt.config.get('releaseNotes.baseLinkPath') || '',
            notesSuffix = grunt.config.get('releaseNotes.notesSuffix') || 'md',
            notesField = grunt.config.get('releaseNotes.notesField') || 'notes',
            readmePath = grunt.config.get('releaseNotes.readmePath'),
            templatePath = grunt.config.get('releaseNotes.templatePath'),
            path = require('path'),
            _ = require('lodash'),
        // grunt.util._ is depracated
            types = ['backward incompatibilities', 'features', 'patches'],
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
                updateType = 'initial release',
                data;

            last = version;
            _.each(parts, function(value, index) {
                if (previous[index].trim() != parts[index].trim()) {
                    updateType = types[index];
                    return false;
                }
                return undefined;
            });
            previous = parts;

            data = {
                version:version,
                date:date,
                updateType:updateType,
                baseLinkPath:baseLinkPath,
                directory:directory,
                name:name,
                notesSuffix:notesSuffix
            };
            notes += grunt.template.process('* <%= version %> - <%= date %> - ' +
                '[<%= updateType %>](<%= baseLinkPath%><%= directory %>/<%= name %>.<%= notesSuffix %>)\n', {data:data});
        });
        if (grunt.file.readJSON('package.json').version !== last) {
            grunt.fatal('Latest release notes and package.version do not match');
        }
        grunt.log.writeln(notes);
        grunt.config.set('releaseNotes.' + notesField, notes);

        if (readmePath && templatePath) {
            grunt.file.write(readmePath,
                grunt.template.process(
                    grunt.file.read(templatePath)));
        }
    });
};
