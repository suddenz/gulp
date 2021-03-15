
const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const include = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

//Paths
const source_folder = 'app/';
const project_folder = 'dist/';

const path = {
	build: {
		html: project_folder,
		css: project_folder + 'styles',
		js: project_folder + 'scripts',
		img: project_folder + 'img',
		fonts: project_folder + 'fonts'
	},

	src: {
		html: source_folder + '*.html',
		css: source_folder + 'scss/*.scss',
		js: source_folder + 'js/*.js',
		img: source_folder + 'img/**/*.{png, jpg, svg, gif, webp, ico}',
		fonts: source_folder + 'fonts/**/*.ttf'
	},
	
	watch: {
		html: source_folder + '**/*.html',
		css: source_folder + 'scss/**/*.scss',
		js: source_folder + 'js/**/*.js',
		img: source_folder + 'img/**/*.{png, jpg, svg, gif, webp, ico}'
	},
	
	clean: '/' + project_folder
}

function html() {
	return src(path.src.html)
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(project_folder))
}

function scss() {
	return src(path.src.css)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(csso())
		.pipe(concat('index.css'))
		.pipe(dest(project_folder))
}

function clear() {
	return del(project_folder)
}

function serve() {
	browserSync.init({
		server: './' + project_folder,
		notify: false,
		online: true
	})

	watch(path.src.html, series(html)).on('change', browserSync.reload)
	watch(path.src.css, series(scss)).on('change', browserSync.reload)
}

exports.build = series(clear, scss, html)
exports.serve = series(clear, scss, html, serve)
exports.clear = clear