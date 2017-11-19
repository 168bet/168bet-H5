/*! Shark 2017-03-09 */
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
(function(root) {
    /**
     * Game Constants
     */
    Papaya.Shark = {};
    Papaya.Shark.MaxFish = 8;
}(Papaya));
(function(root) {
     var _super = root.Game;
    root.Shark.list_1 = [
        //{id: 1001, name: "小虫鱼", rate: 2, weight: 88, colorId:2, speed:1.3, scale:0.8},
        //{id: 1002, name: "草鱼", rate: 2, weight: 88, colorId:2, speed:1.5, scale:0.8},
        {id: 1003, name: "鲽鱼", rate: 2, weight: 88, colorId:2, speed:1.5, scale:0.8},
        {id: 1004, name: "气泡鱼", rate: 3, weight: 59, colorId:2, speed:1.5, scale:0.8},
        {id: 1005, name: "灯笼鱼", rate: 3, weight: 59, colorId:6, speed:1.6, scale:0.8},
        {id: 1006, name: "条纹鱼", rate: 3, weight: 59, colorId:2, speed:1.6, scale:0.8},
        {id: 1007, name: "河豚鱼", rate: 4, weight: 44, colorId:3, speed:1.6, scale:0.8},
        {id: 1008, name: "小丑鱼", rate: 4, weight: 44, colorId:3, speed:1.6, scale:0.8},
        {id: 1009, name: "蓝宝石", rate: 4, weight: 44, colorId:3, speed:1.7, scale:0.6},
        {id: 1010, name: "金枪鱼", rate: 5, weight: 35, colorId:6, speed:1.7, scale:0.8},
        {id: 1011, name: "乌龟", rate: 5, weight: 35, colorId:6, speed:1.8, scale:0.8},
        {id: 1012, name: "孔雀鱼", rate: 5, weight: 35, colorId:6, speed:1.8, scale:0.8},
        {id: 1013, name: "蝴蝶鱼", rate: 6, weight: 29, colorId:1, speed:1.8, scale:0.8},
        {id: 1014, name: "神仙鱼", rate: 6, weight: 29, colorId:1, speed:1.8, scale:0.8}
    ];

    root.Shark.list_2 = [
        {id: 1015, name: "青蛙",  rate: 7, weight: 25, colorId:4, speed:2, scale:0.6},
        {id: 1016, name: "蝙蝠鱼", rate: 12, weight: 9, colorId:4, speed:2, scale:0.8},
        {id: 1018, name: "银龙鱼", rate: 20, weight: 5, colorId:4, speed:2, scale:0.8},
        {id: 1019, name: "金龙鱼", rate: 25, weight: 4, colorId:5, speed:2, scale:0.8},
        //{id: 1020, name: "金龙",  rate: 30, weight: 3, colorId:5, speed:2, scale:0.8}
    ];

    var Game = root.Shark.Game = function (opts) {
        opts = opts || {};
        Game.super(this, opts);
        this.id             = root.Game.ID_SHARK;

        // 玩家金币
        //this.playerScore = App.player.balance;

        // 赢取的金币
        this.winScore = opts.winScore || 0;

        // 上一局的下注信息
        this.lastBetInfo = {};

        // 每一局的记录（保存16局）,记录的是每一局最后剩下的小鱼ID
        this.recordHistory = opts.recordHistory || [];

        // 局数
        this.currentGameTime = opts.currentGameTime || 0;

        // 鱼池
        this.fishPool = opts.fishPool || [];

        // 倒计时
        this.countDownTime = 15;

        // 下注金额范围
        this.betScoreRange = [1,10,20,50,100];
        this.betIndex = 2;
        // 下注的金币
        this.betScore = this.betScoreRange[this.betIndex];

        // 玩家选择的信息
        this.playerSelectInfo = opts.playerSelectInfo || {};

        // 幸存的小鱼ID
        this.surviveFish = 0;

        this.initEvent();
        this.init();
    };

    root.inherits(Game, _super);
    
    var __proto = Game.prototype;

    __proto.initEvent = function() {
    };

    __proto.init = function() {

    };

    // 一局的准备
    __proto.ready = function() {
        var i;
        var obj = {};
        obj.dataSource = {};
        obj.colorBgSource = {};
        var list_1_count = Math.floor(Math.random() * 2) + 6;
        if (list_1_count > 7) {
            list_1_count = 7;
        }

        var id;
        var list1 = JSON.parse(JSON.stringify(root.Shark.list_1));
        var list2 = JSON.parse(JSON.stringify(root.Shark.list_2));
        this.fishPool = [];
        var currentList;

        for(i = 0 ; i < Papaya.Shark.MaxFish ; i++)
        {
            if(i < list_1_count)
            {
                currentList = list1;
            }
            else
            {
                currentList = list2;
            }

            id = Math.floor(Math.random() * currentList.length);
            if (id < 0 || id >= currentList.length) {
                id = 0;
            }

            obj.dataSource["bet"+(i+1)] = "A"+currentList[id].rate;
            obj.dataSource["squareBet"+(i+1)] = "A"+currentList[id].rate;
            obj.colorBgSource[(i+1)] = currentList[id].colorId;
            this.fishPool.push(currentList.splice(id, 1)[0]);
        }

        this.countDownTime = 20;
        this.winScore = 0;
        this.currentGameTime += 1;

        //obj.dataSource["goldLab"] = this.playerScore;
        obj.dataSource["countDownLab"] = this.countDownTime;
        obj.dataSource["betCount"] = this.betScoreRange[this.betIndex];
        obj.dataSource["winReward"] = this.winScore;

        return obj;
    };

    // 一局的开始
    //__proto.restart = function() {
    //
    //    this.countDownTime = 20;
    //    this.winScore = 0;
    //    this.currentGameTime += 1;
    //    this.playerSelectInfo = {};
    //    var dataSource = {
    //        goldLab:this.playerScore,
    //        winReward:this.winScore,
    //        betCount:this.betScoreRange[this.betIndex],
    //        countDownLab:this.countDownTime
    //    }
    //
    //    return dataSource;
    //    // this.startCD();
    //};

    //__proto.startCD = function() {
    //
    //    var self = this;
    //
    //     var timeLoop= function() {
    //        self.countDownTime -= 1;
    //        var cdStr;
    //        if(self.countDownTime <= 0)
    //        {
    //            self.countDownTime = 0;
    //            cdStr = 0;
    //            self.timesUp();
    //        }
    //        else if(self.countDownTime < 10 && self.countDownTime > 0)
    //        {
    //            cdStr = "0"+self.countDownTime;
    //            self.timeOut = setTimeout(timeLoop,1000);
    //        }
    //        else
    //        {
    //            cdStr = self.countDownTime;
    //            self.timeOut = setTimeout(timeLoop,1000);
    //        }
    //        self.setDataSource({"countDownLab":cdStr});
    //    };
    //
    //    this.timeOut = setTimeout(timeLoop,1000);
    //};

    __proto.runNow = function(clientSelectInfo) {
        if (typeof clientSelectInfo == "string") {
            clientSelectInfo = JSON.parse(clientSelectInfo.toString());
        }
        
        // clearTimeout(this.timeOut);
        return this.timesUp(clientSelectInfo);
    };

    __proto.timesUp = function(clientSelectInfo) {
        var index = Papaya.Utils.calcWeight(this.fishPool);
        var fishId;
        var betCount = 0;
        this.surviveFish = this.fishPool[index].id;//this.fishPool[index];
        var fishRate = this.fishPool[index].rate;
        for(fishId in clientSelectInfo)
        {
            betCount += clientSelectInfo[fishId].betCount;
        }

        var isClearRecordHistory = false;
        var data = {};
        for(fishId in clientSelectInfo)
        {
            if(this.surviveFish == fishId)
            {
                this.winScore = clientSelectInfo[fishId].betCount * clientSelectInfo[fishId].betMultiple;
                //this.playerScore += this.winScore;
                break;
            }
        }

        if(this.currentGameTime > 16)
        {
            //this.clearRecordHistory();
            isClearRecordHistory = true;
            this.currentGameTime = 1;
            this.recordHistory = [];
        }

        this.recordHistory[this.currentGameTime] = this.surviveFish;

        //for(fishId in this.playerSelectInfo)
        //{
        //    this.lastBetInfo[fishId] = this.playerSelectInfo[fishId];
        //}

        //data.dataSource = {winReward:this.winScore,goldLab:this.playerScore};
        this.betCount = betCount;

        data.winReward = this.winScore;
        data.betCount = betCount;
        data.surviveRate = fishRate;
        data.clearRecordHistory = isClearRecordHistory;
        data.currentGameTime = this.currentGameTime;
        data.recordHistory = this.recordHistory[this.currentGameTime];
        data.surviveFish = this.surviveFish;
        return data;
    };

    //__proto.gameEnd = function() {
    //    var isClearRecordHistory = false;
    //    var data = {};
    //    //var selectIndex;
    //    var fishId;
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        if(this.surviveFish == fishId)
    //        {
    //            this.winScore = this.playerSelectInfo[fishId].betCount * this.playerSelectInfo[fishId].betMultiple;
    //            this.playerScore += this.winScore;
    //            //selectIndex = index;
    //            break;
    //        }
    //    }
    //
    //
    //    if(this.currentGameTime > 16)
    //    {
    //        //this.clearRecordHistory();
    //        isClearRecordHistory = true;
    //        this.currentGameTime = 1;
    //        this.recordHistory = [];
    //    }
    //
    //    this.recordHistory[this.currentGameTime] = this.surviveFish;
    //
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        this.lastBetInfo[fishId] = this.playerSelectInfo[fishId];
    //    }
    //
    //
    //    //this.lastBetInfo = {betScore:this.betScore,select:this.playerSelect[selectIndex],selectBet:this.playerSelectBet[selectIndex]};
    //
    //    data.dataSource = {winReward:this.winScore};
    //    data.clearRecordHistory = isClearRecordHistory;
    //    data.currentGameTime = this.currentGameTime;
    //    data.recordHistory = this.recordHistory[this.currentGameTime];
    //
    //    return data;
    //
    //    //this.setRecordHistory();
    //    //this.setDataSource({winReward:this.winScore});
    //
    //};

    // 下注不能大于本金，所以这里重新计算一下
    //__proto.setBetScoreRange = function() {
    //    var maxBetScoreRange = this.betScoreRange[this.betScoreRange.length -1];
    //    var resultRange = [];
    //    if(this.playerScore >= maxBetScoreRange)
    //    {
    //        return this.betScoreRange.concat();
    //    }
    //    else
    //    {
    //        for(var index in this.betScoreRange)
    //        {
    //            var bet = this.betScoreRange[index];
    //            if(bet < this.playerScore)
    //            {
    //                resultRange.push(bet);
    //            }
    //        }
    //    }
    //
    //    return resultRange;
    //};
    //
    //// 加注
    //__proto.raise = function() {
    //
    //    var betScoreRange = this.setBetScoreRange();
    //
    //    this.betIndex += 1;
    //    if(this.betIndex > betScoreRange.length -1)
    //    {
    //        this.betIndex = 0;
    //    }
    //    this.betScore = betScoreRange[this.betIndex];
    //    //this.setDataSource({betCount:this.betScore});
    //
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource.betCount = this.betScore;
    //    return dataSource;
    //};
    //
    //// 减注
    //__proto.unRaise = function() {
    //    var betScoreRange = this.setBetScoreRange();
    //
    //    this.betIndex -= 1;
    //    if(this.betIndex < 0)
    //    {
    //        this.betIndex = betScoreRange.length - 1;
    //    }
    //    this.betScore = betScoreRange[this.betIndex];
    //    //this.setDataSource({betCount:this.betScore});
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource.betCount = this.betScore;
    //    return dataSource;
    //};
    //
    //// 选取
    //__proto.select = function(index) {
    //    var fish = this.fishPool[index];
    //    var fishId = fish.id;
    //    if(!this.playerSelectInfo[fishId])
    //    {
    //        this.playerSelectInfo[fishId] = {};
    //        this.playerSelectInfo[fishId].betCount = 0;
    //    }
    //
    //    this.playerSelectInfo[fishId].betMultiple = fish.rate;
    //    this.playerSelectInfo[fishId].betCount += this.betScore;
    //    this.playerSelectInfo[fishId].index = index+1;
    //
    //    if(this.playerSelectInfo[fish.id].betCount > 100)
    //    {
    //        this.playerSelectInfo[fish.id].betCount = 100;
    //    }
    //
    //    var allBetCount = 0;
    //    for(var id in this.playerSelectInfo)
    //    {
    //        allBetCount += this.playerSelectInfo[id].betCount;
    //    }
    //
    //    if(allBetCount > this.playerScore)
    //    {
    //        this.playerSelectInfo[fishId].betCount = 0;
    //    }
    //
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource["fishBet"+(index+1)] = this.playerSelectInfo[fishId].betCount;
    //
    //    return dataSource;
    //
    //
    //    //if(this.playerSelect[index])
    //    //{
    //    //    this.playerSelect[index] = null;
    //    //    this.playerSelectBet[index] = null;
    //    //}
    //    //else
    //    //{
    //    //    var fishId = this.fishPool[index];
    //    //    this.playerSelect[index] = fishId;
    //    //    this.playerSelectBet[index] = FishBet[fishId].bet;
    //    //}
    //
    //    // this.playerSelect = this.fishPool[index];
    //    // this.playerSelectBet = FishBet[index].bet;
    //};
    //
    //__proto.clearBet = function() {
    //    //this.betScore = 0;
    //    //this.setDataSource({"betCount":this.betScore});
    //    //this.playerSelect = [];
    //    //this.playerSelectBet = [];
    //
    //    for(var fishId in this.playerSelectInfo)
    //    {
    //        this.playerSelectInfo[fishId] = null;
    //    }
    //    this.playerSelectInfo = {};
    //
    //    var playerScore = this.playerScore;
    //
    //    return {goldLab:playerScore};
    //    //this.setDataSource();
    //};
    //
    //__proto.allBet = function() {
    //    var index;
    //    this.playerSelectInfo = {};
    //    var retData ;
    //    var goldLab;
    //    var dataSource = {};
    //    for(index = 0 ; index < this.fishPool.length ; index++)
    //    {
    //        retData = this.select(index);
    //        dataSource["fishBet"+(index+1)] = retData["fishBet"+(index+1)];
    //        goldLab = retData["goldLab"];
    //    }
    //
    //    dataSource["goldLab"] = goldLab;
    //    return dataSource;
    //};
    //
    //
    //__proto.rebet = function() {
    //    // 当前的下注信息和上一局的下注信息要分开，如果当前本金小于上一局的下注总额，那就保持当前下注
    //    var currentData = {};
    //    var lastBetData = {};
    //    var resultData = null;
    //    var info;
    //    var allBetCount = 0;
    //    var fishId;
    //    var data = {};
    //
    //    for(fishId in this.lastBetInfo)
    //    {
    //        info = this.lastBetInfo[fishId];
    //
    //    }
    //    data.selectIndex = [];
    //
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        currentData["fishBet"+ this.playerSelectInfo[fishId].index] = this.playerSelectInfo[fishId].betCount;
    //    }
    //
    //    for(fishId in this.lastBetInfo)
    //    {
    //        info = this.lastBetInfo[fishId];
    //        allBetCount += info.betCount;
    //        lastBetData["fishBet"+ info.index] = info.betCount;
    //    }
    //
    //
    //    if(allBetCount > this.playerScore)
    //    {
    //        resultData = currentData;
    //    }
    //    else
    //    {
    //        // 可以用上一局的下注信息就把当前下注信息清空，并更新当前下注信息为上一局的下注信息
    //        resultData = lastBetData;
    //        for(fishId in this.playerSelectInfo)
    //        {
    //            this.playerSelectInfo[fishId] = null;
    //        }
    //        this.playerSelectInfo = {};
    //
    //        for(fishId in this.lastBetInfo)
    //        {
    //            this.playerSelectInfo[fishId] = this.lastBetInfo[fishId];
    //            data.selectIndex.push(this.playerSelectInfo[fishId].index);
    //        }
    //
    //    }
    //
    //    data.dataSource = resultData;
    //    data.dataSource.goldLab = this.upgradeViewGold();
    //    return data;
    //    //if(this.lastBetInfo != null)
    //    //{
    //    //    //this.playerSelect = this.lastBetInfo.select;
    //    //    //this.playerSelectBet = this.lastBetInfo.selectBet;
    //    //    this.betScore = this.lastBetInfo.betScore;
    //    //    //var index = this.fishPool.indexOf(this.playerSelect);
    //    //    //this.lastBetInfo.index = index;
    //    //    return {betCount:this.betScore};
    //    //    //this.setDataSource();
    //    //}
    //    //return null;
    //};
    //
    //// 更新界面上的金币数量，但是不会影响实际金币，实际金币只会在倒计时时间结束后才会扣取
    //__proto.upgradeViewGold = function() {
    //    var playerScore = this.playerScore;
    //    var betScore = 0;
    //    var info;
    //    for(var fishId in this.playerSelectInfo)
    //    {
    //        info = this.playerSelectInfo[fishId];
    //        betScore += info.betCount;
    //    }
    //
    //    var newPlayerScore = playerScore - betScore;
    //    return newPlayerScore;
    //    //return {goldLab:newPlayerScore};
    //    //this.setDataSource({goldLab:newPlayerScore});
    //};

} (Papaya));