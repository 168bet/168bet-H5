/**
 * Created by WhelaJoy on 2017/2/18.
 */
(function(root) {
    var _super = root.Game;
    var PokerGo = root.PokerGo;
    var Poker = root.PokerGo.Poker;
    var Game = root.PokerGo.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        this.id                     = root.Game.ID_POKERGO;

        this.double                 = new PokerGo.Double(opts.double);

        this.deck                   = opts.deck || []; // 一整副牌
        this.handPokers             = opts.handPokers || []; // 手牌

        this.betAmount              = opts.betAmount || 0;

        this.state                  = opts.state || Game.STATE.READY;

        this.score                  = opts.score || 0;

        this.jackPotPool            = opts.jackPotPool || 2000;
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {

        getDeckPokers :function (){
            // 初始化扑克牌
            var decks = [];
            var types = Object.keys(PokerGo.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = PokerGo.Poker.DECK[type];

                for (var cIndex = 0, size2 = array.length; cIndex < size2; cIndex++) {
                    var name = array[cIndex];
                    var poker = new PokerGo.Poker();

                    poker.type = type;
                    poker.name = name;
                    poker.value = PokerGo.Poker.DECK_VALUE[type][name];

                    decks.push(poker);
                }
            }
            return decks;
        },

        shuffle: function() {
            var newDeck = [];

            var deck = this.getDeckPokers();

            while (deck.length) {
                var min = 0;
                var max = deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(deck[index]);
                deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        dealPoker : function (){

            var newDeck = [];

            var deck = this.getDeckPokers();

            var min = 0;
            var max = deck.length - 1;

            var probability =  Papaya.PokerGo.Poker.PROBABILITY[Papaya.Utils.calcWeight(Papaya.PokerGo.Poker.PROBABILITY)];

            switch (probability.type){
                case  Papaya.PokerGo.Poker.SHOOT :
                    //射中,出牌
                    console.log("射中");
                    var index1 = Math.floor(Math.random()*(max-min) + min);
                    var index2 = null;

                    var randow = Papaya.Utils.range_value(0,4);
                    if(randow == 4){
                        randow --;
                    }

                    if(index1%13 >= 10){

                        var randowList = [];
                        for (var i = (index1 - 3)%13 ; i >= 0 ; i--){
                            randowList.push(i);
                        }

                        var randowValue = Papaya.Utils.range_value(0,randowList.length);
                        if(randowValue == randowList.length){
                            randowValue --;
                        }

                        index2 = randowList[randowValue] + 13 * randow;
                    }
                    else if (index1%13 <= 3) {

                        var randowList = [];
                        for (var i = (index1 + 3)%13 ; i < 13 ; i++){
                            randowList.push(i);
                        }

                        var randowValue = Papaya.Utils.range_value(0,randowList.length);
                        if(randowValue == randowList.length){
                            randowValue --;
                        }

                        index2 = randowList[randowValue] + 13 * randow;
                    }
                    else {
                        var randowList = [];

                        for (var i = (index1 - 3)%13 ; i >= 0 ; i--){
                            randowList.push(i);
                        }

                        for (var i = (index1 + 3)%13 ; i < 13 ; i++){
                            randowList.push(i);
                        }

                        var randowValue = Papaya.Utils.range_value(0,randowList.length);
                        if(randowValue == randowList.length){
                            randowValue --;
                        }

                        index2 = randowList[randowValue] + 13 * randow;
                    }

                    newDeck.push(deck[index1]);
                    newDeck.push(deck[index2]);

                    deck.splice(index1, 1);
                    deck.splice(index2-1, 1);

                    console.log("--> index1 = " + index1 + " index2 = " + index2);

                    break;

                case  Papaya.PokerGo.Poker.STREIGHT :
                    //顺子（同花顺）
                    console.log("顺子（同花顺）");

                    var index1 = Math.floor(Math.random()*(max-min) + min);
                    var index2 = null;

                    var randow = Papaya.Utils.range_value(0,4);
                    if(randow == 4){
                        randow --;
                    }

                    if(index1%13 >= 11){
                        index2 = (index1 - 2)%13 + 13 * randow;
                    }
                    else if (index1%13 <= 2) {
                        index2 = (index1 + 2)%13 + 13 * randow;
                    }
                    else {
                        index2 = (Papaya.Utils.range_value(0,2)) ? (index1 - 2)%13 + 13 * randow : (index1 + 2)%13 + 13 * randow;
                    }

                    newDeck.push(deck[index1]);
                    newDeck.push(deck[index2]);

                    deck.splice(index1, 1);
                    deck.splice(index2-1, 1);

                    console.log("--> index1 = " + index1 + " index2 = " + index2);

                    break;

                case  Papaya.PokerGo.Poker.SEQUENCE :
                    //连张
                    console.log("连张");

                    var index1 = Math.floor(Math.random()*(max-min) + min);
                    var index2 = null;

                    var randow = Papaya.Utils.range_value(0,4);
                    if(randow == 4){
                        randow --;
                    }

                    if(index1%13 >= 12){
                        index2 = (index1 - 1)%13 + 13 * randow;
                    }
                    else if (index1%13 <= 1) {
                        index2 = (index1 + 1)%13 + 13 * randow;
                    }
                    else {
                        index2 = (Papaya.Utils.range_value(0,2)) ? (index1 - 1)%13 + 13 * randow : (index1 + 1)%13 + 13 * randow;
                    }

                    newDeck.push(deck[index1]);
                    newDeck.push(deck[index2]);

                    deck.splice(index1, 1);
                    deck.splice(index2-1, 1);

                    console.log("--> index1 = " + index1 + " index2 = " + index2);
                    break;

                case  Papaya.PokerGo.Poker.THREE_OF_A_KIND :
                    //一对
                    console.log("一对");

                    var index1 = Math.floor(Math.random()*(max-min) + min);
                    var index2 = null;

                    var value = Math.floor(index1/13);
                    var randowList = [];
                    for (var i = 0 ; i < 4 ; i++){

                        if(i == value){
                            continue;
                        }
                        randowList.push(i);
                    }

                    var randow = Papaya.Utils.range_value(0,3);
                    if(randow == 3){
                        randow --;
                    }

                    var randowNum = randowList[randow];

                    index2 = index1%13 + 13 * randowNum;

                    newDeck.push(deck[index1]);
                    newDeck.push(deck[index2]);

                    deck.splice(index1, 1);
                    deck.splice(index2-1, 1);

                    console.log("--> index1 = " + index1 + " index2 = " + index2);
                    break;
            }

            while (deck.length) {
                min = 0;
                max = deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(deck[index]);
                deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        betType : function (opts){
            var results = {
                betAmount: null,
                bettype: null,
                err:null,
                state : null,
                jackPotPool:null
            };

            var bettype = opts.bettype;
            if(this.bettype > 0){
                results.err = Game.ERR.BETTYPE_ERR;
                return results;
            }

            results.bettype = bettype;

            return results;
        },

        bet: function(opts) {
            var results = {
                betAmount: null,
                bettype: null,
                err:null,
                state : null,
                jackPotPool:null
            };

            if(!(this.state == Papaya.PokerGo.Game.STATE.READY || this.state  == Papaya.PokerGo.Game.STATE.BET)){
                results.err = Game.ERR.NO_BET;
                return results
            }
            results.state = Game.STATE.BETED;

            var betAmount = opts.betAmount;

            results.betAmount = betAmount;

            results.jackPotPool = this.jackPotPool + betAmount;
            return results;
        },

        getJackPotPool : function (score){
            if (this.jackPotPool < score){
                score = this.jackPotPool;
            }
            return score;
        },

        dealHandle: function(opts) {
            var results = {
                handPokers : [],
                score: 0,
                results : null,
                err: null,
                betAmount : 0 ,
                jackPotPool : 0
            };

            var betAmount = Number(opts.betAmount);

            if (betAmount > Number(opts.balance)){
                results.err = Papaya.PokerGo.Game.ERR.NO_MONEY_ERR;
                return results;
            }

            if (betAmount == null || betAmount <= 0){
                results.err = Game.ERR.NO_BETED;
                return results
            }
            if (betAmount > Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]){
                results.err = Papaya.PokerGo.Game.ERR.OUT_MAXBET;
                return results
            }

            if(!(this.state == Papaya.PokerGo.Game.STATE.READY || this.state  == Papaya.PokerGo.Game.STATE.DEALED)){
                results.err = Game.ERR.NO_BET;
                return results
            }
            this.state = Game.STATE.DEALED;

            this.betAmount = betAmount;
            this.jackPotPool = this.jackPotPool + betAmount;

            this.dealPoker();
            //this.shuffle();

            this.handPokers = [];
            for (var i = 0; i < PokerGo.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }
            results.handPokers = this.handPokers.concat();

            if(this.isSequence(this.handPokers)){
                this.jackPotPool  -= betAmount;
                this.betAmount = betAmount;
                this.state = Game.STATE.READY;
                this.score = betAmount;

                results.results = PokerGo.Poker.SEQUENCE;
                results.score = this.betAmount;
                results.betAmount = this.betAmount;
                results.jackPotPool = this.jackPotPool;
                results.state  = this.state;
                return results;
            }

            if(this.isOnePair(this.handPokers)){
                this.jackPotPool  -= betAmount;
                this.betAmount = betAmount;
                this.state = Game.STATE.READY;
                this.score = betAmount;

                results.results = PokerGo.Poker.ONE_PAIR;
                results.score = this.betAmount;
                results.betAmount = this.betAmount;
                results.jackPotPool = this.jackPotPool;
                results.state = this.state;
                return results;
            }

            this.score = 0;

            results.score = this.score;
            results.betAmount = this.betAmount;
            results.jackPotPool = this.jackPotPool;
            results.state  = this.state;
            return results;
        },

        drawHandle: function(opts) {
            var results = {
                handPokers : [],
                score: 0,
                results : null,
                err: null,
                betAmount : 0 ,
                jackPotPool : 0
            };

            var betAmount = Number(opts.betAmount);
            this.jackPotPool = Number(this.jackPotPool);

            if((betAmount + this.betAmount)*2 > opts.balance){
                results.err = Papaya.PokerGo.Game.ERR.OUT_MAXBET;
                return results;
            }

            if (betAmount == null || betAmount <= 0){
                results.err = Game.ERR.NO_BETED;
                return results
            }

            if (this.state != Game.STATE.DEALED){
                results.err = Game.ERR.NO_DRAW;
                return results;
            }

            this.state = Game.STATE.READY;
            results.state = this.state;


            var SumBetAmount = this.betAmount + betAmount;

            this.betAmount = betAmount;
            this.jackPotPool += betAmount;

            results.betAmount = this.betAmount;

            var min = 0;
            var max = this.deck.length - 1;
            var index = Math.floor(Math.random()*(max-min) + min);
            this.handPokers.push(this.deck[index]);
            results.handPokers = this.handPokers.concat();

            var pokerValue1 = this.handPokers[0].value;
            var pokerValue2 = this.handPokers[1].value;
            var pokerValue3 = this.handPokers[2].value;

            var score = 0;

            if(this.isOnePair(this.handPokers)){
                //押大，押小
                results.err = Game.ERR.NO_DRAW;
                return results;
            }
            else {
                //押注
                var pokerType1 = this.handPokers[0].type;
                var pokerType2 = this.handPokers[1].type;
                var pokerType3 = this.handPokers[2].type;

                if(pokerValue2 > pokerValue1 && (pokerValue3 > pokerValue1 && pokerValue3 < pokerValue2)){
                    //顺子
                    if (pokerValue3 - 1 == pokerValue1 && pokerValue3 + 1 == pokerValue2){
                        if (pokerType1 == pokerType2 && pokerType2 == pokerType3 && pokerType3 == pokerType1 ){
                            //同花顺
                            results.results = PokerGo.Poker.STREIGHT_FLUSH;
                            score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH] + 1) * SumBetAmount);
                            results.score = score;

                            this.jackPotPool -= score;
                            this.score = results.score;

                            this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                            results.jackPotPool = this.jackPotPool;
                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT] + 1) * SumBetAmount);
                        results.score = score;

                        this.jackPotPool -= score;
                        this.score = results.score;

                        this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                        results.jackPotPool = this.jackPotPool;
                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT]+ 1) * SumBetAmount);
                    results.score = score;

                    this.jackPotPool -= score;
                    this.score = results.score;

                    this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                    results.jackPotPool = this.jackPotPool;
                    return results
                }
                else if (pokerValue2 < pokerValue1 && (pokerValue3 > pokerValue2 && pokerValue3 < pokerValue1)) {
                    //顺子
                    if (pokerValue3 - 1 == pokerValue2 && pokerValue3 + 1 == pokerValue1){
                        if (pokerType1 == pokerType2 && pokerType2 == pokerType3 && pokerType3 == pokerType1 ){
                            //同花顺
                            results.results = PokerGo.Poker.STREIGHT_FLUSH;
                            score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH]+ 1) * SumBetAmount);
                            results.score = score;

                            this.jackPotPool -= score;
                            this.score = results.score;

                            this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                            results.jackPotPool = this.jackPotPool;
                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT]+ 1) * SumBetAmount);
                        results.score = score;

                        this.jackPotPool -= score;
                        this.score = results.score;

                        this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                        results.jackPotPool = this.jackPotPool;
                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool((PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT]+ 1) * SumBetAmount);
                    results.score = score;

                    this.jackPotPool -= score;
                    this.score = results.score;

                    this.jackPotPool = (this.jackPotPool <= 0) ?  2000 : this.jackPotPool;
                    results.jackPotPool = this.jackPotPool;
                    return results
                }
                else if(pokerValue3 == pokerValue1 || pokerValue3 == pokerValue2){
                    results.results = PokerGo.Poker.HIT_COLUMN;
                    score = SumBetAmount;

                    if(score >= Number(opts.balance)){
                        score = Number(opts.balance);
                    }

                    results.score = -score;
                    this.jackPotPool += score;
                    this.score = results.score;

                    results.jackPotPool = this.jackPotPool;
                    return results;
                }

            }

            //射偏，押大小(输)
            results.results = PokerGo.Poker.NO_SHOOT;
            this.score = results.score;

            results.jackPotPool = this.jackPotPool;
            return results
        },

        //是否,连张
        isSequence : function (handPokers){
            var pokerValue1 = handPokers[0].value;
            var pokerValue2 = handPokers[1].value;

            if(pokerValue1+1 == pokerValue2 || pokerValue1-1 == pokerValue2){
                return true;
            }
            return false;
        },
        //是否,对子
        isOnePair : function (handPokers){
            var pokerValue1 = handPokers[0].value;
            var pokerValue2 = handPokers[1].value;
            return pokerValue1 == pokerValue2;
        },

        getState : function (){
            return this.state;
        },

        createDouble: function() {
            this.double = new PokerGo.Double({
                lastScore: this.score
            });

            return this.double;
        },

        syncGame :function (opts){
            if (opts.handPokers){
                this.handPokers = [];
                this.handPokers = opts.handPokers;
            }

            if(opts.betAmount != null && opts.betAmount >= 0){
                this.betAmount = opts.betAmount;
            }

            if(opts.score != null && opts.score >= 0){
                this.score = opts.score;
            }

            if(opts.jackPotPool != null &&　opts.jackPotPool > 0){
                this.jackPotPool = opts.jackPotPool;
            }
            else if ( opts.jackPotPool == 0){
                this.jackPotPool = 2000;
            }

            if(opts.state != null && opts.state >= 0){
                this.state = opts.state;
            }

        }

    });

    Game.BETTYPE = {};
    Game.BETTYPE.BETON            = 0;      //押注
    Game.BETTYPE.BETMIN           = 1;      //押小
    Game.BETTYPE.BETMAX           = 2;      //押大

    Game.STATE = {} ;
    Game.STATE.READY                = 0;
    Game.STATE.DEALED               = 1;
    Game.STATE.BET                  = 2;
    Game.STATE.BETED                = 3;
    Game.STATE.DRAWED               = 4;

    Game.ERR = {
        NO_DRAW                 : 10001,            //"不在游戏开牌流程中"
        NO_READY                : 10002,            //"不在游戏开局流程中"
        NO_BET                  : 10003,            //"不在游戏押注流程中"
        NO_BETED                : 10004,            //"还没下注"
        OUT_MAXBET              : 10005,            //"超出押注金额上限"
        BETTYPE_ERR             : 10006,            //"押注类型错误"
        NO_MONEY_ERR            : 10007,            //"玩家不够本金押注"
        NO_BET_MAX_AND_MIN      : 10008            //"没有押注大小"
    };

    Game.BET_AMOUNT = [
        10,
        50,
        100,
        200
    ];
}(Papaya));