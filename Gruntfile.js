// Generated on 2013-04-13 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    grunt.loadTasks('tasks');
    grunt.initConfig({
        releaseNotes : {
            main : {
                src : 'templates/README.template.md',
                dest : 'README.md',
                baseLinkPath : 'https://github.com/pajtai/grunt-release-notes/tree/master/'
            }
        },
        warning : {
            'readme' : 'Do not modify directly. This file is compiled from a template.'
        }
    });
};
