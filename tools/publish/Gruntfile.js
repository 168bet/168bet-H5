
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        files: grunt.file.readJSON("./dist/files.json"),

        concat: {
            options: {
            },
            lib: {
                src: [
                    '<%= files.lib %>'
                ],
                dest: './dist/laya.js'
            },
            src: {
                src: [
                    '<%= files.src %>'
                ],
                dest: './dist/main.js'
            }
        },

        uglify: {
            options: {
            },
            lib: {
                src: './dist/laya.js',
                dest: './dist/laya.min.<%= files.version %>.js'
            },
            src: {
                src: './dist/main.js',
                dest: './dist/main.min.<%= files.version %>.js'
            }
        },

        copy: {
            client: {
                files: [
                    {
                        expand: true,
                        cwd:    "./dist",
                        src:    ['**', '!laya.js', '!main.js', '!files.json' ],
                        dest:   "../../dist/client/<%= files.project %>/<%= files.version %>"
                    },
                    {
                        expand: true,
                        cwd:    "<%= files.dir %>/bin",
                        src:    ['**', '!libs/**', '!index.html', '!project.json' ],
                        dest:   "../../dist/client/<%= files.project %>/<%= files.version %>"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", [ 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
};