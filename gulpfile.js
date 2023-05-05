// ! извлечь требуемые переменные/функции
import pkg from 'gulp';
const { src, dest, series, watch, parallel } = pkg;
import concat from 'gulp-concat';
import htmlMin from 'gulp-htmlmin';
import autoPrefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
browserSync.create();
import svgSprite from 'gulp-svg-sprite';
import image from 'gulp-image';
import uglifyPkg from 'gulp-uglify-es';
const uglify = uglifyPkg.default;
import babel from 'gulp-babel';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';

// ! очистка файлов перед новой сборкой
export const clean = () => {
  return del(['dist']);
}

// ! простое копирование важных файлов, в т.ч. тех, которые не применяются пока, в боевую папку
export const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'));
}

// ! задать таск - слияние и минификация CSS-файлов
export const stylesBuild = () => {
  return src('src/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(autoPrefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(dest('dist'));
}
export const styles = () => {
  return src('src/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    // .pipe(autoPrefixer({
    //   cascade: false,
    // }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// ! задать таск - минификация html-файлов
export const htmlMinifyBuild = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest(['dist']))
    .pipe(browserSync.stream());
}
export const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// ! задать таск - сжатие изображений
export const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
    'src/img/**/*.webp',
    'src/img/*.svg',
  ])
    .pipe(image())
    .pipe(dest('dist/img'));
  // .pipe(browserSync.stream()); // -----> не будем обновлять браузер при изменении изображений
}

// ! задать таск - создание svg-спрайтов (нужно в случае, если эти картинки впоследствии нужно будет динамически изменять, например, при hover)
export const svgSprites = () => {
  return src('src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/img'))
  // .pipe(browserSync.stream()); // -----> не будем обновлять браузер при изменении изображений
}

// ! задать таск (оптимизация и слияние js-файлов)
export const scriptsBuild = () => {
  return src([
    'src/js/main.js',
    'src/js/components/**/*.js',
  ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream()); // ! обязателен запуск сервера, иначе не будет работать подключение модулей js и файлы шрифтов
    // browser-sync start --server --files ".html, .css, .js"  -----> можно так в папке /dist
}
export const scripts = () => {
  return src([
    'src/js/main.js',
    'src/js/components/**/*.js',
  ])
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    .pipe(concat('app.js'))
    // .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// ! задать таск (запуск локального сервера)
export const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    }
  })
}

// ! настроить наблюдение за изменяющимися файлами - при изменении в результате наблюдения вызываются нужные таски
watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/img/**/*.*', images);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);

// ! настроить выполнение нескольких тасков по порядку по умолчанию вызовом команды gulp
export default series(clean, resources, htmlMinify, styles, scripts, images, svgSprites, watchFiles);
export const build = series(clean, resources, htmlMinifyBuild, stylesBuild, scriptsBuild, images, svgSprites);


