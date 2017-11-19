
var AnimationManager = (function(_super) {
    var Animations = {
        "ani.btn.goEffect": {
            urls: [
                "assets/ani.images/go0001.png",
                "assets/ani.images/go0002.png",
                "assets/ani.images/go0003.png",
                "assets/ani.images/go0004.png",
                "assets/ani.images/go0005.png",
                "assets/ani.images/go0006.png"
            ],
            interval: 120
        },

        "ani.btn.lightMoveEffect": {
            urls: [
                "assets/ani.images/lanses0001.png",
                "assets/ani.images/lanses0002.png",
                "assets/ani.images/lanses0003.png",
                "assets/ani.images/lanses0004.png",
                "assets/ani.images/lanses0005.png",
                "assets/ani.images/lanses0006.png",
                "assets/ani.images/lanses0007.png"
            ],
            interval: 100
        },

        "ani.blueLucky.rotate": {
            urls: [
                "assets/ani.images/blue_lucky_rota_1.png",
                "assets/ani.images/blue_lucky_rota_2.png",
                "assets/ani.images/blue_lucky_rota_3.png"
            ],
            interval: 120
        },

        "ani.goldenLucky.rotate": {
            urls: [
                "assets/ani.images/golden_lucky_rota_1.png",
                "assets/ani.images/golden_lucky_rota_2.png",
                "assets/ani.images/golden_lucky_rota_3.png"
            ],
            interval: 120
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