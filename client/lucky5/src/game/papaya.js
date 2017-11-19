/*! lucky5 2017-10-23 */
(function() {
    // Establish the root object,
    // `window` (`self`) in the browser,
    // `global`on the server,
    // `this` in some virtual machines.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    //Declare Papaya's namespace
    var Namespace = root.Papaya = {};

    Namespace.isNodeJS = (typeof exports === "object");

    Namespace.inherits = function(ctor, superCtor) {
        ctor._super = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        ctor.prototype._super = superCtor;
        ctor.super = function(o) { ctor._super.call(o) };
    };

    Namespace.extend = function(origin, add) {
        if (add === null || typeof add !== 'object') return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    };

    //init libs reference
    if (Namespace.isNodeJS) {
        Namespace.uuid      = require('uuid');
        Namespace.moment    = require('moment');
        Namespace.sprintf   = require('../libs/sprintf').sprintf;
        Namespace.CryptoJS  = require('crypto-js');
    } else {
        Namespace.uuid      = root.uuid;
        Namespace.moment    = root.moment;
        Namespace.sprintf   = root.sprintf;
        Namespace.CryptoJS  = root.CryptoJS;

        if (typeof console.info != "function") {
            console.info = console.log;
        }
    }
}());

(function(root) {
    var Handler = root.Handler = function(caller,method,args,once) {
        //this.caller = null;
        //this.method = null;
        //this.args = null;
        this.once = false;
        this._id = 0;
        (once===void 0)&& (once=false);
        this.setTo(caller,method,args,once);
    };

    var __proto = Handler.prototype;
    /**
     *设置此对象的指定属性值。
     *@param caller 执行域(this)。
     *@param method 回调方法。
     *@param args 携带的参数。
     *@param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
     *@return 返回 handler 本身。
     */
    __proto.setTo=function(caller,method,args,once){
        this._id=Handler._gid++;
        this.caller=caller;
        this.method=method;
        this.args=args;
        this.once=once;
        return this;
    };

    /**
     *执行处理器。
     */
    __proto.run=function(){
        if (this.method==null)return null;
        var id=this._id;
        var result=this.method.apply(this.caller,this.args);
        this._id===id && this.once && this.recover();
        return result;
    };

    /**
     *执行处理器，携带额外数据。
     *@param data 附加的回调数据，可以是单数据或者Array(作为多参)。
     */
    __proto.runWith=function(data){
        if (this.method==null)return null;
        var id=this._id;
        if (data==null)
            var result=this.method.apply(this.caller,this.args);
        else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
        else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
        else result=this.method.apply(this.caller,data);
        this._id===id && this.once && this.recover();
        return result;
    };

    /**
     *清理对象引用。
     */
    __proto.clear=function(){
        this.caller=null;
        this.method=null;
        this.args=null;
        return this;
    };

    /**
     *清理并回收到 Handler 对象池内。
     */
    __proto.recover=function(){
        if (this._id > 0){
            this._id=0;
            Handler._pool.push(this.clear());
        }
    };

    Handler.create = function(caller,method,args,once){
        (once===void 0) && (once=true);
        if (Handler._pool.length) {
            return Handler._pool.pop().setTo(caller,method,args,once);
        }
        return new Handler(caller,method,args,once);
    };

    Handler._pool=[];
    Handler._gid=1;
})(Papaya);

(function(root){
    var _super = root.Handler;

    var EventHandler = root.EventHandler = function(caller, method, args, once) {
        _super.call(this, caller, method, args, once);
    };

    root.inherits(EventHandler, _super);

    var __proto=EventHandler.prototype;

    __proto.recover = function() {
        if (this._id > 0){
            this._id=0;
            EventHandler._pool.push(this.clear());
        }
    };

    EventHandler.create = function(caller,method,args,once){
        (once===void 0)&& (once=true);
        if (EventHandler._pool.length) {
            return EventHandler._pool.pop().setTo(caller,method,args,once);
        }
        return new EventHandler(caller,method,args,once);
    };

    EventHandler._pool = [];
})(Papaya);

(function(root) {
    var EventHandler = root.EventHandler;
    var EventDispatcher = root.EventDispatcher = function() {
        this._events = null;
    };

    var __proto = EventDispatcher.prototype;
    /**
     *检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
     *@param type 事件的类型。
     *@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
     */
    __proto.hasListener = function(type) {
        var listener= this._events && this._events[type];
        return !!listener;
    };

    /**
     *派发事件。
     *@param type 事件类型。
     *@param data 回调数据。
     *<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     *@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
     */
    __proto.event = function(type, data) {
        if (!this._events || !this._events[type]) {
            return false;
        }
        var listeners=this._events[type];
        if (listeners.run) {
            if (listeners.once)delete this._events[type];
            data !=null ? listeners.runWith(data): listeners.run();
        } else {
            for (var i=0, n=listeners.length; i < n; i++) {
                var listener=listeners[i];
                if (listener) {
                    (data !=null)? listener.runWith(data):listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i,1);
                    i--;
                    n--;
                }
            }
            if (listeners.length===0)delete this._events[type];
        }
        return true;
    };

    /**
     *使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param args 事件侦听函数的回调参数。
     *@return 此 EventDispatcher 对象。
     */
    __proto.on=function(type, caller, listener, args) {
        return this._createListener(type, caller, listener, args, false);
    };

    /**
     *使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param args 事件侦听函数的回调参数。
     *@return 此 EventDispatcher 对象。
     */
    __proto.once = function(type,caller,listener,args){
        return this._createListener(type,caller,listener,args,true);
    };

    __proto._createListener=function(type,caller,listener,args,once){
        this.off(type,caller,listener,once);
        var handler=EventHandler.create(caller || this,listener,args,once);
        this._events || (this._events={});
        var events=this._events;
        if (!events[type])events[type]=handler;
        else {
            if (!events[type].run)events[type].push(handler);
            else events[type]=[events[type],handler];
        }
        return this;
    };

    /**
     *从 EventDispatcher 对象中删除侦听器。
     *@param type 事件的类型。
     *@param caller 事件侦听函数的执行域。
     *@param listener 事件侦听函数。
     *@param onceOnly 如果值为 true ,则只移除通过 once 方法添加的侦听器。
     *@return 此 EventDispatcher 对象。
     */
    __proto.off=function(type,caller,listener,onceOnly){
        (onceOnly===void 0)&& (onceOnly=false);
        if (!this._events || !this._events[type])return this;
        var listeners=this._events[type];
        if (listener !=null){
            if (listeners.run){
                if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
                    delete this._events[type];
                    listeners.recover();
                }
            }else {
                var count=0;
                for (var i=0,n=listeners.length;i < n;i++){
                    var item=listeners[i];
                    if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
                        count++;
                        listeners[i]=null;
                        item.recover();
                    }
                }
                if (count===n)delete this._events[type];
            }
        }
        return this;
    };

    /**
     *从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
     *@param type 事件类型，如果值为 null，则移除本对象所有类型的侦听器。
     *@return 此 EventDispatcher 对象。
     */
    __proto.offAll=function(type){
        var events=this._events;
        if (!events)return this;
        if (type){
            this._recoverHandlers(events[type]);
            delete events[type];
        }else {
            for (var name in events){
                this._recoverHandlers(events[name]);
            }
            this._events=null;
        }
        return this;
    };

    __proto._recoverHandlers=function(arr){
        if(!arr)return;
        if (arr.run){
            arr.recover();
        }else {
            for (var i=arr.length-1;i >-1;i--){
                if (arr[i]){
                    arr[i].recover();
                    arr[i]=null;
                }
            }
        }
    };
})(Papaya);

