/*
 * Base Dependencies
 */
var fs = require('fs');
var path = require('path');
var UUID = require('uuid');
var async = require('async');
var moment = require('moment');
var debug = require('debug')('papaya:app');
var express = require('express');
var favicon = require('serve-favicon');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');

/*
 * Server Dependencies
 */
var ensureLoggedIn = require('./middleware/JWTAuthenticate');

/*
 * Papaya Dependencies
 */
var Papaya = require('../papaya');
var Code = Papaya.Code;
var Message = Papaya.Message;

// 设置统一返回样式
express.response.JSONP = function(code, error, data) {
    var result = {};

    var req = this.req;
    var res = this;
    var path = (typeof req.originalUrl === "string") ? req.originalUrl.split('?')[0] : "";

    result.code = code;
    if (error != null) {
        result.err = error;
        result.msg = Message[error] || "Unknown error encountered";
    }

    if (data != null) {
        result.data = data;
    }
    result.timestamp = moment().format('x');

    debug('RESPONSE %s req=%j body=%j res=%j', path, req.query, req.body, result);

    res.jsonp(result);
};

// 初始化应用
var app = module.exports = express();
var dirname = path.resolve(__dirname, '');

// 设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(log4js.getLogger('access'), { level: "auto" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(xmlParser({ explicitArray: false, normalize: false, normalizeTags: false, trim: true }));
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'public'), { index: false }));

// 认证中间件
app.use(ensureLoggedIn.unless({
    path: [ '/user/auth', /\/portal\/*/ ]
}));

// 加载所有路由
fs.readdirSync(dirname + '/routes').forEach(function(filename) {
    if (!/\.js$/.test(filename)) {
        return;
    }

    var name = path.resolve(dirname, "./routes/", path.basename(filename, '.js'));
    var router = require(name);

    app.use(router.path, router.route);

    debug("mount on path: %s", router.path);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    var error = {};

    error.code = Code.Failed;
    error.err = err.status || 500;
    error.msg = err.message;
    error.status = err.status || 500;
    error.stack = req.app.get('env') !== 'production' ? err.stack : {};

    var path = (typeof req.originalUrl === "string") ? req.originalUrl.split('?')[0] : "";
    debug('Exception %s req=%j body=%j res=%j', path, req.query, req.body, error);
    console.log(error.stack);

    res.jsonp(error);
});


var services = {};
/**
 * Manager init
 */
app.init = function(cb) {
    var files = fs.readdirSync(dirname + '/service');

    var iterator = function(file, callback) {
        if (!/\.js$/.test(file)) {
            return callback();
        }

        var name = path.resolve(dirname, "./service/", path.basename(file, '.js'));
        var Manager = require(name);

        services[Manager.name] = Manager;
        Manager.init(function() {
            callback();
        });
    };

    async.eachSeries(files, iterator, function(err) {
        if (err != null) {
            debug(err);
            process.exit(-1);
        }

        debug("app inited...");
        process.nextTick(cb);
    });
};

app.start = function(cb) {
    var keys = Object.keys(services);

    var iterator = function(name, callback) {
        services[name].start(function() {
            callback();
        });
    };

    async.eachSeries(keys, iterator, function(err) {
        if (err != null) {
            debug(err);
            process.exit(-1);
        }

        debug("app started...");
        process.nextTick(cb);
    });
};

app.stop = function(cb) {
    var keys = Object.keys(services);

    var iterator = function(name, callback) {
        services[name].stop(function() {
            callback();
        });
    };

    async.eachSeries(keys, iterator, function(err) {
        if (err != null) {
            debug(err);
            process.exit(-1);
        }

        debug("app stopped...");
        process.nextTick(cb);
    });
};
