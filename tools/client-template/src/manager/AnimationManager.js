
var AnimationManager = (function(_super) {
    var Animations = {
        // "ani.poker.blink": {
        //     urls: [
        //         "assets/ani.images/10001.png",
        //         "assets/ani.images/10002.png"
        //     ],
        //     interval: 480
        // },
        //
        // "ani.blue.light": {
        //     urls: [
        //         "assets/ani.images/10003.png",
        //         "assets/ani.images/10004.png"
        //     ],
        //     interval: 480
        // },
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