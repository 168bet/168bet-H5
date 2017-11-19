
var AnimationManager = (function(_super) {
    var Animations = {
        "ani.jackpot.light": {
            urls: [
                "assets/effects/10001/10001_1.png",
                "assets/effects/10001/10001_2.png"
            ],
            interval: 480
        },

        "ani.middlepoker.light": {
            urls: [
                "assets/effects/10002/10002_1.png",
                "assets/effects/10002/10002_2.png"
            ],
            interval: 480
        },

        "ani.doublepoker.light": {
            urls: [
                "assets/effects/10003/10003_1.png",
                "assets/effects/10003/10003_2.png"
            ],
            interval: 480
        },

        "ani.double.BoSize": {
            urls: [
                "assets/ui.double/ani_BoSize_1.png",
                "assets/ui.double/ani_BoSize_2.png"
            ],
            interval: 480
        },

        "ani.jackpot": {
            urls: [
                "assets/ui.common/jackPot1.png",
                "assets/ui.common/jackPot2.png"
            ],
            interval: 480
        }
    };

    var AnimationManager = function() {
        AnimationManager.super(this);
    };

    Laya.class(AnimationManager, "AnimationManager", _super);

    AnimationManager.prototype.init = function(callback) {
        var keys = Object.keys(Animations);
        for (var i = 0, size = keys.length; i < size; i++) {
            var name = keys[i];
            var urls = Animations[name].urls;
            var anim = new Laya.Animation();

            anim.loadImages(urls, name);
        }

        callback && callback();
    };

    AnimationManager.prototype.get = function(name) {
        var anim = new Laya.Animation();
        var interval = Animations[name] && Animations[name].interval || 30;

        anim._play = anim.play;
        anim._name = name;
        anim.interval = interval;
        anim.play = function() {
            this._play(0, true, this._name);
        };

        return anim;
    };

    return AnimationManager;
}(laya.events.EventDispatcher));