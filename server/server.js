#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var async = require('async');
var debug = require('debug')('papaya:server');

/**
 * Init Logger for Application
 */
var _debug = require('debug');
var log4js = require('log4js');
var config = require('./utils/ConfigUtils').getLog4js();

log4js.configure(config);

var logger = log4js.getLogger('application');
_debug.log = logger.info.bind(logger);

/**
 * Create Express application.
 */
var app = require('./app');

/**
 * Create HTTP server.
 */
var http = require('http');
var server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '2700');
var region = process.env.REGION || "sandbox";

app.set('port', port);
app.set('region', region);

app.init(function() {
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind + '@' + region);

    app.start(function() {
        debug("server started...");
    });
}

function onExit() {
    process.exit(0);
}

process.on('SIGTERM', function() {
    debug('receive signal: SIGTERM');
    app.stop(onExit);
});

process.on('SIGINT', function() {
    debug('receive signal: SIGINT');
    app.stop(onExit);
});

process.on('SIGHUP', function() {
    debug('receive signal: SIGHUP');
    app.stop(onExit);
});

// Uncaught exception handler
process.on('uncaughtException', function(err) {
    debug('Caught exception: %j', err.stack);
});
