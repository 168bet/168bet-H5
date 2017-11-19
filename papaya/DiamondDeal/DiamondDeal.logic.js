(function(root) {

    var Utils = Papaya.Utils;

    //基础奖励阈值
    var BASE_REWARD = 0.38;

    //系统回收阈值
    var POW_BASE = 0.97;

    var Logic = root.Logic = function() {
    };

    Logic.calculateReward = function(bet,diamondLeft,gridLeft) {
        //已收集的钻石量
        var diamondCollected = 10 - diamondLeft;
        //当前情况下选中钻石的概率
        var rate = diamondLeft/gridLeft;
        //奖励计算 （当前奖励额【相当于投入的赌注】 * BASE_REWARD * (POW_BASE^以获取的钻石量) / 抽中概率
        var reward = (bet * BASE_REWARD * Math.pow(POW_BASE, diamondCollected) / rate).toFixed(2);

        return Number(reward);

    };

    Logic.calTotalReward = function(bet,gridLeft){
        var total = 0;
        bet = 1;
        var currentBet = bet;
        var resultBet;
        for(var diamond = 10 ; diamond > 0 ; diamond--)
        {
            resultBet = this.calculateReward(currentBet,diamond,gridLeft);
            currentBet = resultBet;
            total += resultBet;
        }
        return Math.round(Number(total));
    };

    Logic.calculateLeftBet = function(currentReward,lifeLeft){
        var leftReward = currentReward * (1 - 0.25 * (4 - lifeLeft));
        return leftReward == 0?0:leftReward.toFixed(2);
    };


}(Papaya.DiamondDeal));