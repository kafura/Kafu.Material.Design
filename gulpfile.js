/// <binding ProjectOpened='watch' />
// Include gulp
var gulp = require("gulp");

// Install tools and plugins.
var es = require("event-stream"),
    del = require("del"),
    path = require("path"),
    plugins = require("gulp-load-plugins")();

// Set paths
var basePath = {
    src: "./src/",
    build: "./build/"
},
	path = {
	    less: {
	        src: basePath.src + "less/",
	        build: basePath.build
	    },
	    js: {
	        src: basePath.src + "js/",
	        build: basePath.build
	    }
	};

var lessSrc = path.less.src + "kmd.less";

var jsSrc = [
    path.js.src + "kmd.core.js"
];

// Concatenate & Minify SCSS
gulp.task("less", function (cb) {
  gulp.src(lessSrc)
        //.pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true, "sourcemap=none": true })) //hack to allow autoprefixer to work
        //.pipe(plugins.rubySass({ unixNewlines: true, precision: 4, noCache: true, sourcemap: false })) 
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer({
            browsers: ["> 1%", "last 2 versions", "ie 9"],
            cascade: true,
            remove: false
        }))
        .pipe(gulp.dest(path.less.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(path.less.build))
        .on("end", cb);
});

// Concatenate & Minify JS
gulp.task("scripts", function (cb) {

    es.concat(
    // Lint
    gulp.src(path.js.src + "*.js")
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter("default")),

    gulp.src(jsSrc)
        .pipe(plugins.concat("kmd.js"))
        .pipe(gulp.dest(path.js.build))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.uglify({ preserveComments: "some" }))
        .pipe(gulp.dest(path.js.build))

        ).on("end", cb);
});

gulp.task("clean", ["less", "scripts"], function (cb) {
    //del("./dist/responsive.zip", cb);
});

//gulp.task("zip", ["clean"], function (cb) {
//    gulp.src(basePath.build + "**/*")
//        .pipe(plugins.zip("responsive.zip"))
//        .pipe(gulp.dest(basePath.dist))
//        .on("end", cb);
//});

gulp.task("watch", function () {
    // Watch for changes to our JS
    gulp.watch(path.js.src + "**/*.js", ["scripts"]);

    // Watch for changes to our Sass
    gulp.watch(path.less.src + "**/*.less", ["less"]);

});

//gulp.task("release", ["zip"]);

// Default Task
gulp.task("default", ["less", "scripts"]);
