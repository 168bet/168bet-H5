
var ActionInstant = (function(_super) {
    function ActionInstant() {
        ActionInstant.super(this);
    }

    Laya.class(ActionInstant, "ActionInstant", _super);

    ActionInstant.prototype.isDone = function() {
        return true;
    };

    ActionInstant.prototype.clone = function() {
        return null;
    };

    ActionInstant.prototype.reverse = function() {
        return null;
    };

    ActionInstant.prototype.step = function(dt) {
        this.update(1);
    };

    ActionInstant.prototype.update = function(t) {
        console.log("do nothing");
    };

    return ActionInstant;
}(FiniteTimeAction));

var Show = (function(_super) {
    function Show() {
        Show.super(this);
    }

    Laya.class(Show, "Show", _super);

    Show.prototype.update = function(time) {
        this._target.visible = true;
    };

    Show.prototype.clone = function() {
        return new Show();
    };

    Show.prototype.reverse = function() {
        return Hide.create();
    };

    Show.create = function() {
        return new Show();
    };

    return Show;
}(ActionInstant));

var Hide = (function(_super) {
    function Hide() {
        Hide.super(this);
    }

    Laya.class(Hide, "Hide", _super);

    Hide.prototype.update = function(time) {
        this._target.visible = false;
    };

    Hide.prototype.clone = function() {
        return new Hide();
    };

    Hide.prototype.reverse = function() {
        return Show.create();
    };

    Hide.create = function() {
        return new Hide();
    };

    return Hide;
}(ActionInstant));

var CallFunc = (function(_super) {
    function CallFunc() {
        CallFunc.super(this);
        
        this._handler = null;
    }
    
    Laya.class(CallFunc, "CallFunc", _super);
    
    CallFunc.prototype.initWithFunction = function(handler) {
        this._handler = handler;
    };
    
    CallFunc.prototype.update = function(time) {
        this._handler.runWith(time);
    };
    
    CallFunc.prototype.clone = function() {
        var a = new CallFunc();
        a.initWithFunction(this._handler);
        return a;
    };
    
    CallFunc.prototype.reverse = function() {
        return CallFunc.create();
    };
    
    CallFunc.create = function(handler) {
        var a = new CallFunc();
        a.initWithFunction(handler);
        return a;
    };

    return CallFunc;
}(ActionInstant));

var Place = (function(_super) {
    function Place() {
        Place.super(this);
        this._x = 0;
        this._y = 0;
    }

    Laya.class(Place, "Place", _super);

    Place.prototype.initWithPosition = function(x,y) {
        this._x = x;
        this._y = y;
        return true;
    };

    Place.prototype.update = function(time) {
        this._target.pos(this._x,this._y);
    };

    Place.prototype.clone = function() {
        var action = new Place();
        action.initWithPosition(this._x,this._y);
        return action;
    };

    Place.prototype.reverse = function() {
        return CallFunc.create();
    };

    Place.create = function(x,y) {
        var action = new Place();
        action.initWithPosition(x,y);
        return action;
    };

    return Place;
}(ActionInstant));

var RemoveSelf = (function(_super) {
    function RemoveSelf() {
        RemoveSelf.super(this);
        this._isNeedCleanUp = true;
    }

    Laya.class(RemoveSelf, "RemoveSelf", _super);

    RemoveSelf.prototype.init = function(isNeedCleanUp) {
        this._isNeedCleanUp = isNeedCleanUp;
        return true;
    };

    RemoveSelf.prototype.update = function(time) {
        this._target.removeSelf();
    };

    RemoveSelf.prototype.clone = function() {
        var action = new RemoveSelf();
        action.initWithPosition(this._isNeedCleanUp);
        return action;
    };

    RemoveSelf.prototype.reverse = function() {
        var action = new RemoveSelf();
        action.initWithPosition(this._isNeedCleanUp);
        return action;
    };

    RemoveSelf.create = function(isNeedCleanUp) {
        var action = new RemoveSelf();
        action.initWithPosition(isNeedCleanUp);
        return action;
    };

    return RemoveSelf;
}(ActionInstant));
