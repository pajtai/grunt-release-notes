// Generated on 2013-04-13 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // Actually load this plugin's task(s).

    grunt.loadTasks('tasks');

    grunt.initConfig({
        releaseNotes : {
            readmePath : 'README.md',
            templatePath : 'templates/README.template.md'
        },
        warning : 'Do not modify directly. This file is compiled from a template.'
    });
};
