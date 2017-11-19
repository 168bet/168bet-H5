
var ActionInterval = (function(_super) {
    function ActionInterval() {
        ActionInterval.super(this);

        this._elapsed = 0.0;
        this._firstTick = false;
        this._easeList = null;

        this._speed = 1;
        this._timesForRepeat = 1;
        this._repeatForever = false;
        this.MAX_VALUE = 2;
        this._repeatMethod = false;//Compatible with repeat class, Discard after can be deleted
        this._speedMethod = false;//Compatible with repeat class, Discard after can be deleted

    }

    Laya.class(ActionInterval, "ActionInterval", _super);

    /** how many seconds had elapsed since the actions started to run. */
    ActionInterval.prototype.getElapsed = function() {
        return this._elapsed;
    };

    ActionInterval.prototype.initWithDuration = function(d) {
        this._duration = d;

        // prevent division by 0
        // This comparison could be in step:, but it might decrease the performance
        // by 3% in heavy based action games.
        if (this._duration == 0) {
            this._duration = Action.FLT_EPSILON;
        }

        this._elapsed = 0;
        this._firstTick = true;

        return true;
    };

    ActionInterval.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        this._elapsed = 0.0;
        this._firstTick = true;
    };

    ActionInterval.prototype.isDone = function() {
        return this._elapsed >= this._duration;
    };

    ActionInterval.prototype._cloneDecoration = function(action) {
        action._repeatForever = this._repeatForever;
        action._speed = this._speed;
        action._timesForRepeat = this._timesForRepeat;
        action._easeList = this._easeList;
        action._speedMethod = this._speedMethod;
        action._repeatMethod = this._repeatMethod;
    };

    ActionInterval.prototype._reverseEaseList = function(action) {
        if(this._easeList){
            action._easeList = [];
            for(var i=0; i<this._easeList.length; i++){
                action._easeList.push(this._easeList[i].reverse());
            }
        }
    };

    ActionInterval.prototype.clone = function() {
        var action = new ActionInterval(this._duration);
        this._cloneDecoration(action);
        return action;
    };

    /**
     * Implementation of ease motion.
     *
     * @example
     * //example
     * action.easeing(easeIn(3.0));
     * @param {Object} easeObj
     * @returns {ActionInterval}
     */
    ActionInterval.prototype.easing = function(easeObj) {
        if (this._easeList)
            this._easeList.length = 0;
        else
            this._easeList = [];
        for (var i = 0; i < arguments.length; i++)
            this._easeList.push(arguments[i]);
        return this;
    };

    ActionInterval.prototype._computeEaseTime = function(dt) {
        var locList = this._easeList;
        if ((!locList) || (locList.length === 0))
            return dt;
        for (var i = 0, n = locList.length; i < n; i++)
            dt = locList[i].easing(dt);
        return dt;
    };

    ActionInterval.prototype.step = function(delta) {
        if (this._firstTick) {
            this._firstTick = false;
            this._elapsed = 0;
        }
        else {
            this._elapsed += delta;
        }

        var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = (1 > t ? t : 1);
        this.update(t > 0 ? t : 0);

        if(this._repeatMethod && this._timesForRepeat > 1 && this.isDone()){
            if(!this._repeatForever){
                this._timesForRepeat--;
            }
            this.startWithTarget(this._target);

            this.step(this._elapsed - this._duration);
        }

        //this.update(Math.max(
        //    0,                                                       // needed for rewind. elapsed could be negative
        //    Math.min(1,
        //        this._elapsed / Math.max(this._duration, Action.FLT_EPSILON)) // division by 0
        //    )
        //);
    };

    ActionInterval.prototype.setAmplitudeRate = function(amp) {
        console.log("Abstract class needs implementation");
    };

    ActionInterval.prototype.getAmplitudeRate = function() {
        console.log("Abstract class needs implementation");
        return 0;
    };

    /**
     * Changes the speed of an action, making it take longer (speed>1)
     * or less (speed<1) time. <br/>
     * Useful to simulate 'slow motion' or 'fast forward' effect.
     *
     * @param speed
     * @returns {Action}
     */
    ActionInterval.prototype.speed = function(speed) {
        if(speed <= 0){
            console.log("The speed parameter error");
            return this;
        }

        this._speedMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._speed *= speed;
        return this;
    };

    ActionInterval.prototype.getSpeed = function() {
        return this._speed;
    };

    ActionInterval.prototype.setSpeed = function(speed) {
        this._speed = speed;
        return this;
    };

    /**
     * Repeats an action a number of times.
     * To repeat an action forever use the CCRepeatForever action.
     * @param times
     * @returns {ActionInterval}
     */
    ActionInterval.prototype.repeat = function(times) {
        times = Math.round(times);
        if(isNaN(times) || times < 1){
            console.log("The repeat parameter error");
            return this;
        }
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat *= times;
        return this;
    };

    /**
     * Repeats an action for ever.  <br/>
     * To repeat the an action for a limited number of times use the Repeat action. <br/>
     * @returns {ActionInterval}
     */
    ActionInterval.prototype.repeatForever = function() {
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat = this.MAX_VALUE;
        this._repeatForever = true;
        return this;
    };

    return ActionInterval;
}(FiniteTimeAction));

