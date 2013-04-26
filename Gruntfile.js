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
            ewf_core: {
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
            optional_js: {
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
            scss: {
                files: ['excelsior/scss/*.scss'],
                tasks: ['compass:dev']
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
        csscss: {
            options: {
                colorize: true,
                verbose: true
                //, require: 'config-scss-dev.rb'
            },
            dist: {
                src: ['excelsior/css/excelsior.css', 'excelsior/css/off-canvas.css']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'excelsior.zip',
                    pretty: true
                },
                dest: 'excelsior/',
                src: ['**', '!.DS_Store', '!.db', '!.git/', '!.sass-cache/**','!node_modules/**', '!excelsior/scss/**', '!app/js/site*.*', '!excelsior/images/excelsior-long-500.png', '!excelsior/images/src/**', '!Gruntfile.js', '!.gitignore', '!.editorconfig', '!config-scss-dev.rb', '!config-scss-prod.rb', '!excelsior.zip', '!package.json']
            }
        },
        clean: {
            build: {
                src: ['excelsior/js/core/*.min.js', 'excelsior/css/*.min.css', 'excelsior/.sass-cache/', 'excelsior/*.rb', 'excelsior.zip']
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
    grunt.loadNpmTasks('grunt-csscss');

    // Development
    grunt.registerTask('dev', 'Development build', ['compass:excelsior_dev', 'compass:app_dev', 'jshint']);

    // Production
    grunt.registerTask('prod', 'Production build', ['compass:clean', 'compass:excelsior_prod', 'compass:excelsior_dev', 'compass:app_prod', 'compass:app_dev', 'uglify']);

    // Packager
    grunt.registerTask('pkg', 'Package up the project', ['compass:clean', 'compass:excelsior_prod', 'compass:excelsior_dev', 'uglify', 'compress']);

    // RUN ALL THE TASKS!!
    grunt.registerTask('sink', 'Kitchen Sink', ['compass:clean', 'compass:excelsior_prod', 'compass:excelsior_dev', 'compass:app_prod', 'compass:app_dev', 'csscss', 'jshint', 'uglify', 'compress']);

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
