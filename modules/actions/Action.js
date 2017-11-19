var Action = (function(_super) {
    function Action() {
        Action.super(this);

        this._originalTarget = null;
        this._target = null;
        this._tag = 0;
    }

    Laya.class(Action, "Action", _super);

    Action.prototype.startWithTarget = function(target) {
        this._originalTarget = this._target = target;
    };

    //! return true if the action has finished
    Action.prototype.isDone = function() {
        return true;
    };

    /** 
    called after the action has finished. It will set the 'target' to nil.
    IMPORTANT: You should never call "[action stop]" manually. Instead, use: "target->stopAction(action);"
    */
    Action.prototype.stop = function() {
        this._target = null;
    };

    //! called every frame with it's delta time, dt in seconds. DON'T override unless you know what you are doing.
    Action.prototype.step = function(delta) {
        console.log("[Action step]. override me");
    };
    /** 
    called once per frame. time a value between 0 and 1

    For example: 
    - 0 means that the action just started
    - 0.5 means that the action is in the middle
    - 1 means that the action is over
    */
    Action.prototype.update = function(time) {
        console.log("[Action update]. override me");
    };

    Action.prototype.clone = function() {
        return null;
    };

    Action.prototype.reverse = function() {
        return null;
    };

    Action.prototype.getOriginalTarget = function() {
        return this._originalTarget;
    };

    Action.prototype.setOriginalTarget = function(target) {
        this._originalTarget = target;
    };

    Action.prototype.getTarget = function() {
        return this._target;
    };

    Action.prototype.setTarget = function(target) {
        this._target = target;
    };

    Action.prototype.getTag = function() {
        return this._tag;
    };

    Action.prototype.setTag = function(tag) {
        this._tag = tag;
    };

    Action.INVALID_TAG = -1;
    Action.FLT_EPSILON = 1.192092896e-07;
    return Action;
} (laya.events.EventDispatcher));

var FiniteTimeAction = (function(_super) {
    function FiniteTimeAction() {
        FiniteTimeAction.super(this);

        this._duration = 0.0;
    }

    Laya.class(FiniteTimeAction, "FiniteTimeAction", _super);

    FiniteTimeAction.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
    };

    FiniteTimeAction.prototype.getDuration = function() {
        return this._duration;
    };

    FiniteTimeAction.prototype.setDuration = function(duration) {
        this._duration = duration;
    };

    return FiniteTimeAction;
}(Action));

// Extra action for making a Sequence or Spawn when only adding one action to it.
var ExtraAction = (function(_super) {
    function ExtraAction() {
        ExtraAction.super(this);
    }

    Laya.class(ExtraAction, "ExtraAction", _super);

    ExtraAction.prototype.clone = function() {
        return new ExtraAction();
    };

    ExtraAction.prototype.reverse = function() {
        return new ExtraAction();
    };

    ExtraAction.create = function() {
        return new ExtraAction();
    };
    
    return ExtraAction;
}(FiniteTimeAction));

// Speed

// Follow