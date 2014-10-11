/*globals module:true, require:false */
'use strict';

var path = require('path'),
    semver = require('semver'),
    config = {
        versionSeparator : '_',
        notesDirectory : 'release_notes',
        notesSuffix : 'md'
    },
    getUpdateType = require('./getUpdateType');

module.exports = function(grunt) {

    var _ = require('lodash');

    // Register simple tasks first, so that grunt doesn't look for the, "latest" config property
    grunt.registerTask('releaseNotes:latest', function() {
        var files = getFiles(grunt).sort(versionSort),
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
            files = getFiles(grunt).sort(versionSort),
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



    grunt.registerMultiTask('releaseNotes', 'read in files to make release notes', function() {
        var options = this.options({
                versionSeparator : config.versionSeparator,
                notesDirectory : config.notesDirectory,
                notesSuffix : 'md',
                notesField : 'notes'
            }),
            readmePath = this.data.dest,
            templatePath = this.data.src,
            baseLinkPath = this.data.baseLinkPath,
            path = require('path'),
            types = ['backward incompatibilities', 'features', 'patches', 'pre'],
            previous = ['0','0','0'],
            notes = '',
            last = '',
            previousVersion,
            files = [];

        grunt.file.recurse(options.notesDirectory, function(file) {
            var name = path.basename(file, '.' + options.notesSuffix),
                separatorAt = name.indexOf(options.versionSeparator),
                version = name.substring(0,separatorAt),
                date = name.substring(separatorAt + 1),
                parts = version.split(/\.|-/);

            files.push({name: name, version: version, date: date, parts: parts});
        });

        notes = files
            .sort(versionSort)
            .map(function(file) {
                var name = file.name,
                    version = file.version,
                    date = file.date,
                    parts = file.parts,
                    updateType,
                    data;

                last = version;
                updateType = getUpdateType(version, previousVersion);
                previous = parts;
                previousVersion = version;

                data = {
                    version:version,
                    date:date,
                    updateType:updateType,
                    baseLinkPath:baseLinkPath,
                    directory: options.notesDirectory,
                    name:name,
                    notesSuffix: options.notesSuffix
                };
                return grunt.template.process('* <%= version %> - <%= date %> - ' +
                '[<%= updateType %>](<%= baseLinkPath%><%= directory %>/<%= name %>.<%= notesSuffix %>)\n', {data:data});
            })
            .join('');

        if (false !== options.strict && grunt.file.readJSON('package.json').version !== last) {
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

function versionSort(versionA, versionB) {
    return semver.lt(versionA.version, versionB.version) ? -1 : 1;
}

function getFiles (grunt) {
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
