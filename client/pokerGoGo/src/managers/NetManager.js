
var NetManager = (function(_super) {
    var CODE = Papaya.Code;

    function NetManager() {
        NetManager.super(this);

        // 游戏服务器地址
        this.service           = App.config.service;

        // 游戏服务器连接
        this.socket            = null;

        // 消息序列号
        this.msgIndex          = 0;

        // 回调队列
        this.handlers          = {};

        // 服务器唯一标识
        this.uuid              = null;

        // 认证令牌
        this.token             = URLUtils.getParam("token") || null;
    }

    Laya.class(NetManager, "NetManager", _super);

    NetManager.prototype.init = function(callback) {
        this.socket = new SocketIO();

        this.socket.on(SocketIO.CONNECTED, this, this.onServerConnected);
        this.socket.on(SocketIO.DICONNECTED, this, this.onServerDisconnected);
        this.socket.on(SocketIO.ERROR, this, this.onServerError);
        this.socket.on(SocketIO.CLOSED, this, this.onServerClosed);
        this.socket.on(SocketIO.MESSAGE, this, this.onServerMessage);

        callback && callback();
    };

    NetManager.prototype.encode = function() {
        var key;
        var keys = [];
        for (key in params) {
            if (key == 'signature') {
                continue;
            }

            keys.push(key);
        }

        keys.sort();

        var url = '';
        for (var i = 0, size = keys.length; i < size; i++) {
            key = keys[i];
            url += key + '=' + encodeURIComponent(params[key]);
            if (i < keys.length - 1) {
                url += '&';
            }
        }

        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(url, App.config.appKey + 'papaya&'));
    };

    NetManager.prototype.formatURL = function(uri, params) {
        params = params || {};

        params.appID        = App.config.appID;
        params.udid         = App.storageManager.getDeviceId();
        //params.signature    = this.encode(params);

        var url = uri + '?';

        for (var key in params) {
            url += key + '=' + encodeURIComponent(params[key]) + '&';
        }

        return url.substring(0, url.length-1);
    };

    NetManager.prototype.resolve = function(path) {
        if (path.charAt(path.length - 1) == "/") {
            return path.substr(0, path.length - 1);
        }

        return path;
    };

    NetManager.prototype.get = function(url, handler) {
        var hr = new Laya.HttpRequest();

        var onHttpRequestComplete = function() {
            if (hr.data.code == CODE.OK) {
                handler.runWith([null, hr.data.data]);
            }
            else {
                var error = {
                    number: hr.data.err,
                    message: hr.data.msg
                };
                handler.runWith(error);
            }
        };

        var onHttpRequestError = function(e) {
            var error = {
                number: CODE.INTERNAL.HTTP_ERROR,
                message: e
            };
            handler.runWith(error, {});
        };

        // var onHttpRequestProgress = function(e) {
        //     if (progress) {
        //         progress.runWith(e);
        //     }
        // };

        // 设置认证token
        var headers = null;
        if (this.token) {
            headers = ["Authorization", "Bearer " + this.token];
        }
        //http.on(Laya.Event.PROGRESS, null, onHttpRequestProgress);
        hr.once(Laya.Event.ERROR, null, onHttpRequestError);
        hr.once(Laya.Event.COMPLETE, null, onHttpRequestComplete);
        hr.send(url, null, 'get', 'json', headers);
    };

    NetManager.prototype.post = function() {

    };

    NetManager.prototype.request = function(api, params, handler) {
        params = params || {};

        var self = this;
        var url = this.formatURL(this.service + api, params);

        var complete = function(err, data) {
            // 这里可以先拦截需要统一处理的错误
            if (err != null) {
                if (handler) {
                    handler.runWith([err, data]);
                }
                return
            }

            // 这里统一同步账户余额
            var player = App.player;
            if (data.balance) {
                player && player.setBalance(data.balance);
            }
            if (handler) {
                handler.runWith([err, data]);
            }
        };
        this.get(url, Laya.Handler.create(null, complete));
    };

    NetManager.prototype.send = function(router, data, handler) {
        var msg = {};

        msg.id = ++this.msgIndex;
        msg.router = router;
        msg.data = data;

        if (handler != undefined) {
            this.handlers[msg.id] = handler;
        }

        this.socket.send(msg);
    };

    NetManager.prototype.accountAuth = function(handler) {
        // 如果token不为空，已经获取浏览器重定向参数，可以直接进入下一步
        if (this.token != null) {
            handler && handler.runWith([null, {}]);
            return;
        }

        var self = this;
        var complete = function(err, data) {
            if (err == null) {
                self.uuid      = data.userID;
                self.token     = data.token;
            }

            if (handler) {
                handler.runWith([err, data]);
            }
        };

        var api = "/user/auth";
        var params = {};
        this.request(api, params, Laya.Handler.create(null, complete));
    };

    NetManager.prototype.accountSync = function(handler) {
        var self = this;
        var complete = function(err, data) {
            if (err == null) {
                self.token     = data.token;
            }

            if (handler) {
                handler.runWith([err, data]);
            }
        };

        var api = "/user/sync";
        var params = {};
        this.request(api, params, Laya.Handler.create(null, complete));
    };

    NetManager.prototype.connectServer = function() {
        this.socket.connect(this.service);
    };

    NetManager.prototype.onServerConnected = function() {
        this.event(SocketIO.CONNECTED);
    };

    NetManager.prototype.onServerDisconnected = function() {
        this.event(SocketIO.DICONNECTED);
    };

    NetManager.prototype.onServerError = function() {
        this.event(SocketIO.ERROR);
    };

    NetManager.prototype.onServerClosed = function() {
        this.event(SocketIO.CLOSED);
    };

    NetManager.prototype.onServerMessage = function(data) {
        try {
            var msg = JSON.parse(data);
            var handler = this.handlers[msg.id];

            if (handler != undefined) {
                if (msg.code == CODE.OK) {
                    handler.runWith([null, msg.data]);
                }
                else {
                    var error = {
                        number: msg.err,
                        message: msg.msg
                    };
                    handler.runWith(error);
                }

                delete this.handlers[msg.id];
            }
        }
        catch (e) {
            console.log(e.stack);
        }
    };

    return NetManager;
}(laya.events.EventDispatcher));

