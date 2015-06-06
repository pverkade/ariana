module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-preprocess');

    var glob = require('glob');
    var path = require('path');
    var fs   = require('fs');

    function bundleShaders(srcPattern, dst) {
        var result = {};
        var filenames = glob.sync(srcPattern, {});

        for (var i = 0; i < filenames.length; i++) {
            var filename = filenames[i];
            var sourceName = path.basename(filename, path.extname(filename, 1));
            var typeName = path.extname(sourceName);
            var type;

            if (typeName == "vert") {
                type = "x-shader/x-fragment"
            }
            else if (typeName == "frag") {
                type = "x-shader/x-vertex";
            }
            else {
                throw "Unknown shader type:"
            }

            result[sourceName] = {
                source: fs.readFileSync(filename).toString(),
                type: type
            };
        }

        fs.writeFileSync(dst, "SHADERS = " + JSON.stringify(result, null, 4) + "\n");
    }

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
                src: '<%= build_dir %>/index.html',
            },
            prod: {
                options: {
                    context: {
                        PROD: true
                    }
                },
                src: '<%= build_dir %>/index.html',
            }
        },

        /*
         * Expand sass. Compile from the main.scss file.
         * The main.scss file @imports all other SASS files.
         */
        sass: {
            dist: {
                files: {
                    '<%= build_dir %>/css/ariana.css': '<%= src_files.scss %>'
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
                out: '<%= build_dir %>/js/renderEngine.js'
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
                },
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
                '<%= build_dir %>/js/*.js', '!<%= build_dir %>/js/template.js'
            ],
            css: [
                '<%= build_dir %>/css/ariana.css',
            ],
            assets: [
                '<% build_dir %>/assets/'
            ],
            html: [
                '<%= build_dir %>/index.html'
            ],
            template: [
                '<%= build_dir %>/js/template.js',
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
            build_vendorjs: {
                files: [{
                    src: ['<%= vendor_files.js %>'],
                    dest: '<%= build_dir %>/vendor',
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
            }
        },

        /*
         * Copy and concatenate files from bower_components folder
         */
        bower_concat: {
            all: {
                dest: 'build/js/bower.js',
                cssDest: 'build/css/bower.css',
                bowerOptions: {
                    relative: false
                }
            },
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

        /*
         * Concatenates js and/or css in the build folder
         */
        concat: {
            js: {
                src: ['<%= vendor_files.js %>', '<%=build_dir%>/js/*.js'],
                dest: '<%=build_dir%>/ariana.js'
            },
            css: {
                options: {
                    sourceMap: true
                },
                src: ['<%=build_dir%>/**/*.css'],
                dest: '<%=build_dir%>/ariana.css'
            }
        },

        /*
         * The delta tasks watches for changes and rebuilds the project in build.
         */
        delta: {
            options: {
                livereload: true
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
                tasks: ['chain_js']
            },
            ts: {
                files: ['<%= src_files.ts %>'],
                tasks: ['ts']
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
        'bundle_shaders',
        'sass', // Compile sass -> build/css/ariana.css
        'bower_concat:css', // Concatenate all bower css -> build/css/bower.css
        'ts', // Compile TypeScript -> build/js/typescript.js
        'html2js', // Combine all tpl.html -> build/js/template.js
        'copy:build_js', // Copy all javascript -> build/js/
        'copy:build_vendorjs', // Copy all javascript -> build/js/
        'copy:build_html', // Copy index.html -> build/index.html
        'copy:build_assets', // Copy assets -> build/assets/
        'includeSource', // Link all js and css files to index.html
        'preprocess:dev' // Add some links to index.html
    ]);

    /* The build_prod task completely builds, concats and (SOON) minifies the src */
    grunt.registerTask('build_prod', [
        'clean:build', // Remove build/
        'bundle_shaders',
        'sass', // Compile sass -> build/css/ariana.css
        'bower_concat:css', // Concatenate all bower css -> build/css/bower.css
        'ts', // Compile TypeScript -> build/js/typescript.js
        'html2js', // Combine all tpl.html -> build/js/template.js
        'copy:build_js', // Copy all javascript -> build/js/
        'copy:build_html', // Copy index.html -> build/index.html
        'copy:build_assets', // Copy assets -> build/assets/
        'copy:build_vendorcss', // Copy bower css -> build/css/
        'concat', // Concat all js and css files
        'clean:prod', // remove redundant folders
        'includeSource', // Link ariana.js and ariana.css to index.html
        'preprocess:prod' // Remove redundant links in index.html
    ]);

    /* grunt */
    grunt.registerTask('default', 'build_dev');

    /* grunt dev */
    grunt.registerTask('dev', 'build_dev');

    /* grunt prod */
    grunt.registerTask('prod', 'build_prod');

    /* grunt watch task */
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build_dev', 'delta']);

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
     * Compiles TypeScript and copies all project javascript
     * Rebuilds index.html
     */
    grunt.registerTask('chain_js', [
        'clean:html',
        'clean:js',
        'typescript',
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
        'sass',
    ]);

    /*
     * Removes all assets
     * Copies all assets
     */
    grunt.registerTask('chain_assets', [
        'clean:assets',
        'copy:build_assets'
    ]);

    grunt.registerTask('bundle_shaders', 'Bundles the Shader source code into a js file', function() {
        grunt.log.writeln('Bundeling shaders.');
        bundleShaders(appConfig.src_files.shaders[0], path.join(appConfig.build_dir, "js/shaders.js"));
    });
}