var DelayTime = (function(_super) {
    function DelayTime() {
        DelayTime.super(this);
    }

    Laya.class(DelayTime, "DelayTime", _super);

    DelayTime.prototype.clone = function() {
        var action = new DelayTime();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration);
        return action;
    };

    DelayTime.prototype.reverse = function() {
        var action = DelayTime.create(this._duration);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action
    };

    DelayTime.prototype.update = function(t) {

    };

    DelayTime.create = function(d) {
        var a = new DelayTime();
        a.initWithDuration(d);
        return a;
    };

    return DelayTime;
}(ActionInterval));

var Sequence = (function(_super) {
    function Sequence(tempArray) {
        Sequence.super(this);

        this._actions = new Array(2);
        this._split = 0;
        this._last = 0;

        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        var last = paramArray.length - 1;
        if ((last >= 0) && (paramArray[last] == null))
            console.log("parameters should not be ending with null in Javascript");

        if(last >= 0){
            var prev = paramArray[0],action1;
            for (var i=1 ; i < last ; i++){
                if(paramArray[i]){
                    action1 = prev;
                    prev = this.createWithTwoActions(action1,paramArray[i])
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    Laya.class(Sequence, "Sequence", _super);

    Sequence.prototype.initWithTwoActions = function(actionOne, actionTwo) {
        var d = actionOne.getDuration() + actionTwo.getDuration();

        _super.prototype.initWithDuration.call(this, d);

        this._actions[0] = actionOne;
        this._actions[1] = actionTwo;

        return true;
    };

    Sequence.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);

        this._split = this._actions[0].getDuration() / this._duration;
        this._last = -1;
    };

    Sequence.prototype.clone = function() {
        var a = new Sequence();
        a.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return a;
    };

    Sequence.prototype.reverse = function() {
        return Sequence.createWithTwoActions(this._actions[1].reverse(), this._actions[0].reverse());
    };

    Sequence.prototype.stop = function() {
        if (this._last != - 1) {
            this._actions[this._last].stop();
        }

        _super.prototype.stop.call(this);
    };

    Sequence.prototype.update = function(t) {
        var found = 0;
        var new_t = 0.0;
        t = this._computeEaseTime(t);
        if (t < this._split) {
            // action[0]
            found = 0;
            if (this._split != 0)
                new_t = t / this._split;
            else
                new_t = 1;

        }
        else {
            // action[1]
            found = 1;
            if (this._split == 1)
                new_t = 1;
            else
                new_t = (t - this._split) / (1 - this._split);
        }

        if (found == 1) {
            if (this._last == -1) {
                // action[0] was skipped, execute it.
                this._actions[0].startWithTarget(this._target);
                this._actions[0].update(1.0);
                this._actions[0].stop();
            }
            else if (this._last == 0) {
                // switching to action 1. stop action 0.
                this._actions[0].update(1.0);
                this._actions[0].stop();
            }
        }
        else if (found == 0 && this._last == 1) {
            // Reverse mode ?
            // FIXME: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
            // since it will require a hack to know if an action is on reverse mode or not.
            // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
            this._actions[1].update(0);
            this._actions[1].stop();
        }

        // Last action found and it is done.
        if (found == this._last && this._actions[found].isDone()) {
            return;
        }

        // Last action found and it is done
        if (found != this._last)
        {
            this._actions[found].startWithTarget(this._target);
        }

        this._actions[found].update(new_t);
        this._last = found;
    };

    // 工厂函数
    Sequence.createWithTwoActions = function(actionOne, actionTwo) {
        var sequence = new Sequence();

        sequence.initWithTwoActions(actionOne, actionTwo);

        return sequence;
    };

    Sequence.create = function(/*Multiple Arguments*/tempArray) {
        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if ((paramArray.length > 0) && (paramArray[paramArray.length - 1] == null))
            console.log("parameters should not be ending with null in Javascript");

        var result, current, i, repeat;
        while(paramArray && paramArray.length > 0){
            current = Array.prototype.shift.call(paramArray);
            repeat = current._timesForRepeat || 1;
            current._repeatMethod = false;
            current._timesForRepeat = 1;

            i = 0;
            if(!result){
                result = current;
                i = 1;
            }

            for(i; i<repeat; i++){
                result = this.createWithTwoActions(result, current);
            }
        }

        return result;
    };

    return Sequence;
}(ActionInterval));

var Spawn = (function(_super) {
    function Spawn(tempArray) {
        Spawn.super(this);

        this._one = null;
        this._two = null;

        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        var last = paramArray.length - 1;
        if ((last >= 0) && (paramArray[last] == null))
            console.log("parameters should not be ending with null in Javascript");

        if (last >= 0) {
            var prev = paramArray[0], action1;
            for (var i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = this.createWithTwoActions(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    Laya.class(Spawn, "Spawn", _super);

    Spawn.prototype.initWithTwoActions = function(action1, action2) {
        var ret = false;

        var d1 = action1.getDuration();
        var d2 = action2.getDuration();

        if (_super.prototype.initWithDuration.call(this, Math.max(d1, d2))) {
            this._one = action1;
            this._two = action2;

            if (d1 > d2) {
                this._two = Sequence.createWithTwoActions(action2, DelayTime.create(d1 - d2));
            }
            else if (d1 < d2) {
                this._one = Sequence.createWithTwoActions(action1, DelayTime.create(d2 - d1));
            }

            ret = true;
        }

        return ret;
    };

    Spawn.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);

        this._one.startWithTarget(target);
        this._two.startWithTarget(target);
    };

    Spawn.prototype.clone = function() {
        var a = new Spawn();
        a.initWithTwoActions(this._one.clone(), this._two.clone());
        return a;
    };

    Spawn.prototype.reverse = function() {
        return Spawn.createWithTwoActions(this._one.reverse(), this._two.reverse());
    };

    Spawn.prototype.update = function(time) {
        time = this._computeEaseTime(time);
        if (this._one) {
            this._one.update(time);
        }
        if (this._two) {
            this._two.update(time);
        }
    };

    Spawn.createWithTwoActions = function(action1, action2) {
        var spawn = new Spawn();
        spawn.initWithTwoActions(action1, action2);
        return spawn;
    };

    Spawn.create = function(/*Multiple Arguments*/tempArray) {
        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if ((paramArray.length > 0) && (paramArray[paramArray.length - 1] == null))
            console.log("parameters should not be ending with null in Javascript");

        var prev = paramArray[0];
        for (var i = 1; i < paramArray.length; i++) {
            if (paramArray[i] != null)
                prev = this.createWithTwoActions(prev, paramArray[i]);
        }
        return prev;
    };

    return Spawn;
}(ActionInterval));

var ScaleTo = (function(_super) {
    function ScaleTo() {
        ScaleTo.super(this);

        this._scaleX = 1;
        this._scaleY = 1;
        this._startScaleX = 1;
        this._startScaleY = 1;
        this._endScaleX = 0;
        this._endScaleY = 0;
        this._deltaX = 0;
        this._deltaY = 0;
    }

    Laya.class(ScaleTo, "ScaleTo", _super);

    ScaleTo.prototype.initWithDuration = function(duration, sx, sy) {
        if (_super.prototype.initWithDuration.call(this, duration)) {
            this._endScaleX = sx;
            this._endScaleY = (sy !=null ) ? sy : sx;
            return true;
        }

        return false;
    };

    ScaleTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);

        this._startScaleX = target.scaleX;
        this._startScaleY = target.scaleY;
        this._deltaX = this._endScaleX - this._startScaleX;
        this._deltaY = this._endScaleY - this._startScaleY;
    };

    ScaleTo.prototype.update = function(time) {
        time = this._computeEaseTime(time);
        if (this._target) {
            this._target.scaleX = (this._startScaleX + this._deltaX * time);
            this._target.scaleY = (this._startScaleY + this._deltaY * time);
        }
    };

    ScaleTo.prototype.clone = function() {
        var scaleTo = new ScaleTo();
        scaleTo.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
        return scaleTo;
    };

    ScaleTo.prototype.reverse = function() {
        console.log("reverse() not supported in ScaleTo");
        return null;
    };

    // 工厂方法
    ScaleTo.create = function(duration, sx, sy) {
        var scaleTo = new ScaleTo();
        scaleTo.initWithDuration(duration, sx, sy);
        return scaleTo;
    };

    return ScaleTo;
}(ActionInterval));

var ScaleBy = (function(_super){
    function ScaleBy(){
        ScaleBy.super(this);
    }
    Laya.class(ScaleBy,"ScaleBy",_super);

    ScaleBy.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        this._deltaX = this._startScaleX*this._endScaleX - this._startScaleX;
        this._deltaY = this._startScaleX*this._endScaleY - this._startScaleY;
    };

    ScaleBy.reverse = function() {
        var action = new ScaleBy();
        action.initWithDuration(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);
        return action;
    };

    ScaleBy.clone = function() {
        var action = new ScaleBy();
        action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
        return action;
    };

    ScaleBy.create = function(duration, sx, sy) {
        var action = new ScaleBy();
        action.initWithDuration(duration, sx, sy);
        return action;
    };
    return ScaleBy
})(ScaleTo);

var RotateBy = (function(_super) {
    function RotateBy() {
        RotateBy.super(this);

        this._angleX = 0;
        this._angleY = 0;
        this._startAngleX = 0;
        this._startAngleY = 0;
    }

    Laya.class(RotateBy, "RotateBy", _super);

    RotateBy.prototype.initWithDuration = function(duration, deltaAngleX, deltaAngleY) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._angleX = deltaAngleX || 0;
            //this._angleY = deltaAngleY || this._angleX;
            return true;
        }
        return false;

    };

    RotateBy.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        this._startAngleX = target.rotation;
        //this._startAngleY = 0;
    };

    RotateBy.prototype.clone = function() {
        var action = RotateBy.create(this._duration, this._angleX, this._angleX);
        this._cloneDecoration(action);
        return action
    };

    RotateBy.prototype.reverse = function() {
        var action = RotateBy.create(this._duration, -this._angleX, -this._angleX);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    };

    RotateBy.prototype.update = function(time) {
        time = this._computeEaseTime(time);

        if (this._target) {
            this._target.rotation = (this._startAngleX + this._angleX * time);
            //this._target.skewY = (this._startAngleY + this._angleY * time);
        }
    };

    RotateBy.create = function(duration, deltaAngleX, deltaAngleY) {
        var rotateBy = new RotateBy();
        rotateBy.initWithDuration(duration, deltaAngleX, deltaAngleY);
        return rotateBy;
    };

    return RotateBy;
}(ActionInterval));

