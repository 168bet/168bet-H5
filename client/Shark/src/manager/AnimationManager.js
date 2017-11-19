
var AnimationManager = (function(_super) {
    var Animations = {
        //"1001": {
        //    url: "assets/ani/1001/1001.json"
        //},
        //
        //"1002": {
        //    url: "assets/ani/1002/1002.json"
        //},

        "1003": {
            url: "assets/ani/1003/1003.json"
        },

        "1004": {
            url: "assets/ani/1004/1004.json"
        },

        "1005": {
            url: "assets/ani/1005/1005.json"
        },

        "1006": {
            url: "assets/ani/1006/1006.json"
        },

        "1007": {
            url: "assets/ani/1007/1007.json"
        },

        "1008": {
            url: "assets/ani/1008/1008.json"
        },

        "1009": {
            url: "assets/ani/1009/1009.json"
        },

        "1010": {
            url: "assets/ani/1010/1010.json"
        },

        "1011": {
            url: "assets/ani/1011/1011.json"
        },

        "1012": {
            url: "assets/ani/1012/1012.json"
        },

        "1013": {
            url: "assets/ani/1013/1013.json"
        },

        "1014": {
            url: "assets/ani/1014/1014.json"
        },

        "1015": {
            url: "assets/ani/1015/1015.json"
        },

        "1016": {
            url: "assets/ani/1016/1016.json"
        },

        "1017": {
            url: "assets/ani/1017/1017.json"
        },

        "1017eat": {
            url: "assets/ani/1017eat/1017eat.json"
        },

        "1018": {
            url: "assets/ani/1018/1018.json"
        },

        "1019": {
            url: "assets/ani/1019/1019.json"
        },

        "lighter": {
            url: "assets/ani/lighter/lighter.json"
        },

        "starEffect": {
            url: "assets/ani/starEffect/starEffect.json"
        },

        "runNowEffect": {
            url: "assets/ani/runNowEffect/runnowEffect.json"
        },

        //"1020": {
        //    url: "assets/ani/1020/1020.json"
        //},
        //
        //"1021": {
        //    url: "assets/ani/1021/1021.json"
        //},
        //
        //"1022": {
        //    url: "assets/ani/1022/1022.json"
        //},
    };

    var animationsCache = [];

    var AnimationManager = function() {
        AnimationManager.super(this);
    };

    Laya.class(AnimationManager, "AnimationManager", _super);

    AnimationManager.prototype.initByFrames = function(callback) {
        var keys = Object.keys(Animations);
        for (var i = 0, size = keys.length; i < size; i++) {
            var name = keys[i];
            var urls = Animations[name].urls;

            Laya.Animation.createFrames(urls, name);
        }

        callback && callback();
    };

    AnimationManager.prototype.initByJson = function(cb) {
        //var self = this;
        var loadCount = 0;
        var keys = Object.keys(Animations);
        //var total = keys.length;

        var iterator = function(key,callBack) {

            var createAnimation = function() {
                var ani = new Laya.Animation();
                ani.loadAtlas(Animations[key].url,null,key);
                ++loadCount;
                if(loadCount >= keys.length)
                {
                    //self.event(AnimationManager.Event.INITED);
                    cb && cb();
                }
                //self.event(AnimationManager.Event.PROGRESS,loadCount/total);
                callBack(null);
            };

            Laya.loader.load(Animations[key].url, Laya.Handler.create(this, createAnimation), null, Laya.Loader.ATLAS);

        };

        async.eachSeries(keys, iterator, function(err) {
            if (err != null) {
            }
        });
    };


    AnimationManager.prototype.get = function(id) {
        var fish;
        for(var index in animationsCache)
        {
            fish = animationsCache[index];
            if(fish.getId() == id && fish.getIsFree())
            {
                return fish;
            }
        }

        var url = Animations[id].url;
        var ani = new Laya.Animation();
        ani.loadAtlas(url,null,id);
        ani.interval = 100;
        ani.index = 0;
        fish = new Fish(ani,id,url);
        animationsCache.push(fish);

        return fish;
    };

    AnimationManager.prototype.resetAllFish = function() {
        var fish;
        for(var index in animationsCache)
        {
            fish = animationsCache[index];
            fish.dispose();
        }
    };

    AnimationManager.Event = {};
    AnimationManager.Event.PROGRESS = "ani_progress";
    AnimationManager.Event.INITED = "ani_inited";

    return AnimationManager;
}(laya.events.EventDispatcher));