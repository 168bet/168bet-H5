var DoubleView = (function(_super) {

    var Lucky5 = Papaya.Lucky5;
    var Double = Lucky5.Double;

    function DoubleView() {
        DoubleView.super(this);

        // sprites
        this.pokers             = [];

        // animations
        this.animations         = [];

        // view states
        this.state              = TableView.STATE_NULL;
        this.enterState         = TableView.STATE_READY;

        // game values
        this.handValues         = [];
        this.dealerIndex        = 0;
        this.playerIndex        = -1;
        this.betType            = Double.BET_ORIG;
        this.betAmount          = 0;
        this.result             = 0;
        this.score              = 0;
        this.lastScore          = 0;
        this.round              = 0;

        this.init();
    }

    Laya.class(DoubleView, "DoubleView", _super);

    var __proto = DoubleView.prototype;

    __proto.setData = function(data) {
        data = data || {};

        this.lastScore = data.lastScore || 0;
    };

    __proto.init = function() {
        for (var i = 0; i < 5; i++) {
            var poker = new Poker();
            var sprite = this.boxMiddle.getChildByName("poker" + (i + 1));

            poker.x = sprite.x;
            poker.y = sprite.y;
            poker.left = sprite.left;
            poker.id = i;

            this.pokers[i] = poker;
            this.boxMiddle.addChild(poker);

            poker.on(Poker.Event.SELECT, this, this.onPokerClick, [i]);
        }

        this.labelScore.text = 0;

        this.initAnimations();
        this.initEvents();
    };

    __proto.initAnimations = function() {
        var anim = null;
        var names = [ "ani.double.light", "ani.royal.flush" ];
        var sprite = this.aniLogo;
        
        for (var i = 0, size = names.length; i < size; i++) {
            anim = App.animManager.get(names[i]);

            sprite.addChild(anim);
            anim.play();
            //anim.pivot(anim.width/2, anim.height/2);
        }
    };

    __proto.initEvents = function() {
        this.btnBack.on(Laya.Event.MOUSE_DOWN, this, this.onBackClick);
        this.btnDeal.on(Laya.Event.MOUSE_DOWN, this, this.onDealClick);
        this.btnDouble.on(Laya.Event.MOUSE_DOWN, this, this.onDoubleClick);
        this.btnHalf.on(Laya.Event.MOUSE_DOWN, this, this.onHalfClick);

        this.on(Laya.Event.ADDED, this, this.onAdded);
        this.on(Laya.Event.REMOVED, this, this.onRemoved);
    };

    __proto.onAdded = function() {
        this.enterState = DoubleView.STATE_READY;
    };

    __proto.onRemoved = function() {
        this.setDealerFaceDown();
        this.setPlayerFaceDown();
    };

    __proto.onDealClick = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.handValues = data.pokers;
            App.player.update(data.player);

            self.btnDeal.disabled = true;
            self.dealPokers();
        };
        var api = "/lucky5/double/deal";
        var params = {
            type:   this.betType
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));

        App.assetsManager.playSound("deal");
    };

    __proto.onBackClick = function() {
        App.assetsManager.playSound("click");

        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            App.runTableView();
        };

        var api = "/lucky5/back";
        var params = {};
        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    __proto.onPokerClick = function(selectIndex) {
        if (this.state != DoubleView.STATE_DEALED) {
            return;
        }

        if (selectIndex < 1 || selectIndex >= 5) {
            return;
        }

        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.result = data.result;
            self.score  = data.score;
            self.playerIndex = selectIndex;
            App.player.update(data.player);

            self.drawPokers();
        };
        var api = "/lucky5/double/draw";
        var params = {
            selected:   selectIndex
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));

        App.assetsManager.playSound("deal");
    };

    __proto.onDoubleClick = function() {
        App.assetsManager.playSound("bet");

        this.betType = Double.BET_DOUBLE;

        this.betAmount *= 2;
        this.btnDouble.disabled = true;
        this.btnHalf.disabled = true;
    };

    __proto.onHalfClick = function() {
        App.assetsManager.playSound("bet");

        this.betType = Double.BET_HALF;

        this.betAmount /= 2;
        this.btnDouble.disabled = true;
        this.btnHalf.disabled = true;
    };

    __proto.dealPokers = function() {
        var self = this;
        this.setDealerFaceDown();
        this.setPlayerFaceDown();
        this.timerOnce(600, this, this.setDealerFaceUp);

        this.enterState = DoubleView.STATE_DEALED;
    };

    __proto.drawPokers = function() {
        var self = this;

        this.setPlayerFaceUp();
        this.timerOnce(1000, this, this.present);

        this.enterState = DoubleView.STATE_DRAWED;
    };

    __proto.present = function() {
        var self = this;

        if (this.result == Lucky5.Double.RESULT_LOST) {
            msg = "YOU LOST!";
            App.uiManager.showMessage(msg);

            this.gray = true;
            App.assetsManager.playSound("fail");

            this.timerOnce(2000, null, function() {
                self.gray = false;
                self.enterState = DoubleView.STATE_ENDED;
            });
        } else if (this.result == Lucky5.Double.RESULT_DRAW) {
            msg = "DRAW";
            App.uiManager.showMessage(msg);

            this.timerOnce(1000, null, function() {
                self.lastScore = self.score;
                self.enterState = DoubleView.STATE_READY;
            });
        } else {
            msg = "YOU WIN!";
            App.uiManager.showMessage(msg);

            this.timerOnce(1000, null, function() {
                App.actionManager.add(
                    NumberTo.create(0.5, 0, self.score),
                    self.labelScore
                );

                self.lastScore = self.score;
                self.enterState = DoubleView.STATE_READY;
            });
        }
    };

    __proto.setPokerFaceUp = function(index) {
        if (index != -1) {
            var poker = this.pokers[index];

            poker.setValue(this.handValues[index]);
            poker.flip(Poker.STATE_FRONT);
        }
    };

    __proto.setPokerFaceDown = function(index) {
        (index != -1) && this.pokers[index].flip(Poker.STATE_BACK);
    };

    __proto.setDealerFaceUp = function() {
        this.setPokerFaceUp(this.dealerIndex);
    };

    __proto.setPlayerFaceUp = function() {
        this.setPokerFaceUp(this.playerIndex);
    };

    __proto.setDealerFaceDown = function() {
        this.setPokerFaceDown(this.dealerIndex);
    };

    __proto.setPlayerFaceDown = function() {
        this.setPokerFaceDown(this.playerIndex);
    };

    __proto.updateState = function() {
        // 切换状态
        var work = this.enterState;
        if (work) {
            switch (work) {
                case DoubleView.STATE_READY:
                    this.handValues = [];

                    this.result = 0;
                    this.score  = 0;
                    this.betAmount = this.lastScore;
                    this.betType = Double.BET_ORIG;

                    this.labelScore.text = 0;
                    this.btnDeal.disabled = false;
                    this.btnDouble.disabled = false;
                    this.btnHalf.disabled = false;

                    this.gray = false;
                    break;
                case DoubleView.STATE_DEALED:
                    this.result = 0;
                    this.score  = 0;
                    this.labelScore.text = 0;

                    this.btnDeal.disabled = true;
                    this.btnDouble.disabled = true;
                    this.btnHalf.disabled = true;
                    this.btnBack.disabled = true;

                    break;
                case DoubleView.STATE_DRAWED:
                    this.btnBack.disabled = false;
                    break;
                case DoubleView.STATE_ENDED:

                    break;
            }

            this.state = this.enterState;
            this.enterState = 0;
        }
    };

    __proto.updateData = function() {
        var data = {
            balance:        App.player.balance,
            betAmount:      this.betAmount
        };

        this.boxBottom.dataSource = data;
    };

    __proto.update = function(dt) {
        this.updateState();
        this.updateData();
    };


    //
    // DoubleView.prototype.enterGamblingSize = function(data) {
    //     //this.updgradePlayerInfo();
    //     this.setPokerFaceDown();
    //     this.image_Select.visible = false;
    //     this.btnShowPoker.mouseEnabled = true;
    //     this.stakeAdd.mouseEnabled = true;
    //     this.stakeCut.mouseEnabled = true;
    //
    //     this.labelRemainder.text = data.nowScore;
    //     this.labelInfo.text = data.gamblinSizeStake;
    //     this.labelResult.text = data.increaseScore;
    //     this.labelPlayTimes.text = data.gamblingSizeTimes;
    //
    //     this._step = Lucky5.DoubleView.Step.Enter;
    // };
    //
    // DoubleView.prototype.startGamblingSize = function() {
    //     //this.updgradePlayerInfo();
    //     this.setPokerFaceDown();
    //     this.openPokersTouch(true);
    //     this.image_Select.visible = false;
    //     this.btnShowPoker.mouseEnabled = false;
    //     this.btnBack.mouseEnabled = false;
    //
    //     var Multiple = this.game.getBankerMultiple();
    //     if(Multiple != 1)
    //     {
    //         this.randomMultiple.visible = true;
    //         this.MultipleNum.skin = "ui.table/randomMultiple_" + Multiple + ".png";
    //     }
    //
    //
    //     this.timerOnce(600,null,(function(){
    //         this.pokers[0].set(this.game.bankerPoker);
    //         this.pokers[0].flip();
    //     }).bind(this));
    //
    //
    //     this._step = Lucky5.DoubleView.Step.Running
    // };
    //
    // DoubleView.prototype.resultGamblingSize = function(data) {
    //     this.btnShowPoker.mouseEnabled = false;
    //     this.btnBack.mouseEnabled = false;
    //     this.stakeAdd.mouseEnabled = false;
    //     this.stakeCut.mouseEnabled = false;
    //     //this.updgradePlayerInfo();
    //     this.openPokersTouch(false);
    //     this._step = Lucky5.DoubleView.Step.End;
    //
    //     if(data.info == 'win')
    //     {
    //         this.doubleResult.skin = "ui.table/doubleWin.png";
    //         this.timerOnce(1500,null,function(){
    //             EventMgr.emit(Lucky5.Game_Event.Event.BACKTOMASSAGEVIEW);
    //         }.bind(this));
    //
    //     }
    //     else if(data.info == 'lose')
    //     {
    //         this.labelInfo.text = '0';
    //
    //         this.btnBack.mouseEnabled = true;
    //         this.doubleResult.skin = "ui.table/doubleLost.png";
    //         this.pokersGray(true);
    //         this.endGamblingSize();
    //     }
    //     else
    //     {
    //         this.btnShowPoker.mouseEnabled = true;
    //         this.btnBack.mouseEnabled = true;
    //     }
    // };
    //


    DoubleView.STATE_NULL          = 0;
    DoubleView.STATE_READY         = 1; //准备就绪
    DoubleView.STATE_DEALED        = 2; //已发牌
    DoubleView.STATE_DRAWED        = 3; //已开牌
    DoubleView.STATE_ENDED         = 4; //结束

    return DoubleView;
}(DoubleViewUI));