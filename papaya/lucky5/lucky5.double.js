(function(root) {
    var _super = root.Serialize;
    var Lucky5 = root.Lucky5;
    var Logic = root.Lucky5.Logic;
    var Poker = root.Lucky5.Poker;
    var Double = root.Lucky5.Double = function(opts) {
        opts = opts || {};

        this.deck                   = []; // 一整副牌
        this.handPokers             = []; // 手牌
        this.dealerIndex            = 0;
        this.playerIndex            = opts.playerIndex || -1;

        this.state                  = opts.state || Double.STATE.READY;
        this.lastScore              = opts.lastScore || 0;
        this.betAmount              = opts.betAmount || 0;
        this.score                  = opts.score || 0;
        this.bonus                  = opts.bonus || 0;
        this.round                  = opts.round || 0;

        this.init(opts);
    };

    //Inherits Class
    root.inherits(Double, _super);

    Double.STATE = {};
    Double.STATE.READY            = 0;
    Double.STATE.STARTED          = 1;
    Double.STATE.SHUFFLED         = 2;
    Double.STATE.DEALED           = 3;
    Double.STATE.DRAWED           = 4;
    Double.STATE.ENDED            = 9;

    //Constants
    Double.RESULT_WAIT            = 0;
    Double.RESULT_WIN             = 1;
    Double.RESULT_DRAW            = 2;
    Double.RESULT_LOST            = 3;

    Double.BET_ORIG               = 0;
    Double.BET_DOUBLE             = 1;
    Double.BET_HALF               = 2;

    //Extend Prototype
    root.extend(Double.prototype, {
        init: function (opts) {
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
        },

        enter: function(lastScore) {
            this.lastScore = lastScore || 0;
            this.state = Double.STATE.READY;
        },

        start: function() {
            // 初始化所有参数
            this.deck                   = []; // 一整副牌
            this.handPokers             = []; // 手牌
            this.dealerIndex            = 0;
            this.playerIndex            = -1;

            this.state                  = Double.STATE.STARTED;
            this.betAmount              = this.lastScore;
            this.score                  = 0;
            this.bonus                  = 0;
            this.round                  = 0;

            // 初始化扑克牌
            var types = Object.keys(Lucky5.Poker.DECK);
            for (var tIndex = 0, size = types.length; tIndex < size; tIndex++) {
                var type = types[tIndex];
                var array = Lucky5.Poker.DECK[type];

                if (type == Poker.JOKER) {
                    continue;
                }

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

        shuffle: function () {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random() * (max - min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
            this.state = Double.STATE.SHUFFLED;
        },

        bet: function (type) {
            if (type == Double.BET_HALF) {
                this.betAmount /= 2;
            } else if (type == Double.BET_DOUBLE) {
                this.betAmount *= 2;
            } else {

            }

            this.state = Double.STATE.DEALED;
        },

        deal: function () {
            for (var i = 0; i < Lucky5.MAX_HAND; i++) {
                this.handPokers.push(this.deck.shift());
            }
        },

        draw: function(selectIndex) {
            if (selectIndex < 1 || selectIndex >= 5) {
                return;
            }

            this.playerIndex = selectIndex;

            this.state = Double.STATE.DRAWED;
        },
        
        end: function() {
            var result = 0;
            var score = 0;
            var lastScore = this.lastScore;
            var dealerPoker = this.handPokers[0];
            var playerPoker = this.handPokers[this.playerIndex];

            if (playerPoker.value > dealerPoker.value) {
                result = Double.RESULT_WIN;
                score = this.betAmount * 2;
                lastScore = score;
            } else if (playerPoker.value < dealerPoker.value) {
                result = Double.RESULT_LOST;
                score = 0;
                lastScore = 0;
            } else {
                result = Double.RESULT_DRAW;
                score = this.betAmount;
            }

            this.result = result;
            this.score  = score;
            this.lastScore = lastScore;
            this.state = Double.STATE.ENDED;
        }
    });
}(Papaya));