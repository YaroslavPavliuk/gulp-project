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
// fonts
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
// IMG
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
// JS
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
// all
const fs = require('fs'); 
const del = require('del');
const rename = require('gulp-rename');
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
// FONTS dev
const fonts = () => {
  src('./src/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'))
  return src('./src/fonts/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'))
}
// fontsStyle
const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts';

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);
  
  fs.writeFile(srcFonts, '', cb)
  fs.readdir(appFonts, function (err, items){
    if (items) {
      let c_fontname;
      for (var i=0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname +'", "' + fontname +'", 400);\r\n', cb)
        }
        c_fontname = fontname;
      }
    }
  })

  done();
}
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
  watch('./src/fonts/**/*.*', fonts);  
  watch('./src/fonts/**/*.*', fontsStyle);
  watch('./src/js/**/*.js', scripts);
}
// default task
exports.default = series(clean, parallel(pages, scripts, fonts, imgToApp), fontsStyle, styles, watchFiles); // GULP start
exports.build = parallel(pagesBuild, stylesBuild, imgBuild, fontsBuild, scriptsBuild); // GULP build
exports.zipBuild = zipBuild; // GULP zip build project