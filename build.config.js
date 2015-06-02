module.exports = {
    build_dir: 'build',

    src_files: {
        js: ['src/js/*.js'],
        html: 'src/index.html',
        css: 'src/sass/style.css',
        scss: 'src/sass/main.scss',
        sass: ['src/sass/*.scss']
    },

    bower_files: {
        js: ['/*.js', 'bower_components/**/*.js'],
        html: ['/*.html', 'bower_components/**/*.html'],
        css: ['/*.css', 'bower_components/**/*.css']
    }
}