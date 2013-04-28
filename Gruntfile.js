/*global module: false */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | <%= pkg.license.type %>: <%= pkg.license.url %> */\n',
                mangle: false, // Don't change variable and function names
                report: 'gzip' // Print size savings to the command line
            },
            excelsior_js: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: ['excelsior/js/core/*.js', '!excelsior/js/core/*.min.js'],
                        dest:'.',
                        ext: '.min.js'
                    }
                ]
            },
            app_js: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: ['app/js/*.js', '!app/js/*.min.js'],
                        dest:'.',
                        ext: '.min.js'
                    }
                ]
            }
        },
        jshint: {
            files: ['excelsior/js/core/*.js', '!excelsior/js/core/*.min.js', 'app/js/*.js', '!app/js/*.min.js'],
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
                files: ['excelsior/js/core/*.js', '!excelsior/js/core/*.min.js', 'app/js/*.js', '!app/js/*.min.js'],
                tasks: ['jshint'],
                options: {
                    interrupt: true
                }
            },
            sass: {
                files: ['excelsior/scss/**.scss', 'app/scss/**.scss'],
                tasks: ['compass:excelsior_dev', 'compass:app_dev']
            }
        },
        compass: {
            clean: {
                options: {
                    clean: true
                }
            },
            excelsior_prod: {
                options: {
                    basePath: 'excelsior/',
                    config: 'config-scss-prod.rb',
                    force: true
                }
            },
            excelsior_dev: {
                options: {
                    basePath: 'excelsior/',
                    config: 'config-scss-dev.rb',
                    force: true
                }
            },
            app_prod: {
                options: {
                    basePath: 'app/',
                    config: 'config-scss-prod.rb',
                    force: true
                }
            },
            app_dev: {
                options: {
                    basePath: 'app/',
                    config: 'config-scss-dev.rb',
                    force: true
                }
            }
        },
        compress: {
            createZipPackage: {
                options: {
                    archive: 'excelsior.zip',
                    pretty: true
                },
                files: [
                    {src: ['**', '!.DS_Store', '!.db', '!.git/', '!.sass-cache/**', '!app/**', '!node_modules/**', '!excelsior/scss/**', '!app/js/site*.*', '!excelsior/images/excelsior-long-500.png', '!excelsior/images/src/**', '!Gruntfile.js', '!.gitignore', '!.editorconfig', '!config-scss-dev.rb', '!config-scss-prod.rb', '!excelsior.zip', '!package.json'], dest: 'excelsior/'},
                    {expand: true, src: ['app/**'], dest: 'excelsior/', ext: '.txt'}
                ]
            }
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | <%= pkg.license.type %>: <%= pkg.license.url %> */\n'
            },
            addBanners: {
                files: [
                    {
                        expand: true,
                        src: ['excelsior/css/*.css'],
                        dest: '.'
                    }
                ]
            },
            dist: {
                files: {
                    'excelsior/css/excelsior.css': ['excelsior/css/temp-excelsior.css']
                }
            },
            preMinify: {
                files: {
                    'excelsior/css/temp-excelsior.css': ['excelsior/scss/foundation/normalize.css',
                                                         'excelsior/scss/foundation/foundation.css',
                                                         'excelsior/css/excelsior.css']
              }
            }
        },
        cssmin: {
            excelsior_core: {
                src: 'excelsior/css/temp-excelsior.css',
                dest: 'excelsior/css/excelsior.min.css'
            },
            excelsior_offCanvas: {
                src: 'excelsior/css/off-canvas.css',
                dest: 'excelsior/css/off-canvas.min.css'
            }
        },
        clean: {
            generatedFiles: {
                src: ['excelsior/js/core/*.min.js', 'excelsior/css/*', 'excelsior/.sass-cache/', 'app/.sass-cache/', 'excelsior.zip']
            },
            tempFiles: {
                src: ['excelsior/css/temp-*.css']
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-css');
    //grunt.loadNpmTasks('grunt-csscss'); //TODO: try to fix Ruby 2.0 error on windows

    // Development
    grunt.registerTask('dev', 'Development build', ['compass:excelsior_dev', 'compass:app_dev', 'jshint', 'concat:preMinify', 'cssmin', 'concat:dist', 'concat:addBanners', 'clean:tempFiles']);

    // Production
    grunt.registerTask('prod', 'Production build', ['compass:clean', 'compass:excelsior_prod', 'compass:app_prod', 'uglify', 'concat:preMinify', 'cssmin', 'concat:dist', 'concat:addBanners', 'clean:tempFiles']);

    // Packager
    grunt.registerTask('package', 'Package up the project', ['compass:clean', 'compass:excelsior_prod', 'compass:excelsior_dev', 'uglify', 'cssmin', 'concat', 'clean', 'compress']);

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
