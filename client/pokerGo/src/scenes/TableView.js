/**
 * Created by WhelaJoy on 2017/2/20.
 */
var TableView = (function(_super){
    function TableView(){
        TableView.super(this);
    }
    Laya.class(TableView,"TableView",_super);

    TableView.prototype.init = function(){
        this.handPokers = [];

        var actor = Actor.create(10001);
        if (actor != null) {
            actor.play();
            this.girl.addChild(actor);
            actor.zOrder = -1;
            actor.x = 130;
            actor.y = 800;
            var length = actor.x - 180;
            this.tipBg.x += (50+length);
        }

        this.bet = Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX];
        //this.bet = 0;
        this.betAmount = this.bet;
        this.betCount = 0;
        this.betAmountIndex = this.betCount;


        this.updateBalance();
        this.updateJackPotPool();
        this.updateBetAmountShow();

        this.changeStateShow();
        this.changeButtonState();

        this.initEvents();
    };

    TableView.prototype.initEvents = function (){
        this.btnDraw.on(Laya.Event.CLICK,this,this.onDrawClick);
        this.btnBack.on(Laya.Event.CLICK,this,this.changeReadyShow);

        this.btnBetOn.on(Laya.Event.CLICK,this,this.onBetOnClick,[Papaya.PokerGo.Game.BETTYPE.BETON]);

        this.btnDouble.on(Laya.Event.MOUSE_DOWN,this,this.onAddBetClick);
        this.btnDouble.on(Laya.Event.MOUSE_UP,this,this.onAddBetClick);
        this.btnDouble.on(Laya.Event.MOUSE_OUT,this,this.onAddBetClick);

        this.btnHalf.on(Laya.Event.MOUSE_DOWN,this,this.onReduceBetClick);
        this.btnHalf.on(Laya.Event.MOUSE_UP,this,this.onReduceBetClick);
        this.btnHalf.on(Laya.Event.MOUSE_OUT,this,this.onReduceBetClick);
    };

    TableView.prototype.onSendDeal = function (){
        if(this._isDoEffect){
            return;
        }

        if(App.uiManager.boxMessage){
            return
        }
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                console.log("err : = " + JSON.stringify(err));
                self.doTipLabelEffect(err);
                return;
            }

            App.player.update(data.player || {});
            App.game.syncGame(data);

            self.updateBalance();
            self.updateJackPotPool();

            var callback = function(){
                self.doTipLabelEffect("请下注，开牌吧！");
                var soundName = (Math.floor(Math.random() * 2 ) ) ? "betOn_1" : "betOn_2";
                App.assetsManager.playSound(soundName);
            };

            self._isDeal = true;
            if(data.results){
                callback = function (){
                    self._isDraw = true;
                    self._isDeal = false;
                    App.uiManager.showMessageDialog(data,function (){
                        self.doTipLabelEffect("请重新开局吧！");
                        var soundName = (Math.floor(Math.random() * 2 ) ) ? "open_1" : "open_2";
                        App.assetsManager.playSound(soundName);
                    });
                };

                self.updateResultsShow(data.results);

                self.btnBetOn.disabled = true;

                self.btnDraw.disabled = false;
                self.btnDraw.getChildByName("img").skin = "assets/ui.common/opening.png";

                self.updateBoxNumShow(self.bet);
            }
            else{
                self.bet = self.betAmount;
                self.betCount = self.betAmountIndex;
                self.updateBetAmountShow();
                self.updateBoxNumShow(self.bet + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]);
                self.changeButtonState();
            }

            self.updateDealPokers(callback);
        };

        var api = "/pokerGo/deal";
        var params = {};
        params.betAmount = this.bet;
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));
    };

    TableView.prototype.onDealClick = function(){
        if(this._isDeal){
            this.doTipLabelEffect({err : Papaya.PokerGo.Game.ERR.NO_READY});
            return
        }

        this.onSendDeal();
    };

    TableView.prototype.onDrawClick = function (){
        if(this._isDoEffect){
            return;
        }

        if(App.uiManager.boxMessage){
            return
        }

        if(this._isDraw){
            this.changeReadyShow();
            return
        }

        if(!this._isDeal){
            this.onDealClick();
            return ;
        }

        if(App.game.state  != Papaya.PokerGo.Game.STATE.DEALED){
            this.doTipLabelEffect({err : Papaya.PokerGo.Game.ERR.NO_DRAW});
            return;
        }

        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                console.log("err : = " + JSON.stringify(err));
                self.doTipLabelEffect(err);
                return;
            }
            App.player.update(data.player || {});
            App.game.syncGame(data);

            var callBack = function (){
                App.uiManager.showMessageDialog(data,function (){
                    self._isDraw = true;
                    self.doTipLabelEffect("请重新开局吧！");
                    var soundName = (Math.floor(Math.random() * 2 ) ) ? "open_1" : "open_2";
                    App.assetsManager.playSound(soundName);
                });
                self.updateResultsShow(data.results);
            };

            self.updateBalance();
            self.updateJackPotPool();
            self.updateBoxNumShow(self.bet + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]);

            self.updateDrawPoker(callBack);
            self.changeButtonState();

            self.btnBetOn.disabled = true;
            self.btnDraw.disabled = false;
            self.btnDraw.getChildByName("img").skin = "assets/ui.common/opening.png";
        };

        var api = "/pokerGo/draw";
        var params = {};
        params.betAmount = this.bet;
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));
    };

    TableView.prototype.onBetOnClick = function (){
        this.betCount++;
        if(this.betCount >= Papaya.PokerGo.Game.BET_AMOUNT.length){
            this.betCount = 0;
        }
        this.bet = Papaya.PokerGo.Game.BET_AMOUNT[this.betCount];
        this.betAmount = this.bet;
        this.betAmountIndex = this.betCount;
        this.updateBetAmountShow();
        this.updateBoxNumShow(this.bet + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]);
    };

    TableView.prototype.onBetTypeClick = function (BetOnType){
        if(this._isDoEffect){
            return;
        }

        if(App.uiManager.boxMessage){
            return
        }

        this._betontype = BetOnType;

        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {

                console.log("err : = " + JSON.stringify(err));
                self.doTipLabelEffect(err);

                return;
            }

            App.player.update(data.player || {});
            App.game.syncGame(data);

            self.btnBetSmall.disabled = true;
            self.btnBetBig.disabled = true;

            self.btnBack.disabled = true;

        };

        var api = "/pokerGo/betType";
        var params = {};
        params.bettype = this._betontype;
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));

    };

    TableView.prototype.doRemovePokerEffect = function (){

        var self = this;
        this._isDoEffect = true;
        var isHavePoker = false;

        for (var i = 1 ; i <= 3 ; i++){
            var poker = self["_poker" + i];

            var callBack = function (index){
                self._isDoEffect = false;

                self["_poker" + index].removeSelf();
                self["_poker" + index] = null;

                if (index == 2){
                    self.doTipLabelEffect("请下注" + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX] + "筹码发牌！"); 
                    var soundName = (Math.floor(Math.random() * 2 ) ) ? "dealPoker_1" : "dealPoker_2";
                    App.assetsManager.playSound(soundName);   
                }
            };

            if(poker){
                var callFunc = CallFunc.create(Laya.Handler.create(this,callBack,[i]));
                var move = MoveTo.create(0.3,Point.p(720,poker.y - 200));
                var scale = ScaleBy.create(0.3,0,0);
                var rotate = RotateBy.create(0.3,720);

                var spawn = Spawn.create(move,scale,rotate);
                var seq = Sequence.create(spawn,callFunc);

                App.actionManager.addAction(seq,poker);
                isHavePoker = true;
            }
        }
        this._isDoEffect = (isHavePoker)  ? true : false;
    };

    TableView.prototype.doTipLabelEffect = function (msg,cd){
        var self = this;

        this._isDoEffect = true;

        if(this._tipAciton){
            return;
        }

        if(!msg){
            return;
        }

        if(msg.err){
            msg = App.uiManager.getErrString(msg);
        }

        this.tipBg.visible = true;
        this.labelTip.text = msg;
        this.tipBg.alpha = 1;

        var callFunc = CallFunc.create(Laya.Handler.create(this,function (){
            self._isDoEffect = false;
            self._tipAciton = null;
            self.tipBg.alpha = 1;
            if (self._tipBgFadeOutAction){
                App.actionManager.removeAction(self._tipBgFadeOutAction);
                self._tipBgFadeOutAction = null;
            }
            var time = DelayTime.create(2);
            var fade = FadeOut.create(0.3);
            self._tipBgFadeOutAction = Sequence.create(time,fade);
            App.actionManager.addAction(self._tipBgFadeOutAction,self.tipBg);

            if(cd){
                cd();
            }
        }));

        var scale = 1 ;
        this.tipBg.scaleX = 0;
        this.tipBg.scaleY = 0;
        var scale_1 = ScaleTo.create(0.15, scale+0.1);
        var scale_2 = ScaleTo.create(0.05, scale);


        this._tipAciton = Sequence.create(scale_1, scale_2,callFunc);

        App.actionManager.addAction(this._tipAciton,this.tipBg);
    };

    TableView.prototype.sendDoubleEnter = function (){
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                console.log("err : = " + JSON.stringify(err));
                self.doTipLabelEffect(err);
                return;
            }

            App.game.syncGame(data.game || {});
            App.game.double.syncDouble(data);

            self.openDoubleView();
        };

        var api = "/pokerGo/double";
        var params = {};
        params.lastScore = App.game.score;
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));
    };

    TableView.prototype.openDoubleView = function (){
        this.doFadeOutAction(function (){
            var doubleView = new DoubleView();
            App.sceneLayer.addChild(doubleView);
            doubleView.doFadeInAction();
        });
    };

    TableView.prototype.openTableView = function (){
        var self = this;
        self.updateBalance();
        this.doFadeInAction(function (){
            self.changeReadyShow();
        });
    };

    TableView.prototype.doFadeInAction = function (cb){
        var time = new DelayTime.create(0.5);
        var func = new CallFunc.create(Laya.Handler.create(this,function(){
            if(cb){
                cb();
            }
        }));

        App.actionManager.addAction(Sequence.create(time,func),this);

        App.uiManager.doDirectionFadeInAction(this.girl,"left");
        App.uiManager.doDirectionFadeInAction(this.boxRight,"right");

        App.uiManager.doDirectionFadeInAction(this.boxNum,"dowm");

        App.uiManager.doDirectionFadeInAction(this.boxTop,"up");
        App.uiManager.doDirectionFadeInAction(this.boxBottom,"dowm");

        App.uiManager.doScaleAction(this.boxMiddle);
        App.uiManager.doScaleAction(this.pokerLightNode);

        
    };   

    TableView.prototype.doFadeOutAction = function (cb){
        this._isDoEffect = true;
        var time = new DelayTime.create(0.3);
        var func = new CallFunc.create(Laya.Handler.create(this,function(){
            if(cb){
                cb();
            }
        }));

        App.actionManager.addAction(Sequence.create(time,func),this);

        App.uiManager.doDirectionFadeOutAction(this.girl,"left");
        App.uiManager.doDirectionFadeOutAction(this.boxRight,"right");

        App.uiManager.doDirectionFadeOutAction(this.boxNum,"dowm");
        App.uiManager.doDirectionFadeOutAction(this.boxTop,"up");
        App.uiManager.doDirectionFadeOutAction(this.boxBottom,"dowm");

        App.uiManager.doScaleOutAction(this.boxMiddle);
        App.uiManager.doScaleOutAction(this.pokerLightNode);

    };

    TableView.prototype.changeReadyShow = function (){
        this.boxRight.visible = false;

        this.btnBack.disabled = true;

        this.btnBetOn.disabled = true;

        this._isDeal = false;
        this._isDraw = false;

        if(this._cutResultsView){
            this._cutResultsView.visible = false;
        }

        if(this._cutResultsLabel && this._cutResultsLabel.font){
            this._cutResultsLabel.font = "poker_1";
        }
        else if(this._cutResultsLabel && !this._cutResultsLabel.font){
            this._cutResultsLabel.skin = "assets/ui.common/img_JackPot_1.png";
        }

        if(this._pokerlight){
            this._pokerlight.removeSelf();
            this._pokerlight = null;
            this.boxJackpootLight.visible = true;
        }

        if(this._jackpotlight){
            this._jackpotlight.removeSelf();
            this._jackpotlight = null;
        }

        if(this._jackpot){
            this._jackpot.removeSelf();
            this._jackpot = null;
            this.imgJackpot.visible = true;
        }

        if(this._jackLabeffectBind){
            Laya.timer.clear(this,this._jackLabeffectBind);
            this._jackLabeffectBind = null;
            this.labelJackpot.font = "jackpot_1";
        }

        if(this._shootPokersSpr){
            for (var k in this._shootPokersSpr){
                this._shootPokersSpr[k].removeSelf();
            }
            this._shootPokersSpr = null;
        }

        if(this._noShootPokersSpr){
            for (var k in this._noShootPokersSpr){
                this._noShootPokersSpr[k].removeSelf();
            }
            this._noShootPokersSpr = null;
        }

        this.poker1.visible = false;
        this.poker2.visible = false;
        this.poker3.visible = false;

        this.doRemovePokerEffect();

        this.btnDraw.disabled = false;
        this.btnDraw.getChildByName("img").skin = "assets/ui.common/dealPoker.png";

        this.labelshootPrcent.text = "100%";

        this.bet = Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX];
        this.betCount = 0;
        this.updateBetAmountShow();
        this.updateBoxNumShow(this.bet);

    };

    TableView.prototype.changeStateShow = function (){
        var game = App.game;

        var state = game.getState();

        var time = DelayTime.create(2);
        var fade = FadeOut.create(0.3);
        this._tipBgFadeOutAction = Sequence.create(time,fade);
        App.actionManager.addAction(this._tipBgFadeOutAction,this.tipBg);

        switch (state){
            case Papaya.PokerGo.Game.STATE.READY :
                var double = game.double;
                var doubleState = double.state;

                this.boxNum.visible = true;
                this.labelTip.text  = "请下注" + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX] + "筹码发牌！";
                this.updateBoxNumShow(this.bet);

                if(double.state != Papaya.PokerGo.Double.STATE.END){
                    this.openDoubleView();
                    return
                    break;
                }

                var soundName = (Math.floor(Math.random() * 2 ) ) ? "dealPoker_1" : "dealPoker_2";
                App.assetsManager.playSound(soundName);

                break;

            case Papaya.PokerGo.Game.STATE.DEALED :
                this._isDeal = true;
                this.createDealPokers();

                this.boxNum.visible = true;
                this.labelTip.text  = "请下注，开牌吧！";
                this.updateBoxNumShow(this.bet + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]);

                var soundName = (Math.floor(Math.random() * 2 ) ) ? "betOn_1" : "betOn_2";
                App.assetsManager.playSound(soundName);
                break;

            case Papaya.PokerGo.Game.STATE.DRAWED : 

                break;
        }

    };

    TableView.prototype.changeButtonState = function(){
        var game = App.game;

        var state = game.getState();

        switch (state){
            case Papaya.PokerGo.Game.STATE.READY :{
                this.btnBetOn.disabled = true;

                this.btnBack.disabled = true;

                this.btnDraw.disabled = false;

                this.btnDraw.getChildByName("img").skin = "assets/ui.common/dealPoker.png";
                break
            }

            case Papaya.PokerGo.Game.STATE.DEALED :{
                this.btnBetOn.disabled = false;

                this.boxRight.visible = true;

                this.btnBack.disabled = false;

                this.btnDraw.disabled = false;

                this.changeIsShootPokerShow();
                this.btnDraw.getChildByName("img").skin = "assets/ui.common/showPoker.png";
                break
            }

            case Papaya.PokerGo.Game.STATE.BETED :{
                this.btnBetOn.disabled = true;

                this.btnBack.disabled = true;
                break
            }
        }

    };

    TableView.prototype.changeIsShootPokerShow = function (){
        var game = App.game;

        var handPokers = game.handPokers;

        var shootPokers = [];
        var noShootPokers = [];

        var poker1 = handPokers[0];
        var poker2 = handPokers[1];
        var pokerValue1 = poker1.value;
        var pokerValue2 = poker2.value;

        if(pokerValue1 > pokerValue2){

            for (var i = 1 ; i <= 13 ; i++){

                if(i == pokerValue1 || i == pokerValue2){
                    continue;
                }

                if(i > pokerValue2 && pokerValue1 > i){
                    shootPokers.push(i);
                    continue;
                }

                noShootPokers.push(i);
            }

        }
        else if(pokerValue1 <= pokerValue2){

            for (var i = 1 ; i <= 13 ; i++){

                if(i == pokerValue1 || i == pokerValue2){
                    continue;
                }

                if(i > pokerValue1 && pokerValue2 > i){
                    shootPokers.push(i);
                    continue;
                }

                noShootPokers.push(i);
            }
        }

        this._shootPokersSpr = [];
        this._noShootPokersSpr = [];

        for(var k in shootPokers){
            var poker = this.createPoker();
            var pokerInfo = shootPokers[k];
            poker.skin = "assets/sPokers/" + pokerInfo + ".png";
            var index = parseInt(k);
            poker.x = index%3   * this.boxShoot.width/3;
            poker.y = Math.floor (index/3)   * this.boxShoot.height/4;

            this.boxShoot.addChild(poker);
            this._shootPokersSpr.push(poker);
        }

        for(var k in noShootPokers){
            var index = parseInt(k);
            if(index >= 9){
                break;
            }
            var poker = this.createPoker();
            var pokerInfo = noShootPokers[k];
            poker.skin = "assets/sPokers/" + pokerInfo + ".png";

            poker.x = index%3   * this.boxNoShoot.width/3;
            poker.y = Math.floor (index/3)   * this.boxNoShoot.height/3;
            this.boxNoShoot.addChild(poker);
            this._noShootPokersSpr.push(poker);
        }

        this.labelshootPrcent.text = Math.floor(shootPokers.length*8) + "%";
    };

    TableView.prototype.createPoker = function (){
        var pokers = new Laya.Image();
        return pokers;
    };

    TableView.prototype.onAddBetClick = function (msg){
        var type = msg.type;

        switch (type){
            case Laya.Event.MOUSE_DOWN :

                this.addBetShowBind = this.addBetShow;

                Laya.timer.frameLoop(10,this,this.addBetShowBind);

                this._isAddClick = true;

                break;

            case Laya.Event.MOUSE_UP :
                if(!this._isAddClick){
                    return
                }
                this._isAddClick = false;

                if(this.addBetShowBind){
                    Laya.timer.clear(this,this.addBetShowBind);
                    this.addBetShowBind = null;
                }

                if(!this._isAdd){
                    this.addBetShow();
                }
                this._isAdd = false;
                break;

            case Laya.Event.MOUSE_OUT :

                if(!this._isAddClick){
                    return
                }
                this._isAddClick = false;


                if(this.addBetShowBind){
                    Laya.timer.clear(this,this.addBetShowBind);
                    this.addBetShowBind = null;
                }

                if(!this._isAdd){
                    this.addBetShow();
                }
                this._isAdd = false;
                break;
        }
    };

    TableView.prototype.addBetShow = function (){

        this._isAdd = true;

        this.bet += 10;

        if(this.bet > Papaya.PokerGo.MAX_BET){
            this.bet = Papaya.PokerGo.MAX_BET;
        }

        this.updateBetAmountShow();
    };

    TableView.prototype.onReduceBetClick = function (msg){
        var type = msg.type;

        switch (type){
            case Laya.Event.MOUSE_DOWN :

                this.reduceBetBind = this.ReduceBet;

                Laya.timer.frameLoop(10,this,this.reduceBetBind);

                this._isReduceClick = true;
                break;

            case Laya.Event.MOUSE_UP :

                if(!this._isReduceClick){
                    return
                }

                this._isReduceClick = false;

                if(this.reduceBetBind){
                    Laya.timer.clear(this,this.reduceBetBind);
                    this.reduceBetBind = null;
                }

                if(!this._isReduce){
                    this.ReduceBet();
                }

                this._isReduce = false;
                break;

            case Laya.Event.MOUSE_OUT :

                if(!this._isReduceClick){
                    return
                }

                this._isReduceClick = false;

                if(this.reduceBetBind){
                    Laya.timer.clear(this,this.reduceBetBind);
                    this.reduceBetBind = null;
                }

                if(!this._isReduce){
                    this.ReduceBet();
                }

                this._isReduce = false;
                break;
        }
    };

    TableView.prototype.ReduceBet = function (){
        this._isReduce = true;

        this.bet -= 10;

        if(this.bet < Papaya.PokerGo.MIN_BET){
            this.bet = Papaya.PokerGo.MIN_BET;
        }

        this.updateBetAmountShow();
    };

    TableView.prototype.updateBoxNumShow = function (BetAmount){

        this.labelGoldNum.text      = BetAmount || 0;

        this.labelRemobeGold.text   = BetAmount || 0;

    };

    TableView.prototype.updateBetAmountShow = function (){
        this.labelBetAmount.text = this.bet ;
    };

    TableView.prototype.createDealPokers = function (){
        this.boxMiddle.visible = true;
        var game = App.game;
        var handPokers = game.handPokers;

        this._poker1 = this.createPoker();
        this._poker2 = this.createPoker();
        this._poker1.pos(this.poker1.x,this.poker1.y);
        this._poker2.pos(this.poker2.x,this.poker2.y);
        this._poker1.anchorX = 0.5;
        this._poker1.anchorY = 0.5;
        this._poker2.anchorX = 0.5;
        this._poker2.anchorY = 0.5;
        this.boxMiddle.addChild(this._poker1);
        this.boxMiddle.addChild(this._poker2);

        var poker1 = handPokers[0];
        var poker2 = handPokers[1];
        var poker3 = handPokers[2];
        var pokerValue1 = poker1.value;
        var pokerValue2 = poker2.value;

        if(pokerValue1 > pokerValue2){
            this._poker1.skin = "assets/pokers/" + poker2.type + "_" + poker2.name + ".png";
            this._poker2.skin = "assets/pokers/" + poker1.type + "_" + poker1.name + ".png";
        }
        else if(pokerValue1 <= pokerValue2){
            this._poker1.skin = "assets/pokers/" + poker1.type + "_" + poker1.name + ".png";
            this._poker2.skin = "assets/pokers/" + poker2.type + "_" + poker2.name + ".png";
        }

        this.poker3.visible  = false;

    };

    TableView.prototype.updateDealPokers = function (cb){
        this.createDealPokers();

        this._poker2.scaleX = 0;
        this._poker1.scaleX = 0;
        this._poker2.visible = false;
        this._poker1.visible = false;

        this.poker1.visible = true;
        this.poker2.visible = true;
        this.poker1.scaleX = 1;
        this.poker2.scaleX = 1;

        this._isDoEffect = true;

        var self = this;
        var speed = 0.2;

        var outCallFunc = CallFunc.create(Laya.Handler.create(this,function(){
            self.poker1.visible = false;
            self.poker2.visible = false;

            self._poker1.visible = true;
            self._poker2.visible = true;

            var inCallFunc = CallFunc.create(Laya.Handler.create(this,function(){
                self._isDoEffect = false;
                if(cb){
                    cb();
                }
            }));

            var scaleIn = ScaleBy.create(speed,1,1);

            var seq = Sequence.create(scaleIn,inCallFunc);
            var seq1 = seq.clone();
            var seq2 = seq.clone();
            App.actionManager.addAction(seq1,self._poker1);
            App.actionManager.addAction(seq2,self._poker2);
        }));

        var scaleOut = ScaleBy.create(speed,0,1);
        var seq1 = Sequence.create(scaleOut,outCallFunc);
        var seq2 = seq1.clone();
        App.actionManager.addAction(seq1,this.poker1);
        App.actionManager.addAction(seq2,this.poker2);
    };

    TableView.prototype.updateDrawPoker = function (cb){
        var game = App.game;
        var handPokers = game.handPokers;

        this.poker3.visible = true;
        this.poker3.scaleX  = 1;

        var poker3 = handPokers[2];
        this._poker3 = this.createPoker();
        this._poker3.pos(this.poker3.x,this.poker3.y);
        this._poker3.anchorX = 0.5;
        this._poker3.anchorY = 0.5;
        this._poker3.skin = "assets/pokers/" + poker3.type + "_" + poker3.name + ".png";
        this._poker3.scaleX = 0;
        this.boxMiddle.addChild(this._poker3);

        var self = this;

        self._isDoEffect = true;
        var speed = 0.2;
        var outCallFunc = CallFunc.create(Laya.Handler.create(this,function(){

            self.poker3.visible = false;

            self._poker3.visible = true;

            var inCallFunc = CallFunc.create(Laya.Handler.create(this,function(){
                self._isDoEffect = false;
                if(cb){
                    cb();
                }
            }));

            var scaleIn = ScaleBy.create(speed,1,1);
            var time = DelayTime.create(0.15);

            var seq = Sequence.create(scaleIn,time,inCallFunc);
            seq = seq.clone();
            App.actionManager.addAction(seq,self._poker3);
        }));

        var scaleOut = ScaleBy.create(speed,0,1);
        var seq = Sequence.create(scaleOut,outCallFunc);
        App.actionManager.addAction(seq,this.poker3);

    };

    TableView.prototype.updateResultsShow = function (results){
        var self = this;

        if(!self["results_" + results]){
           return
        }

        this._cutResultsView =  self["results_" + results];
        this._cutResultsLabel =  self["label_results_" + results];

        this._cutResultsView.visible = true;

        this._cutResultsLabel.font = "poker_2";

        this._jackpotlight = App.animManager.get("ani.jackpot.light");
        this.boxTop.addChild(this._jackpotlight);
        this._jackpotlight.x = this.jackpotBg.x - 5;
        this._jackpotlight.y = this.jackpotBg.y - 5;
        this._jackpotlight.play();

        this._jackpot = App.animManager.get("ani.jackpot");
        this.boxTop.addChild(this._jackpot);
        this._jackpot.x = this.imgJackpot.x - 5;
        this._jackpot.y = this.imgJackpot.y - 5;
        this._jackpot.play();
        this.imgJackpot.visible = false;

        this._pokerlight = App.animManager.get("ani.middlepoker.light");
        this.pokerLightNode.addChild(this._pokerlight);
        this._pokerlight.play();
        this.boxJackpootLight.visible = false;

        var count = 0;
        var jackLabeffect = function (){
            this.labelJackpot.font = (count%2) ? "jackpot_1" : "jackpot_2" ;
            count++;
        };

        this._jackLabeffectBind = jackLabeffect;
        Laya.timer.loop(480,this,this._jackLabeffectBind);

    };

    TableView.prototype.updateBalance = function (){
        var player = App.player;
        this.labelBalance.text = player.balance;
    };

    TableView.prototype.updateJackPotPool = function (){
        var game = App.game;
        this.labelJackpot.text = game.jackPotPool;
    };

    return TableView;
})(TableViewUI);