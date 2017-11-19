/*! pokerGoGo 2017-03-11 */
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
            TOKEN_ERROR:         1004
        },

        REQUEST: {
            INVALID_PARAMS:      1500,
            INVALID_UUID:        1501,
            INVALID_SIGNATURE:   1502,
            INVALID_TOKEN:       1503,
            INVALID_STATE:       1504
        },

        RESPONSE: {
            BALANCE_INSUFFICIENT: 1600,
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

    root.Message[Code.REQUEST.INVALID_PARAMS]                = "Invalid request params";
    root.Message[Code.REQUEST.INVALID_UUID]                  = "Invalid uuid format";
    root.Message[Code.REQUEST.INVALID_SIGNATURE]             = "Invalid signature";
    root.Message[Code.REQUEST.INVALID_TOKEN]                 = "Invalid jwt";
    root.Message[Code.REQUEST.INVALID_STATE]                 = "Invalid state";

    root.Message[Code.RESPONSE.BALANCE_INSUFFICIENT]         = "Balance insufficient";

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
}(Papaya));
/**
 * Created by WhelaJoy on 2017/2/14.
 */
(function(root) {
    Papaya.PokerGoGo = {};

    /**
     * Game Constants
     */
    Papaya.PokerGoGo.MAX_HAND              = 2;
    Papaya.PokerGoGo.MIN_BET               = 10;
    Papaya.PokerGoGo.MAX_BET               = 1000;

}(Papaya));
/**
 * Created by WhelaJoy on 2017/2/17.
 */
(function(root) {
    var Poker = root.PokerGoGo.Poker = function() {
        this.type = null;
        this.name = null;
        this.value = 0;
    };

    Poker.NO_SHOOT                      = 0; // 射偏，押大小(输)
    Poker.SHOOT                         = 1; // 射中，押大小(赢)
    Poker.STREIGHT                      = 2; // 顺子
    Poker.SEQUENCE                      = 3; // 连张
    Poker.STREIGHT_FLUSH                = 4; // 同花顺
    Poker.THREE_OF_A_KIND               = 5; // 三张相同的牌（帽子戏法）
    Poker.HIT_COLUMN                    = 6; // 撞柱

    Poker.SCORES                        = {
        "1" :   1,
        "2" :   2,
        "3" :   999,
        "4" :   4
    };
    Poker.ONE_PAIR_MAX_BET = 100;       //押大，押小是，最大的押注钱

    Poker.TYPE_NAME                     = {
        "0":       "射偏",
        "1":       "射中",
        "2":       "顺子",
        "3":       "连张",
        "4":       "同花顺",
        "5":       "帽子戏法",
        "6":       "撞柱"
    };

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
        ]
        //"joker": [
        //    "small", "big"
        //]
    };
    Poker.DECK_VALUE = {
        "spade": {              // 黑桃
            "ace":    1,
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
            "king":   13
        },
        "heart": {              // 红心
            "ace":    1,
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
            "king":   13
        },
        "club": {               // 梅花
            "ace":    1,
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
            "king":   13
        },
        "diamond": {            // 方块
            "ace":    1,
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
            "king":   13
        },
        //"joker": {
        //    "small":  15,
        //    "big":    16
        //}
    };
} (Papaya));
/**
 * Created by WhelaJoy on 2017/2/18.
 */
