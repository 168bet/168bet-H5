//*倍率灯对象
var MultipleLightBox = (function(_super) {
    function MultipleLightBox(posList) {
        MultipleLightBox.super(this);

        this.posList = posList;
        this.endIndex = 0;
        this.startIndex = 0;
        this.nextIndex = 0;
        this.stopState = true;
        this.canDoBlinkAction = false;

        this.moveTime = 1;

        this.init();
    }

    Laya.class(MultipleLightBox, "MultipleLightBox", _super);

    MultipleLightBox.prototype.init = function () {
        this.x = this.posList[0].x;
        this.y = this.posList[0].y;
    };

    //*设定初始的坐标
    MultipleLightBox.prototype.setPositionByPosList = function (index) {
        if (this.posList[index]) {
            this.x = this.posList[index].x;
            this.y = this.posList[index].y;
        }
    };

    MultipleLightBox.prototype.startMove = function (endIndex) {
        this.endIndex = endIndex;
        this.stopState = false;
        this.nextIndex = this.startIndex + 1;
        this.moveTime = 1;
        Laya.timer.loop(400, this, this.update);
        this.moving();
    };

    MultipleLightBox.prototype.update = function () {
        this.moveTime += 1;
    };

    MultipleLightBox.prototype.moving = function () {
        var endPos = this.getNextPos();
        var moveAction = Place.create(endPos.x, endPos.y);
        this.setGlowNum(this.nextIndex - 1);
        var self = this;
        var callBack = CallFunc.create(Laya.Handler.create(this, function () {
            if (self.stopState) {
                if (self.x != self.posList[this.endIndex].x) {
                    self.moving();
                }
                else {
                    self.setGlowNum(this.endIndex);
                }
            }
            else {
                self.moving();
            }
        }));

        var delayTime = 200 / this.calcMovingSpeed() / 10;
        if (delayTime <= 0) {
            delayTime = 0.5;
            this.stopMove();
        }
        this.sequence = Sequence.create(moveAction, DelayTime.create(delayTime) ,callBack);

        App.actionManager.addAction(this.sequence, this);
    };

    MultipleLightBox.prototype.calcMovingSpeed = function () {
        return (MultipleLightBox.SPEED_CONSTANT + MultipleLightBox.ACCELERATION * this.moveTime) * this.moveTime;
    };

    MultipleLightBox.prototype.getNextPos = function () {
        var index = this.nextIndex;

        var posListLength = this.posList.length;

        if (index > posListLength - 1) {
            index = 0;
        }

        var result = {
            x: this.posList[index].x,
            y: this.posList[index].y
        };

        this.nextIndex = index + 1;

        return result;
    };

    MultipleLightBox.prototype.stopMove = function () {
        this.stopState = true;
        Laya.timer.clear(this, this.update);
    };

    MultipleLightBox.prototype.setGlowNum = function (index) {
        for (var lightIndex = 0; lightIndex < this.posList.length; lightIndex ++) {
            var glowNum = this.posList[lightIndex].getChildByName("glowNum");
            glowNum.visible = false;
            if (lightIndex == index) {
                glowNum.visible = true;
            }
        }
    };

    MultipleLightBox.prototype.doLightBlink = function () {
        this.canDoBlinkAction = true;
        this.blinkLight();
    };

    MultipleLightBox.prototype.blinkLight = function () {
        var self = this;
        var blinkAction = Blink.create(0.4, 2);
        var callBack = CallFunc.create(Laya.Handler.create(this, function () {
            if (self.canDoBlinkAction) {
                self.blinkLight();
            }
        }));
        var sequence = Sequence.create(blinkAction,callBack);
        App.actionManager.addAction(sequence, this);
    };

    MultipleLightBox.prototype.stopLightBlink = function () {
        this.canDoBlinkAction = false;
    };

    MultipleLightBox.SPEED_CONSTANT = 100;
    MultipleLightBox.ACCELERATION = -7;

    return MultipleLightBox;
}(MultipleLightBoxUI));