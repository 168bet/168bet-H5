
var CryptoJS = require('crypto-js');
var Code = require('../consts/code');
var cacheManager = require('../service/CacheManager');

var ParamFilter = module.exports = {};

ParamFilter.verifyDeviceID = function(req, res, next) {
    var udid = req.query.udid;
    var reg = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/;

    if (udid == null) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_UUID);
        return;
    }

    if (udid.match(reg) == null) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_UUID);
        return;
    }

    next();
};

ParamFilter.verifyUserSignature = function(req, res, next) {
    var appID = req.query.appID;

    if (appID == null) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_PARAMS);
        return;
    }

    var game = cacheManager.getGame(appID);
    if (game == null) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_PARAMS);
        return;
    }

    var keys = [];
    for (var key in req.query) {
        if (!req.query.hasOwnProperty(key)) {
            continue;
        }

        if (key == 'signature') {
            continue;
        }

        keys.push(key);
    }

    keys.sort();

    var url = '';
    for (var i = 0, size = keys.length; i < size; i++) {
        var key = keys[i];

        url += key + '=' + encodeURIComponent(req.query[key]);
        if (i < keys.length - 1) {
            url += '&';
        }
    }

    url = CryptoJS.HmacSHA1(url, game.appKey + 'narwhale&');

    var signature = CryptoJS.enc.Base64.stringify(url);
    if (signature != req.query.signature) {
        res.JSONP(Code.Failed, Code.REQUEST.INVALID_SIGNATURE);
        return;
    }

    next();
};
