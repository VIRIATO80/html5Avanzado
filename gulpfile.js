var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require("browser-sync").create();
var notify = require("gulp-notify");
var gulpImport = require("gulp-html-import");


//Tarea por defecto
gulp.task("default", [ "copiarHTMLImport","sass" ], function(){

    //Iniciamos el browser-sync como servidor de desarrollo    
    browserSync.init({ server: "dist/" });

    //Observa cambios en los archivos sass y entonces ejecuta la tarea sass que compila los fuentes
    gulp.watch(["src/scss/*.scss", "src/scss/**/*.scss"], ["sass"]);

    // observa cambios en los archivos HTML y entonces recarga el navegador
   /* gulp.watch("src/*.html", function(){
        browserSync.reload();
        notify().write("Navegador recargado");
    });*/


    // observa cambios en los archivos HTML y entonces recarga el navegador
    gulp.watch(["src/*.html","src/**/*.html"], ["copiarHTMLImport"]);

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