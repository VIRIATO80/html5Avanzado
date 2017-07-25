var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require("browser-sync").create();
var notify = require("gulp-notify");
var gulpImport = require("gulp-html-import");
var browserify = require("browserify");
var tap = require("gulp-tap");
var buffer = require("gulp-buffer");

//Tarea por defecto
gulp.task("default", [ "copiarHTMLImport","sass", "js" ], function(){

    //Iniciamos el browser-sync como servidor de desarrollo    
    browserSync.init({ server: "dist/" });

    //Observa cambios en los archivos sass y entonces ejecuta la tarea sass que compila los fuentes
    gulp.watch(["src/scss/*.scss", "src/scss/**/*.scss"], ["sass"]);

    //Observa cambios en los archivos JS y entonces ejecuta la tarea JS que compila los fuentes javascript
    gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);

    // observa cambios en los archivos HTML y entonces recarga el navegador
    gulp.watch(["src/*.html","src/**/*.html"], ["copiarHTMLImport"]);

    // observa cambios en los archivos HTML y entonces recarga el navegador
   /* gulp.watch("src/*.html", function(){
        browserSync.reload();
        notify().write("Navegador recargado");
    });*/

});


//Copiar a carpeta DIST los archivos HTML sin utilizar módulos de Gulp complementarios
/*gulp.task("copiarHTML", function(){
    var sourceFiles = [ 'src/*.html' ];
    var destination = 'dist/';
   gulp.src(sourceFiles)
   .pipe(gulp.dest(destination));

});
*/

//Copiar a carpeta DIST los archivos HTML utilizando el módulo gulp-html-import
gulp.task("copiarHTMLImport", function(){
    var sourceFiles = [ 'src/*.html' ];
    var destination = 'dist/';
   gulp.src(sourceFiles) //Coger archivos de src
   .pipe(gulpImport("src/components/"))
   .pipe(gulp.dest(destination))
   .pipe(browserSync.stream())
   .pipe(notify("HTML Importado"));

});


//Compilación de Sass
gulp.task("sass", function(){

    gulp.src("src/scss/style.scss") // cargamos el archivo style.scss
        .pipe(sass().on("error", function(error){
            return;//Si ocurre un error mostramos una notificación
        })) // lo compilamos con gulp-sass
        .pipe(gulp.dest("dist/")) // guardamos el resultado en la carpeta dist
        .pipe(browserSync.stream()); // recargue el CSS del navegador

});

gulp.task("js", function(){
    gulp.src("src/js/main.js")
        .pipe(tap(function(file){
            file.contents = browserify(file.path)
                .transform("babelify",{presets: ["es2015"]})
                .bundle()
                .on("error", function (error) {
                    return notify().write(error);
                })
        }))
        .pipe(buffer())
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream())
        .pipe(notify("JS compilado"));
})