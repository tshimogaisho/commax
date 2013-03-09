module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js',
        'routes/**/*.js',
        'package.json',
        'test/**/*.js',
        '*.js',
        'public/javascripts/app/*.js',
        '.jshintrc'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('build', ['jshint']);

};