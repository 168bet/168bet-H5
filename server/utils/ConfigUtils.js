
var env = process.env.NODE_ENV || "development";
var redis = require('../configs/redis.json');
var mysql = require('../configs/mysql.json');
var stats = require('../configs/stats.json');
var store = require('../configs/store.json');
var accountLog4js = require('../configs/log4js.json');

var ConfigUtils = module.exports = {};

ConfigUtils.getEnv = function() {
    return env;
};

ConfigUtils.getRedis = function() {
    return redis[env];
};

ConfigUtils.getMysql = function() {
    return mysql[env];
};

ConfigUtils.getStats = function() {
    return stats[env];
};

ConfigUtils.getStore = function() {
    return store[env];
};

ConfigUtils.getLog4js = function() {
    return accountLog4js[env];
};

