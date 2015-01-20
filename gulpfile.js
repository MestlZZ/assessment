/// <vs AfterBuild='analyze, build' SolutionOpened='watch' />
var
    gulp = require('gulp'),
    path = require('path'),
    merge = require('merge-stream'),
	eventStream = require('event-stream'),

    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),

    less = require('gulp-less'),
    css = require("gulp-minify-css"),
    csso = require('gulp-csso'),

    uglify = require('gulp-uglify'),


    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),

    replace = require('gulp-replace'),
    del = require('del'),

    output = './.output',
	buildVersion = +new Date()
;

require('jshint-stylish');

var addBuildVersion = function () {
    var doReplace = function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '')                                                                          // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&')          // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2')  // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\'');                              // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    }
    return eventStream.map(doReplace);
};

gulp.task('analyze', function () {
    var paths = ['./src/app/**/*.js', './src/settings/js/settings.js'];

    var jshint = analyzejshint(paths);
    var jscs = analyzejscs(paths);
    return merge(jshint, jscs);
});

function analyzejshint(sources) {
    return gulp
        .src(sources)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
}

function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(jscs('.jscsrc'));
}

gulp.task('css', function () {
    gulp.src(['./src/css/fonts/fonts.less', './src/css/styles.less'])
       .pipe(less())
       .pipe(css())
       .pipe(csso())
       .pipe(gulp.dest('./src/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./src/css/*', ['css']);
});

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('build', ['clean', 'css', 'build-app', 'build-settings'], function () {
});

gulp.task('build-app', ['clean', 'css'], function () {
    var assets = useref.assets();

    return merge(

        gulp.src('./src/index.html')
            .pipe(assets)
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', css()))
            .pipe(assets.restore())
            .pipe(useref())
            .pipe(gulp.dest(output)),

        gulp.src(['./src/css/fonts/**', '!./src/css/fonts/*.less'])
            .pipe(gulp.dest(output + '/css/fonts')),

        gulp.src(['./src/css/img/**'])
            .pipe(gulp.dest(output + '/css/img')),

        gulp.src(['./src/css/*.css'])
            .pipe(gulp.dest(output + '/css')),
        
        gulp.src(['./src/img/**'])
            .pipe(gulp.dest(output + '/img')),

        gulp.src(['./src/app/views/**/*.html'])
            .pipe(gulp.dest(output + '/app/views')),
        
        gulp.src(['./src/app/modules/xApi/views/**/*.html'])
            .pipe(gulp.dest(output + '/app/modules/xApi/views')),

        gulp.src(['./src/content/**/*.*'])
            .pipe(gulp.dest(output + '/content')),

        gulp.src('./src/manifest.json')
            .pipe(gulp.dest(output)),

        gulp.src(['./src/settings.js'])
            .pipe(gulp.dest(output)),

        gulp.src(['./src/publishSettings.js'])
            .pipe(gulp.dest(output))
        );
});

gulp.task('build-settings', ['clean', 'css'], function () {
    var assets = useref.assets();

    gulp.src(['src/settings/settings.html'])
      .pipe(assets)
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', css()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest(output + '/settings'));

    gulp.src('src/settings/css/fonts/**')
      .pipe(gulp.dest(output + '/settings/css/fonts'));

    gulp.src('src/settings/css/settings.css')
      .pipe(css())
      .pipe(gulp.dest(output + '/settings/css'));

    gulp.src('src/settings/img/**')
      .pipe(gulp.dest(output + '/settings/img'));
});
