/*! DiamondDeal 2017-03-29 */
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
    /**
     * Game Constants
     */
    Papaya.DiamondDeal = {};
    Papaya.MaxDiamond = 10;
    Papaya.Block_Type = {};
    Papaya.Block_Type.Nothing = "nothing";
    Papaya.Block_Type.Diamond = "diamond";

    Papaya.Game_End_Type = {};
    Papaya.Game_End_Type.Life = "life";
    Papaya.Game_End_Type.Diamond = "Diamond";


    Papaya.Block_State = {};
    Papaya.Block_State.Open = "open";
    Papaya.Block_State.Close = "close";

}(Papaya));
(function(root) {

    var Utils = Papaya.Utils;

    //基础奖励阈值
    var BASE_REWARD = 0.38;

    //系统回收阈值
    var POW_BASE = 0.97;

    var Logic = root.Logic = function() {
    };

    Logic.calculateReward = function(bet,diamondLeft,gridLeft) {
        //已收集的钻石量
        var diamondCollected = 10 - diamondLeft;
        //当前情况下选中钻石的概率
        var rate = diamondLeft/gridLeft;
        //奖励计算 （当前奖励额【相当于投入的赌注】 * BASE_REWARD * (POW_BASE^以获取的钻石量) / 抽中概率
        var reward = (bet * BASE_REWARD * Math.pow(POW_BASE, diamondCollected) / rate).toFixed(2);

        return Number(reward);

    };

    Logic.calTotalReward = function(bet,gridLeft){
        var total = 0;
        bet = 1;
        var currentBet = bet;
        var resultBet;
        for(var diamond = 10 ; diamond > 0 ; diamond--)
        {
            resultBet = this.calculateReward(currentBet,diamond,gridLeft);
            currentBet = resultBet;
            total += resultBet;
        }
        return Math.round(Number(total));
    };

    Logic.calculateLeftBet = function(currentReward,lifeLeft){
        var leftReward = currentReward * (1 - 0.25 * (4 - lifeLeft));
        return leftReward == 0?0:leftReward.toFixed(2);
    };


}(Papaya.DiamondDeal));
(function(root) {
    var _super = root.Game;
    var Logic = root.DiamondDeal.Logic;
    var Utils = Papaya.Utils;
    var blocks = [];

    var Game = root.DiamondDeal.Game = function (opts) {
        opts = opts || {};
        Game.super(this, opts);
        this.id             = root.Game.ID_DIAMONDDEAL;

        //this.account = opts.account || 10000;
        this.rate = opts.rate || 0;
        this.diamondLeft = opts.diamondLeft || Papaya.MaxDiamond;
        this.life = opts.life || 4;
        this.currentBet = opts.currentBet || 1;
        this.currentReward = opts.currentReward || 0;
        this.totalReward = opts.totalReward || 0;
        this.maxGrid = opts.maxGrid || 50;

        this.nextReward = opts.nextReward || 0;

        this.record = opts.record || {};

        this.gameStep = opts.gameStep || Game.Step.game_Init;

    };

    root.inherits(Game, _super);
    
    var __proto = Game.prototype;

    __proto.initBlock = function() {
        for(var r = 0 ; r < 5 ; r++)
        {
            blocks[r] = [];
            for(var c = 0 ; c < 10 ; c++)
            {
                var obj = {type:Papaya.Block_Type.Nothing , state:Papaya.Block_State.Close};
                blocks[r][c] = obj;
            }
        }
    };

    __proto.getRecord = function() {

        if(this.gameStep != Game.Step.game_Running)
        {
            return {nothing:true};
        }

        this.initBlock();

        var resultViewData = {};
        for(var key in this.record)
        {
            if(key == "blocks")
            {
                for(var blockKey in this.record[key])
                {
                    var data = this.record[key][blockKey];
                    blocks[data.pos.row][data.pos.column].state = data.state;
                    blocks[data.pos.row][data.pos.column].type = data.selectType;

                    if(!resultViewData.blockOpened)
                    {
                        resultViewData.blockOpened = [];
                    }
                    resultViewData.blockOpened.push({
                        pos:{r:data.pos.row,c:data.pos.column},
                        state:data.state,
                        type:data.selectType
                    });
                }
            }
            else if(key == "viewData")
            {
                for(var viewDataKey in this.record["viewData"])
                {
                    resultViewData[viewDataKey] = this.record["viewData"][viewDataKey];
                }
            }
        }

        this["currentReward"] = this.record["currentReward"] || this["currentReward"];
        this["nextReward"] = this.record["nextReward"] || this["nextReward"];
        this["totalReward"] = this.record["totalReward"] || this["totalReward"];

        this["life"] = this.record["life"] || this["life"];
        resultViewData["life"] = this.record["life"] || this["life"];

        this["diamondLeft"] = this.record["diamondLeft"] || this["diamondLeft"];
        resultViewData["diamondLeft"] = this.record["diamondLeft"] || this["diamondLeft"];

        this["rate"] = this.record["rate"] || this["rate"];
        resultViewData["rate"] = this.record["rate"] || this["rate"];

        resultViewData.blocks = blocks.concat();

        return resultViewData;
    };

    __proto.gameStart = function(bet) {

        this.gameStep = Game.Step.game_Running;

        this.diamondLeft = Papaya.MaxDiamond;
        this.life = 4;
        this.currentBet = 1;
        this.rate = bet;
        this.currentReward = 0;
        this.maxGrid = 50;
        this.record = {};

        this.initBlock();

        this.nextReward = Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
        this.totalReward = Logic.calTotalReward(this.currentBet,this.maxGrid);

        this.viewNextReward = Math.round(this.nextReward*this.rate);
        this.viewCurrentReward = Math.round(this.currentReward*this.rate);
        this.viewTotalReward = Math.round(this.totalReward*this.rate);

        var resultData = {};
        resultData.dataSource = {
            diamondLeft: this.diamondLeft,
            nextWinReward: this.viewNextReward,//Utils.transform_Font_Type(this.viewNextReward),
            totalReward:  this.viewTotalReward//Utils.transform_Font_Type(this.viewTotalReward)
            //account:Utils.transform_Font_Type(this.account)
        };
        resultData.life = this.life;
        resultData.blocks = blocks.concat();

        this.setRecord({r:0,c:0,selectType:Papaya.Block_Type.Nothing,state:Papaya.Block_State.Close});
        return resultData;
    };

    __proto.select = function(pos) {
        var row = Math.floor(pos.y/99);
        var column = Math.floor(pos.x/99);

        var data = blocks[row][column];

        if(data.state == Papaya.Block_State.Open)
        {
            return null;
        }

        var probability = 0.05*this.diamondLeft/this.life;
        var ran = Math.random();
        if(ran <= probability)
        {
            data.type = Papaya.Block_Type.Diamond;
            this.life = 4;
            this.currentReward =  Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
            this.currentBet = this.currentReward;
            this.diamondLeft -= 1;
            //console.log("diamond currentReward = " + this.currentReward);
        }
        else
        {
            data.type = Papaya.Block_Type.Nothing;
            this.life -= 1;
            this.currentReward = this.currentReward==0?0:Logic.calculateLeftBet(this.currentBet,this.life);
            //this.currentBet = this.currentReward || this.startBet;
            //console.log("null currentReward = " + this.currentReward);
        }


        data.state = Game.Block_State.Open;
        this.maxGrid -= 1;

        this.nextReward = Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
        this.totalReward = Logic.calTotalReward(this.currentBet,this.maxGrid);

        var resultData = {};
        resultData.dataSource = {};
        resultData.gameEndType = "";
        if(this.life <= 0)
        {
            resultData.gameEndType = Papaya.Game_End_Type.Life;
            this.nextReward = 0;
            this.gameStep = Game.Step.game_End;
        }

        if(this.diamondLeft <= 0)
        {
            resultData.gameEndType = Papaya.Game_End_Type.Diamond;
            resultData.endReward = this.viewCurrentReward;//Utils.transform_Font_Type(this.viewCurrentReward);
            this.gameStep = Game.Step.game_End;
        }

        // 界面显示的数据
        this.viewNextReward = Math.round(this.nextReward*this.rate);
        this.viewCurrentReward = Math.round(this.currentReward*this.rate);
        this.viewTotalReward = Math.round(this.totalReward*this.rate);
        //console.log("viewCurrentReward = " + this.viewCurrentReward);

        resultData.selectType = data.type;
        resultData.pos = {r:row,c:column};
        resultData.life = this.life;
        resultData.dataSource.nextWinReward = this.viewNextReward;//Utils.transform_Font_Type(this.viewNextReward);
        resultData.dataSource.totalReward = this.viewTotalReward;//Utils.transform_Font_Type(this.viewTotalReward);
        resultData.dataSource.diamondLeft = this.diamondLeft;
        resultData.dataSource.winReward = this.viewCurrentReward;//Utils.transform_Font_Type(this.viewCurrentReward);

        this.setRecord({r:row,c:column,selectType:data.type,state:data.state});

        return resultData;
    };

    __proto.setRecord = function(data) {

        // 客户端服务器通用数据
        if(!this.record.blocks)
        {
            this.record.blocks = [];
        }

        var blockData = {};
        blockData.pos = {row:data.r,column:data.c};
        blockData.selectType = data.selectType;
        blockData.state = data.state;
        this.record.blocks.push(blockData);

        this.record.life = this.life;
        this.record.diamondLeft = this.diamondLeft;
        this.record.rate = this.rate;


        // 界面需要显示的数据
        if(!this.record.viewData)
        {
            this.record.viewData = {};
        }

        this.record.viewData.viewNextReward = this.viewNextReward;
        this.record.viewData.viewCurrentReward = this.viewCurrentReward;
        this.record.viewData.viewTotalReward = this.viewTotalReward;

        // 底层需要的数据
        this.record.currentReward = this.currentReward;
        this.record.nextReward = this.nextReward;
        this.record.totalReward = this.totalReward;

    };

    __proto.cashOut = function() {
        //this.account += Math.round(this.currentReward*this.rate);
        this.gameStep = Game.Step.game_End;
        var resultData = {};
        resultData.dataSource = {};
        resultData.dataSource.endReward = (this.currentReward*this.rate);//Utils.transform_Font_Type(this.currentReward*this.rate);
        //resultData.dataSource.account = Utils.transform_Font_Type(this.account);
        this.record = {};
        return resultData;
    };

    __proto.quickPick = function() {
        var tempBlocks = this.getBlockByNeed("state",Game.Block_State.Open);
        //for(var i = 0 ; i < 50 ; i++)
        //{
        //    tempBlocks.push(i);
        //}
        var resultData = [];
        var self = this;
        var recursive = function() {
            if(self.life <= 0 || self.diamondLeft == 0)
            {

            }
            else
            {
                var randomIndex = Utils.random_number(tempBlocks.length);
                //console.log("randomIndex = " + randomIndex);
                //console.log("tempBlocks = " + JSON.stringify(tempBlocks));
                var randomBlock = tempBlocks[randomIndex];
                //console.log("randomBlock = " + randomBlock);
                tempBlocks.splice(randomIndex,1);
                var strBlock = String(randomBlock);

                var row;
                var column;
                if(strBlock.length == 1)
                {
                    row = 0;
                    column = Number(strBlock);
                }
                else if(strBlock.length == 2)
                {
                    row = Number(strBlock[0]);
                    column = Number(strBlock[1]);
                }
                //console.log("column = " + column + " row = " + row + " strBlock.length = " + strBlock.length + " strBlock = " + strBlock);
                var selectData = self.select({x:column*99,y:row*99});
                console.log("selectData :");
                console.log(selectData);
                resultData.push(selectData);
                if(selectData.selectType != Papaya.Block_Type.Diamond)
                {
                    recursive();
                }
            }
        };

        recursive();

        return resultData;
    };

    __proto.getBlockByNeed = function(key,value) {
        var block;
        var resultBlocks = [];
        var pos;
        for(var i = 0 ; i < 50 ; i++)
        {
            pos = this.stringToPos(i);
            block = blocks[pos.r][pos.c];
            if(block[key] != value)
            {
                resultBlocks.push(i);
            }
        };
        return resultBlocks;
    };

    __proto.stringToPos = function(str)
    {
        str = String(str);
        var row;
        var column;
        if(str.length == 1)
        {
            row = 0;
            column = Number(str);
        }
        else if(str.length == 2)
        {
            row = Number(str[0]);
            column = Number(str[1]);
        }

        return {r:row,c:column};
    };


    Game.Block_State = {};
    Game.Block_State.Open = "open";
    Game.Block_State.Close = "close";

    Game.Step = {};
    Game.Step.game_Init = "gameInit";
    Game.Step.game_Running = "gameRunning";
    Game.Step.game_End = "gameEnd";
} (Papaya));