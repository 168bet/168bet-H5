
var AnimationManager = (function(_super) {
    var Animations = {
         "ani.win.backGround1": {
             urls: [
                 "assets/ani/ani1/ani_cq1.png",
                 "assets/ani/ani1/ani_cq2.png",
                 "assets/ani/ani1/ani_cq3.png"
             ],
             interval: 100
         },
        //
         "ani.win.backGround2": {
             urls: [
                 "assets/ani/ani2/ani_dg1.png",
                 "assets/ani/ani2/ani_dg2.png",
                 "assets/ani/ani2/ani_dg3.png",
                 "assets/ani/ani2/ani_dg4.png",
                 "assets/ani/ani2/ani_dg5.png",
                 "assets/ani/ani2/ani_dg6.png"
             ],
             interval: 100
         },
        "ani.win.backGround3": {
            urls: [
                "assets/ani/ani3/ani_gh1.png",
                "assets/ani/ani3/ani_gh2.png",
                "assets/ani/ani3/ani_gh3.png",
                "assets/ani/ani3/ani_gh4.png",
                "assets/ani/ani3/ani_gh5.png"
            ],
            interval: 100
        },
        "ani.win.backGround4": {
            urls: [
                "assets/ani/ani4/ani_gs1.png",
                "assets/ani/ani4/ani_gs2.png",
                "assets/ani/ani4/ani_gs3.png"
            ],
            interval: 100
        },
        //
        // "ani.table.win": {
        //     urls: [
        //         "assets/ani.images/10005.png",
        //         "assets/ani.images/10006.png",
        //         "assets/ani.images/10007.png",
        //         "assets/ani.images/10008.png",
        //         "assets/ani.images/10009.png",
        //         "assets/ani.images/10010.png"
        //     ],
        //     interval: 480
        // },
        //
        // "ani.royal.flush": {
        //     urls:  [
        //         "assets/ani.images/10011.png",
        //         "assets/ani.images/10012.png",
        //         "assets/ani.images/10013.png",
        //         "assets/ani.images/10014.png",
        //         "assets/ani.images/10015.png"
        //     ],
        //     interval: 480
        // },
        //
        // "ani.blink.star": {
        //     urls: [
        //         "assets/ani.images/10016.png",
        //         "assets/ani.images/10017.png"
        //     ],
        //     interval: 480
        // },
        //
        // "ani.table.five": {
        //     urls: [
        //         "assets/ani.images/10018.png",
        //         "assets/ani.images/10019.png"
        //     ],
        //     interval: 480
        // },
        // "ani.double.light": {
        //     urls: [
        //         "assets/ani.images/10020.png",
        //         "assets/ani.images/10021.png"
        //     ],
        //     interval: 480
        // }
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

            Laya.Animation.createFrames(urls, name);
        }

        callback && callback();
    };

    AnimationManager.prototype.get = function(name) {
        var urls = Animations[name].urls;
        var anim = new Laya.Animation();
        var interval = Animations[name] && Animations[name].interval || 30;

        anim._play = anim.play;
        anim._name = name;
        anim.interval = interval;
        anim.play = function() {
            this._play(0, true, this._name);
        };

        // var bounds = anim.getGraphicBounds();
        // anim.pivot(bounds.width / 2, bounds.height / 2);
        // anim.interval = interval;

        return anim;
    };

    return AnimationManager;
}(laya.events.EventDispatcher));