var RotateTo = (function(_super) {
    function RotateTo() {
        RotateTo.super(this);

        this._dstAngleX = 0;
        this._startAngleX = 0;
        this._diffAngleX = 0;

        this._dstAngleY = 0;
        this._startAngleY = 0;
        this._diffAngleY = 0;
    }

    Laya.class(RotateTo, "RotateTo", _super);

    RotateTo.prototype.initWithDuration = function(duration, deltaAngleX, deltaAngleY) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._dstAngleX = deltaAngleX || 0;
            //this._dstAngleY = deltaAngleY || this._dstAngleX;
            return true;
        }
        return false;
    };

    RotateTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        // Calculate X
        this._startAngleX = target.rotation % 360.0;
        var locDiffAngleX = this._dstAngleX - this._startAngleX;
        if (locDiffAngleX > 180)
            locDiffAngleX -= 360;
        if (locDiffAngleX < -180)
            locDiffAngleX += 360;
        this._diffAngleX = locDiffAngleX;

        // Calculate Y  It's duplicated from calculating X since the rotation wrap should be the same
        //this._startAngleY = target.skewY % 360.0;
        //var locDiffAngleY = this._dstAngleY - this._startAngleY;
        //if (locDiffAngleY > 180)
        //    locDiffAngleY -= 360;
        //if (locDiffAngleY < -180)
        //    locDiffAngleY += 360;
        //this._diffAngleY = locDiffAngleY;
    };

    RotateTo.prototype.clone = function() {
        var action = RotateTo.create(this._duration, this._dstAngleX, this._dstAngleY);
        this._cloneDecoration(action);
        return action
    };

    RotateTo.prototype.reverse = function() {
        console.log("RotateTo doesn't support the 'reverse' method");
        return null;
    };

    RotateTo.prototype.update = function(time) {
        if (this._target) {
            this._target.rotation = (this._startAngleX + this._diffAngleX * time);
            //this._target.skewY = (this._startAngleY + this._diffAngleY * time);
        }
    };

    RotateTo.create = function(duration, deltaAngleX, deltaAngleY) {
        var rotateTo = new RotateTo();
        rotateTo.initWithDuration(duration, deltaAngleX, deltaAngleY);
        return rotateTo;
    };

    return RotateTo;
}(ActionInterval));

