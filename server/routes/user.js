/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var UUID = require('uuid');
var request = require('request');
var async = require('async');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:user');
var PapayaDB = require('../models/papaya/');
var paramFilter = require('../middleware/ParamFilter');
var signUtils = require('../utils/SignUtils');
var cacheManager = require('../service/CacheManager');
var tokenManager = require('../service/TokenManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

module.exports = {
    path: "/user",
    route: router
};

router.use(paramFilter.verifyDeviceID);

/*
 * 签发SyncToken
 * {
 *     userID: userID
 * }
 * 获得凭证后发起/user/sync请求：获取账户信息以及换领访问令牌(AccessToken)
 * 在/portal中同样会签发SyncToken，用于第三方跳转时客户端直接发起/user/sync请求
 */
router.get('/auth', function(req, res) {
    var udid  = req.query.udid;
    var token = req.query.token;
    var User  = PapayaDB.models.user;

    User.findOne({
        where: { udid: udid }
    }).then(function(user) {
        if (user == null) {
            return User.create({
                account: udid,
                udid:    udid,
                trail:   1,
                agent:   "nw",
                currency: "TOKEN"
            });
        }

        return user;
    }).then(function(user) {
        var payload = {
            userID: user.id
        };

        tokenManager.signSync(payload, function(err, token) {
            if (err != null) {
                res.JSONP(Code.Failed, Code.INTERNAL.TOKEN_ERROR, null);
                return;
            }

            res.JSONP(Code.OK, null, {
                token: token
            });
        });
    }).catch(function(e) {
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR, null);
    });
});

router.get('/sync', function(req, res) {
    var user = req.user;
    var token = req.token;
    var agent = cacheManager.getAgent(req.user.agent);
    var nickName = (user.trail && "Guest" + user.id) || user.nickName || user.account;

    var data = {};
    data.player = {
        id:        user.id,
        name:      nickName,
        language:  user.language
    };

    async.series([
        function(callback) {
            agent.getBalance(req, function(err, balance) {
                if (err != null) {
                    callback(err);
                    return
                }

                data.player.balance = Math.floor(balance/100);
                callback(null);
            });
        },

        function(callback) {
            tokenManager.revoke(token, function(done) {
                if (done != true) {
                    callback(done);
                } else {
                    callback(null);
                }
            });
        },

        function(callback) {
            var payload = {
                userID:       user.id,
                agent:        req.user.agent,
                nickname:     token.nickname,
                gameId:       token.gameId,
                sessionId:    token.sessionId,
                currency:     token.currency
            };
            
            tokenManager.signAccess(payload, function(err, token) {
                if (err != null) {
                    return callback(err);
                }

                data.token = token;
                callback(null);
            });
        }

    ], function(err) {
        if (err != null) {
            res.JSONP(Code.Failed, Code.INTERNAL.TOKEN_ERROR, null);
            return;
        }

        res.JSONP(Code.OK, null, data);
    });
});
