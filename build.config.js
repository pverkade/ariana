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
        css: [
            'vendor/bootstrap/dist/css/bootstrap.css.map'
        ],
        fonts: [
            'vendor/mdi/fonts/materialdesignicons-webfont.woff',
            'vendor/mdi/fonts/materialdesignicons-webfont.woff2',
            'vendor/mdi/fonts/materialdesignicons-webfont.ttf'
        ]
    },
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    build_files: {
        js: ['<%= build_dir %>/js/bower.js', '<%= build_dir %>/js/*.js'],
        css: ['<%= build_dir %>/css/*.css']
    }
};
