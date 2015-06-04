module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-html2js');

    var appConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        /*
         * Expand sass. Compile from the main.scss file.
         * The main.scss file @imports all other SASS files.
         */
        sass: {
            dist: {
                files: {
                    '<%= build_dir %>/<%= src_files.css %>': '<%= src_files.scss %>'
                }
            }
        },

        /*
         * Compile and concat TypeScript (WIP)
         */
        typescript: {
            base: {
                src: ['<%= src_files.ts %>'],
                dest: '<%= build_dir %>/ts.js',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    keepDirectoryHierarchy: false
                }
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
                dest: '<%= build_dir %>/tpl.js'
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
                '<%= build_dir %>/*.js', '!<%= build_dir %>/ariana.js'
            ],
            css: [
                '<%= build_dir %>/*.css', '!<%= build_dir %>/ariana.css'
            ],
            js_hard: [
                '<%= build_dir %>/*.js'
            ],
            css_hard: [
                '<%= build_dir %>/*.css'
            ],
            assets: [
                '<% build_dir %>/assets'
            ]
        },

        /*
         * Copy files from src dir to the build dir
         */
        copy: {
            build_js: {
                files: [{
                    src: ['<%= src_files.js %>'],
                    dest: '<%= build_dir %>',
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
            build_css: {
                files: [{
                    src: '<%= src_files.css %>',
                    dest: '<%= build_dir %>/<%= src_files.css %>'
                }]
            },
            build_assets: {
                files: [{
                    src: [ '**' ],
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
                dest: 'build/_bower.js',
                cssDest: 'build/_bower.css',
                bowerOptions: {
                    relative: false
                }
            },
            js: {
                dest: 'build/_bower.js',
                bowerOptions: {
                    relative: false
                }
            },
            css: {
                cssDest: 'build/_bower.css',
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
                src: ['<%=build_dir%>/*.js'],
                dest: '<%=build_dir%>/ariana.js'
            },
            css: {
                src: ['<%=build_dir%>/*.css'],
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
                tasks: ['clean:js_hard', 'chain_html', 'chain_js']
            },
            js: {
                files: ['<%= src_files.js %>'],
                tasks: ['clean:js_hard', 'chain_html', 'chain_js']
            },
            ts: {
                files: ['<%= src_files.ts %>'],
                tasks: ['clean:js_hard', 'chain_html', 'chain_js']
            },
            sass: {
                files: ['<%= src_files.sass %>'],
                tasks: ['clean:css_hard', 'chain_css']
            },
            assets: {
                files: ['<%= src_files.assets %>'],
                tasks: ['clean:assets', 'chain_assets']
            }
        }
    };

    /* Extend config with our custom config */
    grunt.initConfig(grunt.util._.extend(taskConfig, appConfig));

    /* The build task completely builds, concats and (SOON) minifies the src */
    grunt.registerTask('build', [
        'clean:build',
        'sass',
        'bower_concat:all',
        'typescript',
        'html2js',
        'copy:build_js',
        'copy:build_html',
        'copy:build_css',
        'copy:build_assets',
        'concat',
        'clean:js',
        'clean:css'
    ]);

    /* grunt */
    grunt.registerTask('default', 'build');

    /* grunt watch task */
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'delta']);
    
    /* custom build chains */
    grunt.registerTask('chain_html', ['copy:build_html', 'html2js']);
    grunt.registerTask('chain_js', ['typescript', 'copy:build_js', 'bower_concat:js', 'concat:js', 'clean:js']);
    grunt.registerTask('chain_css', ['sass', 'copy:build_css', 'bower_concat:css', 'concat:css', 'clean:css']);
    grunt.registerTask('chain_assets', ['copy:build_assets']);
}