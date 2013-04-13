/*global module: false */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false, // Don't change variable and function names
                report: 'min'  // Print size savings to the command line
            },
            my_target: {
                files: {
                    'js/excelsior/excelsior.min.js': ['src/js/excelsior/excelsior.js'],
                    'js/excelsior/off-canvas.min.js': ['src/js/excelsior/off-canvas.js'],
                    'js/excelsior/respCharts.min.js': ['src/js/excelsior/respCharts.js'],
                    'js/excelsior/responsive-tables.min.js': ['src/js/excelsior/responsive-tables.js'],
                    'js/site.min.js': ['src/js/site.js']
                }
            }
        },

        less: {
            development: {
                options: {
                    dumpLineNumbers: "all"
                },
                files: {
                    "src/css/excelsior.css": "src/less/excelsior.less",
                    "src/css/off-canvas.css": "src/less/off-canvas.less"
                }
            },
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    "css/excelsior.min.css": "src/less/excelsior.less",
                    "css/off-canvas.min.css": "src/less/off-canvas.less"
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
