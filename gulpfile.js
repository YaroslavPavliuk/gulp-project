const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
// html
const fileInclude = require('gulp-file-include');
const htmlClean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');
// scss
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const maps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-cleaner-css');
const sassGlob = require('gulp-sass-glob');
const webpCSS = require('gulp-webp-css');
// IMG
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
// FONTS
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter-fix');
// JS
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
// all
const fs = require('fs'); 
const del = require('del');
const rename = require('gulp-rename');
const cached = require('gulp-cached');
const zip = require('gulp-zip');
// HTML dev
const pages = () => {
  return src(['./src/index.html'])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}
// HTML build
const pagesBuild = () => {
  return src('./app/**/*.html')
    .pipe(webpHTML())
    .pipe(htmlClean())
    .pipe(dest('./build'))
}
// SCSS dev
const styles = () =>{
  return src('./src/scss/**/*.scss')
    .pipe(cached('styles'))
    .pipe(maps.init())
    .pipe(sassGlob())
    .pipe(scss({
      outputStyle: 'expanded'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(maps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
}
// SCSS build
const stylesBuild = () =>{
  return src('./app/css/main.min.css')
    .pipe(webpCSS())
    .pipe(dest('./build/css/'))
}
// IMG dev
const imgToApp = () => {
  return src('./src/img/**/*.*')
    .pipe(dest('./app/img'))
}
// IMG build
const imgBuild = () => {
  return src('./app/img/**/*.*')
    .pipe(webp())
    .pipe(dest('./app/img'))
    .pipe(src('./app/img/**/*.*'))
    .pipe(imagemin())
    .pipe(dest('./build/img/'))
}
// Fonts dev
const srcFolder = './src';
const destFolder = './app';

const convertFonts = () => {
	return src(['./src/fonts/*.otf', './src/fonts/*.eot'])
  .pipe(
    fonter({
      formats: ['ttf'],
    })
  )
  .pipe(dest('./src/fonts/'))
  .pipe(src('./src/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('./app/fonts'))
}

const stylesFonts = () => {
	let fontsFile = `${srcFolder}/scss/base/_fonts.scss`;

	fs.readdir(`${destFolder}/fonts/`, function (err, fontsFiles) {
		if (fontsFiles) {
			
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0]
							? fontFileName.split('-')[0]
							: fontFileName;
						let fontWeight = fontFileName.split('-')[1]
							? fontFileName.split('-')[1]
							: fontFileName;
						if (fontWeight.toLowerCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === 'bold') {
							fontWeight = 700;
						} else if (
							fontWeight.toLowerCase() === 'extrabold' ||
							fontWeight.toLowerCase() === 'heavy'
						) {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(
							fontsFile,
							`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
							cb
						);
						newFileOnly = fontFileName;
					}
				}
		}
	});
  return src('./src/scss/base')
	function cb() {}
};
// FONTS build
const fontsBuild = () => {
  return src('./app/fonts/**/*')
    .pipe(dest('./build/fonts/'))
}
// JS dev
const scripts = () => {
  return src('./src/js/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(cached('scripts'))
    .pipe(maps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(maps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}
// JS BUILD
const scriptsBuild = () => {
  return src('./app/js/main.min.js')
    .pipe(dest('./build/js'))
}
// CLEAN dev
const clean = () => {
  return del(['app/*'])
}
// ZIP build project
const zipBuild = () => {
  return src(`build/**/*`)
     .pipe(zip('build.zip'))
     .pipe(dest('./'));
 }
// WATCHING
const watchFiles = () => {
  browserSync.init({
    server: {
        baseDir: "./app"
    }
  });
  watch('./src/scss/**/*.scss', styles);
  watch('./src/**/*.html', pages);
  watch('./src/img/**/*.*', imgToApp);
  watch('./src/js/**/*.js', scripts);
}
// default task
exports.default = series(clean, parallel(pages, scripts, convertFonts, imgToApp),stylesFonts, styles, watchFiles); // GULP start
exports.build = parallel(pagesBuild, stylesBuild, imgBuild, fontsBuild, scriptsBuild); // GULP build
exports.zipBuild = zipBuild; // GULP zip build project