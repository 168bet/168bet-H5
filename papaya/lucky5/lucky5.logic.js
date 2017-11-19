(function(root) {
    var Poker = root.Poker;
    var Logic = root.Logic = function() {
    };

    Logic.findJoker = function(handPokers) {
        var smallJoker = Poker.DECK_VALUE["joker"]["small"];
        var bigJoker = Poker.DECK_VALUE["joker"]["big"];

        for (var i = 0, size = handPokers.length; i < size; i++) {
            if (handPokers[i].value == smallJoker) {
                return true;
            }

            if (handPokers[i].value == bigJoker) {
                return true;
            }
        }

        return false;
    };

    Logic.calculate = function(handPokers) {
        handPokers = handPokers || [];

        var i = 0;
        var key;
        var size = 5;
        var result = Poker.NOTHING;
        var pokers = handPokers.slice(0);

        var holePokerValue = [];
        var holeJoker = [];             // 手持鬼牌

        // 按照牌面大小排序
        var compare = function(a, b) {
            return (a.value > b.value);
        };

        pokers.sort(compare);

        var isFlush = false;
        var isStreight = false;
        var statPokers = null;
        var pairs = 0;
        var pairJackOrBetter = 0;
        var three = 0;
        var four = 0;
        var jackBetter = 0;
        var nothing = 0;

        var hadJoker = this.findJoker(handPokers);
        if (hadJoker)
        {
            // 先取出鬼牌
            var jokers = [];
            var spliceIndex =[];
            for (i = 0 ; i < size; i++) {

                if (pokers[i].value >= 15) {
                    jokers.push(pokers[i]);
                    holeJoker.push(pokers[i].value);
                    spliceIndex.push(i);
                }
            }

            for (i in spliceIndex) {
                pokers.splice(spliceIndex[i], 1);
            }

            size = size - jokers.length;

            // 计算花色占比
            var flush = {spade:0, heart:0, diamond:0, club:0};
            for (i in pokers)
            {
                flush[pokers[i].type]++;
            }

            var maxType = { type:"spade", count:flush["spade"] };
            for(key in flush)
            {
                if(flush[key] > maxType.count)
                {
                    maxType.type = key;
                    maxType.count = flush[key];
                }
            }

            isFlush = true;
            if(jokers.length == 1)
            {
                if(maxType.count < 4)
                {
                    isFlush = false;
                }
            }
            else if(jokers.length == 2)
            {
                if(maxType.count < 3)
                {
                    isFlush = false;
                }
            }


            /////////// 计算顺子
            isStreight = true;

            var dValueTimes = {1:0,2:0,3:0};
            for (var i = 1; i < pokers.length ; i++) {
                var dValue = Math.abs(pokers[i - 1].value - pokers[i].value);
                if(dValue >= 3)
                {
                    dValueTimes["3"]++;
                }
                else
                {
                    dValueTimes[dValue]++;
                }
            }

            if(jokers.length == 1)
            {
                if(dValueTimes["2"] > 1 || dValueTimes["3"] > 0)
                {
                    isStreight = false;
                }
            }
            else if(jokers.length == 2)
            {
                if(dValueTimes["3"] > 1)
                {
                    isStreight = false;
                }
            }

            // 计算张数
            statPokers = {};
            var value;
            for (i = 0; i < size; i++) {
                value = pokers[i].value;
                statPokers[value] = statPokers[value] || 0;
                statPokers[value]++;
            }

            var amount;
            var flag;
            var tempvalue = [];
            for (value in statPokers) {
                amount = statPokers[value];
                flag = false;
                if (amount == 2) {
                    pairs++;
                    if (value >= 11) {
                        pairJackOrBetter++;
                        flag = true;
                    }
                    else
                    {
                        tempvalue.push(value);
                    }
                }
                else if (amount == 3) {
                    three++;
                    flag = true;
                }
                else if (amount == 4) {
                    four++;
                    flag = true;
                }
                else {
                    nothing++;
                    if(value >= 11)
                    {
                        jackBetter++;
                    }
                }

                if(flag)
                {
                    holePokerValue.push(value);
                }

                if(pairs >= 2)
                {
                    holePokerValue = holePokerValue.concat(tempvalue);
                }
            }

            /*
             张数规则：
             1.如果有4条，什么鬼牌都没用
             2.如果有3条，可以做葫芦和四条，以四条为最大，所以不管是一张鬼牌还是两张鬼牌都做成四条
             3.如果有一对，一张鬼牌时做三条，两张鬼牌时做4条
             4.如果有两对，只能做葫芦
             5.如果什么都没有，一张鬼牌时做J以上对子，两张鬼牌时做三条
             */
            if (isStreight && isFlush) {
                if (pokers[0].value == 10) {
                    result = Poker.ROYAL_FLUSH;
                }
                else {
                    result = Poker.STREIGHT_FLUSH;
                }
            }
            else if(four > 0)
            {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if(three > 0)
            {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (isFlush) {
                result = Poker.FLUSH;
            }
            else if (isStreight) {
                result = Poker.STREIGHT;
            }
            else if(pairs == 1)
            {
                if(jokers.length == 1)
                {
                    result = Poker.THREE_OF_A_KIND;
                }
                else if(jokers.length == 2)
                {
                    result = Poker.FOUR_OF_A_KIND;
                }
            }
            else if(pairs == 2)
            {
                result = Poker.FULL_HOUSE;
            }
            else if(nothing > 0)
            {
                if(jackBetter > 0)
                {
                    if(jokers.length == 1)
                    {
                        result = Poker.ONE_PAIR;
                    }
                    else if(jokers.length == 2)
                    {
                        result = Poker.THREE_OF_A_KIND;
                    }
                }
                else
                {
                    result = Poker.NOTHING
                }
            }
        }
        else
        {
            // 计算同花
            isFlush = true;
            for (i = 1; i < size; i++) {
                if (pokers[i].type != pokers[i - 1].type) {
                    isFlush = false;
                    break;
                }
            }
            // 计算顺子
            isStreight = true;
            for (i = 1; i < size; i++) {
                if (pokers[i - 1].value != pokers[i].value - 1) {
                    isStreight = false;
                    break;
                }
            }

            // 计算张数
            statPokers = {};
            var value;
            for (i = 0; i < size; i++) {
                value = pokers[i].value;
                statPokers[value] = statPokers[value] || 0;
                statPokers[value]++;
            }

            //var pairs = 0;
            //var pairJackOrBetter = 0;
            //var three = 0;
            //var four = 0;
            //var nothing = 0;
            var tempvalue = [];
            var amount;
            var flag;
            for (value in statPokers) {
                amount = statPokers[value];
                flag = false;
                if (amount == 2) {
                    pairs++;
                    if (value >= 11) {
                        pairJackOrBetter++;
                        flag = true;
                    }
                    else
                    {
                        tempvalue.push(value);
                    }
                }
                else if (amount == 3) {
                    three++;
                    flag = true;
                }
                else if (amount == 4) {
                    four++;
                    flag = true;
                }
                else {
                    nothing++;
                }

                if(flag)
                {
                    holePokerValue.push(value);
                }

                if(pairs >= 2)
                {
                    holePokerValue = holePokerValue.concat(tempvalue);
                }
            }

            // 同花顺/皇家同花顺
            if (isStreight && isFlush) {
                if (this.handPokers[0].value == 10) {
                    result = Poker.ROYAL_FLUSH;
                }
                else {
                    result = Poker.STREIGHT_FLUSH;
                }
            }
            else if (four > 0) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (three > 0 && pairs > 0) {
                result = Poker.FULL_HOUSE;
            }
            else if (isFlush) {
                result = Poker.FLUSH;
            }
            else if (isStreight) {
                result = Poker.STREIGHT;
            }
            else if (three > 0) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (pairs >= 2) {
                result = Poker.TWO_PAIR;
            }
            else if (pairJackOrBetter > 0) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }

        return result;
    };

    Logic.calculate2 = function(handPokers) {
        handPokers = handPokers || [];

        var i = 0;
        var key;
        var size = 5;
        var result = Poker.NOTHING;
        var pokers = handPokers.slice(0);

        // 按照牌面大小排序
        var compare = function(a, b) {
            return (a.value > b.value);
        };

        pokers.sort(compare);

        var isFlush = false;
        var isStreight = false;
        var statValues = {};
        var statTypes = {};
        var pairs = 0;
        var pairJackOrBetter = 0;
        var three = 0;
        var four = 0;
        var jackOrBetter = 0;
        var nothing = 0;

        var highValue = 0;
        var pairValue = [];
        var threeValue = 0;
        var fourValue = 0;

        // 计算花色和张数
        var type;
        var value;
        for (i = 0; i < size; i++) {
            type = pokers[i].type;
            value = pokers[i].value;

            statValues[value] = statValues[value] || 0;
            statValues[value]++;

            statTypes[type] = statTypes[type] || 0;
            statTypes[type]++;

            if (value > highValue && value < 15) {
                highValue = value;
            }
        }

        var amount;
        var jokerAmount = statTypes[Poker.JOKER] || 0;

        isFlush = false;
        for (type in statTypes) {
            amount = statTypes[type];
            if (type == Poker.JOKER) {
                continue;
            }

            if (amount >= 5) {
                isFlush = true;
                break;
            }

            if (amount + jokerAmount >= 5) {
                isFlush = true;
                break;
            }
        }

        // 计算顺子
        isStreight = true;
        var jokerUsed = 0;
        for (i = 1; i < size; i++) {
            var valueA = pokers[i - 1].value;
            var valueB = pokers[i].value;

            if (pokers[i].type ==  Poker.JOKER
            || pokers[i - 1].type ==  Poker.JOKER) {
                continue;
            }

            if (valueA != valueB - 1) {
                if (valueB - valueA < 5) {
                    jokerUsed++;
                }
                else {
                    isStreight = false;
                    break;
                }
            }

            if (jokerUsed > jokerAmount) {
                isStreight = false;
                break;
            }
        }

        for (value in statValues) {
            var pokerValue = Number(value);
            amount = statValues[value];

            // ignore joker values
            if (value >= 15) {
                continue;
            }

            if (amount == 2) {
                pairs++;
                pairValue.push(pokerValue);
                if (value >= 11) {
                    pairJackOrBetter++;
                }
            }
            else if (amount == 3) {
                three++;
                threeValue = pokerValue;
            }
            else if (amount == 4) {
                four++;
                fourValue = pokerValue;
            }
            else if (value >= 11) {
                jackOrBetter++;
            }
            else {
                nothing++;
            }
        }


        var markValue = [15, 16];

        // 同花顺/皇家同花顺
        if (isStreight && isFlush) {
            if (pokers[0].value == 10) {
                result = Poker.ROYAL_FLUSH;
            }
            else {
                result = Poker.STREIGHT_FLUSH;
            }
        }
        // 同花(不可能出现对子、三张和四张的牌型)
        else if (isFlush) {
            result = Poker.FLUSH;
        }
        // 顺子(不可能出现对子、三张和四张的牌型)
        else if (isStreight) {
            result = Poker.STREIGHT;
        }
        // 四张
        // Joker可以升级为 LUCKY5牌型
        else if (four > 0) {
            markValue.push(fourValue);

            if (jokerAmount > 0) {
                result = Poker.LUKCY5;
            }
            else {
                result = Poker.FOUR_OF_A_KIND;
            }
        }
        // 三张
        // 两张鬼升级为 LUCKY5牌型
        // 一张鬼升级为 四张牌型
        // 否则只剩下：葫芦/三张
        else if (three > 0) {
            markValue.push(threeValue);

            if (jokerAmount == 2) {
                result = Poker.LUKCY5;
            }
            else if (jokerAmount == 1) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (pairs > 0) {
                result = Poker.FULL_HOUSE;

                markValue = markValue.concat(pairValue);
            }
            else {
                result = Poker.THREE_OF_A_KIND;
            }
        }
        // 两对
        // 鬼牌升级为 葫芦
        else if (pairs >= 2) {
            markValue = markValue.concat(pairValue);

            if (jokerAmount > 0) {
                result = Poker.FULL_HOUSE;
            }
            else {
                result = Poker.TWO_PAIR;
            }
        }
        // 一对
        // 两张鬼升级为 四张
        // 一张鬼升级为 三张
        // 否则剩下 JackOrBetter
        else if (pairs >= 1) {
            markValue = markValue.concat(pairValue);

            if (jokerAmount == 2) {
                result = Poker.FOUR_OF_A_KIND;
            }
            else if (jokerAmount == 1) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (pairJackOrBetter > 0) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }
        // 单张
        // 两张鬼升级为 三张
        // 一张鬼升级为 JackOrBetter  HighCardValue >= Jack
        else {
            markValue.push(highValue);
            if (jokerAmount == 2) {
                result = Poker.THREE_OF_A_KIND;
            }
            else if (jokerAmount == 1 && highValue > 10) {
                result = Poker.ONE_PAIR;
            }
            else {
                result = Poker.NOTHING;
            }
        }

        var markPokers = [ false, false, false, false, false ];
        for (i = 0; i < 5; i++) {
            var poker = handPokers[i];

            switch (result) {
                case Poker.LUKCY5:
                case Poker.ROYAL_FLUSH:
                case Poker.STREIGHT_FLUSH:
                case Poker.FLUSH:
                case Poker.FULL_HOUSE:
                case Poker.STREIGHT:
                    markPokers[i] = true;
                    break;
                case Poker.FOUR_OF_A_KIND:
                case Poker.THREE_OF_A_KIND:
                case Poker.TWO_PAIR:
                case Poker.ONE_PAIR:
                    if (markValue.indexOf(poker.value) != -1) {
                        markPokers[i] = true;
                    }
                    break;
                case Poker.NOTHING:
                default:
                    break;
            }
        }

        return {
            result: result,
            marks:  markPokers
        };
    };
}(Papaya.Lucky5));