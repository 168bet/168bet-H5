var FruitBox = (function(_super) {
    function FruitBox(fruitInfo) {
        FruitBox.super(this);

        this.name = fruitInfo.fruitName;
        this.multiple = fruitInfo.multiple;

        this.showType = FruitBox.SHOW_TYPE.ONLY_FRUIT;
        this.init();
    }

    Laya.class(FruitBox, "FruitBox", _super);

    FruitBox.prototype.init = function () {
        this.bigIcon.skin = "";
        this.middleIcon.skin = "";

        if (this.multiple > 1) {
            this.showType = FruitBox.SHOW_TYPE.HAVE_MULTIPLE;
        }
        else {
            this.showType = FruitBox.SHOW_TYPE.ONLY_FRUIT;
        }

        this.setFruitGray();
    };

    FruitBox.prototype.setFruitLighting = function () {
        switch (this.showType) {
            case FruitBox.SHOW_TYPE.HAVE_MULTIPLE: {
                this.middleIcon.skin = App.uiManager.getMiddleGlowFruitIconPath(this.name);
                break;
            }
            case FruitBox.SHOW_TYPE.ONLY_FRUIT: {
                this.bigIcon.skin = App.uiManager.getBigGlowFruitIconPath(this.name);
                break;
            }
        }
    };

    FruitBox.prototype.setFruitUnLight = function () {
        switch (this.showType) {
            case FruitBox.SHOW_TYPE.HAVE_MULTIPLE: {
                this.middleIcon.skin = App.uiManager.getMiddleFruitIconPath(this.name);
                break;
            }
            case FruitBox.SHOW_TYPE.ONLY_FRUIT: {
                this.bigIcon.skin = App.uiManager.getBigFruitIconPath(this.name);
                break;
            }
        }
    };

    FruitBox.prototype.setFruitGray = function () {
        switch (this.showType) {
            case FruitBox.SHOW_TYPE.HAVE_MULTIPLE: {
                this.middleIcon.skin = App.uiManager.getMiddleFruitGrayPath(this.name);
                break;
            }
            case FruitBox.SHOW_TYPE.ONLY_FRUIT: {
                this.bigIcon.skin = App.uiManager.getBigFruitGrayPath(this.name);
                break;
            }
        }
    };

    FruitBox.prototype.lightStoppedAction = function () {
        var rotaBy = RotateBy.create(0.05, 30);
        var rotaBy2 = RotateBy.create(0.05, -30);
        var rotaBy3 = RotateBy.create(0.05, 20);
        var rotaBy4 = RotateBy.create(0.05, -20);

        var seq = Sequence.create(rotaBy,rotaBy2, rotaBy2, rotaBy,rotaBy3,rotaBy4,rotaBy4,rotaBy3,DelayTime.create(0.3),
            rotaBy,rotaBy2, rotaBy2, rotaBy,rotaBy3,rotaBy4,rotaBy4,rotaBy3);


        switch (this.showType) {
            case FruitBox.SHOW_TYPE.HAVE_MULTIPLE: {
                App.actionManager.addAction(seq, this.middleIcon);
                break;
            }
            case FruitBox.SHOW_TYPE.ONLY_FRUIT: {
                App.actionManager.addAction(seq, this.bigIcon);
                break;
            }
        }
    };

    FruitBox.SHOW_TYPE = {
        ONLY_FRUIT: 1,
        HAVE_MULTIPLE: 2
    };

    return FruitBox;
}(FruitBoxUI));