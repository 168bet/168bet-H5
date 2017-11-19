/*
 * Base Dependencies
 */


/*
 * Server Dependencies
 */
var debug = require('debug')('papaya:agent:base');
var PapayaDB = require('../models/papaya');

/*
 * Papaya Dependencies
 */
var Papaya = require('../../papaya/');
var Code = Papaya.Code;

/*
 * Agent的原型，继承该类实现真正的逻辑
 */
var Agent = module.exports = function() {

};

var proto = Agent.prototype;

proto.getBalance = function() {

};

proto.transfer = function() {

};
