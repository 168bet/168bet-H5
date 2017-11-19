/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var async = require('async');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:diamondDeal');
var PapayaDB = require('../models/papaya');
var cacheManager = require('../service/CacheManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;
var DiamondDeal = Papaya.DiamondDeal;
var gameID = Papaya.Game.ID_DIAMONDDEAL;

module.exports = {
    path: "/diamondDeal",
    route: router
};

router.use(function(req, res, next) {
    var userID = req.user.id;
    var Profile = PapayaDB.models.profile;

    Profile.findOne({
        where: { userID: userID, gameID: gameID }
    }).then(function(record) {
        if (record == null) {
            var game = new DiamondDeal.Game();

            return Profile.create({
                userID: userID,
                gameID: gameID,
                data: game.toString()
            });
        }

        return record;
    }).then(function(record) {

        req.profile = record;
        req.game    = new DiamondDeal.Game(record.data);

        next();
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    });
});

router.get('/enter', function(req, res) {
    var data = {};
    var game = req.game;
    var profile = req.profile;

    data = game.getRecord();

    profile.data = game.toString();
    profile.save().then(function() {
        res.JSONP(Code.OK, null, data);
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    });

});

router.get('/gameStart', function(req, res) {
    var bet = req.query.bet;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {
            data = game.gameStart(parseInt(bet));
            console.log("data data data data data");
            console.log(data);
            callback(null);
        },

        // 调用上分接口
        function(callback) {
            agent.withdraw(req, (game.currentBet*game.rate)*100, function(err, balance) {
                if (err != null) {
                    callback(err);
                    return;
                }

                data.balance = balance;
                callback(null);
            });
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

router.get('/select', function(req, res, next) {
    var posStr = req.query.pos;
    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {
            var pos  = posStr.split(",");
            data = game.select({x:pos[0],y:pos[1]});

            callback(null);
        },

        // 调用下分接口
        //function(callback) {
        //    if (game.viewCurrentReward > 0) {
        //        agent.deposit(req, game.viewCurrentReward, function(err, balance) {
        //            if (err != null) {
        //                callback(err);
        //                return;
        //            }
        //
        //            data.balance = balance;
        //            callback(null);
        //        });
        //    } else {
        //        callback(null);
        //    }
        //},

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

router.get('/cashOut', function(req, res) {
    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {

            data = game.cashOut();

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (game.currentReward > 0) {
                var depositCount = Math.round(game.currentReward * game.rate)*100;
                console.log("game.currentReward = " + game.currentReward);
                agent.deposit(req, depositCount, function(err, balance) {
                    if (err != null) {
                        console.log("err err err ");
                        callback(err);
                        return;
                    }
                    console.log("balance balance balance ");
                    data.balance = balance;
                    callback(null);
                });
            } else {
                callback(null);
            }
        },

        // 数据存盘
        function(callback) {
            console.log("callback callback callback ");
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
            console.log("err err err ");
            res.JSONP(Code.Failed, err);
            return;
        }
        console.log("data data data ");
        res.JSONP(Code.OK, null, data);
    });
});

router.get('/quickPick', function(req, res, next) {
    var data = {};
    var game = req.game;
    var profile = req.profile;

    async.series([
        function(callback) {

            data = game.quickPick();
            console.log("1");
            callback(null);
        },

        // 调用下分接口
        //function(callback) {
        //    if (game.viewCurrentReward > 0) {
        //        console.log("game.viewCurrentReward == " + game.viewCurrentReward);
        //        var depositCount = game.viewCurrentReward*100;
        //        agent.deposit(req, depositCount, function(err, balance) {
        //            if (err != null) {
        //                console.log("errrrrrrrrrrrrr");
        //                callback(err);
        //                return;
        //            }
        //            console.log("2");
        //            data.balance = balance;
        //            //console.log("data.balance == " + data.balance);
        //            callback(null);
        //        });
        //    } else {
        //        console.log("3");
        //        callback(null);
        //    }
        //},

        // 数据存盘
        function(callback) {
            profile.data = game.toString();
            profile.save().then(function() {
                console.log("4");
                callback(null);
            }).catch(function(e) {
                debug(e);
                callback(Code.INTERNAL.MySQL_ERROR);
                console.log("5");
            })
        }
    ], function(err) {
        if (err != null) {
            res.JSONP(Code.Failed, err);
            console.log("6");
            return;
        }
        console.log("data data data data data");
        console.log(data);
        res.JSONP(Code.OK, null, data);
    });
});