var ENABLE_STACKABLE_ACTIONS = true;

var MoveBy = (function(_super) {
    function MoveBy() {
        MoveBy.super(this);

        this._positionDeltaX = 0;
        this._positionDeltaY = 0;
        this._startPositionX = 0;
        this._startPositionY = 0;
        this._previousPositionX = 0;
        this._previousPositionY = 0;
    }

    Laya.class(MoveBy, "MoveBy", _super);

    MoveBy.prototype.initWithDuration = function(duration, position, y) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            if(position.x !== undefined){
                y = position.y;
                position = position.x;
            }
            this._positionDeltaX = position || 0;
            this._positionDeltaY = y || 0;
            return true;
        }
        return false;

    };

    MoveBy.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);

        var locPosX = target.x;
        var locPosY = target.y;

        this._previousPositionX = locPosX;
        this._previousPositionY = locPosY;
        this._startPositionX = locPosX;
        this._startPositionY = locPosY;
    };

    MoveBy.prototype.clone = function() {
        var action = MoveBy.create(this._duration, this._positionDeltaX, this._positionDeltaY);
        this._cloneDecoration(action);
        return action
    };

    MoveBy.prototype.reverse = function() {
        var action = MoveBy.create(this._duration, -this._positionDeltaX, -this._positionDeltaY);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    };

    MoveBy.prototype.update = function (dt) {
        dt = this._computeEaseTime(dt);
        if (this._target) {
            var x = this._positionDeltaX * dt;
            var y = this._positionDeltaY * dt;

            if (ENABLE_STACKABLE_ACTIONS) {
                var targetX = this._target.x;
                var targetY = this._target.y;

                this._startPositionX = this._startPositionX + targetX - this._previousPositionX;
                this._startPositionY = this._startPositionY + targetY - this._previousPositionY;

                this._target.x = this._previousPositionX = this._startPositionX + x;
                this._target.y = this._previousPositionY = this._startPositionY + y;
            }
            else {
                this._target.x = this._startPositionX + x;
                this._target.y = this._startPositionY + y;
            }
        }
    };

    MoveBy.create = function(duration, position, y) {
        var moveBy = new MoveBy();
        moveBy.initWithDuration(duration, position, y);
        return moveBy;
    };

    return MoveBy;
}(ActionInterval));

var MoveTo = (function(_super){
    function MoveTo(){
        MoveTo.super(this);
        this._endPositionX = 0;
        this._endPositionY = 0;
    }
    Laya.class(MoveTo,"MoveTo",_super);

    MoveTo.prototype.initWithDuration = function(duration, position, y) {
        if(_super.prototype.initWithDuration.call(this, duration,position,y)){
            if(position.x !== undefined){
                y = position.y ;
                position = position.x;
            }
            this._endPositionX = position || 0;
            this._endPositionY = y || 0;
            return true;
        }
        return false;

    };

    MoveTo.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);
        this._positionDeltaX = this._endPositionX - target.x;
        this._positionDeltaY = this._endPositionY - target.y;
    };

    MoveTo.prototype.clone = function() {
        var action = MoveTo.create(this._duration, this._endPositionX, this._endPositionY);
        this._cloneDecoration(action);
        return action;
    };

    MoveTo.create = function(duration, position, y) {
        var action = new MoveTo();
        action.initWithDuration(duration, position, y);
        return action;
    };

    return MoveTo;
})(MoveBy);