(function(root) {
    var _super = root.EventDispatcher;

    var Serialize = root.Serialize = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
    };

    root.inherits(Serialize, _super);

    root.extend(Serialize.prototype, {
        inspector: function(obj) {
            if (obj == null) {
                return obj;
            }

            if (typeof obj !== 'object') {
                return obj;
            }

            if (obj instanceof Array) {
                var new_arr = [];

                for (var i in obj) {
                    if (typeof obj[i] === 'object') {
                        new_arr[i] = this.inspector(obj[i]);
                    } else {
                        new_arr[i] = obj[i];
                    }
                }

                return new_arr;
            }

            if (typeof obj.clone === 'function') {
                return obj.clone();
            }

            var new_obj = {};
            for (var key in obj) {
                var val = obj[key];
                if (typeof val === 'object') {
                    new_obj[key] = this.inspector(val);
                } else {
                    if (obj.hasOwnProperty(key)) {
                        new_obj[key] = val;
                    }
                }
            }

            return new_obj;
        },

        clone: function() {
            var obj = {};

            for (var key in this) {
                var val = this[key];

                if (this.hasOwnProperty(key) == false) {
                    continue;
                }

                if (key[0] == '_') {
                    continue;
                }

                obj[key] = this.inspector(val);
            }

            return obj;
        },

        toString: function() {
            return JSON.stringify(this.clone());
        },

        sync: function(opts) {
            for (var key in opts) {
                if (this.hasOwnProperty(key)) {
                    this[key] = opts[key];
                }
            }
        }
    });
}(Papaya));

(function(root) {
    var _super = root.Serialize;
    var Entity = root.Entity = function(opts) {
        opts = opts || {};

        Entity.super(this, opts);

        //private members
        this._properties    = {};

        //public members
        this.uuid           = opts.uuid || root.uuid.v4();
        this.createTime     = opts.createTime || Number(root.moment().format('x'));
    };

    //Inherits Class
    root.inherits(Entity, _super);

    //Extend Prototype
    root.extend(Entity.prototype, {
        set: function(key, val) {
            this._properties[key] = val;
        },

        get: function(key) {
            return this._properties[key];
        }
    });
}(Papaya));
(function(root) {
    var _super = root.Serialize;
    var Player = root.Player = function(opts) {
        opts = opts || {};


        this.id             = opts.id || 0;
        this.name           = opts.name || "Guest";
        this.balance        = opts.balance || 10000;
        this.language       = opts.language || "zh-CN";

        console.log(this);
    };

    root.inherits(Player, _super);

    root.extend(Player.prototype, {
        update: function(opts) {
            var obj = this;
            opts = opts || {};

            for (var key in opts) {
                if (opts.hasOwnProperty(key)
                    && obj.hasOwnProperty(key)) {
                    obj[key] = opts[key];
                }
            }
        },

        setBalance: function(amount) {
            this.balance = amount;
        },

        getBalance: function() {
            return this.balance;
        }
    });
} (Papaya));

(function(root) {
    var _super = root.Serialize;
    var Game = root.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        //private members

        //public members
        this.id             = Game.ID_BASE;
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {

    });

    Game.ID_BASE           = 0;
    Game.ID_LUCKY5         = 100001;
    Game.ID_FRUIT          = 100002;
    Game.ID_POKERGO        = 100003;
    Game.ID_POKERGOGO      = 100004;
    Game.ID_SHARK          = 100005;
    Game.ID_DIAMONDDEAL    = 100006;
}(Papaya));
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
(function(root) {
    var Utils = root.Utils = {};

    //根据权重从列表中抽取礼品并且返回下标
    Utils.calcWeight = function(list) {
        //list 需要抽取的礼品列表
        //格式 [ {xxx:xx, weight: 10}, {xxx:xx, weight: 20} ]  每个object里面至少要有一个weight
        if (typeof list != "object" || !(list instanceof Array)) {
            return null;
        }

        var i;
        var row;
        var result = 0;
        var totalWeight = 0;

        for (i = 0; i < list.length; i++) {
            row = list[i];
            if (row.weight > 0) {
                totalWeight += row.weight;
            }
        }

        if (totalWeight <= 0) {
            return null;
        }

        var rand = Math.floor(Math.random() *  totalWeight);
        for (i = 0; i < list.length; i++) {
            row = list[i];
            if (rand < row.weight) {
                result = i;
                break;
            }

            rand -= row.weight;
        }

        return result;
    };

    //返回 min~max之间的一个数 不包含max 如果需要包含最大值 可在调用的时候max为你需要的最大值+1
    Utils.range_value = function(min, max) {
        return Math.floor(Math.random()*(max-min) + min);
    };

    //返回 0~max之间的一个数 不包含max
    Utils.random_number = function(max) {
        return Utils.range_value(0, max);
    };

    // 将数字的小数点转换成A (replaceSymbol：被替换的字符，transformSymbol：替换后的字符)
    Utils.transform_Font_Type = function(number, replaceSymbol, transformSymbol) {
        var str = String(number);
        var transformStr = transformSymbol || "A";
        var replaceStr = replaceSymbol || ".";

        return str.replace(replaceStr,transformStr);
    };

    // 分割数字，每3位加个逗号
    Utils.format_By_Comma = function(number)
    {
        var str = String(number);
        var newStr = "";
        
        var format = function(params){
            var resultStr = "";
            var count = 0;
            for(var index = params.length-1 ; index >= 0 ; index--)
            {
                if(count % 3 == 0 && count != 0)
                {
                    resultStr = params.charAt(index) + "," + resultStr;
                }
                else
                {
                    resultStr = params.charAt(index) + resultStr;
                }
                count++;
            }
            return resultStr;
        }


        if(str.indexOf(".") == -1)
        {
            newStr = format(str);
        }
        else
        {
            // 小数点后的数字
            var commaRight = str.slice(str.indexOf("."));

            // 小数点前的数字
            var commaLeft = str.slice(0,str.indexOf("."));

            newStr = format(commaLeft);
            newStr += commaRight;
        }
        
        return newStr;
    }
}(Papaya));

(function(root) {
    Papaya.Lucky5 = {};

    /**
     * Game Constants
     */
    Papaya.Lucky5.MAX_HAND              = 5;
    Papaya.Lucky5.MIN_BET               = 10;
    Papaya.Lucky5.MAX_BET               = 1000;

}(Papaya));
/*
 * 1 High Card: Highest value card.
 * 2 One Pair: Two cards of the same value.
 * 3 Two Pairs: Two different pairs.
 * 4 Three of a Kind: Three cards of the same value.
 * 5 Straight: All cards are consecutive values.
 * 6 Flush: All cards of the same suit.
 * 7 Full House: Three of a kind and a pair.
 * 8 Four of a Kind: Four cards of the same value.
 * 9 Straight Flush: All cards are consecutive values of same suit.
 *10 Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
 */
/*
 *       "JACKS OR BETTER",          // one pair J以上对子
 *       "TWO PAIRS",                // tow pairs 两对
 *       "THREE OF A KIND",          // 三张
 *       "STREIGHT",                 // 顺子
 *       "FLUSH",                    // 同花
 *       "FULL HOUSE",               // 葫芦
 *       "FOUR OF A KIND",           // 四张
 *       "STREIGHT FLUSH",           // 同花顺
 *       "ROYAL FLUSH",              // 皇家同花顺
 *       "LUCKY 5"                   // HIGH 5
 */
