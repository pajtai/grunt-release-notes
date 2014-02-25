/*globals module:true, require:false */
module.exports = function(grunt) {
    'use strict';

    var versionSort = require('./versionSort'),
        path = require('path'),
        _ = require('lodash'),
        config = require('./config');

    // Register simple tasks first, so that grunt doesn't look for the, "latest" config property
    grunt.registerTask('releaseNotes:latest', function() {
        var files = getFiles().sort(versionSort),
            output = '',
            file = files.pop(),
            contents = grunt.file.read(file.file),
            version = file.version;

        grunt.log.subhead(version);
        grunt.log.writeln(contents);
        output += version + '\n' + contents + '\n\n';

        grunt.config.set('releaseNotes.notes', output);
    });

    // Register simple tasks first, so that grunt doesn't look for the, "since" config property
    grunt.registerTask('releaseNotes:since', function(start, stop) {
        var display = start ? false : true,
            files = getFiles().sort(versionSort),
            output = '';

        _.each(files, function(file) {
            var contents,
                version;
            if (display) {
                contents = grunt.file.read(file.file);
                version = file.version;
                grunt.log.subhead(version);
                grunt.log.writeln(contents);
                output += version + '\n' + contents + '\n\n';
            }
            if (start === file.version) {
                display = true;
            }
            if (stop === file.version) {
                display = false;
            }
        });

        grunt.config.set('releaseNotes.notes', output);
    });

    function getFiles () {
        var versionSeparator = grunt.config.get('releaseNotes.fileSeparator') || config.versionSeparator,
            directory = grunt.config.get('releaseNotes.notesDirectory') || config.notesDirectory,
            files = [];

        grunt.file.recurse(directory, function (file) {
            var version = path.basename(file, '.md'), parts;
            version = version.substring(0, version.indexOf(versionSeparator));
            parts = version.split('.');
            files.push({version : version, parts : parts, file : file});
        });

        return files;
    }

    grunt.registerMultiTask('releaseNotes', 'read in files to make release notes', function() {
        var config = require('./config'),
            options = this.options({
                versionSeparator : config.versionSeparator,
                notesDirectory : config.notesDirectory,
                notesSuffix : 'md',
                notesField : 'notes'
            }),
            readmePath = this.data.dest,
            templatePath = this.data.src,
            baseLinkPath = this.data.baseLinkPath,
            versionSort = require('./versionSort'),
            path = require('path'),
            _ = require('lodash'),
        // grunt.util._ is depracated
            types = ['backward incompatibilities', 'features', 'patches'],
            previous = ['0','0','0'],
            notes = '',
            last = '',
            files = [];

        grunt.file.recurse(config.notesDirectory, function(file) {
            var name = path.basename(file, '.' + options.notesSuffix),
                separatorAt = name.indexOf(options.versionSeparator),
                version = name.substring(0,separatorAt),
                date = name.substring(separatorAt + 1),
                parts = version.split('.');

            files.push({name: name, version: version, date: date, parts: parts});
        });

        files = files.sort(versionSort());

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
                directory: options.notesDirectory,
                name:name,
                notesSuffix: options.notesSuffix
            };
            notes += grunt.template.process('* <%= version %> - <%= date %> - ' +
                '[<%= updateType %>](<%= baseLinkPath%><%= directory %>/<%= name %>.<%= notesSuffix %>)\n', {data:data});
        });
        if (grunt.file.readJSON('package.json').version !== last) {
            grunt.fatal('Latest release notes and package.version do not match');
        }
        grunt.log.writeln(notes);
        grunt.config.set('releaseNotes.' + options.notesField, notes);

        if (readmePath && templatePath) {
            grunt.file.write(readmePath,
                grunt.template.process(
                    grunt.file.read(templatePath)));
        }
    });
};
