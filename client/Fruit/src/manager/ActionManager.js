/*
 * Element
 * {
 *     actions: array,
 *     actionIndex: int,
 *     currentAction: Action,
 *     currentActionSalvaged: boolean,
 *     target: Laya.Node,
 *     paused: boolean
 * }
 */
var ActionManager = (function(_super) {
    function ActionManager() {
        ActionManager.super(this);

        this._guid = 1;
        this._targets = {};
        this._currentTarget = null;
        this._currentTargetSalvaged = false;

        this.init();
    }

    Laya.class(ActionManager, "ActionManager", _super);

    ActionManager.prototype.init = function() {
        Laya.stage.frameLoop(1, this, this.update);
    };

    ActionManager.prototype.uuid = function() {
        return this._guid++;
    };

    ActionManager.prototype.getTargetGUID = function(target) {
        return target.$_NARWHALE_GUID || (target.$_NARWHALE_GUID = this.uuid());
    };

    ActionManager.prototype.addElement = function(target, element) {
        var uuid = this.getTargetGUID(target);
        this._targets[uuid] = element;
    };

    ActionManager.prototype.delElement = function(target) {
        var uuid = this.getTargetGUID(target);
        delete this._targets[uuid];
    };

    ActionManager.prototype.getElement = function(target) {
        var uuid = this.getTargetGUID(target);
        return this._targets[uuid];
    };

    ActionManager.prototype.add = 
    ActionManager.prototype.addAction = function(action, target, complete, paused) {
        complete = complete || null;
        paused = paused || false;
        var element = this.getElement(target);
        if (element == null) {
            element = {
                actions: [],
                actionIndex: 0,
                currentAction: null,
                currentActionSalvaged: false,
                target: target,
                paused: paused,
                complete: complete
            };

            this.addElement(target, element);
        }

        element.actions.push(action);

        action.startWithTarget(target);
    };

    ActionManager.prototype.remove =
    ActionManager.prototype.removeAction = function(action) {
        if (action == null) {
            return;
        }

        var target = action.getOriginalTarget();
        var element = this.getElement(target);
        if (element != null) {
            if (element.complete) {
                element.complete.run();
            }

            var index = element.actions.indexOf(action);
            if (index != -1) {
                this.removeActionAtIndex(index, element);
            }
        }
    };

    ActionManager.prototype.removeAllActions = function() {
        
    };

    ActionManager.prototype.removeAllActionsFromTarget = function(target) {
        
    };

    ActionManager.prototype.removeActionAtIndex = function(index, element) {
        var action = element.actions[index];

        if (action == element.currentAction && (!element.currentActionSalvaged)) {
             element.currentActionSalvaged = true;
        }

        element.actions.splice(index, 1);
        
        if (element.actionIndex >= index) {
            element.actionIndex--;
        }

        if (element.actions.length == 0) {
            if (this._currentTarget == element) {
                this._currentTargetSalvaged = true;
            }
            else {
                this.delElement(element.target);
            }
        }
    };

    ActionManager.prototype.pauseTarget = function(target) {

    };

    ActionManager.prototype.resumeTarget = function(target) {

    };

    ActionManager.prototype.update = function() {
        var delta = Laya.timer.delta/1000;
        var keys = Object.keys(this._targets);
        for (var i = 0, size = keys.length; i < size; i++) {
            var target = keys[i];
            var element = this._currentTarget = this._targets[target];
            this._currentTargetSalvaged = false;

            if (!element.paused) {
                for (element.actionIndex = 0; element.actionIndex < element.actions.length; element.actionIndex++) {
                    element.currentAction = element.actions[element.actionIndex];

                    if (element.currentAction == null) {
                        continue;
                    }

                    element.currentActionSalvaged = false;
                    element.currentAction.step(delta);

                    if (element.currentActionSalvaged) {
                        //element.currentAction.release();
                    }
                    else if (element.currentAction.isDone()) {
                        element.currentAction.stop();
                        this.removeAction(element.currentAction);
                    }

                    element.currentAction = null;
                }
            }


            if (this._currentTargetSalvaged && element.actions.length == 0) {
                this.delElement(target);
            }
        }
    };

    return ActionManager;
} (laya.events.EventDispatcher));