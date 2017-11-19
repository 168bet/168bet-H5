var BattleController = (function(_super) {

    var BattleController = function(view) {
        BattleController.super(this);

        this.playerScore = 0;

        this.battleView = view;

        // 下注金额范围
        this.betScoreRange = [1,10,20,50,100];
        this.betIndex = 2;
        // 下注的金币
        this.betScore = this.betScoreRange[this.betIndex];

        // 玩家选择的信息
        this.playerSelectInfo = {};

        // 历史记录
        this.recordHistory = [];
    };

    Laya.class(BattleController, "BattleController", _super);

    var __proto = BattleController.prototype;


    __proto.start = function(startData){
        this.fishPool = startData.fishPool;
        this.battleView.initFish(this.fishPool);
        this.battleView.initCircleBgColor(startData.retData.colorBgSource);
        startData.retData.dataSource.goldLab = App.player.balance;
        this.setDataSource(startData.retData.dataSource);
        this.battleView.setBetLightEffect(this.betScore);
        this.playerScore = App.player.balance;
        //this.battleView.goldLab = this.playerScore;
    };

    __proto.select = function(index) {
        var fish = this.fishPool[index];
        var fishId = fish.id;
        if(!this.playerSelectInfo[fishId])
        {
            this.playerSelectInfo[fishId] = {};
            this.playerSelectInfo[fishId].betCount = 0;
        }

        this.playerSelectInfo[fishId].betMultiple = fish.rate;
        this.playerSelectInfo[fishId].betCount += this.betScore;
        this.playerSelectInfo[fishId].index = index+1;

        if(this.playerSelectInfo[fish.id].betCount > 100)
        {
            this.playerSelectInfo[fish.id].betCount = 100;
        }

        var allBetCount = 0;
        for(var id in this.playerSelectInfo)
        {
            allBetCount += this.playerSelectInfo[id].betCount;
        }

        if(allBetCount > this.playerScore)
        {
            this.playerSelectInfo[fishId].betCount = 0;
        }

        var dataSource = {};
        dataSource.goldLab = this.upgradeViewGold();
        dataSource["fishBet"+(index+1)] = this.playerSelectInfo[fishId].betCount;

        this.setDataSource(dataSource);
        this.battleView.onSelectCallBack(index+1);
        return dataSource;
    };

    // 押注
    __proto.raise = function() {

        var betScoreRange = this.setBetScoreRange();

        this.betIndex += 1;
        if(this.betIndex > betScoreRange.length -1)
        {
            this.betIndex = 0;
        }
        this.betScore = betScoreRange[this.betIndex];

        var dataSource = {};
        //dataSource.goldLab = this.upgradeViewGold();
        dataSource.betCount = this.betScore;

        this.setDataSource(dataSource);
        this.battleView.setBetLightEffect(this.betScore);
    };

    __proto.clearBet = function() {

        for(var fishId in this.playerSelectInfo)
        {
            this.playerSelectInfo[fishId] = null;
        }
        this.playerSelectInfo = {};

        var playerScore = this.playerScore;

        this.setDataSource({goldLab:playerScore});
        this.battleView.clearBet();
    };

    __proto.allBet = function() {
        var index;
        this.playerSelectInfo = {};
        //var retData ;
        //var goldLab;
        //var dataSource = {};
        for(index = 0 ; index < this.fishPool.length ; index++)
        {
            this.select(index);
            //dataSource["fishBet"+(index+1)] = retData["fishBet"+(index+1)];
            //goldLab = retData["goldLab"];
        }

        //dataSource["goldLab"] = goldLab;
        //this.setDataSource(dataSource);
    };

    __proto.startRound = function(resultData) {
        this.gameEndData = resultData;
        //this.surviveFish = resultData.surviveFish;
        this.battleView.startRound(resultData.surviveFish);
    };

    __proto.gameOver = function() {
        //this.setDataSource(this.gameEndData.dataSource);
        this.battleView.gameOver(this.gameEndData);
    };

    // 下注不能大于本金，所以这里重新计算一下
    __proto.setBetScoreRange = function() {
        var maxBetScoreRange = this.betScoreRange[this.betScoreRange.length -1];
        var resultRange = [];
        if(this.playerScore >= maxBetScoreRange)
        {
            return this.betScoreRange.concat();
        }
        else
        {
            for(var index in this.betScoreRange)
            {
                var bet = this.betScoreRange[index];
                if(bet < this.playerScore)
                {
                    resultRange.push(bet);
                }
            }
        }

        return resultRange;
    };

    __proto.upgradeViewGold = function() {
        var playerScore = this.playerScore;
        var betScore = 0;
        var info;
        for(var fishId in this.playerSelectInfo)
        {
            info = this.playerSelectInfo[fishId];
            betScore += info.betCount;
        }

        var newPlayerScore = playerScore - betScore;
        return newPlayerScore;
    };

    __proto.setDataSource = function(obj) {
        this.battleView.dataSource = obj;
        //this.battleView.goldLab = App.player.balance;
    };

    __proto.getSelectInfo = function() {
        return this.playerSelectInfo;
    };

    return BattleController;
}(laya.events.EventDispatcher));