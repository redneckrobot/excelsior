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
            excelsior: {
                files: [
                    {
                        cwd: 'excelsior/js/core/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],
                        expand: true,
                        dest:'excelsior/js/core/',
                        ext: '.min.js'
                    }
                ]
            },
            project: {
                files: [
                    {
                        cwd: 'project-assets/js/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],
                        expand: true,
                        dest:'project-assets/js/',
                        ext: '.min.js'
                    }
                ]
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
            },
            files: [
                'excelsior/js/core/*.js',
                'project-assets/js/*.js',
                '!excelsior/js/core/*.min.js',
                '!project-assets/js/*.min.js'
            ]
        },
        watch: {
            scripts: {
                options: {
                    interrupt: true
                },
                files: [
                    'excelsior/js/core/*.js',
                    'project-assets/js/*.js',
                    '!excelsior/js/core/*.min.js',
                    '!project-assets/js/*.min.js'
                ],
                tasks: ['jshint']
            },
            sass: {
                files: [
                    'excelsior/scss/**/*.scss',
                    'project-assets/scss/**.scss'
                ],
                tasks: [
                    'compass:excelsior',
                    'compass:project',
                    'concat:excelsior'
                ]
            }
        },
        compass: {
            options: {
                require: [
                    'breakpoint',
                    'sass-media_query_combiner'
                ],
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
            project: {
                options: {
                    basePath: 'project-assets/'
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
                    {
                        src: [
                            '**',
                            '!**/*.md', // We'll grab these below and convert them to .txt
                            '!.DS_Store',
                            '!.db',
                            '!.git/**',
                            '!.gitignore',
                            '!.editorconfig',
                            '!excelsior.zip',
                            '!Gruntfile.js',
                            '!package.json',
                            '!.sass-cache/**',
                            '!node_modules/**',
                            '!excelsior/.sass-cache/**',
                            '!excelsior/scss/**',
                            '!excelsior/images/excelsior-long-500.png',
                            '!excelsior/images/source/**'

                        ],
                        dest: 'excelsior/',
                        dot: true // be sure to grab dotfiles
                    },
                    {
                        // Rename the MD files to txt for the zip file
                        src: ['*.md', 'excelsior/**.md', 'project-assets/**.md'],
                        expand: true,
                        dest: 'excelsior/',
                        ext: '.txt'
                    }
                ]
            }
        },
        concat: {
            excelsior: {
                files: [
                    {
                        src: [
                            'excelsior/scss/foundation/normalize.css',
                            'excelsior/scss/foundation/foundation.css',
                            'excelsior/css/excelsior.css'
                        ],
                        dest: 'excelsior/css/excelsior.css'
                    }
                ]
            },
            addBanner: {
                options: {
                    banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> NYS ITS | <%= pkg.repository.url %> | License (<%= pkg.license.type %>): <%= pkg.license.url %> */\n\n'
                },
                files: [
                    {
                        cwd: 'excelsior/',
                        src: [
                            'css/*.min.css',
                            'js/core/*.min.js'
                        ],
                        expand: true,
                        dest: 'excelsior/'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                report: 'min'
            },
            excelsior: {
                files: [
                    {
                        cwd: 'excelsior/css/',
                        src: [
                            '*.css',
                            '!*.min.css'
                        ],
                        dest: 'excelsior/css/',
                        expand: true,
                        ext: '.min.css'
                    }
                ]

            },
            project: {
                files: [
                    {
                        cwd: 'project-assets/css/',
                        src: [
                            '*.css',
                            '!*.min.css'
                        ],
                        dest: 'project-assets/css/',
                        expand: true,
                        ext: '.min.css'
                    }
                ]

            }
        },
        clean: {
            generatedFiles: {
                src: ['excelsior/js/core/*.min.js', 'excelsior/css/*', 'excelsior/.sass-cache/', 'project-assets/.sass-cache/', 'excelsior.zip']
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

    // Development
    grunt.registerTask('dev', 'Development build',
        [
            'compass:excelsior', // Create Excelsior CSS files
            'compass:project', // Create Project CSS files
            'jshint', // detect errors in Excelsior & Project JS
            'concat:excelsior' // Combine excelsior.css with foundation and normalize
        ]
    );

    // Production
    grunt.registerTask('prod', 'Production build',
        [
            'compass', // Clean old sass cache and generate Excelsior & Project css
            'uglify', // minify Excelsior and Project Asset js
            'concat:excelsior', // Combine excelsior.css with foundation and normalize
            'cssmin', // minify the Excelsior & Project css
            'concat:addBanner' // add the Excelsior banner to css and JS files
        ]
    );

    // Package Zip File for Distribution
    grunt.registerTask('package', 'Package up the project',
        [
            'clean', // clean up generated files
            'compass:clean', // clean compas cache
            'compass:excelsior', // Create Excelsior CSS files
            'uglify', // minify Excelsior JS
            'concat:excelsior', // Combine excelsior.css with foundation and normalize
            'cssmin:excelsior', // minify the excelsior css
            'concat:addBanner', // add the Excelsior banner to css and JS files
            'compress' // create zip file
        ]
    );

    // Default task (Force to development build)
    grunt.registerTask('default', 'dev');
};
