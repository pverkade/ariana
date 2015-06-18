module.exports = {
    build_dir: 'build',

    src_files: {
        tpl: 'src/**/*.tpl.html',
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/app/renderengine/**/*.js'],
        jsunit: ['src/**/*.spec.js'],
        ts: ['src/**/*.ts', '!src/app/renderengine/start.ts'],
        sass: 'src/**/*.scss',
        html: 'src/index.html',
        scss: 'src/sass/main.scss',
        assets: ['src/assets/**/*.*'],
        shaders : ['src/shaders/*.glsl']
    },

    vendor_files: {
        js: [
            'vendor/jquery/dist/jquery.js',
            'vendor/bootstrap/dist/js/bootstrap.js',
            'vendor/angular/angular.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/ng-file-upload/ng-file-upload-all.js',
            'vendor/angular-hotkeys/build/hotkeys.js'
        ],
        css: [
            'vendor/bootstrap/dist/css/bootstrap.css.map'
        ]
    },
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    }
};
