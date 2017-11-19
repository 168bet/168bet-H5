
var Actor = (function(_super) {
    function Actor(id) {
        Actor.super(this);

        this.id = id;
        this.db = Actor.Config[id];
        this.state = 0;
        this.attackIndex = 0;
        this.attackCommand = 0;
        this.animation = null;
        this.playbackRate = 1;

        this.attacks = [];

        this.state = Actor.STATE_IDLE;

        this.animation = App.assetsManager.actorFactory.getAnimation(this.id);
        this.animation.zOrder = 100;
        this.animation.on(Laya.Event.STOPPED, this, this.animationEnd);
        this.animation.on(Laya.Event.LABEL, this, this.animationEvent);

        this.animation.scaleX = this.db.dir ? -1 * this.db.scale : this.db.scale;
        this.animation.scaleY = this.db.scale;

        this.playIdle();
        this.addChild(this.animation);
    }

    Laya.class(Actor, "Actor", _super);

    Actor.prototype.play = function(actName, loop) {
        this.animation.play(actName, loop);
    };

    Actor.prototype.setSpeed = function(rate) {
        this.playbackRate = rate;
        this.animation.playbackRate(rate);
    };

    Actor.prototype.playIdle = function() {
        if(this.idle) {
            this.play(this.idle, true);
        }
        else{
            this.idle = "idle";
            this.play(this.idle, true);
        }
    };

    Actor.prototype.playAttack = function() {
        this.play(this.getAttackAction(), false);
    };

    Actor.prototype.setDir = function(dir) {
        this.dir = dir;
        this.animation.scaleX = this.dir ? -1 * this.animation.scaleX : this.animation.scaleY;
    };

    Actor.prototype.attack = function() {
        if (this.attackSize() == 0) {
            return;
        }

        if (this.state == Actor.STATE_IDLE) {
            this.playAttack();
            this.state = Actor.STATE_ATTACK;
        }
        else {
            this.attackCommand++;
            var speed = 2 + Math.floor(this.attackCommand - 1) * 3;
            this.animation.playbackRate(speed);
        }
    };

    Actor.prototype.animationEnd = function() {
        if (this.attackCommand) {
            this.playAttack();
            this.attackCommand--;
        }
        else {
            this.state = Actor.STATE_IDLE;
            this.playIdle();
            this.animation.playbackRate(1);
        }
    };

    Actor.prototype.animationEvent = function(e) {
    };

    Actor.prototype.attackSize = function() {
        return this.attacks.length;
    };

    Actor.prototype.getAttackAction = function() {
        this.attackIndex++;
        if (this.attackIndex >= this.attacks.length) {
            this.attackIndex = 0;
        }

        return this.attacks[this.attackIndex];
    };

    Actor.prototype.dispose = function(){
        this.removeSelf();
        this.animation.off(Laya.Event.STOPPED, this, this.animationEnd);
        this.animation.off(Laya.Event.LABEL, this, this.animationEvent);
    };

    Actor.create = function(id) {
        if (Actor.Config[id] == null) {
            return null;
        }

        return new Actor(id);
    };

    Actor.STATE_IDLE = 0;
    Actor.STATE_ATTACK = 1;
    Actor.STATE_SKILL = 2;
    Actor.STATE_DEAD = 3;
    Actor.STATE_UNDER_ATTACK = 4;

    Actor.Config = {
        10001 :{dir : 0, scale : 0.6}
    }


    return Actor;
}(Laya.Sprite));
