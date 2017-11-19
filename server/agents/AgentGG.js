/*
 * Base Dependencies
 */
var util = require('util');
var UUID = require('uuid');
var moment = require('moment');
var request = require('request');
var CryptoJS = require('crypto-js');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:agent:gg');
var PapayaDB = require('../models/papaya');
var Agent = require('./Agent');
var signUtils = require('../utils/SignUtils');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

var md5Key = "123123";
var desKey = "12345678";
var C_AGENT = "ABCDEFG";

function encryptParams(params) {
    var split = "/\\\\/";
    var plaintext = "";

    var keys = Object.keys(params);
    for (var i = 0, size = keys.length; i < size; i++) {
        plaintext += keys[i] + '=' + params[keys[i]];
        if (i < size - 1) {
            plaintext += split;
        }
    }

    console.log(plaintext);

    var keyHex = CryptoJS.enc.Utf8.parse(desKey);
    var encrypted = CryptoJS.DES.encrypt(plaintext, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function generateBillno(agent) {
    return C_AGENT + agent + moment().format("YYYYMMDD") + UUID.v4();
}

function accessAPI(plaintext, callback) {
    var host = "http://testapi.gg626.com/api/doExternalReading.do";

    var encrypted = encryptParams(plaintext);
    var md5key = CryptoJS.MD5(encrypted + md5Key).toString();
    var params = {
        params: encrypted,
        key: md5key
    };

    var url = signUtils.formatURL(host, params);
    var options = {
        url: url
    };

    request(options, function(error, response, body) {
        if (error != null) {
            debug("http request error:", error);
            return callback(Code.INTERNAL.HTTP_ERROR);
        }

        if (response.statusCode != 200) {
            return callback(Code.INTERNAL.HTTP_STATUS_ERROR);
        }

        var data = null;
        try {
            data = JSON.parse(body);
        } catch (e) {
            debug("http data error:", e);
            return callback(Code.INTERNAL.HTTP_BODY_ERROR);
        }

        if (data.code != 0) {
            debug("http response error:", data);
            return callback(Code.INTERNAL.HTTP_RESP_ERROR);
        }

        callback(null, data);
    });
}

function getBalance(token, callback) {
    var plaintext = {
        ag:        token.agent,
        cagent:    C_AGENT,
        sid:       token.sessionId,
        method:    "gb",
        cur:       token.currency,
        origin:    0
    };

    accessAPI(plaintext, callback);
}

var AgentGG = module.exports = function() {

};

util.inherits(AgentGG, Agent);

var proto = AgentGG.prototype;

proto.getBalance = function(req, callback) {
    var token = req.token;
    getBalance(token, function(err, data) {
        if (err != null) {
            callback(err);
            return;
        }

        callback(null, data.balance);
    });
};

proto.deposit = function(req, amount, callback) {
    var token = req.token;
    var credit = amount;

    if (amount <= 0) {
        callback(Code.REQUEST.INVALID_BET_AMOUNT);
        return;
    }

    getBalance(token, function(err, data) {
        if (err != null) {
            callback(err);
            return;
        }

        var balance = data.balance;

        var plaintext = {
            method:    "tq",
            type:      "IN",

            ag:        token.agent,
            cagent:    C_AGENT,
            sid:       token.sessionId,
            cur:       token.currency,
            credit:    credit,

            gameId:    token.gameId,
            sectionId: 245731489459801874,
            turnover:  0.0,
            winloss:   0.0,
            closeFlag: 1,

            tdatetime: moment().format("YYYYMMDDHHMMss"),
            billno:    generateBillno(token.agent),

            ip:        "127.0.0.1",
            origin:    0
        };

        accessAPI(plaintext, function(err, data) {
            if (err != null) {
                callback(err);
                return;
            }

            balance += credit;

            callback(null, balance);
        });
    });
};

proto.withdraw = function(req, amount, callback) {
    var token = req.token;

    if (amount <= 0) {
        callback(Code.REQUEST.INVALID_BET_AMOUNT);
        return;
    }

    var credit = amount;

    getBalance(token, function(err, data) {
        if (err != null) {
            callback(err);
            return;
        }

        // 余额不足
        var balance = data.balance;
        if (balance < amount) {
            callback(Code.REQUEST.INVALID_BET_AMOUNT);
            return;
        }

        var plaintext = {
            method:    "tq",
            type:      "OUT",

            ag:        token.agent,
            cagent:    C_AGENT,
            sid:       token.sessionId,
            cur:       token.currency,
            credit:    credit,

            gameId:    token.gameId,
            sectionId: 245731489459801874,
            turnover:  0.0,
            winloss:   0.0,
            closeFlag: 0,

            tdatetime: moment().format("YYYYMMDDHHMMss"),
            billno:    generateBillno(token.agent),

            ip:        "127.0.0.1",
            origin:    0
        };

        accessAPI(plaintext, function(err, data) {
            if (err != null) {
                callback(err);
                return;
            }

            balance -= credit;

            callback(null, balance);
        });
    });
};
