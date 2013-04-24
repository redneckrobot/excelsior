/*global module: false */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> */\n',
                mangle: false, // Don't change variable and function names
                report: 'gzip'  // Print size savings to the command line
            },
            my_target: {
                files: {
                    'js/excelsior/excelsior.min.js': ['js/excelsior/excelsior.js'],
                    'js/excelsior/off-canvas.min.js': ['js/excelsior/off-canvas.js'],
                    'js/excelsior/respCharts.min.js': ['js/excelsior/respCharts.js'],
                    'js/excelsior/responsive-tables.min.js': ['js/excelsior/responsive-tables.js'],
                    'js/site.min.js': ['js/site.js']
                }
            }
        },

        jshint: {
            files: ['js/excelsior/excelsior.js', 'js/excelsior/off-canvas.js', 'js/excelsior/respCharts.js', 'js/excelsior/responsive-tables.js', 'js/site.js'],
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
        },

        watch: {
            scripts: {
                // files: ['<%= jshint.files %>'], //TODO: Why doesn't this work?
                files: ['js/excelsior/excelsior.js', 'js/excelsior/off-canvas.js', 'js/excelsior/respCharts.js', 'js/excelsior/responsive-tables.js', 'js/site.js'],
                tasks: ['jshint'],
                options: {
                    interrupt: true
                }
            },
            src: {
                files: ['scss/*.scss'],
                tasks: ['compass:dev']
            }
        },

        compass: { // TODO: Make this pull in foundation.css and normalize.css or rename them to scss, compass has no concatenate.
            clean: {
              options: {
                clean: true
              }
            },
            prod: {
              options: {
                config: 'config-prod.rb',
                force: true
              }
            },
            dev: {
              options: {
                config: 'config-dev.rb',
                force: true
              }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks
    // grunt.registerTask('default', ['less', 'jshint', 'uglify']);

    // Development setup
    grunt.registerTask('dev', 'Development build', ['compass:dev', 'jshint']);

    // Production setup
    grunt.registerTask('prod', 'Production build', ['compass:clean', 'compass:prod', ,'compass:dev', 'jshint', 'uglify']);

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
