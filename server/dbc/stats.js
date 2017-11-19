var redis = require('redis');
var config = require('../utils/ConfigUtils').getStats();
var client = redis.createClient(config.port, config.addr, config.options);

client.select(config.db);

client.on('error', function(err) {
    console.error(err);
});

client.on('connect', function() {
    client.select(config.db);
});

client.on('ready', function() {

});

client.on('end', function() {

});

client.on('drain', function() {

});

client.on('idle', function() {

});

module.exports = client;
