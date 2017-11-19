var Effect = (function(_super) {

    function Effect(id) {
        Effect.super(this);

        this.id = id;
        this.dir = 0;
        this.db = Effect.Config[id];
        this.animation = null;

        this.init();
    }
    
    Laya.class(Effect, "Effect", _super);

    Effect.prototype.init = function() {

    };

    Effect.prototype.play = function() {

    };

    Effect.prototype.stop = function() {
        this.animation.stop();
    };

    Effect.prototype.setDir = function(dir) {
        this.dir = dir;
        this.animation.scaleX = this.dir ? -1 * this.animation.scaleX : this.animation.scaleY;
    };

    Effect.prototype.animationEnd = function() {

    };

    Effect.prototype.animationEvent = function(e) {

    };

    Effect.prototype.exit = function() {
        this.stop();
        this.removeChild(this.animation);
        this.removeSelf();
    };

    Effect.Config = {
    }

    return Effect;
} (Laya.Sprite));
