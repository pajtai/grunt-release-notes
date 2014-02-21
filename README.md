# grunt-release-notes
> A grunt plugin to manage creation of a release notes section in your README. See this repo for example usage.

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

## The "build_gh_pages" task

### Overview
In your project's Gruntfile, add a section named `releaseNotes` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    releaseNotes: {
        dir : 'release_notes'
    }
})
```

### Options
* `notesDirectory` - The directory in which your release notes are stored.
    * default : `release_notes`
* `versionSeparator` - The character used to separate the version number from the display date in the release notes file names.
    * default : `_`
* `baseLinkPath` - The base of the path that will be used to generate the links to the release notes. For example : `https://github.com/Solid-Interactive/masseuse/blob/master/`
    * default : `''`
* `notesField` - The field on `grunt.config.releaseNotes` which will be used to create the generate release notes string.
    * default : `notes`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release Notes
* 0.0.0 - 2014-02-20 - [](release_notes/0.0.0_2014-02-20.md)
* 0.1.0 - 2014-02-20 - [features](release_notes/0.1.0_2014-02-20.md)
* 0.1.1 - 2014-02-20 - [patches](release_notes/0.1.1_2014-02-20.md)


_Do not modify directly. This file is compiled from a template._