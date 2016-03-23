//Gulp.js configuration

//include gulp and plugins
var gulp = require('gulp'),
    newer = require('gulp-newer'),
    sourcestream = require('vinyl-source-stream'),
    browserify = require('browserify'),
    preprocess = require('gulp-preprocess'),
    htmlclean = require('gulp-htmlclean'),
    templateCache = require('gulp-angular-templatecache'),
    imagemin = require('gulp-imagemin'),
    imacss = require('gulp-imacss'),
    del = require('del'),
    less = require('gulp-less'),
    pleeease = require('gulp-pleeease'),
    jshint = require('gulp-jshint'),
    mainBowerFiles = require('gulp-main-bower-files'),
    concat = require('gulp-concat'),
    pkg = require('./package.json');

//file locations
var
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');
    source = 'app_client/source/',
    dest = 'app_client/build/',

    html = {
        in: source + '*.html',
        watch: [source + 'index.html', source + 'templates/**/*.html'],
        out: dest,
        context: {
            devBuild: devBuild
        },
        angularViews: {
            in: source + 'app/**/*.html',
            out: dest + 'js/',
            options: {
                filename: 'angularviews.js',
                module: 'lavishMe'
            }
        }
    },

    images = {
        in: source + 'images/*.*',
        out: dest + 'images/'
    },

    imguri = {
        in: source + 'less/inline_images/*',
        out: source + 'less/images/',
        filename: '_datauri.less',
        namespace: 'img'
    },

    css = {
        in: source + 'less/main.less',
        watch: [source + 'less/**/*', '!' + imguri.out + imguri.filename],
        out: dest + 'css/',
        pleeeaseOpts: {
            autoprefixer: { browsers: ['last 2 versions', '> 2%']},
            rem: ['16px'],
            pseudoElements: true,
            mqpacker: true,
            minifier: !devBuild
        }
    },

    js = {
        in: source + 'app/**/*.js',
        out: dest + 'js/',
        filename: 'main.js',
        appStartFile: source + 'app/app.js'
    };

//show build type
console.log(pkg.name + ' ' + pkg.version + ', '
    + (devBuild ? 'development' : 'production') + ' build');

//clean the build folder
gulp.task('clean', function() {
    del([
        dest + '*'
    ]);
});

//compile Less
gulp.task('less', ['imguri'], function() {
   var page = gulp.src(css.in);
    page = page.pipe(less());
    page = page.pipe(pleeease(css.pleeeaseOpts));
    return page.pipe(gulp.dest(css.out))
});

//build HTML files
gulp.task('html', function() {
    var page = gulp.src(html.in).pipe(preprocess({context: html.context}));
    if(!devBuild){
        page = page.pipe(htmlclean());
    }
    return page.pipe(gulp.dest(html.out));
});

// manage images
gulp.task('images', function() {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out));
});

gulp.task('imguri', function() {
    return gulp.src(imguri.in)
        .pipe(imagemin())
        .pipe(imacss(imguri.filename, imguri.namespace))
        .pipe(gulp.dest(imguri.out));
});

gulp.task('js', function() {

        if(devBuild) {
            gulp.src(js.in)
                .pipe(newer(js.out))
                .pipe(jshint())
                .pipe(jshint.reporter('default'))
                .pipe(jshint.reporter('fail'));
        }

        var bundleStream = browserify(js.appStartFile)
            .bundle()
            .pipe(sourcestream('main.js'));

        return bundleStream.pipe(gulp.dest(js.out));

});

gulp.task('angularviews', function () {
    return gulp.src(html.angularViews.in)
        .pipe(templateCache(html.angularViews.options))
        .pipe(gulp.dest(html.angularViews.out));
});

gulp.task('bower', function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(js.out));
});


// default task
gulp.task('default', ['html', 'images', 'less', 'js', 'angularviews', 'bower'], function() {

    //image changes
    gulp.watch(images.in, ['images']);

    //html changes
    gulp.watch(html.watch, ['html']);

    //Angular Views changes
    gulp.watch(html.angularViews.in, ['angularviews']);

    //css changes
    gulp.watch([css.watch, imguri.in], ['less']);

    //JS changes
    gulp.watch([js.in], ['js']);
});