/** An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class
 * @extends ActionInterval
 * @param {Number} t time in seconds
 * @param {Array} c Array of points
 * @example
 * var bezier = [ {x: 0, y: windowSize.height / 2}, { x: 300, y: -windowSize.height / 2 } , { x: 300, y: 100} ];
 * var bezierForward = new BezierBy(3, bezier);
 */
var BezierBy = (function(_super) {
    function BezierBy() {
        BezierBy.super(this);

        this._config = null;
        this._previousPositionX = 0;
        this._previousPositionY = 0;
        this._startPositionX = 0;
        this._startPositionY = 0;
    }

    Laya.class(BezierBy, "BezierBy", _super);

    BezierBy.prototype.initWithDuration = function(duration, c) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._config = c || [];
            return true;
        }
        return false;
    };

    BezierBy.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);

        this._startPositionX = this._previousPositionX = target.x;
        this._startPositionY = this._previousPositionY = target.y;
    };

    BezierBy.prototype.clone = function() {
        var bezierBy = new BezierBy();

        var newConfigs = [];
        for (var i = 0; i < this._config.length; i++) {
            var selConf = this._config[i];

            newConfigs.push({
                x: selConf.x,
                y: selConf.y
            });
        }
        bezierBy.initWithDuration(this._duration, newConfigs);
        return bezierBy;
    };

    BezierBy.prototype.reverse = function() {
        var locConfig = this._config;
        var r = [
            {
                x: locConfig[1].x - locConfig[2].x,
                y: locConfig[1].y - locConfig[2].y
            },
            {
                x: locConfig[0].x - locConfig[2].x,
                y: locConfig[0].y - locConfig[2].y
            },
            {
                x: locConfig[2].x,
                y: locConfig[2].y
            }

        ];

        return BezierBy.create(this._duration, r);
    };

    BezierBy.prototype.update = function (dt) {
        dt = this._computeEaseTime(dt);

        if (this._target) {
            var locConfig = this._config;

            var xa = 0;
            var xb = locConfig[0].x;
            var xc = locConfig[1].x;
            var xd = locConfig[2].x;

            var ya = 0;
            var yb = locConfig[0].y;
            var yc = locConfig[1].y;
            var yd = locConfig[2].y;

            var x = BezierBy.bezierAt(xa, xb, xc, xd, dt);
            var y = BezierBy.bezierAt(ya, yb, yc, yd, dt);

            if (ENABLE_STACKABLE_ACTIONS) {
                var targetX = this._target.x;
                var targetY = this._target.y;

                this._startPositionX = this._startPositionX + targetX - this._previousPositionX;
                this._startPositionY = this._startPositionY + targetY - this._previousPositionY;

                this._target.x = this._previousPositionX = this._startPositionX + x;
                this._target.y = this._previousPositionY = this._startPositionY + y;
            }
            else {
                this._target.x = this._startPositionX + x;
                this._target.y = this._startPositionY + y;
            }
        }
    };

    BezierBy.create = function(duration, c) {
        var bezierBy = new BezierBy();
        bezierBy.initWithDuration(duration, c);
        return bezierBy;
    };

    BezierBy.bezierAt = function (a, b, c, d, t) {
        return (Math.pow(1 - t, 3) * a +
        3 * t * (Math.pow(1 - t, 2)) * b +
        3 * Math.pow(t, 2) * (1 - t) * c +
        Math.pow(t, 3) * d );
    };

    return BezierBy;
}(ActionInterval));

var BezierTo = (function(_super){
    function BezierTo(){
        BezierTo.super(this);
        this._toConfig = [];
    }
    Laya.class(BezierTo,"BezierTo",_super);

    BezierTo.prototype.initWithDuration = function(duration, c) {
        if(_super.prototype.initWithDuration.call(this, duration,c)){
            this._toConfig = c || [];
            return true;
        }
        return false;
    };

     BezierTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);

        var locStartPos = Point.p(this._startPositionX,this._startPositionY);
        var locToConfig = this._toConfig;
        var locConfig = this._config;

        locConfig[0] = Point.pSub(locToConfig[0], locStartPos);
        locConfig[1] = Point.pSub(locToConfig[1], locStartPos);
        locConfig[2] = Point.pSub(locToConfig[2], locStartPos);
    };

    BezierTo.prototype.clone = function() {
        var action = new BezierTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._toConfig);
        return action;
    };

    BezierTo.create = function(duration,toConfig) {
        var action = new BezierTo();
        action.initWithDuration(duration,toConfig);
        return action;
    };

    return BezierTo
})(BezierBy);

var FadeTo = (function(_super){
    function FadeTo(){
        FadeTo.super(this);
        this._toOpacity = 0;
        this._fromOpacity = 0;
    }
    Laya.class(FadeTo, "FadeTo", _super);

    FadeTo.prototype.initWithDuration = function(duration,opacity) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._toOpacity = opacity;
            return true;
        }
        return false;
    };

    FadeTo.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);
        this._fromOpacity = target.alpha;
    };

    FadeTo.prototype.update = function (dt) {
        dt = this._computeEaseTime(dt);
        this._target.alpha = this._fromOpacity + (this._toOpacity - this._fromOpacity) * dt;
    };

    FadeTo.prototype.clone = function() {
        var action = new FadeTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration,this._toOpacity);
        return action;
    };

    FadeTo.create = function(duration, opacity) {
        var action = new FadeTo();
        action.initWithDuration(duration, opacity);
        return action;
    };

    return FadeTo;
})(ActionInterval);