(function(root) {
    var _super = root.Game;
    var PokerGoGo = root.PokerGoGo;
    var Poker = root.PokerGoGo.Poker;
    var Game = root.PokerGoGo.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        this.id                     = root.Game.ID_POKERGOGO;

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.initDeck               = []; // 一整副牌(初始化)

        this.betAmount              = 0;
        this.bettype                = 0;

        this.state                  = Game.STATE.BET;

        this.jackPotPool            = opts.jackPotPool || 2000;
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function() {
            // 初始化扑克牌
            var types = Object.keys(PokerGo.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = PokerGo.Poker.DECK[type];

                for (var cIndex = 0, size2 = array.length; cIndex < size2; cIndex++) {
                    var name = array[cIndex];
                    var poker = new PokerGo.Poker();

                    poker.type = type;
                    poker.name = name;
                    poker.value = PokerGo.Poker.DECK_VALUE[type][name];

                    this.initDeck.push(poker);
                }
            }

            // 洗牌
            this.shuffle();
        },

        shuffle: function() {
            var newDeck = [];

            var deck = this.initDeck.concat();

            while (deck.length) {
                var min = 0;
                var max = deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(deck[index]);
                deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        betType : function (opts){
            var results = {
                betAmount: null,
                bettype: null,
                err:null,
                state : null,
                jackPotPool:null
            };

            var bettype = opts.bettype;
            if(this.betType > 0){
                results.err = Game.ERR.BETTYPE_ERR;
                return results;
            }

            results.bettype = bettype;

            return results;
        },

        bet: function(opts) {
            var results = {
                betAmount: null,
                bettype: null,
                err:null,
                state : null,
                jackPotPool:null
            };

            if(!(this.state == Papaya.PokerGo.Game.STATE.READY || this.state  == Papaya.PokerGo.Game.STATE.BET)){
                results.err = Game.ERR.NO_BET;
                return results
            }
            results.state = Game.STATE.BETED;

            var betAmount = opts.betAmount;
            var bettype = opts.bettype;

            if((bettype > 0 &&　betAmount > PokerGo.Poker.ONE_PAIR_MAX_BET) || (bettype == 0 && betAmount > PokerGo.MAX_BET) ){
                results.err = Game.ERR.OUT_MAXBET;

                return results;
            }

            //if((!this.isOnePair(this.handPokers) && bettype > 0) || (this.isOnePair(this.handPokers) && bettype == 0 ) ){
            //    results.err = Game.ERR.BETTYPE_ERR;
            //    return results
            //}

            results.betAmount = betAmount;
            //results.bettype = bettype;

            results.jackPotPool = this.jackPotPool + betAmount;
            return results;
        },

        getJackPotPool : function (score){
            if (this.jackPotPool < score){
                score = this.jackPotPool;
            }
            return score;
        },

        dealHandle: function(opts) {
            var results = {
                handPokers: null,
                score: null,
                results : null,
                err: null,
                betAmount : null,
                jackPotPool : null,
                state : null
            };

            //if(!(this.state == Game.STATE.READY || this.state == Game.STATE.BET)){
            //    results.err = Game.ERR.NO_READY;
            //    return results;
            //}
            //results.state = Game.STATE.BET;

            if(this.state != Game.STATE.BETED){
                results.err = Game.ERR.NO_BETED;
                return results;
            }
            results.state = Game.STATE.READY;


            this.shuffle();
            var score = null;
            this.handPokers = [];
            for (var i = 0; i < PokerGo.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }
            results.handPokers = this.handPokers;

            if(this.isSequence(this.handPokers)){
                results.results = PokerGo.Poker.SEQUENCE;
                score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SEQUENCE]);
                results.score = score;
                results.jackPotPool = this.jackPotPool - score;

                results.betAmount = 0;
                results.state = Game.STATE.BET;
                return results;
            }

            return results;
        },

        drawHandle: function(opts) {
            var results = {
                handPokers: null,
                score: null,
                results : null,
                err:null,
                betAmount : 0,
                jackPotPool : null,
                bettype: 0,
                state : null
            };

            if(this.isOnePair(this.handPokers) && this.bettype <= 0 ){
                results.err = Game.ERR.NO_BET_MAX_AND_MIN;
                return results;
            }

            if (this.state != Game.STATE.READY){
                results.err = Game.ERR.NO_READY;
                return results;
            }
            results.state = Game.STATE.BET;

            //if (this.state != Game.STATE.BETED){
            //    results.err = Game.ERR.NO_BETED;
            //    return results;
            //}
            //results.state = Game.STATE.READY;

            var min = 0;
            var max = this.deck.length - 1;
            var index = Math.floor(Math.random()*(max-min) + min);
            this.handPokers.push(this.deck[index]);
            results.handPokers = this.handPokers[2];

            var pokerValue1 = this.handPokers[0].value;
            var pokerValue2 = this.handPokers[1].value;
            var pokerValue3 = this.handPokers[2].value;

            var score = null;

            if(this.isOnePair(this.handPokers)){
                //押大，押小
                //if(this.betAmount > PokerGo.Poker.ONE_PAIR_MAX_BET){
                //    results.err = Game.ERR.OUT_MAXBET;
                //
                //    return results;
                //}

                if (pokerValue3 == pokerValue1){
                    //帽子戏法
                    results.results = PokerGo.Poker.THREE_OF_A_KIND;
                    results.score = this.jackPotPool;
                    results.jackPotPool = 2000;
                    return results
                }

                if(this.bettype == Game.BETTYPE.BETMIN && pokerValue3 < pokerValue1){
                    //押小
                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount)  ;
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;
                    return results
                }
                else if (this.bettype == Game.BETTYPE.BETMAX && pokerValue3 > pokerValue1){
                    //押大
                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;
                    return results
                }
            }
            else {
                //押注
                var pokerType1 = this.handPokers[0].type;
                var pokerType2 = this.handPokers[1].type;
                var pokerType3 = this.handPokers[2].type;

                if(pokerValue2 > pokerValue1 && (pokerValue3 > pokerValue1 && pokerValue3 < pokerValue2)){
                    //顺子
                    if (pokerValue3 - 1 == pokerValue1 && pokerValue3 + 1 == pokerValue2){
                        if (pokerType1 == pokerType2 && pokerType2 == pokerType3 && pokerType3 == pokerType1 ){
                            //同花顺
                            results.results = PokerGo.Poker.STREIGHT_FLUSH;
                            score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH] * this.betAmount + this.betAmount);
                            results.score = score;
                            results.jackPotPool = this.jackPotPool - score;

                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT] * this.betAmount + this.betAmount);
                        results.score = score;
                        results.jackPotPool = this.jackPotPool - score;

                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;

                    return results
                }
                else if (pokerValue2 < pokerValue1 && (pokerValue3 > pokerValue2 && pokerValue3 < pokerValue1)) {
                    //顺子
                    if (pokerValue3 - 1 == pokerValue2 && pokerValue3 + 1 == pokerValue1){
                        if (pokerType1 == pokerType2 && pokerType2 == pokerType3 && pokerType3 == pokerType1 ){
                            //同花顺
                            results.results = PokerGo.Poker.STREIGHT_FLUSH;
                            score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH] * this.betAmount + this.betAmount);
                            results.score = score;
                            results.jackPotPool = this.jackPotPool - score;

                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT] * this.betAmount + this.betAmount);
                        results.score = score;
                        results.jackPotPool = this.jackPotPool - score;

                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;

                    return results
                }
                else if(pokerValue3 == pokerValue1 || pokerValue3 == pokerValue2){
                    results.results = PokerGo.Poker.HIT_COLUMN;
                    score = this.betAmount;

                    if(score >= App.player.balance){
                        score = App.player.balance;
                    }

                    results.score = -score;
                    results.jackPotPool = this.jackPotPool + score;
                    return results;
                }

            }

            //射偏，押大小(输)
            results.results = PokerGo.Poker.NO_SHOOT;

            return results
        },

        //是否,连张
        isSequence : function (handPokers){
            var pokerValue1 = handPokers[0].value;
            var pokerValue2 = handPokers[1].value;

            if(pokerValue1+1 == pokerValue2 || pokerValue1-1 == pokerValue2){
                return true;
            }
            return false;
        },
        //是否,对子
        isOnePair : function (handPokers){
            var pokerValue1 = handPokers[0].value;
            var pokerValue2 = handPokers[1].value;
            return pokerValue1 == pokerValue2;
        },

        getState : function (){
            return this.state;
        },

        syncGame :function (opts){
            if(opts.betAmount != null && opts.betAmount >= 0){
                this.betAmount = opts.betAmount;
            }

            if(opts.bettype != null && opts.bettype >= 0){
                this.bettype = opts.bettype;
            }

            if(opts.jackPotPool != null &&　opts.jackPotPool > 0){
                this.jackPotPool = opts.jackPotPool;
            }
            else if ( opts.jackPotPool == 0){
                this.jackPotPool = 2000;
            }

            if(opts.state != null && opts.state >= 0){
                this.state = opts.state;
            }

        }

    });

    Game.BETTYPE = {};
    Game.BETTYPE.BETON            = 0;      //押注
    Game.BETTYPE.BETMIN           = 1;      //押小
    Game.BETTYPE.BETMAX           = 2;      //押大

    Game.STATE = {} ;
    Game.STATE.READY                = 0;
    Game.STATE.BET                  = 1;
    Game.STATE.BETED                = 2;
    Game.STATE.DRAW                 = 3;

    Game.ERR = {
        NO_READY     : 10001, //"不在游戏预备开牌中"
        NO_BET       : 10002, //"不在游戏开始押注中"
        NO_BETED     : 10003, //"还没下注"
        OUT_MAXBET   : 10004, //"超出最大押注金"
        BETTYPE_ERR  : 10005, //"押注类型错误"
        NO_MONEY_ERR : 10006, //"玩家不够本金押注"
        NO_BET_MAX_AND_MIN : 10007, //"没有押注大小"
    };
}(Papaya));