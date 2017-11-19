(function(root) {
    var _super = root.Serialize;
    var PokerGo = root.PokerGo;
    var Poker = root.PokerGo.Poker;
    var Double = root.PokerGo.Double = function(opts) {
        opts = opts || {};

        this.deck                   = opts.deck         || [];  // 一整副牌
        this.handPokers             = opts.handPokers   || [];  // 手牌

        this.state                  = opts.state || Double.STATE.END;

        this.score                  = opts.score || 0;
        this.lastScore              = opts.lastScore || 0;
        this.rount                  = opts.rount || 0;
        this.results                = opts.results || 0;
        this.betType                = opts.betType || 0;
    };

    //Inherits Class
    root.inherits(Double, _super);

    Double.STATE = {};
    Double.STATE.READY            = 1;
    Double.STATE.DEALED           = 2;
    Double.STATE.END              = 3;


    //Constants
    Double.RESULT_DRAW            = 0;
    Double.RESULT_WIN             = 1;
    Double.RESULT_LOST            = 2;

    Double.BET_TYPE = {
        NO      : 0,
        BIG     : 1,
        SMALL   : 2
    };

    Double.ERR = {
        NO_WIN_REWARD           : 20001,                //"没有赢得奖励"
        NO_READY                : 20002,                //"不在游戏开局流程中"
        NO_DEALED               : 20003,                //"不在游戏开牌流程中"
        LOST                    : 20004,                //"失败不能进行"
        END                     : 20005,                //"已经领取奖励"
    };

    //Extend Prototype
    root.extend(Double.prototype, {

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

        enter: function(opts) {
            var results = {
                lastScore : 0,
                err : null,
                state : null,
                results : 0
            };

            var lastScore = Number(opts.lastScore) ||  0;
            if(lastScore <= 0 || lastScore != Number(opts.game.score)){
                results.err = Double.ERR.NO_WIN_REWARD;
                return results
            }

            this.lastScore = lastScore ;
            this.state = Double.STATE.READY;
            this.results = 0;
            this.score = 0;

            results.lastScore = this.lastScore;
            results.state = this.state;
            results.results = 0;
            results.score = 0;
            return results
        },

        shuffle: function () {
            var newDeck = [];

            this.deck = this.getDeckPokers();

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random() * (max - min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        deal: function (opts) {
            var results = {
                handPokers : [],
                results : null,
                score : 0,
                err : null,
                lastScore : null
            };

            var betType = Number(opts.betType);

            if(this.results == Double.RESULT_LOST){
                results.err = Double.ERR.LOST;
                return results
            }
            if(this.state == Double.STATE.END){
                results.err = Double.ERR.END;
                return results
            }

            this.betType = betType;
            this.state = Double.STATE.DEALED;

            this.shuffle();
            this.handPokers = [];
            this.handPokers.push(this.deck.shift());

            var pokerValue = this.handPokers[0].value;

            if(pokerValue <= 6){
                switch (betType){
                    case Double.BET_TYPE.BIG :
                        this.score = -this.lastScore;
                        this.results = Double.RESULT_LOST;
                        this.lastScore = 0;

                        results.score = this.score;
                        results.results = this.results;
                        results.lastScore = this.lastScore;
                        break;
                    case Double.BET_TYPE.SMALL :
                        this.score = this.lastScore;
                        this.results = Double.RESULT_WIN;
                        this.lastScore += this.lastScore; 

                        results.score = this.score;
                        results.results = this.results;
                        results.lastScore = this.lastScore;
                        break;
                }
            }
            else if(pokerValue >= 8){
                switch (betType){
                    case Double.BET_TYPE.BIG :
                        this.score = this.lastScore;
                        this.results = Double.RESULT_WIN;
                        this.lastScore += this.lastScore; 

                        results.score = this.score;
                        results.results = this.results;
                        results.lastScore = this.lastScore;
                        break;
                    case Double.BET_TYPE.SMALL :
                        this.score = -this.lastScore;
                        this.results = Double.RESULT_LOST;
                        this.lastScore = 0;

                        results.score = this.score;
                        results.results = this.results;
                        results.lastScore = this.lastScore;
                        break;
                }
            }
            else if(pokerValue == 7){
                this.score = 0;
                this.results = Double.RESULT_DRAW;  

                results.score = this.score;
                results.results = this.results;
            }

            results.betType = this.betType ;
            results.rount = this.rount;
            results.state = this.state;
            results.handPokers = this.handPokers;
            return results;
        },

        end : function (opts){
            var results = {
                err : null,
                game : {},
                lastScore : null
            }

            this.state = Double.STATE.END;

            var game = opts.game;
            game.score = 0;
            results.game.score = 0;

            this.lastScore = 0; 

            results.lastScore = this.lastScore;
            results.state = this.state;
            return results
        },

        syncDouble : function (opts){
            if (opts.handPokers){
                this.handPokers = [];
                this.handPokers = opts.handPokers;
            }

            if(opts.betType != null && opts.betType >= 0){
                this.betType = opts.betType;
            }

            if(opts.results != null && opts.results >= 0){
                this.results = opts.results;
            }

            if(opts.lastScore != null && opts.lastScore >= 0){
                this.lastScore = opts.lastScore;
            }

            if(opts.score != null && opts.score >= 0){
                this.score = opts.score;
            }

            if(opts.state != null && opts.state >= 0){
                this.state = opts.state;
            }
        }

    });
}(Papaya));