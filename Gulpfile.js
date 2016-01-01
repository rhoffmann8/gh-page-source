var fs = require('fs');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var htmlReplace = require('gulp-html-replace');
var dateFormat = require('dateformat');
var argv = require('yargs').argv;

var isProd = argv.env == 'prod' || false;
var dest = './dist/' + (isProd ? 'prod' : 'dev');

var libScripts = [
  './node_modules/highlightjs/highlight.pack.js',
  './node_modules/marked/lib/marked.js',
  './node_modules/angular/angular.js',
  './node_modules/angular-resource/angular-resource.js',
  './node_modules/angular-route/angular-route.js',
  './node_modules/angular-sanitize/angular-sanitize.js',
  './node_modules/angular-animate/angular-animate.js',
  './node_modules/angular-filter/dist/angular-filter.js'
];

var libStyles = [
  './node_modules/highlightjs/styles/monokai_sublime.css'
];

gulp.task('connect', function() {
  connect.server({
    root: dest,
    port: 8081,
    livereload: true,
    fallback: dest + '/index.html'
  });
})

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./src/**/*.scss', ['css']);
  gulp.watch([
    './src/data/**/*',
    './src/templates/**/*',
    './src/partials/**/*',
    './src/posts/**/*',
    './src/index.html'
  ], ['copy']);
  gulp.watch('./src/images/**/*', ['images']);
});

gulp.task('js', function() {
  var src = libScripts.concat('./src/scripts/*.js');
  return gulp
    .src(src)
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(gulpIf(isProd, rename({extname: '.min.js'})))
    .pipe(gulp.dest(dest + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('css', function() {
  var src = libStyles.concat('./src/styles/app.scss');
  return gulp
    .src(src)
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(sass())
    .pipe(gulpIf(isProd, cssmin()))
    .pipe(gulpIf(isProd, rename({extname:'.min.css'})))
    .pipe(gulp.dest(dest + '/styles'))
    .pipe(connect.reload());
});

gulp.task('copy', function() {
  var src = [
    './src/**/*',
    '!./src/images/**/*',
    '!**/*.js',
    '!**/*.scss'
  ];
  return gulp
    .src(src, { base: './src' })
    .pipe(plumber())
    .pipe(gulpIf(isProd, htmlReplace({
      'css': 'styles/bundle.min.css',
      'js': 'scripts/bundle.min.js'
    })))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  var src = './src/images/**/*';
  return gulp
    .src(src)
    .pipe(plumber())
    .pipe(gulp.dest(dest + '/images'))
    .pipe(connect.reload());
});

gulp.task('post', function(cb) {
  if (!argv.title) {
    console.error('Post requires a title (--title="some title")');
    cb();
    return;
  }

  var now = new Date();

  var title = argv.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  var id =  dateFormat(now, 'yyyy-mm-dd') + '-' + title;
  var postJson = JSON.parse(fs.readFileSync('src/data/posts.json'));
  
  postJson.unshift({
    id,
    title: argv.title,
    date: dateFormat(now, 'yyyy mmm d'),
    description: argv.description
  });

  fs.writeFileSync('src/data/posts.json', JSON.stringify(postJson));
  fs.writeFileSync('src/posts/' + id + '.md', '');

  cb();
});

gulp.task('serve', ['connect', 'watch']);
gulp.task('build', ['copy', 'js', 'css', 'images']);