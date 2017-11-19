(function(root) {
    var Code = root.Code = {
        OK:                     200,
        Failed:                 500,
        TIMEOUT:                1000,

        INTERNAL: {
            MySQL_ERROR:         1001,
            REDIS_ERROR:         1002,
            HTTP_ERROR:          1003,
            TOKEN_ERROR:         1004,
            HTTP_STATUS_ERROR:   1005,
            HTTP_BODY_ERROR:     1006,
            HTTP_RESP_ERROR:     1007,
        },

        REQUEST: {
            INVALID_PARAMS:      1500,
            INVALID_UUID:        1501,
            INVALID_SIGNATURE:   1502,
            INVALID_TOKEN:       1503,
            INVALID_STATE:       1504,
            INVALID_BET_AMOUNT:  1505
        },

        RESPONSE: {
            BALANCE_INSUFFICIENT: 1600,
            GAME_STATE_ERROR:     1601
        }
    };

    root.Message = {};
    root.Message[Code.OK]        = "OK";
    root.Message[Code.Failed]    = "Failure";
    root.Message[Code.TIMEOUT]   = "Timeout";

    root.Message[Code.INTERNAL.MySQL_ERROR]                  = "MySQL error";
    root.Message[Code.INTERNAL.REDIS_ERROR]                  = "redis error";
    root.Message[Code.INTERNAL.HTTP_ERROR]                   = "http request error";
    root.Message[Code.INTERNAL.TOKEN_ERROR]                  = "jwt token error";
    root.Message[Code.INTERNAL.HTTP_STATUS_ERROR]            = "http status error";
    root.Message[Code.INTERNAL.HTTP_BODY_ERROR]              = "http body error";
    root.Message[Code.INTERNAL.HTTP_RESP_ERROR]              = "http response error";

    root.Message[Code.REQUEST.INVALID_PARAMS]                = "Invalid request params";
    root.Message[Code.REQUEST.INVALID_UUID]                  = "Invalid uuid format";
    root.Message[Code.REQUEST.INVALID_SIGNATURE]             = "Invalid signature";
    root.Message[Code.REQUEST.INVALID_TOKEN]                 = "Invalid jwt";
    root.Message[Code.REQUEST.INVALID_STATE]                 = "Invalid state";
    root.Message[Code.REQUEST.INVALID_BET_AMOUNT]            = "Invalid bet amount";

    root.Message[Code.RESPONSE.BALANCE_INSUFFICIENT]         = "Balance insufficient";
    root.Message[Code.RESPONSE.GAME_STATE_ERROR]             = "Game state error";

}(Papaya));