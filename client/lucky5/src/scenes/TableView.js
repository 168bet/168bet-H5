var TableView = (function(_super) {
    
    var Lucky5 = Papaya.Lucky5;
    var Game = Lucky5.Game;
    
    function TableView() {
        TableView.super(this);

        // sprites
        this.pokers             = [];
        this.logo               = new LogoBox();

        // animations
        this.animations         = [];

        // view states
        this.state              = TableView.STATE_NULL;
        this.enterState         = TableView.STATE_NULL;

        // game values
        this.handValues         = [];
        this.holdValues         = [ false, false, false, false, false ];
        this.markValues         = [ false, false, false, false, false ];
        this.result             = Lucky5.Poker.NOTHING;
        this.score              = 0;
        this.balance            = 10000;
        this.betAmount          = Lucky5.MIN_BET;

        this.init();
    }

    Laya.class(TableView, "TableView", _super);

    TableView.prototype.init = function() {
        // 初始化Logo
        var sprite = this.boxTop.getChildByName('bg_topright');
        this.logo.top = -2;
        this.logo.left = 34;
        sprite.addChild(this.logo);

        this.resultBar.visible = false;
        this.musicOn = true;

        var list = this.listRecord;
        list.itemRender = RecordBox;
        list.array = [];

        this.initPokers();
        this.initEvents();
        this.initValues();

    };

    TableView.prototype.initPokers = function() {
        for (var i = 0; i < 5; i++) {
            var poker = new Poker();
            var sprite = this.boxMiddle.getChildByName("poker" + (i + 1));

            poker.x = sprite.x;
            poker.y = sprite.y;
            poker.left = sprite.left;
            poker.id = i;

            this.pokers[i] = poker;
            this.boxMiddle.addChild(poker);

            poker.on(Poker.Event.HOLD, this, this.onHoldClick, [i]);
        }
    };

    TableView.prototype.initEvents = function() {
        this.buttonDeal.on(Laya.Event.MOUSE_DOWN, this, this.onDealClick);
        this.buttonDraw.on(Laya.Event.MOUSE_DOWN, this, this.onDrawClick);
        this.btnStakeAdd.on(Laya.Event.MOUSE_DOWN, this, this.onIncrClick);
        this.btnStakeCut.on(Laya.Event.MOUSE_DOWN, this, this.onDecrClick);
        this.buttonMusic.on(Laya.Event.MOUSE_DOWN, this, this.onMusicClick);
        this.buttonHelp.on(Laya.Event.MOUSE_DOWN, this, this.onHelpClick);

        this.on(Laya.Event.ADDED, this, this.onAdded);
    };

    TableView.prototype.initValues = function() {
        this.handValues         = [];
        this.holdValues         = [ false, false, false, false, false ];
        this.markValues         = [ false, false, false, false, false ];
    };

    TableView.prototype.onAdded = function() {
        this.enterState = TableView.STATE_READY;

        this.initValues();
        this.setPokerFaceDown();
    };

    TableView.prototype.onDealClick = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.handValues = data.pokers;
            self.dealPokers();
        };
        var api = "/lucky5/deal";
        var params = {
            bet:   this.betAmount
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));

        App.assetsManager.playSound("deal");
    };

    TableView.prototype.onDrawClick = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            self.handValues = data.pokers;
            self.holdValues = data.holds;
            self.markValues = data.marks;
            self.result     = data.result;
            self.score      = data.score;
            self.drawPokers();
        };
        var api = "/lucky5/draw";
        var params = {
            hold:   JSON.stringify(this.holdValues)
        };
        App.netManager.request(api, params, Laya.Handler.create(null, complete));

        App.assetsManager.playSound("deal");
    };

    TableView.prototype.onIncrClick = function() {
        var delta = Lucky5.MIN_BET;
        App.assetsManager.playSound("bet");

        if (this.betAmount >= Lucky5.MAX_BET) {
            return;
        }

        this.betAmount += delta;
    };

    TableView.prototype.onDecrClick = function() {
        var delta = Lucky5.MIN_BET;
        App.assetsManager.playSound("bet");

        if (this.betAmount <= Lucky5.MIN_BET) {
            return;
        }
        this.betAmount -= delta;
    };

    TableView.prototype.onHoldClick = function(selectIndex) {
        this.holdPoker(selectIndex);
    };

    TableView.prototype.onMusicClick = function() {
        App.assetsManager.playSound("click");

        if(this.musicOn)
        {
            this.musicOn = false;
            Laya.SoundManager.muted = true;
        }
        else if(!this.musicOn)
        {
            this.musicOn = true;
            Laya.SoundManager.muted = false;
            App.assetsManager.playMusic("music");
        }
    };

    TableView.prototype.onHelpClick = function() {
        App.assetsManager.playSound("click");
    };

    TableView.prototype.disable = function() {
        this.buttonDeal.mouseEnabled = false;
        this.buttonDraw.visible = true;
        this.buttonJackPot.mouseEnabled = false;
    };

    TableView.prototype.enable = function() {
        this.buttonDeal.mouseEnabled = true;
        this.buttonJackPot.mouseEnabled = true;
    };

    TableView.prototype.setPokerFaceDown = function() {
        for (var i = 0; i < 5; i++) {
            if (this.holdValues[i] == true) {
                continue;
            }
            this.pokers[i].flip(Poker.STATE_BACK);
        }
    };

    TableView.prototype.setPokerFaceUp = function() {
        for (var i = 0; i < 5; i++) {
            var delay = i * 50;

            if (this.holdValues[i] == false) {
                var handPoker = this.handValues[i];

                this.pokers[i].setValue(handPoker);
            }

            this.timerOnce(delay, this.pokers[i], this.pokers[i].flip, [Poker.STATE_FRONT]);
        }
    };

    TableView.prototype.holdPoker = function(index) {
        if (!this.holdAvailable()) {
            return;
        }

        this.holdValues[index] = !this.holdValues[index];
        this.pokers[index].hold();
    };

    TableView.prototype.dealPokers = function() {
        var self = this;

        this.setPokerFaceDown();
        this.timerOnce(600, this, this.setPokerFaceUp);
        this.timerOnce(1200, this, this.autoHold);
        this.enterState = TableView.STATE_DEALED;
    };

    TableView.prototype.drawPokers = function() {
        var self = this;

        this.setPokerFaceDown();
        this.timerOnce(600, this, this.setPokerFaceUp);
        this.timerOnce(1200, this, this.present);

        this.enterState = TableView.STATE_DRAWED;
    };

    TableView.prototype.present = function() {
        var self = this;

        // Lost
        if (this.result == Lucky5.Poker.NOTHING) {
            msg = "YOU LOST!";
            App.uiManager.showMessage(msg);

            this.gray = true;
            App.assetsManager.playSound("fail");

            this.timerOnce(2000, null, function() {
                self.gray = false;
                self.enterState = TableView.STATE_READY;

                self.addRecord(Papaya.sprintf("[L]押注%d/得分0", self.betAmount));
            });
        }
        // Win
        else {
            var index = self.result - 1;
            var spriteResult = self.boxTop.getChildByName("result_" + index);
            self.resultBar.visible = true;
            self.resultBar.y = spriteResult && spriteResult.y;

            var actionResult = Repeat.create(
                Sequence.create(
                    FadeOut.create(0.8),
                    FadeIn.create(0.8)),
                3);
            App.actionManager.addAction(actionResult, self.resultBar);

            for (var i = 0; i < 5; i++) {
                var poker = this.pokers[i];

                if (this.markValues[i] == true) {
                    poker.blink();

                    var action = Repeat.create(Sequence.create(FadeOut.create(0.5), FadeIn.create(0.5)), 3);
                    App.actionManager.addAction(action, poker);
                }
                else {
                    poker.setGray(true);
                }
            }

            var msg = Lucky5.Poker.TYPE_NAME[self.result];
            this.timerOnce(1000, null, function() {
                App.uiManager.showMessage(msg);
            });

            this.timerOnce(3000, null, function() {
                var dlg = new MessageDialog(self.score);

                dlg.popup();
                self.enterState = TableView.STATE_READY;

                self.addRecord(Papaya.sprintf("[W]押注%d/得分%d 牌型: %s", self.betAmount, self.score, msg));
            });
        }
    };

    TableView.prototype.updateBalance = function() {
        if (this.textBalance.text != this.balance) {
            this.textBalance.text = this.balance;
        }
    };

    TableView.prototype.updateBetAmount = function() {
        if (this.textBetAmount.text != this.betAmount) {
            this.textBetAmount.text = this.betAmount;

            this.updateReward();
        }
    };

    TableView.prototype.updateReward = function() {
        var keys = Object.keys(Lucky5.Poker.SCORES);
        for (var i = 0, size = keys.length; i < size; i++) {
            var type = keys[i];
            var sprite = this.boxTop.getChildByName("reward_" + (type - 1));

            if (sprite != null) {
                sprite.text = Math.floor(Lucky5.Poker.SCORES[type] * this.betAmount);
            }
        }
    };

    TableView.prototype.updateState = function() {
        // 切换状态
        var work = this.enterState;
        if (work) {
            switch (work) {
                case TableView.STATE_READY:
                    this.handValues = [];
                    this.holdValues = [ false, false, false, false, false ];
                    this.result = Lucky5.Poker.NOTHING;
                    this.score  = 0;

                    this.buttonDeal.disabled = false;
                    this.buttonDraw.disabled = false;
                    this.buttonDeal.visible = true;
                    this.buttonDraw.visible = false;

                    this.btnStakeAdd.disabled = false;
                    this.btnStakeCut.disabled = false;

                    this.gray = false;
                    break;
                case TableView.STATE_DEALED:
                    this.buttonDeal.visible = false;
                    this.buttonDraw.visible = true;

                    this.btnStakeAdd.disabled = true;
                    this.btnStakeCut.disabled = true;

                    this.resultBar.visible = false;
                    break;
                case TableView.STATE_DRAWED:
                    this.buttonDeal.disabled = true;
                    this.buttonDraw.disabled = true;
             
                    break;
                case TableView.STATE_ENDED:
                    break;
            }

            this.state = this.enterState;
            this.enterState = 0;
        }

        // 状态更新
        if (this.state == TableView.STATE_READY) {
            this.buttonDeal.disabled = false;
            this.btnStakeAdd.disabled = false;
            this.btnStakeCut.disabled = false;

            if (this.betAmount >= 100) {
                this.btnStakeAdd.disabled = true;
            }

            if (this.betAmount <= 0) {
                this.btnStakeCut.disabled = true;
                this.buttonDeal.disabled = true;
            }
        } else if (this.state == TableView.STATE_DEALED) {

        } else if (this.state == TableView.STATE_DRAWED) {

        } else if (this.state == TableView.STATE_ENDED) {

        } else {

        }
    };

    TableView.prototype.update = function(dt) {
        this.balance = App.player.balance;

        this.updateBetAmount();
        this.updateBalance();
        this.updateState();
    };

    TableView.prototype.holdAvailable = function() {
        return (this.state == TableView.STATE_DEALED);
    };

    TableView.prototype.autoHold = function() {
        if (!this.holdAvailable()) {
            return;
        }

        var data = Lucky5.Logic.calculate2(this.handValues);
        if (data.result != Lucky5.Poker.NOTHING) {
            var markValues = data.marks;
            for (var i = 0, size = markValues.length; i < size; i++) {
                if (markValues[i] == true) {
                    this.holdPoker(i);
                }
            }
        }
    };

    TableView.prototype.addRecord = function(msg) {
        var list = this.listRecord;
        list.addItem({
            desc: msg
        });

        var size = list.array.length;
        var repeatY = list.repeatY;
        var scrollTo = size > repeatY ? size - repeatY : 0;

        list.scrollTo(scrollTo);
    };

    TableView.STATE_NULL          = 0;
    TableView.STATE_READY         = 1; //准备就绪
    TableView.STATE_DEALED        = 2; //已发牌
    TableView.STATE_DRAWED        = 3; //已换牌
    TableView.STATE_ENDED         = 4; //结束

    return TableView;
}(TableViewUI));