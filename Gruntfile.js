/*global module: false */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
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

        less: {
            development: {
                options: {
                    yuicompress: true
                },
                files: {
                    "css/excelsior.css": "less/excelsior.less",
                    "css/off-canvas.css": "less/off-canvas.less"
                }
            },
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    "css/excelsior.min.css": "less/excelsior.less",
                    "css/off-canvas.min.css": "less/off-canvas.less",
                    "css/site.min.css": "css/site.css"
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default tasks
    grunt.registerTask('default', ['less']);
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('default', ['uglify']);

};
