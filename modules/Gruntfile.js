
module.exports = function(grunt) {
    var projectName = process.argv[2] || "default";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        projectName: projectName,
        files: [
            "actions/Action.js",
            "actions/ActionInstant.js",
            "actions/ActionInterval.js",
            "network/SocketIO.js",
            "support/Point.js",
            "support/PointExtension.js",
            "utils/URLUtils.js"
        ],

        concat: {
            options: {
                banner: '/*! <%= projectName %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            project: {
                src: [
                    '<%= files %>'
                ],
                dest: '../<%= projectName%>/src/modules/<%= pkg.name %>.js'
            },
            build: {
                src: [
                    '<%= files %>'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                src: '<%= files %>'
            }
        },

        jshint: {
            build: {
                src: '<%= baseFiles %>'
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    if (projectName == "default") {
        grunt.registerTask("default", ['concat', 'uglify']);
    }
    else {
        grunt.registerTask(projectName, ['concat:project']);
    }
};