# grunt-release-notes
> A grunt plugin to manage creation of a release notes section in your README. See this repo for example usage.

This is multi task, see [Gruntfile](https://github.com/pajtai/grunt-release-notes/blob/master/Gruntfile.js#L18) and the "Release Notes" section
at the bottom of this file for example usage.

The task will fail if the current package.json.version does not have a corresponding file in the release notes directory.
The plugin will also generate a markdown unordered list of links to version release notes with display dates which will
be saved on `grunt.config.releaseNotes.notes`. The notes string can then be used to create the `README.md` from a `README.template`
that uses grunt templating.

_Comes with a companion task - `grunt notes:since` -  that will show the contents of your release notes files starting at one version and ending at another._

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-release-notes --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-notes');
```

## The "releaseNotes" task

### Overview
In your project's Gruntfile, add a section named `releaseNotes` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    releaseNotes : {
        readmePath : 'README.md',
        templatePath : 'templates/README.template.md'
    }
});
```

### Options
* `notesDirectory` - The directory in which your release notes are stored.
    * default : `release_notes`
* `versionSeparator` - The character used to separate the version number from the display date in the release notes file names.
    * default : `_`
* `notesField` - The field on `grunt.config.releaseNotes` which will be used to create the generate release notes string.
    * default : `notes`

### Task level fields
* `src` - If this field and `readmePath` are both defined, then the grunt template at `templatePath` will be used to generate the README at `readmePath` using `grunt.config` as the template data.
* `dst` - If this field and `templatePath` are both defined, then the grunt template at `templatePath` will be used to generate the README at `readmePath` using `grunt.config` as the template data.
* `baseLinkPath` - The base of the path that will be used to generate the links to the release notes. For example : `https://github.com/Solid-Interactive/masseuse/blob/master/`

## releaseNotes:since:[from]:[until] task

`grunt releaseNotes:since:[start]:[finish]` will show the release notes starting after the start version and ending on the finish version. If no finish is provided, notes will be provided until the latest version. These are displayed and the string is set on the grunt config as `releaseNotes.notes` for use in templating.

## releaseNotes:latest task

`releaseNotes:latest` will display the release notes for the latest version, and it will add that string to the grunt config as `releaseNotes.notes` for use in templating.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release Notes
<%= releaseNotes.notes %>

_<%= warning.readme  + ' Created: ' + grunt.template.today('yyyy-mm-dd hh:MM:ss') %>_