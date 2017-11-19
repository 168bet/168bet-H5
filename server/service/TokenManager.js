/*
 * Base Dependencies
 */
var fs = require('fs');
var path = require('path');
var async = require('async');
var UUID = require('uuid');
var JWT = require('jsonwebtoken');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:service:token');
var redis = require('../dbc/redis');

var TokenManager = module.exports = {};

TokenManager.name = "TokenManager";
TokenManager.SECRET = "9JnUrTFkIY3qfFFO7xQxbnw4My6J6mjy";
TokenManager.REVOKE_PREFIX = "jwt:revoke:";

TokenManager.init = function(cb) {
    var self = this;

    this.games = {};
    this.players = {};

    async.series([
    ], function(err, results) {
        if (err != null) {
            debug("TokenManager init error: ", err);
            return;
        }

        debug("%s inited...", self.name);
        process.nextTick(cb);
    });
};

TokenManager.start = function(cb) {
    debug("%s started...", this.name);
    process.nextTick(cb);
};

TokenManager.stop = function(cb) {
    debug("%s stopped...", this.name);
    process.nextTick(cb);
};

TokenManager.signSync = function(payload, cb) {
    var options = {
        algorithm: "HS256",
        issuer:    "Papaya Inc.",
        subject:   "SyncToken",
        audience:  "User",
        expiresIn: 5 * 60,
        jwtid:     UUID.v4()
    };

    JWT.sign(payload, this.SECRET, options, function(err, token) {
        cb && cb(err, token);
    });
};

TokenManager.signAccess = function(payload, cb) {
    var options = {
        algorithm: "HS256",
        issuer:    "Papaya Inc.",
        subject:   "AccessToken",
        audience:  "User",
        expiresIn: 60 * 60,
        jwtid:     UUID.v4()
    };

    JWT.sign(payload, this.SECRET, options, function(err, token) {
        cb && cb(err, token);
    });
};

TokenManager.revoke = function(decoded, cb) {
    decoded = decoded || {};

    var jti = decoded.jti || null;
    var exp = decoded.exp - decoded.iat;

    if (jti == null || exp < 0) {
        cb && cb(false);
        return;
    }

    var revokeKey = this.REVOKE_PREFIX + decoded.jti;
    redis.setex(revokeKey, exp, 1, function(err, results) {
        if (err != null) {
            cb && cb(false);
            return;
        }

        cb && cb(true);
    });
};

TokenManager.verify = function(token, cb) {
    JWT.verify(token, this.SECRET, function(err, decoded) {
        if (err != null) {
            cb && cb(err);
            return;
        }

        var revokeKey = this.REVOKE_PREFIX + decoded.jti;
        redis.get(revokeKey, function(err, results) {
            if (err != null) {
                cb && cb(err);
                return;
            }

            if (results != null) {
                cb && cb(results);
                return;
            }

            cb && cb(null, decoded);
        });
    });
};
