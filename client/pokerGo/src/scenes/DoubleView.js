/**
 * Created by WhelaJoy on 2017/3/8.
 */
var DoubleView = (function (_super){
    function DoubleView(){
        DoubleView.super(this);
        this.init();
    }

    Laya.class(DoubleView,"DoubleView",_super);

    DoubleView.prototype.init = function (){

        this.btnReady.disabled = true;        
        var lastScore = App.game.double.lastScore;
        this._lastbalance = App.player.balance - lastScore;
        this.updateBalance(this._lastbalance);
        this.updateReward();

    	this.btnBack.on(Laya.Event.CLICK,this,this.onClickClose);
        this.btnReady.on(Laya.Event.CLICK,this,this.changReadyShow);

        this.btnBetSmall.on(Laya.Event.CLICK,this,this.onBetTypeClick,[Papaya.PokerGo.Double.BET_TYPE.SMALL]);
        this.btnBetBig.on(Laya.Event.CLICK,this,this.onBetTypeClick,[Papaya.PokerGo.Double.BET_TYPE.BIG]);

        this.changStateShow();
    };
    
    DoubleView.prototype.doFadeOutAction = function (){
        this._isDoEffect = true;
    	var time = new DelayTime.create(0.3);
        var func = new CallFunc.create(Laya.Handler.create(this,function(){
            this.removeSelf();
            App.uiManager.showTableView();
        }));
        App.actionManager.addAction(Sequence.create(time,func),this);

        App.uiManager.doTMBFadeOutAction(this.boxTop,null,this.boxBottom);
        App.uiManager.doScaleOutAction(this.boxMiddle);

        App.uiManager.doDirectionFadeOutAction(this.boxNum,"dowm");
    };

    DoubleView.prototype.doFadeInAction = function (){
        App.uiManager.doTMBAction(this.boxTop,null,this.boxBottom);
        App.uiManager.doScaleAction(this.boxMiddle);
    };

    DoubleView.prototype.changReadyShow = function (){
        if(this._isDoEffect){
            return;
        }

        if(this._isReady){
            return;
        }
        this._isReady = true;

        var self = this;
        this._isDeal = false;
        if(this._pokerlight){
            this._pokerlight.removeSelf();
            this._pokerlight = null;
        }

        if(this._jackpot){
            this._jackpot.removeSelf();
            this._jackpot = null;
            this.imgJackpot.visible = true;
        }

        var self = this;
        self["results_1"].visible = false;
        self["results_2"].visible = false;

        this.doRemovePokerEffect(function (){
            self.poker.visible = true;
            App.uiManager.doScaleAction(self.poker);

            self.btnBetBig.visible = true;
            self.btnBetSmall.visible = true;

            self._isDoEffect = false;
        });

        this.btnReady.disabled = true;
        App.uiManager.doDirectionFadeOutAction(this.boxNum,"dowm",120);
    };

    DoubleView.prototype.changStateShow = function (){
        var double = App.game.double;
        var state = double.state;
        var self = this;

        switch (state){
            case  Papaya.PokerGo.Double.STATE.READY : 

                break;

            case  Papaya.PokerGo.Double.STATE.DEALED : 
                this._isDeal = true;
                self.updateDealPokers(function (){
                    self.updateResultsShow(double.results);
                    self._isReady = false;
                });

                this._betType = double.betType;
                if(this._betType == Papaya.PokerGo.Double.BET_TYPE.SMALL){
                    this.btnBetBig.visible = false;
                }
                else if(this._betType == Papaya.PokerGo.Double.BET_TYPE.BIG){
                    this.btnBetSmall.visible = false;
                }
                break;

        }
    }

    DoubleView.prototype.doRemovePokerEffect = function (cb){

        var self = this;
        this._isDoEffect = true;

        var poker = self._poker;

        var callBack = function (index){
            self._poker.removeSelf();
            self._poker = null;

            if(cb){
                cb();
            } 
        };

        if(poker){
            var callFunc = CallFunc.create(Laya.Handler.create(this,callBack));
            var move = MoveTo.create(0.3,Point.p(720,poker.y - 200));
            var scale = ScaleBy.create(0.3,0,0);
            var rotate = RotateBy.create(0.3,720);

            var spawn = Spawn.create(move,scale,rotate);
            var seq = Sequence.create(spawn,callFunc);

            App.actionManager.addAction(seq,poker);
        }
        else{
            this._isDoEffect = false;
        }
        
    };

    DoubleView.prototype.onClickClose = function (){   
        if (this._isDoEffect){
            return
        }

        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                App.uiManager.showMessage(err);
                return;
            }
            var double = App.game.double;
            var lastScore = double.lastScore;
            if(lastScore >= 0){
                self.doUpdateBalanceEffect(function (){
                    self.doFadeOutAction();
                    self.updateBalance();
                    App.game.double.syncDouble(data);
                });
            };
            return ;
        }

        var api = "/pokerGo/double/end";
        var params = {};
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));
        
        // self.doFadeOutAction();
    };

    DoubleView.prototype.doUpdateBalanceEffect = function (cb){
        this._isDoEffect = true;
        var self = this;
        this._lastScore = App.game.double.lastScore;

        App.actionManager.add(
            NumberTo.create(0.5, this._lastbalance, App.player.balance),
            this.labelBalance
        );

        App.actionManager.add(
            NumberTo.create(0.5, this._lastScore, 0),
            this.labelReward
        );

        if(cb){
            var callFunc = CallFunc.create(Laya.Handler.create(this,cb));
            var time = DelayTime.create(1);
            App.actionManager.addAction(Sequence.create(time,callFunc),self);
        }

    };

    DoubleView.prototype.onBetTypeClick = function (betType){
        if (this._isDoEffect){
            return
        }

        if(this._isDeal){
            return
        }

        this._isDeal = true;

        this._betType = betType;
        if(this._betType == Papaya.PokerGo.Double.BET_TYPE.SMALL){
            this.btnBetBig.visible = false;
        }
        else if(this._betType == Papaya.PokerGo.Double.BET_TYPE.BIG){
            this.btnBetSmall.visible = false;
        }


        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                App.uiManager.showMessage(err);
                return;
            }

            App.game.syncGame(data.game || {});
            App.game.double.syncDouble(data);

            self.updateDealPokers(function (){
                self.updateResultsShow(data.results);
                self._isReady = false;
            });
            self.updateReward();
        };

        var api = "/pokerGo/double/deal";
        var params = {};
        params.betType = betType;
        App.netManager.request(api, params, Laya.Handler.create(null, onComplete));
    };

    DoubleView.prototype.updateResultsShow = function (results){
        switch (results){
            case  Papaya.PokerGo.Double.RESULT_WIN :
                this._jackpot = App.animManager.get("ani.double.BoSize");
                this.boxTop.addChild(this._jackpot);
                this._jackpot.x = this.imgJackpot.x ;
                this._jackpot.y = this.imgJackpot.y ;
                this._jackpot.play();
                this.imgJackpot.visible = false;

                this._pokerlight = App.animManager.get("ani.doublepoker.light");
                this.pokerLight.addChild(this._pokerlight);
                this._pokerlight.play();

                var self = this;
                if(self["results_" + this._betType]){
                    self["results_" + this._betType].visible = true;

                }

                this.tip.skin = "assets/ui.double/img_winLabel.png";

                this.btnReady.disabled = false;
                break;
            case  Papaya.PokerGo.Double.RESULT_LOST :

                this.tip.skin = "assets/ui.double/img_lostLabel.png";

                this.btnReady.disabled = true;
                break;

            case  Papaya.PokerGo.Double.RESULT_DRAW :

                this.tip.skin = "assets/ui.double/img_drawLabel.png";

                this.btnReady.disabled = false;

                break;
        }
        App.uiManager.doDirectionFadeInAction(this.boxNum,"dowm",120);
        this.boxNum.visible = true;
    };

    DoubleView.prototype.updateDealPokers = function (cb){
        var double = App.game.double;
        var handPokers = double.handPokers;

        this.poker.visible = true;
        this.poker.scaleX  = 1;

        var poker = handPokers[0];
        this._poker = new Laya.Image();
        this._poker.pos(this.poker.x,this.poker.y);
        this._poker.anchorX = 0.5;
        this._poker.anchorY = 0.5;
        this._poker.skin = "assets/pokers/" + poker.type + "_" + poker.name + ".png";
        this._poker.scaleX = 0;
        this.boxMiddle.addChild(this._poker);

        var self = this;

        self._isDoEffect = true;
        var speed = 0.2;
        var outCallFunc = CallFunc.create(Laya.Handler.create(this,function(){

            self.poker.visible = false;

            self._poker.visible = true;

            var inCallFunc = CallFunc.create(Laya.Handler.create(this,function(){
                self._isDoEffect = false;
                if(cb){
                    cb();
                }
            }));

            var scaleIn = ScaleBy.create(speed,1,1);

            var seq = Sequence.create(scaleIn,inCallFunc);
            seq = seq.clone();
            App.actionManager.addAction(seq,self._poker);
        }));

        var scaleOut = ScaleBy.create(speed,0,1);
        var seq = Sequence.create(scaleOut,outCallFunc);
        App.actionManager.addAction(seq,this.poker);
    };

    DoubleView.prototype.updateBalance = function (balance){
        var player = App.player;
        this.labelBalance.text = balance || player.balance;
    };

    DoubleView.prototype.updateReward = function (){
        var double = App.game.double;
        this.labelReward.text = double.lastScore;
        this.labelWinReward.text = double.lastScore * 2;
    };

    return DoubleView
})(DoubleViewUI);