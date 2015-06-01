module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');

    var appConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),


        /* Werkt niet... :'(
         * De scss word met de naam '0' in de root gezet, 
         * ipv als style.css in build
         */
        sass: {
            files: {
                '<%= css %>': '<%= scss %>'
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
                files: [
                    {
                        src: ['<%= js %>'],
                        dest: '<%= build_dir %>/src/js',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_html: {
                files: [
                    {
                        src: ['<%= html %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_css: {
                files: [
                    {
                        src: '0',
                        dest: '<%= build_dir %>/<%= css %>',
                    }
                ]
            }
        },

        delta: {
            js: {
                files: ['<%= js %>'],
                tasks: ['copy:build_js']
            },
            html: {
                files: '<%= html %>',
                tasks: ['copy:build_html']
            },
            sass: {
                files: ['<%= sass %>'],
                tasks: ['sass', 'copy:build_css']
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
            'clean:css'
        ]
    );
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'delta']);
    grunt.registerTask('default', 'build');
}