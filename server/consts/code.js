
var Code = module.exports = {
    OK:                     200,
    Failed:                 500,
    TIMEOUT:                1000,

    INTERNAL: {
        MySQL_ERROR:         1001,
        REDIS_ERROR:         1002,
        HTTP_ERROR:          1003,
        TOKEN_ERROR:         1004
    },

    REQUEST: {
        INVALID_PARAMS:      1500,
        INVALID_UUID:        1501,
        INVALID_SIGNATURE:   1502
    }
};
