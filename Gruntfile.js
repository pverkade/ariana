module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-karma');

    var glob = require('glob');
    var path = require('path');
    var fs   = require('fs');

    var appConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        /*
         * Run preprocessor over index.html
         */
        preprocess: {
            options: {
                inline: true
            },
            dev: {
                options: {
                    context: {
                        DEV: true
                    }
                },
                src: '<%= build_dir %>/index.html'
            },
            prod: {
                options: {
                    context: {
                        PROD: true
                    }
                },
                src: '<%= build_dir %>/index.html'
            }
        },

        /*
         * Expand sass. Compile from the main.scss file.
         * The main.scss file @imports all other SASS files.
         */
        sass: {
            dist: {
                files: {
                    '<%= build_dir %>/css/style.css': '<%= src_files.scss %>'
                }
            },
            options: {
                includePaths: require('node-bourbon').includePaths
            }
        },

        /*
         * Compile and concat TypeScript (WIP)
         */
        ts: {
            default: {
                src: ['<%= src_files.ts %>'],
                out: '<%= build_dir %>/js/renderEngine.js',
                sourceMap: false,
                fast: 'never'
            }
        },

        /*
         * Concat all tpl.html into a javascript file
         */
        html2js: {
            options: {
                module: 'templates-ariana'
            },
            main: {
                src: ['<%= src_files.tpl %>'],
                dest: '<%= build_dir %>/js/template.js'
            }
        },

        /*
         * include all our project and bower sources as independent links in index
         */
        includeSource: {
            options: {
                rename: function (dest, matchedSrcPath, options) {
                    // Strip build/ from path
                    return matchedSrcPath.replace('build/', '');
                },
                ordering: 'top-down'
            },
            target: {
                files: {
                    'build/index.html': 'build/index.html'
                }
            }
        },

        /*
         * Various cleaning operations.
         * Mostly used to clean build and clean temp items.
         */
        clean: {
            build: [
                '<%= build_dir %>/'
            ],
            js: [
                '<%= build_dir %>/js/*.js', '!<%= build_dir %>/js/template.js', '!<%= build_dir %>/js/renderEngine.js'
            ],
            ts: [
                '<%= build_dir %>/js/renderEngine.js'
            ],
            css: [
                '<%= build_dir %>/css/style.css'
            ],
            assets: [
                '<% build_dir %>/assets/'
            ],
            html: [
                '<%= build_dir %>/index.html'
            ],
            template: [
                '<%= build_dir %>/js/template.js'
            ],
            prod: [
                '<%= build_dir %>/js',
                '<%= build_dir %>/assets',
                '<%= build_dir %>/css',
                '<%= build_dir %>/vendor'
            ]
        },

        /*
         * Copy files from src dir to the build dir
         */
        copy: {
            build_js: {
                files: [{
                    src: ['<%= src_files.js %>'],
                    dest: '<%= build_dir %>/js',
                    cwd: '.',
                    expand: true,
                    flatten: true
                }]
            },
            build_html: {
                files: [{
                    src: '<%= src_files.html %>',
                    dest: '<%= build_dir %>/index.html',
                    cwd: '.',
                    expand: false
                }]
            },
            build_vendorcss: {
                files: [{
                    src: '<%= vendor_files.css %>',
                    dest: '<%= build_dir %>/css',
                    cwd: '.',
                    expand: true,
                    flatten: true
                }]
            },
            build_assets: {
                files: [{
                    src: ['**'],
                    dest: '<%= build_dir %>/assets',
                    cwd: 'src/assets/',
                    expand: true
                }]
            },
            fonts: {
                files: [{
                    src: ['<%= vendor_files.fonts %>'],
                    dest: '<%= build_dir %>/fonts/',
                    cwd: '.',
                    expand: true,
                    flatten: true
                }]
            }
        },

        /*
         * Copy and concatenate files from bower_components folder
         */
        bower_concat: {
            js: {
                dest: 'build/js/bower.js',
                bowerOptions: {
                    relative: false
                }
            },
            css: {
                cssDest: 'build/css/bower.css',
                bowerOptions: {
                    relative: false
                }
            }
        },

        /**
         * `ngAnnotate` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngAnnotate: {
            compile: {
                files: [{
                    src: ['<%= src_files.js %>'],
                    dest: '<%= build_dir %>/js/',
                    expand: true,
                    flatten: true
                }]
            }
        },

        /**
         * Minify and uglify javascript file
         */
        uglify: {
            compile: {
                files: {
                    '<%= build_dir %>/ariana.js': ['<%= build_files.js %>']
                }
            }
        },

        /**
         * Minify css file
         */
        cssmin: {
            target: {
                files: {
                    '<%= build_dir %>/ariana.css': ['<%= build_files.css %>']
                }
            }
        },

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            src: [ 
                '<%= src_files.js %>'
            ],
            test: [
                '<%= src_files.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                force: true
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js'
            },
            unit: {
                singleRun: true
            },
            continuous: {
                background: true,
                singleRun: false
            }
        }, 

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= test_files.js %>',
                    '<%= src_files.jsunit %>'
                ]
            }
        },

        /*
         * The delta tasks watches for changes and rebuilds the project in build.
         */
        delta: {
            options: {
                livereload: true
            },
            startup: {
                files: [], // This is redundant, but necessary
                tasks: ['karma:continuous:start'],
                options: {
                    atBegin: true,
                    spawn: false
                }
            },
            html: {
                files: ['<%= src_files.html %>'],
                tasks: ['chain_html']
            },
            tpl: {
                files: ['<%= src_files.tpl %>'],
                tasks: ['chain_html']
            },
            js: {
                files: ['<%= src_files.js %>'],
                tasks: ['jshint:src', 'chain_js']
            },
            jsunit: {
                files: ['<%= src_files.jsunit %>'],
                tasks: ['jshint:test', 'karmaconfig', 'karma:continuous:run']
            },
            ts: {
                files: ['<%= src_files.ts %>'],
                tasks: ['clean:ts', 'ts']
            },
            sass: {
                files: ['<%= src_files.sass %>'],
                tasks: ['chain_css']
            },
            assets: {
                files: ['<%= src_files.assets %>'],
                tasks: ['chain_assets']
            },
            shaders: {
                files: ['<%= src_files.shaders %>'],
                tasks: ['bundle_shaders']
            }
        }
    };

    /* Extend config with our custom config */
    grunt.initConfig(grunt.util._.extend(taskConfig, appConfig));

    /* The build_dev task does not concat and minify */
    grunt.registerTask('build_dev', [
        'clean:build', // Remove build/
        'sass', // Compile sass -> build/css/ariana.css
        'bower_concat', // Concatenate all bower files -> build/
        'build_renderengine', // Compile render engine -> build/js/renderengine.js
        'html2js', // Combine all tpl.html -> build/js/template.js
        'jshint', // Lint all javascript files
        'copy:build_js', // Copy all javascript -> build/js/
        'copy:build_html', // Copy index.html -> build/index.html
        'copy:build_assets', // Copy assets -> build/assets/
        'copy:build_vendorcss', // Copy bower css -> build/css/
        'copy:fonts', // Copy the material design fonts
        'includeSource', // Link all js and css files to index.html
        'preprocess:dev' // Add some links to index.html
    ]);

    /* The build_prod task completely builds, concats and (SOON) minifies the src */
    grunt.registerTask('build_prod', [
        'clean:build', // Remove build/
        'sass', // Compile sass -> build/css/ariana.css
        'bower_concat', // Concatenate all bower files -> build/
        'build_renderengine', // Compile render engine -> build/js/renderengine.js
        'html2js', // Combine all tpl.html -> build/js/template.js
        'copy:build_html', // Copy index.html -> build/index.html
        'copy:build_assets', // Copy assets -> build/assets/
        'copy:build_vendorcss', // Copy bower css -> build/css/
        'copy:fonts', // Copy the material design fonts
        'ngAnnotate', // Fix array annotation
        'uglify', // Uglify and minify javascript file
        'cssmin', // Minify css file
        'clean:prod', // Remove redundant folders
        'includeSource', // Link ariana.js and ariana.css to index.html
        'preprocess:prod' // Remove redundant links in index.html
    ]);

    /* grunt */
    grunt.registerTask('default', ['build_dev', 'karmaconfig', 'karma:unit']);

    /* grunt dev */
    grunt.registerTask('dev', 'build_dev');

    /* grunt prod */
    grunt.registerTask('prod', 'build_prod');

    /* grunt watch task */
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build_dev', 'karmaconfig', 'karma:unit', 'delta']);

    /*
     * Removes index.html and templates.js
     * Rebuilds index.html and templates.js
     */
    grunt.registerTask('chain_html', [
        'clean:html',
        'clean:template',
        'copy:build_html',
        'html2js',
        'includeSource',
        'preprocess:dev'
    ]);

    /*
     * Removes index.html and all project js (excluding vendor/ and template.js)
     * and copies all project javascript
     * Rebuilds index.html
     */
    grunt.registerTask('chain_js', [
        'clean:html',
        'clean:js',
        'copy:build_js',
        'copy:build_html',
        'includeSource',
        'preprocess:dev'
    ]);

    /*
     * Removes ariana.css
     * Compiles SASS and rebuilds ariana.css
     */
    grunt.registerTask('chain_css', [
        'clean:css',
        'sass'
    ]);

    /*
     * Removes all assets
     * Copies all assets
     */
    grunt.registerTask('chain_assets', [
        'clean:assets',
        'copy:build_assets'
    ]);

    function bundleShaders(srcPattern, dst) {
        var result = {};
        var filenames = glob.sync(srcPattern, {});

        for (var i = 0; i < filenames.length; i++) {
            var filename = filenames[i];
            var sourceName = path.basename(filename, path.extname(filename));
            var typeName = path.extname(sourceName);
            var type;

            if (typeName == ".vert") {
                type = "x-shader/x-vertex";
            }
            else if (typeName == ".frag") {
                type = "x-shader/x-fragment"
            }
            else {
                return false;
            }

            result[sourceName] = {
                source: fs.readFileSync(filename).toString(),
                type: type
            };
        }

        fs.writeFileSync(dst, "var SHADERS = " + JSON.stringify(result, null, 4) + "\n");
        return true;
    }

    /*
     * Bundles all shaders to a global object.
     */
    grunt.registerTask('bundle_shaders', 'Bundles the Shader source code into a js file', function() {
        if (!bundleShaders(appConfig.src_files.shaders[0], "src/app/renderengine/shaders.ts")) {
            grunt.fail.fatal("Unsupported/unknown shader type.");
        }
    });

    grunt.registerTask('build_renderengine', ['bundle_shaders', 'ts']);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function(file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function() {
        var jsFiles = filterForJS(this.filesSrc);

        grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
            process: function(contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });

};