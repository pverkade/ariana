module.exports = {
    build_dir: 'build',

    src_files: {
        tpl: 'src/**/*.tpl.html',
        js: ['src/**/*.js', '!src/app/renderengine/*.js'],
        ts: ['src/**/*.ts'],
        sass: 'src/**/*.scss',
        html: 'src/index.html',
        scss: 'src/sass/main.scss',
        assets: ['src/assets/**/*.*'],
        shaders : ['src/shaders/*.glsl']
    },

    vendor_files: {
        js: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/ng-file-upload/ng-file-upload-all.js'
        ],
        css: [
            'bower_components/bootstrap/dist/css/bootstrap.css.map',
        ]
    }
}