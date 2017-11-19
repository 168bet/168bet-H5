/**
 * Created by WhelaJoy on 2017/2/17.
 */
(function(root) {
    var Poker = root.PokerGo.Poker = function() {
        this.type = null;
        this.name = null;
        this.value = 0;
    };

    Poker.PROBABILITY = [
        {type : 1,weight:90},
        {type : 2,weight:10},
        {type : 3,weight:0},
        {type : 5,weight:0}
    ];

    Poker.NO_SHOOT                      = 0; // 射偏，押大小(输)
    Poker.SHOOT                         = 1; // 射中，押大小(赢)
    Poker.STREIGHT                      = 2; // 顺子
    Poker.STREIGHT_FLUSH                = 3; // 同花顺（帽子戏法）
    Poker.THREE_OF_A_KIND               = 4; // 三张相同的牌
    Poker.SEQUENCE                      = 5; // 连张
    Poker.HIT_COLUMN                    = 6; // 撞柱
    Poker.ONE_PAIR                      = 7; // 对子（一对）

    Poker.SCORES                        = {
        "1" :   1,
        "2" :   2,
        "3" :   150,
        "4" :   4
    };
    Poker.ONE_PAIR_MAX_BET = 100;       //押大，押小是，最大的押注钱

    Poker.TYPE_NAME                     = {
        "0":       "射偏",
        "1":       "射中",
        "2":       "顺子",
        "3":       "同花顺",
        "4":       "帽子戏法",
        "5":       "连张",
        "6":       "撞柱",
        "7":       "对子"
    };

    Poker.SPADE = "spade";
    Poker.HEART = "heart";
    Poker.CLUB = "club";
    Poker.DIAMOND = "diamond";
    Poker.JOKER = "joker";
    Poker.DECK = {
        "spade": [
            "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"
        ],
        "heart": [
            "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"
        ],
        "club": [
            "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"
        ],
        "diamond": [
            "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"
        ]
        //"joker": [
        //    "small", "big"
        //]
    };
    Poker.DECK_VALUE = {
        "spade": {              // 黑桃
            "ace":    1,
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13
        },
        "heart": {              // 红心
            "ace":    1,
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13
        },
        "club": {               // 梅花
            "ace":    1,
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13
        },
        "diamond": {            // 方块
            "ace":    1,
            "two":    2,
            "three":  3,
            "four":   4,
            "five":   5,
            "six":    6,
            "seven":  7,
            "eight":  8,
            "nine":   9,
            "ten":    10,
            "jack":   11,
            "queen":  12,
            "king":   13
        },
        //"joker": {
        //    "small":  15,
        //    "big":    16
        //}
    };
} (Papaya));