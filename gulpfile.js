var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');

var pkg = require('./bower.json');
var banner = "/* <%= name %> v<%= version %> | Sahib J. Leo | License: MIT | http://sahib.io */\n";

gulp.task('default', function ()
{
    gulp.src('jquery.mapmarker.js')
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(rename('jquery.mapmarker.min.js'))
        .pipe(gulp.dest('./dist/'));
});
