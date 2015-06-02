module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-sass');

    var appConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: {
                    '<%= src_files.css %>': '<%= src_files.scss %>'
                }
            }
        },

        clean: {
            build: [
                '<%= build_dir %>/'
            ],
            js: [
                '<%= build_dir %>/*.js', '!<%= build_dir %>/ariana.js'
            ],
            css: [
                '<%= build_dir %>/*.css', '!<%= build_dir %>/ariana.css'
            ]
        },

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
                    dest: '<%= build_dir %>/<%= src_files.css %>',
                }]
            }
        },

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

        delta: {
            options: {
                livereload: true
            },

            js: {
                files: ['<%= src_files.js %>'],
                tasks: ['clean:js', 'copy:build_js', 'bower_concat:js', 'concat:js', 'clean:js']
            },
            html: {
                files: '<%= src_files.html %>',
                tasks: ['copy:build_html']
            },
            sass: {
                files: ['<%= src_files.sass %>'],
                tasks: ['clean:css', 'sass', 'copy:build_css', 'bower_concat:css', 'concat:css', 'clean:css']
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, appConfig));

    grunt.registerTask('build', [
        'clean:build',
        'sass',
        'bower_concat:all',
        'copy:build_js',
        'copy:build_html',
        'copy:build_css',
        'concat',
        'clean:js',
        'clean:css'
    ]);

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'delta']);
    grunt.registerTask('default', 'build');
}