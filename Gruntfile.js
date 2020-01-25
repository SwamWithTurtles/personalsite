module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: "expanded"
                },
                files: {
                    "dist/styles/main.css": "styles/main.scss"
                }
            }
        },
        serve: {
            path: "index-2.html",
            options: {
                port: 9001
            }
        },
        open : {
            dev: {
                path: 'http://localhost:9001/index-2.html'
            }
        },
        watch: {
            css: {
                files: ['styles/*.scss'],
                tasks: ['sass:dist']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    // Default task(s).
    grunt.registerTask('default', ['sass', 'serve', 'open:dev']);

};