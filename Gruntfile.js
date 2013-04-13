/*global module: false */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false // Don't change variable and function names
      },
      my_target: {
        files: {
          'js/excelsior/excelsior.min.js': ['src/js/excelsior/excelsior.js'],
          'js/excelsior/off-canvas.min.js': ['src/js/excelsior/off-canvas.js'],
          'js/excelsior/respCharts.min.js': ['src/js/excelsior/respCharts.js'],
          'js/excelsior/responsive-tables.min.js': ['src/js/excelsior/responsive-tables.js'],
          'js/site.js': ['src/js/site.js']
        }
      }
      // build: {
      //   src: 'src/js/<%= pkg.name %>.dev.js',
      //   dest: 'js/<%= pkg.name %>.js'
      // }
    },
    less: {
      development: {
        options: {
          // paths: ["less"],
          dumpLineNumbers: "all"
        },
        files: {
          "css/excelsior.dev.css": "src/less/excelsior.less",
          "css/off-canvas.dev.css": "src/less/off-canvas.less"
        }
      },
      production: {
        options: {
          // paths: ["less"],
          yuicompress: true
        },
        files: {
          "css/excelsior.css": "src/less/excelsior.less",
          "css/off-canvas.css": "src/less/off-canvas.less"
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          Modernizr: true,
          EWF: true
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default tasks
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('default', ['less']);
  grunt.registerTask('default', ['jshint']);

};
