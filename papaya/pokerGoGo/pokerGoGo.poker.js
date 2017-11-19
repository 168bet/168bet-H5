/**
 * Created by WhelaJoy on 2017/2/17.
 */
(function(root) {
    var Poker = root.PokerGoGo.Poker = function() {
        this.type = null;
        this.name = null;
        this.value = 0;
    };

    Poker.NO_SHOOT                      = 0; // 射偏，押大小(输)
    Poker.SHOOT                         = 1; // 射中，押大小(赢)
    Poker.STREIGHT                      = 2; // 顺子
    Poker.SEQUENCE                      = 3; // 连张
    Poker.STREIGHT_FLUSH                = 4; // 同花顺
    Poker.THREE_OF_A_KIND               = 5; // 三张相同的牌（帽子戏法）
    Poker.HIT_COLUMN                    = 6; // 撞柱

    Poker.SCORES                        = {
        "1" :   1,
        "2" :   2,
        "3" :   999,
        "4" :   4
    };
    Poker.ONE_PAIR_MAX_BET = 100;       //押大，押小是，最大的押注钱

    Poker.TYPE_NAME                     = {
        "0":       "射偏",
        "1":       "射中",
        "2":       "顺子",
        "3":       "连张",
        "4":       "同花顺",
        "5":       "帽子戏法",
        "6":       "撞柱"
    };

    Poker.SPADE = "spade";
    Poker.HEART = "heart";
    Poker.CLUB = "club";
    Poker.DIAMOND = "diamond";
    Poker.JOKER = "joker";
    Poker.DECK = {
        "spade": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "heart": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "club": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
        ],
        "diamond": [
            "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"
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