var SingleAlone = (function(_super) {
    //游戏逻辑处理
    var gameLogic = Papaya.Lucky5;

    function SingleAlone() {
        SingleAlone.super(this);
    }

    Laya.class(SingleAlone, "SingleAlone", _super);

    // @Override
    SingleAlone.prototype.init = function(callback) {
        callback && callback();
    };

    SingleAlone.prototype.encode = function() {
    };

    SingleAlone.prototype.formatURL = function() {
    };

    SingleAlone.prototype.resolve = function() {
    };

    SingleAlone.prototype.get = function() {
    };

    SingleAlone.prototype.post = function() {
    };

    SingleAlone.prototype.send = function() {
    };

    SingleAlone.prototype.connectServer = function() {
        Laya.timer.once(1000, this, this.onServerConnected);
    };

    SingleAlone.prototype.onServerConnected = function() {
        this.event(SocketIO.CONNECTED);
    };

    SingleAlone.prototype.request = function(api, params, handler) {
        var data = {};
        var resp = SingleAlone.response[api];

        if (typeof resp === 'object') {
            data = resp;
        }
        else if (typeof resp == "function") {
            data = resp(params);
        }
        else {
            data = {};
        }

        if(data &&　data.err == null){
            handler.runWith([null,data]);
        }
        handler.runWith([data]);
    };

    SingleAlone.response = {};
    //以下三个为通用接口
    SingleAlone.response['/user/auth'] = {};
    SingleAlone.response['/user/sync'] = function() {
        var player = new Papaya.Player({});
        return {player: player.clone()};
    };
    SingleAlone.response['/user/enter'] = {};

    //以下这用于参考 游戏的逻辑处理从这里开始
    SingleAlone.response['/lucky5/deal'] = function(params) {
        var data = {};
        var game = App.game = new gameLogic.Game();

        game.bet(params.bet);
        game.deal();

        data.pokers = game.handPokers;
        data.player = {
            balance: App.player.balance - params.bet
        };

        console.log("下注金额：", params.bet, "余额：", data.player.balance);

        return data;
    };

    return SingleAlone;
}(NetManager));