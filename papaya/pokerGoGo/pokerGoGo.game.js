/**
 * Created by WhelaJoy on 2017/2/18.
 */
(function(root) {
    var _super = root.Game;
    var PokerGoGo = root.PokerGoGo;
    var Poker = root.PokerGoGo.Poker;
    var Game = root.PokerGoGo.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        this.id                     = root.Game.ID_POKERGOGO;

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.initDeck               = []; // 一整副牌(初始化)

        this.betAmount              = 0;
        this.bettype                = 0;

        this.state                  = Game.STATE.BET;

        this.jackPotPool            = opts.jackPotPool || 0;
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function() {
            // 初始化扑克牌
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

                    this.initDeck.push(poker);
                }
            }

            // 洗牌
            this.shuffle();
        },

        shuffle: function() {
            var newDeck = [];

            var deck = this.initDeck.concat();

            while (deck.length) {
                var min = 0;
                var max = deck.length - 1;

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
            if(this.betType > 0){
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
            var bettype = opts.bettype;

            if((bettype > 0 &&　betAmount > PokerGo.Poker.ONE_PAIR_MAX_BET) || (bettype == 0 && betAmount > PokerGo.MAX_BET) ){
                results.err = Game.ERR.OUT_MAXBET;

                return results;
            }

            //if((!this.isOnePair(this.handPokers) && bettype > 0) || (this.isOnePair(this.handPokers) && bettype == 0 ) ){
            //    results.err = Game.ERR.BETTYPE_ERR;
            //    return results
            //}

            results.betAmount = betAmount;
            //results.bettype = bettype;

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
                handPokers: null,
                score: null,
                results : null,
                err: null,
                betAmount : null,
                jackPotPool : null,
                state : null
            };

            //if(!(this.state == Game.STATE.READY || this.state == Game.STATE.BET)){
            //    results.err = Game.ERR.NO_READY;
            //    return results;
            //}
            //results.state = Game.STATE.BET;

            if(this.state != Game.STATE.BETED){
                results.err = Game.ERR.NO_BETED;
                return results;
            }
            results.state = Game.STATE.READY;


            this.shuffle();
            var score = null;
            this.handPokers = [];
            for (var i = 0; i < PokerGo.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }
            results.handPokers = this.handPokers;

            if(this.isSequence(this.handPokers)){
                results.results = PokerGo.Poker.SEQUENCE;
                score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SEQUENCE]);
                results.score = score;
                results.jackPotPool = this.jackPotPool - score;

                results.betAmount = 0;
                results.state = Game.STATE.BET;
                return results;
            }

            return results;
        },

        drawHandle: function(opts) {
            var results = {
                handPokers: null,
                score: null,
                results : null,
                err:null,
                betAmount : 0,
                jackPotPool : null,
                bettype: 0,
                state : null
            };

            if(this.isOnePair(this.handPokers) && this.bettype <= 0 ){
                results.err = Game.ERR.NO_BET_MAX_AND_MIN;
                return results;
            }

            if (this.state != Game.STATE.READY){
                results.err = Game.ERR.NO_READY;
                return results;
            }
            results.state = Game.STATE.BET;

            //if (this.state != Game.STATE.BETED){
            //    results.err = Game.ERR.NO_BETED;
            //    return results;
            //}
            //results.state = Game.STATE.READY;

            var min = 0;
            var max = this.deck.length - 1;
            var index = Math.floor(Math.random()*(max-min) + min);
            this.handPokers.push(this.deck[index]);
            results.handPokers = this.handPokers[2];

            var pokerValue1 = this.handPokers[0].value;
            var pokerValue2 = this.handPokers[1].value;
            var pokerValue3 = this.handPokers[2].value;

            var score = null;

            if(this.isOnePair(this.handPokers)){
                //押大，押小
                //if(this.betAmount > PokerGo.Poker.ONE_PAIR_MAX_BET){
                //    results.err = Game.ERR.OUT_MAXBET;
                //
                //    return results;
                //}

                if (pokerValue3 == pokerValue1){
                    //帽子戏法
                    results.results = PokerGo.Poker.THREE_OF_A_KIND;
                    results.score = this.jackPotPool;
                    results.jackPotPool = 2000;
                    return results
                }

                if(this.bettype == Game.BETTYPE.BETMIN && pokerValue3 < pokerValue1){
                    //押小
                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount)  ;
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;
                    return results
                }
                else if (this.bettype == Game.BETTYPE.BETMAX && pokerValue3 > pokerValue1){
                    //押大
                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;
                    return results
                }
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
                            score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH] * this.betAmount + this.betAmount);
                            results.score = score;
                            results.jackPotPool = this.jackPotPool - score;

                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT] * this.betAmount + this.betAmount);
                        results.score = score;
                        results.jackPotPool = this.jackPotPool - score;

                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;

                    return results
                }
                else if (pokerValue2 < pokerValue1 && (pokerValue3 > pokerValue2 && pokerValue3 < pokerValue1)) {
                    //顺子
                    if (pokerValue3 - 1 == pokerValue2 && pokerValue3 + 1 == pokerValue1){
                        if (pokerType1 == pokerType2 && pokerType2 == pokerType3 && pokerType3 == pokerType1 ){
                            //同花顺
                            results.results = PokerGo.Poker.STREIGHT_FLUSH;
                            score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT_FLUSH] * this.betAmount + this.betAmount);
                            results.score = score;
                            results.jackPotPool = this.jackPotPool - score;

                            return results
                        }

                        results.results = PokerGo.Poker.STREIGHT;
                        score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.STREIGHT] * this.betAmount + this.betAmount);
                        results.score = score;
                        results.jackPotPool = this.jackPotPool - score;

                        return results
                    }

                    results.results = PokerGo.Poker.SHOOT;
                    score = this.getJackPotPool(PokerGo.Poker.SCORES[PokerGo.Poker.SHOOT] * this.betAmount + this.betAmount);
                    results.score = score;
                    results.jackPotPool = this.jackPotPool - score;

                    return results
                }
                else if(pokerValue3 == pokerValue1 || pokerValue3 == pokerValue2){
                    results.results = PokerGo.Poker.HIT_COLUMN;
                    score = this.betAmount;

                    if(score >= App.player.balance){
                        score = App.player.balance;
                    }

                    results.score = -score;
                    results.jackPotPool = this.jackPotPool + score;
                    return results;
                }

            }

            //射偏，押大小(输)
            results.results = PokerGo.Poker.NO_SHOOT;

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

        syncGame :function (opts){
            if(opts.betAmount != null && opts.betAmount >= 0){
                this.betAmount = opts.betAmount;
            }

            if(opts.bettype != null && opts.bettype >= 0){
                this.bettype = opts.bettype;
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
    Game.STATE.BET                  = 1;
    Game.STATE.BETED                = 2;
    Game.STATE.DRAW                 = 3;

    Game.ERR = {
        NO_READY     : 10001, //"不在游戏预备开牌中"
        NO_BET       : 10002, //"不在游戏开始押注中"
        NO_BETED     : 10003, //"还没下注"
        OUT_MAXBET   : 10004, //"超出最大押注金"
        BETTYPE_ERR  : 10005, //"押注类型错误"
        NO_MONEY_ERR : 10006, //"玩家不够本金押注"
        NO_BET_MAX_AND_MIN : 10007, //"没有押注大小"
    };
}(Papaya));