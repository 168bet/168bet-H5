(function(root) {
     var _super = root.Game;
    root.Shark.list_1 = [
        //{id: 1001, name: "小虫鱼", rate: 2, weight: 88, colorId:2, speed:1.3, scale:0.8},
        //{id: 1002, name: "草鱼", rate: 2, weight: 88, colorId:2, speed:1.5, scale:0.8},
        {id: 1003, name: "鲽鱼", rate: 2, weight: 88, colorId:2, speed:1.5, scale:0.8},
        {id: 1004, name: "气泡鱼", rate: 3, weight: 59, colorId:2, speed:1.5, scale:0.8},
        {id: 1005, name: "灯笼鱼", rate: 3, weight: 59, colorId:6, speed:1.6, scale:0.8},
        {id: 1006, name: "条纹鱼", rate: 3, weight: 59, colorId:2, speed:1.6, scale:0.8},
        {id: 1007, name: "河豚鱼", rate: 4, weight: 44, colorId:3, speed:1.6, scale:0.8},
        {id: 1008, name: "小丑鱼", rate: 4, weight: 44, colorId:3, speed:1.6, scale:0.8},
        {id: 1009, name: "蓝宝石", rate: 4, weight: 44, colorId:3, speed:1.7, scale:0.6},
        {id: 1010, name: "金枪鱼", rate: 5, weight: 35, colorId:6, speed:1.7, scale:0.8},
        {id: 1011, name: "乌龟", rate: 5, weight: 35, colorId:6, speed:1.8, scale:0.8},
        {id: 1012, name: "孔雀鱼", rate: 5, weight: 35, colorId:6, speed:1.8, scale:0.8},
        {id: 1013, name: "蝴蝶鱼", rate: 6, weight: 29, colorId:1, speed:1.8, scale:0.8},
        {id: 1014, name: "神仙鱼", rate: 6, weight: 29, colorId:1, speed:1.8, scale:0.8}
    ];

    root.Shark.list_2 = [
        {id: 1015, name: "青蛙",  rate: 7, weight: 25, colorId:4, speed:2, scale:0.6},
        {id: 1016, name: "蝙蝠鱼", rate: 12, weight: 9, colorId:4, speed:2, scale:0.8},
        {id: 1018, name: "银龙鱼", rate: 20, weight: 5, colorId:4, speed:2, scale:0.8},
        {id: 1019, name: "金龙鱼", rate: 25, weight: 4, colorId:5, speed:2, scale:0.8},
        //{id: 1020, name: "金龙",  rate: 30, weight: 3, colorId:5, speed:2, scale:0.8}
    ];

    var Game = root.Shark.Game = function (opts) {
        opts = opts || {};
        Game.super(this, opts);
        this.id             = root.Game.ID_SHARK;

        // 玩家金币
        //this.playerScore = App.player.balance;

        // 赢取的金币
        this.winScore = opts.winScore || 0;

        // 上一局的下注信息
        this.lastBetInfo = {};

        // 每一局的记录（保存16局）,记录的是每一局最后剩下的小鱼ID
        this.recordHistory = opts.recordHistory || [];

        // 局数
        this.currentGameTime = opts.currentGameTime || 0;

        // 鱼池
        this.fishPool = opts.fishPool || [];

        // 倒计时
        this.countDownTime = 15;

        // 下注金额范围
        this.betScoreRange = [1,10,20,50,100];
        this.betIndex = 2;
        // 下注的金币
        this.betScore = this.betScoreRange[this.betIndex];

        // 玩家选择的信息
        this.playerSelectInfo = opts.playerSelectInfo || {};

        // 幸存的小鱼ID
        this.surviveFish = 0;

        this.initEvent();
        this.init();
    };

    root.inherits(Game, _super);
    
    var __proto = Game.prototype;

    __proto.initEvent = function() {
    };

    __proto.init = function() {

    };

    // 一局的准备
    __proto.ready = function() {
        var i;
        var obj = {};
        obj.dataSource = {};
        obj.colorBgSource = {};
        var list_1_count = Math.floor(Math.random() * 2) + 6;
        if (list_1_count > 7) {
            list_1_count = 7;
        }

        var id;
        var list1 = JSON.parse(JSON.stringify(root.Shark.list_1));
        var list2 = JSON.parse(JSON.stringify(root.Shark.list_2));
        this.fishPool = [];
        var currentList;

        for(i = 0 ; i < Papaya.Shark.MaxFish ; i++)
        {
            if(i < list_1_count)
            {
                currentList = list1;
            }
            else
            {
                currentList = list2;
            }

            id = Math.floor(Math.random() * currentList.length);
            if (id < 0 || id >= currentList.length) {
                id = 0;
            }

            obj.dataSource["bet"+(i+1)] = "A"+currentList[id].rate;
            obj.dataSource["squareBet"+(i+1)] = "A"+currentList[id].rate;
            obj.colorBgSource[(i+1)] = currentList[id].colorId;
            this.fishPool.push(currentList.splice(id, 1)[0]);
        }

        this.countDownTime = 20;
        this.winScore = 0;
        this.currentGameTime += 1;

        //obj.dataSource["goldLab"] = this.playerScore;
        obj.dataSource["countDownLab"] = this.countDownTime;
        obj.dataSource["betCount"] = this.betScoreRange[this.betIndex];
        obj.dataSource["winReward"] = this.winScore;

        return obj;
    };

    // 一局的开始
    //__proto.restart = function() {
    //
    //    this.countDownTime = 20;
    //    this.winScore = 0;
    //    this.currentGameTime += 1;
    //    this.playerSelectInfo = {};
    //    var dataSource = {
    //        goldLab:this.playerScore,
    //        winReward:this.winScore,
    //        betCount:this.betScoreRange[this.betIndex],
    //        countDownLab:this.countDownTime
    //    }
    //
    //    return dataSource;
    //    // this.startCD();
    //};

    //__proto.startCD = function() {
    //
    //    var self = this;
    //
    //     var timeLoop= function() {
    //        self.countDownTime -= 1;
    //        var cdStr;
    //        if(self.countDownTime <= 0)
    //        {
    //            self.countDownTime = 0;
    //            cdStr = 0;
    //            self.timesUp();
    //        }
    //        else if(self.countDownTime < 10 && self.countDownTime > 0)
    //        {
    //            cdStr = "0"+self.countDownTime;
    //            self.timeOut = setTimeout(timeLoop,1000);
    //        }
    //        else
    //        {
    //            cdStr = self.countDownTime;
    //            self.timeOut = setTimeout(timeLoop,1000);
    //        }
    //        self.setDataSource({"countDownLab":cdStr});
    //    };
    //
    //    this.timeOut = setTimeout(timeLoop,1000);
    //};

    __proto.runNow = function(clientSelectInfo) {
        if (typeof clientSelectInfo == "string") {
            clientSelectInfo = JSON.parse(clientSelectInfo.toString());
        }
        
        // clearTimeout(this.timeOut);
        return this.timesUp(clientSelectInfo);
    };

    __proto.timesUp = function(clientSelectInfo) {
        var index = Papaya.Utils.calcWeight(this.fishPool);
        var fishId;
        var betCount = 0;
        this.surviveFish = this.fishPool[index].id;//this.fishPool[index];
        var fishRate = this.fishPool[index].rate;
        for(fishId in clientSelectInfo)
        {
            betCount += clientSelectInfo[fishId].betCount;
        }

        var isClearRecordHistory = false;
        var data = {};
        for(fishId in clientSelectInfo)
        {
            if(this.surviveFish == fishId)
            {
                this.winScore = clientSelectInfo[fishId].betCount * clientSelectInfo[fishId].betMultiple;
                //this.playerScore += this.winScore;
                break;
            }
        }

        if(this.currentGameTime > 16)
        {
            //this.clearRecordHistory();
            isClearRecordHistory = true;
            this.currentGameTime = 1;
            this.recordHistory = [];
        }

        this.recordHistory[this.currentGameTime] = this.surviveFish;

        //for(fishId in this.playerSelectInfo)
        //{
        //    this.lastBetInfo[fishId] = this.playerSelectInfo[fishId];
        //}

        //data.dataSource = {winReward:this.winScore,goldLab:this.playerScore};
        this.betCount = betCount;

        data.winReward = this.winScore;
        data.betCount = betCount;
        data.surviveRate = fishRate;
        data.clearRecordHistory = isClearRecordHistory;
        data.currentGameTime = this.currentGameTime;
        data.recordHistory = this.recordHistory[this.currentGameTime];
        data.surviveFish = this.surviveFish;
        return data;
    };

    //__proto.gameEnd = function() {
    //    var isClearRecordHistory = false;
    //    var data = {};
    //    //var selectIndex;
    //    var fishId;
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        if(this.surviveFish == fishId)
    //        {
    //            this.winScore = this.playerSelectInfo[fishId].betCount * this.playerSelectInfo[fishId].betMultiple;
    //            this.playerScore += this.winScore;
    //            //selectIndex = index;
    //            break;
    //        }
    //    }
    //
    //
    //    if(this.currentGameTime > 16)
    //    {
    //        //this.clearRecordHistory();
    //        isClearRecordHistory = true;
    //        this.currentGameTime = 1;
    //        this.recordHistory = [];
    //    }
    //
    //    this.recordHistory[this.currentGameTime] = this.surviveFish;
    //
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        this.lastBetInfo[fishId] = this.playerSelectInfo[fishId];
    //    }
    //
    //
    //    //this.lastBetInfo = {betScore:this.betScore,select:this.playerSelect[selectIndex],selectBet:this.playerSelectBet[selectIndex]};
    //
    //    data.dataSource = {winReward:this.winScore};
    //    data.clearRecordHistory = isClearRecordHistory;
    //    data.currentGameTime = this.currentGameTime;
    //    data.recordHistory = this.recordHistory[this.currentGameTime];
    //
    //    return data;
    //
    //    //this.setRecordHistory();
    //    //this.setDataSource({winReward:this.winScore});
    //
    //};

    // 下注不能大于本金，所以这里重新计算一下
    //__proto.setBetScoreRange = function() {
    //    var maxBetScoreRange = this.betScoreRange[this.betScoreRange.length -1];
    //    var resultRange = [];
    //    if(this.playerScore >= maxBetScoreRange)
    //    {
    //        return this.betScoreRange.concat();
    //    }
    //    else
    //    {
    //        for(var index in this.betScoreRange)
    //        {
    //            var bet = this.betScoreRange[index];
    //            if(bet < this.playerScore)
    //            {
    //                resultRange.push(bet);
    //            }
    //        }
    //    }
    //
    //    return resultRange;
    //};
    //
    //// 加注
    //__proto.raise = function() {
    //
    //    var betScoreRange = this.setBetScoreRange();
    //
    //    this.betIndex += 1;
    //    if(this.betIndex > betScoreRange.length -1)
    //    {
    //        this.betIndex = 0;
    //    }
    //    this.betScore = betScoreRange[this.betIndex];
    //    //this.setDataSource({betCount:this.betScore});
    //
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource.betCount = this.betScore;
    //    return dataSource;
    //};
    //
    //// 减注
    //__proto.unRaise = function() {
    //    var betScoreRange = this.setBetScoreRange();
    //
    //    this.betIndex -= 1;
    //    if(this.betIndex < 0)
    //    {
    //        this.betIndex = betScoreRange.length - 1;
    //    }
    //    this.betScore = betScoreRange[this.betIndex];
    //    //this.setDataSource({betCount:this.betScore});
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource.betCount = this.betScore;
    //    return dataSource;
    //};
    //
    //// 选取
    //__proto.select = function(index) {
    //    var fish = this.fishPool[index];
    //    var fishId = fish.id;
    //    if(!this.playerSelectInfo[fishId])
    //    {
    //        this.playerSelectInfo[fishId] = {};
    //        this.playerSelectInfo[fishId].betCount = 0;
    //    }
    //
    //    this.playerSelectInfo[fishId].betMultiple = fish.rate;
    //    this.playerSelectInfo[fishId].betCount += this.betScore;
    //    this.playerSelectInfo[fishId].index = index+1;
    //
    //    if(this.playerSelectInfo[fish.id].betCount > 100)
    //    {
    //        this.playerSelectInfo[fish.id].betCount = 100;
    //    }
    //
    //    var allBetCount = 0;
    //    for(var id in this.playerSelectInfo)
    //    {
    //        allBetCount += this.playerSelectInfo[id].betCount;
    //    }
    //
    //    if(allBetCount > this.playerScore)
    //    {
    //        this.playerSelectInfo[fishId].betCount = 0;
    //    }
    //
    //    var dataSource = {};
    //    dataSource.goldLab = this.upgradeViewGold();
    //    dataSource["fishBet"+(index+1)] = this.playerSelectInfo[fishId].betCount;
    //
    //    return dataSource;
    //
    //
    //    //if(this.playerSelect[index])
    //    //{
    //    //    this.playerSelect[index] = null;
    //    //    this.playerSelectBet[index] = null;
    //    //}
    //    //else
    //    //{
    //    //    var fishId = this.fishPool[index];
    //    //    this.playerSelect[index] = fishId;
    //    //    this.playerSelectBet[index] = FishBet[fishId].bet;
    //    //}
    //
    //    // this.playerSelect = this.fishPool[index];
    //    // this.playerSelectBet = FishBet[index].bet;
    //};
    //
    //__proto.clearBet = function() {
    //    //this.betScore = 0;
    //    //this.setDataSource({"betCount":this.betScore});
    //    //this.playerSelect = [];
    //    //this.playerSelectBet = [];
    //
    //    for(var fishId in this.playerSelectInfo)
    //    {
    //        this.playerSelectInfo[fishId] = null;
    //    }
    //    this.playerSelectInfo = {};
    //
    //    var playerScore = this.playerScore;
    //
    //    return {goldLab:playerScore};
    //    //this.setDataSource();
    //};
    //
    //__proto.allBet = function() {
    //    var index;
    //    this.playerSelectInfo = {};
    //    var retData ;
    //    var goldLab;
    //    var dataSource = {};
    //    for(index = 0 ; index < this.fishPool.length ; index++)
    //    {
    //        retData = this.select(index);
    //        dataSource["fishBet"+(index+1)] = retData["fishBet"+(index+1)];
    //        goldLab = retData["goldLab"];
    //    }
    //
    //    dataSource["goldLab"] = goldLab;
    //    return dataSource;
    //};
    //
    //
    //__proto.rebet = function() {
    //    // 当前的下注信息和上一局的下注信息要分开，如果当前本金小于上一局的下注总额，那就保持当前下注
    //    var currentData = {};
    //    var lastBetData = {};
    //    var resultData = null;
    //    var info;
    //    var allBetCount = 0;
    //    var fishId;
    //    var data = {};
    //
    //    for(fishId in this.lastBetInfo)
    //    {
    //        info = this.lastBetInfo[fishId];
    //
    //    }
    //    data.selectIndex = [];
    //
    //    for(fishId in this.playerSelectInfo)
    //    {
    //        currentData["fishBet"+ this.playerSelectInfo[fishId].index] = this.playerSelectInfo[fishId].betCount;
    //    }
    //
    //    for(fishId in this.lastBetInfo)
    //    {
    //        info = this.lastBetInfo[fishId];
    //        allBetCount += info.betCount;
    //        lastBetData["fishBet"+ info.index] = info.betCount;
    //    }
    //
    //
    //    if(allBetCount > this.playerScore)
    //    {
    //        resultData = currentData;
    //    }
    //    else
    //    {
    //        // 可以用上一局的下注信息就把当前下注信息清空，并更新当前下注信息为上一局的下注信息
    //        resultData = lastBetData;
    //        for(fishId in this.playerSelectInfo)
    //        {
    //            this.playerSelectInfo[fishId] = null;
    //        }
    //        this.playerSelectInfo = {};
    //
    //        for(fishId in this.lastBetInfo)
    //        {
    //            this.playerSelectInfo[fishId] = this.lastBetInfo[fishId];
    //            data.selectIndex.push(this.playerSelectInfo[fishId].index);
    //        }
    //
    //    }
    //
    //    data.dataSource = resultData;
    //    data.dataSource.goldLab = this.upgradeViewGold();
    //    return data;
    //    //if(this.lastBetInfo != null)
    //    //{
    //    //    //this.playerSelect = this.lastBetInfo.select;
    //    //    //this.playerSelectBet = this.lastBetInfo.selectBet;
    //    //    this.betScore = this.lastBetInfo.betScore;
    //    //    //var index = this.fishPool.indexOf(this.playerSelect);
    //    //    //this.lastBetInfo.index = index;
    //    //    return {betCount:this.betScore};
    //    //    //this.setDataSource();
    //    //}
    //    //return null;
    //};
    //
    //// 更新界面上的金币数量，但是不会影响实际金币，实际金币只会在倒计时时间结束后才会扣取
    //__proto.upgradeViewGold = function() {
    //    var playerScore = this.playerScore;
    //    var betScore = 0;
    //    var info;
    //    for(var fishId in this.playerSelectInfo)
    //    {
    //        info = this.playerSelectInfo[fishId];
    //        betScore += info.betCount;
    //    }
    //
    //    var newPlayerScore = playerScore - betScore;
    //    return newPlayerScore;
    //    //return {goldLab:newPlayerScore};
    //    //this.setDataSource({goldLab:newPlayerScore});
    //};

} (Papaya));