var FadeIn = (function(_super){
    function FadeIn(){
        FadeIn.super(this);
        this._reverseAction = null;
    }
    Laya.class(FadeIn, "FadeIn", _super);

    FadeIn.prototype.initWithDuration = function(duration,opacity) {
        var duration = duration || 0;
        _super.prototype.initWithDuration.call(this, duration,opacity);
    };

    FadeIn.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);
    };

    FadeIn.prototype.reverse = function () {
        var action = new FadeIn();
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action.initWithDuration(this._duration,0);
        return action;
    };

    FadeIn.prototype.clone = function () {
        var action = new FadeIn();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration,1);
        return action;
    };

    FadeIn.create = function(duration) {
        var action = new FadeIn();
        action.initWithDuration(duration,1);
        return action;
    };

    return FadeIn;
})(FadeTo);

var FadeOut = (function(_super){
    function FadeOut(){
        FadeOut.super(this);
        this._reverseAction = null;
    }
    Laya.class(FadeOut, "FadeOut", _super);

    FadeOut.prototype.initWithDuration = function(duration, opacity) {
        duration = duration || 0;
        _super.prototype.initWithDuration.call(this, duration, opacity);
    };

    FadeOut.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);
    };

    FadeOut.prototype.reverse = function () {
        var action = new FadeOut();
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action.initWithDuration(this._duration,1);
        return action;
    };

    FadeOut.prototype.clone = function () {
        var action = new FadeOut();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration,0);
        return action;
    };

    FadeOut.create = function(duration) {
        var action = new FadeOut();
        action.initWithDuration(duration,0);
        return action;
    };

    return FadeOut;
})(FadeTo);

var Repeat = (function(_super){
    function Repeat(){
        Repeat.super(this);
        this._times = 0;
        this._total = 0;
        this._nextDt = 0;
        this._actionInstant = false;
        this._innerAction = null;
    }
    Laya.class(Repeat, "Repeat", _super);


    Repeat.prototype.initWithAction = function(action, times) {
        var duration = action._duration * times;
        if (_super.prototype.initWithDuration.call(this, duration)) {
            this._times = times ;
            this._innerAction = action;
            if(action instanceof ActionInstant){
                this._actionInstant = true;
                this.times -= 1;
            }
            this._total = 0;
        }
        return false;
    };

    Repeat.prototype.startWithTarget = function (target) {
        _super.prototype.startWithTarget.call(this, target);
        this._total = 0;
        this._nextDt = this._innerAction._duration / this._duration;
        this._innerAction.startWithTarget(target);
    };

    Repeat.prototype.stop = function () {
        this._innerAction.stop();
        _super.prototype.stop.call(this);
    };

    Repeat.prototype.isDone = function () {
        return this._total == this._times;
    };

    Repeat.prototype.clone = function () {
        var action = new Repeat();
        this._cloneDecoration(action);
        action.initWithAction(this._innerAction.clone(), this._times);
        return action;
    };

    Repeat.prototype.reverse = function () {
        var action = new Repeat();
        action.initWithAction(this._innerAction.reverse(),this._times);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action
    };

    Repeat.prototype.update = function (dt) {
        var locInnerAction = this._innerAction;
        var locDuration = this._duration;
        var locTimes = this._times;
        var locNextDt = this._nextDt;

        dt = this._computeEaseTime(dt);
        if (dt >= locNextDt) {
            while (dt > locNextDt && this._total < locTimes) {
                locInnerAction.update(1);
                this._total++;
                locInnerAction.stop();
                locInnerAction.startWithTarget(this._target);
                locNextDt += locInnerAction._duration / locDuration;
                this._nextDt = locNextDt;
            }

            if (dt >= 1.0 && this._total < locTimes)
                this._total++;

            if (!this._actionInstant) {
                if (this._total === locTimes) {
                    locInnerAction.update(1);
                    locInnerAction.stop();
                } else {
                    locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
                }
            }
        } else {
            locInnerAction.update((dt * locTimes) % 1.0);
        }
    };

    Repeat.create = function(action, times) {
        var repeat = new Repeat();
        repeat.initWithAction(action, times);
        return repeat;
    };
    return Repeat;
})(ActionInterval);

var RepeatForever = (function(_super){
    function RepeatForever(){
        RepeatForever.super(this);
        this._innerAction = null;

    }
    Laya.class(RepeatForever, "RepeatForever", _super);

    RepeatForever.prototype.initWithAction = function(action) {
        if(!action)
            console.log("cc.RepeatForever.initWithAction(): action must be non null");

        this._innerAction = action;
        return true;
    };

    RepeatForever.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        this._innerAction.startWithTarget(target);
    };

    RepeatForever.prototype.clone = function() {
        var repeatForever = new RepeatForever();
        repeatForever.initWithAction(repeatForever.clone());
        return repeatForever;
    };

    RepeatForever.prototype.step = function(dt) {
        var locInnerAction = this._innerAction;
        locInnerAction.step(dt);
        if (locInnerAction.isDone()) {
            locInnerAction.startWithTarget(this._target);

            locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
        }
    };

    RepeatForever.prototype.isDone = function() {
        return false;
    };

    RepeatForever.prototype.reverse = function() {
        var repeatForever = new RepeatForever();
        repeatForever.initWithAction(this._innerAction.reverse());
        return repeatForever;
    };

    RepeatForever.prototype.setInnerAction = function(action) {
        if (this._innerAction != action) {
            this._innerAction = action;
        }
    };

    RepeatForever.prototype.getInnerAction = function() {
        return this._innerAction;
    };

    RepeatForever.create = function(action){
        var repeatForever = new RepeatForever();
        repeatForever.initWithAction(action);
        return repeatForever;
    };
    return RepeatForever;
})(ActionInterval);

