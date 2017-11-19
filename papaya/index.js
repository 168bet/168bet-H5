
var fs = require('fs');
var path = require('path');
var files = require('./files.json');
/*
 * require libs js files to memory
 * init our namespace
 */
files.forEach(function(file) {
    if (file.indexOf('libs/') != -1) {
        return;
    }

    require(path.resolve(__dirname, file));
});

var products = [
    'Fruit',
    'lucky5',
    'pokerGo',
    //'pokerGoGo',
    'Shark',
    'DiamondDeal'
];

for (var i in products) {
    var projectName = products[i];
    var product_file = require(__dirname + '/' + projectName + '/' + projectName + '.files.json');

    product_file.forEach(function(file) {
        require(path.resolve(__dirname, file));
    });
}

/*
 * Export our namespace to users
 */
module.exports = global.Papaya;
