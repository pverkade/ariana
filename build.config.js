module.exports = {
    build_dir: 'build',

    src_files: {
        tpl: 'src/**/*.tpl.html',
        js: ['src/**/*.js'],
        ts: ['src/**/*.ts'],
        sass: 'src/**/*.scss',
        html: 'src/index.html',
        scss: 'src/sass/main.scss',
        assets: ['src/assets/**/*.*']
    },

    vendor_files: {
        js: [
            'bower_components/angular/angular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/jquery/dist/jquery.js'
        ]
    }
}