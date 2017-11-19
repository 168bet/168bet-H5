
module.exports = function(grunt) {
    // if (process.argv.length < 3) {
    //     console.log('Usage: grunt projectName');
    //     process.exit(-1);
    // }

    var isProject = true;
    var projectName = process.argv[2];
    var projectFiles = null;
    try {
        projectFiles = grunt.file.readJSON(projectName + '/' + projectName + '.files.json')
    } catch (e) {
        isProject = false;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        projectName: projectName,
        projectFiles: projectFiles,
        baseFiles: [
            "base/boot.js",
            "base/events.js",
            "base/serialize.js",
            "base/entity.js",
            "base/player.js",
            "base/game.js"
        ],
        constFiles: [
            "consts/code.js"
        ],
        utilFiles: [
            "utils/utils.js"
        ],

        copy: {
            papaya: {
                expand: true,
                cwd:    "./",
                src:    ['**', '!node_modules/**', '!Gruntfile.js' ],
                dest:   "../dist/papaya"
            }
        },

        concat: {
            options: {
                banner: '/*! <%= projectName %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            project: {
                src: [
                    '<%= baseFiles %>',
                    '<%= constFiles %>',
                    '<%= utilFiles%>',
                    '<%= projectFiles %>'
                ],
                dest: '../client/<%= projectName%>/src/game/<%= pkg.name %>.js'
            },
            build: {
                src: [
                    '<%= baseFiles %>',
                    '<%= utilFiles%>',
                    '<%= projectFiles>'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                src: '<%= baseFiles %>',
                dest: 'dist/<%= pkg.name %>.min.js'
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

    grunt.registerTask("default", ['copy']);

    if (isProject) {
        grunt.registerTask(projectName, ['concat:project']);
    }
};