/*
* created by 伊健
* 水果机灯光转动效果
* */

var FruitLightBox = (function(_super) {
    function FruitLightBox(posInfo) {
        FruitLightBox.super(this);

        this.allFruitsPosList       = App.uiManager.getAllRotaryFruits();   //获取面板中水果格子的位置
        this.fruitListLength        = this.allFruitsPosList.length;         //所有水果格子的总数
        this.endIndex               = posInfo.endIndex;                     //目标位置
        this.startIndex             = posInfo.startIndex;                   //初始位置
        this.destroyIndex           = posInfo.destroyIndex;                 //是否要中途销毁 如果是尾随灯则需要中途销毁
        this.isLuckyRound           = posInfo.isLuckyRound;                 //是否转到幸运灯
        this.lightIndex             = posInfo.lightIndex;                   //标记是否是第一个灯，因为第一个灯之后的灯就只转一下
        this.nextIndex              = this.startIndex + 1;                  //下一次要走到的位置
        this.canDoBlinkAction       = false;                                //控制能否闪烁
        this.moveTime               = 1;                                    //开始进行的时间 用于计算速度

        this._movingCount           = 0;                                    //此灯移动的次数
        this._topSpeedCount         = 0;                                    //达到最高速之后转动的次数
        this._dampingCount          = 0;                                    //从转动次数多少开始衰减的
        this._slideCount            = 0;                                    //衰减到最低速度滑行的格子数
        this._followLightClose      = false;                                //这个是跟随灯的话 是否关闭
        this._lightJump             = 1;                                    //灯光跳动格数 由于需要超过一帧一格的移动有时需要移动多个格子
        this._lastMoveStamp         = 0;                                    //上次移动的时间戳(毫秒)

        this.init();
    }

    Laya.class(FruitLightBox, "FruitLightBox", _super);

    //*初始化灯的混合模式和透明度
    FruitLightBox.prototype.initBlendModeAndAlpha = function () {
        this.highLight.blendMode = "light";
        this.middle.blendMode = "light";
        if (this.destroyIndex > 0) {
            var alpha = 0.5 - (this.destroyIndex - 1)/10;
            this.middle.alpha = alpha;
            this.bottomPanel.alpha = alpha;
        }
    };

    FruitLightBox.prototype.init = function () {
        this.x = this.allFruitsPosList[this.startIndex].x;
        this.y = this.allFruitsPosList[this.startIndex].y;

        this.initBlendModeAndAlpha();
    };

    //每次移动的时候都计算一下速度 并且以移动格子格数当做运行时间
    FruitLightBox.prototype.calcMovingSpeed = function () {
        var accelerationTimes;
        var speed = 0;

        this._movingCount += this._lightJump;

        //先是加速的
        if (this._topSpeedCount <= 0) {
            if (this._movingCount < FruitLightBox.PREPARE_COUNT) {
                speed = FruitLightBox.BASE_SPEED;
            }
            else {
                accelerationTimes = this._movingCount - FruitLightBox.PREPARE_COUNT;
                speed = FruitLightBox.BASE_SPEED + FruitLightBox.ACCELERATION_ASC * accelerationTimes;
                if (speed >= FruitLightBox.TOP_SPEED) {
                    speed = FruitLightBox.TOP_SPEED;
                    this._topSpeedCount = 1;
                }
            }

            return speed;
        }

        //达到最高速之后保持最高速一段时间
        if (this._topSpeedCount < FruitLightBox.ON_TOP_SPEED_COUNT) {
            this._topSpeedCount += this._lightJump;

            return FruitLightBox.TOP_SPEED;
        }

        if (this._slideCount <= 0) {
            //开始减速到初始速度
            if (this._dampingCount <= 0) {
                this._dampingCount = this._movingCount;
            }

            accelerationTimes = this._movingCount - this._dampingCount;
            speed = FruitLightBox.TOP_SPEED + FruitLightBox.ACCELERATION_DESC * accelerationTimes;
            if (this.destroyIndex && this.destroyIndex > 0) {
                switch (this.destroyIndex) {
                    case 1: {
                        if (speed < FruitLightBox.TOP_SPEED / 2) {
                            this._followLightClose = true;
                        }
                        break;
                    }
                    case 2: {
                        if (speed < FruitLightBox.TOP_SPEED / 4) {
                            this._followLightClose = true;
                        }
                    }
                }
            }
            if (speed <= FruitLightBox.BASE_SPEED) {
                speed = FruitLightBox.BASE_SPEED;
                this._slideCount = 1;
            }

            return speed;
        }

        this._slideCount += this._lightJump;
        return FruitLightBox.BASE_SPEED;
    };

    FruitLightBox.prototype.move = function () {
        App.uiManager.setFruitUnGlowByIndex(this.nextIndex - 1);
        var endPos = this.getNextMovePosition();
        this.x = endPos.x;
        this.y = endPos.y;

        App.uiManager.setFruitGlowByIndex(this.nextIndex - 1);

        var moveSpeed = this.calcMovingSpeed();
        
        //控制尾随灯的销毁
        if (this.destroyIndex && this.destroyIndex > 0) {
            if (this._followLightClose) {
                App.uiManager.setFruitUnGlowByIndex(this.nextIndex - 1);
                this.dispose();
                return;
            }
        }

        if (this.isLuckyRound || (this.lightIndex && this.lightIndex > 1)) {
            if (this.endIndex ==  this.nextIndex - 1) {
                //*已经停止
                this.event(FruitLightBox.STOP_MOVE);
                this.willCreateNextLightBlink();
                return;
            }

            var delayTime = 30;
        }
        else{
            //保证一定量的停止前滑行格子数量
            if (this._slideCount > FruitLightBox.LEAST_SLIDE_COUNT) {
                if (this.endIndex == this.nextIndex - 1) {
                    //*已经停止
                    this.event(FruitLightBox.STOP_MOVE);
                    this.willCreateNextLightBlink();
                    return;
                }
            }
            //跳灯数默认1 每次都需要默认一下
            this._lightJump = 1;

            //当前时间戳
            var nowMillisecond = Papaya.moment().format('x');
            //这个时间是多少毫秒要移动的格子数
            var delayTime = Math.ceil(1000 / moveSpeed);
            var timeDiff = nowMillisecond - this._lastMoveStamp;
            
            // delayTime < 20 接近1帧一格之后才开始做跳格处理
            // this._lastMoveStamp > 0 这个是初始值保护 防止第一次就跳了
            // timeDiff > delayTime  时间差比所需时间长 说明有需要调格了 因为两次表演之间的空隙已经比需要的大了
            if (delayTime < 20 && this._lastMoveStamp > 0 && timeDiff > delayTime) {
                this._lightJump += Math.floor(timeDiff / delayTime);
            }
            // 不需要跳太厉害 可以尝试去掉这里 会发现无法欺骗人眼了
            if (this._lightJump > 3) {
                this._lightJump = 3;
            }

            this._lastMoveStamp = nowMillisecond;          //小x是毫秒
        }

        Laya.timer.once(delayTime, this, this.move);
    };

    FruitLightBox.prototype.getNextMovePosition = function () {
        var index = this.nextIndex;

        var allFruitLength = this.fruitListLength;

        if (index > allFruitLength - 1) {
            index = index % allFruitLength;
        }

        var result = {
            x: this.allFruitsPosList[index].x,
            y: this.allFruitsPosList[index].y
        };

        this.nextIndex = index + this._lightJump;
        return result;
    };

    FruitLightBox.prototype.doLightBlink = function () {
        this.canDoBlinkAction = true;
        this.blinkLight();
    };

    FruitLightBox.prototype.blinkLight = function () {
        var self = this;
        var blinkAction = Blink.create(0.4, 2);
        var callBack = CallFunc.create(Laya.Handler.create(this, function () {
            if (this.canDoBlinkAction) {
                self.blinkLight();
            }
        }));
        var sequence = Sequence.create(blinkAction,callBack);
        App.actionManager.addAction(sequence, this);
    };

    FruitLightBox.prototype.willCreateNextLightBlink = function () {
        var self = this;
        var blinkAction = Blink.create(1, 4);
        var callBack = CallFunc.create(Laya.Handler.create(this, function () {
            Laya.timer.once(150, self, function () {
                self.event(FruitLightBox.CAN_CREATE_NEXT_LIGHT);
            })
        }));
        var sequence = Sequence.create(blinkAction, callBack);
        App.actionManager.addAction(sequence, this);
    };

    FruitLightBox.prototype.stopLightBlink = function () {
        this.canDoBlinkAction = false;
    };

    FruitLightBox.prototype.dispose = function () {
        Laya.timer.clearAll(this);
        this.removeSelf();
    };

    FruitLightBox.STOP_MOVE             = "stopMove";
    FruitLightBox.CAN_CREATE_NEXT_LIGHT = "canCreateNextLight";

    FruitLightBox.BASE_SPEED            = 5;                //初始速度
    FruitLightBox.ACCELERATION_ASC      = 5;
    FruitLightBox.ACCELERATION_DESC     = -5;
    FruitLightBox.TOP_SPEED             = 300;
    FruitLightBox.ON_TOP_SPEED_COUNT    = 50;               //在最高速转动的格子数目
    FruitLightBox.PREPARE_COUNT         = 10;               //准备加速的移动格子数
    FruitLightBox.LEAST_SLIDE_COUNT     = 5;               //停止前滑行至少格子数量

    return FruitLightBox;
}(FruitLightBoxUI));