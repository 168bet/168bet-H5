
var SpineEffect = (function(_super) {
    function SpineEffect(id) {
        _super.call(this, id);
    }

    Laya.class(SpineEffect, "SpineEffect", _super);

    SpineEffect.prototype.init = function() {
        this.animation = App.assetsManager.effectFactory.getAnimation(this.id, 2);
        this.animation.scale(this.db.scale, this.db.scale);

        this.addChild(this.animation);

        this.animation.on(Laya.Event.STOPPED, this, this.animationEnd);
        this.animation.on(Laya.Event.LABEL, this, this.animationEvent);
    };

    SpineEffect.prototype.play = function() {
        this.animation.play(0, true);
    };

    SpineEffect.prototype.playOnce = function () {
        this.animation.play(0, false);
    };

    SpineEffect.prototype.animationEnd = function() {
        if (this.db.once) {
            this.exit();
        }
    };

    SpineEffect.prototype.animationEvent = function(e) {

    };

    SpineEffect.create = function(id) {
        if (Effect.Config[id] == null) {
            return null;
        }

        return new SpineEffect(id);
    };

    return SpineEffect;
}(Effect));