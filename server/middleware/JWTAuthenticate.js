/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var UUID = require('uuid');
var request = require('request');
var JWT = require('jsonwebtoken');
var unless = require('express-unless');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:middle:jwt-auth');
var PapayaDB = require('../models/papaya/');
var tokenManager = require('../service/TokenManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

var middleware = function(req, res, next) {
    var token = null;

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0];
            var credentials = parts[1];
            
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        }
    }

    if (token == null) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_TOKEN);
        return;
    }

    var dtoken = null;
    try {
        dtoken = JWT.decode(token, { complete: true }) || {};
    } catch (err) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_TOKEN);
        return;
    }
    
    tokenManager.verify(token, function(err, decoded) {
        if (err != null) {
            res.JSONP(Code.Failed, Code.REQUEST.INVALID_TOKEN);
            return;
        }

        var User = PapayaDB.models.user;

        User.findOne({
            where: { id: decoded.userID }
        }).then(function(user) {
            if (user == null) {
                res.JSONP(Code.Failed, Code.REQUEST.INVALID_TOKEN);
                return;
            }

            req.token = decoded;
            req.user  = user;

            next();
        }).catch(function(e) {
            res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR, null);
        });
    });
};

middleware.unless = unless;
module.exports = middleware;