var Blink = (function(_super){
    function Blink (){
        Blink.super(this);
        this._times = 0;
        this._originalState = false;
    }
    Laya.class(Blink, "Blink", _super);

    Blink.prototype.initWithDuration = function(duration,blinks) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._times = blinks;
            return true;
        }
        return false;
    };

    Blink.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);
        this._originalState = target.visible;
    };

    Blink.prototype.update = function(dt) {
        dt = this._computeEaseTime(dt);
        if (this._target && !this.isDone()) {
            var slice = 1.0 / this._times;
            var m = dt % slice;
            this._target.visible = (m > (slice / 2));
        }
    };

    Blink.prototype.stop = function() {
        this._target.visible = this._originalState;
        _super.prototype.stop.call(this);
    };

    Blink.prototype.clone = function() {
        var blink = new Blink();
        this._cloneDecoration(action);
        blink.initWithAction(this._duration,this._times);
        return blink;
    };

    Blink.prototype.reverse = function() {
        var blink = new Blink();
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        blink.initWithAction(this._duration,this._times);
        return blink;
    };

    Blink.create = function(duration,blinks){
        var blink = new Blink();
        blink.initWithDuration(duration,blinks);
        return blink;
    };
    return Blink;

})(ActionInterval);

var SkewTo = (function(_super){
    function SkewTo(){
        SkewTo.super(this);
        this._skewX = 0;
        this._skewY = 0;
        this._startSkewX = 0;
        this._startSkewY = 0;
        this._endSkewX = 0;
        this._endSkewY = 0;
        this._deltaX = 0;
        this._deltaY = 0;
    }
    Laya.class(SkewTo,"SkewTo",_super);

    SkewTo.prototype.initWithDuration = function(duration,sx,sy) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            this._endSkewX = sx;
            this._endSkewY = sy;
            return true;
        }
        return false;
    };

    SkewTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this,target);

        this._startSkewX = target.skewX % 180;
        this._deltaX = this._endSkewX - this._startSkewX;
        if(this._deltaX > 180){
            this._deltaX -= 360;
        }else if(this._deltaX < -180){
            this._deltaX += 360;
        }

        this._startSkewY = target.skewY % 180;
        this._deltaY = this._endSkewY - this._startSkewY;
        if(this._deltaY > 180){
            this._deltaY -= 360;
        }else if(this._deltaY < -180){
            this._deltaY += 360;
        }
    };

    SkewTo.prototype.update = function(dt) {
        dt = this._computeEaseTime(dt);
        this._target.skewX = this._startSkewX + this._deltaX * dt;
        this._target.skewY = this._startSkewY + this._deltaY * dt;
    };

    SkewTo.prototype.clone = function() {
        var action = new SkewTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration,this._endSkewX,this._endSkewY);
        return action;
    };

    SkewTo.create = function(duration,sx,sy){
        var action = new SkewTo();
        action.initWithDuration(duration,sx,sy);
        return action;
    };
    return SkewTo;
})(ActionInterval);

var SkewBy = (function(_super){
    function SkewBy(){
        SkewBy.super(this);
    }
    Laya.class(SkewBy,"SkewBy",_super);

    SkewBy.prototype.initWithDuration = function(duration,deltaSkewX,deltaSkewY) {
        if(_super.prototype.initWithDuration.call(this, duration,deltaSkewX,deltaSkewY)){
            this._skewX = deltaSkewX;
            this._skewY = deltaSkewY;
            return true;
        }
        return false;
    };

    SkewBy.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this,target);
        this._deltaX = this._skewX;
        this._deltaY = this._skewY;
        this._endSkewX = this._startSkewX + this._deltaX;
        this._endSkewY = this._startSkewY + this._deltaY;
    };

    SkewBy.prototype.reverse = function() {
        var action = new SkewBy();
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action.initWithDuration(this._duration,-this._skewX,-this._skewY);
        return action;
    };

    SkewBy.prototype.clone = function() {
        var action = new SkewBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration,this._skewX,this._skewY);
        return action;
    };

    SkewBy.create = function(duration,deltaSkewX,deltaSkewY){
        var action = new SkewBy();
        action.initWithDuration(duration,deltaSkewX,deltaSkewY);
        return action;
    };
    return SkewBy;
})(SkewTo);

