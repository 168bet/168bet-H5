var BetView = (function(_super) {
    var Utils = Papaya.Utils;
    var Logic = Papaya.DiamondDeal.Logic;

    function BetView() {
        BetView.super(this);
        this.bet = 100;
        this.rangeIndex = 0;
        this.betRange = [100,200,500];
    }

    Laya.class(BetView, "BetView", _super);

    var __proto = BetView.prototype;

    __proto.init = function() {
        this.initBtnEvent();
        this.tenDiamondReward.text = Utils.format_By_Comma(Math.round(Logic.calTotalReward(this.bet,50)*100));
        this.currentBet.text = this.bet;

        if(!this.makeABetSkeleton)
        {
            this.makeABetSkeleton = new Laya.Skeleton();
            this.makeABetSkeleton.url = "assets/effect/makeABet/poacher.sk";
            this.makeABetSkeleton.pos(720, 280);
            this.addChild(this.makeABetSkeleton);
        }

        if(!this.startBtnEffect)
        {
            this.startBtnEffect = new Laya.Skeleton();
            this.startBtnEffect.url = "assets/effect/startBtnEffect/poacher.sk";
            this.startBtnEffect.pos(this.startBtn.x - 5, this.startBtn.y + 70);
            this.addChild(this.startBtnEffect);
        }

    };

    __proto.initBtnEvent = function() {
        this.upBet.on(Laya.Event.MOUSE_DOWN, this, this.onUpBet);
        this.downBet.on(Laya.Event.MOUSE_DOWN, this, this.onDownBet);
        this.startBtn.on(Laya.Event.MOUSE_DOWN, this, this.onEnterBattleView);
    };

    __proto.onUpBet = function() {
        this.rangeIndex += 1;
        if(this.rangeIndex >= this.betRange.length)
        {
            this.rangeIndex = 0;
        }
        this.bet = this.betRange[this.rangeIndex];
        var totalReward = Math.round(Logic.calTotalReward(this.bet,50)*this.bet);
        this.setDataSource({currentBet:this.bet, tenDiamondReward:Utils.format_By_Comma(totalReward)});
    };

    __proto.onDownBet = function() {
        //this.bet -= 100;
        //if(this.bet < 100)
        //{
        //    this.bet = 100;
        //}

        this.rangeIndex -= 1;
        if(this.rangeIndex < 0)
        {
            this.rangeIndex = this.betRange.length-1;
        }
        this.bet = this.betRange[this.rangeIndex];

        var totalReward =  Math.round(Logic.calTotalReward(this.bet,50)*this.bet);
        this.setDataSource({tenDiamondReward:Utils.format_By_Comma(totalReward),currentBet:this.bet});
    };

    __proto.onEnterBattleView = function() {

        var self = this;
        var complete = function(err,data) {
            if(err != null)
            {
                return;
            }

            if(data)
            {
                App.runBattleView(data);
                //self.blocks = data.blocks;
                //self.initView();
                //self.viewAni();
                //self.setLifeLight(data.life);
                //self.setDataSource(null,data.dataSource);
            }
        };
        App.netManager.request('/diamondDeal/gameStart',{bet:this.bet}, Laya.Handler.create(null, complete));
    };

    __proto.setDataSource = function(obj){
        this.dataSource = obj;
    };

    __proto.dispose = function() {
    };

    return BetView;
}(BetViewUI));