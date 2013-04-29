/*global module: false */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false, // Don't change variable and function names
                report: 'gzip' // Print size savings to the command line
            },
            excelsior_js: {
                options: {
                    banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | <%= pkg.license.type %>: <%= pkg.license.url %> */\n'

                },
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
            options: {
                require: ['breakpoint', 'sass-media_query_combiner'],
                cssDir: 'css',
                sassDir: 'scss',
                imagesDir: 'images',
                javascriptsDir: 'js',
                outputStyle: 'nested',
                relativeAssets: true,
                force: true
            },
            clean: {
                options: {
                    clean: true
                }
            },
            excelsior: {
                options: {
                    basePath: 'excelsior/'
                }
            },
            app: {
                options: {
                    basePath: 'app/'
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
                    {src: ['**', '!.DS_Store', '!.db', '!.git/', '!.sass-cache/**', '!app/**', '!node_modules/**', '!excelsior/scss/**', '!app/js/site*.*', '!excelsior/images/excelsior-long-500.png', '!excelsior/images/source/**', '!Gruntfile.js', '!.gitignore', '!.editorconfig', '!config-scss-dev.rb', '!config-scss-prod.rb', '!excelsior.zip', '!package.json'], dest: 'excelsior/'},
                    {expand: true, src: ['app/**'], dest: 'excelsior/', ext: '.txt'}
                ]
            }
        },
        concat: {
            addBanners: {
                options: {
                    banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | <%= pkg.license.type %>: <%= pkg.license.url %> */\n'
                },
                files: [
                    {
                        expand: true,
                        src: ['excelsior/css/*.css'],
                        dest: '.'
                    }
                ]
            },
            excelsior: {
                files: {
                    'excelsior/css/excelsior-core.css': [
                        'excelsior/scss/foundation/normalize.css',
                        'excelsior/scss/foundation/foundation.css',
                        'excelsior/css/excelsior-core.css'
                    ]
              }
            }
        },
        cssmin: {
            options: {
                report: 'gzip'
            },
            excelsior_core: {
                src: 'excelsior/css/excelsior-core.css',
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
                src: ['excelsior/css/excelsior-core.css']
            }
        },
        rename: {
            beforeConcat: {
                files: [
                    {src: 'excelsior/css/excelsior.css', dest: 'excelsior/css/excelsior-core.css'}
                ]
            },
            afterConcat: {
                files: [
                    {src: 'excelsior/css/excelsior-core.css', dest: 'excelsior/css/excelsior.css'}
                ]
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-rename');
    //grunt.loadNpmTasks('grunt-csscss'); //TODO: try to fix Ruby 2.0 error on windows

    // Development
    grunt.registerTask('dev', 'Development build',
        [
            'compass:excelsior',
            'compass:app',
            'jshint',
            'rename:beforeConcat',
            'concat:excelsior',
            'rename:afterConcat'
        ]
    );

    // Production
    grunt.registerTask('prod', 'Production build',
        [
            'compass:clean',
            'compass:excelsior',
            'compass:app',
            'uglify',
            'rename:beforeConcat',
            'concat:excelsior',
            'cssmin',
            'concat:addBanners',
            'rename:afterConcat'
        ]
    );

    // Packager
    grunt.registerTask('package', 'Package up the project',
        [
            'compass:clean',
            'compass:excelsior',
            'uglify',
            'rename:beforeConcat',
            'concat:excelsior',
            'cssmin',
            'concat:addBanners',
            'rename:afterConcat',
            'clean:tempFiles',
            'compress'
        ]
    );

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
