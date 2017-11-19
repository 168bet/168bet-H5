/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:route:index');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

module.exports = {
    path: "/",
    route: router
};

router.get('/', function(req, res) {
    res.JSONP(Code.OK);
});
