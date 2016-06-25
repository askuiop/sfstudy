var gulp = require('gulp');
//var sass = require('gulp-sass');
//var sourcemaps = require('gulp-sourcemaps');
//var concat = require('gulp-concat');
//var cleanCss = require('gulp-clean-css');
//var util = require('gulp-util');
//var gulpif = require("gulp-if");
var plugins = require('gulp-load-plugins')();
var del = require("del");
var Q = require("q");

var config = {
    bowerDir : "vendor/bower_components/",
    assetsDir : "src/Jims/JbolgBundle/Resources/assets/",
    sassPattern: "sass/**/*.scss",
    jsPattern: "js/**/*.js",
    production: !!plugins.util.env.production,
    sourceMap: !plugins.util.env.production,

    revManifestFile: "src/Jims/JbolgBundle/Resources/assets/rev-manifest.json"
}

var app = {
    addStyle: function (paths, filename) {
        return gulp.src( paths )
            .pipe( plugins.if( config.sourceMap, plugins.sourcemaps.init()) )
            .pipe( plugins.plumber())       //显示错误插件，似乎重复，没用？
            .pipe(plugins.sass())
            .pipe(plugins.concat( 'dist/css/'+filename ))
            .pipe(config.production ? plugins.cleanCss() : plugins.util.noop() )
            .pipe(plugins.rev())
            .pipe( plugins.if( config.sourceMap, plugins.sourcemaps.write(".")) )
            .pipe(gulp.dest('web/'))
            .pipe( plugins.rev.manifest( config.revManifestFile , {
                merge: true
            }) )
            .pipe(gulp.dest('.'))
    },
    addScript: function (paths, filename) {
        gulp.src( paths )
            .pipe( plugins.if( config.sourceMap, plugins.sourcemaps.init()) )
            .pipe( plugins.plumber())
            .pipe(plugins.concat( 'dist/js/' + filename ))
            .pipe(config.production ? plugins.uglify() : plugins.util.noop() )
            .pipe(plugins.rev())
            .pipe( plugins.if( config.sourceMap, plugins.sourcemaps.write(".")) )
            .pipe(gulp.dest('web/'))
            .pipe( plugins.rev.manifest( config.revManifestFile , {
                merge: true
            }) )
            .pipe(gulp.dest('.'))
    },
    addCopy: function (srcFiles, outputDir) {
        return gulp.src( srcFiles )
            .pipe(gulp.dest( outputDir )).on('end', function () {
                console.log('end fonts');
            })
    }
}


gulp.task('styles', function() {
    var pipeline = new Pipeline();

    pipeline.add(
        [
            config.bowerDir + 'bootstrap/dist/css/bootstrap.css',
            config.bowerDir + 'font-awesome/css/font-awesome.css',
            config.assetsDir + 'sass/layout.scss',
            config.assetsDir + 'sass/main.scss'
        ],
        'index.css'
    )

    pipeline.add(
        [
            config.bowerDir + 'bootstrap/dist/css/bootstrap.css',
            config.bowerDir + 'font-awesome/css/font-awesome.css',
            config.assetsDir + 'sass/layout.scss',
            config.assetsDir + 'sass/post.scss'
        ],
        'post.css'
    )

    return pipeline.run(app.addStyle);

});
gulp.task('scripts',['clean'], function () { // 依赖， clean 完成后才执行 (没有返回数据流(Stream)对象)这块有问题
    app.addScript(
        [
            config.bowerDir + 'jquery/dist/jquery.js',
            config.assetsDir+'js/index.js',
        ],
        'index.js'
    )
})

gulp.task('fonts', function () {
    var pipeline = new Pipeline();
    pipeline.add(
        [ config.bowerDir+'font-awesome/fonts/*' ],
        'web/dist/fonts'
    )
    return pipeline.run(app.addCopy);
    //return app.addCopy(
    //    [ config.bowerDir+'font-awesome/fonts/*' ],
    //    'web/dist/fonts'
    //).on('end', function () {
    //    console.log('start fonts');
    //})
})

gulp.task('clean', function () {
    del.sync(config.revManifestFile);
    del.sync("web/dist/*");
})


gulp.task('watch', function () {
    console.log('start watch');
    gulp.watch( config.assetsDir + config.sassPattern, ['styles'])
    gulp.watch( config.assetsDir + config.jsPattern, ['scripts'])
})

gulp.task('default', ['clean', 'styles', 'scripts', 'fonts', 'watch']);

gulp.task('sequence', plugins.sequence('clean', ['styles', 'scripts', 'fonts'], 'watch'));//顺序执行：'clean', run 'styles', 'scripts','fonts' in parallel after 'clean';



var Pipeline = function() {
    this.entries = [];
};
Pipeline.prototype.add = function() {
    this.entries.push(arguments);
};
Pipeline.prototype.run = function(callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;
    var runNextEntry = function() {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {
            deferred.resolve();
            return;
        }
        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function() {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();
    return deferred.promise;
};