var JumpBy = (function(_super){
    function JumpBy(){
        JumpBy.super(this);
        this._startPosition = Point.p(0,0);
        this._delta = Point.p(0,0);
        this._height = 0;
        this._jumps = 0;
        this._previousPosition = Point.p(0,0);
    }
    Laya.class(JumpBy,"JumpBy",_super);

    JumpBy.prototype.initWithDuration = function(duration,position,y,height,jumps) {
        if(_super.prototype.initWithDuration.call(this, duration)){
            if (jumps === undefined){
                jumps = height;
                height = y ;
                y = position.y ;
                position = position.x;
            }
            this._delta.x = position;
            this._delta.y = y;
            this._height = height;
            this._jumps = jumps;
            return true;
        }
        return false;
    };

    JumpBy.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this,target);
        var PosX = target.x;
        var PosY = target.y;
        this._previousPosition.x = PosX;
        this._previousPosition.y = PosY;
        this._startPosition.x = PosX;
        this._startPosition.y = PosY;
    };

    JumpBy.prototype.update = function(dt) {
        dt = this._computeEaseTime(dt);
        if (this._target) {
            var frac = dt * this._jumps % 1.0;
            var y = this._height * 4 * frac * (1 - frac);
            y += this._delta.y * dt;

            var x = this._delta.x * dt;
            var locStartPosition = this._startPosition;
            if (ENABLE_STACKABLE_ACTIONS) {
                var targetX = this._target.x;
                var targetY = this._target.y;
                var locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x = x + locStartPosition.x;
                y = y + locStartPosition.y;
                locPreviousPosition.x = x;
                locPreviousPosition.y = y;
                this._target.pos(x, y);
            } else {
                this._target.pos(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    };

    JumpBy.prototype.reverse = function() {
        var action = new JumpBy();
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action.initWithAction(this._duration,Point.p(-this._delta.x,-this._delta.y), this._height, this._jumps);
        return action;
    };

    JumpBy.prototype.clone = function() {
        var action = new JumpBy();
        this._cloneDecoration(action);
        action.initWithAction(this._duration, this._delta, this._height, this._jumps);
        return action;
    };

    JumpBy.create = function(duration,position,y,height,jumps){
        var action = new JumpBy();
        action.initWithAction(duration,position,y,height,jumps);
        return action;
    };
    return JumpBy;
})(ActionInterval);

var JumpTo = (function(_super){
    function JumpTo(){
        JumpTo.super(this);
        this._endPosition = Point.p(0,0);
    }
    Laya.class(JumpTo,"JumpTo",_super);

    JumpTo.prototype.initWithDuration = function(duration,position,y,height,jumps) {
        if(_super.prototype.initWithDuration.call(this, duration, position, y, height, jumps)){
            if (jumps === undefined){
                y = position.y;
                position = position.x;
            }
            this._endPosition.x = position;
            this._endPosition.y = y;
            return true;
        }
        return false;
    };

    JumpTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this,target);
        this._delta.x = this._endPosition.x - this._startPosition.x;
        this._delta.y = this._endPosition.y - this._startPosition.y;
    };

    JumpTo.prototype.clone = function() {
        var action = new JumpTo();
        this._cloneDecoration(action);
        action.initWithAction(this._duration, this._endPosition, this._height, this._jumps);
        return action;
    };

    JumpTo.create = function(duration,position,y,height,jumps){
        var action = new JumpTo();
        action.initWithAction(duration,position,y,height,jumps);
        return action;
    };
    return JumpTo;
})(JumpBy);

var TargetedAction = (function (_super){
    function TargetedAction(){
        TargetedAction.super(this);
        this._action = null;
        this._forcedTarget = null;
    }
    Laya.class(TargetedAction,"TargetedAction",_super);


    TargetedAction.prototype.initWithTarget = function(target,action) {
        if(_super.prototype.initWithDuration.call(this)){
            this._forcedTarget = target;
            this._action = action;
            return true;
        }
        return false;
    };

    TargetedAction.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this,target);
        this._action.startWithTarget(this._forcedTarget);
    };

    TargetedAction.prototype.stop = function() {
        this._action.stop();
    };

    TargetedAction.prototype.update = function(dt) {
        dt = this._computeEaseTime(dt);
        this._action.update(dt);
    };

    TargetedAction.prototype.getForcedTarget = function() {
        return this._forcedTarget;
    };

    TargetedAction.prototype.setForcedTarget = function(forcedTarget) {
        if (this._forcedTarget != forcedTarget)
            this._forcedTarget = forcedTarget;
    };

    TargetedAction.prototype.clone = function(dt) {
        var action = new TargetedAction();
        this._cloneDecoration(action);
        action.initWithAction(this._forcedTarget,this._action);
        return action;
    };

    TargetedAction.create = function(target){
        var action = new TargetedAction();
        action.initWithAction(target, action);
        return action;
    };
    return TargetedAction;
})(ActionInterval);

var NumberTo = (function(_super) {
    function NumberTo() {
        NumberTo.super(this);

        this.__from = 0;
        this.__to = 0;
        this.__delta = 0;
    }

    Laya.class(NumberTo, "NumberTo", _super);

    NumberTo.prototype.initWithDuration = function(duration, from, to) {
        if (_super.prototype.initWithDuration.call(this, duration)) {
            this.__from = from;
            this.__to = to;
            this.__delta = to - from;

            return true;
        }
        return false;
    };

    NumberTo.prototype.startWithTarget = function(target) {
        _super.prototype.startWithTarget.call(this, target);

        if (target.hasOwnProperty("text")) {
            target.text = this.__from;
        }
    };

    NumberTo.prototype.update = function(t) {
        t = this._computeEaseTime(t);

        if (this._target.hasOwnProperty("text")) {
            this._target.text = this.__from + Math.floor(this.__delta * t);
        }
    };

    NumberTo.create = function(duration, from, to) {
        var action = new NumberTo();
        action.initWithDuration(duration, from, to);
        return action;
    };

    return NumberTo;
})(ActionInterval);