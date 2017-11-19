/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var async = require('async');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:lucky5');
var PapayaDB = require('../models/papaya');
var cacheManager = require('../service/CacheManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;
var Lucky5 = Papaya.Lucky5;
var gameID = Papaya.Game.ID_LUCKY5;

module.exports = {
    path: "/lucky5",
    route: router
};

router.use(function(req, res, next) {
    var userID = req.user.id;
    var Profile = PapayaDB.models.profile;

    Profile.findOne({
        where: { userID: userID, gameID: gameID }
    }).then(function(record) {
        if (record == null) {
            var game = new Lucky5.Game();

            return Profile.create({
                userID: userID,
                gameID: gameID,
                data: game.toString()
            });
        }

        return record;
    }).then(function(record) {

        req.profile = record;
        req.game    = new Lucky5.Game(record.data);

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

    game.state = Lucky5.Game.STATE.READY;

    profile.data = game.toString();
    profile.save().then(function() {
        res.JSONP(Code.OK, null, data);
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    });

    // switch (game.state) {
    //     case Lucky5.Game.STATE.READY:
    //     case Lucky5.Game.STATE.STARTED:
    //     case Lucky5.Game.STATE.SHUFFLED:
    //         break;
    //     case Lucky5.Game.STATE.DEALED:
    //         break;
    //     case Lucky5.Game.STATE.DRAWED:
    //         break;
    //     case Lucky5.Game.STATE.ENDED:
    //         break;
    //     case Lucky5.Game.STATE.DOUBLE:
    //         break;
    // }
    //
    //
    // res.JSONP(Code.OK, null, data);
});

router.get('/back', function(req, res) {
    var data = {};
    var game = req.game;
    var profile = req.profile;

    game.state = Lucky5.Game.STATE.READY;

    profile.data = game.toString();
    profile.save().then(function() {
        res.JSONP(Code.OK, null, data);
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.INTERNAL.MySQL_ERROR);
    })
});

router.get('/deal', function(req, res, next) {
    var bet = req.query.bet;

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    if (game.state != Lucky5.Game.STATE.ENDED && game.state != Lucky5.Game.STATE.READY) {
        return res.JSONP(Code.Failed, Code.RESPONSE.GAME_STATE_ERROR);
    }

    async.series([
        // 发牌处理
        function(callback) {
            game.start();
            game.shuffle();
            game.bet(bet);
            game.deal();

            data.pokers = game.handPokers;

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
    var hold = JSON.parse(req.query.hold);

    var data = {};
    var game = req.game;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    if (game.state != Lucky5.Game.STATE.DEALED) {
        return res.JSONP(Code.Failed, Code.RESPONSE.GAME_STATE_ERROR);
    }

    async.series([
        function(callback) {
            game.hold(hold);
            game.draw();
            game.end();

            data.pokers     = game.handPokers;
            data.holds      = game.holdPokers;
            data.marks      = game.markPokers;
            data.result     = game.result;
            data.score      = game.score;

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (game.score > 0) {
                agent.deposit(req, data.score * 100, function(err, balance) {
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

router.get('/double', function(req, res, next) {
    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;

    if (game.state != Lucky5.Game.STATE.ENDED || game.result == Lucky5.Poker.NOTHING) {
        return res.JSONP(Code.Failed, Code.RESPONSE.GAME_STATE_ERROR);
    }

    async.series([
        function(callback) {
            game.enterDouble();

            data.lastScore = double.lastScore;

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

router.get('/double/deal', function(req, res, next) {
    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    var type = req.query.type;

    if (game.state != Lucky5.Game.STATE.DOUBLE) {
        return res.JSONP(Code.Failed, Code.RESPONSE.GAME_STATE_ERROR);
    }

    async.series([
        // 游戏处理
        function(callback) {
            double.start();
            double.shuffle();
            double.bet(type);
            double.deal();

            data.pokers = double.handPokers;

            callback(null);
        },

        // 调用上分接口
        function(callback) {
            agent.withdraw(req, double.betAmount * 100, function(err, balance) {
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

router.get('/double/draw', function(req, res, next) {
    var data = {};
    var game = req.game;
    var double = game.double;
    var profile = req.profile;
    var agent = cacheManager.getAgent(req.user.agent);

    var selected = req.query.selected;

    if (game.state != Lucky5.Game.STATE.DOUBLE) {
        return res.JSONP(Code.Failed, Code.RESPONSE.GAME_STATE_ERROR);
    }

    async.series([
        // 游戏处理
        function(callback) {
            double.draw(selected);
            double.end();

            data.result = double.result;
            data.score  = double.score;

            callback(null);
        },

        // 调用下分接口
        function(callback) {
            if (data.score > 0) {
                agent.deposit(req, data.score * 100, function(err, balance) {
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

