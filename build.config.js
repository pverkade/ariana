module.exports = {
    build_dir: 'build',

    src_files: {
        js: ['src/js/*.js'],
        html: 'src/index.html',
        css: 'src/sass/style.css',
        scss: 'src/sass/main.scss',
        sass: ['src/sass/*.scss'],  
    },

    bower_files: {
        js: ['bower_components/*.js', 'bower_components/**/*.js'],
        html: ['bower_components/*.html', 'bower_components/**/*.html'],
        css: ['bower_components/*.css', 'bower_components/**/*.css'],

    }
}