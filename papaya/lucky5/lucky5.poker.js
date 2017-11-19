/*
 * 1 High Card: Highest value card.
 * 2 One Pair: Two cards of the same value.
 * 3 Two Pairs: Two different pairs.
 * 4 Three of a Kind: Three cards of the same value.
 * 5 Straight: All cards are consecutive values.
 * 6 Flush: All cards of the same suit.
 * 7 Full House: Three of a kind and a pair.
 * 8 Four of a Kind: Four cards of the same value.
 * 9 Straight Flush: All cards are consecutive values of same suit.
 *10 Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
 */
/*
 *       "JACKS OR BETTER",          // one pair J以上对子
 *       "TWO PAIRS",                // tow pairs 两对
 *       "THREE OF A KIND",          // 三张
 *       "STREIGHT",                 // 顺子
 *       "FLUSH",                    // 同花
 *       "FULL HOUSE",               // 葫芦
 *       "FOUR OF A KIND",           // 四张
 *       "STREIGHT FLUSH",           // 同花顺
 *       "ROYAL FLUSH",              // 皇家同花顺
 *       "LUCKY 5"                   // HIGH 5
 */
(function(root) {
    var Poker = root.Poker = function(opts) {
        opts = opts || {};

        this.type  = opts.type || null;
        this.name  = opts.name || null;
        this.value = opts.value || 0;
    };

    Poker.NOTHING                       = 0; // 散牌
    Poker.HIGH_CARD                     = 1; // 大牌
    Poker.ONE_PAIR                      = 2; // 一对
    Poker.TWO_PAIR                      = 3; // 两对
    Poker.THREE_OF_A_KIND               = 4; // 三张相同的牌
    Poker.STREIGHT                      = 5; // 顺子
    Poker.FLUSH                         = 6; // 同种花色的五张牌
    Poker.FULL_HOUSE                    = 7; // 三张相同的牌加二张相同的牌
    Poker.FOUR_OF_A_KIND                = 8; // 四张相同的牌
    Poker.STREIGHT_FLUSH                = 9; // 同花顺
    Poker.ROYAL_FLUSH                   = 10;// 同花大顺
    Poker.LUKCY5                        = 11;// 幸运5张
    
    Poker.SCORES                        = {
        "2":       1,
        "3":       2,
        "4":       3,
        "5":       5,
        "6":       7,
        "7":       10,
        "8":       40,
        "9":       120,
        "10":      200,
        "11":      500
    };
    Poker.TYPE_NAME                     = {
        "0":       "不中",
        "1":       "不中",
        "2":       "J以上对子",
        "3":       "两对",
        "4":       "三张",
        "5":       "顺子",
        "6":       "同花",
        "7":       "葫芦",
        "8":       "四张",
        "9":       "同花顺",
        "10":      "皇家同花顺",
        "11":      "Lucky5"
    };
    Poker.HAND_TEXT = [
        { name:"流局", score:0 },
        { name:"流局", score:0 },
        { name:"J以上对子", score:10 },
        { name:"两对", score:20 },
        { name:"三张", score:30 },
        { name:"顺子", score:50 },
        { name:"同花", score:70 },
        { name:"葫芦", score:100 },
        { name:"四张", score:400 },
        { name:"同花顺", score:1200 },
        { name:"皇家同花顺", score:2000 },
        { name:"Lucky 5", score:5000 }
    ];

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
        ],
        "joker": [
            "small", "big"
        ]
    };
    Poker.DECK_VALUE = {
        "spade": {              // 黑桃
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
            "king":   13,
            "ace":    14
        },
        "heart": {              // 红心
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
            "king":   13,
            "ace":    14
        },
        "club": {               // 梅花
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
            "king":   13,
            "ace":    14
        },
        "diamond": {            // 方块
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
            "king":   13,
            "ace":    14
        },
        "joker": {
            "small":  15,
            "big":    16
        }
    };
} (Papaya.Lucky5));