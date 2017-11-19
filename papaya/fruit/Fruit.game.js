(function(root) {
    var _super = root.Game;
    var Rotary = root.Fruit.Rotary;
    var Logic = root.Fruit.Logic;

    var Game = root.Fruit.Game = function(opts) {
        opts = opts || {};

        Game.super(this, opts);

        //private members

        //public members
        this.id             = root.Game.ID_FRUIT;

        this.baseLightNum   = 1;
        this.betInfo        = {};
        this.multiples      = opts.multiples    || {low: 10, high: 20};
        this.betTotal       = opts.betTotal     || 0;
        this.guessBet       = opts.guessBet     || 0;                           //*猜大小的押注
        this.bonusWin       = opts.bonusWin     || 0;
        this.betFactor      = opts.betFactor    || 1;                           //*押注倍数
        this.fruitBetList   = opts.fruitBetList || {};                          //*押注列表
        this.lastFruit      = opts.lastFruit    || {};                          //*最新一次水果结果
        this.records        = opts.records      || {};                          //*水果开启记录
        this.guessedNum     = opts.guessedNum   || 0;                           //*博大小的结果
        this.guessedType    = opts.guessedType  || Rotary.GUESS_SIZE_TYPE.LOW;  //*玩家选择大小的类型
        this.state          = opts.state        || Game.STATE.READY;            //*游戏所处的状态

        this.init();
    };

    //Inherits Class
    root.inherits(Game, _super);

    //Extend Prototype
    root.extend(Game.prototype, {
        init: function() {
        },

        betFruit: function (betInfo) {
            //*押注水果
            betInfo = JSON.parse(betInfo) || {};

            for (var i in betInfo) {
                this.fruitBetList[i] = betInfo[i];
            }

            this.state = Game.STATE.FRUIT_BETTING;
        },

        changeBetFactor: function (betFactor) {
            //*设置押注倍数
            betFactor = Number(betFactor) || 1;

            if (Game.BET_FACTOR.indexOf(betFactor) != -1) {
                this.betFactor = betFactor;
                this.state = Game.STATE.FRUIT_BETTING;
            }
        },

        fruitWithdraw: function (betInfo) {
            var result = {
                betTotal: 0
            };

            betInfo = JSON.parse(betInfo) || {};
            var betTotal = 0;
            for (var betIndex in betInfo) {
                betTotal += betInfo[betIndex];
            }
            if (betTotal <= 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            result.betTotal = betTotal;
            this.betTotal = result.betTotal;

            this.state = Game.STATE.FRUIT_BETTING;

            return result;
        },

        betOn: function (betInfo) {
            var result = {
                errCode: null,
                fruits: {},
                rewardType: {},
                multiples: {
                    low: 10,
                    high: 20
                },
                betTotal: 0,
                bonusWin: 0
            };

            if (typeof betInfo == "string") {
                betInfo = JSON.parse(betInfo);
            }

            betInfo = betInfo || {};

            var betTotal = 0;
            for (var betIndex in betInfo) {
                betTotal += betInfo[betIndex];
            }
            if (betTotal <= 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            this.betInfo = betInfo;

            var giveLights = Logic.giveLights();
            var lightTotal = this.baseLightNum + giveLights;

            var randomFruitResult = Logic.getRandomRotaryFruits(lightTotal);
            result.fruits = randomFruitResult.fruits;
            result.rewardType = randomFruitResult.rewardType;

            result.multiples = Logic.randomMultiple();
            this.multiples = result.multiples;

            result.betTotal = betTotal;
            this.betTotal = result.betTotal;

            result.bonusWin = this.calcBonusWin(result.fruits);
            this.bonusWin = result.bonusWin;

            this.lastFruit = result.fruits;
            this.state = Game.STATE.FRUIT_RUSELT;

            return result;
        },

        calcBonusWin: function (fruitList) {
            var bonus = 0;
            this.bonusWin = 0;

            var rotaryFruits = Rotary.ROTARY_FRUITS;
            var bigTripleFruits = Rotary.BIG_TRIPLE;
            var smallTripleFruits = Rotary.SMALL_TRIPLE_ALL_FRUITS;
            var quadruple = Rotary.QUADRUPLE;

            var fruit = null;
            var fruitId = 0;
            var fruitIndex = 0;

            for (var listName in fruitList) {
                var singleFruitList = fruitList[listName];
                var length = singleFruitList.length;
                for (var index = 0; index < length; index ++) {
                    fruitIndex = singleFruitList[index];
                    fruit = rotaryFruits[fruitIndex];
                    var fruitName = fruit.fruitName;
                    var multiple = fruit.multiple;
                    var id = fruit.id;
                    var bet = Number(this.betInfo[fruitName]);

                    if (Rotary.LUCK_INDEX_LIST.indexOf(id) == -1) {
                        if (multiple <= 1) {
                            if (bigTripleFruits.indexOf(id) != -1) {
                                multiple = this.multiples.high;
                            }
                            else if (smallTripleFruits.indexOf(id) != -1) {
                                multiple = this.multiples.low;
                            }
                            else if (quadruple.indexOf(id) != -1){
                                multiple = Rotary.MULTIPLE_BY_APPLE;
                            }
                        }

                        bonus += bet * multiple;
                    }
                }
            }

            return bonus;
        },

        guessWithdraw: function (betInfo) {
            var result = {
                errCode: null
            };

            var betNum = betInfo;
            if (betNum == 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            this.betTotal = Number(betNum);
            return result;
        },

        setGuessBetting: function (bet) {
            var result = {
                errCode: null
            };

            bet = Number(bet) || 1;
            this.guessBet = bet;
            this.gameState = Game.STATE.GUESS_BETTING;

            return result;
        },

        guessTheSizeOf: function (betInfo) {
            var result = {
                errCode: null,
                randNum: 1,
                bonusWin: 0
            };

            var bonus = 0;
            var betNum = betInfo.bet;
            var betType = betInfo.betType || Rotary.GUESS_SIZE_TYPE.LOW;
            var betLimit = betNum * 2;

            if (betNum == 0) {
                result.errCode = Game.ERR_CODE.NOT_BET;
                return result;
            }

            if (betNum > betLimit) {
                result.errCode = Game.ERR_CODE.EXCEED_BETS;
                return result;
            }

            var randNum = Logic.getGuessNum();
            var randType = Logic.getGuessNumType(randNum);

            if (betType == randType) {
                bonus = betNum * 2;
            }
            else {
                bonus = -betNum;
                betNum = 0;
            }

            result.bonusWin = bonus;
            this.bonusWin = bonus;

            result.randNum = randNum;

            this.betTotal = betNum;

            this.state = Game.STATE.GUESS_STOP;
            this.guessedType = betType;
            this.guessedNum = randNum;
            this.guessBet = betNum;

            return result;
        }
    });

    Game.STATE = {};
    Game.STATE.READY             = 0;
    Game.STATE.FRUIT_BETTING     = 1;
    Game.STATE.FRUIT_RUSELT      = 2;
    Game.STATE.FRUIT_ROTA_STOP   = 3;
    Game.STATE.GUESS_BETTING     = 4;
    Game.STATE.GUESS_STOP        = 5;

    Game.ERR_CODE = {
        NOT_BET: 10001, //*没有下注
        EXCEED_BETS: 10002 //*超过下注金额
    };

    Game.BET_FACTOR = [1, 5, 10, 20, 50, 100];
}(Papaya));