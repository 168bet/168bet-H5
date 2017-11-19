
module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            server: {
                expand: true,
                cwd:    "./",
                src:    ['**', '!node_modules/**', '!public/bower_components/**', '!Gruntfile.js' ],
                dest:   "../dist/server"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ['copy']);
};