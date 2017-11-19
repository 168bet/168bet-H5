/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var async = require('async');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:shark');
var PapayaDB = require('../models/papaya');
var cacheManager = require('../service/CacheManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;
var Shark = Papaya.Shark;
var gameID = Papaya.Game.ID_SHARK;

module.exports = {
    path: "/shark",
    route: router
};

router.use(function(req, res, next) {
    var userID = req.user.id;
    var Profile = PapayaDB.models.profile;

    Profile.findOne({
        where: { userID: userID, gameID: gameID }
    }).then(function(record) {
        if (record == null) {
            var game = new Shark.Game();

            return Profile.create({
                userID: userID,
                gameID: gameID,
                data: game.toString()
            });
        }

        return record;
    }).then(function(record) {

        req.profile = record;
        req.game    = new Shark.Game(record.data);

        next();
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    });
});

router.get('/enter', function(req, res) {
    var data = {};
    var game = req.game;

    res.JSONP(Code.OK, null, data);
});

router.get('/ready', function(req, res, next) {
    var bet = req.query.bet;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        //分配新鱼
        function(callback) {
            var resultData = game.ready();

            data.fishPool = game.fishPool.concat();
            data.retData = resultData;

            callback(null);
        },

        function(callback) {
            agent.withdraw(req, 0, function(err, balance) {
                if (err != null) {
                    callback(err);
                    return;
                }

                data.balance = balance;
                callback(null);
            });
        },

        // 数据存盘
        function(callback) {
            profile.data = game.toString();
            profile.save().then(function() {
                callback(null);
            }).catch(function(e) {
                debug(e);
                callback(Code.INTERNAL.MySQL_ERROR);
            })
        }
    ], function(err) {
        if (err != null) {
            res.JSONP(Code.Failed, err);
            return;
        }

        res.JSONP(Code.OK, null, data);
    });
});

router.get('/draw', function(req, res, next) {
    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {
            agent.withdraw(req, 0, function(err, balance) {
                if (err != null) {
                    callback(err);
                    return;
                }

                data.balance = balance;
                callback(null);
            });
        },

        // 数据存盘
        function(callback) {
            profile.data = game.toString();
            profile.save().then(function() {
                callback(null);
            }).catch(function(e) {
                debug(e);
                callback(Code.INTERNAL.MySQL_ERROR);
            })
        }
    ], function(err) {
        if (err != null) {
            res.JSONP(Code.Failed, err);
            return;
        }
        res.JSONP(Code.OK, null, data);
    });
});

router.get('/runnow', function(req, res) {
    var params = req.query.info;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {
            data = game.runNow(params);

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (game.betCount > 0) {
                //单位转换
                var depositCount = (game.winScore - game.betCount) * 100;
                agent.deposit(req, depositCount, function(err, balance) {
                    if (err != null) {
                        callback(err);
                        return;
                    }

                    data.balance = balance;
                    callback(null);
                });
            } else {
                callback(null);
            }
        },

        //游戏存盘
        function(callback) {
            profile.data = game.toString();
            profile.save().then(function() {
                callback(null);
            }).catch(function(e) {
                debug(e);
                callback(Code.INTERNAL.MySQL_ERROR);
            })
        }

    ], function(err) {
        if (err != null) {
            res.JSONP(Code.Failed, err);
            return;
        }

        res.JSONP(Code.OK, null, data);
    });
});
