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
                        src: ['js/excelsior/*.js'],
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
                        src: ['js/*.js'],
                        dest:'.',
                        ext: '.min.js'
                    }
                ]
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

        compass: {
            clean: {
                options: {
                    clean: true
                }
            },
            prod: {
                options: {
                    config: 'config-scss-prod.rb',
                    force: true
                }
            },
            dev: {
                options: {
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
                src: ['css/excelsior.css', 'css/off-canvas.css']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'excelsior.zip',
                    pretty: true
                },
                dest: 'excelsior/',
                src: ['**', '!.DS_Store', '!.db', '!.git/', '!.sass-cache/**','!node_modules/**', '!scss/**', '!js/site*.*', '!images/excelsior-long-500.png', '!images-source/**', '!Gruntfile.js', '!.gitignore', '!.editorconfig', '!config-scss-dev.rb', '!config-scss-prod.rb', '!excelsior.zip', '!package.json']
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-csscss');

    // Development
    grunt.registerTask('dev', 'Development build', ['compass:dev', 'jshint']);

    // Production
    grunt.registerTask('prod', 'Production build', ['compass:clean', 'compass:prod', 'compass:dev', 'uglify']);

    // Packager
    grunt.registerTask('package', 'Package up the project', ['compass:clean', 'compass:prod', 'compass:dev', 'uglify', 'compress']);

    // RUN ALL THE TASKS!!
    grunt.registerTask('sink', 'Kitchen Sink', ['compass:clean', 'compass:prod', 'compass:dev', 'csscss', 'jshint', 'uglify', 'compress']);

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
