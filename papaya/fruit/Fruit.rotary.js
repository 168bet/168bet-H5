(function(root) {
    var Rotary = root.Rotary = function() {

    };

    Rotary.ROTARY_FRUITS = [
        {id:1001, fruitName: "Apple", multiple:1, weight: 457},
        {id:1002, fruitName: "Bell", multiple:3, weight: 761},
        {id:1003, fruitName: "Orange", multiple:1, weight: 494},
        {id:1004, fruitName: "Bell", multiple:1, weight: 500},
        {id:1005, fruitName: "GG", multiple: 50, weight: 45},
        {id:1006, fruitName: "GG", multiple: 100, weight: 22},
        {id:1007, fruitName: "Apple", multiple:1, weight: 457},
        {id:1008, fruitName: "Apple", multiple:3, weight: 761},
        {id:1009, fruitName: "Pomelo", multiple:1, weight: 494},
        {id:1010, fruitName: "Watermelon", multiple:1, weight: 247},
        {id:1011, fruitName: "Watermelon", multiple:3, weight: 761},
        {id:1012, fruitName: "BlueLuck", multiple:1, weight: 191},
        {id:1013, fruitName: "Apple", multiple:1, weight: 457},
        {id:1014, fruitName: "Orange", multiple:3, weight: 761},
        {id:1015, fruitName: "Orange", multiple:1, weight: 494},
        {id:1016, fruitName: "Bell", multiple:1, weight: 494},
        {id:1017, fruitName: "77", multiple:3, weight: 761},
        {id:1018, fruitName: "77", multiple:1, weight: 247},
        {id:1019, fruitName: "Apple", multiple:1, weight: 457},
        {id:1020, fruitName: "Pomelo", multiple:3, weight: 761},
        {id:1021, fruitName: "Pomelo", multiple:1, weight: 494},
        {id:1022, fruitName: "Star", multiple:1, weight: 247},
        {id:1023, fruitName: "Star", multiple:3, weight: 761},
        {id:1024, fruitName: "GoldenLuck", multiple:1, weight: 191}
    ];

    //*大三元
    Rotary.BIG_TRIPLE = [1010, 1022, 1018];

    //*小三元
    Rotary.SMALL_TRIPLE = {
        "Bell": [1004, 1016],
        "Pomelo": [1009, 1021],
        "Orange": [1003, 1015]
    };

    Rotary.SMALL_TRIPLE_ALL_FRUITS = [1004, 1016, 1009, 1021, 1003, 1015];

    //*大四喜
    Rotary.QUADRUPLE = [1001, 1007, 1013, 1019];

    //*随机倍率区
    Rotary.RANDOM_MULTIPLE_LOW = [10, 15, 20];
    Rotary.RANDOM_MULTIPLE_HIGH = [20, 30, 40];

    Rotary.WEIGHT_MULTIPLE_LOW = [
        {id: 1101, multiple:10, weight: 228},
        {id: 1102, multiple:15, weight: 152},
        {id: 1103, multiple:20, weight: 114}
    ];
    Rotary.WEIGHT_MULTIPLE_HIGH = [
        {id: 1104, multiple:20, weight: 114},
        {id: 1105, multiple:30, weight: 76},
        {id: 1106, multiple:40, weight: 57}
    ];

    //*大三元，小三元，大四喜出现的概率
    Rotary.PROBABILITY_BIG_TRIPLE = 3;
    Rotary.PROBABILITY_SMALL_TRIPLE = 5;
    Rotary.PROBABILITY_QUADRUPLE = 5;

    Rotary.PROBABILITY_LUCKY_EAT_LIGHT = 10;
    Rotary.PROBABILITY_LUCKY_GIVE_LIGHT = 89;
    Rotary.PROBABILITY_LUCKY_QUADRUPLE = 94;
    Rotary.PROBABILITY_LUCKY_SMALL_TRIPLE = 98;
    Rotary.PROBABILITY_LUCKY_BIG_TRIPLE = 100;

    //*开始，结束送灯的概率
    Rotary.PROBABILITY_GIVE_LIGHT_START = 1;
    Rotary.PROBABILITY_GIVE_LIGHT_END = 5;

    //*苹果的赔率
    Rotary.MULTIPLE_BY_APPLE = 5;

    //*luck
    Rotary.LUCK_NAME_LIST = ["GoldenLuck", "BlueLuck"];
    Rotary.LUCK_INDEX_LIST = [1012, 1024];

    //*特殊类型
    Rotary.SPECIAL_TYPE_NAME_LIST = {
        BIG_TRIPLE: "BIG_TRIPLE",
        SMALL_TRIPLE: "SMALL_TRIPLE",
        QUADRUPLE: "QUADRUPLE"
    };

    Rotary.FRUIT_NAME_LIST = [
        "GG",
        "77",
        "Star",
        "Watermelon",
        "Bell",
        "Pomelo",
        "Orange",
        "Apple"
    ];

    //*猜大小类型
    Rotary.GUESS_SIZE_TYPE = {
        LOW: "1-6",
        HIGH: "8-13",
        ZERO: "7"
    };
} (Papaya.Fruit));