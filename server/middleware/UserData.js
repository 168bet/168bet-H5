
var CryptoJS = require('crypto-js');
var Code = require('../consts/code');
var PapayaDB = require('../models/papaya/index');
var cacheManager = require('../service/CacheManager');
var debug = require('debug')('service:service:cache');

var UserData = module.exports = {};

UserData.queryInfo = function(req, res, next) {
    var udid = req.query.udid;
    var account = req.query.account;

    var where = {};
    if (account) {
        //有登录用户名时候的处理
    }
    //没有用户名则用机器码 也就是快速登录
    else {
        where.udid = udid;
    }

    var User = PapayaDB.models.user;
    User.findOne({
        where: where
    }).then(function(user) {
        if (user == null) {
            var data = {
                udid: udid,
                nickName: "小木瓜",
                balance: 10000
            };

            return User.create(data);
        }

        return user;
    }).then(function(user) {
        req.userInfo = {
            id: user.id,
            udid: user.udid,
            token: user.token,
            name: user.nickName,
            balance: user.balance
        };
        next();
    }).catch(function(e) {
        debug(e);
        res.JSONP(Code.Failed, Code.MySQL.DB_ERROR);
    })
};
