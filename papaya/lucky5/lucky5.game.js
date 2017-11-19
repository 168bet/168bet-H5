
(function(root) {
    var _super = root.Game;
    var Lucky5 = root.Lucky5;
    var Logic = root.Lucky5.Logic;
    var Poker = root.Lucky5.Poker;
    var Game = root.Lucky5.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        //private members

        //public members
        this.id                     = root.Game.ID_LUCKY5;

        this.double                 = new Lucky5.Double(opts.double);

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.dropPokers             = []; // 翻牌
        this.holdPokers             = opts.holdPokers || [ false, false, false, false, false ];
        this.markPokers             = opts.markPokers ||  [ false, false, false, false, false ];
        this.state                  = opts.state || Game.STATE.READY;
        this.result                 = opts.result || Poker.NOTHING;
        this.betAmount              = opts.betAmount || 0;
        this.score                  = opts.score || 0;
        this.bonus                  = opts.bonus || 0;
        
        this.init(opts);
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function(opts) {
            var i;
            var size;

            if (opts.deck) {
                for (i = 0, size = opts.deck.length; i < size; i++) {
                    this.deck.push(new Lucky5.Poker(opts.deck[i]));
                }
            }

            if (opts.handPokers) {
                for (i = 0, size = opts.handPokers.length; i < size; i++) {
                    this.handPokers.push(new Lucky5.Poker(opts.handPokers[i]));
                }
            }

            if (opts.dropPokers) {
                for (i = 0, size = opts.dropPokers.length; i < size; i++) {
                    this.dropPokers.push(new Lucky5.Poker(opts.dropPokers[i]));
                }
            }
        },
        
        start: function() {
            // 初始化所有状态
            this.deck                   = [];
            this.handPokers             = [];
            this.dropPokers             = [];
            this.holdPokers             = [ false, false, false, false, false ];
            this.markPokers             = [ false, false, false, false, false ];
            this.state                  = Game.STATE.STARTED;
            this.result                 = Poker.NOTHING;
            this.betAmount              = 0;
            this.score                  = 0;
            this.bonus                  = 0;

            // 初始化扑克牌
            var types = Object.keys(Lucky5.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = Lucky5.Poker.DECK[type];

                for (var cIndex = 0, size2 = array.length; cIndex < size2; cIndex++) {
                    var name = array[cIndex];
                    var poker = new Lucky5.Poker();

                    poker.type = type;
                    poker.name = name;
                    poker.value = Lucky5.Poker.DECK_VALUE[type][name];

                    this.deck.push(poker);
                }
            }
        },

        shuffle: function() {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
            this.state = Game.STATE.SHUFFLED;
        },

        bet: function(amount) {
            this.betAmount = amount;
        },

        deal: function() {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }

            this.state = Game.STATE.DEALED;
        },

        hold: function(arr) {
            for (var i = 0, size = arr.length; i < size; i++) {
                this.holdPokers[i] = (arr[i] === true);
            }
        },

        draw: function() {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                if (this.holdPokers[i] === true) {
                    continue;
                }

                this.dropPokers.push(this.handPokers[i]);
                this.handPokers[i] = this.deck.shift();
            }

            this.state = Game.STATE.DRAWED;
        },

        end: function() {
            var data = Logic.calculate2(this.handPokers);
            var score  = Poker.SCORES[data.result] || 0;

            this.result = data.result;
            this.markPokers = data.marks;
            this.score  = score * this.betAmount;

            this.state = Game.STATE.ENDED;
        },

        enterDouble: function() {
            this.double.lastScore = this.score;
            this.state = Game.STATE.DOUBLE;
        }
    });

    Game.STATE = {};
    Game.STATE.READY            = 0;
    Game.STATE.STARTED          = 1;
    Game.STATE.SHUFFLED         = 2;
    Game.STATE.DEALED           = 3;
    Game.STATE.DRAWED           = 4;
    Game.STATE.ENDED            = 5;
    Game.STATE.DOUBLE           = 6;

    // Game.prototype.init = function() {
    //     for (var type in Poker.DECK) {
    //         var array = Poker.DECK[type];
    //
    //         for (var i = 0, size = array.length; i < size; i++) {
    //             var name = array[i];
    //             var poker = new root.Poker();
    //
    //             poker.type = type;
    //             poker.name = name;
    //             poker.value = Poker.DECK_VALUE[type][name];
    //
    //             this.deck.push(poker);
    //         }
    //     }
    //
    //     this.handlers = {};
    //     this.handlers[Lucky5.Game_Event.STATE.ENDED] = { func: this.restart, next: true };
    //     this.handlers[Lucky5.Game_Event.STATE.STARTED] = { func: this.shuffle, next: true };         // 洗牌
    //     this.handlers[Lucky5.Game_Event.STATE.SHUFFLED] = { func: this.deal, next: false };          // 发牌
    //     this.handlers[Lucky5.Game_Event.STATE.DEALED] = { func: this.draw, next: true };             // 抽牌
    //     this.handlers[Lucky5.Game_Event.STATE.DRAWED] = { func: this.end, next: false };
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_READY] = { func: this.gamblingSizeReady, next: true };    // 玩大小
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_START] = { func: this.gamblingSizeStart, next: false };
    //     this.handlers[Lucky5.Game_Event.STATE.GAMBLINGSIZE_END] = { func: this.gamblingSizeEnd, next: true };
    // };
    //
    // Game.prototype.restart = function() {
    //     this.deck = this.deck.concat(this.handPokers);
    //     this.deck = this.deck.concat(this.dropPokers);
    //
    //     this.gamblingSizeStake = 0;
    //     this.handPokers = [];
    //     this.dropPokers = [];
    //     this.holdPokers = [ false, false, false, false, false ];
    //
    //     if (this.isAutoJackPot) {
    //         this.addJackPot();
    //     }
    //
    //     this.costScore(this.stake);
    //
    //     //this.next();
    // };
    //
    // Game.prototype.shuffle = function() {
    //     var newDeck = [];
    //
    //     while (this.deck.length) {
    //         var min = 0;
    //         var max = this.deck.length - 1;
    //
    //         var index = Math.floor(Math.random()*(max-min) + min);
    //         newDeck.push(this.deck[index]);
    //         this.deck.splice(index, 1);
    //     }
    //
    //     this.deck = newDeck;
    //     //this.next();
    // };
    //
    // Game.prototype.deal = function() {
    //     for (var i = 0; i < Lucky5.MAX_HAND; i++) {
    //         this.handPokers.push(this.deck.shift());
    //     }
    //
    //     // if (this.state == Lucky5.Game_Event.STATE.SHUFFLED) {
    //     //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //     //         this.handPokers.push(this.deck.shift());
    //     //     }
    //     // } else {
    //     //
    //     // }
    //
    //     //EventMgr.emit(Lucky5.Game_Event.Event.DEALED);
    //     //this.next();
    // };
    //
    // Game.prototype.draw = function() {
    //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //         if (this.holdPokers[i] == true) {
    //             continue;
    //         }
    //
    //         this.dropPokers.push(this.handPokers[i]);
    //         this.handPokers[i] = this.deck.shift();
    //     }
    //
    //
    //     //this.next();
    // };
    //
    // Game.prototype.addScore = function(score){
    //     this.score += score;
    //     this.increaseScore = score;
    //     EventMgr.emit(Lucky5.Game_Event.Event.UPGRADESCORE);
    // };
    //
    // Game.prototype.costScore = function(score){
    //     this.score -= score;
    //     if(this.score <= 0)
    //         this.score = 0;
    //     EventMgr.emit(Lucky5.Game_Event.Event.UPGRADESCORE);
    // };
    //
    // Game.prototype.setResultName = function(name) {
    //     this.resultName = name;
    // };
    //
    // Game.prototype.addStake = function() {
    //     this.stake += 10;
    //     if(this.stake > 990)
    //     {
    //         this.stake = 990;
    //     }
    //     else
    //     {
    //         this.costScore(10);
    //     }
    // };
    //
    // Game.prototype.cutStake = function() {
    //     this.stake -= 10;
    //
    //     if(this.stake < 10)
    //     {
    //         this.stake = 10;
    //     }
    //     else
    //     {
    //         this.addScore(10);
    //     }
    // };
    //
    // Game.prototype.addJackPot = function() {
    //     this.jackPotPool += 0.1;
    //     EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_UPGRADE);
    // };
    //
    // Game.prototype.cutJackPot = function(){
    //     this.jackPotPool -= 0.1;
    //     EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_UPGRADE);
    // };
    //
    // Game.prototype.getJackPot = function() {
    //     return this.jackPotPool.toFixed(1);
    // };
    //
    // Game.prototype.autoJackPot = function(target) {
    //     this.isAutoJackPot = target;
    // };
    //
    // Game.prototype.getStake = function() {
    //     return this.stake;
    // };
    //
    // Game.prototype.getResultName = function() {
    //     return this.resultName;
    // };
    //
    // Game.prototype.getScore = function(){
    //     return {score:this.score, increaseScore:this.increaseScore};
    // };
    //
    // Game.prototype.gamblingSizeStakeAdd = function() {
    //     this.gamblingSizeStake *= 2;
    //     if(this.gamblingSizeStake >= this.enterScore)
    //     {
    //         this.gamblingSizeStake = this.enterScore;
    //         this.costScore(this.enterScore);
    //     }
    //
    //     this.score = this.enterScore - this.gamblingSizeStake;
    //
    // };
    //
    // Game.prototype.gamblingSizeStakeCut = function() {
    //     this.cutStakeTime++;
    //     this.gamblingSizeStake = this.gamblingSizeStake - (this.initGamblingSizeStake*(2*this.cutStakeTime));
    //
    //     if(this.gamblingSizeStake <= this.initGamblingSizeStake)
    //     {
    //         this.gamblingSizeStake = this.initGamblingSizeStake;
    //         this.cutStakeTime = 0;
    //     }
    //
    //     this.score = this.enterScore - this.gamblingSizeStake;
    //
    //
    // };
    //
    // Game.prototype.getGamblingSizeStake = function() {
    //     return this.gamblingSizeStake;
    // };
    //
    // Game.prototype.getGamblingSizeTimes = function() {
    //     return this.gamblingSizeTimes;
    // };
    //
    // Game.prototype.getBankerMultiple = function() {
    //     return this.bankerMultiple;
    // };
    //
    // Game.prototype.next = function() {
    //     if (this.state >= Lucky5.Game_Event.STATE.ENDED) {
    //         this.state = Lucky5.Game_Event.STATE.STARTED;
    //     }
    //     else {
    //         this.state++;
    //     }
    // };
    //
    // Game.prototype.gamblingSizeEnter = function(data) {
    //
    //     this.enterScore = this.score;                       // 当次进入赌大小的本金
    //     this.initGamblingSizeStake = this.increaseScore*2;  // 赌大小的初始赌注
    //     // 赌大小押注
    //     this.gamblingSizeStake = this.increaseScore*2;
    //     // enter只是生成临时信息，用来显示，不影响具体数据，ready才处理具体数据
    //     var nowScore = this.score;
    //     var increaseScore = this.increaseScore;
    //
    //     var gamblingSizeStake = increaseScore*2;
    //
    //     data.nowScore = nowScore - gamblingSizeStake;
    //     data.gamblinSizeStake = gamblingSizeStake;
    //     data.increaseScore = increaseScore;
    //     data.gamblingSizeTimes = this.gamblingSizeTimes;
    //
    // };
    //
    // Game.prototype.gamblingSizeReady = function(){
    //
    //     var newDeck = [];
    //     this.deck = this.deck.concat(this.handPokers);
    //     this.deck = this.deck.concat(this.dropPokers);
    //
    //     while (this.deck.length) {
    //         var min = 0;
    //         var max = this.deck.length - 1;
    //
    //         var index = Math.floor(Math.random()*(max-min) + min);
    //         newDeck.push(this.deck[index]);
    //         this.deck.splice(index, 1);
    //     }
    //
    //     this.deck = newDeck;
    //     this.handPokers = [];
    //     this.dropPokers = [];
    //     this.holdPokers = [ false, false, false, false, false ];
    //
    //     this.gamblingSizeTimes += 1;                        // 赌大小次数
    //
    //     var probability = Math.floor(Math.random()*(100));
    //     console.log("probability = " + probability);
    //     var Multiple;
    //     var randomIndex;
    //     if(probability >= 90)
    //     {
    //         // 随机倍率
    //         Multiple = [2,2.5,3];
    //         randomIndex =  Math.round(Math.random()*(Multiple.length -1));
    //         this.bankerMultiple = Multiple[randomIndex];
    //     }
    //     else if(probability >= 80 && probability < 90)
    //     {
    //         this.bankerMultiple = 1.5;
    //     }
    //     else
    //     {
    //         this.bankerMultiple = 1;
    //     }
    //     // 随机倍率
    //     //var Multiple = [1.5,2,2.5,3];
    //     //var randomIndex =  Math.round(Math.random()*(Multiple.length -1));
    //     //this.bankerMultiple = Multiple[randomIndex];
    //
    //
    //     //this.enterScore = this.score;
    //     //this.initGamblingSizeStake = reward;
    //     this.cutStakeTime = 0;
    //     this.costScore(this.gamblingSizeStake);
    //
    //     this.gamblingSizeStart();
    // };
    //
    // Game.prototype.gamblingSizeStart = function() {
    //     for (var i = 0; i < Lucky5.Game_Event.MAX_HAND; i++) {
    //         this.handPokers.push(this.deck.shift());
    //     }
    //     this.bankerPoker = this.handPokers[0];//{type: "spade", name: "two", value: 2};
    //     EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_START);
    // };
    //
    // Game.prototype.flipPokers = function(index){
    //     var info,reward;
    //     if(this.handPokers[index].value > this.bankerPoker.value) {
    //         reward = this.gamblingSizeStake * 2 * this.bankerMultiple;
    //         this.addScore(reward);
    //
    //         info = 'win';
    //         str = "你赢了"+reward+"元";
    //     } else if(this.handPokers[index].value < this.bankerPoker.value) {
    //         this.state = Lucky5.Game_Event.STATE.ENDED;
    //         this.gamblingSizeStake = 0;
    //         EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_END);
    //         info = 'lose';
    //         str = "庄家赢了";
    //     } else {
    //         str = "打平";
    //     }
    //     EventMgr.emit(Lucky5.Game_Event.Event.SHOWMASSAGE,str);
    //     EventMgr.emit(Lucky5.Game_Event.Event.GAMBLINGSIZE_RESULT,{info:info});
    // };
    //
    // Game.prototype.gamblingSizeEnd = function() {
    //     this.gamblingSizeStake = 0;
    //
    // };
    //
    // Game.prototype.end = function() {
    //     this.calculate(this.endResult.bind(this));
    //     //this.next();
    // };
    //
    //
    //
    // Game.prototype.calculate = function(cb) {
    //     var i = 0;
    //     var key;
    //     var size = 5;
    //     var result = Poker.NOTHING;
    //     var pokers = this.handPokers.slice(0);
    //     var holePokerValue = [];
    //     var holeJoker = [];             // 手持鬼牌
    //
    //     // 按照牌面大小排序
    //     var compare = function(a, b) {
    //         return (a.value > b.value);
    //     };
    //
    //     pokers.sort(compare);
    //
    //     var hadJoker = false;
    //
    //     for(var i in pokers)
    //     {
    //         if(pokers[i].value >= 15)
    //         {
    //             hadJoker = true;
    //             break;
    //         }
    //     }
    //
    //     var isFlush, isStreight, statPokers, pairs =0, pairJackOrBetter =0, three =0, four =0, nothing =0, jackBetter =0;
    //
    //     if(hadJoker)
    //     {
    //         // 先取出鬼牌
    //         var jokers = [];
    //         var spliceIndex =[];
    //         for(var i = 0 ; i < size; i++)
    //         {
    //
    //             if(pokers[i].value >= 15)
    //             {
    //                 jokers.push(pokers[i]);
    //                 holeJoker.push(pokers[i].value);
    //                 spliceIndex.push(i)
    //             }
    //         }
    //
    //         for(i in spliceIndex)
    //         {
    //             pokers.splice(spliceIndex[i],1);
    //         }
    //
    //         size = size - jokers.length;
    //
    //         // 计算花色占比
    //         var flush = {spade:0, heart:0, diamond:0, club:0};
    //         for(i in pokers)
    //         {
    //             flush[pokers[i].type]++;
    //         }
    //
    //         var maxType = {type:"spade" ,count:flush["spade"]};
    //         for(key in flush)
    //         {
    //             if(flush[key] > maxType.count)
    //             {
    //                 maxType.type = key;
    //                 maxType.count = flush[key];
    //             }
    //         }
    //
    //         isFlush = true;
    //         if(jokers.length == 1)
    //         {
    //             if(maxType.count < 4)
    //             {
    //                 isFlush = false;
    //             }
    //         }
    //         else if(jokers.length == 2)
    //         {
    //             if(maxType.count < 3)
    //             {
    //                 isFlush = false;
    //             }
    //         }
    //
    //
    //         /////////// 计算顺子
    //         isStreight = true;
    //
    //         var dValueTimes = {1:0,2:0,3:0};
    //         for (var i = 1; i < pokers.length ; i++) {
    //             var dValue = Math.abs(pokers[i - 1].value - pokers[i].value);
    //             if(dValue >= 3)
    //             {
    //                 dValueTimes["3"]++;
    //             }
    //             else
    //             {
    //                 dValueTimes[dValue]++;
    //             }
    //         }
    //
    //         if(jokers.length == 1)
    //         {
    //             if(dValueTimes["2"] > 1 || dValueTimes["3"] > 0)
    //             {
    //                 isStreight = false;
    //             }
    //         }
    //         else if(jokers.length == 2)
    //         {
    //             if(dValueTimes["3"] > 1)
    //             {
    //                 isStreight = false;
    //             }
    //         }
    //
    //         // 计算张数
    //         statPokers = {};
    //         var value;
    //         for (i = 0; i < size; i++) {
    //             value = pokers[i].value;
    //             statPokers[value] = statPokers[value] || 0;
    //             statPokers[value]++;
    //         }
    //
    //         var amount;
    //         var flag;
    //         var tempvalue = [];
    //         for (value in statPokers) {
    //             amount = statPokers[value];
    //             flag = false;
    //             if (amount == 2) {
    //                 pairs++;
    //                 if (value >= 11) {
    //                     pairJackOrBetter++;
    //                     flag = true;
    //                 }
    //                 else
    //                 {
    //                     tempvalue.push(value);
    //                 }
    //             }
    //             else if (amount == 3) {
    //                 three++;
    //                 flag = true;
    //             }
    //             else if (amount == 4) {
    //                 four++;
    //                 flag = true;
    //             }
    //             else {
    //                 nothing++;
    //                 if(value >= 11)
    //                 {
    //                     jackBetter++;
    //                 }
    //             }
    //
    //             if(flag)
    //             {
    //                 holePokerValue.push(value);
    //             }
    //
    //             if(pairs >= 2)
    //             {
    //                 holePokerValue = holePokerValue.concat(tempvalue);
    //             }
    //         }
    //
    //         /*
    //          张数规则：
    //          1.如果有4条，什么鬼牌都没用
    //          2.如果有3条，可以做葫芦和四条，以四条为最大，所以不管是一张鬼牌还是两张鬼牌都做成四条
    //          3.如果有一对，一张鬼牌时做三条，两张鬼牌时做4条
    //          4.如果有两对，只能做葫芦
    //          5.如果什么都没有，一张鬼牌时做J以上对子，两张鬼牌时做三条
    //
    //          */
    //
    //         if (isStreight && isFlush) {
    //             if (pokers[0].value == 10) {
    //                 result = Poker.ROYAL_FLUSH;
    //             }
    //             else {
    //                 result = Poker.STREIGHT_FLUSH;
    //             }
    //         }
    //         else if(four > 0)
    //         {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if(three > 0)
    //         {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if (isFlush) {
    //             result = Poker.FLUSH;
    //         }
    //         else if (isStreight) {
    //             result = Poker.STREIGHT;
    //         }
    //         else if(pairs == 1)
    //         {
    //             if(jokers.length == 1)
    //             {
    //                 result = Poker.THREE_OF_A_KIND;
    //             }
    //             else if(jokers.length == 2)
    //             {
    //                 result = Poker.FOUR_OF_A_KIND;
    //             }
    //         }
    //         else if(pairs == 2)
    //         {
    //             result = Poker.FULL_HOUSE;
    //         }
    //         else if(nothing > 0)
    //         {
    //             if(jackBetter > 0)
    //             {
    //                 if(jokers.length == 1)
    //                 {
    //                     result = Poker.ONE_PAIR;
    //                 }
    //                 else if(jokers.length == 2)
    //                 {
    //                     result = Poker.THREE_OF_A_KIND;
    //                 }
    //             }
    //             else
    //             {
    //                 result = Poker.NOTHING
    //             }
    //         }
    //     }
    //     else
    //     {
    //         // 计算同花
    //         isFlush = true;
    //         for (i = 1; i < size; i++) {
    //             if (pokers[i].type != pokers[i - 1].type) {
    //                 isFlush = false;
    //                 break;
    //             }
    //         }
    //         // 计算顺子
    //         isStreight = true;
    //         for (i = 1; i < size; i++) {
    //             if (pokers[i - 1].value != pokers[i].value - 1) {
    //                 isStreight = false;
    //                 break;
    //             }
    //         }
    //
    //         // 计算张数
    //         statPokers = {};
    //         var value;
    //         for (i = 0; i < size; i++) {
    //             value = pokers[i].value;
    //             statPokers[value] = statPokers[value] || 0;
    //             statPokers[value]++;
    //         }
    //
    //         //var pairs = 0;
    //         //var pairJackOrBetter = 0;
    //         //var three = 0;
    //         //var four = 0;
    //         //var nothing = 0;
    //         var tempvalue = [];
    //         var amount;
    //         var flag;
    //         for (value in statPokers) {
    //             amount = statPokers[value];
    //             flag = false;
    //             if (amount == 2) {
    //                 pairs++;
    //                 if (value >= 11) {
    //                     pairJackOrBetter++;
    //                     flag = true;
    //                 }
    //                 else
    //                 {
    //                     tempvalue.push(value);
    //                 }
    //             }
    //             else if (amount == 3) {
    //                 three++;
    //                 flag = true;
    //             }
    //             else if (amount == 4) {
    //                 four++;
    //                 flag = true;
    //             }
    //             else {
    //                 nothing++;
    //             }
    //
    //             if(flag)
    //             {
    //                 holePokerValue.push(value);
    //             }
    //
    //             if(pairs >= 2)
    //             {
    //                 holePokerValue = holePokerValue.concat(tempvalue);
    //             }
    //         }
    //
    //         // 同花顺/皇家同花顺
    //         if (isStreight && isFlush) {
    //             if (this.handPokers[0].value == 10) {
    //                 result = Poker.ROYAL_FLUSH;
    //             }
    //             else {
    //                 result = Poker.STREIGHT_FLUSH;
    //             }
    //         }
    //         else if (four > 0) {
    //             result = Poker.FOUR_OF_A_KIND;
    //         }
    //         else if (three > 0 && pairs > 0) {
    //             result = Poker.FULL_HOUSE;
    //         }
    //         else if (isFlush) {
    //             result = Poker.FLUSH;
    //         }
    //         else if (isStreight) {
    //             result = Poker.STREIGHT;
    //         }
    //         else if (three > 0) {
    //             result = Poker.THREE_OF_A_KIND;
    //         }
    //         else if (pairs >= 2) {
    //             result = Poker.TWO_PAIR;
    //         }
    //         else if (pairJackOrBetter > 0) {
    //             result = Poker.ONE_PAIR;
    //         }
    //         else {
    //             result = Poker.NOTHING;
    //         }
    //     }
    //
    //     for(var i in holeJoker)
    //     {
    //         holePokerValue.push(holeJoker[i]+"");
    //     }
    //
    //     if(cb)
    //     {
    //         cb({resultType:result , holdPokers:holePokerValue});
    //     }
    //
    //
    // };
    //
    // // 一局普通玩法结束后处理
    // Game.prototype.endResult = function(resultData) {
    //     var result = resultData.resultType;
    //     var ret = Poker.HAND_TEXT[result];
    //     var multiple = this.stake/10;
    //     // 普通模式的奖励金币
    //     var normalReward = ret["score"]*multiple;
    //     var hadJackPotReward = this.jackPotReward(result);
    //     var rewardCount = normalReward + hadJackPotReward;
    //     this.addScore(rewardCount);
    //
    //     var scoreInfo = this.getScore();
    //     this.result = {
    //         result: result,
    //         resultData: resultData,
    //         rewardCount: rewardCount,
    //         resultScore: normalReward,
    //         jackPotReward: hadJackPotReward
    //     };
    //
    //     EventMgr.emit(Lucky5.Game_Event.Event.DRAWED);
    // };
    //
    //
    // // 选中牌
    // Game.prototype.hold = function(index) {
    //     if(index instanceof Array)
    //     {
    //         for(var i in index)
    //         {
    //             this.holdPokers[index[i]] = !this.holdPokers[index[i]];
    //         }
    //     }
    //     else
    //     {
    //         this.holdPokers[index] = !this.holdPokers[index];
    //     }
    // };
    //
    // Game.prototype.process = function() {
    //     while (true) {
    //         var handler = this.handlers[this.state];
    //
    //         handler.func.call(this);
    //         if (handler.next == false) {
    //             break;
    //         }
    //     }
    // };
    //
    // Game.prototype.jackPotReward = function(result) {
    //     var bonus = 0;
    //
    //     switch (result)
    //     {
    //         //case Poker.FULL_HOUSE:
    //         //    bonus = this.jackPotPool*0.5;
    //         //    break;
    //         //case Poker.STREIGHT_FLUSH:
    //         //    bonus = this.jackPotPool*0.8;
    //         //    break;
    //         case Poker.ROYAL_FLUSH:
    //             bonus = this.jackPotPool;
    //             break;
    //     }
    //
    //     if(bonus)
    //     {
    //         this.jackPotPool -= bonus;
    //         //this.score += bonus;
    //         //EventMgr.emit(Lucky5.Game_Event.Event.JACKPOT_REWARD);
    //     }
    //     return bonus;
    // };
    //

    //
    //Game.GAMBLINGSIZE = {};
    //Game.GAMBLINGSIZE.BIG = 0;
    //Game.GAMBLINGSIZE.SMALL = 0;
}(Papaya));