(function(root) {
    var Poker = root.Poker = function(opts) {
        opts = opts || {};

        this.type  = opts.type || null;
        this.name  = opts.name || null;
        this.value = opts.value || 0;
    };

    Poker.NOTHING                       = 0; // 散牌
    Poker.HIGH_CARD                     = 1; // 大牌
    Poker.ONE_PAIR                      = 2; // 一对
    Poker.TWO_PAIR                      = 3; // 两对
    Poker.THREE_OF_A_KIND               = 4; // 三张相同的牌
    Poker.STREIGHT                      = 5; // 顺子
    Poker.FLUSH                         = 6; // 同种花色的五张牌
    Poker.FULL_HOUSE                    = 7; // 三张相同的牌加二张相同的牌
    Poker.FOUR_OF_A_KIND                = 8; // 四张相同的牌
    Poker.STREIGHT_FLUSH                = 9; // 同花顺
    Poker.ROYAL_FLUSH                   = 10;// 同花大顺
    Poker.LUKCY5                        = 11;// 幸运5张
    
    Poker.SCORES                        = {
        "2":       1,
        "3":       2,
        "4":       3,
        "5":       5,
        "6":       7,
        "7":       10,
        "8":       40,
        "9":       120,
        "10":      200,
        "11":      500
    };
    Poker.TYPE_NAME                     = {
        "0":       "不中",
        "1":       "不中",
        "2":       "J以上对子",
        "3":       "两对",
        "4":       "三张",
        "5":       "顺子",
        "6":       "同花",
        "7":       "葫芦",
        "8":       "四张",
        "9":       "同花顺",
        "10":      "皇家同花顺",
        "11":      "Lucky5"
    };
    Poker.HAND_TEXT = [
        { name:"流局", score:0 },
        { name:"流局", score:0 },
        { name:"J以上对子", score:10 },
        { name:"两对", score:20 },
        { name:"三张", score:30 },
        { name:"顺子", score:50 },
        { name:"同花", score:70 },
        { name:"葫芦", score:100 },
        { name:"四张", score:400 },
        { name:"同花顺", score:1200 },
        { name:"皇家同花顺", score:2000 },
        { name:"Lucky 5", score:5000 }
    ];

    Poker.SPADE = "spade";
    Poker.HEART = "heart";
    Poker.CLUB = "club";
    Poker.DIAMOND = "diamond";
    Poker.JOKER = "joker";
    Poker.DECK = {
        "spade": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "heart": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "club": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "diamond": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "joker": [
            "small", "big"
        ]
    };
    Poker.DECK_VALUE = {
        "spade": {              // 黑桃
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13,
            "ace":    14
        },
        "heart": {              // 红心
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13,
            "ace":    14
        },
        "club": {               // 梅花
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13,
            "ace":    14
        },
        "diamond": {            // 方块
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13,
            "ace":    14
        },
        "joker": {
            "small":  15,
            "big":    16
        }
    };
} (Papaya.Lucky5));
(function(root) {
    var Poker = root.Poker;
    var Logic = root.Logic = function() {
    };

    Logic.findJoker = function(handPokers) {
        var smallJoker = Poker.DECK_VALUE["joker"]["small"];
        var bigJoker = Poker.DECK_VALUE["joker"]["big"];

        for (var i = 0, size = handPokers.length; i < size; i++) {
            if (handPokers[i].value == smallJoker) {
                return true;
            }

            if (handPokers[i].value == bigJoker) {
                return true;
            }
        }

        return false;
    };

    Logic.calculate = function(handPokers) {
        handPokers = handPokers || [];

        var i = 0;
        var key;
        var size = 5;
        var result = Poker.NOTHING;
        var pokers = handPokers.slice(0);

        var holePokerValue = [];
        var holeJoker = [];             // 手持鬼牌

        // 按照牌面大小排序
        var compare = function(a, b) {
            return (a.value > b.value);
        };

        pokers.sort(compare);

        var isFlush = false;
        var isStreight = false;
        var statPokers = null;
        var pairs = 0;
        var pairJackOrBetter = 0;
        var three = 0;
        var four = 0;
        var jackBetter = 0;
        var nothing = 0;

        var hadJoker = this.findJoker(handPokers);
        if (hadJoker)
        {
            // 先取出鬼牌
            var jokers = [];
            var spliceIndex =[];
            for (i = 0 ; i < size; i++) {

                if (pokers[i].value >= 15) {
                    jokers.push(pokers[i]);
                    holeJoker.push(pokers[i].value);
                    spliceIndex.push(i);
                }
            }

            for (i in spliceIndex) {
                pokers.splice(spliceIndex[i], 1);
            }

            size = size - jokers.length;

            // 计算花色占比
            var flush = {spade:0, heart:0, diamond:0, club:0};
            for (i in pokers)
            {
                flush[pokers[i].type]++;
            }

            var maxType = { type:"spade", count:flush["spade"] };
            for(key in flush)
            {
                if(flush[key] > maxType.count)
                {
                    maxType.type = key;
                    maxType.count = flush[key];
                }
            }

            isFlush = true;
            if(jokers.length == 1)
            {
                if(maxType.count < 4)
                {
                    isFlush = false;
                }
            }
            else if(jokers.length == 2)
            {
                if(maxType.count < 3)
                {
                    isFlush = false;
                }
            }


            /////////// 计算顺子
            isStreight = true;

            var dValueTimes = {1:0,2:0,3:0};
            for (var i = 1; i < pokers.length ; i++) {
                var dValue = Math.abs(pokers[i - 1].value - pokers[i].value);
                if(dValue >= 3)
                {
                    dValueTimes["3"]++;
                }
                else
                {
                    dValueTimes[dValue]++;
                }
            }

            if(jokers.length == 1)
            {
                if(dValueTimes["2"] > 1 || dValueTimes["3"] > 0)
                {
                    isStreight = false;
                }
            }
            else if(jokers.length == 2)
            {
                if(dValueTimes["3"] > 1)
                {
                    isStreight = false;
                }
            }

            // 计算张数
            statPokers = {};
            var value;
            for (i = 0; i < size; i++) {
                value = pokers[i].value;
                statPokers[value] = statPokers[value] || 0;
                statPokers[value]++;
            }

            var amount;
            var flag;
            var tempvalue = [];
            for (value in statPokers) {
                amount = statPokers[value];
                flag = false;
                if (amount == 2) {
                    pairs++;
                    if (value >= 11) {
                        pairJackOrBetter++;
                        flag = true;
                    }
                    else
                    {
                        tempvalue.push(value);
                    }
                }
                else if (amount == 3) {
                    three++;
                    flag = true;
                }
                else if (amount == 4) {
                    four++;
                    flag = true;
                }
                else {
                    nothing++;
                    if(value >= 11)
                    {
                        jackBetter++;
                    }
                }

                if(flag)
                {
                    holePokerValue.push(value);
                }

                if(pairs >= 2)
                {
                    holePokerValue = holePokerValue.concat(tempvalue);
                }
            }

            /*
             张数规则：
             1.如果有4条，什么鬼牌都没用
             2.如果有3条，可以做葫芦和四条，以四条为最大，所以不管是一张鬼牌还是两张鬼牌都做成四条
             3.如果有一对，一张鬼牌时做三条，两张鬼牌时做4条
             4.如果有两对，只能做葫芦
             5.如果什么都没有，一张鬼牌时做J以上对子，两张鬼牌时做三条
             */
            if (isStreight && isFlush) {
                if (pokers[0].value == 10) {
                    result = Poker.ROYAL_FLUSH;
                }
                else {
                    result = Poker.STREIGHT_FLUSH;
                }
            }
            else if(four > 0)
            {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if(three > 0)
            {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (isFlush) {
                result = Poker.FLUSH;
            }
            else if (isStreight) {
                result = Poker.STREIGHT;
            }
            else if(pairs == 1)
            {
                if(jokers.length == 1)
                {
                    result = Poker.THREE_OF_A_KIND;
                }
                else if(jokers.length == 2)
                {
                    result = Poker.FOUR_OF_A_KIND;
                }
            }
            else if(pairs == 2)
            {
                result = Poker.FULL_HOUSE;
            }
            else if(nothing > 0)
            {
                if(jackBetter > 0)
                {
                    if(jokers.length == 1)
                    {
                        result = Poker.ONE_PAIR;
                    }
                    else if(jokers.length == 2)
                    {
                        result = Poker.THREE_OF_A_KIND;
                    }
                }
                else
                {
                    result = Poker.NOTHING
                }
            }
        }
        else
        {
            // 计算同花
            isFlush = true;
            for (i = 1; i < size; i++) {
                if (pokers[i].type != pokers[i - 1].type) {
                    isFlush = false;
                    break;
                }
            }
            // 计算顺子
            isStreight = true;
            for (i = 1; i < size; i++) {
                if (pokers[i - 1].value != pokers[i].value - 1) {
                    isStreight = false;
                    break;
                }
            }

            // 计算张数
            statPokers = {};
            var value;
            for (i = 0; i < size; i++) {
                value = pokers[i].value;
                statPokers[value] = statPokers[value] || 0;
                statPokers[value]++;
            }

            //var pairs = 0;
            //var pairJackOrBetter = 0;
            //var three = 0;
            //var four = 0;
            //var nothing = 0;
            var tempvalue = [];
            var amount;
            var flag;
            for (value in statPokers) {
                amount = statPokers[value];
                flag = false;
                if (amount == 2) {
                    pairs++;
                    if (value >= 11) {
                        pairJackOrBetter++;
                        flag = true;
                    }
                    else
                    {
                        tempvalue.push(value);
                    }
                }
                else if (amount == 3) {
                    three++;
                    flag = true;
                }
                else if (amount == 4) {
                    four++;
                    flag = true;
                }
                else {
                    nothing++;
                }

                if(flag)
                {
                    holePokerValue.push(value);
                }

                if(pairs >= 2)
                {
                    holePokerValue = holePokerValue.concat(tempvalue);
                }
            }

            // 同花顺/皇家同花顺
            if (isStreight && isFlush) {
                if (this.handPokers[0].value == 10) {
                    result = Poker.ROYAL_FLUSH;
                }
                else {
                    result = Poker.STREIGHT_FLUSH;
                }
            }
            else if (four > 0) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (three > 0 && pairs > 0) {
                result = Poker.FULL_HOUSE;
            }
            else if (isFlush) {
                result = Poker.FLUSH;
            }
            else if (isStreight) {
                result = Poker.STREIGHT;
            }
            else if (three > 0) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (pairs >= 2) {
                result = Poker.TWO_PAIR;
            }
            else if (pairJackOrBetter > 0) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }

        return result;
    };

    Logic.calculate2 = function(handPokers) {
        handPokers = handPokers || [];

        var i = 0;
        var key;
        var size = 5;
        var result = Poker.NOTHING;
        var pokers = handPokers.slice(0);

        // 按照牌面大小排序
        var compare = function(a, b) {
            return (a.value > b.value);
        };

        pokers.sort(compare);

        var isFlush = false;
        var isStreight = false;
        var statValues = {};
        var statTypes = {};
        var pairs = 0;
        var pairJackOrBetter = 0;
        var three = 0;
        var four = 0;
        var jackOrBetter = 0;
        var nothing = 0;

        var highValue = 0;
        var pairValue = [];
        var threeValue = 0;
        var fourValue = 0;

        // 计算花色和张数
        var type;
        var value;
        for (i = 0; i < size; i++) {
            type = pokers[i].type;
            value = pokers[i].value;

            statValues[value] = statValues[value] || 0;
            statValues[value]++;

            statTypes[type] = statTypes[type] || 0;
            statTypes[type]++;

            if (value > highValue && value < 15) {
                highValue = value;
            }
        }

        var amount;
        var jokerAmount = statTypes[Poker.JOKER] || 0;

        isFlush = false;
        for (type in statTypes) {
            amount = statTypes[type];
            if (type == Poker.JOKER) {
                continue;
            }

            if (amount >= 5) {
                isFlush = true;
                break;
            }

            if (amount + jokerAmount >= 5) {
                isFlush = true;
                break;
            }
        }

        // 计算顺子
        isStreight = true;
        var jokerUsed = 0;
        for (i = 1; i < size; i++) {
            var valueA = pokers[i - 1].value;
            var valueB = pokers[i].value;

            if (pokers[i].type ==  Poker.JOKER
            || pokers[i - 1].type ==  Poker.JOKER) {
                continue;
            }

            if (valueA != valueB - 1) {
                if (valueB - valueA < 5) {
                    jokerUsed++;
                }
                else {
                    isStreight = false;
                    break;
                }
            }

            if (jokerUsed > jokerAmount) {
                isStreight = false;
                break;
            }
        }

        for (value in statValues) {
            var pokerValue = Number(value);
            amount = statValues[value];

            // ignore joker values
            if (value >= 15) {
                continue;
            }

            if (amount == 2) {
                pairs++;
                pairValue.push(pokerValue);
                if (value >= 11) {
                    pairJackOrBetter++;
                }
            }
            else if (amount == 3) {
                three++;
                threeValue = pokerValue;
            }
            else if (amount == 4) {
                four++;
                fourValue = pokerValue;
            }
            else if (value >= 11) {
                jackOrBetter++;
            }
            else {
                nothing++;
            }
        }


        var markValue = [15, 16];

        // 同花顺/皇家同花顺
        if (isStreight && isFlush) {
            if (pokers[0].value == 10) {
                result = Poker.ROYAL_FLUSH;
            }
            else {
                result = Poker.STREIGHT_FLUSH;
            }
        }
        // 同花(不可能出现对子、三张和四张的牌型)
        else if (isFlush) {
            result = Poker.FLUSH;
        }
        // 顺子(不可能出现对子、三张和四张的牌型)
        else if (isStreight) {
            result = Poker.STREIGHT;
        }
        // 四张
        // Joker可以升级为 LUCKY5牌型
        else if (four > 0) {
            markValue.push(fourValue);

            if (jokerAmount > 0) {
                result = Poker.LUKCY5;
            }
            else {
                result = Poker.FOUR_OF_A_KIND;
            }
        }
        // 三张
        // 两张鬼升级为 LUCKY5牌型
        // 一张鬼升级为 四张牌型
        // 否则只剩下：葫芦/三张
        else if (three > 0) {
            markValue.push(threeValue);

            if (jokerAmount == 2) {
                result = Poker.LUKCY5;
            }
            else if (jokerAmount == 1) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (pairs > 0) {
                result = Poker.FULL_HOUSE;

                markValue = markValue.concat(pairValue);
            }
            else {
                result = Poker.THREE_OF_A_KIND;
            }
        }
        // 两对
        // 鬼牌升级为 葫芦
        else if (pairs >= 2) {
            markValue = markValue.concat(pairValue);

            if (jokerAmount > 0) {
                result = Poker.FULL_HOUSE;
            }
            else {
                result = Poker.TWO_PAIR;
            }
        }
        // 一对
        // 两张鬼升级为 四张
        // 一张鬼升级为 三张
        // 否则剩下 JackOrBetter
        else if (pairs >= 1) {
            markValue = markValue.concat(pairValue);

            if (jokerAmount == 2) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (jokerAmount == 1) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (pairJackOrBetter > 0) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }
        // 单张
        // 两张鬼升级为 三张
        // 一张鬼升级为 JackOrBetter  HighCardValue >= Jack
        else {
            markValue.push(highValue);
            if (jokerAmount == 2) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (jokerAmount == 1 && highValue > 10) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }

        var markPokers = [ false, false, false, false, false ];
        for (i = 0; i < 5; i++) {
            var poker = handPokers[i];

            switch (result) {
                case Poker.LUKCY5:
                case Poker.ROYAL_FLUSH:
                case Poker.STREIGHT_FLUSH:
                case Poker.FLUSH:
                case Poker.FULL_HOUSE:
                case Poker.STREIGHT:
                    markPokers[i] = true;
                    break;
                case Poker.FOUR_OF_A_KIND:
                case Poker.THREE_OF_A_KIND:
                case Poker.TWO_PAIR:
                case Poker.ONE_PAIR:
                    if (markValue.indexOf(poker.value) != -1) {
                        markPokers[i] = true;
                    }
                    break;
                case Poker.NOTHING:
                default:
                    break;
            }
        }

        return {
            result: result,
            marks:  markPokers
        };
    };
}(Papaya.Lucky5));
(function(root) {
    var _super = root.Serialize;
    var Lucky5 = root.Lucky5;
    var Logic = root.Lucky5.Logic;
    var Poker = root.Lucky5.Poker;
    var Double = root.Lucky5.Double = function(opts) {
        opts = opts || {};

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.dealerIndex            = 0;
        this.playerIndex            = opts.playerIndex || -1;

        this.state                  = opts.state || Double.STATE.READY;
        this.lastScore              = opts.lastScore || 0;
        this.betAmount              = opts.betAmount || 0;
        this.score                  = opts.score || 0;
        this.bonus                  = opts.bonus || 0;
        this.round                  = opts.round || 0;

        this.init(opts);
    };

    //Inherits Class
    root.inherits(Double, _super);

    Double.STATE = {};
    Double.STATE.READY            = 0;
    Double.STATE.STARTED          = 1;
    Double.STATE.SHUFFLED         = 2;
    Double.STATE.DEALED           = 3;
    Double.STATE.DRAWED           = 4;
    Double.STATE.ENDED            = 9;

    //Constants
    Double.RESULT_WAIT            = 0;
    Double.RESULT_WIN             = 1;
    Double.RESULT_DRAW            = 2;
    Double.RESULT_LOST            = 3;

    Double.BET_ORIG               = 0;
    Double.BET_DOUBLE             = 1;
    Double.BET_HALF               = 2;

    //Extend Prototype
    root.extend(Double.prototype, {
        init: function (opts) {
            var i;
            var size;

            if (opts.deck) {
                for (i = 0, size = opts.deck.length; i < size; i++) {
                    this.deck.push(new Lucky5.Poker(opts.deck[i]));
                }
            }

            if (opts.handPokers) {
                for (i = 0, size = opts.handPokers.length; i < size; i++) {
                    this.handPokers.push(new Lucky5.Poker(opts.handPokers[i]));
                }
            }
        },

        enter: function(lastScore) {
            this.lastScore = lastScore || 0;
            this.state = Double.STATE.READY;
        },

        start: function() {
            // 初始化所有参数
            this.deck                   = []; // 一整副牌
            this.handPokers             = []; // 手牌
            this.dealerIndex            = 0;
            this.playerIndex            = -1;

            this.state                  = Double.STATE.STARTED;
            this.betAmount              = this.lastScore;
            this.score                  = 0;
            this.bonus                  = 0;
            this.round                  = 0;

            // 初始化扑克牌
            var types = Object.keys(Lucky5.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = Lucky5.Poker.DECK[type];

                if (type == Poker.JOKER) {
                    continue;
                }

                for (var cIndex = 0, size2 = array.length; cIndex < size2; cIndex++) {
                    var name = array[cIndex];
                    var poker = new Lucky5.Poker();

                    poker.type = type;
                    poker.name = name;
                    poker.value = Lucky5.Poker.DECK_VALUE[type][name];

                    this.deck.push(poker);
                }
            }
        },

        shuffle: function () {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random() * (max - min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
            this.state = Double.STATE.SHUFFLED;
        },

        bet: function (type) {
            if (type == Double.BET_HALF) {
                this.betAmount /= 2;
            } else if (type == Double.BET_DOUBLE) {
                this.betAmount *= 2;
            } else {

            }

            this.state = Double.STATE.DEALED;
        },

        deal: function () {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }
        },

        draw: function(selectIndex) {
            if (selectIndex < 1 || selectIndex >= 5) {
                return;
            }

            this.playerIndex = selectIndex;

            this.state = Double.STATE.DRAWED;
        },
        
        end: function() {
            var result = 0;
            var score = 0;
            var lastScore = this.lastScore;
            var dealerPoker = this.handPokers[0];
            var playerPoker = this.handPokers[this.playerIndex];

            if (playerPoker.value > dealerPoker.value) {
                result = Double.RESULT_WIN;
                score = this.betAmount * 2;
                lastScore = score;
            } else if (playerPoker.value < dealerPoker.value) {
                result = Double.RESULT_LOST;
                score = 0;
                lastScore = 0;
            } else {
                result = Double.RESULT_DRAW;
                score = this.betAmount;
            }

            this.result = result;
            this.score  = score;
            this.lastScore = lastScore;
            this.state = Double.STATE.ENDED;
        }
    });
}(Papaya));

(function(root) {
    var _super = root.Game;
    var Lucky5 = root.Lucky5;
    var Logic = root.Lucky5.Logic;
    var Poker = root.Lucky5.Poker;
    var Game = root.Lucky5.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        //private members

        //public members
        this.id                     = root.Game.ID_LUCKY5;

        this.double                 = new Lucky5.Double(opts.double);

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.dropPokers             = []; // 翻牌
        this.holdPokers             = opts.holdPokers || [ false, false, false, false, false ];
        this.markPokers             = opts.markPokers ||  [ false, false, false, false, false ];
        this.state                  = opts.state || Game.STATE.READY;
        this.result                 = opts.result || Poker.NOTHING;
        this.betAmount              = opts.betAmount || 0;
        this.score                  = opts.score || 0;
        this.bonus                  = opts.bonus || 0;
        
        this.init(opts);
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function(opts) {
            var i;
            var size;

            if (opts.deck) {
                for (i = 0, size = opts.deck.length; i < size; i++) {
                    this.deck.push(new Lucky5.Poker(opts.deck[i]));
                }
            }

            if (opts.handPokers) {
                for (i = 0, size = opts.handPokers.length; i < size; i++) {
                    this.handPokers.push(new Lucky5.Poker(opts.handPokers[i]));
                }
            }

            if (opts.dropPokers) {
                for (i = 0, size = opts.dropPokers.length; i < size; i++) {
                    this.dropPokers.push(new Lucky5.Poker(opts.dropPokers[i]));
                }
            }
        },
        
        start: function() {
            // 初始化所有状态
            this.deck                   = [];
            this.handPokers             = [];
            this.dropPokers             = [];
            this.holdPokers             = [ false, false, false, false, false ];
            this.markPokers             = [ false, false, false, false, false ];
            this.state                  = Game.STATE.STARTED;
            this.result                 = Poker.NOTHING;
            this.betAmount              = 0;
            this.score                  = 0;
            this.bonus                  = 0;

            // 初始化扑克牌
            var types = Object.keys(Lucky5.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = Lucky5.Poker.DECK[type];

                for (var cIndex = 0, size2 = array.length; cIndex < size2; cIndex++) {
                    var name = array[cIndex];
                    var poker = new Lucky5.Poker();

                    poker.type = type;
                    poker.name = name;
                    poker.value = Lucky5.Poker.DECK_VALUE[type][name];

                    this.deck.push(poker);
                }
            }
        },

        shuffle: function() {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
            this.state = Game.STATE.SHUFFLED;
        },

        bet: function(amount) {
            this.betAmount = amount;
        },

        deal: function() {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }

            this.state = Game.STATE.DEALED;
        },

        hold: function(arr) {
            for (var i = 0, size = arr.length; i < size; i++) {
                this.holdPokers[i] = (arr[i] === true);
            }
        },

        draw: function() {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                if (this.holdPokers[i] === true) {
                    continue;
                }

                this.dropPokers.push(this.handPokers[i]);
                this.handPokers[i] = this.deck.shift();
            }

            this.state = Game.STATE.DRAWED;
        },

        end: function() {
            var data = Logic.calculate2(this.handPokers);
            var score  = Poker.SCORES[data.result] || 0;

            this.result = data.result;
            this.markPokers = data.marks;
            this.score  = score * this.betAmount;

            this.state = Game.STATE.ENDED;
        },

        enterDouble: function() {
            this.double.lastScore = this.score;
            this.state = Game.STATE.DOUBLE;
        }
    });

    Game.STATE = {};
    Game.STATE.READY            = 0;
    Game.STATE.STARTED          = 1;
    Game.STATE.SHUFFLED         = 2;
    Game.STATE.DEALED           = 3;
    Game.STATE.DRAWED           = 4;
    Game.STATE.ENDED            = 5;
    Game.STATE.DOUBLE           = 6;

    // Game.prototype.init = function() {
    //     for (var type in Poker.DECK) {
    //         var array = Poker.DECK[type];
    //
    //         for (var i = 0, size = array.length; i < size; i++) {
    //             var name = array[i];
    //             var poker = new root.Poker();
    //
    //             poker.type = type;
    //             poker.name = name;
    //             poker.value = Poker.DECK_VALUE[type][name];
    //
    //             this.deck.push(poker);
    //         }
    //     }
    //
    //     this.handlers = {};
    //     this.handlers[Lucky5.Game_Event.STATE.ENDED] = { func: this.restart, next: true };
    //     this.handlers[Lucky5.Game_Event.STATE.STARTED] = { func: this.shuffle, next: true };         // 洗牌
    //     this.handlers[Lucky5.Game_Event.STATE.SHUFFLED] = { func: this.deal, next: false };          // 发牌
    //     this.handlers[Lucky5.Game_Event.STATE.DEALED] = { func: this.draw, next: true };             // 抽牌
    //     this.handlers[Lucky5.Game_Event.STATE.DRAWED] = { func: this.end, next: false };
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_READY] = { func: this.gamblingSizeReady, next: true };    // 玩大小
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_START] = { func: this.gamblingSizeStart, next: false };
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_END] = { func: this.gamblingSizeEnd, next: true };
    // };
    //
    // Game.prototype.restart = function() {
    //     this.deck = this.deck.concat(this.handPokers);
    //     this.deck = this.deck.concat(this.dropPokers);
    //
    //     this.gamblingSizeStake = 0;
    //     this.handPokers = [];
    //     this.dropPokers = [];
    //     this.holdPokers = [ false, false, false, false, false ];
    //
    //     if (this.isAutoJackPot) {
    //         this.addJackPot();
    //     }
    //
    //     this.costScore(this.stake);
    //
    //     //this.next();
    // };
    //
    // Game.prototype.shuffle = function() {
    //     var newDeck = [];
    //
    //     while (this.deck.length) {
    //         var min = 0;
    //         var max = this.deck.length - 1;
    //
    //         var index = Math.floor(Math.random()*(max-min) + min);
    //         newDeck.push(this.deck[index]);
    //         this.deck.splice(index, 1);
    //     }
    //
    //     this.deck = newDeck;
    //     //this.next();
    // };
    //
    // Game.prototype.deal = function() {
    //     for (var i = 0; i < Lucky5.MAX_HAND; i++) {
    //         this.handPokers.push(this.deck.shift());
    //     }
    //
    //     // if (this.state == Lucky5.Game_Event.STATE.SHUFFLED) {
    //     //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //     //         this.handPokers.push(this.deck.shift());
    //     //     }
    //     // } else {
    //     //
    //     // }
    //
    //     //EventMgr.emit(Lucky5.Game_Event.Event.DEALED);
    //     //this.next();
    // };
    //
    // Game.prototype.draw = function() {
    //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //         if (this.holdPokers[i] == true) {
    //             continue;
    //         }
    //
    //         this.dropPokers.push(this.handPokers[i]);
    //         this.handPokers[i] = this.deck.shift();
    //     }
    //
    //
    //     //this.next();
    // };
    //
    // Game.prototype.addScore = function(score){
    //     this.score += score;
    //     this.increaseScore = score;
    //     EventMgr.emit(Lucky5.Game_Event.Event.UPGRADESCORE);
    // };
    //
    // Game.prototype.costScore = function(score){
    //     this.score -= score;
    //     if(this.score <= 0)
    //         this.score = 0;
    //     EventMgr.emit(Lucky5.Game_Event.Event.UPGRADESCORE);
    // };
    //
    // Game.prototype.setResultName = function(name) {
    //     this.resultName = name;
    // };
    //
    // Game.prototype.addStake = function() {
    //     this.stake += 10;
    //     if(this.stake > 990)
    //     {
    //         this.stake = 990;
    //     }
    //     else
    //     {
    //         this.costScore(10);
    //     }
    // };
    //
    // Game.prototype.cutStake = function() {
    //     this.stake -= 10;
    //
    //     if(this.stake < 10)
    //     {
    //         this.stake = 10;
    //     }
    //     else
    //     {
    //         this.addScore(10);
    //     }
    // };
    //
    // Game.prototype.addJackPot = function() {
    //     this.jackPotPool += 0.1;
    //     EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_UPGRADE);
    // };
    //
    // Game.prototype.cutJackPot = function(){
    //     this.jackPotPool -= 0.1;
    //     EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_UPGRADE);
    // };
    //
    // Game.prototype.getJackPot = function() {
    //     return this.jackPotPool.toFixed(1);
    // };
    //
    // Game.prototype.autoJackPot = function(target) {
    //     this.isAutoJackPot = target;
    // };
    //
    // Game.prototype.getStake = function() {
    //     return this.stake;
    // };
    //
    // Game.prototype.getResultName = function() {
    //     return this.resultName;
    // };
    //
    // Game.prototype.getScore = function(){
    //     return {score:this.score, increaseScore:this.increaseScore};
    // };
    //
    // Game.prototype.gamblingSizeStakeAdd = function() {
    //     this.gamblingSizeStake *= 2;
    //     if(this.gamblingSizeStake >= this.enterScore)
    //     {
    //         this.gamblingSizeStake = this.enterScore;
    //         this.costScore(this.enterScore);
    //     }
    //
    //     this.score = this.enterScore - this.gamblingSizeStake;
    //
    // };
    //
    // Game.prototype.gamblingSizeStakeCut = function() {
    //     this.cutStakeTime++;
    //     this.gamblingSizeStake = this.gamblingSizeStake - (this.initGamblingSizeStake*(2*this.cutStakeTime));
    //
    //     if(this.gamblingSizeStake <= this.initGamblingSizeStake)
    //     {
    //         this.gamblingSizeStake = this.initGamblingSizeStake;
    //         this.cutStakeTime = 0;
    //     }
    //
    //     this.score = this.enterScore - this.gamblingSizeStake;
    //
    //
    // };
    //
    // Game.prototype.getGamblingSizeStake = function() {
    //     return this.gamblingSizeStake;
    // };
    //
    // Game.prototype.getGamblingSizeTimes = function() {
    //     return this.gamblingSizeTimes;
    // };
    //
    // Game.prototype.getBankerMultiple = function() {
    //     return this.bankerMultiple;
    // };
    //
    // Game.prototype.next = function() {
    //     if (this.state >= Lucky5.Game_Event.STATE.ENDED) {
    //         this.state = Lucky5.Game_Event.STATE.STARTED;
    //     }
    //     else {
    //         this.state++;
    //     }
    // };
    //
    // Game.prototype.gamblingSizeEnter = function(data) {
    //
    //     this.enterScore = this.score;                       // 当次进入赌大小的本金
    //     this.initGamblingSizeStake = this.increaseScore*2;  // 赌大小的初始赌注
    //     // 赌大小押注
    //     this.gamblingSizeStake = this.increaseScore*2;
    //     // enter只是生成临时信息，用来显示，不影响具体数据，ready才处理具体数据
    //     var nowScore = this.score;
    //     var increaseScore = this.increaseScore;
    //
    //     var gamblingSizeStake = increaseScore*2;
    //
    //     data.nowScore = nowScore - gamblingSizeStake;
    //     data.gamblinSizeStake = gamblingSizeStake;
    //     data.increaseScore = increaseScore;
    //     data.gamblingSizeTimes = this.gamblingSizeTimes;
    //
    // };
    //
    // Game.prototype.gamblingSizeReady = function(){
    //
    //     var newDeck = [];
    //     this.deck = this.deck.concat(this.handPokers);
    //     this.deck = this.deck.concat(this.dropPokers);
    //
    //     while (this.deck.length) {
    //         var min = 0;
    //         var max = this.deck.length - 1;
    //
    //         var index = Math.floor(Math.random()*(max-min) + min);
    //         newDeck.push(this.deck[index]);
    //         this.deck.splice(index, 1);
    //     }
    //
    //     this.deck = newDeck;
    //     this.handPokers = [];
    //     this.dropPokers = [];
    //     this.holdPokers = [ false, false, false, false, false ];
    //
    //     this.gamblingSizeTimes += 1;                        // 赌大小次数
    //
    //     var probability = Math.floor(Math.random()*(100));
    //     console.log("probability = " + probability);
    //     var Multiple;
    //     var randomIndex;
    //     if(probability >= 90)
    //     {
    //         // 随机倍率
    //         Multiple = [2,2.5,3];
    //         randomIndex =  Math.round(Math.random()*(Multiple.length -1));
    //         this.bankerMultiple = Multiple[randomIndex];
    //     }
    //     else if(probability >= 80 && probability < 90)
    //     {
    //         this.bankerMultiple = 1.5;
    //     }
    //     else
    //     {
    //         this.bankerMultiple = 1;
    //     }
    //     // 随机倍率
    //     //var Multiple = [1.5,2,2.5,3];
    //     //var randomIndex =  Math.round(Math.random()*(Multiple.length -1));
    //     //this.bankerMultiple = Multiple[randomIndex];
    //
    //
    //     //this.enterScore = this.score;
    //     //this.initGamblingSizeStake = reward;
    //     this.cutStakeTime = 0;
    //     this.costScore(this.gamblingSizeStake);
    //
    //     this.gamblingSizeStart();
    // };
    //
    // Game.prototype.gamblingSizeStart = function() {
    //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //         this.handPokers.push(this.deck.shift());
    //     }
    //     this.bankerPoker = this.handPokers[0];//{type: "spade", name: "two", value: 2};
    //     EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_START);
    // };
    //
    // Game.prototype.flipPokers = function(index){
    //     var info,reward;
    //     if(this.handPokers[index].value > this.bankerPoker.value) {
    //         reward = this.gamblingSizeStake * 2 * this.bankerMultiple;
    //         this.addScore(reward);
    //
    //         info = 'win';
    //         str = "你赢了"+reward+"元";
    //     } else if(this.handPokers[index].value < this.bankerPoker.value) {
    //         this.state = Lucky5.Game_Event.STATE.ENDED;
    //         this.gamblingSizeStake = 0;
    //         EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_END);
    //         info = 'lose';
    //         str = "庄家赢了";
    //     } else {
    //         str = "打平";
    //     }
    //     EventMgr.emit(Lucky5.Game_Event.Event.SHOWMASSAGE,str);
    //     EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_RESULT,{info:info});
    // };
    //
    // Game.prototype.gamblingSizeEnd = function() {
    //     this.gamblingSizeStake = 0;
    //
    // };
    //
    // Game.prototype.end = function() {
    //     this.calculate(this.endResult.bind(this));
    //     //this.next();
    // };
    //
    //
    //
    // Game.prototype.calculate = function(cb) {
    //     var i = 0;
    //     var key;
    //     var size = 5;
    //     var result = Poker.NOTHING;
    //     var pokers = this.handPokers.slice(0);
    //     var holePokerValue = [];
    //     var holeJoker = [];             // 手持鬼牌
    //
    //     // 按照牌面大小排序
    //     var compare = function(a, b) {
    //         return (a.value > b.value);
    //     };
    //
    //     pokers.sort(compare);
    //
    //     var hadJoker = false;
    //
    //     for(var i in pokers)
    //     {
    //         if(pokers[i].value >= 15)
    //         {
    //             hadJoker = true;
    //             break;
    //         }
    //     }
    //
    //     var isFlush, isStreight, statPokers, pairs =0, pairJackOrBetter =0, three =0, four =0, nothing =0, jackBetter =0;
    //
    //     if(hadJoker)
    //     {
    //         // 先取出鬼牌
    //         var jokers = [];
    //         var spliceIndex =[];
    //         for(var i = 0 ; i < size; i++)
    //         {
    //
    //             if(pokers[i].value >= 15)
    //             {
    //                 jokers.push(pokers[i]);
    //                 holeJoker.push(pokers[i].value);
    //                 spliceIndex.push(i)
    //             }
    //         }
    //
    //         for(i in spliceIndex)
    //         {
    //             pokers.splice(spliceIndex[i],1);
    //         }
    //
    //         size = size - jokers.length;
    //
    //         // 计算花色占比
    //         var flush = {spade:0, heart:0, diamond:0, club:0};
    //         for(i in pokers)
    //         {
    //             flush[pokers[i].type]++;
    //         }
    //
    //         var maxType = {type:"spade" ,count:flush["spade"]};
    //         for(key in flush)
    //         {
    //             if(flush[key] > maxType.count)
    //             {
    //                 maxType.type = key;
    //                 maxType.count = flush[key];
    //             }
    //         }
    //
    //         isFlush = true;
    //         if(jokers.length == 1)
    //         {
    //             if(maxType.count < 4)
    //             {
    //                 isFlush = false;
    //             }
    //         }
    //         else if(jokers.length == 2)
    //         {
    //             if(maxType.count < 3)
    //             {
    //                 isFlush = false;
    //             }
    //         }
    //
    //
    //         /////////// 计算顺子
    //         isStreight = true;
    //
    //         var dValueTimes = {1:0,2:0,3:0};
    //         for (var i = 1; i < pokers.length ; i++) {
    //             var dValue = Math.abs(pokers[i - 1].value - pokers[i].value);
    //             if(dValue >= 3)
    //             {
    //                 dValueTimes["3"]++;
    //             }
    //             else
    //             {
    //                 dValueTimes[dValue]++;
    //             }
    //         }
    //
    //         if(jokers.length == 1)
    //         {
    //             if(dValueTimes["2"] > 1 || dValueTimes["3"] > 0)
    //             {
    //                 isStreight = false;
    //             }
    //         }
    //         else if(jokers.length == 2)
    //         {
    //             if(dValueTimes["3"] > 1)
    //             {
    //                 isStreight = false;
    //             }
    //         }
    //
    //         // 计算张数
    //         statPokers = {};
    //         var value;
    //         for (i = 0; i < size; i++) {
    //             value = pokers[i].value;
    //             statPokers[value] = statPokers[value] || 0;
    //             statPokers[value]++;
    //         }
    //
    //         var amount;
    //         var flag;
    //         var tempvalue = [];
    //         for (value in statPokers) {
    //             amount = statPokers[value];
    //             flag = false;
    //             if (amount == 2) {
    //                 pairs++;
    //                 if (value >= 11) {
    //                     pairJackOrBetter++;
    //                     flag = true;
    //                 }
    //                 else
    //                 {
    //                     tempvalue.push(value);
    //                 }
    //             }
    //             else if (amount == 3) {
    //                 three++;
    //                 flag = true;
    //             }
    //             else if (amount == 4) {
    //                 four++;
    //                 flag = true;
    //             }
    //             else {
    //                 nothing++;
    //                 if(value >= 11)
    //                 {
    //                     jackBetter++;
    //                 }
    //             }
    //
    //             if(flag)
    //             {
    //                 holePokerValue.push(value);
    //             }
    //
    //             if(pairs >= 2)
    //             {
    //                 holePokerValue = holePokerValue.concat(tempvalue);
    //             }
    //         }
    //
    //         /*
    //          张数规则：
    //          1.如果有4条，什么鬼牌都没用
    //          2.如果有3条，可以做葫芦和四条，以四条为最大，所以不管是一张鬼牌还是两张鬼牌都做成四条
    //          3.如果有一对，一张鬼牌时做三条，两张鬼牌时做4条
    //          4.如果有两对，只能做葫芦
    //          5.如果什么都没有，一张鬼牌时做J以上对子，两张鬼牌时做三条
    //
    //          */
    //
    //         if (isStreight && isFlush) {
    //             if (pokers[0].value == 10) {
    //                 result = Poker.ROYAL_FLUSH;
    //             }
    //             else {
    //                 result = Poker.STREIGHT_FLUSH;
    //             }
    //         }
    //         else if(four > 0)
    //         {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if(three > 0)
    //         {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if (isFlush) {
    //             result = Poker.FLUSH;
    //         }
    //         else if (isStreight) {
    //             result = Poker.STREIGHT;
    //         }
    //         else if(pairs == 1)
    //         {
    //             if(jokers.length == 1)
    //             {
    //                 result = Poker.THREE_OF_A_KIND;
    //             }
    //             else if(jokers.length == 2)
    //             {
    //                 result = Poker.FOUR_OF_A_KIND;
    //             }
    //         }
    //         else if(pairs == 2)
    //         {
    //             result = Poker.FULL_HOUSE;
    //         }
    //         else if(nothing > 0)
    //         {
    //             if(jackBetter > 0)
    //             {
    //                 if(jokers.length == 1)
    //                 {
    //                     result = Poker.ONE_PAIR;
    //                 }
    //                 else if(jokers.length == 2)
    //                 {
    //                     result = Poker.THREE_OF_A_KIND;
    //                 }
    //             }
    //             else
    //             {
    //                 result = Poker.NOTHING
    //             }
    //         }
    //     }
    //     else
    //     {
    //         // 计算同花
    //         isFlush = true;
    //         for (i = 1; i < size; i++) {
    //             if (pokers[i].type != pokers[i - 1].type) {
    //                 isFlush = false;
    //                 break;
    //             }
    //         }
    //         // 计算顺子
    //         isStreight = true;
    //         for (i = 1; i < size; i++) {
    //             if (pokers[i - 1].value != pokers[i].value - 1) {
    //                 isStreight = false;
    //                 break;
    //             }
    //         }
    //
    //         // 计算张数
    //         statPokers = {};
    //         var value;
    //         for (i = 0; i < size; i++) {
    //             value = pokers[i].value;
    //             statPokers[value] = statPokers[value] || 0;
    //             statPokers[value]++;
    //         }
    //
    //         //var pairs = 0;
    //         //var pairJackOrBetter = 0;
    //         //var three = 0;
    //         //var four = 0;
    //         //var nothing = 0;
    //         var tempvalue = [];
    //         var amount;
    //         var flag;
    //         for (value in statPokers) {
    //             amount = statPokers[value];
    //             flag = false;
    //             if (amount == 2) {
    //                 pairs++;
    //                 if (value >= 11) {
    //                     pairJackOrBetter++;
    //                     flag = true;
    //                 }
    //                 else
    //                 {
    //                     tempvalue.push(value);
    //                 }
    //             }
    //             else if (amount == 3) {
    //                 three++;
    //                 flag = true;
    //             }
    //             else if (amount == 4) {
    //                 four++;
    //                 flag = true;
    //             }
    //             else {
    //                 nothing++;
    //             }
    //
    //             if(flag)
    //             {
    //                 holePokerValue.push(value);
    //             }
    //
    //             if(pairs >= 2)
    //             {
    //                 holePokerValue = holePokerValue.concat(tempvalue);
    //             }
    //         }
    //
    //         // 同花顺/皇家同花顺
    //         if (isStreight && isFlush) {
    //             if (this.handPokers[0].value == 10) {
    //                 result = Poker.ROYAL_FLUSH;
    //             }
    //             else {
    //                 result = Poker.STREIGHT_FLUSH;
    //             }
    //         }
    //         else if (four > 0) {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if (three > 0 && pairs > 0) {
    //             result = Poker.FULL_HOUSE;
    //         }
    //         else if (isFlush) {
    //             result = Poker.FLUSH;
    //         }
    //         else if (isStreight) {
    //             result = Poker.STREIGHT;
    //         }
    //         else if (three > 0) {
    //             result = Poker.THREE_OF_A_KIND;
    //         }
    //         else if (pairs >= 2) {
    //             result = Poker.TWO_PAIR;
    //         }
    //         else if (pairJackOrBetter > 0) {
    //             result = Poker.ONE_PAIR;
    //         }
    //         else {
    //             result = Poker.NOTHING;
    //         }
    //     }
    //
    //     for(var i in holeJoker)
    //     {
    //         holePokerValue.push(holeJoker[i]+"");
    //     }
    //
    //     if(cb)
    //     {
    //         cb({resultType:result , holdPokers:holePokerValue});
    //     }
    //
    //
    // };
    //
    // // 一局普通玩法结束后处理
    // Game.prototype.endResult = function(resultData) {
    //     var result = resultData.resultType;
    //     var ret = Poker.HAND_TEXT[result];
    //     var multiple = this.stake/10;
    //     // 普通模式的奖励金币
    //     var normalReward = ret["score"]*multiple;
    //     var hadJackPotReward = this.jackPotReward(result);
    //     var rewardCount = normalReward + hadJackPotReward;
    //     this.addScore(rewardCount);
    //
    //     var scoreInfo = this.getScore();
    //     this.result = {
    //         result: result,
    //         resultData: resultData,
    //         rewardCount: rewardCount,
    //         resultScore: normalReward,
    //         jackPotReward: hadJackPotReward
    //     };
    //
    //     EventMgr.emit(Lucky5.Game_Event.Event.DRAWED);
    // };
    //
    //
    // // 选中牌
    // Game.prototype.hold = function(index) {
    //     if(index instanceof Array)
    //     {
    //         for(var i in index)
    //         {
    //             this.holdPokers[index[i]] = !this.holdPokers[index[i]];
    //         }
    //     }
    //     else
    //     {
    //         this.holdPokers[index] = !this.holdPokers[index];
    //     }
    // };
    //
    // Game.prototype.process = function() {
    //     while (true) {
    //         var handler = this.handlers[this.state];
    //
    //         handler.func.call(this);
    //         if (handler.next == false) {
    //             break;
    //         }
    //     }
    // };
    //
    // Game.prototype.jackPotReward = function(result) {
    //     var bonus = 0;
    //
    //     switch (result)
    //     {
    //         //case Poker.FULL_HOUSE:
    //         //    bonus = this.jackPotPool*0.5;
    //         //    break;
    //         //case Poker.STREIGHT_FLUSH:
    //         //    bonus = this.jackPotPool*0.8;
    //         //    break;
    //         case Poker.ROYAL_FLUSH:
    //             bonus = this.jackPotPool;
    //             break;
    //     }
    //
    //     if(bonus)
    //     {
    //         this.jackPotPool -= bonus;
    //         //this.score += bonus;
    //         //EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_REWARD);
    //     }
    //     return bonus;
    // };
    //

    //
    //Game.GAMBLINGSIZE = {};
    //Game.GAMBLINGSIZE.BIG = 0;
    //Game.GAMBLINGSIZE.SMALL = 0;
}(Papaya));