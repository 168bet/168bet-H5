/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var async = require('async');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:pokerGo');
var PapayaDB = require('../models/papaya');
var cacheManager = require('../service/CacheManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;
var PokerGo = Papaya.PokerGo;
var gameID = Papaya.Game.ID_POKERGO;

module.exports = {
    path: "/pokerGo",
    route: router
};

router.use(function(req, res, next) {
    var userID = req.user.id;
    var Profile = PapayaDB.models.profile;

    Profile.findOne({
        where: { userID: userID, gameID: gameID }
    }).then(function(record) {
        if (record == null) {
            var game = new PokerGo.Game();

            return Profile.create({
                userID: userID,
                gameID: gameID,
                data: game.toString()
            });
        }

        return record;
    }).then(function(record) {

        req.profile = record;
        req.game    = new PokerGo.Game(record.data);

        next();
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    });
});

router.get('/enter', function(req, res) {
    var data = {};
    var game = req.game;
    data.game = game;

    switch (game.state) {
        case PokerGo.Game.STATE.READY:
            break;
        case PokerGo.Game.STATE.DEALED:
            break;
        case PokerGo.Game.STATE.BET:
        case PokerGo.Game.STATE.BETED:
        case PokerGo.Game.STATE.DRAWED:
            break;
    }

    res.JSONP(Code.OK, null, data);
});

router.get('/deal', function(req, res) {
    var params = req.query || {};
    //服务器暂时不方便获取现有资金
    params.balbace = 1000000;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        // 转起来
        function(callback) {
            data = game.dealHandle(params);
            if (data.err != null) {
                callback(data.err);
                return;
            }

            callback(null);
        },

        // 调用上分接口
        function(callback) {
            agent.withdraw(req, game.betAmount * 100, function(err, balance) {
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

router.get('/draw', function(req, res) {
    var params = req.query || {};
    //服务器暂时不方便获取现有资金
    params.balbace = 1000000;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    async.series([
        function(callback) {
            data = game.drawHandle(params);

            if (data.err != null) {
                callback(data.err);
                return;
            }

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (game.score != null) {
                agent.deposit(req, (game.score - game.betAmount) * 100, function(err, balance) {
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

router.get('/double', function(req, res) {
    var params = req.query || {};

    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;

    params.game = game;

    async.series([
        function(callback) {
            data = double.enter(params);

            if (data.err != null) {
                callback(data.err);
                return;
            }

            callback(null);
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

router.get('/double/deal', function(req, res) {
    var params = req.query || {};

    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    params.game = game;

    async.series([
        function(callback) {
            data = double.deal(params);

            if (data.err != null) {
                callback(data.err);
                return;
            }

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (double.score != null) {
                agent.deposit(req, double.score * 100, function(err, balance) {
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

router.get('/double/end', function(req, res) {
    var params = req.query || {};

    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;

    params.game = game;

    async.series([
        function(callback) {
            data = double.end(params);

            if (data.err != null) {
                callback(data.err);
                return;
            }

            callback(null);
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