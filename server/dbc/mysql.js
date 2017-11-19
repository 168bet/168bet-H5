
var config = require('../utils/ConfigUtils').getMysql();
var mysql = require('mysql');
var pool = mysql.createPool(config);

exports = module.exports;

exports.query = function(sql, args, callback) {
    pool.getConnection(function(err, connection) {
        if (!!err) {
            console.error('[mysql pool.acquire.err] ' + err.stack);
            callback(err, null);
            return;
        }

        connection.query(sql, args, function(err, res) {
            connection.release(function(err)
            {
                if (!!err) {
                    console.error('[mysql pool.release.err] ' + err.stack);
                }
            });

            if (!!err)
            {
                console.error('[mysql connection.query.err] ' + err.stack);
                console.error('[mysql failure sql] %j %j', sql, args);
            }

            if (callback != null)
            {
                callback(err, res);
            }
        });
    });
};
