/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:utils:data');
var PapayaDB = require('../models/papaya');
var cacheManager = require('../service/CacheManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya');
var Code = Papaya.Code;

var DataUtils = module.exports = {};

DataUtils.update = function(instance, callback) {
    instance.save().then(function() {
        callback(null);
    }).catch(function(e) {
        callback(e);
    })
};

DataUtils.transferCredit = function(callback) {

};