module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build_dir: 'build',
        js: ['src/js/*.js'],
        html: ['src/index.html'],
        sass: ['src/sass/*.scss']

        sass: {
            dist: {
                files: {
                    'style.css': 'main.scss'
                }
            }
        },

        copy: {
            build_js: {
                files: [
                    {
                        src: ['<%= js %>'],
                        dest: '<%= build_dir %>/',
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
                        src: ['<%= %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            }
        },

        delta: {
            js: {
                files: ['src/js/*.js'],
                tasks: ['copy:build_js']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['copy:build_html']
            },
            sass: {
                files: ['src/sass/*.scss'],
                tasks: ['sass', 'copy:build_css']
            }

        }
    })

    grunt.registerTask('build', 
        [
            'sass', 
            'copy:build_js', 
            'copy:build_html', 
            'copy:build_css'
        ]
    );
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'delta']);
    grunt.registerTask('default', 'build');
    grunt.registerTask('test', ['sass', 'copy:build_css']);
}