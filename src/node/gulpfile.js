var gulp = require('gulp');
var spawn = require('child_process').spawn;
var ts = require('gulp-typescript');
var merge = require("merge2");
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');
var tsProject = ts.createProject('tsconfig.json');

var packagejson = require('./package.json');

var distFolder = '.dist';
var child;

/**
 * Build
 */
gulp.task('build', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest(distFolder)),
        tsResult.js.pipe(sourcemaps.write('./')).pipe(gulp.dest(distFolder))
    ]);
});


/**
 * Test
 */
gulp.task('test', function () {
    return gulp.src([distFolder+'/test/*.js'], { read: false })
        .pipe(mocha());
});

/**
 * Run
 */
gulp.task('run', function () {
    return new Promise(function(resolve,reject){
        child = spawn('node', [distFolder+'/src/index.js'], { stdio: 'inherit' });
        resolve();
    });
});

/**
 * Stop
 */
gulp.task('stop',function(){
    return new Promise(function(resolve,reject){
        if(child){
            child.kill();
        }
        resolve();
    });
});

/**
 * Watch
 */
gulp.task('watch',function(){
    gulp.watch(['src/**', 'test/**'],gulp.series('stop','build', 'test', 'run'));
});

/**
 * Watch changes and build, test, run again
 */
gulp.task('start', gulp.series('build', 'test', 'run', 'watch'));

/**
 * Deploy
 */
gulp.task('deploy',gulp.series('build', 'test', 'run'));
