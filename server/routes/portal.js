/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var UUID = require('uuid');
var CryptoJS = require('crypto-js');
var request = require('request');

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:portal');
var PapayaDB = require('../models/papaya/');
var cacheManager = require('../service/CacheManager');
var tokenManager = require('../service/TokenManager');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

module.exports = {
    path: "/portal",
    route: router
};

router.get('/agent/:agentID', function(req, res) {
    var key = req.query.key;
    var ciphertext = req.query.params;
    var agentID = req.params.agentID;

    var keyHex = CryptoJS.enc.Utf8.parse('12345678');
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var params = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));


    var game = cacheManager.findGame(params.gameId);
    if (game == null) {
        res.status(403).send("params error!");
        return;
    }

    var User = PapayaDB.models.user;

    User.findOne({
        where: { account: params.account }
    }).then(function(user) {
        if (user == null) {
            return User.create({
                account:    params.account,
                nickName:   params.nickname,
                trail:      params.trial,
                language:   params.lang,
                agent:      params.ag,
                currency:   params.cur
            });
        }

        return user;
    }).then(function(user) {
        var payload = {
            userID:      user.id,
            agent:       params.ag,
            nickname:    params.nickname,
            gameId:      params.gameId,
            sessionId:   params.sessionId,
            currency:    params.cur
        };

        tokenManager.signSync(payload, function(err, token) {
            res.redirect(game.url + "?token=" + token);
        });
    }).catch(function(e) {
        debug(e);
        res.status(403).send("params error!");
    });
});

router.get('/:gameID/agent/:agentID', function(req, res) {
    var key = req.query.key;
    var ciphertext = req.query.params;

    var gameID = req.params.gameID;
    var agentID = req.params.agentID;

    var game = cacheManager.getGame(gameID);
    if (game == null) {
        res.status(403).send("params.gameId error!");
        return;
    }

    var keyHex = CryptoJS.enc.Utf8.parse('12345678');
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    var User = PapayaDB.models.user;
    var params = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    User.findOne({
        where: { account: params.account }
    }).then(function(user) {
        if (user == null) {
            return User.create({
                account:    params.account,
                nickName:   params.nickname,
                trail:      params.trial,
                language:   params.lang,
                agent:      params.ag,
                currency:   params.cur
            });
        }

        return user;
    }).then(function(user) {
        var payload = {
            userID:      user.id,
            agent:       params.ag,
            nickname:    params.nickname,
            gameId:      params.gameId,
            sessionId:   params.sessionId,
            currency:    params.cur
        };

        tokenManager.signSync(payload, function(err, token) {
            res.redirect(game.url + "?token=" + token);
        });
    }).catch(function(e) {
        debug(e);
        res.status(403).send("params error!");
    });
});