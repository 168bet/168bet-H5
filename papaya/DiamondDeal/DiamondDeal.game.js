(function(root) {
    var _super = root.Game;
    var Logic = root.DiamondDeal.Logic;
    var Utils = Papaya.Utils;
    var blocks = [];

    var Game = root.DiamondDeal.Game = function (opts) {
        opts = opts || {};
        Game.super(this, opts);
        this.id             = root.Game.ID_DIAMONDDEAL;

        //this.account = opts.account || 10000;
        this.rate = opts.rate || 0;
        this.diamondLeft = opts.diamondLeft || Papaya.MaxDiamond;
        this.life = opts.life || 4;
        this.currentBet = opts.currentBet || 1;
        this.currentReward = opts.currentReward || 0;
        this.totalReward = opts.totalReward || 0;
        this.maxGrid = opts.maxGrid || 50;

        this.nextReward = opts.nextReward || 0;

        this.record = opts.record || {};

        this.gameStep = opts.gameStep || Game.Step.game_Init;

    };

    root.inherits(Game, _super);
    
    var __proto = Game.prototype;

    __proto.initBlock = function() {
        for(var r = 0 ; r < 5 ; r++)
        {
            blocks[r] = [];
            for(var c = 0 ; c < 10 ; c++)
            {
                var obj = {type:Papaya.Block_Type.Nothing , state:Papaya.Block_State.Close};
                blocks[r][c] = obj;
            }
        }
    };

    __proto.getRecord = function() {

        if(this.gameStep != Game.Step.game_Running)
        {
            return {nothing:true};
        }

        this.initBlock();

        var resultViewData = {};
        for(var key in this.record)
        {
            if(key == "blocks")
            {
                for(var blockKey in this.record[key])
                {
                    var data = this.record[key][blockKey];
                    blocks[data.pos.row][data.pos.column].state = data.state;
                    blocks[data.pos.row][data.pos.column].type = data.selectType;

                    if(!resultViewData.blockOpened)
                    {
                        resultViewData.blockOpened = [];
                    }
                    resultViewData.blockOpened.push({
                        pos:{r:data.pos.row,c:data.pos.column},
                        state:data.state,
                        type:data.selectType
                    });
                }
            }
            else if(key == "viewData")
            {
                for(var viewDataKey in this.record["viewData"])
                {
                    resultViewData[viewDataKey] = this.record["viewData"][viewDataKey];
                }
            }
        }

        this["currentReward"] = this.record["currentReward"] || this["currentReward"];
        this["nextReward"] = this.record["nextReward"] || this["nextReward"];
        this["totalReward"] = this.record["totalReward"] || this["totalReward"];

        this["life"] = this.record["life"] || this["life"];
        resultViewData["life"] = this.record["life"] || this["life"];

        this["diamondLeft"] = this.record["diamondLeft"] || this["diamondLeft"];
        resultViewData["diamondLeft"] = this.record["diamondLeft"] || this["diamondLeft"];

        this["rate"] = this.record["rate"] || this["rate"];
        resultViewData["rate"] = this.record["rate"] || this["rate"];

        resultViewData.blocks = blocks.concat();

        return resultViewData;
    };

    __proto.gameStart = function(bet) {

        this.gameStep = Game.Step.game_Running;

        this.diamondLeft = Papaya.MaxDiamond;
        this.life = 4;
        this.currentBet = 1;
        this.rate = bet;
        this.currentReward = 0;
        this.maxGrid = 50;
        this.record = {};

        this.initBlock();

        this.nextReward = Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
        this.totalReward = Logic.calTotalReward(this.currentBet,this.maxGrid);

        this.viewNextReward = Math.round(this.nextReward*this.rate);
        this.viewCurrentReward = Math.round(this.currentReward*this.rate);
        this.viewTotalReward = Math.round(this.totalReward*this.rate);

        var resultData = {};
        resultData.dataSource = {
            diamondLeft: this.diamondLeft,
            nextWinReward: this.viewNextReward,//Utils.transform_Font_Type(this.viewNextReward),
            totalReward:  this.viewTotalReward//Utils.transform_Font_Type(this.viewTotalReward)
            //account:Utils.transform_Font_Type(this.account)
        };
        resultData.life = this.life;
        resultData.blocks = blocks.concat();

        this.setRecord({r:0,c:0,selectType:Papaya.Block_Type.Nothing,state:Papaya.Block_State.Close});
        return resultData;
    };

    __proto.select = function(pos) {
        var row = Math.floor(pos.y/99);
        var column = Math.floor(pos.x/99);

        var data = blocks[row][column];

        if(data.state == Papaya.Block_State.Open)
        {
            return null;
        }

        var probability = 0.05*this.diamondLeft/this.life;
        var ran = Math.random();
        if(ran <= probability)
        {
            data.type = Papaya.Block_Type.Diamond;
            this.life = 4;
            this.currentReward =  Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
            this.currentBet = this.currentReward;
            this.diamondLeft -= 1;
            //console.log("diamond currentReward = " + this.currentReward);
        }
        else
        {
            data.type = Papaya.Block_Type.Nothing;
            this.life -= 1;
            this.currentReward = this.currentReward==0?0:Logic.calculateLeftBet(this.currentBet,this.life);
            //this.currentBet = this.currentReward || this.startBet;
            //console.log("null currentReward = " + this.currentReward);
        }


        data.state = Game.Block_State.Open;
        this.maxGrid -= 1;

        this.nextReward = Logic.calculateReward(this.currentBet,this.diamondLeft,this.maxGrid);
        this.totalReward = Logic.calTotalReward(this.currentBet,this.maxGrid);

        var resultData = {};
        resultData.dataSource = {};
        resultData.gameEndType = "";
        if(this.life <= 0)
        {
            resultData.gameEndType = Papaya.Game_End_Type.Life;
            this.nextReward = 0;
            this.gameStep = Game.Step.game_End;
        }

        if(this.diamondLeft <= 0)
        {
            resultData.gameEndType = Papaya.Game_End_Type.Diamond;
            resultData.endReward = this.viewCurrentReward;//Utils.transform_Font_Type(this.viewCurrentReward);
            this.gameStep = Game.Step.game_End;
        }

        // 界面显示的数据
        this.viewNextReward = Math.round(this.nextReward*this.rate);
        this.viewCurrentReward = Math.round(this.currentReward*this.rate);
        this.viewTotalReward = Math.round(this.totalReward*this.rate);
        //console.log("viewCurrentReward = " + this.viewCurrentReward);

        resultData.selectType = data.type;
        resultData.pos = {r:row,c:column};
        resultData.life = this.life;
        resultData.dataSource.nextWinReward = this.viewNextReward;//Utils.transform_Font_Type(this.viewNextReward);
        resultData.dataSource.totalReward = this.viewTotalReward;//Utils.transform_Font_Type(this.viewTotalReward);
        resultData.dataSource.diamondLeft = this.diamondLeft;
        resultData.dataSource.winReward = this.viewCurrentReward;//Utils.transform_Font_Type(this.viewCurrentReward);

        this.setRecord({r:row,c:column,selectType:data.type,state:data.state});

        return resultData;
    };

    __proto.setRecord = function(data) {

        // 客户端服务器通用数据
        if(!this.record.blocks)
        {
            this.record.blocks = [];
        }

        var blockData = {};
        blockData.pos = {row:data.r,column:data.c};
        blockData.selectType = data.selectType;
        blockData.state = data.state;
        this.record.blocks.push(blockData);

        this.record.life = this.life;
        this.record.diamondLeft = this.diamondLeft;
        this.record.rate = this.rate;


        // 界面需要显示的数据
        if(!this.record.viewData)
        {
            this.record.viewData = {};
        }

        this.record.viewData.viewNextReward = this.viewNextReward;
        this.record.viewData.viewCurrentReward = this.viewCurrentReward;
        this.record.viewData.viewTotalReward = this.viewTotalReward;

        // 底层需要的数据
        this.record.currentReward = this.currentReward;
        this.record.nextReward = this.nextReward;
        this.record.totalReward = this.totalReward;

    };

    __proto.cashOut = function() {
        //this.account += Math.round(this.currentReward*this.rate);
        this.gameStep = Game.Step.game_End;
        var resultData = {};
        resultData.dataSource = {};
        resultData.dataSource.endReward = (this.currentReward*this.rate);//Utils.transform_Font_Type(this.currentReward*this.rate);
        //resultData.dataSource.account = Utils.transform_Font_Type(this.account);
        this.record = {};
        return resultData;
    };

    __proto.quickPick = function() {
        var tempBlocks = this.getBlockByNeed("state",Game.Block_State.Open);
        //for(var i = 0 ; i < 50 ; i++)
        //{
        //    tempBlocks.push(i);
        //}
        var resultData = [];
        var self = this;
        var recursive = function() {
            if(self.life <= 0 || self.diamondLeft == 0)
            {

            }
            else
            {
                var randomIndex = Utils.random_number(tempBlocks.length);
                //console.log("randomIndex = " + randomIndex);
                //console.log("tempBlocks = " + JSON.stringify(tempBlocks));
                var randomBlock = tempBlocks[randomIndex];
                //console.log("randomBlock = " + randomBlock);
                tempBlocks.splice(randomIndex,1);
                var strBlock = String(randomBlock);

                var row;
                var column;
                if(strBlock.length == 1)
                {
                    row = 0;
                    column = Number(strBlock);
                }
                else if(strBlock.length == 2)
                {
                    row = Number(strBlock[0]);
                    column = Number(strBlock[1]);
                }
                //console.log("column = " + column + " row = " + row + " strBlock.length = " + strBlock.length + " strBlock = " + strBlock);
                var selectData = self.select({x:column*99,y:row*99});
                console.log("selectData :");
                console.log(selectData);
                resultData.push(selectData);
                if(selectData.selectType != Papaya.Block_Type.Diamond)
                {
                    recursive();
                }
            }
        };

        recursive();

        return resultData;
    };

    __proto.getBlockByNeed = function(key,value) {
        var block;
        var resultBlocks = [];
        var pos;
        for(var i = 0 ; i < 50 ; i++)
        {
            pos = this.stringToPos(i);
            block = blocks[pos.r][pos.c];
            if(block[key] != value)
            {
                resultBlocks.push(i);
            }
        };
        return resultBlocks;
    };

    __proto.stringToPos = function(str)
    {
        str = String(str);
        var row;
        var column;
        if(str.length == 1)
        {
            row = 0;
            column = Number(str);
        }
        else if(str.length == 2)
        {
            row = Number(str[0]);
            column = Number(str[1]);
        }

        return {r:row,c:column};
    };


    Game.Block_State = {};
    Game.Block_State.Open = "open";
    Game.Block_State.Close = "close";

    Game.Step = {};
    Game.Step.game_Init = "gameInit";
    Game.Step.game_Running = "gameRunning";
    Game.Step.game_End = "gameEnd";
} (Papaya));