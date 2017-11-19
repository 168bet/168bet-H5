var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var async = require('async');
var config = require('./projects.json');
var child = require('child_process');

var projectName = process.argv[2];
var env = process.argv[3];

if (config[projectName] == null) {
    console.log("project name error....");
    process.exit(-1);
}

var baseDir = config[projectName].baseDir;
var content = fs.readFileSync(baseDir + "/bin/index.html").toString();
var proejctConfig = require(path.resolve(baseDir, "bin/project.json"));
var version = proejctConfig.version;
var revision = child.execSync("git log --pretty=oneline | wc -l").toString().replace(/[ \r\n]/g, '');
var projectVersion = version + "." + revision;

var file;
var files = {
    dir:     baseDir,
    project: projectName,
    version: projectVersion,
    lib: [],
    src: []
};

async.series([
    function(callback) {
        jsdom.env(content, function(errors, window) {
            if (errors != null) {
                return callback(errors);
            }

            var $ = require('jquery')(window);

            $("script").each(function(index, element) {
                if (element.src.indexOf("libs/") != -1) {
                    file = path.resolve(baseDir, "bin", element.src);
                    files.lib.push(file);
                }

                if (element.src.indexOf("src/") != -1) {
                    file = path.resolve(baseDir, "bin", element.src);
                    files.src.push(file);
                }
            });

            fs.writeFile("./dist/files.json", JSON.stringify(files, null, 4), function(err) {
               if (err != null) {
                   return callback(err);
               }

                callback(null);
            });
        });
    },

    function(callback) {
        var htmlIndex = fs.readFileSync("./index.html").toString();

        htmlIndex = htmlIndex.replace("$title$", projectName);
        htmlIndex = htmlIndex.replace("$lib$", "laya.min." + projectVersion + ".js");
        htmlIndex = htmlIndex.replace("$src$", "main.min." + projectVersion + ".js");

        fs.writeFile("./dist/index.html", htmlIndex, function(err) {
            if (err != null) {
                return callback(err);
            }

            callback(null);
        });
    },

    

    function(callback) {
        proejctConfig.showFPS = false;
        proejctConfig.singleAlone = false;
        proejctConfig.version = projectVersion;
        proejctConfig.service = "http://202.131.80.55:2700";
        if (env == "sandbox") {
            proejctConfig.service = "http://sandbox.whalejoy.com:2700";
        }

        fs.writeFile("./dist/project.json", JSON.stringify(proejctConfig, null, 4), function(err) {
            if (err != null) {
                return callback(err);
            }

            callback(null);
        });
    }
], function(err) {
    if (err != null) {
        console.log(err);
        process.exit(-1);
    }

    process.exit(0);
});


