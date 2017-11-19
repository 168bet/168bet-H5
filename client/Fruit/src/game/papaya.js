/*! fruit 2017-04-05 */
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
    Papaya.Fruit = {};

    /**
     * Game Constants
     */
    Papaya.Fruit.MAX_HAND              = 5;
    Papaya.Fruit.MIN_BET               = 10;
    Papaya.Fruit.MAX_BET               = 1000;

}(Papaya));
(function(root) {
    var Rotary = root.Rotary = function() {

    };

    Rotary.ROTARY_FRUITS = [
        {id:1001, fruitName: "Apple", multiple:1, weight: 457},
        {id:1002, fruitName: "Bell", multiple:3, weight: 761},
        {id:1003, fruitName: "Orange", multiple:1, weight: 494},
        {id:1004, fruitName: "Bell", multiple:1, weight: 500},
        {id:1005, fruitName: "GG", multiple: 50, weight: 45},
        {id:1006, fruitName: "GG", multiple: 100, weight: 22},
        {id:1007, fruitName: "Apple", multiple:1, weight: 457},
        {id:1008, fruitName: "Apple", multiple:3, weight: 761},
        {id:1009, fruitName: "Pomelo", multiple:1, weight: 494},
        {id:1010, fruitName: "Watermelon", multiple:1, weight: 247},
        {id:1011, fruitName: "Watermelon", multiple:3, weight: 761},
        {id:1012, fruitName: "BlueLuck", multiple:1, weight: 191},
        {id:1013, fruitName: "Apple", multiple:1, weight: 457},
        {id:1014, fruitName: "Orange", multiple:3, weight: 761},
        {id:1015, fruitName: "Orange", multiple:1, weight: 494},
        {id:1016, fruitName: "Bell", multiple:1, weight: 494},
        {id:1017, fruitName: "77", multiple:3, weight: 761},
        {id:1018, fruitName: "77", multiple:1, weight: 247},
        {id:1019, fruitName: "Apple", multiple:1, weight: 457},
        {id:1020, fruitName: "Pomelo", multiple:3, weight: 761},
        {id:1021, fruitName: "Pomelo", multiple:1, weight: 494},
        {id:1022, fruitName: "Star", multiple:1, weight: 247},
        {id:1023, fruitName: "Star", multiple:3, weight: 761},
        {id:1024, fruitName: "GoldenLuck", multiple:1, weight: 191}
    ];

    //*大三元
    Rotary.BIG_TRIPLE = [1010, 1022, 1018];

    //*小三元
    Rotary.SMALL_TRIPLE = {
        "Bell": [1004, 1016],
        "Pomelo": [1009, 1021],
        "Orange": [1003, 1015]
    };

    Rotary.SMALL_TRIPLE_ALL_FRUITS = [1004, 1016, 1009, 1021, 1003, 1015];

    //*大四喜
    Rotary.QUADRUPLE = [1001, 1007, 1013, 1019];

    //*随机倍率区
    Rotary.RANDOM_MULTIPLE_LOW = [10, 15, 20];
    Rotary.RANDOM_MULTIPLE_HIGH = [20, 30, 40];

    Rotary.WEIGHT_MULTIPLE_LOW = [
        {id: 1101, multiple:10, weight: 228},
        {id: 1102, multiple:15, weight: 152},
        {id: 1103, multiple:20, weight: 114}
    ];
    Rotary.WEIGHT_MULTIPLE_HIGH = [
        {id: 1104, multiple:20, weight: 114},
        {id: 1105, multiple:30, weight: 76},
        {id: 1106, multiple:40, weight: 57}
    ];

    //*大三元，小三元，大四喜出现的概率
    Rotary.PROBABILITY_BIG_TRIPLE = 3;
    Rotary.PROBABILITY_SMALL_TRIPLE = 5;
    Rotary.PROBABILITY_QUADRUPLE = 5;

    Rotary.PROBABILITY_LUCKY_EAT_LIGHT = 10;
    Rotary.PROBABILITY_LUCKY_GIVE_LIGHT = 89;
    Rotary.PROBABILITY_LUCKY_QUADRUPLE = 94;
    Rotary.PROBABILITY_LUCKY_SMALL_TRIPLE = 98;
    Rotary.PROBABILITY_LUCKY_BIG_TRIPLE = 100;

    //*开始，结束送灯的概率
    Rotary.PROBABILITY_GIVE_LIGHT_START = 1;
    Rotary.PROBABILITY_GIVE_LIGHT_END = 5;

    //*苹果的赔率
    Rotary.MULTIPLE_BY_APPLE = 5;

    //*luck
    Rotary.LUCK_NAME_LIST = ["GoldenLuck", "BlueLuck"];
    Rotary.LUCK_INDEX_LIST = [1012, 1024];

    //*特殊类型
    Rotary.SPECIAL_TYPE_NAME_LIST = {
        BIG_TRIPLE: "BIG_TRIPLE",
        SMALL_TRIPLE: "SMALL_TRIPLE",
        QUADRUPLE: "QUADRUPLE"
    };

    Rotary.FRUIT_NAME_LIST = [
        "GG",
        "77",
        "Star",
        "Watermelon",
        "Bell",
        "Pomelo",
        "Orange",
        "Apple"
    ];

    //*猜大小类型
    Rotary.GUESS_SIZE_TYPE = {
        LOW: "1-6",
        HIGH: "8-13",
        ZERO: "7"
    };
} (Papaya.Fruit));
(function(root) {
    var Utils = Papaya.Utils;
    var Rotary = root.Rotary;
    var Logic = root.Logic = function() {
    };

    Logic.giveLights = function () {
        var isGiveLight = false;
        var giveLightNum = 0;

        var rand = Utils.random_number(100);
        if (rand < Rotary.PROBABILITY_GIVE_LIGHT_START) {
            //*开始的时候送灯
            isGiveLight = true;
        }
        else {
            rand = Utils.random_number(100);
            //*结束的时候送灯
            if (rand < Rotary.PROBABILITY_GIVE_LIGHT_END) {
                isGiveLight = true;
            }
        }

        if (isGiveLight) {
            //*送1-5个灯
            giveLightNum = this.getGiveLightTotal();
        }

        return giveLightNum;
    };

    Logic.getGiveLightTotal = function () {
        return Utils.range_value(1, 6);
    };

    Logic.getRandomRotaryFruits = function (lightTotal) {
        lightTotal = lightTotal || 1;

        this.hasLuckFruit = false;
        this.hasBigTriple = false;
        this.hasSmallTriple = false;
        this.hasQuadruple = false;

        this.luckFruitIndex = 0;
        this.rotaryFruits = [];
        this.luckRewardFruits = [];
        this.normalRewardFruits = [];

        var result = {
            fruits: {},
            rewardType: {}
        };

        var wasSaveLightNum = 0;
        var fruitIndex = 0;

        for (wasSaveLightNum; wasSaveLightNum < lightTotal; wasSaveLightNum ++) {
            fruitIndex = this.getRandomFruitIndex();
            this.rotaryFruits.push(fruitIndex);
        }

        if (this.hasLuckFruit) {
            var isEatLight = this.getLuckRewardFruits();
            if (isEatLight) {
                this.rotaryFruits = [this.luckFruitIndex];
                this.luckRewardFruits = [];
                this.normalRewardFruits = [];
            }
        }

        result.fruits = {
            rotaryFruits: this.rotaryFruits,
            luckRewardFruits: this.luckRewardFruits,
            normalRewardFruits: this.normalRewardFruits
        };

        result.rewardType = {
            hasBigTriple: this.hasBigTriple,
            hasSmallTriple: this.hasSmallTriple,
            hasQuadruple: this.hasQuadruple
        };

        return result;
    };

    Logic.getRandomFruitIndex = function () {
        var fruitIndex = 0;
        var rotaryFruits = Rotary.ROTARY_FRUITS;
        var luckFruitIndexList = Rotary.LUCK_INDEX_LIST;

        fruitIndex = Utils.calcWeight(rotaryFruits);
        var index = fruitIndex + 1001;
        if (luckFruitIndexList.indexOf(index) != -1) {
            if (this.hasLuckFruit) {
                fruitIndex = this.getRandomFruitIndex();
            }
            else {
                this.hasLuckFruit = true;
                this.luckFruitIndex = fruitIndex;
            }
        }

        return fruitIndex;
    };

    Logic.getLuckRewardFruits = function () {
        var isEatLight = false;

        var rand = Utils.random_number(100);
        var index = 0;
        var fruitIndex = 0;

        if (rand < Rotary.PROBABILITY_LUCKY_EAT_LIGHT) {
            isEatLight = true;
        }
        else if (rand >= Rotary.PROBABILITY_LUCKY_EAT_LIGHT && rand < Rotary.PROBABILITY_LUCKY_GIVE_LIGHT) {
            var giveLightTotal = this.getGiveLightTotal();
            for (index; index < giveLightTotal; index ++) {
                fruitIndex = this.getRandomFruitIndex();
                this.luckRewardFruits.push(fruitIndex);
            }
        }
        else if (rand >= Rotary.PROBABILITY_LUCKY_GIVE_LIGHT && rand < Rotary.PROBABILITY_LUCKY_QUADRUPLE) {
            var appleList = Rotary.QUADRUPLE;
            var appleIndex = 0;
            for (index = 0; index < appleList.length; index ++) {
                appleIndex = appleList[index];
                if (this.rotaryFruits.indexOf(appleIndex) == -1) {
                    this.luckRewardFruits.push(appleIndex);
                }
            }
        }
        else if (rand >= Rotary.PROBABILITY_LUCKY_QUADRUPLE && rand < Rotary.PROBABILITY_LUCKY_SMALL_TRIPLE) {
            var smallTriple = Rotary.SMALL_TRIPLE;
            for (var name in smallTriple) {
                var fruitList = smallTriple[name];
                var tempNum = 0;
                for (index; index < fruitList.length; index ++) {
                    fruitIndex = fruitList[index];
                    if (this.rotaryFruits.indexOf(fruitIndex) != -1) {
                        break;
                    }
                    tempNum ++;
                    if (tempNum == fruitList.length) {
                        rand = Utils.random_number(2);
                        this.luckRewardFruits.push(fruitList[rand]);
                    }
                }
            }
            this.hasSmallTriple = true;
        }
        else {
            var bigTriple = Rotary.BIG_TRIPLE;
            for (index; index < bigTriple.length; index ++) {
                fruitIndex = bigTriple[index];
                if (this.rotaryFruits.indexOf(fruitIndex) == -1) {
                    this.luckRewardFruits.push(fruitIndex);
                }
            }

            this.hasBigTriple = true;
        }

        return isEatLight;
    };

    Logic.getNormalRewardFruits = function (fruitList) {
        fruitList = fruitList || this.rotaryFruits;

        var index = 0;
        var fruitIndex = 0;
        var fruitListLength = fruitList.length;
        var bigTripleFruits = Rotary.BIG_TRIPLE;
        var quadruple = Rotary.QUADRUPLE;
        var smallTripleFruits = Rotary.SMALL_TRIPLE_ALL_FRUITS;

        for (index; index < fruitListLength; index ++) {
            fruitIndex = fruitList[index];

            if (bigTripleFruits.indexOf(fruitIndex) != -1) {
                this.bigTripleBingo();
                continue;
            }

            if (quadruple.indexOf(fruitIndex) != -1) {
                this.quadrupleBingo();
                continue;
            }

            if (smallTripleFruits.indexOf(fruitIndex) != -1) {
                this.smallTripleBingo();
            }
        }
    };

    Logic.smallTripleBingo = function () {
        if (this.hasSmallTriple) {
            return;
        }

        var rand = Utils.random_number(100);
        if (rand < Rotary.PROBABILITY_SMALL_TRIPLE) {

        }

        this.hasSmallTriple = true;
    };

    Logic.bigTripleBingo = function () {
        if (this.hasBigTriple) {
            return;
        }

        var rand = Utils.random_number(100);
        if (rand < Rotary.PROBABILITY_BIG_TRIPLE) {
            var bigTripleList = Rotary.BIG_TRIPLE;
            var fruitIndex = 0;
            for (var index = 0; index < bigTripleList.length; index ++) {
                fruitIndex = bigTripleList[index];
                if (this.rotaryFruits.indexOf(fruitIndex) == -1 && this.luckRewardFruits.indexOf(fruitIndex) == -1) {
                    this.normalRewardFruits.push(fruitIndex);
                }
            }
        }

        this.hasBigTriple = true;
    };

    Logic.quadrupleBingo = function () {
        if (this.hasQuadruple) {
            return;
        }

        var rand = Utils.random_number(100);
        if (rand < Rotary.PROBABILITY_QUADRUPLE) {
            var appleList = Rotary.QUADRUPLE;
            var appleIndex = 0;
            for (var index = 0; index < appleList.length; index ++) {
                appleIndex = appleList[index];
                if (this.rotaryFruits.indexOf(appleIndex) == -1 && this.luckRewardFruits.indexOf(appleIndex) == -1) {
                    this.normalRewardFruits.push(appleIndex);
                }
            }
        }

        this.hasQuadruple = true;
    };

    Logic.randomMultiple = function () {
        var multiple = {
            low: 10,
            high: 20
        };

        var lowMultipleList = Rotary.WEIGHT_MULTIPLE_LOW;
        var randLowIndex = Utils.calcWeight(lowMultipleList);

        var highMultipleList = Rotary.WEIGHT_MULTIPLE_HIGH;
        var randHighIndex = Utils.calcWeight(highMultipleList);

        multiple.low = lowMultipleList[randLowIndex].multiple;
        multiple.high = highMultipleList[randHighIndex].multiple;

        return multiple;
    };

    Logic.getGuessNum = function () {
        var randNum = 1;
        randNum = Utils.random_number(12) + 1;
        return randNum;
    };

    Logic.getGuessNumType = function (randNum) {
        randNum = randNum || 1;
        var randType = Rotary.GUESS_SIZE_TYPE.LOW;

        if (randNum >=1 && randNum <= 6) {
            randType = Rotary.GUESS_SIZE_TYPE.LOW;
        }
        else if (randNum >= 8 && randNum <= 13) {
            randType = Rotary.GUESS_SIZE_TYPE.HIGH;
        }
        else {
            randType = Rotary.GUESS_SIZE_TYPE.ZERO;
        }

        return randType;
    }

}(Papaya.Fruit));
(function(root) {
    var _super = root.Game;
    var Rotary = root.Fruit.Rotary;
    var Logic = root.Fruit.Logic;

    var Game = root.Fruit.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        //private members

        //public members
        this.id             = root.Game.ID_FRUIT;

        this.baseLightNum   = 1;
        this.betInfo        = {};
        this.multiples      = opts.multiples    || {low: 10, high: 20};
        this.betTotal       = opts.betTotal     || 0;
        this.guessBet       = opts.guessBet     || 0;                           //*猜大小的押注
        this.bonusWin       = opts.bonusWin     || 0;
        this.betFactor      = opts.betFactor    || 1;                           //*押注倍数
        this.fruitBetList   = opts.fruitBetList || {};                          //*押注列表
        this.lastFruit      = opts.lastFruit    || {};                          //*最新一次水果结果
        this.records        = opts.records      || {};                          //*水果开启记录
        this.guessedNum     = opts.guessedNum   || 0;                           //*博大小的结果
        this.guessedType    = opts.guessedType  || Rotary.GUESS_SIZE_TYPE.LOW;  //*玩家选择大小的类型
        this.state          = opts.state        || Game.STATE.READY;            //*游戏所处的状态

        this.init();
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function() {
        },

        betFruit: function (betInfo) {
            //*押注水果
            betInfo = JSON.parse(betInfo) || {};

            for (var i in betInfo) {
                this.fruitBetList[i] = betInfo[i];
            }

            this.state = Game.STATE.FRUIT_BETTING;
        },

        changeBetFactor: function (betFactor) {
            //*设置押注倍数
            betFactor = Number(betFactor) || 1;

            if (Game.BET_FACTOR.indexOf(betFactor) != -1) {
                this.betFactor = betFactor;
                this.state = Game.STATE.FRUIT_BETTING;
            }
        },

        fruitWithdraw: function (betInfo) {
            var result = {
                betTotal: 0
            };

            betInfo = JSON.parse(betInfo) || {};
            var betTotal = 0;
            for (var betIndex in betInfo) {
                betTotal += betInfo[betIndex];
            }
            if (betTotal <= 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            result.betTotal = betTotal;
            this.betTotal = result.betTotal;

            this.state = Game.STATE.FRUIT_BETTING;

            return result;
        },

        betOn: function (betInfo) {
            var result = {
                errCode: null,
                fruits: {},
                rewardType: {},
                multiples: {
                    low: 10,
                    high: 20
                },
                betTotal: 0,
                bonusWin: 0
            };

            if (typeof betInfo == "string") {
                betInfo = JSON.parse(betInfo);
            }

            betInfo = betInfo || {};

            var betTotal = 0;
            for (var betIndex in betInfo) {
                betTotal += betInfo[betIndex];
            }
            if (betTotal <= 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            this.betInfo = betInfo;

            var giveLights = Logic.giveLights();
            var lightTotal = this.baseLightNum + giveLights;

            var randomFruitResult = Logic.getRandomRotaryFruits(lightTotal);
            result.fruits = randomFruitResult.fruits;
            result.rewardType = randomFruitResult.rewardType;

            result.multiples = Logic.randomMultiple();
            this.multiples = result.multiples;

            result.betTotal = betTotal;
            this.betTotal = result.betTotal;

            result.bonusWin = this.calcBonusWin(result.fruits);
            this.bonusWin = result.bonusWin;

            this.lastFruit = result.fruits;
            this.state = Game.STATE.FRUIT_RUSELT;

            return result;
        },

        calcBonusWin: function (fruitList) {
            var bonus = 0;
            this.bonusWin = 0;

            var rotaryFruits = Rotary.ROTARY_FRUITS;
            var bigTripleFruits = Rotary.BIG_TRIPLE;
            var smallTripleFruits = Rotary.SMALL_TRIPLE_ALL_FRUITS;
            var quadruple = Rotary.QUADRUPLE;

            var fruit = null;
            var fruitId = 0;
            var fruitIndex = 0;

            for (var listName in fruitList) {
                var singleFruitList = fruitList[listName];
                var length = singleFruitList.length;
                for (var index = 0; index < length; index ++) {
                    fruitIndex = singleFruitList[index];
                    fruit = rotaryFruits[fruitIndex];
                    var fruitName = fruit.fruitName;
                    var multiple = fruit.multiple;
                    var id = fruit.id;
                    var bet = Number(this.betInfo[fruitName]);

                    if (Rotary.LUCK_INDEX_LIST.indexOf(id) == -1) {
                        if (multiple <= 1) {
                            if (bigTripleFruits.indexOf(id) != -1) {
                                multiple = this.multiples.high;
                            }
                            else if (smallTripleFruits.indexOf(id) != -1) {
                                multiple = this.multiples.low;
                            }
                            else if (quadruple.indexOf(id) != -1){
                                multiple = Rotary.MULTIPLE_BY_APPLE;
                            }
                        }

                        bonus += bet * multiple;
                    }
                }
            }

            return bonus;
        },

        guessWithdraw: function (betInfo) {
            var result = {
                errCode: null
            };

            var betNum = betInfo;
            if (betNum == 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            this.betTotal = Number(betNum);
            return result;
        },

        setGuessBetting: function (bet) {
            var result = {
                errCode: null
            };

            bet = Number(bet) || 1;
            this.guessBet = bet;
            this.gameState = Game.STATE.GUESS_BETTING;

            return result;
        },

        guessTheSizeOf: function (betInfo) {
            var result = {
                errCode: null,
                randNum: 1,
                bonusWin: 0
            };

            var bonus = 0;
            var betNum = betInfo.bet;
            var betType = betInfo.betType || Rotary.GUESS_SIZE_TYPE.LOW;
            var betLimit = betNum * 2;

            if (betNum == 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            if (betNum > betLimit) {
                result.errCode = Game.ERR_CODE.EXCEED_BETS;
                return result;
            }

            var randNum = Logic.getGuessNum();
            var randType = Logic.getGuessNumType(randNum);

            if (betType == randType) {
                bonus = betNum * 2;
            }
            else {
                bonus = -betNum;
                betNum = 0;
            }

            result.bonusWin = bonus;
            this.bonusWin = bonus;

            result.randNum = randNum;

            this.betTotal = betNum;

            this.state = Game.STATE.GUESS_STOP;
            this.guessedType = betType;
            this.guessedNum = randNum;
            this.guessBet = betNum;

            return result;
        }
    });

    Game.STATE = {};
    Game.STATE.READY             = 0;
    Game.STATE.FRUIT_BETTING     = 1;
    Game.STATE.FRUIT_RUSELT      = 2;
    Game.STATE.FRUIT_ROTA_STOP   = 3;
    Game.STATE.GUESS_BETTING     = 4;
    Game.STATE.GUESS_STOP        = 5;

    Game.ERR_CODE = {
        NOT_BET: 10001, //*没有下注
        EXCEED_BETS: 10002 //*超过下注金额
    };

    Game.BET_FACTOR = [1, 5, 10, 20, 50, 100];
}(Papaya));
(function(root) {
    var Event = root.Event = function() {

    };
}(Papaya.Fruit));