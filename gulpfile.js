
var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    tsResult.js.pipe(rename('euglena')).pipe(gulp.dest("bin"));
});

/**
 * Run tests
 */
gulp.task('test', function () {
    return gulp.src(['test/index.js'], { read: false })
        .pipe(mocha());
});
