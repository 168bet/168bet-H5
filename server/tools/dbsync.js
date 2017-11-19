#!/usr/bin/env node

/**
 * Module dependencies.
 */
var program = require('commander');
var async = require('async');
var app = require('../app');
var PapayaDB = require('../models/papaya');

/**
 * Commander implements.
 */
function parseDB(val) {
    if (val == "papaya") {
        return PapayaDB;
    }
}

function syncDB(db, table) {
    var iterator = function(name, callback) {
        var Model = db.models[name];

        Model.sync({ force: program.force }).then(function() {
            console.log("Model %s synced...", name);
            callback();
        }).catch(function(e) {
            callback(e);
        })
    };

    var keys = [];
    if (table != null) {
        keys = [ table ];
    }
    else {
        keys = Object.keys(db.models);
    }

    async.eachSeries(keys, iterator, function(err) {
        if (err != null) {
            console.error("models init error", err);
            process.exit(-1);
        }

        console.log("models init success!");
        process.exit(0);
    });
}

if (app.get('env') == "production") {
    console.error("Don't do this in production environment!!!");
    process.exit(-1);
}

/**
 * Commander defines.
 */
program
    .version("0.0.1", null)
    .option("-d --database [db]", "database name", parseDB, null)
    .option("-t --table [tbl]", "table name", null, null)
    .option("-f --force", "force sync", null, null)
    .parse(process.argv);

syncDB(program.database, program.table);




