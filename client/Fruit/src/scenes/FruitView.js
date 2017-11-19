var FruitMainView = (function(_super) {
    var Fruit = null;
    var Rotary = null;

    function FruitMainView() {
        FruitMainView.super(this);

        this.rotaryfruitList        = null;
        this.fruitNameList          = null;
        this.rotaryGuessType        = null;

        this.rotaryFruitCellList    = [];
        this.fruitBetBtnList        = {};
        this.fruitBetBtnEffects     = {};
        this.fruitBetLabelList      = {};
        this.fruitLightList         = [];
        this.fruitBettingList       = {};//*下注列表
        this.fruitBetShowList       = {};//*1-9
        this.lowMultipleImgs        = [];
        this.highMultipleImgs       = [];
        this.rotaryFruitBoxList     = [];

        this.bonusWin               = 0;//*奖励
        this.balance                = 0;//*手上的赌金
        this.betFactor              = 1;//*下注因数
        this.betFactorList          = [1, 5, 10, 20, 50, 100];
        this.betFactorIndex         = 0;
        this.betTotal               = 0;//*下注总数

        this.multiples              = {low: 10, high: 20};
        this.guessCanBetTotal       = 0;
        this.guessedNum             = 0;//*猜大小的结果

        this.canBetFruit            = true;
        this.canGuessNum            = false;
        this.canTouchGoBtn          = false;

        this.isRandomShowInBetLab   = false;//*是否已经显示随机数字
        this.isPromptThisRound      = false;//*是否显示了结算

        this.recordItemTotal        = 30;

        this.gameState              = FruitMainView.STATE_GAME_INIT;

        this._playLoadMus           = true;
        this._saveData              = {}; //*上次游戏状态
    }

    Laya.class(FruitMainView, "FruitMainView", _super);

    FruitMainView.prototype.init = function (data) {
        //this._saveData = data;
        this._saveData = {
            furitBetList: {
                "GG":1,
                "77":1,
                "Star":1,
                "Watermelon":1,
                "Bell":1,
                "Pomelo":1,
                "Orange":1,
                "Apple":1
            },
            betFactor: 5,
            lastFruit: {
                rotaryFruits: [11],
                luckRewardFruits: [],
                normalRewardFruits: []
            },
            multiples: {low: 20, high: 20},
            bonusWin: -10,
            guessedType: "1-6",
            guessedNum: 2,
            guessBet: 20,
        };
        this.initGameRotary();
        this.initEvent();
        this.initFruitRotaryShow();
        if (this._saveData["betFactor"]) {
            this.betFactor = this._saveData["betFactor"];
            this.betFactorIndex = this.betFactorList.indexOf(this.betFactor);
            this.setBetFactorLabText();
        }

        if (this._saveData["furitBetList"] && Object.keys(this._saveData["furitBetList"]).length > 0) {
            this.fruitBetShowList = this._saveData["furitBetList"];
            for (var index in this.fruitBetShowList) {
                this.setBettingLabelText(index, this.fruitBetShowList[index]);
                this.fruitBettingList[index] = this.fruitBetShowList[index] * this.betFactor;
            }
        }
        else {
            this.initFruitBettingList();
        }

        this.setBetTotalLabText();
        this.initTopInfoShow();

        if (this._saveData["lastFruit"]) {
            //*水果结果
            for (var i in this._saveData["lastFruit"]) {
                var info = this._saveData["lastFruit"][i];
                for (var infoIndex in info) {
                    var light = new FruitLightBox({startIndex: info[infoIndex]});
                    light.zOrder = 1;
                    this.fruitBgBox.addChild(light);
                    this.fruitLightList.push(light);
                    //*水果灯亮
                    if (info[infoIndex] == FruitMainView.BLUE_LUCK_INDEX) {
                        this.setEggActionVisible("blue", true);
                    }
                    else if (info[infoIndex] == FruitMainView.GOLDEN_LUCK_INDEX) {
                        this.setEggActionVisible("golden", true);
                    }
                    else {
                        App.uiManager.setFruitGlowByIndex(info[infoIndex]);
                    }
                }
            }
            this.gameState = FruitMainView.STATE_GUESS_BETTING;
        }

        if (this._saveData["bonusWin"]) {
            if (this._saveData["bonusWin"] > 0) {
                this.bonusWin = this._saveData["bonusWin"];
                this.setBonusWinLabText();
                this.balance = this.balance - this.bonusWin;
                this.setCreditLabText();
                this.gameState = FruitMainView.STATE_GUESS_BETTING;
            }
        }

        if (this._saveData["guessedNum"]) {
            //*博大小数字
            this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = this._saveData["guessedNum"];
        }

        if (this._saveData["multiples"]) {
            //*倍率灯
            this.multiples = this._saveData["multiples"];
            this._lowLightEndIndex = Rotary.RANDOM_MULTIPLE_LOW.indexOf(this.multiples.low);
            this._highLightEndIndex = Rotary.RANDOM_MULTIPLE_HIGH.indexOf(this.multiples.high);
            this.lightOfMultipleDisplay();
        }

        if (this._saveData["guessedType"]) {
            if (this._saveData["bonusWin"]) {
                if (this._saveData["bonusWin"] > 0) {
                    this.gameState = FruitMainView.STATE_GUESS_BETTING;
                    //*猜中闪灯
                    switch (this._saveData["guessedType"]) {
                        case this.rotaryGuessType.LOW: {
                            this.setLowLightVisible(true);
                            this.setHighLightVisible(false);
                            this.lowLightBlink();
                            break;
                        }
                        case this.rotaryGuessType.HIGH: {
                            this.setHighLightVisible(true);
                            this.setLowLightVisible(false);
                            this.highLightsBlink();
                            break;
                        }
                    }
                }
                else {
                    this.gameState = FruitMainView.STATE_FRUIT_BETTING;
                    this.initFruitBettingList();
                    for (var index in this.fruitBetShowList) {
                        this.setBettingLabelText(index, this.fruitBetShowList[index]);
                        this.fruitBettingList[index] = this.fruitBetShowList[index] * this.betFactor;
                    }
                }
            }
        }
    };

    FruitMainView.prototype.initGameRotary = function () {
        Fruit = Papaya.Fruit;
        Rotary = Fruit.Rotary;

        this.rotaryfruitList = Rotary.ROTARY_FRUITS;
        this.fruitNameList = Rotary.FRUIT_NAME_LIST;
        this.rotaryGuessType = Rotary.GUESS_SIZE_TYPE;
    };

    FruitMainView.prototype.initEvent = function () {
        this.allAddBtn.on(Laya.Event.CLICK, this, this.onAllFruitAddBet);

        var guessBtn = {
            Low: this.lowNumBtn,
            High: this.highNumBtn
        };

        for (var guessIndex in guessBtn) {
            guessBtn[guessIndex].on(Laya.Event.CLICK, this, this.onGuessNumber, [guessIndex]);
        }

        var guessBetBtn = {
            Add: this.betAddDoubleBtn,
            Cut: this.betCutDoubleBtn
        };
        for (var guessBetIndex in guessBetBtn){
            guessBetBtn[guessBetIndex].on(Laya.Event.CLICK, this, this.onGuessBetting, [guessBetIndex]);
        }

        this.betAddBtn.on(Laya.Event.CLICK, this, this.onChangeBetFactor);

        this.goBtn.on(Laya.Event.CLICK, this, this.onFruitRotaryRun);

        this.explainBtn.on(Laya.Event.CLICK, this, this.touchExplain);

        this.initFruitBetBtnEvent();

        Laya.timer.frameLoop(1, this, this.update);
    };

    FruitMainView.prototype.initFruitBetBtnEvent = function () {
        var fruitBtnUIBox = this.fruitBtnBox;
        var fruitNameListLength = this.fruitNameList.length;
        var index = 0;
        var fruitName = "";
        var fruitBetBtn = null;
        for (index; index < fruitNameListLength; index++) {
            fruitName = this.fruitNameList[index];
            fruitBetBtn = fruitBtnUIBox.getChildByName(fruitName + "Btn");
            fruitBetBtn.on(Laya.Event.CLICK, this, this.onBetFruit, [fruitName, false]);
            this.fruitBetBtnList[fruitName] = fruitBetBtn;
        }
    };

    FruitMainView.prototype.initFruitBettingList = function () {
        var index;
        if (Object.keys(this.fruitBettingList).length > 0) {
            for (index in this.fruitBettingList) {
                this.fruitBettingList[index] = 0;
                this.fruitBetShowList[index] = 0;
            }
        }
        else {
            var fruitName = "";
            for (index in this.fruitNameList) {
                fruitName = this.fruitNameList[index];
                this.fruitBettingList[fruitName] = 0;
                this.fruitBetShowList[fruitName] = 0;
            }
        }
    };

    FruitMainView.prototype.initFruitRotaryShow = function () {
        this.initRotaryFruitCell();
        this.initRotaryLabelShow();
        this.initMultipLights();
        this.initRecordBoxList();
        this.initEffect();
    };

    FruitMainView.prototype.initRotaryFruitCell = function () {
        var fruitRotaryUIBox = this.fruitBgBox;
        var cellTotal = this.rotaryfruitList.length;
        var cellIndex = 0;
        var singleCell = null;
        var rotaryFruit = null;

        for (cellIndex; cellIndex < cellTotal; cellIndex++) {
            //*获取转盘上的格子
            singleCell = fruitRotaryUIBox.getChildByName("fruitBg_" + cellIndex);

            //*创建转盘的上的水果显示
            var fruit = this.rotaryfruitList[cellIndex];
            rotaryFruit = new FruitBox(fruit);
            rotaryFruit.anchorX = 0.5;
            rotaryFruit.anchorY = 0.5;
            rotaryFruit.x = singleCell.x + 45;
            rotaryFruit.y = singleCell.y + 44;
            rotaryFruit.zOrder = 10;
            this.fruitBgBox.addChild(rotaryFruit);

            if (cellIndex == FruitMainView.GOLDEN_LUCK_INDEX) {
                var goldRoatBg = new Laya.Image();
                goldRoatBg.skin = "assets/ui.images/img_0004_mc1.png";
                goldRoatBg.anchorX = 0.5;
                goldRoatBg.anchorY = 0.5;
                goldRoatBg.x = singleCell.x + 45;
                goldRoatBg.y = singleCell.y + 44;
                this.fruitBgBox.addChild(goldRoatBg);
            }
            else if (cellIndex == FruitMainView.BLUE_LUCK_INDEX) {
                var blueRoatBg = new Laya.Image();
                blueRoatBg.skin = "assets/ui.images/img_0005_mc1.png";
                blueRoatBg.anchorX = 0.5;
                blueRoatBg.anchorY = 0.5;
                blueRoatBg.x = singleCell.x + 45;
                blueRoatBg.y = singleCell.y + 44;
                this.fruitBgBox.addChild(blueRoatBg);
            }

            this.rotaryFruitBoxList.push(rotaryFruit);
            this.rotaryFruitCellList.push(singleCell);
        }

        //*储存格子
        App.uiManager.setAllRotaryFruits(this.rotaryFruitCellList);
        //*储存水果
        App.uiManager.setRotaryFruitBoxList(this.rotaryFruitBoxList);

        this.setFruitCellBgGray();
    };

    FruitMainView.prototype.setFruitCellBgGray = function () {
        var length = this.rotaryFruitCellList.length;
        var skin = "";
        for (var i = 0; i < length; i++) {
            if (i == FruitMainView.GOLDEN_LUCK_INDEX) {
                skin = App.uiManager.getFruitCellGraySkin("golden");
            }
            else if (i == FruitMainView.BLUE_LUCK_INDEX) {
                skin = App.uiManager.getFruitCellGraySkin("blue");
            }
            else {
                var num = i%2;
                if (num <= 0) {
                    skin = App.uiManager.getFruitCellGraySkin("deep");
                }
                else {
                    skin = App.uiManager.getFruitCellGraySkin("shallow");
                }
            }
            this.rotaryFruitCellList[i].skin = skin;
        }

        for (var index in this.rotaryFruitBoxList) {
            this.rotaryFruitBoxList[index].setFruitGray();
        }
    };

    FruitMainView.prototype.initRotaryLabelShow = function () {
        var label = null;
        var zeroLabelBox = this.zeroLabBox;
        for (var zeroLabIndex = 0; zeroLabIndex < FruitMainView.GRAY_ZERO_LAB_TOTAL; zeroLabIndex++) {
            label = zeroLabelBox.getChildByName("zeroLab_" + zeroLabIndex);
            label.font = "white";
            label.text = "88";
        }

        var fruitName = "";
        var fruitListLength = this.fruitNameList.length;
        for (var redLabIndex = 0; redLabIndex < fruitListLength; redLabIndex++) {
            fruitName = this.fruitNameList[redLabIndex];
            label = zeroLabelBox.getChildByName(fruitName + "BetLab");
            label.font = "red";
            label.text = "0";
            this.fruitBetLabelList[fruitName] = label;
        }

        this.guessNumZeroLab.font = "white";
        this.guessNumZeroLab.text = "88";
        this.guessNumLab.font = "red";
        this.guessNumLab.text = "";
        this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX] = this.guessNumLab;

        var topLabelList = [this.betLab, this.bonusWinLab, this.creditLab];
        for (var topLabelIndex = 0; topLabelIndex < 3; topLabelIndex++) {
            label = topLabelList[topLabelIndex];
            label.font = "yellow";
            label.text = "0";
        }

        this.totalBetLab.font = "yellow";
        this.totalBetLab.text = "0";
    };

    //*初始化倍率灯
    FruitMainView.prototype.initMultipLights = function () {
        var lowMultiple = Rotary.RANDOM_MULTIPLE_LOW;
        var highMultiple = Rotary.RANDOM_MULTIPLE_HIGH;

        for (var index = 1; index < 4; index ++) {
            var lowLight = this.multipleLightBox.getChildByName("low" + index);
            lowLight.visible = false;
            this.lowMultipleImgs.push(lowLight);

            var highLight = this.multipleLightBox.getChildByName("high" + index);
            highLight.visible = false;
            this.highMultipleImgs.push(highLight);
        }
    };

    FruitMainView.prototype.initRecordBoxList = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = FruitRecordBox || new laya.ui.Box();

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 0;
        list.y = 0;
        list.width = this.recordListBox.width;
        list.height = this.recordListBox.height;

        list.spaceY = 5;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.recordItemListBox = list;
        this.recordListBox.addChild(list);
    };

    FruitMainView.prototype.initEffect = function () {
        this.goBtnEffect = App.animManager.get("ani.btn.goEffect");
        this.goBtnEffect.x -= 15;
        this.goBtnEffect.y -= 16;
        this.goBtnEffect.play();
        this.goBtnEffect.blendMode = "light";
        this.goBtn.addChild(this.goBtnEffect);

        this.eggsActions = {};
        var eggs = ["blue", "golden"];
        for (var i = 0; i < eggs.length; i++) {
           var eggName = eggs[i];
           this.initEggEffectAndAction(eggName);
        }
        this.setAllEggActionVisible(false);

        this.initArrowEffect();

        this.initFruitBtnEffect();
    };

    //*luck的特效和动作
    FruitMainView.prototype.initEggEffectAndAction = function (type) {
        var index = 0;
        var animName = "";
        var effectId = 10001;
        this.eggsActions[type] = [];
        switch (type) {
            case "golden": {
                index = FruitMainView.GOLDEN_LUCK_INDEX;
                animName = "ani.goldenLucky.rotate";
                effectId = 10001;
                break;
            }

            case "blue": {
                index = FruitMainView.BLUE_LUCK_INDEX;
                animName = "ani.blueLucky.rotate";
                effectId = 10002;
                break;
            }
        }

        var singleCell = this.rotaryFruitCellList[index];
        var rotaAction = App.animManager.get(animName);
        rotaAction.x = singleCell.x + 6;
        rotaAction.y = singleCell.y + 5;
        rotaAction.scaleX = 0.85;
        rotaAction.scaleY = 0.85;
        rotaAction.zOrder = 100;
        this.fruitBgBox.addChild(rotaAction);
        rotaAction.play();

        var effect = SpineEffect.create(effectId);
        if (effect) {
            effect.x = singleCell.x + 40;
            effect.y = singleCell.y + 106;
            effect.zOrder = 100;
            this.fruitBgBox.addChild(effect);
            effect.play();
            this.eggsActions[type].push(effect);    
        }

        this.eggsActions[type].push(rotaAction);
    };

    FruitMainView.prototype.setEggActionVisible = function (type, visible) {
        var actions;
        if (type && typeof(visible) == "boolean") {
            actions = this.eggsActions[type];
            if (actions) {
                for (var i = 0; i < actions.length; i++) {
                    actions[i].visible = visible;
                }
            }
        }
    };

    FruitMainView.prototype.setAllEggActionVisible = function (visible) {
        if (typeof(visible) == "boolean") {
            for (var index in this.eggsActions) {
                var actions = this.eggsActions[index];
                for (var actionIndex in actions) {
                    actions[actionIndex].visible = visible;
                }
            }
        }
    };

    //*猜大小箭头动画和特效
    FruitMainView.prototype.initArrowEffect = function () {
        this.arrowEffects = [];
        var rightArrow = SpineEffect.create(10003);
        if (rightArrow) {
            rightArrow.x = 50;
            rightArrow.y = 75;
            this.betCutDoubleBtn.addChild(rightArrow);
            rightArrow.play();
            this.arrowEffects.push(rightArrow);
        }

        var leftArrow = SpineEffect.create(10003);
        if (leftArrow) {
            leftArrow.scaleX = - leftArrow.scaleX;
            leftArrow.x = 50;
            leftArrow.y = 75;
            this.betAddDoubleBtn.addChild(leftArrow);
            leftArrow.play();
            this.arrowEffects.push(leftArrow);
        }

        var arrowList = [this.betCutDoubleBtn, this.betAddDoubleBtn];
        for (var i = 0; i < arrowList.length; i ++) {
            //*发光，混合模式
            var lanse = new Laya.Image();
            lanse.skin = "assets/ui.images/lanse.png";
            lanse.blendMode = "light";
            arrowList[i].addChild(lanse);

            var lightMoveAction = App.animManager.get("ani.btn.lightMoveEffect");
            lightMoveAction.x = 0;
            lightMoveAction.y = 6;
            lightMoveAction.interval = 100;
            lightMoveAction.blendMode = "light";
            arrowList[i].addChild(lightMoveAction);
            lightMoveAction.play();

            var fadeActionLight = FadeTo.create(0.4, 0.2);
            var fadeActionLight2 = FadeTo.create(0.4, 0.8);
            var seq1 = Sequence.create(fadeActionLight, DelayTime.create(0.6) ,fadeActionLight2).repeatForever();
            App.actionManager.addAction(seq1, lightMoveAction);

            var fadeAction = FadeTo.create(0.4, 0);
            var fadeAction2 = FadeTo.create(0.4, 0.8);
            var seq = Sequence.create(fadeAction, DelayTime.create(0.6) ,fadeAction2).repeatForever();
            App.actionManager.addAction(seq, lanse);

            this.arrowEffects.push(lanse);
            this.arrowEffects.push(lightMoveAction);
        }

        this.setArrowEffectVisible(false);
    };

    FruitMainView.prototype.setArrowEffectVisible = function (visible) {
        if (typeof(visible) != "boolean") {
            visible = false;
        }

        for (var i = 0; i < this.arrowEffects.length; i++) {
            this.arrowEffects[i].visible = visible;
        }

        this.leftArrow.visible = !visible;
        this.rightArrow.visible = !visible;
    };

    //*押注水果按钮的特效
    FruitMainView.prototype.initFruitBtnEffect = function () {
        var btnName = "";
        var btn = null;
        var imgSkin = "assets/ui.images/luse.png";
        for (btnName in this.fruitBetBtnList) {
            btn = this.fruitBetBtnList[btnName];
            var btnEffect = new Laya.Image();
            btnEffect.skin = imgSkin;
            btnEffect.blendMode = "light";
            btn.addChild(btnEffect);

            var fadeAction = FadeTo.create(0.4, 0);
            var fadeAction2 = FadeTo.create(0.4, 0.8);
            var seq = Sequence.create(fadeAction, DelayTime.create(0.6) ,fadeAction2).repeatForever();
            App.actionManager.addAction(seq, btnEffect);

            this.fruitBetBtnEffects[btnName] = btnEffect;
        }
    };

    FruitMainView.prototype.initTopInfoShow = function () {
        var player = App.player;
        this.balance = player.balance;

        this.setCreditLabText();
        this.setBetFactorLabText();
    };

    FruitMainView.prototype.setCreditLabText = function (balance) {
        var oldBalance = Number(this.creditLab.text);
        balance = balance || this.balance;
        App.actionManager.add(
            NumberTo.create(0.5, oldBalance, balance),
            this.creditLab
        );
    };

    FruitMainView.prototype.setBetFactorLabText = function (betFactor) {
        betFactor = betFactor || this.betFactor;
        this.betLab.text = betFactor;
    };

    FruitMainView.prototype.setBonusWinLabText = function (bonus) {
        var oldBonus = Number(this.bonusWinLab.text);
        bonus = bonus || this.bonusWin;
        if (bonus > 0) {
            this.bonusWinLab.text = bonus;
        }
        else {
            App.actionManager.add(
                NumberTo.create(0.5, oldBonus, bonus),
                this.bonusWinLab
            );
            this.playFruitSound("push_coin");
        }
    };

    FruitMainView.prototype.setBettingLabelText = function (fruitName, randNum) {
        if (this.fruitNameList.indexOf(fruitName) == -1) {
            return;
        }
        
        if (randNum || randNum == "") {
            this.fruitBetLabelList[fruitName].text = randNum;
        }
        else {
            this.fruitBetLabelList[fruitName].text = this.fruitBetShowList[fruitName];
        }
    };

    FruitMainView.prototype.setBetTotalLabText = function () {
        this.totalBetLab.text = this.getFruitBetTotal();
    };

    FruitMainView.prototype.showFruitResultPrompt = function () {
        var promptInfo = this._promptInfo;
        this.promotByFruitList = [];
        this.playPromotIndex = 0;
        var promptStr = "";
        var onceTimer = 0;
        if (promptInfo.hasBigTriple) {
            onceTimer += 1000;
            Laya.timer.once(onceTimer, this, this.playFruitSound, ["Y114"], false);
        }

        if (promptInfo.hasQuadruple) {
            onceTimer += 1000;
            Laya.timer.once(onceTimer, this, this.playFruitSound, ["Y117"], false);
        }

        if (promptInfo.hasSmallTriple) {
            onceTimer += 1000;
            Laya.timer.once(onceTimer, this, this.playFruitSound, ["Y115"], false);
        }
    };

    FruitMainView.prototype.updatePromptByFruit = function () {
        Laya.timer.loop(1000, this, this.updateShowPrompt);
    };

    FruitMainView.prototype.closeUpdatePromptTimer = function () {
        Laya.timer.clear(this, this.updateShowPrompt);
    };

    FruitMainView.prototype.updateShowPrompt = function () {
        this.playPromotIndex ++;
        if (this.playPromotIndex >= this.promotByFruitList.length) {
            this.playPromotIndex = 0;
        }

        var promptStr = this.promotByFruitList[this.playPromotIndex];
        this.setPromptLabText(promptStr);
    };

    FruitMainView.prototype.setPromptLabText = function (promptStr) {
        promptStr = promptStr || "";
        this.promptLab.text = promptStr;
    };

    FruitMainView.prototype.updateBetting = function () {
        //*下注保存
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

        };

        var api = "/fruit/betFruit";
        var params = {
            fruitBetList: JSON.stringify(self.fruitBetShowList)
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    FruitMainView.prototype.onAllFruitAddBet = function () {
        if (this.gameState == FruitMainView.STATE_GAME_INIT || this.gameState == FruitMainView.STATE_FRUIT_BETTING) {
            this.playFruitSound("collect_coin_in");
            for (var fruitNameIndex in this.fruitNameList) {
                fruitName = this.fruitNameList[fruitNameIndex];
                this.onBetFruit(fruitName, true);
            }

            this.updateBetting();
        }
        else if (this.gameState == FruitMainView.STATE_GUESS_BETTING) {
            App.assetsManager.playSound("chip_in_fail");
        }
        else {
            App.assetsManager.playSound("chip_in_fail");
        }
    };

    FruitMainView.prototype.onBetFruit = function (fruitName, isAllBet) {
        if (!this.canBetFruit) {
            return;
        }

        if (this.fruitNameList.indexOf(fruitName) == -1) {
            return;
        }

        var betting = Number(this.fruitBetShowList[fruitName]);
        betting ++;
        if (betting >= 9) {
            betting = 9;
        }

        this.fruitBetShowList[fruitName] = betting;
        this.fruitBettingList[fruitName] = betting * this.betFactor;
        this.setBettingLabelText(fruitName);
        this.setBetTotalLabText();

        if (!isAllBet) {
            this.playFruitSound(fruitName + "_Btn");
            this.updateBetting();
        }
    };

    FruitMainView.prototype.showRandomNumInBetLab = function () {
        if (this.isRandomShowInBetLab) {
            return;
        }

        var rand = 0;
        for (var index in this.fruitNameList) {
            var fruitName = this.fruitNameList[index];
            rand = Math.floor(Math.random() * 13) + 1;
            this.setBettingLabelText(fruitName, rand);
        }

        this.isRandomShowInBetLab = true;
    };

    //*获取赌大小的结果
    FruitMainView.prototype.guessingNumber = function (guessType) {
        this.lightsUnBlinkOnView();
        this.stopLightBlink();
        if (this.gameState != FruitMainView.STATE_GUESS_BETTING) {
            App.assetsManager.playSound("chip_in_fail");
            return;
        }

        if (!this.canGuessNum) {
            App.assetsManager.playSound("chip_in_fail");
            return;
        }

        if (FruitMainView.GUESS_TYPE[guessType] == null) {
            this.updateGameStateToCanBet();
            return;
        }

        var type = null;
        var bet = this.bonusWin;

        switch (guessType) {
            case FruitMainView.GUESS_TYPE.Low: {
                type = this.rotaryGuessType.LOW;
                this.setLowLightVisible(false);
                this.setHighLightVisible(true);
                break;
            }
            case FruitMainView.GUESS_TYPE.High: {
                type = this.rotaryGuessType.HIGH;
                this.setLowLightVisible(true);
                this.setHighLightVisible(false);
                break;
            }
            default: {
                break;
            }
        }
        this.playFruitSound("Y002");
        App.assetsManager.playMusic("C13");
        this._playLoadMus = false;
        if (this.gameState == FruitMainView.STATE_GUESS_BETTING) {
            var self = this;

            var complete = function(err, data) {
                if (err != null) {
                    return;
                }

                self.onGuessRunning(data);
            };

            var api = "/fruit/guessTheSizeOf";
            var params = {
                bet: bet,
                betType: type
            };
            App.netManager.request(api, params, Laya.Handler.create(null, complete));
        }
    };

    FruitMainView.prototype.onGuessNumber = function (guessType) {
        //*赌大小上分
        var bet = this.bonusWin;
        if (this.gameState == FruitMainView.STATE_GUESS_BETTING) {
            var self = this;

            var complete = function(err, data) {
                if (err != null) {
                    return;
                }

                App.player.update(data.player);
                self.guessingNumber(guessType);
            };

            var api = "/fruit/guessWithdraw";
            var params = {
                bet: bet
            };
            App.netManager.request(api, params, Laya.Handler.create(null, complete));
        }
    };

    //*赌大小数字跳转表现开始
    FruitMainView.prototype.onGuessRunning = function (result) {
        this.gameState = FruitMainView.STATE_GUESS_RUNNING;

        App.player.update(result.player);

        this.bonusWin = result.bonusWin;
        this.guessedNum = result.randNum;
        this.guessRunningTime = 0;//*跳动的总时间
        this.slowTime = 0;

        Laya.timer.frameLoop(1, this, this.guessNumberAction);
        App.assetsManager.playSound("Y012", 3);
    };

    //*赌大小数字跳转动作表现
    FruitMainView.prototype.guessNumberAction = function () {
        var rand = Math.floor(Math.random() * 12) + 1;
        var dt = Laya.timer.delta;
        this.guessRunningTime += dt;

        if (this.guessRunningTime >= 800 && this.guessRunningTime < 1000){
            this.slowTime += dt;
            if (this.slowTime >= 50) {
                this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = rand;
                this.slowTime = 0;
            }
        }
        else if (this.guessRunningTime >= 1000 && this.guessRunningTime < 1200) {
            this.slowTime += dt;
            if (this.slowTime >= 80) {
                this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = rand;
                this.slowTime = 0;
            }
        }
        else if (this.guessRunningTime >= 1200 && this.guessRunningTime < 1500) {
            this.slowTime += dt;
            if (this.slowTime >= 130) {
                this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = rand;
                this.slowTime = 0;
            }
        }
        else if (this.guessRunningTime >= 1500) {
            Laya.timer.clear(this, this.guessNumberAction);
            this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = this.guessedNum;
            if (!this.isRandomShowInBetLab) {
                this.showRandomNumInBetLab();
            }
            this.isRandomShowInBetLab = false;
            if (this.bonusWin < 0) {
                this.updateGameStateToCanBet();
                var soundName = FruitMainView.SOUNDNAME_UNFOTUNATELY[Math.floor(Math.random() * 2)%2];
                this.playFruitSound(soundName);
                App.assetsManager.playMusic("loading");
                this._playLoadMus = true;
            }
            else if (this.bonusWin > 0) {
                this.guessCanBetTotal = this.bonusWin * 2;
                this.setBonusWinLabText();
                this.gameState = FruitMainView.STATE_GUESS_BETTING;
                this.lowLightBlink();
                this.highLightBlink();
                Laya.timer.once(300, this, this.showRandomNumInBetLab);
                var soundName = FruitMainView.SOUNDNAME_VERY_GOOD[Math.floor(Math.random() * 2)%2];
                this.playFruitSound(soundName);
            }
            else {
                this.gameState = FruitMainView.STATE_GUESS_BETTING;

            }
        }
        else {
            this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = rand;
            this.slowTime = 0;
        }
    };

    FruitMainView.prototype.onGuessBetting = function (betType) {
        this.lightsUnBlinkOnView();

        if (this.gameState != FruitMainView.STATE_GUESS_BETTING) {
            App.assetsManager.playSound("chip_in_fail");
            return;
        }

        if (!this.canGuessNum) {
            App.assetsManager.playSound("chip_in_fail");
            return;
        }

        this.showRandomNumInBetLab();
        this.playFruitSound("Y002");
        var guessBet = this.bonusWin;
        switch (betType) {
            case FruitMainView.BET_BTN_TYPE.Add: {
                guessBet = this.bonusWin * 2;
                if (this.bonusWin > this.balance) {
                    return;
                }

                if (guessBet >= this.guessCanBetTotal) {
                    guessBet = this.guessCanBetTotal;
                }
                break;
            }

            case  FruitMainView.BET_BTN_TYPE.Cut: {
                guessBet --;
                if (guessBet <= 0) {
                    this.updateGameStateToCanBet();
                }
                break;
            }

            default: {

                break;
            }
        }

        this.setGuessBetting(guessBet);
    };

    FruitMainView.prototype.setGuessBetting = function (guessBet) {
        //*下注保存
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.balance = App.player.balance - guessBet;
            self.setCreditLabText();

            self.bonusWin = guessBet;
            self.setBonusWinLabText();

            self.stopLightBlink();
        };

        var api = "/fruit/setGuessBetting";
        var params = {
            bet: self.bonusWin
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    FruitMainView.prototype.setFactor = function () {
        //*下注保存
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.setBetFactorLabText();
        };

        var api = "/fruit/setBetFactor";
        var params = {
            factor: self.betFactor
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    //*改变押注的倍率
    FruitMainView.prototype.onChangeBetFactor = function () {
        if (this.gameState == FruitMainView.STATE_FRUIT_BETTING || this.gameState == FruitMainView.STATE_GAME_INIT) {
            this.playFruitSound("chip_switch");
            var betFactor = this.betFactor;
            var betIndex = this.betFactorIndex;
            var length = this.betFactorList.length - 1;
            betIndex++;
            if (betIndex > length) {
                betIndex = 0;
            }

            this.betFactorIndex = betIndex;
            betFactor = this.betFactorList[betIndex];
            this.betFactor = betFactor;
            this.setFactor();


            for (var index in this.fruitBetShowList) {
                this.fruitBettingList[index] = this.fruitBetShowList[index] * this.betFactor;
            }

            this.setBetTotalLabText();
        }
        else{
            App.assetsManager.playSound("chip_in_fail");
        }
    };

    FruitMainView.prototype.betOning = function () {
        this.playFruitSound("chip_switch");
        //*在能够押注的状态下，获取本局的结果
        this.setFruitCellBgGray();
        var betTotal = this.getFruitBetTotal();
        if (betTotal <= 0) {
            return;
        }

        var self = this;
        var fruitBet = this.fruitBettingList;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.rotaryRunning(data);
        };
        var api = "/fruit/betOn";
        var params = {
            bet: JSON.stringify(fruitBet)
        };

        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    //*按下Go
    FruitMainView.prototype.onFruitRotaryRun = function () {
         if (!this.canTouchGoBtn) {
            App.assetsManager.playSound("chip_in_fail");
            return;
         }

         var gameState = this.gameState;

         if (gameState == FruitMainView.STATE_GAME_INIT || gameState == FruitMainView.STATE_FRUIT_BETTING) {
             var self = this;
             var fruitBet = this.fruitBettingList;

             var complete = function(err, data) {
                 if (err != null) {
                     return;
                 }
                 App.player.update(data.player);
                 self.betOning();
             };
             var api = "/fruit/fruitWithdraw";
             var params = {
                 bet: JSON.stringify(fruitBet)
             };

             App.netManager.request(api, params, Laya.Handler.create(null, complete));
         }
         else if (gameState == FruitMainView.STATE_GUESS_BETTING) {
             //*能够赌大小的情况下，按下，收回奖励金额
             this.updateGameStateToCanBet();
         }
    };

    //*恢复界面的初始状态
    FruitMainView.prototype.updateGameStateToCanBet = function () {
        this.bonusWin = 0;
        this.guessCanBetTotal = 0;
        this.balance = App.player.balance;
        this._luckPos = null;
        this.isRandomShowInBetLab = false;
        this.isPromptThisRound = false;

        if (!this._playLoadMus) {
            App.assetsManager.playMusic("loading");
        }

        this.stopLightBlink();
        this.setCreditLabText();
        this.setBonusWinLabText();
        this.initFruitBettingList();
        this.setAllEggActionVisible(false);

        var fruitName = "";
        for (var index in this.fruitNameList) {
            fruitName = this.fruitNameList[index];
            this.setBettingLabelText(fruitName, "0");
        }

        this.gameState = FruitMainView.STATE_FRUIT_BETTING;
    };

    //*开始表现转
    FruitMainView.prototype.rotaryRunning = function (result) {
        Laya.SoundManager.playSound("assets/sound/Y021.ogg");
        this.gameState = FruitMainView.STATE_ROTARY_RUNNING;
        App.uiManager.cleanSaveGlowFruitList();
        this.cleanFruitLights();

        App.player.update(result.player);

        this._promptInfo = result.rewardType;

        this._resultFruitObj = result.fruits;
        this._resultFruitObjKeys = Object.keys(this._resultFruitObj);
        this._resultFruitObjKeysLength = this._resultFruitObjKeys.length;

        this._runningObjIndex = 0;
        this._runningLightIndex = 0;

        this._endPos = this._endPos || 0;
        this._totalLightIndex = 0;

        this.lightRotating();

        this.bonusWin = result.bonusWin;
        this.multiples = result.multiples;
        this.guessCanBetTotal = this.bonusWin * 2;

        this.multipleLightCanStartMove();
    };

    //*清除上一局所有的灯
    FruitMainView.prototype.cleanFruitLights = function () {
        var fruitLightList = this.fruitLightList;
        var length = fruitLightList.length;

        for (var lightIndex = 0; lightIndex < length; lightIndex++) {
            fruitLightList[lightIndex].dispose();
        }

        this.fruitLightList = [];
    };

    FruitMainView.prototype.lightRotating = function () {
        var runningObjIndex = this._runningObjIndex;
        var runningObjName = this._resultFruitObjKeys[runningObjIndex];
        var runningFruitList = this._resultFruitObj[runningObjName];

        this._runningObjLength = runningFruitList.length;

        if (this._runningObjLength <= 0) {
            this.lightStoppedMove();
            return;
        }

        this._totalLightIndex ++;

        var isLuckyRound = false;
        if (this._runningObjIndex == 1) {
            var luckPos = this.getLuckyPosThisRound();
            var startIndex = luckPos;
            isLuckyRound = true;
        }
        else {
            startIndex = this._endPos;
        }

        var endIndex = runningFruitList[this._runningLightIndex];
        var info = {
            startIndex: startIndex,
            endIndex: endIndex,
            lightIndex: this._totalLightIndex,
            isLuckyRound: isLuckyRound
        };

        var light = new FruitLightBox(info);
        light.on(FruitLightBox.CAN_CREATE_NEXT_LIGHT, this, this.lightStoppedMove, [endIndex]);
        light.on(FruitLightBox.STOP_MOVE, this, this.fruitActionInRoraty, [endIndex]);
        light.zOrder = 1;
        this.fruitBgBox.addChild(light);
        this.fruitLightList.push(light);
        light.move();

        if (this._runningObjIndex != 1) {
            this._endPos = endIndex;
        }

        if (this._runningLightIndex == 0 && this._runningObjIndex == 0) {
            //*装饰灯
            for (var index = 1; index < 3; index ++) {
                startIndex = startIndex - 1;
                if (startIndex < 0) {
                    startIndex = 24 + startIndex;
                }
                var destroyTurn = 3 - index;
                var lightInfo = {
                    startIndex: startIndex,
                    endIndex: endIndex,
                    destroyIndex: index
                };

                var decorateLight = new FruitLightBox(lightInfo);
                decorateLight.zOrder = 100;
                this.fruitBgBox.addChild(decorateLight);
                decorateLight.move();
            }
        }
    };

    //*获得这一局lucky的位置
    FruitMainView.prototype.getLuckyPosThisRound = function () {
        if (!this._luckyPos) {
            var rotaryFruitList = this._resultFruitObj.rotaryFruits;
            var lucyIndexList = Rotary.LUCK_INDEX_LIST;
            var fruitIndex = 0;
            for (var index in rotaryFruitList) {
                var id = rotaryFruitList[index];
                fruitIndex = id + 1001;
                if (lucyIndexList.indexOf(fruitIndex) != -1) {
                    this._luckyPos = id;
                    break;
                }
            }
        }

        return this._luckyPos;
    };

    FruitMainView.prototype.lightStoppedMove = function (endIndex) {
        this._runningLightIndex ++;
        if (endIndex) {
            if (endIndex == FruitMainView.GOLDEN_LUCK_INDEX) {
                this.setEggActionVisible("golden", true);
                this.playFruitSound("Y001");
            }
            else if (endIndex == FruitMainView.BLUE_LUCK_INDEX) {
                this.setEggActionVisible("blue", true);
                this.playFruitSound("Y001");
            }
            else {
                //*播放声音
                this.playFruitSound(endIndex);
            }
        }
        if (this._runningLightIndex < this._runningObjLength) {
            this.lightRotating();
            return;
        }
        else {
            this._runningLightIndex = 0;
            this._runningObjIndex ++;
        }

        if (this._runningObjIndex < this._resultFruitObjKeysLength) {
            this.lightRotating();
        }
        else {
            this.showFruitResultPrompt(); //*中奖提示
            this.showFruitResultOnView();
        }
    };

    FruitMainView.prototype.fruitActionInRoraty = function (fruitIndex) {
        if (typeof (fruitIndex) != "number") {
            return;
        }

        if (fruitIndex == FruitMainView.GOLDEN_LUCK_INDEX || fruitIndex == FruitMainView.BLUE_LUCK_INDEX) {
            return;
        }

        var fruitImgList = this.rotaryFruitBoxList;
        var fruit = fruitImgList[fruitIndex];
        fruit.lightStoppedAction();

        App.uiManager.saveGlowFruitIndex(fruitIndex);
    };

    //*显示转盘停下来之后的结果
    FruitMainView.prototype.showFruitResultOnView = function () {
        this.gameState = FruitMainView.STATE_GUESS_BETTING;
        this.closeUpdatePromptTimer();
        this.setBonusWinLabText();
        this.balance = App.player.balance - this.bonusWin;
        this.setCreditLabText();

        //*记录显示
        var fruitResultInRound = this._resultFruitObj;
        //*提取中奖水果的name，为押注的显示做准备
        var fruitBingoNameList = [];
        var name = "";
        for (var index in fruitResultInRound) {
            var fruitObj = fruitResultInRound[index];
            if (fruitObj.length > 0) {
                for (var index in fruitObj) {
                    var id = fruitObj[index];
                    name = this.rotaryfruitList[id].fruitName;
                    if (fruitBingoNameList.indexOf(name) == -1) {
                        fruitBingoNameList.push(name);
                    }
                }
            }

            //*记录显示
            this.addRecordItem(fruitObj);
        }

        if (this.bonusWin <= 0) {
            //*没有奖金就是没有中奖，清除所有的状态
            this.updateGameStateToCanBet();
            var soundName = FruitMainView.SOUNDNAME_UNFOTUNATELY[Math.floor(Math.random() * 2)%2];
            Laya.timer.once(1000, this, this.playFruitSound, [soundName]);
        }
        else {
            //*中奖了，猜大小显示0
            this.fruitBetLabelList[FruitMainView.GUESS_LABEL_INDEX].text = "0";
            //*押注显示
            for (var index in this.fruitBettingList) {
                if (fruitBingoNameList.indexOf(index) == -1) {
                    this.setBettingLabelText(index,"");
                }
            }
            var tempId = Math.floor(Math.random() * 10);
            App.assetsManager.playMusic(FruitMainView.MUSIC_BINGO[tempId]);
            this._playLoadMus = false;
        }
    };

    FruitMainView.prototype.addRecordItem = function (fruitList) {
        if (fruitList == null) {
            return;
        }

        var boxItemLength = this.recordItemListBox.length;
        var fruitLength = fruitList.length;

        if (fruitLength <= 0) {
            return;
        }

        //*处理列表溢出
        var listNextLength = boxItemLength + fruitLength;
        if (listNextLength > this.recordItemTotal) {
            var diff = listNextLength - this.recordItemTotal;
            for (var index = 0; index < diff; index ++) {
                this.recordItemListBox.deleteItem(index);
            }

            this.recordItemListBox.refresh();
        }

        //*添加列表显示
        for (var fruitIndex in fruitList) {
            var id = fruitList[fruitIndex];
            var fruitInfo = Rotary.ROTARY_FRUITS[id];
            this.recordItemListBox.addItem(fruitInfo);
        }

        this.recordItemListBox.tweenTo(this.recordItemListBox.length);
    };

    FruitMainView.prototype.touchExplain = function () {
        this.playFruitSound("chip_switch");
        //*点击玩法说明按钮
        var explainDialog = new ExplainDialog();
        App.uiManager.addUiLayer(explainDialog,{isAddShield:true,alpha:0,isDispose:true});
    };

    FruitMainView.prototype.lightsUnBlinkOnView = function () {
        for (var index in this.fruitLightList) {
            this.fruitLightList[index].stopLightBlink();
        }
    };

    //*倍率灯闪
    FruitMainView.prototype.multipleLightCanStartMove = function () {
        //*结束的位置
        this._lowLightEndIndex = Rotary.RANDOM_MULTIPLE_LOW.indexOf(this.multiples.low);
        this._highLightEndIndex = Rotary.RANDOM_MULTIPLE_HIGH.indexOf(this.multiples.high);
        this._multipleLightMoveTime = 0;
        this._waitTime = 0;
        this._lowIndex = 0;
        this._highIndex = 0;
        Laya.timer.frameLoop(1, this, this.multipleLightMoving);
    };

    FruitMainView.prototype.multipleLightMoving = function () {
        var dt = Laya.timer.delta;
        this._multipleLightMoveTime += 10;

        if (this._lowIndex > 2) {
            this._lowIndex = 0;
        }

        if (this._highIndex > 2) {
            this._highIndex = 0;
        }

        if (this._multipleLightMoveTime > 0 && this._multipleLightMoveTime < 900) {
            this._waitTime ++;
            if (this._waitTime >= 5) {
                this._waitTime = 0;
            }
            else {
                return;
            }
        }
        else if (this._multipleLightMoveTime >= 900 && this._multipleLightMoveTime < 1700) {
            this._waitTime ++;
            if (this._waitTime >= 3) {
                this._waitTime = 0;
            }
            else {
                return;
            }
        }
        else if (this._multipleLightMoveTime >= 1700 && this._multipleLightMoveTime < 2100) {
            this._waitTime ++;
            if (this._waitTime >= 5) {
                this._waitTime = 0;
            }
            else {
                return;
            }
        }
        else if (this._multipleLightMoveTime >= 2100 && this._multipleLightMoveTime < 2300) {
            this._waitTime ++;
            if (this._waitTime >= 15) {
                this._waitTime = 0;
            }
            else {
                return;
            }
        }
        else if (this._multipleLightMoveTime > 2300) {
            Laya.timer.clear(this, this.multipleLightMoving);
            this.lightOfMultipleDisplay();
            return;
        }

        this.moveLowLight();
        this.moveHighLight();

        this._lowIndex ++;
        this._highIndex ++;
    };

    FruitMainView.prototype.lightOfMultipleDisplay = function () {
        for (var i = 0; i < this.lowMultipleImgs.length; i++) {
            if (i == this._lowLightEndIndex) {
                this.lowMultipleImgs[i].visible = true;
            }
            else {
                this.lowMultipleImgs[i].visible = false;
            }

            for (var index = 0; index < this.highMultipleImgs.length; index++) {
                if (index == this._highLightEndIndex) {
                    this.highMultipleImgs[index].visible = true;
                }
                else {
                    this.highMultipleImgs[index].visible = false;
                }
            }
        }
    };

    FruitMainView.prototype.moveLowLight = function () {
        for (var i = 0; i < this.lowMultipleImgs.length; i++) {
            if (this._lowIndex == i) {
                this.lowMultipleImgs[i].visible = true;
            }
            else {
                this.lowMultipleImgs[i].visible = false;
            }
        }
    };

    FruitMainView.prototype.moveHighLight = function () {
        for (var index = 0; index < this.highMultipleImgs.length; index++) {
            if (this._highIndex == index) {
                this.highMultipleImgs[index].visible = true;
            }
            else {
                this.highMultipleImgs[index].visible = false;
            }
        }
    };

    FruitMainView.prototype.setLowLightVisible = function (visible) {
        for (var i = 0; i < this.lowMultipleImgs.length; i++) {
            this.lowMultipleImgs[i].visible = visible;
        }
    };

    FruitMainView.prototype.setHighLightVisible = function (visible) {
        for (var index in this.highMultipleImgs) {
            this.highMultipleImgs[index].visible = visible;
        }
    };

    FruitMainView.prototype.lowLightBlink = function () {
        if (!this.lowMultipleImgs[0].visible) {
            return;
        }
        Laya.timer.frameLoop(5, this, this.lowLightsBlink);
    };

    FruitMainView.prototype.lowLightsBlink = function () {
        this._lowLighting = true;
        for (var i = 0; i < this.lowMultipleImgs.length; i++) {
            this.lowMultipleImgs[i].visible = !this.lowMultipleImgs[i].visible;
        }
    };

    FruitMainView.prototype.highLightsBlink = function () {
        this._highLighting = true;
        for (var i = 0; i < this.highMultipleImgs.length; i++) {
            this.highMultipleImgs[i].visible = !this.highMultipleImgs[i].visible;
        }
    };

    FruitMainView.prototype.highLightBlink = function () {
        if (!this.highMultipleImgs[0].visible) {
            return;
        }
        Laya.timer.frameLoop(5, this, this.highLightsBlink);
    };

    FruitMainView.prototype.stopLightBlink = function () {
        if (this._highLighting) {
            Laya.timer.clear(this, this.highLightsBlink);
            this.setHighLightVisible(true);
            this._highLighting = false;
        }

        if (this._lowLighting) {
            Laya.timer.clear(this, this.lowLightsBlink);
            this.setLowLightVisible(true);
            this._lowLighting = false;
        }
    };

    FruitMainView.prototype.update = function () {
        switch (this.gameState) {
            case FruitMainView.STATE_GAME_INIT:
            case  FruitMainView.STATE_FRUIT_BETTING: {
                this.setFruitBetBtnsDisabled(false);
                this.setGuessBetBtnsDisabled(true);
                this.setFruitBetLightVisiable(true);
                this.setArrowEffectVisible(false);
                if (this.getFruitBetTotal() > 0) {
                    this.setGoBtnDisabled(false);
                }
                else {
                    this.setGoBtnDisabled(true);
                }

                this.lightsUnBlinkOnView();
                break;
            }
            case FruitMainView.STATE_ROTARY_RUNNING:
            case FruitMainView.STATE_GUESS_RUNNING: {
                this.setFruitBetBtnsDisabled(true);
                this.setGuessBetBtnsDisabled(true);
                this.setGoBtnDisabled(true);
                this.setFruitBetLightVisiable(false);
                this.setArrowEffectVisible(false);
                break;
            }
            case FruitMainView.STATE_GUESS_BETTING: {
                this.setFruitBetBtnsDisabled(true);
                this.setGuessBetBtnsDisabled(false);
                this.setGoBtnDisabled(false);
                this.setFruitBetLightVisiable(false);
                this.setArrowEffectVisible(true);
                break;
            }
        }
    };

    FruitMainView.prototype.setFruitBetLightVisiable = function (visible) {
        for (var index in this.fruitBetBtnEffects) {
            this.fruitBetBtnEffects[index].visible = visible;
        }
    };

    FruitMainView.prototype.setFruitBetBtnsDisabled = function (disabled) {
        this.fruitBtnGrayLayer.visible = disabled;
        this.canBetFruit = !disabled;
    };

    FruitMainView.prototype.setGuessBetBtnsDisabled = function (disabled) {
        if (this.gameState != FruitMainView.STATE_GUESS_RUNNING) {
            this.guessBtnGrayLayer.visible = disabled;
        }
        this.canGuessNum = !disabled;
    };

    FruitMainView.prototype.setGoBtnDisabled = function (disabled) {
        this.goBtnGrayLayer.visible = disabled;
        this.canTouchGoBtn = !disabled;
        if (this.gameState == FruitMainView.STATE_GUESS_BETTING) {
            this.goBtnEffect.visible = false;
        }
        else {
            this.goBtnEffect.visible = !disabled;
        }
    };

    FruitMainView.prototype.getFruitBetTotal = function () {
        var index;
        var betTotal = 0;
        for (index in this.fruitBettingList) {
            betTotal += this.fruitBettingList[index];
        }

        return betTotal;
    };

    FruitMainView.prototype.playFruitSound = function (soundName) {
        if (typeof(soundName) == "number") {
            var fruitName = this.rotaryfruitList[soundName].fruitName;
            App.assetsManager.playSound("Y112");
            Laya.timer.once(500, App.assetsManager, App.assetsManager.playSound, [fruitName]);
        }
        else if (typeof(soundName) == "string") {
            App.assetsManager.playSound(soundName);
        }
    };

    FruitMainView.STATE_GAME_INIT = 0;
    FruitMainView.STATE_FRUIT_BETTING = 1;
    FruitMainView.STATE_ROTARY_RUNNING = 2;
    FruitMainView.STATE_GUESS_BETTING = 3;
    FruitMainView.STATE_GUESS_RUNNING = 4;

    FruitMainView.BET_BTN_TYPE = {
        Add: "Add",
        Cut: "Cut"
    };

    FruitMainView.GUESS_TYPE = {
        Low: "Low",
        High: "High"
    };

    FruitMainView.BET_FRUIT_MAX       = 99;
    FruitMainView.BET_FACTOR_MAX      = 99;
    FruitMainView.BET_FACTOR_MIN      = 1;
    
    FruitMainView.GRAY_ZERO_LAB_TOTAL = 8;
    
    FruitMainView.GUESS_LABEL_INDEX   = "guess";
    
    FruitMainView.GOLDEN_LUCK_INDEX   = 23;
    FruitMainView.BLUE_LUCK_INDEX     = 11;

    FruitMainView.SOUNDNAME_UNFOTUNATELY = ["Y113", "Y16"];
    FruitMainView.SOUNDNAME_VERY_GOOD = ["Y110", "Y109"];
    FruitMainView.MUSIC_BINGO = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11",];

    return FruitMainView;
}(FruitMainViewUI));
