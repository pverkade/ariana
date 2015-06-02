module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');

    var appConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            files: {
                '<%= scr_files.css %>': '<%= src_files.scss %>'
            }
        },

        clean: {
            build: [
                '<%= build_dir %>/'
            ],

            css: [
                '0'
            ]
        },

        copy: {
            build_js: {
                files: [{
                    src: ['<%= src_files.js %>'],
                    dest: '<%= build_dir %>/src/js',
                    cwd: '.',
                    expand: true,
                    flatten: true
                }]
            },
            build_html: {
                files: [{
                    src: ['<%= src_files.html %>'],
                    dest: '<%= build_dir %>/',
                    cwd: '.',
                    expand: true
                }]
            },
            build_css: {
                files: [{
                    src: '0',
                    dest: '<%= build_dir %>/<%= src_files.css %>',
                }]
            },
            build_bower: {
                files: [{
                    src: ['<%= bower_files.js %>', '<%= bower_files.html %>', '<%= bower_files.css %>'],
                    dest: '<%= build_dir %>/bower_components',
                    cwd: '.',
                    expand: true
                }]
            }
        },

        delta: {
            js: {
                files: ['<%= src_files.js %>'],
                tasks: ['copy:build_js']
            },
            html: {
                files: '<%= src_files.html %>',
                tasks: ['copy:build_html']
            },
            sass: {
                files: ['<%= src_files.sass %>'],
                tasks: ['sass', 'copy:build_css']
            }
        },

        index: {
            build: {
                dir: '<%= build_dir %>',
                src: ['<%= src_files.js', '<%= bower_files.js %>']
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, appConfig));

    grunt.registerTask('build', 
        [
            'clean:build',
            'sass', 
            'copy:build_js', 
            'copy:build_html', 
            'copy:build_css',
            'clean:css',
            'copy:build_bower',
            'index:build'
        ]
    );
    grunt.registerTask('watch', ['build', 'delta']);
    grunt.registerTask('default', 'build');

    grunt.renameTask('watch', 'delta');
}